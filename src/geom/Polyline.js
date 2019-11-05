import Geom from './Geom';
import mode from '../util/mode';

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
    let { isDestroyed, originX, originY, display, visibility, stroke, strokeWidth, strokeDasharray } = super.render(renderMode);
    if(isDestroyed || display === 'none' || visibility === 'hidden') {
      return;
    }
    let { width, height, ctx, points, origin } = this;
    if(points.length < 2) {
      return;
    }
    for(let i = 0, len = points.length; i < len; i++) {
      if(!Array.isArray(points[i]) || points[i].length < 2) {
        return;
      }
    }
    let pts = [];
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
    if(renderMode === mode.CANVAS) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = strokeWidth;
      ctx.setLineDash(strokeDasharray);
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for(let i = 1, len = pts.length; i < len; i++) {
        let point = pts[i];
        ctx.lineTo(point[0], point[1]);
      }
      if(strokeWidth > 0) {
        ctx.stroke();
      }
      ctx.closePath();
    }
    else if(renderMode === mode.SVG) {
      let points = '';
      for(let i = 0, len = pts.length; i < len; i++) {
        let point = pts[i];
        points += `${point[0]},${point[1]} `;
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
