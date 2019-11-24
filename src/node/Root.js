import Dom from '../node/Dom';
import util from '../util/util';
import mode from '../util/mode';
import diff from '../util/diff';
import Defs from './Defs';
import unit from '../style/unit';
import inject from '../util/inject';
import Event from '../util/Event';
import frame from '../animate/frame';
import level from '../animate/level';

function getDom(dom) {
  if(util.isString(dom) && dom) {
    let o = document.querySelector(dom);
    if(!o) {
      throw new Error('can not find dom of selector: ' + dom);
    }
    return o;
  }
  if(!dom) {
    throw new Error('can not find dom: ' + dom);
  }
  return dom;
}

function renderProp(k, v) {
  let s = Array.isArray(v) ? util.joinSourceArray(v) : util.stringify(v);
  if(k === 'className') {
    k = 'class';
  }
  return ' ' + k + '="' + util.encodeHtml(s, true) + '"';
}

function initEvent(node) {
  ['click', 'dblclick', 'mousedown', 'mousemove', 'mouseup', 'touchstart', 'touchmove', 'touchend', 'touchcancel'].forEach(type => {
    node.addEventListener(type, e => {
      node.__root.__cb(e, ['touchend', 'touchcancel', 'touchmove'].indexOf(type) > -1);
    });
  });
}

let uuid = 0;

class Root extends Dom {
  constructor(tagName, props, children) {
    super(tagName, props, children);
    this.__node = null; // 真实DOM引用
    this.__mw = 0; // 记录最大宽高，防止尺寸变化清除不完全
    this.__mh = 0;
    this.__task = [];
    this.__ref = {};
    Event.mix(this);
  }

  __initProps() {
    let w = this.props.width;
    if(!util.isNil(w)) {
      let value = parseInt(w) || 0;
      if(value > 0) {
        this.__width = value;
      }
    }
    let h = this.props.height;
    if(!util.isNil(h)) {
      let value = parseInt(h) || 0;
      if(value > 0) {
        this.__height = value;
      }
    }
  }

  __genHtml() {
    let res = `<${this.tagName}`;
    // 拼接处理属性
    for(let i = 0, len = this.__props.length; i < len; i++) {
      let item = this.__props[i];
      res += renderProp(item[0], item[1]);
    }
    res += `></${this.tagName}>`;
    return res;
  }

  // 类似touchend/touchcancel/touchmove这种无需判断是否发生于元素上，直接强制响应
  __cb(e, force) {
    if(e.type === 'touchmove' && !this.__touchstartTarget) {
      return;
    }
    if(e.touches && e.touches.length > 1) {
      return;
    }
    let { node } = this;
    let { x, y, top, right } = node.getBoundingClientRect();
    x = x || top || 0;
    y = y || right || 0;
    let { clientX, clientY } = e.touches ? (e.touches[0] || {}) : e;
    x = clientX - x;
    y = clientY - y;
    this.__emitEvent({
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
    }, force);
  }

  appendTo(dom) {
    dom = getDom(dom);
    this.__initProps();
    this.__refreshLevel = level.REFLOW;
    // 已有root节点
    if(dom.nodeName.toUpperCase() === this.tagName.toUpperCase()) {
      this.__node = dom;
      if(this.width) {
        dom.setAttribute('width', this.width);
      }
      if(this.height) {
        dom.setAttribute('height', this.height);
      }
    }
    // 没有canvas/svg节点则生成一个新的
    else {
      this.__node = dom.querySelector(this.tagName);
      if(!this.__node) {
        dom.innerHTML = this.__genHtml();
        this.__node = dom.querySelector(this.tagName);
      }
    }
    this.__uuid = util.isNil(this.__node.__uuid) ? uuid++ : this.__node.__uuid;
    this.__defs = this.node.__defs || Defs.getInstance(this.__uuid);
    // 没有设置width/height则采用css计算形式
    if(!this.width || !this.height) {
      let css = window.getComputedStyle(dom, null);
      if(!this.width) {
        this.__width = parseInt(css.getPropertyValue('width'));
        dom.setAttribute('width', this.width);
      }
      if(!this.height) {
        this.__height = parseInt(css.getPropertyValue('height'));
        dom.setAttribute('height', this.height);
      }
    }
    // 只有canvas有ctx，svg用真实dom
    if(this.tagName === 'canvas') {
      this.__ctx = this.__node.getContext('2d');
      this.__renderMode = mode.CANVAS;
    }
    else if(this.tagName === 'svg') {
      this.__renderMode = mode.SVG;
    }
    // canvas/svg作为根节点一定是block或flex，不会是inline
    let { style } = this;
    if(['flex', 'block'].indexOf(style.display) === -1) {
      style.display = 'block';
    }
    // 同理position不能为absolute
    if(style.position === 'absolute') {
      style.position = 'static';
    }
    let { renderMode, ctx } = this;
    this.__traverse(ctx, this.__defs, renderMode);
    this.__traverseCss(this, this.props.css);
    this.__init();
    this.refresh();
    if(this.node.__root) {
      this.node.__root.__destroy();
      delete this.node.__root.__node;
      delete this.node.__root.__vd;
    }
    else {
      initEvent(this.node);
      this.node.__uuid = this.__uuid;
    }
    this.node.__root = this;
  }

  refresh(cb) {
    let { renderMode, currentStyle } = this;
    // 根元素特殊处理
    currentStyle.marginTop = currentStyle.marginRight = currentStyle.marginBottom = currentStyle.marginLeft = {
      value: 0,
      unit: unit.PX,
    };
    currentStyle.width = {
      value: this.width,
      unit: unit.PX,
    };
    currentStyle.height = {
      value: this.height,
      unit: unit.PX,
    };
    delete currentStyle.transform;
    currentStyle.opacity = 1;
    this.__defs.clear();
    let lv = this.__refreshLevel;
    this.__refreshLevel = level.REPAINT;
    // 预先计算字体相关的继承
    if(lv === level.REFLOW) {
      this.__computed();
    }
    inject.measureText(() => {
      // 没发生REFLOW只需要computed即可
      if(lv === level.REFLOW) {
        // 布局分为两步，普通流和绝对流，互相递归
        this.__layout({
          x: 0,
          y: 0,
          w: this.width,
          h: this.height,
        });
        this.__layoutAbs(this, {
          x: 0,
          y: 0,
          w: this.width,
          h: this.height,
        });
      }
      else {
        this.__repaint();
      }
      if(renderMode === mode.CANVAS) {
        this.__clear();
      }
      this.emit(Event.KARAS_BEFORE_REFRESH, lv);
      this.render(renderMode);
      if(renderMode === mode.SVG) {
        let nvd = this.virtualDom;
        let nd = this.__defs;
        nvd.defs = nd.value;
        nvd = util.clone(nvd);
        if(this.node.__root) {
          diff(this.node, this.node.__vd, nvd);
        }
        else {
          this.node.innerHTML = util.joinVirtualDom(nvd);
        }
        this.node.__vd = nvd;
        this.node.__defs = nd;
      }
      let clone = this.__task.splice(0);
      clone.forEach(cb => {
        if(util.isFunction(cb)) {
          cb();
        }
      });
      if(util.isFunction(cb)) {
        cb();
      }
      this.emit(Event.KARAS_REFRESH);
    });
  }

  addRefreshTask(cb) {
    let { task } = this;
    // 第一个添加延迟侦听
    if(!task.length) {
      frame.nextFrame(() => {
        if(task.length) {
          this.refresh();
        }
      });
    }
    task.push(cb);
  }

  delRefreshTask(cb) {
    if(!cb) {
      return;
    }
    let { task } = this;
    for(let i = 0, len = task.length; i < len; i++) {
      if(task[i] === cb) {
        task.splice(i, 1);
        break;
      }
    }
  }

  setRefreshLevel(lv) {
    if(lv > this.__refreshLevel) {
      this.__refreshLevel = lv;
    }
  }

  __getImageData() {
    return this.ctx.getImageData(0, 0, this.width, this.height);
  }

  __putImageData(data) {
    this.ctx.putImageData(data, 0, 0);
  }

  __clear() {
    // 可能会调整宽高，所以每次清除用最大值
    this.__mw = Math.max(this.__mw, this.width);
    this.__mh = Math.max(this.__mh, this.height);
    // 清除前得恢复默认matrix，防止每次布局改变了属性
    this.__ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.__ctx.clearRect(0, 0, this.__mw, this.__mh);
  }

  get node() {
    return this.__node;
  }
  get renderMode() {
    return this.__renderMode;
  }
  get task() {
    return this.__task;
  }
  get ref() {
    return this.__ref;
  }
}

export default Root;
