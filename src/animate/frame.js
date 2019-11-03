import inject from '../util/inject';

class Frame {
  constructor() {
    this.__inFrame = false;
    this.__task = [];
  }

  __init(task) {
    let self = this;
    function cb() {
      inject.requestAnimationFrame(function() {
        if(!task.length) {
          return;
        }
        self.__inFrame = true;
        task.forEach(handle => handle());
        self.__inFrame = false;
        let afterCb = self.__afterFrame;
        afterCb && afterCb();
        self.__afterFrame = null;
        if(!task.length) {
          return;
        }
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
    if(self.__inFrame) {
      self.__afterFrame = cb;
    }
    else {
      self.onFrame(cb);
    }
  }

  get task() {
    return this.__task;
  }
}

export default new Frame();
