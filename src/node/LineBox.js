import mode from './mode';
import css from '../style/css';
import enums from '../util/enums';
import util from '../util/util';

const { STYLE_KEY: {
  COLOR,
  FONT_WEIGHT,
  FONT_FAMILY,
  FONT_SIZE,
  FONT_STYLE,
} } = enums;

class LineBox {
  constructor(parent, x, y, w, content) {
    this.__parent = parent;
    this.__x = x;
    this.__y = y;
    this.__width = w;
    this.__content = content;
    this.__virtualDom = {};
  }

  render(renderMode, ctx, computedStyle, cacheStyle, dx, dy) {
    let { content, x, y, parent } = this;
    let { ox, oy } = parent;
    y += css.getBaseLine(computedStyle);
    x += ox + dx;
    y += oy + dy;
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
          ['fill', cacheStyle[COLOR]],
          ['font-family', computedStyle[FONT_FAMILY]],
          ['font-weight', computedStyle[FONT_WEIGHT]],
          ['font-style', computedStyle[FONT_STYLE]],
          ['font-size', computedStyle[FONT_SIZE] + 'px']
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
