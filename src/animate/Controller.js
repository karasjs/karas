import util from '../util/util';

const { isFunction } = util;

class Controller {
  constructor() {
    this.__records = []; // 默认记录和自动记录
    this.__records2 = []; // 非自动播放的动画记录
    this.__list = [] // 默认初始化播放列表，自动播放也存这里
    this.__list2 = []; // json中autoPlay为false的初始化存入这里
  }

  add(v, list = this.list) {
    if(list.indexOf(v) === -1) {
      list.push(v);
    }
  }

  remove(v) {
    let i = this.list.indexOf(v);
    if(i > -1) {
      this.list.splice(i, 1);
    }
  }

  __destroy() {
    this.__records = [];
    this.__records2 = [];
    this.__list = [];
    this.__list2 = [];
  }

  __action(k, args) {
    this.list.forEach(item => {
      item[k].apply(item, args);
    });
  }

  init(records = this.__records, list = this.__list) {
    // 检查尚未初始化的record，并初始化，后面才能调用各种控制方法
    if(records.length) {
      // 清除防止重复调用，并且新的json还会进入整体逻辑
      records.splice(0).forEach(item => {
        let { target, animate } = item;
        if(target.isDestroyed) {
          return;
        }
        if(Array.isArray(animate)) {
          animate.forEach(animate => {
            let { value, options } = animate;
            options.autoPlay = false;
            let o = target.animate(value, options);
            this.add(o, list);
          });
        }
        else {
          let { value, options } = animate;
          options.autoPlay = false;
          let o = target.animate(value, options);
          this.add(o, list);
        }
      });
    }
  }

  __playAuto() {
    this.init();
    this.__action('play');
  }

  play(cb) {
    this.init();
    // 手动调用play则播放全部包含autoPlay为false的
    this.init(this.__records2);
    if(this.__list2.length) {
      this.__list = this.__list.concat(this.__list2);
      this.__list2 = [];
    }
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

  cancel(cb) {
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
    this.init();
    this.init(this.__records2);
    if(this.__list2.length) {
      this.__list = this.__list.concat(this.__list2);
      this.__list2 = [];
    }
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
    this.init();
    this.init(this.__records2);
    if(this.__list2.length) {
      this.__list = this.__list.concat(this.__list2);
      this.__list2 = [];
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
    this.init();
    this.init(this.__records2);
    if(this.__list2.length) {
      this.__list = this.__list.concat(this.__list2);
      this.__list2 = [];
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

  get list() {
    return this.__list;
  }

  __set(key, value) {
    this.list.forEach(item => {
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
