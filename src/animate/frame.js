import inject from '../util/inject';

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
        clone.forEach(handle => handle(delta));
        if(!task.length) {
          return;
        }
        cb();
      });
    }
    cb();
  }

  onFrame(handle, unshift) {
    if(!handle) {
      return;
    }
    let { task } = this;
    if(!task.length) {
      this.__init(task);
    }
    if(unshift) {
      task.unshift(handle);
    }
    else {
      task.push(handle);
    }
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

  nextFrame(handle, unshift) {
    if(!handle) {
      return;
    }
    let self = this;
    // 包裹一层会导致添加后删除对比引用删不掉，需保存原有引用进行对比
    function cb() {
      handle();
      self.offFrame(cb);
    }
    cb.__karasFramecb = handle;
    self.onFrame(cb, unshift);
  }

  get task() {
    return this.__task;
  }
}

export default new Frame();
