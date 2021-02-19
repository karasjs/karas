import abbr from './abbr';
import Node from '../node/Node';
import $$type from '../util/$$type';
import util from '../util/util';
import inject from '../util/inject';

const { TYPE_VD, TYPE_GM, TYPE_CP } = $$type;

let { isNil, isFunction, isPrimitive, clone, extend } = util;
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
        if(!v) {
          return;
        }
        let k2 = k.slice(4);
        // 有id且变量里面传入了替换的值，值可为null，因为某些情况下空为自动
        if(v.id && vars.hasOwnProperty(v.id)) {
          let value = vars[v.id];
          // undefined和null意义不同
          if(value === undefined) {
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
                inject.error('parseJson vars is not exist: ' + v.id + ', ' + k + ', ' + list.slice(0, i).join('.'));
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
 * 即便library中的元素有children或library，在linkChild时将其link过去，parse递归会继续处理
 * @param item：library的一级孩子
 * @param hash：存放library的key/value引用
 */
function linkLibrary(item, hash) {
  let id = item.id;
  // library中一定有id，因为是一级，二级+特殊需求才会出现放开
  if(isNil(id)) {
    throw new Error('Library item miss id: ' + JSON.stringify(item));
  }
  else {
    hash[id] = item;
  }
}

/**
 * 链接child到library文件，
 * props需要是clone的，因为防止多个child使用同一个库文件
 * children则直接引用，无需担心多个使用同一个
 * library也需要带上，在library直接子元素还包含library时会用到
 * @param child
 * @param libraryItem
 */
function linkChild(child, libraryItem) {
  // 规定图层child只有init和动画，属性和子图层来自库
  child.tagName = libraryItem.tagName;
  child.props = clone(libraryItem.props);
  child.children = libraryItem.children;
  child.library = libraryItem.library;
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
    extend(props, init);
    // style特殊处理，防止被上面覆盖丢失原始值
    if(style) {
      extend(style, init.style);
      props.style = style;
    }
    // 删除以免二次解析
    child.init = null;
  }
}

function parse(karas, json, animateRecords, vars, hash = {}) {
  if(isPrimitive(json) || json instanceof Node) {
    return json;
  }
  if(Array.isArray(json)) {
    return json.map(item => {
      return parse(karas, item, animateRecords, vars, hash);
    });
  }
  // 先判断是否是个链接到库的节点，是则进行链接操作
  let libraryId = json.libraryId;
  if(!isNil(libraryId)) {
    let libraryItem = hash[libraryId];
    // 规定图层child只有init和动画，tagName和属性和子图层来自库
    if(libraryItem) {
      linkChild(json, libraryItem);
    }
    else {
      throw new Error('Link library miss id: ' + libraryId);
    }
    json.libraryId = null;
  }
  // 再判断是否有library形成一个新的作用域，会出现library下的library使得一个链接节点链接后出现library的情况
  let library = json.library;
  if(Array.isArray(library)) {
    hash = {};
    library.forEach(item => {
      linkLibrary(item, hash);
    });
    json.library = null;
  }
  let { tagName, props = {}, children = [], animate = [], __animateRecords } = json;
  if(!tagName) {
    throw new Error('Dom must have a tagName: ' + JSON.stringify(json));
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
      if(item && [TYPE_VD, TYPE_GM, TYPE_CP].indexOf(item.$$type) > -1) {
        return item;
      }
      return parse(karas, item, animateRecords, vars, hash);
    }));
  }
  if(__animateRecords) {
    vd.__animateRecords = __animateRecords;
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
