import Dom from './Dom';
import util from './util';

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

class Canvas extends Dom {
  constructor(props, children) {
    super('canvas', props, children);
    this.__node = null; // 真实DOM引用
    this.__dpr = 1;
  }
  initProps() {
    this.__dpr = this.props.dpr || window.devicePixelRatio || this.__dpr;
    if(this.props.width !== undefined) {
      let value = parseInt(this.props.width);
      if(!isNaN(value) && value > 0) {
        this.__width = value * this.dpr;
      }
    }
    if(this.props.height !== undefined) {
      let value = parseInt(this.props.height);
      if(!isNaN(value) && value > 0) {
        this.__height = value * this.dpr;
      }
    }
  }
  genHtml() {
    let res = '<canvas';
    // 拼接处理属性
    for(let i = 0, len = this.__props.length; i < len; i++) {
      let item = this.__props[i];
      res += renderProp(item[0], item[1]);
    }
    res += '></canvas>';
    return res;
  }
  appendTo(dom) {
    dom = getDom(dom);
    this.initProps();
    // 已有canvas节点
    if(dom.nodeName.toUpperCase() === 'CANVAS') {
      this.__node = dom;
      if(this.width) {
        dom.setAttribute('width', this.width);
      }
      if(this.height) {
        dom.setAttribute('height', this.height);
      }
    }
    // 没有canvas节点则生成一个新的
    else {
      let s = this.genHtml();
      dom.insertAdjacentHTML('beforeend', s);
      let canvas = dom.querySelectorAll('canvas');
      this.__node = canvas[canvas.length - 1];
    }
    // 没有设置width/height则采用css计算形式
    if(!this.width || !this.height) {
      let css = window.getComputedStyle(dom, null);
      if(!this.width) {
        this.__width = parseInt(css.getPropertyValue('width')) * this.dpr;
        dom.setAttribute('width', this.width);
      }
      if(!this.height) {
        this.__height = parseInt(css.getPropertyValue('height')) * this.dpr;
        dom.setAttribute('height', this.height);
      }
    }
    this.__ctx = this.__node.getContext('2d');
    this.__traverse(this.__ctx, this.__dpr);
    this.__initStyle();
    // canvas作为根节点一定是block
    this.__preLayBlock({
      x: 0,
      y: 0,
      w: this.width,
      h: this.height,
    });
    this.render();
  }

  get node() {
    return this.__node;
  }
}

export default Canvas;
