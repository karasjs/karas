import util from './util';
import abbr from './abbr';
import Node from '../node/Node';

let { isNil, isFunction, isPrimitive, clone } = util;
let { abbrCssProperty, abbrAnimateOption, abbrAnimate } = abbr;

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
          // delete target[k];
        }
      }
      // 普通样式缩写还原
      else if(hash.hasOwnProperty(k)) {
        let fk = hash[k];
        target[fk] = target[k];
        // 删除以免二次解析
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

/**
 * 遍历一遍library的一级，将一级的id存到hash上，无需递归二级，
 * 因为顺序前提要求排好且无循环依赖，所以被用到的一定在前面出现，
 * 一般是无children的元件在前，包含children的div在后
 * 只需将可能存在的children在遍历link一遍即可，如果children里有递归，前面因为出现过已经link过了
 * @param item：library的一级孩子
 * @param hash：存放library的key/value引用
 */
function linkLibrary(item, hash) {
  let { id, children } = item;
  if(Array.isArray(children)) {
    children.forEach(child => {
      // 排除原始类型文本
      if(!isPrimitive(child)) {
        let { libraryId } = child;
        // ide中库文件的child来自于库一定有libraryId，但是为了编程特殊需求，放开允许存入自定义数据
        if(isNil(libraryId)) {
          return;
        }
        let libraryItem = hash[libraryId];
        // 规定图层child只有init和动画，属性和子图层来自库
        if(libraryItem) {
          linkChild(child, libraryItem);
        }
        else {
          throw new Error('Link library item miss id: ' + libraryId);
        }
      }
    });
  }
  // library中一定有id，因为是一级，二级+特殊需求才会出现放开
  if(id) {
    hash[id] = item;
  }
  else {
    throw new Error('Library item miss id: ' + id);
  }
}

function linkChild(child, libraryItem) {
  // 规定图层child只有init和动画，属性和子图层来自库
  child.tagName = libraryItem.tagName;
  child.props = clone(libraryItem.props);
  child.children = libraryItem.children;
  // library的var-也要继承过来，本身的var-优先级更高，目前只有children会出现优先级情况
  Object.keys(libraryItem).forEach(k => {
    if(k.indexOf('var-') === 0 && !child.hasOwnProperty(k)) {
      child[k] = libraryItem[k];
    }
  });
  // 删除以免二次解析
  child.libraryId = null;
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
    // 删除以免二次解析
    child.init = null;
  }
}

function parse(karas, json, animateRecords, vars, hash) {
  if(isPrimitive(json) || json instanceof Node) {
    return json;
  }
  if(Array.isArray(json)) {
    return json.map(item => {
      return parse(karas, item, animateRecords, vars, hash);
    });
  }
  let { library, libraryId } = json;
  // 有library说明是个mc节点，不会有init/animate和children链接，是个正常节点
  if(Array.isArray(library)) {
    hash = {};
    // 强制要求library的文件是排好顺序的，即元件和被引用类型在前面，引用的在后面，
    // 另外没有循环引用，没有递归library，先遍历设置引用，再递归进行连接
    library.forEach(item => {
      linkLibrary(item, hash);
    });
    // 删除以免二次解析，有library一定没libraryId
    json.library = null;
    json.libraryId = null;
  }
  // ide中库文件的child一定有libraryId，有library时一定不会有libraryId
  else if(!isNil(libraryId) && hash) {
    let libraryItem = hash[libraryId];
    // 规定图层child只有init和动画，tagName和属性和子图层来自库
    if(libraryItem) {
      linkChild(json, libraryItem);
    }
    else {
      throw new Error('Link library miss id: ' + libraryId);
    }
  }
  let { tagName, props = {}, children = [], animate = [] } = json;
  if(!tagName) {
    throw new Error('Dom must have a tagName: ' + json);
  }
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
    vd = karas.createVd(tagName, props, children.map(item => {
      return parse(karas, item, animateRecords, vars, hash);
    }));
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
    animateRecords.push(animationRecord);
  }
  return vd;
}

export default parse;
