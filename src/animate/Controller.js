import util from '../util/util';

const { isNil } = util;

function replaceGlobal(target, globalValue, key, vars) {
  // 优先vars，其次总控，没有就是自己声明
  if(!isNil(globalValue)
    && (!target['var-' + key]
      || isNil(vars[key]))) {
    target[key] = globalValue;
  }
}

class Controller {
  constructor(records) {
    this.__records = records;
    this.__list = [];
  }

  __op(options) {
    let { playbackRate, iterations, vars } = options;
    // 没定义总控不必循环设置
    if(isNil(playbackRate) && isNil(iterations)) {
      return;
    }
    this.__playbackRate = playbackRate;
    this.__iterations = iterations;
    this.records.forEach(record => {
      record.animate.forEach(item => {
        let { options } = item;
        // 用总控替换动画属性中的值，注意vars优先级
        replaceGlobal(options, playbackRate, 'playbackRate', vars);
        replaceGlobal(options, iterations, 'iterations', vars);
      });
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

  play() {
    this.__action('play');
    // json中的动画每次播放时通过animate()方法传入isUnderControl，使其进入list被控制
    let records = this.records;
    if(records.length) {
      // 清除防止重复调用，并且新的json还会进入整体逻辑
      records.splice(0).forEach(item => {
        let { target, animate } = item;
        if(Array.isArray(animate)) {
          animate.forEach(animate => {
            target.animate(animate.value, animate.options, true);
          });
        }
        else {
          target.animate(animate.value, animate.options, true);
        }
      });
    }
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
    let once = true;
    this.__action('gotoAndStop', [v, options, function(diff) {
      if(once) {
        once = false;
        cb(diff);
      }
    }]);
  }

  gotoAndPlay(v, options, cb) {
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

  get playbackRate() {
    return this.__playbackRate;
  }

  set playbackRate(v) {
    v = parseFloat(v) || 0;
    if(v < 0) {
      v = 1;
    }
    this.__playbackRate = v;
    this.list.forEach(item => {
      item.playbackRate = v;
    });
  }

  get iterations() {
    return this.__iterations;
  }

  set iterations(v) {
    v = parseInt(v);
    if(isNaN(v)) {
      v = 1;
    }
    this.__iterations = v;
    this.list.forEach(item => {
      item.iterations = v;
    });
  }
}

export default Controller;
