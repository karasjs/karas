import inject from '../util/inject';
import util from '../util/util';

const { isFunction, isObject } = util;

class Frame {
  constructor() {
    this.__task = [];
    this.__now = null;
  }

  __init(task) {
    let self = this;
    inject.cancelAnimationFrame(self.id);
    let last = self.__now = inject.now();
    function cb() {
      self.id = inject.requestAnimationFrame(function() {
        if(!task.length) {
          return;
        }
        let clone = task.slice();
        let now = self.__now = inject.now();
        let diff = now - last;
        diff = Math.max(diff, 0);
        // let delta = diff * 0.06; // 比例是除以1/60s，等同于*0.06
        last = now;
        clone.forEach(item => {
          if(isObject(item) && isFunction(item.before)) {
            item.before(diff);
          }
        });
        clone.forEach(item => {
          if(isObject(item) && isFunction(item.after)) {
            item.after(diff);
          }
          else if(isFunction(item)) {
            item(diff);
          }
        });
        if(!task.length) {
          return;
        }
        cb();
      });
    }
    cb();
  }

  onFrame(handle) {
    if(!handle) {
      return;
    }
    let { task } = this;
    if(!task.length) {
      this.__init(task);
    }
    task.push(handle);
  }

  offFrame(handle) {
    if(!handle) {
      return;
    }
    let { task } = this;
    for(let i = 0, len = task.length; i < len; i++) {
      let item = task[i];
      // 需考虑nextFrame包裹的引用对比
      if(item === handle || item.__karasFramecb === handle) {
        task.splice(i, 1);
        break;
      }
    }
    if(!task.length) {
      inject.cancelAnimationFrame(this.id);
      this.__now = null;
    }
  }

  nextFrame(handle) {
    if(!handle) {
      return;
    }
    // 包裹一层会导致添加后删除对比引用删不掉，需保存原有引用进行对比
    let cb = isFunction(handle) ? diff => {
      handle(diff);
      this.offFrame(cb);
    } : {
      before: handle.before,
      after: diff => {
        handle.after(diff);
        this.offFrame(cb);
      },
    };
    cb.__karasFramecb = handle;
    this.onFrame(cb);
  }

  get task() {
    return this.__task;
  }
}

export default new Frame();
