import inject from '../util/inject';
import util from '../util/util';

class Frame {
  constructor() {
    this.__task = [];
  }

  __init(task) {
    function cb() {
      let last = inject.now();
      inject.requestAnimationFrame(function() {
        if(!task.length) {
          return;
        }
        let clone = task.slice();
        let now = inject.now();
        let delta = now - last;
        delta = delta * 0.06; // 比例是除以1/60s，等同于*0.06
        last = now;
        clone.forEach(item => {
          if(util.isObject(item) && util.isFunction(item.before)) {
            item.before(delta);
          }
        });
        clone.forEach(item => {
          if(util.isObject(item) && util.isFunction(item.after)) {
            item.after(delta);
          }
          else if(util.isFunction(item)) {
            item(delta);
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
  }

  nextFrame(handle) {
    if(!handle) {
      return;
    }
    // 包裹一层会导致添加后删除对比引用删不掉，需保存原有引用进行对比
    let cb = util.isFunction(handle) ? () => {
      handle();
      this.offFrame(cb);
    } : {
      before: handle.before,
      after: () => {
        handle.after();
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
