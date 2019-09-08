(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/geom/Geom.js":
/*!**************************!*\
  !*** ./src/geom/Geom.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_Node__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node/Node */ "./src/node/Node.js");
/* harmony import */ var _style_reset__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../style/reset */ "./src/style/reset.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../util */ "./src/util.js");
/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../style/css */ "./src/style/css.js");
/* harmony import */ var _style_unit__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../style/unit */ "./src/style/unit.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }






var TAG_NAME = {
  'line': true,
  'curve': true
};

var Geom =
/*#__PURE__*/
function (_Node) {
  _inherits(Geom, _Node);

  function Geom(props) {
    var _this;

    _classCallCheck(this, Geom);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Geom).call(this, props));
    _this.__style = {}; // style被解析后的k-v形式

    return _this;
  }

  _createClass(Geom, [{
    key: "__initStyle",
    value: function __initStyle() {
      var style = this.style; // 图形强制block

      Object.assign(style, _style_reset__WEBPACK_IMPORTED_MODULE_1__["default"], this.props.style, {
        display: 'block'
      });
      _style_css__WEBPACK_IMPORTED_MODULE_3__["default"].normalize(style);
    }
  }, {
    key: "__preLay",
    value: function __preLay(data) {
      var x = data.x,
          y = data.y,
          w = data.w,
          h = data.h;
      var style = this.style;
      var width = style.width,
          height = style.height;
      this.__x = x;
      this.__y = y;

      if (width.unit === _style_unit__WEBPACK_IMPORTED_MODULE_4__["default"].PERCENT) {
        this.__width = Math.ceil(width.value * h);
      } else if (width.unit === _style_unit__WEBPACK_IMPORTED_MODULE_4__["default"].PX) {
        this.__width = width.value;
      } else {
        this.__width = w;
      }

      if (height.unit === _style_unit__WEBPACK_IMPORTED_MODULE_4__["default"].PERCENT) {
        this.__height = Math.ceil(height.value * h);
      } else if (height.unit === _style_unit__WEBPACK_IMPORTED_MODULE_4__["default"].PX) {
        this.__height = height.value;
      } else {
        this.__height = h;
      }
    }
  }, {
    key: "style",
    get: function get() {
      return this.__style;
    }
  }], [{
    key: "isValid",
    value: function isValid(s) {
      return TAG_NAME.hasOwnProperty(s);
    }
  }]);

  return Geom;
}(_node_Node__WEBPACK_IMPORTED_MODULE_0__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (Geom);

/***/ }),

/***/ "./src/geom/Line.js":
/*!**************************!*\
  !*** ./src/geom/Line.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Geom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Geom */ "./src/geom/Geom.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util */ "./src/util.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }




var Line =
/*#__PURE__*/
function (_Geom) {
  _inherits(Line, _Geom);

  function Line(props) {
    _classCallCheck(this, Line);

    return _possibleConstructorReturn(this, _getPrototypeOf(Line).call(this, props));
  }

  _createClass(Line, [{
    key: "render",
    value: function render() {
      var x = this.x,
          y = this.y,
          width = this.width,
          height = this.height,
          props = this.props,
          ctx = this.ctx;
      var max = props.max,
          min = props.min,
          data = props.data;
      ctx.strokeStyle = '#333333';
      ctx.lineWidth = 1;

      if (_util__WEBPACK_IMPORTED_MODULE_1__["default"].isNil(max)) {
        max = data[0];
        data.forEach(function (item) {
          max = Math.max(item, max);
        });
      }

      if (_util__WEBPACK_IMPORTED_MODULE_1__["default"].isNil(min)) {
        min = data[0];
        data.forEach(function (item) {
          min = Math.min(item, min);
        });
      }

      if (max < min) {
        throw new Error('max can not less than min');
      }

      var stepX = width / (data.length - 1);
      var stepY = height / (max - min);

      if (max === min) {
        stepY = height;
      }

      var coords = [];
      data.forEach(function (item, i) {
        var diff = item - min;
        var rx = i * stepX;
        var ry = height - diff * stepY;
        coords.push([rx, ry + y]);
      });
      var first = coords[0];
      ctx.beginPath();
      ctx.moveTo(first[0], first[1]);

      for (var i = 1; i < coords.length; i++) {
        var item = coords[i];
        ctx.lineTo(item[0], item[1]);
      }

      ctx.stroke();
      ctx.closePath();
    }
  }]);

  return Line;
}(_Geom__WEBPACK_IMPORTED_MODULE_0__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (Line);

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_Dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node/Dom */ "./src/node/Dom.js");
/* harmony import */ var _node_Canvas__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node/Canvas */ "./src/node/Canvas.js");
/* harmony import */ var _geom_Geom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./geom/Geom */ "./src/geom/Geom.js");
/* harmony import */ var _geom_Line__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./geom/Line */ "./src/geom/Line.js");




var karas = {
  render: function render(canvas, dom) {
    if (!canvas instanceof _node_Canvas__WEBPACK_IMPORTED_MODULE_1__["default"]) {
      throw new Error('render root muse be canvas');
    }

    if (dom) {
      canvas.appendTo(dom);
    }

    return canvas;
  },
  createVd: function createVd(tagName, props, children) {
    if (tagName === 'canvas') {
      return new _node_Canvas__WEBPACK_IMPORTED_MODULE_1__["default"](props, children);
    }

    if (_node_Dom__WEBPACK_IMPORTED_MODULE_0__["default"].isValid(tagName)) {
      return new _node_Dom__WEBPACK_IMPORTED_MODULE_0__["default"](tagName, props, children);
    }

    throw new Error('can not use marker: ' + tagName);
  },
  createGm: function createGm(tagName, props) {
    if (_geom_Geom__WEBPACK_IMPORTED_MODULE_2__["default"].isValid(tagName)) {
      switch (tagName) {
        case '$line':
          return new _geom_Line__WEBPACK_IMPORTED_MODULE_3__["default"](props);

        case '$point':
        default:
          throw new Error('can not use marker: ' + tagName);
      }
    }
  },
  createCp: function createCp(tagName, props, children) {}
};

if (typeof window != 'undefined') {
  window.karas = karas;
}

/* harmony default export */ __webpack_exports__["default"] = (karas);

/***/ }),

/***/ "./src/node/Canvas.js":
/*!****************************!*\
  !*** ./src/node/Canvas.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Dom */ "./src/node/Dom.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util */ "./src/util.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }




function getDom(dom) {
  if (_util__WEBPACK_IMPORTED_MODULE_1__["default"].isString(dom)) {
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
  var s = Array.isArray(v) ? _util__WEBPACK_IMPORTED_MODULE_1__["default"].joinSourceArray(v) : _util__WEBPACK_IMPORTED_MODULE_1__["default"].stringify(v);

  if (k === 'className') {
    k = 'class';
  }

  return ' ' + k + '="' + _util__WEBPACK_IMPORTED_MODULE_1__["default"].encodeHtml(s, true) + '"';
}

var Canvas =
/*#__PURE__*/
function (_Dom) {
  _inherits(Canvas, _Dom);

  function Canvas(props, children) {
    var _this;

    _classCallCheck(this, Canvas);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Canvas).call(this, 'canvas', props, children));
    _this.__node = null; // 真实DOM引用

    return _this;
  }

  _createClass(Canvas, [{
    key: "initProps",
    value: function initProps() {
      if (this.props.width !== undefined) {
        var value = parseInt(this.props.width);

        if (!isNaN(value) && value > 0) {
          this.__width = value;
        }
      }

      if (this.props.height !== undefined) {
        var _value = parseInt(this.props.height);

        if (!isNaN(_value) && _value > 0) {
          this.__height = _value;
        }
      }
    }
  }, {
    key: "genHtml",
    value: function genHtml() {
      var res = '<canvas'; // 拼接处理属性

      for (var i = 0, len = this.__props.length; i < len; i++) {
        var item = this.__props[i];
        res += renderProp(item[0], item[1]);
      }

      res += '></canvas>';
      return res;
    }
  }, {
    key: "appendTo",
    value: function appendTo(dom) {
      dom = getDom(dom);
      this.initProps(); // 已有canvas节点

      if (dom.nodeName.toUpperCase() === 'CANVAS') {
        this.__node = dom;

        if (this.width) {
          dom.setAttribute('width', this.width);
        }

        if (this.height) {
          dom.setAttribute('height', this.height);
        }
      } // 没有canvas节点则生成一个新的
      else {
          var s = this.genHtml();
          dom.insertAdjacentHTML('beforeend', s);
          var canvas = dom.querySelectorAll('canvas');
          this.__node = canvas[canvas.length - 1];
        } // 没有设置width/height则采用css计算形式


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
      } // canvas作为根节点一定是block或flex，不会是inline


      var style = this.style;

      if (['flex', 'block', 'none'].indexOf(style.display) === -1) {
        style.display = 'block';
      }

      this.__ctx = this.__node.getContext('2d');

      this.__traverse(this.__ctx);

      this.__initStyle();

      this.__preLay({
        x: 0,
        y: 0,
        w: this.width,
        h: this.height
      });

      this.render();
    }
  }, {
    key: "node",
    get: function get() {
      return this.__node;
    }
  }]);

  return Canvas;
}(_Dom__WEBPACK_IMPORTED_MODULE_0__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (Canvas);

/***/ }),

/***/ "./src/node/Dom.js":
/*!*************************!*\
  !*** ./src/node/Dom.js ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Node__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Node */ "./src/node/Node.js");
/* harmony import */ var _Text__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Text */ "./src/node/Text.js");
/* harmony import */ var _LineGroup__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./LineGroup */ "./src/node/LineGroup.js");
/* harmony import */ var _geom_Geom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../geom/Geom */ "./src/geom/Geom.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../util */ "./src/util.js");
/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../style/css */ "./src/style/css.js");
/* harmony import */ var _style_unit__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../style/unit */ "./src/style/unit.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }








var TAG_NAME = {
  'div': true,
  'span': true
};
var INLINE = {
  'span': true
};

var Dom =
/*#__PURE__*/
function (_Node) {
  _inherits(Dom, _Node);

  function Dom(tagName, props, children) {
    var _this;

    _classCallCheck(this, Dom);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Dom).call(this, props));
    _this.__tagName = tagName;
    _this.__children = children;
    _this.__lineGroups = []; // 一行inline元素组成的LineGroup对象后的存放列表

    return _this;
  }
  /**
   * 1. 封装string为Text节点
   * 2. 打平children中的数组，变成一维
   * 3. 合并相连的Text节点
   * 4. 检测inline不能包含block
   * 5. 设置parent和prev/next和ctx
   */


  _createClass(Dom, [{
    key: "__traverse",
    value: function __traverse(ctx) {
      var _this2 = this;

      var list = [];

      this.__traverseChildren(this.children, list, ctx);

      for (var i = list.length - 1; i > 0; i--) {
        var item = list[i];

        if (item instanceof _Text__WEBPACK_IMPORTED_MODULE_1__["default"]) {
          var _prev = list[i - 1];

          if (_prev instanceof _Text__WEBPACK_IMPORTED_MODULE_1__["default"]) {
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

          if (_item instanceof Dom && _item.style.display !== 'inline') {
            throw new Error('inline can not contain block');
          }
        }
      }

      var prev = null;
      list.forEach(function (item) {
        item.__ctx = ctx;

        if (prev) {
          prev.__next = item;
        }

        item.__parent = _this2;
        item.__prev = prev;
      });
      this.__children = list;
    }
  }, {
    key: "__traverseChildren",
    value: function __traverseChildren(children, list, ctx) {
      var _this3 = this;

      if (Array.isArray(children)) {
        children.forEach(function (item) {
          _this3.__traverseChildren(item, list, ctx);
        });
      } else if (children instanceof Dom) {
        list.push(children);

        children.__traverse(ctx);
      } // 图形没有children
      else if (children instanceof _geom_Geom__WEBPACK_IMPORTED_MODULE_3__["default"]) {
          list.push(children);
        } // 排除掉空的文本
        else if (!_util__WEBPACK_IMPORTED_MODULE_4__["default"].isNil(children)) {
            list.push(new _Text__WEBPACK_IMPORTED_MODULE_1__["default"](children));
          }
    } // 合并设置style，包括继承和默认值，修改一些自动值和固定值，测量所有文字的宽度

  }, {
    key: "__initStyle",
    value: function __initStyle() {
      var style = this.__style = this.props.style || {}; // 仅支持flex/block/inline

      if (!style.display || ['flex', 'block', 'inline'].indexOf(style.display) === -1) {
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


      _style_css__WEBPACK_IMPORTED_MODULE_5__["default"].normalize(style);
      this.children.forEach(function (item) {
        if (item instanceof Dom) {
          item.__initStyle();
        } else if (item instanceof _geom_Geom__WEBPACK_IMPORTED_MODULE_3__["default"]) {
          item.__initStyle();
        } else {
          item.__style = style; // 文字首先测量所有字符宽度

          item.__measure();
        }
      });
    } // 给定父宽度情况下，尝试行内放下后的剩余宽度，为负数即放不下

  }, {
    key: "__tryLayInline",
    value: function __tryLayInline(w) {
      var children = this.children;

      for (var i = 0; i < children.length; i++) {
        // 当放不下时直接返回，无需继续多余的尝试计算
        if (w < 0) {
          return w;
        }

        var item = children[i];

        if (item instanceof Dom || item instanceof _geom_Geom__WEBPACK_IMPORTED_MODULE_3__["default"]) {
          w = item.__tryLayInline(w);
        } else {
          w -= item.textWidth;
        }
      }

      return w;
    } // 设置y偏移值，递归包括children，此举在初步确定inline布局后设置元素vertical-align用

  }, {
    key: "__offsetY",
    value: function __offsetY(diff) {
      this.__y += diff;
      this.children.forEach(function (item) {
        if (item) {
          item.__offsetY(diff);
        }
      });
    } // 获取节点的最大和最小宽度

  }, {
    key: "__calMaxAndMinWidth",
    value: function __calMaxAndMinWidth() {
      var children = this.children;
      var max = 0;
      var min = 0;
      children.forEach(function (item) {
        var _item$__calMaxAndMinW = item.__calMaxAndMinWidth(),
            a = _item$__calMaxAndMinW.max,
            b = _item$__calMaxAndMinW.min;

        max = Math.max(max, a);
        min = Math.max(min, b);
      });
      return {
        max: max,
        min: min
      };
    }
  }, {
    key: "__preLay",
    value: function __preLay(data) {
      var style = this.style;

      if (style.display === 'block') {
        this.__preLayBlock(data);
      } else if (style.display === 'flex') {
        this.__preLayFlex(data);
      } else {
        this.__preLayInline(data);
      }
    } // 本身block布局时计算好所有子元素的基本位置

  }, {
    key: "__preLayBlock",
    value: function __preLayBlock(data) {
      var _this4 = this;

      var x = data.x,
          y = data.y,
          w = data.w,
          h = data.h;
      this.__x = x;
      this.__y = y;
      this.__width = w;
      var children = this.children,
          style = this.style;
      var width = style.width,
          height = style.height; // 除了auto外都是固定高度

      var fixedHeight;

      if (width && width.unit !== _style_unit__WEBPACK_IMPORTED_MODULE_6__["default"].AUTO) {
        switch (width.unit) {
          case _style_unit__WEBPACK_IMPORTED_MODULE_6__["default"].PX:
            w = width.value;
            break;
        }
      }

      if (height && height.unit !== _style_unit__WEBPACK_IMPORTED_MODULE_6__["default"].AUTO) {
        fixedHeight = true;

        switch (height.unit) {
          case _style_unit__WEBPACK_IMPORTED_MODULE_6__["default"].PX:
            h = height.value;
            break;
        }
      }

      var lineGroup = new _LineGroup__WEBPACK_IMPORTED_MODULE_2__["default"](x, y);
      children.forEach(function (item) {
        if (item instanceof Dom) {
          if (item.style.display === 'inline') {
            // inline开头，不用考虑是否放得下直接放
            if (x === data.x) {
              lineGroup.add(item);

              item.__preLayInline({
                x: x,
                y: y,
                w: w,
                h: h
              });

              x += item.width;
            } else {
              // 非开头先尝试是否放得下
              var fw = item.__tryLayInline(w - x); // 放得下继续


              if (fw >= 0) {
                item.__preLayInline({
                  x: x,
                  y: y,
                  w: w
                });
              } // 放不下处理之前的lineGroup，并重新开头
              else {
                  _this4.lineGroups.push(lineGroup);

                  lineGroup.verticalAlign();
                  x = data.x;
                  y += lineGroup.height;

                  item.__preLayInline({
                    x: data.x,
                    y: y,
                    w: w
                  });

                  lineGroup = new _LineGroup__WEBPACK_IMPORTED_MODULE_2__["default"](x, y);
                }

              x += item.width;
              lineGroup.add(item);
            }
          } else {
            // block先处理之前可能的lineGroup
            if (lineGroup.size) {
              _this4.lineGroups.push(lineGroup);

              lineGroup.verticalAlign();
              y += lineGroup.height;
              lineGroup = new _LineGroup__WEBPACK_IMPORTED_MODULE_2__["default"](data.x, y);
            }

            item.__preLay({
              x: data.x,
              y: y,
              w: w,
              h: h
            });

            x = data.x;
            y += item.height;
          }
        } else if (item instanceof _geom_Geom__WEBPACK_IMPORTED_MODULE_3__["default"]) {
          // 图形也是block先处理之前可能的行
          if (lineGroup.size) {
            _this4.lineGroups.push(lineGroup);

            lineGroup.verticalAlign();
            y += lineGroup.height;
            lineGroup = new _LineGroup__WEBPACK_IMPORTED_MODULE_2__["default"](data.x, y);
          }

          item.__preLay({
            x: data.x,
            y: y,
            w: w
          });

          x = data.x;
          y += item.height;
        } // 文字和inline类似
        else {
            // x开头，不用考虑是否放得下直接放
            if (x === data.x) {
              lineGroup.add(item);

              item.__preLay({
                x: x,
                y: y,
                w: w,
                h: h
              });

              x += item.width;
            } else {
              // 非开头先尝试是否放得下
              var _fw = item.__tryLayInline(w - x); // 放得下继续


              if (_fw >= 0) {
                item.__preLay({
                  x: x,
                  y: y,
                  w: w,
                  h: h
                });
              } // 放不下处理之前的lineGroup，并重新开头
              else {
                  _this4.lineGroups.push(lineGroup);

                  lineGroup.verticalAlign();
                  x = data.x;
                  y += lineGroup.height;

                  item.__preLay({
                    x: data.x,
                    y: y,
                    w: w,
                    h: h
                  });

                  lineGroup = new _LineGroup__WEBPACK_IMPORTED_MODULE_2__["default"](x, y);
                }

              x += item.width;
              lineGroup.add(item);
            }
          }
      }); // 结束后处理可能遗留的最后的lineGroup

      if (lineGroup.size) {
        this.lineGroups.push(lineGroup);
        lineGroup.verticalAlign();
        y += lineGroup.height;
      }

      this.__width = w;
      this.__height = fixedHeight ? h : y - data.y;
    } // 弹性布局时的计算位置

  }, {
    key: "__preLayFlex",
    value: function __preLayFlex(data) {
      var x = data.x,
          y = data.y,
          w = data.w,
          h = data.h;
      this.__x = x;
      this.__y = y;
      this.__width = w;
      var children = this.children,
          ctx = this.ctx,
          style = this.style;
      var width = style.width,
          height = style.height;
      var fixedHeight;

      if (width && width.unit !== _style_unit__WEBPACK_IMPORTED_MODULE_6__["default"].AUTO) {
        switch (width.unit) {
          case _style_unit__WEBPACK_IMPORTED_MODULE_6__["default"].PX:
            w = width.value;
            break;
        }
      }

      if (height && height.unit !== _style_unit__WEBPACK_IMPORTED_MODULE_6__["default"].AUTO) {
        fixedHeight = true;

        switch (height.unit) {
          case _style_unit__WEBPACK_IMPORTED_MODULE_6__["default"].PX:
            h = height.value;
            break;
        }
      }

      var growList = [];
      var shrinkList = [];
      var basisList = [];
      var widthList = [];
      var maxList = [];
      var minList = [];
      var maxWidth = 0;
      var minWidth = 0;
      var growSum = 0;
      var shrinkSum = 0;
      children.forEach(function (item) {
        var _item$__calMaxAndMinW2 = item.__calMaxAndMinWidth(),
            max = _item$__calMaxAndMinW2.max,
            min = _item$__calMaxAndMinW2.min;

        maxList.push(max);
        minList.push(min);

        if (item instanceof Dom || item instanceof _geom_Geom__WEBPACK_IMPORTED_MODULE_3__["default"]) {
          var _item$style = item.style,
              flexGrow = _item$style.flexGrow,
              flexShrink = _item$style.flexShrink,
              flexBasis = _item$style.flexBasis,
              _width = _item$style.width;
          growList.push(flexGrow);
          shrinkList.push(flexShrink);
          basisList.push(flexBasis);
          growSum += flexGrow;
          shrinkSum += flexShrink;

          if (_width.unit === _style_unit__WEBPACK_IMPORTED_MODULE_6__["default"].AUTO) {
            widthList.push('auto');
          } else if (_width.unit === _style_unit__WEBPACK_IMPORTED_MODULE_6__["default"].PERCENT) {
            widthList.push(_width.value * w);
          } else if (_width.unit === _style_unit__WEBPACK_IMPORTED_MODULE_6__["default"].PX) {
            widthList.push(_width.value);
          } // 根据basis不同，最大和最小计算方式不同


          if (flexBasis.unit === _style_unit__WEBPACK_IMPORTED_MODULE_6__["default"].AUTO) {
            if (_width.unit === _style_unit__WEBPACK_IMPORTED_MODULE_6__["default"].AUTO) {
              maxWidth += max;
              minWidth += min;
            } else {
              maxWidth += widthList[widthList.length - 1];
              minWidth += widthList[widthList.length - 1];
            }
          } else if ([_style_unit__WEBPACK_IMPORTED_MODULE_6__["default"].PERCENT, _style_unit__WEBPACK_IMPORTED_MODULE_6__["default"].PX].indexOf(flexBasis.unit) > -1) {
            maxWidth += max;
            minWidth += min;
          }
        } else {
          growList.push(0);
          shrinkList.push(1);
          basisList.push({
            unit: _style_unit__WEBPACK_IMPORTED_MODULE_6__["default"].AUTO
          });
          shrinkSum += 1;
          widthList.push('auto');
          maxWidth += max;
          minWidth += min;
        }
      });
      console.log(w, maxWidth, minWidth, growList, shrinkList, basisList, widthList, minList, maxList, growSum, shrinkSum); // 均不扩展和收缩

      if (growSum === 0 && shrinkSum === 0) {
        var maxHeight = 0; // 从左到右依次排列布局，等同inline-block

        children.forEach(function (item) {
          if (item instanceof Dom || item instanceof _geom_Geom__WEBPACK_IMPORTED_MODULE_3__["default"]) {
            item.__preLayInline({
              x: x,
              y: y,
              w: w,
              h: h
            });

            x += item.width;
          } else {
            item.__preLay({
              x: x,
              y: y,
              w: w,
              h: h
            });

            x += item.width;
          }

          maxHeight = Math.max(maxHeight, item.height);
        }); // 所有孩子高度相同

        children.forEach(function (item) {
          item.__height = maxHeight;
        });
        y += maxHeight;
      }

      this.__width = w;
      this.__height = fixedHeight ? h : y - data.y;
    } // inline比较特殊，先简单顶部对其，后续还需根据vertical和lineHeight计算y偏移

  }, {
    key: "__preLayInline",
    value: function __preLayInline(data) {
      var _this5 = this;

      var x = data.x,
          y = data.y,
          w = data.w,
          h = data.h;
      this.__x = x;
      this.__y = y;
      var maxX = x;
      var children = this.children,
          style = this.style;
      var width = style.width,
          height = style.height; // 除了auto外都是固定高度

      var fixedWidth;
      var fixedHeight;

      if (width && width.unit !== _style_unit__WEBPACK_IMPORTED_MODULE_6__["default"].AUTO) {
        fixedWidth = true;

        switch (width.unit) {
          case _style_unit__WEBPACK_IMPORTED_MODULE_6__["default"].PX:
            w = width.value;
            break;
        }
      }

      if (height && height.unit !== _style_unit__WEBPACK_IMPORTED_MODULE_6__["default"].AUTO) {
        fixedHeight = true;

        switch (height.unit) {
          case _style_unit__WEBPACK_IMPORTED_MODULE_6__["default"].PX:
            h = height.value;
            break;
        }
      }

      var lineGroup = new _LineGroup__WEBPACK_IMPORTED_MODULE_2__["default"](x, y);
      children.forEach(function (item) {
        if (item instanceof Dom) {
          // inline开头，不用考虑是否放得下直接放
          if (x === data.x) {
            lineGroup.add(item);

            item.__preLayInline({
              x: x,
              y: y,
              w: w
            });

            x += item.width;
            maxX = Math.max(maxX, x);
          } else {
            // 非开头先尝试是否放得下
            var fw = item.__tryLayInline(w - x); // 放得下继续


            if (fw >= 0) {
              item.__preLayInline({
                x: x,
                y: y,
                w: w
              });
            } // 放不下处理之前的lineGroup，并重新开头
            else {
                _this5.lineGroups.push(lineGroup);

                lineGroup.verticalAlign();
                x = data.x;
                y += lineGroup.height;

                item.__preLayInline({
                  x: data.x,
                  y: y,
                  w: w
                });

                lineGroup = new _LineGroup__WEBPACK_IMPORTED_MODULE_2__["default"](x, y);
              }

            x += item.width;
            maxX = Math.max(maxX, x);
            lineGroup.add(item);
          }
        } // inline里的其它只有文本
        else {
            if (x === data.x) {
              lineGroup.add(item);

              item.__preLay({
                x: x,
                y: y,
                w: w,
                h: h
              });

              x += item.width;
              maxX = Math.max(maxX, x);
            } else {
              // 非开头先尝试是否放得下
              var _fw2 = item.__tryLayInline(w - x); // 放得下继续


              if (_fw2 >= 0) {
                item.__preLay({
                  x: x,
                  y: y,
                  w: w,
                  h: h
                });
              } // 放不下处理之前的lineGroup，并重新开头
              else {
                  _this5.lineGroups.push(lineGroup);

                  lineGroup.verticalAlign();
                  x = data.x;
                  y += lineGroup.height;

                  item.__preLay({
                    x: data.x,
                    y: y,
                    w: w,
                    h: h
                  });

                  lineGroup = new _LineGroup__WEBPACK_IMPORTED_MODULE_2__["default"](x, y);
                }

              x += item.width;
              maxX = Math.max(maxX, x);
              lineGroup.add(item);
            }
          }
      }); // 结束后处理可能遗留的最后的lineGroup，children为空时可能size为空

      if (lineGroup.size) {
        this.lineGroups.push(lineGroup);
        lineGroup.verticalAlign();
        y += lineGroup.height;
      } // 元素的width不能超过父元素w


      this.__width = fixedWidth ? w : maxX - data.x;
      this.__height = fixedHeight ? h : y - data.y;
    }
  }, {
    key: "render",
    value: function render() {
      var ctx = this.ctx,
          style = this.style,
          children = this.children;

      if (style.backgroundColor) {
        ctx.beginPath();
        ctx.fillStyle = style.backgroundColor;
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fill();
        ctx.closePath();
      }

      children.forEach(function (item) {
        if (item) {
          item.render();
        }
      });
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
}(_Node__WEBPACK_IMPORTED_MODULE_0__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (Dom);

/***/ }),

/***/ "./src/node/LineBox.js":
/*!*****************************!*\
  !*** ./src/node/LineBox.js ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../style/css */ "./src/style/css.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



var LineBox =
/*#__PURE__*/
function () {
  function LineBox(ctx, x, y, content, style) {
    _classCallCheck(this, LineBox);

    this.__ctx = ctx;
    this.__x = x;
    this.__y = y;
    this.__content = content;
    this.__style = style;
  }

  _createClass(LineBox, [{
    key: "render",
    value: function render() {
      this.ctx.fillStyle = this.style.color;
      this.ctx.fillText(this.content, this.x, this.y + _style_css__WEBPACK_IMPORTED_MODULE_0__["default"].getBaseLine(this.style));
    }
  }, {
    key: "__offsetY",
    value: function __offsetY(diff) {
      this.__y += diff;
    }
  }, {
    key: "ctx",
    get: function get() {
      return this.__ctx;
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
      return _style_css__WEBPACK_IMPORTED_MODULE_0__["default"].getBaseLine(this.style);
    }
  }]);

  return LineBox;
}();

/* harmony default export */ __webpack_exports__["default"] = (LineBox);

/***/ }),

/***/ "./src/node/LineGroup.js":
/*!*******************************!*\
  !*** ./src/node/LineGroup.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var LineGroup =
/*#__PURE__*/
function () {
  function LineGroup(x, y) {
    _classCallCheck(this, LineGroup);

    this.__list = [];
    this.__x = x;
    this.__y = y;
    this.__height = 0;
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
    key: "__calHeight",
    value: function __calHeight() {
      var height = 0;
      this.list.forEach(function (item) {
        height = Math.max(height, item.height);
      });
      return height;
    }
  }, {
    key: "verticalAlign",
    value: function verticalAlign() {
      var _this = this;

      this.__height = this.__calHeight();
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
    key: "height",
    get: function get() {
      return this.__height;
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

/* harmony default export */ __webpack_exports__["default"] = (LineGroup);

/***/ }),

/***/ "./src/node/Node.js":
/*!**************************!*\
  !*** ./src/node/Node.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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
  var arr = [];

  for (var list = Object.keys(hash), i = 0, len = list.length; i < len; i++) {
    var k = list[i];
    arr.push([k, hash[k]]);
  }

  return arr;
}

function spread(arr) {
  for (var i = 0, len = arr.length; i < len; i++) {
    var item = arr[i];

    if (!Array.isArray(item)) {
      var temp = [];

      for (var list = Object.keys(item), j = 0, _len = list.length; j < _len; j++) {
        var k = list[j];
        temp.push([k, item[k]]);
      }

      arr.splice.apply(arr, [i, 1].concat(temp));
    }
  }

  return arr;
}

var Node =
/*#__PURE__*/
function () {
  function Node(props) {
    _classCallCheck(this, Node);

    props = props || []; // 构建工具中都是arr，手写可能出现hash情况

    if (Array.isArray(props)) {
      this.props = arr2hash(props);
      this.__props = spread(props);
    } else {
      this.props = props;
      this.__props = hash2arr(props);
    }

    this.__x = 0;
    this.__y = 0;
    this.__width = 0;
    this.__height = 0;
    this.__prev = null;
    this.__next = null;
    this.__ctx = null; // canvas的context

    this.__parent = null;
    this.__style = {}; // style被解析后的k-v形式

    this.__baseLine = 0;
  }

  _createClass(Node, [{
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
    key: "height",
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
    key: "baseLine",
    get: function get() {
      return this.__baseLine;
    }
  }]);

  return Node;
}();

/* harmony default export */ __webpack_exports__["default"] = (Node);

/***/ }),

/***/ "./src/node/Text.js":
/*!**************************!*\
  !*** ./src/node/Text.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Node__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Node */ "./src/node/Node.js");
/* harmony import */ var _LineBox__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./LineBox */ "./src/node/LineBox.js");
/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../style/css */ "./src/style/css.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }




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
    _this.__charWidth = [];
    _this.__textWidth = 0;
    return _this;
  } // 预先计算每个字的宽度


  _createClass(Text, [{
    key: "__measure",
    value: function __measure() {
      this.__charWidth = [];
      var ctx = this.ctx,
          content = this.content,
          style = this.style,
          charWidth = this.charWidth;
      ctx.font = _style_css__WEBPACK_IMPORTED_MODULE_2__["default"].setFontStyle(style);
      var cache = CHAR_WIDTH_CACHE[style.fontSize] = CHAR_WIDTH_CACHE[style.fontSize] || {};
      var length = content.length;
      var sum = 0;

      for (var i = 0; i < length; i++) {
        var _char = content.charAt(i);

        if (cache.hasOwnProperty(_char)) {
          charWidth.push(cache[_char]);
          sum += cache[_char];
          continue;
        }

        var mw = cache[_char] = ctx.measureText(_char).width;
        charWidth.push(mw);
        sum += mw;
      }

      this.__textWidth = sum;
    }
  }, {
    key: "__preLay",
    value: function __preLay(data) {
      var x = data.x,
          y = data.y,
          w = data.w,
          h = data.h;
      this.__x = x;
      this.__y = y;
      var maxX = x;
      var ctx = this.ctx,
          content = this.content,
          style = this.style,
          lineBoxes = this.lineBoxes,
          charWidth = this.charWidth; // 顺序尝试分割字符串为lineBox，形成多行

      var begin = 0;
      var i = 0;
      var count = 0;
      var length = content.length;

      while (i < length) {
        count += charWidth[i];

        if (count === w) {
          var lineBox = new _LineBox__WEBPACK_IMPORTED_MODULE_1__["default"](ctx, x, y, content.slice(begin, i + 1), style);
          lineBoxes.push(lineBox);
          maxX = Math.max(maxX, x + count);
          y += this.style.lineHeight.value;
          begin = i + 1;
          i = begin + 1;
          count = 0;
        } else if (count > w) {
          var _lineBox = new _LineBox__WEBPACK_IMPORTED_MODULE_1__["default"](ctx, x, y, content.slice(begin, i), style);

          lineBoxes.push(_lineBox);
          maxX = Math.max(maxX, x + count - charWidth[i]);
          y += this.style.lineHeight.value;
          begin = i;
          count = 0;
        } else {
          i++;
        }
      }

      if (begin < i) {
        var _lineBox2 = new _LineBox__WEBPACK_IMPORTED_MODULE_1__["default"](ctx, x, y, content.slice(begin, i), style);

        lineBoxes.push(_lineBox2);
        maxX = Math.max(maxX, x + count);
        y += this.style.lineHeight.value;
      }

      this.__width = maxX - x;
      this.__height = y - data.y;
    }
  }, {
    key: "render",
    value: function render() {
      this.ctx.font = _style_css__WEBPACK_IMPORTED_MODULE_2__["default"].setFontStyle(this.style);
      this.lineBoxes.forEach(function (item) {
        item.render();
      });
    }
  }, {
    key: "__tryLayInline",
    value: function __tryLayInline(w) {
      this.ctx.font = _style_css__WEBPACK_IMPORTED_MODULE_2__["default"].setFontStyle(this.style);
      var tw = this.ctx.measureText(this.content).width;
      return w - tw;
    }
  }, {
    key: "__offsetY",
    value: function __offsetY(diff) {
      this.__y += diff;
      this.lineBoxes.forEach(function (item) {
        item.__offsetY(diff);
      });
    }
  }, {
    key: "__calMaxAndMinWidth",
    value: function __calMaxAndMinWidth() {
      var n = 0;
      this.charWidth.forEach(function (item) {
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
  }]);

  return Text;
}(_Node__WEBPACK_IMPORTED_MODULE_0__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (Text);

/***/ }),

/***/ "./src/style/css.js":
/*!**************************!*\
  !*** ./src/style/css.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _unit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./unit */ "./src/style/unit.js");
/* harmony import */ var _font__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./font */ "./src/style/font.js");
/* harmony import */ var _reset__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./reset */ "./src/style/reset.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../util */ "./src/util.js");





function normalize(style) {
  // 默认reset
  _reset__WEBPACK_IMPORTED_MODULE_2__["default"].forEach(function (item) {
    if (!style.hasOwnProperty(item.k)) {
      style[item.k] = item.v;
    }
  }); // 处理缩写

  if (style.background) {
    var bgc = /#[0-9a-f]{3,6}/i.exec(style.background);

    if (bgc && [4, 7].indexOf(bgc[0].length) > -1) {
      style.backgroundColor = bgc[0];
    }
  }

  if (style.flex) {
    if (style.flex === 'none') {
      style.flexGrow = 0;
      style.flexShrink = 0;
      style.flexBasis = 'auto';
    } else if (style.flex === 'auto') {
      style.flexGrow = 1;
      style.flexShrink = 1;
      style.flexBasis = 'auto';
    } else if (/^\d+$/.test(style.flex)) {
      style.flexGrow = parseInt(style.flex);
      style.flexShrink = 1;
      style.flexBasis = 0;
    } else {
      style.flexGrow = 0;
      style.flexShrink = 1;
      style.flexBasis = 'auto';
    }
  } // 转化不同单位值为对象标准化


  ['marginTop', 'marginRight', 'marginDown', 'marginLeft', 'paddingTop', 'paddingRight', 'paddingDown', 'paddingLeft', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'width', 'height', 'flexBasis'].forEach(function (k) {
    var v = style[k]; // 编译工具前置解析优化跳出

    if (!_util__WEBPACK_IMPORTED_MODULE_3__["default"].isNil(v) && v.unit) {
      return;
    }

    if (v === 'auto') {
      style[k] = {
        unit: _unit__WEBPACK_IMPORTED_MODULE_0__["default"].AUTO
      };
    } else if (/%$/.test(v)) {
      v = parseFloat(v) || 0;

      if (v <= 0) {
        style[k] = {
          value: 0,
          unit: _unit__WEBPACK_IMPORTED_MODULE_0__["default"].PX
        };
      } else {
        style[k] = {
          value: v,
          unit: _unit__WEBPACK_IMPORTED_MODULE_0__["default"].PERCENT
        };
      }
    } else {
      v = parseFloat(v) || 0;
      style[k] = {
        value: Math.max(v, 0),
        unit: _unit__WEBPACK_IMPORTED_MODULE_0__["default"].PX
      };
    }
  }); // 计算lineHeight为px值，最小范围

  var lineHeight = style.lineHeight;

  if (lineHeight === 'normal') {
    lineHeight = {
      value: style.fontSize * _font__WEBPACK_IMPORTED_MODULE_1__["default"].arial.lhr,
      unit: _unit__WEBPACK_IMPORTED_MODULE_0__["default"].PX
    };
  } else if (/px$/.test(lineHeight)) {
    lineHeight = parseFloat(lineHeight);
    lineHeight = {
      value: Math.max(style.fontSize, lineHeight),
      unit: _unit__WEBPACK_IMPORTED_MODULE_0__["default"].PX
    };
  } // 纯数字比例
  else {
      lineHeight = parseFloat(lineHeight) || 'normal'; // 非法数字

      if (lineHeight === 'normal') {
        lineHeight = {
          value: style.fontSize * _font__WEBPACK_IMPORTED_MODULE_1__["default"].arial.lhr,
          unit: _unit__WEBPACK_IMPORTED_MODULE_0__["default"].PX
        };
      } else {
        lineHeight = {
          value: lineHeight * style.fontSize,
          unit: _unit__WEBPACK_IMPORTED_MODULE_0__["default"].PX
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
  return "".concat(fontStyle, " ").concat(fontWeight, " ").concat(fontSize, "px/").concat(fontSize, "px ").concat(fontFamily);
}

function getBaseLine(style) {
  var normal = style.fontSize * _font__WEBPACK_IMPORTED_MODULE_1__["default"].arial.lhr;
  return (style.lineHeight.value - normal) * 0.5 + style.fontSize * _font__WEBPACK_IMPORTED_MODULE_1__["default"].arial.blr;
}

/* harmony default export */ __webpack_exports__["default"] = ({
  normalize: normalize,
  setFontStyle: setFontStyle,
  getBaseLine: getBaseLine
});

/***/ }),

/***/ "./src/style/font.js":
/*!***************************!*\
  !*** ./src/style/font.js ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);


/* harmony default export */ __webpack_exports__["default"] = ({
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
});

/***/ }),

/***/ "./src/style/reset.js":
/*!****************************!*\
  !*** ./src/style/reset.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var RESET = {
  display: 'block',
  borderSizing: 'content-box',
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
  borderTopWidth: 0,
  borderRightWidth: 0,
  borderBottomWidth: 0,
  borderLeftWidth: 0,
  borderTopStyle: 'solid',
  borderRightStyle: 'solid',
  borderBottomStyle: 'solid',
  borderLeftStyle: 'solid',
  verticalAlign: 'baseline',
  width: 'auto',
  height: 'auto',
  flexGrow: 0,
  flexShrink: 1,
  flexBasis: 'auto',
  alignItem: 'stretch',
  textAlign: 'left'
};
var reset = [];
Object.keys(RESET).forEach(function (k) {
  var v = RESET[k];
  reset.push({
    k: k,
    v: v
  });
});
/* harmony default export */ __webpack_exports__["default"] = (reset);

/***/ }),

/***/ "./src/style/unit.js":
/*!***************************!*\
  !*** ./src/style/unit.js ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  AUTO: 0,
  PX: 1,
  PERCENT: 2
});

/***/ }),

/***/ "./src/util.js":
/*!*********************!*\
  !*** ./src/util.js ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
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
  isNil: isNil
};
/* harmony default export */ __webpack_exports__["default"] = (util);

/***/ })

/******/ });
});
//# sourceMappingURL=index.js.map