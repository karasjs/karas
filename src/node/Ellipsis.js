import Node from './Node';
import mode from '../refresh/mode';
import css from '../style/css';
import enums from '../util/enums';

const {
  STYLE_KEY: {
    FONT_SIZE,
    FONT_FAMILY,
    FONT_WEIGHT,
    FONT_STYLE,
    COLOR,
  },
  NODE_KEY: {
    NODE_VIRTUAL_DOM,
  },
} = enums;

const { CANVAS, SVG, WEBGL } = mode;

const CHAR = '…';

class Ellipsis extends Node{
  constructor(x, y, width, parent) {
    super();
    this.__x = this.__sx1 = x;
    this.__y = this.__sy1 = y;
    this.__width = width;
    this.__parent = this.__domParent = parent;
    parent.__ellipsis = this;
    this.__parentLineBox = null;
    this.__baseline = css.getBaseline(parent.computedStyle);
    this.isEllipsis = true;
  }

  render(renderMode, lv, ctx, cache, dx = 0, dy = 0) {
    let { x, y, parent } = this;
    let {
      ox,
      oy,
      computedStyle,
      cacheStyle: {
        [COLOR]: color,
      },
    } = parent;
    y += css.getBaseline(computedStyle);
    x += ox + dx;
    y += oy + dy;
    if(renderMode === CANVAS || renderMode === WEBGL) {
      let font = css.setFontStyle(computedStyle);
      if(ctx.font !== font) {
        ctx.font = font;
      }
      if(ctx.fillStyle !== color) {
        ctx.fillStyle = color;
      }
      ctx.fillText(CHAR, x, y);
    }
    else if(renderMode === SVG) {
      let props = [
        ['x', x],
        ['y', y],
        ['fill', color],
        ['font-family', computedStyle[FONT_FAMILY]],
        ['font-weight', computedStyle[FONT_WEIGHT]],
        ['font-style', computedStyle[FONT_STYLE]],
        ['font-size', computedStyle[FONT_SIZE] + 'px'],
      ];
      let vd = this.__config[NODE_VIRTUAL_DOM] = this.__virtualDom = {
        type: 'text',
        children: [
          {
            type: 'item',
            tagName: 'text',
            props,
            content: CHAR,
          },
        ],
      };
      parent.virtualDom.children.push(vd);
    }
  }

  get parentLineBox() {
    return this.__parentLineBox;
  }
}

export default Ellipsis;

