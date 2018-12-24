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

function setFontStyle(style) {
  let { fontStyle, fontWeight, fontSize, fontFamily } = style;
  return `${fontStyle} ${fontWeight} ${fontSize}px/${fontSize}px ${fontFamily}`;
}

// 防止负数，同时百分比转为负数表示
function validStyle(style) {
  ['width', 'height'].forEach(k => {
    if(style.hasOwnProperty(k)) {
      let v = style[k];
      if(/%$/.test(v)) {
        v = parseFloat(v);
        if(v < 0) {
          v = 0;
          style[k] = 0;
        }
        else {
          style[k] = -v;
        }
      }
      else {
        if(v < 0) {
          style[k] = 0;
        }
      }
    }
  });
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
  setFontStyle,
  validStyle,
};

export default util;
