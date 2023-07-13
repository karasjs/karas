import util from '../util/util';
import frame from './frame';

const { isFunction, isNil } = util;

class Controller {
  constructor() {
    this.__records = []; // 默认记录和自动记录
    this.__records2 = []; // 非自动播放的动画记录
    this.__list = [] // 默认初始化播放列表，自动播放也存这里
    this.__list2 = []; // json中autoPlay为false的初始化存入这里
    this.__onList = []; // list中已存在的侦听事件，list2初始化时也需要增加上
    this.__lastTime = {}; // 每个类型的上次触发时间，防止重复emit
  }

  add(v, list = this.__list) {
    if(list.indexOf(v) === -1) {
      list.push(v);
    }
  }

  remove(v) {
    let i = this.__list.indexOf(v);
    if(i > -1) {
      this.__list.splice(i, 1);
    }
  }

  __destroy() {
    this.__records = [];
    this.__records2 = [];
    this.__list = [];
    this.__list2 = [];
  }

  __action(k, args) {
    this.__list.forEach(item => {
      item[k].apply(item, args);
    });
  }

  // 后面parse的自动播放的dom动画，需要特殊处理，单独运行，否则会使得开始已有的动画重复播放
  __addAuto(records) {
    const list = this.__list;
    records.forEach(item => {
      let { target, animate, areaStart, areaDuration } = item;
      if(target.isDestroyed || !animate) {
        return;
      }
      if(!Array.isArray(animate)) {
        animate = [animate];
      }
      animate.forEach(animate => {
        let { value, options } = animate;
        if(areaStart || !isNil(areaDuration)) {
          options = Object.assign({}, options); // clone防止多个使用相同的干扰
          options.areaStart = areaStart;
          options.areaDuration = areaDuration;
        }
        let o = target.animate(value, options);
        o.__isControlled = true;
        this.add(o, list);
      });
      return animate;
    });
  }

  init(records = this.__records, list = this.__list) {
    // 检查尚未初始化的record，并初始化，后面才能调用各种控制方法
    if(records.length) {
      // 清除防止重复调用，并且新的json还会进入整体逻辑
      records.splice(0).forEach(item => {
        let { target, animate, areaStart, areaDuration } = item;
        if(target.isDestroyed || !animate) {
          return;
        }
        if(!Array.isArray(animate)) {
          animate = [animate];
        }
        animate.forEach(animate => {
          let { value, options } = animate;
          if(areaStart || !isNil(areaDuration)) {
            options = Object.assign({}, options); // clone防止多个使用相同的干扰
            options.areaStart = areaStart;
            options.areaDuration = areaDuration;
          }
          options.autoPlay = false;
          let o = target.animate(value, options);
          o.__isControlled = true;
          this.add(o, list);
        });
      });
    }
    // 非自动播放后初始化需检测事件，给非自动播放添加上，并清空本次
    if(records === this.__records2) {
      let onList = this.__onList;
      let list2 = this.list2;
      if(list2.length && onList.length) {
        list2.forEach(item => {
          onList.forEach(arr => {
            let cb = () => {
              let time = frame.__now;
              if(time !== this.__lastTime[arr[0]]) {
                this.__lastTime[arr[0]] = time;
                arr[1] && arr[1]();
              }
            };
            cb.__karasEventCb = arr[1];
            item.off(arr[0], arr[1]);
            item.on(arr[0], cb);
          });
        });
      }
    }
  }

  __playAuto() {
    this.init();
    this.__action('play');
  }

  play(cb) {
    this.__mergeAuto();
    this.__onList = [];
    let once = true;
    this.__action('play', [cb && function(diff) {
      if(once) {
        once = false;
        if(isFunction(cb)) {
          cb(diff);
        }
      }
    }]);
  }

  pause() {
    this.__action('pause');
  }

  resume(cb) {
    let once = true;
    this.__action('resume', [cb && function(diff) {
      if(once) {
        once = false;
        if(isFunction(cb)) {
          cb(diff);
        }
      }
    }]);
  }

  __mergeAuto() {
    this.init();
    this.init(this.__records2);
    if(this.__list2.length) {
      this.__list = this.__list.concat(this.__list2);
      this.__list2 = [];
    }
  }

  cancel(cb) {
    this.__mergeAuto();
    this.__onList = [];
    let once = true;
    this.__action('cancel', [cb && function(diff) {
      if(once) {
        once = false;
        if(isFunction(cb)) {
          cb(diff);
        }
      }
    }]);
  }

  finish(cb) {
    this.__mergeAuto();
    this.__onList = [];
    let once = true;
    this.__action('finish', [cb && function(diff) {
      if(once) {
        once = false;
        if(isFunction(cb)) {
          cb(diff);
        }
      }
    }]);
  }

  gotoAndStop(v, options, cb) {
    this.__mergeAuto();
    this.__onList = [];
    if(isFunction(options)) {
      cb = options;
      options = {};
    }
    let once = true;
    this.__action('gotoAndStop', [v, options, cb && function(diff) {
      if(once) {
        once = false;
        if(isFunction(cb)) {
          cb(diff);
        }
      }
    }]);
  }

  gotoAndPlay(v, options, cb) {
    this.__mergeAuto();
    this.__onList = [];
    if(isFunction(options)) {
      cb = options;
      options = {};
    }
    let once = true;
    this.__action('gotoAndPlay', [v, options, cb && function(diff) {
      if(once) {
        once = false;
        if(isFunction(cb)) {
          cb(diff);
        }
      }
    }]);
  }

  on(id, handle) {
    if(!isFunction(handle)) {
      return;
    }
    if(Array.isArray(id)) {
      for(let i = 0, len = id.length; i < len; i++) {
        this.__on(id[i], handle);
      }
      this.__onList.push([id, handle]);
    }
    else {
      this.__on(id, handle);
      this.__onList.push([id, handle]);
    }
  }

  __on(id, handle) {
    this.__list.forEach(item => {
      let cb = () => {
        let time = frame.__now;
        if(time !== this.__lastTime[id]) {
          this.__lastTime[id] = time;
          handle && handle();
        }
      };
      cb.__karasEventCb = handle;
      item.on(id, cb);
    });
  }

  off(id, handle) {
    if(Array.isArray(id)) {
      for(let i = 0, len = id.length; i < len; i++) {
        this.off(id[i], handle);
      }
    }
    else {
      this.list.forEach(item => {
        item.off(id, handle);
      });
    }
  }

  get list() {
    return this.__list;
  }

  get list2() {
    return this.__list2;
  }

  __set(key, value) {
    this.__list.forEach(item => {
      item[key] = value;
    });
    this.__list2.forEach(item => {
      item[key] = value;
    });
  }

  set playbackRate(v) {
    this.__set('playbackRate', v);
  }

  set iterations(v) {
    this.__set('iterations', v);
  }

  set playCount(v) {
    this.__set('playCount', v);
  }

  set fps(v) {
    this.__set('fps', v);
  }

  set currentTime(v) {
    this.__set('currentTime', v);
  }

  set spfLimit(v) {
    this.__set('spfLimit', v);
  }

  set delay(v) {
    this.__set('delay', v);
  }

  set endDelay(v) {
    this.__set('endDelay', v);
  }

  set fill(v) {
    this.__set('fill', v);
  }

  set direction(v) {
    this.__set('direction', v);
  }
}

export default Controller;
