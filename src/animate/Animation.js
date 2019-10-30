import css from '../style/css';
import unit from '../style/unit';
import util from '../util/util';
import inject from '../util/inject';
import Event from '../util/Event';
import frame from './frame';

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
  'paddingTop'
];

const COLOR_HASH = {};
KEY_COLOR.forEach(k => {
  COLOR_HASH[k] = true;
});

const LENGTH_HASH = {};
KEY_LENGTH.forEach(k => {
  LENGTH_HASH[k] = true;
});

function color2array(style) {
  KEY_COLOR.forEach(k => {
    if(!style.hasOwnProperty(k)) {
      return;
    }
    style[k] = util.rgb2int(style[k]);
  });
}

function length2px(style, xom) {
  KEY_LENGTH.forEach(k => {
    if(!style.hasOwnProperty(k)) {
      return;
    }
    let v = style[k];
    if(v.unit === unit.PX) {
      v = v.value;
    }
    else if(v.unit === unit.PERCENT) {
      if(k === 'flexBasis') {
        if(style.flexDirection === 'row') {
          v = xom.width * v.value * 0.01;
        }
        else {
          v = xom.height * v.value * 0.01;
        }
      }
      else if([
        'width',
        'marginTop',
        'marginRight',
        'marginLeft',
        'marginBottom',
        'paddingTop',
        'paddingRight',
        'paddingBottom',
        'paddingLeft',
        'left',
        'right'
      ].indexOf(k) > -1) {
        v = xom.width * v.value * 0.01;
      }
      else if(['height', 'top', 'bottom'].indexOf(k) > -1) {
        v = xom.height * v.value * 0.01;
      }
    }
    style[k] = v;
  });
  let transform = style.transform;
  if(transform) {
    transform.forEach(item => {
      let [k, v] = item;
      if(['translateX', 'translateY'].indexOf(k) > -1) {
        if(v.unit === unit.PX) {
          v = v.value;
        } else if(v.unit === unit.PERCENT) {
          v = (k === 'translateX' ? xom.width : xom.height) * v.value * 0.01;
        }
        item[1] = v;
      }
    });
  }
}

function structuring(style, xom) {
  color2array(style);
  length2px(style, xom);
}

function stringify(style) {
  KEY_COLOR.forEach(k => {
    let v = style[k];
    if(v[3] === 1) {
      style[k] = `rgb(${v[0]},${v[1]},${v[2]})`;
    }
    else {
      style[k] = `rgba(${v[0]},${v[1]},${v[2]},${v[3]})`;
    }
  });
  return style;
}

function framing(style, current) {
  let next = util.clone(style);
  let keys = [];
  for(let i in current) {
    if(current.hasOwnProperty(i) && i !== 'offset') {
      keys.push(i);
      next[i] = current[i];
    }
  }
  next = {
    style: next,
    offset: current.offset,
    keys,
    transition: [],
  };
  return next;
}

function calDiff(prev, next, k) {
  let res = {
    k,
  };
  if(k === 'transform') {
    // transform每项以[k,v]存在，新老可能每项不会都存在，顺序也未必一致，以next为准
    let exist = {};
    prev[k].forEach(item => {
      exist[item[0]] = item[1];
    });
    res.v = [];
    next[k].forEach(item => {
      let [k, v] = item;
      // 老的不存在的项默认为0
      let old = exist.hasOwnProperty(k) ? exist[k] : 0;
      res.v.push({
        k,
        v: v - old,
      });
    });
  }
  else if(COLOR_HASH.hasOwnProperty(k)) {
    let p = prev[k];
    let n = next[k];
    res.v = [
      n[0] - p[0],
      n[1] - p[1],
      n[2] - p[2],
      n[3] - p[3]
    ];
  }
  else if(LENGTH_HASH.hasOwnProperty(k)) {
    res.v = next[k] - prev[k];
  }
  else {
    return;
  }
  return res;
}

function calFrame(prev, current) {
  let next = framing(prev.style, current);
  next.keys.forEach(k => {
    let ts = calDiff(prev.style, next.style, k); console.log(ts);
    // 可以形成过渡的才会产生结果返回
    if(ts) {
      prev.transition.push(ts);
    }
  });
  return next;
}

function binarySearch(i, j, now, frames) {
  if(i === j) {
    let frame = frames[i];
    if(frame.time > now) {
      return i - 1;
    }
    return i;
  }
  else {
    let middle = i + (j - i) >> 1;
    let frame = frames[middle];
    if(frame.time === now) {
      return middle;
    }
    else if(frame.time > now) {
      return binarySearch(i, Math.max(middle - 1, i), now, frames);
    }
    else {
      return binarySearch(Math.min(middle + 1, j), j, now, frames);
    }
  }
}

function calStyle(frame, percent) {
  let style = util.clone(frame.style);
  frame.transition.forEach(item => {
    let { k, v } = item;
    if(k === 'transform') {
      let hash = {};
      v.forEach(item => {
        let { k, v } = item;
        hash[k] = v * percent;
      });
      let transform = style.transform;
      transform.forEach(item => {
        let [k] = item;
        item[1] += hash[k];
      });
    }
    else if(COLOR_HASH.hasOwnProperty(k)) {
      let item = style[k];
      item[0] += scopeColor(v[0] * percent);
      item[1] += scopeColor(v[1] * percent);
      item[2] += scopeColor(v[2] * percent);
      item[3] += scopeColor(v[3] * percent);
    }
    else if(LENGTH_HASH.hasOwnProperty(k)) {
      style[k] += v * percent;
    }
  });
  return style;
}

function scopeColor(v) {
  if(v > 255) {
    return 255;
  }
  else if(v < 0) {
    return 0;
  }
  return v;
}

class Animation extends Event {
  constructor(xom, list, option) {
    super();
    this.__xom = xom;
    this.__list = list || [];
    this.__option = option || {};
    this.__frames = [];
    this.__startTime = 0;
    this.__endTime = 0;
    this.__offsetTime = 0;
    this.__pauseTime = 0;
    this.__isPause = false;
    this.__lastFrame = 0;
    this.__forward = false;
    this.__cb = null;
    this.__init();
  }

  __init() {
    // 没设置时间或非法时间或0，动画过程为空无需执行
    let duration = parseFloat(this.option.duration);
    if(isNaN(duration) || duration <= 0) {
      return;
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
        // 正常的标准化样式
        else {
          offset = current.offset;
          css.normalize(current, true);
          structuring(current);
        }
      }
      else {
        css.normalize(current, true);
        structuring(current);
      }
    }
    if(!list.length) {
      return;
    }
    list[0].offset = list[0].offset || 0;
    if(list.length > 1) {
      let last = list[list.length - 1];
      last.offset = last.offset || 1;
    }
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
    // 转化style为计算后的绝对值结果
    let origin = util.clone(this.xom.computedStyle);
    structuring(origin, this.xom);
    // 换算出60fps中每一帧，为防止空间过大，不存储每一帧的数据，只存储关键帧和增量
    let frames = this.frames;
    let length = list.length;
    let first = list[0];
    let last = list[length - 1];
    let prev;
    let i = 0;
    // 第一帧要特殊处理，根据offset决定直接应用还是做过渡效果
    if(first.offset === 0) {
      prev = framing(origin, first);
      frames.push(prev);
      i = 1;
    }
    else {
      prev = framing(origin, { offset: 0 });
      frames.push(prev);
    }
    for(; i < length; i++) {
      let next = list[i];
      prev = calFrame(prev, next);
      frames.push(prev);
    }
    // 最后一帧同第一帧特殊处理
    if(last.offset !== 1) {
      let next = framing(origin, { offset: 1 });
      prev = calFrame(prev, next);
      frames.push(prev);
    }
  }

  play() {
    // 从头播放还是暂停继续
    if(this.isPause) {
      let now = inject.now();
      let diff = now - this.pauseTime;
      // 在没有performance时，防止乱改系统时间导致偏移向前，但不能防止改时间导致的偏移向后
      diff = Math.max(diff, 0);
      this.__offsetTime = diff;
    }
    else {
      let duration = this.option.duration;
      let frames = this.frames;
      let length = frames.length;
      let first = true;
      this.__cb = () => {
        let now = inject.now();
        // 下一帧才开始播放动画
        if(first) {
          frames.forEach(frame => {
            frame.time = now + duration * frame.offset;
          });
        }
        first = false;
        let i = binarySearch(0, frames.length - 1,now + this.offsetTime, frames);
        let current = frames[i];
        // 最后一帧结束动画
        if(i === length - 1) {
          this.xom.__animateStyle(stringify(current.style));
          frame.offFrame(this.cb);
        }
        // 否则根据目前到下一帧的时间差，计算百分比，再反馈到变化数值上
        else {
          let total = frames[i + 1].time - current.time;
          let diff = now - current.time;
          let percent = diff / total;
          let style = calStyle(current, percent);
          this.xom.__animateStyle(stringify(style));
        }
        let root = this.xom.root;
        if(root) {
          root.refresh();
        }
      };
    }
    frame.onFrame(this.cb);
    this.__isPause = false;
    return this;
  }

  pause() {
    this.__isPause = true;
    this.__pauseTime = inject.now();
    frame.offFrame(this.cb);
    return this;
  }

  finish() {
    return this.cancel();
  }

  cancel() {
    this.xom.__style = this.xom.__styleBack;
    this.xom.root.refreshTask();
    return this;
  }

  get xom() {
    return this.__xom;
  }
  get list() {
    return this.__list;
  }
  get option() {
    return this.__option;
  }
  get frames() {
    return this.__frames;
  }
  get startTime() {
    return this.__startTime;
  }
  get endTime() {
    return this.__endTime;
  }
  get isPause() {
    return this.__isPause;
  }
  get offsetTime() {
    return this.__offsetTime;
  }
  get pauseTime() {
    return this.__pauseTime;
  }
  get lastFrame() {
    return this.__lastFrame;
  }
  get forward() {
    return this.__forward;
  }
  get cb() {
    return this.__cb;
  }
}

export default Animation;
