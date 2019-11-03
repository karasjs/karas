import css from '../style/css';
import util from '../util/util';
import mode from '../util/mode';

class LineBox {
  constructor(parent, x, y, w, content) {
    this.__parent = parent;
    this.__x = x;
    this.__y = y;
    this.__width = w;
    this.__content = content;
    this.__virtualDom = {};
  }

  render(renderMode, ctx) {
    let { content, x, y, parent } = this;
    let { ox, oy, computedStyle } = parent;
    y += css.getBaseLine(computedStyle);
    x += ox;
    y += oy;
    if(renderMode === mode.CANVAS) {
      ctx.fillText(content, x, y);
    }
    else if(renderMode === mode.SVG) {
      this.__virtualDom = {
        type: 'item',
        tagName: 'text',
        props: [
          ['x', x],
          ['y', y],
          ['fill', computedStyle.color],
          ['font-family', computedStyle.fontFamily],
          ['font-weight', computedStyle.fontWeight],
          ['font-style', computedStyle.fontStyle],
          ['font-size', `${computedStyle.fontSize}px`]
        ],
        content: util.encodeHtml(content),
      };
    }
  }

  __offsetX(diff) {
    this.__x += diff;
  }

  __offsetY(diff) {
    this.__y += diff;
  }

  get x() {
    return this.__x;
  }
  get y() {
    return this.__y;
  }
  get width() {
    return this.__width;
  }
  get content() {
    return this.__content;
  }
  get baseLine() {
    return css.getBaseLine(this.parent.computedStyle);
  }
  get virtualDom() {
    return this.__virtualDom;
  }
  get parent() {
    return this.__parent;
  }
}

export default LineBox;
