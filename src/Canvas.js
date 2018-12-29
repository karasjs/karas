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
    // 缺省默认canvas的宽高设置
    if(this.props.width === undefined) {
      this.props.width = this.__width = 300;
      this.__props.push(['width', 300]);
    }
    else {
      this.__width = Math.max(0, parseInt(this.props.width) || 0);
    }
    if(this.props.height === undefined) {
      this.props.height = this.__height = 150;
      this.__props.push(['height', 150]);
    }
    else {
      this.__height = Math.max(0, parseInt(this.props.height) || 0);
    }
    this.__element = null; // 真实DOM引用
  }
  toString() {
    let res = '<canvas';
    // 拼接处理属性
    for(let i = 0, len = this.__props.length; i < len; i++) {
      let item = this.__props[i];
      let s = renderProp(item[0], item[1]);
      res += s;
    }
    res += '></canvas>';
    return res;
  }
  appendTo(dom) {
    let s = this.toString();
    dom = getDom(dom);
    dom.insertAdjacentHTML('beforeend', s);
    let canvas = dom.querySelectorAll('canvas');
    this.__element = canvas[canvas.length - 1];
    this.__ctx = this.element.getContext('2d');
    this.__traverse(this.ctx);
    this.__initStyle();
    this.__preLay({
      x: 0,
      y: 0,
      w: this.width,
      h: this.height,
    });
    this.render();
  }

  get element() {
    return this.__element;
  }
}

export default Canvas;
