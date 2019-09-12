import css from '../style/css';
import mode from './mode';

class LineBox {
  constructor(ctx, x, y, content, style) {
    this.__ctx = ctx;
    this.__x = x;
    this.__y = y;
    this.__content = content;
    this.__style = style;
  }

  render() {
    let { ctx, style, content, x, y } = this;
    if(mode.isCanvas()) {
      ctx.fillStyle = style.color;
      ctx.fillText(content, x, y + css.getBaseLine(style));
    }
    else if(mode.isSvg()) {
      mode.appendHtml(`<text x="${x}" y="${y + css.getBaseLine(style)}" fill="${style.color}" font-size="${style.fontSize}px">${content}</text>`);
    }
  }

  __offsetX(diff) {
    this.__x += diff;
  }

  __offsetY(diff) {
    this.__y += diff;
  }

  get ctx() {
    return this.__ctx;
  }
  get x() {
    return this.__x;
  }
  get y() {
    return this.__y;
  }
  get content() {
    return this.__content;
  }
  get style() {
    return this.__style;
  }
  get baseLine() {
    return css.getBaseLine(this.style);
  }
}

export default LineBox;
