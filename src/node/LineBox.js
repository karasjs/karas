import css from '../style/css';
import mode from '../mode';

class LineBox {
  constructor(parent, x, y, w, content, style) {
    this.__parent = parent;
    this.__x = x;
    this.__y = y;
    this.__width = w;
    this.__content = content;
    this.__style = style;
    this.__virtualDom = {};
  }

  render(renderMode, ctx) {
    let { style, content, x, y, parent: { ox, oy } } = this;
    y += css.getBaseLine(style);
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
          ['fill', style.color],
          ['font-size', `${style.fontSize}px`]
        ],
        content,
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
  get style() {
    return this.__style;
  }
  get baseLine() {
    return css.getBaseLine(this.style);
  }
  get virtualDom() {
    return this.__virtualDom;
  }
  get parent() {
    return this.__parent;
  }
}

export default LineBox;
