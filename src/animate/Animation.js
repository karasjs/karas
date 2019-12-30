import css from '../style/css';
import unit from '../style/unit';
import util from '../util/util';
import inject from '../util/inject';
import Event from '../util/Event';
import frame from './frame';
import easing from './easing';
import level from './level';
import repaint from './repaint';

const KEY_COLOR = [
  'backgroundColor',
  'borderBottomColor',
  'borderLeftColor',
  'borderRightColor',
  'borderTopColor',
  'color',
  'fill',
  'stroke'
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
  'strokeWidth'
];

const KEY_GRADIENT = [
  'backgroundImage',
  'fill',
  'stroke'
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

// css模式rgb和init的颜色转换为rgba数组，方便加减运算
function color2array(style) {
  KEY_COLOR.forEach(k => {
    if(!style.hasOwnProperty(k)) {
      return;
    }
    let v = style[k];
    if(GRADIENT_TYPE.hasOwnProperty(v.k)) {
      return;
    }
    style[k] = util.rgb2int(v);
  });
  KEY_GRADIENT.forEach(k => {
    if(!style.hasOwnProperty(k)) {
      return;
    }
    let v = style[k];
    if(GRADIENT_TYPE.hasOwnProperty(v.k)) {
      v.v.forEach(item => {
        item[0] = util.rgb2int(item[0]);
      });
    }
  });
}

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
  else if(k === 'backgroundPositionX' || k === 'backgroundPositionY') {
    return a.value === b.value && a.unit === b.unit;
  }
  else if(k === 'transformOrigin' || k === 'backgroundSize') {
    return a[0].value === b[0].value && a[0].unit === b[0].unit && a[1].value === b[1].value && a[1].unit === b[1].unit;
  }
  else if(LENGTH_HASH.hasOwnProperty(k)) {
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

// 反向将颜色数组转换为css模式，同时计算target及其孩子的computedStyle
function stringify(style, lastStyle, target) {
  if(lastStyle) {
    let res = false;
    for(let i in style) {
      if(style.hasOwnProperty(i) && lastStyle.hasOwnProperty(i)) {
        if(!equalStyle(i, style[i], lastStyle[i])) {
          res = true;
          break;
        }
      }
      // 不同的属性说明要更新提前跳出
      else if(style.hasOwnProperty(i) || lastStyle.hasOwnProperty(i)) {
        res = true;
        break;
      }
    }
    // 防止last有style没有
    for(let i in lastStyle) {
      if(lastStyle.hasOwnProperty(i) && !style.hasOwnProperty(i)) {
        res = true;
        break;
      }
    }
    if(!res) {
      return false;
    }
  }
  let animateStyle = target.animateStyle;
  for(let i in style) {
    if(style.hasOwnProperty(i)) {
      let v = style[i];
      if(repaint.GEOM.hasOwnProperty(i)) {
        target['__' + i] = v;
      }
      else if(GRADIENT_HASH.hasOwnProperty(i) && GRADIENT_TYPE.hasOwnProperty(v.k)) {
        animateStyle[i] = {
          k: v.k,
          v: v.v.map(item => {
            let arr = [];
            let c = item[0];
            if(c[3] === 1) {
              arr.push(`rgb(${c[0]},${c[1]},${c[2]})`);
            }
            else {
              arr.push(`rgba(${c[0]},${c[1]},${c[2]},${c[3]})`);
            }
            if(item[1]) {
              arr.push(util.clone(item[1]));
            }
            return arr;
          }),
          d: v.d,
        };
      }
      else if(COLOR_HASH.hasOwnProperty(i)) {
        if(v[3] === 1) {
          animateStyle[i] = `rgb(${v[0]},${v[1]},${v[2]})`;
        }
        else {
          animateStyle[i] = `rgba(${v[0]},${v[1]},${v[2]},${v[3]})`;
        }
      }
      else {
        animateStyle[i] = v;
      }
    }
  }
  return true;
}

function restore(keys, target) {
  let { style, animateStyle } = target;
  keys.forEach(k => {
    animateStyle[k] = util.clone(style[k]);
  });
}

// 将变化写的样式格式化，提取出offset属性，提取出变化的key，初始化变化过程的存储
function framing(current, record) {
  let keys = [];
  let st = {};
  for(let i in current) {
    if(current.hasOwnProperty(i) && !{
      offset: true,
      easing: true,
    }.hasOwnProperty(i)) {
      if(keys.indexOf(i) === -1) {
        keys.push(i);
      }
      st[i] = current[i];
      if(record && !record.hash.hasOwnProperty(i)) {
        record.hash[i] = true;
        record.keys.push(i);
      }
    }
  }
  return {
    style: st,
    offset: current.offset,
    easing: current.easing,
    keys,
    transition: [],
  };
}

// 计算两帧之间的差，必须都含有某个属性，单位不同的以后面为准
function calDiff(prev, next, k, target) {
  if(!prev.hasOwnProperty(k) || !next.hasOwnProperty(k)) {
    return;
  }
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
        else if(p.unit === unit.PX && n.unit === unit.PERCENT) {
          if(k === 'translateX') {
            p.value = p.value * 100 / target.outerWidth;
          }
          else if(k === 'translateY') {
            p.value = p.value * 100 / target.outerHeight;
          }
          p.unit = unit.PERCENT;
          res.v.push({
            k,
            v: n.value - p.value,
          });
        }
        else if(p.unit === unit.PERCENT && n.unit === unit.PX) {
          if(k === 'translateX') {
            p.value = p.value * 0.01 * target.outerWidth;
          }
          else if(k === 'translateY') {
            p.value = p.value * 0.01 * target.outerHeight;
          }
          p.unit = unit.PX;
          res.v.push({
            k,
            v: n.value - p.value,
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
      // 老的不存在的项默认为0
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
      else if(pi.unit === unit.PX && ni.unit === unit.PERCENT) {
        pi.value = pi.value * 100 / target[i ? 'outerHeight' : 'outerWidth'];
        res.v.push(ni.value - pi.value);
      }
      else if(pi.unit === unit.PERCENT && ni.unit === unit.PX) {
        pi.value = pi.value * 0.01 * target[i ? 'outerHeight' : 'outerWidth'];
        res.v.push(ni.value - pi.value);
      }
      else {
        res.v.push(0);
      }
    }
  }
  else if(k === 'backgroundPositionX' || k === 'backgroundPositionY') {
    if(p.unit === n.unit && [unit.PX, unit.PERCENT].indexOf(p.unit) > -1) {
      res.v = n.value - p.value;
    }
    else {
      res.v = 0;
    }
  }
  else if(k === 'backgroundSize') {
    res.v = [];
    for(let i = 0; i < 2; i++) {
      let pi = p[i];
      let ni = n[i];
      if(pi.unit === ni.unit && [unit.PX, unit.PERCENT].indexOf(pi.unit) > -1) {
        res.v.push(ni.value - pi.value);
      }
      else {
        res.v.push(0);
      }
    }
  }
  else if(GRADIENT_HASH.hasOwnProperty(k)
    && { 'linear': true, 'radial': true }.hasOwnProperty(p.k)
    && p.k === n.k
    && p.v.length
    && p.v.length) {
    let pv = p.v;
    let nv = n.v;
    res.v = [];
    for(let i = 0, len = Math.min(pv.length, nv.length); i < len; i++) {
      let a = pv[i];
      let b = nv[i];
      let t = [];
      t.push([
        b[0][0] - a[0][0],
        b[0][1] - a[0][1],
        b[0][2] - a[0][2],
        b[0][3] - a[0][3]
      ]);
      if(a[1] && b[1] && a[1].unit === b[1].unit) {
        t.push(b[1].value - a[1].value);
      }
      // 单位不同不做运算
      else {
        continue;
      }
      res.v.push(t);
    }
    if(p.k === 'linear' && p.d !== undefined && n.d !== undefined) {
      res.d = n.d - p.d;
    }
  }
  else if(COLOR_HASH.hasOwnProperty(k)) {
    // fill和stroke可能纯色和渐变不一致
    if(p.k !== n.k) {
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
    if(p.unit === unit.AUTO || n.unit === unit.AUTO) {
      return;
    }
    let parentComputedStyle = (target.parent || target).computedStyle;
    if(p.unit === n.unit) {
      res.v = n.value - p.value;
    }
    else if(p.unit === unit.PX && n.unit === unit.PERCENT) {
      p.value = p.value * 100 / parentComputedStyle[k];
      p.unit = unit.PERCENT;
      res.v = n.value - p.value;
    }
    else if(p.unit === unit.PERCENT && n.unit === unit.PX) {
      p.value = p.value * 0.01 * parentComputedStyle[k];
      p.unit = unit.PX;
      res.v = n.value - p.value;
    }
    else {
      return;
    }
  }
  else if(repaint.GEOM.hasOwnProperty(k)) {
    if(k === 'points' || k === 'controls') {
      res.v = [];
      for(let i = 0, len = Math.min(p.length, n.length); i < len; i++) {
        let pv = p[i];
        let nv = n[i];
        if(util.isNil(pv) || util.isNil(nv)) {
          res.v.push(pv);
        }
        else {
          let v = [];
          for(let j = 0, len2 = Math.max(pv.length, nv.length); j < len2; j++) {
            if(util.isNil(pv[j]) || util.isNil(nv[j])) {
              v.push(pv[j]);
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
      res.v = [
        n[0] - p[0],
        n[1] - p[1]
      ];
    }
    else {
      res.v = n - p;
    }
  }
  else if(k === 'opacity') {
    res.v = n - p;
  }
  else {
    res.v = p;
  }
  return res;
}

function calFrame(prev, current, target, record) {
  let next = framing(current, record);
  next.keys.forEach(k => {
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

function calStyle(frame, percent) {
  let style = util.clone(frame.style);
  let timingFunction = easing[frame.easing] || easing.linear;
  if(timingFunction !== easing.linear) {
    percent = timingFunction(percent);
  }
  percent = Math.max(percent, 0);
  percent = Math.min(percent, 1);
  frame.transition.forEach(item => {
    let { k, v, d } = item;
    let st = style[k];
    if(k === 'transform') {
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
    else if(k === 'backgroundPositionX' || k === 'backgroundPositionY') {
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
    else if(GRADIENT_HASH.hasOwnProperty(k) && GRADIENT_TYPE.hasOwnProperty(st.k)) {
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
    // color可能超限[0,255]，但浏览器已经做了限制，无需关心
    else if(COLOR_HASH.hasOwnProperty(k)) {
      st[0] += v[0] * percent;
      st[1] += v[1] * percent;
      st[2] += v[2] * percent;
      st[3] += v[3] * percent;
    }
    else if(LENGTH_HASH.hasOwnProperty(k)) {
      style[k].value += v * percent;
    }
    else if(repaint.GEOM.hasOwnProperty(k)) {
      let st = style[k];
      if(k === 'points' || k === 'controls') {
        for(let i = 0, len = Math.min(st.length, v.length); i < len; i++) {
          if(util.isNil(st[i]) || !st[i].length) {
            continue;
          }
          for(let j = 0, len2 = Math.min(st[i].length, v[i].length); j < len2; j++) {
            if(!util.isNil(st[i][j]) && !util.isNil(v[i][j])) {
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
    else if(k === 'opacity') {
      style[k] += v * percent;
    }
    else {
      style[k] = v;
    }
  });
  return style;
}

function getLevel(style) {
  for(let i in style) {
    if(style.hasOwnProperty(i)) {
      if(!repaint.STYLE.hasOwnProperty(i) && !repaint.GEOM.hasOwnProperty(i)) {
        return level.REFLOW;
      }
    }
  }
  return level.REPAINT;
}

let uuid = 0;

class Animation extends Event {
  constructor(target, list, options) {
    super();
    this.__id = uuid++;
    this.__target = target;
    this.__list = util.clone(list || []);
    // 动画过程另外一种形式，object描述k-v形式
    if(!Array.isArray(this.__list)) {
      let nl = [];
      let l = this.__list;
      for(let k in l) {
        if(l.hasOwnProperty(k)) {
          let v = l[k];
          if(Array.isArray(v)) {
            for(let i = 0, len = v.length; i < len; i++) {
              let o = nl[i] = nl[i] || {
                offset: i / (len - 1),
              };
              o[k] = v[i];
            }
          }
        }
      }
      this.__list = nl;
    }
    if(util.isNumber(options)) {
      this.__options = {
        duration: options,
      };
      options = this.__options;
    }
    let op = this.__options = options || {};
    this.__duration = parseFloat(op.duration) || 0;
    this.__delay = Math.max(0, parseFloat(op.delay) || 0);
    this.__endDelay = Math.max(parseFloat(op.endDelay) || 0, 0);
    if(op.iterations === 'Infinity' || op.iterations === 'infinity' || op.iterations === Infinity) {
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
    this.__offsetTime = 0;
    this.__pauseTime = 0;
    this.__lastFpsTime = 0;
    this.__pending = false;
    this.__playState = 'idle';
    this.__playCount = 0;
    this.__cb = null;
    this.__isDestroyed = true;
    this.__diffTime = 0;
    this.__init();
  }

  __init() {
    let { target, iterations, frames, framesR, direction, duration } = this;
    let style = util.clone(target.style);
    // 执行次数小于1无需播放
    if(iterations < 1) {
      return;
    }
    // 第一个动画执行时进行clone操作，防止2个一起时后面的覆盖前面重新clone导致前面的第一帧失效
    if(target.animateStyle !== target.currentStyle) {
      target.__animateStyle = util.clone(style);
    }
    // 转化style为计算后的绝对值结果
    color2array(style);
    // 过滤时间非法的，过滤后续offset<=前面的
    let list = this.list;
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
        // 正常的标准化样式
        else {
          offset = current.offset;
          css.normalize(current);
          color2array(current);
        }
      }
      else {
        css.normalize(current);
        color2array(current);
      }
    }
    // 必须有2帧及以上描述
    if(list.length < 2) {
      return;
    }
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
    // 换算出60fps中每一帧，为防止空间过大，不存储每一帧的数据，只存储关键帧和增量
    let length = list.length;
    let record = this.__record = {
      keys: [],
      hash: {},
    };
    let prev;
    // 第一帧要特殊处理
    prev = framing(first, record);
    frames.push(prev);
    for(let i = 1; i < length; i++) {
      let next = list[i];
      prev = calFrame(prev, next, target, record);
      frames.push(prev);
    }
    this.__isDestroyed = false;
    // 反向
    if({ reverse: true, alternate: true, 'alternate-reverse': true }.hasOwnProperty(direction)) {
      let listR = util.clone(list).reverse();
      listR.forEach(item => {
        item.offset = 1 - item.offset;
      });
      prev = framing(listR[0]);
      framesR.push(prev);
      for(let i = 1; i < length; i++) {
        let next = listR[i];
        prev = calFrame(prev, next, target);
        framesR.push(prev);
      }
    }
    // 生成finish的任务事件
    this.__fin = () => {
      this.emit(Event.KARAS_ANIMATION_FRAME);
      this.emit(Event.KARAS_ANIMATION_FINISH);
    };
    frames.forEach(frame => {
      frame.time = duration * frame.offset;
    });
    framesR.forEach(frame => {
      frame.time = duration * frame.offset;
    });
  }

  play() {
    if(this.isDestroyed || this.duration <= 0) {
      return this;
    }
    this.__cancelTask();
    this.__playState = 'running';
    // 从头播放还是暂停继续
    if(this.pending) {
      let now = inject.now();
      let diff = now - this.pauseTime;
      // 在没有performance时，防止乱改系统时间导致偏移向前，但不能防止改时间导致的偏移向后
      diff = Math.max(diff, 0);
      this.__offsetTime = diff;
    }
    else {
      let {
        frames,
        framesR,
        target,
        playCount,
        duration,
        direction,
        iterations,
        fill,
        delay,
        endDelay,
        __fin,
        __record,
      } = this;
      let length = frames.length;
      let init = true;
      let first = true;
      this.__cb = () => {
        let { playbackRate, offsetTime } = this;
        let now = inject.now();
        let root = target.root;
        if(init) {
          this.__startTime = this.__lastFpsTime = this.__lastTime = now;
          this.__lastIndex = 0;
        }
        let diff = now - this.__lastTime - offsetTime;
        diff = Math.max(diff, 0);
        if(playbackRate !== 1) {
          diff *= playbackRate;
        }
        this.__diffTime += diff;
        diff = this.__diffTime;
        this.__lastTime = now;
        // delay仅第一次生效
        if(playCount > 0) {
          delay = 0;
        }
        // 还没过前置delay
        if(diff < delay) {
          if(init && {
            backwards: true,
            both: true,
          }.hasOwnProperty(fill)) {
            let current = frames[0];
            let needRefresh = stringify(current.style, {}, target);
            let task = this.__task = () => {
              this.emit(Event.KARAS_ANIMATION_FRAME);
            };
            if(needRefresh) {
              root.setRefreshLevel(getLevel(current.style));
              root.addRefreshTask(task);
            }
          }
          init = false;
          return;
        }
        init = false;
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
        diff -= delay;
        let i = binarySearch(0, currentFrames.length - 1, diff, currentFrames);
        let current = currentFrames[i];
        let needRefresh;
        // 最后一帧结束动画
        if(i === length - 1) {
          needRefresh = stringify(current.style, this.__lastStyle, target);
          if(playCount < iterations) {
            playCount = ++this.playCount;
            this.__diffTime = 0;
          }
        }
        // 否则根据目前到下一帧的时间差，计算百分比，再反馈到变化数值上
        else {
          // 增加的fps功能，当<60时计算跳帧
          let fps = this.fps;
          if(!util.isNumber(fps) || fps < 0) {
            fps = 60;
          }
          if(!first && fps < 60) {
            let time = now - this.__lastFpsTime;
            if(time < 1000 / fps) {
              return;
            }
          }
          let total = currentFrames[i + 1].time - current.time;
          let percent = (diff - current.time) / total;
          let style = calStyle(current, percent);
          needRefresh = stringify(style, this.__lastStyle, target);
        }
        this.__lastFpsTime = now;
        this.__lastStyle = current.style;
        first = false;
        // 两帧之间没有变化，不触发刷新
        if(root) {
          // 可能涉及字号变化，引发布局变更重新测量
          let task = this.__task = () => {
            this.emit(Event.KARAS_ANIMATION_FRAME);
            if(i === length - 1) {
              // 没到播放次数结束时继续
              if(iterations === Infinity || playCount < iterations) {
                return;
              }
              frame.offFrame(this.cb);
              // 不是停留在最后一帧还原
              if(!{
                forwards: true,
                both: true,
              }.hasOwnProperty(fill)) {
                root.setRefreshLevel(getLevel(__record.hash));
                restore(__record.keys, target);
              }
              // 如果有endDelay还要延迟执行
              let isFinished = diff >= duration + endDelay;
              if(isFinished) {
                // 播放结束考虑endDelay
                this.__playState = 'finished';
                root.addRefreshTask(this.__task = __fin);
              }
              else {
                let task = this.__task = () => {
                  now = inject.now();
                  let diff = now - this.__lastTime - offsetTime - delay;
                  diff = Math.max(diff, 0);
                  if(playbackRate !== 1) {
                    diff *= playbackRate;
                  }
                  this.__diffTime += diff;
                  diff = this.__diffTime;
                  this.__lastTime = now;
                  let isFinished = diff >= duration + endDelay;
                  if(isFinished) {
                    this.__playState = 'finished';
                    root.addRefreshTask(this.__task = __fin);
                    frame.offFrame(task);
                  }
                };
                frame.onFrame(task);
              }
            }
          };
          if(needRefresh) {
            root.setRefreshLevel(getLevel(current.style));
            root.addRefreshTask(task);
          }
          else {
            frame.nextFrame(task);
          }
        }
      };
    }
    // 先执行，本次执行调用refreshTask也是下一帧再渲染，frame的每帧都是下一帧
    this.cb();
    // 防止重复调用多次cb
    frame.offFrame(this.cb);
    frame.onFrame(this.cb);
    this.__pending = false;
    return this;
  }

  pause() {
    this.__pending = true;
    this.__pauseTime = inject.now();
    this.__playState = 'paused';
    frame.offFrame(this.cb);
    this.__cancelTask();
    this.emit(Event.KARAS_ANIMATION_PAUSE);
    return this;
  }

  finish() {
    let { fill, playState, __fin, __record } = this;
    if(playState === 'finished') {
      return this;
    }
    frame.offFrame(this.cb);
    this.__cancelTask();
    let { target, lastStyle } = this;
    let root = target.root;
    if(root) {
      this.__playState = 'finished';
      let needRefresh;
      // 停留在最后一帧
      if({
        forwards: true,
        both: true,
      }.hasOwnProperty(fill)) {
        let last = this.frames[this.frames.length - 1];
        needRefresh = stringify(last.style, lastStyle, this.target);
        if(needRefresh) {
          root.setRefreshLevel(getLevel(last.style));
          root.addRefreshTask(this.__task = __fin);
        }
        else {
          frame.nextFrame(this.__task = __fin);
        }
      }
      else {
        root.setRefreshLevel(getLevel(__record.hash));
        restore(__record.keys, target);
        root.addRefreshTask(this.__task = __fin);
      }
    }
    return this;
  }

  cancel() {
    frame.offFrame(this.cb);
    this.__cancelTask();
    if(this.__playState === 'idle') {
      return this;
    }
    this.__playState = 'idle';
    let { target } = this;
    let root = target.root;
    if(root) {
      let task = this.__task = () => {
        this.emit(Event.KARAS_ANIMATION_CANCEL);
      };
      root.addRefreshTask(task);
    }
    return this;
  }

  __cancelTask() {
    let { target, __task } = this;
    if(target.root && __task) {
      target.root.delRefreshTask(__task);
    }
  }

  __destroy() {
    frame.offFrame(this.cb);
    this.__cancelTask();
    this.__playState = 'idle';
    this.__isDestroyed = true;
  }

  get id() {
    return this.__id;
  }
  get target() {
    return this.__target;
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
    return this.__pending;
  }
  get offsetTime() {
    return this.__offsetTime;
  }
  get pauseTime() {
    return this.__pauseTime;
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
  get cb() {
    return this.__cb;
  }
  get isDestroyed() {
    return this.__isDestroyed;
  }
  get lastStyle() {
    return this.__lastStyle;
  }
}

export default Animation;
