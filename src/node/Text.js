import Node from './Node';
import LineBox from './LineBox';
import css from '../style/css';
import mode from '../util/mode';

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

  static CHAR_WIDTH_CACHE = {};
  static MEASURE_TEXT = {
    list: [],
    data: {},
  };

  // 预先计算每个字的宽度
  __measure() {
    let { ctx, content, style, charWidthList, renderMode } = this;
    if(renderMode === mode.CANVAS) {
      ctx.font = css.setFontStyle(style);
    }
    let key = style.fontSize + ',' + style.fontFamily;
    let wait = Text.MEASURE_TEXT.data[key] = Text.MEASURE_TEXT.data[key] || {
      key,
      style,
      hash: {},
      s: [],
    };
    let cache = Text.CHAR_WIDTH_CACHE[key] = Text.CHAR_WIDTH_CACHE[key] || {};
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
        // 先预存标识位-1，测量完后替换它
        charWidthList.push(-1);
        needMeasure = true;
      }
    }
    this.__textWidth = sum;
    if(needMeasure) {
      Text.MEASURE_TEXT.list.push(this);
    }
  }

  measureCb() {
    let { content, style, charWidthList } = this;
    let key = style.fontSize + ',' + style.fontFamily;
    let cache = Text.CHAR_WIDTH_CACHE[key];
    let sum = 0;
    for(let i = 0, len = charWidthList.length; i < len; i++) {
      if(charWidthList[i] < 0) {
        let mw = charWidthList[i] = cache[content.charAt(i)];
        sum += mw;
        this.__charWidth = Math.max(this.charWidth, mw);
      }
    }
    this.__textWidth += sum;
  }

  __layout(data, isVirtual) {
    let { x, y, w, h } = data;
    this.__x = x;
    this.__y = y;
    let maxX = x;
    let { content, style, lineBoxes, charWidthList } = this;
    // 顺序尝试分割字符串为lineBox，形成多行
    let begin = 0;
    let i = 0;
    let count = 0;
    let length = content.length;
    while(i < length) {
      count += charWidthList[i];
      if (count === w) {
        let lineBox = new LineBox(this, x, y, count, content.slice(begin, i + 1), style);
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
        let lineBox = new LineBox(this, x, y, count - charWidthList[i], content.slice(begin, i), style);
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
      count = 0;
      for(i = begin ;i < length; i++) {
        count += charWidthList[i];
      }
      let lineBox = new LineBox(this, x, y, count, content.slice(begin, length), style);
      lineBoxes.push(lineBox);
      maxX = Math.max(maxX, x + count);
      y += style.lineHeight.value;
    }
    this.__width = maxX - x;
    this.__height = y - data.y;
    // flex前置计算无需真正布局
    if(isVirtual) {
      this.__lineBoxes = [];
    }
    else {
      let { textAlign } = style;
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

  render(renderMode) {
    const { ctx, style } = this;
    if(renderMode === mode.CANVAS) {
      ctx.font = css.setFontStyle(style);
      ctx.fillStyle = style.color;
    }
    this.lineBoxes.forEach(item => {
      item.render(renderMode, ctx);
    });
    if(renderMode === mode.SVG) {
      this.__virtualDom = {
        type: 'text',
        children: this.lineBoxes.map(lineBox => lineBox.virtualDom),
      };
    }
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
  get renderMode() {
    return this.__renderMode;
  }
}

export default Text;
