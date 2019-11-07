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
      this.__computedStyle = {}; // 计算为绝对值的样式

      this.__baseLine = 0;
      this.__virtualDom = {};
      this.__host = null;
    }

    _createClass(Node, [{
      key: "__offsetX",
      value: function __offsetX(diff, isLayout) {
        if (isLayout) {
          this.__x += diff;
        } else {
          this.__ox += diff;
        }
      }
    }, {
      key: "__offsetY",
      value: function __offsetY(diff, isLayout) {
        if (isLayout) {
          this.__y += diff;
        } else {
          this.__oy += diff;
        }
      }
    }, {
      key: "__destroy",
      value: function __destroy() {
        this.__isDestroyed = true;
        this.__prev = this.__next = this.__ctx = this.__defs = this.__parent = this.__host = null;
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
        if (this.__host) {
          return this.__host;
        }

        if (this.parent) {
          return this.parent.host;
        }
      }
    }, {
      key: "style",
      get: function get() {
        return this.__style;
      }
    }, {
      key: "computedStyle",
      get: function get() {
        return this.__computedStyle;
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
    }, {
      key: "isDestroyed",
      get: function get() {
        return this.__isDestroyed;
      }
    }]);

    return Node;
  }();

  var mode = {
    CANVAS: 0,
    SVG: 1
  };

  var unit = {
    AUTO: 0,
    PX: 1,
    PERCENT: 2,
    POSITION: 3,
    NUMBER: 4,
    INHERIT: 5,
    DEG: 6
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
    if (vd.type === 'item' || vd.type === 'img') {
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
      _s2 += '</g><g';

      if (vd.props) {
        vd.props.forEach(function (item) {
          _s2 += " ".concat(item[0], "=\"").concat(item[1], "\"");
        });
      }

      _s2 += '>';
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

      res[3] = 1;
    } else if (color === 'transparent') {
      return [0, 0, 0, 0];
    } else {
      var c = color.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)/i);

      if (c) {
        res = [parseInt(c[1]), parseInt(c[2]), parseInt(c[3])];

        if (c[4]) {
          res[3] = parseFloat(c[4]);
        } else {
          res[3] = 1;
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

    if (util.isDate(obj)) {
      return new Date(obj);
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
    var _transformOrigin = _slicedToArray(transformOrigin, 2),
        ox = _transformOrigin[0],
        oy = _transformOrigin[1];

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
      } else if (k === 'matrix') {
        res.push([item[0], item[1]]);
      } else {
        res.push([item[0], item[1].value]);
      }
    });
    return res;
  }

  function calOrigin(transformOrigin, x, y, w, h) {
    var tfo = [];
    transformOrigin.forEach(function (item, i) {
      if (item.unit === unit.PX) {
        tfo.push(item.value);
      } else if (item.unit === unit.PERCENT) {
        tfo.push((i ? y : x) + item.value * (i ? h : w) * 0.01);
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

  var transform = {
    calMatrix: calMatrix,
    calOrigin: calOrigin,
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

  function quickSort(arr, begin, end, compare) {
    if (begin >= end) {
      return;
    }

    var i = begin,
        j = end,
        p = i,
        v = arr[p],
        seq = true;

    while (i < j) {
      if (seq) {
        for (; i < j; j--) {
          if (compare.call(arr, v, arr[j])) {
            swap(arr, p, j);
            p = j;
            seq = !seq;
            i++;
            break;
          }
        }
      } else {
        for (; i < j; i++) {
          if (compare.call(arr, arr[i], v)) {
            swap(arr, p, i);
            p = i;
            seq = !seq;
            j--;
            break;
          }
        }
      }
    }

    quickSort(arr, begin, p - 1, compare);
    quickSort(arr, p + 1, end, compare);
  }

  function swap(arr, a, b) {
    var temp = arr[a];
    arr[a] = arr[b];
    arr[b] = temp;
  }

  function sort (arr, compare) {
    if (!Array.isArray(arr) || arr.length < 2) {
      return arr;
    }

    compare = compare || function () {};

    quickSort(arr, 0, arr.length - 1, compare);
    return arr;
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
    } else if (v === 'inherit') {
      obj[k] = {
        unit: unit.INHERIT
      };
    } else if (/px$/.test(v)) {
      v = parseFloat(v) || 0;
      obj[k] = {
        value: v,
        unit: unit.PX
      };
    } else if (/%$/.test(v)) {
      // border不支持百分比
      if (k.toString().indexOf('border') === 0 || k.toString() === 'strokeWidth') {
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

  function normalize$1(style, reset) {
    // 默认reset
    if (reset) {
      reset.forEach(function (item) {
        if (!style.hasOwnProperty(item.k)) {
          style[item.k] = item.v;
        }
      });
    }

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
            transform.push(['scaleX', {
              value: parseFloat(v) || 0,
              unit: unit.NUMBER
            }]);
          } else if (k === 'scaleY') {
            transform.push(['scaleY', {
              value: parseFloat(v) || 0,
              unit: unit.NUMBER
            }]);
          } else if (k === 'scale') {
            var _arr4 = v.split(/\s*,\s*/);

            var x = parseFloat(_arr4[0]) || 0;
            var y = parseFloat(_arr4[_arr4.length - 1]) || 0;
            transform.push(['scaleX', {
              value: x,
              unit: unit.NUMBER
            }]);
            transform.push(['scaleY', {
              value: y,
              unit: unit.NUMBER
            }]);
          } else if (k === 'rotateZ' || k === 'rotate') {
            transform.push(['rotateZ', {
              value: parseFloat(v) || 0,
              unit: unit.DEG
            }]);
          } else if (k === 'skewX') {
            transform.push(['skewX', {
              value: parseFloat(v) || 0,
              unit: unit.DEG
            }]);
          } else if (k === 'skewY') {
            transform.push(['skewY', {
              value: parseFloat(v) || 0,
              unit: unit.DEG
            }]);
          } else if (k === 'skew') {
            var _arr5 = v.split(/\s*,\s*/);

            var _x = parseFloat(_arr5[0]) || 0;

            var _y = parseFloat(_arr5[_arr5.length - 1]) || 0;

            transform.push(['skewX', {
              value: _x,
              unit: unit.DEG
            }]);
            transform.push(['skewY', {
              value: _y,
              unit: unit.DEG
            }]);
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
              value: {
                top: 0,
                left: 0,
                center: 50,
                right: 100,
                bottom: 100
              }[item],
              unit: unit.PERCENT
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

    ['marginTop', 'marginRight', 'marginBottom', 'marginLeft', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'top', 'right', 'bottom', 'left', 'width', 'height', 'flexBasis', 'fontSize', 'strokeWidth'].forEach(function (k) {
      var v = style[k];

      if (!style.hasOwnProperty(k)) {
        return;
      }

      calUnit(style, k, v);
    });
    temp = style.fontWeight;

    if (temp || temp === 0) {
      if (temp === 'bold') {
        style.fontWeight = 700;
      } else if (temp === 'normal') {
        style.fontWeight = 400;
      } else if (temp === 'lighter') {
        style.fontWeight = 200;
      } else if (temp !== 'inherit') {
        style.fontWeight = parseInt(temp) || 400;
      }
    }

    temp = style.lineHeight;

    if (temp || temp === 0) {
      if (temp === 'inherit') {
        style.lineHeight = {
          unit: unit.INHERIT
        };
      }

      if (temp === 'normal') {
        style.lineHeight = {
          unit: unit.AUTO
        };
      } else if (/px$/.test(temp)) {
        style.lineHeight = {
          value: parseFloat(temp),
          unit: unit.PX
        };
      } else {
        var n = parseFloat(temp) || 'normal'; // 非法数字

        if (n === 'normal') {
          style.lineHeight = {
            unit: unit.AUTO
          };
        } else {
          style.lineHeight = {
            value: n,
            unit: unit.NUMBER
          };
        }
      }
    }

    temp = style.strokeDasharray;

    if (temp) {
      var _match4 = temp.toString().match(/[\d.]+/g);

      if (_match4) {
        style.strokeDasharray = _match4.join(', ');
      } else {
        style.strokeDasharray = '';
      }
    }

    return style;
  }

  function computedFontSize(computedStyle, fontSize, parentComputedStyle, isRoot) {
    if (fontSize.unit === unit.INHERIT) {
      computedStyle.fontSize = isRoot ? 16 : parentComputedStyle.fontSize;
    } else if (fontSize.unit === unit.PX) {
      computedStyle.fontSize = fontSize.value;
    } else if (fontSize.unit === unit.PERCENT) {
      computedStyle.fontSize = isRoot ? 16 * fontSize.value : parentComputedStyle.fontSize * fontSize.value;
    } else {
      computedStyle.fontSize = 16;
    }
  }

  function computed(xom, isRoot) {
    var currentStyle = xom.currentStyle;
    var fontStyle = currentStyle.fontStyle,
        fontWeight = currentStyle.fontWeight,
        fontSize = currentStyle.fontSize,
        fontFamily = currentStyle.fontFamily,
        color = currentStyle.color,
        lineHeight = currentStyle.lineHeight,
        textAlign = currentStyle.textAlign,
        strokeDasharray = currentStyle.strokeDasharray;
    var computedStyle = xom.__computedStyle = util.clone(currentStyle);
    var parent = xom.parent;
    var parentComputedStyle = parent && parent.computedStyle; // 处理继承的属性

    if (fontStyle === 'inherit') {
      computedStyle.fontStyle = isRoot ? 'normal' : parentComputedStyle.fontStyle;
    }

    if (fontWeight === 'inherit') {
      computedStyle.fontWeight = isRoot ? 400 : parentComputedStyle.fontWeight;
    }

    computedFontSize(computedStyle, fontSize, parentComputedStyle, isRoot);

    if (fontFamily === 'inherit') {
      computedStyle.fontFamily = isRoot ? 'arial' : parentComputedStyle.fontFamily;
    }

    if (color === 'inherit') {
      computedStyle.color = isRoot ? '#000' : parentComputedStyle.color;
    }

    calLineHeight(xom, lineHeight, computedStyle);

    if (textAlign === 'inherit') {
      computedStyle.textAlign = isRoot ? 'left' : parentComputedStyle.textAlign;
    } // 处理可提前计算的属性，如border百分比


    ['borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'strokeWidth'].forEach(function (k) {
      if (currentStyle.hasOwnProperty(k)) {
        var v = currentStyle[k];
        computedStyle[k] = v.value;
      }
    });
  }

  function computedAnimate(xom, computedStyle, origin, isRoot) {
    var fontSize = computedStyle.fontSize,
        lineHeight = computedStyle.lineHeight,
        top = computedStyle.top,
        right = computedStyle.right,
        bottom = computedStyle.bottom,
        left = computedStyle.left,
        width = computedStyle.width,
        height = computedStyle.height;
    var parent = xom.parent;
    var parentComputedStyle = parent && parent.computedStyle;

    if (fontSize) {
      computedFontSize(computedStyle, fontSize, parentComputedStyle, isRoot);
    }

    if (lineHeight) {
      if (!fontSize) {
        computedStyle.fontSize = origin.fontSize;
      }

      calLineHeight(xom, lineHeight, computedStyle);

      if (!fontSize) {
        delete computedStyle.fontSize;
      }
    }

    if (top) {
      calRelative(computedStyle, 'top', top, parent);
      delete computedStyle.bottom;
    } else if (bottom) {
      calRelative(computedStyle, 'bottom', bottom, parent);
      delete computedStyle.top;
    }

    if (left) {
      calRelative(computedStyle, 'left', left, parent, parentComputedStyle.width);
      delete computedStyle.right;
    } else if (right) {
      calRelative(computedStyle, 'right', right, parent, parentComputedStyle.width);
      delete computedStyle.left;
    }

    ['borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth'].forEach(function (k) {
      if (computedStyle.hasOwnProperty(k)) {
        var v = computedStyle[k];
        computedStyle[k] = v.value;
      }
    });

    if (width) {
      var v = 0;

      if (width.unit === unit.PX) {
        v = width.value;
      } else if (width.unit === unit.PERCENT) {
        v = width.value * parentComputedStyle.width * 0.01;
      }

      computedStyle.width = v;
    }

    if (height) {
      var _v = 0;

      if (height.unit === unit.PX) {
        _v = height.value;
      } else if (height.unit === unit.PERCENT) {
        _v = height.value * parentComputedStyle.height * 0.01;
      }

      computedStyle.height = _v;
    }
  }

  function setFontStyle(style) {
    var fontStyle = style.fontStyle,
        fontWeight = style.fontWeight,
        fontSize = style.fontSize,
        fontFamily = style.fontFamily;
    return "".concat(fontStyle, " ").concat(fontWeight, " ").concat(fontSize, "px/").concat(fontSize, "px ").concat(fontFamily);
  }

  function getBaseLine(style) {
    var normal = style.fontSize * font.arial.lhr;
    return (style.lineHeight - normal) * 0.5 + style.fontSize * font.arial.blr;
  }

  function calLineHeight(xom, lineHeight, computedStyle) {
    if (util.isNumber(lineHeight)) ;

    if (lineHeight.unit === unit.INHERIT) {
      var parent = xom.parent;

      if (parent) {
        var pl = parent.style.lineHeight; // 一直继承向上查找直到root

        if (pl.unit === unit.INHERIT) {
          parent = parent.parent;

          while (parent) {
            pl = parent.style.lineHeight;

            if (pl.unit !== unit.INHERIT) {
              break;
            }
          }
        }

        var parentComputedStyle = parent.computedStyle;

        if (pl.unit === unit.PX) {
          computedStyle.lineHeight = parentComputedStyle.lineHeight;
        } else if (pl.unit === unit.NUMBER) {
          computedStyle.lineHeight = Math.max(pl.value, 0) * computedStyle.fontSize;
        } else {
          computedStyle.lineHeight = calNormalLineHeight(computedStyle);
        }
      } else {
        // root的继承强制为normal
        lineHeight.unit = unit.AUTO;
        computedStyle.lineHeight = calLineHeight(computedStyle);
      }
    } // 防止为0
    else if (lineHeight.unit === unit.PX) {
        computedStyle.lineHeight = Math.max(lineHeight.value, 0) || calNormalLineHeight(computedStyle);
      } else if (lineHeight.unit === unit.NUMBER) {
        computedStyle.lineHeight = Math.max(lineHeight.value, 0) * computedStyle.fontSize || calNormalLineHeight(computedStyle);
      } // normal
      else {
          computedStyle.lineHeight = calNormalLineHeight(computedStyle);
        }
  }

  function calNormalLineHeight(computedStyle) {
    return computedStyle.fontSize * font.arial.lhr;
  }

  function calRelativePercent(n, parent, k) {
    n *= 0.01;

    while (parent) {
      var style = parent.style[k];

      if (style.unit === unit.AUTO) {
        if (k === 'width') {
          parent = parent.parent;
        } else {
          break;
        }
      } else if (style.unit === unit.PX) {
        return n * style.value;
      } else if (style.unit === unit.PERCENT) {
        n *= style.value * 0.01;
        parent = parent.parent;
      }
    }

    return n;
  }

  function calRelative(computedStyle, k, v, parent, isWidth) {
    if (util.isNumber(v)) ; else if (v.unit === unit.AUTO) {
      v = 0;
    } else if (v.unit === unit.PX) {
      v = v.value;
    } else if (v.unit === unit.PERCENT) {
      if (isWidth) {
        v = calRelativePercent(v.value, parent, 'width');
      } else {
        v = calRelativePercent(v.value, parent, 'height');
      }
    }

    return computedStyle[k] = v;
  }

  function calAbsolute(computedStyle, k, v, size) {
    if (util.isNumber(v)) ; else if (v.unit === unit.AUTO) {
      v = 0;
    } else if (v.unit === unit.PX) {
      v = v.value;
    } else if (v.unit === unit.PERCENT) {
      v = v.value * size * 0.01;
    }

    return computedStyle[k] = v;
  }

  var css = {
    normalize: normalize$1,
    computed: computed,
    computedAnimate: computedAnimate,
    setFontStyle: setFontStyle,
    getBaseLine: getBaseLine,
    calLineHeight: calLineHeight,
    calRelative: calRelative,
    calAbsolute: calAbsolute
  };

  var LineBox =
  /*#__PURE__*/
  function () {
    function LineBox(parent, x, y, w, content) {
      _classCallCheck(this, LineBox);

      this.__parent = parent;
      this.__x = x;
      this.__y = y;
      this.__width = w;
      this.__content = content;
      this.__virtualDom = {};
    }

    _createClass(LineBox, [{
      key: "render",
      value: function render(renderMode, ctx) {
        var content = this.content,
            x = this.x,
            y = this.y,
            parent = this.parent;
        var ox = parent.ox,
            oy = parent.oy,
            computedStyle = parent.computedStyle;
        y += css.getBaseLine(computedStyle);
        x += ox;
        y += oy;

        if (renderMode === mode.CANVAS) {
          ctx.fillText(content, x, y);
        } else if (renderMode === mode.SVG) {
          this.__virtualDom = {
            type: 'item',
            tagName: 'text',
            props: [['x', x], ['y', y], ['fill', computedStyle.color], ['font-family', computedStyle.fontFamily], ['font-weight', computedStyle.fontWeight], ['font-style', computedStyle.fontStyle], ['font-size', "".concat(computedStyle.fontSize, "px")]],
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
      key: "baseLine",
      get: function get() {
        return css.getBaseLine(this.parent.computedStyle);
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

  var inject = {
    measureText: function measureText(cb) {
      var _Text$MEASURE_TEXT = Text.MEASURE_TEXT,
          list = _Text$MEASURE_TEXT.list,
          data = _Text$MEASURE_TEXT.data;
      var html = '';
      var keys = [];
      var chars = [];

      for (var i in data) {
        if (data.hasOwnProperty(i)) {
          var _data$i = data[i],
              key = _data$i.key,
              style = _data$i.style,
              s = _data$i.s;

          if (s) {
            var inline = "position:absolute;font-family:".concat(style.fontFamily, ";font-size:").concat(style.fontSize, "px");

            for (var j = 0, len = s.length; j < len; j++) {
              keys.push(key);

              var _char = s.charAt(j);

              chars.push(_char);
              html += "<span style=\"".concat(inline, "\">").concat(_char.replace(/</, '&lt;'), "</span>");
            }
          }
        }
      }

      if (!html) {
        cb();
        return;
      }

      var div = document.createElement('div');
      div.style.position = 'absolute';
      div.style.left = '99999px';
      div.style.top = '-99999px';
      div.style.visibility = 'hidden';
      document.body.appendChild(div);
      div.innerHTML = html;
      var cns = div.childNodes;
      var CHAR_WIDTH_CACHE = Text.CHAR_WIDTH_CACHE,
          MEASURE_TEXT = Text.MEASURE_TEXT;

      for (var _i = 0, _len = cns.length; _i < _len; _i++) {
        var node = cns[_i];
        var _key = keys[_i];
        var _char2 = chars[_i];
        var css = window.getComputedStyle(node, null);
        CHAR_WIDTH_CACHE[_key][_char2] = parseFloat(css.width);
      }

      list.forEach(function (text) {
        return text.__measureCb();
      });
      cb();
      MEASURE_TEXT.list = [];
      MEASURE_TEXT.data = {};
      document.body.removeChild(div);
    },
    measureImg: function measureImg(url, cb) {
      var img = document.createElement('img');
      img.style.position = 'absolute';
      img.style.left = '99999px';
      img.style.top = '-99999px';
      img.style.visibility = 'hidden';

      img.onload = function () {
        cb({
          success: true,
          width: img.width,
          height: img.height,
          source: img
        });
      };

      img.onerror = function () {
        cb({
          success: false
        });
      };

      img.src = url;
    },
    warn: function warn(s) {
      console.warn(s);
    },
    requestAnimationFrame: function (_requestAnimationFrame) {
      function requestAnimationFrame(_x) {
        return _requestAnimationFrame.apply(this, arguments);
      }

      requestAnimationFrame.toString = function () {
        return _requestAnimationFrame.toString();
      };

      return requestAnimationFrame;
    }(function (cb) {
      if (typeof requestAnimationFrame !== 'undefined') {
        inject.requestAnimationFrame = requestAnimationFrame.bind(window);
        requestAnimationFrame(cb);
      } else {
        setTimeout(cb, 16.7);

        inject.requestAnimationFrame = function (cb) {
          setTimeout(cb, 16.7);
        };
      }
    }),
    now: function now() {
      if (typeof performance !== 'undefined') {
        inject.now = performance.now.bind(performance);
        return performance.now();
      }

      inject.now = Date.now.bind(Date);
      return Date.now();
    }
  };

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
    }

    _createClass(Text, [{
      key: "__measure",
      // 预先计算每个字的宽度
      value: function __measure() {
        var ctx = this.ctx,
            content = this.content,
            currentStyle = this.currentStyle,
            computedStyle = this.computedStyle,
            charWidthList = this.charWidthList,
            renderMode = this.renderMode;

        if (renderMode === mode.CANVAS) {
          ctx.font = css.setFontStyle(computedStyle);
        }

        var key = computedStyle.fontSize + ',' + computedStyle.fontFamily;
        var wait = Text.MEASURE_TEXT.data[key] = Text.MEASURE_TEXT.data[key] || {
          key: key,
          style: computedStyle,
          hash: {},
          s: []
        };
        var cache = Text.CHAR_WIDTH_CACHE[key] = Text.CHAR_WIDTH_CACHE[key] || {};
        var sum = 0;
        var needMeasure = false;

        for (var i = 0, length = content.length; i < length; i++) {
          var _char = content.charAt(i);

          var mw = void 0;

          if (cache.hasOwnProperty(_char)) {
            mw = cache[_char];
            charWidthList.push(mw);
            sum += mw;
            this.__charWidth = Math.max(this.charWidth, mw);
          } else if (renderMode === mode.CANVAS) {
            mw = cache[_char] = ctx.measureText(_char).width;
            charWidthList.push(mw);
            sum += mw;
            this.__charWidth = Math.max(this.charWidth, mw);
          } else {
            if (!wait.hash.hasOwnProperty(_char)) {
              wait.s += _char;
            } // 先预存标识位-1，测量完后替换它


            charWidthList.push(-1);
            needMeasure = true;
          }
        }

        this.__textWidth = sum;

        if (needMeasure) {
          Text.MEASURE_TEXT.list.push(this);
        }
      }
    }, {
      key: "__measureCb",
      value: function __measureCb() {
        var content = this.content,
            computedStyle = this.computedStyle,
            charWidthList = this.charWidthList;
        var key = computedStyle.fontSize + ',' + computedStyle.fontFamily;
        var cache = Text.CHAR_WIDTH_CACHE[key];
        var sum = 0;

        for (var i = 0, len = charWidthList.length; i < len; i++) {
          if (charWidthList[i] < 0) {
            var mw = charWidthList[i] = cache[content.charAt(i)];
            sum += mw;
            this.__charWidth = Math.max(this.charWidth, mw);
          }
        }

        this.__textWidth += sum;
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
        var isDestroyed = this.isDestroyed,
            content = this.content,
            currentStyle = this.currentStyle,
            computedStyle = this.computedStyle,
            lineBoxes = this.lineBoxes,
            charWidthList = this.charWidthList;

        if (isDestroyed || currentStyle.display === 'none') {
          return;
        }

        this.__ox = this.__oy = 0;
        lineBoxes.splice(0); // 顺序尝试分割字符串为lineBox，形成多行

        var begin = 0;
        var i = 0;
        var count = 0;
        var length = content.length;

        while (i < length) {
          count += charWidthList[i];

          if (count === w) {
            var lineBox = new LineBox(this, x, y, count, content.slice(begin, i + 1));
            lineBoxes.push(lineBox);
            maxX = Math.max(maxX, x + count);
            y += computedStyle.lineHeight;
            begin = i + 1;
            i = begin + 1;
            count = 0;
          } else if (count > w) {
            // 宽度不足时无法跳出循环，至少也要塞个字符形成一行
            if (i === begin) {
              i = begin + 1;
            }

            var _lineBox = new LineBox(this, x, y, count - charWidthList[i], content.slice(begin, i));

            lineBoxes.push(_lineBox);
            maxX = Math.max(maxX, x + count - charWidthList[i]);
            y += computedStyle.lineHeight;
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

          var _lineBox2 = new LineBox(this, x, y, count, content.slice(begin, length));

          lineBoxes.push(_lineBox2);
          maxX = Math.max(maxX, x + count);
          y += computedStyle.lineHeight;
        }

        this.__width = maxX - x;
        this.__height = y - data.y; // flex前置计算无需真正布局

        if (isVirtual) {
          this.__lineBoxes = [];
        } else {
          var textAlign = currentStyle.textAlign;

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
      key: "__offsetX",
      value: function __offsetX(diff, isLayout) {
        _get(_getPrototypeOf(Text.prototype), "__offsetX", this).call(this, diff, isLayout);

        if (isLayout) {
          this.lineBoxes.forEach(function (item) {
            item.__offsetX(diff);
          });
        }
      }
    }, {
      key: "__offsetY",
      value: function __offsetY(diff, isLayout) {
        _get(_getPrototypeOf(Text.prototype), "__offsetY", this).call(this, diff, isLayout);

        if (isLayout) {
          this.lineBoxes.forEach(function (item) {
            item.__offsetY(diff);
          });
        }
      }
    }, {
      key: "render",
      value: function render(renderMode) {
        var isDestroyed = this.isDestroyed,
            ctx = this.ctx,
            computedStyle = this.computedStyle;

        if (isDestroyed || computedStyle.display === 'none') {
          return;
        }

        if (renderMode === mode.CANVAS) {
          ctx.font = css.setFontStyle(computedStyle);
          ctx.fillStyle = computedStyle.color;
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
      key: "currentStyle",
      get: function get() {
        return this.style;
      }
    }, {
      key: "renderMode",
      get: function get() {
        return this.__renderMode;
      }
    }]);

    return Text;
  }(Node);

  _defineProperty(Text, "CHAR_WIDTH_CACHE", {});

  _defineProperty(Text, "MEASURE_TEXT", {
    list: [],
    data: {}
  });

  function splitClass(s) {
    s = (s || '').trim();

    if (s) {
      return s.split(/\s+/);
    }
  }

  function parse(dom, top, json) {
    if (!json) {
      return;
    }

    var list = [];
    matchSel(dom, top, json, list);
    sort(list, function (a, b) {
      var pa = a[2];
      var pb = b[2]; // 先比较优先级

      for (var i = 0; i < 3; i++) {
        if (pa[i] !== pb[i]) {
          return pa[i] > pb[i];
        }
      } // 优先级相等比较出现顺序


      return a[0] > b[0];
    });
    var res = {};

    for (var i = list.length - 1; i >= 0; i--) {
      var item = list[i];

      var _item$ = _slicedToArray(item[1], 2),
          k = _item$[0],
          v = _item$[1];

      if (!res.hasOwnProperty(k)) {
        res[k] = v;
      }
    }

    return res;
  } // 从底部往上匹配，即.a .b这样的选择器是.b->.a逆序对比


  function matchSel(dom, top, json, res) {
    var _this = this;

    var selList = combo(dom, json);
    selList.forEach(function (sel) {
      if (json.hasOwnProperty(sel)) {
        var item = json[sel]; // 还未到根节点需继续向上，注意可以递归向上，多层级时需递归所有父层级组合

        var parent = dom.parent;

        while (parent) {
          matchSel(parent, top, item, res);
          parent = parent.parent;
        } // 将当前层次的值存入


        if (item.hasOwnProperty('_v')) {
          dealStyle(res, item);
        } // 父子选择器


        if (item.hasOwnProperty('_>')) {
          var parentStyle = item['_>'];
          matchSel(dom.parent, _this, parentStyle, res);
        } // 相邻兄弟选择器


        if (item.hasOwnProperty('_+')) {
          var sibling = item['_+'];
          var prev = dom.prev;

          if (prev && !(prev instanceof Text)) {
            var prevSelList = combo(prev, sibling);
            var hash = arr2hash$1(prevSelList);
            Object.keys(sibling).forEach(function (k) {
              var item2 = sibling[k]; // 有值且兄弟选择器命中时存入结果

              if (item2.hasOwnProperty('_v') && hash.hasOwnProperty(k)) {
                dealStyle(res, item2);
              }
            });
          }
        } // 兄弟选择器，不一定相邻，一直往前找


        if (item.hasOwnProperty('_~')) {
          (function () {
            var sibling = item['_~'];
            var prev = dom.prev;

            var _loop = function _loop() {
              if (prev instanceof Text) {
                prev = prev.prev;
                return "continue";
              }

              var prevSelList = combo(prev, sibling);
              var hash = arr2hash$1(prevSelList);
              Object.keys(sibling).forEach(function (k) {
                var item2 = sibling[k]; // 有值且兄弟选择器命中时存入结果

                if (item2.hasOwnProperty('_v') && hash.hasOwnProperty(k)) {
                  dealStyle(res, item2);
                }
              });
              prev = prev.prev;
            };

            while (prev) {
              var _ret = _loop();

              if (_ret === "continue") continue;
            }
          })();
        }
      }
    });
  } // 组合出dom的所有sel可能


  function combo(dom, json) {
    var klass = dom["class"],
        tagName = dom.tagName,
        id = dom.id;
    klass = klass.slice();
    sort(klass, function (a, b) {
      return a > b;
    });
    var ks = [];

    if (klass.length) {
      comboClass(klass, ks, klass.length, 0);
    } // 各种*的情况标识，只有存在时才放入sel组合，可以减少循环次数


    var hasStarClass = json.hasOwnProperty('_*.');
    var hasStarId = json.hasOwnProperty('_*#');
    var hasStarIdClass = json.hasOwnProperty('_*.#');
    var res = [tagName]; // 只有当前有_*时说明有*才匹配

    if (json.hasOwnProperty('_*')) {
      res.push('*');
    }

    if (id) {
      id = '#' + id;
      res.push(id);
      res.push(tagName + id);

      if (hasStarId) {
        res.push('*' + id);
      }
    }

    ks.forEach(function (klass) {
      res.push(klass);
      res.push(tagName + klass);

      if (hasStarClass) {
        res.push('*' + klass);
      }

      if (id) {
        res.push(klass + id);
        res.push(tagName + klass + id);

        if (hasStarIdClass) {
          res.push('*' + klass + id);
        }
      }
    });
    return res;
  } // 组合出klass里多个的可能，如.b.a和.c.b.a，注意有排序，可以使得相等比较更容易


  function comboClass(arr, res, len, i) {
    if (len - i > 1) {
      comboClass(arr, res, len, i + 1);

      for (var j = 0, len2 = res.length; j < len2; j++) {
        res.push(res[j] + '.' + arr[i]);
      }
    }

    res.push('.' + arr[i]);
  }

  function dealStyle(res, item) {
    item._v.forEach(function (style) {
      style[2] = item._p;
      res.push(style);
    });
  }

  function arr2hash$1(arr) {
    var hash = {};
    arr.forEach(function (item) {
      hash[item] = true;
    });
    return hash;
  }

  function mergeCss(a, b) {
    if (!b) {
      return a;
    }

    if (!a) {
      return b;
    }

    for (var i in b) {
      if (b.hasOwnProperty(i)) {
        var o = b[i];
        var flag = {
          _v: true,
          _p: true
        }.hasOwnProperty(i);

        if (!flag && _typeof(o) === 'object' && a.hasOwnProperty(i)) {
          a[i] = mergeCss(a[i], o);
        } else {
          a[i] = o;
        }
      }
    }

    return a;
  }

  var match = {
    parse: parse,
    splitClass: splitClass,
    mergeCss: mergeCss
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
        if (!util.isFunction(handle)) {
          return;
        }

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
                var cb = list[_i3];

                if (util.isFunction(cb)) {
                  cb.apply(self, data);
                }
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

  _defineProperty(Event, "KARAS_REFRESH", 'karas-refresh');

  _defineProperty(Event, "KARAS_ANIMATION_PAUSE", 'karas-animation-pause');

  _defineProperty(Event, "KARAS_ANIMATION_FRAME", 'karas-animation-frame');

  _defineProperty(Event, "KARAS_ANIMATION_FINISH", 'karas-animation-finish');

  _defineProperty(Event, "KARAS_ANIMATION_CANCEL", 'karas-animation-cancel');

  var DOM = {
    position: 'static',
    display: 'block',
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
    fontSize: 'inherit',
    fontFamily: 'arial',
    color: 'inherit',
    fontStyle: 'inherit',
    fontWeight: 'inherit',
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
    width: 'auto',
    height: 'auto',
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: 'auto',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    textAlign: 'inherit',
    transformOrigin: 'center',
    visibility: 'visible'
  };
  var GEOM = {
    fill: 'transparent',
    stroke: '#000',
    strokeWidth: 1,
    strokeDasharray: '',
    strokeLinecap: 'butt'
  };
  var dom = [];

  for (var k in DOM) {
    if (DOM.hasOwnProperty(k)) {
      var v = DOM[k];
      dom.push({
        k: k,
        v: v
      });
    }
  }

  var geom = util.clone(dom);

  for (var _k in GEOM) {
    if (GEOM.hasOwnProperty(_k)) {
      var _v = GEOM[_k];
      geom.push({
        k: _k,
        v: _v
      });
    }
  }

  var reset = {
    dom: dom,
    geom: geom
  };

  var Component =
  /*#__PURE__*/
  function (_Event) {
    _inherits(Component, _Event);

    function Component(tagName, props, children) {
      var _this;

      _classCallCheck(this, Component);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Component).call(this));

      if (!util.isString(tagName)) {
        children = props;
        props = tagName;
        tagName = /(?:function|class)\s+([\w$]+)/.exec(_this.constructor.toString())[1];
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
      _this.__ref = {};
      _this.__state = {};
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
        } // 构造函数中调用还未render


        var o = this.shadowRoot;

        if (!o) {
          return;
        }

        this.__traverse(o.ctx, o.defs, this.root.renderMode);

        this.__init();

        if (this.root) {
          this.root.refreshTask(cb);
        }
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
          sr.__style = this.props.style || {};
          this.__shadowRoot = sr;
          return;
        }

        sr.__ctx = ctx;
        sr.__defs = defs;
        sr.__host = this;

        if (!sr.isGeom()) {
          sr.__traverse(ctx, defs, renderMode);
        }
      }
    }, {
      key: "__traverseCss",
      value: function __traverseCss() {
        var sr = this.__shadowRoot; // shadowDom可以设置props.css，同时host的会覆盖它

        if (!(sr instanceof Text)) {
          var m = match.mergeCss(sr.props.css, this.props.css);

          sr.__traverseCss(sr, m);
        }
      } // 组件传入的样式需覆盖shadowRoot的

    }, {
      key: "__init",
      value: function __init() {
        var _this2 = this;

        var sr = this.shadowRoot; // 返回text节点特殊处理，赋予基本样式

        if (sr instanceof Text) {
          css.normalize(sr.style, reset.dom);
        } else {
          var style = this.props.style || {};

          for (var i in style) {
            if (style.hasOwnProperty(i)) {
              sr.style[i] = style[i];
            }
          }

          sr.__init();
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


        if (this.__hasInit) {
          return;
        }

        this.__hasInit = true;
        ['x', 'y', 'ox', 'oy', 'rx', 'ry', 'width', 'height', 'outerWidth', 'outerHeight', 'style', 'computedStyle', 'ctx', 'defs', 'baseLine', 'virtualDom', 'currentStyle'].forEach(function (fn) {
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
      key: "__destroy",
      value: function __destroy() {
        if (this.shadowRoot) {
          this.shadowRoot.__destroy();
        }

        this.children.splice(0);
        this.__shadowRoot = null;
        this.__parent = null;
      }
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
      key: "animate",
      value: function animate(list, option) {
        var sr = this.shadowRoot;

        if (!(sr instanceof Text)) {
          sr.animate(list, option);
        }
      }
    }, {
      key: "__computed",
      value: function __computed(force) {
        var sr = this.shadowRoot;

        if (sr instanceof Text) {
          css.computed(sr, true);

          sr.__measure();
        } else {
          sr.__computed(force);
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
        if (this.parent) {
          return this.parent.root;
        }
      }
    }, {
      key: "parent",
      get: function get() {
        return this.__parent;
      }
    }, {
      key: "ref",
      get: function get() {
        return this.__ref;
      }
    }, {
      key: "state",
      get: function get() {
        return this.__state;
      },
      set: function set(v) {
        this.__state = v;
      }
    }]);

    return Component;
  }(Event);

  ['__layout', '__layoutAbs', '__tryLayInline', '__offsetX', '__offsetY', '__calAutoBasis', '__calMp', '__calAbs'].forEach(function (fn) {
    Component.prototype[fn] = function () {
      var sr = this.shadowRoot;

      if (sr[fn]) {
        return sr[fn].apply(sr, arguments);
      }
    };
  });

  var Frame =
  /*#__PURE__*/
  function () {
    function Frame() {
      _classCallCheck(this, Frame);

      this.__inFrame = false;
      this.__task = [];
      this.__afterFrame = [];
    }

    _createClass(Frame, [{
      key: "__init",
      value: function __init(task) {
        var self = this;

        function cb() {
          inject.requestAnimationFrame(function () {
            if (!task.length) {
              return;
            }

            self.__inFrame = true;
            task.forEach(function (handle) {
              return handle();
            });
            self.__inFrame = false;
            var afterCb = self.__afterFrame;

            if (afterCb) {
              afterCb.forEach(function (item) {
                return item();
              });
            }

            self.__afterFrame = [];

            if (!task.length) {
              return;
            }

            cb();
          });
        }

        cb();
      }
    }, {
      key: "onFrame",
      value: function onFrame(handle) {
        var task = this.task;

        if (!task.length) {
          this.__init(task);
        }

        this.task.push(handle);
      }
    }, {
      key: "offFrame",
      value: function offFrame(handle) {
        var task = this.task;

        for (var i = 0, len = task.length; i < len; i++) {
          if (task[i] === handle) {
            task.splice(i, 1);
            break;
          }
        }
      }
    }, {
      key: "nextFrame",
      value: function nextFrame(handle) {
        var self = this;

        function cb() {
          handle();
          self.offFrame(cb);
        }

        if (self.__inFrame) {
          self.__afterFrame = self.__afterFrame || [];

          self.__afterFrame.push(cb);
        } else {
          self.onFrame(cb);
        }
      }
    }, {
      key: "task",
      get: function get() {
        return this.__task;
      }
    }]);

    return Frame;
  }();

  var frame = new Frame();

  var KEY_COLOR = ['backgroundColor', 'borderBottomColor', 'borderLeftColor', 'borderRightColor', 'borderTopColor', 'color', 'fill', 'stroke'];
  var KEY_LENGTH = ['fontSize', 'borderBottomWidth', 'borderLeftWidth', 'borderRightWidth', 'borderTopWidth', 'bottom', 'left', 'right', 'top', 'flexBasis', 'width', 'height', 'lineHeight', 'marginBottom', 'marginLeft', 'marginRight', 'marginTop', 'paddingBottom', 'paddingLeft', 'paddingRight', 'paddingTop', 'strokeWidth'];
  var COLOR_HASH = {};
  KEY_COLOR.forEach(function (k) {
    COLOR_HASH[k] = true;
  });
  var LENGTH_HASH = {};
  KEY_LENGTH.forEach(function (k) {
    LENGTH_HASH[k] = true;
  }); // css模式rgb和init的颜色转换为rgba数组，方便加减运算

  function color2array(style) {
    KEY_COLOR.forEach(function (k) {
      if (!style.hasOwnProperty(k)) {
        return;
      }

      style[k] = util.rgb2int(style[k]);
    });
  } // 反向将颜色数组转换为css模式，同时计算target及其孩子的computedStyle


  function stringify$1(style, target) {
    style = util.clone(style);
    var animateStyle = target.animateStyle;
    KEY_COLOR.forEach(function (k) {
      if (style.hasOwnProperty(k)) {
        var v = style[k];

        if (v[3] === 1) {
          style[k] = "rgb(".concat(v[0], ",").concat(v[1], ",").concat(v[2], ")");
        } else {
          style[k] = "rgba(".concat(v[0], ",").concat(v[1], ",").concat(v[2], ",").concat(v[3], ")");
        }
      }
    });

    for (var i in style) {
      if (style.hasOwnProperty(i)) {
        animateStyle[i] = style[i];
      }
    }

    target.__needCompute = true;
  } // 将变化写的样式格式化，提取出offset属性，提取出变化的key，初始化变化过程的存储


  function framing(current) {
    var keys = [];
    var st = {};

    for (var i in current) {
      if (current.hasOwnProperty(i) && i !== 'offset') {
        keys.push(i);
        st[i] = current[i];
      }
    }

    return {
      style: st,
      offset: current.offset,
      keys: keys,
      transition: []
    };
  } // 计算两帧之间的差，必须都含有某个属性，单位不同的以后面为准


  function calDiff(prev, next, k, target) {
    if (!prev.hasOwnProperty(k) || !next.hasOwnProperty(k)) {
      return;
    }

    var res = {
      k: k
    };

    if (k === 'transform') {
      if (!prev[k] || !next[k]) {
        return;
      } // transform每项以[k,v]存在，新老可能每项不会都存在，顺序也未必一致，不存在的认为是0


      var pExist = {};
      prev[k].forEach(function (item) {
        pExist[item[0]] = item[1];
      });
      var nExist = {};
      next[k].forEach(function (item) {
        nExist[item[0]] = item[1];
      });
      res.v = [];
      var computedStyle = target.computedStyle;
      var key = k;
      next[k].forEach(function (item) {
        var _item = _slicedToArray(item, 2),
            k = _item[0],
            v = _item[1]; // 都存在的计算差值


        if (pExist.hasOwnProperty(k)) {
          var p = pExist[k];
          var n = nExist[k];

          if (k === 'matrix') {
            var t = [];

            for (var i = 0; i < 6; i++) {
              t[i] = n[i] - p[i];
            }

            res.v.push({
              k: k,
              v: t
            });
          } else if (p.unit === n.unit) {
            res.v.push({
              k: k,
              v: v.value - p.value
            });
          } else if (p.unit === unit.PX && n.unit === unit.PERCENT) {
            if (k === 'translateX') {
              p.value = p.value * 100 / computedStyle.width;
            } else if (k === 'translateY') {
              p.value = p.value * 100 / computedStyle.height;
            }

            p.unit = unit.PERCENT;
            res.v.push({
              k: k,
              v: n.value - p.value
            });
          } else if (p.unit === unit.PERCENT && n.unit === unit.PX) {
            if (k === 'translateX') {
              p.value = p.value * 0.01 * computedStyle.width;
            } else if (k === 'translateY') {
              p.value = p.value * 0.01 * computedStyle.width;
            }

            p.unit = unit.PX;
            res.v.push({
              k: k,
              v: n.value - p.value
            });
          }
        } // matrix老的不存在的项默认为单位矩阵
        else if (k === 'matrix') {
            var id = [1, 0, 0, 1, 0, 0];
            prev[key].push([k, id]);
            var _t = [];

            for (var _i = 0; _i < 6; _i++) {
              _t[_i] = v[_i] - id[_i];
            }

            res.v.push({
              k: k,
              v: _t
            });
          } // 老的不存在的项默认为0
          else {
              prev[key].push([k, {
                value: 0,
                unit: v.unit
              }]);
              res.v.push({
                k: k,
                v: v.value
              });
            }
      });
      prev[k].forEach(function (item) {
        var _item2 = _slicedToArray(item, 2),
            k = _item2[0],
            v = _item2[1]; // 新的不存在的项默认为0或单位矩阵


        if (!nExist.hasOwnProperty(k)) {
          if (k === 'matrix') {
            var id = [1, 0, 0, 1, 0, 0];
            next[key].push([k, id]);
            var t = [];

            for (var i = 0; i < 6; i++) {
              t[i] = id[i] - v[i];
            }

            res.v.push({
              k: k,
              v: t
            });
          } else {
            next[key].push([k, {
              value: 0,
              unit: v.unit
            }]);
            res.v.push({
              k: k,
              v: -v.value
            });
          }
        }
      });
    } else if (k === 'transformOrigin') {
      res.v = [];
      var _computedStyle = target.computedStyle;

      for (var i = 0; i < 2; i++) {
        var p = prev[k][i];
        var n = next[k][i];

        if (p.unit === n.unit) {
          res.v.push(n.value - p.value);
        } else if (p.unit === unit.PX && n.unit === unit.PERCENT) {
          p.value = p.value * 100 / _computedStyle[i ? 'outerHeight' : 'outerWidth'];
          p.unit = unit.PERCENT;
          res.v = n.value - p.value;
        } else if (p.unit === unit.PERCENT && n.unit === unit.PX) {
          p.value = p.value * 0.01 * _computedStyle[i ? 'outerHeight' : 'outerWidth'];
          p.unit = unit.PX;
          res.v = n.value - p.value;
        }
      }
    } else if (COLOR_HASH.hasOwnProperty(k)) {
      var _p = prev[k];
      var _n = next[k];
      res.v = [_n[0] - _p[0], _n[1] - _p[1], _n[2] - _p[2], _n[3] - _p[3]];
    } else if (LENGTH_HASH.hasOwnProperty(k)) {
      var _p2 = prev[k];
      var _n2 = next[k]; // auto不做动画

      if (_p2.unit === unit.AUTO || _n2.unit === unit.AUTO) {
        return;
      }

      var parentComputedStyle = (target.parent || target).computedStyle;

      if (_p2.unit === _n2.unit) {
        res.v = _n2.value - _p2.value;
      } else if (_p2.unit === unit.PX && _n2.unit === unit.PERCENT) {
        _p2.value = _p2.value * 100 / parentComputedStyle[k];
        _p2.unit = unit.PERCENT;
        res.v = _n2.value - _p2.value;
      } else if (_p2.unit === unit.PERCENT && _n2.unit === unit.PX) {
        _p2.value = _p2.value * 0.01 * parentComputedStyle[k];
        _p2.unit = unit.PX;
        res.v = _n2.value - _p2.value;
      } else {
        return;
      }
    } else {
      res.v = prev[k];
    }

    return res;
  }

  function calFrame(prev, current, target) {
    var next = framing(current);
    next.keys.forEach(function (k) {
      var ts = calDiff(prev.style, next.style, k, target); // 可以形成过渡的才会产生结果返回

      if (ts) {
        prev.transition.push(ts);
      }
    });
    return next;
  }

  function binarySearch(i, j, now, frames) {
    if (i === j) {
      var _frame = frames[i];

      if (_frame.time > now) {
        return i - 1;
      }

      return i;
    } else {
      var middle = i + (j - i >> 1);
      var _frame2 = frames[middle];

      if (_frame2.time === now) {
        return middle;
      } else if (_frame2.time > now) {
        return binarySearch(i, Math.max(middle - 1, i), now, frames);
      } else {
        return binarySearch(Math.min(middle + 1, j), j, now, frames);
      }
    }
  }

  function calStyle(frame, percent) {
    var style = util.clone(frame.style);
    frame.transition.forEach(function (item) {
      var k = item.k,
          v = item.v;

      if (k === 'transform') {
        var transform = style.transform;
        var hash = {};
        transform.forEach(function (item) {
          hash[item[0]] = item[1];
        });
        v.forEach(function (item) {
          var k = item.k,
              v = item.v;

          if (k === 'matrix') {
            for (var i = 0; i < 6; i++) {
              hash[k][i] += v[i] * percent;
            }
          } else {
            hash[k].value += v * percent;
          }
        });
      } else if (k === 'transformOrigin') {
        style[k][0].value += v[0] * percent;
        style[k][1].value += v[1] * percent;
      } // color可能超限[0,255]，但浏览器已经做了限制，无需关心
      else if (COLOR_HASH.hasOwnProperty(k)) {
          var _item3 = style[k];
          _item3[0] += v[0] * percent;
          _item3[1] += v[1] * percent;
          _item3[2] += v[2] * percent;
          _item3[3] += v[3] * percent;
        } else if (LENGTH_HASH.hasOwnProperty(k)) {
          style[k].value += v * percent;
        } else {
          style[k] = v;
        }
    });
    return style;
  }

  var Animation =
  /*#__PURE__*/
  function (_Event) {
    _inherits(Animation, _Event);

    function Animation(target, list, options) {
      var _this;

      _classCallCheck(this, Animation);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Animation).call(this));
      _this.__target = target;
      _this.__list = list || [];

      if (util.isNumber(options)) {
        _this.__options = {
          duration: options
        };
      }

      _this.__options = options || {};
      _this.__frames = [];
      _this.__startTime = 0;
      _this.__offsetTime = 0;
      _this.__pauseTime = 0;
      _this.__lastTime = 0;
      _this.__pending = false;
      _this.__playState = 'idle';
      _this.__playCount = 0;
      _this.__cb = null;
      _this.__isDestroyed = true;

      _this.__init();

      return _this;
    }

    _createClass(Animation, [{
      key: "__init",
      value: function __init() {
        var target = this.target,
            options = this.options;
        var style = util.clone(target.style);
        var duration = options.duration,
            iterations = options.iterations; // 没设置时间或非法时间或0，动画过程为空无需执行

        duration = parseFloat(duration);

        if (isNaN(duration) || duration <= 0) {
          return;
        }

        if (iterations === 'Infinity' || iterations === 'infinity') {
          iterations = Infinity;
        } else if (util.isNil(iterations)) {
          iterations = 1;
        } // 执行次数<1也无需执行


        if (iterations !== Infinity) {
          iterations = parseInt(iterations);
        }

        if (isNaN(iterations) || iterations < 1) {
          return;
        }

        options.duration = duration;
        options.iterations = iterations;
        target.__animateStyle = util.clone(style); // 转化style为计算后的绝对值结果

        color2array(style); // 过滤时间非法的，过滤后续offset<=前面的

        var list = this.list;
        var offset = -1;

        for (var i = 0, len = list.length; i < len; i++) {
          var current = list[i];

          if (current.hasOwnProperty('offset')) {
            current.offset = parseFloat(current.offset); // 超过区间[0,1]

            if (isNaN(current.offset) || current.offset < 0 || current.offset > 1) {
              list.splice(i, 1);
              i--;
              len--;
            } // <=前面的
            else if (current.offset <= offset) {
                list.splice(i, 1);
                i--;
                len--;
              } // 正常的标准化样式
              else {
                  offset = current.offset;
                  css.normalize(current);
                  color2array(current);
                }
          } else {
            css.normalize(current);
            color2array(current);
          }
        } // 必须有2帧及以上描述


        if (list.length < 2) {
          return;
        } // 首尾时间偏移强制为[0, 1]


        var first = list[0];
        first.offset = 0;
        var last = list[list.length - 1];
        last.offset = 1; // 计算没有设置offset的时间

        for (var _i2 = 1, _len = list.length; _i2 < _len; _i2++) {
          var start = list[_i2]; // 从i=1开始offset一定>0，找到下一个有offset的，均分中间无声明的

          if (!start.offset) {
            var end = void 0;
            var j = _i2 + 1;

            for (; j < _len; j++) {
              end = list[j];

              if (end.offset) {
                break;
              }
            }

            var num = j - _i2 + 1;
            start = list[_i2 - 1];
            var per = (end.offset - start.offset) / num;

            for (var k = _i2; k < j; k++) {
              var item = list[k];
              item.offset = start.offset + per * (k + 1 - _i2);
            }

            _i2 = j;
          }
        } // 换算出60fps中每一帧，为防止空间过大，不存储每一帧的数据，只存储关键帧和增量


        var frames = this.frames;
        var length = list.length;
        var prev; // 第一帧要特殊处理

        prev = framing(first);
        frames.push(prev);

        for (var _i3 = 1; _i3 < length; _i3++) {
          var next = list[_i3];
          prev = calFrame(prev, next, target);
          frames.push(prev);
        }

        this.__isDestroyed = false;
      }
    }, {
      key: "play",
      value: function play() {
        var _this2 = this;

        if (this.isDestroyed) {
          return;
        }

        this.__cancelTask();

        this.__playState = 'running'; // 从头播放还是暂停继续

        if (this.pending) {
          var now = inject.now();
          var diff = now - this.pauseTime; // 在没有performance时，防止乱改系统时间导致偏移向前，但不能防止改时间导致的偏移向后

          diff = Math.max(diff, 0);
          this.__offsetTime = diff;
        } else {
          var _this$options = this.options,
              duration = _this$options.duration,
              fill = _this$options.fill,
              fps = _this$options.fps,
              iterations = _this$options.iterations;
          var frames = this.frames,
              target = this.target,
              playCount = this.playCount;
          var length = frames.length;
          var first = true;

          this.__cb = function () {
            var now = inject.now();

            if (first) {
              _this2.__startTime = now;
              frames.forEach(function (frame) {
                frame.time = now + duration * frame.offset;
              });
            }

            var countTime = playCount * duration;
            var i = binarySearch(0, frames.length - 1, now + _this2.offsetTime - countTime, frames);
            var current = frames[i]; // 最后一帧结束动画

            if (i === length - 1) {
              stringify$1(current.style, target);
              playCount = ++_this2.playCount;

              if (iterations !== Infinity && playCount >= iterations) {
                frame.offFrame(_this2.cb);
              }
            } // 否则根据目前到下一帧的时间差，计算百分比，再反馈到变化数值上
            else {
                // 增加的fps功能，当<60时计算跳帧
                if (!util.isNumber(fps) || fps < 0) {
                  fps = 60;
                }

                if (!first && fps < 60) {
                  var time = now - _this2.lastTime;

                  if (time < 1000 / fps) {
                    return;
                  }
                }

                var total = frames[i + 1].time - current.time;

                var _diff = now - countTime - current.time;

                var percent = _diff / total;
                var style = calStyle(current, percent);
                stringify$1(style, target);
              }

            _this2.__lastTime = now;
            first = false;
            var root = target.root;

            if (root) {
              // 可能涉及字号变化，引发布局变更重新测量
              var task = _this2.__task = function () {
                _this2.emit(Event.KARAS_ANIMATION_FRAME);

                if (i === length - 1) {
                  // 没到播放次数结束时继续
                  if (iterations === Infinity || playCount < iterations) {
                    _this2.emit(Event.KARAS_ANIMATION_FINISH);

                    return;
                  }

                  _this2.__playState = 'finished'; // 停留在最后一帧，触发finish

                  if (['forwards', 'both'].indexOf(fill) > -1) {
                    _this2.emit(Event.KARAS_ANIMATION_FINISH);
                  } // 恢复初始，再刷新一帧，触发finish
                  else {
                      target.__needCompute = true;

                      var _task = _this2.__task = function () {
                        _this2.emit(Event.KARAS_ANIMATION_FINISH);
                      };

                      root.refreshTask(_task);
                    }
                }
              };

              root.refreshTask(task);
            }
          };
        } // 先执行，本次执行调用refreshTask也是下一帧再渲染，frame的每帧则是下一帧的下一帧


        this.cb();
        frame.onFrame(this.cb);
        this.__pending = false;
        return this;
      }
    }, {
      key: "pause",
      value: function pause() {
        this.__pending = true;
        this.__pauseTime = inject.now();
        this.__playState = 'paused';
        frame.offFrame(this.cb);

        this.__cancelTask();

        this.emit(Event.KARAS_ANIMATION_PAUSE);
        return this;
      }
    }, {
      key: "finish",
      value: function finish() {
        var _this3 = this;

        var fill = this.options.fill;
        frame.offFrame(this.cb);

        this.__cancelTask();

        var target = this.target;
        var root = target.root;

        if (root) {
          // 停留在最后一帧
          if (['forwards', 'both'].indexOf(fill) > -1) {
            var last = this.frames[this.frames.length - 1];
            stringify$1(last.style, this.target);
          }

          this.__playState = 'finished';
          target.__needCompute = true;

          var task = this.__task = function () {
            _this3.emit(Event.KARAS_ANIMATION_FINISH);
          };

          root.refreshTask(task);
        }

        return this;
      }
    }, {
      key: "cancel",
      value: function cancel() {
        var _this4 = this;

        frame.offFrame(this.cb);

        this.__cancelTask();

        this.__playState = 'idle';
        var target = this.target;
        var root = target.root;

        if (root) {
          target.__needCompute = true;

          var task = this.__task = function () {
            _this4.emit(Event.KARAS_ANIMATION_CANCEL);
          };

          root.refreshTask(task);
        }

        return this;
      }
    }, {
      key: "__cancelTask",
      value: function __cancelTask() {
        if (this.__task && this.target.root) {
          this.target.root.cancelRefreshTask(this.__task);
        }
      }
    }, {
      key: "__destroy",
      value: function __destroy() {
        frame.offFrame(this.cb);

        this.__cancelTask();

        this.__playState = 'idle';
        this.__isDestroyed = true;
      }
    }, {
      key: "target",
      get: function get() {
        return this.__target;
      }
    }, {
      key: "list",
      get: function get() {
        return this.__list;
      }
    }, {
      key: "options",
      get: function get() {
        return this.__options;
      }
    }, {
      key: "frames",
      get: function get() {
        return this.__frames;
      }
    }, {
      key: "startTime",
      get: function get() {
        return this.__startTime;
      }
    }, {
      key: "lastTime",
      get: function get() {
        return this.__lastTime;
      }
    }, {
      key: "pending",
      get: function get() {
        return this.__pending;
      }
    }, {
      key: "offsetTime",
      get: function get() {
        return this.__offsetTime;
      }
    }, {
      key: "pauseTime",
      get: function get() {
        return this.__pauseTime;
      }
    }, {
      key: "playState",
      get: function get() {
        return this.__playState;
      }
    }, {
      key: "playCount",
      get: function get() {
        return this.__playCount;
      },
      set: function set(v) {
        this.__playCount = v;
      }
    }, {
      key: "cb",
      get: function get() {
        return this.__cb;
      }
    }, {
      key: "isDestroyed",
      get: function get() {
        return this.__isDestroyed;
      }
    }]);

    return Animation;
  }(Event);

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

  function borderWidth(computedStyle, currentStyle) {
    ['borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth'].forEach(function (k) {
      var v = currentStyle[k];

      if (v.unit === unit.PX) {
        computedStyle[k] = v.value;
      } else {
        computedStyle[k] = 0;
      }
    });
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

      _this.__animateStyle = {}; // 动画过程中的样式

      _this.__listener = {};

      _this.__props.forEach(function (item) {
        var k = item[0];
        var v = item[1];

        if (/^on[a-zA-Z]/.test(k)) {
          k = k.slice(2).toLowerCase();
          var arr = _this.__listener[k] = _this.__listener[k] || [];
          arr.push(v);
        } else if (k === 'id' && v) {
          _this.__id = v;
        } else if (['class', 'className'].indexOf(k) > -1 && v) {
          v = match.splitClass(v);

          if (v) {
            _this.__class = v;
          }
        }
      });

      _this.__matrix = null;
      _this.__matrixEvent = null;
      _this.__animation = null;
      _this.__needCompute = true;
      return _this;
    } // 设置了css时，解析匹配


    _createClass(Xom, [{
      key: "__traverseCss",
      value: function __traverseCss(top, css) {
        if (!this.isGeom()) {
          this.children.forEach(function (item) {
            if (item instanceof Xom || item instanceof Component) {
              item.__traverseCss(top, css);
            }
          });
        } // inline拥有最高优先级


        var style = match.parse(this, top, css) || {};

        for (var i in style) {
          if (style.hasOwnProperty(i) && !this.__style.hasOwnProperty(i)) {
            this.__style[i] = style[i];
          }
        }
      }
    }, {
      key: "__measure",
      value: function __measure() {
        var children = this.children;

        if (children) {
          children.forEach(function (child) {
            if (child instanceof Xom) {
              child.__measure();
            } else if (child instanceof Component) {
              child.shadowRoot.__measure();
            } else {
              child.__measure();
            }
          });
        }
      }
    }, {
      key: "__layout",
      value: function __layout(data) {
        var w = data.w;
        var isDestroyed = this.isDestroyed,
            currentStyle = this.currentStyle,
            computedStyle = this.computedStyle;
        var display = currentStyle.display,
            width = currentStyle.width,
            marginTop = currentStyle.marginTop,
            marginRight = currentStyle.marginRight,
            marginBottom = currentStyle.marginBottom,
            marginLeft = currentStyle.marginLeft,
            paddingTop = currentStyle.paddingTop,
            paddingRight = currentStyle.paddingRight,
            paddingBottom = currentStyle.paddingBottom,
            paddingLeft = currentStyle.paddingLeft;

        if (width.unit !== unit.AUTO) {
          switch (width.unit) {
            case unit.PX:
              w = width.value;
              break;

            case unit.PERCENT:
              w *= width.value * 0.01;
              break;
          }
        }

        computedStyle.marginLeft = this.__mpWidth(marginLeft, w);
        computedStyle.marginTop = this.__mpWidth(marginTop, w);
        computedStyle.marginRight = this.__mpWidth(marginRight, w);
        computedStyle.marginBottom = this.__mpWidth(marginBottom, w);
        computedStyle.paddingLeft = this.__mpWidth(paddingLeft, w);
        computedStyle.paddingTop = this.__mpWidth(paddingTop, w);
        computedStyle.paddingRight = this.__mpWidth(paddingRight, w);
        computedStyle.paddingBottom = this.__mpWidth(paddingBottom, w);
        borderWidth(computedStyle, currentStyle);
        this.__ox = this.__oy = 0;
        this.__matrix = this.__matrixEvent = null;

        if (isDestroyed || display === 'none') {
          computedStyle.width = computedStyle.height = computedStyle.outerWidth = computedStyle.outerHeight = 0;
          return;
        }

        if (display === 'block') {
          this.__layoutBlock(data);
        } else if (display === 'flex') {
          this.__layoutFlex(data);
        } else if (display === 'inline') {
          this.__layoutInline(data);
        } // 除root节点外relative渲染时做偏移，百分比基于父元素，若父元素没有定高则为0


        if (currentStyle.position === 'relative' && this.parent) {
          var top = currentStyle.top,
              right = currentStyle.right,
              bottom = currentStyle.bottom,
              left = currentStyle.left;
          var parent = this.parent;

          if (top.unit !== unit.AUTO) {
            var n = css.calRelative(currentStyle, 'top', top, parent);

            this.__offsetY(n);

            computedStyle.top = n;
            computedStyle.bottom = 'auto';
          } else if (bottom.unit !== unit.AUTO) {
            var _n = css.calRelative(currentStyle, 'bottom', bottom, parent);

            this.__offsetY(-_n);

            computedStyle.bottom = _n;
            computedStyle.top = 'auto';
          } else {
            computedStyle.top = computedStyle.bottom = 'auto';
          }

          if (left.unit !== unit.AUTO) {
            var _n2 = css.calRelative(currentStyle, 'left', left, parent, true);

            this.__offsetX(_n2);

            computedStyle.left = _n2;
            computedStyle.right = 'auto';
          } else if (right.unit !== unit.AUTO) {
            var _n3 = css.calRelative(currentStyle, 'right', right, parent, true);

            this.__offsetX(-_n3);

            computedStyle.right = _n3;
            computedStyle.left = 'auto';
          } else {
            computedStyle.left = computedStyle.right = 'auto';
          }
        } // 计算结果存入computedStyle


        computedStyle.width = this.width;
        computedStyle.height = this.height;
        computedStyle.outerWidth = this.outerWidth;
        computedStyle.outerHeight = this.outerHeight;
      }
    }, {
      key: "isGeom",
      value: function isGeom() {
        return this.tagName.charAt(0) === '$';
      }
    }, {
      key: "isRoot",
      value: function isRoot() {
        return !this.parent;
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
      } // 预先计算是否是固定宽高，布局点位和尺寸考虑margin/border/padding

    }, {
      key: "__preLayout",
      value: function __preLayout(data) {
        var x = data.x,
            y = data.y,
            w = data.w,
            h = data.h;
        this.__x = x;
        this.__y = y;
        var currentStyle = this.currentStyle,
            computedStyle = this.computedStyle;
        var width = currentStyle.width,
            height = currentStyle.height;
        var borderTopWidth = computedStyle.borderTopWidth,
            borderRightWidth = computedStyle.borderRightWidth,
            borderBottomWidth = computedStyle.borderBottomWidth,
            borderLeftWidth = computedStyle.borderLeftWidth,
            marginTop = computedStyle.marginTop,
            marginRight = computedStyle.marginRight,
            marginBottom = computedStyle.marginBottom,
            marginLeft = computedStyle.marginLeft,
            paddingTop = computedStyle.paddingTop,
            paddingRight = computedStyle.paddingRight,
            paddingBottom = computedStyle.paddingBottom,
            paddingLeft = computedStyle.paddingLeft; // 除了auto外都是固定宽高度

        var fixedWidth;
        var fixedHeight;

        if (width.unit !== unit.AUTO) {
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

        if (height.unit !== unit.AUTO) {
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


        x += borderLeftWidth + marginLeft + paddingLeft;
        data.x = x;
        y += borderTopWidth + marginTop + paddingTop;
        data.y = y;

        if (width.unit === unit.AUTO) {
          w -= borderLeftWidth + borderRightWidth + marginLeft + marginRight + paddingLeft + paddingRight;
        }

        if (height.unit === unit.AUTO) {
          h -= borderTopWidth + borderBottomWidth + marginTop + marginBottom + paddingTop + paddingBottom;
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

        var isDestroyed = this.isDestroyed,
            ctx = this.ctx,
            currentStyle = this.currentStyle,
            computedStyle = this.computedStyle,
            width = this.width,
            height = this.height;
        var parent = this.parent;
        var matrix = [1, 0, 0, 1, 0, 0];

        while (parent) {
          if (parent.matrixEvent) {
            matrix = transform.mergeMatrix(parent.matrixEvent, matrix);
            break;
          }

          parent = parent.parent;
        } // canvas继承祖先matrix，没有则恢复默认，防止其它matrix影响；svg则要考虑事件


        if (matrix[0] !== 1 || matrix[1] !== 0 || matrix[1] !== 0 || matrix[1] !== 1 || matrix[1] !== 0 || matrix[1] !== 0) {
          if (renderMode === mode.CANVAS) {
            this.__matrix = this.__matrixEvent = matrix;
          } else if (renderMode === mode.SVG) {
            this.__matrixEvent = matrix;
          }
        }

        if (renderMode === mode.CANVAS) {
          ctx.setTransform.apply(ctx, _toConsumableArray(matrix));
        }

        var display = computedStyle.display,
            marginTop = computedStyle.marginTop,
            marginRight = computedStyle.marginRight,
            marginBottom = computedStyle.marginBottom,
            marginLeft = computedStyle.marginLeft,
            paddingTop = computedStyle.paddingTop,
            paddingRight = computedStyle.paddingRight,
            paddingBottom = computedStyle.paddingBottom,
            paddingLeft = computedStyle.paddingLeft,
            backgroundGradient = computedStyle.backgroundGradient,
            backgroundColor = computedStyle.backgroundColor,
            borderTopWidth = computedStyle.borderTopWidth,
            borderTopColor = computedStyle.borderTopColor,
            borderTopStyle = computedStyle.borderTopStyle,
            borderRightWidth = computedStyle.borderRightWidth,
            borderRightColor = computedStyle.borderRightColor,
            borderRightStyle = computedStyle.borderRightStyle,
            borderBottomWidth = computedStyle.borderBottomWidth,
            borderBottomColor = computedStyle.borderBottomColor,
            borderBottomStyle = computedStyle.borderBottomStyle,
            borderLeftWidth = computedStyle.borderLeftWidth,
            borderLeftColor = computedStyle.borderLeftColor,
            borderLeftStyle = computedStyle.borderLeftStyle,
            visibility = computedStyle.visibility;
        var transform$1 = currentStyle.transform,
            transformOrigin = currentStyle.transformOrigin; // 使用rx和ry渲染位置，考虑了relative和translate影响

        var x = this.rx,
            y = this.ry;
        var x1 = x + marginLeft;
        var x2 = x1 + borderLeftWidth;
        var x3 = x2 + width + paddingLeft + paddingRight;
        var x4 = x3 + borderRightWidth;
        var y1 = y + marginTop;
        var y2 = y1 + borderTopWidth;
        var y3 = y2 + height + paddingTop + paddingBottom;
        var y4 = y3 + borderBottomWidth;
        var iw = width + paddingLeft + paddingRight;
        var ih = height + paddingTop + paddingBottom;
        var ow = iw + marginLeft + borderLeftWidth + borderRightWidth + marginRight;
        var oh = ih + marginTop + borderTopWidth + borderBottomWidth + marginBottom;
        var tfo = transform.calOrigin(transformOrigin, x, y, ow, oh);
        computedStyle.transformOrigin = tfo; // transform相对于自身

        if (transform$1) {
          var _matrix = transform.calMatrix(transform$1, tfo, x, y, ow, oh); // 初始化有可能继承祖先的matrix


          this.__matrix = this.matrix ? transform.mergeMatrix(this.matrix, _matrix) : _matrix;
          computedStyle.transform = 'matrix(' + _matrix.join(', ') + ')';
          var _parent = this.parent;

          while (_parent) {
            if (_parent.matrixEvent) {
              _matrix = transform.mergeMatrix(_parent.matrixEvent, _matrix);
              break;
            }

            _parent = _parent.parent;
          }

          this.__matrixEvent = _matrix;

          if (renderMode === mode.CANVAS) {
            ctx.setTransform.apply(ctx, _toConsumableArray(_matrix));
          } else if (renderMode === mode.SVG) {
            this.addTransform(['matrix', this.matrix.join(',')]);
          }
        } else {
          computedStyle.transform = 'matrix(1, 0, 0, 1, 0, 0)';
        }

        if (isDestroyed || display === 'none' || visibility === 'hidden') {
          return;
        } // 先渲染渐变，没有则背景色


        if (backgroundGradient) {
          var k = backgroundGradient.k,
              v = backgroundGradient.v;
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
        } else if (backgroundColor !== 'transparent') {
          if (renderMode === mode.CANVAS) {
            ctx.beginPath();
            ctx.fillStyle = backgroundColor;
            ctx.rect(x2, y2, iw, ih);
            ctx.fill();
            ctx.closePath();
          } else if (renderMode === mode.SVG) {
            this.addBackground([['x', x2], ['y', y2], ['width', iw], ['height', ih], ['fill', backgroundColor]]);
          }
        } // 边框需考虑尖角，两条相交边平分45°夹角


        if (borderTopWidth > 0 && borderTopColor !== 'transparent') {
          var deg1 = Math.atan(borderTopWidth / borderLeftWidth);
          var deg2 = Math.atan(borderTopWidth / borderRightWidth);
          var points = border.calPoints(borderTopWidth, borderTopStyle, deg1, deg2, x1, x2, x3, x4, y1, y2, y3, y4, 0);
          renderBorder(renderMode, points, borderTopColor, ctx, this);
        }

        if (borderRightWidth > 0 && borderRightColor !== 'transparent') {
          var _deg = Math.atan(borderRightWidth / borderTopWidth);

          var _deg2 = Math.atan(borderRightWidth / borderBottomWidth);

          var _points = border.calPoints(borderRightWidth, borderRightStyle, _deg, _deg2, x1, x2, x3, x4, y1, y2, y3, y4, 1);

          renderBorder(renderMode, _points, borderRightColor, ctx, this);
        }

        if (borderBottomWidth > 0 && borderBottomColor !== 'transparent') {
          var _deg3 = Math.atan(borderBottomWidth / borderLeftWidth);

          var _deg4 = Math.atan(borderBottomWidth / borderRightWidth);

          var _points2 = border.calPoints(borderBottomWidth, borderBottomStyle, _deg3, _deg4, x1, x2, x3, x4, y1, y2, y3, y4, 2);

          renderBorder(renderMode, _points2, borderBottomColor, ctx, this);
        }

        if (borderLeftWidth > 0 && borderLeftColor !== 'transparent') {
          var _deg5 = Math.atan(borderLeftWidth / borderTopWidth);

          var _deg6 = Math.atan(borderLeftWidth / borderBottomWidth);

          var _points3 = border.calPoints(borderLeftWidth, borderLeftStyle, _deg5, _deg6, x1, x2, x3, x4, y1, y2, y3, y4, 3);

          renderBorder(renderMode, _points3, borderLeftColor, ctx, this);
        }
      }
    }, {
      key: "__destroy",
      value: function __destroy() {
        var ref = this.props.ref;

        if (ref) {
          var owner = this.host || this.root;

          if (owner && owner.ref[ref]) {
            delete owner.ref[ref];
          }
        }

        if (this.animation) {
          this.animation.__destroy();
        }

        _get(_getPrototypeOf(Xom.prototype), "__destroy", this).call(this);

        this.__matrix = this.__matrixEvent = null;
      } // 先查找到注册了事件的节点，再捕获冒泡判断增加性能

    }, {
      key: "__emitEvent",
      value: function __emitEvent(e, force) {
        var type = e.event.type,
            x = e.x,
            y = e.y,
            covers = e.covers;
        var isDestroyed = this.isDestroyed,
            listener = this.listener,
            children = this.children,
            computedStyle = this.computedStyle,
            outerWidth = this.outerWidth,
            outerHeight = this.outerHeight,
            matrixEvent = this.matrixEvent;

        if (isDestroyed || computedStyle.display === 'none' || e.__stopPropagation) {
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

            if (child instanceof Xom && ['absolute', 'relative'].indexOf(child.computedStyle.position) > -1) {
              if (child.__emitEvent(e)) {
                childWillResponse = true;
              }
            } // 组件要形成shadowDom，除了shadowRoot，其它节点事件不冒泡
            else if (child instanceof Component && ['absolute', 'relative'].indexOf(child.computedStyle.position) > -1) {
                if (child.__emitEvent(e)) {
                  childWillResponse = true;
                }
              }
          } // 再看普通流，从后往前遮挡顺序


          for (var _i = children.length - 1; _i >= 0; _i--) {
            var _child = children[_i];

            if (_child instanceof Xom && ['absolute', 'relative'].indexOf(_child.computedStyle.position) === -1) {
              if (_child.__emitEvent(e)) {
                childWillResponse = true;
              }
            } else if (_child instanceof Component && ['absolute', 'relative'].indexOf(_child.computedStyle.position) === -1) {
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

              if (util.isFunction(item)) {
                item(e);
              }
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
        var inThis = transform.pointInQuadrilateral(x - rx, y - ry, 0, 0, outerWidth, 0, 0, outerHeight, outerWidth, outerHeight, matrixEvent);

        if (inThis) {
          // 不能被遮挡
          for (var i = 0, len = covers.length; i < len; i++) {
            var _covers$i = covers[i],
                x2 = _covers$i.x,
                y2 = _covers$i.y,
                w = _covers$i.w,
                h = _covers$i.h,
                _matrixEvent = _covers$i.matrixEvent;

            if (transform.pointInQuadrilateral(x - rx, y - ry, x2 - rx, y2 - ry, x2 - rx + w, y2 - ry, x2 - rx, y2 - ry + h, x2 - rx + w, y2 - ry + h, _matrixEvent)) {
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
      key: "animate",
      value: function animate(list, option) {
        if (this.animation) {
          this.animation.__destroy();
        }

        var animation = this.__animation = new Animation(this, list, option);
        return animation.play();
      }
    }, {
      key: "__computed",
      value: function __computed(force) {
        var _this2 = this;

        var needCompute = this.needCompute;

        if (needCompute || force) {
          this.__needCompute = false;
          css.computed(this, this.isRoot());
        } // 即便自己不需要计算，但children还要继续递归检查


        if (!this.isGeom()) {
          this.children.forEach(function (item) {
            if (item instanceof Xom || item instanceof Component) {
              item.__computed(needCompute || force);
            } else if (needCompute || force) {
              item.__style = _this2.currentStyle;
              css.computed(item); // 文字首先测量所有字符宽度

              item.__measure();
            }
          });
        }
      }
    }, {
      key: "tagName",
      get: function get() {
        return this.__tagName;
      }
    }, {
      key: "outerWidth",
      get: function get() {
        var _this$computedStyle = this.computedStyle,
            borderLeftWidth = _this$computedStyle.borderLeftWidth,
            borderRightWidth = _this$computedStyle.borderRightWidth,
            marginRight = _this$computedStyle.marginRight,
            marginLeft = _this$computedStyle.marginLeft,
            paddingRight = _this$computedStyle.paddingRight,
            paddingLeft = _this$computedStyle.paddingLeft;
        return this.width + borderLeftWidth + borderRightWidth + marginLeft + marginRight + paddingLeft + paddingRight;
      }
    }, {
      key: "outerHeight",
      get: function get() {
        var _this$computedStyle2 = this.computedStyle,
            borderTopWidth = _this$computedStyle2.borderTopWidth,
            borderBottomWidth = _this$computedStyle2.borderBottomWidth,
            marginTop = _this$computedStyle2.marginTop,
            marginBottom = _this$computedStyle2.marginBottom,
            paddingTop = _this$computedStyle2.paddingTop,
            paddingBottom = _this$computedStyle2.paddingBottom;
        return this.height + borderTopWidth + borderBottomWidth + marginTop + marginBottom + paddingTop + paddingBottom;
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
    }, {
      key: "id",
      get: function get() {
        return this.__id;
      }
    }, {
      key: "class",
      get: function get() {
        return this.__class || [];
      }
    }, {
      key: "animation",
      get: function get() {
        return this.__animation;
      }
    }, {
      key: "animateStyle",
      get: function get() {
        return this.__animateStyle;
      }
    }, {
      key: "currentStyle",
      get: function get() {
        var animation = this.animation;

        if (animation) {
          var playState = animation.playState,
              options = animation.options;

          if (playState === 'idle') {
            return this.style;
          } else if (playState === 'finished' && ['forwards', 'both'].indexOf(options.fill) === -1) {
            return this.style;
          }

          return this.animateStyle;
        }

        return this.style;
      }
    }, {
      key: "needCompute",
      get: function get() {
        return this.__needCompute;
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
        var n = this.__baseLine = this.__calBaseLine(); // 仅当有2个和以上时才需要vertical对齐调整


        if (this.list.length > 1) {
          this.list.forEach(function (item) {
            var m = item.baseLine;

            if (m !== n) {
              item.__offsetY(n - m);
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
        var style = this.style;
        css.normalize(style, reset.geom);
        var ref = this.props.ref;

        if (ref) {
          var owner = this.host || this.root;

          if (owner) {
            owner.ref[ref] = this;
          }
        }
      }
    }, {
      key: "__tryLayInline",
      value: function __tryLayInline(w, total) {
        // 无children，直接以style的width为宽度，不定义则为0
        var width = this.currentStyle.width;

        if (width.unit === unit.PX) {
          return w - width.value;
        } else if (width.unit === unit.PERCENT) {
          return w - total * width.value * 0.01;
        }

        return w;
      }
    }, {
      key: "__calAutoBasis",
      value: function __calAutoBasis(isDirectionRow) {
        var b = 0;
        var min = 0;
        var max = 0;
        var currentStyle = this.currentStyle,
            computedStyle = this.computedStyle; // 计算需考虑style的属性

        var width = currentStyle.width,
            height = currentStyle.height;
        var borderTopWidth = computedStyle.borderTopWidth,
            borderRightWidth = computedStyle.borderRightWidth,
            borderBottomWidth = computedStyle.borderBottomWidth,
            borderLeftWidth = computedStyle.borderLeftWidth;
        var main = isDirectionRow ? width : height;

        if (main.unit !== unit.AUTO) {
          b = max += main.value;
        } // border也得计算在内


        if (isDirectionRow) {
          var w = borderRightWidth + borderLeftWidth;
          b += w;
          max += w;
          min += w;
        } else {
          var h = borderTopWidth + borderBottomWidth;
          b += h;
          max += h;
          min += h;
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

        var _this$currentStyle = this.currentStyle,
            marginLeft = _this$currentStyle.marginLeft,
            marginRight = _this$currentStyle.marginRight,
            width = _this$currentStyle.width;
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
      key: "__preRender",
      value: function __preRender(renderMode) {
        var x = this.rx,
            y = this.ry,
            width = this.width,
            height = this.height,
            computedStyle = this.computedStyle;
        var borderTopWidth = computedStyle.borderTopWidth,
            borderLeftWidth = computedStyle.borderLeftWidth,
            display = computedStyle.display,
            stroke = computedStyle.stroke,
            strokeWidth = computedStyle.strokeWidth,
            strokeDasharray = computedStyle.strokeDasharray,
            strokeLinecap = computedStyle.strokeLinecap,
            fill = computedStyle.fill,
            marginTop = computedStyle.marginTop,
            marginLeft = computedStyle.marginLeft,
            paddingTop = computedStyle.paddingTop,
            paddingRight = computedStyle.paddingRight,
            paddingBottom = computedStyle.paddingBottom,
            paddingLeft = computedStyle.paddingLeft,
            visibility = computedStyle.visibility;
        var originX = x + borderLeftWidth + marginLeft + paddingLeft;
        var originY = y + borderTopWidth + marginTop + paddingTop;
        var cx = originX + width * 0.5;
        var cy = originY + height * 0.5;
        var iw = width + paddingLeft + paddingRight;
        var ih = height + paddingTop + paddingBottom;

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
          strokeLinecap: strokeLinecap,
          fill: fill,
          visibility: visibility
        };
      }
    }, {
      key: "render",
      value: function render(renderMode) {
        _get(_getPrototypeOf(Geom.prototype), "render", this).call(this, renderMode);

        var isDestroyed = this.isDestroyed,
            _this$computedStyle = this.computedStyle,
            display = _this$computedStyle.display,
            visibility = _this$computedStyle.visibility;

        if (isDestroyed || display === 'none') {
          return {
            isDestroyed: isDestroyed,
            display: display,
            visibility: visibility
          };
        }

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
    'span': true,
    'img': true
  };
  var INLINE = {
    'span': true,
    'img': true
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

        var prev = null;
        list.forEach(function (item) {
          item.__ctx = ctx;
          item.__defs = defs;

          if (prev) {
            prev.__next = item;
            item.__prev = prev;
          }

          item.__parent = _this2;
          prev = item;
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
        } // 标准化处理，默认值、简写属性


        css.normalize(style, reset.dom);
        this.children.forEach(function (item) {
          if (item instanceof Xom || item instanceof Component) {
            item.__init();
          } else {
            item.__style = style;
          }

          if (item instanceof Text || item.style.position !== 'absolute') {
            _this4.__flowChildren.push(item);
          } else {
            _this4.__absChildren.push(item);
          }
        });
        var ref = this.props.ref;

        if (ref) {
          var owner = this.host || this.root;

          if (owner) {
            owner.ref[ref] = this;
          }
        }
      } // 给定父宽度情况下，尝试行内放下后的剩余宽度，为负数即放不下

    }, {
      key: "__tryLayInline",
      value: function __tryLayInline(w, total) {
        var flowChildren = this.flowChildren,
            width = this.currentStyle.width;

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
      } // 设置y偏移值，递归包括children，此举在justify-content/margin-auto等对齐用

    }, {
      key: "__offsetX",
      value: function __offsetX(diff, isLayout) {
        _get(_getPrototypeOf(Dom.prototype), "__offsetX", this).call(this, diff, isLayout);

        this.flowChildren.forEach(function (item) {
          if (item) {
            item.__offsetX(diff, isLayout);
          }
        });
      }
    }, {
      key: "__offsetY",
      value: function __offsetY(diff, isLayout) {
        _get(_getPrototypeOf(Dom.prototype), "__offsetY", this).call(this, diff, isLayout);

        this.flowChildren.forEach(function (item) {
          if (item) {
            item.__offsetY(diff, isLayout);
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
            currentStyle = this.currentStyle,
            computedStyle = this.computedStyle; // 计算需考虑style的属性

        var width = currentStyle.width,
            height = currentStyle.height,
            marginLeft = currentStyle.marginLeft,
            marginTop = currentStyle.marginTop,
            marginRight = currentStyle.marginRight,
            marginBottom = currentStyle.marginBottom,
            paddingLeft = currentStyle.paddingLeft,
            paddingTop = currentStyle.paddingTop,
            paddingRight = currentStyle.paddingRight,
            paddingBottom = currentStyle.paddingBottom;
        var borderTopWidth = computedStyle.borderTopWidth,
            borderRightWidth = computedStyle.borderRightWidth,
            borderBottomWidth = computedStyle.borderBottomWidth,
            borderLeftWidth = computedStyle.borderLeftWidth;
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

          var w2 = borderRightWidth + borderLeftWidth + mp;
          b += w2;
          max += w2;
          min += w2;
        } else {
          var _mp = this.__calMp(marginTop, w) + this.__calMp(marginBottom, w) + this.__calMp(paddingTop, w) + this.__calMp(paddingBottom, w);

          var h2 = borderTopWidth + borderBottomWidth + _mp;
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
      } // 本身block布局时计算好所有子元素的基本位置

    }, {
      key: "__layoutBlock",
      value: function __layoutBlock(data) {
        var flowChildren = this.flowChildren,
            currentStyle = this.currentStyle,
            computedStyle = this.computedStyle,
            lineGroups = this.lineGroups;
        var textAlign = computedStyle.textAlign;

        var _this$__preLayout = this.__preLayout(data),
            fixedHeight = _this$__preLayout.fixedHeight,
            x = _this$__preLayout.x,
            y = _this$__preLayout.y,
            w = _this$__preLayout.w,
            h = _this$__preLayout.h; // 递归布局，将inline的节点组成lineGroup一行


        var lineGroup = new LineGroup(x, y);
        flowChildren.forEach(function (item) {
          if (item instanceof Xom || item instanceof Component) {
            if (item.currentStyle.display === 'inline') {
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
        }

        this.__width = w;
        this.__height = fixedHeight ? h : y - data.y; // text-align

        if (['center', 'right'].indexOf(textAlign) > -1) {
          lineGroups.forEach(function (lineGroup) {
            var diff = w - lineGroup.width;

            if (diff > 0) {
              lineGroup.horizonAlign(textAlign === 'center' ? diff * 0.5 : diff);
            }
          });
        }

        this.__marginAuto(currentStyle, data);
      } // 处理margin:xx auto居中对齐

    }, {
      key: "__marginAuto",
      value: function __marginAuto(style, data) {
        if (style.marginLeft.unit === unit.AUTO && style.marginRight.unit === unit.AUTO && style.width.unit !== unit.AUTO) {
          var ow = this.outerWidth;

          if (ow < data.w) {
            this.__offsetX((data.w - ow) * 0.5, true);
          }
        }
      } // 弹性布局时的计算位置

    }, {
      key: "__layoutFlex",
      value: function __layoutFlex(data) {
        var flowChildren = this.flowChildren,
            style = this.style,
            currentStyle = this.currentStyle;
        var flexDirection = currentStyle.flexDirection,
            justifyContent = currentStyle.justifyContent,
            alignItems = currentStyle.alignItems;

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
              var _currentStyle = item.currentStyle,
                  computedStyle = item.computedStyle;
              var display = _currentStyle.display,
                  _flexDirection = _currentStyle.flexDirection,
                  width = _currentStyle.width; // column的flex的child如果是inline，变为block

              if (display === 'inline') {
                _currentStyle.display = computedStyle.display = 'block';
              } // 竖向flex的child如果是横向flex，宽度自动的话要等同于父flex的宽度
              else if (display === 'flex' && _flexDirection === 'row' && width.unit === unit.AUTO) {
                  width.value = w;
                  width.unit = unit.PX;
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
            var _currentStyle2 = item.currentStyle,
                computedStyle = item.computedStyle;
            var flexGrow = _currentStyle2.flexGrow,
                flexShrink = _currentStyle2.flexShrink,
                flexBasis = _currentStyle2.flexBasis;
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
              computedStyle.flexBasis = b = flexBasis.value;
              basisList.push(b);
              basisSum += b;
            } else if (flexBasis.unit === unit.PERCENT) {
              b = computedStyle.flexBasis = (isDirectionRow ? w : h) * flexBasis.value * 0.01;
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
            var _currentStyle3 = item.currentStyle,
                computedStyle = item.computedStyle;
            var display = _currentStyle3.display,
                _flexDirection2 = _currentStyle3.flexDirection,
                width = _currentStyle3.width,
                height = _currentStyle3.height;

            if (isDirectionRow) {
              // row的flex的child如果是inline，变为block
              if (display === 'inline') {
                _currentStyle3.display = computedStyle.display = 'block';
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
                _currentStyle3.display = computedStyle.display = 'block';
              } // 竖向flex的child如果是横向flex，宽度自动的话要等同于父flex的宽度
              else if (display === 'flex' && _flexDirection2 === 'row' && width.unit === unit.AUTO) {
                  width.value = w;
                  width.unit = unit.PX;
                }

              item.__layout({
                x: x,
                y: y,
                w: w,
                h: main
              });
            } // 重设因伸缩而导致的主轴长度


            if (isOverflow && shrink || !isOverflow && grow) {
              var borderTopWidth = computedStyle.borderTopWidth,
                  borderRightWidth = computedStyle.borderRightWidth,
                  borderBottomWidth = computedStyle.borderBottomWidth,
                  borderLeftWidth = computedStyle.borderLeftWidth,
                  marginTop = computedStyle.marginTop,
                  marginRight = computedStyle.marginRight,
                  marginBottom = computedStyle.marginBottom,
                  marginLeft = computedStyle.marginLeft,
                  paddingTop = computedStyle.paddingTop,
                  paddingRight = computedStyle.paddingRight,
                  paddingBottom = computedStyle.paddingBottom,
                  paddingLeft = computedStyle.paddingLeft;

              if (isDirectionRow) {
                item.__width = main - marginLeft - marginRight - paddingLeft - paddingRight - borderLeftWidth - borderRightWidth;
              } else {
                item.__height = main - marginTop - marginBottom - paddingTop - paddingBottom - borderTopWidth - borderBottomWidth;
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
              isDirectionRow ? child.__offsetX(diff, true) : child.__offsetY(diff, true);
            }
          } else if (justifyContent === 'center') {
            var center = diff * 0.5;

            for (var _i = 0; _i < len; _i++) {
              var _child = flowChildren[_i];
              isDirectionRow ? _child.__offsetX(center, true) : _child.__offsetY(center, true);
            }
          } else if (justifyContent === 'space-between') {
            var between = diff / (len - 1);

            for (var _i2 = 1; _i2 < len; _i2++) {
              var _child2 = flowChildren[_i2];
              isDirectionRow ? _child2.__offsetX(between * _i2, true) : _child2.__offsetY(between * _i2, true);
            }
          } else if (justifyContent === 'space-around') {
            var around = diff / (len + 1);

            for (var _i3 = 0; _i3 < len; _i3++) {
              var _child3 = flowChildren[_i3];
              isDirectionRow ? _child3.__offsetX(around * (_i3 + 1), true) : _child3.__offsetY(around * (_i3 + 1), true);
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
            var computedStyle = item.computedStyle,
                currentStyle = item.currentStyle;
            var borderTopWidth = computedStyle.borderTopWidth,
                borderRightWidth = computedStyle.borderRightWidth,
                borderBottomWidth = computedStyle.borderBottomWidth,
                borderLeftWidth = computedStyle.borderLeftWidth,
                marginTop = computedStyle.marginTop,
                marginRight = computedStyle.marginRight,
                marginBottom = computedStyle.marginBottom,
                marginLeft = computedStyle.marginLeft,
                paddingTop = computedStyle.paddingTop,
                paddingRight = computedStyle.paddingRight,
                paddingBottom = computedStyle.paddingBottom,
                paddingLeft = computedStyle.paddingLeft;

            if (isDirectionRow) {
              if (currentStyle.height.unit === unit.AUTO) {
                item.__height = computedStyle.height = maxCross - marginTop - marginBottom - paddingTop - paddingBottom - borderTopWidth - borderBottomWidth;
              }
            } else {
              if (currentStyle.width.unit === unit.AUTO) {
                item.__width = computedStyle.width = maxCross - marginLeft - marginRight - paddingLeft - paddingRight - borderRightWidth - borderLeftWidth;
              }
            }
          });
        } else if (alignItems === 'center') {
          flowChildren.forEach(function (item) {
            var diff = maxCross - item.outerHeight;

            if (diff > 0) {
              item.__offsetY(diff * 0.5, true);
            }
          });
        } else if (alignItems === 'flex-end') {
          flowChildren.forEach(function (item) {
            var diff = maxCross - item.outerHeight;

            if (diff > 0) {
              item.__offsetY(diff, true);
            }
          });
        }

        this.__width = w;
        this.__height = fixedHeight ? h : y - data.y;

        this.__marginAuto(currentStyle, data);
      } // inline比较特殊，先简单顶部对其，后续还需根据vertical和lineHeight计算y偏移

    }, {
      key: "__layoutInline",
      value: function __layoutInline(data) {
        var _this5 = this;

        var flowChildren = this.flowChildren,
            currentStyle = this.currentStyle,
            computedStyle = this.computedStyle,
            lineGroups = this.lineGroups;
        var textAlign = computedStyle.textAlign;

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
            if (item.currentStyle.position === 'absolute') {
              _this5.absChildren.push(item);

              return;
            }

            item.currentStyle.display = item.computedStyle.display = 'inline'; // inline开头，不用考虑是否放得下直接放

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
        } // 元素的width不能超过父元素w


        this.__width = fixedWidth ? w : maxX - data.x;
        this.__height = fixedHeight ? h : y - data.y; // text-align

        if (['center', 'right'].indexOf(textAlign) > -1) {
          lineGroups.forEach(function (lineGroup) {
            var diff = _this5.__width - lineGroup.width;

            if (diff > 0) {
              lineGroup.horizonAlign(textAlign === 'center' ? diff * 0.5 : diff);
            }
          });
        }
      } // 只针对绝对定位children布局

    }, {
      key: "__layoutAbs",
      value: function __layoutAbs(container, data) {
        var x = container.x,
            y = container.y,
            width = container.width,
            height = container.height,
            currentStyle = container.currentStyle,
            computedStyle = container.computedStyle;
        var isDestroyed = this.isDestroyed,
            children = this.children,
            absChildren = this.absChildren;
        var display = currentStyle.display;
        var borderTopWidth = computedStyle.borderTopWidth,
            borderLeftWidth = computedStyle.borderLeftWidth,
            marginTop = computedStyle.marginTop,
            marginLeft = computedStyle.marginLeft,
            paddingTop = computedStyle.paddingTop,
            paddingRight = computedStyle.paddingRight,
            paddingBottom = computedStyle.paddingBottom,
            paddingLeft = computedStyle.paddingLeft;

        if (isDestroyed || display === 'none') {
          return;
        }

        x += marginLeft + borderLeftWidth;
        y += marginTop + borderTopWidth;
        var iw = width + paddingLeft + paddingRight;
        var ih = height + paddingTop + paddingBottom; // 对absolute的元素进行相对容器布局

        absChildren.forEach(function (item) {
          var currentStyle = item.currentStyle,
              computedStyle = item.computedStyle;
          var left = currentStyle.left,
              top = currentStyle.top,
              right = currentStyle.right,
              bottom = currentStyle.bottom,
              width = currentStyle.width,
              height = currentStyle.height;
          var x2, y2, w2, h2;
          var onlyRight;
          var onlyBottom;
          var fixedTop;
          var fixedRight;
          var fixedBottom;
          var fixedLeft;

          if (left !== undefined && left.unit !== unit.AUTO) {
            fixedLeft = true;
            computedStyle.left = css.calAbsolute(currentStyle, 'left', left, iw);
          } else {
            computedStyle.left = 'auto';
          }

          if (right !== undefined && right.unit !== unit.AUTO) {
            fixedRight = true;
            computedStyle.right = css.calAbsolute(currentStyle, 'right', right, iw);
          } else {
            computedStyle.right = 'auto';
          }

          if (top !== undefined && top.unit !== unit.AUTO) {
            fixedTop = true;
            computedStyle.top = css.calAbsolute(currentStyle, 'top', top, ih);
          } else {
            computedStyle.top = 'auto';
          }

          if (bottom !== undefined && bottom.unit !== unit.AUTO) {
            fixedBottom = true;
            computedStyle.bottom = css.calAbsolute(currentStyle, 'bottom', bottom, ih);
          } else {
            computedStyle.bottom = 'auto';
          } // width优先级高于right高于left，即最高left+right，其次left+width，再次right+width，然后仅申明单个，最次全部auto


          if (fixedLeft && fixedRight) {
            x2 = x + computedStyle.left;
            w2 = x + iw - computedStyle.right - x2;
          } else if (fixedLeft && width.unit !== unit.AUTO) {
            x2 = x + computedStyle.left;
            w2 = width.unit === unit.PX ? width.value : iw * width.value * 0.01;
          } else if (fixedRight && width.unit !== unit.AUTO) {
            w2 = width.unit === unit.PX ? width.value : iw * width.value * 0.01;
            x2 = x + iw - computedStyle.right - w2;
          } else if (fixedLeft) {
            x2 = x + computedStyle.left;
          } else if (fixedRight) {
            x2 = x + iw - computedStyle.right;
            onlyRight = true;
          } else {
            x2 = x + paddingLeft;

            if (width.unit !== unit.AUTO) {
              w2 = width.unit === unit.PX ? width.value : iw * width.value * 0.01;
            }
          } // top/bottom/height优先级同上


          if (fixedTop && fixedBottom) {
            y2 = y + computedStyle.top;
            h2 = y + ih - computedStyle.bottom - y2;
          } else if (fixedTop && height.unit !== unit.AUTO) {
            y2 = y + computedStyle.top;
            h2 = height.unit === unit.PX ? height.value : ih * height.value * 0.01;
          } else if (fixedBottom && height.unit !== unit.AUTO) {
            h2 = height.unit === unit.PX ? height.value : ih * height.value * 0.01;
            y2 = y + ih - computedStyle.bottom - h2;
          } else if (fixedTop) {
            y2 = y + computedStyle.top;
          } else if (fixedBottom) {
            y2 = y + ih - computedStyle.bottom;
            onlyBottom = true;
          } // 未声明y的找到之前的流布局child，紧随其下
          else {
              y2 = y;
              var prev = item.prev;

              while (prev) {
                if (prev instanceof Text || prev.computedStyle.position !== 'absolute') {
                  y2 = prev.y + prev.outerHeight;
                  break;
                }

                prev = prev.prev;
              }

              if (!prev) {
                y2 = y;
              }

              if (height.unit !== unit.AUTO) {
                h2 = height.unit === unit.PX ? height.value : ih * height.value * 0.01;
              }
            }

          if (w2 !== undefined) {
            currentStyle.width = {
              value: w2,
              unit: unit.PX
            };
          }

          if (h2 !== undefined) {
            currentStyle.height = {
              value: h2,
              unit: unit.PX
            };
          } // 绝对定位模拟类似inline布局，因为宽高可能未定义，由普通流children布局后决定


          currentStyle.display = 'inline'; // onlyRight或onlyBottom时做的布局其实是以那个点位为left/top布局，外围尺寸限制要特殊计算
          // 并且布局完成后还要偏移回来

          if (onlyRight && onlyBottom) {
            item.__layout({
              x: x2,
              y: y2,
              w: w2,
              h: h2
            });

            item.__offsetX(-item.width, true);

            item.__offsetY(-item.height, true);
          } else if (onlyRight) {
            item.__layout({
              x: x2,
              y: y2,
              w: w2,
              h: data.h - y2
            });

            item.__offsetX(-item.width, true);
          } else if (onlyBottom) {
            item.__layout({
              x: x2,
              y: y2,
              w: data.w - x2,
              h: h2
            });

            item.__offsetY(-item.height, true);
          } else {
            item.__layout({
              x: x2,
              y: y2,
              w: data.w - x2,
              h: data.h - y2
            });
          } // 布局完成后强制为block


          currentStyle.display = computedStyle.display = 'block';
        }); // 递归进行，遇到absolute/relative的设置新容器

        children.forEach(function (item) {
          if (item instanceof Dom) {
            item.__layoutAbs(['absolute', 'relative'].indexOf(item.computedStyle.position) > -1 ? item : container, data);
          } else if (item instanceof Component) {
            var sr = item.shadowRoot;

            if (sr instanceof Dom) {
              sr.__layoutAbs(sr, data);
            }
          }
        });
      }
    }, {
      key: "render",
      value: function render(renderMode) {
        _get(_getPrototypeOf(Dom.prototype), "render", this).call(this, renderMode);

        var isDestroyed = this.isDestroyed,
            _this$computedStyle = this.computedStyle,
            display = _this$computedStyle.display,
            visibility = _this$computedStyle.visibility,
            flowChildren = this.flowChildren,
            children = this.children;

        if (isDestroyed || display === 'none' || visibility === 'hidden') {
          return;
        } // 先绘制static


        flowChildren.forEach(function (item) {
          if (item instanceof Text || item.computedStyle.position === 'static') {
            item.render(renderMode);
          }

          if (item instanceof Component && item.computedStyle.position === 'static') {
            item.shadowRoot.render(renderMode);
          }
        }); // 再绘制relative和absolute

        children.forEach(function (item) {
          if (item instanceof Xom && ['relative', 'absolute'].indexOf(item.computedStyle.position) > -1) {
            item.render(renderMode);
          }

          if (item instanceof Component && ['relative', 'absolute'].indexOf(item.computedStyle.position) > -1) {
            item.shadowRoot.render(renderMode);
          }
        });

        if (renderMode === mode.SVG) {
          // 由于svg严格按照先后顺序渲染，没有z-index概念，需要排序将relative/absolute放后面
          var _children = this.children.slice(0);

          sort(_children, function (a, b) {
            if (b.computedStyle.position === 'static' && ['relative', 'absolute'].indexOf(a.computedStyle.position) > -1) {
              return true;
            }
          });
          this.__virtualDom = _objectSpread2({}, _get(_getPrototypeOf(Dom.prototype), "virtualDom", this), {
            type: 'dom',
            children: _children.map(function (item) {
              return item.virtualDom;
            })
          });
        }
      }
    }, {
      key: "__destroy",
      value: function __destroy() {
        _get(_getPrototypeOf(Dom.prototype), "__destroy", this).call(this);

        this.children.forEach(function (child) {
          child.__destroy();
        });
        this.children.splice(0);
        this.flowChildren.splice(0);
        this.absChildren.splice(0);
        this.lineGroups.splice(0);
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
    }], [{
      key: "isValid",
      value: function isValid(s) {
        return TAG_NAME.hasOwnProperty(s);
      }
    }]);

    return Dom;
  }(Xom);

  var CACHE = {};
  var INIT = 0;
  var LOADING = 1;
  var LOADED = 2;

  var Img =
  /*#__PURE__*/
  function (_Dom) {
    _inherits(Img, _Dom);

    function Img(tagName, props) {
      var _this;

      _classCallCheck(this, Img);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Img).call(this, tagName, props, [])); // 空url用错误图代替

      if (!_this.src || !_this.src.trim()) {
        _this.__error = true;

        var _assertThisInitialize = _assertThisInitialized(_this),
            _assertThisInitialize2 = _assertThisInitialize.style,
            width = _assertThisInitialize2.width,
            height = _assertThisInitialize2.height;

        if (width.unit === unit.AUTO) {
          width.value = 32;
          width.unit = unit.PX;
        }

        if (height.unit === unit.AUTO) {
          height.value = 32;
          height.unit = unit.PX;
        }
      }

      return _this;
    }

    _createClass(Img, [{
      key: "__layout",
      value: function __layout(data) {
        var _this2 = this;

        _get(_getPrototypeOf(Img.prototype), "__layout", this).call(this, data);

        var isDestroyed = this.isDestroyed,
            src = this.src,
            currentStyle = this.currentStyle;
        var display = currentStyle.display,
            width = currentStyle.width,
            height = currentStyle.height;

        if (isDestroyed || display === 'none') {
          return;
        }

        var w = this.width,
            h = this.height;
        var cache = CACHE[this.src] = CACHE[this.src] || {
          state: INIT,
          task: []
        };

        var cb = function cb(cache) {
          if (cache.success) {
            _this2.__source = cache.source;
          } else {
            _this2.__error = true;
          }

          _this2.__imgWidth = cache.width;
          _this2.__imgHeight = cache.height; // 宽高都为auto，使用加载测量的数据

          if (width.unit === unit.AUTO && height.unit === unit.AUTO) {
            currentStyle.width = {
              value: cache.width,
              unit: unit.PX
            };
            currentStyle.height = {
              value: cache.height,
              unit: unit.PX
            };
          } // 否则有一方定义则按比例调整另一方适应
          else if (width.unit === unit.AUTO) {
              currentStyle.width = {
                value: h * cache.width / cache.height,
                unit: unit.PX
              };
            } else if (height.unit === unit.AUTO) {
              currentStyle.height = {
                value: w * cache.height / cache.width,
                unit: unit.PX
              };
            }

          if (_this2.root) {
            _this2.root.refreshTask();
          }
        };

        if (cache.state === LOADED) {
          cb(cache);
        } else if (cache.state === LOADING) {
          cache.task.push(cb);
        } else if (cache.state === INIT) {
          cache.state = LOADING;
          cache.task.push(cb);
          inject.measureImg(src, function (res) {
            cache.success = res.success;

            if (res.success) {
              cache.width = res.width;
              cache.height = res.height;
              cache.source = res.source;
            } else {
              cache.width = 32;
              cache.height = 32;
            }

            cache.state = LOADED;
            cache.task.forEach(function (cb) {
              return cb(cache);
            });
            cache.task.splice(0);
          });
        }
      }
    }, {
      key: "__addGeom",
      value: function __addGeom(tagName, props) {
        props = util.hash2arr(props);
        this.virtualDom.children.push({
          type: 'item',
          tagName: tagName,
          props: props
        });
      }
    }, {
      key: "render",
      value: function render(renderMode) {
        _get(_getPrototypeOf(Img.prototype), "render", this).call(this, renderMode);

        var ctx = this.ctx,
            x = this.rx,
            y = this.ry,
            width = this.width,
            height = this.height,
            src = this.src,
            isDestroyed = this.isDestroyed,
            _this$computedStyle = this.computedStyle,
            display = _this$computedStyle.display,
            borderTopWidth = _this$computedStyle.borderTopWidth,
            borderLeftWidth = _this$computedStyle.borderLeftWidth,
            marginTop = _this$computedStyle.marginTop,
            marginLeft = _this$computedStyle.marginLeft,
            paddingTop = _this$computedStyle.paddingTop,
            paddingLeft = _this$computedStyle.paddingLeft;

        if (isDestroyed || display === 'none') {
          return;
        }

        var originX = x + marginLeft + borderLeftWidth + paddingLeft;
        var originY = y + marginTop + borderTopWidth + paddingTop;

        if (this.__error) {
          var strokeWidth = Math.min(width, height) * 0.02;
          var stroke = '#CCC';
          var fill = '#DDD';
          var cx = originX + width * 0.7;
          var cy = originY + height * 0.3;
          var r = strokeWidth * 5;
          var pts = [[originX + width * 0.15, originY + height * 0.7], [originX + width * 0.3, originY + height * 0.4], [originX + width * 0.5, originY + height * 0.6], [originX + width * 0.6, originY + height * 0.5], [originX + width * 0.9, originY + height * 0.8], [originX + width * 0.15, originY + height * 0.8]];

          if (renderMode === mode.CANVAS) {
            ctx.strokeStyle = stroke;
            ctx.lineWidth = strokeWidth;
            ctx.fillStyle = fill;
            ctx.beginPath();
            ctx.moveTo(originX, originY);
            ctx.lineTo(originX + width, originY);
            ctx.lineTo(originX + width, originY + height);
            ctx.lineTo(originX, originY + height);
            ctx.lineTo(originX, originY);
            ctx.stroke();
            ctx.closePath();
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, 2 * Math.PI);
            ctx.fill();
            ctx.closePath();
            ctx.beginPath();
            ctx.moveTo(pts[0][0], pts[0][1]);

            for (var i = 1, len = pts.length; i < len; i++) {
              var point = pts[i];
              ctx.lineTo(point[0], point[1]);
            }

            ctx.lineTo(pts[0][0], pts[0][1]);
            ctx.fill();
            ctx.closePath();
          } else if (renderMode === mode.SVG) {
            this.__addGeom('rect', [['x', originX], ['y', originY], ['width', width], ['height', height], ['stroke', stroke], ['stroke-width', strokeWidth], ['fill', 'transparent']]);

            this.__addGeom('circle', [['cx', cx], ['cy', cy], ['r', r], ['fill', fill]]);

            var s = '';

            for (var _i = 0, _len = pts.length; _i < _len; _i++) {
              var _point = pts[_i];
              s += "".concat(_point[0], ",").concat(_point[1], " ");
            }

            this.__addGeom('polygon', [['points', s], ['fill', fill]]);
          }
        } else {
          var matrix;

          if (this.__imgWidth !== undefined && (width !== this.__imgWidth || height !== this.__imgHeight)) {
            var list = [['scaleX', {
              value: width / this.__imgWidth,
              unit: unit.NUMBER
            }], ['scaleY', {
              value: height / this.__imgHeight,
              unit: unit.NUMBER
            }]];
            var ow = this.outerWidth;
            var oh = this.outerHeight;
            var tfo = transform.calOrigin([{
              value: 0,
              unit: unit.PERCENT
            }, {
              value: 0,
              unit: unit.PERCENT
            }], x, y, ow, oh);
            matrix = transform.calMatrix(list, tfo, x, y, ow, oh); // 缩放图片的同时要考虑原先的矩阵，以及影响事件

            if (this.matrix) {
              this.__matrix = matrix = transform.mergeMatrix(this.__matrix, matrix);
              this.__matrixEvent = transform.mergeMatrix(this.__matrixEvent, matrix);
            } else {
              this.__matrixEvent = matrix;
            }

            matrix = 'matrix(' + matrix.join(',') + ')';
          }

          if (renderMode === mode.CANVAS) {
            if (this.__source) {
              ctx.drawImage(this.__source, originX, originY, width, height);
            }
          } else if (renderMode === mode.SVG) {
            var props = [['xlink:href', src], ['x', originX], ['y', originY], ['width', matrix ? this.__imgWidth : this.width], ['height', matrix ? this.__imgHeight : this.height]];

            if (matrix) {
              props.push(['transform', matrix]);
            }

            this.virtualDom.children.push({
              type: 'img',
              tagName: 'image',
              props: props
            });
          }
        }
      }
    }, {
      key: "src",
      get: function get() {
        return this.props.src;
      }
    }, {
      key: "baseLine",
      get: function get() {
        return this.height;
      }
    }]);

    return Img;
  }(Dom);

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
      } else if (nvd.type === 'text' || nvd.type === 'img') {
        replaceWith(elem, nvd);
      } else if (nvd.type === 'geom') {
        diffD2G(elem, ovd, nvd);
      }
    } else if (ovd.type === 'text') {
      if (nvd.type === 'dom' || nvd.type === 'geom' || nvd.type === 'img') {
        replaceWith(elem, nvd);
      } else if (nvd.type === 'text') {
        diffT2T(elem, ovd, nvd);
      }
    } else if (ovd.type === 'geom') {
      if (nvd.type === 'dom') {
        diffG2D(elem, ovd, nvd);
      } else if (nvd.type === 'text' || nvd.type === 'img') {
        replaceWith(elem, nvd);
      } else if (nvd.type === 'geom') {
        diffG2G(elem, ovd, nvd);
      }
    } else if (ovd.type === 'img') {
      if (nvd.type === 'img') {
        diffItemSelf(elem, ovd, nvd);
      } else {
        replaceWith(elem, nvd);
      }
    }
  }

  function diffD2D(elem, ovd, nvd, root) {
    if (!equalArr(ovd.transform, nvd.transform)) {
      var transform = util.joinTransform(nvd.transform);

      if (elem.getAttribute('transform') !== transform) {
        elem.setAttribute('transform', transform);
      }
    }

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
      diffItemSelf(cns[i], ovd, nvd);

      if (isText && ovd.content !== nvd.content) {
        cns[i].textContent = nvd.content;
      }
    }
  }

  function diffItemSelf(elem, ovd, nvd) {
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
    if (util.isString(dom) && dom) {
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

      _this.__mw = 0; // 记录最大宽高，防止尺寸变化清除不完全

      _this.__mh = 0;
      _this.__task = [];
      _this.__ref = {};
      Event.mix(_assertThisInitialized(_this));
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
        this.__defs = this.node.__defs || Defs.getInstance(this.__uuid);

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

        var renderMode = this.renderMode,
            ctx = this.ctx;

        this.__traverse(ctx, this.__defs, renderMode);

        this.__traverseCss(this, this.props.css);

        this.__init();

        this.refresh();

        if (this.node.__root) {
          this.node.__root.__destroy();

          delete this.node.__root.__node;
          delete this.node.__root.__vd;
          delete this.node.__root.__defs;
        } else {
          initEvent(this.node);
          this.node.__uuid = this.__uuid;
        }

        this.node.__root = this;
      }
    }, {
      key: "refresh",
      value: function refresh(cb) {
        var _this2 = this;

        var renderMode = this.renderMode,
            currentStyle = this.currentStyle; // 根元素特殊处理

        currentStyle.marginTop = currentStyle.marginRight = currentStyle.marginBottom = currentStyle.marginLeft = {
          value: 0,
          unit: unit.PX
        };
        currentStyle.width = {
          value: this.width,
          unit: unit.PX
        };
        currentStyle.height = {
          value: this.height,
          unit: unit.PX
        }; // 预先计算字体相关的继承，边框绝对值，动画每帧刷新需要重复计算

        this.__computed();

        inject.measureText(function () {
          _this2.__layout({
            x: 0,
            y: 0,
            w: _this2.width,
            h: _this2.height
          });

          _this2.__layoutAbs(_this2, {
            x: 0,
            y: 0,
            w: _this2.width,
            h: _this2.height
          });

          if (renderMode === mode.CANVAS) {
            // 可能会调整宽高，所以每次清除用最大值
            _this2.__mw = Math.max(_this2.__mw, _this2.width);
            _this2.__mh = Math.max(_this2.__mh, _this2.height); // 清除前得恢复默认matrix，防止每次布局改变了属性

            _this2.__ctx.setTransform(1, 0, 0, 1, 0, 0);

            _this2.__ctx.clearRect(0, 0, _this2.__mw, _this2.__mh);
          }

          _this2.render(renderMode);

          if (renderMode === mode.SVG) {
            var nvd = _this2.virtualDom;
            var nd = _this2.__defs;
            nvd.defs = nd.value;
            nvd = util.clone(nvd);

            if (_this2.node.__root) {
              diff(_this2.node, _this2.node.__vd, nvd);
            } else {
              _this2.node.innerHTML = util.joinVirtualDom(nvd);
            }

            _this2.node.__vd = nvd;
            _this2.node.__defs = nd;
          }

          var clone = _this2.__task.splice(0);

          clone.forEach(function (cb) {
            if (util.isFunction(cb)) {
              cb();
            }
          });

          if (util.isFunction(cb)) {
            cb();
          }

          _this2.emit(Event.KARAS_REFRESH);
        });
      }
    }, {
      key: "refreshTask",
      value: function refreshTask(cb) {
        var _this3 = this;

        var task = this.task; // 第一个添加延迟侦听

        if (!task.length) {
          frame.nextFrame(function () {
            if (task.length) {
              _this3.refresh();
            }
          });
        }

        task.push(cb);
      }
    }, {
      key: "cancelRefreshTask",
      value: function cancelRefreshTask(cb) {
        var task = this.task;

        for (var i = 0, len = task.length; i < len; i++) {
          if (task[i] === cb) {
            task.splice(i, 1);
            break;
          }
        }
      }
    }, {
      key: "node",
      get: function get() {
        return this.__node;
      }
    }, {
      key: "renderMode",
      get: function get() {
        return this.__renderMode;
      }
    }, {
      key: "task",
      get: function get() {
        return this.__task;
      }
    }, {
      key: "ref",
      get: function get() {
        return this.__ref;
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
            isDestroyed = _get$call.isDestroyed,
            display = _get$call.display,
            visibility = _get$call.visibility,
            originX = _get$call.originX,
            originY = _get$call.originY,
            stroke = _get$call.stroke,
            strokeWidth = _get$call.strokeWidth,
            strokeDasharray = _get$call.strokeDasharray,
            strokeLinecap = _get$call.strokeLinecap;

        if (isDestroyed || display === 'none' || visibility === 'hidden') {
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
          ctx.lineCap = strokeLinecap;
          ctx.setLineDash(strokeDasharray.split(','));
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

          var props = [['d', d], ['fill', 'none'], ['stroke', stroke], ['stroke-width', strokeWidth]];

          if (strokeDasharray.length) {
            props.push(['stroke-dasharray', strokeDasharray]);
          }

          if (strokeLinecap !== 'butt') {
            props.push(['stroke-linecap', strokeLinecap]);
          }

          this.addGeom('path', props);
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


      if (['TOP_RIGHT', 'BOTTOM_LEFT', 'BOTTOM_RIGHT'].indexOf(_this.props.origin) > -1) {
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
            isDestroyed = _get$call.isDestroyed,
            originX = _get$call.originX,
            originY = _get$call.originY,
            display = _get$call.display,
            visibility = _get$call.visibility,
            stroke = _get$call.stroke,
            strokeWidth = _get$call.strokeWidth,
            strokeDasharray = _get$call.strokeDasharray,
            strokeLinecap = _get$call.strokeLinecap;

        if (isDestroyed || display === 'none' || visibility === 'hidden') {
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

        var pts = [];

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
          ctx.lineCap = strokeLinecap;
          ctx.setLineDash(strokeDasharray.split(','));
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

          var props = [['points', _points], ['fill', 'none'], ['stroke', stroke], ['stroke-width', strokeWidth]];

          if (strokeDasharray.length) {
            props.push(['stroke-dasharray', strokeDasharray]);
          }

          if (strokeLinecap !== 'butt') {
            props.push(['stroke-linecap', strokeLinecap]);
          }

          this.addGeom('polyline', props);
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
            isDestroyed = _get$call.isDestroyed,
            originX = _get$call.originX,
            originY = _get$call.originY,
            display = _get$call.display,
            visibility = _get$call.visibility,
            fill = _get$call.fill,
            stroke = _get$call.stroke,
            strokeWidth = _get$call.strokeWidth,
            strokeDasharray = _get$call.strokeDasharray,
            strokeLinecap = _get$call.strokeLinecap;

        if (isDestroyed || display === 'none' || visibility === 'hidden') {
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

        var pts = [];
        points.forEach(function (item) {
          pts.push([originX + item[0] * width, originY + item[1] * height]);
        });

        if (renderMode === mode.CANVAS) {
          ctx.strokeStyle = stroke;
          ctx.lineWidth = strokeWidth;
          ctx.fillStyle = fill;
          ctx.lineCap = strokeLinecap;
          ctx.setLineDash(strokeDasharray.split(','));
          ctx.beginPath();
          ctx.moveTo(pts[0][0], pts[0][1]);

          for (var _i = 1, _len = pts.length; _i < _len; _i++) {
            var point = pts[_i];
            ctx.lineTo(point[0], point[1]);
          }

          ctx.lineTo(pts[0][0], pts[0][1]);
          ctx.fill();

          if (strokeWidth > 0) {
            ctx.stroke();
          }

          ctx.closePath();
        } else if (renderMode === mode.SVG) {
          var s = '';

          for (var _i2 = 0, _len2 = pts.length; _i2 < _len2; _i2++) {
            var _point = pts[_i2];
            s += "".concat(_point[0], ",").concat(_point[1], " ");
          }

          var props = [['points', s], ['fill', fill], ['stroke', stroke], ['stroke-width', strokeWidth]];

          if (strokeDasharray.length) {
            props.push(['stroke-dasharray', strokeDasharray]);
          }

          if (strokeLinecap !== 'butt') {
            props.push(['stroke-linecap', strokeLinecap]);
          }

          this.addGeom('polygon', props);
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
      } // 扇形大于180°时，是否闭合两端


      _this.__closure = false;

      if (_this.props.closure !== undefined) {
        _this.__closure = !!_this.props.closure;
      }

      return _this;
    }

    _createClass(Sector, [{
      key: "render",
      value: function render(renderMode) {
        var _get$call = _get(_getPrototypeOf(Sector.prototype), "render", this).call(this, renderMode),
            isDestroyed = _get$call.isDestroyed,
            cx = _get$call.cx,
            cy = _get$call.cy,
            display = _get$call.display,
            visibility = _get$call.visibility,
            fill = _get$call.fill,
            stroke = _get$call.stroke,
            strokeWidth = _get$call.strokeWidth,
            strokeDasharray = _get$call.strokeDasharray,
            strokeLinecap = _get$call.strokeLinecap;

        if (isDestroyed || display === 'none' || visibility === 'hidden') {
          return;
        }

        var width = this.width,
            height = this.height,
            ctx = this.ctx,
            begin = this.begin,
            end = this.end,
            r = this.r,
            edge = this.edge,
            closure = this.closure;

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
        var large = end - begin > 180 ? 1 : 0;

        if (renderMode === mode.CANVAS) {
          ctx.strokeStyle = stroke;
          ctx.lineWidth = strokeWidth;
          ctx.fillStyle = fill;
          ctx.lineCap = strokeLinecap;
          ctx.setLineDash(strokeDasharray.split(','));
          ctx.beginPath();
          ctx.arc(cx, cy, r, begin * Math.PI / 180 - OFFSET, end * Math.PI / 180 - OFFSET);

          if (edge) {
            if (!large || !closure) {
              ctx.lineTo(cx, cy);
            }

            ctx.lineTo(x1, y1);

            if (strokeWidth > 0) {
              ctx.stroke();
            }
          } else {
            if (strokeWidth > 0) {
              ctx.stroke();
            }

            if (!large || !closure) {
              ctx.lineTo(cx, cy);
            }

            ctx.lineTo(x1, y1);
          }

          ctx.fill();
          ctx.closePath();
        } else if (renderMode === mode.SVG) {
          if (edge) {
            var props = [['d', closure ? "M".concat(x1, " ").concat(y1, " A").concat(r, " ").concat(r, " 0 ").concat(large, " 1 ").concat(x2, " ").concat(y2, " z") : "M".concat(cx, " ").concat(cy, " L").concat(x1, " ").concat(y1, " A").concat(r, " ").concat(r, " 0 ").concat(large, " 1 ").concat(x2, " ").concat(y2, " z")], ['fill', fill], ['stroke', stroke], ['stroke-width', strokeWidth]];

            if (strokeDasharray.length) {
              props.push(['stroke-dasharray', strokeDasharray]);
            }

            if (strokeLinecap !== 'butt') {
              props.push(['stroke-linecap', strokeLinecap]);
            }

            this.addGeom('path', props);
          } else {
            this.addGeom('path', [['d', closure ? "M".concat(x1, " ").concat(y1, " A").concat(r, " ").concat(r, " 0 ").concat(large, " 1 ").concat(x2, " ").concat(y2, " z") : "M".concat(cx, " ").concat(cy, " L").concat(x1, " ").concat(y1, " A").concat(r, " ").concat(r, " 0 ").concat(large, " 1 ").concat(x2, " ").concat(y2, " z")], ['fill', fill]]);
            var _props = [['d', "M".concat(x1, " ").concat(y1, " A").concat(r, " ").concat(r, " 0 ").concat(large, " 1 ").concat(x2, " ").concat(y2)], ['fill', 'transparent'], ['stroke', stroke], ['stroke-width', strokeWidth]];

            if (strokeDasharray.length) {
              _props.push(['stroke-dasharray', strokeDasharray]);
            }

            if (strokeLinecap !== 'butt') {
              _props.push(['stroke-linecap', strokeLinecap]);
            }

            this.addGeom('path', _props);
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
    }, {
      key: "closure",
      get: function get() {
        return this.__closure;
      }
    }]);

    return Sector;
  }(Geom);

  var Rect =
  /*#__PURE__*/
  function (_Geom) {
    _inherits(Rect, _Geom);

    function Rect(tagName, props) {
      var _this;

      _classCallCheck(this, Rect);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Rect).call(this, tagName, props)); // 圆角

      _this.__xr = 0;

      if (_this.props.rx) {
        _this.__xr = parseFloat(_this.props.rx);

        if (isNaN(_this.xr)) {
          _this.__xr = 0;
        }
      }

      _this.__yr = 0;

      if (_this.props.ry) {
        _this.__yr = parseFloat(_this.props.ry);

        if (isNaN(_this.yr)) {
          _this.__yr = 0;
        }
      }

      return _this;
    }

    _createClass(Rect, [{
      key: "render",
      value: function render(renderMode) {
        var _get$call = _get(_getPrototypeOf(Rect.prototype), "render", this).call(this, renderMode),
            isDestroyed = _get$call.isDestroyed,
            originX = _get$call.originX,
            originY = _get$call.originY,
            display = _get$call.display,
            visibility = _get$call.visibility,
            fill = _get$call.fill,
            stroke = _get$call.stroke,
            strokeWidth = _get$call.strokeWidth,
            strokeDasharray = _get$call.strokeDasharray,
            strokeLinecap = _get$call.strokeLinecap;

        if (isDestroyed || display === 'none' || visibility === 'hidden') {
          return;
        }

        var width = this.width,
            height = this.height,
            ctx = this.ctx,
            xr = this.xr,
            yr = this.yr;
        xr = Math.min(xr, 0.5);
        yr = Math.min(yr, 0.5);
        xr *= width;
        yr *= height;

        if (renderMode === mode.CANVAS) {
          ctx.strokeStyle = stroke;
          ctx.lineWidth = strokeWidth;
          ctx.fillStyle = fill;
          ctx.lineCap = strokeLinecap;
          ctx.setLineDash(strokeDasharray.split(','));
          ctx.beginPath();

          if (xr === 0 && yr === 0) {
            ctx.moveTo(originX, originY);
            ctx.lineTo(originX + width, originY);
            ctx.lineTo(originX + width, originY + height);
            ctx.lineTo(originX, originY + height);
            ctx.lineTo(originX, originY);
          } else {
            var ox = xr * .5522848;
            var oy = yr * .5522848;
            ctx.moveTo(originX + xr, originY);
            ctx.lineTo(originX + width - xr, originY);
            ctx.bezierCurveTo(originX + width + ox - xr, originY, originX + width, originY + yr - oy, originX + width, originY + yr);
            ctx.lineTo(originX + width, originY + height - yr);
            ctx.bezierCurveTo(originX + width, originY + height + oy - yr, originX + width + ox - xr, originY + height, originX + width - xr, originY + height);
            ctx.lineTo(originX + xr, originY + height);
            ctx.bezierCurveTo(originX + xr - ox, originY + height, originX, originY + height + oy - yr, originX, originY + height - yr);
            ctx.lineTo(originX, originY + yr);
            ctx.bezierCurveTo(originX, originY + yr - oy, originX + xr - ox, originY, originX + xr, originY);
          }

          ctx.fill();

          if (strokeWidth > 0) {
            ctx.stroke();
          }

          ctx.closePath();
        } else if (renderMode === mode.SVG) {
          var props = [['x', originX], ['y', originY], ['width', width], ['height', height], ['fill', fill], ['stroke', stroke], ['stroke-width', strokeWidth]];

          if (xr) {
            props.push(['rx', xr]);
          }

          if (yr) {
            props.push(['ry', yr]);
          }

          if (strokeDasharray.length) {
            props.push(['stroke-dasharray', strokeDasharray]);
          }

          if (strokeLinecap !== 'butt') {
            props.push(['stroke-linecap', strokeLinecap]);
          }

          this.addGeom('rect', props);
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
            isDestroyed = _get$call.isDestroyed,
            cx = _get$call.cx,
            cy = _get$call.cy,
            display = _get$call.display,
            visibility = _get$call.visibility,
            fill = _get$call.fill,
            stroke = _get$call.stroke,
            strokeWidth = _get$call.strokeWidth,
            strokeDasharray = _get$call.strokeDasharray,
            strokeLinecap = _get$call.strokeLinecap;

        if (isDestroyed || display === 'none' || visibility === 'hidden') {
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
          ctx.lineCap = strokeLinecap;
          ctx.setLineDash(strokeDasharray.split(','));
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, 2 * Math.PI);
          ctx.fill();

          if (strokeWidth > 0) {
            ctx.stroke();
          }

          ctx.closePath();
        } else if (renderMode === mode.SVG) {
          var props = [['cx', cx], ['cy', cy], ['r', r], ['fill', fill], ['stroke', stroke], ['stroke-width', strokeWidth]];

          if (strokeDasharray.length) {
            props.push(['stroke-dasharray', strokeDasharray]);
          }

          if (strokeLinecap !== 'butt') {
            props.push(['stroke-linecap', strokeLinecap]);
          }

          this.addGeom('circle', props);
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
            isDestroyed = _get$call.isDestroyed,
            cx = _get$call.cx,
            cy = _get$call.cy,
            display = _get$call.display,
            visibility = _get$call.visibility,
            fill = _get$call.fill,
            stroke = _get$call.stroke,
            strokeWidth = _get$call.strokeWidth,
            strokeDasharray = _get$call.strokeDasharray,
            strokeLinecap = _get$call.strokeLinecap;

        if (isDestroyed || display === 'none' || visibility === 'hidden') {
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
          ctx.lineCap = strokeLinecap;
          ctx.setLineDash(strokeDasharray.split(','));
          ctx.beginPath();

          if (ctx.ellipse) {
            ctx.ellipse(cx, cy, xr, yr, 0, 0, 2 * Math.PI);
          } else {
            var ox = xr * .5522848;
            var oy = yr * .5522848;
            ctx.moveTo(cx - xr, cy);
            ctx.bezierCurveTo(cx - xr, cy - oy, cx - ox, cy - yr, cx, cy - yr);
            ctx.bezierCurveTo(cx + ox, cy - yr, cx + xr, cy - oy, cx + xr, cy);
            ctx.bezierCurveTo(cx + xr, cy + oy, cx + ox, cy + yr, cx, cy + yr);
            ctx.bezierCurveTo(cx - ox, cy + yr, cx - xr, cy + oy, cx - xr, cy);
          }

          ctx.fill();

          if (strokeWidth > 0) {
            ctx.stroke();
          }

          ctx.closePath();
        } else if (renderMode === mode.SVG) {
          var props = [['cx', cx], ['cy', cy], ['rx', xr], ['ry', yr], ['fill', fill], ['stroke', stroke], ['stroke-width', strokeWidth]];

          if (strokeDasharray.length) {
            props.push(['stroke-dasharray', strokeDasharray]);
          }

          if (strokeLinecap !== 'butt') {
            props.push(['stroke-linecap', strokeLinecap]);
          }

          this.addGeom('ellipse', props);
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

  function parse$1(karas, json, data) {
    if (util.isString(json)) {
      return json;
    }

    var tagName = json.tagName,
        _json$props = json.props,
        props = _json$props === void 0 ? {} : _json$props,
        _json$children = json.children,
        children = _json$children === void 0 ? [] : _json$children,
        animate = json.animate;
    var ref = props.ref;

    if (animate && ref) {
      data.animate.push({
        ref: ref,
        animate: animate
      });
    }

    if (tagName.charAt(0) === '$') {
      return karas.createGm(tagName, props);
    }

    return karas.createVd(tagName, props, children.map(function (item) {
      return parse$1(karas, item, data);
    }));
  }

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
        if (tagName === 'img') {
          return new Img(tagName, props);
        }

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
    parse: function parse(json, dom) {
      var data = {
        animate: []
      };
      json = util.clone(json);

      var vd = parse$1(this, json, data);

      this.render(vd, dom);
      data.animate.forEach(function (item) {
        var ref = item.ref,
            animate = item.animate;
        vd.ref[ref].animate(animate.value, animate.options);
      });
      return vd;
    },
    Root: Root,
    Dom: Dom,
    Img: Img,
    Geom: Geom,
    mode: mode,
    Component: Component,
    Event: Event,
    sort: sort,
    util: util,
    inject: inject,
    frame: frame
  };

  if (typeof window != 'undefined') {
    window.karas = karas;
  }

  return karas;

}));
//# sourceMappingURL=index.js.map
