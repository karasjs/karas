import css from '../style/css';
import reset from '../style/reset';
import unit from '../style/unit';
import util from '../util/util';
import inject from '../util/inject';
import Event from '../util/Event';
import frame from './frame';
import easing from './easing';
import level from './level';
import repaint from './repaint';

const { AUTO, PX, PERCENT, INHERIT, RGBA, STRING, NUMBER } = unit;
const { isNil, isFunction, isNumber, clone } = util;

const KEY_COLOR = [
  'backgroundColor',
  'borderBottomColor',
  'borderLeftColor',
  'borderRightColor',
  'borderTopColor',
  'color',
];

const KEY_LENGTH = [
  'fontSize',
  'borderBottomWidth',
  'borderLeftWidth',
  'borderRightWidth',
  'borderTopWidth',
  'bottom',
  'left',
  'right',
  'top',
  'flexBasis',
  'width',
  'height',
  'lineHeight',
  'marginBottom',
  'marginLeft',
  'marginRight',
  'marginTop',
  'paddingBottom',
  'paddingLeft',
  'paddingRight',
  'paddingTop',
  'strokeWidth',
];

const KEY_GRADIENT = [
  'backgroundImage',
  'fill',
  'stroke',
];

const COLOR_HASH = {};
KEY_COLOR.forEach(k => {
  COLOR_HASH[k] = true;
});

const LENGTH_HASH = {};
KEY_LENGTH.forEach(k => {
  LENGTH_HASH[k] = true;
});

const GRADIENT_HASH = {};
KEY_GRADIENT.forEach(k => {
  GRADIENT_HASH[k] = true;
});

const GRADIENT_TYPE = {
  linear: true,
  radial: true,
};

const KEY_EXPAND = [
  'translateX',
  'translateY',
  'scaleX',
  'scaleY',
  'rotateZ',
  'skewX',
  'skewY'
];

const EXPAND_HASH = {};
KEY_EXPAND.forEach(k => {
  EXPAND_HASH[k] = true;
});

function equalArr(a, b) {
  if(a.length !== b.length) {
    return false;
  }
  for(let i = 0, len = a.length; i < len; i++) {
    let ai = a[i];
    let bi = b[i];
    let isArrayA = Array.isArray(ai);
    let isArrayB = Array.isArray(bi);
    if(isArrayA && isArrayB) {
      if(!equalArr(ai, bi)) {
        return false;
      }
    }
    else if(isArrayA || isArrayB) {
      return false;
    }
    if(ai !== bi) {
      return false;
    }
  }
  return true;
}

function unify(frames, target) {
  let hash = {};
  let keys = [];
  // 获取所有关键帧的属性
  frames.forEach(item => {
    let style = item.style;
    Object.keys(style).forEach(k => {
      let v = style[k];
      // 空的过滤掉
      if(!isNil(v) && !hash.hasOwnProperty(k)) {
        hash[k] = true;
        keys.push(k);
      }
    });
  });
  // 添补没有声明完全的关键帧属性为节点默认值
  frames.forEach(item => {
    let style = item.style;
    keys.forEach(k => {
      if(!style.hasOwnProperty(k)) {
        if(repaint.GEOM.hasOwnProperty(k)) {
          style[k] = target.props[k];
        }
        else {
          style[k] = target.style[k];
        }
      }
    });
  });
  return keys;
}

// 每次播放时处理继承值
function inherit(frames, keys, target) {
  let copy = clone(frames);
  let computedStyle = target.computedStyle;
  copy.forEach(item => {
    let style = item.style;
    keys.forEach(k => {
      let v = style[k];
      // geom的属性可能在帧中没有
      if(isNil(v)) {
        return;
      }
      if(v.unit === INHERIT) {
        if(k === 'color') {
          style[k] = {
            value: util.rgb2int(computedStyle[k]),
            unit: RGBA,
          };
        }
        else if(LENGTH_HASH.hasOwnProperty(k)) {
          style[k] = {
            value: computedStyle[k],
            unit: PX,
          };
        }
        else if(k === 'fontWeight') {
          style[k] = {
            value: computedStyle[k],
            unit: NUMBER,
          };
        }
        else if(k === 'fontStyle' || k === 'fontFamily' || k === 'textAlign') {
          style[k] = {
            value: computedStyle[k],
            unit: STRING,
          };
        }
      }
    });
  });
  return copy;
}

// 对比两个样式的某个值是否相等
function equalStyle(k, a, b) {
  if(k === 'transform') {
    if(a.length !== b.length) {
      return false;
    }
    for(let i = 0, len = a.length; i < len; i++) {
      let k1 = a[i][0];
      let k2 = b[i][0];
      if(k1 !== k2) {
        return false;
      }
      else {
        let v1 = a[i][1];
        let v2 = b[i][1];
        if(k1 === 'matrix') {
          if(v1[0] !== v2[0]
            || v1[1] !== v2[1]
            || v1[2] !== v2[2]
            || v1[3] !== v2[3]
            || v1[4] !== v2[4]
            || v1[5] !== v2[5]) {
            return false;
          }
        }
        else if(v1.value !== v2.value || v1.unit !== v2.unit) {
          return false;
        }
      }
    }
    return true;
  }
  else if(k === 'transformOrigin' || k === 'backgroundSize') {
    return a[0].value === b[0].value && a[0].unit === b[0].unit
      && a[1].value === b[1].value && a[1].unit === b[1].unit;
  }
  else if(k === 'backgroundPositionX' || k === 'backgroundPositionY'
    || LENGTH_HASH.hasOwnProperty(k) || EXPAND_HASH.hasOwnProperty(k)) {
    return a.value === b.value && a.unit === b.unit;
  }
  else if(GRADIENT_HASH.hasOwnProperty(k) && a.k === b.k && GRADIENT_TYPE.hasOwnProperty(a.k)) {
    let av = a.v;
    let bv = b.v;
    if(a.d !== b.d || av.length !== bv.length) {
      return false;
    }
    for(let i = 0, len = av.length; i < len; i++) {
      let ai = av[i];
      let bi = bv[i];
      if(ai.length !== bi.length) {
        return false;
      }
      for(let j = 0; j < 4; j++) {
        if(ai[0][j] !== bi[0][j]) {
          return false;
        }
      }
      if(ai.length > 1) {
        if(ai[1].value !== bi[1].value || ai[1].unit !== bi[1].unit) {
          return false;
        }
      }
    }
    return true;
  }
  else if(repaint.GEOM.hasOwnProperty(k)) {
    if(k === 'points' || k === 'controls') {
      if(a.length !== b.length) {
        return false;
      }
      for(let i = 0, len = a.length; i < len; i++) {
        if(a[i] === b[i]) {
          continue;
        }
        if(a[i][0] !== b[i][0] || a[i][1] !== b[i][1]) {
          return false;
        }
      }
      return true;
    }
    else if(k === 'controlA' || k === 'controlB') {
      if(a.length !== b.length) {
        return false;
      }
      return a[0] === b[0] && a[1] === b[1];
    }
  }
  return a === b;
}

function isStyleReflow(k) {
  return !repaint.STYLE.hasOwnProperty(k) && !repaint.GEOM.hasOwnProperty(k);
}

// 反向将颜色数组转换为css模式，同时计算target的animateStyle改变，计算刷新等级
function calRefresh(frameStyle, lastStyle, keys) {
  let res = false;
  let lv = level.REPAINT;
  for(let i = 0, len = keys.length; i < len; i++) {
    let k = keys[i];
    let n = frameStyle[k];
    let p = lastStyle[k];
    if(!isNil(n) && !isNil(p)) {
      if(!equalStyle(k, n, p)) {
        res = true;
        // 不相等且刷新等级是重新布局时可以提前跳出
        if(lv === level.REPAINT) {
          if(isStyleReflow(k)) {
            lv = level.REFLOW;
            break;
          }
        }
        else {
          break;
        }
      }
    }
    else if(!isNil(n) || !isNil(p)) {
      res = true;
      if(isStyleReflow(k)) {
        lv = level.REFLOW;
        break;
      }
    }
  }
  return [res, lv];
}

// 将当前frame的style赋值给动画style，xom绘制时获取
function genBeforeRefresh(frameStyle, animation, root, lv) {
  return function() {
    root.setRefreshLevel(lv);
    let style = {};
    let props = {};
    Object.keys(frameStyle).forEach(i => {
      let v = frameStyle[i];
      if(isNil(v)) {
        return;
      }
      // geom的属性变化
      if(repaint.GEOM.hasOwnProperty(i)) {
        props[i] = v;
        style[i] = v;
      }
      // 样式
      else {
        style[i] = v;
      }
    });
    animation.__style = style;
    animation.__props = props;
  };
}

// 根据动画涉及的样式keys，从当前样式取得同key的样式和帧对比，确认刷新等级；反过来最后一帧同
function getOriginStyleByKeys(keys, target) {
  let res = {};
  let style = target.style;
  keys.forEach(i => {
    res[i] = style[i];
  });
  return res;
}

/**
 * 将每帧的样式格式化，提取出offset属性并转化为时间，提取出缓动曲线easing
 * @param style 关键帧样式
 * @param resetStyle 所有帧合集的默认样式
 * @param duration 动画时间长度
 * @returns {{style: *, time: number, easing: *, transition: []}}
 */
function framing(style, resetStyle, duration) {
  let { offset, easing } = style;
  // 这两个特殊值提出来存储不干扰style
  delete style.offset;
  delete style.easing;
  css.normalize(style, resetStyle);
  return {
    style,
    time: offset * duration,
    easing,
    transition: [],
  };
}

/**
 * 计算两帧之间的差，单位不同的以后面为准，返回的v表示差值
 * 没有变化返回空
 * auto等无法比较的不参与计算，但会返回仅有k没有v，来标识无过度效果
 * @param prev 上一帧样式
 * @param next 下一帧样式
 * @param k 比较的样式名
 * @param target dom对象
 * @returns {{k: *, v: *}}
 */
function calDiff(prev, next, k, target) {
  let res = {
    k,
  };
  let p = prev[k];
  let n = next[k];
  if(k === 'transform') {
    if(!prev[k] || !next[k]) {
      return;
    }
    // transform每项以[k,v]存在，新老可能每项不会都存在，顺序也未必一致，不存在的认为是0
    let pExist = {};
    p.forEach(item => {
      pExist[item[0]] = item[1];
    });
    let nExist = {};
    n.forEach(item => {
      nExist[item[0]] = item[1];
    });
    res.v = [];
    let key = k;
    n.forEach(item => {
      let [k, v] = item;
      // 都存在的计算差值
      if(pExist.hasOwnProperty(k)) {
        let p = pExist[k];
        let n = nExist[k];
        if(k === 'matrix') {
          let t = [];
          for(let i = 0; i < 6; i++) {
            t[i] = n[i] - p[i];
          }
          res.v.push({
            k,
            v: t,
          });
        }
        else if(p.unit === n.unit) {
          res.v.push({
            k,
            v: v.value - p.value,
          });
        }
        else if(p.unit === PX && n.unit === PERCENT) {
          let v = n.value * 100 * target[k === 'translateX' ? 'outerWidth' : 'outerHeight'];
          res.v.push({
            k,
            v: v - p.value,
          });
        }
        else if(p.unit === PERCENT && n.unit === PX) {
          let v = n.value * 0.01 * target[k === 'translateX' ? 'outerWidth' : 'outerHeight'];
          res.v.push({
            k,
            v: v - p.value,
          });
        }
      }
      // matrix老的不存在的项默认为单位矩阵
      else if(k === 'matrix') {
        let id = [1, 0, 0, 1, 0, 0];
        prev[key].push([k, id]);
        let t = [];
        for(let i = 0; i < 6; i++) {
          t[i] = v[i] - id[i];
        }
        res.v.push({
          k,
          v: t,
        });
      }
      // 不存在的项默认为0
      else {
        prev[key].push([k, {
          value: 0,
          unit: v.unit,
        }]);
        res.v.push({
          k,
          v: v.value,
        });
      }
    });
    p.forEach(item => {
      let [k, v] = item;
      // 新的不存在的项默认为0或单位矩阵
      if(!nExist.hasOwnProperty(k)) {
        if(k === 'matrix') {
          let id = [1, 0, 0, 1, 0, 0];
          next[key].push([k, id]);
          let t = [];
          for(let i = 0; i < 6; i++) {
            t[i] = id[i] - v[i];
          }
          res.v.push({
            k,
            v: t,
          });
        }
        else {
          next[key].push([k, {
            value: 0,
            unit: v.unit,
          }]);
          res.v.push({
            k,
            v: -v.value,
          });
        }
      }
    });
  }
  else if(k === 'transformOrigin') {
    res.v = [];
    for(let i = 0; i < 2; i++) {
      let pi = p[i];
      let ni = n[i];
      if(pi.unit === ni.unit) {
        res.v.push(ni.value - pi.value);
      }
      else if(pi.unit === PX && ni.unit === PERCENT) {
        let v = ni.value * 0.01 * target[i ? 'outerHeight' : 'outerWidth'];
        res.v.push(v - pi.value);
      }
      else if(pi.unit === PERCENT && ni.unit === PX) {
        let v = ni.value * 100 * target[i ? 'outerHeight' : 'outerWidth'];
        res.v.push(v - pi.value);
      }
    }
    if(equalArr(res.v, [0, 0])) {
      return;
    }
  }
  else if(k === 'backgroundPositionX' || k === 'backgroundPositionY') {
    if(p.unit === n.unit && [PX, PERCENT].indexOf(p.unit) > -1) {
      let v = n.value - p.value;
      if(v === 0) {
        return;
      }
      res.v = v;
    }
    else if(p.unit === PX && n.unit === PERCENT) {
      let v = n.value * 0.01 * target[k === 'backgroundPositionX' ? 'innerWidth' : 'innerHeight'];
      v = v - p.value;
      if(v === 0) {
        return;
      }
      res.v = v;
    }
    else if(p.unit === PERCENT && n.unit === PX) {
      let v = n.value * 100 * target[k === 'backgroundPositionX' ? 'innerWidth' : 'innerHeight'];
      v = v - p.value;
      if(v === 0) {
        return;
      }
      res.v = v;
    }
  }
  else if(EXPAND_HASH.hasOwnProperty(k)) {
    if(p.unit === n.unit) {
      let v = n.value - p.value;
      if(v === 0) {
        return;
      }
      res.v = v;
    }
    else if(p.unit === PX && n.unit === PERCENT) {
      let v = n.value * 0.01 * target[/\w+X$/.test(k) ? 'outerWidth' : 'outerHeight'];
      v = v - p.value;
      if(v === 0) {
        return;
      }
      res.v = v;
    }
    else if(p.unit === PERCENT && n.unit === PX) {
      let v = n.value * 100 * target[/\w+X$/.test(k) ? 'outerWidth' : 'outerHeight'];
      v = v - p.value;
      if(v === 0) {
        return;
      }
      res.v = v;
    }
  }
  else if(k === 'backgroundSize') {
    res.v = [];
    for(let i = 0; i < 2; i++) {
      let pi = p[i];
      let ni = n[i];
      if(pi.unit === ni.unit && [PX, PERCENT].indexOf(pi.unit) > -1) {
        res.v.push(ni.value - pi.value);
      }
      else if(pi.unit === PX && ni.unit === PERCENT) {
        let v = ni.value * 0.01 * target[i ? 'innerWidth' : 'innerHeight'];
        res.v.push(v - pi.value);
      }
      else if(pi.unit === PERCENT && ni.unit === PX) {
        let v = ni.value * 100 * target[i ? 'innerWidth' : 'innerHeight'];
        res.v.push(v - pi.value);
      }
      else {
        res.n = n;
        return res;
      }
    }
    if(equalArr(res.v, [0, 0])) {
      return;
    }
  }
  else if(GRADIENT_HASH.hasOwnProperty(k)) {
    // backgroundImage发生了渐变色和图片的变化，fill发生渐变色和纯色的变化等
    if(p.k !== n.k) {
      res.n = n;
    }
    // 渐变
    else if(p.k === 'linear' || p.k === 'radial') {
      let pv = p.v;
      let nv = n.v;
      if(equalArr(pv, nv)) {
        return;
      }
      res.v = [];
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
          if(a[1].unit === b[1].unit) {
            t.push(b[1].value - a[1].value);
          }
          else if(a[1].unit === PX && b[1].unit === PERCENT) {
            t.push(b[1].value - a[1].value * 100 / innerWidth);
          }
          else if(a[1].unit === PERCENT && b[1].unit === PX) {
            t.push(b[1].value - a[1].value * 0.01 / innerWidth);
          }
          if(eq) {
            eq = t[4] === 0;
          }
        }
        else if(a[1] || b[1]) {
          eq = false;
        }
        res.v.push(t);
      }
      // 线性渐变有角度差值变化
      if(p.k === 'linear') {
        let v = n.d - p.d;
        if(eq && v === 0) {
          return;
        }
        res.d = v;
      }
      // TODO: 径向渐变的半径和圆心
      else {}
    }
    // 纯色
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
  else if(COLOR_HASH.hasOwnProperty(k)) {
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
  else if(LENGTH_HASH.hasOwnProperty(k)) {
    // auto不做动画
    if(p.unit === AUTO && n.unit === AUTO) {
      return;
    }
    if(p.unit === AUTO || n.unit === AUTO) {
      res.n = n;
      return res;
    }
    let parentComputedStyle = (target.parent || target).computedStyle;
    let diff = 0;
    if(p.unit === n.unit) {
      diff = n.value - p.value;
    }
    else if(p.unit === PX && n.unit === PERCENT) {
      let v = p.value * 100 / parentComputedStyle[k];
      diff = n.value - v;
    }
    else if(p.unit === PERCENT && n.unit === PX) {
      let v = p.value * 0.01 * parentComputedStyle[k];
      diff = n.value - v;
    }
    // lineHeight奇怪的单位变化
    else {
      return res;
    }
    if(diff === 0) {
      return;
    }
    res.v = diff;
  }
  else if(repaint.GEOM.hasOwnProperty(k)) {
    if(isNil(n)) {
      res.n = null;
    }
    else if(k === 'points' || k === 'controls') {
      if(equalArr(p, n)) {
        return;
      }
      res.v = [];
      for(let i = 0, len = Math.min(p.length, n.length); i < len; i++) {
        let pv = p[i];
        let nv = n[i];
        if(isNil(pv) || isNil(nv)) {
          res.v.push(nv);
        }
        else {
          let v = [];
          for(let j = 0, len2 = Math.max(pv.length, nv.length); j < len2; j++) {
            if(isNil(pv[j]) || isNil(nv[j])) {
              v.push(nv[j]);
            }
            else {
              v.push(nv[j] - pv[j]);
            }
          }
          res.v.push(v);
        }
      }
    }
    else if(k === 'controlA' || k === 'controlB') {
      if(equalArr(p, n)) {
        return;
      }
      res.v = [
        n[0] - p[0],
        n[1] - p[1]
      ];
    }
    else {
      if(n === p) {
        return;
      }
      res.v = n - p;
    }
  }
  else if(k === 'opacity' || k === 'zIndex') {
    if(n === p) {
      return;
    }
    res.v = n - p;
  }
  // display等不能有增量过程的
  else {
    if(n === p) {
      return;
    }
    res.n = n;
  }
  return res;
}

// 计算两帧之间不相同的变化，存入transition，相同的忽略
function calFrame(prev, next, keys, target) {
  keys.forEach(k => {
    let ts = calDiff(prev.style, next.style, k, target);
    // 可以形成过渡的才会产生结果返回
    if(ts) {
      prev.transition.push(ts);
    }
  });
  return next;
}

function binarySearch(i, j, time, frames) {
  if(i === j) {
    let frame = frames[i];
    if(frame.time > time) {
      return i - 1;
    }
    return i;
  }
  else {
    let middle = i + ((j - i) >> 1);
    let frame = frames[middle];
    if(frame.time === time) {
      return middle;
    }
    else if(frame.time > time) {
      return binarySearch(i, Math.max(middle - 1, i), time, frames);
    }
    else {
      return binarySearch(Math.min(middle + 1, j), j, time, frames);
    }
  }
}

// 根据百分比和缓动函数计算中间态样式
function calStyle(frame, percent) {
  let style = clone(frame.style);
  let timingFunction;
  if(/^\s*cubic-bezier\s*\(\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+\s*\)\s*$/.test(frame.easing)) {
    let v = frame.easing.match(/[\d.]+/g);
    timingFunction = easing.cubicBezier(v[0], v[1], v[2], v[3]);
  }
  else {
    timingFunction = easing[frame.easing] || easing.linear;
  }
  if(timingFunction !== easing.linear) {
    percent = timingFunction(percent);
  }
  frame.transition.forEach(item => {
    let { k, v, n, d } = item;
    let st = style[k];
    if(item.hasOwnProperty('n')) {
      style[k] = n;
    }
    else if(k === 'transform') {
      let transform = style.transform;
      let hash = {};
      transform.forEach(item => {
        hash[item[0]] = item[1];
      });
      v.forEach(item => {
        let { k, v } = item;
        if(k === 'matrix') {
          for(let i = 0; i < 6; i++) {
            hash[k][i] += v[i] * percent;
          }
        }
        else {
          hash[k].value += v * percent;
        }
      });
    }
    else if(k === 'backgroundPositionX' || k === 'backgroundPositionY'
      || LENGTH_HASH.hasOwnProperty(k) || EXPAND_HASH.hasOwnProperty(k)) {
      if(v !== 0) {
        st.value += v * percent;
      }
    }
    else if(k === 'transformOrigin' || k === 'backgroundSize') {
      if(v[0] !== 0) {
        st[0].value += v[0] * percent;
      }
      if(v[1] !== 0) {
        st[1].value += v[1] * percent;
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
            a[1].value += b[1] * percent;
          }
        }
        if(st.k === 'linear' && st.d !== undefined && d !== undefined) {
          st.d += d * percent;
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
      st[0] += v[0] * percent;
      st[1] += v[1] * percent;
      st[2] += v[2] * percent;
      st[3] += v[3] * percent;
    }
    else if(repaint.GEOM.hasOwnProperty(k)) {
      let st = style[k];
      if(k === 'points' || k === 'controls') {
        for(let i = 0, len = Math.min(st.length, v.length); i < len; i++) {
          if(isNil(st[i]) || !st[i].length) {
            continue;
          }
          for(let j = 0, len2 = Math.min(st[i].length, v[i].length); j < len2; j++) {
            if(!isNil(st[i][j]) && !isNil(v[i][j])) {
              st[i][j] += v[i][j] * percent;
            }
          }
        }
      }
      else if(k === 'controlA' || k === 'controlB') {
        st[0] += v[0] * percent;
        st[1] += v[1] * percent;
      }
      else {
        style[k] += v * percent;
      }
    }
    else if(k === 'opacity' || k === 'zIndex') {
      style[k] += v * percent;
    }
  });
  return style;
}

function gotoOverload(isFrame, excludeDelay, cb) {
  if(isFunction(isFrame)) {
    cb = isFrame;
    isFrame = excludeDelay = false;
  }
  else if(isFunction(excludeDelay)) {
    cb = excludeDelay;
    excludeDelay = false;
  }
  return [isFrame, excludeDelay, cb];
}

let uuid = 0;

class Animation extends Event {
  constructor(target, list, options) {
    super();
    this.__id = uuid++;
    this.__target = target;
    this.__list = clone(list || []);
    // 动画过程另外一种形式，object描述k-v形式
    if(!Array.isArray(this.__list)) {
      let nl = [];
      let l = this.__list;
      Object.keys(l).forEach(k => {
        let v = l[k];
        if(Array.isArray(v)) {
          for(let i = 0, len = v.length; i < len; i++) {
            let o = nl[i] = nl[i] || {
              offset: i / (len - 1),
            };
            o[k] = v[i];
          }
        }
      });
      this.__list = nl;
    }
    if(isNumber(options)) {
      this.__options = {
        duration: options,
      };
      options = this.__options;
    }
    let op = this.__options = options || {};
    this.__duration = parseFloat(op.duration) || 0;
    this.__delay = Math.max(0, parseFloat(op.delay) || 0);
    this.__endDelay = Math.max(parseFloat(op.endDelay) || 0, 0);
    if(op.iterations === Infinity || util.isString(op.iterations) && op.iterations.toLowerCase() === 'infinity') {
      this.__iterations = Infinity;
    }
    else {
      this.__iterations = parseInt(op.iterations);
      if(isNaN(this.__iterations)) {
        this.__iterations = 1;
      }
    }
    this.__fps = parseInt(op.fps) || 60;
    if(this.__fps < 0) {
      this.__fps = 60;
    }
    this.__fill = op.fill || 'none';
    this.__direction = op.direction || 'normal';
    this.__frames = [];
    this.__framesR = []; // 存储反向播放的数据
    this.__playbackRate = parseFloat(op.playbackRate) || 1;
    if(this.__playbackRate < 0) {
      this.__playbackRate = 1;
    }
    this.__startTime = 0;
    this.__offsetTime = 0; // 存储上次因暂停导致的时间偏移量长度
    this.__pauseTime = 0; // 上次暂停时刻的时间
    this.__playTime = 0; // 播放时间，不包括暂停时长，但包括delay、变速，以此定位动画处于何时
    this.__lastFpsTime = 0; // fps<60时跳帧使用，帧回调依旧运行，多次时间累加超过fps时才执行
    this.__deltaTime = 0; // gotoAndPlay使用，增加运行时间从而偏移帧数
    this.__playState = 'idle';
    this.__playCount = 0;
    this.__isDestroyed = false;
    this.__init();
  }

  __init() {
    let { target, iterations, frames, direction, duration } = this;
    // 执行次数小于1无需播放
    if(iterations < 1) {
      return;
    }
    target.__animateStyle.push(this.__style = {});
    if(target.isGeom) {
      target.__animateProps.push(this.__props = {});
    }
    let list = this.list;
    // 过滤时间非法的，过滤后续offset<=前面的
    let offset = -1;
    for(let i = 0, len = list.length; i < len; i++) {
      let current = list[i];
      if(current.hasOwnProperty('offset')) {
        current.offset = parseFloat(current.offset);
        // 超过区间[0,1]
        if(isNaN(current.offset) || current.offset < 0 || current.offset > 1) {
          list.splice(i, 1);
          i--;
          len--;
        }
        // <=前面的
        else if(current.offset <= offset) {
          list.splice(i, 1);
          i--;
          len--;
        }
      }
    }
    // 必须有1帧及以上描述
    if(list.length < 1) {
      return;
    }
    // 只有1帧复制出来变成2帧方便运行
    if(list.length === 1) {
      list.push(list[0]);
    }
    // 强制clone防止同引用
    list.forEach((item, i) => {
      list[i] = clone(item);
    });
    // 首尾时间偏移强制为[0, 1]
    let first = list[0];
    first.offset = 0;
    let last = list[list.length - 1];
    last.offset = 1;
    // 计算没有设置offset的时间
    for(let i = 1, len = list.length; i < len; i++) {
      let start = list[i];
      // 从i=1开始offset一定>0，找到下一个有offset的，均分中间无声明的
      if(!start.offset) {
        let end;
        let j = i + 1;
        for(; j < len; j++) {
          end = list[j];
          if(end.offset) {
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
    // 换算每一关键帧样式标准化
    list.forEach(item => {
      let resetStyle = [];
      Object.keys(item).forEach(k => {
        if(k === 'offset' || k === 'easing') {
          return;
        }
        resetStyle.push({
          k,
          v: reset.XOM[k],
        });
      });
      frames.push(framing(item, resetStyle, duration));
    });
    // 为方便两帧之间计算变化，强制统一所有帧的css属性相同，没有写的为节点的默认样式
    let keys = this.__keys = unify(frames, target);
    // 保存静态默认样式供第一帧和最后一帧计算比较
    this.__style = this.__originStyle = getOriginStyleByKeys(keys, target);
    // 反向存储帧的倒排结果
    if({ reverse: true, alternate: true, 'alternate-reverse': true }.hasOwnProperty(direction)) {
      let framesR = clone(frames).reverse();
      framesR.forEach(item => {
        item.time = duration - item.time;
        item.transition = [];
      });
      this.__framesR = framesR;
    }
    // 生成finish的任务事件
    this.__fin = () => {
      this.__playCount = 0;
      this.__style = this.__originStyle;
      this.emit(Event.KARAS_ANIMATION_FINISH);
    };
  }

  __calDiffTime(now) {
    let { playbackRate } = this;
    // 计算本帧和上帧时间差，累加到playTime上以便定位当前应该处于哪个时刻
    let diff = now - this.__lastTime - this.__offsetTime;
    diff = Math.max(diff, 0);
    if(playbackRate !== 1 && playbackRate > 0) {
      diff *= playbackRate;
    }
    // gotoAndPlay时手动累加的附加时间，以达到直接跳到后面某帧
    if(this.__deltaTime > 0) {
      diff = this.__deltaTime;
    }
    this.__deltaTime = 0;
    // 将此次增加的时间量加到播放时间上
    diff = this.__playTime += diff;
    this.__lastTime = now;
    // 每次清空偏移量防止下帧累加
    this.__offsetTime = 0;
    return diff;
  }

  play(cb) {
    let { isDestroyed, duration, playState } = this;
    if(isDestroyed || duration <= 0) {
      return this;
    }
    if(playState === 'running') {
      if(isFunction(cb)) {
        cb(0);
      }
      return this;
    }
    this.__cancelTask();
    // 每次play调用标识第一次运行，需响应参数cb
    this.__firstPlay = true;
    let frameCb = (delta, cb) => {
      if(this.__firstPlay) {
        this.__firstPlay = false;
        this.emit(Event.KARAS_ANIMATION_PLAY);
      }
      if(isFunction(cb)) {
        cb(delta);
      }
      this.emit(Event.KARAS_ANIMATION_FRAME, delta);
    };
    // 从头播放还是暂停继续，第一次时虽然pending是true但还无__callback
    if(this.pending && this.__callback) {
      let diff = inject.now() - this.__pauseTime;
      // 在没有performance时，防止乱改系统时间导致偏移向前，但不能防止改时间导致的偏移向后
      diff = Math.max(diff, 0);
      this.__offsetTime = diff;
    }
    // 只有第一次调用会进初始化，另外finish/cancel视为销毁也会重新初始化
    else {
      let {
        frames,
        framesR,
        target,
        playCount,
        direction,
        iterations,
        delay,
        endDelay,
        originStyle,
        keys,
        __fin,
      } = this;
      // 每次正常调用play都会从头开始，标识第一次callback运行初始化
      let init = true;
      // 是第一次运行强制不跳帧，由于设计delay和运行时独立跳帧逻辑，因此不能和init合并
      let first = true;
      let callback = this.__callback = (delta, cb) => {
        let root = target.root;
        // 防止被回收没root，以及在帧回调中pause，此时frame中的callback还未回收
        if(!root || this.pending) {
          return;
        }
        let { style } = this;
        let now = inject.now();
        if(init) {
          this.__startTime = this.__lastFpsTime = this.__lastTime = now;
          this.__playTime = 0;
          this.__style = style = originStyle;
          // 由于继承属性的存在，每次从头播放时先处理继承样式为computedStyle的样式
          frames = inherit(frames, keys, target);
          // 再计算两帧之间的变化，存入transition属性
          let length = frames.length;
          let prev = frames[0];
          for(let i = 1; i < length; i++) {
            let next = frames[i];
            prev = calFrame(prev, next, keys, target);
          }
          if(framesR.length) {
            framesR = inherit(framesR, keys, target);
            prev = framesR[0];
            for(let i = 1; i < length; i++) {
              let next = framesR[i];
              prev = calFrame(prev, next, keys, target);
            }
          }
        }
        // 计算本帧和上帧时间差，累加到playTime上以便定位当前应该处于哪个时刻
        let diff = this.__calDiffTime(now);
        // delay仅第一次生效
        if(playCount > 0) {
          delay = 0;
        }
        let needRefresh, lv;
        // 还没过前置delay
        if(diff < delay) {
          if(init && this.__stayBegin()) {
            let current = frames[0].style;
            // 对比第一帧，以及和第一帧同key的当前样式
            [needRefresh, lv] = calRefresh(current, style, keys);
            if(needRefresh) {
              let task = this.__task = {
                before: genBeforeRefresh(current, this, root, lv),
                after: delta => {
                  init = false;
                  frameCb(delta, cb);
                },
              };
              root.addRefreshTask(task);
              return;
            }
            else {
              init = false;
            }
          }
          // 非stayBegin以及非init时依旧执行帧回调
          frame.nextFrame(this.__task = delta => {
            frameCb(delta, cb);
          });
          return;
        }
        init = false;
        // 增加的fps功能，当<60时计算跳帧
        let fps = this.fps;
        if(!isNumber(fps) || fps <= 0) {
          fps = 60;
        }
        // 第一帧强制不跳帧，其它未到fps时间限制不执行
        if(!first && fps < 60) {
          let time = now - this.__lastFpsTime;
          if(time < 1000 / fps) {
            return;
          }
          // 保存本帧时间供下次跳帧计算
          this.__lastFpsTime = now;
        }
        first = false;
        // 根据播放次数确定正反方向
        let currentFrames;
        if(direction === 'reverse') {
          currentFrames = framesR;
        }
        else if({ alternate: true, 'alternate-reverse': true }.hasOwnProperty(direction)) {
          let isEven = playCount % 2 === 0;
          if(direction === 'alternate') {
            currentFrames = isEven ? frames : framesR;
          }
          else {
            currentFrames = isEven ? framesR : frames;
          }
        }
        else {
          currentFrames = frames;
        }
        let length = currentFrames.length;
        if(!length) {
          return;
        }
        // 减去delay，计算在哪一帧
        diff -= delay;
        let i = binarySearch(0, length - 1, diff, currentFrames);
        let current = currentFrames[i];
        // 最后一帧结束动画，两帧之间没有变化，不触发刷新仅触发frame事件
        if(i === length - 1) {
          current = current.style;
          [needRefresh, lv] = calRefresh(current, style, keys);
          playCount = ++this.playCount;
          // 播放完一次，播放时间清零，下一次播放重计
          this.__playTime = 0;
          if(playCount >= iterations) {
            frame.offFrame(callback);
          }
        }
        // 否则根据目前到下一帧的时间差，计算百分比，再反馈到变化数值上
        else {
          let total = currentFrames[i + 1].time - current.time;
          let percent = (diff - current.time) / total;
          current = calStyle(current, percent);
          [needRefresh, lv] = calRefresh(current, style, keys);
        }
        let task = (delta, cb) => {
          // 最后一帧考虑后续反向播还是停留还是结束
          if(i === length - 1) {
            // 没到播放次数结束时继续
            if(iterations === Infinity || playCount < iterations) {
              frameCb(delta, cb);
              return;
            }
            frame.offFrame(callback);
            // 不是停留在最后一帧还原
            let restore;
            if(this.__stayEnd()) {
              restore = __fin;
            }
            else {
              // 还原本来样式判断是否有变化刷新
              [needRefresh, lv] = calRefresh(current, originStyle, keys);
              restore = needRefresh ? {
                before: genBeforeRefresh({}, this, root, lv),
                after: __fin,
              } : __fin;
            }
            // 如果有endDelay还要延迟执行
            let isFinished = diff >= duration + endDelay;
            if(isFinished) {
              this.__playState = 'finished';
              root.addRefreshTask(this.__task = restore);
            }
            else {
              let task = this.__task = delta => {
                // 这里只需要算结束后的累计时间，要考虑暂停，加到playTime上
                let diff = this.__calDiffTime(inject.now());
                let isFinished = diff >= endDelay;
                if(isFinished) {
                  this.__playState = 'finished';
                  root.addRefreshTask(this.__task = restore);
                  frame.offFrame(task);
                }
                frameCb(delta);
              };
              frame.onFrame(task);
            }
          }
          frameCb(delta, cb);
        };
        if(needRefresh) {
          root.addRefreshTask(this.__task = {
            before: genBeforeRefresh(current, this, root, lv),
            after: delta => {
              task(delta, cb);
            },
          });
        }
        else {
          frame.nextFrame(this.__task = delta => {
            task(delta, cb);
          });
        }
      };
    }
    this.__playState = 'running';
    // 先执行，本次执行调用refreshTask也是下一帧再渲染，frame的每帧都是下一帧
    this.__callback(null, cb);
    frame.onFrame(this.__callback);
    return this;
  }

  pause() {
    let { isDestroyed, duration, pending } = this;
    if(isDestroyed || duration <= 0 || pending) {
      return this;
    }
    this.__pauseTime = inject.now();
    this.__playState = 'paused';
    this.__cancelTask();
    this.emit(Event.KARAS_ANIMATION_PAUSE);
    return this;
  }

  finish(cb) {
    let { isDestroyed, duration, playState, style, __fin } = this;
    this.__playCount = 0;
    if(isDestroyed || duration <= 0) {
      return this;
    }
    if(playState === 'finished') {
      if(isFunction(cb)) {
        cb();
      }
      return this;
    }
    this.__cancelTask();
    this.__playState = 'finished';
    this.__callback = null;
    let { target, frames, originStyle, keys } = this;
    let root = target.root;
    if(root) {
      let needRefresh, lv, current;
      // 停留在最后一帧
      if(this.__stayEnd()) {
        current = frames[frames.length - 1].style;
        [needRefresh, lv] = calRefresh(current, style, keys);
      }
      else {
        [needRefresh, lv] = calRefresh(style, originStyle, keys);
        current = {};
      }
      if(needRefresh) {
        root.addRefreshTask(this.__task = {
          before: genBeforeRefresh(current, this, root, lv),
          after: () => {
            if(isFunction(cb)) {
              cb();
            }
            __fin();
          },
        });
      }
      else {
        if(isFunction(cb)) {
          cb();
        }
        __fin();
      }
    }
    return this;
  }

  cancel(cb) {
    let { isDestroyed, duration, playState } = this;
    if(isDestroyed || duration <= 0) {
      return this;
    }
    if(playState === 'idle') {
      if(isFunction(cb)) {
        cb();
      }
      return this;
    }
    this.__cancelTask();
    this.__playState = 'idle';
    this.__callback = null;
    let { target, style, originStyle, keys } = this;
    let root = target.root;
    if(root) {
      let [needRefresh, lv] = calRefresh(style, originStyle, keys);
      let task = () => {
        this.__playCount = 0;
        if(isFunction(cb)) {
          cb();
        }
        this.__style = this.__originStyle;
        this.emit(Event.KARAS_ANIMATION_CANCEL);
      };
      if(needRefresh) {
        root.addRefreshTask(this.__task = {
          before: genBeforeRefresh({}, this, root, lv),
          after: task,
        });
      }
      else {
        task();
      }
    }
    return this;
  }

  gotoAndPlay(v, isFrame, excludeDelay, cb) {
    let { isDestroyed, duration, delay } = this;
    if(isDestroyed || duration <= 0) {
      return this;
    }
    [isFrame, excludeDelay, cb] = gotoOverload(isFrame, excludeDelay, cb);
    // 计算出时间点直接累加播放
    this.__goto(v, isFrame, excludeDelay);
    if(v > duration + delay) {
      return this.finish(cb);
    }
    return this.play(cb);
  }

  gotoAndStop(v, isFrame, excludeDelay, cb) {
    let { isDestroyed, duration, delay, endDelay } = this;
    if(isDestroyed || duration <= 0) {
      return this;
    }
    [isFrame, excludeDelay, cb] = gotoOverload(isFrame, excludeDelay, cb);
    v = this.__goto(v, isFrame, excludeDelay);
    if(v > duration + delay + endDelay) {
      return this.finish(cb);
    }
    // 先play一帧，回调里模拟暂停
    return this.play(delta => {
      this.__pauseTime = inject.now();
      this.__playState = 'paused';
      this.__cancelTask();
      if(isFunction(cb)) {
        cb(delta);
      }
    });
  }

  __goto(v, isFrame, excludeDelay) {
    let { duration, iterations, delay } = this;
    this.__playState = 'paused';
    this.__cancelTask();
    if(isNaN(v) || v < 0) {
      throw new Error('Param of gotoAnd(Play/Stop) is illegal: ' + v);
    }
    if(isFrame) {
      v = (v - 1) / this.spf;
    }
    if(excludeDelay) {
      v += delay;
    }
    // 超过时间长度需要累加次数
    while(v > duration && this.playCount < iterations - 1) {
      this.__playCount++;
      v -= duration;
    }
    // 在时间范围内设置好时间，复用play直接跳到播放点
    this.__deltaTime = v;
    return v;
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

  __cancelTask() {
    let { target, __task } = this;
    // 有可能使用了刷新，也有可能纯frame事件，都清除
    if(target.root) {
      target.root.delRefreshTask(__task);
    }
    frame.offFrame(__task);
    frame.offFrame(this.__callback);
  }

  __destroy() {
    frame.offFrame(this.__callback);
    this.__cancelTask();
    this.__callback = null;
    this.__playState = 'idle';
    this.__isDestroyed = true;
  }

  get id() {
    return this.__id;
  }
  get target() {
    return this.__target;
  }
  get keys() {
    return this.__keys;
  }
  get style() {
    return this.__style;
  }
  get originStyle() {
    return this.__originStyle;
  }
  get props() {
    return this.__props;
  }
  get list() {
    return this.__list;
  }
  get options() {
    return this.__options;
  }
  get duration() {
    return this.__duration;
  }
  get delay() {
    return this.__delay;
  }
  get endDelay() {
    return this.__endDelay;
  }
  get fps() {
    return this.__fps;
  }
  set fps(v) {
    v = parseInt(v) || 60;
    if(v < 0) {
      v = 60;
    }
    this.__fps = v;
  }
  get spf() {
    return 1 / this.fps;
  }
  get iterations() {
    return this.__iterations;
  }
  get fill() {
    return this.__fill;
  }
  get direction() {
    return this.__direction;
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
    v = parseFloat(v) || 0;
    if(v < 0) {
      v = 1;
    }
    this.__playbackRate = v;
  }
  get startTime() {
    return this.__startTime;
  }
  get pending() {
    return this.playState !== 'running';
  }
  get finished() {
    return this.playState === 'finished';
  }
  get playState() {
    return this.__playState;
  }
  get playCount() {
    return this.__playCount;
  }
  set playCount(v) {
    this.__playCount = v;
  }
  get isDestroyed() {
    return this.__isDestroyed;
  }
  get animating() {
    let { playState, options } = this;
    if(playState === 'idle') {
      return false;
    }
    return playState !== 'finished' || ['forwards', 'both'].indexOf(options.fill) > -1;
  }
}

export default Animation;
