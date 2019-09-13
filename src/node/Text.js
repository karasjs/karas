import Node from './Node';
import LineBox from './LineBox';
import css from '../style/css';
import mode from './mode';

const CHAR_WIDTH_CACHE = {};

class Text extends Node {
  constructor(content) {
    super();
    this.__content = content.toString();
    this.__lineBoxes = [];
    this.__charWidthList = [];
    this.__charWidth = 0;
    this.__textWidth = 0;
  }

  // 预先计算每个字的宽度
  __measure() {
    this.__charWidthList = [];
    let { ctx, content, style, charWidthList } = this;
    if(this.mode === mode.CANVAS) {
      ctx.font = css.setFontStyle(style);
    }
    let cache = CHAR_WIDTH_CACHE[style.fontSize] = CHAR_WIDTH_CACHE[style.fontSize] || {};
    let length = content.length;
    let sum = 0;
    for(let i = 0; i < length; i++) {
      let char = content.charAt(i);
      let mw;
      if(cache.hasOwnProperty(char)) {
        mw = cache[char];
      }
      else if(this.mode === mode.CANVAS) {
        mw = ctx.measureText(char).width;
      }
      else if(this.mode === mode.SVG) {
        mw = mode.measure(char, style);
      }
      charWidthList.push(mw);
      sum += mw;
      this.__charWidth = Math.max(this.charWidth, mw);
    }
    this.__textWidth = sum;
  }

  __preLay(data, isVirtual) {
    let { x, y, w, h } = data;
    this.__x = x;
    this.__y = y;
    let maxX = x;
    let { ctx, content, style, lineBoxes, charWidthList } = this;
    // 顺序尝试分割字符串为lineBox，形成多行
    let begin = 0;
    let i = 0;
    let count = 0;
    let length = content.length;
    while(i < length) {
      count += charWidthList[i];
      if (count === w) {
        let lineBox = new LineBox(this.mode, ctx, x, y, content.slice(begin, i + 1), style);
        lineBoxes.push(lineBox);
        maxX = Math.max(maxX, x + count);
        y += this.style.lineHeight.value;
        begin = i + 1;
        i = begin + 1;
        count = 0;
      }
      else if (count > w) {
        // 宽度不足时无法跳出循环，至少也要塞个字符形成一行
        if(i === begin) {
          i = begin + 1;
        }
        let lineBox = new LineBox(this.mode, ctx, x, y, content.slice(begin, i), style);
        lineBoxes.push(lineBox);
        maxX = Math.max(maxX, x + count - charWidthList[i]);
        y += this.style.lineHeight.value;
        begin = i;
        i = i + 1;
        count = 0;
      }
      else {
        i++;
      }
    }
    if(begin < length && begin < i) {
      let lineBox = new LineBox(this.mode, ctx, x, y, content.slice(begin, i), style);
      lineBoxes.push(lineBox);
      maxX = Math.max(maxX, x + count);
      y += this.style.lineHeight.value;
    }
    this.__width = maxX - x;
    this.__height = y - data.y;
    if(isVirtual) {
      this.__lineBoxes = [];
    }
  }

  render() {
    if(this.mode === mode.CANVAS) {
      this.ctx.font = css.setFontStyle(this.style);
    }
    this.lineBoxes.forEach(item => {
      item.render();
    });
  }

  __tryLayInline(w) {
    return w - this.textWidth;
  }

  __offsetX(diff) {
    super.__offsetX(diff);
    this.lineBoxes.forEach(item => {
      item.__offsetX(diff);
    });
  }

  __offsetY(diff) {
    super.__offsetY(diff);
    this.lineBoxes.forEach(item => {
      item.__offsetY(diff);
    });
  }

  __calMaxAndMinWidth() {
    let n = 0;
    this.charWidthList.forEach(item => {
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
    let last = this.lineBoxes[this.lineBoxes.length - 1];
    return last.y - this.y + last.baseLine;
  }
}

export default Text;
