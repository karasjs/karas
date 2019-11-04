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
  'paddingTop',
  'strokeWidth'
];

const COLOR_HASH = {};
KEY_COLOR.forEach(k => {
  COLOR_HASH[k] = true;
});

const LENGTH_HASH = {};
KEY_LENGTH.forEach(k => {
  LENGTH_HASH[k] = true;
});

// css模式rgb和init的颜色转换为rgba数组，方便加减运算
function color2array(style) {
  KEY_COLOR.forEach(k => {
    if(!style.hasOwnProperty(k)) {
      return;
    }
    style[k] = util.rgb2int(style[k]);
  });
}

// 反向将颜色数组转换为css模式，同时计算target及其孩子的computedStyle
function stringify(style, target) {
  let animateStyle = target.animateStyle;
  KEY_COLOR.forEach(k => {
    if(style.hasOwnProperty(k)) {
      let v = style[k];
      if(v[3] === 1) {
        style[k] = `rgb(${v[0]},${v[1]},${v[2]})`;
      } else {
        style[k] = `rgba(${v[0]},${v[1]},${v[2]},${v[3]})`;
      }
    }
  });
  for(let i in style) {
    if(style.hasOwnProperty(i)) {
      animateStyle[i] = style[i];
    }
  }
  target.__needCompute = true;
}

// 将变化写的样式格式化，提取出offset属性，提取出变化的key，初始化变化过程的存储
function framing(current) {
  let keys = [];
  let st = {};
  for(let i in current) {
    if(current.hasOwnProperty(i) && i !== 'offset') {
      keys.push(i);
      st[i] = current[i];
    }
  }
  return {
    style: st,
    offset: current.offset,
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
    let p = prev[k];
    let n = next[k];
    if(p.unit === n.unit) {
      res.v = n.value - p.value;
    }
    else if(p.unit === unit.PX && n.unit === unit.PERCENT) {}
    else if(p.unit === unit.PERCENT && n.unit === unit.PX) {}
    else {
      return;
    }
  }
  else {
    return;
  }
  return res;
}

function calFrame(prev, current, target) {
  let next = framing(current);
  next.keys.forEach(k => {
    let ts = calDiff(prev.style, next.style, k, target);
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
    // color可能超限[0,255]，但浏览器已经做了限制，无需关心
    else if(COLOR_HASH.hasOwnProperty(k)) {
      let item = style[k];
      item[0] += v[0] * percent;
      item[1] += v[1] * percent;
      item[2] += v[2] * percent;
      item[3] += v[3] * percent;
    }
    else if(LENGTH_HASH.hasOwnProperty(k)) {
      style[k].value += v * percent;
    }
  });
  return style;
}

class Animation extends Event {
  constructor(target, list, options) {
    super();
    this.__target = target;
    this.__list = list || [];
    if(util.isNumber(options)) {
      this.__options = {
        duration: options,
      };
    }
    this.__options = options || {};
    this.__frames = [];
    this.__startTime = 0;
    this.__offsetTime = 0;
    this.__pauseTime = 0;
    this.__pending = false;
    this.__playState = 'idle';
    this.__cb = null;
    this.__init();
  }

  __init() {
    let { target } = this;
    let style = util.clone(target.style);
    // 没设置时间或非法时间或0，动画过程为空无需执行
    let duration = parseFloat(this.options.duration);
    if(isNaN(duration) || duration <= 0) {
      return;
    }
    target.__animateStyle = util.clone(style);
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
          css.normalize(current, true);
          color2array(current);
        }
      }
      else {
        css.normalize(current, true);
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
    let frames = this.frames;
    let length = list.length;
    let prev;
    // 第一帧要特殊处理
    prev = framing(first);
    frames.push(prev);
    for(let i = 1; i < length; i++) {
      let next = list[i];
      prev = calFrame(prev, next, target);
      frames.push(prev);
    }
  }

  play() {
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
      let { duration, fill } = this.options;
      let { frames, target } = this;
      let length = frames.length;
      let first = true;
      this.__cb = () => {
        let now = inject.now();
        if(first) {
          this.__startTime = now;
          frames.forEach(frame => {
            frame.time = now + duration * frame.offset;
          });
          first = false;
        }
        let i = binarySearch(0, frames.length - 1,now + this.offsetTime, frames);
        let current = frames[i];
        // 最后一帧结束动画
        if(i === length - 1) {
          stringify(current.style, target);
          frame.offFrame(this.cb);
        }
        // 否则根据目前到下一帧的时间差，计算百分比，再反馈到变化数值上
        else {
          let total = frames[i + 1].time - current.time;
          let diff = now - current.time;
          let percent = diff / total;
          let style = calStyle(current, percent);
          stringify(style, target);
        }
        let root = target.root;
        if(root) {
          // 可能涉及字号变化，引发布局变更重新测量
          // target.__computed();
          let task = this.__task = () => {
            this.emit(Event.KARAS_ANIMATION_FRAME);
            if(i === length - 1) {
              this.__playState = 'finished';
              // 停留在最后一帧，触发finish
              if(['forwards', 'both'].indexOf(fill) > -1) {
                this.emit(Event.KARAS_ANIMATION_FINISH);
              }
              // 恢复初始，再刷新一帧，触发finish
              else {
                target.__needCompute = true;
                // target.__computed();
                let task = this.__task = () => {
                  // this.__playState = 'finished';
                  this.emit(Event.KARAS_ANIMATION_FINISH);
                };
                root.refreshTask(task);
              }
            }
          };
          root.refreshTask(task);
        }
      };
    }
    // 先执行，本次执行调用refreshTask也是下一帧再渲染，frame的每帧则是下一帧的下一帧
    this.cb();
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
    let { fill } = this.options;
    frame.offFrame(this.cb);
    this.__cancelTask();
    let { target } = this;
    let root = target.root;
    if(root) {
      // 停留在最后一帧
      if(['forwards', 'both'].indexOf(fill) > -1) {
        let last = this.frames[this.frames.length - 1];
        stringify(last.style, this.target);
        // target.__computed();
        // this.__playState = 'finished';
      }
      // else {
      //   target.__needCompute = true;
      //   this.__playState = 'finished';
      //   // target.__computed();
      // }
      this.__playState = 'finished';
      target.__needCompute = true;
      let task = this.__task = () => {
        this.emit(Event.KARAS_ANIMATION_FINISH);
      };
      root.refreshTask(task);
    }
    return this;
  }

  cancel() {
    frame.offFrame(this.cb);
    this.__cancelTask();
    this.__playState = 'idle';
    let { target } = this;
    let root = target.root;
    if(root) {
      target.__needCompute = true;
      // target.__computed();
      let task = this.__task = () => {
        this.emit(Event.KARAS_ANIMATION_CANCEL);
      };
      root.refreshTask(task);
    }
    return this;
  }

  __cancelTask() {
    if(this.__task && this.target.root) {
      this.target.root.cancelRefreshTask(this.__task);
    }
  }

  __destroy() {
    frame.offFrame(this.cb);
    this.__cancelTask();
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
  get frames() {
    return this.__frames;
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
  get cb() {
    return this.__cb;
  }
}

export default Animation;
