import inject from '../util/inject';
import util from '../util/util';

const { isFunction, isObject } = util;

function traversal(list, diff, step) {
  if(step === 'before') {
    list.forEach(item => {
      if(isObject(item) && isFunction(item.before)) {
        item.before(diff);
      }
    });
  }
  else if(step === 'after') {
    list.forEach(item => {
      if(isObject(item) && isFunction(item.after)) {
        item.after(diff);
      }
      else if(isFunction(item)) {
        item(diff);
      }
    });
  }
}

class Frame {
  constructor() {
    this.__aTask = []; // 专门动画刷新，确保每帧优先执行，动画单异步
    this.__hookTask = []; // 动画刷新后，每个root注册的刷新回调执行
    this.__task = [];
    this.__now = null;
  }

  __init() {
    let self = this;
    let { aTask, task } = self;
    inject.cancelAnimationFrame(self.id);
    let last = self.__now = inject.now();
    function cb() {
      // 必须清除，可能会发生重复，当动画finish回调中gotoAndPlay(0)，下方结束判断发现aTask还有值会继续，新的init也会进入再次执行
      inject.cancelAnimationFrame(self.id);
      self.id = inject.requestAnimationFrame(function() {
        if(!aTask.length && !task.length) {
          return;
        }
        let now = self.__now = inject.now();
        let diff = now - last;
        diff = Math.max(diff, 0);
        // let delta = diff * 0.06; // 比例是除以1/60s，等同于*0.06
        last = now;
        // 优先动画计算
        let clone1 = aTask.slice(0);
        let clone2 = task.slice(0);
        traversal(clone1, diff, 'before');
        traversal(clone2, diff, 'before');
        // 执行动画造成的刷新并清空，在root的refreshTask回调中可能被清空，因为task已经刷新过了
        self.__hookTask.splice(0).forEach(item => item());
        // 普通的before/after
        traversal(clone1, diff, 'after');
        traversal(clone2, diff, 'after');
        // 还有则继续，没有则停止节省性能
        if(aTask.length || task.length) {
          cb();
        }
      });
    }
    cb();
  }

  __onFrame(handle, target) {
    if(!handle) {
      return;
    }
    let { aTask, task } = this;
    if(!aTask.length && !task.length) {
      this.__init();
    }
    target.push(handle);
  }

  __offFrame(handle, target) {
    if(!handle) {
      return;
    }
    for(let i = 0, len = target.length; i < len; i++) {
      let item = target[i];
      // 需考虑nextFrame包裹的引用对比
      if(item === handle || item.__karasFramecb === handle) {
        target.splice(i, 1);
        break;
      }
    }
    let { aTask, task } = this;
    if(!aTask.length && !task.length) {
      inject.cancelAnimationFrame(this.id);
      this.__now = null;
    }
  }

  onFrame(handle) {
    this.__onFrame(handle, this.task);
  }

  offFrame(handle) {
    this.__offFrame(handle, this.task);
  }

  __onFrameA(handle) {
    this.__onFrame(handle, this.aTask);
  }

  __offFrameA(handle) {
    this.__offFrame(handle, this.aTask);
  }

  __nextFrame(handle, animate) {
    if(!handle) {
      return;
    }
    // 包裹一层会导致添加后删除对比引用删不掉，需保存原有引用进行对比
    let cb = isFunction(handle) ? diff => {
      handle(diff);
      if(animate) {
        this.__offFrameA(cb);
      }
      else {
        this.offFrame(cb);
      }
    } : {
      before: handle.before,
      after: diff => {
        handle.after(diff);
        if(animate) {
          this.__offFrameA(cb);
        }
        else {
          this.offFrame(cb);
        }
      },
    };
    cb.__karasFramecb = handle;
    if(animate) {
      this.__onFrameA(cb);
    }
    else {
      this.onFrame(cb);
    }
  }

  nextFrame(handle) {
    this.__nextFrame(handle);
  }

  __nextFrameA(handle) {
    this.__nextFrame(handle, true);
  }

  get task() {
    return this.__task;
  }

  get aTask() {
    return this.__aTask;
  }
}

export default new Frame();
