import Geom from './Geom';

class Line extends Geom {
  constructor(props) {
    super(props);
    this.__tagName = '$line';
    this.__start = [0, 0];
    this.__end = [1, 1];
    if(Array.isArray(this.props.start)) {
      this.__start = this.props.start;
    }
    if(Array.isArray(this.props.end)) {
      this.__end = this.props.end;
    }
  }

  render() {
    super.render();
    let { x, y, width, height, style, ctx, start, end } = this;
    let {
      borderTopWidth,
      borderLeftWidth,
      stroke,
      strokeWidth,
    } = style;
    let originX = x + borderLeftWidth.value;
    let originY = y + borderTopWidth.value;
    ctx.strokeStyle = stroke;
    ctx.lineWidth = strokeWidth;
    ctx.beginPath();
    ctx.moveTo(originX + start[0] * width, originY + start[1] * height);
    ctx.lineTo(originX + end[0] * width, originY + end[1] * height);
    ctx.stroke();
    ctx.closePath();
  }

  get start() {
    return this.__start;
  }
  get end() {
    return this.__end;
  }
}

export default Line;
