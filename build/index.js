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

/***/ "./node_modules/_webpack@4.27.1@webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g; // This works in non-strict mode

g = function () {
  return this;
}();

try {
  // This works if eval is allowed (see CSP)
  g = g || new Function("return this")();
} catch (e) {
  // This works if the window reference is available
  if (typeof window === "object") g = window;
} // g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}


module.exports = g;

/***/ }),

/***/ "./src/Canvas.js":
/*!***********************!*\
  !*** ./src/Canvas.js ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Group__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Group */ "./src/Group.js");
/* harmony import */ var _Geom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Geom */ "./src/Geom.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./util */ "./src/util.js");
/* harmony import */ var _reset__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./reset */ "./src/reset.js");
/* harmony import */ var _VirtualDom__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./VirtualDom */ "./src/VirtualDom.js");
/* harmony import */ var _Element__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Element */ "./src/Element.js");
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
  if (_util__WEBPACK_IMPORTED_MODULE_2__["default"].isString(dom)) {
    var o = document.querySelector(dom);

    if (!o) {
      throw new Error('can not find dom of selector: ' + dom);
    }

    return o;
  }

  return dom;
}

function renderProp(k, v) {
  var s = Array.isArray(v) ? _util__WEBPACK_IMPORTED_MODULE_2__["default"].joinSourceArray(v) : _util__WEBPACK_IMPORTED_MODULE_2__["default"].stringify(v);

  if (k === 'className') {
    k = 'class';
  }

  return ' ' + k + '="' + _util__WEBPACK_IMPORTED_MODULE_2__["default"].encodeHtml(s, true) + '"';
}

var Canvas =
/*#__PURE__*/
function (_Group) {
  _inherits(Canvas, _Group);

  function Canvas(props, children) {
    var _this;

    _classCallCheck(this, Canvas);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Canvas).call(this, props, children));

    if (_this.props.width === undefined) {
      _this.props.width = _this.__width = 300;

      _this.__props.push(['width', 300]);
    } else {
      _this.__width = Math.max(0, parseInt(_this.props.width) || 0);
    }

    if (_this.props.height === undefined) {
      _this.props.height = _this.__height = 150;

      _this.__props.push(['height', 150]);
    } else {
      _this.__height = Math.max(0, parseInt(_this.props.height) || 0);
    }

    _this.__element = null; // 真实DOM引用

    _this.__x = _this.__y = 0;

    _this.initStyle();

    return _this;
  }

  _createClass(Canvas, [{
    key: "initStyle",
    value: function initStyle() {
      this.__style = Object.assign({
        width: parseInt(this.props.width),
        height: parseInt(this.props.height)
      }, _reset__WEBPACK_IMPORTED_MODULE_3__["default"]);
    }
  }, {
    key: "toString",
    value: function toString() {
      var res = '<canvas'; // 处理属性

      for (var i = 0, len = this.__props.length; i < len; i++) {
        var item = this.__props[i];
        var s = renderProp(item[0], item[1]);
        res += s;
      }

      res += '></canvas>';
      return res;
    }
  }, {
    key: "appendTo",
    value: function appendTo(dom) {
      var s = this.toString();
      dom = getDom(dom);
      dom.insertAdjacentHTML('beforeend', s);
      var canvas = dom.querySelectorAll('canvas');
      this.__element = canvas[canvas.length - 1];
      this.__ctx = this.element.getContext('2d');

      this.__traverse();

      this.__groupDiv(this.ctx);

      this.__measureRow(); // this.ctx.clearRect(0, 0, this.props.width, this.props.height);
      // this.render();

    } // @Override

  }, {
    key: "__measureRow",
    value: function __measureRow() {}
  }, {
    key: "render",
    value: function render() {// let group = [];
      // let current = [];
      // const W = parseInt(this.props.width);
      // const H = parseInt(this.props.height);
      // let free = W;
      // for(let i = 0; i < this.children.length; i++) {
      //   let item = this.children[i];
      //   if(item instanceof Group) {
      //     let w = item.__measureWidth({
      //       parentWidth: W,
      //       parentHeight: H,
      //     });
      //     // 剩余的宽度不足以放下元素，需要换新行
      //     if(w > free) {
      //       if(current.length) {
      //         group.push(current);
      //         current = [];
      //       }
      //       free = W - w;
      //     }
      //     // 可以放下，减去宽度获得新的剩余空间宽度
      //     else {
      //       free -= w;
      //     }
      //     current.push({
      //       w,
      //       item,
      //     });
      //   }
      // }
      // if(current.length) {
      //   group.push(current);
      // } console.log(group);
      // let x = 0;
      // let y = 0;
      // group.forEach(row => {
      //   row.forEach(item => {
      //     if(item instanceof VirtualDom) {
      //       item.render({
      //         x,
      //         y,
      //       });
      //     }
      //   });
      // });
    }
  }, {
    key: "element",
    get: function get() {
      return this.__element;
    }
  }]);

  return Canvas;
}(_Group__WEBPACK_IMPORTED_MODULE_0__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (Canvas);

/***/ }),

/***/ "./src/Element.js":
/*!************************!*\
  !*** ./src/Element.js ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util */ "./src/util.js");
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

var Element =
/*#__PURE__*/
function () {
  function Element(props) {
    _classCallCheck(this, Element);

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
  }

  _createClass(Element, [{
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
    key: "ctx",
    get: function get() {
      return this.__ctx;
    }
  }]);

  return Element;
}();

/* harmony default export */ __webpack_exports__["default"] = (Element);

/***/ }),

/***/ "./src/Geom.js":
/*!*********************!*\
  !*** ./src/Geom.js ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Element */ "./src/Element.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }


var name = {
  'line': true
};

var Geom =
/*#__PURE__*/
function (_Element) {
  _inherits(Geom, _Element);

  function Geom(props) {
    var _this;

    _classCallCheck(this, Geom);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Geom).call(this, props));

    _this.initStyle();

    return _this;
  }

  _createClass(Geom, [{
    key: "initStyle",
    value: function initStyle() {
      this.__style = Object.assign({
        width: 300,
        height: 150
      }, this.style, {
        display: 'block'
      });
    }
  }], [{
    key: "isGeom",
    value: function isGeom(s) {
      return name.hasOwnProperty(s);
    }
  }]);

  return Geom;
}(_Element__WEBPACK_IMPORTED_MODULE_0__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (Geom);

/***/ }),

/***/ "./src/Group.js":
/*!**********************!*\
  !*** ./src/Group.js ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Element */ "./src/Element.js");
/* harmony import */ var _Text__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Text */ "./src/Text.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./util */ "./src/util.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }





var Group =
/*#__PURE__*/
function (_Element) {
  _inherits(Group, _Element);

  function Group(props, children) {
    var _this;

    _classCallCheck(this, Group);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Group).call(this, props));
    _this.__children = children;
    _this.__div = [];
    _this.__row = [];
    _this.__style = {};
    return _this;
  } // 封装string为text节点，同时打平children中的数组，使得children只是一维列表


  _createClass(Group, [{
    key: "__traverse",
    value: function __traverse() {
      var list = [];

      this.__traverseChildren(this.children, list);

      this.__children = list;
    }
  }, {
    key: "__traverseChildren",
    value: function __traverseChildren(children, list) {
      var _this2 = this;

      if (Array.isArray(children)) {
        children.forEach(function (item) {
          _this2.__traverseChildren(item, list);
        });
      } else if (children instanceof _Element__WEBPACK_IMPORTED_MODULE_0__["default"]) {
        list.push(children);

        children.__traverse();
      } // 排除掉空的文本
      else if (!_util__WEBPACK_IMPORTED_MODULE_2__["default"].isNil(children)) {
          list.push(new _Text__WEBPACK_IMPORTED_MODULE_1__["default"](children));
        }
    } // 递归遍历区分block块组，使得每组中一定都是inline元素，同时设置父子兄弟关系和ctx

  }, {
    key: "__groupDiv",
    value: function __groupDiv(ctx) {
      var prev = null;
      var list = [];
      var inLineTemp = [];
      this.children.forEach(function (item) {
        item.__ctx = ctx;

        if (item instanceof Group) {
          item.__groupDiv(ctx);

          if (['block', 'flex'].indexOf(item.style.display) > -1) {
            if (inLineTemp.length) {
              list.push(inLineTemp);
              inLineTemp = [];
            }

            list.push(item);
          } else {
            inLineTemp.push(item);
          }
        } else {
          inLineTemp.push(item);
        }

        if (prev) {
          prev.__next = item;
        }

        item.__prev = prev;
        prev = item;
      });

      if (inLineTemp.length) {
        list.push(inLineTemp);
      }

      this.__div = list;
    } // 递归测量inline位置，进行换行及多行操作，使得分行后每行有若干个inline元素
    // measure() {
    //   let res = {
    //     row: [],
    //     x: this.parent.x,
    //     y: this.parent.y,
    //   };
    //   this.measureDiv(this.group, res);
    // }
    // 递归测量inline位置，进行换行及多行操作，使得分行后每行有若干个inline元素

  }, {
    key: "__measureRow",
    value: function __measureRow() {
      var list = [];
      this.children.forEach(function (item) {});
    }
  }, {
    key: "group",
    get: function get() {
      return this.__div;
    }
  }, {
    key: "row",
    get: function get() {
      return this.__row;
    }
  }, {
    key: "children",
    get: function get() {
      return this.__children;
    }
  }, {
    key: "style",
    get: function get() {
      return this.__style;
    }
  }]);

  return Group;
}(_Element__WEBPACK_IMPORTED_MODULE_0__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (Group);

/***/ }),

/***/ "./src/Line.js":
/*!*********************!*\
  !*** ./src/Line.js ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Geom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Geom */ "./src/Geom.js");
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
    value: function render() {}
  }]);

  return Line;
}(_Geom__WEBPACK_IMPORTED_MODULE_0__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (Line);

/***/ }),

/***/ "./src/Text.js":
/*!*********************!*\
  !*** ./src/Text.js ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Element */ "./src/Element.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }



var Text =
/*#__PURE__*/
function (_Element) {
  _inherits(Text, _Element);

  function Text(s) {
    var _this;

    _classCallCheck(this, Text);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Text).call(this, []));
    _this.s = s;
    return _this;
  }

  return Text;
}(_Element__WEBPACK_IMPORTED_MODULE_0__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (Text);

/***/ }),

/***/ "./src/VirtualDom.js":
/*!***************************!*\
  !*** ./src/VirtualDom.js ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Group__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Group */ "./src/Group.js");
/* harmony import */ var _reset__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./reset */ "./src/reset.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }



var name = {
  'div': true,
  'span': true,
  'ul': true,
  'li': true,
  'a': true
};
var inline = {
  'span': true,
  'a': true
};

var VirtualDom =
/*#__PURE__*/
function (_Group) {
  _inherits(VirtualDom, _Group);

  function VirtualDom(name, props, children) {
    var _this;

    _classCallCheck(this, VirtualDom);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(VirtualDom).call(this, props, children));
    _this.__name = name;

    _this.initStyle(name);

    return _this;
  }

  _createClass(VirtualDom, [{
    key: "initStyle",
    value: function initStyle(name) {
      this.__style = Object.assign({}, _reset__WEBPACK_IMPORTED_MODULE_1__["default"]); // 仅支持flex/block/inline-block

      if (!this.style.display || ['flex', 'block', 'inline-block'].indexOf(this.style.display) === -1) {
        if (inline.hasOwnProperty(name)) {
          this.style.display = 'inline-block';
        } else {
          this.style.display = 'block';
        }
      }
    } // __measureWidth(options) {
    //   if(this.style.display === 'block') {
    //     return options.parentWidth;
    //   }
    //   else if(this.style.width && this.style.overflow === 'hidden') {
    //     return this.style.width;
    //   }
    //   else {
    //     return this.__measureChildrenWidth(this.children);
    //   }
    // }
    // __measureChildrenWidth(children) {
    //   let w = 0;
    //   if(Array.isArray(children)) {
    //     children.forEach(item => {
    //       w += this.__measureChildrenWidth(item);
    //     });
    //   }
    //   else if(children instanceof VirtualDom) {
    //     w = children.__measureWidth();
    //   }
    //   else {
    //     let style = this.style;
    //     this.ctx.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize}px/${style.lineHeight}px ${style.fontFamily}`;
    //     w = this.ctx.measureText(children).width;
    //   }
    //   return Math.max(w, this.style.width || 0);
    // }

  }, {
    key: "render",
    value: function render(options) {
      var x = options.x,
          y = options.y;
      this.__x = x;
      this.__y = y;

      this.__renderChildren(this.children);

      return {
        x: x,
        y: y,
        width: this.width,
        height: this.height
      };
    }
  }, {
    key: "__renderChildren",
    value: function __renderChildren(children) {
      this.ctx.font = '30px Georgia';
      this.ctx.fillText(this.children[0], this.x, this.y + 30);
      var square = this.ctx.measureText(this.children[0]);
      this.__width = square.width;
      this.__height = 30;
    }
  }, {
    key: "name",
    get: function get() {
      return this.__name;
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
    key: "height",
    get: function get() {
      return this.__height;
    }
  }], [{
    key: "isValid",
    value: function isValid(s) {
      return name.hasOwnProperty(s);
    }
  }]);

  return VirtualDom;
}(_Group__WEBPACK_IMPORTED_MODULE_0__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (VirtualDom);

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(global) {/* harmony import */ var _Canvas__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Canvas */ "./src/Canvas.js");
/* harmony import */ var _VirtualDom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./VirtualDom */ "./src/VirtualDom.js");
/* harmony import */ var _Geom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Geom */ "./src/Geom.js");
/* harmony import */ var _Line__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Line */ "./src/Line.js");




var yurine = {
  render: function render(canvas, dom) {
    if (!canvas instanceof _Canvas__WEBPACK_IMPORTED_MODULE_0__["default"]) {
      throw new Error('render root muse be canvas');
    }

    if (dom) {
      canvas.appendTo(dom);
    }

    return canvas;
  },
  createCp: function createCp(name, props) {
    switch (name) {
      case 'Line':
        return new _Line__WEBPACK_IMPORTED_MODULE_3__["default"](props);
    }
  },
  createVd: function createVd(name, props, children) {
    if (name === 'canvas') {
      return new _Canvas__WEBPACK_IMPORTED_MODULE_0__["default"](props, children);
    }

    if (_VirtualDom__WEBPACK_IMPORTED_MODULE_1__["default"].isValid(name)) {
      return new _VirtualDom__WEBPACK_IMPORTED_MODULE_1__["default"](name, props, children);
    }

    throw new Error('can not use marker: ' + name);
  }
};

if (typeof window != 'undefined') {
  window.yurine = yurine;
} else if (typeof global != 'undefined') {
  global.yurine = yurine;
}

/* harmony default export */ __webpack_exports__["default"] = (yurine);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/_webpack@4.27.1@webpack/buildin/global.js */ "./node_modules/_webpack@4.27.1@webpack/buildin/global.js")))

/***/ }),

/***/ "./src/reset.js":
/*!**********************!*\
  !*** ./src/reset.js ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
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
  fontFamily: 'sans-serif',
  fontColor: '#000',
  fontStyle: 'normal',
  fontWeight: 400,
  lineHeight: 24,
  borderTopWidth: 0,
  borderRightWidth: 0,
  borderBottomWidth: 0,
  borderLeftWidth: 0,
  borderTopStyle: 'solid',
  borderRightStyle: 'solid',
  borderBottomStyle: 'solid',
  borderLeftStyle: 'solid'
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
  isNumber: isType('Number'),
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