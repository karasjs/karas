import Geom from './Geom';
import mode from '../mode';
import gradient from '../style/gradient';

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
    super.render(renderMode);
    let { width, height, ctx, points } = this;
    if(points.length < 3) {
      return;
    }
    for(let i = 0, len = points.length; i < len; i++) {
      if(!Array.isArray(points[i]) || points[i].length < 2) {
        return;
      }
    }
    let {
      originX, originY, display, fill,
      stroke, strokeWidth, strokeDasharray,
      slg, flg, frg } = this.getPreRender();
    if(display === 'none') {
      return;
    }
    points.forEach(item => {
      item[0] = originX + item[0] * width;
      item[1] = originY + item[1] * height;
    });
    if(renderMode === mode.CANVAS) {
      ctx.strokeStyle = slg ? this.getCanvasLg(slg) : stroke;
      ctx.lineWidth = strokeWidth;
      if(flg) {
        ctx.fillStyle = this.getCanvasLg(flg);
      }
      else if(frg) {
        ctx.fillStyle = this.getCanvasRg(frg);
      }
      else {
        ctx.fillStyle = fill;
      }
      ctx.setLineDash(strokeDasharray);
      ctx.beginPath();
      ctx.moveTo(points[0][0], points[0][1]);
      for(let i = 1, len = points.length; i < len; i++) {
        let point = points[i];
        ctx.lineTo(point[0], point[1]);
      }
      ctx.lineTo(points[0][0], points[0][1]);
      ctx.fill();
      ctx.stroke();
      ctx.closePath();
    }
    else if(renderMode === mode.SVG) {
      let pts = '';
      for(let i = 0, len = points.length; i < len; i++) {
        let point = points[i];
        pts += `${point[0]},${point[1]} `;
      }
      if(slg) {
        let uuid = this.getSvgLg(slg);
        stroke = `url(#${uuid})`;
      }
      if(flg) {
        let uuid = this.getSvgLg(flg);
        fill = `url(#${uuid})`;
      }
      else if(frg) {
        let uuid = this.getSvgRg(frg);
        fill = `url(#${uuid})`;
      }
      this.addGeom('polygon', [
        ['points', pts],
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
