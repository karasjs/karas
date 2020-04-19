import util from '../util/util';

const { isNil } = util;

function replaceGlobal(target, globalValue, key, vars) {
  // 优先vars，其次总控，没有就是自己声明
  if(!isNil(globalValue)) {
    let decl = target['var-' + key];
    if(!decl) {
      target[key] = globalValue;
    }
    else {
      let id = decl.id;
      if(!id || !vars[id]) {
        target[key] = globalValue;
      }
    }
  }
}

class Controller {
  constructor() {
    this.__records = [];
    this.__list = [];
  }

  __op(options) {
    let { playbackRate, iterations, vars } = options;
    // 没定义总控不必循环设置
    if(isNil(playbackRate) && isNil(iterations)) {
      return;
    }
    this.records.forEach(record => {
      let { animate } = record;
      if(Array.isArray(animate)) {
        animate.forEach(item => {
          let { options } = item;
          // 用总控替换动画属性中的值，注意vars优先级
          replaceGlobal(options, playbackRate, 'playbackRate', vars);
          replaceGlobal(options, iterations, 'iterations', vars);
        });
      }
      else {
        let { options } = animate;
        replaceGlobal(options, playbackRate, 'playbackRate', vars);
        replaceGlobal(options, iterations, 'iterations', vars);
      }
    });
  }

  add(v) {
    if(this.__list.indexOf(v) === -1) {
      this.list.push(v);
    }
  }

  remove(v) {
    let i = this.list.indexOf(v);
    if(i > -1) {
      this.list.splice(i, 1);
    }
  }

  __destroy() {
    this.__records = [];
    this.__list = [];
  }

  __action(k, args) {
    this.list.forEach(item => {
      item.target.animationList.forEach(animate => {
        animate[k].apply(animate, args);
      });
    });
  }

  init() {
    // 检查尚未初始化的record，并初始化，后面才能调用各种控制方法
    let records = this.records;
    if(records.length) {
      // 清除防止重复调用，并且新的json还会进入整体逻辑
      records.splice(0).forEach(item => {
        let { target, animate } = item;
        if(Array.isArray(animate)) {
          animate.forEach(animate => {
            let o = target.animate(animate.value, animate.options);
            this.add(o);
          });
        }
        else {
          let o = target.animate(animate.value, animate.options);
          this.add(o);
        }
      });
    }
  }

  play() {
    this.init();
    this.__action('play');
  }

  pause() {
    this.__action('pause');
  }

  cancel() {
    this.__action('cancel');
  }

  finish() {
    this.__action('finish');
  }

  gotoAndStop(v, options, cb) {
    this.init();
    let once = true;
    this.__action('gotoAndStop', [v, options, function(diff) {
      if(once) {
        once = false;
        cb(diff);
      }
    }]);
  }

  gotoAndPlay(v, options, cb) {
    this.init();
    let once = true;
    this.__action('gotoAndPlay', [v, options, function(diff) {
      if(once) {
        once = false;
        cb(diff);
      }
    }]);
  }

  get records() {
    return this.__records;
  }

  get list() {
    return this.__list;
  }

  __set(key, value) {
    this.list.forEach(item => {
      item[key] = value;
    });
  }

  set playbackRate(v) {
    this.__set('playbackRate', v);
  }

  set iterations(v) {
    this.__set('iterations', v);
  }

  set playCount(v) {
    this.__set('playCount', v);
  }

  set fps(v) {
    this.__set('fps', v);
  }

  set currentTime(v) {
    this.__set('currentTime', v);
  }
}

export default Controller;
