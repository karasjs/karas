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

let isPause;

class Frame {
  constructor() {
    this.__hookTask = []; // 动画刷新后，每个root注册的刷新回调执行
    this.__task = [];
    this.__now = null;
  }

  __init() {
    let self = this;
    let { task } = self;
    inject.cancelAnimationFrame(self.id);
    let last = self.__now = inject.now();
    function cb() {
      // 必须清除，可能会发生重复，当动画finish回调中gotoAndPlay(0)，下方结束判断发现aTask还有值会继续，新的init也会进入再次执行
      inject.cancelAnimationFrame(self.id);
      self.id = inject.requestAnimationFrame(function() {
        if(isPause || !task.length) {
          return;
        }
        let now = self.__now = inject.now();
        let diff = now - last;
        diff = Math.max(diff, 0);
        // let delta = diff * 0.06; // 比例是除以1/60s，等同于*0.06
        last = now;
        // 优先动画计算
        let clone = task.slice(0);
        traversal(clone, diff, 'before');
        // 执行动画造成的刷新并清空，在root的refreshTask回调中可能被清空，因为task已经刷新过了
        self.__hookTask.splice(0).forEach(item => item());
        // 普通的before/after
        traversal(clone, diff, 'after');
        // 还有则继续，没有则停止节省性能
        if(task.length) {
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
    let { task } = this;
    if(!task.length) {
      this.__init();
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

  get aTask() {
    return this.__aTask;
  }
}

export default new Frame();
