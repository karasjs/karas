import Geom from './Geom';
import mode from '../node/mode';
import util from '../util';

const DEGREE = Math.PI / 180;
const OFFSET = Math.PI * 0.5;

function getCoordByDegree(x, y, r, d) {
  while(d > 360) {
    d -= 360;
  }
  while(d < 0) {
    d += 360;
  }
  if(d >= 0 && d < 90) {
    return [
      x + Math.sin(d * DEGREE) * r,
      y - Math.cos(d * DEGREE) * r
    ];
  }
  else if(d >= 90 && d < 180) {
    return [
      x + Math.cos((d - 90) * DEGREE) * r,
      y + Math.sin((d - 90) * DEGREE) * r,
    ];
  }
  else if(d >= 180 && d < 270) {
    return [
      x - Math.cos((270 - d) * DEGREE) * r,
      y + Math.sin((270 - d) * DEGREE) * r,
    ];
  }
  else {
    return [
      x - Math.sin((360 - d) * DEGREE) * r,
      y - Math.cos((360 - d) * DEGREE) * r,
    ];
  }
}

class Sector extends Geom {
  constructor(props) {
    super('$sector', props);
    // 角度
    this.__start = 0;
    this.__end = 0;
    if(this.props.start) {
      this.__start = parseFloat(this.props.start);
      if(isNaN(this.start)) {
        this.__start = 0;
      }
    }
    if(this.props.end) {
      this.__end = parseFloat(this.props.end);
      if(isNaN(this.end)) {
        this.__end = 0;
      }
    }
    // 圆点位置，默认中间[0.5, 0.5]，只写一个为简写
    this.__origin = [0.5, 0.5];
    if(Array.isArray(this.props.origin) && this.props.origin.length) {
      this.__origin = this.props.origin;
      if(util.isNil(this.origin[1])) {
        this.origin[1] = this.origin[0];
      }
      if(isNaN(this.origin[0])) {
        this.origin[0] = 0.5;
      }
      if(isNaN(this.origin[1])) {
        this.origin[1] = 0.5;
      }
    }
    // 半径0~1，默认1
    this.__radius = 1;
    if(this.props.radius) {
      this.__radius = parseFloat(this.props.radius);
      if(isNaN(this.radius)) {
        this.__radius = 1;
      }
    }
  }

  render() {
    super.render();
    let { x, y, width, height, style, ctx, start, end, origin, radius } = this;
    if(start === end) {
      return;
    }
    let {
      display,
      borderTopWidth,
      borderLeftWidth,
      marginTop,
      marginLeft,
      paddingTop,
      paddingLeft,
      stroke,
      strokeWidth,
      fill,
    } = style;
    if(display === 'none') {
      return;
    }
    let originX = x + borderLeftWidth.value + marginLeft.value + paddingLeft.value;
    let originY = y + borderTopWidth.value + marginTop.value + paddingTop.value;
    originX += origin[0] * width;
    originY += origin[1] * height;
    let r = this.radius * Math.min(width, height) * 0.5;
    if(this.mode === mode.CANVAS) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = strokeWidth;
      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.moveTo(originX, originY);
      ctx.arc(originX, originY, r, start * DEGREE - OFFSET, end * DEGREE - OFFSET);
      ctx.fill();
      if(strokeWidth && stroke !== 'transparent') {
        ctx.stroke();
      }
      ctx.closePath();
    }
    else if(this.mode === mode.SVG) {
      let x1, y1, x2, y2;
      [ x1, y1 ] = getCoordByDegree(originX, originY, r, start);
      [ x2, y2 ] = getCoordByDegree(originX, originY, r, end);
      let large = (end - start) > 180 ? 1 : 0;
      mode.appendHtml(`<path d="M ${originX} ${originY} L ${x1} ${y1} A${r},${r} 0 ${large} 1 ${x2},${y2} z" fill="${fill}" stroke-width="${strokeWidth}" stroke="${stroke}"/>`);
    }
  }

  get start() {
    return this.__start;
  }
  get end() {
    return this.__end;
  }
  get origin() {
    return this.__origin;
  }
  get radius() {
    return this.__radius;
  }
}

export default Sector;
