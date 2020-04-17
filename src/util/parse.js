import util from './util';
import abbr from './abbr';

let { isNil, isBoolean, isFunction, isString, isNumber, clone } = util;
let { abbrCssProperty, abbrAnimateOption, abbrAnimate } = abbr;

function isPrimitive(v) {
  return isNil(v) || isBoolean(v) || isString(v) || isNumber(v);
}

/**
 * 还原缩写到全称，涉及样式和动画属性
 * @param target 还原的对象
 * @param hash 缩写映射
 */
function abbr2full(target, hash) {
  // 也许节点没写样式
  if(target) {
    Object.keys(target).forEach(k => {
      // var-attr格式特殊考虑，仅映射attr部分，var-还要保留
      if(k.indexOf('var-') === 0) {
        let k2 = k.slice(4);
        if(hash.hasOwnProperty(k2)) {
          let fk = hash[k2];
          target['var-' + fk] = target[k];
          delete target[k];
        }
      }
      // 普通样式缩写还原
      else if(hash.hasOwnProperty(k)) {
        let fk = hash[k];
        target[fk] = target[k];
        delete target[k];
      }
    });
  }
}

function replaceVars(target, vars) {
  if(target && vars) {
    Object.keys(target).forEach(k => {
      if(k.indexOf('var-') === 0) {
        let v = target[k];
        let k2 = k.slice(4);
        // 有id且变量里面传入了替换的值
        if(v.id && vars.hasOwnProperty(v.id)) {
          let value = vars[v.id];
          if(isNil(v)) {
            return;
          }
          // 如果有.则特殊处理子属性
          if(k2.indexOf('.') > -1) {
            let list = k2.split('.');
            let len = list.length;
            for(let i = 0; i < len - 1; i++) {
              k2 = list[i];
              // 避免异常
              if(target[k2]) {
                target = target[k2];
              }
              else {
                console.error('parseJson vars is not exist: ' + v.id + ', ' + k + ', ' + list.slice(0, i).join('.'));
              }
            }
            k2 = list[len - 1];
          }
          // 支持函数模式和值模式
          if(isFunction(value)) {
            value = value(v);
          }
          target[k2] = value;
        }
      }
    });
  }
}

function parseJson(karas, json, animateList, vars) {
  if(isPrimitive(json)) {
    return json;
  }
  let { tagName, props = {}, children = [], animate } = json;
  let style = props.style;
  abbr2full(style, abbrCssProperty);
  // 先替换style的
  replaceVars(style, vars);
  // 再替换静态属性，style也作为属性的一种，目前尚未被设计为被替换
  replaceVars(props, vars);
  // 替换children里的内容，如文字，无法直接替换tagName/props/children/animate本身，因为下方用的还是原引用
  replaceVars(json, vars);
  let vd;
  if(tagName.charAt(0) === '$') {
    vd = karas.createGm(tagName, props);
  }
  else {
    vd = karas.createVd(tagName, props, children.map(item => parseJson(karas, item, animateList, vars)));
  }
  let animationRecord;
  if(animate) {
    if(Array.isArray(animate)) {
      let has;
      animate.forEach(item => {
        abbr2full(item, abbrAnimate);
        let { value, options } = item;
        // 忽略空动画
        if(Array.isArray(value) && value.length) {
          has = true;
          value.forEach(item => {
            abbr2full(item, abbrCssProperty);
            replaceVars(item, vars);
          });
        }
        if(options) {
          abbr2full(options, abbrAnimateOption);
          replaceVars(options, vars);
        }
      });
      if(has) {
        animationRecord = {
          animate,
          target: vd,
        };
      }
    }
    else {
      abbr2full(animate, abbrAnimate);
      let { value, options } = animate;
      if(Array.isArray(value) && value.length) {
        value.forEach(item => {
          abbr2full(item, abbrCssProperty);
          replaceVars(item, vars);
        });
        animationRecord = {
          animate,
          target: vd,
        };
      }
      if(options) {
        abbr2full(options, abbrAnimateOption);
        replaceVars(options, vars);
      }
    }
  }
  // 产生实际动画运行才存入列表供root调用执行
  if(animationRecord) {
    animateList.push(animationRecord);
  }
  return vd;
}

function linkLibrary(item, hash) {
  let { id, children } = item;
  if(Array.isArray(children)) {
    children.forEach(child => {
      // 排除原始类型文本
      if(!isPrimitive(child)) {
        let { libraryId } = child;
        // ide中库文件的child来自于库一定有libraryId，但是为了编程特殊需求，放开允许存入自定义数据
        if(!libraryId) {
          return;
        }
        if(!hash.hasOwnProperty(libraryId)) {
          linkLibrary(child, hash);
        }
        let libraryItem = hash[libraryId];
        // 规定图层child只有tagName、init和动画，属性和子图层来自库
        if(libraryItem) {
          linkChild(child, libraryItem);
        }
        else {
          throw new Error('Library item miss ID: ' + libraryId);
        }
      }
    });
  }
  hash[id] = item;
}

function linkChild(child, libraryItem) {
  // 规定图层child只有tagName（可选）、init和动画，属性和子图层来自库
  child.tagName = child.tagName || libraryItem.tagName;
  child.props = clone(libraryItem.props);
  child.children = libraryItem.children;
  linkInit(child);
}

function linkInit(child) {
  // 规定图层实例化的属性和样式在init上，优先使用init，然后才取原型链的props
  let { init } = child;
  if(init) {
    let props = child.props = child.props || {};
    let style = props.style;
    Object.assign(props, init);
    // style特殊处理，防止被上面覆盖丢失原始值
    if(style) {
      Object.assign(style, init.style);
      props.style = style;
    }
  }
}

function parse(karas, json, animateList, options) {
  let { library, children } = json;
  if(Array.isArray(library)) {
    let hash = {};
    // 强制要求library的文件是排好顺序的，即元件和被引用类型在前面，引用的在后面，另外没有循环引用
    library.forEach(item => {
      linkLibrary(item, hash);
    });
    if(Array.isArray(children)) {
      children.forEach(child => {
        if(!isPrimitive(child)) {
          let { libraryId } = child;
          // 没有引用的
          if(!libraryId) {
            return;
          }
          let libraryItem = hash[libraryId];
          // 规定图层child只有tagName（可选）、init和动画，属性和子图层来自库
          if(libraryItem) {
            linkChild(child, libraryItem);
          }
          else {
            throw new Error('Library miss ID: ' + libraryId);
          }
        }
      });
    }
  }
  linkInit(json);
  return parseJson(karas, json, animateList, options && options.vars);
}

export default parse;
