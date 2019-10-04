(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.karas = factory());
}(this, function () { 'use strict';

  class Node {
    constructor() {
      this.__x = 0;
      this.__y = 0;
      this.__ox = 0; // relative/margin:auto/text-align等造成的偏移量

      this.__oy = 0;
      this.__width = 0;
      this.__height = 0;
      this.__prev = null;
      this.__next = null;
      this.__ctx = null; // canvas的context

      this.__defs = null; // svg的defs

      this.__parent = null;
      this.__style = {}; // style被解析后的k-v形式

      this.__baseLine = 0;
      this.__virtualDom = {};
    }

    __offsetX(diff) {
      this.__ox += diff;
    }

    __offsetY(diff) {
      this.__oy += diff;
    }

    get x() {
      return this.__x;
    }

    get y() {
      return this.__y;
    }

    get ox() {
      return this.__ox;
    }

    get oy() {
      return this.__oy;
    }

    get rx() {
      return this.x + this.ox;
    }

    get ry() {
      return this.y + this.oy;
    }

    get width() {
      return this.__width;
    }

    get height() {
      return this.__height;
    }

    get outerWidth() {
      return this.__width;
    }

    get outerHeight() {
      return this.__height;
    }

    get prev() {
      return this.__prev;
    }

    get next() {
      return this.__next;
    }

    get parent() {
      return this.__parent;
    }

    get root() {
      if (this.parent) {
        return this.parent.root;
      }

      return this;
    }

    get style() {
      return this.__style;
    }

    get ctx() {
      return this.__ctx;
    }

    get defs() {
      return this.__defs;
    }

    get baseLine() {
      return this.__baseLine;
    }

    get virtualDom() {
      return this.__virtualDom;
    }

  }

  const CANVAS = 0;
  const SVG = 1;
  let div;
  var mode = {
    CANVAS,
    SVG,

    measure(s, style) {
      if (!div) {
        div = document.createElement('div');
        div.style.position = 'absolute';
        div.style.left = '99999px';
        div.style.top = '-99999px';
        div.style.visibility = 'hidden';
        document.body.appendChild(div);
      }

      div.style.fontSize = style.fontSize + 'px';
      div.style.fontFamily = style.fontFamily;
      div.innerText = s;
      let css = window.getComputedStyle(div, null);
      return parseFloat(css.width);
    }

  };

  var unit = {
    AUTO: 0,
    PX: 1,
    PERCENT: 2,
    POSITION: 3
  };

  let toString = {}.toString;

  function isType(type) {
    return function (obj) {
      return toString.call(obj) === '[object ' + type + ']';
    };
  }

  let isNumber = isType('Number');

  function joinSourceArray(arr) {
    var res = '';

    for (var i = 0, len = arr.length; i < len; i++) {
      var item = arr[i];

      if (Array.isArray(item)) {
        res += joinSourceArray(item);
      } else {
        res += stringify(item);
      }
    }

    return res;
  }

  function stringify(s) {
    if (isNil(s)) {
      return '';
    }

    return s.toString();
  }

  function encodeHtml(s, prop) {
    if (prop) {
      return s.replace(/"/g, '&quot;');
    }

    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  }

  function isNil(v) {
    return v === undefined || v === null;
  }

  function joinVirtualDom(vd, nd) {
    let s = '<defs>';
    nd.forEach(item => {
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
    if (vd.type === 'item') {
      let s = '';
      vd.props.forEach(item => {
        s += ` ${item[0]}="${item[1]}"`;
      });

      if (vd.tagName === 'text') {
        return `<text${s}>${vd.content}</text>`;
      }

      return `<${vd.tagName}${s}/>`;
    } else if (vd.type === 'text') {
      let s = ``;
      vd.children.forEach(item => {
        s += joinVd(item);
      });
      return `<g>${s}</g>`;
    } else if (vd.type === 'dom' || vd.type === 'geom') {
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

    if (color.charAt(0) === '#') {
      color = color.slice(1);

      if (color.length === 3) {
        res.push(parseInt(color.charAt(0) + color.charAt(0), 16));
        res.push(parseInt(color.charAt(1) + color.charAt(1), 16));
        res.push(parseInt(color.charAt(2) + color.charAt(2), 16));
      } else if (color.length === 6) {
        res.push(parseInt(color.slice(0, 2), 16));
        res.push(parseInt(color.slice(2, 4), 16));
        res.push(parseInt(color.slice(4), 16));
      }
    } else {
      let c = color.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)/i);

      if (c) {
        res = [parseInt(c[1]), parseInt(c[2]), parseInt(c[3])];

        if (c[4]) {
          res[3] = parseFloat(c[4]);
        }
      }
    }

    return res;
  }

  function arr2hash(arr) {
    let hash = {};

    for (let i = 0, len = arr.length; i < len; i++) {
      let item = arr[i];

      if (Array.isArray(item)) {
        hash[item[0]] = item[1];
      } else {
        for (let list = Object.keys(item), j = list.length - 1; j >= 0; j--) {
          let k = list[j];
          hash[k] = item[k];
        }
      }
    }

    return hash;
  }

  function hash2arr(hash) {
    if (Array.isArray(hash)) {
      return hash;
    }

    let arr = [];

    for (let list = Object.keys(hash), i = 0, len = list.length; i < len; i++) {
      let k = list[i];
      arr.push([k, hash[k]]);
    }

    return arr;
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
    hash2arr
  };

  function calMatrix(transform, transformOrigin, x, y, ow, oh) {
    let [ox, oy] = getOrigin(transformOrigin, x, y, ow, oh);
    let list = normalize(transform, ox, oy, ow, oh);
    let matrix = identity();
    matrix[12] = ox;
    matrix[13] = oy;
    list.forEach(item => {
      let [k, v] = item;
      let target = identity();

      if (k === 'translateX') {
        target[12] = v;
      } else if (k === 'translateY') {
        target[13] = v;
      } else if (k === 'scaleX') {
        target[0] = v;
      } else if (k === 'scaleY') {
        target[5] = v;
      } else if (k === 'skewX') {
        v = util.r2d(v);
        let tan = Math.tan(v);
        target[4] = tan;
      } else if (k === 'skewY') {
        v = util.r2d(v);
        let tan = Math.tan(v);
        target[1] = tan;
      } else if (k === 'rotateZ') {
        v = util.r2d(v);
        let sin = Math.sin(v);
        let cos = Math.cos(v);
        target[0] = target[5] = cos;
        target[1] = sin;
        target[4] = -sin;
      } else if (k === 'matrix') {
        target[0] = v[0];
        target[1] = v[1];
        target[4] = v[2];
        target[5] = v[3];
        target[12] = v[4];
        target[13] = v[5];
      }

      matrix = multiply(matrix, target);
    });
    let target = identity();
    target[12] = -ox;
    target[13] = -oy;
    matrix = multiply(matrix, target);
    return [matrix[0], matrix[1], matrix[4], matrix[5], matrix[12], matrix[13]];
  } // 生成4*4单位矩阵


  function identity() {
    const matrix = [];

    for (let i = 0; i < 16; i++) {
      matrix.push(i % 5 === 0 ? 1 : 0);
    }

    return matrix;
  } // 矩阵a*b


  function multiply(a, b) {
    let res = [];

    for (let i = 0; i < 4; i++) {
      const row = [a[i], a[i + 4], a[i + 8], a[i + 12]];

      for (let j = 0; j < 4; j++) {
        let k = j * 4;
        let col = [b[k], b[k + 1], b[k + 2], b[k + 3]];
        let n = row[0] * col[0] + row[1] * col[1] + row[2] * col[2] + row[3] * col[3];
        res[i + k] = n;
      }
    }

    return res;
  }

  function transformPoint(matrix, x, y) {
    let [a, b, c, d, e, f] = matrix;
    return [a * x + c * y + e, b * x + d * y + f];
  } // 向量积


  function vectorProduct(x1, y1, x2, y2) {
    return x1 * y2 - x2 * y1;
  }

  function pointInQuadrilateral(x, y, x1, y1, x2, y2, x3, y3, x4, y4, matrix) {
    if (matrix) {
      [x1, y1] = transformPoint(matrix, x1, y1);
      [x2, y2] = transformPoint(matrix, x2, y2);
      [x3, y3] = transformPoint(matrix, x3, y3);
      [x4, y4] = transformPoint(matrix, x4, y4);

      if (vectorProduct(x2 - x1, y2 - y1, x - x1, y - y1) > 0 && vectorProduct(x4 - x2, y4 - y2, x - x2, y - y2) > 0 && vectorProduct(x3 - x4, y3 - y4, x - x4, y - y4) > 0 && vectorProduct(x1 - x3, y1 - y3, x - x3, y - y3) > 0) {
        return true;
      }
    } else {
      return x >= x1 && y >= y1 && x <= x4 && y <= y4;
    }
  }

  function normalize(transform, ox, oy, w, h) {
    let res = [];
    transform.forEach(item => {
      let [k, v] = item;

      if (k === 'translateX') {
        if (v.unit === unit.PERCENT) {
          res.push([item[0], v.value * w * 0.01]);
        } else {
          res.push([item[0], item[1].value]);
        }
      } else if (k === 'translateY') {
        if (v.unit === unit.PERCENT) {
          res.push([item[0], v.value * h * 0.01]);
        } else {
          res.push([item[0], item[1].value]);
        }
      } else {
        res.push([item[0], item[1]]);
      }
    });
    return res;
  }

  function getOrigin(transformOrigin, x, y, w, h) {
    let tfo = [];
    transformOrigin.forEach((item, i) => {
      if (item.unit === unit.PX) {
        tfo.push(item.value);
      } else if (item.unit === unit.PERCENT) {
        tfo.push((i ? y : x) + item.value * (i ? h : w) * 0.01);
      } else if (item.value === 'left') {
        tfo.push(x);
      } else if (item.value === 'right') {
        tfo.push(x + w);
      } else if (item.value === 'top') {
        tfo.push(y);
      } else if (item.value === 'bottom') {
        tfo.push(y + h);
      } else {
        tfo.push(i ? y + h * 0.5 : x + w * 0.5);
      }
    });
    return tfo;
  }

  function mergeMatrix(a, b) {
    let m1 = identity();
    m1[0] = a[0];
    m1[1] = a[1];
    m1[4] = a[2];
    m1[5] = a[3];
    m1[12] = a[4];
    m1[13] = a[5];
    let m2 = identity();
    m2[0] = b[0];
    m2[1] = b[1];
    m2[4] = b[2];
    m2[5] = b[3];
    m2[12] = b[4];
    m2[13] = b[5];
    let matrix = multiply(m1, m2);
    return [matrix[0], matrix[1], matrix[4], matrix[5], matrix[12], matrix[13]];
  }

  var tf = {
    calMatrix,
    pointInQuadrilateral,
    mergeMatrix
  };

  function getLinearDeg(v) {
    let deg = 180;

    if (v[0] === 'to top') {
      deg = 0;
    } else if (v[0] === 'to top right') {
      deg = 45;
    } else if (v[0] === 'to right') {
      deg = 90;
    } else if (v[0] === 'to bottom right') {
      deg = 135;
    } else if (v[0] === 'to bottom') ; else if (v[0] === 'to bottom left') {
      deg = 225;
    } else if (v[0] === 'to left') {
      deg = 270;
    } else if (v[0] === 'to top left') {
      deg = 315;
    } // 数字角度，没有的话取默认角度
    else {
        let match = /([\d.]+)deg/.exec(v[0]);

        if (match) {
          deg = parseFloat(match[1]);
        } else {
          v.unshift(null);
        }
      }

    return deg % 360;
  } // 获取color-stop区间范围，去除无用值


  function getColorStop(v, length) {
    let list = []; // 先把已经声明距离的换算成[0,1]以数组形式存入，未声明的原样存入

    for (let i = 1, len = v.length; i < len; i++) {
      let item = v[i]; // 考虑是否声明了位置

      let arr = item.trim().split(/\s+/);

      if (arr.length > 1) {
        let c = arr[0];
        let p = arr[1];

        if (/%$/.test(p)) {
          list.push([c, parseFloat(p) * 0.01]);
        } else {
          list.push([c, parseFloat(p) / length]);
        }
      } else {
        list.push(arr[0]);
      }
    } // 首尾不声明默认为[0, 1]


    if (list.length > 1) {
      if (!Array.isArray(list[0])) {
        list[0] = [list[0], 0];
      }

      if (!Array.isArray(list[list.length - 1])) {
        list[list.length - 1] = [list[list.length - 1], 1];
      }
    } else if (!Array.isArray(list[0])) {
      list[0] = [list[0], 0];
    } // 不是数组形式的是未声明的，需区间计算，找到连续的未声明的，前后的区间平分


    let start = list[0][1];

    for (let i = 1, len = list.length; i < len - 1; i++) {
      let item = list[i];

      if (Array.isArray(item)) {
        start = item[1];
      } else {
        let j = i + 1;
        let end = list[list.length - 1][1];

        for (; j < len - 1; j++) {
          let item = list[j];

          if (Array.isArray(item)) {
            end = item[1];
            break;
          }
        }

        let num = j - i + 1;
        let per = (end - start) / num;

        for (let k = i; k < j; k++) {
          let item = list[k];
          list[k] = [item, start + per * (k + 1 - i)];
        }

        i = j;
      }
    } // 每个不能小于前面的，canvas/svg不能兼容这种情况，需处理


    for (let i = 1, len = list.length; i < len; i++) {
      let item = list[i];
      let prev = list[i - 1];

      if (item[1] < prev[1]) {
        item[1] = prev[1];
      }
    } // 0之前的和1之后的要过滤掉


    for (let i = 0, len = list.length; i < len - 1; i++) {
      let item = list[i];

      if (item[1] > 1) {
        list.splice(i + 1);
        break;
      }
    }

    for (let i = list.length - 1; i > 0; i--) {
      let item = list[i];

      if (item[1] < 0) {
        list.splice(0, i);
        break;
      }
    } // 可能存在超限情况，如在使用px单位超过len或<len时，canvas会报错超过[0,1]区间，需手动换算至区间内


    let len = list.length; // 在只有1个的情况下可简化

    if (len === 1) {
      list[0][1] = 0;
    } else {
      // 全部都在[0,1]之外也可以简化
      let allBefore = true;
      let allAfter = true;

      for (let i = len - 1; i >= 0; i--) {
        let item = list[i];
        let p = item[1];

        if (p > 0) {
          allBefore = false;
        }

        if (p < 1) {
          allAfter = false;
        }
      }

      if (allBefore) {
        list.splice(0, len - 1);
        list[0][1] = 0;
      } else if (allAfter) {
        list.splice(1);
        list[0][1] = 0;
      } // 部分在区间之外需复杂计算
      else {
          let first = list[0];
          let last = list[len - 1]; // 只要2个的情况下就是首尾都落在外面

          if (len === 2) {
            if (first[1] < 0 && last[1] > 1) {
              getCsLimit(first, last, length);
            }
          } // 只有1个在外面的情况较为容易
          else {
              if (first[1] < 0) {
                let next = list[1];
                let c1 = util.rgb2int(first[0]);
                let c2 = util.rgb2int(next[0]);
                let c = getCsStartLimit(c1, first[1], c2, next[1], length);
                first[0] = `rgba(${c[0]},${c[1]},${c[2]},${c[3]})`;
                first[1] = 0;
              }

              if (last[1] > 1) {
                let prev = list[len - 2];
                let c1 = util.rgb2int(prev[0]);
                let c2 = util.rgb2int(last[0]);
                let c = getCsEndLimit(c1, prev[1], c2, last[1], length);
                last[0] = `rgba(${c[0]},${c[1]},${c[2]},${c[3]})`;
                last[1] = 1;
              }
            }
        }
    } // 防止精度计算溢出[0,1]


    list.forEach(item => {
      if (item[1] < 0) {
        item[1] = 0;
      } else if (item[1] > 1) {
        item[1] = 1;
      }
    });
    return list;
  } // 根据角度和圆心获取渐变的4个点坐标


  function calLinearCoords(deg, length, cx, cy) {
    let x0;
    let y0;
    let x1;
    let y1;

    if (deg >= 270) {
      let r = util.r2d(360 - deg);
      x0 = cx + Math.sin(r) * length;
      y0 = cy + Math.cos(r) * length;
      x1 = cx - Math.sin(r) * length;
      y1 = cy - Math.cos(r) * length;
    } else if (deg >= 180) {
      let r = util.r2d(deg - 180);
      x0 = cx + Math.sin(r) * length;
      y0 = cy - Math.cos(r) * length;
      x1 = cx - Math.sin(r) * length;
      y1 = cy + Math.cos(r) * length;
    } else if (deg >= 90) {
      let r = util.r2d(180 - deg);
      x0 = cx - Math.sin(r) * length;
      y0 = cy - Math.cos(r) * length;
      x1 = cx + Math.sin(r) * length;
      y1 = cy + Math.cos(r) * length;
    } else {
      let r = util.r2d(deg);
      x0 = cx - Math.sin(r) * length;
      y0 = cy + Math.cos(r) * length;
      x1 = cx + Math.sin(r) * length;
      y1 = cy - Math.cos(r) * length;
    }

    return [x0, y0, x1, y1];
  } // 获取径向渐变半径


  function calRadialRadius(v, iw, ih, cx, cy, x1, y1, x2, y2) {
    let size = 'farthest-corner';
    let r; // 半径

    if (/circle|ellipse|at|closest|farthest/i.test(v[0]) || !/#[0-9a-f]{3,6}/i.test(v[0]) && !/\brgba?\(.*\)/i.test(v[0])) {
      let i = v[0].indexOf('at');
      let at;
      let s;

      if (i > -1) {
        at = v[0].slice(i + 2);
        s = v[0].slice(0, i - 1);
      }

      s = /(closest|farthest)-(side|corner)/.exec(s);

      if (s) {
        size = s[0];
      } // 指定宽高后size失效，置null标识
      else {
          s = /\s+(-?[\d.]+(?:px|%))\s*(-?[\d.]+(?:px|%))?/.exec(s);

          if (s) {
            size = null;

            if (s[1].indexOf('px') > -1) {
              r = parseFloat(s[1]) * 0.5;
            } else {
              r = parseFloat(s[1]) * iw * 0.005;
            }
          }
        }

      if (at) {
        s = /\s+(-?[\d.]+(?:px|%))\s*(-?[\d.]+(?:px|%))?/.exec(at);

        if (s) {
          if (s[1].indexOf('px') > -1) {
            cx = x1 + parseFloat(s[1]);
          } else {
            cx = x1 + parseFloat(s[1]) * iw * 0.01;
          } // y可以省略，此时等同于x


          let by = s[2] || s[1];

          if (by.indexOf('px') > -1) {
            cy = y1 + parseFloat(by);
          } else {
            cy = y1 + parseFloat(by) * ih * 0.01;
          }
        }
      }
    } else {
      v.unshift(null);
    }

    if (size) {
      if (size === 'closest-side') {
        // 在边外特殊情况只有end颜色填充
        if (cx <= x1 || cx >= x2 || cy <= y1 || cy >= y2) {
          r = 0;
        } else {
          let xl;
          let yl;

          if (cx < x1 + iw * 0.5) {
            xl = cx - x1;
          } else {
            xl = x2 - cx;
          }

          if (cy < y1 + ih * 0.5) {
            yl = cy - y1;
          } else {
            yl = y2 - cy;
          }

          r = Math.min(xl, yl);
        }
      } else if (size === 'closest-corner') {
        let xl;
        let yl;

        if (cx < x1 + iw * 0.5) {
          xl = cx - x1;
        } else {
          xl = x2 - cx;
        }

        if (cy < y1 + ih * 0.5) {
          yl = cy - y1;
        } else {
          yl = y2 - cy;
        }

        r = Math.sqrt(Math.pow(xl, 2) + Math.pow(yl, 2));
      } else if (size === 'farthest-side') {
        if (cx <= x1) {
          r = x1 - cx + iw;
        } else if (cx >= x2) {
          r = cx - x2 + iw;
        } else if (cy <= y1) {
          r = y1 - cy + ih;
        } else if (cx >= y2) {
          r = cy - y2 + ih;
        } else {
          let xl = Math.max(x2 - cx, cx - x1);
          let yl = Math.max(y2 - cy, cy - y1);
          r = Math.max(xl, yl);
        }
      } // 默认farthest-corner
      else {
          let xl;
          let yl;

          if (cx < x1 + iw * 0.5) {
            xl = x2 - cx;
          } else {
            xl = cx - x1;
          }

          if (cy < y1 + ih * 0.5) {
            yl = y2 - cy;
          } else {
            yl = cy - y1;
          }

          r = Math.sqrt(Math.pow(xl, 2) + Math.pow(yl, 2));
        }
    }

    return [r, cx, cy];
  } // 当linear-gradient的值超过[0,1]区间限制时，计算其对应区间1的值


  function getCsStartLimit(c1, p1, c2, p2, length) {
    let [r1, g1, b1, a1 = 1] = c1;
    let [r2, g2, b2, a2 = 1] = c2;
    let l1 = Math.abs(p1) * length;
    let l2 = p2 * length;
    let p = l1 / (l2 + l1);
    let r = Math.floor(r1 + (r2 - r1) * p);
    let g = Math.floor(g1 + (g2 - g1) * p);
    let b = Math.floor(b1 + (b2 - b1) * p);
    let a = a1 + (a2 - a1) * p;
    return [r, g, b, a];
  }

  function getCsEndLimit(c1, p1, c2, p2, length) {
    let [r1, g1, b1, a1 = 1] = c1;
    let [r2, g2, b2, a2 = 1] = c2;
    let l1 = p1 * length;
    let l2 = p2 * length;
    let p = (length - l1) / (l2 - l1);
    let r = Math.floor(r1 + (r2 - r1) * p);
    let g = Math.floor(g1 + (g2 - g1) * p);
    let b = Math.floor(b1 + (b2 - b1) * p);
    let a = a1 + (a2 - a1) * p;
    return [r, g, b, a];
  }

  function getCsLimit(first, last, length) {
    let c1 = util.rgb2int(first[0]);
    let c2 = util.rgb2int(last[0]);
    let [r1, g1, b1, a1 = 1] = c1;
    let [r2, g2, b2, a2 = 1] = c2;
    let l1 = Math.abs(first[1]) * length;
    let l2 = last[1] * length;
    let p = l1 / (l1 + l2);
    let r = Math.floor(r1 + (r2 - r1) * p);
    let g = Math.floor(g1 + (g2 - g1) * p);
    let b = Math.floor(b1 + (b2 - b1) * p);
    let a = a1 + (a2 - a1) * p;
    first[0] = `rgba(${r},${g},${b},${a})`;
    first[1] = 0;
    p = (length + l1) / (l1 + l2);
    r = Math.floor(r1 + (r2 - r1) * p);
    g = Math.floor(g1 + (g2 - g1) * p);
    b = Math.floor(b1 + (b2 - b1) * p);
    a = a1 + (a2 - a1) * p;
    last[0] = `rgba(${r},${g},${b},${a})`;
    last[1] = 1;
  }

  function parseGradient(s) {
    let gradient = /\b(\w+)-gradient\((.+)\)/.exec(s);

    if (gradient) {
      let v = gradient[2].match(/(#[0-9a-f]{3,6})|(rgba?\(.+?\))/ig);
      return {
        k: gradient[1],
        v
      };
    }
  }

  function getLinear(v, cx, cy, w, h) {
    let deg = getLinearDeg(v);
    let theta = util.r2d(deg);
    let length = Math.abs(w * Math.sin(theta)) + Math.abs(h * Math.cos(theta));
    let [x1, y1, x2, y2] = calLinearCoords(deg, length * 0.5, cx, cy);
    let stop = getColorStop(v, length);
    return {
      x1,
      y1,
      x2,
      y2,
      stop
    };
  }

  function getRadial(v, cx, cy, x1, y1, x2, y2) {
    let w = x2 - x1;
    let h = y2 - y1;
    let [r, cx2, cy2] = calRadialRadius(v, w, h, cx, cy, x1, y1, x2, y2);
    let stop = getColorStop(v, r * 2); // 超限情况等同于只显示end的bgc

    if (r <= 0) {
      let end = stop[stop.length - 1];
      end[1] = 0;
      stop = [end];
      cx2 = x1;
      cy2 = y1; // 肯定大于最长直径

      r = w + h;
    }

    return {
      cx: cx2,
      cy: cy2,
      r,
      stop
    };
  }

  var gradient = {
    parseGradient,
    getLinear,
    getRadial
  };

  /* 获取合适的虚线实体空白宽度ps/pd和数量n
   * 总长total，start边长bs，end边长be，内容长w，
   * 实体长范围[smin,smax]，空白长范围[dmin,dmax]
   */
  function calFitDashed(total, bs, be, w, smin, smax, dmin, dmax) {
    let n = 1;
    let ps = 1;
    let pd = 1; // 从最大实体空白长开始尝试

    outer: for (let i = smax; i >= smin; i--) {
      for (let j = dmax; j >= dmin; j--) {
        // 已知实体空白长度，n实体和n-1空白组成total，计算获取n数量
        let per = i + j;
        let num = Math.floor((total + j) / per);
        let k = j; // 可能除不尽，此时扩展空白长

        if (num * per < j + total) {
          let free = total - num * i;
          k = free / (num - 1);

          if (k > dmax) {
            continue;
          }
        }

        per = i + k; // bs比实体大才有效，因为小的话必定和第一个实体完整相连

        if (bs > 1 && bs > i) {
          let mo = bs % per;

          if (mo > i) {
            continue;
          }

          if (be > 1) {
            let mo = (bs + w) % per;

            if (mo > i) {
              continue;
            }
          }
        }

        if (be > 1) {
          let mo = (bs + w) % per;

          if (mo > i) {
            continue;
          }
        }

        if (num > 0) {
          n = num;
          ps = i;
          pd = k;
        }

        break outer;
      }
    }

    return {
      n,
      ps,
      pd
    };
  } // dashed时n个实线和n-1虚线默认以3:1宽度组成，dotted则是n和n以1:1组成


  function calDashed(style, m1, m2, m3, m4, bw) {
    let total = m4 - m1;
    let w = m3 - m2;
    let bs = m2 - m1;
    let be = m4 - m3;

    if (style === 'dotted') {
      return calFitDashed(total, bs, be, w, bw, bw, Math.max(1, bw * 0.25), bw * 2);
    } else {
      let {
        n,
        ps,
        pd
      } = calFitDashed(total, bs, be, w, bw, bw * 3, Math.max(1, bw * 0.25), bw * 2);

      if (n === 1) {
        return calFitDashed(total, bs, be, w, bw, bw, Math.max(1, bw * 0.25), bw * 2);
      } // 降级为dotted


      return {
        n,
        ps,
        pd
      };
    }
  } // 获取边框分割为几块的坐标，虚线分割为若干四边形和三边型
  // direction为上右下左0123


  function calPoints(borderWidth, borderStyle, deg1, deg2, x1, x2, x3, x4, y1, y2, y3, y4, direction) {
    let points = [];

    if (['dashed', 'dotted'].indexOf(borderStyle) > -1) {
      // 寻找一个合适的虚线线段长度和之间空白边距长度
      let {
        n,
        ps,
        pd
      } = direction === 0 || direction === 2 ? calDashed(borderStyle, x1, x2, x3, x4, borderWidth) : calDashed(borderStyle, y1, y2, y3, y4, borderWidth);

      if (n > 1) {
        for (let i = 0; i < n; i++) {
          // 最后一个可能没有到底，延长之
          let isLast = i === n - 1;
          let main1;
          let main2;
          let cross1;
          let cross2;

          if (direction === 0 || direction === 2) {
            main1 = i ? x1 + ps * i + pd * i : x1;
          } else {
            main1 = i ? y1 + ps * i + pd * i : y1;
          }

          main2 = main1 + ps;

          if (direction === 0) {
            // 整个和borderLeft重叠
            if (main2 < x2) {
              if (isLast) {
                points.push([x1, y1, x4, y1, x3, y2, x2, y2]);
              } else {
                cross1 = y1 + (main1 - x1) * Math.tan(deg1);
                cross2 = y1 + (main2 - x1) * Math.tan(deg1);
                points.push([main1, y1, main2, y1, main2, cross2, main1, cross1]);
              }
            } // 整个和borderRight重叠
            else if (main1 > x3) {
                cross1 = y1 + (x4 - main1) * Math.tan(deg2);
                cross2 = y1 + (x4 - main2) * Math.tan(deg2);

                if (isLast) {
                  points.push([main1, y1, x4, y1, main1, cross1]);
                } else {
                  points.push([main1, y1, main2, y1, main2, cross2, main1, cross1]);
                }
              } // 不被整个重叠的情况再细分
              else {
                  // 上部分和borderLeft重叠
                  if (main1 < x2) {
                    cross1 = y1 + (main1 - x1) * Math.tan(deg1);

                    if (isLast) {
                      points.push([main1, y1, x4, y1, x3, y2, x2, y2, main1, cross1]);
                    } else {
                      // 下部分和borderRight重叠
                      if (main2 > x3) {
                        points.push([main1, y1, main2, y1, x3, y2, x2, y2, main1, cross1]);
                      } // 下部独立
                      else {
                          points.push([main1, y1, main2, y1, main2, y2, x2, y2, main1, cross1]);
                        }
                    }
                  } // 下部分和borderRight重叠
                  else if (main2 > x3) {
                      cross1 = y1 + (x4 - main2) * Math.tan(deg2); // 上部分和borderLeft重叠

                      if (main1 < x2) {
                        if (isLast) {
                          points.push([main1, y1, x4, y1, x3, y2, x2, y2, main1, cross1]);
                        } else {
                          points.push([main1, y1, main2, y1, main2, cross1, x3, y2, x2, y2, main1, cross1]);
                        }
                      } // 上部独立
                      else {
                          if (isLast) {
                            points.push([main1, y1, x4, y1, x3, y2, main1, y2]);
                          } else {
                            points.push([main1, y1, main2, y1, main2, cross1, x3, y2, main1, y2]);
                          }
                        }
                    } // 完全独立
                    else {
                        if (isLast) {
                          points.push([main1, y1, x4, y1, x3, y2, main1, y2]);
                        } else {
                          points.push([main1, y1, main2, y1, main2, y2, main1, y2]);
                        }
                      }
                }
          } else if (direction === 1) {
            // 整个和borderTop重叠
            if (main2 < y2) {
              if (isLast) {
                points.push([x3, y2, x4, y1, x4, y4, x3, y3]);
              } else {
                cross1 = x4 - (main2 - y1) * Math.tan(deg1);
                cross2 = x4 - (main1 - y1) * Math.tan(deg1);
                points.push([cross1, main2, cross2, main1, x4, main1, x4, main2]);
              }
            } // 整个和borderBottom重叠
            else if (main1 > y3) {
                cross1 = x3 + (main1 - y3) * Math.tan(deg2);
                cross2 = x3 + (main2 - y3) * Math.tan(deg2);

                if (isLast) {
                  points.push([cross1, main1, x4, main1, x4, y4]);
                } else {
                  points.push([cross1, main1, x4, main1, x4, main2, cross2, main2]);
                }
              } // 不被整个重叠的情况再细分
              else {
                  // 上部分和borderTop重叠
                  if (main1 < y2) {
                    cross1 = x3 + (y2 - main1) * Math.tan(deg1);

                    if (isLast) {
                      points.push([x3, y2, cross1, main1, x4, main1, x4, y4, x3, y4]);
                    } else {
                      // 下部分和borderBottom重叠
                      if (main2 > y3) {
                        points.push([x3, y2, cross1, main1, x4, main1, x4, main2, cross1, main2, x3, y3]);
                      } // 下部独立
                      else {
                          points.push([x3, y2, cross1, main1, x4, main1, x4, main2, x3, main2]);
                        }
                    }
                  } // 下部分和borderBottom重叠
                  else if (main2 > y3) {
                      cross1 = x3 + (main2 - y3) * Math.tan(deg2); // 上部分和borderTop重叠

                      if (main1 < y2) {
                        if (isLast) {
                          points.push([x3, y2, cross1, main1, x4, main1, x4, y4, x3, y3]);
                        } else {
                          points.push([x3, y2, cross1, main1, x4, main1, x4, main2, cross1, main2, x3, y3]);
                        }
                      } // 上部独立
                      else {
                          if (isLast) {
                            points.push([x3, main1, x4, main1, x4, y4, x3, y3]);
                          } else {
                            points.push([x3, main1, x4, main1, x4, main2, cross1, main2, x3, y3]);
                          }
                        }
                    } // 完全独立
                    else {
                        if (isLast) {
                          points.push([x3, main1, x4, main1, x4, y4, x3, y3]);
                        } else {
                          points.push([x3, main1, x4, main1, x4, main2, x3, main2]);
                        }
                      }
                }
          } else if (direction === 2) {
            // 整个和borderLeft重叠
            if (main2 < x2) {
              if (isLast) {
                points.push([x1, y4, x2, y3, x3, y3, x4, y4]);
              } else {
                cross1 = y4 - (main1 - x1) * Math.tan(deg1);
                cross2 = y4 - (main2 - x1) * Math.tan(deg1);
                points.push([main1, cross1, main2, cross2, main2, y4, main1, y4]);
              }
            } // 整个和borderRight重叠
            else if (main1 > x3) {
                cross1 = y4 - (main1 - x1) * Math.tan(deg2);
                cross2 = y4 - (main2 - x1) * Math.tan(deg2);

                if (isLast) {
                  points.push([main1, cross1, x4, y4, main1, y4]);
                } else {
                  points.push([main1, cross1, main2, cross2, main2, y4, main1, y4]);
                }
              } // 不被整个重叠的情况再细分
              else {
                  // 上部分和borderLeft重叠
                  if (main1 < x2) {
                    cross1 = y3 + (main1 - x1) * Math.tan(deg1);

                    if (isLast) {
                      points.push([main1, cross1, x2, y3, x3, y3, x4, y4, main1, y4]);
                    } else {
                      // 下部分和borderRight重叠
                      if (main2 > x3) {
                        points.push([main1, cross1, x2, y3, x3, y3, main2, y4, main1, y4]);
                      } // 下部独立
                      else {
                          points.push([main1, cross1, x2, y3, main2, y3, main2, y4, main1, y4]);
                        }
                    }
                  } // 下部分和borderRight重叠
                  else if (main2 > x3) {
                      cross1 = y4 - (x4 - main2) * Math.tan(deg2); // 上部分和borderLeft重叠

                      if (main1 < x2) {
                        if (isLast) {
                          points.push([main1, cross1, x3, y3, x4, y4, main1, y4]);
                        } else {
                          points.push([main1, cross1, x3, y3, main2, cross1, main2, y4, main1, y4]);
                        }
                      } // 上部独立
                      else {
                          if (isLast) {
                            points.push([main1, y3, x3, y3, x4, y4, main1, y4]);
                          } else {
                            points.push([main1, y3, x3, y3, main2, cross1, main2, y4, main1, y4]);
                          }
                        }
                    } // 完全独立
                    else {
                        if (isLast) {
                          points.push([main1, y3, x3, y3, x4, y4, main1, y4]);
                        } else {
                          points.push([main1, y3, main2, y3, main2, y4, main1, y4]);
                        }
                      }
                }
          } else if (direction === 3) {
            // 整个和borderTop重叠
            if (main2 < y2) {
              if (isLast) {
                points.push([x1, y1, x2, y2, x2, y3, x1, y4]);
              } else {
                cross1 = x1 + (main1 - y1) * Math.tan(deg1);
                cross2 = x1 + (main2 - y1) * Math.tan(deg1);
                points.push([x1, main1, cross1, main1, cross2, main2, x1, main2]);
              }
            } // 整个和borderBottom重叠
            else if (main1 > y3) {
                cross1 = x1 + (y4 - main1) * Math.tan(deg2);
                cross2 = x1 + (y4 - main2) * Math.tan(deg2);

                if (isLast) {
                  points.push([x1, main1, cross1, main1, x1, y4]);
                } else {
                  points.push([x1, main1, cross1, main1, cross2, main2, x1, main2]);
                }
              } // 不被整个重叠的情况再细分
              else {
                  // 上部分和borderTop重叠
                  if (main1 < y2) {
                    cross1 = x1 + (main1 - y1) * Math.tan(deg1);

                    if (isLast) {
                      points.push([x1, main1, cross1, main1, x2, y2, x2, y3, x1, y4]);
                    } else {
                      // 下部分和borderBottom重叠
                      if (main2 > y3) {
                        points.push([x1, main1, cross1, main1, x2, y2, x2, y3, cross1, main2, x1, main2]);
                      } // 下部独立
                      else {
                          points.push([x1, main1, cross1, main1, x2, y2, x2, main2, x1, main2]);
                        }
                    }
                  } // 下部分和borderBottom重叠
                  else if (main2 > y3) {
                      cross1 = x1 + (y4 - main2) * Math.tan(deg2); // 上部分和borderTop重叠

                      if (main1 < y2) {
                        if (isLast) {
                          points.push([x1, main1, cross1, main1, x2, y2, x2, y3, x1, y4]);
                        } else {
                          points.push([x1, main1, cross1, main1, x2, y2, x2, y3, cross1, main2, x1, main2]);
                        }
                      } // 上部独立
                      else {
                          if (isLast) {
                            points.push([x1, main1, x2, main1, x2, y3, x1, y4]);
                          } else {
                            points.push([x1, main1, x2, main1, x2, y3, cross1, main2, x1, main2]);
                          }
                        }
                    } // 完全独立
                    else {
                        if (isLast) {
                          points.push([x1, main1, x2, main1, x2, y3, x1, y4]);
                        } else {
                          points.push([x1, main1, x2, main1, x2, main2, x1, main2]);
                        }
                      }
                }
          }
        }

        return points;
      }
    } // 兜底返回实线


    if (direction === 0) {
      points.push([x1, y1, x4, y1, x3, y2, x2, y2]);
    } else if (direction === 1) {
      points.push([x3, y2, x4, y1, x4, y4, x3, y3]);
    } else if (direction === 2) {
      points.push([x1, y4, x2, y3, x3, y3, x4, y4]);
    } else if (direction === 3) {
      points.push([x1, y1, x2, y2, x2, y3, x1, y4]);
    }

    return points;
  }

  var border = {
    calDashed,
    calPoints
  };

  function renderBorder(renderMode, points, color, ctx, xom) {
    if (renderMode === mode.CANVAS) {
      points.forEach(point => {
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.moveTo(point[0], point[1]);

        for (let i = 2, len = point.length; i < len; i += 2) {
          ctx.lineTo(point[i], point[i + 1]);
        }

        ctx.fill();
        ctx.closePath();
      });
    } else if (renderMode === mode.SVG) {
      let s = '';
      points.forEach(point => {
        s += `M ${point[0]} ${point[1]}`;

        for (let i = 2, len = point.length; i < len; i += 2) {
          s += `L ${point[i]} ${point[i + 1]} `;
        }
      });
      xom.addBorder([['d', s], ['fill', color]]);
    }
  }

  class Xom extends Node {
    constructor(tagName, props) {
      super();
      props = props || []; // 构建工具中都是arr，手写可能出现hash情况

      if (Array.isArray(props)) {
        this.props = util.arr2hash(props);
        this.__props = props;
      } else {
        this.props = props;
        this.__props = util.hash2arr(props);
      }

      this.__tagName = tagName;
      this.__style = this.props.style || {}; // style被解析后的k-v形式

      this.__listener = {};

      this.__props.forEach(item => {
        let k = item[0];

        if (/^on[a-zA-Z]/.test(k)) {
          this.__listener[k.slice(2).toLowerCase()] = item[1];
        }
      }); // margin和padding的宽度


      this.__mtw = 0;
      this.__mrw = 0;
      this.__mbw = 0;
      this.__mlw = 0;
      this.__ptw = 0;
      this.__prw = 0;
      this.__pbw = 0;
      this.__plw = 0;
      this.__matrix = null;
      this.__matrixEvent = null;
    }

    __layout(data) {
      let {
        w
      } = data;
      let {
        style: {
          display,
          width,
          marginTop,
          marginRight,
          marginBottom,
          marginLeft,
          paddingTop,
          paddingRight,
          paddingBottom,
          paddingLeft
        }
      } = this;

      if (display === 'none') {
        return;
      }

      if (width && width.unit !== unit.AUTO) {
        switch (width.unit) {
          case unit.PX:
            w = width.value;
            break;

          case unit.PERCENT:
            w *= width.value * 0.01;
            break;
        }
      }

      this.__mlw = this.__mpWidth(marginLeft, w);
      this.__mtw = this.__mpWidth(marginTop, w);
      this.__mrw = this.__mpWidth(marginRight, w);
      this.__mbw = this.__mpWidth(marginBottom, w);
      this.__plw = this.__mpWidth(paddingLeft, w);
      this.__ptw = this.__mpWidth(paddingTop, w);
      this.__prw = this.__mpWidth(paddingRight, w);
      this.__pbw = this.__mpWidth(paddingBottom, w);

      if (display === 'block') {
        this.__layoutBlock(data);
      } else if (display === 'flex') {
        this.__layoutFlex(data);
      } else if (display === 'inline') {
        this.__layoutInline(data);
      }
    }

    isGeom() {
      return this.tagName.charAt(0) === '$';
    } // 获取margin/padding的实际值


    __mpWidth(mp, w) {
      if (mp.unit === unit.PX) {
        return mp.value;
      } else if (mp.unit === unit.PERCENT) {
        return mp.value * w * 0.01;
      }

      return 0;
    }

    __preLayout(data) {
      let {
        x,
        y,
        w,
        h
      } = data;
      this.__x = x;
      this.__y = y;
      let {
        style,
        mlw,
        mtw,
        mrw,
        mbw,
        plw,
        ptw,
        prw,
        pbw
      } = this;
      let {
        width,
        height,
        borderTopWidth,
        borderRightWidth,
        borderBottomWidth,
        borderLeftWidth
      } = style; // 除了auto外都是固定宽高度

      let fixedWidth;
      let fixedHeight;

      if (width && width.unit !== unit.AUTO) {
        fixedWidth = true;

        switch (width.unit) {
          case unit.PX:
            w = width.value;
            break;

          case unit.PERCENT:
            w *= width.value * 0.01;
            break;
        }
      }

      if (height && height.unit !== unit.AUTO) {
        fixedHeight = true;

        switch (height.unit) {
          case unit.PX:
            h = height.value;
            break;

          case unit.PERCENT:
            h *= height.value * 0.01;
            break;
        }
      } // margin/padding/border影响x和y和尺寸


      x += borderLeftWidth.value + mlw + plw;
      data.x = x;
      y += borderTopWidth.value + mtw + ptw;
      data.y = y;

      if (width.unit === unit.AUTO) {
        w -= borderLeftWidth.value + borderRightWidth.value + mlw + mrw + plw + prw;
      }

      if (height.unit === unit.AUTO) {
        h -= borderTopWidth.value + borderBottomWidth.value + mtw + mbw + ptw + pbw;
      }

      return {
        fixedWidth,
        fixedHeight,
        x,
        y,
        w,
        h
      };
    }

    render(renderMode) {
      this.__renderMode = renderMode;

      if (renderMode === mode.SVG) {
        this.__virtualDom = {
          bb: [],
          children: [],
          transform: []
        };
      }

      let {
        ctx,
        style,
        width,
        height,
        mlw,
        mrw,
        mtw,
        mbw,
        plw,
        ptw,
        prw,
        pbw
      } = this; // 恢复默认，防止其它matrix影响

      if (renderMode === mode.CANVAS) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
      }

      let {
        display,
        position,
        top,
        right,
        bottom,
        left,
        backgroundGradient: bgg,
        backgroundColor: bgc,
        borderTopWidth,
        borderTopColor: btc,
        borderTopStyle: bts,
        borderRightWidth,
        borderRightColor: brc,
        borderRightStyle: brs,
        borderBottomWidth,
        borderBottomColor: bbc,
        borderBottomStyle: bbs,
        borderLeftWidth,
        borderLeftColor: blc,
        borderLeftStyle: bls,
        transform,
        transformOrigin
      } = style;

      if (display === 'none') {
        return;
      } // 除root节点外relative渲染时做偏移，百分比基于父元素，若父元素没有一定高则为0


      if (position === 'relative' && this.parent) {
        let {
          width,
          height
        } = this.parent;
        let h = this.parent.style.height;

        if (left.unit !== unit.AUTO) {
          let diff = left.unit === unit.PX ? left.value : left.value * width * 0.01;

          this.__offsetX(diff);
        } else if (right.unit !== unit.AUTO) {
          let diff = right.unit === unit.PX ? right.value : right.value * width * 0.01;

          this.__offsetX(-diff);
        }

        if (top.unit !== unit.AUTO) {
          let diff = top.unit === unit.PX ? top.value : top.value * height * 0.01 * (h.unit === unit.AUTO ? 0 : 1);

          this.__offsetY(diff);
        } else if (bottom.unit !== unit.AUTO) {
          let diff = bottom.unit === unit.PX ? bottom.value : bottom.value * height * 0.01 * (h.unit === unit.AUTO ? 0 : 1);

          this.__offsetY(-diff);
        }
      } // 使用rx和ry渲染位置，考虑了relative和translate影响


      let {
        rx: x,
        ry: y
      } = this;
      let btw = borderTopWidth.value;
      let brw = borderRightWidth.value;
      let bbw = borderBottomWidth.value;
      let blw = borderLeftWidth.value;
      let x1 = x + mlw;
      let x2 = x1 + blw;
      let x3 = x2 + width + plw + prw;
      let x4 = x3 + brw;
      let y1 = y + mtw;
      let y2 = y1 + btw;
      let y3 = y2 + height + ptw + pbw;
      let y4 = y3 + bbw;
      let iw = width + plw + prw;
      let ih = height + ptw + pbw; // translate相对于自身

      if (transform) {
        let x4 = x + mlw + blw + iw + brw + mrw;
        let y4 = y + mtw + btw + ih + bbw + mbw;
        let ow = x4 - x;
        let oh = y4 - y;
        let matrix = tf.calMatrix(transform, transformOrigin, x, y, ow, oh);
        this.__matrix = matrix;
        let parent = this.parent;

        while (parent) {
          if (parent.matrix) {
            matrix = tf.mergeMatrix(parent.matrix, matrix);
          }

          parent = parent.parent;
        }

        this.__matrixEvent = matrix;

        if (renderMode === mode.CANVAS) {
          ctx.setTransform(...matrix);
        } else if (renderMode === mode.SVG) {
          this.addTransform(['matrix', this.matrix.join(',')]);
        }
      } // 先渲染渐变，没有则背景色


      if (bgg) {
        let {
          k,
          v
        } = bgg;
        let cx = x2 + iw * 0.5;
        let cy = y2 + ih * 0.5; // 需计算角度 https://www.w3cplus.com/css3/do-you-really-understand-css-linear-gradients.html

        if (k === 'linear') {
          let gd = gradient.getLinear(v, cx, cy, iw, ih);

          if (renderMode === mode.CANVAS) {
            ctx.beginPath();
            ctx.fillStyle = this.getCanvasLg(gd);
            ctx.rect(x2, y2, iw, ih);
            ctx.fill();
            ctx.closePath();
          } else if (renderMode === mode.SVG) {
            let uuid = this.getSvgLg(gd);
            this.addBackground([['x', x2], ['y', y2], ['width', iw], ['height', ih], ['fill', `url(#${uuid})`]]);
          }
        } else if (k === 'radial') {
          let gd = gradient.getRadial(v, cx, cy, x2, y2, x3, y3);

          if (renderMode === mode.CANVAS) {
            ctx.beginPath();
            ctx.fillStyle = this.getCanvasRg(gd);
            ctx.rect(x2, y2, iw, ih);
            ctx.fill();
            ctx.closePath();
          } else if (renderMode === mode.SVG) {
            let uuid = this.getSvgRg(gd);
            this.addBackground([['x', x2], ['y', y2], ['width', iw], ['height', ih], ['fill', `url(#${uuid})`]]);
          }
        }
      } else if (bgc !== 'transparent') {
        if (renderMode === mode.CANVAS) {
          ctx.beginPath();
          ctx.fillStyle = bgc;
          ctx.rect(x2, y2, iw, ih);
          ctx.fill();
          ctx.closePath();
        } else if (renderMode === mode.SVG) {
          this.addBackground([['x', x2], ['y', y2], ['width', iw], ['height', ih], ['fill', bgc]]);
        }
      } // 边框需考虑尖角，两条相交边平分45°夹角


      if (btw > 0 && btc !== 'transparent') {
        let deg1 = Math.atan(btw / blw);
        let deg2 = Math.atan(btw / brw);
        let points = border.calPoints(btw, bts, deg1, deg2, x1, x2, x3, x4, y1, y2, y3, y4, 0);
        renderBorder(renderMode, points, btc, ctx, this);
      }

      if (brw > 0 && brc !== 'transparent') {
        let deg1 = Math.atan(brw / btw);
        let deg2 = Math.atan(brw / bbw);
        let points = border.calPoints(brw, brs, deg1, deg2, x1, x2, x3, x4, y1, y2, y3, y4, 1);
        renderBorder(renderMode, points, brc, ctx, this);
      }

      if (bbw > 0 && bbc !== 'transparent') {
        let deg1 = Math.atan(bbw / blw);
        let deg2 = Math.atan(bbw / brw);
        let points = border.calPoints(bbw, bbs, deg1, deg2, x1, x2, x3, x4, y1, y2, y3, y4, 2);
        renderBorder(renderMode, points, bbc, ctx, this);
      }

      if (blw > 0 && blc !== 'transparent') {
        let deg1 = Math.atan(blw / btw);
        let deg2 = Math.atan(blw / bbw);
        let points = border.calPoints(blw, bls, deg1, deg2, x1, x2, x3, x4, y1, y2, y3, y4, 3);
        renderBorder(renderMode, points, blc, ctx, this);
      }
    } // 先查找到注册了事件的节点，再捕获冒泡判断增加性能


    __emitEvent(e, force) {
      let {
        event: {
          type
        },
        x,
        y,
        covers
      } = e;
      let {
        listener,
        children,
        style,
        outerWidth,
        outerHeight,
        matrixEvent
      } = this;

      if (style.display === 'none') {
        return;
      }

      let cb;

      if (listener.hasOwnProperty(type)) {
        cb = listener[type];
      } // touchend之类强制的直接通知即可


      if (force) {
        children.forEach(child => {
          if (child instanceof Xom && !child.isGeom()) {
            child.__emitEvent(e, force);
          }
        });
        cb && cb(e);
        return;
      }

      let childWillResponse;

      if (!this.isGeom()) {
        // 先响应absolute/relative高优先级，从后往前遮挡顺序
        for (let i = children.length - 1; i >= 0; i--) {
          let child = children[i];

          if (child instanceof Xom && ['absolute', 'relative'].indexOf(child.style.position) > -1) {
            if (child.__emitEvent(e)) {
              childWillResponse = true;
            }
          }
        } // 再看普通流，从后往前遮挡顺序


        for (let i = children.length - 1; i >= 0; i--) {
          let child = children[i];

          if (child instanceof Xom && ['absolute', 'relative'].indexOf(child.style.position) === -1) {
            if (child.__emitEvent(e)) {
              childWillResponse = true;
            }
          }
        }
      } // child触发则parent一定触发，否则判断事件坐标是否在节点内且未被遮挡


      if (childWillResponse || this.willResponseEvent(e)) {
        // 根据是否matrix存入遮罩坐标
        covers.push({
          x,
          y,
          w: outerWidth,
          h: outerHeight,
          matrixEvent
        });

        if (!e.target) {
          e.target = this;
        }

        cb && cb(e);
      }
    }

    willResponseEvent(e) {
      let {
        x,
        y,
        covers
      } = e;
      let {
        rx,
        ry,
        outerWidth,
        outerHeight,
        matrixEvent
      } = this;
      let inThis = tf.pointInQuadrilateral(x - rx, y - ry, 0, 0, outerWidth, 0, 0, outerHeight, outerWidth, outerHeight, matrixEvent);

      if (inThis) {
        // 不能被遮挡
        for (let i = 0, len = covers.length; i < len; i++) {
          let {
            x: x2,
            y: y2,
            w,
            h,
            matrixEvent
          } = covers[i];

          if (tf.pointInQuadrilateral(x - rx, y - ry, x2 - rx, y2 - ry, x2 - rx + w, y2 - ry, x2 - rx, y2 - ry + h, x2 - rx + w, y2 - ry + h, matrixEvent)) {
            return;
          }
        }

        if (!e.target) {
          e.target = this;
        }

        return true;
      }
    }

    getCanvasLg(gd) {
      let lg = this.ctx.createLinearGradient(gd.x1, gd.y1, gd.x2, gd.y2);
      gd.stop.forEach(item => {
        lg.addColorStop(item[1], item[0]);
      });
      return lg;
    }

    getCanvasRg(gd) {
      let rg = this.ctx.createRadialGradient(gd.cx, gd.cy, 0, gd.cx, gd.cy, gd.r);
      gd.stop.forEach(item => {
        rg.addColorStop(item[1], item[0]);
      });
      return rg;
    }

    getSvgLg(gd) {
      return this.defs.add({
        tagName: 'linearGradient',
        props: [['x1', gd.x1], ['y1', gd.y1], ['x2', gd.x2], ['y2', gd.y2]],
        stop: gd.stop
      });
    }

    getSvgRg(gd) {
      return this.defs.add({
        tagName: 'radialGradient',
        props: [['cx', gd.cx], ['cy', gd.cy], ['r', gd.r]],
        stop: gd.stop
      });
    }

    addBorder(props) {
      this.virtualDom.bb.push({
        type: 'item',
        tagName: 'path',
        props
      });
    }

    addBackground(props) {
      this.virtualDom.bb.push({
        type: 'item',
        tagName: 'rect',
        props
      });
    }

    addTransform(props) {
      this.virtualDom.transform.push(props);
    }

    get tagName() {
      return this.__tagName;
    }

    get mtw() {
      return this.__mtw;
    }

    get mrw() {
      return this.__mrw;
    }

    get mbw() {
      return this.__mbw;
    }

    get mlw() {
      return this.__mlw;
    }

    get ptw() {
      return this.__ptw;
    }

    get prw() {
      return this.__prw;
    }

    get pbw() {
      return this.__pbw;
    }

    get plw() {
      return this.__plw;
    }

    get outerWidth() {
      let {
        mlw,
        mrw,
        plw,
        prw,
        style: {
          borderLeftWidth,
          borderRightWidth
        }
      } = this;
      return this.width + borderLeftWidth.value + borderRightWidth.value + mlw + mrw + plw + prw;
    }

    get outerHeight() {
      let {
        mtw,
        mbw,
        ptw,
        pbw,
        style: {
          borderTopWidth,
          borderBottomWidth
        }
      } = this;
      return this.height + borderTopWidth.value + borderBottomWidth.value + mtw + mbw + ptw + pbw;
    }

    get listener() {
      return this.__listener;
    }

    get renderMode() {
      return this.__renderMode;
    }

    get matrix() {
      return this.__matrix;
    }

    get matrixEvent() {
      return this.__matrixEvent;
    }

  }

  var font = {
    arial: {
      lhr: 1.14990234375,
      // 默认line-height ratio，(67+1854+434)/2048
      car: 1.1171875,
      // content-area ratio，(1854+434)/2048
      blr: 0.9052734375,
      // base-line ratio，1854/2048
      mdr: 0.64599609375,
      // middle ratio，(1854-1062/2)/2048
      lgr: 0.03271484375 // line-gap ratio，67/2048

    }
  };

  const RESET = {
    position: 'static',
    display: 'block',
    borderSizing: 'content-box',
    top: 'auto',
    right: 'auto',
    bottom: 'auto',
    left: 'auto',
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    fontSize: 16,
    fontFamily: 'arial',
    color: '#000',
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: 'normal',
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderTopColor: '#000',
    borderRightColor: '#000',
    borderBottomColor: '#000',
    borderLeftColor: '#000',
    borderTopStyle: 'solid',
    borderRightStyle: 'solid',
    borderBottomStyle: 'solid',
    borderLeftStyle: 'solid',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    verticalAlign: 'baseline',
    width: 'auto',
    height: 'auto',
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: 'auto',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    textAlign: 'left',
    visibility: 'visible',
    transformOrigin: 'center',
    fill: 'transparent',
    stroke: '#000',
    strokeWidth: 1,
    strokeDasharray: []
  };
  let reset = [];
  Object.keys(RESET).forEach(k => {
    let v = RESET[k];
    reset.push({
      k,
      v
    });
  });

  function parserOneBorder(style, direction) {
    let key = `border${direction}`;

    if (!style[key]) {
      return;
    }

    let w = /\b[\d.]+px\b/i.exec(style[key]);

    if (w) {
      style[key + 'Width'] = w[0];
    }

    let s = /\b(solid|dashed|dotted)\b/i.exec(style[key]);

    if (s) {
      style[key + 'Style'] = s[1];
    }

    let c = /#[0-9a-f]{3,6}/i.exec(style[key]);

    if (c && [4, 7].indexOf(c[0].length) > -1) {
      style[key + 'Color'] = c[0];
    } else if (/\btransparent\b/i.test(style[key])) {
      style[key + 'Color'] = 'transparent';
    } else {
      c = /rgba?\(.+\)/i.exec(style[key]);

      if (c) {
        style[key + 'Color'] = c[0];
      }
    }
  }

  function calUnit(obj, k, v) {
    if (v === 'auto') {
      obj[k] = {
        unit: unit.AUTO
      };
    } else if (/px$/.test(v)) {
      v = parseFloat(v) || 0;
      obj[k] = {
        value: v,
        unit: unit.PX
      };
    } else if (/%$/.test(v)) {
      // border不支持百分比
      if (k.toString().indexOf('border') === 0) {
        obj[k] = {
          value: 0,
          unit: unit.PX
        };
      } else {
        v = parseFloat(v) || 0;
        obj[k] = {
          value: v,
          unit: unit.PERCENT
        };
      }
    } else {
      v = parseFloat(v) || 0;
      obj[k] = {
        value: v,
        unit: unit.PX
      };
    }

    return obj;
  }

  function normalize$1(style) {
    // 默认reset
    reset.forEach(item => {
      if (!style.hasOwnProperty(item.k)) {
        style[item.k] = item.v;
      }
    });
    let temp = style.background; // 处理渐变背景色

    if (temp) {
      // 优先gradient，没有再考虑颜色
      let gd = gradient.parseGradient(temp);

      if (gd) {
        style.backgroundGradient = gd;
      } else {
        let bgc = /#[0-9a-f]{3,6}/i.exec(temp);

        if (bgc && [4, 7].indexOf(bgc[0].length) > -1) {
          style.backgroundColor = bgc[0];
        } else {
          bgc = /rgba?\(.+\)/i.exec(temp);

          if (bgc) {
            style.backgroundColor = bgc[0];
          }
        }
      }
    } // 处理缩写


    temp = style.flex;

    if (temp) {
      if (temp === 'none') {
        style.flexGrow = 0;
        style.flexShrink = 0;
        style.flexBasis = 'auto';
      } else if (temp === 'auto') {
        style.flexGrow = 1;
        style.flexShrink = 1;
        style.flexBasis = 'auto';
      } else if (/^[\d.]+$/.test(temp)) {
        style.flexGrow = parseFloat(temp);
        style.flexShrink = 1;
        style.flexBasis = 0;
      } else if (/^[\d.]+px$/.test(temp)) ; else if (/^[\d.]+%$/.test(temp)) ; else {
        style.flexGrow = 0;
        style.flexShrink = 1;
        style.flexBasis = 'auto';
      }
    }

    temp = style.border;

    if (temp) {
      style.borderTop = style.borderRight = style.borderBottom = style.borderLeft = temp;
    }

    temp = style.margin;

    if (temp) {
      let match = temp.toString().match(/(-?[\d.]+(px|%)?)|(auto)/ig);

      if (match) {
        if (match.length === 1) {
          match[3] = match[2] = match[1] = match[0];
        } else if (match.length === 2) {
          match[2] = match[0];
          match[3] = match[1];
        } else if (match.length === 3) {
          match[3] = match[1];
        }

        style.marginTop = match[0];
        style.marginRight = match[1];
        style.marginBottom = match[2];
        style.marginLeft = match[3];
      }
    }

    temp = style.padding;

    if (temp) {
      let match = temp.toString().match(/(-?[\d.]+(px|%)?)|(auto)/ig);

      if (match) {
        if (match.length === 1) {
          match[3] = match[2] = match[1] = match[0];
        } else if (match.length === 2) {
          match[2] = match[0];
          match[3] = match[1];
        } else if (match.length === 3) {
          match[3] = match[1];
        }

        style.paddingTop = match[0];
        style.paddingRight = match[1];
        style.paddingBottom = match[2];
        style.paddingLeft = match[3];
      }
    }

    temp = style.transform;

    if (temp) {
      let match = temp.toString().match(/\w+\(.+?\)/g);

      if (match) {
        let transform = style.transform = [];
        match.forEach(item => {
          let i = item.indexOf('(');
          let k = item.slice(0, i);
          let v = item.slice(i + 1, item.length - 1);

          if (k === 'matrix') {
            let arr = v.split(/\s*,\s*/);
            arr = arr.map(item => parseFloat(item));

            if (arr.length > 6) {
              arr = arr.slice(0, 6);
            }

            if (arr.length === 6) {
              transform.push(['matrix', arr]);
            }
          } else if (k === 'translateX') {
            let arr = ['translateX', v];
            transform.push(calUnit(arr, 1, v));
          } else if (k === 'translateY') {
            let arr = ['translateY', v];
            transform.push(calUnit(arr, 1, v));
          } else if (k === 'translate') {
            let arr = v.split(/\s*,\s*/);
            let arr1 = ['translateX', arr[0]];
            let arr2 = ['translateY', arr[1] || arr[0]];
            transform.push(calUnit(arr1, 1, arr[0]));
            transform.push(calUnit(arr2, 1, arr[1] || arr[0]));
          } else if (k === 'scaleX') {
            transform.push(['scaleX', parseFloat(v) || 0]);
          } else if (k === 'scaleY') {
            transform.push(['scaleY', parseFloat(v) || 0]);
          } else if (k === 'scale') {
            let arr = v.split(/\s*,\s*/);
            let x = parseFloat(arr[0]) || 0;
            let y = parseFloat(arr[arr.length - 1]) || 0;
            transform.push(['scaleX', x]);
            transform.push(['scaleY', y]);
          } else if (k === 'rotateZ' || k === 'rotate') {
            transform.push(['rotateZ', parseFloat(v) || 0]);
          } else if (k === 'skewX') {
            transform.push(['skewX', parseFloat(v) || 0]);
          } else if (k === 'skewY') {
            transform.push(['skewY', parseFloat(v) || 0]);
          } else if (k === 'skew') {
            let arr = v.split(/\s*,\s*/);
            let x = parseFloat(arr[0]) || 0;
            let y = parseFloat(arr[arr.length - 1]) || 0;
            transform.push(['skewX', x]);
            transform.push(['skewY', y]);
          }
        });
      }
    }

    temp = style.transformOrigin;

    if (temp) {
      let match = temp.toString().match(/(-?[\d.]+(px|%)?)|(left|top|right|bottom|center)/ig);

      if (match) {
        if (match.length === 1) {
          match[1] = match[0];
        }

        let tfo = [];

        for (let i = 0; i < 2; i++) {
          let item = match[i];

          if (/px$/.test(item)) {
            tfo.push({
              value: parseFloat(item),
              unit: unit.PX
            });
          } else if (/%$/.test(item)) {
            tfo.push({
              value: parseFloat(item),
              unit: unit.PERCENT
            });
          } else {
            tfo.push({
              value: item,
              unit: unit.POSITION
            });
          }
        }

        style.transformOrigin = tfo;
      }
    }

    parserOneBorder(style, 'Top');
    parserOneBorder(style, 'Right');
    parserOneBorder(style, 'Bottom');
    parserOneBorder(style, 'Left'); // 转化不同单位值为对象标准化

    ['marginTop', 'marginRight', 'marginBottom', 'marginLeft', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomLeftRadius', 'borderBottomRightRadius', 'top', 'right', 'bottom', 'left', 'width', 'height', 'flexBasis'].forEach(k => {
      let v = style[k];
      calUnit(style, k, v);
    }); // 计算lineHeight为px值，最小范围

    let lineHeight = style.lineHeight;

    if (lineHeight === 'normal') {
      lineHeight = {
        value: style.fontSize * font.arial.lhr,
        unit: unit.PX
      };
    } else if (/px$/.test(lineHeight)) {
      lineHeight = parseFloat(lineHeight);
      lineHeight = {
        value: Math.max(style.fontSize, lineHeight),
        unit: unit.PX
      };
    } // 纯数字比例
    else {
        lineHeight = parseFloat(lineHeight) || 'normal'; // 非法数字

        if (lineHeight === 'normal') {
          lineHeight = {
            value: style.fontSize * font.arial.lhr,
            unit: unit.PX
          };
        } else {
          lineHeight = {
            value: lineHeight * style.fontSize,
            unit: unit.PX
          };
        }
      }

    style.lineHeight = lineHeight;
  }

  function setFontStyle(style) {
    let {
      fontStyle,
      fontWeight,
      fontSize,
      fontFamily
    } = style;
    fontFamily = 'arial';
    return `${fontStyle} ${fontWeight} ${fontSize}px/${fontSize}px ${fontFamily}`;
  }

  function getBaseLine(style) {
    let normal = style.fontSize * font.arial.lhr;
    return (style.lineHeight.value - normal) * 0.5 + style.fontSize * font.arial.blr;
  }

  var css = {
    normalize: normalize$1,
    setFontStyle,
    getBaseLine
  };

  class LineBox {
    constructor(parent, x, y, w, content, style) {
      this.__parent = parent;
      this.__x = x;
      this.__y = y;
      this.__width = w;
      this.__content = content;
      this.__style = style;
      this.__virtualDom = {};
    }

    render(renderMode, ctx) {
      let {
        style,
        content,
        x,
        y,
        parent: {
          ox,
          oy
        }
      } = this;
      y += css.getBaseLine(style);
      x += ox;
      y += oy;

      if (renderMode === mode.CANVAS) {
        ctx.fillText(content, x, y);
      } else if (renderMode === mode.SVG) {
        this.__virtualDom = {
          type: 'item',
          tagName: 'text',
          props: [['x', x], ['y', y], ['fill', style.color], ['font-family', style.fontFamily], ['font-size', `${style.fontSize}px`]],
          content
        };
      }
    }

    __offsetX(diff) {
      this.__x += diff;
    }

    __offsetY(diff) {
      this.__y += diff;
    }

    get x() {
      return this.__x;
    }

    get y() {
      return this.__y;
    }

    get width() {
      return this.__width;
    }

    get content() {
      return this.__content;
    }

    get style() {
      return this.__style;
    }

    get baseLine() {
      return css.getBaseLine(this.style);
    }

    get virtualDom() {
      return this.__virtualDom;
    }

    get parent() {
      return this.__parent;
    }

  }

  const CHAR_WIDTH_CACHE = {};

  class Text extends Node {
    constructor(content) {
      super();
      this.__content = content.toString();
      this.__lineBoxes = [];
      this.__charWidthList = [];
      this.__charWidth = 0;
      this.__textWidth = 0;
    } // 预先计算每个字的宽度


    __measure() {
      this.__charWidthList = [];
      let {
        ctx,
        content,
        style,
        charWidthList,
        renderMode
      } = this;

      if (renderMode === mode.CANVAS) {
        ctx.font = css.setFontStyle(style);
      }

      let cache = CHAR_WIDTH_CACHE[style.fontSize] = CHAR_WIDTH_CACHE[style.fontSize] || {};
      let length = content.length;
      let sum = 0;

      for (let i = 0; i < length; i++) {
        let char = content.charAt(i);
        let mw;

        if (cache.hasOwnProperty(char)) {
          mw = cache[char];
        } else if (renderMode === mode.CANVAS) {
          mw = cache[char] = ctx.measureText(char).width;
        } else if (renderMode === mode.SVG) {
          mw = cache[char] = mode.measure(char, style);
        }

        charWidthList.push(mw);
        sum += mw;
        this.__charWidth = Math.max(this.charWidth, mw);
      }

      this.__textWidth = sum;
    }

    __layout(data, isVirtual) {
      let {
        x,
        y,
        w,
        h
      } = data;
      this.__x = x;
      this.__y = y;
      let maxX = x;
      let {
        ctx,
        content,
        style,
        lineBoxes,
        charWidthList,
        renderMode
      } = this; // 顺序尝试分割字符串为lineBox，形成多行

      let begin = 0;
      let i = 0;
      let count = 0;
      let length = content.length;

      while (i < length) {
        count += charWidthList[i];

        if (count === w) {
          let lineBox = new LineBox(this, x, y, count, content.slice(begin, i + 1), style);
          lineBoxes.push(lineBox);
          maxX = Math.max(maxX, x + count);
          y += this.style.lineHeight.value;
          begin = i + 1;
          i = begin + 1;
          count = 0;
        } else if (count > w) {
          // 宽度不足时无法跳出循环，至少也要塞个字符形成一行
          if (i === begin) {
            i = begin + 1;
          }

          let lineBox = new LineBox(this, x, y, count - charWidthList[i], content.slice(begin, i), style);
          lineBoxes.push(lineBox);
          maxX = Math.max(maxX, x + count - charWidthList[i]);
          y += this.style.lineHeight.value;
          begin = i;
          i = i + 1;
          count = 0;
        } else {
          i++;
        }
      }

      if (begin < length && begin < i) {
        count = 0;

        for (i = begin; i < length; i++) {
          count += charWidthList[i];
        }

        let lineBox = new LineBox(this, x, y, count, content.slice(begin, length), style);
        lineBoxes.push(lineBox);
        maxX = Math.max(maxX, x + count);
        y += style.lineHeight.value;
      }

      this.__width = maxX - x;
      this.__height = y - data.y;

      if (isVirtual) {
        this.__lineBoxes = [];
      } else {
        let {
          textAlign
        } = style;

        if (['center', 'right'].indexOf(textAlign) > -1) {
          lineBoxes.forEach(lineBox => {
            let diff = this.__width - lineBox.width;

            if (diff > 0) {
              lineBox.__offsetX(textAlign === 'center' ? diff * 0.5 : diff);
            }
          });
        }
      }
    }

    render(renderMode) {
      const {
        ctx,
        style
      } = this;

      if (renderMode === mode.CANVAS) {
        ctx.font = css.setFontStyle(style);
        ctx.fillStyle = style.color;
      }

      this.lineBoxes.forEach(item => {
        item.render(renderMode, ctx);
      });

      if (renderMode === mode.SVG) {
        this.__virtualDom = {
          type: 'text',
          children: this.lineBoxes.map(lineBox => lineBox.virtualDom)
        };
      }
    }

    __tryLayInline(w) {
      return w - this.textWidth;
    }

    __calMaxAndMinWidth() {
      let n = 0;
      this.charWidthList.forEach(item => {
        n = Math.max(n, item);
      });
      return {
        max: this.textWidth,
        min: n
      };
    }

    get content() {
      return this.__content;
    }

    set content(v) {
      this.__content = v;
    }

    get lineBoxes() {
      return this.__lineBoxes;
    }

    get charWidthList() {
      return this.__charWidthList;
    }

    get charWidth() {
      return this.__charWidth;
    }

    get textWidth() {
      return this.__textWidth;
    }

    get baseLine() {
      let last = this.lineBoxes[this.lineBoxes.length - 1];
      return last.y - this.y + last.baseLine;
    }

    get renderMode() {
      return this.__renderMode;
    }

  }

  class LineGroup {
    constructor(x, y) {
      this.__list = [];
      this.__x = x;
      this.__y = y;
      this.__baseLine = 0;
    }

    add(item) {
      this.list.push(item);
    }

    __calBaseLine() {
      let baseLine = 0;
      this.list.forEach(item => {
        baseLine = Math.max(baseLine, item.baseLine);
      });
      return baseLine;
    }

    verticalAlign() {
      this.__baseLine = this.__calBaseLine(); // 仅当有2个和以上时才需要vertical对齐调整

      if (this.list.length > 1) {
        this.list.forEach(item => {
          if (item.baseLine !== this.baseLine) {
            item.__offsetY(this.baseLine - item.baseLine);
          }
        });
      }
    }

    horizonAlign(diff) {
      this.list.forEach(item => {
        item.__offsetX(diff);
      });
    }

    get list() {
      return this.__list;
    }

    get x() {
      return this.__x;
    }

    get y() {
      return this.__y;
    }

    get width() {
      let width = 0;
      this.list.forEach(item => {
        width += item.width;
      });
      return width;
    }

    get height() {
      let height = 0;
      this.list.forEach(item => {
        height = Math.max(height, item.height);
      });
      return height;
    }

    get baseLine() {
      return this.__baseLine;
    }

    get size() {
      return this.__list.length;
    }

  }

  const REGISTER = {};

  class Geom extends Xom {
    constructor(tagName, props) {
      super(tagName, props);
    }

    __initStyle() {
      css.normalize(this.style);
    }

    __tryLayInline(w, total) {
      // 无children，直接以style的width为宽度，不定义则为0
      let {
        style: {
          width
        }
      } = this;

      if (width.unit === unit.PX) {
        return w - width.value;
      } else if (width.unit === unit.PERCENT) {
        return w - total * width.value * 0.01;
      }

      return w;
    }

    __calAutoBasis(isDirectionRow, w, h) {
      let b = 0;
      let min = 0;
      let max = 0;
      let {
        style
      } = this; // 计算需考虑style的属性

      let {
        width,
        height,
        borderTopWidth,
        borderRightWidth,
        borderBottomWidth,
        borderLeftWidth
      } = style;
      let main = isDirectionRow ? width : height;

      if (main.unit !== unit.AUTO) {
        b = max += main.value;
      } // border也得计算在内


      if (isDirectionRow) {
        let w = borderRightWidth.value + borderLeftWidth.value;
        b += w;
        max += w;
        min += w;
      } else {
        let h = borderTopWidth.value + borderBottomWidth.value;
        b += h;
        max += h;
        min += h;
      }

      return {
        b,
        min,
        max
      };
    }

    __layoutBlock(data) {
      let {
        fixedHeight,
        w,
        h
      } = this.__preLayout(data);

      let {
        marginLeft,
        marginRight,
        width
      } = this.style;
      this.__width = w;
      this.__height = fixedHeight ? h : 0; // 处理margin:xx auto居中对齐

      if (marginLeft.unit === unit.AUTO && marginRight.unit === unit.AUTO && width.unit !== unit.AUTO) {
        let ow = this.outerWidth;

        if (ow < data.w) {
          this.__offsetX((data.w - ow) * 0.5);
        }
      }
    }

    __layoutFlex(data) {
      // 无children所以等同于block
      this.__layoutBlock(data);
    }

    __layoutInline(data) {
      let {
        fixedWidth,
        fixedHeight,
        x,
        y,
        w,
        h
      } = this.__preLayout(data); // 元素的width不能超过父元素w


      this.__width = fixedWidth ? w : x - data.x;
      this.__height = fixedHeight ? h : y - data.y;
    }

    __calAbs() {
      return 0;
    }

    getPreRender() {
      let {
        rx: x,
        ry: y,
        width,
        height,
        mlw,
        mtw,
        plw,
        ptw,
        style
      } = this;
      let {
        borderTopWidth,
        borderLeftWidth,
        display,
        stroke,
        strokeWidth,
        strokeDasharray,
        fill
      } = style;
      let originX = x + borderLeftWidth.value + mlw + plw;
      let originY = y + borderTopWidth.value + mtw + ptw;
      let cx = originX + width * 0.5;
      let cy = originY + height * 0.5;
      let slg;

      if (strokeWidth > 0 && stroke.indexOf('linear-gradient') > -1) {
        let go = gradient.parseGradient(stroke);

        if (go) {
          slg = gradient.getLinear(go.v, cx, cy, width, height);
        }
      }

      let flg;
      let frg;

      if (fill.indexOf('linear-gradient') > -1) {
        let go = gradient.parseGradient(fill);

        if (go) {
          flg = gradient.getLinear(go.v, cx, cy, width, height);
        }
      } else if (fill.indexOf('radial-gradient') > -1) {
        let go = gradient.parseGradient(fill);

        if (go) {
          frg = gradient.getRadial(go.v, cx, cy, originX, originY, originY + width, originY + height);
        }
      }

      return {
        x,
        y,
        originX,
        originY,
        cx,
        cy,
        display,
        stroke,
        strokeWidth,
        strokeDasharray,
        fill,
        slg,
        flg,
        frg
      };
    }

    render(renderMode) {
      super.render(renderMode);

      if (renderMode === mode.SVG) {
        this.__virtualDom = { ...super.virtualDom,
          type: 'geom'
        };
      }
    }

    addGeom(tagName, props) {
      props = util.hash2arr(props);
      this.virtualDom.children.push({
        type: 'item',
        tagName,
        props
      });
    }

    get tagName() {
      return this.__tagName;
    }

    get baseLine() {
      return this.__height;
    }

    static getRegister(name) {
      if (!REGISTER.hasOwnProperty(name)) {
        throw new Error(`Geom has not register: ${name}`);
      }

      return REGISTER[name];
    }

    static register(name, obj) {
      if (Geom.hasRegister(name)) {
        throw new Error(`Geom has already register: ${name}`);
      }

      REGISTER[name] = obj;
    }

    static hasRegister(name) {
      return REGISTER.hasOwnProperty(name);
    }

  }

  const TAG_NAME = {
    'div': true,
    'span': true
  };
  const INLINE = {
    'span': true
  };

  class Dom extends Xom {
    constructor(tagName, props, children) {
      super(tagName, props);
      this.__children = children;
      this.__flowChildren = []; // 非绝对定位孩子

      this.__absChildren = []; // 绝对定位孩子

      this.__lineGroups = []; // 一行inline元素组成的LineGroup对象后的存放列表

      this.__flowY = 0; // 文档流布局结束后的y坐标，供absolute布局默认位置使用
    }
    /**
     * 1. 封装string为Text节点
     * 2. 打平children中的数组，变成一维
     * 3. 合并相连的Text节点
     * 4. 检测inline不能包含block和flex
     * 5. 设置parent和prev/next和ctx和defs和mode
     */


    __traverse(ctx, defs, renderMode) {
      let list = [];

      this.__traverseChildren(this.children, list, ctx, defs, renderMode);

      for (let i = list.length - 1; i > 0; i--) {
        let item = list[i];

        if (item instanceof Text) {
          let prev = list[i - 1];

          if (prev instanceof Text) {
            prev.content += item.content;
            list.splice(i, 1);
          } else {
            i--;
          }
        }
      }

      if (this.style.display === 'inline' && this.parent.style.display !== 'flex') {
        for (let i = list.length - 1; i >= 0; i--) {
          let item = list[i];

          if (item instanceof Dom && item.style.display !== 'inline') {
            throw new Error('inline can not contain block/flex');
          }
        }
      }

      let prev = null;
      list.forEach(item => {
        item.__ctx = ctx;
        item.__defs = defs;

        item.__parent = this;
        item.__prev = prev;

        if (item instanceof Text || item.style.position !== 'absolute') {
          this.__flowChildren.push(item);
        } else {
          this.__absChildren.push(item);
        }
      });
      this.__children = list;
    }

    __traverseChildren(children, list, ctx, defs, renderMode) {
      if (Array.isArray(children)) {
        children.forEach(item => {
          this.__traverseChildren(item, list, ctx, defs, renderMode);
        });
      } else if (children instanceof Dom) {
        list.push(children);

        children.__traverse(ctx, defs, renderMode);
      } // 图形没有children
      else if (children instanceof Geom) {
          list.push(children);
        } // 排除掉空的文本
        else if (!util.isNil(children)) {
            let text = new Text(children);
            text.__renderMode = renderMode;
            list.push(text);
          }
    } // 合并设置style，包括继承和默认值，修改一些自动值和固定值，测量所有文字的宽度


    __initStyle() {
      let style = this.__style; // 仅支持flex/block/inline/none

      if (!style.display || ['flex', 'block', 'inline', 'none'].indexOf(style.display) === -1) {
        if (INLINE.hasOwnProperty(this.tagName)) {
          style.display = 'inline';
        } else {
          style.display = 'block';
        }
      } // 继承父元素样式


      let parent = this.parent;

      if (parent) {
        let parentStyle = parent.style;
        ['fontSize', 'fontWeight', 'fontStyle', 'lineHeight', 'wordBreak', 'color', 'textAlign'].forEach(k => {
          if (!style.hasOwnProperty(k) && parentStyle.hasOwnProperty(k)) {
            style[k] = parentStyle[k];
          }
        });
      } // 标准化处理，默认值、简写属性


      css.normalize(style);
      this.children.forEach(item => {
        if (item instanceof Xom) {
          item.__initStyle();
        } else {
          item.__style = style; // 文字首先测量所有字符宽度

          item.__measure();
        }
      });
    } // 给定父宽度情况下，尝试行内放下后的剩余宽度，为负数即放不下


    __tryLayInline(w, total) {
      let {
        flowChildren,
        style: {
          width
        }
      } = this;

      if (width.unit === unit.PX) {
        return w - width.value;
      } else if (width.unit === unit.PERCENT) {
        return w - total * width.value * 0.01;
      }

      for (let i = 0; i < flowChildren.length; i++) {
        // 当放不下时直接返回，无需继续多余的尝试计算
        if (w < 0) {
          return w;
        }

        let item = flowChildren[i];

        if (item instanceof Xom) {
          w -= item.__tryLayInline(w, total);
        } else {
          w -= item.textWidth;
        }
      }

      return w;
    } // 设置y偏移值，递归包括children，此举在flex行元素的child进行justify-content对齐用


    __offsetX(diff) {
      super.__offsetX(diff);

      this.flowChildren.forEach(item => {
        if (item) {
          item.__offsetX(diff);
        }
      });
    } // 设置y偏移值，递归包括children，此举在初步确定inline布局后设置元素vertical-align用


    __offsetY(diff) {
      super.__offsetY(diff);

      this.flowChildren.forEach(item => {
        if (item) {
          item.__offsetY(diff);
        }
      });
    }

    __calAutoBasis(isDirectionRow, w, h, isRecursion) {
      let b = 0;
      let min = 0;
      let max = 0;
      let {
        flowChildren,
        style
      } = this; // 计算需考虑style的属性

      let {
        width,
        height,
        marginLeft,
        marginTop,
        marginRight,
        marginBottom,
        paddingLeft,
        paddingTop,
        paddingRight,
        paddingBottom,
        borderTopWidth,
        borderRightWidth,
        borderBottomWidth,
        borderLeftWidth
      } = style;
      let main = isDirectionRow ? width : height;

      if (main.unit === unit.PX) {
        b = max = main.value; // 递归时children的长度会影响flex元素的最小宽度

        if (isRecursion) {
          min = b;
        }
      } // 递归children取最大值


      flowChildren.forEach(item => {
        if (item instanceof Xom) {
          let {
            b: b2,
            min: min2,
            max: max2
          } = item.__calAutoBasis(isDirectionRow, w, h, true);

          b = Math.max(b, b2);
          min = Math.max(min, min2);
          max = Math.max(max, max2);
        } else if (isDirectionRow) {
          min = Math.max(item.charWidth, min);
          max = Math.max(item.textWidth, max);
        } else {
          item.__layout({
            x: 0,
            y: 0,
            w,
            h
          }, true);

          min = Math.max(min, item.height);
          max = Math.max(max, item.height);
        }
      }); // margin/padding/border也得计算在内，此时还没有，百分比相对于父flex元素的宽度

      if (isDirectionRow) {
        let mp = this.__calMp(marginLeft, w) + this.__calMp(marginRight, w) + this.__calMp(paddingLeft, w) + this.__calMp(paddingRight, w);

        let w2 = borderRightWidth.value + borderLeftWidth.value + mp;
        b += w2;
        max += w2;
        min += w2;
      } else {
        let mp = this.__calMp(marginTop, w) + this.__calMp(marginBottom, w) + this.__calMp(paddingTop, w) + this.__calMp(paddingBottom, w);

        let h2 = borderTopWidth.value + borderBottomWidth.value + mp;
        b += h2;
        max += h2;
        min += h2;
      }

      return {
        b,
        min,
        max
      };
    }

    __calMp(v, w) {
      let n = 0;

      if (v.unit === unit.PX) {
        n += v.value;
      } else if (v.unit === unit.PERCENT) {
        v.value *= w * 0.01;
        v.unit = unit.PX;
        n += v.value;
      }

      return n;
    }

    __calAbs(isDirectionRow) {
      let max = 0;
      let {
        mtw,
        mrw,
        mbw,
        mlw,
        ptw,
        prw,
        pbw,
        plw,
        flowChildren,
        style
      } = this; // 计算需考虑style的属性

      let {
        width,
        height,
        borderTopWidth,
        borderRightWidth,
        borderBottomWidth,
        borderLeftWidth
      } = style;
      let main = isDirectionRow ? width : height;

      if (main.unit === unit.PX) {
        max = main.value;
      } // 递归children取最大值


      flowChildren.forEach(item => {
        if (item instanceof Xom) {
          let max2 = item.__calAbs(isDirectionRow);

          max = Math.max(max, max2);
        } else if (isDirectionRow) {
          max = Math.max(item.textWidth, max);
        } else {
          item.__layout({
            x: 0,
            y: 0,
            w: Infinity,
            h: Infinity
          }, true);

          max = Math.max(max, item.height);
        }
      }); // margin/padding/border也得计算在内

      if (isDirectionRow) {
        let w = borderRightWidth.value + borderLeftWidth.value + mlw + mrw + plw + prw;
        max += w;
      } else {
        let h = borderTopWidth.value + borderBottomWidth.value + mtw + mbw + ptw + pbw;
        max += h;
      }

      return max;
    } // 本身block布局时计算好所有子元素的基本位置


    __layoutBlock(data) {
      let {
        flowChildren,
        style,
        lineGroups
      } = this;
      let {
        width,
        marginLeft,
        marginRight,
        textAlign
      } = style;

      let {
        fixedHeight,
        x,
        y,
        w,
        h
      } = this.__preLayout(data); // 递归布局，将inline的节点组成lineGroup一行


      let lineGroup = new LineGroup(x, y);
      flowChildren.forEach(item => {
        if (item instanceof Xom) {
          if (item.style.display === 'inline') {
            // inline开头，不用考虑是否放得下直接放
            if (x === data.x) {
              lineGroup.add(item);

              item.__layout({
                x,
                y,
                w,
                h
              });

              x += item.outerWidth;
            } else {
              // 非开头先尝试是否放得下
              let fw = item.__tryLayInline(w - x, w); // 放得下继续


              if (fw >= 0) {
                item.__layout({
                  x,
                  y,
                  w,
                  h
                });
              } // 放不下处理之前的lineGroup，并重新开头
              else {
                  lineGroups.push(lineGroup);
                  lineGroup.verticalAlign();
                  x = data.x;
                  y += lineGroup.height;

                  item.__layout({
                    x: data.x,
                    y,
                    w,
                    h
                  });

                  lineGroup = new LineGroup(x, y);
                }

              x += item.outerWidth;
              lineGroup.add(item);
            }
          } else {
            // block先处理之前可能的lineGroup
            if (lineGroup.size) {
              lineGroups.push(lineGroup);
              lineGroup.verticalAlign();
              y += lineGroup.height;
              lineGroup = new LineGroup(data.x, y);
            }

            item.__layout({
              x: data.x,
              y,
              w,
              h
            });

            x = data.x;
            y += item.outerHeight;
          }
        } // 文字和inline类似
        else {
            // x开头，不用考虑是否放得下直接放
            if (x === data.x) {
              lineGroup.add(item);

              item.__layout({
                x,
                y,
                w,
                h
              });

              x += item.width;
            } else {
              // 非开头先尝试是否放得下
              let fw = item.__tryLayInline(w - x, w); // 放得下继续


              if (fw >= 0) {
                item.__layout({
                  x,
                  y,
                  w,
                  h
                });
              } // 放不下处理之前的lineGroup，并重新开头
              else {
                  lineGroups.push(lineGroup);
                  lineGroup.verticalAlign();
                  x = data.x;
                  y += lineGroup.height;

                  item.__layout({
                    x: data.x,
                    y,
                    w,
                    h
                  });

                  lineGroup = new LineGroup(x, y);
                }

              x += item.width;
              lineGroup.add(item);
            }
          }
      }); // 结束后处理可能遗留的最后的lineGroup

      if (lineGroup.size) {
        lineGroups.push(lineGroup);
        lineGroup.verticalAlign();
        y += lineGroup.height;
      } // text-align


      if (['center', 'right'].indexOf(textAlign) > -1) {
        lineGroups.forEach(lineGroup => {
          let diff = w - lineGroup.width;

          if (diff > 0) {
            lineGroup.horizonAlign(textAlign === 'center' ? diff * 0.5 : diff);
          }
        });
      }

      this.__width = w;
      this.__height = fixedHeight ? h : y - data.y;
      this.__flowY = y; // 处理margin:xx auto居中对齐

      if (marginLeft.unit === unit.AUTO && marginRight.unit === unit.AUTO && width.unit !== unit.AUTO) {
        let ow = this.outerWidth;

        if (ow < data.w) {
          this.__offsetX((data.w - ow) * 0.5);
        }
      }
    } // 弹性布局时的计算位置


    __layoutFlex(data) {
      let {
        flowChildren,
        style
      } = this;
      let {
        marginLeft,
        marginRight,
        flexDirection,
        justifyContent,
        alignItems
      } = style;

      let {
        fixedWidth,
        fixedHeight,
        x,
        y,
        w,
        h
      } = this.__preLayout(data);

      let isDirectionRow = flexDirection === 'row'; // column时height可能为auto，此时取消伸展，退化为类似block布局，但所有子元素强制block

      if (!isDirectionRow && !fixedHeight) {
        flowChildren.forEach(item => {
          if (item instanceof Xom) {
            const {
              style,
              style: {
                display,
                flexDirection,
                width
              }
            } = item; // column的flex的child如果是inline，变为block

            if (display === 'inline') {
              style.display = 'block';
            } // 竖向flex的child如果是横向flex，宽度自动的话要等同于父flex的宽度
            else if (display === 'flex' && flexDirection === 'row' && width.unit === unit.AUTO) {
                width.value = w;
                width.unit = unit.PX;
              }

            item.__layout({
              x,
              y,
              w,
              h
            });

            y += item.outerHeight;
          } else {
            item.__layout({
              x,
              y,
              w,
              h
            });

            y += item.outerHeight;
          }
        });
        this.__width = w;
        this.__height = y - data.y;
        return;
      } // 计算伸缩基数


      let growList = [];
      let shrinkList = [];
      let basisList = [];
      let minList = [];
      let growSum = 0;
      let shrinkSum = 0;
      let basisSum = 0;
      let maxSum = 0;
      flowChildren.forEach(item => {
        if (item instanceof Xom) {
          let {
            flexGrow,
            flexShrink,
            flexBasis
          } = item.style;
          growList.push(flexGrow);
          shrinkList.push(flexShrink);
          growSum += flexGrow;
          shrinkSum += flexShrink;

          let {
            b,
            min,
            max
          } = item.__calAutoBasis(isDirectionRow, w, h); // 根据basis不同，计算方式不同


          if (flexBasis.unit === unit.AUTO) {
            basisList.push(max);
            basisSum += max;
          } else if (flexBasis.unit === unit.PX) {
            b = flexBasis.value;
            basisList.push(b);
            basisSum += b;
          } else if (flexBasis.unit === unit.PERCENT) {
            b = (isDirectionRow ? w : h) * flexBasis.value;
            basisList.push(b);
            basisSum += b;
          }

          maxSum += max;
          minList.push(min);
        } else {
          growList.push(0);
          shrinkList.push(1);
          shrinkSum += 1;

          if (isDirectionRow) {
            basisList.push(item.textWidth);
            basisSum += item.textWidth;
            maxSum += item.textWidth;
            minList.push(item.charWidth);
          } else {
            item.__layout({
              x: 0,
              y: 0,
              w,
              h
            }, true);

            basisList.push(item.height);
            basisSum += item.height;
            maxSum += item.height;
            minList.push(item.height);
          }
        }
      });
      let maxCross = 0; // 判断是否超出，决定使用grow还是shrink

      let isOverflow = maxSum > (isDirectionRow ? w : h);
      flowChildren.forEach((item, i) => {
        let main;
        let shrink = shrinkList[i];
        let grow = growList[i]; // 计算主轴长度

        if (isOverflow) {
          let overflow = basisSum - (isDirectionRow ? w : h);
          main = shrink ? basisList[i] - overflow * shrink / shrinkSum : basisList[i];
        } else {
          let free = (isDirectionRow ? w : h) - basisSum;
          main = grow ? basisList[i] + free * grow / growSum : basisList[i];
        } // 主轴长度的最小值不能小于元素的最小长度，比如横向时的字符宽度


        main = Math.max(main, minList[i]);

        if (item instanceof Xom) {
          const {
            style,
            mlw,
            mtw,
            mrw,
            mbw,
            plw,
            ptw,
            prw,
            pbw,
            style: {
              display,
              flexDirection,
              width,
              height,
              borderTopWidth,
              borderRightWidth,
              borderBottomWidth,
              borderLeftWidth
            }
          } = item;

          if (isDirectionRow) {
            // row的flex的child如果是inline，变为block
            if (display === 'inline') {
              style.display = 'block';
            } // 横向flex的child如果是竖向flex，高度自动的话要等同于父flex的高度
            else if (display === 'flex' && flexDirection === 'column' && fixedHeight && height.unit === unit.AUTO) {
                height.value = h;
                height.unit = unit.PX;
              }

            item.__layout({
              x,
              y,
              w: main,
              h
            });
          } else {
            // column的flex的child如果是inline，变为block
            if (display === 'inline') {
              style.display = 'block';
            } // 竖向flex的child如果是横向flex，宽度自动的话要等同于父flex的宽度
            else if (display === 'flex' && flexDirection === 'row' && width.unit === unit.AUTO) {
                width.value = w;
                width.unit = unit.PX;
              }

            item.__layout({
              x,
              y,
              w,
              h: main
            });
          } // 重设因伸缩而导致的主轴长度


          if (isOverflow && shrink) {
            if (isDirectionRow) {
              item.__width = main - mlw - mrw - plw - prw - borderLeftWidth.value - borderRightWidth.value;
            } else {
              item.__height = main - mtw - mbw - ptw - pbw - borderTopWidth.value - borderBottomWidth.value;
            }
          } else if (!isOverflow && grow) {
            if (isDirectionRow) {
              item.__width = main - mlw - mrw - plw - prw - borderLeftWidth.value - borderRightWidth.value;
            } else {
              item.__height = main - mtw - mbw - ptw - pbw - borderTopWidth.value - borderBottomWidth.value;
            }
          }
        } else {
          item.__layout({
            x,
            y,
            w: isDirectionRow ? main : w,
            h: isDirectionRow ? h : main
          });
        }

        if (isDirectionRow) {
          x += item.outerWidth;
          maxCross = Math.max(maxCross, item.outerHeight);
        } else {
          y += item.outerHeight;
          maxCross = Math.max(maxCross, item.outerWidth);
        }
      }); // 计算主轴剩余时要用真实剩余空间而不能用伸缩剩余空间

      let diff = isDirectionRow ? w - x + data.x : h - y + data.y; // 主轴侧轴对齐方式

      if (!isOverflow && growSum === 0 && diff > 0) {
        let len = flowChildren.length;

        if (justifyContent === 'flex-end') {
          for (let i = 0; i < len; i++) {
            let child = flowChildren[i];
            isDirectionRow ? child.__offsetX(diff) : child.__offsetY(diff);
          }
        } else if (justifyContent === 'center') {
          let center = diff * 0.5;

          for (let i = 0; i < len; i++) {
            let child = flowChildren[i];
            isDirectionRow ? child.__offsetX(center) : child.__offsetY(center);
          }
        } else if (justifyContent === 'space-between') {
          let between = diff / (len - 1);

          for (let i = 1; i < len; i++) {
            let child = flowChildren[i];
            isDirectionRow ? child.__offsetX(between * i) : child.__offsetY(between * i);
          }
        } else if (justifyContent === 'space-around') {
          let around = diff / (len + 1);

          for (let i = 0; i < len; i++) {
            let child = flowChildren[i];
            isDirectionRow ? child.__offsetX(around * (i + 1)) : child.__offsetY(around * (i + 1));
          }
        }
      } // 子元素侧轴伸展


      if (isDirectionRow) {
        // 父元素固定高度，子元素可能超过，侧轴最大长度取固定高度
        if (fixedHeight) {
          maxCross = h;
        }

        y += maxCross;
      } else {
        if (fixedWidth) {
          maxCross = w;
        }
      } // 侧轴对齐


      if (alignItems === 'stretch') {
        // 短侧轴的children伸张侧轴长度至相同，超过的不动，固定宽高的也不动
        flowChildren.forEach(item => {
          let {
            style,
            mlw,
            mtw,
            mrw,
            mbw,
            ptw,
            prw,
            plw,
            pbw
          } = item;

          if (isDirectionRow) {
            if (style.height.unit === unit.AUTO) {
              item.__height = maxCross - mtw - mbw - ptw - pbw - style.borderTopWidth.value - style.borderBottomWidth.value;
            }
          } else {
            if (style.width.unit === unit.AUTO) {
              item.__width = maxCross - mlw - mrw - plw - prw - style.borderRightWidth.value - style.borderLeftWidth.value;
            }
          }
        });
      } else if (alignItems === 'center') {
        flowChildren.forEach(item => {
          let diff = maxCross - item.outerHeight;

          if (diff > 0) {
            item.__offsetY(diff * 0.5);
          }
        });
      } else if (alignItems === 'flex-end') {
        flowChildren.forEach(item => {
          let diff = maxCross - item.outerHeight;

          if (diff > 0) {
            item.__offsetY(diff);
          }
        });
      }

      this.__width = w;
      this.__height = fixedHeight ? h : y - data.y;
      this.__flowY = y; // 处理margin:xx auto居中对齐

      if (marginLeft.unit === unit.AUTO && marginRight.unit === unit.AUTO && width.unit !== unit.AUTO) {
        let ow = this.outerWidth;

        if (ow < data.w) {
          this.__offsetX((data.w - ow) * 0.5);
        }
      }
    } // inline比较特殊，先简单顶部对其，后续还需根据vertical和lineHeight计算y偏移


    __layoutInline(data) {
      let {
        flowChildren,
        style,
        lineGroups
      } = this;
      let {
        width,
        marginLeft,
        marginRight,
        textAlign
      } = style;

      let {
        fixedWidth,
        fixedHeight,
        x,
        y,
        w,
        h
      } = this.__preLayout(data);

      let maxX = x; // 递归布局，将inline的节点组成lineGroup一行

      let lineGroup = new LineGroup(x, y);
      flowChildren.forEach(item => {
        if (item instanceof Xom) {
          // 绝对定位跳过
          if (item.style.position === 'absolute') {
            this.absChildren.push(item);
            return;
          }

          item.style.display = 'inline'; // inline开头，不用考虑是否放得下直接放

          if (x === data.x) {
            lineGroup.add(item);

            item.__layout({
              x,
              y,
              w,
              h
            });

            x += item.outerWidth;
            maxX = Math.max(maxX, x);
          } else {
            // 非开头先尝试是否放得下
            let fw = item.__tryLayInline(w - x, w); // 放得下继续


            if (fw >= 0) {
              item.__layout({
                x,
                y,
                w,
                h
              });
            } // 放不下处理之前的lineGroup，并重新开头
            else {
                lineGroups.push(lineGroup);
                lineGroup.verticalAlign();
                x = data.x;
                y += lineGroup.height;

                item.__layout({
                  x: data.x,
                  y,
                  w,
                  h
                });

                lineGroup = new LineGroup(x, y);
              }

            x += item.outerWidth;
            maxX = Math.max(maxX, x);
            lineGroup.add(item);
          }
        } // inline里的其它只有文本
        else {
            if (x === data.x) {
              lineGroup.add(item);

              item.__layout({
                x,
                y,
                w,
                h
              });

              x += item.width;
              maxX = Math.max(maxX, x);
            } else {
              // 非开头先尝试是否放得下
              let fw = item.__tryLayInline(w - x, w); // 放得下继续


              if (fw >= 0) {
                item.__layout({
                  x,
                  y,
                  w,
                  h
                });
              } // 放不下处理之前的lineGroup，并重新开头
              else {
                  lineGroups.push(lineGroup);
                  lineGroup.verticalAlign();
                  x = data.x;
                  y += lineGroup.height;

                  item.__layout({
                    x: data.x,
                    y,
                    w,
                    h
                  });

                  lineGroup = new LineGroup(x, y);
                }

              x += item.width;
              maxX = Math.max(maxX, x);
              lineGroup.add(item);
            }
          }
      }); // 结束后处理可能遗留的最后的lineGroup，children为空时可能size为空

      if (lineGroup.size) {
        lineGroups.push(lineGroup);
        lineGroup.verticalAlign();
        y += lineGroup.height;
      } // text-align


      if (['center', 'right'].indexOf(textAlign) > -1) {
        lineGroups.forEach(lineGroup => {
          let diff = w - lineGroup.width;

          if (diff > 0) {
            lineGroup.horizonAlign(textAlign === 'center' ? diff * 0.5 : diff);
          }
        });
      } // 元素的width不能超过父元素w


      this.__width = fixedWidth ? w : maxX - data.x;
      this.__height = fixedHeight ? h : y - data.y;
      this.__flowY = y; // 处理margin:xx auto居中对齐

      if (marginLeft.unit === unit.AUTO && marginRight.unit === unit.AUTO && width.unit !== unit.AUTO) {
        let ow = this.outerWidth;

        if (ow < data.w) {
          this.__offsetX((data.w - ow) * 0.5);
        }
      }
    } // 只针对绝对定位children布局


    __layoutAbs(container) {
      let {
        x,
        y,
        flowY,
        width,
        height,
        style,
        mlw,
        mtw,
        plw,
        ptw,
        prw,
        pbw
      } = container;
      let {
        children,
        absChildren
      } = this;
      let {
        borderTopWidth,
        borderLeftWidth
      } = style;
      x += mlw + borderLeftWidth.value;
      y += mtw + borderTopWidth.value;
      let pw = width + plw + prw;
      let ph = height + ptw + pbw; // 递归进行，遇到absolute/relative的设置新容器

      children.forEach(item => {
        if (item instanceof Dom) {
          item.__layoutAbs(['absolute', 'relative'].indexOf(item.style.position) > -1 ? item : container);
        }
      }); // 对absolute的元素进行相对容器布局

      absChildren.forEach(item => {
        let {
          style,
          style: {
            left,
            top,
            right,
            bottom,
            width: width2,
            height: height2
          }
        } = item;
        let x2, y2, w2, h2; // width优先级高于right高于left，即最高left+right，其次left+width，再次right+width，然后仅申明单个，最次全部auto

        if (left.unit !== unit.AUTO && right.unit !== unit.AUTO) {
          x2 = left.unit === unit.PX ? x + left.value : x + width * left.value * 0.01;
          w2 = right.unit === unit.PX ? x + pw - right.value - x2 : x + pw - width * right.value * 0.01 - x2;
        } else if (left.unit !== unit.AUTO && width2.unit !== unit.AUTO) {
          x2 = left.unit === unit.PX ? x + left.value : x + width * left.value * 0.01;
          w2 = width2.unit === unit.PX ? width2.value : width;
        } else if (right.unit !== unit.AUTO && width2.unit !== unit.AUTO) {
          w2 = width2.unit === unit.PX ? width2.value : width;
          let widthPx = width2.unit === unit.PX ? width2.value : width * width2.value * 0.01;
          x2 = right.unit === unit.PX ? x + pw - right.value - widthPx : x + pw - width * right.value * 0.01 - widthPx;
        } else if (left.unit !== unit.AUTO) {
          x2 = left.unit === unit.PX ? x + left.value : x + width * left.value * 0.01;
          w2 = item.__calAbs(true);
        } else if (right.unit !== unit.AUTO) {
          w2 = item.__calAbs(true);
          x2 = right.unit === unit.PX ? x + pw - right.value - w2 : x + pw - width * right.value * 0.01 - w2;
        } else if (width2.unit !== unit.AUTO) {
          x2 = x;
          w2 = width2.unit === unit.PX ? width2.value : width;
        } else {
          x2 = x;
          w2 = item.__calAbs(true);
        } // top/bottom/height优先级同上


        if (top.unit !== unit.AUTO && bottom.unit !== unit.AUTO) {
          y2 = top.unit === unit.PX ? y + top.value : y + height * top.value * 0.01;
          h2 = bottom.unit === unit.PX ? y + ph - bottom.value - y2 : y + ph - height * bottom.value * 0.01 - y2;
          style.height = {
            value: h2,
            unit: unit.PX
          };
        } else if (top.unit !== unit.AUTO && height2.unit !== unit.AUTO) {
          y2 = top.unit === unit.PX ? y + top.value : y + height * top.value * 0.01;
          h2 = height2.unit === unit.PX ? height2.value : height;
        } else if (bottom.unit !== unit.AUTO && height2.unit !== unit.AUTO) {
          h2 = height2.unit === unit.PX ? height2.value : height;
          let heightPx = height2.unit === unit.PX ? height2.value : height * height2.value * 0.01;
          y2 = bottom.unit === unit.PX ? y + ph - bottom.value - heightPx : y + ph - height * bottom.value * 0.01 - heightPx;
        } else if (top.unit !== unit.AUTO) {
          y2 = top.unit === unit.PX ? y + top.value : y + height * top.value * 0.01;
          h2 = item.__calAbs();
        } else if (bottom.unit !== unit.AUTO) {
          h2 = item.__calAbs();
          y2 = bottom.unit === unit.PX ? y + ph - bottom.value - h2 : y + ph - height * bottom.value * 0.01 - h2;
        } else if (height2.unit !== unit.AUTO) {
          y2 = flowY + mtw + borderTopWidth.value;
          h2 = height2.unit === unit.PX ? height2.value : height;
        } else {
          y2 = flowY + mtw + borderTopWidth.value;
          h2 = item.__calAbs();
        } // absolute时inline强制block


        if (style.display === 'inline') {
          style.display = 'block';
        }

        item.__layout({
          x: x2,
          y: y2,
          w: w2,
          h: h2
        });
      });
    }

    render(renderMode) {
      super.render(renderMode);
      let {
        style: {
          display
        },
        flowChildren,
        children
      } = this;

      if (display === 'none') {
        return;
      } // 先绘制static


      flowChildren.forEach(item => {
        if (item instanceof Text || item.style.position === 'static') {
          item.render(renderMode);
        }
      }); // 再绘制relative和absolute

      children.forEach(item => {
        if (item instanceof Xom && ['relative', 'absolute'].indexOf(item.style.position) > -1) {
          item.render(renderMode);
        }
      });

      if (renderMode === mode.SVG) {
        this.__virtualDom = { ...super.virtualDom,
          type: 'dom',
          children: this.children.map(item => item.virtualDom)
        };
      }
    }

    get tagName() {
      return this.__tagName;
    }

    get children() {
      return this.__children;
    }

    get flowChildren() {
      return this.__flowChildren;
    }

    get absChildren() {
      return this.__absChildren;
    }

    get lineGroups() {
      return this.__lineGroups;
    }

    get baseLine() {
      let len = this.lineGroups.length;

      if (len) {
        let last = this.lineGroups[len - 1];
        return last.y - this.y + last.baseLine;
      }

      return this.y;
    }

    get flowY() {
      return this.__flowY;
    }

    static isValid(s) {
      return TAG_NAME.hasOwnProperty(s);
    }

  }

  function diff(elem, ovd, nvd) {
    let cns = elem.childNodes;
    diffDefs(cns[0], ovd.defs, nvd.defs);
    diffBb(cns[1], ovd.bb, nvd.bb);
    diffD2D(elem, ovd, nvd, true);
  }

  function diffDefs(elem, od, nd) {
    let ol = od.length;
    let nl = nd.length;
    let i = 0;
    let cns = elem.childNodes;

    for (; i < Math.min(ol, nl); i++) {
      diffDef(cns[i], od[i], nd[i]);
    }

    if (i < ol) {
      removeAt(elem, cns, i);
    } else if (i < nl) {
      insertAt(elem, cns, i, util.joinDef(nd[i]));
    }
  }

  function diffDef(elem, od, nd) {
    if (od.k !== nd.k) {
      elem.insertAdjacentHTML('afterend', util.joinDef(nd));
      elem.parentNode.removeChild(elem);
    } else {
      if (od.uuid !== nd.uuid) {
        elem.setAttribute('id', nd.uuid);
      }

      let op = {};

      for (let j = 0, len = od.props.length; j < len; j++) {
        let prop = od.props[j];
        let [k, v] = prop;
        op[k] = v;
      }

      for (let j = 0, len = nd.props.length; j < len; j++) {
        let prop = nd.props[j];
        let [k, v] = prop; // 已有不等更新，没有添加

        if (op.hasOwnProperty(k)) {
          if (op[k] !== v) {
            elem.setAttribute(k, v);
          }

          delete op[k];
        } else {
          elem.setAttribute(k, v);
        }
      } // 多余的删除


      for (let k in op) {
        if (op.hasOwnProperty(k)) {
          elem.removeAttribute(k);
        }
      }

      let cns = elem.childNodes;
      let ol = od.stop.length;
      let nl = nd.stop.length;
      let i = 0;

      for (; i < Math.min(ol, nl); i++) {
        diffStop(cns[i], od.stop[i], nd.stop[i]);
      }

      if (i < ol) {
        for (; i < ol; i++) {
          removeAt(elem, cns, i);
        }
      } else if (i < nl) {
        for (; i < nl; i++) {
          insertAt(elem, cns, i, util.joinStop(nd.stop[i]));
        }
      }
    }
  }

  function diffStop(elem, os, ns) {
    if (os[0] !== ns[0]) {
      elem.setAttribute('stop-color', ns[0]);
    }

    if (os[1] !== ns[1]) {
      elem.setAttribute('offset', ns[1]);
    }
  }

  function diffChild(elem, ovd, nvd) {
    if (ovd.type === 'dom') {
      if (nvd.type === 'dom') {
        diffD2D(elem, ovd, nvd);
      } else if (nvd.type === 'text') {
        replaceWith(elem, nvd);
      } else if (nvd.type === 'geom') {
        diffD2G(elem, ovd, nvd);
      }
    } else if (nvd.type === 'text') {
      if (nvd.type === 'dom') {
        replaceWith(elem, nvd);
      } else if (nvd.type === 'text') {
        diffT2T(elem, ovd, nvd);
      } else if (nvd.type === 'geom') {
        replaceWith(elem, nvd);
      }
    } else if (nvd.type === 'geom') {
      if (nvd.type === 'dom') {
        diffG2D(elem, ovd, nvd);
      } else if (nvd.type === 'text') {
        replaceWith(elem, nvd);
      } else if (nvd.type === 'geom') {
        diffG2G(elem, ovd, nvd);
      }
    }
  }

  function diffD2D(elem, ovd, nvd, root) {
    if (!root) {
      diffBb(elem.firstChild, ovd.bb, nvd.bb);
    }

    let ol = ovd.children.length;
    let nl = nvd.children.length;
    let i = 0;
    let lastChild = elem.lastChild;
    let cns = lastChild.childNodes;

    for (; i < Math.min(ol, nl); i++) {
      diffChild(cns[i], ovd.children[i], nvd.children[i]);
    }

    if (i < ol) {
      for (; i < ol; i++) {
        removeAt(lastChild, cns, i);
      }
    } else if (i < nl) {
      for (; i < nl; i++) {
        insertAt(lastChild, cns, i, util.joinVd(nvd.children[i]));
      }
    }
  }

  function diffD2G(elem, ovd, nvd) {
    diffBb(elem.firstChild, ovd.bb, nvd.bb);
    replaceWith(elem.lastChild, nvd.children);
  }

  function diffT2T(elem, ovd, nvd) {
    let ol = ovd.children.length;
    let nl = nvd.children.length;
    let i = 0;

    for (; i < Math.min(ol, nl); i++) {
      diffItem(elem, i, ovd.children[i], nvd.children[i], true);
    }

    let cns = elem.childNodes;

    if (i < ol) {
      for (; i < ol; i++) {
        removeAt(elem, cns, i);
      }
    } else if (i < nl) {
      for (; i < nl; i++) {
        insertAt(elem, cns, i, util.joinVd(nvd.children[i]));
      }
    }
  }

  function diffG2D(elem, ovd, nvd) {
    diffBb(elem.firstChild, ovd.bb, nvd.bb);
    replaceWith(elem.lastChild, nvd.children);
  }

  function diffG2G(elem, ovd, nvd) {
    if (!equalArr(ovd.transform, nvd.transform)) {
      let transform = util.joinTransform(nvd.transform);

      if (elem.getAttribute('transform') !== transform) {
        elem.setAttribute('transform', transform);
      }
    }

    diffBb(elem.firstChild, ovd.bb, nvd.bb);
    let ol = ovd.children.length;
    let nl = nvd.children.length;
    let i = 0;
    let lastChild = elem.lastChild;
    let cns = lastChild.childNodes;

    for (; i < Math.min(ol, nl); i++) {
      diffItem(lastChild, i, ovd.children[i], nvd.children[i]);
    }

    if (i < ol) {
      for (; i < ol; i++) {
        removeAt(lastChild, cns, i);
      }
    } else if (i < nl) {
      for (; i < nl; i++) {
        insertAt(lastChild, cns, i, util.joinVd(nvd.children[i]));
      }
    }
  }

  function diffBb(elem, obb, nbb) {
    let ol = obb.length;
    let nl = nbb.length;
    let i = 0;

    for (; i < Math.min(ol, nl); i++) {
      diffItem(elem, i, obb[i], nbb[i]);
    }

    let cns = elem.childNodes;

    if (i < ol) {
      for (; i < ol; i++) {
        removeAt(elem, cns, i);
      }
    } else if (i < nl) {
      for (; i < nl; i++) {
        insertAt(elem, cns, i, util.joinVd(nbb[i]));
      }
    }
  }

  function diffItem(elem, i, ovd, nvd, isText) {
    let cns = elem.childNodes;

    if (ovd.tagName !== nvd.tagName) {
      replaceWith(cns[i], nvd);
    } else {
      let op = {};

      for (let j = 0, len = ovd.props.length; j < len; j++) {
        let prop = ovd.props[j];
        let [k, v] = prop;
        op[k] = v;
      }

      for (let j = 0, len = nvd.props.length; j < len; j++) {
        let prop = nvd.props[j];
        let [k, v] = prop; // 已有不等更新，没有添加

        if (op.hasOwnProperty(k)) {
          if (op[k] !== v) {
            cns[i].setAttribute(k, v);
          }

          delete op[k];
        } else {
          cns[i].setAttribute(k, v);
        }
      } // 多余的删除


      for (let k in op) {
        if (op.hasOwnProperty(k)) {
          cns[i].removeAttribute(k);
        }
      }

      if (isText && ovd.content !== nvd.content) {
        cns[i].textContent = nvd.content;
      }
    }
  }

  function replaceWith(elem, vd) {
    let res;

    if (Array.isArray(vd)) {
      res = '';
      vd.forEach(item => {
        res += util.joinVd(item);
      });
    } else {
      res = util.joinVd(vd);
    }

    elem.insertAdjacentHTML('afterend', res);
    elem.parentNode.removeChild(elem);
  }

  function insertAt(elem, cns, index, html) {
    if (index >= cns.length) {
      elem.insertAdjacentHTML('beforeend', html);
    } else {
      cns[index].insertAdjacentHTML('beforebegin', html);
    }
  }

  function removeAt(elem, cns, index) {
    if (cns[index]) {
      elem.removeChild(cns[index]);
    }
  }

  function equalArr(a, b) {
    if (a.length !== b.length) {
      return false;
    }

    for (let i = 0, len = a.length; i < len; i++) {
      if (a[i] !== b[i]) {
        return false;
      }
    }

    return true;
  }

  class Defs {
    constructor(uuid) {
      this.id = uuid;
      this.count = 0;
      this.list = [];
    }

    add(data) {
      data.uuid = `karas-defs-${this.id}-${this.count++}`;
      this.list.push(data);
      return data.uuid;
    }

    clear() {
      this.list = [];
      this.count = 0;
    }

    get value() {
      return this.list;
    }

    static getInstance(uuid) {
      return new Defs(uuid);
    }

  }

  function getDom(dom) {
    if (util.isString(dom)) {
      let o = document.querySelector(dom);

      if (!o) {
        throw new Error('can not find dom of selector: ' + dom);
      }

      return o;
    }

    if (!dom) {
      throw new Error('can not find dom: ' + dom);
    }

    return dom;
  }

  function renderProp(k, v) {
    let s = Array.isArray(v) ? util.joinSourceArray(v) : util.stringify(v);

    if (k === 'className') {
      k = 'class';
    }

    return ' ' + k + '="' + util.encodeHtml(s, true) + '"';
  }

  let uuid = 0;

  class Root extends Dom {
    constructor(tagName, props, children) {
      super(tagName, props, children);
      this.__node = null; // 真实DOM引用
    }

    __initProps() {
      if (this.props.width !== undefined) {
        let value = parseInt(this.props.width);

        if (!isNaN(value) && value > 0) {
          this.__width = value;
        }
      }

      if (this.props.height !== undefined) {
        let value = parseInt(this.props.height);

        if (!isNaN(value) && value > 0) {
          this.__height = value;
        }
      }
    }

    __genHtml() {
      let res = `<${this.tagName}`; // 拼接处理属性

      for (let i = 0, len = this.__props.length; i < len; i++) {
        let item = this.__props[i];
        res += renderProp(item[0], item[1]);
      }

      res += `></${this.tagName}>`;
      return res;
    } // 类似touchend/touchcancel这种无需判断是否发生于元素上，直接强制响应


    __cb(e, force) {
      if (e.touches && e.touches.length > 1) {
        return;
      }

      let {
        node
      } = this;
      let {
        x,
        y,
        top,
        right
      } = node.getBoundingClientRect();
      x = x || top || 0;
      y = y || right || 0;
      let {
        clientX,
        clientY
      } = e.touches ? e.touches[0] || {} : e;
      x = clientX - x;
      y = clientY - y;

      this.__emitEvent({
        event: e,
        x,
        y,
        covers: []
      }, force);
    }

    __initEvent() {
      let {
        node
      } = this;
      ['click', 'dblclick', 'mousedown', 'mousemove', 'mouseup', 'touchstart', 'touchmove', 'touchend', 'touchcancel'].forEach(type => {
        node.addEventListener(type, e => {
          this.__cb(e, ['touchend', 'touchcancel', 'touchmove'].indexOf(type) > -1);
        });
      });
    }

    appendTo(dom) {
      dom = getDom(dom);

      this.__initProps(); // 已有root节点


      if (dom.nodeName.toUpperCase() === this.tagName.toUpperCase()) {
        this.__node = dom;

        if (this.width) {
          dom.setAttribute('width', this.width);
        }

        if (this.height) {
          dom.setAttribute('height', this.height);
        }
      } // 没有canvas/svg节点则生成一个新的
      else {
          this.__node = dom.querySelector(this.tagName);

          if (!this.__node) {
            dom.innerHTML = this.__genHtml();
            this.__node = dom.querySelector(this.tagName);
          }
        }

      this.__uuid = this.__node.__uuid || uuid++;
      this.__defs = this.node.__od || Defs.getInstance(this.__uuid);

      this.__defs.clear(); // 没有设置width/height则采用css计算形式


      if (!this.width || !this.height) {
        let css = window.getComputedStyle(dom, null);

        if (!this.width) {
          this.__width = parseInt(css.getPropertyValue('width'));
          dom.setAttribute('width', this.width);
        }

        if (!this.height) {
          this.__height = parseInt(css.getPropertyValue('height'));
          dom.setAttribute('height', this.height);
        }
      } // 只有canvas有ctx，svg用真实dom


      let renderMode;

      if (this.tagName === 'canvas') {
        this.__ctx = this.__node.getContext('2d');

        this.__ctx.clearRect(0, 0, this.width, this.height);

        renderMode = mode.CANVAS;
      } else if (this.tagName === 'svg') {
        renderMode = mode.SVG;
      } // canvas/svg作为根节点一定是block或flex，不会是inline


      let {
        style
      } = this;

      if (['flex', 'block'].indexOf(style.display) === -1) {
        style.display = 'block';
      } // 同理position不能为absolute


      if (style.position === 'absolute') {
        style.position = 'static';
      }

      this.__traverse(this.__ctx, this.__defs, renderMode); // canvas的宽高固定初始化


      style.width = this.width;
      style.height = this.height;

      this.__initStyle();

      this.__layout({
        x: 0,
        y: 0,
        w: this.width,
        h: this.height
      });

      this.__layoutAbs(this);

      this.render(renderMode);

      if (renderMode === mode.SVG) {
        let nvd = this.virtualDom;
        let nd = this.__defs;
        nvd.defs = nd.value;

        if (this.node.__karasInit) {
          diff(this.node, this.node.__ovd, nvd);
        } else {
          this.node.innerHTML = util.joinVirtualDom(nvd, nd.value);
        }

        this.node.__ovd = nvd;
        this.node.__od = nd;
      }

      if (!this.node.__karasInit) {
        this.node.__karasInit = true;

        this.__initEvent();
      }
    }

    get node() {
      return this.__node;
    }

    get imageData() {
      return this.__imageData;
    }

  }

  class Line extends Geom {
    constructor(tagName, props) {
      super(tagName, props); // begin和end表明线段的首尾坐标，control表明控制点坐标

      this.__begin = [0, 0];
      this.__end = [1, 1];
      this.__control = [];

      if (Array.isArray(this.props.begin)) {
        this.__begin = this.props.begin;
      }

      if (Array.isArray(this.props.end)) {
        this.__end = this.props.end;
      }

      if (Array.isArray(this.props.control)) {
        this.__control = this.props.control;
      }
    }

    render(renderMode) {
      super.render(renderMode);
      let {
        width,
        height,
        ctx,
        begin,
        end,
        control
      } = this;

      if (begin.length < 2 || end.length < 2) {
        return;
      }

      let {
        originX,
        originY,
        display,
        stroke,
        strokeWidth,
        strokeDasharray,
        slg
      } = this.getPreRender();

      if (display === 'none') {
        return;
      }

      let x1 = originX + begin[0] * width;
      let y1 = originY + begin[1] * height;
      let x2 = originX + end[0] * width;
      let y2 = originY + end[1] * height;
      let curve = 0; // 控制点，曲线

      let cx1, cy1, cx2, cy2;

      if (Array.isArray(control[0])) {
        curve++;
        cx1 = originX + control[0][0] * width;
        cy1 = originY + control[0][1] * height;
      }

      if (Array.isArray(control[1])) {
        curve++;
        cx2 = originX + control[1][0] * width;
        cy2 = originY + control[1][1] * height;
      }

      if (renderMode === mode.CANVAS) {
        ctx.strokeStyle = slg ? this.getCanvasLg(slg) : stroke;
        ctx.lineWidth = strokeWidth;
        ctx.setLineDash(strokeDasharray);
        ctx.beginPath();
        ctx.moveTo(x1, y1);

        if (curve === 2) {
          ctx.bezierCurveTo(cx1, cy1, cx2, cy2, x2, y2);
        } else if (curve === 1) {
          ctx.quadraticCurveTo(cx1, cy1, x2, y2);
        } else {
          ctx.lineTo(x2, y2);
        }

        if (strokeWidth > 0) {
          ctx.stroke();
        }

        ctx.closePath();
      } else if (renderMode === mode.SVG) {
        if (slg) {
          let uuid = this.getSvgLg(slg);
          stroke = `url(#${uuid})`;
        }

        let d;

        if (curve === 2) {
          d = `M${x1} ${y1} C${cx1} ${cy1} ${cx2} ${cy2} ${x2} ${y2}`;
        } else if (curve === 1) {
          d = `M${x1} ${y1} Q${cx1} ${cy1} ${x2} ${y2}`;
        } else {
          d = `M${x1} ${y1} L${x2} ${y2}`;
        }

        this.addGeom('path', [['d', d], ['fill', 'none'], ['stroke', stroke], ['stroke-width', strokeWidth], ['stroke-dasharray', strokeDasharray]]);
      }
    }

    get begin() {
      return this.__begin;
    }

    get end() {
      return this.__end;
    }

    get control() {
      return this.__control;
    }

  }

  class Polyline extends Geom {
    constructor(tagName, props) {
      super(tagName, props); // 折线所有点的列表

      this.__points = [];

      if (Array.isArray(this.props.points)) {
        this.__points = this.props.points;
      } // 原点位置，4个角，默认左下


      if (['TOP_LEFT', 'TOP_RIGHT', 'BOTTOM_LEFT', 'BOTTOM_RIGHT'].indexOf(this.props.origin) > -1) {
        this.__origin = this.props.origin;
      } else {
        this.__origin = 'TOP_LEFT';
      }
    }

    render(renderMode) {
      super.render(renderMode);
      let {
        width,
        height,
        ctx,
        points,
        origin
      } = this;

      if (points.length < 2) {
        return;
      }

      for (let i = 0, len = points.length; i < len; i++) {
        if (!Array.isArray(points[i]) || points[i].length < 2) {
          return;
        }
      }

      let {
        originX,
        originY,
        display,
        stroke,
        strokeWidth,
        strokeDasharray,
        slg
      } = this.getPreRender();

      if (display === 'none') {
        return;
      }

      let pts = this.__pts = [];

      if (origin === 'TOP_LEFT') {
        points.forEach(item => {
          pts.push([originX + item[0] * width, originY + item[1] * height]);
        });
      } else if (origin === 'TOP_RIGHT') {
        points.forEach(item => {
          pts.push([originX + width - item[0] * width, originY + item[1] * height]);
        });
      } else if (origin === 'BOTTOM_LEFT') {
        points.forEach(item => {
          pts.push([originX + item[0] * width, originY + height - item[1] * height]);
        });
      } else if (origin === 'BOTTOM_RIGHT') {
        points.forEach(item => {
          pts.push([originX + width - item[0] * width, originY + height - item[1] * height]);
        });
      }

      if (renderMode === mode.CANVAS) {
        ctx.strokeStyle = slg ? this.getCanvasLg(slg) : stroke;
        ctx.lineWidth = strokeWidth;
        ctx.setLineDash(strokeDasharray);
        ctx.beginPath();
        ctx.moveTo(pts[0][0], pts[0][1]);

        for (let i = 1, len = pts.length; i < len; i++) {
          let point = pts[i];
          ctx.lineTo(point[0], point[1]);
        }

        if (strokeWidth > 0) {
          ctx.stroke();
        }

        ctx.closePath();
      } else if (renderMode === mode.SVG) {
        let points = '';

        for (let i = 0, len = pts.length; i < len; i++) {
          let point = pts[i];
          points += `${point[0]},${point[1]} `;
        }

        if (slg) {
          let uuid = this.getSvgLg(slg);
          stroke = `url(#${uuid})`;
        }

        this.addGeom('polyline', [['points', points], ['fill', 'none'], ['stroke', stroke], ['stroke-width', strokeWidth], ['stroke-dasharray', strokeDasharray]]);
      }
    }

    get points() {
      return this.__points;
    }

    get origin() {
      return this.__origin;
    }

  }

  class Polygon extends Geom {
    constructor(tagName, props) {
      super(tagName, props); // 所有点的列表

      this.__points = [];

      if (Array.isArray(this.props.points)) {
        this.__points = this.props.points;
      }
    }

    render(renderMode) {
      super.render(renderMode);
      let {
        width,
        height,
        ctx,
        points
      } = this;

      if (points.length < 3) {
        return;
      }

      for (let i = 0, len = points.length; i < len; i++) {
        if (!Array.isArray(points[i]) || points[i].length < 2) {
          return;
        }
      }

      let {
        originX,
        originY,
        display,
        fill,
        stroke,
        strokeWidth,
        strokeDasharray,
        slg,
        flg,
        frg
      } = this.getPreRender();

      if (display === 'none') {
        return;
      }

      points.forEach(item => {
        item[0] = originX + item[0] * width;
        item[1] = originY + item[1] * height;
      });

      if (renderMode === mode.CANVAS) {
        ctx.strokeStyle = slg ? this.getCanvasLg(slg) : stroke;
        ctx.lineWidth = strokeWidth;

        if (flg) {
          ctx.fillStyle = this.getCanvasLg(flg);
        } else if (frg) {
          ctx.fillStyle = this.getCanvasRg(frg);
        } else {
          ctx.fillStyle = fill;
        }

        ctx.setLineDash(strokeDasharray);
        ctx.beginPath();
        ctx.moveTo(points[0][0], points[0][1]);

        for (let i = 1, len = points.length; i < len; i++) {
          let point = points[i];
          ctx.lineTo(point[0], point[1]);
        }

        ctx.lineTo(points[0][0], points[0][1]);
        ctx.fill();

        if (strokeWidth > 0) {
          ctx.stroke();
        }

        ctx.closePath();
      } else if (renderMode === mode.SVG) {
        let pts = '';

        for (let i = 0, len = points.length; i < len; i++) {
          let point = points[i];
          pts += `${point[0]},${point[1]} `;
        }

        if (slg) {
          let uuid = this.getSvgLg(slg);
          stroke = `url(#${uuid})`;
        }

        if (flg) {
          let uuid = this.getSvgLg(flg);
          fill = `url(#${uuid})`;
        } else if (frg) {
          let uuid = this.getSvgRg(frg);
          fill = `url(#${uuid})`;
        }

        this.addGeom('polygon', [['points', pts], ['fill', fill], ['stroke', stroke], ['stroke-width', strokeWidth], ['stroke-dasharray', strokeDasharray]]);
      }
    }

    get points() {
      return this.__points;
    }

  }

  const OFFSET = Math.PI * 0.5;

  function getCoordsByDegree(x, y, r, d) {
    d = d % 360;

    if (d >= 0 && d < 90) {
      return [x + Math.sin(d * Math.PI / 180) * r, y - Math.cos(d * Math.PI / 180) * r];
    } else if (d >= 90 && d < 180) {
      return [x + Math.cos((d - 90) * Math.PI / 180) * r, y + Math.sin((d - 90) * Math.PI / 180) * r];
    } else if (d >= 180 && d < 270) {
      return [x - Math.cos((270 - d) * Math.PI / 180) * r, y + Math.sin((270 - d) * Math.PI / 180) * r];
    } else {
      return [x - Math.sin((360 - d) * Math.PI / 180) * r, y - Math.cos((360 - d) * Math.PI / 180) * r];
    }
  }

  class Sector extends Geom {
    constructor(tagName, props) {
      super(tagName, props); // 角度

      this.__begin = 0;
      this.__end = 0;

      if (this.props.begin) {
        this.__begin = parseFloat(this.props.begin);

        if (isNaN(this.begin)) {
          this.__begin = 0;
        }
      }

      if (this.props.end) {
        this.__end = parseFloat(this.props.end);

        if (isNaN(this.end)) {
          this.__end = 0;
        }
      } // 半径0~1，默认1


      this.__r = 1;

      if (this.props.r) {
        this.__r = parseFloat(this.props.r);

        if (isNaN(this.r)) {
          this.__r = 1;
        }
      } // 扇形两侧是否有边


      this.__edge = false;

      if (this.props.edge !== undefined) {
        this.__edge = !!this.props.edge;
      }
    }

    render(renderMode) {
      super.render(renderMode);
      let {
        rx: x,
        ry: y,
        width,
        height,
        mlw,
        mtw,
        plw,
        ptw,
        style,
        ctx,
        begin,
        end,
        r,
        virtualDom
      } = this;

      if (begin === end) {
        return;
      }

      let {
        cx,
        cy,
        display,
        fill,
        stroke,
        strokeWidth,
        strokeDasharray,
        slg,
        flg,
        frg
      } = this.getPreRender();

      if (display === 'none') {
        return;
      }

      r *= Math.min(width, height) * 0.5;
      let x1, y1, x2, y2;
      [x1, y1] = getCoordsByDegree(cx, cy, r, begin);
      [x2, y2] = getCoordsByDegree(cx, cy, r, end);

      if (renderMode === mode.CANVAS) {
        ctx.strokeStyle = slg ? this.getCanvasLg(slg) : stroke;
        ctx.lineWidth = strokeWidth;

        if (flg) {
          ctx.fillStyle = this.getCanvasLg(flg);
        } else if (frg) {
          ctx.fillStyle = this.getCanvasRg(frg);
        } else {
          ctx.fillStyle = fill;
        }

        ctx.setLineDash(strokeDasharray);
        ctx.beginPath();
        ctx.arc(cx, cy, r, begin * Math.PI / 180 - OFFSET, end * Math.PI / 180 - OFFSET);

        if (this.edge) {
          ctx.lineTo(cx, cy);
          ctx.lineTo(x1, y1);

          if (strokeWidth > 0) {
            ctx.stroke();
          }
        } else {
          if (strokeWidth > 0) {
            ctx.stroke();
          }

          ctx.lineTo(cx, cy);
          ctx.lineTo(x1, y1);
        }

        ctx.fill();
        ctx.closePath();
      } else if (renderMode === mode.SVG) {
        let large = end - begin > 180 ? 1 : 0;

        if (slg) {
          let uuid = this.getSvgLg(slg);
          stroke = `url(#${uuid})`;
        }

        if (flg) {
          let uuid = this.getSvgLg(flg);
          fill = `url(#${uuid})`;
        } else if (frg) {
          let uuid = this.getSvgRg(frg);
          fill = `url(#${uuid})`;
        }

        if (this.edge) {
          this.addGeom('path', [['d', `M${cx} ${cy} L${x1} ${y1} A${r} ${r} 0 ${large} 1 ${x2} ${y2} z`], ['fill', fill], ['stroke', stroke], ['stroke-width', strokeWidth], ['stroke-dasharray', strokeDasharray]]);
        } else {
          this.addGeom('path', [['d', `M${cx} ${cy} L${x1} ${y1} A${r} ${r} 0 ${large} 1 ${x2} ${y2} z`], ['fill', fill]]);
          this.addGeom('path', [['d', `M${x1} ${y1} A${r} ${r} 0 ${large} 1 ${x2} ${y2}`], ['fill', 'transparent'], ['stroke', stroke], ['stroke-width', strokeWidth], ['stroke-dasharray', strokeDasharray]]);
        }
      }
    }

    get begin() {
      return this.__begin;
    }

    get end() {
      return this.__end;
    }

    get r() {
      return this.__r;
    }

    get edge() {
      return this.__edge;
    }

  }

  class Rect extends Geom {
    constructor(tagName, props) {
      super(tagName, props);
    }

    render(renderMode) {
      super.render(renderMode);
      let {
        rx: x,
        ry: y,
        width,
        height,
        ctx
      } = this;
      let {
        originX,
        originY,
        display,
        fill,
        stroke,
        strokeWidth,
        strokeDasharray,
        slg,
        flg,
        frg
      } = this.getPreRender();

      if (display === 'none') {
        return;
      }

      if (renderMode === mode.CANVAS) {
        ctx.strokeStyle = slg ? this.getCanvasLg(slg) : stroke;
        ctx.lineWidth = strokeWidth;

        if (flg) {
          ctx.fillStyle = this.getCanvasLg(flg);
        } else if (frg) {
          ctx.fillStyle = this.getCanvasRg(frg);
        } else {
          ctx.fillStyle = fill;
        }

        ctx.setLineDash(strokeDasharray);
        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(originX + width, originY);
        ctx.lineTo(originX + width, originY + height);
        ctx.lineTo(originX, originY + height);
        ctx.lineTo(originX, originY);
        ctx.fill();

        if (strokeWidth > 0) {
          ctx.stroke();
        }

        ctx.closePath();
      } else if (renderMode === mode.SVG) {
        if (slg) {
          let uuid = this.getSvgLg(slg);
          stroke = `url(#${uuid})`;
        }

        if (flg) {
          let uuid = this.getSvgLg(flg);
          fill = `url(#${uuid})`;
        } else if (frg) {
          let uuid = this.getSvgRg(frg);
          fill = `url(#${uuid})`;
        }

        this.addGeom('rect', [['x', x], ['y', y], ['width', width], ['height', height], ['fill', fill], ['stroke', stroke], ['stroke-width', strokeWidth], ['stroke-dasharray', strokeDasharray]]);
      }
    }

  }

  class Circle extends Geom {
    constructor(tagName, props) {
      super(tagName, props); // 半径0~1，默认1

      this.__r = 1;

      if (this.props.r) {
        this.__r = parseFloat(this.props.r);

        if (isNaN(this.r)) {
          this.__r = 1;
        }
      }
    }

    render(renderMode) {
      super.render(renderMode);
      let {
        width,
        height,
        ctx,
        r
      } = this;
      let {
        cx,
        cy,
        display,
        fill,
        stroke,
        strokeWidth,
        strokeDasharray,
        slg,
        flg,
        frg
      } = this.getPreRender();

      if (display === 'none') {
        return;
      }

      r *= Math.min(width, height) * 0.5;

      if (renderMode === mode.CANVAS) {
        ctx.strokeStyle = slg ? this.getCanvasLg(slg) : stroke;
        ctx.lineWidth = strokeWidth;

        if (flg) {
          ctx.fillStyle = this.getCanvasLg(flg);
        } else if (frg) {
          ctx.fillStyle = this.getCanvasRg(frg);
        } else {
          ctx.fillStyle = fill;
        }

        ctx.setLineDash(strokeDasharray);
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, 2 * Math.PI);
        ctx.fill();

        if (strokeWidth > 0) {
          ctx.stroke();
        }

        ctx.closePath();
      } else if (renderMode === mode.SVG) {
        if (slg) {
          let uuid = this.getSvgLg(slg);
          stroke = `url(#${uuid})`;
        }

        if (flg) {
          let uuid = this.getSvgLg(flg);
          fill = `url(#${uuid})`;
        } else if (frg) {
          let uuid = this.getSvgRg(frg);
          fill = `url(#${uuid})`;
        }

        this.addGeom('circle', [['cx', cx], ['cy', cy], ['r', r], ['fill', fill], ['stroke', stroke], ['stroke-width', strokeWidth], ['stroke-dasharray', strokeDasharray]]);
      }
    }

    get r() {
      return this.__r;
    }

  }

  class Ellipse extends Geom {
    constructor(tagName, props) {
      super(tagName, props); // 半径0~1，默认1

      this.__xr = 1;

      if (this.props.rx) {
        this.__xr = parseFloat(this.props.rx);

        if (isNaN(this.xr)) {
          this.__xr = 1;
        }
      }

      this.__yr = 1;

      if (this.props.ry) {
        this.__yr = parseFloat(this.props.ry);

        if (isNaN(this.yr)) {
          this.__yr = 1;
        }
      }
    }

    render(renderMode) {
      super.render(renderMode);
      let {
        width,
        height,
        ctx,
        xr,
        yr
      } = this;
      let {
        cx,
        cy,
        display,
        fill,
        stroke,
        strokeWidth,
        strokeDasharray,
        slg,
        flg,
        frg
      } = this.getPreRender();

      if (display === 'none') {
        return;
      }

      xr *= width * 0.5;
      yr *= height * 0.5;

      if (renderMode === mode.CANVAS) {
        ctx.strokeStyle = slg ? this.getCanvasLg(slg) : stroke;
        ctx.lineWidth = strokeWidth;

        if (flg) {
          ctx.fillStyle = this.getCanvasLg(flg);
        } else if (frg) {
          ctx.fillStyle = this.getCanvasRg(frg);
        } else {
          ctx.fillStyle = fill;
        }

        ctx.setLineDash(strokeDasharray);
        ctx.beginPath();
        ctx.ellipse && ctx.ellipse(cx, cy, xr, yr, 0, 0, 2 * Math.PI);
        ctx.fill();

        if (strokeWidth > 0) {
          ctx.stroke();
        }

        ctx.closePath();
      } else if (renderMode === mode.SVG) {
        if (slg) {
          let uuid = this.getSvgLg(slg);
          stroke = `url(#${uuid})`;
        }

        if (flg) {
          let uuid = this.getSvgLg(flg);
          fill = `url(#${uuid})`;
        } else if (frg) {
          let uuid = this.getSvgRg(frg);
          fill = `url(#${uuid})`;
        }

        this.addGeom('ellipse', [['cx', cx], ['cy', cy], ['rx', xr], ['ry', yr], ['fill', fill], ['stroke', stroke], ['stroke-width', strokeWidth], ['stroke-dasharray', strokeDasharray]]);
      }
    }

    get xr() {
      return this.__xr;
    }

    get yr() {
      return this.__yr;
    }

  }

  Geom.register('$line', Line);
  Geom.register('$polyline', Polyline);
  Geom.register('$polygon', Polygon);
  Geom.register('$sector', Sector);
  Geom.register('$rect', Rect);
  Geom.register('$circle', Circle);
  Geom.register('$ellipse', Ellipse);
  let karas = {
    render(root, dom) {
      if (!(root instanceof Root)) {
        throw new Error('render root muse be canvas or svg');
      }

      if (dom) {
        root.appendTo(dom);
      }

      return root;
    },

    createVd(tagName, props, children) {
      if (['canvas', 'svg'].indexOf(tagName) > -1) {
        return new Root(tagName, props, children);
      }

      if (Dom.isValid(tagName)) {
        return new Dom(tagName, props, children);
      }

      throw new Error('can not use marker: ' + tagName);
    },

    createGm(tagName, props) {
      let klass = Geom.getRegister(tagName);
      return new klass(tagName, props);
    },

    createCp(cp, props) {
      return new cp(props);
    },

    Geom,
    mode
  };

  if (typeof window != 'undefined') {
    window.karas = karas;
  }

  return karas;

}));
//# sourceMappingURL=index.js.map
