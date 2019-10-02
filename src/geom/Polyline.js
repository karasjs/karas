import Geom from './Geom';
import mode from '../mode';
import gradient from "../style/gradient";

class Polyline extends Geom {
  constructor(tagName, props) {
    super(tagName, props);
    // 折线所有点的列表
    this.__points = [];
    if(Array.isArray(this.props.points)) {
      this.__points = this.props.points;
    }
    // 原点位置，4个角，默认左下
    if(['TOP_LEFT', 'TOP_RIGHT', 'BOTTOM_LEFT', 'BOTTOM_RIGHT'].indexOf(this.props.origin) > -1) {
      this.__origin = this.props.origin;
    }
    else {
      this.__origin = 'TOP_LEFT';
    }
  }

  render(renderMode) {
    super.render(renderMode);
    let { rx: x, ry: y, width, height, mlw, mtw, plw, ptw, style, ctx, points, origin, virtualDom } = this;
    if(points.length < 2) {
      return;
    }
    for(let i = 0, len = points.length; i < len; i++) {
      if(!Array.isArray(points[i]) || points[i].length < 2) {
        return;
      }
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
    let pts = this.__pts = [];
    if(origin === 'TOP_LEFT') {
      points.forEach(item => {
        pts.push([
          originX + item[0] * width,
          originY + item[1] * height
        ]);
      });
    }
    else if(origin === 'TOP_RIGHT') {
      points.forEach(item => {
        pts.push([
          originX + width - item[0] * width,
          originY + item[1] * height
        ]);
      });
    }
    else if(origin === 'BOTTOM_LEFT') {
      points.forEach(item => {
        pts.push([
          originX + item[0] * width,
          originY + height - item[1] * height
        ]);
      });
    }
    else if(origin === 'BOTTOM_RIGHT') {
      points.forEach(item => {
        pts.push([
          originX + width - item[0] * width,
          originY + height - item[1] * height
        ]);
      });
    }
    let slg;
    if(stroke.indexOf('linear-gradient') > -1) {
      let go = gradient.parseGradient(stroke);
      if(go) {
        slg = gradient.getLinear(go.v, originX, originY, width, height);
      }
    }
    if(renderMode === mode.CANVAS) {
      ctx.strokeStyle = slg ? gradient.createCanvasLg(ctx, slg) : stroke;
      ctx.lineWidth = strokeWidth;
      ctx.setLineDash(strokeDasharray);
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for(let i = 1, len = pts.length; i < len; i++) {
        let point = pts[i];
        ctx.lineTo(point[0], point[1]);
      }
      ctx.stroke();
      ctx.closePath();
    }
    else if(renderMode === mode.SVG) {
      let points = '';
      for(let i = 0, len = pts.length; i < len; i++) {
        let point = pts[i];
        points += `${point[0]},${point[1]} `;
      }
      if(slg) {
        let uuid = gradient.createSvgLg(this.defs, slg);
        stroke = `url(#${uuid})`;
      }
      this.addGeom('polyline', [
        ['points', points],
        ['fill', 'none'],
        ['stroke', stroke],
        ['stroke-width', strokeWidth],
        ['stroke-dasharray', strokeDasharray]
      ]);
    }
  }

  get points() {
    return this.__points;
  }
  get origin() {
    return this.__origin;
  }
}

export default Polyline;
