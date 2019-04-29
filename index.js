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

/***/ "./src/Canvas.js":
/*!***********************!*\
  !*** ./src/Canvas.js ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Dom */ "./src/Dom.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util */ "./src/util.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }



var uuid = 0;

function getDom(dom) {
  if (_util__WEBPACK_IMPORTED_MODULE_1__["default"].isString(dom)) {
    var o = document.querySelector(dom);

    if (!o) {
      throw new Error('can not find dom of selector: ' + dom);
    }

    return o;
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
    _this.__uuid = uuid++; // 缺省默认canvas的宽高设置

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

    return _this;
  }

  _createClass(Canvas, [{
    key: "toString",
    value: function toString() {
      var res = '<canvas'; // 拼接处理属性

      for (var i = 0, len = this.__props.length; i < len; i++) {
        var item = this.__props[i];
        var s = renderProp(item[0], item[1]);
        res += s;
      }

      res += ' karas-uuid=' + this.uuid;
      res += '></canvas>';
      return res;
    }
  }, {
    key: "appendTo",
    value: function appendTo(dom) {
      var s = this.toString();
      dom = getDom(dom);
      dom.insertAdjacentHTML('beforeend', s);
      this.__element = dom.querySelector("canvas[karas-uuid=\"".concat(this.uuid, "\"]"));
      this.__ctx = this.__element.getContext('2d');

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
    key: "uuid",
    get: function get() {
      return this.__uuid;
    }
  }, {
    key: "element",
    get: function get() {
      return this.__element;
    }
  }]);

  return Canvas;
}(_Dom__WEBPACK_IMPORTED_MODULE_0__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (Canvas);

/***/ }),

/***/ "./src/Dom.js":
/*!********************!*\
  !*** ./src/Dom.js ***!
  \********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Element */ "./src/Element.js");
/* harmony import */ var _Text__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Text */ "./src/Text.js");
/* harmony import */ var _LineGroup__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./LineGroup */ "./src/LineGroup.js");
/* harmony import */ var _geom_Geom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./geom/Geom */ "./src/geom/Geom.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./util */ "./src/util.js");
/* harmony import */ var _reset__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./reset */ "./src/reset.js");
/* harmony import */ var _font__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./font */ "./src/font.js");
/* harmony import */ var _css__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./css */ "./src/css.js");
/* harmony import */ var _unit__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./unit */ "./src/unit.js");
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

function getLineHeightByFontAndLineHeight(fontSize, lineHeight) {
  if (lineHeight <= 0) {
    return Math.ceil(fontSize * _font__WEBPACK_IMPORTED_MODULE_6__["default"].arial.lhr);
  }

  return Math.max(lineHeight, Math.ceil(fontSize * _font__WEBPACK_IMPORTED_MODULE_6__["default"].arial.car));
}

function getBaseLineByFont(fontSize) {
  return Math.ceil(fontSize * _font__WEBPACK_IMPORTED_MODULE_6__["default"].arial.blr);
}

var Dom =
/*#__PURE__*/
function (_Element) {
  _inherits(Dom, _Element);

  function Dom(tagName, props, children) {
    var _this;

    _classCallCheck(this, Dom);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Dom).call(this, props));
    _this.__tagName = tagName;
    _this.__children = children;
    _this.__style = {}; // style被解析后的k-v形式

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

      if (this.style.display === 'inline-block') {
        for (var _i = list.length - 1; _i >= 0; _i--) {
          var _item = list[_i];

          if (_item instanceof Dom && _item.style.display !== 'inline-block') {
            throw new Error('inline-block can not contain block');
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
    } // 合并设置style，包括继承和默认值，修改一些自动值和固定值

  }, {
    key: "__initStyle",
    value: function __initStyle() {
      var style = this.style;
      Object.assign(style, _reset__WEBPACK_IMPORTED_MODULE_5__["default"], this.props.style); // 仅支持flex/block/inline-block

      if (!style.display || ['flex', 'block', 'inline-block'].indexOf(style.display) === -1) {
        if (INLINE.hasOwnProperty(this.tagName)) {
          style.display = 'inline-block';
        } else {
          style.display = 'block';
        }
      }

      var parent = this.parent;

      if (parent) {
        var parentStyle = parent.style; // 继承父元素样式

        ['fontSize', 'lineHeight'].forEach(function (k) {
          if (!style.hasOwnProperty(k) && parentStyle.hasOwnProperty(k)) {
            style[k] = parentStyle[k];
          }
        }); // flex的children不能为inline

        if (parentStyle.display === 'flex' && style.display === 'inline-block') {
          style.display = 'block';
        }
      }

      this.children.forEach(function (item) {
        if (item instanceof Dom) {
          item.__initStyle();
        } else if (item instanceof _geom_Geom__WEBPACK_IMPORTED_MODULE_3__["default"]) {
          item.__initStyle();
        }
      }); // 防止小行高，仅支持lineHeight>=1的情况

      var fontSize = style.fontSize,
          lineHeight = style.lineHeight;
      lineHeight = getLineHeightByFontAndLineHeight(fontSize, lineHeight);
      style.lineHeight = lineHeight;
      _css__WEBPACK_IMPORTED_MODULE_7__["default"].normalize(style);
    } // 给定父宽度情况下，尝试行内放下后的剩余宽度，可能为负数即放不下

  }, {
    key: "__tryLayInline",
    value: function __tryLayInline(w) {
      var children = this.children,
          ctx = this.ctx,
          style = this.style;

      for (var i = 0; i < children.length; i++) {
        // 当放不下时直接返回，无需继续多余的尝试计算
        if (w < 0) {
          return w;
        }

        var item = children[i];

        if (item instanceof Dom) {
          w = item.__tryLayInline(w);
        } else {
          ctx.font = _css__WEBPACK_IMPORTED_MODULE_7__["default"].setFontStyle(style);
          w -= ctx.measureText(item.content).width;
        }
      }

      return w;
    } // 处理已布置好x的line组，并返回line高

  }, {
    key: "__preLayLine",
    value: function __preLayLine(line, options) {
      var lineHeight = options.lineHeight;
      var lh = lineHeight;
      var baseLine = 0;
      line.forEach(function (item) {
        lh = Math.max(lh, item.height);
        baseLine = Math.max(baseLine, item.baseLine);
      }); // 设置此inline的baseLine，可能多次执行，最后一次设置为最后一行line的baseLine

      this.__baseLine = baseLine;
      line.forEach(function (item) {
        var diff = baseLine - item.baseLine;

        if (item instanceof Dom) {
          item.__offsetY(diff);
        } else {
          item.__y += diff;
        }
      });
      return lh;
    } // 设置y偏移值，递归包括children，此举在初步确定inline布局后设置元素vertical-align用

  }, {
    key: "__offsetY",
    value: function __offsetY(diff) {
      this.__y += diff;
      this.children.forEach(function (item) {
        if (item instanceof Dom) {
          item.__offsetY(diff);
        } else {
          item.__y += diff;
        }
      });
    } // 元素自动换行后的最大宽度

  }, {
    key: "__linefeedWidth",
    value: function __linefeedWidth(includeWidth) {
      var children = this.children,
          ctx = this.ctx,
          style = this.style;
      var w = 0;
      children.forEach(function (item) {
        if (item instanceof Dom) {
          w = Math.max(item.__linefeedWidth(true));
        } else {
          ctx.font = _css__WEBPACK_IMPORTED_MODULE_7__["default"].setFontStyle(style);

          if (style.wordBreak === 'break-all') {
            var tw = 0;
            var content = item.content;
            var len = content.length;

            for (var i = 0; i < len; i++) {
              tw = Math.max(tw, ctx.measureText(content.charAt(i)).width);
            }

            w = Math.max(w, tw);
          } else {
            w = Math.max(w, ctx.measureText(item.content).width);
          }
        }
      }); // flexBox的子项不考虑width影响，但孙子项且父元素不是flex时考虑

      if (includeWidth && this.parent.style.display !== 'flex') {
        var width = style.width;

        switch (width.unit) {
          case _unit__WEBPACK_IMPORTED_MODULE_8__["default"].PX:
            w = Math.max(w, width.value);
            break;

          case _unit__WEBPACK_IMPORTED_MODULE_8__["default"].PERCENT:
            w = Math.max(w, width.value * 0.01 * this.parent.width);
            break;
        }
      }

      return Math.ceil(w);
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
          ctx = this.ctx,
          style = this.style;
      var width = style.width,
          height = style.height,
          lineHeight = style.lineHeight; // 除了auto外都是固定高度

      var fixedHeight;

      if (width && width.unit !== _unit__WEBPACK_IMPORTED_MODULE_8__["default"].AUTO) {
        switch (width.unit) {
          case _unit__WEBPACK_IMPORTED_MODULE_8__["default"].PX:
            w = width.value;
            break;
        }
      }

      if (height && height.unit !== _unit__WEBPACK_IMPORTED_MODULE_8__["default"].AUTO) {
        fixedHeight = true;

        switch (height.unit) {
          case _unit__WEBPACK_IMPORTED_MODULE_8__["default"].PX:
            h = height.value;
            break;
        }
      }

      var lineGroup = new _LineGroup__WEBPACK_IMPORTED_MODULE_2__["default"](x, y);
      children.forEach(function (item) {
        if (item instanceof Dom) {
          if (item.style.display === 'inline-block') {
            // inline开头，不用考虑是否放得下直接放
            if (x === data.x) {
              lineGroup.add(item);

              item.__preLayInline({
                x: x,
                y: y,
                w: w
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

                  lineGroup.calculate();
                  lineGroup.adjust();
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

              lineGroup.calculate();
              lineGroup.adjust();
              y += lineGroup.height;
              lineGroup = new _LineGroup__WEBPACK_IMPORTED_MODULE_2__["default"](x, y);
            }

            item.__preLay({
              x: x,
              y: y,
              w: w
            });

            y += item.height;
          }
        } else if (item instanceof _geom_Geom__WEBPACK_IMPORTED_MODULE_3__["default"]) {
          // 图形也是block先处理之前可能的行
          if (lineGroup.size) {
            _this4.lineGroups.push(lineGroup);

            lineGroup.calculate();
            lineGroup.adjust();
            y += lineGroup.height;
            lineGroup = new _LineGroup__WEBPACK_IMPORTED_MODULE_2__["default"](x, y);
          }

          item.__preLay({
            x: x,
            y: y,
            w: w
          });

          y += item.height;
        } // 文字和inline类似
        else {
            ctx.font = _css__WEBPACK_IMPORTED_MODULE_7__["default"].setFontStyle(style);
            var tw = ctx.measureText(item.content).width;

            if (x + tw > w) {
              _this4.lineGroups.push(lineGroup);

              lineGroup.calculate();
              lineGroup.adjust();
              x = data.x;
              y += lineGroup.height;
              item.__x = x;
              item.__y = y;
              item.__width = tw;
              item.__height = lineHeight;
              item.__baseLine = getBaseLineByFont(style.fontSize);
              lineGroup = new _LineGroup__WEBPACK_IMPORTED_MODULE_2__["default"](x, y);
            } else {
              item.__x = x;
              item.__y = y;
              item.__width = tw;
              item.__height = lineHeight;
              item.__baseLine = getBaseLineByFont(style.fontSize);
            }

            x += tw;
            lineGroup.add(item);
          }
      }); // 结束后处理可能遗留的最后的lineGroup

      if (lineGroup.size) {
        this.lineGroups.push(lineGroup);
        lineGroup.calculate();
        lineGroup.adjust();
        y += lineGroup.height;
      }

      var len = this.lineGroups.length;

      if (len) {
        var last = this.lineGroups[len - 1]; // 本身baseLine即是最后一个lineGroup/lineBlock的baseLine

        this.__baseLine = last.y - this.y + last.baseLine;
      }

      this.__width = w;
      this.__height = fixedHeight ? h : y - data.y;
    } // 弹性布局时的计算位置

  }, {
    key: "__preLayFlex",
    value: function __preLayFlex(data) {
      var x = data.x,
          y = data.y,
          w = data.w;
      this.__x = x;
      this.__y = y;
      this.__width = w;
      var children = this.children,
          ctx = this.ctx,
          style = this.style;
      var grow = [];
      var lfw = [];
      children.forEach(function (item) {
        if (item instanceof Dom) {
          grow.push(item.style.flexGrow);
          var width = item.style.width;

          if (width.unit === _unit__WEBPACK_IMPORTED_MODULE_8__["default"].PERCENT) {
            lfw.push(width.value * w);
          } else if (width.unit === _unit__WEBPACK_IMPORTED_MODULE_8__["default"].PX) {
            lfw.push(width.value);
          } else {
            lfw.push(item.__linefeedWidth());
          }
        } else if (item instanceof _geom_Geom__WEBPACK_IMPORTED_MODULE_3__["default"]) {
          grow.push(item.style.flexGrow);
          var _width = item.style.width;

          if (_width.unit === _unit__WEBPACK_IMPORTED_MODULE_8__["default"].PERCENT) {
            lfw.push(_width.value * w);
          } else if (_width.unit === _unit__WEBPACK_IMPORTED_MODULE_8__["default"].PX) {
            lfw.push(_width.value);
          } else {
            lfw.push(-1);
          }
        } else {
          grow.push(0);
          ctx.font = _css__WEBPACK_IMPORTED_MODULE_7__["default"].setFontStyle(style);

          if (style.wordBreak === 'break-all') {
            var tw = 0;
            var content = item.content;
            var len = content.length;

            for (var i = 0; i < len; i++) {
              tw = Math.max(tw, ctx.measureText(content.charAt(i)).width);
            }

            lfw.push(tw);
          } else {
            var _tw = ctx.measureText(item.content).width;
            lfw.push(_tw);
          }
        }
      }); // 全部最小自适应宽度和

      var sum = 0;
      lfw.forEach(function (item) {
        sum += item;
      }); // TODO: 和大于等于可用宽度时，grow属性无效

      if (sum >= w) {} else {
        var free = w;
        var total = 0; // 获取固定和弹性的子项

        var fixIndex = [];
        var flexIndex = [];
        grow.forEach(function (item, i) {
          if (item === 0) {
            free -= lfw[i];
            fixIndex.push(i);
          } else {
            flexIndex.push(i);
            total += item;
          }
        }); // 除首位各自向下取整计算占用宽度，首位使用差值剩余的宽度

        var per = free / total;
        var space = [];

        for (var i = 1; i < flexIndex.length; i++) {
          var n = Math.floor(per * grow[flexIndex[i]]);
          space.push(n);
          free -= n;
        }

        space.unshift(free); // 固定和弹性最终组成连续的占用宽度列表进行布局

        var count = 0;
        grow.forEach(function (item, i) {
          var child = children[i];

          if (item === 0) {
            child.__preLay({
              x: x,
              y: y,
              w: lfw[i]
            });

            x += lfw[i];
          } else {
            child.__preLay({
              x: x,
              y: y,
              w: space[count]
            });

            x += space[count++];
          }
        });
      }

      var h = 0;
      children.forEach(function (item) {
        h = Math.max(h, item.height);
      });
      this.__height = h;
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
          ctx = this.ctx,
          style = this.style;
      var width = style.width,
          height = style.height,
          lineHeight = style.lineHeight; // 除了auto外都是固定高度

      var fixedWidth;
      var fixedHeight;

      if (width && width.unit !== _unit__WEBPACK_IMPORTED_MODULE_8__["default"].AUTO) {
        fixedWidth = true;

        switch (width.unit) {
          case _unit__WEBPACK_IMPORTED_MODULE_8__["default"].PX:
            w = width.value;
            break;
        }
      }

      if (height && height.unit !== _unit__WEBPACK_IMPORTED_MODULE_8__["default"].AUTO) {
        fixedHeight = true;

        switch (height.unit) {
          case _unit__WEBPACK_IMPORTED_MODULE_8__["default"].PX:
            h = height.value;
            break;
        }
      }

      var line = [];
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

                lineGroup.calculate();
                lineGroup.adjust();
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
        } // inline里的其它可能只有文本
        else {
            ctx.font = _css__WEBPACK_IMPORTED_MODULE_7__["default"].setFontStyle(style);
            var tw = ctx.measureText(item.content).width; // inline开头

            if (x === data.x) {
              item.__x = x;
              item.__y = y;
              item.__width = tw;
              item.__height = lineHeight;
              item.__baseLine = getBaseLineByFont(style.fontSize);
              x += tw;
              maxX = Math.max(maxX, x);
              line.push(item);
              lineGroup.add(item);
            } else {
              if (x + tw > w) {} else {
                item.__x = x;
                item.__y = y;
                item.__width = tw;
                item.__height = lineHeight;
                item.__baseLine = getBaseLineByFont(style.fontSize);
                x += tw;
                maxX = Math.max(maxX, x);
                line.push(item);
                lineGroup.add(item);
              }
            }
          }
      }); // 结束后处理可能遗留的最后的lineGroup，children为空时可能size为空

      if (lineGroup.size) {
        this.lineGroups.push(lineGroup);
        lineGroup.calculate();
        lineGroup.adjust();
        y += lineGroup.height;
      }

      var len = this.lineGroups.length;

      if (len) {
        var last = this.lineGroups[len - 1]; // 本身baseLine即是最后一个lineGroup/lineBlock的baseLine

        this.__baseLine = last.y - this.y + last.baseLine;
      } // 元素的width不能超过父元素w


      this.__width = fixedWidth ? w : maxX - data.x;
      this.__height = fixedHeight ? h : y - data.y;
    }
  }, {
    key: "render",
    value: function render() {
      var ctx = this.ctx,
          style = this.style; // 简化负边距、小行高、行内背景优先等逻辑

      this.children.forEach(function (item) {
        if (item instanceof Dom || item instanceof _geom_Geom__WEBPACK_IMPORTED_MODULE_3__["default"]) {
          item.render();
        } else {
          ctx.font = _css__WEBPACK_IMPORTED_MODULE_7__["default"].setFontStyle(style);
          ctx.fillText(item.content, item.x, item.y + item.baseLine);
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
    key: "style",
    get: function get() {
      return this.__style;
    }
  }, {
    key: "lineGroups",
    get: function get() {
      return this.__lineGroups;
    }
  }], [{
    key: "isValid",
    value: function isValid(s) {
      return TAG_NAME.hasOwnProperty(s);
    }
  }]);

  return Dom;
}(_Element__WEBPACK_IMPORTED_MODULE_0__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (Dom);

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
    this.__baseLine = 0;
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
  }, {
    key: "baseLine",
    get: function get() {
      return this.__baseLine;
    }
  }]);

  return Element;
}();

/* harmony default export */ __webpack_exports__["default"] = (Element);

/***/ }),

/***/ "./src/LineGroup.js":
/*!**************************!*\
  !*** ./src/LineGroup.js ***!
  \**************************/
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
    key: "calculate",
    value: function calculate() {
      this.__height = this.__calHeight();
      this.__baseLine = this.__calBaseLine();
    }
  }, {
    key: "adjust",
    value: function adjust() {
      var _this = this;

      // 仅当有2个和以上时才需要vertical对齐调整
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

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }



var Text =
/*#__PURE__*/
function (_Element) {
  _inherits(Text, _Element);

  function Text(content) {
    var _this;

    _classCallCheck(this, Text);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Text).call(this, []));
    _this.__content = content.toString();
    _this.__lineBoxes = [];
    return _this;
  }

  _createClass(Text, [{
    key: "content",
    get: function get() {
      return this.__content;
    }
  }, {
    key: "lineBoxes",
    get: function get() {
      return this.__lineBoxes;
    }
  }]);

  return Text;
}(_Element__WEBPACK_IMPORTED_MODULE_0__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (Text);

/***/ }),

/***/ "./src/config.js":
/*!***********************!*\
  !*** ./src/config.js ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _reset__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./reset */ "./src/reset.js");

var dpr = 1;
/* harmony default export */ __webpack_exports__["default"] = ({
  get devicePixelRatio() {
    return dpr;
  },

  set devicePixelRatio(v) {
    dpr = v;
    _reset__WEBPACK_IMPORTED_MODULE_0__["default"].fontSize = 16 * v;
  }

});

/***/ }),

/***/ "./src/css.js":
/*!********************!*\
  !*** ./src/css.js ***!
  \********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _unit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./unit */ "./src/unit.js");


function normalize(style) {
  ['marginTop', 'marginRight', 'marginDown', 'marginLeft', 'paddingTop', 'paddingRight', 'paddingDown', 'paddingLeft', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'width', 'height'].forEach(function (k) {
    var v = style[k];

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
      v = parseInt(v) || 0;
      style[k] = {
        value: Math.max(v, 0),
        unit: _unit__WEBPACK_IMPORTED_MODULE_0__["default"].PX
      };
    }
  });
}

function setFontStyle(style) {
  var fontStyle = style.fontStyle,
      fontWeight = style.fontWeight,
      fontSize = style.fontSize,
      fontFamily = style.fontFamily;
  return "".concat(fontStyle, " ").concat(fontWeight, " ").concat(fontSize, "px/").concat(fontSize, "px ").concat(fontFamily);
}

/* harmony default export */ __webpack_exports__["default"] = ({
  normalize: normalize,
  setFontStyle: setFontStyle
});

/***/ }),

/***/ "./src/font.js":
/*!*********************!*\
  !*** ./src/font.js ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);


/* harmony default export */ __webpack_exports__["default"] = ({
  arial: {
    lhr: 1.14990234375,
    // 默认line-height ratio
    car: 1.1172,
    // content-area ratio
    blr: 0.9052734375,
    // base-line ratio
    mdr: 0.64599609375,
    // middle ratio
    lgr: 0.03271484375 // line-gap ratio

  }
});

/***/ }),

/***/ "./src/geom/Geom.js":
/*!**************************!*\
  !*** ./src/geom/Geom.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Element */ "./src/Element.js");
/* harmony import */ var _reset__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../reset */ "./src/reset.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../util */ "./src/util.js");
/* harmony import */ var _css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../css */ "./src/css.js");
/* harmony import */ var _unit__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../unit */ "./src/unit.js");
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
function (_Element) {
  _inherits(Geom, _Element);

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

      Object.assign(style, _reset__WEBPACK_IMPORTED_MODULE_1__["default"], this.props.style, {
        display: 'block'
      });
      _css__WEBPACK_IMPORTED_MODULE_3__["default"].regularized(style);
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

      if (width.unit === _unit__WEBPACK_IMPORTED_MODULE_4__["default"].PERCENT) {
        this.__width = Math.ceil(width.value * h);
      } else if (width.unit === _unit__WEBPACK_IMPORTED_MODULE_4__["default"].PX) {
        this.__width = width.value;
      } else {
        this.__width = w;
      }

      if (height.unit === _unit__WEBPACK_IMPORTED_MODULE_4__["default"].PERCENT) {
        this.__height = Math.ceil(height.value * h);
      } else if (height.unit === _unit__WEBPACK_IMPORTED_MODULE_4__["default"].PX) {
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
}(_Element__WEBPACK_IMPORTED_MODULE_0__["default"]);

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
/* harmony import */ var _Canvas__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Canvas */ "./src/Canvas.js");
/* harmony import */ var _Dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Dom */ "./src/Dom.js");
/* harmony import */ var _geom_Geom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./geom/Geom */ "./src/geom/Geom.js");
/* harmony import */ var _geom_Line__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./geom/Line */ "./src/geom/Line.js");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./config */ "./src/config.js");





var karas = {
  render: function render(canvas, dom) {
    if (!canvas instanceof _Canvas__WEBPACK_IMPORTED_MODULE_0__["default"]) {
      throw new Error('render root muse be canvas');
    }

    if (dom) {
      canvas.appendTo(dom);
    }

    return canvas;
  },
  createDom: function createDom(tagName, props, children) {
    if (tagName === 'canvas') {
      return new _Canvas__WEBPACK_IMPORTED_MODULE_0__["default"](props, children);
    }

    if (_geom_Geom__WEBPACK_IMPORTED_MODULE_2__["default"].isValid(tagName)) {
      switch (tagName) {
        case 'line':
          return new _geom_Line__WEBPACK_IMPORTED_MODULE_3__["default"](props);
      }
    }

    if (_Dom__WEBPACK_IMPORTED_MODULE_1__["default"].isValid(tagName)) {
      return new _Dom__WEBPACK_IMPORTED_MODULE_1__["default"](tagName, props, children);
    }

    throw new Error('can not use marker: ' + tagName);
  },
  createVd: function createVd(tagName, props, children) {
    if (tagName === 'canvas') {
      return new _Canvas__WEBPACK_IMPORTED_MODULE_0__["default"](props, children);
    }

    if (_Dom__WEBPACK_IMPORTED_MODULE_1__["default"].isValid(tagName)) {
      return new _Dom__WEBPACK_IMPORTED_MODULE_1__["default"](tagName, props, children);
    }

    throw new Error('can not use marker: ' + tagName);
  },
  createGp: function createGp(tagName, props) {
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
  createCp: function createCp(tagName, props, children) {},
  // Line,
  config: _config__WEBPACK_IMPORTED_MODULE_4__["default"]
};

if (typeof window != 'undefined') {
  window.karas = karas;
}

/* harmony default export */ __webpack_exports__["default"] = (karas);

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
  lineHeight: 0,
  // normal
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
  flex: 0,
  flexGrow: 0
});

/***/ }),

/***/ "./src/unit.js":
/*!*********************!*\
  !*** ./src/unit.js ***!
  \*********************/
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