import Node from './Node';
import LineBox from './LineBox';
import css from '../style/css';
import mode from '../util/mode';

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
    let { ctx, content, computedStyle, charWidthList, renderMode } = this;
    // 每次都要清空重新计算，计算会有缓存
    charWidthList.splice(0);
    if(renderMode === mode.CANVAS) {
      ctx.font = css.setFontStyle(computedStyle);
    }
    let key = computedStyle.fontSize + ',' + computedStyle.fontFamily;
    let wait = Text.MEASURE_TEXT.data[key] = Text.MEASURE_TEXT.data[key] || {
      key,
      style: computedStyle,
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
        wait.hash[char] = true;
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

  __measureCb() {
    let { content, computedStyle, charWidthList } = this;
    let key = computedStyle.fontSize + ',' + computedStyle.fontFamily;
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
    let { x, y, w } = data;
    this.__x = x;
    this.__y = y;
    let { isDestroyed, content, currentStyle, computedStyle, lineBoxes, charWidthList } = this;
    if(isDestroyed || currentStyle.display === 'none') {
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
    while(i < length) {
      count += charWidthList[i];
      if(count === w) {
        let lineBox = new LineBox(this, x, y, count, content.slice(begin, i + 1));
        lineBoxes.push(lineBox);
        maxW = Math.max(maxW, count);
        y += computedStyle.lineHeight;
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
        y += computedStyle.lineHeight;
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
      for(i = begin ;i < length; i++) {
        count += charWidthList[i];
      }
      let lineBox = new LineBox(this, x, y, count, content.slice(begin, length));
      lineBoxes.push(lineBox);
      maxW = Math.max(maxW, count);
      y += computedStyle.lineHeight;
    }
    this.__width = maxW;
    this.__height = y - data.y;
    // flex/abs前置计算无需真正布局
    if(!isVirtual) {
      let { textAlign } = computedStyle;
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
  }

  __offsetY(diff, isLayout) {
    super.__offsetY(diff, isLayout);
    if(isLayout) {
      this.lineBoxes.forEach(item => {
        item.__offsetY(diff);
      });
    }
  }

  __renderByMask(renderMode) {
    this.render(renderMode);
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

  render(renderMode) {
    const { isDestroyed, ctx, computedStyle } = this;
    if(isDestroyed || computedStyle.display === 'none') {
      return;
    }
    if(renderMode === mode.CANVAS) {
      ctx.font = css.setFontStyle(computedStyle);
      ctx.fillStyle = computedStyle.color;
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
    return this.style;
  }
  get animateStyle() {
    return this.style;
  }
}

export default Text;
