import css from '../style/css';
import unit from '../style/unit';
import tf from '../style/transform';
import abbr from '../style/abbr';
import enums from '../util/enums';
import util from '../util/util';
import Event from '../util/Event';
import frame from './frame';
import easing from './easing';
import change from '../refresh/change';
import key from './key';

const { STYLE_KEY: {
  FILTER,
  TRANSFORM_ORIGIN,
  BACKGROUND_POSITION_X,
  BACKGROUND_POSITION_Y,
  BOX_SHADOW,
  TRANSLATE_X,
  BACKGROUND_SIZE,
  FONTSIZE,
  FLEX_BASIS,
  FLEX_DIRECTION,
  WIDTH,
  HEIGHT,
  MARGIN_RIGHT,
  MARGIN_TOP,
  MARGIN_LEFT,
  MARGIN_BOTTOM,
  PADDING_LEFT,
  PADDING_BOTTOM,
  PADDING_RIGHT,
  PADDING_TOP,
  TOP,
  RIGHT,
  BOTTOM,
  LEFT,
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
},
  UPDATE_NODE, UPDATE_STYLE, UPDATE_KEYS, UPDATE_CONFIG,
  FRAME_STYLE,
  FRAME_TIME,
  FRAME_EASING,
  FRAME_TRANSITION,
} = enums;
const { AUTO, PX, PERCENT, INHERIT, RGBA, STRING, NUMBER } = unit;
const { isNil, isFunction, isNumber, isObject, clone, equalArr } = util;
const { linear } = easing;
const { cloneStyle } = css;
const { GEOM } = change;

const {
  COLOR_HASH,
  LENGTH_HASH,
  RADIUS_HASH,
  GRADIENT_HASH,
  EXPAND_HASH,
  GRADIENT_TYPE,
} = key;

const NUM_CAL_HASH = {
  [BACKGROUND_POSITION_X]: true,
  [BACKGROUND_POSITION_Y]: true,
};
Object.assign(NUM_CAL_HASH, LENGTH_HASH);
Object.assign(NUM_CAL_HASH, EXPAND_HASH);

function unify(frames, target) {
  let hash = {};
  let keys = [];
  // 获取所有关键帧的属性
  frames.forEach(item => {
    let style = item[FRAME_STYLE];
    Object.keys(style).forEach(k => {
      let v = style[k];
      // 空的过滤掉
      if(v !== undefined && !hash.hasOwnProperty(k)) {
        hash[k] = true;
        if(!GEOM.hasOwnProperty(k)) {
          k = parseInt(k);
        }
        keys.push(k);
      }
    });
  });
  // 添补没有声明完全的关键帧属性为节点当前值
  frames.forEach(item => {
    let style = item[FRAME_STYLE];
    keys.forEach(k => {
      if(!style.hasOwnProperty(k) || isNil(style[k])) {
        if(GEOM.hasOwnProperty(k)) {
          style[k] = target.currentProps[k];
        }
        else {
          style[k] = target.currentStyle[k];
        }
      }
    });
  });
  return keys;
}

// 每次初始化时处理继承值，以及转换transform为单matrix矩阵
function inherit(frames, keys, target) {
  let computedStyle = target.computedStyle;
  frames.forEach(item => {
    let style = item[FRAME_STYLE];
    keys.forEach(k => {
      let v = style[k];
      // geom的属性可能在帧中没有
      if(isNil(v)) {
        return;
      }
      if(k === TRANSFORM) {
        let ow = target.outerWidth;
        let oh = target.outerHeight;
        let m = tf.calMatrix(v, ow, oh);
        style[k] = [[MATRIX, m]];
      }
      else if(v[1] === INHERIT) {
        if(k === COLOR) {
          style[k] = [util.rgba2int(computedStyle[k]), RGBA ];
        }
        else if(LENGTH_HASH.hasOwnProperty(k)) {
          style[k] = [computedStyle[k], PX];
        }
        else if(k === FONT_WEIGHT) {
          style[k] = [computedStyle[k], NUMBER];
        }
        else if(k === FONT_STYLE || k === FONT_FAMILY || k === TEXT_ALIGN) {
          style[k] = [computedStyle[k], STRING];
        }
      }
    });
  });
}

/**
 * 通知root更新当前动画，需要根据frame的状态来决定是否是同步插入
 * 在异步时，因为动画本身是异步，需要addRefreshTask
 * 而如果此时frame在执行before过程中，说明帧动画本身是在before计算的，需要同步插入
 * @param style
 * @param keys 样式所有的key
 * @param __config
 * @param root
 * @param node
 */
function genBeforeRefresh(style, keys, __config, root, node) {
  let res = {};
  res[UPDATE_NODE] = node;
  res[UPDATE_STYLE] = style;
  res[UPDATE_KEYS] = keys;
  res[UPDATE_CONFIG] = __config[I_NODE_CONFIG];
  root.__addUpdate(node, __config[I_NODE_CONFIG], root, __config[I_ROOT_CONFIG], res);
  __config[I_STYLE] = style;
  __config[I_ASSIGNING] = true;
  // frame每帧回调时，下方先执行计算好变更的样式，这里特殊插入一个hook，让root增加一个刷新操作
  // 多个动画调用因为相同root也只会插入一个，这样在所有动画执行完毕后frame里检查同步进行刷新，解决单异步问题
  root.__frameHook();
}

/**
 * 将每帧的样式格式化，提取出offset属性并转化为时间，提取出缓动曲线easing
 * @param style 关键帧样式
 * @param duration 动画时间长度
 * @param es options的easing曲线控制，frame没有自定义则使用全局的
 * @returns {{style: *, time: number, easing: *, transition: []}}
 */
function framing(style, duration, es) {
  let { offset, easing } = style;
  // 这两个特殊值提出来存储不干扰style
  delete style.offset;
  delete style.easing;
  style = css.normalize(style);
  let res = [];
  res[FRAME_STYLE] = style;
  res[FRAME_TIME] = offset * duration;
  res[FRAME_EASING] = easing || es;
  res[FRAME_TRANSITION] = [];
  return res;
}

/**
 * 计算两帧之间的差，单位不同的以后面为准，返回的v表示差值
 * 没有变化返回空
 * auto等无法比较的不参与计算，不返回来标识无过度效果
 * @param prev 上一帧样式
 * @param next 下一帧样式
 * @param k 比较的样式名
 * @param target dom对象
 * @returns {{k: *, v: *}}
 */
function calDiff(prev, next, k, target) {
  let res = [k];
  let p = prev[k];
  let n = next[k];
  if(k === TRANSFORM) {
    // transform因默认值null很特殊，不存在时需给默认矩阵
    if(!p && !n) {
      return;
    }
    let pm, nm;
    if(p) {
      pm = p[0][1];
    }
    else {
      pm = [1, 0, 0, 1, 0, 0];
    }
    if(n) {
      nm = n[0][1];
    }
    else {
      nm = [1, 0, 0, 1, 0, 0];
    }
    // transform特殊被初始化转成matrix矩阵，直接计算差值
    if(equalArr(pm, nm)) {
      return;
    }
    res[1] = [
      nm[0] - pm[0],
      nm[1] - pm[1],
      nm[2] - pm[2],
      nm[3] - pm[3],
      nm[4] - pm[4],
      nm[5] - pm[5],
    ];
    return res;
  }
  else if(k === FILTER) {
    // 目前只有1个blur，可以简单处理
    if(!p || !p.length) {
      res[1] = n[0][1];
    }
    else if(!n || !n.length) {
      res[1] = -p[0][1];
    }
    else {
      res[1] = n[0][1] - p[0][1];
    }
  }
  else if(k === TRANSFORM_ORIGIN) {
    res[1] = [];
    for(let i = 0; i < 2; i++) {
      let pi = p[i];
      let ni = n[i];
      if(pi[1] === ni[1]) {
        res[1].push(ni[0] - pi[0]);
      }
      else if(pi[1] === PX && ni[1] === PERCENT) {
        let v = ni[0] * 0.01 * target[i ? 'outerHeight' : 'outerWidth'];
        res[1].push(v - pi[0]);
      }
      else if(pi[1] === PERCENT && ni[1] === PX) {
        let v = ni[0] * 100 / target[i ? 'outerHeight' : 'outerWidth'];
        res[1].push(v - pi[0]);
      }
    }
    if(equalArr(res[1], [0, 0])) {
      return;
    }
  }
  else if(k === BACKGROUND_POSITION_X || k === BACKGROUND_POSITION_Y) {
    if(p[1] === n[1] && [PX, PERCENT].indexOf(p[1]) > -1) {
      let v = n[0] - p[0];
      if(v === 0) {
        return;
      }
      res[1] = v;
    }
    else if(p[1] === PX && n[1] === PERCENT) {
      let v = n[0] * 0.01 * target[k === BACKGROUND_POSITION_X ? 'innerWidth' : 'innerHeight'];
      v = v - p[0];
      if(v === 0) {
        return;
      }
      res[1] = v;
    }
    else if(p[1] === PERCENT && n[1] === PX) {
      let v = n[0] * 100 / target[k === BACKGROUND_POSITION_X ? 'innerWidth' : 'innerHeight'];
      v = v - p[0];
      if(v === 0) {
        return;
      }
      res[1] = v;
    }
  }
  else if(k === BOX_SHADOW) {
    res[1] = [];
    for(let i = 0, len = Math.min(p.length, n.length); i < len; i++) {
      let a = p[i];
      let b = n[i];
      let v = [];
      // x/y/blur/spread
      for(let j = 0; j < 4; j++) {
        v.push(b[j] - a[j]);
      }
      // rgba
      let c = [];
      for(let j = 0; j < 4; j++) {
        c.push(b[4][j] - a[4][j]);
      }
      v.push(c);
      res[1].push(v);
    }
  }
  else if(EXPAND_HASH.hasOwnProperty(k)) {
    if(p[1] === n[1]) {
      let v = n[0] - p[0];
      if(v === 0) {
        return;
      }
      res[1] = v;
    }
    else if(p[1] === PX && n[1] === PERCENT) {
      let v = n[0] * 0.01 * target[(k === TRANSLATE_X) ? 'outerWidth' : 'outerHeight'];
      v = v - p[0];
      if(v === 0) {
        return;
      }
      res[1] = v;
    }
    else if(p[1] === PERCENT && n[1] === PX) {
      let v = n[0] * 100 / target[(k === TRANSLATE_X) ? 'outerWidth' : 'outerHeight'];
      v = v - p[0];
      if(v === 0) {
        return;
      }
      res[1] = v;
    }
  }
  else if(k === BACKGROUND_SIZE) {
    res[1] = [];
    for(let i = 0; i < 2; i++) {
      let pi = p[i];
      let ni = n[i];
      if(pi[1] === ni[1] && [PX, PERCENT].indexOf(pi[1]) > -1) {
        res[1].push(ni[0] - pi[0]);
      }
      else if(pi[1] === PX && ni[1] === PERCENT) {
        let v = ni[0] * 0.01 * target[i ? 'innerWidth' : 'innerHeight'];
        res[1].push(v - pi[0]);
      }
      else if(pi[1] === PERCENT && ni[1] === PX) {
        let v = ni[0] * 100 / target[i ? 'innerWidth' : 'innerHeight'];
        res[1].push(v - pi[0]);
      }
      else {
        return;
      }
    }
    if(equalArr(res[1], [0, 0])) {
      return;
    }
  }
  else if(GRADIENT_HASH.hasOwnProperty(k)) {
    // backgroundImage发生了渐变色和图片的变化，fill发生渐变色和纯色的变化等
    if(p.k !== n.k) {
      return;
    }
    // 渐变
    else if(p.k === 'linear' || p.k === 'radial') {
      let pv = p.v;
      let nv = n.v;
      if(equalArr(pv, nv)) {
        return;
      }
      res[1] = [];
      let { innerWidth } = target;
      let eq;
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
        eq = equalArr(t, [0, 0, 0, 0]);
        if(a[1] && b[1]) {
          if(a[1][1] === b[1][1]) {
            t.push(b[1][0] - a[1][0]);
          }
          else if(a[1][1] === PX && b[1][1] === PERCENT) {
            t.push(b[1][0] * innerWidth * 0.01 - a[1][0]);
          }
          else if(a[1][1] === PERCENT && b[1][1] === PX) {
            t.push(b[1][0] * 100 / innerWidth - a[1][0]);
          }
          if(eq) {
            eq = t[4] === 0;
          }
        }
        else if(a[1] || b[1]) {
          eq = false;
        }
        res[1].push(t);
      }
      // 线性渐变有角度差值变化
      if(p.k === 'linear') {
        let v = n.d - p.d;
        if(eq && v === 0) {
          return;
        }
        res[2] = v;
      }
      // 径向渐变的位置
      else {
        res[3] = [];
        for(let i = 0; i < 2; i++) {
          let pp = p.p[i];
          let np = n.p[i];
          if(pp[1] === np[1]) {
            res[3].push(np[0] - pp[0]);
          }
          else if(pp[1] === PX && np[1] === PERCENT) {
            let v = np[0] * 0.01 * target[i ? 'innerWidth' : 'innerHeight'];
            res[3].push(v - pp[0]);
          }
          else if(pp[1] === PERCENT && np[1] === PX) {
            let v = np[0] * 100 / target[i ? 'innerWidth' : 'innerHeight'];
            res[3].push(v - pp[0]);
          }
        }
        if(eq && equalArr(res[3], [0, 0])) {
          return;
        }
      }
    }
    // 纯色
    else {
      if(equalArr(n, p)) {
        return;
      }
      res[1] = [
        n[0] - p[0],
        n[1] - p[1],
        n[2] - p[2],
        n[3] - p[3]
      ];
    }
  }
  else if(COLOR_HASH.hasOwnProperty(k)) {
    n = n[0];
    p = p[0];
    if(equalArr(n, p) || n[3] === 0 && p[3] === 0) {
      return;
    }
    res[1] = [
      n[0] - p[0],
      n[1] - p[1],
      n[2] - p[2],
      n[3] - p[3]
    ];
  }
  else if(RADIUS_HASH.hasOwnProperty(k)) {
    // x/y都相等无需
    if(n[0][0] === p[0][0] && n[0][1] === p[0][1]
      && n[1][0] === p[1][0] && n[1][1] === p[1][1]) {
      return;
    }
    res[1] = [];
    for(let i = 0; i < 2; i++) {
      if(n[i][1] === p[i][1]) {
        res[1].push(n[i][0] - p[i][0]);
      }
      else if(p[i][1] === PX && n[i][1] === PERCENT) {
        res[1].push(n[i][0] * 0.01 * target[i ? 'outerHeight' : 'outerWidth'] - p[i][0]);
      }
      else if(p[i][1] === PERCENT && n[i][1] === PX) {
        res[1].push(n[i][0] * 100 / target[i ? 'outerHeight' : 'outerWidth'] - p[i][0]);
      }
      else {
        res[1].push(0);
      }
    }
  }
  else if(LENGTH_HASH.hasOwnProperty(k)) {
    // auto不做动画
    if(p[1] === AUTO || n[1] === AUTO) {
      return;
    }
    let computedStyle = target.computedStyle;
    let parentComputedStyle = (target.domParent || target).computedStyle;
    let diff = 0;
    if(p[1] === n[1]) {
      diff = n[0] - p[0];
    }
    // 长度单位变化特殊计算，根据父元素computedStyle
    else if(p[1] === PX && n[1] === PERCENT) {
      let v;
      if(k === FONTSIZE) {
        v = n[0] * parentComputedStyle[k] * 0.01;
      }
      else if(k === FLEX_BASIS && computedStyle[FLEX_DIRECTION] === 'row' || k === WIDTH
        || [LEFT, RIGHT, MARGIN_BOTTOM, MARGIN_LEFT, MARGIN_TOP, MARGIN_RIGHT,
          PADDING_TOP, PADDING_RIGHT, PADDING_BOTTOM, PADDING_LEFT].indexOf(k) > -1) {
        v = n[0] * parentComputedStyle[WIDTH] * 0.01;
      }
      else if(k === FLEX_BASIS || k === HEIGHT || [TOP, BOTTOM].indexOf(k) > -1) {
        v = n[0] * parentComputedStyle[HEIGHT] * 0.01;
      }
      diff = v - p[0];
    }
    else if(p[1] === PERCENT && n[1] === PX) {
      let v;
      if(k === FONTSIZE) {
        v = n[0] * 100 / parentComputedStyle[k];
      }
      else if(k === FLEX_BASIS && computedStyle[FLEX_DIRECTION] === 'row' || k === WIDTH
        || [LEFT, RIGHT, MARGIN_BOTTOM, MARGIN_LEFT, MARGIN_TOP, MARGIN_RIGHT,
          PADDING_TOP, PADDING_RIGHT, PADDING_BOTTOM, PADDING_LEFT].indexOf(k) > -1) {
        v = n[0] * 100 / parentComputedStyle[WIDTH];
      }
      else if(k === FLEX_BASIS || k === HEIGHT || [TOP, BOTTOM].indexOf(k) > -1) {
        v = n[0] * 100 / parentComputedStyle[HEIGHT];
      }
      diff = v - p[0];
    }
    // lineHeight奇怪的单位变化
    else if(k === LINE_HEIGHT) {
      if(p[1] === PX && n[1] === NUMBER) {
        diff = n[0] * computedStyle[FONTSIZE] - p[0];
      }
      else if(p[1] === NUMBER && n[1] === PX) {
        diff = n[0] / computedStyle[FONTSIZE] - p[0];
      }
    }
    // 兜底NaN非法
    if(diff === 0 || isNaN(diff)) {
      return;
    }
    res[1] = diff;
  }
  else if(GEOM.hasOwnProperty(k)) {
    if(isNil(p)) {
      return;
    }
    // 特殊处理multi
    else if(target.isMulti) {
      if(k === 'points' || k === 'controls') {
        if(isNil(n) || isNil(p) || equalArr(p, n)) {
          return;
        }
        res[1] = [];
        for(let i = 0, len = Math.min(p.length, n.length); i < len; i++) {
          let pv = p[i];
          let nv = n[i];
          if(isNil(pv) || isNil(nv)) {
            res[1].push(null);
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
            res[1].push(v2);
          }
        }
      }
      else if(k === 'controlA' || k === 'controlB') {
        if(isNil(n) || isNil(p) || equalArr(p, n)) {
          return;
        }
        res[1] = [];
        for(let i = 0, len = Math.min(p.length, n.length); i < len; i++) {
          let pv = p[i];
          let nv = n[i];
          if(isNil(pv) || isNil(nv)) {
            res[1].push(null);
          }
          else {
            res[1].push([
              nv[0] - pv[0],
              nv[1] - pv[1],
            ]);
          }
        }
      }
      else {
        if(n === p || equalArr(n, p) || k === 'edge' || k === 'closure') {
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
        res[1] = v;
      }
    }
    // 非multi特殊处理这几类数组类型数据
    else if(k === 'points' || k === 'controls') {
      if(isNil(n) || isNil(p) || equalArr(p, n)) {
        return;
      }
      res[1] = [];
      for(let i = 0, len = Math.min(p.length, n.length); i < len; i++) {
        let pv = p[i];
        let nv = n[i];
        if(isNil(pv) || isNil(nv)) {
          res[1].push(null);
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
          res[1].push(v2);
        }
      }
    }
    else if(k === 'controlA' || k === 'controlB') {
      if(isNil(n) || isNil(p) || equalArr(p, n)) {
        return;
      }
      res[1] = [
        n[0] - p[0],
        n[1] - p[1],
      ];
    }
    // 其它简单数据，除了edge/closure没有增量
    else {
      if(n === p || k === 'edge' || k === 'closure') {
        return;
      }
      else {
        res[1] = n - p;
      }
    }
  }
  else if(k === OPACITY || k === Z_INDEX) {
    if(n === p) {
      return;
    }
    res[1] = n - p;
  }
  // display等不能有增量过程的
  else {
    return;
  }
  return res;
}

// 计算两帧之间不相同的变化，存入transition，相同的忽略
function calFrame(prev, next, keys, target) {
  keys.forEach(k => {
    let ts = calDiff(prev[FRAME_STYLE], next[FRAME_STYLE], k, target);
    // 可以形成过渡的才会产生结果返回
    if(ts) {
      prev[FRAME_TRANSITION].push(ts);
    }
  });
  return next;
}

function binarySearch(i, j, time, frames) {
  if(i === j) {
    let frame = frames[i];
    if(frame[FRAME_TIME] > time) {
      return i - 1;
    }
    return i;
  }
  else {
    let middle = i + ((j - i) >> 1);
    let frame = frames[middle];
    if(frame[FRAME_TIME] === time) {
      return middle;
    }
    else if(frame[FRAME_TIME] > time) {
      return binarySearch(i, Math.max(middle - 1, i), time, frames);
    }
    else {
      return binarySearch(Math.min(middle + 1, j), j, time, frames);
    }
  }
}

function getEasing(ea) {
  let timingFunction;
  if(ea) {
    if(/^\s*(?:cubic-bezier\s*)?\(\s*[\d.]+\s*,\s*[-\d.]+\s*,\s*[\d.]+\s*,\s*[-\d.]+\s*\)\s*$/i.test(ea)) {
      let v = ea.match(/[\d.]+/g);
      timingFunction = easing.cubicBezier(v[0], v[1], v[2], v[3]);
    }
    else if((timingFunction = /^\s*steps\s*\(\s*(\d+)(?:\s*,\s*(\w+))?\s*\)/i.exec(ea))) {
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
      timingFunction = easing[ea];
    }
  }
  return timingFunction;
}

/**
 * 根据百分比和缓动函数计算中间态样式
 * 当easing定义为steps时，优先计算
 * @param frame 当前帧
 * @param keys 所有样式key
 * @param percent 到下一帧时间的百分比
 * @param target vd
 * @returns {*}
 */
function calIntermediateStyle(frame, keys, percent, target) {
  let style = cloneStyle(frame[FRAME_STYLE], keys);
  let timingFunction = getEasing(frame[FRAME_EASING]);
  if(timingFunction && timingFunction !== linear) {
    percent = timingFunction(percent);
  }
  let transition = frame[FRAME_TRANSITION];
  for(let i = 0, len = transition.length; i < len; i++) {
    let [k, v, d, p] = transition[i];
    let st = style[k];
    // transform特殊处理，只有1个matrix，有可能不存在，需给默认矩阵
    if(k === TRANSFORM) {
      if(!st) {
        st = style[k] = [[MATRIX, [1, 0, 0, 1, 0, 0]]];
      }
      for(let i = 0; i < 6; i++) {
        st[0][1][i] += v[i] * percent;
      }
    }
    // else if(k === BACKGROUND_POSITION_X || k === BACKGROUND_POSITION_Y
    //   || LENGTH_HASH.hasOwnProperty(k) || EXPAND_HASH.hasOwnProperty(k)) {
    else if(NUM_CAL_HASH.hasOwnProperty(k)) {
      if(v) {
        st[0] += v * percent;
      }
    }
    else if(k === FILTER) {
      // 只有1个样式声明了filter另外一个为空
      if(!st) {
        st = style[k] = [['blur', 0]];
      }
      st[0][1] += v * percent;
    }
    else if(RADIUS_HASH.hasOwnProperty(k)) {
      for(let i = 0; i < 2; i++) {
        st[i][0] += v[i] * percent;
      }
    }
    else if(k === TRANSFORM_ORIGIN || k === BACKGROUND_SIZE) {
      if(v[0] !== 0) {
        st[0][0] += v[0] * percent;
      }
      if(v[1] !== 0) {
        st[1][0] += v[1] * percent;
      }
    }
    else if(k === BOX_SHADOW) {
      for(let i = 0, len = Math.min(st.length, v.length); i < len; i++) {
        // x/y/blur/spread
        for(let j = 0; j < 4; j++) {
          st[i][j] += v[i][j] * percent;
        }
        // rgba
        for(let j = 0; j < 4; j++) {
          st[i][4][j] += v[i][4][j] * percent;
        }
      }
    }
    else if(GRADIENT_HASH.hasOwnProperty(k)) {
      if(GRADIENT_TYPE.hasOwnProperty(st.k)) {
        for(let i = 0, len = Math.min(st.v.length, v.length); i < len; i++) {
          let a = st.v[i];
          let b = v[i];
          a[0][0] += b[0][0] * percent;
          a[0][1] += b[0][1] * percent;
          a[0][2] += b[0][2] * percent;
          a[0][3] += b[0][3] * percent;
          if(a[1] && b[1]) {
            a[1][0] += b[1] * percent;
          }
        }
        if(st.k === 'linear' && st.d !== undefined && d !== undefined) {
          st.d += d * percent;
        }
        if(st.k === 'radial' && st.p !== undefined && p !== undefined) {
          st.p[0][0] += p[0] * percent;
          st.p[1][0] += p[1] * percent;
        }
      }
      // fill纯色
      else {
        st[0] += v[0] * percent;
        st[1] += v[1] * percent;
        st[2] += v[2] * percent;
        st[3] += v[3] * percent;
      }
    }
    // color可能超限[0,255]，但浏览器已经做了限制，无需关心
    else if(COLOR_HASH.hasOwnProperty(k)) {
      st = st[0];
      st[0] += v[0] * percent;
      st[1] += v[1] * percent;
      st[2] += v[2] * percent;
      st[3] += v[3] * percent;
    }
    else if(GEOM.hasOwnProperty(k)) {
      let st = style[k];
      if(target.isMulti) {
        if(k === 'points' || k === 'controls') {
          for(let i = 0, len = Math.min(st.length, v.length); i < len; i++) {
            let o = st[i];
            let n = v[i];
            if(!isNil(o) && !isNil(n)) {
              for(let j = 0, len2 = Math.min(o.length, n.length); j < len2; j++) {
                let o2 = o[j];
                let n2 = n[j];
                if(!isNil(o2) && !isNil(n2)) {
                  for(let k = 0, len3 = Math.min(o2.length, n2.length); k < len3; k++) {
                    if(!isNil(o2[k]) && !isNil(n2[k])) {
                      o2[k] += n2[k] * percent;
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
            if(!isNil(item) && !isNil(st2)) {
              for(let i = 0, len = Math.min(st2.length, item.length); i < len; i++) {
                let o = st2[i];
                let n = item[i];
                if(!isNil(o) && !isNil(n)) {
                  st2[i] += n * percent;
                }
              }
            }
          });
        }
        else {
          v.forEach((item, i) => {
            if(!isNil(item) && !isNil(st[i])) {
              st[i] += item * percent;
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
                  o[j] += n[j] * percent;
                }
              }
            }
          }
        }
        else if(k === 'controlA' || k === 'controlB') {
          if(!isNil(st[0]) && !isNil(v[0])) {
            st[0] += v[0] * percent;
          }
          if(!isNil(st[1]) && !isNil(v[1])) {
            st[1] += v[1] * percent;
          }
        }
        else {
          if(!isNil(st) && !isNil(v)) {
            style[k] += v * percent;
          }
        }
      }
    }
    else if(k === OPACITY || k === Z_INDEX) {
      style[k] += v * percent;
    }
  }
  return style;
}

function gotoOverload(options, cb) {
  if(isFunction(options)) {
    cb = options;
    options = {};
  }
  return [options || {}, cb];
}

let uuid = 0;

const I_ASSIGNING = 0;
const I_IN_FPS = 1;
const I_IS_DELAY = 2;
const I_BEGIN = 3;
const I_END = 4;
const I_FINISHED = 5;
const I_NEXT_BEGIN = 6;
const I_FIRST_PLAY = 7;
const I_FRAME_CB = 8;
const I_PLAY_CB = 9;
const I_TARGET = 10;
const I_ROOT = 11;
const I_FRAMES = 12;
const I_FRAMES_R = 13;
const I_CURRENT_TIME = 14;
const I_NEXT_TIME = 15;
const I_STYLE = 16;
const I_DURATION = 17;
const I_ITERATIONS = 18;
const I_FILL = 19;
const I_PLAYBACK_RATE = 20;
const I_PLAY_COUNT = 21;
const I_PLAY_STATE = 22;
const I_DESTROYED = 23;
const I_START_TIME = 24;
const I_FPS_TIME = 25;
const I_EASING = 26;
const I_ENTER_FRAME = 27;
const I_DELAY = 28;
const I_END_DELAY = 29;
const I_KEYS = 30;
const I_ORIGIN_STYLE = 31;
const I_CURRENT_FRAMES = 32;
const I_CURRENT_FRAME = 33;
const I_SPF_LIMIT = 34;
const I_FPS = 35;
const I_DIRECTION = 36;
const I_CAL_DIFF_TIME = 37;
const I_FIRST_ENTER = 38;
const I_STAY_BEGIN = 39;
const I_STAY_END = 40;
const I_IS2 = 41;
const I_END_TIME = 42;
const I_NODE_CONFIG = 43;
const I_ROOT_CONFIG = 44;

class Animation extends Event {
  constructor(target, list, options) {
    super();
    this.__id = uuid++;
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
    let root = target.root;
    let config = this.__config = this.__config = [
      false, // assigning
      false, // inFps
      false, // isDelay
      false, // begin
      false, // end
      false, // finished
      false, // nextBegin
      true, // firstPlay
      this.__frameCb,
      null, // playCb
      target,
      root,
      null, // frames
      null, // framesR
      0, // currentTime
      0, // nextTime
      {}, // style
      0, // duration
      1, // iterations
      'none', // fill
      1, // playbackRate
      0, // playCount
      'idle',
      false, // destroy
      0, // startTime
      0, // fpsTime
      op.easing,
      false, // enterFrame
      0, // delay
      0, // endDelay
      null, // keys,
      null, // originStyle,
      null, // currentFrames
      null, // currentFrame
      false, // spfLimit
      60, // fps
      'normal', // direction
      this.__calDiffTime,
      true, // firstEnter,
      false, // stayBegin
      false, // stayEnd
      false, // is2
      0, // endTime
      target.__config, // nodeConfig
      root.__config, // rootConfig
    ];
    let iterations = this.iterations = op.iterations;
    let duration = this.duration = op.duration;
    let [frames, framesR, keys, originStyle] = this.__init(list, iterations, duration, op.easing, target);
    config[I_FRAMES] = frames;
    config[I_FRAMES_R] = framesR;
    config[I_KEYS] = keys;
    config[I_ORIGIN_STYLE] = originStyle;
    if(frames.length === 2) {
      config[I_IS2] = true;
      config[I_END_TIME] = frames[1][FRAME_TIME];
    }
    let fps = parseInt(op.fps) || 0;
    if(fps <= 0) {
      fps = 60;
    }
    this.fps = fps;
    this.spfLimit = op.spfLimit;
    this.delay = op.delay;
    this.endDelay = op.endDelay;
    this.playbackRate = op.playbackRate;
    this.fill = op.fill;
    this.iterations = op.iterations;
    this.direction = op.direction;
  }

  __init(list, iterations, duration, easing, target) {
    if(list.length < 1) {
      return [[], [], [], {}];
    }
    // 过滤时间非法的，过滤后续offset<=前面的
    let offset = -1;
    let tagName = target.tagName;
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
      Object.keys(current).forEach(k => {
        if(abbr.hasOwnProperty(k)) {
          abbr.toFull(current, k);
        }
      });
      // 检查key合法性
      Object.keys(current).forEach(k => {
        if(k !== 'easing' && k !== 'offset' && !change.isValid(tagName, k)) {
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
    // 计算没有设置offset的时间
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
    // 换算每一关键帧样式标准化
    list.forEach(item => {
      frames.push(framing(item, duration, easing));
    });
    // 为方便两帧之间计算变化，强制统一所有帧的css属性相同，没有写的为节点的当前样式currentStyle
    let keys = unify(frames, target);
    inherit(frames, keys, target);
    // 存储原本样式以便恢复用
    let { style, props } = target;
    let originStyle = {};
    keys.forEach(k => {
      if(change.isGeom(tagName, k)) {
        originStyle[k] = props[k];
      }
      originStyle[k] = style[k];
    });
    // 再计算两帧之间的变化，存入transition属性
    let length = frames.length;
    let prev = frames[0];
    for(let i = 1; i < length; i++) {
      let next = frames[i];
      prev = calFrame(prev, next, keys, target);
    }
    // 反向存储帧的倒排结果
    let framesR = clone(frames).reverse();
    framesR.forEach(item => {
      item[FRAME_TIME] = duration - item[FRAME_TIME];
      item[FRAME_TRANSITION] = [];
    });
    prev = framesR[0];
    for(let i = 1; i < length; i++) {
      let next = framesR[i];
      prev = calFrame(prev, next, keys, target);
    }
    return [frames, framesR, keys, originStyle];
  }

  __clean(isFinish) {
    let __config = this.__config;
    this.__cancelTask();
    __config[I_NEXT_TIME] = 0;
    let restore;
    let style = __config[I_STYLE];
    let keys = __config[I_KEYS];
    let target = __config[I_TARGET];
    if(isFinish) {
      __config[I_CURRENT_TIME] = __config[I_DELAY] + __config[I_DURATION] + __config[I_END_DELAY];
      // cancel需要清除finish根据情况保留
      if(!__config[I_STAY_END]) {
        __config[I_STYLE] = {};
        restore = true;
      }
    }
    else {
      __config[I_PLAY_COUNT] = __config[I_CURRENT_TIME] = 0;
      __config[I_PLAY_STATE] = 'idle';
      __config[I_STYLE] = {};
      restore = true;
    }
    // 动画取消结束不停留在最后一帧需要还原target原本的样式，需要对比目前是否是由本动画赋值的
    if(restore) {
      keys.forEach(k => {
        if(GEOM.hasOwnProperty(k)) {
          if(target.__currentProps[k] === style[k]) {
            target.__currentProps[k] = target.props[k];
          }
        }
        else {
          if(target.__currentStyle[k] === style[k]) {
            target.__currentStyle[k] = target.style[k];
          }
        }
      });
    }
  }

  __frameCb(__config, diff, isDelay) {
    this.emit(Event.FRAME, diff, isDelay);
    if(__config[I_FIRST_PLAY]) {
      __config[I_FIRST_PLAY] = false;
      this.emit(Event.PLAY);
    }
    if(isFunction(__config[I_PLAY_CB])) {
      __config[I_PLAY_CB].call(this, diff, isDelay);
      __config[I_PLAY_CB] = null;
    }
  }

  __calDiffTime(__config, diff) {
    let playbackRate = __config[I_PLAYBACK_RATE];
    let spfLimit = __config[I_SPF_LIMIT];
    let fps = __config[I_FPS];
    let v = __config[I_CURRENT_TIME] = __config[I_NEXT_TIME];
    // 定帧限制每帧时间间隔最大为spf
    if(spfLimit) {
      if(spfLimit === true) {
        diff = Math.min(diff, 1000 / fps);
      }
      else if(spfLimit > 0) {
        diff = Math.min(diff, spfLimit);
      }
    }
    // 播放时间累加，并且考虑播放速度加成
    if(playbackRate !== 1 && playbackRate > 0) {
      diff *= playbackRate;
    }
    __config[I_NEXT_TIME] += diff;
    return v;
  }

  play(cb) {
    let __config = this.__config;
    let isDestroyed = __config[I_DESTROYED];
    let duration = __config[I_DURATION];
    let playState = __config[I_PLAY_STATE];
    let frames = __config[I_FRAMES];
    if(isDestroyed || duration <= 0 || frames.length < 1) {
      return this;
    }
    if(playState === 'running') {
      return this;
    }
    this.__cancelTask();
    __config[I_PLAY_CB] = cb;
    __config[I_PLAY_STATE] = 'running';
    // 每次play调用标识第一次运行，需响应play事件和回调
    __config[I_FIRST_PLAY] = true;
    // 防止finish/cancel事件重复触发，每次播放重置
    this.__hasFin = false;
    this.__hasCancel = false;
    // 只有第一次调用会进初始化，另外finish/cancel视为销毁也会重新初始化
    if(!__config[I_ENTER_FRAME]) {
      __config[I_ENTER_FRAME] = true;
      let framesR = __config[I_FRAMES_R];
      let direction = __config[I_DIRECTION];
      // 初始化根据方向确定帧序列
      __config[I_CURRENT_FRAMES] = {
        reverse: true,
        'alternate-reverse': true,
      }.hasOwnProperty(direction) ? framesR : frames;
      __config[I_CURRENT_TIME] = __config[I_NEXT_TIME] = __config[I_FPS_TIME] = 0;
    }
    // 添加每帧回调且立刻执行，本次执行调用refreshTask也是下一帧再渲染，frame的每帧都是下一帧
    frame.offFrame(this);
    frame.onFrame(this);
    __config[I_START_TIME] = frame.__now;
    return this;
  }

  __before(diff) {
    let __config = this.__config;
    let target = __config[I_TARGET];
    let fps = __config[I_FPS];
    let playCount = __config[I_PLAY_COUNT];
    let currentFrames = __config[I_CURRENT_FRAMES];
    let iterations = __config[I_ITERATIONS];
    let stayBegin = __config[I_STAY_BEGIN];
    let stayEnd = __config[I_STAY_END];
    let delay = __config[I_DELAY];
    let root = __config[I_ROOT];
    let is2 = __config[I_IS2];
    let endTime = __config[I_END_TIME];
    let duration = __config[I_DURATION];
    let endDelay = __config[I_END_DELAY];
    let length = currentFrames.length;
    // 用本帧和上帧时间差，计算累加运行时间currentTime，以便定位当前应该处于哪个时刻
    let currentTime = __config[I_CAL_DIFF_TIME](__config, diff);
    // 增加的fps功能，当<60时计算跳帧，每帧运行依旧累加时间，达到fps时重置，第一帧强制不跳
    if(!__config[I_FIRST_ENTER] && fps < 60) {
      diff = __config[I_FPS_TIME] += diff;
      if(diff < 1000 / fps) {
        __config[I_IN_FPS] = true;
        return;
      }
      __config[I_FPS_TIME] = 0;
    }
    __config[I_FIRST_ENTER] = false;
    // delay仅第一次生效
    if(playCount > 0) {
      delay = 0;
    }
    // 还没过前置delay
    else if(currentTime < delay) {
      if(stayBegin) {
        let currentFrame = __config[I_CURRENT_FRAME] = currentFrames[0];
        let current = currentFrame[FRAME_STYLE];
        genBeforeRefresh(current, __config[I_KEYS], __config, root, target);
      }
      // 即便不刷新，依旧执行begin和帧回调
      if(currentTime === 0) {
        __config[I_BEGIN] = true;
      }
      __config[I_IS_DELAY] = true;
      return;
    }
    // 减去delay，计算在哪一帧
    currentTime -= delay;
    if(currentTime === 0) {
      __config[I_BEGIN] = true;
    }
    // 只有2帧可优化，否则2分查找当前帧
    let i, frameTime;
    if(is2) {
      i = currentTime < endTime ? 0 : 1;
      frameTime = endTime;
    }
    else {
      i = binarySearch(0, length - 1, currentTime, currentFrames);
      frameTime = currentFrames[i][FRAME_TIME];
    }
    // 最后一帧结束动画
    let isLastFrame = i === length - 1;
    let percent = 0;
    if(isLastFrame) {
      // 无需任何处理
    }
    // 否则根据目前到下一帧的时间差，计算百分比，再反馈到变化数值上
    else if(is2) {
      percent = currentTime / duration;
    }
    else {
      let total = currentFrames[i + 1][FRAME_TIME] - frameTime;
      percent = (currentTime - frameTime) / total;
    }
    let isLastCount = playCount >= iterations - 1;
    let inEndDelay, currentFrame = currentFrames[i], current;
    __config[I_CURRENT_FRAME] = currentFrame;
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
    if(isLastFrame) {
      // endDelay实际最后一次播放时生效，这里仅计算时间对比
      inEndDelay = currentTime < duration + endDelay;
      // 停留对比最后一帧，endDelay可能会多次进入这里，第二次进入样式相等不再重绘
      // 多次播放时到达最后一帧也会显示
      if(stayEnd || !isLastCount) {
        current = cloneStyle(currentFrame[FRAME_STYLE], __config[I_KEYS]);
      }
      // 不停留或超过endDelay则计算还原，有endDelay且fill模式不停留会再次进入这里
      else {
        current = cloneStyle(__config[I_ORIGIN_STYLE], __config[I_KEYS]);
      }
      // 非尾每轮次放完增加次数和计算下轮准备
      if(!isLastCount) {
        __config[I_NEXT_TIME] = currentTime - duration;
        playCount = ++__config[I_PLAY_COUNT];
        __config[I_NEXT_BEGIN] = true;
      }
      // 尾次考虑endDelay
      else if(!inEndDelay) {
        __config[I_NEXT_TIME] = 0;
        playCount = ++__config[I_PLAY_COUNT];
        // 判断次数结束每帧enterFrame调用，inEndDelay时不结束
        if(playCount >= iterations) {
          frame.offFrame(this);
        }
      }
    }
    else {
      current = calIntermediateStyle(currentFrame, __config[I_KEYS], percent, target);
    }
    // 无论两帧之间是否有变化，都生成计算结果赋给style，去重在root做
    genBeforeRefresh(current, __config[I_KEYS], __config, root, target);
    // 每次循环完触发end事件，最后一次循环触发finish
    if(isLastFrame && (!inEndDelay || isLastCount)) {
      __config[I_END] = true;
      if(playCount >= iterations) {
        __config[I_FINISHED] = true;
        this.__clean(true);
      }
    }
  }

  __after(diff) {
    let __config = this.__config;
    __config[I_ASSIGNING] = false;
    if(__config[I_IN_FPS]) {
      __config[I_IN_FPS] = false;
      return;
    }
    __config[I_FRAME_CB].call(this, __config, diff, __config[I_IS_DELAY]);
    __config[I_IS_DELAY] = false;
    if(__config[I_BEGIN]) {
      __config[I_BEGIN] = false;
      this.emit(Event.BEGIN, __config[I_PLAY_COUNT]);
    }
    if(__config[I_END]) {
      __config[I_END] = false;
      this.emit(Event.END, __config[I_PLAY_COUNT] - 1);
      let direction = __config[I_DIRECTION];
      let frames = __config[I_FRAMES];
      let framesR = __config[I_FRAMES_R];
      let isAlternate = {
        alternate: true,
        'alternate-reverse': true,
      }.hasOwnProperty(direction);
      // 有正反播放需要重设帧序列
      if(isAlternate) {
        let isEven = __config[I_PLAY_COUNT] % 2 === 0;
        if(direction === 'alternate') {
          __config[I_CURRENT_FRAMES] = isEven ? frames : framesR;
        }
        else {
          __config[I_CURRENT_FRAMES] = isEven ? framesR : frames;
        }
      }
    }
    if(__config[I_NEXT_BEGIN]) {
      __config[I_NEXT_BEGIN] = false;
      __config[I_BEGIN] = true;
    }
    if(__config[I_FINISHED]) {
      __config[I_BEGIN] = __config[I_END] = __config[I_IS_DELAY] = __config[I_FINISHED]
        = __config[I_IN_FPS] = __config[I_ENTER_FRAME] = false;
      __config[I_PLAY_STATE] = 'finished';
      this.emit(Event.FINISH);
    }
  }

  pause(silence) {
    let __config = this.__config;
    let isDestroyed = __config[I_DESTROYED];
    let duration = __config[I_DURATION];
    let { pending } = this;
    if(isDestroyed || duration <= 0 || pending) {
      return this;
    }
    __config[I_PLAY_STATE] = 'paused';
    this.__cancelTask();
    if(!silence) {
      this.emit(Event.PAUSE);
    }
    return this;
  }

  resume(cb) {
    let __config = this.__config;
    let isDestroyed = __config[I_DESTROYED];
    let duration = __config[I_DURATION];
    let playState = __config[I_PLAY_STATE];
    if(isDestroyed || duration <= 0 || playState !== 'paused') {
      return this;
    }
    return this.play(cb);
  }

  finish(cb) {
    let self = this;
    let __config = self.__config;
    let isDestroyed = __config[I_DESTROYED];
    let duration = __config[I_DURATION];
    let playState = __config[I_PLAY_STATE];
    let frames = __config[I_FRAMES];
    if(isDestroyed || duration <= 0 || frames.length < 1 || playState === 'finished' || playState === 'idle') {
      return self;
    }
    // 先清除所有回调任务，多次调用finish也会清除只留最后一次
    self.__cancelTask();
    let root = __config[I_ROOT];
    let originStyle = __config[I_ORIGIN_STYLE];
    if(root) {
      let current;
      // 停留在最后一帧
      if(__config[I_STAY_END]) {
        __config[I_CURRENT_FRAME] = frames[frames.length - 1];
        current = frames[frames.length - 1][FRAME_STYLE];
      }
      else {
        current = originStyle;
      }
      root.addRefreshTask({
        __before() {
          __config[I_ASSIGNING] = true;
          genBeforeRefresh(current, __config[I_KEYS], __config, root, __config[I_TARGET]);
          self.__clean(true);
        },
        __after(diff) {
          if(!self.__hasFin) {
            self.__hasFin = true;
            __config[I_ASSIGNING] = false;
            __config[I_PLAY_STATE] = 'finished';
            __config[I_FRAME_CB].call(self, __config, diff);
            __config[I_BEGIN] = __config[I_END] = __config[I_IS_DELAY] = __config[I_FINISHED]
              = __config[I_IN_FPS] = __config[I_ENTER_FRAME] = false;
            self.emit(Event.FINISH);
          }
          if(isFunction(cb)) {
            cb.call(self, diff);
          }
        },
      });
    }
    return self;
  }

  cancel(cb) {
    let self = this;
    let __config = self.__config;
    let isDestroyed = __config[I_DESTROYED];
    let duration = __config[I_DURATION];
    let playState = __config[I_PLAY_STATE];
    let frames = __config[I_FRAMES];
    if(isDestroyed || duration <= 0 || playState === 'idle' || frames.length < 1) {
      return self;
    }
    self.__cancelTask();
    let root = __config[I_ROOT];
    let originStyle = __config[I_ORIGIN_STYLE];
    if(root) {
      root.addRefreshTask({
        __before() {
          __config[I_ASSIGNING] = true;
          genBeforeRefresh(originStyle, __config[I_KEYS], __config, root, __config[I_TARGET]);
          self.__clean();
        },
        __after(diff) {
          if(!self.__hasCancel) {
            self.__hasCancel = true;
            __config[I_ASSIGNING] = false;
            __config[I_PLAY_STATE] = 'idle';
            __config[I_FRAME_CB].call(self, __config, diff);
            __config[I_BEGIN] = __config[I_END] = __config[I_IS_DELAY] = __config[I_FINISHED]
              = __config[I_IN_FPS] = __config[I_ENTER_FRAME] = false;
            self.emit(Event.CANCEL);
          }
          if(isFunction(cb)) {
            cb.call(self, diff);
          }
        },
      });
    }
    return self;
  }

  gotoAndPlay(v, options, cb) {
    let __config = this.__config;
    let isDestroyed = __config[I_DESTROYED];
    let duration = __config[I_DURATION];
    let frames = __config[I_FRAMES];
    let delay = __config[I_DELAY];
    let endDelay = __config[I_END_DELAY];
    if(isDestroyed || duration <= 0 || frames.length < 1) {
      return this;
    }
    [options, cb] = gotoOverload(options, cb);
    // 计算出时间点直接累加播放
    this.__goto(v, options.isFrame, options.excludeDelay);
    if(v > duration + delay + endDelay) {
      return this.finish(cb);
    }
    return this.play(cb);
  }

  gotoAndStop(v, options, cb) {
    let __config = this.__config;
    let isDestroyed = __config[I_DESTROYED];
    let duration = __config[I_DURATION];
    let frames = __config[I_FRAMES];
    let delay = __config[I_DELAY];
    let endDelay = __config[I_END_DELAY];
    if(isDestroyed || duration <= 0 || frames.length < 1) {
      return this;
    }
    [options, cb] = gotoOverload(options, cb);
    v = this.__goto(v, options.isFrame, options.excludeDelay);
    if(v > duration + delay + endDelay) {
      return this.finish(cb);
    }
    // 先play一帧，回调里模拟暂停
    return this.play(diff => {
      __config[I_PLAY_STATE] = 'paused';
      this.__cancelTask();
      if(isFunction(cb)) {
        cb.call(this, diff);
      }
    });
  }

  // 同步赋予，用在extendAnimate
  assignCurrentStyle() {
    let __config = this.__config;
    let style = __config[I_STYLE];
    let target = __config[I_TARGET];
    let keys = __config[I_KEYS];
    keys.forEach(i => {
      if(style.hasOwnProperty(i)) {
        let v = style[i];
        // geom的属性变化
        if(GEOM.hasOwnProperty(i)) {
          target.currentProps[i] = v;
        }
        // 样式
        else {
          // 将动画样式直接赋给currentStyle
          target.currentStyle[i] = v;
        }
      }
    });
  }

  __goto(v, isFrame, excludeDelay) {
    let __config = this.__config;
    let duration = __config[I_DURATION];
    __config[I_PLAY_STATE] = 'paused';
    this.__cancelTask();
    if(isNaN(v) || v < 0) {
      throw new Error('Param of gotoAnd(Play/Stop) is illegal: ' + v);
    }
    if(isFrame) {
      v = (v - 1) / this.spf;
    }
    if(excludeDelay) {
      v += __config[I_DELAY];
    }
    // 超过时间长度需要累加次数
    while(v > duration && __config[I_PLAY_COUNT] < __config[I_ITERATIONS] - 1) {
      __config[I_PLAY_COUNT]++;
      v -= duration;
    }
    // 在时间范围内设置好时间，复用play直接跳到播放点
    __config[I_NEXT_TIME] = v;
    return v;
  }

  addControl() {
    let ac = this.root.animateController;
    if(ac) {
      ac.add(this);
    }
  }

  removeControl() {
    let ac = this.root.animateController;
    if(ac) {
      ac.remove(this);
    }
  }

  __stayBegin() {
    return {
      backwards: true,
      both: true,
    }.hasOwnProperty(this.fill);
  }

  __stayEnd() {
    return {
      forwards: true,
      both: true,
    }.hasOwnProperty(this.fill);
  }

  __setTarget(target) {
    this.__target = target;
    this.__config[I_TARGET] = target;
    this.__config[I_NODE_CONFIG] = target.__config;
  }

  __cancelTask() {
    frame.offFrame(this);
    this.__config[I_PLAY_CB] = null;
  }

  __destroy(sync) {
    let self = this;
    let __config = self.__config;
    if(__config[I_DESTROYED]) {
      return;
    }
    self.removeControl();
    // clean异步执行，因为里面的样式还原需要等到下一帧，否则同步执行清除后，紧接着的新同步动画获取不到currentStyle
    if(sync) {
      self.__clean();
      __config[I_TARGET] = null;
    }
    else {
      frame.nextFrame({
        __before() {
          self.__clean();
          __config[I_TARGET] = null;
        },
      });
    }
    __config[I_START_TIME] = 0;
    __config[I_DESTROYED] = true;
  }

  __checkModify() {
    let __config = this.__config;
    if(__config[I_PLAY_STATE] !== 'idle' && __config[I_PLAY_STATE] !== 'finished') {
      console.warn('Modification will not come into effect when animation is running');
    }
  }

  get id() {
    return this.__id;
  }

  get target() {
    return this.__config[I_TARGET];
  }

  get root() {
    return this.__config[I_ROOT];
  }

  get keys() {
    return this.__config[I_KEYS];
  }

  get style() {
    return this.__config[I_STYLE];
  }

  get options() {
    return this.__options;
  }

  get duration() {
    return this.__config[I_DURATION];
  }

  set duration(v) {
    v = Math.max(0, parseFloat(v) || 0);
    let __config = this.__config;
    if(__config[I_DURATION] !== v) {
      __config[I_DURATION] = v;
      this.__checkModify();
    }
    return v;
  }

  get delay() {
    return this.__config[I_DELAY];
  }

  set delay(v) {
    v = Math.max(0, parseFloat(v) || 0);
    let __config = this.__config;
    if(__config[I_DELAY] !== v) {
      __config[I_DELAY] = v;
      this.__checkModify();
    }
    return v;
  }

  get endDelay() {
    return this.__config[I_END_DELAY];
  }

  set endDelay(v) {
    v = Math.max(0, parseFloat(v) || 0);
    let __config = this.__config;
    if(__config[I_END_DELAY] !== v) {
      __config[I_END_DELAY] = v;
      this.__checkModify();
    }
    return v;
  }

  get fps() {
    return this.__config[I_FPS];
  }

  set fps(v) {
    v = parseInt(v) || 60;
    let __config = this.__config;
    if(__config[I_FPS] !== v) {
      if(v <= 0) {
        v = 60;
      }
      __config[I_FPS] = v;
    }
    return v;
  }

  get spf() {
    return 1 / this.fps;
  }

  get iterations() {
    return this.__config[I_ITERATIONS];
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
    let __config = this.__config;
    if(__config[I_ITERATIONS] !== v) {
      __config[I_ITERATIONS] = v;
    }
    return v;
  }

  get fill() {
    return this.__config[I_FILL];
  }

  set fill(v) {
    v = v || 'none';
    let __config = this.__config;
    if(__config[I_FILL] !== v) {
      __config[I_FILL] = v;
      this.__checkModify();
    }
    __config[I_STAY_BEGIN] = {
      backwards: true,
      both: true,
    }.hasOwnProperty(v);
    __config[I_STAY_END] = {
      forwards: true,
      both: true,
    }.hasOwnProperty(v);
    return v;
  }

  get direction() {
    return this.__config[I_DIRECTION];
  }

  set direction(v) {
    v = v || 'normal';
    let __config = this.__config;
    if(__config[I_DIRECTION] !== v) {
      __config[I_DIRECTION] = v;
      this.__checkModify();
    }
    return v;
  }

  get frames() {
    return this.__config[I_FRAMES];
  }

  get framesR() {
    return this.__config[I_FRAMES_R];
  }

  get playbackRate() {
    return this.__config[I_PLAYBACK_RATE];
  }

  set playbackRate(v) {
    v = parseFloat(v) || 1;
    if(v <= 0) {
      v = 1;
    }
    let __config = this.__config;
    if(__config[I_PLAYBACK_RATE] !== v) {
      __config[I_PLAYBACK_RATE] = v;
    }
    return v;
  }

  get easing() {
    return this.__config[I_EASING];
  }

  get startTime() {
    return this.__config[I_START_TIME];
  }

  get currentTime() {
    return this.__config[I_CURRENT_TIME];
  }

  set currentTime(v) {
    v = Math.max(0, parseFloat(v) || 0);
    let __config = this.__config;
    if(__config[I_CURRENT_TIME] !== v) {
      __config[I_CURRENT_TIME] = v;
      __config[I_NEXT_TIME] = v;
    }
    return v;
  }

  get pending() {
    return this.__config[I_PLAY_STATE] !== 'running';
  }

  get finished() {
    return this.__config[I_PLAY_STATE] === 'finished';
  }

  get playState() {
    return this.__config[I_PLAY_STATE];
  }

  get playCount() {
    return this.__config[I_PLAY_COUNT];
  }

  set playCount(v) {
    v = Math.max(0, parseInt(v) || 0);
    let __config = this.__config;
    if(__config[I_PLAY_COUNT] !== v) {
      __config[I_PLAY_COUNT] = v;
    }
    return v;
  }

  get isDestroyed() {
    return this.__config[I_DESTROYED];
  }

  get animating() {
    let __config = this.__config;
    let playState = __config[I_PLAY_STATE];
    if(playState === 'idle') {
      return false;
    }
    return playState !== 'finished' || __config[I_STAY_END] || __config[I_STAY_BEGIN];
  }

  get spfLimit() {
    let __config = this.__config;
    return __config[I_SPF_LIMIT];
  }

  set spfLimit(v) {
    if(util.isNumber(v) || /^\d/.test(v)) {
      v = Math.max(0, parseInt(v) || 0);
    }
    else {
      v = !!v;
    }
    let __config = this.__config;
    if(__config[I_SPF_LIMIT] !== v) {
      __config[I_SPF_LIMIT] = v;
    }
    return v;
  }

  get assigning() {
    return this.__config[I_ASSIGNING];
  }
}

export default Animation;
