import Dom from '../node/Dom';
import util from '../util';
import mode from '../mode';
import domDiff from '../domDiff';
import Defs from './Defs';

function getDom(dom) {
  if(util.isString(dom)) {
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

let uuid = 1;

class Root extends Dom {
  constructor(tagName, props, children) {
    super(tagName, props, children);
    this.__node = null; // 真实DOM引用
  }

  __initProps() {
    if(this.props.width !== undefined) {
      let value = parseInt(this.props.width);
      if(!isNaN(value) && value > 0) {
        this.__width = value;
      }
    }
    if(this.props.height !== undefined) {
      let value = parseInt(this.props.height);
      if(!isNaN(value) && value > 0) {
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

  __cb(e, force) {
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
      x,
      y,
      covers: [],
    }, force);
  }

  __initEvent() {
    let { node } = this;
    ['click', 'dblclick', 'mousedown', 'mousemove', 'mouseup', 'touchstart', 'touchmove', 'touchend', 'touchcancel'].forEach(type => {
      node.addEventListener(type, e => {
        this.__cb(e, ['touchend', 'touchcancel'].indexOf(type) > -1);
      });
    });
  }

  appendTo(dom) {
    dom = getDom(dom);
    this.__initProps();
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
    this.__uuid = this.__node.__uuid || uuid++;
    this.__defs = Defs.getInstance(this.__uuid);
    this.__defs.clear();
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
    let renderMode;
    if(this.tagName === 'canvas') {
      this.__ctx = this.__node.getContext('2d');
      this.__ctx.clearRect(0, 0, this.width, this.height);
      renderMode = mode.CANVAS;
    }
    else if(this.tagName === 'svg') {
      renderMode = mode.SVG;
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
    this.__traverse(this.__ctx, this.__defs, renderMode);
    // canvas的宽高固定初始化
    style.width = this.width;
    style.height = this.height;
    this.__initStyle();
    this.__layout({
      x: 0,
      y: 0,
      w: this.width,
      h: this.height,
    });
    this.__layoutAbs(this);
    this.render(renderMode);
    if(renderMode === mode.SVG) {
      let nvd = this.virtualDom;
      let nd = this.__defs.value;
      if(this.node.__karasInit) {
        domDiff(this.node, this.node.__ovd, nvd, this.node.__od, nd);
      } else {
        this.node.innerHTML = util.joinVirtualDom(nvd, nd);
      }
      this.node.__ovd = nvd;
      this.node.__od = nd;
    }
    if(!this.node.__karasInit) {
      this.node.__karasInit = true;
      this.__initEvent();
    }
  }

  get node() {
    return this.__node;
  }
}

export default Root;
