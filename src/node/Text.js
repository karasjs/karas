import Node from './Node';
import LineBox from './LineBox';
import css from '../style/css';

const CHAR_WIDTH_CACHE = {};

class Text extends Node {
  constructor(content) {
    super();
    this.__content = content.toString();
    this.__lineBoxes = [];
    this.__charWidth = [];
    this.__textWidth = 0;
  }

  // 预先计算每个字的宽度
  __measure() {
    this.__charWidth = [];
    let { ctx, content, style, charWidth } = this;
    ctx.font = css.setFontStyle(style);
    let cache = CHAR_WIDTH_CACHE[style.fontSize] = CHAR_WIDTH_CACHE[style.fontSize] || {};
    let length = content.length;
    let sum = 0;
    for(let i = 0; i < length; i++) {
      let char = content.charAt(i);
      if(cache.hasOwnProperty(char)) {
        charWidth.push(cache[char]);
        sum += cache[char];
        continue;
      }
      let mw = cache[char] = ctx.measureText(char).width;
      charWidth.push(mw);
      sum += mw;
    }
    this.__textWidth = sum;
  }

  __preLay(data) {
    let { x, y, w, h } = data;
    this.__x = x;
    this.__y = y;
    let maxX = x;
    let { ctx, content, style, lineBoxes, charWidth } = this;
    // 顺序尝试分割字符串为lineBox，形成多行
    let begin = 0;
    let i = 0;
    let count = 0;
    let length = content.length;
    while(i < length) {
      count += charWidth[i];
      if (count === w) {
        let lineBox = new LineBox(ctx, x, y, content.slice(begin, i + 1), style);
        lineBoxes.push(lineBox);
        maxX = Math.max(maxX, x + count);
        y += this.style.lineHeight;
        begin = i + 1;
        i = begin + 1;
        count = 0;
      }
      else if (count > w) {
        let lineBox = new LineBox(ctx, x, y, content.slice(begin, i), style);
        lineBoxes.push(lineBox);
        maxX = Math.max(maxX, x + count - charWidth[i]);
        y += this.style.lineHeight;
        begin = i;
        count = 0;
      }
      else {
        i++;
      }
    }
    if(begin < i) {
      let lineBox = new LineBox(ctx, x, y, content.slice(begin, i), style);
      lineBoxes.push(lineBox);
      maxX = Math.max(maxX, x + count);
      y += this.style.lineHeight;
    }
    this.__width = maxX - x;
    this.__height = y - data.y;
  }

  render() {
    this.ctx.font = css.setFontStyle(this.style);
    this.lineBoxes.forEach(item => {
      item.render();
    });
  }

  __tryLayInline(w) {
    this.ctx.font = css.setFontStyle(this.style);
    let tw = this.ctx.measureText(this.content).width;
    return w - tw;
  }

  __offsetY(diff) {
    this.__y += diff;
    this.lineBoxes.forEach(item => {
      item.__offsetY(diff);
    });
  }

  __calMaxAndMinWidth() {
    let n = 0;
    this.charWidth.forEach(item => {
      n = Math.max(n, item);
    });
    return { max: this.textWidth, min: n };
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
  get charWidth() {
    return this.__charWidth;
  }
  get textWidth() {
    return this.__textWidth;
  }
  get baseLine() {
    let last = this.lineBoxes[this.lineBoxes.length - 1];
    return last.y - this.y + last.baseLine;
  }
}

export default Text;
