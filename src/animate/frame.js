import inject from '../util/inject';
import util from '../util/util';

const { isFunction } = util;

function traversal(list, diff, step) {
  if(step === 'before') {
    list.forEach(item => {
      if(item && isFunction(item.before)) {
        item.before(diff);
      }
    });
  }
  else if(step === 'after') {
    list.forEach(item => {
      if(item && isFunction(item.after)) {
        item.after(diff);
      }
      else if(isFunction(item)) {
        item(diff);
      }
    });
  }
}

let isPause;

class Frame {
  constructor() {
    this.__hookTask = []; // 动画刷新后，每个root注册的刷新回调执行
    this.__task = [];
    this.__taskA = [];
    this.__now = null;
  }

  __init() {
    let self = this;
    let { task, taskA } = self;
    inject.cancelAnimationFrame(self.id);
    let last = self.__now = inject.now();
    function cb() {
      // 必须清除，可能会发生重复，当动画finish回调中gotoAndPlay(0)，下方结束判断发现aTask还有值会继续，新的init也会进入再次执行
      inject.cancelAnimationFrame(self.id);
      self.id = inject.requestAnimationFrame(function() {
        if(isPause || !task.length && !taskA.length) {
          return;
        }
        let now = self.__now = inject.now();
        let diff = now - last;
        diff = Math.max(diff, 0);
        // let delta = diff * 0.06; // 比例是除以1/60s，等同于*0.06
        last = now;
        // 优先动画计算
        let cloneA = taskA.slice(0);
        let clone = task.slice(0);
        cloneA.forEach(item => {
          item.__before(diff);
        });
        traversal(clone, diff, 'before');
        // 执行动画造成的刷新并清空，在root的refreshTask回调中可能被清空，因为task已经刷新过了
        self.__hookTask.splice(0).forEach(item => item());
        // 普通的after
        cloneA.forEach(item => {
          item.__after(diff);
        });
        traversal(clone, diff, 'after');
        // 还有则继续，没有则停止节省性能
        if(task.length || taskA.length) {
          cb();
        }
      });
    }
    cb();
  }

  onFrame(handle) {
    if(!handle) {
      return;
    }
    let { task, taskA } = this;
    if(!task.length && !taskA.length) {
      this.__init();
    }
    task.push(handle);
  }

  __onFrameA(animate) {
    let { task, taskA } = this;
    if(!task.length && !taskA.length) {
      this.__init();
    }
    taskA.push(animate);
  }

  offFrame(handle) {
    if(!handle) {
      return;
    }
    let { task, taskA } = this;
    for(let i = 0, len = task.length; i < len; i++) {
      let item = task[i];
      // 需考虑nextFrame包裹的引用对比
      if(item === handle || item.__karasFramecb === handle) {
        task.splice(i, 1);
        break;
      }
    }
    if(!task.length && !taskA.length) {
      inject.cancelAnimationFrame(this.id);
      this.__now = null;
    }
  }

  __offFrameA(animate) {
    let { task, taskA } = this;
    for(let i = 0, len = taskA.length; i < len; i++) {
      let item = taskA[i];
      // 需考虑nextFrame包裹的引用对比
      if(item === animate) {
        taskA.splice(i, 1);
        break;
      }
    }
    if(!task.length && !taskA.length) {
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
        handle.after && handle.after(diff);
        this.offFrame(cb);
      },
    };
    cb.__karasFramecb = handle;
    this.onFrame(cb);
  }

  pause() {
    isPause = true;
  }

  resume() {
    if(isPause) {
      this.__init();
      isPause = false;
    }
  }

  get task() {
    return this.__task;
  }

  get taskA() {
    return this.__taskA;
  }
}

export default new Frame();
