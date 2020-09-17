import css from '../style/css';
import unit from '../style/unit';
import tf from '../style/transform';
import util from '../util/util';
import Event from '../util/Event';
import frame from './frame';
import easing from './easing';
import level from './level';
import repaint from './repaint';
import invalid from './invalid';
import key from './key';

const { AUTO, PX, PERCENT, INHERIT, RGBA, STRING, NUMBER } = unit;
const { isNil, isFunction, isNumber, isObject, clone, equalArr } = util;
const { linear } = easing;

const {
  COLOR_HASH,
  LENGTH_HASH,
  RADIUS_HASH,
  GRADIENT_HASH,
  EXPAND_HASH,
  GRADIENT_TYPE,
} = key;

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
  // 添补没有声明完全的关键帧属性为节点当前值
  frames.forEach(item => {
    let style = item.style;
    keys.forEach(k => {
      if(!style.hasOwnProperty(k) || isNil(style[k])) {
        if(repaint.GEOM.hasOwnProperty(k)) {
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

// 每次播放时处理继承值，以及转换transform为单matrix矩阵
function inherit(frames, keys, target) {
  let computedStyle = target.computedStyle;
  frames.forEach(item => {
    let style = item.style;
    keys.forEach(k => {
      let v = style[k];
      // geom的属性可能在帧中没有
      if(isNil(v)) {
        return;
      }
      if(k === 'transform') {
        let ow = target.outerWidth;
        let oh = target.outerHeight;
        let m = tf.calMatrix(v, ow, oh);
        style[k] = [['matrix', m]];
      }
      else if(v.unit === INHERIT) {
        if(k === 'color') {
          style[k] = {
            value: util.rgba2int(computedStyle[k]),
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
}

// 计算是否需要刷新和刷新等级，新样式和之前样式对比
function calRefresh(frameStyle, lastStyle, keys, target) {
  let res = false;
  let lv = level.REPAINT;
  for(let i = 0, len = keys.length; i < len; i++) {
    let k = keys[i];
    // 无需刷新的
    if(invalid.hasOwnProperty(k)) {
      continue;
    }
    let n = frameStyle[k];
    let p = lastStyle[k];
    // 前后均非空对比
    if(!isNil(n) && !isNil(p)) {
      if(!css.equalStyle(k, n, p, target)) {
        res = true;
        // 不相等且刷新等级是重新布局时可以提前跳出
        if(lv === level.REPAINT) {
          if(!repaint.isRepaint(k)) {
            lv = level.REFLOW;
            break;
          }
        }
        else {
          break;
        }
      }
    }
    // 有一个为空时即不等
    else if(!isNil(n) || !isNil(p)) {
      res = true;
      if(!repaint.isRepaint(k)) {
        lv = level.REFLOW;
        break;
      }
    }
  }
  return [res, lv];
}

// 将当前frame的style赋值给动画style，xom绘制时获取
function genBeforeRefresh(frameStyle, animation, root, lv) {
  root.setRefreshLevel(lv);
  // frame每帧回调时，下方先执行计算好变更的样式，这里特殊插入一个hook，让root增加一个刷新操作
  // 多个动画调用因为相同root也只会插入一个，这样在所有动画执行完毕后frame里检查同步进行刷新，解决单异步问题
  root.__frameHook();
  assignStyle(frameStyle, animation);
  animation.__style = frameStyle;
  animation.__assigning = true;
}

function assignStyle(style, animation) {
  let target = animation.target;
  let hasZ;
  animation.keys.forEach(i => {
    if(i === 'zIndex') {
      hasZ = true;
    }
    // 结束还原时样式为空，需填上默认样式
    let v = style.hasOwnProperty(i) ? style[i] : target.style[i];
    // geom的属性变化
    if(repaint.GEOM.hasOwnProperty(i)) {
      target.currentProps[i] = v;
      target.__cacheProps[i] = undefined;
    }
    // 样式
    else {
      // 将动画样式直接赋给currentStyle
      target.currentStyle[i] = v;
      target.__cacheStyle[i] = undefined;
    }
  });
  target.__cacheSvg = false;
  // 有zIndex时，svg父级开始到叶子节点取消cache，因为dom节点顺序可能发生变化，不能直接忽略
  if(hasZ && /svg/i.test(target.root.tagName)) {
    target.__cancelCacheSvg();
  }
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
  return {
    style,
    time: offset * duration,
    easing: easing || es,
    transition: [],
  };
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
  let res = {
    k,
  };
  let p = prev[k];
  let n = next[k];
  if(k === 'transform') {
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
    res.v = [
      nm[0] - pm[0],
      nm[1] - pm[1],
      nm[2] - pm[2],
      nm[3] - pm[3],
      nm[4] - pm[4],
      nm[5] - pm[5],
    ];
    return res;
  }
  else if(k === 'filter') {
    // 目前只有1个blur，可以简单处理
    if(!p || !p.length) {
      res.v = n[0][1];
    }
    else if(!n || !n.length) {
      res.v = -p[0][1];
    }
    else {
      res.v = n[0][1] - p[0][1];
    }
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
        let v = ni.value * 100 / target[i ? 'outerHeight' : 'outerWidth'];
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
      let v = n.value * 100 / target[k === 'backgroundPositionX' ? 'innerWidth' : 'innerHeight'];
      v = v - p.value;
      if(v === 0) {
        return;
      }
      res.v = v;
    }
  }
  else if(k === 'boxShadow') {
    res.v = [];
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
      res.v.push(v);
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
      let v = n.value * 100 / target[/\w+X$/.test(k) ? 'outerWidth' : 'outerHeight'];
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
        let v = ni.value * 100 / target[i ? 'innerWidth' : 'innerHeight'];
        res.v.push(v - pi.value);
      }
      else {
        return;
      }
    }
    if(equalArr(res.v, [0, 0])) {
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
            t.push(b[1].value * innerWidth * 0.01 - a[1].value);
          }
          else if(a[1].unit === PERCENT && b[1].unit === PX) {
            t.push(b[1].value * 100 / innerWidth - a[1].value);
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
      // 径向渐变的位置
      else {
        res.p = [];
        for(let i = 0; i < 2; i++) {
          let pp = p.p[i];
          let np = n.p[i];
          if(pp.unit === np.unit) {
            res.p.push(np.value - pp.value);
          }
          else if(pp.unit === PX && np.unit === PERCENT) {
            let v = np.value * 0.01 * target[i ? 'innerWidth' : 'innerHeight'];
            res.p.push(v - pp.value);
          }
          else if(pp.unit === PERCENT && np.unit === PX) {
            let v = np.value * 100 / target[i ? 'innerWidth' : 'innerHeight'];
            res.p.push(v - pp.value);
          }
        }
        if(eq && equalArr(res.p, [0, 0])) {
          return;
        }
      }
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
    n = n.value;
    p = p.value;
    if(equalArr(n, p) || n[3] === 0 && p[3] === 0) {
      return;
    }
    res.v = [
      n[0] - p[0],
      n[1] - p[1],
      n[2] - p[2],
      n[3] - p[3]
    ];
  }
  else if(RADIUS_HASH.hasOwnProperty(k)) {
    // x/y都相等无需
    if(n[0].value === p[0].value && n[0].unit === p[0].unit
      && n[1].value === p[1].value && n[1].unit === p[1].unit) {
      return;
    }
    res.v = [];
    for(let i = 0; i < 2; i++) {
      if(n[i].unit === p[i].unit) {
        res.v.push(n[i].value - p[i].value);
      }
      else if(p[i].unit === PX && n[i].unit === PERCENT) {
        res.v.push(n[i].value * 0.01 * target[i ? 'outerHeight' : 'outerWidth'] - p[i].value);
      }
      else if(p[i].unit === PERCENT && n[i].unit === PX) {
        res.v.push(n[i].value * 100 / target[i ? 'outerHeight' : 'outerWidth'] - p[i].value);
      }
      else {
        res.v.push(0);
      }
    }
  }
  else if(LENGTH_HASH.hasOwnProperty(k)) {
    // auto不做动画
    if(p.unit === AUTO || n.unit === AUTO) {
      return;
    }
    let computedStyle = target.computedStyle;
    let parentComputedStyle = (target.parent || target).computedStyle;
    let diff = 0;
    if(p.unit === n.unit) {
      diff = n.value - p.value;
    }
    // 长度单位变化特殊计算，根据父元素computedStyle
    else if(p.unit === PX && n.unit === PERCENT) {
      let v;
      if(k === 'fontSize') {
        v = n.value * parentComputedStyle[k] * 0.01;
      }
      else if(k === 'flexBasis' && computedStyle.flexDirection === 'row' || k === 'width'
        || /margin/.test(k) || /padding/.test(k)
        || ['left', 'right'].indexOf(k) > -1) {
        v = n.value * parentComputedStyle.width * 0.01;
      }
      else if(k === 'flexBasis' || k === 'height' || ['top', 'bottom'].indexOf(k) > -1) {
        v = n.value * parentComputedStyle.height * 0.01;
      }
      diff = v - p.value;
    }
    else if(p.unit === PERCENT && n.unit === PX) {
      let v;
      if(k === 'fontSize') {
        v = n.value * 100 / parentComputedStyle[k];
      }
      else if(k === 'flexBasis' && computedStyle.flexDirection === 'row' || k === 'width'
        || /margin/.test(k) || /padding/.test(k)
        || ['left', 'right'].indexOf(k) > -1) {
        v = n.value * 100 / parentComputedStyle.width;
      }
      else if(k === 'flexBasis' || k === 'height' || ['top', 'bottom'].indexOf(k) > -1) {
        v = n.value * 100 / parentComputedStyle.height;
      }
      diff = v - p.value;
    }
    // lineHeight奇怪的单位变化
    else if(k === 'lineHeight') {
      if(p.unit === PX && n.unit === NUMBER) {
        diff = n.value * computedStyle.fontSize - p.value;
      }
      else if(p.unit === NUMBER && n.unit === PX) {
        diff = n.value / computedStyle.fontSize - p.value;
      }
    }
    // 兜底NaN非法
    if(diff === 0 || isNaN(diff)) {
      return;
    }
    res.v = diff;
  }
  else if(repaint.GEOM.hasOwnProperty(k)) {
    if(isNil(p)) {
      return;
    }
    // 特殊处理multi
    else if(target.isMulti) {
      if(k === 'points' || k === 'controls') {
        if(isNil(n) || isNil(p) || equalArr(p, n)) {
          return;
        }
        res.v = [];
        for(let i = 0, len = Math.min(p.length, n.length); i < len; i++) {
          let pv = p[i];
          let nv = n[i];
          if(isNil(pv) || isNil(nv)) {
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
        if(isNil(n) || isNil(p) || equalArr(p, n)) {
          return;
        }
        res.v = [];
        for(let i = 0, len = Math.min(p.length, n.length); i < len; i++) {
          let pv = p[i];
          let nv = n[i];
          if(isNil(pv) || isNil(nv)) {
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
        res.v = v;
      }
    }
    // 非multi特殊处理这几类数组类型数据
    else if(k === 'points' || k === 'controls') {
      if(isNil(n) || isNil(p) || equalArr(p, n)) {
        return;
      }
      res.v = [];
      for(let i = 0, len = Math.min(p.length, n.length); i < len; i++) {
        let pv = p[i];
        let nv = n[i];
        if(isNil(pv) || isNil(nv)) {
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
      if(isNil(n) || isNil(p) || equalArr(p, n)) {
        return;
      }
      res.v = [
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
        res.v = n - p;
      }
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
    return;
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

function getEasing(ea) {
  let timingFunction;
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
    timingFunction = easing[ea] || linear;
  }
  return timingFunction;
}

/**
 * 根据百分比和缓动函数计算中间态样式
 * 当easing定义为steps时，优先计算
 * @param frame 当前帧
 * @param percent 到下一帧时间的百分比
 * @param target vd
 * @returns {*}
 */
function calIntermediateStyle(frame, percent, target) {
  let style = clone(frame.style);
  let timingFunction = getEasing(frame.easing);
  if(timingFunction !== linear) {
    percent = timingFunction(percent);
  }
  frame.transition.forEach(item => {
    let { k, v, d, p } = item;
    let st = style[k];
    // transform特殊处理，只有1个matrix，有可能不存在，需给默认矩阵
    if(k === 'transform') {
      if(!st) {
        st = style[k] = [['matrix', [1, 0, 0, 1, 0, 0]]];
      }
      for(let i = 0; i < 6; i++) {
        st[0][1][i] += v[i] * percent;
      }
    }
    else if(k === 'filter') {
      // 只有1个样式声明了filter另外一个为空
      if(!st) {
        st = style[k] = [['blur', 0]];
      }
      st[0][1] += v * percent;
    }
    else if(RADIUS_HASH.hasOwnProperty(k)) {
      for(let i = 0; i < 2; i++) {
        st[i].value += v[i] * percent;
      }
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
    else if(k === 'boxShadow') {
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
            a[1].value += b[1] * percent;
          }
        }
        if(st.k === 'linear' && st.d !== undefined && d !== undefined) {
          st.d += d * percent;
        }
        if(st.k === 'radial' && st.p !== undefined && p !== undefined) {
          st.p[0].value += p[0] * percent;
          st.p[1].value += p[1] * percent;
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
      st = st.value;
      st[0] += v[0] * percent;
      st[1] += v[1] * percent;
      st[2] += v[2] * percent;
      st[3] += v[3] * percent;
    }
    else if(repaint.GEOM.hasOwnProperty(k)) {
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
    else if(k === 'opacity' || k === 'zIndex') {
      style[k] += v * percent;
    }
  });
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

class Animation extends Event {
  constructor(target, list, options) {
    super();
    this.__id = uuid++;
    this.__target = target;
    list = clone(list || []);
    if(Array.isArray(list)) {
      this.__list = list.filter(item => item && isObject(item));
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
      this.__list = nl;
    }
    else {
      this.__list = [];
    }
    if(isNumber(options)) {
      this.__options = {
        duration: options,
      };
      options = this.__options;
    }
    let op = this.__options = options || {};
    this.__duration = Math.max(0, parseFloat(op.duration) || 0);
    this.delay = op.delay;
    this.endDelay = op.endDelay;
    this.iterations = op.iterations;
    this.fps = op.fps;
    this.fill = op.fill;
    this.direction = op.direction;
    this.playbackRate = op.playbackRate;
    this.__easing = op.easing;
    this.playCount = 0;
    this.spfLimit = op.spfLimit; // 定帧功能，不跳帧，每帧时间限制为最大spf
    this.__frames = []; // 每帧数据
    this.__framesR = []; // 存储反向播放的数据
    this.__startTime = null;
    this.currentTime = 0; // 当前播放时间点，不包括暂停时长，但包括delay、变速，以此定位动画处于何时
    this.__nextTime = 0; // 下一帧刷新时间点，即currentTime下一帧被此赋值
    this.__fpsTime = 0;
    this.__playState = 'idle';
    this.__isDestroyed = false;
    this.__style = {};
    this.__assigning = false; // 本帧动画是否正在影响赋值style，即在事件的before之后after之前
    this.__init();
  }

  __init() {
    let { iterations, duration, list, easing, target } = this;
    // 执行次数小于1无需播放
    if(iterations < 1 || list.length < 1) {
      return;
    }
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
        }
        // <=前面的
        else if(current.offset <= offset) {
          list.splice(i, 1);
          i--;
          len--;
        }
      }
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
    this.__frames = frames;
    // 为方便两帧之间计算变化，强制统一所有帧的css属性相同，没有写的为节点的默认样式
    let keys = this.__keys = unify(frames, target);
    inherit(frames, keys, target);
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
      item.time = duration - item.time;
      item.transition = [];
    });
    prev = framesR[0];
    for(let i = 1; i < length; i++) {
      let next = framesR[i];
      prev = calFrame(prev, next, keys, target);
    }
    this.__framesR = framesR;
    // finish/cancel共有的before处理
    this.__clean = (isFinish) => {
      this.__cancelTask();
      this.__nextTime = 0;
      let restore;
      let style = this.style;
      if(isFinish) {
        this.__currentTime = this.delay + duration + this.endDelay;
        this.__playCount = iterations;
        this.__playState = 'finished';
        // cancel需要清除finish根据情况保留
        if(!this.__stayEnd()) {
          this.__style = {};
          restore = true;
        }
      }
      else {
        this.__playCount = this.__currentTime = 0;
        this.__playState = 'idle';
        this.__style = {};
        restore = true;
      }
      // 动画取消结束不停留在最后一帧需要还原target原本的样式，需要对比目前是否是由本动画赋值的
      if(restore) {
        keys.forEach(k => {
          if(repaint.GEOM.hasOwnProperty(k)) {
            if(target.__currentProps[k] === style[k]) {
              target.__currentProps[k] = target.props[k];
            }
          }
          else {
            if(target.__currentStyle[k] === style[k]) {
              target.__currentStyle[k] = target.style[k];
            }
          }
          target.__cacheSvg = false;
        });
      }
    };
    // 生成finish的任务事件
    this.__fin = (cb, diff) => {
      this.__begin = this.__end = this.__isDelay = this.__finish = this.__inFps = this.__enterFrame = null;
      this.emit(Event.FINISH);
      if(isFunction(cb)) {
        cb(diff);
      }
    };
    // 同步执行，用在finish()这种主动调用
    this.__frameCb = (diff, isDelay) => {
      this.emit(Event.FRAME, diff, isDelay);
      if(this.__firstPlay) {
        this.__firstPlay = false;
        this.emit(Event.PLAY);
      }
      if(isFunction(this.__playCb)) {
        this.__playCb(diff, isDelay);
        this.__playCb = null;
      }
    };
  }

  __calDiffTime(diff) {
    let { playbackRate, spfLimit, fps } = this;
    this.__currentTime = this.__nextTime;
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
    this.__nextTime += diff;
    return this.__currentTime;
  }

  play(cb) {
    let { isDestroyed, duration, playState, __frameCb, list } = this;
    if(isDestroyed || duration <= 0 || list.length < 1) {
      return this;
    }
    if(playState === 'running') {
      return this;
    }
    this.__cancelTask();
    this.__playCb = cb;
    this.__playState = 'running';
    // 每次play调用标识第一次运行，需响应play事件和回调
    this.__firstPlay = true;
    let firstEnter = true;
    // 只有第一次调用会进初始化，另外finish/cancel视为销毁也会重新初始化
    if(!this.__enterFrame) {
      let {
        frames,
        framesR,
        direction,
        delay,
        endDelay,
        keys,
        __clean,
        __fin,
        target,
      } = this;
      // delay/endDelay/fill/direction在播放后就不可变更，没播放可以修改
      let stayEnd = this.__stayEnd();
      let stayBegin = this.__stayBegin();
      // 每次正常调用play都会从头开始，标识第一次enterFrame运行初始化
      this.__currentTime = this.__nextTime = this.__fpsTime = 0;
      // 再计算两帧之间的变化，存入transition属性
      let length = frames.length;
      // 每帧执行的回调，firstEnter只有初次计算时有，第一帧强制不跳帧
      let enterFrame = this.__enterFrame = {
        before: diff => {
          let { root, style, fps, playCount, iterations } = this;
          if(!root) {
            return;
          }
          // 用本帧和上帧时间差，计算累加运行时间currentTime，以便定位当前应该处于哪个时刻
          let currentTime = this.__calDiffTime(diff);
          // 增加的fps功能，当<60时计算跳帧，每帧运行依旧累加时间，达到fps时重置，第一帧强制不跳
          if(!firstEnter && fps < 60) {
            diff = this.__fpsTime += diff;
            if(diff < 1000 / fps) {
              this.__inFps = true;
              return;
            }
            this.__fpsTime = 0;
          }
          firstEnter = false;
          // delay仅第一次生效
          if(playCount > 0) {
            delay = 0;
          }
          let needRefresh, lv;
          // 还没过前置delay
          if(currentTime < delay) {
            if(stayBegin) {
              let current = frames[0].style;
              // 对比第一帧，以及和第一帧同key的当前样式
              [needRefresh, lv] = calRefresh(current, style, keys, target);
              if(needRefresh) {
                genBeforeRefresh(current, this, root, lv);
              }
            }
            // 即便不刷新，依旧执行begin和帧回调
            if(currentTime === 0) {
              this.__begin = true;
            }
            this.__isDelay = true;
            return;
          }
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
          // 减去delay，计算在哪一帧
          currentTime -= delay;
          if(currentTime === 0) {
            this.__begin = true;
          }
          let i = binarySearch(0, length - 1, currentTime, currentFrames);
          let current = currentFrames[i];
          // 最后一帧结束动画
          let isLastFrame = i === length - 1;
          let isLastCount = playCount >= iterations - 1;
          let inEndDelay;
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
              current = current.style;
            }
            // 不停留或超过endDelay则计算还原，有endDelay且fill模式不停留会再次进入这里
            else {
              current = {};
            }
            [needRefresh, lv] = calRefresh(current, style, keys, target);
            // 非尾每轮次放完增加次数和计算下轮准备
            if(!isLastCount) {
              this.__nextTime = currentTime - duration;
              playCount = ++this.__playCount;
              this.__nextBegin = true;
            }
            // 尾次考虑endDelay
            else if(!inEndDelay) {
              this.__nextTime = 0;
              playCount = ++this.__playCount;
              // 判断次数结束每帧enterFrame调用，inEndDelay时不结束
              if(playCount >= iterations) {
                frame.offFrame(enterFrame);
              }
            }
          }
          // 否则根据目前到下一帧的时间差，计算百分比，再反馈到变化数值上
          else {
            let total = currentFrames[i + 1].time - current.time;
            let percent = (currentTime - current.time) / total;
            current = calIntermediateStyle(current, percent, target);
            [needRefresh, lv] = calRefresh(current, style, keys, target);
          }
          // 两帧之间没有变化，不触发刷新仅触发frame事件，有变化生成计算结果赋给style
          if(needRefresh) {
            genBeforeRefresh(current, this, root, lv);
          }
          // 每次循环完触发end事件，最后一次循环触发finish
          if(isLastFrame && (!inEndDelay || isLastCount)) {
            this.__end = true;
            if(playCount >= iterations) {
              this.__finish = true;
              __clean(true);
            }
          }
        },
        after: diff => {
          this.__assigning = false;
          if(this.__inFps) {
            this.__inFps = false;
            return;
          }
          __frameCb(diff, this.__isDelay);
          this.__isDelay = false;
          if(this.__begin) {
            this.__begin = false;
            this.emit(Event.BEGIN, this.playCount);
          }
          if(this.__end) {
            this.__end = false;
            this.emit(Event.END, this.playCount - 1);
          }
          if(this.__finish) {
            this.__finish = false;
            __fin();
          }
          if(this.__nextBegin) {
            this.__nextBegin = false;
            this.__begin = true;
          }
        },
      };
    }
    // 添加每帧回调且立刻执行，本次执行调用refreshTask也是下一帧再渲染，frame的每帧都是下一帧
    frame.onFrame(this.__enterFrame);
    this.__startTime = frame.__now;
    return this;
  }

  pause() {
    let { isDestroyed, duration, pending } = this;
    if(isDestroyed || duration <= 0 || pending) {
      return this;
    }
    this.__playState = 'paused';
    this.__cancelTask();
    this.emit(Event.PAUSE);
    return this;
  }

  resume(cb) {
    let { isDestroyed, duration, playState } = this;
    if(isDestroyed || duration <= 0 || playState !== 'paused') {
      return this;
    }
    return this.play(cb);
  }

  finish(cb) {
    let { isDestroyed, duration, playState, list } = this;
    if(isDestroyed || duration <= 0 || list.length < 1 || playState === 'finished' || playState === 'idle') {
      return this;
    }
    // 先清除所有回调任务，多次调用finish也会清除只留最后一次
    this.__cancelTask();
    let { root, style, keys, frames, __frameCb, __clean, __fin, target } = this;
    if(root) {
      let needRefresh, lv, current;
      // 停留在最后一帧
      if(this.__stayEnd()) {
        current = frames[frames.length - 1].style;
        [needRefresh, lv] = calRefresh(current, style, keys, target);
      }
      else {
        current = {};
        [needRefresh, lv] = calRefresh(current, style, keys, target);
      }
      if(needRefresh) {
        frame.nextFrame(this.__enterFrame = {
          before: () => {
            genBeforeRefresh(current, this, root, lv);
            __clean(true);
          },
          after: diff => {
            this.__assigning = false;
            __frameCb(diff);
            __fin(cb, diff);
          },
        });
      }
      // 无刷新同步进行
      else {
        __clean(true);
        __fin(cb, 0);
      }
    }
    return this;
  }

  cancel(cb) {
    let { isDestroyed, duration, playState, list } = this;
    if(isDestroyed || duration <= 0 || playState === 'idle' || list.length < 1) {
      return this;
    }
    this.__cancelTask();
    let { root, style, keys, __frameCb, __clean, target } = this;
    if(root) {
      let [needRefresh, lv] = calRefresh({}, style, keys, target);
      let task = (diff) => {
        this.__cancelTask();
        this.__begin = this.__end = this.__isDelay = this.__finish = this.__inFps = this.__enterFrame = null;
        this.emit(Event.CANCEL);
        if(isFunction(cb)) {
          cb(diff);
        }
      };
      if(needRefresh) {
        frame.nextFrame(this.__enterFrame = {
          before: () => {
            genBeforeRefresh({}, this, root, lv);
            __clean();
          },
          after: diff => {
            this.__assigning = false;
            __frameCb(diff);
            task(diff);
          },
        });
      }
      // 无刷新同步进行
      else {
        __clean();
        task(0);
      }
    }
    return this;
  }

  gotoAndPlay(v, options, cb) {
    let { isDestroyed, duration, delay, endDelay } = this;
    if(isDestroyed || duration <= 0) {
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
    let { isDestroyed, duration, delay, endDelay } = this;
    if(isDestroyed || duration <= 0) {
      return this;
    }
    [options, cb] = gotoOverload(options, cb);
    v = this.__goto(v, options.isFrame, options.excludeDelay);
    if(v > duration + delay + endDelay) {
      return this.finish(cb);
    }
    // 先play一帧，回调里模拟暂停
    return this.play(diff => {
      this.__playState = 'paused';
      this.__cancelTask();
      if(isFunction(cb)) {
        cb(diff);
      }
    });
  }

  assignCurrentStyle() {
    assignStyle(this.style, this);
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
    this.__nextTime = v;
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

  __cancelTask() {
    frame.offFrame(this.__enterFrame);
    this.__playCb = null;
  }

  __destroy(sync) {
    let self = this;
    self.removeControl();
    // clean异步执行，因为里面的样式还原需要等到下一帧，否则同步执行清除后，紧接着的新同步动画获取不到currentStyle
    if(sync) {
      self.__clean && self.__clean();
      self.__target = null;
    }
    else {
      frame.nextFrame({
        before() {
          // 尚未初始化的清除
          self.__clean && self.__clean();
          self.__target = null;
        },
      });
    }
    self.__startTime = null;
    self.__isDestroyed = true;
  }

  get id() {
    return this.__id;
  }

  get target() {
    return this.__target;
  }

  get root() {
    return this.target.root;
  }

  get keys() {
    return this.__keys;
  }

  get style() {
    return this.__style;
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

  set duration(v) {
    this.__duration = Math.max(0, parseFloat(v) || 0);
  }

  get delay() {
    return this.__delay;
  }

  set delay(v) {
    this.__delay = Math.max(0, parseFloat(v) || 0);
  }

  get endDelay() {
    return this.__endDelay;
  }

  set endDelay(v) {
    this.__endDelay = Math.max(0, parseFloat(v) || 0);
  }

  get fps() {
    return this.__fps;
  }

  set fps(v) {
    v = parseInt(v) || 60;
    if(v <= 0) {
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
    this.__iterations = v;
  }

  get fill() {
    return this.__fill;
  }

  set fill(v) {
    this.__fill = v || 'none';
  }

  get direction() {
    return this.__direction;
  }

  set direction(v) {
    this.__direction = v || 'normal';
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
    this.__playbackRate = v;
  }

  get easing() {
    return this.__easing;
  }

  get startTime() {
    return this.__startTime;
  }

  get currentTime() {
    return this.__currentTime;
  }

  set currentTime(v) {
    v = parseFloat(v) || 0;
    if(v >= 0) {
      this.__currentTime = this.__nextTime = v;
    }
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
    this.__playCount = Math.max(0, parseInt(v) || 0);
  }

  get isDestroyed() {
    return this.__isDestroyed;
  }

  get animating() {
    let { playState } = this;
    if(playState === 'idle') {
      return false;
    }
    return playState !== 'finished' || this.__stayEnd();
  }

  get spfLimit() {
    return this.__spfLimit;
  }

  set spfLimit(v) {
    if(util.isNumber(v) || /^\d/.test(v)) {
      this.__spfLimit = Math.max(v, parseInt(v) || 0);
    }
    else {
      this.__spfLimit = !!v;
    }
  }

  get assigning() {
    return this.__assigning;
  }
}

export default Animation;
