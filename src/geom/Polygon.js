import Geom from './Geom';
import mode from '../util/mode';

class Polygon extends Geom {
  constructor(tagName, props) {
    super(tagName, props);
    // 所有点的列表
    this.__points = [];
    if(Array.isArray(this.props.points)) {
      this.__points = this.props.points;
    }
  }

  render(renderMode) {
    let { isDestroyed, originX, originY, display, visibility, fill, stroke, strokeWidth, strokeDasharray } = super.render(renderMode);
    if(isDestroyed || display === 'none' || visibility === 'hidden') {
      return;
    }
    let { width, height, ctx, points } = this;
    if(points.length < 3) {
      return;
    }
    for(let i = 0, len = points.length; i < len; i++) {
      if(!Array.isArray(points[i]) || points[i].length < 2) {
        return;
      }
    }
    let pts = [];
    points.forEach(item => {
      pts.push([
        originX + item[0] * width,
        originY + item[1] * height
      ]);
    });
    if(renderMode === mode.CANVAS) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = strokeWidth;
      ctx.fillStyle = fill;
      ctx.setLineDash(strokeDasharray);
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for(let i = 1, len = pts.length; i < len; i++) {
        let point = pts[i];
        ctx.lineTo(point[0], point[1]);
      }
      ctx.lineTo(pts[0][0], pts[0][1]);
      ctx.fill();
      if(strokeWidth > 0) {
        ctx.stroke();
      }
      ctx.closePath();
    }
    else if(renderMode === mode.SVG) {
      let s = '';
      for(let i = 0, len = pts.length; i < len; i++) {
        let point = pts[i];
        s += `${point[0]},${point[1]} `;
      }
      this.addGeom('polygon', [
        ['points', s],
        ['fill', fill],
        ['stroke', stroke],
        ['stroke-width', strokeWidth],
        ['stroke-dasharray', strokeDasharray]
      ]);
    }
  }

  get points() {
    return this.__points;
  }
}

export default Polygon;
