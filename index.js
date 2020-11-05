(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.karas = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

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
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
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

  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
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

  function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();

    return function _createSuperInternal() {
      var Super = _getPrototypeOf(Derived),
          result;

      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;

        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }

      return _possibleConstructorReturn(this, result);
    };
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
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
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

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var Node = /*#__PURE__*/function () {
    function Node() {
      _classCallCheck(this, Node);

      this.__x = 0;
      this.__y = 0;
      this.__ox = 0; // relative造成的偏移量

      this.__oy = 0;
      this.__width = 0;
      this.__height = 0;
      this.__baseLine = 0; // 默认undefined
      // this.__prev = null;
      // this.__next = null;
      // this.__parent = null;
      // this.__root = null;
      // this.__host = null;
    }

    _createClass(Node, [{
      key: "__structure",
      value: function __structure(i, lv, j) {
        return this.__struct = {
          node: this,
          index: i,
          childIndex: j,
          lv: lv
        };
      }
    }, {
      key: "__modifyStruct",
      value: function __modifyStruct(root) {
        var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var struct = this.__struct;

        var ns = this.__structure(struct.index, struct.lv, struct.childIndex);

        root.__structs.splice(struct.index + offset, 1, ns);

        return [this.__struct, 1];
      }
    }, {
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
        this.__isDestroyed = true; // this.__parent = null;
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
      key: "sx",
      get: function get() {
        return this.x + this.ox;
      }
    }, {
      key: "sy",
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
      }
    }, {
      key: "domParent",
      get: function get() {
        if (this.__domParent !== undefined) {
          return this.__domParent;
        }

        var p = this;
        var root = this.root;

        while (p) {
          if (p === root) {
            p = undefined;
            break;
          }

          if (p.parent) {
            p = p.parent;
            break;
          }

          if (p.host) {
            p = p.host;
          }
        }

        return this.__domParent = p || null;
      } // canvas/svg根节点

    }, {
      key: "root",
      get: function get() {
        return this.__root;
      } // component根节点

    }, {
      key: "host",
      get: function get() {
        return this.__host;
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
    NUMBER: 3,
    INHERIT: 4,
    DEG: 5,
    STRING: 6,
    RGBA: 7
  };

  var font = {
    arial: {
      lhr: 1.14990234375,
      // 默认line-height ratio，(67+1854+434)/2048
      car: 1.1171875,
      // content-area ratio，(1854+434)/2048
      blr: 0.9052734375 // base-line ratio，1854/2048
      // mdr: 0.64599609375, // middle ratio，(1854-1062/2)/2048
      // lgr: 0.03271484375, // line-gap ratio，67/2048

    } // 'pingfang sc': {
    //   lhr: 1.4, // (0+1060+340)/1000
    //   car: 1.4, // (1060+340)/1000
    //   blr: 1.06, // 1060/1000
    // },

  };

  // 类型为引用防止json仿造
  var TYPE_VD = {
    _: 1
  };
  var TYPE_GM = {
    _: 2
  };
  var TYPE_CP = {
    _: 3
  };
  var $$type = {
    TYPE_VD: TYPE_VD,
    TYPE_GM: TYPE_GM,
    TYPE_CP: TYPE_CP
  };

  // 生成3*3单位矩阵，css表达方法一维6位
  function identity() {
    return [1, 0, 0, 1, 0, 0];
  } // 矩阵a*b，固定两个matrix都是长度6


  function multiply(a, b) {
    // 特殊情况优化
    var isPreIdA = a[0] === 1 && a[1] === 0 && a[2] === 0 && a[3] === 1;
    var isPreIdB = b[0] === 1 && b[1] === 0 && b[2] === 0 && b[3] === 1;
    var isSubIdA = a[4] === 0 && a[5] === 0;
    var isSubIdB = b[4] === 0 && b[5] === 0;

    if (isPreIdA && isSubIdA) {
      return b.slice(0);
    }

    if (isPreIdB && isSubIdB) {
      return a.slice(0);
    }

    if (isPreIdA && isPreIdB) {
      a = a.slice(0);
      a[4] += b[4];
      a[5] += b[5];
      return a;
    } else if (isPreIdA || isPreIdB) {
      var _c = isPreIdA ? b.slice(0) : a.slice(0);

      _c[4] = a[0] * b[4] + a[2] * b[5] + a[4];
      _c[5] = a[1] * b[4] + a[3] * b[5] + a[5];
      return _c;
    }

    var c = [a[0] * b[0] + a[2] * b[1], a[1] * b[0] + a[3] * b[1], a[0] * b[2] + a[2] * b[3], a[1] * b[2] + a[3] * b[3], 0, 0];

    if (isSubIdA && isSubIdB) ; else if (isSubIdB) {
      c[4] = a[4];
      c[5] = a[5];
    } else {
      c[4] = a[0] * b[4] + a[2] * b[5] + a[4];
      c[5] = a[1] * b[4] + a[3] * b[5] + a[5];
    }

    return c;
  }

  function calPoint(point, m) {
    var _point = _slicedToArray(point, 2),
        x = _point[0],
        y = _point[1];

    var _m = _slicedToArray(m, 6),
        a = _m[0],
        b = _m[1],
        c = _m[2],
        d = _m[3],
        e = _m[4],
        f = _m[5];

    return [a * x + c * y + e, b * x + d * y + f];
  }

  function int2convolution(v) {
    var d = Math.floor(v * 3 * Math.sqrt(2 * Math.PI) / 4 + 0.5);
    d *= 3;

    if (d % 2 === 0) {
      d++;
    }

    return d;
  }
  /**
   * 初等行变换求3*3特定css的matrix方阵，一维6长度
   * @param m
   */


  function inverse(m) {
    var _m2 = _slicedToArray(m, 6),
        a = _m2[0],
        b = _m2[1],
        c = _m2[2],
        d = _m2[3],
        e = _m2[4],
        f = _m2[5];

    if (a === 1 && b === 0 && c === 0 && d === 1 && e === 0 && f === 0) {
      return m;
    }

    var ar = 1;
    var br = 0;
    var cr = 0;
    var dr = 1;
    var er = 0;
    var fr = 0; // 先检查a是否为0，强制a为1

    if (a === 0) {
      if (b === 1) {
        var _ref = [b, a, d, c, f, e, br, ar, dr, cr, fr, er];
        a = _ref[0];
        b = _ref[1];
        c = _ref[2];
        d = _ref[3];
        e = _ref[4];
        f = _ref[5];
        ar = _ref[6];
        br = _ref[7];
        cr = _ref[8];
        dr = _ref[9];
        er = _ref[10];
        fr = _ref[11];
      } else if (b === 0) {
        return [0, 0, 0, 0, 0, 0];
      } // R1 + R2/b
      else {
          a = 1;
          c += c / b;
          e += e / b;
          ar += ar / b;
          cr += cr / b;
          er += er / b;
          b = 0;
        }
    } // b/a=x，R2-R1*x，b为0可优化


    if (b !== 0) {
      var x = b / a;
      b = 0;
      d -= c * x;
      f -= e * x;
      br -= ar * x;
      dr -= cr * x;
      fr -= er * x;
    } // R1/a，a为0或1可优化


    if (a !== 1) {
      c /= a;
      e /= a;
      ar /= a;
      cr /= a;
      er /= a;
      a = 1;
    } // c/d=y，R1-R2*y，c为0可优化


    if (c !== 0) {
      var y = c / d;
      c = 0;
      e -= f * y;
      ar -= br * y;
      cr -= dr * y;
      er -= fr * y;
    } // 检查d是否为0，如果为0转成1，R2+1-R1


    if (d === 0) {
      d = 1;
      f += 1 - e;
      br += 1 - ar;
      dr += 1 - cr;
      fr += 1 - er;
    } // R2/d，d为1可优化
    else if (d !== 1) {
        f /= d;
        br /= d;
        dr /= d;
        fr /= d;
        d = 1;
      } // R1-R3*e，R2-R3*f，e/f为0可优化


    if (e !== 0) {
      er -= e;
      e = 0;
    }

    if (f !== 0) {
      fr -= f;
      f = 0;
    }

    return [ar, br, cr, dr, er, fr];
  }

  var mx = {
    identity: identity,
    multiply: multiply,
    calPoint: calPoint,
    int2convolution: int2convolution,
    inverse: inverse
  };

  var toString = {}.toString;

  function isType(type) {
    return function (obj) {
      return toString.call(obj) === '[object ' + type + ']';
    };
  }

  var isObject = isType('Object');
  var isString = isType('String');
  var isFunction = isType('Function');
  var isNumber = isType('Number');
  var isBoolean = isType('Boolean');
  var isDate = isType('Date');

  function isNil(v) {
    return v === undefined || v === null;
  }

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

    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/ /g, '&nbsp;');
  } // 根元素专用


  function joinVirtualDom(vd) {
    var s = '<defs>';
    vd.defs.forEach(function (item) {
      s += joinDef(item);
    });
    s += '</defs><g';

    if (vd.bbClip) {
      s += ' clip-path="' + vd.bbClip + '"';
    }

    s += '>';
    vd.bb.forEach(function (item) {
      s += joinVd(item);
    });
    s += '</g><g';

    if (vd.conClip) {
      s += ' clip-path="' + vd.conClip + '"';
    }

    s += '>';
    (vd.children || []).forEach(function (item) {
      if (item.isMask || item.isClip) {
        return;
      }

      s += joinVd(item);
    });
    s += '</g>';
    return s;
  } // 普通元素


  function joinVd(vd) {
    if (vd.type === 'item' || vd.type === 'img') {
      var s = '';
      (vd.props || []).forEach(function (item) {
        s += ' ' + item[0] + '="' + item[1] + '"';
      });

      if (vd.tagName === 'text') {
        return '<text' + s + '>' + vd.content + '</text>';
      }

      return '<' + vd.tagName + s + '/>';
    } else if (vd.type === 'text') {
      var _s = ""; // text有许多lineBox

      (vd.children || []).forEach(function (item) {
        _s += joinVd(item);
      });
      return '<g>' + _s + '</g>';
    } else if (vd.type === 'dom' || vd.type === 'geom') {
      var _s2 = '<g';

      if (vd.bbClip) {
        _s2 += ' clip-path="' + vd.bbClip + '"';
      }

      _s2 += '>';
      vd.bb.forEach(function (item) {
        _s2 += joinVd(item);
      });
      _s2 += '</g><g';

      if (vd.conClip) {
        _s2 += ' clip-path="' + vd.conClip + '"';
      }

      _s2 += '>';
      (vd.children || []).forEach(function (item) {
        if (item.isMask || item.isClip) {
          return;
        }

        _s2 += joinVd(item);
      });
      _s2 += '</g>';
      var opacity = vd.opacity,
          transform = vd.transform,
          visibility = vd.visibility,
          mask = vd.mask,
          clip = vd.clip,
          filter = vd.filter;
      return '<g' + (opacity !== 1 && opacity !== undefined ? ' opacity="' + opacity + '"' : '') + (transform ? ' transform="' + transform + '"' : '') + ' visibility="' + visibility + '"' + (mask ? ' mask="' + mask + '"' : '') + (clip ? ' clip-path="' + clip + '"' : '') + (filter ? ' filter="' + filter + '"' : '') + '>' + _s2 + '</g>';
    }
  }

  function joinDef(def) {
    var s = '<' + def.tagName + ' id="' + def.uuid + '"';

    if (def.tagName === 'mask' || def.tagName === 'clipPath') ; else if (def.tagName === 'filter') ; else {
      s += ' gradientUnits="userSpaceOnUse"';
    }

    (def.props || []).forEach(function (item) {
      s += ' ' + item[0] + '="' + item[1] + '"';
    });
    s += '>';
    (def.children || []).forEach(function (item) {
      s += joinItem(item);
    });
    s += '</' + def.tagName + '>';
    return s;
  }

  function joinItem(item) {
    var s = '<' + item.tagName;
    (item.props || []).forEach(function (item) {
      s += ' ' + item[0] + '="' + item[1] + '"';
    });
    s += '></' + item.tagName + '>';
    return s;
  }

  function rgba2int(color) {
    if (Array.isArray(color)) {
      return color;
    }

    var res = [];

    if (!color || color === 'transparent') {
      res = [0, 0, 0, 0];
    } else if (color.charAt(0) === '#') {
      color = color.slice(1);

      if (color.length === 3) {
        res.push(parseInt(color.charAt(0) + color.charAt(0), 16));
        res.push(parseInt(color.charAt(1) + color.charAt(1), 16));
        res.push(parseInt(color.charAt(2) + color.charAt(2), 16));
      } else if (color.length === 6) {
        res.push(parseInt(color.slice(0, 2), 16));
        res.push(parseInt(color.slice(2, 4), 16));
        res.push(parseInt(color.slice(4), 16));
      } else {
        res[0] = res[1] = res[2] = 0;
      }

      res[3] = 1;
    } else {
      var c = color.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)/i);

      if (c) {
        res = [parseInt(c[1]), parseInt(c[2]), parseInt(c[3])];

        if (!isNil(c[4])) {
          res[3] = parseFloat(c[4]);
        } else {
          res[3] = 1;
        }
      } else {
        res = [0, 0, 0, 0];
      }
    }

    return res;
  }

  function int2rgba(color) {
    if (Array.isArray(color)) {
      if (color.length === 4) {
        return 'rgba(' + joinArr(color, ',') + ')';
      } else if (color.length === 3) {
        return 'rgba(' + joinArr(color, ',') + ',1)';
      }
    }

    return color || 'rgba(0,0,0,0)';
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
    } // parse递归会出现内部先返回解析好的json，外部parse不能clone


    if (obj.$$type === $$type.TYPE_VD || obj.$$type === $$type.TYPE_GM || obj.$$type === $$type.TYPE_CP) {
      return obj;
    }

    if (util.isDate(obj)) {
      return new Date(obj);
    }

    var n = Array.isArray(obj) ? [] : {};
    Object.keys(obj).forEach(function (i) {
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
    if (!a || !b) {
      return a === b;
    }

    if (a.length !== b.length) {
      return false;
    }

    for (var i = 0, len = a.length; i < len; i++) {
      var ai = a[i];
      var bi = b[i];
      var isArrayA = Array.isArray(ai);
      var isArrayB = Array.isArray(bi);

      if (isArrayA && isArrayB) {
        if (!equalArr(ai, bi)) {
          return false;
        }
      } else if (isArrayA || isArrayB) {
        return false;
      } else if (ai !== bi) {
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
    if (a === b) {
      return true;
    }

    if (isObject(a) && isObject(b)) {
      var hash = {};

      for (var i = 0, arr = Object.keys(a), len = arr.length; i < len; i++) {
        var k = arr[i];

        if (!b.hasOwnProperty(k) || !equal(a[k], b[k])) {
          return false;
        }

        hash[k] = true;
      } // a没有b有则false


      for (var _i = 0, _arr = Object.keys(b), _len = _arr.length; _i < _len; _i++) {
        var _k = _arr[_i];

        if (!hash.hasOwnProperty(_k)) {
          return false;
        }
      }
    } else if (isDate(a) && isDate(b)) {
      return a.getTime() === b.getTime();
    } else if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) {
        return false;
      }

      for (var _i2 = 0, _len2 = a.length; _i2 < _len2; _i2++) {
        if (!equal(a[_i2], b[_i2])) {
          return false;
        }
      }
    } else {
      return a === b;
    }

    return true;
  }

  function extend(target, source, keys) {
    if (source === null || _typeof(source) !== 'object') {
      return target;
    }

    if (!keys) {
      keys = Object.keys(source);
    }

    var i = 0;
    var len = keys.length;

    while (i < len) {
      var k = keys[i];
      target[k] = source[k];
      i++;
    }

    return target;
  }

  function joinArr(arr, split) {
    var s = arr.length ? arr[0] : '';

    for (var i = 1, len = arr.length; i < len; i++) {
      s += split + arr[i];
    }

    return s;
  }

  function extendAnimate(ovd, nvd) {
    var list = nvd.__animationList = ovd.animationList.splice(0);
    list.forEach(function (item) {
      item.__target = nvd; // 事件队列的缘故，可能动画本帧刚执行过，然后再继承，就会缺失，需再次赋值一遍；也有可能停留最后

      if (item.assigning || item.finished && item.__stayEnd()) {
        item.assignCurrentStyle();
      }
    });
  }

  function transformBbox(bbox, matrix) {
    var dx = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var dy = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

    if (!equalArr(matrix, [1, 0, 0, 1, 0, 0])) {
      var _bbox = bbox,
          _bbox2 = _slicedToArray(_bbox, 4),
          x1 = _bbox2[0],
          y1 = _bbox2[1],
          x2 = _bbox2[2],
          y2 = _bbox2[3]; // 可能因filter的原因扩展范围


      if (dx) {
        x1 -= dx;
        x2 += dx;
      }

      if (dy) {
        y1 -= dy;
        y2 += dy;
      }

      var list = [x2, y1, x1, y2, x2, y2];

      var _mx$calPoint = mx.calPoint([x1, y1], matrix);

      var _mx$calPoint2 = _slicedToArray(_mx$calPoint, 2);

      x1 = _mx$calPoint2[0];
      y1 = _mx$calPoint2[1];
      var xa = x1,
          ya = y1,
          xb = x1,
          yb = y1;

      for (var i = 0; i < 6; i += 2) {
        var x = list[i],
            y = list[i + 1];

        var _mx$calPoint3 = mx.calPoint([x, y], matrix);

        var _mx$calPoint4 = _slicedToArray(_mx$calPoint3, 2);

        x = _mx$calPoint4[0];
        y = _mx$calPoint4[1];
        xa = Math.min(xa, x);
        xb = Math.max(xa, x);
        ya = Math.min(ya, y);
        yb = Math.max(yb, y);
      }

      bbox = [xa, ya, xb, yb];
    }

    return bbox;
  }

  var util = {
    isObject: isObject,
    isString: isString,
    isFunction: isFunction,
    isNumber: isNumber,
    isBoolean: isBoolean,
    isDate: isDate,
    isNil: isNil,
    isPrimitive: function isPrimitive(v) {
      return util.isNil(v) || util.isBoolean(v) || util.isString(v) || util.isNumber(v);
    },
    // css中常用undefined/null表示auto本身
    isAuto: function isAuto(v) {
      return isNil(v) || v === 'auto';
    },
    stringify: stringify,
    joinSourceArray: function joinSourceArray(arr) {
      return _joinSourceArray(arr);
    },
    encodeHtml: encodeHtml,
    joinVirtualDom: joinVirtualDom,
    joinVd: joinVd,
    joinDef: joinDef,
    rgba2int: rgba2int,
    int2rgba: int2rgba,
    arr2hash: arr2hash,
    hash2arr: hash2arr,
    clone: clone,
    equalArr: equalArr,
    equal: equal,
    extend: extend,
    joinArr: joinArr,
    extendAnimate: extendAnimate,
    transformBbox: transformBbox
  };

  var reg = {
    position: /((-?[\d.]+(px|%)?)|(left|top|right|bottom|center)){1,2}/ig,
    // tfo: /((-?[\d.]+(px|%)?)|(left|top|right|bottom|center)){1,2}/ig,
    gradient: /\b(\w+)-gradient\((.+)\)/i,
    img: /(?:\burl\((['"]?)(.*?)\1\))|(?:\b((data:)))/i
  };

  var H = 4 * (Math.sqrt(2) - 1) / 3; // 向量积

  function vectorProduct(x1, y1, x2, y2) {
    return x1 * y2 - x2 * y1;
  }

  function pointInPolygon(x, y, vertexes) {
    // 先取最大最小值得一个外围矩形，在外边可快速判断false
    var _vertexes$ = _slicedToArray(vertexes[0], 2),
        xmax = _vertexes$[0],
        ymax = _vertexes$[1];

    var _vertexes$2 = _slicedToArray(vertexes[0], 2),
        xmin = _vertexes$2[0],
        ymin = _vertexes$2[1];

    var len = vertexes.length;

    for (var i = 1; i < len; i++) {
      var _vertexes$i = _slicedToArray(vertexes[i], 2),
          _x = _vertexes$i[0],
          _y = _vertexes$i[1];

      xmax = Math.max(xmax, _x);
      ymax = Math.max(ymax, _y);
      xmin = Math.min(xmin, _x);
      ymin = Math.min(ymin, _y);
    }

    if (x < xmin || y < ymin || x > xmax || y > ymax) {
      return false;
    } // 所有向量积均为非负数说明在多边形内或边上


    for (var _i = 0, _len = vertexes.length; _i < _len; _i++) {
      var _vertexes$_i = _slicedToArray(vertexes[_i], 2),
          x1 = _vertexes$_i[0],
          y1 = _vertexes$_i[1];

      var _vertexes = _slicedToArray(vertexes[(_i + 1) % _len], 2),
          x2 = _vertexes[0],
          y2 = _vertexes[1];

      if (vectorProduct(x2 - x1, y2 - y1, x - x1, y - y1) < 0) {
        return false;
      }
    }

    return true;
  }
  /**
   * 余弦定理3边长求夹角
   * @param a
   * @param b
   * @param c
   */


  function angleBySide(a, b, c) {
    var theta = (Math.pow(b, 2) + Math.pow(c, 2) - Math.pow(a, 2)) / (2 * b * c);
    return Math.acos(theta);
  }
  /**
   * 两点距离
   * @param x1
   * @param y1
   * @param x2
   * @param y2
   */


  function pointsDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }
  /**
   * 三角形内心
   * @param x1
   * @param y1
   * @param x2
   * @param y2
   * @param x3
   * @param y3
   */


  function triangleIncentre(x1, y1, x2, y2, x3, y3) {
    var a = pointsDistance(x2, y2, x3, y3);
    var b = pointsDistance(x1, y1, x3, y3);
    var c = pointsDistance(x1, y1, x2, y2);
    return [(a * x1 + b * x2 + c * x3) / (a + b + c), (a * y1 + b * y2 + c * y3) / (a + b + c)];
  }
  /**
   * 椭圆圆心和长短轴生成4个端点和控制点
   */


  function ellipsePoints(x, y, a) {
    var b = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : a;
    var ox = a * H;
    var oy = b === a ? ox : b * H;
    return [[x - a, y], [x - a, y - oy, x - ox, y - b, x, y - b], [x + ox, y - b, x + a, y - oy, x + a, y], [x + a, y + oy, x + ox, y + b, x, y + b], [x - ox, y + b, x - a, y + oy, x - a, y]];
  }
  /**
   * 获取2个矩形重叠区域，如不重叠返回null
   * @param a
   * @param b
   */


  function getRectsIntersection(a, b) {
    if (!isRectsOverlap(a, b)) {
      return null;
    }

    var _a = _slicedToArray(a, 4),
        ax1 = _a[0],
        ay1 = _a[1],
        ax4 = _a[2],
        ay4 = _a[3];

    var _b = _slicedToArray(b, 4),
        bx1 = _b[0],
        by1 = _b[1],
        bx4 = _b[2],
        by4 = _b[3];

    return [Math.max(ax1, bx1), Math.max(ay1, by1), Math.min(ax4, bx4), Math.min(ay4, by4)];
  }
  /**
   * 2个矩形是否重叠
   * @param a
   * @param b
   */


  function isRectsOverlap(a, b) {
    var _a2 = _slicedToArray(a, 4),
        ax1 = _a2[0],
        ay1 = _a2[1],
        ax4 = _a2[2],
        ay4 = _a2[3];

    var _b2 = _slicedToArray(b, 4),
        bx1 = _b2[0],
        by1 = _b2[1],
        bx4 = _b2[2],
        by4 = _b2[3];

    if (ax1 >= bx4 || ay1 >= by4 || bx1 >= ax4 || by1 >= ay4) {
      return false;
    }

    return true;
  }
  /**
   * 2个矩形是否包含，a包含b
   * @param a
   * @param b
   */


  function isRectsInside(a, b) {
    var _a3 = _slicedToArray(a, 4),
        ax1 = _a3[0],
        ay1 = _a3[1],
        ax4 = _a3[2],
        ay4 = _a3[3];

    var _b3 = _slicedToArray(b, 4),
        bx1 = _b3[0],
        by1 = _b3[1],
        bx4 = _b3[2],
        by4 = _b3[3];

    if (ax1 <= bx1 && ay1 <= by1 && ax4 >= bx4 && ay4 >= by4) {
      return true;
    }

    return false;
  }

  function calCoordsInNode(px, py, node) {
    var _node$matrix = node.matrix,
        matrix = _node$matrix === void 0 ? [1, 0, 0, 1, 0, 0] : _node$matrix,
        _node$computedStyle = node.computedStyle,
        computedStyle = _node$computedStyle === void 0 ? {} : _node$computedStyle;
    var width = computedStyle.width,
        height = computedStyle.height,
        _computedStyle$transf = computedStyle.transformOrigin;
    _computedStyle$transf = _computedStyle$transf === void 0 ? [width * 0.5, height * 0.5] : _computedStyle$transf;

    var _computedStyle$transf2 = _slicedToArray(_computedStyle$transf, 2),
        ox = _computedStyle$transf2[0],
        oy = _computedStyle$transf2[1];

    var _mx$calPoint = mx.calPoint([px * width - ox, py * height - oy], matrix);

    var _mx$calPoint2 = _slicedToArray(_mx$calPoint, 2);

    px = _mx$calPoint2[0];
    py = _mx$calPoint2[1];
    return [px + ox, py + oy];
  }

  function calPercentInNode(x, y, node) {
    var _node$computedStyle2 = node.computedStyle,
        width = _node$computedStyle2.width,
        height = _node$computedStyle2.height,
        _node$computedStyle2$ = _slicedToArray(_node$computedStyle2.transformOrigin, 2),
        ox = _node$computedStyle2$[0],
        oy = _node$computedStyle2$[1]; // 先求无旋转时右下角相对于原点的角度ds


    var ds = Math.atan((height - oy) / (width - ox));

    var _calCoordsInNode = calCoordsInNode(1, 1, node),
        _calCoordsInNode2 = _slicedToArray(_calCoordsInNode, 2),
        x1 = _calCoordsInNode2[0],
        y1 = _calCoordsInNode2[1];

    var d1;
    var deg; // 根据旋转后的坐标，分4个象限，求旋转后的右下角相对于原点的角度d1，得出偏移角度deg，分顺逆时针[-180, 180]

    if (x1 >= ox && y1 >= oy) {
      if (ox === x1) {
        d1 = -Math.atan(Infinity);
      } else {
        d1 = Math.atan((y1 - oy) / (x1 - ox));
      }

      deg = d1 - ds;
    } else if (x1 >= ox && y1 < oy) {
      if (ox === x1) {
        d1 = -Math.atan(Infinity);
      } else {
        d1 = Math.atan((oy - y1) / (x1 - ox));
      }

      deg = d1 + ds;
    } else if (x1 < ox && y1 >= oy) {
      d1 = Math.atan((y1 - oy) / (ox - x1));
      deg = d1 - ds;
    } else if (x1 < ox && y1 < oy) {
      d1 = Math.atan((y1 - oy) / (x1 - ox));

      if (ds >= d1) {
        deg = d1 + Math.PI - ds;
      } else {
        deg = Math.PI - d1 + ds;
        deg = -deg;
      }
    } else {
      deg = 0;
    } // 目标点到原点的边长不会变


    var dt = Math.sqrt(Math.pow(x - ox, 2) + Math.pow(y - oy, 2)); // 分4个象限，先求目标点到原点的角度d2，再偏移deg后求得原始坐标

    var d2;

    if (x >= ox && y >= oy) {
      if (ox === x) {
        d2 = -Math.atan(Infinity);
      } else {
        d2 = Math.atan((y - oy) / (x - ox));
      }
    } else if (x >= ox && y < oy) {
      if (ox === x) {
        d2 = -Math.atan(Infinity);
      } else {
        d2 = -Math.atan((y - oy) / (ox - x));
      }
    } else if (x < ox && y >= oy) {
      d2 = Math.PI - Math.atan((y - oy) / (ox - x));
    } else {
      d2 = Math.atan((y - oy) / (x - ox)) - Math.PI;
    }

    d2 -= deg;

    if (d2 > Math.PI) {
      d2 -= Math.PI;
      return [(ox - dt * Math.cos(d2)) / width, (oy - dt * Math.sin(d2)) / height];
    }

    if (d2 > Math.PI * 0.5) {
      d2 = Math.PI - d2;
      return [(ox - dt * Math.cos(d2)) / width, (oy + dt * Math.sin(d2)) / height];
    }

    if (d2 >= 0) {
      return [(ox + dt * Math.cos(d2)) / width, (oy + dt * Math.sin(d2)) / height];
    }

    if (d2 >= -Math.PI * 0.5) {
      d2 = -d2;
      return [(ox + dt * Math.cos(d2)) / width, (oy - dt * Math.sin(d2)) / height];
    }

    if (d2 >= -Math.PI) {
      d2 = Math.PI + d2;
      return [(ox - dt * Math.cos(d2)) / width, (oy - dt * Math.sin(d2)) / height];
    }

    d2 = -Math.PI - d2;
    return [(ox - dt * Math.cos(d2)) / width, (oy + dt * Math.sin(d2)) / height];
  }

  function d2r(n) {
    return n * Math.PI / 180;
  }

  function r2d(n) {
    return n * 180 / Math.PI;
  }
  /**
   * 二阶贝塞尔曲线范围框
   * @param x0
   * @param y0
   * @param x1
   * @param y1
   * @param x2
   * @param y2
   * @returns {number[]}
   * https://www.iquilezles.org/www/articles/bezierbbox/bezierbbox.htm
   */


  function bboxBezier2(x0, y0, x1, y1, x2, y2) {
    var minX = Math.min(x0, x2);
    var minY = Math.min(y0, y2);
    var maxX = Math.max(x0, x2);
    var maxY = Math.max(y0, y2); // 控制点位于边界内部时，边界就是范围框，否则计算导数获取极值

    if (x1 < minX || y1 < minY || x1 > maxX || y1 > maxY) {
      var tx = (x0 - x1) / (x0 - 2 * x1 + x2);
      var ty = (y0 - y1) / (y0 - x * y1 + y2);
      var sx = 1 - tx;
      var sy = 1 - ty;
      var qx = sx * sx * x0 + 2 * sx * tx * x1 + tx * tx * x2;
      var qy = sy * sy * y0 + 2 * sy * ty * y1 + ty * ty * y2;
      minX = Math.min(minX, qx);
      minY = Math.min(minY, qy);
      maxX = Math.min(maxX, qx);
      maxY = Math.min(maxY, qy);
    }

    return [minX, minY, maxX, maxY];
  }
  /**
   * 同上三阶的
   */


  function bboxBezier3(x0, y0, x1, y1, x2, y2, x3, y3) {
    var minX = Math.min(x0, x3);
    var minY = Math.min(y0, y3);
    var maxX = Math.max(x0, x3);
    var maxY = Math.max(y0, y3);

    if (x1 < minX || y1 < minY || x1 > maxX || y1 > maxY || x2 < minX || y2 < minY || x2 > maxX || y2 > maxY) {
      var cx = -x0 + x1;
      var cy = -y0 + y1;
      var bx = x0 - 2 * x1 + x2;
      var by = y0 - 2 * y1 + y2;
      var ax = -x0 + 3 * x1 - 3 * x2 + x3;
      var ay = -y0 + 3 * y1 - 3 * y2 + y3;
      var hx = bx * bx - ax * cx;
      var hy = by * by - ay * cy;

      if (hx > 0) {
        hx = Math.sqrt(hx);
        var t = (-bx - hx) / ax;

        if (t > 0 && t < 1) {
          var s = 1 - t;
          var q = s * s * s * x0 + 3 * s * s * t * x1 + 3 * s * t * t * x2 + t * t * t * x3;
          minX = Math.min(minX, q);
          maxX = Math.max(maxX, q);
        }

        t = (-bx + hx) / ax;

        if (t > 0 && t < 1) {
          var _s = 1 - t;

          var _q = _s * _s * _s * x0 + 3 * _s * _s * t * x1 + 3 * _s * t * t * x2 + t * t * t * x3;

          minX = Math.min(minX, _q);
          maxX = Math.max(maxX, _q);
        }
      }

      if (hy > 0) {
        hy = Math.sqrt(hy);

        var _t = (-by - hy) / ay;

        if (_t > 0 && _t < 1) {
          var _s2 = 1 - _t;

          var _q2 = _s2 * _s2 * _s2 * y0 + 3 * _s2 * _s2 * _t * y1 + 3 * _s2 * _t * _t * y2 + _t * _t * _t * y3;

          minY = Math.min(minY, _q2);
          maxY = Math.max(maxY, _q2);
        }

        _t = (-by + hy) / ay;

        if (_t > 0 && _t < 1) {
          var _s3 = 1 - _t;

          var _q3 = _s3 * _s3 * _s3 * y0 + 3 * _s3 * _s3 * _t * y1 + 3 * _s3 * _t * _t * y2 + _t * _t * _t * y3;

          minY = Math.min(minY, _q3);
          maxY = Math.max(maxY, _q3);
        }
      }
    }

    return [minX, minY, maxX, maxY];
  }

  function bboxBezier(x0, y0, x1, y1, x2, y2, x3, y3) {
    if (arguments.length === 4) {
      return [x0, y0, x1, y1];
    }

    if (arguments.length === 6) {
      return bboxBezier2(x0, y0, x1, y1, x2, y2);
    }

    if (arguments.length === 8) {
      return bboxBezier3(x0, y0, x1, y1, x2, y2, x3, y3);
    }
  }
  /**
   * 范数 or 模
   */


  function norm(v) {
    var order = v.length;
    var sum = v.reduce(function (a, b) {
      return Math.pow(a, order) + Math.pow(b, order);
    });
    return Math.pow(sum, 1 / order);
  }

  function simpson38(derivativeFunc, l, r) {
    var f = derivativeFunc;
    var middleL = (2 * l + r) / 3;
    var middleR = (l + 2 * r) / 3;
    return (f(l) + 3 * f(middleL) + 3 * f(middleR) + f(r)) * (r - l) / 8;
  }
  /**
   * bezier 曲线的长度
   * @param derivativeFunc 微分函数
   * @param l 左点
   * @param r 右点
   * @param eps 精度
   * @return {*} number
   */


  function adaptiveSimpson38(derivativeFunc, l, r) {
    var eps = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0.001;
    var f = derivativeFunc;
    var mid = (l + r) / 2;
    var st = simpson38(f, l, r);
    var sl = simpson38(f, l, mid);
    var sr = simpson38(f, mid, r);
    var ans = sl + sr - st;

    if (Math.abs(ans) <= 15 * eps) {
      return sl + sr + ans / 15;
    }

    return adaptiveSimpson38(f, l, mid, eps / 2) + adaptiveSimpson38(f, mid, r, eps / 2);
  }
  /**
   * bezier 曲线的长度
   * @param points 曲线的起止点 和 控制点
   * @param order 阶次， 2 和 3
   * @param startT 计算长度的起点，满足 0 <= startT <= endT <= 1
   * @param endT 计算长度的终点
   * @return {*} number
   */


  function bezierLength(points, order) {
    var startT = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var endT = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;

    var derivativeFunc = function derivativeFunc(t) {
      return norm(at(t, points, order));
    };

    return adaptiveSimpson38(derivativeFunc, startT, endT);
  }
  /**
   * 3 阶 bezier 曲线的 order 阶导数在 t 位置时候的 (x, y) 的值
   */


  function at3(t, points) {
    var order = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

    var _points = _slicedToArray(points, 4),
        p0 = _points[0],
        p1 = _points[1],
        p2 = _points[2],
        p3 = _points[3];

    var _p = _slicedToArray(p0, 2),
        x0 = _p[0],
        y0 = _p[1];

    var _p2 = _slicedToArray(p1, 2),
        x1 = _p2[0],
        y1 = _p2[1];

    var _p3 = _slicedToArray(p2, 2),
        x2 = _p3[0],
        y2 = _p3[1];

    var _p4 = _slicedToArray(p3, 2),
        x3 = _p4[0],
        y3 = _p4[1];

    var x = 0;
    var y = 0;

    if (order === 0) {
      x = Math.pow(1 - t, 3) * x0 + 3 * t * Math.pow(1 - t, 2) * x1 + 3 * (1 - t) * Math.pow(t, 2) * x2 + Math.pow(t, 3) * x3;
      y = Math.pow(1 - t, 3) * y0 + 3 * t * Math.pow(1 - t, 2) * y1 + 3 * (1 - t) * Math.pow(t, 2) * y2 + Math.pow(t, 3) * y3;
    } else if (order === 1) {
      x = 3 * ((1 - t) * (1 - t) * (x1 - x0) + 2 * (1 - t) * t * (x2 - x1) + t * t * (x3 - x2));
      y = 3 * ((1 - t) * (1 - t) * (y1 - y0) + 2 * (1 - t) * t * (y2 - y1) + t * t * (y3 - y2));
    } else if (order === 2) {
      x = 6 * (x2 - 2 * x1 + x0) * (1 - t) + 6 * (x3 - 2 * x2 + x1) * t;
      y = 6 * (y2 - 2 * y1 + y0) * (1 - t) + 6 * (y3 - 2 * y2 + y1) * t;
    } else if (order === 3) {
      x = 6 * (x3 - 3 * x2 + 3 * x1 - x0);
      y = 6 * (y3 - 3 * y2 + 3 * y1 - y0);
    } else {
      // 3阶导数就是常数了，大于3阶的都是0
      x = 0;
      y = 0;
    }

    return [x, y];
  }
  /**
   * 2 阶 bezier 曲线的 order 阶导数在 t 位置时候的 (x, y) 的值
   */


  function at2(t, points) {
    var order = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

    var _points2 = _slicedToArray(points, 3),
        p0 = _points2[0],
        p1 = _points2[1],
        p2 = _points2[2];

    var _p5 = _slicedToArray(p0, 2),
        x0 = _p5[0],
        y0 = _p5[1];

    var _p6 = _slicedToArray(p1, 2),
        x1 = _p6[0],
        y1 = _p6[1];

    var _p7 = _slicedToArray(p2, 2),
        x2 = _p7[0],
        y2 = _p7[1];

    var x = 0;
    var y = 0;

    if (order === 0) {
      x = Math.pow(1 - t, 2) * x0 + 2 * t * (1 - t) * x1 + Math.pow(t, 2) * x2;
      y = Math.pow(1 - t, 2) * y0 + 2 * t * (1 - t) * y1 + Math.pow(t, 2) * y2;
    } else if (order === 1) {
      x = 2 * (1 - t) * (x1 - x0) + 2 * t * (x2 - x1);
      y = 2 * (1 - t) * (y1 - y0) + 2 * t * (y2 - y1);
    } else if (order === 2) {
      x = 2 * (x2 - 2 * x1 + x0);
      y = 2 * (y2 - 2 * y1 + y0);
    } else {
      x = 0;
      y = 0;
    }

    return [x, y];
  }

  function at(t, points, bezierOrder) {
    var derivativeOrder = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;

    if (bezierOrder === 2) {
      return at2(t, points, derivativeOrder);
    } else if (bezierOrder === 3) {
      return at3(t, points, derivativeOrder);
    }
  }

  function pointAtBezier(points, order, percent, maxIteration, eps) {
    var length = bezierLength(points, order, 0, 1);
    return pointAtBezierWithLength(points, order, length, percent, maxIteration, eps);
  }

  function pointAtBezierWithLength(points, order, length) {
    var percent = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
    var maxIteration = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 20;
    var eps = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0.001;

    var derivativeFunc = function derivativeFunc(t) {
      return norm(at(t, points, order));
    };

    var targetLen = length * percent;
    var approachLen = length;
    var approachT = percent;
    var preApproachT = approachT;

    for (var i = 0; i < maxIteration; i++) {
      approachLen = simpson38(derivativeFunc, 0, approachT);
      var d = approachLen - targetLen;

      if (Math.abs(d) < eps) {
        break;
      } // Newton 法


      var derivative1 = norm(at(approachT, points, order, 1)); // 1 阶导数

      var derivative2 = norm(at(approachT, points, order, 2)); // 2 阶导数

      var numerator = d * derivative1;
      var denominator = d * derivative2 + derivative1 * derivative1;
      approachT = approachT - numerator / denominator;

      if (Math.abs(approachT - preApproachT) < eps) {
        break;
      } else {
        preApproachT = approachT;
      }
    }

    return at(approachT, points, order, 0);
  }

  function sliceBezier(points, t) {
    var _points3 = _slicedToArray(points, 4),
        _points3$ = _slicedToArray(_points3[0], 2),
        x1 = _points3$[0],
        y1 = _points3$[1],
        _points3$2 = _slicedToArray(_points3[1], 2),
        x2 = _points3$2[0],
        y2 = _points3$2[1],
        _points3$3 = _slicedToArray(_points3[2], 2),
        x3 = _points3$3[0],
        y3 = _points3$3[1],
        p4 = _points3[3];

    var x12 = (x2 - x1) * t + x1;
    var y12 = (y2 - y1) * t + y1;
    var x23 = (x3 - x2) * t + x2;
    var y23 = (y3 - y2) * t + y2;
    var x123 = (x23 - x12) * t + x12;
    var y123 = (y23 - y12) * t + y12;

    if (points.length === 4) {
      var _p8 = _slicedToArray(p4, 2),
          x4 = _p8[0],
          y4 = _p8[1];

      var x34 = (x4 - x3) * t + x3;
      var y34 = (y4 - y3) * t + y3;
      var x234 = (x34 - x23) * t + x23;
      var y234 = (y34 - y23) * t + y23;
      var x1234 = (x234 - x123) * t + x123;
      var y1234 = (y234 - y123) * t + y123;
      return [[x1, y1], [x12, y12], [x123, y123], [x1234, y1234]];
    } else if (points.length === 3) {
      return [[x1, y1], [x12, y12], [x123, y123]];
    }
  }

  function sliceBezier2Both(points) {
    var start = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var end = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
    start = Math.max(start, 0);
    end = Math.min(end, 1);

    if (start === 0 && end === 1) {
      return points;
    }

    if (end < 1) {
      points = sliceBezier(points, end);
    }

    if (start > 0) {
      if (end < 1) {
        start = start / end;
      }

      points = sliceBezier(points.reverse(), 1 - start).reverse();
    }

    return points;
  }

  var geom = {
    vectorProduct: vectorProduct,
    pointInPolygon: pointInPolygon,
    d2r: d2r,
    r2d: r2d,
    // 贝塞尔曲线模拟1/4圆弧比例
    H: H,
    // <90任意角度贝塞尔曲线拟合圆弧的比例公式
    h: function h(deg) {
      deg *= 0.5;
      return 4 * ((1 - Math.cos(deg)) / Math.sin(deg)) / 3;
    },
    angleBySide: angleBySide,
    pointsDistance: pointsDistance,
    triangleIncentre: triangleIncentre,
    ellipsePoints: ellipsePoints,
    getRectsIntersection: getRectsIntersection,
    isRectsOverlap: isRectsOverlap,
    isRectsInside: isRectsInside,
    calCoordsInNode: calCoordsInNode,
    calPercentInNode: calPercentInNode,
    bboxBezier: bboxBezier,
    bezierLength: bezierLength,
    pointAtBezier: pointAtBezier,
    pointAtBezierWithLength: pointAtBezierWithLength,
    sliceBezier: sliceBezier,
    sliceBezier2Both: sliceBezier2Both
  };

  var rgba2int$1 = util.rgba2int,
      int2rgba$1 = util.int2rgba,
      isNil$1 = util.isNil;
  var PX = unit.PX,
      PERCENT = unit.PERCENT;
  var d2r$1 = geom.d2r;

  function getLinearDeg(v) {
    var deg = 180;

    if (v === 'to top') {
      deg = 0;
    } else if (v === 'to top right') {
      deg = 45;
    } else if (v === 'to right') {
      deg = 90;
    } else if (v === 'to bottom right') {
      deg = 135;
    } else if (v === 'to bottom') ; else if (v === 'to bottom left') {
      deg = 225;
    } else if (v === 'to left') {
      deg = 270;
    } else if (v === 'to top left') {
      deg = 315;
    } // 数字角度，没有的话取默认角度
    else {
        var match = /(-?[\d.]+)deg/.exec(v);

        if (match) {
          deg = parseFloat(match[1]);
        }
      }

    return deg % 360;
  }

  function getRadialPosition(data) {
    if (/%$/.test(data) || /px$/.test(data) || /^-?[\d.]+$/.test(data)) {
      return {
        value: parseFloat(data),
        unit: /%/.test(data) ? PERCENT : PX
      };
    } else {
      var res = {
        value: {
          top: 0,
          left: 0,
          center: 50,
          right: 100,
          bottom: 100
        }[data],
        unit: PERCENT
      };

      if (isNil$1(res.value)) {
        res.value = 50;
      }

      return res;
    }
  } // 获取color-stop区间范围，去除无用值


  function getColorStop(v, length) {
    var list = []; // 先把已经声明距离的换算成[0,1]以数组形式存入，未声明的原样存入

    for (var i = 0, _len = v.length; i < _len; i++) {
      var item = v[i]; // 考虑是否声明了位置

      if (item.length > 1) {
        var c = int2rgba$1(item[0]);
        var p = item[1];

        if (p.unit === PERCENT) {
          list.push([c, p.value * 0.01]);
        } else {
          list.push([c, p.value / length]);
        }
      } else {
        list.push([int2rgba$1(item[0])]);
      }
    } // 首尾不声明默认为[0, 1]


    if (list[0].length === 1) {
      list[0].push(0);
    }

    if (list.length > 1) {
      var _i = list.length - 1;

      if (list[_i].length === 1) {
        list[_i].push(1);
      }
    } // 找到未声明位置的，需区间计算，找到连续的未声明的，前后的区间平分


    var start = list[0][1];

    for (var _i2 = 1, _len2 = list.length; _i2 < _len2 - 1; _i2++) {
      var _item = list[_i2];

      if (_item.length > 1) {
        start = _item[1];
      } else {
        var j = _i2 + 1;
        var end = list[list.length - 1][1];

        for (; j < _len2 - 1; j++) {
          var _item2 = list[j];

          if (_item2.length > 1) {
            end = _item2[1];
            break;
          }
        }

        var num = j - _i2 + 1;
        var per = (end - start) / num;

        for (var k = _i2; k < j; k++) {
          var _item3 = list[k];

          _item3.push(start + per * (k + 1 - _i2));
        }

        _i2 = j;
      }
    } // 每个不能小于前面的，canvas/svg不能兼容这种情况，需处理


    for (var _i3 = 1, _len3 = list.length; _i3 < _len3; _i3++) {
      var _item4 = list[_i3];
      var prev = list[_i3 - 1];

      if (_item4[1] < prev[1]) {
        _item4[1] = prev[1];
      }
    } // 0之前的和1之后的要过滤掉


    for (var _i4 = 0, _len4 = list.length; _i4 < _len4 - 1; _i4++) {
      var _item5 = list[_i4];

      if (_item5[1] > 1) {
        list.splice(_i4 + 1);
        break;
      }
    }

    for (var _i5 = list.length - 1; _i5 > 0; _i5--) {
      var _item6 = list[_i5];

      if (_item6[1] < 0) {
        list.splice(0, _i5);
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

      for (var _i6 = len - 1; _i6 >= 0; _i6--) {
        var _item7 = list[_i6];
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
                var c1 = rgba2int$1(first[0]);
                var c2 = rgba2int$1(next[0]);

                var _c = getCsStartLimit(c1, first[1], c2, next[1], length);

                first[0] = 'rgba(' + _c[0] + ',' + _c[1] + ',' + _c[2] + ',' + _c[3] + ')';
                first[1] = 0;
              }

              if (last[1] > 1) {
                var _prev = list[len - 2];

                var _c2 = rgba2int$1(_prev[0]);

                var _c3 = rgba2int$1(last[0]);

                var _c4 = getCsEndLimit(_c2, _prev[1], _c3, last[1], length);

                last[0] = 'rgba(' + _c4[0] + ',' + _c4[1] + ',' + _c4[2] + ',' + _c4[3] + ')';
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
      var r = d2r$1(360 - deg);
      x0 = cx + Math.sin(r) * length;
      y0 = cy + Math.cos(r) * length;
      x1 = cx - Math.sin(r) * length;
      y1 = cy - Math.cos(r) * length;
    } else if (deg >= 180) {
      var _r = d2r$1(deg - 180);

      x0 = cx + Math.sin(_r) * length;
      y0 = cy - Math.cos(_r) * length;
      x1 = cx - Math.sin(_r) * length;
      y1 = cy + Math.cos(_r) * length;
    } else if (deg >= 90) {
      var _r2 = d2r$1(180 - deg);

      x0 = cx - Math.sin(_r2) * length;
      y0 = cy - Math.cos(_r2) * length;
      x1 = cx + Math.sin(_r2) * length;
      y1 = cy + Math.cos(_r2) * length;
    } else {
      var _r3 = d2r$1(deg);

      x0 = cx - Math.sin(_r3) * length;
      y0 = cy + Math.cos(_r3) * length;
      x1 = cx + Math.sin(_r3) * length;
      y1 = cy - Math.cos(_r3) * length;
    }

    return [x0, y0, x1, y1];
  } // 获取径向渐变圆心半径


  function calRadialRadius(shape, size, position, iw, ih, x1, y1, x2, y2) {
    // let size = 'farthest-corner';
    var cx, cy;

    if (position[0].unit === PX) {
      cx = x1 + position[0].value;
    } else {
      cx = x1 + position[0].value * iw * 0.01;
    }

    if (position[1].unit === PX) {
      cy = y1 + position[1].value;
    } else {
      cy = y1 + position[1].value * ih * 0.01;
    }

    var r;

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
    var c1 = rgba2int$1(first[0]);
    var c2 = rgba2int$1(last[0]);

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
    first[0] = 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
    first[1] = 0;
    p = (length + l1) / (l1 + l2);
    r = Math.floor(r1 + (r2 - r1) * p);
    g = Math.floor(g1 + (g2 - g1) * p);
    b = Math.floor(b1 + (b2 - b1) * p);
    a = a1 + (a2 - a1) * p;
    last[0] = 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
    last[1] = 1;
  }

  function parseGradient(s) {
    var gradient = reg.gradient.exec(s);

    if (gradient) {
      var o = {
        k: gradient[1]
      };

      if (o.k === 'linear') {
        var deg = /(-?[\d.]+deg)|(to\s+[toprighbml]+)/i.exec(gradient[2]);

        if (deg) {
          o.d = getLinearDeg(deg[0].toLowerCase());
        } else {
          o.d = 180;
        }
      } else if (o.k === 'radial') {
        o.s = gradient[2].indexOf('ellipse') > -1 ? 'ellipse' : 'circle';
        var size = /(closest|farthest)-(side|corner)/i.exec(gradient[2]);

        if (size) {
          o.z = size[0].toLowerCase();
        } else {
          o.z = 'farthest-corner';
        }

        var position = /at\s+((?:-?[\d.]+(?:px|%)?)|(?:left|top|right|bottom|center))(?:\s+((?:-?[\d.]+(?:px|%)?)|(?:left|top|right|bottom|center)))?/i.exec(gradient[2]);

        if (position) {
          var x = getRadialPosition(position[1]);
          var y = position[2] ? getRadialPosition(position[2]) : x;
          o.p = [x, y];
        } else {
          o.p = [{
            value: 50,
            unit: PERCENT
          }, {
            value: 50,
            unit: PERCENT
          }];
        }
      }

      var v = gradient[2].match(/((#[0-9a-f]{3,6})|(rgba?\(.+?\)))\s*(-?[\d.]+(px|%))?/ig);
      o.v = v.map(function (item) {
        var res = /((?:#[0-9a-f]{3,6})|(?:rgba?\(.+?\)))\s*(-?[\d.]+(?:px|%))?/i.exec(item);
        var arr = [rgba2int$1(res[1])];

        if (res[2]) {
          arr[1] = {
            value: parseFloat(res[2])
          };

          if (/%$/.test(res[2])) {
            arr[1].unit = PERCENT;
          } else {
            arr[1].unit = PX;
          }
        }

        return arr;
      });
      return o;
    }
  }

  function getLinear(v, d, cx, cy, w, h) {
    var theta = d2r$1(d);
    var length = Math.abs(w * Math.sin(theta)) + Math.abs(h * Math.cos(theta));

    var _calLinearCoords = calLinearCoords(d, length * 0.5, cx, cy),
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

  function getRadial(v, shape, size, position, x1, y1, x2, y2) {
    var w = x2 - x1;
    var h = y2 - y1;

    var _calRadialRadius = calRadialRadius(shape, size, position, w, h, x1, y1, x2, y2),
        _calRadialRadius2 = _slicedToArray(_calRadialRadius, 3),
        r = _calRadialRadius2[0],
        cx = _calRadialRadius2[1],
        cy = _calRadialRadius2[2];

    var stop = getColorStop(v, r * 2); // 超限情况等同于只显示end的bgc

    if (r <= 0) {
      var end = stop[stop.length - 1];
      end[1] = 0;
      stop = [end];
      cx = x1;
      cy = y1; // 肯定大于最长直径

      r = w + h;
    }

    return {
      cx: cx,
      cy: cy,
      r: r,
      stop: stop
    };
  }

  var gradient = {
    parseGradient: parseGradient,
    getLinear: getLinear,
    getRadial: getRadial
  };

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
    fontFamily: 'inherit',
    color: 'inherit',
    fontStyle: 'inherit',
    fontWeight: 'inherit',
    lineHeight: 'normal',
    backgroundImage: null,
    backgroundColor: 'transparent',
    backgroundSize: 'auto',
    backgroundRepeat: 'repeat',
    backgroundPositionX: 0,
    backgroundPositionY: 0,
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
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    width: 'auto',
    height: 'auto',
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: 'auto',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    alignSelf: 'auto',
    textAlign: 'inherit',
    transformOrigin: 'center',
    visibility: 'inherit',
    opacity: 1,
    zIndex: 0,
    transform: null,
    translateX: 0,
    translateY: 0,
    scaleX: 1,
    scaleY: 1,
    skewX: 0,
    skewY: 0,
    rotateZ: 0,
    filter: null,
    boxShadow: null,
    pointerEvents: 'inherit'
  };
  var GEOM = {
    fill: 'transparent',
    stroke: '#000',
    strokeWidth: 1,
    strokeDasharray: '',
    strokeLinecap: 'butt',
    strokeLinejoin: 'miter',
    strokeMiterlimit: 4,
    fillRule: 'nonzero'
  };
  var DOM_ENTRY_SET = [];
  var DOM_KEY_SET = [];
  Object.keys(DOM).forEach(function (k) {
    DOM_KEY_SET.push(k);
    var v = DOM[k];
    DOM_ENTRY_SET.push({
      k: k,
      v: v
    });
  });
  var GEOM_ENTRY_SET = [];
  var GEOM_KEY_SET = [];
  Object.keys(GEOM).forEach(function (k) {
    GEOM_KEY_SET.push(k);
    var v = GEOM[k];
    GEOM_ENTRY_SET.push({
      k: k,
      v: v
    });
  });
  var INHERIT = {
    fontFamily: 'arial',
    fontSize: 16,
    fontWeight: 400,
    fontStyle: 'normal',
    color: '#000',
    textAlign: 'left',
    visibility: 'visible',
    pointerEvents: 'auto'
  };
  var INHERIT_KEY_SET = [];
  Object.keys(INHERIT).forEach(function (k) {
    INHERIT_KEY_SET.push(k);
  });
  var reset = {
    DOM: DOM,
    GEOM: GEOM,
    isValid: function isValid(i) {
      return DOM.hasOwnProperty(i) || GEOM.hasOwnProperty(i);
    },
    DOM_KEY_SET: DOM_KEY_SET,
    GEOM_KEY_SET: GEOM_KEY_SET,
    DOM_ENTRY_SET: DOM_ENTRY_SET,
    GEOM_ENTRY_SET: GEOM_ENTRY_SET,
    INHERIT: INHERIT,
    INHERIT_KEY_SET: INHERIT_KEY_SET
  };

  var isNil$2 = util.isNil;

  function parseFlex(style, grow, shrink, basis) {
    if (isNil$2(style.flexGrow)) {
      style.flexGrow = grow || 0;
    }

    if (isNil$2(style.flexShrink)) {
      style.flexShrink = shrink || 0;
    }

    if (isNil$2(style.flexBasis)) {
      style.flexBasis = basis || 0;
    }
  }

  function parseMarginPadding(style, key, list) {
    var temp = style[key];

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

        list.forEach(function (k, i) {
          if (isNil$2(style[k])) {
            style[k] = match[i];
          }
        });
      }
    }
  }

  function parseOneBorder(style, k) {
    var v = style[k];

    if (isNil$2(v)) {
      return;
    } // 后面会统一格式化处理


    if (isNil$2(style[k + 'Width'])) {
      var w = /\b[\d.]+px\b/i.exec(v);
      style[k + 'Width'] = w ? w[0] : 0;
    }

    if (isNil$2(style[k + 'Style'])) {
      var s = /\b(solid|dashed|dotted)\b/i.exec(v);
      style[k + 'Style'] = s ? s[1] : 'solid';
    }

    if (isNil$2(style[k + 'Color'])) {
      var c = /#[0-9a-f]{3,6}/i.exec(v);

      if (c && [4, 7].indexOf(c[0].length) > -1) {
        style[k + 'Color'] = c[0];
      } else if (/\btransparent\b/i.test(v)) {
        style[k + 'Color'] = 'transparent';
      } else {
        c = /rgba?\(.+\)/i.exec(v);
        style[k + 'Color'] = c ? c[0] : 'transparent';
      }
    }
  }

  var abbr = {
    margin: ['marginTop', 'marginRight', 'marginBottom', 'marginLeft'],
    padding: ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'],
    border: ['borderTop', 'borderRight', 'borderBottom', 'borderLeft'],
    borderTop: ['borderTopWidth', 'borderTopStyle', 'borderTopColor'],
    borderRight: ['borderRightWidth', 'borderRightStyle', 'borderRightColor'],
    borderBottom: ['borderBottomWidth', 'borderBottomStyle', 'borderBottomColor'],
    borderLeft: ['borderLeftWidth', 'borderLeftStyle', 'borderLeftColor'],
    borderWidth: ['borderWidthTop', 'borderWidthRight', 'borderWidthBottom', 'borderWidthLeft'],
    borderColor: ['borderColorTop', 'borderColorRight', 'borderColorBottom', 'borderColorLeft'],
    borderStyle: ['borderStyleTop', 'borderStyleRight', 'borderStyleBottom', 'borderStyleLeft'],
    borderRadius: ['borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomRightRadius', 'borderBottomLeftRadius'],
    background: ['backgroundColor', 'backgroundImage', 'backgroundRepeat', 'backgroundPosition'],
    backgroundRepeat: ['backgroundRepeatX', 'backgroundRepeatY'],
    backgroundPosition: ['backgroundPositionX', 'backgroundPositionY'],
    flex: ['flexGrow', 'flexShrink', 'flexBasis'],
    translate: ['translateX', 'translateY'],
    scale: ['scaleX', 'scaleY'],
    rotate: ['rotateZ'],
    skew: ['skewX', 'skewY'],
    toFull: function toFull(style, k) {
      var v = style[k];

      if (k === 'background') {
        if (isNil$2(style.backgroundImage)) {
          var gd = reg.gradient.exec(v);

          if (gd) {
            style.backgroundImage = gd[0];
            v = v.replace(gd[0], '');
          } else {
            var img = reg.img.exec(v);

            if (img) {
              style.backgroundImage = img[0];
              v = v.replace(img[0], '');
            }
          }
        }

        if (isNil$2(style.backgroundRepeat)) {
          var repeat = /(no-)?repeat(-[xy])?/i.exec(v);

          if (repeat) {
            style.backgroundRepeat = repeat[0].toLowerCase();
            this.toFull(style, 'backgroundRepeat');
          }
        }

        if (isNil$2(style.backgroundColor)) {
          var bgc = /^(transparent)|(#[0-9a-f]{3,6})|(rgba?\(.+?\))/i.exec(v);

          if (bgc) {
            style.backgroundColor = bgc[0];
            v = v.replace(bgc[0], '');
          }
        }

        if (isNil$2(style.backgroundPosition)) {
          var position = v.match(reg.position);

          if (position) {
            style.backgroundPosition = position.join(' ');
            this.toFull(style, 'backgroundPosition');
          }
        }
      } else if (k === 'flex') {
        if (v === 'none') {
          parseFlex(style, 0, 0, 'auto');
        } else if (v === 'auto') {
          parseFlex(style, 1, 1, 'auto');
        } else if (/^[\d.]+$/.test(v)) {
          parseFlex(style, Math.max(0, parseFloat(v)), 1, 0);
        } else if (/^[\d.]+px$/i.test(v)) {
          parseFlex(style, 1, 1, 0);
        } else if (/^[\d.]+%$/.test(v)) {
          parseFlex(style, 1, 1, v);
        } else if (/^[\d.]+\s+[\d.]+$/.test(v)) {
          var arr = v.split(/\s+/);
          parseFlex(style, arr[0], arr[1], 0);
        } else if (/^[\d.]+\s+[\d.]+%$/.test(v)) {
          var _arr = v.split(/\s+/);

          parseFlex(style, _arr[0], 1, _arr[1]);
        } else {
          parseFlex(style, 0, 1, 'auto');
        }
      } else if (k === 'borderRadius') {
        // borderRadius缩写很特殊，/分隔x/y，然后上右下左4个
        v = v.toString().split('/');

        if (v.length === 1) {
          v[1] = v[0];
        }

        for (var i = 0; i < 2; i++) {
          var item = v[i].toString().split(/\s+/);

          if (item.length === 0) {
            v[i] = [0, 0, 0, 0];
          } else if (item.length === 1) {
            v[i] = [item[0], item[0], item[0], item[0]];
          } else if (item.length === 2) {
            v[i] = [item[0], item[1], item[0], item[1]];
          } else if (item.length === 3) {
            v[i] = [item[0], item[1], item[2], item[1]];
          } else {
            v[i] = item.slice(0, 4);
          }
        }

        this[k].forEach(function (k, i) {
          if (isNil$2(style[k])) {
            style[k] = v[0][i] + ' ' + v[1][i];
          }
        });
      } else if (k === 'backgroundPosition') {
        v = v.toString().split(/\s+/);

        if (v.length === 1) {
          v[1] = '50%';
        }

        this[k].forEach(function (k, i) {
          if (isNil$2(style[k])) {
            style[k] = v[i];
          }
        });
      } else if (['translate', 'scale', 'skew'].indexOf(k) > -1) {
        var _arr2 = v.toString().split(/\s*,\s*/);

        if (_arr2.length === 1) {
          _arr2[1] = _arr2[0];
        }

        this[k].forEach(function (k, i) {
          if (isNil$2(style[k])) {
            style[k] = _arr2[i];
          }
        });
      } else if (k === 'margin' || k === 'padding') {
        parseMarginPadding(style, k, this[k]);
      } else if (/^border((Top)|(Right)|(Bottom)|(Left))$/.test(k)) {
        parseOneBorder(style, k);
      } else if (this[k]) {
        this[k].forEach(function (k) {
          if (isNil$2(style[k])) {
            style[k] = v;
          }
        });
      }
    }
  };

  var KEY_COLOR = ['backgroundColor', 'borderBottomColor', 'borderLeftColor', 'borderRightColor', 'borderTopColor', 'color'];
  var KEY_LENGTH = ['fontSize', 'borderBottomWidth', 'borderLeftWidth', 'borderRightWidth', 'borderTopWidth', 'bottom', 'left', 'right', 'top', 'flexBasis', 'width', 'height', 'lineHeight', 'marginBottom', 'marginLeft', 'marginRight', 'marginTop', 'paddingBottom', 'paddingLeft', 'paddingRight', 'paddingTop', 'strokeWidth', 'strokeMiterlimit'];
  var KEY_GRADIENT = ['backgroundImage', 'fill', 'stroke'];
  var KEY_RADIUS = ['borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomRightRadius', 'borderBottomLeftRadius'];
  var COLOR_HASH = {};
  KEY_COLOR.forEach(function (k) {
    COLOR_HASH[k] = true;
  });
  var LENGTH_HASH = {};
  KEY_LENGTH.forEach(function (k) {
    LENGTH_HASH[k] = true;
  });
  var RADIUS_HASH = {};
  KEY_RADIUS.forEach(function (k) {
    RADIUS_HASH[k] = true;
  });
  var GRADIENT_HASH = {};
  KEY_GRADIENT.forEach(function (k) {
    GRADIENT_HASH[k] = true;
  });
  var GRADIENT_TYPE = {
    linear: true,
    radial: true
  };
  var KEY_EXPAND = ['translateX', 'translateY', 'scaleX', 'scaleY', 'rotateZ', 'skewX', 'skewY'];
  var EXPAND_HASH = {};
  KEY_EXPAND.forEach(function (k) {
    EXPAND_HASH[k] = true;
  });
  var key = {
    KEY_COLOR: KEY_COLOR,
    KEY_EXPAND: KEY_EXPAND,
    KEY_GRADIENT: KEY_GRADIENT,
    KEY_LENGTH: KEY_LENGTH,
    KEY_RADIUS: KEY_RADIUS,
    COLOR_HASH: COLOR_HASH,
    EXPAND_HASH: EXPAND_HASH,
    GRADIENT_HASH: GRADIENT_HASH,
    LENGTH_HASH: LENGTH_HASH,
    RADIUS_HASH: RADIUS_HASH,
    GRADIENT_TYPE: GRADIENT_TYPE
  };

  var o = {
    GEOM: {},
    IGNORE: {
      pointerEvents: true
    },
    REPAINT: {
      transform: true,
      translateX: true,
      translateY: true,
      skewX: true,
      skewY: true,
      scaleX: true,
      scaleY: true,
      rotateZ: true,
      color: true,
      fontStyle: true,
      strokeWidth: true,
      fill: true,
      strokeDasharray: true,
      strokeLinecap: true,
      strokeLinejoin: true,
      strokeMiterlimit: true,
      backgroundColor: true,
      backgroundImage: true,
      backgroundPositionX: true,
      backgroundPositionY: true,
      backgroundRepeat: true,
      backgroundSize: true,
      stroke: true,
      borderBottomColor: true,
      borderLeftColor: true,
      borderRightColor: true,
      borderTopColor: true,
      borderTopLeftRadius: true,
      borderTopRightRadius: true,
      borderBottomRightRadius: true,
      borderBottomLeftRadius: true,
      visibility: true,
      opacity: true,
      zIndex: true,
      filter: true,
      boxShadow: true
    },
    MEASURE: {
      fontSize: true,
      fontWeight: true,
      fontFamily: true
    },
    isIgnore: function isIgnore(k) {
      return this.IGNORE.hasOwnProperty(k);
    },
    isRepaint: function isRepaint(k) {
      return this.REPAINT.hasOwnProperty(k) || this.isGeom(k);
    },
    isMeasure: function isMeasure(k) {
      return this.MEASURE.hasOwnProperty(k);
    },
    addGeom: function addGeom(tagName, ks) {
      if (Array.isArray(ks)) {
        ks.forEach(function (k) {
          o.addGeom(tagName, k);
        });
      } else if (ks) {
        var list = o.GEOM[ks] = o.GEOM[ks] || {};
        list[tagName] = true;
      }
    },
    isGeom: function isGeom(tagName, k) {
      return this.GEOM.hasOwnProperty(k) && this.GEOM[k].hasOwnProperty(tagName);
    },
    isValid: function isValid(tagName, k) {
      if (!k) {
        return false;
      }

      if (reset.DOM.hasOwnProperty(k)) {
        return true;
      } // geom的fill等矢量才有的样式


      if (tagName.charAt(0) === '$' && reset.GEOM.hasOwnProperty(k)) {
        return true;
      }

      if (this.GEOM.hasOwnProperty(k)) {
        return this.GEOM[k].hasOwnProperty(tagName);
      }

      return false;
    }
  };
  var MEASURE_KEY_SET = o.MEASURE_KEY_SET = Object.keys(o.MEASURE);
  var len = MEASURE_KEY_SET.length;

  o.isMeasureInherit = function (target) {
    for (var i = 0; i < len; i++) {
      var k = MEASURE_KEY_SET[i];

      if (target.hasOwnProperty(k) && target[k].unit === unit.INHERIT) {
        return true;
      }
    }

    return false;
  };

  o.measureInheritList = function (target) {
    var list = [];

    for (var i = 0; i < len; i++) {
      var k = MEASURE_KEY_SET[i];

      if (target.hasOwnProperty(k) && target[k].unit === unit.INHERIT) {
        list.push(k);
      }
    }

    return list;
  };

  o.addGeom('$line', ['x1', 'y1', 'x2', 'y2', 'controlA', 'controlB', 'start', 'end']);
  o.addGeom('$circle', ['r']);
  o.addGeom('$ellipse', ['rx', 'ry']);
  o.addGeom('$rect', ['rx', 'ry']);
  o.addGeom('$sector', ['begin', 'end', 'edge', 'closure']);
  o.addGeom('$polyline', ['points', 'controls', 'start', 'end']);
  o.addGeom('$polygon', ['points', 'controls', 'start', 'end']);

  var AUTO = unit.AUTO,
      PX$1 = unit.PX,
      PERCENT$1 = unit.PERCENT,
      NUMBER = unit.NUMBER,
      INHERIT$1 = unit.INHERIT,
      DEG = unit.DEG,
      RGBA = unit.RGBA,
      STRING = unit.STRING;
  var isNil$3 = util.isNil,
      rgba2int$2 = util.rgba2int;
  var DEFAULT_FONT_SIZE = 16;
  var COLOR_HASH$1 = key.COLOR_HASH,
      LENGTH_HASH$1 = key.LENGTH_HASH,
      RADIUS_HASH$1 = key.RADIUS_HASH,
      GRADIENT_HASH$1 = key.GRADIENT_HASH,
      EXPAND_HASH$1 = key.EXPAND_HASH,
      GRADIENT_TYPE$1 = key.GRADIENT_TYPE;
  /**
   * 通用的格式化计算数值单位的方法，百分比像素auto和纯数字，直接修改传入对象本身
   * @param obj 待计算的样式对象
   * @param k 对象的key
   * @param v 对象的value
   * @returns 格式化好的样式对象本身
   */

  function calUnit(obj, k, v) {
    if (v === 'auto') {
      obj[k] = {
        unit: AUTO
      };
    } else if (v === 'inherit') {
      obj[k] = {
        unit: INHERIT$1
      };
    } else if (/%$/.test(v)) {
      v = parseFloat(v) || 0;
      obj[k] = {
        value: v,
        unit: PERCENT$1
      };
    } else if (/px$/i.test(v)) {
      v = parseFloat(v) || 0;
      obj[k] = {
        value: v,
        unit: PX$1
      };
    } else if (/deg$/i.test(v)) {
      v = parseFloat(v) || 0;
      obj[k] = {
        value: v,
        unit: DEG
      };
    } else {
      v = parseFloat(v) || 0;
      obj[k] = {
        value: v,
        unit: NUMBER
      };
    } // border相关不能为负值


    if (k.toString().indexOf('border') === 0) {
      obj[k].value = Math.max(obj[k].value, 0);
    }

    return obj;
  }

  function compatibleTransform(k, v) {
    if (k.indexOf('scale') > -1) {
      v.unit = NUMBER;
    } else if (k.indexOf('translate') > -1) {
      if (v.unit === NUMBER) {
        v.unit = PX$1;
      }
    } else {
      if (v.unit === NUMBER) {
        v.unit = DEG;
      }
    }
  }
  /**
   * 将传入的手写style标准化，并且用reset默认值覆盖其中为空的
   * @param style 手写的style样式
   * @param reset 默认样式
   * @returns Object 标准化的样式
   */


  function normalize(style) {
    var reset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    if (!util.isObject(style)) {
      return {};
    } // style只有单层无需深度clone


    style = util.extend({}, style); // 缩写提前处理，因为reset里没有缩写

    var temp = style.border;

    if (temp) {
      abbr.toFull(style, 'border');
      delete style.border;
    }

    ['borderTop', 'borderRight', 'borderBottom', 'borderLeft'].forEach(function (k) {
      abbr.toFull(style, k);
      delete style[k];
    });
    temp = style.borderWidth;

    if (temp) {
      abbr.toFull(style, 'borderWidth');
      delete style.borderWidth;
    }

    temp = style.borderColor;

    if (temp) {
      abbr.toFull(style, 'borderColor');
      delete style.borderColor;
    }

    temp = style.borderStyle;

    if (temp) {
      abbr.toFull(style, 'borderStyle');
      delete style.borderStyle;
    }

    temp = style.borderRadius;

    if (temp) {
      abbr.toFull(style, 'borderRadius');
      delete style.borderRadius;
    }

    temp = style.background; // 处理渐变背景缩写

    if (temp) {
      abbr.toFull(style, 'background');
      delete style.background;
    } // 背景位置


    temp = style.backgroundPosition;

    if (!isNil$3(temp)) {
      abbr.toFull(style, 'backgroundPosition');
      delete style.backgroundPosition;
    } // flex


    temp = style.flex;

    if (temp) {
      abbr.toFull(style, 'flex');
      delete style.flex;
    }

    temp = style.margin;

    if (!isNil$3(temp)) {
      abbr.toFull(style, 'margin');
      delete style.margin;
    }

    temp = style.padding;

    if (!isNil$3(temp)) {
      abbr.toFull(style, 'padding');
      delete style.padding;
    }

    ['translateX', 'translateY', 'scaleX', 'scaleY', 'skewX', 'skewY', 'rotateZ', 'rotate'].forEach(function (k) {
      var v = style[k];

      if (!isNil$3(v) && style.transform) {
        console.error("Can not use expand style \"".concat(k, "\" with transform"));
      }
    }); // 扩展css，将transform几个值拆分为独立的css为动画准备，同时不能使用transform

    ['translate', 'scale', 'skew'].forEach(function (k) {
      temp = style[k];

      if (!isNil$3(temp)) {
        abbr.toFull(style, k);
        delete style[k];
      }
    });
    temp = style.rotate;

    if (!isNil$3(temp)) {
      abbr.toFull(style, 'rotate');
      delete style.rotate;
    } // 默认reset，根据传入不同，当style为空时覆盖


    reset.forEach(function (item) {
      var k = item.k,
          v = item.v;

      if (isNil$3(style[k])) {
        style[k] = v;
      }
    }); // 背景图

    temp = style.backgroundImage;

    if (temp) {
      // 区分是渐变色还是图
      if (reg.gradient.test(temp)) {
        style.backgroundImage = gradient.parseGradient(temp);
      } else if (reg.img.test(temp)) {
        style.backgroundImage = reg.img.exec(temp)[2];
      }
    }

    temp = style.backgroundColor;

    if (temp) {
      // 先赋值默认透明，后续操作有合法值覆盖
      var bgc = /^#[0-9a-f]{3,6}/i.exec(temp);

      if (bgc && [4, 7].indexOf(bgc[0].length) > -1) {
        style.backgroundColor = {
          value: rgba2int$2(bgc[0]),
          unit: RGBA
        };
      } else {
        bgc = /rgba?\(.+\)/i.exec(temp);
        style.backgroundColor = {
          value: rgba2int$2(bgc ? bgc[0] : [0, 0, 0, 0]),
          unit: RGBA
        };
      }
    }

    ['backgroundPositionX', 'backgroundPositionY'].forEach(function (k) {
      temp = style[k];

      if (!isNil$3(temp)) {
        if (/%$/.test(temp) || /px$/i.test(temp) || /^-?[\d.]+$/.test(temp)) {
          calUnit(style, k, temp);
          temp = style[k];

          if (temp.unit === NUMBER) {
            temp.unit = PX$1;
          }
        } else {
          style[k] = {
            value: {
              top: 0,
              left: 0,
              center: 50,
              right: 100,
              bottom: 100
            }[temp],
            unit: PERCENT$1
          };
        }
      }
    }); // 背景尺寸

    temp = style.backgroundSize;

    if (temp) {
      var bc = style.backgroundSize = [];
      var match = temp.toString().match(/\b(?:(-?[\d.]+(px|%)?)|(contain|cover|auto))/ig);

      if (match) {
        if (match.length === 1) {
          if (match[0] === 'contain' || match[0] === 'cover') {
            match[1] = match[0];
          } else {
            match[1] = 'auto';
          }
        }

        for (var i = 0; i < 2; i++) {
          var item = match[i];

          if (/%$/.test(item) || /px$/i.test(item) || /^-?[\d.]+$/.test(item)) {
            calUnit(bc, i, item);

            if (bc[i].unit === NUMBER) {
              bc[i].unit = PX$1;
            }
          } else if (item === '0' || item === 0) {
            bc.push({
              value: 0,
              unit: PX$1
            });
          } else if (item === 'contain' || item === 'cover') {
            bc.push({
              value: item,
              unit: STRING
            });
          } else {
            bc.push({
              unit: AUTO
            });
          }
        }
      } else {
        bc.push({
          unit: AUTO
        });
        bc[1] = bc[0];
      }
    } // border-color


    ['Top', 'Right', 'Bottom', 'Left'].forEach(function (k) {
      k = 'border' + k + 'Color';
      var v = style[k];

      if (!isNil$3(v)) {
        style[k] = {
          value: rgba2int$2(v),
          unit: RGBA
        };
      }
    }); // border-radius

    ['TopLeft', 'TopRight', 'BottomRight', 'BottomLeft'].forEach(function (k) {
      k = 'border' + k + 'Radius';
      var v = style[k];

      if (!isNil$3(v)) {
        var arr = v.toString().split(/\s+/);

        if (arr.length === 1) {
          arr[1] = arr[0];
        }

        for (var _i = 0; _i < 2; _i++) {
          var _item = arr[_i];

          if (/%$/.test(_item) || /px$/i.test(_item) || /^-?[\d.]+$/.test(_item)) {
            calUnit(arr, _i, _item);

            if (arr[_i].unit === NUMBER) {
              arr[_i].unit = PX$1;
            }
          } else {
            arr[_i] = {
              value: 0,
              unit: PX$1
            };
          }
        }

        style[k] = arr;
      }
    });
    temp = style.transform;

    if (temp) {
      var transform = style.transform = [];

      var _match = temp.toString().match(/\w+\(.+?\)/g);

      if (_match) {
        _match.forEach(function (item) {
          var i = item.indexOf('(');
          var k = item.slice(0, i);
          var v = item.slice(i + 1, item.length - 1);

          if (k === 'matrix') {
            var arr = v.toString().split(/\s*,\s*/);
            arr = arr.map(function (item) {
              return parseFloat(item);
            });

            if (arr.length > 6) {
              arr = arr.slice(0, 6);
            }

            if (arr.length === 6) {
              transform.push(['matrix', arr]);
            }
          } else if ({
            'translateX': true,
            'translateY': true,
            'scaleX': true,
            'scaleY': true,
            'skewX': true,
            'skewY': true,
            'rotate': true,
            'rotateZ': true
          }.hasOwnProperty(k)) {
            if (k === 'rotate') {
              k = 'rotateZ';
            }

            var _arr = calUnit([k, v], 1, v);

            compatibleTransform(k, _arr[1]);
            transform.push(_arr);
          } else if ({
            translate: true,
            scale: true,
            skew: true
          }.hasOwnProperty(k)) {
            var _arr2 = v.toString().split(/\s*,\s*/);

            if (_arr2.length === 1) {
              _arr2[1] = _arr2[0];
            }

            var arr1 = calUnit([k + 'X', _arr2[0]], 1, _arr2[0]);
            var arr2 = calUnit([k + 'Y', _arr2[1]], 1, _arr2[1]);
            compatibleTransform(k, arr1[1]);
            compatibleTransform(k, arr2[1]);
            transform.push(arr1);
            transform.push(arr2);
          }
        });
      }
    }

    temp = style.transformOrigin;

    if (!isNil$3(temp)) {
      var tfo = style.transformOrigin = [];

      var _match2 = temp.toString().match(reg.position);

      if (_match2) {
        if (_match2.length === 1) {
          _match2[1] = _match2[0];
        }

        for (var _i2 = 0; _i2 < 2; _i2++) {
          var _item2 = _match2[_i2];

          if (/%$/.test(_item2) || /px$/i.test(_item2) || /^-?[\d.]+$/.test(_item2)) {
            calUnit(tfo, _i2, _item2);

            if (tfo[_i2].unit === NUMBER) {
              tfo[_i2].unit = PX$1;
            }
          } else {
            tfo.push({
              value: {
                top: 0,
                left: 0,
                center: 50,
                right: 100,
                bottom: 100
              }[_item2],
              unit: PERCENT$1
            }); // 不规范的写法变默认值50%

            if (isNil$3(tfo[_i2].value)) {
              tfo[_i2].value = 50;
            }
          }
        }
      } else {
        tfo.push({
          value: 50,
          unit: PERCENT$1
        });
        tfo[1] = tfo[0];
      }
    }

    ['translateX', 'translateY', 'scaleX', 'scaleY', 'skewX', 'skewY', 'rotateZ', 'rotate'].forEach(function (k) {
      var v = style[k];

      if (isNil$3(v)) {
        return;
      }

      calUnit(style, k, v);

      if (k === 'rotate') {
        k = 'rotateZ';
        style.rotateZ = style.rotate;
        delete style.rotate;
      } // 没有单位或默认值处理单位


      v = style[k];
      compatibleTransform(k, v);
    });
    temp = style.opacity;

    if (temp) {
      temp = parseFloat(temp);

      if (!isNaN(temp)) {
        temp = Math.max(temp, 0);
        temp = Math.min(temp, 1);
        style.opacity = temp;
      } else {
        style.opacity = 1;
      }
    }

    temp = style.zIndex;

    if (temp) {
      style.zIndex = parseInt(temp) || 0;
    } // 转化不同单位值为对象标准化，不写单位的变成number单位转化为px


    ['marginTop', 'marginRight', 'marginBottom', 'marginLeft', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'top', 'right', 'bottom', 'left', 'width', 'height', 'flexBasis', 'strokeWidth'].forEach(function (k) {
      var v = style[k];

      if (isNil$3(v)) {
        return;
      }

      calUnit(style, k, v);
      v = style[k]; // 无单位视为px

      if (v.unit === NUMBER) {
        v.unit = PX$1;
      }
    });
    temp = style.color;

    if (temp) {
      if (temp === 'inherit') {
        style.color = {
          unit: INHERIT$1
        };
      } else {
        style.color = {
          value: rgba2int$2(temp),
          unit: RGBA
        };
      }
    }

    temp = style.fontSize;

    if (temp || temp === 0) {
      if (temp === 'inherit') {
        style.fontSize = {
          unit: INHERIT$1
        };
      } else if (/%$/.test(temp)) {
        var v = Math.max(0, parseFloat(temp));

        if (v) {
          style.fontSize = {
            value: v,
            unit: PERCENT$1
          };
        } else {
          style.fontSize = {
            value: DEFAULT_FONT_SIZE,
            unit: PX$1
          };
        }
      } else {
        style.fontSize = {
          value: Math.max(0, parseFloat(temp)) || DEFAULT_FONT_SIZE,
          unit: PX$1
        };
      }
    }

    temp = style.fontWeight;

    if (temp || temp === 0) {
      if (temp === 'bold') {
        style.fontWeight = {
          value: 700,
          unit: NUMBER
        };
      } else if (temp === 'normal') {
        style.fontWeight = {
          value: 400,
          unit: NUMBER
        };
      } else if (temp === 'lighter') {
        style.fontWeight = {
          value: 200,
          unit: NUMBER
        };
      } else if (temp === 'inherit') {
        style.fontWeight = {
          unit: INHERIT$1
        };
      } else {
        style.fontWeight = {
          value: Math.max(0, parseInt(temp)) || 400,
          unit: NUMBER
        };
      }
    }

    temp = style.fontStyle;

    if (temp) {
      if (temp === 'inherit') {
        style.fontStyle = {
          unit: INHERIT$1
        };
      } else {
        style.fontStyle = {
          value: temp,
          unit: STRING
        };
      }
    }

    temp = style.fontFamily;

    if (temp) {
      if (temp === 'inherit') {
        style.fontFamily = {
          unit: INHERIT$1
        };
      } else {
        style.fontFamily = {
          value: temp,
          unit: STRING
        };
      }
    }

    temp = style.textAlign;

    if (temp) {
      if (temp === 'inherit') {
        style.textAlign = {
          unit: INHERIT$1
        };
      } else {
        style.textAlign = {
          value: temp,
          unit: STRING
        };
      }
    }

    temp = style.lineHeight;

    if (temp || temp === 0) {
      if (temp === 'inherit') {
        style.lineHeight = {
          unit: INHERIT$1
        };
      } else if (temp === 'normal') {
        style.lineHeight = {
          unit: AUTO
        };
      } // lineHeight默认数字，想要px必须强制带单位
      else if (/px$/i.test(temp)) {
          style.lineHeight = {
            value: parseFloat(temp),
            unit: PX$1
          };
        } else {
          var n = Math.max(0, parseFloat(temp)) || 'normal'; // 非法数字

          if (n === 'normal') {
            style.lineHeight = {
              unit: AUTO
            };
          } else {
            style.lineHeight = {
              value: n,
              unit: NUMBER
            };
          }
        }
    }

    temp = style.strokeDasharray;

    if (!isNil$3(temp)) {
      var _match3 = temp.toString().match(/[\d.]+/g);

      if (_match3) {
        _match3 = _match3.map(function (item) {
          return parseFloat(item);
        });

        if (_match3.length % 2 === 1) {
          _match3.push(_match3[_match3.length - 1]);
        }

        style.strokeDasharray = _match3;
      } else {
        style.strokeDasharray = [];
      }
    } // fill和stroke为渐变时特殊处理，fillRule无需处理字符串


    temp = style.fill;

    if (temp) {
      if (temp.indexOf('-gradient(') > 0) {
        style.fill = gradient.parseGradient(temp);
      } else {
        style.fill = rgba2int$2(temp);
      }
    }

    temp = style.stroke;

    if (temp) {
      if (temp.indexOf('-gradient(') > 0) {
        style.stroke = gradient.parseGradient(temp);
      } else {
        style.stroke = rgba2int$2(temp);
      }
    }

    temp = style.filter;

    if (temp) {
      style.filter = [];
      var blur = /\bblur\s*\(\s*([\d.]+)\s*(?:px)?\s*\)/i.exec(temp);

      if (blur) {
        var _v = parseFloat(blur[1]) || 0;

        if (_v) {
          style.filter.push(['blur', _v]);
        }
      }
    }

    temp = style.visibility;

    if (temp) {
      if (temp === 'inherit') {
        style.visibility = {
          unit: INHERIT$1
        };
      } else {
        style.visibility = {
          value: temp,
          unit: STRING
        };
      }
    }

    temp = style.pointerEvents;

    if (temp) {
      if (temp === 'inherit') {
        style.pointerEvents = {
          unit: INHERIT$1
        };
      } else {
        style.pointerEvents = {
          value: temp,
          unit: STRING
        };
      }
    }

    temp = style.boxShadow;

    if (temp) {
      style.boxShadow = [];

      var _match4 = temp.match(/(-?[\d.]+(px)?)\s+(-?[\d.]+(px)?)\s+(-?[\d.]+(px)?\s*)?(-?[\d.]+(px)?\s*)?(((transparent)|(#[0-9a-f]{3,6})|(rgba?\(.+?\)))\s*)?(inset|outset)?\s*,?/ig);

      _match4.forEach(function (item) {
        var boxShadow = /(-?[\d.]+(?:px)?)\s+(-?[\d.]+(?:px)?)\s+(-?[\d.]+(?:px)?\s*)?(-?[\d.]+(?:px)?\s*)?(?:((?:transparent)|(?:#[0-9a-f]{3,6})|(?:rgba?\(.+\)))\s*)?(inset|outset)?/i.exec(item);

        if (boxShadow) {
          var res = [boxShadow[1], boxShadow[2], boxShadow[3] || 0, boxShadow[4] || 0, boxShadow[5] || '#000', boxShadow[6] || 'outset'];

          for (var _i3 = 0; _i3 < 4; _i3++) {
            calUnit(res, _i3, res[_i3]); // x/y可以负，blur和spread不行，没有继承且只有px无需保存单位

            if (_i3 > 1 && res[_i3].value < 0) {
              res[_i3] = 0;
            }

            if (res[_i3].unit === NUMBER) {
              res[_i3] = res[_i3].value;
            }
          }

          res[4] = rgba2int$2(res[4]);
          style.boxShadow.push(res);
        }
      });
    }

    return style;
  }
  /**
   * 第一次和REFLOW等级下，刷新前首先执行，生成computedStyle
   * 影响文字测量的只有字体和大小和重量，需要提前处理
   * 继承相关的计算
   * @param node 对象节点
   * @param isHost 是否是根节点或组件节点这种局部根节点，无继承需使用默认值
   */


  function computeMeasure(node, isHost) {
    var currentStyle = node.currentStyle,
        computedStyle = node.computedStyle,
        parent = node.parent;
    var parentComputedStyle = !isHost && parent.computedStyle;
    o.MEASURE_KEY_SET.forEach(function (k) {
      var v = currentStyle[k];

      if (v.unit === INHERIT$1) {
        computedStyle[k] = isHost ? reset.INHERIT[k] : parentComputedStyle[k];
      } // 只有fontSize会有%
      else if (v.unit === PERCENT$1) {
          computedStyle[k] = isHost ? reset.INHERIT[k] : parentComputedStyle[k] * v.value * 0.01;
        } else {
          computedStyle[k] = v.value;
        }
    });
  }
  /**
   * 每次布局前需要计算的reflow相关的computedStyle
   * @param node 对象节点
   * @param isHost 是否是根节点或组件节点这种局部根节点，无继承需使用默认值
   */


  function computeReflow(node, isHost) {
    var currentStyle = node.currentStyle,
        computedStyle = node.computedStyle,
        parent = node.parent;
    var textAlign = currentStyle.textAlign,
        lineHeight = currentStyle.lineHeight;
    var isRoot = !parent;
    var parentComputedStyle = parent && parent.computedStyle;
    ['borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth'].forEach(function (k) {
      // border-width不支持百分比
      computedStyle[k] = currentStyle[k].unit === PX$1 ? Math.max(0, currentStyle[k].value) : 0;
    });
    ['position', 'display', 'flexDirection', 'justifyContent', 'alignItems', 'alignSelf', 'flexGrow', 'flexShrink'].forEach(function (k) {
      computedStyle[k] = currentStyle[k];
    });

    if (textAlign.unit === INHERIT$1) {
      computedStyle.textAlign = isRoot ? 'left' : parentComputedStyle.textAlign;
    } else {
      computedStyle.textAlign = isRoot ? 'left' : textAlign.value;
    }

    if (lineHeight.unit === INHERIT$1) {
      computedStyle.lineHeight = isRoot ? calNormalLineHeight(computedStyle) : parentComputedStyle.lineHeight;
    } // 防止为0
    else if (lineHeight.unit === PX$1) {
        computedStyle.lineHeight = Math.max(lineHeight.value, 0) || calNormalLineHeight(computedStyle);
      } else if (lineHeight.unit === NUMBER) {
        computedStyle.lineHeight = Math.max(lineHeight.value, 0) * computedStyle.fontSize || calNormalLineHeight(computedStyle);
      } // normal
      else {
          computedStyle.lineHeight = calNormalLineHeight(computedStyle);
        }
  }

  function setFontStyle(style) {
    var fontStyle = style.fontStyle,
        fontWeight = style.fontWeight,
        fontSize = style.fontSize,
        fontFamily = style.fontFamily;
    return (fontStyle || 'normal') + ' ' + (fontWeight || '400') + ' ' + fontSize + 'px/' + fontSize + 'px ' + (fontFamily || 'arial');
  }

  function getBaseLine(style) {
    var normal = style.fontSize * font.arial.lhr;
    return (style.lineHeight - normal) * 0.5 + style.fontSize * font.arial.blr;
  }

  function calNormalLineHeight(computedStyle) {
    return computedStyle.fontSize * font.arial.lhr;
  }

  function calRelativePercent(n, parent, k) {
    n *= 0.01;

    while (parent) {
      var style = parent.currentStyle[k];

      if (style.unit === AUTO) {
        if (k === 'width') {
          parent = parent.parent;
        } else {
          break;
        }
      } else if (style.unit === PX$1) {
        return n * style.value;
      } else if (style.unit === PERCENT$1) {
        n *= style.value * 0.01;
        parent = parent.parent;
      }
    }

    return n;
  }

  function calRelative(currentStyle, k, v, parent, isWidth) {
    if (v.unit === AUTO) {
      v = 0;
    } else if ([PX$1, NUMBER, DEG, RGBA, STRING].indexOf(v.unit) > -1) {
      v = v.value;
    } else if (v.unit === PERCENT$1) {
      if (isWidth) {
        v = calRelativePercent(v.value, parent, 'width');
      } else {
        v = calRelativePercent(v.value, parent, 'height');
      }
    }

    return v;
  }

  function calAbsolute(currentStyle, k, v, size) {
    if (v.unit === AUTO) {
      v = 0;
    } else if ([PX$1, NUMBER, DEG, RGBA, STRING].indexOf(v.unit) > -1) {
      v = v.value;
    } else if (v.unit === PERCENT$1) {
      v = v.value * size * 0.01;
    }

    return v;
  }

  function equalStyle(k, a, b, target) {
    if (!a || !b) {
      return a === b;
    }

    if (k === 'transform') {
      if (a.length !== b.length) {
        return false;
      }

      for (var i = 0, len = a.length; i < len; i++) {
        var oa = a[i];
        var ob = b[i];

        if (oa[0] !== ob[0]) {
          return false;
        }

        if (oa === 'matrix') {
          if (!util.equalArr(oa[1], ob[1])) {
            return false;
          }
        } else if (!util.equal(oa[1], ob[1])) {
          return false;
        }
      }

      return true;
    }

    if (k === 'filter') {
      if (a.length !== b.length) {
        return false;
      }

      for (var _i4 = 0, _len = a.length; _i4 < _len; _i4++) {
        if (!util.equalArr(a[_i4], b[_i4])) {
          return false;
        }
      }
    }

    if (k === 'transformOrigin' || k === 'backgroundSize') {
      return a[0].value === b[0].value && a[0].unit === b[0].unit && a[1].value === b[1].value && a[1].unit === b[1].unit;
    }

    if (k === 'backgroundPositionX' || k === 'backgroundPositionY' || LENGTH_HASH$1.hasOwnProperty(k) || EXPAND_HASH$1.hasOwnProperty(k)) {
      return a.value === b.value && a.unit === b.unit;
    }

    if (k === 'boxShadow') {
      return util.equalArr(a, b);
    }

    if (RADIUS_HASH$1.hasOwnProperty(k)) {
      return a[0].value === b[0].value && a[0].unit === b[0].unit && a[1].value === b[1].value && a[1].unit === b[1].unit;
    }

    if (COLOR_HASH$1.hasOwnProperty(k)) {
      return a.unit === b.unit && util.equalArr(a.value, b.value);
    }

    if (GRADIENT_HASH$1.hasOwnProperty(k) && a.k === b.k && GRADIENT_TYPE$1.hasOwnProperty(a.k)) {
      var av = a.v;
      var bv = b.v;

      if (a.d !== b.d || av.length !== bv.length) {
        return false;
      }

      for (var _i5 = 0, _len2 = av.length; _i5 < _len2; _i5++) {
        var ai = av[_i5];
        var bi = bv[_i5];

        if (ai.length !== bi.length) {
          return false;
        }

        for (var j = 0; j < 4; j++) {
          if (ai[0][j] !== bi[0][j]) {
            return false;
          }
        }

        if (ai.length > 1) {
          if (ai[1].value !== bi[1].value || ai[1].unit !== bi[1].unit) {
            return false;
          }
        }
      }

      return true;
    } // multi都是纯值数组，equalArr本身即递归，非multi根据类型判断


    if (o.isGeom(target.tagName, k) && (target.isMulti || Array.isArray(a) && Array.isArray(b))) {
      return util.equalArr(a, b);
    }

    return a === b;
  }

  function isRelativeOrAbsolute(node) {
    var position = node.currentStyle.position;
    return position === 'relative' || position === 'absolute';
  }

  var css = {
    normalize: normalize,
    computeMeasure: computeMeasure,
    computeReflow: computeReflow,
    setFontStyle: setFontStyle,
    getBaseLine: getBaseLine,
    calRelative: calRelative,
    calAbsolute: calAbsolute,
    equalStyle: equalStyle,
    isRelativeOrAbsolute: isRelativeOrAbsolute
  };

  var LineBox = /*#__PURE__*/function () {
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
      value: function render(renderMode, ctx, computedStyle, cacheStyle, dx, dy) {
        var content = this.content,
            x = this.x,
            y = this.y,
            parent = this.parent;
        var ox = parent.ox,
            oy = parent.oy;
        y += css.getBaseLine(computedStyle);
        x += ox + dx;
        y += oy + dy;

        if (renderMode === mode.CANVAS) {
          ctx.fillText(content, x, y);
        } else if (renderMode === mode.SVG) {
          this.__virtualDom = {
            type: 'item',
            tagName: 'text',
            props: [['x', x], ['y', y], ['fill', cacheStyle.color], ['font-family', computedStyle.fontFamily], ['font-weight', computedStyle.fontWeight], ['font-style', computedStyle.fontStyle], ['font-size', computedStyle.fontSize + 'px']],
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

  var Text = /*#__PURE__*/function (_Node) {
    _inherits(Text, _Node);

    var _super = _createSuper(Text);

    function Text(content) {
      var _this;

      _classCallCheck(this, Text);

      _this = _super.call(this);
      _this.__content = util.isNil(content) ? '' : content.toString();
      _this.__lineBoxes = [];
      _this.__charWidthList = [];
      _this.__charWidth = 0;
      _this.__textWidth = 0;
      return _this;
    }

    _createClass(Text, [{
      key: "__computeMeasure",
      // 预先计算每个字的宽度
      value: function __computeMeasure(renderMode, ctx) {
        var content = this.content,
            computedStyle = this.computedStyle,
            charWidthList = this.charWidthList; // 每次都要清空重新计算，计算会有缓存

        charWidthList.splice(0);

        if (renderMode === mode.CANVAS) {
          ctx.font = css.setFontStyle(computedStyle);
        }

        var key = computedStyle.fontSize + ',' + computedStyle.fontFamily + ',' + computedStyle.fontWeight;
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
            }

            wait.hash[_char] = true; // 先预存标识位-1，测量完后替换它

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
        var key = computedStyle.fontSize + ',' + computedStyle.fontFamily + ',' + computedStyle.fontWeight;
        var cache = Text.CHAR_WIDTH_CACHE[key];
        var sum = 0;

        for (var i = 0, len = charWidthList.length; i < len; i++) {
          if (charWidthList[i] < 0) {
            var mw = charWidthList[i] = cache[content.charAt(i)];
            sum += mw;
            this.__charWidth = Math.max(this.charWidth, mw);
          }
        }

        this.__textWidth = sum;
      }
    }, {
      key: "__layout",
      value: function __layout(data, isVirtual) {
        var _this2 = this;

        var x = data.x,
            y = data.y,
            w = data.w;
        this.__x = x;
        this.__y = y;
        var isDestroyed = this.isDestroyed,
            content = this.content,
            computedStyle = this.computedStyle,
            lineBoxes = this.lineBoxes,
            charWidthList = this.charWidthList;

        if (isDestroyed || computedStyle.display === 'none') {
          return;
        }

        this.__ox = this.__oy = 0;
        lineBoxes.splice(0); // 顺序尝试分割字符串为lineBox，形成多行

        var begin = 0;
        var i = 0;
        var count = 0;
        var length = content.length;
        var maxW = 0;

        while (i < length) {
          count += charWidthList[i];

          if (count === w) {
            var lineBox = new LineBox(this, x, y, count, content.slice(begin, i + 1));
            lineBoxes.push(lineBox);
            maxW = Math.max(maxW, count);
            y += computedStyle.lineHeight;
            begin = i + 1;
            i = begin;
            count = 0;
          } else if (count > w) {
            var width = void 0; // 宽度不足时无法跳出循环，至少也要塞个字符形成一行

            if (i === begin) {
              i = begin + 1;
              width = count;
            } else {
              width = count - charWidthList[i];
            }

            var _lineBox = new LineBox(this, x, y, width, content.slice(begin, i));

            lineBoxes.push(_lineBox);
            maxW = Math.max(maxW, width);
            y += computedStyle.lineHeight;
            begin = i;
            count = 0;
          } else {
            i++;
          }
        } // 最后一行，只有一行未满时也进这里


        if (begin < length && begin < i) {
          count = 0;

          for (i = begin; i < length; i++) {
            count += charWidthList[i];
          }

          var _lineBox2 = new LineBox(this, x, y, count, content.slice(begin, length));

          lineBoxes.push(_lineBox2);
          maxW = Math.max(maxW, count);
          y += computedStyle.lineHeight;
        }

        this.__width = maxW;
        this.__height = y - data.y; // flex/abs前置计算无需真正布局

        if (!isVirtual) {
          var textAlign = computedStyle.textAlign;

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
      key: "__calAbsWidth",
      value: function __calAbsWidth(x, y, w) {
        this.__layout({
          x: x,
          y: y,
          w: w
        }, true);

        return this.width;
      }
    }, {
      key: "render",
      value: function render(renderMode, lv, ctx, defs) {
        var dx = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
        var dy = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;

        if (renderMode === mode.SVG) {
          this.__virtualDom = {
            type: 'text',
            children: []
          };
        }

        var isDestroyed = this.isDestroyed,
            computedStyle = this.computedStyle,
            lineBoxes = this.lineBoxes,
            cacheStyle = this.cacheStyle;

        if (isDestroyed || computedStyle.display === 'none' || computedStyle.visibility === 'hidden') {
          return;
        }

        if (renderMode === mode.CANVAS) {
          var font = css.setFontStyle(computedStyle);

          if (ctx.font !== font) {
            ctx.font = font;
          }

          var color = cacheStyle.color;

          if (ctx.fillStyle !== color) {
            ctx.fillStyle = color;
          }
        }

        lineBoxes.forEach(function (item) {
          item.render(renderMode, ctx, computedStyle, cacheStyle, dx, dy);
        });

        if (renderMode === mode.SVG) {
          this.virtualDom.children = lineBoxes.map(function (lineBox) {
            return lineBox.virtualDom;
          });
        }
      }
    }, {
      key: "deepScan",
      value: function deepScan(cb) {
        cb(this);
      }
    }, {
      key: "__mergeBbox",
      value: function __mergeBbox(matrix, tx, ty, dx, dy) {
        return util.transformBbox(this.bbox, matrix, dx, dy);
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
        var lineBoxes = this.lineBoxes;

        if (!lineBoxes.length) {
          return 0;
        }

        var last = lineBoxes[lineBoxes.length - 1];
        return last.y - this.y + last.baseLine;
      }
    }, {
      key: "currentStyle",
      get: function get() {
        return this.parent.currentStyle;
      }
    }, {
      key: "computedStyle",
      get: function get() {
        return this.parent.computedStyle;
      }
    }, {
      key: "cacheStyle",
      get: function get() {
        return this.parent.__cacheStyle;
      }
    }, {
      key: "bbox",
      get: function get() {
        var sx = this.sx,
            sy = this.sy,
            width = this.width,
            height = this.height;
        var x1 = sx,
            y1 = sy;
        var x2 = sx + width,
            y2 = sy + height;
        return [x1, y1, x2, y2];
      }
    }]);

    return Text;
  }(Node);

  _defineProperty(Text, "CHAR_WIDTH_CACHE", {});

  _defineProperty(Text, "MEASURE_TEXT", {
    list: [],
    data: {}
  });

  Text.prototype.__renderByMask = Text.prototype.render;

  function canvasPolygon(ctx, list) {
    var dx = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var dy = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

    if (!list || !list.length) {
      return;
    }

    var start = 0;

    for (var i = 0, len = list.length; i < len; i++) {
      var item = list[i];

      if (Array.isArray(item)) {
        start = i;
        break;
      }
    }

    ctx.moveTo(list[start][0] + dx, list[start][1] + dy);

    for (var _i = start + 1, _len = list.length; _i < _len; _i++) {
      var _item = list[_i];

      if (!Array.isArray(_item)) {
        continue;
      }

      if (_item.length === 2) {
        ctx.lineTo(_item[0] + dx, _item[1] + dy);
      } else if (_item.length === 4) {
        ctx.quadraticCurveTo(_item[0] + dx, _item[1] + dy, _item[2] + dx, _item[3] + dy);
      } else if (_item.length === 6) {
        ctx.bezierCurveTo(_item[0] + dx, _item[1] + dy, _item[2] + dx, _item[3] + dy, _item[4] + dx, _item[5] + dy);
      }
    }
  }

  function svgPolygon(list) {
    if (!list || !list.length) {
      return '';
    }

    var start = 0;

    for (var i = 0, len = list.length; i < len; i++) {
      var item = list[i];

      if (Array.isArray(item)) {
        start = i;
        break;
      }
    }

    var s = 'M' + list[start][0] + ',' + list[start][1];

    for (var _i2 = start + 1, _len2 = list.length; _i2 < _len2; _i2++) {
      var _item2 = list[_i2];

      if (!Array.isArray(_item2)) {
        continue;
      }

      if (_item2.length === 2) {
        s += 'L' + _item2[0] + ',' + _item2[1];
      } else if (_item2.length === 4) {
        s += 'Q' + _item2[0] + ',' + _item2[1] + ' ' + _item2[2] + ',' + _item2[3];
      } else if (_item2.length === 6) {
        s += 'C' + _item2[0] + ',' + _item2[1] + ' ' + _item2[2] + ',' + _item2[3] + ' ' + _item2[4] + ',' + _item2[5];
      }
    }

    return s;
  }

  function canvasLine(ctx, x1, y1, x2, y2, controlA, controlB, num) {
    var dx = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : 0;
    var dy = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : 0;
    ctx.moveTo(x1 + dx, y1 + dy);

    if (num === 3) {
      ctx.bezierCurveTo(controlA[0] + dx, controlA[1] + dy, controlB[0] + dx, controlB[1], x2 + dx, y2 + dy);
      return 2;
    } else if (num === 2) {
      ctx.quadraticCurveTo(controlB[0] + dx, controlB[1] + dy, x2 + dx, y2 + dy);
      return 2;
    } else if (num === 1) {
      ctx.quadraticCurveTo(controlA[0] + dx, controlA[1] + dy, x2 + dx, y2 + dy);
      return 2;
    } else {
      ctx.lineTo(x2 + dx, y2 + dy);
      return 1;
    }
  }

  function svgLine(x1, y1, x2, y2, controlA, controlB, num) {
    if (num === 3) {
      return 'M' + x1 + ',' + y1 + 'C' + controlA[0] + ',' + controlA[1] + ' ' + controlB[0] + ',' + controlB[1] + ' ' + x2 + ',' + y2;
    } else if (num === 2) {
      return 'M' + x1 + ',' + y1 + 'Q' + controlB[0] + ',' + controlB[1] + ' ' + x2 + ',' + y2;
    } else if (num === 1) {
      return 'M' + x1 + ',' + y1 + 'Q' + controlA[0] + ',' + controlA[1] + ' ' + x2 + ',' + y2;
    } else {
      return 'M' + x1 + ',' + y1 + 'L' + x2 + ',' + y2;
    }
  }

  var OFFSET = Math.PI * 0.5;

  function canvasSector(ctx, cx, cy, r, x1, y1, x2, y2, strokeWidth, begin, end, large, edge, closure) {
    var dx = arguments.length > 14 && arguments[14] !== undefined ? arguments[14] : 0;
    var dy = arguments.length > 15 && arguments[15] !== undefined ? arguments[15] : 0;
    ctx.arc(cx + dx, cy + dy, r, begin * Math.PI / 180 - OFFSET, end * Math.PI / 180 - OFFSET);

    if (edge) {
      if (!large || !closure) {
        ctx.lineTo(cx + dx, cy + dy);
      }

      ctx.lineTo(x1 + dx, y1 + dy);

      if (strokeWidth > 0) {
        ctx.stroke();
      }
    } else {
      if (strokeWidth > 0) {
        ctx.stroke();
      }

      if (!large || !closure) {
        ctx.lineTo(cx + dx, cy + dy);
      }

      ctx.lineTo(x1 + dx, y1 + dy);
    }
  }

  function svgSector(cx, cy, r, x1, y1, x2, y2, strokeWidth, large, edge, closure) {
    var d = closure && large ? 'M' + x1 + ',' + y1 + 'A' + r + ',' + r + ' 0 ' + large + ' 1 ' + x2 + ',' + y2 + 'z' : 'M' + cx + ',' + cy + 'L' + x1 + ',' + y1 + 'A' + r + ',' + r + ' 0 ' + large + ' 1 ' + x2 + ',' + y2 + 'z';
    var d2;

    if (!edge || strokeWidth > 0) {
      d2 = 'M' + x1 + ',' + y1 + 'A' + r + ',' + r + ' 0 ' + large + ' 1 ' + x2 + ',' + y2;
    }

    return [d, d2];
  }

  var painter = {
    canvasPolygon: canvasPolygon,
    svgPolygon: svgPolygon,
    canvasLine: canvasLine,
    svgLine: svgLine,
    canvasSector: canvasSector,
    svgSector: svgSector
  };

  function calDeg(x1, y1, x2, y2) {
    var dx = x2 - x1;
    var dy = y2 - y1;
    var atan = Math.atan(Math.abs(dy) / Math.abs(dx)); // 2象限

    if (dx < 0 && dy >= 0) {
      return Math.PI - atan;
    } // 3象限


    if (dx < 0 && dy < 0) {
      return atan - Math.PI;
    } // 1象限


    if (dx >= 0 && dy >= 0) {
      return atan;
    } // 4象限，顺时针正好


    return -atan;
  }

  function rotate(theta) {
    var sin = Math.sin(theta);
    var cos = Math.cos(theta);
    var t = mx.identity();
    t[0] = t[3] = cos;
    t[1] = sin;
    t[2] = -sin;
    return t;
  }
  /**
   * 确保3个点中，a点在三角形左上方，b/c在右方，同时ab到ac要顺时针旋转
   * @param points
   */


  function pointIndex(points) {
    var _points = _slicedToArray(points, 6),
        x1 = _points[0],
        y1 = _points[1],
        x2 = _points[2],
        y2 = _points[3],
        x3 = _points[4],
        y3 = _points[5];

    var index = [0, 1, 2]; // 将a点放入最左

    if (x2 < x1 && x2 < x3) {
      var _ref = [x2, y2, x1, y1];
      x1 = _ref[0];
      y1 = _ref[1];
      x2 = _ref[2];
      y2 = _ref[3];
      index[0] = 1;
      index[1] = 0;
    } else if (x3 < x2 && x3 < x1) {
      var _ref2 = [x3, y3, x1, y1];
      x1 = _ref2[0];
      y1 = _ref2[1];
      x3 = _ref2[2];
      y3 = _ref2[3];
      index[0] = 2;
      index[2] = 0;
    } // 有可能出现2个并列的情况，判断取上面那个


    if (x1 === x2) {
      if (y1 > y2) {
        var _ref3 = [x2, y2, x1, y1];
        x1 = _ref3[0];
        y1 = _ref3[1];
        x2 = _ref3[2];
        y2 = _ref3[3];
        var t = index[0];
        index[0] = index[1];
        index[1] = t;
      }
    } else if (x1 === x3) {
      if (y1 > y3) {
        var _ref4 = [x3, y3, x1, y1];
        x1 = _ref4[0];
        y1 = _ref4[1];
        x3 = _ref4[2];
        y3 = _ref4[3];
        var _t = index[0];
        index[0] = index[2];
        index[2] = _t;
      }
    } // ab到ac要顺时针旋转，即2个向量夹角为正，用向量叉乘判断正负


    var cross = (x2 - x1) * (y3 - y1) - (x3 - x1) * (y2 - y1);

    if (cross < 0) {
      var _ref5 = [x3, y3, x2, y2];
      x2 = _ref5[0];
      y2 = _ref5[1];
      x3 = _ref5[2];
      y3 = _ref5[3];
      var _t2 = index[1];
      index[1] = index[2];
      index[2] = _t2;
    }

    return [x1, y1, x2, y2, x3, y3, index];
  }
  /**
   * 第2个点根据第一个点的交换顺序交换
   * @param points
   * @param index
   * @returns {[]}
   */


  function pointByIndex(points, index) {
    var res = [];

    for (var i = 0, len = index.length; i < len; i++) {
      var j = index[i];
      res.push(points[j * 2]);
      res.push(points[j * 2 + 1]);
    }

    return res;
  }
  /**
   * 确保3个点中，a点在三角形左上方，b/c在右方，同时ab到ac要顺时针旋转
   * @param source 源3个点
   * @param target 目标3个点
   * @returns 交换顺序后的点坐标
   */


  function exchangeOrder(source, target) {
    var _pointIndex = pointIndex(source),
        _pointIndex2 = _slicedToArray(_pointIndex, 7),
        sx1 = _pointIndex2[0],
        sy1 = _pointIndex2[1],
        sx2 = _pointIndex2[2],
        sy2 = _pointIndex2[3],
        sx3 = _pointIndex2[4],
        sy3 = _pointIndex2[5],
        index = _pointIndex2[6];

    var _pointByIndex = pointByIndex(target, index),
        _pointByIndex2 = _slicedToArray(_pointByIndex, 6),
        tx1 = _pointByIndex2[0],
        ty1 = _pointByIndex2[1],
        tx2 = _pointByIndex2[2],
        ty2 = _pointByIndex2[3],
        tx3 = _pointByIndex2[4],
        ty3 = _pointByIndex2[5];

    return [[sx1, sy1, sx2, sy2, sx3, sy3], [tx1, ty1, tx2, ty2, tx3, ty3]];
  }
  /**
   * 存在一种情况，变换结果使得三角形镜像相反了，即顶点a越过bc线，判断是否溢出
   * @param source
   * @param target
   * @returns {boolean}是否溢出
   */


  function isOverflow(source, target) {
    var _source = _slicedToArray(source, 6),
        sx1 = _source[0],
        sy1 = _source[1],
        sx2 = _source[2],
        sy2 = _source[3],
        sx3 = _source[4],
        sy3 = _source[5];

    var _target = _slicedToArray(target, 6),
        tx1 = _target[0],
        ty1 = _target[1],
        tx2 = _target[2],
        ty2 = _target[3],
        tx3 = _target[4],
        ty3 = _target[5];

    var cross1 = (sx2 - sx1) * (sy3 - sy1) - (sx3 - sx1) * (sy2 - sy1);
    var cross2 = (tx2 - tx1) * (ty3 - ty1) - (tx3 - tx1) * (ty2 - ty1);
    return cross1 > 0 && cross2 < 0 || cross1 < 0 && cross2 > 0;
  }

  function transform(source, target) {
    var _source2 = _slicedToArray(source, 6),
        sx1 = _source2[0],
        sy1 = _source2[1],
        sx2 = _source2[2],
        sy2 = _source2[3],
        sx3 = _source2[4],
        sy3 = _source2[5];

    var _target2 = _slicedToArray(target, 6),
        tx1 = _target2[0],
        ty1 = _target2[1],
        tx2 = _target2[2],
        ty2 = _target2[3],
        tx3 = _target2[4],
        ty3 = _target2[5]; // 记录翻转


    var overflow = isOverflow(source, target); // 第0步，将源三角第1个a点移到原点

    var m = mx.identity();
    m[4] = -sx1;
    m[5] = -sy1;
    var t; // 第1步，以第1条边ab为基准，将其贴合x轴上，为后续倾斜不干扰做准备

    var theta = calDeg(sx1, sy1, sx2, sy2);

    if (theta !== 0) {
      t = rotate(-theta);
      m = mx.multiply(t, m);
    } // 第2步，以第1条边AB为基准，缩放x轴ab至目标相同长度，可与4步合并


    var ls = geom.pointsDistance(sx1, sy1, sx2, sy2);
    var lt = geom.pointsDistance(tx1, ty1, tx2, ty2); // if(ls !== lt) {
    // let scale = lt / ls;
    // t = matrix.identity();
    // t[0] = scale;
    // m = matrix.multiply(t, m);
    // }
    // 第3步，缩放y，先将目标三角形旋转到x轴平行，再变换坐标计算

    var n = mx.identity();
    n[4] = -tx1;
    n[5] = -ty1;
    theta = calDeg(tx1, ty1, tx2, ty2); // 记录下这个旋转角度，后面源三角形要反向旋转

    var alpha = theta;

    if (theta !== 0) {
      t = rotate(-theta);
      n = mx.multiply(t, n);
    } // 目标三角反向旋转至x轴后的坐标
    // 源三角目前的第3点坐标y值即为长度，因为a点在原点0无需减去


    var ls2 = Math.abs(mx.calPoint([sx3, sy3], m)[1]);
    var lt2 = Math.abs(mx.calPoint([tx3, ty3], n)[1]); // 缩放y
    // if(ls2 !== lt2) {
    // let scale = lt / ls;
    // t = matrix.identity();
    // t[3] = scale;
    // m = matrix.multiply(t, m);
    // }

    if (ls !== lt || ls2 !== lt2) {
      t = mx.identity();

      if (ls !== lt) {
        t[0] = lt / ls;
      }

      if (ls2 !== lt2) {
        t[3] = lt2 / ls2;
      }

      m = mx.multiply(t, m);
    } // 第4步，x轴倾斜，用余弦定理求目前a和A的夹角


    n = m;

    var _matrix$calPoint = mx.calPoint([sx1, sy1], n),
        _matrix$calPoint2 = _slicedToArray(_matrix$calPoint, 2),
        ax1 = _matrix$calPoint2[0],
        ay1 = _matrix$calPoint2[1];

    var _matrix$calPoint3 = mx.calPoint([sx2, sy2], n),
        _matrix$calPoint4 = _slicedToArray(_matrix$calPoint3, 2),
        ax2 = _matrix$calPoint4[0],
        ay2 = _matrix$calPoint4[1];

    var _matrix$calPoint5 = mx.calPoint([sx3, sy3], n),
        _matrix$calPoint6 = _slicedToArray(_matrix$calPoint5, 2),
        ax3 = _matrix$calPoint6[0],
        ay3 = _matrix$calPoint6[1];

    var ab = geom.pointsDistance(ax1, ay1, ax2, ay2);
    var ac = geom.pointsDistance(ax1, ay1, ax3, ay3);
    var bc = geom.pointsDistance(ax3, ay3, ax2, ay2);
    var AB = geom.pointsDistance(tx1, ty1, tx2, ty2);
    var AC = geom.pointsDistance(tx1, ty1, tx3, ty3);
    var BC = geom.pointsDistance(tx3, ty3, tx2, ty2);
    var a = geom.angleBySide(bc, ab, ac);
    var A = geom.angleBySide(BC, AB, AC); // 先至90°，再旋转至目标角，可以合并成tan相加，不知道为什么不能直接tan倾斜差值角度

    if (a !== A) {
      t = mx.identity();
      t[2] = Math.tan(a - Math.PI * 0.5) + Math.tan(Math.PI * 0.5 - A);
      m = mx.multiply(t, m);
    } // 发生翻转时特殊处理按x轴垂直翻转


    if (overflow) {
      m[1] = -m[1];
      m[3] = -m[3];
      m[5] = -m[5];
    } // 第5步，再次旋转，角度为目标旋转到x轴的负值，可与下步合并


    if (alpha !== 0) {
      t = rotate(alpha); // m = matrix.multiply(t, m);
    } else {
      t = mx.identity();
    } // 第6步，移动第一个点的差值
    // t = matrix.identity();


    t[4] = tx1;
    t[5] = ty1;
    m = mx.multiply(t, m);
    return m;
  }

  var tar = {
    exchangeOrder: exchangeOrder,
    isOverflow: isOverflow,
    transform: transform
  };

  var math = {
    matrix: mx,
    tar: tar,
    geom: geom
  };

  var PX$2 = unit.PX,
      PERCENT$2 = unit.PERCENT;
  var matrix = math.matrix,
      geom$1 = math.geom;
  var identity$1 = matrix.identity,
      calPoint$1 = matrix.calPoint,
      multiply$1 = matrix.multiply;
  var d2r$2 = geom$1.d2r,
      pointInPolygon$1 = geom$1.pointInPolygon;

  function calSingle(t, k, v) {
    if (k === 'translateX') {
      t[4] = v;
    } else if (k === 'translateY') {
      t[5] = v;
    } else if (k === 'scaleX') {
      t[0] = v;
    } else if (k === 'scaleY') {
      t[3] = v;
    } else if (k === 'skewX') {
      v = d2r$2(v);
      t[2] = Math.tan(v);
    } else if (k === 'skewY') {
      v = d2r$2(v);
      t[1] = Math.tan(v);
    } else if (k === 'rotateZ') {
      v = d2r$2(v);
      var sin = Math.sin(v);
      var cos = Math.cos(v);
      t[0] = t[3] = cos;
      t[1] = sin;
      t[2] = -sin;
    } else if (k === 'matrix') {
      t[0] = v[0];
      t[1] = v[1];
      t[2] = v[2];
      t[3] = v[3];
      t[4] = v[4];
      t[5] = v[5];
    }
  }

  function calMatrix(transform, ow, oh) {
    var list = normalize$1(transform, ow, oh);
    var m = identity$1();
    list.forEach(function (item) {
      var _item = _slicedToArray(item, 2),
          k = _item[0],
          v = _item[1];

      var t = identity$1();
      calSingle(t, k, v);
      m = multiply$1(m, t);
    });
    return m;
  }

  function calMatrixByOrigin(m, transformOrigin) {
    var _transformOrigin = _slicedToArray(transformOrigin, 2),
        ox = _transformOrigin[0],
        oy = _transformOrigin[1];

    if (ox === 0 && oy === 0) {
      return m;
    }

    var t = identity$1();
    t[4] = ox;
    t[5] = oy;
    var res = multiply$1(t, m);
    var t2 = identity$1();
    t2[4] = -ox;
    t2[5] = -oy;
    res = multiply$1(res, t2);
    return res;
  }

  function calMatrixWithOrigin(transform, transformOrigin, ow, oh) {
    var m = calMatrix(transform, ow, oh);
    return calMatrixByOrigin(m, transformOrigin);
  } // 判断点是否在一个矩形内，比如事件发生是否在节点上


  function pointInQuadrilateral(x, y, x1, y1, x2, y2, x4, y4, x3, y3, matrix) {
    if (matrix && !util.equalArr(matrix, [1, 0, 0, 1, 0, 0])) {
      var _calPoint = calPoint$1([x1, y1], matrix);

      var _calPoint2 = _slicedToArray(_calPoint, 2);

      x1 = _calPoint2[0];
      y1 = _calPoint2[1];

      var _calPoint3 = calPoint$1([x2, y2], matrix);

      var _calPoint4 = _slicedToArray(_calPoint3, 2);

      x2 = _calPoint4[0];
      y2 = _calPoint4[1];

      var _calPoint5 = calPoint$1([x3, y3], matrix);

      var _calPoint6 = _slicedToArray(_calPoint5, 2);

      x3 = _calPoint6[0];
      y3 = _calPoint6[1];

      var _calPoint7 = calPoint$1([x4, y4], matrix);

      var _calPoint8 = _slicedToArray(_calPoint7, 2);

      x4 = _calPoint8[0];
      y4 = _calPoint8[1];
      return pointInPolygon$1(x, y, [[x1, y1], [x2, y2], [x4, y4], [x3, y3]]);
    } else {
      return x >= x1 && y >= y1 && x <= x4 && y <= y4;
    }
  }

  function normalizeSingle(k, v, ow, oh) {
    if (k === 'translateX') {
      if (v.unit === PERCENT$2) {
        return v.value * ow * 0.01;
      }
    } else if (k === 'translateY') {
      if (v.unit === PERCENT$2) {
        return v.value * oh * 0.01;
      }
    } else if (k === 'matrix') {
      return v;
    }

    return v.value;
  }

  function normalize$1(transform, ow, oh) {
    var res = [];
    transform.forEach(function (item) {
      var _item2 = _slicedToArray(item, 2),
          k = _item2[0],
          v = _item2[1];

      res.push([k, normalizeSingle(k, v, ow, oh)]);
    });
    return res;
  }

  function calOrigin(transformOrigin, w, h) {
    var tfo = [];
    transformOrigin.forEach(function (item, i) {
      if (item.unit === PX$2) {
        tfo.push(item.value);
      } else if (item.unit === PERCENT$2) {
        tfo.push(item.value * (i ? h : w) * 0.01);
      }
    });
    return tfo;
  }

  var tf = {
    calMatrix: calMatrix,
    calOrigin: calOrigin,
    calMatrixByOrigin: calMatrixByOrigin,
    calMatrixWithOrigin: calMatrixWithOrigin,
    pointInQuadrilateral: pointInQuadrilateral
  };

  var H$1 = geom.H;

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
  } // 获取边框分割为几块的坐标，虚线分割为若干四边形、三边型、五边形
  // 三边形重复内外边交点形成四边形，五边形进行切割形成2个四边形
  // direction为上右下左0123


  function calPoints(borderWidth, borderStyle, deg1, deg2, x1, x2, x3, x4, y1, y2, y3, y4, direction, beginRadius, endRadius) {
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
            if (main2 <= x2) {
              if (isLast) {
                points.push([[x1, y1], [x4, y1], [x3, y2], [x2, y2]]);
              } else {
                cross1 = y1 + (main1 - x1) * Math.tan(deg1);
                cross2 = y1 + (main2 - x1) * Math.tan(deg1);
                points.push([[main1, y1], [main2, y1], [main2, cross2], [main1, cross1]]);
              }
            } // 整个和borderRight重叠
            else if (main1 >= x3) {
                cross1 = y1 + (x4 - main1) * Math.tan(deg2);
                cross2 = y1 + (x4 - main2) * Math.tan(deg2);

                if (isLast) {
                  points.push([[main1, y1], [x4, y1], [x4, y1], [main1, cross1]]);
                } else {
                  points.push([[main1, y1], [main2, y1], [main2, cross2], [main1, cross1]]);
                }
              } // 不被整个重叠的情况再细分
              else {
                  // 上部分和borderLeft重叠
                  if (main1 < x2) {
                    cross1 = y1 + (main1 - x1) * Math.tan(deg1);
                    points.push([[main1, y1], [x2, y1], [x2, y2], [main1, cross1]]);

                    if (isLast) {
                      points.push([[x2, y1], [x3, y1], [x3, y2], [x2, y2]]);
                      points.push([[x3, y1], [x4, y1], [x4, y1], [x2, y2]]);
                    } else {
                      // 下部分和borderRight重叠
                      if (main2 > x3) {
                        cross2 = y1 + (x4 - main2) * Math.tan(deg2);
                        points.push([[x2, y1], [x3, y1], [x3, y2], [x2, y2]]);
                        points.push([[x3, y1], [main2, y1], [main2, cross2], [x3, y2]]);
                      } // 下部独立
                      else {
                          points.push([[x2, y1], [main2, y1], [main2, y2], [x2, y2]]);
                        }
                    }
                  } // 下部分和borderRight重叠
                  else if (main2 > x3) {
                      cross1 = y1 + (x4 - main2) * Math.tan(deg2); // 上部分和borderLeft重叠

                      if (main1 < x2) {
                        cross2 = y1 + (main1 - x1) * Math.tan(deg1);
                        points.push([[main1, y1], [x2, y1], [x2, y2], [main1, cross2]]);
                        points.push([[x2, y1], [x3, y1], [x3, y2], [x2, y2]]);

                        if (isLast) {
                          points.push([[x3, y1], [x4, y1], [x4, y1], [x3, y2]]);
                        } else {
                          points.push([[x3, y1], [main2, y1], [main2, cross1], [x3, y2]]);
                        }
                      } // 上部独立
                      else {
                          points.push([[main1, y1], [x3, y1], [x3, y2], [main1, y2]]);

                          if (isLast) {
                            points.push([[x3, y1], [x4, y1], [x4, y1], [x3, y2]]);
                          } else {
                            points.push([[x3, y1], [main2, y1], [main2, cross1], [x3, y2]]);
                          }
                        }
                    } // 完全独立
                    else {
                        if (isLast) {
                          points.push([[main1, y1], [x4, y1], [x3, y2], [main1, y2]]);
                        } else {
                          points.push([[main1, y1], [main2, y1], [main2, y2], [main1, y2]]);
                        }
                      }
                }
          } else if (direction === 1) {
            // 整个和borderTop重叠
            if (main2 <= y2) {
              if (isLast) {
                points.push([[x3, y2], [x4, y1], [x4, y4], [x3, y3]]);
              } else {
                cross1 = x4 - (main1 - y1) * Math.tan(deg1);
                cross2 = x4 - (main2 - y1) * Math.tan(deg1);
                points.push([[cross1, main1], [x4, main1], [x4, main2], [cross2, main2]]);
              }
            } // 整个和borderBottom重叠
            else if (main1 >= y3) {
                cross1 = x3 + (main1 - y3) * Math.tan(deg2);
                cross2 = x3 + (main2 - y3) * Math.tan(deg2);

                if (isLast) {
                  points.push([[cross1, main1], [x4, main1], [x4, y4], [x4, y4]]);
                } else {
                  points.push([[cross1, main1], [x4, main1], [x4, main2], [cross2, main2]]);
                }
              } // 不被整个重叠的情况再细分
              else {
                  // 上部分和borderTop重叠
                  if (main1 < y2) {
                    cross1 = x3 + (y2 - main1) * Math.tan(deg1);
                    points.push([[cross1, main1], [x4, main1], [x4, y2], [x3, y2]]);

                    if (isLast) {
                      points.push([[x3, y2], [x4, y2], [x4, y3], [x3, y3]]);
                      points.push([[x3, y3], [x4, y3], [x4, y4], [x4, y4]]);
                    } else {
                      // 下部分和borderBottom重叠
                      if (main2 > y3) {
                        cross2 = x3 + (main2 - y3) * Math.tan(deg2);
                        points.push([[x3, y2], [x4, y2], [x4, y3], [x3, y3]]);
                        points.push([[x3, y3], [x4, y3], [x4, main2], [cross2, main2]]);
                      } // 下部独立
                      else {
                          points.push([[x3, y2], [x4, y2], [x4, main2], [x3, main2]]);
                        }
                    }
                  } // 下部分和borderBottom重叠
                  else if (main2 > y3) {
                      cross1 = x3 + (main2 - y3) * Math.tan(deg2); // 上部分和borderTop重叠

                      if (main1 < y2) {
                        cross2 = x3 + (y2 - main1) * Math.tan(deg1);
                        points.push([[cross2, main1], [x4, main1], [x4, y2], [x3, y2]]);
                        points.push([[x3, y2], [x4, y2], [x4, y3], [x3, y3]]);

                        if (isLast) {
                          points.push([[x3, y3], [x4, y3], [x4, x4], [x4, x4]]);
                        } else {
                          points.push([[x3, y3], [x4, y3], [x4, main2], [cross1, main2]]);
                        }
                      } // 上部独立
                      else {
                          points.push([[x3, main1], [x4, main1], [x4, y3], [x3, y3]]);

                          if (isLast) {
                            points.push([[x3, y3], [x4, y3], [x4, y4], [x4, y4]]);
                          } else {
                            points.push([[x3, y3], [x4, y3], [x4, main2], [cross1, main2]]);
                          }
                        }
                    } // 完全独立
                    else {
                        if (isLast) {
                          points.push([[x3, main1], [x4, main1], [x4, y4], [x3, y3]]);
                        } else {
                          points.push([[x3, main1], [x4, main1], [x4, main2], [x3, main2]]);
                        }
                      }
                }
          } else if (direction === 2) {
            // 整个和borderLeft重叠
            if (main2 <= x2) {
              if (isLast) {
                points.push([[x1, y4], [x2, y3], [x3, y3], [x4, y4]]);
              } else {
                cross1 = y4 - (main1 - x1) * Math.tan(deg1);
                cross2 = y4 - (main2 - x1) * Math.tan(deg1);
                points.push([[main1, cross1], [main2, cross2], [main2, y4], [main1, y4]]);
              }
            } // 整个和borderRight重叠
            else if (main1 >= x3) {
                cross1 = y4 - (x4 - main1) * Math.tan(deg2);
                cross2 = y4 - (x4 - main2) * Math.tan(deg2);

                if (isLast) {
                  points.push([[main1, cross1], [x4, y4], [x4, y4], [main1, y4]]);
                } else {
                  points.push([[main1, cross1], [main2, cross2], [main2, y4], [main1, y4]]);
                }
              } // 不被整个重叠的情况再细分
              else {
                  // 上部分和borderLeft重叠
                  if (main1 < x2) {
                    cross1 = y4 - (main1 - x1) * Math.tan(deg1);
                    points.push([[main1, cross1], [x2, y3], [x2, y4], [main1, y4]]);

                    if (isLast) {
                      points.push([[x2, y3], [x3, y3], [x3, y4], [x2, y4]]);
                      points.push([[x3, y3], [x4, y4], [x4, y4], [x3, y4]]);
                    } else {
                      // 下部分和borderRight重叠
                      if (main2 > x3) {
                        cross2 = y4 - (main2 - x3) * Math.tan(deg2);
                        points.push([[x2, y3], [x3, y3], [x3, y4], [x2, y4]]);
                        points.push([[x3, y3], [main2, cross2], [main2, y4], [x3, y4]]);
                      } // 下部独立
                      else {
                          points.push([[x2, y3], [main2, y3], [main2, y4], [x2, y4]]);
                        }
                    }
                  } // 下部分和borderRight重叠
                  else if (main2 > x3) {
                      cross1 = y4 - (x4 - main2) * Math.tan(deg2); // 上部分和borderLeft重叠

                      if (main1 < x2) {
                        cross2 = y4 - (main1 - x3) * Math.tan(deg1);
                        points.push([[main1, cross2], [x2, y3], [x2, y4], [main1, y4]]);
                        points.push([[x2, y3], [x3, y3], [x3, y4], [x2, y4]]);

                        if (isLast) {
                          points.push([[x3, y3], [x4, y4], [x4, y4], [x3, y4]]);
                        } else {
                          points.push([[x3, y3], [main2, cross1], [main2, y4], [x3, y4]]);
                        }
                      } // 上部独立
                      else {
                          points.push([[main1, y3], [x3, y3], [x3, y4], [main1, y4]]);

                          if (isLast) {
                            points.push([[x3, y3], [x4, y4], [x4, y4], [x3, y4]]);
                          } else {
                            points.push([[x3, y3], [main2, cross1], [main2, y4], [x3, y4]]);
                          }
                        }
                    } // 完全独立
                    else {
                        if (isLast) {
                          points.push([[main1, y3], [x3, y3], [x4, y4], [main1, y4]]);
                        } else {
                          points.push([[main1, y3], [main2, y3], [main2, y4], [main1, y4]]);
                        }
                      }
                }
          } else if (direction === 3) {
            // 整个和borderTop重叠
            if (main2 <= y2) {
              if (isLast) {
                points.push([[x1, y1], [x2, y2], [x2, y3], [x1, y4]]);
              } else {
                cross1 = x1 + (main1 - y1) * Math.tan(deg1);
                cross2 = x1 + (main2 - y1) * Math.tan(deg1);
                points.push([[x1, main1], [cross1, main1], [cross2, main2], [x1, main2]]);
              }
            } // 整个和borderBottom重叠
            else if (main1 >= y3) {
                cross1 = x1 + (y4 - main1) * Math.tan(deg2);
                cross2 = x1 + (y4 - main2) * Math.tan(deg2);

                if (isLast) {
                  points.push([[x1, main1], [cross1, main1], [x1, y4], [x1, y4]]);
                } else {
                  points.push([[x1, main1], [cross1, main1], [cross2, main2], [x1, main2]]);
                }
              } // 不被整个重叠的情况再细分
              else {
                  // 上部分和borderTop重叠
                  if (main1 < y2) {
                    cross1 = x1 + (main1 - y1) * Math.tan(deg1);
                    points.push([[x1, main1], [cross1, main1], [x2, y2], [x1, y2]]);

                    if (isLast) {
                      points.push([[x1, y2], [x2, y2], [x2, y3], [x1, y3]]);
                      points.push([[x1, y3], [x2, y3], [x1, y4], [x1, y4]]);
                    } else {
                      // 下部分和borderBottom重叠
                      if (main2 > y3) {
                        cross2 = x1 + (y4 - main2) * Math.tan(deg2);
                        points.push([[x1, y2], [x2, y2], [x2, y3], [x1, y3]]);
                        points.push([[x1, y3], [x2, y3], [cross2, main2], [x1, main2]]);
                      } // 下部独立
                      else {
                          points.push([[x1, y2], [x2, y2], [x2, main2], [x1, main2]]);
                        }
                    }
                  } // 下部分和borderBottom重叠
                  else if (main2 > y3) {
                      cross1 = x1 + (y4 - main2) * Math.tan(deg2); // 上部分和borderTop重叠

                      if (main1 < y2) {
                        cross2 = x1 + (main1 - y1) * Math.tan(deg1);
                        points.push([[x1, main1], [cross2, main1], [x2, y2], [x1, y1]]);
                        points.push([[x1, y2], [x2, y2], [x2, y3], [x1, y3]]);

                        if (isLast) {
                          points.push([[x1, y3], [x2, y3], [x1, y4], [x1, y4]]);
                        } else {
                          points.push([[x1, y3], [x2, y3], [cross1, main2], [x1, main2]]);
                        }
                      } // 上部独立
                      else {
                          points.push([[x1, main1], [x2, main1], [x2, y3], [x1, y3]]);

                          if (isLast) {
                            points.push([[x1, y3], [x2, y3], [x1, y4], [x1, y4]]);
                          } else {
                            points.push([[x1, y3], [x2, y3], [cross1, main2], [x1, main2]]);
                          }
                        }
                    } // 完全独立
                    else {
                        if (isLast) {
                          points.push([[x1, main1], [x2, main1], [x2, y3], [x1, y4]]);
                        } else {
                          points.push([[x1, main1], [x2, main1], [x2, main2], [x1, main2]]);
                        }
                      }
                }
          }
        }

        if (direction === 0) {
          return calTopRadiusPoints(borderWidth, deg1, deg2, x1, x2, x3, x4, y1, y2, y3, y4, points, beginRadius, endRadius);
        } else if (direction === 1) {
          return calRightRadiusPoints(borderWidth, deg1, deg2, x1, x2, x3, x4, y1, y2, y3, y4, points, beginRadius, endRadius);
        } else if (direction === 2) {
          return calBottomRadiusPoints(borderWidth, deg1, deg2, x1, x2, x3, x4, y1, y2, y3, y4, points, beginRadius, endRadius);
        } else if (direction === 3) {
          return calLeftRadiusPoints(borderWidth, deg1, deg2, x1, x2, x3, x4, y1, y2, y3, y4, points, beginRadius, endRadius);
        }
      }
    } // 兜底返回实线


    if (direction === 0) {
      if (x2 > x1) {
        points.push([[x1, y1], [x2, y1], [x2, y2], [x1, y1]]);
      }

      points.push([[x2, y1], [x3, y1], [x3, y2], [x2, y2]]);

      if (x4 > x3) {
        points.push([[x3, y1], [x4, y1], [x4, y1], [x3, y2]]);
      }

      return calTopRadiusPoints(borderWidth, deg1, deg2, x1, x2, x3, x4, y1, y2, y3, y4, points, beginRadius, endRadius);
    } else if (direction === 1) {
      if (y2 > y1) {
        points.push([[x4, y1], [x4, y1], [x4, y2], [x3, y2]]);
      }

      points.push([[x3, y2], [x4, y2], [x4, y3], [x3, y3]]);

      if (y4 > y3) {
        points.push([[x3, y3], [x4, y3], [x4, y4], [x4, y4]]);
      }

      return calRightRadiusPoints(borderWidth, deg1, deg2, x1, x2, x3, x4, y1, y2, y3, y4, points, beginRadius, endRadius);
    } else if (direction === 2) {
      if (x2 > x1) {
        points.push([[x1, y4], [x2, y3], [x2, y4], [x1, y4]]);
      }

      points.push([[x2, y3], [x3, y3], [x3, y4], [x2, y4]]);

      if (x4 > x3) {
        points.push([[x3, y3], [x4, y4], [x4, y4], [x3, y4]]);
      }

      return calBottomRadiusPoints(borderWidth, deg1, deg2, x1, x2, x3, x4, y1, y2, y3, y4, points, beginRadius, endRadius);
    } else if (direction === 3) {
      if (y2 > y1) {
        points.push([[x1, y1], [x1, y1], [x2, y2], [x1, y2]]);
      }

      points.push([[x1, y2], [x2, y2], [x2, y3], [x1, y3]]);

      if (y4 > y3) {
        points.push([[x1, y3], [x2, y3], [x1, y4], [x1, y4]]);
      }

      return calLeftRadiusPoints(borderWidth, deg1, deg2, x1, x2, x3, x4, y1, y2, y3, y4, points, beginRadius, endRadius);
    }
  }

  function calTopRadiusPoints(borderWidth, deg1, deg2, x1, x2, x3, x4, y1, y2, y3, y4, pointsList, beginRadius, endRadius) {
    var _beginRadius = _slicedToArray(beginRadius, 2),
        brx = _beginRadius[0],
        bry = _beginRadius[1];

    var _endRadius = _slicedToArray(endRadius, 2),
        erx = _endRadius[0],
        ery = _endRadius[1]; // 一条边的两侧圆角均为0时无效


    if ((!brx || !bry) && (!erx || !ery)) {
      return pointsList;
    } // 分界坐标圆心，左圆角、右圆角、中间矩形，3个区域2个坐标；当左右圆角相接时中间矩形为0即中间2个坐标相等


    var oxl = x2 + brx - (x2 - x1);
    var oxr = x3 - erx + (x4 - x3); // 先拆分，当一块四边形跨越左右圆角和中间非圆角时被拆为3份，只跨一边圆角拆2份，不跨不处理
    // 也有可能左右圆角相接，跨越的只分为左右2份
    // 最终左圆角内的存入begin，右圆角内的存入end，中间center

    var beginList = [];
    var centerList = [];
    var endList = [];

    for (var i = 0, len = pointsList.length; i < len; i++) {
      var points = pointsList[i]; // 全在左圆角

      if (points[1][0] < oxl) {
        beginList.push(points);
      } // 全在右圆角
      else if (points[0][0] > oxr) {
          endList.push(points);
        } // 跨越左右圆角
        else if (points[1][0] > oxr && points[0][0] < oxl) {
            var ya = oxl < x2 ? y1 + Math.tan(deg1) * (oxl - x1) : y2;
            var yb = oxr > x3 ? y1 + Math.tan(deg2) * (x4 - oxr) : y2;
            beginList.push([points[0], [oxl, y1], [oxl, ya], points[3]]);

            if (oxl < oxr) {
              if (oxl > x2 && oxr < x3) {
                centerList.push([[oxl, y1], [oxr, y1], [oxr, y2], [oxl, y2]]);
              } else if (oxl > x2) {
                centerList.push([[oxl, y1], [x3, y1], [x3, y2], [oxl, y2]]);
                centerList.push([[x3, y1], [oxr, y1], [oxr, yb], [x3, y2]]);
              } else if (oxr < x3) {
                centerList.push([[oxl, y1], [x2, y1], [x2, y2], [oxl, ya]]);
                centerList.push([[x2, y1], [oxr, y1], [oxr, y2], [x2, y2]]);
              } else {
                centerList.push([[oxl, y1], [x2, y1], [x2, y2], [oxl, ya]]);
                centerList.push([[x2, y1], [x3, y1], [x3, y2], [x2, y2]]);
                centerList.push([[x3, y1], [oxr, y1], [oxr, yb], [x3, y2]]);
              }
            }

            endList.push([[oxr, y1], points[1], points[2], [oxr, yb]]);
          } // 跨越右圆角
          else if (points[1][0] > oxr) {
              var y = oxr > x3 ? y1 + Math.tan(deg2) * (x4 - oxr) : y2;
              centerList.push([points[0], [oxr, y1], [oxr, y], points[3]]);
              endList.push([[oxr, y1], points[1], points[2], [oxr, y]]);
            } // 跨越左圆角
            else if (points[0][0] < oxl) {
                var _y = oxl < x2 ? y1 + Math.tan(deg1) * (oxl - x1) : y2;

                beginList.push([points[0], [oxl, y1], [oxl, _y], points[3]]);
                centerList.push([[oxl, y1], points[1], points[2], [oxl, _y]]);
              } else {
                centerList.push(points);
              }
    }

    var beginLength = beginList.length;

    if (beginLength) {
      // 边宽可能大于圆角尺寸，边的里面无需圆弧化
      var needInner = brx > x2 - x1 && borderWidth < bry; // 算这个角度是为了头部和上条边相交线的延长线

      var crossDeg = Math.atan((x2 - x1) / (y2 - y1));
      var rx1 = brx;
      var ry1 = bry;
      var sx1 = ry1 / rx1;
      var oyl = y1 + bry;
      var rx2 = brx - (x2 - x1);
      var ry2 = bry - (y2 - y1);
      var sx2 = ry2 / rx2; // 先计算第一个块，确定x/y边界，防止因为划分原因导致出现超过边界情况交叉

      var xa, _ya, xb, _yb;

      var ca = calBezierTopLeft(beginList[0][0], beginList[0][1], oxl, oyl, sx1, ry1, true, Math.tan(crossDeg) * ry1);

      var _ca$ = _slicedToArray(ca[0], 2);

      xa = _ca$[0];
      _ya = _ca$[1];
      var cb;

      if (needInner) {
        cb = calBezierTopLeft(beginList[0][3], beginList[0][2], oxl, oyl, sx2, ry2, true, Math.tan(crossDeg) * ry2);

        var _cb$ = _slicedToArray(cb[0], 2);

        xb = _cb$[0];
        _yb = _cb$[1];
      }

      beginList.forEach(function (points, i) {
        var controls1;
        var controls2;

        if (i === 0) {
          controls1 = ca;

          if (needInner) {
            controls2 = cb;
          }
        } else {
          controls1 = calBezierTopLeft(points[0], points[1], oxl, oyl, sx1, ry1);

          if (needInner) {
            controls2 = calBezierTopLeft(points[3], points[2], oxl, oyl, sx2, ry2);
          }
        }

        for (var _i = 0, _len = controls1.length; _i < _len; _i++) {
          limit(controls1[_i], xa, _ya, 0);
        }

        points[0] = controls1[0];
        points[1] = controls1[1].concat(controls1[2]).concat(controls1[3]);

        if (needInner) {
          for (var _i2 = 0, _len2 = controls2.length; _i2 < _len2; _i2++) {
            limit(controls2[_i2], xb, _yb, 0);
          }

          if (controls2.length === 1) {
            points[2] = controls2[0];
            points.pop();
          } else {
            points[2] = controls2[3];
            points[3] = controls2[2].concat(controls2[1]).concat(controls2[0]);
          }
        }
      });
    }

    var endLength = endList.length;

    if (endLength) {
      // 边宽可能大于圆角尺寸，边的里面无需圆弧化
      var _needInner = erx > x4 - x3 && borderWidth < ery; // 算这个角度是为了最后和下条边相交线的延长线


      var _crossDeg = Math.atan((x4 - x3) / (y2 - y1));

      var _rx = erx;
      var _ry = ery;

      var _sx = _ry / _rx;

      var oyr = y1 + ery;

      var _rx2 = erx - (x4 - x3);

      var _ry2 = ery - (y2 - y1);

      var _sx2 = _ry2 / _rx2; // 先计算最后一个块，确定x/y边界，防止因为划分原因导致出现超过边界情况交叉


      var _xa, _ya2, _xb, _yb2;

      var _ca = calBezierTopRight(endList[endLength - 1][0], endList[endLength - 1][1], oxr, oyr, _sx, _ry, true, Math.tan(_crossDeg) * _ry);

      var _ca2 = _slicedToArray(_ca[_ca.length - 1], 2);

      _xa = _ca2[0];
      _ya2 = _ca2[1];

      var _cb;

      if (_needInner) {
        _cb = calBezierTopRight(endList[endLength - 1][3], endList[endLength - 1][2], oxr, oyr, _sx2, _ry2, true, Math.tan(_crossDeg) * _ry2);

        var _cb2 = _slicedToArray(_cb[_cb.length - 1], 2);

        _xb = _cb2[0];
        _yb2 = _cb2[1];
      }

      endList.forEach(function (points, i) {
        var controls1;
        var controls2;

        if (i === endLength - 1) {
          controls1 = _ca;

          if (_needInner) {
            controls2 = _cb;
          }
        } else {
          controls1 = calBezierTopRight(points[0], points[1], oxr, oyr, _sx, _ry);

          if (_needInner) {
            controls2 = calBezierTopRight(points[3], points[2], oxr, oyr, _sx2, _ry2);
          }
        }

        for (var _i3 = 0, _len3 = controls1.length; _i3 < _len3; _i3++) {
          limit(controls1[_i3], _xa, _ya2, 1);
        }

        points[0] = controls1[0];
        points[1] = controls1[1].concat(controls1[2]).concat(controls1[3]);

        if (_needInner) {
          for (var _i4 = 0, _len4 = controls2.length; _i4 < _len4; _i4++) {
            limit(controls2[_i4], _xb, _yb2, 1);
          }

          if (controls2.length === 1) {
            points[2] = controls2[0];
            points.pop();
          } else {
            points[2] = controls2[3];
            points[3] = controls2[2].concat(controls2[1]).concat(controls2[0]);
          }
        }
      });
    }

    return beginList.concat(centerList).concat(endList);
  }

  function calBezierTopLeft(p1, p2, ox, oy, sx, r, isStart, crossDx) {
    // 先缩放x轴，椭圆变圆，2个点x坐标相应变化，y不变
    var _p = _slicedToArray(p1, 2),
        p1x = _p[0],
        p1y = _p[1];

    var _p2 = _slicedToArray(p2, 2),
        p2x = _p2[0],
        p2y = _p2[1];

    var dx1 = -p1x + ox;
    var dsx1 = dx1 * sx;
    var dx2 = -p2x + ox;
    var dsx2 = dx2 * sx; // 求2个点和1/4圆弧的交点坐标，和圆心连线，反三角函数求出夹角

    var deg2 = Math.atan(dsx2 / (oy - p2y)); // 根据角和半径再三角函数求交点坐标，可以直接缩放x轴恢复原本椭圆坐标，求贝塞尔控制点用不到交点

    var cpx2 = ox - Math.sin(deg2) * r / sx;
    var cpy2 = oy - Math.cos(deg2) * r;
    var deg1;
    var cpx1;
    var cpy1; // 最初的是两条border的交界线，需要特殊求交界线延长和椭圆的交点，不能直连圆心求交点

    if (isStart) {
      // 交界线和y轴夹角beta以及交点的x坐标都会受缩放影响，先化圆好求交点坐标
      var crossDsx = crossDx * sx;
      var beta = Math.atan(crossDsx / r); // 公式计算可得beta和交点连圆心的角alpha关系

      var tanBetaDiv2Sqrt = Math.sqrt(Math.tan(beta) / 2);
      var tanAlphaHalf = tanBetaDiv2Sqrt / (1 + tanBetaDiv2Sqrt);
      var alpha = Math.atan(tanAlphaHalf) * 2; // 获得alpha后直接根据半径求出交点坐标

      deg1 = Math.PI * 0.5 - alpha;
      cpx1 = ox - Math.cos(alpha) * r / sx;
      cpy1 = oy - Math.sin(alpha) * r;
    } else {
      deg1 = Math.atan(dsx1 / (oy - p1y));
      cpx1 = ox - Math.sin(deg1) * r / sx;
      cpy1 = oy - Math.cos(deg1) * r;
    } // 首尾只有3个点情况下重复了顶点形成4边形，同时圆角x/y相等有inner时
    // 使得交点相同角度相同无法计算，直接返回1个点即可


    if (deg1 === deg2) {
      return [[cpx1, cpy1]];
    } // 根据夹角求贝塞尔拟合圆弧长度


    var h = geom.h(Math.abs(deg1 - deg2));
    var d = h * r; // 过交点做切线，知道切线段长度d，求切线上从交点延长d的坐标，即为控制点
    // 圆心交点控制点连成直角三角形，获得斜边即圆心到控制点距离c
    // 求切线角，用上面夹角减去切线角可得控制点和圆心连线的角，从而获得坐标

    var c = Math.sqrt(Math.pow(r, 2) + Math.pow(d, 2));
    var degTg = Math.atan(d / r);
    var degTg1 = deg1 - degTg;
    var cdx1 = Math.sin(degTg1) * c;
    var cdy1 = Math.cos(degTg1) * c;
    var cx1 = ox - cdx1 / sx;
    var cy1 = oy - cdy1;
    var degTg2 = deg2 + degTg;
    var cdx2 = Math.sin(degTg2) * c;
    var cdy2 = Math.cos(degTg2) * c;
    var cx2 = ox - cdx2 / sx;
    var cy2 = oy - cdy2; // window.ctx.fillStyle = '#F90';
    // window.ctx.beginPath();
    // window.ctx.arc(p1x, p1y, 1,0, 2 * Math.PI);
    // window.ctx.fill();
    // window.ctx.fillStyle = '#0FF';
    // window.ctx.beginPath();
    // window.ctx.arc(cx1, cy1, 1,0, 2 * Math.PI);
    // window.ctx.fill();
    // window.ctx.fillStyle = '#00F';
    // window.ctx.beginPath();
    // window.ctx.arc(cx2, cy2, 1,0, 2 * Math.PI);
    // window.ctx.fill();
    // window.ctx.fillStyle = '#0F0';
    // window.ctx.beginPath();
    // window.ctx.arc(p2x, p2y, 1,0, 2 * Math.PI);
    // window.ctx.fill();
    // window.ctx.closePath();

    return [[cpx1, cpy1], [cx1, cy1], [cx2, cy2], [cpx2, cpy2]];
  }

  function calBezierTopRight(p1, p2, ox, oy, sx, r, isEnd, crossDx) {
    // 先缩放x轴，椭圆变圆，2个点x坐标相应变化，y不变
    var _p3 = _slicedToArray(p1, 2),
        p1x = _p3[0],
        p1y = _p3[1];

    var _p4 = _slicedToArray(p2, 2),
        p2x = _p4[0],
        p2y = _p4[1];

    var dx1 = p1x - ox;
    var dsx1 = dx1 * sx;
    var dx2 = p2x - ox;
    var dsx2 = dx2 * sx; // 求2个点和1/4圆弧的交点坐标，和圆心连线，反三角函数求出夹角

    var deg1 = Math.atan(dsx1 / (oy - p1y)); // 根据角和半径再三角函数求交点坐标，可以直接缩放x轴恢复原本椭圆坐标，求贝塞尔控制点用不到交点

    var cpx1 = ox + Math.sin(deg1) * r / sx;
    var cpy1 = oy - Math.cos(deg1) * r;
    var deg2;
    var cpx2;
    var cpy2; // 最后的是两条border的交界线，需要特殊求交界线延长和椭圆的交点，不能直连圆心求交点

    if (isEnd) {
      // 交界线和y轴夹角beta以及交点的x坐标都会受缩放影响，先化圆好求交点坐标
      var crossDsx = crossDx * sx;
      var beta = Math.atan(crossDsx / r); // 公式计算可得beta和交点连圆心的角alpha关系

      var tanBetaDiv2Sqrt = Math.sqrt(Math.tan(beta) / 2);
      var tanAlphaHalf = tanBetaDiv2Sqrt / (1 + tanBetaDiv2Sqrt);
      var alpha = Math.atan(tanAlphaHalf) * 2; // 获得alpha后直接根据半径求出交点坐标

      deg2 = Math.PI * 0.5 - alpha;
      cpx2 = ox + Math.cos(alpha) * r / sx;
      cpy2 = oy - Math.sin(alpha) * r;
    } else {
      deg2 = Math.atan(dsx2 / (oy - p2y));
      cpx2 = ox + Math.sin(deg2) * r / sx;
      cpy2 = oy - Math.cos(deg2) * r;
    } // 首尾只有3个点情况下重复了顶点形成4边形，同时圆角x/y相等有inner时
    // 使得交点相同角度相同无法计算，直接返回1个点即可


    if (deg1 === deg2) {
      return [[cpx1, cpy1]];
    } // 根据夹角求贝塞尔拟合圆弧长度


    var h = geom.h(Math.abs(deg1 - deg2));
    var d = h * r; // 过交点做切线，知道切线段长度d，求切线上从交点延长d的坐标，即为控制点
    // 圆心交点控制点连成直角三角形，获得斜边即圆心到控制点距离c
    // 求切线角，用上面夹角减去切线角可得控制点和圆心连线的角，从而获得坐标

    var c = Math.sqrt(Math.pow(r, 2) + Math.pow(d, 2));
    var degTg = Math.atan(d / r);
    var degTg1 = deg1 + degTg;
    var cdx1 = Math.sin(degTg1) * c;
    var cdy1 = Math.cos(degTg1) * c;
    var cx1 = ox + cdx1 / sx;
    var cy1 = oy - cdy1;
    var degTg2 = deg2 - degTg;
    var cdx2 = Math.sin(degTg2) * c;
    var cdy2 = Math.cos(degTg2) * c;
    var cx2 = ox + cdx2 / sx;
    var cy2 = oy - cdy2; // window.ctx.fillStyle = '#F90';
    // window.ctx.beginPath();
    // window.ctx.arc(cpx1, cpy1, 1,0, 2 * Math.PI);
    // window.ctx.fill();
    // window.ctx.fillStyle = '#0FF';
    // window.ctx.beginPath();
    // window.ctx.arc(cx1, cy1, 1,0, 2 * Math.PI);
    // window.ctx.fill();
    // window.ctx.fillStyle = '#00F';
    // window.ctx.beginPath();
    // window.ctx.arc(cx2, cy2, 1,0, 2 * Math.PI);
    // window.ctx.fill();
    // window.ctx.fillStyle = '#0F0';
    // window.ctx.beginPath();
    // window.ctx.arc(cpx2, cpy2, 1,0, 2 * Math.PI);
    // window.ctx.fill();
    // window.ctx.closePath();

    return [[cpx1, cpy1], [cx1, cy1], [cx2, cy2], [cpx2, cpy2]];
  }

  function calRightRadiusPoints(borderWidth, deg1, deg2, x1, x2, x3, x4, y1, y2, y3, y4, pointsList, beginRadius, endRadius) {
    var _beginRadius2 = _slicedToArray(beginRadius, 2),
        brx = _beginRadius2[0],
        bry = _beginRadius2[1];

    var _endRadius2 = _slicedToArray(endRadius, 2),
        erx = _endRadius2[0],
        ery = _endRadius2[1]; // 一条边的两侧圆角均为0时无效


    if ((!brx || !bry) && (!erx || !ery)) {
      return pointsList;
    } // 分界坐标圆心，上圆角、下圆角、中间矩形，3个区域2个坐标；当上下圆角相接时中间矩形为0即中间2个坐标相等


    var oyt = y2 + bry - (y2 - y1);
    var oyb = y3 - ery + (y4 - y3);
    var beginList = [];
    var centerList = [];
    var endList = []; // 同borderTop拆分

    for (var i = 0, len = pointsList.length; i < len; i++) {
      var points = pointsList[i]; // 全在上圆角

      if (points[2][1] < oyt) {
        beginList.push(points);
      } // 全在下圆角
      else if (points[1][1] > oyb) {
          endList.push(points);
        } // 跨越上下圆角
        else if (points[2][1] > oyb && points[1][1] < oyt) {
            var xa = oyt < y2 ? x3 + Math.tan(deg2) * (y2 - oyt) : x3;
            var xb = oyb > y3 ? x3 + Math.tan(deg1) * (oyb - y3) : x3;
            beginList.push([points[0], points[1], [x4, oyt], [xa, oyt]]);

            if (oyt < oyb) {
              if (oyb < y3 && oyt > y2) {
                centerList.push([[x3, oyt], [x4, oyt], [x4, oyb], [x3, oyb]]);
              } else if (oyt > y2) {
                centerList.push([[x3, y2], [x4, y2], [x4, y3], [x3, y3]]);
                centerList.push([[x3, y3], [x4, y3], [x4, oyb], [xb, oyb]]);
              } else if (oyb < y3) {
                centerList.push([[xa, oyt], [x4, oyt], [x4, y2], [x3, y2]]);
                centerList.push([[x3, y2], [x4, y2], [x4, oyb], [x3, oyb]]);
              } else {
                centerList.push([[xa, oyt], [x4, oyt], [x4, y2], [x3, y2]]);
                centerList.push([[x3, y2], [x4, y2], [x4, y3], [x3, y3]]);
                centerList.push([[x3, y3], [x4, y3], [x4, oyb], [xb, oyb]]);
              }
            }

            endList.push([[xb, oyb], [x4, oyb], points[2], points[3]]);
          } // 跨越下圆角
          else if (points[2][1] > oyb) {
              var x = oyb > y3 ? x3 + Math.tan(deg1) * (oyb - y3) : x3;
              centerList.push([points[0], points[1], [x4, oyb], [x, oyb]]);
              endList.push([[x, oyb], [x4, oyb], points[2], points[3]]);
            } // 跨越上圆角
            else if (points[1][1] < oyt) {
                var _x = oyt < y2 ? x3 + Math.tan(deg2) * (y2 - oyt) : x3;

                beginList.push([points[0], points[1], [x4, oyt], [_x, oyt]]);
                centerList.push([[_x, oyt], [x4, oyt], points[2], points[3]]);
              } else {
                centerList.push(points);
              }
    }

    var beginLength = beginList.length;

    if (beginLength) {
      var needInner = bry > y2 - y1 && borderWidth < brx;
      var crossDeg = Math.atan((x4 - x3) / (y2 - y1));
      var rx1 = brx;
      var ry1 = bry;
      var sx1 = ry1 / rx1;
      var oxt = x4 - brx;
      var rx2 = brx - (x4 - x3);
      var ry2 = bry - (y2 - y1);
      var sx2 = ry2 / rx2; // 先计算第一个块，确定x/y边界，防止因为划分原因导致出现超过边界情况交叉

      var _xa2, ya, _xb2, yb;

      var ca = calBezierRightTop(beginList[0][1], beginList[0][2], oxt, oyt, sx1, ry1, true, Math.tan(crossDeg) * ry1);

      var _ca3 = _slicedToArray(ca[ca.length - 1], 2);

      _xa2 = _ca3[0];
      ya = _ca3[1];
      var cb;

      if (needInner) {
        cb = calBezierRightTop(beginList[0][0], beginList[0][3], oxt, oyt, sx2, ry2, true, Math.tan(crossDeg) * ry2);

        var _cb3 = _slicedToArray(cb[cb.length - 1], 2);

        _xb2 = _cb3[0];
        yb = _cb3[1];
      }

      beginList.forEach(function (points, i) {
        var controls1;
        var controls2;

        if (i === 0) {
          controls1 = ca;

          if (needInner) {
            controls2 = cb;
          }
        } else {
          controls1 = calBezierRightTop(points[1], points[2], oxt, oyt, sx1, ry1);

          if (needInner) {
            controls2 = calBezierRightTop(points[0], points[3], oxt, oyt, sx2, ry2);
          }
        }

        for (var _i5 = 0, _len5 = controls1.length; _i5 < _len5; _i5++) {
          limit(controls1[_i5], _xa2, ya, 2);
        }

        if (needInner) {
          for (var _i6 = 0, _len6 = controls2.length; _i6 < _len6; _i6++) {
            limit(controls2[_i6], _xb2, yb, 2);
          }

          if (controls2.length === 1) {
            points[2] = controls2[0];
            points.pop();
          } else {
            points[2] = controls2[0];
            points[3] = controls2[1].concat(controls2[2]).concat(controls2[3]);
          }
        } else {
          points[2] = points[3];
          points[3] = points[0];
        }

        points[0] = controls1[3];
        points[1] = controls1[2].concat(controls1[1]).concat(controls1[0]);
      });
    }

    var endLength = endList.length;

    if (endLength) {
      var _needInner2 = ery > y4 - y3 && borderWidth < erx;

      var _crossDeg2 = Math.atan((x4 - x3) / (y4 - y3));

      var _rx3 = erx;
      var _ry3 = ery;

      var _sx3 = _ry3 / _rx3;

      var oxb = x4 - erx;

      var _rx4 = erx - (x4 - x3);

      var _ry4 = ery - (y4 - y3);

      var _sx4 = _ry4 / _rx4; // 先计算最后一个块，确定x/y边界，防止因为划分原因导致出现超过边界情况交叉


      var _xa3, _ya3, _xb3, _yb3;

      var _ca4 = calBezierRightBottom(endList[endLength - 1][1], endList[endLength - 1][2], oxb, oyb, _sx3, _ry3, true, Math.tan(_crossDeg2) * _ry3);

      var _ca4$ = _slicedToArray(_ca4[0], 2);

      _xa3 = _ca4$[0];
      _ya3 = _ca4$[1];

      var _cb4;

      if (_needInner2) {
        _cb4 = calBezierRightBottom(endList[endLength - 1][0], endList[endLength - 1][3], oxb, oyb, _sx4, _ry4, true, Math.tan(_crossDeg2) * _ry4);

        var _cb4$ = _slicedToArray(_cb4[0], 2);

        _xb3 = _cb4$[0];
        _yb3 = _cb4$[1];
      }

      endList.forEach(function (points, i) {
        var controls1;
        var controls2;

        if (i === endLength - 1) {
          controls1 = _ca4;

          if (_needInner2) {
            controls2 = _cb4;
          }
        } else {
          controls1 = calBezierRightBottom(points[1], points[2], oxb, oyb, _sx3, _ry3);

          if (_needInner2) {
            controls2 = calBezierRightBottom(points[0], points[3], oxb, oyb, _sx4, _ry4);
          }
        }

        for (var _i7 = 0, _len7 = controls1.length; _i7 < _len7; _i7++) {
          limit(controls1[_i7], _xa3, _ya3, 3);
        }

        if (_needInner2) {
          for (var _i8 = 0, _len8 = controls2.length; _i8 < _len8; _i8++) {
            limit(controls2[_i8], _xb3, _yb3, 3);
          }

          if (controls2.length === 1) {
            points[2] = controls2[0];
            points.pop();
          } else {
            points[2] = controls2[0];
            points[3] = controls2[1].concat(controls2[2]).concat(controls2[3]);
          }
        } else {
          points[2] = points[3];
          points[3] = points[0];
        }

        points[0] = controls1[3];
        points[1] = controls1[2].concat(controls1[1]).concat(controls1[0]);
      });
    }

    return beginList.concat(centerList).concat(endList);
  }

  function calBezierRightTop(p1, p2, ox, oy, sx, r, isStart, crossDx) {
    // 先缩放x轴，椭圆变圆，2个点x坐标相应变化，y不变
    var _p5 = _slicedToArray(p1, 2),
        p1x = _p5[0],
        p1y = _p5[1];

    var _p6 = _slicedToArray(p2, 2),
        p2x = _p6[0],
        p2y = _p6[1];

    var dx1 = p1x - ox;
    var dsx1 = dx1 * sx;
    var dx2 = p2x - ox;
    var dsx2 = dx2 * sx; // 求2个点和1/4圆弧的交点坐标，和圆心连线，反三角函数求出夹角

    var deg2 = Math.atan(dsx2 / (oy - p2y)); // 根据角和半径再三角函数求交点坐标，可以直接缩放x轴恢复原本椭圆坐标，求贝塞尔控制点用不到交点

    var cpx2 = ox + Math.sin(deg2) * r / sx;
    var cpy2 = oy - Math.cos(deg2) * r;
    var deg1;
    var cpx1;
    var cpy1;

    if (isStart) {
      // 交界线和y轴夹角beta以及交点的x坐标都会受缩放影响，先化圆好求交点坐标
      var crossDsx = crossDx * sx;
      var beta = Math.atan(crossDsx / r); // 公式计算可得beta和交点连圆心的角alpha关系

      var tanBetaDiv2Sqrt = Math.sqrt(Math.tan(beta) / 2);
      var tanAlphaHalf = tanBetaDiv2Sqrt / (1 + tanBetaDiv2Sqrt);
      var alpha = Math.atan(tanAlphaHalf) * 2; // 获得alpha后直接根据半径求出交点坐标

      deg1 = Math.PI * 0.5 - alpha;
      cpx1 = ox + Math.cos(alpha) * r / sx;
      cpy1 = oy - Math.sin(alpha) * r;
    } else {
      deg1 = Math.atan(dsx1 / (oy - p1y));
      cpx1 = ox + Math.sin(deg1) * r / sx;
      cpy1 = oy - Math.cos(deg1) * r;
    } // 首尾只有3个点情况下重复了顶点形成4边形，同时圆角x/y相等有inner时
    // 使得交点相同角度相同无法计算，直接返回1个点即可


    if (deg1 === deg2) {
      return [[cpx1, cpy1]];
    } // 根据夹角求贝塞尔拟合圆弧长度


    var h = geom.h(Math.abs(deg1 - deg2));
    var d = h * r; // 过交点做切线，知道切线段长度d，求切线上从交点延长d的坐标，即为控制点
    // 圆心交点控制点连成直角三角形，获得斜边即圆心到控制点距离c
    // 求切线角，用上面夹角减去切线角可得控制点和圆心连线的角，从而获得坐标

    var c = Math.sqrt(Math.pow(r, 2) + Math.pow(d, 2));
    var degTg = Math.atan(d / r);
    var degTg1 = deg1 + degTg;
    var cdx1 = Math.sin(degTg1) * c;
    var cdy1 = Math.cos(degTg1) * c;
    var cx1 = ox + cdx1 / sx;
    var cy1 = oy - cdy1;
    var degTg2 = deg2 - degTg;
    var cdx2 = Math.sin(degTg2) * c;
    var cdy2 = Math.cos(degTg2) * c;
    var cx2 = ox + cdx2 / sx;
    var cy2 = oy - cdy2; // window.ctx.fillStyle = '#000';
    // window.ctx.beginPath();
    // window.ctx.arc(cpx1, cpy1, 1,0, 2 * Math.PI);
    // window.ctx.fill();
    // window.ctx.fillStyle = '#0FF';
    // window.ctx.beginPath();
    // window.ctx.arc(cx1, cy1, 1,0, 2 * Math.PI);
    // window.ctx.fill();
    // window.ctx.fillStyle = '#00F';
    // window.ctx.beginPath();
    // window.ctx.arc(cx2, cy2, 1,0, 2 * Math.PI);
    // window.ctx.fill();
    // window.ctx.fillStyle = '#0F0';
    // window.ctx.beginPath();
    // window.ctx.arc(cpx2, cpy2, 1,0, 2 * Math.PI);
    // window.ctx.fill();
    // window.ctx.closePath();

    return [[cpx2, cpy2], [cx2, cy2], [cx1, cy1], [cpx1, cpy1]];
  }

  function calBezierRightBottom(p1, p2, ox, oy, sx, r, isEnd, crossDx) {
    // 先缩放x轴，椭圆变圆，2个点x坐标相应变化，y不变
    var _p7 = _slicedToArray(p1, 2),
        p1x = _p7[0],
        p1y = _p7[1];

    var _p8 = _slicedToArray(p2, 2),
        p2x = _p8[0],
        p2y = _p8[1];

    var dx1 = p1x - ox;
    var dsx1 = dx1 * sx;
    var dx2 = p2x - ox;
    var dsx2 = dx2 * sx; // 求2个点和1/4圆弧的交点坐标，和圆心连线，反三角函数求出夹角

    var deg1 = Math.atan(dsx1 / (p1y - oy)); // 根据角和半径再三角函数求交点坐标，可以直接缩放x轴恢复原本椭圆坐标，求贝塞尔控制点用不到交点

    var cpx1 = ox + Math.sin(deg1) * r / sx;
    var cpy1 = oy + Math.cos(deg1) * r;
    var deg2;
    var cpx2;
    var cpy2;

    if (isEnd) {
      // 交界线和y轴夹角beta以及交点的x坐标都会受缩放影响，先化圆好求交点坐标
      var crossDsx = crossDx * sx;
      var beta = Math.atan(crossDsx / r); // 公式计算可得beta和交点连圆心的角alpha关系

      var tanBetaDiv2Sqrt = Math.sqrt(Math.tan(beta) / 2);
      var tanAlphaHalf = tanBetaDiv2Sqrt / (1 + tanBetaDiv2Sqrt);
      var alpha = Math.atan(tanAlphaHalf) * 2; // 获得alpha后直接根据半径求出交点坐标

      deg2 = Math.PI * 0.5 - alpha;
      cpx2 = ox + Math.cos(alpha) * r / sx;
      cpy2 = oy + Math.sin(alpha) * r;
    } else {
      deg2 = Math.atan(dsx2 / (p2y - oy));
      cpx2 = ox + Math.sin(deg2) * r / sx;
      cpy2 = oy + Math.cos(deg2) * r;
    } // 首尾只有3个点情况下重复了顶点形成4边形，同时圆角x/y相等有inner时
    // 使得交点相同角度相同无法计算，直接返回1个点即可


    if (deg1 === deg2) {
      return [[cpx1, cpy1]];
    } // 根据夹角求贝塞尔拟合圆弧长度


    var h = geom.h(Math.abs(deg1 - deg2));
    var d = h * r; // 过交点做切线，知道切线段长度d，求切线上从交点延长d的坐标，即为控制点
    // 圆心交点控制点连成直角三角形，获得斜边即圆心到控制点距离c
    // 求切线角，用上面夹角减去切线角可得控制点和圆心连线的角，从而获得坐标

    var c = Math.sqrt(Math.pow(r, 2) + Math.pow(d, 2));
    var degTg = Math.atan(d / r);
    var degTg1 = deg1 - degTg;
    var cdx1 = Math.sin(degTg1) * c;
    var cdy1 = Math.cos(degTg1) * c;
    var cx1 = ox + cdx1 / sx;
    var cy1 = oy + cdy1;
    var degTg2 = deg2 + degTg;
    var cdx2 = Math.sin(degTg2) * c;
    var cdy2 = Math.cos(degTg2) * c;
    var cx2 = ox + cdx2 / sx;
    var cy2 = oy + cdy2; // window.ctx.fillStyle = '#F90';
    // window.ctx.beginPath();
    // window.ctx.arc(cpx1, cpy1, 1,0, 2 * Math.PI);
    // window.ctx.fill();
    // window.ctx.fillStyle = '#0FF';
    // window.ctx.beginPath();
    // window.ctx.arc(cx1, cy1, 1,0, 2 * Math.PI);
    // window.ctx.fill();
    // window.ctx.fillStyle = '#00F';
    // window.ctx.beginPath();
    // window.ctx.arc(cx2, cy2, 1,0, 2 * Math.PI);
    // window.ctx.fill();
    // window.ctx.fillStyle = '#0F0';
    // window.ctx.beginPath();
    // window.ctx.arc(cpx2, cpy2, 1,0, 2 * Math.PI);
    // window.ctx.fill();
    // window.ctx.closePath();

    return [[cpx2, cpy2], [cx2, cy2], [cx1, cy1], [cpx1, cpy1]];
  }

  function calBottomRadiusPoints(borderWidth, deg1, deg2, x1, x2, x3, x4, y1, y2, y3, y4, pointsList, beginRadius, endRadius) {
    var _beginRadius3 = _slicedToArray(beginRadius, 2),
        brx = _beginRadius3[0],
        bry = _beginRadius3[1];

    var _endRadius3 = _slicedToArray(endRadius, 2),
        erx = _endRadius3[0],
        ery = _endRadius3[1]; // 一条边的两侧圆角均为0时无效


    if ((!brx || !bry) && (!erx || !ery)) {
      return pointsList;
    } // 分界坐标圆心，左圆角、右圆角、中间矩形，3个区域2个坐标；当左右圆角相接时中间矩形为0即中间2个坐标相等


    var oxl = x2 + brx - (x2 - x1);
    var oxr = x3 - erx + (x4 - x3); // 先拆分，当一块四边形跨越左右圆角和中间非圆角时被拆为3份，只跨一边圆角拆2份，不跨不处理
    // 也有可能左右圆角相接，跨越的只分为左右2份
    // 最终左圆角内的存入begin，右圆角内的存入end，中间center

    var beginList = [];
    var centerList = [];
    var endList = [];

    for (var i = 0, len = pointsList.length; i < len; i++) {
      var points = pointsList[i]; // 全在左圆角

      if (points[2][0] < oxl) {
        beginList.push(points);
      } // 全在右圆角
      else if (points[3][0] > oxr) {
          endList.push(points);
        } // 跨越左右圆角
        else if (points[2][0] > oxr && points[3][0] < oxl) {
            var ya = oxl < x2 ? y4 - Math.tan(deg1) * (oxl - x1) : y2;
            var yb = oxr > x3 ? y4 - Math.tan(deg2) * (x4 - oxr) : y3;
            beginList.push([points[0], [oxl, ya], [oxl, y4], points[3]]);

            if (oxl < oxr) {
              if (oxl > x2 && oxr < x3) {
                centerList.push([[oxl, y3], [oxr, y3], [oxr, y4], [oxl, y4]]);
              } else if (oxl > x2) {
                centerList.push([[oxl, y3], [x3, y3], [x3, y4], [oxl, y4]]);
                centerList.push([[x3, y3], [oxr, yb], [oxr, y4], [x3, y4]]);
              } else if (oxr < x3) {
                centerList.push([[oxl, ya], [x2, y3], [x2, y4], [oxl, y4]]);
                centerList.push([[x2, y3], [oxr, y3], [oxr, y4], [x2, y4]]);
              } else {
                centerList.push([[oxl, ya], [x2, y3], [x2, y4], [oxl, y4]]);
                centerList.push([[x2, y3], [x3, y3], [x3, y4], [x2, y4]]);
                centerList.push([[x3, y3], [oxr, yb], [oxr, y4], [x3, y4]]);
              }
            }

            endList.push([[oxr, yb], points[1], points[2], [oxr, y4]]);
          } // 跨越右圆角
          else if (points[2][0] > oxr) {
              var y = oxr > x3 ? y4 - Math.tan(deg2) * (x4 - oxr) : y3;
              centerList.push([points[0], [oxr, y], [oxr, y4], points[3]]);
              endList.push([[oxr, y], points[1], points[2], [oxr, y4]]);
            } // 跨越左圆角
            else if (points[3][0] < oxl) {
                var _y2 = oxl < x2 ? y4 - Math.tan(deg1) * (oxl - x1) : y3;

                beginList.push([points[0], [oxl, _y2], [oxl, y4], points[3]]);
                centerList.push([[oxl, _y2], points[1], points[2], [oxl, y4]]);
              } else {
                centerList.push(points);
              }
    }

    var beginLength = beginList.length;

    if (beginLength) {
      // 边宽可能大于圆角尺寸，边的里面无需圆弧化
      var needInner = brx > x2 - x1 && borderWidth < bry; // 算这个角度是为了头部和上条边相交线的延长线

      var crossDeg = Math.atan((x2 - x1) / (y4 - y3));
      var rx1 = brx;
      var ry1 = bry;
      var sx1 = ry1 / rx1;
      var oyl = y4 - bry;
      var rx2 = brx - (x2 - x1);
      var ry2 = bry - (y4 - y3);
      var sx2 = ry2 / rx2; // 先计算第一个块，确定x/y边界，防止因为划分原因导致出现超过边界情况交叉

      var xa, _ya4, xb, _yb4;

      var ca = calBezierBottomLeft(beginList[0][3], beginList[0][2], oxl, oyl, sx1, ry1, true, Math.tan(crossDeg) * ry1);

      var _ca$2 = _slicedToArray(ca[0], 2);

      xa = _ca$2[0];
      _ya4 = _ca$2[1];
      var cb;

      if (needInner) {
        cb = calBezierBottomLeft(beginList[0][0], beginList[0][1], oxl, oyl, sx2, ry2, true, Math.tan(crossDeg) * ry2);

        var _cb$2 = _slicedToArray(cb[0], 2);

        xb = _cb$2[0];
        _yb4 = _cb$2[1];
      }

      beginList.forEach(function (points, i) {
        var controls1;
        var controls2;

        if (i === 0) {
          controls1 = ca;

          if (needInner) {
            controls2 = cb;
          }
        } else {
          controls1 = calBezierBottomLeft(points[3], points[2], oxl, oyl, sx1, ry1);

          if (needInner) {
            controls2 = calBezierBottomLeft(points[0], points[1], oxl, oyl, sx2, ry2);
          }
        }

        for (var _i9 = 0, _len9 = controls1.length; _i9 < _len9; _i9++) {
          limit(controls1[_i9], xa, _ya4, 4);
        }

        if (needInner) {
          for (var _i10 = 0, _len10 = controls2.length; _i10 < _len10; _i10++) {
            limit(controls2[_i10], xb, _yb4, 4);
          }

          if (controls2.length === 1) {
            points[2] = controls2[0];
            points.pop();
          } else {
            points[2] = controls2[3];
            points[3] = controls2[2].concat(controls2[1]).concat(controls2[0]);
          }
        } else {
          points[2] = points[1];
          points[3] = points[0];
        }

        points[0] = controls1[0];
        points[1] = controls1[1].concat(controls1[2]).concat(controls1[3]);
      });
    }

    var endLength = endList.length;

    if (endLength) {
      // 边宽可能大于圆角尺寸，边的里面无需圆弧化
      var _needInner3 = erx > x4 - x3 && borderWidth < ery; // 算这个角度是为了最后和下条边相交线的延长线


      var _crossDeg3 = Math.atan((x4 - x3) / (y4 - y3));

      var _rx5 = erx;
      var _ry5 = ery;

      var _sx5 = _ry5 / _rx5;

      var oyr = y4 - ery;

      var _rx6 = erx - (x4 - x3);

      var _ry6 = ery - (y4 - y3);

      var _sx6 = _ry6 / _rx6; // 先计算最后一个块，确定x/y边界，防止因为划分原因导致出现超过边界情况交叉


      var _xa4, _ya5, _xb4, _yb5;

      var _ca5 = calBezierBottomRight(endList[endLength - 1][3], endList[endLength - 1][2], oxr, oyr, _sx5, _ry5, true, Math.tan(_crossDeg3) * _ry5);

      var _ca6 = _slicedToArray(_ca5[_ca5.length - 1], 2);

      _xa4 = _ca6[0];
      _ya5 = _ca6[1];

      var _cb5;

      if (_needInner3) {
        _cb5 = calBezierBottomRight(endList[endLength - 1][0], endList[endLength - 1][1], oxr, oyr, _sx6, _ry6, true, Math.tan(_crossDeg3) * _ry6);

        var _cb6 = _slicedToArray(_cb5[_cb5.length - 1], 2);

        _xb4 = _cb6[0];
        _yb5 = _cb6[1];
      }

      endList.forEach(function (points, i) {
        var controls1;
        var controls2;

        if (i === endLength - 1) {
          controls1 = _ca5;

          if (_needInner3) {
            controls2 = _cb5;
          }
        } else {
          controls1 = calBezierBottomRight(points[3], points[2], oxr, oyr, _sx5, _ry5);

          if (_needInner3) {
            controls2 = calBezierBottomRight(points[0], points[1], oxr, oyr, _sx6, _ry6);
          }
        }

        for (var _i11 = 0, _len11 = controls1.length; _i11 < _len11; _i11++) {
          limit(controls1[_i11], _xa4, _ya5, 5);
        }

        if (_needInner3) {
          for (var _i12 = 0, _len12 = controls2.length; _i12 < _len12; _i12++) {
            limit(controls2[_i12], _xb4, _yb5, 5);
          }

          if (controls2.length === 1) {
            points[2] = controls2[0];
            points.pop();
          } else {
            points[2] = controls2[3];
            points[3] = controls2[2].concat(controls2[1]).concat(controls2[0]);
          }
        } else {
          points[2] = points[1];
          points[3] = points[0];
        }

        points[0] = controls1[0];
        points[1] = controls1[1].concat(controls1[2]).concat(controls1[3]);
      });
    }

    return beginList.concat(centerList).concat(endList);
  }

  function calBezierBottomLeft(p1, p2, ox, oy, sx, r, isStart, crossDx) {
    // 先缩放x轴，椭圆变圆，2个点x坐标相应变化，y不变
    var _p9 = _slicedToArray(p1, 2),
        p1x = _p9[0],
        p1y = _p9[1];

    var _p10 = _slicedToArray(p2, 2),
        p2x = _p10[0],
        p2y = _p10[1];

    var dx1 = -p1x + ox;
    var dsx1 = dx1 * sx;
    var dx2 = -p2x + ox;
    var dsx2 = dx2 * sx; // 求2个点和1/4圆弧的交点坐标，和圆心连线，反三角函数求出夹角

    var deg2 = Math.atan(dsx2 / (p2y - oy)); // 根据角和半径再三角函数求交点坐标，可以直接缩放x轴恢复原本椭圆坐标，求贝塞尔控制点用不到交点

    var cpx2 = ox - Math.sin(deg2) * r / sx;
    var cpy2 = oy + Math.cos(deg2) * r;
    var deg1;
    var cpx1;
    var cpy1; // 最初的是两条border的交界线，需要特殊求交界线延长和椭圆的交点，不能直连圆心求交点

    if (isStart) {
      // 交界线和y轴夹角beta以及交点的x坐标都会受缩放影响，先化圆好求交点坐标
      var crossDsx = crossDx * sx;
      var beta = Math.atan(crossDsx / r); // 公式计算可得beta和交点连圆心的角alpha关系

      var tanBetaDiv2Sqrt = Math.sqrt(Math.tan(beta) / 2);
      var tanAlphaHalf = tanBetaDiv2Sqrt / (1 + tanBetaDiv2Sqrt);
      var alpha = Math.atan(tanAlphaHalf) * 2; // 获得alpha后直接根据半径求出交点坐标

      deg1 = Math.PI * 0.5 - alpha;
      cpx1 = ox - Math.cos(alpha) * r / sx;
      cpy1 = oy + Math.sin(alpha) * r;
    } else {
      deg1 = Math.atan(dsx1 / (p1y - oy));
      cpx1 = ox - Math.sin(deg1) * r / sx;
      cpy1 = oy + Math.cos(deg1) * r;
    } // 首尾只有3个点情况下重复了顶点形成4边形，同时圆角x/y相等有inner时
    // 使得交点相同角度相同无法计算，直接返回1个点即可


    if (deg1 === deg2) {
      return [[cpx1, cpy1]];
    } // 根据夹角求贝塞尔拟合圆弧长度


    var h = geom.h(Math.abs(deg1 - deg2));
    var d = h * r; // 过交点做切线，知道切线段长度d，求切线上从交点延长d的坐标，即为控制点
    // 圆心交点控制点连成直角三角形，获得斜边即圆心到控制点距离c
    // 求切线角，用上面夹角减去切线角可得控制点和圆心连线的角，从而获得坐标

    var c = Math.sqrt(Math.pow(r, 2) + Math.pow(d, 2));
    var degTg = Math.atan(d / r);
    var degTg1 = deg1 - degTg;
    var cdx1 = Math.sin(degTg1) * c;
    var cdy1 = Math.cos(degTg1) * c;
    var cx1 = ox - cdx1 / sx;
    var cy1 = oy + cdy1;
    var degTg2 = deg2 + degTg;
    var cdx2 = Math.sin(degTg2) * c;
    var cdy2 = Math.cos(degTg2) * c;
    var cx2 = ox - cdx2 / sx;
    var cy2 = oy + cdy2; // window.ctx.fillStyle = '#F90';
    // window.ctx.beginPath();
    // window.ctx.arc(cpx1, cpy1, 1,0, 2 * Math.PI);
    // window.ctx.fill();
    // window.ctx.fillStyle = '#0FF';
    // window.ctx.beginPath();
    // window.ctx.arc(cx1, cy1, 1,0, 2 * Math.PI);
    // window.ctx.fill();
    // window.ctx.fillStyle = '#00F';
    // window.ctx.beginPath();
    // window.ctx.arc(cx2, cy2, 1,0, 2 * Math.PI);
    // window.ctx.fill();
    // window.ctx.fillStyle = '#0F0';
    // window.ctx.beginPath();
    // window.ctx.arc(cpx2, cpy2, 1,0, 2 * Math.PI);
    // window.ctx.fill();
    // window.ctx.closePath();

    return [[cpx1, cpy1], [cx1, cy1], [cx2, cy2], [cpx2, cpy2]];
  }

  function calBezierBottomRight(p1, p2, ox, oy, sx, r, isEnd, crossDx) {
    // 先缩放x轴，椭圆变圆，2个点x坐标相应变化，y不变
    var _p11 = _slicedToArray(p1, 2),
        p1x = _p11[0],
        p1y = _p11[1];

    var _p12 = _slicedToArray(p2, 2),
        p2x = _p12[0],
        p2y = _p12[1];

    var dx1 = p1x - ox;
    var dsx1 = dx1 * sx;
    var dx2 = p2x - ox;
    var dsx2 = dx2 * sx; // 求2个点和1/4圆弧的交点坐标，和圆心连线，反三角函数求出夹角

    var deg1 = Math.atan(dsx1 / (p1y - oy)); // 根据角和半径再三角函数求交点坐标，可以直接缩放x轴恢复原本椭圆坐标，求贝塞尔控制点用不到交点

    var cpx1 = ox + Math.sin(deg1) * r / sx;
    var cpy1 = oy + Math.cos(deg1) * r;
    var deg2;
    var cpx2;
    var cpy2; // 最后的是两条border的交界线，需要特殊求交界线延长和椭圆的交点，不能直连圆心求交点

    if (isEnd) {
      // 交界线和y轴夹角beta以及交点的x坐标都会受缩放影响，先化圆好求交点坐标
      var crossDsx = crossDx * sx;
      var beta = Math.atan(crossDsx / r); // 公式计算可得beta和交点连圆心的角alpha关系

      var tanBetaDiv2Sqrt = Math.sqrt(Math.tan(beta) / 2);
      var tanAlphaHalf = tanBetaDiv2Sqrt / (1 + tanBetaDiv2Sqrt);
      var alpha = Math.atan(tanAlphaHalf) * 2; // 获得alpha后直接根据半径求出交点坐标

      deg2 = Math.PI * 0.5 - alpha;
      cpx2 = ox + Math.cos(alpha) * r / sx;
      cpy2 = oy + Math.sin(alpha) * r;
    } else {
      deg2 = Math.atan(dsx2 / (p2y - oy));
      cpx2 = ox + Math.sin(deg2) * r / sx;
      cpy2 = oy + Math.cos(deg2) * r;
    } // 首尾只有3个点情况下重复了顶点形成4边形，同时圆角x/y相等有inner时
    // 使得交点相同角度相同无法计算，直接返回1个点即可


    if (deg1 === deg2) {
      return [[cpx1, cpy1]];
    } // 根据夹角求贝塞尔拟合圆弧长度


    var h = geom.h(Math.abs(deg1 - deg2));
    var d = h * r; // 过交点做切线，知道切线段长度d，求切线上从交点延长d的坐标，即为控制点
    // 圆心交点控制点连成直角三角形，获得斜边即圆心到控制点距离c
    // 求切线角，用上面夹角减去切线角可得控制点和圆心连线的角，从而获得坐标

    var c = Math.sqrt(Math.pow(r, 2) + Math.pow(d, 2));
    var degTg = Math.atan(d / r);
    var degTg1 = deg1 + degTg;
    var cdx1 = Math.sin(degTg1) * c;
    var cdy1 = Math.cos(degTg1) * c;
    var cx1 = ox + cdx1 / sx;
    var cy1 = oy + cdy1;
    var degTg2 = deg2 - degTg;
    var cdx2 = Math.sin(degTg2) * c;
    var cdy2 = Math.cos(degTg2) * c;
    var cx2 = ox + cdx2 / sx;
    var cy2 = oy + cdy2; // window.ctx.fillStyle = '#F90';
    // window.ctx.beginPath();
    // window.ctx.arc(cpx1, cpy1, 1,0, 2 * Math.PI);
    // window.ctx.fill();
    // window.ctx.fillStyle = '#0FF';
    // window.ctx.beginPath();
    // window.ctx.arc(cx1, cy1, 1,0, 2 * Math.PI);
    // window.ctx.fill();
    // window.ctx.fillStyle = '#00F';
    // window.ctx.beginPath();
    // window.ctx.arc(cx2, cy2, 1,0, 2 * Math.PI);
    // window.ctx.fill();
    // window.ctx.fillStyle = '#0F0';
    // window.ctx.beginPath();
    // window.ctx.arc(cpx2, cpy2, 1,0, 2 * Math.PI);
    // window.ctx.fill();
    // window.ctx.closePath();

    return [[cpx1, cpy1], [cx1, cy1], [cx2, cy2], [cpx2, cpy2]];
  }

  function calLeftRadiusPoints(borderWidth, deg1, deg2, x1, x2, x3, x4, y1, y2, y3, y4, pointsList, beginRadius, endRadius) {
    var _beginRadius4 = _slicedToArray(beginRadius, 2),
        brx = _beginRadius4[0],
        bry = _beginRadius4[1];

    var _endRadius4 = _slicedToArray(endRadius, 2),
        erx = _endRadius4[0],
        ery = _endRadius4[1]; // 一条边的两侧圆角均为0时无效


    if ((!brx || !bry) && (!erx || !ery)) {
      return pointsList;
    } // 分界坐标圆心，上圆角、下圆角、中间矩形，3个区域2个坐标；当上下圆角相接时中间矩形为0即中间2个坐标相等


    var oyt = y2 + bry - (y2 - y1);
    var oyb = y3 - ery + (y4 - y3);
    var beginList = [];
    var centerList = [];
    var endList = []; // 同borderTop拆分

    for (var i = 0, len = pointsList.length; i < len; i++) {
      var points = pointsList[i]; // 全在上圆角

      if (points[3][1] < oyt) {
        beginList.push(points);
      } // 全在下圆角
      else if (points[0][1] > oyb) {
          endList.push(points);
        } // 跨越上下圆角
        else if (points[3][1] > oyb && points[0][1] < oyt) {
            var xa = oyt < y2 ? x2 - Math.tan(deg2) * (y2 - oyt) : x2;
            var xb = oyb > y3 ? x2 - Math.tan(deg1) * (oyb - y3) : x2;
            beginList.push([points[0], points[1], [xa, oyt], [x1, oyt]]);

            if (oyt < oyb) {
              if (oyb < y3 && oyt > y2) {
                centerList.push([[x1, oyt], [x2, oyt], [x2, oyb], [x1, oyb]]);
              } else if (oyt > y2) {
                centerList.push([[x1, oyt], [x2, oyt], [x2, y3], [x1, y3]]);
                centerList.push([[x1, y3], [x2, y3], [xb, oyb], [x1, oyb]]);
              } else if (oyb < y3) {
                centerList.push([[x1, oyt], [xa, oyt], [x2, y2], [x1, y2]]);
                centerList.push([[x1, y2], [x2, y2], [x2, oyb], [x1, oyb]]);
              } else {
                centerList.push([[x1, oyt], [xa, oyt], [x2, y2], [x1, y2]]);
                centerList.push([[x1, y2], [x2, y2], [x2, y3], [x1, y3]]);
                centerList.push([[x1, y3], [x2, y3], [xb, oyb], [x1, oyb]]);
              }
            }

            endList.push([[x1, oyb], [xb, oyb], points[2], points[3]]);
          } // 跨越下圆角
          else if (points[3][1] > oyb) {
              var x = oyb > y3 ? x2 - Math.tan(deg1) * (oyb - y3) : x2;
              centerList.push([points[0], points[1], [x, oyb], [x1, oyb]]);
              endList.push([[x1, oyb], [x, oyb], points[2], points[3]]);
            } // 跨越上圆角
            else if (points[1][1] < oyt) {
                var _x2 = oyt < y2 ? x2 - Math.tan(deg2) * (y2 - oyt) : x2;

                beginList.push([points[0], points[1], [_x2, oyt], [x1, oyt]]);
                centerList.push([[x1, oyt], [_x2, oyt], points[2], points[3]]);
              } else {
                centerList.push(points);
              }
    }

    var beginLength = beginList.length;

    if (beginLength) {
      var needInner = bry > y2 - y1 && borderWidth < brx;
      var crossDeg = Math.atan((x2 - x1) / (y2 - y1));
      var rx1 = brx;
      var ry1 = bry;
      var sx1 = ry1 / rx1;
      var oxt = x1 + brx;
      var rx2 = brx - (x2 - x1);
      var ry2 = bry - (y2 - y1);
      var sx2 = ry2 / rx2; // 先计算第一个块，确定x/y边界，防止因为划分原因导致出现超过边界情况交叉

      var _xa5, ya, _xb5, yb;

      var ca = calBezierLeftTop(beginList[0][0], beginList[0][3], oxt, oyt, sx1, ry1, true, Math.tan(crossDeg) * ry1);

      var _ca7 = _slicedToArray(ca[ca.length - 1], 2);

      _xa5 = _ca7[0];
      ya = _ca7[1];
      var cb;

      if (needInner) {
        cb = calBezierLeftTop(beginList[0][1], beginList[0][2], oxt, oyt, sx2, ry2, true, Math.tan(crossDeg) * ry2);

        var _cb7 = _slicedToArray(cb[cb.length - 1], 2);

        _xb5 = _cb7[0];
        yb = _cb7[1];
      }

      beginList.forEach(function (points, i) {
        var controls1;
        var controls2;

        if (i === 0) {
          controls1 = ca;

          if (needInner) {
            controls2 = cb;
          }
        } else {
          controls1 = calBezierLeftTop(points[0], points[3], oxt, oyt, sx1, ry1);

          if (needInner) {
            controls2 = calBezierLeftTop(points[1], points[2], oxt, oyt, sx2, ry2);
          }
        }

        for (var _i13 = 0, _len13 = controls1.length; _i13 < _len13; _i13++) {
          limit(controls1[_i13], _xa5, ya, 6);
        }

        if (needInner) {
          for (var _i14 = 0, _len14 = controls2.length; _i14 < _len14; _i14++) {
            limit(controls2[_i14], _xb5, yb, 6);
          }

          if (controls2.length === 1) {
            points[2] = controls2[0];
            points.pop();
          } else {
            points[2] = controls2[0];
            points[3] = controls2[1].concat(controls2[2]).concat(controls2[3]);
          }
        } else {
          points[3] = points[1];
        }

        points[0] = controls1[3];
        points[1] = controls1[2].concat(controls1[1]).concat(controls1[0]);
      });
    }

    var endLength = endList.length;

    if (endLength) {
      var _needInner4 = ery > y4 - y3 && borderWidth < erx;

      var _crossDeg4 = Math.atan((x2 - x1) / (y4 - y3));

      var _rx7 = erx;
      var _ry7 = ery;

      var _sx7 = _ry7 / _rx7;

      var oxb = x1 + erx;

      var _rx8 = erx - (x2 - x1);

      var _ry8 = ery - (y4 - y3);

      var _sx8 = _ry8 / _rx8; // 先计算最后一个块，确定x/y边界，防止因为划分原因导致出现超过边界情况交叉


      var _xa6, _ya6, _xb6, _yb6;

      var _ca8 = calBezierLeftBottom(endList[endLength - 1][0], endList[endLength - 1][3], oxb, oyb, _sx7, _ry7, true, Math.tan(_crossDeg4) * _ry7);

      var _ca8$ = _slicedToArray(_ca8[0], 2);

      _xa6 = _ca8$[0];
      _ya6 = _ca8$[1];

      var _cb8;

      if (_needInner4) {
        _cb8 = calBezierLeftBottom(endList[endLength - 1][1], endList[endLength - 1][2], oxb, oyb, _sx8, _ry8, true, Math.tan(_crossDeg4) * _ry8);

        var _cb8$ = _slicedToArray(_cb8[0], 2);

        _xb6 = _cb8$[0];
        _yb6 = _cb8$[1];
      }

      endList.forEach(function (points, i) {
        var controls1;
        var controls2;

        if (i === endLength - 1) {
          controls1 = _ca8;

          if (_needInner4) {
            controls2 = _cb8;
          }
        } else {
          controls1 = calBezierLeftBottom(points[0], points[3], oxb, oyb, _sx7, _ry7);

          if (_needInner4) {
            controls2 = calBezierLeftBottom(points[1], points[2], oxb, oyb, _sx8, _ry8);
          }
        }

        for (var _i15 = 0, _len15 = controls1.length; _i15 < _len15; _i15++) {
          limit(controls1[_i15], _xa6, _ya6, 7);
        }

        if (_needInner4) {
          for (var _i16 = 0, _len16 = controls2.length; _i16 < _len16; _i16++) {
            limit(controls2[_i16], _xb6, _yb6, 7);
          }

          if (controls2.length === 1) {
            points[2] = controls2[0];
            points.pop();
          } else {
            points[2] = controls2[0];
            points[3] = controls2[1].concat(controls2[2]).concat(controls2[3]);
          }
        } else {
          points[3] = points[1];
        }

        points[0] = controls1[3];
        points[1] = controls1[2].concat(controls1[1]).concat(controls1[0]);
      });
    }

    return beginList.concat(centerList).concat(endList);
  }

  function calBezierLeftTop(p1, p2, ox, oy, sx, r, isStart, crossDx) {
    // 先缩放x轴，椭圆变圆，2个点x坐标相应变化，y不变
    var _p13 = _slicedToArray(p1, 2),
        p1x = _p13[0],
        p1y = _p13[1];

    var _p14 = _slicedToArray(p2, 2),
        p2x = _p14[0],
        p2y = _p14[1];

    var dx1 = ox - p1x;
    var dsx1 = dx1 * sx;
    var dx2 = ox - p2x;
    var dsx2 = dx2 * sx; // 求2个点和1/4圆弧的交点坐标，和圆心连线，反三角函数求出夹角

    var deg2 = Math.atan(dsx2 / (oy - p2y)); // 根据角和半径再三角函数求交点坐标，可以直接缩放x轴恢复原本椭圆坐标，求贝塞尔控制点用不到交点

    var cpx2 = ox - Math.sin(deg2) * r / sx;
    var cpy2 = oy - Math.cos(deg2) * r;
    var deg1;
    var cpx1;
    var cpy1;

    if (isStart) {
      // 交界线和y轴夹角beta以及交点的x坐标都会受缩放影响，先化圆好求交点坐标
      var crossDsx = crossDx * sx;
      var beta = Math.atan(crossDsx / r); // 公式计算可得beta和交点连圆心的角alpha关系

      var tanBetaDiv2Sqrt = Math.sqrt(Math.tan(beta) / 2);
      var tanAlphaHalf = tanBetaDiv2Sqrt / (1 + tanBetaDiv2Sqrt);
      var alpha = Math.atan(tanAlphaHalf) * 2; // 获得alpha后直接根据半径求出交点坐标

      deg1 = Math.PI * 0.5 - alpha;
      cpx1 = ox - Math.cos(alpha) * r / sx;
      cpy1 = oy - Math.sin(alpha) * r;
    } else {
      deg1 = Math.atan(dsx1 / (oy - p1y));
      cpx1 = ox - Math.sin(deg1) * r / sx;
      cpy1 = oy - Math.cos(deg1) * r;
    } // 首尾只有3个点情况下重复了顶点形成4边形，同时圆角x/y相等有inner时
    // 使得交点相同角度相同无法计算，直接返回1个点即可


    if (deg1 === deg2) {
      return [[cpx1, cpy1]];
    } // 根据夹角求贝塞尔拟合圆弧长度


    var h = geom.h(Math.abs(deg1 - deg2));
    var d = h * r; // 过交点做切线，知道切线段长度d，求切线上从交点延长d的坐标，即为控制点
    // 圆心交点控制点连成直角三角形，获得斜边即圆心到控制点距离c
    // 求切线角，用上面夹角减去切线角可得控制点和圆心连线的角，从而获得坐标

    var c = Math.sqrt(Math.pow(r, 2) + Math.pow(d, 2));
    var degTg = Math.atan(d / r);
    var degTg1 = deg1 + degTg;
    var cdx1 = Math.sin(degTg1) * c;
    var cdy1 = Math.cos(degTg1) * c;
    var cx1 = ox - cdx1 / sx;
    var cy1 = oy - cdy1;
    var degTg2 = deg2 - degTg;
    var cdx2 = Math.sin(degTg2) * c;
    var cdy2 = Math.cos(degTg2) * c;
    var cx2 = ox - cdx2 / sx;
    var cy2 = oy - cdy2; // window.ctx.fillStyle = '#000';
    // window.ctx.beginPath();
    // window.ctx.arc(cpx1, cpy1, 1,0, 2 * Math.PI);
    // window.ctx.fill();
    // window.ctx.fillStyle = '#0FF';
    // window.ctx.beginPath();
    // window.ctx.arc(cx1, cy1, 1,0, 2 * Math.PI);
    // window.ctx.fill();
    // window.ctx.fillStyle = '#00F';
    // window.ctx.beginPath();
    // window.ctx.arc(cx2, cy2, 1,0, 2 * Math.PI);
    // window.ctx.fill();
    // window.ctx.fillStyle = '#0F0';
    // window.ctx.beginPath();
    // window.ctx.arc(cpx2, cpy2, 1,0, 2 * Math.PI);
    // window.ctx.fill();
    // window.ctx.closePath();

    return [[cpx2, cpy2], [cx2, cy2], [cx1, cy1], [cpx1, cpy1]];
  }

  function calBezierLeftBottom(p1, p2, ox, oy, sx, r, isEnd, crossDx) {
    // 先缩放x轴，椭圆变圆，2个点x坐标相应变化，y不变
    var _p15 = _slicedToArray(p1, 2),
        p1x = _p15[0],
        p1y = _p15[1];

    var _p16 = _slicedToArray(p2, 2),
        p2x = _p16[0],
        p2y = _p16[1];

    var dx1 = ox - p1x;
    var dsx1 = dx1 * sx;
    var dx2 = ox - p2x;
    var dsx2 = dx2 * sx; // 求2个点和1/4圆弧的交点坐标，和圆心连线，反三角函数求出夹角

    var deg1 = Math.atan(dsx1 / (p1y - oy)); // 根据角和半径再三角函数求交点坐标，可以直接缩放x轴恢复原本椭圆坐标，求贝塞尔控制点用不到交点

    var cpx1 = ox - Math.sin(deg1) * r / sx;
    var cpy1 = oy + Math.cos(deg1) * r;
    var deg2;
    var cpx2;
    var cpy2;

    if (isEnd) {
      // 交界线和y轴夹角beta以及交点的x坐标都会受缩放影响，先化圆好求交点坐标
      var crossDsx = crossDx * sx;
      var beta = Math.atan(crossDsx / r); // 公式计算可得beta和交点连圆心的角alpha关系

      var tanBetaDiv2Sqrt = Math.sqrt(Math.tan(beta) / 2);
      var tanAlphaHalf = tanBetaDiv2Sqrt / (1 + tanBetaDiv2Sqrt);
      var alpha = Math.atan(tanAlphaHalf) * 2; // 获得alpha后直接根据半径求出交点坐标

      deg2 = Math.PI * 0.5 - alpha;
      cpx2 = ox - Math.cos(alpha) * r / sx;
      cpy2 = oy + Math.sin(alpha) * r;
    } else {
      deg2 = Math.atan(dsx2 / (p2y - oy));
      cpx2 = ox - Math.sin(deg2) * r / sx;
      cpy2 = oy + Math.cos(deg2) * r;
    } // 首尾只有3个点情况下重复了顶点形成4边形，同时圆角x/y相等有inner时
    // 使得交点相同角度相同无法计算，直接返回1个点即可


    if (deg1 === deg2) {
      return [[cpx1, cpy1]];
    } // 根据夹角求贝塞尔拟合圆弧长度


    var h = geom.h(Math.abs(deg1 - deg2));
    var d = h * r; // 过交点做切线，知道切线段长度d，求切线上从交点延长d的坐标，即为控制点
    // 圆心交点控制点连成直角三角形，获得斜边即圆心到控制点距离c
    // 求切线角，用上面夹角减去切线角可得控制点和圆心连线的角，从而获得坐标

    var c = Math.sqrt(Math.pow(r, 2) + Math.pow(d, 2));
    var degTg = Math.atan(d / r);
    var degTg1 = deg1 - degTg;
    var cdx1 = Math.sin(degTg1) * c;
    var cdy1 = Math.cos(degTg1) * c;
    var cx1 = ox - cdx1 / sx;
    var cy1 = oy + cdy1;
    var degTg2 = deg2 + degTg;
    var cdx2 = Math.sin(degTg2) * c;
    var cdy2 = Math.cos(degTg2) * c;
    var cx2 = ox - cdx2 / sx;
    var cy2 = oy + cdy2; // window.ctx.fillStyle = '#F90';
    // window.ctx.beginPath();
    // window.ctx.arc(cpx1, cpy1, 1,0, 2 * Math.PI);
    // window.ctx.fill();
    // window.ctx.fillStyle = '#0FF';
    // window.ctx.beginPath();
    // window.ctx.arc(cx1, cy1, 1,0, 2 * Math.PI);
    // window.ctx.fill();
    // window.ctx.fillStyle = '#00F';
    // window.ctx.beginPath();
    // window.ctx.arc(cx2, cy2, 1,0, 2 * Math.PI);
    // window.ctx.fill();
    // window.ctx.fillStyle = '#0F0';
    // window.ctx.beginPath();
    // window.ctx.arc(cpx2, cpy2, 1,0, 2 * Math.PI);
    // window.ctx.fill();
    // window.ctx.closePath();

    return [[cpx2, cpy2], [cx2, cy2], [cx1, cy1], [cpx1, cpy1]];
  }
  /**
   * 简单计算椭圆的圆化坐标控制点
   * @param x 起始x
   * @param y 起始y
   * @param w 宽
   * @param h 高
   * @param btw boderTopWidth
   * @param brw borderRightWidth
   * @param bbw borderBottomWidth
   * @param blw borderLeftWidth
   * @param btlr borderTopLeftRadius
   * @param btrr borderTopRightRadius
   * @param bbrr borderBottomRightRadius
   * @param bblr borderBottomLeftRadius
   * @returns {[]} 多边形的顶点和曲线控制点
   */


  function calRadius(x, y, w, h, btw, brw, bbw, blw, btlr, btrr, bbrr, bblr) {
    var need;

    var _btlr = _slicedToArray(btlr, 2),
        btlx = _btlr[0],
        btly = _btlr[1];

    var _btrr = _slicedToArray(btrr, 2),
        btrx = _btrr[0],
        btry = _btrr[1];

    var _bbrr = _slicedToArray(bbrr, 2),
        bbrx = _bbrr[0],
        bbry = _bbrr[1];

    var _bblr = _slicedToArray(bblr, 2),
        bblx = _bblr[0],
        bbly = _bblr[1]; // 先减去对应borderWidth，因为border可能比较宽，弧度只体现在外圆弧，有可能radius为0减去后为负数需判断


    btlx -= blw;
    btly -= btw;
    btrx -= brw;
    btry -= btw;
    bbrx -= brw;
    bbry -= bbw;
    bblx -= blw;
    bbly -= bbw; // 圆角必须x/y都>0才有效，否则视为不绘制

    if (btlx > 0 && btly > 0 || btrx > 0 && btry > 0 || bbrx > 0 && bbry > 0 || bblx > 0 && bbly > 0) {
      need = true;
    }

    if (need) {
      var list = [];

      if (btlx > 0 && btly > 0) {
        list.push([x, y + btly]);
        list.push([x, y + btly * (1 - H$1), x + btlx * (1 - H$1), y, x + btlx, y]);
      } else {
        list.push([x, y]);
      }

      if (btrx > 0 && btry > 0) {
        list.push([x + w - btrx, y]);
        list.push([x + w - btrx * (1 - H$1), y, x + w, y + btry * (1 - H$1), x + w, y + btry]);
      } else {
        list.push([x + w, y]);
      }

      if (bbrx > 0 && bbry > 0) {
        list.push([x + w, y + h - bbry]);
        list.push([x + w, y + h - bbry * (1 - H$1), x + w - bbrx * (1 - H$1), y + h, x + w - bbrx, y + h]);
      } else {
        list.push([x + w, y + h]);
      }

      if (bblx > 0 && bbly > 0) {
        list.push([x + bblx, y + h]);
        list.push([x + bblx * (1 - H$1), y + h, x, y + h - bbly * (1 - H$1), x, y + h - bbly]);
      } else {
        list.push([x, y + h]);
      }

      return list;
    }
  }

  function limit(points, x, y, direction) {
    if (direction === 0) {
      points[0] = Math.max(points[0], x);
      points[1] = Math.min(points[1], y);
    } else if (direction === 1) {
      points[0] = Math.min(points[0], x);
      points[1] = Math.min(points[1], y);
    } else if (direction === 2) {
      points[0] = Math.max(points[0], x);
      points[1] = Math.max(points[1], y);
    } else if (direction === 3) {
      points[0] = Math.max(points[0], x);
      points[1] = Math.min(points[1], y);
    } else if (direction === 4) {
      points[0] = Math.max(points[0], x);
      points[1] = Math.max(points[1], y);
    } else if (direction === 5) {
      points[0] = Math.min(points[0], x);
      points[1] = Math.max(points[1], y);
    } else if (direction === 6) {
      points[0] = Math.min(points[0], x);
      points[1] = Math.max(points[1], y);
    } else if (direction === 7) {
      points[0] = Math.min(points[0], x);
      points[1] = Math.min(points[1], y);
    }
  }

  var border = {
    calPoints: calPoints,
    calRadius: calRadius
  };

  var PERCENT$3 = unit.PERCENT,
      NUMBER$1 = unit.NUMBER;

  function matrixResize(imgWidth, imgHeight, targetWidth, targetHeight, x, y, w, h) {
    if (imgWidth === targetWidth && imgHeight === targetHeight) {
      return;
    }

    var list = [['scaleX', {
      value: targetWidth / imgWidth,
      unit: NUMBER$1
    }], ['scaleY', {
      value: targetHeight / imgHeight,
      unit: NUMBER$1
    }]];
    var tfo = tf.calOrigin([{
      value: 0,
      unit: PERCENT$3
    }, {
      value: 0,
      unit: PERCENT$3
    }], w, h);
    tfo[0] += x;
    tfo[1] += y;
    return tf.calMatrixWithOrigin(list, tfo, w, h);
  }

  var image = {
    matrixResize: matrixResize
  };

  var VERTEX = "\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nvarying vec2 vTextureCoord;\nuniform mat3 projectionMatrix;\n\nvoid main(void)\n{\n  gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n  vTextureCoord = aTextureCoord;\n}";
  var FRAGMENT = "\n#ifdef GL_ES\nprecision mediump float;\n#endif\nvarying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform vec2 uOffset;\nuniform vec4 filterClamp;\n\nvoid main(void)\n{\n  vec4 color = vec4(0.0);\n\n  // Sample top left pixel\n  color += texture2D(uSampler, clamp(vec2(vTextureCoord.x - uOffset.x, vTextureCoord.y + uOffset.y), filterClamp.xy, filterClamp.zw));\n\n  // Sample top right pixel\n  color += texture2D(uSampler, clamp(vec2(vTextureCoord.x + uOffset.x, vTextureCoord.y + uOffset.y), filterClamp.xy, filterClamp.zw));\n\n  // Sample bottom right pixel\n  color += texture2D(uSampler, clamp(vec2(vTextureCoord.x + uOffset.x, vTextureCoord.y - uOffset.y), filterClamp.xy, filterClamp.zw));\n\n  // Sample bottom left pixel\n  color += texture2D(uSampler, clamp(vec2(vTextureCoord.x - uOffset.x, vTextureCoord.y - uOffset.y), filterClamp.xy, filterClamp.zw));\n\n  // Average\n  color *= 0.25;\n\n  gl_FragColor = color;\n}";

  function initShaders(gl, vshader, fshader) {
    var program = createProgram(gl, vshader, fshader);

    if (!program) {
      console.error('Failed to create program');
      return false;
    }

    gl.useProgram(program);
    gl.program = program;
    return true;
  }

  function createProgram(gl, vshader, fshader) {
    var vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshader);
    var fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshader);

    if (!vertexShader || !fragmentShader) {
      return null;
    }

    var program = gl.createProgram();

    if (!program) {
      return null;
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var linked = gl.getProgramParameter(program, gl.LINK_STATUS);

    if (!linked) {
      var error = gl.getProgramInfoLog(program);
      console.error('Failed to link program: ' + error);
      gl.deleteProgram(program);
      gl.deleteShader(fragmentShader);
      gl.deleteShader(vertexShader);
      return null;
    }

    return program;
  }

  function loadShader(gl, type, source) {
    var shader = gl.createShader(type);

    if (shader == null) {
      console.error('unable to create shader');
      return null;
    }

    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

    if (!compiled) {
      var error = gl.getShaderInfoLog(shader);
      console.error('Failed to compile shader: ' + error);
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  function initVertexBuffers(gl) {
    var vertices = new Float32Array([-1, 1, 0.0, 1.0, -1, -1, 0.0, 0.0, 1, 1, 1.0, 1.0, 1, -1, 1.0, 0.0]);
    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    var FSIZE = Float32Array.BYTES_PER_ELEMENT;
    var aPosition = gl.getAttribLocation(gl.program, 'aVertexPosition');
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, FSIZE * 4, 0);
    gl.enableVertexAttribArray(aPosition);
    var aTexCoord = gl.getAttribLocation(gl.program, 'aTextureCoord');
    gl.vertexAttribPointer(aTexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
    var projectionMatrix = gl.getUniformLocation(gl.program, 'projectionMatrix');
    gl.uniformMatrix3fv(projectionMatrix, false, new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]));
    gl.enableVertexAttribArray(aTexCoord);
    return {
      aPosition: aPosition,
      aTexCoord: aTexCoord
    };
  }

  function initLocation(gl) {
    var uSampler = gl.getUniformLocation(gl.program, 'uSampler');
    var uOffset = gl.getUniformLocation(gl.program, 'uOffset');
    var uClamp = gl.getUniformLocation(gl.program, 'filterClamp');
    return {
      uSampler: uSampler,
      uOffset: uOffset,
      uClamp: uClamp
    };
  }

  function createAndSetupTexture(gl) {
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture); // 设置材质，这样我们可以对任意大小的图像进行像素操作

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    return texture;
  }

  var KawaseBlurFilter = /*#__PURE__*/function () {
    function KawaseBlurFilter(webgl) {
      var blur = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var quality = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 4;

      _classCallCheck(this, KawaseBlurFilter);

      this.webgl = webgl;
      var gl = this.gl = webgl.ctx;
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, -1);
      initShaders(gl, VERTEX, FRAGMENT);
      this.vertexLocations = initVertexBuffers(gl);
      this.textureLocations = initLocation(gl);
      this._pixelSize = {
        x: 0,
        y: 0
      };
      this.pixelSize = 1;
      this._kernels = null;
      this._blur = blur;
      this.quality = quality; // 创建两个纹理绑定到帧缓冲

      this.textures = [];
      this.framebuffers = [];
    }

    _createClass(KawaseBlurFilter, [{
      key: "initBuffers",
      value: function initBuffers(gl, width, height) {
        for (var i = 0; i < 2; i++) {
          var texture = createAndSetupTexture(gl);
          this.textures.push(texture);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null); // 创建一个帧缓冲

          var fbo = gl.createFramebuffer();
          this.framebuffers.push(fbo);
          gl.bindFramebuffer(gl.FRAMEBUFFER, fbo); // 绑定纹理到帧缓冲

          gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        }
      }
    }, {
      key: "draw",
      value: function draw(image, uOffsetArray, clear) {
        var _this$textureLocation = this.textureLocations,
            uOffset = _this$textureLocation.uOffset,
            uClamp = _this$textureLocation.uClamp;
        var gl = this.gl;
        gl.uniform2f(uOffset, uOffsetArray[0], uOffsetArray[1]);
        gl.viewport(0, 0, image.width, image.height);
        gl.uniform4f(uClamp, 0, 0, image.width, image.height);

        if (clear) {
          gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
    }, {
      key: "apply",
      value: function apply(target, width, height) {
        var gl = this.gl;
        this.initBuffers(gl, width, height);
        var uSampler = this.textureLocations.uSampler;
        gl.uniform1i(uSampler, 0);
        var originalImageTexture = createAndSetupTexture(gl);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, target.canvas);
        var uvX = this._pixelSize.x / width;
        var uvY = this._pixelSize.y / height;
        var offset;
        var last = this._quality - 1; // 从原始图像开始

        gl.bindTexture(gl.TEXTURE_2D, originalImageTexture);

        for (var i = 0; i < last; i++) {
          offset = this._kernels[i] + 0.5;
          gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffers[i % 2]);

          var _uOffsetArray = new Float32Array([offset * uvX, offset * uvY]);

          this.draw(target.canvas, _uOffsetArray, false);
          gl.bindTexture(gl.TEXTURE_2D, this.textures[i % 2]);
        }

        offset = this._kernels[last] + 0.5;
        var uOffsetArray = new Float32Array([offset * uvX, offset * uvY]);
        this.draw(target.canvas, uOffsetArray, true);
        this.webgl.draw();
        target.ctx.clearRect(0, 0, width, height);
        target.ctx.drawImage(gl.canvas, 0, 0);
        target.draw();
        return this;
      }
      /**
       * Auto generate kernels by blur & quality
       * @private
       */

    }, {
      key: "_generateKernels",
      value: function _generateKernels() {
        var blur = this._blur;
        var quality = this._quality;
        var kernels = [blur];

        if (blur > 0) {
          var k = blur;
          var step = blur / quality;

          for (var i = 1; i < quality; i++) {
            k -= step;
            kernels.push(k);
          }
        }

        this._kernels = kernels;
      }
      /**
       * The kernel size of the blur filter, for advanced usage.
       *
       * @member {number[]}
       * @default [0]
       */

    }, {
      key: "clear",
      value: function clear() {
        var gl = this.gl;
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
      }
    }, {
      key: "kernels",
      get: function get() {
        return this._kernels;
      },
      set: function set(value) {
        if (Array.isArray(value) && value.length > 0) {
          this._kernels = value;
          this._quality = value.length;
          this._blur = Math.max.apply(Math, value);
        } else {
          // if value is invalid , set default value
          this._kernels = [0];
          this._quality = 1;
        }
      }
      /**
       * Sets the pixel size of the filter. Large size is blurrier. For advanced usage.
       *
       * @member {PIXI.Point|number[]}
       * @default [1, 1]
       */

    }, {
      key: "pixelSize",
      set: function set(value) {
        if (typeof value === 'number') {
          this._pixelSize.x = value;
          this._pixelSize.y = value;
        } else if (Array.isArray(value)) {
          this._pixelSize.x = value[0];
          this._pixelSize.y = value[1];
        } else {
          // if value is invalid , set default value
          this._pixelSize.x = 1;
          this._pixelSize.y = 1;
        }
      },
      get: function get() {
        return this._pixelSize;
      }
      /**
       * The quality of the filter, integer greater than `1`.
       *
       * @member {number}
       * @default 3
       */

    }, {
      key: "quality",
      get: function get() {
        return this._quality;
      },
      set: function set(value) {
        this._quality = Math.max(1, Math.round(value));

        this._generateKernels();
      }
      /**
       * The amount of blur, value greater than `0`.
       *
       * @member {number}
       * @default 4
       */

    }, {
      key: "blur",
      get: function get() {
        return this._blur;
      },
      set: function set(value) {
        this._blur = value;

        this._generateKernels();
      }
    }]);

    return KawaseBlurFilter;
  }();

  function gaussBlur(target, webgl, blur, width, height) {
    return new KawaseBlurFilter(webgl, blur).apply(target, width, height);
  }

  var blur = {
    gaussBlur: gaussBlur
  };

  var SPF = 1000 / 60;
  var CANVAS = {};
  var WEBGL = {};

  function cache(key, width, height, hash) {
    var o;

    if (!key) {
      o = document.createElement('canvas');
    } else if (!hash[key]) {
      o = hash[key] = document.createElement('canvas');
    } else {
      o = hash[key];
    }

    o.setAttribute('width', width + 'px');
    o.setAttribute('height', height + 'px');

    if (typeof karas !== 'undefined' && karas.debug) {
      o.style.width = width + 'px';
      o.style.height = height + 'px';
      o.setAttribute('type', hash === CANVAS ? 'canvas' : 'webgl');

      if (key) {
        o.setAttribute('key', key);
      }

      document.body.appendChild(o);
    }

    return {
      canvas: o,
      ctx: hash === CANVAS ? o.getContext('2d') : o.getContext('webgl') || o.getContext('experimental-webgl'),
      draw: function draw() {// 空函数，仅对小程序提供hook特殊处理，flush缓冲
      },
      available: true,
      release: function release() {
        this.canvas = null;
        this.ctx = null;
      }
    };
  }

  function cacheCanvas(key, width, height) {
    return cache(key, width, height, CANVAS);
  }

  function cacheWebgl(key, width, height) {
    return cache(key, width, height, WEBGL);
  }

  var IMG = {};
  var INIT = 0;
  var LOADING = 1;
  var LOADED = 2;
  var inject = {
    measureText: function measureText(cb) {
      var _Text$MEASURE_TEXT = Text.MEASURE_TEXT,
          list = _Text$MEASURE_TEXT.list,
          data = _Text$MEASURE_TEXT.data;
      var html = '';
      var keys = [];
      var chars = [];
      Object.keys(data).forEach(function (i) {
        var _data$i = data[i],
            key = _data$i.key,
            style = _data$i.style,
            s = _data$i.s;

        if (s) {
          var inline = "position:absolute;font-family:".concat(style.fontFamily, ";font-size:").concat(style.fontSize, "px;font-weight:").concat(style.fontWeight);

          for (var j = 0, len = s.length; j < len; j++) {
            keys.push(key);

            var _char = s.charAt(j);

            chars.push(_char);
            html += "<span style=\"".concat(inline, "\">").concat(_char.replace(/</, '&lt;').replace(' ', '&nbsp;'), "</span>");
          }
        }
      });

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

      for (var i = 0, len = cns.length; i < len; i++) {
        var node = cns[i];
        var key = keys[i];
        var _char2 = chars[i]; // clientWidth只返回ceil整数，精度必须用getComputedStyle

        var css = window.getComputedStyle(node, null);
        CHAR_WIDTH_CACHE[key][_char2] = parseFloat(css.width);
      }

      list.forEach(function (text) {
        return text.__measureCb();
      });
      cb();
      MEASURE_TEXT.list = [];
      MEASURE_TEXT.data = {};
      document.body.removeChild(div);
    },
    IMG: IMG,
    INIT: INIT,
    LOADED: LOADED,
    LOADING: LOADING,
    measureImg: function measureImg(url, cb) {
      var cache = IMG[url] = IMG[url] || {
        state: INIT,
        task: []
      };

      if (cache.state === LOADED) {
        cb(cache);
      } else if (cache.state === LOADING) {
        cache.task.push(cb);
      } else {
        cache.state = LOADING;
        cache.task.push(cb);
        var img = new Image();

        img.onload = function () {
          cache.state = LOADED;
          cache.success = true;
          cache.width = img.width;
          cache.height = img.height;
          cache.source = img;
          cache.url = url;
          var list = cache.task.splice(0);
          list.forEach(function (cb) {
            return cb(cache);
          });
        };

        img.onerror = function () {
          cache.state = LOADED;
          cache.success = false;
          cache.url = url;
          var list = cache.task.splice(0);
          list.forEach(function (cb) {
            return cb(cache);
          });
        };

        if (url.substr(0, 5) !== 'data:') {
          var host = /^(?:\w+:)?\/\/([^/:]+)/.exec(url);

          if (host) {
            if (location.hostname !== host[1]) {
              img.crossOrigin = 'anonymous';
            }
          }
        }

        img.src = url;
      }
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
      var res;

      if (typeof requestAnimationFrame !== 'undefined') {
        inject.requestAnimationFrame = requestAnimationFrame.bind(window);
        res = requestAnimationFrame(cb);
      } else {
        res = setTimeout(cb, SPF);

        inject.requestAnimationFrame = function (cb) {
          return setTimeout(cb, SPF);
        };
      }

      return res;
    }),
    cancelAnimationFrame: function (_cancelAnimationFrame) {
      function cancelAnimationFrame(_x2) {
        return _cancelAnimationFrame.apply(this, arguments);
      }

      cancelAnimationFrame.toString = function () {
        return _cancelAnimationFrame.toString();
      };

      return cancelAnimationFrame;
    }(function (id) {
      var res;

      if (typeof cancelAnimationFrame !== 'undefined') {
        inject.cancelAnimationFrame = cancelAnimationFrame.bind(window);
        res = cancelAnimationFrame(id);
      } else {
        res = clearTimeout(id);

        inject.cancelAnimationFrame = function (id) {
          return clearTimeout(id);
        };
      }

      return res;
    }),
    now: function now() {
      if (typeof performance !== 'undefined') {
        inject.now = function () {
          return Math.floor(performance.now());
        };

        return Math.floor(performance.now());
      }

      inject.now = Date.now.bind(Date);
      return Date.now();
    },
    hasCacheCanvas: function hasCacheCanvas(key) {
      return key && CANVAS.hasOwnProperty(key);
    },
    getCacheCanvas: function getCacheCanvas(width, height, key) {
      return cacheCanvas(key, width, height);
    },
    delCacheCanvas: function delCacheCanvas(key) {
      key && delete CANVAS[key];
    },
    hasCacheWebgl: function hasCacheWebgl(key) {
      return key && WEBGL.hasOwnProperty(key);
    },
    getCacheWebgl: function getCacheWebgl(width, height, key) {
      return cacheWebgl(key, width, height);
    },
    delCacheWebgl: function delCacheWebgl(key) {
      key && delete WEBGL[key];
    },
    isDom: function isDom(o) {
      if (o) {
        if (util.isString(o)) {
          return true;
        }

        if (typeof window !== 'undefined' && window.Element && o instanceof window.Element) {
          return true;
        }

        if (util.isFunction(o.getElementsByTagName)) {
          return true;
        }
      }

      return false;
    }
  };

  var isFunction$1 = util.isFunction;

  var Event = /*#__PURE__*/function () {
    function Event() {
      _classCallCheck(this, Event);

      this.__eHash = {};
    }

    _createClass(Event, [{
      key: "on",
      value: function on(id, handle) {
        if (!handle) {
          return;
        }

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
        if (!isFunction$1(handle)) {
          return;
        }

        var self = this; // 包裹一层会导致添加后删除对比引用删不掉，需保存原有引用进行对比

        function cb() {
          for (var _len2 = arguments.length, data = new Array(_len2), _key = 0; _key < _len2; _key++) {
            data[_key] = arguments[_key];
          }

          handle.apply(self, data);
          self.off(id, cb);
        }

        cb.__karasEventCb = handle;

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
              // 需考虑once包裹的引用对比
              if (item[_i2] === handle || item[_i2].__karasEventCb === handle) {
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

                if (isFunction$1(cb)) {
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

  _defineProperty(Event, "REFRESH", 'refresh');

  _defineProperty(Event, "PAUSE", 'pause');

  _defineProperty(Event, "PLAY", 'play');

  _defineProperty(Event, "FRAME", 'frame');

  _defineProperty(Event, "FINISH", 'finish');

  _defineProperty(Event, "CANCEL", 'cancel');

  _defineProperty(Event, "BEGIN", 'begin');

  _defineProperty(Event, "END", 'end');

  var isFunction$2 = util.isFunction;

  function traversal(list, diff, step) {
    if (step === 'before') {
      list.forEach(function (item) {
        if (item && isFunction$2(item.before)) {
          item.before(diff);
        }
      });
    } else if (step === 'after') {
      list.forEach(function (item) {
        if (item && isFunction$2(item.after)) {
          item.after(diff);
        } else if (isFunction$2(item)) {
          item(diff);
        }
      });
    }
  }

  var isPause;

  var Frame = /*#__PURE__*/function () {
    function Frame() {
      _classCallCheck(this, Frame);

      this.__hookTask = []; // 动画刷新后，每个root注册的刷新回调执行

      this.__task = [];
      this.__taskBF = [];
      this.__now = null;
    }

    _createClass(Frame, [{
      key: "__init",
      value: function __init() {
        var self = this;
        var task = self.task,
            taskBF = self.taskBF;
        inject.cancelAnimationFrame(self.id);
        var last = self.__now = inject.now();

        function cb() {
          // 必须清除，可能会发生重复，当动画finish回调中gotoAndPlay(0)，下方结束判断发现aTask还有值会继续，新的init也会进入再次执行
          inject.cancelAnimationFrame(self.id);
          self.id = inject.requestAnimationFrame(function () {
            if (isPause || !task.length && !taskBF.length) {
              return;
            }

            var now = self.__now = inject.now();
            var diff = now - last;
            diff = Math.max(diff, 0); // let delta = diff * 0.06; // 比例是除以1/60s，等同于*0.06

            last = now; // 优先动画计算

            var cloneBF = taskBF.slice(0);
            var clone = task.slice(0);
            cloneBF.forEach(function (item) {
              item.before(diff);
            });
            traversal(clone, diff, 'before'); // 执行动画造成的刷新并清空，在root的refreshTask回调中可能被清空，因为task已经刷新过了

            self.__hookTask.splice(0).forEach(function (item) {
              return item();
            }); // 普通的after


            cloneBF.forEach(function (item) {
              item.after(diff);
            });
            traversal(clone, diff, 'after'); // 还有则继续，没有则停止节省性能

            if (task.length || taskBF.length) {
              cb();
            }
          });
        }

        cb();
      }
    }, {
      key: "onFrame",
      value: function onFrame(handle) {
        if (!handle) {
          return;
        }

        var task = this.task,
            taskBF = this.taskBF;

        if (!task.length && !taskBF.length) {
          this.__init();
        }

        task.push(handle);
      }
    }, {
      key: "__onFrameBF",
      value: function __onFrameBF(animate) {
        var task = this.task,
            taskBF = this.taskBF;

        if (!task.length && !taskBF.length) {
          this.__init();
        }

        taskBF.push(animate);
      }
    }, {
      key: "offFrame",
      value: function offFrame(handle) {
        if (!handle) {
          return;
        }

        var task = this.task,
            taskBF = this.taskBF;

        for (var i = 0, len = task.length; i < len; i++) {
          var item = task[i]; // 需考虑nextFrame包裹的引用对比

          if (item === handle || item.__karasFramecb === handle) {
            task.splice(i, 1);
            break;
          }
        }

        if (!task.length && !taskBF.length) {
          inject.cancelAnimationFrame(this.id);
          this.__now = null;
        }
      }
    }, {
      key: "__offFrameBF",
      value: function __offFrameBF(animate) {
        var task = this.task,
            taskBF = this.taskBF;

        for (var i = 0, len = taskBF.length; i < len; i++) {
          var item = taskBF[i]; // 需考虑nextFrame包裹的引用对比

          if (item === animate) {
            animate.splice(i, 1);
            break;
          }
        }

        if (!task.length && !taskBF.length) {
          inject.cancelAnimationFrame(this.id);
          this.__now = null;
        }
      }
    }, {
      key: "nextFrame",
      value: function nextFrame(handle) {
        var _this = this;

        if (!handle) {
          return;
        } // 包裹一层会导致添加后删除对比引用删不掉，需保存原有引用进行对比


        var cb = isFunction$2(handle) ? function (diff) {
          handle(diff);

          _this.offFrame(cb);
        } : {
          before: handle.before,
          after: function after(diff) {
            handle.after && handle.after(diff);

            _this.offFrame(cb);
          }
        };
        cb.__karasFramecb = handle;
        this.onFrame(cb);
      }
    }, {
      key: "pause",
      value: function pause() {
        isPause = true;
      }
    }, {
      key: "resume",
      value: function resume() {
        if (isPause) {
          this.__init();

          isPause = false;
        }
      }
    }, {
      key: "task",
      get: function get() {
        return this.__task;
      }
    }, {
      key: "taskBF",
      get: function get() {
        return this.__taskBF;
      }
    }]);

    return Frame;
  }();

  var frame = new Frame();

  /**
   * https://github.com/gre/bezier-easing
   * BezierEasing - use bezier curve for transition easing function
   * by Gaëtan Renaudeau 2014 - 2015 – MIT License
   */
  // These values are established by empiricism with tests (tradeoff: performance VS precision)
  var NEWTON_ITERATIONS = 4;
  var NEWTON_MIN_SLOPE = 0.001;
  var SUBDIVISION_PRECISION = 0.0000001;
  var SUBDIVISION_MAX_ITERATIONS = 10;
  var kSplineTableSize = 11;
  var kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);
  var float32ArraySupported = typeof Float32Array === 'function';

  function A(aA1, aA2) {
    return 1.0 - 3.0 * aA2 + 3.0 * aA1;
  }

  function B(aA1, aA2) {
    return 3.0 * aA2 - 6.0 * aA1;
  }

  function C(aA1) {
    return 3.0 * aA1;
  } // Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.


  function calcBezier(aT, aA1, aA2) {
    return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT;
  } // Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.


  function getSlope(aT, aA1, aA2) {
    return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
  }

  function binarySubdivide(aX, aA, aB, mX1, mX2) {
    var currentX,
        currentT,
        i = 0;

    do {
      currentT = aA + (aB - aA) / 2.0;
      currentX = calcBezier(currentT, mX1, mX2) - aX;

      if (currentX > 0.0) {
        aB = currentT;
      } else {
        aA = currentT;
      }
    } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);

    return currentT;
  }

  function newtonRaphsonIterate(aX, aGuessT, mX1, mX2) {
    for (var i = 0; i < NEWTON_ITERATIONS; ++i) {
      var currentSlope = getSlope(aGuessT, mX1, mX2);

      if (currentSlope === 0.0) {
        return aGuessT;
      }

      var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
      aGuessT -= currentX / currentSlope;
    }

    return aGuessT;
  }

  function LinearEasing(x) {
    return x;
  }

  function bezier(mX1, mY1, mX2, mY2) {
    if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) {
      throw new Error('bezier x values must be in [0, 1] range');
    }

    if (mX1 === mY1 && mX2 === mY2) {
      return LinearEasing;
    } // Precompute samples table


    var sampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);

    for (var i = 0; i < kSplineTableSize; ++i) {
      sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
    }

    function getTForX(aX) {
      var intervalStart = 0.0;
      var currentSample = 1;
      var lastSample = kSplineTableSize - 1;

      for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
        intervalStart += kSampleStepSize;
      }

      --currentSample; // Interpolate to provide an initial guess for t

      var dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
      var guessForT = intervalStart + dist * kSampleStepSize;
      var initialSlope = getSlope(guessForT, mX1, mX2);

      if (initialSlope >= NEWTON_MIN_SLOPE) {
        return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
      } else if (initialSlope === 0.0) {
        return guessForT;
      } else {
        return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
      }
    }

    return function BezierEasing(x) {
      // Because JavaScript number are imprecise, we should guarantee the extremes are right.
      if (x === 0 || x === 1) {
        return x;
      }

      return calcBezier(getTForX(x), mY1, mY2);
    };
  }

  var easing = {
    linear: bezier(1, 1, 0, 0),
    easeIn: bezier(0.42, 0, 1, 1),
    easeOut: bezier(0, 0, 0.58, 1),
    ease: bezier(0.25, 0.1, 0.25, 1),
    easeInOut: bezier(0.42, 0, 0.58, 1),
    cubicBezier: bezier
  };

  var AUTO$1 = unit.AUTO,
      PX$3 = unit.PX,
      PERCENT$4 = unit.PERCENT,
      INHERIT$2 = unit.INHERIT,
      RGBA$1 = unit.RGBA,
      STRING$1 = unit.STRING,
      NUMBER$2 = unit.NUMBER;
  var isNil$4 = util.isNil,
      isFunction$3 = util.isFunction,
      isNumber$1 = util.isNumber,
      isObject$1 = util.isObject,
      clone$1 = util.clone,
      equalArr$1 = util.equalArr;
  var linear = easing.linear;
  var COLOR_HASH$2 = key.COLOR_HASH,
      LENGTH_HASH$2 = key.LENGTH_HASH,
      RADIUS_HASH$2 = key.RADIUS_HASH,
      GRADIENT_HASH$2 = key.GRADIENT_HASH,
      EXPAND_HASH$2 = key.EXPAND_HASH,
      GRADIENT_TYPE$2 = key.GRADIENT_TYPE;

  function unify(frames, target) {
    var hash = {};
    var keys = []; // 获取所有关键帧的属性

    frames.forEach(function (item) {
      var style = item.style;
      Object.keys(style).forEach(function (k) {
        var v = style[k]; // 空的过滤掉

        if (!isNil$4(v) && !hash.hasOwnProperty(k)) {
          hash[k] = true;
          keys.push(k);
        }
      });
    }); // 添补没有声明完全的关键帧属性为节点当前值

    frames.forEach(function (item) {
      var style = item.style;
      keys.forEach(function (k) {
        if (!style.hasOwnProperty(k) || isNil$4(style[k])) {
          if (o.GEOM.hasOwnProperty(k)) {
            style[k] = target.currentProps[k];
          } else {
            style[k] = target.currentStyle[k];
          }
        }
      });
    });
    return keys;
  } // 每次初始化时处理继承值，以及转换transform为单matrix矩阵


  function inherit(frames, keys, target) {
    var computedStyle = target.computedStyle;
    frames.forEach(function (item) {
      var style = item.style;
      keys.forEach(function (k) {
        var v = style[k]; // geom的属性可能在帧中没有

        if (isNil$4(v)) {
          return;
        }

        if (k === 'transform') {
          var ow = target.outerWidth;
          var oh = target.outerHeight;
          var m = tf.calMatrix(v, ow, oh);
          style[k] = [['matrix', m]];
        } else if (v.unit === INHERIT$2) {
          if (k === 'color') {
            style[k] = {
              value: util.rgba2int(computedStyle[k]),
              unit: RGBA$1
            };
          } else if (LENGTH_HASH$2.hasOwnProperty(k)) {
            style[k] = {
              value: computedStyle[k],
              unit: PX$3
            };
          } else if (k === 'fontWeight') {
            style[k] = {
              value: computedStyle[k],
              unit: NUMBER$2
            };
          } else if (k === 'fontStyle' || k === 'fontFamily' || k === 'textAlign') {
            style[k] = {
              value: computedStyle[k],
              unit: STRING$1
            };
          }
        }
      });
    });
  }
  /**
   * 通知root更新当前动画，需要根据frame的状态来决定是否是同步插入
   * 在异步时，因为动画本身是异步，需要addRefreshTask
   * 而如果此时frame在执行before过程中，说明帧动画本身是在before计算的，需要同步插入
   * @param style
   * @param animation
   * @param root
   * @param node
   */


  function genBeforeRefresh(style, animation, root, node) {
    root.__addUpdate({
      node: node,
      style: style
    });

    animation.__style = style;
    animation.__assigning = true; // frame每帧回调时，下方先执行计算好变更的样式，这里特殊插入一个hook，让root增加一个刷新操作
    // 多个动画调用因为相同root也只会插入一个，这样在所有动画执行完毕后frame里检查同步进行刷新，解决单异步问题

    root.__frameHook();
  }
  /**
   * 将每帧的样式格式化，提取出offset属性并转化为时间，提取出缓动曲线easing
   * @param style 关键帧样式
   * @param duration 动画时间长度
   * @param es options的easing曲线控制，frame没有自定义则使用全局的
   * @returns {{style: *, time: number, easing: *, transition: []}}
   */


  function framing(style, duration, es) {
    var _style = style,
        offset = _style.offset,
        easing = _style.easing; // 这两个特殊值提出来存储不干扰style

    delete style.offset;
    delete style.easing;
    style = css.normalize(style);
    return {
      style: style,
      time: offset * duration,
      easing: easing || es,
      transition: []
    };
  }
  /**
   * 计算两帧之间的差，单位不同的以后面为准，返回的v表示差值
   * 没有变化返回空
   * auto等无法比较的不参与计算，不返回来标识无过度效果
   * @param prev 上一帧样式
   * @param next 下一帧样式
   * @param k 比较的样式名
   * @param target dom对象
   * @returns {{k: *, v: *}}
   */


  function calDiff(prev, next, k, target) {
    var res = {
      k: k
    };
    var p = prev[k];
    var n = next[k];

    if (k === 'transform') {
      // transform因默认值null很特殊，不存在时需给默认矩阵
      if (!p && !n) {
        return;
      }

      var pm, nm;

      if (p) {
        pm = p[0][1];
      } else {
        pm = [1, 0, 0, 1, 0, 0];
      }

      if (n) {
        nm = n[0][1];
      } else {
        nm = [1, 0, 0, 1, 0, 0];
      } // transform特殊被初始化转成matrix矩阵，直接计算差值


      if (equalArr$1(pm, nm)) {
        return;
      }

      res.v = [nm[0] - pm[0], nm[1] - pm[1], nm[2] - pm[2], nm[3] - pm[3], nm[4] - pm[4], nm[5] - pm[5]];
      return res;
    } else if (k === 'filter') {
      // 目前只有1个blur，可以简单处理
      if (!p || !p.length) {
        res.v = n[0][1];
      } else if (!n || !n.length) {
        res.v = -p[0][1];
      } else {
        res.v = n[0][1] - p[0][1];
      }
    } else if (k === 'transformOrigin') {
      res.v = [];

      for (var i = 0; i < 2; i++) {
        var pi = p[i];
        var ni = n[i];

        if (pi.unit === ni.unit) {
          res.v.push(ni.value - pi.value);
        } else if (pi.unit === PX$3 && ni.unit === PERCENT$4) {
          var v = ni.value * 0.01 * target[i ? 'outerHeight' : 'outerWidth'];
          res.v.push(v - pi.value);
        } else if (pi.unit === PERCENT$4 && ni.unit === PX$3) {
          var _v = ni.value * 100 / target[i ? 'outerHeight' : 'outerWidth'];

          res.v.push(_v - pi.value);
        }
      }

      if (equalArr$1(res.v, [0, 0])) {
        return;
      }
    } else if (k === 'backgroundPositionX' || k === 'backgroundPositionY') {
      if (p.unit === n.unit && [PX$3, PERCENT$4].indexOf(p.unit) > -1) {
        var _v2 = n.value - p.value;

        if (_v2 === 0) {
          return;
        }

        res.v = _v2;
      } else if (p.unit === PX$3 && n.unit === PERCENT$4) {
        var _v3 = n.value * 0.01 * target[k === 'backgroundPositionX' ? 'innerWidth' : 'innerHeight'];

        _v3 = _v3 - p.value;

        if (_v3 === 0) {
          return;
        }

        res.v = _v3;
      } else if (p.unit === PERCENT$4 && n.unit === PX$3) {
        var _v4 = n.value * 100 / target[k === 'backgroundPositionX' ? 'innerWidth' : 'innerHeight'];

        _v4 = _v4 - p.value;

        if (_v4 === 0) {
          return;
        }

        res.v = _v4;
      }
    } else if (k === 'boxShadow') {
      res.v = [];

      for (var _i = 0, len = Math.min(p.length, n.length); _i < len; _i++) {
        var a = p[_i];
        var b = n[_i];
        var _v5 = []; // x/y/blur/spread

        for (var j = 0; j < 4; j++) {
          _v5.push(b[j] - a[j]);
        } // rgba


        var c = [];

        for (var _j = 0; _j < 4; _j++) {
          c.push(b[4][_j] - a[4][_j]);
        }

        _v5.push(c);

        res.v.push(_v5);
      }
    } else if (EXPAND_HASH$2.hasOwnProperty(k)) {
      if (p.unit === n.unit) {
        var _v6 = n.value - p.value;

        if (_v6 === 0) {
          return;
        }

        res.v = _v6;
      } else if (p.unit === PX$3 && n.unit === PERCENT$4) {
        var _v7 = n.value * 0.01 * target[/\w+X$/.test(k) ? 'outerWidth' : 'outerHeight'];

        _v7 = _v7 - p.value;

        if (_v7 === 0) {
          return;
        }

        res.v = _v7;
      } else if (p.unit === PERCENT$4 && n.unit === PX$3) {
        var _v8 = n.value * 100 / target[/\w+X$/.test(k) ? 'outerWidth' : 'outerHeight'];

        _v8 = _v8 - p.value;

        if (_v8 === 0) {
          return;
        }

        res.v = _v8;
      }
    } else if (k === 'backgroundSize') {
      res.v = [];

      for (var _i2 = 0; _i2 < 2; _i2++) {
        var _pi = p[_i2];
        var _ni = n[_i2];

        if (_pi.unit === _ni.unit && [PX$3, PERCENT$4].indexOf(_pi.unit) > -1) {
          res.v.push(_ni.value - _pi.value);
        } else if (_pi.unit === PX$3 && _ni.unit === PERCENT$4) {
          var _v9 = _ni.value * 0.01 * target[_i2 ? 'innerWidth' : 'innerHeight'];

          res.v.push(_v9 - _pi.value);
        } else if (_pi.unit === PERCENT$4 && _ni.unit === PX$3) {
          var _v10 = _ni.value * 100 / target[_i2 ? 'innerWidth' : 'innerHeight'];

          res.v.push(_v10 - _pi.value);
        } else {
          return;
        }
      }

      if (equalArr$1(res.v, [0, 0])) {
        return;
      }
    } else if (GRADIENT_HASH$2.hasOwnProperty(k)) {
      // backgroundImage发生了渐变色和图片的变化，fill发生渐变色和纯色的变化等
      if (p.k !== n.k) {
        return;
      } // 渐变
      else if (p.k === 'linear' || p.k === 'radial') {
          var pv = p.v;
          var nv = n.v;

          if (equalArr$1(pv, nv)) {
            return;
          }

          res.v = [];
          var innerWidth = target.innerWidth;
          var eq;

          for (var _i3 = 0, _len = Math.min(pv.length, nv.length); _i3 < _len; _i3++) {
            var _a = pv[_i3];
            var _b = nv[_i3];
            var t = [];
            t.push([_b[0][0] - _a[0][0], _b[0][1] - _a[0][1], _b[0][2] - _a[0][2], _b[0][3] - _a[0][3]]);
            eq = equalArr$1(t, [0, 0, 0, 0]);

            if (_a[1] && _b[1]) {
              if (_a[1].unit === _b[1].unit) {
                t.push(_b[1].value - _a[1].value);
              } else if (_a[1].unit === PX$3 && _b[1].unit === PERCENT$4) {
                t.push(_b[1].value * innerWidth * 0.01 - _a[1].value);
              } else if (_a[1].unit === PERCENT$4 && _b[1].unit === PX$3) {
                t.push(_b[1].value * 100 / innerWidth - _a[1].value);
              }

              if (eq) {
                eq = t[4] === 0;
              }
            } else if (_a[1] || _b[1]) {
              eq = false;
            }

            res.v.push(t);
          } // 线性渐变有角度差值变化


          if (p.k === 'linear') {
            var _v11 = n.d - p.d;

            if (eq && _v11 === 0) {
              return;
            }

            res.d = _v11;
          } // 径向渐变的位置
          else {
              res.p = [];

              for (var _i4 = 0; _i4 < 2; _i4++) {
                var pp = p.p[_i4];
                var np = n.p[_i4];

                if (pp.unit === np.unit) {
                  res.p.push(np.value - pp.value);
                } else if (pp.unit === PX$3 && np.unit === PERCENT$4) {
                  var _v12 = np.value * 0.01 * target[_i4 ? 'innerWidth' : 'innerHeight'];

                  res.p.push(_v12 - pp.value);
                } else if (pp.unit === PERCENT$4 && np.unit === PX$3) {
                  var _v13 = np.value * 100 / target[_i4 ? 'innerWidth' : 'innerHeight'];

                  res.p.push(_v13 - pp.value);
                }
              }

              if (eq && equalArr$1(res.p, [0, 0])) {
                return;
              }
            }
        } // 纯色
        else {
            if (equalArr$1(n, p)) {
              return;
            }

            res.v = [n[0] - p[0], n[1] - p[1], n[2] - p[2], n[3] - p[3]];
          }
    } else if (COLOR_HASH$2.hasOwnProperty(k)) {
      n = n.value;
      p = p.value;

      if (equalArr$1(n, p) || n[3] === 0 && p[3] === 0) {
        return;
      }

      res.v = [n[0] - p[0], n[1] - p[1], n[2] - p[2], n[3] - p[3]];
    } else if (RADIUS_HASH$2.hasOwnProperty(k)) {
      // x/y都相等无需
      if (n[0].value === p[0].value && n[0].unit === p[0].unit && n[1].value === p[1].value && n[1].unit === p[1].unit) {
        return;
      }

      res.v = [];

      for (var _i5 = 0; _i5 < 2; _i5++) {
        if (n[_i5].unit === p[_i5].unit) {
          res.v.push(n[_i5].value - p[_i5].value);
        } else if (p[_i5].unit === PX$3 && n[_i5].unit === PERCENT$4) {
          res.v.push(n[_i5].value * 0.01 * target[_i5 ? 'outerHeight' : 'outerWidth'] - p[_i5].value);
        } else if (p[_i5].unit === PERCENT$4 && n[_i5].unit === PX$3) {
          res.v.push(n[_i5].value * 100 / target[_i5 ? 'outerHeight' : 'outerWidth'] - p[_i5].value);
        } else {
          res.v.push(0);
        }
      }
    } else if (LENGTH_HASH$2.hasOwnProperty(k)) {
      // auto不做动画
      if (p.unit === AUTO$1 || n.unit === AUTO$1) {
        return;
      }

      var computedStyle = target.computedStyle;
      var parentComputedStyle = (target.parent || target).computedStyle;
      var diff = 0;

      if (p.unit === n.unit) {
        diff = n.value - p.value;
      } // 长度单位变化特殊计算，根据父元素computedStyle
      else if (p.unit === PX$3 && n.unit === PERCENT$4) {
          var _v14;

          if (k === 'fontSize') {
            _v14 = n.value * parentComputedStyle[k] * 0.01;
          } else if (k === 'flexBasis' && computedStyle.flexDirection === 'row' || k === 'width' || /margin/.test(k) || /padding/.test(k) || ['left', 'right'].indexOf(k) > -1) {
            _v14 = n.value * parentComputedStyle.width * 0.01;
          } else if (k === 'flexBasis' || k === 'height' || ['top', 'bottom'].indexOf(k) > -1) {
            _v14 = n.value * parentComputedStyle.height * 0.01;
          }

          diff = _v14 - p.value;
        } else if (p.unit === PERCENT$4 && n.unit === PX$3) {
          var _v15;

          if (k === 'fontSize') {
            _v15 = n.value * 100 / parentComputedStyle[k];
          } else if (k === 'flexBasis' && computedStyle.flexDirection === 'row' || k === 'width' || /margin/.test(k) || /padding/.test(k) || ['left', 'right'].indexOf(k) > -1) {
            _v15 = n.value * 100 / parentComputedStyle.width;
          } else if (k === 'flexBasis' || k === 'height' || ['top', 'bottom'].indexOf(k) > -1) {
            _v15 = n.value * 100 / parentComputedStyle.height;
          }

          diff = _v15 - p.value;
        } // lineHeight奇怪的单位变化
        else if (k === 'lineHeight') {
            if (p.unit === PX$3 && n.unit === NUMBER$2) {
              diff = n.value * computedStyle.fontSize - p.value;
            } else if (p.unit === NUMBER$2 && n.unit === PX$3) {
              diff = n.value / computedStyle.fontSize - p.value;
            }
          } // 兜底NaN非法


      if (diff === 0 || isNaN(diff)) {
        return;
      }

      res.v = diff;
    } else if (o.GEOM.hasOwnProperty(k)) {
      if (isNil$4(p)) {
        return;
      } // 特殊处理multi
      else if (target.isMulti) {
          if (k === 'points' || k === 'controls') {
            if (isNil$4(n) || isNil$4(p) || equalArr$1(p, n)) {
              return;
            }

            res.v = [];

            for (var _i6 = 0, _len2 = Math.min(p.length, n.length); _i6 < _len2; _i6++) {
              var _pv = p[_i6];
              var _nv = n[_i6];

              if (isNil$4(_pv) || isNil$4(_nv)) {
                res.v.push(null);
              } else {
                var v2 = [];

                for (var _j2 = 0, len2 = Math.min(_pv.length, _nv.length); _j2 < len2; _j2++) {
                  var pv2 = _pv[_j2];
                  var nv2 = _nv[_j2];

                  if (isNil$4(pv2) || isNil$4(nv2)) {
                    v2.push(null);
                  } else {
                    var v3 = [];

                    for (var _k = 0, len3 = Math.max(pv2.length, nv2.length); _k < len3; _k++) {
                      var pv3 = pv2[_k];
                      var nv3 = nv2[_k]; // control由4点变2点

                      if (isNil$4(pv3) || isNil$4(nv3)) {
                        v3.push(0);
                      } else {
                        v3.push(nv3 - pv3);
                      }
                    }

                    v2.push(v3);
                  }
                }

                res.v.push(v2);
              }
            }
          } else if (k === 'controlA' || k === 'controlB') {
            if (isNil$4(n) || isNil$4(p) || equalArr$1(p, n)) {
              return;
            }

            res.v = [];

            for (var _i7 = 0, _len3 = Math.min(p.length, n.length); _i7 < _len3; _i7++) {
              var _pv2 = p[_i7];
              var _nv2 = n[_i7];

              if (isNil$4(_pv2) || isNil$4(_nv2)) {
                res.v.push(null);
              } else {
                res.v.push([_nv2[0] - _pv2[0], _nv2[1] - _pv2[1]]);
              }
            }
          } else {
            if (n === p || equalArr$1(n, p) || k === 'edge' || k === 'closure') {
              return;
            }

            var _v16 = [];

            for (var _i8 = 0, _len4 = Math.min(p.length, n.length); _i8 < _len4; _i8++) {
              var _pv3 = p[_i8];
              var _nv3 = n[_i8];

              if (isNil$4(_pv3) || isNil$4(_nv3)) {
                _v16.push(0);
              }

              _v16.push(_nv3 - _pv3);
            }

            res.v = _v16;
          }
        } // 非multi特殊处理这几类数组类型数据
        else if (k === 'points' || k === 'controls') {
            if (isNil$4(n) || isNil$4(p) || equalArr$1(p, n)) {
              return;
            }

            res.v = [];

            for (var _i9 = 0, _len5 = Math.min(p.length, n.length); _i9 < _len5; _i9++) {
              var _pv4 = p[_i9];
              var _nv4 = n[_i9];

              if (isNil$4(_pv4) || isNil$4(_nv4)) {
                res.v.push(null);
              } else {
                var _v17 = [];

                for (var _j3 = 0, _len6 = Math.max(_pv4.length, _nv4.length); _j3 < _len6; _j3++) {
                  var _pv5 = _pv4[_j3];
                  var _nv5 = _nv4[_j3]; // control由4点变2点

                  if (isNil$4(_pv5) || isNil$4(_nv5)) {
                    _v17.push(0);
                  } else {
                    _v17.push(_nv5 - _pv5);
                  }
                }

                res.v.push(_v17);
              }
            }
          } else if (k === 'controlA' || k === 'controlB') {
            if (isNil$4(n) || isNil$4(p) || equalArr$1(p, n)) {
              return;
            }

            res.v = [n[0] - p[0], n[1] - p[1]];
          } // 其它简单数据，除了edge/closure没有增量
          else {
              if (n === p || k === 'edge' || k === 'closure') {
                return;
              } else {
                res.v = n - p;
              }
            }
    } else if (k === 'opacity' || k === 'zIndex') {
      if (n === p) {
        return;
      }

      res.v = n - p;
    } // display等不能有增量过程的
    else {
        return;
      }

    return res;
  } // 计算两帧之间不相同的变化，存入transition，相同的忽略


  function calFrame(prev, next, keys, target) {
    keys.forEach(function (k) {
      var ts = calDiff(prev.style, next.style, k, target); // 可以形成过渡的才会产生结果返回

      if (ts) {
        prev.transition.push(ts);
      }
    });
    return next;
  }

  function binarySearch(i, j, time, frames) {
    if (i === j) {
      var _frame = frames[i];

      if (_frame.time > time) {
        return i - 1;
      }

      return i;
    } else {
      var middle = i + (j - i >> 1);
      var _frame2 = frames[middle];

      if (_frame2.time === time) {
        return middle;
      } else if (_frame2.time > time) {
        return binarySearch(i, Math.max(middle - 1, i), time, frames);
      } else {
        return binarySearch(Math.min(middle + 1, j), j, time, frames);
      }
    }
  }

  function getEasing(ea) {
    var timingFunction;

    if (ea) {
      if (/^\s*(?:cubic-bezier\s*)?\(\s*[\d.]+\s*,\s*[-\d.]+\s*,\s*[\d.]+\s*,\s*[-\d.]+\s*\)\s*$/i.test(ea)) {
        var v = ea.match(/[\d.]+/g);
        timingFunction = easing.cubicBezier(v[0], v[1], v[2], v[3]);
      } else if (timingFunction = /^\s*steps\s*\(\s*(\d+)(?:\s*,\s*(\w+))?\s*\)/i.exec(ea)) {
        var steps = parseInt(timingFunction[1]);
        var stepsD = timingFunction[2];

        timingFunction = function timingFunction(percent) {
          // steps有效定义正整数
          if (steps && steps > 0) {
            var per = 1 / steps;
            var n = stepsD === 'start' ? Math.ceil(percent / per) : Math.floor(percent / per);
            return n / steps;
          }

          return percent;
        };
      } else {
        timingFunction = easing[ea];
      }
    }

    return timingFunction;
  }
  /**
   * 根据百分比和缓动函数计算中间态样式
   * 当easing定义为steps时，优先计算
   * @param frame 当前帧
   * @param percent 到下一帧时间的百分比
   * @param target vd
   * @returns {*}
   */


  function calIntermediateStyle(frame, percent, target) {
    var style = clone$1(frame.style);
    var timingFunction = getEasing(frame.easing);

    if (timingFunction && timingFunction !== linear) {
      percent = timingFunction(percent);
    }

    var transition = frame.transition;

    for (var i = 0, len = transition.length; i < len; i++) {
      var _transition$i = transition[i],
          k = _transition$i.k,
          v = _transition$i.v,
          d = _transition$i.d,
          p = _transition$i.p;
      var st = style[k]; // transform特殊处理，只有1个matrix，有可能不存在，需给默认矩阵

      if (k === 'transform') {
        if (!st) {
          st = style[k] = [['matrix', [1, 0, 0, 1, 0, 0]]];
        }

        for (var _i10 = 0; _i10 < 6; _i10++) {
          st[0][1][_i10] += v[_i10] * percent;
        }
      } else if (k === 'filter') {
        // 只有1个样式声明了filter另外一个为空
        if (!st) {
          st = style[k] = [['blur', 0]];
        }

        st[0][1] += v * percent;
      } else if (RADIUS_HASH$2.hasOwnProperty(k)) {
        for (var _i11 = 0; _i11 < 2; _i11++) {
          st[_i11].value += v[_i11] * percent;
        }
      } else if (k === 'backgroundPositionX' || k === 'backgroundPositionY' || LENGTH_HASH$2.hasOwnProperty(k) || EXPAND_HASH$2.hasOwnProperty(k)) {
        if (v !== 0) {
          st.value += v * percent;
        }
      } else if (k === 'transformOrigin' || k === 'backgroundSize') {
        if (v[0] !== 0) {
          st[0].value += v[0] * percent;
        }

        if (v[1] !== 0) {
          st[1].value += v[1] * percent;
        }
      } else if (k === 'boxShadow') {
        for (var _i12 = 0, _len7 = Math.min(st.length, v.length); _i12 < _len7; _i12++) {
          // x/y/blur/spread
          for (var j = 0; j < 4; j++) {
            st[_i12][j] += v[_i12][j] * percent;
          } // rgba


          for (var _j4 = 0; _j4 < 4; _j4++) {
            st[_i12][4][_j4] += v[_i12][4][_j4] * percent;
          }
        }
      } else if (GRADIENT_HASH$2.hasOwnProperty(k)) {
        if (GRADIENT_TYPE$2.hasOwnProperty(st.k)) {
          for (var _i13 = 0, _len8 = Math.min(st.v.length, v.length); _i13 < _len8; _i13++) {
            var a = st.v[_i13];
            var b = v[_i13];
            a[0][0] += b[0][0] * percent;
            a[0][1] += b[0][1] * percent;
            a[0][2] += b[0][2] * percent;
            a[0][3] += b[0][3] * percent;

            if (a[1] && b[1]) {
              a[1].value += b[1] * percent;
            }
          }

          if (st.k === 'linear' && st.d !== undefined && d !== undefined) {
            st.d += d * percent;
          }

          if (st.k === 'radial' && st.p !== undefined && p !== undefined) {
            st.p[0].value += p[0] * percent;
            st.p[1].value += p[1] * percent;
          }
        } // fill纯色
        else {
            st[0] += v[0] * percent;
            st[1] += v[1] * percent;
            st[2] += v[2] * percent;
            st[3] += v[3] * percent;
          }
      } // color可能超限[0,255]，但浏览器已经做了限制，无需关心
      else if (COLOR_HASH$2.hasOwnProperty(k)) {
          st = st.value;
          st[0] += v[0] * percent;
          st[1] += v[1] * percent;
          st[2] += v[2] * percent;
          st[3] += v[3] * percent;
        } else if (o.GEOM.hasOwnProperty(k)) {
          (function () {
            var st = style[k];

            if (target.isMulti) {
              if (k === 'points' || k === 'controls') {
                for (var _i14 = 0, _len9 = Math.min(st.length, v.length); _i14 < _len9; _i14++) {
                  var o = st[_i14];
                  var n = v[_i14];

                  if (!isNil$4(o) && !isNil$4(n)) {
                    for (var _j5 = 0, len2 = Math.min(o.length, n.length); _j5 < len2; _j5++) {
                      var o2 = o[_j5];
                      var n2 = n[_j5];

                      if (!isNil$4(o2) && !isNil$4(n2)) {
                        for (var _k2 = 0, len3 = Math.min(o2.length, n2.length); _k2 < len3; _k2++) {
                          if (!isNil$4(o2[_k2]) && !isNil$4(n2[_k2])) {
                            o2[_k2] += n2[_k2] * percent;
                          }
                        }
                      }
                    }
                  }
                }
              } else if (k === 'controlA' || k === 'controlB') {
                v.forEach(function (item, i) {
                  var st2 = st[i];

                  if (!isNil$4(item) && !isNil$4(st2)) {
                    for (var _i15 = 0, _len10 = Math.min(st2.length, item.length); _i15 < _len10; _i15++) {
                      var _o = st2[_i15];
                      var _n = item[_i15];

                      if (!isNil$4(_o) && !isNil$4(_n)) {
                        st2[_i15] += _n * percent;
                      }
                    }
                  }
                });
              } else {
                v.forEach(function (item, i) {
                  if (!isNil$4(item) && !isNil$4(st[i])) {
                    st[i] += item * percent;
                  }
                });
              }
            } else {
              if (k === 'points' || k === 'controls') {
                for (var _i16 = 0, _len11 = Math.min(st.length, v.length); _i16 < _len11; _i16++) {
                  var _o2 = st[_i16];
                  var _n2 = v[_i16];

                  if (!isNil$4(_o2) && !isNil$4(_n2)) {
                    for (var _j6 = 0, _len12 = Math.min(_o2.length, _n2.length); _j6 < _len12; _j6++) {
                      if (!isNil$4(_o2[_j6]) && !isNil$4(_n2[_j6])) {
                        _o2[_j6] += _n2[_j6] * percent;
                      }
                    }
                  }
                }
              } else if (k === 'controlA' || k === 'controlB') {
                if (!isNil$4(st[0]) && !isNil$4(v[0])) {
                  st[0] += v[0] * percent;
                }

                if (!isNil$4(st[1]) && !isNil$4(v[1])) {
                  st[1] += v[1] * percent;
                }
              } else {
                if (!isNil$4(st) && !isNil$4(v)) {
                  style[k] += v * percent;
                }
              }
            }
          })();
        } else if (k === 'opacity' || k === 'zIndex') {
          style[k] += v * percent;
        }
    }

    return style;
  }

  function gotoOverload(options, cb) {
    if (isFunction$3(options)) {
      cb = options;
      options = {};
    }

    return [options || {}, cb];
  }

  var uuid = 0;

  var Animation = /*#__PURE__*/function (_Event) {
    _inherits(Animation, _Event);

    var _super = _createSuper(Animation);

    function Animation(target, list, options) {
      var _this;

      _classCallCheck(this, Animation);

      _this = _super.call(this);
      _this.__id = uuid++;
      _this.__target = target;
      _this.__root = target.root;
      list = clone$1(list || []);

      if (Array.isArray(list)) {
        _this.__list = list.filter(function (item) {
          return item && isObject$1(item);
        });
      } // 动画过程另外一种形式，object描述k-v形式
      else if (list && isObject$1(list)) {
          var nl = [];
          Object.keys(list).forEach(function (k) {
            var v = list[k];

            if (Array.isArray(v)) {
              for (var i = 0, len = v.length; i < len; i++) {
                var o = nl[i] = nl[i] || {
                  offset: i / (len - 1)
                };
                o[k] = v[i];
              }
            }
          });
          _this.__list = nl;
        } else {
          _this.__list = [];
        }

      if (isNumber$1(options)) {
        _this.__options = {
          duration: options
        };
        options = _this.__options;
      }

      var op = _this.__options = options || {};
      _this.__duration = Math.max(0, parseFloat(op.duration) || 0);
      _this.delay = op.delay;
      _this.endDelay = op.endDelay;
      _this.iterations = op.iterations;
      _this.fps = op.fps;
      _this.fill = op.fill;
      _this.direction = op.direction;
      _this.playbackRate = op.playbackRate;
      _this.__easing = op.easing;
      _this.__playCount = 0;
      _this.spfLimit = op.spfLimit; // 定帧功能，不跳帧，每帧时间限制为最大spf

      _this.__frames = []; // 每帧数据

      _this.__framesR = []; // 存储反向播放的数据

      _this.__startTime = null;
      _this.currentTime = 0; // 当前播放时间点，不包括暂停时长，但包括delay、变速，以此定位动画处于何时

      _this.__nextTime = 0; // 下一帧刷新时间点，即currentTime下一帧被此赋值

      _this.__fpsTime = 0;
      _this.__playState = 'idle';
      _this.__isDestroyed = false;
      _this.__style = {};
      _this.__assigning = false; // 本帧动画是否正在影响赋值style，即在事件的before之后after之前

      _this.__init();

      return _this;
    }

    _createClass(Animation, [{
      key: "__init",
      value: function __init() {
        var iterations = this.iterations,
            duration = this.duration,
            list = this.list,
            easing = this.easing,
            target = this.target; // 执行次数小于1无需播放

        if (iterations < 1 || list.length < 1) {
          return;
        } // 过滤时间非法的，过滤后续offset<=前面的


        var offset = -1;
        var tagName = target.tagName;

        var _loop = function _loop(_i17, _len13) {
          var current = list[_i17];

          if (current.hasOwnProperty('offset')) {
            current.offset = parseFloat(current.offset) || 0;
            current.offset = Math.max(0, current.offset);
            current.offset = Math.min(1, current.offset); // 超过区间[0,1]

            if (isNaN(current.offset) || current.offset < 0 || current.offset > 1) {
              list.splice(_i17, 1);
              _i17--;
              _len13--;
              i = _i17;
              len = _len13;
              return "continue";
            } // <=前面的
            else if (current.offset <= offset) {
                list.splice(_i17, 1);
                _i17--;
                _len13--;
                i = _i17;
                len = _len13;
                return "continue";
              }
          }

          Object.keys(current).forEach(function (k) {
            if (abbr.hasOwnProperty(k)) {
              abbr.toFull(current, k);
            }
          }); // 检查key合法性

          Object.keys(current).forEach(function (k) {
            if (k !== 'easing' && k !== 'offset' && !o.isValid(tagName, k)) {
              delete current[k];
            }
          });
          i = _i17;
          len = _len13;
        };

        for (var i = 0, len = list.length; i < len; i++) {
          var _ret = _loop(i, len);

          if (_ret === "continue") continue;
        } // 只有1帧复制出来变成2帧方便运行


        if (list.length === 1) {
          list[0] = clone$1(list[0]);

          if (list[0].offset === 1) {
            list.unshift({
              offset: 0
            });
          } else {
            var copy = clone$1(list[0]);
            copy.offset = 1;
            list.push(copy);
          }
        } // 强制clone防止同引用
        else {
            list.forEach(function (item, i) {
              list[i] = clone$1(item);
            });
          } // 首尾时间偏移强制为[0, 1]，不是的话前后加空帧


        var first = list[0];

        if (first.hasOwnProperty('offset') && first.offset > 0) {
          first = {
            offset: 0
          };
          list.unshift(first);
        } else {
          first.offset = 0;
        }

        var last = list[list.length - 1];

        if (last.hasOwnProperty('offset') && last.offset < 1) {
          last = {
            offset: 1
          };
          list.push(last);
        } else {
          last.offset = 1;
        } // 计算没有设置offset的时间


        for (var _i18 = 1, _len14 = list.length; _i18 < _len14; _i18++) {
          var start = list[_i18]; // 从i=1开始offset一定>0，找到下一个有offset的，均分中间无声明的

          if (!start.hasOwnProperty('offset')) {
            var end = void 0;
            var j = _i18 + 1;

            for (; j < _len14; j++) {
              end = list[j];

              if (end.hasOwnProperty('offset')) {
                break;
              }
            }

            var num = j - _i18 + 1;
            start = list[_i18 - 1];
            var per = (end.offset - start.offset) / num;

            for (var k = _i18; k < j; k++) {
              var item = list[k];
              item.offset = start.offset + per * (k + 1 - _i18);
            }

            _i18 = j;
          }
        }

        var frames = []; // 换算每一关键帧样式标准化

        list.forEach(function (item) {
          frames.push(framing(item, duration, easing));
        });
        this.__frames = frames; // 为方便两帧之间计算变化，强制统一所有帧的css属性相同，没有写的为节点的当前样式currentStyle

        var keys = this.__keys = unify(frames, target);
        inherit(frames, keys, target); // 存储原本样式以便恢复用

        var style = target.style,
            props = target.props;
        var o$1 = this.__originStyle = {};
        keys.forEach(function (k) {
          if (o.isGeom(tagName, k)) {
            o$1[k] = props[k];
          }

          o$1[k] = style[k];
        }); // 再计算两帧之间的变化，存入transition属性

        var length = frames.length;
        var prev = frames[0];

        for (var _i19 = 1; _i19 < length; _i19++) {
          var next = frames[_i19];
          prev = calFrame(prev, next, keys, target);
        } // 反向存储帧的倒排结果


        var framesR = clone$1(frames).reverse();
        framesR.forEach(function (item) {
          item.time = duration - item.time;
          item.transition = [];
        });
        prev = framesR[0];

        for (var _i20 = 1; _i20 < length; _i20++) {
          var _next = framesR[_i20];
          prev = calFrame(prev, _next, keys, target);
        }

        this.__framesR = framesR;
      }
    }, {
      key: "__clean",
      value: function __clean(isFinish) {
        this.__cancelTask();

        this.__nextTime = 0;
        var restore;
        var style = this.style,
            duration = this.duration,
            iterations = this.iterations,
            keys = this.keys,
            target = this.target;

        if (isFinish) {
          this.__currentTime = this.delay + duration + this.endDelay;
          this.__playCount = iterations;
          this.__playState = 'finished'; // cancel需要清除finish根据情况保留

          if (!this.__stayEnd()) {
            this.__style = {};
            restore = true;
          }
        } else {
          this.__playCount = this.__currentTime = 0;
          this.__playState = 'idle';
          this.__style = {};
          restore = true;
        } // 动画取消结束不停留在最后一帧需要还原target原本的样式，需要对比目前是否是由本动画赋值的


        if (restore) {
          this.__currentFrames = undefined;
          this.__currentFrame = undefined;
          keys.forEach(function (k) {
            if (o.GEOM.hasOwnProperty(k)) {
              if (target.__currentProps[k] === style[k]) {
                target.__currentProps[k] = target.props[k];
              }
            } else {
              if (target.__currentStyle[k] === style[k]) {
                target.__currentStyle[k] = target.style[k];
              }
            }
          });
        }
      }
    }, {
      key: "__fin",
      value: function __fin(cb, diff) {
        // 防止重复触发
        if (!this.__hasFin) {
          this.__hasFin = true;
          this.__begin = this.__end = this.__isDelay = this.__finish = this.__inFps = this.__enterFrame = null;
          this.emit(Event.FINISH);
        }

        if (isFunction$3(cb)) {
          cb.call(this, diff);
        }
      }
    }, {
      key: "__frameCb",
      value: function __frameCb(diff, isDelay) {
        this.emit(Event.FRAME, diff, isDelay);

        if (this.__firstPlay) {
          this.__firstPlay = false;
          this.emit(Event.PLAY);
        }

        if (isFunction$3(this.__playCb)) {
          this.__playCb.call(this, diff, isDelay);

          this.__playCb = null;
        }
      }
    }, {
      key: "__calDiffTime",
      value: function __calDiffTime(diff) {
        var playbackRate = this.playbackRate,
            spfLimit = this.spfLimit,
            fps = this.fps;
        var v = this.__currentTime = this.__nextTime; // 定帧限制每帧时间间隔最大为spf

        if (spfLimit) {
          if (spfLimit === true) {
            diff = Math.min(diff, 1000 / fps);
          } else if (spfLimit > 0) {
            diff = Math.min(diff, spfLimit);
          }
        } // 播放时间累加，并且考虑播放速度加成


        if (playbackRate !== 1 && playbackRate > 0) {
          diff *= playbackRate;
        }

        this.__nextTime += diff;
        return v;
      }
    }, {
      key: "play",
      value: function play(cb) {
        var _this2 = this;

        var isDestroyed = this.isDestroyed,
            duration = this.duration,
            playState = this.playState,
            list = this.list;

        if (isDestroyed || duration <= 0 || list.length < 1) {
          return this;
        }

        if (playState === 'running') {
          return this;
        }

        this.__cancelTask();

        this.__playCb = cb;
        this.__playState = 'running'; // 每次play调用标识第一次运行，需响应play事件和回调

        this.__firstPlay = true; // 防止finish/cancel事件重复触发，每次播放重置

        this.__hasFin = false;
        this.__hasCancel = false;
        var firstEnter = true; // 只有第一次调用会进初始化，另外finish/cancel视为销毁也会重新初始化

        if (!this.__enterFrame) {
          var frames = this.frames,
              framesR = this.framesR,
              direction = this.direction,
              delay = this.delay,
              endDelay = this.endDelay,
              root = this.root; // 特殊优化缓存

          var length = frames.length,
              is2 = length === 2;
          var lastI, lastFrame, endTime, endTimeR;
          var isAlternate = {
            alternate: true,
            'alternate-reverse': true
          }.hasOwnProperty(direction); // 初始化根据方向确定帧序列

          var cfs = this.__currentFrames = {
            reverse: true,
            'alternate-reverse': true
          }.hasOwnProperty(direction) ? framesR : frames;

          if (is2) {
            endTime = cfs[1].time;
            endTimeR = 1 / endTime;
          } // delay/endDelay/fill/direction在播放后就不可变更，没播放可以修改


          var stayEnd = this.__stayEnd();

          var stayBegin = this.__stayBegin(); // 每次正常调用play都会从头开始，标识第一次enterFrame运行初始化


          this.__currentTime = this.__nextTime = this.__fpsTime = 0; // 每帧执行的回调，firstEnter只有初次计算时有，第一帧强制不跳帧

          var enterFrame = this.__enterFrame = {
            before: function before(diff) {
              var target = _this2.target,
                  fps = _this2.fps,
                  playCount = _this2.playCount,
                  iterations = _this2.iterations,
                  currentFrames = _this2.currentFrames; // 用本帧和上帧时间差，计算累加运行时间currentTime，以便定位当前应该处于哪个时刻

              var currentTime = _this2.__calDiffTime(diff); // 增加的fps功能，当<60时计算跳帧，每帧运行依旧累加时间，达到fps时重置，第一帧强制不跳


              if (!firstEnter && fps < 60) {
                diff = _this2.__fpsTime += diff;

                if (diff < 1000 / fps) {
                  _this2.__inFps = true;
                  return;
                }

                _this2.__fpsTime = 0;
              }

              firstEnter = false; // delay仅第一次生效

              if (playCount > 0) {
                delay = 0;
              } // 还没过前置delay
              else if (currentTime < delay) {
                  if (stayBegin) {
                    var _current = frames[0].style;
                    genBeforeRefresh(_current, _this2, root, target);
                  } // 即便不刷新，依旧执行begin和帧回调


                  if (currentTime === 0) {
                    _this2.__begin = true;
                  }

                  _this2.__isDelay = true;
                  return;
                } // 减去delay，计算在哪一帧


              currentTime -= delay;

              if (currentTime === 0) {
                _this2.__begin = true;
              } // 只有2帧可优化，否则2分查找当前帧


              var i;

              if (is2) {
                i = currentTime < endTime ? 0 : 1;
              } else {
                i = binarySearch(0, length - 1, currentTime, currentFrames);
              } // 索引不同再重设currentFrame


              var current;

              if (lastI !== i) {
                lastI = i;
                current = _this2.__currentFrame = lastFrame = currentFrames[i];
              } else {
                current = lastFrame;
              } // 最后一帧结束动画


              var isLastFrame = i === length - 1;
              var isLastCount = playCount >= iterations - 1;
              var inEndDelay;
              /** 这里要考虑全几种场景：
               * 1. 单次播放无endDelay且fill不停留（有/无差异，下同）
               * 2. 单次播放无endDelay且fill停留
               * 3. 单次播放有endDelay且fill不停留
               * 4. 单次播放有endDelay且fill停留
               * 5. 多次播放无endDelay且fill不停留（尾次/非尾次，下同）
               * 6. 多次播放无endDelay且fill停留
               * 7. 多次播放有endDelay且fill不停留
               * 8. 多次播放有endDelay且fill停留
               */

              if (isLastFrame) {
                // endDelay实际最后一次播放时生效，这里仅计算时间对比
                inEndDelay = currentTime < duration + endDelay; // 停留对比最后一帧，endDelay可能会多次进入这里，第二次进入样式相等不再重绘
                // 多次播放时到达最后一帧也会显示

                if (stayEnd || !isLastCount) {
                  current = current.style;
                } // 不停留或超过endDelay则计算还原，有endDelay且fill模式不停留会再次进入这里
                else {
                    current = _this2.__originStyle;
                  } // 非尾每轮次放完增加次数和计算下轮准备


                if (!isLastCount) {
                  _this2.__nextTime = currentTime - duration;
                  playCount = ++_this2.__playCount;
                  _this2.__nextBegin = true;
                } // 尾次考虑endDelay
                else if (!inEndDelay) {
                    _this2.__nextTime = 0;
                    playCount = ++_this2.__playCount; // 判断次数结束每帧enterFrame调用，inEndDelay时不结束

                    if (playCount >= iterations) {
                      frame.offFrame(enterFrame);
                    }
                  }
              } // 否则根据目前到下一帧的时间差，计算百分比，再反馈到变化数值上
              else if (is2) {
                  var percent = currentTime * endTimeR;
                  current = calIntermediateStyle(current, percent, target);
                } else {
                  var total = currentFrames[i + 1].time - current.time;

                  var _percent = (currentTime - current.time) / total;

                  current = calIntermediateStyle(current, _percent, target);
                } // 无论两帧之间是否有变化，都生成计算结果赋给style，去重在root做


              genBeforeRefresh(current, _this2, root, target); // 每次循环完触发end事件，最后一次循环触发finish

              if (isLastFrame && (!inEndDelay || isLastCount)) {
                _this2.__end = true;

                if (playCount >= iterations) {
                  _this2.__finish = true;

                  _this2.__clean(true);
                }
              }
            },
            after: function after(diff) {
              _this2.__assigning = false;

              if (_this2.__inFps) {
                _this2.__inFps = false;
                return;
              }

              _this2.__frameCb(diff, _this2.__isDelay);

              _this2.__isDelay = false;

              if (_this2.__begin) {
                _this2.__begin = false;

                _this2.emit(Event.BEGIN, _this2.playCount);
              }

              if (_this2.__end) {
                _this2.__end = false;

                _this2.emit(Event.END, _this2.playCount - 1); // 有正反播放需要重设帧序列


                if (isAlternate) {
                  var isEven = _this2.playCount % 2 === 0;

                  if (direction === 'alternate') {
                    _this2.__currentFrames = isEven ? frames : framesR;
                  } else {
                    _this2.__currentFrames = isEven ? framesR : frames;
                  }
                }
              }

              if (_this2.__finish) {
                _this2.__finish = false;

                _this2.__fin();
              }

              if (_this2.__nextBegin) {
                _this2.__nextBegin = false;
                _this2.__begin = true;
              }
            }
          };
        } // 添加每帧回调且立刻执行，本次执行调用refreshTask也是下一帧再渲染，frame的每帧都是下一帧


        frame.offFrame(this.__enterFrame);
        frame.onFrame(this.__enterFrame);
        this.__startTime = frame.__now;
        return this;
      }
    }, {
      key: "pause",
      value: function pause(silence) {
        var isDestroyed = this.isDestroyed,
            duration = this.duration,
            pending = this.pending;

        if (isDestroyed || duration <= 0 || pending) {
          return this;
        }

        this.__playState = 'paused';

        this.__cancelTask();

        if (!silence) {
          this.emit(Event.PAUSE);
        }

        return this;
      }
    }, {
      key: "resume",
      value: function resume(cb) {
        var isDestroyed = this.isDestroyed,
            duration = this.duration,
            playState = this.playState;

        if (isDestroyed || duration <= 0 || playState !== 'paused') {
          return this;
        }

        return this.play(cb);
      }
    }, {
      key: "finish",
      value: function finish(cb) {
        var self = this;
        var isDestroyed = self.isDestroyed,
            duration = self.duration,
            playState = self.playState,
            list = self.list;

        if (isDestroyed || duration <= 0 || list.length < 1 || playState === 'finished' || playState === 'idle') {
          return self;
        } // 先清除所有回调任务，多次调用finish也会清除只留最后一次


        self.__cancelTask();

        var root = self.root,
            frames = self.frames,
            __originStyle = self.__originStyle;

        if (root) {
          var current;

          if (self.__hasFin) {
            self.__fin(cb, 0);

            return self;
          } // 停留在最后一帧


          if (self.__stayEnd()) {
            current = frames[frames.length - 1].style;
          } else {
            current = __originStyle;
          }

          root.addRefreshTask({
            before: function before() {
              genBeforeRefresh(current, self, root, self.target);

              self.__clean(true);
            },
            after: function after(diff) {
              self.__assigning = false;

              self.__frameCb(diff);

              self.__fin(cb, diff);
            }
          });
        }

        return self;
      }
    }, {
      key: "cancel",
      value: function cancel(cb) {
        var self = this;
        var isDestroyed = self.isDestroyed,
            duration = self.duration,
            playState = self.playState,
            list = self.list;

        if (isDestroyed || duration <= 0 || playState === 'idle' || list.length < 1) {
          return self;
        }

        self.__cancelTask();

        var root = self.root,
            __originStyle = self.__originStyle;

        if (root) {
          if (self.__hasCancel) {
            if (isFunction$3(cb)) {
              cb.call(self, 0);
            }

            return self;
          }

          var task = function task(diff) {
            if (!self.__hasCancel) {
              self.__hasCancel = true;

              self.__cancelTask();

              self.__begin = self.__end = self.__isDelay = self.__finish = self.__inFps = self.__enterFrame = null;
              self.emit(Event.CANCEL);
            }

            if (isFunction$3(cb)) {
              cb.call(self, diff);
            }
          };

          root.addRefreshTask({
            before: function before() {
              genBeforeRefresh(__originStyle, self, root, self.target);

              self.__clean();
            },
            after: function after(diff) {
              self.__assigning = false;

              self.__frameCb(diff);

              task(diff);
            }
          });
        }

        return self;
      }
    }, {
      key: "gotoAndPlay",
      value: function gotoAndPlay(v, options, cb) {
        var isDestroyed = this.isDestroyed,
            duration = this.duration,
            delay = this.delay,
            endDelay = this.endDelay;

        if (isDestroyed || duration <= 0) {
          return this;
        }

        var _gotoOverload = gotoOverload(options, cb);

        var _gotoOverload2 = _slicedToArray(_gotoOverload, 2);

        options = _gotoOverload2[0];
        cb = _gotoOverload2[1];

        // 计算出时间点直接累加播放
        this.__goto(v, options.isFrame, options.excludeDelay);

        if (v > duration + delay + endDelay) {
          return this.finish(cb);
        }

        return this.play(cb);
      }
    }, {
      key: "gotoAndStop",
      value: function gotoAndStop(v, options, cb) {
        var _this3 = this;

        var isDestroyed = this.isDestroyed,
            duration = this.duration,
            delay = this.delay,
            endDelay = this.endDelay;

        if (isDestroyed || duration <= 0) {
          return this;
        }

        var _gotoOverload3 = gotoOverload(options, cb);

        var _gotoOverload4 = _slicedToArray(_gotoOverload3, 2);

        options = _gotoOverload4[0];
        cb = _gotoOverload4[1];
        v = this.__goto(v, options.isFrame, options.excludeDelay);

        if (v > duration + delay + endDelay) {
          return this.finish(cb);
        } // 先play一帧，回调里模拟暂停


        return this.play(function (diff) {
          _this3.__playState = 'paused';

          _this3.__cancelTask();

          if (isFunction$3(cb)) {
            cb.call(_this3, diff);
          }
        });
      } // 同步赋予，用在extendAnimate

    }, {
      key: "assignCurrentStyle",
      value: function assignCurrentStyle() {
        var style = this.style,
            target = this.target,
            keys = this.keys;
        keys.forEach(function (i) {
          if (style.hasOwnProperty(i)) {
            var v = style[i]; // geom的属性变化

            if (o.GEOM.hasOwnProperty(i)) {
              target.currentProps[i] = v;
            } // 样式
            else {
                // 将动画样式直接赋给currentStyle
                target.currentStyle[i] = v;
              }
          }
        });
      }
    }, {
      key: "__goto",
      value: function __goto(v, isFrame, excludeDelay) {
        var duration = this.duration,
            iterations = this.iterations,
            delay = this.delay;
        this.__playState = 'paused';

        this.__cancelTask();

        if (isNaN(v) || v < 0) {
          throw new Error('Param of gotoAnd(Play/Stop) is illegal: ' + v);
        }

        if (isFrame) {
          v = (v - 1) / this.spf;
        }

        if (excludeDelay) {
          v += delay;
        } // 超过时间长度需要累加次数


        while (v > duration && this.playCount < iterations - 1) {
          this.__playCount++;
          v -= duration;
        } // 在时间范围内设置好时间，复用play直接跳到播放点


        this.__nextTime = v;
        return v;
      }
    }, {
      key: "addControl",
      value: function addControl() {
        var ac = this.root.animateController;

        if (ac) {
          ac.add(this);
        }
      }
    }, {
      key: "removeControl",
      value: function removeControl() {
        var ac = this.root.animateController;

        if (ac) {
          ac.remove(this);
        }
      }
    }, {
      key: "__stayBegin",
      value: function __stayBegin() {
        return {
          backwards: true,
          both: true
        }.hasOwnProperty(this.fill);
      }
    }, {
      key: "__stayEnd",
      value: function __stayEnd() {
        return {
          forwards: true,
          both: true
        }.hasOwnProperty(this.fill);
      }
    }, {
      key: "__cancelTask",
      value: function __cancelTask() {
        frame.offFrame(this.__enterFrame);
        this.__playCb = null;
      }
    }, {
      key: "__destroy",
      value: function __destroy(sync) {
        var self = this;
        self.removeControl(); // clean异步执行，因为里面的样式还原需要等到下一帧，否则同步执行清除后，紧接着的新同步动画获取不到currentStyle

        if (sync) {
          self.__clean && self.__clean();
          self.__target = null;
        } else {
          frame.nextFrame({
            before: function before() {
              // 尚未初始化的清除
              self.__clean && self.__clean();
              self.__target = null;
            }
          });
        }

        self.__startTime = null;
        self.__isDestroyed = true;
      }
    }, {
      key: "id",
      get: function get() {
        return this.__id;
      }
    }, {
      key: "target",
      get: function get() {
        return this.__target;
      }
    }, {
      key: "root",
      get: function get() {
        return this.__root;
      }
    }, {
      key: "keys",
      get: function get() {
        return this.__keys;
      }
    }, {
      key: "style",
      get: function get() {
        return this.__style;
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
      key: "duration",
      get: function get() {
        return this.__duration;
      },
      set: function set(v) {
        this.__duration = Math.max(0, parseFloat(v) || 0);
      }
    }, {
      key: "delay",
      get: function get() {
        return this.__delay;
      },
      set: function set(v) {
        this.__delay = Math.max(0, parseFloat(v) || 0);
      }
    }, {
      key: "endDelay",
      get: function get() {
        return this.__endDelay;
      },
      set: function set(v) {
        this.__endDelay = Math.max(0, parseFloat(v) || 0);
      }
    }, {
      key: "fps",
      get: function get() {
        return this.__fps;
      },
      set: function set(v) {
        v = parseInt(v) || 60;

        if (v <= 0) {
          v = 60;
        }

        this.__fps = v;
      }
    }, {
      key: "spf",
      get: function get() {
        return 1 / this.fps;
      }
    }, {
      key: "iterations",
      get: function get() {
        return this.__iterations;
      },
      set: function set(v) {
        if (v === Infinity || util.isString(v) && v.toLowerCase() === 'infinity') {
          v = Infinity;
        } else {
          v = parseInt(v);

          if (isNaN(v) || v < 0) {
            v = 1;
          }
        }

        this.__iterations = v;
      }
    }, {
      key: "fill",
      get: function get() {
        return this.__fill;
      },
      set: function set(v) {
        this.__fill = v || 'none';

        if (this.playState === 'running') {
          this.pause(true);
          this.resume();
        }
      }
    }, {
      key: "direction",
      get: function get() {
        return this.__direction;
      },
      set: function set(v) {
        this.__direction = v || 'normal';

        if (this.playState === 'running') {
          this.pause(true);
          this.resume();
        }
      }
    }, {
      key: "frames",
      get: function get() {
        return this.__frames;
      }
    }, {
      key: "framesR",
      get: function get() {
        return this.__framesR;
      }
    }, {
      key: "playbackRate",
      get: function get() {
        return this.__playbackRate;
      },
      set: function set(v) {
        v = parseFloat(v) || 1;

        if (v <= 0) {
          v = 1;
        }

        this.__playbackRate = v;
      }
    }, {
      key: "easing",
      get: function get() {
        return this.__easing;
      }
    }, {
      key: "startTime",
      get: function get() {
        return this.__startTime;
      }
    }, {
      key: "currentTime",
      get: function get() {
        return this.__currentTime;
      },
      set: function set(v) {
        v = parseFloat(v) || 0;

        if (v >= 0) {
          this.__currentTime = this.__nextTime = v;
        }
      }
    }, {
      key: "pending",
      get: function get() {
        return this.playState !== 'running';
      }
    }, {
      key: "finished",
      get: function get() {
        return this.playState === 'finished';
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
      } // set playCount(v) {
      //   this.__playCount = Math.max(0, parseInt(v) || 0);
      // }

    }, {
      key: "isDestroyed",
      get: function get() {
        return this.__isDestroyed;
      }
    }, {
      key: "animating",
      get: function get() {
        var playState = this.playState;

        if (playState === 'idle') {
          return false;
        }

        return playState !== 'finished' || this.__stayEnd();
      }
    }, {
      key: "spfLimit",
      get: function get() {
        return this.__spfLimit;
      },
      set: function set(v) {
        if (util.isNumber(v) || /^\d/.test(v)) {
          this.__spfLimit = Math.max(v, parseInt(v) || 0);
        } else {
          this.__spfLimit = !!v;
        }
      }
    }, {
      key: "assigning",
      get: function get() {
        return this.__assigning;
      }
    }, {
      key: "currentFrames",
      get: function get() {
        return this.__currentFrames;
      }
    }, {
      key: "currentFrame",
      get: function get() {
        return this.__currentFrame;
      }
    }]);

    return Animation;
  }(Event);

  var ENUM = {
    // 低4位表示repaint级别
    NONE: 0,
    //                                          0
    TRANSLATE_X: 1,
    //                                   1
    TRANSLATE_Y: 2,
    //                                  10
    TRANSFORM: 4,
    //                                   100
    OPACITY: 8,
    //                                    1000
    FILTER: 16,
    //                                   10000
    VISIBILITY: 32,
    //                              100000
    REPAINT: 64,
    //                                1000000
    // 高位表示reflow
    REFLOW: 128 //                               10000000

  };
  var TRANSFORMS = {
    // translateX: true,
    // translateY: true,
    scaleX: true,
    scaleY: true,
    rotateZ: true,
    transform: true,
    transformOrigin: true
  };
  var o$1 = Object.assign({
    contain: function contain(lv, value) {
      return (lv & value) > 0;
    },

    /**
     * 得出等级
     * @param k
     * @returns {number|*}
     */
    getLevel: function getLevel(k) {
      if (o.isIgnore(k)) {
        return ENUM.NONE;
      }

      if (k === 'translateX') {
        return ENUM.TRANSLATE_X;
      } else if (k === 'translateY') {
        return ENUM.TRANSLATE_Y;
      } else if (TRANSFORMS.hasOwnProperty(k)) {
        return ENUM.TRANSFORM;
      } else if (k === 'opacity') {
        return ENUM.OPACITY;
      } else if (k === 'filter') {
        return ENUM.FILTER;
      }

      if (o.isRepaint(k)) {
        return ENUM.REPAINT;
      }

      return ENUM.REFLOW;
    },
    isReflow: function isReflow(lv) {
      return !this.isRepaint(lv);
    },
    isRepaint: function isRepaint(lv) {
      return lv < ENUM.REFLOW;
    }
  }, ENUM);
  o$1.TRANSFORMS = TRANSFORMS;

  var SIZE = [8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096];
  var NUMBER$3 = [8, 8, 8, 8, 8, 8, 8, 4, 2, 1];
  var MAX = 4096;
  var HASH = {};

  var Page = /*#__PURE__*/function () {
    function Page(size, number) {
      _classCallCheck(this, Page);

      this.__size = size;
      this.__number = number;
      this.__free = this.__total = number * number;
      size *= number;
      var offScreen = this.__canvas = inject.getCacheCanvas(size, size);

      if (offScreen) {
        this.__offScreen = offScreen;
      } // 1/0标识n*n个单元格是否空闲可用，一维数组表示


      this.__grid = [];

      for (var i = 0; i < this.__total; i++) {
        this.__grid.push(1);
      }
    }

    _createClass(Page, [{
      key: "add",
      value: function add() {
        var number = this.number,
            grid = this.grid;

        for (var i = 0; i < number; i++) {
          for (var j = 0; j < number; j++) {
            var index = i * number + j;

            if (grid[index]) {
              grid[index] = 0;
              this.__free--;
              return index;
            }
          }
        } // 理论不可能进入，除非bug


        throw new Error('Can not find free page');
      }
    }, {
      key: "del",
      value: function del(pos) {
        this.grid[pos] = 1;
        this.__free++;
      }
    }, {
      key: "getCoords",
      value: function getCoords(pos) {
        var size = this.size,
            number = this.number;
        var x = pos % number;
        var y = Math.floor(pos / number);
        return [x * size, y * size];
      }
    }, {
      key: "size",
      get: function get() {
        return this.__size;
      }
    }, {
      key: "number",
      get: function get() {
        return this.__number;
      }
    }, {
      key: "total",
      get: function get() {
        return this.__total;
      }
    }, {
      key: "free",
      get: function get() {
        return this.__free;
      }
    }, {
      key: "grid",
      get: function get() {
        return this.__grid;
      }
    }, {
      key: "offScreen",
      get: function get() {
        return this.__offScreen;
      }
    }, {
      key: "canvas",
      get: function get() {
        return this.offScreen.canvas;
      }
    }, {
      key: "ctx",
      get: function get() {
        return this.offScreen.ctx;
      }
    }], [{
      key: "getInstance",
      value: function getInstance(size) {
        if (size > MAX) {
          return;
        }

        var s = SIZE[0];
        var n = NUMBER$3[0]; // 使用刚好满足的尺寸

        for (var i = 0, len = SIZE.length; i < len; i++) {
          s = SIZE[i];
          n = NUMBER$3[i];

          if (SIZE[i] >= size) {
            break;
          }
        }

        var list = HASH[s] = HASH[s] || []; // 从hash列表中尝试取可用的一页，找不到就生成新的页

        var page;

        for (var _i = 0, _len = list.length; _i < _len; _i++) {
          var item = list[_i];

          if (item.free) {
            page = item;
            break;
          }
        }

        if (!page) {
          page = new Page(s, n);

          if (!page.offScreen) {
            console.error('Can not create off-screen for page');
            return;
          }

          list.push(page);
        }

        var pos = page.add();
        return {
          page: page,
          pos: pos
        };
      }
    }, {
      key: "MAX",
      set: function set(v) {
        var n = v;

        while (n > 2) {
          n = n % 2;
        }

        if (n !== 0) {
          console.error('Page max-size must be a multiple of 2');
          return;
        }

        if (v < 8) {
          console.error('Page max-size must >= 8');
          return;
        }

        MAX = v;
        n = 1;
        SIZE = [];
        NUMBER$3 = [];

        while (true) {
          SIZE.unshift(v);
          NUMBER$3.unshift(n);
          v >>= 1; // canvas太大初始化会卡，这里限制8个

          if (n < 8) {
            n <<= 1;
          }

          if (v < 8) {
            break;
          }
        }
      },
      get: function get() {
        return MAX;
      }
    }]);

    return Page;
  }();

  var Cache = /*#__PURE__*/function () {
    function Cache(w, h, bbox, page, pos) {
      _classCallCheck(this, Cache);

      this.__init(w, h, bbox, page, pos);
    }

    _createClass(Cache, [{
      key: "__init",
      value: function __init(w, h, bbox, page, pos) {
        this.__width = w;
        this.__height = h;
        this.__bbox = bbox;
        this.__page = page;
        this.__pos = pos;

        var _page$getCoords = page.getCoords(pos),
            _page$getCoords2 = _slicedToArray(_page$getCoords, 2),
            x = _page$getCoords2[0],
            y = _page$getCoords2[1]; // 四周各+1px的扩展


        this.__coords = [x + 1, y + 1];

        if (page.canvas) {
          this.__enabled = true;
          var ctx = page.ctx;
          ctx.setTransform([1, 0, 0, 1, 0, 0]);
          ctx.globalAlpha = 1;

          if (typeof karas !== 'undefined' && karas.debug) {
            page.canvas.setAttribute('size', page.size);
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.beginPath();
            ctx.rect(x + 1, y + 1, page.size - 2, page.size - 2);
            ctx.closePath();
            ctx.fill();
          }
        }
      }
    }, {
      key: "__appendData",
      value: function __appendData(x1, y1) {
        this.x1 = x1; // padding原点坐标

        this.y1 = y1;

        var _this$coords = _slicedToArray(this.coords, 2),
            xc = _this$coords[0],
            yc = _this$coords[1];

        var bbox = this.bbox;
        this.dx = xc - bbox[0]; // cache坐标和box原点的差值

        this.dy = yc - bbox[1];
        this.dbx = x1 - bbox[0];
        this.dby = y1 - bbox[1];
      }
    }, {
      key: "clear",
      value: function clear() {
        var ctx = this.ctx;

        if (this.enabled && ctx && this.available) {
          ctx.setTransform([1, 0, 0, 1, 0, 0]);

          var _this$coords2 = _slicedToArray(this.coords, 2),
              x = _this$coords2[0],
              y = _this$coords2[1];

          var size = this.page.size;
          ctx.clearRect(x - 1, y - 1, size, size);
        }

        this.__available = false;
      }
    }, {
      key: "release",
      value: function release() {
        if (this.enabled) {
          this.clear();
          this.page.del(this.pos);
          this.__page = null;
          this.__enabled = false;
        }
      }
    }, {
      key: "reset",
      value: function reset(bbox) {
        // 尺寸没变复用之前的并清空
        if (util.equalArr(this.bbox, bbox) && this.enabled) {
          this.clear();
          return;
        }

        this.release();
        var w = Math.ceil(bbox[2] - bbox[0]);
        var h = Math.ceil(bbox[3] - bbox[1]);
        w += 2;
        h += 2; // 防止边的精度问题四周各+1px，宽高即+2px

        var res = Page.getInstance(Math.max(w, h));

        if (!res) {
          this.__enabled = false;
          return;
        }

        var page = res.page,
            pos = res.pos;

        this.__init(w, h, bbox, page, pos);
      } // 是否功能可用，生成离屏canvas及尺寸超限

    }, {
      key: "enabled",
      get: function get() {
        return this.__enabled;
      } // 是否有可用缓存内容

    }, {
      key: "available",
      get: function get() {
        return this.enabled && this.__available;
      }
    }, {
      key: "bbox",
      get: function get() {
        return this.__bbox;
      }
    }, {
      key: "page",
      get: function get() {
        return this.__page;
      }
    }, {
      key: "canvas",
      get: function get() {
        return this.page.canvas;
      }
    }, {
      key: "ctx",
      get: function get() {
        return this.page.ctx;
      }
    }, {
      key: "size",
      get: function get() {
        return this.page.size;
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
      key: "pos",
      get: function get() {
        return this.__pos;
      }
    }, {
      key: "coords",
      get: function get() {
        return this.__coords;
      }
    }], [{
      key: "getInstance",
      value: function getInstance(bbox) {
        var w = Math.ceil(bbox[2] - bbox[0]);
        var h = Math.ceil(bbox[3] - bbox[1]);
        w += 2;
        h += 2; // 防止边的精度问题四周各+1px，宽高即+2px

        var res = Page.getInstance(Math.max(w, h));

        if (!res) {
          return;
        }

        var page = res.page,
            pos = res.pos;
        return new Cache(w, h, bbox, page, pos);
      }
    }, {
      key: "genMask",
      value: function genMask(cache) {
        var size = cache.size,
            x1 = cache.x1,
            y1 = cache.y1,
            width = cache.width,
            height = cache.height;
        var offScreen = inject.getCacheCanvas(width, height);
        offScreen.coords = [1, 1];
        offScreen.size = size;
        offScreen.x1 = x1;
        offScreen.y1 = y1;
        offScreen.dbx = cache.dbx;
        offScreen.dby = cache.dby;
        offScreen.width = width;
        offScreen.height = height;
        return offScreen;
      }
      /**
       * 复制cache的一块出来单独作为cacheFilter，尺寸边距保持一致，用webgl的滤镜
       * @param cache
       * @param v
       * @returns {{canvas: *, ctx: *, release(): void, available: boolean, draw()}}
       */

    }, {
      key: "genOffScreenBlur",
      value: function genOffScreenBlur(cache, v) {
        var _cache$coords = _slicedToArray(cache.coords, 2),
            x = _cache$coords[0],
            y = _cache$coords[1],
            size = cache.size,
            canvas = cache.canvas,
            x1 = cache.x1,
            y1 = cache.y1,
            width = cache.width,
            height = cache.height;

        var offScreen = inject.getCacheCanvas(width, height);
        offScreen.ctx.drawImage(canvas, x - 1, y - 1, width, height, 0, 0, width, height);
        offScreen.draw();
        var cacheFilter = inject.getCacheWebgl(width, height);
        blur.gaussBlur(offScreen, cacheFilter, v, width, height);
        cacheFilter.coords = [1, 1];
        cacheFilter.size = size;
        cacheFilter.x1 = x1;
        cacheFilter.y1 = y1;
        cacheFilter.dbx = cache.dbx;
        cacheFilter.dby = cache.dby;
        cacheFilter.width = width;
        cacheFilter.height = height;
        return cacheFilter;
      }
      /**
       * bbox变化时直接用老的cache内容重设bbox
       * @param cache
       * @param bbox
       */

    }, {
      key: "updateCache",
      value: function updateCache(cache, bbox) {
        var old = cache.bbox;

        if (!util.equalArr(bbox, old)) {
          var dx = old[0] - bbox[0];
          var dy = old[1] - bbox[1];
          var newCache = Cache.getInstance(bbox);

          if (newCache && newCache.enabled) {
            var _cache$coords2 = _slicedToArray(cache.coords, 2),
                ox = _cache$coords2[0],
                oy = _cache$coords2[1],
                canvas = cache.canvas,
                width = cache.width,
                height = cache.height;

            var _newCache$coords = _slicedToArray(newCache.coords, 2),
                nx = _newCache$coords[0],
                ny = _newCache$coords[1];

            newCache.x1 = cache.x1;
            newCache.y1 = cache.y1;
            newCache.dx = cache.dx + dx;
            newCache.dy = cache.dy + dy;
            newCache.dbx = cache.dbx + dx;
            newCache.dby = cache.dby + dy;
            newCache.ctx.drawImage(canvas, ox - 1, oy - 1, width, height, dx + nx - 1, dy + ny - 1, width, height);
            newCache.__available = true;
            cache.release();
            return newCache;
          }
        } else {
          return cache;
        }
      }
    }, {
      key: "drawCache",
      value: function drawCache(source, target, transform, matrix, tfo, inverse) {
        var _target$coords = _slicedToArray(target.coords, 2),
            tx = _target$coords[0],
            ty = _target$coords[1],
            x1 = target.x1,
            y1 = target.y1,
            ctx = target.ctx,
            dbx = target.dbx,
            dby = target.dby;

        var _source$coords = _slicedToArray(source.coords, 2),
            x = _source$coords[0],
            y = _source$coords[1],
            canvas = source.canvas,
            x12 = source.x1,
            y12 = source.y1,
            dbx2 = source.dbx,
            dby2 = source.dby,
            width = source.width,
            height = source.height;

        var dx = tx + x12 - x1 + dbx - dbx2;
        var dy = ty + y12 - y1 + dby - dby2;

        if (transform && matrix && tfo) {
          tfo[0] += dx;
          tfo[1] += dy;
          var m = tf.calMatrixByOrigin(transform, tfo);
          matrix = mx.multiply(matrix, m);

          if (inverse) {
            // 很多情况mask和target相同matrix，可简化计算
            if (util.equalArr(matrix, inverse)) {
              matrix = [1, 0, 0, 1, 0, 0];
            } else {
              inverse = mx.inverse(inverse);
              matrix = mx.multiply(matrix, inverse);
            }
          }

          ctx.setTransform.apply(ctx, _toConsumableArray(matrix));
        }

        ctx.drawImage(canvas, x - 1, y - 1, width, height, dx - 1, dy - 1, width, height);
      }
    }, {
      key: "drawMask",
      value: function drawMask(target, next, transform, tfo) {
        var cacheMask = Cache.genMask(target);
        var list = [];

        while (next && (next.isMask || next.isClip)) {
          list.push(next);
          next = next.next;
        }

        var _cacheMask$coords = _slicedToArray(cacheMask.coords, 2),
            x = _cacheMask$coords[0],
            y = _cacheMask$coords[1],
            ctx = cacheMask.ctx,
            dbx = cacheMask.dbx,
            dby = cacheMask.dby;

        tfo[0] += x + dbx;
        tfo[1] += y + dby;
        var inverse = tf.calMatrixByOrigin(transform, tfo); // 先将mask本身绘制到cache上，再设置模式绘制dom本身，因为都是img所以1个就够了

        list.forEach(function (item) {
          var cacheFilter = item.__cacheFilter,
              cache = item.__cache;
          var source = cacheFilter && cacheFilter.available && cacheFilter;

          if (!source) {
            source = cache && cache.available && cache;
          }

          if (source) {
            ctx.globalAlpha = item.__opacity;
            Cache.drawCache(source, cacheMask, item.computedStyle.transform, [1, 0, 0, 1, 0, 0], item.computedStyle.transformOrigin.slice(0), inverse);
          } else {
            console.error('CacheMask is oversize');
          }
        });
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-in';
        Cache.drawCache(target, cacheMask);
        ctx.globalCompositeOperation = 'source-over';
        cacheMask.draw(ctx);
        return cacheMask;
      }
    }]);

    return Cache;
  }();

  var AUTO$2 = unit.AUTO,
      PX$4 = unit.PX,
      PERCENT$5 = unit.PERCENT,
      STRING$2 = unit.STRING,
      INHERIT$3 = unit.INHERIT;
  var clone$2 = util.clone,
      int2rgba$2 = util.int2rgba,
      rgba2int$3 = util.rgba2int,
      equalArr$2 = util.equalArr,
      extend$1 = util.extend,
      joinArr$1 = util.joinArr;
  var calRelative$1 = css.calRelative;
  var canvasPolygon$1 = painter.canvasPolygon,
      svgPolygon$1 = painter.svgPolygon;
  var TRANSFORM_ALL = o$1.TRANSFORM | o$1.TRANSLATE_X | o$1.TRANSLATE_Y;

  function renderBorder(renderMode, points, color, ctx, xom, dx, dy) {
    if (renderMode === mode.CANVAS) {
      ctx.beginPath();

      if (ctx.fillStyle !== color) {
        ctx.fillStyle = color;
      }

      points.forEach(function (point) {
        canvasPolygon$1(ctx, point, dx, dy);
      });
      ctx.fill();
      ctx.closePath();
    } else if (renderMode === mode.SVG) {
      var s = '';
      points.forEach(function (point) {
        s += svgPolygon$1(point);
      });
      xom.virtualDom.bb.push({
        type: 'item',
        tagName: 'path',
        props: [['d', s], ['fill', color]]
      });
    }
  }

  function renderBgc(renderMode, color, x, y, w, h, ctx, xom, btw, brw, bbw, blw, btlr, btrr, bbrr, bblr) {
    var method = arguments.length > 16 && arguments[16] !== undefined ? arguments[16] : 'fill';
    // border-radius使用三次贝塞尔曲线模拟1/4圆角，误差在[0, 0.000273]之间
    var list = border.calRadius(x, y, w, h, btw, brw, bbw, blw, btlr, btrr, bbrr, bblr);

    if (renderMode === mode.CANVAS) {
      ctx.beginPath();

      if (ctx.fillStyle !== color) {
        ctx.fillStyle = color;
      }

      if (list) {
        canvasPolygon$1(ctx, list);
      } else {
        ctx.rect(x, y, w, h);
      }

      ctx[method]();
      ctx.closePath();
    } else if (renderMode === mode.SVG) {
      if (list) {
        var d = svgPolygon$1(list);
        xom.virtualDom.bb.push({
          type: 'item',
          tagName: 'path',
          props: [['d', d], ['fill', color]]
        });
      } else {
        xom.virtualDom.bb.push({
          type: 'item',
          tagName: 'rect',
          props: [['x', x], ['y', y], ['width', w], ['height', h], ['fill', color]]
        });
      }
    }
  }

  var borderRadiusKs = ['borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomRightRadius', 'borderBottomLeftRadius'];

  function calBorderRadius(w, h, currentStyle, computedStyle) {
    var noRadius = true;
    borderRadiusKs.forEach(function (k) {
      computedStyle[k] = currentStyle[k].map(function (item, i) {
        if (item.value > 0) {
          noRadius = false;
        } else {
          return 0;
        }

        if (item.unit === PX$4) {
          return Math.max(0, item.value);
        } else {
          return Math.max(0, item.value * (i ? h : w) * 0.01);
        }
      });
    }); // 优化提前跳出

    if (noRadius) {
      return;
    } // radius限制，相交的2个之和不能超过边长，如果2个都超过中点取中点，只有1个超过取交点，这包含了单个不能超过总长的逻辑


    borderRadiusKs.forEach(function (k, i) {
      var j = i % 2 === 0 ? 0 : 1;
      var target = j ? h : w;
      var prev = computedStyle[k];
      var next = computedStyle[borderRadiusKs[(i + 1) % 4]]; // 相加超过边长则是相交

      if (prev[j] + next[j] > target) {
        var half = target * 0.5; // 都超过一半中点取中点

        if (prev[j] >= half && next[j] >= half) {
          prev[j] = next[j] = half;
        } // 仅1个超过中点，因相交用总长减去另一方即可
        else if (prev[j] > half) {
            prev[j] = target - next[j];
          } else if (next[j] > half) {
            next[j] = target - prev[j];
          }
      }
    });
  }

  function calBackgroundSize(value, w, h) {
    var res = [];
    value.forEach(function (item, i) {
      if (item.unit === PX$4) {
        res.push(item.value);
      } else if (item.unit === PERCENT$5) {
        res.push(item.value * (i ? h : w) * 0.01);
      } else if (item.unit === AUTO$2) {
        res.push(-1);
      } else if (item.unit === STRING$2) {
        res.push(item.value === 'contain' ? -2 : -3);
      }
    });
    return res;
  }

  function calBackgroundPosition(position, container, size) {
    if (position.unit === PX$4) {
      return position.value;
    } else if (position.unit === PERCENT$5) {
      return (container - size) * position.value * 0.01;
    }

    return 0;
  }

  function renderBoxShadow(renderMode, ctx, defs, data, xom, x1, y1, x2, y2, x3, y3, x4, y4, outerWidth, outerHeight) {
    var _data = _slicedToArray(data, 6),
        x = _data[0],
        y = _data[1],
        blur = _data[2],
        spread = _data[3],
        color = _data[4],
        inset = _data[5];

    var c = int2rgba$2(color);
    var n = Math.abs(blur) * 2 + Math.abs(spread) * 2 + Math.abs(x) * 2 + Math.abs(y) * 2; // box本身坐标顺时针

    var box = [[x1, y1], [x4, y1], [x4, y4], [x1, y4], [x1, y1]]; // 算上各种偏移/扩散的最外层坐标，且逆时针

    var outer = [[x1 - n, y1 - n], [x1 - n, y4 + n], [x4 + n, y4 + n], [x4 + n, y1 - n], [x1 - n, y1 - n]];

    if (color[3] > 0 && (blur > 0 || spread > 0)) {
      if (renderMode === mode.CANVAS) {
        ctx.save();
        ctx.beginPath(); // inset裁剪box外面

        if (inset === 'inset') {
          var xa = x1 + x + spread;
          var ya = y1 + y + spread;
          var xb = x4 + x - spread;
          var yb = y4 + y - spread;
          var spreadBox = [[xa, ya], [xb, ya], [xb, yb], [xa, yb]]; // 是否相交判断需要绘制

          var cross = geom.getRectsIntersection([box[0][0], box[0][1], box[2][0], box[2][1]], [spreadBox[0][0], spreadBox[0][1], spreadBox[2][0], spreadBox[2][1]]);

          if (!cross) {
            return;
          }

          cross = [[cross[0], cross[1]], [cross[2], cross[1]], [cross[2], cross[3]], [cross[0], cross[3]], [cross[0], cross[1]]]; // 扩散区域类似边框填充

          if (spread) {
            canvasPolygon$1(ctx, cross);
            canvasPolygon$1(ctx, box.slice(0).reverse());
            ctx.clip();
            ctx.closePath();
            ctx.beginPath();

            if (ctx.fillStyle !== c) {
              ctx.fillStyle = c;
            }

            canvasPolygon$1(ctx, box);
            ctx.fill();
            ctx.closePath();
            ctx.restore();
            ctx.save();
            ctx.beginPath();
            canvasPolygon$1(ctx, cross);
            ctx.clip();
            ctx.closePath();
            ctx.beginPath();

            if (ctx.fillStyle !== '#FFF') {
              ctx.fillStyle = '#FFF';
            }

            ctx.shadowColor = c;
            ctx.shadowBlur = blur; // 画在外围的空心矩形，宽度要比blur大，n考虑了这一情况取了最大值

            canvasPolygon$1(ctx, [[xa, ya], [xb, ya], [xb, yb], [x1 - n, yb], [x1 - n, y4 + n], [x4 + n, y4 + n], [x4 + n, y1 - n], [x1 - n, y1 - n], [x1 - n, yb], [xa, yb], [xa, ya]]);
          } else {
            canvasPolygon$1(ctx, box);
            ctx.clip();
            ctx.closePath();
            ctx.beginPath();

            if (ctx.fillStyle !== '#FFF') {
              ctx.fillStyle = '#FFF';
            }

            ctx.shadowOffsetX = x;
            ctx.shadowOffsetY = y;
            ctx.shadowColor = c;
            ctx.shadowBlur = blur;
            canvasPolygon$1(ctx, [[x1, y1], [x4, y1], [x4, y4], [x1 - n, y4], [x1 - n, y4 + n], [x4 + n, y4 + n], [x4 + n, y1 - n], [x1 - n, y1 - n], [x1 - n, y4], [x1, y4], [x1, y1]]);
          }
        } // outset需裁减掉box本身的内容，clip()非零环绕显示box外的阴影内容，fill()绘制在内无效
        else {
            var _xa = x1 + x - spread;

            var _ya = y1 + y - spread;

            var _xb = x4 + x + spread;

            var _yb = y4 + y + spread;

            var blurBox = [[_xa, _ya], [_xb, _ya], [_xb, _yb], [_xa, _yb]];

            var _cross = geom.getRectsIntersection([box[0][0], box[0][1], box[2][0], box[2][1]], [blurBox[0][0], blurBox[0][1], blurBox[2][0], blurBox[2][1]]); // 分为是否有spread，因模糊成本spread区域将没有模糊


            if (spread) {
              // 扩散区域类似边框填充
              canvasPolygon$1(ctx, box);
              canvasPolygon$1(ctx, blurBox.slice(0).reverse());
              ctx.clip();
              ctx.closePath();
              ctx.beginPath();

              if (ctx.fillStyle !== c) {
                ctx.fillStyle = c;
              }

              canvasPolygon$1(ctx, blurBox);
              ctx.fill();
              ctx.closePath();
              ctx.restore();
              ctx.save();
              ctx.beginPath(); // 阴影部分看相交情况裁剪，有相交时逆时针绘制相交区域即可排除之

              if (_cross) {
                canvasPolygon$1(ctx, [[_cross[0], _cross[1]], [_cross[2], _cross[1]], [_cross[2], _cross[3]], [_cross[0], _cross[3]], [_cross[0], _cross[1]]].reverse());
              }

              canvasPolygon$1(ctx, box);
              canvasPolygon$1(ctx, blurBox);
              canvasPolygon$1(ctx, outer);
              ctx.clip();
              ctx.closePath();
              ctx.beginPath();

              if (ctx.fillStyle !== '#FFF') {
                ctx.fillStyle = '#FFF';
              }

              ctx.shadowColor = c;
              ctx.shadowBlur = blur;
              canvasPolygon$1(ctx, blurBox);
            } else {
              canvasPolygon$1(ctx, box);
              canvasPolygon$1(ctx, outer);
              ctx.clip();
              ctx.closePath();
              ctx.beginPath();

              if (ctx.fillStyle !== '#FFF') {
                ctx.fillStyle = '#FFF';
              }

              ctx.shadowOffsetX = x;
              ctx.shadowOffsetY = y;
              ctx.shadowColor = c;
              ctx.shadowBlur = blur;
              canvasPolygon$1(ctx, box);
            }
          }

        ctx.fill();
        ctx.closePath();
        ctx.restore();
      } else if (renderMode === mode.SVG) {
        var d = mx.int2convolution(blur);

        if (inset === 'inset') {
          var _xa2 = x1 + x + spread;

          var _ya2 = y1 + y + spread;

          var _xb2 = x4 + x - spread;

          var _yb2 = y4 + y - spread;

          var _spreadBox = [[_xa2, _ya2], [_xb2, _ya2], [_xb2, _yb2], [_xa2, _yb2]];

          var _cross2 = geom.getRectsIntersection([box[0][0], box[0][1], box[2][0], box[2][1]], [_spreadBox[0][0], _spreadBox[0][1], _spreadBox[2][0], _spreadBox[2][1]]);

          if (!_cross2) {
            return;
          }

          _cross2 = [[_cross2[0], _cross2[1]], [_cross2[2], _cross2[1]], [_cross2[2], _cross2[3]], [_cross2[0], _cross2[3]], [_cross2[0], _cross2[1]]];

          if (spread) {
            var filter = defs.add({
              tagName: 'filter',
              props: [['x', -d / outerWidth], ['y', -d / outerHeight], ['width', 1 + d * 2 / outerWidth], ['height', 1 + d * 2 / outerHeight]],
              children: [{
                tagName: 'feDropShadow',
                props: [['dx', 0], ['dy', 0], ['stdDeviation', blur * 0.5], ['flood-color', c]]
              }]
            });
            var clip = defs.add({
              tagName: 'clipPath',
              children: [{
                tagName: 'path',
                props: [['d', svgPolygon$1(_cross2) + svgPolygon$1(box.slice(0).reverse())], ['fill', '#FFF']]
              }]
            });
            xom.virtualDom.bb.push({
              type: 'item',
              tagName: 'path',
              props: [['d', svgPolygon$1(box)], ['fill', c], ['clip-path', 'url(#' + clip + ')']]
            });
            clip = defs.add({
              tagName: 'clipPath',
              children: [{
                tagName: 'path',
                props: [['d', svgPolygon$1(_cross2)], ['fill', '#FFF']]
              }]
            });
            xom.virtualDom.bb.push({
              type: 'item',
              tagName: 'path',
              props: [['d', svgPolygon$1([[_xa2, _ya2], [_xb2, _ya2], [_xb2, _yb2], [x1 - n, _yb2], [x1 - n, y4 + n], [x4 + n, y4 + n], [x4 + n, y1 - n], [x1 - n, y1 - n], [x1 - n, _yb2], [_xa2, _yb2], [_xa2, _ya2]])], ['fill', '#FFF'], ['filter', 'url(#' + filter + ')'], ['clip-path', 'url(#' + clip + ')']]
            });
          } else {
            var _filter = defs.add({
              tagName: 'filter',
              props: [['x', -d / outerWidth], ['y', -d / outerHeight], ['width', 1 + d * 2 / outerWidth], ['height', 1 + d * 2 / outerHeight]],
              children: [{
                tagName: 'feDropShadow',
                props: [['dx', x], ['dy', y], ['stdDeviation', blur * 0.5], ['flood-color', c]]
              }]
            });

            var _clip = defs.add({
              tagName: 'clipPath',
              children: [{
                tagName: 'path',
                props: [['d', svgPolygon$1(box)], ['fill', '#FFF']]
              }]
            });

            xom.virtualDom.bb.push({
              type: 'item',
              tagName: 'path',
              props: [['d', svgPolygon$1([[x1, y1], [x4, y1], [x4, y4], [x1 - n, y4], [x1 - n, y4 + n], [x4 + n, y4 + n], [x4 + n, y1 - n], [x1 - n, y1 - n], [x1 - n, y4], [x1, y4], [x1, y1]])], ['fill', '#FFF'], ['filter', 'url(#' + _filter + ')'], ['clip-path', 'url(#' + _clip + ')']]
            });
          }
        } else {
          var _xa3 = x1 + x - spread;

          var _ya3 = y1 + y - spread;

          var _xb3 = x4 + x + spread;

          var _yb3 = y4 + y + spread;

          var _blurBox = [[_xa3, _ya3], [_xb3, _ya3], [_xb3, _yb3], [_xa3, _yb3]];

          var _cross3 = geom.getRectsIntersection([box[0][0], box[0][1], box[2][0], box[2][1]], [_blurBox[0][0], _blurBox[0][1], _blurBox[2][0], _blurBox[2][1]]);

          if (spread) {
            var _filter2 = defs.add({
              tagName: 'filter',
              props: [['x', -d / outerWidth], ['y', -d / outerHeight], ['width', 1 + d * 2 / outerWidth], ['height', 1 + d * 2 / outerHeight]],
              children: [{
                tagName: 'feDropShadow',
                props: [['dx', 0], ['dy', 0], ['stdDeviation', blur * 0.5], ['flood-color', c]]
              }]
            });

            var _clip2 = defs.add({
              tagName: 'clipPath',
              children: [{
                tagName: 'path',
                props: [['d', svgPolygon$1(box) + svgPolygon$1(_blurBox.slice(0).reverse())], ['fill', '#FFF']]
              }]
            });

            xom.virtualDom.bb.push({
              type: 'item',
              tagName: 'path',
              props: [['d', svgPolygon$1(_blurBox)], ['fill', c], ['clip-path', 'url(#' + _clip2 + ')']]
            });
            _clip2 = defs.add({
              tagName: 'clipPath',
              children: [{
                tagName: 'path',
                props: [['d', (_cross3 ? svgPolygon$1([[_cross3[0], _cross3[1]], [_cross3[2], _cross3[1]], [_cross3[2], _cross3[3]], [_cross3[0], _cross3[3]], [_cross3[0], _cross3[1]]].reverse()) : '') + svgPolygon$1(box) + svgPolygon$1(_blurBox) + svgPolygon$1(outer)], ['fill', '#FFF']]
              }]
            });
            xom.virtualDom.bb.push({
              type: 'item',
              tagName: 'path',
              props: [['d', svgPolygon$1(_blurBox)], ['fill', '#FFF'], ['filter', 'url(#' + _filter2 + ')'], ['clip-path', 'url(#' + _clip2 + ')']]
            });
          } else {
            var _filter3 = defs.add({
              tagName: 'filter',
              props: [['x', -d / outerWidth], ['y', -d / outerHeight], ['width', 1 + d * 2 / outerWidth], ['height', 1 + d * 2 / outerHeight]],
              children: [{
                tagName: 'feDropShadow',
                props: [['dx', x], ['dy', y], ['stdDeviation', blur * 0.5], ['flood-color', c]]
              }]
            });

            var _clip3 = defs.add({
              tagName: 'clipPath',
              children: [{
                tagName: 'path',
                props: [['d', svgPolygon$1(box) + svgPolygon$1(outer)], ['fill', '#FFF']]
              }]
            });

            xom.virtualDom.bb.push({
              type: 'item',
              tagName: 'path',
              props: [['d', svgPolygon$1(box)], ['fill', '#FFF'], ['filter', 'url(#' + _filter3 + ')'], ['clip-path', 'url(#' + _clip3 + ')']]
            });
          }
        }
      }
    }
  }

  function empty() {}

  var Xom = /*#__PURE__*/function (_Node) {
    _inherits(Xom, _Node);

    var _super = _createSuper(Xom);

    function Xom(tagName) {
      var _this;

      var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, Xom);

      _this = _super.call(this); // 构建工具中都是arr，手写可能出现hash情况

      if (Array.isArray(props)) {
        _this.props = util.arr2hash(props);
      } else {
        _this.props = props;
      }

      _this.__tagName = tagName;
      _this.__style = _this.props.style || {}; // style被解析后的k-v形式

      _this.__currentStyle = {}; // 动画过程中绘制一开始会merge动画样式

      _this.__computedStyle = {}; // 类似getComputedStyle()将currentStyle计算好数值赋给

      _this.__listener = {};
      _this.__refreshLevel = o$1.REFLOW;
      Object.keys(_this.props).forEach(function (k) {
        var v = _this.props[k];

        if (/^on[a-zA-Z]/.test(k)) {
          k = k.slice(2).toLowerCase();
          _this.listener[k] = v;
        }
      });
      _this.__animationList = [];
      _this.__loadBgi = {
        // 刷新回调函数，用以destroy取消用
        cb: function cb() {}
      };
      _this.__cacheStyle = {}; // 是否缓存重新计算computedStyle的样式key

      return _this;
    } // 获取margin/padding的实际值


    _createClass(Xom, [{
      key: "__mp",
      value: function __mp(currentStyle, computedStyle, w) {
        var _this2 = this;

        ['Top', 'Right', 'Bottom', 'Left'].forEach(function (k) {
          var a = 'margin' + k;
          var b = 'padding' + k;
          computedStyle[a] = _this2.__mpWidth(currentStyle[a], w);
          computedStyle[b] = _this2.__mpWidth(currentStyle[b], w);
        });
      }
    }, {
      key: "__mpWidth",
      value: function __mpWidth(mp, w) {
        if (mp.unit === PX$4) {
          return mp.value;
        } else if (mp.unit === PERCENT$5) {
          return mp.value * w * 0.01;
        }

        return 0;
      } // absolute且无尺寸时，isVirtual标明先假布局一次计算尺寸，比如flex列计算时

    }, {
      key: "__layout",
      value: function __layout(data, isVirtual, fromAbs) {
        css.computeReflow(this, this.isShadowRoot);
        var w = data.w;
        var isDestroyed = this.isDestroyed,
            currentStyle = this.currentStyle,
            computedStyle = this.computedStyle;
        var display = currentStyle.display,
            width = currentStyle.width,
            position = currentStyle.position;
        this.__refreshLevel = o$1.REFLOW;

        this.__cancelCache();

        this.__layoutData = clone$2(data);

        if (isDestroyed || display === 'none') {
          this.__width = this.__height = computedStyle.width = computedStyle.height = 0;
          return;
        } // margin/padding在abs前已经计算过了，无需二次计算


        if (!fromAbs) {
          this.__mp(currentStyle, computedStyle, w);
        }

        if (width.unit !== AUTO$2) {
          switch (width.unit) {
            case PX$4:
              w = width.value;
              break;

            case PERCENT$5:
              w *= width.value * 0.01;
              break;
          }
        }

        this.__ox = this.__oy = 0; // 3种布局，默认block

        if (display === 'flex') {
          this.__layoutFlex(data, isVirtual);
        } else if (display === 'inline') {
          this.__layoutInline(data, isVirtual);
        } else {
          this.__layoutBlock(data, isVirtual);
        } // relative渲染时做偏移，百分比基于父元素，若父元素没有定高则为0


        if (position === 'relative') {
          var top = currentStyle.top,
              right = currentStyle.right,
              bottom = currentStyle.bottom,
              left = currentStyle.left;
          var parent = this.parent;

          if (top.unit !== AUTO$2) {
            var n = calRelative$1(currentStyle, 'top', top, parent);

            this.__offsetY(n);

            computedStyle.top = n;
            computedStyle.bottom = 'auto';
          } else if (bottom.unit !== AUTO$2) {
            var _n = calRelative$1(currentStyle, 'bottom', bottom, parent);

            this.__offsetY(-_n);

            computedStyle.bottom = _n;
            computedStyle.top = 'auto';
          } else {
            computedStyle.top = computedStyle.bottom = 'auto';
          }

          if (left.unit !== AUTO$2) {
            var _n2 = calRelative$1(currentStyle, 'left', left, parent, true);

            this.__offsetX(_n2);

            computedStyle.left = _n2;
            computedStyle.right = 'auto';
          } else if (right.unit !== AUTO$2) {
            var _n3 = calRelative$1(currentStyle, 'right', right, parent, true);

            this.__offsetX(-_n3);

            computedStyle.right = _n3;
            computedStyle.left = 'auto';
          } else {
            computedStyle.left = computedStyle.right = 'auto';
          }
        } else if (currentStyle.position !== 'absolute') {
          computedStyle.top = computedStyle.bottom = computedStyle.left = computedStyle.right = 'auto';
        } // 计算结果存入computedStyle


        computedStyle.width = this.width;
        computedStyle.height = this.height; // 动态json引用时动画暂存，第一次布局时处理这些动画到root的animateController上

        var ar = this.__animateRecords;

        if (ar) {
          this.__animateRecords = null; // parse没有dom时，animate的target引用都是json，vd后生成需重新赋值

          ar.list.forEach(function (item) {
            if (item.target.vd instanceof Xom) {
              item.target = item.target.vd;
            }
          });
          var ac = ar.controller || this.root.animateController; // 不自动播放进入记录列表，等待手动调用

          if (ar.options && ar.options.autoPlay === false) {
            ac.__records = ac.__records.concat(ar.list);
          } // 自动播放进入列表开始播放
          else {
              ac.__auto = ac.__auto.concat(ar.list);

              ac.__playAuto();
            }
        }
      } // 预先计算是否是固定宽高，布局点位和尺寸考虑margin/border/padding

    }, {
      key: "__preLayout",
      value: function __preLayout(data) {
        var x = data.x,
            y = data.y,
            w = data.w,
            h = data.h,
            w2 = data.w2,
            h2 = data.h2;
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
        var fixedHeight; // 绝对定位是left+right这种其实等于定义了width，但不能修改原始style，存入特殊变量标识

        if (w2 !== undefined) {
          fixedWidth = true;
          w = w2;
        } else if (width.unit !== AUTO$2) {
          fixedWidth = true;

          switch (width.unit) {
            case PX$4:
              w = width.value;
              break;

            case PERCENT$5:
              w *= width.value * 0.01;
              break;
          }
        }

        if (h2 !== undefined) {
          fixedHeight = true;
          h = h2;
        } else if (height.unit !== AUTO$2) {
          fixedHeight = true;

          switch (height.unit) {
            case PX$4:
              h = height.value;
              break;

            case PERCENT$5:
              h *= height.value * 0.01;
              break;
          }
        } // margin/padding/border影响x和y和尺寸


        x += borderLeftWidth + marginLeft + paddingLeft;
        data.x = x;
        y += borderTopWidth + marginTop + paddingTop;
        data.y = y;

        if (width.unit === AUTO$2) {
          w -= borderLeftWidth + borderRightWidth + marginLeft + marginRight + paddingLeft + paddingRight;
        }

        if (height.unit === AUTO$2) {
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
      } // 处理margin:xx auto居中对齐或右对齐

    }, {
      key: "__marginAuto",
      value: function __marginAuto(style, data) {
        var position = style.position,
            marginLeft = style.marginLeft,
            marginRight = style.marginRight,
            width = style.width;

        if (position !== 'absolute' && width !== AUTO$2 && marginLeft.unit === AUTO$2 && marginRight.unit === AUTO$2) {
          var ow = this.outerWidth;

          if (ow < data.w) {
            this.__offsetX((data.w - ow) * 0.5, true);
          }
        }
      }
    }, {
      key: "__calCache",
      value: function __calCache(renderMode, lv, ctx, defs, parent, __cacheStyle, currentStyle, computedStyle, sx, sy, innerWidth, innerHeight, outerWidth, outerHeight, borderTopWidth, borderRightWidth, borderBottomWidth, borderLeftWidth, x1, x2, x3, x4, y1, y2, y3, y4) {
        var _this3 = this;

        var matrixCache = __cacheStyle.matrix; // tx/ty变化特殊优化

        if (matrixCache && lv < o$1.REFLOW && !o$1.contain(lv, o$1.TRANSFORM)) {
          var x = 0,
              y = 0;

          if (o$1.contain(lv, o$1.TRANSLATE_X)) {
            var v = currentStyle.translateX;

            if (util.isNil(v)) {
              v = 0;
            } else if (v.unit === PERCENT$5) {
              v = v.value * this.outerWidth * 0.01;
            } else {
              v = v.value;
            }

            x = v - (computedStyle.translateX || 0);
            computedStyle.translateX = v;
          }

          if (o$1.contain(lv, o$1.TRANSLATE_Y)) {
            var _v = currentStyle.translateY;

            if (util.isNil(_v)) {
              _v = 0;
            } else if (_v.unit === PERCENT$5) {
              _v = _v.value * this.outerHeight * 0.01;
            } else {
              _v = _v.value;
            }

            y = _v - (computedStyle.translateY || 0);
            computedStyle.translateY = _v;
          }

          matrixCache[4] += x;
          matrixCache[5] += y;
          __cacheStyle.matrix = matrixCache;
        } // 先根据cache计算需要重新计算的computedStyle
        else {
            if (__cacheStyle.transformOrigin === undefined) {
              __cacheStyle.transformOrigin = true;
              matrixCache = null;
              computedStyle.transformOrigin = tf.calOrigin(currentStyle.transformOrigin, outerWidth, outerHeight);
            }

            if (__cacheStyle.transform === undefined || __cacheStyle.translateX === undefined || __cacheStyle.translateY === undefined || __cacheStyle.rotateZ === undefined || __cacheStyle.scaleX === undefined || __cacheStyle.scaleY === undefined || __cacheStyle.skewX === undefined || __cacheStyle.skewY === undefined) {
              __cacheStyle.transform = __cacheStyle.translateX = __cacheStyle.translateY = __cacheStyle.rotateZ = __cacheStyle.scaleX = __cacheStyle.scaleY = __cacheStyle.skewX = __cacheStyle.skewY = true;
              matrixCache = null;
              var matrix; // transform相对于自身

              if (currentStyle.transform) {
                matrix = tf.calMatrix(currentStyle.transform, outerWidth, outerHeight);
              } // 没有transform则看是否有扩展的css独立变换属性
              else {
                  var temp = [];
                  ['translateX', 'translateY', 'rotateZ', 'rotate', 'skewX', 'skewY', 'scaleX', 'scaleY'].forEach(function (k) {
                    var v = currentStyle[k];

                    if (util.isNil(v)) {
                      return;
                    }

                    computedStyle[k] = v.value; // scale为1和其它为0避免计算浪费

                    var isScale = k.indexOf('scale') > -1;

                    if (v.value === 1 && isScale || !isScale && v.value === 0) {
                      return;
                    }

                    if (v.unit === PERCENT$5) {
                      if (k === 'translateX') {
                        computedStyle[k] = v.value * outerWidth * 0.01;
                      } else if (k === 'translateY') {
                        computedStyle[k] = v.value * outerHeight * 0.01;
                      }
                    }

                    temp.push([k, v]);
                  });

                  if (temp.length) {
                    matrix = tf.calMatrix(temp, outerWidth, outerHeight);
                  }
                }

              this.__matrix = computedStyle.transform = matrix || [1, 0, 0, 1, 0, 0];
            }
          }

        if (lv >= o$1.REPAINT) {
          if (__cacheStyle.backgroundPositionX === undefined) {
            __cacheStyle.backgroundPositionX = true;
            var backgroundPositionX = currentStyle.backgroundPositionX;
            computedStyle.backgroundPositionX = backgroundPositionX.unit === PX$4 ? backgroundPositionX.value : backgroundPositionX.value * innerWidth + '%';
          }

          if (__cacheStyle.backgroundPositionY === undefined) {
            __cacheStyle.backgroundPositionY = true;
            var backgroundPositionY = currentStyle.backgroundPositionY;
            computedStyle.backgroundPositionY = backgroundPositionY.unit === PX$4 ? backgroundPositionY.value : backgroundPositionY.value * innerWidth + '%';
          }

          if (__cacheStyle.backgroundSize === undefined) {
            __cacheStyle.backgroundSize = true;
            computedStyle.backgroundSize = calBackgroundSize(currentStyle.backgroundSize, innerWidth, innerHeight);
          }

          if (__cacheStyle.backgroundImage === undefined) {
            var backgroundImage = computedStyle.backgroundImage = currentStyle.backgroundImage; // 防止隐藏不加载背景图

            if (util.isString(backgroundImage)) {
              __cacheStyle.backgroundImage = true;
              var loadBgi = this.__loadBgi;
              var cache = inject.IMG[backgroundImage];

              if (cache && cache.state === inject.LOADED) {
                loadBgi.url = backgroundImage;
                loadBgi.source = cache.source;
                loadBgi.width = cache.width;
                loadBgi.height = cache.height;
              }

              if (loadBgi.url !== backgroundImage) {
                // 可能改变导致多次加载，每次清空，成功后还要比对url是否相同
                loadBgi.url = backgroundImage;
                loadBgi.source = null;
                inject.measureImg(backgroundImage, function (data) {
                  // 还需判断url，防止重复加载时老的替换新的，失败不绘制bgi
                  if (data.success && data.url === loadBgi.url && !_this3.__isDestroyed) {
                    loadBgi.source = data.source;
                    loadBgi.width = data.width;
                    loadBgi.height = data.height;
                    var node = _this3;
                    var root = node.root;
                    root.delRefreshTask(loadBgi.cb);
                    root.addRefreshTask(loadBgi.cb = {
                      before: function before() {
                        root.__addUpdate({
                          node: node,
                          focus: o$1.REPAINT
                        });
                      }
                    });
                  }
                }, {
                  width: innerWidth,
                  height: innerHeight
                });
              }
            } else if (backgroundImage && backgroundImage.k) {
              __cacheStyle.backgroundImage = this.__gradient(renderMode, ctx, defs, x2, y2, x3, y3, innerWidth, innerHeight, backgroundImage);
            }
          }

          if (__cacheStyle.boxShadow === undefined) {
            __cacheStyle.boxShadow = true;
            computedStyle.boxShadow = currentStyle.boxShadow;
          } // 这些直接赋值的不需要再算缓存


          ['opacity', 'zIndex', 'borderTopStyle', 'borderRightStyle', 'borderBottomStyle', 'borderLeftStyle', 'backgroundRepeat', 'filter'].forEach(function (k) {
            computedStyle[k] = currentStyle[k];
          });
          ['backgroundColor', 'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor'].forEach(function (k) {
            if (__cacheStyle[k] === undefined) {
              __cacheStyle[k] = int2rgba$2(computedStyle[k] = currentStyle[k].value);
            }
          }); // 圆角边计算

          if (__cacheStyle.borderTopLeftRadius === undefined || __cacheStyle.borderTopRightRadius === undefined || __cacheStyle.borderBottomRightRadius === undefined || __cacheStyle.borderBottomLeftRadius === undefined) {
            __cacheStyle.borderTopLeftRadius = __cacheStyle.borderTopRightRadius = __cacheStyle.borderBottomRightRadius = __cacheStyle.borderBottomLeftRadius = true;
            calBorderRadius(outerWidth, outerHeight, currentStyle, computedStyle);
            ['Top', 'Right', 'Bottom', 'Left'].forEach(function (k) {
              __cacheStyle['border' + k] = undefined;
            });
          }

          var borderTopLeftRadius = computedStyle.borderTopLeftRadius,
              borderTopRightRadius = computedStyle.borderTopRightRadius,
              borderBottomRightRadius = computedStyle.borderBottomRightRadius,
              borderBottomLeftRadius = computedStyle.borderBottomLeftRadius; // width/style/radius影响border，color不影响渲染缓存

          ['Top', 'Right', 'Bottom', 'Left'].forEach(function (k) {
            var k2 = 'border' + k;
            var kw = k2 + 'Width';
            var ks = k2 + 'Style';

            if (__cacheStyle[kw] === undefined) {
              __cacheStyle[kw] = true;
              __cacheStyle[k2] = undefined;
            }

            if (__cacheStyle[ks] === undefined) {
              __cacheStyle[ks] = true;
              __cacheStyle[k2] = undefined;
            }

            if (__cacheStyle[k2] === undefined) {
              if (k === 'Top') {
                if (borderTopWidth > 0) {
                  var deg1 = Math.atan(borderTopWidth / borderLeftWidth);
                  var deg2 = Math.atan(borderTopWidth / borderRightWidth);
                  __cacheStyle[k2] = border.calPoints(borderTopWidth, computedStyle[ks], deg1, deg2, x1, x2, x3, x4, y1, y2, y3, y4, 0, borderTopLeftRadius, borderTopRightRadius);
                } else {
                  __cacheStyle[k2] = [];
                }
              } else if (k === 'Right') {
                if (borderRightWidth > 0) {
                  var _deg = Math.atan(borderRightWidth / borderTopWidth);

                  var _deg2 = Math.atan(borderRightWidth / borderBottomWidth);

                  __cacheStyle[k2] = border.calPoints(borderRightWidth, computedStyle[ks], _deg, _deg2, x1, x2, x3, x4, y1, y2, y3, y4, 1, borderTopRightRadius, borderBottomRightRadius);
                } else {
                  __cacheStyle[k2] = [];
                }
              } else if (k === 'Bottom') {
                if (borderBottomWidth > 0) {
                  var _deg3 = Math.atan(borderBottomWidth / borderLeftWidth);

                  var _deg4 = Math.atan(borderBottomWidth / borderRightWidth);

                  __cacheStyle[k2] = border.calPoints(borderBottomWidth, computedStyle[ks], _deg3, _deg4, x1, x2, x3, x4, y1, y2, y3, y4, 2, borderBottomLeftRadius, borderBottomRightRadius);
                } else {
                  __cacheStyle[k2] = [];
                }
              } else if (k === 'Left') {
                if (borderLeftWidth > 0) {
                  var _deg5 = Math.atan(borderLeftWidth / borderTopWidth);

                  var _deg6 = Math.atan(borderLeftWidth / borderBottomWidth);

                  __cacheStyle[k2] = border.calPoints(borderLeftWidth, computedStyle[ks], _deg5, _deg6, x1, x2, x3, x4, y1, y2, y3, y4, 3, borderTopLeftRadius, borderBottomLeftRadius);
                } else {
                  __cacheStyle[k2] = [];
                }
              }
            }
          });
        } else {
          if (o$1.contain(lv, o$1.OPACITY)) {
            computedStyle.opacity = currentStyle.opacity;
          }

          if (o$1.contain(lv, o$1.FILTER)) {
            computedStyle.filter = currentStyle.filter;
          }
        } // 强制计算继承性的


        var parentComputedStyle = parent && parent.computedStyle;

        if (currentStyle.fontStyle.unit === INHERIT$3) {
          computedStyle.fontStyle = parent ? parentComputedStyle.fontStyle : 'normal';
        } else if (!__cacheStyle.fontStyle) {
          computedStyle.fontStyle = currentStyle.fontStyle.value;
        }

        __cacheStyle.fontStyle = computedStyle.fontStyle;

        if (currentStyle.color.unit === INHERIT$3) {
          computedStyle.color = parent ? parentComputedStyle.color : [0, 0, 0, 1];
          __cacheStyle.color = int2rgba$2(computedStyle.color);
        } else if (!__cacheStyle.color) {
          computedStyle.color = rgba2int$3(currentStyle.color.value);
          __cacheStyle.color = int2rgba$2(computedStyle.color);
        }

        if (currentStyle.visibility.unit === INHERIT$3) {
          computedStyle.visibility = parent ? parentComputedStyle.visibility : 'visible';
        } else if (!__cacheStyle.visibility) {
          computedStyle.visibility = currentStyle.visibility.value;
        }

        __cacheStyle.visibility = computedStyle.visibility;

        if (currentStyle.pointerEvents.unit === INHERIT$3) {
          computedStyle.pointerEvents = parent ? parentComputedStyle.pointerEvents : 'auto';
        } else if (!__cacheStyle.pointerEvents) {
          computedStyle.pointerEvents = currentStyle.pointerEvents.value;
        }

        __cacheStyle.pointerEvents = computedStyle.pointerEvents;

        if (!matrixCache) {
          var tfo = computedStyle.transformOrigin.slice(0);
          tfo[0] += sx;
          tfo[1] += sy;
          __cacheStyle.matrix = tf.calMatrixByOrigin(computedStyle.transform, tfo);
        } // 决定是否缓存位图的指数，有内容就缓存，空容器无内容


        if (renderMode === mode.CANVAS) {
          if (lv < o$1.REPAINT) {
            return this.__hasContent;
          }

          var _backgroundImage = __cacheStyle.backgroundImage;

          if (util.isString(_backgroundImage)) {
            return true;
          }

          if (computedStyle.backgroundColor[3] > 0) {
            return true;
          } else if (_backgroundImage && _backgroundImage.k) {
            return true;
          }

          for (var list = ['borderTop', 'borderRight', 'borderBottom', 'borderLeft'], i = 0, len = list.length; i < len; i++) {
            var k = list[i];

            if (computedStyle[k + 'Width'] > 0 && computedStyle[k + 'Color'][3] > 0) {
              return true;
            }
          }

          var boxShadow = computedStyle.boxShadow;

          if (Array.isArray(boxShadow)) {
            for (var _i = 0, _len = boxShadow.length; _i < _len; _i++) {
              var item = boxShadow[_i];

              if (item && (item[2] > 0 || item[3] > 0)) {
                return true;
              }
            }
          } // borderRadius用5，只要有bgc或border就会超过


          for (var _i2 = 0, _len2 = borderRadiusKs.length; _i2 < _len2; _i2++) {
            var _v2 = computedStyle[borderRadiusKs[_i2]];

            if (_v2[0] > 0 && _v2[1] > 0) {
              return true;
            }
          }
        }

        return false;
      }
      /**
       * 渲染基础方法，Dom/Geom公用
       * @param renderMode
       * @param lv
       * @param ctx
       * @param defs
       */

    }, {
      key: "render",
      value: function render(renderMode, lv, ctx, defs) {
        var _this4 = this;

        var isDestroyed = this.isDestroyed,
            currentStyle = this.currentStyle,
            computedStyle = this.computedStyle,
            __cacheStyle = this.__cacheStyle,
            root = this.root,
            cache = this.__cache,
            cacheTotal = this.__cacheTotal; // 渲染完认为完全无变更，等布局/动画/更新重置

        this.__refreshLevel = o$1.NONE;

        if (isDestroyed) {
          return {
            isDestroyed: isDestroyed,
            "break": true
          };
        }

        var virtualDom; // svg设置vd上的lv属性标明<REPAINT时应用缓存，初始化肯定没有

        if (renderMode === mode.SVG) {
          if (lv < o$1.REPAINT && this.__virtualDom) {
            // 局部根还在说明孩子节点无变化，可直接用老的
            if (cacheTotal && cacheTotal.available) {
              virtualDom = this.__virtualDom;
              virtualDom.lv = lv;
              virtualDom.cache = true; // 标识vd整体缓存无需深度diff
            } // 否则extend老的，设置lv变化，等dom调用便跟children
            else {
                virtualDom = this.__virtualDom = extend$1({}, this.__virtualDom);
                virtualDom.lv = lv;
                delete virtualDom.cache;
              }
          } else {
            virtualDom = this.__virtualDom = {
              bb: [],
              children: [],
              visibility: 'visible'
            };
          }
        } // canvas返回信息，canCache是指下次渲染是否可以使用这次的缓存
        // svg已经初始化好了vd，canCache是指本次渲染是否和上次有变化即NONE


        if (computedStyle.display === 'none') {
          if (renderMode === mode.CANVAS) {
            return {
              displayNone: true,
              canCache: !this.displayAnimating
            };
          } else if (renderMode === mode.SVG) {
            var _canCache = this.__lastDisplay === 'none';

            this.__lastDisplay = 'none';
            return {
              displayNone: true,
              "break": true,
              canCache: _canCache
            };
          }
        } else if (renderMode === mode.SVG) {
          this.__lastDisplay = computedStyle.display;
        }

        this.__blurValue = 0; // 先判断cache避免重复运算，无内容无cache根据NONE判断

        if (root.cache && renderMode === mode.CANVAS && lv < o$1.REPAINT) {
          var _canCache2 = cacheTotal && cacheTotal.available;

          if (lv > o$1.NONE) {
            var _x = this.__sx,
                _y = this.__sy,
                parent = this.parent;

            this.__calCache(renderMode, lv, ctx, defs, parent, __cacheStyle, currentStyle, computedStyle, _x, _y);

            var _p;

            if (o$1.contain(lv, TRANSFORM_ALL)) {
              _p = _p || this.domParent;
              var _matrix = __cacheStyle.matrix;

              if (_p) {
                _matrix = mx.multiply(_p.matrixEvent, _matrix);
              }

              this.__matrixEvent = _matrix;
            }

            if (o$1.contain(lv, o$1.OPACITY)) {
              var _opacity = computedStyle.opacity;
              _p = _p || this.domParent;

              if (_p) {
                _opacity *= _p.__opacity;
              }

              this.__opacity = _opacity;
            }

            if (o$1.contain(lv, o$1.FILTER) && Array.isArray(computedStyle.filter)) {
              computedStyle.filter.forEach(function (item) {
                var _item = _slicedToArray(item, 2),
                    k = _item[0],
                    v = _item[1];

                if (k === 'blur') {
                  _this4.__blurValue = v;
                  var bbox = _this4.bbox;

                  if (cache) {
                    _this4.__cache = Cache.updateCache(cache, bbox);
                  } else {
                    _this4.__cache = Cache.getInstance(bbox);
                  }
                }
              });
            }

            if (computedStyle.visibility === 'hidden') {
              return {
                canCache: _canCache2 || !this.visibilityAnimating
              };
            }
          } // 有cacheTotal省略判断有效动画


          return {
            canCache: _canCache2 || !this.availableAnimating
          };
        } // 使用sx和sy渲染位置，考虑了relative和translate影响


        var x = this.sx,
            y = this.sy,
            width = this.width,
            height = this.height,
            innerWidth = this.innerWidth,
            innerHeight = this.innerHeight,
            outerWidth = this.outerWidth,
            outerHeight = this.outerHeight;
        this.__sx = x;
        this.__sy = y;
        var marginTop = computedStyle.marginTop,
            marginLeft = computedStyle.marginLeft,
            paddingTop = computedStyle.paddingTop,
            paddingRight = computedStyle.paddingRight,
            paddingBottom = computedStyle.paddingBottom,
            paddingLeft = computedStyle.paddingLeft,
            borderLeftWidth = computedStyle.borderLeftWidth,
            borderRightWidth = computedStyle.borderRightWidth,
            borderTopWidth = computedStyle.borderTopWidth,
            borderBottomWidth = computedStyle.borderBottomWidth;
        var x1 = x + marginLeft;
        var x2 = x1 + borderLeftWidth;
        var x3 = x2 + width + paddingLeft + paddingRight;
        var x4 = x3 + borderRightWidth;
        var y1 = y + marginTop;
        var y2 = y1 + borderTopWidth;
        var y3 = y2 + height + paddingTop + paddingBottom;
        var y4 = y3 + borderBottomWidth;
        var res = {
          x1: x1,
          x2: x2,
          x3: x3,
          x4: x4,
          y1: y1,
          y2: y2,
          y3: y3,
          y4: y4
        }; // 防止cp直接返回cp嵌套，拿到真实dom的parent

        var p = this.domParent; // 计算好cacheStyle的内容，以及位图缓存指数

        var hasContent = this.__hasContent = this.__calCache(renderMode, lv, ctx, defs, this.parent, __cacheStyle, currentStyle, computedStyle, x, y, innerWidth, innerHeight, outerWidth, outerHeight, borderTopWidth, borderRightWidth, borderBottomWidth, borderLeftWidth, x1, x2, x3, x4, y1, y2, y3, y4);

        var backgroundColor = computedStyle.backgroundColor,
            borderTopColor = computedStyle.borderTopColor,
            borderRightColor = computedStyle.borderRightColor,
            borderBottomColor = computedStyle.borderBottomColor,
            borderLeftColor = computedStyle.borderLeftColor,
            borderTopLeftRadius = computedStyle.borderTopLeftRadius,
            borderTopRightRadius = computedStyle.borderTopRightRadius,
            borderBottomRightRadius = computedStyle.borderBottomRightRadius,
            borderBottomLeftRadius = computedStyle.borderBottomLeftRadius,
            visibility = computedStyle.visibility,
            backgroundRepeat = computedStyle.backgroundRepeat,
            backgroundImage = computedStyle.backgroundImage,
            opacity = computedStyle.opacity,
            filter = computedStyle.filter,
            backgroundSize = computedStyle.backgroundSize,
            boxShadow = computedStyle.boxShadow; // 先设置透明度，canvas可以向上累积

        if (renderMode === mode.CANVAS) {
          if (p) {
            opacity *= p.__opacity;
          }

          this.__opacity = opacity;
        } else if (renderMode === mode.SVG) {
          if (opacity === 1) {
            delete virtualDom.opacity;
          } else {
            virtualDom.opacity = opacity;
          }
        } // canvas/svg/事件需要3种不同的matrix


        var matrix = __cacheStyle.matrix;
        var renderMatrix = this.__renderMatrix = matrix; // 变换对事件影响，canvas要设置渲染

        if (p) {
          matrix = mx.multiply(p.matrixEvent, matrix);
        }

        this.__matrixEvent = matrix;

        if (renderMode === mode.SVG) {
          // svg可以没变化省略计算，因为只相对于自身
          if (!o$1.contain(lv, TRANSFORM_ALL) && lv < o$1.REPAINT) ; else if (!equalArr$2(renderMatrix, [1, 0, 0, 1, 0, 0])) {
            virtualDom.transform = 'matrix(' + joinArr$1(renderMatrix, ',') + ')';
          } else {
            delete virtualDom.transform;
          }
        } // 隐藏不渲染，依然注意canCache在canvas/svg下意义不同


        if (visibility === 'hidden') {
          if (renderMode === mode.CANVAS) {
            return _objectSpread2(_objectSpread2({}, res), {}, {
              "break": true,
              canCache: !this.visibilityAnimating
            });
          }
        }

        if (renderMode === mode.SVG) {
          virtualDom.visibility = visibility;
        } // 无内容或者无影响动画视为可缓存本身


        var canCache = !hasContent || !this.availableAnimating; // 无缓存重新渲染时是否使用缓存

        var dx = 0,
            dy = 0;

        if (root.cache && renderMode === mode.CANVAS) {
          // 置空防止原型链查找性能
          this.__cache = this.__cacheTotal = this.__cacheFilter = this.__cacheMask = null;
          var isGeom = this.tagName.charAt(0) === '$';
          var isImg = this.tagName.toLowerCase() === 'img'; // 无内容可释放并提前跳出，geom特殊判断，因为后面子类会绘制矢量，img也特殊判断

          if (!hasContent) {
            if (!isGeom && cache && cache.available) {
              cache.release();
            } // 无内容且lv变化小geom可以提前跳出，普通dom直接跳出


            if (lv < o$1.REPAINT && isGeom) {
              return _objectSpread2(_objectSpread2({}, res), {}, {
                "break": true,
                canCache: canCache
              });
            }

            if (!isImg) {
              return _objectSpread2(_objectSpread2({}, res), {}, {
                canCache: canCache
              });
            }
          } // 有缓存情况快速使用位图缓存不再继续，filter要更新bbox范围，排除geom，因为是整屏


          if (cache && cache.available && lv < o$1.REPAINT) {
            if (o$1.contain(lv, o$1.FILTER)) {
              cache = this.__cache = Cache.updateCache(cache, this.bbox);
            }

            return _objectSpread2(_objectSpread2({}, res), {}, {
              "break": true,
              canCache: canCache,
              cache: cache
            });
          } // 新生成根据最大尺寸，排除margin从border开始还要考虑阴影滤镜等，geom单独在dom里做


          if (!cache || !cache.available) {
            var bbox = this.bbox;

            if (cache) {
              cache.reset(bbox);
            } else {
              cache = Cache.getInstance(bbox);
            } // 有可能超过最大尺寸限制不使用缓存


            if (cache && cache.enabled) {
              this.__cache = cache;
              cache.__bbox = bbox;

              cache.__appendData(x1, y1);

              var dbx = cache.dbx,
                  dby = cache.dby;
              ctx = cache.ctx;

              var _cache$coords = _slicedToArray(cache.coords, 2),
                  xc = _cache$coords[0],
                  yc = _cache$coords[1];

              dx = cache.dx;
              dy = cache.dy; // 重置ctx为cache的，以及绘制坐标为cache的区域

              res.x1 = x1 = xc + dbx;
              res.y1 = y1 = yc + dby;

              if (dx) {
                res.x2 = x2 += dx;
                res.x3 = x3 += dx;
                res.x4 = x4 += dx;
              }

              if (dy) {
                res.y2 = y2 += dy;
                res.y3 = y3 += dy;
                res.y4 = y4 += dy;
              }
            } // 更新后可能超了需释放
            else if (this.__cache) {
                this.__cache.release();

                this.__cache = null;
              }
          } // 无离屏功能视为不可缓存本身


          if (!cache) {
            canCache = false;
          }
        } // 无cache时canvas的blur需绘制到离屏上应用后反向绘制回来，有cache在Dom里另生成一个filter的cache


        var offScreen;

        if (Array.isArray(filter)) {
          filter.forEach(function (item) {
            var _item2 = _slicedToArray(item, 2),
                k = _item2[0],
                v = _item2[1];

            if (k === 'blur') {
              _this4.__blurValue = v; // geom由dom看管，做了替换工作，以便自定义geom时render()不感知离屏过程

              if (renderMode === mode.CANVAS && v > 0 && (!cache || !cache.enabled) && _this4.tagName.charAt(0) !== '$') {
                var _width = root.width,
                    _height = root.height;
                var c = inject.getCacheCanvas(_width, _height, '__$$blur$$__');

                if (c.ctx) {
                  offScreen = {
                    ctx: ctx,
                    blur: v
                  };
                  offScreen.target = c;
                  ctx = c.ctx;
                }
              } else if (renderMode === mode.SVG && (lv >= o$1.REFLOW || o$1.contain(lv, o$1.FILTER))) {
                // 模糊框卷积尺寸 #66
                if (v > 0) {
                  var d = mx.int2convolution(v);
                  var id = defs.add({
                    tagName: 'filter',
                    props: [['x', -d / outerWidth], ['y', -d / outerHeight], ['width', 1 + d * 2 / outerWidth], ['height', 1 + d * 2 / outerHeight]],
                    children: [{
                      tagName: 'feGaussianBlur',
                      props: [['stdDeviation', v]]
                    }]
                  });
                  virtualDom.filter = 'url(#' + id + ')';
                } else {
                  delete virtualDom.filter;
                }
              }
            }
          });
        }

        if (virtualDom && virtualDom.filter && this.__blurValue <= 0) {
          delete virtualDom.filter;
        } // svg在非首次有vd缓存的情况下，本次绘制<REPAINT可以提前跳出


        if (renderMode === mode.SVG && virtualDom.hasOwnProperty('lv')) {
          return {
            "break": true,
            canCache: lv === o$1.NONE
          };
        } // 无法使用缓存时主画布直接绘制需设置


        if (renderMode === mode.CANVAS && (!cache || !cache.enabled)) {
          var _ctx;

          ctx.globalAlpha = opacity;

          (_ctx = ctx).setTransform.apply(_ctx, _toConsumableArray(matrix));
        } // 背景色垫底


        if (backgroundColor[3] > 0) {
          renderBgc(renderMode, __cacheStyle.backgroundColor, x2, y2, innerWidth, innerHeight, ctx, this, borderTopWidth, borderRightWidth, borderBottomWidth, borderLeftWidth, borderTopLeftRadius, borderTopRightRadius, borderBottomRightRadius, borderBottomLeftRadius);
        } // 渐变或图片叠加


        if (backgroundImage) {
          if (util.isString(backgroundImage)) {
            var loadBgi = this.__loadBgi;

            if (loadBgi.url === backgroundImage) {
              var source = loadBgi.source; // 无source不绘制

              if (source) {
                var _width2 = loadBgi.width,
                    _height2 = loadBgi.height;

                var _backgroundSize = _slicedToArray(backgroundSize, 2),
                    w = _backgroundSize[0],
                    h = _backgroundSize[1]; // -1为auto，-2为contain，-3为cover


                if (w === -1 && h === -1) {
                  w = _width2;
                  h = _height2;
                } else if (w === -2) {
                  if (_width2 > innerWidth && _height2 > innerHeight) {
                    w = _width2 / innerWidth;
                    h = _height2 / innerHeight;

                    if (w >= h) {
                      w = innerWidth;
                      h = w * _height2 / _width2;
                    } else {
                      h = innerHeight;
                      w = h * _width2 / _height2;
                    }
                  } else if (_width2 > innerWidth) {
                    w = innerWidth;
                    h = w * _height2 / _width2;
                  } else if (_height2 > innerHeight) {
                    h = innerHeight;
                    w = h * _width2 / _height2;
                  } else {
                    w = _width2;
                    h = _height2;
                  }
                } else if (w === -3) {
                  if (innerWidth > _width2 && innerHeight > _height2) {
                    w = _width2 / innerWidth;
                    h = _height2 / innerHeight;

                    if (w <= h) {
                      w = innerWidth;
                      h = w * _height2 / _width2;
                    } else {
                      h = innerHeight;
                      w = h * _width2 / _height2;
                    }
                  } else if (innerWidth > _width2) {
                    w = innerWidth;
                    h = w * _height2 / _width2;
                  } else if (innerHeight > _height2) {
                    h = innerHeight;
                    w = h * _width2 / _height2;
                  } else {
                    w = _width2 / innerWidth;
                    h = _height2 / innerHeight;

                    if (w <= h) {
                      w = innerWidth;
                      h = w * _height2 / _width2;
                    } else {
                      h = innerHeight;
                      w = h * _width2 / _height2;
                    }
                  }
                } else if (w === -1) {
                  w = h * _width2 / _height2;
                } else if (h === -1) {
                  h = w * _height2 / _width2;
                }

                var bgX = x2 + calBackgroundPosition(currentStyle.backgroundPositionX, innerWidth, w);
                var bgY = y2 + calBackgroundPosition(currentStyle.backgroundPositionY, innerHeight, h); // 超出尺寸模拟mask截取

                var needMask = bgX < x2 || bgY < y2 || w > innerWidth || h > innerHeight; // 计算因为repeat，需要向4个方向扩展渲染几个数量图片

                var xnl = 0;
                var xnr = 0;
                var ynt = 0;
                var ynb = 0; // repeat-x

                if (['repeat-x', 'repeat'].indexOf(backgroundRepeat) > -1) {
                  var diff = bgX - x2;

                  if (diff > 0) {
                    xnl = Math.ceil(diff / w);
                  }

                  diff = x2 + innerWidth - bgX - w;

                  if (diff > 0) {
                    xnr = Math.ceil(diff / w);
                  }
                } // repeat-y


                if (['repeat-y', 'repeat'].indexOf(backgroundRepeat) > -1) {
                  var _diff = bgY - y2;

                  if (_diff > 0) {
                    ynt = Math.ceil(_diff / h);
                  }

                  _diff = y2 + innerHeight - bgY - h;

                  if (_diff > 0) {
                    ynb = Math.ceil(_diff / h);
                  }
                } // 分同行列和4个角分别判断，先看同行同列，再看4个角的象限


                var repeat = [];

                if (xnl > 0) {
                  for (var i = 0; i < xnl; i++) {
                    var _x2 = bgX - (i + 1) * w;

                    repeat.push([_x2, bgY]); // 看最左边超过没有

                    if (!needMask && i === 0 && _x2 < x2) {
                      needMask = true;
                    }
                  }
                }

                if (xnr > 0) {
                  for (var _i3 = 0; _i3 < xnr; _i3++) {
                    var _x3 = bgX + (_i3 + 1) * w;

                    repeat.push([_x3, bgY]); // 看最右边超过没有

                    if (!needMask && _i3 === xnr - 1 && _x3 + w > x2 + innerWidth) {
                      needMask = true;
                    }
                  }
                }

                if (ynt > 0) {
                  for (var _i4 = 0; _i4 < ynt; _i4++) {
                    var _y2 = bgY - (_i4 + 1) * h;

                    repeat.push([bgX, _y2]); // 看最上边超过没有

                    if (!needMask && _i4 === 0 && _y2 < y2) {
                      needMask = true;
                    }
                  }
                }

                if (ynb > 0) {
                  for (var _i5 = 0; _i5 < ynb; _i5++) {
                    var _y3 = bgY + (_i5 + 1) * h;

                    repeat.push([bgX, _y3]); // 看最下边超过没有

                    if (!needMask && _i5 === ynb - 1 && _y3 + w > y2 + innerHeight) {
                      needMask = true;
                    }
                  }
                } // 原点和同行列十字画完，看4个角的情况


                if (xnl > 0 && ynt > 0) {
                  for (var _i6 = 0; _i6 < xnl; _i6++) {
                    for (var j = 0; j < ynt; j++) {
                      repeat.push([bgX - (_i6 + 1) * w, bgY - (j + 1) * h]);
                    }
                  }
                }

                if (xnr > 0 && ynt > 0) {
                  for (var _i7 = 0; _i7 < xnr; _i7++) {
                    for (var _j = 0; _j < ynt; _j++) {
                      repeat.push([bgX + (_i7 + 1) * w, bgY - (_j + 1) * h]);
                    }
                  }
                }

                if (xnl > 0 && ynb > 0) {
                  for (var _i8 = 0; _i8 < xnl; _i8++) {
                    for (var _j2 = 0; _j2 < ynb; _j2++) {
                      repeat.push([bgX - (_i8 + 1) * w, bgY + (_j2 + 1) * h]);
                    }
                  }
                }

                if (xnr > 0 && ynb > 0) {
                  for (var _i9 = 0; _i9 < xnr; _i9++) {
                    for (var _j3 = 0; _j3 < ynb; _j3++) {
                      repeat.push([bgX + (_i9 + 1) * w, bgY + (_j3 + 1) * h]);
                    }
                  }
                }

                if (renderMode === mode.CANVAS) {
                  if (needMask) {
                    ctx.save();
                    renderBgc(renderMode, '#FFF', x2, y2, innerWidth, innerHeight, ctx, this, borderTopWidth, borderRightWidth, borderBottomWidth, borderLeftWidth, borderTopLeftRadius, borderTopRightRadius, borderBottomRightRadius, borderBottomLeftRadius, 'clip');
                  } // 先画不考虑repeat的中心声明的


                  ctx.drawImage(source, bgX, bgY, w, h); // 再画重复的十字和4角象限

                  repeat.forEach(function (item) {
                    ctx.drawImage(source, item[0], item[1], w, h);
                  });

                  if (needMask) {
                    ctx.restore();
                  }
                } else if (renderMode === mode.SVG) {
                  var _matrix2 = image.matrixResize(_width2, _height2, w, h, bgX, bgY, innerWidth, innerHeight);

                  var props = [['xlink:href', backgroundImage], ['x', bgX], ['y', bgY], ['width', _width2], ['height', _height2]];
                  var needResize;

                  if (_matrix2 && !equalArr$2(_matrix2, [1, 0, 0, 1, 0, 0])) {
                    needResize = true;
                    props.push(['transform', 'matrix(' + joinArr$1(_matrix2, ',') + ')']);
                  }

                  if (needMask) {
                    var id = defs.add({
                      tagName: 'clipPath',
                      children: [{
                        tagName: 'rect',
                        props: [['x', x2], ['y', y2], ['width', innerWidth], ['height', innerHeight], ['fill', '#FFF']]
                      }]
                    });
                    this.virtualDom.bbClip = 'url(#' + id + ')';
                  } // 先画不考虑repeat的中心声明的


                  this.virtualDom.bb.push({
                    type: 'img',
                    tagName: 'image',
                    props: props
                  }); // 再画重复的十字和4角象限

                  repeat.forEach(function (item) {
                    var copy = clone$2(props);

                    if (needResize) {
                      var _matrix3 = image.matrixResize(_width2, _height2, w, h, item[0], item[1], innerWidth, innerHeight);

                      if (_matrix3 && !equalArr$2(_matrix3, [1, 0, 0, 1, 0, 0])) {
                        copy[5][1] = 'matrix(' + joinArr$1(_matrix3, ',') + ')';
                      }
                    }

                    copy[1][1] = item[0];
                    copy[2][1] = item[1];

                    _this4.virtualDom.bb.push({
                      type: 'img',
                      tagName: 'image',
                      props: copy
                    });
                  });
                }
              }
            }
          } else if (backgroundImage.k) {
            renderBgc(renderMode, __cacheStyle.backgroundImage, x2, y2, innerWidth, innerHeight, ctx, this, borderTopWidth, borderRightWidth, borderBottomWidth, borderLeftWidth, borderTopLeftRadius, borderTopRightRadius, borderBottomRightRadius, borderBottomLeftRadius);
          }
        } // boxShadow可能会有多个


        if (boxShadow) {
          boxShadow.forEach(function (item) {
            renderBoxShadow(renderMode, ctx, defs, item, _this4, x1, y1, x2, y2, x3, y3, x4, y4, outerWidth, outerHeight);
          });
        } // 边框需考虑尖角，两条相交边平分45°夹角


        if (borderTopWidth > 0 && borderTopColor[3] > 0) {
          renderBorder(renderMode, __cacheStyle.borderTop, __cacheStyle.borderTopColor, ctx, this, dx, dy);
        }

        if (borderRightWidth > 0 && borderRightColor[3] > 0) {
          renderBorder(renderMode, __cacheStyle.borderRight, __cacheStyle.borderRightColor, ctx, this, dx, dy);
        }

        if (borderBottomWidth > 0 && borderBottomColor[3] > 0) {
          renderBorder(renderMode, __cacheStyle.borderBottom, __cacheStyle.borderBottomColor, ctx, this, dx, dy);
        }

        if (borderLeftWidth > 0 && borderLeftColor[3] > 0) {
          renderBorder(renderMode, __cacheStyle.borderLeft, __cacheStyle.borderLeftColor, ctx, this, dx, dy);
        }

        if (cache && cache.enabled) {
          cache.__available = true;
        }

        if (renderMode === mode.CANVAS) {
          return _objectSpread2(_objectSpread2({}, res), {}, {
            canCache: canCache,
            cache: cache,
            offScreen: offScreen
          });
        } // svg前面提前跳出，到这一定是>=REPAINT的变化
        else if (renderMode === mode.SVG) {
            return {
              canCache: false
            };
          }
      }
    }, {
      key: "__renderByMask",
      value: function __renderByMask(renderMode, lv, ctx, defs) {
        var next = this.next,
            root = this.root,
            __hasMask = this.__hasMask,
            __hasClip = this.__hasClip;

        if (__hasMask === undefined || __hasClip === undefined) {
          __hasMask = this.__hasMask = !!(next && next.isMask);
          __hasClip = this.__hasClip = !!(next && next.isClip);
        } // cache情况特殊处理，geom照常绘制，交由dom处理mask


        if (root.cache && renderMode === mode.CANVAS || !__hasMask && !__hasClip) {
          return this.render(renderMode, lv, ctx, defs);
        }

        if (renderMode === mode.CANVAS) {
          var res; // canvas借用2个离屏canvas来处理，c绘制本xom，m绘制多个mask

          if (__hasMask) {
            var width = root.width,
                height = root.height;
            var c = inject.getCacheCanvas(width, height, '__$$mask1$$__');
            res = this.render(renderMode, lv, c.ctx); // 收集之前的mask列表

            var list = [];

            while (next && next.isMask) {
              list.push(next);
              next = next.next;
            }

            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.globalAlpha = 1; // 当mask只有1个时，无需生成m，直接在c上即可

            if (list.length === 1) {
              next = list[0];
              c.ctx.globalCompositeOperation = 'destination-in';
              next.render(renderMode, lv, c.ctx, null); // 为小程序特殊提供的draw回调，每次绘制调用都在攒缓冲，drawImage另一个canvas时刷新缓冲，需在此时主动flush

              c.draw(c.ctx);
              ctx.drawImage(c.canvas, 0, 0);
              c.draw(ctx);
            } // 多个借用m绘制mask，用c结合mask获取结果，最终结果再到当前画布
            else {
                var m = inject.getCacheCanvas(width, height, '__$$mask2$$__');
                list.forEach(function (item) {
                  item.render(renderMode, lv, m.ctx, null, true);
                });
                m.draw(m.ctx);
                c.ctx.globalCompositeOperation = 'destination-in';
                c.ctx.drawImage(m.canvas, 0, 0);
                c.draw(c.ctx);
                ctx.drawImage(c.canvas, 0, 0);
                c.draw(ctx); // 清除

                m.ctx.globalCompositeOperation = 'source-over';
                m.ctx.clearRect(0, 0, width, height);
                m.draw(m.ctx);
              }

            ctx.restore(); // 清除

            c.ctx.globalCompositeOperation = 'source-over';
            c.ctx.clearRect(0, 0, width, height);
            c.draw(c.ctx);
          } // 劫持canvas原生方法使得多个clip矢量连续绘制
          else if (__hasClip) {
              ctx.save();
              ctx.beginPath();
              var fill = ctx.fill;
              var beginPath = ctx.beginPath;
              var closePath = ctx.closePath;
              ctx.fill = ctx.beginPath = ctx.closePath = empty;

              while (next && next.isClip) {
                next.render(renderMode, lv, ctx);
                next = next.next;
              }

              ctx.fill = fill;
              ctx.beginPath = beginPath;
              ctx.closePath = closePath;
              ctx.clip();
              ctx.closePath();
              res = this.render(renderMode, lv, ctx);
              ctx.restore();
            }

          return res;
        } else if (renderMode === mode.SVG) {
          var _res = this.render(renderMode, lv, ctx, defs); // 检查后续mask是否是空，空遮罩不生效


          var isEmpty = true;
          var sibling = next;

          outer: while (sibling) {
            var children = sibling.virtualDom.children;

            for (var i = 0, len = children.length; i < len; i++) {
              var _children$i = children[i],
                  tagName = _children$i.tagName,
                  props = _children$i.props;

              if (tagName === 'path') {
                for (var j = 0, _len3 = props.length; j < _len3; j++) {
                  var _props$i = _slicedToArray(props[i], 2),
                      k = _props$i[0],
                      v = _props$i[1];

                  if (k === 'd') {
                    if (v) {
                      isEmpty = false;
                      break outer;
                    }
                  }
                }
              }
            }

            sibling = sibling.next;

            if (!sibling) {
              break;
            }

            if (__hasMask) {
              if (!sibling.isMask) {
                break;
              }
            } else if (__hasClip) {
              if (!sibling.isClip) {
                break;
              }
            }
          }

          if (isEmpty || this.computedStyle.display === 'none') {
            return _res;
          } // 应用mask本身的matrix，以及被遮罩对象的matrix逆


          sibling = next;
          var mChildren = [];

          while (sibling) {
            var _sibling = sibling,
                _sibling$computedStyl = _sibling.computedStyle,
                display = _sibling$computedStyl.display,
                visibility = _sibling$computedStyl.visibility;

            if (display !== 'none' && visibility !== 'hidden') {
              var _children = sibling.virtualDom.children;
              mChildren = mChildren.concat(_children);

              for (var _i10 = 0, _len4 = _children.length; _i10 < _len4; _i10++) {
                var _children$_i = _children[_i10],
                    _tagName = _children$_i.tagName,
                    _props = _children$_i.props;

                if (_tagName === 'path') {
                  var matrix = sibling.__renderMatrix;
                  var inverse = mx.inverse(this.__renderMatrix);
                  matrix = mx.multiply(matrix, inverse); // transform属性放在最后一个省去循环

                  var _len5 = _props.length;

                  if (!_len5 || _props[_len5 - 1][0] !== 'transform') {
                    _props.push(['transform', "matrix(".concat(matrix, ")")]);
                  } else {
                    _props[_len5 - 1][1] = "matrix(".concat(matrix, ")");
                  }
                }
              }
            }

            sibling = sibling.next;

            if (!sibling) {
              break;
            }

            if (__hasMask) {
              if (!sibling.isMask) {
                break;
              }
            } else if (__hasClip) {
              if (!sibling.isClip) {
                break;
              }
            }
          }

          var id = defs.add({
            tagName: __hasClip ? 'clipPath' : 'mask',
            props: [],
            children: mChildren
          });
          id = 'url(#' + id + ')'; // 作为mask会在defs生成maskId供使用，多个连续mask共用一个id

          if (__hasMask) {
            this.virtualDom.mask = id;
          } else if (__hasClip) {
            this.virtualDom.clip = id;
          }

          return _res;
        }
      }
    }, {
      key: "__applyCache",
      value: function __applyCache(renderMode, ctx, tx, ty) {
        var cache = this.__cache;

        if (cache && cache.available) {
          var coords = cache.coords,
              canvas = cache.canvas,
              size = cache.size,
              dbx = cache.dbx,
              dby = cache.dby;

          var _coords = _slicedToArray(coords, 2),
              x = _coords[0],
              y = _coords[1];

          ctx.drawImage(canvas, x - 1, y - 1, size, size, tx - dbx, ty - dby, size, size);
        }
      } // 简化bbox为2个坐标点形式，并附带matrix计算

    }, {
      key: "__mergeBbox",
      value: function __mergeBbox(matrix, isTop, dx, dy) {
        // 空内容
        var bbox;

        if (this.__cache && this.__cache.available) {
          bbox = this.__cache.bbox.slice(0);
        } else {
          bbox = this.bbox;
        }

        if (!isTop) {
          bbox = util.transformBbox(bbox, matrix, dx, dy);
        }

        return bbox;
      }
    }, {
      key: "__destroy",
      value: function __destroy() {
        if (this.isDestroyed) {
          return;
        }

        var ref = this.props.ref;

        if (ref) {
          var owner = this.host || this.root;

          if (owner && owner.ref[ref]) {
            delete owner.ref[ref];
          }
        }

        this.animationList.forEach(function (item) {
          return item.__destroy();
        });
        this.root.delRefreshTask(this.__loadBgi.cb);
        this.root.delRefreshTask(this.__task);

        _get(_getPrototypeOf(Xom.prototype), "__destroy", this).call(this);

        this.__matrix = this.__matrixEvent = this.__root = null;

        if (this.__cache) {
          this.__cache.release();

          this.__cache = null;
        }

        if (this.__cacheTotal) {
          this.__cacheTotal.release();

          this.__cacheTotal = null;
        }

        if (this.__cacheFilter) {
          this.__cacheFilter.release();

          this.__cacheFilter = null;
        }
      } // 先查找到注册了事件的节点，再捕获冒泡判断增加性能

    }, {
      key: "__emitEvent",
      value: function __emitEvent(e, force) {
        var isDestroyed = this.isDestroyed,
            computedStyle = this.computedStyle;

        if (isDestroyed || computedStyle.display === 'none' || e.__stopPropagation) {
          return;
        }

        var type = e.event.type;
        var listener = this.listener;
        var cb;

        if (listener.hasOwnProperty(type)) {
          cb = listener[type];
        } // touchmove之类强制的直接由Root通知即可


        if (force) {
          e.target = this;

          if (util.isFunction(cb) && !e.__stopImmediatePropagation) {
            cb.call(this, e);
          }

          return true;
        } // 非force的判断事件坐标是否在节点内


        if (this.willResponseEvent(e)) {
          if (util.isFunction(cb) && !e.__stopImmediatePropagation) {
            cb.call(this, e);
          }

          return true;
        }
      }
    }, {
      key: "willResponseEvent",
      value: function willResponseEvent(e) {
        var x = e.x,
            y = e.y;
        var sx = this.sx,
            sy = this.sy,
            outerWidth = this.outerWidth,
            outerHeight = this.outerHeight,
            matrixEvent = this.matrixEvent,
            pointerEvents = this.computedStyle.pointerEvents;

        if (pointerEvents === 'none') {
          return;
        }

        var inThis = tf.pointInQuadrilateral(x, y, sx, sy, sx + outerWidth, sy, sx + outerWidth, sy + outerHeight, sx, sy + outerHeight, matrixEvent);

        if (inThis) {
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
      key: "__gradient",
      value: function __gradient(renderMode, ctx, defs, x2, y2, x3, y3, iw, ih, vs) {
        var k = vs.k,
            v = vs.v,
            d = vs.d,
            s = vs.s,
            z = vs.z,
            p = vs.p;
        var cx = x2 + iw * 0.5;
        var cy = y2 + ih * 0.5;
        var res;

        if (k === 'linear') {
          var gd = gradient.getLinear(v, d, cx, cy, iw, ih);
          res = this.__getLg(renderMode, ctx, defs, gd);
        } else if (k === 'radial') {
          var _gd = gradient.getRadial(v, s, z, p, x2, y2, x3, y3);

          res = this.__getRg(renderMode, ctx, defs, _gd);
        }

        return res;
      }
    }, {
      key: "__getLg",
      value: function __getLg(renderMode, ctx, defs, gd) {
        if (renderMode === mode.CANVAS) {
          var lg = ctx.createLinearGradient(gd.x1, gd.y1, gd.x2, gd.y2);
          gd.stop.forEach(function (item) {
            lg.addColorStop(item[1], item[0]);
          });
          return lg;
        } else if (renderMode === mode.SVG) {
          var uuid = defs.add({
            tagName: 'linearGradient',
            props: [['x1', gd.x1], ['y1', gd.y1], ['x2', gd.x2], ['y2', gd.y2]],
            children: gd.stop.map(function (item) {
              return {
                tagName: 'stop',
                props: [['stop-color', item[0]], ['offset', item[1] * 100 + '%']]
              };
            })
          });
          return 'url(#' + uuid + ')';
        }
      } // canvas清空自身cache，cacheTotal在Root的自底向上逻辑做，svg仅有cacheTotal

    }, {
      key: "__cancelCache",
      value: function __cancelCache() {
        this.__cacheStyle = {};

        if (this.__cache) {
          this.__cache.release();
        }

        if (this.__cacheTotal) {
          this.__cacheTotal.release();
        }
      }
    }, {
      key: "__getRg",
      value: function __getRg(renderMode, ctx, defs, gd) {
        if (renderMode === mode.CANVAS) {
          var rg = ctx.createRadialGradient(gd.cx, gd.cy, 0, gd.cx, gd.cy, gd.r);
          gd.stop.forEach(function (item) {
            rg.addColorStop(item[1], item[0]);
          });
          return rg;
        } else if (renderMode === mode.SVG) {
          var uuid = defs.add({
            tagName: 'radialGradient',
            props: [['cx', gd.cx], ['cy', gd.cy], ['r', gd.r]],
            children: gd.stop.map(function (item) {
              return {
                tagName: 'stop',
                props: [['stop-color', item[0]], ['offset', item[1] * 100 + '%']]
              };
            })
          });
          return 'url(#' + uuid + ')';
        }
      }
    }, {
      key: "updateStyle",
      value: function updateStyle(style, cb) {
        var tagName = this.tagName,
            root = this.root,
            props = this.props,
            os = this.style;

        if (root) {
          var hasChange; // 先去掉缩写

          var ks = Object.keys(style);
          ks.forEach(function (k) {
            if (abbr.hasOwnProperty(k)) {
              abbr.toFull(style, k);
              delete style[k];
            }
          }); // 此处仅检测样式是否有效

          for (var i in style) {
            if (style.hasOwnProperty(i)) {
              // 是规定内的合法样式
              if (o.isValid(tagName, i)) {
                if (o.isGeom(tagName, i)) {
                  if (!css.equalStyle(i, style[i], props[i], this)) {
                    hasChange = true;
                  }
                } else if (!css.equalStyle(i, style[i], os[i], this)) {
                  hasChange = true;
                }
              } else {
                delete style[i];
              }
            }
          } // 空样式或非法或无改变直接返回


          if (!hasChange) {
            if (util.isFunction(cb)) {
              cb(0);
            }

            return;
          }

          var node = this;
          root.addRefreshTask(node.__task = {
            before: function before() {
              if (node.isDestroyed) {
                return;
              } // 刷新前统一赋值，由刷新逻辑计算最终值避免优先级覆盖问题


              root.__addUpdate({
                node: node,
                style: style,
                origin: true,
                // 标识样式未经过normalize，不同于animate
                overwrite: true // 标识盖原有style样式不仅仅是修改currentStyle，不同于animate

              });
            },
            after: function after(diff) {
              if (util.isFunction(cb)) {
                cb.call(node, diff);
              }
            }
          });
        }
      }
    }, {
      key: "animate",
      value: function animate(list, options) {
        if (this.isDestroyed) {
          return;
        }

        var animation = new Animation(this, list, options);
        this.animationList.push(animation);

        if (options.autoPlay === false) {
          return animation;
        }

        return animation.play();
      }
    }, {
      key: "removeAnimate",
      value: function removeAnimate(o) {
        if (o instanceof Animation) {
          var i = this.animationList.indexOf(o);

          if (i > -1) {
            o.cancel();

            o.__destroy();

            this.animationList.splice(i, 1);
          }
        }
      }
    }, {
      key: "clearAnimate",
      value: function clearAnimate() {
        this.animationList.splice(0).forEach(function (o) {
          o.cancel();

          o.__destroy();
        });
      }
    }, {
      key: "__computeMeasure",
      value: function __computeMeasure(renderMode, ctx, isHost, cb) {
        css.computeMeasure(this, isHost);

        if (util.isFunction(cb)) {
          cb(this);
        }
      }
    }, {
      key: "deepScan",
      value: function deepScan(cb, options) {
        return cb(this, options);
      }
    }, {
      key: "__offsetX",
      value: function __offsetX(diff, isLayout, lv) {
        _get(_getPrototypeOf(Xom.prototype), "__offsetX", this).call(this, diff, isLayout);

        if (isLayout) {
          this.layoutData.x += diff;
        }

        if (lv !== undefined) {
          this.__refreshLevel |= lv;
        }
      }
    }, {
      key: "__offsetY",
      value: function __offsetY(diff, isLayout, lv) {
        _get(_getPrototypeOf(Xom.prototype), "__offsetY", this).call(this, diff, isLayout);

        if (isLayout) {
          this.layoutData.y += diff;
        }

        if (lv !== undefined) {
          this.__refreshLevel |= lv;
        }
      }
    }, {
      key: "__resizeX",
      value: function __resizeX(diff) {
        this.computedStyle.width = this.__width += diff;
        this.layoutData.w += diff;
      }
    }, {
      key: "__resizeY",
      value: function __resizeY(diff) {
        this.computedStyle.height = this.__height += diff;
        this.layoutData.h += diff;
      }
    }, {
      key: "__spreadByBoxShadowAndFilter",
      value: function __spreadByBoxShadowAndFilter(boxShadow, filter) {
        var ox = 0,
            oy = 0;

        if (Array.isArray(boxShadow)) {
          boxShadow.forEach(function (item) {
            var _item3 = _slicedToArray(item, 6),
                x = _item3[0],
                y = _item3[1],
                blur = _item3[2],
                spread = _item3[3],
                inset = _item3[5];

            if (inset !== 'inset') {
              var d = mx.int2convolution(blur);
              d += spread;
              ox = Math.max(ox, x + d);
              oy = Math.max(oy, y + d);
            }
          });
        }

        if (Array.isArray(filter)) {
          for (var i = 0, len = filter.length; i < len; i++) {
            var _filter$i = _slicedToArray(filter[i], 2),
                k = _filter$i[0],
                v = _filter$i[1];

            if (k === 'blur') {
              var d = mx.int2convolution(v);
              ox = Math.max(ox, d);
              oy = Math.max(oy, d);
            }
          }
        }

        return [ox, oy];
      }
    }, {
      key: "tagName",
      get: function get() {
        return this.__tagName;
      }
    }, {
      key: "innerWidth",
      get: function get() {
        var _this$computedStyle = this.computedStyle,
            display = _this$computedStyle.display,
            paddingRight = _this$computedStyle.paddingRight,
            paddingLeft = _this$computedStyle.paddingLeft;

        if (display === 'none') {
          return 0;
        }

        return this.width + paddingLeft + paddingRight;
      }
    }, {
      key: "innerHeight",
      get: function get() {
        var _this$computedStyle2 = this.computedStyle,
            display = _this$computedStyle2.display,
            paddingTop = _this$computedStyle2.paddingTop,
            paddingBottom = _this$computedStyle2.paddingBottom;

        if (display === 'none') {
          return 0;
        }

        return this.height + paddingTop + paddingBottom;
      }
    }, {
      key: "outerWidth",
      get: function get() {
        var _this$computedStyle3 = this.computedStyle,
            display = _this$computedStyle3.display,
            borderLeftWidth = _this$computedStyle3.borderLeftWidth,
            borderRightWidth = _this$computedStyle3.borderRightWidth,
            marginRight = _this$computedStyle3.marginRight,
            marginLeft = _this$computedStyle3.marginLeft;

        if (display === 'none') {
          return 0;
        }

        return this.innerWidth + borderLeftWidth + borderRightWidth + marginLeft + marginRight;
      }
    }, {
      key: "outerHeight",
      get: function get() {
        var _this$computedStyle4 = this.computedStyle,
            display = _this$computedStyle4.display,
            borderTopWidth = _this$computedStyle4.borderTopWidth,
            borderBottomWidth = _this$computedStyle4.borderBottomWidth,
            marginTop = _this$computedStyle4.marginTop,
            marginBottom = _this$computedStyle4.marginBottom;

        if (display === 'none') {
          return 0;
        }

        return this.innerHeight + borderTopWidth + borderBottomWidth + marginTop + marginBottom;
      } // 不考虑margin的范围

    }, {
      key: "bbox",
      get: function get() {
        var sx = this.sx,
            sy = this.sy,
            width = this.width,
            height = this.height,
            _this$computedStyle5 = this.computedStyle,
            borderTopWidth = _this$computedStyle5.borderTopWidth,
            borderRightWidth = _this$computedStyle5.borderRightWidth,
            borderBottomWidth = _this$computedStyle5.borderBottomWidth,
            borderLeftWidth = _this$computedStyle5.borderLeftWidth,
            marginTop = _this$computedStyle5.marginTop,
            marginLeft = _this$computedStyle5.marginLeft,
            paddingTop = _this$computedStyle5.paddingTop,
            paddingRight = _this$computedStyle5.paddingRight,
            paddingBottom = _this$computedStyle5.paddingBottom,
            paddingLeft = _this$computedStyle5.paddingLeft,
            boxShadow = _this$computedStyle5.boxShadow,
            filter = _this$computedStyle5.filter;

        var _this$__spreadByBoxSh = this.__spreadByBoxShadowAndFilter(boxShadow, filter),
            _this$__spreadByBoxSh2 = _slicedToArray(_this$__spreadByBoxSh, 2),
            ox = _this$__spreadByBoxSh2[0],
            oy = _this$__spreadByBoxSh2[1];

        sx += marginLeft;
        sy += marginTop;
        width += borderLeftWidth + paddingLeft + borderRightWidth + paddingRight;
        height += borderTopWidth + paddingTop + borderBottomWidth + paddingBottom;
        return [sx - ox, sy - oy, sx + width + ox, sy + height + oy];
      }
    }, {
      key: "listener",
      get: function get() {
        return this.__listener;
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
      key: "renderMatrix",
      get: function get() {
        return this.__renderMatrix;
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
      key: "animationList",
      get: function get() {
        return this.__animationList;
      } // 除IGNORE外的动画为有效的

    }, {
      key: "availableAnimating",
      get: function get() {
        var list = this.animationList;

        for (var i = 0, len = list.length; i < len; i++) {
          var item = list[i];

          if (item.animating && item.currentFrame) {
            var transition = item.currentFrame.transition;

            for (var _i11 = 0, _len6 = transition.length; _i11 < _len6; _i11++) {
              if (!o.isIgnore(transition[_i11].k)) {
                return true;
              }
            }
          }
        }

        return false;
      } // 除IGNORE/opacity/transform/filter/visibility外的动画为有影响的

    }, {
      key: "effectiveAnimating",
      get: function get() {
        var list = this.animationList;

        for (var i = 0, len = list.length; i < len; i++) {
          var item = list[i];

          if (item.animating && item.currentFrame) {
            var transition = item.currentFrame.transition;

            for (var _i12 = 0, _len7 = transition.length; _i12 < _len7; _i12++) {
              var k = transition[_i12].k;

              if (!o.isIgnore(k) || o$1.TRANSFORMS.hasOwnProperty(k) || k === 'opacity' || k === 'transform' || k === 'filter' || k === 'visibility') {
                return true;
              }
            }
          }
        }

        return false;
      } // 是否有display的动画，在none时执行其它的都可视为无效，影响缓存

    }, {
      key: "displayAnimating",
      get: function get() {
        var list = this.animationList;

        for (var i = 0, len = list.length; i < len; i++) {
          var item = list[i];

          if (item.animating && item.currentFrame) {
            var transition = item.currentFrame.transition;

            for (var _i13 = 0, _len8 = transition.length; _i13 < _len8; _i13++) {
              var k = transition[_i13].k;

              if (k === 'display') {
                return true;
              }
            }
          }
        }

        return false;
      } // 是否有visibility的动画，在为hidden时执行其它的都可视为无效，影响缓存

    }, {
      key: "visibilityAnimating",
      get: function get() {
        var list = this.animationList;

        for (var i = 0, len = list.length; i < len; i++) {
          var item = list[i];

          if (item.animating && item.currentFrame) {
            var transition = item.currentFrame.transition;

            for (var _i14 = 0, _len9 = transition.length; _i14 < _len9; _i14++) {
              var k = transition[_i14].k;

              if (k === 'visibility') {
                return true;
              }
            }
          }
        }

        return false;
      }
    }, {
      key: "currentStyle",
      get: function get() {
        return this.__currentStyle;
      }
    }, {
      key: "layoutData",
      get: function get() {
        return this.__layoutData;
      }
    }, {
      key: "isShadowRoot",
      get: function get() {
        return !this.parent && this.host && this.host !== this.root;
      }
    }]);

    return Xom;
  }(Node);

  var LineGroup = /*#__PURE__*/function () {
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
          item.__offsetX(diff, true);
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
          width += item.outerWidth;
        });
        return width;
      }
    }, {
      key: "height",
      get: function get() {
        var height = 0;
        this.list.forEach(function (item) {
          height = Math.max(height, item.outerHeight);
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
    }, {
      key: "marginBottom",
      get: function get() {
        var n = 0;
        this.list.forEach(function (item) {
          n = Math.max(n, item.computedStyle.marginBottom);
        });
        return n;
      }
    }]);

    return LineGroup;
  }();

  var TAG_NAME = {
    'div': true,
    'p': true,
    'span': true,
    'img': true,
    'b': true,
    'strong': true
  };
  var INLINE = {
    'span': true,
    'img': true,
    'b': true,
    'strong': true
  };
  var BOLD = {
    'b': true,
    'strong': true
  };
  var tag = {
    TAG_NAME: TAG_NAME,
    INLINE: INLINE,
    BOLD: BOLD
  };

  var TYPE_VD$1 = $$type.TYPE_VD,
      TYPE_GM$1 = $$type.TYPE_GM,
      TYPE_CP$1 = $$type.TYPE_CP;
  var Xom$1, Dom, Img, Geom, Component;

  function initRoot(cd, root) {
    var c = flattenJson({
      children: cd,
      $$type: TYPE_VD$1
    });
    var children = build(c.children, root, root);
    return relation(root, children);
  }

  function initCp(json, root, owner) {
    if (util.isObject(json)) {
      // cp的flatten在__init中自己做
      var vd = build(json, root, owner, owner);

      if (Array.isArray(vd)) {
        relation(owner, vd);
      }

      return vd;
    } else {
      return new Text(json);
    }
  }
  /**
   * 将初始json文件生成virtualDom
   * @param json
   * @param root
   * @param owner
   * @param host
   * @param hasP 出现过p标签
   * @returns vd
   */


  function build(json, root, owner, host, hasP) {
    if (Array.isArray(json)) {
      return json.map(function (item) {
        return build(item, root, owner, host);
      });
    }

    var vd;

    if (util.isObject(json) && json.$$type) {
      var tagName = json.tagName,
          props = json.props,
          children = json.children,
          klass = json.klass,
          _$$type = json.$$type,
          inherit = json.inherit,
          __animateRecords = json.__animateRecords; // 更新过程中无变化的cp直接使用原来生成的

      if (_$$type === TYPE_CP$1 && json.placeholder) {
        return json.value;
      }

      if (_$$type === TYPE_VD$1) {
        if (tagName === 'img') {
          vd = new Img(tagName, props);

          if (Array.isArray(children) && children.length) {
            throw new Error('Img can not contain children');
          }
        } else {
          vd = new Dom(tagName, props);
        } // 检查p不能包含div


        if (tagName === 'p') {
          hasP = true;
        } else if (tagName === 'div' && hasP) {
          throw new Error('Markup p can not contain div');
        }

        if (Array.isArray(children)) {
          children = relation(vd, build(children, root, owner, host, hasP));
        } else {
          children = [];
        }

        vd.__children = children;
      } else if (_$$type === TYPE_GM$1) {
        var _klass = Geom.getRegister(tagName);

        vd = new _klass(tagName, props);
      } else if (_$$type === TYPE_CP$1) {
        vd = new klass(props);
        vd.__tagName = vd.__tagName || tagName;
      } else {
        return new Text(json);
      } // 根parse需要用到真正的vd引用


      json.vd = vd; // 递归parse中的动画记录需特殊处理，将target改为真正的vd引用

      if (__animateRecords) {
        vd.__animateRecords = __animateRecords;

        __animateRecords.list.forEach(function (item) {
          item.target = vd;
        });
      } // 更新过程中key相同的vd继承动画


      if (inherit) {
        util.extendAnimate(inherit, vd);
      }

      vd.__root = root;

      if (host) {
        vd.__host = host;
      }

      if (_$$type === TYPE_CP$1) {
        vd.__init();
      }

      var ref = props.ref;

      if (util.isString(ref) && ref || util.isNumber(ref)) {
        owner.ref[ref] = vd;
      } else if (util.isFunction(ref)) {
        ref(vd);
      }

      return vd;
    }

    return new Text(json);
  }
  /**
   * 2. 打平children中的数组，变成一维
   * 3. 合并相连的Text节点，即string内容
   */


  function flattenJson(parent) {
    if (Array.isArray(parent)) {
      return parent.map(function (item) {
        return flattenJson(item);
      });
    } else if (!parent || [TYPE_VD$1, TYPE_GM$1, TYPE_CP$1].indexOf(parent.$$type) === -1 || !Array.isArray(parent.children)) {
      return parent;
    }

    var list = [];
    traverseJson(list, parent.children, {
      lastText: null
    });
    parent.children = list;
    return parent;
  }

  function traverseJson(list, children, options) {
    if (Array.isArray(children)) {
      children.forEach(function (item) {
        traverseJson(list, item, options);
      });
    } else if (children && (children.$$type === TYPE_VD$1 || children.$$type === TYPE_GM$1)) {
      if (['canvas', 'svg'].indexOf(children.tagName) > -1) {
        throw new Error('Can not nest canvas/svg');
      }

      if (children.$$type === TYPE_VD$1) {
        flattenJson(children.children);
      }

      list.push(children);
      options.lastText = null;
    } else if (children && children.$$type === TYPE_CP$1) {
      list.push(children); // 强制component即便返回text也形成一个独立的节点，合并在layout布局中做

      options.lastText = null;
    } // 排除掉空的文本，连续的text合并
    else if (!util.isNil(children) && children !== '') {
        if (options.lastText !== null) {
          list[list.length - 1] = options.lastText += children;
        } else {
          list.push(children);
        }
      }
  }
  /**
   * 设置关系，父子和兄弟
   * @param parent
   * @param children
   * @param options
   * @returns {Xom|Text|Component}
   */


  function relation(parent, children) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    if (Array.isArray(children)) {
      children.forEach(function (item) {
        relation(parent, item, options);
      });
    } else if (children instanceof Xom$1 || children instanceof Component || children instanceof Text) {
      children.__parent = parent;

      if (options.prev) {
        options.prev.__next = children;
        children.__prev = options.prev;
      }

      options.prev = children;

      if (children instanceof Dom) {
        relation(children, children.children);
      } // 文字视作为父节点的直接文字子节点
      else if (children instanceof Component) {
          var sr = children.shadowRoot;

          if (sr instanceof Text) {
            sr.__parent = parent;
          }
        }
    }

    return children;
  }

  var builder = {
    ref: function ref(o) {
      Xom$1 = o.Xom;
      Dom = o.Dom;
      Img = o.Img;
      Geom = o.Geom;
      Component = o.Component;
    },
    initRoot: initRoot,
    initCp: initCp,
    flattenJson: flattenJson,
    relation: relation,
    build: build
  };

  var isNil$5 = util.isNil,
      isFunction$4 = util.isFunction,
      clone$3 = util.clone,
      extend$2 = util.extend;
  /**
   * 向上设置cp类型叶子节点，表明从root到本节点这条链路有更新，使得无链路更新的节约递归
   * @param cp
   */

  function setUpdateFlag(cp) {
    cp.__hasUpdate = true;
    var host = cp.host;

    if (host) {
      setUpdateFlag(host);
    }
  }

  var Component$1 = /*#__PURE__*/function (_Event) {
    _inherits(Component, _Event);

    var _super = _createSuper(Component);

    function Component() {
      var _this;

      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Component);

      _this = _super.call(this);
      _this.__tagName = /(?:function|class)\s+([\w$]+)/.exec(_this.constructor.toString())[1]; // 构建工具中都是arr，手写可能出现hash情况

      if (Array.isArray(props)) {
        _this.props = util.arr2hash(props);
      } else {
        _this.props = props;
      }

      _this.__parent = null;
      _this.__host = null;
      _this.__ref = {};
      _this.__state = {};
      _this.__isMounted = false;
      return _this;
    }

    _createClass(Component, [{
      key: "setState",
      value: function setState(n, cb) {
        var _this2 = this;

        var self = this;

        if (isNil$5(n)) {
          n = {};
        } else if (isFunction$4(n)) {
          cb.call(self);
          return;
        } else {
          if (Object.keys(n).length === 0) {
            if (isFunction$4(cb)) {
              cb.call(self);
            }

            return;
          }

          var state = clone$3(self.state);
          n = extend$2(state, n);
        }

        var root = self.root;

        if (root && self.__isMounted) {
          root.delRefreshTask(self.__task);
          this.__task = {
            before: function before() {
              // 标识更新
              self.__nextState = n;
              setUpdateFlag(_this2);
            },
            after: function after() {
              if (isFunction$4(cb)) {
                cb.call(self);
              }
            },
            __state: true // 特殊标识来源让root刷新时识别

          };
          root.addRefreshTask(self.__task);
        } // 构造函数中调用还未render，
        else if (isFunction$4(cb)) {
            self.__state = n;
            cb.call(self);
          }
      }
      /**
       * build中调用初始化，json有值时是update过程才有，且处理过flatten
       * @param json
       * @private
       */

    }, {
      key: "__init",
      value: function __init(json) {
        var _this3 = this;

        var root = this.root;
        var cd = json || builder.flattenJson(this.render());
        var sr = builder.initCp(cd, root, this, this);
        this.__cd = cd;

        if (sr instanceof Text) {
          // 文字视作为父节点的直接文字子节点，在builder里做
          console.warn('Component render() return a text, should not inherit style/event');
        } else if (sr instanceof Node) {
          var style = css.normalize(this.props.style);
          var keys = Object.keys(style);
          extend$2(sr.style, style, keys);
          extend$2(sr.currentStyle, style, keys); // 事件添加到sr，以及自定义事件

          Object.keys(this.props).forEach(function (k) {
            var v = _this3.props[k];

            if (/^on[a-zA-Z]/.test(k)) {
              k = k.slice(2).toLowerCase();
              sr.listener[k] = v;
            } else if (/^on-[a-zA-Z\d_$]/.test(k)) {
              k = k.slice(3);

              _this3.on(k, v);
            }
          });
        } else if (sr instanceof Component) {
          // 本身build是递归的，子cp已经初始化了
          console.warn('Component render() return a component: ' + this.tagName + ' -> ' + sr.tagName + ', should not inherit style/event');
        } else {
          throw new Error('Component render() must return a dom/text: ' + this);
        } // shadow指向直接root，shadowRoot考虑到返回Component的递归


        this.__shadow = sr;
        sr.__host = this;

        while (sr instanceof Component) {
          sr = sr.shadowRoot;
        }

        sr.__host = this;
        this.__shadowRoot = sr;

        if (!this.__isMounted) {
          this.__isMounted = true;
          var componentDidMount = this.componentDidMount;

          if (isFunction$4(componentDidMount)) {
            root.once(Event.REFRESH, function () {
              componentDidMount.call(_this3);
            });
          }
        }
      }
    }, {
      key: "render",
      value: function render() {}
    }, {
      key: "__destroy",
      value: function __destroy() {
        if (this.isDestroyed) {
          return;
        }

        this.__isDestroyed = true;
        var componentWillUnmount = this.componentWillUnmount;

        if (isFunction$4(componentWillUnmount)) {
          componentWillUnmount.call(this);
          this.__isMounted = false;
        }

        this.root.delRefreshTask(this.__task);

        if (this.shadowRoot) {
          this.shadowRoot.__destroy();
        }

        this.__shadow = null;
        this.__shadowRoot = null;
        this.__parent = null;
      }
    }, {
      key: "__emitEvent",
      value: function __emitEvent(e) {
        var sr = this.shadowRoot;

        if (sr instanceof Text) {
          return;
        }

        var res = sr.__emitEvent(e);

        if (res) {
          e.target = this;
          return true;
        }
      }
    }, {
      key: "__computeMeasure",
      value: function __computeMeasure(renderMode, ctx, isHost, cb) {
        var sr = this.shadowRoot;

        if (sr instanceof Text) {
          sr.__computeMeasure(renderMode, ctx);
        } // 其它类型为Xom或Component
        else {
            sr.__computeMeasure(renderMode, ctx, true, cb);
          }
      }
    }, {
      key: "tagName",
      get: function get() {
        return this.__tagName;
      }
    }, {
      key: "shadow",
      get: function get() {
        return this.__shadow;
      }
    }, {
      key: "shadowRoot",
      get: function get() {
        return this.__shadowRoot;
      }
    }, {
      key: "root",
      get: function get() {
        return this.__root;
      }
    }, {
      key: "host",
      get: function get() {
        return this.__host;
      }
    }, {
      key: "parent",
      get: function get() {
        return this.__parent;
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
    }, {
      key: "isDestroyed",
      get: function get() {
        return this.__isDestroyed;
      }
    }]);

    return Component;
  }(Event);

  Object.keys(o.GEOM).concat(['x', 'y', 'ox', 'oy', 'sx', 'sy', 'width', 'height', 'outerWidth', 'outerHeight', 'innerWidth', 'innerHeight', 'style', 'animationList', 'animateStyle', 'currentStyle', 'computedStyle', 'currentProps', 'baseLine', 'virtualDom', 'mask', 'maskId', 'textWidth', 'content', 'lineBoxes', 'charWidthList', 'charWidth', 'layoutData', 'availableAnimating', 'effectiveAnimating', 'displayAnimating', 'visibilityAnimating', '__refreshLevel', '__cacheTotal', '__cache', 'bbox', '__struct']).forEach(function (fn) {
    Object.defineProperty(Component$1.prototype, fn, {
      get: function get() {
        var sr = this.shadowRoot;

        if (sr) {
          return sr[fn];
        }
      }
    });
  });
  ['__layout', '__layoutAbs', '__tryLayInline', '__offsetX', '__offsetY', '__calAutoBasis', '__calMp', '__calAbs', '__renderAsMask', '__renderByMask', '__mp', 'animate', 'removeAnimate', 'clearAnimate', 'updateStyle', 'deepScan', '__cancelCache', '__applyCache', '__mergeBbox', '__structure', '__modifyStruct'].forEach(function (fn) {
    Component$1.prototype[fn] = function () {
      var sr = this.shadowRoot;

      if (sr && isFunction$4(sr[fn])) {
        return sr[fn].apply(sr, arguments);
      }
    };
  });

  var refreshMode = {
    ROOT: 0,
    // 普通主屏递归渲染
    TOP: 1,
    // 局部根节点离屏汇总渲染
    CHILD: 2 // 局部根节点的子节点汇总渲染

  };

  var AUTO$3 = unit.AUTO,
      PX$5 = unit.PX,
      PERCENT$6 = unit.PERCENT;
  var int2rgba$3 = util.int2rgba,
      isNil$6 = util.isNil;
  var REGISTER = {};

  var Geom$1 = /*#__PURE__*/function (_Xom) {
    _inherits(Geom, _Xom);

    var _super = _createSuper(Geom);

    function Geom(tagName, props) {
      var _this;

      _classCallCheck(this, Geom);

      _this = _super.call(this, tagName, props);
      _this.__isMulti = !!_this.props.multi;
      _this.__isMask = !!_this.props.mask;
      _this.__isClip = !!_this.props.clip;

      var _assertThisInitialize = _assertThisInitialized(_this),
          style = _assertThisInitialize.style,
          isMask = _assertThisInitialize.isMask,
          isClip = _assertThisInitialize.isClip;

      if (isMask || isClip) {
        style.visibility = 'visible';
        style.background = null;
        style.border = null;
        style.strokeWidth = 0;
        style.stroke = null;

        if (isClip) {
          style.fill = '#FFF';
          style.opacity = 1;
        }
      }

      _this.__style = css.normalize(_this.style, reset.DOM_ENTRY_SET.concat(reset.GEOM_ENTRY_SET));
      _this.__currentStyle = util.extend({}, _this.__style);
      _this.__currentProps = util.clone(_this.props);
      _this.__cacheProps = {};
      return _this;
    }

    _createClass(Geom, [{
      key: "__tryLayInline",
      value: function __tryLayInline(w, total) {
        // 无children，直接以style的width为宽度，不定义则为0
        var width = this.currentStyle.width;

        if (width.unit === PX$5) {
          return w - width.value;
        } else if (width.unit === PERCENT$6) {
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

        if (main.unit !== AUTO$3) {
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
      value: function __layoutBlock(data, isVirtual) {
        var _this$__preLayout = this.__preLayout(data),
            fixedWidth = _this$__preLayout.fixedWidth,
            fixedHeight = _this$__preLayout.fixedHeight,
            w = _this$__preLayout.w,
            h = _this$__preLayout.h;

        this.__height = fixedHeight ? h : 0;

        if (isVirtual) {
          this.__width = fixedWidth ? w : 0;
          return;
        }

        this.__width = w;

        this.__marginAuto(this.currentStyle, data);

        this.__cacheProps = {};
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
        this.__cacheProps = {};
      }
    }, {
      key: "__preSet",
      value: function __preSet(renderMode, ctx, defs) {
        var _this2 = this;

        var x = this.sx,
            y = this.sy,
            width = this.width,
            height = this.height,
            __cacheStyle = this.__cacheStyle,
            currentStyle = this.currentStyle,
            computedStyle = this.computedStyle;
        var borderTopWidth = computedStyle.borderTopWidth,
            borderLeftWidth = computedStyle.borderLeftWidth,
            display = computedStyle.display,
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
        var ih = height + paddingTop + paddingBottom; // 先根据cache计算需要重新计算的computedStyle

        ['stroke', 'fill'].forEach(function (k) {
          if (isNil$6(__cacheStyle[k])) {
            var v = currentStyle[k];
            computedStyle[k] = v;

            if (v && (v.k === 'linear' || v.k === 'radial')) {
              __cacheStyle[k] = _this2.__gradient(renderMode, ctx, defs, originX, originY, originX + width, originY + height, iw, ih, v);
            } else {
              __cacheStyle[k] = int2rgba$3(currentStyle[k]);
            }
          }
        });

        if (isNil$6(__cacheStyle.strokeWidth)) {
          __cacheStyle.strokeWidth = true;
          var _strokeWidth = currentStyle.strokeWidth;

          if (_strokeWidth.unit === PX$5) {
            computedStyle.strokeWidth = _strokeWidth.value;
          } else if (_strokeWidth.unit === PERCENT$6) {
            computedStyle.strokeWidth = _strokeWidth.value * width * 0.01;
          } else {
            computedStyle.strokeWidth = 0;
          }
        }

        if (isNil$6(__cacheStyle.strokeDasharray)) {
          __cacheStyle.strokeDasharray = true;
          computedStyle.strokeDasharray = currentStyle.strokeDasharray;
          __cacheStyle.strokeDasharrayStr = util.joinArr(currentStyle.strokeDasharray, ',');
        } // 直接赋值的


        ['strokeLinecap', 'strokeLinejoin', 'strokeMiterlimit', 'fillRule'].forEach(function (k) {
          computedStyle[k] = currentStyle[k];
        });
        var fill = __cacheStyle.fill,
            stroke = __cacheStyle.stroke,
            strokeDasharrayStr = __cacheStyle.strokeDasharrayStr;
        var strokeWidth = computedStyle.strokeWidth,
            strokeLinecap = computedStyle.strokeLinecap,
            strokeLinejoin = computedStyle.strokeLinejoin,
            strokeMiterlimit = computedStyle.strokeMiterlimit,
            strokeDasharray = computedStyle.strokeDasharray,
            fillRule = computedStyle.fillRule;
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
          strokeDasharrayStr: strokeDasharrayStr,
          strokeLinecap: strokeLinecap,
          strokeLinejoin: strokeLinejoin,
          strokeMiterlimit: strokeMiterlimit,
          fill: fill,
          visibility: visibility,
          fillRule: fillRule
        };
      }
    }, {
      key: "__preSetCanvas",
      value: function __preSetCanvas(renderMode, ctx, res) {
        var stroke = res.stroke,
            strokeWidth = res.strokeWidth,
            strokeDasharray = res.strokeDasharray,
            strokeLinecap = res.strokeLinecap,
            strokeLinejoin = res.strokeLinejoin,
            strokeMiterlimit = res.strokeMiterlimit,
            fill = res.fill;

        if (renderMode === mode.CANVAS) {
          if (ctx.fillStyle !== fill) {
            ctx.fillStyle = fill;
          }

          if (ctx.strokeStyle !== stroke) {
            ctx.strokeStyle = stroke;
          }

          if (ctx.lineWidth !== strokeWidth) {
            ctx.lineWidth = strokeWidth;
          }

          if (ctx.lineCap !== strokeLinecap) {
            ctx.lineCap = strokeLinecap;
          }

          if (ctx.lineJoin !== strokeLinejoin) {
            ctx.lineJoin = strokeLinejoin;
          }

          if (ctx.miterLimit !== strokeMiterlimit) {
            ctx.miterLimit = strokeMiterlimit;
          } // 小程序没这个方法


          if (util.isFunction(ctx.getLineDash)) {
            if (!util.equalArr(ctx.getLineDash(), strokeDasharray)) {
              ctx.setLineDash(strokeDasharray);
            }
          } else {
            ctx.setLineDash(strokeDasharray);
          }
        }
      }
    }, {
      key: "render",
      value: function render(renderMode, lv, ctx, defs) {
        var res = _get(_getPrototypeOf(Geom.prototype), "render", this).call(this, renderMode, lv, ctx, defs);

        var cacheFilter = this.__cacheFilter,
            cacheTotal = this.__cacheTotal,
            cache = this.__cache;
        var virtualDom = this.virtualDom; // 存在老的缓存认为可提前跳出

        if (lv < o$1.REPAINT && (cacheTotal && cacheTotal.available || cache && cache.available || !o$1.contain(lv, o$1.FILTER) && cacheFilter)) {
          res["break"] = true; // geom子类标识可以跳过自定义render()
        }

        if (renderMode === mode.SVG) {
          // svg mock，每次都生成，每个节点都是局部根，更新时自底向上清除
          if (!cacheTotal) {
            this.__cacheTotal = {
              available: true,
              release: function release() {
                this.available = false;
                delete virtualDom.cache;
              }
            };
          } else if (!cacheTotal.available) {
            cacheTotal.available = true;
          }

          this.virtualDom.type = 'geom';
        } // 无论canvas/svg，break可提前跳出省略计算


        if (res["break"]) {
          return res;
        }

        this.__cacheFilter = null; // data在无cache时没有提前设置

        var preData = this.root.cache && renderMode === mode.CANVAS ? this.__preData : this.__preSet(renderMode, ctx, defs);
        var x2 = res.x2,
            y2 = res.y2;
        var originX = preData.originX,
            originY = preData.originY; // 有cache时需计算差值

        var _this$computedStyle = this.computedStyle,
            paddingLeft = _this$computedStyle.paddingLeft,
            paddingTop = _this$computedStyle.paddingTop;
        x2 += paddingLeft;
        y2 += paddingTop;
        preData.dx = x2 - originX;
        preData.dy = y2 - originY;

        this.__preSetCanvas(renderMode, ctx, preData);

        return Object.assign(res, preData);
      }
    }, {
      key: "__renderAsMask",
      value: function __renderAsMask(renderMode, lv, ctx, defs, isClip) {
        if (renderMode === mode.CANVAS) {
          this.root.cache && (this.__preData = this.__preSet(renderMode, ctx, defs));
        } // mask渲染在canvas等被遮罩层调用，svg生成maskId
        else if (renderMode === mode.SVG) {
            this.render(renderMode, lv, ctx, defs);
            var vd = this.virtualDom;

            if (isClip) {
              vd.isClip = true;
            } else {
              vd.isMask = true;
            } // 强制不缓存，防止引用mask的matrix变化不生效


            delete vd.lv;
          }
      } // 类似dom，但geom没有children所以没有total的概念

    }, {
      key: "__applyCache",
      value: function __applyCache(renderMode, lv, ctx, mode, cacheTop, opacity, matrix) {
        var cacheFilter = this.__cacheFilter;
        var cacheMask = this.__cacheMask;
        var cache = this.__cache;
        var computedStyle = this.computedStyle; // 优先filter，然后mask，再cache

        var target = cacheFilter || cacheMask; // 向总的离屏canvas绘制，最后由top汇总再绘入主画布

        if (mode === refreshMode.CHILD) {
          var x = this.sx,
              y = this.sy;
          x += computedStyle.marginLeft;
          y += computedStyle.marginTop;

          var _cacheTop$coords = _slicedToArray(cacheTop.coords, 2),
              tx = _cacheTop$coords[0],
              ty = _cacheTop$coords[1],
              x1 = cacheTop.x1,
              y1 = cacheTop.y1,
              dbx = cacheTop.dbx,
              dby = cacheTop.dby;

          var dx = tx + x - x1 + dbx;
          var dy = ty + y - y1 + dby;
          var tfo = computedStyle.transformOrigin.slice(0);
          tfo[0] += dx;
          tfo[1] += dy;
          var m = tf.calMatrixByOrigin(computedStyle.transform, tfo);
          matrix = mx.multiply(matrix, m);
          ctx.setTransform.apply(ctx, _toConsumableArray(matrix));
          opacity *= computedStyle.opacity;
          ctx.globalAlpha = opacity;

          if (target) {
            Cache.drawCache(target, cacheTop);
          } else if (cache && cache.available) {
            Cache.drawCache(cache, cacheTop);
          }
        } // root调用局部整体缓存或单个节点缓存绘入主画布
        else if (mode === refreshMode.ROOT) {
            var __opacity = this.__opacity,
                matrixEvent = this.matrixEvent; // 写回主画布前设置

            ctx.globalAlpha = __opacity;
            ctx.setTransform.apply(ctx, _toConsumableArray(matrixEvent));

            if (target) {
              var _x = target.x1,
                  _y = target.y1,
                  _dbx = target.dbx,
                  _dby = target.dby,
                  canvas = target.canvas;
              ctx.drawImage(canvas, _x - 1 - _dbx, _y - 1 - _dby);
            } else if (cache && cache.available) {
              var _cache$coords = _slicedToArray(cache.coords, 2),
                  _tx = _cache$coords[0],
                  _ty = _cache$coords[1],
                  _x2 = cache.x1,
                  _y2 = cache.y1,
                  _dbx2 = cache.dbx,
                  _dby2 = cache.dby,
                  _canvas = cache.canvas,
                  size = cache.size;

              ctx.drawImage(_canvas, _tx - 1, _ty - 1, size, size, _x2 - 1 - _dbx2, _y2 - 1 - _dby2, size, size);
            }
          }
      }
    }, {
      key: "__propsStrokeStyle",
      value: function __propsStrokeStyle(props, strokeDasharrayStr, strokeLinecap, strokeLinejoin, strokeMiterlimit) {
        if (strokeDasharrayStr) {
          props.push(['stroke-dasharray', strokeDasharrayStr]);
        }

        if (strokeLinecap !== 'butt') {
          props.push(['stroke-linecap', strokeLinecap]);
        }

        if (strokeLinejoin !== 'miter') {
          props.push(['stroke-linejoin', strokeLinejoin]);
        }

        if (strokeMiterlimit !== 4) {
          props.push(['stroke-miterlimit', strokeMiterlimit]);
        }
      }
    }, {
      key: "__cancelCache",
      value: function __cancelCache(recursion) {
        _get(_getPrototypeOf(Geom.prototype), "__cancelCache", this).call(this, recursion);

        this.__cacheProps = {};
      } // geom强制有内容

    }, {
      key: "__calCache",
      value: function __calCache() {
        _get(_getPrototypeOf(Geom.prototype), "__calCache", this).apply(this, arguments);

        return true;
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
      key: "getProps",
      value: function getProps(k) {
        var v = this.currentProps[k];

        if (!isNil$6(v)) {
          return v;
        }

        return this['__' + k];
      }
    }, {
      key: "baseLine",
      get: function get() {
        return this.__height;
      }
    }, {
      key: "isMulti",
      get: function get() {
        return this.__isMulti;
      }
    }, {
      key: "isMask",
      get: function get() {
        return this.__isMask;
      }
    }, {
      key: "isClip",
      get: function get() {
        return this.__isClip;
      }
    }, {
      key: "currentProps",
      get: function get() {
        return this.__currentProps;
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

  var AUTO$4 = unit.AUTO,
      PX$6 = unit.PX,
      PERCENT$7 = unit.PERCENT;
  var calAbsolute$1 = css.calAbsolute,
      isRelativeOrAbsolute$1 = css.isRelativeOrAbsolute;

  function genZIndexChildren(dom) {
    var flow = [];
    var abs = [];
    var needSort = false;
    var lastIndex;
    dom.children.forEach(function (item, i) {
      var child = item;

      if (item instanceof Component$1) {
        item = item.shadowRoot;
      } // 不是遮罩，并且已有__layoutData，特殊情况下中途插入的节点还未渲染


      if (!item.isMask && !item.isClip && (item.__layoutData || item instanceof Text)) {
        if (item instanceof Xom) {
          if (isRelativeOrAbsolute$1(item)) {
            // 临时变量为排序使用
            child.__iIndex = i;
            var z = child.__zIndex = item.currentStyle.zIndex;
            abs.push(child);

            if (lastIndex === undefined) {
              lastIndex = z;
            } else if (!needSort) {
              if (z < lastIndex) {
                needSort = true;
              }

              lastIndex = z;
            }
          } else {
            flow.push(child);
          }
        } else {
          flow.push(child);
        }
      }
    });
    needSort && abs.sort(function (a, b) {
      if (a.__zIndex !== b.__zIndex) {
        return a.__zIndex - b.__zIndex;
      }

      return a.__iIndex - b.__iIndex;
    });
    return flow.concat(abs);
  }

  function getMaskChildren(dom) {
    var list = [];
    dom.children.forEach(function (item) {
      var child = item;

      if (item instanceof Component$1) {
        item = item.shadowRoot;
      }

      if (item.isMask || item.isClip) {
        list.push(child);
      }
    });
    return list;
  }

  var Dom$1 = /*#__PURE__*/function (_Xom) {
    _inherits(Dom, _Xom);

    var _super = _createSuper(Dom);

    function Dom(tagName, props, children) {
      var _this;

      _classCallCheck(this, Dom);

      _this = _super.call(this, tagName, props);
      _this.__lineGroups = []; // 一行inline元素组成的LineGroup对象后的存放列表

      var _assertThisInitialize = _assertThisInitialized(_this),
          style = _assertThisInitialize.style;

      if (!style.display || !{
        flex: true,
        block: true,
        inline: true,
        none: true
      }.hasOwnProperty(style.display)) {
        if (tag.INLINE.hasOwnProperty(_this.tagName)) {
          style.display = 'inline';
        } else {
          style.display = 'block';
        }
      }

      if (!style.fontWeight && tag.BOLD.hasOwnProperty(tagName)) {
        style.fontWeight = 700;
      }

      _this.__style = css.normalize(style, reset.DOM_ENTRY_SET); // currentStyle/currentProps不深度clone，继承一层即可，动画时也是extend这样只改一层引用不动原始静态style

      _this.__currentStyle = util.extend({}, _this.__style);
      _this.__children = children || [];
      return _this;
    }

    _createClass(Dom, [{
      key: "__structure",
      value: function __structure(i, lv, j) {
        var res = _get(_getPrototypeOf(Dom.prototype), "__structure", this).call(this, i++, lv, j);

        var arr = [res];
        var zIndexChildren = this.__zIndexChildren = this.__zIndexChildren || genZIndexChildren(this);

        if (this.root.cache && this.root.renderMode === mode.CANVAS) {
          var maskChildren = this.__maskChildren = this.__maskChildren || getMaskChildren(this);

          if (maskChildren.length) {
            zIndexChildren = maskChildren.concat(zIndexChildren);
          }
        }

        zIndexChildren.forEach(function (child, j) {
          var temp = child.__structure(i, lv + 1, j);

          if (Array.isArray(temp)) {
            i += temp.length;
            arr = arr.concat(temp);
          } else {
            i++;
            arr.push(temp);
          }
        });
        res.num = zIndexChildren.length;
        res.total = arr.length - 1;
        return arr;
      }
    }, {
      key: "__modifyStruct",
      value: function __modifyStruct(root) {
        var _root$__structs;

        var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var struct = this.__struct;

        var ns = this.__structure(struct.index, struct.lv, struct.childIndex);

        (_root$__structs = root.__structs).splice.apply(_root$__structs, [struct.index + offset, struct.total + 1].concat(_toConsumableArray(ns)));

        var d = 0;

        if (this !== root) {
          var _d = this.__struct.total - struct.total;

          struct = this.domParent.__struct;
          struct.total += _d;
        }

        return [this.__struct, d];
      }
      /**
       * 因为zIndex的变化造成的更新，只需重排这一段顺序即可
       * 即便包含component造成的dom变化也不影响，component作为子节点reflow会再执行，这里重排老的vd
       * @param structs
       * @private
       */

    }, {
      key: "__updateStruct",
      value: function __updateStruct(structs) {
        var _this$__struct = this.__struct,
            index = _this$__struct.index,
            total = _this$__struct.total;
        var zIndexChildren = this.__zIndexChildren = genZIndexChildren(this);
        zIndexChildren.forEach(function (child, i) {
          child.__struct.childIndex = i;
        }); // 按直接子节点划分为相同数量的若干段进行排序

        var arr = [];

        for (var i = index + 1; i <= total; i++) {
          var child = structs[i];
          arr.push({
            child: child,
            list: structs.slice(child.index, child.index + child.total + 1)
          });
          i += child.total;
        }

        var needSort;
        arr.sort(function (a, b) {
          var res = a.child.childIndex - b.child.childIndex;

          if (res < 0) {
            needSort = true;
          }

          return res;
        });

        if (needSort) {
          var list = [];
          arr.forEach(function (item) {
            list = list.concat(item.list);
          });
          list.forEach(function (struct, i) {
            struct.index = index + i + 1;
          });
          structs.splice.apply(structs, [index + 1, total].concat(_toConsumableArray(list)));
        }
      } // 给定父宽度情况下，尝试行内放下后的剩余宽度，为负数即放不下

    }, {
      key: "__tryLayInline",
      value: function __tryLayInline(w, total) {
        var flowChildren = this.flowChildren,
            width = this.currentStyle.width;

        if (width.unit === PX$6) {
          return w - width.value;
        } else if (width.unit === PERCENT$7) {
          return w - total * width.value * 0.01;
        }

        for (var i = 0; i < flowChildren.length; i++) {
          // 当放不下时直接返回，无需继续多余的尝试计算
          if (w < 0) {
            return w;
          }

          var item = flowChildren[i];

          if (item instanceof Xom || item instanceof Component$1) {
            w -= item.__tryLayInline(w, total);
          } else {
            w -= item.textWidth;
          }
        }

        return w;
      } // 设置y偏移值，递归包括children，此举在justify-content/margin-auto等对齐用

    }, {
      key: "__offsetX",
      value: function __offsetX(diff, isLayout, lv) {
        _get(_getPrototypeOf(Dom.prototype), "__offsetX", this).call(this, diff, isLayout, lv);

        this.flowChildren.forEach(function (item) {
          if (item) {
            item.__offsetX(diff, isLayout, lv);
          }
        });
      }
    }, {
      key: "__offsetY",
      value: function __offsetY(diff, isLayout, lv) {
        _get(_getPrototypeOf(Dom.prototype), "__offsetY", this).call(this, diff, isLayout, lv);

        this.flowChildren.forEach(function (item) {
          if (item) {
            item.__offsetY(diff, isLayout, lv);
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
            paddingBottom = currentStyle.paddingBottom,
            borderTopWidth = currentStyle.borderTopWidth,
            borderRightWidth = currentStyle.borderRightWidth,
            borderBottomWidth = currentStyle.borderBottomWidth,
            borderLeftWidth = currentStyle.borderLeftWidth;
        var main = isDirectionRow ? width : height;

        if (main.unit === PX$6) {
          b = max = main.value; // 递归时children的长度会影响flex元素的最小宽度

          if (isRecursion) {
            min = b;
          }
        } // 递归children取最大值


        flowChildren.forEach(function (item) {
          if (item instanceof Xom || item instanceof Component$1 && item.shadowRoot instanceof Xom) {
            var _item$__calAutoBasis = item.__calAutoBasis(isDirectionRow, w, h, true),
                b2 = _item$__calAutoBasis.b,
                min2 = _item$__calAutoBasis.min,
                max2 = _item$__calAutoBasis.max;

            b = Math.max(b, b2);
            min = Math.max(min, min2);
            max = Math.max(max, max2);
          } // 文本水平
          else if (isDirectionRow) {
              min = Math.max(item.charWidth, min);
              max = Math.max(item.textWidth, max);
            } // 文本垂直
            else {
                css.computeReflow(item);

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

          var w2 = borderLeftWidth.value + borderRightWidth.value + mp;
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

        if (v.unit === PX$6) {
          n += v.value;
        } else if (v.unit === PERCENT$7) {
          v.value *= w * 0.01;
          v.unit = PX$6;
          n += v.value;
        }

        return n;
      } // 本身block布局时计算好所有子元素的基本位置

    }, {
      key: "__layoutBlock",
      value: function __layoutBlock(data, isVirtual) {
        var flowChildren = this.flowChildren,
            currentStyle = this.currentStyle,
            computedStyle = this.computedStyle,
            lineGroups = this.lineGroups;
        lineGroups.splice(0);
        var textAlign = computedStyle.textAlign;

        var _this$__preLayout = this.__preLayout(data),
            fixedWidth = _this$__preLayout.fixedWidth,
            fixedHeight = _this$__preLayout.fixedHeight,
            x = _this$__preLayout.x,
            y = _this$__preLayout.y,
            w = _this$__preLayout.w,
            h = _this$__preLayout.h;

        if (fixedWidth && isVirtual) {
          this.__width = w;
          return;
        } // 因精度问题，统计宽度均从0开始累加每行，最后取最大值，仅在abs布局时isVirtual生效


        var maxW = 0;
        var cw = 0; // 递归布局，将inline的节点组成lineGroup一行

        var lineGroup = new LineGroup(x, y);
        flowChildren.forEach(function (item) {
          if (item instanceof Xom || item instanceof Component$1 && item.shadowRoot instanceof Xom) {
            if (item.currentStyle.display === 'inline') {
              // inline开头，不用考虑是否放得下直接放
              if (x === data.x) {
                lineGroup.add(item);

                item.__layout({
                  x: x,
                  y: y,
                  w: w,
                  h: h
                }, isVirtual);

                x += item.outerWidth;

                if (isVirtual) {
                  maxW = Math.max(maxW, cw);
                  cw = item.outerWidth;
                }
              } else {
                // 非开头先尝试是否放得下
                var fw = item.__tryLayInline(w - x + data.x, w); // 放得下继续


                if (fw >= 0) {
                  item.__layout({
                    x: x,
                    y: y,
                    w: w,
                    h: h
                  }, isVirtual);
                } // 放不下处理之前的lineGroup，并重新开头
                else {
                    lineGroups.push(lineGroup);

                    if (!isVirtual) {
                      lineGroup.verticalAlign();
                    }

                    x = data.x;
                    y += lineGroup.height + lineGroup.marginBottom;

                    item.__layout({
                      x: data.x,
                      y: y,
                      w: w,
                      h: h
                    }, isVirtual);

                    lineGroup = new LineGroup(x, y);

                    if (isVirtual) {
                      maxW = Math.max(maxW, cw);
                      cw = 0;
                    }
                  }

                x += item.outerWidth;
                lineGroup.add(item);

                if (isVirtual) {
                  cw += item.outerWidth;
                }
              }
            } else {
              // block/flex先处理之前可能的lineGroup
              if (lineGroup.size) {
                lineGroups.push(lineGroup);
                lineGroup.verticalAlign();
                y += lineGroup.height + lineGroup.marginBottom;
                lineGroup = new LineGroup(data.x, y);

                if (isVirtual) {
                  maxW = Math.max(maxW, cw);
                  cw = 0;
                }
              }

              item.__layout({
                x: data.x,
                y: y,
                w: w,
                h: h
              }, isVirtual);

              x = data.x;
              y += item.outerHeight;

              if (isVirtual) {
                maxW = Math.max(maxW, item.outerWidth);
                cw = 0;
              }
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
                }, isVirtual);

                x += item.width;

                if (isVirtual) {
                  maxW = Math.max(maxW, cw);
                  cw = item.width;
                }
              } else {
                // 非开头先尝试是否放得下
                var _fw = item.__tryLayInline(w - x + data.x); // 放得下继续


                if (_fw >= 0) {
                  item.__layout({
                    x: x,
                    y: y,
                    w: w,
                    h: h
                  }, isVirtual);
                } // 放不下处理之前的lineGroup，并重新开头
                else {
                    lineGroups.push(lineGroup);
                    lineGroup.verticalAlign();
                    x = data.x;
                    y += lineGroup.height + lineGroup.marginBottom;

                    item.__layout({
                      x: data.x,
                      y: y,
                      w: w,
                      h: h
                    }, isVirtual);

                    lineGroup = new LineGroup(x, y);

                    if (isVirtual) {
                      maxW = Math.max(maxW, cw);
                      cw = 0;
                    }
                  }

                x += item.width;
                lineGroup.add(item);

                if (isVirtual) {
                  cw += item.width;
                }
              }
            }
        }); // 结束后处理可能遗留的最后的lineGroup

        if (lineGroup.size) {
          lineGroups.push(lineGroup); // flex/abs的虚拟前置布局，无需真正计算

          if (!isVirtual) {
            lineGroup.verticalAlign();
          } else {
            maxW = Math.max(maxW, cw);
          }

          y += lineGroup.height;
        }

        this.__width = fixedWidth || !isVirtual ? w : maxW;
        this.__height = fixedHeight ? h : y - data.y;

        if (lineGroup.size) {
          y += lineGroup.marginBottom;
        } // text-align


        if (!isVirtual && ['center', 'right'].indexOf(textAlign) > -1) {
          lineGroups.forEach(function (lineGroup) {
            var diff = w - lineGroup.width;

            if (diff > 0) {
              lineGroup.horizonAlign(textAlign === 'center' ? diff * 0.5 : diff);
            }
          });
        }

        if (!isVirtual) {
          this.__marginAuto(currentStyle, data);
        }
      } // 弹性布局时的计算位置

    }, {
      key: "__layoutFlex",
      value: function __layoutFlex(data, isVirtual) {
        var flowChildren = this.flowChildren,
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

        if (fixedWidth && isVirtual) {
          this.__width = w;
          return;
        }

        var maxX = 0;
        var isDirectionRow = flexDirection === 'row'; // 计算伸缩基数

        var growList = [];
        var shrinkList = [];
        var basisList = [];
        var minList = [];
        var growSum = 0;
        var shrinkSum = 0;
        var basisSum = 0;
        var maxSum = 0;
        flowChildren.forEach(function (item) {
          if (item instanceof Xom || item instanceof Component$1 && item.shadowRoot instanceof Xom) {
            // abs虚拟布局计算时纵向也是看横向宽度
            var _item$__calAutoBasis2 = item.__calAutoBasis(isVirtual ? true : isDirectionRow, w, h),
                b = _item$__calAutoBasis2.b,
                min = _item$__calAutoBasis2.min,
                max = _item$__calAutoBasis2.max;

            if (isVirtual) {
              if (isDirectionRow) {
                maxX += max;
              } else {
                maxX = Math.max(maxX, max);
              }

              return;
            }

            var _currentStyle = item.currentStyle,
                computedStyle = item.computedStyle;
            var flexGrow = _currentStyle.flexGrow,
                flexShrink = _currentStyle.flexShrink,
                flexBasis = _currentStyle.flexBasis;
            growList.push(flexGrow);
            shrinkList.push(flexShrink);
            growSum += flexGrow;
            shrinkSum += flexShrink; // 根据basis不同，计算方式不同

            if (flexBasis.unit === AUTO$4) {
              basisList.push(max);
              basisSum += max;
            } else if (flexBasis.unit === PX$6) {
              computedStyle.flexBasis = b = flexBasis.value;
              basisList.push(b);
              basisSum += b;
            } else if (flexBasis.unit === PERCENT$7) {
              b = computedStyle.flexBasis = (isDirectionRow ? w : h) * flexBasis.value * 0.01;
              basisList.push(b);
              basisSum += b;
            }

            maxSum += max;
            minList.push(min);
          } // 文本
          else {
              if (isVirtual) {
                if (isDirectionRow) {
                  maxX += item.textWidth;
                } else {
                  maxX = Math.max(maxX, item.textWidth);
                }

                return;
              }

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

        if (isVirtual) {
          this.__width = Math.min(maxX, w);
          return;
        }

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

          if (item instanceof Xom || item instanceof Component$1 && item.shadowRoot instanceof Xom) {
            var _currentStyle2 = item.currentStyle,
                computedStyle = item.computedStyle;
            var display = _currentStyle2.display,
                _flexDirection = _currentStyle2.flexDirection,
                width = _currentStyle2.width,
                height = _currentStyle2.height; // flex的child如果是inline，变为block

            if (display === 'inline') {
              _currentStyle2.display = computedStyle.display = 'block';
            }

            if (isDirectionRow) {
              // 横向flex的child如果是竖向flex，高度自动的话要等同于父flex的高度
              if (display === 'flex' && _flexDirection === 'column' && fixedHeight && height.unit === AUTO$4) {
                height.value = h;
                height.unit = PX$6;
              }

              item.__layout({
                x: x,
                y: y,
                w: main,
                h: h
              });
            } else {
              // 竖向flex的child如果是横向flex，宽度自动的话要等同于父flex的宽度
              if (display === 'flex' && _flexDirection === 'row' && width.unit === AUTO$4) {
                width.value = w;
                width.unit = PX$6;
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


        if (!isVirtual) {
          if (alignItems === 'stretch') {
            // 短侧轴的children伸张侧轴长度至相同，超过的不动，固定宽高的也不动
            flowChildren.forEach(function (item) {
              var computedStyle = item.computedStyle,
                  _item$currentStyle = item.currentStyle,
                  alignSelf = _item$currentStyle.alignSelf,
                  width = _item$currentStyle.width,
                  height = _item$currentStyle.height;
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
                if (alignSelf === 'flex-start') ; else if (alignSelf === 'center') {
                  var _diff = maxCross - item.outerHeight;

                  if (_diff !== 0) {
                    item.__offsetY(_diff * 0.5, true);
                  }
                } else if (alignSelf === 'flex-end') {
                  var _diff2 = maxCross - item.outerHeight;

                  if (_diff2 !== 0) {
                    item.__offsetY(_diff2, true);
                  }
                } else if (height.unit === AUTO$4) {
                  item.__height = computedStyle.height = maxCross - marginTop - marginBottom - paddingTop - paddingBottom - borderTopWidth - borderBottomWidth;
                }
              } else {
                if (alignSelf === 'flex-start') ; else if (alignSelf === 'center') {
                  var _diff3 = maxCross - item.outerWidth;

                  if (_diff3 !== 0) {
                    item.__offsetX(_diff3 * 0.5, true);
                  }
                } else if (alignSelf === 'flex-end') {
                  var _diff4 = maxCross - item.outerWidth;

                  if (_diff4 !== 0) {
                    item.__offsetX(_diff4, true);
                  }
                } else if (width.unit === AUTO$4) {
                  item.__width = computedStyle.width = maxCross - marginLeft - marginRight - paddingLeft - paddingRight - borderRightWidth - borderLeftWidth;
                }
              }
            });
          } else if (alignItems === 'center') {
            flowChildren.forEach(function (item) {
              var alignSelf = item.currentStyle.alignSelf;

              if (isDirectionRow) {
                if (alignSelf === 'flex-start') ; else if (alignSelf === 'flex-end') {
                  var _diff5 = maxCross - item.outerHeight;

                  if (_diff5 !== 0) {
                    item.__offsetY(_diff5, true);
                  }
                } else if (alignSelf === 'stretch') {
                  var computedStyle = item.computedStyle,
                      height = item.currentStyle.height;
                  var borderTopWidth = computedStyle.borderTopWidth,
                      borderBottomWidth = computedStyle.borderBottomWidth,
                      marginTop = computedStyle.marginTop,
                      marginBottom = computedStyle.marginBottom,
                      paddingTop = computedStyle.paddingTop,
                      paddingBottom = computedStyle.paddingBottom;

                  if (height.unit === AUTO$4) {
                    item.__height = computedStyle.height = maxCross - marginTop - marginBottom - paddingTop - paddingBottom - borderTopWidth - borderBottomWidth;
                  }
                } else {
                  var _diff6 = maxCross - item.outerHeight;

                  if (_diff6 !== 0) {
                    item.__offsetY(_diff6 * 0.5, true);
                  }
                }
              } else {
                if (alignSelf === 'flex-start') ; else if (alignSelf === 'flex-end') {
                  var _diff7 = maxCross - item.outerWidth;

                  if (_diff7 !== 0) {
                    item.__offsetX(_diff7, true);
                  }
                } else if (alignSelf === 'stretch') {
                  var _computedStyle = item.computedStyle,
                      width = item.currentStyle.width;
                  var borderRightWidth = _computedStyle.borderRightWidth,
                      borderLeftWidth = _computedStyle.borderLeftWidth,
                      marginRight = _computedStyle.marginRight,
                      marginLeft = _computedStyle.marginLeft,
                      paddingRight = _computedStyle.paddingRight,
                      paddingLeft = _computedStyle.paddingLeft;

                  if (width.unit === AUTO$4) {
                    item.__width = _computedStyle.width = maxCross - marginLeft - marginRight - paddingLeft - paddingRight - borderRightWidth - borderLeftWidth;
                  }
                } else {
                  var _diff8 = maxCross - item.outerWidth;

                  if (_diff8 !== 0) {
                    item.__offsetX(_diff8 * 0.5, true);
                  }
                }
              }
            });
          } else if (alignItems === 'flex-end') {
            flowChildren.forEach(function (item) {
              var alignSelf = item.currentStyle.alignSelf;

              if (isDirectionRow) {
                if (alignSelf === 'flex-start') ; else if (alignSelf === 'center') {
                  var _diff9 = maxCross - item.outerHeight;

                  if (_diff9 !== 0) {
                    item.__offsetY(_diff9 * 0.5, true);
                  }
                } else if (alignSelf === 'stretch') {
                  var computedStyle = item.computedStyle,
                      height = item.currentStyle.height;
                  var borderTopWidth = computedStyle.borderTopWidth,
                      borderBottomWidth = computedStyle.borderBottomWidth,
                      marginTop = computedStyle.marginTop,
                      marginBottom = computedStyle.marginBottom,
                      paddingTop = computedStyle.paddingTop,
                      paddingBottom = computedStyle.paddingBottom;

                  if (height.unit === AUTO$4) {
                    item.__height = computedStyle.height = maxCross - marginTop - marginBottom - paddingTop - paddingBottom - borderTopWidth - borderBottomWidth;
                  }
                } else {
                  var _diff10 = maxCross - item.outerHeight;

                  if (_diff10 !== 0) {
                    item.__offsetY(_diff10, true);
                  }
                }
              } else {
                if (alignSelf === 'flex-start') ; else if (alignSelf === 'center') {
                  var _diff11 = maxCross - item.outerWidth;

                  if (_diff11 !== 0) {
                    item.__offsetX(_diff11 * 0.5, true);
                  }
                } else if (alignSelf === 'stretch') {
                  var _computedStyle2 = item.computedStyle,
                      width = item.currentStyle.width;
                  var borderRightWidth = _computedStyle2.borderRightWidth,
                      borderLeftWidth = _computedStyle2.borderLeftWidth,
                      marginRight = _computedStyle2.marginRight,
                      marginLeft = _computedStyle2.marginLeft,
                      paddingRight = _computedStyle2.paddingRight,
                      paddingLeft = _computedStyle2.paddingLeft;

                  if (width.unit === AUTO$4) {
                    item.__width = _computedStyle2.width = maxCross - marginLeft - marginRight - paddingLeft - paddingRight - borderRightWidth - borderLeftWidth;
                  }
                } else {
                  var _diff12 = maxCross - item.outerHeight;

                  if (_diff12 !== 0) {
                    item.__offsetY(_diff12, true);
                  }
                }
              }
            });
          } else {
            flowChildren.forEach(function (item) {
              var alignSelf = item.currentStyle.alignSelf;

              if (isDirectionRow) {
                if (alignSelf === 'flex-start') ; else if (alignSelf === 'center') {
                  var _diff13 = maxCross - item.outerHeight;

                  if (_diff13 !== 0) {
                    item.__offsetY(_diff13 * 0.5, true);
                  }
                } else if (alignSelf === 'flex-end') {
                  var _diff14 = maxCross - item.outerHeight;

                  if (_diff14 !== 0) {
                    item.__offsetY(_diff14, true);
                  }
                } else if (alignSelf === 'stretch') {
                  var computedStyle = item.computedStyle,
                      height = item.currentStyle.height;
                  var borderTopWidth = computedStyle.borderTopWidth,
                      borderBottomWidth = computedStyle.borderBottomWidth,
                      marginTop = computedStyle.marginTop,
                      marginBottom = computedStyle.marginBottom,
                      paddingTop = computedStyle.paddingTop,
                      paddingBottom = computedStyle.paddingBottom;

                  if (height.unit === AUTO$4) {
                    item.__height = computedStyle.height = maxCross - marginTop - marginBottom - paddingTop - paddingBottom - borderTopWidth - borderBottomWidth;
                  }
                }
              } else {
                if (alignSelf === 'flex-start') ; else if (alignSelf === 'center') {
                  var _diff15 = maxCross - item.outerWidth;

                  if (_diff15 !== 0) {
                    item.__offsetX(_diff15 * 0.5, true);
                  }
                } else if (alignSelf === 'flex-end') {
                  var _diff16 = maxCross - item.outerWidth;

                  if (_diff16 !== 0) {
                    item.__offsetX(_diff16, true);
                  }
                } else if (alignSelf === 'stretch') {
                  var _computedStyle3 = item.computedStyle,
                      width = item.currentStyle.width;
                  var borderRightWidth = _computedStyle3.borderRightWidth,
                      borderLeftWidth = _computedStyle3.borderLeftWidth,
                      marginRight = _computedStyle3.marginRight,
                      marginLeft = _computedStyle3.marginLeft,
                      paddingRight = _computedStyle3.paddingRight,
                      paddingLeft = _computedStyle3.paddingLeft;

                  if (width.unit === AUTO$4) {
                    item.__width = _computedStyle3.width = maxCross - marginLeft - marginRight - paddingLeft - paddingRight - borderRightWidth - borderLeftWidth;
                  }
                }
              }
            });
          }
        }

        this.__width = w;
        this.__height = fixedHeight ? h : y - data.y;

        this.__marginAuto(currentStyle, data);
      } // inline比较特殊，先简单顶部对其，后续还需根据vertical和lineHeight计算y偏移

    }, {
      key: "__layoutInline",
      value: function __layoutInline(data, isVirtual) {
        var _this2 = this;

        var flowChildren = this.flowChildren,
            computedStyle = this.computedStyle,
            lineGroups = this.lineGroups;
        lineGroups.splice(0);
        var textAlign = computedStyle.textAlign;

        var _this$__preLayout3 = this.__preLayout(data),
            fixedWidth = _this$__preLayout3.fixedWidth,
            fixedHeight = _this$__preLayout3.fixedHeight,
            x = _this$__preLayout3.x,
            y = _this$__preLayout3.y,
            w = _this$__preLayout3.w,
            h = _this$__preLayout3.h;

        if (fixedWidth && isVirtual) {
          this.__width = w;
          return;
        } // 因精度问题，统计宽度均从0开始累加每行，最后取最大值，仅在abs布局时isVirtual生效


        var maxW = 0;
        var cw = 0; // 递归布局，将inline的节点组成lineGroup一行

        var lineGroup = new LineGroup(x, y);
        flowChildren.forEach(function (item) {
          if (item instanceof Xom || item instanceof Component$1 && item.shadowRoot instanceof Xom) {
            if (item.currentStyle.display !== 'inline') {
              item.currentStyle.display = item.computedStyle.display = 'inline';
              console.error('Inline can not contain block/flex');
            } // inline开头，不用考虑是否放得下直接放


            if (x === data.x) {
              lineGroup.add(item);

              item.__layout({
                x: x,
                y: y,
                w: w,
                h: h
              }, isVirtual);

              x += item.outerWidth;
              maxW = Math.max(maxW, cw);
              cw = item.outerWidth;
            } else {
              // 非开头先尝试是否放得下
              var fw = item.__tryLayInline(w - x + data.x, w); // 放得下继续


              if (fw >= 0) {
                item.__layout({
                  x: x,
                  y: y,
                  w: w,
                  h: h
                }, isVirtual);
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
                  }, isVirtual);

                  lineGroup = new LineGroup(x, y);
                  maxW = Math.max(maxW, cw);
                  cw = 0;
                }

              x += item.outerWidth;
              lineGroup.add(item);
              cw += item.outerWidth;
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
                }, isVirtual);

                x += item.width;
                maxW = Math.max(maxW, cw);
                cw = item.width;
              } else {
                // 非开头先尝试是否放得下
                var _fw2 = item.__tryLayInline(w - x + data.x); // 放得下继续


                if (_fw2 >= 0) {
                  item.__layout({
                    x: x,
                    y: y,
                    w: w,
                    h: h
                  }, isVirtual);
                } // 放不下处理之前的lineGroup，并重新开头
                else {
                    lineGroups.push(lineGroup);

                    if (!isVirtual) {
                      lineGroup.verticalAlign();
                    }

                    x = data.x;
                    y += lineGroup.height;

                    item.__layout({
                      x: data.x,
                      y: y,
                      w: w,
                      h: h
                    }, isVirtual);

                    lineGroup = new LineGroup(x, y);
                    maxW = Math.max(maxW, cw);
                    cw = 0;
                  }

                x += item.width;
                lineGroup.add(item);
                cw += item.width;
              }
            }
        }); // 结束后处理可能遗留的最后的lineGroup，children为空时可能size为空

        if (lineGroup.size) {
          lineGroups.push(lineGroup); // flex/abs的虚拟前置布局，无需真正计算

          if (!isVirtual) {
            lineGroup.verticalAlign();
          }

          y += lineGroup.height;
          maxW = Math.max(maxW, cw);
        } // 元素的width不能超过父元素w


        this.__width = fixedWidth ? w : maxW;
        this.__height = fixedHeight ? h : y - data.y; // text-align

        if (!isVirtual && ['center', 'right'].indexOf(textAlign) > -1) {
          lineGroups.forEach(function (lineGroup) {
            var diff = _this2.__width - lineGroup.width;

            if (diff > 0) {
              lineGroup.horizonAlign(textAlign === 'center' ? diff * 0.5 : diff);
            }
          });
        }
      }
      /**
       * 只针对绝对定位children布局
       * @param container
       * @param data
       * @param target 可选，只针对某个abs的child特定布局，在局部更新时用
       * @private
       */

    }, {
      key: "__layoutAbs",
      value: function __layoutAbs(container, data, target) {
        var x = container.sx,
            y = container.sy,
            innerWidth = container.innerWidth,
            innerHeight = container.innerHeight,
            computedStyle = container.computedStyle;
        var isDestroyed = this.isDestroyed,
            children = this.children,
            absChildren = this.absChildren;
        var display = computedStyle.display,
            borderTopWidth = computedStyle.borderTopWidth,
            borderLeftWidth = computedStyle.borderLeftWidth,
            marginTop = computedStyle.marginTop,
            marginLeft = computedStyle.marginLeft,
            paddingLeft = computedStyle.paddingLeft;

        if (isDestroyed || display === 'none') {
          return;
        }

        x += marginLeft + borderLeftWidth;
        y += marginTop + borderTopWidth; // 对absolute的元素进行相对容器布局

        absChildren.forEach(function (item) {
          if (target && target !== item) {
            return;
          }

          var currentStyle = item.currentStyle,
              computedStyle = item.computedStyle; // 先根据容器宽度计算margin/padding

          item.__mp(currentStyle, computedStyle, innerWidth);

          if (computedStyle.display === 'inline') {
            currentStyle.display = computedStyle.display = 'block';
          }

          var left = currentStyle.left,
              top = currentStyle.top,
              right = currentStyle.right,
              bottom = currentStyle.bottom,
              width = currentStyle.width,
              height = currentStyle.height,
              display = currentStyle.display,
              flexDirection = currentStyle.flexDirection;
          var x2, y2, w2, h2;
          var onlyRight;
          var onlyBottom;
          var fixedTop;
          var fixedRight;
          var fixedBottom;
          var fixedLeft; // 判断何种方式的定位，比如左+宽度，左+右之类

          if (left.unit !== AUTO$4) {
            fixedLeft = true;
            computedStyle.left = calAbsolute$1(currentStyle, 'left', left, innerWidth);
          } else {
            computedStyle.left = 'auto';
          }

          if (right.unit !== AUTO$4) {
            fixedRight = true;
            computedStyle.right = calAbsolute$1(currentStyle, 'right', right, innerWidth);
          } else {
            computedStyle.right = 'auto';
          }

          if (top.unit !== AUTO$4) {
            fixedTop = true;
            computedStyle.top = calAbsolute$1(currentStyle, 'top', top, innerHeight);
          } else {
            computedStyle.top = 'auto';
          }

          if (bottom.unit !== AUTO$4) {
            fixedBottom = true;
            computedStyle.bottom = calAbsolute$1(currentStyle, 'bottom', bottom, innerHeight);
          } else {
            computedStyle.bottom = 'auto';
          } // 优先级最高left+right，其次left+width，再次right+width，再次仅申明单个，最次全部auto


          if (fixedLeft && fixedRight) {
            x2 = x + computedStyle.left;
            w2 = x + innerWidth - computedStyle.right - x2;
          } else if (fixedLeft && width.unit !== AUTO$4) {
            x2 = x + computedStyle.left;
            w2 = width.unit === PX$6 ? width.value : innerWidth * width.value * 0.01;
          } else if (fixedRight && width.unit !== AUTO$4) {
            w2 = width.unit === PX$6 ? width.value : innerWidth * width.value * 0.01;
            x2 = x + innerWidth - computedStyle.right - w2; // 右对齐有尺寸时y值还需减去margin/border/padding的

            x2 -= computedStyle.marginLeft;
            x2 -= computedStyle.marginRight;
            x2 -= computedStyle.paddingLeft;
            x2 -= computedStyle.paddingRight;
            x2 -= currentStyle.borderLeftWidth.value;
            x2 -= currentStyle.borderRightWidth.value;
          } else if (fixedLeft) {
            x2 = x + computedStyle.left;
          } else if (fixedRight) {
            x2 = x + innerWidth - computedStyle.right;
            onlyRight = true;
          } else {
            x2 = x + paddingLeft;

            if (width.unit !== AUTO$4) {
              w2 = width.unit === PX$6 ? width.value : innerWidth * width.value * 0.01;
            }
          } // top/bottom/height优先级同上


          if (fixedTop && fixedBottom) {
            y2 = y + computedStyle.top;
            h2 = y + innerHeight - computedStyle.bottom - y2;
          } else if (fixedTop && height.unit !== AUTO$4) {
            y2 = y + computedStyle.top;
            h2 = height.unit === PX$6 ? height.value : innerHeight * height.value * 0.01;
          } else if (fixedBottom && height.unit !== AUTO$4) {
            h2 = height.unit === PX$6 ? height.value : innerHeight * height.value * 0.01;
            y2 = y + innerHeight - computedStyle.bottom - h2; // 底对齐有尺寸时y值还需减去margin/border/padding的

            y2 -= computedStyle.marginTop;
            y2 -= computedStyle.marginBottom;
            y2 -= computedStyle.paddingTop;
            y2 -= computedStyle.paddingBottom;
            y2 -= currentStyle.borderTopWidth.value;
            y2 -= currentStyle.borderBottomWidth.value;
          } else if (fixedTop) {
            y2 = y + computedStyle.top;
          } else if (fixedBottom) {
            y2 = y + innerHeight - computedStyle.bottom;
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

              if (height.unit !== AUTO$4) {
                h2 = height.unit === PX$6 ? height.value : innerHeight * height.value * 0.01;
              }
            } // 没设宽高，需手动计算获取最大宽高后，赋给样式再布局


          var needCalWidth;

          if (display === 'block' && w2 === undefined) {
            needCalWidth = true;
          } else if (display === 'flex') {
            if (w2 === undefined) {
              needCalWidth = true;
            } else if (flexDirection === 'column' && h2 === undefined) {
              needCalWidth = true;
            }
          } // onlyRight时做的布局其实是以那个点位为left/top布局然后offset，limit要特殊计算，从本点向左侧为边界


          var wl = onlyRight ? x2 - x : innerWidth + x - x2; // onlyBottom相同，正常情况是左上到右下的尺寸限制

          var hl = onlyBottom ? y2 - y : innerHeight + y - y2; // 未直接或间接定义尺寸，取孩子宽度最大值

          if (needCalWidth) {
            item.__layout({
              x: x2,
              y: y2,
              w: wl,
              h: hl
            }, true, true);

            wl = item.outerWidth;
          } // needCalWidth传入，因为自适应尺寸上面已经计算过一次margin/padding了


          item.__layout({
            x: x2,
            y: y2,
            w: wl,
            h: hl,
            w2: w2,
            // left+right这种等于有宽度，但不能修改style，继续传入到__preLayout中特殊对待
            h2: h2
          }, false, true);

          if (onlyRight) {
            item.__offsetX(-item.outerWidth, true);
          }

          if (onlyBottom) {
            item.__offsetY(-item.outerHeight, true);
          }
        }); // 递归进行，遇到absolute/relative/component的设置新容器

        children.forEach(function (item) {
          if (target && target !== item) {
            return;
          }

          if (item instanceof Dom) {
            item.__layoutAbs(isRelativeOrAbsolute$1(item) ? item : container, data);
          } else if (item instanceof Component$1) {
            var sr = item.shadowRoot;

            if (sr instanceof Dom) {
              sr.__layoutAbs(sr, data);
            }
          }
        });
      }
    }, {
      key: "render",
      value: function render(renderMode, lv, ctx, defs) {
        var _this3 = this;

        // 无论缓存与否，都需执行，因为有计算或svg，且super自身判断了缓存情况省略渲染
        var res = _get(_getPrototypeOf(Dom.prototype), "render", this).call(this, renderMode, lv, ctx, defs);

        res = res || {};
        var _res = res,
            offScreen = _res.offScreen,
            isDestroyed = _res.isDestroyed,
            displayNone = _res.displayNone; // canvas检查filter，无缓存时的绘制

        if (offScreen && offScreen.target && offScreen.target.ctx) {
          ctx = offScreen.target.ctx;
        } // 降级，有offScreen但没离屏canvas/webgl功能，舍弃blur
        else {
            offScreen = null;
          }

        var root = this.root,
            virtualDom = this.virtualDom,
            children = this.children,
            position = this.computedStyle.position; // 不显示的为了diff也要根据type生成

        if (renderMode === mode.SVG) {
          virtualDom.type = 'dom';
        } // canvas在隐藏时返回空，svg则有内容


        if (isDestroyed || displayNone) {
          return res;
        } // filter特殊缓存


        var blurValue = this.__blurValue; // 有filter时改变除filter之外的变化直接返回

        if (renderMode === mode.CANVAS && blurValue && this.__cacheFilter && lv < o$1.REPAINT && !o$1.contain(lv, o$1.FILTER)) {
          return res;
        }

        this.__cacheFilter = null; // 先检查是否有缓存且刷新等级在REPAINT以下，直接跳过无需继续

        var cacheTotal = this.__cacheTotal;

        if (lv < o$1.REPAINT && cacheTotal && cacheTotal.available) {
          if (renderMode === mode.CANVAS && blurValue) {
            // blur变化更新，用新的bbox先偏移cacheTotal，再更新cacheFilter，保持尺寸和边距一致性
            if (o$1.contain(lv, o$1.FILTER)) {
              var bbox = this.__mergeBbox(null, true);

              var newCache = Cache.updateCache(cacheTotal, bbox);

              if (newCache) {
                this.__cacheTotal = newCache;
                this.__cacheFilter = Cache.genOffScreenBlur(cacheTotal, blurValue);
              } // 更新后超限，丢掉blur降级
              else {
                  console.error('CacheTotal is oversize');
                  this.__cacheTotal = null;
                  this.__cacheFilter = null;
                }
            }
          }

          return res;
        } // 先渲染过滤mask，仅svg进入，canvas在下面自身做，记得只首次执行


        if (renderMode === mode.SVG && !this.__noChildMask) {
          var hasMask;
          children.forEach(function (item) {
            if (!(item instanceof Component$1) && (item.isMask || item.isClip)) {
              hasMask = true;

              item.__renderAsMask(renderMode, item.__refreshLevel, ctx, defs, !item.isMask);
            }
          }); // 没mask标识以后无需重复遍历

          if (!hasMask) {
            this.__noChildMask = true;
          }
        } // 查找所有非文本children是否都可以放入此层整体缓存，比如有的超尺寸或离屏功能不可用或动画执行影响


        var canCacheChildren = true;
        var draw = !root.cache || renderMode === mode.SVG; // 按照zIndex排序绘制过滤mask，同时由于svg严格按照先后顺序渲染，没有z-index概念，需要排序将relative/absolute放后面

        var zIndexChildren = this.__zIndexChildren; // cache时canvas模式需将mask/clip的geom照常绘制出来，且保证先于其它孩子绘制

        if (root.cache && renderMode === mode.CANVAS) {
          var maskChildren = this.__maskChildren = this.__maskChildren || getMaskChildren(this);

          if (maskChildren.length) {
            zIndexChildren = maskChildren.concat(zIndexChildren);
          }
        }

        zIndexChildren.forEach(function (item) {
          // canvas开启缓存text先不渲染，节点先绘制到自身cache上
          if (item instanceof Text || item instanceof Component$1 && item.shadowRoot instanceof Text) {
            if (draw) {
              if (renderMode === mode.CANVAS) {
                var _ctx;

                if (ctx.globalAlpha !== _this3.__opacity) {
                  ctx.globalAlpha = _this3.__opacity;
                }

                (_ctx = ctx).setTransform.apply(_ctx, _toConsumableArray(_this3.matrixEvent));
              }

              item.__renderByMask(renderMode, null, ctx);
            }
          } else {
            var lv2 = item.__refreshLevel; // geom需特殊处理，避免自定义geom覆盖render()时感知离屏功能

            var _blurValue;

            var newCtx = ctx;
            var isGeom = item instanceof Geom$1; // geom计算bbox需提前获得数据

            if (isGeom) {
              item.__preData = item.__preSet(renderMode, ctx, defs);
            }

            var ignoreGeom, offScreen2;

            if (renderMode === mode.CANVAS && isGeom) {
              var filter = item.currentStyle.filter;

              if (Array.isArray(filter)) {
                filter.forEach(function (item) {
                  var _item = _slicedToArray(item, 2),
                      k = _item[0],
                      v = _item[1];

                  if (k === 'blur' && v > 0) {
                    _blurValue = v;
                  }
                });
              } // 提前判断申请geom的cache，有老的用老的，没有申请新的，改写render()的ctx避免自定义geom感知离屏功能


              if (root.cache) {
                var cacheFilter = item.__cacheFilter,
                    cacheMask = item.__cacheMask,
                    cache = item.__cache;

                if (cacheFilter && _blurValue && lv < o$1.REPAINT && !o$1.contain(lv2, o$1.FILTER) || cacheMask) {
                  ignoreGeom = true;
                } else {
                  item.__cacheFilter = item.__cacheMask = null;
                  var _bbox = item.bbox; // filter优先使用mask，再是cache

                  if (lv2 < o$1.REPAINT && cache && cache.available) {
                    ignoreGeom = true;

                    if (_blurValue && o$1.contain(lv2, o$1.FILTER)) {
                      if (cacheMask) {
                        cacheMask = item.__cacheMask = Cache.updateCache(cacheMask, _bbox);
                      }

                      cache = item.__cache = Cache.updateCache(cache, _bbox);

                      if (cacheMask || cache && cache.available) {
                        item.__cacheFilter = Cache.genOffScreenBlur(cacheMask || cache, _blurValue);
                      } // 更新后超限，丢掉blur降级
                      else {
                          console.error('Geom cache is oversize');
                          item.__cache = null;
                        }
                    }
                  } else {
                    if (cache) {
                      if (cache.enabled) {
                        if (lv2 < o$1.REPAINT) {
                          if (o$1.contain(lv2, o$1.FILTER)) {
                            cache.reset(_bbox);
                          }
                        } else {
                          cache.reset(_bbox);
                        }
                      } else {
                        cache.reset(_bbox);
                      }
                    } else {
                      cache = item.__cache = Cache.getInstance(_bbox);
                    }

                    if (cache && cache.enabled) {
                      newCtx = cache.ctx;
                    }
                  }
                }
              } else if (_blurValue) {
                var width = root.width,
                    height = root.height;
                var c = inject.getCacheCanvas(width, height, '__$$blur$$__');

                if (c.ctx) {
                  offScreen2 = {
                    ctx: ctx
                  };
                  offScreen2.target = c;
                  newCtx = c.ctx;
                }
              }
            } // 即便ignore也要render()，要计算matrix，xom里也会判断重复


            var temp = item.__renderByMask(renderMode, lv2, newCtx, defs);

            if (ignoreGeom) {
              temp = {
                canCache: true
              };
            } // geom特殊处理filter，分缓存和非缓存情况


            if (renderMode === mode.CANVAS && isGeom && !ignoreGeom) {
              var _hasMC;

              var next = item.next;

              var _hasMask = next && next.isMask;

              var hasClip = next && next.isClip;

              if (_hasMask || hasClip) {
                _hasMC = true;
              }

              var _cacheMask = item.__cacheMask,
                  _cache = item.__cache; // 先尝试绘制mask，再看filter

              if (root.cache && _hasMC && _cache && _cache.available) {
                var _item$computedStyle = item.computedStyle,
                    transform = _item$computedStyle.transform,
                    transformOrigin = _item$computedStyle.transformOrigin;
                item.__cacheMask = Cache.drawMask(_cache, next, transform, transformOrigin.slice(0));
              }

              if (root.cache && _blurValue && (_cacheMask || _cache && _cache.available)) {
                item.__cacheFilter = Cache.genOffScreenBlur(_cacheMask || _cache, _blurValue);
              } else if (offScreen2) {
                var _width = root.width,
                    _height = root.height;
                var webgl = inject.getCacheWebgl(_width, _height, '__$$blur$$__');

                var _res2 = blur.gaussBlur(offScreen2.target, webgl, _blurValue, _width, _height);

                offScreen2.ctx.drawImage(offScreen2.target.canvas, 0, 0);
                offScreen2.target.draw();

                _res2.clear();
              }
            } // Xom类型canvas无有效动画时方可被父亲缓存，svg用不到


            if (!canCacheChildren || !temp || !temp.canCache || item.availableAnimating) {
              canCacheChildren = false;
            }
          }
        });
        /**
         * canvas决定是否作为一个局部整体是否缓存的因素
         * 首先本身无有影响的动画，且children无有效的动画
         * 然后本身是relative/absolute/Component
         * root作为最后执行，即便不满足条件也要特殊处理，重复递归应用缓存
         * 目前处于递归的回溯阶段，即冒泡阶段，
         * 所有局部根节点进行绘制局部整体缓存，待root再次递归执行一次
         * filter是个特殊情况，需要webgl离屏执行，所以一定有缓存
         * 有mask也是个特殊情况，一定需要total
         * svg则不需要这些，vd上cache标明整体缓存无需递归diff
         */

        var canCacheSelf = renderMode === mode.CANVAS && (canCacheChildren && !this.effectiveAnimating || blurValue);

        if (canCacheSelf && !blurValue && ['relative', 'absolute'].indexOf(position) === -1 && !this.isShadowRoot) {
          canCacheSelf = false;
        }

        var hasMC;

        if (renderMode === mode.CANVAS) {
          var next = this.next;

          var _hasMask2 = next && next.isMask;

          var hasClip = next && next.isClip;

          if (_hasMask2 || hasClip) {
            hasMC = true;
            canCacheSelf = true;
          }
        } // 需考虑缓存和滤镜


        if (renderMode === mode.CANVAS) {
          // 冒泡阶段将所有局部整体缓存离屏绘制好以便调用
          if (root.cache) {
            // root最终执行，递归所有children应用自身缓存，遇到局部根节点离屏缓存则绘制到主屏上
            if (this === root) {
              this.__applyCache(renderMode, lv, ctx, refreshMode.ROOT);
            } // 作为局部根节点整体进行绘制并缓存，递归将所有子节点绘制到局部整体上，img除外自己处理
            else if (canCacheSelf && this.tagName.toLowerCase() !== 'img') {
                this.__applyCache(renderMode, lv, ctx, refreshMode.TOP);

                if (hasMC) {
                  var _cacheTotal = this.__cacheTotal;

                  if (_cacheTotal && _cacheTotal.available) {
                    var _this$computedStyle = this.computedStyle,
                        transform = _this$computedStyle.transform,
                        transformOrigin = _this$computedStyle.transformOrigin;
                    var _next = this.next;
                    this.__cacheMask = Cache.drawMask(_cacheTotal, _next, transform, transformOrigin.slice(0));
                  } // 极端情况超限异常
                  else {
                      console.error('CacheTotal is oversize with mask');
                    }
                }
              } // 非局部缓存的节点等待root调用

          } // 无缓存时有offScreen对象，尝试使用webgl的blur，对象生成条件在Xom初始化做
          else if (offScreen) {
              var width = root.width,
                  height = root.height;
              var webgl = inject.getCacheWebgl(width, height, '__$$blur$$__');

              var _res3 = blur.gaussBlur(offScreen.target, webgl, offScreen.blur, width, height);

              offScreen.ctx.drawImage(offScreen.target.canvas, 0, 0);
              offScreen.target.draw();

              _res3.clear();
            }
        } else if (renderMode === mode.SVG) {
          // svg mock，每次都生成，每个节点都是局部根，更新时自底向上清除
          if (!cacheTotal) {
            this.__cacheTotal = {
              available: true,
              release: function release() {
                this.available = false;
                delete virtualDom.cache;
              }
            };
          } else if (!cacheTotal.available) {
            cacheTotal.available = true;
          } // img的children在子类特殊处理


          if (this.tagName.toLowerCase() !== 'img') {
            virtualDom.children = zIndexChildren.map(function (item) {
              return item.virtualDom;
            });
          } // 没变化则将text孩子设置cache


          if (virtualDom.hasOwnProperty('lv')) {
            this.virtualDom.children.forEach(function (item) {
              if (item.type === 'text') {
                item.cache = true;
              }
            });
          } else {
            this.virtualDom.children.forEach(function (item) {
              if (item.type === 'text') {
                delete item.cache;
              }
            });
          }
        } // 向上回溯传值，要考虑children


        if (res.canCache && !canCacheChildren) {
          res.canCache = false;
        }

        res.canCacheSelf = canCacheSelf;
        res.hasMC = hasMC;
        return res;
      }
      /**
       * canvas下，应用离屏内容缓存到主屏或者局部根节点上
       * 有可能子节点没超限但整体超限，此时要考虑降级分别绘制
       * @param renderMode
       * @param lv
       * @param ctx
       * @param mode 局部根节点总缓存、及其子节点、最后root发起的无局部整体的节点自身缓存应用
       * @param cacheTop 汇总离屏canvas的目标
       * @param opacity 以top为基点
       * @param matrix 以top为基点
       */

    }, {
      key: "__applyCache",
      value: function __applyCache(renderMode, lv, ctx, mode, cacheTop, opacity, matrix) {
        var computedStyle = this.computedStyle,
            blurValue = this.__blurValue,
            cacheMask = this.__cacheMask,
            cacheFilter = this.__cacheFilter,
            cacheTotal = this.__cacheTotal,
            cache = this.__cache,
            zIndexChildren = this.zIndexChildren;
        var display = computedStyle.display,
            visibility = computedStyle.visibility;

        if (display === 'none') {
          return;
        } // 局部根节点缓存汇总渲染


        if (mode === refreshMode.TOP) {
          if (visibility === 'hidden') {
            return;
          }

          var bboxTotal = this.__mergeBbox(null, true); // 空内容


          if (!bboxTotal) {
            return;
          } // 第一次初始化进行bbox合集计算


          if (!cacheTotal) {
            cacheTotal = this.__cacheTotal = Cache.getInstance(bboxTotal);
          } // 后续如果超过可缓存的lv重设，否则直接用已有内容，重复利用在render()里做了，这里reset
          else if (!cacheTotal.enabled) {
              cacheTotal.reset(bboxTotal);
            }

          var sx = this.sx,
              sy = this.sy;
          var x1 = sx + computedStyle.marginLeft;
          var y1 = sy + computedStyle.marginTop; // 缓存可用时各children依次执行进行离屏汇总

          if (cacheTotal && cacheTotal.enabled) {
            cacheTotal.__bbox = bboxTotal;

            cacheTotal.__appendData(x1, y1); // 每次刷新重新生成，一般都会进，特殊情况下遗留的老cacheTotal可以直接用


            if (!cacheTotal.available) {
              cacheTotal.__available = true;
              ctx = cacheTotal.ctx; // 以top为基准matrix/opacity

              if (ctx.globalAlpha !== 1) {
                ctx.globalAlpha = 1;
              }

              ctx.setTransform(1, 0, 0, 1, 0, 0);

              if (cache && cache.available) {
                Cache.drawCache(cache, cacheTotal);
              }

              zIndexChildren.forEach(function (item) {
                if (item instanceof Text || item instanceof Component$1 && item.shadowRoot instanceof Text) {
                  if (ctx.globalAlpha !== 1) {
                    ctx.globalAlpha = 1;
                  }

                  ctx.setTransform(1, 0, 0, 1, 0, 0);

                  item.__renderByMask(renderMode, null, ctx, null, cacheTotal.dx, cacheTotal.dy);
                } else {
                  item.__applyCache(renderMode, item.__refreshLevel, ctx, refreshMode.CHILD, cacheTotal, 1, [1, 0, 0, 1, 0, 0]);
                }
              });
            }
          } // 超尺寸无法进行，降级渲染
          else {
              var tx = sx + computedStyle.marginLeft;
              var ty = sy + computedStyle.marginTop;

              _get(_getPrototypeOf(Dom.prototype), "__applyCache", this).call(this, renderMode, ctx, tx - 1, ty - 1);

              zIndexChildren.forEach(function (item) {
                if (item instanceof Text || item instanceof Component$1 && item.shadowRoot instanceof Text) {
                  item.__renderByMask(renderMode, null, ctx);
                } else {
                  item.__applyCache(renderMode, item.__refreshLevel, ctx, refreshMode.ROOT);
                }
              });
            } // 生成filter缓存，超尺寸降级舍弃


          if (blurValue && cacheTotal && cacheTotal.available) {
            this.__cacheFilter = Cache.genOffScreenBlur(cacheTotal, blurValue);
          } else if (cacheFilter) {
            console.error('CacheFilter is oversize');
            this.__cacheFilter = null;
          }
        } // 向总的离屏canvas绘制，最后由top汇总再绘入主画布
        else if (mode === refreshMode.CHILD) {
            var _cacheTop$coords = _slicedToArray(cacheTop.coords, 2),
                _tx = _cacheTop$coords[0],
                _ty = _cacheTop$coords[1],
                _x = cacheTop.x1,
                _y = cacheTop.y1,
                dbx = cacheTop.dbx,
                dby = cacheTop.dby;

            var _sx = this.sx,
                _sy = this.sy;
            _sx += computedStyle.marginLeft;
            _sy += computedStyle.marginTop;
            var dx = _tx + _sx - _x + dbx;
            var dy = _ty + _sy - _y + dby;

            if (visibility !== 'hidden') {
              var _ctx2;

              var tfo = computedStyle.transformOrigin.slice(0);
              opacity *= computedStyle.opacity;

              if (ctx.globalAlpha !== opacity) {
                ctx.globalAlpha = opacity;
              } // 优先filter/mask，再是total


              if (cacheFilter || cacheMask || cacheTotal && cacheTotal.available) {
                var target = cacheFilter || cacheMask || cacheTotal;
                Cache.drawCache(target, cacheTop, computedStyle.transform, matrix, tfo);
                return;
              }

              tfo[0] += dx;
              tfo[1] += dy;
              var m = tf.calMatrixByOrigin(computedStyle.transform, tfo);
              matrix = mx.multiply(matrix, m);

              (_ctx2 = ctx).setTransform.apply(_ctx2, _toConsumableArray(matrix)); // 都没有正常cache和children


              if (cache && cache.available) {
                Cache.drawCache(cache, cacheTop);
              }
            } // 递归children


            zIndexChildren.forEach(function (item) {
              if (item instanceof Text || item instanceof Component$1 && item.shadowRoot instanceof Text) {
                if (visibility !== 'hidden') {
                  var _ctx3;

                  if (ctx.globalAlpha !== opacity) {
                    ctx.globalAlpha = opacity;
                  }

                  (_ctx3 = ctx).setTransform.apply(_ctx3, _toConsumableArray(matrix));

                  item.__renderByMask(renderMode, null, ctx, null, dx - item.sx + computedStyle.paddingLeft, dy - item.sy + computedStyle.paddingTop);
                }
              } else {
                item.__applyCache(renderMode, item.__refreshLevel, ctx, mode, cacheTop, opacity, matrix);
              }
            });
          } // root调用局部整体缓存或单个节点缓存绘入主画布
          else if (mode === refreshMode.ROOT) {
              var __opacity = this.__opacity,
                  matrixEvent = this.matrixEvent;

              if (visibility !== 'hidden') {
                var _ctx4;

                // 写回主画布前设置
                if (ctx.globalAlpha !== __opacity) {
                  ctx.globalAlpha = __opacity;
                }

                (_ctx4 = ctx).setTransform.apply(_ctx4, _toConsumableArray(matrixEvent));

                var _target = cacheFilter || cacheMask;

                if (_target) {
                  var _x2 = _target.x1,
                      _y2 = _target.y1,
                      _dbx = _target.dbx,
                      _dby = _target.dby,
                      canvas = _target.canvas;
                  ctx.drawImage(canvas, _x2 - 1 - _dbx, _y2 - 1 - _dby);
                  return;
                }

                if (cacheTotal && cacheTotal.available) {
                  var _cacheTotal2 = cacheTotal,
                      _cacheTotal2$coords = _slicedToArray(_cacheTotal2.coords, 2),
                      x = _cacheTotal2$coords[0],
                      y = _cacheTotal2$coords[1],
                      _canvas = _cacheTotal2.canvas,
                      _x3 = _cacheTotal2.x1,
                      _y3 = _cacheTotal2.y1,
                      _dbx2 = _cacheTotal2.dbx,
                      _dby2 = _cacheTotal2.dby,
                      width = _cacheTotal2.width,
                      height = _cacheTotal2.height;

                  ctx.drawImage(_canvas, x - 1, y - 1, width, height, _x3 - 1 - _dbx2, _y3 - 1 - _dby2, width, height);
                  return;
                } // 无内容就没有cache，继续看children


                if (cache && cache.available) {
                  var _cache$coords = _slicedToArray(cache.coords, 2),
                      _x5 = _cache$coords[0],
                      _y5 = _cache$coords[1],
                      _canvas2 = cache.canvas,
                      _x4 = cache.x1,
                      _y4 = cache.y1,
                      _dbx3 = cache.dbx,
                      _dby3 = cache.dby,
                      _width2 = cache.width,
                      _height2 = cache.height;

                  ctx.drawImage(_canvas2, _x5 - 1, _y5 - 1, _width2, _height2, _x4 - 1 - _dbx3, _y4 - 1 - _dby3, _width2, _height2);
                }
              }

              zIndexChildren.forEach(function (item) {
                if (item instanceof Text || item instanceof Component$1 && item.shadowRoot instanceof Text) {
                  if (visibility !== 'hidden') {
                    var _ctx5;

                    if (ctx.globalAlpha !== __opacity) {
                      ctx.globalAlpha = __opacity;
                    }

                    (_ctx5 = ctx).setTransform.apply(_ctx5, _toConsumableArray(matrixEvent));

                    item.__renderByMask(renderMode, null, ctx);
                  }
                } else {
                  item.__applyCache(renderMode, item.__refreshLevel, ctx, mode);
                }
              });
            }
      }
      /**
       * 以cacheTotal为基准递归合并包含children的bbox
       * @param matrix
       * @param isTop
       * @param tx 顶dom的坐标
       * @param ty
       * @param dx filter造成的偏移，递归传递下去所有children需要扩展此值
       * @param dy
       * @returns bbox
       * @private
       */

    }, {
      key: "__mergeBbox",
      value: function __mergeBbox(matrix, isTop, tx, ty, dx, dy) {
        var bbox;
        var sx = this.sx,
            sy = this.sy,
            computedStyle = this.computedStyle;
        var display = computedStyle.display; // 顶点初始化为起点，偏移值要考虑filter

        if (isTop) {
          matrix = [1, 0, 0, 1, 0, 0];
          bbox = _get(_getPrototypeOf(Dom.prototype), "__mergeBbox", this).call(this, matrix, isTop);
          tx = sx;
          ty = sy;

          if (bbox) {
            dx = sx + computedStyle.marginLeft - bbox[0];
            dy = sy + computedStyle.marginTop - bbox[1];
          } else if (Array.isArray(computedStyle.filter)) {
            computedStyle.filter.forEach(function (item) {
              var _item2 = _slicedToArray(item, 2),
                  k = _item2[0],
                  v = _item2[1];

              if (k === 'blur' && v > 0) {
                var d = mx.int2convolution(v);
                dx = dy = d;
              }
            });
          } else {
            dx = dy = 0;
          }
        } else if (display !== 'none') {
          var tfo = computedStyle.transformOrigin.slice(0);
          tfo[0] += sx - tx;
          tfo[1] += sy - ty;
          var m = tf.calMatrixByOrigin(computedStyle.transform, tfo);
          matrix = mx.multiply(matrix, m);
          bbox = _get(_getPrototypeOf(Dom.prototype), "__mergeBbox", this).call(this, matrix, isTop, dx, dy);
        }

        if (display !== 'none') {
          this.zIndexChildren.forEach(function (item) {
            var t = item.__mergeBbox(matrix, false, tx, ty, dx, dy);

            if (!bbox) {
              bbox = t;
            } // display:none可能为空
            else if (t) {
                bbox[0] = Math.min(bbox[0], t[0]);
                bbox[1] = Math.min(bbox[1], t[1]);
                bbox[2] = Math.max(bbox[2], t[2]);
                bbox[3] = Math.max(bbox[3], t[3]);
              }
          });
        }

        return bbox;
      }
      /**
       * 布局前检查继承的样式以及统计字体测量信息
       * 首次检查为整树遍历，后续检查是节点自发局部检查，不再进入
       * @param renderMode
       * @param ctx
       * @param isHost
       * @param cb
       * @private
       */

    }, {
      key: "__computeMeasure",
      value: function __computeMeasure(renderMode, ctx, isHost, cb) {
        _get(_getPrototypeOf(Dom.prototype), "__computeMeasure", this).call(this, renderMode, ctx, isHost, cb); // 即便自己不需要计算，但children还要继续递归检查


        this.children.forEach(function (item) {
          item.__computeMeasure(renderMode, ctx, false, cb);
        });
      }
    }, {
      key: "__destroy",
      value: function __destroy() {
        if (this.isDestroyed) {
          return;
        }

        this.children.forEach(function (child) {
          // 有可能为空，因为diff过程中相同的cp被移到新的vd中，老的防止destroy设null
          if (child) {
            child.__destroy();
          }
        });

        _get(_getPrototypeOf(Dom.prototype), "__destroy", this).call(this);

        this.children.splice(0);
        this.lineGroups.splice(0);
      }
    }, {
      key: "__emitEvent",
      value: function __emitEvent(e, force) {
        if (force) {
          return _get(_getPrototypeOf(Dom.prototype), "__emitEvent", this).call(this, e, force);
        }

        var isDestroyed = this.isDestroyed,
            computedStyle = this.computedStyle;

        if (isDestroyed || computedStyle.display === 'none' || e.__stopPropagation) {
          return;
        }

        var type = e.event.type;
        var listener = this.listener,
            zIndexChildren = this.zIndexChildren;
        var cb;

        if (listener.hasOwnProperty(type)) {
          cb = listener[type];
        } // child触发则parent一定触发


        for (var i = zIndexChildren.length - 1; i >= 0; i--) {
          var child = zIndexChildren[i];

          if (child instanceof Xom || child instanceof Component$1 && child.shadowRoot instanceof Xom) {
            if (child.__emitEvent(e)) {
              // 孩子阻止冒泡
              if (e.__stopPropagation) {
                return;
              }

              if (util.isFunction(cb) && !e.__stopImmediatePropagation) {
                cb.call(this, e);
              }

              return true;
            }
          }
        } // child不触发再看自己


        return _get(_getPrototypeOf(Dom.prototype), "__emitEvent", this).call(this, e);
      }
    }, {
      key: "__cancelCache",
      value: function __cancelCache(recursion) {
        _get(_getPrototypeOf(Dom.prototype), "__cancelCache", this).call(this, recursion);

        if (recursion) {
          this.children.forEach(function (child) {
            if (child instanceof Xom || child instanceof Component$1 && child.shadowRoot instanceof Xom) {
              child.__cancelCache(recursion);
            }
          });
        }
      } // 深度遍历执行所有子节点，包含自己，如果cb返回true，提前跳出不继续深度遍历

    }, {
      key: "deepScan",
      value: function deepScan(cb, options) {
        if (_get(_getPrototypeOf(Dom.prototype), "deepScan", this).call(this, cb, options)) {
          return;
        }

        this.children.forEach(function (node) {
          node.deepScan(cb, options);
        });
      }
    }, {
      key: "children",
      get: function get() {
        return this.__children;
      }
    }, {
      key: "flowChildren",
      get: function get() {
        return this.children.filter(function (item) {
          if (item instanceof Component$1) {
            item = item.shadowRoot;
          }

          return item instanceof Text || item.currentStyle.position !== 'absolute';
        });
      }
    }, {
      key: "absChildren",
      get: function get() {
        return this.children.filter(function (item) {
          if (item instanceof Component$1) {
            item = item.shadowRoot;
          }

          return item instanceof Xom && item.currentStyle.position === 'absolute';
        });
      }
    }, {
      key: "zIndexChildren",
      get: function get() {
        return this.__zIndexChildren;
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
    }]);

    return Dom;
  }(Xom);

  var AUTO$5 = unit.AUTO;
  var canvasPolygon$2 = painter.canvasPolygon,
      svgPolygon$2 = painter.svgPolygon;

  var Img$1 = /*#__PURE__*/function (_Dom) {
    _inherits(Img, _Dom);

    var _super = _createSuper(Img);

    function Img(tagName, props) {
      var _this;

      _classCallCheck(this, Img);

      _this = _super.call(this, tagName, props);
      var src = _this.props.src;
      var loadImg = _this.__loadImg = {}; // 空url用错误图代替

      if (!src) {
        loadImg.error = true;
      }

      return _this;
    }
    /**
     * 覆盖xom的方法，在__layout3个分支中会首先被调用
     * 当样式中固定宽高时，图片按样式尺寸，加载后重新绘制即可
     * 只固定宽高一个时，加载完要计算缩放比，重新布局绘制
     * 都没有固定，按照图片尺寸，重新布局绘制
     * 这里计算非固定的情况，将其改为固定供布局渲染使用，未加载完成为0
     * @param data
     * @returns {{fixedWidth: boolean, w: *, x: *, h: *, y: *, fixedHeight: boolean}}
     * @private
     */


    _createClass(Img, [{
      key: "__preLayout",
      value: function __preLayout(data) {
        var res = _get(_getPrototypeOf(Img.prototype), "__preLayout", this).call(this, data);

        var loadImg = this.__loadImg; // 可能已提前加载好了，或有缓存，为减少刷新直接使用

        if (!loadImg.error) {
          var src = this.props.src;
          var cache = inject.IMG[src];

          if (cache && cache.state === inject.LOADED) {
            loadImg.url = src;
            loadImg.source = cache.source;
            loadImg.width = cache.width;
            loadImg.height = cache.height;
          }

          loadImg.cache = false;
        }

        if (res.fixedWidth && res.fixedHeight) {
          return res;
        }

        if (loadImg.error) {
          if (res.fixedWidth) {
            res.h = res.w;
          } else if (res.fixedHeight) {
            res.w = res.h;
          } else {
            res.w = res.h = 32;
          }
        } else if (loadImg.source) {
          if (res.fixedWidth) {
            res.h = res.w * loadImg.height / loadImg.width;
          } else if (res.fixedHeight) {
            res.w = res.h * loadImg.width / loadImg.height;
          } else {
            res.w = loadImg.width;
            res.h = loadImg.height;
          }
        } else {
          res.w = res.h = 0;
        }

        res.fixedWidth = true;
        res.fixedHeight = true;
        return res;
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
      key: "__destroy",
      value: function __destroy() {
        this.root.delRefreshTask(this.__task);

        _get(_getPrototypeOf(Img.prototype), "__destroy", this).call(this);
      }
    }, {
      key: "render",
      value: function render(renderMode, lv, ctx, defs) {
        var _this2 = this;

        var res = _get(_getPrototypeOf(Img.prototype), "render", this).call(this, renderMode, lv, ctx, defs);

        var x = this.sx,
            y = this.sy,
            width = this.width,
            height = this.height,
            isDestroyed = this.isDestroyed,
            src = this.props.src,
            _this$computedStyle = this.computedStyle,
            display = _this$computedStyle.display,
            borderTopWidth = _this$computedStyle.borderTopWidth,
            borderRightWidth = _this$computedStyle.borderRightWidth,
            borderBottomWidth = _this$computedStyle.borderBottomWidth,
            borderLeftWidth = _this$computedStyle.borderLeftWidth,
            marginTop = _this$computedStyle.marginTop,
            marginLeft = _this$computedStyle.marginLeft,
            paddingTop = _this$computedStyle.paddingTop,
            paddingLeft = _this$computedStyle.paddingLeft,
            borderTopLeftRadius = _this$computedStyle.borderTopLeftRadius,
            borderTopRightRadius = _this$computedStyle.borderTopRightRadius,
            borderBottomRightRadius = _this$computedStyle.borderBottomRightRadius,
            borderBottomLeftRadius = _this$computedStyle.borderBottomLeftRadius,
            visibility = _this$computedStyle.visibility,
            virtualDom = this.virtualDom,
            __cache = this.__cache;

        if (isDestroyed || display === 'none' || visibility === 'hidden') {
          return res;
        }

        var originX, originY; // img无children所以total就是cache避免多余生成

        if (renderMode === mode.CANVAS) {
          this.__cacheTotal = __cache;
        }

        if (__cache && __cache.enabled) {
          ctx = __cache.ctx;
          originX = res.x2 + paddingLeft;
          originY = res.y2 + paddingTop;
        } else {
          originX = x + marginLeft + borderLeftWidth + paddingLeft;
          originY = y + marginTop + borderTopWidth + paddingTop;
        }

        var loadImg = this.__loadImg;

        if (loadImg.error) {
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
            // virtualDom.children = [];
            this.__addGeom('rect', [['x', originX], ['y', originY], ['width', width], ['height', height], ['stroke', stroke], ['stroke-width', strokeWidth], ['fill', 'rgba(0,0,0,0)']]);

            this.__addGeom('circle', [['cx', cx], ['cy', cy], ['r', r], ['fill', fill]]);

            var s = '';

            for (var _i = 0, _len = pts.length; _i < _len; _i++) {
              var _point = pts[_i];

              if (_i) {
                s += ' ';
              }

              s += _point[0] + ',' + _point[1];
            }

            this.__addGeom('polygon', [['points', s], ['fill', fill]]);
          }
        } else if (loadImg.url === src) {
          var source = loadImg.source; // 无source不绘制

          if (source) {
            // 圆角需要生成一个mask
            var list = border.calRadius(originX, originY, width, height, borderTopWidth, borderRightWidth, borderBottomWidth, borderLeftWidth, borderTopLeftRadius, borderTopRightRadius, borderBottomRightRadius, borderBottomLeftRadius);

            if (renderMode === mode.CANVAS) {
              // 有border-radius需模拟遮罩裁剪
              if (list) {
                ctx.save();
                ctx.beginPath();
                canvasPolygon$2(ctx, list);
                ctx.clip();
                ctx.closePath();
                ctx.drawImage(source, originX, originY, width, height);
                ctx.restore();
              } else {
                ctx.drawImage(source, originX, originY, width, height);
              }
            } else if (renderMode === mode.SVG) {
              // img没有变化无需diff，直接用上次的vd
              if (loadImg.cache) {
                loadImg.cache.cache = true;
                virtualDom.children = [loadImg.cache]; // 但是还是要校验是否有borderRadius变化，引发img的圆角遮罩

                if (!virtualDom.cache && list) {
                  var d = svgPolygon$2(list);
                  var id = defs.add({
                    tagName: 'clipPath',
                    props: [],
                    children: [{
                      type: 'item',
                      tagName: 'path',
                      props: [['d', d], ['fill', '#FFF']]
                    }]
                  });
                  virtualDom.conClip = 'url(#' + id + ')';
                }

                return;
              } // 缩放图片，无需考虑原先矩阵，xom里对父层<g>已经变换过了


              var matrix;

              if (width !== loadImg.width || height !== loadImg.height) {
                matrix = image.matrixResize(loadImg.width, loadImg.height, width, height, originX, originY, width, height);
              }

              var props = [['xlink:href', src], ['x', originX], ['y', originY], ['width', loadImg.width], ['height', loadImg.height]];

              if (list) {
                var _d = svgPolygon$2(list);

                var _id = defs.add({
                  tagName: 'clipPath',
                  props: [],
                  children: [{
                    type: 'item',
                    tagName: 'path',
                    props: [['d', _d], ['fill', '#FFF']]
                  }]
                });

                virtualDom.conClip = 'url(#' + _id + ')';
                delete virtualDom.cache;
              }

              if (matrix && !util.equalArr(matrix, [1, 0, 0, 1, 0, 0])) {
                props.push(['transform', 'matrix(' + util.joinArr(matrix, ',') + ')']);
              }

              var vd = {
                type: 'img',
                tagName: 'image',
                props: props
              };
              virtualDom.children = [vd];
              loadImg.cache = vd;
            }
          }
        } else {
          var _loadImg = this.__loadImg;
          _loadImg.url = src;
          _loadImg.source = null;
          _loadImg.error = null;
          _loadImg.cache = false;
          inject.measureImg(src, function (data) {
            var self = _this2; // 还需判断url，防止重复加载时老的替换新的，失败走error绘制

            if (data.url === _loadImg.url && !self.__isDestroyed) {
              if (data.success) {
                _loadImg.source = data.source;
                _loadImg.width = data.width;
                _loadImg.height = data.height;
              } else {
                _loadImg.error = true;
              }

              var root = self.root,
                  _self$currentStyle = self.currentStyle,
                  _width = _self$currentStyle.width,
                  _height = _self$currentStyle.height;
              root.delRefreshTask(self.__task);

              if (_width.unit !== AUTO$5 && _height.unit !== AUTO$5) {
                root.addRefreshTask(self.__task = {
                  before: function before() {
                    if (self.isDestroyed) {
                      return;
                    } // 刷新前统一赋值，由刷新逻辑计算最终值避免优先级覆盖问题


                    root.__addUpdate({
                      node: self,
                      focus: o$1.REPAINT,
                      img: true
                    });
                  }
                });
              } else {
                root.addRefreshTask(self.__task = {
                  before: function before() {
                    if (self.isDestroyed) {
                      return;
                    } // 刷新前统一赋值，由刷新逻辑计算最终值避免优先级覆盖问题


                    root.__addUpdate({
                      node: self,
                      focus: o$1.REFLOW,
                      // 没有样式变化但内容尺寸发生了变化强制执行
                      img: true // 特殊标识强制布局即便没有style变化

                    });
                  }
                });
              }
            }
          }, {
            width: width,
            height: height
          });
        }

        if (res.canCacheSelf) {
          this.__applyCache(renderMode, lv, ctx, refreshMode.TOP);

          if (res.hasMC) {
            var cacheTotal = this.__cacheTotal;

            if (cacheTotal && cacheTotal.available) {
              var _this$computedStyle2 = this.computedStyle,
                  _transform = _this$computedStyle2.transform,
                  transformOrigin = _this$computedStyle2.transformOrigin;
              var next = this.next;
              this.__cacheMask = Cache.drawMask(cacheTotal, next, _transform, transformOrigin.slice(0));
            } // 极端情况超限异常
            else {
                console.error('CacheTotal is oversize with img\'s mask');
              }
          }
        }

        return res;
      }
    }, {
      key: "baseLine",
      get: function get() {
        return this.height;
      }
    }]);

    return Img;
  }(Dom$1);

  var Defs = /*#__PURE__*/function () {
    function Defs(uuid) {
      _classCallCheck(this, Defs);

      this.id = uuid;
      this.count = 0;
      this.list = [];
    }

    _createClass(Defs, [{
      key: "add",
      value: function add(data) {
        data.uuid = 'karas-defs-' + this.id + '-' + this.count++;
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

  var TYPE_VD$2 = $$type.TYPE_VD,
      TYPE_GM$2 = $$type.TYPE_GM,
      TYPE_CP$2 = $$type.TYPE_CP;
  var Xom$2, Dom$2, Img$2, Geom$2, Component$2;
  var updateList = [];
  var removeList = [];
  var KEY_FLAG = {};
  /**
   * setState后刷新前先根遍历检查组件开始进行shouldComponentUpdate判断
   */

  function check(vd) {
    if (vd instanceof Dom$2) {
      vd.children.forEach(function (child) {
        if (child instanceof Dom$2) {
          check(child);
        } // 当组件有setState更新时，从叶子到根链路会标识__hasUpdate，以便节约遍历成本忽略那些没变化的链路
        else if (child instanceof Component$2 && child.__hasUpdate) {
            child.__hasUpdate = false;
            checkCp(child, child.props);
          }
      });
    }
  }
  /**
   * 检查cp是否有state变更
   * @param cp
   * @param nextProps
   * @param forceCheckUpdate，被render()后的json的二级组件，发现props有变更强制检查更新，否则可以跳过
   */


  function checkCp(cp, nextProps, forceCheckUpdate) {
    if (cp.__nextState || forceCheckUpdate) {
      var shouldUpdate;

      if (util.isFunction(cp.shouldComponentUpdate)) {
        shouldUpdate = cp.shouldComponentUpdate(nextProps, cp.__nextState || cp.state);
      } else {
        // 没有默认更新
        shouldUpdate = true;
      }

      if (shouldUpdate) {
        updateCp(cp, nextProps, cp.__nextState || cp.state);
      } // 不更新则递归检查子tree的cp
      else {
          check(cp.shadowRoot);
        }
    } else {
      check(cp.shadowRoot);
    }
  }
  /**
   * 更新组件的props和state，清空__nextState
   * @param cp
   * @param props
   * @param state
   */


  function updateCp(cp, props, state) {
    cp.props = props;
    cp.__state = state;
    cp.__nextState = null;
    var oldS = cp.shadow;
    var oldJson = cp.__cd;
    var json = builder.flattenJson(cp.render()); // 对比新老render()返回的内容，更新后重新生成sr

    diffSr(oldS, oldJson, json);

    cp.__init(json); // 为了局部dom布局需要知道老的css信息


    var s = cp.shadow;

    if (s instanceof Xom$2) {
      s.__width = oldS.width;
      s.__height = oldS.height;
      s.__computedStyle = oldS.computedStyle;
      s.__layoutData = oldS.layoutData;
    } else {
      s.__parent = oldS.parent;
    }

    s.__struct = oldS.__struct;
    updateList.push(cp); // 老的需回收，diff会生成新的dom，唯一列外是cp直接返回一个没变化的cp

    if (!util.isObject(json) || !json.placeholder) {
      removeList.push(oldS);
    } // 子组件使用老的json时标识，更新后删除，render()返回空会没json对象


    if (json && json.placeholder) {
      delete json.placeholder;
    }
  }
  /**
   * 非一级组件sr进行对比，key相同的无需重新生成且继承动画
   * @param vd
   * @param oj oldJson
   * @param nj
   */


  function diffSr(vd, oj, nj) {
    // 先遍历检查key相同的，将没有变化的key暂存下来，深度优先，这样叶子节点出现在前面，当key的叶子也有key时，确保叶子先对比
    var ojk = getKeyHash(oj, {}, vd);
    var njk = getKeyHash(nj, {});
    var keyList = [];
    var cpList = []; // 先对比key对应的节点，如果新老有一方对不上则落空

    Object.keys(ojk).forEach(function (k) {
      var o = ojk[k];
      var n = njk[k];

      if (!n) {
        o.json.key = KEY_FLAG;
      }
    });
    Object.keys(njk).forEach(function (k) {
      var o = ojk[k];
      var n = njk[k]; // 有可能老的没有这个key，新key落空

      if (!o) {
        n.json.key = KEY_FLAG;
        return;
      }

      var oj = o.json;
      var nj = n.json;
      var vd = o.vd; // 相同class的组件进行对比替换

      if (oj.$$type === TYPE_CP$2 && nj.$$type === TYPE_CP$2) {
        if (oj.klass === nj.klass) {
          // 对比props和children看是否全等，是则直接替换新json类型为占位符，引用老vd，否则强制更新
          diffCp(oj, nj, vd); // 标识对比过了

          oj.key = nj.key = KEY_FLAG; // 老的sr里需删除这个vd，因为老sr会回收

          cpList.push(vd);
        }
      } // 相同类型的vd进行对比继承动画
      else if (oj.$$type === nj.$$type && oj.tagName === nj.tagName) {
          // 需判断矢量标签mutil是否相等
          if (nj.$$type !== TYPE_GM$2 || oj.props.multi === nj.props.multi) {
            nj.inherit = vd;
          }

          oj.key = nj.key = KEY_FLAG; // key相同的dom暂存下来

          if (nj.$$type === TYPE_VD$2) {
            keyList.push({
              vd: vd,
              oj: oj,
              nj: nj
            });
          }
        }
    }); // key相同的dom对比children，下面非key逻辑就不做了

    keyList.forEach(function (item) {
      diffChildren(item.vd, item.oj, item.nj);
    }); // 整体tree进行对比

    diffChild(vd, oj, nj); // 已更新的cp需被老sr删除，因为老sr会回收，而此cp继续存在于新sr中不能回收，这里处理key的

    cpList.forEach(function (vd) {
      removeCpFromOldTree(vd);
    });
  }
  /**
   * 递归检查dom的children，相同的无需重新生成，用PL类型占位符代替直接返回老vd
   * @param vd
   * @param oj
   * @param nj
   */


  function diffChild(vd, oj, nj) {
    if (util.isObject(nj)) {
      if (nj.$$type === TYPE_CP$2) {
        // key对比过了忽略
        if (nj.key === KEY_FLAG) {
          return;
        } // 相同class的组件处理


        if (oj.$$type === nj.$$type && oj.klass === nj.klass) {
          diffCp(oj, nj, vd); // 已更新的cp需被老sr删除，因为老sr会回收，而此cp继续存在于新sr中不能回收

          removeCpFromOldTree(vd);
        }
      } else if (nj.$$type === TYPE_GM$2 && oj.$$type === TYPE_GM$2) {
        // $geom的multi必须一致
        if (oj.tagName === nj.tagName && oj.props.multi === nj.props.multi) {
          nj.inherit = vd;
        }
      } // dom类型递归children
      else if (nj.$$type === TYPE_VD$2 && oj.$$type === TYPE_VD$2) {
          if (oj.tagName === nj.tagName) {
            nj.inherit = vd;
          }

          diffChildren(vd, oj, nj);
        }
    }
  }
  /**
   * dom类型的vd对比children
   * @param vd
   * @param oj
   * @param nj
   */


  function diffChildren(vd, oj, nj) {
    var oc = oj.children;
    var nc = nj.children;
    var ol = oc.length;
    var nl = nc.length;
    var children = vd.children;

    for (var i = 0, of = 0, nf = 0, len = Math.min(ol, nl); i < len; i++) {
      var o = oc[i + of];
      var n = nc[i + nf]; // 新老都是key直接跳过

      if (o.key === KEY_FLAG && n.key === KEY_FLAG) ; // 其中一个是key对比过了调整索引和长度
      else if (o.key === KEY_FLAG) {
          of++;
          i--;
          ol--;
          len = Math.min(ol, nl);
        } else if (n.key === KEY_FLAG) {
          nf++;
          i--;
          nl--;
          len = Math.min(ol, nl);
        } else {
          diffChild(children[i + of], o, n);
        }
    } // 长度不同增减的无需关注，新json创建cp有didMount，老vd会调用cp的destroy

  }
  /**
   * 根据json对比看cp如何更新，被render()后的json的二级组件对比才会出现
   * @param oj
   * @param nj
   * @param vd
   */


  function diffCp(oj, nj, vd) {
    // props全等，直接替换新json类型为占位符，引用老vd内容，无需重新创建
    // 否则需要强制触发组件更新，包含setState内容
    nj.placeholder = true;
    nj.value = vd;
    var sr = vd.shadowRoot; // 对比需忽略on开头的事件，直接改老的引用到新的上，这样只变了on的话无需更新

    var exist = {};
    Object.keys(oj.props).forEach(function (k) {
      var v = oj.props[k];
      exist[k] = v;
    });
    Object.keys(nj.props).forEach(function (k) {
      var v = nj.props[k];

      if (/^on[a-zA-Z]/.test(k)) {
        oj.props[k] = v;
        var ex = exist[k];

        if (ex) {
          delete exist[k];

          if (ex !== v) {
            k = k.slice(2).toLowerCase();
            sr.listener[k] = v;
          }
        } else {
          k = k.slice(2).toLowerCase();
          sr.listener[k] = v;
        }
      } else if (/^on-[a-zA-Z\d_$]/.test(k)) {
        oj.props[k] = v;
        var _ex = exist[k];

        if (_ex) {
          delete exist[k];

          if (_ex !== v) {
            k = k.slice(2).toLowerCase();
            vd.off(k, exist[k]);
            vd.on(k, v);
          }

          delete exist[k];
        } else {
          k = k.slice(2).toLowerCase();
          vd.on(k, v);
        }
      }
    }); // 新的少的事件取消

    Object.keys(exist).forEach(function (k) {
      var v = exist[k];

      if (/^on[a-zA-Z]/.test(k)) {
        nj.props[k] = v;
        k = k.slice(2).toLowerCase();
        delete sr.listener[k];
      } else if (/^on-[a-zA-Z\d_$]/.test(k)) {
        nj.props[k] = v;
        k = k.slice(2).toLowerCase();
        vd.off(k, v);
      }
    });
    checkCp(vd, nj.props, !util.equal(oj.props, nj.props));
  }
  /**
   * 深度优先遍历json，将有key的记录在hash中，如果传入根vd，同步递归保存对应位置的vd
   * @param json
   * @param hash
   * @param vd
   * @returns {*}
   */


  function getKeyHash(json, hash, vd) {
    if (Array.isArray(json)) {
      json.forEach(function (item, i) {
        return getKeyHash(item, hash, vd && vd[i]);
      });
    } else if (util.isObject(json)) {
      if (json.$$type === TYPE_VD$2 || json.$$type === TYPE_GM$2 || json.$$type === TYPE_CP$2) {
        // 深度优先
        if (json.$$type === TYPE_VD$2) {
          getKeyHash(json.children, hash, vd && vd.children);
        }

        var key = json.props.key;

        if (!util.isNil(key) && key !== '') {
          // 重复key错误警告
          if (hash.hasOwnProperty(key)) {
            console.error('Component ' + vd.tagName + ' has duplicate key: ' + key);
          }

          hash[key] = {
            json: json,
            vd: vd
          };
        }
      }
    }

    return hash;
  }
  /**
   * 非一级组件diff发生更新时，其需要从sr的tree中移除，因为sr会销毁
   */


  function removeCpFromOldTree(vd) {
    // root下的一级组件不会发生回收情况，忽略
    if (!vd.host) {
      return;
    }

    var parent = vd.parent;

    if (parent) {
      var i = parent.children.indexOf(vd);

      if (i > -1) {
        parent.children[i] = null;
      } else {
        throw new Error('Can not find child: ' + vd.tagName);
      }
    }
  }
  /**
   * 执行componentDidUpdate/destroy
   */


  function did() {
    updateList.forEach(function (item) {
      if (util.isFunction(item.componentDidUpdate)) {
        item.componentDidUpdate();
      }
    });
    updateList = [];
    removeList.forEach(function (item) {
      item.__destroy();
    });
    removeList = [];
  }

  var updater = {
    ref: function ref(o) {
      Xom$2 = o.Xom;
      Dom$2 = o.Dom;
      Img$2 = o.Img;
      Geom$2 = o.Geom;
      Component$2 = o.Component;
    },
    updateList: updateList,
    check: check,
    checkCp: checkCp,
    did: did
  };

  var joinVd$1 = util.joinVd,
      joinDef$1 = util.joinDef;

  function diff(elem, ovd, nvd) {
    var cns = elem.childNodes;
    diffDefs(cns[0], ovd.defs, nvd.defs); // <REPAINT不会有lv属性，无需对比

    if (!nvd.hasOwnProperty('lv')) {
      diffBb(cns[1], ovd.bb, nvd.bb, ovd.bbClip, nvd.bbClip);
    }

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
      for (var j = ol - 1; j >= i; j--) {
        removeAt(elem, cns, j);
      }
    } else if (i < nl) {
      for (; i < nl; i++) {
        insertAt(elem, cns, i, joinDef$1(nd[i]));
      }
    }
  }

  function diffDef(elem, od, nd) {
    if (od.tagName !== nd.tagName) {
      insertAdjacentHTML(elem, 'beforebegin', joinDef$1(nd)); // elem.insertAdjacentHTML('beforebegin', joinDef(nd));

      elem.parentNode.removeChild(elem);
    } else {
      if (od.uuid !== nd.uuid) {
        elem.setAttribute('id', nd.uuid);
      }

      var op = {};

      for (var _i = 0, len = (od.props || []).length; _i < len; _i++) {
        var prop = od.props[_i];

        var _prop = _slicedToArray(prop, 2),
            k = _prop[0],
            v = _prop[1];

        op[k] = v;
      }

      for (var _i2 = 0, _len = (nd.props || []).length; _i2 < _len; _i2++) {
        var _prop2 = nd.props[_i2];

        var _prop3 = _slicedToArray(_prop2, 2),
            _k = _prop3[0],
            _v = _prop3[1]; // 已有不等更新，没有添加


        if (op.hasOwnProperty(_k)) {
          if (op[_k] !== _v) {
            elem.setAttribute(_k, _v);
          }

          delete op[_k];
        } else {
          elem.setAttribute(_k, _v);
        }
      } // 多余的删除


      Object.keys(op).forEach(function (i) {
        elem.removeAttribute(i);
      });
      var cns = elem.childNodes;
      var ol = od.children.length;
      var nl = nd.children.length;
      var i = 0;

      for (; i < Math.min(ol, nl); i++) {
        diffItem(elem, i, od.children[i], nd.children[i]);
      }

      if (i < ol) {
        for (var j = ol - 1; j >= i; j--) {
          removeAt(elem, cns, j);
        }
      } else if (i < nl) {
        for (; i < nl; i++) {
          insertAt(elem, cns, i, joinVd$1(nd.children[i]));
        }
      }
    }
  }

  function diffChild$1(elem, ovd, nvd) {
    if (ovd.type === 'dom') {
      if (nvd.type === 'dom') {
        diffD2D(elem, ovd, nvd);
      } else if (nvd.type === 'geom') {
        diffD2G(elem, ovd, nvd);
      } else {
        replaceWith(elem, nvd);
      }
    } else if (ovd.type === 'text') {
      if (nvd.type === 'text') {
        diffT2T(elem, ovd, nvd);
      } else {
        replaceWith(elem, nvd);
      }
    } else if (ovd.type === 'geom') {
      if (nvd.type === 'dom') {
        diffG2D(elem, ovd, nvd);
      } else if (nvd.type === 'geom') {
        diffG2G(elem, ovd, nvd);
      } else {
        replaceWith(elem, nvd);
      }
    } else if (ovd.type === 'img') {
      if (nvd.type === 'img') {
        diffItemSelf(elem, ovd, nvd);
      } else {
        replaceWith(elem, nvd);
      }
    }
  }

  function diffX2X(elem, ovd, nvd) {
    var transform = nvd.transform,
        opacity = nvd.opacity,
        visibility = nvd.visibility,
        mask = nvd.mask,
        clip = nvd.clip,
        filter = nvd.filter,
        conClip = nvd.conClip;

    if (ovd.transform !== transform) {
      if (transform) {
        elem.setAttribute('transform', transform);
      } else {
        elem.removeAttribute('transform');
      }
    }

    if (ovd.opacity !== opacity) {
      if (opacity !== 1 && opacity !== undefined) {
        elem.setAttribute('opacity', opacity);
      } else {
        elem.removeAttribute('opacity');
      }
    }

    if (ovd.visibility !== visibility) {
      elem.setAttribute('visibility', visibility);
    }

    if (ovd.mask !== mask) {
      if (mask) {
        elem.setAttribute('mask', mask);
      } else {
        elem.removeAttribute('mask');
      }

      if (ovd.clip) {
        elem.removeAttribute('clip-path');
      }
    }

    if (ovd.clip !== clip) {
      if (clip) {
        elem.setAttribute('clip-path', clip);
      } else {
        elem.removeAttribute('clip-path');
      }

      if (ovd.mask) {
        elem.removeAttribute('mask');
      }
    }

    if (ovd.filter !== filter) {
      if (filter) {
        elem.setAttribute('filter', filter);
      } else {
        elem.removeAttribute('filter');
      }
    }

    if (ovd.conClip !== conClip) {
      if (conClip) {
        elem.childNodes[1].setAttribute('clip-path', conClip);
      } else {
        elem.childNodes[1].removeAttribute('clip-path');
      }
    }
  }

  function diffByLessLv(elem, ovd, nvd, lv) {
    if (lv === o$1.NONE) {
      return;
    }

    var transform = nvd.transform,
        opacity = nvd.opacity,
        visibility = nvd.visibility,
        mask = nvd.mask,
        clip = nvd.clip,
        filter = nvd.filter;

    if (o$1.contain(lv, o$1.TRANSLATE_X | o$1.TRANSLATE_Y | o$1.TRANSFORM)) {
      if (transform) {
        elem.setAttribute('transform', transform);
      } else {
        elem.removeAttribute('transform');
      }
    }

    if (o$1.contain(lv, o$1.OPACITY)) {
      if (opacity !== 1) {
        elem.setAttribute('opacity', opacity);
      } else {
        elem.removeAttribute('opacity');
      }
    }

    if (o$1.contain(lv, o$1.VISIBILITY)) {
      elem.setAttribute('visibility', visibility);
    }

    if (o$1.contain(lv, o$1.FILTER)) {
      if (filter) {
        elem.setAttribute('filter', filter);
      } else {
        elem.removeAttribute('filter');
      }
    }

    if (mask) {
      elem.setAttribute('mask', mask);
    } else {
      elem.removeAttribute('mask');
    }

    if (ovd.clip) {
      elem.removeAttribute('clip-path');
    }

    if (clip) {
      elem.setAttribute('clip-path', clip);
    } else {
      elem.removeAttribute('clip-path');
    }

    if (ovd.mask) {
      elem.removeAttribute('mask');
    }
  }

  function diffD2D(elem, ovd, nvd, root) {
    // cache表明children无变化缓存，一定是REPAINT以下的，只需看自身的lv
    if (nvd.cache) {
      diffByLessLv(elem, ovd, nvd, nvd.lv);
      return;
    } // 无cache且<REPAINT的情况快速对比且继续对比children


    if (nvd.hasOwnProperty('lv')) {
      diffByLessLv(elem, ovd, nvd, nvd.lv);
    } else {
      diffX2X(elem, ovd, nvd);

      if (!root) {
        diffBb(elem.firstChild, ovd.bb, nvd.bb, ovd.bbClip, nvd.bbClip);
      }
    }

    var ol = ovd.children.length;
    var nl = nvd.children.length;
    var i = 0;
    var lastChild = elem.lastChild;
    var cns = lastChild.childNodes;

    for (; i < Math.min(ol, nl); i++) {
      diffChild$1(cns[i], ovd.children[i], nvd.children[i]);
    }

    if (i < ol) {
      for (var j = ol - 1; j >= i; j--) {
        removeAt(lastChild, cns, j);
      }
    } else if (i < nl) {
      for (; i < nl; i++) {
        insertAt(lastChild, cns, i, joinVd$1(nvd.children[i]));
      }
    }
  }

  function diffD2G(elem, ovd, nvd) {
    diffX2X(elem, ovd, nvd);
    diffBb(elem.firstChild, ovd.bb, nvd.bb, ovd.bbClip, nvd.bbClip);
    var ol = ovd.children.length;
    var nl = nvd.children.length;
    var i = 0;
    var lastChild = elem.lastChild;
    var cns = lastChild.childNodes;

    for (; i < Math.min(ol, nl); i++) {
      replaceWith(cns[i], nvd.children[i]);
    }

    if (i < ol) {
      for (var j = ol - 1; j >= i; j--) {
        removeAt(lastChild, cns, j);
      }
    } else if (i < nl) {
      for (; i < nl; i++) {
        insertAt(lastChild, cns, i, joinVd$1(nvd.children[i]));
      }
    }
  }

  function diffT2T(elem, ovd, nvd) {
    if (nvd.cache) {
      return;
    }

    var ol = ovd.children.length;
    var nl = nvd.children.length;
    var i = 0;

    for (; i < Math.min(ol, nl); i++) {
      diffItem(elem, i, ovd.children[i], nvd.children[i], true);
    }

    var cns = elem.childNodes;

    if (i < ol) {
      for (var j = ol - 1; j >= i; j--) {
        removeAt(elem, cns, j);
      }
    } else if (i < nl) {
      for (; i < nl; i++) {
        insertAt(elem, cns, i, joinVd$1(nvd.children[i]));
      }
    }
  }

  function diffG2D(elem, ovd, nvd) {
    diffD2G(elem, ovd, nvd);
  }

  function diffG2G(elem, ovd, nvd) {
    if (nvd.cache) {
      return;
    }

    diffX2X(elem, ovd, nvd);
    diffBb(elem.firstChild, ovd.bb, nvd.bb, ovd.bbClip, nvd.bbClip);
    var ol = ovd.children.length;
    var nl = nvd.children.length;
    var i = 0;
    var lastChild = elem.lastChild;
    var cns = lastChild.childNodes;

    for (; i < Math.min(ol, nl); i++) {
      diffItem(lastChild, i, ovd.children[i], nvd.children[i]);
    }

    if (i < ol) {
      for (var j = ol - 1; j >= i; j--) {
        removeAt(lastChild, cns, j);
      }
    } else if (i < nl) {
      for (; i < nl; i++) {
        insertAt(lastChild, cns, i, joinVd$1(nvd.children[i]));
      }
    }
  }

  function diffBb(elem, obb, nbb, oClip, nClip) {
    var ol = obb.length;
    var nl = nbb.length;

    if (oClip !== nClip) {
      if (!nClip) {
        elem.removeAttribute('clip-path');
      } else {
        elem.setAttribute('clip-path', nClip);
      }
    }

    var i = 0;

    for (; i < Math.min(ol, nl); i++) {
      diffItem(elem, i, obb[i], nbb[i]);
    }

    var cns = elem.childNodes;

    if (i < ol) {
      for (var j = ol - 1; j >= i; j--) {
        removeAt(elem, cns, j);
      }
    } else if (i < nl) {
      for (; i < nl; i++) {
        insertAt(elem, cns, i, joinVd$1(nbb[i]));
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
        cns[i].innerHTML = nvd.content;
      }
    }
  }

  function diffItemSelf(elem, ovd, nvd) {
    if (nvd.cache) {
      return;
    }

    var op = {};

    for (var i = 0, len = (ovd.props || []).length; i < len; i++) {
      var prop = ovd.props[i];

      var _prop4 = _slicedToArray(prop, 2),
          k = _prop4[0],
          v = _prop4[1];

      op[k] = v;
    }

    for (var _i3 = 0, _len2 = (nvd.props || []).length; _i3 < _len2; _i3++) {
      var _prop5 = nvd.props[_i3];

      var _prop6 = _slicedToArray(_prop5, 2),
          _k2 = _prop6[0],
          _v2 = _prop6[1]; // 已有不等更新，没有添加


      if (op.hasOwnProperty(_k2)) {
        if (op[_k2] !== _v2) {
          elem.setAttribute(_k2, _v2);
        }

        delete op[_k2];
      } else {
        elem.setAttribute(_k2, _v2);
      }
    } // 多余的删除


    Object.keys(op).forEach(function (i) {
      elem.removeAttribute(i);
    });
  }

  function replaceWith(elem, vd) {
    var res;

    if (Array.isArray(vd)) {
      res = '';
      vd.forEach(function (item) {
        res += joinVd$1(item);
      });
    } else {
      res = joinVd$1(vd);
    }

    insertAdjacentHTML(elem, 'beforebegin', res); // elem.insertAdjacentHTML('beforebegin', res);

    elem.parentNode.removeChild(elem);
  }

  function insertAt(elem, cns, index, html) {
    if (index >= cns.length) {
      insertAdjacentHTML(elem, 'beforeend', html); // elem.insertAdjacentHTML('beforeend', html);
    } else {
      insertAdjacentHTML(cns[index], 'beforebegin', html); // cns[index].insertAdjacentHTML('beforebegin', html);
    }
  }

  function removeAt(elem, cns, index) {
    if (cns[index]) {
      elem.removeChild(cns[index]);
    }
  }

  var svg;

  function insertAdjacentHTML(elem, where, content) {
    if (elem.insertAdjacentHTML) {
      elem.insertAdjacentHTML(where, content);
    } else {
      switch (where) {
        case 'beforeend':
          elem.innerHTML += content;
          break;

        case 'beforebegin':
          svg = svg || document.createElement('svg');
          svg.innerHTML = content;
          elem.parentNode.insertBefore(svg.childNodes[0], elem);
          break;
      }
    }
  }

  var isFunction$5 = util.isFunction;

  var Controller = /*#__PURE__*/function () {
    function Controller() {
      _classCallCheck(this, Controller);

      this.__records = [];
      this.__auto = [];
      this.__list = [];
    }

    _createClass(Controller, [{
      key: "add",
      value: function add(v) {
        if (this.__list.indexOf(v) === -1) {
          this.list.push(v);
        }
      }
    }, {
      key: "remove",
      value: function remove(v) {
        var i = this.list.indexOf(v);

        if (i > -1) {
          this.list.splice(i, 1);
        }
      }
    }, {
      key: "__destroy",
      value: function __destroy() {
        this.__records = [];
        this.__auto = [];
        this.__list = [];
      }
    }, {
      key: "__action",
      value: function __action(k, args) {
        this.list.forEach(function (item) {
          item[k].apply(item, args);
        });
      }
    }, {
      key: "init",
      value: function init() {
        var _this = this;

        var list = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.__records;

        // 检查尚未初始化的record，并初始化，后面才能调用各种控制方法
        if (list.length) {
          // 清除防止重复调用，并且新的json还会进入整体逻辑
          list.splice(0).forEach(function (item) {
            var target = item.target,
                animate = item.animate;

            if (Array.isArray(animate)) {
              animate.forEach(function (animate) {
                var value = animate.value,
                    options = animate.options;
                options.autoPlay = false;
                var o = target.animate(value, options);

                _this.add(o);
              });
            } else {
              var value = animate.value,
                  options = animate.options;
              options.autoPlay = false;
              var o = target.animate(value, options);

              _this.add(o);
            }
          });
        }
      }
    }, {
      key: "__playAuto",
      value: function __playAuto() {
        this.init(this.__auto);

        this.__action('play');
      }
    }, {
      key: "play",
      value: function play(cb) {
        this.init();
        var once = true;

        this.__action('play', [cb && function (diff) {
          if (once) {
            once = false;

            if (isFunction$5(cb)) {
              cb(diff);
            }
          }
        }]);
      }
    }, {
      key: "pause",
      value: function pause() {
        this.__action('pause');
      }
    }, {
      key: "resume",
      value: function resume(cb) {
        var once = true;

        this.__action('resume', [cb && function (diff) {
          if (once) {
            once = false;

            if (isFunction$5(cb)) {
              cb(diff);
            }
          }
        }]);
      }
    }, {
      key: "cancel",
      value: function cancel(cb) {
        var once = true;

        this.__action('cancel', [cb && function (diff) {
          if (once) {
            once = false;

            if (isFunction$5(cb)) {
              cb(diff);
            }
          }
        }]);
      }
    }, {
      key: "finish",
      value: function finish(cb) {
        var once = true;

        this.__action('finish', [cb && function (diff) {
          if (once) {
            once = false;

            if (isFunction$5(cb)) {
              cb(diff);
            }
          }
        }]);
      }
    }, {
      key: "gotoAndStop",
      value: function gotoAndStop(v, options, cb) {
        this.init();
        var once = true;

        this.__action('gotoAndStop', [v, options, cb && function (diff) {
          if (once) {
            once = false;

            if (isFunction$5(cb)) {
              cb(diff);
            }
          }
        }]);
      }
    }, {
      key: "gotoAndPlay",
      value: function gotoAndPlay(v, options, cb) {
        this.init();
        var once = true;

        this.__action('gotoAndPlay', [v, options, cb && function (diff) {
          if (once) {
            once = false;

            if (isFunction$5(cb)) {
              cb(diff);
            }
          }
        }]);
      }
    }, {
      key: "__set",
      value: function __set(key, value) {
        this.list.forEach(function (item) {
          item[key] = value;
        });
      }
    }, {
      key: "list",
      get: function get() {
        return this.__list;
      }
    }, {
      key: "playbackRate",
      set: function set(v) {
        this.__set('playbackRate', v);
      }
    }, {
      key: "iterations",
      set: function set(v) {
        this.__set('iterations', v);
      }
    }, {
      key: "playCount",
      set: function set(v) {
        this.__set('playCount', v);
      }
    }, {
      key: "fps",
      set: function set(v) {
        this.__set('fps', v);
      }
    }, {
      key: "currentTime",
      set: function set(v) {
        this.__set('currentTime', v);
      }
    }, {
      key: "spfLimit",
      set: function set(v) {
        this.__set('spfLimit', v);
      }
    }, {
      key: "delay",
      set: function set(v) {
        this.__set('delay', v);
      }
    }, {
      key: "endDelay",
      set: function set(v) {
        this.__set('endDelay', v);
      }
    }, {
      key: "fill",
      set: function set(v) {
        this.__set('fill', v);
      }
    }, {
      key: "direction",
      set: function set(v) {
        this.__set('direction', v);
      }
    }]);

    return Controller;
  }();

  var isNil$7 = util.isNil,
      isObject$2 = util.isObject,
      isFunction$6 = util.isFunction;
  var AUTO$6 = unit.AUTO,
      PX$7 = unit.PX,
      PERCENT$8 = unit.PERCENT;
  var calRelative$2 = css.calRelative,
      isRelativeOrAbsolute$2 = css.isRelativeOrAbsolute;

  function getDom(dom) {
    if (util.isString(dom) && dom) {
      var o = document.querySelector(dom);

      if (!o) {
        throw new Error('Can not find dom of selector: ' + dom);
      }

      return o;
    }

    if (!dom) {
      throw new Error('Can not find dom: ' + dom);
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

  function initEvent(dom) {
    ['click', 'dblclick', 'mousedown', 'mousemove', 'mouseup', 'touchstart', 'touchmove', 'touchend', 'touchcancel'].forEach(function (type) {
      dom.addEventListener(type, function (e) {
        var root = dom.__root;

        if (['touchend', 'touchcancel', 'touchmove'].indexOf(type) > -1) {
          root.__touchstartTarget && root.__touchstartTarget.__emitEvent(root.__wrapEvent(e), true);
        } else {
          root.__cb(e);
        }
      });
    });
  } // 提取出对比节点尺寸是否修改，用currentStyle的对比computedStyle的


  function isFixedWidthOrHeight(node, root, k) {
    var c = node.currentStyle[k];
    var v = node.computedStyle[k];

    if (c.unit === PX$7) {
      return c.value === v;
    }

    if (c.unit === PERCENT$8) {
      var parent = node.domParent;
      var s = parent.layoutData[k === 'width' ? 'w' : 'h'];
      return c.value * s * 0.01 === v;
    }

    return false;
  }

  function isFixedSize(node, root) {
    return isFixedWidthOrHeight(node, root, 'width') && isFixedWidthOrHeight(node, root, 'height');
  }

  var OFFSET$1 = 0;
  var LAYOUT = 1;

  function isLAYOUT(node, hash) {
    return node.hasOwnProperty('__uniqueReflowId') && hash[node.__uniqueReflowId] >= LAYOUT;
  }

  function setLAYOUT(node, hash) {
    addLAYOUT(node, hash);
    hash[node.__uniqueReflowId].lv |= LAYOUT;
  }

  var __uniqueReflowId = 0;

  function addLAYOUT(node, hash) {
    if (!node.hasOwnProperty('__uniqueReflowId')) {
      node.__uniqueReflowId = __uniqueReflowId;
      hash[__uniqueReflowId++] = {
        node: node,
        lv: LAYOUT
      };
    }
  }

  var uniqueUpdateId = 0;

  function parseUpdate(renderMode, root, updateHash, target, reflowList, measureList, cacheHash, cacheList, zHash, zList) {
    var node = target.node,
        style = target.style,
        origin = target.origin,
        overwrite = target.overwrite,
        focus = target.focus,
        img = target.img,
        component = target.component,
        measure = target.measure,
        list = target.list; // updateStyle()这样的调用还要计算normalize

    if (origin && style) {
      style = css.normalize(style);
    } // updateStyle()这样的调用需要覆盖原有样式，因为是按顺序遍历，后面的优先级自动更高不怕重复


    if (overwrite && style) {
      Object.assign(node.__style, style);
    }

    if (style && style !== target.style) {
      Object.assign(target.style, style);
    } // 多次调用更新才会有list，一般没有，优化


    if (list) {
      list.forEach(function (item) {
        var style = item.style,
            origin = item.origin,
            overwrite = item.overwrite;

        if (origin && style) {
          style = css.normalize(style);
        }

        if (overwrite && style) {
          Object.assign(node.__style, style);
        }

        if (style) {
          Object.assign(target.style, style);
        }
      });
    }

    style = target.style; // 按节点合并完style后判断改变等级

    var tagName = node.tagName,
        currentStyle = node.currentStyle,
        currentProps = node.currentProps,
        _node$__cacheStyle = node.__cacheStyle,
        __cacheStyle = _node$__cacheStyle === void 0 ? {} : _node$__cacheStyle,
        _node$__cacheProps = node.__cacheProps,
        __cacheProps = _node$__cacheProps === void 0 ? {} : _node$__cacheProps;

    var lv = o$1.NONE;
    var p;
    var hasMeasure = measure;
    var hasZ; // component无需遍历

    if (!component) {
      for (var k in style) {
        if (style.hasOwnProperty(k)) {
          var v = style[k]; // 只有geom的props和style2种可能

          if (o.isGeom(tagName, k)) {
            if (!css.equalStyle(k, v, currentProps[k], node)) {
              p = p || {};
              p[k] = style[k];
              lv |= o$1.REPAINT;
              __cacheProps[k] = undefined;
            }
          } else {
            // 需和现在不等，且不是pointerEvents这种无关的
            if (!css.equalStyle(k, v, currentStyle[k], node)) {
              // pointerEvents这种无关的只需更新
              if (o.isIgnore(k)) {
                __cacheStyle[k] = undefined;
                currentStyle[k] = v;
              } else {
                // TRBL变化只对relative/absolute起作用，其它忽视
                if ({
                  top: true,
                  right: true,
                  bottom: true,
                  left: true
                }.hasOwnProperty(k)) {
                  if (currentStyle.position !== 'relative' && currentStyle.position !== 'absolute' && style.position !== 'relative' && style.position !== 'absolute') {
                    delete style[k];
                    continue;
                  }
                } // 只粗略区分出none/repaint/reflow，repaint细化等级在后续，reflow在checkReflow()


                lv |= o$1.getLevel(k);

                if (o.isMeasure(k)) {
                  hasMeasure = true;
                } // repaint置空，如果reflow会重新生成空的


                __cacheStyle[k] = undefined;
                currentStyle[k] = v;
              }

              if (k === 'zIndex' && node !== root) {
                hasZ = true;
              }
            }
          }
        }
      }
    }

    if (p) {
      Object.assign(currentProps, p);
    }

    if (style) {
      Object.assign(currentStyle, style);
    }

    if (!isNil$7(focus)) {
      lv |= focus;
    } // 无任何改变处理的去除记录，如pointerEvents、无效的left


    if (lv === o$1.NONE && !img && !component) {
      delete node.__uniqueUpdateId;
      return;
    } // 记录下来清除parent的zIndexChildren缓存


    if (hasZ) {
      delete node.domParent.__zIndexChildren;
    } // reflow/repaint/measure相关的记录下来


    var isRepaint = !component && o$1.isRepaint(lv);

    if (isRepaint) {
      // zIndex变化需清空svg缓存
      if (hasZ && renderMode === mode.SVG) {
        lv |= o$1.REPAINT;
        cleanSvgCache(node.domParent);
      }

      if (!isNil$7(focus)) {
        lv |= focus;
      } // z改变影响struct局部重排，它的数量不会变因此不影响外围，此处先收集，最后统一对局部根节点进行更新


      if (hasZ && !component && zHash) {
        var _parent = node.domParent;

        if (!_parent.hasOwnProperty('__uniqueZId')) {
          zHash[uniqueUpdateId] = true;
          _parent.__uniqueZId = uniqueUpdateId++;
          zList.push(_parent);
        }
      }
    } // reflow在root的refresh中做
    else {
        reflowList.push({
          node: node,
          style: style,
          img: img,
          component: component
        }); // measure需要提前先处理

        if (hasMeasure) {
          measureList.push(node);
        }
      }

    node.__refreshLevel = lv; // dom在>=REPAINT时total失效，svg的geom比较特殊，任何改变都失效

    var need = node.__refreshLevel >= o$1.REPAINT || renderMode === mode.SVG && node instanceof Geom$1;

    if (need) {
      if (node.__cache) {
        node.__cache.release();
      }

      if (node.__cacheTotal) {
        node.__cacheTotal.release();
      }

      if (node.__cacheMask) {
        node.__cacheMask = null;
      }
    }

    if ((need || o$1.contain(lv, o$1.FILTER)) && node.__cacheFilter) {
      node.__cacheFilter = null;
    } // 向上清除等级>=REPAINT的汇总缓存信息，过程中可能会出现重复，因此节点上记录一个临时标防止重复递归


    var parent = node.domParent; // 向上查找，出现重复跳出

    while (parent) {
      if (parent.hasOwnProperty('__uniqueUpdateId')) {
        var id = parent.__uniqueUpdateId;

        if (cacheHash.hasOwnProperty(id)) {
          break;
        }

        cacheHash[id] = true;
      } // 没有的需要设置一个标识
      else {
          cacheHash[uniqueUpdateId] = true;
          parent.__uniqueUpdateId = uniqueUpdateId++;
          cacheList.push(parent);
        }

      var _lv = parent.__refreshLevel;

      var _need = _lv >= o$1.REPAINT;

      if (_need && parent.__cache) {
        parent.__cache.release();
      } // 前面已经过滤了无改变NONE的，只要孩子有任何改变父亲就要清除


      if (parent.__cacheTotal) {
        parent.__cacheTotal.release();
      }

      if (parent.__cacheFilter) {
        parent.__cacheFilter = null;
      }

      if (parent.__cacheMask) {
        parent.__cacheMask = null;
      }

      parent = parent.domParent;
    }

    return true;
  }

  function cleanSvgCache(node) {
    node.__refreshLevel |= o$1.REPAINT;

    if (Array.isArray(node.children)) {
      node.children.forEach(function (child) {
        if (child instanceof Component$1) {
          child = child.shadowRoot;
        }

        if (!(child instanceof Text)) {
          cleanSvgCache(child);
        }
      });
    }
  }

  var uuid$1 = 0;

  var Root = /*#__PURE__*/function (_Dom) {
    _inherits(Root, _Dom);

    var _super = _createSuper(Root);

    function Root(tagName, props, children) {
      var _this;

      _classCallCheck(this, Root);

      _this = _super.call(this, tagName, props);
      _this.__cd = children || []; // 原始children，再初始化过程中生成真正的dom

      _this.__dom = null; // 真实DOM引用

      _this.__mw = 0; // 记录最大宽高，防止尺寸变化清除不完全

      _this.__mh = 0;
      _this.__scx = 1; // 默认缩放，css改变canvas/svg缩放后影响事件坐标

      _this.__scy = 1;
      _this.__task = [];
      _this.__ref = {};
      _this.__updateList = [];
      _this.__updateHash = {};
      _this.__reflowList = [{
        node: _assertThisInitialized(_this)
      }]; // 初始化填自己，第一次布局时复用逻辑完全重新布局

      _this.__animateController = new Controller();
      Event.mix(_assertThisInitialized(_this));
      return _this;
    }

    _createClass(Root, [{
      key: "__initProps",
      value: function __initProps() {
        var w = this.props.width;

        if (!isNil$7(w)) {
          var value = parseFloat(w) || 0;

          if (value > 0) {
            this.__width = value;
          }
        }

        var h = this.props.height;

        if (!isNil$7(h)) {
          var _value = parseFloat(h) || 0;

          if (_value > 0) {
            this.__height = _value;
          }
        }
      }
    }, {
      key: "__genHtml",
      value: function __genHtml() {
        var _this2 = this;

        var res = "<".concat(this.tagName); // 拼接处理属性

        Object.keys(this.props).forEach(function (k) {
          var v = _this2.props[k]; // 忽略事件

          if (!/^on[a-zA-Z]/.test(k)) {
            res += renderProp(k, v);
          }
        });
        res += "></".concat(this.tagName, ">");
        return res;
      }
    }, {
      key: "__wrapEvent",
      value: function __wrapEvent(e) {
        var x, y; // 触摸结束取消特殊没有touches

        if (['touchend', 'touchcancel'].indexOf(e.type) === -1) {
          var dom = this.dom,
              __scx = this.__scx,
              __scy = this.__scy;

          var _dom$getBoundingClien = dom.getBoundingClientRect(),
              x2 = _dom$getBoundingClien.x,
              y2 = _dom$getBoundingClien.y,
              left = _dom$getBoundingClien.left,
              top = _dom$getBoundingClien.top;

          x = x2 || left || 0;
          y = y2 || top || 0;

          var _ref = e.touches ? e.touches[0] : e,
              pageX = _ref.pageX,
              pageY = _ref.pageY;

          x = pageX - x;
          y = pageY - y; // 外边的scale影响元素事件响应，根据倍数计算真实的坐标

          if (__scx !== 1) {
            x /= __scx;
          }

          if (__scy !== 1) {
            y /= __scy;
          }
        }

        return {
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
          __hasEmitted: false
        };
      } // 类似touchend/touchcancel/touchmove这种无需判断是否发生于元素上，直接响应

    }, {
      key: "__cb",
      value: function __cb(e) {
        if (e.type === 'touchmove' && !this.__touchstartTarget) {
          return;
        }

        var data = this.__wrapEvent(e);

        this.__emitEvent(data);

        return data;
      }
    }, {
      key: "appendTo",
      value: function appendTo(dom) {
        dom = getDom(dom);
        this.__children = builder.initRoot(this.__cd, this);

        this.__initProps();

        this.__root = this;
        this.cache = !!this.props.cache; // 已有root节点

        if (dom.nodeName.toUpperCase() === this.tagName.toUpperCase()) {
          this.__dom = dom;

          if (this.width) {
            dom.setAttribute('width', this.width);
          }

          if (this.height) {
            dom.setAttribute('height', this.height);
          }
        } // 没有canvas/svg节点则生成一个新的
        else {
            this.__dom = dom.querySelector(this.tagName);

            if (!this.__dom) {
              dom.innerHTML = this.__genHtml();
              this.__dom = dom.querySelector(this.tagName);
            }
          }

        this.__uuid = isNil$7(this.__dom.__uuid) ? uuid$1++ : this.__dom.__uuid;
        this.__defs = this.dom.__defs || Defs.getInstance(this.__uuid); // 没有设置width/height则采用css计算形式

        if (!this.width || !this.height) {
          var _css = window.getComputedStyle(dom, null);

          if (!this.width) {
            this.__width = parseFloat(_css.getPropertyValue('width')) || 0;
            dom.setAttribute('width', this.width);
          }

          if (!this.height) {
            this.__height = parseFloat(_css.getPropertyValue('height')) || 0;
            dom.setAttribute('height', this.height);
          }
        } // 只有canvas有ctx，svg用真实dom


        if (this.tagName === 'canvas') {
          this.__ctx = this.__dom.getContext('2d');
          this.__renderMode = mode.CANVAS;
        } else if (this.tagName === 'svg') {
          this.__renderMode = mode.SVG;
        }

        this.refresh(null, true); // 第一次节点没有__root，渲染一次就有了才能diff

        if (this.dom.__root) {
          this.dom.__root.destroy();
        } else {
          initEvent(this.dom);
          this.dom.__uuid = this.__uuid;
        }

        this.dom.__root = this;
      }
    }, {
      key: "refresh",
      value: function refresh(cb, isFirst) {
        var _this3 = this;

        this.__hookTask = null;
        var isDestroyed = this.isDestroyed,
            renderMode = this.renderMode,
            ctx = this.ctx,
            defs = this.defs,
            width = this.width,
            height = this.height;

        if (isDestroyed) {
          return;
        }

        defs.clear(); // 首次递归测量整树的继承，后续更改各自更新机制做，防止每次整树遍历；root检查首次直接做，后续在checkUpdate()中插入

        if (isFirst) {
          this.__checkRoot(width, height);

          this.__computeMeasure(renderMode, ctx);
        } // 非首次刷新如果没有更新则无需继续
        else if (!this.__checkUpdate(renderMode, ctx, width, height)) {
            return;
          } // 获取所有字体和大小测量，一般是同步，为了防止外部因素inject是异步写成了cb形式


        inject.measureText(function () {
          _this3.__checkReflow(width, height);

          if (renderMode === mode.CANVAS) {
            _this3.__clear(ctx);
          }

          _this3.render(renderMode, _this3.__refreshLevel, ctx, defs); // 利用list循环代替tree递归快速渲染
          // let cache = this.cache;
          // this.__structs.forEach(struct => {
          //   console.log(struct);
          //   let { node, index, childIndex, lv, num, total } = struct;
          //   node.render2(renderMode, node.__refreshLevel, ctx, defs, cache);
          // });
          // svg的特殊diff需要


          if (renderMode === mode.SVG) {
            var nvd = _this3.virtualDom;
            nvd.defs = defs.value;

            if (_this3.dom.__root) {
              diff(_this3.dom, _this3.dom.__vd, nvd);
            } else {
              _this3.dom.innerHTML = util.joinVirtualDom(nvd);
            }

            _this3.dom.__vd = nvd;
            _this3.dom.__defs = defs;
          } // 特殊cb，供小程序绘制完回调使用


          if (isFunction$6(cb)) {
            cb();
          }

          _this3.emit(Event.REFRESH);
        });
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this.__destroy();

        frame.offFrame(this.__rTask);
        var n = this.dom;

        if (n) {
          n.__root = null;
        }
      }
    }, {
      key: "scale",
      value: function scale() {
        var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
        var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : x;
        this.__scx = x;
        this.__scy = y;
      }
    }, {
      key: "addRefreshTask",
      value: function addRefreshTask(cb) {
        var _this4 = this;

        if (!cb) {
          return;
        }

        var task = this.task; // 第一个添加延迟侦听，后续放队列等待一并执行

        if (!task.length) {
          var clone;
          frame.nextFrame(this.__rTask = {
            before: function before(diff) {
              clone = task.splice(0); // 前置一般是动画计算此帧样式应用，然后刷新后出发frame事件，图片加载等同

              if (clone.length) {
                var setStateList = [];
                clone.forEach(function (item, i) {
                  if (isObject$2(item) && isFunction$6(item.before)) {
                    // 收集组件setState的更新，特殊处理
                    if (item.__state) {
                      setStateList.push(i);
                    }

                    item.before(diff);
                  }
                }); // 刷新前先进行setState检查，全都是setState触发的且没有更新则无需刷新

                if (setStateList.length) {
                  updater.check(_this4);
                } // 有组件更新，则需要重新布局


                var len = updater.updateList.length;

                if (len) {
                  updater.updateList.forEach(function (cp) {
                    var sr = cp.shadowRoot; // 可能返回text，需视为其parentNode

                    if (sr instanceof Text) {
                      sr = sr.domParent;
                    }

                    _this4.__addUpdate({
                      node: sr,
                      style: sr.currentStyle,
                      focus: o$1.REFLOW,
                      measure: true,
                      // 未知强制measure
                      component: true // 强制reflow

                    });
                  });

                  _this4.refresh();
                } // 有可能组件都不需要更新，且没有其它触发的渲染更新
                else if (clone.length > setStateList.length) {
                    _this4.refresh();
                  } // 避免重复刷新，在frame每帧执行中，比如图片进行了异步刷新，动画的hook就可以省略再刷新一次


                var r = _this4.__hookTask;

                if (r) {
                  var hookTask = frame.__hookTask;
                  var i = hookTask.indexOf(r);

                  if (i > -1) {
                    hookTask.splice(i, 1);
                  }
                } // 触发didUpdate


                updater.did();
              }
            },
            after: function after(diff) {
              clone.forEach(function (item) {
                if (isObject$2(item) && isFunction$6(item.after)) {
                  item.after(diff);
                } else if (isFunction$6(item)) {
                  item(diff);
                }
              });
            }
          });
        }

        if (task.indexOf(cb) === -1) {
          task.push(cb);
        }
      }
    }, {
      key: "delRefreshTask",
      value: function delRefreshTask(cb) {
        if (!cb) {
          return;
        }

        var task = this.task;

        for (var i = 0, len = task.length; i < len; i++) {
          if (task[i] === cb) {
            task.splice(i, 1);
            break;
          }
        }

        if (!task.length) {
          frame.offFrame(this.__rTask);
        }
      }
      /**
       * 每次刷新前检查root节点的样式，有些固定的修改无效，有些继承的作为根初始化
       * @param width
       * @param height
       * @private
       */

    }, {
      key: "__checkRoot",
      value: function __checkRoot(width, height) {
        var currentStyle = this.currentStyle,
            computedStyle = this.computedStyle; // canvas/svg作为根节点一定是block或flex，不会是inline

        if (['flex', 'block'].indexOf(currentStyle.display) === -1) {
          computedStyle.display = currentStyle.display = 'block';
        } // 同理position不能为absolute


        if (currentStyle.positoin === 'absolute') {
          computedStyle.position = currentStyle.positoin = 'static';
        } // 根节点满宽高


        currentStyle.width = {
          value: width,
          unit: PX$7
        };
        currentStyle.height = {
          value: height,
          unit: PX$7
        };
        computedStyle.width = width;
        computedStyle.height = height; // 继承值变默认，提前处理以便子节点根据parent计算

        css.computeMeasure(this, true);
      }
      /**
       * 添加更新入口，按节点汇总更新信息
       * @private
       */

    }, {
      key: "__addUpdate",
      value: function __addUpdate(o) {
        var updateHash = this.__updateHash;
        var node = o.node,
            style = o.style,
            origin = o.origin,
            overwrite = o.overwrite,
            focus = o.focus,
            img = o.img,
            component = o.component,
            measure = o.measure; // 事件队列和setState等原因，可能node已经销毁

        if (node.isDestroyed) {
          return;
        } // root特殊处理，检查变更时优先看继承信息


        if (node === this) {
          var target = this.__updateRoot;

          if (target) {
            if (img) {
              target.img = img;
            }

            if (focus) {
              target.focus = focus;
            }

            if (measure) {
              target.measure = true;
            }

            target.list = target.list || [];
            target.list.push({
              style: style,
              origin: origin,
              overwrite: overwrite
            });
          } else {
            this.__updateRoot = {
              node: node,
              style: style,
              origin: origin,
              overwrite: overwrite,
              focus: focus,
              img: img,
              measure: measure
            };
          }
        } else if (!node.hasOwnProperty('__uniqueUpdateId')) {
          node.__uniqueUpdateId = uniqueUpdateId; // 大多数情况节点都只有一次更新，所以优化首次直接存在style上，后续存在list

          updateHash[uniqueUpdateId++] = {
            node: node,
            style: style,
            origin: origin,
            overwrite: overwrite,
            focus: focus,
            img: img,
            component: component,
            measure: measure
          };
        } else if (updateHash.hasOwnProperty(node.__uniqueUpdateId)) {
          var _target = updateHash[node.__uniqueUpdateId];

          if (img) {
            _target.img = img;
          }

          if (focus) {
            _target.focus = focus;
          }

          if (measure) {
            _target.measure = true;
          } // 后续存在新建list上，需增加遍历逻辑


          _target.list = _target.list || [];

          _target.list.push({
            style: style,
            origin: origin,
            overwrite: overwrite
          });
        } else {
          console.error('Update process miss uniqueUpdateId');
        }
      }
      /**
       * 除首次外每次刷新前检查更新列表，计算样式变化，以及测量信息
       * @private
       */

    }, {
      key: "__checkUpdate",
      value: function __checkUpdate(renderMode, ctx, width, height) {
        var _this5 = this;

        var measureList = [];
        var reflowList = [];
        var cacheHash = {};
        var cacheList = [];
        var zHash = {};
        var zList = [];
        var updateRoot = this.__updateRoot;
        var updateHash = this.__updateHash;
        var hasUpdate; // root更新特殊提前，因为有继承因素

        var root = this;

        if (updateRoot) {
          this.__updateRoot = null;
          hasUpdate = parseUpdate(renderMode, root, updateHash, updateRoot, reflowList, measureList, cacheHash, cacheList); // 此时做root检查，防止root出现继承等无效样式

          this.__checkRoot(width, height);
        } // 汇总处理每个节点


        var keys = Object.keys(updateHash);
        keys.forEach(function (k) {
          hasUpdate = parseUpdate(renderMode, _this5, updateHash, updateHash[k], reflowList, measureList, cacheHash, cacheList, zHash, zList) || hasUpdate;
        }); // 先做一部分reset避免下面measureList干扰，cacheList的是专门收集新增的额外节点

        this.__reflowList = reflowList;
        uniqueUpdateId = 0;
        this.__updateHash = {};
        cacheList.forEach(function (item) {
          delete item.__uniqueUpdateId;
        }); // zIndex改变的汇总修改，防止重复操作

        zList.forEach(function (item) {
          if (item.hasOwnProperty('__uniqueZId')) {
            delete item.__uniqueZId;

            item.__updateStruct(root.__structs);
          }
        });
        /**
         * 遍历每项节点，计算测量信息，节点向上向下查找继承信息，如果parent也是继承，先计算parent的
         * 过程中可能会出现重复，因此节点上记录一个临时标防止重复递归
         */

        var measureHash = {};
        measureList.forEach(function (node) {
          var __uniqueUpdateId = node.__uniqueUpdateId,
              parent = node.domParent;

          if (measureHash.hasOwnProperty(__uniqueUpdateId)) {
            return;
          }

          measureHash[__uniqueUpdateId] = true;
          var last = node; // 检查measure的属性是否是inherit

          var isInherit = o.isMeasureInherit(updateHash[__uniqueUpdateId].style); // 是inherit，需要向上查找，从顶部向下递归计算继承信息

          if (isInherit) {
            while (parent && parent !== _this5) {
              var _parent2 = parent,
                  _uniqueUpdateId = _parent2.__uniqueUpdateId,
                  currentStyle = _parent2.currentStyle;

              var _isInherit = void 0;

              if (parent.hasOwnProperty('__uniqueUpdateId')) {
                var style = updateHash[_uniqueUpdateId].style;
                measureHash[_uniqueUpdateId] = true;
                var temp = o.measureInheritList(style);
                _isInherit = !!temp.length;
              } else {
                _isInherit = o.isMeasureInherit(currentStyle);
              } // 如果parent有inherit存入列表且继续向上，否则跳出循环


              if (_isInherit) {
                last = parent;
              } else {
                break;
              } // 考虑component下的继续往上继承


              parent = parent.domParent;
            }
          } // 自顶向下查找inherit的，利用已有的方法+回调


          last.__computeMeasure(renderMode, ctx, function (target) {
            if (target.hasOwnProperty('__uniqueUpdateId')) {
              measureHash[target.__uniqueUpdateId] = true;
            }
          });
        }); // 做完清空留待下次刷新重来

        keys.forEach(function (k) {
          delete updateHash[k].node.__uniqueUpdateId;
        });
        return hasUpdate;
      }
      /**
       * 除首次外每次刷新前检查reflow列表，计算需要reflow的节点局部重新布局
       * 当一个元素absolute时，其变化不会影响父元素和兄弟元素，直接自己重新局部LAYOUT包含子节点
       * 当inline变化时，视为其最近block/flex父变化
       * 当block变化时，如父是flex往上查找最上层flex视为其变化，如不是则影响后面兄弟和父resize
       * 当flex变化时，如父是flex往上查找最上层flex视为其变化，如不是则影响所有递归子节点和父resize
       * 以上3种情况向上查找时遇到absolute父均提前跳出，并标记absolute父LAYOUT
       * 当relative只变化left/top/right/bottom时，自己重新layout
       * 检测节点时记录影响的所有节点，最终形成一棵或n棵局部树
       * 一般需要重新布局的记作LAYOUT，被兄弟影响只需偏移的记作OFFSET，OFFSET可能会重复变为LAYOUT
       * 上述情况倘若发生包含重复，去掉子树，因子树视为被包含的重新布局
       * 如果有从root开始的，直接重新布局像首次那样即可
       * 如果非root，所有树根按先根顺序记录下来，依次执行局部布局
       * @private
       */

    }, {
      key: "__checkReflow",
      value: function __checkReflow(width, height) {
        var _this6 = this;

        var reflowList = this.__reflowList;

        if (!reflowList.length) {
          return;
        }

        var root = this;
        var hasRoot;
        __uniqueReflowId = 0;
        var reflowHash = {}; // 单独提出共用检测影响的函数，非absolute和relative的offset情况从节点本身开始向上分析影响

        function checkInfluence(node, focus) {
          // 自身尺寸固定且无变化，无需向上查找，但position发生变化的除外
          if (isFixedSize(node, root) && !focus) {
            return;
          } // cp强制刷新


          if (node instanceof Component$1) {
            return;
          }

          var target = node; // inline新老都影响，节点变为最近的父非inline

          if (node.currentStyle.display === 'inline' || node.computedStyle.display === 'inline') {
            var _parent3 = node.domParent;

            do {
              target = _parent3; // 父到root提前跳出

              if (_parent3 === root) {
                return true;
              } // 父已有LAYOUT跳出防重


              if (isLAYOUT(_parent3, reflowHash)) {
                return;
              } // 遇到absolute跳出，如果absolute发生变化，一定会存在于列表中，不用考虑


              if (_parent3.currentStyle.position === 'absolute' || _parent3.computedStyle.position === 'absolute') {
                setLAYOUT(_parent3, reflowHash);
                return;
              } // 父固定宽度跳出直接父进行LAYOUT即可


              if (isFixedSize(_parent3)) {
                setLAYOUT(_parent3, reflowHash);
                return;
              } // 继续向上


              _parent3 = _parent3.domParent;
            } while (_parent3 && (_parent3.currentStyle.display === 'inline' || _parent3.computedStyle.display === 'inline')); // target至少是node的parent，如果固定尺寸提前跳出


            if (isFixedSize(target)) {
              setLAYOUT(target, reflowHash);
              return;
            }
          } // 此时target指向node，如果原本是inline则是其非inline父


          var parent = target.domParent; // parent有LAYOUT跳出，已被包含

          if (parent && isLAYOUT(parent, reflowHash)) {
            return;
          } // 检查flex，如果父是flex，向上查找flex顶点视作其更改


          if (parent && (parent.computedStyle.display === 'flex' || parent.currentStyle.display === 'flex')) {
            do {
              target = parent;

              if (parent === root) {
                return true;
              }

              if (isLAYOUT(parent, reflowHash)) {
                return;
              }

              if (parent.currentStyle.position === 'absolute' || parent.computedStyle.position === 'absolute') {
                setLAYOUT(parent, reflowHash);
                return;
              }

              if (isFixedSize(parent)) {
                setLAYOUT(parent, reflowHash);
                return;
              }

              parent = parent.domParent;
            } while (parent && (parent.computedStyle.display === 'flex' || parent.currentStyle.display === 'flex')); // target至少是node的parent，如果固定尺寸提前跳出


            if (isFixedSize(target)) {
              setLAYOUT(target, reflowHash);
              return;
            }
          } // 此时target指向node，如果父原本是flex则是其最上flex父


          parent = target.domParent; // parent有LAYOUT跳出，已被包含

          if (parent && isLAYOUT(parent, reflowHash)) {
            return;
          } // 向上查找了并且没提前跳出的，父重新布局


          if (target !== node) {
            setLAYOUT(target, reflowHash);
          }
        } // 遍历检查发生布局改变的节点列表，此时computedStyle还是老的，currentStyle是新的


        for (var i = 0, len = reflowList.length; i < len; i++) {
          var _reflowList$i = reflowList[i],
              node = _reflowList$i.node,
              style = _reflowList$i.style,
              img = _reflowList$i.img,
              component = _reflowList$i.component; // root提前跳出，完全重新布局

          if (node === this) {
            hasRoot = true;
            break;
          }

          var currentStyle = node.currentStyle,
              computedStyle = node.computedStyle; // 每个节点生成唯一的布局识别id存入hash防止重复

          if (!node.hasOwnProperty('__uniqueReflowId')) {
            node.__uniqueReflowId = __uniqueReflowId;
            reflowHash[__uniqueReflowId++] = {
              node: node,
              lv: OFFSET$1,
              img: img,
              component: component
            };
          }

          var o = reflowHash[node.__uniqueReflowId]; // absolute无变化，只影响自己

          if (currentStyle.position === 'absolute' && computedStyle.position === 'absolute') {
            o.lv = LAYOUT;
          } // absolute和非absolute互换
          else if (currentStyle.position !== computedStyle.position) {
              o.lv = LAYOUT;

              if (checkInfluence(node, true)) {
                hasRoot = true;
                break;
              }
            } // 所有其它变化
            else {
                var onlyXY = true;

                if (style) {
                  var keys = Object.keys(style);

                  for (var _i = 0, _len = keys.length; _i < _len; _i++) {
                    var k = keys[_i];

                    if (k !== 'left' && k !== 'top' && k !== 'right' && k !== 'bottom') {
                      onlyXY = false;
                      break;
                    }
                  }
                } // relative只有x/y变化时特殊只进行OFFSET，非relative的忽视掉这个无用影响
                // img和component加载特殊进到这里强制LAYOUT


                if (onlyXY && !img && !component) {
                  if (computedStyle.position === 'relative') {
                    o.lv |= OFFSET$1;
                  }
                } // 剩余的其它变化
                else {
                    o.lv = LAYOUT;

                    if (checkInfluence(node)) {
                      hasRoot = true;
                      break;
                    }
                  }
              }
        }

        __uniqueReflowId = 0;
        this.__reflowList = []; // 有root提前跳出

        if (hasRoot) {
          reflowList.forEach(function (item) {
            return delete item.node.__uniqueReflowId;
          }); // 布局分为两步，普通流和定位流，互相递归

          this.__layout({
            x: 0,
            y: 0,
            w: width,
            h: height
          }); // 绝对布局需要从根开始保存相对坐标系的容器引用，并根据relative/absolute情况变更


          this.__layoutAbs(this, {
            x: 0,
            y: 0,
            w: width,
            h: height
          });

          this.__structs = this.__structure(0, 0);
        }
        /**
         * 修剪树，自顶向下深度遍历
         * LAYOUT节点作为局部根，其递归子节点无需重复任何操作去重
         * OFFSET节点作为局部根，其递归子节点先执行任何操作，后续根节点再偏移一次
         */
        else {
            var uniqueList = [];
            this.deepScan(function (node, options) {
              if (node.hasOwnProperty('__uniqueReflowId')) {
                var _o = reflowHash[node.__uniqueReflowId];
                delete node.__uniqueReflowId; // 清除掉

                if (_o.lv >= LAYOUT) {
                  options.uniqueList.push(_o);
                } else {
                  // OFFSET的话先递归看子节点，本身改变放在最后
                  var _uniqueList = [];
                  node.deepScan(function (child, uniqueList) {}, {
                    uniqueList: _uniqueList
                  });

                  _uniqueList.forEach(function (item) {
                    options.uniqueList.push(item);
                  });

                  options.uniqueList.push(_o);
                } // 返回true即可提前结束深度遍历，在reflowHash有记录时提前跳出，子节点交由上面逻辑执行


                return true;
              } // reflowHash没有记录则无返回继续递归执行

            }, {
              uniqueList: uniqueList
            }); // 按顺序执行列表即可，上层LAYOUT先执行停止递归子节点，上层OFFSET后执行等子节点先LAYOUT/OFFSET

            var diffList = [];
            var diffI = 0;
            uniqueList.forEach(function (item) {
              var node = item.node,
                  lv = item.lv,
                  component = item.component; // 重新layout的w/h数据使用之前parent暂存的，x使用parent，y使用prev或者parent的

              if (lv >= LAYOUT) {
                var zIndex,
                    position,
                    cs = node.computedStyle;

                if (component) {
                  zIndex = cs.zIndex;
                  position = cs.position;
                }

                var isLastAbs = cs.position === 'absolute';
                var isNowAbs = cs.position === 'absolute';
                var parent = node.domParent;
                var _parent$layoutData = parent.layoutData,
                    _x = _parent$layoutData.x,
                    y = _parent$layoutData.y,
                    w = _parent$layoutData.w,
                    h = _parent$layoutData.h,
                    _width = parent.width,
                    _computedStyle = parent.computedStyle;
                var current = node; // cp的shadowRoot要向上到cp本身

                while (component && current.isShadowRoot) {
                  current = current.host;
                }

                var ref = current.prev;

                if (ref) {
                  y = ref.y;
                  y += ref.outerHeight;
                } else {
                  y = parent.y;
                  y += _computedStyle.marginTop + _computedStyle.borderTopWidth + _computedStyle.paddingTop;
                }

                _x += _computedStyle.marginLeft + _computedStyle.borderLeftWidth + _computedStyle.paddingLeft;
                var outerWidth = node.outerWidth,
                    outerHeight = node.outerHeight;
                var change2Abs; // 找到最上层容器，如果是组件的子节点，以sr为container，sr本身往上找

                var container = node;

                if (isNowAbs) {
                  container = container.domParent;

                  while (container && container !== root) {
                    if (isRelativeOrAbsolute$2) {
                      break;
                    }

                    if (container.parent) {
                      container = container.parent;
                    } else if (container.host) {
                      break;
                    }
                  }

                  if (!container) {
                    container = root;
                  }

                  parent.__layoutAbs(container, null, node); // 前后都是abs无需偏移后面兄弟


                  if (isLastAbs) {
                    return;
                  }

                  change2Abs = true;
                } else {
                  node.__layout({
                    x: _x,
                    y: y,
                    w: _width,
                    h: h
                  });

                  if (node instanceof Dom$1) {
                    if (!node.parent && node.host) {
                      container = node; // 特殊判断component的sr为container
                    }

                    node.__layoutAbs(container, {
                      x: _x,
                      y: y,
                      w: _width,
                      h: h
                    });
                  }
                } // 记录重新布局引发的差值w/h，注意abs到非abs的切换情况


                var fromAbs = node.computedStyle.position === 'absolute';
                var dx, dy;

                if (change2Abs) {
                  dx = -outerWidth;
                  dy = -outerHeight;
                } else {
                  var ow = node.outerWidth,
                      oh = node.outerHeight;

                  if (fromAbs) {
                    dx = ow;
                    dy = oh;
                  } else {
                    dx = ow - outerWidth;
                    dy = oh - outerHeight;
                  }
                } // 向上查找最近的parent是relative，需再次累加ox/oy，无需递归，因为已经包含了


                var p = node;

                while (p && p !== root) {
                  p = p.domParent;
                  _computedStyle = p.computedStyle;

                  if (_computedStyle.position === 'relative') {
                    var _p = p,
                        ox = _p.ox,
                        oy = _p.oy;
                    ox && node.__offsetX(ox);
                    oy && node.__offsetY(oy);
                    break;
                  }
                } // 如果有差值，偏移next兄弟，同时递归向上所有parent扩充和next偏移，直到absolute的中止


                if (dx || dy) {
                  var _p2 = node;
                  var last;

                  do {
                    // component的sr没有next兄弟，视为component的next
                    while (_p2.isShadowRoot) {
                      _p2 = _p2.host;
                    }

                    last = _p2; // 先偏移next，忽略有定位的absolute或LAYOUT

                    var next = _p2.next;

                    while (next) {
                      if (next.currentStyle.position === 'absolute') {
                        if (next.currentStyle.top.unit === AUTO$6 && next.currentStyle.bottom.unit === AUTO$6) {
                          next.__offsetY(dy, true, o$1.REFLOW);

                          next.__cancelCache();
                        }
                      } else if (!next.hasOwnProperty('____uniqueReflowId') || reflowHash[next.____uniqueReflowId] < LAYOUT) {
                        next.__offsetY(dy, true, o$1.REFLOW);

                        next.__cancelCache();
                      }

                      next = next.next;
                    } // 要么一定有parent，因为上面向上循环排除了cp返回cp的情况；要么就是root本身


                    _p2 = _p2.parent;

                    if (_p2 === root) {
                      break;
                    } // parent判断是否要resize


                    var _p3 = _p2,
                        _currentStyle = _p3.currentStyle;
                    var isAbs = _currentStyle.positoin === 'absolute';

                    if (dx) {
                      var need = void 0; // width在block不需要，parent一定不会是flex/inline

                      if (isAbs) {
                        if (_currentStyle.width.unit === AUTO$6 && (_currentStyle.left.unit === AUTO$6 || _currentStyle.right.unit === AUTO$6)) {
                          need = true;
                        }
                      }

                      if (need) {
                        _p2.__resizeX(dx);

                        _p2.__cancelCache();

                        _p2.__refreshLevel |= o$1.REFLOW;
                      }
                    }

                    if (dy) {
                      var _need2 = void 0;

                      if (isAbs) {
                        if (_currentStyle.height.unit === AUTO$6 && (_currentStyle.top.unit === AUTO$6 || _currentStyle.bottom.unit === AUTO$6)) {
                          _need2 = true;
                        }
                      } // height则需要
                      else if (_currentStyle.height.unit === AUTO$6) {
                          _need2 = true;
                        }

                      if (_need2) {
                        _p2.__resizeY(dy);

                        _p2.__cancelCache();

                        _p2.__refreshLevel |= o$1.REFLOW;
                      } // 高度不需要调整提前跳出
                      else {
                          break;
                        }
                    }
                  } while (true); // 最后一个递归向上取消缓存，防止过程中重复next多次无用递归


                  while (last) {
                    last.__cancelCache();

                    last = last.domParent;
                  }
                } // component未知dom变化，所以强制重新struct，同时防止zIndex变更影响父节点


                if (component) {
                  var arr = node.__modifyStruct(root, diffI);

                  diffI += arr[1];
                  diffList.push(arr);

                  if (cs.position !== position && (cs.position === 'static' || position === 'static') || cs.zIndex !== zIndex) {
                    node.domParent.__updateStruct(root.__structs);

                    if (_this6.renderMode === mode.SVG) {
                      cleanSvgCache(node.domParent);
                    }
                  }
                }
              } // OFFSET操作的节点都是relative，要考虑auto变化
              else {
                  var _node$currentStyle = node.currentStyle,
                      top = _node$currentStyle.top,
                      right = _node$currentStyle.right,
                      bottom = _node$currentStyle.bottom,
                      left = _node$currentStyle.left,
                      _currentStyle2 = node.currentStyle,
                      _node$computedStyle = node.computedStyle,
                      t = _node$computedStyle.top,
                      r = _node$computedStyle.right,
                      b = _node$computedStyle.bottom,
                      l = _node$computedStyle.left,
                      _computedStyle2 = node.computedStyle;

                  var _parent4;

                  if (node === _this6) {
                    _parent4 = node;
                  } else {
                    _parent4 = node.domParent;
                  }

                  var newY = 0;

                  if (top.unit !== AUTO$6) {
                    newY = calRelative$2(_currentStyle2, 'top', top, _parent4);
                    _computedStyle2.top = newY;
                    _computedStyle2.bottom = 'auto';
                  } else if (bottom.unit !== AUTO$6) {
                    newY = -calRelative$2(_currentStyle2, 'bottom', bottom, _parent4);
                    _computedStyle2.bottom = -newY;
                    _computedStyle2.top = 'auto';
                  } else {
                    _computedStyle2.top = _computedStyle2.bottom = 'auto';
                  }

                  var oldY = 0;

                  if (t !== 'auto') {
                    oldY = t;
                  } else if (b !== 'auto') {
                    oldY = -b;
                  }

                  if (newY !== oldY) {
                    node.__offsetY(newY - oldY, false, o$1.REFLOW);
                  }

                  var newX = 0;

                  if (left.unit !== AUTO$6) {
                    newX = calRelative$2(_currentStyle2, 'left', left, _parent4);
                    _computedStyle2.left = newX;
                    _computedStyle2.right = 'auto';
                  } else if (right.unit !== AUTO$6) {
                    newX = -calRelative$2(_currentStyle2, 'right', right, _parent4);
                    _computedStyle2.right = -newX;
                    _computedStyle2.left = 'auto';
                  } else {
                    _computedStyle2.left = _computedStyle2.right = 'auto';
                  }

                  var oldX = 0;

                  if (l !== 'auto') {
                    oldX = l;
                  } else if (r !== 'auto') {
                    oldX = -r;
                  }

                  if (newX !== oldX) {
                    node.__offsetX(newX - oldX, false, o$1.REFLOW);
                  }
                }
            }); // 调整因reflow造成的原struct数据索引数量偏差，纯zIndex的已经在repaint里面重新生成过了
            // 这里因为和update保持一致的顺序，因此一定是先根顺序且互不包含

            var _diff = 0,
                lastIndex = 0,
                isFirst = true,
                structs = root.__structs;
            diffList.forEach(function (item) {
              var _item = _slicedToArray(item, 2),
                  ns = _item[0],
                  d = _item[1]; // 第一个有变化的，及后面无论有无变化都需更新
              // 第1个变化区域无需更改前面一段


              if (isFirst) {
                isFirst = false;
                lastIndex = ns.index + ns.total + 1;
                _diff += d;
              } // 第2+个变化区域看是否和前面一个相连，有不变的段则先偏移它，然后再偏移自己
              else {
                  var j = ns.index + ns.total + 1 + _diff;

                  for (var _i2 = lastIndex; _i2 < j; _i2++) {
                    structs[_i2].index += _diff;
                  }

                  lastIndex = j;
                  _diff += d;
                }
            });

            for (var _i3 = lastIndex, _len2 = structs.length; _i3 < _len2; _i3++) {
              structs[_i3].index += _diff;
            } // 清除id


            reflowList.forEach(function (item) {
              return delete item.node.__uniqueReflowId;
            });
          }
      } // 特殊覆盖方法，不需要super()计算自己，因为放在每次checkRoot()做过了

    }, {
      key: "__computeMeasure",
      value: function __computeMeasure(renderMode, ctx) {
        css.computeMeasure(this, true);
        this.children.forEach(function (item) {
          item.__computeMeasure(renderMode, ctx);
        });
      } // 每个root拥有一个刷新hook，多个root塞到frame的__hookTask里
      // frame在所有的帧刷新逻辑执行后检查hook列表，进行root刷新操作

    }, {
      key: "__frameHook",
      value: function __frameHook() {
        var _this7 = this;

        if (!this.__hookTask) {
          var r = this.__hookTask = function () {
            _this7.refresh();
          };

          frame.__hookTask.push(r);
        }
      }
    }, {
      key: "__clear",
      value: function __clear(ctx) {
        // 可能会调整宽高，所以每次清除用最大值
        this.__mw = Math.max(this.__mw, this.width);
        this.__mh = Math.max(this.__mh, this.height); // 清除前得恢复默认matrix，防止每次布局改变了属性

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, this.__mw, this.__mh);
      }
    }, {
      key: "dom",
      get: function get() {
        return this.__dom;
      }
    }, {
      key: "renderMode",
      get: function get() {
        return this.__renderMode;
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
      key: "task",
      get: function get() {
        return this.__task;
      }
    }, {
      key: "ref",
      get: function get() {
        return this.__ref;
      }
    }, {
      key: "animateController",
      get: function get() {
        return this.__animateController;
      }
    }]);

    return Root;
  }(Dom$1);

  var isNil$8 = util.isNil;

  function reBuild(target, origin, base, isMulti) {
    if (isMulti) {
      return target.map(function (item) {
        return origin + item * base;
      });
    } else {
      return origin + target * base;
    }
  }

  function reBuildC(target, originX, originY, width, height, isMulti) {
    if (isMulti) {
      if (target) {
        return target.map(function (item) {
          return reBuildC(item, originX, originY, width, height);
        });
      }
    } else {
      if (target && target.length >= 2) {
        return [originX + target[0] * width, originY + target[1] * height];
      }
    }

    return [];
  }

  function curveNum(controlA, controlB) {
    var num = 0;

    if (controlA.length >= 2) {
      num++;
    }

    if (controlB.length >= 2) {
      num += 2;
    }

    return num;
  }

  function limitStartEnd(v) {
    if (v < 0) {
      v = 0;
    } else if (v > 1) {
      v = 1;
    }

    return v;
  }

  function getNewPoint(x1, y1, x2, y2, controlA, controlB, num) {
    var start = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 0;
    var end = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : 1;

    if (start > 0 || end < 1) {
      if (num === 3) {
        var _geom$sliceBezier2Bot = geom.sliceBezier2Both([[x1, y1], controlA, controlB, [x2, y2]], start, end);

        var _geom$sliceBezier2Bot2 = _slicedToArray(_geom$sliceBezier2Bot, 4);

        var _geom$sliceBezier2Bot3 = _slicedToArray(_geom$sliceBezier2Bot2[0], 2);

        x1 = _geom$sliceBezier2Bot3[0];
        y1 = _geom$sliceBezier2Bot3[1];
        controlA = _geom$sliceBezier2Bot2[1];
        controlB = _geom$sliceBezier2Bot2[2];

        var _geom$sliceBezier2Bot4 = _slicedToArray(_geom$sliceBezier2Bot2[3], 2);

        x2 = _geom$sliceBezier2Bot4[0];
        y2 = _geom$sliceBezier2Bot4[1];
      } else if (num === 2) {
        var _geom$sliceBezier2Bot5 = geom.sliceBezier2Both([[x1, y1], controlB, [x2, y2]], start, end);

        var _geom$sliceBezier2Bot6 = _slicedToArray(_geom$sliceBezier2Bot5, 3);

        var _geom$sliceBezier2Bot7 = _slicedToArray(_geom$sliceBezier2Bot6[0], 2);

        x1 = _geom$sliceBezier2Bot7[0];
        y1 = _geom$sliceBezier2Bot7[1];
        controlB = _geom$sliceBezier2Bot6[1];

        var _geom$sliceBezier2Bot8 = _slicedToArray(_geom$sliceBezier2Bot6[2], 2);

        x2 = _geom$sliceBezier2Bot8[0];
        y2 = _geom$sliceBezier2Bot8[1];
      } else if (num === 1) {
        var _geom$sliceBezier2Bot9 = geom.sliceBezier2Both([[x1, y1], controlA, [x2, y2]], start, end);

        var _geom$sliceBezier2Bot10 = _slicedToArray(_geom$sliceBezier2Bot9, 3);

        var _geom$sliceBezier2Bot11 = _slicedToArray(_geom$sliceBezier2Bot10[0], 2);

        x1 = _geom$sliceBezier2Bot11[0];
        y1 = _geom$sliceBezier2Bot11[1];
        controlA = _geom$sliceBezier2Bot10[1];

        var _geom$sliceBezier2Bot12 = _slicedToArray(_geom$sliceBezier2Bot10[2], 2);

        x2 = _geom$sliceBezier2Bot12[0];
        y2 = _geom$sliceBezier2Bot12[1];
      } else {
        var a = Math.abs(x1 - x2);
        var b = Math.abs(y1 - y2);
        x1 += a * start;
        y1 += b * start;
        x2 -= a * (1 - end);
        y2 -= b * (1 - end);
      }
    }

    return [x1, y1, x2, y2, controlA, controlB];
  }

  var Line = /*#__PURE__*/function (_Geom) {
    _inherits(Line, _Geom);

    var _super = _createSuper(Line);

    function Line(tagName, props) {
      var _this;

      _classCallCheck(this, Line);

      _this = _super.call(this, tagName, props); // x1,y1和x2,y2表明线段的首尾坐标，control表明控制点坐标

      if (_this.isMulti) {
        _this.__x1 = [0];
        _this.__y1 = [0];
        _this.__x2 = [1];
        _this.__y2 = [1];
        _this.__controlA = [[]];
        _this.__controlB = [[]];
        _this.__start = [0];
        _this.__end = [1];

        if (Array.isArray(props.x1)) {
          _this.__x1 = props.x1.map(function (i) {
            return parseFloat(i) || 0;
          });
        } else if (!isNil$8(props.x1)) {
          _this.__x1 = [parseFloat(props.x1) || 0];
        }

        if (Array.isArray(props.y1)) {
          _this.__y1 = props.y1.map(function (i) {
            return parseFloat(i) || 0;
          });
        } else if (!isNil$8(props.y1)) {
          _this.__y1 = [parseFloat(props.y1) || 0];
        }

        if (Array.isArray(props.x2)) {
          _this.__x2 = props.x2.map(function (i) {
            return parseFloat(i) || 0;
          });
        } else if (!isNil$8(props.x2)) {
          _this.__x2 = [parseFloat(props.x2) || 0];
        }

        if (Array.isArray(props.y2)) {
          _this.__y2 = props.y2.map(function (i) {
            return parseFloat(i) || 0;
          });
        } else if (!isNil$8(props.y2)) {
          _this.__y2 = [parseFloat(props.y2) || 0];
        }

        if (Array.isArray(props.controlA)) {
          _this.__controlA = props.controlA.map(function (item) {
            if (Array.isArray(item)) {
              return item;
            }

            return [];
          });
        }

        if (Array.isArray(props.controlB)) {
          _this.__controlB = props.controlB.map(function (item) {
            if (Array.isArray(item)) {
              return item;
            }

            return [];
          });
        }

        if (Array.isArray(props.start)) {
          _this.__start = props.start.map(function (i) {
            return limitStartEnd(parseFloat(i) || 0);
          });

          for (var i = _this.__start.length; i < _this.__x1.length; i++) {
            _this.__start.push(0);
          }
        } else if (!isNil$8(props.start)) {
          var v = limitStartEnd(parseFloat(props.start) || 0);
          _this.__start = _this.__x1.map(function () {
            return v;
          });
        }

        if (Array.isArray(props.end)) {
          _this.__end = props.end.map(function (i) {
            var v = parseFloat(i);

            if (isNaN(v)) {
              v = 1;
            }

            return limitStartEnd(v);
          });

          for (var _i = _this.__end.length; _i < _this.__x1.length; _i++) {
            _this.__end.push(1);
          }
        } else if (!isNil$8(props.end)) {
          var _v = parseFloat(props.end);

          if (isNaN(_v)) {
            _v = 1;
          }

          _v = limitStartEnd(_v);
          _this.__end = _this.__x1.map(function () {
            return _v;
          });
        }
      } else {
        _this.__x1 = _this.__y1 = _this.__start = 0;
        _this.__x2 = _this.__y2 = _this.__end = 1;
        _this.__controlA = [];
        _this.__controlB = [];

        if (!isNil$8(props.x1)) {
          _this.__x1 = parseFloat(props.x1) || 0;
        }

        if (!isNil$8(props.y1)) {
          _this.__y1 = parseFloat(props.y1) || 0;
        }

        if (!isNil$8(props.x2)) {
          _this.__x2 = parseFloat(props.x2) || 0;
        }

        if (!isNil$8(props.y2)) {
          _this.__y2 = parseFloat(props.y2) || 0;
        }

        if (!isNil$8(props.start)) {
          _this.__start = limitStartEnd(parseFloat(props.start) || 0);
        }

        if (!isNil$8(props.end)) {
          var _v2 = parseFloat(props.end);

          if (isNaN(_v2)) {
            _v2 = 1;
          }

          _this.__end = limitStartEnd(_v2);
        }

        if (Array.isArray(props.controlA)) {
          _this.__controlA = props.controlA;
        }

        if (Array.isArray(props.controlB)) {
          _this.__controlB = props.controlB;
        }
      }

      return _this;
    }

    _createClass(Line, [{
      key: "buildCache",
      value: function buildCache(originX, originY) {
        var _this2 = this;

        var width = this.width,
            height = this.height,
            __cacheProps = this.__cacheProps,
            isMulti = this.isMulti;
        var rebuild;
        ['x1', 'x2'].forEach(function (k) {
          if (isNil$8(__cacheProps[k])) {
            rebuild = true;
            __cacheProps[k] = reBuild(_this2[k], originX, width, isMulti);
          }
        });
        ['y1', 'y2'].forEach(function (k) {
          if (isNil$8(__cacheProps[k])) {
            rebuild = true;
            __cacheProps[k] = reBuild(_this2[k], originY, height, isMulti);
          }
        });
        ['controlA', 'controlB'].forEach(function (k) {
          if (isNil$8(__cacheProps[k])) {
            rebuild = true;
            __cacheProps[k] = reBuildC(_this2[k], originX, originY, width, height, isMulti);
          }
        });
        ['start', 'end'].forEach(function (k) {
          if (isNil$8(__cacheProps[k])) {
            rebuild = true;
            __cacheProps[k] = _this2[k];
          }
        });
        return rebuild;
      }
    }, {
      key: "render",
      value: function render(renderMode, lv, ctx, defs) {
        var res = _get(_getPrototypeOf(Line.prototype), "render", this).call(this, renderMode, lv, ctx, defs);

        if (res["break"]) {
          return res;
        }

        var originX = res.originX,
            originY = res.originY,
            stroke = res.stroke,
            strokeWidth = res.strokeWidth,
            strokeDasharrayStr = res.strokeDasharrayStr,
            strokeLinecap = res.strokeLinecap,
            strokeLinejoin = res.strokeLinejoin,
            strokeMiterlimit = res.strokeMiterlimit,
            dx = res.dx,
            dy = res.dy;
        var __cacheProps = this.__cacheProps,
            isMulti = this.isMulti;
        var rebuild = this.buildCache(originX, originY);

        if (rebuild && renderMode === mode.SVG) {
          var d = '';

          if (isMulti) {
            __cacheProps.x1.forEach(function (xa, i) {
              var xb = __cacheProps.x2[i];
              var ya = __cacheProps.y1[i];
              var yb = __cacheProps.y2[i];
              var ca = __cacheProps.controlA[i];
              var cb = __cacheProps.controlB[i];
              var start = __cacheProps.start[i];
              var end = __cacheProps.end[i];
              var curve = curveNum(ca, cb);

              if (start !== 0 || end !== 1) {
                var _getNewPoint = getNewPoint(xa, ya, xb, ya, ca, cb, curve, start, end, __cacheProps.len);

                var _getNewPoint2 = _slicedToArray(_getNewPoint, 6);

                xa = _getNewPoint2[0];
                ya = _getNewPoint2[1];
                xb = _getNewPoint2[2];
                ya = _getNewPoint2[3];
                ca = _getNewPoint2[4];
                cb = _getNewPoint2[5];
              }

              d += painter.svgLine(xa, ya, xb, yb, ca, cb, curve);
            });
          } else {
            var curve = curveNum(__cacheProps.controlA, __cacheProps.controlB);
            var x1 = __cacheProps.x1,
                y1 = __cacheProps.y1,
                x2 = __cacheProps.x2,
                y2 = __cacheProps.y2,
                controlA = __cacheProps.controlA,
                controlB = __cacheProps.controlB,
                start = __cacheProps.start,
                end = __cacheProps.end;

            if (start !== 0 || end !== 1) {
              var _getNewPoint3 = getNewPoint(x1, y1, x2, y2, controlA, controlB, curve, start, end, __cacheProps.len);

              var _getNewPoint4 = _slicedToArray(_getNewPoint3, 6);

              x1 = _getNewPoint4[0];
              y1 = _getNewPoint4[1];
              x2 = _getNewPoint4[2];
              y2 = _getNewPoint4[3];
              controlA = _getNewPoint4[4];
              controlB = _getNewPoint4[5];
            }

            d = painter.svgLine(x1, y1, x2, y2, controlA, controlB, curve);
          }

          __cacheProps.d = d;
        }

        if (renderMode === mode.CANVAS) {
          if (strokeWidth > 0) {
            ctx.beginPath();

            if (isMulti) {
              __cacheProps.x1.forEach(function (xa, i) {
                var xb = __cacheProps.x2[i];
                var ya = __cacheProps.y1[i];
                var yb = __cacheProps.y2[i];
                var ca = __cacheProps.controlA[i];
                var cb = __cacheProps.controlB[i];
                var start = __cacheProps.start[i];
                var end = __cacheProps.end[i];
                var curve = curveNum(ca, cb);

                if (start !== 0 || end !== 1) {
                  var _getNewPoint5 = getNewPoint(xa, ya, xb, ya, ca, cb, curve, start, end, __cacheProps.len);

                  var _getNewPoint6 = _slicedToArray(_getNewPoint5, 6);

                  xa = _getNewPoint6[0];
                  ya = _getNewPoint6[1];
                  xb = _getNewPoint6[2];
                  ya = _getNewPoint6[3];
                  ca = _getNewPoint6[4];
                  cb = _getNewPoint6[5];
                }

                painter.canvasLine(ctx, xa, ya, xb, yb, ca, cb, curve, dx, dy);
              });
            } else {
              var _curve = curveNum(__cacheProps.controlA, __cacheProps.controlB);

              var _x = __cacheProps.x1,
                  _y = __cacheProps.y1,
                  _x2 = __cacheProps.x2,
                  _y2 = __cacheProps.y2,
                  _controlA = __cacheProps.controlA,
                  _controlB = __cacheProps.controlB,
                  _start = __cacheProps.start,
                  _end = __cacheProps.end;

              if (_start !== 0 || _end !== 1) {
                var _getNewPoint7 = getNewPoint(_x, _y, _x2, _y2, _controlA, _controlB, _curve, _start, _end, __cacheProps.len);

                var _getNewPoint8 = _slicedToArray(_getNewPoint7, 6);

                _x = _getNewPoint8[0];
                _y = _getNewPoint8[1];
                _x2 = _getNewPoint8[2];
                _y2 = _getNewPoint8[3];
                _controlA = _getNewPoint8[4];
                _controlB = _getNewPoint8[5];
              }

              painter.canvasLine(ctx, _x, _y, _x2, _y2, _controlA, _controlB, _curve, dx, dy);
            }

            ctx.stroke();
            ctx.closePath();
          }
        } else if (renderMode === mode.SVG) {
          var props = [['d', __cacheProps.d], ['fill', 'none'], ['stroke', stroke], ['stroke-width', strokeWidth]];

          this.__propsStrokeStyle(props, strokeDasharrayStr, strokeLinecap, strokeLinejoin, strokeMiterlimit);

          this.addGeom('path', props);
        }

        return res;
      }
    }, {
      key: "x1",
      get: function get() {
        return this.getProps('x1');
      }
    }, {
      key: "y1",
      get: function get() {
        return this.getProps('y1');
      }
    }, {
      key: "x2",
      get: function get() {
        return this.getProps('x2');
      }
    }, {
      key: "y2",
      get: function get() {
        return this.getProps('y2');
      }
    }, {
      key: "controlA",
      get: function get() {
        return this.getProps('controlA');
      }
    }, {
      key: "controlB",
      get: function get() {
        return this.getProps('controlB');
      }
    }, {
      key: "start",
      get: function get() {
        return this.getProps('start');
      }
    }, {
      key: "end",
      get: function get() {
        return this.getProps('end');
      }
    }, {
      key: "bbox",
      get: function get() {
        var sx = this.sx,
            sy = this.sy,
            _this$currentStyle = this.currentStyle,
            boxShadow = _this$currentStyle.boxShadow,
            filter = _this$currentStyle.filter,
            _this$computedStyle = this.computedStyle,
            borderTopWidth = _this$computedStyle.borderTopWidth,
            borderLeftWidth = _this$computedStyle.borderLeftWidth,
            marginTop = _this$computedStyle.marginTop,
            marginLeft = _this$computedStyle.marginLeft,
            paddingTop = _this$computedStyle.paddingTop,
            paddingLeft = _this$computedStyle.paddingLeft,
            strokeWidth = _this$computedStyle.strokeWidth,
            isMulti = this.isMulti,
            __cacheProps = this.__cacheProps;
        var originX = sx + borderLeftWidth + marginLeft + paddingLeft;
        var originY = sy + borderTopWidth + marginTop + paddingTop;
        this.buildCache(originX, originY);
        var x1 = __cacheProps.x1,
            y1 = __cacheProps.y1,
            x2 = __cacheProps.x2,
            y2 = __cacheProps.y2,
            controlA = __cacheProps.controlA,
            controlB = __cacheProps.controlB;

        var bbox = _get(_getPrototypeOf(Line.prototype), "bbox", this);

        var half = strokeWidth * 0.5;

        var _this$__spreadByBoxSh = this.__spreadByBoxShadowAndFilter(boxShadow, filter),
            _this$__spreadByBoxSh2 = _slicedToArray(_this$__spreadByBoxSh, 2),
            ox = _this$__spreadByBoxSh2[0],
            oy = _this$__spreadByBoxSh2[1];

        ox += half;
        oy += half;

        if (!isMulti) {
          x1 = [x1];
          x2 = [x2];
          y1 = [y1];
          y2 = [y2];
          controlA = [controlA];
          controlB = [controlB];
        }

        x1.forEach(function (xa, i) {
          var ya = y1[i];
          var xb = x2[i];
          var yb = y2[i];
          var ca = controlA[i];
          var cb = controlB[i];

          if ((isNil$8(ca) || ca.length < 2) && (isNil$8(cb) || cb.length < 2)) {
            bbox[0] = Math.min(bbox[0], xa - ox);
            bbox[0] = Math.min(bbox[0], xb - ox);
            bbox[1] = Math.min(bbox[1], ya - oy);
            bbox[1] = Math.min(bbox[1], yb - oy);
            bbox[2] = Math.max(bbox[2], xa + ox);
            bbox[2] = Math.max(bbox[2], xb + ox);
            bbox[3] = Math.max(bbox[3], ya + oy);
            bbox[3] = Math.max(bbox[3], yb + oy);
          } else if (isNil$8(ca) || ca.length < 2) {
            var bezierBox = geom.bboxBezier(xa, ya, cb[0], cb[1], xb, yb);
            bbox[0] = Math.min(bbox[0], bezierBox[0] - ox);
            bbox[0] = Math.min(bbox[0], bezierBox[2] - ox);
            bbox[1] = Math.min(bbox[1], bezierBox[1] - oy);
            bbox[1] = Math.min(bbox[1], bezierBox[3] - oy);
            bbox[2] = Math.max(bbox[2], bezierBox[0] + ox);
            bbox[2] = Math.max(bbox[2], bezierBox[2] + ox);
            bbox[3] = Math.max(bbox[3], bezierBox[1] + oy);
            bbox[3] = Math.max(bbox[3], bezierBox[3] + oy);
          } else if (isNil$8(cb) || cb.length < 2) {
            var _bezierBox = geom.bboxBezier(xa, ya, ca[0], ca[1], xb, yb);

            bbox[0] = Math.min(bbox[0], _bezierBox[0] - ox);
            bbox[0] = Math.min(bbox[0], _bezierBox[2] - ox);
            bbox[1] = Math.min(bbox[1], _bezierBox[1] - oy);
            bbox[1] = Math.min(bbox[1], _bezierBox[3] - oy);
            bbox[2] = Math.max(bbox[2], _bezierBox[0] + ox);
            bbox[2] = Math.max(bbox[2], _bezierBox[2] + ox);
            bbox[3] = Math.max(bbox[3], _bezierBox[1] + oy);
            bbox[3] = Math.max(bbox[3], _bezierBox[3] + oy);
          } else {
            var _bezierBox2 = geom.bboxBezier(xa, ya, ca[0], ca[1], cb[0], cb[1], xb, yb);

            bbox[0] = Math.min(bbox[0], _bezierBox2[0] - ox);
            bbox[0] = Math.min(bbox[0], _bezierBox2[2] - ox);
            bbox[1] = Math.min(bbox[1], _bezierBox2[1] - oy);
            bbox[1] = Math.min(bbox[1], _bezierBox2[3] - oy);
            bbox[2] = Math.max(bbox[2], _bezierBox2[0] + ox);
            bbox[2] = Math.max(bbox[2], _bezierBox2[2] + ox);
            bbox[3] = Math.max(bbox[3], _bezierBox2[1] + oy);
            bbox[3] = Math.max(bbox[3], _bezierBox2[3] + oy);
          }
        });
        return bbox;
      }
    }]);

    return Line;
  }(Geom$1);

  var isNil$9 = util.isNil;

  function concatPointAndControl(point, control) {
    if (Array.isArray(control) && (control.length === 2 || control.length === 4) && Array.isArray(point) && point.length === 2) {
      return control.concat(point);
    }

    return point;
  }

  function limitStartEnd$1(v) {
    if (v < 0) {
      v = 0;
    } else if (v > 1) {
      v = 1;
    }

    return v;
  }

  function getLength(list, isMulti) {
    var res = [];
    var total = 0;
    var increase = [];

    if (isMulti) {
      total = [];
      list.forEach(function (list) {
        var temp = getLength(list);
        res.push(temp.list);
        total.push(temp.total);
        increase.push([0].concat(temp.increase));
      });
    } else if (Array.isArray(list)) {
      total = 0;
      increase.push(0);
      var start = 0;

      for (var i = 0, len = list.length; i < len; i++) {
        var item = list[i];

        if (Array.isArray(item)) {
          start = i;
          break;
        }
      }

      var prev = list[start];

      for (var _i = start + 1, _len = list.length; _i < _len; _i++) {
        var _item = list[_i];

        if (!Array.isArray(_item)) {
          continue;
        }

        if (_item.length === 2) {
          var a = Math.abs(_item[0] - prev[0]);
          var b = Math.abs(_item[1] - prev[1]);
          var c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
          res.push(c);
          total += c;
          increase.push(total);
          prev = _item;
        } else if (_item.length === 4) {
          var _c = geom.bezierLength([prev, [_item[0], _item[1]], [_item[2], _item[3]]], 2);

          res.push(_c);
          total += _c;
          increase.push(total);
          prev = [_item[2], _item[3]];
        } else if (_item.length === 6) {
          var _c2 = geom.bezierLength([prev, [_item[0], _item[1]], [_item[2], _item[3]], [_item[4], _item[5]]], 3);

          res.push(_c2);
          total += _c2;
          increase.push(total);
          prev = [_item[4], _item[5]];
        }
      }
    }

    return {
      list: res,
      total: total,
      increase: increase
    };
  }

  function getIndex(list, t, i, j) {
    if (i === j) {
      if (list[i] > t) {
        return i - 1;
      }

      return i;
    }

    var middle = i + (j - i >> 1);

    if (list[middle] === t) {
      return middle;
    } else if (list[middle] > t) {
      return getIndex(list, t, i, Math.max(middle - 1, i));
    } else {
      return getIndex(list, t, Math.min(middle + 1, j), j);
    }
  }

  function getNewList(list, len) {
    var start = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var end = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;

    if (start === 0 && end === 1) {
      return list;
    }

    if (start >= end) {
      return [];
    }

    var i = 0,
        j = list.length - 2;

    if (start > 0) {
      i = getIndex(len.increase, start * len.total, i, j);
    }

    if (end < 1) {
      j = getIndex(len.increase, end * len.total, i, j);
    }

    list = util.clone(list);
    end *= len.total;
    var prePercent = 1;

    if (end > len.increase[j]) {
      var prev = list[j].slice(list[j].length - 2); // 最后2个点是x,y，前面是control

      var current = list[j + 1];
      var l = len.list[j];
      var diff = end - len.increase[j];
      var t = diff / l;
      prePercent = t;

      if (current.length === 2) {
        var a = Math.abs(current[0] - prev[0]);
        var b = Math.abs(current[1] - prev[1]);
        list[j + 1] = [current[1] - (1 - t) * a, current[1] - (1 - t) * b];
      } else if (current.length === 4) {
        var res = geom.sliceBezier([prev, [current[0], current[1]], [current[2], current[3]]], t);
        list[j + 1] = [res[1][0], res[1][1], res[2][0], res[2][1]];
      } else if (current.length === 6) {
        var _res = geom.sliceBezier([prev, [current[0], current[1]], [current[2], current[3]], [current[4], current[5]]], t);

        list[j + 1] = [_res[1][0], _res[1][1], _res[2][0], _res[2][1], _res[3][0], _res[3][1]];
      }
    }

    start *= len.total;

    if (start > len.increase[i]) {
      var _prev = list[i].slice(list[i].length - 2);

      var _current = list[i + 1];
      var _l = len.list[i]; // 同一条线段时如果有end裁剪，会影响start长度

      if (i === j && prePercent !== 1) {
        _l *= prePercent;
      }

      var _diff = start - len.increase[i];

      var _t = _diff / _l;

      if (_current.length === 2) {
        var _a = Math.abs(_current[0] - _prev[0]);

        var _b = Math.abs(_current[1] - _prev[1]);

        list[i] = [_prev[0] + _t * _a, _prev[1] + _t * _b];
      } else if (_current.length === 4) {
        var _res2 = geom.sliceBezier([[_current[2], _current[3]], [_current[0], _current[1]], _prev], 1 - _t).reverse();

        list[i] = _res2[0];
        list[i + 1] = [_res2[1][0], _res2[1][1], _res2[2][0], _res2[2][1]];
      } else if (_current.length === 6) {
        var _res3 = geom.sliceBezier([[_current[4], _current[5]], [_current[2], _current[3]], [_current[0], _current[1]], _prev], 1 - _t).reverse();

        list[i] = _res3[0];
        list[i + 1] = [_res3[1][0], _res3[1][1], _res3[2][0], _res3[2][1], _current[4], _current[5]];
      }
    }

    if (j < list.length - 2) {
      list = list.slice(0, j + 2);
    }

    if (i > 0) {
      list = list.slice(i);
    }

    return list;
  }

  var Polyline = /*#__PURE__*/function (_Geom) {
    _inherits(Polyline, _Geom);

    var _super = _createSuper(Polyline);

    function Polyline(tagName, props) {
      var _this;

      _classCallCheck(this, Polyline);

      _this = _super.call(this, tagName, props); // 所有点的列表

      if (_this.isMulti) {
        _this.__points = [[]];
        _this.__controls = [[]];
        _this.__start = [0];
        _this.__end = [1];

        if (Array.isArray(props.start)) {
          _this.__start = props.start.map(function (i) {
            return limitStartEnd$1(parseFloat(i) || 0);
          });

          for (var i = _this.__start.length; i < _this.__points.length; i++) {
            _this.__start.push(0);
          }
        } else if (!isNil$9(props.start)) {
          var v = limitStartEnd$1(parseFloat(props.start) || 0);
          _this.__start = _this.__points.map(function () {
            return v;
          });
        }

        if (Array.isArray(props.end)) {
          _this.__end = props.end.map(function (i) {
            var v = parseFloat(i);

            if (isNaN(v)) {
              v = 1;
            }

            return limitStartEnd$1(v);
          });

          for (var _i2 = _this.__end.length; _i2 < _this.__points.length; _i2++) {
            _this.__end.push(1);
          }
        } else if (!isNil$9(props.end)) {
          var _v = parseFloat(props.end);

          if (isNaN(_v)) {
            _v = 1;
          }

          _v = limitStartEnd$1(_v);
          _this.__end = _this.__points.map(function () {
            return _v;
          });
        }
      } else {
        _this.__points = []; // 控制点

        _this.__controls = [];
        _this.__start = 0;
        _this.__end = 1;

        if (!isNil$9(props.start)) {
          _this.__start = limitStartEnd$1(parseFloat(props.start) || 0);
        }

        if (!isNil$9(props.end)) {
          var _v2 = parseFloat(props.end);

          if (isNaN(_v2)) {
            _v2 = 1;
          }

          _this.__end = limitStartEnd$1(_v2);
        }
      }

      if (Array.isArray(props.controls)) {
        _this.__controls = props.controls;
      }

      if (Array.isArray(props.points)) {
        _this.__points = props.points;
      }

      return _this;
    }

    _createClass(Polyline, [{
      key: "__getPoints",
      value: function __getPoints(originX, originY, width, height, points, isControl) {
        return points.map(function (item, i) {
          if (!Array.isArray(item)) {
            return;
          }

          var len = item.length;

          if (isControl) {
            if (len !== 0 && len !== 2 && len !== 4) {
              return;
            }
          } else {
            if (len !== 0 && len !== 2) {
              return;
            }
          }

          var res = [];

          for (var _i3 = 0; _i3 < len; _i3++) {
            if (_i3 % 2 === 0) {
              res.push(originX + item[_i3] * width);
            } else {
              res.push(originY + item[_i3] * height);
            }
          }

          return res;
        });
      }
    }, {
      key: "buildCache",
      value: function buildCache(originX, originY) {
        var _this2 = this;

        var width = this.width,
            height = this.height,
            points = this.points,
            controls = this.controls,
            start = this.start,
            end = this.end,
            __cacheProps = this.__cacheProps,
            isMulti = this.isMulti;
        var rebuild;

        if (isNil$9(__cacheProps.points)) {
          rebuild = true;

          if (isMulti) {
            __cacheProps.points = points.map(function (item) {
              if (Array.isArray(item)) {
                return _this2.__getPoints(originX, originY, width, height, item);
              }
            });
          } else {
            __cacheProps.points = this.__getPoints(originX, originY, width, height, points);
          }
        }

        if (isNil$9(__cacheProps.controls)) {
          rebuild = true;

          if (isMulti) {
            __cacheProps.controls = controls.map(function (item) {
              if (Array.isArray(item)) {
                return _this2.__getPoints(originX, originY, width, height, item, true);
              }

              return item;
            });
          } else {
            __cacheProps.controls = this.__getPoints(originX, originY, width, height, controls, true);
          }
        }

        if (isNil$9(__cacheProps.start)) {
          rebuild = true;
          __cacheProps.start = start;
        }

        if (isNil$9(__cacheProps.end)) {
          rebuild = true;
          __cacheProps.end = end;
        } // points/controls有变化就需要重建顶点


        if (rebuild) {
          var _points = __cacheProps.points,
              _controls = __cacheProps.controls;

          if (isMulti) {
            __cacheProps.list = _points.filter(function (item) {
              return Array.isArray(item);
            }).map(function (item, i) {
              var cl = _controls[i];

              if (Array.isArray(item)) {
                return item.map(function (point, j) {
                  if (j) {
                    return concatPointAndControl(point, cl && cl[j - 1]);
                  }

                  return point;
                });
              }
            });
            __cacheProps.len = getLength(__cacheProps.list, isMulti);
          } else {
            __cacheProps.list = _points.filter(function (item) {
              return Array.isArray(item);
            }).map(function (point, i) {
              if (i) {
                return concatPointAndControl(point, _controls[i - 1]);
              }

              return point;
            });
            __cacheProps.len = getLength(__cacheProps.list, isMulti);
          }
        }

        return rebuild;
      }
    }, {
      key: "render",
      value: function render(renderMode, lv, ctx, defs) {
        var res = _get(_getPrototypeOf(Polyline.prototype), "render", this).call(this, renderMode, lv, ctx, defs);

        if (res["break"]) {
          return res;
        }

        var originX = res.originX,
            originY = res.originY,
            fill = res.fill,
            stroke = res.stroke,
            strokeWidth = res.strokeWidth,
            strokeDasharrayStr = res.strokeDasharrayStr,
            strokeLinecap = res.strokeLinecap,
            strokeLinejoin = res.strokeLinejoin,
            strokeMiterlimit = res.strokeMiterlimit,
            fillRule = res.fillRule,
            dx = res.dx,
            dy = res.dy;
        var __cacheProps = this.__cacheProps,
            isMulti = this.isMulti;
        this.buildCache(originX, originY);
        var list = __cacheProps.list;

        if (isMulti) {
          __cacheProps.list2 = list.map(function (item, i) {
            if (Array.isArray(item)) {
              var len = __cacheProps.len;
              return getNewList(item, {
                list: len.list[i],
                total: len.total[i],
                increase: len.increase[i]
              }, __cacheProps.start[i], __cacheProps.end[i]);
            }
          });
        } else {
          __cacheProps.list2 = getNewList(list, __cacheProps.len, __cacheProps.start, __cacheProps.end);
        }

        if (renderMode === mode.SVG) {
          if (isMulti) {
            var d = '';

            __cacheProps.list2.forEach(function (item) {
              return d += painter.svgPolygon(item);
            });

            __cacheProps.d = d;
          } else {
            __cacheProps.d = painter.svgPolygon(__cacheProps.list2);
          }
        }

        if (renderMode === mode.CANVAS) {
          ctx.beginPath();

          if (isMulti) {
            __cacheProps.list2.forEach(function (item) {
              return painter.canvasPolygon(ctx, item, dx, dy);
            });
          } else {
            painter.canvasPolygon(ctx, __cacheProps.list2, dx, dy);
          }

          ctx.fill(fillRule === 'evenodd' ? fillRule : 'nonzero');

          if (strokeWidth > 0) {
            ctx.stroke();
          }

          ctx.closePath();
        } else if (renderMode === mode.SVG) {
          var props = [['d', __cacheProps.d], ['fill', fill], ['stroke', stroke], ['stroke-width', strokeWidth]];

          if (fillRule === 'evenodd') {
            props.push(['fill-rule', 'evenodd']);
          }

          this.__propsStrokeStyle(props, strokeDasharrayStr, strokeLinecap, strokeLinejoin, strokeMiterlimit);

          this.addGeom('path', props);
        }

        return res;
      }
    }, {
      key: "points",
      get: function get() {
        return this.getProps('points');
      }
    }, {
      key: "controls",
      get: function get() {
        return this.getProps('controls');
      }
    }, {
      key: "start",
      get: function get() {
        return this.getProps('start');
      }
    }, {
      key: "end",
      get: function get() {
        return this.getProps('end');
      }
    }, {
      key: "bbox",
      get: function get() {
        var isMulti = this.isMulti,
            __cacheProps = this.__cacheProps,
            sx = this.sx,
            sy = this.sy,
            _this$currentStyle = this.currentStyle,
            boxShadow = _this$currentStyle.boxShadow,
            filter = _this$currentStyle.filter,
            _this$computedStyle = this.computedStyle,
            borderTopWidth = _this$computedStyle.borderTopWidth,
            borderLeftWidth = _this$computedStyle.borderLeftWidth,
            marginTop = _this$computedStyle.marginTop,
            marginLeft = _this$computedStyle.marginLeft,
            paddingTop = _this$computedStyle.paddingTop,
            paddingLeft = _this$computedStyle.paddingLeft,
            strokeWidth = _this$computedStyle.strokeWidth;
        var originX = sx + borderLeftWidth + marginLeft + paddingLeft;
        var originY = sy + borderTopWidth + marginTop + paddingTop;
        this.buildCache(originX, originY);

        var bbox = _get(_getPrototypeOf(Polyline.prototype), "bbox", this);

        var half = strokeWidth * 0.5;

        var _this$__spreadByBoxSh = this.__spreadByBoxShadowAndFilter(boxShadow, filter),
            _this$__spreadByBoxSh2 = _slicedToArray(_this$__spreadByBoxSh, 2),
            ox = _this$__spreadByBoxSh2[0],
            oy = _this$__spreadByBoxSh2[1];

        ox += half;
        oy += half;
        var points = __cacheProps.points,
            controls = __cacheProps.controls;

        if (!isMulti) {
          points = [points];
          controls = [controls];
        }

        points.forEach(function (pointList, i) {
          if (!pointList || pointList.length < 2 || pointList[0].length < 2 || pointList[1].length < 2) {
            return;
          }

          var controlList = controls[i];

          var _pointList$ = _slicedToArray(pointList[0], 2),
              xa = _pointList$[0],
              ya = _pointList$[1];

          for (var _i4 = 1, len = pointList.length; _i4 < len; _i4++) {
            var _pointList$_i = _slicedToArray(pointList[_i4], 2),
                xb = _pointList$_i[0],
                yb = _pointList$_i[1];

            var c = controlList[_i4 - 1];

            if (c && c.length === 4) {
              var bezierBox = geom.bboxBezier(xa, ya, c[0], c[1], c[2], c[3], xb, yb);
              bbox[0] = Math.min(bbox[0], bezierBox[0] - ox);
              bbox[1] = Math.min(bbox[1], bezierBox[1] - oy);
              bbox[2] = Math.max(bbox[2], bezierBox[2] + ox);
              bbox[3] = Math.max(bbox[3], bezierBox[3] + oy);
            } else if (c && c.length === 2) {
              var _bezierBox = geom.bboxBezier(xa, ya, c[0], c[1], xb, yb);

              bbox[0] = Math.min(bbox[0], _bezierBox[0] - ox);
              bbox[1] = Math.min(bbox[1], _bezierBox[1] - oy);
              bbox[2] = Math.max(bbox[2], _bezierBox[2] + ox);
              bbox[3] = Math.max(bbox[3], _bezierBox[3] + oy);
            } else {
              bbox[0] = Math.min(bbox[0], xa - ox);
              bbox[1] = Math.min(bbox[1], xb - oy);
              bbox[2] = Math.max(bbox[2], xa + ox);
              bbox[3] = Math.max(bbox[3], xb + oy);
            }

            xa = xb;
            ya = yb;
          }
        });
        return bbox;
      }
    }]);

    return Polyline;
  }(Geom$1);

  var Polygon = /*#__PURE__*/function (_Polyline) {
    _inherits(Polygon, _Polyline);

    var _super = _createSuper(Polygon);

    function Polygon(tagName, props) {
      _classCallCheck(this, Polygon);

      return _super.call(this, tagName, props);
    }

    _createClass(Polygon, [{
      key: "__getPoints",
      value: function __getPoints(originX, originY, width, height, points, isControl) {
        var res = _get(_getPrototypeOf(Polygon.prototype), "__getPoints", this).call(this, originX, originY, width, height, points, isControl);

        if (!isControl) {
          res.push(res[0]);
        }

        return res;
      }
    }]);

    return Polygon;
  }(Polyline);

  var isNil$a = util.isNil;

  function getCoordsByDegree(x, y, r, d) {
    r = Math.max(r, 0);
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

  function getR(v, dft) {
    v = parseFloat(v);

    if (isNaN(v)) {
      v = dft;
    }

    return v;
  }

  var Sector = /*#__PURE__*/function (_Geom) {
    _inherits(Sector, _Geom);

    var _super = _createSuper(Sector);

    function Sector(tagName, props) {
      var _this;

      _classCallCheck(this, Sector);

      _this = _super.call(this, tagName, props); // 角度

      if (_this.isMulti) {
        _this.__begin = [0];
        _this.__end = [0];
        _this.__r = [1];

        if (Array.isArray(props.begin)) {
          _this.__begin = props.begin.map(function (i) {
            return getR(i, 0);
          });
        }

        if (Array.isArray(props.end)) {
          _this.__end = props.end.map(function (i) {
            return getR(i, 0);
          });
        }

        if (Array.isArray(props.r)) {
          _this.__r = props.r.map(function (i) {
            return getR(i, 1);
          });
        }

        if (Array.isArray(props.edge)) {
          _this.__edge = props.edge.map(function (i) {
            return !!i;
          });
        }

        if (Array.isArray(props.closure)) {
          _this.__closure = props.closure.map(function (i) {
            return !!i;
          });
        }
      } else {
        _this.__begin = _this.__end = 0; // 半径[0, ∞)，默认1

        _this.__r = 1; // 扇形两侧是否有边

        _this.__edge = false; // 扇形大于180°时，是否闭合两端

        _this.__closure = false;

        if (!isNil$a(props.begin)) {
          _this.__begin = getR(props.begin, 0);
        }

        if (!isNil$a(props.end)) {
          _this.__end = getR(props.end, 0);
        }

        if (!isNil$a(props.r)) {
          _this.__r = getR(props.r, 1);
        }

        if (!isNil$a(props.edge)) {
          _this.__edge = !!props.edge;
        }

        if (!isNil$a(props.closure)) {
          _this.__closure = !!props.closure;
        }
      }

      return _this;
    }

    _createClass(Sector, [{
      key: "buildCache",
      value: function buildCache(cx, cy) {
        var width = this.width,
            begin = this.begin,
            end = this.end,
            r = this.r,
            edge = this.edge,
            closure = this.closure,
            __cacheProps = this.__cacheProps,
            isMulti = this.isMulti;
        var rebuild;

        if (isNil$a(__cacheProps.begin)) {
          rebuild = true;
          __cacheProps.begin = begin;
        }

        if (isNil$a(__cacheProps.end)) {
          rebuild = true;
          __cacheProps.end = end;
        }

        if (isNil$a(__cacheProps.r)) {
          rebuild = true;

          if (isMulti) {
            __cacheProps.r = r.map(function (r) {
              return r * width * 0.5;
            });
          } else {
            __cacheProps.r = r * width * 0.5;
          }
        }

        r = __cacheProps.r;

        if (isNil$a(__cacheProps.edge)) {
          rebuild = true;
          __cacheProps.edge = edge;
        }

        if (isNil$a(__cacheProps.closure)) {
          rebuild = true;
          __cacheProps.closure = closure;
        }

        if (rebuild) {
          if (isMulti) {
            __cacheProps.x1 = [];
            __cacheProps.x2 = [];
            __cacheProps.y1 = [];
            __cacheProps.y2 = [];
            __cacheProps.large = [];
            __cacheProps.d = [];
            begin.forEach(function (begin, i) {
              var r2 = isNil$a(r[i]) ? width * 0.5 : r[i];

              var _getCoordsByDegree = getCoordsByDegree(cx, cy, r2, begin),
                  _getCoordsByDegree2 = _slicedToArray(_getCoordsByDegree, 2),
                  x1 = _getCoordsByDegree2[0],
                  y1 = _getCoordsByDegree2[1];

              var _getCoordsByDegree3 = getCoordsByDegree(cx, cy, r2, end[i] || 0),
                  _getCoordsByDegree4 = _slicedToArray(_getCoordsByDegree3, 2),
                  x2 = _getCoordsByDegree4[0],
                  y2 = _getCoordsByDegree4[1];

              var large = (end[i] || 0) - begin > 180 ? 1 : 0;

              __cacheProps.x1.push(x1);

              __cacheProps.x2.push(x2);

              __cacheProps.y1.push(y1);

              __cacheProps.y2.push(y2);

              __cacheProps.large.push(large);
            });
          } else {
            var _getCoordsByDegree5 = getCoordsByDegree(cx, cy, r, begin),
                _getCoordsByDegree6 = _slicedToArray(_getCoordsByDegree5, 2),
                x1 = _getCoordsByDegree6[0],
                y1 = _getCoordsByDegree6[1];

            var _getCoordsByDegree7 = getCoordsByDegree(cx, cy, r, end),
                _getCoordsByDegree8 = _slicedToArray(_getCoordsByDegree7, 2),
                x2 = _getCoordsByDegree8[0],
                y2 = _getCoordsByDegree8[1];

            var large = end - begin > 180 ? 1 : 0;
            __cacheProps.x1 = x1;
            __cacheProps.x2 = x2;
            __cacheProps.y1 = y1;
            __cacheProps.y2 = y2;
            __cacheProps.large = large;
          }
        }

        return rebuild;
      }
    }, {
      key: "render",
      value: function render(renderMode, lv, ctx, defs) {
        var _this2 = this;

        var res = _get(_getPrototypeOf(Sector.prototype), "render", this).call(this, renderMode, lv, ctx, defs);

        if (res["break"]) {
          return res;
        }

        var cx = res.cx,
            cy = res.cy,
            fill = res.fill,
            stroke = res.stroke,
            strokeWidth = res.strokeWidth,
            strokeDasharrayStr = res.strokeDasharrayStr,
            strokeLinecap = res.strokeLinecap,
            strokeLinejoin = res.strokeLinejoin,
            strokeMiterlimit = res.strokeMiterlimit,
            dx = res.dx,
            dy = res.dy;
        var width = this.width,
            __cacheProps = this.__cacheProps,
            isMulti = this.isMulti;
        this.buildCache(cx, cy);
        var begin = __cacheProps.begin,
            end = __cacheProps.end,
            r = __cacheProps.r,
            x1 = __cacheProps.x1,
            y1 = __cacheProps.y1,
            x2 = __cacheProps.x2,
            y2 = __cacheProps.y2,
            edge = __cacheProps.edge,
            large = __cacheProps.large,
            closure = __cacheProps.closure;

        if (renderMode === mode.CANVAS) {
          ctx.beginPath();

          if (isMulti) {
            begin.forEach(function (begin, i) {
              return painter.canvasSector(ctx, cx, cy, r[i], x1[i], y1[i], x2[i], y2[i], strokeWidth, begin[i], end[i], large[i], edge[i], closure[i], dx, dy);
            });
          } else {
            painter.canvasSector(ctx, cx, cy, r, x1, y1, x2, y2, strokeWidth, begin, end, large, edge, closure, dx, dy);
          }

          ctx.fill();
          ctx.closePath();
        } else if (renderMode === mode.SVG) {
          if (isMulti) {
            begin.forEach(function (begin, i) {
              var r2 = isNil$a(r[i]) ? width * 0.5 : r[i];

              _this2.__genSector(edge[i], painter.svgSector(cx, cy, r2, x1[i], y1[i], x2[i], y2[i], strokeWidth, large[i], edge[i], closure[i]), fill, stroke, strokeWidth, strokeDasharrayStr, strokeLinecap, strokeLinejoin, strokeMiterlimit);
            });
          } else {
            this.__genSector(edge, painter.svgSector(cx, cy, r, x1, y1, x2, y2, strokeWidth, large, edge, closure), fill, stroke, strokeWidth, strokeDasharrayStr, strokeLinecap, strokeLinejoin, strokeMiterlimit);
          }
        }

        return res;
      }
    }, {
      key: "__genSector",
      value: function __genSector(edge, d, fill, stroke, strokeWidth, strokeDasharrayStr, strokeLinecap, strokeLinejoin, strokeMiterlimit) {
        if (edge) {
          var props = [['d', d[0]], ['fill', fill], ['stroke', stroke], ['stroke-width', strokeWidth]];

          this.__propsStrokeStyle(props, strokeDasharrayStr, strokeLinecap, strokeLinejoin, strokeMiterlimit);

          this.addGeom('path', props);
        } else {
          this.addGeom('path', [['d', d[0]], ['fill', fill]]);

          if (strokeWidth > 0) {
            var _props = [['d', d[1]], ['fill', 'none'], ['stroke', stroke], ['stroke-width', strokeWidth]];

            this.__propsStrokeStyle(_props, strokeDasharrayStr, strokeLinecap, strokeLinejoin, strokeMiterlimit);

            this.addGeom('path', _props);
          }
        }
      }
    }, {
      key: "begin",
      get: function get() {
        return this.getProps('begin');
      }
    }, {
      key: "end",
      get: function get() {
        return this.getProps('end');
      }
    }, {
      key: "r",
      get: function get() {
        return this.getProps('r');
      }
    }, {
      key: "edge",
      get: function get() {
        return this.getProps('edge');
      } // >180°时是否链接端点

    }, {
      key: "closure",
      get: function get() {
        return this.getProps('closure');
      }
    }, {
      key: "bbox",
      get: function get() {
        var isMulti = this.isMulti,
            __cacheProps = this.__cacheProps,
            sx = this.sx,
            sy = this.sy,
            width = this.width,
            height = this.height,
            _this$currentStyle = this.currentStyle,
            boxShadow = _this$currentStyle.boxShadow,
            filter = _this$currentStyle.filter,
            _this$computedStyle = this.computedStyle,
            borderTopWidth = _this$computedStyle.borderTopWidth,
            borderLeftWidth = _this$computedStyle.borderLeftWidth,
            marginTop = _this$computedStyle.marginTop,
            marginLeft = _this$computedStyle.marginLeft,
            paddingTop = _this$computedStyle.paddingTop,
            paddingLeft = _this$computedStyle.paddingLeft,
            strokeWidth = _this$computedStyle.strokeWidth;
        var originX = sx + borderLeftWidth + marginLeft + paddingLeft;
        var originY = sy + borderTopWidth + marginTop + paddingTop;
        var cx = originX + width * 0.5;
        var cy = originY + height * 0.5;
        this.buildCache(cx, cy);
        var r = 0;

        if (isMulti) {
          var max = 0;

          __cacheProps.r.forEach(function (r) {
            max = Math.max(r, max);
          });

          r = max;
        } else {
          r = __cacheProps.r;
        }

        var bbox = _get(_getPrototypeOf(Sector.prototype), "bbox", this);

        var half = strokeWidth * 0.5;

        var _this$__spreadByBoxSh = this.__spreadByBoxShadowAndFilter(boxShadow, filter),
            _this$__spreadByBoxSh2 = _slicedToArray(_this$__spreadByBoxSh, 2),
            ox = _this$__spreadByBoxSh2[0],
            oy = _this$__spreadByBoxSh2[1];

        ox += half;
        oy += half;
        var xa = cx - r - ox;
        var xb = cx + r + ox;
        var ya = cy - r - oy;
        var yb = cy + r + oy;
        bbox[0] = Math.min(bbox[0], xa);
        bbox[1] = Math.min(bbox[1], ya);
        bbox[2] = Math.max(bbox[2], xb);
        bbox[3] = Math.max(bbox[3], yb);
        return bbox;
      }
    }]);

    return Sector;
  }(Geom$1);

  var isNil$b = util.isNil;

  function genVertex(x, y, width, height) {
    var rx = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
    var ry = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;

    if (rx === 0 || ry === 0) {
      return [[x, y], [x + width, y], [x + width, y + height], [x, y + height], [x, y]];
    }

    var ox = rx * geom.H;
    var oy = ry * geom.H;
    return [[x + rx, y], [x + width - rx, y], [x + width + ox - rx, y, x + width, y + ry - oy, x + width, y + ry], [x + width, y + height - ry], [x + width, y + height + oy - ry, x + width + ox - rx, y + height, x + width - rx, y + height], [x + rx, y + height], [x + rx - ox, y + height, x, y + height + oy - ry, x, y + height - ry], [x, y + ry], [x, y + ry - oy, x + rx - ox, y, x + rx, y]];
  }

  function getR$1(v) {
    v = parseFloat(v);

    if (isNaN(v)) {
      v = 0;
    }

    return v;
  }

  var Rect = /*#__PURE__*/function (_Geom) {
    _inherits(Rect, _Geom);

    var _super = _createSuper(Rect);

    function Rect(tagName, props) {
      var _this;

      _classCallCheck(this, Rect);

      _this = _super.call(this, tagName, props); // 圆角

      if (_this.isMulti) {
        _this.__rx = [0];
        _this.__ry = [0];

        if (Array.isArray(props.rx)) {
          _this.__rx = props.rx.map(function (i) {
            return getR$1(i);
          });
        }

        if (Array.isArray(props.ry)) {
          _this.__ry = props.ry.map(function (i) {
            return getR$1(i);
          });
        }
      } else {
        _this.__rx = _this.__ry = 0;

        if (!isNil$b(props.rx)) {
          _this.__rx = getR$1(props.rx);
        }

        if (!isNil$b(props.ry)) {
          _this.__ry = getR$1(props.ry);
        }
      }

      return _this;
    }

    _createClass(Rect, [{
      key: "buildCache",
      value: function buildCache(originX, originY) {
        var width = this.width,
            height = this.height,
            rx = this.rx,
            ry = this.ry,
            __cacheProps = this.__cacheProps,
            isMulti = this.isMulti;
        var rebuild;

        if (isNil$b(__cacheProps.rx)) {
          rebuild = true;

          if (isMulti) {
            __cacheProps.rx = rx.map(function (rx) {
              return Math.min(rx, 0.5) * width;
            });
          } else {
            __cacheProps.rx = Math.min(rx, 0.5) * width;
          }
        }

        if (isNil$b(__cacheProps.ry)) {
          rebuild = true;

          if (isMulti) {
            __cacheProps.ry = rx.map(function (ry) {
              return Math.min(ry, 0.5) * height;
            });
          } else {
            __cacheProps.ry = Math.min(ry, 0.5) * height;
          }
        }

        if (rebuild) {
          var _rx = __cacheProps.rx,
              _ry = __cacheProps.ry;

          if (isMulti) {
            __cacheProps.list = _rx.map(function (rx, i) {
              return genVertex(originX, originY, width, height, rx, _ry[i]);
            });
          } else {
            __cacheProps.list = genVertex(originX, originY, width, height, _rx, _ry);
          }
        }

        return rebuild;
      }
    }, {
      key: "render",
      value: function render(renderMode, lv, ctx, defs) {
        var res = _get(_getPrototypeOf(Rect.prototype), "render", this).call(this, renderMode, lv, ctx, defs);

        if (res["break"]) {
          return res;
        }

        var originX = res.originX,
            originY = res.originY,
            fill = res.fill,
            stroke = res.stroke,
            strokeWidth = res.strokeWidth,
            strokeDasharrayStr = res.strokeDasharrayStr,
            strokeLinecap = res.strokeLinecap,
            strokeLinejoin = res.strokeLinejoin,
            strokeMiterlimit = res.strokeMiterlimit,
            dx = res.dx,
            dy = res.dy;
        var __cacheProps = this.__cacheProps,
            isMulti = this.isMulti;
        this.buildCache(originX, originY);
        var list = __cacheProps.list;

        if (renderMode === mode.CANVAS) {
          ctx.beginPath();

          if (isMulti) {
            list.forEach(function (item) {
              return painter.canvasPolygon(ctx, item, dx, dy);
            });
          } else {
            painter.canvasPolygon(ctx, list, dx, dy);
          }

          ctx.fill();

          if (strokeWidth > 0) {
            ctx.stroke();
          }

          ctx.closePath();
        } else if (renderMode === mode.SVG) {
          var d = '';

          if (isMulti) {
            list.forEach(function (item) {
              return d += painter.svgPolygon(item);
            });
          } else {
            d = painter.svgPolygon(list);
          }

          var props = [['d', d], ['fill', fill], ['stroke', stroke], ['stroke-width', strokeWidth]];

          this.__propsStrokeStyle(props, strokeDasharrayStr, strokeLinecap, strokeLinejoin, strokeMiterlimit);

          this.addGeom('path', props);
        }

        return res;
      }
    }, {
      key: "rx",
      get: function get() {
        return this.getProps('rx');
      }
    }, {
      key: "ry",
      get: function get() {
        return this.getProps('ry');
      }
    }, {
      key: "bbox",
      get: function get() {
        var sx = this.sx,
            sy = this.sy,
            width = this.width,
            height = this.height,
            _this$currentStyle = this.currentStyle,
            boxShadow = _this$currentStyle.boxShadow,
            filter = _this$currentStyle.filter,
            _this$computedStyle = this.computedStyle,
            borderTopWidth = _this$computedStyle.borderTopWidth,
            borderLeftWidth = _this$computedStyle.borderLeftWidth,
            marginTop = _this$computedStyle.marginTop,
            marginLeft = _this$computedStyle.marginLeft,
            paddingTop = _this$computedStyle.paddingTop,
            paddingLeft = _this$computedStyle.paddingLeft,
            strokeWidth = _this$computedStyle.strokeWidth;
        var originX = sx + borderLeftWidth + marginLeft + paddingLeft;
        var originY = sy + borderTopWidth + marginTop + paddingTop;
        this.buildCache(originX, originY);

        var bbox = _get(_getPrototypeOf(Rect.prototype), "bbox", this);

        var half = strokeWidth * 0.5;

        var _this$__spreadByBoxSh = this.__spreadByBoxShadowAndFilter(boxShadow, filter),
            _this$__spreadByBoxSh2 = _slicedToArray(_this$__spreadByBoxSh, 2),
            ox = _this$__spreadByBoxSh2[0],
            oy = _this$__spreadByBoxSh2[1];

        ox += half;
        oy += half;
        bbox[0] = Math.min(bbox[0], originX - ox);
        bbox[1] = Math.min(bbox[1], originY - oy);
        bbox[2] = Math.min(bbox[2], originX + width + ox);
        bbox[3] = Math.min(bbox[3], originY + height + oy);
        return bbox;
      }
    }]);

    return Rect;
  }(Geom$1);

  var isNil$c = util.isNil;

  function getR$2(v) {
    v = parseFloat(v);

    if (isNaN(v)) {
      v = 1;
    }

    return v;
  }

  var Circle = /*#__PURE__*/function (_Geom) {
    _inherits(Circle, _Geom);

    var _super = _createSuper(Circle);

    function Circle(tagName, props) {
      var _this;

      _classCallCheck(this, Circle);

      _this = _super.call(this, tagName, props); // 半径[0, ∞)，默认1

      if (_this.isMulti) {
        _this.__r = [1];

        if (Array.isArray(props.r)) {
          _this.__r = props.r.map(function (i) {
            return getR$2(i);
          });
        } else if (!isNil$c(props.r)) {
          _this.__r = getR$2(props.r);
        }
      } else {
        _this.__r = 1;

        if (!isNil$c(props.r)) {
          _this.__r = getR$2(props.r);
        }
      }

      return _this;
    }

    _createClass(Circle, [{
      key: "buildCache",
      value: function buildCache(cx, cy) {
        var width = this.width,
            r = this.r,
            __cacheProps = this.__cacheProps,
            isMulti = this.isMulti;

        if (isNil$c(__cacheProps.r)) {
          if (isMulti) {
            __cacheProps.r = r.map(function (i) {
              return i * width * 0.5;
            });
            __cacheProps.list = __cacheProps.r.map(function (r) {
              return geom.ellipsePoints(cx, cy, r);
            });
          } else {
            __cacheProps.r = r * width * 0.5;
            __cacheProps.list = geom.ellipsePoints(cx, cy, __cacheProps.r);
          }
        }
      }
    }, {
      key: "render",
      value: function render(renderMode, lv, ctx, defs) {
        var res = _get(_getPrototypeOf(Circle.prototype), "render", this).call(this, renderMode, lv, ctx, defs);

        if (res["break"]) {
          return res;
        }

        var cx = res.cx,
            cy = res.cy,
            fill = res.fill,
            stroke = res.stroke,
            strokeWidth = res.strokeWidth,
            strokeDasharrayStr = res.strokeDasharrayStr,
            strokeLinecap = res.strokeLinecap,
            strokeLinejoin = res.strokeLinejoin,
            strokeMiterlimit = res.strokeMiterlimit,
            dx = res.dx,
            dy = res.dy;
        var __cacheProps = this.__cacheProps,
            isMulti = this.isMulti;
        this.buildCache(cx, cy);
        var list = __cacheProps.list;

        if (renderMode === mode.CANVAS) {
          ctx.beginPath();

          if (isMulti) {
            list.forEach(function (item) {
              return painter.canvasPolygon(ctx, item, dx, dy);
            });
          } else {
            painter.canvasPolygon(ctx, list, dx, dy);
          }

          ctx.fill();

          if (strokeWidth > 0) {
            ctx.stroke();
          }

          ctx.closePath();
        } else if (renderMode === mode.SVG) {
          var d = '';

          if (isMulti) {
            list.forEach(function (item) {
              return d += painter.svgPolygon(item);
            });
          } else {
            d = painter.svgPolygon(list);
          }

          var props = [['d', d], ['fill', fill], ['stroke', stroke], ['stroke-width', strokeWidth]];

          this.__propsStrokeStyle(props, strokeDasharrayStr, strokeLinecap, strokeLinejoin, strokeMiterlimit);

          this.addGeom('path', props);
        }

        return res;
      }
    }, {
      key: "r",
      get: function get() {
        return this.getProps('r');
      }
    }, {
      key: "bbox",
      get: function get() {
        var isMulti = this.isMulti,
            __cacheProps = this.__cacheProps,
            sx = this.sx,
            sy = this.sy,
            width = this.width,
            height = this.height,
            _this$currentStyle = this.currentStyle,
            boxShadow = _this$currentStyle.boxShadow,
            filter = _this$currentStyle.filter,
            _this$computedStyle = this.computedStyle,
            borderTopWidth = _this$computedStyle.borderTopWidth,
            borderLeftWidth = _this$computedStyle.borderLeftWidth,
            marginTop = _this$computedStyle.marginTop,
            marginLeft = _this$computedStyle.marginLeft,
            paddingTop = _this$computedStyle.paddingTop,
            paddingLeft = _this$computedStyle.paddingLeft,
            strokeWidth = _this$computedStyle.strokeWidth;
        var originX = sx + borderLeftWidth + marginLeft + paddingLeft;
        var originY = sy + borderTopWidth + marginTop + paddingTop;
        var cx = originX + width * 0.5;
        var cy = originY + height * 0.5;
        this.buildCache(cx, cy);
        var r = 0;

        if (isMulti) {
          var max = 0;

          __cacheProps.r.forEach(function (r) {
            max = Math.max(r, max);
          });

          r = max;
        } else {
          r = __cacheProps.r;
        }

        var bbox = _get(_getPrototypeOf(Circle.prototype), "bbox", this);

        var half = strokeWidth * 0.5;

        var _this$__spreadByBoxSh = this.__spreadByBoxShadowAndFilter(boxShadow, filter),
            _this$__spreadByBoxSh2 = _slicedToArray(_this$__spreadByBoxSh, 2),
            ox = _this$__spreadByBoxSh2[0],
            oy = _this$__spreadByBoxSh2[1];

        ox += half;
        oy += half;
        var xa = cx - r - ox;
        var xb = cx + r + ox;
        var ya = cy - r - oy;
        var yb = cy + r + oy;
        bbox[0] = Math.min(bbox[0], xa);
        bbox[1] = Math.min(bbox[1], ya);
        bbox[2] = Math.max(bbox[2], xb);
        bbox[3] = Math.max(bbox[3], yb);
        return bbox;
      }
    }]);

    return Circle;
  }(Geom$1);

  var isNil$d = util.isNil;

  function getR$3(v) {
    v = parseFloat(v);

    if (isNaN(v)) {
      v = 1;
    }

    return v;
  }

  var Ellipse = /*#__PURE__*/function (_Geom) {
    _inherits(Ellipse, _Geom);

    var _super = _createSuper(Ellipse);

    function Ellipse(tagName, props) {
      var _this;

      _classCallCheck(this, Ellipse);

      _this = _super.call(this, tagName, props); // 半径[0, ∞)，默认1

      if (_this.isMulti) {
        _this.__rx = [1];
        _this.__ry = [1];

        if (Array.isArray(props.rx)) {
          _this.__rx = props.rx.map(function (i) {
            return getR$3(i);
          });
        } else if (!isNil$d(props.rx)) {
          _this.__rx = [getR$3(props.rx)];
        }

        if (Array.isArray(props.ry)) {
          _this.__ry = props.ry.map(function (i) {
            return getR$3(i);
          });
        } else if (!isNil$d(props.ry)) {
          _this.__ry = [getR$3(props.ry)];
        }
      } else {
        _this.__rx = 1;

        if (!isNil$d(props.rx)) {
          _this.__rx = getR$3(props.rx);
        }

        _this.__ry = 1;

        if (!isNil$d(props.ry)) {
          _this.__ry = getR$3(props.ry);
        }
      }

      return _this;
    }

    _createClass(Ellipse, [{
      key: "buildCache",
      value: function buildCache(cx, cy) {
        var width = this.width,
            height = this.height,
            rx = this.rx,
            ry = this.ry,
            __cacheProps = this.__cacheProps,
            isMulti = this.isMulti;
        var rebuild;

        if (isNil$d(__cacheProps.rx)) {
          rebuild = true;

          if (isMulti) {
            __cacheProps.rx = rx.map(function (i) {
              return i * width * 0.5;
            });
          } else {
            __cacheProps.rx = rx * width * 0.5;
          }
        }

        if (isNil$d(__cacheProps.ry)) {
          rebuild = true;

          if (isMulti) {
            __cacheProps.ry = ry.map(function (i) {
              return i * height * 0.5;
            });
          } else {
            __cacheProps.ry = ry * height * 0.5;
          }
        }

        if (rebuild) {
          var _rx = __cacheProps.rx,
              _ry = __cacheProps.ry;

          if (isMulti) {
            __cacheProps.list = _rx.map(function (rx, i) {
              return geom.ellipsePoints(cx, cy, rx, _ry[i]);
            });
          } else {
            __cacheProps.list = geom.ellipsePoints(cx, cy, _rx, _ry);
          }
        }

        return rebuild;
      }
    }, {
      key: "render",
      value: function render(renderMode, lv, ctx, defs) {
        var res = _get(_getPrototypeOf(Ellipse.prototype), "render", this).call(this, renderMode, lv, ctx, defs);

        if (res["break"]) {
          return res;
        }

        var cx = res.cx,
            cy = res.cy,
            fill = res.fill,
            stroke = res.stroke,
            strokeWidth = res.strokeWidth,
            strokeDasharrayStr = res.strokeDasharrayStr,
            strokeLinecap = res.strokeLinecap,
            strokeLinejoin = res.strokeLinejoin,
            strokeMiterlimit = res.strokeMiterlimit,
            dx = res.dx,
            dy = res.dy;
        var __cacheProps = this.__cacheProps,
            isMulti = this.isMulti;
        this.buildCache(cx, cy);
        var list = __cacheProps.list;

        if (renderMode === mode.CANVAS) {
          ctx.beginPath();

          if (isMulti) {
            list.forEach(function (item) {
              return painter.canvasPolygon(ctx, item, dx, dy);
            });
          } else {
            painter.canvasPolygon(ctx, list, dx, dy);
          }

          ctx.fill();

          if (strokeWidth > 0) {
            ctx.stroke();
          }

          ctx.closePath();
        } else if (renderMode === mode.SVG) {
          var d = '';

          if (isMulti) {
            list.forEach(function (item) {
              return d += painter.svgPolygon(item);
            });
          } else {
            d = painter.svgPolygon(list);
          }

          var props = [['d', d], ['fill', fill], ['stroke', stroke], ['stroke-width', strokeWidth]];

          this.__propsStrokeStyle(props, strokeDasharrayStr, strokeLinecap, strokeLinejoin, strokeMiterlimit);

          this.addGeom('path', props);
        }

        return res;
      }
    }, {
      key: "rx",
      get: function get() {
        return this.getProps('rx');
      }
    }, {
      key: "ry",
      get: function get() {
        return this.getProps('ry');
      }
    }, {
      key: "bbox",
      get: function get() {
        var isMulti = this.isMulti,
            __cacheProps = this.__cacheProps,
            sx = this.sx,
            sy = this.sy,
            width = this.width,
            height = this.height,
            _this$currentStyle = this.currentStyle,
            boxShadow = _this$currentStyle.boxShadow,
            filter = _this$currentStyle.filter,
            _this$computedStyle = this.computedStyle,
            borderTopWidth = _this$computedStyle.borderTopWidth,
            borderLeftWidth = _this$computedStyle.borderLeftWidth,
            marginTop = _this$computedStyle.marginTop,
            marginLeft = _this$computedStyle.marginLeft,
            paddingTop = _this$computedStyle.paddingTop,
            paddingLeft = _this$computedStyle.paddingLeft,
            strokeWidth = _this$computedStyle.strokeWidth;
        var originX = sx + borderLeftWidth + marginLeft + paddingLeft;
        var originY = sy + borderTopWidth + marginTop + paddingTop;
        var cx = originX + width * 0.5;
        var cy = originY + height * 0.5;
        this.buildCache(cx, cy);
        var rx = 0,
            ry = 0;

        if (isMulti) {
          var mx = 0,
              my = 0;

          __cacheProps.rx.forEach(function (rx, i) {
            mx = Math.max(rx, mx);
            my = Math.max(ry, __cacheProps.ry[i]);
          });

          rx = mx;
          ry = my;
        } else {
          rx = __cacheProps.rx;
          ry = __cacheProps.ry;
        }

        var bbox = _get(_getPrototypeOf(Ellipse.prototype), "bbox", this);

        var half = strokeWidth * 0.5;

        var _this$__spreadByBoxSh = this.__spreadByBoxShadowAndFilter(boxShadow, filter),
            _this$__spreadByBoxSh2 = _slicedToArray(_this$__spreadByBoxSh, 2),
            ox = _this$__spreadByBoxSh2[0],
            oy = _this$__spreadByBoxSh2[1];

        ox += half;
        oy += half;
        var xa = cx - rx - ox;
        var xb = cx + rx + ox;
        var ya = cy - ry - oy;
        var yb = cy + ry + oy;
        bbox[0] = Math.min(bbox[0], xa);
        bbox[1] = Math.min(bbox[1], ya);
        bbox[2] = Math.max(bbox[2], xb);
        bbox[3] = Math.max(bbox[3], yb);
        return bbox;
      }
    }]);

    return Ellipse;
  }(Geom$1);

  var fullCssProperty = {
    skewX: 'kx',
    skewY: 'ky',
    transform: 'tf',
    fontSize: 'fz',
    offset: 'os',
    easing: 'e',
    filter: 'ft',
    boxShadow: 'bd'
  };
  var abbrCssProperty = {
    os: 'offset',
    e: 'easing',
    ft: 'filter',
    bd: 'boxShadow'
  };
  var fullAnimate = {
    value: 'v',
    options: 'o'
  };
  var abbrAnimate = {};
  var fullAnimateOption = {
    duration: 'dt',
    delay: 'd',
    endDelay: 'ed',
    iterations: 'i',
    direction: 'dc',
    fill: 'f',
    fps: 'fp',
    playbackRate: 'p',
    spfLimit: 'sl'
  };
  var abbrAnimateOption = {};
  reset.DOM_ENTRY_SET.concat(reset.GEOM_ENTRY_SET).forEach(function (item) {
    var k = item.k;

    if (fullCssProperty.hasOwnProperty(k)) {
      abbrCssProperty[fullCssProperty[k]] = k;
      return;
    }

    var v = k.charAt(0) + k.replace(/[a-z]/g, '').toLowerCase();
    fullCssProperty[k] = v;
    abbrCssProperty[v] = k;
  });
  Object.keys(fullAnimate).forEach(function (k) {
    abbrAnimate[fullAnimate[k]] = k;
  });
  Object.keys(fullAnimateOption).forEach(function (k) {
    abbrAnimateOption[fullAnimateOption[k]] = k;
  });
  var abbr$1 = {
    fullCssProperty: fullCssProperty,
    abbrCssProperty: abbrCssProperty,
    fullAnimate: fullAnimate,
    abbrAnimate: abbrAnimate,
    fullAnimateOption: fullAnimateOption,
    abbrAnimateOption: abbrAnimateOption
  };

  var TYPE_VD$3 = $$type.TYPE_VD,
      TYPE_GM$3 = $$type.TYPE_GM,
      TYPE_CP$3 = $$type.TYPE_CP;
  var isNil$e = util.isNil,
      isFunction$7 = util.isFunction,
      isPrimitive = util.isPrimitive,
      clone$4 = util.clone,
      extend$3 = util.extend;
  var abbrCssProperty$1 = abbr$1.abbrCssProperty,
      abbrAnimateOption$1 = abbr$1.abbrAnimateOption,
      abbrAnimate$1 = abbr$1.abbrAnimate;
  /**
   * 还原缩写到全称，涉及样式和动画属性
   * @param target 还原的对象
   * @param hash 缩写映射
   */

  function abbr2full(target, hash) {
    // 也许节点没写样式
    if (target) {
      Object.keys(target).forEach(function (k) {
        // var-attr格式特殊考虑，仅映射attr部分，var-还要保留
        if (k.indexOf('var-') === 0) {
          var k2 = k.slice(4);

          if (hash.hasOwnProperty(k2)) {
            var fk = hash[k2];
            target['var-' + fk] = target[k]; // delete target[k];
          }
        } // 普通样式缩写还原
        else if (hash.hasOwnProperty(k)) {
            var _fk = hash[k];
            target[_fk] = target[k]; // 删除以免二次解析

            delete target[k];
          }
      });
    }
  }

  function replaceVars(target, vars) {
    if (target && vars) {
      Object.keys(target).forEach(function (k) {
        if (k.indexOf('var-') === 0) {
          var v = target[k];

          if (!v) {
            return;
          }

          var k2 = k.slice(4); // 有id且变量里面传入了替换的值，值可为null，因为某些情况下空为自动

          if (v.id && vars.hasOwnProperty(v.id)) {
            var value = vars[v.id]; // undefined和null意义不同

            if (value === undefined) {
              return;
            } // 如果有.则特殊处理子属性


            if (k2.indexOf('.') > -1) {
              var list = k2.split('.');
              var len = list.length;

              for (var i = 0; i < len - 1; i++) {
                k2 = list[i]; // 避免异常

                if (target[k2]) {
                  target = target[k2];
                } else {
                  console.error('parseJson vars is not exist: ' + v.id + ', ' + k + ', ' + list.slice(0, i).join('.'));
                }
              }

              k2 = list[len - 1];
            } // 支持函数模式和值模式


            if (isFunction$7(value)) {
              value = value(v);
            }

            target[k2] = value;
          }
        }
      });
    }
  }
  /**
   * 遍历一遍library的一级，将一级的id存到hash上，无需递归二级，
   * 因为顺序前提要求排好且无循环依赖，所以被用到的一定在前面出现，
   * 一般是无children的元件在前，包含children的div在后
   * 只需将可能存在的children在遍历link一遍即可，如果children里有递归，前面因为出现过已经link过了
   * @param item：library的一级孩子
   * @param hash：存放library的key/value引用
   */


  function linkLibrary(item, hash) {
    var id = item.id,
        children = item.children;

    if (Array.isArray(children)) {
      children.forEach(function (child) {
        // 排除原始类型文本
        if (!isPrimitive(child)) {
          var libraryId = child.libraryId; // ide中库文件的child来自于库一定有libraryId，但是为了编程特殊需求，放开允许存入自定义数据

          if (isNil$e(libraryId)) {
            return;
          }

          var libraryItem = hash[libraryId]; // 规定图层child只有init和动画，属性和子图层来自库

          if (libraryItem) {
            linkChild(child, libraryItem);
          } else {
            throw new Error('Link library item miss libraryId: ' + libraryId);
          }
        }
      });
    } // library中一定有id，因为是一级，二级+特殊需求才会出现放开


    if (isNil$e(id)) {
      throw new Error('Library item miss id: ' + JSON.stringify(item));
    } else {
      hash[id] = item;
    }
  }

  function linkChild(child, libraryItem) {
    // 规定图层child只有init和动画，属性和子图层来自库
    child.tagName = libraryItem.tagName;
    child.props = clone$4(libraryItem.props);
    child.children = libraryItem.children; // library的var-也要继承过来，本身的var-优先级更高，目前只有children会出现优先级情况

    Object.keys(libraryItem).forEach(function (k) {
      if (k.indexOf('var-') === 0 && !child.hasOwnProperty(k)) {
        child[k] = libraryItem[k];
      }
    }); // 删除以免二次解析

    child.libraryId = null; // 规定图层实例化的属性和样式在init上，优先使用init，然后才取原型链的props

    var init = child.init;

    if (init) {
      var props = child.props = child.props || {};
      var style = props.style;
      extend$3(props, init); // style特殊处理，防止被上面覆盖丢失原始值

      if (style) {
        extend$3(style, init.style);
        props.style = style;
      } // 删除以免二次解析


      child.init = null;
    }
  }

  function parse(karas, json, animateRecords, vars) {
    var hash = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

    if (isPrimitive(json) || json instanceof Node) {
      return json;
    }

    if (Array.isArray(json)) {
      return json.map(function (item) {
        return parse(karas, item, animateRecords, vars, hash);
      });
    }

    var library = json.library,
        libraryId = json.libraryId; // 有library说明是个mc节点，不会有init/animate和children链接，是个正常节点

    if (Array.isArray(library)) {
      hash = {}; // 强制要求library的文件是排好顺序的，即元件和被引用类型在前面，引用的在后面，
      // 另外没有循环引用，没有递归library，先遍历设置引用，再递归进行连接

      library.forEach(function (item) {
        linkLibrary(item, hash);
      }); // 删除以免二次解析，有library一定没libraryId

      json.library = null;
      json.libraryId = null;
    } // ide中库文件的child一定有libraryId，有library时一定不会有libraryId
    else if (!isNil$e(libraryId) && hash) {
        var libraryItem = hash[libraryId]; // 规定图层child只有init和动画，tagName和属性和子图层来自库

        if (libraryItem) {
          linkChild(json, libraryItem);
        } else {
          throw new Error('Link library miss id: ' + libraryId);
        }
      }

    var tagName = json.tagName,
        _json$props = json.props,
        props = _json$props === void 0 ? {} : _json$props,
        _json$children = json.children,
        children = _json$children === void 0 ? [] : _json$children,
        _json$animate = json.animate,
        animate = _json$animate === void 0 ? [] : _json$animate,
        __animateRecords = json.__animateRecords;

    if (!tagName) {
      throw new Error('Dom must have a tagName: ' + JSON.stringify(json));
    }

    var style = props.style;
    abbr2full(style, abbrCssProperty$1); // 先替换style的

    replaceVars(style, vars); // 再替换静态属性，style也作为属性的一种，目前尚未被设计为被替换

    replaceVars(props, vars); // 替换children里的内容，如文字，无法直接替换tagName/props/children/animate本身，因为下方用的还是原引用

    replaceVars(json, vars);
    var vd;

    if (tagName.charAt(0) === '$') {
      vd = karas.createGm(tagName, props);
    } else {
      vd = karas.createVd(tagName, props, children.map(function (item, i) {
        if (item && [TYPE_VD$3, TYPE_GM$3, TYPE_CP$3].indexOf(item.$$type) > -1) {
          return item;
        }

        return parse(karas, item, animateRecords, vars, hash);
      }));
    }

    if (__animateRecords) {
      vd.__animateRecords = __animateRecords;
    }

    var animationRecord;

    if (animate) {
      if (Array.isArray(animate)) {
        var has;
        animate.forEach(function (item) {
          abbr2full(item, abbrAnimate$1);
          var value = item.value,
              options = item.options; // 忽略空动画

          if (Array.isArray(value) && value.length) {
            has = true;
            value.forEach(function (item) {
              abbr2full(item, abbrCssProperty$1);
              replaceVars(item, vars);
            });
          }

          if (options) {
            abbr2full(options, abbrAnimateOption$1);
            replaceVars(options, vars);
          }
        });

        if (has) {
          animationRecord = {
            animate: animate,
            target: vd
          };
        }
      } else {
        abbr2full(animate, abbrAnimate$1);
        var value = animate.value,
            options = animate.options;

        if (Array.isArray(value) && value.length) {
          value.forEach(function (item) {
            abbr2full(item, abbrCssProperty$1);
            replaceVars(item, vars);
          });
          animationRecord = {
            animate: animate,
            target: vd
          };
        }

        if (options) {
          abbr2full(options, abbrAnimateOption$1);
          replaceVars(options, vars);
        }
      }
    } // 产生实际动画运行才存入列表供root调用执行


    if (animationRecord) {
      animateRecords.push(animationRecord);
    }

    return vd;
  }

  var parser = {
    parse: function parse$1(karas, json, dom) {
      var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      json = util.clone(json); // 重载，在确定dom传入选择器字符串或html节点对象时作为渲染功能，否则仅创建vd返回

      if (!inject.isDom(dom)) {
        options = dom || {};
        dom = null;
      } // 暂存所有动画声明，等root的生成后开始执行


      var animateRecords = [];

      var vd = parse(karas, json, animateRecords, options.vars); // 有dom时parse作为根方法渲染


      if (dom) {
        var _json = json,
            tagName = _json.tagName;

        if (['canvas', 'svg'].indexOf(tagName) === -1) {
          throw new Error('Parse dom must be canvas/svg');
        } // parse直接（非递归）的动画记录


        var ac = options.controller instanceof Controller ? options.controller : vd.animateController; // 第一次render，收集递归json里面的animateRecords，它在xom的__layout最后生成

        karas.render(vd, dom); // 由于vd首先生成的都是json，根parse要特殊处理将target指向真正的vd引用，json的vd在builder中赋值

        animateRecords.forEach(function (item) {
          item.target = item.target.vd;
        }); // 直接的json里的animateRecords，再加上递归的parse的json的（第一次render布局时处理）动画一并播放

        if (options.autoPlay !== false) {
          ac.__auto = ac.__auto.concat(animateRecords);

          ac.__playAuto();
        } else {
          ac.__records = ac.__records.concat(animateRecords);
        }
      } // 递归的parse，如果有动画，此时还没root，先暂存下来，等上面的root的render第一次布局时收集
      else {
          if (animateRecords.length) {
            vd.__animateRecords = {
              options: options,
              list: animateRecords,
              controller: options.controller instanceof Controller ? options.controller : null
            };
          }
        }

      return vd;
    },
    abbr: abbr$1
  };

  var style = {
    css: css,
    reset: reset,
    unit: unit,
    font: font
  };

  var animate = {
    Animation: Animation,
    Controller: Controller,
    easing: easing,
    frame: frame
  };

  var refresh = {
    level: o$1,
    change: o,
    Page: Page,
    Cache: Cache
  };

  var version = "0.40.7";

  Geom$1.register('$line', Line);
  Geom$1.register('$polyline', Polyline);
  Geom$1.register('$polygon', Polygon);
  Geom$1.register('$sector', Sector);
  Geom$1.register('$rect', Rect);
  Geom$1.register('$circle', Circle);
  Geom$1.register('$ellipse', Ellipse);
  var karas$1 = {
    version: version,
    render: function render(root, dom) {
      if (!(root instanceof Root)) {
        throw new Error('Render dom must be canvas/svg');
      }

      if (dom) {
        root.appendTo(dom);
      }

      return root;
    },
    createElement: function createElement(tagName, props) {
      props = props || {};
      var children = [];

      for (var i = 2, len = arguments.length; i < len; i++) {
        children.push(arguments[i]);
      }

      if (util.isString(tagName)) {
        if (tagName.charAt(0) === '$') {
          return this.createGm(tagName, props);
        } else {
          return this.createVd(tagName, props, children);
        }
      } else if (tagName) {
        return this.createCp(tagName, props, children);
      }
    },
    createVd: function createVd(tagName, props) {
      var children = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

      if (['canvas', 'svg'].indexOf(tagName) > -1) {
        return new Root(tagName, props, children);
      }

      if (tag.TAG_NAME.hasOwnProperty(tagName)) {
        return {
          tagName: tagName,
          props: props,
          children: children,
          $$type: $$type.TYPE_VD
        };
      }

      throw new Error("Can not use <".concat(tagName, ">"));
    },
    createGm: function createGm(tagName, props) {
      return {
        tagName: tagName,
        props: props,
        $$type: $$type.TYPE_GM
      };
    },
    createCp: function createCp(klass, props) {
      var children = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
      props.children = children;
      return {
        klass: klass,
        props: props,
        $$type: $$type.TYPE_CP
      };
    },
    parse: function parse(json, dom, options) {
      return parser.parse(this, json, dom, options);
    },
    mode: mode,
    Component: Component$1,
    Node: Node,
    Text: Text,
    Geom: Geom$1,
    Xom: Xom,
    Dom: Dom$1,
    Root: Root,
    Event: Event,
    util: util,
    inject: inject,
    style: style,
    parser: parser,
    animate: animate,
    math: math,
    builder: builder,
    updater: updater,
    refresh: refresh
  };
  builder.ref({
    Xom: Xom,
    Dom: Dom$1,
    Img: Img$1,
    Geom: Geom$1,
    Component: Component$1
  });
  updater.ref({
    Xom: Xom,
    Dom: Dom$1,
    Img: Img$1,
    Geom: Geom$1,
    Component: Component$1
  });

  if (typeof window !== 'undefined') {
    window.karas = karas$1;
  }

  return karas$1;

})));
//# sourceMappingURL=index.js.map
