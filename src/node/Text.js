import Node from './Node';
import LineBox from './LineBox';
import css from '../style/css';

function getWordBreakAllIndex(ctx, content, begin, start, end, w) {
  if (start === end) {
    return start;
  }
  if (start === end - 1) {
    let tw = ctx.measureText(content.slice(begin, end)).width;
    if (tw > w) {
      return start;
    }
    return end;
  }
  let center = start + ((end - start) >> 1);
  let tw = ctx.measureText(content.slice(begin, center)).width;
  if (tw > w) {
    return getWordBreakAllIndex(ctx, content, begin, start, center, w);
  }
  return getWordBreakAllIndex(ctx, content, begin, center, end, w);
}

class Text extends Node {
  constructor(content) {
    super();
    this.__content = content || '';
    this.__lineBoxes = [];
  }

  __preLay(data) {
    let { x, y, w, h } = data;
    this.__x = x;
    this.__y = y;
    let maxX = x;
    let { ctx, content, style, lineBoxes } = this;
    ctx.font = css.setFontStyle(style);
    // 2分法查找分割字符串为lineBox，形成多行
    let length = content.length;
    let begin = 0;
    while(begin < length) {
      let i = getWordBreakAllIndex(ctx, content, begin, begin, length, w);
      let lineBox = new LineBox(ctx, x, y, content.slice(begin, i), style);
      lineBoxes.push(lineBox);
      maxX = Math.max(maxX, x + ctx.measureText(content.slice(begin, i)).width);
      y += this.style.lineHeight;
      begin = i;
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

  __measureText() {
    this.ctx.font = css.setFontStyle(this.style);
    return this.ctx.measureText(this.content);
  }
  __offsetY(diff) {
    this.__y += diff;
    this.lineBoxes.forEach(item => {
      item.__offsetY(diff);
    });
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
  get baseLine() {
    let last = this.lineBoxes[this.lineBoxes.length - 1];
    return last.y - this.y + last.baseLine;
  }
}

export default Text;
