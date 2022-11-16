import Node from './Node';
import mode from '../refresh/mode';
import css from '../style/css';
import unit from '../style/unit';
import transform from '../style/transform';
import enums from '../util/enums';
import mx from '../math/matrix';

const {
  STYLE_KEY: {
    FONT_SIZE,
    FONT_FAMILY,
    FONT_WEIGHT,
    FONT_STYLE,
    COLOR,
    LINE_HEIGHT,
    ROTATE_Z,
  },
} = enums;
const { DEG } = unit;
const { CANVAS, SVG, WEBGL } = mode;

const CHAR = '…';

class Ellipsis extends Node {
  constructor(x, y, width, parent, text, isUpright) {
    super();
    this.__x = this.__x1 = x;
    this.__y = this.__y1 = y;
    this.__width = width;
    this.__parent = this.__domParent = parent;
    this.__text = text;
    parent.__ellipsis = this;
    this.__parentLineBox = null;
    this.__baseline = css.getBaseline(parent.computedStyle);
    this.__isVertical = isUpright;
  }

  render(renderMode, ctx, dx = 0, dy = 0) {
    let { x, y, parent, isUpright } = this;
    let {
      computedStyle,
      cacheStyle: {
        [COLOR]: color,
      },
    } = parent;
    let b = css.getBaseline(computedStyle);
    let bv = css.getVerticalBaseline(computedStyle);
    if(isUpright) {
      x += bv;
    }
    else {
      y += b;
    }
    x += dx;
    y += dy;
    if(renderMode === CANVAS || renderMode === WEBGL) {
      let font = css.setFontStyle(computedStyle, this.__text.__fitFontSize);
      if(ctx.font !== font) {
        ctx.font = font;
      }
      if(ctx.fillStyle !== color) {
        ctx.fillStyle = color;
      }
      if(isUpright) {
        let me = parent.matrixEvent, list = [
          { k: ROTATE_Z, v: { v: 90, u: DEG } },
        ];
        let m = transform.calMatrixWithOrigin(list, x, y, 0, 0);
        m = mx.multiply(me, m);
        ctx.setTransform(m[0], m[1], m[4], m[5], m[12], m[13]);
      }
      ctx.fillText(CHAR, x, y);
    }
    else if(renderMode === SVG) {
      // 垂直的svg以中线为基线，需偏移baseline和中线的差值
      if(isUpright) {
        x += computedStyle[LINE_HEIGHT] * 0.5 - bv;
      }
      let props = [
        ['x', x],
        ['y', y],
        ['fill', color],
        ['font-family', computedStyle[FONT_FAMILY]],
        ['font-weight', computedStyle[FONT_WEIGHT]],
        ['font-style', computedStyle[FONT_STYLE]],
        ['font-size', computedStyle[FONT_SIZE] + 'px'],
      ];
      if(isUpright) {
        props.push(['writing-mode', 'vertical-lr']);
      }
      let vd = this.__virtualDom = {
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

  get isUpright() {
    return this.__isVertical;
  }

  get isEllipsis() {
    return true;
  }
}

export default Ellipsis;

