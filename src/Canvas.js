import Group from './Group';
import Geom from './Geom';
import util from './util';
import reset from './reset';
import VirtualDom from "./VirtualDom";
import Element from "./Element";

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

class Canvas extends Group {
  constructor(props, children) {
    super(props, children);
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
    this.__x = this.__y = 0;
    this.initStyle();
  }
  initStyle() {
    this.__style = Object.assign({
      width: parseInt(this.props.width),
      height: parseInt(this.props.height),
    }, reset);
  }
  toString() {
    let res = '<canvas';
    // 处理属性
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
    this.__traverse();
    this.__groupDiv(this.ctx);
    this.__measureRow();
    // this.ctx.clearRect(0, 0, this.props.width, this.props.height);
    // this.render();
  }
  // @Override
  __measureRow() {

  }
  render() {
    // let group = [];
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

  get element() {
    return this.__element;
  }
}

export default Canvas;
