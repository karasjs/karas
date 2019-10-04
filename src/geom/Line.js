import Geom from './Geom';
import mode from '../mode';

class Line extends Geom {
  constructor(tagName, props) {
    super(tagName, props);
    // begin和end表明线段的首尾坐标，control表明控制点坐标
    this.__begin = [0, 0];
    this.__end = [1, 1];
    this.__control = [];
    if(Array.isArray(this.props.begin)) {
      this.__begin = this.props.begin;
    }
    if(Array.isArray(this.props.end)) {
      this.__end = this.props.end;
    }
    if(Array.isArray(this.props.control)) {
      this.__control = this.props.control;
    }
  }

  render(renderMode) {
    let { display, originX, originY, stroke, strokeWidth, strokeDasharray } = super.render(renderMode);
    if(display === 'none') {
      return;
    }
    let { width, height, ctx, begin, end, control } = this;
    if(begin.length < 2 || end.length < 2) {
      return;
    }
    let x1 = originX + begin[0] * width;
    let y1 = originY + begin[1] * height;
    let x2 = originX + end[0] * width;
    let y2 = originY + end[1] * height;
    let curve = 0;
    // 控制点，曲线
    let cx1, cy1, cx2, cy2;
    if(Array.isArray(control[0])) {
      curve++;
      cx1 = originX + control[0][0] * width;
      cy1 = originY + control[0][1] * height;
    }
    if(Array.isArray(control[1])) {
      curve++;
      cx2 = originX + control[1][0] * width;
      cy2 = originY + control[1][1] * height;
    }
    if(renderMode === mode.CANVAS) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = strokeWidth;
      ctx.setLineDash(strokeDasharray);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      if(curve === 2) {
        ctx.bezierCurveTo(cx1, cy1, cx2, cy2, x2, y2);
      }
      else if(curve === 1) {
        ctx.quadraticCurveTo(cx1, cy1, x2, y2);
      }
      else {
        ctx.lineTo(x2, y2);
      }
      if(strokeWidth > 0) {
        ctx.stroke();
      }
      ctx.closePath();
    }
    else if(renderMode === mode.SVG) {
      let d;
      if(curve === 2) {
        d = `M${x1} ${y1} C${cx1} ${cy1} ${cx2} ${cy2} ${x2} ${y2}`;
      }
      else if(curve === 1) {
        d = `M${x1} ${y1} Q${cx1} ${cy1} ${x2} ${y2}`;
      }
      else {
        d = `M${x1} ${y1} L${x2} ${y2}`;
      }
      this.addGeom('path', [
        ['d', d],
        ['fill', 'none'],
        ['stroke', stroke],
        ['stroke-width', strokeWidth],
        ['stroke-dasharray', strokeDasharray]
      ]);
    }
  }

  get begin() {
    return this.__begin;
  }
  get end() {
    return this.__end;
  }
  get control() {
    return this.__control;
  }
}

export default Line;
