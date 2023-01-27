import css from '../style/css';
import unit from '../style/unit';
import tf from '../style/transform';
import abbr from '../style/abbr';
import enums from '../util/enums';
import util from '../util/util';
import Event from '../util/Event';
import inject from '../util/inject';
import frame from './frame';
import easing from './easing';
import change from '../refresh/change';
import key from './key';
import mx from '../math/matrix';
import level from '../refresh/level';
import Controller from './Controller';
import wasm from '../wasm/index';

const {
  STYLE_KEY: {
    FILTER,
    TRANSFORM_ORIGIN,
    PERSPECTIVE_ORIGIN,
    BACKGROUND_CLIP,
    BACKGROUND_POSITION_X,
    BACKGROUND_POSITION_Y,
    BOX_SHADOW,
    TRANSLATE_X,
    TRANSLATE_Y,
    TRANSLATE_Z,
    BACKGROUND_SIZE,
    FONT_SIZE,
    FLEX_BASIS,
    FLEX_DIRECTION,
    WIDTH,
    HEIGHT,
    TOP,
    BOTTOM,
    LINE_HEIGHT,
    OPACITY,
    Z_INDEX,
    TRANSFORM,
    COLOR,
    FONT_WEIGHT,
    FONT_STYLE,
    FONT_FAMILY,
    TEXT_ALIGN,
    MATRIX,
    ROTATE_3D,
    TRANSLATE_PATH,
    TEXT_STROKE_COLOR,
    TEXT_STROKE_OVER,
    STROKE_WIDTH,
    BORDER_TOP_LEFT_RADIUS,
    BORDER_TOP_RIGHT_RADIUS,
    BORDER_BOTTOM_RIGHT_RADIUS,
    BORDER_BOTTOM_LEFT_RADIUS,
    TEXT_STROKE_WIDTH,
    BORDER_BOTTOM_WIDTH,
    BORDER_LEFT_WIDTH,
    BORDER_RIGHT_WIDTH,
    BORDER_TOP_WIDTH,
    LEFT,
    RIGHT,
    MARGIN_BOTTOM,
    MARGIN_TOP,
    MARGIN_LEFT,
    MARGIN_RIGHT,
    PADDING_TOP,
    PADDING_RIGHT,
    PADDING_LEFT,
    PADDING_BOTTOM,
    STROKE_MITERLIMIT,
    LETTER_SPACING,
    PERSPECTIVE,
    SKEW_X,
    SKEW_Y,
    SCALE_X,
    SCALE_Y,
    SCALE_Z,
    ROTATE_X,
    ROTATE_Y,
    ROTATE_Z,
    BACKGROUND_IMAGE,
    FILL,
    STROKE,
    BACKGROUND_COLOR,
    BORDER_BOTTOM_COLOR,
    BORDER_LEFT_COLOR,
    BORDER_RIGHT_COLOR,
    BORDER_TOP_COLOR,
    POSITION,
  },
} = enums;
const { AUTO, PX, PERCENT, INHERIT, RGBA, STRING, NUMBER, REM, VW, VH, VMAX, VMIN, GRADIENT, calUnit } = unit;
const { isNil, isFunction, isNumber, isObject, clone, equalArr } = util;
const { linear } = easing;
const { cloneStyle, equalStyle } = css;
const { isGeom, GEOM } = change;
const {
  getLevel,
  isRepaint,
  NONE,
  TRANSFORM: TF,
  TRANSLATE_X: TX,
  TRANSLATE_Y: TY,
  TRANSLATE_Z: TZ,
  ROTATE_Z: RZ,
  SCALE_X: SX,
  SCALE_Y: SY,
  SCALE_Z: SZ,
  SCALE,
} = level;

const {
  isColorKey,
  isExpandKey,
  isLengthKey,
  isGradientKey,
  isRadiusKey,
} = key;

const DIRECTION = {
  reverse: 1,
  alternate: 2,
  'alternate-reverse': 3,
  alternateReverse: 3,
};

const FILLS = {
  forwards: 1,
  backwards: 2,
  both: 3,
};

const EASING = {
  DEFAULT: 0,
  LINEAR: 1,
  EASE_IN: 2,
  EASE_OUT: 3,
  EASE: 4,
  EASE_IN_OUT: 5,
  EASE_CUSTOM: 6,
};

const WASM_STYLE_KEY = {
  [TRANSLATE_X]: 0,
  [TRANSLATE_Y]: 1,
  [TRANSLATE_Z]: 2,
  [ROTATE_X]: 3,
  [ROTATE_Y]: 4,
  [ROTATE_Z]: 5,
  [ROTATE_3D]: 6,
  [SCALE_X]: 10,
  [SCALE_Y]: 11,
  [SCALE_Z]: 12,
  [SKEW_X]: 13,
  [SKEW_Y]: 14,
  [OPACITY]: 15,
  [TRANSFORM_ORIGIN]: 16,
};

const PLAY_STATE = {
  IDLE: 0,
  RUNNING: 1,
  PAUSED: 2,
  FINISHED: 3,
};

/**
 * 将每帧的样式格式化，提取出offset属性并转化为时间，提取出缓动曲线easing
 * 加好空数组transition/keys，后续计算两帧之间变化时存入
 * 加好空数组fixed，后续计算无帧变化时存入
 * @param style 关键帧样式
 * @param duration 动画时间长度
 * @param es options的easing曲线控制，frame没有自定义则使用全局的
 */
function framing(style, duration, es) {
  let { offset, easing } = style;
  // 这两个特殊值提出来存储不干扰style
  delete style.offset;
  delete style.easing;
  // translatePath特殊对待，ae的曲线运动动画，普通css不包含，特殊处理并添加到style最后
  let translatePath = style.translatePath;
  style = css.normalize(style);
  if(Array.isArray(translatePath) && [6, 8].indexOf(translatePath.length) > -1) {
    style[TRANSLATE_PATH] = translatePath.map(item => {
      let v = calUnit(item);
      if(v.u === NUMBER) {
        v.u = PX;
      }
      return v;
    });
  }
  return {
    style,
    time: offset * duration,
    easing: easing || es,
    timingFunction: getEasing(easing || es),
    transition: [], // 变化的属性
    trans: [], // 变化的k
    fixed: [], // 不变的k
    lastPercent: -1,
  };
}

function calByUnit(p, n, container, root) {
  if(p.u === PX) {
    if(n.u === PERCENT) {
      return n.v * 0.01 * container - p.v;
    }
    else if(n.u === REM) {
      return n.v * root.computedStyle[FONT_SIZE] - p.v;
    }
    else if(n.u === VW) {
      return n.v * root.__width * 0.01 - p.v;
    }
    else if(n.u === VH) {
      return n.v * root.__height * 0.01 - p.v;
    }
    else if(n.u === VMAX) {
      return n.v * Math.max(root.__width, root.__height) * 0.01 - p.v;
    }
    else if(n.u === VMIN) {
      return n.v * Math.min(root.__width, root.__height) * 0.01 - p.v;
    }
  }
  else if(p.u === PERCENT) {
    if(n.u === PX) {
      return n.v * 100 / container - p.v;
    }
    else if(n.u === REM) {
      return n.v * root.computedStyle[FONT_SIZE] * 100 / container - p.v;
    }
    else if(n.u === VW) {
      return n.v * root.__width / container - p.v;
    }
    else if(n.u === VH) {
      return n.v * root.__height / container - p.v;
    }
    else if(n.u === VMAX) {
      return n.v * Math.max(root.__width, root.__height) / container - p.v;
    }
    else if(n.u === VMIN) {
      return n.v * Math.min(root.__width, root.__height) / container - p.v;
    }
  }
  else if(p.u === REM) {
    if(n.u === PX) {
      return n.v / root.computedStyle[FONT_SIZE] - p.v;
    }
    else if(n.u === PERCENT) {
      return n.v * 0.01 * container / root.computedStyle[FONT_SIZE] - p.v;
    }
    else if(n.u === VW) {
      return n.v * root.__width * 0.01 / root.computedStyle[FONT_SIZE] - p.v;
    }
    else if(n.u === VH) {
      return n.v * root.__height * 0.01 / root.computedStyle[FONT_SIZE] - p.v;
    }
    else if(n.u === VMAX) {
      return n.v * Math.max(root.__width, root.__height) * 0.01 / root.computedStyle[FONT_SIZE] - p.v;
    }
    else if(n.u === VMIN) {
      return n.v * Math.min(root.__width, root.__height) * 0.01 / root.computedStyle[FONT_SIZE] - p.v;
    }
  }
  else if(p.u === VW) {
    if(n.u === PX) {
      return n.v * 100 / root.__width - p.v;
    }
    else if(n.u === REM) {
      return n.v * 100 * root.computedStyle[FONT_SIZE] / root.__width - p.v;
    }
    else if(n.u === PERCENT) {
      return n.v * container / root.__width - p.v;
    }
    else if(n.u === VH) {
      return n.v * root.__height / root.__width - p.v;
    }
    else if(n.u === VMAX) {
      return n.v * Math.max(root.__width, root.__height) / root.__width - p.v;
    }
    else if(n.u === VMIN) {
      return n.v * Math.min(root.__width, root.__height) / root.__width - p.v;
    }
  }
  else if(p.u === VH) {
    if(n.u === PX) {
      return n.v * 100 / root.__height - p.v;
    }
    else if(n.u === REM) {
      return n.v * 100 * root.computedStyle[FONT_SIZE] / root.__height - p.v;
    }
    else if(n.u === VW) {
      return n.v * root.__width / root.__height - p.v;
    }
    else if(n.u === PERCENT) {
      return n.v * container / root.__height - p.v;
    }
    else if(n.u === VMAX) {
      return n.v * Math.max(root.__width, root.__height) / root.__height - p.v;
    }
    else if(n.u === VMIN) {
      return n.v * Math.min(root.__width, root.__height) / root.__height - p.v;
    }
  }
  else if(p.u === VMAX) {
    if(n.u === PX) {
      return n.v * 100 / Math.max(root.__width, root.__height) - p.v;
    }
    else if(n.u === REM) {
      return n.v * 100 * root.computedStyle[FONT_SIZE] / Math.max(root.__width, root.__height) - p.v;
    }
    else if(n.u === PERCENT) {
      return n.v * container / Math.max(root.__width, root.__height) - p.v;
    }
    else if(n.u === VW) {
      return n.v * root.__width / Math.max(root.__width, root.__height) - p.v;
    }
    else if(n.u === VH) {
      return n.v * root.__height / Math.max(root.__width, root.__height) - p.v;
    }
    else if(n.u === VMIN) {
      return n.v * Math.min(root.__width, root.__height) / Math.max(root.__width, root.__height) - p.v;
    }
  }
  else if(p.u === VMIN) {
    if(n.u === PX) {
      return n.v * 100 / Math.min(root.__width, root.__height) - p.v;
    }
    else if(n.u === REM) {
      return n.v * 100 * root.computedStyle[FONT_SIZE] / Math.min(root.__width, root.__height) - p.v;
    }
    else if(n.u === PERCENT) {
      return n.v * container / Math.min(root.__width, root.__height) - p.v;
    }
    else if(n.u === VW) {
      return n.v * root.__width / Math.min(root.__width, root.__height) - p.v;
    }
    else if(n.u === VH) {
      return n.v * root.__height / Math.min(root.__width, root.__height) - p.v;
    }
    else if(n.u === VMAX) {
      return n.v * Math.max(root.__width, root.__height) / Math.min(root.__width, root.__height) - p.v;
    }
  }
  return 0;
}

/**
 * 计算两帧之间的差，单位不同的以后面为准，返回的v表示差值
 * 没有变化返回空
 * auto等无法比较的不参与计算
 * @param prev 上一帧样式
 * @param next 下一帧样式
 * @param k 比较的样式名
 * @param target dom对象
 */
function calDiff(prev, next, k, target) {
  let p = prev.style[k];
  let n = next.style[k];
  // 提前设置好引用，无需每帧计算时取引用，由于单位一定相同，可以简化直接引用到值v上无需单位u，有些直接量没有单位
  let cl = prev.clone[k];
  // translatePath可能不存在
  if(cl && cl.hasOwnProperty('v')) {
    cl = cl.v;
  }
  let res = { k, st: p, cl };
  if(k === TRANSFORM) {
    // transform不存在时需给默认矩阵，他只有1个matrix3d的值做动画
    if(!p && !n || !p.length && !n.length) {
      return;
    }
    let pm, nm;
    if(p && p[0]) {
      pm = p[0].v;
    }
    else {
      pm = mx.identity();
    }
    if(n && n[0]) {
      nm = n[0].v;
    }
    else {
      nm = mx.identity();
    }
    // transform特殊被初始化转成matrix矩阵，直接计算差值
    if(equalArr(pm, nm)) {
      return;
    }
    res.v = [
      nm[0] - pm[0],
      nm[1] - pm[1],
      nm[2] - pm[2],
      nm[3] - pm[3],
      nm[4] - pm[4],
      nm[5] - pm[5],
      nm[6] - pm[6],
      nm[7] - pm[7],
      nm[8] - pm[8],
      nm[9] - pm[9],
      nm[10] - pm[10],
      nm[11] - pm[11],
      nm[12] - pm[12],
      nm[13] - pm[13],
      nm[14] - pm[14],
      nm[15] - pm[15],
    ];
  }
  else if(k === ROTATE_3D) {
    if(p[0] === n[0] && p[1] === n[1] && p[2] === n[2]
      && p[3].v === n[3].v && p[3].u === n[3].u) {
      return;
    }
    res.v = [n[0] - p[0], n[1] - p[1], n[2] - p[2], n[3].v - p[3].v];
  }
  else if(k === FILTER) {
    // filter很特殊，里面有多个滤镜，按顺序计算，为空视为默认值，如blur默认0，brightness默认1
    let len = Math.max(p ? p.length : 0, n ? n.length : 0);
    let v = [], has;
    for(let i = 0; i < len; i++) {
      let pv = p ? p[i] : null, nv = n ? n[i] : null;
      // 空或key不等都无变化
      if(isNil(pv) || isNil(nv) || pv.k !== nv.k) {
        v.push(null);
      }
      else {
        has = true;
        let k = pv.k, pvv = pv.v, nvv = nv.v;
        if(k === 'blur') {
          if(pvv.u === nvv.u) {
            v.push(nvv.v - pvv.v);
          }
          else {
            let v2 = calByUnit(pvv, nvv, 0, target.__root);
            v.push(v2);
          }
        }
        else if(k === 'hueRotate' || k === 'saturate' || k === 'brightness' || k === 'contrast'
          || k === 'sepia' || k === 'invert' || k === 'grayscale') {
          v.push(nvv.v - pvv.v);
        }
        else if(k === 'dropShadow') {
          let v2 = [];
          for(let i = 0; i < 4; i++) {
            let a = pvv[i], b = nvv[i];
            if(a.u === b.u) {
              v2.push(b.v - a.v);
            }
            else {
              v2.push(calByUnit(a, b, i === 1 ? target.__clientHeight: target.__clientWidth, target.__root));
            }
          }
          v2.push([
            nvv[4][0] - pvv[4][0],
            nvv[4][1] - pvv[4][1],
            nvv[4][2] - pvv[4][2],
            nvv[4][3] - pvv[4][3],
          ])
          v.push(v2);
        }
      }
    }
    if(!has) {
      return;
    }
    res.v = v;
  }
  else if(k === TRANSFORM_ORIGIN || k === PERSPECTIVE_ORIGIN || isRadiusKey(k)) {
    // x/y都相等无需
    if(n[0].v === p[0].v && n[0].u === p[0].u
      && n[1].v === p[1].v && n[1].u === p[1].u) {
      return;
    }
    res.v = [];
    for(let i = 0; i < 2; i++) {
      let pi = p[i];
      let ni = n[i];
      if(pi.u === ni.u) {
        res.v.push(ni.v - pi.v);
      }
      else {
        let v = calByUnit(pi, ni, target[i ? '__outerHeight' : '__outerWidth'], target.__root);
        res.v.push(v);
      }
    }
  }
  else if(k === BACKGROUND_POSITION_X || k === BACKGROUND_POSITION_Y) {
    res.v = [];
    let length = Math.min(p.length, n.length);
    for(let i = 0; i < length; i++) {
      let pi = p[i], ni = n[i];
      if(pi.u === ni.u) {
        let v = ni.v - pi.v;
        res.v.push(v);
      }
      else {
        let k2;
        if(['padding-box', 'paddingBox'].indexOf(target.computedStyle[BACKGROUND_CLIP]) > -1) {
          k2 = k === BACKGROUND_POSITION_X ? '__clientWidth' : '__clientHeight';
        }
        else if(['content-box', 'contentBox'].indexOf(target.computedStyle[BACKGROUND_CLIP]) > -1) {
          k2 = k === BACKGROUND_POSITION_X ? '__width' : '__height';
        }
        else {
          k2 = k === BACKGROUND_POSITION_X ? '__offsetWidth' : '__offsetHeight';
        }
        let v = calByUnit(pi, ni, target[k2], target.__root);
        res.v.push(v);
      }
    }
  }
  else if(k === BOX_SHADOW) {
    res.v = [];
    for(let i = 0, len = Math.min(p.length, n.length); i < len; i++) {
      let a = p[i];
      let b = n[i];
      // 不能为空，outset/inset必须相等
      if(!a || !b || a[5] !== b[5]) {
        res.v.push(null);
        continue;
      }
      let v = [];
      // x/y/blur/spread
      for(let j = 0; j < 4; j++) {
        if(a[j].u === b[j].u) {
          v.push(b[j].v - a[j].v);
        }
        else {
          let v2 = calByUnit(a[j], b[j], i === 1 ? target.__offsetHeight : target.__offsetWidth, target.__root);
          v.push(v2);
        }
      }
      // rgba
      let c = [];
      for(let j = 0; j < 4; j++) {
        c.push(b[4][j] - a[4][j]);
      }
      v.push(c);
      res.v.push(v);
    }
  }
  else if(k === BACKGROUND_SIZE) {
    res.v = [];
    let length = Math.min(p.length, n.length);
    let has;
    for(let i = 0; i < length; i++) {
      let pi = p[i], ni = n[i];
      if(!pi || !ni) {
        res.v.push(null);
        continue;
      }
      let temp = [];
      for(let j = 0; j < 2; j++) {
        let pp = pi[j], nn = ni[j];
        if(pp.u === nn.u) {
          temp.push(nn.v - pp.v);
        }
        else {
          let k2;
          if(['padding-box', 'paddingBox'].indexOf(target.computedStyle[BACKGROUND_CLIP]) > -1) {
            k2 = i ? '__clientWidth' : '__clientHeight';
          }
          else if(['content-box', 'contentBox'].indexOf(target.computedStyle[BACKGROUND_CLIP]) > -1) {
            k2 = i ? '__width' : '__height';
          }
          else {
            k2 = i ? '__offsetWidth' : '__offsetHeight';
          }
          let v = calByUnit(pp, nn, target[k2], target.__root);
          temp.push(v);
        }
      }
      if(equalArr(temp, [0, 0])) {
        res.v.push(null);
      }
      else {
        res.v.push(temp);
        has = true;
      }
    }
    if(!has) {
      return;
    }
  }
  else if(k === OPACITY || k === Z_INDEX) {
    if(n === p) {
      return;
    }
    res.v = n - p;
  }
  else if(k === STROKE_WIDTH) {
    res.v = [];
    let length = Math.min(p.length, n.length);
    for(let i = 0; i < length; i++) {
      let pi = p[i], ni = n[i];
      if(pi.u === ni.u) {
        let v = ni.v - pi.v;
        res.v.push(v);
      }
      let v = calByUnit(pi, ni, target.__offsetWidth, target.__root);
      res.v.push(v);
    }
  }
  // 特殊的path，不存在style中但在动画某帧中，不会统一化所以可能反向计算frameR时后一帧没有
  else if(k === TRANSLATE_PATH && p) {
    let k1 = '__offsetWidth', k2 = '__offsetHeight';
    let computedStyle = target && target.__computedStyle;
    if(computedStyle) {
      if(['padding-box', 'paddingBox'].indexOf(computedStyle[BACKGROUND_CLIP]) > -1) {
        k1 = '__clientWidth';
        k2 = '__clientHeight';
      }
      else if(['content-box', 'contentBox'].indexOf(computedStyle[BACKGROUND_CLIP]) > -1) {
        k1 = '__width';
        k2 = '__height';
      }
    }
    res.v = p.map((item, i) => {
      let { v, u } = item;
      if(u === PERCENT) {
        if(i % 2 === 0) {
          return { v: (parseFloat(v) || 0) * 0.01 * target[k1], u: PX };
        }
        else {
          return { v: (parseFloat(v) || 0) * 0.01 * target[k2], u: PX };
        }
      }
      else if(u === REM) {
        return { v: (parseFloat(v) || 0) * target.__root.computedStyle[FONT_SIZE] * 100, u: PX };
      }
      else if(u === VW) {
        return { v: (parseFloat(v) || 0) * 0.01 * target.__root.__width, u: PX };
      }
      else if(u === VH) {
        return { v: (parseFloat(v) || 0) * 0.01 * target.__root.__height, u: PX };
      }
      else if(u === VMAX) {
        return { v: (parseFloat(v) || 0) * 0.01 * Math.max(target.__root.__width, target.__root.__height), u: PX };
      }
      else if(u === VMIN) {
        return { v: (parseFloat(v) || 0) * 0.01 * Math.min(target.__root.__width, target.__root.__height), u: PX };
      }
      else {
        return { v: parseFloat(v) || 0, u: PX };
      }
    });
  }
  else if(isExpandKey(k)) {
    if(p.u === n.u) {
      let v = n.v - p.v;
      if(v === 0) {
        return;
      }
      res.v = v;
    }
    else {
      let v = calByUnit(p, n, target[k === TRANSLATE_X || k === TRANSLATE_Z ? '__outerWidth' : '__outerHeight'], target.__root);
      if(!v) {
        return;
      }
      res.v = v;
    }
  }
  else if(isLengthKey(k)) {
    // auto不做动画
    if(p.u === AUTO || n.u === AUTO) {
      return;
    }
    let computedStyle = target.__computedStyle;
    let parentComputedStyle = (target.__domParent || target).__computedStyle;
    let diff = 0;
    if(p.u === n.u) {
      diff = n.v - p.v;
    }
    // lineHeight奇怪的单位变化，%相对于fontSize
    else if(k === LINE_HEIGHT) {
      diff = calByUnit(p, n, computedStyle[FONT_SIZE], target.__root);
    }
    // fontSize的%相对于parent的
    else if(k === FONT_SIZE) {
      diff = calByUnit(p, n, parentComputedStyle[FONT_SIZE], target.__root);
    }
    // 相对于父height的特殊属性
    else if(k === FLEX_BASIS
      && ['column', 'column-reverse', 'columnReverse'].indexOf(computedStyle[FLEX_DIRECTION]) > -1
      || [HEIGHT, TOP, BOTTOM].indexOf(k) > -1) {
      if(p.u !== AUTO && n.u !== AUTO) {
        diff = calByUnit(p, n, parentComputedStyle[HEIGHT], target.__root);
      }
    }
    // 其余都是相对于父width的
    else {
      if(p.u !== AUTO && n.u !== AUTO) {
        diff = calByUnit(p, n, parentComputedStyle[WIDTH], target.__root);
      }
    }
    // 兜底NaN非法
    if(diff === 0 || isNaN(diff)) {
      return;
    }
    res.v = diff;
  }
  else if(isGradientKey(k)) {
    // backgroundImage发生了渐变色和图片的变化，fill发生渐变色和纯色的变化等
    res.v = [];
    let length = Math.min(p.length, n.length);
    for(let i = 0; i < length; i++) {
      let pi = p[i], ni = n[i];
      if(!pi || !ni || pi.u !== ni.u || pi.u === STRING) {
        res.v.push(null);
        continue;
      }
      let u = pi.u;
      pi = pi.v;
      ni = ni.v;
      let temp;
      // 渐变
      if(u === GRADIENT) {
        let r = calDiffGradient(pi, ni, target);
        if(!r) {
          res.v.push(null);
          continue;
        }
        temp = r;
      }
      // 纯色
      else {
        if(equalArr(ni, pi)) {
          res.v.push(null);
          continue;
        }
        temp = [
          ni[0] - pi[0],
          ni[1] - pi[1],
          ni[2] - pi[2],
          ni[3] - pi[3]
        ];
      }
      res.v.push(temp);
    }
  }
  else if(isColorKey(k)) {
    if(n.u !== p.u) {
      return;
    }
    // 特殊增加支持有gradient的先判断，仅color和textStrokeColor支持
    n = n.v;
    p = p.v;
    if(n.u === GRADIENT) {
      let r = calDiffGradient(p, n, target);
      if(!r) {
        return;
      }
      res.v = r;
    }
    else {
      if(equalArr(n, p)) {
        return;
      }
      res.v = [
        n[0] - p[0],
        n[1] - p[1],
        n[2] - p[2],
        n[3] - p[3]
      ];
    }
  }
  else if(GEOM.hasOwnProperty(k)) {
    let tagName = target.tagName;
    if(isNil(p)) {
      return;
    }
    else if(GEOM[k][tagName] && isFunction(GEOM[k][tagName].calDiff)) {
      let fn = GEOM[k][tagName].calDiff;
      if(target.isMulti) {
        let arr = [];
        for(let i = 0, len = Math.min(p.length, n.length); i < len; i++) {
          arr.push(fn(p[i], n[i]));
        }
        return arr;
      }
      else {
        res.v = fn(p, n);
      }
    }
    // 特殊处理multi
    else if(target.isMulti) {
      if(k === 'points' || k === 'controls') {
        if(isNil(n) || !n.length || isNil(p) || !p.length || equalArr(p, n)) {
          return;
        }
        res.v = [];
        for(let i = 0, len = Math.min(p.length, n.length); i < len; i++) {
          let pv = p[i];
          let nv = n[i];
          if(isNil(pv) || !pv.length || isNil(nv) || !nv.length) {
            res.v.push(null);
          }
          else {
            let v2 = [];
            for(let j = 0, len2 = Math.min(pv.length, nv.length); j < len2; j++) {
              let pv2 = pv[j];
              let nv2 = nv[j];
              if(isNil(pv2) || isNil(nv2)) {
                v2.push(null);
              }
              else {
                let v3 = [];
                for(let k = 0, len3 = Math.max(pv2.length, nv2.length); k < len3; k++) {
                  let pv3 = pv2[k];
                  let nv3 = nv2[k];
                  // control由4点变2点
                  if(isNil(pv3) || isNil(nv3)) {
                    v3.push(0);
                  }
                  else {
                    v3.push(nv3 - pv3);
                  }
                }
                v2.push(v3);
              }
            }
            res.v.push(v2);
          }
        }
      }
      else if(k === 'controlA' || k === 'controlB') {
        if(isNil(n) || !n.length || isNil(p) || !p.length || equalArr(p, n)) {
          return;
        }
        res.v = [];
        for(let i = 0, len = Math.min(p.length, n.length); i < len; i++) {
          let pv = p[i];
          let nv = n[i];
          if(isNil(pv) || !pv.length || isNil(nv) || !nv.length) {
            res.v.push(null);
          }
          else {
            res.v.push([
              nv[0] - pv[0],
              nv[1] - pv[1],
            ]);
          }
        }
      }
      else {
        if(n === p || equalArr(n, p) || k === 'edge' || k === 'closure' || k === 'booleanOperations') {
          return;
        }
        let v = [];
        for(let i = 0, len = Math.min(p.length, n.length); i < len; i++) {
          let pv = p[i];
          let nv = n[i];
          if(isNil(pv) || isNil(nv)) {
            v.push(0);
          }
          v.push(nv - pv);
        }
        res.v = v;
      }
    }
    // 非multi特殊处理这几类数组类型数据
    else if(k === 'points' || k === 'controls') {
      if(isNil(n) || !n.length || isNil(p) || !p.length || equalArr(p, n)) {
        return;
      }
      res.v = [];
      for(let i = 0, len = Math.min(p.length, n.length); i < len; i++) {
        let pv = p[i];
        let nv = n[i];
        if(isNil(pv) || !pv.length || isNil(nv) || !nv.length) {
          res.v.push(null);
        }
        else {
          let v2 = [];
          for(let j = 0, len2 = Math.max(pv.length, nv.length); j < len2; j++) {
            let pv2 = pv[j];
            let nv2 = nv[j];
            // control由4点变2点
            if(isNil(pv2) || isNil(nv2)) {
              v2.push(0);
            }
            else {
              v2.push(nv2 - pv2);
            }
          }
          res.v.push(v2);
        }
      }
    }
    else if(k === 'controlA' || k === 'controlB') {
      if(isNil(n) || !n.length || isNil(p) || !p.length || equalArr(p, n)) {
        return;
      }
      res.v = [
        n[0] - p[0],
        n[1] - p[1],
      ];
    }
    // 其它简单数据，除了edge/closure/booleanOperations没有增量
    else {
      if(n === p || k === 'edge' || k === 'closure' || k === 'booleanOperations') {
        return;
      }
      else {
        res.v = n - p;
      }
    }
  }
  // display等不能有增量过程的
  else {
    return;
  }
  return res;
}

// 渐变的差异计算
function calDiffGradient(p, n, target) {
  if(p.k !== n.k) {
    return;
  }
  let pv = p.v;
  let nv = n.v;
  let temp = [[]];
  let eq = equalArr(pv, nv);
  // 渐变值部分是通用的
  for(let i = 0, len = Math.min(pv.length, nv.length); i < len; i++) {
    let a = pv[i];
    let b = nv[i];
    let t = [];
    t.push([
      b[0][0] - a[0][0],
      b[0][1] - a[0][1],
      b[0][2] - a[0][2],
      b[0][3] - a[0][3],
    ]);
    if(a[1] && b[1]) {
      if(a[1].u === b[1].u) {
        t.push(b[1].v - a[1].v);
      }
      else {
        let v = calByUnit(a[1], b[1], target.__clientWidth, target.__root);
        t.push(v || 0);
      }
    }
    temp[0].push(t);
  }
  if(p.k === 'linear') {
    let isArrP = Array.isArray(p.d);
    let isArrN = Array.isArray(n.d);
    if(isArrN !== isArrP) {
      return;
    }
    if(isArrP) {
      let v = [n.d[0] - p.d[0], n.d[1] - p.d[1], n.d[2] - p.d[2], n.d[3] - p.d[3]];
      if(eq && equalArr(v, [0, 0, 0, 0])) {
        return;
      }
      temp[1] = v;
    }
    else {
      let v = n.d - p.d;
      // 颜色角度都没变化
      if(eq && v === 0) {
        return;
      }
      temp[1] = v;
    }
  }
  else if(p.k === 'radial') {
    let isArrP = Array.isArray(p.z);
    let isArrN = Array.isArray(n.z);
    if(isArrN !== isArrP) {
      return;
    }
    temp[2] = [];
    // sketch中a点到b点特殊格式表达，z是数组忽略p和s
    if(isArrP) {
      // 距离中心外形全等
      if(eq && equalArr(p.z, n.z)) {
        return;
      }
      for(let i = 0; i < 5; i++) {
        let pz = p.z[i];
        // 半径比例省略为1
        if(pz === undefined) {
          pz = 1;
        }
        let nz = n.z[i];
        if(nz === undefined) {
          nz = 1;
        }
        temp[2].push(nz - pz);
      }
    }
    else {
      if(eq && p.z === n.z && p.s === n.s && equalArr(p.p, n.p)) {
        return;
      }
      for(let i = 0; i < 2; i++) {
        let pp = p.p[i];
        let np = n.p[i];
        if(pp.u === np.u) {
          temp[2].push(np.v - pp.v);
        }
        else {
          let v = calByUnit(pp, np, target[i ? '__clientWidth' : '__clientHeight'], target.__root);
          temp[2].push(v || 0);
        }
      }
    }
  }
  else if(p.k === 'conic') {
    if(eq && p.d === n.d && equalArr(p.p, n.p)) {
      return;
    }
    temp[1]= n.d - p.d;
    temp[2] = [];
    for(let i = 0; i < 2; i++) {
      let pp = p.p[i];
      let np = n.p[i];
      if(pp[1] === np[1]) {
        temp[2].push(np[0] - pp[0]);
      }
      else {
        let v = calByUnit(pp, np, target[i ? '__clientWidth' : '__clientHeight'], target.__root);
        temp[2].push(v || 0);
      }
    }
  }
  return temp;
}

/**
 * 计算两帧之间不相同的变化，存入transition，相同的忽略
 * 同时不变化的key也得存入fixed
 */
function calFrame(prev, next, keys, target) {
  let hasTp, allInFn = true;
  for(let i = 0, len = keys.length; i < len; i++) {
    let k = keys[i];
    let ts = calDiff(prev, next, k, target);
    // 可以形成过渡的才会产生结果返回
    if(ts) {
      if(k === TRANSLATE_PATH) {
        hasTp = true;
      }
      // ts.cs = currentStyle[k];
      let fn = CAL_HASH[k];
      // Geom特殊属性没有fn
      if(fn) {
        ts.fn = fn;
      }
      // else {
      //   allInFn = false;
      // }
      prev.transition.push(ts);
      prev.trans.push(k);
    }
    // 无法形成连续计算的或者不变的记录下来
    else if(k !== TRANSLATE_PATH) {
      prev.fixed.push(k);
      // allInFn = false;
    }
  }
  // translatePath需特殊处理translate，防止被覆盖
  if(hasTp) {
    let i = prev.trans.indexOf(TRANSLATE_X);
    if(i === -1) {
      prev.trans.push(TRANSLATE_X);
    }
    i = prev.trans.indexOf(TRANSLATE_Y);
    if(i === -1) {
      prev.trans.push(TRANSLATE_Y);
    }
    i = prev.fixed.indexOf(TRANSLATE_X);
    if(i > -1) {
      prev.fixed.splice(i, 1);
    }
    i = prev.fixed.indexOf(TRANSLATE_Y);
    if(i > -1) {
      prev.fixed.splice(i, 1);
    }
  }
  // prev.allInFn = allInFn;
  // 特殊优化，加速通知Root的更新
  // if(allInFn) {
  let lv = NONE;
  let computedStyle = target.__computedStyle;
  let trans = prev.trans;
  // 此帧过程中一定变化的，预先计算lv加速，一些影响继承的标识后续特殊处理
  for(let i = 0, len = trans.length; i < len; i++) {
    let k = trans[i];
    lv |= getLevel(k);
    if(k === Z_INDEX) {
      // prev.hasZ = ['relative', 'absolute'].indexOf(computedStyle[POSITION]) > -1;
      // prev.hasZ = true;
    }
    else if(k === COLOR) {
      prev.hasColor = true;
    }
    else if(k === TEXT_STROKE_COLOR) {
      prev.hasTsColor = true;
    }
    else if(k === TEXT_STROKE_WIDTH) {
      prev.hasTsWidth = true;
    }
    else if(k === TEXT_STROKE_OVER) {
      prev.hasTsOver = true;
    }
    // display和visibility固定在fixed里这里不出现
  }
  // 提前计算，不包含fixed的
  prev.lv = lv;
  prev.isRepaint = isRepaint(lv);
  // 常见的几种动画matrix计算是否可优化提前计算
  if(prev.isRepaint && (lv & (TX | TY | TZ | RZ | SCALE))) {
    if((lv & TF) || (
      (lv & SX) && !computedStyle[SCALE_X]
      || (lv & SY) && !computedStyle[SCALE_Y]
      || (lv & SZ) && !computedStyle[SCALE_Z]
      || (lv & RZ) && (computedStyle[ROTATE_X] || computedStyle[ROTATE_Y]
      || computedStyle[SKEW_X] || computedStyle[SKEW_Y])
    )) {
      // prev.optimize = false;
    }
    else {
      prev.optimize = true;
    }
  }
  // }
  return next;
}

function getEasing(ea) {
  let timingFunction;
  if(ea) {
    if((timingFunction = /^\s*steps\s*\(\s*(\d+)(?:\s*,\s*(\w+))?\s*\)/i.exec(ea))) {
      let steps = parseInt(timingFunction[1]);
      let stepsD = timingFunction[2];
      timingFunction = function(percent) {
        // steps有效定义正整数
        if(steps && steps > 0) {
          let per = 1 / steps;
          let n = stepsD === 'start' ? Math.ceil(percent / per) : Math.floor(percent / per);
          return n / steps;
        }
        return percent;
      };
    }
    else {
      timingFunction = easing.getEasing(ea);
    }
  }
  return timingFunction;
}

/**
 * calIntermediateStyle计算优化，不能类型的style动画计算方式不同，也有可以复用的，
 * 全部if分支判断太长且浪费，相同计算的用hash存储，k为样式，v为方法，一次hash获取即可
 */
const CAL_HASH = [];
CAL_HASH[TRANSFORM] = calTransform;
CAL_HASH[ROTATE_3D] = calRotate3d;
CAL_HASH[FILTER] = calFilter;
CAL_HASH[TRANSFORM_ORIGIN] = CAL_HASH[PERSPECTIVE_ORIGIN]
  = CAL_HASH[BORDER_TOP_LEFT_RADIUS] = CAL_HASH[BORDER_TOP_RIGHT_RADIUS]
  = CAL_HASH[BORDER_BOTTOM_RIGHT_RADIUS] = CAL_HASH[BORDER_BOTTOM_LEFT_RADIUS] = calOrigin;
CAL_HASH[STROKE_WIDTH] = CAL_HASH[BACKGROUND_POSITION_X] = CAL_HASH[BACKGROUND_POSITION_Y] = calPosition;
CAL_HASH[BOX_SHADOW] = calBoxShadow;
CAL_HASH[BACKGROUND_SIZE] = calBgSize;
CAL_HASH[OPACITY] = CAL_HASH[Z_INDEX] = calNumber;
CAL_HASH[TRANSLATE_PATH] = calPath;
CAL_HASH[FONT_SIZE] = CAL_HASH[TEXT_STROKE_WIDTH] = CAL_HASH[BORDER_BOTTOM_WIDTH] = CAL_HASH[BORDER_LEFT_WIDTH]
  = CAL_HASH[BORDER_RIGHT_WIDTH] = CAL_HASH[BORDER_TOP_WIDTH] = CAL_HASH[LEFT] = CAL_HASH[TOP] = CAL_HASH[RIGHT]
  = CAL_HASH[BOTTOM] = CAL_HASH[FLEX_BASIS] = CAL_HASH[WIDTH] = CAL_HASH[HEIGHT] = CAL_HASH[LINE_HEIGHT]
  = CAL_HASH[MARGIN_BOTTOM] = CAL_HASH[MARGIN_TOP] = CAL_HASH[MARGIN_LEFT] = CAL_HASH[MARGIN_RIGHT]
  = CAL_HASH[PADDING_TOP] = CAL_HASH[PADDING_RIGHT] = CAL_HASH[PADDING_LEFT] = CAL_HASH[PADDING_BOTTOM]
  = CAL_HASH[STROKE_WIDTH] = CAL_HASH[STROKE_MITERLIMIT] = CAL_HASH[LETTER_SPACING] = CAL_HASH[PERSPECTIVE]
  = CAL_HASH[TRANSLATE_X] = CAL_HASH[TRANSLATE_Y] = CAL_HASH[TRANSLATE_Z] = CAL_HASH[SKEW_X] = CAL_HASH[SKEW_Y]
  = CAL_HASH[SCALE_X] = CAL_HASH[SCALE_Y] = CAL_HASH[SCALE_Z] = CAL_HASH[ROTATE_X] = CAL_HASH[ROTATE_Y]
  = CAL_HASH[ROTATE_Z] = calLength;
CAL_HASH[BACKGROUND_IMAGE] = CAL_HASH[FILL] = CAL_HASH[STROKE] = calGradient;
CAL_HASH[BACKGROUND_COLOR] = CAL_HASH[BORDER_BOTTOM_COLOR] = CAL_HASH[BORDER_LEFT_COLOR] = CAL_HASH[BORDER_RIGHT_COLOR]
  = CAL_HASH[BORDER_TOP_COLOR] = CAL_HASH[COLOR] = CAL_HASH[TEXT_STROKE_COLOR] = calColor;

// transform特殊处理，只有1个matrix，有可能不存在，需给默认矩阵
function calTransform(k, v, percent, st, cl, frame, currentStyle) {
  if(!st || !st.length) {
    st = frame.style[k] = [{k: MATRIX, v: mx.identity()}];
  }
  if(!cl || !cl.length) {
    cl = frame.clone[k] = [{k: MATRIX, v: mx.identity()}];
  }
  for(let i = 0; i < 16; i++) {
    st[0].v[i] = cl[0].v[i] + v[i] * percent;
  }
}

function calRotate3d(k, v, percent, st, cl, frame, currentStyle) {
  st[0] = cl[0] + v[0] * percent;
  st[1] = cl[1] + v[1] * percent;
  st[2] = cl[2] + v[2] * percent;
  st[3].v = cl[3].v + v[3] * percent;
}

function calFilter(k, v, percent, st, cl, frame, currentStyle) {
  for(let i = 0, len = v.length; i < len; i++) {
    let item = v[i];
    if(item) {
      let k2 = st[i].k, v2 = st[i].v, clv = cl[i].v;
      // 只有dropShadow是多个数组，存放x/y/blur/spread/color
      if(k2 === 'dropShadow') {
        v2[0].v = clv[0].v + item[0] * percent;
        v2[1].v = clv[1].v + item[1] * percent;
        v2[2].v = clv[2].v + item[2] * percent;
        v2[3].v = clv[3].v + item[3] * percent;
        let c1 = v2[4], cv = clv[4], c2 = item[4];
        c1[0] = cv[0] + c2[0] * percent;
        c1[1] = cv[1] + c2[1] * percent;
        c1[2] = cv[2] + c2[2] * percent;
        c1[3] = cv[3] + c2[3] * percent;
      }
      // 其它都是带单位单值
      else {
        v2.v = clv.v + item * percent;
      }
    }
  }
}

function calOrigin(k, v, percent, st, cl, frame, currentStyle) {
  if(v[0] !== 0) {
    st[0].v = cl[0].v + v[0] * percent;
  }
  if(v[1] !== 0) {
    st[1].v = cl[1].v + v[1] * percent;
  }
}

function calPosition(k, v, percent, st, cl, frame, currentStyle) {
  st.forEach((item, i) => {
    if(v[i]) {
      item.v = cl[i].v + v[i] * percent;
    }
  });
}

function calBoxShadow(k, v, percent, st, cl, frame, currentStyle) {
  for(let i = 0, len = Math.min(st.length, v.length); i < len; i++) {
    if(!v[i]) {
      continue;
    }
    // x/y/blur/spread
    for(let j = 0; j < 4; j++) {
      st[i][j].v = cl[i][j].v + v[i][j] * percent;
    }
    // rgba
    for(let j = 0; j < 4; j++) {
      st[i][4][j] = cl[i][4][j] + v[i][4][j] * percent;
    }
  }
}

function calBgSize(k, v, percent, st, cl, frame, currentStyle) {
  st.forEach((item, i) => {
    let o = v[i];
    if(o) {
      item[0].v = cl[i][0].v + o[0] * percent;
      item[1].v = cl[i][1].v + o[1] * percent;
    }
  });
}

function calNumber(k, v, percent, st, cl, frame, currentStyle) {
  st = cl + v * percent;
  // 精度问题可能会超过[0,1]区间
  if(k === OPACITY) {
    if(st < 0) {
      st = 0;
    }
    else if(st > 1) {
      st = 1;
    }
  }
  currentStyle[k] = st;
}

// 特殊的曲线运动计算，转换为translateXY，出现在最后一定会覆盖原本的translate防重
function calPath(k, v, percent, st, cl, frame, currentStyle) {
  let t = 1 - percent;
  if(v.length === 8) {
    currentStyle[TRANSLATE_X] = {
      v: v[0].v * t * t * t
        + 3 * v[2].v * percent * t * t
        + 3 * v[4].v * percent * percent * t
        + v[6].v * percent * percent * percent,
      u: PX,
    };
    currentStyle[TRANSLATE_Y] = {
      v: v[1].v * t * t * t
        + 3 * v[3].v * percent * t * t
        + 3 * v[5].v * percent * percent * t
        + v[7].v * percent * percent * percent,
      u: PX,
    };
  }
  else if(v.length === 6) {
    currentStyle[TRANSLATE_X] = {
      v: v[0].v * t * t
        + 2 * v[2].v * percent * t
        + v[4].v * percent * percent,
      u: PX,
    };
    currentStyle[TRANSLATE_Y] = {
      v: v[1].v * t * t
        + 3 * v[3].v * percent * t
        + v[5].v * percent * percent,
      u: PX,
    };
  }
}

function calLength(k, v, percent, st, cl, frame, currentStyle) {
  st.v = cl + v * percent;
}

function calGradient(k, v, percent, st, cl, frame, currentStyle) {
  st.forEach((st2, i) => {
    let v2 = v[i];
    if(!v2) {
      return;
    }
    let cli = cl[i].v;
    if(st2.u === GRADIENT) {
      st2 = st2.v;
      let [c, d, p, z] = v2;
      for(let j = 0, len = Math.min(st2.v.length, c.length); j < len; j++) {
        let a = st2.v[j];
        let b = c[j];
        a[0][0] = cli.v[j][0][0] + b[0][0] * percent;
        a[0][1] = cli.v[j][0][1] + b[0][1] * percent;
        a[0][2] = cli.v[j][0][2] + b[0][2] * percent;
        a[0][3] = cli.v[j][0][3] + b[0][3] * percent;
        if(a[1] && b[1]) {
          a[1].v = cli.v[j][1].v + b[1] * percent;
        }
      }
      if(st2.k === 'linear' && st2.d !== undefined && d !== undefined) {
        if(Array.isArray(d)) {
          st2.d[0] = cli.d[0] + d[0] * percent;
          st2.d[1] = cli.d[1] + d[1] * percent;
          st2.d[2] = cli.d[2] + d[2] * percent;
          st2.d[3] = cli.d[3] + d[3] * percent;
        }
        else {
          st2.d = cli.d + d * percent;
        }
      }
      else if(st2.k === 'radial') {
        if(st2.z !== undefined && z !== undefined) {
          st2.z[0] = cli.z[0] + z[0] * percent;
          st2.z[1] = cli.z[1] + z[1] * percent;
          st2.z[2] = cli.z[2] + z[2] * percent;
          st2.z[3] = cli.z[3] + z[3] * percent;
          st2.z[4] = cli.z[4] + z[4] * percent;
        }
        else if(st2.p !== undefined && p !== undefined) {
          st2.p[0].v = cli.p[0].v + p[0] * percent;
          st2.p[1].v = cli.p[1].v + p[1] * percent;
        }
      }
      else if(st2.k === 'conic' && st2.d !== undefined && d !== undefined) {
        st2.d = cli.d + d * percent;
        st2.p[0][0] = cli.p[0] + p[0] * percent;
        st2.p[1][0] = cli.p[1] + p[1] * percent;
      }
    }
    // fill纯色
    else {
      st2 = st2.v;
      st2[0] = cli[0] + v2[0] * percent;
      st2[1] = cli[1] + v2[1] * percent;
      st2[2] = cli[2] + v2[2] * percent;
      st2[3] = cli[3] + v2[3] * percent;
    }
  });
}

// color可能超限[0,255]，但浏览器已经做了限制，无需关心
function calColor(k, v, percent, st, cl, frame, currentStyle) {
  let t = st.v;
  t[0] = cl[0] + v[0] * percent;
  t[1] = cl[1] + v[1] * percent;
  t[2] = cl[2] + v[2] * percent;
  t[3] = cl[3] + v[3] * percent;
}

/**
 * 最后一帧无法计算transition，对整体keys的style进行对比
 */
function calLastStyle(style, target, keys) {
  let currentStyle = target.__currentStyle, currentProps = target.__currentProps, res = [];
  for(let i = 0, len = keys.length; i < len; i++) {
    let k = keys[i], v = style[k];
    let isGeom = GEOM.hasOwnProperty(k);
    if(!equalStyle(k, v, isGeom ? currentProps[k] : currentStyle[k], target)) {
      if(isGeom) {
        currentProps[k] = v;
      }
      else {
        currentStyle[k] = v;
      }
      res.push(k);
    }
  }
  return res;
}

function gotoOverload(animation, options, cb) {
  if(isFunction(options)) {
    cb = options;
    options = {};
  }
  options = options || {};
  if(!isNil(options.areaStart)) {
    animation.areaStart = options.areaStart;
  }
  if(!isNil(options.areaDuration)) {
    animation.areaDuration = options.areaDuration;
  }
  return { options, cb };
}

function frameCb(self) {
  self.emit(Event.FRAME, self.__isChange);
  if(self.__firstPlay) {
    // self.__startTime = frame.__now; // 开始时间为第一帧时间
    self.__firstPlay = false;
    self.emit(Event.PLAY);
  }
  let cb = self.__playCb;
  if(cb) {
    self.__playCb = null;
    cb(self.__isChange);
    // 清理要检查，gotoAndStop()这种cb回调中直接再次调用goto的话cb会不一致不能删除
    // if(self.__playCb === cb) {
    // }
  }
  self.__isChange = false; // 重置，有可能下帧时间为0只执行after
}

function wasmFrame(wa, wList, wHash, frames, isReverse) {
  for(let i = 0, len = frames.length; i < len; i++) {
    let { style, transition, time, easing } = frames[i];
    let eType = EASING.DEFAULT, x1 = 0, y1 = 0, x2 = 1, y2 = 1;
    if(Array.isArray(easing)) {
      if(easing.length === 4) {
        eType = EASING.EASE_CUSTOM;
        x1 = parseFloat(easing[0]) || 0;
        y1 = parseFloat(easing[1]) || 0;
        x2 = parseFloat(easing[2]) || 0;
        y2 = parseFloat(easing[3]) || 0;
      }
    }
    else if(easing) {
      easing = easing.toString();
      if(/^\s*(?:cubic-bezier\s*)?\(\s*[\d.]+\s*,\s*[-\d.]+\s*,\s*[\d.]+\s*,\s*[-\d.]+\s*\)\s*$/i.test(easing)) {
        easing = easing.match(/[\d.]+/g);
        eType = EASING.EASE_CUSTOM;
        x1 = parseFloat(easing[0]) || 0;
        y1 = parseFloat(easing[1]) || 0;
        x2 = parseFloat(easing[2]) || 0;
        y2 = parseFloat(easing[3]) || 0;
      }
      else if(easing === 'easeIn' || easing === 'ease-in') {
        eType = EASING.EASE_IN;
      }
      else if(easing === 'easeOut' || easing === 'ease-out') {
        eType = EASING.EASE_OUT;
      }
      else if(easing === 'ease') {
        eType = EASING.EASE;
      }
      else if(easing === 'easeInOut' || easing === 'ease-in-out') {
        eType = EASING.EASE_IN_OUT;
      }
      else if(easing === 'linear') {
        eType = EASING.LINEAR;
      }
    }
    wa.add_frame(isReverse, time, eType, x1, y1, x2, y2);
    for(let j = 0, len = wList.length; j < len; j++) {
      let k = wList[j];
      let o = style[k];
      let n = WASM_STYLE_KEY[k];
      let diff = 0; // 最后一帧没差异数据默认0
      for(let l = 0, len = transition.length; l < len; l++) {
        let item = transition[l];
        if(item.k === k) {
          diff = item.v;
          transition.splice(l, 1);
          break;
        }
      }
      if(k === TRANSFORM_ORIGIN) {
        wa.add_item(isReverse, n, o[0].v, o[0].u, diff[0]);
        wa.add_item(isReverse, n + 1, o[1].v, o[1].u, diff[1]);
      }
      else if(k === ROTATE_3D) {}
      else {
        wa.add_item(isReverse, n, o.v, o.u, diff);
      }
    }
  }
}

let uuid = 0;

class Animation extends Event {
  constructor(target, list, options) {
    super();
    this.__id = uuid++;
    this.__wasmAnimation = null;
    list = clone(list || []);
    if(Array.isArray(list)) {
      list = list.filter(item => item && isObject(item));
    }
    // 动画过程另外一种形式，object描述k-v形式
    else if(list && isObject(list)) {
      let nl = [];
      Object.keys(list).forEach(k => {
        let v = list[k];
        if(Array.isArray(v)) {
          for(let i = 0, len = v.length; i < len; i++) {
            let o = nl[i] = nl[i] || {
              offset: i / (len - 1),
            };
            o[k] = v[i];
          }
        }
      });
      list = nl;
    }
    else {
      list = [];
    }
    if(isNumber(options)) {
      this.__options = {
        duration: options,
      };
      options = this.__options;
    }
    let op = this.__options = options || {
      duration: 0,
    };
    this.__begin = true;
    this.__playState = 'idle';
    this.__target = target;
    this.__root = target.__root;
    this.__isChange = false; // 每帧是否有变化，无变化不刷新也会触发frame事件
    this.__firstPlay = true;
    let duration = this.duration = op.duration;
    let ea = this.easing = op.easing;
    let fps = parseInt(op.fps) || 0;
    if(fps <= 0) {
      fps = 60;
    }
    this.fps = fps;
    this.delay = op.delay;
    this.endDelay = op.endDelay;
    this.playbackRate = op.playbackRate;
    this.fill = op.fill;
    this.iterations = op.iterations;
    this.direction = op.direction;
    this.areaStart = op.areaStart; // ae中的功能，播放中间一段动画，为0忽略
    this.areaDuration = op.areaDuration;
    let { frames, framesR, keys, originStyle } = this.__init(list, duration, ea, target);
    this.__frames = frames;
    this.__framesR = framesR;
    this.__fps = fps;
    this.__keys = keys;
    this.__originStyle = originStyle;
    this.__isDelay = false;
    this.__outBeginDelay = false;
    this.__playCount = 0;
    this.__currentFrames = {
      reverse: true,
      'alternate-reverse': true,
      alternateReverse: true,
    }.hasOwnProperty(this.__direction) ? framesR : frames;
    let controller = op.controller;
    if(controller instanceof Controller) {
      controller.add(this);
    }
    else if(controller) {
      this.addControl();
    }
    // 时间戳
    this.__timestamp = frame.__now;
  }

  __init(list, duration, ea, target) {
    if(list.length < 1) {
      return { frames: [], framesR: [], keys: [], originStyle: {} };
    }
    // 标准化帧
    let frames = Animation.parse(list, duration, ea, target);
    // 为方便两帧之间计算变化，强制统一所有帧的css属性相同，没有写的为节点的当前样式currentStyle
    let keys = Animation.unify(frames, target);
    Animation.inherit(frames, keys, target);
    // 反向的帧复制出来
    let framesR = clone(frames).reverse();
    // 存储原本样式以便恢复用
    let { __currentStyle, __currentProps } = target;
    let originStyle = {};
    keys.forEach(k => {
      if(isGeom(target.tagName, k)) {
        originStyle[k] = __currentProps[k];
      }
      originStyle[k] = __currentStyle[k];
    });
    originStyle = cloneStyle(originStyle, keys);
    // 再计算两帧之间的变化，存入transition/fixed属性
    Animation.calTransition(frames, keys, target);
    // 反向存储帧的倒排结果
    framesR.forEach((item, i) => {
      item.time = duration - item.time;
      item.index = i;
    });
    Animation.calTransition(framesR, keys, target);
    // wasm优化和matrix有关的，提取出来交给rust处理
    let wn = target.__wasmNode, wList = [], wHash = {};
    if(wn) {
      for(let i = 0, len = keys.length; i <len; i++) {
        let k = keys[i];
        if(k === TRANSLATE_X
          || k === TRANSLATE_Y
          || k === TRANSLATE_Z
          || k === ROTATE_X
          || k === ROTATE_Y
          || k === ROTATE_Z
          || k === SKEW_X
          || k === SKEW_Y
          || k === SCALE_X
          || k === SCALE_X
          || k === SCALE_Y
          || k === SCALE_Z
          || k === TRANSFORM_ORIGIN) {
          wList.push(k);
          wHash[k] = true;
        }
      }
      // 有相关的才交给wasm，并移除js中transition计算
      if(wList.length) {
        let iter = this.__iterations === Infinity ? 0 : this.__iterations;
        let tf = getEasing(ea), easeType = EASING.LINEAR;
        if(tf && ea !== easing.linear) {
          if(tf === easing.easeIn) {
            easeType = EASING.EASE_IN;
          }
          else if(tf === easing.easeOut) {
            easeType = EASING.EASE_OUT;
          }
          else if(tf === easing.ease) {
            easeType = EASING.EASE;
          }
          else if(tf === easing.easeInOut) {
            easeType = EASING.EASE_IN_OUT;
          }
          else {
            easeType = EASING.EASE_CUSTOM;
          }
        }
        let wa = this.__wasmAnimation = wasm.Animation.new(DIRECTION[this.__direction] || 0, this.__duration, this.__fps,
          this.__delay, this.__endDelay, FILLS[this.__fill] || 0, this.__playbackRate, iter,
          this.__areaStart, this.__areaDuration, easeType);
        if(easeType === EASING.EASE_CUSTOM) {
          let v = ea.match(/[\d.]+/g);
          if(v.length === 4) {
            wa.set_bezier(parseFloat(v[0]), parseFloat(v[1]), parseFloat(v[2]), parseFloat(v[3]));
          }
        }
        wasmFrame(wa, wList, wHash, frames, false);
        wasmFrame(wa, wList, wHash, framesR, true);
        // 全部交由wasm
        if(wList.length === keys.length) {
          this.__ignore = true;
        }
      }
    }
    return { frames, framesR, keys, originStyle };
  }

  __clean(isFinish) {
    this.__cancelTask();
    if(isFinish) {
      // gotoAndStop到一个很大的时间的话，也需要防止超过
      this.__currentTime = this.__delay + this.__duration * this.__iterations + this.__endDelay;
      this.__playState = 'finished';
    }
    else {
      this.__playCount = this.__currentTime = 0;
      this.__playState = 'idle';
    }
  }

  play(cb) {
    let isDestroyed = this.__isDestroyed;
    let duration = this.__duration;
    let playState = this.__playState;
    let frames = this.__frames;
    if(isDestroyed || duration <= 0 || frames.length < 1) {
      return this;
    }
    if(playState === 'running') {
      return this;
    }
    this.__playCb = cb;
    this.__playState = 'running';
    // 每次play调用标识第一次运行，需响应play事件和回调
    this.__firstPlay = true;
    this.__playCount = 0;
    // 防止finish/cancel事件重复触发，每次播放重置
    this.__hasFin = false;
    this.__hasCancel = false;
    // 只有第一次调用会进初始化，另外finish/cancel视为销毁也会重新初始化
    if(!this.__enterFrame) {
      this.__enterFrame = true;
      let framesR = this.__framesR;
      let direction = this.__direction;
      // 初始化根据方向确定帧序列
      this.__currentFrames = {
        reverse: true,
        'alternate-reverse': true,
        alternateReverse: true,
      }.hasOwnProperty(direction) ? framesR : frames;
      this.__currentTime = this.__fpsTime = 0;
      if(this.__stayBegin) {
        let currentFrame = this.__currentFrame = this.__currentFrames[0];
        let target = this.__target, root = this.__root;
        let keys = calLastStyle(currentFrame.style, target, this.__keys);
        let isChange = !!keys.length;
        if(this.__stopCb) {
          root.__cancelFrameDraw(this.__stopCb);
        }
        // 有变化的backwards才更新，否则无需理会，不需要回调，极端情况立刻pause()回造成一次无用刷新
        if(isChange) {
          root.__addUpdate(target, keys, false, false, false, null);
        }
      }
    }
    // 开始时间为调用play时的帧时间
    this.__startTime = frame.__now || (frame.__now = inject.now());
    this.__end = false;
    // 由root统一控制，防止重复play
    let root = this.__root;
    if(root.__ani.indexOf(this) === -1) {
      root.__onFrame(this);
    }
    let wa = this.__wasmAnimation;
    if(wa) {
      wa.play_count = 0;
      wa.play_state = PLAY_STATE.RUNNING;
      wa.first_play = true;
      wa.first_enter = true;
    }
    return this;
  }

  __before(diff) {
    this.__timestamp = frame.__now;
    // 有wasm且完全被包含情况忽略js计算
    if(this.__ignore) {
      return;
    }
    let target = this.__target;
    let fps = this.__fps;
    let currentFrames = this.__currentFrames;
    let iterations = this.__iterations;
    let stayEnd = this.__stayEnd;
    let delay = this.__delay;
    let areaStart = this.__areaStart;
    let areaDuration = this.__areaDuration;
    let root = this.__root;
    let duration = this.__duration;
    let endDelay = this.__endDelay;
    let length = currentFrames.length;
    let playbackRate = this.__playbackRate;
    let lastFrame = this.__currentFrame;
    let dur = areaDuration ? Math.min(duration, areaDuration) : duration;
    this.__isChange = false;
    // 播放时间累加，并且考虑播放速度加成
    if(playbackRate !== 1 && playbackRate > 0) {
      diff *= playbackRate;
    }
    // 用本帧和上帧时间差，计算累加运行时间currentTime，以便定位当前应该处于哪个时刻
    let currentTime = this.__currentTime += diff;
    // 增加的fps功能，当<60时计算跳帧，每帧运行依旧累加时间，达到fps时重置，第一帧强制不跳
    if(!this.__firstPlay && fps > 0 && fps !== 60) {
      diff = this.__fpsTime += diff;
      if(diff < 1000 / fps) {
        this.__inFps = true;
        return;
      }
      this.__fpsTime = 0;
    }
    // delay仅第一次生效等待
    if(currentTime < delay - areaStart) {
      this.__begin = false; // 默认是true，delay置false防触发
      // 即便不刷新，依旧执行帧回调，同时标明让后续第一帧响应begin
      this.__outBeginDelay = true;
      this.__isDelay = true;
      return;
    }
    this.__isDelay = false;
    // 减去delay，计算在哪一帧
    currentTime -= delay - areaStart;
    if(this.__outBeginDelay) {
      this.__outBeginDelay = false;
      this.__begin = true;
    }
    // 超过duration非尾轮需处理回到开头，触发新一轮动画事件，这里可能时间间隔非常大直接跳过几轮
    let playCount = Math.min(iterations - 1, Math.floor(currentTime / dur));
    currentTime -= dur * playCount;
    // 如果发生轮换，需重新确定正反向
    if(this.__playCount < playCount) {
      this.__begin = true;
      this.__playCount = playCount;
      let direction = this.__direction;
      let frames = this.__frames;
      let framesR = this.__framesR;
      // 有正反向播放需要重设帧序列
      if(direction === 'alternate' || direction === 'alternate-reverse' || direction === 'alternateReverse') {
        let isEven = playCount % 2 === 0;
        if(direction === 'alternate') {
          currentFrames = this.__currentFrames = isEven ? frames : framesR;
        }
        else {
          currentFrames = this.__currentFrames = isEven ? framesR : frames;
        }
      }
    }
    let isLastCount = playCount >= iterations - 1;
    // 只有2帧可优化，否则2分查找当前帧
    let i, frameTime;
    if(length === 2) {
      i = currentTime < dur ? 0 : 1;
      frameTime = dur;
    }
    else {
      i = Animation.binarySearch(0, length - 1, currentTime, currentFrames);
      frameTime = currentFrames[i].time;
    }
    // 最后一帧结束动画，仅最后一轮才会进入，需处理endDelay
    let isLastFrame = isLastCount && i === length - 1;
    let percent = 0;
    if(isLastFrame) {
      // 无需任何处理
    }
    // 否则根据目前到下一帧的时间差，计算百分比，再反馈到变化数值上
    else if(length === 2) {
      percent = currentTime / duration; // 不能是dur，按照原本计算
    }
    else {
      let total = currentFrames[i + 1].time - frameTime;
      percent = (currentTime - frameTime) / total;
    }
    let inEndDelay, currentFrame = currentFrames[i];
    let notSameFrame = lastFrame !== currentFrame;
    // 对比前后两帧是否为同一关键帧，不是则清除之前关键帧上的percent标识为-1，这样可以识别跳帧和本轮第一次进入此帧
    if(notSameFrame) {
      lastFrame && (lastFrame.lastPercent = -1);
      this.__currentFrame = currentFrame;
    }
    /** 这里要考虑全几种场景：
     * 1. 单次播放无endDelay且fill不停留（有/无差异，下同）
     * 2. 单次播放无endDelay且fill停留
     * 3. 单次播放有endDelay且fill不停留
     * 4. 单次播放有endDelay且fill停留
     * 5. 多次播放无endDelay且fill不停留（尾次/非尾次，下同）
     * 6. 多次播放无endDelay且fill停留
     * 7. 多次播放有endDelay且fill不停留
     * 8. 多次播放有endDelay且fill停留
     */
    let needClean;
    if(isLastFrame) {
      let keys;
      inEndDelay = currentTime < dur + endDelay;
      // 停留对比最后一帧，endDelay可能会多次进入这里，第二次进入样式相等不再重绘
      if(stayEnd) {
        keys = calLastStyle(currentFrame.style, target, this.__keys);
      }
      // 不停留或超过endDelay则计算还原，有endDelay且fill模式不停留会再次进入这里
      else {
        keys = calLastStyle(this.__originStyle, target, this.__keys);
        // currentFrame = null; // 特殊清空，genBeforeRefresh（）时不传过去 TODO
        // currentFrame = {
        //   style: this.__originStyle,
        // };
      }
      // 进入endDelay或结束阶段触发end事件，注意只触发一次，防重在触发的地方做
      this.__nextEnd = true;
      if(!inEndDelay) {
        this.__playCount++;
        this.__finished = true;
        root.__offFrame(this);
        needClean = true;
      }
      let c = this.__isChange = !!keys.length;
      if(c) {
        root.__addUpdate(target, keys, false, false, false, null);
      }
      if(needClean) {
        // let playCb = this.__playCb;
        this.__clean(true);
        // 丑陋的做法，防止gotoAndStop()这样的cb被clean()掉
        // if(playCb) {
        //   this.__playCb = playCb;
        // }
      }
    }
    else {
      let { trans, fixed } = Animation.calIntermediateStyle(currentFrame, percent, target, notSameFrame);
      if(trans.length || fixed.length) {
        root.__addAniUpdate(target, trans, fixed, currentFrame);
        this.__isChange = !!trans.length || !!fixed.length;
      }
    }
  }

  __after() {
    if(this.__inFps) {
      this.__inFps = false;
      return;
    }
    frameCb(this);
    if(this.__begin) {
      this.__begin = false;
      this.emit(Event.BEGIN, this.__playCount);
    }
    // end事件只触发一次，末轮进入endDelay或直接结束时
    if(this.__nextEnd && !this.__end) {
      this.__end = true;
      this.emit(Event.END, this.__playCount - 1);
    }
    if(this.__finished) {
      this.__begin = this.__end = this.__isDelay = this.__finished
        = this.__inFps = this.__enterFrame = false;
      this.__playState = 'finished';
      this.emit(Event.FINISH, this.__isChange);
    }
  }

  pause() {
    let isDestroyed = this.__isDestroyed;
    let duration = this.__duration;
    let { pending } = this;
    if(isDestroyed || duration <= 0 || pending) {
      return this;
    }
    this.__playState = 'paused';
    let wa = this.__wasmAnimation;
    if(wa) {
      wa.play_state = PLAY_STATE.PAUSED;
    }
    this.__cancelTask();
    this.emit(Event.PAUSE);
    return this;
  }

  resume(cb) {
    let isDestroyed = this.__isDestroyed;
    let duration = this.__duration;
    let playState = this.__playState;
    if(isDestroyed || duration <= 0 || playState !== 'paused') {
      return this;
    }
    return this.play(cb);
  }

  finish(cb) {
    let isDestroyed = this.__isDestroyed;
    let duration = this.__duration;
    let playState = this.__playState;
    let frames = this.__frames;
    if(isDestroyed || duration <= 0 || frames.length < 1) {
      return this;
    }
    if(playState === 'finished') {
      if(isFunction(cb)) {
        cb();
      }
      return this;
    }
    // 先清除所有回调任务，多次调用finish也会清除只留最后一次
    this.__clean(true);
    this.__begin = this.__end = this.__isDelay = this.__finished
      = this.__inFps = this.__enterFrame = false;
    this.__playState = 'finished';
    let wa = this.__wasmAnimation;
    if(wa) {
      wa.play_state = PLAY_STATE.FINISHED;
    }
    let root = this.__root;
    if(root) {
      let target = this.__target;
      let style;
      // 是否停留在最后一帧
      let currentFrame;
      if(this.__stayEnd) {
        let framesR = this.__framesR;
        let direction = this.__direction;
        let iterations = this.__iterations;
        if('reverse'.indexOf(direction) > -1) {
          [frames, framesR] = [framesR, frames];
        }
        if(iterations === Infinity || iterations % 2) {
          currentFrame = frames[frames.length - 1];
          style = currentFrame.style;
        }
        else {
          currentFrame = framesR[framesR.length - 1];
          style = currentFrame.style;
        }
      }
      else {
        style = this.__originStyle;
        currentFrame = {
          style,
        };
      }
      this.__currentFrame = currentFrame;
      let keys = calLastStyle(style, target, this.__keys);
      let isChange = !!keys.length;
      if(this.__stopCb) {
        root.__cancelFrameDraw(this.__stopCb);
      }
      this.__stopCb = () => {
        frameCb(this);
        this.emit(Event.FINISH, isChange);
        if(isFunction(cb)) {
          cb(isChange);
        }
      };
      if(isChange) {
        root.__addUpdate(target, keys, false, false, false, this.__stopCb);
      }
      else {
        this.__stopCb();
      }
    }
    return this;
  }

  cancel(cb) {
    let isDestroyed = this.__isDestroyed;
    let duration = this.__duration;
    let playState = this.__playState;
    let frames = this.__frames;
    if(isDestroyed || duration <= 0 || frames.length < 1) {
      return this;
    }
    if(playState === 'idle') {
      if(isFunction(cb)) {
        cb();
      }
      return this;
    }
    this.__clean();
    this.__begin = this.__end = this.__isDelay = this.__finished
      = this.__inFps = this.__enterFrame = false;
    this.__playState = 'idle';
    let wa = this.__wasmAnimation;
    if(wa) {
      wa.play_state = PLAY_STATE.IDLE;
    }
    this.__currentFrame = null;
    let root = this.__root;
    if(root) {
      let target = this.__target;
      let keys = calLastStyle(this.__originStyle, target, this.__keys);
      let isChange = !!keys.length;
      if(this.__stopCb) {
        root.__cancelFrameDraw(this.__stopCb);
      }
      this.__stopCb = () => {
        frameCb(this);
        this.emit(Event.FINISH, isChange);
        if(isFunction(cb)) {
          cb(isChange);
        }
      };
      if(isChange) {
        root.__addUpdate(target, keys, false, false, false, this.__stopCb);
      }
      else {
        this.__stopCb();
      }
    }
    return this;
  }

  gotoAndPlay(v, options, cb) {
    let t = gotoOverload(this, options, cb);
    options = t.options;
    cb = t.cb;
    let isDestroyed = this.__isDestroyed;
    let duration = this.__duration;
    let frames = this.__frames;
    let delay = this.__delay;
    let areaStart = this.__areaStart;
    let areaDuration = this.__areaDuration;
    let endDelay = this.__endDelay;
    let dur = areaDuration ? Math.min(duration, areaDuration) : duration;
    if(isDestroyed || dur <= 0 || frames.length < 1) {
      return this;
    }
    // 计算出时间点直接累加播放
    this.__goto(v, options.isFrame, options.excludeDelay);
    if(v > dur + delay - areaStart + endDelay) {
      return this.finish(cb);
    }
    return this.play(cb);
  }

  gotoAndStop(v, options, cb) {
    let t = gotoOverload(this, options, cb);
    options = t.options;
    cb = t.cb;
    let isDestroyed = this.__isDestroyed;
    let duration = this.__duration;
    let frames = this.__frames;
    let delay = this.__delay;
    let areaStart = this.__areaStart;
    let areaDuration = this.__areaDuration;
    let endDelay = this.__endDelay;
    let dur = areaDuration ? Math.min(duration, areaDuration) : duration;
    if(isDestroyed || dur <= 0 || frames.length < 1) {
      return this;
    }
    let wa = this.__wasmAnimation;
    v = this.__goto(v, options.isFrame, options.excludeDelay);
    if(v > dur + delay - areaStart + endDelay) {
      return this.finish(cb);
    }
    // 先play一帧，回调里模拟暂停
    return this.play(() => {
      this.__playState = 'paused';
      if(wa) {
        wa.play_state = PLAY_STATE.PAUSED;
      }
      this.__cancelTask();
      if(isFunction(cb)) {
        cb();
      }
    });
  }

  // 返回不包含delay且去除多轮的时间
  __goto(v, isFrame, excludeDelay) {
    let iterations = this.__iterations;
    let duration = this.__duration;
    let areaDuration = this.__areaDuration;
    let dur = areaDuration ? Math.min(duration, areaDuration) : duration;
    this.__playState = 'paused';
    let wa = this.__wasmAnimation;
    if(isNaN(v) || v < 0) {
      throw new Error('Param of gotoAnd(Play/Stop) is illegal: ' + v);
    }
    if(isFrame) {
      v = (v - 1) / this.spf;
    }
    if(excludeDelay) {
      v += this.__delay;
    }
    // 在时间范围内设置好时间，复用play直接跳到播放点
    this.__currentTime = v;
    if(wa) {
      wa.next_time = v;
    }
    v -= this.__delay;
    // 超过时间长度需要累加次数，这里可以超过iterations，因为设定也许会非常大
    let playCount = Math.min(iterations - 1, Math.floor(v / dur));
    v -= dur * playCount;
    this.__playCount = playCount;
    // 防止play()重置时间和当前帧组，提前计算好
    this.__enterFrame = true;
    let frames = this.__frames;
    let framesR = this.__framesR;
    let direction = this.__direction;
    if({
      alternate: true,
      'alternate-reverse': true,
      alternateReverse: true,
    }.hasOwnProperty(direction)) {
      let isEven = playCount % 2 === 0;
      if(direction === 'alternate') {
        this.__currentFrames = isEven ? frames : framesR;
      }
      else {
        this.__currentFrames = isEven ? framesR : frames;
      }
    }
    return v;
  }

  addControl() {
    let root = this.__root;
    if(!root) {
      return;
    }
    let ac = root.animateController;
    if(ac) {
      ac.add(this);
    }
  }

  removeControl() {
    let root = this.__root;
    if(!root) {
      return;
    }
    let ac = root.__animateController;
    if(ac) {
      ac.remove(this);
    }
  }

  __setTarget(target) {
    this.__target = target;
  }

  __cancelTask() {
    this.__root.__offFrame(this);
    // this.__playCb = null; TODO 简化
  }

  __destroy() {
    if(this.__isDestroyed) {
      return;
    }
    this.removeControl();
    this.__clean();
    this.__target = this.__root = null;
    this.__startTime = 0;
    this.__isDestroyed = true;
    let wa = this.__wasmAnimation;
    if(wa) {
      wa.free();
      this.__wasmAnimation = null;
    }
  }

  __checkModify() {
    if(this.__playState !== 'idle' && this.__playState !== 'finished') {
      inject.warn('Modification will not come into effect when animation is running');
    }
  }

  get id() {
    return this.__id;
  }

  get target() {
    return this.__target;
  }

  get root() {
    return this.__root;
  }

  get keys() {
    return this.__keys;
  }

  get options() {
    return this.__options;
  }

  get duration() {
    return this.__duration;
  }

  set duration(v) {
    v = Math.max(0, parseFloat(v) || 0);
    if(this.__duration !== v) {
      this.__duration = v;
      this.__checkModify();
    }
    return v;
  }

  get delay() {
    return this.__delay;
  }

  set delay(v) {
    v = Math.max(0, parseFloat(v) || 0);
    if(this.__delay !== v) {
      this.__delay = v;
      this.__checkModify();
    }
    return v;
  }

  get endDelay() {
    return this.__endDelay;
  }

  set endDelay(v) {
    v = Math.max(0, parseFloat(v) || 0);
    if(this.__endDelay !== v) {
      this.__endDelay = v;
      this.__checkModify();
    }
    return v;
  }

  get fps() {
    return this.__fps;
  }

  set fps(v) {
    v = parseInt(v) || 60;
    if(this.__fps !== v) {
      if(v <= 0) {
        v = 60;
      }
      this.__fps = v;
    }
    return v;
  }

  get spf() {
    return 1 / this.fps;
  }

  get iterations() {
    return this.__iterations;
  }

  set iterations(v) {
    if(v === Infinity || util.isString(v) && v.toLowerCase() === 'infinity') {
      v = Infinity;
    }
    else {
      v = parseInt(v);
      if(isNaN(v) || v < 0) {
        v = 1;
      }
    }
    if(this.__iterations !== v) {
      this.__iterations = v;
    }
    return v;
  }

  get fill() {
    return this.__fill;
  }

  set fill(v) {
    v = v || 'none';
    if(this.__fill !== v) {
      this.__fill = v;
      this.__checkModify();
    }
    this.__stayBegin = {
      backwards: true,
      both: true,
    }.hasOwnProperty(v);
    this.__stayEnd = {
      forwards: true,
      both: true,
    }.hasOwnProperty(v);
    return v;
  }

  get direction() {
    return this.__direction;
  }

  set direction(v) {
    v = v || 'normal';
    if(this.__direction !== v) {
      this.__direction = v;
      this.__checkModify();
    }
    return v;
  }

  get frames() {
    return this.__frames;
  }

  get framesR() {
    return this.__framesR;
  }

  get playbackRate() {
    return this.__playbackRate;
  }

  set playbackRate(v) {
    v = parseFloat(v) || 1;
    if(v <= 0) {
      v = 1;
    }
    if(this.__playbackRate !== v) {
      this.__playbackRate = v;
    }
    return v;
  }

  get easing() {
    return this.__easing;
  }

  set easing(v) {
    this.__easing = v;
  }

  get startTime() {
    return this.__startTime;
  }

  get currentTime() {
    return this.__currentTime;
  }

  set currentTime(v) {
    v = Math.max(0, parseFloat(v) || 0);
    if(this.__currentTime !== v) {
      this.__currentTime = v;
    }
    return v;
  }

  get timestamp() {
    return this.__timestamp;
  }

  get pending() {
    return this.__playState !== 'running';
  }

  get finished() {
    return this.__playState === 'finished';
  }

  get playState() {
    return this.__playState;
  }

  get playCount() {
    return this.__playCount;
  }

  set playCount(v) {
    v = Math.max(0, parseInt(v) || 0);
    if(this.__playCount !== v) {
      this.__playCount = v;
    }
    return v;
  }

  get areaStart() {
    return this.__areaStart;
  }

  set areaStart(v) {
    v = Math.max(0, parseInt(v) || 0);
    if(this.__areaStart !== v) {
      this.__areaStart = v;
    }
    return v;
  }

  get areaDuration() {
    return this.__areaDuration;
  }

  set areaDuration(v) {
    v = Math.max(0, parseInt(v) || 0);
    if(this.__areaDuration !== v) {
      this.__areaDuration = v;
    }
    return v;
  }

  get isDestroyed() {
    return this.__isDestroyed;
  }

  get animating() {
    let playState = this.__playState;
    if(playState === 'idle') {
      return false;
    }
    return playState !== 'finished' || this.__stayEnd || this.__stayBegin;
  }

  // get spfLimit() {
  //   return this.__spfLimit;
  // }
  //
  // set spfLimit(v) {
  //   if(util.isNumber(v) || /^\d/.test(v)) {
  //     v = Math.max(0, parseInt(v) || 0);
  //   }
  //   else {
  //     v = !!v;
  //   }
  //   if(this.__spfLimit !== v) {
  //     this.__spfLimit = v;
  //   }
  //   return v;
  // }

  static parse(list, duration, easing, target) {
    // 过滤时间非法的，过滤后续offset<=前面的
    let offset = -1;
    for(let i = 0, len = list.length; i < len; i++) {
      let current = list[i];
      if(current.hasOwnProperty('offset')) {
        current.offset = parseFloat(current.offset) || 0;
        current.offset = Math.max(0, current.offset);
        current.offset = Math.min(1, current.offset);
        // 超过区间[0,1]
        if(isNaN(current.offset) || current.offset < 0 || current.offset > 1) {
          list.splice(i, 1);
          i--;
          len--;
          continue;
        }
        // <=前面的
        else if(current.offset <= offset) {
          list.splice(i, 1);
          i--;
          len--;
          continue;
        }
      }
      // 缩写处理
      Object.keys(current).forEach(k => {
        if(abbr.hasOwnProperty(k)) {
          abbr.toFull(current, k);
        }
      });
      // 检查key合法性
      Object.keys(current).forEach(k => {
        if(k !== 'easing' && k !== 'offset' && !change.isValid(target && target.tagName, k)) {
          delete current[k];
        }
      });
    }
    // 只有1帧复制出来变成2帧方便运行
    if(list.length === 1) {
      list[0] = clone(list[0]);
      if(list[0].offset === 1) {
        list.unshift({
          offset: 0,
        });
      }
      else {
        let copy = clone(list[0]);
        copy.offset = 1;
        list.push(copy);
      }
    }
    // 强制clone防止同引用
    else {
      list.forEach((item, i) => {
        list[i] = clone(item);
      });
    }
    // 首尾时间偏移强制为[0, 1]，不是的话前后加空帧
    let first = list[0];
    if(first.hasOwnProperty('offset') && first.offset > 0) {
      first = {
        offset: 0,
      };
      list.unshift(first);
    }
    else {
      first.offset = 0;
    }
    let last = list[list.length - 1];
    if(last.hasOwnProperty('offset') && last.offset < 1) {
      last = {
        offset: 1,
      };
      list.push(last);
    }
    else {
      last.offset = 1;
    }
    // 计算没有设置offset的帧
    for(let i = 1, len = list.length; i < len; i++) {
      let start = list[i];
      // 从i=1开始offset一定>0，找到下一个有offset的，均分中间无声明的
      if(!start.hasOwnProperty('offset')) {
        let end;
        let j = i + 1;
        for(; j < len; j++) {
          end = list[j];
          if(end.hasOwnProperty('offset')) {
            break;
          }
        }
        let num = j - i + 1;
        start = list[i - 1];
        let per = (end.offset - start.offset) / num;
        for(let k = i; k < j; k++) {
          let item = list[k];
          item.offset = start.offset + per * (k + 1 - i);
        }
        i = j;
      }
    }
    let frames = [];
    for(let i = 0, len = list.length; i < len; i++) {
      let o = framing(list[i], duration, easing);
      o.index = i;
      frames[i] = o;
    }
    return frames;
  }

  static unify(frames, target) {
    let hash = {};
    let keys = [];
    // 获取所有关键帧的属性
    frames.forEach(item => {
      let style = item.style;
      Object.keys(style).forEach(k => {
        let v = style[k];
        // 未定义的过滤掉，null空有意义
        if(v !== undefined && !hash.hasOwnProperty(k)) {
          hash[k] = true;
          // geom为属性字符串，style都为枚举int
          if(!GEOM.hasOwnProperty(k)) {
            k = parseInt(k);
          }
          // path动画要转为translateXY，所以手动添加，使2帧之间存在过渡，有可能之前已存在这个动画，可忽视
          if(k === TRANSLATE_PATH) {
            if(!hash.hasOwnProperty(TRANSLATE_X)) {
              keys.push(TRANSLATE_X);
            }
            if(!hash.hasOwnProperty(TRANSLATE_Y)) {
              keys.push(TRANSLATE_Y);
            }
            hash[TRANSLATE_X] = hash[TRANSLATE_Y] = true;
          }
          keys.push(k);
        }
      });
    });
    // 添补没有声明完全的关键帧属性为节点当前值
    frames.forEach(item => {
      let style = item.style;
      keys.forEach(k => {
        if(!style.hasOwnProperty(k) || isNil(style[k])) {
          if(GEOM.hasOwnProperty(k)) {
            if(target) {
              style[k] = clone(target.getProps(k));
            }
          }
          else {
            if(k === TRANSLATE_X && style.hasOwnProperty(TRANSLATE_PATH)) {
              style[k] = clone(style[TRANSLATE_PATH][0]);
            }
            else if(k === TRANSLATE_Y && style.hasOwnProperty(TRANSLATE_PATH)) {
              style[k] = clone(style[TRANSLATE_PATH][1]);
            }
            else if(target) {
              style[k] = cloneStyle(target.__currentStyle, [k])[k];
            }
          }
        }
      });
    });
    return keys;
  }

  static inherit(frames, keys, target) {
    let computedStyle = target && target.__computedStyle;
    frames.forEach(item => {
      let style = item.style;
      keys.forEach(k => {
        let v = style[k];
        // geom的属性可能在帧中没有
        if(isNil(v)) {
          return;
        }
        if(k === TRANSFORM) {
          if(target) {
            let ow = target.__outerWidth;
            let oh = target.__outerHeight;
            let m = tf.calMatrix(v, ow, oh, target.__root);
            style[k] = [{ k: MATRIX, v: m }];
          }
        }
        else if(v.u === INHERIT && computedStyle) {
          if(k === COLOR || k === TEXT_STROKE_COLOR) {
            style[k] = { v: util.rgba2int(computedStyle[k]), u: RGBA };
          }
          else if(isLengthKey(k)) {
            style[k] = { v: computedStyle[k], u: PX };
          }
          else if(k === FONT_WEIGHT) {
            style[k] = { v: computedStyle[k], u: NUMBER };
          }
          else if(k === FONT_STYLE || k === FONT_FAMILY || k === TEXT_ALIGN || k === TEXT_STROKE_OVER) {
            style[k] = { v: computedStyle[k], u: STRING };
          }
        }
      });
    });
  }

  static calTransition(frames, keys, target) {
    let prev = frames[0];
    prev.clone = cloneStyle(prev.style, keys);
    for(let i = 1, len = frames.length; i < len; i++) {
      let next = frames[i];
      next.clone = cloneStyle(next.style, keys);
      prev = calFrame(prev, next, keys, target);
    }
  }

  static binarySearch(i, j, time, frames) {
    while(i < j) {
      if(i === j - 1) {
        if(frames[j].time <= time) {
          return j;
        }
        return i;
      }
      let middle = i + ((j - i) >> 1);
      let frame = frames[middle];
      if(frame.time === time) {
        return middle;
      }
      if(frame.time > time) {
        j = Math.max(middle - 1, i);
      }
      else {
        i = Math.min(middle, j);
      }
    }
    return i;
  }

  static calIntermediateStyle(frame, percent, target, notSameFrame) {
    let style = frame.style;
    let transition = frame.transition;
    let timingFunction = frame.timingFunction;
    // let allInFn = frame.allInFn;
    if(timingFunction && timingFunction !== linear) {
      percent = timingFunction(percent);
    }
    // 同一关键帧同一percent可以不刷新，比如diff为0时，或者steps情况，离开会清空
    if(frame.lastPercent === percent) {
      return { trans: [], fixed: [] };
    }
    frame.lastPercent = percent;
    let currentStyle = target.__currentStyle, trans = frame.trans, fixed = [];
    // 特殊性能优化，for拆开v8会提升不少
    // if(allInFn) {
    //   for(let i = 0, len = transition.length; i < len; i++) {
    //     let item = transition[i];
    //     let k = item.k, v = item.v, st = item.st, cl = item.cl, fn = item.fn;
    //     // 可能updateStyle()甚至手动修改了currentStyle，需要重新赋值
    //     if(st !== currentStyle[k]) {
    //       currentStyle[k] = st;
    //     }
    //     fn(k, v, percent, st, cl, frame, currentStyle);
    //   }
    // }
    // else {
    let currentProps = target.__currentProps, modify;
    for(let i = 0, len = transition.length; i < len; i++) {
      let item = transition[i];
      let k = item.k, v = item.v, st = item.st, cl = item.cl, fn = item.fn;
      if(fn) {
        // 可能updateStyle()甚至手动修改了currentStyle，需要重新赋值
        if(st !== currentStyle[k]) {
          currentStyle[k] = st;
        }
        fn(k, v, percent, st, cl, frame, currentStyle);
      }
      else if(GEOM.hasOwnProperty(k)) {
        let tagName = target.tagName;
        if(GEOM[k][tagName] && isFunction(GEOM[k][tagName].calIncrease)) {
          let fn = GEOM[k][tagName].calIncrease;
          if(target.isMulti) {
            st = st.map((item, i) => {
              return fn(item, v[i], percent);
            });
          }
          else {
            st = fn(st, v, percent);
          }
        }
        else if(target.isMulti) {
          if(k === 'points' || k === 'controls') {
            for(let i = 0, len = Math.min(st.length, v.length); i < len; i++) {
              let o = st[i];
              let n = v[i];
              let cli = cl[i];
              if(!isNil(o) && !isNil(n)) {
                for(let j = 0, len2 = Math.min(o.length, n.length); j < len2; j++) {
                  let o2 = o[j];
                  let n2 = n[j];
                  if(!isNil(o2) && !isNil(n2)) {
                    for(let k = 0, len3 = Math.min(o2.length, n2.length); k < len3; k++) {
                      if(!isNil(o2[k]) && !isNil(n2[k])) {
                        o2[k] = cli[j][k] + n2[k] * percent;
                      }
                    }
                  }
                }
              }
            }
          }
          else if(k === 'controlA' || k === 'controlB') {
            v.forEach((item, i) => {
              let st2 = st[i];
              if(!isNil(item[0]) && !isNil(st2[0])) {
                st2[0] = cl[i][0] + item[0] * percent;
              }
              if(!isNil(item[1]) && !isNil(st2[1])) {
                st2[1] = cl[i][1] + item[1] * percent;
              }
            });
          }
          else {
            v.forEach((item, i) => {
              if(!isNil(item) && !isNil(st[i])) {
                st[i] = cl[i] + item * percent;
              }
            });
          }
        }
        else {
          if(k === 'points' || k === 'controls') {
            for(let i = 0, len = Math.min(st.length, v.length); i < len; i++) {
              let o = st[i];
              let n = v[i];
              if(!isNil(o) && !isNil(n)) {
                for(let j = 0, len2 = Math.min(o.length, n.length); j < len2; j++) {
                  if(!isNil(o[j]) && !isNil(n[j])) {
                    o[j] = cl[i][j] + n[j] * percent;
                  }
                }
              }
            }
          }
          else if(k === 'controlA' || k === 'controlB') {
            if(!isNil(st[0]) && !isNil(v[0])) {
              st[0] = cl[0] + v[0] * percent;
            }
            if(!isNil(st[1]) && !isNil(v[1])) {
              st[1] = cl[1] + v[1] * percent;
            }
          }
          else {
            if(!isNil(st) && !isNil(v)) {
              st = cl + v * percent;
            }
          }
        }
        currentProps[k] = st;
      }
      // string等的直接量，在不同帧之间可能存在变化，同帧变化后不再改变引用
      else {
        if(currentStyle[k] !== st) {
          currentStyle[k] = st;
        }
        else {
          if(!modify) {
            modify = true;
            trans = trans.slice(0);
          }
          let j = trans.indexOf(k);
          trans.splice(j, 1);
        }
      }
    }
      // 无变化的也得检查是否和当前相等，防止跳到一个不变化的帧上，而前一帧有变化的情况，大部分都是无变化
    if(notSameFrame) {
      let f = frame.fixed;
      for(let i = 0, len = f.length; i < len; i++) {
        let k = f[i];
        let isGeom = GEOM.hasOwnProperty(k);
        if(!equalStyle(k, style[k], isGeom ? currentProps[k] : currentStyle[k], target)) {
          if(GEOM.hasOwnProperty(k)) {
            currentProps[k] = style[k];
          }
          else {
            currentStyle[k] = style[k];
          }
          fixed.push(k);
        }
      }
    }
    // }
    return { trans, fixed };
  }
}

export default Animation;
