import inject from '../util/inject';

class Frame {
  constructor() {
    this.__task = [];
  }

  __init(task) {
    function cb() {
      inject.requestAnimationFrame(function() {
        if(!task.length) {
          return;
        }
        task.forEach(handle => handle());
        cb();
      });
    }
    cb();
  }

  onFrame(handle) {
    let { task } = this;
    if(!task.length) {
      this.__init(task);
    }
    this.task.push(handle);
  }

  offFrame(handle) {
    let { task } = this;
    for(let i = 0, len = task.length; i < len; i++) {
      if(task[i] === handle) {
        task.splice(i, 1);
        break;
      }
    }
  }

  nextFrame(handle) {
    let self = this;
    function cb() {
      handle();
      self.offFrame(cb);
    }
    this.onFrame(cb);
  }

  get task() {
    return this.__task;
  }
}

export default new Frame();
