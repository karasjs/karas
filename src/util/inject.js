import Text from '../node/Text';import util from './util';const SPF = 1000 / 60;const CANVAS = {  cache: null,  mask: null,};function cacheCanvas(key, width, height) {  let o;  if(!CANVAS[key]) {    o = CANVAS[key] = document.createElement('canvas');    o.style.position = 'absolute';    o.style.visibility = 'hidden';    o.style.left = '9999px';    o.style.top = '-9999px';    document.body.append(o);  }  o = CANVAS[key];  o.setAttribute('width', width);  o.setAttribute('height', height);  o.style.width = width + 'px';  o.style.height = height + 'px';  return {    canvas: o,    ctx: o.getContext('2d'),    draw() {      // 空函数，仅对小程序提供hook特殊处理，flush缓冲    },  };}const IMG = {};const INIT = 0;const LOADING = 1;const LOADED = 2;let inject = {  measureText(cb) {    let { list, data } = Text.MEASURE_TEXT;    let html = '';    let keys = [];    let chars = [];    Object.keys(data).forEach(i => {      let { key, style, s } = data[i];      if(s) {        let inline = `position:absolute;font-family:${style.fontFamily};font-size:${style.fontSize}px`;        for(let j = 0, len = s.length; j < len; j++) {          keys.push(key);          let char = s.charAt(j);          chars.push(char);          html += `<span style="${inline}">${char.replace(/</, '&lt;').replace(' ', '&nbsp;')}</span>`;        }      }    });    if(!html) {      cb();      return;    }    let div = document.createElement('div');    div.style.position = 'absolute';    div.style.left = '99999px';    div.style.top = '-99999px';    div.style.visibility = 'hidden';    document.body.appendChild(div);    div.innerHTML = html;    let cns = div.childNodes;    let { CHAR_WIDTH_CACHE, MEASURE_TEXT } = Text;    for(let i = 0, len = cns.length; i < len; i++) {      let node = cns[i];      let key = keys[i];      let char = chars[i];      // clientWidth只返回ceil整数，精度必须用getComputedStyle      let css = window.getComputedStyle(node, null);      CHAR_WIDTH_CACHE[key][char] = parseFloat(css.width);    }    list.forEach(text => text.__measureCb());    cb();    MEASURE_TEXT.list = [];    MEASURE_TEXT.data = {};    document.body.removeChild(div);  },  IMG,  INIT,  LOADED,  LOADING,  measureImg(url, cb) {    let cache = IMG[url] = IMG[url] || {      state: INIT,      task: [],    };    if(cache.state === LOADED) {      cb(cache);    }    else if(cache.state === LOADING) {      cache.task.push(cb);    }    else {      cache.state = LOADING;      cache.task.push(cb);      let img = new Image();      img.onload = function() {        cache.state = LOADED;        cache.success = true;        cache.width = img.width;        cache.height = img.height;        cache.source = img;        cache.url = url;        let list = cache.task.splice(0);        list.forEach(cb => cb(cache));      };      img.onerror = function() {        cache.state = LOADED;        cache.success = false;        cache.url = url;        let list = cache.task.splice(0);        list.forEach(cb => cb(cache));      };      if(url.substr(0, 5) !== 'data:') {        let host = /^(?:\w+:)?\/\/([^/:]+)/.exec(url);        if(host) {          if(location.hostname !== host[1]) {            img.crossOrigin = 'anonymous';          }        }      }      img.src = url;    }  },  warn(s) {    console.warn(s);  },  requestAnimationFrame(cb) {    let res;    if(typeof requestAnimationFrame !== 'undefined') {      inject.requestAnimationFrame = requestAnimationFrame.bind(window);      res = requestAnimationFrame(cb);    }    else {      res = setTimeout(cb, SPF);      inject.requestAnimationFrame = function(cb) {        return setTimeout(cb, SPF);      };    }    return res;  },  cancelAnimationFrame(id) {    let res;    if(typeof cancelAnimationFrame !== 'undefined') {      inject.cancelAnimationFrame = cancelAnimationFrame.bind(window);      res = cancelAnimationFrame(id);    }    else {      res = clearTimeout(id);      inject.cancelAnimationFrame = function(id) {        return clearTimeout(id);      };    }    return res;  },  now() {    if(typeof performance !== 'undefined') {      inject.now = performance.now.bind(performance);      return performance.now();    }    inject.now = Date.now.bind(Date);    return Date.now();  },  getCacheCanvas(width, height, key = '__cache__') {    return cacheCanvas(key, width, height);  },  getMaskCanvas(width, height) {    return cacheCanvas('__mask__', width, height);  },  isDom(o) {    if(o) {      if(util.isString(o)) {        return true;      }      if(typeof window !== 'undefined' && window.Element && (o instanceof window.Element)) {        return true;      }      if(util.isFunction(o.getElementsByTagName)) {        return true;      }    }    return false;  },};export default inject;