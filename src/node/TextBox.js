import mode from '../refresh/mode';
import css from '../style/css';
import transform from '../style/transform';
import enums from '../util/enums';
import util from '../util/util';
import unit from '../style/unit';
import reg from '../style/reg';
import mx from '../math/matrix';

const { STYLE_KEY: {
  COLOR,
  FONT_WEIGHT,
  FONT_FAMILY,
  FONT_SIZE,
  FONT_STYLE,
  LETTER_SPACING,
  TEXT_STROKE_COLOR,
  TEXT_STROKE_WIDTH,
  TEXT_STROKE_OVER,
  ROTATE_Z,
  LINE_HEIGHT,
} } = enums;
const { DEG } = unit;

function isCjk(c) {
  return reg.han.test(c) && !reg.punctuation.test(c);
}

/**
 * 表示一行文本的类，保存它的位置、内容、从属信息，在布局阶段生成，并在渲染阶段被Text调用render()
 * 关系上直属于Text类，一个Text类可能因为换行原因导致有多个TextBox，一行内容中也可能有不同Text从而不同TextBox
 * 另外本类还会被LineBoxManager添加到LineBox里，LineBox为一行中的inline/文本组合，之间需要进行垂直对齐
 * 在textOverflow为ellipsis时，可能会收到后面节点的向前回退（后面不足放下…），使得省略号发生在本节点
 */
class TextBox {
  constructor(parent, index, x, y, w, h, content, isVertical = false) {
    this.__parent = parent;
    this.__index = index;
    this.__x = x;
    this.__y = y;
    if(isVertical) {
      this.__width = h;
      this.__height = w;
    }
    else {
      this.__width = w;
      this.__height = h;
    }
    this.__content = content;
    this.__virtualDom = {};
    this.__parentLineBox = null;
    this.__isVertical = isVertical;
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
    let { content, x, y, parent, width, height, isVertical } = this;
    let { ox, oy } = parent;
    let dom = parent.parent;
    let b = css.getBaseline(computedStyle);
    let bv = css.getVerticalBaseline(computedStyle);
    // 垂直文本x/y互换，渲染时使用rotate模拟，因为是基于baseline绘制，顺时针90deg时tfo是文字左下角，
    // 它等同于lineHeight（现在的w）减去b
    if(isVertical) {
      x += bv;
    }
    else {
      y += b;
    }
    x += ox + dx;
    y += oy + dy;
    if(isVertical) {
      this.__endX = x;
      this.__endY = y + height;
    }
    else {
      this.__endX = x + width;
      this.__endY = y;
    }
    let {
      [LETTER_SPACING]: letterSpacing,
      [TEXT_STROKE_WIDTH]: textStrokeWidth,
      [TEXT_STROKE_COLOR]: textStrokeColor,
      [FONT_SIZE]: fontSize,
      [LINE_HEIGHT]: lineHeight,
    } = computedStyle;
    let me = dom.matrixEvent, list;
    let dev1 = 0, dev2 = 0;
    if(isVertical) {
      list = [
        [ROTATE_Z, [90, DEG]],
      ];
      dev1 = bv * 0.6;
      dev2 = bv * 0.2;
    }
    let i = 0, length = content.length;
    if(renderMode === mode.CANVAS || renderMode === mode.WEBGL) {
      let overFill = computedStyle[TEXT_STROKE_OVER] === 'fill';
      if(letterSpacing) {
        for(; i < length; i++) {
          let c = content.charAt(i);
          if(isVertical) {
            let cjk = isCjk(c);
            if(cjk) {
              ctx.setTransform(me[0], me[1], me[4], me[5], me[12], me[13]);
              if(overFill) {
                ctx.fillText(c, x - dev1, y - dev2);
              }
              if(textStrokeWidth && (textStrokeColor[3] > 0 || textStrokeColor.length === 3 || textStrokeColor.k)) {
                ctx.strokeText(c, x - dev1, y - dev2);
              }
              if(!overFill) {
                ctx.fillText(c, x - dev1, y - dev2);
              }
            }
            else {
              let tfo = [x, y];
              let m = transform.calMatrixWithOrigin(list, tfo, 0, 0);
              m = mx.multiply(me, m);
              ctx.setTransform(m[0], m[1], m[4], m[5], m[12], m[13]);
              if(overFill) {
                ctx.fillText(c, x, y);
              }
              if(textStrokeWidth && (textStrokeColor[3] > 0 || textStrokeColor.length === 3 || textStrokeColor.k)) {
                ctx.strokeText(c, x, y);
              }
              if(!overFill) {
                ctx.fillText(c, x, y);
              }
            }
            y += ctx.measureText(c).width + letterSpacing;
          }
          else {
            if(overFill) {
              ctx.fillText(c, x, y);
            }
            if(textStrokeWidth && (textStrokeColor[3] > 0 || textStrokeColor.length === 3 || textStrokeColor.k)) {
              ctx.strokeText(c, x, y);
            }
            if(!overFill) {
              ctx.fillText(c, x, y);
            }
            x += ctx.measureText(c).width + letterSpacing;
          }
        }
      }
      else {
        if(isVertical) {
          let cjk = isCjk(content.charAt(0)), last = 0, count = 0, len = content.length;
          for(let i = 1; i < len; i++) {
            let nowCjk = isCjk(content.charAt(i));
            // 不相等时cjk发生变化，输出之前的内容，记录当下的所有
            if(nowCjk !== cjk) {
              if(cjk) {
                ctx.setTransform(me[0], me[1], me[4], me[5], me[12], me[13]);
                let s = content.slice(last, i);
                if(overFill) {
                  ctx.fillText(s, x - dev1, y + count + b - dev2);
                }
                if(textStrokeWidth && (textStrokeColor[3] > 0 || textStrokeColor.length === 3 || textStrokeColor.k)) {
                  ctx.strokeText(s, x - dev1, y + count + b - dev2);
                }
                if(!overFill) {
                  ctx.fillText(s, x - dev1, y + count + b - dev2);
                }
                count += fontSize;
              }
              else {
                let tfo = [x, y + count];
                let m = transform.calMatrixWithOrigin(list, tfo, 0, 0);
                m = mx.multiply(me, m);
                ctx.setTransform(m[0], m[1], m[4], m[5], m[12], m[13]);
                let s = content.slice(last, i);
                if(overFill) {
                  ctx.fillText(s, x, y + count);
                }
                if(textStrokeWidth && (textStrokeColor[3] > 0 || textStrokeColor.length === 3 || textStrokeColor.k)) {
                  ctx.strokeText(s, x, y + count);
                }
                if(!overFill) {
                  ctx.fillText(s, x, y + count);
                }
                count += ctx.measureText(s).width;
              }
              last = i;
              cjk = !cjk;
            }
            // cjk单字符输出
            else if(nowCjk) {
              ctx.setTransform(me[0], me[1], me[4], me[5], me[12], me[13]);
              let s = content.slice(last, i);
              if(overFill) {
                ctx.fillText(s, x - dev1, y + count + b - dev2);
              }
              if(textStrokeWidth && (textStrokeColor[3] > 0 || textStrokeColor.length === 3 || textStrokeColor.k)) {
                ctx.strokeText(s, x - dev1, y + count + b - dev2);
              }
              if(!overFill) {
                ctx.fillText(s, x - dev1, y + count + b - dev2);
              }
              count += fontSize;
              last = i;
            }
          }
          if(last < len) {
            let s = content.slice(last, len);
            // 最后的cjk只可能是一个字符
            if(cjk) {
              ctx.setTransform(me[0], me[1], me[4], me[5], me[12], me[13]);
              if(overFill) {
                ctx.fillText(s, x - dev1, y + count + b - dev2);
              }
              if(textStrokeWidth && (textStrokeColor[3] > 0 || textStrokeColor.length === 3 || textStrokeColor.k)) {
                ctx.strokeText(s, x - dev1, y + count + b - dev2);
              }
              if(!overFill) {
                ctx.fillText(s, x - dev1, y + count + b - dev2);
              }
            }
            else {
              let tfo = [x, y + count];
              let m = transform.calMatrixWithOrigin(list, tfo, 0, 0);
              m = mx.multiply(me, m);
              ctx.setTransform(m[0], m[1], m[4], m[5], m[12], m[13]);
              if(overFill) {
                ctx.fillText(s, x, y + count);
              }
              if(textStrokeWidth && (textStrokeColor[3] > 0 || textStrokeColor.length === 3 || textStrokeColor.k)) {
                ctx.strokeText(s, x, y + count);
              }
              if(!overFill) {
                ctx.fillText(s, x, y + count);
              }
            }
          }
        }
        else {
          if(overFill) {
            ctx.fillText(content, x, y);
          }
          if(textStrokeWidth && (textStrokeColor[3] > 0 || textStrokeColor.length === 3 || textStrokeColor.k)) {
            ctx.strokeText(content, x, y);
          }
          if(!overFill) {
            ctx.fillText(content, x, y);
          }
        }
      }
    }
    else if(renderMode === mode.SVG) {
      let color = cacheStyle[COLOR];
      if(color.k) {
        color = dom.__gradient(renderMode, ctx, dom.__bx1, dom.__by1, dom.__bx2, dom.__by2, color, dx, dy).v;
      }
      // 垂直的svg以中线为基线，需偏移baseline和中线的差值
      if(isVertical) {
        x += lineHeight * 0.5 - bv;
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
      // svg无法定义stroke的over
      if(textStrokeWidth && (textStrokeColor[3] > 0 || textStrokeColor.length === 3 || textStrokeColor.k)) {
        let textStrokeColor = cacheStyle[TEXT_STROKE_COLOR];
        // 渐变
        if(textStrokeColor.k) {
          textStrokeColor = dom.__gradient(renderMode, ctx, dom.__bx1, dom.__by1, dom.__bx2, dom.__by2, textStrokeColor, dx, dy).v;
        }
        props.push(['stroke', textStrokeColor]);
        props.push(['stroke-width', computedStyle[TEXT_STROKE_WIDTH]]);
      }
      if(letterSpacing) {
        props.push(['letter-spacing', letterSpacing]);
      }
      if(isVertical) {
        props.push(['writing-mode', 'vertical-lr']);
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

  get baseline() {
    return this.parent.baseline;
  }

  get verticalBaseline() {
    return this.parent.verticalBaseline;
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

  get isVertical() {
    return this.__isVertical;
  }
}

export default TextBox;
