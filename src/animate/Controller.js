import util from '../util/util';

const { isNil, isFunction } = util;

// const LIST = [
//   'playbackRate',
//   'iterations',
//   'fps',
//   'spfLimit',
//   'delay',
//   'endDelay',
//   'duration',
//   'direction',
//   'fill',
//   'playCount',
//   'currentTime',
//   'easing',
// ];

// function replaceOption(target, globalValue, key, vars) {
//   // 优先vars，其次总控，都没有忽略即自己原本声明
//   if(!isNil(globalValue)) {
//     let decl = target['var-' + key];
//     if(!decl) {
//       target[key] = globalValue;
//     }
//     else {
//       let id = decl.id;
//       if(!id || !vars[id]) {
//         target[key] = globalValue;
//       }
//     }
//   }
// }
//
// function replaceGlobal(global, options) {
//   LIST.forEach(k => {
//     if(global.hasOwnProperty(k)) {
//       replaceOption(options, global[k], k, global.vars);
//     }
//   });
// }

class Controller {
  constructor() {
    this.__records = [];
    this.__auto = [];
    this.__list = [];
  }

  // __op(options, target = this.__records) {
  //   target.forEach(record => {
  //     let { animate } = record;
  //     if(Array.isArray(animate)) {
  //       animate.forEach(item => {
  //         // 用总控替换动画属性中的值，注意vars优先级
  //         replaceGlobal(options, item.options);
  //       });
  //     }
  //     else {
  //       replaceGlobal(options, animate.options);
  //     }
  //   });
  // }

  add(v) {
    if(this.__list.indexOf(v) === -1) {
      this.list.push(v);
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
    this.__auto = [];
    this.__list = [];
  }

  __action(k, args) {
    this.list.forEach(item => {
      item[k].apply(item, args);
    });
  }

  init(target = this.__records) {
    // 检查尚未初始化的record，并初始化，后面才能调用各种控制方法
    if(target.length) {
      // 清除防止重复调用，并且新的json还会进入整体逻辑
      target.splice(0).forEach(item => {
        let { target, animate } = item;
        if(Array.isArray(animate)) {
          animate.forEach(animate => {
            let { value, options } = animate;
            options.autoPlay = false;
            let o = target.animate(value, options);
            this.add(o);
          });
        }
        else {
          let { value, options } = animate;
          options.autoPlay = false;
          let o = target.animate(value, options);
          this.add(o);
        }
      });
    }
  }

  __playAuto(cb) {
    this.init(this.__auto);
    this.__action('play');
  }

  play(cb) {
    this.init();
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
