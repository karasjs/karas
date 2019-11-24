import util from './util';

class Event {
  constructor() {
    this.__eHash = {};
  }
  on(id, handle) {
    let self = this;
    if(Array.isArray(id)) {
      for(let i = 0, len = id.length; i < len; i++) {
        self.on(id[i], handle);
      }
    }
    else if(handle) {
      if(!self.__eHash.hasOwnProperty(id)) {
        self.__eHash[id] = [];
      }
      // 遍历防止此handle被侦听过了
      for(let i = 0, item = self.__eHash[id], len = item.length; i < len; i++) {
        if(item[i] === handle) {
          return self;
        }
      }
      self.__eHash[id].push(handle);
    }
    return self;
  }
  once(id, handle) {
    if(!util.isFunction(handle)) {
      return;
    }
    let self = this;
    function cb(...data) {
      handle.apply(self, data);
      self.off(id, cb);
    }
    if(Array.isArray(id)) {
      for(let i = 0, len = id.length; i < len; i++) {
        self.once(id[i], handle);
      }
    }
    else if(handle) {
      self.on(id, cb);
    }
    return this;
  }
  off(id, handle) {
    let self = this;
    if(Array.isArray(id)) {
      for(let i = 0, len = id.length; i < len; i++) {
        self.off(id[i], handle);
      }
    }
    else if(self.__eHash.hasOwnProperty(id)) {
      if(handle) {
        for(let i = 0, item = self.__eHash[id], len = item.length; i < len; i++) {
          if(item[i] === handle) {
            item.splice(i, 1);
            break;
          }
        }
      }
      // 未定义为全部清除
      else {
        delete self.__eHash[id];
      }
    }
    return this;
  }
  emit(id, ...data) {
    let self = this;
    if(Array.isArray(id)) {
      for(let i = 0, len = id.length; i < len; i++) {
        self.emit(id[i], data);
      }
    }
    else {
      if(self.__eHash.hasOwnProperty(id)) {
        let list = self.__eHash[id];
        if(list.length) {
          list = list.slice();
          for(let i = 0, len = list.length; i < len; i++) {
            let cb = list[i];
            if(util.isFunction(cb)) {
              cb.apply(self, data);
            }
          }
        }
      }
    }
    return this;
  }

  static mix(...obj) {
    for(let i = obj.length - 1; i >= 0; i--) {
      let o = obj[i];
      let event = new Event();
      o.__eHash = {};
      let fns = ['on', 'once', 'off', 'emit'];
      for(let j = fns.length - 1; j >= 0; j--) {
        let fn = fns[j];
        o[fn] = event[fn];
      }
    }
  }

  static KARAS_REFRESH = 'karas-refresh';
  static KARAS_BEFORE_REFRESH = 'karas-before-refresh';
  static KARAS_ANIMATION_PAUSE = 'karas-animation-pause';
  static KARAS_ANIMATION_FRAME = 'karas-animation-frame';
  static KARAS_ANIMATION_FINISH = 'karas-animation-finish';
  static KARAS_ANIMATION_CANCEL = 'karas-animation-cancel';
}

export default Event;
