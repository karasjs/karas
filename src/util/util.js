let toString = {}.toString;
function isType(type) {
  return function(obj) {
    return toString.call(obj) === '[object ' + type + ']';
  }
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

function isNil(v) {
  return v === undefined || v === null;
}

// 根元素专用
function joinVirtualDom(vd) {
  let s = '<defs>';
  vd.defs.forEach(item => {
    s += joinDef(item);
  });
  s += '</defs><g';
  if(vd.bbMask) {
    s += ` mask="${vd.bbMask}"`;
  }
  s += '>';
  vd.bb.forEach(item => {
    s += joinVd(item);
  });
  s += '</g><g';
  if(vd.conMask) {
    s += ` mask="${vd.conMask}"`;
  }
  s += '>';
  vd.children.forEach(item => {
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
    vd.props.forEach(item => {
      s += ` ${item[0]}="${item[1]}"`;
    });
    if(vd.tagName === 'text') {
      return `<text${s}>${vd.content}</text>`;
    }
    return `<${vd.tagName}${s}/>`;
  }
  else if(vd.type === 'text') {
    let s = ``;
    // text有许多lineBox
    vd.children.forEach(item => {
      s += joinVd(item);
    });
    return `<g>${s}</g>`;
  }
  else if(vd.type === 'dom' || vd.type === 'geom') {
    let s = '<g';
    if(vd.bbMask) {
      s += ` mask="${vd.bbMask}"`;
    }
    s += '>';
    vd.bb.forEach(item => {
      s += joinVd(item);
    });
    s += '</g><g';
    if(vd.conMask) {
      s += ` mask="${vd.conMask}"`;
    }
    s += '>';
    vd.children.forEach(item => {
      if(item.isMask) {
        return;
      }
      s += joinVd(item);
    });
    s += '</g>';
    let { opacity, transform, mask, filter } = vd;
    return `<g${opacity !== 1 ? ` opacity="${opacity}"` : ''}${transform ? ` transform="${transform}"` : ''}${mask ? ` mask="${mask}"` : ''}${filter ? ` filter="${filter}"` : ''}>${s}</g>`;
  }
}

function joinDef(def) {
  let s = `<${def.tagName} id="${def.uuid}"`;
  if(def.tagName === 'mask') {
    // s += ' maskUnits="userSpaceOnUse"';
  }
  else if(def.tagName === 'filter') {
    // s += ' filterUnits="userSpaceOnUse"';
  }
  else {
    s += ' gradientUnits="userSpaceOnUse"';
  }
  def.props.forEach(item => {
    s += ` ${item[0]}="${item[1]}"`;
  });
  s += '>';
  def.children.forEach(item => {
    s += joinItem(item);
  });
  s += `</${def.tagName}>`;
  return s;
}

function joinItem(item) {
  let s = `<${item.tagName}`;
  item.props.forEach(item => {
    s += ` ${item[0]}="${item[1]}"`;
  });
  s += `></${item.tagName}>`;
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
      return `rgba(${joinArr(color, ',')})`;
    }
    else if(color.length === 3) {
      return `rgba(${joinArr(color, ',')},1)`;
    }
  }
  return color || 'rgba(0,0,0,0)';
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
  if(util.isDate(obj)) {
    return new Date(obj);
  }
  let n = Array.isArray(obj) ? [] : {};
  Object.keys(obj).forEach(i => {
    n[i] = clone(obj[i]);
  });
  return n;
}

function equalArr(a, b) {
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
    if(ai !== bi) {
      return false;
    }
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
  let i = keys.length;
  while(i--) {
    let k = keys[i];
    target[k] = source[k];
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

let util = {
  isObject: isType('Object'),
  isString: isType('String'),
  isFunction: isType('Function'),
  isNumber: isType('Number'),
  isBoolean: isType('Boolean'),
  isDate: isType('Date'),
  isNil,
  isPrimitive(v) {
    return util.isNil(v) || util.isBoolean(v) || util.isString(v) || util.isNumber(v);
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
  arr2hash,
  hash2arr,
  clone,
  equalArr,
  extend,
  joinArr,
};

export default util;
