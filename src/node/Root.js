import Xom from './Xom';
import Dom from './Dom';
import Text from './Text';
import Component from './Component';
import Defs from './Defs';
import Geom from './geom/Geom';
import builder from './builder';
import util from '../util/util';
import domDiff from '../util/diff';
import unit from '../style/unit';
import geom from '../math/geom';
import enums from '../util/enums';
import inject from '../util/inject';
import Event from '../util/Event';
import frame from '../animate/frame';
import Controller from '../animate/Controller';
import mode from '../refresh/mode';
import change from '../refresh/change';
import level from '../refresh/level';
import struct from '../refresh/struct';
import reflow from '../refresh/reflow';
import webgl from '../gl/webgl';
import ca from '../gl/ca';
import vertex from '../gl/main.vert';
import fragment from '../gl/main.frag';
import vertexMask from '../gl/mask.vert';
import fragmentMask from '../gl/mask.frag';
import fragmentClip from '../gl/clip.frag';
import vertexOverflow from '../gl/overflow.vert';
import fragmentOverflow from '../gl/overflow.frag';
import vertexCm from '../gl/filter/cm.vert';
import fragmentCm from '../gl/filter/cm.frag';
import vertexDs from '../gl/filter/drops.vert'
import fragmentDs from '../gl/filter/drops.frag';
import vertexMbm from '../gl/mbm/mbm.vert';
import fragmentMultiply from '../gl/mbm/multiply.frag';
import fragmentScreen from '../gl/mbm/screen.frag';
import fragmentOverlay from '../gl/mbm/overlay.frag';
import fragmentDarken from '../gl/mbm/darken.frag';
import fragmentLighten from '../gl/mbm/lighten.frag';
import fragmentColorDodge from '../gl/mbm/color-dodge.frag';
import fragmentColorBurn from '../gl/mbm/color-burn.frag';
import fragmentHardLight from '../gl/mbm/hard-light.frag';
import fragmentSoftLight from '../gl/mbm/soft-light.frag';
import fragmentDifference from '../gl/mbm/difference.frag';
import fragmentExclusion from '../gl/mbm/exclusion.frag';
import fragmentHue from '../gl/mbm/hue.frag';
import fragmentSaturation from '../gl/mbm/saturation.frag';
import fragmentColor from '../gl/mbm/color.frag';
import fragmentLuminosity from '../gl/mbm/luminosity.frag';
import vertexSs from '../gl/ss.vert';
import fragmentSs from '../gl/ss.frag';

const {
  STYLE_KEY: {
    TOP,
    RIGHT,
    BOTTOM,
    LEFT,
    POSITION,
    DISPLAY,
    VISIBILITY,
    COLOR,
    WIDTH,
    HEIGHT,
    Z_INDEX,
    POINTER_EVENTS,
    WRITING_MODE,
    TEXT_STROKE_COLOR,
    TEXT_STROKE_WIDTH,
    TEXT_STROKE_OVER,
    MATRIX,
    TRANSFORM,
    OPACITY,
    MIX_BLEND_MODE,
  },
} = enums;
const { isNil, isFunction } = util;
const { PX, INHERIT } = unit;
const {
  getLevel,
  isRepaint,
  NONE,
  FILTER: FT,
  PERSPECTIVE: PPT,
  REPAINT,
  REFLOW,
  REBUILD,
  CACHE,
  TRANSFORM: TF,
  TRANSFORM_ALL,
  OPACITY: OP,
  MIX_BLEND_MODE: MBM,
  MASK,
} = level;
const { isGeom } = change;
const { renderCanvas, renderSvg, renderWebgl } = struct;

const ROOT_DOM_NAME = {
  canvas: 'canvas',
  svg: 'svg',
  webgl: 'canvas',
};

function getDom(dom) {
  if(util.isString(dom) && dom) {
    let o = document.querySelector(dom);
    if(!o) {
      throw new Error('Can not find dom of selector: ' + dom);
    }
    return o;
  }
  if(!dom) {
    throw new Error('Can not find dom: ' + dom);
  }
  return dom;
}

function renderProp(k, v) {
  let s = Array.isArray(v) ? util.joinSourceArray(v) : util.stringify(v);
  if(k === 'className') {
    k = 'class';
  }
  else if(k === 'style') {
    return '';
  }
  return ' ' + k + '="' + util.encodeHtml(s, true) + '"';
}

const EVENT_LIST = ['click', 'dblclick', 'mousedown', 'mousemove', 'mouseup', 'touchstart', 'touchmove', 'touchend', 'touchcancel'];

function initEvent(dom, Root) {
  let list = [];
  EVENT_LIST.forEach(type => {
    function cb(e) {
      let root = dom.__root;
      if(root && root instanceof Root) {
        if(['touchend', 'touchcancel', 'touchmove'].indexOf(type) > -1) {
          let target = root.__touchstartTarget;
          let event = root.__wrapEvent(e);
          event.target = target;
          while(target) {
            target.__emitEvent(event, null, true);
            target = target.__domParent;
          }
        }
        else {
          root.__cb(e);
        }
      }
    }
    dom.addEventListener(type, cb);
    list.push([type, cb]);
  });
  return list;
}

function removeEvent(dom, list) {
  list.forEach(item => {
    dom.removeEventListener(item[0], item[1]);
  });
}

let uuid = 0;

class Root extends Dom {
  constructor(tagName, props, children) {
    super(tagName, props, children);
    this.__dom = null; // 真实DOM引用
    this.__mw = 0; // 记录最大宽高，防止尺寸变化清除不完全
    this.__mh = 0;
    // this.__scx = 1; // 默认缩放，css改变canvas/svg缩放后影响事件坐标，有值手动指定，否则自动计算
    // this.__scy = 1;
    this.__task = [];
    this.__ref = {};
    this.__animateController = new Controller();
    Event.mix(this);
    this.__uuid = uuid++;
    this.__rlv = REBUILD; // 每次刷新最大lv
    this.__lastUpdateP = null; // 每帧addUpdate都会向上检查，很多时候同级无需继续，第一次检查暂存parent对象
    builder.buildRoot(this, this.__children);
  }

  __initProps() {
    let w = this.props.width;
    if(!isNil(w)) {
      let value = parseFloat(w) || 0;
      if(value > 0) {
        this.__width = value;
      }
    }
    let h = this.props.height;
    if(!isNil(h)) {
      let value = parseFloat(h) || 0;
      if(value > 0) {
        this.__height = value;
      }
    }
  }

  __genHtml(domName) {
    let res = `<${domName}`;
    // 拼接处理属性
    Object.keys(this.props).forEach(k => {
      let v = this.props[k];
      // 忽略事件
      if(!/^on[a-zA-Z]/.test(k)) {
        res += renderProp(k, v);
      }
    });
    res += `></${domName}>`;
    return res;
  }

  __wrapEvent(e) {
    let x, y;
    // 触摸结束取消特殊没有touches
    if(['touchend', 'touchcancel'].indexOf(e.type) === -1) {
      let { dom, __scx, __scy } = this;
      let { x: x2, y: y2, left, top, width, height } = dom.getBoundingClientRect();
      x = x2 || left || 0;
      y = y2 || top || 0;
      let { clientX, clientY } = e.touches ? e.touches[0] : e;
      x = clientX - x;
      y = clientY - y;
      // 外边的scale影响元素事件响应，根据倍数计算真实的坐标，优先手动指定，否则自动计算
      if(!isNil(__scx)) {
        x /= __scx;
      }
      else {
        x *= this.__width / width;
      }
      if(!isNil(__scy)) {
        y /= __scy;
      }
      else {
        y *= this.__height / height;
      }
    }
    return {
      event: e,
      stopPropagation() {
        this.__stopPropagation = true;
        e.stopPropagation();
      },
      stopImmediatePropagation() {
        this.__stopPropagation = true;
        this.__stopImmediatePropagation = true;
        e.stopImmediatePropagation();
      },
      preventDefault() {
        e.preventDefault();
      },
      x,
      y,
      __hasEmitted: false,
    };
  }

  // 类似touchend/touchcancel/touchmove这种无需判断是否发生于元素上，直接响应
  __cb(e) {
    if(e.type === 'touchmove' && !this.__touchstartTarget) {
      return;
    }
    let data = this.__wrapEvent(e);
    this.__emitEvent(data, null, false);
    return data;
  }

  /**
   * 添加到真实Dom上，优先已存在的同名canvas/svg节点，没有则dom下生成新的
   * @param dom
   */
  appendTo(dom) {
    dom = getDom(dom);
    this.__isDestroyed = false;
    this.__initProps();
    let tagName = this.tagName;
    let domName = ROOT_DOM_NAME[tagName];
    // OffscreenCanvas兼容，包含worker的
    if(typeof window !== 'undefined' && window.OffscreenCanvas && (dom instanceof window.OffscreenCanvas)
      || typeof self !== 'undefined' && self.OffscreenCanvas && (dom instanceof self.OffscreenCanvas)) {
      this.__dom = dom;
      this.__width = dom.width;
      this.__height = dom.height;
    }
    // 已有root节点
    else if(dom.nodeName.toLowerCase() === domName) {
      this.__dom = dom;
      if(this.__width) {
        dom.setAttribute('width', this.__width);
      }
      if(this.__height) {
        dom.setAttribute('height', this.__height);
      }
    }
    // 没有canvas/svg节点则生成一个新的
    else {
      this.__dom = dom.querySelector(domName);
      if(!this.__dom) {
        dom.innerHTML = this.__genHtml(domName);
        this.__dom = dom.querySelector(domName);
      }
    }
    // 没有设置width/height则采用css计算形式
    if(!this.__width || !this.__height) {
      let domCss = window.getComputedStyle(dom, null);
      if(!this.__width) {
        this.__width = parseFloat(domCss.getPropertyValue('width')) || 0;
        dom.setAttribute('width', this.width);
      }
      if(!this.__height) {
        this.__height = parseFloat(domCss.getPropertyValue('height')) || 0;
        dom.setAttribute('height', this.height);
      }
    }
    // 最终无宽高给出警告
    if(!this.__width || !this.__height) {
      inject.warn('Karas render target with a width or height of 0.')
    }
    let params = Object.assign({}, ca, this.props.contextAttributes);
    // 只有canvas有ctx，svg用真实dom
    if(tagName === 'canvas') {
      this.__ctx = this.__dom.getContext('2d', params);
      this.__renderMode = mode.CANVAS;
    }
    else if(tagName === 'svg') {
      this.__defs = this.dom.__defs || Defs.getInstance(this.__uuid);
      this.__renderMode = mode.SVG;
    }
    else if(tagName === 'webgl') {
      // 优先手动指定，再自动判断，最后兜底
      let gl, webgl2 = this.props.webgl2;
      if(!isNil(webgl2)) {
        if(webgl2) {
          gl = this.__dom.getContext('webgl2', params);
        }
        if(!gl) {
          gl = this.__dom.getContext('webgl', params);
        }
        this.__ctx = gl;
      }
      else {
        gl = this.__ctx = this.__dom.getContext('webgl2', params)
          || this.__dom.getContext('webgl', params);
      }
      this.__initShader(gl);
      this.__renderMode = mode.WEBGL;
    }
    this.draw(true);
    // 第一次节点没有__root，渲染一次就有了才能diff
    if(this.__dom.__root && this.__dom.__root instanceof Root) {
      this.__dom.__root.destroy();
    }
    this.__eventCbList = initEvent(this.__dom, Root);
    this.__dom.__root = this;
  }

  __initShader(gl) {
    gl.program = webgl.initShaders(gl, vertex, fragment);
    gl.programMask = webgl.initShaders(gl, vertexMask, fragmentMask);
    gl.programClip = webgl.initShaders(gl, vertexMask, fragmentClip);
    gl.programOverflow = webgl.initShaders(gl, vertexOverflow, fragmentOverflow);
    gl.programCm = webgl.initShaders(gl, vertexCm, fragmentCm);
    gl.programDs = webgl.initShaders(gl, vertexDs, fragmentDs);
    gl.programMbmMp = webgl.initShaders(gl, vertexMbm, fragmentMultiply);
    gl.programMbmSr = webgl.initShaders(gl, vertexMbm, fragmentScreen);
    gl.programMbmOl = webgl.initShaders(gl, vertexMbm, fragmentOverlay);
    gl.programMbmDk = webgl.initShaders(gl, vertexMbm, fragmentDarken);
    gl.programMbmLt = webgl.initShaders(gl, vertexMbm, fragmentLighten);
    gl.programMbmCd = webgl.initShaders(gl, vertexMbm, fragmentColorDodge);
    gl.programMbmCb = webgl.initShaders(gl, vertexMbm, fragmentColorBurn);
    gl.programMbmHl = webgl.initShaders(gl, vertexMbm, fragmentHardLight);
    gl.programMbmSl = webgl.initShaders(gl, vertexMbm, fragmentSoftLight);
    gl.programMbmDf = webgl.initShaders(gl, vertexMbm, fragmentDifference);
    gl.programMbmEx = webgl.initShaders(gl, vertexMbm, fragmentExclusion);
    gl.programMbmHue = webgl.initShaders(gl, vertexMbm, fragmentHue);
    gl.programMbmSt = webgl.initShaders(gl, vertexMbm, fragmentSaturation);
    gl.programMbmCl = webgl.initShaders(gl, vertexMbm, fragmentColor);
    gl.programMbmLm = webgl.initShaders(gl, vertexMbm, fragmentLuminosity);
    gl.programSs = webgl.initShaders(gl, vertexSs, fragmentSs);
    gl.useProgram(gl.program);
  }

  __reLayout() {
    let {
      renderMode,
      width,
      height,
    } = this;
    this.__checkRoot(renderMode, width, height);
    let wm = this.__currentStyle[WRITING_MODE];
    let isUpright = wm.v && wm.v.indexOf('vertical') === 0;
    // 布局分为两步，普通流和定位流，互相递归
    this.__layout({
      x: 0,
      y: 0,
      w: width,
      h: height,
      isUpright,
    }, false, false, false);
    // 绝对布局需要从根开始保存相对坐标系的容器引用，并根据relative/absolute情况变更
    this.__layoutAbs(this, {
      x: 0,
      y: 0,
      w: width,
      h: height,
      isUpright,
    }, null);
    this.__structs = this.__structure(0, 0);
  }

  draw(isFirst) {
    let { isDestroyed, renderMode, ctx, defs } = this;
    if(isDestroyed) {
      return;
    }
    this.__lastUpdateP = null;
    // 首次递归测量整树的继承，后续更改各自更新机制做，防止每次整树遍历；root检查首次直接做，后续在checkUpdate()中插入
    if(isFirst) {
      this.__reLayout();
    }
    if(this.props.noRender) {
      return;
    }
    let rlv = this.__rlv;
    if(renderMode === mode.CANVAS) {
      this.__clearCanvas(ctx);
      renderCanvas(renderMode, ctx, this, isFirst, rlv);
    }
    // svg的特殊diff需要
    else if(renderMode === mode.SVG) {
      defs.clear();
      renderSvg(renderMode, defs, this, isFirst, rlv);
      let nvd = this.virtualDom;
      nvd.defs = defs.value;
      let dom = this.__dom;
      if(dom.__vd) {
        // console.log(this.dom.__vd);
        // console.log(nvd);
        domDiff(dom, dom.__vd, nvd);
      }
      else {
        dom.innerHTML = util.joinVirtualDom(nvd);
      }
      dom.__vd = nvd;
      dom.__defs = defs;
    }
    else if(renderMode === mode.WEBGL) {
      this.__clearWebgl(ctx);
      renderWebgl(renderMode, ctx, this, isFirst, rlv);
    }
    this.emit(Event.REFRESH, rlv);
    this.__rlv = NONE;
  }

  destroy() {
    this.__destroy();
    this.__animateController.__destroy();
    let n = this.dom;
    if(n) {
      removeEvent(n, this.__eventCbList || []);
      n.__root = null;
    }
    let gl = this.ctx;
    if(this.renderMode === mode.WEBGL) {
      [
        'program',
        'programMask',
        'programClip',
        'programOverflow',
        'programCm',
        'programDs',
        'programMbmMp',
        'programMbmSr',
        'programMbmOl',
        'programMbmDk',
        'programMbmLt',
        'programMbmCd',
        'programMbmCb',
        'programMbmHl',
        'programMbmSl',
        'programMbmDf',
        'programMbmEx',
        'programMbmHue',
        'programMbmSt',
        'programMbmCl',
        'programMbmLm',
      ].forEach(k =>  {
        let p = gl[k];
        gl.deleteShader(p.vertexShader);
        gl.deleteShader(p.fragmentShader);
        gl.deleteProgram(p);
      });
      for(let i in gl) {
        if(i.indexOf('programBlur,') === 0) {
          let p = gl[i];
          gl.deleteShader(p.vertexShader);
          gl.deleteShader(p.fragmentShader);
          gl.deleteProgram(p);
        }
      }
    }
  }

  scale(x = 1, y = x) {
    this.__scx = x;
    this.__scy = y;
  }

  resize(w, h, cb) {
    let self = this;
    if(w !== self.width || h !== self.height) {
      self.__width = w;
      self.__height = h;
      self.updateStyle({
        width: w,
        height: h,
      }, cb);
    }
    else if(isFunction(cb)) {
      cb(-1);
    }
  }

  getTargetAtPoint(x, y, includeIgnore) {
    function scan(vd, x, y, path, zPath) {
      let { __x1, __y1, offsetWidth, offsetHeight, matrixEvent, children, zIndexChildren,
        computedStyle: { [DISPLAY]: display, [POINTER_EVENTS]: pointerEvents } } = vd;
      if(!includeIgnore && display === 'none') {
        return;
      }
      if(Array.isArray(zIndexChildren)) {
        for(let i = 0, len = children.length; i < len; i++) {
          children[i].__index__ = i;
        }
        for(let i = zIndexChildren.length - 1; i >= 0; i--) {
          let item = zIndexChildren[i];
          if(item instanceof karas.Text) {
            continue;
          }
          let path2 = path.slice();
          path2.push(item.__index__);
          let zPath2 = zPath.slice();
          zPath2.push(i);
          let res = scan(item, x, y, path2, zPath2);
          if(res) {
            return res;
          }
        }
      }
      if(!includeIgnore && pointerEvents === 'none') {
        return;
      }
      let inThis = geom.pointInQuadrilateral(
        x, y,
        __x1, __y1,
        __x1 + offsetWidth, __y1,
        __x1 + offsetWidth, __y1 + offsetHeight,
        __x1, __y1 + offsetHeight,
        matrixEvent
      );
      if(inThis) {
        return {
          target: vd,
          path,
          zPath,
        };
      }
    }
    return scan(this, x, y, [], []);
  }

  /**
   * 每次刷新前检查root节点的样式，有些固定的修改无效，有些继承的作为根初始化
   * @param renderMode
   * @param width
   * @param height
   * @private
   */
  __checkRoot(renderMode, width, height) {
    let { dom, currentStyle, computedStyle } = this;
    // canvas/svg作为根节点一定是block或flex，不会是inline
    if(['flex', 'block'].indexOf(currentStyle[DISPLAY]) === -1) {
      computedStyle[DISPLAY] = currentStyle[DISPLAY] = 'block';
    }
    // 同理position不能为absolute
    if(currentStyle[POSITION] === 'absolute') {
      computedStyle[POSITION] = currentStyle[POSITION] = 'static';
    }
    // 根节点满宽高
    currentStyle[WIDTH] = { v: width, u: PX };
    currentStyle[HEIGHT] = { v: height, u: PX };
    computedStyle[WIDTH] = width;
    computedStyle[HEIGHT] = height;
    // 可能调用resize()导致变更，要重设，canvas无论离屏与否都可使用直接赋值，svg则按dom属性api
    if(renderMode === mode.CANVAS || renderMode === mode.WEBGL) {
      if(dom.width !== width) {
        dom.width = width;
      }
      if(dom.height !== height) {
        dom.height = height;
      }
    }
    else if(renderMode === mode.SVG) {
      dom.setAttribute('width', width);
      dom.setAttribute('height', height);
    }
  }

  /**
   * 添加更新，分析repaint/reflow和上下影响，异步刷新
   */
  __addUpdate(node, keys, focus, addDom, removeDom, aniParams, cb) {
    if(node instanceof Component) {
      node = node.shadowRoot;
    }
    let {
      __computedStyle: computedStyle,
      __currentStyle: currentStyle,
      __cacheStyle: cacheStyle,
      __cacheProps,
      __mask,
      __domParent,
    } = node;
    let hasZ, hasVisibility, hasColor, hasDisplay, hasTsColor, hasTsWidth, hasTsOver;
    // 可能无keys但有aniParams，多防御一下，比如steps动画
    let lv = focus || (aniParams && keys && keys.length ? aniParams.lv : NONE);
    // 清空对应改变的cacheStyle
    if(keys) {
      if(aniParams) {
        for(let i = 0, len = keys.length; i < len; i++) {
          let k = keys[i];
          cacheStyle[k] = undefined;
        }
        hasZ = aniParams.hasZ;
        hasColor = aniParams.hasColor;
        hasTsColor = aniParams.hasTsColor;
        hasTsWidth = aniParams.hasTsWidth;
        hasTsOver = aniParams.hasTsOver;
      }
      else {
        for(let i = 0, len = keys.length; i < len; i++) {
          let k = keys[i];
          if(node instanceof Geom && isGeom(node.tagName, k)) {
            lv |= REPAINT;
            __cacheProps[k] = undefined;
          }
          else {
            // repaint置空，如果reflow会重新生成空的
            cacheStyle[k] = undefined;
            // TRBL变化只对relative/absolute起作用，其它忽视
            if((k === TOP || k === RIGHT || k === BOTTOM || k === LEFT)
              && ['relative', 'absolute'].indexOf(computedStyle[POSITION]) === -1) {
              continue;
            }
            // 细化等级
            lv |= getLevel(k);
            if(k === DISPLAY) {
              hasDisplay = true;
            }
            else if(k === Z_INDEX) {
              hasZ = node !== this && ['relative', 'absolute'].indexOf(computedStyle[POSITION]) > -1;
            }
            else if(k === VISIBILITY) {
              hasVisibility = true;
            }
            else if(k === COLOR) {
              hasColor = true;
            }
            else if(k === TEXT_STROKE_COLOR) {
              hasTsColor = true;
            }
            else if(k === TEXT_STROKE_WIDTH) {
              hasTsWidth = true;
            }
            else if(k === TEXT_STROKE_OVER) {
              hasTsOver = true;
            }
          }
        }
      }
    }
    // 没有变化，add/remove强制focus
    // 本身节点为none，变更无效，此时没有display变化，add/remove在操作时已经判断不会进入
    if(lv === NONE || computedStyle[DISPLAY] === 'none' && !hasDisplay) {
      if(cb && isFunction(cb)) {
        cb();
      }
      return;
    }
    // transform变化清空重算，比较特殊，MATRIX的cache需手动清理
    if(lv & TF) {
      cacheStyle[MATRIX] = computedStyle[TRANSFORM] = undefined;
    }
    // mask需清除遮罩对象的缓存
    let hasRelease, hasMask = lv & MASK;
    if(__mask || hasMask) {
      let prev = node.__prev;
      while(prev && (prev.__mask)) {
        prev = prev.__prev;
      }
      if(prev && (prev instanceof Xom || prev instanceof Component && prev.shadowRoot instanceof Xom)) {
        prev.__refreshLevel |= CACHE | MASK;
        prev.__struct.hasMask = prev.__hasMask = __mask;
        if(prev.__cacheMask) {
          hasRelease = prev.__cacheMask.release() || hasRelease;
        }
      }
    }
    // aniParams在动画引擎提前计算好了
    let isRp = aniParams && aniParams.isRepaint || isRepaint(lv);
    if(isRp) {
      // dom在>=REPAINT时total失效，svg的Geom比较特殊
      let need = lv >= REPAINT;
      if(need) {
        if(node.__cache) {
          hasRelease = node.__cache.release() || hasRelease;
        }
        node.__calStyle(lv, currentStyle, computedStyle, cacheStyle);
        node.__calPerspective(currentStyle, computedStyle, cacheStyle);
      }
      // < REPAINT特殊的优化computedStyle计算
      else {
        if(lv & PPT) {
          node.__calPerspective(currentStyle, computedStyle, cacheStyle);
        }
        if(lv & TRANSFORM_ALL) {
          // 特殊的ppt需清空cacheTotal
          let o = node.__selfPerspectiveMatrix;
          node.__calMatrix(lv, currentStyle, computedStyle, cacheStyle, aniParams && aniParams.optimize);
          let n = node.__selfPerspectiveMatrix;
          if(!util.equalArr(o, n)) {
            need = true;
          }
        }
        if(lv & OP) {
          computedStyle[OPACITY] = currentStyle[OPACITY];
        }
        if(lv & FT) {
          node.__calFilter(currentStyle, computedStyle, cacheStyle);
        }
        if(lv & MBM) {
          computedStyle[MIX_BLEND_MODE] = currentStyle[MIX_BLEND_MODE];
        }
      }
      // 影响子继承REPAINT的变化，如果被cache住需要清除
      if(hasVisibility || hasColor || hasTsColor || hasTsWidth || hasTsOver) {
        for(let __structs = this.__structs,
              __struct = node.__struct,
              i = __structs.indexOf(__struct) + 1,
              len = i + (__struct.total || 0); i < len; i++) {
          let {
            node,
            total,
          } = __structs[i];
          // text的style指向parent，不用管
          if(node instanceof Text) {
            continue;
          }
          let currentStyle = node.__currentStyle, cacheStyle = node.__cacheStyle;
          let need;
          if(hasVisibility && currentStyle[VISIBILITY].u === INHERIT) {
            need = true;
            cacheStyle[VISIBILITY] = undefined;
          }
          else if(hasColor && currentStyle[COLOR].u === INHERIT) {
            need = true;
            cacheStyle[COLOR] = undefined;
          }
          else if(hasTsColor && currentStyle[TEXT_STROKE_COLOR].u === INHERIT) {
            need = true;
            cacheStyle[TEXT_STROKE_COLOR] = undefined;
          }
          else if(hasTsWidth && currentStyle[TEXT_STROKE_WIDTH].u === INHERIT) {
            need = true;
            cacheStyle[TEXT_STROKE_WIDTH] = undefined;
          }
          else if(hasTsOver && currentStyle[TEXT_STROKE_OVER].u === INHERIT) {
            need = true;
            cacheStyle[TEXT_STROKE_OVER] = undefined;
          }
          if(need) {
            node.__refreshLevel |= REPAINT;
            node.clearCache();
            node.__calStyle(REPAINT, currentStyle, node.__computedStyle, cacheStyle);
          }
          // 不为inherit此子树可跳过，因为不影响
          else {
            i += total || 0;
          }
        }
      }
      // perspective也特殊只清空total的cache，和>=REPAINT清空total共用
      if(need || (lv & PPT)) {
        if(node.__cacheTotal) {
          hasRelease = node.__cacheTotal.release() || hasRelease;
        }
      }
      // mask无论如何都要清除，除非是opacity
      if(node.__hasMask) {
        if(need || (lv ^ OP) || (lv & PPT)) {
          if(node.__cacheMask) {
            hasRelease = node.__cacheMask.release() || hasRelease;
          }
          if(node.__cacheFilter) {
            hasRelease = node.__cacheFilter.release() || hasRelease;
          }
        }
      }
      // 特殊的filter清除cache
      else if((need || (lv & (FT | PPT))) && node.__cacheFilter) {
        hasRelease = node.__cacheFilter.release() || hasRelease;
      }
      // 向上清除cache汇总缓存信息，过程中可能会出现重复，根据refreshLevel判断，reflow已经自己清过了
      if(__domParent !== this.__lastUpdateP) {
        let p = __domParent;
        this.__lastUpdateP = p; // 同层级避免重复进入查找，每次draw()重设
        while(p) {
          if(p.__refreshLevel & (CACHE | REPAINT | REFLOW)) {
            break;
          }
          p.__refreshLevel |= CACHE;
          if(p.__cacheTotal) {
            hasRelease = p.__cacheTotal.release() || hasRelease;
          }
          if(p.__cacheFilter) {
            hasRelease = p.__cacheFilter.release() || hasRelease;
          }
          if(p.__cacheMask) {
            hasRelease = p.__cacheMask.release() || hasRelease;
          }
          p = p.__domParent;
        }
        // 清除parent的zIndexChildren缓存，强制所有孩子重新渲染
        if(hasZ && __domParent) {
          __domParent.__zIndexChildren = null;
          __domParent.__updateStruct();
          if(this.__renderMode === mode.SVG) {
            hasRelease = node.__cacheTotal.release() || hasRelease;
            reflow.clearSvgCache(__domParent);
          }
        }
      }
    }
    else {
      let top = reflow.checkTop(this, node, addDom, removeDom);
      if(top === this) {
        this.__reLayout();
      }
      // 布局影响next的所有节点，重新layout的w/h数据使用之前parent暂存的，x使用parent，y使用prev或者parent的
      else {
        reflow.checkNext(this, top, node, hasZ, addDom, removeDom);
      }
      if(removeDom) {
        let temp = node;
        while(temp.isShadowRoot) {
          temp = temp.__host;
          temp.__destroy();
        }
        node.__destroy();
      }
    }
    node.__refreshLevel |= lv;
    // 有被清除的cache则设置到Root上
    if(hasRelease) {
      lv |= CACHE;
    }
    if(addDom || removeDom) {
      this.__rlv |= REBUILD;
    }
    else {
      this.__rlv |= lv;
    }
    if(cb && !isFunction(cb)) {
      cb = null;
    }
    this.__frameDraw(cb);
  }

  // 异步进行root刷新操作，多次调用缓存结果，刷新成功后回调
  __frameDraw(cb) {
    if(!this.__task.length) {
      frame.nextFrame(() => {
      });
      frame.__rootTask.push(() => {
        // 需要先获得累积的刷新回调再刷新，防止refresh触发事件中再次调用刷新
        let list = this.__task.splice(0);
        this.draw(false);
        list.forEach(item => {
          item && item();
        });
      });
      this.__task.push(cb);
    }
    else if(cb) {
      this.__task.push(cb);
    }
  }

  __clearCanvas(ctx) {
    // 可能会调整宽高，所以每次清除用最大值
    this.__mw = Math.max(this.__mw, this.width);
    this.__mh = Math.max(this.__mh, this.height);
    // 清除前得恢复默认matrix，防止每次布局改变了属性
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.__mw, this.__mh);
  }

  __clearWebgl(ctx) {
    ctx.clearColor(0, 0, 0, 0);
    ctx.clear(ctx.COLOR_BUFFER_BIT);
  }

  get dom() {
    return this.__dom;
  }

  get uuid() {
    return this.__uuid;
  }

  get renderMode() {
    return this.__renderMode;
  }

  get ctx() {
    return this.__ctx;
  }

  get defs() {
    return this.__defs;
  }

  get ref() {
    return this.__ref;
  }

  get animateController() {
    return this.__animateController;
  }
}

export default Root;
