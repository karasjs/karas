import css from '../style/css';
import mode from './mode';

class LineBox {
  constructor(mode, ctx, x, y, w, content, style) {
    this.__mode = mode;
    this.__ctx = ctx;
    this.__x = x;
    this.__y = y;
    this.__width = w;
    this.__content = content;
    this.__style = style;
  }

  render() {
    let { ctx, style, content, x, y } = this;
    if(this.mode === mode.CANVAS) {
      ctx.fillStyle = style.color;
      ctx.fillText(content, x, y + css.getBaseLine(style));
    }
    else if(this.mode === mode.SVG) {
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
  get width() {
    return this.__width;
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
  get mode() {
    return this.__mode;
  }
}

export default LineBox;
