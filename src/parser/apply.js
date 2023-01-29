import inject from '../util/inject';
import util from '../util/util';
import Node from '../node/Node';
import Component from '../node/Component';

let { isNil, isFunction, isPrimitive, clone, extend } = util;

/**
 * 链接json中的某个child到library文件，
 * props需要是clone的，因为防止多个child使用同一个库文件
 * children则直接引用，无需担心多个使用同一个
 * library也需要带上，在library直接子元素还包含library时会用到
 * @param child
 * @param libraryItem
 */
function linkLibrary(child, libraryItem) {
  // 规定图层child只有init和动画，属性和子图层来自库
  child.tagName = libraryItem.tagName;
  child.props = clone(libraryItem.props) || {};
  child.children = libraryItem.children || [];
  if(libraryItem.vars && !child.vars) {
    child.vars = libraryItem.vars;
  }
  if(libraryItem.library) {
    child.library = libraryItem.library;
  }
  // 删除以免二次解析
  delete child.libraryId;
  let init = child.init;
  if(init) {
    let props = child.props;
    let style = props.style;
    extend(props, init);
    // style特殊处理，防止被上面覆盖丢失原始值
    if(style) {
      extend(style, init.style);
      props.style = style;
    }
    // 删除以免二次解析
    delete child.init;
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
function initLibrary(item, hash) {
  let id = item.id;
  // library中一定有id，因为是一级，二级+特殊需求才会出现放开
  if(isNil(id)) {
    throw new Error('Library item miss id: ' + JSON.stringify(item));
  }
  else {
    hash[id] = item;
  }
}

// 有library的json一级初始化library供链接前，可以替换library里的内容
function replaceLibraryVars(json, hash, vars) {
  // 新版同级vars语法，增加可以修改library子元素中递归子属性
  if(json.hasOwnProperty('vars')) {
    let slot = json.vars;
    delete json.vars;
    if(!Array.isArray(slot)) {
      slot = [slot];
    }
    slot.forEach(item => {
      let { id, member } = item;
      if(!Array.isArray(member)) {
        member = [member];
      }
      // library.xxx，需要>=2的长度，开头必须是library
      if(Array.isArray(member) && member.length > 1 && vars && vars.hasOwnProperty(id)) {
        if(member[0] === 'library') {
          let target = hash;
          for(let i = 1, len = member.length; i < len; i++) {
            let k = member[i];
            // 最后一个属性可以为空
            if(target.hasOwnProperty(k) || i === len - 1) {
              // 最后一个member表达式替换
              if(i === len - 1) {
                let v = vars[id];
                let old = target[k];
                // 支持函数模式和值模式
                if(isFunction(v)) {
                  v = v(old);
                }
                // 直接替换library的子对象，需补充id和tagName
                if(i === 1) {
                  target[k] = Object.assign({ id: old.id, tagName: old.tagName }, v);
                }
                // 替换library中子对象的一个属性直接赋值
                else {
                  target[k] = v;
                }
              }
              // 子属性继续下去
              else {
                target = target[k];
              }
            }
            else {
              inject.error('Library slot miss ' + k);
              return;
            }
          }
        }
      }
    });
  }
}

function replaceVars(json, vars) {
  // 新版vars语法
  if(json && json.hasOwnProperty('vars')) {
    let slot = json.vars;
    delete json.vars;
    if(!Array.isArray(slot)) {
      slot = [slot];
    }
    if(Array.isArray(slot)) {
      slot.forEach(item => {
        let { id, member } = item;
        if(!Array.isArray(member)) {
          member = [member];
        }
        // 排除特殊的library
        if(Array.isArray(member) && member.length && member[0] !== 'library' && vars && vars.hasOwnProperty(id)) {
          let target = json;
          for(let i = 0, len = member.length; i < len; i++) {
            let k = member[i];
            // 最后一个属性可以为空
            if(target.hasOwnProperty(k) || i === len - 1) {
              // 最后一个member表达式替换
              if(i === len - 1) {
                let v = vars[id];
                // undefined和null意义不同
                if(v === undefined) {
                  return;
                }
                // 支持函数模式和值模式
                if(isFunction(v)) {
                  v = v(target[k]);
                }
                target[k] = v;
              }
              else {
                target = target[k];
              }
            }
            else {
              inject.error('Slot miss ' + k);
              return;
            }
          }
        }
      });
    }
  }
}

// parse的options可以传总的duration等
function replaceAnimateOptions(options, opt) {
  ['iterations', 'fill', 'duration', 'direction', 'easing', 'fps', 'delay', 'endDelay', 'playbackRate', 'spfLimit'].forEach(k => {
    if(opt.hasOwnProperty(k)) {
      options[k] = opt[k];
    }
  });
}

function apply(json, opt, hash) {
  if(isPrimitive(json) || json instanceof Node || json instanceof Component) {
    return json;
  }
  if(Array.isArray(json)) {
    return json.map(item => apply(item, opt, hash));
  }
  // 先判断是否是个链接到库的节点，是则进行链接操作
  let libraryId = json.libraryId;
  if(!isNil(libraryId)) {
    let libraryItem = hash[libraryId];
    // 规定图层child只有init和动画，tagName和属性和子图层来自库
    if(libraryItem) {
      linkLibrary(json, libraryItem);
    }
    else {
      throw new Error('Link library miss id: ' + libraryId);
    }
  }
  // 再判断是否有library形成一个新的作用域，会出现library下的library使得一个链接节点链接后出现library的情况
  let library = json.library;
  if(Array.isArray(library)) {
    hash = {};
    library.forEach(item => initLibrary(item, hash));
    // 替换library插槽
    replaceLibraryVars(json, hash, opt.vars);
    delete json.library;
  }
  let { tagName, props = {}, children = [], animate = [] } = json;
  if(!tagName) {
    throw new Error('Dom must have a tagName: ' + JSON.stringify(json));
  }
  // 缩写src和font
  let src = props.src;
  if(/^#\d+$/.test(src)) {
    let imgs = opt.imgs, i = parseInt(src.slice(1));
    if(Array.isArray(imgs)) {
      props.src = imgs[i];
    }
  }
  let style = props.style;
  if(style) {
    let fontFamily = style.fontFamily;
    if(/^#\d+$/.test(fontFamily)) {
      let fonts = opt.fonts, i = parseInt(fontFamily.slice(1));
      if(Array.isArray(fonts)) {
        style.fontFamily = fonts[i];
      }
    }
    // 先替换style的
    replaceVars(style, opt.vars);
  }
  // 再替换静态属性，style也作为属性的一种
  replaceVars(props, opt.vars);
  // 替换children里的内容，如文字，无法直接替换tagName/props/children/animate本身，因为下方用的还是原引用
  replaceVars(json, opt.vars);
  json.children = apply(children, opt, hash);
  if(animate) {
    if(!Array.isArray(animate)) {
      animate = [animate];
    }
    animate.forEach(item => {
      let { value, options } = item;
      // 忽略空动画
      if(Array.isArray(value) && value.length) {
        value.forEach(item => {
          replaceVars(item, opt.vars);
        });
      }
      if(options) {
        replaceVars(options, opt.vars);
        replaceAnimateOptions(options, opt);
      }
    });
  }
  return json;
}

// 将library、vars应用于json，转换json为一个普通的原始json数据
export default function(json, options = {}) {
  // 特殊单例声明无需clone加速解析
  if(!options.singleton && !json.singleton) {
    json = util.clone(json);
  }
  return apply(json, options, {});
}
