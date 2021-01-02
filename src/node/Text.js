import Node from './Node';
import LineBox from './LineBox';
import mode from './mode';
import css from '../style/css';
import enums from '../util/enums';
import util from '../util/util';
import textCache from './textCache';

const {
  STYLE_KEY: {
    DISPLAY,
    LINE_HEIGHT,
    FONT_SIZE,
    FONT_FAMILY,
    FONT_WEIGHT,
    COLOR,
    VISIBILITY,
    TEXT_ALIGN,
    LETTER_SPACING,
  },
} = enums;

class Text extends Node {
  constructor(content) {
    super();
    this.__content = util.isNil(content) ? '' : content.toString();
    this.__lineBoxes = [];
    this.__charWidthList = [];
    this.__charWidth = 0;
    this.__textWidth = 0;
  }

  // 预先计算每个字的宽度
  __computeMeasure(renderMode, ctx) {
    let { content, computedStyle, charWidthList } = this;
    // 每次都要清空重新计算，计算会有缓存
    charWidthList.splice(0);
    if(renderMode === mode.CANVAS) {
      ctx.font = css.setFontStyle(computedStyle);
    }
    let key = this.__key = computedStyle[FONT_SIZE] + ',' + computedStyle[FONT_FAMILY] + ',' + computedStyle[FONT_WEIGHT];
    let wait = textCache.data[key] = textCache.data[key] || {
      key,
      style: computedStyle,
      hash: {},
      s: [],
    };
    let cache = textCache.charWidth[key] = textCache.charWidth[key] || {};
    let sum = 0;
    let needMeasure = false;
    for(let i = 0, length = content.length; i < length; i++) {
      let char = content.charAt(i);
      let mw;
      if(cache.hasOwnProperty(char)) {
        mw = cache[char];
        charWidthList.push(mw);
        sum += mw;
        this.__charWidth = Math.max(this.charWidth, mw);
      }
      else if(renderMode === mode.CANVAS) {
        mw = cache[char] = ctx.measureText(char).width;
        charWidthList.push(mw);
        sum += mw;
        this.__charWidth = Math.max(this.charWidth, mw);
      }
      else {
        if(!wait.hash.hasOwnProperty(char)) {
          wait.s += char;
        }
        wait.hash[char] = true;
        // 先预存标识位-1，测量完后替换它
        charWidthList.push(-1);
        needMeasure = true;
      }
    }
    this.__textWidth = sum;
    if(needMeasure) {
      textCache.list.push(this);
    }
  }

  __measureCb() {
    let { content, charWidthList } = this;
    let key = this.__key;
    let cache = textCache.charWidth[key];
    let sum = 0;
    for(let i = 0, len = charWidthList.length; i < len; i++) {
      if(charWidthList[i] < 0) {
        let mw = charWidthList[i] = cache[content.charAt(i)];
        sum += mw;
        this.__charWidth = Math.max(this.charWidth, mw);
      }
    }
    this.__textWidth = sum;
  }

  __layout(data, isVirtual) {
    let { x, y, w } = data;
    this.__x = this.__sx1 = x;
    this.__y = this.__sy1 = y;
    let { isDestroyed, content, computedStyle, lineBoxes, charWidthList } = this;
    if(isDestroyed || computedStyle[DISPLAY] === 'none') {
      return;
    }
    this.__ox = this.__oy = 0;
    lineBoxes.splice(0);
    // 顺序尝试分割字符串为lineBox，形成多行
    let begin = 0;
    let i = 0;
    let count = 0;
    let length = content.length;
    let maxW = 0;
    let { [LINE_HEIGHT]: lineHeight, [LETTER_SPACING]: letterSpacing } = computedStyle;
    while(i < length) {
      count += charWidthList[i] + letterSpacing;
      if(count === w) {
        let lineBox = new LineBox(this, x, y, count, content.slice(begin, i + 1));
        lineBoxes.push(lineBox);
        maxW = Math.max(maxW, count);
        y += lineHeight;
        begin = i + 1;
        i = begin;
        count = 0;
      }
      else if(count > w) {
        let width;
        // 宽度不足时无法跳出循环，至少也要塞个字符形成一行
        if(i === begin) {
          i = begin + 1;
          width = count;
        }
        else {
          width = count - charWidthList[i];
        }
        let lineBox = new LineBox(this, x, y, width, content.slice(begin, i));
        lineBoxes.push(lineBox);
        maxW = Math.max(maxW, width);
        y += lineHeight;
        begin = i;
        count = 0;
      }
      else {
        i++;
      }
    }
    // 最后一行，只有一行未满时也进这里
    if(begin < length && begin < i) {
      count = 0;
      for(i = begin; i < length; i++) {
        count += charWidthList[i] + letterSpacing;
      }
      let lineBox = new LineBox(this, x, y, count, content.slice(begin, length));
      lineBoxes.push(lineBox);
      maxW = Math.max(maxW, count);
      y += lineHeight;
    }
    this.__width = maxW;
    this.__height = y - data.y;
    // flex/abs前置计算无需真正布局
    if(!isVirtual) {
      let { [TEXT_ALIGN]: textAlign } = computedStyle;
      if(['center', 'right'].indexOf(textAlign) > -1) {
        lineBoxes.forEach(lineBox => {
          let diff = this.__width - lineBox.width;
          if(diff > 0) {
            lineBox.__offsetX(textAlign === 'center' ? diff * 0.5 : diff);
          }
        });
      }
    }
  }

  __offsetX(diff, isLayout) {
    super.__offsetX(diff, isLayout);
    if(isLayout) {
      this.lineBoxes.forEach(item => {
        item.__offsetX(diff);
      });
    }
    this.__sx1 += diff;
  }

  __offsetY(diff, isLayout) {
    super.__offsetY(diff, isLayout);
    if(isLayout) {
      this.lineBoxes.forEach(item => {
        item.__offsetY(diff);
      });
    }
    this.__sy1 += diff;
  }

  __tryLayInline(w) {
    return w - this.textWidth;
  }

  __calMaxAndMinWidth() {
    let n = 0;
    this.charWidthList.forEach(item => {
      n = Math.max(n, item);
    });
    return { max: this.textWidth, min: n };
  }

  __calAbsWidth(x, y, w) {
    this.__layout({
      x,
      y,
      w,
    }, true);
    return this.width;
  }

  render(renderMode, lv, ctx, defs, dx = 0, dy = 0) {
    if(renderMode === mode.SVG) {
      this.__virtualDom = {
        type: 'text',
        children: [],
      };
    }
    let { isDestroyed, computedStyle, lineBoxes, cacheStyle, charWidthList } = this;
    if(isDestroyed || computedStyle[DISPLAY] === 'none' || computedStyle[VISIBILITY] === 'hidden') {
      return false;
    }
    if(renderMode === mode.CANVAS) {
      let font = css.setFontStyle(computedStyle);
      if(ctx.font !== font) {
        ctx.font = font;
      }
      let color = cacheStyle[COLOR];
      if(ctx.fillStyle !== color) {
        ctx.fillStyle = color;
      }
    }
    let index = 0;
    lineBoxes.forEach(item => {
      item.render(renderMode, ctx, computedStyle, cacheStyle, dx, dy, index, charWidthList);
      index += item.content.length;
    });
    if(renderMode === mode.SVG) {
      this.virtualDom.children = lineBoxes.map(lineBox => lineBox.virtualDom);
    }
    return true;
  }

  __deepScan(cb) {
    cb(this);
  }

  get content() {
    return this.__content;
  }

  set content(v) {
    this.__content = v;
  }

  get lineBoxes() {
    return this.__lineBoxes;
  }

  get charWidthList() {
    return this.__charWidthList;
  }

  get charWidth() {
    return this.__charWidth;
  }

  get textWidth() {
    return this.__textWidth;
  }

  get baseLine() {
    let { lineBoxes } = this;
    if(!lineBoxes.length) {
      return 0;
    }
    let last = lineBoxes[lineBoxes.length - 1];
    return last.y - this.y + last.baseLine;
  }

  get currentStyle() {
    return this.parent.currentStyle;
  }

  get computedStyle() {
    return this.parent.computedStyle;
  }

  get cacheStyle() {
    return this.parent.__cacheStyle;
  }

  get bbox() {
    if(!this.content) {
      return;
    }
    let { sx, sy, width, height } = this;
    let x1 = sx, y1 = sy;
    let x2 = sx + width, y2 = sy + height;
    return [x1, y1, x2, y2];
  }
}

Text.prototype.__renderByMask = Text.prototype.render;

export default Text;
