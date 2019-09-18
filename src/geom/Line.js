import Geom from './Geom';
import mode from '../mode';

class Line extends Geom {
  constructor(props) {
    super('$line', props);
    // start和end表明线段的首尾坐标
    this.__start = [];
    this.__end = [];
    if(Array.isArray(this.props.start)) {
      this.__start = this.props.start;
    }
    if(Array.isArray(this.props.end)) {
      this.__end = this.props.end;
    }
    // 原点位置，4个角，默认左下
    if(['TOP_LEFT', 'TOP_RIGHT', 'BOTTOM_LEFT', 'BOTTOM_RIGHT'].indexOf(this.props.origin) > -1) {
      this.__origin = this.props.origin;
    }
    else {
      this.__origin = 'BOTTOM_LEFT';
    }
  }

  render(renderMode) {
    super.render(renderMode);
    let { x, y, width, height, style, ctx, start, end, origin } = this;
    if(start.length < 2 || end.length < 2) {
      return;
    }
    let {
      display,
      borderTopWidth,
      borderRightWidth,
      borderBottomWidth,
      borderLeftWidth,
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
      paddingTop,
      paddingRight,
      paddingBottom,
      paddingLeft,
      stroke,
      strokeWidth,
      strokeDasharray,
    } = style;
    if(display === 'none') {
      return;
    }
    let x1, y1, x2, y2;
    let originX = x + borderLeftWidth.value + marginLeft.value + paddingLeft.value;
    let originY = y + borderTopWidth.value + marginTop.value + paddingTop.value;
    width -= borderLeftWidth.value + borderRightWidth.value + marginLeft.value + marginRight.value + paddingLeft.value + paddingRight.value;
    height -= borderTopWidth.value + borderBottomWidth.value + marginTop.value + marginBottom.value + paddingTop.value + paddingBottom.value;
    if(origin === 'TOP_LEFT') {
      x1 = originX + start[0] * width;
      y1 = originY + start[1] * height;
      x2 = originX + end[0] * width;
      y2 = originY + end[1] * height;
    }
    else if(origin === 'TOP_RIGHT') {
      x1 = originX + width - start[0] * width;
      y1 = originY + start[1] * height;
      x2 = originX + width - end[0] * width;
      y2 = originY + end[1] * height;
    }
    else if(origin === 'BOTTOM_LEFT') {
      x1 = originX + start[0] * width;
      y1 = originY + height - start[1] * height;
      x2 = originX + end[0] * width;
      y2 = originY + height - end[1] * height;
    }
    else if(origin === 'BOTTOM_RIGHT') {
      x1 = originX + width - start[0] * width;
      y1 = originY + height - start[1] * height;
      x2 = originX + width - end[0] * width;
      y2 = originY + height - end[1] * height;
    }
    if(renderMode === mode.CANVAS) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = strokeWidth;
      ctx.setLineDash(strokeDasharray);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.closePath();
    }
    else if(renderMode === mode.SVG) {
      mode.appendHtml(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke-width="${strokeWidth}" stroke="${stroke}" stroke-dasharray="${strokeDasharray}"/>`);
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
}

export default Line;
