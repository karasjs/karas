let toString = {}.toString;
function isType(type) {
  return function(obj) {
    return toString.call(obj) === '[object ' + type + ']';
  }
}

let isNumber = isType('Number');

function joinSourceArray(arr) {
  var res = '';
  for(var i = 0, len = arr.length; i < len; i++) {
    var item = arr[i];
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
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
}

function isNil(v) {
  return v === undefined || v === null;
}

function joinVirtualDom(vd) {
  let s = '<defs>';
  vd.defs.forEach(item => {
    s += joinDef(item);
  });
  s += '</defs><g>';
  vd.bb.forEach(item => {
    s += joinVd(item);
  });
  s += '</g><g>';
  vd.children.forEach(item => {
    s += joinVd(item);
  });
  s += '</g>';
  return s;
}

function joinVd(vd) {
  if(vd.type === 'item') {
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
    vd.children.forEach(item => {
      s += joinVd(item);
    });
    return `<g>${s}</g>`;
  }
  else if(vd.type === 'dom' || vd.type === 'geom') {
    let s = '<g>';
    vd.bb.forEach(item => {
      s += joinVd(item);
    });
    s += '</g><g>';
    vd.children.forEach(item => {
      s += joinVd(item);
    });
    s += '</g>';
    return `<g transform="${joinTransform(vd.transform)}">${s}</g>`;
  }
}

function joinTransform(transform) {
  let s = '';
  transform.forEach(item => {
    s += `${item[0]}(${item[1]}) `;
  });
  return s;
}

function joinDef(def) {
  let s = `<${def.tagName} id="${def.uuid}" gradientUnits="userSpaceOnUse"`;
  def.props.forEach(item => {
    s += ` ${item[0]}="${item[1]}"`;
  });
  s += '>';
  def.stop.forEach(item => {
    s += joinStop(item);
  });
  s += `</${def.tagName}>`;
  return s;
}

function joinStop(item) {
  return `<stop stop-color="${item[0]}" offset="${item[1] * 100}%"/>`;
}

function r2d(n) {
  return n * Math.PI / 180;
}

function rgb2int(color) {
  let res = [];
  if(color.charAt(0) === '#') {
    color = color.slice(1);
    if(color.length === 3) {
      res.push(parseInt(color.charAt(0) + color.charAt(0), 16));
      res.push(parseInt(color.charAt(1) + color.charAt(1), 16));
      res.push(parseInt(color.charAt(2) + color.charAt(2), 16));
    } else if(color.length === 6) {
      res.push(parseInt(color.slice(0, 2), 16));
      res.push(parseInt(color.slice(2, 4), 16));
      res.push(parseInt(color.slice(4), 16));
    }
  }
  else {
    let c = color.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)/i);
    if(c) {
      res = [parseInt(c[1]), parseInt(c[2]), parseInt(c[3])];
      if(c[4]) {
        res[3] = parseFloat(c[4]);
      }

    }
  }
  return res;
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
  let n = Array.isArray(obj) ? [] : {};
  for(let i in obj) {
    if(obj.hasOwnProperty(i)) {
      n[i] = clone(obj[i]);
    }
  }
  return n;
}

let util = {
  isObject: isType('Object'),
  isString: isType('String'),
  isFunction: isType('Function'),
  isNumber,
  isBoolean: isType('Boolean'),
  isDate: isType('Date'),
  stringify,
  joinSourceArray(arr) {
    return joinSourceArray(arr);
  },
  encodeHtml,
  isNil,
  joinVirtualDom,
  joinVd,
  joinTransform,
  joinDef,
  joinStop,
  r2d,
  rgb2int,
  arr2hash,
  hash2arr,
  clone,
};

export default util;
