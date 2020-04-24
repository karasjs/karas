import util from '../util/util';

const { isNil } = util;

const LIST = [
  'playbackRate',
  'iterations',
  'fps',
  'spfLimit',
  'delay',
  'endDelay',
  'duration',
  'direction',
  'fill',
  'playCount',
  'currentTime',
];

function replaceOption(target, globalValue, key, vars) {
  // 优先vars，其次总控，都没有忽略即自己原本声明
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

function replaceGlobal(global, options) {
  LIST.forEach(k => {
    if(global.hasOwnProperty(k)) {
      replaceOption(options, global[k], k, global.vars);
    }
  });
}

class Controller {
  constructor() {
    this.__records = [];
    this.__list = [];
  }

  __op(options) {
    this.records.forEach(record => {
      let { animate } = record;
      if(Array.isArray(animate)) {
        animate.forEach(item => {
          // 用总控替换动画属性中的值，注意vars优先级
          replaceGlobal(options, item.options);
        });
      }
      else {
        replaceGlobal(options, animate.options);
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
        cb && cb(diff);
      }
    }]);
  }

  gotoAndPlay(v, options, cb) {
    this.init();
    let once = true;
    this.__action('gotoAndPlay', [v, options, function(diff) {
      if(once) {
        once = false;
        cb && cb(diff);
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

  set spfLimit(v) {
    this.__set('spfLimit', v);
  }
}

export default Controller;
