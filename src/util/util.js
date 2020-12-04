import $$type from './$$type';
import mx from '../math/matrix';
import enums from './enums';

const { STYLE_KEY, STYLE_KEY: { TRANSFORM } } = enums;

let toString = {}.toString;
function isType(type) {
  return function(obj) {
    return toString.call(obj) === '[object ' + type + ']';
  }
}

let isObject = isType('Object');
let isString = isType('String');
let isFunction = isType('Function');
let isNumber = isType('Number');
let isBoolean = isType('Boolean');
let isDate = isType('Date');

function isNil(v) {
  return v === undefined || v === null;
}

function joinSourceArray(arr) {
  let res = '';
  for(let i = 0, len = arr.length; i < len; i++) {
    let item = arr[i];
    if(Array.isArray(item)) {
      res += joinSourceArray(item);
    }
    else {
      res += stringify(item);
    }
  }
  return res;
}

function stringify(s) {
  if(isNil(s)) {
    return '';
  }
  return s.toString();
}

function encodeHtml(s, prop) {
  if(prop) {
    return s.replace(/"/g, '&quot;');
  }
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/ /g, '&nbsp;');
}

// 根元素专用
function joinVirtualDom(vd) {
  let s = '<defs>';
  vd.defs.forEach(item => {
    s += joinDef(item);
  });
  s += '</defs><g';
  if(vd.bbClip) {
    s += ' clip-path="' + vd.bbClip + '"';
  }
  s += '>';
  vd.bb.forEach(item => {
    s += joinVd(item);
  });
  s += '</g><g';
  if(vd.conClip) {
    s += ' clip-path="' + vd.conClip + '"';
  }
  s += '>';
  (vd.children || []).forEach(item => {
    if(item.isMask) {
      return;
    }
    s += joinVd(item);
  });
  s += '</g>';
  return s;
}

// 普通元素
function joinVd(vd) {
  if(vd.type === 'item' || vd.type === 'img') {
    let s = '';
    (vd.props || []).forEach(item => {
      s += ' ' + item[0] + '="' + item[1] + '"';
    });
    if(vd.tagName === 'text') {
      return '<text' + s + '>' + vd.content + '</text>';
    }
    return '<' + vd.tagName + s + '/>';
  }
  else if(vd.type === 'text') {
    let s = ``;
    // text有许多lineBox
    (vd.children || []).forEach(item => {
      s += joinVd(item);
    });
    return '<g>' + s + '</g>';
  }
  else if(vd.type === 'dom' || vd.type === 'geom') {
    let s = '<g';
    if(vd.bbClip) {
      s += ' clip-path="' + vd.bbClip + '"';
    }
    s += '>';
    vd.bb.forEach(item => {
      s += joinVd(item);
    });
    s += '</g><g';
    if(vd.conClip) {
      s += ' clip-path="' + vd.conClip + '"';
    }
    s += '>';
    (vd.children || []).forEach(item => {
      if(item.isMask) {
        return;
      }
      s += joinVd(item);
    });
    s += '</g>';
    let { opacity, transform, visibility, mask, overflow, filter, mixBlendMode } = vd;
    return '<g'
      + ((opacity !== 1 && opacity !== undefined) ? (' opacity="' + opacity + '"') : '')
      + (transform ? (' transform="' + transform + '"') : '')
      + ' visibility="' + visibility + '"'
      + (mask ? (' mask="' + mask + '"') : '')
      + (overflow ? (' clip-path="' + overflow + '"') : '')
      + (filter ? (' filter="' + filter + '"') : '')
      + (mixBlendMode ? (' style="mix-blend-mode:' + mixBlendMode + '"') : '')
      + '>' + s + '</g>';
  }
}

function joinDef(def) {
  let s = '<' + def.tagName + ' id="' + def.uuid + '"';
  if(def.tagName === 'mask' || def.tagName === 'clipPath') {
    // s += ' maskUnits="userSpaceOnUse"';
  }
  else if(def.tagName === 'filter') {
    // s += ' filterUnits="userSpaceOnUse"';
  }
  else {
    s += ' gradientUnits="userSpaceOnUse"';
  }
  (def.props || []).forEach(item => {
    s += ' ' + item[0] + '="' + item[1] + '"';
  });
  s += '>';
  (def.children || []).forEach(item => {
    s += joinItem(item);
  });
  s += '</' + def.tagName + '>';
  return s;
}

function joinItem(item) {
  let s = '<' + item.tagName;
  (item.props || []).forEach(item => {
    s += ' ' + item[0] + '="' + item[1] + '"';
  });
  s += '></' + item.tagName + '>';
  return s;
}

function rgba2int(color) {
  if(Array.isArray(color)) {
    return color;
  }
  let res = [];
  if(!color || color === 'transparent') {
    res = [0, 0, 0, 0];
  }
  else if(color.charAt(0) === '#') {
    color = color.slice(1);
    if(color.length === 3) {
      res.push(parseInt(color.charAt(0) + color.charAt(0), 16));
      res.push(parseInt(color.charAt(1) + color.charAt(1), 16));
      res.push(parseInt(color.charAt(2) + color.charAt(2), 16));
    }
    else if(color.length === 6) {
      res.push(parseInt(color.slice(0, 2), 16));
      res.push(parseInt(color.slice(2, 4), 16));
      res.push(parseInt(color.slice(4), 16));
    }
    else {
      res[0] = res[1] = res[2] = 0;
    }
    res[3] = 1;
  }
  else {
    let c = color.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)/i);
    if(c) {
      res = [parseInt(c[1]), parseInt(c[2]), parseInt(c[3])];
      if(!isNil(c[4])) {
        res[3] = parseFloat(c[4]);
      }
      else {
        res[3] = 1;
      }
    }
    else {
      res = [0, 0, 0, 0];
    }
  }
  return res;
}

function int2rgba(color) {
  if(Array.isArray(color)) {
    if(color.length === 4) {
      return 'rgba(' + joinArr(color, ',') + ')';
    }
    else if(color.length === 3) {
      return 'rgba(' + joinArr(color, ',') + ',1)';
    }
  }
  return color || 'rgba(0,0,0,0)';
}

function int2invert(color) {
  if(Array.isArray(color)) {
    color = color.slice(0);
    color[0] = 255 - color[0];
    color[1] = 255 - color[1];
    color[2] = 255 - color[2];
    if(color.length === 4) {
      return 'rgba(' + joinArr(color, ',') + ')';
    }
    else if(color.length === 3) {
      return 'rgba(' + joinArr(color, ',') + ',1)';
    }
  }
  return 'rgba(0,0,0,0)';
}

function arr2hash(arr) {
  let hash = {};
  for(let i = 0, len = arr.length; i < len; i++) {
    let item = arr[i];
    if(Array.isArray(item)) {
      hash[item[0]] = item[1];
    }
    else {
      for(let list = Object.keys(item), j = list.length - 1; j >= 0; j--) {
        let k = list[j];
        hash[k] = item[k];
      }
    }
  }
  return hash;
}

function hash2arr(hash) {
  if(Array.isArray(hash)) {
    return hash;
  }
  let arr = [];
  for(let list = Object.keys(hash), i = 0, len = list.length; i < len; i++) {
    let k = list[i];
    arr.push([k, hash[k]]);
  }
  return arr;
}

function clone(obj) {
  if(isNil(obj) || typeof obj !== 'object') {
    return obj;
  }
  // parse递归会出现内部先返回解析好的json，外部parse不能clone
  if(obj.$$type === $$type.TYPE_VD
    || obj.$$type === $$type.TYPE_GM
    || obj.$$type === $$type.TYPE_CP) {
    return obj;
  }
  if(util.isDate(obj)) {
    return new Date(obj);
  }
  let n = Array.isArray(obj) ? [] : {};
  Object.keys(obj).forEach(i => {
    n[i] = clone(obj[i]);
  });
  return n;
}

/**
 * 简化的arr对比，arr中只有arr和其它类型，其它类型对比值或引用，arr递归
 * @param a
 * @param b
 * @returns {boolean}
 */
function equalArr(a, b) {
  if(!a || !b) {
    return a === b;
  }
  if(a.length !== b.length) {
    return false;
  }
  for(let i = 0, len = a.length; i < len; i++) {
    let ai = a[i];
    let bi = b[i];
    let isArrayA = Array.isArray(ai);
    let isArrayB = Array.isArray(bi);
    if(isArrayA && isArrayB) {
      if(!equalArr(ai, bi)) {
        return false;
      }
    }
    else if(isArrayA || isArrayB) {
      return false;
    }
    else if(ai !== bi) {
      return false;
    }
  }
  return true;
}

/**
 * 深度对比对象
 * @param a
 * @param b
 * @returns {boolean}
 */
function equal(a, b) {
  if(a === b) {
    return true;
  }
  if(isObject(a) && isObject(b)) {
    let hash = {};
    for(let i = 0, arr = Object.keys(a), len = arr.length; i < len; i++) {
      let k = arr[i];
      if(!b.hasOwnProperty(k) || !equal(a[k], b[k])) {
        return false;
      }
      hash[k] = true;
    }
    // a没有b有则false
    for(let i = 0, arr = Object.keys(b), len = arr.length; i < len; i++) {
      let k = arr[i];
      if(!hash.hasOwnProperty(k)) {
        return false;
      }
    }
  }
  else if(isDate(a) && isDate(b)) {
    return a.getTime() === b.getTime();
  }
  else if(Array.isArray(a) && Array.isArray(b)) {
    if(a.length !== b.length) {
      return false;
    }
    for(let i = 0, len = a.length; i < len; i++) {
      if(!equal(a[i], b[i])) {
        return false;
      }
    }
  }
  else {
    return a === b;
  }
  return true;
}

function extend(target, source, keys) {
  if(source === null || typeof source !== 'object') {
    return target;
  }
  if(!keys) {
    keys = Object.keys(source);
  }
  let i = 0;
  let len = keys.length;
  while(i < len) {
    let k = keys[i];
    target[k] = source[k];
    i++;
  }
  return target;
}

function joinArr(arr, split) {
  let s = arr.length ? arr[0] : '';
  for(let i = 1, len = arr.length; i < len; i++) {
    s += split + arr[i];
  }
  return s;
}

function extendAnimate(ovd, nvd) {
  let list = nvd.__animationList = ovd.animationList.splice(0);
  list.forEach(item => {
    item.__setTarget(nvd);
    // 事件队列的缘故，可能动画本帧刚执行过，然后再继承，就会缺失，需再次赋值一遍；也有可能停留最后
    if(item.assigning || item.finished && item.__stayEnd()) {
      item.assignCurrentStyle();
    }
  });
}

function transformBbox(bbox, matrix, dx = 0, dy = 0) {
  if(matrix && !mx.isE(matrix)) {
    let [x1, y1, x2, y2] = bbox;
    // 可能因filter的原因扩展范围
    if(dx) {
      x1 -= dx;
      x2 += dx;
    }
    if(dy) {
      y1 -= dy;
      y2 += dy;
    }
    let list = [x2, y1, x1, y2, x2, y2];
    [x1, y1] = mx.calPoint([x1, y1], matrix);
    let xa = x1, ya = y1, xb = x1, yb = y1;
    for(let i = 0; i < 6; i += 2) {
      let x = list[i], y = list[i + 1];
      [x, y] = mx.calPoint([x, y], matrix);
      xa = Math.min(xa, x);
      xb = Math.max(xa, x);
      ya = Math.min(ya, y);
      yb = Math.max(yb, y);
    }
    bbox = [xa, ya, xb, yb];
  }
  else if(dx || dy) {
    bbox[0] -= dx;
    bbox[1] -= dy;
    bbox[2] += dx;
    bbox[3] += dy;
  }
  return bbox;
}

const VALUE = {
  [STYLE_KEY.POSITION]: true,
  [STYLE_KEY.DISPLAY]: true,
  [STYLE_KEY.BACKGROUND_REPEAT]: true,
  [STYLE_KEY.FLEX_DIRECTION]: true,
  [STYLE_KEY.JUSTIFY_CONTENT]: true,
  [STYLE_KEY.ALIGN_ITEMS]: true,
  [STYLE_KEY.ALIGN_SELF]: true,
  [STYLE_KEY.OVERFLOW]: true,
  [STYLE_KEY.MIX_BLEND_MODE]: true,
  [STYLE_KEY.STROKE_LINECAP]: true,
  [STYLE_KEY.STROKE_LINEJOIN]: true,
  [STYLE_KEY.STROKE_MITERLIMIT]: true,
  [STYLE_KEY.FILL_RULE]: true,
};
const ARRAY_0 = {
  [STYLE_KEY.BACKGROUND_SIZE]: true,
  [STYLE_KEY.BACKGROUND_COLOR]: true,
  [STYLE_KEY.BORDER_TOP_COLOR]: true,
  [STYLE_KEY.BORDER_RIGHT_COLOR]: true,
  [STYLE_KEY.BORDER_BOTTOM_COLOR]: true,
  [STYLE_KEY.BORDER_LEFT_COLOR]: true,
};
const ARRAY_0_1 = {
  [STYLE_KEY.BORDER_TOP_LEFT_RADIUS]: true,
  [STYLE_KEY.BORDER_TOP_RIGHT_RADIUS]: true,
  [STYLE_KEY.BORDER_BOTTOM_RIGHT_RADIUS]: true,
  [STYLE_KEY.BORDER_BOTTOM_LEFT_RADIUS]: true,
  [STYLE_KEY.TRANSFORM_ORIGIN]: true,
};
function cloneStyle(style, keys) {
  if(!keys) {
    keys = Object.keys(style);
  }
  let res = {};
  keys.forEach(k => {
    let v = style[k];
    // 渐变特殊处理
    if(k === STYLE_KEY.BACKGROUND_IMAGE) {
      if(v.k) {
        res[k] = util.clone(v);
      }
      else {
        res[k] = v;
      }
    }
    // position等直接值类型赋值
    else if(VALUE.hasOwnProperty(k)) {
      res[k] = v;
    }
    // 其余皆是数组
    else {
      let n = res[k] = v.slice(0);
      // 特殊引用里数组某项再次clone
      if(ARRAY_0.hasOwnProperty(k)) {
        n[0] = n[0].slice(0);
      }
      else if(ARRAY_0_1.hasOwnProperty(k)) {
        n[0] = n[0].slice(0);
        n[1] = n[1].slice(0);
      }
      else if(k === TRANSFORM) {
        for(let i = 0, len = n.length; i < len; i++) {
          n[i] = n[i].slice(0);
        }
      }
    }
  });
  return res;
}

let util = {
  isObject,
  isString,
  isFunction,
  isNumber,
  isBoolean,
  isDate,
  isNil,
  isPrimitive(v) {
    return util.isNil(v) || util.isBoolean(v) || util.isString(v) || util.isNumber(v);
  },
  // css中常用undefined/null表示auto本身
  isAuto(v) {
    return isNil(v) || v === 'auto';
  },
  stringify,
  joinSourceArray(arr) {
    return joinSourceArray(arr);
  },
  encodeHtml,
  joinVirtualDom,
  joinVd,
  joinDef,
  rgba2int,
  int2rgba,
  int2invert,
  arr2hash,
  hash2arr,
  clone,
  cloneStyle,
  equalArr,
  equal,
  extend,
  joinArr,
  extendAnimate,
  transformBbox,
};

export default util;
