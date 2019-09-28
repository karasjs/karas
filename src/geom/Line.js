import Geom from './Geom';
import mode from '../mode';

class Line extends Geom {
  constructor(tagName, props) {
    super(tagName, props);
    // start和end表明线段的首尾坐标，control表明控制点坐标
    this.__start = [];
    this.__end = [];
    this.__control = [];
    if(Array.isArray(this.props.start)) {
      this.__start = this.props.start;
    }
    if(Array.isArray(this.props.end)) {
      this.__end = this.props.end;
    }
    if(Array.isArray(this.props.control)) {
      this.__control = this.props.control;
    }
  }

  render(renderMode) {
    super.render(renderMode);
    let { rx: x, ry: y, width, height, mlw, mtw, plw, ptw, style, ctx, start, end, control, virtualDom } = this;
    if(start.length < 2 || end.length < 2) {
      return;
    }
    let {
      display,
      borderTopWidth,
      borderRightWidth,
      borderBottomWidth,
      borderLeftWidth,
      stroke,
      strokeWidth,
      strokeDasharray,
    } = style;
    if(display === 'none') {
      return;
    }
    let originX = x + borderLeftWidth.value + mlw + plw;
    let originY = y + borderTopWidth.value + mtw + ptw;
    let x1 = originX + start[0] * width;
    let y1 = originY + start[1] * height;
    let x2 = originX + end[0] * width;
    let y2 = originY + end[1] * height;
    let curve = 0;
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
      ctx.stroke();
      ctx.closePath();
    }
    else if(renderMode === mode.SVG) {
      if(curve === 2) {
        virtualDom.children.push({
          type: 'item',
          tagName: 'path',
          props: [
            ['d', `M${x1} ${y1} C${cx1} ${cy1} ${cx2} ${cy2} ${x2} ${y2}`],
            ['fill', 'none'],
            ['stroke', stroke],
            ['stroke-width', strokeWidth],
            ['stroke-dasharray', strokeDasharray]
          ],
        });
      }
      else if(curve === 1) {
        virtualDom.children.push({
          type: 'item',
          tagName: 'path',
          props: [
            ['d', `M${x1} ${y1} Q${cx1} ${cy1} ${x2} ${y2}`],
            ['fill', 'none'],
            ['stroke', stroke],
            ['stroke-width', strokeWidth],
            ['stroke-dasharray', strokeDasharray]
          ],
        });
      }
      else {
        virtualDom.children.push({
          type: 'item',
          tagName: 'line',
          props: [
            ['x1', x1],
            ['y1', y1],
            ['x2', x2],
            ['y2', y2],
            ['stroke', stroke],
            ['stroke-width', strokeWidth],
            ['stroke-dasharray', strokeDasharray]
          ],
        });
      }
    }
  }

  get start() {
    return this.__start;
  }
  get end() {
    return this.__end;
  }
  get control() {
    return this.__control;
  }
}

export default Line;
