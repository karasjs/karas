import Node from './Node';
import Component from './Component';
import inline from './inline';
import Ellipsis from './Ellipsis';
import unit from '../style/unit';
import tf from '../style/transform';
import gradient from '../style/gradient';
import border from '../style/border';
import css from '../style/css';
import bg from '../style/bg';
import abbr from '../style/abbr';
import enums from '../util/enums';
import util from '../util/util';
import inject from '../util/inject';
import painter from '../util/painter';
import Animation from '../animate/Animation';
import frame from '../animate/frame';
import mx from '../math/matrix';
import geom from '../math/geom';
import mode from '../refresh/mode';
import change from '../refresh/change';
import level from '../refresh/level';
import font from '../style/font';
import bs from '../style/bs';
import mbm from '../style/mbm';
import reset from '../style/reset';

const { svgPolygon } = painter;
const { CANVAS, SVG, WEBGL } = mode;
const { normalize, equalStyle } = css;

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
    FONT_WEIGHT,
    FLEX_DIRECTION,
    JUSTIFY_CONTENT,
    ALIGN_ITEMS,
    ALIGN_SELF,
    FLEX_GROW,
    FLEX_SHRINK,
    LINE_CLAMP,
    ORDER,
    FLEX_WRAP,
    ALIGN_CONTENT,
    TEXT_ALIGN,
    LETTER_SPACING,
    WHITE_SPACE,
    WRITING_MODE,
    TRANSFORM_STYLE,
    BACKFACE_VISIBILITY,
    BOX_SIZING,
    FONT_SIZE_SHRINK,
  },
} = enums;
const { AUTO, PX, PERCENT, INHERIT, NUMBER, RGBA, STRING, REM, VW, VH, VMAX, VMIN, DEG, GRADIENT } = unit;
const { int2rgba, rgba2int, joinArr, isNil, isFunction } = util;
const { calRelative, calNormalLineHeight, calFontFamily, spreadBoxShadow, spreadFilter } = css;
const { GEOM } = change;
const { mbmName, isValidMbm } = mbm;
const { point2d,  multiply,
  multiplyRotateX, multiplyRotateY, multiplyRotateZ,
  multiplySkewX, multiplySkewY,
  multiplyScaleX, multiplyScaleY, multiplyScaleZ } = mx;

const {
  TRANSFORM: TF,
  REFLOW,
  REPAINT,
  TRANSLATE_X: TX,
  TRANSLATE_Y: TY,
  TRANSLATE_Z: TZ,
  ROTATE_Z: RZ,
  SCALE_X: SX,
  SCALE_Y: SY,
  SCALE_Z: SZ,
  SCALE,
  TRANSFORM_ALL,
  CACHE,
  MASK,
} = level;
const { d2r } = geom;
const { calRotateX, calRotateY, calRotateZ, calRotate3d } = tf;

function getFirstEmptyInlineWidth(xom) {
  let n = 0;
  let flowChildren = xom.flowChildren;
  let length = flowChildren.length;
  for(let i = 0; i < length; i++) {
    let child = flowChildren[i];
    if(child instanceof Xom || child instanceof Component && child.shadowRoot instanceof Xom) {
      if(child.flowChildren && child.flowChildren.length) {
        n += getFirstEmptyInlineWidth(child);
        break;
      }
      else if(child.__isInline) {
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
      if(child.flowChildren && child.flowChildren.length) {
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
    this.__currentStyle = []; // 动画过程中绘制一开始会merge动画样式
    this.__computedStyle = []; // 类似getComputedStyle()将currentStyle计算好数值赋给
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
    this.__cacheStyle = []; // 是否缓存重新计算computedStyle的样式key
    this.__cacheDefs = []; // svg专用，缓存渲染时使用已有的defs，diff过程用，否则会defs被清空
    let isClip = this.__clip = !!this.props.clip;
    this.__mask = isClip || !!this.props.mask;
    this.__refreshLevel = REFLOW;
    this.__limitCache = false;
    this.__isInline = false;
    this.__hasContent = false;
    this.__opacity = 1;
    this.__matrix = [];
    this.__matrixEvent = [];
    this.__perspectiveMatrix = null;
    this.__frameAnimateList = [];
    this.__contentBoxList = []; // inline存储内容用
    this.__cacheAsBitmap = !!this.props.cacheAsBitmap;
    this.__cache = this.__cacheTotal = this.__cacheFilter = this.__cacheMask;
    this.__layoutData = null; // 缓存上次布局x/y/w/h数据
    this.__hasComputeReflow = false; // 每次布局计算缓存标，使得每次开始只computeReflow一次
    this.__parentLineBox = null; // inline时指向
    this.__fontRegister = {}; // 优先级字体尚未加载时记录回调hash，销毁时删除回调
  }

  __structure(lv, j) {
    let res = super.__structure(lv, j);
    if(this.__hasMask) {
      res.hasMask = this.__hasMask;
    }
    return res;
  }

  __modifyStruct() {}

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
      computedStyle[a] = this.__calSize(currentStyle[a], w, true);
      computedStyle[b] = this.__calSize(currentStyle[b], w, true);
    });
  }

  __calSize(v, w, includePercent) {
    if(v.u === PX) {
      return v.v;
    }
    else if(v.u === PERCENT) {
      if(includePercent) {
        return v.v * w * 0.01;
      }
    }
    else if(v.u === REM || v.u === REM) {
      return v.v * this.__root.computedStyle[FONT_SIZE];
    }
    else if(v.u === VW) {
      return v.v * this.__root.width * 0.01;
    }
    else if(v.u === VH) {
      return v.v * this.__root.height * 0.01;
    }
    else if(v.u === VMAX) {
      return v.v * Math.max(this.__root.width, this.__root.height) * 0.01;
    }
    else if(v.u === VMIN) {
      return v.v * Math.min(this.__root.width, this.__root.height) * 0.01;
    }
    return 0;
  }

  __computeReflow() {
    if(this.__hasComputeReflow) {
      return;
    }
    this.__hasComputeReflow = true;

    let { __currentStyle: currentStyle, __computedStyle: computedStyle, __domParent: parent } = this;
    let isRoot = !parent;
    let parentComputedStyle = parent && parent.__computedStyle;
    // 继承的特殊处理，根节点用默认值
    [FONT_SIZE, FONT_FAMILY, FONT_WEIGHT, WRITING_MODE, FONT_SIZE_SHRINK].forEach(k => {
      let v = currentStyle[k];
      // ff特殊处理
      if(k === FONT_FAMILY) {
        if(v.u === INHERIT) {
          computedStyle[k] = isRoot ? reset.INHERIT[STYLE_RV_KEY[k]] : parentComputedStyle[k];
        }
        else {
          computedStyle[k] = v.v;
          let ff = v.v.split(/\s*,\s*/);
          // 从左到右即声明的字体优先级
          for(let i = 0, len = ff.length; i < len; i++) {
            let item = ff[i].replace(/^['"]/, '').replace(/['"]$/, '');
            if(font.hasRegister(item)) {
              // 如果已经注册加载了，或者注册且本地支持的，说明可用
              if(font.hasLoaded(item) || inject.checkSupportFontFamily(item)) {
                break;
              }
            }
            // 不可用的都特殊记住等待注册回调__loadFontCallback
            this.__fontRegister[item] = true;
            font.onRegister(item, this);
          }
        }
      }
      else if(v.u === INHERIT) {
        computedStyle[k] = isRoot ? reset.INHERIT[STYLE_RV_KEY[k]] : parentComputedStyle[k];
      }
      // fontSize和shrinkFontSize会有%
      else if(v.u === PERCENT) {
        computedStyle[k] = isRoot ? reset.INHERIT[STYLE_RV_KEY[k]] : (this.root.computedStyle[FONT_SIZE] * v.v * 0.01);
      }
      else if(v.u === REM) {
        computedStyle[k] = isRoot ? reset.INHERIT[STYLE_RV_KEY[k]] : (this.root.computedStyle[FONT_SIZE] * v.v);
      }
      else if(v.u === VW) {
        computedStyle[k] = isRoot ? reset.INHERIT[STYLE_RV_KEY[k]] : (this.root.width * 0.01 * v.v);
      }
      else if(v.u === VH) {
        computedStyle[k] = isRoot ? reset.INHERIT[STYLE_RV_KEY[k]] : (this.root.height * 0.01 * v.v);
      }
      else if(v.u === VMAX) {
        computedStyle[k] = isRoot ? reset.INHERIT[STYLE_RV_KEY[k]] : (Math.max(this.root.width, this.root.height) * 0.01 * v.v);
      }
      else if(v.u === VMIN) {
        computedStyle[k] = isRoot ? reset.INHERIT[STYLE_RV_KEY[k]] : (Math.min(this.root.width, this.root.height) * 0.01 * v.v);
      }
      else {
        computedStyle[k] = v.v;
      }
    });
    [
      BORDER_TOP_WIDTH,
      BORDER_RIGHT_WIDTH,
      BORDER_BOTTOM_WIDTH,
      BORDER_LEFT_WIDTH,
    ].forEach(k => {
      // border-width不支持百分比
      let item = currentStyle[k];
      computedStyle[k] = this.__calSize(item, 0, false);
    });
    [
      POSITION,
      DISPLAY,
      BOX_SIZING,
      FLEX_DIRECTION,
      JUSTIFY_CONTENT,
      ALIGN_ITEMS,
      ALIGN_SELF,
      FLEX_GROW,
      FLEX_SHRINK,
      LINE_CLAMP,
      ORDER,
      FLEX_WRAP,
      ALIGN_CONTENT,
      OVERFLOW,
      TEXT_OVERFLOW,
    ].forEach(k => {
      computedStyle[k] = currentStyle[k];
    });
    // writingMode特殊判断inline
    if(parentComputedStyle && computedStyle[WRITING_MODE] !== parentComputedStyle[WRITING_MODE] && computedStyle[DISPLAY] === 'inline') {
      computedStyle[DISPLAY] = 'inlineBlock';
    }
    // 匿名块对象
    if(computedStyle[POSITION] === 'absolute' || parentComputedStyle && parentComputedStyle[DISPLAY] === 'flex') {
      if(['block', 'flex'].indexOf(computedStyle[DISPLAY]) === -1) {
        computedStyle[DISPLAY] = 'block';
      }
    }
    let textAlign = currentStyle[TEXT_ALIGN];
    if(textAlign.u === INHERIT) {
      computedStyle[TEXT_ALIGN] = isRoot ? 'left' : parentComputedStyle[TEXT_ALIGN];
    }
    else {
      computedStyle[TEXT_ALIGN] = textAlign.v;
    }
    let fontSize = computedStyle[FONT_SIZE];
    let lineHeight = currentStyle[LINE_HEIGHT];
    // lineHeight继承很特殊，数字和normal不同于普通单位
    if(lineHeight.u === INHERIT) {
      if(isRoot) {
        computedStyle[LINE_HEIGHT] = calNormalLineHeight(computedStyle);
      }
      else {
        let p = parent;
        let ph;
        while(p) {
          ph = p.currentStyle[LINE_HEIGHT];
          if(ph.u !== INHERIT) {
            break;
          }
          p = p.domParent;
        }
        // 到root还是inherit或normal，或者中途遇到了normal，使用normal
        if([AUTO, INHERIT].indexOf(ph.u) > -1) {
          computedStyle[LINE_HEIGHT] = calNormalLineHeight(computedStyle);
        }
        // 数字继承
        else if(ph.u === NUMBER) {
          computedStyle[LINE_HEIGHT] = Math.max(ph.v, 0) * fontSize;
        }
        // 单位继承
        else {
          computedStyle[LINE_HEIGHT] = parentComputedStyle[LINE_HEIGHT];
        }
      }
    }
    else if(lineHeight.u === NUMBER) {
      computedStyle[LINE_HEIGHT] = Math.max(lineHeight.v, 0) * fontSize || calNormalLineHeight(computedStyle);
    }
    // 防止为0
    else {
      let v = Math.max(this.__calSize(lineHeight, fontSize, true), 0);
      computedStyle[LINE_HEIGHT] = v || calNormalLineHeight(computedStyle);
    }
    let letterSpacing = currentStyle[LETTER_SPACING];
    if(letterSpacing.u === INHERIT) {
      computedStyle[LETTER_SPACING] = isRoot ? 0 : parentComputedStyle[LETTER_SPACING];
    }
    else {
      computedStyle[LETTER_SPACING] = this.__calSize(letterSpacing, fontSize, true);
    }
    //whiteSpace
    let whiteSpace = currentStyle[WHITE_SPACE];
    if(whiteSpace.u === INHERIT) {
      computedStyle[WHITE_SPACE] = isRoot ? 'normal' : parentComputedStyle[WHITE_SPACE];
    }
    else {
      computedStyle[WHITE_SPACE] = whiteSpace.v;
    }
    let {
      [WIDTH]: width,
      [HEIGHT]: height,
    } = currentStyle;
    this.__width = this.__height = 0;
    // 布局前固定尺寸的线设置好，子元素percent尺寸要用到，flex的子元素侧轴stretch也要特殊提前处理，认为定高
    if(width.u !== AUTO) {
      this.__width = computedStyle[WIDTH] = this.__calSize(width, isRoot ? this.__width : parent.__width, true);
    }
    if(height.u !== AUTO) {
      this.__height = computedStyle[HEIGHT] = this.__calSize(height, isRoot ? this.__height : parent.__height, true);
    }
    else {
      let p = this.__domParent;
      if(p) {
        let crs = p.__currentStyle;
        let alignSelf = currentStyle[ALIGN_SELF];
        // flex的子元素stretch提前处理认为高度，以便其子元素%高度计算
        if(crs[DISPLAY] === 'flex' && p.__height) {
          if(crs[FLEX_DIRECTION].indexOf('row') > -1
            && (alignSelf === 'stretch'
            || crs[ALIGN_ITEMS] === 'stretch' && alignSelf === 'auto')) {
            this.__height = p.__height;
          }
        }
      }
    }
  }

  __emitFontRegister(fontFamily) {
    let node = this, fontRegister = node.__fontRegister;
    if(node.__isDestroyed) {
      return;
    }
    delete fontRegister[fontFamily];
    let { root, currentStyle } = node;
    if(!root) {
      return;
    }
    let v = currentStyle[FONT_FAMILY];
    if(v.u === INHERIT) {
      return;
    }
    let ff = v.v.split(/\s*,\s*/);
    for(let i = 0, len = ff.length; i < len; i++) {
      let item = ff[i].replace(/^['"]/, '').replace(/['"]$/, '');
      if(item === fontFamily) {
        // 加载成功回调可能没注册信息，需要多判断一下
        if(font.hasRegister(item)) {
          root.__addUpdate(node, null, REFLOW, null, null, null, null);
        }
        // 后面低优先级的无需再看
        return;
      }
      // 有更高优先级的已经支持了，回调刷新无效
      else if(font.hasRegister(item)
        && (font.hasLoaded(item) || inject.checkSupportFontFamily(item))) {
        return;
      }
    }
  }

  // dom常用的几种尺寸赋值
  __ioSize(w, h) {
    let computedStyle = this.__computedStyle;
    // 可能不传，在虚拟布局时用不到
    if(!isNil(w)) {
      this.__width = computedStyle[WIDTH] = w;
      this.__clientWidth = w += computedStyle[PADDING_LEFT] + computedStyle[PADDING_RIGHT];
      this.__offsetWidth = w += computedStyle[BORDER_LEFT_WIDTH] + computedStyle[BORDER_RIGHT_WIDTH];
      this.__outerWidth = w + computedStyle[MARGIN_LEFT] + computedStyle[MARGIN_RIGHT];
    }
    if(!isNil(h)) {
      this.__height = computedStyle[HEIGHT] = h;
      this.__clientHeight = h += computedStyle[PADDING_TOP] + computedStyle[PADDING_BOTTOM];
      this.__offsetHeight = h += computedStyle[BORDER_TOP_WIDTH] + computedStyle[BORDER_BOTTOM_WIDTH];
      this.__outerHeight = h + computedStyle[MARGIN_TOP] + computedStyle[MARGIN_BOTTOM];
    }
  }

  // 为basis的b/min/max添加mpb，只有当b未显示指定等于w/content时才加，同时返回mpb值
  __addMBP(isDirectionRow, w, currentStyle, computedStyle, res, isDirectItem) {
    let {
      [MARGIN_LEFT]: marginLeft,
      [MARGIN_TOP]: marginTop,
      [MARGIN_RIGHT]: marginRight,
      [MARGIN_BOTTOM]: marginBottom,
      [PADDING_LEFT]: paddingLeft,
      [PADDING_TOP]: paddingTop,
      [PADDING_RIGHT]: paddingRight,
      [PADDING_BOTTOM]: paddingBottom,
      [BOX_SIZING]: boxSizing,
    } = currentStyle;
    let {
      [BORDER_TOP_WIDTH]: borderTopWidth,
      [BORDER_RIGHT_WIDTH]: borderRightWidth,
      [BORDER_BOTTOM_WIDTH]: borderBottomWidth,
      [BORDER_LEFT_WIDTH]: borderLeftWidth,
    } = computedStyle;
    if(isDirectionRow) {
      let m = this.__calSize(marginLeft, w, isDirectItem)
        + this.__calSize(marginRight, w, isDirectItem);
      let bp = 0;
      if(isDirectItem || boxSizing === 'contentBox') {
        bp = this.__calSize(paddingLeft, w, isDirectItem)
          + this.__calSize(paddingRight, w, isDirectItem)
          + borderLeftWidth + borderRightWidth;
      }
      res = res.map(item => item + m + bp);
    }
    else {
      let m = this.__calSize(marginTop, w, isDirectItem)
        + this.__calSize(marginBottom, w, isDirectItem);
      let bp = 0;
      if(isDirectItem || boxSizing === 'contentBox') {
        bp = this.__calSize(paddingTop, w, isDirectItem)
          + this.__calSize(paddingBottom, w, isDirectItem)
          + borderTopWidth + borderBottomWidth;
      }
      res = res.map(item => item + m + bp);
    }
    return res;
  }

  __layout(data, isAbs, isColumn, isRow) {
    this.__layoutFlow(data, isAbs, isColumn, isRow);
  }

  // absolute且无尺寸时，isAbs标明先假布局一次计算尺寸，还有flex列计算时isColumn假布局，flex横计算时writingMode垂直假布局
  __layoutFlow(data, isAbs, isColumn, isRow) {
    this.__computeReflow();
    let { __isDestroyed, __currentStyle, __computedStyle, __ellipsis } = this;
    // 虚拟省略号每次清除
    if(__ellipsis) {
      this.__ellipsis = null;
    }
    this.__parentLineBox = null;
    this.__isIbFull = this.__isUprightIbFull = false;
    let {
      [DISPLAY]: display,
      [POSITION]: position,
    } = __computedStyle;
    this.__layoutData = {
      x: data.x,
      y: data.y,
      w: data.w,
      h: data.h,
      lx: data.lx,
      ly: data.ly,
      isUpright: data.isUpright, // 从Root开始，父级的书写模式需每层传递
      container: data.container,
    };
    // 防止display:none不统计mask，isVirtual忽略，abs/flex布局后续会真正来走一遍
    if(!isAbs && !isColumn && !isRow) {
      this.clearCache();
      this.__cacheStyle = [];
      this.__refreshLevel = REFLOW;
      this.__limitCache = false;
      this.__isInline = false;
      let { next } = this;
      // mask关系只有布局才会变更，普通渲染关系不会改变，clip也是mask的一种
      if(!this.__mask && next && (next.__mask)) {
        let count = 0;
        while(next) {
          if(next.__mask) {
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
    if(__isDestroyed || display === 'none') {
      this.__x = data.x;
      this.__y = data.y;
      this.__layoutNone();
      this.__hasComputeReflow = false;
      return;
    }
    // absolute特殊，在自己布局时已计算相对于容器的mbp
    if(position !== 'absolute') {
      this.__mp(__currentStyle, __computedStyle, data.w);
    }
    // 只有inline会继承计算行数，其它都是原样返回
    let lineClampCount = data.lineClampCount || 0;
    // 4种布局，默认block，inlineBlock基本可以复用inline逻辑，除了尺寸
    if(display === 'flex') {
      data.lineClampCount = 0;
      this.__layoutFlex(data, isAbs, isColumn, isRow);
    }
    else if(display === 'inlineBlock') {
      data.lineClampCount = 0;
      this.__layoutInline(data, isAbs, isColumn, isRow);
    }
    else if(display === 'inline') {
      lineClampCount = this.__layoutInline(data, isAbs, isColumn, isRow, true);
    }
    else {
      data.lineClampCount = 0;
      this.__layoutBlock(data, isAbs, isColumn, isRow);
    }
    // 非虚拟布局才执行，防止重复
    if(!isAbs && !isColumn && !isRow) {
      // 计算结果存入computedStyle和6个坐标，inline在其inlineSize特殊处理
      let x = this.__x;
      let y = this.__y;
      if(!this.__isInline) {
        x = this.__x1 = x + __computedStyle[MARGIN_LEFT];
        x = this.__x2 = x + __computedStyle[BORDER_LEFT_WIDTH];
        x = this.__x3 = x + __computedStyle[PADDING_LEFT];
        x = this.__x4 = x + this.__width;
        x = this.__x5 = x + __computedStyle[PADDING_RIGHT];
        this.__x6 = x + __computedStyle[BORDER_RIGHT_WIDTH];
        y = this.__y1 = y + __computedStyle[MARGIN_TOP];
        y = this.__y2 = y + __computedStyle[BORDER_TOP_WIDTH];
        y = this.__y3 = y + __computedStyle[PADDING_TOP];
        y = this.__y4 = y + this.__height;
        y = this.__y5 = y + __computedStyle[PADDING_BOTTOM];
        this.__y6 = y + __computedStyle[BORDER_BOTTOM_WIDTH];
      }
      // relative渲染时做偏移，百分比基于父元素，若父元素没有定高则为0
      if(position === 'relative') {
        let {[TOP]: top, [RIGHT]: right, [BOTTOM]: bottom, [LEFT]: left} = __currentStyle;
        let {parent} = this;
        if(top.u !== AUTO) {
          let n = calRelative(__currentStyle, TOP, top, parent);
          if(n) {
            this.__offsetY(n, true, null);
            if(this.__isInline) {
              let list = this.__contentBoxList;
              if(Array.isArray(list)) {
                let last;
                list.forEach(item => {
                  let p = item.__parentLineBox;
                  if(p && p !== last) {
                    p.__oy += n;
                  }
                  last = p;
                });
              }
            }
          }
          __computedStyle[TOP] = n;
          __computedStyle[BOTTOM] = 'auto';
        }
        else if(bottom.u !== AUTO) {
          let n = calRelative(__currentStyle, BOTTOM, bottom, parent);
          if(n) {
            this.__offsetY(-n, true, null);
            if(this.__isInline) {
              let list = this.__contentBoxList;
              if(Array.isArray(list)) {
                let last;
                list.forEach(item => {
                  let p = item.__parentLineBox;
                  if(p && p !== last) {
                    p.__oy -= n;
                  }
                  last = p;
                });
              }
            }
          }
          __computedStyle[BOTTOM] = n;
          __computedStyle[TOP] = 'auto';
        }
        else {
          __computedStyle[TOP] = __computedStyle[BOTTOM] = 'auto';
        }
        if(left.u !== AUTO) {
          let n = calRelative(__currentStyle, LEFT, left, parent, true);
          if(n) {
            this.__offsetX(n, true, null);
          }
          __computedStyle[LEFT] = n;
          __computedStyle[RIGHT] = 'auto';
        }
        else if (right.u !== AUTO) {
          let n = calRelative(__currentStyle, RIGHT, right, parent, true);
          if(n) {
            this.__offsetX(-n, true, null);
          }
          __computedStyle[RIGHT] = n;
          __computedStyle[LEFT] = 'auto';
        }
        else {
          __computedStyle[LEFT] = __computedStyle[RIGHT] = 'auto';
        }
      }
      else if (position !== 'absolute') {
        __computedStyle[TOP] = __computedStyle[BOTTOM] = __computedStyle[LEFT] = __computedStyle[RIGHT] = 'auto';
      }
      __computedStyle[WIDTH] = this.__width;
      __computedStyle[HEIGHT] = this.__height;
      // abs为parse的根节点时特殊自己执行，前提是真布局
      if(position !== 'absolute') {
        this.__execAr();
      }
      this.__hasComputeReflow = false;
    }
    return lineClampCount;
  }

  __layoutStyle() {
    let currentStyle = this.__currentStyle;
    let computedStyle = this.__computedStyle;
    let cacheStyle = this.__cacheStyle;
    this.__calStyle(level.REFLOW, currentStyle, computedStyle, cacheStyle);
    this.__calPerspective(currentStyle, computedStyle, cacheStyle);
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
    this.__computeReflow();
    let { __computedStyle } = this;
    __computedStyle[DISPLAY] = 'none';
    this.__reset0();
    this.__hasComputeReflow = false;
  }

  __reset0() {
    let { __computedStyle } = this;
    __computedStyle[MARGIN_TOP]
      = __computedStyle[MARGIN_RIGHT]
      = __computedStyle[MARGIN_BOTTOM]
      = __computedStyle[MARGIN_LEFT]
      = __computedStyle[BORDER_TOP_WIDTH]
      = __computedStyle[BORDER_RIGHT_WIDTH]
      = __computedStyle[BORDER_BOTTOM_WIDTH]
      = __computedStyle[BORDER_LEFT_WIDTH]
      = __computedStyle[PADDING_TOP]
      = __computedStyle[PADDING_RIGHT]
      = __computedStyle[PADDING_BOTTOM]
      = __computedStyle[PADDING_LEFT]
      = __computedStyle[WIDTH]
      = __computedStyle[HEIGHT]
      = this.__width
      = this.__height
      = this.__clientWidth
      = this.__clientHeight
      = this.__offsetWidth
      = this.__offsetHeight
      = this.__outerWidth
      = this.__outerHeight
      = 0;
  }

  // 预先计算是否是固定宽高，布局点位和尺寸考虑margin/border/padding
  __preLayout(data, isInline) {
    let { x, y, w, h, w2, h2, w3, h3, lx, ly, lineBoxManager, endSpace = 0, isUpright: isParentVertical, container } = data;
    this.__x = x;
    this.__y = y;
    let { __currentStyle: currentStyle, __computedStyle: computedStyle } = this;
    let {
      [WIDTH]: width,
      [HEIGHT]: height,
    } = currentStyle;
    let position = computedStyle[POSITION];
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
      [WRITING_MODE]: writingMode,
      [BOX_SIZING]: boxSizing,
    } = computedStyle;
    let isUpright = writingMode.indexOf('vertical') === 0;
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
    else if(width.u !== AUTO && !isInline) {
      fixedWidth = true;
      // abs的百分比尺寸相对于container
      if(position === 'absolute' && width.u === PERCENT) {
        w = this.__calSize(width, container.__clientWidth, true);
      }
      else {
        w = this.__calSize(width, w, true);
        if(boxSizing === 'borderBox') {
          w -= borderLeftWidth + borderRightWidth + paddingLeft + paddingRight;
        }
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
    // height的百分比需要parent有值不能auto，或者parent的flex定高且侧轴stretch时；abs的百分比相对于container
    else if(height.u !== AUTO && !isInline) {
      if(position === 'absolute' && height.u === PERCENT) {
        h = this.__calSize(height, container.__clientHeight, true);
      }
      else {
        let p = this.__domParent;
        if(height.u === PERCENT) {
          // 一般都是0，除了定高，或者flex的stretch
          if(p.height) {
            fixedHeight = true;
            h = this.__calSize(height, p.height || 0, true);
          }
        }
        else {
          fixedHeight = true;
          h = this.__calSize(height, h, true);
        }
        if(boxSizing === 'borderBox') {
          h -= borderTopWidth + borderBottomWidth + paddingTop + paddingBottom;
        }
      }
    }
    // margin/border/padding影响x和y和尺寸，注意inline的y不受mpb影响（垂直模式则是x）
    if(!isInline) {
      x += borderLeftWidth + marginLeft + paddingLeft;
      y += borderTopWidth + marginTop + paddingTop;
    }
    else {
      if(isUpright) {
        y += borderTopWidth + marginTop + paddingTop;
      }
      else {
        x += borderLeftWidth + marginLeft + paddingLeft;
      }
    }
    data.x = x;
    data.y = y;
    // inline的w/h很特殊，需不考虑inline自身水平的mpb以便换行，因为mpb只在首尾行生效，所以首尾需特殊处理中间忽略
    // 当嵌套inline时更加复杂，假如inline有尾部mpb，最后一行需考虑，如果此inline是父的最后一个且父有mpb需叠加
    let selfEndSpace = 0;
    if(isInline) {
      if(isUpright) {
        selfEndSpace = paddingBottom + borderBottomWidth + marginBottom;
      }
      else {
        selfEndSpace = paddingRight + borderRightWidth + marginRight;
      }
    }
    // 传入w3/h3时，flex的item已知目标主尺寸，需减去mbp，其一定是block，和inline互斥
    else {
      if(width.u === AUTO || w3 !== undefined) {
        w -= borderLeftWidth + borderRightWidth + marginLeft + marginRight + paddingLeft + paddingRight;
      }
      if(height.u === AUTO || h3 !== undefined) {
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
      ly,
      lineBoxManager,
      endSpace,
      selfEndSpace,
      isParentVertical,
      isUpright,
    };
  }

  // 处理margin:xx auto居中对齐或右对齐
  __marginAuto(style, data, isUpright) {
    let {
      [POSITION]: position,
      [DISPLAY]: display,
      [MARGIN_TOP]: marginTop,
      [MARGIN_BOTTOM]: marginBottom,
      [MARGIN_LEFT]: marginLeft,
      [MARGIN_RIGHT]: marginRight,
      [WIDTH]: width,
      [HEIGHT]: height,
    } = style;
    if(position !== 'absolute' && (display === 'block' || display === 'flex')) {
      if(isUpright) {
        if((height.u !== AUTO || this.isReplaced) && marginTop.u === AUTO && marginBottom.u === AUTO) {
          let oh = this.outerHeight;
          if(oh < data.h) {
            this.__offsetY((data.h - oh) * 0.5, true, null);
          }
        }
      }
      else {
        if((width.u !== AUTO || this.isReplaced) && marginLeft.u === AUTO && marginRight.u === AUTO) {
          let ow = this.outerWidth;
          if(ow < data.w) {
            this.__offsetX((data.w - ow) * 0.5, true, null);
          }
        }
      }
    }
  }

  __calMatrix(lv, __currentStyle, __computedStyle, __cacheStyle, optimize) {
    let {
      __x1,
      __y1,
      __offsetWidth,
      __offsetHeight,
    } = this;
    if(this.__isInline) {
      __computedStyle[TRANSFORM_ORIGIN] = [__x1, __y1];
      return __cacheStyle[MATRIX] = this.__matrix = mx.identity();
    }
    let matrixCache = __cacheStyle[MATRIX];
    // 优化计算scale不能为0，无法计算倍数差，rotateZ优化不能包含rotateX/rotateY/skew
    if(!isNil(optimize)) {}
    else if(matrixCache && lv < REFLOW && !(lv & TF)) {
      if((lv & SX) && !__computedStyle[SCALE_X]
        || (lv & SY) && !__computedStyle[SCALE_Y]
        || (lv & SZ) && !__computedStyle[SCALE_Z]
        || (lv & RZ) && (__computedStyle[ROTATE_X] || __computedStyle[ROTATE_Y]
          || __computedStyle[SKEW_X] || __computedStyle[SKEW_Y])) {
      }
      else {
        optimize = true;
      }
    }
    // translate/scale变化特殊优化，d/h/l不能有值，否则不能这样直接简化运算，因为这里不包含perspective，所以一定没有
    if(optimize && matrixCache) {
      let transform = __computedStyle[TRANSFORM];
      if(lv & TX) {
        let v = __currentStyle[TRANSLATE_X];
        if(!v) {
          v = 0;
        }
        else if(v.u === PX) {
          v = v.v;
        }
        else {
          v = this.__calSize(v, this.__offsetWidth, true);
        }
        let x = v - __computedStyle[TRANSLATE_X];
        __computedStyle[TRANSLATE_X] = v;
        transform[12] += x;
        matrixCache[12] += x;
      }
      if(lv & TY) {
        let v = __currentStyle[TRANSLATE_Y];
        if(!v) {
          v = 0;
        }
        else if(v.u === PX) {
          v = v.v;
        }
        else {
          v = this.__calSize(v, this.__offsetHeight, true);
        }
        let y = v - __computedStyle[TRANSLATE_Y];
        __computedStyle[TRANSLATE_Y] = v;
        transform[13] += y;
        matrixCache[13] += y;
      }
      if(lv & TZ) {
        let v = __currentStyle[TRANSLATE_Z];
        if(!v) {
          v = 0;
        }
        else if(v.u === PX) {
          v = v.v;
        }
        else {
          v = this.__calSize(v, this.__offsetWidth, true);
        }
        let z = v - __computedStyle[TRANSLATE_Z];
        __computedStyle[TRANSLATE_Z] = v;
        transform[14] += z;
        matrixCache[14] += z;
      }
      if(lv & RZ) {
        let v = __currentStyle[ROTATE_Z].v;
        __computedStyle[ROTATE_Z] = v;
        v = d2r(v);
        let sin = Math.sin(v), cos = Math.cos(v);
        let x = __computedStyle[SCALE_X], y = __computedStyle[SCALE_Y];
        let cx = matrixCache[0] = transform[0] = cos * x;
        let sx = matrixCache[1] = transform[1] = sin * x;
        let sy = matrixCache[4] = transform[4] = -sin * y;
        let cy = matrixCache[5] = transform[5] = cos * y;
        let t = __computedStyle[TRANSFORM_ORIGIN], ox = t[0], oy = t[1];
        ox += __x1;
        oy += __y1;
        matrixCache[12] = transform[12] + ox - cx * ox - oy * sy;
        matrixCache[13] = transform[13] + oy - sx * ox - oy * cy;
      }
      if(lv & SCALE) {
        if(lv & SX) {
          if(!__computedStyle[SCALE_X]) {
            return this.__calMatrix(REFLOW, __currentStyle, __computedStyle, __cacheStyle, false);
          }
          let v = __currentStyle[SCALE_X].v;
          let x = v / __computedStyle[SCALE_X];
          __computedStyle[SCALE_X] = v;
          transform[0] *= x;
          transform[1] *= x;
          transform[2] *= x;
          matrixCache[0] *= x;
          matrixCache[1] *= x;
          matrixCache[2] *= x;
        }
        if(lv & SY) {
          if(!__computedStyle[SCALE_Y]) {
            return this.__calMatrix(lv, __currentStyle, __computedStyle, __cacheStyle, false);
          }
          let v = __currentStyle[SCALE_Y].v;
          let y = v / __computedStyle[SCALE_Y];
          __computedStyle[SCALE_Y] = v;
          transform[4] *= y;
          transform[5] *= y;
          transform[6] *= y;
          matrixCache[4] *= y;
          matrixCache[5] *= y;
          matrixCache[6] *= y;
        }
        if(lv & SZ) {
          if(!__computedStyle[SCALE_Z]) {
            return this.__calMatrix(lv, __currentStyle, __computedStyle, __cacheStyle, false);
          }
          let v = __currentStyle[SCALE_Z].v;
          let z = v / __computedStyle[SCALE_Z];
          __computedStyle[SCALE_Z] = v;
          transform[8] *= z;
          transform[9] *= z;
          transform[10] *= z;
          matrixCache[8] *= z;
          matrixCache[9] *= z;
          matrixCache[10] *= z;
        }
        let t = __computedStyle[TRANSFORM_ORIGIN], ox = t[0], oy = t[1];
        ox += __x1;
        oy += __y1;
        matrixCache[12] = transform[12] + ox - transform[0] * ox - transform[4] * oy;
        matrixCache[13] = transform[13] + oy - transform[1] * ox - transform[5] * oy;
        matrixCache[14] = transform[14] - transform[2] * ox - transform[6] * oy;
      }
    }
    // 先根据cache计算需要重新计算的computedStyle
    else {
      if(__cacheStyle[TRANSFORM_ORIGIN] === undefined) {
        __cacheStyle[TRANSFORM_ORIGIN] = true;
        matrixCache = null;
        __computedStyle[TRANSFORM_ORIGIN] = __currentStyle[TRANSFORM_ORIGIN].map((item, i) => {
          return this.__calSize(item, i ? __offsetHeight : __offsetWidth, true);
        });
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
        this.__selfPerspective = 0;
        this.__selfPerspectiveMatrix = null;
        let matrix, ct = __currentStyle[TRANSFORM];
        // transform相对于自身
        if(ct && ct.length) {
          let first = ct[0];
          // 特殊处理，抽取出来transform的ppt，视为tfo原点的透视
          if(first.k === PERSPECTIVE) {
            let ppt = this.__selfPerspective = this.__calSize(first.v, this.__clientWidth, true);
            let tfo = __computedStyle[TRANSFORM_ORIGIN];
            this.__selfPerspectiveMatrix = tf.calPerspectiveMatrix(ppt, tfo[0] + __x1, tfo[1] + __y1);
            matrix = tf.calMatrix(ct.slice(1), __offsetWidth, __offsetHeight, this.__root);
          }
          else {
            matrix = tf.calMatrix(ct, __offsetWidth, __offsetHeight, this.__root);
          }
        }
        // 没有transform则看是否有扩展的css独立变换属性
        else {
          __computedStyle[TRANSLATE_X] = 0;
          let v = __currentStyle[TRANSLATE_X];
          if(v) {
            v = __computedStyle[TRANSLATE_X] = this.__calSize(v, this.__offsetWidth, true);
            if(v) {
              matrix = matrix || mx.identity();
              matrix[12] = v;
            }
          }
          __computedStyle[TRANSLATE_Y] = 0;
          v = __currentStyle[TRANSLATE_Y];
          if(v) {
            v = __computedStyle[TRANSLATE_Y] = this.__calSize(v, this.__offsetHeight, true);
            if(v) {
              matrix = matrix || mx.identity();
              matrix[13] = v;
            }
          }
          __computedStyle[TRANSLATE_Z] = 0;
          v = __currentStyle[TRANSLATE_Z];
          if(v) {
            v = __computedStyle[TRANSLATE_Z] = this.__calSize(v, this.__offsetWidth, true);
            if(v) {
              matrix = matrix || mx.identity();
              matrix[14] = v;
            }
          }
          __computedStyle[ROTATE_X] = 0;
          v = __currentStyle[ROTATE_X];
          if(v) {
            v = __computedStyle[ROTATE_X] = v.v;
            if(v) {
              matrix = matrix || mx.identity();
              if(matrix) {
                matrix = multiplyRotateX(matrix, d2r(v));
              }
              else {
                matrix = calRotateX(mx.identity(), v);
              }
            }
          }
          __computedStyle[ROTATE_Y] = 0;
          v = __currentStyle[ROTATE_Y];
          if(v) {
            v = __computedStyle[ROTATE_Y] = v.v;
            if(v) {
              if(matrix) {
                matrix = multiplyRotateY(matrix, d2r(v));
              }
              else {
                matrix = calRotateY(mx.identity(), v);
              }
            }
          }
          __computedStyle[ROTATE_Z] = 0;
          v = __currentStyle[ROTATE_Z];
          if(v) {
            v = __computedStyle[ROTATE_Z] = v.v;
            if(v) {
              if(matrix) {
                matrix = multiplyRotateZ(matrix, d2r(v));
              }
              else {
                matrix = calRotateZ(mx.identity(), v);
              }
            }
          }
          __computedStyle[ROTATE_3D] = [0, 0, 0, 0];
          v = __currentStyle[ROTATE_3D];
          if(v) {
            v = __computedStyle[ROTATE_3D] = [v[0], v[1], v[2], v[3].v];
            if((v[0] || v[1] || v[2]) && v[3]) {
              if(matrix) {
                matrix = multiply(matrix, calRotate3d(mx.identity(), v));
              }
              else {
                matrix = calRotate3d(mx.identity(), v);
              }
            }
          }
          __computedStyle[SKEW_X] = 0;
          v = __currentStyle[SKEW_X];
          if(v) {
            v = __computedStyle[SKEW_X] = v.v;
            if(v) {
              if(matrix) {
                matrix = multiplySkewX(matrix, d2r(v));
              }
              else {
                matrix = mx.identity();
                matrix[4] = Math.tan(d2r(v));
              }
            }
          }
          __computedStyle[SKEW_Y] = 0;
          v = __currentStyle[SKEW_Y];
          if(v) {
            v = __computedStyle[SKEW_Y] = v.v;
            if(v) {
              if(matrix) {
                matrix = multiplySkewY(matrix, d2r(v));
              }
              else {
                matrix = mx.identity();
                matrix[1] = Math.tan(d2r(v));
              }
            }
          }
          __computedStyle[SCALE_X] = 1;
          v = __currentStyle[SCALE_X];
          if(v) {
            v = __computedStyle[SCALE_X] = v.v;
            if(v !== 1) {
              if(matrix) {
                matrix = multiplyScaleX(matrix, v);
              }
              else {
                matrix = mx.identity();
                matrix[0] = v;
              }
            }
          }
          __computedStyle[SCALE_Y] = 1;
          v = __currentStyle[SCALE_Y];
          if(v) {
            v = __computedStyle[SCALE_Y] = v.v;
            if(v !== 1) {
              if(matrix) {
                matrix = multiplyScaleY(matrix, v);
              }
              else {
                matrix = mx.identity();
                matrix[5] = v;
              }
            }
          }
          __computedStyle[SCALE_Z] = 1;
          v = __currentStyle[SCALE_Z];
          if(v) {
            v = __computedStyle[SCALE_Z] = v.v;
            if(v !== 1) {
              if(matrix) {
                matrix = multiplyScaleZ(matrix, v);
              }
              else {
                matrix = mx.identity();
                matrix[10] = v;
              }
            }
          }
        }
        __computedStyle[TRANSFORM] = matrix || mx.identity();
      }
      if(!matrixCache) {
        let m = __computedStyle[TRANSFORM];
        let tfo = __computedStyle[TRANSFORM_ORIGIN];
        matrixCache = __cacheStyle[MATRIX] = tf.calMatrixByOrigin(m, tfo[0] + __x1, tfo[1] + __y1);
      }
    }
    return this.__matrix = matrixCache;
  }

  /**
   * 将currentStyle计算为computedStyle，同时存入cacheStyle可缓存的结果防止无变更重复计算，返回背景渲染范围
   */
  __calStyle(lv, __currentStyle, __computedStyle, __cacheStyle) {
    let {
      __x1,
      __x2,
      __x3,
      __x4,
      __x5,
      __x6,
      __y1,
      __y2,
      __y3,
      __y4,
      __y5,
      __y6,
    } = this;
    this.__bbox = null;
    let bx1 = __x1, by1 = __y1, bx2 = __x6, by2 = __y6;
    let backgroundClip = __computedStyle[BACKGROUND_CLIP] = __currentStyle[BACKGROUND_CLIP];
    // 默认border-box
    if(backgroundClip === 'paddingBox') {
      bx1 = __x2;
      by1 = __y2;
      bx2 = __x5;
      by2 = __y5;
    }
    else if(backgroundClip === 'contentBox') {
      bx1 = __x3;
      by1 = __y3;
      bx2 = __x4;
      by2 = __y4;
    }
    let isInline = this.__isInline;
    if(isInline && !this.__contentBoxList.length) {
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
      TRANSFORM_STYLE,
      BACKFACE_VISIBILITY,
    ].forEach(k => {
      __computedStyle[k] = __currentStyle[k];
    });
    if(isNil(__cacheStyle[FILTER])) {
      this.__calFilter(__currentStyle, __computedStyle, __cacheStyle);
    }
    // 特殊的判断，MATRIX不存在于样式key中，所有的transform共用一个
    if(isNil(__cacheStyle[MATRIX]) || (lv & TRANSFORM_ALL)) {
      this.__calMatrix(lv, __currentStyle, __computedStyle, __cacheStyle, false);
    }
    if(isNil(__cacheStyle[BACKGROUND_POSITION_X])) {
      __cacheStyle[BACKGROUND_POSITION_X] = true;
      let {
        [BACKGROUND_POSITION_X]: bgX,
      } = __currentStyle;
      __computedStyle[BACKGROUND_POSITION_X] = (bgX || []).map(item => {
        if(item.u === PERCENT) {
          return item.v + '%';
        }
        return this.__calSize(item, bx2 - bx1, true);
      });
    }
    if(isNil(__cacheStyle[BACKGROUND_POSITION_Y])) {
      __cacheStyle[BACKGROUND_POSITION_Y] = true;
      let {
        [BACKGROUND_POSITION_Y]: bgY,
      } = __currentStyle;
      __computedStyle[BACKGROUND_POSITION_Y] = (bgY || []).map(item => {
        if(item.u === PERCENT) {
          return item.v + '%';
        }
        return this.__calSize(item, by2 - by1, true);
      });
    }
    if(isNil(__cacheStyle[BACKGROUND_SIZE])) {
      __cacheStyle[BACKGROUND_SIZE] = true;
      __computedStyle[BACKGROUND_SIZE] = (__currentStyle[BACKGROUND_SIZE] || []).map(item => {
        if(Array.isArray(item)) {
          // 每项是x/y2个
          return item.map((item2, i) => {
            if(item2.u === AUTO) {
              return -1;
            }
            else if(item2.u === STRING) {
              return item2.v === 'contain' ? -2 : -3;
            }
            return this.__calSize(item2, i ? (by2 - by1) : (bx2 - bx1), true);
          });
        }
      });
    }
    if(isNil(__cacheStyle[BACKGROUND_IMAGE])) {
      let bgI = __currentStyle[BACKGROUND_IMAGE];
      __computedStyle[BACKGROUND_IMAGE] = bgI.map(item => {
        if(item) {
          return item.v;
        }
        return null;
      });
      __cacheStyle[BACKGROUND_IMAGE] = bgI.map((bgi, i) => {
        if(!bgi) {
          return null;
        }
        // 防止隐藏不加载背景图
        if(bgi.u === STRING) {
          let loadBgi = this.__loadBgi[i] = this.__loadBgi[i] || {};
          let cache = inject.IMG[bgi.v];
          if(cache && cache.state === inject.LOADED) {
            loadBgi.url = bgi.v;
            loadBgi.source = cache.source;
            loadBgi.width = cache.width;
            loadBgi.height = cache.height;
          }
          else if(loadBgi.url !== bgi.v) {
            // 可能改变导致多次加载，每次清空，成功后还要比对url是否相同
            loadBgi.url = bgi.v;
            loadBgi.source = null;
            let node = this;
            let root = this.__root;
            let ctx = this.ctx;
            inject.measureImg(bgi.v, data => {
              // 还需判断url，防止重复加载时老的替换新的，失败不绘制bgi
              if(data.success && data.url === loadBgi.url && !this.isDestroyed) {
                loadBgi.source = data.source;
                loadBgi.width = data.width;
                loadBgi.height = data.height;
                __cacheStyle[BACKGROUND_IMAGE] = undefined;
                root.__addUpdate(node, null, REPAINT, null, null, null, null);
              }
            });
          }
          return true;
        }
        else if(!isInline && bgi.v && bgi.u === GRADIENT) {
          // gradient在渲染时才生成
          return true;
        }
      });
    }
    if(isNil(__cacheStyle[BOX_SHADOW])) {
      __cacheStyle[BOX_SHADOW] = true;
      __computedStyle[BOX_SHADOW] = (__currentStyle[BOX_SHADOW] || []).map(item => {
        return item.map((item2, i) => {
          if(i > 3) {
            return item2;
          }
          return this.__calSize(item2, i === 0 ? (bx2 - bx1) : (by2 - by1), true);
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
        __cacheStyle[k] = int2rgba(__computedStyle[k] = __currentStyle[k].v);
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
        border.calBorderRadiusInline(this.__contentBoxList, __currentStyle, __computedStyle, this.__root);
      }
      // 普通block整体计算
      else {
        border.calBorderRadius(this.__offsetWidth, this.__offsetHeight, __currentStyle, __computedStyle, this.__root);
      }
    }
    // width/style/radius影响border，color不影响渲染缓存
    let btlr = __computedStyle[BORDER_TOP_LEFT_RADIUS];
    let btrr = __computedStyle[BORDER_TOP_RIGHT_RADIUS];
    let bbrr = __computedStyle[BORDER_BOTTOM_RIGHT_RADIUS];
    let bblr = __computedStyle[BORDER_BOTTOM_LEFT_RADIUS];
    let borderTopWidth = __computedStyle[BORDER_TOP_WIDTH];
    let borderRightWidth = __computedStyle[BORDER_RIGHT_WIDTH];
    let borderBottomWidth = __computedStyle[BORDER_BOTTOM_WIDTH];
    let borderLeftWidth = __computedStyle[BORDER_LEFT_WIDTH];
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
              __cacheStyle[k2] = border.calPoints(borderTopWidth, __computedStyle[ks], deg1, deg2,
                __x1, __x2, __x5, __x6, __y1, __y2, __y5, __y6, 0, btlr, btrr);
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
              __cacheStyle[k2] = border.calPoints(borderRightWidth, __computedStyle[ks], deg1, deg2,
                __x1, __x2, __x5, __x6, __y1, __y2, __y5, __y6, 1, btrr, bbrr);
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
              __cacheStyle[k2] = border.calPoints(borderBottomWidth, __computedStyle[ks], deg1, deg2,
                __x1, __x2, __x5, __x6, __y1, __y2, __y5, __y6, 2, bblr, bbrr);
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
              __cacheStyle[k2] = border.calPoints(borderLeftWidth, __computedStyle[ks], deg1, deg2,
                __x1, __x2, __x5, __x6, __y1, __y2, __y5, __y6, 3, btlr, bblr);
            }
          }
          else {
            __cacheStyle[k2] = [];
          }
        }
      }
    });
    // 强制计算继承性的
    let parent = this.__domParent;
    let parentComputedStyle = parent && parent.__computedStyle;
    if(__currentStyle[FONT_STYLE].u === INHERIT) {
      __computedStyle[FONT_STYLE] = parent ? parentComputedStyle[FONT_STYLE] : 'normal';
    }
    else if(isNil(__cacheStyle[FONT_STYLE])) {
      __computedStyle[FONT_STYLE] = __currentStyle[FONT_STYLE].v;
    }
    __cacheStyle[FONT_STYLE] = __computedStyle[FONT_STYLE];
    let color = __currentStyle[COLOR];
    if(color.u === INHERIT) {
      let v = __computedStyle[COLOR] = parent ? parentComputedStyle[COLOR] : rgba2int(reset.INHERIT.color);
      if(v.k) {
        __cacheStyle[COLOR] = v;
      }
      else {
        __cacheStyle[COLOR] = int2rgba(__computedStyle[COLOR]);
      }
    }
    else if(isNil(__cacheStyle[COLOR])) {
      if(color.u === GRADIENT) {
        __cacheStyle[COLOR] = __computedStyle[COLOR] = color.v;
      }
      else {
        __cacheStyle[COLOR] = int2rgba(__computedStyle[COLOR] = rgba2int(color.v));
      }
    }
    let textStrokeColor = __currentStyle[TEXT_STROKE_COLOR];
    if(textStrokeColor.u === INHERIT) {
      let v = __computedStyle[TEXT_STROKE_COLOR] = parent ? parentComputedStyle[TEXT_STROKE_COLOR] : rgba2int(reset.INHERIT.textStrokeColor);
      if(v.k) {
        __cacheStyle[TEXT_STROKE_COLOR] = v;
      }
      else {
        __cacheStyle[TEXT_STROKE_COLOR] = int2rgba(__computedStyle[TEXT_STROKE_COLOR]);
      }
    }
    else if(isNil(__cacheStyle[TEXT_STROKE_COLOR])) {
      if(textStrokeColor.u === GRADIENT) {
        __cacheStyle[TEXT_STROKE_COLOR] = __computedStyle[TEXT_STROKE_COLOR] = textStrokeColor.v;
      }
      else if(textStrokeColor.u === RGBA) {
        __cacheStyle[TEXT_STROKE_COLOR] = int2rgba(__computedStyle[TEXT_STROKE_COLOR] = rgba2int(textStrokeColor.v));
      }
    }
    if(__currentStyle[TEXT_STROKE_WIDTH].u === INHERIT) {
      __computedStyle[TEXT_STROKE_WIDTH] = parent ? parentComputedStyle[TEXT_STROKE_WIDTH] : reset.INHERIT.textStrokeWidth;
      __cacheStyle[TEXT_STROKE_WIDTH] = true;
    }
    else if(isNil(__cacheStyle[TEXT_STROKE_WIDTH])) {
      let v = __currentStyle[TEXT_STROKE_WIDTH];
      if(v.u === REM) {
        v = v.v * this.__root.__computedStyle[FONT_SIZE];
      }
      else if(v.u === VW) {
        v = v.v * this.__root.width * 0.01;
      }
      else if(v.u === VH) {
        v = v.v * this.__root.height * 0.01;
      }
      else if(v.u === VMAX) {
        v = v.v * Math.max(this.__root.width, this.__root.height) * 0.01;
      }
      else if(v.u === VMIN) {
        v = v.v * Math.min(this.__root.width, this.__root.height) * 0.01;
      }
      else {
        v = v.v;
      }
      __computedStyle[TEXT_STROKE_WIDTH] = v;
      __cacheStyle[TEXT_STROKE_WIDTH] = true;
    }
    if(__currentStyle[TEXT_STROKE_OVER].u === INHERIT) {
      __cacheStyle[TEXT_STROKE_OVER] = __computedStyle[TEXT_STROKE_OVER] = parent ? parentComputedStyle[TEXT_STROKE_OVER] : reset.INHERIT.textStrokeOver;
    }
    else {
      __cacheStyle[TEXT_STROKE_OVER] = __computedStyle[TEXT_STROKE_OVER] = __currentStyle[TEXT_STROKE_OVER].v;
    }
    if(__currentStyle[VISIBILITY].u === INHERIT) {
      __computedStyle[VISIBILITY] = parent ? parentComputedStyle[VISIBILITY] : 'visible';
    }
    else if(isNil(__cacheStyle[VISIBILITY])) {
      __computedStyle[VISIBILITY] = __currentStyle[VISIBILITY].v;
    }
    __cacheStyle[VISIBILITY] = __computedStyle[VISIBILITY];
    if(__currentStyle[POINTER_EVENTS].u === INHERIT) {
      __computedStyle[POINTER_EVENTS] = parent ? parentComputedStyle[POINTER_EVENTS] : 'auto';
    }
    else if(isNil(__cacheStyle[POINTER_EVENTS])) {
      __computedStyle[POINTER_EVENTS] = __currentStyle[POINTER_EVENTS].v;
    }
    __cacheStyle[POINTER_EVENTS] = __computedStyle[POINTER_EVENTS];
    // transformStyle需要特殊判断，在一些情况下强制flat，取消规范的opacity<1限制
    if(__computedStyle[TRANSFORM_STYLE] === 'preserve3d') {
      if(__computedStyle[OVERFLOW] === 'hidden'
        || __computedStyle[FILTER].length
        || this.__cacheAsBitmap) {
        __computedStyle[TRANSFORM_STYLE] = 'flat';
      }
    }
    // 影响父级flat的
    if((__computedStyle[MIX_BLEND_MODE] !== 'normal' || this.__mask) && parentComputedStyle) {
      parentComputedStyle[TRANSFORM_STYLE] = 'flat';
    }
    this.__bx1 = bx1;
    this.__bx2 = bx2;
    this.__by1 = by1;
    this.__by2 = by2;
    return [bx1, by1, bx2, by2];
  }

  __calPerspective(__currentStyle, __computedStyle, __cacheStyle) {
    this.__perspectiveMatrix = null;
    let rebuild;
    let { __x1, __y1 } = this;
    if(isNil(__cacheStyle[PERSPECTIVE])) {
      __cacheStyle[PERSPECTIVE] = true;
      rebuild = true;
      let v = __currentStyle[PERSPECTIVE];
      __computedStyle[PERSPECTIVE] = this.__calSize(v, this.__clientWidth, true);
    }
    if(isNil(__cacheStyle[PERSPECTIVE_ORIGIN])) {
      __cacheStyle[PERSPECTIVE_ORIGIN] = true;
      rebuild = true;
      __computedStyle[PERSPECTIVE_ORIGIN] = __currentStyle[PERSPECTIVE_ORIGIN].map((item, i) => {
        return this.__calSize(item, i ? this.__offsetHeight : this.__offsetWidth, true);
      });
    }
    let ppt = __computedStyle[PERSPECTIVE];
    // perspective为0无效
    if(rebuild && ppt) {
      let po = __computedStyle[PERSPECTIVE_ORIGIN];
      this.__perspectiveMatrix = tf.calPerspectiveMatrix(ppt, po[0] + __x1, po[1] + __y1);
    }
    return this.__perspectiveMatrix;
  }

  __calFilter(__currentStyle, __computedStyle, __cacheStyle) {
    __cacheStyle[FILTER] = true;
    this.__filterBbox = null;
    return __computedStyle[FILTER] = (__currentStyle[FILTER] || []).map(item => {
      let { k, v } = item;
      if(k === 'dropShadow') {
        let v2 = v.map((item2, i) => {
          if(i > 3) {
            return item2;
          }
          return this.__calSize(item2, i === 0 ? (this.__bx2 - this.__bx1) : (this.__by2 - this.__by1), true);
        });
        return { k, v: v2 };
      }
      else {
        // 部分%单位的滤镜强制使用数字
        if(v.u === DEG || v.u === NUMBER || v.u === PERCENT) {
          v = v.v;
        }
        else {
          v = this.__calSize(v, this.root.width, true);
        }
        return { k, v };
      }
    });
  }

  __calOffscreen(ctx, __computedStyle) {
    let offscreenBlend, offscreenMask, offscreenFilter, offscreenOverflow, root = this.__root;
    let { width, height } = root;
    let origin = ctx;
    let {
      [MIX_BLEND_MODE]: mixBlendMode,
      [FILTER]: filter,
      [OVERFLOW]: overflow,
      [DISPLAY]: display,
    } = __computedStyle;
    if(mixBlendMode !== 'normal' && isValidMbm(mixBlendMode)) {
      mixBlendMode = mbmName(mixBlendMode);
      let c = inject.getOffscreenCanvas(width, height, null, 'blend');
      offscreenBlend = {
        ctx,
        target: c,
        mixBlendMode,
      };
      ctx = c.ctx;
    }
    if(this.__hasMask) {
      let c = inject.getOffscreenCanvas(width, height, null, 'mask1');
      offscreenMask = {
        ctx,
        target: c,
      };
      ctx = c.ctx;
    }
    if(filter && filter.length) {
      let c = inject.getOffscreenCanvas(width, height, null, 'filter');
      offscreenFilter = {
        ctx,
        filter,
        target: c,
      };
      ctx = c.ctx;
    }
    if(overflow === 'hidden' && display !== 'inline') {
      let c = inject.getOffscreenCanvas(width, height, null, 'overflow');
      let bx1 = this.__bx1;
      let bx2 = this.__bx2;
      let by1 = this.__by1;
      let by2 = this.__by2;
      let {
        [BORDER_TOP_LEFT_RADIUS]: borderTopLeftRadius,
        [BORDER_TOP_RIGHT_RADIUS]: borderTopRightRadius,
        [BORDER_BOTTOM_RIGHT_RADIUS]: borderBottomRightRadius,
        [BORDER_BOTTOM_LEFT_RADIUS]: borderBottomLeftRadius,
        [BACKGROUND_CLIP]: backgroundClip,
        [BORDER_LEFT_WIDTH]: borderLeftWidth,
        [BORDER_RIGHT_WIDTH]: borderRightWidth,
        [BORDER_TOP_WIDTH]: borderTopWidth,
        [BORDER_BOTTOM_WIDTH]: borderBottomWidth,
        [PADDING_TOP]: paddingTop,
        [PADDING_RIGHT]: paddingRight,
        [PADDING_BOTTOM]: paddingBottom,
        [PADDING_LEFT]: paddingLeft,
      } = __computedStyle;
      let btlr = borderTopLeftRadius.slice(0);
      let btrr = borderTopRightRadius.slice(0);
      let bbrr = borderBottomRightRadius.slice(0);
      let bblr = borderBottomLeftRadius.slice(0);
      if(backgroundClip === 'paddingBox') {
        btlr[0] -= borderLeftWidth;
        btlr[1] -= borderTopWidth;
        btrr[0] -= borderRightWidth;
        btrr[1] -= borderTopWidth;
        bbrr[0] -= borderRightWidth;
        bbrr[1] -= borderBottomWidth;
        bblr[0] -= borderLeftWidth;
        bblr[1] -= borderBottomWidth;
      }
      else if(backgroundClip === 'contentBox') {
        btlr[0] -= borderLeftWidth + paddingLeft;
        btlr[1] -= borderTopWidth + paddingTop;
        btrr[0] -= borderRightWidth + paddingRight;
        btrr[1] -= borderTopWidth + paddingTop;
        bbrr[0] -= borderRightWidth + paddingRight;
        bbrr[1] -= borderBottomWidth + paddingBottom;
        bblr[0] -= borderLeftWidth + paddingLeft;
        bblr[1] -= borderBottomWidth + paddingBottom;
      }
      let borderList = border.calRadius(bx1, by1, bx2 - bx1, by2 - by1, btlr, btrr, bbrr, bblr);
      offscreenOverflow = {
        ctx,
        target: c,
        matrix: this.__matrixEvent,
        x: this.__x1,
        y: this.__y1,
        offsetWidth: this.__offsetWidth,
        offsetHeight: this.__offsetHeight,
        borderList,
      };
      ctx = c.ctx;
    }
    // 无离屏不返回
    if(origin === ctx) {
      return;
    }
    return {
      ctx,
      offscreenBlend,
      offscreenMask,
      offscreenFilter,
      offscreenOverflow,
    };
  }

  // 自定义图形可能需要覆盖判断，所以是public方法
  calContent(__currentStyle, __computedStyle) {
    let visibility = __currentStyle[VISIBILITY];
    if(visibility !== 'hidden') {
      let bgI = __currentStyle[BACKGROUND_IMAGE];
      if(Array.isArray(bgI)) {
        for(let i = 0, len = bgI.length; i < len; i++) {
          if(bgI[i]) {
            return this.__hasContent = true;
          }
        }
      }
      if(__currentStyle[BACKGROUND_COLOR].v[3] > 0) {
        let width = __computedStyle[WIDTH], height = __computedStyle[HEIGHT],
          paddingTop = __computedStyle[PADDING_TOP], paddingRight = __computedStyle[PADDING_RIGHT],
          paddingBottom = __computedStyle[PADDING_BOTTOM], paddingLeft = __computedStyle[PADDING_LEFT];
        if(width && height || paddingTop || paddingRight || paddingBottom || paddingLeft) {
          return this.__hasContent = true;
        }
      }
      for(let list = ['Top', 'Right', 'Bottom', 'Left'], i = 0, len = list.length; i < len; i++) {
        let k = list[i];
        if(__computedStyle[STYLE_KEY[style2Upper('border' + k + 'Width')]] > 0
          && __currentStyle[STYLE_KEY[style2Upper('border' + k + 'Color')]].v[3] > 0) {
          return this.__hasContent = true;
        }
      }
      let bs = __currentStyle[BOX_SHADOW];
      if(Array.isArray(bs)) {
        for(let i = 0, len = bs.length; i < len; i++) {
          let item = bs[i];
          if(item && item[4][3] > 0) {
            return this.__hasContent = true;
          }
        }
      }
    }
    return this.__hasContent = false;
  }

  /**
   * 渲染基础方法，Dom/Geom公用
   * @param renderMode
   * @see node/mode
   * @param ctx canvas/svg/webgl共用
   * @param dx cache时偏移x
   * @param dy cache时偏移y
   * @return Object
   * x1/x2/x3/x4/x5/x6/y1/y2/y3/y4/y5/y6 坐标
   * break svg判断无变化提前跳出
   */
  render(renderMode, ctx, dx = 0, dy = 0) {
    let {
      __isDestroyed: isDestroyed,
    } = this;
    let cacheStyle = this.__cacheStyle;
    let computedStyle = this.__computedStyle;
    if(isDestroyed) {
      return { isDestroyed, break: true };
    }
    let virtualDom;
    // svg设置vd上的lv属性标明<REPAINT时应用缓存，初始化肯定没有
    if(renderMode === SVG) {
      virtualDom = this.__virtualDom = {
        bb: [],
        children: [],
        visibility: 'visible',
      };
    }
    let display = computedStyle[DISPLAY];
    // canvas返回信息，svg已经初始化好了vd
    if(display === 'none') {
      return { break: true };
    }
    // 考虑mpb的6个坐标，inline比较特殊单独计算
    let x1 = this.__x1;
    let x2 = this.__x2;
    let x3 = this.__x3;
    let x4 = this.__x4;
    let x5 = this.__x5;
    let x6 = this.__x6;
    let y1 = this.__y1;
    let y2 = this.__y2;
    let y3 = this.__y3;
    let y4 = this.__y4;
    let y5 = this.__y5;
    let y6 = this.__y6;
    let bx1 = this.__bx1;
    let bx2 = this.__bx2;
    let by1 = this.__by1;
    let by2 = this.__by2;
    let res = {
      ctx, dx, dy,
      x1, x2, x3, x4, x5, x6, y1, y2, y3, y4, y5, y6,
      bx1, bx2, by1, by2,
    };
    if(renderMode === WEBGL) {
      return res;
    }
    // 使用x和y渲染位置，考虑了relative和translate影响
    let {
      __offsetWidth,
      __offsetHeight,
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
    let isRealInline = this.__isInline;
    // cache的canvas模式已经提前计算好了，其它需要现在计算
    let matrix = this.__matrix;
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
      [WRITING_MODE]: writingMode,
    } = computedStyle;
    let isUpright = writingMode.indexOf('vertical') === 0;
    if(renderMode === SVG) {
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
    if(renderMode === SVG) {
      if(mixBlendMode !== 'normal' && isValidMbm(mixBlendMode)) {
        mixBlendMode = mbmName(mixBlendMode);
        virtualDom.mixBlendMode = mixBlendMode;
      }
      else {
        delete virtualDom.mixBlendMode;
      }
      if(filter && filter.length) {
        virtualDom.filter = painter.svgFilter(filter);
      }
      else {
        delete virtualDom.filter;
      }
    }
    // 根据backgroundClip的不同值要调整bg渲染坐标尺寸，也会影响borderRadius
    let btlr = borderTopLeftRadius.slice(0);
    let btrr = borderTopRightRadius.slice(0);
    let bbrr = borderBottomRightRadius.slice(0);
    let bblr = borderBottomLeftRadius.slice(0);
    if(backgroundClip === 'paddingBox') {
      btlr[0] -= borderLeftWidth;
      btlr[1] -= borderTopWidth;
      btrr[0] -= borderRightWidth;
      btrr[1] -= borderTopWidth;
      bbrr[0] -= borderRightWidth;
      bbrr[1] -= borderBottomWidth;
      bblr[0] -= borderLeftWidth;
      bblr[1] -= borderBottomWidth;
    }
    else if(backgroundClip === 'contentBox') {
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
    let borderList;
    if(overflow === 'hidden' && display !== 'inline') {
      borderList = border.calRadius(bx1, by1, bx2 - bx1, by2 - by1, btlr, btrr, bbrr, bblr);
      if(renderMode === SVG) {
        let d = svgPolygon(borderList) || `M${x1},${y1}L${x1 + __offsetWidth},${y1}L${x1 + __offsetWidth},${y1 + __offsetHeight}L${x1},${y1 + __offsetHeight},L${x1},${y1}`;
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
        this.__cacheDefs.push(v);
        virtualDom.overflow = 'url(#' + id + ')';
      }
    }
    else if(renderMode === SVG) {
      delete virtualDom.overflow;
    }
    // 隐藏不渲染
    if((visibility === 'hidden' || res.break) && (renderMode === CANVAS || renderMode === WEBGL)) {
      res.break = true;
      return res;
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
      if(contentBoxList[length - 1] instanceof Ellipsis) {
        length--;
      }
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
          iw = inline.getInlineWidth(this, contentBoxList, isUpright);
          ih = lineHeight;
          // 垂直模式互换，计算时始终按照宽度为主轴计算的
          if(isUpright) {
            [iw, ih] = [ih, iw];
          }
          if(backgroundClip === 'paddingBox' || backgroundClip === 'padding-box') {
            if(isUpright) {
              iw += paddingTop + paddingBottom;
              ih += paddingLeft + paddingRight;
            }
            else {
              iw += paddingLeft + paddingRight;
              ih += paddingTop + paddingBottom;
            }
          }
          else if(backgroundClip !== 'contentBox' && backgroundClip !== 'content-box') {
            if(isUpright) {
              iw += paddingTop + paddingBottom + borderTopWidth + borderBottomWidth;
              ih += paddingLeft + paddingRight + borderLeftWidth + borderRightWidth;
            }
            else {
              iw += paddingLeft + paddingRight + borderLeftWidth + borderRightWidth;
              ih += paddingTop + paddingBottom + borderTopWidth + borderBottomWidth;
            }
          }
          if(renderMode === CANVAS || renderMode === WEBGL) {
            offscreen = inject.getOffscreenCanvas(iw, ih, '__$$INLINE_BGI$$__', null);
          }
          let length = backgroundImage.length;
          backgroundImage.slice(0).reverse().forEach((bgi, i) => {
            if(!bgi) {
              return;
            }
            i = length - 1 - i;
            if(util.isString(bgi)) {
              let loadBgi = this.__loadBgi[i];
              if(loadBgi.url === bgi) {
                let uuid = bg.renderImage(this, renderMode, offscreen && offscreen.ctx || ctx, loadBgi,
                  0, 0, iw, ih, btlr, btrr, bbrr, bblr,
                  computedStyle, i, backgroundSize, backgroundRepeat, true, dx, dy);
                if(renderMode === SVG && uuid) {
                  svgBgSymbol.push(uuid);
                }
              }
            }
            else if(bgi.k) {
              let gd = this.__gradient(renderMode, ctx, 0, 0, iw, ih, bgi, dx, dy);
              if(gd) {
                if(gd.k === 'conic') {
                  gradient.renderConic(this, renderMode, offscreen && offscreen.ctx || ctx, gd.v, 0, 0, iw, lineHeight,
                    btlr, btrr, bbrr, bblr, true);
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
        // 获取当前dom的baseline，再减去lineBox的baseline得出差值，这样渲染范围y就是lineBox的y+差值为起始，lineHeight为高
        // lineGap，一般为0，某些字体如arial有，渲染高度需减去它，最终是lineHeight - leading，上下均分
        let leading = fontSize * ((font.info[calFontFamily(fontFamily)] || {}).lgr || 0) * 0.5;
        let baseline = isUpright ? css.getVerticalBaseline(computedStyle) : css.getBaseline(computedStyle);
        // 注意只有1个的时候特殊情况，圆角只在首尾行出现
        let isFirst = true;
        let lastContentBox = contentBoxList[0], lastLineBox = lastContentBox.parentLineBox;
        // bgi需统计宽度累计值，将当前行所处理想单行的x范围位置计算出来，并进行bgi贴图绘制，svg还需统计第几行
        let count = 0;
        for(let i = 0; i < length; i++) {
          let contentBox = contentBoxList[i];
          if(contentBox.parentLineBox !== lastLineBox) {
            // 上一行
            let [ix1, iy1, ix2, iy2, bx1, by1, bx2, by2] = inline.getInlineBox(this, isUpright, contentBoxList,
              lastContentBox, contentBoxList[i - 1], lastLineBox, baseline, lineHeight, leading, isFirst, false,
              backgroundClip, paddingTop, paddingRight, paddingBottom, paddingLeft,
              borderTopWidth, borderRightWidth, borderBottomWidth, borderLeftWidth);
            // 要算上开头空白inline，可能有多个和递归嵌套
            if(isFirst) {
              let n = getFirstEmptyInlineWidth(this);
              ix1 -= n;
              bx1 -= n;
            }
            if(backgroundColor[3] > 0) {
              bg.renderBgc(this, renderMode, ctx, cacheStyle[BACKGROUND_COLOR], null,
                ix1, iy1, ix2 - ix1, iy2 - iy1, btlr, [0, 0], [0, 0], bblr, 'fill', false, dx, dy);
            }
            let w = ix2 - ix1, h = iy2 - iy1; // 世界参考系的宽高，根据writingMode不同取值使用
            // canvas的bg位图裁剪
            if((renderMode === CANVAS || renderMode === WEBGL) && offscreen) {
              if(isUpright) {
                ctx.drawImage(offscreen.canvas, 0, count, iw, h, ix1 + dx, iy1 + dy, iw, h);
              }
              else {
                ctx.drawImage(offscreen.canvas, count, 0, w, ih, ix1 + dx, iy1 + dy, w, ih);
              }
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
                          [
                            'd',
                            isUpright
                              ? `M${0},${count}L${ih},${count}L${ih},${h+count}L${0},${h+count},L${0},${count}`
                              : `M${count},${0}L${w+count},${0}L${w+count},${ih}L${count},${ih},L${count},${0}`
                          ],
                        ],
                      }
                    ],
                  };
                  let clip = ctx.add(v);
                  this.__cacheDefs.push(v);
                  virtualDom.bb.push({
                    type: 'item',
                    tagName: 'use',
                    props: [
                      ['xlink:href', '#' + symbol],
                      ['x', isUpright ? ix1 : (ix1 - count)],
                      ['y', isUpright ? (iy1 - count) : iy1],
                      ['clip-path', 'url(#' + clip + ')'],
                    ],
                  });
                }
              });
            }
            count += isUpright ? h : w; // 增加主轴方向的一行/列尺寸
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
              border.renderBorder(this, renderMode, ctx, list, cacheStyle[BORDER_TOP_COLOR], dx, dy);
            }
            // right在最后这里不渲染
            if(borderBottomWidth > 0 && borderBottomColor[3] > 0) {
              let deg1 = Math.atan(borderBottomWidth / borderLeftWidth);
              let deg2 = Math.atan(borderBottomWidth / borderRightWidth);
              let list = border.calPoints(borderBottomWidth, computedStyle[BORDER_BOTTOM_STYLE], deg1, deg2,
                bx1, bx1 + borderLeftWidth, bx2, bx2,
                by1, by1 + borderTopWidth, by2 - borderBottomWidth, by2, 2, isFirst ? btlr : [0, 0], [0, 0]);
              border.renderBorder(this, renderMode, ctx, list, cacheStyle[BORDER_BOTTOM_COLOR], dx, dy);
            }
            if(isFirst && borderLeftWidth > 0 && borderLeftColor[3] > 0) {
              let deg1 = Math.atan(borderLeftWidth / borderTopWidth);
              let deg2 = Math.atan(borderLeftWidth / borderBottomWidth);
              let list = border.calPoints(borderLeftWidth, computedStyle[BORDER_LEFT_STYLE], deg1, deg2,
                bx1, bx1 + borderLeftWidth, bx2 - borderRightWidth, bx2,
                by1, by1 + borderTopWidth, by2 - borderBottomWidth, by2, 3, btlr, btrr);
              border.renderBorder(this, renderMode, ctx, list, cacheStyle[BORDER_LEFT_COLOR], dx, dy);
            }
            isFirst = false;
            lastContentBox = contentBox;
            lastLineBox = contentBox.parentLineBox;
          }
          // 最后一个特殊判断
          if(i === length - 1) {
            let [ix1, iy1, ix2, iy2, bx1, by1, bx2, by2] = inline.getInlineBox(this, isUpright, contentBoxList,
              lastContentBox, contentBoxList[i], lastLineBox, baseline, lineHeight, leading, isFirst, true,
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
              bg.renderBgc(this, renderMode, ctx, cacheStyle[BACKGROUND_COLOR], null,
                ix1, iy1, ix2 - ix1, iy2 - iy1, isFirst ? btlr : [0, 0], btrr, bbrr, isFirst ? bblr : [0, 0],
                'fill', false, dx, dy);
            }
            let w = ix2 - ix1, h = iy2 - iy1;
            // canvas的bg位图裁剪
            if((renderMode === CANVAS || renderMode === WEBGL) && offscreen) {
              if(isUpright) {
                ctx.drawImage(offscreen.canvas, 0, count, iw, h, ix1 + dx, iy1 + dy, iw, h);
              }
              else {
                ctx.drawImage(offscreen.canvas, count, 0, w, ih, ix1 + dx, iy1 + dy, w, ih);
              }
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
                          [
                            'd',
                            isUpright
                              ? `M${0},${count}L${ih},${count}L${ih},${h+count}L${0},${h+count},L${0},${count}`
                              : `M${count},${0}L${w+count},${0}L${w+count},${ih}L${count},${ih},L${count},${0}`
                          ],
                        ],
                      }
                    ],
                  };
                  let clip = ctx.add(v);
                  this.__cacheDefs.push(v);
                  virtualDom.bb.push({
                    type: 'item',
                    tagName: 'use',
                    props: [
                      ['xlink:href', '#' + symbol],
                      ['x', isUpright ? ix1 : (ix1 - count)],
                      ['y', isUpright ? (iy1 - count) : iy1],
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
              border.renderBorder(this, renderMode, ctx, list, cacheStyle[BORDER_TOP_COLOR], dx, dy);
            }
            if(borderRightWidth > 0 && borderRightColor[3] > 0) {
              let deg1 = Math.atan(borderRightWidth / borderTopWidth);
              let deg2 = Math.atan(borderRightWidth / borderBottomWidth);
              let list = border.calPoints(borderRightWidth, computedStyle[BORDER_RIGHT_STYLE], deg1, deg2,
                bx1, bx1 + borderLeftWidth, bx2 - borderRightWidth, bx2,
                by1, by1 + borderTopWidth, by2 - borderBottomWidth, by2, 1, btlr, btrr);
              border.renderBorder(this, renderMode, ctx, list, cacheStyle[BORDER_RIGHT_COLOR], dx, dy);
            }
            if(borderBottomWidth > 0 && borderBottomColor[3] > 0) {
              let deg1 = Math.atan(borderBottomWidth / borderLeftWidth);
              let deg2 = Math.atan(borderBottomWidth / borderRightWidth);
              let list = border.calPoints(borderBottomWidth, computedStyle[BORDER_BOTTOM_STYLE], deg1, deg2,
                bx1, bx1, bx2 - borderRightWidth, bx2,
                by1, by1 + borderTopWidth, by2 - borderBottomWidth, by2, 2, isFirst ? btlr : [0, 0], btrr);
              border.renderBorder(this, renderMode, ctx, list, cacheStyle[BORDER_BOTTOM_COLOR], dx, dy);
            }
            if(isFirst && borderLeftWidth > 0 && borderLeftColor[3] > 0) {
              let deg1 = Math.atan(borderLeftWidth / borderTopWidth);
              let deg2 = Math.atan(borderLeftWidth / borderBottomWidth);
              let list = border.calPoints(borderLeftWidth, computedStyle[BORDER_LEFT_STYLE], deg1, deg2,
                bx1, bx1 + borderLeftWidth, bx2 - borderRightWidth, bx2,
                by1, by1 + borderTopWidth, by2 - borderBottomWidth, by2, 3, btlr, btrr);
              border.renderBorder(this, renderMode, ctx, list, cacheStyle[BORDER_LEFT_COLOR], dx, dy);
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
      bg.renderBgc(this, renderMode, ctx, cacheStyle[BACKGROUND_COLOR], borderList,
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
          if(loadBgi.url === bgi) {
            bg.renderImage(this, renderMode, ctx, loadBgi,
              bx1, by1, bx2, by2, btlr, btrr, bbrr, bblr,
              computedStyle, i, backgroundSize, backgroundRepeat, false, dx, dy);
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
      border.renderBorder(this, renderMode, ctx, cacheStyle[BORDER_TOP], cacheStyle[BORDER_TOP_COLOR], dx, dy);
    }
    if(borderRightWidth > 0 && borderRightColor[3] > 0) {
      border.renderBorder(this, renderMode, ctx, cacheStyle[BORDER_RIGHT], cacheStyle[BORDER_RIGHT_COLOR], dx, dy);
    }
    if(borderBottomWidth > 0 && borderBottomColor[3] > 0) {
      border.renderBorder(this, renderMode, ctx, cacheStyle[BORDER_BOTTOM], cacheStyle[BORDER_BOTTOM_COLOR], dx, dy);
    }
    if(borderLeftWidth > 0 && borderLeftColor[3] > 0) {
      border.renderBorder(this, renderMode, ctx, cacheStyle[BORDER_LEFT], cacheStyle[BORDER_LEFT_COLOR], dx, dy);
    }
    return res;
  }

  // 强制刷新API
  refresh(lv, cb) {
    let root = this.__root;
    if(isFunction(lv) || !lv) {
      lv = CACHE;
    }
    if(lv) {
      this.clearCache(lv < REPAINT);
    }
    if(root && !this.__isDestroyed) {
      root.__addUpdate(this, null, lv, null, null, null, cb);
    }
    else if(isFunction(cb)) {
      cb(-1);
    }
  }

  __destroy() {
    if(this.__isDestroyed) {
      return;
    }
    let ref = this.props.ref;
    if(!isNil(ref) && !isFunction(ref)) {
      delete this.__root.__ref[ref];
    }
    super.__destroy();
    this.clearAnimate();
    this.clearFrameAnimate();
    this.clearCache();
    let fontRegister = this.__fontRegister;
    for(let i in fontRegister) {
      if(fontRegister.hasOwnProperty(i)) {
        font.offRegister(i, this);
      }
    }
    this.__host = this.__hostRoot = this.__root
      = this.__prev = this.__next
      = this.__parent = this.__domParent = null;
    this.__reset0();
  }

  // 先查找到注册了事件的节点，再捕获冒泡判断增加性能
  __emitEvent(e, force) {
    let { __isDestroyed, __computedStyle: computedStyle, __mask } = this;
    if(__isDestroyed || computedStyle[DISPLAY] === 'none' || e.__stopPropagation || __mask) {
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
        let isClip = next.__clip;
        let hasEmitMask;
        while(next && next.__mask) {
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
    let { __x1, __y1, __offsetWidth, __offsetHeight, __matrixEvent, __computedStyle } = this;
    if(__computedStyle[POINTER_EVENTS] === 'none') {
      return;
    }
    let inThis = geom.pointInQuadrilateral(
      x, y,
      __x1, __y1,
      __x1 + __offsetWidth, __y1,
      __x1 + __offsetWidth, __y1 + __offsetHeight,
      __x1, __y1 + __offsetHeight,
      __matrixEvent
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
      this.__cacheDefs.push(v);
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
      this.__cacheDefs.push(v);
      return 'url(#' + uuid + ')';
    }
  }

  __getCg(renderMode, ctx, gd) {
    let { stop } = gd;
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
    return res;
  }

  // canvas清空自身cache，cacheTotal在Root的自底向上逻辑做，svg仅有cacheTotal
  clearCache(onlyTotal) {
    let __cacheTotal = this.__cacheTotal;
    let __cacheFilter = this.__cacheFilter;
    let __cacheMask = this.__cacheMask;
    let __cache = this.__cache;
    if(__cache && !onlyTotal) {
      __cache.release();
      this.__refreshLevel |= REPAINT;
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
    this.__refreshLevel |= CACHE;
    this.clearTopCache();
  }

  clearTopCache() {
    let p = this.__domParent;
    while(p) {
      let __cacheTotal = p.__cacheTotal;
      let __cacheFilter = p.__cacheFilter;
      let __cacheMask = p.__cacheMask;
      p.__refreshLevel |= CACHE;
      if(__cacheTotal) {
        __cacheTotal.release();
      }
      if(__cacheFilter) {
        __cacheFilter.release();
      }
      if(__cacheMask) {
        __cacheMask.release();
      }
      p = p.__domParent;
    }
  }

  updateStyle(style, cb) {
    let formatStyle = normalize(style);
    this.updateFormatStyle(formatStyle, cb);
  }

  // 传入格式化好key/value的样式
  updateFormatStyle(style, cb) {
    let root = this.__root, currentStyle = this.__currentStyle, currentProps = this.__currentProps;
    let keys = [];
    Object.keys(style).forEach(i => {
      let isGeom = GEOM.hasOwnProperty(i);
      if(!isGeom) {
        i = parseInt(i);
      }
      if(!equalStyle(i, isGeom ? currentProps[i] : currentStyle[i], style[i], this)) {
        if(isGeom) {
          currentProps[i] = style[i];
        }
        else {
          currentStyle[i] = style[i];
        }
        keys.push(i);
      }
    });
    if(!keys.length || this.__isDestroyed) {
      if(isFunction(cb)) {
        cb();
      }
      return;
    }
    if(root) {
      root.__addUpdate(this, keys, null, null, null, null, cb);
    }
  }

  animate(list, options = {}) {
    let animation = new Animation(this, list, options);
    if(this.__isDestroyed) {
      animation.__destroy();
      return animation;
    }
    this.__animationList.push(animation);
    if(options.autoPlay === false) {
      return animation;
    }
    return animation.play();
  }

  removeAnimate(o) {
    if(o instanceof Animation) {
      let i = this.__animationList.indexOf(o);
      if(i > -1) {
        o.cancel();
        o.__destroy();
        this.__animationList.splice(i, 1);
      }
    }
  }

  clearAnimate() {
    this.__animationList.splice(0).forEach(o => {
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

  // isLayout为false时，为relative，true则是absolute/justify/marginAuto等直接改layoutData数据的
  // lv是reflow偏移时传入，需要清除cacheStyle，并且对位图cache进行偏移设置
  // 注意所有的offset/resize都要避免display:none的，比如合并margin导致block的孩子inline因clamp为none时没有layoutData
  __offsetX(diff, isLayout, lv) {
    if(this.__computedStyle[DISPLAY] === 'none') {
      return;
    }
    super.__offsetX(diff);
    if(isLayout) {
      this.__layoutData.x += diff;
    }
    this.__x1 += diff;
    this.__x2 += diff;
    this.__x3 += diff;
    this.__x4 += diff;
    this.__x5 += diff;
    this.__x6 += diff;
    if(lv) {
      this.__refreshLevel |= lv;
      if(lv >= REFLOW) {
        this.__cacheStyle = [];
        this.__calStyle(lv, this.__currentStyle, this.__computedStyle, this.__cacheStyle);
      }
      if(this.__bbox) {
        this.__bbox[0] += diff;
        this.__bbox[2] += diff;
      }
      if(this.__filterBbox) {
        this.__filterBbox[0] += diff;
        this.__filterBbox[2] += diff;
      }
    }
  }

  __offsetY(diff, isLayout, lv) {
    if(this.__computedStyle[DISPLAY] === 'none') {
      return;
    }
    super.__offsetY(diff);
    if(isLayout) {
      this.__layoutData && (this.__layoutData.y += diff);
    }
    this.__y1 += diff;
    this.__y2 += diff;
    this.__y3 += diff;
    this.__y4 += diff;
    this.__y5 += diff;
    this.__y6 += diff;
    if(lv) {
      this.__refreshLevel |= lv;
      if(lv >= REFLOW) {
        this.__cacheStyle = [];
        this.__calStyle(lv, this.__currentStyle, this.__computedStyle, this.__cacheStyle);
      }
      if(this.__bbox) {
        this.__bbox[1] += diff;
        this.__bbox[3] += diff;
      }
      if(this.__filterBbox) {
        this.__filterBbox[1] += diff;
        this.__filterBbox[3] += diff;
      }
      if(this.__cache) {
        this.__cache.__offsetY(diff);
      }
      if(this.__cacheTotal) {
        this.__cacheTotal.__offsetY(diff);
      }
      if(this.__cacheFilter) {
        this.__cacheFilter.__offsetY(diff);
      }
      if(this.__cacheMask) {
        this.__cacheMask.__offsetY(diff);
      }
    }
  }

  __resizeX(diff, lv) {
    if(this.__computedStyle[DISPLAY] === 'none') {
      return;
    }
    this.__computedStyle.width = this.__width += diff;
    this.__clientWidth += diff;
    this.__offsetWidth += diff;
    this.__outerWidth += diff;
    this.__layoutData && (this.__layoutData.w += diff);
    this.__x4 += diff;
    this.__x5 += diff;
    this.__x6 += diff;
    if(diff < 0) {
      this.__limitCache = false;
    }
    if(lv) {
      this.__refreshLevel |= lv;
      if(lv >= REFLOW) {
        this.__cacheStyle = [];
        this.__calStyle(lv, this.__currentStyle, this.__computedStyle, this.__cacheStyle);
      }
    }
    this.clearCache();
  }

  __resizeY(diff, lv) {
    if(this.__computedStyle[DISPLAY] === 'none') {
      return;
    }
    this.__computedStyle.height = this.__height += diff;
    this.__clientHeight += diff;
    this.__offsetHeight += diff;
    this.__outerHeight += diff;
    this.__layoutData.h += diff;
    this.__y4 += diff;
    this.__y5 += diff;
    this.__y6 += diff;
    if(diff < 0) {
      this.__limitCache = false;
    }
    if(lv) {
      this.__refreshLevel |= lv;
      if(lv >= REFLOW) {
        this.__cacheStyle = [];
        this.__calStyle(lv, this.__currentStyle, this.__computedStyle, this.__cacheStyle);
      }
    }
    this.clearCache();
  }

  getComputedStyle(key) {
    let computedStyle = this.__computedStyle;
    let res = {};
    let keys = [];
    if(key) {
      let temp;
      if(Array.isArray(key)) {
        temp = key;
      }
      else {
        temp = [key];
      }
      temp.forEach(k => {
        if(abbr.hasOwnProperty(k)) {
          abbr[k].forEach(k => {
            keys.push(STYLE_KEY[style2Upper(k)]);
          });
        }
        else {
          keys.push(STYLE_KEY[style2Upper(k)]);
        }
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
    let box;
    if(includeBbox) {
      box = this.bbox;
    }
    else {
      let { __x1, __y1, __offsetWidth, __offsetHeight } = this;
      box = [__x1, __y1, __x1 + __offsetWidth, __y1 + __offsetHeight];
    }
    let matrixEvent = this.__matrixEvent;
    let p1 = point2d(mx.calPoint({ x: box[0], y: box[1] }, matrixEvent));
    let p2 = point2d(mx.calPoint({ x: box[2], y: box[1] }, matrixEvent));
    let p3 = point2d(mx.calPoint({ x: box[2], y: box[3] }, matrixEvent));
    let p4 = point2d(mx.calPoint({ x: box[0], y: box[3] }, matrixEvent));
    return {
      left: Math.min(p1.x, Math.min(p2.x, Math.min(p3.x, p4.x))),
      top: Math.min(p1.y, Math.min(p2.y, Math.min(p3.y, p4.y))),
      right: Math.max(p1.x, Math.max(p2.x, Math.max(p3.x, p4.x))),
      bottom: Math.max(p1.y, Math.max(p2.y, Math.max(p3.y, p4.y))),
      points: [p1, p2, p3, p4],
    };
  }

  // img和geom返回false，在inline布局时判断是否是真的inline
  __isRealInline() {
    return true;
  }

  remove(cb) {
    let { __root: root } = this;
    let parent = this.isShadowRoot ? this.hostRoot.__parent: this.__parent;
    let i;
    if(parent) {
      // 移除component的shadowRoot视为移除component
      let target = this.isShadowRoot ? this.hostRoot : this;
      i = parent.__children.indexOf(target);
      parent.__children.splice(i, 1);
      i = parent.__zIndexChildren.indexOf(target);
      parent.__zIndexChildren.splice(i, 1);
      let { __prev, __next } = target;
      if(__prev) {
        __prev.__next = __next;
      }
      if(__next) {
        __next.__prev = __prev;
      }
    }
    if(this.__isDestroyed) {
      if(isFunction(cb)) {
        cb();
      }
      return;
    }
    parent.__deleteStruct(this, i);
    // 不可见仅改变数据结构
    if(this.__computedStyle[DISPLAY] === 'none' || parent.__computedStyle[DISPLAY] === 'none') {
      this.__destroy();
      if(isFunction(cb)) {
        cb();
      }
      return;
    }
    // 可见在reflow逻辑做结构关系等
    root.__addUpdate(this, null, REFLOW, null, true, null, cb);
  }

  get tagName() {
    return this.__tagName;
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

  // 相对自身原点，不考虑margin的范围，>=REPAINT渲染或个别有影响的渲染改变（如blur）清空缓存
  get bbox() {
    if(!this.__bbox) {
      let {
        __x1, __y1, __offsetWidth, __offsetHeight,
        __computedStyle: {
          [BOX_SHADOW]: boxShadow,
        },
      } = this;
      this.__bbox = spreadBoxShadow([__x1, __y1, __x1 + __offsetWidth, __y1 + __offsetHeight], boxShadow);
    }
    return this.__bbox;
  }

  get filterBbox() {
    if(!this.__filterBbox) {
      let bbox = this.__bbox || this.bbox;
      let filter = this.__computedStyle[FILTER];
      this.__filterBbox = spreadFilter(bbox, filter);
    }
    return this.__filterBbox;
  }

  get listener() {
    return this.__listener;
  }

  get opacity() {
    return this.__opacity;
  }

  get matrix() {
    return this.__matrix;
  }

  get matrixEvent() {
    let __domParent = this.__domParent, matrix = this.__matrix;
    while(__domParent) {
      matrix = mx.multiply(__domParent.__perspectiveMatrix, matrix);
      matrix = mx.multiply(__domParent.__matrix, matrix);
      __domParent = __domParent.__domParent;
    }
    return matrix;
  }

  get perspectiveMatrix() {
    return this.__perspectiveMatrix;
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

  get cacheStyle() {
    return this.__cacheStyle;
  }

  get isShadowRoot() {
    return !this.parent && this.host && this.host !== this.root;
  }

  get contentBoxList() {
    return this.__contentBoxList;
  }

  get baseline() {
    return this.__offsetHeight;
  }

  get firstBaseline() {
    return this.__offsetHeight;
  }

  get verticalBaseline() {
    return this.__offsetWidth;
  }

  get mask() {
    return this.__mask;
  }

  set mask(v) {
    v = !!v;
    if(this.__mask !== v) {
      this.__mask = v;
      let root = this.__root;
      if(root && !this.__isDestroyed) {
        let p = this.__domParent;
        if(p) {
          if(v) {
            p.__computedStyle[TRANSFORM_STYLE] = 'flat';
          }
          else {
            p.__computedStyle[TRANSFORM_STYLE] = p.__currentStyle[TRANSFORM_STYLE];
          }
        }
        root.__addUpdate(this, null, MASK, null, null, null, null);
      }
    }
  }

  get clip() {
    return this.__clip;
  }

  set clip(v) {
    v = !!v;
    if(this.__clip !== v) {
      this.__clip = v;
      let root = this.__root;
      if(root && !this.__isDestroyed) {
        let p = this.__domParent;
        if(p) {
          if(v) {
            p.__computedStyle[TRANSFORM_STYLE] = 'flat';
          }
          else {
            p.__computedStyle[TRANSFORM_STYLE] = p.__currentStyle[TRANSFORM_STYLE];
          }
        }
        root.__addUpdate(this, null, MASK, null, null, null, null);
      }
    }
  }

  get cacheAsBitmap() {
    return this.__cacheAsBitmap;
  }

  set cacheAsBitmap(v) {
    v = !!v;
    if(this.__cacheAsBitmap !== v) {
      this.__cacheAsBitmap = v;
      let root = this.__root;
      if(root && !this.__isDestroyed) {
        if(v) {
          this.__computedStyle[TRANSFORM_STYLE] = 'flat';
        }
        else {
          this.__computedStyle[TRANSFORM_STYLE] = this.__currentStyle[TRANSFORM_STYLE];
        }
        root.__addUpdate(this, null, REPAINT, null, null, null, null);
      }
    }
  }

  get parentLineBox() {
    return this.__parentLineBox;
  }

  get env() {
    let root = this.__root;
    if(root) {
      return root.__env || {
        x: 0,
        y: 0,
        width: root.__width,
        height: root.__height,
      };
    }
  }
}

export default Xom;
