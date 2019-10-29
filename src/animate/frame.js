import inject from '../util/inject';

class Frame {
  constructor() {
    this.__taskList = [];
  }

  __init() {
    let list = this.taskList;
    function cb() {
      inject.requestAnimationFrame(function() {
        if(!list.length) {
          return;
        }
        list.forEach(handle => handle());
        cb();
      });
    }
    cb();
  }

  onFrame(handle) {
    this.taskList.push(handle);
    this.__init();
  }

  offFrame(handle) {
    let list = this.taskList;
    for(let i = 0, len = list.length; i < len; i++) {
      if(list[i] === handle) {
        list.splice(i, 1);
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

  get taskList() {
    return this.__taskList;
  }
}

export default new Frame();
