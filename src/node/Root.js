import Dom from './Dom';
import Text from './Text';
import Xom from './Xom';
import Component from './Component';
import Defs from './Defs';
import mode from './mode';
import Geom from '../geom/Geom';
import builder from '../util/builder';
import updater from '../util/updater';
import util from '../util/util';
import domDiff from '../util/diff';
import css from '../style/css';
import unit from '../style/unit';
import enums from '../util/enums';
import inject from '../util/inject';
import Event from '../util/Event';
import frame from '../animate/frame';
import Controller from '../animate/Controller';
import change from '../refresh/change';
import level from '../refresh/level';
import struct from '../refresh/struct';

const { STYLE_KEY: {
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
  PADDING_TOP,
  PADDING_LEFT,
  BORDER_TOP_WIDTH,
  BORDER_LEFT_WIDTH,
},
  UPDATE_NODE,
  UPDATE_STYLE,
  UPDATE_KEYS,
  UPDATE_COMPONENT,
  UPDATE_FOCUS,
  UPDATE_IMG,
  UPDATE_MEASURE,
  UPDATE_OVERWRITE,
  UPDATE_LIST,
  NODE_TAG_NAME,
  NODE_CACHE_STYLE,
  NODE_CACHE_PROPS,
  NODE_CURRENT_STYLE,
  NODE_CURRENT_PROPS,
  NODE_DOM_PARENT,
  NODE_IS_MASK,
  NODE_REFRESH_LV,
  NODE_IS_DESTROYED,
  NODE_STYLE,
  NODE_UPDATE_HASH,
  NODE_UNIQUE_UPDATE_ID,
  STRUCT_INDEX,
  STRUCT_TOTAL,
  STRUCT_NODE,
} = enums;
const DIRECTION_HASH = {
  [TOP]: true,
  [RIGHT]: true,
  [BOTTOM]: true,
  [LEFT]: true,
};
const { isNil, isObject, isFunction } = util;
const { AUTO, PX, PERCENT, INHERIT } = unit;
const { calRelative, isRelativeOrAbsolute, equalStyle } = css;
const { contain, getLevel, isRepaint, NONE, FILTER, REPAINT, REFLOW } = level;
const { isIgnore, isGeom, isMeasure } = change;

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

function initEvent(dom) {
  ['click', 'dblclick', 'mousedown', 'mousemove', 'mouseup', 'touchstart', 'touchmove', 'touchend', 'touchcancel'].forEach(type => {
    dom.addEventListener(type, e => {
      let root = dom.__root;
      if(['touchend', 'touchcancel', 'touchmove'].indexOf(type) > -1) {
        root.__touchstartTarget && root.__touchstartTarget.__emitEvent(root.__wrapEvent(e), true);
      }
      else {
        root.__cb(e);
      }
    });
  });
}

// 提取出对比节点尺寸是否修改，用currentStyle的对比computedStyle的
function isFixedWidthOrHeight(node, root, k) {
  let c = node.currentStyle[k];
  let v = node.computedStyle[k];
  if(c[1] === PX) {
    return c[0] === v;
  }
  if(c[1] === PERCENT) {
    let parent = node.domParent;
    let s = parent.layoutData[k === 'width' ? 'w' : 'h'];
    return c[0] * s * 0.01 === v;
  }
  return false;
}
function isFixedSize(node, root) {
  return isFixedWidthOrHeight(node, root, WIDTH) && isFixedWidthOrHeight(node, root, HEIGHT);
}

const OFFSET = 0;
const LAYOUT = 1;
function isLAYOUT(node, hash) {
  return node.hasOwnProperty('__uniqueReflowId') && hash[node.__uniqueReflowId] >= LAYOUT;
}

function setLAYOUT(node, hash, component) {
  addLAYOUT(node, hash, component);
  hash[node.__uniqueReflowId].lv |= LAYOUT;
}

let __uniqueReflowId = 0;
function addLAYOUT(node, hash, component) {
  if(!node.hasOwnProperty('__uniqueReflowId')) {
    node.__uniqueReflowId = __uniqueReflowId;
    hash[__uniqueReflowId++] = {
      node,
      lv: LAYOUT,
      component,
    };
  }
}

let uniqueUpdateId = 0;
function parseUpdate(renderMode, root, target, reflowList, measureList, cacheHash, cacheList, zHash, zList) {
  let {
    [UPDATE_NODE]: node,
    [UPDATE_STYLE]: style,
    [UPDATE_OVERWRITE]: overwrite,
    [UPDATE_FOCUS]: focus,
    [UPDATE_IMG]: img,
    [UPDATE_COMPONENT]: component,
    [UPDATE_MEASURE]: measure,
    [UPDATE_LIST]: list,
    [UPDATE_KEYS]: keys,
  } = target;
  let __config = node.__config;
  if(__config[NODE_IS_DESTROYED]) {
    return;
  }
  // updateStyle()这样的调用需要覆盖原有样式，因为是按顺序遍历，后面的优先级自动更高不怕重复
  if(overwrite) {
    Object.assign(__config[NODE_STYLE], overwrite);
  }
  // 多次调用更新才会有list，一般没有，优化
  if(list) {
    let hash = {};
    keys.forEach(k => {
      hash[k] = true;
    });
    list.forEach(item => {
      let { [UPDATE_STYLE]: style, [UPDATE_OVERWRITE]: overwrite, [UPDATE_KEYS]: keys2 } = item;
      keys2.forEach(k2 => {
        if(!hash.hasOwnProperty(k2)) {
          hash[k2] = true;
          keys.push(k2);
        }
      });
      if(overwrite) {
        Object.assign(__config[NODE_STYLE], overwrite);
      }
      if(style) {
        Object.assign(target[UPDATE_STYLE], style);
      }
    });
  }
  // 按节点合并完style后判断改变等级
  // let { tagName, currentStyle, currentProps, __cacheStyle, __cacheProps } = node;
  let {
    [NODE_TAG_NAME]: tagName,
    [NODE_CACHE_STYLE]: __cacheStyle,
    [NODE_CACHE_PROPS]: __cacheProps,
    [NODE_CURRENT_STYLE]: currentStyle,
    [NODE_CURRENT_PROPS]: currentProps,
    [NODE_DOM_PARENT]: domParent,
    [NODE_IS_MASK]: isMask,
  } = __config;
  let lv = focus || NONE;
  let p;
  let hasMeasure = measure;
  let hasZ, hasVisibility, hasColor;
  // component无需遍历直接赋值，img重新加载等情况没有样式更新
  if(!component && style && keys) {
    for(let i = 0, len = keys.length; i < len; i++) {
      let k = keys[i];
      let v = style[k];
      // 只有geom的props和style2种可能
      if(node instanceof Geom && isGeom(tagName, k)) {
        if(!equalStyle(k, v, currentProps[k], node)) {
          p = p || {};
          p[k] = style[k];
          lv |= REPAINT;
          __cacheProps[k] = undefined;
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
            // repaint细化等级，reflow在checkReflow()
            lv |= getLevel(k);
            if(isMeasure(k)) {
              hasMeasure = true;
            }
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
  if(p) {
    Object.assign(currentProps, p);
  }
  if(style) {
    Object.assign(currentStyle, style);
  }
  // 无任何改变处理的去除记录，如pointerEvents、无效的left
  if(lv === NONE && !component) {
    delete node.__config[NODE_UNIQUE_UPDATE_ID];
    return;
  }
  // 记录下来清除parent的zIndexChildren缓存
  if(hasZ && domParent) {
    delete domParent.__zIndexChildren;
  }
  // visibility/color变化，影响子继承
  if(hasVisibility || hasColor) {
    for(let __structs = root.__structs, __struct = node.__struct, i = __struct[STRUCT_INDEX] + 1, len = i + __struct[STRUCT_TOTAL]; i < len; i++) {
      // let { node, node: { __config, currentStyle }, total } = __structs[i];
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
        __config[NODE_REFRESH_LV] = node.__refreshLevel |= REPAINT;
        if(node instanceof Xom) {
          node.__cancelCache();
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
    if(prev && prev.__cacheMask) {
      prev.__cacheMask.release();
      prev.__cacheMask = null;
    }
  }
  // reflow/repaint/measure相关的记录下来
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
      img,
      component,
    });
    // measure需要提前先处理
    if(hasMeasure) {
      measureList.push(node);
    }
  }
  __config[NODE_REFRESH_LV] = node.__refreshLevel = lv;
  // dom在>=REPAINT时total失效，svg的geom比较特殊，任何改变都失效，要清除vd的cache
  let need = lv >= REPAINT || renderMode === mode.SVG && node instanceof Geom;
  if(need) {
    if(node.__cache) {
      node.__cache.release();
    }
    if(node.__cacheTotal) {
      node.__cacheTotal.release();
    }
    if(node.__cacheMask) {
      node.__cacheMask.release();
      node.__cacheMask = null;
    }
    if(node.__cacheOverflow) {
      node.__cacheOverflow.release();
      node.__cacheOverflow = null;
    }
  }
  if((need || contain(lv, FILTER)) && node.__cacheFilter) {
    node.__cacheFilter.release();
    node.__cacheFilter = null;
  }
  // 向上清除等级>=REPAINT的汇总缓存信息，过程中可能会出现重复，因此节点上记录一个临时标防止重复递归
  let parent = domParent;
  // 向上查找，出现重复跳出
  while(parent) {
    if(parent.__config.hasOwnProperty(NODE_UNIQUE_UPDATE_ID)) {
      let id = parent.__config[NODE_UNIQUE_UPDATE_ID];
      if(cacheHash.hasOwnProperty(id)) {
        break;
      }
      cacheHash[id] = true;
    }
    // 没有的需要设置一个标识
    else {
      cacheHash[uniqueUpdateId] = true;
      parent.__config[NODE_UNIQUE_UPDATE_ID] = uniqueUpdateId++;
      cacheList.push(parent);
    }
    let lv = parent.__refreshLevel;
    let need = lv >= REPAINT;
    if(need && parent.__cache) {
      parent.__cache.release();
    }
    // 前面已经过滤了无改变NONE的，只要孩子有任何改变父亲就要清除
    if(parent.__cacheTotal) {
      parent.__cacheTotal.release();
    }
    if(parent.__cacheFilter) {
      parent.__cacheFilter.release();
      parent.__cacheFilter = null;
    }
    if(parent.__cacheMask) {
      parent.__cacheMask.release();
      parent.__cacheMask = null;
    }
    if(parent.__cacheOverflow) {
      parent.__cacheOverflow.release();
      parent.__cacheOverflow = null;
    }
    parent = parent.domParent;
  }
  return true;
}

function cleanSvgCache(node, child) {
  if(child) {
    node.__config[NODE_REFRESH_LV] = node.__refreshLevel |= REPAINT;
  }
  else {
    node.__cacheTotal.release();
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
    this.__task = [];
    this.__ref = {};
    this.__updateHash = {};
    this.__reflowList = [{ node: this }]; // 初始化填自己，第一次布局时复用逻辑完全重新布局
    this.__animateController = new Controller();
    Event.mix(this);
    this.__config[NODE_UPDATE_HASH] = this.__updateHash;
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

  __genHtml() {
    let res = `<${this.tagName}`;
    // 拼接处理属性
    Object.keys(this.props).forEach(k => {
      let v = this.props[k];
      // 忽略事件
      if(!/^on[a-zA-Z]/.test(k)) {
        res += renderProp(k, v);
      }
    });
    res += `></${this.tagName}>`;
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

  appendTo(dom) {
    dom = getDom(dom);
    this.__children = builder.initRoot(this.__cd, this);
    this.__initProps();
    this.__root = this;
    this.cache = !!this.props.cache;
    // 已有root节点
    if(dom.nodeName.toUpperCase() === this.tagName.toUpperCase()) {
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
      this.__dom = dom.querySelector(this.tagName);
      if(!this.__dom) {
        dom.innerHTML = this.__genHtml();
        this.__dom = dom.querySelector(this.tagName);
      }
    }
    this.__uuid = isNil(this.__dom.__uuid) ? uuid++ : this.__dom.__uuid;
    this.__defs = this.dom.__defs || Defs.getInstance(this.__uuid);
    // 没有设置width/height则采用css计算形式
    if(!this.width || !this.height) {
      let css = window.getComputedStyle(dom, null);
      if(!this.width) {
        this.__width = parseFloat(css.getPropertyValue('width')) || 0;
        dom.setAttribute('width', this.width);
      }
      if(!this.height) {
        this.__height = parseFloat(css.getPropertyValue('height')) || 0;
        dom.setAttribute('height', this.height);
      }
    }
    // 只有canvas有ctx，svg用真实dom
    if(this.tagName === 'canvas') {
      this.__ctx = this.__dom.getContext('2d');
      this.__renderMode = mode.CANVAS;
    }
    else if(this.tagName === 'svg') {
      this.__renderMode = mode.SVG;
    }
    this.refresh(null, true);
    // 第一次节点没有__root，渲染一次就有了才能diff
    if(this.dom.__root) {
      this.dom.__root.destroy();
    }
    else {
      initEvent(this.dom);
      this.dom.__uuid = this.__uuid;
    }
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
      this.__checkRoot(width, height);
      this.__computeMeasure(renderMode, ctx);
    }
    // 非首次刷新如果没有更新则无需继续
    else if(!this.__checkUpdate(renderMode, ctx, width, height)) {
      return;
    }
    // 获取所有字体和大小测量，仅svg需要，canvas直接做
    inject.measureText();
    this.__checkReflow(width, height);
    if(renderMode === mode.CANVAS) {
      this.__clear(ctx);
      // 利用list循环代替tree递归快速渲染
      if(this.cache) {
        struct.renderCacheCanvas(renderMode, ctx, defs, this);
      }
      else {
        struct.renderCanvas(renderMode, ctx, defs, this);
      }
    }
    // svg的特殊diff需要
    else if(renderMode === mode.SVG) {
      struct.renderSvg(renderMode, ctx, defs, this);
      let nvd = this.virtualDom;
      nvd.defs = defs.value;
      if(this.dom.__root) {
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
    // 特殊cb，供小程序绘制完回调使用
    if(isFunction(cb)) {
      cb();
    }
    this.emit(Event.REFRESH);
  }

  destroy() {
    this.__destroy();
    frame.offFrame(this.__rTask);
    let n = this.dom;
    if(n) {
      n.__root = null;
    }
  }

  scale(x = 1, y = x) {
    this.__scx = x;
    this.__scy = y;
  }

  addRefreshTask(cb) {
    if(!cb) {
      return;
    }
    let { task } = this;
    // 第一个添加延迟侦听，后续放队列等待一并执行
    if(!task.length) {
      let clone;
      frame.nextFrame(this.__rTask = {
        __before: diff => {
          clone = task.splice(0);
          // 前置一般是动画计算此帧样式应用，然后刷新后出发frame事件，图片加载等同
          if(clone.length) {
            let setStateList = [];
            clone.forEach((item, i) => {
              if(isObject(item) && isFunction(item.__before)) {
                // 收集组件setState的更新，特殊处理
                if(item.__state) {
                  setStateList.push(i);
                }
                item.__before(diff);
              }
            });
            // 刷新前先进行setState检查，全都是setState触发的且没有更新则无需刷新
            if(setStateList.length) {
              updater.check(this);
            }
            // 有组件更新，则需要重新布局
            let len = updater.updateList.length;
            if(len) {
              updater.updateList.forEach(cp => {
                let sr = cp.shadowRoot;
                // 可能返回text，需视为其parentNode
                if(sr instanceof Text) {
                  sr = sr.domParent;
                }
                let res = {};
                res[UPDATE_NODE] = sr;
                res[UPDATE_STYLE] = sr.currentStyle;
                res[UPDATE_FOCUS] = REFLOW;
                res[UPDATE_MEASURE] = true;
                res[UPDATE_COMPONENT] = true;
                this.__addUpdate(sr, sr.__config, this, this.__config, res);
              });
            }
          }
        },
        __after: diff => {
          clone.forEach(item => {
            if(isObject(item) && isFunction(item.__after)) {
              item.__after(diff);
            }
            else if(isFunction(item)) {
              item(diff);
            }
          });
          // 触发didUpdate
          updater.did();
        }
      });
      this.__frameHook();
    }
    if(task.indexOf(cb) === -1) {
      task.push(cb);
    }
  }

  delRefreshTask(cb) {
    if(!cb) {
      return;
    }
    let { task } = this;
    for(let i = 0, len = task.length; i < len; i++) {
      if(task[i] === cb) {
        task.splice(i, 1);
        break;
      }
    }
    if(!task.length) {
      frame.offFrame(this.__rTask);
    }
  }

  /**
   * 每次刷新前检查root节点的样式，有些固定的修改无效，有些继承的作为根初始化
   * @param width
   * @param height
   * @private
   */
  __checkRoot(width, height) {
    let { currentStyle, computedStyle } = this;
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
    // 继承值变默认，提前处理以便子节点根据parent计算
    // css.computeMeasure(this, true);
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
        if(o[UPDATE_IMG]) {
          updateHash[UPDATE_IMG] = o[UPDATE_IMG];
        }
        if(o[UPDATE_FOCUS]) {
          updateHash[UPDATE_FOCUS] |= o[UPDATE_FOCUS];
        }
        if(o[UPDATE_MEASURE]) {
          updateHash[UPDATE_MEASURE] = true;
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
      if(o[UPDATE_IMG]) {
        target[UPDATE_IMG] = o[UPDATE_IMG];
      }
      if(o[UPDATE_FOCUS]) {
        target[UPDATE_FOCUS] |= o[UPDATE_FOCUS];
      }
      if(o[UPDATE_MEASURE]) {
        target[UPDATE_MEASURE] = true;
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
      console.error('Update process miss uniqueUpdateId');
    }
  }

  /**
   * 除首次外每次刷新前检查更新列表，计算样式变化，以及测量信息
   * @private
   */
  __checkUpdate(renderMode, ctx, width, height) {
    let root = this;
    let measureList = [];
    let reflowList = [];
    let cacheHash = {};
    let cacheList = [];
    let zHash = {};
    let zList = [];
    let updateRoot = root.__updateRoot;
    let updateHash = root.__updateHash;
    let hasUpdate;
    // root更新特殊提前，因为有继承因素
    if(updateRoot) {
      root.__updateRoot = null;
      hasUpdate = parseUpdate(renderMode, root, updateRoot,
        reflowList, measureList, cacheHash, cacheList);
      // 此时做root检查，防止root出现继承等无效样式
      root.__checkRoot(width, height);
    }
    // 汇总处理每个节点，k是递增数字直接循环遍历
    let keys = Object.keys(updateHash);
    for(let i = 0, len = keys.length; i < len; i++) {
      let t = parseUpdate(renderMode, root, updateHash[keys[i]],
        reflowList, measureList, cacheHash, cacheList, zHash, zList);
      hasUpdate = hasUpdate || t;
    }
    // 先做一部分reset避免下面measureList干扰，cacheList的是专门收集新增的额外节点
    root.__reflowList = reflowList;
    uniqueUpdateId = 0;
    root.__updateHash = root.__config[NODE_UPDATE_HASH] = {};
    cacheList.forEach(item => {
      delete item.__config[NODE_UNIQUE_UPDATE_ID];
    });
    // zIndex改变的汇总修改，防止重复操作
    zList.forEach(item => {
      if(item.hasOwnProperty('__uniqueZId')) {
        delete item.__uniqueZId;
        item.__updateStruct(root.__structs);
      }
    });
    /**
     * 遍历每项节点，计算测量信息，节点向上向下查找继承信息，如果parent也是继承，先计算parent的
     * 过程中可能会出现重复，因此节点上记录一个临时标防止重复递归
     */
    let measureHash = {};
    measureList.forEach(node => {
      let { __config:{ [NODE_UNIQUE_UPDATE_ID]: __uniqueUpdateId, }, domParent: parent } = node;
      if(measureHash.hasOwnProperty(__uniqueUpdateId)) {
        return;
      }
      measureHash[__uniqueUpdateId] = true;
      let last = node;
      // 检查measure的属性是否是inherit
      let isInherit = change.isMeasureInherit(updateHash[__uniqueUpdateId][UPDATE_STYLE]);
      // 是inherit，需要向上查找，从顶部向下递归计算继承信息
      if(isInherit) {
        while(parent && parent !== root) {
          let { __config:{ [NODE_UNIQUE_UPDATE_ID]: __uniqueUpdateId, }, currentStyle } = parent;
          let isInherit;
          if(parent.__config.hasOwnProperty(NODE_UNIQUE_UPDATE_ID)) {
            let style = updateHash[__uniqueUpdateId][UPDATE_STYLE];
            measureHash[__uniqueUpdateId] = true;
            let temp = change.measureInheritList(style);
            isInherit = !!temp.length;
          }
          else {
            isInherit = change.isMeasureInherit(currentStyle);
          }
          // 如果parent有inherit存入列表且继续向上，否则跳出循环
          if(isInherit) {
            last = parent;
          }
          else {
            break;
          }
          // 考虑component下的继续往上继承
          parent = parent.domParent;
        }
      }
      // 自顶向下查找inherit的，利用已有的方法+回调
      last.__computeMeasure(renderMode, ctx, function(target) {
        if(target.__config.hasOwnProperty(NODE_UNIQUE_UPDATE_ID)) {
          measureHash[target.__config[NODE_UNIQUE_UPDATE_ID]] = true;
        }
      });
    });
    // 做完清空留待下次刷新重来
    for(let i = 0, len = keys.length; i < len; i++) {
      delete updateHash[keys[i]][UPDATE_NODE].__config[NODE_UNIQUE_UPDATE_ID];
    }
    return hasUpdate;
  }

  /**
   * 除首次外每次刷新前检查reflow列表，计算需要reflow的节点局部重新布局
   * 当一个元素absolute时，其变化不会影响父元素和兄弟元素，直接自己重新局部LAYOUT包含子节点
   * 当inline变化时，视为其最近block/flex父变化
   * 当block变化时，如父是flex往上查找最上层flex视为其变化，如不是则影响后面兄弟和父resize
   * 当flex变化时，如父是flex往上查找最上层flex视为其变化，如不是则影响所有递归子节点和父resize
   * 以上3种情况向上查找时遇到absolute父均提前跳出，并标记absolute父LAYOUT
   * 当relative只变化left/top/right/bottom时，自己重新layout
   * 检测节点时记录影响的所有节点，最终形成一棵或n棵局部树
   * 一般需要重新布局的记作LAYOUT，被兄弟影响只需偏移的记作OFFSET，OFFSET可能会重复变为LAYOUT
   * 上述情况倘若发生包含重复，去掉子树，因子树视为被包含的重新布局
   * 如果有从root开始的，直接重新布局像首次那样即可
   * 如果非root，所有树根按先根顺序记录下来，依次执行局部布局
   * @private
   */
  __checkReflow(width, height) {
    let { __reflowList: reflowList } = this;
    if(!reflowList.length) {
      return;
    }
    let root = this;
    let hasRoot;
    __uniqueReflowId = 0;
    let reflowHash = {};

    // 单独提出共用检测影响的函数，非absolute和relative的offset情况从节点本身开始向上分析影响
    function checkInfluence(node, component, focus) {
      // 自身尺寸固定且无变化，无需向上查找，但position发生变化的除外
      if(isFixedSize(node, root) && !focus) {
        return;
      }
      let target = node;
      // inline新老都影响，节点变为最近的父非inline
      if(node.currentStyle[DISPLAY] === 'inline' || node.computedStyle[DISPLAY] === 'inline') {
        let parent = node.domParent;
        do {
          target = parent;
          // 父到root提前跳出
          if(parent === root) {
            return true;
          }
          // 父已有LAYOUT跳出防重
          if(isLAYOUT(parent, reflowHash)) {
            return;
          }
          // 遇到absolute跳出，如果absolute发生变化，一定会存在于列表中，不用考虑
          if(parent.currentStyle[POSITION] === 'absolute' || parent.computedStyle[POSITION] === 'absolute') {
            setLAYOUT(parent, reflowHash, component);
            return;
          }
          // 父固定宽度跳出直接父进行LAYOUT即可
          if(isFixedSize(parent)) {
            setLAYOUT(parent, reflowHash, component);
            return;
          }
          // 继续向上
          parent = parent.domParent;
        }
        while(parent && (parent.currentStyle[DISPLAY] === 'inline' || parent.computedStyle[DISPLAY] === 'inline'));
        // target至少是node的parent，如果固定尺寸提前跳出
        if(isFixedSize(target)) {
          setLAYOUT(target, reflowHash, component);
          return;
        }
      }
      // 此时target指向node，如果原本是inline则是其非inline父
      let parent = target.domParent;
      // parent有LAYOUT跳出，已被包含
      if(parent && isLAYOUT(parent, reflowHash)) {
        return;
      }
      // 检查flex，如果父是flex，向上查找flex顶点视作其更改
      if(parent && (parent.computedStyle[DISPLAY] === 'flex' || parent.currentStyle[DISPLAY] === 'flex')) {
        do {
          target = parent;
          if(parent === root) {
            return true;
          }
          if(isLAYOUT(parent, reflowHash)) {
            return;
          }
          if(parent.currentStyle[POSITION] === 'absolute' || parent.computedStyle[POSITION] === 'absolute') {
            setLAYOUT(parent, reflowHash, component);
            return;
          }
          if(isFixedSize(parent)) {
            setLAYOUT(parent, reflowHash, component);
            return;
          }
          parent = parent.domParent;
        }
        while(parent && (parent.computedStyle[DISPLAY] === 'flex' || parent.currentStyle[DISPLAY] === 'flex'));
        // target至少是node的parent，如果固定尺寸提前跳出
        if(isFixedSize(target)) {
          setLAYOUT(target, reflowHash, component);
          return;
        }
      }
      // 此时target指向node，如果父原本是flex则是其最上flex父
      parent = target.domParent;
      // parent有LAYOUT跳出，已被包含
      if(parent && isLAYOUT(parent, reflowHash)) {
        return;
      }
      // 向上查找了并且没提前跳出的，父重新布局
      if(target !== node) {
        setLAYOUT(target, reflowHash, component);
      }
    }

    // 遍历检查发生布局改变的节点列表，此时computedStyle还是老的，currentStyle是新的
    for(let i = 0, len = reflowList.length; i < len; i++) {
      let { node, style, img, component } = reflowList[i];
      // root提前跳出，完全重新布局
      if(node === this) {
        hasRoot = true;
        break;
      }
      let { currentStyle, computedStyle } = node;
      // 每个节点生成唯一的布局识别id存入hash防止重复
      if(!node.hasOwnProperty('__uniqueReflowId')) {
        node.__uniqueReflowId = __uniqueReflowId;
        reflowHash[__uniqueReflowId++] = {
          node,
          lv: OFFSET,
          img,
          component,
        };
      }
      let o = reflowHash[node.__uniqueReflowId];
      // absolute无变化，只影响自己
      if(currentStyle[POSITION] === 'absolute' && computedStyle[POSITION] === 'absolute') {
        o.lv = LAYOUT;
      }
      // absolute和非absolute互换
      else if(currentStyle[POSITION] !== computedStyle[POSITION]) {
        o.lv = LAYOUT;
        if(checkInfluence(node, component, true)) {
          hasRoot = true;
          break;
        }
      }
      // 所有其它变化
      else {
        let onlyXY = true;
        if(style) {
          let keys = Object.keys(style);
          for(let i = 0, len = keys.length; i < len; i++) {
            let k = keys[i];
            if(!DIRECTION_HASH.hasOwnProperty(k)) {
              onlyXY = false;
              break;
            }
          }
        }
        // relative只有x/y变化时特殊只进行OFFSET，非relative的忽视掉这个无用影响
        // img和component加载特殊进到这里强制LAYOUT
        if(onlyXY && !img && !component) {
          if(computedStyle[POSITION] === 'relative') {
            o.lv |= OFFSET;
          }
        }
        // 剩余的其它变化
        else {
          o.lv = LAYOUT;
          if(checkInfluence(node, component)) {
            hasRoot = true;
            break;
          }
        }
      }
    }
    __uniqueReflowId = 0;
    this.__reflowList = [];
    // 有root提前跳出
    if(hasRoot) {
      reflowList.forEach(item => delete item.node.__uniqueReflowId);
      // 布局分为两步，普通流和定位流，互相递归
      this.__layout({
        x: 0,
        y: 0,
        w: width,
        h: height,
      });
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
     * LAYOUT节点作为局部根，其递归子节点无需重复任何操作去重
     * OFFSET节点作为局部根，其递归子节点先执行任何操作，后续根节点再偏移一次
     */
    else {
      let uniqueList = [];
      this.deepScan(function(node, options) {
        if(node.hasOwnProperty('__uniqueReflowId')) {
          let o = reflowHash[node.__uniqueReflowId];
          delete node.__uniqueReflowId; // 清除掉
          if(o.lv >= LAYOUT) {
            options.uniqueList.push(o);
          }
          else {
            // OFFSET的话先递归看子节点，本身改变放在最后
            let uniqueList = [];
            node.deepScan(function(child, uniqueList) {}, { uniqueList });
            uniqueList.forEach(item => {
              options.uniqueList.push(item);
            });
            options.uniqueList.push(o);

          }
          // 返回true即可提前结束深度遍历，在reflowHash有记录时提前跳出，子节点交由上面逻辑执行
          return true;
        }
        // reflowHash没有记录则无返回继续递归执行
      }, { uniqueList });
      // 按顺序执行列表即可，上层LAYOUT先执行停止递归子节点，上层OFFSET后执行等子节点先LAYOUT/OFFSET
      let diffList = [];
      let diffI = 0;
      uniqueList.forEach(item => {
        let { node, lv, component } = item;
        // 重新layout的w/h数据使用之前parent暂存的，x使用parent，y使用prev或者parent的
        if(lv >= LAYOUT) {
          let cps = node.computedStyle, cts = node.currentStyle;
          let zIndex = cps[Z_INDEX], position = cps[POSITION], display = cps[DISPLAY];
          let isLastAbs = position === 'absolute';
          let isNowAbs = cts[POSITION] === 'absolute';
          let isLastNone = display === 'none';
          let isNowNone = cts[DISPLAY] === 'none';
          if(isLastNone && isNowNone) {
            return;
          }
          let parent = node.domParent;
          let { layoutData: { x, y, w, h }, width, computedStyle } = parent;
          let current = node;
          // cp的shadowRoot要向上到cp本身
          while(component && current.isShadowRoot) {
            current = current.host;
          }
          let ref = current.prev;
          if(ref) {
            y = ref.y;
            y += ref.outerHeight;
          }
          else {
            y = parent.y;
            y += computedStyle[MARGIN_TOP] + computedStyle[BORDER_TOP_WIDTH] + computedStyle[PADDING_TOP];
          }
          x += computedStyle[MARGIN_LEFT] + computedStyle[BORDER_LEFT_WIDTH] + computedStyle[PADDING_LEFT];
          let { outerWidth, outerHeight } = node;
          let change2Abs;
          // 找到最上层容器，如果是组件的子节点，以sr为container，sr本身往上找
          let container = node;
          if(isNowAbs) {
            container = container.domParent;
            while(container && container !== root) {
              if(isRelativeOrAbsolute) {
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
            parent.__layoutAbs(container, null, node);
            // 前后都是abs无需偏移后面兄弟
            if(isLastAbs) {
              return;
            }
            change2Abs = true;
          }
          else {
            node.__layout({
              x,
              y,
              w: width,
              h,
            });
            if(node instanceof Dom) {
              if(!node.parent && node.host) {
                container = node; // 特殊判断component的sr为container
              }
              node.__layoutAbs(container, {
                x,
                y,
                w: width,
                h,
              });
            }
          }
          // 记录重新布局引发的差值w/h，注意abs到非abs的切换情况
          let fromAbs = node.computedStyle[position] === 'absolute';
          let dx, dy;
          if(change2Abs) {
            dx = -outerWidth;
            dy = -outerHeight;
          }
          else {
            let { outerWidth: ow, outerHeight: oh } = node;
            if(fromAbs) {
              dx = ow;
              dy = oh;
            }
            else {
              dx = ow - outerWidth;
              dy = oh - outerHeight;
            }
          }
          // 向上查找最近的parent是relative，需再次累加ox/oy，无需递归，因为已经包含了
          let p = node;
          while(p && p !== root) {
            p = p.domParent;
            computedStyle = p.computedStyle;
            if(computedStyle[position] === 'relative') {
              let { ox, oy } = p;
              ox && node.__offsetX(ox);
              oy && node.__offsetY(oy);
              break;
            }
          }
          // 如果有差值，偏移next兄弟，同时递归向上所有parent扩充和next偏移，直到absolute的中止
          if(dx || dy) {
            let p = node;
            let last;
            do {
              // component的sr没有next兄弟，视为component的next
              while(p.isShadowRoot) {
                p = p.host;
              }
              last = p;
              // 先偏移next，忽略有定位的absolute或LAYOUT
              let next = p.next;
              while(next) {
                if(next.currentStyle[POSITION] === 'absolute') {
                  if(next.currentStyle[TOP][1] === AUTO && next.currentStyle[BOTTOM][1] === AUTO) {
                    next.__offsetY(dy, true, REFLOW);
                    next.__cancelCache();
                  }
                }
                else if(!next.hasOwnProperty('____uniqueReflowId') || reflowHash[next.____uniqueReflowId] < LAYOUT) {
                  next.__offsetY(dy, true, REFLOW);
                  next.__cancelCache();
                }
                next = next.next;
              }
              // 要么一定有parent，因为上面向上循环排除了cp返回cp的情况；要么就是root本身
              p = p.parent;
              if(p === root) {
                break;
              }
              // parent判断是否要resize
              let { currentStyle } = p;
              let isAbs = currentStyle[POSITION] === 'absolute';
              if(dx) {
                let need;
                // width在block不需要，parent一定不会是flex/inline
                if(isAbs) {
                  if(currentStyle[WIDTH][1] === AUTO
                    && (currentStyle[LEFT][1] === AUTO || currentStyle[RIGHT][1] === AUTO)) {
                    need = true;
                  }
                }
                if(need) {
                  p.__resizeX(dx);
                  p.__cancelCache();
                  p.__config[NODE_REFRESH_LV] = p.__refreshLevel |= REFLOW;
                }
              }
              if(dy) {
                let need;
                if(isAbs) {
                  if(currentStyle[HEIGHT][1] === AUTO
                    && (currentStyle[TOP][1] === AUTO || currentStyle[BOTTOM][1] === AUTO)) {
                    need = true;
                  }
                }
                // height则需要
                else if(currentStyle[HEIGHT][1] === AUTO) {
                  need = true;
                }
                if(need) {
                  p.__resizeY(dy);
                  p.__cancelCache();
                  p.__config[NODE_REFRESH_LV] = p.__refreshLevel |= REFLOW;
                }
                // 高度不需要调整提前跳出
                else {
                  break;
                }
              }
            }
            while(true);
            // 最后一个递归向上取消缓存，防止过程中重复next多次无用递归
            while(last) {
              last.__cancelCache();
              last = last.domParent;
            }
          }
          // component未知dom变化，所以强制重新struct，同时防止zIndex变更影响父节点
          if(component) {
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
          // display有none变化，重置struct和zc
          else if(isLastNone || isNowNone) {
            node.__zIndexChildren = null;
            let arr = node.__modifyStruct(root, diffI);
            diffI += arr[1];
            diffList.push(arr);
          }
        }
        // OFFSET操作的节点都是relative，要考虑auto变化
        else {
          let {
            currentStyle: { [TOP]: top, [RIGHT]: right, [BOTTOM]: bottom, [LEFT]: left }, currentStyle,
            computedStyle: { [TOP]: t, [RIGHT]: r, [BOTTOM]: b, [LEFT]: l }, computedStyle,
          } = node;
          let parent;
          if(node === this) {
            parent = node;
          }
          else {
            parent = node.domParent;
          }
          let newY = 0;
          if(top[1] !== AUTO) {
            newY = calRelative(currentStyle, 'top', top, parent);
            computedStyle[TOP] = newY;
            computedStyle[BOTTOM] = 'auto';
          }
          else if(bottom[1] !== AUTO) {
            newY = -calRelative(currentStyle, 'bottom', bottom, parent);
            computedStyle[BOTTOM] = -newY;
            computedStyle[TOP] = 'auto';
          }
          else {
            computedStyle[TOP] = computedStyle[BOTTOM] = 'auto';
          }
          let oldY = 0;
          if(t !== 'auto') {
            oldY = t;
          }
          else if(b !== 'auto') {
            oldY = -b;
          }
          if(newY !== oldY) {
            node.__offsetY(newY - oldY, false, REFLOW);
          }
          let newX = 0;
          if(left[1] !== AUTO) {
            newX = calRelative(currentStyle, 'left', left, parent);
            computedStyle[LEFT] = newX;
            computedStyle[RIGHT] = 'auto';
          }
          else if(right[1] !== AUTO) {
            newX = -calRelative(currentStyle, 'right', right, parent);
            computedStyle[RIGHT] = -newX;
            computedStyle[LEFT] = 'auto';
          }
          else {
            computedStyle[LEFT] = computedStyle[RIGHT] = 'auto';
          }
          let oldX = 0;
          if(l !== 'auto') {
            oldX = l;
          }
          else if(r !== 'auto') {
            oldX = -r;
          }
          if(newX !== oldX) {
            node.__offsetX(newX - oldX, false, REFLOW);
          }
        }
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
          // lastIndex = ns.index + ns.total + 1;
          lastIndex = ns[STRUCT_INDEX] + ns[STRUCT_TOTAL] + 1;
          diff += d;
        }
        // 第2+个变化区域看是否和前面一个相连，有不变的段则先偏移它，然后再偏移自己
        else {
          let j = ns[STRUCT_INDEX] + ns[STRUCT_TOTAL] + 1 + diff;
          for(let i = lastIndex; i < j; i++) {
            structs[i][STRUCT_INDEX] += diff;
          }
          lastIndex = j;
          diff += d;
        }
      });
      for(let i = lastIndex, len = structs.length; i < len; i++) {
        structs[i][STRUCT_INDEX] += diff;
      }
      // 清除id
      reflowList.forEach(item => delete item.node.__uniqueReflowId);
    }
  }

  // 特殊覆盖方法，不需要super()计算自己，因为放在每次checkRoot()做过了
  __computeMeasure(renderMode, ctx) {
    css.computeMeasure(this, true);
    this.children.forEach(item => {
      item.__computeMeasure(renderMode, ctx);
    });
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

  __clear(ctx) {
    // 可能会调整宽高，所以每次清除用最大值
    this.__mw = Math.max(this.__mw, this.width);
    this.__mh = Math.max(this.__mh, this.height);
    // 清除前得恢复默认matrix，防止每次布局改变了属性
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.__mw, this.__mh);
  }

  get dom() {
    return this.__dom;
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

  get task() {
    return this.__task;
  }

  get ref() {
    return this.__ref;
  }

  get animateController() {
    return this.__animateController;
  }
}

export default Root;
