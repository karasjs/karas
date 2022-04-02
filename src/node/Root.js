import Dom from './Dom';
import Text from './Text';
import Xom from './Xom';
import Component from './Component';
import Defs from './Defs';
import Geom from './geom/Geom';
import builder from '../util/builder';
import updater from '../util/updater';
import util from '../util/util';
import domDiff from '../util/diff';
import css from '../style/css';
import unit from '../style/unit';
import geom from '../math/geom';
import enums from '../util/enums';
import inject from '../util/inject';
import Event from '../util/Event';
import frame from '../animate/frame';
import Controller from '../animate/Controller';
import mode from '../refresh/mode';
import change from '../refresh/change';
import level from '../refresh/level';
import struct from '../refresh/struct';
import reflow from '../refresh/reflow';
import vertex from '../gl/main.vert';
import fragment from '../gl/main.frag';
import vertexMask from '../gl/mask.vert';
import fragmentMask from '../gl/mask.frag';
import fragmentClip from '../gl/clip.frag';
import fragmentOverflow from '../gl/overflow.frag';
import vertexCm from '../gl/filter/cm.vert';
import fragmentCm from '../gl/filter/cm.frag';
import vertexDs from '../gl/filter/drops.vert'
import fragmentDs from '../gl/filter/drops.frag';
import webgl from '../gl/webgl';
import ca from '../gl/ca';
import TexCache from '../gl/TexCache';

const {
  STYLE_KEY: {
    TOP,
    RIGHT,
    BOTTOM,
    LEFT,
    POSITION,
    DISPLAY,
    VISIBILITY,
    COLOR,
    WIDTH,
    HEIGHT,
    Z_INDEX,
    MARGIN_TOP,
    MARGIN_LEFT,
    MARGIN_BOTTOM,
    PADDING_TOP,
    PADDING_LEFT,
    PADDING_BOTTOM,
    BORDER_TOP_WIDTH,
    BORDER_LEFT_WIDTH,
    BORDER_BOTTOM_WIDTH,
    POINTER_EVENTS,
  },
  UPDATE_KEY: {
    UPDATE_NODE,
    UPDATE_STYLE,
    UPDATE_KEYS,
    UPDATE_COMPONENT,
    UPDATE_FOCUS,
    UPDATE_OVERWRITE,
    UPDATE_LIST,
    UPDATE_CONFIG,
    UPDATE_ADD_DOM,
    UPDATE_REMOVE_DOM,
  },
  NODE_KEY: {
    NODE_TAG_NAME,
    NODE_CACHE_STYLE,
    NODE_CACHE_PROPS,
    NODE_CURRENT_STYLE,
    NODE_COMPUTED_STYLE,
    NODE_CURRENT_PROPS,
    NODE_DOM_PARENT,
    NODE_IS_MASK,
    NODE_REFRESH_LV,
    NODE_IS_DESTROYED,
    NODE_STYLE,
    NODE_UPDATE_HASH,
    NODE_UNIQUE_UPDATE_ID,
    NODE_CACHE,
    NODE_CACHE_TOTAL,
    NODE_CACHE_FILTER,
    NODE_CACHE_OVERFLOW,
    NODE_CACHE_MASK,
    NODE_STRUCT,
  },
  STRUCT_KEY: {
    STRUCT_INDEX,
    STRUCT_TOTAL,
    STRUCT_NODE,
  }
} = enums;
const DIRECTION_HASH = {
  [TOP]: true,
  [RIGHT]: true,
  [BOTTOM]: true,
  [LEFT]: true,
};
const { isNil, isObject, isFunction } = util;
const { AUTO, PX, PERCENT, INHERIT } = unit;
const { isRelativeOrAbsolute, equalStyle } = css;
const { contain, getLevel, isRepaint, NONE, FILTER, PERSPECTIVE, REPAINT, REFLOW, REBUILD } = level;
const { isIgnore, isGeom } = change;

const ROOT_DOM_NAME = {
  canvas: 'canvas',
  svg: 'svg',
  webgl: 'canvas',
};

function getDom(dom) {
  if(util.isString(dom) && dom) {
    let o = document.querySelector(dom);
    if(!o) {
      throw new Error('Can not find dom of selector: ' + dom);
    }
    return o;
  }
  if(!dom) {
    throw new Error('Can not find dom: ' + dom);
  }
  return dom;
}

function renderProp(k, v) {
  let s = Array.isArray(v) ? util.joinSourceArray(v) : util.stringify(v);
  if(k === 'className') {
    k = 'class';
  }
  else if(k === 'style') {
    return '';
  }
  return ' ' + k + '="' + util.encodeHtml(s, true) + '"';
}

const EVENT_LIST = ['click', 'dblclick', 'mousedown', 'mousemove', 'mouseup', 'touchstart', 'touchmove', 'touchend', 'touchcancel'];

function initEvent(dom, Root) {
  let list = [];
  EVENT_LIST.forEach(type => {
    function cb(e) {
      let root = dom.__root;
      if(root && root instanceof Root) {
        if(['touchend', 'touchcancel', 'touchmove'].indexOf(type) > -1) {
          let target = root.__touchstartTarget;
          let event = root.__wrapEvent(e);
          event.target = target;
          while(target) {
            target.__emitEvent(event, true);
            target = target.domParent;
          }
        }
        else {
          root.__cb(e);
        }
      }
    }
    dom.addEventListener(type, cb);
    list.push([type, cb]);
  });
  return list;
}

function removeEvent(dom, list) {
  list.forEach(item => {
    dom.removeEventListener(item[0], item[1]);
  });
}

// 提取出对比节点尺寸是否固定非AUTO
function isFixedWidthOrHeight(node, k) {
  let c = node.currentStyle[k];
  return c[1] !== AUTO;
}
// 除了固定尺寸，父级也不能是flex或变化flex
function isFixedSize(node, includeParentFlex) {
  let res = isFixedWidthOrHeight(node, WIDTH) && isFixedWidthOrHeight(node, HEIGHT);
  if(res && includeParentFlex) {
    let parent = node.domParent;
    if(parent) {
      if(parent.currentStyle[DISPLAY] === 'flex' || parent.computedStyle[DISPLAY] === 'flex') {
        return false;
      }
    }
  }
  return res;
}

function isLAYOUT(node) {
  return node.hasOwnProperty('__uniqueReflowId');
}

let __uniqueReflowId = 0;
function setLAYOUT(node, hash, component, addDom) {
  if(!node.hasOwnProperty('__uniqueReflowId')) {
    node.__uniqueReflowId = __uniqueReflowId;
    hash[__uniqueReflowId++] = {
      node,
      component,
      addDom,
    };
  }
}

/**
 * 单独提出共用检测影响的函数，从节点本身开始向上分析影响，找到最上层的影响节点设置其重新布局
 * 过程即__checkReflow中所提及的，各种情况
 * 将影响升至最近的父级节点，并添加布局标识，这样后面的深度遍历会以父级为准忽略本身
 * 如果最终是root，则返回true标识，直接整个重新开始布局
 * ====
 * addDom情况下的特殊影响检测，类似checkInfluence
 * 添加的是absolute则只影响自己，大部分交互游戏情况属于此类型优化
 * 添加的是inline/inlineBlock的话，影响最近非inline父节点
 * 父为flex则直接影响父节点，不管添加情况如何
 * 添加block/flex的话，上下都block/flex则只影响自己，否则还是影响父节点
 * 如果最终是root，则返回true标识，直接整个重新开始布局
 * @returns {boolean}
 */
function checkInfluence(root, reflowHash, node, component, addDom) {
  // add情况abs节点特殊对待不影响其它节点，不能判断display，因为inline会强制block
  if(addDom && node.currentStyle[POSITION] === 'absolute') {
    return;
  }
  let target = node;
  // inline新老都影响，节点变为最近的父非inline
  if(['inline', 'inlineBlock', 'inline-block'].indexOf(target.currentStyle[DISPLAY]) > -1
    || ['inline', 'inlineBlock', 'inline-block'].indexOf(target.computedStyle[DISPLAY]) > -1) {
    do {
      target = target.domParent;
      // 父到root提前跳出
      if(target === root) {
        return true;
      }
      // 父已有LAYOUT跳出防重
      if(isLAYOUT(target)) {
        return;
      }
      // 遇到absolute跳出，设置其布局；如果absolute不变化普通处理，如果absolute发生变化，一定会存在于列表中，不用考虑
      if(target.currentStyle[POSITION] === 'absolute' || target.computedStyle[POSITION] === 'absolute') {
        setLAYOUT(target, reflowHash, component, addDom);
        return;
      }
    }
    while(target && (['inline', 'inlineBlock', 'inline-block'].indexOf(target.currentStyle[DISPLAY]) > -1
      || ['inline', 'inlineBlock', 'inline-block'].indexOf(target.computedStyle[DISPLAY]) > -1));
    // target已不是inline，父固定宽高跳出直接父进行LAYOUT即可，不影响上下文，但不能是flex孩子，此时固定尺寸无用
    if(isFixedSize(target, true)) {
      setLAYOUT(target, reflowHash, component, addDom);
      return;
    }
  }
  // 此时target指向node，如果原本是inline则是其flow的非inline父
  let parent = target.domParent;
  // parent有LAYOUT跳出，已被包含
  if(isLAYOUT(parent)) {
    return;
  }
  // 向上检查flex，如果父级中有flex，以最上层的flex视作其更改，node本身flex不进入
  let topFlex;
  do {
    // 父已有LAYOUT跳出防重
    if(isLAYOUT(parent)) {
      return;
    }
    // flex相关，包含变化或不变化
    if(parent.computedStyle[DISPLAY] === 'flex' || parent.currentStyle[DISPLAY] === 'flex') {
      topFlex = parent;
    }
    // 遇到absolute跳出，如果absolute不变化普通处理，如果absolute发生变化，一定会存在于列表中，不用考虑
    if(parent.currentStyle[POSITION] === 'absolute' || parent.computedStyle[POSITION] === 'absolute') {
      break;
    }
    // 父固定宽高跳出
    if(isFixedSize(parent, true)) {
      break;
    }
    parent = parent.domParent;
  }
  while(parent);
  // 找到最上层flex，视作其更改
  if(topFlex) {
    target = topFlex;
  }
  if(target === root) {
    return true;
  }
  parent = target;
  // 向上检查非固定尺寸的absolute，找到则视为其变更，上面过程中一定没有出现absolute
  while(parent) {
    // 无论新老absolute，不变化则设置，变化一定会出现在列表中
    if(parent.currentStyle[POSITION] === 'absolute' || parent.computedStyle[POSITION] === 'absolute') {
      if(parent === root) {
        break;
      }
      // 固定尺寸的不用设置，需要跳出循环
      if(isFixedSize(parent)) {
        break;
      }
      else {
        setLAYOUT(parent, reflowHash, component, addDom);
        return;
      }
    }
    parent = parent.domParent;
  }
  // 向上查找了并且没提前跳出的target如果不等于自身则重新布局，自身外面设置过了
  if(target !== node) {
    setLAYOUT(target, reflowHash, component, addDom);
  }
  else if(addDom) {
    // 前后必须都是block，否则还是视为父布局
    let isSiblingBlock = true;
    let { prev, next } = node;
    if(prev && ['inline', 'inline-block', 'inlineBlock'].indexOf(prev.currentStyle[DISPLAY]) > -1) {
      isSiblingBlock = false;
    }
    else if(next && ['inline', 'inline-block', 'inlineBlock'].indexOf(next.currentStyle[DISPLAY]) > -1) {
      isSiblingBlock = false;
    }
    if(!isSiblingBlock) {
      target = node.domParent;
      if(target === root) {
        return true;
      }
      setLAYOUT(target, reflowHash, false, true);
    }
  }
}

let uniqueUpdateId = 0;
function parseUpdate(renderMode, root, target, reflowList, cacheHash, cacheList, zHash, zList) {
  let {
    [UPDATE_NODE]: node,
    [UPDATE_STYLE]: style,
    [UPDATE_OVERWRITE]: overwrite,
    [UPDATE_FOCUS]: focus,
    [UPDATE_COMPONENT]: component,
    [UPDATE_LIST]: list,
    [UPDATE_KEYS]: keys,
    [UPDATE_CONFIG]: __config,
    [UPDATE_ADD_DOM]: addDom,
    [UPDATE_REMOVE_DOM]: removeDom,
  } = target;
  if(__config[NODE_IS_DESTROYED]) {
    return;
  }
  // updateStyle()这样的调用需要覆盖原有样式，因为是按顺序遍历，后面的优先级自动更高不怕重复
  if(overwrite) {
    Object.assign(__config[NODE_STYLE], overwrite);
  }
  // 多次调用更新才会有list，一般没有，优化；component无需，因为多次都是它自己
  if(list && !component) {
    keys = (keys || []).slice(0); // 防止原始值被更改
    let hash = {};
    keys.forEach(k => {
      hash[k] = true;
    });
    list.forEach(item => {
      let { [UPDATE_STYLE]: style2, [UPDATE_OVERWRITE]: overwrite, [UPDATE_KEYS]: keys2 } = item;
      (keys2 || []).forEach(k2 => {
        if(!hash.hasOwnProperty(k2)) {
          hash[k2] = true;
          keys.push(k2);
        }
      });
      if(overwrite) {
        Object.assign(__config[NODE_STYLE], overwrite);
      }
      if(style2) {
        if(style) {
          Object.assign(style, style2);
        }
        else {
          style = style2;
        }
      }
    });
  }
  // 按节点合并完style后判断改变等级
  let {
    [NODE_TAG_NAME]: tagName,
    [NODE_CACHE_STYLE]: __cacheStyle,
    [NODE_CACHE_PROPS]: __cacheProps,
    [NODE_CURRENT_STYLE]: currentStyle,
    [NODE_COMPUTED_STYLE]: computedStyle,
    [NODE_CURRENT_PROPS]: currentProps,
    [NODE_DOM_PARENT]: domParent,
    [NODE_IS_MASK]: isMask,
  } = __config;
  let lv = focus || NONE;
  let hasZ, hasVisibility, hasColor, hasDisplay;
  // component无需遍历直接赋值，img重新加载等情况没有样式更新
  if(!component && style && keys) {
    for(let i = 0, len = keys.length; i < len; i++) {
      let k = keys[i];
      let v = style[k];
      // 只有geom的props和style2种可能
      if(node instanceof Geom && isGeom(tagName, k)) {
        if(!equalStyle(k, v, currentProps[k], node)) {
          lv |= REPAINT;
          __cacheProps[k] = undefined;
          currentProps[k] = v;
        }
      }
      else {
        // 需和现在不等，且不是pointerEvents这种无关的
        if(!equalStyle(k, v, currentStyle[k], node)) {
          // pointerEvents这种无关的只需更新
          if(isIgnore(k)) {
            __cacheStyle[k] = undefined;
            currentStyle[k] = v;
          }
          else {
            // TRBL变化只对relative/absolute起作用，其它忽视
            if(DIRECTION_HASH.hasOwnProperty(k)) {
              let position = currentStyle[POSITION];
              if(position !== 'relative' && position !== 'absolute') {
                delete style[k];
                continue;
              }
            }
            else if(k === DISPLAY) {
              hasDisplay = true;
            }
            // repaint细化等级，reflow在checkReflow()
            lv |= getLevel(k);
            // repaint置空，如果reflow会重新生成空的
            __cacheStyle[k] = undefined;
            currentStyle[k] = v;
            if(k === Z_INDEX && node !== root) {
              hasZ = true;
            }
            if(k === VISIBILITY) {
              hasVisibility = true;
            }
            if(k === COLOR) {
              hasColor = true;
            }
          }
        }
      }
    }
  }
  // 无任何改变处理的去除记录，如pointerEvents、无效的left
  // 但是perspective需考虑进来，虽然不影响自己但影响别人，要返回true表明有变更
  if(lv === NONE && !component) {
    delete __config[NODE_UNIQUE_UPDATE_ID];
    return;
  }
  // 由于父节点中有display:none，或本身节点也为none，执行普通动画是无效的，此时没有display变化
  if(computedStyle[DISPLAY] === 'none' && !hasDisplay) {
    return;
  }
  // 记录下来清除parent的zIndexChildren缓存
  if(hasZ && domParent) {
    delete domParent.__zIndexChildren;
  }
  // visibility/color变化，影响子继承
  if(hasVisibility || hasColor) {
    for(let __structs = root.__structs, __struct = node.__config[NODE_STRUCT], i = __struct[STRUCT_INDEX] + 1, len = i + __struct[STRUCT_TOTAL]; i < len; i++) {
      let {
        [STRUCT_NODE]: node,
        [STRUCT_TOTAL]: total,
      } = __structs[i];
      let __config = node.__config;
      let currentStyle = __config[NODE_CURRENT_STYLE];
      let need;
      // text的style指向parent，因此text一定变更
      if(hasVisibility && (node instanceof Text || currentStyle[VISIBILITY][1] === INHERIT)) {
        need = true;
      }
      if(hasColor && (node instanceof Text || currentStyle[COLOR][1] === INHERIT)) {
        need = true;
      }
      if(need) {
        __config[NODE_REFRESH_LV] |= REPAINT;
        if(node instanceof Xom) {
          node.clearCache();
        }
      }
      else {
        i += total || 0;
      }
    }
  }
  // mask需清除遮罩对象的缓存
  if(isMask) {
    let prev = node.prev;
    while(prev && (prev.isMask)) {
      prev = prev.prev;
    }
    if(prev && prev.__config[NODE_CACHE_MASK]) {
      prev.__config[NODE_CACHE_MASK].release();
    }
  }
  // 特殊情况，父节点display:none，子节点进行任意变更，应视为无效
  // 如果父节点由none变block，这里也return false，因为父节点会重新layout+render
  // 如果父节点由block变none，同上，所以只要current/computed里有none就return false
  let parent = domParent;
  if(hasDisplay && parent) {
    let __config = parent.__config;
    if(__config[NODE_CURRENT_STYLE][DISPLAY] === 'none' || __config[NODE_COMPUTED_STYLE][DISPLAY] === 'none') {
      computedStyle[DISPLAY] = 'none';
      return;
    }
  }
  // reflow/repaint相关的记录下来
  let isRp = !component && isRepaint(lv);
  if(isRp) {
    // zIndex变化需清空svg缓存
    if(hasZ && renderMode === mode.SVG) {
      lv |= REPAINT;
      domParent && cleanSvgCache(domParent);
    }
    // z改变影响struct局部重排，它的数量不会变因此不影响外围，此处先收集，最后统一对局部根节点进行更新
    if(hasZ && !component && zHash) {
      if(domParent && !domParent.hasOwnProperty('__uniqueZId')) {
        zHash[uniqueUpdateId] = true;
        domParent.__uniqueZId = uniqueUpdateId++;
        zList.push(domParent);
      }
    }
  }
  // reflow在root的refresh中做
  else {
    reflowList.push({
      node,
      style,
      component,
      addDom,
      removeDom,
    });
  }
  // 这里也需|运算，每次刷新会置0，但是如果父元素进行继承变更，会在此元素分析前更改，比如visibility，此时不能直接赋值
  __config[NODE_REFRESH_LV] |= lv;
  if(component || addDom || removeDom) {
    root.__rlv = REBUILD;
  }
  else {
    root.__rlv = Math.max(root.__rlv, lv);
  }
  // dom在>=REPAINT时total失效，svg的Geom比较特殊
  let need = lv >= REPAINT || renderMode === mode.SVG && node instanceof Geom;
  if(need) {
    if(__config[NODE_CACHE]) {
      __config[NODE_CACHE].release();
    }
  }
  // perspective也特殊只清空total的cache，和>=REPAINT清空total共用
  if(need || contain(lv, PERSPECTIVE)) {
    if(__config[NODE_CACHE_TOTAL]) {
      __config[NODE_CACHE_TOTAL].release();
    }
    if(__config[NODE_CACHE_MASK]) {
      __config[NODE_CACHE_MASK].release();
    }
    if(__config[NODE_CACHE_OVERFLOW]) {
      __config[NODE_CACHE_OVERFLOW].release();
    }
  }
  // 特殊的filter清除cache
  if((need || contain(lv, FILTER)) && __config[NODE_CACHE_FILTER]) {
    __config[NODE_CACHE_FILTER].release();
  }
  // 向上清除等级>=REPAINT的汇总缓存信息，过程中可能会出现重复，因此节点上记录一个临时标防止重复递归
  while(parent) {
    let __config = parent.__config;
    // 向上查找，出现重复跳出
    if(__config.hasOwnProperty(NODE_UNIQUE_UPDATE_ID)) {
      let id = __config[NODE_UNIQUE_UPDATE_ID];
      if(cacheHash.hasOwnProperty(id)) {
        break;
      }
      cacheHash[id] = true;
    }
    // 没有的需要设置一个标识
    else {
      cacheHash[uniqueUpdateId] = true;
      __config[NODE_UNIQUE_UPDATE_ID] = uniqueUpdateId++;
      cacheList.push(__config);
    }
    let lv = __config[NODE_REFRESH_LV];
    let need = lv >= REPAINT;
    if(need && __config[NODE_CACHE]) {
      __config[NODE_CACHE].release();
    }
    // 前面已经过滤了无改变NONE的，只要孩子有任何改变父亲就要清除
    if(__config[NODE_CACHE_TOTAL]) {
      __config[NODE_CACHE_TOTAL].release();
    }
    if(__config[NODE_CACHE_FILTER]) {
      __config[NODE_CACHE_FILTER].release();
    }
    if(__config[NODE_CACHE_MASK]) {
      __config[NODE_CACHE_MASK].release();
    }
    if(__config[NODE_CACHE_OVERFLOW]) {
      __config[NODE_CACHE_OVERFLOW].release();
    }
    parent = __config[NODE_DOM_PARENT];
  }
  return true;
}

function cleanSvgCache(node, child) {
  let __config = node.__config;
  if(child) {
    __config[NODE_REFRESH_LV] |= REPAINT;
  }
  else {
    __config[NODE_CACHE_TOTAL].release();
  }
  if(Array.isArray(node.children)) {
    node.children.forEach(child => {
      if(child instanceof Component) {
        child = child.shadowRoot;
      }
      if(!(child instanceof Text)) {
        cleanSvgCache(child, true);
      }
    });
  }
}

let uuid = 0;

class Root extends Dom {
  constructor(tagName, props, children) {
    super(tagName, props);
    this.__cd = children || []; // 原始children，再初始化过程中生成真正的dom
    this.__dom = null; // 真实DOM引用
    this.__mw = 0; // 记录最大宽高，防止尺寸变化清除不完全
    this.__mh = 0;
    // this.__scx = 1; // 默认缩放，css改变canvas/svg缩放后影响事件坐标，有值手动指定，否则自动计算
    // this.__scy = 1;
    this.__taskUp = [];
    this.__taskCp = [];
    this.__ref = {};
    this.__reflowList = [{ node: this }]; // 初始化填自己，第一次布局时复用逻辑完全重新布局
    this.__animateController = new Controller();
    Event.mix(this);
    this.__config[NODE_UPDATE_HASH] = this.__updateHash = {};
    this.__uuid = uuid++;
    this.__rlv = REBUILD; // 每次刷新最大lv
  }

  __initProps() {
    let w = this.props.width;
    if(!isNil(w)) {
      let value = parseFloat(w) || 0;
      if(value > 0) {
        this.__width = value;
      }
    }
    let h = this.props.height;
    if(!isNil(h)) {
      let value = parseFloat(h) || 0;
      if(value > 0) {
        this.__height = value;
      }
    }
  }

  __genHtml(domName) {
    let res = `<${domName}`;
    // 拼接处理属性
    Object.keys(this.props).forEach(k => {
      let v = this.props[k];
      // 忽略事件
      if(!/^on[a-zA-Z]/.test(k)) {
        res += renderProp(k, v);
      }
    });
    res += `></${domName}>`;
    return res;
  }

  __wrapEvent(e) {
    let x, y;
    // 触摸结束取消特殊没有touches
    if(['touchend', 'touchcancel'].indexOf(e.type) === -1) {
      let { dom, __scx, __scy } = this;
      let { x: x2, y: y2, left, top, width, height } = dom.getBoundingClientRect();
      x = x2 || left || 0;
      y = y2 || top || 0;
      let { clientX, clientY } = e.touches ? e.touches[0] : e;
      x = clientX - x;
      y = clientY - y;
      // 外边的scale影响元素事件响应，根据倍数计算真实的坐标，优先手动指定，否则自动计算
      if(!isNil(__scx)) {
        x /= __scx;
      }
      else {
        x *= this.width / width;
      }
      if(!isNil(__scy)) {
        y /= __scy;
      }
      else {
        y *= this.height / height;
      }
    }
    return {
      event: e,
      stopPropagation() {
        this.__stopPropagation = true;
        e.stopPropagation();
      },
      stopImmediatePropagation() {
        this.__stopPropagation = true;
        this.__stopImmediatePropagation = true;
        e.stopImmediatePropagation();
      },
      preventDefault() {
        e.preventDefault();
      },
      x,
      y,
      __hasEmitted: false,
    };
  }

  // 类似touchend/touchcancel/touchmove这种无需判断是否发生于元素上，直接响应
  __cb(e) {
    if(e.type === 'touchmove' && !this.__touchstartTarget) {
      return;
    }
    let data = this.__wrapEvent(e);
    this.__emitEvent(data);
    return data;
  }

  /**
   * 添加到真实Dom上，优先已存在的同名canvas/svg节点，没有则dom下生成新的
   * @param dom
   */
  appendTo(dom) {
    dom = getDom(dom);
    this.__children = builder.initRoot(this.__cd, this);
    this.__initProps();
    this.__root = this;
    let tagName = this.tagName;
    let domName = ROOT_DOM_NAME[tagName];
    // OffscreenCanvas兼容，包含worker的
    if(typeof window !== 'undefined' && window.OffscreenCanvas && (dom instanceof window.OffscreenCanvas)
      || typeof self !== 'undefined' && self.OffscreenCanvas && (dom instanceof self.OffscreenCanvas)) {
      this.__dom = dom;
      this.__width = dom.width;
      this.__height = dom.height;
    }
    // 已有root节点
    else if(dom.nodeName.toLowerCase() === domName) {
      this.__dom = dom;
      if(this.width) {
        dom.setAttribute('width', this.width);
      }
      if(this.height) {
        dom.setAttribute('height', this.height);
      }
    }
    // 没有canvas/svg节点则生成一个新的
    else {
      this.__dom = dom.querySelector(domName);
      if(!this.__dom) {
        dom.innerHTML = this.__genHtml(domName);
        this.__dom = dom.querySelector(domName);
      }
    }
    this.__defs = this.dom.__defs || Defs.getInstance(this.__uuid);
    // 没有设置width/height则采用css计算形式
    if(!this.width || !this.height) {
      let domCss = window.getComputedStyle(dom, null);
      if(!this.width) {
        this.__width = parseFloat(domCss.getPropertyValue('width')) || 0;
        dom.setAttribute('width', this.width);
      }
      if(!this.height) {
        this.__height = parseFloat(domCss.getPropertyValue('height')) || 0;
        dom.setAttribute('height', this.height);
      }
    }
    // 最终无宽高给出警告
    if(!this.width || !this.height) {
      inject.warn('Karas render target with a width or height of 0.')
    }
    let params = Object.assign({}, ca, this.props.contextAttributes);
    // 只有canvas有ctx，svg用真实dom
    if(this.tagName === 'canvas') {
      this.__ctx = this.__dom.getContext('2d', params);
      this.__renderMode = mode.CANVAS;
    }
    else if(this.tagName === 'svg') {
      this.__renderMode = mode.SVG;
    }
    else if(this.tagName === 'webgl') {
      let gl = this.__ctx = this.__dom.getContext('webgl', params);
      this.__renderMode = mode.WEBGL;
      gl.program = webgl.initShaders(gl, vertex, fragment);
      gl.programMask = webgl.initShaders(gl, vertexMask, fragmentMask);
      gl.programClip = webgl.initShaders(gl, vertexMask, fragmentClip);
      gl.programOverflow = webgl.initShaders(gl, vertexMask, fragmentOverflow);
      gl.programCm = webgl.initShaders(gl, vertexCm, fragmentCm);
      gl.programDs = webgl.initShaders(gl, vertexDs, fragmentDs);
      gl.useProgram(gl.program);
      // 第一次渲染生成纹理缓存管理对象，收集渲染过程中生成的纹理并在gl纹理单元满了时进行绘制和清空，减少texImage2d耗时问题
      const MAX_TEXTURE_IMAGE_UNITS = Math.min(16, gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS));
      this.__texCache = new TexCache(MAX_TEXTURE_IMAGE_UNITS);
    }
    this.refresh(null, true);
    // 第一次节点没有__root，渲染一次就有了才能diff
    if(this.dom.__root && this.dom.__root instanceof Root) {
      this.dom.__root.destroy();
    }
    this.__eventCbList = initEvent(this.dom, Root);
    this.dom.__root = this;
  }

  refresh(cb, isFirst) {
    this.__hookTask = null;
    let { isDestroyed, renderMode, ctx, defs, width, height } = this;
    if(isDestroyed) {
      return;
    }
    defs.clear();
    // 首次递归测量整树的继承，后续更改各自更新机制做，防止每次整树遍历；root检查首次直接做，后续在checkUpdate()中插入
    if(isFirst) {
      this.__checkRoot(renderMode, width, height);
    }
    // 非首次刷新如果没有更新则无需继续
    else if(!this.__checkUpdate(renderMode, ctx, width, height)) {
      return;
    }
    this.__checkReflow(width, height);
    if(renderMode === mode.CANVAS && !this.props.noRender) {
      this.__clear(ctx, renderMode);
      struct.renderCanvas(renderMode, ctx, this);
    }
    // svg的特殊diff需要
    else if(renderMode === mode.SVG && !this.props.noRender) {
      struct.renderSvg(renderMode, defs, this, isFirst);
      let nvd = this.virtualDom;
      nvd.defs = defs.value;
      if(this.dom.__vd) {
        // console.log(this.dom.__vd);
        // console.log(nvd);
        domDiff(this.dom, this.dom.__vd, nvd);
      }
      else {
        this.dom.innerHTML = util.joinVirtualDom(nvd);
      }
      this.dom.__vd = nvd;
      this.dom.__defs = defs;
    }
    else if(renderMode === mode.WEBGL && !this.props.noRender) {
      this.__clear(ctx, renderMode);
      struct.renderWebgl(renderMode, ctx, this);
    }
    // 特殊cb，供小程序绘制完回调使用
    if(isFunction(cb)) {
      cb();
    }
    this.emit(Event.REFRESH, this.__rlv);
    this.__rlv = NONE;
  }

  destroy() {
    this.__destroy();
    this.animateController.__destroy();
    let n = this.dom;
    if(n) {
      removeEvent(n, this.__eventCbList || []);
      n.__root = null;
    }
    let gl = this.ctx;
    if(this.__texCache && gl) {
      this.__texCache.release(gl);
      if(gl.program) {
        gl.deleteShader(gl.program.vertexShader);
        gl.deleteShader(gl.program.fragmentShader);
        gl.deleteProgram(gl.program);
      }
      if(gl.programMask) {
        gl.deleteShader(gl.programMask.vertexShader);
        gl.deleteShader(gl.programMask.fragmentShader);
        gl.deleteProgram(gl.programMask);
      }
      if(gl.programOverflow) {
        gl.deleteShader(gl.programOverflow.vertexShader);
        gl.deleteShader(gl.programOverflow.fragmentShader);
        gl.deleteProgram(gl.programOverflow);
      }
    }
  }

  scale(x = 1, y = x) {
    this.__scx = x;
    this.__scy = y;
  }

  resize(w, h, cb) {
    let self = this;
    if(w !== self.width || h !== self.height) {
      self.__width = w;
      self.__height = h;
      self.updateStyle({
        width: w,
        height: h,
      }, cb);
    }
    else if(isFunction(cb)) {
      cb(-1);
    }
  }

  addRefreshTask(cb) {
    let { taskUp, isDestroyed } = this;
    if(isDestroyed) {
      return;
    }
    // 第一个添加延迟侦听，后续放队列等待一并执行
    if(!taskUp.length) {
      let clone;
      frame.nextFrame({
        __before: diff => {
          if(this.isDestroyed) {
            return;
          }
          clone = taskUp.splice(0);
          // 前置一般是动画计算此帧样式应用，然后刷新后出发frame事件，图片加载等同
          if(clone.length) {
            clone.forEach((item, i) => {
              if(isObject(item) && isFunction(item.__before)) {
                item.__before(diff);
              }
            });
          }
        },
        __after: diff => {
          if(this.isDestroyed) {
            return;
          }
          clone.forEach(item => {
            if(isObject(item) && isFunction(item.__after)) {
              item.__after(diff);
            }
            else if(isFunction(item)) {
              item(diff);
            }
          });
        }
      });
      this.__frameHook();
    }
    if(taskUp.indexOf(cb) === -1) {
      taskUp.push(cb);
    }
  }

  addForceRefreshTask(cb) {
    this.__hasRootUpdate = true;
    this.addRefreshTask(cb);
  }

  delRefreshTask(cb) {
    if(!cb) {
      return;
    }
    let { taskUp } = this;
    for(let i = 0, len = taskUp.length; i < len; i++) {
      if(taskUp[i] === cb) {
        taskUp.splice(i, 1);
        break;
      }
    }
  }

  /**
   * 为component的setState更新专门开辟个独立的流水线，root/frame中以taskCp存储更新列表
   * 普通的动画、img加载等都走普通的refresh的task，component走这里，frame中的结构同样
   * 在frame的每帧调用中，先执行普通的动画task，再执行component的task
   * 这样动画执行完后，某个cp的sr及子节点依旧先进行了动画变更，进入__addUpdate()环节
   * 然后此cp再更新sr及子节点，这样会被__addUpdate()添加到尾部，依赖目前浏览器默认实现
   * 上一行cp更新过程中是updater.check()进行的，如果有新老交换且有动画，动画的assigning是true，进行继承
   * root刷新parseUpdate()时，老的sr及子节点先进行，随后新的sr后进行且有component标识，sr子节点不会有更新
   * @param cb
   */
  addRefreshCp(cb) {
    let { taskCp, isDestroyed } = this;
    if(isDestroyed) {
      return;
    }
    // 每次只执行1次
    if(!taskCp.length) {
      let clone;
      frame.__nextFrameCp({
        __before: diff => {
          if(this.isDestroyed) {
            return;
          }
          clone = taskCp.splice(0);
          if(clone.length) {
            clone.forEach(item => {
              item.__before(diff);
            });
            updater.check(this);
            let len = updater.updateList.length;
            if(len) {
              updater.updateList.forEach(cp => {
                let root = cp.root; // 多个root并存时可能cp的引用不相同，需分别获取
                let sr = cp.shadowRoot;
                // 可能返回text，需视为其parentNode
                if(sr instanceof Text) {
                  sr = sr.domParent;
                }
                let res = {};
                res[UPDATE_NODE] = sr;
                res[UPDATE_STYLE] = sr.currentStyle;
                res[UPDATE_FOCUS] = REFLOW;
                res[UPDATE_COMPONENT] = cp;
                res[UPDATE_CONFIG] = sr.__config;
                this.__addUpdate(sr, sr.__config, root, root.__config, res);
              });
            }
          }
        },
        __after: diff => {
          if(this.isDestroyed) {
            return;
          }
          clone.forEach(item => {
            item.__after(diff);
          });
          // 触发didUpdate
          updater.did();
        },
      });
      this.__frameHook();
    }
    if(taskCp.indexOf(cb) === -1) {
      taskCp.push(cb);
    }
  }

  getTargetAtPoint(x, y, includeIgnore) {
    function scan(vd, x, y, path, zPath) {
      let { __sx1, __sy1, offsetWidth, offsetHeight, matrixEvent, children, zIndexChildren,
        computedStyle: { [DISPLAY]: display, [POINTER_EVENTS]: pointerEvents } } = vd;
      if(!includeIgnore && display === 'none') {
        return;
      }
      if(Array.isArray(zIndexChildren)) {
        for(let i = 0, len = children.length; i < len; i++) {
          children[i].__index__ = i;
        }
        for(let i = zIndexChildren.length - 1; i >= 0; i--) {
          let item = zIndexChildren[i];
          if(item instanceof karas.Text) {
            continue;
          }
          let path2 = path.slice();
          path2.push(item.__index__);
          let zPath2 = zPath.slice();
          zPath2.push(i);
          let res = scan(item, x, y, path2, zPath2);
          if(res) {
            return res;
          }
        }
      }
      if(!includeIgnore && pointerEvents === 'none') {
        return;
      }
      let inThis = geom.pointInQuadrilateral(
        x, y,
        __sx1, __sy1,
        __sx1 + offsetWidth, __sy1,
        __sx1 + offsetWidth, __sy1 + offsetHeight,
        __sx1, __sy1 + offsetHeight,
        matrixEvent
      );
      if(inThis) {
        return {
          target: vd,
          path,
          zPath,
        };
      }
    }
    return scan(this, x, y, [], []);
  }

  /**
   * 每次刷新前检查root节点的样式，有些固定的修改无效，有些继承的作为根初始化
   * @param renderMode
   * @param width
   * @param height
   * @private
   */
  __checkRoot(renderMode, width, height) {
    let { dom, currentStyle, computedStyle } = this;
    // canvas/svg作为根节点一定是block或flex，不会是inline
    if(['flex', 'block'].indexOf(currentStyle[DISPLAY]) === -1) {
      computedStyle[DISPLAY] = currentStyle[DISPLAY] = 'block';
    }
    // 同理position不能为absolute
    if(currentStyle[POSITION] === 'absolute') {
      computedStyle[POSITION] = currentStyle[POSITION] = 'static';
    }
    // 根节点满宽高
    currentStyle[WIDTH] = [width, PX];
    currentStyle[HEIGHT] = [height, PX];
    computedStyle[WIDTH] = width;
    computedStyle[HEIGHT] = height;
    // 可能调用resize()导致变更，要重设，canvas无论离屏与否都可使用直接赋值，svg则按dom属性api
    if(renderMode === mode.CANVAS || renderMode === mode.WEBGL) {
      if(dom.width !== width) {
        dom.width = width;
      }
      if(dom.height !== height) {
        dom.height = height;
      }
    }
    else if(renderMode === mode.SVG) {
      dom.setAttribute('width', width);
      dom.setAttribute('height', height);
    }
  }

  /**
   * 添加更新入口，按节点汇总更新信息
   * @private
   */
  __addUpdate(node, nodeConfig, root, rootConfig, o) {
    let updateHash = rootConfig[NODE_UPDATE_HASH];
    // root特殊处理，检查变更时优先看继承信息
    if(node === root) {
      updateHash = root.__updateRoot;
      if(updateHash) {
        if(o[UPDATE_FOCUS]) {
          updateHash[UPDATE_FOCUS] |= o[UPDATE_FOCUS];
        }
        // 后续存在新建list上，需增加遍历逻辑
        if(o[UPDATE_STYLE]) {
          let list = updateHash[UPDATE_LIST] = updateHash[UPDATE_LIST] || [];
          list.push({
            [UPDATE_STYLE]: o[UPDATE_STYLE],
            [UPDATE_OVERWRITE]: o[UPDATE_OVERWRITE],
            [UPDATE_KEYS]: o[UPDATE_KEYS],
          });
        }
      }
      else {
        root.__updateRoot = o;
      }
    }
    else if(!nodeConfig.hasOwnProperty(NODE_UNIQUE_UPDATE_ID)) {
      nodeConfig[NODE_UNIQUE_UPDATE_ID] = uniqueUpdateId;
      // 大多数情况节点都只有一次更新，所以优化首次直接存在style上，后续存在list
      updateHash[uniqueUpdateId++] = o;
    }
    else if(updateHash.hasOwnProperty(nodeConfig[NODE_UNIQUE_UPDATE_ID])) {
      let target = updateHash[nodeConfig[NODE_UNIQUE_UPDATE_ID]];
      if(o[UPDATE_FOCUS]) {
        target[UPDATE_FOCUS] |= o[UPDATE_FOCUS];
      }
      // 后续存在新建list上，需增加遍历逻辑
      if(o[UPDATE_STYLE]) {
        let list = target[UPDATE_LIST] = target[UPDATE_LIST] || [];
        list.push({
          [UPDATE_STYLE]: o[UPDATE_STYLE],
          [UPDATE_OVERWRITE]: o[UPDATE_OVERWRITE],
          [UPDATE_KEYS]: o[UPDATE_KEYS],
        });
      }
    }
    else {
      inject.error('Update process miss uniqueUpdateId');
    }
  }

  /**
   * 除首次外每次刷新前检查更新列表，计算样式变化，以及测量信息
   * @private
   */
  __checkUpdate(renderMode, ctx, width, height) {
    let root = this;
    let reflowList = [];
    let cacheHash = {};
    let cacheList = [];
    let zHash = {};
    let zList = [];
    let updateRoot = root.__updateRoot;
    let updateHash = root.__updateHash;
    // 给个方式使得外部可以强制刷新
    let hasUpdate = root.__hasRootUpdate;
    root.__hasRootUpdate = false;
    // root更新特殊提前，因为有继承因素
    if(updateRoot) {
      root.__updateRoot = null;
      hasUpdate = parseUpdate(renderMode, root, updateRoot,
        reflowList, cacheHash, cacheList);
      // 此时做root检查，防止root出现继承等无效样式，或者发生resize()
      if(hasUpdate) {
        root.__checkRoot(renderMode, width, height);
      }
    }
    // 汇总处理每个节点，k是递增数字直接循环遍历
    let keys = Object.keys(updateHash);
    for(let i = 0, len = keys.length; i < len; i++) {
      let t = parseUpdate(renderMode, root, updateHash[keys[i]],
        reflowList, cacheHash, cacheList, zHash, zList);
      hasUpdate = hasUpdate || t;
    }
    // 先做一部分reset避免下面measureList干扰，cacheList的是专门收集新增的额外节点
    root.__reflowList = reflowList;
    uniqueUpdateId = 0;
    root.__updateHash = root.__config[NODE_UPDATE_HASH] = {};
    cacheList.forEach(__config => {
      delete __config[NODE_UNIQUE_UPDATE_ID];
    });
    // zIndex改变的汇总修改，防止重复操作
    zList.forEach(item => {
      if(item.hasOwnProperty('__uniqueZId')) {
        delete item.__uniqueZId;
        item.__updateStruct(root.__structs);
      }
    });
    // 做完清空留待下次刷新重来
    for(let i = 0, len = keys.length; i < len; i++) {
      delete updateHash[keys[i]][UPDATE_CONFIG][NODE_UNIQUE_UPDATE_ID];
    }
    return hasUpdate;
  }

  /**
   * 除首次外每次刷新前检查reflow列表，计算需要reflow的节点局部重新布局
   * 当一个元素absolute不变时，其变化不会影响父元素和兄弟元素，直接自己重新局部LAYOUT包含子节点
   * 当absolute发生改变时，其变化会影响父和兄弟，视作父重新布局
   * 当inline变化时，视为其最近block/flex父变化
   * 当block变化时，往上查找最上层flex视为其变化，如不是则影响后面兄弟offset和父resize
   * 当flex变化时，往上查找最上层flex视为其变化，如不是则影响所有递归子节点layout和父resize
   * 以上3种情况向上查找时遇到absolute父均提前跳出，并标记absolute父LAYOUT
   * 上面所有情况即便结束还得额外看是否处于absolute中，是还是标记absolute重新布局
   * 当relative只变化left/top/right/bottom时，自己重新layout
   * 检测节点时记录影响的所有节点，最终形成一棵或n棵局部树
   * 需要重新布局的记作LAYOUT，被兄弟影响只需偏移的记作OFFSET，OFFSET可能会重复变为LAYOUT
   * 上述情况倘若发生包含重复，去掉子树，因子树视为被包含的重新布局
   * 如果有从root开始的，直接重新布局像首次那样即可
   * 如果非root，所有树根按先根顺序记录下来，依次执行局部布局
   * =========================
   * addDom比较特殊，是向已有节点中添加新的节点，检查影响与普通domDiff变化不同
   * @private
   */
  __checkReflow(width, height) {
    let { __reflowList: reflowList } = this;
    if(!reflowList.length) {
      return;
    }
    let root = this;
    let uniqueList = [];
    let hasRoot;
    __uniqueReflowId = 0;
    let reflowHash = {};
    // 遍历检查发生布局改变的节点列表，此时computedStyle还是老的，currentStyle是新的
    for(let i = 0, len = reflowList.length; i < len; i++) {
      let item = reflowList[i];
      let { node, component, addDom, removeDom } = item;
      // root提前跳出，完全重新布局
      if(node === this) {
        hasRoot = true;
        break;
      }
      // 添加时如果是cp则node取sr来布局
      if(addDom && node instanceof Component) {
        node = node.shadowRoot;
      }
      // 每个节点生成唯一的布局识别id存入hash防止重复
      if(!node.hasOwnProperty('__uniqueReflowId')) {
        node.__uniqueReflowId = __uniqueReflowId;
        reflowHash[__uniqueReflowId++] = item;
      }
      // 每个节点都向上检查影响，以及是否从root开始完全重新，remove特殊对待，影响父节点视为普通父节点relay
      if(checkInfluence(root, reflowHash, node, component, addDom)) {
        hasRoot = true;
        if(addDom) {
          this.__zIndexChildren = null;
        }
        break;
      }
      // remove的要特殊对待，因为提前删除了父子兄弟关系，下面deepScan不会出现
      else if(removeDom) {
        uniqueList.push(item);
      }
    }
    __uniqueReflowId = 0;
    this.__reflowList = [];
    // 有root提前跳出
    if(hasRoot) {
      reflow.clearUniqueReflowId(reflowHash);
      // 布局分为两步，普通流和定位流，互相递归
      this.__layout({
        x: 0,
        y: 0,
        w: width,
        h: height,
      }, false, false);
      // 绝对布局需要从根开始保存相对坐标系的容器引用，并根据relative/absolute情况变更
      this.__layoutAbs(this, {
        x: 0,
        y: 0,
        w: width,
        h: height,
      });
      this.__structs = this.__structure(0, 0);
      return true;
    }
    /**
     * 修剪树，自顶向下深度遍历
     * LAYOUT节点作为局部根，其递归子节点无需重复任何操作，直接去重
     * OFFSET节点作为局部根，其递归子节点先执行任何操作，后续根节点再偏移一次
     */
    else {
      this.__deepScan(function(node, options) {
        if(node.hasOwnProperty('__uniqueReflowId')) {
          let o = reflowHash[node.__uniqueReflowId];
          options.uniqueList.push(o);
          // 返回true即可提前结束深度遍历，在reflowHash有记录时提前跳出，子节点交由上面逻辑执行
          return true;
        }
        // reflowHash没有记录则无返回继续递归执行
      }, { uniqueList });
      /**
       * 按顺序执行列表即可，上层LAYOUT先执行且停止递归子节点，上层OFFSET后执行等子节点先LAYOUT/OFFSET
       * 同级按先后顺序排列，过程中记录diff在结束后进行structs更新
       * 这里要注意margin合并的逻辑，因为最终都是block（flex等同），需要进行合并
       * 在处理一个block时，先判断是否是空block，同时看后面紧邻的有没有在uniqueList的下一个
       * 单独空block处理、2个相邻的非block处理直接可以进行判断
       * 中间的空block（即非空block的下一个是空block，且下一个不是最后一个），先记录下来list，合并后一并offset
       * 合并margin和Dom的逻辑一样，抽离共有方法
       **/
      let diffList = [];
      let diffI = 0;
      let mergeOffsetList = [];
      let __uniqueMergeOffsetId = 0;
      uniqueList.forEach(item => {
        let { node, component, addDom, removeDom } = item;
        // 重新layout的w/h数据使用之前parent暂存的，x使用parent，y使用prev或者parent的
        let cps = node.computedStyle, cts = node.currentStyle;
        let zIndex = cps[Z_INDEX], position = cps[POSITION], display = cps[DISPLAY];
        let isLastAbs = position === 'absolute';
        let isNowAbs = cts[POSITION] === 'absolute';
        let isLastNone = display === 'none';
        let isNowNone = cts[DISPLAY] === 'none';
        // none不可见布局无效可以无视
        if(isLastNone && isNowNone) {
          return;
        }
        let parent = node.domParent;
        let { __layoutData: { x, y, h }, width, computedStyle } = parent;
        let current = node;
        // cp的shadowRoot要向上到cp本身，考虑高阶组件在内到真正的顶层cp
        if(current.isShadowRoot) {
          current = current.hostRoot;
        }
        // y使用prev或者parent的，首个节点无prev，prev要忽略absolute的和display:none的
        let ref = current.prev;
        let hasFlowPrev;
        while(ref) {
          if(ref instanceof Text
            || (ref.computedStyle[POSITION] !== 'absolute' && ref.computedStyle[DISPLAY] !== 'none')) {
            y = ref.y + ref.outerHeight;
            hasFlowPrev = true;
            break;
          }
          ref = ref.prev;
        }
        // 找不到prev以parent为基准，找到则增加自身，排除remove
        if(!removeDom) {
          if(!hasFlowPrev) {
            y += computedStyle[MARGIN_TOP] + computedStyle[BORDER_TOP_WIDTH] + computedStyle[PADDING_TOP];
          }
          x += computedStyle[MARGIN_LEFT] + computedStyle[BORDER_LEFT_WIDTH] + computedStyle[PADDING_LEFT];
        }
        // 找到最上层容器，如果是组件的子节点，以sr为container，sr本身往上找
        let container = node;
        // remove的节点本身无需再次布局
        if(!removeDom) {
          if(isNowAbs) {
            container = container.domParent;
            while(container && container !== root) {
              if(isRelativeOrAbsolute(container)) {
                break;
              }
              // 不能用domParent，必须在组件环境内
              if(container.parent) {
                container = container.parent;
              }
              else if(container.host) {
                break;
              }
            }
            if(!container) {
              container = root;
            }
            // 由setState引发的要检查是cp自身还是更上层，如果cp被abs包含，那么node是cp的父亲，否则node是cp的sr
            // 而这种情况下传cp或node都一样，所以最终统一传node
            parent.__layoutAbs(container, parent.__layoutData, node);
            // 优先判断dom变更
            if(addDom) {
              let arr = parent.__modifyStruct(root, diffI);
              diffI += arr[1];
              diffList.push(arr);
              parent.__updateStruct(root.__structs);
              if(this.renderMode === mode.SVG) {
                cleanSvgCache(parent);
              }
              return;
            }
            // 前后都是abs无需偏移后面兄弟和parent调整，component变化节点需更新struct
            else if(isLastAbs) {
              if(component) {
                let arr = node.__modifyStruct(root, diffI);
                diffI += arr[1];
                diffList.push(arr);
                if((position !== cts[POSITION] && (position === 'static' || cts[POSITION] === 'static'))
                  || zIndex !== cts[Z_INDEX]) {
                  parent.__updateStruct(root.__structs);
                  if(this.renderMode === mode.SVG) {
                    cleanSvgCache(parent);
                  }
                }
              }
              else if(isLastNone || isNowNone) {
                node.__zIndexChildren = null;
                let arr = node.__modifyStruct(root, diffI);
                diffI += arr[1];
                diffList.push(arr);
              }
              return;
            }
            // 标识flow变abs，可能引发zIndex变更，重设struct和svg
            parent.__updateStruct(root.__structs);
            if(this.renderMode === mode.SVG) {
              cleanSvgCache(parent);
            }
          }
          // 现在是普通流，不管之前是啥直接布局，排除remove删除的
          else {
            node.__layout({
              x,
              y,
              w: width,
              h,
            }, false, false);
            y += node.outerHeight;
            if(component) {
              container = node;
            }
            else {
              container = container.domParent;
              while(container && container !== root) {
                if(isRelativeOrAbsolute(container)) {
                  break;
                }
                // 不能用domParent，必须在组件环境内
                if(container.parent) {
                  container = container.parent;
                }
                else if(container.host) {
                  break;
                }
              }
            }
            if(!container) {
              container = root;
            }
            // 防止geom
            if(node instanceof Dom) {
              node.__layoutAbs(container, {
                x,
                y,
                w: width,
                h,
              });
            }
          }
        }

        // 向上查找最近的parent是relative，需再次累加ox/oy，无需继续向上递归，因为parent已经递归包含了
        // 这样node重新布局后再次设置其使用parent的偏移
        let p = node;
        while(p && p !== root) {
          p = p.domParent;
          computedStyle = p.computedStyle;
          if(computedStyle[POSITION] === 'relative') {
            let { ox, oy } = p;
            ox && node.__offsetX(ox);
            oy && node.__offsetY(oy);
            break;
          }
        }

        // 向下调整next的flow位置，遇到重复LAYOUT的跳出等待其调用并处理其next，忽视掉abs，margin和abs在merge中做
        if(node.isShadowRoot) {
          node = node.hostRoot;
        }
        let next = node.next;
        while(next && !next.hasOwnProperty('__uniqueReflowId')) {
          if(next.computedStyle[POSITION] === 'absolute') {
            next = next.next;
            continue;
          }
          let { y: oy } = next;
          let diff = y - oy;
          if(diff) {
            while(next && !next.hasOwnProperty('__uniqueReflowId')) {
              let target = next;
              if(target instanceof Component) {
                target = target.shadowRoot;
              }
              let cs = target.computedStyle;
              if(cs[POSITION] !== 'absolute' && cs[DISPLAY] !== 'none') {
                target.__offsetY(diff, true, REPAINT);
              }
              next = next.next;
            }
          }
          break;
        }

        // 去重防止abs并记录parent，整个结束后按先序顺序进行margin合并以及偏移，注意忽略有display:none变block同时为absolute的
        if(!parent.hasOwnProperty('__uniqueMergeOffsetId') && !(isNowAbs && isLastNone)) {
          parent.__uniqueMergeOffsetId = __uniqueMergeOffsetId++;
          mergeOffsetList.push(parent);
        }

        // add和remove都需父节点重新生成struct，zIndexChildren已在对应api操作的before()侦听做了
        if(addDom || removeDom) {
          let arr = parent.__modifyStruct(root, diffI);
          diffI += arr[1];
          diffList.push(arr);
          if(this.renderMode === mode.SVG) {
            cleanSvgCache(parent);
          }
        }
        // component未知dom变化，所以强制重新struct，text则为其父节点，同时防止zIndex变更影响父节点
        else if(component) {
          let arr = node.__modifyStruct(root, diffI);
          diffI += arr[1];
          diffList.push(arr);
          if((position !== cts[POSITION] && (position === 'static' || cts[POSITION] === 'static'))
            || zIndex !== cts[Z_INDEX]) {
            node.domParent.__updateStruct(root.__structs);
            if(this.renderMode === mode.SVG) {
              cleanSvgCache(node.domParent);
            }
          }
        }
        // display有none变化，重置struct和zIndexChildren
        else if(isLastNone || isNowNone) {
          node.__zIndexChildren = null;
          let arr = node.__modifyStruct(root, diffI);
          diffI += arr[1];
          diffList.push(arr);
        }
      });
      /**
       * mergeMargin后续调整，记录的是变更节点的父节点，因此每个节点内部直接遍历孩子进行
       * 由于保持先根遍历的顺序，因此会从最上最里的节点开始，先进行margin合并
       * 由于之前忽略掉abs节点，因此再检查直接abs是否要调整
       * 完成后对此父节点的后续兄弟节点进行调整，多次不会干扰影响
       * 然后继续往上循环，直到root结束
       */
      let inDirectAbsList = [];
      mergeOffsetList.forEach(parent => {
        delete parent.__uniqueMergeOffsetId;
        let flowChildren = parent.flowChildren, absChildren = parent.absChildren;
        let mergeMarginBottomList = [], mergeMarginTopList = [];
        let length = flowChildren.length, lastChild;
        let isStart, startIndex, startNode;
        // 遍历flow孩子，从开始变化的节点开始，看变化造成的影响，对其后面节点进行偏移，并统计总偏移量
        for(let i = 0; i < length; i++) {
          let item = flowChildren[i];
          if(item instanceof Component) {
            item = item.shadowRoot;
          }
          let isXom = item instanceof Xom;
          // 忽略掉前面没有变更的节点，不能合并
          if(!isStart && isXom) {
            if(item.hasOwnProperty('__uniqueReflowId')) {
              isStart = true;
              startIndex = i;
              startNode = item;
            }
          }
          // 开始变更的节点，至少不是第0个
          let cs = isXom && item.currentStyle;
          let isInline = isXom && cs[DISPLAY] === 'inline';
          let isInlineBlock = isXom && ['inlineBlock', 'inline-block'].indexOf(cs[DISPLAY]) > -1;
          lastChild = item;
          // 每次循环开始前，这次不是block的话，看之前遗留的，可能是以空block结束，需要特殊处理，单独一个空block也包含
          if((!isXom || isInline || isInlineBlock)) {
            if(mergeMarginBottomList.length && mergeMarginTopList.length && isStart) {
              let diff = reflow.getMergeMarginTB(mergeMarginTopList, mergeMarginBottomList);
              if(diff) {
                for(let j = Math.max(startIndex, i - mergeMarginBottomList.length + 1); j < length; j++) {
                  flowChildren[j].__offsetY(diff, true, REPAINT);
                }
              }
            }
            mergeMarginTopList = [];
            mergeMarginBottomList = [];
          }
          // 和普通布局类似，只是不用重新布局只需处理合并margin再根据差值偏移
          if(isXom && !isInline) {
            let isNone = isXom && cs[DISPLAY] === 'none';
            let isEmptyBlock;
            if(!isNone && item.flowChildren && item.flowChildren.length === 0) {
              let {
                [MARGIN_TOP]: marginTop,
                [MARGIN_BOTTOM]: marginBottom,
                [PADDING_TOP]: paddingTop,
                [PADDING_BOTTOM]: paddingBottom,
                [HEIGHT]: height,
                [BORDER_TOP_WIDTH]: borderTopWidth,
                [BORDER_BOTTOM_WIDTH]: borderBottomWidth,
              } = item.computedStyle;
              // 无内容高度为0的空block特殊情况，记录2个margin下来等后续循环判断处理
              if(paddingTop <= 0 && paddingBottom <= 0 && height <= 0 && borderTopWidth <= 0 && borderBottomWidth <= 0) {
                mergeMarginBottomList.push(marginBottom);
                mergeMarginTopList.push(marginTop);
                isEmptyBlock = true;
              }
            }
            // 空block要留下轮循环看，除非是最后一个，非空本轮处理掉看是否要合并
            if(!isNone && !isEmptyBlock) {
              let { [MARGIN_TOP]: marginTop, [MARGIN_BOTTOM]: marginBottom } = item.computedStyle;
              // 有bottom值说明之前有紧邻的block，任意个甚至空block，自己有个top所以无需判断top
              // 如果是只有紧邻的2个非空block，也被包含在情况内，取上下各1合并
              if(mergeMarginBottomList.length) {
                mergeMarginTopList.push(marginTop);
                if(isStart) {
                  let diff = reflow.getMergeMarginTB(mergeMarginTopList, mergeMarginBottomList);
                  // 需要合并的情况，根据记录数和索引向上向下遍历节点设置偏移，同时设置总偏移量供父级使用
                  if(diff) {
                    for(let j = Math.max(startIndex, i - mergeMarginBottomList.length + 1); j < length; j++) {
                      flowChildren[j].__offsetY(diff, true, REPAINT);
                    }
                  }
                }
              }
              // 同时自己保存bottom，为后续block准备
              mergeMarginTopList = [];
              mergeMarginBottomList = [marginBottom];
            }
            // 最后一个空block当是正正和负负时要处理，正负在outHeight处理了结果是0，最后一个一定有不必判断isStart
            else if(i === length - 1) {
              let diff = reflow.getMergeMarginTB(mergeMarginTopList, mergeMarginBottomList);
              if(diff) {
                for(let j = Math.max(startIndex, i - mergeMarginBottomList.length + 1); j < length; j++) {
                  flowChildren[j].__offsetY(diff, true, REPAINT);
                }
              }
            }
          }
        }
        // 先检查parent的尺寸是否发生了变化，从而决定是否调整next以及向上递归调整
        let cs = parent.currentStyle;
        let height = cs[HEIGHT];
        let isContainer = parent === root || parent.isShadowRoot || cs[POSITION] === 'absolute' || cs[POSITION] === 'relative';
        if(height[1] === AUTO && lastChild) {
          let oldH = parent.height + parent.computedStyle[PADDING_TOP];
          let nowH = lastChild.y + lastChild.outerHeight - parent.y;
          let diff = nowH - oldH;
          // 调整next以及非固定PX的abs，再递归向上
          if(diff) {
            parent.__resizeY(diff, REPAINT);
            let container;
            for(let i = 0, len = absChildren.length; i < len; i++) {
              let item = absChildren[i];
              let { [TOP]: top, [BOTTOM]: bottom, [HEIGHT]: height } = item.currentStyle;
              // 是容器，所有的都调整，不是容器，其偏移是上级parent的某一个，根据情况具体不同
              if(top[1] === AUTO) {
                if(bottom[1] === AUTO) {
                  let prev = item.prev;
                  while(prev) {
                    let target = prev;
                    if(target instanceof Component) {
                      target = target.shadowRoot;
                    }
                    let isXom = target instanceof Xom;
                    let cs = isXom && target.currentStyle;
                    let isAbs = isXom && cs[POSITION] === 'absolute';
                    if(!isAbs) {
                      let y = target.y + target.outerHeight;
                      let d = y - item.y;
                      if(d) {
                        item.__offsetY(d, true, REPAINT);
                      }
                      break;
                    }
                    prev = prev.prev;
                  }
                }
                else if(bottom[1] === PX) {
                  item.__offsetY(diff, true, REPAINT);
                }
                else if(bottom[1] === PERCENT) {
                  let v = (1 - bottom[0] * 0.01) * diff;
                  item.__offsetY(v, true, REPAINT);
                }
              }
              else if(top[1] === PERCENT) {
                if(isContainer) {
                  let v = top[0] * 0.01 * diff;
                  item.__offsetY(v, true, REPAINT);
                }
                // 非容器的特殊处理
                else {
                  if(!container) {
                    container = parent.domParent;
                    while(container) {
                      if(container === root || container.isShadowRoot) {
                        break;
                      }
                      let cs = container.currentStyle;
                      if(cs[POSITION] === 'absolute' || cs[POSITION] === 'relative') {
                        break;
                      }
                      container = container.domParent;
                    }
                  }
                  if(container.currentStyle[HEIGHT][1] !== PX) {
                    let v = top[0] * 0.01 * diff;
                    item.__offsetY(v, true, REPAINT);
                  }
                }
              }
              // 高度百分比需发生变化的重新布局，需要在容器内
              if(height[1] === PERCENT) {
                if(isContainer) {
                  parent.__layoutAbs(parent, parent.__layoutData, item);
                }
                // 不在容器内说明在上级，存入等结束后统一重新布局
                else {
                  if(!container) {
                    container = parent.domParent;
                    while(container) {
                      if(container === root || container.isShadowRoot) {
                        break;
                      }
                      let cs = container.currentStyle;
                      if(cs[POSITION] === 'absolute' || cs[POSITION] === 'relative') {
                        break;
                      }
                      container = container.domParent;
                    }
                  }
                  inDirectAbsList.push([parent, container, item]);
                }
              }
            }
            reflow.offsetAndResizeByNodeOnY(parent, root, reflowHash, diff, inDirectAbsList);
            return;
          }
        }
        // 没有diff变化或者固定尺寸，可能内部发生变化，调整AUTO的abs，不递归向上
        for(let i = 0, len = absChildren.length; i < len; i++) {
          let item = absChildren[i];
          let { [TOP]: top, [BOTTOM]: bottom } = item.currentStyle;
          if(top[1] === AUTO && bottom[1] === AUTO) {
            let prev = item.prev;
            while(prev) {
              let target = prev;
              if(target instanceof Component) {
                target = target.shadowRoot;
              }
              let isXom = target instanceof Xom;
              let cs = isXom && target.currentStyle;
              let isAbs = isXom && cs[POSITION] === 'absolute';
              if(!isAbs) {
                let y = target.y + target.outerHeight;
                let d = y - item.y;
                if(d) {
                  item.__offsetY(d, true, REPAINT);
                }
                break;
              }
              prev = prev.prev;
            }
          }
        }
      });
      // merge过程中需要重新布局的abs
      inDirectAbsList.forEach(arr => {
        arr[0].__layoutAbs(arr[1], arr[0].__layoutData, arr[2]);
      });

      // 调整因reflow造成的原struct数据索引数量偏差，纯zIndex的已经在repaint里面重新生成过了
      // 这里因为和update保持一致的顺序，因此一定是先根顺序且互不包含
      let diff = 0, lastIndex = 0, isFirst = true, structs = root.__structs;
      diffList.forEach(item => {
        let [ns, d] = item;
        // 第一个有变化的，及后面无论有无变化都需更新
        // 第1个变化区域无需更改前面一段
        if(isFirst) {
          isFirst = false;
          lastIndex = ns[STRUCT_INDEX] + (ns[STRUCT_TOTAL] || 0) + 1;
          diff += d;
        }
        // 第2+个变化区域看是否和前面一个相连，有不变的段则先偏移它，然后再偏移自己
        else {
          let j = ns[STRUCT_INDEX] + (ns[STRUCT_TOTAL] || 0) + 1 + diff;
          for(let i = lastIndex; i < j; i++) {
            structs[i][STRUCT_INDEX] += diff;
          }
          lastIndex = j;
          diff += d;
        }
      });
      // 后面的要根据偏移量校正索引
      if(diff) {
        for(let i = lastIndex, len = structs.length; i < len; i++) {
          structs[i][STRUCT_INDEX] += diff;
        }
      }
      // 清除id
      reflow.clearUniqueReflowId(reflowHash);
    }
  }

  // 每个root拥有一个刷新hook，多个root塞到frame的__hookTask里
  // frame在所有的帧刷新逻辑执行后检查hook列表，进行root刷新操作
  __frameHook() {
    if(!this.__hookTask) {
      let r = this.__hookTask = (() => {
        this.refresh();
      });
      frame.__hookTask.push(r);
    }
  }

  __clear(ctx, renderMode) {
    if(renderMode === mode.CANVAS) {
      // 可能会调整宽高，所以每次清除用最大值
      this.__mw = Math.max(this.__mw, this.width);
      this.__mh = Math.max(this.__mh, this.height);
      // 清除前得恢复默认matrix，防止每次布局改变了属性
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, this.__mw, this.__mh);
    }
    else if(renderMode === mode.WEBGL) {
      ctx.clearColor(0, 0, 0, 0);
      ctx.clear(ctx.COLOR_BUFFER_BIT);
    }
  }

  get dom() {
    return this.__dom;
  }

  get uuid() {
    return this.__uuid;
  }

  get renderMode() {
    return this.__renderMode;
  }

  get ctx() {
    return this.__ctx;
  }

  get defs() {
    return this.__defs;
  }

  get taskUp() {
    return this.__taskUp;
  }

  get taskCp() {
    return this.__taskCp;
  }

  get ref() {
    return this.__ref;
  }

  get animateController() {
    return this.__animateController;
  }

  get texCache() {
    return this.__texCache;
  }
}

export default Root;
