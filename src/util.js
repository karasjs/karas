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
  if(vd.type === 'item') { console.log(vd);
    let props = vd.props;
    let s = '';
    for(let i in props) {
      if(props.hasOwnProperty(i)) {
        s += ` ${i}="${props[i]}"`;
      }
    }
    if(vd.tagName === 'text') {
      return `<text${s}>${vd.content}</text>`;
    }
    return `<${vd.tagName}${s}/>`;
  }
  else if(vd.type === 'text') {
    let s = ``;
    vd.children.forEach(item => {
      s += joinVirtualDom(item);
    });
    return `<g>${s}</g>`;
  }
  else if(vd.type === 'dom') {
    let s = '<g>';
    vd.bb.forEach(item => {
      s += joinVirtualDom(item);
    });
    s += '</g>';
    vd.children.forEach(item => {
      s += joinVirtualDom(item);
    });
    return `<g>${s}</g>`;
  }
  else if(vd.type === 'geom') {
    let s = '<g>';
    vd.bb.forEach(item => {
      s += joinVirtualDom(item);
    });
    s += '</g>';
    s += joinVirtualDom(vd.content);
    return `<g>${s}</g>`;
  }
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
};

export default util;
