import Geom from './Geom';
import mode from '../node/mode';

class Line extends Geom {
  constructor(props) {
    super('$line', props);
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
    let x1 = originX + start[0] * width;
    let y1 = originY + start[1] * height;
    let x2 = originX + end[0] * width;
    let y2 = originY + end[1] * height;
    if(mode.isCanvas()) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = strokeWidth;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.closePath();
    }
    else if(mode.isSvg()) {
      mode.appendHtml(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke-width="${strokeWidth}" stroke="${stroke}"/>`);
    }
  }

  get start() {
    return this.__start;
  }
  get end() {
    return this.__end;
  }
}

export default Line;
