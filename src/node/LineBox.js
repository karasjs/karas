import css from '../style/css';

class LineBox {
  constructor(ctx, x, y, content, style) {
    this.__ctx = ctx;
    this.__x = x;
    this.__y = y;
    this.__content = content;
    this.__style = style;
  }

  render() {
    this.ctx.fillStyle = this.style.color;
    this.ctx.fillText(this.content, this.x, this.y + css.getBaseLine(this.style));
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
