(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.karas = factory());
}(this, function () { 'use strict';

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(source, true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(source).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _superPropBase(object, property) {
    while (!Object.prototype.hasOwnProperty.call(object, property)) {
      object = _getPrototypeOf(object);
      if (object === null) break;
    }

    return object;
  }

  function _get(target, property, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.get) {
      _get = Reflect.get;
    } else {
      _get = function _get(target, property, receiver) {
        var base = _superPropBase(target, property);

        if (!base) return;
        var desc = Object.getOwnPropertyDescriptor(base, property);

        if (desc.get) {
          return desc.get.call(receiver);
        }

        return desc.value;
      };
    }

    return _get(target, property, receiver || target);
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _iterableToArrayLimit(arr, i) {
    if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
      return;
    }

    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  var Node =
  /*#__PURE__*/
  function () {
    function Node() {
      _classCallCheck(this, Node);

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

    _createClass(Node, [{
      key: "__offsetX",
      value: function __offsetX(diff) {
        this.__ox += diff;
      }
    }, {
      key: "__offsetY",
      value: function __offsetY(diff) {
        this.__oy += diff;
      }
    }, {
      key: "x",
      get: function get() {
        return this.__x;
      }
    }, {
      key: "y",
      get: function get() {
        return this.__y;
      }
    }, {
      key: "ox",
      get: function get() {
        return this.__ox;
      }
    }, {
      key: "oy",
      get: function get() {
        return this.__oy;
      }
    }, {
      key: "rx",
      get: function get() {
        return this.x + this.ox;
      }
    }, {
      key: "ry",
      get: function get() {
        return this.y + this.oy;
      }
    }, {
      key: "width",
      get: function get() {
        return this.__width;
      }
    }, {
      key: "height",
      get: function get() {
        return this.__height;
      }
    }, {
      key: "outerWidth",
      get: function get() {
        return this.__width;
      }
    }, {
      key: "outerHeight",
      get: function get() {
        return this.__height;
      }
    }, {
      key: "prev",
      get: function get() {
        return this.__prev;
      }
    }, {
      key: "next",
      get: function get() {
        return this.__next;
      }
    }, {
      key: "parent",
      get: function get() {
        return this.__parent;
      } // canvas/svg根节点

    }, {
      key: "root",
      get: function get() {
        if (this.host) {
          return this.host.root;
        }

        if (this.parent) {
          return this.parent.root;
        }

        return this;
      } // component根节点

    }, {
      key: "host",
      get: function get() {
        var parent = this.parent;

        while (parent) {
          if (/A-Z/.test(parent.tagName.charAt(0))) {
            return parent.host;
          }

          parent = parent.parent;
        }
      }
    }, {
      key: "style",
      get: function get() {
        return this.__style;
      }
    }, {
      key: "ctx",
      get: function get() {
        return this.__ctx;
      }
    }, {
      key: "defs",
      get: function get() {
        return this.__defs;
      }
    }, {
      key: "baseLine",
      get: function get() {
        return this.__baseLine;
      }
    }, {
      key: "virtualDom",
      get: function get() {
        return this.__virtualDom;
      }
    }]);

    return Node;
  }();

  var CANVAS = 0;
  var SVG = 1;
  var div;
  var mode = {
    CANVAS: CANVAS,
    SVG: SVG,
    measure: function measure(s, style) {
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
      var css = window.getComputedStyle(div, null);
      return parseFloat(css.width);
    }
  };

  var unit = {
    AUTO: 0,
    PX: 1,
    PERCENT: 2,
    POSITION: 3
  };

  var toString = {}.toString;

  function isType(type) {
    return function (obj) {
      return toString.call(obj) === '[object ' + type + ']';
    };
  }

  var isNumber = isType('Number');

  function _joinSourceArray(arr) {
    var res = '';

    for (var i = 0, len = arr.length; i < len; i++) {
      var item = arr[i];

      if (Array.isArray(item)) {
        res += _joinSourceArray(item);
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

  function joinVirtualDom(vd) {
    var s = '<defs>';
    vd.defs.forEach(function (item) {
      s += joinDef(item);
    });
    s += '</defs><g>';
    vd.bb.forEach(function (item) {
      s += joinVd(item);
    });
    s += '</g><g>';
    vd.children.forEach(function (item) {
      s += joinVd(item);
    });
    s += '</g>';
    return s;
  }

  function joinVd(vd) {
    if (vd.type === 'item') {
      var s = '';
      vd.props.forEach(function (item) {
        s += " ".concat(item[0], "=\"").concat(item[1], "\"");
      });

      if (vd.tagName === 'text') {
        return "<text".concat(s, ">").concat(vd.content, "</text>");
      }

      return "<".concat(vd.tagName).concat(s, "/>");
    } else if (vd.type === 'text') {
      var _s = "";
      vd.children.forEach(function (item) {
        _s += joinVd(item);
      });
      return "<g>".concat(_s, "</g>");
    } else if (vd.type === 'dom' || vd.type === 'geom') {
      var _s2 = '<g>';
      vd.bb.forEach(function (item) {
        _s2 += joinVd(item);
      });
      _s2 += '</g><g>';
      vd.children.forEach(function (item) {
        _s2 += joinVd(item);
      });
      _s2 += '</g>';
      return "<g transform=\"".concat(joinTransform(vd.transform), "\">").concat(_s2, "</g>");
    }
  }

  function joinTransform(transform) {
    var s = '';
    transform.forEach(function (item) {
      s += "".concat(item[0], "(").concat(item[1], ") ");
    });
    return s;
  }

  function joinDef(def) {
    var s = "<".concat(def.tagName, " id=\"").concat(def.uuid, "\" gradientUnits=\"userSpaceOnUse\"");
    def.props.forEach(function (item) {
      s += " ".concat(item[0], "=\"").concat(item[1], "\"");
    });
    s += '>';
    def.stop.forEach(function (item) {
      s += joinStop(item);
    });
    s += "</".concat(def.tagName, ">");
    return s;
  }

  function joinStop(item) {
    return "<stop stop-color=\"".concat(item[0], "\" offset=\"").concat(item[1] * 100, "%\"/>");
  }

  function r2d(n) {
    return n * Math.PI / 180;
  }

  function rgb2int(color) {
    var res = [];

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
      var c = color.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)/i);

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
    var hash = {};

    for (var i = 0, len = arr.length; i < len; i++) {
      var item = arr[i];

      if (Array.isArray(item)) {
        hash[item[0]] = item[1];
      } else {
        for (var list = Object.keys(item), j = list.length - 1; j >= 0; j--) {
          var k = list[j];
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

    var arr = [];

    for (var list = Object.keys(hash), i = 0, len = list.length; i < len; i++) {
      var k = list[i];
      arr.push([k, hash[k]]);
    }

    return arr;
  }

  function clone(obj) {
    if (isNil(obj) || _typeof(obj) !== 'object') {
      return obj;
    }

    var n = Array.isArray(obj) ? [] : {};

    for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
        n[i] = clone(obj[i]);
      }
    }

    return n;
  }

  var util = {
    isObject: isType('Object'),
    isString: isType('String'),
    isFunction: isType('Function'),
    isNumber: isNumber,
    isBoolean: isType('Boolean'),
    isDate: isType('Date'),
    stringify: stringify,
    joinSourceArray: function joinSourceArray(arr) {
      return _joinSourceArray(arr);
    },
    encodeHtml: encodeHtml,
    isNil: isNil,
    joinVirtualDom: joinVirtualDom,
    joinVd: joinVd,
    joinTransform: joinTransform,
    joinDef: joinDef,
    joinStop: joinStop,
    r2d: r2d,
    rgb2int: rgb2int,
    arr2hash: arr2hash,
    hash2arr: hash2arr,
    clone: clone
  };

  function calMatrix(transform, transformOrigin, x, y, ow, oh) {
    var _getOrigin = getOrigin(transformOrigin, x, y, ow, oh),
        _getOrigin2 = _slicedToArray(_getOrigin, 2),
        ox = _getOrigin2[0],
        oy = _getOrigin2[1];

    var list = normalize(transform, ox, oy, ow, oh);
    var matrix = identity();
    matrix[12] = ox;
    matrix[13] = oy;
    list.forEach(function (item) {
      var _item = _slicedToArray(item, 2),
          k = _item[0],
          v = _item[1];

      var target = identity();

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
        var tan = Math.tan(v);
        target[4] = tan;
      } else if (k === 'skewY') {
        v = util.r2d(v);

        var _tan = Math.tan(v);

        target[1] = _tan;
      } else if (k === 'rotateZ') {
        v = util.r2d(v);
        var sin = Math.sin(v);
        var cos = Math.cos(v);
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
    var target = identity();
    target[12] = -ox;
    target[13] = -oy;
    matrix = multiply(matrix, target);
    return [matrix[0], matrix[1], matrix[4], matrix[5], matrix[12], matrix[13]];
  } // 生成4*4单位矩阵


  function identity() {
    var matrix = [];

    for (var i = 0; i < 16; i++) {
      matrix.push(i % 5 === 0 ? 1 : 0);
    }

    return matrix;
  } // 矩阵a*b


  function multiply(a, b) {
    var res = [];

    for (var i = 0; i < 4; i++) {
      var row = [a[i], a[i + 4], a[i + 8], a[i + 12]];

      for (var j = 0; j < 4; j++) {
        var k = j * 4;
        var col = [b[k], b[k + 1], b[k + 2], b[k + 3]];
        var n = row[0] * col[0] + row[1] * col[1] + row[2] * col[2] + row[3] * col[3];
        res[i + k] = n;
      }
    }

    return res;
  }

  function transformPoint(matrix, x, y) {
    var _matrix = _slicedToArray(matrix, 6),
        a = _matrix[0],
        b = _matrix[1],
        c = _matrix[2],
        d = _matrix[3],
        e = _matrix[4],
        f = _matrix[5];

    return [a * x + c * y + e, b * x + d * y + f];
  } // 向量积


  function vectorProduct(x1, y1, x2, y2) {
    return x1 * y2 - x2 * y1;
  }

  function pointInQuadrilateral(x, y, x1, y1, x2, y2, x3, y3, x4, y4, matrix) {
    if (matrix) {
      var _transformPoint = transformPoint(matrix, x1, y1);

      var _transformPoint2 = _slicedToArray(_transformPoint, 2);

      x1 = _transformPoint2[0];
      y1 = _transformPoint2[1];

      var _transformPoint3 = transformPoint(matrix, x2, y2);

      var _transformPoint4 = _slicedToArray(_transformPoint3, 2);

      x2 = _transformPoint4[0];
      y2 = _transformPoint4[1];

      var _transformPoint5 = transformPoint(matrix, x3, y3);

      var _transformPoint6 = _slicedToArray(_transformPoint5, 2);

      x3 = _transformPoint6[0];
      y3 = _transformPoint6[1];

      var _transformPoint7 = transformPoint(matrix, x4, y4);

      var _transformPoint8 = _slicedToArray(_transformPoint7, 2);

      x4 = _transformPoint8[0];
      y4 = _transformPoint8[1];

      if (vectorProduct(x2 - x1, y2 - y1, x - x1, y - y1) > 0 && vectorProduct(x4 - x2, y4 - y2, x - x2, y - y2) > 0 && vectorProduct(x3 - x4, y3 - y4, x - x4, y - y4) > 0 && vectorProduct(x1 - x3, y1 - y3, x - x3, y - y3) > 0) {
        return true;
      }
    } else {
      return x >= x1 && y >= y1 && x <= x4 && y <= y4;
    }
  }

  function normalize(transform, ox, oy, w, h) {
    var res = [];
    transform.forEach(function (item) {
      var _item2 = _slicedToArray(item, 2),
          k = _item2[0],
          v = _item2[1];

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
    var tfo = [];
    transformOrigin.forEach(function (item, i) {
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
    var m1 = identity();
    m1[0] = a[0];
    m1[1] = a[1];
    m1[4] = a[2];
    m1[5] = a[3];
    m1[12] = a[4];
    m1[13] = a[5];
    var m2 = identity();
    m2[0] = b[0];
    m2[1] = b[1];
    m2[4] = b[2];
    m2[5] = b[3];
    m2[12] = b[4];
    m2[13] = b[5];
    var matrix = multiply(m1, m2);
    return [matrix[0], matrix[1], matrix[4], matrix[5], matrix[12], matrix[13]];
  }

  var tf = {
    calMatrix: calMatrix,
    pointInQuadrilateral: pointInQuadrilateral,
    mergeMatrix: mergeMatrix
  };

  function getLinearDeg(v) {
    var deg = 180;

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
        var match = /(-?[\d.]+)deg/.exec(v[0]);

        if (match) {
          deg = parseFloat(match[1]);
        } else {
          v.unshift(null);
        }
      }

    return deg % 360;
  } // 获取color-stop区间范围，去除无用值


  function getColorStop(v, length) {
    var list = []; // 先把已经声明距离的换算成[0,1]以数组形式存入，未声明的原样存入

    for (var i = 1, _len = v.length; i < _len; i++) {
      var item = v[i]; // 考虑是否声明了位置

      var arr = item.trim().split(/\s+/);

      if (arr.length > 1) {
        var c = arr[0];
        var p = arr[1];

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


    var start = list[0][1];

    for (var _i = 1, _len2 = list.length; _i < _len2 - 1; _i++) {
      var _item = list[_i];

      if (Array.isArray(_item)) {
        start = _item[1];
      } else {
        var j = _i + 1;
        var end = list[list.length - 1][1];

        for (; j < _len2 - 1; j++) {
          var _item2 = list[j];

          if (Array.isArray(_item2)) {
            end = _item2[1];
            break;
          }
        }

        var num = j - _i + 1;
        var per = (end - start) / num;

        for (var k = _i; k < j; k++) {
          var _item3 = list[k];
          list[k] = [_item3, start + per * (k + 1 - _i)];
        }

        _i = j;
      }
    } // 每个不能小于前面的，canvas/svg不能兼容这种情况，需处理


    for (var _i2 = 1, _len3 = list.length; _i2 < _len3; _i2++) {
      var _item4 = list[_i2];
      var prev = list[_i2 - 1];

      if (_item4[1] < prev[1]) {
        _item4[1] = prev[1];
      }
    } // 0之前的和1之后的要过滤掉


    for (var _i3 = 0, _len4 = list.length; _i3 < _len4 - 1; _i3++) {
      var _item5 = list[_i3];

      if (_item5[1] > 1) {
        list.splice(_i3 + 1);
        break;
      }
    }

    for (var _i4 = list.length - 1; _i4 > 0; _i4--) {
      var _item6 = list[_i4];

      if (_item6[1] < 0) {
        list.splice(0, _i4);
        break;
      }
    } // 可能存在超限情况，如在使用px单位超过len或<len时，canvas会报错超过[0,1]区间，需手动换算至区间内


    var len = list.length; // 在只有1个的情况下可简化

    if (len === 1) {
      list[0][1] = 0;
    } else {
      // 全部都在[0,1]之外也可以简化
      var allBefore = true;
      var allAfter = true;

      for (var _i5 = len - 1; _i5 >= 0; _i5--) {
        var _item7 = list[_i5];
        var _p = _item7[1];

        if (_p > 0) {
          allBefore = false;
        }

        if (_p < 1) {
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
          var first = list[0];
          var last = list[len - 1]; // 只要2个的情况下就是首尾都落在外面

          if (len === 2) {
            if (first[1] < 0 && last[1] > 1) {
              getCsLimit(first, last, length);
            }
          } // 只有1个在外面的情况较为容易
          else {
              if (first[1] < 0) {
                var next = list[1];
                var c1 = util.rgb2int(first[0]);
                var c2 = util.rgb2int(next[0]);

                var _c = getCsStartLimit(c1, first[1], c2, next[1], length);

                first[0] = "rgba(".concat(_c[0], ",").concat(_c[1], ",").concat(_c[2], ",").concat(_c[3], ")");
                first[1] = 0;
              }

              if (last[1] > 1) {
                var _prev = list[len - 2];

                var _c2 = util.rgb2int(_prev[0]);

                var _c3 = util.rgb2int(last[0]);

                var _c4 = getCsEndLimit(_c2, _prev[1], _c3, last[1], length);

                last[0] = "rgba(".concat(_c4[0], ",").concat(_c4[1], ",").concat(_c4[2], ",").concat(_c4[3], ")");
                last[1] = 1;
              }
            }
        }
    } // 防止精度计算溢出[0,1]


    list.forEach(function (item) {
      if (item[1] < 0) {
        item[1] = 0;
      } else if (item[1] > 1) {
        item[1] = 1;
      }
    });
    return list;
  } // 根据角度和圆心获取渐变的4个点坐标


  function calLinearCoords(deg, length, cx, cy) {
    var x0;
    var y0;
    var x1;
    var y1;

    if (deg >= 270) {
      var r = util.r2d(360 - deg);
      x0 = cx + Math.sin(r) * length;
      y0 = cy + Math.cos(r) * length;
      x1 = cx - Math.sin(r) * length;
      y1 = cy - Math.cos(r) * length;
    } else if (deg >= 180) {
      var _r = util.r2d(deg - 180);

      x0 = cx + Math.sin(_r) * length;
      y0 = cy - Math.cos(_r) * length;
      x1 = cx - Math.sin(_r) * length;
      y1 = cy + Math.cos(_r) * length;
    } else if (deg >= 90) {
      var _r2 = util.r2d(180 - deg);

      x0 = cx - Math.sin(_r2) * length;
      y0 = cy - Math.cos(_r2) * length;
      x1 = cx + Math.sin(_r2) * length;
      y1 = cy + Math.cos(_r2) * length;
    } else {
      var _r3 = util.r2d(deg);

      x0 = cx - Math.sin(_r3) * length;
      y0 = cy + Math.cos(_r3) * length;
      x1 = cx + Math.sin(_r3) * length;
      y1 = cy - Math.cos(_r3) * length;
    }

    return [x0, y0, x1, y1];
  } // 获取径向渐变半径


  function calRadialRadius(v, iw, ih, cx, cy, x1, y1, x2, y2) {
    var size = 'farthest-corner';
    var r; // 半径

    if (/circle|ellipse|at|closest|farthest/i.test(v[0]) || !/#[0-9a-f]{3,6}/i.test(v[0]) && !/\brgba?\(.*\)/i.test(v[0])) {
      var i = v[0].indexOf('at');
      var at;
      var s;

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


          var by = s[2] || s[1];

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
          var xl;
          var yl;

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
        var _xl;

        var _yl;

        if (cx < x1 + iw * 0.5) {
          _xl = cx - x1;
        } else {
          _xl = x2 - cx;
        }

        if (cy < y1 + ih * 0.5) {
          _yl = cy - y1;
        } else {
          _yl = y2 - cy;
        }

        r = Math.sqrt(Math.pow(_xl, 2) + Math.pow(_yl, 2));
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
          var _xl2 = Math.max(x2 - cx, cx - x1);

          var _yl2 = Math.max(y2 - cy, cy - y1);

          r = Math.max(_xl2, _yl2);
        }
      } // 默认farthest-corner
      else {
          var _xl3;

          var _yl3;

          if (cx < x1 + iw * 0.5) {
            _xl3 = x2 - cx;
          } else {
            _xl3 = cx - x1;
          }

          if (cy < y1 + ih * 0.5) {
            _yl3 = y2 - cy;
          } else {
            _yl3 = cy - y1;
          }

          r = Math.sqrt(Math.pow(_xl3, 2) + Math.pow(_yl3, 2));
        }
    }

    return [r, cx, cy];
  } // 当linear-gradient的值超过[0,1]区间限制时，计算其对应区间1的值


  function getCsStartLimit(c1, p1, c2, p2, length) {
    var _c5 = _slicedToArray(c1, 4),
        r1 = _c5[0],
        g1 = _c5[1],
        b1 = _c5[2],
        _c5$ = _c5[3],
        a1 = _c5$ === void 0 ? 1 : _c5$;

    var _c6 = _slicedToArray(c2, 4),
        r2 = _c6[0],
        g2 = _c6[1],
        b2 = _c6[2],
        _c6$ = _c6[3],
        a2 = _c6$ === void 0 ? 1 : _c6$;

    var l1 = Math.abs(p1) * length;
    var l2 = p2 * length;
    var p = l1 / (l2 + l1);
    var r = Math.floor(r1 + (r2 - r1) * p);
    var g = Math.floor(g1 + (g2 - g1) * p);
    var b = Math.floor(b1 + (b2 - b1) * p);
    var a = a1 + (a2 - a1) * p;
    return [r, g, b, a];
  }

  function getCsEndLimit(c1, p1, c2, p2, length) {
    var _c7 = _slicedToArray(c1, 4),
        r1 = _c7[0],
        g1 = _c7[1],
        b1 = _c7[2],
        _c7$ = _c7[3],
        a1 = _c7$ === void 0 ? 1 : _c7$;

    var _c8 = _slicedToArray(c2, 4),
        r2 = _c8[0],
        g2 = _c8[1],
        b2 = _c8[2],
        _c8$ = _c8[3],
        a2 = _c8$ === void 0 ? 1 : _c8$;

    var l1 = p1 * length;
    var l2 = p2 * length;
    var p = (length - l1) / (l2 - l1);
    var r = Math.floor(r1 + (r2 - r1) * p);
    var g = Math.floor(g1 + (g2 - g1) * p);
    var b = Math.floor(b1 + (b2 - b1) * p);
    var a = a1 + (a2 - a1) * p;
    return [r, g, b, a];
  }

  function getCsLimit(first, last, length) {
    var c1 = util.rgb2int(first[0]);
    var c2 = util.rgb2int(last[0]);

    var _c9 = _slicedToArray(c1, 4),
        r1 = _c9[0],
        g1 = _c9[1],
        b1 = _c9[2],
        _c9$ = _c9[3],
        a1 = _c9$ === void 0 ? 1 : _c9$;

    var _c10 = _slicedToArray(c2, 4),
        r2 = _c10[0],
        g2 = _c10[1],
        b2 = _c10[2],
        _c10$ = _c10[3],
        a2 = _c10$ === void 0 ? 1 : _c10$;

    var l1 = Math.abs(first[1]) * length;
    var l2 = last[1] * length;
    var p = l1 / (l1 + l2);
    var r = Math.floor(r1 + (r2 - r1) * p);
    var g = Math.floor(g1 + (g2 - g1) * p);
    var b = Math.floor(b1 + (b2 - b1) * p);
    var a = a1 + (a2 - a1) * p;
    first[0] = "rgba(".concat(r, ",").concat(g, ",").concat(b, ",").concat(a, ")");
    first[1] = 0;
    p = (length + l1) / (l1 + l2);
    r = Math.floor(r1 + (r2 - r1) * p);
    g = Math.floor(g1 + (g2 - g1) * p);
    b = Math.floor(b1 + (b2 - b1) * p);
    a = a1 + (a2 - a1) * p;
    last[0] = "rgba(".concat(r, ",").concat(g, ",").concat(b, ",").concat(a, ")");
    last[1] = 1;
  }

  function parseGradient(s) {
    var gradient = /\b(\w+)-gradient\((.+)\)/.exec(s);

    if (gradient) {
      var deg = /(-?[\d.]+deg)|(to\s+[toprighbml]+)|circle|ellipse|at|closest|farthest|((closest|farthest)-(side|corner))/.exec(gradient[2]);
      var v = gradient[2].match(/((#[0-9a-f]{3,6})|(rgba?\(.+?\)))(\s+-?[\d.]+(px|%))?/ig);

      if (deg) {
        var i = gradient[2].indexOf(',');
        v.unshift(gradient[2].slice(0, i));
      }

      return {
        k: gradient[1],
        v: v
      };
    }
  }

  function getLinear(v, cx, cy, w, h) {
    var deg = getLinearDeg(v);
    var theta = util.r2d(deg);
    var length = Math.abs(w * Math.sin(theta)) + Math.abs(h * Math.cos(theta));

    var _calLinearCoords = calLinearCoords(deg, length * 0.5, cx, cy),
        _calLinearCoords2 = _slicedToArray(_calLinearCoords, 4),
        x1 = _calLinearCoords2[0],
        y1 = _calLinearCoords2[1],
        x2 = _calLinearCoords2[2],
        y2 = _calLinearCoords2[3];

    var stop = getColorStop(v, length);
    return {
      x1: x1,
      y1: y1,
      x2: x2,
      y2: y2,
      stop: stop
    };
  }

  function getRadial(v, cx, cy, x1, y1, x2, y2) {
    var w = x2 - x1;
    var h = y2 - y1;

    var _calRadialRadius = calRadialRadius(v, w, h, cx, cy, x1, y1, x2, y2),
        _calRadialRadius2 = _slicedToArray(_calRadialRadius, 3),
        r = _calRadialRadius2[0],
        cx2 = _calRadialRadius2[1],
        cy2 = _calRadialRadius2[2];

    var stop = getColorStop(v, r * 2); // 超限情况等同于只显示end的bgc

    if (r <= 0) {
      var end = stop[stop.length - 1];
      end[1] = 0;
      stop = [end];
      cx2 = x1;
      cy2 = y1; // 肯定大于最长直径

      r = w + h;
    }

    return {
      cx: cx2,
      cy: cy2,
      r: r,
      stop: stop
    };
  }

  var gradient = {
    parseGradient: parseGradient,
    getLinear: getLinear,
    getRadial: getRadial
  };

  /* 获取合适的虚线实体空白宽度ps/pd和数量n
   * 总长total，start边长bs，end边长be，内容长w，
   * 实体长范围[smin,smax]，空白长范围[dmin,dmax]
   */
  function calFitDashed(total, bs, be, w, smin, smax, dmin, dmax) {
    var n = 1;
    var ps = 1;
    var pd = 1; // 从最大实体空白长开始尝试

    outer: for (var i = smax; i >= smin; i--) {
      for (var j = dmax; j >= dmin; j--) {
        // 已知实体空白长度，n实体和n-1空白组成total，计算获取n数量
        var per = i + j;
        var num = Math.floor((total + j) / per);
        var k = j; // 可能除不尽，此时扩展空白长

        if (num * per < j + total) {
          var free = total - num * i;
          k = free / (num - 1);

          if (k > dmax) {
            continue;
          }
        }

        per = i + k; // bs比实体大才有效，因为小的话必定和第一个实体完整相连

        if (bs > 1 && bs > i) {
          var mo = bs % per;

          if (mo > i) {
            continue;
          }

          if (be > 1) {
            var _mo = (bs + w) % per;

            if (_mo > i) {
              continue;
            }
          }
        }

        if (be > 1) {
          var _mo2 = (bs + w) % per;

          if (_mo2 > i) {
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
      n: n,
      ps: ps,
      pd: pd
    };
  } // dashed时n个实线和n-1虚线默认以3:1宽度组成，dotted则是n和n以1:1组成


  function calDashed(style, m1, m2, m3, m4, bw) {
    var total = m4 - m1;
    var w = m3 - m2;
    var bs = m2 - m1;
    var be = m4 - m3;

    if (style === 'dotted') {
      return calFitDashed(total, bs, be, w, bw, bw, Math.max(1, bw * 0.25), bw * 2);
    } else {
      var _calFitDashed = calFitDashed(total, bs, be, w, bw, bw * 3, Math.max(1, bw * 0.25), bw * 2),
          n = _calFitDashed.n,
          ps = _calFitDashed.ps,
          pd = _calFitDashed.pd;

      if (n === 1) {
        return calFitDashed(total, bs, be, w, bw, bw, Math.max(1, bw * 0.25), bw * 2);
      } // 降级为dotted


      return {
        n: n,
        ps: ps,
        pd: pd
      };
    }
  } // 获取边框分割为几块的坐标，虚线分割为若干四边形和三边型
  // direction为上右下左0123


  function calPoints(borderWidth, borderStyle, deg1, deg2, x1, x2, x3, x4, y1, y2, y3, y4, direction) {
    var points = [];

    if (['dashed', 'dotted'].indexOf(borderStyle) > -1) {
      // 寻找一个合适的虚线线段长度和之间空白边距长度
      var _ref = direction === 0 || direction === 2 ? calDashed(borderStyle, x1, x2, x3, x4, borderWidth) : calDashed(borderStyle, y1, y2, y3, y4, borderWidth),
          n = _ref.n,
          ps = _ref.ps,
          pd = _ref.pd;

      if (n > 1) {
        for (var i = 0; i < n; i++) {
          // 最后一个可能没有到底，延长之
          var isLast = i === n - 1;
          var main1 = void 0;
          var main2 = void 0;
          var cross1 = void 0;
          var cross2 = void 0;

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
    calDashed: calDashed,
    calPoints: calPoints
  };

  var Event =
  /*#__PURE__*/
  function () {
    function Event() {
      _classCallCheck(this, Event);

      this.__eHash = {};
    }

    _createClass(Event, [{
      key: "on",
      value: function on(id, handle) {
        var self = this;

        if (Array.isArray(id)) {
          for (var i = 0, len = id.length; i < len; i++) {
            self.on(id[i], handle);
          }
        } else if (handle) {
          if (!self.__eHash.hasOwnProperty(id)) {
            self.__eHash[id] = [];
          } // 遍历防止此handle被侦听过了


          for (var _i = 0, item = self.__eHash[id], _len = item.length; _i < _len; _i++) {
            if (item[_i] === handle) {
              return self;
            }
          }

          self.__eHash[id].push(handle);
        }

        return self;
      }
    }, {
      key: "once",
      value: function once(id, handle) {
        var self = this;

        function cb() {
          for (var _len2 = arguments.length, data = new Array(_len2), _key = 0; _key < _len2; _key++) {
            data[_key] = arguments[_key];
          }

          handle.apply(self, data);
          self.off(id, cb);
        }

        if (Array.isArray(id)) {
          for (var i = 0, len = id.length; i < len; i++) {
            self.once(id[i], handle);
          }
        } else if (handle) {
          self.on(id, cb);
        }

        return this;
      }
    }, {
      key: "off",
      value: function off(id, handle) {
        var self = this;

        if (Array.isArray(id)) {
          for (var i = 0, len = id.length; i < len; i++) {
            self.off(id[i], handle);
          }
        } else if (self.__eHash.hasOwnProperty(id)) {
          if (handle) {
            for (var _i2 = 0, item = self.__eHash[id], _len3 = item.length; _i2 < _len3; _i2++) {
              if (item[_i2] === handle) {
                item.splice(_i2, 1);
                break;
              }
            }
          } // 未定义为全部清除
          else {
              delete self.__eHash[id];
            }
        }

        return this;
      }
    }, {
      key: "emit",
      value: function emit(id) {
        var self = this;

        for (var _len4 = arguments.length, data = new Array(_len4 > 1 ? _len4 - 1 : 0), _key2 = 1; _key2 < _len4; _key2++) {
          data[_key2 - 1] = arguments[_key2];
        }

        if (Array.isArray(id)) {
          for (var i = 0, len = id.length; i < len; i++) {
            self.emit(id[i], data);
          }
        } else {
          if (self.__eHash.hasOwnProperty(id)) {
            var list = self.__eHash[id];

            if (list.length) {
              list = list.slice();

              for (var _i3 = 0, _len5 = list.length; _i3 < _len5; _i3++) {
                list[_i3].apply(self, data);
              }
            }
          }
        }

        return this;
      }
    }], [{
      key: "mix",
      value: function mix() {
        for (var i = arguments.length - 1; i >= 0; i--) {
          var o = i < 0 || arguments.length <= i ? undefined : arguments[i];
          var event = new Event();
          o.__eHash = {};
          var fns = ['on', 'once', 'off', 'emit'];

          for (var j = fns.length - 1; j >= 0; j--) {
            var fn = fns[j];
            o[fn] = event[fn];
          }
        }
      }
    }]);

    return Event;
  }();

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

  var RESET = {
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
  var reset = [];
  Object.keys(RESET).forEach(function (k) {
    var v = RESET[k];
    reset.push({
      k: k,
      v: v
    });
  });

  function parserOneBorder(style, direction) {
    var key = "border".concat(direction);

    if (!style[key]) {
      return;
    }

    var w = /\b[\d.]+px\b/i.exec(style[key]);

    if (w) {
      style[key + 'Width'] = w[0];
    }

    var s = /\b(solid|dashed|dotted)\b/i.exec(style[key]);

    if (s) {
      style[key + 'Style'] = s[1];
    }

    var c = /#[0-9a-f]{3,6}/i.exec(style[key]);

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
    reset.forEach(function (item) {
      if (!style.hasOwnProperty(item.k)) {
        style[item.k] = item.v;
      }
    });
    var temp = style.background; // 处理渐变背景色

    if (temp) {
      // 优先gradient，没有再考虑颜色
      var gd = gradient.parseGradient(temp);

      if (gd) {
        style.backgroundGradient = gd;
      } else {
        var bgc = /#[0-9a-f]{3,6}/i.exec(temp);

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
      var match = temp.toString().match(/(-?[\d.]+(px|%)?)|(auto)/ig);

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
      var _match = temp.toString().match(/(-?[\d.]+(px|%)?)|(auto)/ig);

      if (_match) {
        if (_match.length === 1) {
          _match[3] = _match[2] = _match[1] = _match[0];
        } else if (_match.length === 2) {
          _match[2] = _match[0];
          _match[3] = _match[1];
        } else if (_match.length === 3) {
          _match[3] = _match[1];
        }

        style.paddingTop = _match[0];
        style.paddingRight = _match[1];
        style.paddingBottom = _match[2];
        style.paddingLeft = _match[3];
      }
    }

    temp = style.transform;

    if (temp) {
      var _match2 = temp.toString().match(/\w+\(.+?\)/g);

      if (_match2) {
        var transform = style.transform = [];

        _match2.forEach(function (item) {
          var i = item.indexOf('(');
          var k = item.slice(0, i);
          var v = item.slice(i + 1, item.length - 1);

          if (k === 'matrix') {
            var arr = v.split(/\s*,\s*/);
            arr = arr.map(function (item) {
              return parseFloat(item);
            });

            if (arr.length > 6) {
              arr = arr.slice(0, 6);
            }

            if (arr.length === 6) {
              transform.push(['matrix', arr]);
            }
          } else if (k === 'translateX') {
            var _arr = ['translateX', v];
            transform.push(calUnit(_arr, 1, v));
          } else if (k === 'translateY') {
            var _arr2 = ['translateY', v];
            transform.push(calUnit(_arr2, 1, v));
          } else if (k === 'translate') {
            var _arr3 = v.split(/\s*,\s*/);

            var arr1 = ['translateX', _arr3[0]];
            var arr2 = ['translateY', _arr3[1] || _arr3[0]];
            transform.push(calUnit(arr1, 1, _arr3[0]));
            transform.push(calUnit(arr2, 1, _arr3[1] || _arr3[0]));
          } else if (k === 'scaleX') {
            transform.push(['scaleX', parseFloat(v) || 0]);
          } else if (k === 'scaleY') {
            transform.push(['scaleY', parseFloat(v) || 0]);
          } else if (k === 'scale') {
            var _arr4 = v.split(/\s*,\s*/);

            var x = parseFloat(_arr4[0]) || 0;
            var y = parseFloat(_arr4[_arr4.length - 1]) || 0;
            transform.push(['scaleX', x]);
            transform.push(['scaleY', y]);
          } else if (k === 'rotateZ' || k === 'rotate') {
            transform.push(['rotateZ', parseFloat(v) || 0]);
          } else if (k === 'skewX') {
            transform.push(['skewX', parseFloat(v) || 0]);
          } else if (k === 'skewY') {
            transform.push(['skewY', parseFloat(v) || 0]);
          } else if (k === 'skew') {
            var _arr5 = v.split(/\s*,\s*/);

            var _x = parseFloat(_arr5[0]) || 0;

            var _y = parseFloat(_arr5[_arr5.length - 1]) || 0;

            transform.push(['skewX', _x]);
            transform.push(['skewY', _y]);
          }
        });
      }
    }

    temp = style.transformOrigin;

    if (temp) {
      var _match3 = temp.toString().match(/(-?[\d.]+(px|%)?)|(left|top|right|bottom|center)/ig);

      if (_match3) {
        if (_match3.length === 1) {
          _match3[1] = _match3[0];
        }

        var tfo = [];

        for (var i = 0; i < 2; i++) {
          var item = _match3[i];

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

    ['marginTop', 'marginRight', 'marginBottom', 'marginLeft', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomLeftRadius', 'borderBottomRightRadius', 'top', 'right', 'bottom', 'left', 'width', 'height', 'flexBasis'].forEach(function (k) {
      var v = style[k];
      calUnit(style, k, v);
    }); // 计算lineHeight为px值，最小范围

    var lineHeight = style.lineHeight;

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
    var fontStyle = style.fontStyle,
        fontWeight = style.fontWeight,
        fontSize = style.fontSize,
        fontFamily = style.fontFamily;
    fontFamily = 'arial';
    return "".concat(fontStyle, " ").concat(fontWeight, " ").concat(fontSize, "px/").concat(fontSize, "px ").concat(fontFamily);
  }

  function getBaseLine(style) {
    var normal = style.fontSize * font.arial.lhr;
    return (style.lineHeight.value - normal) * 0.5 + style.fontSize * font.arial.blr;
  }

  var css = {
    normalize: normalize$1,
    setFontStyle: setFontStyle,
    getBaseLine: getBaseLine
  };

  var LineBox =
  /*#__PURE__*/
  function () {
    function LineBox(parent, x, y, w, content, style) {
      _classCallCheck(this, LineBox);

      this.__parent = parent;
      this.__x = x;
      this.__y = y;
      this.__width = w;
      this.__content = content;
      this.__style = style;
      this.__virtualDom = {};
    }

    _createClass(LineBox, [{
      key: "render",
      value: function render(renderMode, ctx) {
        var style = this.style,
            content = this.content,
            x = this.x,
            y = this.y,
            _this$parent = this.parent,
            ox = _this$parent.ox,
            oy = _this$parent.oy;
        y += css.getBaseLine(style);
        x += ox;
        y += oy;

        if (renderMode === mode.CANVAS) {
          ctx.fillText(content, x, y);
        } else if (renderMode === mode.SVG) {
          this.__virtualDom = {
            type: 'item',
            tagName: 'text',
            props: [['x', x], ['y', y], ['fill', style.color], ['font-family', style.fontFamily], ['font-size', "".concat(style.fontSize, "px")]],
            content: util.encodeHtml(content)
          };
        }
      }
    }, {
      key: "__offsetX",
      value: function __offsetX(diff) {
        this.__x += diff;
      }
    }, {
      key: "__offsetY",
      value: function __offsetY(diff) {
        this.__y += diff;
      }
    }, {
      key: "x",
      get: function get() {
        return this.__x;
      }
    }, {
      key: "y",
      get: function get() {
        return this.__y;
      }
    }, {
      key: "width",
      get: function get() {
        return this.__width;
      }
    }, {
      key: "content",
      get: function get() {
        return this.__content;
      }
    }, {
      key: "style",
      get: function get() {
        return this.__style;
      }
    }, {
      key: "baseLine",
      get: function get() {
        return css.getBaseLine(this.style);
      }
    }, {
      key: "virtualDom",
      get: function get() {
        return this.__virtualDom;
      }
    }, {
      key: "parent",
      get: function get() {
        return this.__parent;
      }
    }]);

    return LineBox;
  }();

  var CHAR_WIDTH_CACHE = {};

  var Text =
  /*#__PURE__*/
  function (_Node) {
    _inherits(Text, _Node);

    function Text(content) {
      var _this;

      _classCallCheck(this, Text);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Text).call(this));
      _this.__content = content.toString();
      _this.__lineBoxes = [];
      _this.__charWidthList = [];
      _this.__charWidth = 0;
      _this.__textWidth = 0;
      return _this;
    } // 预先计算每个字的宽度


    _createClass(Text, [{
      key: "__measure",
      value: function __measure() {
        this.__charWidthList = [];
        var ctx = this.ctx,
            content = this.content,
            style = this.style,
            charWidthList = this.charWidthList,
            renderMode = this.renderMode;

        if (renderMode === mode.CANVAS) {
          ctx.font = css.setFontStyle(style);
        }

        var cache = CHAR_WIDTH_CACHE[style.fontSize] = CHAR_WIDTH_CACHE[style.fontSize] || {};
        var length = content.length;
        var sum = 0;

        for (var i = 0; i < length; i++) {
          var _char = content.charAt(i);

          var mw = void 0;

          if (cache.hasOwnProperty(_char)) {
            mw = cache[_char];
          } else if (renderMode === mode.CANVAS) {
            mw = cache[_char] = ctx.measureText(_char).width;
          } else if (renderMode === mode.SVG) {
            mw = cache[_char] = mode.measure(_char, style);
          }

          charWidthList.push(mw);
          sum += mw;
          this.__charWidth = Math.max(this.charWidth, mw);
        }

        this.__textWidth = sum;
      }
    }, {
      key: "__layout",
      value: function __layout(data, isVirtual) {
        var _this2 = this;

        var x = data.x,
            y = data.y,
            w = data.w,
            h = data.h;
        this.__x = x;
        this.__y = y;
        var maxX = x;
        var content = this.content,
            style = this.style,
            lineBoxes = this.lineBoxes,
            charWidthList = this.charWidthList; // 顺序尝试分割字符串为lineBox，形成多行

        var begin = 0;
        var i = 0;
        var count = 0;
        var length = content.length;

        while (i < length) {
          count += charWidthList[i];

          if (count === w) {
            var lineBox = new LineBox(this, x, y, count, content.slice(begin, i + 1), style);
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

            var _lineBox = new LineBox(this, x, y, count - charWidthList[i], content.slice(begin, i), style);

            lineBoxes.push(_lineBox);
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

          var _lineBox2 = new LineBox(this, x, y, count, content.slice(begin, length), style);

          lineBoxes.push(_lineBox2);
          maxX = Math.max(maxX, x + count);
          y += style.lineHeight.value;
        }

        this.__width = maxX - x;
        this.__height = y - data.y;

        if (isVirtual) {
          this.__lineBoxes = [];
        } else {
          var textAlign = style.textAlign;

          if (['center', 'right'].indexOf(textAlign) > -1) {
            lineBoxes.forEach(function (lineBox) {
              var diff = _this2.__width - lineBox.width;

              if (diff > 0) {
                lineBox.__offsetX(textAlign === 'center' ? diff * 0.5 : diff);
              }
            });
          }
        }
      }
    }, {
      key: "render",
      value: function render(renderMode) {
        var ctx = this.ctx,
            style = this.style;

        if (renderMode === mode.CANVAS) {
          ctx.font = css.setFontStyle(style);
          ctx.fillStyle = style.color;
        }

        this.lineBoxes.forEach(function (item) {
          item.render(renderMode, ctx);
        });

        if (renderMode === mode.SVG) {
          this.__virtualDom = {
            type: 'text',
            children: this.lineBoxes.map(function (lineBox) {
              return lineBox.virtualDom;
            })
          };
        }
      }
    }, {
      key: "__tryLayInline",
      value: function __tryLayInline(w) {
        return w - this.textWidth;
      }
    }, {
      key: "__calMaxAndMinWidth",
      value: function __calMaxAndMinWidth() {
        var n = 0;
        this.charWidthList.forEach(function (item) {
          n = Math.max(n, item);
        });
        return {
          max: this.textWidth,
          min: n
        };
      }
    }, {
      key: "content",
      get: function get() {
        return this.__content;
      },
      set: function set(v) {
        this.__content = v;
      }
    }, {
      key: "lineBoxes",
      get: function get() {
        return this.__lineBoxes;
      }
    }, {
      key: "charWidthList",
      get: function get() {
        return this.__charWidthList;
      }
    }, {
      key: "charWidth",
      get: function get() {
        return this.__charWidth;
      }
    }, {
      key: "textWidth",
      get: function get() {
        return this.__textWidth;
      }
    }, {
      key: "baseLine",
      get: function get() {
        var last = this.lineBoxes[this.lineBoxes.length - 1];
        return last.y - this.y + last.baseLine;
      }
    }, {
      key: "renderMode",
      get: function get() {
        return this.__renderMode;
      }
    }]);

    return Text;
  }(Node);

  var Component =
  /*#__PURE__*/
  function (_Event) {
    _inherits(Component, _Event);

    function Component(tagName, props, children) {
      var _this;

      _classCallCheck(this, Component);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Component).call(this));

      if (!util.isString(tagName)) {
        throw new Error('Component must have a tagName');
      }

      _this.__tagName = tagName;
      props = props || []; // 构建工具中都是arr，手写可能出现hash情况

      if (Array.isArray(props)) {
        _this.props = util.arr2hash(props);
        _this.__props = props;
      } else {
        _this.props = props;
        _this.__props = util.hash2arr(props);
      }

      _this.__children = children || [];
      _this.__shadowRoot = null;
      _this.__parent = null;
      _this.state = {};
      return _this;
    }

    _createClass(Component, [{
      key: "setState",
      value: function setState(n, cb) {
        if (util.isNil(n)) {
          this.state = {};
        } else {
          for (var i in n) {
            if (n.hasOwnProperty(i)) {
              this.state[i] = n[i];
            }
          }
        }

        var o = this.shadowRoot;

        this.__traverse(o.ctx, o.defs, this.root.renderMode);

        this.__init(true);

        this.root.refresh();
        cb && cb();
      }
    }, {
      key: "__traverse",
      value: function __traverse(ctx, defs, renderMode) {
        var sr = this.__shadowRoot = this.render(renderMode); // 可能返回的还是一个Component，递归处理

        while (sr instanceof Component) {
          sr = this.__shadowRoot = sr.render(renderMode);
        } // node情况不可能是text，因为text节点只出现在dom内，直接返回的text是string


        if (!(sr instanceof Node)) {
          var s = '';

          if (!util.isNil(sr)) {
            s = util.encodeHtml(sr.toString());
          }

          sr = new Text(s);
          sr.__ctx = ctx;
          sr.__defs = defs;
          sr.__renderMode = renderMode;

          sr.__measure();

          this.__shadowRoot = sr;
          return;
        }

        sr.__ctx = ctx;
        sr.__defs = defs;

        sr.__traverse(ctx, defs, renderMode);
      } // 组件传入的样式需覆盖shadowRoot的

    }, {
      key: "__init",
      value: function __init(isSetState) {
        var _this2 = this;

        var sr = this.shadowRoot; // 返回text节点特殊处理，赋予基本样式

        if (sr instanceof Text) {
          css.normalize(sr.style);
        } else {
          sr.__init();
        }

        var style = this.props.style || {};

        for (var i in style) {
          if (style.hasOwnProperty(i)) {
            sr.style[i] = style[i];
          }
        }

        if (!(sr instanceof Text)) {
          this.__props.forEach(function (item) {
            var k = item[0];
            var v = item[1];

            if (/^on[a-zA-Z]/.test(k)) {
              k = k.slice(2).toLowerCase();
              var arr = sr.listener[k] = sr.listener[k] || [];
              arr.push(v);
            } else if (/^on-[a-zA-Z\d_$]/.test(k)) {
              k = k.slice(3);

              _this2.on(k, function () {
                v.apply(void 0, arguments);
              });
            }
          });
        } // 防止重复


        if (isSetState) {
          return;
        }

        ['x', 'y', 'ox', 'oy', 'rx', 'ry', 'width', 'height', 'outerWidth', 'outerHeight', 'style', 'ctx', 'defs', 'baseLine', 'virtualDom'].forEach(function (fn) {
          Object.defineProperty(_this2, fn, {
            get: function get() {
              return this.shadowRoot[fn];
            }
          });
        });
      }
    }, {
      key: "render",
      value: function render() {}
    }, {
      key: "__emitEvent",
      value: function __emitEvent(e, force) {
        var sr = this.shadowRoot;

        if (sr instanceof Text) {
          return;
        }

        if (force) {
          return sr.__emitEvent(e, force);
        }

        var res = sr.__emitEvent(e);

        if (res) {
          e.target = this;
          return true;
        }
      }
    }, {
      key: "tagName",
      get: function get() {
        return this.__tagName;
      }
    }, {
      key: "children",
      get: function get() {
        return this.__children;
      }
    }, {
      key: "shadowRoot",
      get: function get() {
        return this.__shadowRoot;
      }
    }, {
      key: "root",
      get: function get() {
        return this.parent.root;
      }
    }, {
      key: "parent",
      get: function get() {
        return this.__parent;
      }
    }]);

    return Component;
  }(Event);

  ['__layout', '__layoutAbs', '__tryLayInline', '__offsetX', '__offsetY', '__calAutoBasis', '__calMp', '__calAbs'].forEach(function (fn) {
    Component.prototype[fn] = function () {
      var sr = this.shadowRoot;

      if (sr[fn]) {
        sr[fn].apply(sr, arguments);
      }
    };
  });

  function renderBorder(renderMode, points, color, ctx, xom) {
    if (renderMode === mode.CANVAS) {
      points.forEach(function (point) {
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.moveTo(point[0], point[1]);

        for (var i = 2, len = point.length; i < len; i += 2) {
          ctx.lineTo(point[i], point[i + 1]);
        }

        ctx.fill();
        ctx.closePath();
      });
    } else if (renderMode === mode.SVG) {
      var s = '';
      points.forEach(function (point) {
        s += "M ".concat(point[0], " ").concat(point[1]);

        for (var i = 2, len = point.length; i < len; i += 2) {
          s += "L ".concat(point[i], " ").concat(point[i + 1], " ");
        }
      });
      xom.addBorder([['d', s], ['fill', color]]);
    }
  }

  var Xom =
  /*#__PURE__*/
  function (_Node) {
    _inherits(Xom, _Node);

    function Xom(tagName, props) {
      var _this;

      _classCallCheck(this, Xom);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Xom).call(this));
      props = props || []; // 构建工具中都是arr，手写可能出现hash情况

      if (Array.isArray(props)) {
        _this.props = util.arr2hash(props);
        _this.__props = props;
      } else {
        _this.props = props;
        _this.__props = util.hash2arr(props);
      }

      _this.__tagName = tagName;
      _this.__style = _this.props.style || {}; // style被解析后的k-v形式

      _this.__listener = {};

      _this.__props.forEach(function (item) {
        var k = item[0];

        if (/^on[a-zA-Z]/.test(k)) {
          k = k.slice(2).toLowerCase();
          var arr = _this.__listener[k] = _this.__listener[k] || [];
          arr.push(item[1]);
        }
      }); // margin和padding的宽度


      _this.__mtw = 0;
      _this.__mrw = 0;
      _this.__mbw = 0;
      _this.__mlw = 0;
      _this.__ptw = 0;
      _this.__prw = 0;
      _this.__pbw = 0;
      _this.__plw = 0;
      _this.__matrix = null;
      _this.__matrixEvent = null;
      return _this;
    }

    _createClass(Xom, [{
      key: "__layout",
      value: function __layout(data) {
        var w = data.w;
        var _this$style = this.style,
            display = _this$style.display,
            width = _this$style.width,
            marginTop = _this$style.marginTop,
            marginRight = _this$style.marginRight,
            marginBottom = _this$style.marginBottom,
            marginLeft = _this$style.marginLeft,
            paddingTop = _this$style.paddingTop,
            paddingRight = _this$style.paddingRight,
            paddingBottom = _this$style.paddingBottom,
            paddingLeft = _this$style.paddingLeft;

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
    }, {
      key: "isGeom",
      value: function isGeom() {
        return this.tagName.charAt(0) === '$';
      } // 获取margin/padding的实际值

    }, {
      key: "__mpWidth",
      value: function __mpWidth(mp, w) {
        if (mp.unit === unit.PX) {
          return mp.value;
        } else if (mp.unit === unit.PERCENT) {
          return mp.value * w * 0.01;
        }

        return 0;
      }
    }, {
      key: "__preLayout",
      value: function __preLayout(data) {
        var x = data.x,
            y = data.y,
            w = data.w,
            h = data.h;
        this.__x = x;
        this.__y = y;
        var style = this.style,
            mlw = this.mlw,
            mtw = this.mtw,
            mrw = this.mrw,
            mbw = this.mbw,
            plw = this.plw,
            ptw = this.ptw,
            prw = this.prw,
            pbw = this.pbw;
        var width = style.width,
            height = style.height,
            borderTopWidth = style.borderTopWidth,
            borderRightWidth = style.borderRightWidth,
            borderBottomWidth = style.borderBottomWidth,
            borderLeftWidth = style.borderLeftWidth; // 除了auto外都是固定宽高度

        var fixedWidth;
        var fixedHeight;

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
          fixedWidth: fixedWidth,
          fixedHeight: fixedHeight,
          x: x,
          y: y,
          w: w,
          h: h
        };
      }
    }, {
      key: "render",
      value: function render(renderMode) {
        this.__renderMode = renderMode;

        if (renderMode === mode.SVG) {
          this.__virtualDom = {
            bb: [],
            children: [],
            transform: []
          };
        }

        var ctx = this.ctx,
            style = this.style,
            width = this.width,
            height = this.height,
            mlw = this.mlw,
            mrw = this.mrw,
            mtw = this.mtw,
            mbw = this.mbw,
            plw = this.plw,
            ptw = this.ptw,
            prw = this.prw,
            pbw = this.pbw; // 恢复默认，防止其它matrix影响

        if (renderMode === mode.CANVAS) {
          ctx.setTransform(1, 0, 0, 1, 0, 0);
        }

        var display = style.display,
            position = style.position,
            top = style.top,
            right = style.right,
            bottom = style.bottom,
            left = style.left,
            bgg = style.backgroundGradient,
            bgc = style.backgroundColor,
            borderTopWidth = style.borderTopWidth,
            btc = style.borderTopColor,
            bts = style.borderTopStyle,
            borderRightWidth = style.borderRightWidth,
            brc = style.borderRightColor,
            brs = style.borderRightStyle,
            borderBottomWidth = style.borderBottomWidth,
            bbc = style.borderBottomColor,
            bbs = style.borderBottomStyle,
            borderLeftWidth = style.borderLeftWidth,
            blc = style.borderLeftColor,
            bls = style.borderLeftStyle,
            transform = style.transform,
            transformOrigin = style.transformOrigin;

        if (display === 'none') {
          return;
        } // 除root节点外relative渲染时做偏移，百分比基于父元素，若父元素没有一定高则为0


        if (position === 'relative' && this.parent) {
          var _this$parent = this.parent,
              _width = _this$parent.width,
              _height = _this$parent.height;
          var h = this.parent.style.height;

          if (left.unit !== unit.AUTO) {
            var diff = left.unit === unit.PX ? left.value : left.value * _width * 0.01;

            this.__offsetX(diff);
          } else if (right.unit !== unit.AUTO) {
            var _diff = right.unit === unit.PX ? right.value : right.value * _width * 0.01;

            this.__offsetX(-_diff);
          }

          if (top.unit !== unit.AUTO) {
            var _diff2 = top.unit === unit.PX ? top.value : top.value * _height * 0.01 * (h.unit === unit.AUTO ? 0 : 1);

            this.__offsetY(_diff2);
          } else if (bottom.unit !== unit.AUTO) {
            var _diff3 = bottom.unit === unit.PX ? bottom.value : bottom.value * _height * 0.01 * (h.unit === unit.AUTO ? 0 : 1);

            this.__offsetY(-_diff3);
          }
        } // 使用rx和ry渲染位置，考虑了relative和translate影响


        var x = this.rx,
            y = this.ry;
        var btw = borderTopWidth.value;
        var brw = borderRightWidth.value;
        var bbw = borderBottomWidth.value;
        var blw = borderLeftWidth.value;
        var x1 = x + mlw;
        var x2 = x1 + blw;
        var x3 = x2 + width + plw + prw;
        var x4 = x3 + brw;
        var y1 = y + mtw;
        var y2 = y1 + btw;
        var y3 = y2 + height + ptw + pbw;
        var y4 = y3 + bbw;
        var iw = width + plw + prw;
        var ih = height + ptw + pbw; // translate相对于自身

        if (transform) {
          var _x = x + mlw + blw + iw + brw + mrw;

          var _y = y + mtw + btw + ih + bbw + mbw;

          var ow = _x - x;
          var oh = _y - y;
          var matrix = tf.calMatrix(transform, transformOrigin, x, y, ow, oh);
          this.__matrix = matrix;
          var parent = this.parent;

          while (parent) {
            if (parent.matrix) {
              matrix = tf.mergeMatrix(parent.matrix, matrix);
            }

            parent = parent.parent;
          }

          this.__matrixEvent = matrix;

          if (renderMode === mode.CANVAS) {
            ctx.setTransform.apply(ctx, _toConsumableArray(matrix));
          } else if (renderMode === mode.SVG) {
            this.addTransform(['matrix', this.matrix.join(',')]);
          }
        } // 先渲染渐变，没有则背景色


        if (bgg) {
          var k = bgg.k,
              v = bgg.v;
          var cx = x2 + iw * 0.5;
          var cy = y2 + ih * 0.5; // 需计算角度 https://www.w3cplus.com/css3/do-you-really-understand-css-linear-gradients.html

          if (k === 'linear') {
            var gd = gradient.getLinear(v, cx, cy, iw, ih);

            if (renderMode === mode.CANVAS) {
              ctx.beginPath();
              ctx.fillStyle = this.__getBgLg(renderMode, gd);
              ctx.rect(x2, y2, iw, ih);
              ctx.fill();
              ctx.closePath();
            } else if (renderMode === mode.SVG) {
              var fill = this.__getBgLg(renderMode, gd);

              this.addBackground([['x', x2], ['y', y2], ['width', iw], ['height', ih], ['fill', fill]]);
            }
          } else if (k === 'radial') {
            var _gd = gradient.getRadial(v, cx, cy, x2, y2, x3, y3);

            if (renderMode === mode.CANVAS) {
              ctx.beginPath();
              ctx.fillStyle = this.__getBgRg(renderMode, _gd);
              ctx.rect(x2, y2, iw, ih);
              ctx.fill();
              ctx.closePath();
            } else if (renderMode === mode.SVG) {
              var _fill = this.__getBgRg(renderMode, _gd);

              this.addBackground([['x', x2], ['y', y2], ['width', iw], ['height', ih], ['fill', _fill]]);
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
          var deg1 = Math.atan(btw / blw);
          var deg2 = Math.atan(btw / brw);
          var points = border.calPoints(btw, bts, deg1, deg2, x1, x2, x3, x4, y1, y2, y3, y4, 0);
          renderBorder(renderMode, points, btc, ctx, this);
        }

        if (brw > 0 && brc !== 'transparent') {
          var _deg = Math.atan(brw / btw);

          var _deg2 = Math.atan(brw / bbw);

          var _points = border.calPoints(brw, brs, _deg, _deg2, x1, x2, x3, x4, y1, y2, y3, y4, 1);

          renderBorder(renderMode, _points, brc, ctx, this);
        }

        if (bbw > 0 && bbc !== 'transparent') {
          var _deg3 = Math.atan(bbw / blw);

          var _deg4 = Math.atan(bbw / brw);

          var _points2 = border.calPoints(bbw, bbs, _deg3, _deg4, x1, x2, x3, x4, y1, y2, y3, y4, 2);

          renderBorder(renderMode, _points2, bbc, ctx, this);
        }

        if (blw > 0 && blc !== 'transparent') {
          var _deg5 = Math.atan(blw / btw);

          var _deg6 = Math.atan(blw / bbw);

          var _points3 = border.calPoints(blw, bls, _deg5, _deg6, x1, x2, x3, x4, y1, y2, y3, y4, 3);

          renderBorder(renderMode, _points3, blc, ctx, this);
        }
      } // 先查找到注册了事件的节点，再捕获冒泡判断增加性能

    }, {
      key: "__emitEvent",
      value: function __emitEvent(e, force) {
        var type = e.event.type,
            x = e.x,
            y = e.y,
            covers = e.covers;
        var listener = this.listener,
            children = this.children,
            style = this.style,
            outerWidth = this.outerWidth,
            outerHeight = this.outerHeight,
            matrixEvent = this.matrixEvent;

        if (style.display === 'none' || e.__stopPropagation) {
          return;
        }

        var cb;

        if (listener.hasOwnProperty(type)) {
          cb = listener[type];
        }

        var childWillResponse; // touchmove之类强制的直接通知即可

        if (force) {
          if (!this.isGeom()) {
            children.forEach(function (child) {
              if (child instanceof Xom || child instanceof Component) {
                if (child.__emitEvent(e, force)) {
                  childWillResponse = true;
                }
              }
            });
          } // touchmove之类也需要考虑target是否是自己以及孩子


          if (!childWillResponse && this.root.__touchstartTarget !== this) {
            return;
          }

          if (e.__stopPropagation) {
            return;
          }

          if (type === 'touchmove' || type === 'touchend' || type === 'touchcancel') {
            e.target = this.root.__touchstartTarget;
          }

          if (cb) {
            cb.forEach(function (item) {
              if (e.__stopImmediatePropagation) {
                return;
              }

              item(e);
            });
          }

          return true;
        }

        if (!this.isGeom()) {
          // 先响应absolute/relative高优先级，从后往前遮挡顺序
          for (var i = children.length - 1; i >= 0; i--) {
            var child = children[i];

            if (child instanceof Xom && ['absolute', 'relative'].indexOf(child.style.position) > -1) {
              if (child.__emitEvent(e)) {
                childWillResponse = true;
              }
            } // 组件要形成shadowDom，除了shadowRoot，其它节点事件不冒泡
            else if (child instanceof Component && ['absolute', 'relative'].indexOf(child.style.position) > -1) {
                if (child.__emitEvent(e)) {
                  childWillResponse = true;
                }
              }
          } // 再看普通流，从后往前遮挡顺序


          for (var _i = children.length - 1; _i >= 0; _i--) {
            var _child = children[_i];

            if (_child instanceof Xom && ['absolute', 'relative'].indexOf(_child.style.position) === -1) {
              if (_child.__emitEvent(e)) {
                childWillResponse = true;
              }
            } else if (_child instanceof Component && ['absolute', 'relative'].indexOf(_child.style.position) === -1) {
              if (_child.__emitEvent(e)) {
                childWillResponse = true;
              }
            }
          }
        }

        if (e.__stopPropagation) {
          return;
        } // child触发则parent一定触发，否则判断事件坐标是否在节点内且未被遮挡


        if (childWillResponse || this.willResponseEvent(e)) {
          // 根据是否matrix存入遮罩坐标
          covers.push({
            x: x,
            y: y,
            w: outerWidth,
            h: outerHeight,
            matrixEvent: matrixEvent
          });

          if (cb) {
            cb.forEach(function (item) {
              if (e.__stopImmediatePropagation) {
                return;
              }

              item(e);
            });
          }

          return true;
        }
      }
    }, {
      key: "willResponseEvent",
      value: function willResponseEvent(e) {
        var x = e.x,
            y = e.y,
            covers = e.covers;
        var rx = this.rx,
            ry = this.ry,
            outerWidth = this.outerWidth,
            outerHeight = this.outerHeight,
            matrixEvent = this.matrixEvent;
        var inThis = tf.pointInQuadrilateral(x - rx, y - ry, 0, 0, outerWidth, 0, 0, outerHeight, outerWidth, outerHeight, matrixEvent);

        if (inThis) {
          // 不能被遮挡
          for (var i = 0, len = covers.length; i < len; i++) {
            var _covers$i = covers[i],
                x2 = _covers$i.x,
                y2 = _covers$i.y,
                w = _covers$i.w,
                h = _covers$i.h,
                _matrixEvent = _covers$i.matrixEvent;

            if (tf.pointInQuadrilateral(x - rx, y - ry, x2 - rx, y2 - ry, x2 - rx + w, y2 - ry, x2 - rx, y2 - ry + h, x2 - rx + w, y2 - ry + h, _matrixEvent)) {
              return;
            }
          }

          if (!e.target) {
            e.target = this; // 缓存target给move用

            if (e.event.type === 'touchstart') {
              this.root.__touchstartTarget = this;
            }
          }

          return true;
        }
      }
    }, {
      key: "__getBgLg",
      value: function __getBgLg(renderMode, gd) {
        if (renderMode === mode.CANVAS) {
          var lg = this.ctx.createLinearGradient(gd.x1, gd.y1, gd.x2, gd.y2);
          gd.stop.forEach(function (item) {
            lg.addColorStop(item[1], item[0]);
          });
          return lg;
        } else if (renderMode === mode.SVG) {
          var uuid = this.defs.add({
            tagName: 'linearGradient',
            props: [['x1', gd.x1], ['y1', gd.y1], ['x2', gd.x2], ['y2', gd.y2]],
            stop: gd.stop
          });
          return "url(#".concat(uuid, ")");
        }
      }
    }, {
      key: "__getBgRg",
      value: function __getBgRg(renderMode, gd) {
        if (renderMode === mode.CANVAS) {
          var rg = this.ctx.createRadialGradient(gd.cx, gd.cy, 0, gd.cx, gd.cy, gd.r);
          gd.stop.forEach(function (item) {
            rg.addColorStop(item[1], item[0]);
          });
          return rg;
        } else if (renderMode === mode.SVG) {
          var uuid = this.defs.add({
            tagName: 'radialGradient',
            props: [['cx', gd.cx], ['cy', gd.cy], ['r', gd.r]],
            stop: gd.stop
          });
          return "url(#".concat(uuid, ")");
        }
      }
    }, {
      key: "addBorder",
      value: function addBorder(props) {
        this.virtualDom.bb.push({
          type: 'item',
          tagName: 'path',
          props: props
        });
      }
    }, {
      key: "addBackground",
      value: function addBackground(props) {
        this.virtualDom.bb.push({
          type: 'item',
          tagName: 'rect',
          props: props
        });
      }
    }, {
      key: "addTransform",
      value: function addTransform(props) {
        this.virtualDom.transform.push(props);
      }
    }, {
      key: "tagName",
      get: function get() {
        return this.__tagName;
      }
    }, {
      key: "mtw",
      get: function get() {
        return this.__mtw;
      }
    }, {
      key: "mrw",
      get: function get() {
        return this.__mrw;
      }
    }, {
      key: "mbw",
      get: function get() {
        return this.__mbw;
      }
    }, {
      key: "mlw",
      get: function get() {
        return this.__mlw;
      }
    }, {
      key: "ptw",
      get: function get() {
        return this.__ptw;
      }
    }, {
      key: "prw",
      get: function get() {
        return this.__prw;
      }
    }, {
      key: "pbw",
      get: function get() {
        return this.__pbw;
      }
    }, {
      key: "plw",
      get: function get() {
        return this.__plw;
      }
    }, {
      key: "outerWidth",
      get: function get() {
        var mlw = this.mlw,
            mrw = this.mrw,
            plw = this.plw,
            prw = this.prw,
            _this$style2 = this.style,
            borderLeftWidth = _this$style2.borderLeftWidth,
            borderRightWidth = _this$style2.borderRightWidth;
        return this.width + borderLeftWidth.value + borderRightWidth.value + mlw + mrw + plw + prw;
      }
    }, {
      key: "outerHeight",
      get: function get() {
        var mtw = this.mtw,
            mbw = this.mbw,
            ptw = this.ptw,
            pbw = this.pbw,
            _this$style3 = this.style,
            borderTopWidth = _this$style3.borderTopWidth,
            borderBottomWidth = _this$style3.borderBottomWidth;
        return this.height + borderTopWidth.value + borderBottomWidth.value + mtw + mbw + ptw + pbw;
      }
    }, {
      key: "listener",
      get: function get() {
        return this.__listener;
      }
    }, {
      key: "renderMode",
      get: function get() {
        return this.__renderMode;
      }
    }, {
      key: "matrix",
      get: function get() {
        return this.__matrix;
      }
    }, {
      key: "matrixEvent",
      get: function get() {
        return this.__matrixEvent;
      }
    }]);

    return Xom;
  }(Node);

  var LineGroup =
  /*#__PURE__*/
  function () {
    function LineGroup(x, y) {
      _classCallCheck(this, LineGroup);

      this.__list = [];
      this.__x = x;
      this.__y = y;
      this.__baseLine = 0;
    }

    _createClass(LineGroup, [{
      key: "add",
      value: function add(item) {
        this.list.push(item);
      }
    }, {
      key: "__calBaseLine",
      value: function __calBaseLine() {
        var baseLine = 0;
        this.list.forEach(function (item) {
          baseLine = Math.max(baseLine, item.baseLine);
        });
        return baseLine;
      }
    }, {
      key: "verticalAlign",
      value: function verticalAlign() {
        var _this = this;

        this.__baseLine = this.__calBaseLine(); // 仅当有2个和以上时才需要vertical对齐调整

        if (this.list.length > 1) {
          this.list.forEach(function (item) {
            if (item.baseLine !== _this.baseLine) {
              item.__offsetY(_this.baseLine - item.baseLine);
            }
          });
        }
      }
    }, {
      key: "horizonAlign",
      value: function horizonAlign(diff) {
        this.list.forEach(function (item) {
          item.__offsetX(diff);
        });
      }
    }, {
      key: "list",
      get: function get() {
        return this.__list;
      }
    }, {
      key: "x",
      get: function get() {
        return this.__x;
      }
    }, {
      key: "y",
      get: function get() {
        return this.__y;
      }
    }, {
      key: "width",
      get: function get() {
        var width = 0;
        this.list.forEach(function (item) {
          width += item.width;
        });
        return width;
      }
    }, {
      key: "height",
      get: function get() {
        var height = 0;
        this.list.forEach(function (item) {
          height = Math.max(height, item.height);
        });
        return height;
      }
    }, {
      key: "baseLine",
      get: function get() {
        return this.__baseLine;
      }
    }, {
      key: "size",
      get: function get() {
        return this.__list.length;
      }
    }]);

    return LineGroup;
  }();

  var REGISTER = {};

  var Geom =
  /*#__PURE__*/
  function (_Xom) {
    _inherits(Geom, _Xom);

    function Geom(tagName, props) {
      _classCallCheck(this, Geom);

      return _possibleConstructorReturn(this, _getPrototypeOf(Geom).call(this, tagName, props));
    }

    _createClass(Geom, [{
      key: "__init",
      value: function __init() {
        css.normalize(this.style);
      }
    }, {
      key: "__tryLayInline",
      value: function __tryLayInline(w, total) {
        // 无children，直接以style的width为宽度，不定义则为0
        var width = this.style.width;

        if (width.unit === unit.PX) {
          return w - width.value;
        } else if (width.unit === unit.PERCENT) {
          return w - total * width.value * 0.01;
        }

        return w;
      }
    }, {
      key: "__calAutoBasis",
      value: function __calAutoBasis(isDirectionRow, w, h) {
        var b = 0;
        var min = 0;
        var max = 0;
        var style = this.style; // 计算需考虑style的属性

        var width = style.width,
            height = style.height,
            borderTopWidth = style.borderTopWidth,
            borderRightWidth = style.borderRightWidth,
            borderBottomWidth = style.borderBottomWidth,
            borderLeftWidth = style.borderLeftWidth;
        var main = isDirectionRow ? width : height;

        if (main.unit !== unit.AUTO) {
          b = max += main.value;
        } // border也得计算在内


        if (isDirectionRow) {
          var _w = borderRightWidth.value + borderLeftWidth.value;

          b += _w;
          max += _w;
          min += _w;
        } else {
          var _h = borderTopWidth.value + borderBottomWidth.value;

          b += _h;
          max += _h;
          min += _h;
        }

        return {
          b: b,
          min: min,
          max: max
        };
      }
    }, {
      key: "__layoutBlock",
      value: function __layoutBlock(data) {
        var _this$__preLayout = this.__preLayout(data),
            fixedHeight = _this$__preLayout.fixedHeight,
            w = _this$__preLayout.w,
            h = _this$__preLayout.h;

        var _this$style = this.style,
            marginLeft = _this$style.marginLeft,
            marginRight = _this$style.marginRight,
            width = _this$style.width;
        this.__width = w;
        this.__height = fixedHeight ? h : 0; // 处理margin:xx auto居中对齐

        if (marginLeft.unit === unit.AUTO && marginRight.unit === unit.AUTO && width.unit !== unit.AUTO) {
          var ow = this.outerWidth;

          if (ow < data.w) {
            this.__offsetX((data.w - ow) * 0.5);
          }
        }
      }
    }, {
      key: "__layoutFlex",
      value: function __layoutFlex(data) {
        // 无children所以等同于block
        this.__layoutBlock(data);
      }
    }, {
      key: "__layoutInline",
      value: function __layoutInline(data) {
        var _this$__preLayout2 = this.__preLayout(data),
            fixedWidth = _this$__preLayout2.fixedWidth,
            fixedHeight = _this$__preLayout2.fixedHeight,
            x = _this$__preLayout2.x,
            y = _this$__preLayout2.y,
            w = _this$__preLayout2.w,
            h = _this$__preLayout2.h; // 元素的width不能超过父元素w


        this.__width = fixedWidth ? w : x - data.x;
        this.__height = fixedHeight ? h : y - data.y;
      }
    }, {
      key: "__calAbs",
      value: function __calAbs() {
        return 0;
      }
    }, {
      key: "__preRender",
      value: function __preRender(renderMode) {
        var x = this.rx,
            y = this.ry,
            width = this.width,
            height = this.height,
            mlw = this.mlw,
            mtw = this.mtw,
            plw = this.plw,
            ptw = this.ptw,
            prw = this.prw,
            pbw = this.pbw,
            style = this.style;
        var borderTopWidth = style.borderTopWidth,
            borderLeftWidth = style.borderLeftWidth,
            display = style.display,
            stroke = style.stroke,
            strokeWidth = style.strokeWidth,
            strokeDasharray = style.strokeDasharray,
            fill = style.fill;
        var originX = x + borderLeftWidth.value + mlw + plw;
        var originY = y + borderTopWidth.value + mtw + ptw;
        var cx = originX + width * 0.5;
        var cy = originY + height * 0.5;
        var iw = width + plw + prw;
        var ih = height + ptw + pbw;

        if (strokeWidth > 0 && stroke.indexOf('linear-gradient') > -1) {
          var go = gradient.parseGradient(stroke);

          if (go) {
            var lg = gradient.getLinear(go.v, cx, cy, iw, ih);
            stroke = this.__getBgLg(renderMode, lg);
          }
        }

        if (fill.indexOf('linear-gradient') > -1) {
          var _go = gradient.parseGradient(fill);

          if (_go) {
            var _lg = gradient.getLinear(_go.v, cx, cy, iw, ih);

            fill = this.__getBgLg(renderMode, _lg);
          }
        } else if (fill.indexOf('radial-gradient') > -1) {
          var _go2 = gradient.parseGradient(fill);

          if (_go2) {
            var rg = gradient.getRadial(_go2.v, cx, cy, originX, originY, originY + iw, originY + ih);
            fill = this.__getBgRg(renderMode, rg);
          }
        }

        return {
          x: x,
          y: y,
          originX: originX,
          originY: originY,
          cx: cx,
          cy: cy,
          display: display,
          stroke: stroke,
          strokeWidth: strokeWidth,
          strokeDasharray: strokeDasharray,
          fill: fill
        };
      }
    }, {
      key: "render",
      value: function render(renderMode) {
        _get(_getPrototypeOf(Geom.prototype), "render", this).call(this, renderMode);

        if (renderMode === mode.SVG) {
          this.__virtualDom = _objectSpread2({}, _get(_getPrototypeOf(Geom.prototype), "virtualDom", this), {
            type: 'geom'
          });
        }

        return this.__preRender(renderMode);
      }
    }, {
      key: "addGeom",
      value: function addGeom(tagName, props) {
        props = util.hash2arr(props);
        this.virtualDom.children.push({
          type: 'item',
          tagName: tagName,
          props: props
        });
      }
    }, {
      key: "tagName",
      get: function get() {
        return this.__tagName;
      }
    }, {
      key: "baseLine",
      get: function get() {
        return this.__height;
      }
    }], [{
      key: "getRegister",
      value: function getRegister(name) {
        if (!REGISTER.hasOwnProperty(name)) {
          throw new Error("Geom has not register: ".concat(name));
        }

        return REGISTER[name];
      }
    }, {
      key: "register",
      value: function register(name, obj) {
        if (Geom.hasRegister(name)) {
          throw new Error("Geom has already register: ".concat(name));
        }

        REGISTER[name] = obj;
      }
    }, {
      key: "hasRegister",
      value: function hasRegister(name) {
        return REGISTER.hasOwnProperty(name);
      }
    }]);

    return Geom;
  }(Xom);

  var TAG_NAME = {
    'div': true,
    'span': true
  };
  var INLINE = {
    'span': true
  };

  var Dom =
  /*#__PURE__*/
  function (_Xom) {
    _inherits(Dom, _Xom);

    function Dom(tagName, props, children) {
      var _this;

      _classCallCheck(this, Dom);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Dom).call(this, tagName, props));
      _this.__children = children;
      _this.__flowChildren = []; // 非绝对定位孩子

      _this.__absChildren = []; // 绝对定位孩子

      _this.__lineGroups = []; // 一行inline元素组成的LineGroup对象后的存放列表

      _this.__flowY = 0; // 文档流布局结束后的y坐标，供absolute布局默认位置使用

      return _this;
    }
    /**
     * 1. 封装string为Text节点
     * 2. 打平children中的数组，变成一维
     * 3. 合并相连的Text节点
     * 4. 检测inline不能包含block和flex
     * 5. 设置parent和prev/next和ctx和defs和mode
     */


    _createClass(Dom, [{
      key: "__traverse",
      value: function __traverse(ctx, defs, renderMode) {
        var _this2 = this;

        var list = [];

        this.__traverseChildren(this.children, list, ctx, defs, renderMode);

        for (var i = list.length - 1; i > 0; i--) {
          var item = list[i];

          if (item instanceof Text) {
            var _prev = list[i - 1];

            if (_prev instanceof Text) {
              _prev.content += item.content;
              list.splice(i, 1);
            } else {
              i--;
            }
          }
        }

        if (this.style.display === 'inline' && this.parent.style.display !== 'flex') {
          for (var _i = list.length - 1; _i >= 0; _i--) {
            var _item = list[_i];

            if ((_item instanceof Xom || _item instanceof Component) && _item.style.display !== 'inline') {
              throw new Error('inline can not contain block/flex');
            }
          }
        }

        var prev = null;
        list.forEach(function (item) {
          item.__ctx = ctx;
          item.__defs = defs;

          item.__parent = _this2;
          item.__prev = prev;
        });
        this.__children = list;
      }
    }, {
      key: "__traverseChildren",
      value: function __traverseChildren(children, list, ctx, defs, renderMode) {
        var _this3 = this;

        if (Array.isArray(children)) {
          children.forEach(function (item) {
            _this3.__traverseChildren(item, list, ctx, defs, renderMode);
          });
        } else if (children instanceof Dom || children instanceof Component) {
          list.push(children);

          children.__traverse(ctx, defs, renderMode);
        } // 图形没有children
        else if (children instanceof Geom) {
            list.push(children);
          } // 排除掉空的文本
          else if (!util.isNil(children)) {
              var text = new Text(children);
              text.__renderMode = renderMode;
              list.push(text);
            }
      } // 合并设置style，包括继承和默认值，修改一些自动值和固定值，测量所有文字的宽度

    }, {
      key: "__init",
      value: function __init() {
        var _this4 = this;

        var style = this.__style; // 仅支持flex/block/inline/none

        if (!style.display || ['flex', 'block', 'inline', 'none'].indexOf(style.display) === -1) {
          if (INLINE.hasOwnProperty(this.tagName)) {
            style.display = 'inline';
          } else {
            style.display = 'block';
          }
        } // 继承父元素样式


        var parent = this.parent;

        if (parent) {
          var parentStyle = parent.style;
          ['fontSize', 'fontWeight', 'fontStyle', 'lineHeight', 'wordBreak', 'color', 'textAlign'].forEach(function (k) {
            if (!style.hasOwnProperty(k) && parentStyle.hasOwnProperty(k)) {
              style[k] = parentStyle[k];
            }
          });
        } // 标准化处理，默认值、简写属性


        css.normalize(style);
        this.children.forEach(function (item) {
          if (item instanceof Xom || item instanceof Component) {
            item.__init();
          } else {
            item.__style = style; // 文字首先测量所有字符宽度

            item.__measure();
          }

          if (item instanceof Text || item.style.position !== 'absolute') {
            _this4.__flowChildren.push(item);
          } else {
            _this4.__absChildren.push(item);
          }
        });
      } // 给定父宽度情况下，尝试行内放下后的剩余宽度，为负数即放不下

    }, {
      key: "__tryLayInline",
      value: function __tryLayInline(w, total) {
        var flowChildren = this.flowChildren,
            width = this.style.width;

        if (width.unit === unit.PX) {
          return w - width.value;
        } else if (width.unit === unit.PERCENT) {
          return w - total * width.value * 0.01;
        }

        for (var i = 0; i < flowChildren.length; i++) {
          // 当放不下时直接返回，无需继续多余的尝试计算
          if (w < 0) {
            return w;
          }

          var item = flowChildren[i];

          if (item instanceof Xom) {
            w -= item.__tryLayInline(w, total);
          } else {
            w -= item.textWidth;
          }
        }

        return w;
      } // 设置y偏移值，递归包括children，此举在flex行元素的child进行justify-content对齐用

    }, {
      key: "__offsetX",
      value: function __offsetX(diff) {
        _get(_getPrototypeOf(Dom.prototype), "__offsetX", this).call(this, diff);

        this.flowChildren.forEach(function (item) {
          if (item) {
            item.__offsetX(diff);
          }
        });
      } // 设置y偏移值，递归包括children，此举在初步确定inline布局后设置元素vertical-align用

    }, {
      key: "__offsetY",
      value: function __offsetY(diff) {
        _get(_getPrototypeOf(Dom.prototype), "__offsetY", this).call(this, diff);

        this.flowChildren.forEach(function (item) {
          if (item) {
            item.__offsetY(diff);
          }
        });
      }
    }, {
      key: "__calAutoBasis",
      value: function __calAutoBasis(isDirectionRow, w, h, isRecursion) {
        var b = 0;
        var min = 0;
        var max = 0;
        var flowChildren = this.flowChildren,
            style = this.style; // 计算需考虑style的属性

        var width = style.width,
            height = style.height,
            marginLeft = style.marginLeft,
            marginTop = style.marginTop,
            marginRight = style.marginRight,
            marginBottom = style.marginBottom,
            paddingLeft = style.paddingLeft,
            paddingTop = style.paddingTop,
            paddingRight = style.paddingRight,
            paddingBottom = style.paddingBottom,
            borderTopWidth = style.borderTopWidth,
            borderRightWidth = style.borderRightWidth,
            borderBottomWidth = style.borderBottomWidth,
            borderLeftWidth = style.borderLeftWidth;
        var main = isDirectionRow ? width : height;

        if (main.unit === unit.PX) {
          b = max = main.value; // 递归时children的长度会影响flex元素的最小宽度

          if (isRecursion) {
            min = b;
          }
        } // 递归children取最大值


        flowChildren.forEach(function (item) {
          if (item instanceof Xom || item instanceof Component) {
            var _item$__calAutoBasis = item.__calAutoBasis(isDirectionRow, w, h, true),
                b2 = _item$__calAutoBasis.b,
                min2 = _item$__calAutoBasis.min,
                max2 = _item$__calAutoBasis.max;

            b = Math.max(b, b2);
            min = Math.max(min, min2);
            max = Math.max(max, max2);
          } // 文本
          else if (isDirectionRow) {
              min = Math.max(item.charWidth, min);
              max = Math.max(item.textWidth, max);
            } // Geom
            else {
                item.__layout({
                  x: 0,
                  y: 0,
                  w: w,
                  h: h
                }, true);

                min = Math.max(min, item.height);
                max = Math.max(max, item.height);
              }
        }); // margin/padding/border也得计算在内，此时还没有，百分比相对于父flex元素的宽度

        if (isDirectionRow) {
          var mp = this.__calMp(marginLeft, w) + this.__calMp(marginRight, w) + this.__calMp(paddingLeft, w) + this.__calMp(paddingRight, w);

          var w2 = borderRightWidth.value + borderLeftWidth.value + mp;
          b += w2;
          max += w2;
          min += w2;
        } else {
          var _mp = this.__calMp(marginTop, w) + this.__calMp(marginBottom, w) + this.__calMp(paddingTop, w) + this.__calMp(paddingBottom, w);

          var h2 = borderTopWidth.value + borderBottomWidth.value + _mp;
          b += h2;
          max += h2;
          min += h2;
        }

        return {
          b: b,
          min: min,
          max: max
        };
      } // 换算margin/padding为px单位

    }, {
      key: "__calMp",
      value: function __calMp(v, w) {
        var n = 0;

        if (v.unit === unit.PX) {
          n += v.value;
        } else if (v.unit === unit.PERCENT) {
          v.value *= w * 0.01;
          v.unit = unit.PX;
          n += v.value;
        }

        return n;
      }
    }, {
      key: "__calAbs",
      value: function __calAbs(isDirectionRow) {
        var max = 0;
        var mtw = this.mtw,
            mrw = this.mrw,
            mbw = this.mbw,
            mlw = this.mlw,
            ptw = this.ptw,
            prw = this.prw,
            pbw = this.pbw,
            plw = this.plw,
            flowChildren = this.flowChildren,
            style = this.style; // 计算需考虑style的属性

        var width = style.width,
            height = style.height,
            borderTopWidth = style.borderTopWidth,
            borderRightWidth = style.borderRightWidth,
            borderBottomWidth = style.borderBottomWidth,
            borderLeftWidth = style.borderLeftWidth;
        var main = isDirectionRow ? width : height;

        if (main.unit === unit.PX) {
          max = main.value;
        } // 递归children取最大值


        flowChildren.forEach(function (item) {
          if (item instanceof Xom) {
            var max2 = item.__calAbs(isDirectionRow);

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
          var w = borderRightWidth.value + borderLeftWidth.value + mlw + mrw + plw + prw;
          max += w;
        } else {
          var h = borderTopWidth.value + borderBottomWidth.value + mtw + mbw + ptw + pbw;
          max += h;
        }

        return max;
      } // 本身block布局时计算好所有子元素的基本位置

    }, {
      key: "__layoutBlock",
      value: function __layoutBlock(data) {
        var flowChildren = this.flowChildren,
            style = this.style,
            lineGroups = this.lineGroups;
        var width = style.width,
            marginLeft = style.marginLeft,
            marginRight = style.marginRight,
            textAlign = style.textAlign;

        var _this$__preLayout = this.__preLayout(data),
            fixedHeight = _this$__preLayout.fixedHeight,
            x = _this$__preLayout.x,
            y = _this$__preLayout.y,
            w = _this$__preLayout.w,
            h = _this$__preLayout.h; // 递归布局，将inline的节点组成lineGroup一行


        var lineGroup = new LineGroup(x, y);
        flowChildren.forEach(function (item) {
          if (item instanceof Xom || item instanceof Component) {
            if (item.style.display === 'inline') {
              // inline开头，不用考虑是否放得下直接放
              if (x === data.x) {
                lineGroup.add(item);

                item.__layout({
                  x: x,
                  y: y,
                  w: w,
                  h: h
                });

                x += item.outerWidth;
              } else {
                // 非开头先尝试是否放得下
                var fw = item.__tryLayInline(w - x, w); // 放得下继续


                if (fw >= 0) {
                  item.__layout({
                    x: x,
                    y: y,
                    w: w,
                    h: h
                  });
                } // 放不下处理之前的lineGroup，并重新开头
                else {
                    lineGroups.push(lineGroup);
                    lineGroup.verticalAlign();
                    x = data.x;
                    y += lineGroup.height;

                    item.__layout({
                      x: data.x,
                      y: y,
                      w: w,
                      h: h
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
                y: y,
                w: w,
                h: h
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
                  x: x,
                  y: y,
                  w: w,
                  h: h
                });

                x += item.width;
              } else {
                // 非开头先尝试是否放得下
                var _fw = item.__tryLayInline(w - x, w); // 放得下继续


                if (_fw >= 0) {
                  item.__layout({
                    x: x,
                    y: y,
                    w: w,
                    h: h
                  });
                } // 放不下处理之前的lineGroup，并重新开头
                else {
                    lineGroups.push(lineGroup);
                    lineGroup.verticalAlign();
                    x = data.x;
                    y += lineGroup.height;

                    item.__layout({
                      x: data.x,
                      y: y,
                      w: w,
                      h: h
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
          lineGroups.forEach(function (lineGroup) {
            var diff = w - lineGroup.width;

            if (diff > 0) {
              lineGroup.horizonAlign(textAlign === 'center' ? diff * 0.5 : diff);
            }
          });
        }

        this.__width = w;
        this.__height = fixedHeight ? h : y - data.y;
        this.__flowY = y; // 处理margin:xx auto居中对齐

        if (marginLeft.unit === unit.AUTO && marginRight.unit === unit.AUTO && width.unit !== unit.AUTO) {
          var ow = this.outerWidth;

          if (ow < data.w) {
            this.__offsetX((data.w - ow) * 0.5);
          }
        }
      } // 弹性布局时的计算位置

    }, {
      key: "__layoutFlex",
      value: function __layoutFlex(data) {
        var flowChildren = this.flowChildren,
            style = this.style;
        var marginLeft = style.marginLeft,
            marginRight = style.marginRight,
            flexDirection = style.flexDirection,
            justifyContent = style.justifyContent,
            alignItems = style.alignItems;

        var _this$__preLayout2 = this.__preLayout(data),
            fixedWidth = _this$__preLayout2.fixedWidth,
            fixedHeight = _this$__preLayout2.fixedHeight,
            x = _this$__preLayout2.x,
            y = _this$__preLayout2.y,
            w = _this$__preLayout2.w,
            h = _this$__preLayout2.h;

        var isDirectionRow = flexDirection === 'row'; // column时height可能为auto，此时取消伸展，退化为类似block布局，但所有子元素强制block

        if (!isDirectionRow && !fixedHeight) {
          flowChildren.forEach(function (item) {
            if (item instanceof Xom || item instanceof Component) {
              var _style = item.style,
                  _item$style = item.style,
                  display = _item$style.display,
                  _flexDirection = _item$style.flexDirection,
                  _width = _item$style.width; // column的flex的child如果是inline，变为block

              if (display === 'inline') {
                _style.display = 'block';
              } // 竖向flex的child如果是横向flex，宽度自动的话要等同于父flex的宽度
              else if (display === 'flex' && _flexDirection === 'row' && _width.unit === unit.AUTO) {
                  _width.value = w;
                  _width.unit = unit.PX;
                }

              item.__layout({
                x: x,
                y: y,
                w: w,
                h: h
              });

              y += item.outerHeight;
            } else {
              item.__layout({
                x: x,
                y: y,
                w: w,
                h: h
              });

              y += item.outerHeight;
            }
          });
          this.__width = w;
          this.__height = y - data.y;
          return;
        } // 计算伸缩基数


        var growList = [];
        var shrinkList = [];
        var basisList = [];
        var minList = [];
        var growSum = 0;
        var shrinkSum = 0;
        var basisSum = 0;
        var maxSum = 0;
        flowChildren.forEach(function (item) {
          if (item instanceof Xom || item instanceof Component) {
            var _item$style2 = item.style,
                flexGrow = _item$style2.flexGrow,
                flexShrink = _item$style2.flexShrink,
                flexBasis = _item$style2.flexBasis;
            growList.push(flexGrow);
            shrinkList.push(flexShrink);
            growSum += flexGrow;
            shrinkSum += flexShrink;

            var _item$__calAutoBasis2 = item.__calAutoBasis(isDirectionRow, w, h),
                b = _item$__calAutoBasis2.b,
                min = _item$__calAutoBasis2.min,
                max = _item$__calAutoBasis2.max; // 根据basis不同，计算方式不同


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
                w: w,
                h: h
              }, true);

              basisList.push(item.height);
              basisSum += item.height;
              maxSum += item.height;
              minList.push(item.height);
            }
          }
        });
        var maxCross = 0; // 判断是否超出，决定使用grow还是shrink

        var isOverflow = maxSum > (isDirectionRow ? w : h);
        flowChildren.forEach(function (item, i) {
          var main;
          var shrink = shrinkList[i];
          var grow = growList[i]; // 计算主轴长度

          if (isOverflow) {
            var overflow = basisSum - (isDirectionRow ? w : h);
            main = shrink ? basisList[i] - overflow * shrink / shrinkSum : basisList[i];
          } else {
            var free = (isDirectionRow ? w : h) - basisSum;
            main = grow ? basisList[i] + free * grow / growSum : basisList[i];
          } // 主轴长度的最小值不能小于元素的最小长度，比如横向时的字符宽度


          main = Math.max(main, minList[i]);

          if (item instanceof Xom || item instanceof Component) {
            var _style2 = item.style,
                mlw = item.mlw,
                mtw = item.mtw,
                mrw = item.mrw,
                mbw = item.mbw,
                plw = item.plw,
                ptw = item.ptw,
                prw = item.prw,
                pbw = item.pbw,
                _item$style3 = item.style,
                display = _item$style3.display,
                _flexDirection2 = _item$style3.flexDirection,
                _width2 = _item$style3.width,
                height = _item$style3.height,
                borderTopWidth = _item$style3.borderTopWidth,
                borderRightWidth = _item$style3.borderRightWidth,
                borderBottomWidth = _item$style3.borderBottomWidth,
                borderLeftWidth = _item$style3.borderLeftWidth;

            if (isDirectionRow) {
              // row的flex的child如果是inline，变为block
              if (display === 'inline') {
                _style2.display = 'block';
              } // 横向flex的child如果是竖向flex，高度自动的话要等同于父flex的高度
              else if (display === 'flex' && _flexDirection2 === 'column' && fixedHeight && height.unit === unit.AUTO) {
                  height.value = h;
                  height.unit = unit.PX;
                }

              item.__layout({
                x: x,
                y: y,
                w: main,
                h: h
              });
            } else {
              // column的flex的child如果是inline，变为block
              if (display === 'inline') {
                _style2.display = 'block';
              } // 竖向flex的child如果是横向flex，宽度自动的话要等同于父flex的宽度
              else if (display === 'flex' && _flexDirection2 === 'row' && _width2.unit === unit.AUTO) {
                  _width2.value = w;
                  _width2.unit = unit.PX;
                }

              item.__layout({
                x: x,
                y: y,
                w: w,
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
              x: x,
              y: y,
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

        var diff = isDirectionRow ? w - x + data.x : h - y + data.y; // 主轴侧轴对齐方式

        if (!isOverflow && growSum === 0 && diff > 0) {
          var len = flowChildren.length;

          if (justifyContent === 'flex-end') {
            for (var i = 0; i < len; i++) {
              var child = flowChildren[i];
              isDirectionRow ? child.__offsetX(diff) : child.__offsetY(diff);
            }
          } else if (justifyContent === 'center') {
            var center = diff * 0.5;

            for (var _i2 = 0; _i2 < len; _i2++) {
              var _child = flowChildren[_i2];
              isDirectionRow ? _child.__offsetX(center) : _child.__offsetY(center);
            }
          } else if (justifyContent === 'space-between') {
            var between = diff / (len - 1);

            for (var _i3 = 1; _i3 < len; _i3++) {
              var _child2 = flowChildren[_i3];
              isDirectionRow ? _child2.__offsetX(between * _i3) : _child2.__offsetY(between * _i3);
            }
          } else if (justifyContent === 'space-around') {
            var around = diff / (len + 1);

            for (var _i4 = 0; _i4 < len; _i4++) {
              var _child3 = flowChildren[_i4];
              isDirectionRow ? _child3.__offsetX(around * (_i4 + 1)) : _child3.__offsetY(around * (_i4 + 1));
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
          flowChildren.forEach(function (item) {
            var style = item.style,
                mlw = item.mlw,
                mtw = item.mtw,
                mrw = item.mrw,
                mbw = item.mbw,
                ptw = item.ptw,
                prw = item.prw,
                plw = item.plw,
                pbw = item.pbw;

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
          flowChildren.forEach(function (item) {
            var diff = maxCross - item.outerHeight;

            if (diff > 0) {
              item.__offsetY(diff * 0.5);
            }
          });
        } else if (alignItems === 'flex-end') {
          flowChildren.forEach(function (item) {
            var diff = maxCross - item.outerHeight;

            if (diff > 0) {
              item.__offsetY(diff);
            }
          });
        }

        this.__width = w;
        this.__height = fixedHeight ? h : y - data.y;
        this.__flowY = y; // 处理margin:xx auto居中对齐

        if (marginLeft.unit === unit.AUTO && marginRight.unit === unit.AUTO && width.unit !== unit.AUTO) {
          var ow = this.outerWidth;

          if (ow < data.w) {
            this.__offsetX((data.w - ow) * 0.5);
          }
        }
      } // inline比较特殊，先简单顶部对其，后续还需根据vertical和lineHeight计算y偏移

    }, {
      key: "__layoutInline",
      value: function __layoutInline(data) {
        var _this5 = this;

        var flowChildren = this.flowChildren,
            style = this.style,
            lineGroups = this.lineGroups;
        var width = style.width,
            marginLeft = style.marginLeft,
            marginRight = style.marginRight,
            textAlign = style.textAlign;

        var _this$__preLayout3 = this.__preLayout(data),
            fixedWidth = _this$__preLayout3.fixedWidth,
            fixedHeight = _this$__preLayout3.fixedHeight,
            x = _this$__preLayout3.x,
            y = _this$__preLayout3.y,
            w = _this$__preLayout3.w,
            h = _this$__preLayout3.h;

        var maxX = x; // 递归布局，将inline的节点组成lineGroup一行

        var lineGroup = new LineGroup(x, y);
        flowChildren.forEach(function (item) {
          if (item instanceof Xom || item instanceof Component) {
            // 绝对定位跳过
            if (item.style.position === 'absolute') {
              _this5.absChildren.push(item);

              return;
            }

            item.style.display = 'inline'; // inline开头，不用考虑是否放得下直接放

            if (x === data.x) {
              lineGroup.add(item);

              item.__layout({
                x: x,
                y: y,
                w: w,
                h: h
              });

              x += item.outerWidth;
              maxX = Math.max(maxX, x);
            } else {
              // 非开头先尝试是否放得下
              var fw = item.__tryLayInline(w - x, w); // 放得下继续


              if (fw >= 0) {
                item.__layout({
                  x: x,
                  y: y,
                  w: w,
                  h: h
                });
              } // 放不下处理之前的lineGroup，并重新开头
              else {
                  lineGroups.push(lineGroup);
                  lineGroup.verticalAlign();
                  x = data.x;
                  y += lineGroup.height;

                  item.__layout({
                    x: data.x,
                    y: y,
                    w: w,
                    h: h
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
                  x: x,
                  y: y,
                  w: w,
                  h: h
                });

                x += item.width;
                maxX = Math.max(maxX, x);
              } else {
                // 非开头先尝试是否放得下
                var _fw2 = item.__tryLayInline(w - x, w); // 放得下继续


                if (_fw2 >= 0) {
                  item.__layout({
                    x: x,
                    y: y,
                    w: w,
                    h: h
                  });
                } // 放不下处理之前的lineGroup，并重新开头
                else {
                    lineGroups.push(lineGroup);
                    lineGroup.verticalAlign();
                    x = data.x;
                    y += lineGroup.height;

                    item.__layout({
                      x: data.x,
                      y: y,
                      w: w,
                      h: h
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
          lineGroups.forEach(function (lineGroup) {
            var diff = w - lineGroup.width;

            if (diff > 0) {
              lineGroup.horizonAlign(textAlign === 'center' ? diff * 0.5 : diff);
            }
          });
        } // 元素的width不能超过父元素w


        this.__width = fixedWidth ? w : maxX - data.x;
        this.__height = fixedHeight ? h : y - data.y;
        this.__flowY = y; // 处理margin:xx auto居中对齐

        if (marginLeft.unit === unit.AUTO && marginRight.unit === unit.AUTO && width.unit !== unit.AUTO) {
          var ow = this.outerWidth;

          if (ow < data.w) {
            this.__offsetX((data.w - ow) * 0.5);
          }
        }
      } // 只针对绝对定位children布局

    }, {
      key: "__layoutAbs",
      value: function __layoutAbs(container) {
        var x = container.x,
            y = container.y,
            flowY = container.flowY,
            width = container.width,
            height = container.height,
            style = container.style,
            mlw = container.mlw,
            mtw = container.mtw,
            plw = container.plw,
            ptw = container.ptw,
            prw = container.prw,
            pbw = container.pbw;
        var children = this.children,
            absChildren = this.absChildren;
        var borderTopWidth = style.borderTopWidth,
            borderLeftWidth = style.borderLeftWidth;
        x += mlw + borderLeftWidth.value;
        y += mtw + borderTopWidth.value;
        var pw = width + plw + prw;
        var ph = height + ptw + pbw; // 递归进行，遇到absolute/relative的设置新容器

        children.forEach(function (item) {
          if (item instanceof Dom || item instanceof Component) {
            item.__layoutAbs(['absolute', 'relative'].indexOf(item.style.position) > -1 ? item : container);
          }
        }); // 对absolute的元素进行相对容器布局

        absChildren.forEach(function (item) {
          var style = item.style,
              _item$style4 = item.style,
              left = _item$style4.left,
              top = _item$style4.top,
              right = _item$style4.right,
              bottom = _item$style4.bottom,
              width2 = _item$style4.width,
              height2 = _item$style4.height;
          var x2, y2, w2, h2; // width优先级高于right高于left，即最高left+right，其次left+width，再次right+width，然后仅申明单个，最次全部auto

          if (left.unit !== unit.AUTO && right.unit !== unit.AUTO) {
            x2 = left.unit === unit.PX ? x + left.value : x + width * left.value * 0.01;
            w2 = right.unit === unit.PX ? x + pw - right.value - x2 : x + pw - width * right.value * 0.01 - x2;
          } else if (left.unit !== unit.AUTO && width2.unit !== unit.AUTO) {
            x2 = left.unit === unit.PX ? x + left.value : x + width * left.value * 0.01;
            w2 = width2.unit === unit.PX ? width2.value : width;
          } else if (right.unit !== unit.AUTO && width2.unit !== unit.AUTO) {
            w2 = width2.unit === unit.PX ? width2.value : width;
            var widthPx = width2.unit === unit.PX ? width2.value : width * width2.value * 0.01;
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
            var heightPx = height2.unit === unit.PX ? height2.value : height * height2.value * 0.01;
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
    }, {
      key: "render",
      value: function render(renderMode) {
        _get(_getPrototypeOf(Dom.prototype), "render", this).call(this, renderMode);

        var display = this.style.display,
            flowChildren = this.flowChildren,
            children = this.children;

        if (display === 'none') {
          return;
        } // 先绘制static


        flowChildren.forEach(function (item) {
          if (item instanceof Text || item.style.position === 'static') {
            item.render(renderMode);
          }

          if (item instanceof Component && item.style.position === 'static') {
            item.shadowRoot.render(renderMode);
          }
        }); // 再绘制relative和absolute

        children.forEach(function (item) {
          if (item instanceof Xom && ['relative', 'absolute'].indexOf(item.style.position) > -1) {
            item.render(renderMode);
          }

          if (item instanceof Component && ['relative', 'absolute'].indexOf(item.style.position) > -1) {
            item.shadowRoot.render(renderMode);
          }
        });

        if (renderMode === mode.SVG) {
          this.__virtualDom = _objectSpread2({}, _get(_getPrototypeOf(Dom.prototype), "virtualDom", this), {
            type: 'dom',
            children: this.children.map(function (item) {
              return item.virtualDom;
            })
          });
        }
      }
    }, {
      key: "tagName",
      get: function get() {
        return this.__tagName;
      }
    }, {
      key: "children",
      get: function get() {
        return this.__children;
      }
    }, {
      key: "flowChildren",
      get: function get() {
        return this.__flowChildren;
      }
    }, {
      key: "absChildren",
      get: function get() {
        return this.__absChildren;
      }
    }, {
      key: "lineGroups",
      get: function get() {
        return this.__lineGroups;
      }
    }, {
      key: "baseLine",
      get: function get() {
        var len = this.lineGroups.length;

        if (len) {
          var last = this.lineGroups[len - 1];
          return last.y - this.y + last.baseLine;
        }

        return this.y;
      }
    }, {
      key: "flowY",
      get: function get() {
        return this.__flowY;
      }
    }], [{
      key: "isValid",
      value: function isValid(s) {
        return TAG_NAME.hasOwnProperty(s);
      }
    }]);

    return Dom;
  }(Xom);

  function diff(elem, ovd, nvd) {
    var cns = elem.childNodes;
    diffDefs(cns[0], ovd.defs, nvd.defs);
    diffBb(cns[1], ovd.bb, nvd.bb);
    diffD2D(elem, ovd, nvd, true);
  }

  function diffDefs(elem, od, nd) {
    var ol = od.length;
    var nl = nd.length;
    var i = 0;
    var cns = elem.childNodes;

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

      var op = {};

      for (var j = 0, len = od.props.length; j < len; j++) {
        var prop = od.props[j];

        var _prop = _slicedToArray(prop, 2),
            k = _prop[0],
            v = _prop[1];

        op[k] = v;
      }

      for (var _j = 0, _len = nd.props.length; _j < _len; _j++) {
        var _prop2 = nd.props[_j];

        var _prop3 = _slicedToArray(_prop2, 2),
            k = _prop3[0],
            v = _prop3[1]; // 已有不等更新，没有添加


        if (op.hasOwnProperty(k)) {
          if (op[k] !== v) {
            elem.setAttribute(k, v);
          }

          delete op[k];
        } else {
          elem.setAttribute(k, v);
        }
      } // 多余的删除


      for (var k in op) {
        if (op.hasOwnProperty(k)) {
          elem.removeAttribute(k);
        }
      }

      var cns = elem.childNodes;
      var ol = od.stop.length;
      var nl = nd.stop.length;
      var i = 0;

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

    var ol = ovd.children.length;
    var nl = nvd.children.length;
    var i = 0;
    var lastChild = elem.lastChild;
    var cns = lastChild.childNodes;

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
    var ol = ovd.children.length;
    var nl = nvd.children.length;
    var i = 0;

    for (; i < Math.min(ol, nl); i++) {
      diffItem(elem, i, ovd.children[i], nvd.children[i], true);
    }

    var cns = elem.childNodes;

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
      var transform = util.joinTransform(nvd.transform);

      if (elem.getAttribute('transform') !== transform) {
        elem.setAttribute('transform', transform);
      }
    }

    diffBb(elem.firstChild, ovd.bb, nvd.bb);
    var ol = ovd.children.length;
    var nl = nvd.children.length;
    var i = 0;
    var lastChild = elem.lastChild;
    var cns = lastChild.childNodes;

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
    var ol = obb.length;
    var nl = nbb.length;
    var i = 0;

    for (; i < Math.min(ol, nl); i++) {
      diffItem(elem, i, obb[i], nbb[i]);
    }

    var cns = elem.childNodes;

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
    var cns = elem.childNodes;

    if (ovd.tagName !== nvd.tagName) {
      replaceWith(cns[i], nvd);
    } else {
      var op = {};

      for (var j = 0, len = ovd.props.length; j < len; j++) {
        var prop = ovd.props[j];

        var _prop4 = _slicedToArray(prop, 2),
            k = _prop4[0],
            v = _prop4[1];

        op[k] = v;
      }

      for (var _j2 = 0, _len2 = nvd.props.length; _j2 < _len2; _j2++) {
        var _prop5 = nvd.props[_j2];

        var _prop6 = _slicedToArray(_prop5, 2),
            k = _prop6[0],
            v = _prop6[1]; // 已有不等更新，没有添加


        if (op.hasOwnProperty(k)) {
          if (op[k] !== v) {
            cns[i].setAttribute(k, v);
          }

          delete op[k];
        } else {
          cns[i].setAttribute(k, v);
        }
      } // 多余的删除


      for (var k in op) {
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
    var res;

    if (Array.isArray(vd)) {
      res = '';
      vd.forEach(function (item) {
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

    for (var i = 0, len = a.length; i < len; i++) {
      if (a[i] !== b[i]) {
        return false;
      }
    }

    return true;
  }

  var Defs =
  /*#__PURE__*/
  function () {
    function Defs(uuid) {
      _classCallCheck(this, Defs);

      this.id = uuid;
      this.count = 0;
      this.list = [];
    }

    _createClass(Defs, [{
      key: "add",
      value: function add(data) {
        data.uuid = "karas-defs-".concat(this.id, "-").concat(this.count++);
        this.list.push(data);
        return data.uuid;
      }
    }, {
      key: "clear",
      value: function clear() {
        this.list = [];
        this.count = 0;
      }
    }, {
      key: "value",
      get: function get() {
        return this.list;
      }
    }], [{
      key: "getInstance",
      value: function getInstance(uuid) {
        return new Defs(uuid);
      }
    }]);

    return Defs;
  }();

  function getDom(dom) {
    if (util.isString(dom)) {
      var o = document.querySelector(dom);

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
    var s = Array.isArray(v) ? util.joinSourceArray(v) : util.stringify(v);

    if (k === 'className') {
      k = 'class';
    }

    return ' ' + k + '="' + util.encodeHtml(s, true) + '"';
  }

  function initEvent(node) {
    ['click', 'dblclick', 'mousedown', 'mousemove', 'mouseup', 'touchstart', 'touchmove', 'touchend', 'touchcancel'].forEach(function (type) {
      node.addEventListener(type, function (e) {
        node.__root.__cb(e, ['touchend', 'touchcancel', 'touchmove'].indexOf(type) > -1);
      });
    });
  }

  var uuid = 0;

  var Root =
  /*#__PURE__*/
  function (_Dom) {
    _inherits(Root, _Dom);

    function Root(tagName, props, children) {
      var _this;

      _classCallCheck(this, Root);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Root).call(this, tagName, props, children));
      _this.__node = null; // 真实DOM引用

      _this.__mw = 0;
      _this.__mh = 0;
      return _this;
    }

    _createClass(Root, [{
      key: "__initProps",
      value: function __initProps() {
        var w = this.props.width;

        if (!util.isNil(w)) {
          var value = parseInt(w) || 0;

          if (value > 0) {
            this.__width = value;
          }
        }

        var h = this.props.height;

        if (!util.isNil(h)) {
          var _value = parseInt(h) || 0;

          if (_value > 0) {
            this.__height = _value;
          }
        }
      }
    }, {
      key: "__genHtml",
      value: function __genHtml() {
        var res = "<".concat(this.tagName); // 拼接处理属性

        for (var i = 0, len = this.__props.length; i < len; i++) {
          var item = this.__props[i];
          res += renderProp(item[0], item[1]);
        }

        res += "></".concat(this.tagName, ">");
        return res;
      } // 类似touchend/touchcancel/touchmove这种无需判断是否发生于元素上，直接强制响应

    }, {
      key: "__cb",
      value: function __cb(e, force) {
        if (e.type === 'touchmove' && !this.__touchstartTarget) {
          return;
        }

        if (e.touches && e.touches.length > 1) {
          return;
        }

        var node = this.node;

        var _node$getBoundingClie = node.getBoundingClientRect(),
            x = _node$getBoundingClie.x,
            y = _node$getBoundingClie.y,
            top = _node$getBoundingClie.top,
            right = _node$getBoundingClie.right;

        x = x || top || 0;
        y = y || right || 0;

        var _ref = e.touches ? e.touches[0] || {} : e,
            clientX = _ref.clientX,
            clientY = _ref.clientY;

        x = clientX - x;
        y = clientY - y;

        this.__emitEvent({
          event: e,
          stopPropagation: function stopPropagation() {
            this.__stopPropagation = true;
            e.stopPropagation();
          },
          stopImmediatePropagation: function stopImmediatePropagation() {
            this.__stopPropagation = true;
            this.__stopImmediatePropagation = true;
            e.stopImmediatePropagation();
          },
          preventDefault: function preventDefault() {
            e.preventDefault();
          },
          x: x,
          y: y,
          covers: []
        }, force);
      }
    }, {
      key: "appendTo",
      value: function appendTo(dom) {
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

        this.__uuid = util.isNil(this.__node.__uuid) ? uuid++ : this.__node.__uuid;
        this.__defs = this.node.__od || Defs.getInstance(this.__uuid);

        this.__defs.clear(); // 没有设置width/height则采用css计算形式


        if (!this.width || !this.height) {
          var css = window.getComputedStyle(dom, null);

          if (!this.width) {
            this.__width = parseInt(css.getPropertyValue('width'));
            dom.setAttribute('width', this.width);
          }

          if (!this.height) {
            this.__height = parseInt(css.getPropertyValue('height'));
            dom.setAttribute('height', this.height);
          }
        } // 只有canvas有ctx，svg用真实dom


        if (this.tagName === 'canvas') {
          this.__ctx = this.__node.getContext('2d');
          this.__renderMode = mode.CANVAS;
        } else if (this.tagName === 'svg') {
          this.__renderMode = mode.SVG;
        } // canvas/svg作为根节点一定是block或flex，不会是inline


        var style = this.style;

        if (['flex', 'block'].indexOf(style.display) === -1) {
          style.display = 'block';
        } // 同理position不能为absolute


        if (style.position === 'absolute') {
          style.position = 'static';
        }

        this.__traverse(this.__ctx, this.__defs, this.__renderMode);

        this.__init();

        this.refresh();
        this.node.__root = this;

        if (!this.node.__karasInit) {
          initEvent(this.node);
          this.node.__karasInit = true;
          this.node.__uuid = this.__uuid;
        }
      }
    }, {
      key: "refresh",
      value: function refresh() {
        var renderMode = this.renderMode,
            style = this.style;
        style.width = {
          value: this.width,
          unit: unit.PX
        };
        style.height = {
          value: this.height,
          unit: unit.PX
        };

        this.__layout({
          x: 0,
          y: 0,
          w: this.width,
          h: this.height
        });

        this.__layoutAbs(this);

        if (renderMode === mode.CANVAS) {
          // 可能会调整宽高，所以每次清除用最大值
          this.__mw = Math.max(this.__mw, this.width);
          this.__mh = Math.max(this.__mh, this.height);

          this.__ctx.clearRect(0, 0, this.__mw, this.__mh);
        }

        this.render(renderMode);

        if (renderMode === mode.SVG) {
          var nvd = this.virtualDom;
          var nd = this.__defs;
          nvd.defs = nd.value;
          nvd = util.clone(nvd);

          if (this.node.__karasInit) {
            diff(this.node, this.node.__ovd, nvd);
          } else {
            this.node.innerHTML = util.joinVirtualDom(nvd);
          }

          this.node.__ovd = nvd;
        }
      }
    }, {
      key: "node",
      get: function get() {
        return this.__node;
      }
    }, {
      key: "width",
      get: function get() {
        return this.__width;
      },
      set: function set(v) {
        this.__width = v;
      }
    }, {
      key: "height",
      get: function get() {
        return this.__height;
      },
      set: function set(v) {
        this.__height = v;
      }
    }, {
      key: "renderMode",
      get: function get() {
        return this.__renderMode;
      }
    }]);

    return Root;
  }(Dom);

  var Line =
  /*#__PURE__*/
  function (_Geom) {
    _inherits(Line, _Geom);

    function Line(tagName, props) {
      var _this;

      _classCallCheck(this, Line);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Line).call(this, tagName, props)); // x1,y1和x2,y2表明线段的首尾坐标，control表明控制点坐标

      _this.__x1 = _this.__y1 = 0;
      _this.__x2 = _this.__y2 = 1;
      _this.__controlA = [];
      _this.__controlB = [];

      if (_this.props.x1 !== undefined) {
        _this.__x1 = parseFloat(_this.props.x1) || 0;
      }

      if (_this.props.y1 !== undefined) {
        _this.__y1 = parseFloat(_this.props.y1) || 0;
      }

      if (_this.props.x2 !== undefined) {
        _this.__x2 = parseFloat(_this.props.x2) || 0;
      }

      if (_this.props.y2 !== undefined) {
        _this.__y2 = parseFloat(_this.props.y2) || 0;
      }

      if (Array.isArray(_this.props.controlA)) {
        _this.__controlA = _this.props.controlA;
      }

      if (Array.isArray(_this.props.controlB)) {
        _this.__controlB = _this.props.controlB;
      }

      return _this;
    }

    _createClass(Line, [{
      key: "render",
      value: function render(renderMode) {
        var _get$call = _get(_getPrototypeOf(Line.prototype), "render", this).call(this, renderMode),
            display = _get$call.display,
            originX = _get$call.originX,
            originY = _get$call.originY,
            stroke = _get$call.stroke,
            strokeWidth = _get$call.strokeWidth,
            strokeDasharray = _get$call.strokeDasharray;

        if (display === 'none') {
          return;
        }

        var width = this.width,
            height = this.height,
            ctx = this.ctx,
            x1 = this.x1,
            y1 = this.y1,
            x2 = this.x2,
            y2 = this.y2,
            controlA = this.controlA,
            controlB = this.controlB;
        x1 = originX + x1 * width;
        y1 = originY + y1 * height;
        x2 = originX + x2 * width;
        y2 = originY + y2 * height;
        var curve = 0; // 控制点，曲线

        var cx1, cy1, cx2, cy2;

        if (controlA.length === 2) {
          curve++;
          cx1 = originX + controlA[0] * width;
          cy1 = originY + controlA[1] * height;
        }

        if (controlB.length === 2) {
          curve += 2;
          cx2 = originX + controlB[0] * width;
          cy2 = originY + controlB[1] * height;
        }

        if (renderMode === mode.CANVAS) {
          ctx.strokeStyle = stroke;
          ctx.lineWidth = strokeWidth;
          ctx.setLineDash(strokeDasharray);
          ctx.beginPath();
          ctx.moveTo(x1, y1);

          if (curve === 3) {
            ctx.bezierCurveTo(cx1, cy1, cx2, cy2, x2, y2);
          } else if (curve === 2) {
            ctx.quadraticCurveTo(cx2, cy2, x2, y2);
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
          var d;

          if (curve === 3) {
            d = "M".concat(x1, " ").concat(y1, " C").concat(cx1, " ").concat(cy1, " ").concat(cx2, " ").concat(cy2, " ").concat(x2, " ").concat(y2);
          } else if (curve === 2) {
            d = "M".concat(x1, " ").concat(y1, " Q").concat(cx2, " ").concat(cy2, " ").concat(x2, " ").concat(y2);
          } else if (curve === 1) {
            d = "M".concat(x1, " ").concat(y1, " Q").concat(cx1, " ").concat(cy1, " ").concat(x2, " ").concat(y2);
          } else {
            d = "M".concat(x1, " ").concat(y1, " L").concat(x2, " ").concat(y2);
          }

          this.addGeom('path', [['d', d], ['fill', 'none'], ['stroke', stroke], ['stroke-width', strokeWidth], ['stroke-dasharray', strokeDasharray]]);
        }
      }
    }, {
      key: "x1",
      get: function get() {
        return this.__x1;
      }
    }, {
      key: "y1",
      get: function get() {
        return this.__y1;
      }
    }, {
      key: "x2",
      get: function get() {
        return this.__x2;
      }
    }, {
      key: "y2",
      get: function get() {
        return this.__y2;
      }
    }, {
      key: "controlA",
      get: function get() {
        return this.__controlA;
      }
    }, {
      key: "controlB",
      get: function get() {
        return this.__controlB;
      }
    }]);

    return Line;
  }(Geom);

  var Polyline =
  /*#__PURE__*/
  function (_Geom) {
    _inherits(Polyline, _Geom);

    function Polyline(tagName, props) {
      var _this;

      _classCallCheck(this, Polyline);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Polyline).call(this, tagName, props)); // 折线所有点的列表

      _this.__points = [];

      if (Array.isArray(_this.props.points)) {
        _this.__points = _this.props.points;
      } // 原点位置，4个角，默认左下


      if (['TOP_LEFT', 'TOP_RIGHT', 'BOTTOM_LEFT', 'BOTTOM_RIGHT'].indexOf(_this.props.origin) > -1) {
        _this.__origin = _this.props.origin;
      } else {
        _this.__origin = 'TOP_LEFT';
      }

      return _this;
    }

    _createClass(Polyline, [{
      key: "render",
      value: function render(renderMode) {
        var _get$call = _get(_getPrototypeOf(Polyline.prototype), "render", this).call(this, renderMode),
            originX = _get$call.originX,
            originY = _get$call.originY,
            display = _get$call.display,
            stroke = _get$call.stroke,
            strokeWidth = _get$call.strokeWidth,
            strokeDasharray = _get$call.strokeDasharray;

        if (display === 'none') {
          return;
        }

        var width = this.width,
            height = this.height,
            ctx = this.ctx,
            points = this.points,
            origin = this.origin;

        if (points.length < 2) {
          return;
        }

        for (var i = 0, len = points.length; i < len; i++) {
          if (!Array.isArray(points[i]) || points[i].length < 2) {
            return;
          }
        }

        var pts = this.__pts = [];

        if (origin === 'TOP_LEFT') {
          points.forEach(function (item) {
            pts.push([originX + item[0] * width, originY + item[1] * height]);
          });
        } else if (origin === 'TOP_RIGHT') {
          points.forEach(function (item) {
            pts.push([originX + width - item[0] * width, originY + item[1] * height]);
          });
        } else if (origin === 'BOTTOM_LEFT') {
          points.forEach(function (item) {
            pts.push([originX + item[0] * width, originY + height - item[1] * height]);
          });
        } else if (origin === 'BOTTOM_RIGHT') {
          points.forEach(function (item) {
            pts.push([originX + width - item[0] * width, originY + height - item[1] * height]);
          });
        }

        if (renderMode === mode.CANVAS) {
          ctx.strokeStyle = stroke;
          ctx.lineWidth = strokeWidth;
          ctx.setLineDash(strokeDasharray);
          ctx.beginPath();
          ctx.moveTo(pts[0][0], pts[0][1]);

          for (var _i = 1, _len = pts.length; _i < _len; _i++) {
            var point = pts[_i];
            ctx.lineTo(point[0], point[1]);
          }

          if (strokeWidth > 0) {
            ctx.stroke();
          }

          ctx.closePath();
        } else if (renderMode === mode.SVG) {
          var _points = '';

          for (var _i2 = 0, _len2 = pts.length; _i2 < _len2; _i2++) {
            var _point = pts[_i2];
            _points += "".concat(_point[0], ",").concat(_point[1], " ");
          }

          this.addGeom('polyline', [['points', _points], ['fill', 'none'], ['stroke', stroke], ['stroke-width', strokeWidth], ['stroke-dasharray', strokeDasharray]]);
        }
      }
    }, {
      key: "points",
      get: function get() {
        return this.__points;
      }
    }, {
      key: "origin",
      get: function get() {
        return this.__origin;
      }
    }]);

    return Polyline;
  }(Geom);

  var Polygon =
  /*#__PURE__*/
  function (_Geom) {
    _inherits(Polygon, _Geom);

    function Polygon(tagName, props) {
      var _this;

      _classCallCheck(this, Polygon);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Polygon).call(this, tagName, props)); // 所有点的列表

      _this.__points = [];

      if (Array.isArray(_this.props.points)) {
        _this.__points = _this.props.points;
      }

      return _this;
    }

    _createClass(Polygon, [{
      key: "render",
      value: function render(renderMode) {
        var _get$call = _get(_getPrototypeOf(Polygon.prototype), "render", this).call(this, renderMode),
            originX = _get$call.originX,
            originY = _get$call.originY,
            display = _get$call.display,
            fill = _get$call.fill,
            stroke = _get$call.stroke,
            strokeWidth = _get$call.strokeWidth,
            strokeDasharray = _get$call.strokeDasharray;

        if (display === 'none') {
          return;
        }

        var width = this.width,
            height = this.height,
            ctx = this.ctx,
            points = this.points;

        if (points.length < 3) {
          return;
        }

        for (var i = 0, len = points.length; i < len; i++) {
          if (!Array.isArray(points[i]) || points[i].length < 2) {
            return;
          }
        }

        points.forEach(function (item) {
          item[0] = originX + item[0] * width;
          item[1] = originY + item[1] * height;
        });

        if (renderMode === mode.CANVAS) {
          ctx.strokeStyle = stroke;
          ctx.lineWidth = strokeWidth;
          ctx.fillStyle = fill;
          ctx.setLineDash(strokeDasharray);
          ctx.beginPath();
          ctx.moveTo(points[0][0], points[0][1]);

          for (var _i = 1, _len = points.length; _i < _len; _i++) {
            var point = points[_i];
            ctx.lineTo(point[0], point[1]);
          }

          ctx.lineTo(points[0][0], points[0][1]);
          ctx.fill();

          if (strokeWidth > 0) {
            ctx.stroke();
          }

          ctx.closePath();
        } else if (renderMode === mode.SVG) {
          var pts = '';

          for (var _i2 = 0, _len2 = points.length; _i2 < _len2; _i2++) {
            var _point = points[_i2];
            pts += "".concat(_point[0], ",").concat(_point[1], " ");
          }

          this.addGeom('polygon', [['points', pts], ['fill', fill], ['stroke', stroke], ['stroke-width', strokeWidth], ['stroke-dasharray', strokeDasharray]]);
        }
      }
    }, {
      key: "points",
      get: function get() {
        return this.__points;
      }
    }]);

    return Polygon;
  }(Geom);

  var OFFSET = Math.PI * 0.5;

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

  var Sector =
  /*#__PURE__*/
  function (_Geom) {
    _inherits(Sector, _Geom);

    function Sector(tagName, props) {
      var _this;

      _classCallCheck(this, Sector);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Sector).call(this, tagName, props)); // 角度

      _this.__begin = 0;
      _this.__end = 0;

      if (_this.props.begin) {
        _this.__begin = parseFloat(_this.props.begin);

        if (isNaN(_this.begin)) {
          _this.__begin = 0;
        }
      }

      if (_this.props.end) {
        _this.__end = parseFloat(_this.props.end);

        if (isNaN(_this.end)) {
          _this.__end = 0;
        }
      } // 半径0~1，默认1


      _this.__r = 1;

      if (_this.props.r) {
        _this.__r = parseFloat(_this.props.r);

        if (isNaN(_this.r)) {
          _this.__r = 1;
        }
      } // 扇形两侧是否有边


      _this.__edge = false;

      if (_this.props.edge !== undefined) {
        _this.__edge = !!_this.props.edge;
      }

      return _this;
    }

    _createClass(Sector, [{
      key: "render",
      value: function render(renderMode) {
        var _get$call = _get(_getPrototypeOf(Sector.prototype), "render", this).call(this, renderMode),
            cx = _get$call.cx,
            cy = _get$call.cy,
            display = _get$call.display,
            fill = _get$call.fill,
            stroke = _get$call.stroke,
            strokeWidth = _get$call.strokeWidth,
            strokeDasharray = _get$call.strokeDasharray;

        if (display === 'none') {
          return;
        }

        var width = this.width,
            height = this.height,
            ctx = this.ctx,
            begin = this.begin,
            end = this.end,
            r = this.r;

        if (begin === end) {
          return;
        }

        r *= Math.min(width, height) * 0.5;
        var x1, y1, x2, y2;

        var _getCoordsByDegree = getCoordsByDegree(cx, cy, r, begin);

        var _getCoordsByDegree2 = _slicedToArray(_getCoordsByDegree, 2);

        x1 = _getCoordsByDegree2[0];
        y1 = _getCoordsByDegree2[1];

        var _getCoordsByDegree3 = getCoordsByDegree(cx, cy, r, end);

        var _getCoordsByDegree4 = _slicedToArray(_getCoordsByDegree3, 2);

        x2 = _getCoordsByDegree4[0];
        y2 = _getCoordsByDegree4[1];

        if (renderMode === mode.CANVAS) {
          ctx.strokeStyle = stroke;
          ctx.lineWidth = strokeWidth;
          ctx.fillStyle = fill;
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
          var large = end - begin > 180 ? 1 : 0;

          if (this.edge) {
            this.addGeom('path', [['d', "M".concat(cx, " ").concat(cy, " L").concat(x1, " ").concat(y1, " A").concat(r, " ").concat(r, " 0 ").concat(large, " 1 ").concat(x2, " ").concat(y2, " z")], ['fill', fill], ['stroke', stroke], ['stroke-width', strokeWidth], ['stroke-dasharray', strokeDasharray]]);
          } else {
            this.addGeom('path', [['d', "M".concat(cx, " ").concat(cy, " L").concat(x1, " ").concat(y1, " A").concat(r, " ").concat(r, " 0 ").concat(large, " 1 ").concat(x2, " ").concat(y2, " z")], ['fill', fill]]);
            this.addGeom('path', [['d', "M".concat(x1, " ").concat(y1, " A").concat(r, " ").concat(r, " 0 ").concat(large, " 1 ").concat(x2, " ").concat(y2)], ['fill', 'transparent'], ['stroke', stroke], ['stroke-width', strokeWidth], ['stroke-dasharray', strokeDasharray]]);
          }
        }
      }
    }, {
      key: "begin",
      get: function get() {
        return this.__begin;
      }
    }, {
      key: "end",
      get: function get() {
        return this.__end;
      }
    }, {
      key: "r",
      get: function get() {
        return this.__r;
      }
    }, {
      key: "edge",
      get: function get() {
        return this.__edge;
      }
    }]);

    return Sector;
  }(Geom);

  var Rect =
  /*#__PURE__*/
  function (_Geom) {
    _inherits(Rect, _Geom);

    function Rect(tagName, props) {
      _classCallCheck(this, Rect);

      return _possibleConstructorReturn(this, _getPrototypeOf(Rect).call(this, tagName, props));
    }

    _createClass(Rect, [{
      key: "render",
      value: function render(renderMode) {
        var _get$call = _get(_getPrototypeOf(Rect.prototype), "render", this).call(this, renderMode),
            originX = _get$call.originX,
            originY = _get$call.originY,
            display = _get$call.display,
            fill = _get$call.fill,
            stroke = _get$call.stroke,
            strokeWidth = _get$call.strokeWidth,
            strokeDasharray = _get$call.strokeDasharray;

        if (display === 'none') {
          return;
        }

        var width = this.width,
            height = this.height,
            ctx = this.ctx;

        if (renderMode === mode.CANVAS) {
          ctx.strokeStyle = stroke;
          ctx.lineWidth = strokeWidth;
          ctx.fillStyle = fill;
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
          this.addGeom('rect', [['x', originX], ['y', originY], ['width', width], ['height', height], ['fill', fill], ['stroke', stroke], ['stroke-width', strokeWidth], ['stroke-dasharray', strokeDasharray]]);
        }
      }
    }]);

    return Rect;
  }(Geom);

  var Circle =
  /*#__PURE__*/
  function (_Geom) {
    _inherits(Circle, _Geom);

    function Circle(tagName, props) {
      var _this;

      _classCallCheck(this, Circle);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Circle).call(this, tagName, props)); // 半径0~1，默认1

      _this.__r = 1;

      if (_this.props.r) {
        _this.__r = parseFloat(_this.props.r);

        if (isNaN(_this.r)) {
          _this.__r = 1;
        }
      }

      return _this;
    }

    _createClass(Circle, [{
      key: "render",
      value: function render(renderMode) {
        var _get$call = _get(_getPrototypeOf(Circle.prototype), "render", this).call(this, renderMode),
            cx = _get$call.cx,
            cy = _get$call.cy,
            display = _get$call.display,
            fill = _get$call.fill,
            stroke = _get$call.stroke,
            strokeWidth = _get$call.strokeWidth,
            strokeDasharray = _get$call.strokeDasharray;

        if (display === 'none') {
          return;
        }

        var width = this.width,
            height = this.height,
            ctx = this.ctx,
            r = this.r;
        r *= Math.min(width, height) * 0.5;

        if (renderMode === mode.CANVAS) {
          ctx.strokeStyle = stroke;
          ctx.lineWidth = strokeWidth;
          ctx.fillStyle = fill;
          ctx.setLineDash(strokeDasharray);
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, 2 * Math.PI);
          ctx.fill();

          if (strokeWidth > 0) {
            ctx.stroke();
          }

          ctx.closePath();
        } else if (renderMode === mode.SVG) {
          this.addGeom('circle', [['cx', cx], ['cy', cy], ['r', r], ['fill', fill], ['stroke', stroke], ['stroke-width', strokeWidth], ['stroke-dasharray', strokeDasharray]]);
        }
      }
    }, {
      key: "r",
      get: function get() {
        return this.__r;
      }
    }]);

    return Circle;
  }(Geom);

  var Ellipse =
  /*#__PURE__*/
  function (_Geom) {
    _inherits(Ellipse, _Geom);

    function Ellipse(tagName, props) {
      var _this;

      _classCallCheck(this, Ellipse);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Ellipse).call(this, tagName, props)); // 半径0~1，默认1

      _this.__xr = 1;

      if (_this.props.rx) {
        _this.__xr = parseFloat(_this.props.rx);

        if (isNaN(_this.xr)) {
          _this.__xr = 1;
        }
      }

      _this.__yr = 1;

      if (_this.props.ry) {
        _this.__yr = parseFloat(_this.props.ry);

        if (isNaN(_this.yr)) {
          _this.__yr = 1;
        }
      }

      return _this;
    }

    _createClass(Ellipse, [{
      key: "render",
      value: function render(renderMode) {
        var _get$call = _get(_getPrototypeOf(Ellipse.prototype), "render", this).call(this, renderMode),
            cx = _get$call.cx,
            cy = _get$call.cy,
            display = _get$call.display,
            fill = _get$call.fill,
            stroke = _get$call.stroke,
            strokeWidth = _get$call.strokeWidth,
            strokeDasharray = _get$call.strokeDasharray;

        if (display === 'none') {
          return;
        }

        var width = this.width,
            height = this.height,
            ctx = this.ctx,
            xr = this.xr,
            yr = this.yr;
        xr *= width * 0.5;
        yr *= height * 0.5;

        if (renderMode === mode.CANVAS) {
          ctx.strokeStyle = stroke;
          ctx.lineWidth = strokeWidth;
          ctx.fillStyle = fill;
          ctx.setLineDash(strokeDasharray);
          ctx.beginPath();
          ctx.ellipse && ctx.ellipse(cx, cy, xr, yr, 0, 0, 2 * Math.PI);
          ctx.fill();

          if (strokeWidth > 0) {
            ctx.stroke();
          }

          ctx.closePath();
        } else if (renderMode === mode.SVG) {
          this.addGeom('ellipse', [['cx', cx], ['cy', cy], ['rx', xr], ['ry', yr], ['fill', fill], ['stroke', stroke], ['stroke-width', strokeWidth], ['stroke-dasharray', strokeDasharray]]);
        }
      }
    }, {
      key: "xr",
      get: function get() {
        return this.__xr;
      }
    }, {
      key: "yr",
      get: function get() {
        return this.__yr;
      }
    }]);

    return Ellipse;
  }(Geom);

  Geom.register('$line', Line);
  Geom.register('$polyline', Polyline);
  Geom.register('$polygon', Polygon);
  Geom.register('$sector', Sector);
  Geom.register('$rect', Rect);
  Geom.register('$circle', Circle);
  Geom.register('$ellipse', Ellipse);
  var karas = {
    render: function render(root, dom) {
      if (!(root instanceof Root)) {
        throw new Error('render root muse be canvas or svg');
      }

      if (dom) {
        root.appendTo(dom);
      }

      return root;
    },
    createVd: function createVd(tagName, props, children) {
      if (['canvas', 'svg'].indexOf(tagName) > -1) {
        return new Root(tagName, props, children);
      }

      if (Dom.isValid(tagName)) {
        return new Dom(tagName, props, children);
      }

      throw new Error('can not use marker: ' + tagName);
    },
    createGm: function createGm(tagName, props) {
      var klass = Geom.getRegister(tagName);
      return new klass(tagName, props);
    },
    createCp: function createCp(cp, props, children) {
      return new cp(props, children);
    },
    Geom: Geom,
    mode: mode,
    Component: Component,
    Event: Event
  };

  if (typeof window != 'undefined') {
    window.karas = karas;
  }

  return karas;

}));
//# sourceMappingURL=index.js.map
