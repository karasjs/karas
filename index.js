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

  var STYLE_KEY = {
    POSITION: 0,
    DISPLAY: 1,
    TOP: 2,
    RIGHT: 3,
    BOTTOM: 4,
    LEFT: 5,
    MARGIN_TOP: 6,
    MARGIN_RIGHT: 7,
    MARGIN_BOTTOM: 8,
    MARGIN_LEFT: 9,
    PADDING_TOP: 10,
    PADDING_RIGHT: 11,
    PADDING_BOTTOM: 12,
    PADDING_LEFT: 13,
    FONT_SIZE: 14,
    FONT_FAMILY: 15,
    COLOR: 16,
    FONT_STYLE: 17,
    FONT_WEIGHT: 18,
    LINE_HEIGHT: 19,
    BACKGROUND_IMAGE: 20,
    BACKGROUND_COLOR: 21,
    BACKGROUND_SIZE: 22,
    BACKGROUND_REPEAT: 23,
    BACKGROUND_POSITION_X: 24,
    BACKGROUND_POSITION_Y: 25,
    BORDER_TOP_WIDTH: 26,
    BORDER_RIGHT_WIDTH: 27,
    BORDER_BOTTOM_WIDTH: 28,
    BORDER_LEFT_WIDTH: 29,
    BORDER_TOP_COLOR: 30,
    BORDER_RIGHT_COLOR: 31,
    BORDER_BOTTOM_COLOR: 32,
    BORDER_LEFT_COLOR: 33,
    BORDER_TOP_STYLE: 34,
    BORDER_RIGHT_STYLE: 35,
    BORDER_BOTTOM_STYLE: 36,
    BORDER_LEFT_STYLE: 37,
    BORDER_TOP_LEFT_RADIUS: 38,
    BORDER_TOP_RIGHT_RADIUS: 39,
    BORDER_BOTTOM_RIGHT_RADIUS: 40,
    BORDER_BOTTOM_LEFT_RADIUS: 41,
    WIDTH: 42,
    HEIGHT: 43,
    FLEX_GROW: 44,
    FLEX_SHRINK: 45,
    FLEX_BASIS: 46,
    FLEX_DIRECTION: 47,
    JUSTIFY_CONTENT: 48,
    ALIGN_ITEMS: 49,
    ALIGN_SELF: 50,
    TEXT_ALIGN: 51,
    TRANSFORM_ORIGIN: 52,
    VISIBILITY: 53,
    OPACITY: 54,
    Z_INDEX: 55,
    TRANSFORM: 56,
    TRANSLATE_X: 57,
    TRANSLATE_Y: 58,
    SCALE_X: 59,
    SCALE_Y: 60,
    SKEW_X: 61,
    SKEW_Y: 62,
    ROTATE_Z: 63,
    FILTER: 64,
    BOX_SHADOW: 65,
    POINTER_EVENTS: 66,
    OVERFLOW: 67,
    MIX_BLEND_MODE: 68,
    // GEOM
    FILL: 69,
    STROKE: 70,
    STROKE_WIDTH: 71,
    STROKE_DASHARRAY: 72,
    STROKE_DASHARRAY_STR: 73,
    STROKE_LINECAP: 74,
    STROKE_LINEJOIN: 75,
    STROKE_MITERLIMIT: 76,
    FILL_RULE: 77,
    MATRIX: 78,
    // 无此样式，仅cache需要
    BORDER_TOP: 79,
    BORDER_RIGHT: 80,
    BORDER_BOTTOM: 81,
    BORDER_LEFT: 82,
    LETTER_SPACING: 83,
    BACKGROUND_CLIP: 84
  };

  function style2Lower(s) {
    return s.replace(/[A-Z]/g, function ($0) {
      return $0.toLowerCase();
    }).replace(/_([a-z])/g, function ($0, $1) {
      return $1.toUpperCase();
    });
  }

  function style2Upper(s) {
    return s.replace(/[A-Z]/g, function ($0) {
      return '_' + $0.toUpperCase();
    }).replace(/[a-z]/g, function ($0) {
      return $0.toUpperCase();
    });
  }

  var STYLE_R_KEY = {};
  var STYLE_RV_KEY = {};
  var STYLE_V_KEY = {};
  Object.keys(STYLE_KEY).forEach(function (k) {
    var k2 = STYLE_KEY[k];
    STYLE_R_KEY[k2] = k;
    var l = style2Lower(k);
    STYLE_RV_KEY[k2] = l;
    STYLE_V_KEY[l] = k2;
  }); // Root的update过程使用

  var UPDATE_KEY = {
    UPDATE_NODE: 0,
    UPDATE_STYLE: 1,
    UPDATE_FOCUS: 2,
    UPDATE_MEASURE: 3,
    UPDATE_COMPONENT: 4,
    UPDATE_IMG: 5,
    UPDATE_OVERWRITE: 6,
    UPDATE_KEYS: 7,
    UPDATE_LIST: 8,
    UPDATE_CONFIG: 9
  }; // animation计算每帧使用

  var KEY_FRAME_KEY = {
    FRAME_STYLE: 0,
    FRAME_TIME: 1,
    FRAME_EASING: 2,
    FRAME_TRANSITION: 3
  }; // 节点使用

  var NODE_KEY = {
    NODE_DOM_PARENT: 0,
    NODE_OPACITY: 1,
    NODE_MATRIX: 2,
    NODE_MATRIX_EVENT: 3,
    NODE_CACHE: 4,
    NODE_CACHE_TOTAL: 5,
    NODE_CACHE_FILTER: 6,
    NODE_CACHE_MASK: 7,
    NODE_CACHE_OVERFLOW: 8,
    NODE_STRUCT: 9,
    NODE_TAG_NAME: 10,
    NODE_CURRENT_STYLE: 11,
    NODE_CURRENT_PROPS: 12,
    NODE_COMPUTED_STYLE: 13,
    NODE_CACHE_STYLE: 14,
    NODE_CACHE_PROPS: 15,
    NODE_LIMIT_CACHE: 16,
    NODE_IS_MASK: 17,
    NODE_BLUR_VALUE: 18,
    NODE_HAS_CONTENT: 19,
    NODE_REFRESH_LV: 20,
    NODE_IS_DESTROYED: 21,
    NODE_STYLE: 22,
    NODE_UPDATE_HASH: 23,
    NODE_UNIQUE_UPDATE_ID: 24,
    NODE_DEFS_CACHE: 25
  }; // struct用

  var STRUCT_KEY = {
    STRUCT_NODE: 0,
    STRUCT_INDEX: 1,
    STRUCT_CHILD_INDEX: 2,
    STRUCT_LV: 3,
    STRUCT_NUM: 4,
    STRUCT_TOTAL: 5,
    STRUCT_HAS_MASK: 6
  };
  var enums = {
    STYLE_KEY: STYLE_KEY,
    // 大写常量为k，数字为值
    STYLE_R_KEY: STYLE_R_KEY,
    // 数字为k，大写常量为值
    STYLE_RV_KEY: STYLE_RV_KEY,
    // 数字为k，小写为值
    STYLE_V_KEY: STYLE_V_KEY,
    // 小写为k，数字为值
    style2Lower: style2Lower,
    style2Upper: style2Upper,
    UPDATE_KEY: UPDATE_KEY,
    KEY_FRAME_KEY: KEY_FRAME_KEY,
    NODE_KEY: NODE_KEY,
    STRUCT_KEY: STRUCT_KEY
  };

  var _enums$STRUCT_KEY = enums.STRUCT_KEY,
      STRUCT_NODE = _enums$STRUCT_KEY.STRUCT_NODE,
      STRUCT_INDEX = _enums$STRUCT_KEY.STRUCT_INDEX,
      STRUCT_CHILD_INDEX = _enums$STRUCT_KEY.STRUCT_CHILD_INDEX,
      STRUCT_LV = _enums$STRUCT_KEY.STRUCT_LV,
      _enums$NODE_KEY = enums.NODE_KEY,
      NODE_IS_DESTROYED = _enums$NODE_KEY.NODE_IS_DESTROYED,
      NODE_STRUCT = _enums$NODE_KEY.NODE_STRUCT;

  var Node = /*#__PURE__*/function () {
    function Node() {
      _classCallCheck(this, Node);

      this.__x = 0;
      this.__y = 0;
      this.__ox = 0; // relative造成的偏移量

      this.__oy = 0;
      this.__width = 0;
      this.__height = 0;
      this.__baseLine = 0;
      this.__config = {}; // 默认undefined
      // this.__prev = undefined;
      // this.__next = undefined;
      // this.__parent = undefined;
      // this.__domParent = undefined;
      // this.__root = undefined;
      // this.__host = undefined;
    }

    _createClass(Node, [{
      key: "__structure",
      value: function __structure(i, lv, j) {
        var _this$__config$NODE_S;

        return this.__config[NODE_STRUCT] = (_this$__config$NODE_S = {}, _defineProperty(_this$__config$NODE_S, STRUCT_NODE, this), _defineProperty(_this$__config$NODE_S, STRUCT_INDEX, i), _defineProperty(_this$__config$NODE_S, STRUCT_CHILD_INDEX, j), _defineProperty(_this$__config$NODE_S, STRUCT_LV, lv), _this$__config$NODE_S);
      }
    }, {
      key: "__modifyStruct",
      value: function __modifyStruct(root) {
        var struct = this.__config[NODE_STRUCT];
        return [struct, 1];
      }
    }, {
      key: "__offsetX",
      value: function __offsetX(diff, isLayout) {
        if (isLayout) {
          this.__x += diff;
        } else {
          this.__ox += diff;
        }

        this.__sx += diff;
      }
    }, {
      key: "__offsetY",
      value: function __offsetY(diff, isLayout) {
        if (isLayout) {
          this.__y += diff;
        } else {
          this.__oy += diff;
        }

        this.__sy += diff;
      }
    }, {
      key: "__destroy",
      value: function __destroy() {
        this.__config[NODE_IS_DESTROYED] = true;
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
        return this.__domParent;
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
        return this.__config[NODE_IS_DESTROYED];
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
    info: {
      arial: {
        lhr: 1.14990234375,
        // 默认line-height ratio，(67+1854+434)/2048
        // car: 1.1171875, // content-area ratio，(1854+434)/2048
        blr: 0.9052734375 // base-line ratio，1854/2048
        // mdr: 0.64599609375, // middle ratio，(1854-1062/2)/2048
        // lgr: 0.03271484375, // line-gap ratio，67/2048

      },
      verdana: {
        lhr: 1.21533203125,
        // (0+2059+430)/2048
        blr: 1.00537109375 // 2059/2048

      },
      tahoma: {
        lhr: 1.20703125,
        // (0+2049+423)/2048
        blr: 1.00048828125 // 2049/2048

      },
      georgia: {
        lhr: 1.13623046875,
        // (0+1878+449)/2048
        blr: 0.9169921875 // 1878/2048

      },
      'courier new': {
        lhr: 1.1328125,
        // (0+1705+615)/2048
        blr: 0.83251953125 // 1705/2048

      },
      'pingfang sc': {
        lhr: 1.4,
        // (0+1060+340)/1000
        // car: 1.4, // (1060+340)/1000
        blr: 1.06 // 1060/1000

      },
      '宋体': {
        lhr: 1.4,
        // (0+1060+340)/1000
        blr: 1.06
      }
    },
    support: function support(fontFamily) {
      return this.info.hasOwnProperty(fontFamily);
    },
    register: function register(name, info) {
      var _ref = info || {},
          _ref$emSquare = _ref.emSquare,
          emSquare = _ref$emSquare === void 0 ? 2048 : _ref$emSquare,
          _ref$ascent = _ref.ascent,
          ascent = _ref$ascent === void 0 ? 1854 : _ref$ascent,
          _ref$descent = _ref.descent,
          descent = _ref$descent === void 0 ? 434 : _ref$descent,
          _ref$lineGap = _ref.lineGap,
          lineGap = _ref$lineGap === void 0 ? 67 : _ref$lineGap;

      this.info[name.toLowerCase()] = {
        lhr: (ascent + descent + lineGap) / emSquare,
        blr: ascent / emSquare
      };
    }
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
   * https://blog.csdn.net/iloveas2014/article/details/82930946
   * @param m
   * @returns {number[]|*}
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

    var divisor = a * d - b * c;

    if (divisor === 0) {
      return m;
    }

    return [d / divisor, -b / divisor, -c / divisor, a / divisor, (c * f - d * e) / divisor, (b * e - a * f) / divisor];
  }

  function isE(m) {
    return m[0] === 1 && m[1] === 0 && m[2] === 0 && m[3] === 1 && m[4] === 0 && m[5] === 0;
  }

  var mx = {
    identity: identity,
    multiply: multiply,
    calPoint: calPoint,
    int2convolution: int2convolution,
    inverse: inverse,
    isE: isE
  };

  var _VALUE, _ARRAY_, _ARRAY_0_;
  var STYLE_KEY$1 = enums.STYLE_KEY,
      TRANSFORM = enums.STYLE_KEY.TRANSFORM;
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
    s += '</defs><g>';
    vd.bb.forEach(function (item) {
      s += joinVd(item);
    });
    s += '</g><g';

    if (vd.conClip) {
      s += ' clip-path="' + vd.conClip + '"';
    }

    s += '>';
    (vd.children || []).forEach(function (item) {
      if (item.isMask) {
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
      var _s2 = '<g>';
      vd.bb.forEach(function (item) {
        _s2 += joinVd(item);
      });
      _s2 += '</g><g';

      if (vd.conClip) {
        _s2 += ' clip-path="' + vd.conClip + '"';
      }

      _s2 += '>';
      (vd.children || []).forEach(function (item) {
        if (item.isMask) {
          return;
        }

        _s2 += joinVd(item);
      });
      _s2 += '</g>';
      var opacity = vd.opacity,
          transform = vd.transform,
          visibility = vd.visibility,
          mask = vd.mask,
          overflow = vd.overflow,
          filter = vd.filter,
          mixBlendMode = vd.mixBlendMode;
      return '<g' + (opacity !== 1 && opacity !== undefined ? ' opacity="' + opacity + '"' : '') + (transform ? ' transform="' + transform + '"' : '') + ' visibility="' + visibility + '"' + (mask ? ' mask="' + mask + '"' : '') + (overflow ? ' clip-path="' + overflow + '"' : '') + (filter ? ' filter="' + filter + '"' : '') + (mixBlendMode ? ' style="mix-blend-mode:' + mixBlendMode + '"' : '') + '>' + _s2 + '</g>';
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
        res[3] = 1;
      } else if (color.length === 6) {
        res.push(parseInt(color.slice(0, 2), 16));
        res.push(parseInt(color.slice(2, 4), 16));
        res.push(parseInt(color.slice(4), 16));
        res[3] = 1;
      } else if (color.length === 8) {
        res.push(parseInt(color.slice(0, 2), 16));
        res.push(parseInt(color.slice(2, 4), 16));
        res.push(parseInt(color.slice(4, 6), 16));
        res.push(parseInt(color.slice(6), 16) / 255);
      } else {
        res[0] = res[1] = res[2] = 0;
        res[3] = 1;
      }
    } else {
      var c = color.match(/rgba?\s*\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/i);

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
        color = color.map(function (c, i) {
          return i === 3 ? c : Math.floor(Math.max(0, c));
        });
        return 'rgba(' + joinArr(color, ',') + ')';
      } else if (color.length === 3) {
        color = color.map(function (c) {
          return Math.floor(c);
        });
        return 'rgba(' + joinArr(color, ',') + ',1)';
      }
    }

    return color || 'rgba(0,0,0,0)';
  }

  function int2invert(color) {
    if (Array.isArray(color)) {
      color = color.slice(0);
      color[0] = 255 - color[0];
      color[1] = 255 - color[1];
      color[2] = 255 - color[2];

      if (color.length === 4) {
        return 'rgba(' + joinArr(color, ',') + ')';
      } else if (color.length === 3) {
        return 'rgba(' + joinArr(color, ',') + ',1)';
      }
    }

    return 'rgba(0,0,0,0)';
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
      item.__setTarget(nvd); // 事件队列的缘故，可能动画本帧刚执行过，然后再继承，就会缺失，需再次赋值一遍；也有可能停留最后


      if (item.assigning || item.finished && item.__stayEnd()) {
        item.assignCurrentStyle();
      }
    }); // 帧动画继承

    nvd.__frameAnimateList = ovd.__frameAnimateList.splice(0);
  }

  function transformBbox(bbox, matrix) {
    var dx = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var dy = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

    if (matrix && !mx.isE(matrix)) {
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
    } else if (dx || dy) {
      bbox[0] -= dx;
      bbox[1] -= dy;
      bbox[2] += dx;
      bbox[3] += dy;
    }

    return bbox;
  }

  var VALUE = (_VALUE = {}, _defineProperty(_VALUE, STYLE_KEY$1.POSITION, true), _defineProperty(_VALUE, STYLE_KEY$1.DISPLAY, true), _defineProperty(_VALUE, STYLE_KEY$1.BACKGROUND_REPEAT, true), _defineProperty(_VALUE, STYLE_KEY$1.FLEX_DIRECTION, true), _defineProperty(_VALUE, STYLE_KEY$1.JUSTIFY_CONTENT, true), _defineProperty(_VALUE, STYLE_KEY$1.ALIGN_ITEMS, true), _defineProperty(_VALUE, STYLE_KEY$1.ALIGN_SELF, true), _defineProperty(_VALUE, STYLE_KEY$1.OVERFLOW, true), _defineProperty(_VALUE, STYLE_KEY$1.MIX_BLEND_MODE, true), _defineProperty(_VALUE, STYLE_KEY$1.STROKE_LINECAP, true), _defineProperty(_VALUE, STYLE_KEY$1.STROKE_LINEJOIN, true), _defineProperty(_VALUE, STYLE_KEY$1.STROKE_MITERLIMIT, true), _defineProperty(_VALUE, STYLE_KEY$1.FILL_RULE, true), _VALUE);
  var ARRAY_0 = (_ARRAY_ = {}, _defineProperty(_ARRAY_, STYLE_KEY$1.BACKGROUND_SIZE, true), _defineProperty(_ARRAY_, STYLE_KEY$1.BACKGROUND_COLOR, true), _defineProperty(_ARRAY_, STYLE_KEY$1.BORDER_TOP_COLOR, true), _defineProperty(_ARRAY_, STYLE_KEY$1.BORDER_RIGHT_COLOR, true), _defineProperty(_ARRAY_, STYLE_KEY$1.BORDER_BOTTOM_COLOR, true), _defineProperty(_ARRAY_, STYLE_KEY$1.BORDER_LEFT_COLOR, true), _ARRAY_);
  var ARRAY_0_1 = (_ARRAY_0_ = {}, _defineProperty(_ARRAY_0_, STYLE_KEY$1.BORDER_TOP_LEFT_RADIUS, true), _defineProperty(_ARRAY_0_, STYLE_KEY$1.BORDER_TOP_RIGHT_RADIUS, true), _defineProperty(_ARRAY_0_, STYLE_KEY$1.BORDER_BOTTOM_RIGHT_RADIUS, true), _defineProperty(_ARRAY_0_, STYLE_KEY$1.BORDER_BOTTOM_LEFT_RADIUS, true), _defineProperty(_ARRAY_0_, STYLE_KEY$1.TRANSFORM_ORIGIN, true), _ARRAY_0_);

  function cloneStyle(style, keys) {
    if (!keys) {
      keys = Object.keys(style);
    }

    var res = {};
    keys.forEach(function (k) {
      var v = style[k]; // 渐变特殊处理

      if (k === STYLE_KEY$1.BACKGROUND_IMAGE) {
        if (v.k) {
          res[k] = util.clone(v);
        } else {
          res[k] = v;
        }
      } // position等直接值类型赋值
      else if (VALUE.hasOwnProperty(k)) {
          res[k] = v;
        } // 其余皆是数组
        else {
            var n = res[k] = v.slice(0); // 特殊引用里数组某项再次clone

            if (ARRAY_0.hasOwnProperty(k)) {
              n[0] = n[0].slice(0);
            } else if (ARRAY_0_1.hasOwnProperty(k)) {
              n[0] = n[0].slice(0);
              n[1] = n[1].slice(0);
            } else if (k === TRANSFORM) {
              for (var i = 0, len = n.length; i < len; i++) {
                n[i] = n[i].slice(0);
              }
            }
          }
    });
    return res;
  }

  function getMergeMarginTB(topList, bottomList) {
    var total = 0;
    var max = topList[0];
    var min = topList[0];
    topList.forEach(function (item) {
      total += item;
      max = Math.max(max, item);
      min = Math.min(min, item);
    });
    bottomList.forEach(function (item) {
      total += item;
      max = Math.max(max, item);
      min = Math.min(min, item);
    }); // 正数取最大，负数取最小，正负则相加

    var diff = 0;

    if (max > 0 && min > 0) {
      diff = Math.max(max, min) - total;
    } else if (max < 0 && min < 0) {
      diff = Math.min(max, min) - total;
    } else if (max !== 0 || min !== 0) {
      diff = max + min - total;
    }

    return diff;
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
    int2invert: int2invert,
    arr2hash: arr2hash,
    hash2arr: hash2arr,
    clone: clone,
    cloneStyle: cloneStyle,
    equalArr: equalArr,
    equal: equal,
    extend: extend,
    joinArr: joinArr,
    extendAnimate: extendAnimate,
    transformBbox: transformBbox,
    getMergeMarginTB: getMergeMarginTB
  };

  var reg = {
    position: /((-?[\d.]+(px|%)?)|(left|top|right|bottom|center)){1,2}/ig,
    // tfo: /((-?[\d.]+(px|%)?)|(left|top|right|bottom|center)){1,2}/ig,
    gradient: /\b(\w+)-?gradient\((.+)\)/i,
    img: /(?:\burl\((['"]?)(.*?)\1\))|(?:\b((data:)))/i
  };

  // 向量点乘积
  function dotProduct(x1, y1, x2, y2) {
    return x1 * x2 + y1 * y2;
  } // 向量叉乘积


  function crossProduct(x1, y1, x2, y2) {
    return x1 * y2 - x2 * y1;
  }

  var vector = {
    dotProduct: dotProduct,
    crossProduct: crossProduct
  };

  var H = 4 * (Math.sqrt(2) - 1) / 3;
  var crossProduct$1 = vector.crossProduct;
  var _enums$STYLE_KEY = enums.STYLE_KEY,
      WIDTH = _enums$STYLE_KEY.WIDTH,
      HEIGHT = _enums$STYLE_KEY.HEIGHT,
      TRANSFORM_ORIGIN = _enums$STYLE_KEY.TRANSFORM_ORIGIN;

  function h(deg) {
    deg *= 0.5;
    return 4 * ((1 - Math.cos(deg)) / Math.sin(deg)) / 3;
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

      if (crossProduct$1(x2 - x1, y2 - y1, x - x1, y - y1) < 0) {
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
   * 余弦定理2边长和夹角求3边
   * @param alpha 弧度
   * @param a
   * @param b
   */


  function sideByAngle(alpha, a, b) {
    var cos = Math.cos(alpha);
    return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2) - 2 * a * b * cos);
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
   * 扇形圆心和半径起始角度生成4个端点和控制点
   * 分为4个象限进行拟合，0、1、2、3
   */


  function sectorPoints(x, y, r, begin, end) {
    if (begin > end) {
      var _ref = [end, begin];
      begin = _ref[0];
      end = _ref[1];
    }

    var list = [];
    var b = Math.floor(begin / 90);
    var e = Math.floor(end / 90); // 同象限直接算

    if (b === e || e - b === 1 && end % 90 === 0) {
      var h2 = h(d2r(Math.abs(begin - end)));
      var d = h2 * r;
      var c = Math.sqrt(Math.pow(r, 2) + Math.pow(d, 2));
      var alpha = Math.atan(d / r);

      if (b < 90) {
        // 第1个交点
        var rx = Math.sin(d2r(begin)) * r;
        var ry = Math.cos(d2r(begin)) * r;
        var p1 = [x + rx, y - ry]; // 第1个控制点

        var deg = alpha + d2r(begin);
        rx = Math.sin(deg) * c;
        ry = Math.cos(deg) * c;
        var p2 = [x + rx, y - ry]; // 第2个交点

        rx = Math.sin(d2r(end)) * r;
        ry = Math.cos(d2r(end)) * r;
        var p4 = [x + rx, y - ry]; // 第2个控制点

        deg = d2r(end) - alpha;
        rx = Math.sin(deg) * c;
        ry = Math.cos(deg) * c;
        var p3 = [x + rx, y - ry];
        list.push(p1);
        list.push(p2.concat(p3).concat(p4)); // list.push([x, y]);
      } else if (b < 180) {
        // 第1个交点
        var _rx = Math.cos(d2r(begin - 90)) * r;

        var _ry = Math.sin(d2r(begin - 90)) * r;

        var _p = [x + _rx, y + _ry]; // 第1个控制点

        var _deg = alpha + d2r(begin - 90);

        _rx = Math.cos(_deg) * c;
        _ry = Math.sin(_deg) * c;
        var _p2 = [x + _rx, y + _ry]; // 第2个交点

        _rx = Math.cos(d2r(end - 90)) * r;
        _ry = Math.sin(d2r(end - 90)) * r;
        var _p3 = [x + _rx, y + _ry]; // 第2个控制点

        _deg = d2r(end - 90) - alpha;
        _rx = Math.cos(_deg) * c;
        _ry = Math.sin(_deg) * c;
        var _p4 = [x + _rx, y + _ry];
        list.push(_p);
        list.push(_p2.concat(_p4).concat(_p3)); // list.push([x, y]);
      } else if (b < 270) {
        // 第1个交点
        var _rx2 = Math.sin(d2r(begin - 180)) * r;

        var _ry2 = Math.cos(d2r(begin - 180)) * r;

        var _p5 = [x - _rx2, y + _ry2]; // 第1个控制点

        var _deg2 = alpha + d2r(begin - 180);

        _rx2 = Math.sin(_deg2) * c;
        _ry2 = Math.cos(_deg2) * c;
        var _p6 = [x - _rx2, y + _ry2]; // 第2个交点

        _rx2 = Math.sin(d2r(end - 180)) * r;
        _ry2 = Math.cos(d2r(end - 180)) * r;
        var _p7 = [x - _rx2, y + _ry2]; // 第2个控制点

        _deg2 = d2r(end - 180) - alpha;
        _rx2 = Math.sin(_deg2) * c;
        _ry2 = Math.cos(_deg2) * c;
        var _p8 = [x - _rx2, y + _ry2];
        list.push(_p5);
        list.push(_p6.concat(_p8).concat(_p7)); // list.push([x, y]);
      } else {
        // 第1个交点
        var _rx3 = Math.cos(d2r(begin - 270)) * r;

        var _ry3 = Math.sin(d2r(begin - 270)) * r;

        var _p9 = [x - _rx3, y + _ry3]; // 第1个控制点

        var _deg3 = alpha + d2r(begin - 270);

        _rx3 = Math.cos(_deg3) * c;
        _ry3 = Math.sin(_deg3) * c;
        var _p10 = [x - _rx3, y + _ry3]; // 第2个交点

        _rx3 = Math.cos(d2r(end - 270)) * r;
        _ry3 = Math.sin(d2r(end - 270)) * r;
        var _p11 = [x - _rx3, y + _ry3]; // 第2个控制点

        _deg3 = d2r(end - 270) - alpha;
        _rx3 = Math.cos(_deg3) * c;
        _ry3 = Math.sin(_deg3) * c;
        var _p12 = [x - _rx3, y + _ry3];
        list.push(_p9);
        list.push(_p10.concat(_p12).concat(_p11)); // list.push([x, y]);
      }
    } // 跨象限循环算
    else {
        var i = b;
        var temp = [];

        for (; i <= e; i++) {
          if (i === 0) {
            var res = sectorPoints(x, y, r, begin, 90);
            temp.push(res);
          } else if (i === 1) {
            // 防止90~90这种情况，但如果begin和end都是90时又要显示
            if (b === i || end > 90) {
              var _res = sectorPoints(x, y, r, begin < 90 ? 90 : begin, end > 180 ? 180 : end);

              temp.push(_res);
            }
          } else if (i === 2) {
            // 防止180~180这种情况，但如果begin和end都是90时又要显示
            if (b === i || end > 180) {
              var _res2 = sectorPoints(x, y, r, begin < 180 ? 180 : begin, end > 270 ? 270 : end);

              temp.push(_res2);
            }
          } else if (i === 3) {
            // 防止180~180这种情况，但如果begin和end都是90时又要显示
            if (b === i || end > 270) {
              var _res3 = sectorPoints(x, y, r, begin < 270 ? 270 : begin, end);

              temp.push(_res3);
            }
          }
        } // 去掉重复的首尾扇弧点


        list = temp[0];

        for (var _i2 = 1, len = temp.length; _i2 < len; _i2++) {
          list.push(temp[_i2][1]);
        }
      }

    return list;
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
    var width = computedStyle[WIDTH],
        height = computedStyle[HEIGHT],
        _computedStyle$TRANSF = computedStyle[TRANSFORM_ORIGIN];
    _computedStyle$TRANSF = _computedStyle$TRANSF === void 0 ? [width * 0.5, height * 0.5] : _computedStyle$TRANSF;

    var _computedStyle$TRANSF2 = _slicedToArray(_computedStyle$TRANSF, 2),
        ox = _computedStyle$TRANSF2[0],
        oy = _computedStyle$TRANSF2[1];

    var _mx$calPoint = mx.calPoint([px * width - ox, py * height - oy], matrix);

    var _mx$calPoint2 = _slicedToArray(_mx$calPoint, 2);

    px = _mx$calPoint2[0];
    py = _mx$calPoint2[1];
    return [px + ox, py + oy];
  }

  function calPercentInNode(x, y, node) {
    var _node$computedStyle2 = node.computedStyle,
        width = _node$computedStyle2[WIDTH],
        height = _node$computedStyle2[HEIGHT],
        _node$computedStyle2$ = _slicedToArray(_node$computedStyle2[TRANSFORM_ORIGIN], 2),
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
      var ty = (y0 - y1) / (y0 - 2 * y1 + y2);
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

    var _p13 = _slicedToArray(p0, 2),
        x0 = _p13[0],
        y0 = _p13[1];

    var _p14 = _slicedToArray(p1, 2),
        x1 = _p14[0],
        y1 = _p14[1];

    var _p15 = _slicedToArray(p2, 2),
        x2 = _p15[0],
        y2 = _p15[1];

    var _p16 = _slicedToArray(p3, 2),
        x3 = _p16[0],
        y3 = _p16[1];

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

    var _p17 = _slicedToArray(p0, 2),
        x0 = _p17[0],
        y0 = _p17[1];

    var _p18 = _slicedToArray(p1, 2),
        x1 = _p18[0],
        y1 = _p18[1];

    var _p19 = _slicedToArray(p2, 2),
        x2 = _p19[0],
        y2 = _p19[1];

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
      var _p20 = _slicedToArray(p4, 2),
          x4 = _p20[0],
          y4 = _p20[1];

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

  function pointOnCircle(x, y, r, deg) {
    if (deg >= 270) {
      deg -= 270;
      deg = d2r(deg);
      return [x - Math.cos(deg) * r, y - Math.sin(deg) * r];
    } else if (deg >= 180) {
      deg -= 180;
      deg = d2r(deg);
      return [x - Math.sin(deg) * r, y + Math.cos(deg) * r];
    } else if (deg >= 90) {
      deg -= 90;
      deg = d2r(deg);
      return [x + Math.cos(deg) * r, y + Math.sin(deg) * r];
    } else {
      deg = d2r(deg);
      return [x + Math.sin(deg) * r, y - Math.cos(deg) * r];
    }
  }

  var geom = {
    pointInPolygon: pointInPolygon,
    d2r: d2r,
    r2d: r2d,
    // 贝塞尔曲线模拟1/4圆弧比例
    H: H,
    // <90任意角度贝塞尔曲线拟合圆弧的比例公式
    h: h,
    angleBySide: angleBySide,
    sideByAngle: sideByAngle,
    pointsDistance: pointsDistance,
    triangleIncentre: triangleIncentre,
    ellipsePoints: ellipsePoints,
    sectorPoints: sectorPoints,
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
    sliceBezier2Both: sliceBezier2Both,
    pointOnCircle: pointOnCircle
  };

  var rgba2int$1 = util.rgba2int,
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
      return [parseFloat(data), /%/.test(data) ? PERCENT : PX];
    } else {
      var res = [{
        top: 0,
        left: 0,
        center: 50,
        right: 100,
        bottom: 100
      }[data], PERCENT];

      if (isNil$1(res[0])) {
        res[0] = 50;
      }

      return res;
    }
  } // 获取color-stop区间范围，去除无用值


  function getColorStop(v, length) {
    var list = []; // 先把已经声明距离的换算成[0,1]以数组形式存入，未声明的原样存入

    for (var i = 0, len = v.length; i < len; i++) {
      var item = v[i]; // 考虑是否声明了位置

      if (item.length > 1) {
        var p = item[1];

        if (p[1] === PERCENT) {
          list.push([item[0], p[0] * 0.01]);
        } else {
          list.push([item[0], p[0] / length]);
        }
      } else {
        list.push([item[0]]);
      }
    }

    if (list.length === 1) {
      list.push(util.clone(list[0]));
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

    for (var _i2 = 1, _len = list.length; _i2 < _len - 1; _i2++) {
      var _item = list[_i2];

      if (_item.length > 1) {
        start = _item[1];
      } else {
        var j = _i2 + 1;
        var end = list[list.length - 1][1];

        for (; j < _len - 1; j++) {
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


    for (var _i3 = 1, _len2 = list.length; _i3 < _len2; _i3++) {
      var _item4 = list[_i3];
      var prev = list[_i3 - 1];

      if (_item4[1] < prev[1]) {
        _item4[1] = prev[1];
      }
    } // 0之前的和1之后的要过滤掉


    for (var _i4 = 0, _len3 = list.length; _i4 < _len3; _i4++) {
      var _item5 = list[_i4];

      if (_item5[1] > 1) {
        list.splice(_i4);
        var _prev = list[_i4 - 1];

        if (_prev && _prev[1] < 1) {
          var dr = _item5[0][0] - _prev[0][0];
          var dg = _item5[0][1] - _prev[0][1];
          var db = _item5[0][2] - _prev[0][2];
          var da = _item5[0][3] - _prev[0][3];

          var _p = (1 - _prev[1]) / (_item5[1] - _prev[1]);

          list.push([[_item5[0][0] + dr * _p, _item5[0][1] + dg * _p, _item5[0][2] + db * _p, _item5[0][3] + da * _p], 1]);
        }

        break;
      }
    }

    for (var _i5 = list.length - 1; _i5 >= 0; _i5--) {
      var _item6 = list[_i5];

      if (_item6[1] < 0) {
        list.splice(0, _i5 + 1);
        var next = list[_i5];

        if (next && next[1] > 0) {
          var _dr = next[0][0] - _item6[0][0];

          var _dg = next[0][1] - _item6[0][1];

          var _db = next[0][2] - _item6[0][2];

          var _da = next[0][3] - _item6[0][3];

          var _p2 = -_item6[1] / (next[1] - _item6[1]);

          list.unshift([[_item6[0][0] + _dr * _p2, _item6[0][1] + _dg * _p2, _item6[0][2] + _db * _p2, _item6[0][3] + _da * _p2], 0]);
        }

        break;
      }
    } // 可能存在超限情况，如在使用px单位超过len或<len时，canvas会报错超过[0,1]区间，需手动换算至区间内


    list.forEach(function (item) {
      // item[0] = int2rgba(item[0]);
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
    var cx,
        cy,
        xl,
        yl,
        r,
        d = 0; // 扩展的from to ratio格式，圆心、长轴坐标、短轴缩放比

    if (Array.isArray(size)) {
      cx = x1 + size[0] * iw;
      cy = y1 + size[1] * ih;

      if (size[4] <= 0) {
        r = Math.min(Math.abs(cx - x1), Math.min(Math.abs(cy - y1), Math.min(Math.abs(cy - y2), Math.min(Math.abs(cx - y2)))));
      } else {
        xl = Math.sqrt(Math.pow((size[2] - size[0]) * iw, 2) + Math.pow((size[3] - size[1]) * ih, 2));
        yl = xl * size[4];
        r = Math.max(xl, yl); // 看旋转

        if (size[2] >= size[0]) {
          if (size[3] >= size[1]) {
            d = Math.asin((size[3] - size[1]) * ih / xl);
          } else {
            d = -Math.asin((size[1] - size[3]) * ih / xl);
          }
        } else {
          if (size[3] >= size[1]) {
            d = d2r$1(180) - Math.asin((size[3] - size[1]) * ih / xl);
          } else {
            d = Math.asin((size[1] - size[3]) * ih / xl) - d2r$1(180);
          }
        }
      }
    } else {
      // 默认椭圆a是水平轴，b是垂直轴
      if (position[0][1] === PX) {
        cx = x1 + position[0][0];
      } else {
        cx = x1 + position[0][0] * iw * 0.01;
      }

      if (position[1][1] === PX) {
        cy = y1 + position[1][0];
      } else {
        cy = y1 + position[1][0] * ih * 0.01;
      }

      var ratio = 1;

      if (size === 'closest-corner' && shape === 'circle') {
        if (cx <= x1 || cx >= x2 || cy <= y1 || cy >= y2) {
          r = Math.min(Math.abs(cx - x1), Math.min(Math.abs(cy - y1), Math.min(Math.abs(cy - y2), Math.min(Math.abs(cx - y2)))));
        } else {
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
        }
      } else if (size === 'closest-side' || size === 'closest-corner') {
        // 在边外特殊情况只有end颜色填充
        if (cx <= x1 || cx >= x2 || cy <= y1 || cy >= y2) {
          r = Math.min(Math.abs(cx - x1), Math.min(Math.abs(cy - y1), Math.min(Math.abs(cy - y2), Math.min(Math.abs(cx - y2)))));
        } else {
          var _ratio = 1;

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

          r = Math.min(xl, yl); // css的角和边有对应关系，即边扩展倍数，计算为固定值

          if (size === 'closest-corner') {
            _ratio = Math.sqrt(2);
          }

          xl *= _ratio;
          yl *= _ratio;
          r *= _ratio;
        }
      } else {
        if (cx <= x1) {
          xl = x1 - cx + iw;
        } else if (cx >= x2) {
          xl = cx - x2 + iw;
        } else if (cx < x1 + iw * 0.5) {
          xl = x2 - cx;
        } else {
          xl = cx - x1;
        }

        if (cy <= y1) {
          yl = y1 - cy + ih;
        } else if (cy >= y2) {
          yl = cy - y2 + ih;
        } else if (cy < y1 + ih * 0.5) {
          yl = y2 - cy;
        } else {
          yl = cy - y1;
        }

        r = Math.max(xl, yl);

        if (size !== 'farthest-side') {
          ratio = Math.sqrt(2);
        }

        xl *= ratio;
        yl *= ratio;
        r *= ratio;
      }
    }

    if (shape === 'circle') {
      xl = yl = r;
    }

    return [cx, cy, r, xl, yl, d];
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
        } // 扩展支持从a点到b点相对坐标，而不是css角度，sketch等ui软件中用此格式
        else {
            var points = /(-?[\d.]+)\s+(-?[\d.]+)\s+(-?[\d.]+)\s+(-?[\d.]+)/.exec(gradient[2]);

            if (points) {
              o.d = [parseFloat(points[1]), parseFloat(points[2]), parseFloat(points[3]), parseFloat(points[4])];
            } else {
              o.d = 180;
            }
          }
      } else if (o.k === 'radial') {
        o.s = gradient[2].indexOf('circle') > -1 ? 'circle' : 'ellipse';
        var size = /(closest|farthest)-(side|corner)/i.exec(gradient[2]);

        if (size) {
          o.z = size[0].toLowerCase();
        } // 扩展支持从a点到b点相对坐标，而不是size，sketch等ui软件中用此格式
        else {
            var _points = /(-?[\d.]+)\s+(-?[\d.]+)\s+(-?[\d.]+)\s+(-?[\d.]+)(?:\s+([\d.]+))?/.exec(gradient[2]);

            if (_points) {
              o.z = [parseFloat(_points[1]), parseFloat(_points[2]), parseFloat(_points[3]), parseFloat(_points[4])];

              if (!isNil$1(_points[5])) {
                o.z.push(parseFloat(_points[5]));
              } else {
                o.z.push(1);
              }
            } else {
              o.z = 'farthest-corner';
            }
          }

        var position = /at\s+((?:-?[\d.]+(?:px|%)?)|(?:left|top|right|bottom|center))(?:\s+((?:-?[\d.]+(?:px|%)?)|(?:left|top|right|bottom|center)))?/i.exec(gradient[2]);

        if (position) {
          var x = getRadialPosition(position[1]);
          var y = position[2] ? getRadialPosition(position[2]) : x;
          o.p = [x, y];
        } else {
          o.p = [[50, PERCENT], [50, PERCENT]];
        }
      } else if (o.k === 'conic') {
        var _deg = /(-?[\d.]+deg)/i.exec(gradient[2]);

        if (_deg) {
          o.d = parseFloat(_deg[0]) % 360;
        } else {
          o.d = 0;
        }

        var _position = /at\s+((?:-?[\d.]+(?:px|%)?)|(?:left|top|right|bottom|center))(?:\s+((?:-?[\d.]+(?:px|%)?)|(?:left|top|right|bottom|center)))?/i.exec(gradient[2]);

        if (_position) {
          var _x = getRadialPosition(_position[1]);

          var _y = _position[2] ? getRadialPosition(_position[2]) : _x;

          o.p = [_x, _y];
        } else {
          o.p = [[50, PERCENT], [50, PERCENT]];
        }
      }

      var v = gradient[2].match(/(-?[\d.]+(px|%))?\s*((#[0-9a-f]{3,8})|(rgba?\s*\(.+?\)))\s*(-?[\d.]+(px|%))?/ig);
      o.v = v.map(function (item) {
        var color = /((?:#[0-9a-f]{3,8})|(?:rgba?\s*\(.+?\)))/i.exec(item);
        var arr = [rgba2int$1(color[1])];
        var percent = /-?[\d.]+(?:px|%)/.exec(item);

        if (percent) {
          arr[1] = [parseFloat(percent[0])];

          if (/%$/.test(percent[0])) {
            arr[1][1] = PERCENT;
          } else {
            arr[1][1] = PX;
          }
        }

        return arr;
      });
      return o;
    }
  }

  function getLinear(v, d, ox, oy, cx, cy, w, h) {
    // d为数组是2个坐标点，数字是css标准角度
    var x1, y1, x2, y2, stop;

    if (Array.isArray(d)) {
      x1 = ox + d[0] * w;
      y1 = oy + d[1] * h;
      x2 = ox + d[2] * w;
      y2 = oy + d[3] * h;
      var total = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
      stop = getColorStop(v, total);
    } else {
      while (d >= 360) {
        d -= 360;
      }

      while (d < 0) {
        d += 360;
      } // 根据角度求直线上2点，设置半径为长宽最大值，这样一定在矩形外，看做一个向量A


      var len = Math.max(w, h);
      var coords = calLinearCoords(d, len, cx, cy);
      len *= 2; // start和4个顶点的向量在A上的投影长度

      var l1 = vector.dotProduct(ox - coords[0], oy - coords[1], coords[2] - coords[0], coords[3] - coords[1]) / len;
      var l2 = vector.dotProduct(ox + w - coords[0], oy - coords[1], coords[2] - coords[0], coords[3] - coords[1]) / len;
      var l3 = vector.dotProduct(ox + w - coords[0], oy + h - coords[1], coords[2] - coords[0], coords[3] - coords[1]) / len;
      var l4 = vector.dotProduct(ox - coords[0], oy + h - coords[1], coords[2] - coords[0], coords[3] - coords[1]) / len; // 最小和最大值为0~100%

      var min = l1,
          max = l1;
      min = Math.min(min, Math.min(l2, Math.min(l3, l4)));
      max = Math.max(max, Math.max(l2, Math.max(l3, l4))); // 求得0和100%的长度和坐标

      var _total = max - min;

      var r1 = min / len;
      var dx = coords[2] - coords[0];
      var dy = coords[3] - coords[1];
      x1 = coords[0] + dx * r1;
      y1 = coords[1] + dy * r1;
      x2 = coords[2] - dx * r1;
      y2 = coords[3] - dy * r1;
      stop = getColorStop(v, _total);
    }

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
        _calRadialRadius2 = _slicedToArray(_calRadialRadius, 6),
        cx = _calRadialRadius2[0],
        cy = _calRadialRadius2[1],
        r = _calRadialRadius2[2],
        xl = _calRadialRadius2[3],
        yl = _calRadialRadius2[4],
        d = _calRadialRadius2[5]; // 圆形取最小值，椭圆根据最小圆进行transform，椭圆其中一边轴和r一样，另一边则大小缩放可能


    var matrix,
        scx = 1,
        scy = 1;

    if (xl !== yl || d) {
      matrix = [1, 0, 0, 1, 0, 0];

      if (d) {
        var sin = Math.sin(d);
        var cos = Math.cos(d);
        matrix = [cos, sin, -sin, cos, 0, 0];
      }

      if (xl !== r) {
        scx = xl / r;
        var m = [scx, 0, 0, 1, 0, 0];
        matrix = mx.multiply(matrix, m);
      }

      if (yl !== r) {
        scy = yl / r;
        var _m = [1, 0, 0, scy, 0, 0];
        matrix = mx.multiply(matrix, _m);
      }
    }

    var stop = getColorStop(v, r);
    return {
      cx: cx,
      cy: cy,
      r: r,
      stop: stop,
      scx: scx,
      scy: scy,
      matrix: matrix,
      d: d
    };
  }

  function getConic(v, d, p, x1, y1, x2, y2) {
    var ratio = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 1;

    var _calConicRadius = calConicRadius(v, d, p, x1, y1, x2, y2),
        _calConicRadius2 = _slicedToArray(_calConicRadius, 4),
        cx = _calConicRadius2[0],
        cy = _calConicRadius2[1],
        r = _calConicRadius2[2],
        deg = _calConicRadius2[3];

    var stop = getColorStop(v, 1);
    r <<= 1; // 锥形半径*2，这样分割画圆时保证一定会填满原有矩形

    r *= ratio; // 矢量图形比较特殊，有可能超限，传入个倍数扩大半径

    return {
      cx: cx,
      cy: cy,
      r: r,
      deg: deg,
      stop: stop
    };
  }

  function calConicRadius(v, deg, position, x1, y1, x2, y2) {
    var iw = x2 - x1;
    var ih = y2 - y1;
    var cx, cy;

    if (position[0][1] === PX) {
      cx = x1 + position[0][0];
    } else {
      cx = x1 + position[0][0] * iw * 0.01;
    }

    if (position[1][1] === PX) {
      cy = y1 + position[1][0];
    } else {
      cy = y1 + position[1][0] * ih * 0.01;
    }

    var r, a, b;

    if (cx >= x1 + iw * 0.5) {
      a = cx - x1;
    } else {
      a = x2 - cx;
    }

    if (cy >= y1 + ih * 0.5) {
      b = cy - y1;
    } else {
      b = y2 - cy;
    }

    r = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
    return [cx, cy, r, deg];
  }

  var gradient = {
    parseGradient: parseGradient,
    getLinear: getLinear,
    getRadial: getRadial,
    getConic: getConic
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
    backgroundClip: 'border-box',
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
    letterSpacing: 'inherit',
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
    pointerEvents: 'inherit',
    overflow: 'visible',
    mixBlendMode: 'normal'
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

    if (!isNil$2(temp)) {
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
      var c = /#[0-9a-f]{3,8}/i.exec(v);

      if (c && [4, 7, 9].indexOf(c[0].length) > -1) {
        style[k + 'Color'] = c[0];
      } else if (/\btransparent\b/i.test(v)) {
        style[k + 'Color'] = 'transparent';
      } else {
        c = /rgba?\s*\(.+\)/i.exec(v);
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
    backgroundPosition: ['backgroundPositionX', 'backgroundPositionY'],
    flex: ['flexGrow', 'flexShrink', 'flexBasis'],
    translate: ['translateX', 'translateY'],
    scale: ['scaleX', 'scaleY'],
    rotate: ['rotateZ'],
    skew: ['skewX', 'skewY'],
    toFull: function toFull(style, k) {
      var _this = this;

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
          }
        }

        if (isNil$2(style.backgroundColor)) {
          var bgc = /^(transparent)|(#[0-9a-f]{3,8})|(rgba?\s*\(.+?\))/i.exec(v);

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
          parseFlex(style, parseFloat(v), 1, 0);
        } else if (/^[\d.]+px$/i.test(v)) {
          parseFlex(style, 1, 1, 0);
        } else if (/^[\d.]+%$/.test(v)) {
          parseFlex(style, 1, 1, v);
        } else if (/^[\d.]+\s+[\d.]+$/.test(v)) {
          var arr = v.split(/\s+/);
          parseFlex(style, parseFloat(arr[0]), parseFloat(arr[1]), 0);
        } else if (/^[\d.]+\s+[\d.]+%$/.test(v)) {
          var _arr = v.split(/\s+/);

          parseFlex(style, parseFloat(_arr[0]), 1, _arr[1]);
        } else if (/^[\d.]+\s+[\d.]+\s+[\d.]+(px|%)?$/.test(v)) {
          var _arr2 = v.split(/\s+/);

          parseFlex(style, parseFloat(_arr2[0]), parseFloat(_arr2[1]), _arr2[2]);
        } else if (/^[\d.]+\s+[\d.]+\s+(auto|none)$/.test(v)) {
          var _arr3 = v.split(/\s+/);

          parseFlex(style, parseFloat(_arr3[0]), parseFloat(_arr3[1]), _arr3[2]);
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
        if (!Array.isArray(v)) {
          v = [v];
        }

        var isEmpty = this[k].map(function (k2) {
          return isNil$2(style[k2]);
        });
        v.forEach(function (v2) {
          v2 = v2.toString().split(/\s+/);

          if (v2.length === 1) {
            v2[1] = '50%';
          }

          _this[k].forEach(function (k2, i) {
            if (isEmpty[i]) {
              style[k2] = style[k2] || [];
              style[k2].push(v2[i]);
            } // if(isNil(style[k])) {
            //   style[k] = v[i];
            // }

          });
        }); // else {
        //   v = v.toString().split(/\s+/);
        //   if(v.length === 1) {
        //     v[1] = '50%';
        //   }
        //   this[k].forEach((k, i) => {
        //     if(isNil(style[k])) {
        //       style[k] = v[i];
        //     }
        //   });
        // }
      } else if (['translate', 'scale', 'skew'].indexOf(k) > -1) {
        var _arr4 = v.toString().split(/\s*,\s*/);

        if (_arr4.length === 1) {
          _arr4[1] = _arr4[0];
        }

        this[k].forEach(function (k, i) {
          if (isNil$2(style[k])) {
            style[k] = _arr4[i];
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

  var textCache = {
    list: [],
    // 每次渲染前的更新后，等待测量的文字对象列表
    data: {},
    // Text中存入的特殊等待测量的信息，字体+字号+粗细为key
    charWidth: {} // key的文字宽度hash

  };

  var _enums$STYLE_KEY$1 = enums.STYLE_KEY,
      FONT_SIZE = _enums$STYLE_KEY$1.FONT_SIZE,
      FONT_FAMILY = _enums$STYLE_KEY$1.FONT_FAMILY,
      FONT_WEIGHT = _enums$STYLE_KEY$1.FONT_WEIGHT;
  var SPF = 1000 / 60;
  var CANVAS = {};
  var WEBGL = {};
  var CANVAS_LIST = [];
  var WEBGL_LIST = [];

  function cache(key, width, height, hash, message) {
    var o;

    if (!key) {
      var target = hash === CANVAS ? CANVAS_LIST : WEBGL_LIST;

      if (target.length) {
        o = target.pop();
      } else {
        o = document.createElement('canvas');
      }
    } else if (!hash[key]) {
      o = hash[key] = document.createElement('canvas');
    } else {
      o = hash[key];
    } // o.setAttribute('width', width + 'px');
    // o.setAttribute('height', height + 'px');


    o.width = width;
    o.height = height;

    if (typeof karas !== 'undefined' && karas.debug) {
      o.style.width = width + 'px';
      o.style.height = height + 'px';
      o.setAttribute('type', hash === CANVAS ? 'canvas' : 'webgl');

      if (key) {
        o.setAttribute('key', key);
      }

      if (message) {
        o.setAttribute('message', message);
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
        if (hash === CANVAS) {
          CANVAS_LIST.push(this.canvas);
        } else {
          WEBGL_LIST.push(this.canvas);
        }

        this.canvas = null;
        this.ctx = null;
      }
    };
  }

  function cacheCanvas(key, width, height, message) {
    return cache(key, width, height, CANVAS, message);
  }

  function cacheWebgl(key, width, height, message) {
    return cache(key, width, height, WEBGL, message);
  }

  var IMG = {};
  var INIT = 0;
  var LOADING = 1;
  var LOADED = 2;
  var inject = {
    measureText: function measureText() {
      var list = textCache.list,
          data = textCache.data;
      var html = '';
      var keys = [];
      var chars = [];
      Object.keys(data).forEach(function (i) {
        var _data$i = data[i],
            key = _data$i.key,
            style = _data$i.style,
            s = _data$i.s;

        if (s) {
          var inline = "position:absolute;font-family:".concat(style[FONT_FAMILY], ";font-size:").concat(style[FONT_SIZE], "px;font-weight:").concat(style[FONT_WEIGHT]);

          for (var j = 0, len = s.length; j < len; j++) {
            keys.push(key);

            var _char = s.charAt(j);

            chars.push(_char);
            html += "<span style=\"".concat(inline, "\">").concat(_char.replace(/</, '&lt;').replace(' ', '&nbsp;'), "</span>");
          }
        }
      });

      if (!html) {
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
      var charWidth = textCache.charWidth;

      for (var i = 0, len = cns.length; i < len; i++) {
        var node = cns[i];
        var key = keys[i];
        var _char2 = chars[i]; // clientWidth只返回ceil整数，精度必须用getComputedStyle

        var css = window.getComputedStyle(node, null);
        charWidth[key][_char2] = parseFloat(css.width);
      }

      list.forEach(function (text) {
        return text.__measureCb();
      });
      textCache.list = [];
      textCache.data = {};
      document.body.removeChild(div);
    },
    IMG: IMG,
    INIT: INIT,
    LOADED: LOADED,
    LOADING: LOADING,
    measureImg: function measureImg(url, cb) {
      if (Array.isArray(url)) {
        var count = 0;
        var len = url.length;
        var list = [];
        url.forEach(function (item, i) {
          inject.measureImg(item, function (cache) {
            list[i] = cache;

            if (++count === len) {
              cb(list);
            }
          });
        });
        return;
      } else if (!url || !util.isString(url)) {
        inject.error('Measure img invalid: ' + url);
        cb && cb({
          state: LOADED,
          success: false,
          url: url
        });
        return;
      }

      var cache = IMG[url] = IMG[url] || {
        state: INIT,
        task: []
      };

      if (cache.state === LOADED) {
        cb && cb(cache);
      } else if (cache.state === LOADING) {
        cb && cache.task.push(cb);
      } else {
        cache.state = LOADING;
        cb && cache.task.push(cb);
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

        img.onerror = function (e) {
          inject.error('Measure img failed: ' + url);
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

        if (typeof karas !== 'undefined' && karas.debug) {
          document.body.appendChild(img);
        }
      }
    },
    warn: function warn(s) {
      console.warn(s);
    },
    error: function error(s) {
      console.error(s);
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
      if (!cb) {
        return;
      }

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
    getCacheCanvas: function getCacheCanvas(width, height, key, message) {
      return cacheCanvas(key, width, height, message);
    },
    releaseCacheCanvas: function releaseCacheCanvas(o) {
      CANVAS_LIST.push(o);
    },
    delCacheCanvas: function delCacheCanvas(key) {
      key && delete CANVAS[key];
    },
    hasCacheWebgl: function hasCacheWebgl(key) {
      return key && WEBGL.hasOwnProperty(key);
    },
    getCacheWebgl: function getCacheWebgl(width, height, key, message) {
      return cacheWebgl(key, width, height, message);
    },
    releaseCacheWebgl: function releaseCacheWebgl(o) {
      WEBGL_LIST.push(o);
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

        if (typeof window !== 'undefined' && window.OffscreenCanvas && o instanceof window.OffscreenCanvas) {
          return true;
        }

        if (util.isFunction(o.getElementsByTagName)) {
          return true;
        }
      }

      return false;
    }
  };

  var STYLE_KEY$2 = enums.STYLE_KEY;
  var KEY_COLOR = [[STYLE_KEY$2.BACKGROUND_COLOR], [STYLE_KEY$2.BORDER_BOTTOM_COLOR], [STYLE_KEY$2.BORDER_LEFT_COLOR], [STYLE_KEY$2.BORDER_RIGHT_COLOR], [STYLE_KEY$2.BORDER_TOP_COLOR], [STYLE_KEY$2.COLOR]];
  var KEY_LENGTH = [[STYLE_KEY$2.FONT_SIZE], [STYLE_KEY$2.BORDER_BOTTOM_WIDTH], [STYLE_KEY$2.BORDER_LEFT_WIDTH], [STYLE_KEY$2.BORDER_RIGHT_WIDTH], [STYLE_KEY$2.BORDER_TOP_WIDTH], [STYLE_KEY$2.LEFT], [STYLE_KEY$2.TOP], [STYLE_KEY$2.RIGHT], [STYLE_KEY$2.BOTTOM], [STYLE_KEY$2.FLEX_BASIS], [STYLE_KEY$2.WIDTH], [STYLE_KEY$2.HEIGHT], [STYLE_KEY$2.LINE_HEIGHT], [STYLE_KEY$2.MARGIN_BOTTOM], [STYLE_KEY$2.MARGIN_LEFT], [STYLE_KEY$2.MARGIN_TOP], [STYLE_KEY$2.MARGIN_RIGHT], [STYLE_KEY$2.PADDING_TOP], [STYLE_KEY$2.PADDING_RIGHT], [STYLE_KEY$2.PADDING_BOTTOM], [STYLE_KEY$2.PADDING_LEFT], [STYLE_KEY$2.STROKE_WIDTH], [STYLE_KEY$2.STROKE_MITERLIMIT], [STYLE_KEY$2.LETTER_SPACING]];
  var KEY_GRADIENT = [[STYLE_KEY$2.BACKGROUND_IMAGE], [STYLE_KEY$2.FILL], [STYLE_KEY$2.STROKE]];
  var KEY_RADIUS = [[STYLE_KEY$2.BORDER_TOP_LEFT_RADIUS], [STYLE_KEY$2.BORDER_TOP_RIGHT_RADIUS], [STYLE_KEY$2.BORDER_BOTTOM_RIGHT_RADIUS], [STYLE_KEY$2.BORDER_BOTTOM_LEFT_RADIUS]];
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
    radial: true,
    conic: true
  };
  var KEY_EXPAND = [[STYLE_KEY$2.TRANSLATE_X], [STYLE_KEY$2.TRANSLATE_Y], [STYLE_KEY$2.SKEW_X], [STYLE_KEY$2.SKEW_Y], [STYLE_KEY$2.SCALE_X], [STYLE_KEY$2.SCALE_Y], [STYLE_KEY$2.ROTATE_Z]];
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

  var _REPAINT, _MEASURE;
  var RESET_DOM = reset.DOM,
      RESET_GEOM = reset.GEOM;
  var INHERIT$1 = unit.INHERIT;
  var STYLE_KEY$3 = enums.STYLE_KEY;
  var GEOM$1 = {};
  var GEOM_KEY_SET$1 = [];

  var IGNORE = _defineProperty({}, STYLE_KEY$3.POINTER_EVENTS, true);

  var REPAINT = (_REPAINT = {}, _defineProperty(_REPAINT, STYLE_KEY$3.TRANSFORM, true), _defineProperty(_REPAINT, STYLE_KEY$3.TRANSLATE_X, true), _defineProperty(_REPAINT, STYLE_KEY$3.TRANSLATE_Y, true), _defineProperty(_REPAINT, STYLE_KEY$3.SKEW_X, true), _defineProperty(_REPAINT, STYLE_KEY$3.SKEW_Y, true), _defineProperty(_REPAINT, STYLE_KEY$3.SCALE_X, true), _defineProperty(_REPAINT, STYLE_KEY$3.SCALE_Y, true), _defineProperty(_REPAINT, STYLE_KEY$3.ROTATE_Z, true), _defineProperty(_REPAINT, STYLE_KEY$3.COLOR, true), _defineProperty(_REPAINT, STYLE_KEY$3.FONT_STYLE, true), _defineProperty(_REPAINT, STYLE_KEY$3.STROKE_WIDTH, true), _defineProperty(_REPAINT, STYLE_KEY$3.FILL, true), _defineProperty(_REPAINT, STYLE_KEY$3.STROKE_DASHARRAY, true), _defineProperty(_REPAINT, STYLE_KEY$3.STROKE_LINECAP, true), _defineProperty(_REPAINT, STYLE_KEY$3.STROKE_LINEJOIN, true), _defineProperty(_REPAINT, STYLE_KEY$3.STROKE_MITERLIMIT, true), _defineProperty(_REPAINT, STYLE_KEY$3.BACKGROUND_COLOR, true), _defineProperty(_REPAINT, STYLE_KEY$3.BACKGROUND_IMAGE, true), _defineProperty(_REPAINT, STYLE_KEY$3.BACKGROUND_POSITION_X, true), _defineProperty(_REPAINT, STYLE_KEY$3.BACKGROUND_POSITION_Y, true), _defineProperty(_REPAINT, STYLE_KEY$3.BACKGROUND_REPEAT, true), _defineProperty(_REPAINT, STYLE_KEY$3.BACKGROUND_SIZE, true), _defineProperty(_REPAINT, STYLE_KEY$3.STROKE, true), _defineProperty(_REPAINT, STYLE_KEY$3.BORDER_BOTTOM_COLOR, true), _defineProperty(_REPAINT, STYLE_KEY$3.BORDER_LEFT_COLOR, true), _defineProperty(_REPAINT, STYLE_KEY$3.BORDER_RIGHT_COLOR, true), _defineProperty(_REPAINT, STYLE_KEY$3.BORDER_TOP_COLOR, true), _defineProperty(_REPAINT, STYLE_KEY$3.BORDER_TOP_LEFT_RADIUS, true), _defineProperty(_REPAINT, STYLE_KEY$3.BORDER_TOP_RIGHT_RADIUS, true), _defineProperty(_REPAINT, STYLE_KEY$3.BORDER_BOTTOM_RIGHT_RADIUS, true), _defineProperty(_REPAINT, STYLE_KEY$3.BORDER_BOTTOM_LEFT_RADIUS, true), _defineProperty(_REPAINT, STYLE_KEY$3.VISIBILITY, true), _defineProperty(_REPAINT, STYLE_KEY$3.OPACITY, true), _defineProperty(_REPAINT, STYLE_KEY$3.Z_INDEX, true), _defineProperty(_REPAINT, STYLE_KEY$3.FILTER, true), _defineProperty(_REPAINT, STYLE_KEY$3.BOX_SHADOW, true), _defineProperty(_REPAINT, STYLE_KEY$3.OVERFLOW, true), _defineProperty(_REPAINT, STYLE_KEY$3.BACKGROUND_CLIP, true), _REPAINT);
  var MEASURE = (_MEASURE = {}, _defineProperty(_MEASURE, STYLE_KEY$3.FONT_SIZE, true), _defineProperty(_MEASURE, STYLE_KEY$3.FONT_WEIGHT, true), _defineProperty(_MEASURE, STYLE_KEY$3.FONT_FAMILY, true), _MEASURE);
  var o = {
    GEOM: GEOM$1,
    GEOM_KEY_SET: GEOM_KEY_SET$1,
    IGNORE: IGNORE,
    REPAINT: REPAINT,
    MEASURE: MEASURE,
    addGeom: function addGeom(tagName, ks, cb) {
      if (Array.isArray(ks)) {
        ks.forEach(function (k) {
          o.addGeom(tagName, k, cb);
        });
      } else if (ks) {
        if (!GEOM$1.hasOwnProperty(ks)) {
          GEOM_KEY_SET$1.push(ks);
        }

        var hash = GEOM$1[ks] = GEOM$1[ks] || {};
        hash[tagName] = cb || true;
      }
    }
  };

  o.isIgnore = function (k) {
    return IGNORE.hasOwnProperty(k);
  };

  function isGeom(tagName, k) {
    return GEOM$1.hasOwnProperty(k) && GEOM$1[k].hasOwnProperty(tagName);
  }

  o.isGeom = isGeom;

  o.isRepaint = function (k) {
    return REPAINT.hasOwnProperty(k) || isGeom(k);
  };

  o.isMeasure = function (k) {
    return MEASURE.hasOwnProperty(k);
  };

  o.isValid = function (tagName, k) {
    if (!k) {
      return false;
    }

    if (RESET_DOM.hasOwnProperty(k)) {
      return true;
    } // geom的fill等矢量才有的样式


    if (tagName.charAt(0) === '$' && RESET_GEOM.hasOwnProperty(k)) {
      return true;
    }

    if (GEOM$1.hasOwnProperty(k)) {
      return GEOM$1[k].hasOwnProperty(tagName);
    }

    return false;
  };

  var MEASURE_KEY_SET = o.MEASURE_KEY_SET = Object.keys(MEASURE).map(function (i) {
    return parseInt(i);
  });
  var len = MEASURE_KEY_SET.length;

  o.isMeasureInherit = function (target) {
    for (var i = 0; i < len; i++) {
      var k = MEASURE_KEY_SET[i];

      if (target.hasOwnProperty(k) && target[k][1] === INHERIT$1) {
        return true;
      }
    }

    return false;
  };

  o.measureInheritList = function (target) {
    var list = [];

    for (var i = 0; i < len; i++) {
      var k = MEASURE_KEY_SET[i];

      if (target.hasOwnProperty(k) && target[k][1] === INHERIT$1) {
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

  var _VALUE$1, _ARRAY_$1, _ARRAY_0_$1;
  var STYLE_KEY$4 = enums.STYLE_KEY,
      STYLE_RV_KEY$1 = enums.STYLE_RV_KEY,
      style2Upper$1 = enums.style2Upper,
      _enums$STYLE_KEY$2 = enums.STYLE_KEY,
      POSITION = _enums$STYLE_KEY$2.POSITION,
      WIDTH$1 = _enums$STYLE_KEY$2.WIDTH,
      HEIGHT$1 = _enums$STYLE_KEY$2.HEIGHT,
      TRANSLATE_X = _enums$STYLE_KEY$2.TRANSLATE_X,
      TRANSLATE_Y = _enums$STYLE_KEY$2.TRANSLATE_Y,
      SCALE_X = _enums$STYLE_KEY$2.SCALE_X,
      SCALE_Y = _enums$STYLE_KEY$2.SCALE_Y,
      SKEW_X = _enums$STYLE_KEY$2.SKEW_X,
      SKEW_Y = _enums$STYLE_KEY$2.SKEW_Y,
      ROTATE_Z = _enums$STYLE_KEY$2.ROTATE_Z,
      TRANSFORM$1 = _enums$STYLE_KEY$2.TRANSFORM,
      TRANSFORM_ORIGIN$1 = _enums$STYLE_KEY$2.TRANSFORM_ORIGIN,
      BACKGROUND_IMAGE = _enums$STYLE_KEY$2.BACKGROUND_IMAGE,
      BACKGROUND_COLOR = _enums$STYLE_KEY$2.BACKGROUND_COLOR,
      BACKGROUND_POSITION_X = _enums$STYLE_KEY$2.BACKGROUND_POSITION_X,
      BACKGROUND_POSITION_Y = _enums$STYLE_KEY$2.BACKGROUND_POSITION_Y,
      BACKGROUND_SIZE = _enums$STYLE_KEY$2.BACKGROUND_SIZE,
      OPACITY = _enums$STYLE_KEY$2.OPACITY,
      Z_INDEX = _enums$STYLE_KEY$2.Z_INDEX,
      COLOR = _enums$STYLE_KEY$2.COLOR,
      FONT_SIZE$1 = _enums$STYLE_KEY$2.FONT_SIZE,
      FONT_FAMILY$1 = _enums$STYLE_KEY$2.FONT_FAMILY,
      FONT_WEIGHT$1 = _enums$STYLE_KEY$2.FONT_WEIGHT,
      FONT_STYLE = _enums$STYLE_KEY$2.FONT_STYLE,
      LINE_HEIGHT = _enums$STYLE_KEY$2.LINE_HEIGHT,
      TEXT_ALIGN = _enums$STYLE_KEY$2.TEXT_ALIGN,
      FILTER = _enums$STYLE_KEY$2.FILTER,
      VISIBILITY = _enums$STYLE_KEY$2.VISIBILITY,
      BOX_SHADOW = _enums$STYLE_KEY$2.BOX_SHADOW,
      POINTER_EVENTS = _enums$STYLE_KEY$2.POINTER_EVENTS,
      FILL = _enums$STYLE_KEY$2.FILL,
      STROKE = _enums$STYLE_KEY$2.STROKE,
      STROKE_WIDTH = _enums$STYLE_KEY$2.STROKE_WIDTH,
      STROKE_DASHARRAY = _enums$STYLE_KEY$2.STROKE_DASHARRAY,
      BORDER_TOP_WIDTH = _enums$STYLE_KEY$2.BORDER_TOP_WIDTH,
      BORDER_RIGHT_WIDTH = _enums$STYLE_KEY$2.BORDER_RIGHT_WIDTH,
      BORDER_BOTTOM_WIDTH = _enums$STYLE_KEY$2.BORDER_BOTTOM_WIDTH,
      BORDER_LEFT_WIDTH = _enums$STYLE_KEY$2.BORDER_LEFT_WIDTH,
      DISPLAY = _enums$STYLE_KEY$2.DISPLAY,
      FLEX_DIRECTION = _enums$STYLE_KEY$2.FLEX_DIRECTION,
      FLEX_GROW = _enums$STYLE_KEY$2.FLEX_GROW,
      FLEX_SHRINK = _enums$STYLE_KEY$2.FLEX_SHRINK,
      FLEX_BASIS = _enums$STYLE_KEY$2.FLEX_BASIS,
      JUSTIFY_CONTENT = _enums$STYLE_KEY$2.JUSTIFY_CONTENT,
      ALIGN_SELF = _enums$STYLE_KEY$2.ALIGN_SELF,
      ALIGN_ITEMS = _enums$STYLE_KEY$2.ALIGN_ITEMS,
      MATRIX = _enums$STYLE_KEY$2.MATRIX,
      LETTER_SPACING = _enums$STYLE_KEY$2.LETTER_SPACING,
      BACKGROUND_CLIP = _enums$STYLE_KEY$2.BACKGROUND_CLIP;
  var AUTO = unit.AUTO,
      PX$1 = unit.PX,
      PERCENT$1 = unit.PERCENT,
      NUMBER = unit.NUMBER,
      INHERIT$2 = unit.INHERIT,
      DEG = unit.DEG,
      RGBA = unit.RGBA,
      STRING = unit.STRING;
  var isNil$3 = util.isNil,
      rgba2int$2 = util.rgba2int,
      equalArr$1 = util.equalArr;
  var MEASURE_KEY_SET$1 = o.MEASURE_KEY_SET,
      isGeom$1 = o.isGeom,
      GEOM$2 = o.GEOM,
      GEOM_KEY_SET$2 = o.GEOM_KEY_SET;
  var DEFAULT_FONT_SIZE = 16;
  var COLOR_HASH$1 = key.COLOR_HASH,
      LENGTH_HASH$1 = key.LENGTH_HASH,
      RADIUS_HASH$1 = key.RADIUS_HASH,
      GRADIENT_HASH$1 = key.GRADIENT_HASH,
      EXPAND_HASH$1 = key.EXPAND_HASH,
      GRADIENT_TYPE$1 = key.GRADIENT_TYPE;
  var TRANSFORM_HASH = {
    'translateX': TRANSLATE_X,
    'translateY': TRANSLATE_Y,
    'scaleX': SCALE_X,
    'scaleY': SCALE_Y,
    'skewX': SKEW_X,
    'skewY': SKEW_Y,
    'rotateZ': ROTATE_Z,
    'rotate': ROTATE_Z
  };
  /**
   * 通用的格式化计算数值单位的方法，百分比像素auto和纯数字，直接修改传入对象本身
   * @param res 待计算的样式对象
   * @param k 对象的key
   * @param v 对象的value
   * @returns 格式化好的样式对象本身
   */

  function calUnit(res, k, v) {
    if (v === 'auto') {
      res[k] = [0, AUTO];
    } else if (v === 'inherit') {
      res[k] = [0, INHERIT$2];
    } else if (/%$/.test(v)) {
      v = parseFloat(v) || 0;
      res[k] = [v, PERCENT$1];
    } else if (/px$/i.test(v)) {
      v = parseFloat(v) || 0;
      res[k] = [v, PX$1];
    } else if (/deg$/i.test(v)) {
      v = parseFloat(v) || 0;
      res[k] = [v, DEG];
    } else {
      v = parseFloat(v) || 0;
      res[k] = [v, NUMBER];
    } // border等相关不能为负值


    if (k === BORDER_LEFT_WIDTH || k === BORDER_TOP_WIDTH || k === BORDER_RIGHT_WIDTH || k === BORDER_BOTTOM_WIDTH || k === WIDTH$1 || k === HEIGHT$1 || k === FLEX_BASIS) {
      res[k][0] = Math.max(res[k][0], 0);
    }

    return res;
  }

  function compatibleTransform(k, arr) {
    if (k === SCALE_X || k === SCALE_Y) {
      arr[1] = NUMBER;
    } else if (k === TRANSLATE_X || k === TRANSLATE_Y) {
      if (arr[1] === NUMBER) {
        arr[1] = PX$1;
      }
    } else {
      if (arr[1] === NUMBER) {
        arr[1] = DEG;
      }
    }
  }
  /**
   * 将传入的手写style标准化，并且用reset默认值覆盖其中为空的
   * @param style 手写的style样式
   * @param reset 默认样式，可选
   * @returns Object 标准化的枚举数组结构样式
   */


  function normalize(style) {
    var reset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    if (!util.isObject(style)) {
      return {};
    }

    var res = {}; // style只有单层无需深度clone

    style = util.extend({}, style); // 缩写提前处理，因为reset里没有缩写

    var temp = style.border;

    if (temp) {
      abbr.toFull(style, 'border');
    }

    ['borderTop', 'borderRight', 'borderBottom', 'borderLeft'].forEach(function (k) {
      abbr.toFull(style, k);
    });
    temp = style.borderWidth;

    if (temp) {
      abbr.toFull(style, 'borderWidth');
    }

    temp = style.borderColor;

    if (temp) {
      abbr.toFull(style, 'borderColor');
    }

    temp = style.borderStyle;

    if (temp) {
      abbr.toFull(style, 'borderStyle');
    }

    temp = style.borderRadius;

    if (temp) {
      abbr.toFull(style, 'borderRadius');
    }

    temp = style.background; // 处理渐变背景缩写

    if (temp) {
      abbr.toFull(style, 'background');
    } // 背景位置


    temp = style.backgroundPosition;

    if (!isNil$3(temp)) {
      abbr.toFull(style, 'backgroundPosition');
    } // flex


    temp = style.flex;

    if (temp) {
      abbr.toFull(style, 'flex');
    }

    temp = style.margin;

    if (!isNil$3(temp)) {
      abbr.toFull(style, 'margin');
    }

    temp = style.padding;

    if (!isNil$3(temp)) {
      abbr.toFull(style, 'padding');
    } // 扩展css，将transform几个值拆分为独立的css为动画准备，同时不能使用transform


    ['translate', 'scale', 'skew'].forEach(function (k) {
      temp = style[k];

      if (!isNil$3(temp)) {
        abbr.toFull(style, k);
      }
    });
    temp = style.rotate;

    if (!isNil$3(temp)) {
      abbr.toFull(style, 'rotate');
    } // 扩展的不能和transform混用，给出警告


    ['translateX', 'translateY', 'scaleX', 'scaleY', 'skewX', 'skewY', 'rotateZ'].forEach(function (k) {
      var v = style[k];

      if (!isNil$3(v) && style.transform) {
        inject.warn("Can not use expand style \"".concat(k, "\" with transform"));
      }
    }); // 默认reset，根据传入不同，当style为空时覆盖

    reset.forEach(function (item) {
      var k = item.k,
          v = item.v;

      if (isNil$3(style[k])) {
        style[k] = v;
      }
    }); // 背景图

    temp = style.backgroundImage;

    if (temp !== undefined) {
      if (!temp) {
        res[BACKGROUND_IMAGE] = [null];
      } else if (Array.isArray(temp)) {
        res[BACKGROUND_IMAGE] = temp.map(function (item) {
          if (!item) {
            return null;
          }

          if (reg.gradient.test(item)) {
            return gradient.parseGradient(item);
          }

          if (reg.img.test(item)) {
            return reg.img.exec(item)[2];
          }

          return null;
        });
      } // 区分是渐变色还是图
      else if (reg.gradient.test(temp)) {
          res[BACKGROUND_IMAGE] = [gradient.parseGradient(temp)];
        } else if (reg.img.test(temp)) {
          res[BACKGROUND_IMAGE] = [reg.img.exec(temp)[2]];
        } else {
          res[BACKGROUND_IMAGE] = [null];
        }
    }

    temp = style.backgroundColor;

    if (temp) {
      // 先赋值默认透明，后续操作有合法值覆盖
      var bgc = /^#[0-9a-f]{3,8}/i.exec(temp);

      if (bgc && [4, 7, 9].indexOf(bgc[0].length) > -1) {
        res[BACKGROUND_COLOR] = [rgba2int$2(bgc[0]), RGBA];
      } else {
        bgc = /rgba?\s*\(.+\)/i.exec(temp);
        res[BACKGROUND_COLOR] = [rgba2int$2(bgc ? bgc[0] : [0, 0, 0, 0]), RGBA];
      }
    }

    ['backgroundPositionX', 'backgroundPositionY'].forEach(function (k, i) {
      temp = style[k];

      if (!isNil$3(temp)) {
        k = i ? BACKGROUND_POSITION_Y : BACKGROUND_POSITION_X;

        if (Array.isArray(temp)) {
          if (temp.length) {
            res[k] = temp.map(function (item) {
              if (/%$/.test(item) || /px$/i.test(item) || /^-?[\d.]+$/.test(item)) {
                var v = [];
                calUnit(v, 0, item);

                if (v[0][1] === NUMBER) {
                  v[0][1] = PX$1;
                }

                return v[0];
              } else {
                return [{
                  top: 0,
                  left: 0,
                  center: 50,
                  right: 100,
                  bottom: 100
                }[item] || 0, PERCENT$1];
              }
            });
          } else {
            res[k] = [0, PERCENT$1];
          }
        } else if (/%$/.test(temp) || /px$/i.test(temp) || /^-?[\d.]+$/.test(temp)) {
          calUnit(res, k, temp);
          temp = res[k];

          if (temp[1] === NUMBER) {
            temp[1] = PX$1;
          }

          res[k] = [temp];
        } else {
          res[k] = [[{
            top: 0,
            left: 0,
            center: 50,
            right: 100,
            bottom: 100
          }[temp] || 0, PERCENT$1]];
        }
      }
    }); // 背景尺寸

    temp = style.backgroundSize;

    if (temp) {
      var bs = res[BACKGROUND_SIZE] = [];

      if (Array.isArray(temp)) {
        if (temp.length) {
          bs = temp.map(function (item) {
            if (!item) {
              return [[0, AUTO], [0, AUTO]];
            }

            var match = item.toString().match(/\b(?:(-?[\d.]+(px|%)?)|(contain|cover|auto))/ig);

            if (match) {
              if (match.length === 1) {
                if (match[0] === 'contain' || match[0] === 'cover') {
                  match[1] = match[0];
                } else {
                  match[1] = 'auto';
                }
              }

              var v = [];

              for (var i = 0; i < 2; i++) {
                var _item = match[i];

                if (/%$/.test(_item) || /px$/i.test(_item) || /^-?[\d.]+$/.test(_item)) {
                  calUnit(v, i, _item);

                  if (v[i][1] === NUMBER) {
                    v[i][1] = PX$1;
                  }
                } else if (_item === '0' || _item === 0) {
                  v.push([0, PX$1]);
                } else if (_item === 'contain' || _item === 'cover') {
                  v.push([_item, STRING]);
                } else {
                  v.push([0, AUTO]);
                }
              }

              return v;
            } else {
              return [[0, AUTO], [0, AUTO]];
            }
          });
        } else {
          bs.push([[0, AUTO], [0, AUTO]]);
        }
      } else {
        var match = temp.toString().match(/\b(?:(-?[\d.]+(px|%)?)|(contain|cover|auto))/ig);

        if (match) {
          if (match.length === 1) {
            if (match[0] === 'contain' || match[0] === 'cover') {
              match[1] = match[0];
            } else {
              match[1] = 'auto';
            }
          }

          var v = [];

          for (var i = 0; i < 2; i++) {
            var item = match[i];

            if (/%$/.test(item) || /px$/i.test(item) || /^-?[\d.]+$/.test(item)) {
              calUnit(v, i, item);

              if (v[i][1] === NUMBER) {
                v[i][1] = PX$1;
              }
            } else if (item === '0' || item === 0) {
              v.push([0, PX$1]);
            } else if (item === 'contain' || item === 'cover') {
              v.push([item, STRING]);
            } else {
              v.push([0, AUTO]);
            }
          }

          bs.push(v);
        } else {
          bs.push([[0, AUTO], [0, AUTO]]);
        }
      }
    } // border-color


    ['Top', 'Right', 'Bottom', 'Left'].forEach(function (k) {
      k = 'border' + k + 'Color';
      var v = style[k];

      if (!isNil$3(v)) {
        res[STYLE_KEY$4[style2Upper$1(k)]] = [rgba2int$2(v), RGBA];
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
          var _item2 = arr[_i];

          if (/%$/.test(_item2) || /px$/i.test(_item2) || /^-?[\d.]+$/.test(_item2)) {
            calUnit(arr, _i, _item2);

            if (arr[_i][1] === NUMBER) {
              arr[_i][1] = PX$1;
            }
          } else {
            arr[_i] = [0, PX$1];
          }
        }

        res[STYLE_KEY$4[style2Upper$1(k)]] = arr;
      }
    });
    temp = style.transform;

    if (temp) {
      var transform = res[TRANSFORM$1] = [];

      var _match = (temp || '').toString().match(/\w+\(.+?\)/g);

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
              transform.push([MATRIX, arr]);
            }
          } else if (TRANSFORM_HASH.hasOwnProperty(k)) {
            var k2 = TRANSFORM_HASH[k];

            var _arr = calUnit([k2, v], 1, v);

            compatibleTransform(k2, _arr[1]);
            transform.push(_arr);
          } else if ({
            translate: true,
            scale: true,
            skew: true
          }.hasOwnProperty(k)) {
            var _arr2 = v.toString().split(/\s*,\s*/);

            if (_arr2.length === 1) {
              _arr2[1] = _arr2[0].slice(0);
            }

            var k1 = STYLE_KEY$4[style2Upper$1(k + 'X')];
            var _k = STYLE_KEY$4[style2Upper$1(k + 'Y')];
            var arr1 = calUnit([k1, _arr2[0]], 1, _arr2[0]);
            var arr2 = calUnit([_k, _arr2[1]], 1, _arr2[1]);
            compatibleTransform(k1, arr1[1]);
            compatibleTransform(_k, arr2[1]);
            transform.push(arr1);
            transform.push(arr2);
          }
        });
      }
    }

    temp = style.transformOrigin;

    if (!isNil$3(temp)) {
      var tfo = res[TRANSFORM_ORIGIN$1] = [];

      var _match2 = temp.toString().match(reg.position);

      if (_match2) {
        if (_match2.length === 1) {
          _match2[1] = _match2[0];
        }

        for (var _i2 = 0; _i2 < 2; _i2++) {
          var _item3 = _match2[_i2];

          if (/%$/.test(_item3) || /px$/i.test(_item3) || /^-?[\d.]+$/.test(_item3)) {
            calUnit(tfo, _i2, _item3);

            if (tfo[_i2][1] === NUMBER) {
              tfo[_i2][1] = PX$1;
            }
          } else {
            tfo.push([{
              top: 0,
              left: 0,
              center: 50,
              right: 100,
              bottom: 100
            }[_item3], PERCENT$1]); // 不规范的写法变默认值50%

            if (isNil$3(tfo[_i2][0])) {
              tfo[_i2][0] = 50;
            }
          }
        }
      } else {
        tfo.push([50, PERCENT$1]);
        tfo.push([50, PERCENT$1]);
      }
    }

    ['translateX', 'translateY', 'scaleX', 'scaleY', 'skewX', 'skewY', 'rotateZ', 'rotate'].forEach(function (k) {
      var v = style[k];

      if (isNil$3(v)) {
        return;
      }

      var k2 = TRANSFORM_HASH[k];
      calUnit(res, k2, v); // 没有单位或默认值处理单位

      compatibleTransform(k2, res[k2]);
    });
    temp = style.opacity;

    if (!isNil$3(temp)) {
      temp = parseFloat(temp);

      if (!isNaN(temp)) {
        temp = Math.max(temp, 0);
        temp = Math.min(temp, 1);
        res[OPACITY] = temp;
      } else {
        res[OPACITY] = 1;
      }
    }

    temp = style.zIndex;

    if (!isNil$3(temp)) {
      res[Z_INDEX] = parseInt(temp) || 0;
    } // 转化不同单位值为对象标准化，不写单位的变成number单位转化为px


    ['marginTop', 'marginRight', 'marginBottom', 'marginLeft', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'top', 'right', 'bottom', 'left', 'width', 'height', 'flexBasis' // 'strokeWidth',
    ].forEach(function (k) {
      var v = style[k];

      if (isNil$3(v)) {
        return;
      }

      var k2 = STYLE_KEY$4[style2Upper$1(k)];
      calUnit(res, k2, v);
      v = res[k2]; // 无单位视为px

      if (v[1] === NUMBER) {
        v[1] = PX$1;
      } // 限制padding/border为正数


      if ({
        paddingTop: true,
        paddingRight: true,
        paddingBottom: true,
        paddingLeft: true,
        borderTopWidth: true,
        borderRightWidth: true,
        borderBottomWidth: true,
        borderLeftWidth: true,
        width: true,
        height: true
      }.hasOwnProperty(k) && v[0] < 0) {
        v[0] = 0;
      }
    });
    temp = style.color;

    if (!isNil$3(temp)) {
      if (temp === 'inherit') {
        res[COLOR] = [[], INHERIT$2];
      } else {
        res[COLOR] = [rgba2int$2(temp), RGBA];
      }
    }

    temp = style.fontSize;

    if (temp || temp === 0) {
      if (temp === 'inherit') {
        res[FONT_SIZE$1] = [0, INHERIT$2];
      } else if (/%$/.test(temp)) {
        var _v = Math.max(0, parseFloat(temp));

        if (_v) {
          res[FONT_SIZE$1] = [_v, PERCENT$1];
        } else {
          res[FONT_SIZE$1] = [DEFAULT_FONT_SIZE, PX$1];
        }
      } else {
        res[FONT_SIZE$1] = [Math.max(0, parseFloat(temp)) || DEFAULT_FONT_SIZE, PX$1];
      }
    }

    temp = style.fontWeight;

    if (!isNil$3(temp)) {
      if (temp === 'bold') {
        res[FONT_WEIGHT$1] = [700, NUMBER];
      } else if (temp === 'normal') {
        res[FONT_WEIGHT$1] = [400, NUMBER];
      } else if (temp === 'lighter') {
        res[FONT_WEIGHT$1] = [200, NUMBER];
      } else if (temp === 'inherit') {
        res[FONT_WEIGHT$1] = [0, INHERIT$2];
      } else {
        res[FONT_WEIGHT$1] = [Math.max(0, parseInt(temp)) || 400, NUMBER];
      }
    }

    temp = style.fontStyle;

    if (temp) {
      if (temp === 'inherit') {
        res[FONT_STYLE] = [0, INHERIT$2];
      } else {
        res[FONT_STYLE] = [temp, STRING];
      }
    }

    temp = style.fontFamily;

    if (temp) {
      if (temp === 'inherit') {
        res[FONT_FAMILY$1] = [0, INHERIT$2];
      } else {
        // 统一文字声明格式
        res[FONT_FAMILY$1] = [temp.replace(/['"]/, '').replace(/\s*,\s*/g, ','), STRING];
      }
    }

    temp = style.textAlign;

    if (temp) {
      if (temp === 'inherit') {
        res[TEXT_ALIGN] = [0, INHERIT$2];
      } else {
        res[TEXT_ALIGN] = [temp, STRING];
      }
    }

    temp = style.lineHeight;

    if (temp !== undefined) {
      if (temp === 'inherit') {
        res[LINE_HEIGHT] = [0, INHERIT$2];
      } else if (temp === 'normal') {
        res[LINE_HEIGHT] = [0, AUTO];
      } // lineHeight默认数字，想要px必须强制带单位
      else if (/px$/i.test(temp)) {
          res[LINE_HEIGHT] = [parseFloat(temp), PX$1];
        } else {
          var n = Math.max(0, parseFloat(temp)) || 'normal'; // 非法数字

          if (n === 'normal') {
            res[LINE_HEIGHT] = [null, AUTO];
          } else {
            res[LINE_HEIGHT] = [n, NUMBER];
          }
        }
    }

    temp = style.letterSpacing;

    if (temp !== undefined) {
      if (temp === 'inherit') {
        res[LETTER_SPACING] = [0, INHERIT$2];
      } else if (temp === 'normal') {
        res[LETTER_SPACING] = [0, PX$1];
      } else if (/px$/i.test(temp)) {
        res[LETTER_SPACING] = [parseFloat(temp), PX$1];
      } else {
        var _n = Math.max(0, parseFloat(temp)) || 0;

        res[LETTER_SPACING] = [_n, PX$1];
      }
    } // fill和stroke为渐变时特殊处理，fillRule无需处理字符串


    temp = style.fill;

    if (temp !== undefined) {
      if (!temp) {
        res[FILL] = ['none'];
      } else if (Array.isArray(temp)) {
        if (temp.length) {
          res[FILL] = temp.map(function (item) {
            if (!item) {
              return 'none';
            } else if (reg.gradient.test(item)) {
              return gradient.parseGradient(item);
            } else {
              return rgba2int$2(item);
            }
          });
        } else {
          res[FILL] = ['none'];
        }
      } else if (reg.gradient.test(temp)) {
        res[FILL] = [gradient.parseGradient(temp)];
      } else {
        res[FILL] = [rgba2int$2(temp)];
      }
    }

    temp = style.stroke;

    if (temp !== undefined) {
      if (!temp) {
        res[STROKE] = ['none'];
      } else if (Array.isArray(temp)) {
        if (temp.length) {
          res[STROKE] = temp.map(function (item) {
            if (!item) {
              return 'none';
            } else if (reg.gradient.test(item)) {
              return gradient.parseGradient(item);
            } else {
              return rgba2int$2(item);
            }
          });
        } else {
          res[STROKE] = ['none'];
        }
      } else if (reg.gradient.test(temp)) {
        res[STROKE] = [gradient.parseGradient(temp)];
      } else {
        res[STROKE] = [rgba2int$2(temp)];
      }
    }

    temp = style.strokeWidth;

    if (!isNil$3(temp)) {
      if (Array.isArray(temp)) {
        if (temp.length) {
          res[STROKE_WIDTH] = temp.map(function (item) {
            var v = [];
            calUnit(v, 0, item);

            if (v[0][1] === NUMBER) {
              v[0][1] = PX$1;
            }

            return v[0];
          });
        } else {
          res[STROKE_WIDTH] = [0, PX$1];
        }
      } else {
        var _v2 = res[STROKE_WIDTH] = [];

        calUnit(_v2, 0, temp);

        if (_v2[0][1] === NUMBER) {
          _v2[0][1] = PX$1;
        }
      }
    }

    temp = style.strokeDasharray;

    if (!isNil$3(temp)) {
      if (Array.isArray(temp)) {
        res[STROKE_DASHARRAY] = temp.map(function (item) {
          var match = item.toString().match(/[\d.]+/g);

          if (match) {
            match = match.map(function (item) {
              return parseFloat(item);
            });

            if (match.length % 2 === 1) {
              match.push(match[match.length - 1]);
            }

            return match;
          }

          return [];
        });
      } else {
        var _match3 = temp.toString().match(/[\d.]+/g);

        if (_match3) {
          _match3 = _match3.map(function (item) {
            return parseFloat(item);
          });

          if (_match3.length % 2 === 1) {
            _match3.push(_match3[_match3.length - 1]);
          }

          res[STROKE_DASHARRAY] = [_match3];
        } else {
          res[STROKE_DASHARRAY] = [[]];
        }
      }
    }

    temp = style.filter;

    if (temp !== undefined) {
      var f = null;
      var blur = /\bblur\s*\(\s*([\d.]+)\s*(?:px)?\s*\)/i.exec(temp || '');

      if (blur) {
        var _v3 = parseFloat(blur[1]) || 0;

        if (_v3) {
          f = [['blur', _v3]];
        }
      }

      res[FILTER] = f;
    }

    temp = style.visibility;

    if (temp) {
      if (temp === 'inherit') {
        res[VISIBILITY] = [0, INHERIT$2];
      } else {
        res[VISIBILITY] = [temp, STRING];
      }
    }

    temp = style.pointerEvents;

    if (temp) {
      if (temp === 'inherit') {
        res[POINTER_EVENTS] = [0, INHERIT$2];
      } else {
        res[POINTER_EVENTS] = [temp, STRING];
      }
    }

    temp = style.boxShadow;

    if (temp !== undefined) {
      var _bs = null;

      var _match4 = (temp || '').match(/(-?[\d.]+(px)?)\s+(-?[\d.]+(px)?)\s+(-?[\d.]+(px)?\s*)?(-?[\d.]+(px)?\s*)?(((transparent)|(#[0-9a-f]{3,8})|(rgba?\(.+?\)))\s*)?(inset|outset)?\s*,?/ig);

      if (_match4) {
        _match4.forEach(function (item) {
          var boxShadow = /(-?[\d.]+(?:px)?)\s+(-?[\d.]+(?:px)?)\s+(-?[\d.]+(?:px)?\s*)?(-?[\d.]+(?:px)?\s*)?(?:((?:transparent)|(?:#[0-9a-f]{3,8})|(?:rgba?\(.+\)))\s*)?(inset|outset)?/i.exec(item);

          if (boxShadow) {
            _bs = _bs || [];
            var _res = [boxShadow[1], boxShadow[2], boxShadow[3] || 0, boxShadow[4] || 0, boxShadow[5] || '#000', boxShadow[6] || 'outset'];

            for (var _i3 = 0; _i3 < 4; _i3++) {
              calUnit(_res, _i3, _res[_i3]); // x/y可以负，blur和spread不行，没有继承且只有px无需保存单位

              if (_i3 > 1 && _res[_i3][0] < 0) {
                _res[_i3] = 0;
              }

              if (_res[_i3][1] === NUMBER) {
                _res[_i3] = _res[_i3][0];
              }
            }

            _res[4] = rgba2int$2(_res[4]);

            _bs.push(_res);
          }
        });
      }

      res[BOX_SHADOW] = _bs;
    } // 直接赋值的string类型


    ['position', 'display', 'flexDirection', 'justifyContent', 'alignItems', 'alignSelf', 'overflow', 'mixBlendMode', 'borderTopStyle', 'borderRightStyle', 'borderBottomStyle', 'borderLeftStyle', 'backgroundClip'].forEach(function (k) {
      if (style.hasOwnProperty(k)) {
        res[STYLE_KEY$4[style2Upper$1(k)]] = style[k];
      }
    }); // 直接赋值的number类型

    ['flexGrow', 'flexShrink', 'zIndex'].forEach(function (k) {
      if (style.hasOwnProperty(k)) {
        res[STYLE_KEY$4[style2Upper$1(k)]] = parseFloat(style[k]) || 0;
      }
    }); // 这些支持多个的用数组表示

    ['backgroundRepeat', 'strokeLinecap', 'strokeLinejoin', 'strokeMiterlimit', 'fillRule'].forEach(function (k) {
      if (style.hasOwnProperty(k)) {
        var _v4 = style[k];
        res[STYLE_KEY$4[style2Upper$1(k)]] = Array.isArray(_v4) ? _v4 : [_v4];
      }
    });
    GEOM_KEY_SET$2.forEach(function (k) {
      if (style.hasOwnProperty(k)) {
        res[k] = style[k];
      }
    });
    return res;
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
    MEASURE_KEY_SET$1.forEach(function (k) {
      var v = currentStyle[k];

      if (v[1] === INHERIT$2) {
        computedStyle[k] = isHost ? reset.INHERIT[STYLE_RV_KEY$1[k]] : parentComputedStyle[k];
      } // 只有fontSize会有%
      else if (v[1] === PERCENT$1) {
          computedStyle[k] = isHost ? reset.INHERIT[STYLE_RV_KEY$1[k]] : parentComputedStyle[k] * v[1] * 0.01;
        } else {
          computedStyle[k] = v[0];
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
    var isRoot = !parent;
    var parentComputedStyle = parent && parent.computedStyle;
    [BORDER_TOP_WIDTH, BORDER_RIGHT_WIDTH, BORDER_BOTTOM_WIDTH, BORDER_LEFT_WIDTH].forEach(function (k) {
      // border-width不支持百分比
      computedStyle[k] = currentStyle[k][1] === PX$1 ? Math.max(0, currentStyle[k][0]) : 0;
    });
    [POSITION, DISPLAY, FLEX_DIRECTION, JUSTIFY_CONTENT, ALIGN_ITEMS, ALIGN_SELF, FLEX_GROW, FLEX_SHRINK, BACKGROUND_CLIP].forEach(function (k) {
      computedStyle[k] = currentStyle[k];
    });
    var textAlign = currentStyle[TEXT_ALIGN];

    if (textAlign[1] === INHERIT$2) {
      computedStyle[TEXT_ALIGN] = isRoot ? 'left' : parentComputedStyle[TEXT_ALIGN];
    } else {
      computedStyle[TEXT_ALIGN] = textAlign[0];
    }

    var lineHeight = currentStyle[LINE_HEIGHT];

    if (lineHeight[1] === INHERIT$2) {
      computedStyle[LINE_HEIGHT] = isRoot ? calNormalLineHeight(computedStyle) : parentComputedStyle[LINE_HEIGHT];
    } // 防止为0
    else if (lineHeight[1] === PX$1) {
        computedStyle[LINE_HEIGHT] = Math.max(lineHeight[0], 0) || calNormalLineHeight(computedStyle);
      } else if (lineHeight[1] === NUMBER) {
        computedStyle[LINE_HEIGHT] = Math.max(lineHeight[0], 0) * computedStyle[FONT_SIZE$1] || calNormalLineHeight(computedStyle);
      } // normal
      else {
          computedStyle[LINE_HEIGHT] = calNormalLineHeight(computedStyle);
        }

    var letterSpacing = currentStyle[LETTER_SPACING];

    if (letterSpacing[1] === INHERIT$2) {
      computedStyle[LETTER_SPACING] = isRoot ? 0 : parentComputedStyle[LETTER_SPACING];
    } else {
      computedStyle[LETTER_SPACING] = letterSpacing[0];
    }
  }

  function setFontStyle(style) {
    var fontSize = style[FONT_SIZE$1];
    return (style[FONT_STYLE] || 'normal') + ' ' + (style[FONT_WEIGHT$1] || '400') + ' ' + fontSize + 'px/' + fontSize + 'px ' + (style[FONT_FAMILY$1] || 'arial');
  }

  function getBaseLine(style) {
    var fontSize = style[FONT_SIZE$1];
    var ff = style[FONT_FAMILY$1].split(',');
    var f = 'arial';

    for (var i = 0, len = ff.length; i < len; i++) {
      if (font.support(ff[i])) {
        f = ff[i];
        break;
      }
    }

    var normal = fontSize * (font.info[f] || font.info.arial).lhr;
    return (style[LINE_HEIGHT] - normal) * 0.5 + fontSize * (font.info[ff] || font.info.arial).blr;
  }

  function calNormalLineHeight(style) {
    var ff = style[FONT_FAMILY$1].split(',');
    var f = 'arial';

    for (var i = 0, len = ff.length; i < len; i++) {
      if (font.support(ff[i])) {
        f = ff[i];
        break;
      }
    }

    return style[FONT_SIZE$1] * (font.info[f] || font.info.arial).lhr;
  }

  function calRelativePercent(n, parent, k) {
    n *= 0.01;

    while (parent) {
      var style = parent.currentStyle[k];

      if (style[1] === AUTO) {
        if (k === WIDTH$1) {
          parent = parent.domParent;
        } else {
          break;
        }
      } else if (style[1] === PX$1) {
        return n * style[0];
      } else if (style[1] === PERCENT$1) {
        n *= style[0] * 0.01;
        parent = parent.domParent;
      }
    }

    return n;
  }

  function calRelative(currentStyle, k, v, parent, isWidth) {
    if (v[1] === AUTO) {
      v = 0;
    } else if ([PX$1, NUMBER, DEG, RGBA, STRING].indexOf(v[1]) > -1) {
      v = v[0];
    } else if (v[1] === PERCENT$1) {
      if (isWidth) {
        v = calRelativePercent(v[0], parent, WIDTH$1);
      } else {
        v = calRelativePercent(v[0], parent, HEIGHT$1);
      }
    }

    return v;
  }

  function calAbsolute(currentStyle, k, v, size) {
    if (v[1] === AUTO) {
      v = 0;
    } else if ([PX$1, NUMBER, DEG, RGBA, STRING].indexOf(v[1]) > -1) {
      v = v[0];
    } else if (v[1] === PERCENT$1) {
      v = v[0] * size * 0.01;
    }

    return v;
  }

  function equalStyle(k, a, b, target) {
    if (!a || !b) {
      return a === b;
    }

    if (k === TRANSFORM$1) {
      if (a.length !== b.length) {
        return false;
      }

      for (var i = 0, len = a.length; i < len; i++) {
        var oa = a[i];
        var ob = b[i];

        if (oa[0] !== ob[0]) {
          return false;
        } // translate/matrix等都是数组


        if (!equalArr$1(oa[1], ob[1])) {
          return false;
        }
      }

      return true;
    }

    if (k === FILTER) {
      if (a.length !== b.length) {
        return false;
      }

      for (var _i4 = 0, _len = a.length; _i4 < _len; _i4++) {
        if (!equalArr$1(a[_i4], b[_i4])) {
          return false;
        }
      }
    }

    if (k === BACKGROUND_SIZE) {
      if (a.length !== b.length) {
        return false;
      }

      for (var _i5 = 0, _len2 = a.length; _i5 < _len2; _i5++) {
        var aa = a[_i5],
            bb = b[_i5];

        if (aa[0][0] !== bb[0][0] || aa[0][1] !== bb[0][1] || aa[1][0] !== bb[1][0] || aa[1][1] !== bb[1][1]) {
          return false;
        }
      }

      return true;
    }

    if (k === TRANSFORM_ORIGIN$1 || RADIUS_HASH$1.hasOwnProperty(k)) {
      return a[0][0] === b[0][0] && a[0][1] === b[0][1] && a[1][0] === b[1][0] && a[1][1] === b[1][1];
    }

    if (k === BACKGROUND_POSITION_X || k === BACKGROUND_POSITION_Y || LENGTH_HASH$1.hasOwnProperty(k) || EXPAND_HASH$1.hasOwnProperty(k)) {
      return a[0] === b[0] && a[1] === b[1];
    }

    if (k === BOX_SHADOW) {
      return equalArr$1(a, b);
    }

    if (COLOR_HASH$1.hasOwnProperty(k)) {
      return a[1] === b[1] && equalArr$1(a[0], b[0]);
    }

    if (GRADIENT_HASH$1.hasOwnProperty(k) && a.k === b.k && GRADIENT_TYPE$1.hasOwnProperty(a.k)) {
      var av = a.v;
      var bv = b.v;

      if (a.d !== b.d || av.length !== bv.length) {
        return false;
      }

      for (var _i6 = 0, _len3 = av.length; _i6 < _len3; _i6++) {
        var ai = av[_i6];
        var bi = bv[_i6];

        if (ai.length !== bi.length) {
          return false;
        }

        for (var j = 0; j < 4; j++) {
          if (ai[0][j] !== bi[0][j]) {
            return false;
          }
        }

        if (ai.length > 1) {
          if (ai[1][0] !== bi[1][0] || ai[1][1] !== bi[1][1]) {
            return false;
          }
        }
      }

      return true;
    } // multi都是纯值数组，equalArr本身即递归，非multi根据类型判断


    if (isGeom$1(target.tagName, k) && (target.isMulti || Array.isArray(a) && Array.isArray(b))) {
      return equalArr$1(a, b);
    }

    return a === b;
  }

  function isRelativeOrAbsolute(node) {
    var position = node.currentStyle[POSITION];
    return position === 'relative' || position === 'absolute';
  }

  var VALUE$1 = (_VALUE$1 = {}, _defineProperty(_VALUE$1, POSITION, true), _defineProperty(_VALUE$1, DISPLAY, true), _defineProperty(_VALUE$1, STYLE_KEY$4.BACKGROUND_REPEAT, true), _defineProperty(_VALUE$1, FLEX_DIRECTION, true), _defineProperty(_VALUE$1, FLEX_GROW, true), _defineProperty(_VALUE$1, FLEX_SHRINK, true), _defineProperty(_VALUE$1, JUSTIFY_CONTENT, true), _defineProperty(_VALUE$1, ALIGN_ITEMS, true), _defineProperty(_VALUE$1, ALIGN_SELF, true), _defineProperty(_VALUE$1, STYLE_KEY$4.OVERFLOW, true), _defineProperty(_VALUE$1, STYLE_KEY$4.MIX_BLEND_MODE, true), _defineProperty(_VALUE$1, STYLE_KEY$4.STROKE_LINECAP, true), _defineProperty(_VALUE$1, STYLE_KEY$4.STROKE_LINEJOIN, true), _defineProperty(_VALUE$1, STYLE_KEY$4.STROKE_MITERLIMIT, true), _defineProperty(_VALUE$1, STYLE_KEY$4.FILL_RULE, true), _defineProperty(_VALUE$1, OPACITY, true), _defineProperty(_VALUE$1, Z_INDEX, true), _defineProperty(_VALUE$1, BACKGROUND_CLIP, true), _VALUE$1);
  var ARRAY_0$1 = (_ARRAY_$1 = {}, _defineProperty(_ARRAY_$1, COLOR, true), _defineProperty(_ARRAY_$1, BACKGROUND_COLOR, true), _defineProperty(_ARRAY_$1, STYLE_KEY$4.BORDER_TOP_COLOR, true), _defineProperty(_ARRAY_$1, STYLE_KEY$4.BORDER_RIGHT_COLOR, true), _defineProperty(_ARRAY_$1, STYLE_KEY$4.BORDER_BOTTOM_COLOR, true), _defineProperty(_ARRAY_$1, STYLE_KEY$4.BORDER_LEFT_COLOR, true), _ARRAY_$1);
  var ARRAY_0_1$1 = (_ARRAY_0_$1 = {}, _defineProperty(_ARRAY_0_$1, STYLE_KEY$4.BORDER_TOP_LEFT_RADIUS, true), _defineProperty(_ARRAY_0_$1, STYLE_KEY$4.BORDER_TOP_RIGHT_RADIUS, true), _defineProperty(_ARRAY_0_$1, STYLE_KEY$4.BORDER_BOTTOM_RIGHT_RADIUS, true), _defineProperty(_ARRAY_0_$1, STYLE_KEY$4.BORDER_BOTTOM_LEFT_RADIUS, true), _defineProperty(_ARRAY_0_$1, TRANSFORM_ORIGIN$1, true), _ARRAY_0_$1);

  function cloneStyle$1(style, keys) {
    if (!keys) {
      keys = Object.keys(style).map(function (i) {
        if (!GEOM$2.hasOwnProperty(i)) {
          i = parseInt(i);
        }

        return i;
      });
    }

    var res = {};

    for (var i = 0, len = keys.length; i < len; i++) {
      var k = keys[i];
      var v = style[k]; // 渐变特殊处理

      if (k === BACKGROUND_IMAGE) {
        res[k] = v.map(function (item) {
          if (item.k) {
            return util.clone(item);
          } else {
            return item;
          }
        });
      } else if (k === FILL || k === STROKE) {
        res[k] = v.map(function (item) {
          // 渐变
          if (item.k) {
            return util.clone(item);
          } // 颜色
          else {
              return item.slice(0);
            }
        });
      } else if (k === TRANSFORM$1) {
        if (v) {
          var n = v.slice(0);

          for (var _i7 = 0, _len4 = n.length; _i7 < _len4; _i7++) {
            n[_i7] = n[_i7].slice(0);
            n[_i7][1] = n[_i7][1].slice(0);
          }

          res[k] = n;
        }
      } else if (k === BOX_SHADOW) {
        if (v) {
          v = v.map(function (item) {
            var n = item.slice(0);
            n[4] = n[4].slice(0);
            return n;
          });
          res[k] = v;
        }
      } // position等直接值类型赋值
      else if (VALUE$1.hasOwnProperty(k)) {
          res[k] = v;
        } // geom自定义属性
        else if (GEOM$2.hasOwnProperty(k)) {
            res[k] = util.clone(v);
          } // 其余皆是数组或空
          else if (v) {
              var _n2 = res[k] = v.slice(0); // 特殊引用里数组某项再次clone


              if (k === BACKGROUND_POSITION_X || k === BACKGROUND_POSITION_Y) {
                for (var _i8 = 0, _len5 = _n2.length; _i8 < _len5; _i8++) {
                  _n2[_i8] = _n2[_i8].slice(0);
                }
              } else if (k === BACKGROUND_SIZE) {
                for (var _i9 = 0, _len6 = _n2.length; _i9 < _len6; _i9++) {
                  _n2[_i9] = _n2[_i9].slice(0);
                  _n2[_i9][0] = _n2[_i9][0].slice(0);
                  _n2[_i9][1] = _n2[_i9][1].slice(0);
                }
              } else if (ARRAY_0$1.hasOwnProperty(k)) {
                _n2[0] = _n2[0].slice(0);
              } else if (ARRAY_0_1$1.hasOwnProperty(k)) {
                _n2[0] = _n2[0].slice(0);
                _n2[1] = _n2[1].slice(0);
              } else if (k === TRANSFORM$1) {
                for (var _i10 = 0, _len7 = _n2.length; _i10 < _len7; _i10++) {
                  _n2[_i10] = _n2[_i10].slice(0);
                }
              }
            }
    }

    return res;
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
    isRelativeOrAbsolute: isRelativeOrAbsolute,
    cloneStyle: cloneStyle$1
  };

  var _enums$STYLE_KEY$3 = enums.STYLE_KEY,
      COLOR$1 = _enums$STYLE_KEY$3.COLOR,
      FONT_WEIGHT$2 = _enums$STYLE_KEY$3.FONT_WEIGHT,
      FONT_FAMILY$2 = _enums$STYLE_KEY$3.FONT_FAMILY,
      FONT_SIZE$2 = _enums$STYLE_KEY$3.FONT_SIZE,
      FONT_STYLE$1 = _enums$STYLE_KEY$3.FONT_STYLE,
      LETTER_SPACING$1 = _enums$STYLE_KEY$3.LETTER_SPACING;

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
      value: function render(renderMode, ctx, computedStyle, cacheStyle, dx, dy, index, charWidthList) {
        var content = this.content,
            x = this.x,
            y = this.y,
            parent = this.parent;
        var ox = parent.ox,
            oy = parent.oy;
        y += css.getBaseLine(computedStyle);
        x += ox + dx;
        y += oy + dy;
        var letterSpacing = computedStyle[LETTER_SPACING$1];
        var i = 0,
            length = content.length;

        if (renderMode === mode.CANVAS) {
          if (letterSpacing) {
            for (; i < length; i++) {
              ctx.fillText(content.charAt(i), x, y);
              x += charWidthList[index + i] + letterSpacing;
            }
          } else {
            ctx.fillText(content, x, y);
          }
        } else if (renderMode === mode.SVG) {
          var props = [['x', x], ['y', y], ['fill', cacheStyle[COLOR$1]], ['font-family', computedStyle[FONT_FAMILY$2]], ['font-weight', computedStyle[FONT_WEIGHT$2]], ['font-style', computedStyle[FONT_STYLE$1]], ['font-size', computedStyle[FONT_SIZE$2] + 'px']];

          if (letterSpacing) {
            props.push(['letter-spacing', letterSpacing]);
          }

          this.__virtualDom = {
            type: 'item',
            tagName: 'text',
            props: props,
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

  var _enums$STYLE_KEY$4 = enums.STYLE_KEY,
      DISPLAY$1 = _enums$STYLE_KEY$4.DISPLAY,
      LINE_HEIGHT$1 = _enums$STYLE_KEY$4.LINE_HEIGHT,
      FONT_SIZE$3 = _enums$STYLE_KEY$4.FONT_SIZE,
      FONT_FAMILY$3 = _enums$STYLE_KEY$4.FONT_FAMILY,
      FONT_WEIGHT$3 = _enums$STYLE_KEY$4.FONT_WEIGHT,
      COLOR$2 = _enums$STYLE_KEY$4.COLOR,
      VISIBILITY$1 = _enums$STYLE_KEY$4.VISIBILITY,
      TEXT_ALIGN$1 = _enums$STYLE_KEY$4.TEXT_ALIGN,
      LETTER_SPACING$2 = _enums$STYLE_KEY$4.LETTER_SPACING;

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
    /**
     * 预先计算每个字的宽度，在每次渲染前做
     * @param renderMode
     * @param ctx
     * @private
     */


    _createClass(Text, [{
      key: "__computeMeasure",
      value: function __computeMeasure(renderMode, ctx) {
        var content = this.content,
            computedStyle = this.computedStyle,
            charWidthList = this.charWidthList; // 每次都要清空重新计算，计算会有缓存

        charWidthList.splice(0);

        if (renderMode === mode.CANVAS) {
          ctx.font = css.setFontStyle(computedStyle);
        }

        var key = this.__key = computedStyle[FONT_SIZE$3] + ',' + computedStyle[FONT_FAMILY$3] + ',' + computedStyle[FONT_WEIGHT$3];
        var wait = textCache.data[key] = textCache.data[key] || {
          key: key,
          style: computedStyle,
          hash: {},
          s: []
        };
        var cache = textCache.charWidth[key] = textCache.charWidth[key] || {};
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
          textCache.list.push(this);
        }
      }
    }, {
      key: "__measureCb",
      value: function __measureCb() {
        var content = this.content,
            charWidthList = this.charWidthList;
        var key = this.__key;
        var cache = textCache.charWidth[key];
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
        this.__x = this.__sx1 = x;
        this.__y = this.__sy1 = y;
        var isDestroyed = this.isDestroyed,
            content = this.content,
            computedStyle = this.computedStyle,
            lineBoxes = this.lineBoxes,
            charWidthList = this.charWidthList;

        if (isDestroyed || computedStyle[DISPLAY$1] === 'none') {
          return;
        }

        this.__ox = this.__oy = 0;
        lineBoxes.splice(0); // 顺序尝试分割字符串为lineBox，形成多行

        var begin = 0;
        var i = 0;
        var count = 0;
        var length = content.length;
        var maxW = 0;
        var lineHeight = computedStyle[LINE_HEIGHT$1],
            letterSpacing = computedStyle[LETTER_SPACING$2];

        while (i < length) {
          count += charWidthList[i] + letterSpacing;

          if (count === w) {
            var lineBox = new LineBox(this, x, y, count, content.slice(begin, i + 1));
            lineBoxes.push(lineBox);
            maxW = Math.max(maxW, count);
            y += lineHeight;
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
            y += lineHeight;
            begin = i;
            count = 0;
          } else {
            i++;
          }
        } // 最后一行，只有一行未满时也进这里


        if (begin < length && begin < i) {
          count = 0;

          for (i = begin; i < length; i++) {
            count += charWidthList[i] + letterSpacing;
          }

          var _lineBox2 = new LineBox(this, x, y, count, content.slice(begin, length));

          lineBoxes.push(_lineBox2);
          maxW = Math.max(maxW, count);
          y += lineHeight;
        }

        this.__width = maxW;
        this.__height = y - data.y; // flex/abs前置计算无需真正布局

        if (!isVirtual) {
          var textAlign = computedStyle[TEXT_ALIGN$1];

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

        this.__sx1 += diff;
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

        this.__sy1 += diff;
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
            cacheStyle = this.cacheStyle,
            charWidthList = this.charWidthList;

        if (isDestroyed || computedStyle[DISPLAY$1] === 'none' || computedStyle[VISIBILITY$1] === 'hidden') {
          return false;
        }

        if (renderMode === mode.CANVAS) {
          var font = css.setFontStyle(computedStyle);

          if (ctx.font !== font) {
            ctx.font = font;
          }

          var color = cacheStyle[COLOR$2];

          if (ctx.fillStyle !== color) {
            ctx.fillStyle = color;
          }
        }

        var index = 0;
        lineBoxes.forEach(function (item) {
          item.render(renderMode, ctx, computedStyle, cacheStyle, dx, dy, index, charWidthList);
          index += item.content.length;
        });

        if (renderMode === mode.SVG) {
          this.virtualDom.children = lineBoxes.map(function (lineBox) {
            return lineBox.virtualDom;
          });
        }

        return true;
      }
    }, {
      key: "__deepScan",
      value: function __deepScan(cb) {
        cb(this);
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
        if (!this.content) {
          return;
        }

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

  var painter = {
    canvasPolygon: canvasPolygon,
    svgPolygon: svgPolygon,
    canvasLine: canvasLine,
    svgLine: svgLine
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

  var _enums$STYLE_KEY$5 = enums.STYLE_KEY,
      TRANSLATE_X$1 = _enums$STYLE_KEY$5.TRANSLATE_X,
      TRANSLATE_Y$1 = _enums$STYLE_KEY$5.TRANSLATE_Y,
      SCALE_X$1 = _enums$STYLE_KEY$5.SCALE_X,
      SCALE_Y$1 = _enums$STYLE_KEY$5.SCALE_Y,
      SKEW_X$1 = _enums$STYLE_KEY$5.SKEW_X,
      SKEW_Y$1 = _enums$STYLE_KEY$5.SKEW_Y,
      ROTATE_Z$1 = _enums$STYLE_KEY$5.ROTATE_Z,
      MATRIX$1 = _enums$STYLE_KEY$5.MATRIX;
  var PX$2 = unit.PX,
      PERCENT$2 = unit.PERCENT;
  var matrix = math.matrix,
      geom$1 = math.geom;
  var identity$1 = matrix.identity,
      calPoint$1 = matrix.calPoint,
      multiply$1 = matrix.multiply,
      isE$1 = matrix.isE;
  var d2r$2 = geom$1.d2r,
      pointInPolygon$1 = geom$1.pointInPolygon;

  function calSingle(t, k, v) {
    if (k === TRANSLATE_X$1) {
      t[4] = v;
    } else if (k === TRANSLATE_Y$1) {
      t[5] = v;
    } else if (k === SCALE_X$1) {
      t[0] = v;
    } else if (k === SCALE_Y$1) {
      t[3] = v;
    } else if (k === SKEW_X$1) {
      v = d2r$2(v);
      t[2] = Math.tan(v);
    } else if (k === SKEW_Y$1) {
      v = d2r$2(v);
      t[1] = Math.tan(v);
    } else if (k === ROTATE_Z$1) {
      v = d2r$2(v);
      var sin = Math.sin(v);
      var cos = Math.cos(v);
      t[0] = t[3] = cos;
      t[1] = sin;
      t[2] = -sin;
    } else if (k === MATRIX$1) {
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
      return m.slice(0);
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
    if (matrix && !isE$1(matrix)) {
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
    if (k === TRANSLATE_X$1) {
      if (v[1] === PERCENT$2) {
        return v[0] * ow * 0.01;
      }
    } else if (k === TRANSLATE_Y$1) {
      if (v[1] === PERCENT$2) {
        return v[0] * oh * 0.01;
      }
    } else if (k === MATRIX$1) {
      return v;
    }

    return v[0];
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
      if (item[1] === PX$2) {
        tfo.push(item[0]);
      } else if (item[1] === PERCENT$2) {
        tfo.push(item[0] * (i ? h : w) * 0.01);
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
   * 简单计算椭圆的圆化坐标控制点，视作重合位置，外面判断backgroundClip并调整坐标
   * @param x 起始x
   * @param y 起始y
   * @param w 宽
   * @param h 高
   * @param btlr borderTopLeftRadius
   * @param btrr borderTopRightRadius
   * @param bbrr borderBottomRightRadius
   * @param bblr borderBottomLeftRadius
   * @returns {[]} 多边形的顶点和曲线控制点
   */


  function calRadius(x, y, w, h, btlr, btrr, bbrr, bblr) {
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
        bbly = _bblr[1];

    btlx = Math.max(btlx, 0);
    btly = Math.max(btly, 0);
    btrx = Math.max(btrx, 0);
    btry = Math.max(btry, 0);
    bbrx = Math.max(bbrx, 0);
    bbry = Math.max(bbry, 0);
    bblx = Math.max(bblx, 0);
    bbly = Math.max(bbly, 0); // 圆角必须x/y都>0才有效，否则视为不绘制

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

  var _enums$STYLE_KEY$6 = enums.STYLE_KEY,
      SCALE_X$2 = _enums$STYLE_KEY$6.SCALE_X,
      SCALE_Y$2 = _enums$STYLE_KEY$6.SCALE_Y;
  var PERCENT$3 = unit.PERCENT,
      NUMBER$1 = unit.NUMBER;

  function matrixResize(imgWidth, imgHeight, targetWidth, targetHeight, x, y, w, h) {
    if (imgWidth === targetWidth && imgHeight === targetHeight) {
      return;
    }

    var list = [[SCALE_X$2, [targetWidth / imgWidth, NUMBER$1]], [SCALE_Y$2, [targetHeight / imgHeight, NUMBER$1]]];
    var tfo = tf.calOrigin([[0, PERCENT$3], [0, PERCENT$3]], w, h);
    tfo[0] += x;
    tfo[1] += y;
    return tf.calMatrixWithOrigin(list, tfo, w, h);
  }

  var image = {
    matrixResize: matrixResize
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

  function traversal(list, length, diff, after) {
    if (after) {
      for (var i = 0; i < length; i++) {
        var item = list[i];
        item.__after && item.__after(diff);
      }
    } else {
      for (var _i = 0; _i < length; _i++) {
        var _item = list[_i];
        _item.__before && _item.__before(diff);
      }
    }
  }

  var isPause;

  var Frame = /*#__PURE__*/function () {
    function Frame() {
      _classCallCheck(this, Frame);

      this.__hookTask = []; // 动画刷新后，每个root注册的刷新回调执行

      this.__task = [];
      this.__taskCp = []; // 区别于task，component专用，和animate等其它不同流水线，在最后执行，防止混了 #122

      this.__now = null;
    }

    _createClass(Frame, [{
      key: "__init",
      value: function __init() {
        var self = this;
        var task = self.task,
            taskCp = self.taskCp;
        inject.cancelAnimationFrame(self.id);
        var last = self.__now = inject.now();

        function cb() {
          // 必须清除，可能会发生重复，当动画finish回调中gotoAndPlay(0)，下方结束判断发现aTask还有值会继续，新的init也会进入再次执行
          inject.cancelAnimationFrame(self.id);
          self.id = inject.requestAnimationFrame(function () {
            if (isPause || !task.length && !taskCp.length) {
              return;
            }

            var now = self.__now = inject.now();
            var diff = now - last;
            diff = Math.max(diff, 0); // 特殊情况0.5ms以内由于向下取整关系近似为0，防止重复渲染

            if (diff === 0) {
              if (task.length || taskCp.length) {
                cb();
              }

              return;
            } // let delta = diff * 0.06; // 比例是除以1/60s，等同于*0.06


            last = now; // 优先动画计算

            var clone = task.slice(0);
            var cloneCp = taskCp.splice(0); // task要常驻，taskCp只1次直接splice清空

            var length = clone.length;
            var lengthCp = cloneCp.length;
            traversal(clone, length, diff);
            traversal(cloneCp, lengthCp, diff); // 执行动画造成的每个Root的刷新并清空

            var list = self.__hookTask.splice(0);

            for (var i = 0, len = list.length; i < len; i++) {
              var item = list[i];
              item && item();
            } // 普通的before/after


            traversal(clone, length, diff, true);
            traversal(cloneCp, lengthCp, diff, true); // 还有则继续，没有则停止节省性能

            if (task.length || taskCp.length) {
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

        var task = this.task;

        if (!task.length) {
          this.__init();
        }

        if (isFunction$2(handle)) {
          handle = {
            __after: handle,
            __karasFramecb: handle
          };
        }

        task.push(handle);
      }
    }, {
      key: "offFrame",
      value: function offFrame(handle) {
        if (!handle) {
          return;
        }

        var task = this.task;

        for (var i = 0, len = task.length; i < len; i++) {
          var item = task[i]; // 需考虑nextFrame包裹的引用对比

          if (item === handle || item.__karasFramecb === handle) {
            task.splice(i, 1);
            break;
          }
        }

        if (!task.length) {
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


        var cb = isFunction$2(handle) ? {
          __after: function __after(diff) {
            handle(diff);

            _this.offFrame(cb);
          }
        } : {
          __before: handle.__before,
          __after: function __after(diff) {
            handle.__after && handle.__after(diff);

            _this.offFrame(cb);
          }
        };
        cb.__karasFramecb = handle;
        this.onFrame(cb);
      }
    }, {
      key: "__nextFrameCp",
      value: function __nextFrameCp(handle) {
        var task = this.task,
            taskCp = this.taskCp;

        if (!task.length && !taskCp.length) {
          this.__init();
        }

        taskCp.push(handle);
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
      key: "taskCp",
      get: function get() {
        return this.__taskCp;
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
  easing['ease-in'] = easing.easeIn;
  easing['ease-out'] = easing.easeOut;
  easing['ease-in-out'] = easing.easeInOut;

  var _enums$STYLE_KEY$7 = enums.STYLE_KEY,
      FILTER$1 = _enums$STYLE_KEY$7.FILTER,
      TRANSFORM_ORIGIN$2 = _enums$STYLE_KEY$7.TRANSFORM_ORIGIN,
      BACKGROUND_POSITION_X$1 = _enums$STYLE_KEY$7.BACKGROUND_POSITION_X,
      BACKGROUND_POSITION_Y$1 = _enums$STYLE_KEY$7.BACKGROUND_POSITION_Y,
      BOX_SHADOW$1 = _enums$STYLE_KEY$7.BOX_SHADOW,
      TRANSLATE_X$2 = _enums$STYLE_KEY$7.TRANSLATE_X,
      BACKGROUND_SIZE$1 = _enums$STYLE_KEY$7.BACKGROUND_SIZE,
      FONTSIZE = _enums$STYLE_KEY$7.FONTSIZE,
      FLEX_BASIS$1 = _enums$STYLE_KEY$7.FLEX_BASIS,
      FLEX_DIRECTION$1 = _enums$STYLE_KEY$7.FLEX_DIRECTION,
      WIDTH$2 = _enums$STYLE_KEY$7.WIDTH,
      HEIGHT$2 = _enums$STYLE_KEY$7.HEIGHT,
      MARGIN_RIGHT = _enums$STYLE_KEY$7.MARGIN_RIGHT,
      MARGIN_TOP = _enums$STYLE_KEY$7.MARGIN_TOP,
      MARGIN_LEFT = _enums$STYLE_KEY$7.MARGIN_LEFT,
      MARGIN_BOTTOM = _enums$STYLE_KEY$7.MARGIN_BOTTOM,
      PADDING_LEFT = _enums$STYLE_KEY$7.PADDING_LEFT,
      PADDING_BOTTOM = _enums$STYLE_KEY$7.PADDING_BOTTOM,
      PADDING_RIGHT = _enums$STYLE_KEY$7.PADDING_RIGHT,
      PADDING_TOP = _enums$STYLE_KEY$7.PADDING_TOP,
      TOP = _enums$STYLE_KEY$7.TOP,
      RIGHT = _enums$STYLE_KEY$7.RIGHT,
      BOTTOM = _enums$STYLE_KEY$7.BOTTOM,
      LEFT = _enums$STYLE_KEY$7.LEFT,
      LINE_HEIGHT$2 = _enums$STYLE_KEY$7.LINE_HEIGHT,
      OPACITY$1 = _enums$STYLE_KEY$7.OPACITY,
      Z_INDEX$1 = _enums$STYLE_KEY$7.Z_INDEX,
      TRANSFORM$2 = _enums$STYLE_KEY$7.TRANSFORM,
      COLOR$3 = _enums$STYLE_KEY$7.COLOR,
      FONT_WEIGHT$4 = _enums$STYLE_KEY$7.FONT_WEIGHT,
      FONT_STYLE$2 = _enums$STYLE_KEY$7.FONT_STYLE,
      FONT_FAMILY$4 = _enums$STYLE_KEY$7.FONT_FAMILY,
      TEXT_ALIGN$2 = _enums$STYLE_KEY$7.TEXT_ALIGN,
      MATRIX$2 = _enums$STYLE_KEY$7.MATRIX,
      _enums$UPDATE_KEY = enums.UPDATE_KEY,
      UPDATE_NODE = _enums$UPDATE_KEY.UPDATE_NODE,
      UPDATE_STYLE = _enums$UPDATE_KEY.UPDATE_STYLE,
      UPDATE_KEYS = _enums$UPDATE_KEY.UPDATE_KEYS,
      UPDATE_CONFIG = _enums$UPDATE_KEY.UPDATE_CONFIG,
      _enums$KEY_FRAME_KEY = enums.KEY_FRAME_KEY,
      FRAME_STYLE = _enums$KEY_FRAME_KEY.FRAME_STYLE,
      FRAME_TIME = _enums$KEY_FRAME_KEY.FRAME_TIME,
      FRAME_EASING = _enums$KEY_FRAME_KEY.FRAME_EASING,
      FRAME_TRANSITION = _enums$KEY_FRAME_KEY.FRAME_TRANSITION;
  var AUTO$1 = unit.AUTO,
      PX$3 = unit.PX,
      PERCENT$4 = unit.PERCENT,
      INHERIT$3 = unit.INHERIT,
      RGBA$1 = unit.RGBA,
      STRING$1 = unit.STRING,
      NUMBER$2 = unit.NUMBER;
  var isNil$4 = util.isNil,
      isFunction$3 = util.isFunction,
      isNumber$1 = util.isNumber,
      isObject$1 = util.isObject,
      isString$1 = util.isString,
      clone$1 = util.clone,
      equalArr$2 = util.equalArr;
  var linear = easing.linear;
  var cloneStyle$2 = css.cloneStyle;
  var isGeom$2 = o.isGeom,
      GEOM$3 = o.GEOM;
  var COLOR_HASH$2 = key.COLOR_HASH,
      LENGTH_HASH$2 = key.LENGTH_HASH,
      RADIUS_HASH$2 = key.RADIUS_HASH,
      GRADIENT_HASH$2 = key.GRADIENT_HASH,
      EXPAND_HASH$2 = key.EXPAND_HASH,
      GRADIENT_TYPE$2 = key.GRADIENT_TYPE;
  var NUM_CAL_HASH = {};
  Object.assign(NUM_CAL_HASH, LENGTH_HASH$2);
  Object.assign(NUM_CAL_HASH, EXPAND_HASH$2);

  function unify(frames, target) {
    var hash = {};
    var keys = []; // 获取所有关键帧的属性

    frames.forEach(function (item) {
      var style = item[FRAME_STYLE];
      Object.keys(style).forEach(function (k) {
        var v = style[k]; // 空的过滤掉

        if (v !== undefined && !hash.hasOwnProperty(k)) {
          hash[k] = true;

          if (!GEOM$3.hasOwnProperty(k)) {
            k = parseInt(k);
          }

          keys.push(k);
        }
      });
    }); // 添补没有声明完全的关键帧属性为节点当前值

    frames.forEach(function (item) {
      var style = item[FRAME_STYLE];
      keys.forEach(function (k) {
        if (!style.hasOwnProperty(k) || isNil$4(style[k])) {
          if (GEOM$3.hasOwnProperty(k)) {
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
      var style = item[FRAME_STYLE];
      keys.forEach(function (k) {
        var v = style[k]; // geom的属性可能在帧中没有

        if (isNil$4(v)) {
          return;
        }

        if (k === TRANSFORM$2) {
          var ow = target.outerWidth;
          var oh = target.outerHeight;
          var m = tf.calMatrix(v, ow, oh);
          style[k] = [[MATRIX$2, m]];
        } else if (v[1] === INHERIT$3) {
          if (k === COLOR$3) {
            style[k] = [util.rgba2int(computedStyle[k]), RGBA$1];
          } else if (LENGTH_HASH$2.hasOwnProperty(k)) {
            style[k] = [computedStyle[k], PX$3];
          } else if (k === FONT_WEIGHT$4) {
            style[k] = [computedStyle[k], NUMBER$2];
          } else if (k === FONT_STYLE$2 || k === FONT_FAMILY$4 || k === TEXT_ALIGN$2) {
            style[k] = [computedStyle[k], STRING$1];
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
   * @param keys 样式所有的key
   * @param __config
   * @param root
   * @param node
   */


  function genBeforeRefresh(style, keys, __config, root, node) {
    var res = {};
    res[UPDATE_NODE] = node;
    res[UPDATE_STYLE] = style;
    res[UPDATE_KEYS] = keys;
    res[UPDATE_CONFIG] = __config[I_NODE_CONFIG];

    root.__addUpdate(node, __config[I_NODE_CONFIG], root, __config[I_ROOT_CONFIG], res);

    __config[I_STYLE] = style;
    __config[I_ASSIGNING] = true; // frame每帧回调时，下方先执行计算好变更的样式，这里特殊插入一个hook，让root增加一个刷新操作
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
    var res = [];
    res[FRAME_STYLE] = style;
    res[FRAME_TIME] = offset * duration;
    res[FRAME_EASING] = easing || es;
    res[FRAME_TRANSITION] = [];
    return res;
  }
  /**
   * 计算两帧之间的差，单位不同的以后面为准，返回的v表示差值
   * 没有变化返回空
   * auto等无法比较的不参与计算，不返回来标识无过度效果
   * @param prev 上一帧样式
   * @param next 下一帧样式
   * @param k 比较的样式名
   * @param target dom对象
   * @param tagName dom名
   * @returns {{k: *, v: *}}
   */


  function calDiff(prev, next, k, target, tagName) {
    var res = [k];
    var p = prev[k];
    var n = next[k];

    if (k === TRANSFORM$2) {
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


      if (equalArr$2(pm, nm)) {
        return;
      }

      res[1] = [nm[0] - pm[0], nm[1] - pm[1], nm[2] - pm[2], nm[3] - pm[3], nm[4] - pm[4], nm[5] - pm[5]];
      return res;
    } else if (k === FILTER$1) {
      // 目前只有1个blur，可以简单处理
      if (!p || !p.length) {
        res[1] = n[0][1];
      } else if (!n || !n.length) {
        res[1] = -p[0][1];
      } else {
        res[1] = n[0][1] - p[0][1];
      }
    } else if (k === TRANSFORM_ORIGIN$2) {
      res[1] = [];

      for (var i = 0; i < 2; i++) {
        var pi = p[i];
        var ni = n[i];

        if (pi[1] === ni[1]) {
          res[1].push(ni[0] - pi[0]);
        } else if (pi[1] === PX$3 && ni[1] === PERCENT$4) {
          var v = ni[0] * 0.01 * target[i ? 'outerHeight' : 'outerWidth'];
          res[1].push(v - pi[0]);
        } else if (pi[1] === PERCENT$4 && ni[1] === PX$3) {
          var _v = ni[0] * 100 / target[i ? 'outerHeight' : 'outerWidth'];

          res[1].push(_v - pi[0]);
        }
      }

      if (equalArr$2(res[1], [0, 0])) {
        return;
      }
    } else if (k === BACKGROUND_POSITION_X$1 || k === BACKGROUND_POSITION_Y$1) {
      res[1] = [];
      var length = Math.min(p.length, n.length);

      for (var _i = 0; _i < length; _i++) {
        var _pi = p[_i],
            _ni = n[_i];

        if (!_pi || !_ni) {
          res[1].push(null);
          continue;
        }

        if (_pi[1] === _ni[1] && [PX$3, PERCENT$4].indexOf(_pi[1]) > -1) {
          var _v2 = _ni[0] - _pi[0];

          if (_v2 === 0) {
            return;
          }

          res[1].push(_v2);
        } else if (p[1] === PX$3 && n[1] === PERCENT$4) {
          var _v3 = _ni[0] * 0.01 * target[k === BACKGROUND_POSITION_X$1 ? 'clientWidth' : 'clientHeight'];

          _v3 = _v3 - _pi[0];

          if (_v3 === 0) {
            return;
          }

          res[1].push(_v3);
        } else if (p[1] === PERCENT$4 && n[1] === PX$3) {
          var _v4 = _ni[0] * 100 / target[k === BACKGROUND_POSITION_X$1 ? 'clientWidth' : 'clientHeight'];

          _v4 = _v4 - _pi[0];

          if (_v4 === 0) {
            return;
          }

          res[1].push(_v4);
        } else {
          res[1].push(null);
        }
      }
    } else if (k === BOX_SHADOW$1) {
      res[1] = [];

      for (var _i2 = 0, len = Math.min(p.length, n.length); _i2 < len; _i2++) {
        var a = p[_i2];
        var b = n[_i2];
        var _v5 = []; // x/y/blur/spread

        for (var j = 0; j < 4; j++) {
          _v5.push(b[j] - a[j]);
        } // rgba


        var c = [];

        for (var _j = 0; _j < 4; _j++) {
          c.push(b[4][_j] - a[4][_j]);
        }

        _v5.push(c);

        res[1].push(_v5);
      }
    } else if (EXPAND_HASH$2.hasOwnProperty(k)) {
      if (p[1] === n[1]) {
        var _v6 = n[0] - p[0];

        if (_v6 === 0) {
          return;
        }

        res[1] = _v6;
      } else if (p[1] === PX$3 && n[1] === PERCENT$4) {
        var _v7 = n[0] * 0.01 * target[k === TRANSLATE_X$2 ? 'outerWidth' : 'outerHeight'];

        _v7 = _v7 - p[0];

        if (_v7 === 0) {
          return;
        }

        res[1] = _v7;
      } else if (p[1] === PERCENT$4 && n[1] === PX$3) {
        var _v8 = n[0] * 100 / target[k === TRANSLATE_X$2 ? 'outerWidth' : 'outerHeight'];

        _v8 = _v8 - p[0];

        if (_v8 === 0) {
          return;
        }

        res[1] = _v8;
      }
    } else if (k === BACKGROUND_SIZE$1) {
      res[1] = [];

      var _length = Math.min(p.length, n.length);

      var has;

      for (var _i3 = 0; _i3 < _length; _i3++) {
        var _pi2 = p[_i3],
            _ni2 = n[_i3];

        if (!_pi2 || !_ni2) {
          res[1].push(null);
          continue;
        }

        var temp = [];

        for (var _j2 = 0; _j2 < 2; _j2++) {
          var pp = _pi2[_j2],
              nn = _ni2[_j2];

          if (pp[1] === nn[1] && [PX$3, PERCENT$4].indexOf(pp[1]) > -1) {
            temp.push(nn[0] - pp[0]);
          } else if (pp[1] === PX$3 && nn[1] === PERCENT$4) {
            var _v9 = nn[0] * 0.01 * target[_i3 ? 'clientWidth' : 'clientHeight'];

            temp.push(_v9 - pp[0]);
          } else if (pp[1] === PERCENT$4 && nn[1] === PX$3) {
            var _v10 = nn[0] * 100 / target[_i3 ? 'clientWidth' : 'clientHeight'];

            temp.push(_v10 - pp[0]);
          } // 兜底异常情况
          else {
              temp.push(0);
            }
        }

        if (equalArr$2(temp, [0, 0])) {
          res[1].push(null);
        } else {
          res[1].push(temp);
          has = true;
        }
      }

      if (!has) {
        return;
      }
    } else if (GRADIENT_HASH$2.hasOwnProperty(k)) {
      // backgroundImage发生了渐变色和图片的变化，fill发生渐变色和纯色的变化等
      res[1] = [];

      var _length2 = Math.min(p.length, n.length);

      for (var _i4 = 0; _i4 < _length2; _i4++) {
        var _pi3 = p[_i4],
            _ni3 = n[_i4];

        if (!_pi3 || !_ni3 || isString$1(_pi3) || isString$1(_ni3)) {
          res[1].push(null);
          continue;
        }

        if (_pi3.k !== _ni3.k) {
          res[1].push(null);
          continue;
        }

        var _temp = []; // 渐变

        if (_pi3.k === 'linear' || _pi3.k === 'radial' || _pi3.k === 'conic') {
          var pv = _pi3.v;
          var nv = _ni3.v;
          _temp[0] = [];
          var clientWidth = target.clientWidth;
          var eq = equalArr$2(pv, nv);

          for (var _i5 = 0, _len = Math.min(pv.length, nv.length); _i5 < _len; _i5++) {
            var _a = pv[_i5];
            var _b = nv[_i5];
            var t = [];
            t.push([_b[0][0] - _a[0][0], _b[0][1] - _a[0][1], _b[0][2] - _a[0][2], _b[0][3] - _a[0][3]]);

            if (_a[1] && _b[1]) {
              if (_a[1][1] === _b[1][1]) {
                t.push(_b[1][0] - _a[1][0]);
              } else if (_a[1][1] === PX$3 && _b[1][1] === PERCENT$4) {
                t.push(_b[1][0] * clientWidth * 0.01 - _a[1][0]);
              } else if (_a[1][1] === PERCENT$4 && _b[1][1] === PX$3) {
                t.push(_b[1][0] * 100 / clientWidth - _a[1][0]);
              }
            }

            _temp[0].push(t);
          } // 线性渐变有角度差值变化


          if (_pi3.k === 'linear') {
            var isArrP = Array.isArray(_pi3.d);
            var isArrN = Array.isArray(_ni3.d);

            if (isArrN !== isArrP) {
              res[1].push(null);
              continue;
            }

            if (isArrP) {
              var _v11 = [_ni3.d[0] - _pi3.d[0], _ni3.d[1] - _pi3.d[1], _ni3.d[2] - _pi3.d[2], _ni3.d[3] - _pi3.d[3]];

              if (eq && equalArr$2(_v11, [0, 0, 0, 0])) {
                res[1].push(null);
                continue;
              }

              _temp[1] = _v11;
            } else {
              var _v12 = _ni3.d - _pi3.d;

              if (eq && _v12 === 0) {
                res[1].push(null);
                continue;
              }

              _temp[1] = _v12;
            }
          } // 径向渐变的位置
          else if (_pi3.k === 'radial') {
              var _isArrP = Array.isArray(_pi3.z);

              var _isArrN = Array.isArray(_ni3.z);

              if (_isArrN !== _isArrP) {
                res[1].push(null);
                continue;
              }

              if (_isArrP) {
                _temp[2] = [];

                for (var _i6 = 0; _i6 < 5; _i6++) {
                  var pz = _pi3.z[_i6]; // 半径比例省略为1

                  if (pz === undefined) {
                    pz = 1;
                  }

                  var nz = _ni3.z[_i6];

                  if (nz === undefined) {
                    nz = 1;
                  }

                  _temp[2].push(nz - pz);
                }

                if (eq && equalArr$2(res[4], [0, 0, 0, 0, 0])) {
                  res[1].push(null);
                }
              } else {
                _temp[2] = [];

                for (var _i7 = 0; _i7 < 2; _i7++) {
                  var _pp = _pi3.p[_i7];
                  var np = _ni3.p[_i7];

                  if (_pp[1] === np[1]) {
                    _temp[2].push(np[0] - _pp[0]);
                  } else if (_pp[1] === PX$3 && np[1] === PERCENT$4) {
                    var _v13 = np[0] * 0.01 * target[_i7 ? 'clientWidth' : 'clientHeight'];

                    _temp[2].push(_v13 - _pp[0]);
                  } else if (_pp[1] === PERCENT$4 && np[1] === PX$3) {
                    var _v14 = np[0] * 100 / target[_i7 ? 'clientWidth' : 'clientHeight'];

                    _temp[2].push(_v14 - _pp[0]);
                  }
                }

                if (eq && equalArr$2(res[3], [0, 0])) {
                  res[1].push(null);
                }
              }
            } else if (_pi3.k === 'conic') {
              _temp[1].push(n.d - p.d);

              _temp[2] = [];

              for (var _i8 = 0; _i8 < 2; _i8++) {
                var _pp2 = p.p[_i8];
                var _np = n.p[_i8];

                if (_pp2[1] === _np[1]) {
                  _temp[2].push(_np[0] - _pp2[0]);
                } else if (_pp2[1] === PX$3 && _np[1] === PERCENT$4) {
                  var _v15 = _np[0] * 0.01 * target[_i8 ? 'clientWidth' : 'clientHeight'];

                  _temp[2].push(_v15 - _pp2[0]);
                } else if (_pp2[1] === PERCENT$4 && _np[1] === PX$3) {
                  var _v16 = _np[0] * 100 / target[_i8 ? 'clientWidth' : 'clientHeight'];

                  _temp[2].push(_v16 - _pp2[0]);
                }
              }

              if (eq && res[2] !== 0 && equalArr$2(res[3], [0, 0])) {
                res[1].push(null);
              }
            }
        } // 纯色
        else {
            if (equalArr$2(n, _pi3)) {
              res[1].push(null);
            }

            _temp[0] = [_ni3[0] - _pi3[0], _ni3[1] - _pi3[1], _ni3[2] - _pi3[2], _ni3[3] - _pi3[3]];
          }

        res[1].push(_temp);
      }
    } else if (COLOR_HASH$2.hasOwnProperty(k)) {
      n = n[0];
      p = p[0];

      if (equalArr$2(n, p) || n[3] === 0 && p[3] === 0) {
        return;
      }

      res[1] = [n[0] - p[0], n[1] - p[1], n[2] - p[2], n[3] - p[3]];
    } else if (RADIUS_HASH$2.hasOwnProperty(k)) {
      // x/y都相等无需
      if (n[0][0] === p[0][0] && n[0][1] === p[0][1] && n[1][0] === p[1][0] && n[1][1] === p[1][1]) {
        return;
      }

      res[1] = [];

      for (var _i9 = 0; _i9 < 2; _i9++) {
        if (n[_i9][1] === p[_i9][1]) {
          res[1].push(n[_i9][0] - p[_i9][0]);
        } else if (p[_i9][1] === PX$3 && n[_i9][1] === PERCENT$4) {
          res[1].push(n[_i9][0] * 0.01 * target[_i9 ? 'outerHeight' : 'outerWidth'] - p[_i9][0]);
        } else if (p[_i9][1] === PERCENT$4 && n[_i9][1] === PX$3) {
          res[1].push(n[_i9][0] * 100 / target[_i9 ? 'outerHeight' : 'outerWidth'] - p[_i9][0]);
        } else {
          res[1].push(0);
        }
      }
    } else if (LENGTH_HASH$2.hasOwnProperty(k)) {
      // auto不做动画
      if (p[1] === AUTO$1 || n[1] === AUTO$1) {
        return;
      }

      var computedStyle = target.computedStyle;
      var parentComputedStyle = (target.domParent || target).computedStyle;
      var diff = 0;

      if (p[1] === n[1]) {
        diff = n[0] - p[0];
      } // 长度单位变化特殊计算，根据父元素computedStyle
      else if (p[1] === PX$3 && n[1] === PERCENT$4) {
          var _v17;

          if (k === FONTSIZE) {
            _v17 = n[0] * parentComputedStyle[k] * 0.01;
          } else if (k === FLEX_BASIS$1 && computedStyle[FLEX_DIRECTION$1] === 'row' || k === WIDTH$2 || [LEFT, RIGHT, MARGIN_BOTTOM, MARGIN_LEFT, MARGIN_TOP, MARGIN_RIGHT, PADDING_TOP, PADDING_RIGHT, PADDING_BOTTOM, PADDING_LEFT].indexOf(k) > -1) {
            _v17 = n[0] * parentComputedStyle[WIDTH$2] * 0.01;
          } else if (k === FLEX_BASIS$1 || k === HEIGHT$2 || [TOP, BOTTOM].indexOf(k) > -1) {
            _v17 = n[0] * parentComputedStyle[HEIGHT$2] * 0.01;
          }

          diff = _v17 - p[0];
        } else if (p[1] === PERCENT$4 && n[1] === PX$3) {
          var _v18;

          if (k === FONTSIZE) {
            _v18 = n[0] * 100 / parentComputedStyle[k];
          } else if (k === FLEX_BASIS$1 && computedStyle[FLEX_DIRECTION$1] === 'row' || k === WIDTH$2 || [LEFT, RIGHT, MARGIN_BOTTOM, MARGIN_LEFT, MARGIN_TOP, MARGIN_RIGHT, PADDING_TOP, PADDING_RIGHT, PADDING_BOTTOM, PADDING_LEFT].indexOf(k) > -1) {
            _v18 = n[0] * 100 / parentComputedStyle[WIDTH$2];
          } else if (k === FLEX_BASIS$1 || k === HEIGHT$2 || [TOP, BOTTOM].indexOf(k) > -1) {
            _v18 = n[0] * 100 / parentComputedStyle[HEIGHT$2];
          }

          diff = _v18 - p[0];
        } // lineHeight奇怪的单位变化
        else if (k === LINE_HEIGHT$2) {
            if (p[1] === PX$3 && n[1] === NUMBER$2) {
              diff = n[0] * computedStyle[FONTSIZE] - p[0];
            } else if (p[1] === NUMBER$2 && n[1] === PX$3) {
              diff = n[0] / computedStyle[FONTSIZE] - p[0];
            }
          } // 兜底NaN非法


      if (diff === 0 || isNaN(diff)) {
        return;
      }

      res[1] = diff;
    } else if (GEOM$3.hasOwnProperty(k)) {
      if (isNil$4(p)) {
        return;
      } else if (GEOM$3[k][tagName] && isFunction$3(GEOM$3[k][tagName].calDiff)) {
        var fn = GEOM$3[k][tagName].calDiff;

        if (target.isMulti) {
          var arr = [];

          for (var _i10 = 0, _len2 = Math.min(p.length, n.length); _i10 < _len2; _i10++) {
            arr.push(fn(p[_i10], n[_i10]));
          }

          return arr;
        } else {
          res[1] = fn(p, n);
        }
      } // 特殊处理multi
      else if (target.isMulti) {
          if (k === 'points' || k === 'controls') {
            if (isNil$4(n) || isNil$4(p) || equalArr$2(p, n)) {
              return;
            }

            res[1] = [];

            for (var _i11 = 0, _len3 = Math.min(p.length, n.length); _i11 < _len3; _i11++) {
              var _pv = p[_i11];
              var _nv = n[_i11];

              if (isNil$4(_pv) || isNil$4(_nv)) {
                res[1].push(null);
              } else {
                var v2 = [];

                for (var _j3 = 0, len2 = Math.min(_pv.length, _nv.length); _j3 < len2; _j3++) {
                  var pv2 = _pv[_j3];
                  var nv2 = _nv[_j3];

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

                res[1].push(v2);
              }
            }
          } else if (k === 'controlA' || k === 'controlB') {
            if (isNil$4(n) || isNil$4(p) || equalArr$2(p, n)) {
              return;
            }

            res[1] = [];

            for (var _i12 = 0, _len4 = Math.min(p.length, n.length); _i12 < _len4; _i12++) {
              var _pv2 = p[_i12];
              var _nv2 = n[_i12];

              if (isNil$4(_pv2) || isNil$4(_nv2)) {
                res[1].push(null);
              } else {
                res[1].push([_nv2[0] - _pv2[0], _nv2[1] - _pv2[1]]);
              }
            }
          } else {
            if (n === p || equalArr$2(n, p) || k === 'edge' || k === 'closure') {
              return;
            }

            var _v19 = [];

            for (var _i13 = 0, _len5 = Math.min(p.length, n.length); _i13 < _len5; _i13++) {
              var _pv3 = p[_i13];
              var _nv3 = n[_i13];

              if (isNil$4(_pv3) || isNil$4(_nv3)) {
                _v19.push(0);
              }

              _v19.push(_nv3 - _pv3);
            }

            res[1] = _v19;
          }
        } // 非multi特殊处理这几类数组类型数据
        else if (k === 'points' || k === 'controls') {
            if (isNil$4(n) || isNil$4(p) || equalArr$2(p, n)) {
              return;
            }

            res[1] = [];

            for (var _i14 = 0, _len6 = Math.min(p.length, n.length); _i14 < _len6; _i14++) {
              var _pv4 = p[_i14];
              var _nv4 = n[_i14];

              if (isNil$4(_pv4) || isNil$4(_nv4)) {
                res[1].push(null);
              } else {
                var _v20 = [];

                for (var _j4 = 0, _len7 = Math.max(_pv4.length, _nv4.length); _j4 < _len7; _j4++) {
                  var _pv5 = _pv4[_j4];
                  var _nv5 = _nv4[_j4]; // control由4点变2点

                  if (isNil$4(_pv5) || isNil$4(_nv5)) {
                    _v20.push(0);
                  } else {
                    _v20.push(_nv5 - _pv5);
                  }
                }

                res[1].push(_v20);
              }
            }
          } else if (k === 'controlA' || k === 'controlB') {
            if (isNil$4(n) || isNil$4(p) || equalArr$2(p, n)) {
              return;
            }

            res[1] = [n[0] - p[0], n[1] - p[1]];
          } // 其它简单数据，除了edge/closure没有增量
          else {
              if (n === p || k === 'edge' || k === 'closure') {
                return;
              } else {
                res[1] = n - p;
              }
            }
    } else if (k === OPACITY$1 || k === Z_INDEX$1) {
      if (n === p) {
        return;
      }

      res[1] = n - p;
    } // display等不能有增量过程的
    else {
        return;
      }

    return res;
  } // 计算两帧之间不相同的变化，存入transition，相同的忽略


  function calFrame(prev, next, keys, target, tagName) {
    keys.forEach(function (k) {
      var ts = calDiff(prev[FRAME_STYLE], next[FRAME_STYLE], k, target, tagName); // 可以形成过渡的才会产生结果返回

      if (ts) {
        prev[FRAME_TRANSITION].push(ts);
      }
    });
    return next;
  }

  function binarySearch(i, j, time, frames) {
    if (i === j) {
      var _frame = frames[i];

      if (_frame[FRAME_TIME] > time) {
        return i - 1;
      }

      return i;
    } else {
      var middle = i + (j - i >> 1);
      var _frame2 = frames[middle];

      if (_frame2[FRAME_TIME] === time) {
        return middle;
      } else if (_frame2[FRAME_TIME] > time) {
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
   * @param keys 所有样式key
   * @param percent 到下一帧时间的百分比
   * @param target vd
   * @returns {*}
   */


  function calIntermediateStyle(frame, keys, percent, target) {
    var style = cloneStyle$2(frame[FRAME_STYLE], keys);
    var timingFunction = getEasing(frame[FRAME_EASING]);

    if (timingFunction && timingFunction !== linear) {
      percent = timingFunction(percent);
    }

    var transition = frame[FRAME_TRANSITION];
    var tagName = target.tagName;

    var _loop = function _loop(i, len) {
      var _transition$i = _slicedToArray(transition[i], 2),
          k = _transition$i[0],
          v = _transition$i[1];

      var st = style[k]; // transform特殊处理，只有1个matrix，有可能不存在，需给默认矩阵

      if (k === TRANSFORM$2) {
        if (!st) {
          st = style[k] = [[MATRIX$2, [1, 0, 0, 1, 0, 0]]];
        }

        for (var _i15 = 0; _i15 < 6; _i15++) {
          st[0][1][_i15] += v[_i15] * percent;
        }
      } else if (NUM_CAL_HASH.hasOwnProperty(k)) {
        if (v) {
          st[0] += v * percent;
        }
      } else if (k === FILTER$1) {
        // 只有1个样式声明了filter另外一个为空
        if (!st) {
          st = style[k] = [['blur', 0]];
        }

        st[0][1] += v * percent;
      } else if (RADIUS_HASH$2.hasOwnProperty(k)) {
        for (var _i16 = 0; _i16 < 2; _i16++) {
          st[_i16][0] += v[_i16] * percent;
        }
      } else if (k === TRANSFORM_ORIGIN$2) {
        if (v[0] !== 0) {
          st[0][0] += v[0] * percent;
        }

        if (v[1] !== 0) {
          st[1][0] += v[1] * percent;
        }
      } else if (k === BOX_SHADOW$1) {
        for (var _i17 = 0, _len8 = Math.min(st.length, v.length); _i17 < _len8; _i17++) {
          // x/y/blur/spread
          for (var j = 0; j < 4; j++) {
            st[_i17][j] += v[_i17][j] * percent;
          } // rgba


          for (var _j5 = 0; _j5 < 4; _j5++) {
            st[_i17][4][_j5] += v[_i17][4][_j5] * percent;
          }
        }
      } else if (k === BACKGROUND_SIZE$1) {
        st.forEach(function (item, i) {
          if (v[i]) {
            item[0][0] += v[i][0] * percent;
            item[1][0] += v[i][1] * percent;
          }
        });
      } else if (k === BACKGROUND_POSITION_X$1 || k === BACKGROUND_POSITION_Y$1) {
        st.forEach(function (item, i) {
          if (v[i]) {
            item[0] += v[i] * percent;
          }
        });
      } else if (GRADIENT_HASH$2.hasOwnProperty(k)) {
        st.forEach(function (st2, i) {
          var v2 = v[i];

          if (!v2) {
            return;
          }

          var _v21 = _slicedToArray(v2, 4),
              c = _v21[0],
              d = _v21[1],
              p = _v21[2],
              z = _v21[3];

          if (GRADIENT_TYPE$2.hasOwnProperty(st2.k)) {
            for (var _i18 = 0, _len9 = Math.min(st2.v.length, c.length); _i18 < _len9; _i18++) {
              var a = st2.v[_i18];
              var b = c[_i18];
              a[0][0] += b[0][0] * percent;
              a[0][1] += b[0][1] * percent;
              a[0][2] += b[0][2] * percent;
              a[0][3] += b[0][3] * percent;

              if (a[1] && b[1]) {
                a[1][0] += b[1] * percent;
              }
            }

            if (st2.k === 'linear' && st2.d !== undefined && d !== undefined) {
              if (Array.isArray(d)) {
                st2.d[0] += d[0] * percent;
                st2.d[1] += d[1] * percent;
                st2.d[2] += d[2] * percent;
                st2.d[3] += d[3] * percent;
              } else {
                st2.d += d * percent;
              }
            }

            if (st2.k === 'radial') {
              if (st2.z !== undefined && z !== undefined) {
                st2.z[0] += z[0] * percent;
                st2.z[1] += z[1] * percent;
                st2.z[2] += z[2] * percent;
                st2.z[3] += z[3] * percent;
                st2.z[4] += z[4] * percent;
              } else if (st2.p !== undefined && p !== undefined) {
                st2.p[0][0] += p[0] * percent;
                st2.p[1][0] += p[1] * percent;
              }
            } else if (st2.k === 'conic' && st2.d !== undefined && d !== undefined) {
              st2.d += d * percent;
              st2.p[0][0] += p[0] * percent;
              st2.p[1][0] += p[1] * percent;
            }
          } // fill纯色
          else {
              st2[0] += c[0] * percent;
              st2[1] += c[1] * percent;
              st2[2] += c[2] * percent;
              st2[3] += c[3] * percent;
            }
        });
      } // color可能超限[0,255]，但浏览器已经做了限制，无需关心
      else if (COLOR_HASH$2.hasOwnProperty(k)) {
          st = st[0];
          st[0] += v[0] * percent;
          st[1] += v[1] * percent;
          st[2] += v[2] * percent;
          st[3] += v[3] * percent;
        } else if (GEOM$3.hasOwnProperty(k)) {
          var _st = style[k];

          if (GEOM$3[k][tagName] && isFunction$3(GEOM$3[k][tagName].calIncrease)) {
            var fn = GEOM$3[k][tagName].calIncrease;

            if (target.isMulti) {
              style[k] = _st.map(function (item, i) {
                return fn(item, v[i], percent);
              });
            } else {
              style[k] = fn(_st, v, percent);
            }
          } else if (target.isMulti) {
            if (k === 'points' || k === 'controls') {
              for (var _i19 = 0, _len10 = Math.min(_st.length, v.length); _i19 < _len10; _i19++) {
                var o = _st[_i19];
                var n = v[_i19];

                if (!isNil$4(o) && !isNil$4(n)) {
                  for (var _j6 = 0, len2 = Math.min(o.length, n.length); _j6 < len2; _j6++) {
                    var o2 = o[_j6];
                    var n2 = n[_j6];

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
                var st2 = _st[i];

                if (!isNil$4(item) && !isNil$4(st2)) {
                  for (var _i20 = 0, _len11 = Math.min(st2.length, item.length); _i20 < _len11; _i20++) {
                    var _o = st2[_i20];
                    var _n = item[_i20];

                    if (!isNil$4(_o) && !isNil$4(_n)) {
                      st2[_i20] += _n * percent;
                    }
                  }
                }
              });
            } else {
              v.forEach(function (item, i) {
                if (!isNil$4(item) && !isNil$4(_st[i])) {
                  _st[i] += item * percent;
                }
              });
            }
          } else {
            if (k === 'points' || k === 'controls') {
              for (var _i21 = 0, _len12 = Math.min(_st.length, v.length); _i21 < _len12; _i21++) {
                var _o2 = _st[_i21];
                var _n2 = v[_i21];

                if (!isNil$4(_o2) && !isNil$4(_n2)) {
                  for (var _j7 = 0, _len13 = Math.min(_o2.length, _n2.length); _j7 < _len13; _j7++) {
                    if (!isNil$4(_o2[_j7]) && !isNil$4(_n2[_j7])) {
                      _o2[_j7] += _n2[_j7] * percent;
                    }
                  }
                }
              }
            } else if (k === 'controlA' || k === 'controlB') {
              if (!isNil$4(_st[0]) && !isNil$4(v[0])) {
                _st[0] += v[0] * percent;
              }

              if (!isNil$4(_st[1]) && !isNil$4(v[1])) {
                _st[1] += v[1] * percent;
              }
            } else {
              if (!isNil$4(_st) && !isNil$4(v)) {
                style[k] += v * percent;
              }
            }
          }
        } else if (k === OPACITY$1 || k === Z_INDEX$1) {
          style[k] += v * percent;
        }
    };

    for (var i = 0, len = transition.length; i < len; i++) {
      _loop(i);
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
  var I_ASSIGNING = 0;
  var I_IN_FPS = 1;
  var I_IS_DELAY = 2;
  var I_BEGIN = 3;
  var I_END = 4;
  var I_FINISHED = 5;
  var I_NEXT_BEGIN = 6;
  var I_FIRST_PLAY = 7;
  var I_FRAME_CB = 8;
  var I_PLAY_CB = 9;
  var I_TARGET = 10;
  var I_ROOT = 11;
  var I_FRAMES = 12;
  var I_FRAMES_R = 13;
  var I_CURRENT_TIME = 14;
  var I_NEXT_TIME = 15;
  var I_STYLE = 16;
  var I_DURATION = 17;
  var I_ITERATIONS = 18;
  var I_FILL = 19;
  var I_PLAYBACK_RATE = 20;
  var I_PLAY_COUNT = 21;
  var I_PLAY_STATE = 22;
  var I_DESTROYED = 23;
  var I_START_TIME = 24;
  var I_FPS_TIME = 25;
  var I_EASING = 26;
  var I_ENTER_FRAME = 27;
  var I_DELAY = 28;
  var I_END_DELAY = 29;
  var I_KEYS = 30;
  var I_ORIGIN_STYLE = 31;
  var I_CURRENT_FRAMES = 32;
  var I_CURRENT_FRAME = 33;
  var I_SPF_LIMIT = 34;
  var I_FPS = 35;
  var I_DIRECTION = 36;
  var I_CAL_DIFF_TIME = 37;
  var I_FIRST_ENTER = 38;
  var I_STAY_BEGIN = 39;
  var I_STAY_END = 40;
  var I_IS2 = 41;
  var I_END_TIME = 42;
  var I_NODE_CONFIG = 43;
  var I_ROOT_CONFIG = 44;
  var I_OUT_BEGIN_DELAY = 45;

  var Animation = /*#__PURE__*/function (_Event) {
    _inherits(Animation, _Event);

    var _super = _createSuper(Animation);

    function Animation(target, list, options) {
      var _this;

      _classCallCheck(this, Animation);

      _this = _super.call(this);
      _this.__id = uuid++;
      list = clone$1(list || []);

      if (Array.isArray(list)) {
        list = list.filter(function (item) {
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
          list = nl;
        } else {
          list = [];
        }

      if (isNumber$1(options)) {
        _this.__options = {
          duration: options
        };
        options = _this.__options;
      }

      var op = _this.__options = options || {
        duration: 0
      };
      var root = target.root;
      var config = _this.__config = _this.__config = [false, // assigning
      false, // inFps
      false, // isDelay
      false, // begin
      false, // end
      false, // finished
      false, // nextBegin
      true, // firstPlay
      _this.__frameCb, null, // playCb
      target, root, null, // frames
      null, // framesR
      0, // currentTime
      0, // nextTime
      {}, // style
      0, // duration
      1, // iterations
      'none', // fill
      1, // playbackRate
      0, // playCount
      'idle', false, // destroy
      0, // startTime
      0, // fpsTime
      op.easing, false, // enterFrame
      0, // delay
      0, // endDelay
      null, // keys,
      null, // originStyle,
      null, // currentFrames
      null, // currentFrame
      false, // spfLimit
      60, // fps
      'normal', // direction
      _this.__calDiffTime, true, // firstEnter,
      false, // stayBegin
      false, // stayEnd
      false, // is2
      0, // endTime
      target.__config, // nodeConfig
      root.__config, // rootConfig
      false // outBeginDelay
      ];
      var iterations = _this.iterations = op.iterations;
      var duration = _this.duration = op.duration;

      var _this$__init = _this.__init(list, iterations, duration, op.easing, target),
          _this$__init2 = _slicedToArray(_this$__init, 4),
          frames = _this$__init2[0],
          framesR = _this$__init2[1],
          keys = _this$__init2[2],
          originStyle = _this$__init2[3];

      config[I_FRAMES] = frames;
      config[I_FRAMES_R] = framesR;
      config[I_KEYS] = keys;
      config[I_ORIGIN_STYLE] = originStyle;

      if (frames.length === 2) {
        config[I_IS2] = true;
        config[I_END_TIME] = frames[1][FRAME_TIME];
      }

      var fps = parseInt(op.fps) || 0;

      if (fps <= 0) {
        fps = 60;
      }

      _this.fps = fps;
      _this.spfLimit = op.spfLimit;
      _this.delay = op.delay;
      _this.endDelay = op.endDelay;
      _this.playbackRate = op.playbackRate;
      _this.fill = op.fill;
      _this.iterations = op.iterations;
      _this.direction = op.direction;
      return _this;
    }

    _createClass(Animation, [{
      key: "__init",
      value: function __init(list, iterations, duration, easing, target) {
        if (list.length < 1) {
          return [[], [], [], {}];
        } // 过滤时间非法的，过滤后续offset<=前面的


        var offset = -1;
        var tagName = target.tagName;

        var _loop2 = function _loop2(_i22, _len14) {
          var current = list[_i22];

          if (current.hasOwnProperty('offset')) {
            current.offset = parseFloat(current.offset) || 0;
            current.offset = Math.max(0, current.offset);
            current.offset = Math.min(1, current.offset); // 超过区间[0,1]

            if (isNaN(current.offset) || current.offset < 0 || current.offset > 1) {
              list.splice(_i22, 1);
              _i22--;
              _len14--;
              i = _i22;
              len = _len14;
              return "continue";
            } // <=前面的
            else if (current.offset <= offset) {
                list.splice(_i22, 1);
                _i22--;
                _len14--;
                i = _i22;
                len = _len14;
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
          i = _i22;
          len = _len14;
        };

        for (var i = 0, len = list.length; i < len; i++) {
          var _ret = _loop2(i, len);

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


        for (var _i23 = 1, _len15 = list.length; _i23 < _len15; _i23++) {
          var start = list[_i23]; // 从i=1开始offset一定>0，找到下一个有offset的，均分中间无声明的

          if (!start.hasOwnProperty('offset')) {
            var end = void 0;
            var j = _i23 + 1;

            for (; j < _len15; j++) {
              end = list[j];

              if (end.hasOwnProperty('offset')) {
                break;
              }
            }

            var num = j - _i23 + 1;
            start = list[_i23 - 1];
            var per = (end.offset - start.offset) / num;

            for (var k = _i23; k < j; k++) {
              var item = list[k];
              item.offset = start.offset + per * (k + 1 - _i23);
            }

            _i23 = j;
          }
        }

        var frames = []; // 换算每一关键帧样式标准化

        list.forEach(function (item) {
          frames.push(framing(item, duration, easing));
        }); // 为方便两帧之间计算变化，强制统一所有帧的css属性相同，没有写的为节点的当前样式currentStyle

        var keys = unify(frames, target);
        inherit(frames, keys, target); // 存储原本样式以便恢复用

        var style = target.style,
            props = target.props;
        var originStyle = {};
        keys.forEach(function (k) {
          if (isGeom$2(tagName, k)) {
            originStyle[k] = props[k];
          }

          originStyle[k] = style[k];
        }); // 再计算两帧之间的变化，存入transition属性

        var length = frames.length;
        var prev = frames[0];

        for (var _i24 = 1; _i24 < length; _i24++) {
          var next = frames[_i24];
          prev = calFrame(prev, next, keys, target, tagName);
        } // 反向存储帧的倒排结果


        var framesR = clone$1(frames).reverse();
        framesR.forEach(function (item) {
          item[FRAME_TIME] = duration - item[FRAME_TIME];
          item[FRAME_TRANSITION] = [];
        });
        prev = framesR[0];

        for (var _i25 = 1; _i25 < length; _i25++) {
          var _next = framesR[_i25];
          prev = calFrame(prev, _next, keys, target, tagName);
        }

        return [frames, framesR, keys, originStyle];
      }
    }, {
      key: "__clean",
      value: function __clean(isFinish) {
        var __config = this.__config;

        this.__cancelTask();

        __config[I_NEXT_TIME] = 0;
        var restore;
        var style = __config[I_STYLE];
        var keys = __config[I_KEYS];
        var target = __config[I_TARGET];

        if (isFinish) {
          __config[I_CURRENT_TIME] = __config[I_DELAY] + __config[I_DURATION] + __config[I_END_DELAY];

          if (__config[I_PLAY_STATE] === 'finish') {
            return;
          }

          __config[I_PLAY_STATE] = 'finish'; // cancel需要清除finish根据情况保留

          if (!__config[I_STAY_END]) {
            __config[I_STYLE] = {};
            restore = true;
          }
        } else {
          __config[I_PLAY_COUNT] = __config[I_CURRENT_TIME] = 0;

          if (__config[I_PLAY_STATE] === 'idle') {
            return;
          }

          __config[I_PLAY_STATE] = 'idle';
          __config[I_STYLE] = {};
          restore = true;
        } // 动画取消结束不停留在最后一帧需要还原target原本的样式，需要对比目前是否是由本动画赋值的


        if (restore) {
          keys.forEach(function (k) {
            if (GEOM$3.hasOwnProperty(k)) {
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
      key: "__frameCb",
      value: function __frameCb(__config, diff, isDelay) {
        this.emit(Event.FRAME, diff, isDelay);

        if (__config[I_FIRST_PLAY]) {
          __config[I_FIRST_PLAY] = false;
          this.emit(Event.PLAY);
        }

        if (isFunction$3(__config[I_PLAY_CB])) {
          __config[I_PLAY_CB].call(this, diff, isDelay);

          __config[I_PLAY_CB] = null;
        }
      }
    }, {
      key: "__calDiffTime",
      value: function __calDiffTime(__config, diff) {
        var playbackRate = __config[I_PLAYBACK_RATE];
        var spfLimit = __config[I_SPF_LIMIT];
        var fps = __config[I_FPS];
        var v = __config[I_CURRENT_TIME] = __config[I_NEXT_TIME]; // 定帧限制每帧时间间隔最大为spf

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

        __config[I_NEXT_TIME] += diff;
        return [v, diff];
      }
    }, {
      key: "play",
      value: function play(cb) {
        var __config = this.__config;
        var isDestroyed = __config[I_DESTROYED];
        var duration = __config[I_DURATION];
        var playState = __config[I_PLAY_STATE];
        var frames = __config[I_FRAMES];

        if (isDestroyed || duration <= 0 || frames.length < 1) {
          return this;
        }

        if (playState === 'running') {
          return this;
        }

        this.__cancelTask();

        __config[I_PLAY_CB] = cb;
        __config[I_PLAY_STATE] = 'running'; // 每次play调用标识第一次运行，需响应play事件和回调

        __config[I_FIRST_PLAY] = true; // 防止finish/cancel事件重复触发，每次播放重置

        this.__hasFin = false;
        this.__hasCancel = false; // 只有第一次调用会进初始化，另外finish/cancel视为销毁也会重新初始化

        if (!__config[I_ENTER_FRAME]) {
          __config[I_ENTER_FRAME] = true;
          var framesR = __config[I_FRAMES_R];
          var direction = __config[I_DIRECTION]; // 初始化根据方向确定帧序列

          __config[I_CURRENT_FRAMES] = {
            reverse: true,
            'alternate-reverse': true
          }.hasOwnProperty(direction) ? framesR : frames;
          __config[I_CURRENT_TIME] = __config[I_NEXT_TIME] = __config[I_FPS_TIME] = 0;
        } // 添加每帧回调且立刻执行，本次执行调用refreshTask也是下一帧再渲染，frame的每帧都是下一帧


        frame.offFrame(this);
        frame.onFrame(this);
        __config[I_START_TIME] = frame.__now;
        return this;
      }
    }, {
      key: "__before",
      value: function __before(diff) {
        var __config = this.__config;
        var target = __config[I_TARGET];
        var fps = __config[I_FPS];
        var playCount = __config[I_PLAY_COUNT];
        var currentFrames = __config[I_CURRENT_FRAMES];
        var iterations = __config[I_ITERATIONS];
        var stayBegin = __config[I_STAY_BEGIN];
        var stayEnd = __config[I_STAY_END];
        var delay = __config[I_DELAY];
        var root = __config[I_ROOT];
        var is2 = __config[I_IS2];
        var endTime = __config[I_END_TIME];
        var duration = __config[I_DURATION];
        var endDelay = __config[I_END_DELAY];
        var length = currentFrames.length; // 用本帧和上帧时间差，计算累加运行时间currentTime，以便定位当前应该处于哪个时刻

        var _config$I_CAL_DIFF_T = __config[I_CAL_DIFF_TIME](__config, diff),
            _config$I_CAL_DIFF_T2 = _slicedToArray(_config$I_CAL_DIFF_T, 2),
            currentTime = _config$I_CAL_DIFF_T2[0],
            d = _config$I_CAL_DIFF_T2[1];

        diff = d; // 增加的fps功能，当<60时计算跳帧，每帧运行依旧累加时间，达到fps时重置，第一帧强制不跳

        if (!__config[I_FIRST_ENTER] && fps < 60) {
          diff = __config[I_FPS_TIME] += diff;

          if (diff < 1000 / fps) {
            __config[I_IN_FPS] = true;
            return;
          }

          __config[I_FPS_TIME] = 0;
        }

        __config[I_FIRST_ENTER] = false; // delay仅第一次生效

        if (playCount > 0) ; // 还没过前置delay
        else if (currentTime < delay) {
            if (stayBegin) {
              var _currentFrame = __config[I_CURRENT_FRAME] = currentFrames[0];

              var _current = _currentFrame[FRAME_STYLE];
              genBeforeRefresh(_current, __config[I_KEYS], __config, root, target);
            } // 即便不刷新，依旧执行帧回调，同时标明让后续第一帧响应begin


            __config[I_OUT_BEGIN_DELAY] = true;
            __config[I_IS_DELAY] = true;
            return;
          } // 减去delay，计算在哪一帧，仅第一次生效


        if (playCount === 0) {
          currentTime -= delay;
        }

        if (currentTime === 0 || __config[I_OUT_BEGIN_DELAY]) {
          __config[I_OUT_BEGIN_DELAY] = false;
          __config[I_BEGIN] = true;
        } // 只有2帧可优化，否则2分查找当前帧


        var i, frameTime;

        if (is2) {
          i = currentTime < endTime ? 0 : 1;
          frameTime = endTime;
        } else {
          i = binarySearch(0, length - 1, currentTime, currentFrames);
          frameTime = currentFrames[i][FRAME_TIME];
        } // 最后一帧结束动画


        var isLastFrame = i === length - 1;
        var percent = 0;

        if (isLastFrame) ; // 否则根据目前到下一帧的时间差，计算百分比，再反馈到变化数值上
        else if (is2) {
            percent = currentTime / duration;
          } else {
            var total = currentFrames[i + 1][FRAME_TIME] - frameTime;
            percent = (currentTime - frameTime) / total;
          }

        var isLastCount = playCount >= iterations - 1;
        var inEndDelay,
            currentFrame = currentFrames[i],
            current;
        __config[I_CURRENT_FRAME] = currentFrame;
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
          inEndDelay = isLastCount && currentTime < duration + endDelay; // 停留对比最后一帧，endDelay可能会多次进入这里，第二次进入样式相等不再重绘
          // 多次播放时到达最后一帧也会显示

          if (stayEnd || !isLastCount) {
            current = cloneStyle$2(currentFrame[FRAME_STYLE], __config[I_KEYS]);
          } // 不停留或超过endDelay则计算还原，有endDelay且fill模式不停留会再次进入这里
          else {
              current = cloneStyle$2(__config[I_ORIGIN_STYLE], __config[I_KEYS]);
            } // 非尾每轮次放完增加次数和计算下轮准备


          if (!isLastCount) {
            // duration特别短的情况循环减去
            while (__config[I_NEXT_TIME] >= duration) {
              __config[I_NEXT_TIME] -= duration;
              playCount = ++__config[I_PLAY_COUNT];
            }

            __config[I_NEXT_BEGIN] = true;
          } // 尾次考虑endDelay，非尾次无endDelay结束动画
          else if (!inEndDelay) {
              __config[I_NEXT_TIME] = 0;
              playCount = ++__config[I_PLAY_COUNT]; // 判断次数结束每帧enterFrame调用，inEndDelay时不结束

              if (playCount >= iterations) {
                frame.offFrame(this);
              }
            } // endDelay中无需特殊处理nextTime

        } else {
          current = calIntermediateStyle(currentFrame, __config[I_KEYS], percent, target);
        } // 无论两帧之间是否有变化，都生成计算结果赋给style，去重在root做


        genBeforeRefresh(current, __config[I_KEYS], __config, root, target); // 每次循环完触发end事件，最后一次循环触发finish

        if (isLastFrame && (!inEndDelay || isLastCount)) {
          __config[I_END] = true;

          if (playCount >= iterations) {
            __config[I_FINISHED] = true;

            this.__clean(true);
          }
        }
      }
    }, {
      key: "__after",
      value: function __after(diff) {
        var __config = this.__config;
        __config[I_ASSIGNING] = false;

        if (__config[I_IN_FPS]) {
          __config[I_IN_FPS] = false;
          return;
        }

        __config[I_FRAME_CB].call(this, __config, diff, __config[I_IS_DELAY]);

        __config[I_IS_DELAY] = false;

        if (__config[I_BEGIN]) {
          __config[I_BEGIN] = false;
          this.emit(Event.BEGIN, __config[I_PLAY_COUNT]);
        }

        if (__config[I_END]) {
          __config[I_END] = false;
          this.emit(Event.END, __config[I_PLAY_COUNT] - 1);
          var direction = __config[I_DIRECTION];
          var frames = __config[I_FRAMES];
          var framesR = __config[I_FRAMES_R];
          var isAlternate = {
            alternate: true,
            'alternate-reverse': true
          }.hasOwnProperty(direction); // 有正反播放需要重设帧序列

          if (isAlternate) {
            var isEven = __config[I_PLAY_COUNT] % 2 === 0;

            if (direction === 'alternate') {
              __config[I_CURRENT_FRAMES] = isEven ? frames : framesR;
            } else {
              __config[I_CURRENT_FRAMES] = isEven ? framesR : frames;
            }
          }
        }

        if (__config[I_NEXT_BEGIN]) {
          __config[I_NEXT_BEGIN] = false;
          __config[I_BEGIN] = true;
        }

        if (__config[I_FINISHED]) {
          __config[I_BEGIN] = __config[I_END] = __config[I_IS_DELAY] = __config[I_FINISHED] = __config[I_IN_FPS] = __config[I_ENTER_FRAME] = false;
          __config[I_PLAY_STATE] = 'finished';
          this.emit(Event.FINISH);
        }
      }
    }, {
      key: "pause",
      value: function pause(silence) {
        var __config = this.__config;
        var isDestroyed = __config[I_DESTROYED];
        var duration = __config[I_DURATION];
        var pending = this.pending;

        if (isDestroyed || duration <= 0 || pending) {
          return this;
        }

        __config[I_PLAY_STATE] = 'paused';

        this.__cancelTask();

        if (!silence) {
          this.emit(Event.PAUSE);
        }

        return this;
      }
    }, {
      key: "resume",
      value: function resume(cb) {
        var __config = this.__config;
        var isDestroyed = __config[I_DESTROYED];
        var duration = __config[I_DURATION];
        var playState = __config[I_PLAY_STATE];

        if (isDestroyed || duration <= 0 || playState !== 'paused') {
          return this;
        }

        return this.play(cb);
      }
    }, {
      key: "finish",
      value: function finish(cb) {
        var self = this;
        var __config = self.__config;
        var isDestroyed = __config[I_DESTROYED];
        var duration = __config[I_DURATION];
        var playState = __config[I_PLAY_STATE];
        var frames = __config[I_FRAMES];

        if (isDestroyed || duration <= 0 || frames.length < 1 || playState === 'finished' || playState === 'idle') {
          return self;
        } // 先清除所有回调任务，多次调用finish也会清除只留最后一次


        self.__cancelTask();

        var root = __config[I_ROOT];
        var originStyle = __config[I_ORIGIN_STYLE];

        if (root) {
          var current; // 停留在最后一帧

          if (__config[I_STAY_END]) {
            __config[I_CURRENT_FRAME] = frames[frames.length - 1];
            current = frames[frames.length - 1][FRAME_STYLE];
          } else {
            current = originStyle;
          }

          root.addRefreshTask({
            __before: function __before() {
              __config[I_ASSIGNING] = true;
              genBeforeRefresh(current, __config[I_KEYS], __config, root, __config[I_TARGET]);

              self.__clean(true);
            },
            __after: function __after(diff) {
              if (!self.__hasFin) {
                self.__hasFin = true;
                __config[I_ASSIGNING] = false;

                __config[I_FRAME_CB].call(self, __config, diff);

                __config[I_BEGIN] = __config[I_END] = __config[I_IS_DELAY] = __config[I_FINISHED] = __config[I_IN_FPS] = __config[I_ENTER_FRAME] = false;
                self.emit(Event.FINISH);
              }

              if (isFunction$3(cb)) {
                cb.call(self, diff);
              }
            }
          });
        }

        return self;
      }
    }, {
      key: "cancel",
      value: function cancel(cb) {
        var self = this;
        var __config = self.__config;
        var isDestroyed = __config[I_DESTROYED];
        var duration = __config[I_DURATION];
        var playState = __config[I_PLAY_STATE];
        var frames = __config[I_FRAMES];

        if (isDestroyed || duration <= 0 || playState === 'idle' || frames.length < 1) {
          return self;
        }

        self.__cancelTask();

        var root = __config[I_ROOT];
        var originStyle = __config[I_ORIGIN_STYLE];

        if (root) {
          root.addRefreshTask({
            __before: function __before() {
              __config[I_ASSIGNING] = true;
              genBeforeRefresh(originStyle, __config[I_KEYS], __config, root, __config[I_TARGET]);

              self.__clean();
            },
            __after: function __after(diff) {
              if (!self.__hasCancel) {
                self.__hasCancel = true;
                __config[I_ASSIGNING] = false;

                __config[I_FRAME_CB].call(self, __config, diff);

                __config[I_BEGIN] = __config[I_END] = __config[I_IS_DELAY] = __config[I_FINISHED] = __config[I_IN_FPS] = __config[I_ENTER_FRAME] = false;
                self.emit(Event.CANCEL);
              }

              if (isFunction$3(cb)) {
                cb.call(self, diff);
              }
            }
          });
        }

        return self;
      }
    }, {
      key: "gotoAndPlay",
      value: function gotoAndPlay(v, options, cb) {
        var __config = this.__config;
        var isDestroyed = __config[I_DESTROYED];
        var duration = __config[I_DURATION];
        var frames = __config[I_FRAMES];
        var delay = __config[I_DELAY];
        var endDelay = __config[I_END_DELAY];

        if (isDestroyed || duration <= 0 || frames.length < 1) {
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
        var _this2 = this;

        var __config = this.__config;
        var isDestroyed = __config[I_DESTROYED];
        var duration = __config[I_DURATION];
        var frames = __config[I_FRAMES];
        var delay = __config[I_DELAY];
        var endDelay = __config[I_END_DELAY];

        if (isDestroyed || duration <= 0 || frames.length < 1) {
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
          __config[I_PLAY_STATE] = 'paused';

          _this2.__cancelTask();

          if (isFunction$3(cb)) {
            cb.call(_this2, diff);
          }
        });
      } // 同步赋予，用在extendAnimate

    }, {
      key: "assignCurrentStyle",
      value: function assignCurrentStyle() {
        var __config = this.__config;
        var style = __config[I_STYLE];
        var target = __config[I_TARGET];
        var keys = __config[I_KEYS];
        keys.forEach(function (i) {
          if (style.hasOwnProperty(i)) {
            var v = style[i]; // geom的属性变化

            if (GEOM$3.hasOwnProperty(i)) {
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
        var __config = this.__config;
        var duration = __config[I_DURATION];
        __config[I_PLAY_STATE] = 'paused';

        this.__cancelTask();

        if (isNaN(v) || v < 0) {
          throw new Error('Param of gotoAnd(Play/Stop) is illegal: ' + v);
        }

        if (isFrame) {
          v = (v - 1) / this.spf;
        }

        if (excludeDelay) {
          v += __config[I_DELAY];
        } // 超过时间长度需要累加次数


        while (v > duration && __config[I_PLAY_COUNT] < __config[I_ITERATIONS] - 1) {
          __config[I_PLAY_COUNT]++;
          v -= duration;
        } // 在时间范围内设置好时间，复用play直接跳到播放点


        __config[I_NEXT_TIME] = v;
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
      key: "__setTarget",
      value: function __setTarget(target) {
        this.__target = target;
        this.__config[I_TARGET] = target;
        this.__config[I_NODE_CONFIG] = target.__config;
      }
    }, {
      key: "__cancelTask",
      value: function __cancelTask() {
        frame.offFrame(this);
        this.__config[I_PLAY_CB] = null;
      }
    }, {
      key: "__destroy",
      value: function __destroy(sync) {
        var self = this;
        var __config = self.__config;

        if (__config[I_DESTROYED]) {
          return;
        }

        self.removeControl(); // clean异步执行，因为里面的样式还原需要等到下一帧，否则同步执行清除后，紧接着的新同步动画获取不到currentStyle

        if (sync) {
          self.__clean();

          __config[I_TARGET] = null;
        } else {
          frame.nextFrame({
            __before: function __before() {
              self.__clean();

              __config[I_TARGET] = null;
            }
          });
        }

        __config[I_START_TIME] = 0;
        __config[I_DESTROYED] = true;
      }
    }, {
      key: "__checkModify",
      value: function __checkModify() {
        var __config = this.__config;

        if (__config[I_PLAY_STATE] !== 'idle' && __config[I_PLAY_STATE] !== 'finished') {
          inject.warn('Modification will not come into effect when animation is running');
        }
      }
    }, {
      key: "id",
      get: function get() {
        return this.__id;
      }
    }, {
      key: "target",
      get: function get() {
        return this.__config[I_TARGET];
      }
    }, {
      key: "root",
      get: function get() {
        return this.__config[I_ROOT];
      }
    }, {
      key: "keys",
      get: function get() {
        return this.__config[I_KEYS];
      }
    }, {
      key: "style",
      get: function get() {
        return this.__config[I_STYLE];
      }
    }, {
      key: "options",
      get: function get() {
        return this.__options;
      }
    }, {
      key: "duration",
      get: function get() {
        return this.__config[I_DURATION];
      },
      set: function set(v) {
        v = Math.max(0, parseFloat(v) || 0);
        var __config = this.__config;

        if (__config[I_DURATION] !== v) {
          __config[I_DURATION] = v;
          __config[I_END_TIME] = v;

          this.__checkModify();
        }

        return v;
      }
    }, {
      key: "delay",
      get: function get() {
        return this.__config[I_DELAY];
      },
      set: function set(v) {
        v = Math.max(0, parseFloat(v) || 0);
        var __config = this.__config;

        if (__config[I_DELAY] !== v) {
          __config[I_DELAY] = v;

          this.__checkModify();
        }

        return v;
      }
    }, {
      key: "endDelay",
      get: function get() {
        return this.__config[I_END_DELAY];
      },
      set: function set(v) {
        v = Math.max(0, parseFloat(v) || 0);
        var __config = this.__config;

        if (__config[I_END_DELAY] !== v) {
          __config[I_END_DELAY] = v;

          this.__checkModify();
        }

        return v;
      }
    }, {
      key: "fps",
      get: function get() {
        return this.__config[I_FPS];
      },
      set: function set(v) {
        v = parseInt(v) || 60;
        var __config = this.__config;

        if (__config[I_FPS] !== v) {
          if (v <= 0) {
            v = 60;
          }

          __config[I_FPS] = v;
        }

        return v;
      }
    }, {
      key: "spf",
      get: function get() {
        return 1 / this.fps;
      }
    }, {
      key: "iterations",
      get: function get() {
        return this.__config[I_ITERATIONS];
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

        var __config = this.__config;

        if (__config[I_ITERATIONS] !== v) {
          __config[I_ITERATIONS] = v;
        }

        return v;
      }
    }, {
      key: "fill",
      get: function get() {
        return this.__config[I_FILL];
      },
      set: function set(v) {
        v = v || 'none';
        var __config = this.__config;

        if (__config[I_FILL] !== v) {
          __config[I_FILL] = v;

          this.__checkModify();
        }

        __config[I_STAY_BEGIN] = {
          backwards: true,
          both: true
        }.hasOwnProperty(v);
        __config[I_STAY_END] = {
          forwards: true,
          both: true
        }.hasOwnProperty(v);
        return v;
      }
    }, {
      key: "direction",
      get: function get() {
        return this.__config[I_DIRECTION];
      },
      set: function set(v) {
        v = v || 'normal';
        var __config = this.__config;

        if (__config[I_DIRECTION] !== v) {
          __config[I_DIRECTION] = v;

          this.__checkModify();
        }

        return v;
      }
    }, {
      key: "frames",
      get: function get() {
        return this.__config[I_FRAMES];
      }
    }, {
      key: "framesR",
      get: function get() {
        return this.__config[I_FRAMES_R];
      }
    }, {
      key: "playbackRate",
      get: function get() {
        return this.__config[I_PLAYBACK_RATE];
      },
      set: function set(v) {
        v = parseFloat(v) || 1;

        if (v <= 0) {
          v = 1;
        }

        var __config = this.__config;

        if (__config[I_PLAYBACK_RATE] !== v) {
          __config[I_PLAYBACK_RATE] = v;
        }

        return v;
      }
    }, {
      key: "easing",
      get: function get() {
        return this.__config[I_EASING];
      }
    }, {
      key: "startTime",
      get: function get() {
        return this.__config[I_START_TIME];
      }
    }, {
      key: "currentTime",
      get: function get() {
        return this.__config[I_CURRENT_TIME];
      },
      set: function set(v) {
        v = Math.max(0, parseFloat(v) || 0);
        var __config = this.__config;

        if (__config[I_CURRENT_TIME] !== v) {
          __config[I_CURRENT_TIME] = v;
          __config[I_NEXT_TIME] = v;
        }

        return v;
      }
    }, {
      key: "nextTime",
      get: function get() {
        return this.__config[I_NEXT_TIME];
      },
      set: function set(v) {
        v = Math.max(0, parseFloat(v) || 0);
        var __config = this.__config;

        if (__config[I_NEXT_TIME] !== v) {
          __config[I_NEXT_TIME] = v;
        }

        return v;
      }
    }, {
      key: "pending",
      get: function get() {
        return this.__config[I_PLAY_STATE] !== 'running';
      }
    }, {
      key: "finished",
      get: function get() {
        return this.__config[I_PLAY_STATE] === 'finished';
      }
    }, {
      key: "playState",
      get: function get() {
        return this.__config[I_PLAY_STATE];
      }
    }, {
      key: "playCount",
      get: function get() {
        return this.__config[I_PLAY_COUNT];
      },
      set: function set(v) {
        v = Math.max(0, parseInt(v) || 0);
        var __config = this.__config;

        if (__config[I_PLAY_COUNT] !== v) {
          __config[I_PLAY_COUNT] = v;
        }

        return v;
      }
    }, {
      key: "isDestroyed",
      get: function get() {
        return this.__config[I_DESTROYED];
      }
    }, {
      key: "animating",
      get: function get() {
        var __config = this.__config;
        var playState = __config[I_PLAY_STATE];

        if (playState === 'idle') {
          return false;
        }

        return playState !== 'finished' || __config[I_STAY_END] || __config[I_STAY_BEGIN];
      }
    }, {
      key: "spfLimit",
      get: function get() {
        var __config = this.__config;
        return __config[I_SPF_LIMIT];
      },
      set: function set(v) {
        if (util.isNumber(v) || /^\d/.test(v)) {
          v = Math.max(0, parseInt(v) || 0);
        } else {
          v = !!v;
        }

        var __config = this.__config;

        if (__config[I_SPF_LIMIT] !== v) {
          __config[I_SPF_LIMIT] = v;
        }

        return v;
      }
    }, {
      key: "assigning",
      get: function get() {
        return this.__config[I_ASSIGNING];
      }
    }]);

    return Animation;
  }(Event);

  var _TRANSFORMS;
  var STYLE_KEY$5 = enums.STYLE_KEY,
      _enums$STYLE_KEY$8 = enums.STYLE_KEY,
      TRANSLATE_X$3 = _enums$STYLE_KEY$8.TRANSLATE_X,
      TRANSLATE_Y$2 = _enums$STYLE_KEY$8.TRANSLATE_Y,
      OPACITY$2 = _enums$STYLE_KEY$8.OPACITY,
      FILTER$2 = _enums$STYLE_KEY$8.FILTER;
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
    TRANSFORM_ALL: 7,
    //                               111
    OPACITY: 8,
    //                                    1000
    FILTER: 16,
    //                                   10000
    MIX_BLEND_MODE: 32,
    //                          100000
    REPAINT: 64,
    //                                1000000
    // 高位表示reflow
    REFLOW: 128 //                               10000000

  };
  var TRANSFORMS = (_TRANSFORMS = {}, _defineProperty(_TRANSFORMS, STYLE_KEY$5.SCALE_X, true), _defineProperty(_TRANSFORMS, STYLE_KEY$5.SCALE_Y, true), _defineProperty(_TRANSFORMS, STYLE_KEY$5.ROTATE_Z, true), _defineProperty(_TRANSFORMS, STYLE_KEY$5.TRANSFORM, true), _defineProperty(_TRANSFORMS, STYLE_KEY$5.TRANSFORM_ORIGIN, true), _TRANSFORMS);
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

      if (k === TRANSLATE_X$3) {
        return ENUM.TRANSLATE_X;
      } else if (k === TRANSLATE_Y$2) {
        return ENUM.TRANSLATE_Y;
      } else if (TRANSFORMS.hasOwnProperty(k)) {
        return ENUM.TRANSFORM;
      } else if (k === OPACITY$2) {
        return ENUM.OPACITY;
      } else if (k === FILTER$2) {
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
    },
    LAYOUT: 1,
    OFFSET: 0
  }, ENUM);
  o$1.TRANSFORMS = TRANSFORMS;

  var SIZE = [8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096];
  var NUMBER$3 = [8, 8, 8, 8, 8, 4, 2, 1, 1, 1];
  var MAX = SIZE[SIZE.length - 1];
  var HASH = {};

  var Page = /*#__PURE__*/function () {
    function Page(size, number) {
      _classCallCheck(this, Page);

      this.__size = size;
      this.__number = number;
      this.__free = this.__total = number * number;
      size *= number;
      var offScreen = this.__canvas = inject.getCacheCanvas(size, size, null, number);

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
            inject.error('Can not create off-screen for page');
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
      key: "CONFIG",
      set: function set(v) {
        if (!v || !Array.isArray(v.SIZE) || !Array.isArray(v.NUMBER)) {
          return;
        }

        SIZE = v.SIZE;
        NUMBER$3 = v.NUMBER;
        MAX = SIZE[SIZE.length - 1];
      },
      get: function get() {
        return {
          SIZE: SIZE,
          NUMBER: NUMBER$3
        };
      }
    }, {
      key: "MAX",
      get: function get() {
        return MAX;
      }
    }]);

    return Page;
  }();

  var _enums$STYLE_KEY$9 = enums.STYLE_KEY,
      TRANSFORM_ORIGIN$3 = _enums$STYLE_KEY$9.TRANSFORM_ORIGIN,
      TRANSFORM$3 = _enums$STYLE_KEY$9.TRANSFORM,
      _enums$NODE_KEY$1 = enums.NODE_KEY,
      NODE_OPACITY = _enums$NODE_KEY$1.NODE_OPACITY,
      NODE_CACHE = _enums$NODE_KEY$1.NODE_CACHE,
      NODE_CACHE_FILTER = _enums$NODE_KEY$1.NODE_CACHE_FILTER,
      NODE_CACHE_OVERFLOW = _enums$NODE_KEY$1.NODE_CACHE_OVERFLOW; // 根据一个共享cache的信息，生成一个独立的离屏canvas，一般是filter,mask用

  function genSingle(cache) {
    var size = cache.size,
        sx1 = cache.sx1,
        sy1 = cache.sy1,
        width = cache.width,
        height = cache.height,
        bbox = cache.bbox;
    var offScreen = inject.getCacheCanvas(width, height);
    offScreen.coords = [1, 1];
    offScreen.bbox = bbox;
    offScreen.size = size;
    offScreen.sx1 = sx1;
    offScreen.sy1 = sy1;
    offScreen.dx = cache.dx;
    offScreen.dy = cache.dy;
    offScreen.dbx = cache.dbx;
    offScreen.dby = cache.dby;
    offScreen.width = width;
    offScreen.height = height;
    return offScreen;
  }

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
          ctx.setTransform(1, 0, 0, 1, 0, 0);
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
      value: function __appendData(sx1, sy1) {
        this.sx1 = sx1; // padding原点坐标

        this.sy1 = sy1;

        var _this$coords = _slicedToArray(this.coords, 2),
            xc = _this$coords[0],
            yc = _this$coords[1];

        var bbox = this.bbox;
        this.dx = xc - bbox[0]; // cache坐标和box原点的差值

        this.dy = yc - bbox[1];
        this.dbx = sx1 - bbox[0]; // 原始x1/y1和box原点的差值

        this.dby = sy1 - bbox[1];
      }
    }, {
      key: "clear",
      value: function clear() {
        var ctx = this.ctx;

        if (this.enabled && ctx && this.available) {
          ctx.setTransform(1, 0, 0, 1, 0, 0);

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
        if (isNaN(bbox[0]) || isNaN(bbox[1]) || isNaN(bbox[2]) || isNaN(bbox[3])) {
          return;
        }

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
      /**
       * 复制cache的一块出来单独作为cacheFilter，尺寸边距保持一致，用webgl的滤镜
       * @param cache
       * @param v
       * @returns {{canvas: *, ctx: *, release(): void, available: boolean, draw()}}
       */

    }, {
      key: "genBlur",
      value: function genBlur(cache, v) {
        var _cache$coords = _slicedToArray(cache.coords, 2),
            x = _cache$coords[0],
            y = _cache$coords[1],
            size = cache.size,
            canvas = cache.canvas,
            sx1 = cache.sx1,
            sy1 = cache.sy1,
            width = cache.width,
            height = cache.height,
            bbox = cache.bbox;

        var offScreen = inject.getCacheCanvas(width, height);
        offScreen.ctx.filter = "blur(".concat(v, "px)");
        offScreen.ctx.drawImage(canvas, x - 1, y - 1, width, height, 0, 0, width, height);
        offScreen.ctx.filter = 'none';
        offScreen.draw();
        offScreen.bbox = bbox;
        offScreen.coords = [1, 1];
        offScreen.size = size;
        offScreen.sx1 = sx1;
        offScreen.sy1 = sy1;
        offScreen.dx = cache.dx;
        offScreen.dy = cache.dy;
        offScreen.dbx = cache.dbx;
        offScreen.dby = cache.dby;
        offScreen.width = width;
        offScreen.height = height;
        return offScreen;
      }
    }, {
      key: "genMask",
      value: function genMask(target, next, isClip, transform, tfo) {
        var cacheMask = genSingle(target);
        var list = [];

        while (next && next.isMask) {
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
          var __config = item.__config;
          var cacheOverflow = __config[NODE_CACHE_OVERFLOW],
              cacheFilter = __config[NODE_CACHE_FILTER],
              cache = __config[NODE_CACHE];
          var source = cacheOverflow && cacheOverflow.available && cacheOverflow;

          if (!source) {
            source = cacheFilter && cacheFilter.available && cacheFilter;
          }

          if (!source) {
            source = cache && cache.available && cache;
          }

          if (source) {
            ctx.globalAlpha = __config[NODE_OPACITY];
            Cache.drawCache(source, cacheMask, item.computedStyle[TRANSFORM$3], [1, 0, 0, 1, 0, 0], item.computedStyle[TRANSFORM_ORIGIN$3].slice(0), inverse);
          } // 没有内容或者img没加载成功导致没有内容，不要报错
          else if (item.__hasContent) {
              inject.error('CacheMask is oversize');
            }
        });
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = isClip ? 'source-out' : 'source-in';
        Cache.drawCache(target, cacheMask);
        ctx.globalCompositeOperation = 'source-over';
        cacheMask.draw(ctx);
        return cacheMask;
      }
      /**
       * 如果不超过bbox，直接用已有的total/filter/mask，否则生成一个新的
       */

    }, {
      key: "genOverflow",
      value: function genOverflow(target, node) {
        var bbox = target.bbox;
        var sx = node.sx,
            sy = node.sy,
            outerWidth = node.outerWidth,
            outerHeight = node.outerHeight;
        var xe = sx + outerWidth;
        var ye = sy + outerHeight;

        if (bbox[0] < sx || bbox[1] < sy || bbox[2] > xe || bbox[3] > ye) {
          var cacheOverflow = genSingle(target);
          var ctx = cacheOverflow.ctx;
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.globalAlpha = 1;
          Cache.drawCache(target, cacheOverflow);
          cacheOverflow.draw(ctx);
          ctx.globalCompositeOperation = 'destination-in';
          ctx.fillStyle = '#FFF';
          ctx.beginPath();
          ctx.rect(sx - bbox[0] + 1, sy - bbox[1] + 1, outerWidth, outerHeight);
          ctx.fill();
          ctx.closePath();
          ctx.globalCompositeOperation = 'source-over';
          return cacheOverflow;
        }
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

            newCache.sx1 = cache.sx1;
            newCache.sy1 = cache.sy1;
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
            sx1 = target.sx1,
            sy1 = target.sy1,
            ctx = target.ctx,
            dbx = target.dbx,
            dby = target.dby;

        var _source$coords = _slicedToArray(source.coords, 2),
            x = _source$coords[0],
            y = _source$coords[1],
            canvas = source.canvas,
            sx2 = source.sx1,
            sy2 = source.sy1,
            dbx2 = source.dbx,
            dby2 = source.dby,
            width = source.width,
            height = source.height;

        var ox = tx + sx2 - sx1 + dbx - dbx2;
        var oy = ty + sy2 - sy1 + dby - dby2;

        if (transform && matrix && tfo) {
          tfo[0] += ox;
          tfo[1] += oy;
          var m = tf.calMatrixByOrigin(transform, tfo);
          matrix = mx.multiply(matrix, m);

          if (inverse) {
            // 很多情况mask和target相同matrix，可简化计算
            if (util.equalArr(matrix, inverse)) {
              matrix = [1, 0, 0, 1, 0, 0];
            } else {
              inverse = mx.inverse(inverse);
              matrix = mx.multiply(inverse, matrix);
            }
          }

          ctx.setTransform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);
        }

        ctx.drawImage(canvas, x - 1, y - 1, width, height, ox - 1, oy - 1, width, height);
      }
    }, {
      key: "draw",
      value: function draw(ctx, opacity, matrix, cache) {
        ctx.globalAlpha = opacity;
        ctx.setTransform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);

        var _cache$coords3 = _slicedToArray(cache.coords, 2),
            x = _cache$coords3[0],
            y = _cache$coords3[1],
            canvas = cache.canvas,
            sx1 = cache.sx1,
            sy1 = cache.sy1,
            dbx = cache.dbx,
            dby = cache.dby,
            width = cache.width,
            height = cache.height;

        ctx.drawImage(canvas, x - 1, y - 1, width, height, sx1 - 1 - dbx, sy1 - 1 - dby, width, height);
      }
    }, {
      key: "MAX",
      get: function get() {
        return Page.MAX - 2;
      }
    }]);

    return Cache;
  }();

  _defineProperty(Cache, "NUM", 5);

  var STYLE_KEY$6 = enums.STYLE_KEY,
      STYLE_RV_KEY$2 = enums.STYLE_RV_KEY,
      style2Upper$2 = enums.style2Upper,
      _enums$STYLE_KEY$a = enums.STYLE_KEY,
      BORDER_TOP_LEFT_RADIUS = _enums$STYLE_KEY$a.BORDER_TOP_LEFT_RADIUS,
      BORDER_TOP_RIGHT_RADIUS = _enums$STYLE_KEY$a.BORDER_TOP_RIGHT_RADIUS,
      BORDER_BOTTOM_LEFT_RADIUS = _enums$STYLE_KEY$a.BORDER_BOTTOM_LEFT_RADIUS,
      BORDER_BOTTOM_RIGHT_RADIUS = _enums$STYLE_KEY$a.BORDER_BOTTOM_RIGHT_RADIUS,
      PADDING_LEFT$1 = _enums$STYLE_KEY$a.PADDING_LEFT,
      PADDING_RIGHT$1 = _enums$STYLE_KEY$a.PADDING_RIGHT,
      PADDING_TOP$1 = _enums$STYLE_KEY$a.PADDING_TOP,
      PADDING_BOTTOM$1 = _enums$STYLE_KEY$a.PADDING_BOTTOM,
      MARGIN_LEFT$1 = _enums$STYLE_KEY$a.MARGIN_LEFT,
      MARGIN_TOP$1 = _enums$STYLE_KEY$a.MARGIN_TOP,
      MARGIN_BOTTOM$1 = _enums$STYLE_KEY$a.MARGIN_BOTTOM,
      MARGIN_RIGHT$1 = _enums$STYLE_KEY$a.MARGIN_RIGHT,
      BORDER_LEFT_WIDTH$1 = _enums$STYLE_KEY$a.BORDER_LEFT_WIDTH,
      BORDER_TOP_WIDTH$1 = _enums$STYLE_KEY$a.BORDER_TOP_WIDTH,
      BORDER_BOTTOM_WIDTH$1 = _enums$STYLE_KEY$a.BORDER_BOTTOM_WIDTH,
      BORDER_RIGHT_WIDTH$1 = _enums$STYLE_KEY$a.BORDER_RIGHT_WIDTH,
      TOP$1 = _enums$STYLE_KEY$a.TOP,
      RIGHT$1 = _enums$STYLE_KEY$a.RIGHT,
      BOTTOM$1 = _enums$STYLE_KEY$a.BOTTOM,
      LEFT$1 = _enums$STYLE_KEY$a.LEFT,
      POSITION$1 = _enums$STYLE_KEY$a.POSITION,
      DISPLAY$2 = _enums$STYLE_KEY$a.DISPLAY,
      WIDTH$3 = _enums$STYLE_KEY$a.WIDTH,
      HEIGHT$3 = _enums$STYLE_KEY$a.HEIGHT,
      MATRIX$3 = _enums$STYLE_KEY$a.MATRIX,
      TRANSLATE_X$4 = _enums$STYLE_KEY$a.TRANSLATE_X,
      TRANSLATE_Y$3 = _enums$STYLE_KEY$a.TRANSLATE_Y,
      TRANSFORM$4 = _enums$STYLE_KEY$a.TRANSFORM,
      SCALE_X$3 = _enums$STYLE_KEY$a.SCALE_X,
      SCALE_Y$3 = _enums$STYLE_KEY$a.SCALE_Y,
      ROTATE_Z$2 = _enums$STYLE_KEY$a.ROTATE_Z,
      SKEW_X$2 = _enums$STYLE_KEY$a.SKEW_X,
      SKEW_Y$2 = _enums$STYLE_KEY$a.SKEW_Y,
      TRANSFORM_ORIGIN$4 = _enums$STYLE_KEY$a.TRANSFORM_ORIGIN,
      BACKGROUND_POSITION_X$2 = _enums$STYLE_KEY$a.BACKGROUND_POSITION_X,
      BACKGROUND_POSITION_Y$2 = _enums$STYLE_KEY$a.BACKGROUND_POSITION_Y,
      BACKGROUND_SIZE$2 = _enums$STYLE_KEY$a.BACKGROUND_SIZE,
      BACKGROUND_COLOR$1 = _enums$STYLE_KEY$a.BACKGROUND_COLOR,
      BACKGROUND_IMAGE$1 = _enums$STYLE_KEY$a.BACKGROUND_IMAGE,
      BACKGROUND_REPEAT = _enums$STYLE_KEY$a.BACKGROUND_REPEAT,
      BOX_SHADOW$2 = _enums$STYLE_KEY$a.BOX_SHADOW,
      OPACITY$3 = _enums$STYLE_KEY$a.OPACITY,
      Z_INDEX$2 = _enums$STYLE_KEY$a.Z_INDEX,
      BORDER_TOP_STYLE = _enums$STYLE_KEY$a.BORDER_TOP_STYLE,
      BORDER_RIGHT_STYLE = _enums$STYLE_KEY$a.BORDER_RIGHT_STYLE,
      BORDER_BOTTOM_STYLE = _enums$STYLE_KEY$a.BORDER_BOTTOM_STYLE,
      BORDER_LEFT_STYLE = _enums$STYLE_KEY$a.BORDER_LEFT_STYLE,
      FILTER$3 = _enums$STYLE_KEY$a.FILTER,
      OVERFLOW = _enums$STYLE_KEY$a.OVERFLOW,
      MIX_BLEND_MODE = _enums$STYLE_KEY$a.MIX_BLEND_MODE,
      BORDER_TOP_COLOR = _enums$STYLE_KEY$a.BORDER_TOP_COLOR,
      BORDER_BOTTOM_COLOR = _enums$STYLE_KEY$a.BORDER_BOTTOM_COLOR,
      BORDER_LEFT_COLOR = _enums$STYLE_KEY$a.BORDER_LEFT_COLOR,
      BORDER_RIGHT_COLOR = _enums$STYLE_KEY$a.BORDER_RIGHT_COLOR,
      FONT_STYLE$3 = _enums$STYLE_KEY$a.FONT_STYLE,
      COLOR$4 = _enums$STYLE_KEY$a.COLOR,
      VISIBILITY$2 = _enums$STYLE_KEY$a.VISIBILITY,
      POINTER_EVENTS$1 = _enums$STYLE_KEY$a.POINTER_EVENTS,
      BORDER_TOP = _enums$STYLE_KEY$a.BORDER_TOP,
      BORDER_RIGHT = _enums$STYLE_KEY$a.BORDER_RIGHT,
      BORDER_BOTTOM = _enums$STYLE_KEY$a.BORDER_BOTTOM,
      BORDER_LEFT = _enums$STYLE_KEY$a.BORDER_LEFT,
      BACKGROUND_CLIP$1 = _enums$STYLE_KEY$a.BACKGROUND_CLIP,
      _enums$UPDATE_KEY$1 = enums.UPDATE_KEY,
      UPDATE_NODE$1 = _enums$UPDATE_KEY$1.UPDATE_NODE,
      UPDATE_FOCUS = _enums$UPDATE_KEY$1.UPDATE_FOCUS,
      UPDATE_STYLE$1 = _enums$UPDATE_KEY$1.UPDATE_STYLE,
      UPDATE_OVERWRITE = _enums$UPDATE_KEY$1.UPDATE_OVERWRITE,
      UPDATE_KEYS$1 = _enums$UPDATE_KEY$1.UPDATE_KEYS,
      UPDATE_CONFIG$1 = _enums$UPDATE_KEY$1.UPDATE_CONFIG,
      STRUCT_HAS_MASK = enums.STRUCT_KEY.STRUCT_HAS_MASK,
      _enums$NODE_KEY$2 = enums.NODE_KEY,
      NODE_TAG_NAME = _enums$NODE_KEY$2.NODE_TAG_NAME,
      NODE_CACHE_STYLE = _enums$NODE_KEY$2.NODE_CACHE_STYLE,
      NODE_CURRENT_STYLE = _enums$NODE_KEY$2.NODE_CURRENT_STYLE,
      NODE_COMPUTED_STYLE = _enums$NODE_KEY$2.NODE_COMPUTED_STYLE,
      NODE_STYLE = _enums$NODE_KEY$2.NODE_STYLE,
      NODE_STRUCT$1 = _enums$NODE_KEY$2.NODE_STRUCT,
      NODE_OPACITY$1 = _enums$NODE_KEY$2.NODE_OPACITY,
      NODE_MATRIX_EVENT = _enums$NODE_KEY$2.NODE_MATRIX_EVENT,
      NODE_MATRIX = _enums$NODE_KEY$2.NODE_MATRIX,
      NODE_LIMIT_CACHE = _enums$NODE_KEY$2.NODE_LIMIT_CACHE,
      NODE_BLUR_VALUE = _enums$NODE_KEY$2.NODE_BLUR_VALUE,
      NODE_HAS_CONTENT = _enums$NODE_KEY$2.NODE_HAS_CONTENT,
      NODE_REFRESH_LV = _enums$NODE_KEY$2.NODE_REFRESH_LV,
      NODE_CACHE$1 = _enums$NODE_KEY$2.NODE_CACHE,
      NODE_CACHE_TOTAL = _enums$NODE_KEY$2.NODE_CACHE_TOTAL,
      NODE_CACHE_FILTER$1 = _enums$NODE_KEY$2.NODE_CACHE_FILTER,
      NODE_CACHE_MASK = _enums$NODE_KEY$2.NODE_CACHE_MASK,
      NODE_CACHE_OVERFLOW$1 = _enums$NODE_KEY$2.NODE_CACHE_OVERFLOW,
      NODE_IS_DESTROYED$1 = _enums$NODE_KEY$2.NODE_IS_DESTROYED,
      NODE_DEFS_CACHE = _enums$NODE_KEY$2.NODE_DEFS_CACHE,
      NODE_DOM_PARENT = _enums$NODE_KEY$2.NODE_DOM_PARENT;
  var AUTO$2 = unit.AUTO,
      PX$4 = unit.PX,
      PERCENT$5 = unit.PERCENT,
      STRING$2 = unit.STRING,
      INHERIT$4 = unit.INHERIT;
  var clone$2 = util.clone,
      int2rgba$1 = util.int2rgba,
      rgba2int$3 = util.rgba2int,
      joinArr$1 = util.joinArr,
      isNil$5 = util.isNil;
  var calRelative$1 = css.calRelative;
  var canvasPolygon$1 = painter.canvasPolygon,
      svgPolygon$1 = painter.svgPolygon;
  var GEOM$4 = o.GEOM;
  var contain = o$1.contain,
      NONE = o$1.NONE,
      TRANSFORM_ALL = o$1.TRANSFORM_ALL,
      TF = o$1.TRANSFORM,
      REFLOW = o$1.REFLOW,
      REPAINT$1 = o$1.REPAINT,
      TX = o$1.TRANSLATE_X,
      TY = o$1.TRANSLATE_Y,
      OP = o$1.OPACITY,
      FT = o$1.FILTER;

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

  function renderBgc(renderMode, color, x, y, w, h, ctx, defs, xom, btlr, btrr, bbrr, bblr) {
    var method = arguments.length > 13 && arguments[13] !== undefined ? arguments[13] : 'fill';
    // radial渐变ellipse形状会有matrix，用以从圆缩放到椭圆
    var matrix, cx, cy;

    if (Array.isArray(color)) {
      matrix = color[1];
      cx = color[2];
      cy = color[3];
      color = color[0];
    } // border-radius使用三次贝塞尔曲线模拟1/4圆角，误差在[0, 0.000273]之间


    var list = border.calRadius(x, y, w, h, btlr, btrr, bbrr, bblr);

    if (!list) {
      list = [[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y]];
    } // 椭圆有matrix，用逆矩阵变化点来完成


    if (matrix) {
      var tfo = [cx, cy];
      matrix = tf.calMatrixByOrigin(matrix, tfo);
      var t = mx.inverse(matrix);
      list = list.map(function (item) {
        if (!item || !item.length) {
          return null;
        }

        var arr = [];

        for (var i = 0, len = item.length; i < len; i += 2) {
          var p = mx.calPoint([item[i], item[i + 1]], t);
          arr.push(p[0]);
          arr.push(p[1]);
        }

        return arr;
      });
    }

    if (renderMode === mode.CANVAS) {
      if (matrix) {
        ctx.save();
        var me = xom.matrixEvent;
        matrix = mx.multiply(me, matrix);
        ctx.setTransform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);
      }

      ctx.beginPath();

      if (ctx.fillStyle !== color) {
        ctx.fillStyle = color;
      }

      canvasPolygon$1(ctx, list);
      ctx[method]();
      ctx.closePath();

      if (matrix) {
        ctx.restore();
      }
    } else if (renderMode === mode.SVG) {
      var d = svgPolygon$1(list);
      xom.virtualDom.bb.push({
        type: 'item',
        tagName: 'path',
        props: [['d', d], ['fill', color]]
      }); // 椭圆渐变独有

      if (matrix) {
        var bb = xom.virtualDom.bb;
        bb[bb.length - 1].props.push(['transform', "matrix(".concat(joinArr$1(matrix, ','), ")")]);
      }
    }
  }

  function renderConic(renderMode, color, x, y, w, h, ctx, defs, xom, btlr, btrr, bbrr, bblr) {
    // border-radius使用三次贝塞尔曲线模拟1/4圆角，误差在[0, 0.000273]之间
    var list = border.calRadius(x, y, w, h, btlr, btrr, bbrr, bblr);

    if (!list) {
      list = [[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y]];
    }

    if (renderMode === mode.CANVAS) {
      var alpha = ctx.globalAlpha;
      ctx.globalAlpha = alpha * 0.5; // 割圆法的叠加会加深色彩，这里还原模拟下透明度

      ctx.save();
      ctx.beginPath();
      canvasPolygon$1(ctx, list);
      ctx.clip();
      ctx.closePath();
      color.forEach(function (item) {
        ctx.beginPath();
        canvasPolygon$1(ctx, item[0]);
        ctx.fillStyle = item[1];
        ctx.fill();
        ctx.closePath();
      });
      ctx.restore();
      ctx.globalAlpha = alpha;
    } else if (renderMode === mode.SVG) {
      var v = {
        tagName: 'clipPath',
        children: [{
          tagName: 'path',
          props: [['d', svgPolygon$1(list)], ['fill', '#FFF']]
        }]
      };

      xom.__config[NODE_DEFS_CACHE].push(v);

      var clip = defs.add(v);
      color.forEach(function (item) {
        xom.virtualDom.bb.push({
          type: 'item',
          tagName: 'path',
          props: [['d', svgPolygon$1(item[0])], ['fill', item[1]], ['clip-path', 'url(#' + clip + ')']]
        });
      });
    }
  }

  var borderRadiusKs = [BORDER_TOP_LEFT_RADIUS, BORDER_TOP_RIGHT_RADIUS, BORDER_BOTTOM_RIGHT_RADIUS, BORDER_BOTTOM_LEFT_RADIUS];

  function calBorderRadius(w, h, currentStyle, computedStyle) {
    var noRadius = true;
    borderRadiusKs.forEach(function (k) {
      computedStyle[k] = currentStyle[k].map(function (item, i) {
        if (item[0] > 0) {
          noRadius = false;
        } else {
          return 0;
        }

        if (item[1] === PX$4) {
          return Math.max(0, item[0]);
        } else {
          return Math.max(0, item[0] * (i ? h : w) * 0.01);
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
      if (item[1] === PX$4) {
        res.push(item[0]);
      } else if (item[1] === PERCENT$5) {
        res.push(item[0] * (i ? h : w) * 0.01);
      } else if (item[1] === AUTO$2) {
        res.push(-1);
      } else if (item[1] === STRING$2) {
        res.push(item[0] === 'contain' ? -2 : -3);
      }
    });
    return res;
  }

  function calBackgroundPosition(position, container, size) {
    if (position[1] === PX$4) {
      return position[0];
    } else if (position[1] === PERCENT$5) {
      return (container - size) * position[0] * 0.01;
    }

    return 0;
  }

  function renderBoxShadow(renderMode, ctx, defs, data, xom, x1, y1, x4, y4, outerWidth, outerHeight) {
    var _data = _slicedToArray(data, 6),
        x = _data[0],
        y = _data[1],
        blur = _data[2],
        spread = _data[3],
        color = _data[4],
        inset = _data[5];

    var c = int2rgba$1(color);
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
            var v = {
              tagName: 'filter',
              props: [['x', -d / outerWidth], ['y', -d / outerHeight], ['width', 1 + d * 2 / outerWidth], ['height', 1 + d * 2 / outerHeight]],
              children: [{
                tagName: 'feDropShadow',
                props: [['dx', 0], ['dy', 0], ['stdDeviation', blur * 0.5], ['flood-color', c]]
              }]
            };

            xom.__config[NODE_DEFS_CACHE].push(v);

            var filter = defs.add(v);
            var v2 = {
              tagName: 'clipPath',
              children: [{
                tagName: 'path',
                props: [['d', svgPolygon$1(_cross2) + svgPolygon$1(box.slice(0).reverse())], ['fill', '#FFF']]
              }]
            };
            var clip = defs.add(v2);

            xom.__config[NODE_DEFS_CACHE].push(v2);

            xom.virtualDom.bb.push({
              type: 'item',
              tagName: 'path',
              props: [['d', svgPolygon$1(box)], ['fill', c], ['clip-path', 'url(#' + clip + ')']]
            });
            v = {
              tagName: 'clipPath',
              children: [{
                tagName: 'path',
                props: [['d', svgPolygon$1(_cross2)], ['fill', '#FFF']]
              }]
            };
            clip = defs.add(v);

            xom.__config[NODE_DEFS_CACHE].push(v);

            xom.virtualDom.bb.push({
              type: 'item',
              tagName: 'path',
              props: [['d', svgPolygon$1([[_xa2, _ya2], [_xb2, _ya2], [_xb2, _yb2], [x1 - n, _yb2], [x1 - n, y4 + n], [x4 + n, y4 + n], [x4 + n, y1 - n], [x1 - n, y1 - n], [x1 - n, _yb2], [_xa2, _yb2], [_xa2, _ya2]])], ['fill', '#FFF'], ['filter', 'url(#' + filter + ')'], ['clip-path', 'url(#' + clip + ')']]
            });
          } else {
            var _v = {
              tagName: 'filter',
              props: [['x', -d / outerWidth], ['y', -d / outerHeight], ['width', 1 + d * 2 / outerWidth], ['height', 1 + d * 2 / outerHeight]],
              children: [{
                tagName: 'feDropShadow',
                props: [['dx', x], ['dy', y], ['stdDeviation', blur * 0.5], ['flood-color', c]]
              }]
            };

            var _filter = defs.add(_v);

            xom.__config[NODE_DEFS_CACHE].push(_v);

            _v = {
              tagName: 'clipPath',
              children: [{
                tagName: 'path',
                props: [['d', svgPolygon$1(box)], ['fill', '#FFF']]
              }]
            };

            var _clip = defs.add(_v);

            xom.__config[NODE_DEFS_CACHE].push(_v);

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
            var _v2 = {
              tagName: 'filter',
              props: [['x', -d / outerWidth], ['y', -d / outerHeight], ['width', 1 + d * 2 / outerWidth], ['height', 1 + d * 2 / outerHeight]],
              children: [{
                tagName: 'feDropShadow',
                props: [['dx', 0], ['dy', 0], ['stdDeviation', blur * 0.5], ['flood-color', c]]
              }]
            };

            var _filter2 = defs.add(_v2);

            xom.__config[NODE_DEFS_CACHE].push(_v2);

            _v2 = {
              tagName: 'clipPath',
              children: [{
                tagName: 'path',
                props: [['d', svgPolygon$1(box) + svgPolygon$1(_blurBox.slice(0).reverse())], ['fill', '#FFF']]
              }]
            };

            var _clip2 = defs.add(_v2);

            xom.__config[NODE_DEFS_CACHE].push(_v2);

            xom.virtualDom.bb.push({
              type: 'item',
              tagName: 'path',
              props: [['d', svgPolygon$1(_blurBox)], ['fill', c], ['clip-path', 'url(#' + _clip2 + ')']]
            });
            _v2 = {
              tagName: 'clipPath',
              children: [{
                tagName: 'path',
                props: [['d', (_cross3 ? svgPolygon$1([[_cross3[0], _cross3[1]], [_cross3[2], _cross3[1]], [_cross3[2], _cross3[3]], [_cross3[0], _cross3[3]], [_cross3[0], _cross3[1]]].reverse()) : '') + svgPolygon$1(box) + svgPolygon$1(_blurBox) + svgPolygon$1(outer)], ['fill', '#FFF']]
              }]
            };
            _clip2 = defs.add(_v2);

            xom.__config[NODE_DEFS_CACHE].push(_v2);

            xom.virtualDom.bb.push({
              type: 'item',
              tagName: 'path',
              props: [['d', svgPolygon$1(_blurBox)], ['fill', '#FFF'], ['filter', 'url(#' + _filter2 + ')'], ['clip-path', 'url(#' + _clip2 + ')']]
            });
          } else {
            var _v3 = {
              tagName: 'filter',
              props: [['x', -d / outerWidth], ['y', -d / outerHeight], ['width', 1 + d * 2 / outerWidth], ['height', 1 + d * 2 / outerHeight]],
              children: [{
                tagName: 'feDropShadow',
                props: [['dx', x], ['dy', y], ['stdDeviation', blur * 0.5], ['flood-color', c]]
              }]
            };

            var _filter3 = defs.add(_v3);

            xom.__config[NODE_DEFS_CACHE].push(_v3);

            _v3 = {
              tagName: 'clipPath',
              children: [{
                tagName: 'path',
                props: [['d', svgPolygon$1(box) + svgPolygon$1(outer)], ['fill', '#FFF']]
              }]
            };

            var _clip3 = defs.add(_v3);

            xom.__config[NODE_DEFS_CACHE].push(_v3);

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

      _this.__cacheDefs = []; // svg专用，缓存渲染时使用已有的defs，diff过程用，否则会defs被清空

      var config = _this.__config;
      config[NODE_TAG_NAME] = tagName;
      config[NODE_CACHE_STYLE] = _this.__cacheStyle;
      config[NODE_CURRENT_STYLE] = _this.__currentStyle;
      config[NODE_COMPUTED_STYLE] = _this.__computedStyle;
      config[NODE_REFRESH_LV] = REFLOW;
      config[NODE_STYLE] = _this.__style;
      config[NODE_MATRIX_EVENT] = [];
      config[NODE_DEFS_CACHE] = _this.__cacheDefs;
      _this.__frameAnimateList = [];
      return _this;
    }

    _createClass(Xom, [{
      key: "__structure",
      value: function __structure(i, lv, j) {
        var res = _get(_getPrototypeOf(Xom.prototype), "__structure", this).call(this, i, lv, j);

        if (this.__hasMask) {
          res[STRUCT_HAS_MASK] = this.__hasMask;
        }

        this.__config[NODE_STRUCT$1] = res;
        return res;
      } // 获取margin/padding的实际值

    }, {
      key: "__mp",
      value: function __mp(currentStyle, computedStyle, w) {
        var _this2 = this;

        ['Top', 'Right', 'Bottom', 'Left'].forEach(function (k) {
          var a = STYLE_KEY$6[style2Upper$2('margin' + k)];
          var b = STYLE_KEY$6[style2Upper$2('padding' + k)];
          computedStyle[a] = _this2.__mpWidth(currentStyle[a], w);
          computedStyle[b] = _this2.__mpWidth(currentStyle[b], w);
        });
      }
    }, {
      key: "__mpWidth",
      value: function __mpWidth(mp, w) {
        if (mp[1] === PX$4) {
          return mp[0];
        } else if (mp[1] === PERCENT$5) {
          return mp[0] * w * 0.01;
        }

        return 0;
      }
    }, {
      key: "__ioSize",
      value: function __ioSize(w, h) {
        var computedStyle = this.computedStyle;
        this.__clientWidth = w += computedStyle[PADDING_LEFT$1] + computedStyle[PADDING_RIGHT$1];
        this.__clientHeight = h += computedStyle[PADDING_TOP$1] + computedStyle[PADDING_BOTTOM$1];
        this.__offsetWidth = w += computedStyle[BORDER_LEFT_WIDTH$1] + computedStyle[BORDER_RIGHT_WIDTH$1];
        this.__offsetHeight = h += computedStyle[BORDER_TOP_WIDTH$1] + computedStyle[BORDER_BOTTOM_WIDTH$1];
        this.__outerWidth = w + computedStyle[MARGIN_LEFT$1] + computedStyle[MARGIN_RIGHT$1];
        this.__outerHeight = h + computedStyle[MARGIN_TOP$1] + computedStyle[MARGIN_BOTTOM$1];
      } // 换算margin/padding为px单位

    }, {
      key: "__calMp",
      value: function __calMp(v, w) {
        var n = 0;

        if (v[1] === PX$4) {
          n += v[0];
        } else if (v[1] === PERCENT$5) {
          v[0] *= w * 0.01;
          v[1] = PX$4;
          n += v[0];
        }

        return n;
      } // absolute且无尺寸时，isVirtual标明先假布局一次计算尺寸，还有flex列计算时
      // fromAbs为absolute特有

    }, {
      key: "__layout",
      value: function __layout(data, isVirtual, fromAbs) {
        css.computeReflow(this, this.isShadowRoot);
        var w = data.w;
        var isDestroyed = this.isDestroyed,
            currentStyle = this.currentStyle,
            computedStyle = this.computedStyle,
            __config = this.__config;
        var display = computedStyle[DISPLAY$2];
        var width = currentStyle[WIDTH$3],
            position = currentStyle[POSITION$1];

        this.__cancelCache();

        this.__layoutData = clone$2(data);
        __config[NODE_REFRESH_LV] = REFLOW;
        __config[NODE_LIMIT_CACHE] = false; // 防止display:none不统计mask，virtual也忽略

        if (!isVirtual) {
          var next = this.next; // mask关系只有布局才会变更，普通渲染关系不会改变，clip也是mask的一种

          if (!this.isMask && next && next.isMask) {
            var count = 0;

            while (next) {
              if (next.isMask) {
                count++;
              } else {
                break;
              }

              next = next.next;
            }

            this.__hasMask = count;
          }
        }

        this.__ox = this.__oy = 0;

        if (isDestroyed || display === 'none') {
          this.__width = this.__height = this.__clientWidth = this.__clientHeight = this.__offsetWidth = this.__offsetHeight = this.__outerWidth = this.__outerHeight = computedStyle[WIDTH$3] = computedStyle[HEIGHT$3] = 0;
          this.__x = data.x;
          this.__y = data.y;

          this.__layoutNone();

          return;
        } // margin/padding在abs前已经计算过了，无需二次计算


        if (!fromAbs) {
          this.__mp(currentStyle, computedStyle, w);
        }

        if (width[1] !== AUTO$2) {
          switch (width[1]) {
            case PX$4:
              w = width[0];
              break;

            case PERCENT$5:
              w *= width[0] * 0.01;
              break;
          }
        } // 3种布局，默认block


        if (display === 'flex') {
          this.__layoutFlex(data, isVirtual);
        } else if (display === 'inline') {
          this.__layoutInline(data, isVirtual);
        } else {
          this.__layoutBlock(data, isVirtual);
        } // relative渲染时做偏移，百分比基于父元素，若父元素没有定高则为0


        if (position === 'relative') {
          var top = currentStyle[TOP$1],
              right = currentStyle[RIGHT$1],
              bottom = currentStyle[BOTTOM$1],
              left = currentStyle[LEFT$1];
          var parent = this.parent;

          if (top[1] !== AUTO$2) {
            var n = calRelative$1(currentStyle, TOP$1, top, parent);

            this.__offsetY(n);

            computedStyle[TOP$1] = n;
            computedStyle[BOTTOM$1] = 'auto';
          } else if (bottom[1] !== AUTO$2) {
            var _n = calRelative$1(currentStyle, BOTTOM$1, bottom, parent);

            this.__offsetY(-_n);

            computedStyle[BOTTOM$1] = _n;
            computedStyle[TOP$1] = 'auto';
          } else {
            computedStyle[TOP$1] = computedStyle[BOTTOM$1] = 'auto';
          }

          if (left[1] !== AUTO$2) {
            var _n2 = calRelative$1(currentStyle, LEFT$1, left, parent, true);

            this.__offsetX(_n2);

            computedStyle[LEFT$1] = _n2;
            computedStyle[RIGHT$1] = 'auto';
          } else if (right[1] !== AUTO$2) {
            var _n3 = calRelative$1(currentStyle, RIGHT$1, right, parent, true);

            this.__offsetX(-_n3);

            computedStyle[RIGHT$1] = _n3;
            computedStyle[LEFT$1] = 'auto';
          } else {
            computedStyle[LEFT$1] = computedStyle[RIGHT$1] = 'auto';
          }
        } else if (currentStyle[POSITION$1] !== 'absolute') {
          computedStyle[TOP$1] = computedStyle[BOTTOM$1] = computedStyle[LEFT$1] = computedStyle[RIGHT$1] = 'auto';
        }

        this.__sx = this.x + this.ox;
        this.__sy = this.y + this.oy; // 计算结果存入computedStyle

        var tw = computedStyle[WIDTH$3] = this.width;
        var th = computedStyle[HEIGHT$3] = this.height; // virtual时计算返回给abs布局用，普通的在各自layout做

        if (isVirtual) {
          this.__ioSize(tw, th);
        } // 动态json引用时动画暂存，第一次布局时处理这些动画到root的animateController上


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
      }
    }, {
      key: "__layoutNone",
      value: function __layoutNone() {
        var computedStyle = this.computedStyle;
        computedStyle[DISPLAY$2] = 'none';
        computedStyle[MARGIN_TOP$1] = computedStyle[MARGIN_RIGHT$1] = computedStyle[MARGIN_BOTTOM$1] = computedStyle[MARGIN_LEFT$1] = computedStyle[PADDING_TOP$1] = computedStyle[PADDING_RIGHT$1] = computedStyle[PADDING_BOTTOM$1] = computedStyle[PADDING_LEFT$1] = 0;
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
        var width = currentStyle[WIDTH$3],
            height = currentStyle[HEIGHT$3];
        var borderTopWidth = computedStyle[BORDER_TOP_WIDTH$1],
            borderRightWidth = computedStyle[BORDER_RIGHT_WIDTH$1],
            borderBottomWidth = computedStyle[BORDER_BOTTOM_WIDTH$1],
            borderLeftWidth = computedStyle[BORDER_LEFT_WIDTH$1],
            marginTop = computedStyle[MARGIN_TOP$1],
            marginRight = computedStyle[MARGIN_RIGHT$1],
            marginBottom = computedStyle[MARGIN_BOTTOM$1],
            marginLeft = computedStyle[MARGIN_LEFT$1],
            paddingTop = computedStyle[PADDING_TOP$1],
            paddingRight = computedStyle[PADDING_RIGHT$1],
            paddingBottom = computedStyle[PADDING_BOTTOM$1],
            paddingLeft = computedStyle[PADDING_LEFT$1]; // 除了auto外都是固定宽高度

        var fixedWidth;
        var fixedHeight; // 绝对定位是left+right这种其实等于定义了width，但不能修改原始style，存入特殊变量标识

        if (w2 !== undefined) {
          fixedWidth = true;
          w = w2;
        } else if (width[1] !== AUTO$2) {
          fixedWidth = true;

          switch (width[1]) {
            case PX$4:
              w = width[0];
              break;

            case PERCENT$5:
              w *= width[0] * 0.01;
              break;
          }
        }

        if (h2 !== undefined) {
          fixedHeight = true;
          h = h2;
        } else if (height[1] !== AUTO$2) {
          fixedHeight = true;

          switch (height[1]) {
            case PX$4:
              h = height[0];
              break;

            case PERCENT$5:
              h *= height[0] * 0.01;
              break;
          }
        } // margin/padding/border影响x和y和尺寸


        x += borderLeftWidth + marginLeft + paddingLeft;
        data.x = x;
        y += borderTopWidth + marginTop + paddingTop;
        data.y = y;

        if (width[1] === AUTO$2) {
          w -= borderLeftWidth + borderRightWidth + marginLeft + marginRight + paddingLeft + paddingRight;
        }

        if (height[1] === AUTO$2) {
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
        var position = style[POSITION$1],
            marginLeft = style[MARGIN_LEFT$1],
            marginRight = style[MARGIN_RIGHT$1],
            width = style[WIDTH$3];

        if (position !== 'absolute' && width !== AUTO$2 && marginLeft[1] === AUTO$2 && marginRight[1] === AUTO$2) {
          var ow = this.outerWidth;

          if (ow < data.w) {
            this.__offsetX((data.w - ow) * 0.5, true);
          }
        }
      }
    }, {
      key: "__calMatrix",
      value: function __calMatrix(lv, __cacheStyle, currentStyle, computedStyle, sx1, sy1, offsetWidth, offsetHeight) {
        var matrixCache = __cacheStyle[MATRIX$3]; // tx/ty变化特殊优化

        if (matrixCache && lv < REFLOW && !contain(lv, TF)) {
          var x = 0,
              y = 0;

          if (contain(lv, TX)) {
            var v = currentStyle[TRANSLATE_X$4];

            if (isNil$5(v)) {
              v = 0;
            } else if (v[1] === PERCENT$5) {
              v = v[0] * this.offsetWidth * 0.01;
            } else {
              v = v[0];
            }

            x = v - (computedStyle[TRANSLATE_X$4] || 0);
            computedStyle[TRANSLATE_X$4] = v;
            computedStyle[TRANSFORM$4][4] += x;
            matrixCache[4] += x;
          }

          if (contain(lv, TY)) {
            var _v4 = currentStyle[TRANSLATE_Y$3];

            if (isNil$5(_v4)) {
              _v4 = 0;
            } else if (_v4[1] === PERCENT$5) {
              _v4 = _v4[0] * this.offsetHeight * 0.01;
            } else {
              _v4 = _v4[0];
            }

            y = _v4 - (computedStyle[TRANSLATE_Y$3] || 0);
            computedStyle[TRANSLATE_Y$3] = _v4;
            computedStyle[TRANSFORM$4][5] += y;
            matrixCache[5] += y;
          }

          __cacheStyle[MATRIX$3] = matrixCache;
        } // 先根据cache计算需要重新计算的computedStyle
        else {
            if (sx1 === undefined) {
              sx1 = this.__sx1;
              sy1 = this.__sy1;
              offsetWidth = this.offsetWidth;
              offsetHeight = this.offsetHeight;
            }

            if (__cacheStyle[TRANSFORM_ORIGIN$4] === undefined) {
              __cacheStyle[TRANSFORM_ORIGIN$4] = true;
              matrixCache = null;
              computedStyle[TRANSFORM_ORIGIN$4] = tf.calOrigin(currentStyle[TRANSFORM_ORIGIN$4], offsetWidth, offsetHeight);
            }

            if (__cacheStyle[TRANSFORM$4] === undefined || __cacheStyle[TRANSLATE_X$4] === undefined || __cacheStyle[TRANSLATE_Y$3] === undefined || __cacheStyle[ROTATE_Z$2] === undefined || __cacheStyle[SCALE_X$3] === undefined || __cacheStyle[SCALE_Y$3] === undefined || __cacheStyle[SKEW_X$2] === undefined || __cacheStyle[SKEW_Y$2] === undefined) {
              __cacheStyle[TRANSFORM$4] = __cacheStyle[TRANSLATE_X$4] = __cacheStyle[TRANSLATE_Y$3] = __cacheStyle[ROTATE_Z$2] = __cacheStyle[SCALE_X$3] = __cacheStyle[SCALE_Y$3] = __cacheStyle[SKEW_X$2] = __cacheStyle[SKEW_Y$2] = true;
              matrixCache = null;
              var matrix; // transform相对于自身

              if (currentStyle[TRANSFORM$4]) {
                matrix = tf.calMatrix(currentStyle[TRANSFORM$4], offsetWidth, offsetHeight);
              } // 没有transform则看是否有扩展的css独立变换属性
              else {
                  var temp = [];
                  [TRANSLATE_X$4, TRANSLATE_Y$3, ROTATE_Z$2, SKEW_X$2, SKEW_Y$2, SCALE_X$3, SCALE_Y$3].forEach(function (k) {
                    // 删除之前遗留的
                    delete computedStyle[k];
                    var v = currentStyle[k];

                    if (isNil$5(v)) {
                      return;
                    }

                    computedStyle[k] = v[0]; // scale为1和其它为0避免计算浪费

                    var isScale = k === SCALE_X$3 || k === SCALE_Y$3;

                    if (v[0] === 1 && isScale || !isScale && v[0] === 0) {
                      return;
                    }

                    if (v[1] === PERCENT$5) {
                      if (k === TRANSLATE_X$4) {
                        computedStyle[k] = v[0] * offsetWidth * 0.01;
                      } else if (k === TRANSLATE_Y$3) {
                        computedStyle[k] = v[0] * offsetHeight * 0.01;
                      }
                    }

                    temp.push([k, v]);
                  });

                  if (temp.length) {
                    matrix = tf.calMatrix(temp, offsetWidth, offsetHeight);
                  }
                }

              computedStyle[TRANSFORM$4] = matrix || [1, 0, 0, 1, 0, 0];
            }

            if (!matrixCache) {
              var tfo = computedStyle[TRANSFORM_ORIGIN$4].slice(0);
              tfo[0] += sx1 || 0;
              tfo[1] += sy1 || 0;
              matrixCache = __cacheStyle[MATRIX$3] = tf.calMatrixByOrigin(computedStyle[TRANSFORM$4], tfo);
            }
          }

        return matrixCache;
      }
    }, {
      key: "__calCache",
      value: function __calCache(renderMode, lv, ctx, defs, parent, __cacheStyle, currentStyle, computedStyle, clientWidth, clientHeight, offsetWidth, offsetHeight, borderTopWidth, borderRightWidth, borderBottomWidth, borderLeftWidth, paddingTop, paddingRight, paddingBottom, paddingLeft, x1, x2, x3, x4, x5, x6, y1, y2, y3, y4, y5, y6, bx1, by1, bx2, by2) {
        var _this3 = this;

        // this.__calMatrix(lv, __cacheStyle, currentStyle, computedStyle, x1, y1, offsetWidth, offsetHeight);
        if (lv >= REPAINT$1) {
          if (__cacheStyle[BACKGROUND_POSITION_X$2] === undefined) {
            __cacheStyle[BACKGROUND_POSITION_X$2] = true;
            var bgX = currentStyle[BACKGROUND_POSITION_X$2];
            computedStyle[BACKGROUND_POSITION_X$2] = (bgX || []).map(function (item) {
              return item[1] === PX$4 ? item[0] : item[0] + '%';
            });
          }

          if (__cacheStyle[BACKGROUND_POSITION_Y$2] === undefined) {
            __cacheStyle[BACKGROUND_POSITION_Y$2] = true;
            var bgY = currentStyle[BACKGROUND_POSITION_Y$2];
            computedStyle[BACKGROUND_POSITION_Y$2] = (bgY || []).map(function (item) {
              return item[1] === PX$4 ? item[0] : item[0] + '%';
            });
          }

          if (__cacheStyle[BACKGROUND_SIZE$2] === undefined) {
            __cacheStyle[BACKGROUND_SIZE$2] = true;
            computedStyle[BACKGROUND_SIZE$2] = (currentStyle[BACKGROUND_SIZE$2] || []).map(function (item) {
              return calBackgroundSize(item, clientWidth, clientHeight);
            });
          }

          if (__cacheStyle[BACKGROUND_IMAGE$1] === undefined) {
            var bgI = computedStyle[BACKGROUND_IMAGE$1] = currentStyle[BACKGROUND_IMAGE$1];
            __cacheStyle[BACKGROUND_IMAGE$1] = bgI.map(function (bgi, i) {
              if (!bgi) {
                return null;
              } // 防止隐藏不加载背景图


              if (util.isString(bgi)) {
                var loadBgi = _this3.__loadBgi[i] = _this3.__loadBgi[i] || {};
                var cache = inject.IMG[BACKGROUND_IMAGE$1];

                if (cache && cache.state === inject.LOADED) {
                  loadBgi.url = BACKGROUND_IMAGE$1;
                  loadBgi.source = cache.source;
                  loadBgi.width = cache.width;
                  loadBgi.height = cache.height;
                } else if (loadBgi.url !== bgi) {
                  // 可能改变导致多次加载，每次清空，成功后还要比对url是否相同
                  loadBgi.url = bgi;
                  loadBgi.source = null;
                  var node = _this3;
                  var root = node.root;
                  inject.measureImg(bgi, function (data) {
                    // 还需判断url，防止重复加载时老的替换新的，失败不绘制bgi
                    if (data.success && data.url === loadBgi.url && !_this3.isDestroyed) {
                      loadBgi.source = data.source;
                      loadBgi.width = data.width;
                      loadBgi.height = data.height;
                      root.delRefreshTask(loadBgi.cb);
                      root.addRefreshTask(loadBgi.cb = {
                        __before: function __before() {
                          __cacheStyle[BACKGROUND_IMAGE$1] = undefined;
                          var res = {};
                          res[UPDATE_NODE$1] = node;
                          res[UPDATE_FOCUS] = REPAINT$1;
                          res[UPDATE_CONFIG$1] = node.__config;

                          root.__addUpdate(node, node.__config, root, root.__config, res);
                        }
                      });
                    }
                  }, {
                    ctx: ctx,
                    root: root,
                    width: bx2 - bx1,
                    height: by2 - by1
                  });
                }

                return true;
              } else if (bgi && bgi.k) {
                return _this3.__gradient(renderMode, ctx, defs, bx1, by1, bx2, by2, bgi);
              }
            });
          }

          if (__cacheStyle[BOX_SHADOW$2] === undefined) {
            __cacheStyle[BOX_SHADOW$2] = true;
            computedStyle[BOX_SHADOW$2] = currentStyle[BOX_SHADOW$2];
          } // 这些直接赋值的不需要再算缓存


          [OPACITY$3, Z_INDEX$2, BORDER_TOP_STYLE, BORDER_RIGHT_STYLE, BORDER_BOTTOM_STYLE, BORDER_LEFT_STYLE, BACKGROUND_REPEAT, FILTER$3, OVERFLOW, MIX_BLEND_MODE].forEach(function (k) {
            computedStyle[k] = currentStyle[k];
          });
          [BACKGROUND_COLOR$1, BORDER_TOP_COLOR, BORDER_RIGHT_COLOR, BORDER_BOTTOM_COLOR, BORDER_LEFT_COLOR].forEach(function (k) {
            if (__cacheStyle[k] === undefined) {
              __cacheStyle[k] = int2rgba$1(computedStyle[k] = currentStyle[k][0]);
            }
          }); // 圆角边计算

          if (__cacheStyle[BORDER_TOP_LEFT_RADIUS] === undefined || __cacheStyle[BORDER_TOP_RIGHT_RADIUS] === undefined || __cacheStyle[BORDER_BOTTOM_RIGHT_RADIUS] === undefined || __cacheStyle[BORDER_BOTTOM_LEFT_RADIUS] === undefined) {
            __cacheStyle[BORDER_TOP_LEFT_RADIUS] = __cacheStyle[BORDER_TOP_RIGHT_RADIUS] = __cacheStyle[BORDER_BOTTOM_RIGHT_RADIUS] = __cacheStyle[BORDER_BOTTOM_LEFT_RADIUS] = true;
            calBorderRadius(offsetWidth, offsetHeight, currentStyle, computedStyle);
          } // width/style/radius影响border，color不影响渲染缓存


          var btlr = computedStyle[BORDER_TOP_LEFT_RADIUS];
          var btrr = computedStyle[BORDER_TOP_RIGHT_RADIUS];
          var bbrr = computedStyle[BORDER_BOTTOM_RIGHT_RADIUS];
          var bblr = computedStyle[BORDER_BOTTOM_LEFT_RADIUS];
          ['Top', 'Right', 'Bottom', 'Left'].forEach(function (k) {
            k = 'border' + k;
            var k2 = STYLE_KEY$6[style2Upper$2(k)];
            var kw = STYLE_KEY$6[style2Upper$2(k + 'Width')];
            var ks = STYLE_KEY$6[style2Upper$2(k + 'Style')]; // width/style变更影响border重新计算

            if (__cacheStyle[kw] === undefined) {
              __cacheStyle[kw] = true;
              __cacheStyle[k2] = undefined;
            }

            if (__cacheStyle[ks] === undefined) {
              __cacheStyle[ks] = true;
              __cacheStyle[k2] = undefined;
            }

            if (__cacheStyle[k2] === undefined) {
              if (k2 === BORDER_TOP) {
                if (borderTopWidth > 0) {
                  var deg1 = Math.atan(borderTopWidth / borderLeftWidth);
                  var deg2 = Math.atan(borderTopWidth / borderRightWidth);
                  __cacheStyle[k2] = border.calPoints(borderTopWidth, computedStyle[ks], deg1, deg2, x1, x2, x5, x6, y1, y2, y5, y6, 0, btlr, btrr);
                } else {
                  __cacheStyle[k2] = [];
                }
              } else if (k2 === BORDER_RIGHT) {
                if (borderRightWidth > 0) {
                  var _deg = Math.atan(borderRightWidth / borderTopWidth);

                  var _deg2 = Math.atan(borderRightWidth / borderBottomWidth);

                  __cacheStyle[k2] = border.calPoints(borderRightWidth, computedStyle[ks], _deg, _deg2, x1, x2, x5, x6, y1, y2, y5, y6, 1, btrr, bbrr);
                } else {
                  __cacheStyle[k2] = [];
                }
              } else if (k2 === BORDER_BOTTOM) {
                if (borderBottomWidth > 0) {
                  var _deg3 = Math.atan(borderBottomWidth / borderLeftWidth);

                  var _deg4 = Math.atan(borderBottomWidth / borderRightWidth);

                  __cacheStyle[k2] = border.calPoints(borderBottomWidth, computedStyle[ks], _deg3, _deg4, x1, x2, x5, x6, y1, y2, y5, y6, 2, bblr, bbrr);
                } else {
                  __cacheStyle[k2] = [];
                }
              } else if (k2 === BORDER_LEFT) {
                if (borderLeftWidth > 0) {
                  var _deg5 = Math.atan(borderLeftWidth / borderTopWidth);

                  var _deg6 = Math.atan(borderLeftWidth / borderBottomWidth);

                  __cacheStyle[k2] = border.calPoints(borderLeftWidth, computedStyle[ks], _deg5, _deg6, x1, x2, x5, x6, y1, y2, y5, y6, 3, btlr, bblr);
                } else {
                  __cacheStyle[k2] = [];
                }
              }
            }
          });
        } else {
          if (contain(lv, OP)) {
            computedStyle[OPACITY$3] = currentStyle[OPACITY$3];
          }

          if (contain(lv, FT)) {
            computedStyle[FILTER$3] = currentStyle[FILTER$3];
          }
        } // 强制计算继承性的


        var parentComputedStyle = parent && parent.computedStyle;

        if (currentStyle[FONT_STYLE$3][1] === INHERIT$4) {
          computedStyle[FONT_STYLE$3] = parent ? parentComputedStyle[FONT_STYLE$3] : 'normal';
        } else if (!__cacheStyle[FONT_STYLE$3]) {
          computedStyle[FONT_STYLE$3] = currentStyle[FONT_STYLE$3][0];
        }

        __cacheStyle[FONT_STYLE$3] = computedStyle[FONT_STYLE$3];

        if (currentStyle[COLOR$4][1] === INHERIT$4) {
          computedStyle[COLOR$4] = parent ? parentComputedStyle[COLOR$4] : [0, 0, 0, 1];
          __cacheStyle[COLOR$4] = int2rgba$1(computedStyle[COLOR$4]);
        } else if (!__cacheStyle[COLOR$4]) {
          computedStyle[COLOR$4] = rgba2int$3(currentStyle[COLOR$4][0]);
          __cacheStyle[COLOR$4] = int2rgba$1(computedStyle[COLOR$4]);
        }

        if (currentStyle[VISIBILITY$2][1] === INHERIT$4) {
          computedStyle[VISIBILITY$2] = parent ? parentComputedStyle[VISIBILITY$2] : 'visible';
        } else if (!__cacheStyle[VISIBILITY$2]) {
          computedStyle[VISIBILITY$2] = currentStyle[VISIBILITY$2][0];
        }

        __cacheStyle[VISIBILITY$2] = computedStyle[VISIBILITY$2];

        if (currentStyle[POINTER_EVENTS$1][1] === INHERIT$4) {
          computedStyle[POINTER_EVENTS$1] = parent ? parentComputedStyle[POINTER_EVENTS$1] : 'auto';
        } else if (!__cacheStyle[POINTER_EVENTS$1]) {
          computedStyle[POINTER_EVENTS$1] = currentStyle[POINTER_EVENTS$1][0];
        }

        __cacheStyle[POINTER_EVENTS$1] = computedStyle[POINTER_EVENTS$1];
      }
    }, {
      key: "__calContent",
      value: function __calContent(renderMode, lv, currentStyle, computedStyle) {
        if (renderMode === mode.CANVAS) {
          if (lv < REPAINT$1) {
            return this.__hasContent;
          }

          var visibility = currentStyle[VISIBILITY$2];

          if (visibility !== 'hidden') {
            var bgI = currentStyle[BACKGROUND_IMAGE$1];

            if (Array.isArray(bgI)) {
              for (var i = 0, len = bgI.length; i < len; i++) {
                if (bgI[i]) {
                  return true;
                }
              }
            }

            if (currentStyle[BACKGROUND_COLOR$1][0][3] > 0) {
              var width = computedStyle[WIDTH$3],
                  height = computedStyle[HEIGHT$3],
                  paddingTop = computedStyle[PADDING_TOP$1],
                  paddingRight = computedStyle[PADDING_RIGHT$1],
                  paddingBottom = computedStyle[PADDING_BOTTOM$1],
                  paddingLeft = computedStyle[PADDING_LEFT$1];

              if (width && height || paddingTop || paddingRight || paddingBottom || paddingLeft) {
                return true;
              }
            }

            for (var list = ['Top', 'Right', 'Bottom', 'Left'], _i = 0, _len = list.length; _i < _len; _i++) {
              var k = list[_i];

              if (computedStyle[STYLE_KEY$6[style2Upper$2('border' + k + 'Width')]] > 0 && currentStyle[STYLE_KEY$6[style2Upper$2('border' + k + 'Color')]][3] > 0) {
                return true;
              }
            }

            var bs = currentStyle[BOX_SHADOW$2];

            if (Array.isArray(bs)) {
              for (var _i2 = 0, _len2 = bs.length; _i2 < _len2; _i2++) {
                var item = bs[_i2];

                if (item && (item[2] > 0 || item[3] > 0)) {
                  return true;
                }
              }
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
       * @param cache 是否开启缓存
       * @return Object
       * x1/x2/x3/x4/y1/y2/y3/y4 坐标
       * break svg判断无变化提前跳出
       * cacheError 离屏申请失败，仅canvas
       * offScreenBlend 无cache时的离屏canvas，仅canvas
       * offScreenFilter 无cache时的离屏canvas，仅canvas
       * offScreenMask 无cache时的离屏canvas，仅canvas
       * offScreenOverflow 无cache时的离屏canvas，仅canvas
       */

    }, {
      key: "__renderSelf",
      value: function __renderSelf(renderMode, lv, ctx, defs, cache) {
        var _this4 = this;

        var isDestroyed = this.isDestroyed,
            root = this.root,
            __config = this.__config;
        var __cache = __config[NODE_CACHE$1];
        var __cacheStyle = __config[NODE_CACHE_STYLE];
        var currentStyle = __config[NODE_CURRENT_STYLE];
        var computedStyle = __config[NODE_COMPUTED_STYLE]; // geom特殊处理，每次>=REPAINT重新渲染生成

        this.__renderSelfData = null; // 渲染完认为完全无变更，等布局/动画/更新重置

        __config[NODE_REFRESH_LV] = NONE;

        if (isDestroyed) {
          return {
            isDestroyed: isDestroyed,
            "break": true
          };
        }

        var virtualDom; // svg设置vd上的lv属性标明<REPAINT时应用缓存，初始化肯定没有

        if (renderMode === mode.SVG) {
          virtualDom = this.__virtualDom = {
            bb: [],
            children: [],
            visibility: 'visible'
          }; // svg mock，每次都生成，每个节点都是局部根，更新时自底向上清除

          if (!__config[NODE_CACHE_TOTAL]) {
            __config[NODE_CACHE_TOTAL] = {
              available: true,
              release: function release() {
                this.available = false;
                delete virtualDom.cache;
              }
            };
          } else if (!__config[NODE_CACHE_TOTAL].available) {
            __config[NODE_CACHE_TOTAL].available = true;
          }
        } // canvas返回信息，svg已经初始化好了vd


        if (computedStyle[DISPLAY$2] === 'none') {
          return {
            "break": true
          };
        } // 使用sx和sy渲染位置，考虑了relative和translate影响


        var x = this.sx,
            y = this.sy,
            width = this.width,
            height = this.height,
            clientWidth = this.clientWidth,
            clientHeight = this.clientHeight,
            offsetWidth = this.offsetWidth,
            offsetHeight = this.offsetHeight,
            outerWidth = this.outerWidth,
            outerHeight = this.outerHeight,
            __hasMask = this.__hasMask;
        var marginTop = computedStyle[MARGIN_TOP$1],
            marginLeft = computedStyle[MARGIN_LEFT$1],
            paddingTop = computedStyle[PADDING_TOP$1],
            paddingRight = computedStyle[PADDING_RIGHT$1],
            paddingBottom = computedStyle[PADDING_BOTTOM$1],
            paddingLeft = computedStyle[PADDING_LEFT$1],
            borderLeftWidth = computedStyle[BORDER_LEFT_WIDTH$1],
            borderRightWidth = computedStyle[BORDER_RIGHT_WIDTH$1],
            borderTopWidth = computedStyle[BORDER_TOP_WIDTH$1],
            borderBottomWidth = computedStyle[BORDER_BOTTOM_WIDTH$1],
            backgroundClip = computedStyle[BACKGROUND_CLIP$1];
        var x1 = this.__sx1 = x + marginLeft;
        var x2 = this.__sx2 = x1 + borderLeftWidth; // let x3 = this.__sx3 = x2 + width + paddingLeft + paddingRight;
        // let x4 = this.__sx4 = x3 + borderRightWidth;

        var x3 = this.__sx3 = x2 + paddingLeft;
        var x4 = this.__sx4 = x3 + width;
        var x5 = this.__sx5 = x4 + paddingRight;
        var x6 = this.__sx6 = x5 + borderRightWidth;
        var y1 = this.__sy1 = y + marginTop;
        var y2 = this.__sy2 = y1 + borderTopWidth; // let y3 = this.__sy3 = y2 + height + paddingTop + paddingBottom;
        // let y4 = this.__sy4 = y3 + borderBottomWidth;

        var y3 = this.__sy3 = y2 + paddingTop;
        var y4 = this.__sy4 = y3 + height;
        var y5 = this.__sy5 = y4 + paddingBottom;
        var y6 = this.__sy6 = y5 + borderBottomWidth;
        var bx1 = x1,
            by1 = y1,
            bx2 = x6,
            by2 = y6;

        if (backgroundClip === 'padding-box') {
          bx1 = x2;
          by1 = y2;
          bx2 = x5;
          by2 = y5;
        } else if (backgroundClip === 'content-box') {
          bx1 = x3;
          by1 = y3;
          bx2 = x4;
          by2 = y4;
        }

        this.__bx1 = bx1;
        this.__by1 = by1;
        this.__bx2 = bx2;
        this.__by2 = by2;
        var res = {
          x1: x1,
          x2: x2,
          x3: x3,
          x4: x4,
          x5: x5,
          x6: x6,
          y1: y1,
          y2: y2,
          y3: y3,
          y4: y4,
          y5: y5,
          y6: y6,
          bx1: bx1,
          by1: by1,
          bx2: bx2,
          by2: by2
        }; // 防止cp直接返回cp嵌套，拿到真实dom的parent

        var p = __config[NODE_DOM_PARENT];

        var hasContent = this.__hasContent = __config[NODE_HAS_CONTENT] = this.__calContent(renderMode, lv, currentStyle, computedStyle);

        this.__calMatrix(lv, __cacheStyle, currentStyle, computedStyle, x1, y1, offsetWidth, offsetHeight); // canvas特殊申请离屏缓存


        var dx = 0,
            dy = 0;

        if (cache && renderMode === mode.CANVAS) {
          // 无内容可释放并提前跳出，geom覆盖特殊判断，因为后面子类会绘制矢量，img也覆盖特殊判断，加载完肯定有内容
          if (!hasContent && this.__releaseWhenEmpty(__cache)) {
            res["break"] = true;
            __config[NODE_LIMIT_CACHE] = false;
          } // 新生成根据最大尺寸，排除margin从border开始还要考虑阴影滤镜等，geom单独在dom里做
          else if (!__config[NODE_LIMIT_CACHE] && (!__cache || !__cache.available)) {
              var bbox = this.bbox;

              if (__cache) {
                __cache.reset(bbox);
              } else {
                __cache = Cache.getInstance(bbox);
              } // 有可能超过最大尺寸限制不使用缓存


              if (__cache && __cache.enabled) {
                __cache.__bbox = bbox;

                __cache.__appendData(x1, y1); // let dbx = __cache.dbx, dby = __cache.dby;


                ctx = __cache.ctx; // let [xc, yc] = __cache.coords;

                dx = __cache.dx;
                dy = __cache.dy; // 重置ctx为cache的，以及绘制坐标为cache的区域

                bx1 += dx;
                by1 += dy;
                bx2 += dx;
                by2 += dy;

                if (dx) {
                  res.x1 = x1 += dx;
                  res.x2 = x2 += dx;
                  res.x3 = x3 += dx;
                  res.x4 = x4 += dx;
                  res.x5 = x5 += dx;
                  res.x6 = x6 += dx;
                }

                if (dy) {
                  res.y1 = y1 += dy;
                  res.y2 = y2 += dy;
                  res.y3 = y3 += dy;
                  res.y4 = y4 += dy;
                  res.y5 = y5 += dy;
                  res.y6 = y6 += dy;
                }
              } else {
                __config[NODE_LIMIT_CACHE] = true;
                __cache = null;
              }

              __config[NODE_CACHE$1] = __cache;
            }

          res.dx = dx;
          res.dy = dy;
        } // 计算好cacheStyle的内容，以及位图缓存指数


        this.__calCache(renderMode, lv, ctx, defs, this.parent, __cacheStyle, currentStyle, computedStyle, clientWidth, clientHeight, offsetWidth, offsetHeight, borderTopWidth, borderRightWidth, borderBottomWidth, borderLeftWidth, paddingTop, paddingRight, paddingBottom, paddingLeft, x1, x2, x3, x4, x5, x6, y1, y2, y3, y4, y5, y6, bx1, by1, bx2, by2);

        var backgroundColor = computedStyle[BACKGROUND_COLOR$1],
            borderTopColor = computedStyle[BORDER_TOP_COLOR],
            borderRightColor = computedStyle[BORDER_RIGHT_COLOR],
            borderBottomColor = computedStyle[BORDER_BOTTOM_COLOR],
            borderLeftColor = computedStyle[BORDER_LEFT_COLOR],
            borderTopLeftRadius = computedStyle[BORDER_TOP_LEFT_RADIUS],
            borderTopRightRadius = computedStyle[BORDER_TOP_RIGHT_RADIUS],
            borderBottomRightRadius = computedStyle[BORDER_BOTTOM_RIGHT_RADIUS],
            borderBottomLeftRadius = computedStyle[BORDER_BOTTOM_LEFT_RADIUS],
            visibility = computedStyle[VISIBILITY$2],
            backgroundRepeat = computedStyle[BACKGROUND_REPEAT],
            backgroundImage = computedStyle[BACKGROUND_IMAGE$1],
            opacity = computedStyle[OPACITY$3],
            filter = computedStyle[FILTER$3],
            backgroundSize = computedStyle[BACKGROUND_SIZE$2],
            boxShadow = computedStyle[BOX_SHADOW$2],
            overflow = computedStyle[OVERFLOW],
            mixBlendMode = computedStyle[MIX_BLEND_MODE]; // 先设置透明度，canvas可以向上累积

        if (renderMode === mode.CANVAS) {
          if (p) {
            opacity *= p.__config[NODE_OPACITY$1];
          }

          __config[NODE_OPACITY$1] = opacity;
        } else if (renderMode === mode.SVG) {
          if (opacity === 1) {
            delete virtualDom.opacity;
          } else {
            virtualDom.opacity = opacity;
          }

          if (mixBlendMode !== 'normal') {
            virtualDom.mixBlendMode = mixBlendMode;
          } else {
            delete virtualDom.mixBlendMode;
          }
        } // canvas/svg/事件需要3种不同的matrix


        var matrix = this.__matrix = __config[NODE_MATRIX] = __cacheStyle[MATRIX$3];
        var renderMatrix = this.__renderMatrix = matrix; // 变换对事件影响，canvas要设置渲染

        if (p) {
          matrix = mx.multiply(p.matrixEvent, matrix);
        } // 为了引用不变，防止变化后text子节点获取不到，恶心的v8优化，初始化在构造函数中空数组


        var m = this.__matrixEvent = __config[NODE_MATRIX_EVENT];
        m[0] = matrix[0];
        m[1] = matrix[1];
        m[2] = matrix[2];
        m[3] = matrix[3];
        m[4] = matrix[4];
        m[5] = matrix[5];

        if (renderMode === mode.SVG) {
          // svg可以没变化省略计算，因为只相对于自身
          if (!contain(lv, TRANSFORM_ALL) && lv < REPAINT$1) ; else if (!mx.isE(renderMatrix)) {
            virtualDom.transform = 'matrix(' + joinArr$1(renderMatrix, ',') + ')';
          } else {
            delete virtualDom.transform;
          }
        }

        if (renderMode === mode.SVG) {
          virtualDom.visibility = visibility;
        } // 无离屏功能或超限视为不可缓存本身，等降级无cache再次绘制


        if (renderMode === mode.CANVAS && cache && (__config[NODE_LIMIT_CACHE] || res["break"])) {
          return {
            limitCache: true
          };
        } // 无cache时canvas的blur需绘制到离屏上应用后反向绘制回来，有cache在Dom里另生成一个filter的cache


        var offScreenFilter;
        __config[NODE_BLUR_VALUE] = 0;

        if (Array.isArray(filter)) {
          filter.forEach(function (item) {
            var _item = _slicedToArray(item, 2),
                k = _item[0],
                v = _item[1];

            if (k === 'blur') {
              __config[NODE_BLUR_VALUE] = v; // 非cache模式返回offScreen，cache模式会生成cacheFilter识别

              if (renderMode === mode.CANVAS && v > 0 && !cache) {
                var _width = root.width,
                    _height = root.height;
                var c = inject.getCacheCanvas(_width, _height);

                if (c.ctx) {
                  offScreenFilter = {
                    ctx: ctx,
                    blur: v,
                    target: c,
                    matrix: matrix
                  };
                  ctx = c.ctx;
                }
              } else if (renderMode === mode.SVG && (lv >= REPAINT$1 || contain(lv, FT))) {
                // 模糊框卷积尺寸 #66
                if (v > 0 && width > 0 && height > 0) {
                  var d = mx.int2convolution(v);
                  var o = {
                    tagName: 'filter',
                    props: [['x', -d / outerWidth], ['y', -d / outerHeight], ['width', 1 + d * 2 / outerWidth], ['height', 1 + d * 2 / outerHeight]],
                    children: [{
                      tagName: 'feGaussianBlur',
                      props: [['stdDeviation', v]]
                    }]
                  };
                  var id = defs.add(o);

                  __config[NODE_DEFS_CACHE].push(o);

                  virtualDom.filter = 'url(#' + id + ')';
                } else {
                  delete virtualDom.filter;
                }
              }
            }
          });
        }

        var offScreenMask;

        if (__hasMask) {
          if (renderMode === mode.CANVAS && !cache) {
            if (offScreenFilter) {
              offScreenMask = offScreenFilter;
            } else {
              var _width2 = root.width,
                  _height2 = root.height;
              var c = inject.getCacheCanvas(_width2, _height2);

              if (c.ctx) {
                offScreenMask = {
                  ctx: ctx,
                  target: c,
                  matrix: matrix
                };
                ctx = c.ctx;
              }
            }
          }
        } // overflow:hidden，最后判断，filter/mask优先


        var offScreenOverflow;

        if (overflow === 'hidden') {
          if (renderMode === mode.CANVAS && !cache) {
            if (offScreenFilter || offScreenMask) {
              offScreenOverflow = offScreenFilter || offScreenMask;
            } else {
              var _width3 = root.width,
                  _height3 = root.height;

              var _c = inject.getCacheCanvas(_width3, _height3);

              if (_c.ctx) {
                offScreenOverflow = {
                  ctx: ctx,
                  target: _c,
                  matrix: matrix
                };
                ctx = _c.ctx;
              }
            }

            offScreenOverflow.x = x1;
            offScreenOverflow.y = y1;
            offScreenOverflow.offsetWidth = offsetWidth;
            offScreenOverflow.offsetHeight = offsetHeight;
          } else if (renderMode === mode.SVG) {
            var v = {
              tagName: 'clipPath',
              props: [],
              children: [{
                tagName: 'path',
                props: [['d', "M".concat(x1, ",").concat(y1, "L").concat(x + offsetWidth, ",").concat(y, "L").concat(x + offsetWidth, ",").concat(y + offsetHeight, "L").concat(x, ",").concat(y + offsetHeight, ",L").concat(x, ",").concat(y)]]
              }]
            };
            var id = defs.add(v);

            __config[NODE_DEFS_CACHE].push(v);

            virtualDom.overflow = 'url(#' + id + ')';
          }
        } else if (renderMode === mode.SVG) {
          delete virtualDom.overflow;
        }

        var offScreenBlend;

        if (mixBlendMode !== 'normal' && !cache) {
          if (offScreenFilter || offScreenMask || offScreenOverflow) {
            offScreenBlend = offScreenFilter || offScreenMask || offScreenOverflow;
          } else {
            var _width4 = root.width,
                _height4 = root.height;

            var _c2 = inject.getCacheCanvas(_width4, _height4);

            offScreenBlend = {
              ctx: ctx,
              target: _c2,
              mixBlendMode: mixBlendMode,
              matrix: matrix
            };
            ctx = _c2.ctx;
          }
        } // 无法使用缓存时主画布直接绘制需设置


        if (renderMode === mode.CANVAS && !cache) {
          res.offScreenFilter = offScreenFilter;
          res.offScreenMask = offScreenMask;
          res.offScreenOverflow = offScreenOverflow;
          res.offScreenBlend = offScreenBlend;
          ctx.globalAlpha = opacity;
          ctx.setTransform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);
        } // 隐藏不渲染


        if (visibility === 'hidden' && renderMode === mode.CANVAS) {
          res["break"] = true;
          return res;
        } // 背景色垫底，根据backgroundClip的不同值要调整坐标尺寸，也会影响borderRadius


        var btlr, btrr, bbrr, bblr;

        if (backgroundColor[3] > 0 || backgroundImage) {
          btlr = borderTopLeftRadius.slice(0);
          btrr = borderTopRightRadius.slice(0);
          bbrr = borderBottomRightRadius.slice(0);
          bblr = borderBottomLeftRadius.slice(0);

          if (backgroundClip === 'padding-box') {
            btlr[0] -= borderLeftWidth;
            btlr[1] -= borderTopWidth;
            btrr[0] -= borderRightWidth;
            btrr[1] -= borderTopWidth;
            bbrr[0] -= borderRightWidth;
            bbrr[1] -= borderBottomWidth;
            bblr[0] -= borderLeftWidth;
            bblr[1] -= borderBottomWidth;
          } else if (backgroundClip === 'content-box') {
            btlr[0] -= borderLeftWidth + paddingLeft;
            btlr[1] -= borderTopWidth + paddingTop;
            btrr[0] -= borderRightWidth + paddingRight;
            btrr[1] -= borderTopWidth + paddingTop;
            bbrr[0] -= borderRightWidth + paddingRight;
            bbrr[1] -= borderBottomWidth + paddingBottom;
            bblr[0] -= borderLeftWidth + paddingLeft;
            bblr[1] -= borderBottomWidth + paddingBottom;
          }
        }

        if (backgroundColor[3] > 0) {
          renderBgc(renderMode, __cacheStyle[BACKGROUND_COLOR$1], bx1, by1, bx2 - bx1, by2 - by1, ctx, defs, this, btlr, btrr, bbrr, bblr);
        } // 渐变或图片叠加


        if (backgroundImage) {
          backgroundImage.forEach(function (bgi, i) {
            if (!bgi) {
              return;
            }

            if (util.isString(bgi)) {
              var loadBgi = _this4.__loadBgi[i];

              if (loadBgi.url === backgroundImage[i]) {
                var source = loadBgi.source;
                var bgW = bx2 - bx1;
                var bgH = by2 - by1; // 无source不绘制

                if (source) {
                  var _width5 = loadBgi.width,
                      _height5 = loadBgi.height;

                  var _backgroundSize$i = _slicedToArray(backgroundSize[i], 2),
                      w = _backgroundSize$i[0],
                      h = _backgroundSize$i[1]; // -1为auto，-2为contain，-3为cover


                  if (w === -1 && h === -1) {
                    w = _width5;
                    h = _height5;
                  } else if (w === -2) {
                    if (_width5 > bgW && _height5 > bgH) {
                      w = _width5 / bgW;
                      h = _height5 / bgH;

                      if (w >= h) {
                        w = bgW;
                        h = w * _height5 / _width5;
                      } else {
                        h = bgH;
                        w = h * _width5 / _height5;
                      }
                    } else if (_width5 > bgW) {
                      w = bgW;
                      h = w * _height5 / _width5;
                    } else if (_height5 > bgH) {
                      h = bgH;
                      w = h * _width5 / _height5;
                    } else {
                      w = _width5;
                      h = _height5;
                    }
                  } else if (w === -3) {
                    if (bgW > _width5 && bgH > _height5) {
                      w = _width5 / bgW;
                      h = _height5 / bgH;

                      if (w <= h) {
                        w = bgW;
                        h = w * _height5 / _width5;
                      } else {
                        h = bgH;
                        w = h * _width5 / _height5;
                      }
                    } else if (bgW > _width5) {
                      w = bgW;
                      h = w * _height5 / _width5;
                    } else if (bgH > _height5) {
                      h = bgH;
                      w = h * _width5 / _height5;
                    } else {
                      w = _width5 / bgW;
                      h = _height5 / bgH;

                      if (w <= h) {
                        w = bgW;
                        h = w * _height5 / _width5;
                      } else {
                        h = bgH;
                        w = h * _width5 / _height5;
                      }
                    }
                  } else if (w === -1) {
                    w = h * _width5 / _height5;
                  } else if (h === -1) {
                    h = w * _height5 / _width5;
                  }

                  var bgX = bx1 + calBackgroundPosition(currentStyle[BACKGROUND_POSITION_X$2][i], bgW, w);
                  var bgY = by1 + calBackgroundPosition(currentStyle[BACKGROUND_POSITION_Y$2][i], bgH, h); // 超出尺寸模拟mask截取

                  var needMask = bgX < x2 || bgY < y2 || w > bgW || h > bgH; // 计算因为repeat，需要向4个方向扩展渲染几个数量图片

                  var xnl = 0;
                  var xnr = 0;
                  var ynt = 0;
                  var ynb = 0; // repeat-x

                  if (['repeat-x', 'repeat'].indexOf(backgroundRepeat[i]) > -1) {
                    var diff = bgX - bx1;

                    if (diff > 0) {
                      xnl = Math.ceil(diff / w);
                    }

                    diff = bx1 + bgW - bgX - w;

                    if (diff > 0) {
                      xnr = Math.ceil(diff / w);
                    }
                  } // repeat-y


                  if (['repeat-y', 'repeat'].indexOf(backgroundRepeat[i]) > -1) {
                    var _diff = bgY - by1;

                    if (_diff > 0) {
                      ynt = Math.ceil(_diff / h);
                    }

                    _diff = by1 + bgH - bgY - h;

                    if (_diff > 0) {
                      ynb = Math.ceil(_diff / h);
                    }
                  } // 分同行列和4个角分别判断，先看同行同列，再看4个角的象限


                  var repeat = [];

                  if (xnl > 0) {
                    for (var _i3 = 0; _i3 < xnl; _i3++) {
                      var _x = bgX - (_i3 + 1) * w;

                      repeat.push([_x, bgY]); // 看最左边超过没有

                      if (!needMask && _i3 === 0 && _x < bx1) {
                        needMask = true;
                      }
                    }
                  }

                  if (xnr > 0) {
                    for (var _i4 = 0; _i4 < xnr; _i4++) {
                      var _x2 = bgX + (_i4 + 1) * w;

                      repeat.push([_x2, bgY]); // 看最右边超过没有

                      if (!needMask && _i4 === xnr - 1 && _x2 + w > bx1 + bgW) {
                        needMask = true;
                      }
                    }
                  }

                  if (ynt > 0) {
                    for (var _i5 = 0; _i5 < ynt; _i5++) {
                      var _y = bgY - (_i5 + 1) * h;

                      repeat.push([bgX, _y]); // 看最上边超过没有

                      if (!needMask && _i5 === 0 && _y < by1) {
                        needMask = true;
                      }
                    }
                  }

                  if (ynb > 0) {
                    for (var _i6 = 0; _i6 < ynb; _i6++) {
                      var _y2 = bgY + (_i6 + 1) * h;

                      repeat.push([bgX, _y2]); // 看最下边超过没有

                      if (!needMask && _i6 === ynb - 1 && _y2 + w > by1 + clientHeight) {
                        needMask = true;
                      }
                    }
                  } // 原点和同行列十字画完，看4个角的情况


                  if (xnl > 0 && ynt > 0) {
                    for (var _i7 = 0; _i7 < xnl; _i7++) {
                      for (var j = 0; j < ynt; j++) {
                        repeat.push([bgX - (_i7 + 1) * w, bgY - (j + 1) * h]);
                      }
                    }
                  }

                  if (xnr > 0 && ynt > 0) {
                    for (var _i8 = 0; _i8 < xnr; _i8++) {
                      for (var _j = 0; _j < ynt; _j++) {
                        repeat.push([bgX + (_i8 + 1) * w, bgY - (_j + 1) * h]);
                      }
                    }
                  }

                  if (xnl > 0 && ynb > 0) {
                    for (var _i9 = 0; _i9 < xnl; _i9++) {
                      for (var _j2 = 0; _j2 < ynb; _j2++) {
                        repeat.push([bgX - (_i9 + 1) * w, bgY + (_j2 + 1) * h]);
                      }
                    }
                  }

                  if (xnr > 0 && ynb > 0) {
                    for (var _i10 = 0; _i10 < xnr; _i10++) {
                      for (var _j3 = 0; _j3 < ynb; _j3++) {
                        repeat.push([bgX + (_i10 + 1) * w, bgY + (_j3 + 1) * h]);
                      }
                    }
                  }

                  if (renderMode === mode.CANVAS) {
                    if (needMask) {
                      ctx.save();
                      renderBgc(renderMode, '#FFF', bx1, by1, bgW, bgH, ctx, defs, _this4, btlr, btrr, bbrr, bblr, 'clip');
                    } // 先画不考虑repeat的中心声明的


                    ctx.drawImage(source, bgX, bgY, w, h); // 再画重复的十字和4角象限

                    repeat.forEach(function (item) {
                      ctx.drawImage(source, item[0], item[1], w, h);
                    });

                    if (needMask) {
                      ctx.restore();
                    }
                  } else if (renderMode === mode.SVG) {
                    var _matrix = image.matrixResize(_width5, _height5, w, h, bgX, bgY, bgW, bgH);

                    var props = [['xlink:href', bgi], ['x', bgX], ['y', bgY], ['width', _width5], ['height', _height5]];
                    var needResize;

                    if (_matrix && !mx.isE(_matrix)) {
                      needResize = true;
                      props.push(['transform', 'matrix(' + joinArr$1(_matrix, ',') + ')']);
                    }

                    if (needMask) {
                      var p1 = [x2, y2];
                      var p2 = [x2 + bgW, y2 + bgH];

                      if (needResize) {
                        var inverse = mx.inverse(_matrix);
                        p1 = mx.calPoint(p1, inverse);
                        p2 = mx.calPoint(p2, inverse);
                      }

                      var _v5 = {
                        tagName: 'clipPath',
                        children: [{
                          tagName: 'path',
                          props: [['d', "M".concat(p1[0], ",").concat(p1[1], "L").concat(p2[0], ",").concat(p1[1], "L").concat(p2[0], ",").concat(p2[1], "L").concat(p1[0], ",").concat(p2[1], "L").concat(p1[0], ",").concat(p1[1])], ['fill', '#FFF']]
                        }]
                      };

                      var _id = defs.add(_v5);

                      __config[NODE_DEFS_CACHE].push(_v5);

                      props.push(['clip-path', 'url(#' + _id + ')']);
                    } // 先画不考虑repeat的中心声明的


                    _this4.virtualDom.bb.push({
                      type: 'img',
                      tagName: 'image',
                      props: props
                    }); // 再画重复的十字和4角象限


                    repeat.forEach(function (item) {
                      var copy = clone$2(props);

                      if (needResize) {
                        var _matrix2 = image.matrixResize(_width5, _height5, w, h, item[0], item[1], bgW, bgH);

                        if (_matrix2 && !mx.isE(_matrix2)) {
                          copy[5][1] = 'matrix(' + joinArr$1(_matrix2, ',') + ')';
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
            } else if (bgi.k) {
              var gd = __cacheStyle[BACKGROUND_IMAGE$1][i];

              if (gd) {
                if (gd.k === 'conic') {
                  renderConic(renderMode, gd.v, bx1, by1, bx2 - bx1, by2 - by1, ctx, defs, _this4, btlr, btrr, bbrr, bblr);
                } else {
                  renderBgc(renderMode, gd.v, bx1, by1, bx2 - bx1, by2 - by1, ctx, defs, _this4, btlr, btrr, bbrr, bblr);
                }
              }
            }
          });
        } // boxShadow可能会有多个


        if (boxShadow) {
          boxShadow.forEach(function (item) {
            renderBoxShadow(renderMode, ctx, defs, item, _this4, x1, y1, x6, y6, outerWidth, outerHeight);
          });
        } // 边框需考虑尖角，两条相交边平分45°夹角


        if (borderTopWidth > 0 && borderTopColor[3] > 0) {
          renderBorder(renderMode, __cacheStyle[BORDER_TOP], __cacheStyle[BORDER_TOP_COLOR], ctx, this, dx, dy);
        }

        if (borderRightWidth > 0 && borderRightColor[3] > 0) {
          renderBorder(renderMode, __cacheStyle[BORDER_RIGHT], __cacheStyle[BORDER_RIGHT_COLOR], ctx, this, dx, dy);
        }

        if (borderBottomWidth > 0 && borderBottomColor[3] > 0) {
          renderBorder(renderMode, __cacheStyle[BORDER_BOTTOM], __cacheStyle[BORDER_BOTTOM_COLOR], ctx, this, dx, dy);
        }

        if (borderLeftWidth > 0 && borderLeftColor[3] > 0) {
          renderBorder(renderMode, __cacheStyle[BORDER_LEFT], __cacheStyle[BORDER_LEFT_COLOR], ctx, this, dx, dy);
        }

        if (__cache && __cache.enabled) {
          __cache.__available = true;
        }

        return res;
      }
    }, {
      key: "render",
      value: function render(renderMode, lv, ctx, defs, cache) {
        return this.__renderSelf(renderMode, lv, ctx, defs, cache);
      }
    }, {
      key: "__destroy",
      value: function __destroy() {
        if (this.isDestroyed) {
          return;
        }

        _get(_getPrototypeOf(Xom.prototype), "__destroy", this).call(this);

        var root = this.root;
        this.animationList.forEach(function (item) {
          return item.__destroy();
        });

        this.__frameAnimateList.splice(0).forEach(function (item) {
          frame.offFrame(item);
        });

        root.delRefreshTask(this.__loadBgi.cb);
        root.delRefreshTask(this.__task);
        this.__matrix = this.__matrixEvent = this.__root = null;

        this.__cancelCache();
      } // 先查找到注册了事件的节点，再捕获冒泡判断增加性能

    }, {
      key: "__emitEvent",
      value: function __emitEvent(e, force) {
        var isDestroyed = this.isDestroyed,
            computedStyle = this.computedStyle;

        if (isDestroyed || computedStyle[DISPLAY$2] === 'none' || e.__stopPropagation) {
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
        var __sx1 = this.__sx1,
            __sy1 = this.__sy1,
            offsetWidth = this.offsetWidth,
            offsetHeight = this.offsetHeight,
            matrixEvent = this.matrixEvent,
            pointerEvents = this.computedStyle[POINTER_EVENTS$1];

        if (pointerEvents === 'none') {
          return;
        }

        var inThis = tf.pointInQuadrilateral(x, y, __sx1, __sy1, __sx1 + offsetWidth, __sy1, __sx1 + offsetWidth, __sy1 + offsetHeight, __sx1, __sy1 + offsetHeight, matrixEvent);

        if (inThis) {
          if (!e.target) {
            e.target = this; // 缓存target给move用

            if (e.event.type === 'touchstart') {
              this.root && (this.root.__touchstartTarget = this);
            }
          }

          return true;
        }
      }
    }, {
      key: "__gradient",
      value: function __gradient(renderMode, ctx, defs, bx1, by1, bx2, by2, vs) {
        var iw = bx2 - bx1;
        var ih = by2 - by1;
        var k = vs.k,
            v = vs.v,
            d = vs.d,
            s = vs.s,
            z = vs.z,
            p = vs.p;
        var cx = bx1 + iw * 0.5;
        var cy = by1 + ih * 0.5;
        var res = {
          k: k
        };

        if (k === 'linear') {
          var gd = gradient.getLinear(v, d, bx1, by1, cx, cy, iw, ih);
          res.v = this.__getLg(renderMode, ctx, defs, gd);
        } else if (k === 'radial') {
          var _gd = gradient.getRadial(v, s, z, p, bx1, by1, bx2, by2);

          if (_gd) {
            res.v = this.__getRg(renderMode, ctx, defs, _gd);

            if (_gd.matrix) {
              res.v = [res.v, _gd.matrix, _gd.cx, _gd.cy];
            }
          }
        } else if (k === 'conic') {
          var bbox = this.bbox;
          var m1 = Math.max(Math.abs(bbox[2] - bbox[0]), Math.abs(bbox[3] - bbox[1]));
          var m2 = Math.max(Math.abs(iw), Math.abs(ih));

          var _gd2 = gradient.getConic(v, d, p, bx1, by1, bx2, by2, m1 / m2);

          res.v = this.__getCg(renderMode, ctx, defs, _gd2);
        }

        return res;
      }
    }, {
      key: "__getLg",
      value: function __getLg(renderMode, ctx, defs, gd) {
        if (renderMode === mode.CANVAS) {
          var lg = ctx.createLinearGradient(gd.x1, gd.y1, gd.x2, gd.y2);
          gd.stop.forEach(function (item) {
            lg.addColorStop(item[1], int2rgba$1(item[0]));
          });
          return lg;
        } else if (renderMode === mode.SVG) {
          var v = {
            tagName: 'linearGradient',
            props: [['x1', gd.x1], ['y1', gd.y1], ['x2', gd.x2], ['y2', gd.y2]],
            children: gd.stop.map(function (item) {
              return {
                tagName: 'stop',
                props: [['stop-color', int2rgba$1(item[0])], ['offset', item[1] * 100 + '%']]
              };
            })
          };
          var uuid = defs.add(v);

          this.__config[NODE_DEFS_CACHE].push(v);

          return 'url(#' + uuid + ')';
        }
      }
    }, {
      key: "__getRg",
      value: function __getRg(renderMode, ctx, defs, gd) {
        if (renderMode === mode.CANVAS) {
          var rg = ctx.createRadialGradient(gd.cx, gd.cy, 0, gd.cx, gd.cy, gd.r);
          gd.stop.forEach(function (item) {
            rg.addColorStop(item[1], int2rgba$1(item[0]));
          });
          return rg;
        } else if (renderMode === mode.SVG) {
          var v = {
            tagName: 'radialGradient',
            props: [['cx', gd.cx], ['cy', gd.cy], ['r', gd.r]],
            children: gd.stop.map(function (item) {
              return {
                tagName: 'stop',
                props: [['stop-color', int2rgba$1(item[0])], ['offset', item[1] * 100 + '%']]
              };
            })
          };
          var uuid = defs.add(v);

          this.__config[NODE_DEFS_CACHE].push(v);

          return 'url(#' + uuid + ')';
        }
      }
    }, {
      key: "__getCg",
      value: function __getCg(renderMode, ctx, defs, gd) {
        var cx = gd.cx,
            cy = gd.cy,
            r = gd.r,
            deg = gd.deg,
            stop = gd.stop;
        var len = stop.length - 1;

        if (stop[len][1] < 1) {
          stop.push([stop[len][0].slice(0), 1]);
        }

        if (stop[0][1] > 0) {
          stop.unshift([stop[0][0].slice(0), 0]);
        }

        var offset = renderMode === mode.CANVAS ? 1.5 : 0.5; // 根据2个stop之间的百分比得角度差划分块数，每0.5°一块，不足也算

        var list = [];

        for (var i = 0, _len3 = stop.length; i < _len3 - 1; i++) {
          var begin = stop[i][1] * 360;

          var _end = stop[i + 1][1] * 360;

          var diff = _end - begin;
          var n = Math.ceil(diff);
          var per = diff / n; // 计算每块的2个弧端点

          var bc = stop[i][0];
          var ec = stop[i + 1][0];
          var dc = [ec[0] - bc[0], ec[1] - bc[1], ec[2] - bc[2], ec[3] - bc[3]];
          var pc = [dc[0] / n, dc[1] / n, dc[2] / n, dc[3] / n];

          for (var j = 0; j < n; j++) {
            var _geom$pointOnCircle = geom.pointOnCircle(cx, cy, r, begin + per * j + deg - offset),
                _geom$pointOnCircle2 = _slicedToArray(_geom$pointOnCircle, 2),
                x1 = _geom$pointOnCircle2[0],
                y1 = _geom$pointOnCircle2[1];

            var _geom$pointOnCircle3 = geom.pointOnCircle(cx, cy, r, begin + per * j + deg + offset),
                _geom$pointOnCircle4 = _slicedToArray(_geom$pointOnCircle3, 2),
                _x3 = _geom$pointOnCircle4[0],
                _y3 = _geom$pointOnCircle4[1];

            list.push([x1, y1, _x3, _y3, Math.round(bc[0] + pc[0] * j), Math.round(bc[1] + pc[1] * j), Math.round(bc[2] + pc[2] * j), Math.round(bc[3] + pc[3] * j)]);
          }
        } // 最后一段补自己末尾颜色特殊处理


        var end = list[0].slice(0);

        var _geom$pointOnCircle5 = geom.pointOnCircle(cx, cy, r, deg),
            _geom$pointOnCircle6 = _slicedToArray(_geom$pointOnCircle5, 2),
            x2 = _geom$pointOnCircle6[0],
            y2 = _geom$pointOnCircle6[1];

        end[2] = x2;
        end[3] = y2;
        var s = stop[stop.length - 1][0];
        end[4] = s[0];
        end[5] = s[1];
        end[6] = s[2];
        end[7] = s[3];
        list.push(end);
        var prev,
            res = [];

        if (renderMode === mode.CANVAS) {
          for (var _i11 = 0, _len4 = list.length; _i11 < _len4; _i11++) {
            var cur = list[_i11];

            if (prev) {
              var lg = ctx.createLinearGradient(prev[0], prev[1], cur[2], cur[3]);
              lg.addColorStop(0, int2rgba$1([prev[4], prev[5], prev[6], prev[7]]));
              lg.addColorStop(1, int2rgba$1([cur[4], cur[5], cur[6], cur[7]]));
              res.push([[[cx, cy], [prev[0], prev[1]], [cur[2], cur[3]]], lg]);
            }

            prev = cur;
          }
        } else if (renderMode === mode.SVG) {
          for (var _i12 = 0, _len5 = list.length; _i12 < _len5; _i12++) {
            var _cur = list[_i12];

            if (prev) {
              var v = {
                tagName: 'linearGradient',
                props: [['x1', prev[0]], ['y1', prev[1]], ['x2', _cur[2]], ['y2', _cur[3]]],
                children: [{
                  tagName: 'stop',
                  props: [['stop-color', int2rgba$1([prev[4], prev[5], prev[6], prev[7]])], ['offset', '0%']]
                }, {
                  tagName: 'stop',
                  props: [['stop-color', int2rgba$1([_cur[4], _cur[5], _cur[6], _cur[7]])], ['offset', '100%']]
                }]
              };
              var uuid = defs.add(v);

              this.__config[NODE_DEFS_CACHE].push(v);

              res.push([[[cx, cy], [prev[0], prev[1]], [_cur[2], _cur[3]]], 'url(#' + uuid + ')']);
            }

            prev = _cur;
          }
        }

        return res;
      } // canvas清空自身cache，cacheTotal在Root的自底向上逻辑做，svg仅有cacheTotal

    }, {
      key: "__cancelCache",
      value: function __cancelCache(onlyTotal) {
        var __config = this.__config;
        var __cacheTotal = __config[NODE_CACHE_TOTAL];
        var __cacheFilter = __config[NODE_CACHE_FILTER$1];
        var __cacheMask = __config[NODE_CACHE_MASK];
        var __cacheOverflow = __config[NODE_CACHE_OVERFLOW$1];

        if (!onlyTotal) {
          __config[NODE_CACHE_STYLE] = this.__cacheStyle = {};
          var __cache = __config[NODE_CACHE$1];

          if (__cache) {
            __cache.release();
          }
        }

        if (__cacheTotal) {
          __cacheTotal.release();
        }

        if (__cacheFilter) {
          inject.releaseCacheCanvas(__cacheFilter.canvas);
          __config[NODE_CACHE_FILTER$1] = null;
        }

        if (__cacheMask) {
          inject.releaseCacheCanvas(__cacheMask.canvas);
          __config[NODE_CACHE_MASK] = null;
        }

        if (__cacheOverflow) {
          inject.releaseCacheCanvas(__cacheOverflow.canvas);
          __config[NODE_CACHE_OVERFLOW$1] = null;
        }
      }
    }, {
      key: "updateStyle",
      value: function updateStyle(style, cb) {
        var node = this;
        var root = node.root,
            __config = node.__config;
        var formatStyle = css.normalize(style); // 有root说明被添加渲染过了

        if (root) {
          root.addRefreshTask(node.__task = {
            __before: function __before() {
              if (__config[NODE_IS_DESTROYED$1]) {
                return;
              } // 刷新前统一赋值，由刷新逻辑计算最终值避免优先级覆盖问题


              var res = {};
              res[UPDATE_NODE$1] = node;
              res[UPDATE_STYLE$1] = formatStyle;
              res[UPDATE_OVERWRITE] = style; // 标识盖原有style样式不仅仅是修改currentStyle，不同于animate

              res[UPDATE_KEYS$1] = Object.keys(formatStyle).map(function (i) {
                if (!GEOM$4.hasOwnProperty(i)) {
                  i = parseInt(i);
                }

                return i;
              });
              res[UPDATE_CONFIG$1] = __config;

              root.__addUpdate(node, __config, root, root.__config, res);
            },
            __after: function __after(diff) {
              if (util.isFunction(cb)) {
                cb.call(node, diff);
              }
            }
          });
        } // 没有是在如parse()还未添加的时候，可以直接同步覆盖
        else {
            Object.assign(this.currentStyle, formatStyle);

            if (util.isFunction(cb)) {
              cb.call(node, 0);
            }
          }
      }
    }, {
      key: "updateFormatStyleNoOverwrite",
      value: function updateFormatStyleNoOverwrite(style, cb) {
        var root = this.root,
            __config = this.__config;

        if (root) {
          var node = this;
          root.addRefreshTask(node.__task = {
            __before: function __before() {
              if (__config[NODE_IS_DESTROYED$1]) {
                return;
              } // 刷新前统一赋值，由刷新逻辑计算最终值避免优先级覆盖问题


              var res = {};
              res[UPDATE_NODE$1] = node;
              res[UPDATE_STYLE$1] = style;
              res[UPDATE_KEYS$1] = Object.keys(style).map(function (i) {
                if (!GEOM$4.hasOwnProperty(i)) {
                  i = parseInt(i);
                }

                return i;
              });
              res[UPDATE_CONFIG$1] = __config;

              root.__addUpdate(node, __config, root, root.__config, res);
            },
            __after: function __after(diff) {
              if (util.isFunction(cb)) {
                cb.call(node, diff);
              }
            }
          });
        }
      }
    }, {
      key: "animate",
      value: function animate(list) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var animation = new Animation(this, list, options);

        if (this.isDestroyed) {
          animation.__destroy(true);

          return animation;
        }

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
      key: "frameAnimate",
      value: function frameAnimate(cb) {
        if (util.isFunction(cb)) {
          var enter = {
            __after: function __after(diff) {
              cb(diff);
            },
            __karasFramecb: cb
          };

          this.__frameAnimateList.push(enter);

          frame.onFrame(enter);
          return cb;
        }
      }
    }, {
      key: "removeFrameAnimate",
      value: function removeFrameAnimate(cb) {
        for (var i = 0, list = this.__frameAnimateList, len = list.length; i < len; i++) {
          if (list[i].__karasFramecb === cb) {
            list.splice(i, 1);
            frame.offFrame(cb);
          }
        }
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
      key: "__deepScan",
      value: function __deepScan(cb, options) {
        return cb(this, options);
      } // isLayout为false时，为relative/margin/flex/vertical等

    }, {
      key: "__offsetX",
      value: function __offsetX(diff, isLayout, lv) {
        _get(_getPrototypeOf(Xom.prototype), "__offsetX", this).call(this, diff, isLayout);

        if (isLayout) {
          this.__layoutData.x += diff;
        }

        if (lv !== undefined) {
          this.__config[NODE_REFRESH_LV] |= lv;
        }

        this.__sx1 += diff;
        this.__sx2 += diff;
        this.__sx3 += diff;
        this.__sx4 += diff;
      }
    }, {
      key: "__offsetY",
      value: function __offsetY(diff, isLayout, lv) {
        _get(_getPrototypeOf(Xom.prototype), "__offsetY", this).call(this, diff, isLayout);

        if (isLayout) {
          this.__layoutData.y += diff;
        }

        if (lv !== undefined) {
          this.__config[NODE_REFRESH_LV] |= lv;
        }

        this.__sy1 += diff;
        this.__sy2 += diff;
        this.__sy3 += diff;
        this.__sy4 += diff;
      }
    }, {
      key: "__resizeX",
      value: function __resizeX(diff, lv) {
        this.computedStyle.width = this.__width += diff;
        this.__clientWidth += diff;
        this.__offsetWidth += diff;
        this.__outerWidth += diff;
        this.__layoutData.w += diff;

        if (diff < 0) {
          this.__config[NODE_LIMIT_CACHE] = false;
        }

        if (lv !== undefined) {
          this.__config[NODE_REFRESH_LV] |= lv;
        }
      }
    }, {
      key: "__resizeY",
      value: function __resizeY(diff, lv) {
        this.computedStyle.height = this.__height += diff;
        this.__clientHeight += diff;
        this.__offsetHeight += diff;
        this.__outerHeight += diff;
        this.__layoutData.h += diff;

        if (diff < 0) {
          this.__config[NODE_LIMIT_CACHE] = false;
        }

        if (lv !== undefined) {
          this.__config[NODE_REFRESH_LV] |= lv;
        }
      }
    }, {
      key: "__spreadByBoxShadowAndFilter",
      value: function __spreadByBoxShadowAndFilter(boxShadow, filter) {
        var ox = 0,
            oy = 0;

        if (Array.isArray(boxShadow)) {
          boxShadow.forEach(function (item) {
            var _item2 = _slicedToArray(item, 6),
                x = _item2[0],
                y = _item2[1],
                blur = _item2[2],
                spread = _item2[3],
                inset = _item2[5];

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
      key: "__releaseWhenEmpty",
      value: function __releaseWhenEmpty(__cache) {
        if (__cache && __cache.available) {
          __cache.release();
        }

        return true;
      }
    }, {
      key: "getComputedStyle",
      value: function getComputedStyle(key) {
        var computedStyle = this.computedStyle;
        var res = {};
        var keys;

        if (key) {
          if (Array.isArray(key)) {
            keys = key;
          } else {
            keys = [key];
          }

          keys = keys.map(function (s) {
            return STYLE_KEY$6[style2Upper$2(s)];
          });
        } else {
          keys = Object.keys(computedStyle);
        }

        keys.forEach(function (k) {
          if (GEOM$4.hasOwnProperty(k)) {
            res[k] = computedStyle[k];
          } else {
            res[STYLE_RV_KEY$2[k]] = computedStyle[k];
          }
        });
        return res;
      }
    }, {
      key: "getBoundingClientRect",
      value: function getBoundingClientRect() {
        var __sx1 = this.__sx1,
            __sy1 = this.__sy1,
            offsetWidth = this.offsetWidth,
            offsetHeight = this.offsetHeight,
            matrixEvent = this.matrixEvent;
        var p1 = mx.calPoint([__sx1, __sy1], matrixEvent);
        var p2 = mx.calPoint([__sx1 + offsetWidth, __sy1], matrixEvent);
        var p3 = mx.calPoint([__sx1 + offsetWidth, __sy1 + offsetHeight], matrixEvent);
        var p4 = mx.calPoint([__sx1, __sy1 + offsetHeight], matrixEvent);
        return {
          left: Math.min(p1[0], Math.min(p2[0], Math.min(p3[0], p4[0]))),
          top: Math.min(p1[1], Math.min(p2[1], Math.min(p3[1], p4[1]))),
          right: Math.max(p1[0], Math.max(p2[0], Math.max(p3[0], p4[0]))),
          bottom: Math.max(p1[1], Math.max(p2[1], Math.max(p3[1], p4[1]))),
          points: [p1, p2, p3, p4]
        };
      }
    }, {
      key: "tagName",
      get: function get() {
        return this.__tagName;
      }
    }, {
      key: "sx",
      get: function get() {
        return this.__sx;
      }
    }, {
      key: "sy",
      get: function get() {
        return this.__sy;
      }
    }, {
      key: "clientWidth",
      get: function get() {
        return this.__clientWidth || 0;
      }
    }, {
      key: "clientHeight",
      get: function get() {
        return this.__clientHeight || 0;
      }
    }, {
      key: "offsetWidth",
      get: function get() {
        return this.__offsetWidth || 0;
      }
    }, {
      key: "offsetHeight",
      get: function get() {
        return this.__offsetHeight || 0;
      }
    }, {
      key: "outerWidth",
      get: function get() {
        return this.__outerWidth || 0;
      }
    }, {
      key: "outerHeight",
      get: function get() {
        return this.__outerHeight || 0;
      } // 不考虑margin的范围

    }, {
      key: "bbox",
      get: function get() {
        var __sx1 = this.__sx1,
            __sy1 = this.__sy1,
            clientWidth = this.clientWidth,
            clientHeight = this.clientHeight,
            _this$currentStyle = this.currentStyle,
            borderTopWidth = _this$currentStyle[BORDER_TOP_WIDTH$1],
            borderRightWidth = _this$currentStyle[BORDER_RIGHT_WIDTH$1],
            borderBottomWidth = _this$currentStyle[BORDER_BOTTOM_WIDTH$1],
            borderLeftWidth = _this$currentStyle[BORDER_LEFT_WIDTH$1],
            boxShadow = _this$currentStyle[BOX_SHADOW$2],
            filter = _this$currentStyle[FILTER$3];

        var _this$__spreadByBoxSh = this.__spreadByBoxShadowAndFilter(boxShadow, filter),
            _this$__spreadByBoxSh2 = _slicedToArray(_this$__spreadByBoxSh, 2),
            ox = _this$__spreadByBoxSh2[0],
            oy = _this$__spreadByBoxSh2[1];

        clientWidth += borderLeftWidth[0] + borderRightWidth[0];
        clientHeight += borderTopWidth[0] + borderBottomWidth[0];
        return [__sx1 - ox, __sy1 - oy, __sx1 + clientWidth + ox, __sy1 + clientHeight + oy];
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
      }
    }, {
      key: "currentStyle",
      get: function get() {
        return this.__currentStyle;
      }
    }, {
      key: "isShadowRoot",
      get: function get() {
        return !this.parent && this.host && this.host !== this.root;
      }
    }]);

    return Xom;
  }(Node);

  var MARGIN_BOTTOM$2 = enums.STYLE_KEY.MARGIN_BOTTOM;

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
        // lineGroup都是inline-block，不会有负
        var n = 0;
        this.list.forEach(function (item) {
          n = Math.max(n, item.computedStyle[MARGIN_BOTTOM$2]);
        });
        return n;
      }
    }]);

    return LineGroup;
  }();

  var NODE_DOM_PARENT$1 = enums.NODE_KEY.NODE_DOM_PARENT;
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
    } // text的relation会由上层如Root设置
    else {
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
          inheritAnimate = json.inheritAnimate,
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
          item.target = item.target.vd;
        });
      } // 更新过程中key相同或者普通相同的vd继承动画


      if (inheritAnimate) {
        util.extendAnimate(inheritAnimate, vd);
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
        flattenJson(children);
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
      children.__domParent = parent; // 极为恶心，为了v8的性能优化，text复用parent的style部分，但domParent重设

      if (children instanceof Text) {
        Object.assign(children.__config, parent.__config);
      }

      if (children.__config) {
        children.__config[NODE_DOM_PARENT$1] = parent;
      }

      if (options.prev) {
        options.prev.__next = children;
        children.__prev = options.prev;
      }

      options.prev = children; // 文字视作为父节点的直接文字子节点

      if (children instanceof Component) {
        var sr = children.shadowRoot;

        if (sr instanceof Text) {
          sr.__parent = parent;
          Object.assign(sr.__config, parent.__config);
        }

        sr.__domParent = parent;

        if (sr.__config) {
          sr.__config[NODE_DOM_PARENT$1] = parent;
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

  var isNil$6 = util.isNil,
      isFunction$4 = util.isFunction,
      clone$3 = util.clone,
      extend$1 = util.extend;
  var REGISTER = {};
  /**
   * 向上设置cp类型叶子节点，表明从root到本节点这条链路有更新，使得无链路更新的节约递归
   * @param cp
   */

  function setUpdateFlag(cp) {
    // 去重
    if (cp.__hasUpdate) {
      return;
    }

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
      _this.__taskList = [];
      return _this;
    }

    _createClass(Component, [{
      key: "setState",
      value: function setState(n, cb) {
        var _this2 = this;

        var self = this;

        if (isNil$6(n)) {
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
          n = extend$1(state, n);
        }

        var root = self.root;

        if (root && self.__isMounted) {
          // 一帧之内多次调用，需合并
          if (self.__nextState) {
            Object.assign(self.__nextState, n);

            self.__taskList.push(cb);
          } else {
            self.__nextState = n;
            self.__taskList = [cb];
            var list = [];
            var t = self.__task = {
              __before: function __before() {
                list = self.__taskList.splice(0); // 标识更新

                setUpdateFlag(_this2);
              },
              __after: function __after() {
                list.forEach(function (cb) {
                  if (isFunction$4(cb)) {
                    cb.call(self);
                  }
                });
              }
            };
            root.addRefreshCp(t);
          }
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

        this.__ref = {};
        var root = this.root;
        var cd = json || builder.flattenJson(this.render());
        var sr = builder.initCp(cd, root, this);
        this.__cd = cd;

        if (sr instanceof Text) {
          // 文字视作为父节点的直接文字子节点，在builder里做
          inject.warn('Component render() return a text, should not inherit style/event');
        } else if (sr instanceof Node) {
          var style = css.normalize(this.props.style);
          var keys = Object.keys(style);
          extend$1(sr.style, style, keys);
          extend$1(sr.currentStyle, style, keys); // 事件添加到sr，以及自定义事件

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
          inject.warn('Component render() return a component: ' + this.tagName + ' -> ' + sr.tagName + ', should not inherit style/event');
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
      value: function render() {
        inject.warn('Component must implement render()!');
      }
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
        } // this.__shadow = null;
        // this.__shadowRoot = null;


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
      key: "domParent",
      get: function get() {
        return this.__domParent;
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
    }], [{
      key: "getRegister",
      value: function getRegister(name) {
        if (!name || !util.isString(name) || !/^[A-Z]/.test(name)) {
          throw new Error('Invalid param');
        }

        if (!REGISTER.hasOwnProperty(name)) {
          throw new Error("Component has not register: ".concat(name));
        }

        return REGISTER[name];
      }
    }, {
      key: "register",
      value: function register(name, obj) {
        if (!name || !util.isString(name) || !/^[A-Z]/.test(name) || !(obj.prototype instanceof Component)) {
          throw new Error('Invalid param');
        }

        if (Component.hasRegister(name)) {
          throw new Error("Component has already register: ".concat(name));
        }

        REGISTER[name] = obj;
      }
    }, {
      key: "hasRegister",
      value: function hasRegister(name) {
        return name && REGISTER.hasOwnProperty(name);
      }
    }, {
      key: "REGISTER",
      get: function get() {
        return REGISTER;
      }
    }]);

    return Component;
  }(Event);

  Object.keys(o.GEOM).concat(['x', 'y', 'ox', 'oy', 'sx', 'sy', 'width', 'height', 'outerWidth', 'outerHeight', 'clientWidth', 'clientHeight', 'offsetWidth', 'offsetHeight', 'style', 'animationList', 'animateStyle', 'currentStyle', 'computedStyle', 'currentProps', 'baseLine', 'virtualDom', 'mask', 'maskId', 'textWidth', 'content', 'lineBoxes', 'charWidthList', 'charWidth', '__layoutData', 'availableAnimating', 'effectiveAnimating', 'displayAnimating', 'visibilityAnimating', 'bbox', '__config']).forEach(function (fn) {
    Object.defineProperty(Component$1.prototype, fn, {
      get: function get() {
        var sr = this.shadowRoot;

        if (sr) {
          return sr[fn];
        }
      }
    });
  });
  ['__layout', '__layoutAbs', '__layoutNone', '__tryLayInline', '__offsetX', '__offsetY', '__calAutoBasis', '__calMp', '__calAbs', '__renderAsMask', '__renderByMask', '__mp', 'animate', 'removeAnimate', 'clearAnimate', 'updateStyle', 'getBoundingClientRect', 'getComputedStyle', '__deepScan', '__cancelCache', '__structure', '__modifyStruct', '__updateStruct'].forEach(function (fn) {
    Component$1.prototype[fn] = function () {
      var sr = this.shadowRoot;

      if (sr && isFunction$4(sr[fn])) {
        return sr[fn].apply(sr, arguments);
      }
    };
  });

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

  var _enums$STYLE_KEY$b = enums.STYLE_KEY,
      POSITION$2 = _enums$STYLE_KEY$b.POSITION,
      DISPLAY$3 = _enums$STYLE_KEY$b.DISPLAY,
      FONT_WEIGHT$5 = _enums$STYLE_KEY$b.FONT_WEIGHT,
      MARGIN_LEFT$2 = _enums$STYLE_KEY$b.MARGIN_LEFT,
      MARGIN_TOP$2 = _enums$STYLE_KEY$b.MARGIN_TOP,
      MARGIN_RIGHT$2 = _enums$STYLE_KEY$b.MARGIN_RIGHT,
      MARGIN_BOTTOM$3 = _enums$STYLE_KEY$b.MARGIN_BOTTOM,
      PADDING_LEFT$2 = _enums$STYLE_KEY$b.PADDING_LEFT,
      PADDING_BOTTOM$2 = _enums$STYLE_KEY$b.PADDING_BOTTOM,
      PADDING_RIGHT$2 = _enums$STYLE_KEY$b.PADDING_RIGHT,
      PADDING_TOP$2 = _enums$STYLE_KEY$b.PADDING_TOP,
      BORDER_TOP_WIDTH$2 = _enums$STYLE_KEY$b.BORDER_TOP_WIDTH,
      BORDER_BOTTOM_WIDTH$2 = _enums$STYLE_KEY$b.BORDER_BOTTOM_WIDTH,
      BORDER_RIGHT_WIDTH$2 = _enums$STYLE_KEY$b.BORDER_RIGHT_WIDTH,
      BORDER_LEFT_WIDTH$2 = _enums$STYLE_KEY$b.BORDER_LEFT_WIDTH,
      TOP$2 = _enums$STYLE_KEY$b.TOP,
      RIGHT$2 = _enums$STYLE_KEY$b.RIGHT,
      BOTTOM$2 = _enums$STYLE_KEY$b.BOTTOM,
      LEFT$2 = _enums$STYLE_KEY$b.LEFT,
      WIDTH$4 = _enums$STYLE_KEY$b.WIDTH,
      HEIGHT$4 = _enums$STYLE_KEY$b.HEIGHT,
      TEXT_ALIGN$3 = _enums$STYLE_KEY$b.TEXT_ALIGN,
      FLEX_DIRECTION$2 = _enums$STYLE_KEY$b.FLEX_DIRECTION,
      FLEX_BASIS$2 = _enums$STYLE_KEY$b.FLEX_BASIS,
      FLEX_SHRINK$1 = _enums$STYLE_KEY$b.FLEX_SHRINK,
      FLEX_GROW$1 = _enums$STYLE_KEY$b.FLEX_GROW,
      ALIGN_SELF$1 = _enums$STYLE_KEY$b.ALIGN_SELF,
      ALIGN_ITEMS$1 = _enums$STYLE_KEY$b.ALIGN_ITEMS,
      JUSTIFY_CONTENT$1 = _enums$STYLE_KEY$b.JUSTIFY_CONTENT,
      Z_INDEX$3 = _enums$STYLE_KEY$b.Z_INDEX,
      _enums$NODE_KEY$3 = enums.NODE_KEY,
      NODE_CURRENT_STYLE$1 = _enums$NODE_KEY$3.NODE_CURRENT_STYLE,
      NODE_STYLE$1 = _enums$NODE_KEY$3.NODE_STYLE,
      NODE_STRUCT$2 = _enums$NODE_KEY$3.NODE_STRUCT,
      NODE_DOM_PARENT$2 = _enums$NODE_KEY$3.NODE_DOM_PARENT,
      _enums$STRUCT_KEY$1 = enums.STRUCT_KEY,
      STRUCT_NUM = _enums$STRUCT_KEY$1.STRUCT_NUM,
      STRUCT_LV$1 = _enums$STRUCT_KEY$1.STRUCT_LV,
      STRUCT_TOTAL = _enums$STRUCT_KEY$1.STRUCT_TOTAL,
      STRUCT_CHILD_INDEX$1 = _enums$STRUCT_KEY$1.STRUCT_CHILD_INDEX,
      STRUCT_INDEX$1 = _enums$STRUCT_KEY$1.STRUCT_INDEX;
  var AUTO$3 = unit.AUTO,
      PX$5 = unit.PX,
      PERCENT$6 = unit.PERCENT;
  var calAbsolute$1 = css.calAbsolute,
      isRelativeOrAbsolute$1 = css.isRelativeOrAbsolute;

  function genZIndexChildren(dom) {
    var flow = [];
    var abs = [];
    var hasMc;
    var mcHash = {};
    var needSort = false;
    var lastIndex;
    var lastMaskIndex;
    var children = dom.children;
    children.forEach(function (item, i) {
      var child = item;

      if (item instanceof Component$1) {
        item = item.shadowRoot;
      } // 遮罩单独保存后特殊排序


      if (item instanceof Xom && item.isMask) {
        // 开头的mc忽略，后续的连续mc以第一次出现为准
        if (lastMaskIndex !== undefined) {
          mcHash[lastMaskIndex].push(item);
        } else if (i) {
          lastMaskIndex = i - 1;
          children[lastMaskIndex].__iIndex = lastMaskIndex;
          mcHash[lastMaskIndex] = [item];
          hasMc = true;
        }
      } else {
        lastMaskIndex = undefined;

        if (item instanceof Xom) {
          if (isRelativeOrAbsolute$1(item)) {
            // 临时变量为排序使用
            child.__iIndex = i;
            var z = child.__zIndex = item.currentStyle[Z_INDEX$3];
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
    var res = flow.concat(abs); // 将遮罩插入到对应顺序上

    if (hasMc) {
      for (var i = res.length - 1; i >= 0; i--) {
        var idx = res[i].__iIndex;

        if (mcHash.hasOwnProperty(idx)) {
          res.splice.apply(res, [i + 1, 0].concat(_toConsumableArray(mcHash[idx])));
        }
      }
    }

    return res;
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

      if (!style[FONT_WEIGHT$5] && tag.BOLD.hasOwnProperty(tagName)) {
        style.fontWeight = 700;
      }

      _this.__style = css.normalize(style, reset.DOM_ENTRY_SET); // currentStyle/currentProps不深度clone，继承一层即可，动画时也是extend这样只改一层引用不动原始静态style

      _this.__currentStyle = util.extend({}, _this.__style);
      _this.__children = children || [];
      var config = _this.__config;
      config[NODE_CURRENT_STYLE$1] = _this.__currentStyle;
      config[NODE_STYLE$1] = _this.__style;
      return _this;
    }

    _createClass(Dom, [{
      key: "__structure",
      value: function __structure(i, lv, j) {
        var res = _get(_getPrototypeOf(Dom.prototype), "__structure", this).call(this, i++, lv, j);

        var arr = [res];
        var zIndexChildren = this.__zIndexChildren = this.__zIndexChildren || genZIndexChildren(this);
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
        var total = arr.length - 1;
        res[STRUCT_NUM] = zIndexChildren.length;
        res[STRUCT_TOTAL] = total;
        return arr;
      }
    }, {
      key: "__modifyStruct",
      value: function __modifyStruct(root) {
        var _root$__structs;

        var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var __config = this.__config;
        var struct = __config[NODE_STRUCT$2];
        var total = struct[STRUCT_TOTAL] || 0; // 新生成了struct，引用也变了

        var nss = this.__structure(struct[STRUCT_INDEX$1], struct[STRUCT_LV$1], struct[STRUCT_CHILD_INDEX$1]);

        (_root$__structs = root.__structs).splice.apply(_root$__structs, [struct[STRUCT_INDEX$1] + offset, struct[STRUCT_TOTAL] + 1].concat(_toConsumableArray(nss)));

        var d = 0;

        if (this !== root) {
          struct = __config[NODE_STRUCT$2];
          d = (struct[STRUCT_TOTAL] || 0) - total;
          var ps = __config[NODE_DOM_PARENT$2].__config[NODE_STRUCT$2];
          ps[STRUCT_TOTAL] = ps[STRUCT_TOTAL] || 0;
          ps[STRUCT_TOTAL] += d;
        }

        return [struct, d];
      }
      /**
       * 因为zIndex/abs的变化造成的更新，只需重排这一段顺序即可
       * 即便包含component造成的dom变化也不影响，component作为子节点reflow会再执行，这里重排老的vd
       * @param structs
       * @private
       */

    }, {
      key: "__updateStruct",
      value: function __updateStruct(structs) {
        var _this$__config$NODE_S = this.__config[NODE_STRUCT$2],
            index = _this$__config$NODE_S[STRUCT_INDEX$1],
            _this$__config$NODE_S2 = _this$__config$NODE_S[STRUCT_TOTAL],
            total = _this$__config$NODE_S2 === void 0 ? 0 : _this$__config$NODE_S2;
        var zIndexChildren = this.__zIndexChildren = genZIndexChildren(this);
        var length = zIndexChildren.length;

        if (length === 1) {
          return;
        }

        zIndexChildren.forEach(function (child, i) {
          child.__config[NODE_STRUCT$2][STRUCT_CHILD_INDEX$1] = i;
        }); // 按直接子节点划分为相同数量的若干段进行排序

        var arr = [];
        var source = [];

        for (var i = index + 1; i <= index + total; i++) {
          var child = structs[i];
          var o = {
            child: child,
            list: structs.slice(child[STRUCT_INDEX$1], child[STRUCT_INDEX$1] + child[STRUCT_TOTAL] + 1)
          };
          arr.push(o);
          source.push(o);
          i += child[STRUCT_TOTAL] || 0;
        }

        arr.sort(function (a, b) {
          return a.child[STRUCT_CHILD_INDEX$1] - b.child[STRUCT_CHILD_INDEX$1];
        }); // 是否有变更，有才进行重新计算

        var needSort;

        for (var _i = 0, len = source.length; _i < len; _i++) {
          if (source[_i] !== arr[_i]) {
            needSort = true;
            break;
          }
        }

        if (needSort) {
          var list = [];
          arr.forEach(function (item) {
            list = list.concat(item.list);
          });
          list.forEach(function (struct, i) {
            struct[STRUCT_INDEX$1] = index + i + 1;
          });
          structs.splice.apply(structs, [index + 1, total].concat(_toConsumableArray(list)));
        }
      } // 给定父宽度情况下，尝试行内放下后的剩余宽度，为负数即放不下

    }, {
      key: "__tryLayInline",
      value: function __tryLayInline(w, total) {
        var flowChildren = this.flowChildren,
            width = this.currentStyle[WIDTH$4];

        if (width[1] === PX$5) {
          return w - width[0];
        } else if (width[1] === PERCENT$6) {
          return w - total * width[0] * 0.01;
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
      /**
       * flex布局时，计算basis尺寸，如果有css声明则以其为标准，没有则auto自动计算
       * 声明为%比时基准容器为传入的w/h，一般是父block元素，递归flex则一直是父block
       * 影响尺寸的只有换行的text，以及一组inline，均按其中最大尺寸的一个计算
       * auto自动计算递归进行，如果是普通row方向，按最大text的charWidth为准
       * 如果是column方向，则水平排满后看text的height
       * 在的abs下时进入特殊状态，无论是row/column，都会按row方向尝试最大尺寸，直到舞台边缘或容器声明的w折行
       * 返回b，声明则按css值，否则同min
       * 返回min为最小宽度，遇到字符则单列排版后需要的最大宽度
       * 返回max为最大宽度，在abs时isVirtual状态参与计算，文本抵达边界才进行换行
       * @param isDirectionRow
       * @param x
       * @param y
       * @param w
       * @param h
       * @param isVirtual
       * @private
       */

    }, {
      key: "__calAutoBasis",
      value: function __calAutoBasis(isDirectionRow, x, y, w, h, isVirtual) {
        var b = 0;
        var min = 0;
        var max = 0;
        var flowChildren = this.flowChildren,
            currentStyle = this.currentStyle; // 计算需考虑style的属性

        var width = currentStyle[WIDTH$4],
            height = currentStyle[HEIGHT$4],
            marginLeft = currentStyle[MARGIN_LEFT$2],
            marginTop = currentStyle[MARGIN_TOP$2],
            marginRight = currentStyle[MARGIN_RIGHT$2],
            marginBottom = currentStyle[MARGIN_BOTTOM$3],
            paddingLeft = currentStyle[PADDING_LEFT$2],
            paddingTop = currentStyle[PADDING_TOP$2],
            paddingRight = currentStyle[PADDING_RIGHT$2],
            paddingBottom = currentStyle[PADDING_BOTTOM$2],
            borderTopWidth = currentStyle[BORDER_TOP_WIDTH$2],
            borderRightWidth = currentStyle[BORDER_RIGHT_WIDTH$2],
            borderBottomWidth = currentStyle[BORDER_BOTTOM_WIDTH$2],
            borderLeftWidth = currentStyle[BORDER_LEFT_WIDTH$2];
        var main = isDirectionRow ? width : height;

        if (main[1] === PX$5) {
          b = max = main[0];
        } else if (main[1] === PERCENT$6) {
          b = max = main[0] * 0.01 * (isDirectionRow ? w : h);
        } // 递归children取最大值


        flowChildren.forEach(function (item) {
          if (item instanceof Xom || item instanceof Component$1 && item.shadowRoot instanceof Xom) {
            var _item$__calAutoBasis = item.__calAutoBasis(isDirectionRow, x, y, w, h, isVirtual),
                _item$__calAutoBasis2 = _slicedToArray(_item$__calAutoBasis, 3),
                b2 = _item$__calAutoBasis2[0],
                min2 = _item$__calAutoBasis2[1],
                max2 = _item$__calAutoBasis2[2];

            b = Math.max(b, b2);
            min = Math.max(min, min2);
            max = Math.max(max, max2);
          } // 文本水平
          else if (isDirectionRow) {
              b = Math.max(b, item.charWidth);
              min = Math.max(min, item.charWidth);
              max = Math.max(item.textWidth, max);
            } // 文本垂直，尝试伪布局得到高度
            else {
                css.computeReflow(item);

                item.__layout({
                  x: x,
                  y: y,
                  w: w,
                  h: h
                }, true);

                b = Math.max(b, item.height);
                min = Math.max(min, item.height);
                max = Math.max(max, item.height);
              }
        }); // margin/padding/border也得计算在内，此时还没有，百分比相对于父flex元素的宽度

        if (isDirectionRow) {
          var mp = this.__calMp(marginLeft, w) + this.__calMp(marginRight, w) + this.__calMp(paddingLeft, w) + this.__calMp(paddingRight, w);

          var w2 = borderLeftWidth[0] + borderRightWidth[0] + mp;
          b += w2;
          max += w2;
          min += w2;
        } else {
          var _mp = this.__calMp(marginTop, w) + this.__calMp(marginBottom, w) + this.__calMp(paddingTop, w) + this.__calMp(paddingBottom, w);

          var h2 = borderTopWidth[0] + borderBottomWidth[0] + _mp;
          b += h2;
          max += h2;
          min += h2;
        }

        return [b, min, max];
      }
    }, {
      key: "__layoutNone",
      value: function __layoutNone() {
        _get(_getPrototypeOf(Dom.prototype), "__layoutNone", this).call(this);

        var children = this.children;
        children.forEach(function (item) {
          if (item instanceof Xom || item instanceof Component$1 && item.shadowRoot instanceof Xom) {
            item.__layoutNone();
          }
        });
      } // 本身block布局时计算好所有子元素的基本位置

    }, {
      key: "__layoutBlock",
      value: function __layoutBlock(data, isVirtual) {
        var flowChildren = this.flowChildren,
            currentStyle = this.currentStyle,
            computedStyle = this.computedStyle,
            lineGroups = this.lineGroups;
        lineGroups.splice(0);
        var textAlign = computedStyle[TEXT_ALIGN$3];

        var _this$__preLayout = this.__preLayout(data),
            fixedWidth = _this$__preLayout.fixedWidth,
            fixedHeight = _this$__preLayout.fixedHeight,
            x = _this$__preLayout.x,
            y = _this$__preLayout.y,
            w = _this$__preLayout.w,
            h = _this$__preLayout.h;

        if (fixedWidth && isVirtual) {
          this.__width = w;

          this.__ioSize(w, this.height);

          return;
        } // 因精度问题，统计宽度均从0开始累加每行，最后取最大值，仅在abs布局时isVirtual生效


        var maxW = 0;
        var cw = 0; // 递归布局，将inline的节点组成lineGroup一行，同时记录上一个block，进行垂直方向的margin合并

        var lineGroup = new LineGroup(x, y); // 连续block（flex）的上下margin合并值记录，合并时从列表中取

        var mergeMarginBottomList = [],
            mergeMarginTopList = [];
        var length = flowChildren.length;
        flowChildren.forEach(function (item, i) {
          var isXom = item instanceof Xom || item instanceof Component$1 && item.shadowRoot instanceof Xom;
          var isInline = isXom && item.currentStyle[DISPLAY$3] === 'inline'; // 每次循环开始前，这次不是block的话，看之前遗留的，可能是以空block结束，需要特殊处理，单独一个空block也包含

          if (!isXom || isInline) {
            if (mergeMarginBottomList.length && mergeMarginTopList.length) {
              var diff = util.getMergeMarginTB(mergeMarginTopList, mergeMarginBottomList);

              if (diff) {
                y += diff;
              }
            }

            mergeMarginTopList = [];
            mergeMarginBottomList = [];
          }

          if (isXom) {
            // inline和block（flex等同）不同对待
            if (isInline) {
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
              var isNone = item.currentStyle[DISPLAY$3] === 'none'; // 自身无内容

              var isEmptyBlock;

              if (!isNone && item.flowChildren && item.flowChildren.length === 0) {
                var _item$computedStyle = item.computedStyle,
                    marginTop = _item$computedStyle[MARGIN_TOP$2],
                    marginBottom = _item$computedStyle[MARGIN_BOTTOM$3],
                    paddingTop = _item$computedStyle[PADDING_TOP$2],
                    paddingBottom = _item$computedStyle[PADDING_BOTTOM$2],
                    height = _item$computedStyle[HEIGHT$4],
                    borderTopWidth = _item$computedStyle[BORDER_TOP_WIDTH$2],
                    borderBottomWidth = _item$computedStyle[BORDER_BOTTOM_WIDTH$2]; // 无内容高度为0的空block特殊情况，记录2个margin下来等后续循环判断处理

                if (paddingTop <= 0 && paddingBottom <= 0 && height <= 0 && borderTopWidth <= 0 && borderBottomWidth <= 0) {
                  mergeMarginBottomList.push(marginBottom);
                  mergeMarginTopList.push(marginTop);
                  isEmptyBlock = true;
                }
              }

              y += item.outerHeight; // absolute/flex前置虚拟计算

              if (isVirtual) {
                maxW = Math.max(maxW, item.outerWidth);
                cw = 0;
              } // 空block要留下轮循环看，除非是最后一个，非空本轮处理掉看是否要合并


              if (!isNone && !isEmptyBlock) {
                var _item$computedStyle2 = item.computedStyle,
                    _marginTop = _item$computedStyle2[MARGIN_TOP$2],
                    _marginBottom = _item$computedStyle2[MARGIN_BOTTOM$3]; // 有bottom值说明之前有紧邻的block，任意个甚至空block，自己有个top所以无需判断top
                // 如果是只有紧邻的2个非空block，也被包含在情况内，取上下各1合并

                if (mergeMarginBottomList.length) {
                  mergeMarginTopList.push(_marginTop);

                  var _diff = util.getMergeMarginTB(mergeMarginTopList, mergeMarginBottomList);

                  if (_diff) {
                    item.__offsetY(_diff, true);

                    y += _diff;
                  }
                } // 同时自己保存bottom，为后续block准备


                mergeMarginTopList = [];
                mergeMarginBottomList = [_marginBottom];
              } // 最后一个空block当是正正和负负时要处理，正负在outHeight处理了结果是0
              else if (i === length - 1) {
                  var _diff2 = util.getMergeMarginTB(mergeMarginTopList, mergeMarginBottomList);

                  if (_diff2) {
                    y += _diff2;
                  }
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

        var tw = this.__width = fixedWidth || !isVirtual ? w : maxW;
        var th = this.__height = fixedHeight ? h : y - data.y;

        this.__ioSize(tw, th); // text-align


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
        var _this2 = this;

        var flowChildren = this.flowChildren,
            currentStyle = this.currentStyle;
        var flexDirection = currentStyle[FLEX_DIRECTION$2],
            justifyContent = currentStyle[JUSTIFY_CONTENT$1],
            alignItems = currentStyle[ALIGN_ITEMS$1];

        var _this$__preLayout2 = this.__preLayout(data),
            fixedWidth = _this$__preLayout2.fixedWidth,
            fixedHeight = _this$__preLayout2.fixedHeight,
            x = _this$__preLayout2.x,
            y = _this$__preLayout2.y,
            w = _this$__preLayout2.w,
            h = _this$__preLayout2.h;

        if (fixedWidth && isVirtual) {
          this.__width = w;

          this.__ioSize(w, this.height);

          return;
        }

        var maxX = 0;
        var isDirectionRow = flexDirection === 'row'; // 计算伸缩基数

        var growList = [];
        var shrinkList = [];
        var basisList = [];
        var maxList = [];
        var minList = [];
        var growSum = 0;
        var shrinkSum = 0;
        var basisSum = 0;
        var maxSum = 0;
        flowChildren.forEach(function (item) {
          if (item instanceof Xom || item instanceof Component$1 && item.shadowRoot instanceof Xom) {
            // abs虚拟布局计算时纵向也是看横向宽度
            var _item$__calAutoBasis3 = item.__calAutoBasis(isVirtual ? true : isDirectionRow, x, y, w, h, isVirtual),
                _item$__calAutoBasis4 = _slicedToArray(_item$__calAutoBasis3, 3),
                b = _item$__calAutoBasis4[0],
                min = _item$__calAutoBasis4[1],
                max = _item$__calAutoBasis4[2];

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
            var flexGrow = _currentStyle[FLEX_GROW$1],
                flexShrink = _currentStyle[FLEX_SHRINK$1],
                flexBasis = _currentStyle[FLEX_BASIS$2];
            growList.push(flexGrow);
            shrinkList.push(flexShrink);
            growSum += flexGrow;
            shrinkSum += flexShrink; // 根据basis不同，计算方式不同，上面每个元素计算的是min以及主轴尺寸，下面要按basis规范来覆盖

            if (flexBasis[1] === AUTO$3) {
              basisList.push(b);
              basisSum += b;
            } else if (flexBasis[1] === PX$5) {
              var _b = computedStyle[FLEX_BASIS$2] = flexBasis[0];

              basisList.push(_b);
              basisSum += _b;
            } else if (flexBasis[1] === PERCENT$6) {
              var _b2 = computedStyle[FLEX_BASIS$2] = (isDirectionRow ? w : h) * flexBasis[0] * 0.01;

              basisList.push(_b2);
              basisSum += _b2;
            }

            maxList.push(max);
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
                var c = item.charWidth;
                basisList.push(c);
                basisSum += c;
                maxList.push(item.textWidth);
                maxSum += item.textWidth;
                minList.push(c);
              } else {
                item.__layout({
                  x: x,
                  y: y,
                  w: w,
                  h: _h
                }, true);

                var _h = item.height;
                basisList.push(_h);
                basisSum += _h;
                maxSum += _h;
                minList.push(_h);
              }
            }
        }); // abs时，只需关注宽度即可，无需真正布局

        if (isVirtual) {
          var _tw = this.__width = Math.min(maxX, w);

          this.__ioSize(_tw, this.height);

          return;
        }
        /**
         * 计算获取子元素的b/min/max完毕后，尝试进行flex布局
         * 这里比较麻烦，因为text的长度是可变化的，会因为伸缩而不确定性换行，这样导致basis在auto时不确定性
         * basis在没有明确指定时等同于min值，即text中最大字符宽度，先考虑row的情况
         * 在maxSum<=w时特殊处理，text可按照不换行最大长度计算
         * 其它情况按正常伸缩计算，即以basis为基准
         * 这样，如果text全部算起来都不到总尺寸，则以max为基准算basis，防止以basis算显示错误
         * 而如果超过总尺寸，以basis算看是伸还是缩也符合
         */


        var maxCross = 0; // 判断是否超出，决定使用grow还是shrink

        var isMoreThanMax = maxSum <= (isDirectionRow ? w : h);
        var isOverflow = !isMoreThanMax && basisSum > (isDirectionRow ? w : h);
        var overflow, free; // 计算主轴长度，以basis为基准判断伸缩选择，收缩比较简单，计算后再判断不能小于min即可

        if (isMoreThanMax) {
          free = (isDirectionRow ? w : h) - maxSum;
        } else if (isOverflow) {
          overflow = basisSum - (isDirectionRow ? w : h);
        } else {
          free = (isDirectionRow ? w : h) - basisSum;
        }

        flowChildren.forEach(function (item, i) {
          var main;
          var shrink = shrinkList[i];
          var grow = growList[i]; // 计算主轴长度，以basis为基准判断伸缩选择，收缩比较简单，计算后再判断不能小于min即可

          if (isMoreThanMax) {
            main = grow ? maxList[i] + free * grow / growSum : maxList[i];
          } else if (isOverflow) {
            main = shrink ? basisList[i] - overflow * shrink / shrinkSum : basisList[i];
          } else {
            main = grow ? basisList[i] + free * grow / growSum : basisList[i];
          } // 主轴长度的最小值不能小于元素的最小长度，即横向时的字符宽度


          main = Math.max(main, minList[i]);

          if (item instanceof Xom || item instanceof Component$1 && item.shadowRoot instanceof Xom) {
            var _currentStyle2 = item.currentStyle,
                computedStyle = item.computedStyle;
            var display = _currentStyle2[DISPLAY$3],
                _flexDirection = _currentStyle2[FLEX_DIRECTION$2],
                width = _currentStyle2[WIDTH$4],
                height = _currentStyle2[HEIGHT$4]; // flex的child如果是inline，变为block

            if (display === 'inline') {
              _currentStyle2[DISPLAY$3] = computedStyle[DISPLAY$3] = 'block';
            }

            if (isDirectionRow) {
              // 横向flex的child如果是竖向flex，高度自动的话要等同于父flex的高度
              if (display === 'flex' && _flexDirection === 'column' && fixedHeight && height[1] === AUTO$3) {
                height[0] = h;
                height[1] = PX$5;
              }

              item.__layout({
                x: x,
                y: y,
                w: main,
                h: h
              });
            } else {
              // 竖向flex的child如果是横向flex，宽度自动的话要等同于父flex的宽度
              if (display === 'flex' && _flexDirection === 'row' && width[1] === AUTO$3) {
                width[0] = w;
                width[1] = PX$5;
              }

              item.__layout({
                x: x,
                y: y,
                w: w,
                h: main
              });
            } // 重设因伸缩而导致的主轴长度


            if (isOverflow && shrink || !isOverflow && grow) {
              var borderTopWidth = computedStyle[BORDER_TOP_WIDTH$2],
                  borderBottomWidth = computedStyle[BORDER_BOTTOM_WIDTH$2],
                  marginTop = computedStyle[MARGIN_TOP$2],
                  marginBottom = computedStyle[MARGIN_BOTTOM$3],
                  paddingTop = computedStyle[PADDING_TOP$2],
                  paddingBottom = computedStyle[PADDING_BOTTOM$2],
                  borderRightWidth = computedStyle[BORDER_RIGHT_WIDTH$2],
                  borderLeftWidth = computedStyle[BORDER_LEFT_WIDTH$2],
                  marginRight = computedStyle[MARGIN_RIGHT$2],
                  marginLeft = computedStyle[MARGIN_LEFT$2],
                  paddingRight = computedStyle[PADDING_RIGHT$2],
                  paddingLeft = computedStyle[PADDING_LEFT$2];

              if (isDirectionRow) {
                item.__width = main - marginLeft - marginRight - paddingLeft - paddingRight - borderLeftWidth - borderRightWidth;
                item.__clientWidth = main - marginLeft - marginRight - borderLeftWidth - borderRightWidth;
                _this2.__offsetWidth = main - marginLeft - marginRight;
                item.__outerWidth = main;
              } else {
                item.__height = main - marginTop - marginBottom - paddingTop - paddingBottom - borderTopWidth - borderBottomWidth;
                item.__clientHeight = main - marginTop - marginBottom - borderTopWidth - borderBottomWidth;
                _this2.__offsetHeight = main - marginTop - marginRight;
                item.__outerHeight = main;
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

            for (var _i2 = 0; _i2 < len; _i2++) {
              var _child = flowChildren[_i2];
              isDirectionRow ? _child.__offsetX(center, true) : _child.__offsetY(center, true);
            }
          } else if (justifyContent === 'space-between') {
            var between = diff / (len - 1);

            for (var _i3 = 1; _i3 < len; _i3++) {
              var _child2 = flowChildren[_i3];
              isDirectionRow ? _child2.__offsetX(between * _i3, true) : _child2.__offsetY(between * _i3, true);
            }
          } else if (justifyContent === 'space-around') {
            var around = diff / (len + 1);

            for (var _i4 = 0; _i4 < len; _i4++) {
              var _child3 = flowChildren[_i4];
              isDirectionRow ? _child3.__offsetX(around * (_i4 + 1), true) : _child3.__offsetY(around * (_i4 + 1), true);
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
                  alignSelf = _item$currentStyle[ALIGN_SELF$1],
                  width = _item$currentStyle[WIDTH$4],
                  height = _item$currentStyle[HEIGHT$4];
              var borderTopWidth = computedStyle[BORDER_TOP_WIDTH$2],
                  borderBottomWidth = computedStyle[BORDER_BOTTOM_WIDTH$2],
                  marginTop = computedStyle[MARGIN_TOP$2],
                  marginBottom = computedStyle[MARGIN_BOTTOM$3],
                  paddingTop = computedStyle[PADDING_TOP$2],
                  paddingBottom = computedStyle[PADDING_BOTTOM$2],
                  borderRightWidth = computedStyle[BORDER_RIGHT_WIDTH$2],
                  borderLeftWidth = computedStyle[BORDER_LEFT_WIDTH$2],
                  marginRight = computedStyle[MARGIN_RIGHT$2],
                  marginLeft = computedStyle[MARGIN_LEFT$2],
                  paddingRight = computedStyle[PADDING_RIGHT$2],
                  paddingLeft = computedStyle[PADDING_LEFT$2];

              if (isDirectionRow) {
                if (alignSelf === 'flex-start') ; else if (alignSelf === 'center') {
                  var _diff3 = maxCross - item.outerHeight;

                  if (_diff3 !== 0) {
                    item.__offsetY(_diff3 * 0.5, true);
                  }
                } else if (alignSelf === 'flex-end') {
                  var _diff4 = maxCross - item.outerHeight;

                  if (_diff4 !== 0) {
                    item.__offsetY(_diff4, true);
                  }
                } else if (height[1] === AUTO$3) {
                  var old = item.height;
                  var v = item.__height = computedStyle[HEIGHT$4] = maxCross - marginTop - marginBottom - paddingTop - paddingBottom - borderTopWidth - borderBottomWidth;
                  var d = v - old;
                  item.__clientHeight += d;
                  item.__outerHeight += d;
                }
              } else {
                if (alignSelf === 'flex-start') ; else if (alignSelf === 'center') {
                  var _diff5 = maxCross - item.outerWidth;

                  if (_diff5 !== 0) {
                    item.__offsetX(_diff5 * 0.5, true);
                  }
                } else if (alignSelf === 'flex-end') {
                  var _diff6 = maxCross - item.outerWidth;

                  if (_diff6 !== 0) {
                    item.__offsetX(_diff6, true);
                  }
                } else if (width[1] === AUTO$3) {
                  var _old = item.width;

                  var _v = item.__width = computedStyle[WIDTH$4] = maxCross - marginLeft - marginRight - paddingLeft - paddingRight - borderRightWidth - borderLeftWidth;

                  var _d = _v - _old;

                  item.__clientWidth += _d;
                  _this2.__offsetWidth += _d;
                  item.__outerWidth += _d;
                }
              }
            });
          } else if (alignItems === 'center') {
            flowChildren.forEach(function (item) {
              var alignSelf = item.currentStyle[ALIGN_SELF$1];

              if (isDirectionRow) {
                if (alignSelf === 'flex-start') ; else if (alignSelf === 'flex-end') {
                  var _diff7 = maxCross - item.outerHeight;

                  if (_diff7 !== 0) {
                    item.__offsetY(_diff7, true);
                  }
                } else if (alignSelf === 'stretch') {
                  var computedStyle = item.computedStyle,
                      height = item.currentStyle[HEIGHT$4];
                  var borderTopWidth = computedStyle[BORDER_TOP_WIDTH$2],
                      borderBottomWidth = computedStyle[BORDER_BOTTOM_WIDTH$2],
                      marginTop = computedStyle[MARGIN_TOP$2],
                      marginBottom = computedStyle[MARGIN_BOTTOM$3],
                      paddingTop = computedStyle[PADDING_TOP$2],
                      paddingBottom = computedStyle[PADDING_BOTTOM$2];

                  if (height[1] === AUTO$3) {
                    var old = item.height;
                    var v = item.__height = computedStyle[HEIGHT$4] = maxCross - marginTop - marginBottom - paddingTop - paddingBottom - borderTopWidth - borderBottomWidth;
                    var d = v - old;
                    item.__clientHeight += d;
                    item.__outerHeight += d;
                  }
                } else {
                  var _diff8 = maxCross - item.outerHeight;

                  if (_diff8 !== 0) {
                    item.__offsetY(_diff8 * 0.5, true);
                  }
                }
              } else {
                if (alignSelf === 'flex-start') ; else if (alignSelf === 'flex-end') {
                  var _diff9 = maxCross - item.outerWidth;

                  if (_diff9 !== 0) {
                    item.__offsetX(_diff9, true);
                  }
                } else if (alignSelf === 'stretch') {
                  var _computedStyle = item.computedStyle,
                      width = item.currentStyle[WIDTH$4];
                  var borderRightWidth = _computedStyle[BORDER_RIGHT_WIDTH$2],
                      borderLeftWidth = _computedStyle[BORDER_LEFT_WIDTH$2],
                      marginRight = _computedStyle[MARGIN_RIGHT$2],
                      marginLeft = _computedStyle[MARGIN_LEFT$2],
                      paddingRight = _computedStyle[PADDING_RIGHT$2],
                      paddingLeft = _computedStyle[PADDING_LEFT$2];

                  if (width[1] === AUTO$3) {
                    var _old2 = item.width;

                    var _v2 = item.__width = _computedStyle[WIDTH$4] = maxCross - marginLeft - marginRight - paddingLeft - paddingRight - borderRightWidth - borderLeftWidth;

                    var _d2 = _v2 - _old2;

                    item.__clientWidth += _d2;
                    _this2.__offsetWidth += _d2;
                    item.__outerWidth += _d2;
                  }
                } else {
                  var _diff10 = maxCross - item.outerWidth;

                  if (_diff10 !== 0) {
                    item.__offsetX(_diff10 * 0.5, true);
                  }
                }
              }
            });
          } else if (alignItems === 'flex-end') {
            flowChildren.forEach(function (item) {
              var alignSelf = item.currentStyle[ALIGN_SELF$1];

              if (isDirectionRow) {
                if (alignSelf === 'flex-start') ; else if (alignSelf === 'center') {
                  var _diff11 = maxCross - item.outerHeight;

                  if (_diff11 !== 0) {
                    item.__offsetY(_diff11 * 0.5, true);
                  }
                } else if (alignSelf === 'stretch') {
                  var computedStyle = item.computedStyle,
                      height = item.currentStyle[HEIGHT$4];
                  var borderTopWidth = computedStyle[BORDER_TOP_WIDTH$2],
                      borderBottomWidth = computedStyle[BORDER_BOTTOM_WIDTH$2],
                      marginTop = computedStyle[MARGIN_TOP$2],
                      marginBottom = computedStyle[MARGIN_BOTTOM$3],
                      paddingTop = computedStyle[PADDING_TOP$2],
                      paddingBottom = computedStyle[PADDING_BOTTOM$2];

                  if (height[1] === AUTO$3) {
                    var old = item.height;
                    var v = item.__height = computedStyle[HEIGHT$4] = maxCross - marginTop - marginBottom - paddingTop - paddingBottom - borderTopWidth - borderBottomWidth;
                    var d = v - old;
                    item.__clientHeight += d;
                    item.__outerHeight += d;
                  }
                } else {
                  var _diff12 = maxCross - item.outerHeight;

                  if (_diff12 !== 0) {
                    item.__offsetY(_diff12, true);
                  }
                }
              } else {
                if (alignSelf === 'flex-start') ; else if (alignSelf === 'center') {
                  var _diff13 = maxCross - item.outerWidth;

                  if (_diff13 !== 0) {
                    item.__offsetX(_diff13 * 0.5, true);
                  }
                } else if (alignSelf === 'stretch') {
                  var _computedStyle2 = item.computedStyle,
                      width = item.currentStyle[WIDTH$4];
                  var borderRightWidth = _computedStyle2[BORDER_RIGHT_WIDTH$2],
                      borderLeftWidth = _computedStyle2[BORDER_LEFT_WIDTH$2],
                      marginRight = _computedStyle2[MARGIN_RIGHT$2],
                      marginLeft = _computedStyle2[MARGIN_LEFT$2],
                      paddingRight = _computedStyle2[PADDING_RIGHT$2],
                      paddingLeft = _computedStyle2[PADDING_LEFT$2];

                  if (width[1] === AUTO$3) {
                    var _old3 = item.width;

                    var _v3 = item.__width = _computedStyle2[WIDTH$4] = maxCross - marginLeft - marginRight - paddingLeft - paddingRight - borderRightWidth - borderLeftWidth;

                    var _d3 = _v3 - _old3;

                    item.__clientWidth += _d3;
                    _this2.__offsetWidth += _d3;
                    item.__outerWidth += _d3;
                  }
                } else {
                  var _diff14 = maxCross - item.outerHeight;

                  if (_diff14 !== 0) {
                    item.__offsetY(_diff14, true);
                  }
                }
              }
            });
          } else {
            flowChildren.forEach(function (item) {
              var alignSelf = item.currentStyle[ALIGN_SELF$1];

              if (isDirectionRow) {
                if (alignSelf === 'flex-start') ; else if (alignSelf === 'center') {
                  var _diff15 = maxCross - item.outerHeight;

                  if (_diff15 !== 0) {
                    item.__offsetY(_diff15 * 0.5, true);
                  }
                } else if (alignSelf === 'flex-end') {
                  var _diff16 = maxCross - item.outerHeight;

                  if (_diff16 !== 0) {
                    item.__offsetY(_diff16, true);
                  }
                } else if (alignSelf === 'stretch') {
                  var computedStyle = item.computedStyle,
                      height = item.currentStyle[HEIGHT$4];
                  var borderTopWidth = computedStyle[BORDER_TOP_WIDTH$2],
                      borderBottomWidth = computedStyle[BORDER_BOTTOM_WIDTH$2],
                      marginTop = computedStyle[MARGIN_TOP$2],
                      marginBottom = computedStyle[MARGIN_BOTTOM$3],
                      paddingTop = computedStyle[PADDING_TOP$2],
                      paddingBottom = computedStyle[PADDING_BOTTOM$2];

                  if (height[1] === AUTO$3) {
                    var old = item.height;
                    var v = item.__height = item.__height = computedStyle[HEIGHT$4] = maxCross - marginTop - marginBottom - paddingTop - paddingBottom - borderTopWidth - borderBottomWidth;
                    var d = v - old;
                    item.__clientHeight += d;
                    item.__outerHeight += d;
                  }
                }
              } else {
                if (alignSelf === 'flex-start') ; else if (alignSelf === 'center') {
                  var _diff17 = maxCross - item.outerWidth;

                  if (_diff17 !== 0) {
                    item.__offsetX(_diff17 * 0.5, true);
                  }
                } else if (alignSelf === 'flex-end') {
                  var _diff18 = maxCross - item.outerWidth;

                  if (_diff18 !== 0) {
                    item.__offsetX(_diff18, true);
                  }
                } else if (alignSelf === 'stretch') {
                  var _computedStyle3 = item.computedStyle,
                      width = item.currentStyle[WIDTH$4];
                  var borderRightWidth = _computedStyle3[BORDER_RIGHT_WIDTH$2],
                      borderLeftWidth = _computedStyle3[BORDER_LEFT_WIDTH$2],
                      marginRight = _computedStyle3[MARGIN_RIGHT$2],
                      marginLeft = _computedStyle3[MARGIN_LEFT$2],
                      paddingRight = _computedStyle3[PADDING_RIGHT$2],
                      paddingLeft = _computedStyle3[PADDING_LEFT$2];

                  if (width[1] === AUTO$3) {
                    var _old4 = item.width;

                    var _v4 = item.__width = _computedStyle3[WIDTH$4] = maxCross - marginLeft - marginRight - paddingLeft - paddingRight - borderRightWidth - borderLeftWidth;

                    var _d4 = _v4 - _old4;

                    item.__clientWidth += _d4;
                    _this2.__offsetWidth += _d4;
                    item.__outerWidth += _d4;
                  }
                }
              }
            });
          }
        }

        var tw = this.__width = w;
        var th = this.__height = fixedHeight ? h : y - data.y;

        this.__ioSize(tw, th);

        this.__marginAuto(currentStyle, data);
      } // inline比较特殊，先简单顶部对其，后续还需根据vertical和lineHeight计算y偏移

    }, {
      key: "__layoutInline",
      value: function __layoutInline(data, isVirtual) {
        var _this3 = this;

        var flowChildren = this.flowChildren,
            computedStyle = this.computedStyle,
            lineGroups = this.lineGroups;
        lineGroups.splice(0);
        var textAlign = computedStyle[TEXT_ALIGN$3];

        var _this$__preLayout3 = this.__preLayout(data),
            fixedWidth = _this$__preLayout3.fixedWidth,
            fixedHeight = _this$__preLayout3.fixedHeight,
            x = _this$__preLayout3.x,
            y = _this$__preLayout3.y,
            w = _this$__preLayout3.w,
            h = _this$__preLayout3.h;

        if (fixedWidth && isVirtual) {
          this.__width = w;

          this.__ioSize(w, this.height);

          return;
        } // 因精度问题，统计宽度均从0开始累加每行，最后取最大值，仅在abs布局时isVirtual生效


        var maxW = 0;
        var cw = 0; // 递归布局，将inline的节点组成lineGroup一行

        var lineGroup = new LineGroup(x, y);
        flowChildren.forEach(function (item) {
          if (item instanceof Xom || item instanceof Component$1 && item.shadowRoot instanceof Xom) {
            if (item.currentStyle[DISPLAY$3] !== 'inline') {
              item.currentStyle[DISPLAY$3] = item.computedStyle[DISPLAY$3] = 'inline';
              inject.error('Inline can not contain block/flex');
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


        var tw = this.__width = fixedWidth ? w : maxW;
        var th = this.__height = fixedHeight ? h : y - data.y;

        this.__ioSize(tw, th); // text-align


        if (!isVirtual && ['center', 'right'].indexOf(textAlign) > -1) {
          lineGroups.forEach(function (lineGroup) {
            var diff = _this3.__width - lineGroup.width;

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
            clientWidth = container.clientWidth,
            clientHeight = container.clientHeight,
            computedStyle = container.computedStyle;
        var isDestroyed = this.isDestroyed,
            children = this.children,
            absChildren = this.absChildren;
        var display = computedStyle[DISPLAY$3],
            borderTopWidth = computedStyle[BORDER_TOP_WIDTH$2],
            borderLeftWidth = computedStyle[BORDER_LEFT_WIDTH$2],
            marginTop = computedStyle[MARGIN_TOP$2],
            marginLeft = computedStyle[MARGIN_LEFT$2],
            paddingLeft = computedStyle[PADDING_LEFT$2];

        if (isDestroyed || display === 'none') {
          this.__layoutNone();

          return;
        }

        x += marginLeft + borderLeftWidth;
        y += marginTop + borderTopWidth; // 对absolute的元素进行相对容器布局

        absChildren.forEach(function (item) {
          if (target) {
            // 传入target局部布局更新，这时候如果是Component引发的，当setState时是Cp自身，当layout时是sr
            var node = item;

            if (node instanceof Component$1) {
              node = item.shadowRoot;
            } // 所以得2个都对比


            if (target !== node && target !== item) {
              return;
            }
          }

          var currentStyle = item.currentStyle,
              computedStyle = item.computedStyle;

          if (currentStyle[DISPLAY$3] === 'none') {
            item.__layoutNone();

            return;
          } // 先根据容器宽度计算margin/padding


          item.__mp(currentStyle, computedStyle, clientWidth);

          if (currentStyle[DISPLAY$3] === 'inline') {
            currentStyle[DISPLAY$3] = computedStyle[DISPLAY$3] = item.style.display = 'block';
          }

          var left = currentStyle[LEFT$2],
              top = currentStyle[TOP$2],
              right = currentStyle[RIGHT$2],
              bottom = currentStyle[BOTTOM$2],
              width = currentStyle[WIDTH$4],
              height = currentStyle[HEIGHT$4],
              display = currentStyle[DISPLAY$3],
              flexDirection = currentStyle[FLEX_DIRECTION$2];
          var x2, y2, w2, h2;
          var onlyRight;
          var onlyBottom;
          var fixedTop;
          var fixedRight;
          var fixedBottom;
          var fixedLeft; // 判断何种方式的定位，比如左+宽度，左+右之类

          if (left[1] !== AUTO$3) {
            fixedLeft = true;
            computedStyle[LEFT$2] = calAbsolute$1(currentStyle, 'left', left, clientWidth);
          } else {
            computedStyle[LEFT$2] = 'auto';
          }

          if (right[1] !== AUTO$3) {
            fixedRight = true;
            computedStyle[RIGHT$2] = calAbsolute$1(currentStyle, 'right', right, clientWidth);
          } else {
            computedStyle[RIGHT$2] = 'auto';
          }

          if (top[1] !== AUTO$3) {
            fixedTop = true;
            computedStyle[TOP$2] = calAbsolute$1(currentStyle, 'top', top, clientHeight);
          } else {
            computedStyle[TOP$2] = 'auto';
          }

          if (bottom[1] !== AUTO$3) {
            fixedBottom = true;
            computedStyle[BOTTOM$2] = calAbsolute$1(currentStyle, 'bottom', bottom, clientHeight);
          } else {
            computedStyle[BOTTOM$2] = 'auto';
          } // 优先级最高left+right，其次left+width，再次right+width，再次仅申明单个，最次全部auto


          if (fixedLeft && fixedRight) {
            x2 = x + computedStyle[LEFT$2];
            w2 = x + clientWidth - computedStyle[RIGHT$2] - x2;
          } else if (fixedLeft && width[1] !== AUTO$3) {
            x2 = x + computedStyle[LEFT$2];
            w2 = width[1] === PX$5 ? width[0] : clientWidth * width[0] * 0.01;
          } else if (fixedRight && width[1] !== AUTO$3) {
            w2 = width[1] === PX$5 ? width[0] : clientWidth * width[0] * 0.01;
            x2 = x + clientWidth - computedStyle[RIGHT$2] - w2; // 右对齐有尺寸时y值还需减去margin/border/padding的

            x2 -= computedStyle[MARGIN_LEFT$2];
            x2 -= computedStyle[MARGIN_RIGHT$2];
            x2 -= computedStyle[PADDING_LEFT$2];
            x2 -= computedStyle[PADDING_RIGHT$2];
            x2 -= currentStyle[BORDER_LEFT_WIDTH$2][0];
            x2 -= currentStyle[BORDER_RIGHT_WIDTH$2][0];
          } else if (fixedLeft) {
            x2 = x + computedStyle[LEFT$2];
          } else if (fixedRight) {
            x2 = x + clientWidth - computedStyle[RIGHT$2];
            onlyRight = true;
          } else {
            x2 = x + paddingLeft;

            if (width[1] !== AUTO$3) {
              w2 = width[1] === PX$5 ? width[0] : clientWidth * width[0] * 0.01;
            }
          } // top/bottom/height优先级同上


          if (fixedTop && fixedBottom) {
            y2 = y + computedStyle[TOP$2];
            h2 = y + clientHeight - computedStyle[BOTTOM$2] - y2;
          } else if (fixedTop && height[1] !== AUTO$3) {
            y2 = y + computedStyle[TOP$2];
            h2 = height[1] === PX$5 ? height[0] : clientHeight * height[0] * 0.01;
          } else if (fixedBottom && height[1] !== AUTO$3) {
            h2 = height[1] === PX$5 ? height[0] : clientHeight * height[0] * 0.01;
            y2 = y + clientHeight - computedStyle[BOTTOM$2] - h2; // 底对齐有尺寸时y值还需减去margin/border/padding的

            y2 -= computedStyle[MARGIN_TOP$2];
            y2 -= computedStyle[MARGIN_BOTTOM$3];
            y2 -= computedStyle[PADDING_TOP$2];
            y2 -= computedStyle[PADDING_BOTTOM$2];
            y2 -= currentStyle[BORDER_TOP_WIDTH$2][0];
            y2 -= currentStyle[BORDER_BOTTOM_WIDTH$2][0];
          } else if (fixedTop) {
            y2 = y + computedStyle[TOP$2];
          } else if (fixedBottom) {
            y2 = y + clientHeight - computedStyle[BOTTOM$2];
            onlyBottom = true;
          } // 未声明y的找到之前的流布局child，紧随其下
          else {
              y2 = y;
              var prev = item.prev;

              while (prev) {
                // 目前不考虑margin合并，直接以前面的flow的最近的prev末尾为准
                if (prev instanceof Text || prev.computedStyle[POSITION$2] !== 'absolute') {
                  y2 = prev.y + prev.outerHeight;
                  break;
                }

                prev = prev.prev;
              }

              if (height[1] !== AUTO$3) {
                h2 = height[1] === PX$5 ? height[0] : clientHeight * height[0] * 0.01;
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


          var wl = onlyRight ? x2 - x : clientWidth + x - x2; // onlyBottom相同，正常情况是左上到右下的尺寸限制

          var hl = onlyBottom ? y2 - y : clientHeight + y - y2; // 未直接或间接定义尺寸，取孩子宽度最大值

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
          if (target) {
            // 传入target局部布局更新，这时候如果是Component引发的，当setState时是Cp自身，当layout时是sr
            var node = item;

            if (node instanceof Component$1) {
              node = item.shadowRoot;
            } // 所以得2个都对比


            if (target !== node && target !== item) {
              return;
            }
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
      key: "render",
      value: function render(renderMode, lv, ctx, defs, cache) {
        var res = _get(_getPrototypeOf(Dom.prototype), "render", this).call(this, renderMode, lv, ctx, defs, cache);

        if (renderMode === mode.SVG) {
          this.virtualDom.type = 'dom';
        }

        return res;
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
      }
    }, {
      key: "__emitEvent",
      value: function __emitEvent(e, force) {
        if (force) {
          return _get(_getPrototypeOf(Dom.prototype), "__emitEvent", this).call(this, e, force);
        }

        var isDestroyed = this.isDestroyed,
            computedStyle = this.computedStyle;

        if (isDestroyed || computedStyle[DISPLAY$3] === 'none' || e.__stopPropagation) {
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
      } // 深度遍历执行所有子节点，包含自己，如果cb返回true，提前跳出不继续深度遍历

    }, {
      key: "__deepScan",
      value: function __deepScan(cb, options) {
        if (_get(_getPrototypeOf(Dom.prototype), "__deepScan", this).call(this, cb, options)) {
          return;
        }

        this.children.forEach(function (node) {
          node.__deepScan(cb, options);
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

          return item instanceof Text || item.currentStyle[POSITION$2] !== 'absolute';
        });
      }
    }, {
      key: "absChildren",
      get: function get() {
        return this.children.filter(function (item) {
          if (item instanceof Component$1) {
            item = item.shadowRoot;
          }

          return item instanceof Xom && item.currentStyle[POSITION$2] === 'absolute';
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

        return this.height;
      }
    }]);

    return Dom;
  }(Xom);

  var _enums$STYLE_KEY$c = enums.STYLE_KEY,
      WIDTH$5 = _enums$STYLE_KEY$c.WIDTH,
      HEIGHT$5 = _enums$STYLE_KEY$c.HEIGHT,
      DISPLAY$4 = _enums$STYLE_KEY$c.DISPLAY,
      BORDER_TOP_WIDTH$3 = _enums$STYLE_KEY$c.BORDER_TOP_WIDTH,
      BORDER_RIGHT_WIDTH$3 = _enums$STYLE_KEY$c.BORDER_RIGHT_WIDTH,
      BORDER_LEFT_WIDTH$3 = _enums$STYLE_KEY$c.BORDER_LEFT_WIDTH,
      BORDER_BOTTOM_WIDTH$3 = _enums$STYLE_KEY$c.BORDER_BOTTOM_WIDTH,
      PADDING_TOP$3 = _enums$STYLE_KEY$c.PADDING_TOP,
      PADDING_LEFT$3 = _enums$STYLE_KEY$c.PADDING_LEFT,
      BORDER_TOP_LEFT_RADIUS$1 = _enums$STYLE_KEY$c.BORDER_TOP_LEFT_RADIUS,
      BORDER_TOP_RIGHT_RADIUS$1 = _enums$STYLE_KEY$c.BORDER_TOP_RIGHT_RADIUS,
      BORDER_BOTTOM_RIGHT_RADIUS$1 = _enums$STYLE_KEY$c.BORDER_BOTTOM_RIGHT_RADIUS,
      BORDER_BOTTOM_LEFT_RADIUS$1 = _enums$STYLE_KEY$c.BORDER_BOTTOM_LEFT_RADIUS,
      VISIBILITY$3 = _enums$STYLE_KEY$c.VISIBILITY,
      BACKGROUND_IMAGE$2 = _enums$STYLE_KEY$c.BACKGROUND_IMAGE,
      BACKGROUND_COLOR$2 = _enums$STYLE_KEY$c.BACKGROUND_COLOR,
      BOX_SHADOW$3 = _enums$STYLE_KEY$c.BOX_SHADOW,
      MIX_BLEND_MODE$1 = _enums$STYLE_KEY$c.MIX_BLEND_MODE,
      _enums$UPDATE_KEY$2 = enums.UPDATE_KEY,
      UPDATE_NODE$2 = _enums$UPDATE_KEY$2.UPDATE_NODE,
      UPDATE_FOCUS$1 = _enums$UPDATE_KEY$2.UPDATE_FOCUS,
      UPDATE_IMG = _enums$UPDATE_KEY$2.UPDATE_IMG,
      UPDATE_CONFIG$2 = _enums$UPDATE_KEY$2.UPDATE_CONFIG,
      _enums$NODE_KEY$4 = enums.NODE_KEY,
      NODE_CACHE$2 = _enums$NODE_KEY$4.NODE_CACHE,
      NODE_CACHE_TOTAL$1 = _enums$NODE_KEY$4.NODE_CACHE_TOTAL,
      NODE_DEFS_CACHE$1 = _enums$NODE_KEY$4.NODE_DEFS_CACHE,
      NODE_IS_MASK = _enums$NODE_KEY$4.NODE_IS_MASK;
  var AUTO$4 = unit.AUTO,
      PX$6 = unit.PX,
      RGBA$2 = unit.RGBA;
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

      var isClip = _this.__isClip = !!_this.props.clip;
      var isMask = _this.__isMask = isClip || !!_this.props.mask;

      if (isMask) {
        var _assertThisInitialize = _assertThisInitialized(_this),
            style = _assertThisInitialize.style,
            currentStyle = _assertThisInitialize.currentStyle;

        style[BACKGROUND_IMAGE$2] = currentStyle[BACKGROUND_IMAGE$2] = [null];
        style[BACKGROUND_COLOR$2] = currentStyle[BACKGROUND_COLOR$2] = [[0, 0, 0, 0], RGBA$2];
        style[BORDER_TOP_WIDTH$3] = currentStyle[BORDER_TOP_WIDTH$3] = [0, PX$6];
        style[BORDER_RIGHT_WIDTH$3] = currentStyle[BORDER_RIGHT_WIDTH$3] = [0, PX$6];
        style[BORDER_LEFT_WIDTH$3] = currentStyle[BORDER_LEFT_WIDTH$3] = [0, PX$6];
        style[BORDER_BOTTOM_WIDTH$3] = currentStyle[BORDER_BOTTOM_WIDTH$3] = [0, PX$6];
        style[BOX_SHADOW$3] = currentStyle[BOX_SHADOW$3] = null;
        style[MIX_BLEND_MODE$1] = currentStyle[MIX_BLEND_MODE$1] = 'normal';
      }

      var config = _this.__config;
      config[NODE_IS_MASK] = isMask;
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

        if (loadImg.error && !this.props.placeholder) {
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
      } // img根据加载情况更新__hasContent

    }, {
      key: "__calContent",
      value: function __calContent(renderMode, lv, currentStyle, computedStyle) {
        var res = _get(_getPrototypeOf(Img.prototype), "__calContent", this).call(this, renderMode, lv, currentStyle, computedStyle);

        if (!res) {
          var loadImg = this.__loadImg,
              _this$props = this.props,
              src = _this$props.src,
              placeholder = _this$props.placeholder;

          if (computedStyle[VISIBILITY$3] !== 'hidden' && (computedStyle[WIDTH$5] || computedStyle[HEIGHT$5]) && (loadImg.error || (loadImg.url === src || placeholder) && loadImg.source)) {
            res = true;
          }
        }

        return res;
      }
    }, {
      key: "render",
      value: function render(renderMode, lv, ctx, defs, cache) {
        var _this2 = this;

        var res = _get(_getPrototypeOf(Img.prototype), "render", this).call(this, renderMode, lv, ctx, defs, cache);

        var offScreenFilter = res.offScreenFilter,
            offScreenMask = res.offScreenMask,
            offScreenOverflow = res.offScreenOverflow,
            offScreenBlend = res.offScreenBlend;
        var width = this.width,
            height = this.height,
            isDestroyed = this.isDestroyed,
            _this$props2 = this.props,
            src = _this$props2.src,
            placeholder = _this$props2.placeholder,
            computedStyle = this.computedStyle,
            _this$computedStyle = this.computedStyle,
            display = _this$computedStyle[DISPLAY$4],
            borderTopLeftRadius = _this$computedStyle[BORDER_TOP_LEFT_RADIUS$1],
            borderTopRightRadius = _this$computedStyle[BORDER_TOP_RIGHT_RADIUS$1],
            borderBottomRightRadius = _this$computedStyle[BORDER_BOTTOM_RIGHT_RADIUS$1],
            borderBottomLeftRadius = _this$computedStyle[BORDER_BOTTOM_LEFT_RADIUS$1],
            visibility = _this$computedStyle[VISIBILITY$3],
            virtualDom = this.virtualDom,
            __config = this.__config,
            loadImg = this.__loadImg,
            root = this.root;

        if (!cache && (offScreenFilter || offScreenMask || offScreenOverflow || offScreenBlend)) {
          ctx = (offScreenFilter || offScreenMask || offScreenOverflow || offScreenBlend).target.ctx;
        } // img无children所以total就是cache避免多余生成


        if (renderMode === mode.CANVAS && cache) {
          __config[NODE_CACHE_TOTAL$1] = __config[NODE_CACHE$2];
        }

        if (loadImg.url !== src && !loadImg.error) {
          loadImg.url = src;
          loadImg.source = null;
          loadImg.error = null;
          loadImg.cache = false;
          inject.measureImg(src, function (data) {
            var self = _this2; // 还需判断url，防止重复加载时老的替换新的，失败走error绘制

            if (data.url === loadImg.url && !self.isDestroyed) {
              var reload = function reload() {
                var _self$currentStyle = self.currentStyle,
                    width = _self$currentStyle[WIDTH$5],
                    height = _self$currentStyle[HEIGHT$5];
                root.delRefreshTask(self.__task);

                if (width[1] !== AUTO$4 && height[1] !== AUTO$4) {
                  root.addRefreshTask(self.__task = {
                    __before: function __before() {
                      if (self.isDestroyed) {
                        return;
                      } // 刷新前统一赋值，由刷新逻辑计算最终值避免优先级覆盖问题


                      var res = {};
                      res[UPDATE_NODE$2] = self;
                      res[UPDATE_FOCUS$1] = o$1.REPAINT;
                      res[UPDATE_CONFIG$2] = self.__config;

                      root.__addUpdate(self, self.__config, root, root.__config, res);
                    }
                  });
                } else {
                  root.addRefreshTask(self.__task = {
                    __before: function __before() {
                      if (self.isDestroyed) {
                        return;
                      } // 刷新前统一赋值，由刷新逻辑计算最终值避免优先级覆盖问题


                      var res = {};
                      res[UPDATE_NODE$2] = self;
                      res[UPDATE_FOCUS$1] = o$1.REFLOW; // 没有样式变化但内容尺寸发生了变化强制执行

                      res[UPDATE_IMG] = true; // 特殊标识强制布局即便没有style变化

                      res[UPDATE_CONFIG$2] = self.__config;

                      root.__addUpdate(self, self.__config, root, root.__config, res);
                    }
                  });
                }
              };

              if (data.success) {
                loadImg.source = data.source;
                loadImg.width = data.width;
                loadImg.height = data.height;
              } else if (placeholder) {
                inject.measureImg(placeholder, function (data) {
                  if (data.success) {
                    loadImg.error = true;
                    loadImg.source = data.source;
                    loadImg.width = data.width;
                    loadImg.height = data.height;
                    reload();
                  }
                }, {
                  ctx: ctx,
                  root: root,
                  width: width,
                  height: height
                });
                return;
              } else {
                loadImg.error = true;
              } // 可见状态进行刷新操作，visibility某些情况需要刷新，可能宽高未定义要重新布局


              if (computedStyle[DISPLAY$4] !== 'none') {
                reload();
              }
            }
          }, {
            ctx: ctx,
            root: root,
            width: width,
            height: height
          });
        }

        if (isDestroyed || display === 'none' || visibility === 'hidden') {
          return res;
        }

        var __cache = __config[NODE_CACHE$2];

        if (cache && __cache && __cache.enabled) {
          ctx = __cache.ctx;
        }

        var originX, originY;
        originX = res.x3;
        originY = res.y3;

        if (loadImg.error && !placeholder && Img.showError) {
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
        } else if ((loadImg.url === src || placeholder) && loadImg.source) {
          var source = loadImg.source; // 无source不绘制

          if (source) {
            // 圆角需要生成一个mask
            var list = border.calRadius(originX, originY, width, height, borderTopLeftRadius, borderTopRightRadius, borderBottomRightRadius, borderBottomLeftRadius);

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
                  var v = {
                    tagName: 'clipPath',
                    props: [],
                    children: [{
                      type: 'item',
                      tagName: 'path',
                      props: [['d', d], ['fill', '#FFF']]
                    }]
                  };
                  var id = defs.add(v);

                  __config[NODE_DEFS_CACHE$1].push(v);

                  virtualDom.conClip = 'url(#' + id + ')';
                }

                return;
              } // 缩放图片，无需考虑原先矩阵，xom里对父层<g>已经变换过了


              var matrix;

              if (width !== loadImg.width || height !== loadImg.height) {
                matrix = image.matrixResize(loadImg.width, loadImg.height, width, height, originX, originY, width, height);
              }

              var props = [['xlink:href', loadImg.error ? placeholder : src], ['x', originX], ['y', originY], ['width', loadImg.width], ['height', loadImg.height]];

              if (list) {
                var _d = svgPolygon$2(list);

                var _v = {
                  tagName: 'clipPath',
                  props: [],
                  children: [{
                    type: 'item',
                    tagName: 'path',
                    props: [['d', _d], ['fill', '#FFF']]
                  }]
                };

                var _id = defs.add(_v);

                __config[NODE_DEFS_CACHE$1].push(_v);

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
        }

        return res;
      } // img没加载时，清空，这样Xom就认为没内容不生成cache，防止img先绘制cache再绘制主屏，重复

    }, {
      key: "__releaseWhenEmpty",
      value: function __releaseWhenEmpty(__cache) {
        if (!this.__loadImg.error && !this.__loadImg.source && this.__loadImg.url !== this.props.src) {
          return _get(_getPrototypeOf(Img.prototype), "__releaseWhenEmpty", this).call(this, __cache);
        }
      }
    }, {
      key: "baseLine",
      get: function get() {
        return this.height;
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
    }]);

    return Img;
  }(Dom$1);

  _defineProperty(Img$1, "showError", true);

  var Defs = /*#__PURE__*/function () {
    function Defs(uuid) {
      _classCallCheck(this, Defs);

      this.id = uuid;
      this.count = 0;
      this.list = [];
      this.cacheHash = {}; // 每次svg渲染前重置，存储前次渲染不变的缓存id
    }

    _createClass(Defs, [{
      key: "add",
      value: function add(data) {
        var uuid = this.count;
        var hash = this.cacheHash;

        while (hash.hasOwnProperty(uuid)) {
          uuid++;
        }

        this.count = uuid + 1;
        data.id = uuid;
        data.uuid = 'karas-defs-' + this.id + '-' + uuid;
        data.index = this.list.length;
        this.list.push(data);
        return data.uuid;
      }
    }, {
      key: "addCache",
      value: function addCache(data) {
        data.index = this.list.length;
        this.list.push(data);
        this.cacheHash[data.id] = true;
        return data.uuid;
      }
    }, {
      key: "clear",
      value: function clear() {
        this.list = [];
        this.count = 0;
        this.cacheHash = {};
      }
    }, {
      key: "removeCache",
      value: function removeCache(data) {
        var list = this.list;
        var i = data.index; // 一般情况index即位置，但每次渲染过程中，可能会删掉一些，此时位置会往前，但index不变，因此遍历

        for (; i >= 0; i--) {
          if (list[i] === data) {
            list.splice(i, 1);
            return;
          }
        }
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

  var _enums$STYLE_KEY$d = enums.STYLE_KEY,
      DISPLAY$5 = _enums$STYLE_KEY$d.DISPLAY,
      MARGIN_TOP$3 = _enums$STYLE_KEY$d.MARGIN_TOP,
      MARGIN_RIGHT$3 = _enums$STYLE_KEY$d.MARGIN_RIGHT,
      MARGIN_BOTTOM$4 = _enums$STYLE_KEY$d.MARGIN_BOTTOM,
      MARGIN_LEFT$3 = _enums$STYLE_KEY$d.MARGIN_LEFT,
      PADDING_TOP$4 = _enums$STYLE_KEY$d.PADDING_TOP,
      PADDING_RIGHT$3 = _enums$STYLE_KEY$d.PADDING_RIGHT,
      PADDING_BOTTOM$3 = _enums$STYLE_KEY$d.PADDING_BOTTOM,
      PADDING_LEFT$4 = _enums$STYLE_KEY$d.PADDING_LEFT,
      WIDTH$6 = _enums$STYLE_KEY$d.WIDTH,
      HEIGHT$6 = _enums$STYLE_KEY$d.HEIGHT,
      BORDER_TOP_WIDTH$4 = _enums$STYLE_KEY$d.BORDER_TOP_WIDTH,
      BORDER_RIGHT_WIDTH$4 = _enums$STYLE_KEY$d.BORDER_RIGHT_WIDTH,
      BORDER_BOTTOM_WIDTH$4 = _enums$STYLE_KEY$d.BORDER_BOTTOM_WIDTH,
      BORDER_LEFT_WIDTH$4 = _enums$STYLE_KEY$d.BORDER_LEFT_WIDTH,
      FILL$1 = _enums$STYLE_KEY$d.FILL,
      STROKE$1 = _enums$STYLE_KEY$d.STROKE,
      STROKE_MITERLIMIT = _enums$STYLE_KEY$d.STROKE_MITERLIMIT,
      STROKE_WIDTH$1 = _enums$STYLE_KEY$d.STROKE_WIDTH,
      STROKE_LINECAP = _enums$STYLE_KEY$d.STROKE_LINECAP,
      STROKE_LINEJOIN = _enums$STYLE_KEY$d.STROKE_LINEJOIN,
      STROKE_DASHARRAY$1 = _enums$STYLE_KEY$d.STROKE_DASHARRAY,
      STROKE_DASHARRAY_STR = _enums$STYLE_KEY$d.STROKE_DASHARRAY_STR,
      FILL_RULE = _enums$STYLE_KEY$d.FILL_RULE,
      VISIBILITY$4 = _enums$STYLE_KEY$d.VISIBILITY,
      _enums$NODE_KEY$5 = enums.NODE_KEY,
      NODE_CACHE_PROPS = _enums$NODE_KEY$5.NODE_CACHE_PROPS,
      NODE_CURRENT_PROPS = _enums$NODE_KEY$5.NODE_CURRENT_PROPS,
      NODE_CURRENT_STYLE$2 = _enums$NODE_KEY$5.NODE_CURRENT_STYLE,
      NODE_IS_MASK$1 = _enums$NODE_KEY$5.NODE_IS_MASK,
      NODE_STYLE$2 = _enums$NODE_KEY$5.NODE_STYLE,
      NODE_CACHE$3 = _enums$NODE_KEY$5.NODE_CACHE,
      NODE_CACHE_TOTAL$2 = _enums$NODE_KEY$5.NODE_CACHE_TOTAL,
      NODE_CACHE_FILTER$2 = _enums$NODE_KEY$5.NODE_CACHE_FILTER,
      NODE_CACHE_MASK$1 = _enums$NODE_KEY$5.NODE_CACHE_MASK,
      NODE_CACHE_OVERFLOW$2 = _enums$NODE_KEY$5.NODE_CACHE_OVERFLOW,
      NODE_DEFS_CACHE$2 = _enums$NODE_KEY$5.NODE_DEFS_CACHE;
  var AUTO$5 = unit.AUTO,
      PX$7 = unit.PX,
      PERCENT$7 = unit.PERCENT;
  var int2rgba$2 = util.int2rgba,
      isNil$7 = util.isNil,
      joinArr$2 = util.joinArr;
  var canvasPolygon$3 = painter.canvasPolygon,
      svgPolygon$3 = painter.svgPolygon;
  var REGISTER$1 = {};

  var Geom$1 = /*#__PURE__*/function (_Xom) {
    _inherits(Geom, _Xom);

    var _super = _createSuper(Geom);

    function Geom(tagName, props) {
      var _this;

      _classCallCheck(this, Geom);

      _this = _super.call(this, tagName, props);
      _this.__isMulti = !!_this.props.multi;
      var isClip = _this.__isClip = !!_this.props.clip;
      var isMask = _this.__isMask = isClip || !!_this.props.mask;

      var _assertThisInitialize = _assertThisInitialized(_this),
          style = _assertThisInitialize.style;

      if (isMask) {
        style.background = null;
        style.border = null;
        style.boxShadow = null;
        style.mixBlendMode = 'normal';
      }

      _this.__style = css.normalize(_this.style, reset.DOM_ENTRY_SET.concat(reset.GEOM_ENTRY_SET));
      _this.__currentStyle = util.extend({}, _this.__style);
      _this.__currentProps = util.clone(_this.props);
      var config = _this.__config;
      config[NODE_CACHE_PROPS] = _this.__cacheProps = {};
      config[NODE_CURRENT_PROPS] = _this.__currentProps;
      config[NODE_CURRENT_STYLE$2] = _this.__currentStyle;
      config[NODE_IS_MASK$1] = isMask;
      config[NODE_STYLE$2] = _this.__style;
      return _this;
    }

    _createClass(Geom, [{
      key: "__tryLayInline",
      value: function __tryLayInline(w, total) {
        // 无children，直接以style的width为宽度，不定义则为0
        var width = this.currentStyle[WIDTH$6];

        if (width[1] === PX$7) {
          return w - width[0];
        } else if (width[1] === PERCENT$7) {
          return w - total * width[0] * 0.01;
        }

        return w;
      }
    }, {
      key: "__calAutoBasis",
      value: function __calAutoBasis(isDirectionRow, x, y, w, h, isVirtual) {
        var b = 0;
        var min = 0;
        var max = 0;
        var currentStyle = this.currentStyle; // 计算需考虑style的属性

        var width = currentStyle[WIDTH$6],
            height = currentStyle[HEIGHT$6],
            marginLeft = currentStyle[MARGIN_LEFT$3],
            marginTop = currentStyle[MARGIN_TOP$3],
            marginRight = currentStyle[MARGIN_RIGHT$3],
            marginBottom = currentStyle[MARGIN_BOTTOM$4],
            paddingLeft = currentStyle[PADDING_LEFT$4],
            paddingTop = currentStyle[PADDING_TOP$4],
            paddingRight = currentStyle[PADDING_RIGHT$3],
            paddingBottom = currentStyle[PADDING_BOTTOM$3],
            borderTopWidth = currentStyle[BORDER_TOP_WIDTH$4],
            borderRightWidth = currentStyle[BORDER_RIGHT_WIDTH$4],
            borderBottomWidth = currentStyle[BORDER_BOTTOM_WIDTH$4],
            borderLeftWidth = currentStyle[BORDER_LEFT_WIDTH$4];
        var main = isDirectionRow ? width : height;

        if (main[1] !== AUTO$5) {
          b = max = main[0];
        } else if (main[1] === PERCENT$7) {
          b = max = main[0] * 0.01 * (isDirectionRow ? w : h);
        } // border也得计算在内


        if (isDirectionRow) {
          var mp = this.__calMp(marginLeft, w) + this.__calMp(marginRight, w) + this.__calMp(paddingLeft, w) + this.__calMp(paddingRight, w);

          var w2 = borderLeftWidth[0] + borderRightWidth[0] + mp;
          b += w2;
          max += w2;
          min += w2;
        } else {
          var _mp = this.__calMp(marginTop, w) + this.__calMp(marginBottom, w) + this.__calMp(paddingTop, w) + this.__calMp(paddingBottom, w);

          var h2 = borderTopWidth[0] + borderBottomWidth[0] + _mp;
          b += h2;
          max += h2;
          min += h2;
        }

        return [b, min, max];
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

        this.__ioSize(w, this.height);

        this.__marginAuto(this.currentStyle, data);

        this.__config[NODE_CACHE_PROPS] = this.__cacheProps = {};
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


        var tw = this.__width = fixedWidth ? w : x - data.x;
        var th = this.__height = fixedHeight ? h : y - data.y;

        this.__ioSize(tw, th);

        this.__config[NODE_CACHE_PROPS] = this.__cacheProps = {};
      }
    }, {
      key: "__calCache",
      value: function __calCache(renderMode, lv, ctx, defs, parent, __cacheStyle, currentStyle, computedStyle, clientWidth, clientHeight, offsetWidth, offsetHeight, borderTopWidth, borderRightWidth, borderBottomWidth, borderLeftWidth, paddingTop, paddingRight, paddingBottom, paddingLeft, x1, x2, x3, x4, x5, x6, y1, y2, y3, y4, y5, y6, bx1, by1, bx2, by2) {
        var _this2 = this;

        _get(_getPrototypeOf(Geom.prototype), "__calCache", this).call(this, renderMode, lv, ctx, defs, parent, __cacheStyle, currentStyle, computedStyle, clientWidth, clientHeight, offsetWidth, offsetHeight, borderTopWidth, borderRightWidth, borderBottomWidth, borderLeftWidth, paddingTop, paddingRight, paddingBottom, paddingLeft, x1, x2, x3, x4, x5, x6, y1, y2, y3, y4, y5, y6, bx1, by1, bx2, by2);

        if (isNil$7(__cacheStyle[STROKE_WIDTH$1])) {
          __cacheStyle[STROKE_WIDTH$1] = true;
          var strokeWidth = currentStyle[STROKE_WIDTH$1] || [];
          var w = this.width;
          computedStyle[STROKE_WIDTH$1] = strokeWidth.map(function (item) {
            if (item[1] === PX$7) {
              return item[0];
            } else if (item[1] === PERCENT$7) {
              return item[0] * w * 0.01;
            } else {
              return 0;
            }
          });
        }

        if (isNil$7(__cacheStyle[STROKE_DASHARRAY$1])) {
          __cacheStyle[STROKE_DASHARRAY$1] = true;
          computedStyle[STROKE_DASHARRAY$1] = currentStyle[STROKE_DASHARRAY$1] || [];
          __cacheStyle[STROKE_DASHARRAY_STR] = computedStyle[STROKE_DASHARRAY$1].map(function (item) {
            return joinArr$2(item, ',');
          });
        } // 直接赋值的


        [STROKE_LINECAP, STROKE_LINEJOIN, STROKE_MITERLIMIT, FILL_RULE].forEach(function (k) {
          computedStyle[k] = currentStyle[k];
        }); // stroke/fll移至render里处理，因为cache涉及渐变坐标偏移

        [STROKE$1, FILL$1].forEach(function (k) {
          if (isNil$7(__cacheStyle[k])) {
            var v = currentStyle[k];
            computedStyle[k] = v;
            var res = [];

            if (Array.isArray(v)) {
              v.forEach(function (item) {
                if (item && (item.k === 'linear' || item.k === 'radial' || item.k === 'conic')) {
                  res.push(_this2.__gradient(renderMode, ctx, defs, x3, y3, x4, y4, item));
                } else if (item[3] > 0) {
                  res.push(int2rgba$2(item));
                } else {
                  res.push('none');
                }
              });
            }

            __cacheStyle[k] = res;
          }
        });
      }
    }, {
      key: "__calContent",
      value: function __calContent(renderMode, lv, currentStyle, computedStyle) {
        // Geom强制有内容
        return computedStyle[VISIBILITY$4] !== 'hidden';
      }
    }, {
      key: "__preSet",
      value: function __preSet() {
        var x = this.sx,
            y = this.sy,
            width = this.width,
            height = this.height,
            __cacheStyle = this.__cacheStyle,
            computedStyle = this.computedStyle;
        var borderTopWidth = computedStyle[BORDER_TOP_WIDTH$4],
            borderLeftWidth = computedStyle[BORDER_LEFT_WIDTH$4],
            display = computedStyle[DISPLAY$5],
            marginTop = computedStyle[MARGIN_TOP$3],
            marginLeft = computedStyle[MARGIN_LEFT$3],
            paddingTop = computedStyle[PADDING_TOP$4],
            paddingLeft = computedStyle[PADDING_LEFT$4],
            visibility = computedStyle[VISIBILITY$4];
        var originX = x + borderLeftWidth + marginLeft + paddingLeft;
        var originY = y + borderTopWidth + marginTop + paddingTop;
        var cx = originX + width * 0.5;
        var cy = originY + height * 0.5;
        var fill = __cacheStyle[FILL$1],
            stroke = __cacheStyle[STROKE$1],
            strokeDasharrayStr = __cacheStyle[STROKE_DASHARRAY_STR];
        var strokeWidth = computedStyle[STROKE_WIDTH$1],
            strokeLinecap = computedStyle[STROKE_LINECAP],
            strokeLinejoin = computedStyle[STROKE_LINEJOIN],
            strokeMiterlimit = computedStyle[STROKE_MITERLIMIT],
            strokeDasharray = computedStyle[STROKE_DASHARRAY$1],
            fillRule = computedStyle[FILL_RULE];
        return {
          x: x,
          y: y,
          originX: originX,
          originY: originY,
          width: width,
          height: height,
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
          if (fill) {
            if (fill.k === 'linear') {
              ctx.fillStyle = fill.v;
            } else if (fill.k === 'radial' && !Array.isArray(fill.v)) {
              ctx.fillStyle = fill.v;
            } else if (fill.k === 'conic') ; else if (!fill.k && ctx.fillStyle !== fill) {
              ctx.fillStyle = fill;
            }
          }

          if (stroke) {
            if (stroke.k === 'linear') {
              ctx.strokeStyle = stroke.v;
            } else if (stroke.k === 'radial' && !Array.isArray(stroke.v)) {
              ctx.strokeStyle = stroke.v;
            } else if (stroke.k === 'conic') ; else if (!stroke.k && ctx.strokeStyle !== stroke) {
              ctx.strokeStyle = stroke;
            }
          }

          if (strokeWidth !== undefined && ctx.lineWidth !== strokeWidth) {
            ctx.lineWidth = strokeWidth;
          }

          if (strokeLinecap !== undefined && ctx.lineCap !== strokeLinecap) {
            ctx.lineCap = strokeLinecap;
          }

          if (strokeLinejoin !== undefined && ctx.lineJoin !== strokeLinejoin) {
            ctx.lineJoin = strokeLinejoin;
          }

          if (strokeMiterlimit !== undefined && ctx.miterLimit !== strokeMiterlimit) {
            ctx.miterLimit = strokeMiterlimit;
          } // 小程序没这个方法


          if (util.isFunction(ctx.getLineDash)) {
            if (strokeDasharray && !util.equalArr(ctx.getLineDash(), strokeDasharray)) {
              ctx.setLineDash(strokeDasharray);
            }
          } else if (strokeDasharray) {
            ctx.setLineDash(strokeDasharray);
          }
        }
      }
    }, {
      key: "render",
      value: function render(renderMode, lv, ctx, defs, cache) {
        // cache状态渲染Root会先计算出super的__renderSelfData，非cache则无，也有可能渲染到一半异常从头再来，此时可能有也可能无
        var res = this.__renderSelfData || _get(_getPrototypeOf(Geom.prototype), "render", this).call(this, renderMode, lv, ctx, defs, cache);

        var __config = this.__config;
        var __cache = __config[NODE_CACHE$3],
            __cacheFilter = __config[NODE_CACHE_FILTER$2],
            __cacheMask = __config[NODE_CACHE_MASK$1],
            __cacheOverflow = __config[NODE_CACHE_OVERFLOW$2];

        if (renderMode === mode.CANVAS && cache) {
          __config[NODE_CACHE_TOTAL$2] = __config[NODE_CACHE$3];
        } // 存在老的缓存认为可提前跳出


        if (lv < o$1.REPAINT && (__cache && __cache.available || !o$1.contain(lv, o$1.FILTER) && __cacheFilter || __cacheMask || __cacheOverflow)) {
          res["break"] = true; // geom子类标识可以跳过自定义render()
        }

        if (renderMode === mode.SVG) {
          this.virtualDom.type = 'geom';
        } // 无论canvas/svg，break可提前跳出省略计算


        if (res["break"]) {
          return res;
        } // data在无cache时没有提前设置


        var preData = this.__preSet();

        return Object.assign(res, preData);
      }
    }, {
      key: "__renderPolygon",
      value: function __renderPolygon(renderMode, ctx, defs, res) {
        var fills = res.fill,
            fillRules = res.fillRule,
            strokes = res.stroke,
            strokeWidths = res.strokeWidth,
            strokeDasharrays = res.strokeDasharray,
            strokeDasharrayStrs = res.strokeDasharrayStr,
            strokeLinecaps = res.strokeLinecap,
            strokeLinejoins = res.strokeLinejoin,
            strokeMiterlimits = res.strokeMiterlimit,
            dx = res.dx,
            dy = res.dy;
        var list = this.__cacheProps.list,
            isMulti = this.isMulti; // 普通情况下只有1个，按普通情况走

        if (fills.length <= 1 && strokes.length <= 1) {
          var o = {
            fill: fills[0],
            fillRule: fillRules[0],
            stroke: strokes[0],
            strokeWidth: strokeWidths[0],
            strokeDasharray: strokeDasharrays[0],
            strokeDasharrayStr: strokeDasharrayStrs[0],
            strokeLinecap: strokeLinecaps[0],
            strokeLinejoin: strokeLinejoins[0],
            strokeMiterlimit: strokeMiterlimits[0],
            dx: dx,
            dy: dy
          };

          this.__renderOnePolygon(renderMode, ctx, defs, isMulti, list, o);
        } // 多个需要fill在下面，stroke在上面，依次循环
        else {
            for (var i = 0, len = fills.length; i < len; i++) {
              var fill = fills[i];

              if (fill) {
                var _o = {
                  fill: fill,
                  fillRule: fillRules[i],
                  dx: dx,
                  dy: dy
                };

                this.__renderOnePolygon(renderMode, ctx, defs, isMulti, list, _o);
              }
            }

            for (var _i = 0, _len = strokes.length; _i < _len; _i++) {
              var stroke = strokes[_i];

              if (stroke) {
                var _o2 = {
                  stroke: stroke,
                  strokeWidth: strokeWidths[_i],
                  strokeDasharray: strokeDasharrays[_i],
                  strokeDasharrayStr: strokeDasharrayStrs[_i],
                  strokeLinecap: strokeLinecaps[_i],
                  strokeLinejoin: strokeLinejoins[_i],
                  strokeMiterlimit: strokeMiterlimits[_i],
                  dx: dx,
                  dy: dy
                };

                this.__renderOnePolygon(renderMode, ctx, defs, isMulti, list, _o2);
              }
            }
          }
      }
    }, {
      key: "__renderOnePolygon",
      value: function __renderOnePolygon(renderMode, ctx, defs, isMulti, list, res) {
        var fill = res.fill,
            stroke = res.stroke,
            strokeWidth = res.strokeWidth;
        var isFillCE = fill && fill.k === 'conic';
        var isStrokeCE = stroke && stroke.k === 'conic'; // 椭圆是array

        var isFillRE = fill && fill.k === 'radial' && Array.isArray(fill.v);
        var isStrokeRE = strokeWidth && strokeWidth > 0 && stroke && stroke.k === 'radial' && Array.isArray(stroke.v);

        if (isFillCE || isStrokeCE) {
          if (isFillCE) {
            this.__conicGradient(renderMode, ctx, defs, list, isMulti, res);
          } else if (fill !== 'none') {
            this.__drawPolygon(renderMode, ctx, defs, isMulti, list, res, true);
          }

          if (strokeWidth && strokeWidth > 0 && isStrokeCE) {
            inject.warn('Stroke style can not use conic-gradient');
          } else if (strokeWidth && strokeWidth > 0 && stroke !== 'none') {
            this.__drawPolygon(renderMode, ctx, defs, isMulti, list, res, false, true);
          }
        } else if (isFillRE || isStrokeRE) {
          if (isFillRE) {
            this.__radialEllipse(renderMode, ctx, defs, list, isMulti, res, 'fill');
          } else if (fill !== 'none') {
            this.__drawPolygon(renderMode, ctx, defs, isMulti, list, res, true);
          } // stroke椭圆渐变matrix会变形，降级为圆


          if (strokeWidth && strokeWidth > 0 && isStrokeRE) {
            inject.warn('Stroke style can not use radial-gradient for ellipse');
            res.stroke.v = res.stroke.v[0];

            this.__drawPolygon(renderMode, ctx, defs, isMulti, list, res, false, true);
          } else if (strokeWidth && strokeWidth > 0 && stroke !== 'none') {
            this.__drawPolygon(renderMode, ctx, defs, isMulti, list, res, false, true);
          }
        } else {
          this.__drawPolygon(renderMode, ctx, defs, isMulti, list, res, true, true);
        }
      }
    }, {
      key: "__drawPolygon",
      value: function __drawPolygon(renderMode, ctx, defs, isMulti, list, res, isFill, isStroke) {
        var fill = res.fill,
            stroke = res.stroke,
            strokeWidth = res.strokeWidth,
            fillRule = res.fillRule,
            strokeDasharrayStr = res.strokeDasharrayStr,
            strokeLinecap = res.strokeLinecap,
            strokeLinejoin = res.strokeLinejoin,
            strokeMiterlimit = res.strokeMiterlimit,
            dx = res.dx,
            dy = res.dy;

        if (renderMode === mode.CANVAS) {
          this.__preSetCanvas(renderMode, ctx, res);

          ctx.beginPath();

          if (isMulti) {
            list.forEach(function (item) {
              return canvasPolygon$3(ctx, item, dx, dy);
            });
          } else {
            canvasPolygon$3(ctx, list, dx, dy);
          }

          if (isFill && fill && fill !== 'none') {
            ctx.fill(fillRule);
          }

          if (isStroke && stroke !== 'none' && strokeWidth && strokeWidth > 0) {
            ctx.stroke();
          }

          ctx.closePath();
        } else if (renderMode === mode.SVG) {
          var d = '';

          if (isMulti) {
            list.forEach(function (item) {
              return d += svgPolygon$3(item);
            });
          } else {
            d = svgPolygon$3(list);
          }

          var props = [['d', d]]; // 2个都没有常出现在多fill/stroke时，也有可能特殊单个故意这样写的

          if ((!fill || fill === 'none') && (!stroke || stroke === 'none')) {
            return;
          }

          if (isFill && fill && fill !== 'none') {
            props.push(['fill', fill.v || fill]);

            if (fillRule && fillRule !== 'nonzero') {
              props.push(['fill-rule', fillRule]);
            }
          } else {
            props.push(['fill', 'none']);
          }

          if (isStroke && stroke !== 'none' && strokeWidth && strokeWidth > 0) {
            props.push(['stroke', stroke.v || stroke]);
            props.push(['stroke-width', strokeWidth]);

            this.__propsStrokeStyle(props, strokeDasharrayStr, strokeLinecap, strokeLinejoin, strokeMiterlimit);
          } else {
            props.push(['stroke-width', 0]);
          }

          this.addGeom('path', props);
        }
      }
    }, {
      key: "__inversePtList",
      value: function __inversePtList(list, isMulti, t) {
        if (isMulti) {
          return list.map(function (item) {
            if (!item || !item.length) {
              return null;
            }

            return item.map(function (item) {
              if (!item || !item.length) {
                return null;
              }

              var arr = [];

              for (var i = 0, len = item.length; i < len; i += 2) {
                var p = mx.calPoint([item[i], item[i + 1]], t);
                arr.push(p[0]);
                arr.push(p[1]);
              }

              return arr;
            });
          });
        } else {
          return list.map(function (item) {
            if (!item || !item.length) {
              return null;
            }

            var arr = [];

            for (var i = 0, len = item.length; i < len; i += 2) {
              var p = mx.calPoint([item[i], item[i + 1]], t);
              arr.push(p[0]);
              arr.push(p[1]);
            }

            return arr;
          });
        }
      }
    }, {
      key: "__radialEllipse",
      value: function __radialEllipse(renderMode, ctx, defs, list, isMulti, res, method) {
        var strokeWidth = res.strokeWidth,
            strokeDasharrayStr = res.strokeDasharrayStr,
            strokeLinecap = res.strokeLinecap,
            strokeLinejoin = res.strokeLinejoin,
            strokeMiterlimit = res.strokeMiterlimit,
            dx = res.dx,
            dy = res.dy;

        var _res$method$v = _slicedToArray(res[method].v, 4),
            color = _res$method$v[0],
            matrix = _res$method$v[1],
            cx = _res$method$v[2],
            cy = _res$method$v[3]; // 椭圆渐变的转换，顶点逆矩阵变换


        var tfo = [cx, cy];
        matrix = tf.calMatrixByOrigin(matrix, tfo);
        var t = mx.inverse(matrix);
        list = this.__inversePtList(list, isMulti, t); // 用正向matrix渲染

        if (renderMode === mode.CANVAS) {
          if (matrix) {
            ctx.save();
            var me = this.matrixEvent;
            matrix = mx.multiply(me, matrix);
            ctx.setTransform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);
          }

          ctx.beginPath();

          if (ctx[method + 'Style'] !== color) {
            ctx[method + 'Style'] = color;
          }

          if (isMulti) {
            list.forEach(function (item) {
              return painter.canvasPolygon(ctx, item, dx, dy);
            });
          } else {
            canvasPolygon$3(ctx, list, dx, dy);
          }

          ctx[method]();
          ctx.closePath();

          if (matrix) {
            ctx.restore();
          }
        } else if (renderMode === mode.SVG) {
          var d = '';

          if (isMulti) {
            list.forEach(function (item) {
              return d += svgPolygon$3(item);
            });
          } else {
            d = svgPolygon$3(list);
          }

          var props = [['d', d]];

          if (method === 'fill') {
            props.push(['fill', color]);
            props.push(['strokeWidth', 0]);
          } else if (method === 'stroke') {
            props.push(['fill', 'none']);
            props.push(['stroke', color]);
            props.push(['stroke-width', strokeWidth]);

            this.__propsStrokeStyle(props, strokeDasharrayStr, strokeLinecap, strokeLinejoin, strokeMiterlimit);
          }

          props.push(['transform', "matrix(".concat(joinArr$2(matrix, ','), ")")]);
          this.addGeom('path', props);
        }
      }
    }, {
      key: "__conicGradient",
      value: function __conicGradient(renderMode, ctx, defs, list, isMulti, res) {
        var _this3 = this;

        var fill = res.fill,
            dx = res.dx,
            dy = res.dy;
        var color = fill.v;

        if (renderMode === mode.CANVAS) {
          var alpha = ctx.globalAlpha;
          ctx.globalAlpha = alpha * 0.5; // 割圆法的叠加会加深色彩，这里还原模拟下透明度

          if (isMulti) {
            list.forEach(function (item) {
              ctx.save();
              ctx.beginPath();
              canvasPolygon$3(ctx, item, dx, dy);
              ctx.clip();
              ctx.closePath();
              color.forEach(function (item) {
                ctx.beginPath();
                canvasPolygon$3(ctx, item[0], dx, dy);
                ctx.fillStyle = item[1];
                ctx.fill();
                ctx.closePath();
              });
              ctx.restore();
            });
          } else {
            ctx.save();
            ctx.beginPath();
            canvasPolygon$3(ctx, list, dx, dy);
            ctx.clip();
            ctx.closePath();
            color.forEach(function (item) {
              ctx.beginPath();
              canvasPolygon$3(ctx, item[0], dx, dy);
              ctx.fillStyle = item[1];
              ctx.fill();
              ctx.closePath();
            });
            ctx.restore();
          }

          ctx.globalAlpha = alpha;
        } else if (renderMode === mode.SVG) {
          if (isMulti) {
            list.forEach(function (item) {
              var v = {
                tagName: 'clipPath',
                children: [{
                  tagName: 'path',
                  props: [['d', svgPolygon$3(item)], ['fill', '#FFF']]
                }]
              };
              var clip = defs.add(v);

              _this3.__config[NODE_DEFS_CACHE$2].push(v);

              color.forEach(function (item) {
                _this3.virtualDom.bb.push({
                  type: 'item',
                  tagName: 'path',
                  props: [['d', svgPolygon$3(item[0])], ['fill', item[1]], ['clip-path', 'url(#' + clip + ')']]
                });
              });
            });
          } else {
            var v = {
              tagName: 'clipPath',
              children: [{
                tagName: 'path',
                props: [['d', svgPolygon$3(list)], ['fill', '#FFF']]
              }]
            };
            var clip = defs.add(v);

            this.__config[NODE_DEFS_CACHE$2].push(v);

            color.forEach(function (item) {
              _this3.virtualDom.bb.push({
                type: 'item',
                tagName: 'path',
                props: [['d', svgPolygon$3(item[0])], ['fill', item[1]], ['clip-path', 'url(#' + clip + ')']]
              });
            });
          }
        }
      }
    }, {
      key: "__propsStrokeStyle",
      value: function __propsStrokeStyle(props, strokeDasharrayStr, strokeLinecap, strokeLinejoin, strokeMiterlimit) {
        if (strokeDasharrayStr) {
          props.push(['stroke-dasharray', strokeDasharrayStr]);
        }

        if (strokeLinecap && strokeLinecap !== 'butt') {
          props.push(['stroke-linecap', strokeLinecap]);
        }

        if (strokeLinejoin && strokeLinejoin !== 'miter') {
          props.push(['stroke-linejoin', strokeLinejoin]);
        }

        if (strokeMiterlimit && strokeMiterlimit !== 4) {
          props.push(['stroke-miterlimit', strokeMiterlimit]);
        }
      } // geom的cache无内容也不清除

    }, {
      key: "__releaseWhenEmpty",
      value: function __releaseWhenEmpty() {}
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

        if (!isNil$7(v)) {
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
        if (!name || !util.isString(name) || name.charAt(0) !== '$') {
          throw new Error('Invalid param');
        }

        if (!REGISTER$1.hasOwnProperty(name)) {
          throw new Error("Geom has not register: ".concat(name));
        }

        return REGISTER$1[name];
      }
    }, {
      key: "register",
      value: function register(name, obj) {
        if (!name || !util.isString(name) || name.charAt(0) !== '$' || !(obj.prototype instanceof Geom)) {
          throw new Error('Invalid param');
        }

        if (Geom.hasRegister(name)) {
          throw new Error("Geom has already register: ".concat(name));
        }

        REGISTER$1[name] = obj;
      }
    }, {
      key: "hasRegister",
      value: function hasRegister(name) {
        return name && REGISTER$1.hasOwnProperty(name);
      }
    }, {
      key: "REGISTER",
      get: function get() {
        return REGISTER$1;
      }
    }]);

    return Geom;
  }(Xom);

  var _enums$NODE_KEY$6 = enums.NODE_KEY,
      NODE_COMPUTED_STYLE$1 = _enums$NODE_KEY$6.NODE_COMPUTED_STYLE,
      NODE_DOM_PARENT$3 = _enums$NODE_KEY$6.NODE_DOM_PARENT,
      NODE_MATRIX_EVENT$1 = _enums$NODE_KEY$6.NODE_MATRIX_EVENT,
      NODE_STRUCT$3 = _enums$NODE_KEY$6.NODE_STRUCT;
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
          cp.props = nextProps;
          cp.state = cp.__nextState || cp.state;
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
    var oldSr = cp.shadowRoot;
    var oldJson = cp.__cd;
    var json = builder.flattenJson(cp.render()); // 对比新老render()返回的内容，更新后重新生成sr

    diffSr(oldS, oldJson, json);

    cp.__init(json); // 为了局部dom布局需要知道老的css信息


    var sr = cp.shadowRoot;

    if (sr instanceof Xom$2) {
      ['__outerWidth', '__outerHeight', '__sx', '__sy', '__sx2', '__sx3', '__sx4', '__sx5', '__sx6', '__sy2', '__sy3', '__sy4', '__sy5', '__sy6', '__bx1', '__by1', '__bx2', '__by2', '__computedStyle'].forEach(function (k) {
        sr[k] = oldSr[k];
      });
      sr.__config[NODE_COMPUTED_STYLE$1] = oldSr.computedStyle;
    } else {
      sr.__config[NODE_MATRIX_EVENT$1] = oldSr.__config[NODE_MATRIX_EVENT$1];
    }

    ['__x', '__y', '__width', '__height', '__sx1', // text和xom
    '__sy1', '__layoutData', '__parent', '__domParent'].forEach(function (k) {
      sr[k] = oldSr[k];
    });
    sr.__config[NODE_DOM_PARENT$3] = oldSr.domParent;
    sr.__config[NODE_STRUCT$3] = oldSr.__config[NODE_STRUCT$3];
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
            nj.inheritAnimate = vd;
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
          nj.inheritAnimate = vd;
        }
      } // dom类型递归children
      else if (nj.$$type === TYPE_VD$2 && oj.$$type === TYPE_VD$2) {
          if (oj.tagName === nj.tagName) {
            nj.inheritAnimate = vd;
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
            inject.error('Component ' + vd.tagName + ' has duplicate key: ' + key);
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
    updateList.splice(0);
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
  var contain$1 = o$1.contain,
      NONE$1 = o$1.NONE,
      TRANSFORM_ALL$1 = o$1.TRANSFORM_ALL,
      OPACITY$4 = o$1.OPACITY,
      FILTER$4 = o$1.FILTER,
      MIX_BLEND_MODE$2 = o$1.MIX_BLEND_MODE;

  function diff(elem, ovd, nvd) {
    var cns = elem.childNodes;
    diffDefs(cns[0], ovd.defs, nvd.defs); // <REPAINT不会有lv属性，无需对比

    if (!nvd.hasOwnProperty('lv')) {
      diffBb(cns[1], ovd.bb, nvd.bb);
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
        overflow = nvd.overflow,
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
    }

    if (ovd.filter !== filter) {
      if (filter) {
        elem.setAttribute('filter', filter);
      } else {
        elem.removeAttribute('filter');
      }
    }

    if (ovd.overflow !== overflow) {
      if (overflow) {
        elem.setAttribute('clipPath', overflow);
      } else {
        elem.removeAttribute('overflow');
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
    var transform = nvd.transform,
        opacity = nvd.opacity,
        mask = nvd.mask,
        filter = nvd.filter,
        mixBlendMode = nvd.mixBlendMode;

    if (mask) {
      elem.setAttribute('mask', mask);
    } else {
      elem.removeAttribute('mask');
    }

    if (lv === NONE$1) {
      return;
    }

    if (contain$1(lv, TRANSFORM_ALL$1)) {
      if (transform) {
        elem.setAttribute('transform', transform);
      } else {
        elem.removeAttribute('transform');
      }
    }

    if (contain$1(lv, OPACITY$4)) {
      if (opacity !== 1 && opacity !== undefined) {
        elem.setAttribute('opacity', opacity);
      } else {
        elem.removeAttribute('opacity');
      }
    }

    if (contain$1(lv, FILTER$4)) {
      if (filter) {
        elem.setAttribute('filter', filter);
      } else {
        elem.removeAttribute('filter');
      }
    }

    if (contain$1(lv, MIX_BLEND_MODE$2)) {
      if (mixBlendMode) {
        elem.setAttribute('style', 'mix-blend-mode:' + mixBlendMode);
      } else {
        elem.removeAttribute('style');
      }
    }
  }

  function diffD2D(elem, ovd, nvd, root) {
    // cache表明children无变化缓存，一定是REPAINT以下的，只需看自身的lv以及mask
    if (nvd.cache) {
      diffByLessLv(elem, ovd, nvd, nvd.lv);
      return;
    } // 无cache且<REPAINT的情况快速对比且继续对比children


    if (nvd.hasOwnProperty('lv')) {
      diffByLessLv(elem, ovd, nvd, nvd.lv);
    } else {
      diffX2X(elem, ovd, nvd);

      if (!root) {
        diffBb(elem.firstChild, ovd.bb, nvd.bb);
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
    diffBb(elem.firstChild, ovd.bb, nvd.bb);
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
      diffByLessLv(elem, ovd, nvd, nvd.lv);
      return;
    } // 无cache且<REPAINT的情况快速对比且继续对比children


    if (nvd.hasOwnProperty('lv')) {
      diffByLessLv(elem, ovd, nvd, nvd.lv);
    } else {
      diffX2X(elem, ovd, nvd);
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
        for (var j = ol - 1; j >= i; j--) {
          removeAt(lastChild, cns, j);
        }
      } else if (i < nl) {
        for (; i < nl; i++) {
          insertAt(lastChild, cns, i, joinVd$1(nvd.children[i]));
        }
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

  var _enums$STYLE_KEY$e = enums.STYLE_KEY,
      POSITION$3 = _enums$STYLE_KEY$e.POSITION,
      DISPLAY$6 = _enums$STYLE_KEY$e.DISPLAY,
      OPACITY$5 = _enums$STYLE_KEY$e.OPACITY,
      VISIBILITY$5 = _enums$STYLE_KEY$e.VISIBILITY,
      FILTER$5 = _enums$STYLE_KEY$e.FILTER,
      OVERFLOW$1 = _enums$STYLE_KEY$e.OVERFLOW,
      MIX_BLEND_MODE$3 = _enums$STYLE_KEY$e.MIX_BLEND_MODE,
      FILL$2 = _enums$STYLE_KEY$e.FILL,
      TRANSFORM$5 = _enums$STYLE_KEY$e.TRANSFORM,
      TRANSFORM_ORIGIN$5 = _enums$STYLE_KEY$e.TRANSFORM_ORIGIN,
      _enums$NODE_KEY$7 = enums.NODE_KEY,
      NODE_CACHE$4 = _enums$NODE_KEY$7.NODE_CACHE,
      NODE_CACHE_TOTAL$3 = _enums$NODE_KEY$7.NODE_CACHE_TOTAL,
      NODE_CACHE_OVERFLOW$3 = _enums$NODE_KEY$7.NODE_CACHE_OVERFLOW,
      NODE_CACHE_MASK$2 = _enums$NODE_KEY$7.NODE_CACHE_MASK,
      NODE_CACHE_FILTER$3 = _enums$NODE_KEY$7.NODE_CACHE_FILTER,
      NODE_MATRIX$1 = _enums$NODE_KEY$7.NODE_MATRIX,
      NODE_MATRIX_EVENT$2 = _enums$NODE_KEY$7.NODE_MATRIX_EVENT,
      NODE_OPACITY$2 = _enums$NODE_KEY$7.NODE_OPACITY,
      NODE_COMPUTED_STYLE$2 = _enums$NODE_KEY$7.NODE_COMPUTED_STYLE,
      NODE_CURRENT_STYLE$3 = _enums$NODE_KEY$7.NODE_CURRENT_STYLE,
      NODE_LIMIT_CACHE$1 = _enums$NODE_KEY$7.NODE_LIMIT_CACHE,
      NODE_BLUR_VALUE$1 = _enums$NODE_KEY$7.NODE_BLUR_VALUE,
      NODE_REFRESH_LV$1 = _enums$NODE_KEY$7.NODE_REFRESH_LV,
      NODE_HAS_CONTENT$1 = _enums$NODE_KEY$7.NODE_HAS_CONTENT,
      NODE_CACHE_STYLE$1 = _enums$NODE_KEY$7.NODE_CACHE_STYLE,
      NODE_DEFS_CACHE$3 = _enums$NODE_KEY$7.NODE_DEFS_CACHE,
      NODE_IS_MASK$2 = _enums$NODE_KEY$7.NODE_IS_MASK,
      _enums$STRUCT_KEY$2 = enums.STRUCT_KEY,
      STRUCT_NODE$1 = _enums$STRUCT_KEY$2.STRUCT_NODE,
      STRUCT_INDEX$2 = _enums$STRUCT_KEY$2.STRUCT_INDEX,
      STRUCT_TOTAL$1 = _enums$STRUCT_KEY$2.STRUCT_TOTAL,
      STRUCT_HAS_MASK$1 = _enums$STRUCT_KEY$2.STRUCT_HAS_MASK,
      STRUCT_LV$2 = _enums$STRUCT_KEY$2.STRUCT_LV;
  var NONE$2 = o$1.NONE,
      TRANSFORM_ALL$2 = o$1.TRANSFORM_ALL,
      OP$1 = o$1.OPACITY,
      FT$1 = o$1.FILTER,
      REPAINT$2 = o$1.REPAINT,
      contain$2 = o$1.contain,
      MBM = o$1.MIX_BLEND_MODE;
  /**
   * 广度遍历，每层后序遍历形成链表，遇到cacheTotal跳出
   * @param structs 先序整树
   */

  function genLRD(structs) {
    var list = [0];
    var hash = {
      0: {
        i: 0
      }
    }; // 广度遍历不断重复

    while (list.length) {
      list.splice(0).forEach(function (index) {
        var top = structs[index];
        var parent = hash[index];
        var first;
        var last;

        for (var i = index + 1, len = i + (top[STRUCT_TOTAL$1] || 0); i < len; i++) {
          var _structs$i = structs[i],
              node = _structs$i[STRUCT_NODE$1],
              total = _structs$i[STRUCT_TOTAL$1],
              hasMask = _structs$i[STRUCT_HAS_MASK$1];
          var _node$__config = node.__config,
              __cacheTotal = _node$__config[NODE_CACHE_TOTAL$3],
              display = _node$__config[NODE_COMPUTED_STYLE$2][DISPLAY$6]; // 不可见整个跳过视作不存在

          if (display === 'none') {
            i += total || 0;

            if (hasMask) {
              i += hasMask;
            }

            continue;
          } // 子节点从开始到最后形成单链表


          var obj = {
            i: i
          };

          if (!first) {
            first = obj;
          }

          if (last) {
            obj.p = last;
          }

          last = obj; // 文本或单个节点不再继续深度遍历

          if (node instanceof Text || !total) {
            continue;
          } // 遗留有total缓存的跳过视为1个节点


          if (__cacheTotal && __cacheTotal.available) {
            i += total || 0;
            continue;
          }

          hash[i] = obj;
          list.push(i);
          i += total || 0;
        } // 第一层Root没有parent，后面层都有，最后一个子节点连到parent，如果parent本身有链接，赋予first


        if (parent && last) {
          if (parent.p) {
            first.p = parent.p;
          }

          parent.p = last;
        }
      });
    } // 此时从Root开始遍历链表，得到的是反向的后序遍历，reverse()即可


    var current = hash[0];
    var res = [];

    while (current) {
      res.push(current.i);
      current = current.p;
    }

    return res.reverse();
  }

  function genBboxTotal(node, __structs, index, total, parentIndexHash, opacityHash, matrixHash) {
    var sx1 = node.__sx1,
        sy1 = node.__sy1,
        __config = node.__config;
    var cache = __config[NODE_CACHE$4],
        blurValue = __config[NODE_BLUR_VALUE$1]; // 先将局部根节点的bbox算好，可能没内容是空

    var bboxTotal;

    if (cache && cache.available) {
      bboxTotal = cache.bbox.slice(0);
    } else {
      bboxTotal = node.bbox;
    } // 广度遍历，不断一层层循环下去，用2个hash暂存每层的父matrix和blur


    var list = [index];

    var blurHash = _defineProperty({}, index, blurValue);

    opacityHash[index] = 1;

    while (list.length) {
      list.splice(0).forEach(function (parentIndex) {
        var total = __structs[parentIndex][STRUCT_TOTAL$1] || 0;

        for (var i = parentIndex + 1, len = parentIndex + total + 1; i < len; i++) {
          var _structs$i2 = __structs[i],
              node2 = _structs$i2[STRUCT_NODE$1],
              _total = _structs$i2[STRUCT_TOTAL$1];
          var __sx1 = node2.__sx1,
              __sy1 = node2.__sy1,
              _node2$__config = node2.__config,
              __blurValue = _node2$__config[NODE_BLUR_VALUE$1],
              __limitCache = _node2$__config[NODE_LIMIT_CACHE$1],
              __cache = _node2$__config[NODE_CACHE$4],
              __cacheTotal = _node2$__config[NODE_CACHE_TOTAL$3],
              _node2$__config$NODE_ = _node2$__config[NODE_COMPUTED_STYLE$2],
              display = _node2$__config$NODE_[DISPLAY$6],
              visibility = _node2$__config$NODE_[VISIBILITY$5],
              transform = _node2$__config$NODE_[TRANSFORM$5],
              transformOrigin = _node2$__config$NODE_[TRANSFORM_ORIGIN$5],
              opacity = _node2$__config$NODE_[OPACITY$5];

          if (__limitCache) {
            return;
          } // display:none跳过整个节点树，visibility只跳过自身


          if (display === 'none') {
            i += _total || 0;
            continue;
          }

          if (visibility === 'hidden') {
            continue;
          }

          parentIndexHash[i] = parentIndex;
          opacityHash[i] = opacityHash[parentIndex] * opacity; // 防止text的情况，其一定属于某个node，其bbox被计算过，text不应该计算

          if (node2 instanceof Text) {
            continue;
          }

          var bbox = void 0,
              dx = 0,
              dy = 0;

          if (__cacheTotal && __cacheTotal.available) {
            bbox = __cacheTotal.bbox.slice(0);
            dx = __cacheTotal.dbx;
            dy = __cacheTotal.dby;
          } else if (__cache && __cache.available) {
            bbox = __cache.bbox.slice(0);
            dx = __cache.dbx;
            dy = __cache.dby;
          } else {
            bbox = node2.bbox;
          } // 可能Xom没有内容


          if (bbox) {
            bbox[0] -= sx1;
            bbox[1] -= sy1;
            bbox[2] -= sx1;
            bbox[3] -= sy1;
            var matrix = matrixHash[parentIndex];
            var blur = (blurHash[parentIndex] || 0) + (__blurValue || 0); // 父级matrix初始化E为null，自身不为E时才运算，可以加速

            if (transform && !mx.isE(transform)) {
              var tfo = transformOrigin.slice(0); // total下的节点tfo的计算，以total为原点，差值坐标即相对坐标

              tfo[0] += __sx1 - sx1 + dx;
              tfo[1] += __sy1 - sy1 + dy;
              var m = tf.calMatrixByOrigin(transform, tfo);

              if (matrix) {
                matrix = mx.multiply(matrix, m);
              } else {
                matrix = m;
              }
            }

            if (matrix) {
              matrixHash[i] = matrix;
            }

            bbox = util.transformBbox(bbox, matrix, blur, blur); // 有孩子才继续存入下层级广度运算

            if (_total) {
              blurHash[i] = blur;
              list.push(i);
              i += _total;
            }

            if (!bboxTotal) {
              bboxTotal = bbox;
            } else {
              mergeBbox(bboxTotal, bbox);
            }
          }
        }
      });
    }

    if (bboxTotal[2] - bboxTotal[0] > Cache.MAX || bboxTotal[3] - bboxTotal[1] > Cache.MAX) {
      // 标识后续不再尝试生成，重新布局会清空标识
      __config[NODE_LIMIT_CACHE$1] = true;
      return;
    }

    return bboxTotal;
  }

  function mergeBbox(bbox, t) {
    bbox[0] = Math.min(bbox[0], bbox[0] + t[0]);
    bbox[1] = Math.min(bbox[1], bbox[1] + t[1]);
    bbox[2] = Math.max(bbox[2], bbox[2] + t[2]);
    bbox[3] = Math.max(bbox[3], bbox[3] + t[3]);
  }

  function genTotal(renderMode, node, lv, index, total, __structs, cacheTop, cache) {
    if (total === 0) {
      return node.__config[NODE_CACHE_TOTAL$3] = cache;
    } // 存每层父亲的matrix和opacity和index，bbox计算过程中生成，缓存给下面渲染过程用


    var parentIndexHash = {};
    var matrixHash = {};
    var opacityHash = {};
    var bboxTotal = genBboxTotal(node, __structs, index, total, parentIndexHash, opacityHash, matrixHash);

    if (!bboxTotal) {
      return;
    }

    if (cacheTop) {
      cacheTop.reset(bboxTotal);
    } else {
      cacheTop = node.__config[NODE_CACHE_TOTAL$3] = Cache.getInstance(bboxTotal);
    } // 创建失败，再次降级


    if (!cacheTop || !cacheTop.enabled) {
      return;
    }

    var sx1 = node.__sx1,
        sy1 = node.__sy1;

    cacheTop.__appendData(sx1, sy1);

    cacheTop.__available = true;

    var _cacheTop = cacheTop,
        _cacheTop$coords = _slicedToArray(_cacheTop.coords, 2),
        tx = _cacheTop$coords[0],
        ty = _cacheTop$coords[1],
        ctx = _cacheTop.ctx,
        dbx = _cacheTop.dbx,
        dby = _cacheTop.dby; // 先绘制自己的cache，起点所以matrix视作E为空


    if (cache && cache.available) {
      ctx.globalAlpha = 1;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      Cache.drawCache(cache, cacheTop);
    } // 先序遍历汇总到total


    for (var i = index + 1, len = index + (total || 0) + 1; i < len; i++) {
      var _structs$i3 = __structs[i],
          _node = _structs$i3[STRUCT_NODE$1],
          _total2 = _structs$i3[STRUCT_TOTAL$1],
          hasMask = _structs$i3[STRUCT_HAS_MASK$1];
      var _node$__config2 = _node.__config,
          __cache = _node$__config2[NODE_CACHE$4],
          __cacheTotal = _node$__config2[NODE_CACHE_TOTAL$3],
          __cacheFilter = _node$__config2[NODE_CACHE_FILTER$3],
          __cacheMask = _node$__config2[NODE_CACHE_MASK$2],
          __cacheOverflow = _node$__config2[NODE_CACHE_OVERFLOW$3],
          isMask = _node$__config2[NODE_IS_MASK$2],
          _node$__config2$NODE_ = _node$__config2[NODE_COMPUTED_STYLE$2],
          display = _node$__config2$NODE_[DISPLAY$6],
          visibility = _node$__config2$NODE_[VISIBILITY$5],
          transform = _node$__config2$NODE_[TRANSFORM$5],
          transformOrigin = _node$__config2$NODE_[TRANSFORM_ORIGIN$5],
          mixBlendMode = _node$__config2$NODE_[MIX_BLEND_MODE$3]; // mask不能被汇总到top上

      if (isMask) {
        continue;
      }

      if (display === 'none') {
        i += _total2 || 0;

        if (hasMask) {
          i += hasMask;
        }

        continue;
      } // 单个不可见节点跳过，其孩子还要继续


      if (visibility === 'hidden') {
        continue;
      }

      var parentIndex = parentIndexHash[i];
      var matrix = matrixHash[parentIndex];
      var opacity = opacityHash[i]; // 先看text

      if (_node instanceof Text) {
        ctx.globalAlpha = opacityHash[parentIndex];

        var _matrix = matrixHash[parentIndex] || [1, 0, 0, 1, 0, 0];

        ctx.setTransform(_matrix[0], _matrix[1], _matrix[2], _matrix[3], _matrix[4], _matrix[5]);

        _node.render(renderMode, 0, ctx, null, tx - sx1 + dbx, ty - sy1 + dby);
      } // 再看total缓存/cache，都没有的是无内容的Xom节点
      else {
          if (transform && !mx.isE(transform)) {
            var tfo = transformOrigin.slice(0); // total下的节点tfo的计算，以total为原点，差值坐标即相对坐标

            if (__cache && __cache.available) {
              tfo[0] += __cache.sx1;
              tfo[1] += __cache.sy1;
            } else {
              tfo[0] += _node.__sx1;
              tfo[1] += _node.__sy1;
            }

            var dx = -sx1 + dbx + tx;
            var dy = -sy1 + dby + ty;
            tfo[0] += dx;
            tfo[1] += dy;
            var m = tf.calMatrixByOrigin(transform, tfo);

            if (matrix) {
              matrix = mx.multiply(matrix, m);
            } else {
              matrix = m;
            }
          }

          if (matrix) {
            matrixHash[i] = matrix;
          }

          var target = __cacheOverflow || __cacheMask || __cacheFilter;

          if (!target) {
            target = __cacheTotal && __cacheTotal.available ? __cacheTotal : null;
          }

          if (target) {
            i += _total2 || 0;
          } else if (__cache && __cache.available) {
            target = __cache;
          }

          if (target) {
            if (mixBlendMode !== 'normal') {
              ctx.globalCompositeOperation = 'source-over';
            } else {
              ctx.globalCompositeOperation = mixBlendMode.replace(/[A-Z]/, function ($0) {
                return '-' + $0.toLowerCase();
              });
            }

            ctx.globalAlpha = opacity;

            if (matrix) {
              ctx.setTransform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);
            } else {
              ctx.setTransform(1, 0, 0, 1, 0, 0);
            }

            Cache.drawCache(target, cacheTop);

            if (target === __cacheMask) {
              i += hasMask;
            }
          }
        }
    }

    return cacheTop;
  }

  function genFilter(node, cache, v) {
    return node.__config[NODE_CACHE_FILTER$3] = Cache.genBlur(cache, v);
  }

  function genMask(node, cache, isClip) {
    var _node$computedStyle = node.computedStyle,
        transform = _node$computedStyle[TRANSFORM$5],
        transformOrigin = _node$computedStyle[TRANSFORM_ORIGIN$5];
    return node.__config[NODE_CACHE_MASK$2] = Cache.genMask(cache, node.next, isClip, transform, transformOrigin);
  }

  function genOverflow(node, cache) {
    return node.__config[NODE_CACHE_OVERFLOW$3] = Cache.genOverflow(cache, node);
  }

  function renderCacheCanvas(renderMode, ctx, defs, root) {
    var __structs = root.__structs,
        width = root.width,
        height = root.height; // 栈代替递归，存父节点的matrix/opacity，matrix为E时存null省略计算

    var matrixList = [];
    var parentMatrix;
    var opacityList = [];
    var parentOpacity = 1;
    var lastList = [];
    var lastConfig;
    var lastLv = 0; // 先一遍先序遍历每个节点绘制到自己__cache上，排除Text和缓存和局部根缓存，lv的变化根据大小相等进行出入栈parent操作

    var _loop = function _loop(_i, len) {
      var _structs$_i = __structs[_i],
          node = _structs$_i[STRUCT_NODE$1],
          lv = _structs$_i[STRUCT_LV$2],
          total = _structs$_i[STRUCT_TOTAL$1];
      var __config = node.__config;
      var __refreshLevel = __config[NODE_REFRESH_LV$1],
          __cache = __config[NODE_CACHE$4],
          __cacheTotal = __config[NODE_CACHE_TOTAL$3],
          computedStyle = __config[NODE_COMPUTED_STYLE$2]; // 排除Text

      if (node instanceof Text) {
        i = _i;
        return "continue";
      } // lv变大说明是child，相等是sibling，变小可能是parent或另一棵子树，Root节点第一个特殊处理


      if (_i === 0) {
        lastList.push(node);
      } else if (lv > lastLv) {
        parentMatrix = lastConfig[NODE_MATRIX_EVENT$2];

        if (mx.isE(parentMatrix)) {
          parentMatrix = null;
        }

        matrixList.push(parentMatrix);
        parentOpacity = lastConfig[NODE_OPACITY$2];
        opacityList.push(parentOpacity);
        lastList.push(node);
      } else if (lv < lastLv) {
        var diff = lastLv - lv;
        matrixList.splice(-diff);
        parentMatrix = matrixList[lv];
        opacityList.splice(-diff);
        parentOpacity = opacityList[lv];
        lastList.splice(-diff);
        lastConfig = lastList[lv];
      }

      if (computedStyle[DISPLAY$6] === 'none') {
        _i += total || 0; // display:none不能跳过后面的mask，其渲染自身缓存cache，以备对象切换block用

        i = _i;
        return "continue";
      } // lv<REPAINT，肯定有__cache，跳过渲染过程，快速运算


      if (__refreshLevel < REPAINT$2) {
        __config[NODE_REFRESH_LV$1] = NONE$2;
        var currentStyle = __config[NODE_CURRENT_STYLE$3],
            _computedStyle = __config[NODE_COMPUTED_STYLE$2],
            __cacheStyle = __config[NODE_CACHE_STYLE$1];

        if (contain$2(__refreshLevel, TRANSFORM_ALL$2)) {
          var matrix = node.__calMatrix(__refreshLevel, __cacheStyle, currentStyle, _computedStyle); // 恶心的v8性能优化


          var m = __config[NODE_MATRIX$1];

          if (matrix && m) {
            m[0] = matrix[0];
            m[1] = matrix[1];
            m[2] = matrix[2];
            m[3] = matrix[3];
            m[4] = matrix[4];
            m[5] = matrix[5];
          }

          if (parentMatrix && matrix) {
            matrix = mx.multiply(parentMatrix, matrix);
          } // 恶心的v8性能优化


          m = __config[NODE_MATRIX_EVENT$2];

          if (m && matrix) {
            m[0] = matrix[0];
            m[1] = matrix[1];
            m[2] = matrix[2];
            m[3] = matrix[3];
            m[4] = matrix[4];
            m[5] = matrix[5];
          }
        }

        if (contain$2(__refreshLevel, OP$1)) {
          var opacity = _computedStyle[OPACITY$5] = currentStyle[OPACITY$5];
          __config[NODE_OPACITY$2] = parentOpacity * opacity;
        }

        if (contain$2(__refreshLevel, FT$1)) {
          var filter = _computedStyle[FILTER$5] = currentStyle[FILTER$5];
          __config[NODE_BLUR_VALUE$1] = 0;

          if (Array.isArray(filter)) {
            filter.forEach(function (item) {
              var _item = _slicedToArray(item, 2),
                  k = _item[0],
                  v = _item[1];

              if (k === 'blur') {
                __config[NODE_BLUR_VALUE$1] = v;
              }
            });
          }

          var bbox = node.bbox;

          if (__cache) {
            __cache = Cache.updateCache(__cache, bbox);
          } else {
            __cache = Cache.getInstance(bbox);
          }

          __config[NODE_CACHE$4] = __cache;

          if (!__cache.enabled) {
            inject.warn('Downgrade for cache-filter change error');
          }
        }

        if (contain$2(__refreshLevel, MBM)) {
          _computedStyle[MIX_BLEND_MODE$3] = currentStyle[MIX_BLEND_MODE$3];
        } // total可以跳过所有孩子节点省略循环，filter/mask强制前提有total


        if (__cacheTotal && __cacheTotal.available) {
          _i += total || 0;
        }
      }
      /**
       * 没cache重新渲染，并根据结果判断是否离屏错误
       * geom特殊对待，因可能被开发人员继承实现自定义图形，render()传递ctx要使其无感知切换，
       * 先执行Xom的通用render()逻辑，实现__cache离屏ctx能力，然后Geom的render()会判断不再执行
       */
      else {
          if (node instanceof Geom$1) {
            node.__renderSelfData = node.__renderSelf(renderMode, __refreshLevel, ctx, defs, true);
            __cache = __config[NODE_CACHE$4];

            if (__cache && __cache.available) {
              node.render(renderMode, __refreshLevel, __cache.ctx, defs, true);
            }
          } else {
            node.render(renderMode, __refreshLevel, ctx, defs, true);
          }
        }

      lastConfig = __config;
      lastLv = lv;
      i = _i;
    };

    for (var i = 0, len = __structs.length; i < len; i++) {
      var _ret = _loop(i);

      if (_ret === "continue") continue;
    } // 根据修剪的树形成LRD


    var lrd = genLRD(__structs);
    /**
     * 再后序遍历进行__cacheTotal合并，统计节点个数，有total的视为1个，排除掉Root和Text，
     * 在这个过程中，注意层级lv的变化，因为一个节点清除total后其所有父节点肯定也会清除，形成一条顶到底链路，
     * 所以比上次lv小的一定是上个节点的parent，大于的一定是另一条链路，相等一定是sibling
     * 过程中向上和平向可累计次数，另一条链路归零重新统计，mask改变一定会包含sibling的target
     * 无需判断display:none和visibility:hidden，前者已经被过滤，后者可能是total
     */

    if (lrd.length) {
      var NUM = Math.max(1, Cache.NUM);
      var prevLv = __structs[lrd[0]][STRUCT_LV$2],
          hash = {},
          indexHash = {},
          maskGenHash = {}; // mask渲染缓存的索引hash，key为struct的索引，value为lrd的索引

      for (var _i2 = 0, _len = lrd.length - 1; _i2 < _len; _i2++) {
        indexHash[lrd[_i2]] = _i2;
      } // 最后一个一定是Root不遍历


      for (var _i3 = 0, _len2 = lrd.length - 1; _i3 < _len2; _i3++) {
        var _structs$lrd$_i = __structs[lrd[_i3]],
            node = _structs$lrd$_i[STRUCT_NODE$1],
            lv = _structs$lrd$_i[STRUCT_LV$2],
            index = _structs$lrd$_i[STRUCT_INDEX$2],
            hasMask = _structs$lrd$_i[STRUCT_HAS_MASK$1],
            total = _structs$lrd$_i[STRUCT_TOTAL$1];
        var __config = node.__config;
        var _config$NODE_COMPUTE = __config[NODE_COMPUTED_STYLE$2],
            position = _config$NODE_COMPUTE[POSITION$3],
            visibility = _config$NODE_COMPUTE[VISIBILITY$5],
            overflow = _config$NODE_COMPUTE[OVERFLOW$1],
            mixBlendMode = _config$NODE_COMPUTE[MIX_BLEND_MODE$3]; // text一定是叶子节点

        if (node instanceof Text) {
          prevLv = lv;

          if (visibility !== 'hidden') {
            hash[lv - 1] = hash[lv - 1] || 0;
            hash[lv - 1]++;
          }

          continue;
        }

        var __hasContent = __config[NODE_HAS_CONTENT$1],
            __blurValue = __config[NODE_BLUR_VALUE$1],
            __limitCache = __config[NODE_LIMIT_CACHE$1],
            __cacheTotal = __config[NODE_CACHE_TOTAL$3],
            __cacheFilter = __config[NODE_CACHE_FILTER$3],
            __cacheMask = __config[NODE_CACHE_MASK$2],
            __cacheOverflow = __config[NODE_CACHE_OVERFLOW$3],
            __cache = __config[NODE_CACHE$4];
        var needGenTotal = void 0; // <是父节点

        if (lv < prevLv) {
          // 只有这里代表自己的内容，其它的情况不能确定一定是叶子节点，虽然没内容不可见可能有total
          if (visibility !== 'hidden' && __hasContent) {
            hash[lv] = hash[lv] || 0;
            hash[lv]++;
          } // 需累加跳链路积累的数字


          var count = hash[lv] || 0;
          hash[lv] = 0;
          hash[lv - 1] = hash[lv - 1] || 0; // 当>临界值时，进行cacheTotal合并

          if (!__limitCache && (count >= NUM || (position === 'relative' || position === 'absolute') && (__hasContent || count) // 防止特殊情况，即空div包含1个count的内容，或者仅自己，没必要生成
          || (hasMask || __blurValue > 0 || overflow !== 'visible' || mixBlendMode !== 'normal') && (__hasContent || count))) {
            hash[lv - 1]++;
            needGenTotal = true;
          } else {
            hash[lv - 1] += count;
          }
        } // >是Root的另一条链路开始，忽略掉重新开始，之前的链路根据lv层级保存之前积累的数量供其父使用
        // 相等同级继续增加计数，还需判断是否有filter等需生成total，第1个也会进入这里
        else {
            hash[lv - 1] = hash[lv - 1] || 0;

            if (!__limitCache && ((position === 'relative' || position === 'absolute') && __hasContent && visibility !== 'hidden' || __cacheTotal && __cacheTotal.available || hasMask || (__blurValue > 0 || overflow !== 'visible' || mixBlendMode !== 'normal') && __hasContent && visibility !== 'hidden' || __cacheTotal && __cacheTotal.available)) {
              hash[lv - 1]++;
              needGenTotal = true;
            } else if (__hasContent && visibility !== 'hidden' || __cacheTotal && __cacheTotal.available) {
              hash[lv - 1]++;
            }
          }

        prevLv = lv;

        if (needGenTotal) {
          // 有老的直接使用，没有才重新生成，注意还需判断blur,mask,overflow
          if (!__cacheTotal || !__cacheTotal.available) {
            __cacheTotal = __config[NODE_CACHE_TOTAL$3] = genTotal(renderMode, node, lv, index, total || 0, __structs, __cacheTotal, __cache);
          } // 超限降级继续，注意img可能没有加载此时__hasContent为空所以没有__cache


          if ((!__cacheTotal || !__cacheTotal.available) && __hasContent) {
            continue;
          }

          var target = __cacheTotal;

          if (__blurValue > 0 && (!__cacheFilter || !__cacheFilter.available)) {
            target = __config[NODE_CACHE_FILTER$3] = genFilter(node, __cacheTotal, __blurValue);
          }

          if (overflow === 'hidden' && (!__cacheOverflow || !__cacheOverflow.available)) {
            target = __config[NODE_CACHE_OVERFLOW$3] = genOverflow(node, target);
          }

          if (hasMask && (!__cacheMask || !__cacheMask.available)) {
            // 等next的最后一个mask节点渲染完再生成cache，有可能next节点没有改变，这样就进不到lrd的循环了，需判断
            var needWaitIndex = void 0;
            var j = index + total;

            while (hasMask--) {
              j++;

              if (indexHash.hasOwnProperty(j)) {
                needWaitIndex = j;
              }
            }

            var isClip = node.next.isClip; // mask一定不会是0，所以可以直接判断，有则等待最后一个改变的next的mask，否则直接生成

            if (needWaitIndex) {
              maskGenHash[needWaitIndex] = {
                target: target,
                node: node,
                isClip: isClip,
                __config: __config,
                __hasContent: __hasContent
              };
            } else if (__hasContent) {
              __config[NODE_CACHE_MASK$2] = genMask(node, target, isClip);
            }
          }
        } // 如果mask有改变，则前面prev节点会存入一个标识索引，等最后一个改变的mask渲染完成后调用生成mask


        if (maskGenHash.hasOwnProperty(index)) {
          var _maskGenHash$index = maskGenHash[index],
              _target = _maskGenHash$index.target,
              _node2 = _maskGenHash$index.node,
              _isClip = _maskGenHash$index.isClip,
              _config = _maskGenHash$index.__config,
              _hasContent = _maskGenHash$index.__hasContent; // 图片未加载时无内容，无需生成会报错，其它Dom类型一律生成

          if (!(_node2 instanceof Img$1) || _hasContent) {
            _config[NODE_CACHE_MASK$2] = genMask(_node2, _target, _isClip);
          }
        }
      }
    } // 超尺寸的依旧要走无cache逻辑render


    var filterHash = {};
    var overflowHash = {};
    var blendHash = {};
    var maskStartHash = {};
    var maskEndHash = {}; // 最后先序遍历一次应用__cacheTotal即可，没有的用__cache，以及剩下的超尺寸的和Text

    var _loop2 = function _loop2(_i5, _len3) {
      var _structs$_i2 = __structs[_i5],
          node = _structs$_i2[STRUCT_NODE$1],
          total = _structs$_i2[STRUCT_TOTAL$1],
          hasMask = _structs$_i2[STRUCT_HAS_MASK$1];
      var _node$__config3 = node.__config,
          __opacity = _node$__config3[NODE_OPACITY$2],
          matrixEvent = _node$__config3[NODE_MATRIX_EVENT$2],
          __blurValue = _node$__config3[NODE_BLUR_VALUE$1],
          __limitCache = _node$__config3[NODE_LIMIT_CACHE$1],
          __cache = _node$__config3[NODE_CACHE$4],
          __cacheTotal = _node$__config3[NODE_CACHE_TOTAL$3],
          __cacheFilter = _node$__config3[NODE_CACHE_FILTER$3],
          __cacheMask = _node$__config3[NODE_CACHE_MASK$2],
          __cacheOverflow = _node$__config3[NODE_CACHE_OVERFLOW$3],
          __refreshLevel = _node$__config3[NODE_REFRESH_LV$1],
          _node$__config3$NODE_ = _node$__config3[NODE_COMPUTED_STYLE$2],
          display = _node$__config3$NODE_[DISPLAY$6],
          visibility = _node$__config3$NODE_[VISIBILITY$5],
          overflow = _node$__config3$NODE_[OVERFLOW$1],
          mixBlendMode = _node$__config3$NODE_[MIX_BLEND_MODE$3]; // text如果不可见，parent会直接跳过，不会走到这里

      if (node instanceof Text) {
        ctx.globalAlpha = __opacity;
        ctx.setTransform(matrixEvent[0], matrixEvent[1], matrixEvent[2], matrixEvent[3], matrixEvent[4], matrixEvent[5]);
        node.render(renderMode, 0, ctx, defs);
      } else {
        // 有total的可以直接绘制并跳过子节点索引
        var _target2 = __cacheOverflow || __cacheMask || __cacheFilter;

        if (!_target2) {
          _target2 = __cacheTotal && __cacheTotal.available ? __cacheTotal : null;
        } // total的尝试


        if (_target2) {
          if (display === 'none') {
            _i5 += total || 0;

            if (hasMask) {
              _i5 += hasMask;
            }

            _i4 = _i5;
            return "continue";
          }

          if (mixBlendMode === 'normal') {
            ctx.globalCompositeOperation = 'source-over';
          } else {
            ctx.globalCompositeOperation = mixBlendMode.replace(/[A-Z]/, function ($0) {
              _i4 = _i5;
              return '-' + $0.toLowerCase();
            });
          }

          if (hasMask) {
            var _j = _i5 + (total || 0) + 1;

            while (hasMask--) {
              _j += (__structs[_j][STRUCT_TOTAL$1] || 0) + 1;
            }

            _i5 = _j - 1;
          }

          _i5 += total || 0;
          Cache.draw(ctx, __opacity, matrixEvent, _target2); // total应用后记得设置回来

          ctx.globalCompositeOperation = 'source-over';
        } // 自身cache尝试
        else {
            if (maskStartHash.hasOwnProperty(_i5)) {
              ctx = maskStartHash[_i5].ctx;
            }

            var res; // 这里比较特殊，可能会有__cache但超限没被汇聚到total上，需mock出离屏对象数据

            if (__cache && __cache.available) {
              if (display === 'none') {
                _i5 += total || 0;

                if (hasMask) {
                  _i5 += hasMask;
                }

                _i4 = _i5;
                return "continue";
              }

              res = {};
              var offScreenFilter, offScreenMask, offScreenOverflow, offScreenBlend;

              if (__blurValue) {
                var c = inject.getCacheCanvas(width, height);

                if (c.ctx) {
                  offScreenFilter = {
                    ctx: ctx,
                    blur: __blurValue,
                    target: c
                  };
                  ctx = c.ctx;
                  res.offScreenFilter = offScreenFilter;
                }
              }

              if (hasMask) {
                var _j2 = _i5 + (total || 0) + 1;

                while (hasMask--) {
                  _j2 += (__structs[_j2][STRUCT_TOTAL$1] || 0) + 1;
                }

                _i5 = _j2 - 1;

                if (offScreenFilter) {
                  offScreenMask = offScreenFilter;
                } else {
                  var _c = inject.getCacheCanvas(width, height);

                  if (_c.ctx) {
                    offScreenMask = {
                      ctx: ctx,
                      target: _c
                    };
                    ctx = _c.ctx;
                  }
                }

                res.offScreenMask = offScreenMask;
              }

              if (overflow === 'hidden') {
                if (offScreenFilter || offScreenMask) {
                  offScreenOverflow = offScreenFilter || offScreenMask;
                } else {
                  var _c2 = inject.getCacheCanvas(width, height);

                  if (_c2.ctx) {
                    offScreenOverflow = {
                      ctx: ctx,
                      target: _c2
                    };
                    ctx = _c2.ctx;
                  }
                }

                res.offScreenOverflow = offScreenOverflow;
              }

              if (mixBlendMode !== 'normal') {
                if (offScreenFilter || offScreenMask || offScreenOverflow) {
                  offScreenBlend = offScreenFilter || offScreenMask || offScreenOverflow;
                } else {
                  var _c3 = inject.getCacheCanvas(width, height);

                  offScreenBlend = {
                    ctx: ctx,
                    target: _c3,
                    mixBlendMode: mixBlendMode
                  };
                  ctx = _c3.ctx;
                }

                res.offScreenBlend = offScreenBlend;
              }

              if (visibility !== 'hidden') {
                Cache.draw(ctx, __opacity, matrixEvent, __cache);
              }
            } // 无内容Xom会没有__cache且没有__limitCache，超限的会有__limitCache
            else if (__limitCache) {
                if (node instanceof Geom$1) {
                  res = node.__renderSelfData = node.__renderSelf(renderMode, __refreshLevel, ctx, defs);
                } else {
                  res = node.render(renderMode, __refreshLevel, ctx, defs);
                }

                if (display === 'none') {
                  _i5 += total || 0;

                  if (hasMask) {
                    _i5 += hasMask;
                  }

                  _i4 = _i5;
                  return "continue";
                }

                var _ref = res || {},
                    _offScreenFilter = _ref.offScreenFilter,
                    _offScreenMask = _ref.offScreenMask,
                    _offScreenOverflow = _ref.offScreenOverflow,
                    _offScreenBlend = _ref.offScreenBlend; // filter造成的离屏，需要将后续一段孩子节点区域的ctx替换，并在结束后应用结果，再替换回来


                if (_offScreenFilter) {
                  var _j3 = _i5 + (total || 0);

                  var list = filterHash[_j3] = filterHash[_j3] || []; // 多个节点可能共用最后一个孩子节点的索引，存时逆序，使得子节点首先应用filter

                  list.unshift(_offScreenFilter);
                  ctx = _offScreenFilter.target.ctx;
                } // 被遮罩的节点要为第一个遮罩和最后一个遮罩的索引打标，被遮罩的本身在一个离屏canvas，遮罩的元素在另外一个


                if (_offScreenMask) {
                  var _j4 = _i5 + (total || 0) + 1;

                  var startIndex, endIndex;

                  while (hasMask--) {
                    // 注意这里用currentStyle当前状态而不是computedStyle上次状态
                    var _structs$_j = __structs[_j4],
                        _total3 = _structs$_j[STRUCT_TOTAL$1],
                        _structs$_j$STRUCT_NO = _structs$_j[STRUCT_NODE$1].currentStyle,
                        _display = _structs$_j$STRUCT_NO[DISPLAY$6],
                        _visibility = _structs$_j$STRUCT_NO[VISIBILITY$5];

                    if (_display === 'none') {
                      _j4 += (_total3 || 0) + 1;
                      continue;
                    }

                    if (_visibility === 'hidden') {
                      _j4++;
                      continue;
                    }

                    if (startIndex) {
                      endIndex = _j4;
                    } else {
                      startIndex = endIndex = _j4;
                    }

                    _j4++;
                  }

                  var mask = inject.getCacheCanvas(width, height);
                  maskStartHash[startIndex] = mask; // 有start一定有end

                  maskEndHash[endIndex] = {
                    mask: mask,
                    offScreenMask: _offScreenMask,
                    isClip: __structs[startIndex][STRUCT_NODE$1].isClip
                  };
                  ctx = _offScreenMask.target.ctx;
                }

                if (_offScreenBlend) {
                  var _j5 = _i5 + (total || 0);

                  var _list = blendHash[_j5] = blendHash[_j5] || []; // 多个节点可能共用最后一个孩子节点的索引，存时逆序，使得子节点首先应用filter


                  _list.unshift(_offScreenBlend);

                  ctx = _offScreenBlend.target.ctx;
                } // overflow:hidden的离屏，最后孩子进行截取


                if (_offScreenOverflow) {
                  var _j6 = _i5 + (total || 0);

                  var _list2 = overflowHash[_j6] = overflowHash[_j6] || [];

                  _list2.unshift(_offScreenOverflow);

                  ctx = _offScreenOverflow.target.ctx;
                } // geom传递上述offScreen的新ctx渲染，因为自定义不可控


                if (node instanceof Geom$1) {
                  node.render(renderMode, node.__refreshLevel, ctx, defs);
                }
              } // 没内容的遮罩跳过，比如未加载的img，否则会将遮罩绘制出来
              else if (hasMask) {
                  _i5 += total || 0;
                  _i5 += hasMask;
                } // 最后一个节点检查filter，有则应用，可能有多个包含自己


            if (filterHash.hasOwnProperty(_i5)) {
              var _list3 = filterHash[_i5];

              _list3.forEach(function (offScreenFilter) {
                var target = offScreenFilter.target,
                    origin = offScreenFilter.ctx,
                    blur = offScreenFilter.blur; // 申请一个新的离屏，应用blur并绘制，如没有则降级，默认ctx.filter为'none'

                if (ctx.filter) {
                  var apply = inject.getCacheCanvas(width, height, null);
                  apply.ctx.filter = "blur(".concat(blur, "px)");
                  apply.ctx.drawImage(target.canvas, 0, 0);
                  apply.ctx.filter = 'none';
                  target.ctx.globalAlpha = 1;
                  target.ctx.setTransform(1, 0, 0, 1, 0, 0);
                  target.ctx.clearRect(0, 0, width, height);
                  target.ctx.drawImage(apply.canvas, 0, 0);
                  apply.ctx.clearRect(0, 0, width, height);
                }

                if (!maskStartHash.hasOwnProperty(_i5 + 1) && !overflowHash.hasOwnProperty(_i5) && !blendHash.hasOwnProperty(_i5)) {
                  origin.globalAlpha = 1;
                  origin.setTransform(1, 0, 0, 1, 0, 0);
                  origin.drawImage(target.canvas, 0, 0);
                  target.draw();
                  target.ctx.filter = 'none';
                  target.ctx.globalAlpha = 1;
                  target.ctx.setTransform(1, 0, 0, 1, 0, 0);
                  target.ctx.clearRect(0, 0, width, height);
                  inject.releaseCacheCanvas(target.canvas);
                  ctx = origin;
                }
              });
            } // 降级overflow在filter后面


            if (overflowHash.hasOwnProperty(_i5)) {
              var _list4 = overflowHash[_i5];

              _list4.forEach(function (offScreenOverflow) {
                var matrix = offScreenOverflow.matrix,
                    target = offScreenOverflow.target,
                    origin = offScreenOverflow.ctx,
                    x = offScreenOverflow.x,
                    y = offScreenOverflow.y,
                    offsetWidth = offScreenOverflow.offsetWidth,
                    offsetHeight = offScreenOverflow.offsetHeight;
                ctx.globalCompositeOperation = 'destination-in';
                ctx.globalAlpha = 1;
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.fillStyle = '#FFF';
                ctx.beginPath();
                ctx.rect(x, y, offsetWidth, offsetHeight);
                ctx.fill();
                ctx.closePath();
                ctx.globalCompositeOperation = 'source-over';

                if (!maskStartHash.hasOwnProperty(_i5 + 1) && !blendHash.hasOwnProperty(_i5)) {
                  origin.setTransform(1, 0, 0, 1, 0, 0);
                  origin.setTransform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);
                  origin.globalAlpha = 1;
                  origin.drawImage(target.canvas, 0, 0);
                  ctx.setTransform(1, 0, 0, 1, 0, 0);
                  ctx.clearRect(0, 0, width, height);
                  inject.releaseCacheCanvas(target.canvas);
                  ctx = origin;
                }
              });
            } // 混合模式


            if (blendHash.hasOwnProperty(_i5)) {
              var _list5 = blendHash[_i5];

              _list5.forEach(function (offScreenBlend) {
                var target = offScreenBlend.target;
                offScreenBlend.ctx.globalCompositeOperation = offScreenBlend.mixBlendMode;

                if (!maskStartHash.hasOwnProperty(_i5 + 1)) {
                  offScreenBlend.ctx.drawImage(target.canvas, 0, 0);
                  target.draw();
                  target.ctx.globalAlpha = 1;
                  target.ctx.setTransform(1, 0, 0, 1, 0, 0);
                  target.ctx.clearRect(0, 0, width, height);
                  inject.releaseCacheCanvas(target.canvas);
                  ctx = offScreenBlend.ctx;
                  ctx.globalCompositeOperation = 'source-over';
                }
              });
            } // mask在最后，因为maskEnd比节点本身索引大，是其后面兄弟


            if (maskEndHash.hasOwnProperty(_i5)) {
              var _maskEndHash$_i = maskEndHash[_i5],
                  _mask = _maskEndHash$_i.mask,
                  _offScreenMask2 = _maskEndHash$_i.offScreenMask,
                  _isClip2 = _maskEndHash$_i.isClip;

              if (_isClip2) {
                ctx = _mask.ctx;
                ctx.globalCompositeOperation = 'source-out';
                ctx.globalAlpha = 1;
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.drawImage(_offScreenMask2.target.canvas, 0, 0);

                _mask.draw(ctx);

                ctx.globalCompositeOperation = 'source-over';

                _offScreenMask2.target.ctx.clearRect(0, 0, width, height);

                inject.releaseCacheCanvas(_offScreenMask2.target.canvas);
                ctx = _offScreenMask2.ctx;
                ctx.globalAlpha = 1;
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.drawImage(_mask.canvas, 0, 0); // blendMode前面会修改主屏的，这里应用完后恢复正常

                ctx.globalCompositeOperation = 'source-over';

                _mask.draw(ctx);

                _mask.ctx.clearRect(0, 0, width, height);

                inject.releaseCacheCanvas(_mask.canvas);
              } else {
                ctx = _offScreenMask2.target.ctx;
                ctx.globalCompositeOperation = 'destination-in';
                ctx.globalAlpha = 1;
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.drawImage(_mask.canvas, 0, 0);

                _mask.draw(ctx);

                ctx.globalCompositeOperation = 'source-over';

                _mask.ctx.clearRect(0, 0, width, height);

                inject.releaseCacheCanvas(_mask.canvas);
                ctx = _offScreenMask2.ctx;
                ctx.globalAlpha = 1;
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                var _target3 = _offScreenMask2.target;
                ctx.drawImage(_target3.canvas, 0, 0); // blendMode前面会修改主屏的，这里应用完后恢复正常

                ctx.globalCompositeOperation = 'source-over';

                _target3.draw(ctx);

                _target3.ctx.clearRect(0, 0, width, height);

                inject.releaseCacheCanvas(_offScreenMask2.target.canvas);
              }
            }
          }
      }

      _i4 = _i5;
    };

    for (var _i4 = 0, _len3 = __structs.length; _i4 < _len3; _i4++) {
      var _ret2 = _loop2(_i4);

      if (_ret2 === "continue") continue;
    }
  }

  function renderCanvas(renderMode, ctx, defs, root) {
    var __structs = root.__structs,
        width = root.width,
        height = root.height;
    var filterHash = {};
    var overflowHash = {};
    var blendHash = {};
    var maskStartHash = {};
    var maskEndHash = {};

    var _loop3 = function _loop3(len, _i7) {
      var _structs$_i3 = __structs[_i7],
          node = _structs$_i3[STRUCT_NODE$1],
          total = _structs$_i3[STRUCT_TOTAL$1],
          hasMask = _structs$_i3[STRUCT_HAS_MASK$1];
      var _node$__config4 = node.__config,
          computedStyle = _node$__config4[NODE_COMPUTED_STYLE$2],
          __refreshLevel = _node$__config4[NODE_REFRESH_LV$1]; // 遮罩对象申请了个离屏，其第一个mask申请另外一个离屏，开始聚集所有mask元素的绘制

      if (maskStartHash.hasOwnProperty(_i7)) {
        ctx = maskStartHash[_i7].ctx;
      }

      var res = void 0;

      if (node instanceof Geom$1) {
        res = node.__renderSelfData = node.__renderSelf(renderMode, __refreshLevel, ctx, defs);
      } else {
        res = node.render(renderMode, __refreshLevel, ctx, defs);
      } // render后判断可见状态，此时computedStyle才有值，以及svg的virtualDom也要生成


      if (computedStyle[DISPLAY$6] === 'none') {
        _i7 += total || 0; // display:none要跳过后面的mask

        if (hasMask) {
          _i7 += hasMask;
        }

        _i6 = _i7;
        return "continue";
      }

      var _ref2 = res || {},
          offScreenFilter = _ref2.offScreenFilter,
          offScreenMask = _ref2.offScreenMask,
          offScreenOverflow = _ref2.offScreenOverflow,
          offScreenBlend = _ref2.offScreenBlend; // filter造成的离屏，需要将后续一段孩子节点区域的ctx替换，并在结束后应用结果，再替换回来


      if (offScreenFilter) {
        var j = _i7 + (total || 0);
        var list = filterHash[j] = filterHash[j] || []; // 多个节点可能共用最后一个孩子节点的索引，存时逆序，使得子节点首先应用filter

        list.unshift(offScreenFilter);
        ctx = offScreenFilter.target.ctx;
      } // 被遮罩的节点要为第一个遮罩和最后一个遮罩的索引打标，被遮罩的本身在一个离屏canvas，遮罩的元素在另外一个


      if (offScreenMask) {
        var _j7 = _i7 + (total || 0) + 1;

        var startIndex, endIndex;

        while (hasMask--) {
          // 注意这里用currentStyle当前状态而不是computedStyle上次状态
          var _structs$_j2 = __structs[_j7],
              _total4 = _structs$_j2[STRUCT_TOTAL$1],
              _structs$_j2$STRUCT_N = _structs$_j2[STRUCT_NODE$1].currentStyle,
              display = _structs$_j2$STRUCT_N[DISPLAY$6],
              visibility = _structs$_j2$STRUCT_N[VISIBILITY$5];

          if (display === 'none') {
            _j7 += (_total4 || 0) + 1;
            continue;
          }

          if (visibility === 'hidden') {
            _j7++;
            continue;
          }

          if (startIndex) {
            endIndex = _j7;
          } else {
            startIndex = endIndex = _j7;
          }

          _j7++;
        }

        var mask = inject.getCacheCanvas(width, height);
        maskStartHash[startIndex] = mask; // 有start一定有end

        maskEndHash[endIndex] = {
          mask: mask,
          offScreenMask: offScreenMask,
          isClip: __structs[startIndex][STRUCT_NODE$1].isClip
        };
        ctx = offScreenMask.target.ctx;
      }

      if (offScreenBlend) {
        var _j8 = _i7 + (total || 0);

        var _list6 = blendHash[_j8] = blendHash[_j8] || []; // 多个节点可能共用最后一个孩子节点的索引，存时逆序，使得子节点首先应用filter


        _list6.unshift(offScreenBlend);

        ctx = offScreenBlend.target.ctx;
      } // overflow:hidden的离屏，最后孩子进行截取


      if (offScreenOverflow) {
        var _j9 = _i7 + (total || 0);

        var _list7 = overflowHash[_j9] = overflowHash[_j9] || [];

        _list7.unshift(offScreenOverflow);

        ctx = offScreenOverflow.target.ctx;
      } // geom传递上述offScreen的新ctx渲染，因为自定义不可控


      if (node instanceof Geom$1) {
        node.render(renderMode, __refreshLevel, ctx, defs);
      } // 最后一个节点检查filter，有则应用，可能有多个嵌套包含自己


      if (filterHash.hasOwnProperty(_i7)) {
        var _list8 = filterHash[_i7];

        _list8.forEach(function (offScreenFilter) {
          var target = offScreenFilter.target,
              origin = offScreenFilter.ctx,
              blur = offScreenFilter.blur; // 申请一个新的离屏，应用blur并绘制，如没有则降级，默认ctx.filter为'none'

          if (ctx.filter) {
            var apply = inject.getCacheCanvas(width, height, null);
            apply.ctx.filter = "blur(".concat(blur, "px)");
            apply.ctx.drawImage(target.canvas, 0, 0);
            apply.ctx.filter = 'none';
            target.ctx.globalAlpha = 1;
            target.ctx.setTransform(1, 0, 0, 1, 0, 0);
            target.ctx.clearRect(0, 0, width, height);
            target.ctx.drawImage(apply.canvas, 0, 0);
            apply.ctx.clearRect(0, 0, width, height);
          }

          if (!maskStartHash.hasOwnProperty(_i7 + 1) && !overflowHash.hasOwnProperty(_i7) && !blendHash.hasOwnProperty(_i7)) {
            origin.setTransform(1, 0, 0, 1, 0, 0);
            origin.globalAlpha = 1;
            origin.drawImage(target.canvas, 0, 0);
            target.draw();
            target.ctx.filter = 'none';
            target.ctx.setTransform(1, 0, 0, 1, 0, 0);
            target.ctx.globalAlpha = 1;
            target.ctx.clearRect(0, 0, width, height);
            inject.releaseCacheCanvas(target.canvas);
            ctx = origin;
          }
        });
      } // overflow在filter后面


      if (overflowHash.hasOwnProperty(_i7)) {
        var _list9 = overflowHash[_i7];

        _list9.forEach(function (offScreenOverflow) {
          var matrix = offScreenOverflow.matrix,
              target = offScreenOverflow.target,
              origin = offScreenOverflow.ctx,
              x = offScreenOverflow.x,
              y = offScreenOverflow.y,
              offsetWidth = offScreenOverflow.offsetWidth,
              offsetHeight = offScreenOverflow.offsetHeight;
          ctx.globalCompositeOperation = 'destination-in';
          ctx.globalAlpha = 1;
          ctx.setTransform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);
          ctx.fillStyle = '#FFF';
          ctx.beginPath();
          ctx.rect(x, y, offsetWidth, offsetHeight);
          ctx.fill();
          ctx.closePath();
          ctx.globalCompositeOperation = 'source-over';

          if (!maskStartHash.hasOwnProperty(_i7 + 1) && !blendHash.hasOwnProperty(_i7)) {
            origin.setTransform(1, 0, 0, 1, 0, 0);
            origin.globalAlpha = 1;
            origin.drawImage(target.canvas, 0, 0);
            ctx.setTransform(1, 0, 0, 1, 0, 0); // ctx.clearRect(0, 0, width, height);
            // inject.releaseCacheCanvas(target.canvas);

            ctx = origin;
          }
        });
      } // 混合模式


      if (blendHash.hasOwnProperty(_i7)) {
        var _list10 = blendHash[_i7];

        _list10.forEach(function (offScreenBlend) {
          var target = offScreenBlend.target;
          offScreenBlend.ctx.globalCompositeOperation = offScreenBlend.mixBlendMode;

          if (!maskStartHash.hasOwnProperty(_i7 + 1)) {
            var origin = offScreenBlend.ctx;
            origin.setTransform(1, 0, 0, 1, 0, 0);
            origin.globalAlpha = 1;
            origin.drawImage(target.canvas, 0, 0);
            target.draw();
            target.ctx.globalAlpha = 1;
            target.ctx.setTransform(1, 0, 0, 1, 0, 0);
            target.ctx.clearRect(0, 0, width, height);
            inject.releaseCacheCanvas(target.canvas);
            ctx = origin;
            ctx.globalCompositeOperation = 'source-over';
          }
        });
      } // mask在最后，因为maskEnd比节点本身索引大，是其后面兄弟


      if (maskEndHash.hasOwnProperty(_i7)) {
        var _maskEndHash$_i2 = maskEndHash[_i7],
            _mask2 = _maskEndHash$_i2.mask,
            _offScreenMask3 = _maskEndHash$_i2.offScreenMask,
            isClip = _maskEndHash$_i2.isClip;

        if (isClip) {
          ctx = _mask2.ctx;
          ctx.globalCompositeOperation = 'source-out';
          ctx.globalAlpha = 1;
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.drawImage(_offScreenMask3.target.canvas, 0, 0);

          _mask2.draw(ctx);

          ctx.globalCompositeOperation = 'source-over';

          _offScreenMask3.target.ctx.clearRect(0, 0, width, height);

          inject.releaseCacheCanvas(_offScreenMask3.target.canvas);
          ctx = _offScreenMask3.ctx;
          ctx.globalAlpha = 1;
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.drawImage(_mask2.canvas, 0, 0); // blendMode前面会修改主屏的，这里应用完后恢复正常

          ctx.globalCompositeOperation = 'source-over';

          _mask2.draw(ctx);

          _mask2.ctx.clearRect(0, 0, width, height);

          inject.releaseCacheCanvas(_mask2.canvas);
        } else {
          ctx = _offScreenMask3.target.ctx;
          ctx.globalCompositeOperation = 'destination-in';
          ctx.globalAlpha = 1;
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.drawImage(_mask2.canvas, 0, 0);

          _mask2.draw(ctx);

          ctx.globalCompositeOperation = 'source-over';

          _mask2.ctx.clearRect(0, 0, width, height);

          inject.releaseCacheCanvas(_mask2.canvas);
          ctx = _offScreenMask3.ctx;
          ctx.globalAlpha = 1;
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          var target = _offScreenMask3.target;
          ctx.drawImage(target.canvas, 0, 0); // blendMode前面会修改主屏的，这里应用完后恢复正常

          ctx.globalCompositeOperation = 'source-over';
          target.draw(ctx);
          target.ctx.clearRect(0, 0, width, height);
          inject.releaseCacheCanvas(_offScreenMask3.target.canvas);
        }
      }

      _i6 = _i7;
    };

    for (var _i6 = 0, len = __structs.length; _i6 < len; _i6++) {
      var _ret3 = _loop3(len, _i6);

      if (_ret3 === "continue") continue;
    }
  }

  function renderSvg(renderMode, ctx, defs, root, isFirst) {
    var __structs = root.__structs,
        width = root.width,
        height = root.height; // mask节点很特殊，本身有matrix会影响，本身没改变但对象节点有改变也需要计算逆矩阵应用顶点

    var maskEffectHash = {};

    if (!isFirst) {
      // 先遍历一遍收集完全不变的defs，缓存起来id，随后再执行遍历渲染生成新的，避免掉重复的id
      for (var _i8 = 0, len = __structs.length; _i8 < len; _i8++) {
        var _structs$_i4 = __structs[_i8],
            node = _structs$_i4[STRUCT_NODE$1],
            total = _structs$_i4[STRUCT_TOTAL$1],
            hasMask = _structs$_i4[STRUCT_HAS_MASK$1];
        var _node$__config5 = node.__config,
            __refreshLevel = _node$__config5[NODE_REFRESH_LV$1],
            defsCache = _node$__config5[NODE_DEFS_CACHE$3]; // 只要涉及到matrix和opacity就影响mask

        var hasEffectMask = hasMask && (__refreshLevel >= REPAINT$2 || contain$2(__refreshLevel, TRANSFORM_ALL$2 | OP$1));

        if (hasEffectMask) {
          var start = _i8 + (total || 0) + 1;
          var end = start + hasMask; // mask索引遍历时处理，暂存遮罩对象的刷新lv

          maskEffectHash[end - 1] = __refreshLevel;
        } // >=REPAINT重绘生成走render()跳过这里


        if (__refreshLevel < REPAINT$2) {
          (function () {
            var hasFilter = contain$2(__refreshLevel, FT$1); // 特殊的mask判断，遮罩对象影响这个mask了，除去filter、遮罩对象无TRANSFORM变化外都可缓存

            if (maskEffectHash.hasOwnProperty(_i8)) {
              var v = maskEffectHash[_i8];

              if (!contain$2(__refreshLevel, TRANSFORM_ALL$2) && v < REPAINT$2 && !contain$2(v, TRANSFORM_ALL$2)) {
                defsCache.forEach(function (item) {
                  if (!hasFilter || item.tagName !== 'filter' || item.children[0].tagName !== 'feGaussianBlur') {
                    defs.addCache(item);
                  }
                });
              }
            } // 去除特殊的filter，普通节点或不影响的mask在<REPAINT下defs的其它都可缓存
            else {
                defsCache.forEach(function (item) {
                  if (!hasFilter || item.tagName !== 'filter' || item.children[0].tagName !== 'feGaussianBlur') {
                    defs.addCache(item);
                  }
                });
              }
          })();
        }
      }
    }

    var maskHash = {}; // 栈代替递归，存父节点的matrix/opacity，matrix为E时存null省略计算

    var parentMatrixList = [];
    var parentMatrix;
    var parentVdList = [];
    var parentVd;
    var lastLv = 0;
    var last;

    var _loop4 = function _loop4(_i10, _len4) {
      var _structs$_i5 = __structs[_i10],
          node = _structs$_i5[STRUCT_NODE$1],
          total = _structs$_i5[STRUCT_TOTAL$1],
          hasMask = _structs$_i5[STRUCT_HAS_MASK$1],
          lv = _structs$_i5[STRUCT_LV$2];
      var __config = node.__config;
      var display = node.computedStyle[DISPLAY$6];
      var __cacheTotal = __config[NODE_CACHE_TOTAL$3],
          __refreshLevel = __config[NODE_REFRESH_LV$1],
          defsCache = __config[NODE_DEFS_CACHE$3]; // 将随后的若干个mask节点范围存下来

      if (hasMask && display !== 'none') {
        var _start = _i10 + (total || 0) + 1;

        var _end = _start + hasMask; // svg限制了只能Geom单节点，不可能是Dom，所以end只有唯一


        maskHash[_end - 1] = {
          index: _i10,
          start: _start,
          end: _end,
          isClip: __structs[_start][STRUCT_NODE$1].isClip // 第一个节点是clip为准

        };
      } // lv变大说明是child，相等是sibling，变小可能是parent或另一棵子树，Root节点第一个特殊处理


      if (lv < lastLv) {
        parentMatrixList.splice(lv);
        parentMatrix = parentMatrixList[lv - 1];
        parentVdList.splice(lv);
        parentVd = parentVdList[lv - 1];
      } else if (lv > lastLv) {
        parentMatrixList.push(last.__matrix);
        var vd = last.virtualDom;
        parentVdList.push(vd);
        parentVd = vd;
      }

      var virtualDom = void 0; // svg小刷新等级时直接修改vd，这样Geom不再感知

      if (__refreshLevel < REPAINT$2 && !(node instanceof Text)) {
        __config[NODE_REFRESH_LV$1] = NONE$2;
        virtualDom = node.virtualDom; // total可以跳过所有孩子节点省略循环

        if (__cacheTotal && __cacheTotal.available) {
          _i10 += total || 0;
          virtualDom.cache = true;
        } else {
          __cacheTotal && (__cacheTotal.available = true);
          virtualDom = node.__virtualDom = util.extend({}, virtualDom); // dom要清除children缓存，geom和img无需

          if (node instanceof Dom$1 && !(node instanceof Img$1)) {
            virtualDom.children = [];
          }

          delete virtualDom.cache; // 还得判断，和img加载混在一起时，触发刷新如果display:none，则还有cacheTotal

          var _display2 = node.computedStyle[DISPLAY$6];

          if (_display2 === 'none') {
            _i10 += total || 0;
          }
        }

        var currentStyle = __config[NODE_CURRENT_STYLE$3],
            computedStyle = __config[NODE_COMPUTED_STYLE$2],
            __cacheStyle = __config[NODE_CACHE_STYLE$1];

        if (contain$2(__refreshLevel, TRANSFORM_ALL$2)) {
          var matrix = node.__calMatrix(__refreshLevel, __cacheStyle, currentStyle, computedStyle); // 恶心的v8性能优化


          var m = __config[NODE_MATRIX$1];

          if (matrix && m) {
            m[0] = matrix[0];
            m[1] = matrix[1];
            m[2] = matrix[2];
            m[3] = matrix[3];
            m[4] = matrix[4];
            m[5] = matrix[5];
          }

          if (!matrix || mx.isE(matrix)) {
            delete virtualDom.transform;
          } else {
            virtualDom.transform = 'matrix(' + util.joinArr(matrix, ',') + ')';
          }

          if (parentMatrix && matrix) {
            matrix = mx.multiply(parentMatrix, matrix);
          } // 恶心的v8性能优化


          m = __config[NODE_MATRIX_EVENT$2];

          if (m && matrix) {
            m[0] = matrix[0];
            m[1] = matrix[1];
            m[2] = matrix[2];
            m[3] = matrix[3];
            m[4] = matrix[4];
            m[5] = matrix[5];
          }
        }

        if (contain$2(__refreshLevel, OP$1)) {
          var opacity = computedStyle[OPACITY$5] = currentStyle[OPACITY$5];

          if (opacity === 1) {
            delete virtualDom.opacity;
          } else {
            virtualDom.opacity = opacity;
          }
        }

        if (contain$2(__refreshLevel, FT$1)) {
          var filter = computedStyle[FILTER$5] = currentStyle[FILTER$5];
          delete virtualDom.filter; // 移除老缓存，防止无限增长

          for (var _i11 = defsCache.length - 1; _i11 >= 0; _i11--) {
            var item = defsCache[_i11];

            if (item.tagName === 'filter' && item.children[0].tagName === 'feGaussianBlur') {
              defs.removeCache(item);
              break;
            }
          }

          if (Array.isArray(filter)) {
            filter.forEach(function (item) {
              var _item2 = _slicedToArray(item, 2),
                  k = _item2[0],
                  v = _item2[1];

              if (k === 'blur') {
                if (v > 0) {
                  var d = mx.int2convolution(v);
                  var outerWidth = node.outerWidth,
                      outerHeight = node.outerHeight;
                  var o = {
                    tagName: 'filter',
                    props: [['x', -d / outerWidth], ['y', -d / outerHeight], ['width', 1 + d * 2 / outerWidth], ['height', 1 + d * 2 / outerHeight]],
                    children: [{
                      tagName: 'feGaussianBlur',
                      props: [['stdDeviation', v]]
                    }]
                  };
                  var id = defs.add(o);

                  __config[NODE_DEFS_CACHE$3].push(o);

                  virtualDom.filter = 'url(#' + id + ')';
                }
              }
            });
          }
        }

        if (contain$2(__refreshLevel, MBM)) {
          var mixBlendMode = computedStyle[MIX_BLEND_MODE$3] = currentStyle[MIX_BLEND_MODE$3];

          if (mixBlendMode !== 'normal') {
            virtualDom.mixBlendMode = mixBlendMode;
          } else {
            delete virtualDom.mixBlendMode;
          }
        }

        virtualDom.lv = __refreshLevel;
      } else {
        // >=REPAINT会调用render，重新生成defsCache
        __config[NODE_DEFS_CACHE$3] && __config[NODE_DEFS_CACHE$3].splice(0);

        if (node instanceof Geom$1) {
          node.__renderSelfData = node.__renderSelf(renderMode, __refreshLevel, ctx, defs);
        }

        node.render(renderMode, __refreshLevel, ctx, defs);
        virtualDom = node.virtualDom;

        if (display === 'none') {
          _i10 += total || 0;

          if (hasMask) {
            _i10 += hasMask;
          }
        }
      }
      /**
       * mask会在join时过滤掉，这里将假设正常渲染的vd的内容获取出来组成defs的mask内容
       * 另外最初遍历时记录了会影响的mask，在<REPAINT时比较，>=REPAINT始终重新设置
       * 本身有matrix也需要重设
       */


      if (maskHash.hasOwnProperty(_i10) && (maskEffectHash.hasOwnProperty(_i10) || __refreshLevel >= REPAINT$2 || contain$2(__refreshLevel, TRANSFORM_ALL$2 | OP$1))) {
        var _maskHash$_i = maskHash[_i10],
            index = _maskHash$_i.index,
            _start2 = _maskHash$_i.start,
            _end2 = _maskHash$_i.end,
            isClip = _maskHash$_i.isClip;
        var target = __structs[index];
        var dom = target[STRUCT_NODE$1];
        var mChildren = []; // clip模式时，先添加兜底整个白色使得全部都可见，mask本身变反色（黑色）

        if (isClip) {
          mChildren.push({
            type: 'item',
            tagName: 'path',
            props: [['d', "M0,0L".concat(width, ",0L").concat(width, ",").concat(height, "L0,").concat(height, "L0,0")], ['fill', 'rgba(255,255,255,1)'], ['stroke-width', 0]]
          });
        }

        for (var j = _start2; j < _end2; j++) {
          var _node3 = __structs[j][STRUCT_NODE$1];
          var _node3$computedStyle = _node3.computedStyle,
              _display3 = _node3$computedStyle[DISPLAY$6],
              visibility = _node3$computedStyle[VISIBILITY$5],
              fill = _node3$computedStyle[FILL$2],
              _node3$virtualDom = _node3.virtualDom,
              children = _node3$virtualDom.children,
              _opacity = _node3$virtualDom.opacity;

          if (_display3 !== 'none' && visibility !== 'hidden') {
            // 引用相同无法diff，需要clone
            children = util.clone(children);
            mChildren = mChildren.concat(children);

            for (var k = 0, _len5 = children.length; k < _len5; k++) {
              var _children$k = children[k],
                  tagName = _children$k.tagName,
                  props = _children$k.props;

              if (tagName === 'path') {
                if (isClip) {
                  for (var _j10 = 0, _len6 = props.length; _j10 < _len6; _j10++) {
                    var _item3 = props[_j10];

                    if (_item3[0] === 'fill') {
                      _item3[1] = util.int2invert(fill[0]);
                    }
                  }
                }

                var _matrix2 = _node3.renderMatrix;
                var inverse = mx.inverse(dom.renderMatrix);
                _matrix2 = mx.multiply(inverse, _matrix2); // path没有transform属性，在vd上，需要弥补

                props.push(['transform', "matrix(".concat(_matrix2.join(','), ")")]); // path没有opacity属性，在vd上，需要弥补

                if (!util.isNil(_opacity) && _opacity !== 1) {
                  props.push(['opacity', _opacity]);
                }
              } // img可能有matrix属性，需判断
              else if (tagName === 'image') {
                  var hasTransform = -1;

                  for (var _m = 0, _len7 = props.length; _m < _len7; _m++) {
                    if (props[_m][0] === 'transform') {
                      hasTransform = _m;
                      break;
                    }
                  }

                  if (hasTransform === -1) {
                    var _inverse = mx.inverse(dom.renderMatrix);

                    if (!mx.isE(_inverse)) {
                      props.push(['transform', "matrix(".concat(_inverse.join(','), ")")]);
                    }
                  } else {
                    var _matrix3 = props[hasTransform][1].match(/[\d.]+/g).map(function (i) {
                      return parseFloat(i);
                    });

                    var _inverse2 = mx.inverse(dom.renderMatrix);

                    _matrix3 = mx.multiply(_inverse2, _matrix3);
                    props[hasTransform][1] = "matrix(".concat(_matrix3.join(','), ")");
                  }
                }
            }
          }
        } // 清掉上次的


        for (var _i12 = defsCache.length - 1; _i12 >= 0; _i12--) {
          var _item4 = defsCache[_i12];

          if (_item4.tagName === 'mask') {
            defsCache.splice(_i12, 1);
          }
        }

        var o = {
          tagName: 'mask',
          props: [],
          children: mChildren
        };
        var id = defs.add(o);
        defsCache.push(o);
        id = 'url(#' + id + ')';
        dom.virtualDom.mask = id;
      } // mask不入children


      if (parentVd && !node.isMask) {
        parentVd.children.push(virtualDom);
      }

      if (_i10 === 0) {
        parentMatrix = __config[NODE_MATRIX$1];
        parentVd = virtualDom;
      }

      lastLv = lv;
      last = node;
      _i9 = _i10;
    };

    for (var _i9 = 0, _len4 = __structs.length; _i9 < _len4; _i9++) {
      _loop4(_i9);
    }
  }

  var struct = {
    renderCacheCanvas: renderCacheCanvas,
    renderCanvas: renderCanvas,
    renderSvg: renderSvg
  };

  var _enums$STYLE_KEY$f = enums.STYLE_KEY,
      DISPLAY$7 = _enums$STYLE_KEY$f.DISPLAY,
      TOP$3 = _enums$STYLE_KEY$f.TOP,
      BOTTOM$3 = _enums$STYLE_KEY$f.BOTTOM,
      POSITION$4 = _enums$STYLE_KEY$f.POSITION,
      HEIGHT$7 = _enums$STYLE_KEY$f.HEIGHT;
  var AUTO$6 = unit.AUTO,
      PX$8 = unit.PX,
      PERCENT$8 = unit.PERCENT;
  var REFLOW$1 = o$1.REFLOW;

  function offsetAndResizeByNodeOnY(node, root, reflowHash, dy, inDirectAbsList) {
    if (dy) {
      var last;

      do {
        // component的sr没有next兄弟，视为component的next
        while (node.isShadowRoot) {
          node = node.host;
        }

        last = node;
        var isContainer = void 0,
            parent = node.domParent;

        if (parent) {
          var cs = parent.computedStyle;
          var ps = cs[POSITION$4];
          isContainer = parent === root || parent.isShadowRoot || ps === 'relative' || ps === 'absolute';
        } // 先偏移next，忽略有定位的absolute，本身非container也忽略


        var next = node.next;
        var container = void 0;

        while (next) {
          if (next.currentStyle[DISPLAY$7] !== 'none') {
            if (next.currentStyle[POSITION$4] === 'absolute') {
              var _next$currentStyle = next.currentStyle,
                  top = _next$currentStyle[TOP$3],
                  bottom = _next$currentStyle[BOTTOM$3],
                  height = _next$currentStyle[HEIGHT$7];

              if (top[1] === AUTO$6) {
                if (bottom[1] === AUTO$6 || bottom[1] === PX$8) {
                  next.__offsetY(dy, true, REFLOW$1);

                  next.__cancelCache();
                } else if (bottom[1] === PERCENT$8) {
                  var v = (1 - bottom[0] * 0.01) * dy;

                  next.__offsetY(v, true, REFLOW$1);

                  next.__cancelCache();
                }
              } else if (top[1] === PERCENT$8) {
                var _v = top[0] * 0.01 * dy;

                next.__offsetY(_v, true, REFLOW$1);

                next.__cancelCache();
              } // 高度百分比需发生变化的重新布局，需要在容器内


              if (height[1] === PERCENT$8) {
                if (isContainer) {
                  parent.__layoutAbs(parent, null, next);
                } else {
                  if (!container) {
                    container = parent;

                    while (container) {
                      if (container === root || container.isShadowRoot) {
                        break;
                      }

                      var _cs = container.currentStyle;

                      if (_cs[POSITION$4] === 'absolute' || _cs[POSITION$4] === 'relative') {
                        break;
                      }

                      container = container.domParent;
                    }
                  }

                  inDirectAbsList.push([parent, container, next]);
                }
              }
            } else {
              next.__offsetY(dy, true, REFLOW$1);

              next.__cancelCache();
            }
          }

          next = next.next;
        } // root本身没domParent


        if (!parent) {
          break;
        }

        node = parent; // parent判断是否要resize

        var _node = node,
            currentStyle = _node.currentStyle;
        var isAbs = currentStyle[POSITION$4] === 'absolute';
        var need = void 0;

        if (isAbs) {
          if (currentStyle[HEIGHT$7][1] === AUTO$6 && (currentStyle[TOP$3][1] === AUTO$6 || currentStyle[BOTTOM$3][1] === AUTO$6)) {
            need = true;
          }
        } // height不定则需要
        else if (currentStyle[HEIGHT$7][1] === AUTO$6) {
            need = true;
          }

        if (need) {
          node.__resizeY(dy, REFLOW$1);

          node.__cancelCache();
        } // abs或者高度不需要继续向上调整提前跳出
        else {
            break;
          }

        if (node === root) {
          break;
        }
      } while (true); // 最后一个递归向上取消总缓存，防止过程中重复next多次无用递归


      while (last) {
        last.__cancelCache(true);

        last = last.domParent;
      }
    }
  }

  var reflow = {
    offsetAndResizeByNodeOnY: offsetAndResizeByNodeOnY
  };

  var _DIRECTION_HASH;
  var _enums$STYLE_KEY$g = enums.STYLE_KEY,
      TOP$4 = _enums$STYLE_KEY$g.TOP,
      RIGHT$3 = _enums$STYLE_KEY$g.RIGHT,
      BOTTOM$4 = _enums$STYLE_KEY$g.BOTTOM,
      LEFT$3 = _enums$STYLE_KEY$g.LEFT,
      POSITION$5 = _enums$STYLE_KEY$g.POSITION,
      DISPLAY$8 = _enums$STYLE_KEY$g.DISPLAY,
      VISIBILITY$6 = _enums$STYLE_KEY$g.VISIBILITY,
      COLOR$5 = _enums$STYLE_KEY$g.COLOR,
      WIDTH$7 = _enums$STYLE_KEY$g.WIDTH,
      HEIGHT$8 = _enums$STYLE_KEY$g.HEIGHT,
      Z_INDEX$4 = _enums$STYLE_KEY$g.Z_INDEX,
      MARGIN_TOP$4 = _enums$STYLE_KEY$g.MARGIN_TOP,
      MARGIN_LEFT$4 = _enums$STYLE_KEY$g.MARGIN_LEFT,
      MARGIN_BOTTOM$5 = _enums$STYLE_KEY$g.MARGIN_BOTTOM,
      PADDING_TOP$5 = _enums$STYLE_KEY$g.PADDING_TOP,
      PADDING_LEFT$5 = _enums$STYLE_KEY$g.PADDING_LEFT,
      PADDING_BOTTOM$4 = _enums$STYLE_KEY$g.PADDING_BOTTOM,
      BORDER_TOP_WIDTH$5 = _enums$STYLE_KEY$g.BORDER_TOP_WIDTH,
      BORDER_LEFT_WIDTH$5 = _enums$STYLE_KEY$g.BORDER_LEFT_WIDTH,
      BORDER_BOTTOM_WIDTH$5 = _enums$STYLE_KEY$g.BORDER_BOTTOM_WIDTH,
      _enums$UPDATE_KEY$3 = enums.UPDATE_KEY,
      UPDATE_NODE$3 = _enums$UPDATE_KEY$3.UPDATE_NODE,
      UPDATE_STYLE$2 = _enums$UPDATE_KEY$3.UPDATE_STYLE,
      UPDATE_KEYS$2 = _enums$UPDATE_KEY$3.UPDATE_KEYS,
      UPDATE_COMPONENT = _enums$UPDATE_KEY$3.UPDATE_COMPONENT,
      UPDATE_FOCUS$2 = _enums$UPDATE_KEY$3.UPDATE_FOCUS,
      UPDATE_IMG$1 = _enums$UPDATE_KEY$3.UPDATE_IMG,
      UPDATE_MEASURE = _enums$UPDATE_KEY$3.UPDATE_MEASURE,
      UPDATE_OVERWRITE$1 = _enums$UPDATE_KEY$3.UPDATE_OVERWRITE,
      UPDATE_LIST = _enums$UPDATE_KEY$3.UPDATE_LIST,
      UPDATE_CONFIG$3 = _enums$UPDATE_KEY$3.UPDATE_CONFIG,
      _enums$NODE_KEY$8 = enums.NODE_KEY,
      NODE_TAG_NAME$1 = _enums$NODE_KEY$8.NODE_TAG_NAME,
      NODE_CACHE_STYLE$2 = _enums$NODE_KEY$8.NODE_CACHE_STYLE,
      NODE_CACHE_PROPS$1 = _enums$NODE_KEY$8.NODE_CACHE_PROPS,
      NODE_CURRENT_STYLE$4 = _enums$NODE_KEY$8.NODE_CURRENT_STYLE,
      NODE_COMPUTED_STYLE$3 = _enums$NODE_KEY$8.NODE_COMPUTED_STYLE,
      NODE_CURRENT_PROPS$1 = _enums$NODE_KEY$8.NODE_CURRENT_PROPS,
      NODE_DOM_PARENT$4 = _enums$NODE_KEY$8.NODE_DOM_PARENT,
      NODE_IS_MASK$3 = _enums$NODE_KEY$8.NODE_IS_MASK,
      NODE_REFRESH_LV$2 = _enums$NODE_KEY$8.NODE_REFRESH_LV,
      NODE_IS_DESTROYED$2 = _enums$NODE_KEY$8.NODE_IS_DESTROYED,
      NODE_STYLE$3 = _enums$NODE_KEY$8.NODE_STYLE,
      NODE_UPDATE_HASH = _enums$NODE_KEY$8.NODE_UPDATE_HASH,
      NODE_UNIQUE_UPDATE_ID = _enums$NODE_KEY$8.NODE_UNIQUE_UPDATE_ID,
      NODE_CACHE$5 = _enums$NODE_KEY$8.NODE_CACHE,
      NODE_CACHE_TOTAL$4 = _enums$NODE_KEY$8.NODE_CACHE_TOTAL,
      NODE_CACHE_FILTER$4 = _enums$NODE_KEY$8.NODE_CACHE_FILTER,
      NODE_CACHE_OVERFLOW$4 = _enums$NODE_KEY$8.NODE_CACHE_OVERFLOW,
      NODE_CACHE_MASK$3 = _enums$NODE_KEY$8.NODE_CACHE_MASK,
      NODE_STRUCT$4 = _enums$NODE_KEY$8.NODE_STRUCT,
      _enums$STRUCT_KEY$3 = enums.STRUCT_KEY,
      STRUCT_INDEX$3 = _enums$STRUCT_KEY$3.STRUCT_INDEX,
      STRUCT_TOTAL$2 = _enums$STRUCT_KEY$3.STRUCT_TOTAL,
      STRUCT_NODE$2 = _enums$STRUCT_KEY$3.STRUCT_NODE;
  var DIRECTION_HASH = (_DIRECTION_HASH = {}, _defineProperty(_DIRECTION_HASH, TOP$4, true), _defineProperty(_DIRECTION_HASH, RIGHT$3, true), _defineProperty(_DIRECTION_HASH, BOTTOM$4, true), _defineProperty(_DIRECTION_HASH, LEFT$3, true), _DIRECTION_HASH);
  var isNil$8 = util.isNil,
      isObject$2 = util.isObject,
      isFunction$6 = util.isFunction;
  var AUTO$7 = unit.AUTO,
      PX$9 = unit.PX,
      PERCENT$9 = unit.PERCENT,
      INHERIT$5 = unit.INHERIT;
  var calRelative$2 = css.calRelative,
      isRelativeOrAbsolute$2 = css.isRelativeOrAbsolute,
      equalStyle$1 = css.equalStyle;
  var contain$3 = o$1.contain,
      getLevel = o$1.getLevel,
      isRepaint = o$1.isRepaint,
      NONE$3 = o$1.NONE,
      FILTER$6 = o$1.FILTER,
      REPAINT$3 = o$1.REPAINT,
      REFLOW$2 = o$1.REFLOW,
      LAYOUT = o$1.LAYOUT,
      OFFSET = o$1.OFFSET;
  var isIgnore = o.isIgnore,
      isGeom$3 = o.isGeom,
      isMeasure = o.isMeasure;

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
    } else if (k === 'style') {
      return '';
    }

    return ' ' + k + '="' + util.encodeHtml(s, true) + '"';
  }

  function initEvent(dom, Root) {
    ['click', 'dblclick', 'mousedown', 'mousemove', 'mouseup', 'touchstart', 'touchmove', 'touchend', 'touchcancel'].forEach(function (type) {
      dom.addEventListener(type, function (e) {
        var root = dom.__root;

        if (root && root instanceof Root) {
          if (['touchend', 'touchcancel', 'touchmove'].indexOf(type) > -1) {
            root.__touchstartTarget && root.__touchstartTarget.__emitEvent(root.__wrapEvent(e), true);
          } else {
            root.__cb(e);
          }
        }
      });
    });
  } // 提取出对比节点尺寸是否固定非AUTO


  function isFixedWidthOrHeight(node, k) {
    var c = node.currentStyle[k];
    return c[1] !== AUTO$7;
  } // 除了固定尺寸，父级也不能是flex或变化flex


  function isFixedSize(node, includeParentFlex) {
    var res = isFixedWidthOrHeight(node, WIDTH$7) && isFixedWidthOrHeight(node, HEIGHT$8);

    if (res && includeParentFlex) {
      var parent = node.domParent;

      if (parent) {
        if (parent.currentStyle[DISPLAY$8] === 'flex' || parent.computedStyle[DISPLAY$8] === 'flex') {
          return false;
        }
      }
    }

    return res;
  }

  function isLAYOUT(node, hash) {
    return node.hasOwnProperty('__uniqueReflowId') && hash[node.__uniqueReflowId] >= LAYOUT;
  }

  function setLAYOUT(node, hash, component) {
    addLAYOUT(node, hash, component);
    hash[node.__uniqueReflowId].lv |= LAYOUT;
  }

  var __uniqueReflowId = 0;

  function addLAYOUT(node, hash, component) {
    if (!node.hasOwnProperty('__uniqueReflowId')) {
      node.__uniqueReflowId = __uniqueReflowId;
      hash[__uniqueReflowId++] = {
        node: node,
        lv: LAYOUT,
        component: component
      };
    }
  }
  /**
   * 单独提出共用检测影响的函数，从节点本身开始向上分析影响，找到最上层的影响节点设置其重新布局
   * 过程及__checkReflow中所提及的，各种情况
   * 将影响升至最近的父级节点，并添加布局标识，这样后面的深度遍历会以父级为准忽略本身
   * 如果最终是root，则返回true标识，直接整个重新开始布局
   * @returns {boolean}
   */


  function checkInfluence(root, reflowHash, node, component) {
    var target = node; // inline新老都影响，节点变为最近的父非inline

    if (node.currentStyle[DISPLAY$8] === 'inline' || node.computedStyle[DISPLAY$8] === 'inline') {
      var _parent = node.domParent;

      do {
        target = _parent; // 父到root提前跳出

        if (_parent === root) {
          return true;
        } // 父已有LAYOUT跳出防重


        if (isLAYOUT(_parent, reflowHash)) {
          return;
        } // 遇到absolute跳出，设置其布局；如果absolute不变化普通处理，如果absolute发生变化，一定会存在于列表中，不用考虑


        if (_parent.currentStyle[POSITION$5] === 'absolute' || _parent.computedStyle[POSITION$5] === 'absolute') {
          setLAYOUT(_parent, reflowHash, component);
          return;
        } // 父固定宽高跳出直接父进行LAYOUT即可，不影响上下文，但不能是flex孩子，此时固定尺寸无用


        if (isFixedSize(_parent, true)) {
          setLAYOUT(_parent, reflowHash, component);
          return;
        } // 继续向上


        _parent = _parent.domParent;
      } while (_parent && (_parent.currentStyle[DISPLAY$8] === 'inline' || _parent.computedStyle[DISPLAY$8] === 'inline')); // 结束后target至少是node的flow的parent且非inline，如果固定尺寸提前跳出


      if (isFixedSize(target, true)) {
        setLAYOUT(target, reflowHash, component);
        return;
      }
    } // 此时target指向node，如果原本是inline则是其flow的非inline父


    var parent = target.domParent;

    if (!parent) {
      return;
    } // parent有LAYOUT跳出，已被包含


    if (isLAYOUT(parent, reflowHash)) {
      return;
    } // parent是root的flex/absolute特殊处理


    if (parent === root && (parent.computedStyle[DISPLAY$8] === 'flex' || parent.currentStyle[DISPLAY$8] === 'flex' || parent.computedStyle[POSITION$5] === 'absolute' || parent.currentStyle[POSITION$5] === 'absolute')) {
      return true;
    } // 向上检查flex，如果父级中有flex，以最上层的flex视作其更改，node本身flex不进入


    var topFlex;

    do {
      // 父到root提前跳出
      if (parent === root) {
        break;
      } // 父已有LAYOUT跳出防重


      if (isLAYOUT(parent, reflowHash)) {
        return;
      } // 遇到absolute跳出，如果absolute不变化普通处理，如果absolute发生变化，一定会存在于列表中，不用考虑


      if (parent.currentStyle[POSITION$5] === 'absolute' || parent.computedStyle[POSITION$5] === 'absolute') {
        break;
      } // 父固定宽高跳出


      if (isFixedSize(parent, true)) {
        break;
      } // flex相关，包含变化或不变化


      if (parent.computedStyle[DISPLAY$8] === 'flex' || parent.currentStyle[DISPLAY$8] === 'flex') {
        topFlex = parent;
      }

      parent = parent.domParent;
    } while (parent); // 找到最上层flex，视作其更改


    if (topFlex) {
      target = topFlex;
    }

    if (target === root) {
      return true;
    } // 向上检查非固定尺寸的absolute，找到则视为其变更，上面过程中一定没有出现absolute


    while (parent) {
      // 无论新老absolute，不变化则设置，变化一定会出现在列表中
      if (parent.currentStyle[POSITION$5] === 'absolute' || parent.computedStyle[POSITION$5] === 'absolute') {
        // 固定尺寸的不用设置，需要跳出循环
        if (isFixedSize(parent)) {
          break;
        } else {
          setLAYOUT(parent, reflowHash, component);
          return;
        }
      }

      parent = parent.domParent;
    } // 向上查找了并且没提前跳出的target如果不等于自身则重新布局，自身外面设置过了


    if (target !== node) {
      setLAYOUT(target, reflowHash, component);
    }
  }

  var uniqueUpdateId = 0;

  function parseUpdate(renderMode, root, target, reflowList, measureList, cacheHash, cacheList, zHash, zList) {
    var node = target[UPDATE_NODE$3],
        style = target[UPDATE_STYLE$2],
        overwrite = target[UPDATE_OVERWRITE$1],
        focus = target[UPDATE_FOCUS$2],
        img = target[UPDATE_IMG$1],
        component = target[UPDATE_COMPONENT],
        measure = target[UPDATE_MEASURE],
        list = target[UPDATE_LIST],
        keys = target[UPDATE_KEYS$2],
        __config = target[UPDATE_CONFIG$3];

    if (__config[NODE_IS_DESTROYED$2]) {
      return;
    } // updateStyle()这样的调用需要覆盖原有样式，因为是按顺序遍历，后面的优先级自动更高不怕重复


    if (overwrite) {
      Object.assign(__config[NODE_STYLE$3], overwrite);
    } // 多次调用更新才会有list，一般没有，优化；component无需，因为多次都是它自己


    if (list && !component) {
      keys = (keys || []).slice(0); // 防止原始值被更改

      var hash = {};
      keys.forEach(function (k) {
        hash[k] = true;
      });
      list.forEach(function (item) {
        var style2 = item[UPDATE_STYLE$2],
            overwrite = item[UPDATE_OVERWRITE$1],
            keys2 = item[UPDATE_KEYS$2];
        (keys2 || []).forEach(function (k2) {
          if (!hash.hasOwnProperty(k2)) {
            hash[k2] = true;
            keys.push(k2);
          }
        });

        if (overwrite) {
          Object.assign(__config[NODE_STYLE$3], overwrite);
        }

        if (style2) {
          if (style) {
            Object.assign(style, style2);
          } else {
            style = style2;
          }
        }
      });
    } // 按节点合并完style后判断改变等级


    var tagName = __config[NODE_TAG_NAME$1],
        __cacheStyle = __config[NODE_CACHE_STYLE$2],
        __cacheProps = __config[NODE_CACHE_PROPS$1],
        currentStyle = __config[NODE_CURRENT_STYLE$4],
        computedStyle = __config[NODE_COMPUTED_STYLE$3],
        currentProps = __config[NODE_CURRENT_PROPS$1],
        domParent = __config[NODE_DOM_PARENT$4],
        isMask = __config[NODE_IS_MASK$3];
    var lv = focus || NONE$3;
    var hasMeasure = measure;
    var hasZ, hasVisibility, hasColor, hasDisplay; // component无需遍历直接赋值，img重新加载等情况没有样式更新

    if (!component && style && keys) {
      for (var i = 0, len = keys.length; i < len; i++) {
        var k = keys[i];
        var v = style[k]; // 只有geom的props和style2种可能

        if (node instanceof Geom$1 && isGeom$3(tagName, k)) {
          if (!equalStyle$1(k, v, currentProps[k], node)) {
            lv |= REPAINT$3;
            __cacheProps[k] = undefined;
            currentProps[k] = v;
          }
        } else {
          // 需和现在不等，且不是pointerEvents这种无关的
          if (!equalStyle$1(k, v, currentStyle[k], node)) {
            // pointerEvents这种无关的只需更新
            if (isIgnore(k)) {
              __cacheStyle[k] = undefined;
              currentStyle[k] = v;
            } else {
              // TRBL变化只对relative/absolute起作用，其它忽视
              if (DIRECTION_HASH.hasOwnProperty(k)) {
                var position = currentStyle[POSITION$5];

                if (position !== 'relative' && position !== 'absolute') {
                  delete style[k];
                  continue;
                }
              } else if (k === DISPLAY$8) {
                hasDisplay = true;
              } // repaint细化等级，reflow在checkReflow()


              lv |= getLevel(k);

              if (isMeasure(k)) {
                hasMeasure = true;
              } // repaint置空，如果reflow会重新生成空的


              __cacheStyle[k] = undefined;
              currentStyle[k] = v;

              if (k === Z_INDEX$4 && node !== root) {
                hasZ = true;
              }

              if (k === VISIBILITY$6) {
                hasVisibility = true;
              }

              if (k === COLOR$5) {
                hasColor = true;
              }
            }
          }
        }
      }
    } // 无任何改变处理的去除记录，如pointerEvents、无效的left


    if (lv === NONE$3 && !component) {
      delete __config[NODE_UNIQUE_UPDATE_ID];
      return;
    } // 记录下来清除parent的zIndexChildren缓存


    if (hasZ && domParent) {
      delete domParent.__zIndexChildren;
    } // visibility/color变化，影响子继承


    if (hasVisibility || hasColor) {
      for (var __structs = root.__structs, __struct = node.__config[NODE_STRUCT$4], _i = __struct[STRUCT_INDEX$3] + 1, _len = _i + __struct[STRUCT_TOTAL$2]; _i < _len; _i++) {
        var _structs$_i = __structs[_i],
            _node = _structs$_i[STRUCT_NODE$2],
            total = _structs$_i[STRUCT_TOTAL$2];
        var _config = _node.__config;
        var _currentStyle = _config[NODE_CURRENT_STYLE$4];

        var _need = void 0; // text的style指向parent，因此text一定变更


        if (hasVisibility && (_node instanceof Text || _currentStyle[VISIBILITY$6][1] === INHERIT$5)) {
          _need = true;
        }

        if (hasColor && (_node instanceof Text || _currentStyle[COLOR$5][1] === INHERIT$5)) {
          _need = true;
        }

        if (_need) {
          _config[NODE_REFRESH_LV$2] |= REPAINT$3;

          if (_node instanceof Xom) {
            _node.__cancelCache();
          }
        } else {
          _i += total || 0;
        }
      }
    } // mask需清除遮罩对象的缓存


    if (isMask) {
      var prev = node.prev;

      while (prev && prev.isMask) {
        prev = prev.prev;
      }

      if (prev && prev.__config[NODE_CACHE_MASK$3]) {
        prev.__config[NODE_CACHE_MASK$3].release();

        prev.__config[NODE_CACHE_MASK$3] = null;
      }
    } // reflow/repaint/measure相关的记录下来


    var isRp = !component && isRepaint(lv);

    if (isRp) {
      // zIndex变化需清空svg缓存
      if (hasZ && renderMode === mode.SVG) {
        lv |= REPAINT$3;
        domParent && cleanSvgCache(domParent);
      } // z改变影响struct局部重排，它的数量不会变因此不影响外围，此处先收集，最后统一对局部根节点进行更新


      if (hasZ && !component && zHash) {
        if (domParent && !domParent.hasOwnProperty('__uniqueZId')) {
          zHash[uniqueUpdateId] = true;
          domParent.__uniqueZId = uniqueUpdateId++;
          zList.push(domParent);
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
      } // 这里也需|运算，每次刷新会置0，但是如果父元素进行继承变更，会在此元素分析前更改，比如visibility，此时不能直接赋值


    __config[NODE_REFRESH_LV$2] |= lv; // dom在>=REPAINT时total失效，svg的Geom比较特殊，任何改变都失效

    var need = lv >= REPAINT$3 || renderMode === mode.SVG && node instanceof Geom$1;

    if (need) {
      if (__config[NODE_CACHE$5]) {
        __config[NODE_CACHE$5].release();
      }

      if (__config[NODE_CACHE_TOTAL$4]) {
        __config[NODE_CACHE_TOTAL$4].release();
      }

      if (__config[NODE_CACHE_MASK$3]) {
        __config[NODE_CACHE_MASK$3].release();

        __config[NODE_CACHE_MASK$3] = null;
      }

      if (__config[NODE_CACHE_OVERFLOW$4]) {
        __config[NODE_CACHE_OVERFLOW$4].release();

        __config[NODE_CACHE_OVERFLOW$4] = null;
      }
    }

    if ((need || contain$3(lv, FILTER$6)) && __config[NODE_CACHE_FILTER$4]) {
      __config[NODE_CACHE_FILTER$4].release();

      __config[NODE_CACHE_FILTER$4] = null;
    } // 由于父节点中有display:none，或本身节点也为none，执行普通动画是无效的，此时没有display变化


    if (computedStyle[DISPLAY$8] === 'none' && !hasDisplay) {
      return false;
    } // 特殊情况，父节点中有display:none，子节点进行display变更，应视为无效，直接父节点即可，因为display是继承的
    // 如果父节点由none变block，这里也return false，因为父节点会重新layout+render
    // 如果父节点由block变none，同上，所以只要current/computed里有none就return false


    var parent = domParent;

    if (hasDisplay && parent) {
      var _config2 = parent.__config;

      if (_config2[NODE_CURRENT_STYLE$4][DISPLAY$8] === 'none' || _config2[NODE_COMPUTED_STYLE$3][DISPLAY$8] === 'none') {
        computedStyle[DISPLAY$8] = 'none';
        return false;
      }
    } // 向上清除等级>=REPAINT的汇总缓存信息，过程中可能会出现重复，因此节点上记录一个临时标防止重复递归


    while (parent) {
      var _config3 = parent.__config; // 向上查找，出现重复跳出

      if (_config3.hasOwnProperty(NODE_UNIQUE_UPDATE_ID)) {
        var id = _config3[NODE_UNIQUE_UPDATE_ID];

        if (cacheHash.hasOwnProperty(id)) {
          break;
        }

        cacheHash[id] = true;
      } // 没有的需要设置一个标识
      else {
          cacheHash[uniqueUpdateId] = true;
          _config3[NODE_UNIQUE_UPDATE_ID] = uniqueUpdateId++;
          cacheList.push(parent);
        }

      var _lv = _config3[NODE_REFRESH_LV$2];

      var _need2 = _lv >= REPAINT$3;

      if (_need2 && _config3[NODE_CACHE$5]) {
        _config3[NODE_CACHE$5].release();
      } // 前面已经过滤了无改变NONE的，只要孩子有任何改变父亲就要清除


      if (_config3[NODE_CACHE_TOTAL$4]) {
        _config3[NODE_CACHE_TOTAL$4].release();
      }

      if (_config3[NODE_CACHE_FILTER$4]) {
        _config3[NODE_CACHE_FILTER$4].release();

        _config3[NODE_CACHE_FILTER$4] = null;
      }

      if (_config3[NODE_CACHE_MASK$3]) {
        _config3[NODE_CACHE_MASK$3].release();

        _config3[NODE_CACHE_MASK$3] = null;
      }

      if (_config3[NODE_CACHE_OVERFLOW$4]) {
        _config3[NODE_CACHE_OVERFLOW$4].release();

        _config3[NODE_CACHE_OVERFLOW$4] = null;
      }

      parent = _config3[NODE_DOM_PARENT$4];
    }

    return true;
  }

  function cleanSvgCache(node, child) {
    var __config = node.__config;

    if (child) {
      __config[NODE_REFRESH_LV$2] |= REPAINT$3;
    } else {
      __config[NODE_CACHE_TOTAL$4].release();
    }

    if (Array.isArray(node.children)) {
      node.children.forEach(function (child) {
        if (child instanceof Component$1) {
          child = child.shadowRoot;
        }

        if (!(child instanceof Text)) {
          cleanSvgCache(child, true);
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

      _this.__mh = 0; // this.__scx = 1; // 默认缩放，css改变canvas/svg缩放后影响事件坐标，有值手动指定，否则自动计算
      // this.__scy = 1;

      _this.__task = [];
      _this.__taskCp = [];
      _this.__ref = {};
      _this.__updateHash = {};
      _this.__reflowList = [{
        node: _assertThisInitialized(_this)
      }]; // 初始化填自己，第一次布局时复用逻辑完全重新布局

      _this.__animateController = new Controller();
      Event.mix(_assertThisInitialized(_this));
      _this.__config[NODE_UPDATE_HASH] = _this.__updateHash;
      return _this;
    }

    _createClass(Root, [{
      key: "__initProps",
      value: function __initProps() {
        var w = this.props.width;

        if (!isNil$8(w)) {
          var value = parseFloat(w) || 0;

          if (value > 0) {
            this.__width = value;
          }
        }

        var h = this.props.height;

        if (!isNil$8(h)) {
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
              top = _dom$getBoundingClien.top,
              width = _dom$getBoundingClien.width,
              height = _dom$getBoundingClien.height;

          x = x2 || left || 0;
          y = y2 || top || 0;

          var _ref = e.touches ? e.touches[0] : e,
              clientX = _ref.clientX,
              clientY = _ref.clientY;

          x = clientX - x;
          y = clientY - y; // 外边的scale影响元素事件响应，根据倍数计算真实的坐标，优先手动指定，否则自动计算

          if (!isNil$8(__scx)) {
            x /= __scx;
          } else {
            x *= this.width / width;
          }

          if (!isNil$8(__scy)) {
            y /= __scy;
          } else {
            y *= this.height / height;
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

        this.__uuid = isNil$8(this.__dom.__uuid) ? uuid$1++ : this.__dom.__uuid;
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
          initEvent(this.dom, Root);
          this.dom.__uuid = this.__uuid;
        }

        this.dom.__root = this;
      }
    }, {
      key: "refresh",
      value: function refresh(cb, isFirst) {
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
          } // 获取所有字体和大小测量，仅svg需要，canvas直接做


        inject.measureText();

        this.__checkReflow(width, height);

        if (renderMode === mode.CANVAS) {
          this.__clear(ctx); // 利用list循环代替tree递归快速渲染


          if (this.cache) {
            struct.renderCacheCanvas(renderMode, ctx, defs, this);
          } else {
            struct.renderCanvas(renderMode, ctx, defs, this);
          }
        } // svg的特殊diff需要
        else if (renderMode === mode.SVG) {
            struct.renderSvg(renderMode, ctx, defs, this, isFirst);
            var nvd = this.virtualDom;
            nvd.defs = defs.value;

            if (this.dom.__root) {
              // console.log(this.dom.__vd);
              // console.log(nvd);
              diff(this.dom, this.dom.__vd, nvd);
            } else {
              this.dom.innerHTML = util.joinVirtualDom(nvd);
            }

            this.dom.__vd = nvd;
            this.dom.__defs = defs;
          } // 特殊cb，供小程序绘制完回调使用


        if (isFunction$6(cb)) {
          cb();
        }

        this.emit(Event.REFRESH);
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this.__destroy();

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
      key: "resize",
      value: function resize(w, h, cb) {
        if (w !== this.width || h !== this.height) {
          this.__width = w;
          this.__hegiht = h;
          this.addRefreshTask(cb || function () {});
        }
      }
    }, {
      key: "addRefreshTask",
      value: function addRefreshTask(cb) {
        if (!cb) {
          return;
        }

        var task = this.task; // 第一个添加延迟侦听，后续放队列等待一并执行

        if (!task.length) {
          var clone;
          frame.nextFrame({
            __before: function __before(diff) {
              clone = task.splice(0); // 前置一般是动画计算此帧样式应用，然后刷新后出发frame事件，图片加载等同

              if (clone.length) {
                clone.forEach(function (item, i) {
                  if (isObject$2(item) && isFunction$6(item.__before)) {
                    item.__before(diff);
                  }
                });
              }
            },
            __after: function __after(diff) {
              clone.forEach(function (item) {
                if (isObject$2(item) && isFunction$6(item.__after)) {
                  item.__after(diff);
                } else if (isFunction$6(item)) {
                  item(diff);
                }
              });
            }
          });

          this.__frameHook();
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
      }
      /**
       * 为component的setState更新专门开辟个独立的流水线，root/frame中以taskCp存储更新列表
       * 普通的动画、img加载等都走普通的refresh的task，component走这里，frame中的结构同样
       * 在frame的每帧调用中，先执行普通的动画task，再执行component的task
       * 这样动画执行完后，某个cp的sr及子节点依旧先进行了动画变更，进入__addUpdate()环节
       * 然后此cp再更新sr及子节点，这样会被__addUpdate()添加到尾部，依赖目前浏览器默认实现
       * 上一行cp更新过程中是updater.check()进行的，如果有新老交换且有动画，动画的assigning是true，进行继承
       * root刷新parseUpdate()时，老的sr及子节点先进行，随后新的sr后进行且有component标识，sr子节点不会有更新
       * @param cb
       */

    }, {
      key: "addRefreshCp",
      value: function addRefreshCp(cb) {
        var _this3 = this;

        var taskCp = this.taskCp;

        if (!taskCp.length) {
          var clone;

          frame.__nextFrameCp({
            __before: function __before(diff) {
              clone = taskCp.splice(0);

              if (clone.length) {
                clone.forEach(function (item) {
                  item.__before(diff);
                });
                updater.check(_this3);
                var len = updater.updateList.length;

                if (len) {
                  updater.updateList.forEach(function (cp) {
                    var sr = cp.shadowRoot; // 可能返回text，需视为其parentNode

                    if (sr instanceof Text) {
                      sr = sr.domParent;
                    }

                    var res = {};
                    res[UPDATE_NODE$3] = sr;
                    res[UPDATE_STYLE$2] = sr.currentStyle;
                    res[UPDATE_FOCUS$2] = REFLOW$2;
                    res[UPDATE_MEASURE] = true;
                    res[UPDATE_COMPONENT] = cp;
                    res[UPDATE_CONFIG$3] = sr.__config;

                    _this3.__addUpdate(sr, sr.__config, _this3, _this3.__config, res);
                  });
                }
              }
            },
            __after: function __after(diff) {
              clone.forEach(function (item) {
                item.__after(diff);
              }); // 触发didUpdate

              updater.did();
            }
          });

          this.__frameHook();
        }

        if (taskCp.indexOf(cb) === -1) {
          taskCp.push(cb);
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

        if (['flex', 'block'].indexOf(currentStyle[DISPLAY$8]) === -1) {
          computedStyle[DISPLAY$8] = currentStyle[DISPLAY$8] = 'block';
        } // 同理position不能为absolute


        if (currentStyle[POSITION$5] === 'absolute') {
          computedStyle[POSITION$5] = currentStyle[POSITION$5] = 'static';
        } // 根节点满宽高


        currentStyle[WIDTH$7] = [width, PX$9];
        currentStyle[HEIGHT$8] = [height, PX$9];
        computedStyle[WIDTH$7] = width;
        computedStyle[HEIGHT$8] = height;
      }
      /**
       * 添加更新入口，按节点汇总更新信息
       * @private
       */

    }, {
      key: "__addUpdate",
      value: function __addUpdate(node, nodeConfig, root, rootConfig, o) {
        var updateHash = rootConfig[NODE_UPDATE_HASH]; // root特殊处理，检查变更时优先看继承信息

        if (node === root) {
          updateHash = root.__updateRoot;

          if (updateHash) {
            if (o[UPDATE_IMG$1]) {
              updateHash[UPDATE_IMG$1] = o[UPDATE_IMG$1];
            }

            if (o[UPDATE_FOCUS$2]) {
              updateHash[UPDATE_FOCUS$2] |= o[UPDATE_FOCUS$2];
            }

            if (o[UPDATE_MEASURE]) {
              updateHash[UPDATE_MEASURE] = true;
            } // 后续存在新建list上，需增加遍历逻辑


            if (o[UPDATE_STYLE$2]) {
              var _list$push;

              var list = updateHash[UPDATE_LIST] = updateHash[UPDATE_LIST] || [];
              list.push((_list$push = {}, _defineProperty(_list$push, UPDATE_STYLE$2, o[UPDATE_STYLE$2]), _defineProperty(_list$push, UPDATE_OVERWRITE$1, o[UPDATE_OVERWRITE$1]), _defineProperty(_list$push, UPDATE_KEYS$2, o[UPDATE_KEYS$2]), _list$push));
            }
          } else {
            root.__updateRoot = o;
          }
        } else if (!nodeConfig.hasOwnProperty(NODE_UNIQUE_UPDATE_ID)) {
          nodeConfig[NODE_UNIQUE_UPDATE_ID] = uniqueUpdateId; // 大多数情况节点都只有一次更新，所以优化首次直接存在style上，后续存在list

          updateHash[uniqueUpdateId++] = o;
        } else if (updateHash.hasOwnProperty(nodeConfig[NODE_UNIQUE_UPDATE_ID])) {
          var target = updateHash[nodeConfig[NODE_UNIQUE_UPDATE_ID]];

          if (o[UPDATE_IMG$1]) {
            target[UPDATE_IMG$1] = o[UPDATE_IMG$1];
          }

          if (o[UPDATE_FOCUS$2]) {
            target[UPDATE_FOCUS$2] |= o[UPDATE_FOCUS$2];
          }

          if (o[UPDATE_MEASURE]) {
            target[UPDATE_MEASURE] = true;
          } // 后续存在新建list上，需增加遍历逻辑


          if (o[UPDATE_STYLE$2]) {
            var _list$push2;

            var _list = target[UPDATE_LIST] = target[UPDATE_LIST] || [];

            _list.push((_list$push2 = {}, _defineProperty(_list$push2, UPDATE_STYLE$2, o[UPDATE_STYLE$2]), _defineProperty(_list$push2, UPDATE_OVERWRITE$1, o[UPDATE_OVERWRITE$1]), _defineProperty(_list$push2, UPDATE_KEYS$2, o[UPDATE_KEYS$2]), _list$push2));
          }
        } else {
          inject.error('Update process miss uniqueUpdateId');
        }
      }
      /**
       * 除首次外每次刷新前检查更新列表，计算样式变化，以及测量信息
       * @private
       */

    }, {
      key: "__checkUpdate",
      value: function __checkUpdate(renderMode, ctx, width, height) {
        var root = this;
        var measureList = [];
        var reflowList = [];
        var cacheHash = {};
        var cacheList = [];
        var zHash = {};
        var zList = [];
        var updateRoot = root.__updateRoot;
        var updateHash = root.__updateHash;
        var hasUpdate; // root更新特殊提前，因为有继承因素

        if (updateRoot) {
          root.__updateRoot = null;
          hasUpdate = parseUpdate(renderMode, root, updateRoot, reflowList, measureList, cacheHash, cacheList); // 此时做root检查，防止root出现继承等无效样式

          root.__checkRoot(width, height);
        } // 汇总处理每个节点，k是递增数字直接循环遍历


        var keys = Object.keys(updateHash);

        for (var i = 0, len = keys.length; i < len; i++) {
          var t = parseUpdate(renderMode, root, updateHash[keys[i]], reflowList, measureList, cacheHash, cacheList, zHash, zList);
          hasUpdate = hasUpdate || t;
        } // 先做一部分reset避免下面measureList干扰，cacheList的是专门收集新增的额外节点


        root.__reflowList = reflowList;
        uniqueUpdateId = 0;
        root.__updateHash = root.__config[NODE_UPDATE_HASH] = {};
        cacheList.forEach(function (item) {
          delete item.__config[NODE_UNIQUE_UPDATE_ID];
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
          var __uniqueUpdateId = node.__config[NODE_UNIQUE_UPDATE_ID],
              parent = node.domParent;

          if (measureHash.hasOwnProperty(__uniqueUpdateId)) {
            return;
          }

          measureHash[__uniqueUpdateId] = true;
          var last = node; // 检查measure的属性是否是inherit

          var isInherit = o.isMeasureInherit(updateHash[__uniqueUpdateId][UPDATE_STYLE$2]); // 是inherit，需要向上查找，从顶部向下递归计算继承信息

          if (isInherit) {
            while (parent && parent !== root) {
              var _parent2 = parent,
                  _uniqueUpdateId = _parent2.__config[NODE_UNIQUE_UPDATE_ID],
                  currentStyle = _parent2.currentStyle;

              var _isInherit = void 0;

              if (parent.__config.hasOwnProperty(NODE_UNIQUE_UPDATE_ID)) {
                var style = updateHash[_uniqueUpdateId][UPDATE_STYLE$2];
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
          } // 自顶向下查找inherit的，利用已有的方法+回调，当递归包含重复时标记防止重复


          last.__computeMeasure(renderMode, ctx, function (target) {
            if (target.__config.hasOwnProperty(NODE_UNIQUE_UPDATE_ID)) {
              measureHash[target.__config[NODE_UNIQUE_UPDATE_ID]] = true;
            }
          });
        }); // 做完清空留待下次刷新重来

        for (var _i2 = 0, _len2 = keys.length; _i2 < _len2; _i2++) {
          delete updateHash[keys[_i2]][UPDATE_CONFIG$3][NODE_UNIQUE_UPDATE_ID];
        }

        return hasUpdate;
      }
      /**
       * 除首次外每次刷新前检查reflow列表，计算需要reflow的节点局部重新布局
       * 当一个元素absolute不变时，其变化不会影响父元素和兄弟元素，直接自己重新局部LAYOUT包含子节点
       * 当absolute发生改变时，其变化会影响父和兄弟，视作父重新布局
       * 当inline变化时，视为其最近block/flex父变化
       * 当block变化时，往上查找最上层flex视为其变化，如不是则影响后面兄弟offset和父resize
       * 当flex变化时，往上查找最上层flex视为其变化，如不是则影响所有递归子节点layout和父resize
       * 以上3种情况向上查找时遇到absolute父均提前跳出，并标记absolute父LAYOUT
       * 上面所有情况即便结束还得额外看是否处于absolute中，是还是标记absolute重新布局
       * 当relative只变化left/top/right/bottom时，自己重新layout
       * 检测节点时记录影响的所有节点，最终形成一棵或n棵局部树
       * 需要重新布局的记作LAYOUT，被兄弟影响只需偏移的记作OFFSET，OFFSET可能会重复变为LAYOUT
       * 上述情况倘若发生包含重复，去掉子树，因子树视为被包含的重新布局
       * 如果有从root开始的，直接重新布局像首次那样即可
       * 如果非root，所有树根按先根顺序记录下来，依次执行局部布局
       * @private
       */

    }, {
      key: "__checkReflow",
      value: function __checkReflow(width, height) {
        var _this4 = this;

        var reflowList = this.__reflowList;

        if (!reflowList.length) {
          return;
        }

        var root = this;
        var hasRoot;
        __uniqueReflowId = 0;
        var reflowHash = {}; // 遍历检查发生布局改变的节点列表，此时computedStyle还是老的，currentStyle是新的

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
              lv: OFFSET,
              img: img,
              component: component
            };
          }

          var o = reflowHash[node.__uniqueReflowId]; // absolute无变化，只影响自己

          if (currentStyle[POSITION$5] === 'absolute' && computedStyle[POSITION$5] === 'absolute') {
            o.lv = LAYOUT;
          } // absolute和非absolute互换
          else if (currentStyle[POSITION$5] !== computedStyle[POSITION$5]) {
              o.lv = LAYOUT;

              if (checkInfluence(root, reflowHash, node, component)) {
                hasRoot = true;
                break;
              }
            } // 所有其它变化
            else {
                var onlyXY = true;

                if (style) {
                  var keys = Object.keys(style);

                  for (var _i3 = 0, _len3 = keys.length; _i3 < _len3; _i3++) {
                    var k = keys[_i3];

                    if (!DIRECTION_HASH.hasOwnProperty(k)) {
                      onlyXY = false;
                      break;
                    }
                  }
                } // relative只有x/y变化时特殊只进行OFFSET，非relative的忽视掉这个无用影响
                // img和component加载特殊进到这里强制LAYOUT


                if (onlyXY && !img && !component) {
                  if (computedStyle[POSITION$5] === 'relative') {
                    o.lv |= OFFSET;
                  }
                } // 剩余的其它变化
                else {
                    o.lv = LAYOUT;

                    if (checkInfluence(root, reflowHash, node, component)) {
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
          return true;
        }
        /**
         * 修剪树，自顶向下深度遍历
         * LAYOUT节点作为局部根，其递归子节点无需重复任何操作，直接去重
         * OFFSET节点作为局部根，其递归子节点先执行任何操作，后续根节点再偏移一次
         */
        else {
            var uniqueList = [];

            this.__deepScan(function (node, options) {
              if (node.hasOwnProperty('__uniqueReflowId')) {
                var _o = reflowHash[node.__uniqueReflowId]; // delete node.__uniqueReflowId; // 清除掉

                if (_o.lv >= LAYOUT) {
                  options.uniqueList.push(_o);
                } else {
                  // OFFSET的话先递归看子节点，本身改变放在最后
                  var _uniqueList = [];

                  node.__deepScan(function (child, uniqueList) {}, {
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
            });
            /**
             * 按顺序执行列表即可，上层LAYOUT先执行且停止递归子节点，上层OFFSET后执行等子节点先LAYOUT/OFFSET
             * 同级按先后顺序排列，过程中记录diff在结束后进行structs更新
             * 这里要注意margin合并的逻辑，因为最终都是block（flex等同），需要进行合并
             * 在处理一个block时，先判断是否是空block，同时看后面紧邻的有没有在uniqueList的下一个
             * 单独空block处理、2个相邻的非block处理直接可以进行判断
             * 中间的空block（即非空block的下一个是空block，且下一个不是最后一个），先记录下来list，合并后一并offset
             * 合并margin和Dom的逻辑一样，抽离共有方法
             **/


            var diffList = [];
            var diffI = 0;
            var mergeOffsetList = [];
            var __uniqueMergeOffsetId = 0;
            uniqueList.forEach(function (item) {
              var node = item.node,
                  lv = item.lv,
                  component = item.component; // 重新layout的w/h数据使用之前parent暂存的，x使用parent，y使用prev或者parent的

              if (lv >= LAYOUT) {
                var cps = node.computedStyle,
                    cts = node.currentStyle;
                var zIndex = cps[Z_INDEX$4],
                    position = cps[POSITION$5],
                    display = cps[DISPLAY$8];
                var isLastAbs = position === 'absolute';
                var isNowAbs = cts[POSITION$5] === 'absolute';
                var isLastNone = display === 'none';
                var isNowNone = cts[DISPLAY$8] === 'none'; // none不可见布局无效可以无视

                if (isLastNone && isNowNone) {
                  return;
                }

                var parent = node.domParent;
                var _parent$__layoutData = parent.__layoutData,
                    _x = _parent$__layoutData.x,
                    y = _parent$__layoutData.y,
                    h = _parent$__layoutData.h,
                    _width = parent.width,
                    _computedStyle = parent.computedStyle;
                var current = node; // cp的shadowRoot要向上到cp本身

                while (component && current.isShadowRoot) {
                  current = current.host;
                } // y使用prev或者parent的，首个节点无prev


                var ref = current.prev;

                if (ref) {
                  y = ref.y;
                  y += ref.outerHeight;
                } else {
                  y = parent.y;
                  y += _computedStyle[MARGIN_TOP$4] + _computedStyle[BORDER_TOP_WIDTH$5] + _computedStyle[PADDING_TOP$5];
                }

                _x += _computedStyle[MARGIN_LEFT$4] + _computedStyle[BORDER_LEFT_WIDTH$5] + _computedStyle[PADDING_LEFT$5]; // 找到最上层容器，如果是组件的子节点，以sr为container，sr本身往上找

                var container = node;

                if (isNowAbs) {
                  container = container.domParent;

                  while (container && container !== root) {
                    if (isRelativeOrAbsolute$2(container)) {
                      break;
                    } // 不能用domParent，必须在组件环境内


                    if (container.parent) {
                      container = container.parent;
                    } else if (container.host) {
                      break;
                    }
                  }

                  if (!container) {
                    container = root;
                  } // 由setState引发的传入component自身，layout引发的传入sr


                  if (component) {
                    parent.__layoutAbs(container, null, component);
                  } else {
                    parent.__layoutAbs(container, null, node);
                  } // 前后都是abs无需偏移后面兄弟和parent调整，component变化节点需更新struct


                  if (isLastAbs) {
                    if (component) {
                      var arr = node.__modifyStruct(root, diffI);

                      diffI += arr[1];
                      diffList.push(arr);

                      if (position !== cts[POSITION$5] && (position === 'static' || cts[POSITION$5] === 'static') || zIndex !== cts[Z_INDEX$4]) {
                        parent.__updateStruct(root.__structs);

                        if (_this4.renderMode === mode.SVG) {
                          cleanSvgCache(parent);
                        }
                      }
                    } else if (isLastNone || isNowNone) {
                      node.__zIndexChildren = null;

                      var _arr = node.__modifyStruct(root, diffI);

                      diffI += _arr[1];
                      diffList.push(_arr);
                    }

                    return;
                  } // 标识flow变abs，可能引发zIndex变更，重设struct


                  parent.__updateStruct(root.__structs);
                } // 现在是普通流，不管之前是啥直接布局
                else {
                    node.__layout({
                      x: _x,
                      y: y,
                      w: _width,
                      h: h
                    });

                    y += node.outerHeight;
                    container = container.domParent;

                    while (container && container !== root) {
                      if (isRelativeOrAbsolute$2(container)) {
                        break;
                      } // 不能用domParent，必须在组件环境内


                      if (container.parent) {
                        container = container.parent;
                      } else if (container.host) {
                        break;
                      }
                    }

                    if (!container) {
                      container = root;
                    } // 防止geom


                    if (node instanceof Dom$1) {
                      node.__layoutAbs(container, {
                        x: _x,
                        y: y,
                        w: _width,
                        h: h
                      });
                    }
                  } // 向上查找最近的parent是relative，需再次累加ox/oy，无需继续向上递归，因为parent已经递归包含了
                // 这样node重新布局后再次设置其使用parent的偏移


                var p = node;

                while (p && p !== root) {
                  p = p.domParent;
                  _computedStyle = p.computedStyle;

                  if (_computedStyle[POSITION$5] === 'relative') {
                    var _p = p,
                        ox = _p.ox,
                        oy = _p.oy;
                    ox && node.__offsetX(ox);
                    oy && node.__offsetY(oy);
                    break;
                  }
                } // 向下调整next的flow位置，遇到重复LAYOUT的跳出等待其调用并处理其next，忽视掉abs，margin和abs在merge中做


                while (node.isShadowRoot) {
                  node = node.host;
                }

                var next = node.next;

                while (next && !next.hasOwnProperty('__uniqueReflowId')) {
                  if (next.computedStyle[POSITION$5] === 'absolute') {
                    next = next.next;
                    continue;
                  }

                  var _next = next,
                      _oy = _next.y;

                  var _diff = y - _oy;

                  if (_diff) {
                    while (next && !next.hasOwnProperty('__uniqueReflowId')) {
                      var target = next;

                      if (target instanceof Component$1) {
                        target = target.shadowRoot;
                      }

                      var cs = target.computedStyle;

                      if (cs[POSITION$5] !== 'absolute' && cs[DISPLAY$8] !== 'none') {
                        target.__offsetY(_diff, true, REFLOW$2);

                        target.__cancelCache();
                      }

                      next = next.next;
                    }
                  }

                  break;
                } // 去重防止abs并记录parent，整个结束后按先序顺序进行margin合并以及偏移，


                if (!parent.hasOwnProperty('__uniqueMergeOffsetId')) {
                  parent.__uniqueMergeOffsetId = __uniqueMergeOffsetId++;
                  mergeOffsetList.push(parent);
                } // component未知dom变化，所以强制重新struct，text则为其父节点，同时防止zIndex变更影响父节点


                if (component) {
                  var _arr2 = node.__modifyStruct(root, diffI);

                  diffI += _arr2[1];
                  diffList.push(_arr2);

                  if (position !== cts[POSITION$5] && (position === 'static' || cts[POSITION$5] === 'static') || zIndex !== cts[Z_INDEX$4]) {
                    node.domParent.__updateStruct(root.__structs);

                    if (_this4.renderMode === mode.SVG) {
                      cleanSvgCache(node.domParent);
                    }
                  }
                } // display有none变化，重置struct和zIndexChildren
                else if (isLastNone || isNowNone) {
                    node.__zIndexChildren = null;

                    var _arr3 = node.__modifyStruct(root, diffI);

                    diffI += _arr3[1];
                    diffList.push(_arr3);
                  }
              } // OFFSET操作的节点都是relative，要考虑auto变化
              else {
                  var _node2 = node,
                      _node2$currentStyle = _node2.currentStyle,
                      top = _node2$currentStyle[TOP$4],
                      right = _node2$currentStyle[RIGHT$3],
                      bottom = _node2$currentStyle[BOTTOM$4],
                      left = _node2$currentStyle[LEFT$3],
                      _currentStyle2 = _node2.currentStyle,
                      _node2$computedStyle = _node2.computedStyle,
                      t = _node2$computedStyle[TOP$4],
                      r = _node2$computedStyle[RIGHT$3],
                      b = _node2$computedStyle[BOTTOM$4],
                      l = _node2$computedStyle[LEFT$3],
                      _computedStyle2 = _node2.computedStyle;

                  var _parent3;

                  if (node === _this4) {
                    _parent3 = node;
                  } else {
                    _parent3 = node.domParent;
                  }

                  var newY = 0;

                  if (top[1] !== AUTO$7) {
                    newY = calRelative$2(_currentStyle2, 'top', top, _parent3);
                    _computedStyle2[TOP$4] = newY;
                    _computedStyle2[BOTTOM$4] = 'auto';
                  } else if (bottom[1] !== AUTO$7) {
                    newY = -calRelative$2(_currentStyle2, 'bottom', bottom, _parent3);
                    _computedStyle2[BOTTOM$4] = -newY;
                    _computedStyle2[TOP$4] = 'auto';
                  } else {
                    _computedStyle2[TOP$4] = _computedStyle2[BOTTOM$4] = 'auto';
                  }

                  var oldY = 0;

                  if (t !== 'auto') {
                    oldY = t;
                  } else if (b !== 'auto') {
                    oldY = -b;
                  }

                  if (newY !== oldY) {
                    node.__offsetY(newY - oldY, false, REFLOW$2);
                  }

                  var newX = 0;

                  if (left[1] !== AUTO$7) {
                    newX = calRelative$2(_currentStyle2, 'left', left, _parent3);
                    _computedStyle2[LEFT$3] = newX;
                    _computedStyle2[RIGHT$3] = 'auto';
                  } else if (right[1] !== AUTO$7) {
                    newX = -calRelative$2(_currentStyle2, 'right', right, _parent3);
                    _computedStyle2[RIGHT$3] = -newX;
                    _computedStyle2[LEFT$3] = 'auto';
                  } else {
                    _computedStyle2[LEFT$3] = _computedStyle2[RIGHT$3] = 'auto';
                  }

                  var oldX = 0;

                  if (l !== 'auto') {
                    oldX = l;
                  } else if (r !== 'auto') {
                    oldX = -r;
                  }

                  if (newX !== oldX) {
                    node.__offsetX(newX - oldX, false, REFLOW$2);
                  }
                }
            });
            /**
             * mergeMargin后续调整，记录的是变更节点的父节点，因此每个节点内部直接遍历孩子进行
             * 由于保持先根遍历的顺序，因此会从最上最里的节点开始，先进行margin合并
             * 由于之前忽略掉abs节点，因此再检查直接abs是否要调整
             * 完成后对此父节点的后续兄弟节点进行调整，多次不会干扰影响
             * 然后继续往上循环，直到root结束
             */

            var inDirectAbsList = [];
            mergeOffsetList.forEach(function (parent) {
              delete parent.__uniqueMergeOffsetId;
              var flowChildren = parent.flowChildren,
                  absChildren = parent.absChildren;
              var mergeMarginBottomList = [],
                  mergeMarginTopList = [];
              var length = flowChildren.length,
                  lastChild;
              var isStart, startIndex; // 遍历flow孩子，从开始变化的节点开始，看变化造成的影响，对其后面节点进行偏移，并统计总偏移量

              for (var _i4 = 0; _i4 < length; _i4++) {
                var item = flowChildren[_i4];

                if (item instanceof Component$1) {
                  item = item.shadowRoot;
                }

                var isXom = item instanceof Xom; // 忽略掉前面没有变更的节点，不能合并

                if (!isStart && isXom) {
                  if (item.hasOwnProperty('__uniqueReflowId')) {
                    isStart = true;
                    startIndex = _i4;
                  }
                } // 开始变更的节点，至少不是第0个


                var _cs = isXom && item.currentStyle;

                var isInline = isXom && _cs[DISPLAY$8] === 'inline';
                lastChild = item; // 每次循环开始前，这次不是block的话，看之前遗留的，可能是以空block结束，需要特殊处理，单独一个空block也包含

                if (!isXom || isInline) {
                  if (mergeMarginBottomList.length && mergeMarginTopList.length && isStart) {
                    var _diff2 = util.getMergeMarginTB(mergeMarginTopList, mergeMarginBottomList);

                    if (_diff2) {
                      for (var j = Math.max(startIndex, _i4 - mergeMarginBottomList.length + 1); j < length; j++) {
                        flowChildren[j].__offsetY(_diff2, true, REFLOW$2);

                        flowChildren[j].__cancelCache();
                      }
                    }
                  }

                  mergeMarginTopList = [];
                  mergeMarginBottomList = [];
                } // 和普通布局类似，只是不用重新布局只需处理合并margin再根据差值偏移


                if (isXom && !isInline) {
                  var isNone = isXom && _cs[DISPLAY$8] === 'none';
                  var isEmptyBlock = void 0;

                  if (!isNone && item.flowChildren && item.flowChildren.length === 0) {
                    var _item$computedStyle = item.computedStyle,
                        marginTop = _item$computedStyle[MARGIN_TOP$4],
                        marginBottom = _item$computedStyle[MARGIN_BOTTOM$5],
                        paddingTop = _item$computedStyle[PADDING_TOP$5],
                        paddingBottom = _item$computedStyle[PADDING_BOTTOM$4],
                        _height = _item$computedStyle[HEIGHT$8],
                        borderTopWidth = _item$computedStyle[BORDER_TOP_WIDTH$5],
                        borderBottomWidth = _item$computedStyle[BORDER_BOTTOM_WIDTH$5]; // 无内容高度为0的空block特殊情况，记录2个margin下来等后续循环判断处理

                    if (paddingTop <= 0 && paddingBottom <= 0 && _height <= 0 && borderTopWidth <= 0 && borderBottomWidth <= 0) {
                      mergeMarginBottomList.push(marginBottom);
                      mergeMarginTopList.push(marginTop);
                      isEmptyBlock = true;
                    }
                  } // 空block要留下轮循环看，除非是最后一个，非空本轮处理掉看是否要合并


                  if (!isNone && !isEmptyBlock) {
                    var _item$computedStyle2 = item.computedStyle,
                        _marginTop = _item$computedStyle2[MARGIN_TOP$4],
                        _marginBottom = _item$computedStyle2[MARGIN_BOTTOM$5]; // 有bottom值说明之前有紧邻的block，任意个甚至空block，自己有个top所以无需判断top
                    // 如果是只有紧邻的2个非空block，也被包含在情况内，取上下各1合并

                    if (mergeMarginBottomList.length) {
                      mergeMarginTopList.push(_marginTop);

                      if (isStart) {
                        var _diff3 = util.getMergeMarginTB(mergeMarginTopList, mergeMarginBottomList); // 需要合并的情况，根据记录数和索引向上向下遍历节点设置偏移，同时设置总偏移量供父级使用


                        if (_diff3) {
                          for (var _j = Math.max(startIndex, _i4 - mergeMarginBottomList.length + 1); _j < length; _j++) {
                            flowChildren[_j].__offsetY(_diff3, true, REFLOW$2);

                            flowChildren[_j].__cancelCache();
                          }
                        }
                      }
                    } // 同时自己保存bottom，为后续block准备


                    mergeMarginTopList = [];
                    mergeMarginBottomList = [_marginBottom];
                  } // 最后一个空block当是正正和负负时要处理，正负在outHeight处理了结果是0，最后一个一定有不必判断isStart
                  else if (_i4 === length - 1) {
                      var _diff4 = util.getMergeMarginTB(mergeMarginTopList, mergeMarginBottomList);

                      if (_diff4) {
                        for (var _j2 = Math.max(startIndex, _i4 - mergeMarginBottomList.length + 1); _j2 < length; _j2++) {
                          flowChildren[_j2].__offsetY(_diff4, true, REFLOW$2);

                          flowChildren[_j2].__cancelCache();
                        }
                      }
                    }
                }
              } // 先检查parent的尺寸是否发生了变化，从而决定是否调整next以及向上递归调整


              var cs = parent.currentStyle;
              var height = cs[HEIGHT$8];
              var isContainer = parent === root || parent.isShadowRoot || cs[POSITION$5] === 'absolute' || cs[POSITION$5] === 'relative';

              if (height[1] === AUTO$7) {
                var oldH = parent.height + parent.computedStyle[PADDING_TOP$5];
                var nowH = lastChild.y + lastChild.outerHeight - parent.y;

                var _diff5 = nowH - oldH; // 调整next以及非固定PX的abs，再递归向上


                if (_diff5) {
                  parent.__resizeY(_diff5, REFLOW$2);

                  var container;

                  for (var _i5 = 0, _len4 = absChildren.length; _i5 < _len4; _i5++) {
                    var _item = absChildren[_i5];
                    var _item$currentStyle = _item.currentStyle,
                        top = _item$currentStyle[TOP$4],
                        bottom = _item$currentStyle[BOTTOM$4],
                        _height2 = _item$currentStyle[HEIGHT$8]; // 是容器，所有的都调整，不是容器，其偏移是上级parent的某一个，根据情况具体不同

                    if (top[1] === AUTO$7) {
                      if (bottom[1] === AUTO$7) {
                        var prev = _item.prev;

                        while (prev) {
                          var target = prev;

                          if (target instanceof Component$1) {
                            target = target.shadowRoot;
                          }

                          var _isXom = target instanceof Xom;

                          var _cs2 = _isXom && target.currentStyle;

                          var isAbs = _isXom && _cs2[POSITION$5] === 'absolute';

                          if (!isAbs) {
                            var y = target.y + target.outerHeight;
                            var d = y - _item.y;

                            if (d) {
                              _item.__offsetY(d, true, REFLOW$2);

                              _item.__cancelCache();
                            }

                            break;
                          }

                          prev = prev.prev;
                        }
                      } else if (bottom[1] === PX$9) {
                        _item.__offsetY(_diff5, true, REFLOW$2);

                        _item.__cancelCache();
                      } else if (bottom[1] === PERCENT$9) {
                        var v = (1 - bottom[0] * 0.01) * _diff5;

                        _item.__offsetY(v, true, REFLOW$2);

                        _item.__cancelCache();
                      }
                    } else if (top[1] === PERCENT$9) {
                      if (isContainer) {
                        var _v = top[0] * 0.01 * _diff5;

                        _item.__offsetY(_v, true, REFLOW$2);

                        _item.__cancelCache();
                      } // 非容器的特殊处理
                      else {
                          if (!container) {
                            container = parent.domParent;

                            while (container) {
                              if (container === root || container.isShadowRoot) {
                                break;
                              }

                              var _cs3 = container.currentStyle;

                              if (_cs3[POSITION$5] === 'absolute' || _cs3[POSITION$5] === 'relative') {
                                break;
                              }

                              container = container.domParent;
                            }
                          }

                          if (container.currentStyle[HEIGHT$8][1] !== PX$9) {
                            var _v2 = top[0] * 0.01 * _diff5;

                            _item.__offsetY(_v2, true, REFLOW$2);

                            _item.__cancelCache();
                          }
                        }
                    } // 高度百分比需发生变化的重新布局，需要在容器内


                    if (_height2[1] === PERCENT$9) {
                      if (isContainer) {
                        parent.__layoutAbs(parent, null, _item);
                      } // 不在容器内说明在上级，存入等结束后统一重新布局
                      else {
                          if (!container) {
                            container = parent.domParent;

                            while (container) {
                              if (container === root || container.isShadowRoot) {
                                break;
                              }

                              var _cs4 = container.currentStyle;

                              if (_cs4[POSITION$5] === 'absolute' || _cs4[POSITION$5] === 'relative') {
                                break;
                              }

                              container = container.domParent;
                            }
                          }

                          inDirectAbsList.push([parent, container, _item]);
                        }
                    }
                  }

                  reflow.offsetAndResizeByNodeOnY(parent, root, reflowHash, _diff5, inDirectAbsList);
                  return;
                }
              } // 没有diff变化或者固定尺寸，可能内部发生变化，调整AUTO的abs，不递归向上


              for (var _i6 = 0, _len5 = absChildren.length; _i6 < _len5; _i6++) {
                var _item2 = absChildren[_i6];
                var _item2$currentStyle = _item2.currentStyle,
                    _top = _item2$currentStyle[TOP$4],
                    _bottom = _item2$currentStyle[BOTTOM$4];

                if (_top[1] === AUTO$7 && _bottom[1] === AUTO$7) {
                  var _prev = _item2.prev;

                  while (_prev) {
                    var _target = _prev;

                    if (_target instanceof Component$1) {
                      _target = _target.shadowRoot;
                    }

                    var _isXom2 = _target instanceof Xom;

                    var _cs5 = _isXom2 && _target.currentStyle;

                    var _isAbs = _isXom2 && _cs5[POSITION$5] === 'absolute';

                    if (!_isAbs) {
                      var _y = _target.y + _target.outerHeight;

                      var _d = _y - _item2.y;

                      if (_d) {
                        _item2.__offsetY(_d, true, REFLOW$2);

                        _item2.__cancelCache();
                      }

                      break;
                    }

                    _prev = _prev.prev;
                  }
                }
              }
            }); // merge过程中需要重新布局的abs

            inDirectAbsList.forEach(function (arr) {
              arr[0].__layoutAbs(arr[1], null, arr[2]);
            }); // 调整因reflow造成的原struct数据索引数量偏差，纯zIndex的已经在repaint里面重新生成过了
            // 这里因为和update保持一致的顺序，因此一定是先根顺序且互不包含

            var diff = 0,
                lastIndex = 0,
                isFirst = true,
                structs = root.__structs;
            diffList.forEach(function (item) {
              var _item3 = _slicedToArray(item, 2),
                  ns = _item3[0],
                  d = _item3[1]; // 第一个有变化的，及后面无论有无变化都需更新
              // 第1个变化区域无需更改前面一段


              if (isFirst) {
                isFirst = false;
                lastIndex = ns[STRUCT_INDEX$3] + (ns[STRUCT_TOTAL$2] || 0) + 1;
                diff += d;
              } // 第2+个变化区域看是否和前面一个相连，有不变的段则先偏移它，然后再偏移自己
              else {
                  var j = ns[STRUCT_INDEX$3] + (ns[STRUCT_TOTAL$2] || 0) + 1 + diff;

                  for (var _i7 = lastIndex; _i7 < j; _i7++) {
                    structs[_i7][STRUCT_INDEX$3] += diff;
                  }

                  lastIndex = j;
                  diff += d;
                }
            }); // 后面的要根据偏移量校正索引

            if (diff) {
              for (var _i8 = lastIndex, _len6 = structs.length; _i8 < _len6; _i8++) {
                structs[_i8][STRUCT_INDEX$3] += diff;
              }
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
        var _this5 = this;

        if (!this.__hookTask) {
          var r = this.__hookTask = function () {
            _this5.refresh();
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
      key: "taskCp",
      get: function get() {
        return this.__taskCp;
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

  var _enums$STYLE_KEY$h = enums.STYLE_KEY,
      STROKE_WIDTH$2 = _enums$STYLE_KEY$h.STROKE_WIDTH,
      BOX_SHADOW$4 = _enums$STYLE_KEY$h.BOX_SHADOW,
      FILTER$7 = _enums$STYLE_KEY$h.FILTER;
  var isNil$9 = util.isNil;

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
        } else if (!isNil$9(props.x1)) {
          _this.__x1 = [parseFloat(props.x1) || 0];
        }

        if (Array.isArray(props.y1)) {
          _this.__y1 = props.y1.map(function (i) {
            return parseFloat(i) || 0;
          });
        } else if (!isNil$9(props.y1)) {
          _this.__y1 = [parseFloat(props.y1) || 0];
        }

        if (Array.isArray(props.x2)) {
          _this.__x2 = props.x2.map(function (i) {
            return parseFloat(i) || 0;
          });
        } else if (!isNil$9(props.x2)) {
          _this.__x2 = [parseFloat(props.x2) || 0];
        }

        if (Array.isArray(props.y2)) {
          _this.__y2 = props.y2.map(function (i) {
            return parseFloat(i) || 0;
          });
        } else if (!isNil$9(props.y2)) {
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
        } else if (!isNil$9(props.start)) {
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
        } else if (!isNil$9(props.end)) {
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

        if (!isNil$9(props.x1)) {
          _this.__x1 = parseFloat(props.x1) || 0;
        }

        if (!isNil$9(props.y1)) {
          _this.__y1 = parseFloat(props.y1) || 0;
        }

        if (!isNil$9(props.x2)) {
          _this.__x2 = parseFloat(props.x2) || 0;
        }

        if (!isNil$9(props.y2)) {
          _this.__y2 = parseFloat(props.y2) || 0;
        }

        if (!isNil$9(props.start)) {
          _this.__start = limitStartEnd(parseFloat(props.start) || 0);
        }

        if (!isNil$9(props.end)) {
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
          if (isNil$9(__cacheProps[k])) {
            rebuild = true;
            __cacheProps[k] = reBuild(_this2[k], originX, width, isMulti);
          }
        });
        ['y1', 'y2'].forEach(function (k) {
          if (isNil$9(__cacheProps[k])) {
            rebuild = true;
            __cacheProps[k] = reBuild(_this2[k], originY, height, isMulti);
          }
        });
        ['controlA', 'controlB'].forEach(function (k) {
          if (isNil$9(__cacheProps[k])) {
            rebuild = true;
            __cacheProps[k] = reBuildC(_this2[k], originX, originY, width, height, isMulti);
          }
        });
        ['start', 'end'].forEach(function (k) {
          if (isNil$9(__cacheProps[k])) {
            rebuild = true;
            __cacheProps[k] = _this2[k];
          }
        });
        return rebuild;
      }
    }, {
      key: "render",
      value: function render(renderMode, lv, ctx, defs) {
        var _this3 = this;

        var res = _get(_getPrototypeOf(Line.prototype), "render", this).call(this, renderMode, lv, ctx, defs);

        if (res["break"]) {
          return res;
        }

        var originX = res.originX,
            originY = res.originY,
            strokes = res.stroke,
            strokeWidths = res.strokeWidth,
            strokeDasharrays = res.strokeDasharray,
            strokeDasharrayStrs = res.strokeDasharrayStr,
            strokeLinecaps = res.strokeLinecap,
            strokeLinejoins = res.strokeLinejoin,
            strokeMiterlimits = res.strokeMiterlimit,
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
          strokes.forEach(function (stroke, i) {
            var strokeWidth = strokeWidths[i];
            var isStrokeRE = strokeWidth > 0 && stroke.k === 'radial' && Array.isArray(stroke.v);

            if (strokeWidth > 0 && stroke !== 'none') {
              _this3.__preSetCanvas(renderMode, ctx, {
                stroke: stroke,
                strokeWidth: strokeWidth,
                strokeDasharray: strokeDasharrays[i],
                strokeLinecap: strokeLinecaps[i],
                strokeLinejoin: strokeLinejoins[i],
                strokeMiterlimit: strokeMiterlimits[i]
              });

              if (isStrokeRE) {
                ctx.strokeStyle = stroke.v[0];
              }

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
          });
        } else if (renderMode === mode.SVG) {
          strokes.forEach(function (stroke, i) {
            var strokeWidth = strokeWidths[i];
            var isStrokeRE = strokeWidth > 0 && stroke.k === 'radial' && Array.isArray(stroke.v);
            var props = [['d', __cacheProps.d], ['fill', 'none'], ['stroke', isStrokeRE ? stroke.v[0] : stroke.v || stroke], ['stroke-width', strokeWidth]];

            _this3.__propsStrokeStyle(props, strokeDasharrayStrs[i], strokeLinecaps[i], strokeLinejoins[i], strokeMiterlimits[i]);

            _this3.addGeom('path', props);
          });
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
        var originX = this.__sx2,
            originY = this.__sy2,
            _this$currentStyle = this.currentStyle,
            strokeWidth = _this$currentStyle[STROKE_WIDTH$2],
            boxShadow = _this$currentStyle[BOX_SHADOW$4],
            filter = _this$currentStyle[FILTER$7],
            isMulti = this.isMulti,
            __cacheProps = this.__cacheProps;
        this.buildCache(originX, originY);
        var x1 = __cacheProps.x1,
            y1 = __cacheProps.y1,
            x2 = __cacheProps.x2,
            y2 = __cacheProps.y2,
            controlA = __cacheProps.controlA,
            controlB = __cacheProps.controlB;

        var bbox = _get(_getPrototypeOf(Line.prototype), "bbox", this);

        var half = 0;
        strokeWidth.forEach(function (item) {
          half = Math.max(item[0], half);
        });

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

          if ((isNil$9(ca) || ca.length < 2) && (isNil$9(cb) || cb.length < 2)) {
            bbox[0] = Math.min(bbox[0], xa - ox);
            bbox[0] = Math.min(bbox[0], xb - ox);
            bbox[1] = Math.min(bbox[1], ya - oy);
            bbox[1] = Math.min(bbox[1], yb - oy);
            bbox[2] = Math.max(bbox[2], xa + ox);
            bbox[2] = Math.max(bbox[2], xb + ox);
            bbox[3] = Math.max(bbox[3], ya + oy);
            bbox[3] = Math.max(bbox[3], yb + oy);
          } else if (isNil$9(ca) || ca.length < 2) {
            var bezierBox = geom.bboxBezier(xa, ya, cb[0], cb[1], xb, yb);
            bbox[0] = Math.min(bbox[0], bezierBox[0] - ox);
            bbox[0] = Math.min(bbox[0], bezierBox[2] - ox);
            bbox[1] = Math.min(bbox[1], bezierBox[1] - oy);
            bbox[1] = Math.min(bbox[1], bezierBox[3] - oy);
            bbox[2] = Math.max(bbox[2], bezierBox[0] + ox);
            bbox[2] = Math.max(bbox[2], bezierBox[2] + ox);
            bbox[3] = Math.max(bbox[3], bezierBox[1] + oy);
            bbox[3] = Math.max(bbox[3], bezierBox[3] + oy);
          } else if (isNil$9(cb) || cb.length < 2) {
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

  var _enums$STYLE_KEY$i = enums.STYLE_KEY,
      STROKE_WIDTH$3 = _enums$STYLE_KEY$i.STROKE_WIDTH,
      BOX_SHADOW$5 = _enums$STYLE_KEY$i.BOX_SHADOW,
      FILTER$8 = _enums$STYLE_KEY$i.FILTER;
  var isNil$a = util.isNil;

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
        } else if (!isNil$a(props.start)) {
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
        } else if (!isNil$a(props.end)) {
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

        if (!isNil$a(props.start)) {
          _this.__start = limitStartEnd$1(parseFloat(props.start) || 0);
        }

        if (!isNil$a(props.end)) {
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
        var rebuild, rebuildSE;

        if (isNil$a(__cacheProps.points)) {
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

        if (isNil$a(__cacheProps.controls)) {
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

        if (isNil$a(__cacheProps.start)) {
          rebuildSE = true;
          __cacheProps.start = start;
        }

        if (isNil$a(__cacheProps.end)) {
          rebuildSE = true;
          __cacheProps.end = end;
        } // points/controls有变化就需要重建顶点


        if (rebuild) {
          var _points = __cacheProps.points,
              _controls = __cacheProps.controls;

          if (isMulti) {
            __cacheProps.list2 = _points.filter(function (item) {
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
            __cacheProps.len = getLength(__cacheProps.list2, isMulti);
          } else {
            __cacheProps.list2 = _points.filter(function (item) {
              return Array.isArray(item);
            }).map(function (point, i) {
              if (i) {
                return concatPointAndControl(point, _controls[i - 1]);
              }

              return point;
            });
            __cacheProps.len = getLength(__cacheProps.list2, isMulti);
          }
        }

        if (rebuild || rebuildSE) {
          if (isMulti) {
            __cacheProps.list = __cacheProps.list2.map(function (item, i) {
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
            __cacheProps.list = getNewList(__cacheProps.list2, __cacheProps.len, __cacheProps.start, __cacheProps.end);
          }
        }

        return rebuild || rebuildSE;
      }
    }, {
      key: "render",
      value: function render(renderMode, lv, ctx, defs, cache) {
        var res = _get(_getPrototypeOf(Polyline.prototype), "render", this).call(this, renderMode, lv, ctx, defs, cache);

        if (res["break"]) {
          return res;
        }

        this.buildCache(res.originX, res.originY);

        this.__renderPolygon(renderMode, ctx, defs, res);

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
        var originX = this.__sx2,
            originY = this.__sy2,
            _this$currentStyle = this.currentStyle,
            strokeWidth = _this$currentStyle[STROKE_WIDTH$3],
            boxShadow = _this$currentStyle[BOX_SHADOW$5],
            filter = _this$currentStyle[FILTER$8],
            isMulti = this.isMulti,
            __cacheProps = this.__cacheProps;
        this.buildCache(originX, originY);

        var bbox = _get(_getPrototypeOf(Polyline.prototype), "bbox", this);

        var half = 0;
        strokeWidth.forEach(function (item) {
          half = Math.max(item[0], half);
        });

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
              bbox[1] = Math.min(bbox[1], ya - oy);
              bbox[2] = Math.max(bbox[2], xa + ox);
              bbox[3] = Math.max(bbox[3], ya + oy);
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

  var _enums$STYLE_KEY$j = enums.STYLE_KEY,
      STROKE_WIDTH$4 = _enums$STYLE_KEY$j.STROKE_WIDTH,
      BOX_SHADOW$6 = _enums$STYLE_KEY$j.BOX_SHADOW,
      FILTER$9 = _enums$STYLE_KEY$j.FILTER;
  var isNil$b = util.isNil;
  var sectorPoints$1 = geom.sectorPoints;

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

        if (!isNil$b(props.begin)) {
          _this.__begin = getR(props.begin, 0);
        }

        if (!isNil$b(props.end)) {
          _this.__end = getR(props.end, 0);
        }

        if (!isNil$b(props.r)) {
          _this.__r = getR(props.r, 1);
        }

        if (!isNil$b(props.edge)) {
          _this.__edge = !!props.edge;
        }

        if (!isNil$b(props.closure)) {
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

        if (isNil$b(__cacheProps.begin)) {
          rebuild = true;
          __cacheProps.begin = (begin || 0) % 360;
        }

        if (isNil$b(__cacheProps.end)) {
          rebuild = true;
          __cacheProps.end = (end || 0) % 360;
        }

        if (isNil$b(__cacheProps.r)) {
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

        if (isNil$b(__cacheProps.edge)) {
          rebuild = true;
          __cacheProps.edge = edge;
        }

        if (isNil$b(__cacheProps.closure)) {
          rebuild = true;
          __cacheProps.closure = closure;
        }

        if (rebuild) {
          if (isMulti) {
            __cacheProps.list = [];
            __cacheProps.sList = [];
            begin.forEach(function (begin, i) {
              var r2 = isNil$b(r[i]) ? width * 0.5 : r[i];
              var list = sectorPoints$1(cx, cy, r2, parseFloat(begin || 0) % 360, parseFloat(end[i] || 0) % 360);
              var sList = list.slice(0);

              if (closure[i]) {
                list.push(list[0].slice(0));

                if (edge) {
                  sList.push(sList[0].slice(0));
                }
              } else {
                list.unshift([cx, cy]);
                list.push([cx, cy]);

                if (edge) {
                  sList.unshift([cx, cy]);
                  sList.push([cx, cy]);
                }
              }

              __cacheProps.list.push(list);

              __cacheProps.sList.push(sList);
            });
          } else {
            var list = sectorPoints$1(cx, cy, r, parseFloat(begin || 0), parseFloat(end || 0));
            var sList = list.slice(0);

            if (closure) {
              list.push(list[0].slice(0));

              if (edge) {
                sList.push(sList[0].slice(0));
              }
            } else {
              list.unshift([cx, cy]);
              list.push([cx, cy]);

              if (edge) {
                sList.unshift([cx, cy]);
                sList.push([cx, cy]);
              }
            }

            __cacheProps.list = list;
            __cacheProps.sList = sList;
          }
        }

        return rebuild;
      }
    }, {
      key: "render",
      value: function render(renderMode, lv, ctx, defs, cache) {
        var res = _get(_getPrototypeOf(Sector.prototype), "render", this).call(this, renderMode, lv, ctx, defs, cache);

        if (res["break"]) {
          return res;
        }

        this.buildCache(res.cx, res.cy);
        var fills = res.fill,
            fillRules = res.fillRule,
            strokes = res.stroke,
            strokeWidths = res.strokeWidth,
            strokeDasharrays = res.strokeDasharray,
            strokeDasharrayStrs = res.strokeDasharrayStr,
            strokeLinecaps = res.strokeLinecap,
            strokeLinejoins = res.strokeLinejoin,
            strokeMiterlimits = res.strokeMiterlimit,
            dx = res.dx,
            dy = res.dy;
        var _this$__cacheProps = this.__cacheProps,
            list = _this$__cacheProps.list,
            sList = _this$__cacheProps.sList,
            isMulti = this.isMulti; // 普通情况下只有1个，按普通情况走

        if (fills.length <= 1 && strokes.length <= 1) {
          var o = {
            fill: fills[0],
            fillRule: fillRules[0],
            stroke: strokes[0],
            strokeWidth: strokeWidths[0],
            strokeDasharray: strokeDasharrays[0],
            strokeDasharrayStr: strokeDasharrayStrs[0],
            strokeLinecap: strokeLinecaps[0],
            strokeLinejoin: strokeLinejoins[0],
            strokeMiterlimit: strokeMiterlimits[0],
            dx: dx,
            dy: dy
          };

          this.__renderOneSector(renderMode, ctx, defs, isMulti, list, sList, o);
        } // 多个需要fill在下面，stroke在上面，依次循环
        else {
            for (var i = 0, len = fills.length; i < len; i++) {
              var fill = fills[i];

              if (fill) {
                var _o = {
                  fill: fill,
                  fillRule: fillRules[i],
                  dx: dx,
                  dy: dy
                };

                this.__renderOneSector(renderMode, ctx, defs, isMulti, list, sList, _o);
              }
            }

            for (var _i = 0, _len = strokes.length; _i < _len; _i++) {
              var stroke = strokes[_i];

              if (stroke) {
                var _o2 = {
                  stroke: stroke,
                  strokeWidth: strokeWidths[_i],
                  strokeDasharray: strokeDasharrays[_i],
                  strokeDasharrayStr: strokeDasharrayStrs[_i],
                  strokeLinecap: strokeLinecaps[_i],
                  strokeLinejoin: strokeLinejoins[_i],
                  strokeMiterlimit: strokeMiterlimits[_i],
                  dx: dx,
                  dy: dy
                };

                this.__renderOnePolygon(renderMode, ctx, defs, isMulti, list, sList, _o2);
              }
            }
          }

        return res;
      }
    }, {
      key: "__renderOneSector",
      value: function __renderOneSector(renderMode, ctx, defs, isMulti, list, sList, res) {
        var fill = res.fill,
            stroke = res.stroke,
            strokeWidth = res.strokeWidth;
        var isFillCE = fill.k === 'conic';
        var isStrokeCE = stroke.k === 'conic';
        var isFillRE = fill.k === 'radial' && Array.isArray(fill.v);
        var isStrokeRE = strokeWidth > 0 && stroke.k === 'radial' && Array.isArray(stroke.v);

        if (isFillCE || isStrokeCE) {
          if (isFillCE) {
            this.__conicGradient(renderMode, ctx, defs, list, isMulti, res);
          } else if (fill && fill !== 'none') {
            this.__drawPolygon(renderMode, ctx, defs, isMulti, list, res, true);
          }

          if (strokeWidth > 0 && isStrokeCE) {
            inject.warn('Stroke style can not use conic-gradient');
          } else if (strokeWidth > 0 && stroke && stroke !== 'none') {
            this.__drawPolygon(renderMode, ctx, defs, isMulti, sList, res, false, true);
          }
        } else if (isFillRE || isStrokeRE) {
          if (isFillRE) {
            this.__radialEllipse(renderMode, ctx, defs, list, isMulti, res, 'fill');
          } else if (fill && fill !== 'none') {
            this.__drawPolygon(renderMode, ctx, defs, isMulti, list, res, true);
          } // stroke椭圆渐变matrix会变形，降级为圆


          if (strokeWidth > 0 && isStrokeRE) {
            inject.warn('Stroke style can not use radial-gradient for ellipse');
            res.stroke = res.stroke.v[0];

            this.__drawPolygon(renderMode, ctx, defs, isMulti, sList, res, false, true);
          } else if (strokeWidth > 0 && stroke && stroke !== 'none') {
            this.__drawPolygon(renderMode, ctx, defs, isMulti, sList, res, false, true);
          }
        } else {
          if (fill && fill !== 'none') {
            this.__drawPolygon(renderMode, ctx, defs, isMulti, list, res, true, false);
          }

          if (stroke && stroke !== 'none') {
            this.__drawPolygon(renderMode, ctx, defs, isMulti, sList, res, false, true);
          }
        }
      }
    }, {
      key: "__genSector",
      value: function __genSector(edge, d, fill, stroke, strokeWidth, strokeDasharrayStr, strokeLinecap, strokeLinejoin, strokeMiterlimit) {
        if (edge) {
          var props = [['d', d[0]], ['fill', fill.v || fill], ['stroke', stroke.v || stroke], ['stroke-width', strokeWidth]];

          this.__propsStrokeStyle(props, strokeDasharrayStr, strokeLinecap, strokeLinejoin, strokeMiterlimit);

          this.addGeom('path', props);
        } else {
          this.addGeom('path', [['d', d[0]], ['fill', fill.v || fill]]);

          if (strokeWidth > 0) {
            var _props = [['d', d[1]], ['fill', 'none'], ['stroke', stroke.v || stroke], ['stroke-width', strokeWidth]];

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
            originX = this.__sx2,
            originY = this.__sy2,
            width = this.width,
            height = this.height,
            _this$currentStyle = this.currentStyle,
            strokeWidth = _this$currentStyle[STROKE_WIDTH$4],
            boxShadow = _this$currentStyle[BOX_SHADOW$6],
            filter = _this$currentStyle[FILTER$9];
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

        var half = 0;
        strokeWidth.forEach(function (item) {
          half = Math.max(item[0], half);
        });

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

  var _enums$STYLE_KEY$k = enums.STYLE_KEY,
      STROKE_WIDTH$5 = _enums$STYLE_KEY$k.STROKE_WIDTH,
      BOX_SHADOW$7 = _enums$STYLE_KEY$k.BOX_SHADOW,
      FILTER$a = _enums$STYLE_KEY$k.FILTER;
  var isNil$c = util.isNil;

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

        if (!isNil$c(props.rx)) {
          _this.__rx = getR$1(props.rx);
        }

        if (!isNil$c(props.ry)) {
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

        if (isNil$c(__cacheProps.rx)) {
          rebuild = true;

          if (isMulti) {
            __cacheProps.rx = rx.map(function (rx) {
              return Math.min(rx, 0.5) * width;
            });
          } else {
            __cacheProps.rx = Math.min(rx, 0.5) * width;
          }
        }

        if (isNil$c(__cacheProps.ry)) {
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
      value: function render(renderMode, lv, ctx, defs, cache) {
        var res = _get(_getPrototypeOf(Rect.prototype), "render", this).call(this, renderMode, lv, ctx, defs, cache);

        if (res["break"]) {
          return res;
        }

        this.buildCache(res.originX, res.originY);

        this.__renderPolygon(renderMode, ctx, defs, res);

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
        var originX = this.__sx2,
            originY = this.__sy2,
            width = this.width,
            height = this.height,
            _this$currentStyle = this.currentStyle,
            strokeWidth = _this$currentStyle[STROKE_WIDTH$5],
            boxShadow = _this$currentStyle[BOX_SHADOW$7],
            filter = _this$currentStyle[FILTER$a];
        this.buildCache(originX, originY);

        var bbox = _get(_getPrototypeOf(Rect.prototype), "bbox", this);

        var half = 0;
        strokeWidth.forEach(function (item) {
          half = Math.max(item[0], half);
        });

        var _this$__spreadByBoxSh = this.__spreadByBoxShadowAndFilter(boxShadow, filter),
            _this$__spreadByBoxSh2 = _slicedToArray(_this$__spreadByBoxSh, 2),
            ox = _this$__spreadByBoxSh2[0],
            oy = _this$__spreadByBoxSh2[1];

        ox += half;
        oy += half;
        bbox[0] = Math.min(bbox[0], originX - ox);
        bbox[1] = Math.min(bbox[1], originY - oy);
        bbox[2] = Math.max(bbox[2], originX + width + ox);
        bbox[3] = Math.max(bbox[3], originY + height + oy);
        return bbox;
      }
    }]);

    return Rect;
  }(Geom$1);

  var _enums$STYLE_KEY$l = enums.STYLE_KEY,
      STROKE_WIDTH$6 = _enums$STYLE_KEY$l.STROKE_WIDTH,
      BOX_SHADOW$8 = _enums$STYLE_KEY$l.BOX_SHADOW,
      FILTER$b = _enums$STYLE_KEY$l.FILTER;
  var isNil$d = util.isNil;

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
        } else if (!isNil$d(props.r)) {
          _this.__r = getR$2(props.r);
        }
      } else {
        _this.__r = 1;

        if (!isNil$d(props.r)) {
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

        if (isNil$d(__cacheProps.r)) {
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
      value: function render(renderMode, lv, ctx, defs, cache) {
        var res = _get(_getPrototypeOf(Circle.prototype), "render", this).call(this, renderMode, lv, ctx, defs, cache);

        if (res["break"]) {
          return res;
        }

        this.buildCache(res.cx, res.cy);

        this.__renderPolygon(renderMode, ctx, defs, res);

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
            originX = this.__sx3,
            originY = this.__sy3,
            width = this.width,
            height = this.height,
            _this$currentStyle = this.currentStyle,
            strokeWidth = _this$currentStyle[STROKE_WIDTH$6],
            boxShadow = _this$currentStyle[BOX_SHADOW$8],
            filter = _this$currentStyle[FILTER$b];
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

        var half = 0;
        strokeWidth.forEach(function (item) {
          half = Math.max(item[0], half);
        });

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

  var _enums$STYLE_KEY$m = enums.STYLE_KEY,
      STROKE_WIDTH$7 = _enums$STYLE_KEY$m.STROKE_WIDTH,
      BOX_SHADOW$9 = _enums$STYLE_KEY$m.BOX_SHADOW,
      FILTER$c = _enums$STYLE_KEY$m.FILTER;
  var isNil$e = util.isNil;

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
        } else if (!isNil$e(props.rx)) {
          _this.__rx = [getR$3(props.rx)];
        }

        if (Array.isArray(props.ry)) {
          _this.__ry = props.ry.map(function (i) {
            return getR$3(i);
          });
        } else if (!isNil$e(props.ry)) {
          _this.__ry = [getR$3(props.ry)];
        }
      } else {
        _this.__rx = 1;

        if (!isNil$e(props.rx)) {
          _this.__rx = getR$3(props.rx);
        }

        _this.__ry = 1;

        if (!isNil$e(props.ry)) {
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

        if (isNil$e(__cacheProps.rx)) {
          rebuild = true;

          if (isMulti) {
            __cacheProps.rx = rx.map(function (i) {
              return i * width * 0.5;
            });
          } else {
            __cacheProps.rx = rx * width * 0.5;
          }
        }

        if (isNil$e(__cacheProps.ry)) {
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
      value: function render(renderMode, lv, ctx, defs, cache) {
        var res = _get(_getPrototypeOf(Ellipse.prototype), "render", this).call(this, renderMode, lv, ctx, defs, cache);

        if (res["break"]) {
          return res;
        }

        this.buildCache(res.cx, res.cy);

        this.__renderPolygon(renderMode, ctx, defs, res);

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
            originX = this.__sx2,
            originY = this.__sy2,
            width = this.width,
            height = this.height,
            _this$currentStyle = this.currentStyle,
            strokeWidth = _this$currentStyle[STROKE_WIDTH$7],
            boxShadow = _this$currentStyle[BOX_SHADOW$9],
            filter = _this$currentStyle[FILTER$c];
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

        var half = 0;
        strokeWidth.forEach(function (item) {
          half = Math.max(item[0], half);
        });

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
    boxShadow: 'bd',
    overflow: 'of',
    backgroundClip: 'bp'
  };
  var abbrCssProperty = {};
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
  reset.DOM_KEY_SET.concat(reset.GEOM_KEY_SET).forEach(function (k) {
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
  var isNil$f = util.isNil,
      isFunction$7 = util.isFunction,
      isPrimitive = util.isPrimitive,
      clone$4 = util.clone,
      extend$2 = util.extend;
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
                  inject.error('parseJson vars is not exist: ' + v.id + ', ' + k + ', ' + list.slice(0, i).join('.'));
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
   * 即便library中的元素有children或library，在linkChild时将其link过去，parse递归会继续处理
   * @param item：library的一级孩子
   * @param hash：存放library的key/value引用
   */


  function linkLibrary(item, hash) {
    var id = item.id; // library中一定有id，因为是一级，二级+特殊需求才会出现放开

    if (isNil$f(id)) {
      throw new Error('Library item miss id: ' + JSON.stringify(item));
    } else {
      hash[id] = item;
    }
  }
  /**
   * 链接child到library文件，
   * props需要是clone的，因为防止多个child使用同一个库文件
   * children则直接引用，无需担心多个使用同一个
   * library也需要带上，在library直接子元素还包含library时会用到
   * @param child
   * @param libraryItem
   */


  function linkChild(child, libraryItem) {
    // 规定图层child只有init和动画，属性和子图层来自库
    child.tagName = libraryItem.tagName;
    child.props = clone$4(libraryItem.props);
    child.children = libraryItem.children;
    child.library = libraryItem.library; // library的var-也要继承过来，本身的var-优先级更高，目前只有children会出现优先级情况

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
      extend$2(props, init); // style特殊处理，防止被上面覆盖丢失原始值

      if (style) {
        extend$2(style, init.style);
        props.style = style;
      } // 删除以免二次解析


      child.init = null;
    }
  }

  function parse(karas, json, animateRecords, vars) {
    var hash = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

    if (isPrimitive(json) || json instanceof Node || json instanceof Component$1) {
      return json;
    }

    if (Array.isArray(json)) {
      return json.map(function (item) {
        return parse(karas, item, animateRecords, vars, hash);
      });
    } // 先判断是否是个链接到库的节点，是则进行链接操作


    var libraryId = json.libraryId;

    if (!isNil$f(libraryId)) {
      var libraryItem = hash[libraryId]; // 规定图层child只有init和动画，tagName和属性和子图层来自库

      if (libraryItem) {
        linkChild(json, libraryItem);
      } else {
        throw new Error('Link library miss id: ' + libraryId);
      }

      json.libraryId = null;
    } // 再判断是否有library形成一个新的作用域，会出现library下的library使得一个链接节点链接后出现library的情况


    var library = json.library;

    if (Array.isArray(library)) {
      hash = {};
      library.forEach(function (item) {
        linkLibrary(item, hash);
      });
      json.library = null;
    }

    var tagName = json.tagName,
        _json$props = json.props,
        props = _json$props === void 0 ? {} : _json$props,
        _json$children = json.children,
        children = _json$children === void 0 ? [] : _json$children,
        _json$animate = json.animate,
        animate = _json$animate === void 0 ? [] : _json$animate;

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
    } else if (/^[A-Z]/.test(tagName)) {
      var cp = Component$1.getRegister(tagName);
      vd = karas.createCp(cp, props, children.map(function (item) {
        if (item && [TYPE_VD$3, TYPE_GM$3, TYPE_CP$3].indexOf(item.$$type) > -1) {
          return item;
        }

        return parse(karas, item, animateRecords, vars, hash);
      }));
    } else {
      vd = karas.createVd(tagName, props, children.map(function (item) {
        if (item && [TYPE_VD$3, TYPE_GM$3, TYPE_CP$3].indexOf(item.$$type) > -1) {
          return item;
        }

        return parse(karas, item, animateRecords, vars, hash);
      }));
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

  var version = "0.52.0";

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
    Img: Img$1,
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
    refresh: refresh,
    enums: enums
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
