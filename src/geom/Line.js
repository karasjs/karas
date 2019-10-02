import Geom from './Geom';
import mode from '../mode';
import gradient from '../style/gradient';
import util from "../util";

class Line extends Geom {
  constructor(tagName, props) {
    super(tagName, props);
    // start和end表明线段的首尾坐标，control表明控制点坐标
    this.__start = [0, 0];
    this.__end = [1, 1];
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
    let lg;
    if(stroke.indexOf('linear-gradient') > -1) {
      let v = /\((.+)\)/.exec(stroke);
      if(v) {
        let cx = x1 + (x2 - x1) * 0.5;
        let cy = y1 + (y2 - y1) * 0.5;
        v = v[1].split(/\s*,\s*/);
        let deg = gradient.getLinearDeg(v);
        let r = util.r2d(deg);
        let length = Math.abs(Math.abs(y2 - y1) * Math.sin(r)) + Math.abs(Math.abs(x2 - x1) * Math.cos(r));
        let [xx0, yy0, xx1, yy1] = gradient.calLinearCoords(deg, length * 0.5, cx, cy);
        let list = gradient.getColorStop(v, length);
        lg = {
          xx0,
          yy0,
          xx1,
          yy1,
          list,
        };
      }
    }
    if(renderMode === mode.CANVAS) {
      if(lg) {
        let clg = ctx.createLinearGradient(lg.xx0, lg.yy0, lg.xx1, lg.yy1);
        lg.list.forEach(item => {
          clg.addColorStop(item[1], item[0]);
        });
        ctx.strokeStyle = clg;
      }
      else {
        ctx.strokeStyle = stroke;
      }
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
      if(lg) {
        let uuid = this.defs.add({
          tagName: 'linearGradient',
          props: [
            ['x1', lg.xx0],
            ['y1', lg.yy0],
            ['x2', lg.xx1],
            ['y2', lg.yy1]
          ],
          stop: lg.list,
        });
        stroke = `url(#${uuid})`;
      }
      if(curve === 2) {
        this.addLine([
          ['d', `M${x1} ${y1} C${cx1} ${cy1} ${cx2} ${cy2} ${x2} ${y2}`],
          ['fill', 'none'],
          ['stroke', stroke],
          ['stroke-width', strokeWidth],
          ['stroke-dasharray', strokeDasharray]
        ]);
      }
      else if(curve === 1) {
        this.addLine([
          ['d', `M${x1} ${y1} Q${cx1} ${cy1} ${x2} ${y2}`],
          ['fill', 'none'],
          ['stroke', stroke],
          ['stroke-width', strokeWidth],
          ['stroke-dasharray', strokeDasharray]
        ]);
      }
      else {
        this.addLine([
          ['d', `M${x1} ${y1} L${x2} ${y2}`],
          ['fill', 'none'],
          ['stroke', stroke],
          ['stroke-width', strokeWidth],
          ['stroke-dasharray', strokeDasharray]
        ]);
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
