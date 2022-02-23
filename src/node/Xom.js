import Node from './Node';
import mode from './mode';
import Component from './Component';
import unit from '../style/unit';
import tf from '../style/transform';
import gradient from '../style/gradient';
import border from '../style/border';
import css from '../style/css';
import bg from '../style/bg';
import blur from '../math/blur';
import enums from '../util/enums';
import util from '../util/util';
import inject from '../util/inject';
import painter from '../util/painter';
import Animation from '../animate/Animation';
import frame from '../animate/frame';
import mx from '../math/matrix';
import geom from '../math/geom';
import change from '../refresh/change';
import level from '../refresh/level';
import Cache from '../refresh/Cache';
import font from '../style/font';
import bs from '../style/bs';
import mbm from '../style/mbm';
import inline from './inline';

const { svgPolygon } = painter;
const { CANVAS, SVG, WEBGL } = mode;
const { LOCAL } = Cache;

const {
  STYLE_KEY,
  STYLE_RV_KEY,
  style2Upper,
  STYLE_KEY: {
    BORDER_TOP_LEFT_RADIUS,
    BORDER_TOP_RIGHT_RADIUS,
    BORDER_BOTTOM_LEFT_RADIUS,
    BORDER_BOTTOM_RIGHT_RADIUS,
    PADDING_LEFT,
    PADDING_RIGHT,
    PADDING_TOP,
    PADDING_BOTTOM,
    MARGIN_LEFT,
    MARGIN_TOP,
    MARGIN_BOTTOM,
    MARGIN_RIGHT,
    BORDER_LEFT_WIDTH,
    BORDER_TOP_WIDTH,
    BORDER_BOTTOM_WIDTH,
    BORDER_RIGHT_WIDTH,
    TOP,
    RIGHT,
    BOTTOM,
    LEFT,
    POSITION,
    DISPLAY,
    WIDTH,
    HEIGHT,
    MATRIX,
    TRANSLATE_X,
    TRANSLATE_Y,
    TRANSLATE_Z,
    TRANSFORM,
    SCALE_X,
    SCALE_Y,
    SCALE_Z,
    ROTATE_X,
    ROTATE_Y,
    ROTATE_Z,
    SKEW_X,
    SKEW_Y,
    PERSPECTIVE,
    PERSPECTIVE_ORIGIN,
    ROTATE_3D,
    TRANSFORM_ORIGIN,
    BACKGROUND_POSITION_X,
    BACKGROUND_POSITION_Y,
    BACKGROUND_SIZE,
    BACKGROUND_COLOR,
    BACKGROUND_IMAGE,
    BACKGROUND_REPEAT,
    BOX_SHADOW,
    OPACITY,
    Z_INDEX,
    BORDER_TOP_STYLE,
    BORDER_RIGHT_STYLE,
    BORDER_BOTTOM_STYLE,
    BORDER_LEFT_STYLE,
    FILTER,
    OVERFLOW,
    MIX_BLEND_MODE,
    TEXT_OVERFLOW,
    BORDER_TOP_COLOR,
    BORDER_BOTTOM_COLOR,
    BORDER_LEFT_COLOR,
    BORDER_RIGHT_COLOR,
    FONT_STYLE,
    COLOR,
    VISIBILITY,
    POINTER_EVENTS,
    BORDER_TOP,
    BORDER_RIGHT,
    BORDER_BOTTOM,
    BORDER_LEFT,
    BACKGROUND_CLIP,
    FONT_SIZE,
    FONT_FAMILY,
    LINE_HEIGHT,
    TEXT_STROKE_COLOR,
    TEXT_STROKE_WIDTH,
    TEXT_STROKE_OVER,
  },
  UPDATE_KEY: {
    UPDATE_NODE,
    UPDATE_FOCUS,
    UPDATE_STYLE,
    UPDATE_OVERWRITE,
    UPDATE_KEYS,
    UPDATE_CONFIG,
    UPDATE_REMOVE_DOM,
  },
  STRUCT_KEY: {
    STRUCT_HAS_MASK,
  },
  NODE_KEY: {
    NODE_TAG_NAME,
    NODE_CACHE_STYLE,
    NODE_CURRENT_STYLE,
    NODE_COMPUTED_STYLE,
    NODE_STYLE,
    NODE_STRUCT,
    NODE_OPACITY,
    NODE_MATRIX_EVENT,
    NODE_MATRIX,
    NODE_LIMIT_CACHE,
    NODE_HAS_CONTENT,
    NODE_REFRESH_LV,
    NODE_CACHE,
    NODE_CACHE_TOTAL,
    NODE_CACHE_FILTER,
    NODE_CACHE_MASK,
    NODE_CACHE_OVERFLOW,
    NODE_IS_DESTROYED,
    NODE_DEFS_CACHE,
    NODE_DOM_PARENT,
    NODE_IS_INLINE,
    NODE_PERSPECTIVE_MATRIX,
    NODE_IS_MASK,
    NODE_VIRTUAL_DOM,
    NODE_CACHE_AS_BITMAP,
  }
} = enums;
const { AUTO, PX, PERCENT, INHERIT, NUMBER, REM, VW, VH, VMAX, VMIN, DEG } = unit;
const { int2rgba, rgba2int, joinArr, isNil, isFunction } = util;
const { calRelative } = css;
const { GEOM } = change;
const { mbmName, isValidMbm } = mbm;
const { point2d } = mx;

const {
  contain,
  NONE,
  TRANSFORM: TF,
  REFLOW,
  REPAINT,
  TRANSLATE_X: TX,
  TRANSLATE_Y: TY,
  TRANSLATE_Z: TZ,
} = level;

function getFirstEmptyInlineWidth(xom) {
  let n = 0;
  let flowChildren = xom.flowChildren;
  let length = flowChildren.length;
  for(let i = 0; i < length; i++) {
    let child = flowChildren[i];
    if(child instanceof Xom || child instanceof Component && child.shadowRoot instanceof Xom) {
      if(child.flowChildren.length) {
        n += getFirstEmptyInlineWidth(child);
        break;
      }
      else if(child.__config[NODE_IS_INLINE]) {
        n += child.outerWidth;
      }
    }
    else {
      break;
    }
  }
  return n;
}

function getLastEmptyInlineWidth(xom) {
  let n = 0;
  let flowChildren = xom.flowChildren;
  let length = flowChildren.length;
  for(let i = length - 1; i >= 0; i--) {
    let child = flowChildren[i];
    if(child instanceof Xom || child instanceof Component && child.shadowRoot instanceof Xom) {
      if(child.flowChildren.length) {
        n += getLastEmptyInlineWidth(child);
        break;
      }
      else {
        n += child.outerWidth;
      }
    }
    else {
      break;
    }
  }
  return n;
}

class Xom extends Node {
  constructor(tagName, props = {}) {
    super();
    // 构建工具中都是arr，手写可能出现hash情况
    if(Array.isArray(props)) {
      this.props = util.arr2hash(props);
    }
    else {
      this.props = props;
    }
    this.__tagName = tagName;
    this.__style = this.props.style || {}; // style被解析后的k-v形式
    this.__currentStyle = {}; // 动画过程中绘制一开始会merge动画样式
    this.__computedStyle = {}; // 类似getComputedStyle()将currentStyle计算好数值赋给
    this.__listener = {};
    Object.keys(this.props).forEach(k => {
      let v = this.props[k];
      if(/^on[a-zA-Z]/.test(k)) {
        k = k.slice(2).toLowerCase();
        this.listener[k] = v;
      }
    });
    this.__animationList = [];
    this.__loadBgi = {
      // 刷新回调函数，用以destroy取消用
      cb: function() {
      },
    };
    this.__cacheStyle = {}; // 是否缓存重新计算computedStyle的样式key
    this.__cacheDefs = []; // svg专用，缓存渲染时使用已有的defs，diff过程用，否则会defs被清空
    let isClip = this.__isClip = !!this.props.clip;
    let isMask = this.__isMask = isClip || !!this.props.mask;
    let config = this.__config;
    config[NODE_TAG_NAME] = tagName;
    config[NODE_CACHE_STYLE] = this.__cacheStyle;
    config[NODE_CURRENT_STYLE] = this.__currentStyle;
    config[NODE_COMPUTED_STYLE] = this.__computedStyle;
    config[NODE_REFRESH_LV] = REFLOW;
    config[NODE_STYLE] = this.__style;
    config[NODE_MATRIX] = [];
    config[NODE_MATRIX_EVENT] = [];
    config[NODE_DEFS_CACHE] = this.__cacheDefs;
    config[NODE_IS_MASK] = isMask;
    this.__frameAnimateList = [];
    this.__contentBoxList = []; // inline存储内容用
    // this.__json domApi需要获取生成时的json引用，builder过程添加，如appendChild时json也需要跟着变更
    config[NODE_CACHE_AS_BITMAP] = this.__cacheAsBitmap = !!this.props.cacheAsBitmap;
  }

  __structure(i, lv, j) {
    let res = super.__structure(i, lv, j);
    if(this.__hasMask) {
      res[STRUCT_HAS_MASK] = this.__hasMask;
    }
    this.__config[NODE_STRUCT] = res;
    return res;
  }

  // 设置margin/padding的实际值，layout时执行，inline的垂直方向仍然计算值，但在布局时被忽略
  __mp(currentStyle, computedStyle, w) {
    [
      'Top',
      'Right',
      'Bottom',
      'Left',
    ].forEach(k => {
      let a = STYLE_KEY[style2Upper('margin' + k)];
      let b = STYLE_KEY[style2Upper('padding' + k)];
      computedStyle[a] = this.__mpWidth(currentStyle[a], w);
      computedStyle[b] = this.__mpWidth(currentStyle[b], w);
    });
  }

  __mpWidth(mp, w) {
    if(mp[1] === PX) {
      return mp[0];
    }
    else if(mp[1] === PERCENT) {
      return mp[0] * w * 0.01;
    }
    else if(mp[1] === REM) {
      return mp[0] * this.root.computedStyle[FONT_SIZE];
    }
    else if(mp[1] === VW) {
      return mp[0] * this.root.width * 0.01;
    }
    else if(mp[1] === VH) {
      return mp[0] * this.root.height * 0.01;
    }
    else if(mp[1] === VMAX) {
      return mp[0] * Math.max(this.root.width, this.root.height) * 0.01;
    }
    else if(mp[1] === VMIN) {
      return mp[0] * Math.min(this.root.width, this.root.height) * 0.01;
    }
    return 0;
  }

  // dom常用的几种尺寸赋值
  __ioSize(w, h) {
    let computedStyle = this.computedStyle;
    this.__clientWidth = w += computedStyle[PADDING_LEFT] + computedStyle[PADDING_RIGHT];
    this.__clientHeight = h += computedStyle[PADDING_TOP] + computedStyle[PADDING_BOTTOM];
    this.__offsetWidth = w += computedStyle[BORDER_LEFT_WIDTH] + computedStyle[BORDER_RIGHT_WIDTH];
    this.__offsetHeight = h += computedStyle[BORDER_TOP_WIDTH] + computedStyle[BORDER_BOTTOM_WIDTH];
    this.__outerWidth = w + computedStyle[MARGIN_LEFT] + computedStyle[MARGIN_RIGHT];
    this.__outerHeight = h + computedStyle[MARGIN_TOP] + computedStyle[MARGIN_BOTTOM];
  }

  // 换算margin/padding为px单位，onlyFixedValue只考虑绝对值，不考虑百分比等
  __calMp(v, w, onlyFixedValue) {
    let n = 0;
    if(v[1] === PX) {
      n += v[0];
    }
    else if(v[1] === PERCENT && !onlyFixedValue) {
      v[0] *= w * 0.01;
      v[1] = PX;
      n += v[0];
    }
    else if(v[1] === REM) {
      n += v[0] * this.root.computedStyle[FONT_SIZE];
    }
    else if(v[1] === VW) {
      n += v[0] * this.root.width * 0.01;
    }
    else if(v[1] === VH) {
      n += v[0] * this.root.height * 0.01;
    }
    else if(v[1] === VMAX) {
      n += v[0] * Math.max(this.root.width, this.root.height) * 0.01;
    }
    else if(v[1] === VMIN) {
      n += v[0] * Math.min(this.root.width, this.root.height) * 0.01;
    }
    return n;
  }

  // 为basis的b/min/max添加mpb，只有当b未显示指定等于w/content时才加，同时返回mpb值
  __addMp(isDirectionRow, w, currentStyle, res, isDirectItem) {
    let {
      [MARGIN_LEFT]: marginLeft,
      [MARGIN_TOP]: marginTop,
      [MARGIN_RIGHT]: marginRight,
      [MARGIN_BOTTOM]: marginBottom,
      [PADDING_LEFT]: paddingLeft,
      [PADDING_TOP]: paddingTop,
      [PADDING_RIGHT]: paddingRight,
      [PADDING_BOTTOM]: paddingBottom,
      [BORDER_TOP_WIDTH]: borderTopWidth,
      [BORDER_RIGHT_WIDTH]: borderRightWidth,
      [BORDER_BOTTOM_WIDTH]: borderBottomWidth,
      [BORDER_LEFT_WIDTH]: borderLeftWidth,
    } = currentStyle;
    if(isDirectionRow) {
      let mp = this.__calMp(marginLeft, w, !isDirectItem)
        + this.__calMp(marginRight, w, !isDirectItem)
        + this.__calMp(paddingLeft, w, !isDirectItem)
        + this.__calMp(paddingRight, w, !isDirectItem);
      if(borderLeftWidth[1] === PX) {
        mp += borderLeftWidth[0];
      }
      else if(borderLeftWidth[1] === REM) {
        mp += borderLeftWidth[0] * this.root.computedStyle[FONT_SIZE];
      }
      else if(borderLeftWidth[1] === VW) {
        mp += borderLeftWidth[0] * this.root.width * 0.01;
      }
      else if(borderLeftWidth[1] === VH) {
        mp += borderLeftWidth[0] * this.root.height * 0.01;
      }
      else if(borderLeftWidth[1] === VMAX) {
        mp += borderLeftWidth[0] * Math.max(this.root.width, this.root.height) * 0.01;
      }
      else if(borderLeftWidth[1] === VMIN) {
        mp += borderLeftWidth[0] * Math.min(this.root.width, this.root.height) * 0.01;
      }
      if(borderRightWidth[1] === PX) {
        mp += borderRightWidth[0];
      }
      else if(borderRightWidth[1] === REM) {
        mp += borderRightWidth[0] * this.root.computedStyle[FONT_SIZE];
      }
      else if(borderRightWidth[1] === VW) {
        mp += borderRightWidth[0] * this.root.width * 0.01;
      }
      else if(borderRightWidth[1] === VH) {
        mp += borderRightWidth[0] * this.root.height * 0.01;
      }
      else if(borderRightWidth[1] === VMAX) {
        mp += borderRightWidth[0] * Math.max(this.root.width, this.root.height) * 0.01;
      }
      else if(borderRightWidth[1] === VMIN) {
        mp += borderRightWidth[0] * Math.min(this.root.width, this.root.height) * 0.01;
      }
      res = res.map(item => item + mp);
    }
    else {
      let mp = this.__calMp(marginTop, w, !isDirectItem)
        + this.__calMp(marginBottom, w, !isDirectItem)
        + this.__calMp(paddingTop, w, !isDirectItem)
        + this.__calMp(paddingBottom, w, !isDirectItem);
      if(borderTopWidth[1] === PX) {
        mp += borderTopWidth[0];
      }
      else if(borderTopWidth[1] === REM) {
        mp += borderTopWidth[0] * this.root.computedStyle[FONT_SIZE];
      }
      else if(borderTopWidth[1] === VW) {
        mp += borderTopWidth[0] * this.root.width * 0.01;
      }
      else if(borderTopWidth[1] === VH) {
        mp += borderTopWidth[0] * this.root.height * 0.01;
      }
      else if(borderTopWidth[1] === VMAX) {
        mp += borderTopWidth[0] * Math.max(this.root.width, this.root.height) * 0.01;
      }
      else if(borderTopWidth[1] === VMIN) {
        mp += borderTopWidth[0] * Math.min(this.root.width, this.root.height) * 0.01;
      }
      if(borderBottomWidth[1] === PX) {
        mp += borderBottomWidth[0];
      }
      else if(borderBottomWidth[1] === REM) {
        mp += borderBottomWidth[0] * this.root.computedStyle[FONT_SIZE];
      }
      else if(borderBottomWidth[1] === VW) {
        mp += borderBottomWidth[0] * this.root.width * 0.01;
      }
      else if(borderBottomWidth[1] === VH) {
        mp += borderBottomWidth[0] * this.root.height * 0.01;
      }
      else if(borderBottomWidth[1] === VMAX) {
        mp += borderBottomWidth[0] * Math.max(this.root.width, this.root.height) * 0.01;
      }
      else if(borderBottomWidth[1] === VMIN) {
        mp += borderBottomWidth[0] * Math.min(this.root.width, this.root.height) * 0.01;
      }
      res = res.map(item => item + mp);
    }
    return res;
  }

  // absolute且无尺寸时，isVirtual标明先假布局一次计算尺寸，还有flex列计算时
  // fromAbs为absolute节点特有省略计算标识，本节点是abs时真正布局传入
  __layout(data, isVirtual, fromAbs) {
    css.computeReflow(this, this.isShadowRoot);
    let { w } = data;
    let { isDestroyed, currentStyle, computedStyle, __config } = this;
    let {
      [DISPLAY]: display,
    } = computedStyle;
    let {
      [WIDTH]: width,
      [POSITION]: position,
    } = currentStyle;
    this.clearCache();
    this.__layoutData = {
      x: data.x,
      y: data.y,
      w: data.w,
      h: data.h,
      lx: data.lx,
    };
    __config[NODE_REFRESH_LV] = REFLOW;
    __config[NODE_LIMIT_CACHE] = false;
    __config[NODE_IS_INLINE] = false;
    // 防止display:none不统计mask，isVirtual忽略，abs布局后续会真正来走一遍
    if(!isVirtual) {
      let { next } = this;
      // mask关系只有布局才会变更，普通渲染关系不会改变，clip也是mask的一种
      if(!this.isMask && next && (next.isMask)) {
        let count = 0;
        while(next) {
          if(next.isMask) {
            count++;
          }
          else {
            break;
          }
          next = next.next;
        }
        this.__hasMask = count;
      }
    }
    this.__ox = this.__oy = 0;
    if(isDestroyed || display === 'none') {
      this.__width = this.__height
        = this.__clientWidth = this.__clientHeight
        = this.__offsetWidth = this.__offsetHeight
        = this.__outerWidth = this.__outerHeight
        = computedStyle[WIDTH] = computedStyle[HEIGHT] = 0;
      this.__x = data.x;
      this.__y = data.y;
      this.__layoutNone();
      return;
    }
    // margin/padding在abs前已经计算过了，无需二次计算
    if(!fromAbs) {
      this.__mp(currentStyle, computedStyle, w);
    }
    // inline的width/height无效，其它有效
    if(width[1] !== AUTO) {
      if(this.__isRealInline() && currentStyle[DISPLAY] === 'inline') {
        width[0] = 0;
        width[1] = AUTO;
      }
      else {
        switch(width[1]) {
          case PX:
            w = width[0];
            break;
          case PERCENT:
            w *= width[0] * 0.01;
            break;
          case REM:
            w = width[0] * this.root.computedStyle[FONT_SIZE];
            break;
          case VW:
            w = width[0] * this.root.width * 0.01;
            break;
          case VH:
            w = width[0] * this.root.height * 0.01;
            break;
          case VMAX:
            w = width[0] * Math.max(this.root.width, this.root.height) * 0.01;
            break;
          case VMIN:
            w = width[0] * Math.min(this.root.width, this.root.height) * 0.01;
            break;
        }
      }
    }
    let lineClampCount = 0;
    // 4种布局，默认block，inlineBlock基本可以复用inline逻辑，除了尺寸
    if(display === 'flex') {
      this.__layoutFlex(data, isVirtual);
    }
    else if(display === 'inlineBlock' || display === 'inline-block') {
      lineClampCount = this.__layoutInline(data, isVirtual);
    }
    else if(display === 'inline') {
      lineClampCount = this.__layoutInline(data, isVirtual, true);
    }
    else {
      this.__layoutBlock(data, isVirtual);
    }
    // relative渲染时做偏移，百分比基于父元素，若父元素没有定高则为0
    if(position === 'relative') {
      let { [TOP]: top, [RIGHT]: right, [BOTTOM]: bottom, [LEFT]: left } = currentStyle;
      let { parent } = this;
      if(top[1] !== AUTO) {
        let n = calRelative(currentStyle, TOP, top, parent);
        this.__offsetY(n);
        computedStyle[TOP] = n;
        computedStyle[BOTTOM] = 'auto';
      }
      else if(bottom[1] !== AUTO) {
        let n = calRelative(currentStyle, BOTTOM, bottom, parent);
        this.__offsetY(-n);
        computedStyle[BOTTOM] = n;
        computedStyle[TOP] = 'auto';
      }
      else {
        computedStyle[TOP] = computedStyle[BOTTOM] = 'auto';
      }
      if(left[1] !== AUTO) {
        let n = calRelative(currentStyle, LEFT, left, parent, true);
        this.__offsetX(n);
        computedStyle[LEFT] = n;
        computedStyle[RIGHT] = 'auto';
      }
      else if(right[1] !== AUTO) {
        let n = calRelative(currentStyle, RIGHT, right, parent, true);
        this.__offsetX(-n);
        computedStyle[RIGHT] = n;
        computedStyle[LEFT] = 'auto';
      }
      else {
        computedStyle[LEFT] = computedStyle[RIGHT] = 'auto';
      }
    }
    else if(position !== 'absolute') {
      computedStyle[TOP] = computedStyle[BOTTOM] = computedStyle[LEFT] = computedStyle[RIGHT] = 'auto';
    }
    // 计算结果存入computedStyle和6个坐标，inline在其inlineSize特殊处理
    let x = this.__sx = this.x + this.ox;
    let y = this.__sy = this.y + this.oy;
    if(!__config[NODE_IS_INLINE]) {
      x = this.__sx1 = x + computedStyle[MARGIN_LEFT];
      x = this.__sx2 = x + computedStyle[BORDER_LEFT_WIDTH];
      x = this.__sx3 = x + computedStyle[PADDING_LEFT];
      x = this.__sx4 = x + this.width;
      x = this.__sx5 = x + computedStyle[PADDING_RIGHT];
      this.__sx6 = x + computedStyle[BORDER_RIGHT_WIDTH];
      y = this.__sy1 = y + computedStyle[MARGIN_TOP];
      y = this.__sy2 = y + computedStyle[BORDER_TOP_WIDTH];
      y = this.__sy3 = y + computedStyle[PADDING_TOP];
      y = this.__sy4 = y + this.height;
      y = this.__sy5 = y + computedStyle[PADDING_BOTTOM];
      this.__sy6 = y + computedStyle[BORDER_BOTTOM_WIDTH];
    }
    computedStyle[WIDTH] = this.width;
    computedStyle[HEIGHT] = this.height;
    // abs布局的不执行，在__layoutAbs末尾做，防止未布局没有尺寸从而动画计算错误
    if(!fromAbs) {
      this.__execAr();
    }
    return lineClampCount;
  }

  __execAr() {
    // 动态json引用时动画暂存，第一次布局时处理这些动画到root的animateController上
    let ar = this.__animateRecords;
    if(ar) {
      this.__animateRecords = null;
      // parse没有dom时，animate的target引用都是json，vd后生成需重新赋值
      ar.list.forEach(item => {
        if(item.target.vd instanceof Xom) {
          item.target = item.target.vd;
        }
      });
      let ac = ar.controller || this.root.animateController;
      // 不自动播放进入记录列表，初始化并等待手动调用
      if(ar.options && ar.options.autoPlay === false) {
        ac.__records2 = ac.__records2.concat(ar.list);
        ac.init(ac.__records2, ac.list2);
      }
      else {
        ac.__records = ac.__records.concat(ar.list);
        ac.__playAuto();
      }
    }
  }

  __layoutNone() {
    let { computedStyle } = this;
    computedStyle[DISPLAY] = 'none';
    computedStyle[MARGIN_TOP]
      = computedStyle[MARGIN_RIGHT]
      = computedStyle[MARGIN_BOTTOM]
      = computedStyle[MARGIN_LEFT]
      = computedStyle[PADDING_TOP]
      = computedStyle[PADDING_RIGHT]
      = computedStyle[PADDING_BOTTOM]
      = computedStyle[PADDING_LEFT]
      = 0;
  }

  // 预先计算是否是固定宽高，布局点位和尺寸考虑margin/border/padding
  __preLayout(data, isInline) {
    let { x, y, w, h, w2, h2, w3, h3, lx, nowrap, lineBoxManager, endSpace = 0 } = data;
    this.__x = x;
    this.__y = y;
    let { currentStyle, computedStyle } = this;
    let {
      [WIDTH]: width,
      [HEIGHT]: height,
    } = currentStyle;
    let {
      [BORDER_TOP_WIDTH]: borderTopWidth,
      [BORDER_RIGHT_WIDTH]: borderRightWidth,
      [BORDER_BOTTOM_WIDTH]: borderBottomWidth,
      [BORDER_LEFT_WIDTH]: borderLeftWidth,
      [MARGIN_TOP]: marginTop,
      [MARGIN_RIGHT]: marginRight,
      [MARGIN_BOTTOM]: marginBottom,
      [MARGIN_LEFT]: marginLeft,
      [PADDING_TOP]: paddingTop,
      [PADDING_RIGHT]: paddingRight,
      [PADDING_BOTTOM]: paddingBottom,
      [PADDING_LEFT]: paddingLeft,
    } = computedStyle;
    // 除了auto外都是固定宽高度
    let fixedWidth;
    let fixedHeight;
    // 绝对定位是left+right这种其实等于定义了width，但不能修改原始style，存入特殊变量标识
    if(w2 !== undefined) {
      fixedWidth = true;
      w = w2;
    }
    // flex时也会用到，子级得出目标主尺寸后按这个来
    else if(w3 !== undefined) {
      fixedWidth = true;
      w = w3;
    }
    else if(width[1] !== AUTO) {
      fixedWidth = true;
      switch(width[1]) {
        case PX:
          w = width[0];
          break;
        case PERCENT:
          w *= width[0] * 0.01;
          break;
        case REM:
          w = width[0] * this.root.computedStyle[FONT_SIZE];
          break;
        case VW:
          w = width[0] * this.root.width * 0.01;
          break;
        case VH:
          w = width[0] * this.root.height * 0.01;
          break;
        case VMAX:
          w = width[0] * Math.max(this.root.width, this.root.height) * 0.01;
          break;
        case VMIN:
          w = width[0] * Math.min(this.root.width, this.root.height) * 0.01;
          break;
      }
    }
    if(h2 !== undefined) {
      fixedHeight = true;
      h = h2;
    }
    else if(h3 !== undefined) {
      fixedHeight = true;
      h = h3;
    }
    else if(height[1] !== AUTO) {
      fixedHeight = true;
      switch(height[1]) {
        case PX:
          h = height[0];
          break;
        case PERCENT:
          h *= height[0] * 0.01;
          break;
        case REM:
          h = height[0] * this.root.computedStyle[FONT_SIZE];
          break;
        case VW:
          h = height[0] * this.root.width * 0.01;
          break;
        case VH:
          h = height[0] * this.root.height * 0.01;
          break;
        case VMAX:
          h = height[0] * Math.max(this.root.width, this.root.height) * 0.01;
          break;
        case VMIN:
          h = height[0] * Math.min(this.root.width, this.root.height) * 0.01;
          break;
      }
    }
    // margin/padding/border影响x和y和尺寸，注意inline的y不受mpb影响
    x += borderLeftWidth + marginLeft + paddingLeft;
    data.x = x;
    if(!isInline) {
      y += borderTopWidth + marginTop + paddingTop;
    }
    data.y = y;
    // inline的w/h很特殊，需不考虑inline自身水平的mpb以便换行，因为mpb只在首尾行生效，所以首尾需特殊处理中间忽略
    // 当嵌套inline时更加复杂，假如inline有尾部mpb，最后一行需考虑，如果此inline是父的最后一个且父有mpb需叠加
    let selfEndSpace = 0;
    if(isInline) {
      selfEndSpace = paddingRight + borderRightWidth + marginRight;
    }
    // 传入w3/h3时，flex的item已知目标主尺寸，需减去mpb，其一定是block和inline互斥
    if(!isInline) {
      if(width[1] === AUTO || w3 !== undefined) {
        w -= borderLeftWidth + borderRightWidth + marginLeft + marginRight + paddingLeft + paddingRight;
      }
      if(height[1] === AUTO || h3 !== undefined) {
        h -= borderTopWidth + borderBottomWidth + marginTop + marginBottom + paddingTop + paddingBottom;
      }
    }
    return {
      fixedWidth,
      fixedHeight,
      x,
      y,
      w,
      h,
      lx,
      lineBoxManager,
      nowrap,
      endSpace,
      selfEndSpace,
    };
  }

  // 处理margin:xx auto居中对齐或右对齐
  __marginAuto(style, data) {
    let {
      [POSITION]: position,
      [DISPLAY]: display,
      [MARGIN_LEFT]: marginLeft,
      [MARGIN_RIGHT]: marginRight,
      [WIDTH]: width,
    } = style;
    if(position !== 'absolute' && (display === 'block' || display === 'flex')
      && (width[1] !== AUTO || this.tagName === 'img') && marginLeft[1] === AUTO && marginRight[1] === AUTO) {
      let ow = this.outerWidth;
      if(ow < data.w) {
        this.__offsetX((data.w - ow) * 0.5, true);
      }
    }
  }

  __calMatrix(lv, __cacheStyle, currentStyle, computedStyle, __config, sx1, sy1, offsetWidth, offsetHeight) {
    if(__config[NODE_IS_INLINE]) {
      computedStyle[TRANSFORM_ORIGIN] = [sx1, sy1];
      return __cacheStyle[MATRIX] = mx.identity();
    }
    let matrixCache = __cacheStyle[MATRIX];
    // tx/ty变化特殊优化
    if(matrixCache && lv < REFLOW && !contain(lv, TF)) {
      let x = 0, y = 0, z = 0;
      if(contain(lv, TX)) {
        let v = currentStyle[TRANSLATE_X];
        if(isNil(v)) {
          v = 0;
        }
        else if(v[1] === PERCENT) {
          v = v[0] * this.offsetWidth * 0.01;
        }
        else if(v[1] === REM) {
          v = v[0] * this.root.computedStyle[FONT_SIZE];
        }
        else if(v[1] === VW) {
          v = v[0] * this.root.width * 0.01;
        }
        else if(v[1] === VH) {
          v = v[0] * this.root.height * 0.01;
        }
        else if(v[1] === VMAX) {
          v = v[0] * Math.max(this.root.width, this.root.height) * 0.01;
        }
        else if(v[1] === VMIN) {
          v = v[0] * Math.min(this.root.width, this.root.height) * 0.01;
        }
        else {
          v = v[0];
        }
        x = v - (computedStyle[TRANSLATE_X] || 0);
        computedStyle[TRANSLATE_X] = v;
        computedStyle[TRANSFORM][12] += x;
        matrixCache[12] += x;
      }
      if(contain(lv, TY)) {
        let v = currentStyle[TRANSLATE_Y];
        if(isNil(v)) {
          v = 0;
        }
        else if(v[1] === PERCENT) {
          v = v[0] * this.offsetHeight * 0.01;
        }
        else if(v[1] === REM) {
          v = v[0] * this.root.computedStyle[FONT_SIZE];
        }
        else if(v[1] === VW) {
          v = v[0] * this.root.width * 0.01;
        }
        else if(v[1] === VH) {
          v = v[0] * this.root.height * 0.01;
        }
        else if(v[1] === VMAX) {
          v = v[0] * Math.max(this.root.width, this.root.height) * 0.01;
        }
        else if(v[1] === VMIN) {
          v = v[0] * Math.min(this.root.width, this.root.height) * 0.01;
        }
        else {
          v = v[0];
        }
        y = v - (computedStyle[TRANSLATE_Y] || 0);
        computedStyle[TRANSLATE_Y] = v;
        computedStyle[TRANSFORM][13] += y;
        matrixCache[13] += y;
      }
      if(contain(lv, TZ)) {
        let v = currentStyle[TRANSLATE_Z];
        if(isNil(v)) {
          v = 0;
        }
        else if(v[1] === PERCENT) {
          v = v[0] * this.offsetWidth * 0.01;
        }
        else if(v[1] === REM) {
          v = v[0] * this.root.computedStyle[FONT_SIZE];
        }
        else if(v[1] === VW) {
          v = v[0] * this.root.width * 0.01;
        }
        else if(v[1] === VH) {
          v = v[0] * this.root.height * 0.01;
        }
        else if(v[1] === VMAX) {
          v = v[0] * Math.max(this.root.width, this.root.height) * 0.01;
        }
        else if(v[1] === VMIN) {
          v = v[0] * Math.min(this.root.width, this.root.height) * 0.01;
        }
        else {
          v = v[0];
        }
        z = v - (computedStyle[TRANSLATE_Z] || 0);
        computedStyle[TRANSLATE_Z] = v;
        computedStyle[TRANSFORM][14] += z;
        matrixCache[14] += z;
      }
      __cacheStyle[MATRIX] = matrixCache;
    }
    // 先根据cache计算需要重新计算的computedStyle
    else {
      if(sx1 === undefined) {
        sx1 = this.__sx1;
        sy1 = this.__sy1;
        offsetWidth = this.offsetWidth;
        offsetHeight = this.offsetHeight;
      }
      if(__cacheStyle[TRANSFORM_ORIGIN] === undefined) {
        __cacheStyle[TRANSFORM_ORIGIN] = true;
        matrixCache = null;
        computedStyle[TRANSFORM_ORIGIN] = tf.calOrigin(currentStyle[TRANSFORM_ORIGIN], offsetWidth, offsetHeight, this.root);
      }
      if(__cacheStyle[TRANSFORM] === undefined
        || __cacheStyle[TRANSLATE_X] === undefined
        || __cacheStyle[TRANSLATE_Y] === undefined
        || __cacheStyle[TRANSLATE_Z] === undefined
        || __cacheStyle[ROTATE_X] === undefined
        || __cacheStyle[ROTATE_Y] === undefined
        || __cacheStyle[ROTATE_Z] === undefined
        || __cacheStyle[ROTATE_3D] === undefined
        || __cacheStyle[SCALE_X] === undefined
        || __cacheStyle[SCALE_Y] === undefined
        || __cacheStyle[SCALE_Z] === undefined
        || __cacheStyle[SKEW_X] === undefined
        || __cacheStyle[SKEW_Y] === undefined) {
        __cacheStyle[TRANSFORM]
          = __cacheStyle[TRANSLATE_X]
          = __cacheStyle[TRANSLATE_Y]
          = __cacheStyle[TRANSLATE_Z]
          = __cacheStyle[ROTATE_X]
          = __cacheStyle[ROTATE_Y]
          = __cacheStyle[ROTATE_Z]
          = __cacheStyle[SCALE_X]
          = __cacheStyle[SCALE_Y]
          = __cacheStyle[SCALE_Z]
          = __cacheStyle[SKEW_X]
          = __cacheStyle[SKEW_Y]
          = true;
        matrixCache = null;
        let matrix;
        // transform相对于自身
        if(currentStyle[TRANSFORM]) {
          matrix = tf.calMatrix(currentStyle[TRANSFORM], offsetWidth, offsetHeight, this.root);
        }
        // 没有transform则看是否有扩展的css独立变换属性
        else {
          let temp = [];
          [
            TRANSLATE_X,
            TRANSLATE_Y,
            TRANSLATE_Z,
            ROTATE_X,
            ROTATE_Y,
            ROTATE_Z,
            ROTATE_3D,
            SKEW_X,
            SKEW_Y,
            SCALE_X,
            SCALE_Y,
            SCALE_Z,
          ].forEach(k => {
            // 删除之前遗留的
            delete computedStyle[k];
            let v = currentStyle[k];
            if(isNil(v)) {
              return;
            }
            if(k === ROTATE_3D) {
              computedStyle[k] = [v[0], v[1], v[2], v[3][0]];
              if(v[3][0] === 0) {
                return;
              }
              temp.push([k, v]);
              return;
            }
            computedStyle[k] = v[0];
            // scale为1和其它为0避免计算浪费
            let isScale = k === SCALE_X || k === SCALE_Y || k === SCALE_Z;
            if(v[0] === 1 && isScale || !isScale && v[0] === 0) {
              return;
            }
            if(v[1] === PERCENT) {
              if(k === TRANSLATE_X || k === TRANSLATE_Z) {
                computedStyle[k] = v[0] * offsetWidth * 0.01;
              }
              else if(k === TRANSLATE_Y) {
                computedStyle[k] = v[0] * offsetHeight * 0.01;
              }
            }
            else if(v[1] === REM) {
              if(k === TRANSLATE_X || k === TRANSLATE_Z) {
                computedStyle[k] = v[0] * this.root.computedStyle[FONT_SIZE];
              }
              else if(k === TRANSLATE_Y) {
                computedStyle[k] = v[0] * this.root.computedStyle[FONT_SIZE];
              }
            }
            else if(v[1] === VW) {
              if(k === TRANSLATE_X || k === TRANSLATE_Z) {
                computedStyle[k] = v[0] * this.root.width * 0.01;
              }
              else if(k === TRANSLATE_Y) {
                computedStyle[k] = v[0] * this.root.width * 0.01;
              }
            }
            else if(v[1] === VH) {
              if(k === TRANSLATE_X || k === TRANSLATE_Z) {
                computedStyle[k] = v[0] * this.root.height * 0.01;
              }
              else if(k === TRANSLATE_Y) {
                computedStyle[k] = v[0] * this.root.height * 0.01;
              }
            }
            else if(v[1] === VMAX) {
              if(k === TRANSLATE_X || k === TRANSLATE_Z) {
                computedStyle[k] = v[0] * Math.max(this.root.width, this.root.height) * 0.01;
              }
              else if(k === TRANSLATE_Y) {
                computedStyle[k] = v[0] * Math.max(this.root.width, this.root.height) * 0.01;
              }
            }
            else if(v[1] === VMIN) {
              if(k === TRANSLATE_X || k === TRANSLATE_Z) {
                computedStyle[k] = v[0] * Math.min(this.root.width, this.root.height) * 0.01;
              }
              else if(k === TRANSLATE_Y) {
                computedStyle[k] = v[0] * Math.min(this.root.width, this.root.height) * 0.01;
              }
            }
            temp.push([k, v]);
          });
          if(temp.length) {
            matrix = tf.calMatrix(temp, offsetWidth, offsetHeight, this.root);
          }
        }
        computedStyle[TRANSFORM] = matrix || mx.identity();
      }
      if(!matrixCache) {
        let m = computedStyle[TRANSFORM];
        let tfo = computedStyle[TRANSFORM_ORIGIN].slice(0);
        tfo[0] += sx1 || 0;
        tfo[1] += sy1 || 0;
        matrixCache = __cacheStyle[MATRIX] = tf.calMatrixByOrigin(m, tfo);
      }
    }
    return matrixCache;
  }

  /**
   * 将currentStyle计算为computedStyle，同时存入cacheStyle可缓存的结果防止无变更重复计算
   * @param renderMode
   * @param ctx
   * @param parent
   * @param __cacheStyle
   * @param currentStyle
   * @param computedStyle
   * @param clientWidth
   * @param clientHeight
   * @param offsetWidth
   * @param offsetHeight
   * @param borderTopWidth
   * @param borderRightWidth
   * @param borderBottomWidth
   * @param borderLeftWidth
   * @param paddingTop
   * @param paddingRight
   * @param paddingBottom
   * @param paddingLeft
   * @param x1
   * @param x2
   * @param x3
   * @param x4
   * @param x5
   * @param x6
   * @param y1
   * @param y2
   * @param y3
   * @param y4
   * @param y5
   * @param y6
   * @returns {*[]}
   * @private
   */
  __calCache(renderMode, ctx, parent, __cacheStyle, currentStyle, computedStyle,
             clientWidth, clientHeight, offsetWidth, offsetHeight,
             borderTopWidth, borderRightWidth, borderBottomWidth, borderLeftWidth,
             paddingTop, paddingRight, paddingBottom, paddingLeft,
             x1, x2, x3, x4, x5, x6, y1, y2, y3, y4, y5, y6) {
    let bx1 = x1, by1 = y1, bx2 = x6, by2 = y6;
    let backgroundClip = computedStyle[BACKGROUND_CLIP] = currentStyle[BACKGROUND_CLIP];
    // 默认border-box
    if(backgroundClip === 'paddingBox' || backgroundClip === 'padding-box') {
      bx1 = x2;
      by1 = y2;
      bx2 = x5;
      by2 = y5;
    }
    else if(backgroundClip === 'contentBox' || backgroundClip === 'content-box') {
      bx1 = x3;
      by1 = y3;
      bx2 = x4;
      by2 = y4;
    }
    let isInline = this.__config[NODE_IS_INLINE];
    if(isInline && !this.contentBoxList.length) {
      isInline = false;
    }
    // 这些直接赋值的不需要再算缓存
    [
      OPACITY,
      Z_INDEX,
      BORDER_TOP_STYLE,
      BORDER_RIGHT_STYLE,
      BORDER_BOTTOM_STYLE,
      BORDER_LEFT_STYLE,
      BACKGROUND_REPEAT,
      OVERFLOW,
      MIX_BLEND_MODE,
      TEXT_OVERFLOW,
      BACKGROUND_CLIP,
    ].forEach(k => {
      computedStyle[k] = currentStyle[k];
    });
    if(isNil(__cacheStyle[FILTER])) {
      __cacheStyle[FILTER] = true;
      this.__calFilter(currentStyle, computedStyle);
    }
    if(isNil(__cacheStyle[BACKGROUND_POSITION_X])) {
      __cacheStyle[BACKGROUND_POSITION_X] = true;
      let {
        [BACKGROUND_POSITION_X]: bgX,
      } = currentStyle;
      computedStyle[BACKGROUND_POSITION_X] = (bgX || []).map(item => {
        if(item[1] === PX) {
          return item[0];
        }
        if(item[1] === REM) {
          return item[0] * this.root.computedStyle[FONT_SIZE];
        }
        if(item[1] === VW) {
          return item[0] * this.root.width * 0.01;
        }
        if(item[1] === VH) {
          return item[0] * this.root.height * 0.01;
        }
        if(item[1] === VMAX) {
          return item[0] * Math.max(this.root.width, this.root.height) * 0.01;
        }
        if(item[1] === VMIN) {
          return item[0] * Math.min(this.root.width, this.root.height) * 0.01;
        }
        if(item[1] === PERCENT) {
          return item[0] + '%';
        }
      });
    }
    if(isNil(__cacheStyle[BACKGROUND_POSITION_Y])) {
      __cacheStyle[BACKGROUND_POSITION_Y] = true;
      let {
        [BACKGROUND_POSITION_Y]: bgY,
      } = currentStyle;
      computedStyle[BACKGROUND_POSITION_Y] = (bgY || []).map(item => {
        if(item[1] === PX) {
          return item[0];
        }
        if(item[1] === REM) {
          return item[0] * this.root.computedStyle[FONT_SIZE];
        }
        if(item[1] === VW) {
          return item[0] * this.root.width * 0.01;
        }
        if(item[1] === VH) {
          return item[0] * this.root.height * 0.01;
        }
        if(item[1] === VMAX) {
          return item[0] * Math.max(this.root.width, this.root.height) * 0.01;
        }
        if(item[1] === VMIN) {
          return item[0] * Math.min(this.root.width, this.root.height) * 0.01;
        }
        if(item[1] === PERCENT) {
          return item[0] + '%';
        }
      });
    }
    if(isNil(__cacheStyle[BACKGROUND_SIZE])) {
      __cacheStyle[BACKGROUND_SIZE] = true;
      computedStyle[BACKGROUND_SIZE] = (currentStyle[BACKGROUND_SIZE] || []).map(item => {
        return bg.calBackgroundSize(item, bx2 - bx1, by2 - by1, this.root);
      });
    }
    if(isNil(__cacheStyle[BACKGROUND_IMAGE])) {
      let bgI = computedStyle[BACKGROUND_IMAGE] = currentStyle[BACKGROUND_IMAGE].slice(0);
      __cacheStyle[BACKGROUND_IMAGE] = bgI.map((bgi, i) => {
        if(!bgi) {
          return null;
        }
        // 防止隐藏不加载背景图
        if(util.isString(bgi)) {
          let loadBgi = this.__loadBgi[i] = this.__loadBgi[i] || {};
          let cache = inject.IMG[BACKGROUND_IMAGE];
          if(cache && cache.state === inject.LOADED) {
            loadBgi.url = BACKGROUND_IMAGE;
            loadBgi.source = cache.source;
            loadBgi.width = cache.width;
            loadBgi.height = cache.height;
          }
          else if(loadBgi.url !== bgi) {
            // 可能改变导致多次加载，每次清空，成功后还要比对url是否相同
            loadBgi.url = bgi;
            loadBgi.source = null;
            let node = this;
            let root = node.root;
            inject.measureImg(bgi, data => {
              // 还需判断url，防止重复加载时老的替换新的，失败不绘制bgi
              if(data.success && data.url === loadBgi.url && !this.isDestroyed) {
                loadBgi.source = data.source;
                loadBgi.width = data.width;
                loadBgi.height = data.height;
                root.delRefreshTask(loadBgi.cb);
                root.addRefreshTask(loadBgi.cb = {
                  __before() {
                    __cacheStyle[BACKGROUND_IMAGE] = undefined;
                    let res = {};
                    res[UPDATE_NODE] = node;
                    res[UPDATE_FOCUS] = REPAINT;
                    res[UPDATE_CONFIG] = node.__config;
                    root.__addUpdate(node, node.__config, root, root.__config, res);
                  },
                });
              }
            }, {
              ctx,
              root,
              width: bx2 - bx1,
              height: by2 - by1,
            });
          }
          return true;
        }
        else if(!isInline && bgi.k) {
          // gradient在渲染时才生成
          return true;
        }
      });
    }
    if(isNil(__cacheStyle[BOX_SHADOW])) {
      __cacheStyle[BOX_SHADOW] = true;
      computedStyle[BOX_SHADOW] = (currentStyle[BOX_SHADOW] || []).map(item => {
        return item.map((item2, i) => {
          if(i > 3) {
            return item2;
          }
          let v = item2[0];
          if(item2[1] === PERCENT) {
            if(i % 2 === 0) {
              v *= 0.01 * (bx2 - bx1);
            }
            else {
              v *= 0.01 * (by2 - by1);
            }
          }
          else if(item2[1] === REM) {
            v = v * this.root.computedStyle[FONT_SIZE];
          }
          else if(item2[1] === VW) {
            v = v * this.root.width * 0.01;
          }
          else if(item2[1] === VH) {
            v = v * this.root.height * 0.01;
          }
          else if(item2[1] === VMAX) {
            v = v * Math.max(this.root.width, this.root.height) * 0.01;
          }
          else if(item2[1] === VMIN) {
            v = v * Math.min(this.root.width, this.root.height) * 0.01;
          }
          return v;
        });
      });
    }
    [
      BACKGROUND_COLOR,
      BORDER_TOP_COLOR,
      BORDER_RIGHT_COLOR,
      BORDER_BOTTOM_COLOR,
      BORDER_LEFT_COLOR,
    ].forEach(k => {
      if(isNil(__cacheStyle[k])) {
        __cacheStyle[k] = int2rgba(computedStyle[k] = currentStyle[k][0]);
      }
    });
    // 圆角边计算
    if(isNil(__cacheStyle[BORDER_TOP_LEFT_RADIUS])
      || isNil(__cacheStyle[BORDER_TOP_RIGHT_RADIUS])
      || isNil(__cacheStyle[BORDER_BOTTOM_RIGHT_RADIUS])
      || isNil(__cacheStyle[BORDER_BOTTOM_LEFT_RADIUS])) {
      __cacheStyle[BORDER_TOP_LEFT_RADIUS]
        = __cacheStyle[BORDER_TOP_RIGHT_RADIUS]
        = __cacheStyle[BORDER_BOTTOM_RIGHT_RADIUS]
        = __cacheStyle[BORDER_BOTTOM_LEFT_RADIUS]
        = true;
      // 非替代的inline计算看contentBox首尾
      if(isInline) {
        border.calBorderRadiusInline(this.contentBoxList, currentStyle, computedStyle, this.root);
      }
      // 普通block整体计算
      else {
        border.calBorderRadius(offsetWidth, offsetHeight, currentStyle, computedStyle, this.root);
      }
    }
    // width/style/radius影响border，color不影响渲染缓存
    let btlr = computedStyle[BORDER_TOP_LEFT_RADIUS];
    let btrr = computedStyle[BORDER_TOP_RIGHT_RADIUS];
    let bbrr = computedStyle[BORDER_BOTTOM_RIGHT_RADIUS];
    let bblr = computedStyle[BORDER_BOTTOM_LEFT_RADIUS];
    ['Top', 'Right', 'Bottom', 'Left'].forEach(k => {
      k = 'border' + k;
      let k2 = STYLE_KEY[style2Upper(k)];
      let kw = STYLE_KEY[style2Upper(k + 'Width')];
      let ks = STYLE_KEY[style2Upper(k + 'Style')];
      // width/style变更影响border重新计算
      if(isNil(__cacheStyle[kw])) {
        __cacheStyle[kw] = true;
        __cacheStyle[k2] = undefined;
      }
      if(isNil(__cacheStyle[ks])) {
        __cacheStyle[ks] = true;
        __cacheStyle[k2] = undefined;
      }
      if(isNil(__cacheStyle[k2])) {
        if(k2 === BORDER_TOP) {
          if(borderTopWidth > 0) {
            if(!isInline) {
              let deg1 = Math.atan(borderTopWidth / borderLeftWidth);
              let deg2 = Math.atan(borderTopWidth / borderRightWidth);
              __cacheStyle[k2] = border.calPoints(borderTopWidth, computedStyle[ks], deg1, deg2,
                x1, x2, x5, x6, y1, y2, y5, y6, 0, btlr, btrr);
            }
          }
          else {
            __cacheStyle[k2] = [];
          }
        }
        else if(k2 === BORDER_RIGHT) {
          if(borderRightWidth > 0) {
            if(!isInline) {
              let deg1 = Math.atan(borderRightWidth / borderTopWidth);
              let deg2 = Math.atan(borderRightWidth / borderBottomWidth);
              __cacheStyle[k2] = border.calPoints(borderRightWidth, computedStyle[ks], deg1, deg2,
                x1, x2, x5, x6, y1, y2, y5, y6, 1, btrr, bbrr);
            }
          }
          else {
            __cacheStyle[k2] = [];
          }
        }
        else if(k2 === BORDER_BOTTOM) {
          if(borderBottomWidth > 0) {
            if(!isInline) {
              let deg1 = Math.atan(borderBottomWidth / borderLeftWidth);
              let deg2 = Math.atan(borderBottomWidth / borderRightWidth);
              __cacheStyle[k2] = border.calPoints(borderBottomWidth, computedStyle[ks], deg1, deg2,
                x1, x2, x5, x6, y1, y2, y5, y6, 2, bblr, bbrr);
            }
          }
          else {
            __cacheStyle[k2] = [];
          }
        }
        else if(k2 === BORDER_LEFT) {
          if(borderLeftWidth > 0) {
            if(!isInline) {
              let deg1 = Math.atan(borderLeftWidth / borderTopWidth);
              let deg2 = Math.atan(borderLeftWidth / borderBottomWidth);
              __cacheStyle[k2] = border.calPoints(borderLeftWidth, computedStyle[ks], deg1, deg2,
                x1, x2, x5, x6, y1, y2, y5, y6, 3, btlr, bblr);
            }
          }
          else {
            __cacheStyle[k2] = [];
          }
        }
      }
    });
    // 强制计算继承性的
    let parentComputedStyle = parent && parent.computedStyle;
    if(currentStyle[FONT_STYLE][1] === INHERIT) {
      computedStyle[FONT_STYLE] = parent ? parentComputedStyle[FONT_STYLE] : 'normal';
    }
    else if(isNil(__cacheStyle[FONT_STYLE])) {
      computedStyle[FONT_STYLE] = currentStyle[FONT_STYLE][0];
    }
    __cacheStyle[FONT_STYLE] = computedStyle[FONT_STYLE];
    if(currentStyle[COLOR][1] === INHERIT) {
      computedStyle[COLOR] = parent ? parentComputedStyle[COLOR] : [0, 0, 0, 1];
      __cacheStyle[COLOR] = int2rgba(computedStyle[COLOR]);
    }
    else if(isNil(__cacheStyle[COLOR])) {
      computedStyle[COLOR] = rgba2int(currentStyle[COLOR][0]);
      __cacheStyle[COLOR] = int2rgba(computedStyle[COLOR]);
    }
    if(currentStyle[TEXT_STROKE_COLOR][1] === INHERIT) {
      computedStyle[TEXT_STROKE_COLOR] = parent ? parentComputedStyle[TEXT_STROKE_COLOR] : [0, 0, 0, 1];
      __cacheStyle[TEXT_STROKE_COLOR] = int2rgba(computedStyle[TEXT_STROKE_COLOR]);
    }
    else if(isNil(__cacheStyle[TEXT_STROKE_COLOR])) {
      computedStyle[TEXT_STROKE_COLOR] = rgba2int(currentStyle[TEXT_STROKE_COLOR][0]);
      __cacheStyle[TEXT_STROKE_COLOR] = int2rgba(computedStyle[TEXT_STROKE_COLOR]);
    }
    if(currentStyle[TEXT_STROKE_WIDTH][1] === INHERIT) {
      computedStyle[TEXT_STROKE_WIDTH] = parent ? parentComputedStyle[TEXT_STROKE_WIDTH] : 0;
      __cacheStyle[TEXT_STROKE_WIDTH] = true;
    }
    else if(isNil(__cacheStyle[TEXT_STROKE_WIDTH])) {
      let v = currentStyle[TEXT_STROKE_WIDTH];
      if(v[1] === REM) {
        v = v[0] * this.root.computedStyle[FONT_SIZE];
      }
      else if(v[1] === VW) {
        v = v[0] * this.root.width * 0.01;
      }
      else if(v[1] === VH) {
        v = v[0] * this.root.height * 0.01;
      }
      else if(v[1] === VMAX) {
        v = v[0] * Math.max(this.root.width, this.root.height) * 0.01;
      }
      else if(v[1] === VMIN) {
        v = v[0] * Math.min(this.root.width, this.root.height) * 0.01;
      }
      else {
        v = v[0];
      }
      computedStyle[TEXT_STROKE_WIDTH] = v;
      __cacheStyle[TEXT_STROKE_WIDTH] = true;
    }
    if(currentStyle[TEXT_STROKE_OVER][1] === INHERIT) {
      __cacheStyle[TEXT_STROKE_OVER] = computedStyle[TEXT_STROKE_OVER] = parent ? parentComputedStyle[TEXT_STROKE_OVER] : 'none';
    }
    else {
      __cacheStyle[TEXT_STROKE_OVER] = computedStyle[TEXT_STROKE_OVER] = currentStyle[TEXT_STROKE_OVER][0];
    }
    if(currentStyle[VISIBILITY][1] === INHERIT) {
      computedStyle[VISIBILITY] = parent ? parentComputedStyle[VISIBILITY] : 'visible';
    }
    else if(isNil(__cacheStyle[VISIBILITY])) {
      computedStyle[VISIBILITY] = currentStyle[VISIBILITY][0];
    }
    __cacheStyle[VISIBILITY] = computedStyle[VISIBILITY];
    if(currentStyle[POINTER_EVENTS][1] === INHERIT) {
      computedStyle[POINTER_EVENTS] = parent ? parentComputedStyle[POINTER_EVENTS] : 'auto';
    }
    else if(isNil(__cacheStyle[POINTER_EVENTS])) {
      computedStyle[POINTER_EVENTS] = currentStyle[POINTER_EVENTS][0];
    }
    __cacheStyle[POINTER_EVENTS] = computedStyle[POINTER_EVENTS];
    this.__bx1 = bx1;
    this.__bx2 = bx2;
    this.__by1 = by1;
    this.__by2 = by2;
    return [bx1, by1, bx2, by2];
  }

  __calPerspective(__cacheStyle, currentStyle, computedStyle, __config, sx1, sy1) {
    let rebuild;
    if(isNil(__cacheStyle[PERSPECTIVE])) {
      __cacheStyle[PERSPECTIVE] = true;
      rebuild = true;
      let v = currentStyle[PERSPECTIVE];
      let ppt = 0;
      if(v[1] === REM) {
        ppt = v[0] * this.root.computedStyle[FONT_SIZE];
      }
      else if(v[1] === VW) {
        ppt = v[0] * this.root.width * 0.01;
      }
      else if(v[1] === VH) {
        ppt = v[0] * this.root.height * 0.01;
      }
      else if(v[1] === VMAX) {
        ppt = v[0] * Math.max(this.root.width, this.root.height) * 0.01;
      }
      else if(v[1] === VMIN) {
        ppt = v[0] * Math.min(this.root.width, this.root.height) * 0.01;
      }
      else {
        ppt = v[0];
      }
      computedStyle[PERSPECTIVE] = ppt;
    }
    if(isNil(__cacheStyle[PERSPECTIVE_ORIGIN])) {
      __cacheStyle[PERSPECTIVE_ORIGIN] = true;
      rebuild = true;
      computedStyle[PERSPECTIVE_ORIGIN] = tf.calOrigin(currentStyle[PERSPECTIVE_ORIGIN], this.offsetWidth, this.offsetHeight, this.root);
    }
    if(rebuild) {
      if(sx1 === undefined) {
        sx1 = this.__sx1;
        sy1 = this.__sy1;
      }
      let po = computedStyle[PERSPECTIVE_ORIGIN].slice(0);
      po[0] += sx1 || 0;
      po[1] += sy1 || 0;
      __config[NODE_PERSPECTIVE_MATRIX] = tf.calPerspectiveMatrix(computedStyle[PERSPECTIVE], po);
    }
  }

  __calFilter(currentStyle, computedStyle) {
    return computedStyle[FILTER] = (currentStyle[FILTER] || []).map(item => {
      let [k, v] = item;
      // 部分%单位的滤镜强制使用数字
      if(v[1] === PX || v[1] === DEG || v[1] === PERCENT  || v[1] === NUMBER) {
        v = v[0];
      }
      else if(v[1] === REM) {
        v = v[0] * this.root.computedStyle[FONT_SIZE];
      }
      else if(v[1] === VW) {
        v = v[0] * this.root.width * 0.01;
      }
      else if(v[1] === VH) {
        v = v[0] * this.root.height * 0.01;
      }
      else if(v[1] === VMAX) {
        v = v[0] * Math.max(this.root.width, this.root.height) * 0.01;
      }
      else if(v[1] === VMIN) {
        v = v[0] * Math.min(this.root.width, this.root.height) * 0.01;
      }
      return [k, v];
    });
  }

  __calContent(renderMode, lv, currentStyle, computedStyle) {
    if(renderMode === CANVAS || renderMode === WEBGL) {
      if(lv < REPAINT) {
        return this.__hasContent;
      }
      let visibility = currentStyle[VISIBILITY];
      if(visibility !== 'hidden') {
        let bgI = currentStyle[BACKGROUND_IMAGE];
        if(Array.isArray(bgI)) {
          for(let i = 0, len = bgI.length; i < len; i++) {
            if(bgI[i]) {
              return true;
            }
          }
        }
        if(currentStyle[BACKGROUND_COLOR][0][3] > 0) {
          let width = computedStyle[WIDTH], height = computedStyle[HEIGHT],
            paddingTop = computedStyle[PADDING_TOP], paddingRight = computedStyle[PADDING_RIGHT],
            paddingBottom = computedStyle[PADDING_BOTTOM], paddingLeft = computedStyle[PADDING_LEFT];
          if(width && height || paddingTop || paddingRight || paddingBottom || paddingLeft) {
            return true;
          }
        }
        for(let list = ['Top', 'Right', 'Bottom', 'Left'], i = 0, len = list.length; i < len; i++) {
          let k = list[i];
          if(computedStyle[STYLE_KEY[style2Upper('border' + k + 'Width')]] > 0
            && currentStyle[STYLE_KEY[style2Upper('border' + k + 'Color')]][0][3] > 0) {
            return true;
          }
        }
        let bs = currentStyle[BOX_SHADOW];
        if(Array.isArray(bs)) {
          for(let i = 0, len = bs.length; i < len; i++) {
            let item = bs[i];
            if(item && (item[2] > 0 || item[3] > 0)) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }

  /**
   * 渲染基础方法，Dom/Geom公用
   * @param renderMode
   * @see node/mode
   * @param lv
   * @see refresh/level
   * @param ctx canvas/svg/webgl共用
   * @param cache 是否是局部根节点缓存模式下的绘制
   * @see refresh/Cache.NA
   * @param dx cache时偏移x
   * @param dy cache时偏移y
   * @return Object
   * x1/x2/x3/x4/y1/y2/y3/y4 坐标
   * break svg判断无变化提前跳出
   * cacheError 离屏申请失败，仅canvas
   * offscreenBlend 无cache时的离屏canvas，仅canvas
   * offscreenFilter 无cache时的离屏canvas，仅canvas
   * offscreenOverflow 无cache时的离屏canvas，仅canvas
   * offscreenMask 无cache时的离屏canvas，仅canvas
   */
  render(renderMode, lv, ctx, cache, dx = 0, dy = 0) {
    let {
      isDestroyed,
      root,
      __config,
    } = this;
    let __cache = __config[NODE_CACHE];
    let __cacheStyle = __config[NODE_CACHE_STYLE];
    let currentStyle = __config[NODE_CURRENT_STYLE];
    let computedStyle = __config[NODE_COMPUTED_STYLE];
    // 渲染完认为完全无变更，等布局/动画/更新重置
    __config[NODE_REFRESH_LV] = NONE;
    // >=REPAINT才会进入这里，清空bbox
    this.__bbox = null;
    if(isDestroyed) {
      return { isDestroyed, break: true };
    }
    let virtualDom;
    // svg设置vd上的lv属性标明<REPAINT时应用缓存，初始化肯定没有
    if(renderMode === SVG) {
      virtualDom = __config[NODE_VIRTUAL_DOM] = this.__virtualDom = {
        bb: [],
        children: [],
        visibility: 'visible',
      };
      // svg mock，每次都生成，每个节点都是局部根，更新时自底向上清除
      if(!__config[NODE_CACHE_TOTAL]) {
        __config[NODE_CACHE_TOTAL] = {
          available: true,
          release() {
            this.available = false;
            delete virtualDom.cache;
          },
        };
      }
      else if(!__config[NODE_CACHE_TOTAL].available) {
        __config[NODE_CACHE_TOTAL].available = true;
      }
    }
    let display = computedStyle[DISPLAY];
    // canvas返回信息，svg已经初始化好了vd
    if(display === 'none') {
      return { break: true };
    }
    // 使用sx和sy渲染位置，考虑了relative和translate影响
    let {
      clientWidth,
      clientHeight,
      offsetWidth,
      offsetHeight,
      __hasMask,
    } = this;
    let {
      [PADDING_TOP]: paddingTop,
      [PADDING_RIGHT]: paddingRight,
      [PADDING_BOTTOM]: paddingBottom,
      [PADDING_LEFT]: paddingLeft,
      [BORDER_LEFT_WIDTH]: borderLeftWidth,
      [BORDER_RIGHT_WIDTH]: borderRightWidth,
      [BORDER_TOP_WIDTH]: borderTopWidth,
      [BORDER_BOTTOM_WIDTH]: borderBottomWidth,
    } = computedStyle;
    let isRealInline = __config[NODE_IS_INLINE];
    // 考虑mpb的6个坐标，inline比较特殊单独计算
    let x1 = this.__sx1;
    let x2 = this.__sx2;
    let x3 = this.__sx3;
    let x4 = this.__sx4;
    let x5 = this.__sx5;
    let x6 = this.__sx6;
    let y1 = this.__sy1;
    let y2 = this.__sy2;
    let y3 = this.__sy3;
    let y4 = this.__sy4;
    let y5 = this.__sy5;
    let y6 = this.__sy6;
    let res = {
      ctx,
      x1, x2, x3, x4, x5, x6, y1, y2, y3, y4, y5, y6,
      sx1: x1, sx2: x2, sx3: x3, sx4: x4, sx5: x5, sx6: x6,
      sy1: y1, sy2: y2, sy3: y3, sy4: y4, sy5: y5, sy6: y6,
    };
    // 防止cp直接返回cp嵌套，拿到真实dom的parent
    let p = __config[NODE_DOM_PARENT];
    if(renderMode === WEBGL) {
      this.__calPerspective(__cacheStyle, currentStyle, computedStyle, __config);
    }
    // cache的canvas模式已经提前计算好了，其它需要现在计算
    let matrix;
    if(cache && renderMode === CANVAS) {
      matrix = __config[NODE_MATRIX];
    }
    else {
      matrix = this.__calMatrix(lv, __cacheStyle, currentStyle, computedStyle, __config, x1, y1, offsetWidth, offsetHeight);
    }
    let hasContent = this.__hasContent = __config[NODE_HAS_CONTENT] = this.__calContent(renderMode, lv, currentStyle, computedStyle);
    // webgl特殊申请离屏缓存
    if(cache && renderMode === WEBGL) {
      // 无内容可释放并提前跳出，geom覆盖特殊判断，因为后面子类会绘制矢量，img也覆盖特殊判断，加载完肯定有内容
      if(!hasContent && this.__releaseWhenEmpty(__cache, computedStyle)) {
        res.break = true;
        __config[NODE_LIMIT_CACHE] = false;
      }
      // 新生成根据最大尺寸，排除margin从border开始还要考虑阴影滤镜等，geom单独在dom里做
      else if(!__config[NODE_LIMIT_CACHE]) {
        let bbox = this.bbox;
        if(__cache) {
          __cache.reset(bbox, x1, y1);
        }
        else {
          __cache = Cache.getInstance(bbox, x1, y1);
        }
        // cache成功设置坐标偏移，否则为超过最大尺寸限制不使用缓存
        if(__cache && __cache.enabled) {
          __cache.__bbox = bbox;
          ctx = __cache.ctx;
          dx += __cache.dx;
          dy += __cache.dy;
          res.ctx = ctx;
        }
        else {
          __config[NODE_LIMIT_CACHE] = true;
          __cache = null;
          res.limitCache = res.break = true;
        }
        __config[NODE_CACHE] = __cache;
      }
    }
    // 降级的webgl绘制
    else if(renderMode === WEBGL) {
      let c = inject.getCacheCanvas(root.width, root.height, '__$$OVERSIZE$$__');
      res.ctx = ctx = c.ctx;
    }
    res.dx = dx;
    res.dy = dy;
    // 计算好cacheStyle的内容，以及位图缓存指数，在cache模式时已经提前算好
    let bx1, by1, bx2, by2;
    if(cache && renderMode === CANVAS) {
      bx1 = this.__bx1;
      bx2 = this.__bx2;
      by1 = this.__by1;
      by2 = this.__by2;
    }
    else {
      [bx1, by1, bx2, by2] = this.__calCache(renderMode, ctx, p,
        __cacheStyle, currentStyle, computedStyle,
        clientWidth, clientHeight, offsetWidth, offsetHeight,
        borderTopWidth, borderRightWidth, borderBottomWidth, borderLeftWidth,
        paddingTop, paddingRight, paddingBottom, paddingLeft,
        x1, x2, x3, x4, x5, x6, y1, y2, y3, y4, y5, y6
      );
    }
    res.bx1 = bx1;
    res.by1 = by1;
    res.bx2 = bx2;
    res.by2 = by2;
    // 渲染样式
    let {
      [BACKGROUND_COLOR]: backgroundColor,
      [BORDER_TOP_COLOR]: borderTopColor,
      [BORDER_RIGHT_COLOR]: borderRightColor,
      [BORDER_BOTTOM_COLOR]: borderBottomColor,
      [BORDER_LEFT_COLOR]: borderLeftColor,
      [BORDER_TOP_LEFT_RADIUS]: borderTopLeftRadius,
      [BORDER_TOP_RIGHT_RADIUS]: borderTopRightRadius,
      [BORDER_BOTTOM_RIGHT_RADIUS]: borderBottomRightRadius,
      [BORDER_BOTTOM_LEFT_RADIUS]: borderBottomLeftRadius,
      [VISIBILITY]: visibility,
      [BACKGROUND_REPEAT]: backgroundRepeat,
      [BACKGROUND_IMAGE]: backgroundImage,
      [OPACITY]: opacity,
      [FILTER]: filter,
      [BACKGROUND_SIZE]: backgroundSize,
      [BOX_SHADOW]: boxShadow,
      [OVERFLOW]: overflow,
      [MIX_BLEND_MODE]: mixBlendMode,
      [BACKGROUND_CLIP]: backgroundClip,
    } = computedStyle;
    // 先设置透明度，canvas可以向上累积，cache模式外部已计算好
    if(cache && renderMode === CANVAS) {
      opacity = __config[NODE_OPACITY];
    }
    else if(renderMode === CANVAS || renderMode === WEBGL) {
      if(p) {
        opacity *= p.__config[NODE_OPACITY];
      }
      __config[NODE_OPACITY] = opacity;
    }
    else if(renderMode === SVG) {
      if(opacity === 1) {
        delete virtualDom.opacity;
      }
      else {
        virtualDom.opacity = opacity;
      }
    }
    // canvas/svg/事件需要3种不同的matrix
    if(renderMode === SVG) {
      if(!mx.isE(matrix)) {
        virtualDom.transform = 'matrix(' + joinArr(mx.m2m6(matrix), ',') + ')';
      }
      else {
        delete virtualDom.transform;
      }
      virtualDom.visibility = visibility;
    }
    // cache模式的canvas的matrix计算在外部做好了，且perspective无效
    if(renderMode === CANVAS && cache) {
      matrix = __config[NODE_MATRIX_EVENT];
    }
    else {
      let m = __config[NODE_MATRIX];
      util.assignMatrix(m, matrix);
      // 变换和canvas要以父元素matrixEvent为基础，svg使用自身即css规则，webgl在struct渲染时另算
      if(p) {
        if(p.perspectiveMatrix) {
          matrix = mx.multiply(p.perspectiveMatrix, matrix);
        }
        matrix = mx.multiply(p.matrixEvent, matrix);
      }
      // 为了引用不变，防止变化后text子节点获取不到，恶心的v8优化，初始化在构造函数中空数组
      m = __config[NODE_MATRIX_EVENT];
      util.assignMatrix(m, matrix);
    }
    // 无离屏功能或超限视为不可缓存本身，等降级无cache再次绘制，webgl一样
    if(res.limitCache) {
      return res;
    }
    // 按照顺序依次检查生成offscreen离屏功能，顺序在structs中渲染离屏时用到，多个离屏时隔离并且后面有前面的ctx引用
    let offscreenBlend;
    if(mixBlendMode !== 'normal' && isValidMbm(mixBlendMode)) {
      mixBlendMode = mbmName(mixBlendMode);
      if(renderMode === CANVAS && cache !== LOCAL) {
        let { width, height } = root;
        let c = inject.getCacheCanvas(width, height, null, 'blend');
        offscreenBlend = {
          ctx,
          target: c,
          mixBlendMode,
          matrix,
        };
        ctx = c.ctx;
      }
      else if(renderMode === SVG) {
        virtualDom.mixBlendMode = mixBlendMode;
      }
    }
    // svg特殊没有mbm删除
    else if(renderMode === SVG) {
      delete virtualDom.mixBlendMode;
    }
    let offscreenMask;
    if(__hasMask) {
      if(renderMode === CANVAS && cache !== LOCAL) {
        let { width, height } = root;
        let c = inject.getCacheCanvas(width, height, null, 'mask1');
        offscreenMask = {
          ctx,
          target: c,
          matrix,
        };
        ctx = c.ctx;
      }
    }
    // 无cache时canvas的blur需绘制到离屏上应用后反向绘制回来，有cache在Dom里另生成一个filter的cache
    let hasFilter = filter && filter.length;
    let offscreenFilter;
    if(hasFilter) {
      if(renderMode === CANVAS && cache !== LOCAL) {
        let { width, height } = root;
        let c = inject.getCacheCanvas(width, height, null, 'filter');
        offscreenFilter = {
          ctx,
          filter,
          target: c,
          matrix,
        };
        ctx = c.ctx;
      }
      else if(renderMode === SVG) {
        virtualDom.filter = painter.svgFilter(filter);
      }
    }
    else if(renderMode === SVG) {
      delete virtualDom.filter;
    }
    // 根据backgroundClip的不同值要调整bg渲染坐标尺寸，也会影响borderRadius
    let btlr = borderTopLeftRadius.slice(0);
    let btrr = borderTopRightRadius.slice(0);
    let bbrr = borderBottomRightRadius.slice(0);
    let bblr = borderBottomLeftRadius.slice(0);
    if(backgroundClip === 'padding-box' || backgroundClip === 'paddingBox') {
      btlr[0] -= borderLeftWidth;
      btlr[1] -= borderTopWidth;
      btrr[0] -= borderRightWidth;
      btrr[1] -= borderTopWidth;
      bbrr[0] -= borderRightWidth;
      bbrr[1] -= borderBottomWidth;
      bblr[0] -= borderLeftWidth;
      bblr[1] -= borderBottomWidth;
    }
    else if(backgroundClip === 'content-box' || backgroundClip === 'contentBox') {
      btlr[0] -= borderLeftWidth + paddingLeft;
      btlr[1] -= borderTopWidth + paddingTop;
      btrr[0] -= borderRightWidth + paddingRight;
      btrr[1] -= borderTopWidth + paddingTop;
      bbrr[0] -= borderRightWidth + paddingRight;
      bbrr[1] -= borderBottomWidth + paddingBottom;
      bblr[0] -= borderLeftWidth + paddingLeft;
      bblr[1] -= borderBottomWidth + paddingBottom;
    }
    // overflow:hidden，最后判断，filter/mask优先
    let offscreenOverflow, borderList;
    if(overflow === 'hidden' && display !== 'inline') {
      borderList = border.calRadius(bx1, by1, bx2 - bx1, by2 - by1, btlr, btrr, bbrr, bblr);
      if(renderMode === CANVAS && cache !== LOCAL) {
        let { width, height } = root;
        let c = inject.getCacheCanvas(width, height, null, 'overflow');
        offscreenOverflow = {
          ctx,
          target: c,
          matrix,
        };
        ctx = c.ctx;
        offscreenOverflow.x = x1;
        offscreenOverflow.y = y1;
        offscreenOverflow.offsetWidth = offsetWidth;
        offscreenOverflow.offsetHeight = offsetHeight;
        offscreenOverflow.list = borderList;
      }
      else if(renderMode === SVG) {
        let d = svgPolygon(borderList) || `M${x1},${y1}L${x1 + offsetWidth},${y1}L${x1 + offsetWidth},${y1 + offsetHeight}L${x1},${y1 + offsetHeight},L${x1},${y1}`;
        let v = {
          tagName: 'clipPath',
          props: [],
          children: [
            {
              tagName: 'path',
              props: [
                ['d', d],
              ],
            }
          ],
        };
        let id = ctx.add(v);
        __config[NODE_DEFS_CACHE].push(v);
        virtualDom.overflow = 'url(#' + id + ')';
      }
    }
    else if(renderMode === SVG) {
      delete virtualDom.overflow;
    }
    // 无法使用缓存时主画布直接绘制需设置
    if(renderMode === CANVAS) {
      res.offscreenBlend = offscreenBlend;
      res.offscreenMask = offscreenMask;
      res.offscreenFilter = offscreenFilter;
      res.offscreenOverflow = offscreenOverflow;
      res.ctx = ctx;
      ctx.globalAlpha = opacity;
      // cache模式在外面设置
      if(!cache) {
        ctx.setTransform(matrix[0], matrix[1], matrix[4], matrix[5], matrix[12], matrix[13]);
      }
    }
    // 隐藏不渲染
    if((visibility === 'hidden' || res.break) && (renderMode === CANVAS || renderMode === WEBGL)) {
      res.break = true;
      return res;
    }
    // 仅webgl有用
    if(__cache && __cache.enabled) {
      __cache.__available = true;
    }
    /**
     * inline的渲染同block/ib不一样，不是一个矩形区域
     * 它根据内部的contentBox渲染，contentBox是指lineBox中的内容，即TextBox/inline/ib元素
     * 首尾可能不满行，比如从一半开始或一半结束，甚至可能没有内容
     * 两行之间可能不满，如果lineBox的高度>lineHeight的话，另外特殊字体如arial拥有lineGap也会产生间隙，背景色不绘制这个间隙
     * x轴根据contentBox的范围坐标，y则固定和font/lineHeight相关
     * 圆角发生在首尾lineBox处，中间不会有，bgi则产生类似bgc作为mask的效果
     * 另外要注意多个时的顺序，必须依次渲染，后面的bb可能会覆盖前面行的
     */
    if(isRealInline) {
      let contentBoxList = this.contentBoxList;
      let length = contentBoxList.length;
      let hasBgi = backgroundImage.some(item => item);
      if(length) {
        let {
          [FONT_SIZE]: fontSize,
          [FONT_FAMILY]: fontFamily,
          [LINE_HEIGHT]: lineHeight,
        } = computedStyle;
        let iw = 0, ih = 0;
        let offscreen, svgBgSymbol = [];
        // bgi视作inline排满一行绘制，然后按分行拆开给每行
        if(hasBgi) {
          iw = inline.getInlineWidth(this, contentBoxList);
          ih = lineHeight;
          if(backgroundClip === 'paddingBox' || backgroundClip === 'padding-box') {
            iw += paddingLeft + paddingRight;
            ih += paddingTop + paddingBottom;
          }
          else if(backgroundClip !== 'contentBox' && backgroundClip !== 'content-box') {
            iw += paddingLeft + paddingRight + borderLeftWidth + borderRightWidth;
            ih += paddingTop + paddingBottom + borderTopWidth + borderBottomWidth;
          }
          if(renderMode === CANVAS || renderMode === WEBGL) {
            offscreen = inject.getCacheCanvas(iw, ih, '__$$INLINE_BGI$$__');
          }
          let length = backgroundImage.length;
          backgroundImage.slice(0).reverse().forEach((bgi, i) => {
            if(!bgi) {
              return;
            }
            i = length - 1 - i;
            if(util.isString(bgi)) {
              let loadBgi = this.__loadBgi[i];
              if(loadBgi.url === backgroundImage[i]) {
                let uuid = bg.renderImage(this, renderMode, offscreen && offscreen.ctx || ctx, loadBgi,
                  0, 0, iw, ih, btlr, btrr, bbrr, bblr,
                  currentStyle, i, backgroundSize, backgroundRepeat, __config, true, dx, dy);
                if(renderMode === SVG && uuid) {
                  svgBgSymbol.push(uuid);
                }
              }
            }
            else if(bgi.k) {
              let gd = this.__gradient(renderMode, ctx, 0, 0, iw, ih, bgi, dx, dy);
              if(gd) {
                if(gd.k === 'conic') {
                  let uuid = gradient.renderConic(this, renderMode, offscreen && offscreen.ctx || ctx, gd.v, 0, 0, iw, lineHeight,
                    btlr, btrr, bbrr, bblr, true);
                  if(renderMode === SVG && uuid) {
                    svgBgSymbol.push(uuid);
                  }
                }
                else {
                  let uuid = bg.renderBgc(this, renderMode, offscreen && offscreen.ctx || ctx, gd.v, null,
                    0, 0, iw, ih, btlr, btrr, bbrr, bblr, 'fill', true);
                  if(renderMode === SVG && uuid) {
                    svgBgSymbol.push(uuid);
                  }
                }
              }
            }
          });
        }
        // 获取当前dom的baseLine，再减去lineBox的baseLine得出差值，这样渲染范围y就是lineBox的y+差值为起始，lineHeight为高
        let ff = css.getFontFamily(fontFamily);
        let baseLine = css.getBaseLine(computedStyle);
        // lineGap，一般为0，某些字体如arial有，渲染高度需减去它，最终是lineHeight - diffL
        let diffL = fontSize * (font.info[ff].lgr || 0);
        // 注意只有1个的时候特殊情况，圆角只在首尾行出现
        let isFirst = true;
        let lastContentBox = contentBoxList[0], lastLineBox = lastContentBox.parentLineBox;
        // bgi需统计宽度累计值，将当前行所处理想单行的x范围位置计算出来，并进行bgi贴图绘制，svg还需统计第几行
        let count = 0, countW = 0;
        for(let i = 0; i < length; i++) {
          let contentBox = contentBoxList[i];
          if(contentBox.parentLineBox !== lastLineBox) {
            // 上一行
            let [ix1, iy1, ix2, iy2, bx1, by1, bx2, by2] = inline.getInlineBox(this, contentBoxList,
              lastContentBox, contentBoxList[i - 1], lastLineBox, baseLine, lineHeight, diffL, isFirst, false,
              backgroundClip, paddingTop, paddingRight, paddingBottom, paddingLeft,
              borderTopWidth, borderRightWidth, borderBottomWidth, borderLeftWidth);
            // 要算上开头空白inline，可能有多个和递归嵌套
            if(isFirst) {
              let n = getFirstEmptyInlineWidth(this);
              ix1 -= n;
              bx1 -= n;
            }
            if(backgroundColor[3] > 0) {
              bg.renderBgc(this, renderMode, ctx, __cacheStyle[BACKGROUND_COLOR], null,
                ix1, iy1, ix2 - ix1, iy2 - iy1, btlr, [0, 0], [0, 0], bblr, 'fill', false, dx, dy);
            }
            let w = ix2 - ix1;
            // canvas的bg位图裁剪
            if((renderMode === CANVAS || renderMode === WEBGL) && offscreen) {
              ctx.drawImage(offscreen.canvas, countW, 0, w, ih, ix1 + dx, iy1 + dy, w, ih);
            }
            //svg则特殊判断
            else if(renderMode === SVG && svgBgSymbol.length) {
              svgBgSymbol.forEach(symbol => {
                if(symbol) {
                  let v = {
                    tagName: 'clipPath',
                    props: [],
                    children: [
                      {
                        tagName: 'path',
                        props: [
                          ['d', `M${countW},${0}L${w+countW},${0}L${w+countW},${ih}L${countW},${ih},L${countW},${0}`],
                        ],
                      }
                    ],
                  };
                  let clip = ctx.add(v);
                  __config[NODE_DEFS_CACHE].push(v);
                  virtualDom.bb.push({
                    type: 'item',
                    tagName: 'use',
                    props: [
                      ['xlink:href', '#' + symbol],
                      ['x', ix1 - countW],
                      ['y', iy1],
                      ['clip-path', 'url(#' + clip + ')'],
                    ],
                  });
                }
              });
            }
            countW += w;
            if(boxShadow) {
              boxShadow.forEach(item => {
                bs.renderBoxShadow(this, renderMode, ctx, item, bx1, by1, bx2, by2, bx2 - bx1, by2 - by1, dx, dy);
              });
            }
            if(borderTopWidth > 0 && borderTopColor[3] > 0) {
              let deg1 = Math.atan(borderTopWidth / borderLeftWidth);
              let deg2 = Math.atan(borderTopWidth / borderRightWidth);
              let list = border.calPoints(borderTopWidth, computedStyle[BORDER_TOP_STYLE], deg1, deg2,
                bx1, bx1 + borderLeftWidth, bx2, bx2,
                by1, by1 + borderTopWidth, by2 - borderBottomWidth, by2, 0, isFirst ? btlr : [0, 0], [0, 0]);
              border.renderBorder(this, renderMode, ctx, list, __cacheStyle[BORDER_TOP_COLOR], dx, dy);
            }
            if(borderBottomWidth > 0 && borderBottomColor[3] > 0) {
              let deg1 = Math.atan(borderBottomWidth / borderLeftWidth);
              let deg2 = Math.atan(borderBottomWidth / borderRightWidth);
              let list = border.calPoints(borderBottomWidth, computedStyle[BORDER_BOTTOM_STYLE], deg1, deg2,
                bx1, bx1 + borderLeftWidth, bx2, bx2,
                by1, by1 + borderTopWidth, by2 - borderBottomWidth, by2, 2, isFirst ? btlr : [0, 0], [0, 0]);
              border.renderBorder(this, renderMode, ctx, list, __cacheStyle[BORDER_BOTTOM_COLOR], dx, dy);
            }
            if(isFirst && borderLeftWidth > 0 && borderLeftColor[3] > 0) {
              let deg1 = Math.atan(borderLeftWidth / borderTopWidth);
              let deg2 = Math.atan(borderLeftWidth / borderBottomWidth);
              let list = border.calPoints(borderLeftWidth, computedStyle[BORDER_LEFT_STYLE], deg1, deg2,
                bx1, bx1 + borderLeftWidth, bx2 - borderRightWidth, bx2,
                by1, by1 + borderTopWidth, by2 - borderBottomWidth, by2, 3, btlr, btrr);
              border.renderBorder(this, renderMode, ctx, list, __cacheStyle[BORDER_LEFT_COLOR], dx, dy);
            }
            isFirst = false;
            lastContentBox = contentBox;
            lastLineBox = contentBox.parentLineBox;
            count++;
          }
          // 最后一个特殊判断
          if(i === length - 1) {
            let [ix1, iy1, ix2, iy2, bx1, by1, bx2, by2] = inline.getInlineBox(this, contentBoxList,
              lastContentBox, contentBoxList[i], lastLineBox, baseLine, lineHeight, diffL, isFirst, true,
              backgroundClip, paddingTop, paddingRight, paddingBottom, paddingLeft,
              borderTopWidth, borderRightWidth, borderBottomWidth, borderLeftWidth);
            // 要算上开头空白inline，可能有多个和递归嵌套
            if(isFirst) {
              let n = getFirstEmptyInlineWidth(this);
              ix1 -= n;
              bx1 -= n;
            }
            // 要算上末尾空白inline，可能有多个和递归嵌套
            let n = getLastEmptyInlineWidth(this);
            ix2 += n;
            bx2 += n;
            if(backgroundColor[3] > 0) {
              bg.renderBgc(this, renderMode, ctx, __cacheStyle[BACKGROUND_COLOR], null,
                ix1, iy1, ix2 - ix1, iy2 - iy1, isFirst ? btlr : [0, 0], btrr, bbrr, isFirst ? bblr : [0, 0],
                'fill', false, dx, dy);
            }
            let w = ix2 - ix1;
            // canvas的bg位图裁剪
            if((renderMode === CANVAS || renderMode === WEBGL) && offscreen) {
              ctx.drawImage(offscreen.canvas, countW, 0, w, ih, ix1 + dx, iy1 + dy, w, ih);
            }
            //svg则特殊判断
            else if(renderMode === SVG && svgBgSymbol.length) {
              svgBgSymbol.forEach(symbol => {
                if(symbol) {
                  let v = {
                    tagName: 'clipPath',
                    props: [],
                    children: [
                      {
                        tagName: 'path',
                        props: [
                          ['d', `M${countW},${0}L${w+countW},${0}L${w+countW},${ih}L${countW},${ih},L${countW},${0}`],
                        ],
                      }
                    ],
                  };
                  let clip = ctx.add(v);
                  __config[NODE_DEFS_CACHE].push(v);
                  virtualDom.bb.push({
                    type: 'item',
                    tagName: 'use',
                    props: [
                      ['xlink:href', '#' + symbol],
                      ['x', ix1 - countW],
                      ['y', iy1],
                      ['clip-path', 'url(#' + clip + ')'],
                    ],
                  });
                }
              });
            }
            if(boxShadow) {
              boxShadow.forEach(item => {
                bs.renderBoxShadow(this, renderMode, ctx, item, bx1, by1, bx2, by2, bx2 - bx1, by2 - by1, dx, dy);
              });
            }
            if(borderTopWidth > 0 && borderTopColor[3] > 0) {
              let deg1 = Math.atan(borderTopWidth / borderLeftWidth);
              let deg2 = Math.atan(borderTopWidth / borderRightWidth);
              let list = border.calPoints(borderTopWidth, computedStyle[BORDER_TOP_STYLE], deg1, deg2,
                bx1, bx1, bx2 - borderRightWidth, bx2,
                by1, by1 + borderTopWidth, by2 - borderBottomWidth, by2, 0, isFirst ? btlr : [0, 0], btrr);
              border.renderBorder(this, renderMode, ctx, list, __cacheStyle[BORDER_TOP_COLOR], dx, dy);
            }
            if(borderRightWidth > 0 && borderRightColor[3] > 0) {
              let deg1 = Math.atan(borderRightWidth / borderTopWidth);
              let deg2 = Math.atan(borderRightWidth / borderBottomWidth);
              let list = border.calPoints(borderRightWidth, computedStyle[BORDER_RIGHT_STYLE], deg1, deg2,
                bx1, bx1 + borderLeftWidth, bx2 - borderRightWidth, bx2,
                by1, by1 + borderTopWidth, by2 - borderBottomWidth, by2, 1, btlr, btrr);
              border.renderBorder(this, renderMode, ctx, list, __cacheStyle[BORDER_RIGHT_COLOR], dx, dy);
            }
            if(borderBottomWidth > 0 && borderBottomColor[3] > 0) {
              let deg1 = Math.atan(borderBottomWidth / borderLeftWidth);
              let deg2 = Math.atan(borderBottomWidth / borderRightWidth);
              let list = border.calPoints(borderBottomWidth, computedStyle[BORDER_BOTTOM_STYLE], deg1, deg2,
                bx1, bx1, bx2 - borderRightWidth, bx2,
                by1, by1 + borderTopWidth, by2 - borderBottomWidth, by2, 2, isFirst ? btlr : [0, 0], btrr);
              border.renderBorder(this, renderMode, ctx, list, __cacheStyle[BORDER_BOTTOM_COLOR], dx, dy);
            }
            if(isFirst && borderLeftWidth > 0 && borderLeftColor[3] > 0) {
              let deg1 = Math.atan(borderLeftWidth / borderTopWidth);
              let deg2 = Math.atan(borderLeftWidth / borderBottomWidth);
              let list = border.calPoints(borderLeftWidth, computedStyle[BORDER_LEFT_STYLE], deg1, deg2,
                bx1, bx1 + borderLeftWidth, bx2 - borderRightWidth, bx2,
                by1, by1 + borderTopWidth, by2 - borderBottomWidth, by2, 3, btlr, btrr);
              border.renderBorder(this, renderMode, ctx, list, __cacheStyle[BORDER_LEFT_COLOR], dx, dy);
            }
          }
        }
        if(offscreen) {
          offscreen.ctx.clearRect(0, 0, iw, ih);
        }
        return res;
      }
      // 无内容且无尺寸的无需渲染
      else if(bx1 === bx2 || by1 === by2) {
        return res;
      }
    }
    // block渲染，bgc垫底
    if(backgroundColor[3] > 0) {
      bg.renderBgc(this, renderMode, ctx, __cacheStyle[BACKGROUND_COLOR], borderList,
        bx1, by1, bx2 - bx1, by2 - by1, btlr, btrr, bbrr, bblr, 'fill', false, dx, dy);
    }
    // 渐变或图片叠加
    if(backgroundImage) {
      let length = backgroundImage.length;
      backgroundImage.slice(0).reverse().forEach((bgi, i) => {
        if(!bgi) {
          return;
        }
        i = length - 1 - i;
        if(util.isString(bgi)) {
          let loadBgi = this.__loadBgi[i];
          if(loadBgi.url === backgroundImage[i]) {
            bg.renderImage(this, renderMode, ctx, loadBgi,
              bx1, by1, bx2, by2, btlr, btrr, bbrr, bblr,
              currentStyle, i, backgroundSize, backgroundRepeat, __config, false, dx, dy);
          }
        }
        else if(bgi.k) {
          let gd = this.__gradient(renderMode, ctx, bx1, by1, bx2, by2, bgi, dx, dy);
          if(gd) {
            if(gd.k === 'conic') {
              gradient.renderConic(this, renderMode, ctx, gd.v, bx1, by1, bx2 - bx1, by2 - by1,
                btlr, btrr, bbrr, bblr);
            }
            else {
              bg.renderBgc(this, renderMode, ctx, gd.v, borderList,
                bx1, by1, bx2 - bx1, by2 - by1, btlr, btrr, bbrr, bblr, 'fill', false, dx, dy);
            }
          }
        }
      });
    }
    // boxShadow可能会有多个
    if(boxShadow) {
      boxShadow.forEach(item => {
        bs.renderBoxShadow(this, renderMode, ctx, item, x1, y1, x6, y6, x6 - x1, y6 - y1, dx, dy);
      });
    }
    // 边框需考虑尖角，两条相交边平分45°夹角
    if(borderTopWidth > 0 && borderTopColor[3] > 0) {
      border.renderBorder(this, renderMode, ctx, __cacheStyle[BORDER_TOP], __cacheStyle[BORDER_TOP_COLOR], dx, dy);
    }
    if(borderRightWidth > 0 && borderRightColor[3] > 0) {
      border.renderBorder(this, renderMode, ctx, __cacheStyle[BORDER_RIGHT], __cacheStyle[BORDER_RIGHT_COLOR], dx, dy);
    }
    if(borderBottomWidth > 0 && borderBottomColor[3] > 0) {
      border.renderBorder(this, renderMode, ctx, __cacheStyle[BORDER_BOTTOM], __cacheStyle[BORDER_BOTTOM_COLOR], dx, dy);
    }
    if(borderLeftWidth > 0 && borderLeftColor[3] > 0) {
      border.renderBorder(this, renderMode, ctx, __cacheStyle[BORDER_LEFT], __cacheStyle[BORDER_LEFT_COLOR], dx, dy);
    }
    return res;
  }

  __destroy() {
    if(this.isDestroyed) {
      return;
    }
    super.__destroy();
    let { root } = this;
    this.clearAnimate();
    this.clearFrameAnimate();
    // root在没有初始化到真实dom渲染的情况下没有
    root && root.delRefreshTask(this.__loadBgi.cb);
    root && root.delRefreshTask(this.__task);
    this.__task = null;
    this.__root = null;
    this.clearCache();
  }

  // 先查找到注册了事件的节点，再捕获冒泡判断增加性能
  __emitEvent(e, force) {
    let { isDestroyed, computedStyle, isMask } = this;
    if(isDestroyed || computedStyle[DISPLAY] === 'none' || e.__stopPropagation || isMask) {
      return;
    }
    let { event: { type } } = e;
    let { listener, __hasMask } = this;
    let cb;
    if(listener.hasOwnProperty(type)) {
      cb = listener[type];
    }
    // touchmove之类强制的直接由Root通知即可
    if(force) {
      if(computedStyle[POINTER_EVENTS] !== 'none' && isFunction(cb) && !e.__stopImmediatePropagation) {
        cb.call(this, e);
      }
      return true;
    }
    // 非force的判断事件坐标是否在节点内
    if(this.willResponseEvent(e)) {
      // 如果有mask，点在mask上才行，点在clip外才行
      if(__hasMask) {
        let next = this.next;
        let isClip = next.isClip;
        let hasEmitMask;
        while(next && next.isMask) {
          if(next.willResponseEvent(e, true)) {
            hasEmitMask = true;
            break;
          }
          next = next.next;
        }
        if(!isClip && !hasEmitMask) {
          return;
        }
      }
      if(isFunction(cb) && !e.__stopImmediatePropagation) {
        cb.call(this, e);
      }
      return true;
    }
  }

  willResponseEvent(e, ignore) {
    let { x, y } = e;
    let { __sx1, __sy1, offsetWidth, offsetHeight, matrixEvent, computedStyle } = this;
    if(computedStyle[POINTER_EVENTS] === 'none') {
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
      if(!e.target && !ignore) {
        e.target = this;
        // 缓存target给move用
        if(e.event.type === 'touchstart') {
          this.root && (this.root.__touchstartTarget = this);
        }
      }
      return true;
    }
  }

  __gradient(renderMode, ctx, bx1, by1, bx2, by2, bgi, dx = 0, dy = 0) {
    let iw = bx2 - bx1;
    let ih = by2 - by1;
    // 无尺寸无需创建渐变
    if(!iw || !ih) {
      return;
    }
    let { k, v, d, s, z, p } = bgi;
    let cx = bx1 + iw * 0.5;
    let cy = by1 + ih * 0.5;
    let res = { k };
    if(k === 'linear') {
      let gd = gradient.getLinear(v, d, bx1, by1, cx, cy, iw, ih, this.root, dx, dy);
      res.v = this.__getLg(renderMode, ctx, gd);
    }
    else if(k === 'radial') {
      let gd = gradient.getRadial(v, s, z, p, bx1, by1, bx2, by2, this.root, dx, dy);
      if(gd) {
        res.v = this.__getRg(renderMode, ctx, gd)
        if(gd.matrix) {
          res.v = [res.v, gd.matrix, gd.cx, gd.cy];
        }
      }
    }
    else if(k === 'conic') {
      let bbox = this.bbox;
      let m1 = Math.max(Math.abs(bbox[2] - bbox[0]), Math.abs(bbox[3] - bbox[1]));
      let m2 = Math.max(Math.abs(iw), Math.abs(ih));
      let gd = gradient.getConic(v, d, p, bx1, by1, bx2, by2, m1 / m2, this.root, dx, dy);
      res.v = this.__getCg(renderMode, ctx, gd);
    }
    return res;
  }

  __getLg(renderMode, ctx, gd) {
    if(renderMode === CANVAS || renderMode === WEBGL) {
      let lg = ctx.createLinearGradient(gd.x1, gd.y1, gd.x2, gd.y2);
      gd.stop.forEach(item => {
        lg.addColorStop(item[1], int2rgba(item[0]));
      });
      return lg;
    }
    else if(renderMode === SVG) {
      let v = {
        tagName: 'linearGradient',
        props: [
          ['x1', gd.x1],
          ['y1', gd.y1],
          ['x2', gd.x2],
          ['y2', gd.y2],
        ],
        children: gd.stop.map(item => {
          return {
            tagName: 'stop',
            props: [
              ['stop-color', int2rgba(item[0])],
              ['offset', item[1] * 100 + '%'],
            ],
          };
        }),
      };
      let uuid = ctx.add(v);
      this.__config[NODE_DEFS_CACHE].push(v);
      return 'url(#' + uuid + ')';
    }
  }

  __getRg(renderMode, ctx, gd) {
    if(renderMode === CANVAS || renderMode === WEBGL) {
      let rg = ctx.createRadialGradient(gd.cx, gd.cy, 0, gd.tx, gd.ty, gd.r);
      gd.stop.forEach(item => {
        rg.addColorStop(item[1], int2rgba(item[0]));
      });
      return rg;
    }
    else if(renderMode === SVG) {
      let v = {
        tagName: 'radialGradient',
        props: [
          ['cx', gd.tx],
          ['cy', gd.ty],
          ['r', gd.r],
        ],
        children: gd.stop.map(item => {
          return {
            tagName: 'stop',
            props: [
              ['stop-color', int2rgba(item[0])],
              ['offset', item[1] * 100 + '%'],
            ],
          };
        }),
      };
      if(gd.tx !== gd.cx) {
        v.props.push(['fx', gd.cx]);
      }
      if(gd.ty !== gd.cy) {
        v.props.push(['fy', gd.cy]);
      }
      let uuid = ctx.add(v);
      this.__config[NODE_DEFS_CACHE].push(v);
      return 'url(#' + uuid + ')';
    }
  }

  __getCg(renderMode, ctx, gd) {
    let { cx, cy, r, deg, stop } = gd;
    let len = stop.length - 1;
    if(stop[len][1] < 1) {
      stop.push([stop[len][0].slice(0), 1]);
    }
    if(stop[0][1] > 0) {
      stop.unshift([stop[0][0].slice(0), 0]);
    }
    // canvas采用点色值计算法，svg则分360度画块
    let res = [];
    if(renderMode === CANVAS || renderMode === WEBGL) {
      return gd;
    }
    else if(renderMode === SVG) {
      let offset = 0.5;
      let prev;
      // 根据2个stop之间的百分比得角度差划分块数，每0.5°一块，不足也算
      let list = [];
      for(let i = 0, len = stop.length; i < len - 1; i++) {
        let begin = stop[i][1] * 360;
        let end = stop[i + 1][1] * 360;
        let diff = end - begin;
        let n = Math.ceil(diff);
        let per = diff / n;
        // 计算每块的2个弧端点
        let bc = stop[i][0];
        let ec = stop[i + 1][0];
        let dc = [ec[0] - bc[0], ec[1] - bc[1], ec[2] - bc[2], ec[3] - bc[3]];
        let pc = [dc[0] / n, dc[1] / n, dc[2] / n, dc[3] / n];
        for(let j = 0; j < n; j++) {
          let [x1, y1] = geom.pointOnCircle(cx, cy, r, begin + per * j + deg - offset);
          let [x2, y2] = geom.pointOnCircle(cx, cy, r, begin + per * j + deg + offset);
          list.push([
            x1, y1,
            x2, y2,
            Math.round(bc[0] + pc[0] * j),
            Math.round(bc[1] + pc[1] * j),
            Math.round(bc[2] + pc[2] * j),
            Math.round(bc[3] + pc[3] * j),
          ]);
        }
      }
      // 最后一段补自己末尾颜色特殊处理
      let end = list[0].slice(0);
      let [x2, y2] = geom.pointOnCircle(cx, cy, r, deg);
      end[2] = x2;
      end[3] = y2;
      let s = stop[stop.length - 1][0];
      end[4] = s[0];
      end[5] = s[1];
      end[6] = s[2];
      end[7] = s[3];
      list.push(end);
      for(let i = 0, len = list.length; i < len; i++) {
        let cur = list[i];
        if(prev) {
          let v = {
            tagName: 'linearGradient',
            props: [
              ['x1', prev[0]],
              ['y1', prev[1]],
              ['x2', cur[2]],
              ['y2', cur[3]],
            ],
            children: [
              {
                tagName: 'stop',
                props: [
                  ['stop-color', int2rgba([prev[4], prev[5], prev[6], prev[7]])],
                  ['offset', '0%'],
                ],
              },
              {
                tagName: 'stop',
                props: [
                  ['stop-color', int2rgba([cur[4], cur[5], cur[6], cur[7]])],
                  ['offset', '100%'],
                ],
              },
            ],
          };
          let uuid = ctx.add(v);
          this.__config[NODE_DEFS_CACHE].push(v);
          res.push([[[cx, cy], [prev[0], prev[1]], [cur[2], cur[3]]], 'url(#' + uuid + ')']);
        }
        prev = cur;
      }
    }
    return res;
  }

  // canvas清空自身cache，cacheTotal在Root的自底向上逻辑做，svg仅有cacheTotal
  clearCache(onlyTotal) {
    let __config = this.__config;
    let __cacheTotal = __config[NODE_CACHE_TOTAL];
    let __cacheFilter = __config[NODE_CACHE_FILTER];
    let __cacheMask = __config[NODE_CACHE_MASK];
    let __cacheOverflow = __config[NODE_CACHE_OVERFLOW];
    if(!onlyTotal) {
      __config[NODE_CACHE_STYLE] = this.__cacheStyle = {};
      let __cache = __config[NODE_CACHE];
      if(__cache) {
        __cache.release();
      }
    }
    if(__cacheTotal) {
      __cacheTotal.release();
    }
    if(__cacheFilter) {
      __cacheFilter.release();
    }
    if(__cacheMask) {
      __cacheMask.release();
    }
    if(__cacheOverflow) {
      __cacheOverflow.release();
    }
  }

  updateStyle(style, cb) {
    let node = this;
    let { root, __config } = node;
    let formatStyle = css.normalize(style);
    // 有root说明被添加渲染过了
    if(root) {
      root.addRefreshTask(node.__task = {
        __before() {
          node.__task = null;
          if(__config[NODE_IS_DESTROYED]) {
            return;
          }
          // 刷新前统一赋值，由刷新逻辑计算最终值避免优先级覆盖问题
          let res = {};
          res[UPDATE_NODE] = node;
          res[UPDATE_STYLE] = formatStyle;
          res[UPDATE_OVERWRITE] = style; // 标识盖原有style样式不仅仅是修改currentStyle，不同于animate
          res[UPDATE_KEYS] = Object.keys(formatStyle).map(i => {
            if(!GEOM.hasOwnProperty(i)) {
              i = parseInt(i);
            }
            return i;
          });
          res[UPDATE_CONFIG] = __config;
          root.__addUpdate(node, __config, root, root.__config, res);
        },
        __after(diff) {
          if(isFunction(cb)) {
            cb.call(node, diff);
          }
        },
      });
    }
    // 没有是在如parse()还未添加的时候，可以直接同步覆盖
    else {
      Object.assign(this.currentStyle, formatStyle);
      if(isFunction(cb)) {
        cb.call(node, -1);
      }
    }
  }

  // 传入格式化好key/value的样式
  updateFormatStyle(style, cb) {
    let node = this;
    let { root, __config } = node;
    if(root) {
      root.addRefreshTask(node.__task = {
        __before() {
          node.__task = null; // 清除在before，防止after的回调增加新的task误删
          if(__config[NODE_IS_DESTROYED]) {
            return;
          }
          // 刷新前统一赋值，由刷新逻辑计算最终值避免优先级覆盖问题
          let res = {};
          res[UPDATE_NODE] = node;
          res[UPDATE_STYLE] = style;
          res[UPDATE_KEYS] = Object.keys(style).map(i => {
            if(!GEOM.hasOwnProperty(i)) {
              i = parseInt(i);
            }
            return i;
          });
          res[UPDATE_CONFIG] = __config;
          root.__addUpdate(node, __config, root, root.__config, res);
        },
        __after(diff) {
          if(isFunction(cb)) {
            cb.call(node, diff);
          }
        },
      });
    }
    // 没有是在如parse()还未添加的时候，可以直接同步覆盖
    else {
      Object.assign(this.currentStyle, style);
      if(isFunction(cb)) {
        cb.call(node, -1);
      }
    }
  }

  animate(list, options = {}) {
    let animation = new Animation(this, list, options);
    if(this.isDestroyed) {
      animation.__destroy(true);
      return animation;
    }
    this.animationList.push(animation);
    if(options.autoPlay === false) {
      return animation;
    }
    return animation.play();
  }

  removeAnimate(o) {
    if(o instanceof Animation) {
      let i = this.animationList.indexOf(o);
      if(i > -1) {
        o.cancel();
        o.__destroy();
        this.animationList.splice(i, 1);
      }
    }
  }

  clearAnimate() {
    this.animationList.splice(0).forEach(o => {
      o.cancel();
      o.__destroy();
    });
  }

  frameAnimate(cb) {
    if(isFunction(cb)) {
      let list = this.__frameAnimateList;
      // 防止重复
      for(let i = 0, len = list.length; i < len; i++) {
        if(list[i].__karasFramecb === cb) {
          return cb;
        }
      }
      let enter = {
        __after(diff) {
          cb(diff);
        },
        __karasFramecb: cb,
      };
      list.push(enter);
      frame.onFrame(enter);
      return cb;
    }
  }

  removeFrameAnimate(cb) {
    for(let i = 0, list = this.__frameAnimateList, len = list.length; i < len; i++) {
      if(list[i].__karasFramecb === cb) {
        list.splice(i, 1);
        frame.offFrame(cb);
        return;
      }
    }
  }

  clearFrameAnimate() {
    this.__frameAnimateList.splice(0).forEach(o => {
      frame.offFrame(o);
    });
  }

  __computeMeasure(renderMode, ctx, cb) {
    css.computeMeasure(this);
    if(isFunction(cb)) {
      cb(this);
    }
  }

  __deepScan(cb, options) {
    return cb(this, options);
  }

  // isLayout为false时，为relative/margin/flex/vertical等
  __offsetX(diff, isLayout, lv) {
    super.__offsetX(diff, isLayout);
    if(isLayout) {
      this.__layoutData.x += diff;
      this.clearCache();
    }
    if(lv !== undefined) {
      this.__config[NODE_REFRESH_LV] |= lv;
    }
    this.__sx1 += diff;
    this.__sx2 += diff;
    this.__sx3 += diff;
    this.__sx4 += diff;
    this.__sx5 += diff;
    this.__sx6 += diff;
  }

  __offsetY(diff, isLayout, lv) {
    super.__offsetY(diff, isLayout);
    if(isLayout) {
      this.__layoutData.y += diff;
      this.clearCache();
    }
    if(lv !== undefined) {
      this.__config[NODE_REFRESH_LV] |= lv;
    }
    this.__sy1 += diff;
    this.__sy2 += diff;
    this.__sy3 += diff;
    this.__sy4 += diff;
    this.__sy5 += diff;
    this.__sy6 += diff;
  }

  __resizeX(diff, lv) {
    this.computedStyle.width = this.__width += diff;
    this.__clientWidth += diff;
    this.__offsetWidth += diff;
    this.__outerWidth += diff;
    this.__layoutData.w += diff;
    this.__sx4 += diff;
    this.__sx5 += diff;
    this.__sx6 += diff;
    if(diff < 0) {
      this.__config[NODE_LIMIT_CACHE] = false;
    }
    if(lv !== undefined) {
      this.__config[NODE_REFRESH_LV] |= lv;
    }
    this.clearCache();
  }

  __resizeY(diff, lv) {
    this.computedStyle.height = this.__height += diff;
    this.__clientHeight += diff;
    this.__offsetHeight += diff;
    this.__outerHeight += diff;
    this.__layoutData.h += diff;
    this.__sy4 += diff;
    this.__sy5 += diff;
    this.__sy6 += diff;
    if(diff < 0) {
      this.__config[NODE_LIMIT_CACHE] = false;
    }
    if(lv !== undefined) {
      this.__config[NODE_REFRESH_LV] |= lv;
    }
    this.clearCache();
  }

  __spreadBbox(boxShadow, filter) {
    let x1 = 0, y1 = 0, x2 = 0, y2 = 0;
    let xl = [], yt = [], xr = [], yb = [];
    if(Array.isArray(boxShadow)) {
      boxShadow.forEach(item => {
        let [x, y, sigma, spread, , inset] = item;
        x1 = x2 = x;
        y1 = y2 = y;
        if(inset !== 'inset') {
          let d = blur.outerSize(sigma);
          d += spread;
          xl.push(x - d);
          xr.push(x + d);
          yt.push(y - d);
          yb.push(y + d);
        }
      });
    }
    if(Array.isArray(filter)) {
      filter.forEach(item => {
        let [k, sigma] = item;
        if(k === 'blur' && sigma > 0) {
          let d = blur.kernelSize(sigma);
          let spread = blur.outerSizeByD(d);
          if(spread) {
            xl.push(-spread);
            xr.push(spread);
            yt.push(-spread);
            yb.push(spread);
          }
        }
      });
    }
    xl.forEach(n => x1 = Math.min(x1, n));
    xr.forEach(n => x2 = Math.max(x2, n));
    yt.forEach(n => y1 = Math.min(y1, n));
    yb.forEach(n => y2 = Math.max(y2, n));
    return [x1, y1, x2, y2];
  }

  __releaseWhenEmpty(__cache) {
    if(__cache && __cache.available) {
      __cache.release();
    }
    return true;
  }

  getComputedStyle(key) {
    let computedStyle = this.computedStyle;
    let res = {};
    let keys;
    if(key) {
      if(Array.isArray(key)) {
        keys = key;
      }
      else {
        keys = [key];
      }
      keys = keys.map(s => {
        return STYLE_KEY[style2Upper(s)];
      });
    }
    else {
      keys = Object.keys(computedStyle);
    }
    keys.forEach(k => {
      if(GEOM.hasOwnProperty(k)) {
        res[k] = computedStyle[k];
      }
      else {
        res[STYLE_RV_KEY[k]] = computedStyle[k];
      }
    });
    return res;
  }

  getBoundingClientRect(includeBbox) {
    let box = [];
    if(includeBbox) {
      box = this.bbox;
    }
    else {
      let { __sx1, __sy1, offsetWidth, offsetHeight } = this;
      box = [__sx1, __sy1, __sx1 + offsetWidth, __sy1 + offsetHeight];
    }
    let matrixEvent = this.matrixEvent;
    let p1 = point2d(mx.calPoint([box[0], box[1]], matrixEvent));
    let p2 = point2d(mx.calPoint([box[2], box[1]], matrixEvent));
    let p3 = point2d(mx.calPoint([box[2], box[3]], matrixEvent));
    let p4 = point2d(mx.calPoint([box[0], box[3]], matrixEvent));
    return {
      left: Math.min(p1[0], Math.min(p2[0], Math.min(p3[0], p4[0]))),
      top: Math.min(p1[1], Math.min(p2[1], Math.min(p3[1], p4[1]))),
      right: Math.max(p1[0], Math.max(p2[0], Math.max(p3[0], p4[0]))),
      bottom: Math.max(p1[1], Math.max(p2[1], Math.max(p3[1], p4[1]))),
      points: [p1, p2, p3, p4],
    };
  }

  // img和geom返回false，在inline布局时判断是否是真的inline
  __isRealInline() {
    return true;
  }

  remove(cb) {
    let self = this;
    if(self.isDestroyed) {
      inject.warn('Remove target is destroyed.');
      if(isFunction(cb)) {
        cb();
      }
      return;
    }
    let { root, domParent } = self;
    let target = self.isShadowRoot ? self.hostRoot : self;
    // 特殊情况连续append/remove时候，还未被添加进来找不到所以无需删除
    if(domParent.children.indexOf(target) === -1) {
      if(isFunction(cb)) {
        cb();
      }
      return;
    }
    root.delRefreshTask(self.__task);
    root.addRefreshTask(self.__task = {
      __before() {
        self.__task = null; // 清除在before，防止after的回调增加新的task误删
        let pJson = domParent.__json;
        let i = pJson.children.indexOf(self.isShadowRoot ? self.hostRoot.__json : self.__json);
        let zChildren = domParent.zIndexChildren;
        let j = zChildren.indexOf(self.isShadowRoot ? self.hostRoot : self);
        if(i === -1 || j === -1) {
          throw new Error('Remove index Exception.')
        }
        pJson.children.splice(i, 1);
        domParent.children.splice(i, 1);
        zChildren.splice(j, 1);
        if(self.__prev) {
          self.__prev.__next = self.__next;
        }
        // 刷新前统一赋值，由刷新逻辑计算最终值避免优先级覆盖问题
        let res = {};
        res[UPDATE_NODE] = self;
        res[UPDATE_FOCUS] = level.REFLOW;
        res[UPDATE_REMOVE_DOM] = true;
        res[UPDATE_CONFIG] = self.__config;
        root.__addUpdate(self, self.__config, root, root.__config, res);
      },
      __after(diff) {
        self.isShadowRoot ? self.hostRoot.__destroy() : self.__destroy();
        if(isFunction(cb)) {
          cb.call(self, diff);
        }
      },
    });
  }

  get tagName() {
    return this.__tagName;
  }

  get sx() {
    return this.__sx;
  }

  get sy() {
    return this.__sy;
  }

  get clientWidth() {
    return this.__clientWidth || 0;
  }

  get clientHeight() {
    return this.__clientHeight || 0;
  }

  get offsetWidth() {
    return this.__offsetWidth || 0;
  }

  get offsetHeight() {
    return this.__offsetHeight || 0;
  }

  get outerWidth() {
    return this.__outerWidth || 0;
  }

  get outerHeight() {
    return this.__outerHeight || 0;
  }

  // 不考虑margin的范围，>=REPAINT渲染或个别有影响的渲染改变（如blur）清空缓存
  get bbox() {
    if(!this.__bbox) {
      let {
        __sx1, __sy1, offsetWidth, offsetHeight,
        currentStyle: {
          [BOX_SHADOW]: boxShadow,
          [FILTER]: filter,
        },
      } = this;
      let [x1, y1, x2, y2] = this.__spreadBbox(boxShadow, filter);
      this.__bbox = [__sx1 + x1, __sy1 + y1, __sx1 + offsetWidth + x2, __sy1 + offsetHeight + y2];
    }
    return this.__bbox;
  }

  get listener() {
    return this.__listener;
  }

  get matrix() {
    return this.__config[NODE_MATRIX];
  }

  get matrixEvent() {
    return this.__config[NODE_MATRIX_EVENT];
  }

  get perspectiveMatrix() {
    return this.__config[NODE_PERSPECTIVE_MATRIX];
  }

  get style() {
    return this.__style;
  }

  get computedStyle() {
    return this.__computedStyle;
  }

  get animationList() {
    return this.__animationList;
  }

  get currentStyle() {
    return this.__currentStyle;
  }

  get isShadowRoot() {
    return !this.parent && this.host && this.host !== this.root;
  }

  get contentBoxList() {
    return this.__contentBoxList;
  }

  get baseLine() {
    return this.offsetHeight;
  }

  get firstBaseLine() {
    return this.offsetHeight;
  }

  get isMask() {
    return this.__isMask;
  }

  get isClip() {
    return this.__isClip;
  }

  get cacheAsBitmap() {
    return this.__cacheAsBitmap;
  }

  set cacheAsBitmap(v) {
    this.__config[NODE_CACHE_AS_BITMAP] = this.__cacheAsBitmap = !!v;
  }
}

export default Xom;
