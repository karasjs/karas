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
  LETTER_SPACING,
} } = enums;

/**
 * 表示一行文本的类，保存它的位置、内容、从属信息，在布局阶段生成，并在渲染阶段被Text调用render()
 * 关系上直属于Text类，一个Text类可能因为换行原因导致有多个TextBox，一行内容中也可能有不同Text从而不同TextBox
 * 另外本类还会被LineBoxManager添加到LineBox里，LineBox为一行中的inline/文本组合，之间需要进行垂直对齐
 * 在textOverflow为ellipsis时，可能会收到后面节点的向前回退（后面不足放下…），使得省略号发生在本节点
 */
class TextBox {
  constructor(parent, index, x, y, w, h, content, wList) {
    this.__parent = parent;
    this.__index = index;
    this.__x = x;
    this.__y = y;
    this.__width = w;
    this.__height = h;
    this.__content = content;
    this.__wList = wList;
    this.__virtualDom = {};
  }

  /**
   * 渲染阶段被Text类调用，多行Text会有多个TextBox，内容被分拆开
   * @param renderMode
   * @param ctx
   * @param computedStyle
   * @param cacheStyle Text父节点Dom的缓存样式，相比computedStyle可以直接用，比如color被缓存为style字符串
   * @param dx
   * @param dy
   */
  render(renderMode, ctx, computedStyle, cacheStyle, dx, dy) {
    let { content, x, y, parent, wList, width } = this;
    let { ox, oy } = parent;
    y += css.getBaseLine(computedStyle);
    x += ox + dx;
    y += oy + dy;
    this.__endX = x + width;
    this.__endY = y;
    let { [LETTER_SPACING]: letterSpacing } = computedStyle;
    let i = 0, length = content.length;
    if(renderMode === mode.CANVAS) {
      if(letterSpacing) {
        for(; i < length; i++) {
          ctx.fillText(content.charAt(i), x, y);
          x += wList[i] + letterSpacing;
        }
      }
      else {
        ctx.fillText(content, x, y);
      }
    }
    else if(renderMode === mode.SVG) {
      let props = [
        ['x', x],
        ['y', y],
        ['fill', cacheStyle[COLOR]],
        ['font-family', computedStyle[FONT_FAMILY]],
        ['font-weight', computedStyle[FONT_WEIGHT]],
        ['font-style', computedStyle[FONT_STYLE]],
        ['font-size', computedStyle[FONT_SIZE] + 'px'],
      ];
      if(letterSpacing) {
        props.push(['letter-spacing', letterSpacing]);
      }
      this.__virtualDom = {
        type: 'item',
        tagName: 'text',
        props,
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

  get endX() {
    return this.__endX;
  }

  get endY() {
    return this.__endY;
  }

  get width() {
    return this.__width;
  }

  get outerWidth() {
    return this.__width;
  }

  get height() {
    return this.__height;
  }

  get outerHeight() {
    return this.__height;
  }

  get content() {
    return this.__content;
  }

  get baseLine() {
    return this.parent.baseLine;
  }

  get virtualDom() {
    return this.__virtualDom;
  }

  get parent() {
    return this.__parent;
  }

  get parentLineBox() {
    return this.__parentLineBox;
  }

  get wList() {
    return this.__wList;
  }
}

export default TextBox;
