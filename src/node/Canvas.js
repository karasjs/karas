import Dom from './Dom';
import util from '../util';

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
  }
  initProps() {
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
        this.__width = parseInt(css.getPropertyValue('width'));
        dom.setAttribute('width', this.width);
      }
      if(!this.height) {
        this.__height = parseInt(css.getPropertyValue('height'));
        dom.setAttribute('height', this.height);
      }
    }
    // canvas作为根节点一定是block或flex，不会是inline
    let { style } = this;
    if(['flex', 'block', 'none'].indexOf(style.display) === -1) {
      style.display = 'block';
    }
    this.__ctx = this.__node.getContext('2d');
    this.__traverse(this.__ctx);
    // canvas的宽高固定初始化
    style.width = this.width;
    style.height = this.height;
    this.__initStyle();
    this.__preLay({
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
