let toString = {}.toString;
function isType(type) {
  return function(obj) {
    return toString.call(obj) === '[object ' + type + ']';
  }
}

let isNumber = isType('Number');

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
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
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
  s += '</g><g>';
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
    if(vd.props) {
      vd.props.forEach(item => {
        s += ` ${item[0]}="${item[1]}"`;
      });
    }
    s += '>';
    vd.children.forEach(item => {
      if(item.isMask) {
        return;
      }
      s += joinVd(item);
    });
    s += '</g>';
    return `<g opacity="${vd.opacity}" transform="${joinTransform(vd.transform)}"${vd.mask ? ` mask="${vd.mask}"` : ''}">${s}</g>`;
  }
  // display:none或visibility:hidden会没有type，产生一个空节点供diff运行
  return '<g></g>';
}

function joinTransform(transform) {
  let s = '';
  transform.forEach(item => {
    s += `${item[0]}(${item[1]}) `;
  });
  return s;
}

function joinDef(def) {
  let s = `<${def.tagName} id="${def.uuid}"`;
  if(def.tagName === 'mask') {
    s += ' maskUnits="userSpaceOnUse"';
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

function d2r(n) {
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
    }
    else if(color.length === 6) {
      res.push(parseInt(color.slice(0, 2), 16));
      res.push(parseInt(color.slice(2, 4), 16));
      res.push(parseInt(color.slice(4), 16));
    }
    res[3] = 1;
  }
  else if(color === 'transparent') {
    return [0, 0, 0, 0];
  }
  else {
    let c = color.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)/i);
    if(c) {
      res = [parseInt(c[1]), parseInt(c[2]), parseInt(c[3])];
      if(c[4]) {
        res[3] = parseFloat(c[4]);
      }
      else {
        res[3] = 1;
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
  if(util.isDate(obj)) {
    return new Date(obj);
  }
  let n = Array.isArray(obj) ? [] : {};
  for(let i in obj) {
    if(obj.hasOwnProperty(i)) {
      n[i] = clone(obj[i]);
    }
  }
  return n;
}

function mergeImageData(bottom, top) {
  let bd = bottom.data;
  let td = top.data;
  for(let i = 0, len = bd.length; i < len; i += 4) {
    let rb = bd[i];
    let gb = bd[i + 1];
    let bb = bd[i + 2];
    let ab = bd[i + 3];
    let rt = td[i];
    let gt = td[i + 1];
    let bt = td[i + 2];
    let at = td[i + 3];
    if(at === 0) {}
    else if(ab === 0 || at === 255) {
      bd[i] = rt;
      bd[i + 1] = gt;
      bd[i + 2] = bt;
      bd[i + 3] = at;
    }
    else {
      let alpha1 = ab / 255;
      let alpha2 = at / 255;
      let alpha3 = 1 - alpha1;
      let r = rb * alpha1 + rt * alpha2 * alpha3;
      let g = gb * alpha1 + gt * alpha2 * alpha3;
      let b = bb * alpha1 + bt * alpha2 * alpha3;
      let a = 1 - (1 - alpha1) * (1 - alpha2);
      if(a !== 0 && a !== 1) {
        r = r / a;
        g = g / a;
        b = b / a;
      }
      bd[i] = r;
      bd[i + 1] = g;
      bd[i + 2] = b;
      bd[i + 3] = a;
    }
  }
  return bottom;
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
  d2r,
  rgb2int,
  arr2hash,
  hash2arr,
  clone,
  mergeImageData,
};

export default util;
