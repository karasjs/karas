class Controller {
  constructor(records) {
    this.__records = records;
    this.__list = [];
  }

  add(v) {
    if(Array.isArray(v)) {
      this.__list = this.list.concat(v);
    }
    else {
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

  gotoAndStop(v, isFrame, excludeDelay, cb) {
    let once = true;
    this.__action('gotoAndStop', [v, isFrame, excludeDelay, function(diff) {
      if(once) {
        once = false;
        cb(diff);
      }
    }]);
  }

  gotoAndPlay(v, isFrame, excludeDelay, cb) {
    let once = true;
    this.__action('gotoAndPlay', [v, isFrame, excludeDelay, function(diff) {
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
}

export default Controller;
