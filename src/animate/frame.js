import inject from '../util/inject';
import util from '../util/util';

const { isFunction } = util;

function traversal(list, length, diff, after) {
  if(after) {
    for(let i = 0; i < length; i++) {
      let item = list[i];
      item.__after && item.__after(diff);
    }
  }
  else {
    for(let i = 0; i < length; i++) {
      let item = list[i];
      item.__before && item.__before(diff);
    }
  }
}

let isPause;

class Frame {
  constructor() {
    this.__rootTask = []; // 动画刷新后，每个root注册的刷新回调执行
    this.__task = [];
    this.__now = inject.now();
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
        let length = clone.length;
        // 普通的before/after，动画计算在before，所有回调在after
        traversal(clone, length, diff, false);
        let list = self.__rootTask.splice(0);
        for(let i = 0, len = list.length; i < len; i++) {
          let item = list[i];
          item && item(diff);
        }
        // 刷新成功后调用after，确保图像生成
        traversal(clone, length, diff, true);
        // 执行每个Root的刷新并清空
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
    if(isFunction(handle)) {
      handle = {
        __after: handle,
        __karasFramecb: handle,
      };
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
    let cb = isFunction(handle) ? {
      __after: diff => {
        handle(diff);
        this.offFrame(cb);
      },
    } : {
      __before: handle.__before,
      __after: diff => {
        handle.__after && handle.__after(diff);
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
}

export default new Frame();
