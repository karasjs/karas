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
    let { rx: x, ry: y, width, height, mlw, mtw, plw, ptw, style, ctx, points, virtualDom } = this;
    if(points.length < 3) {
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
      fill,
    } = style;
    if(display === 'none') {
      return;
    }
    let originX = x + borderLeftWidth.value + mlw + plw;
    let originY = y + borderTopWidth.value + mtw + ptw;
    let cx = originX + width * 0.5;
    let cy = originY + height * 0.5;
    let slg;
    if(strokeWidth > 0 && stroke.indexOf('linear-gradient') > -1) {
      let go = gradient.parseGradient(stroke);
      if(go) {
        slg = gradient.getLinear(go.v, cx, cy, width, height);
      }
    }
    let flg;
    let frg;
    if(fill.indexOf('linear-gradient') > -1) {
      let go = gradient.parseGradient(fill);
      if(go) {
        flg = gradient.getLinear(go.v, cx, cy, width, height);
      }
    }
    else if(fill.indexOf('radial-gradient') > -1) {
      let go = gradient.parseGradient(fill);
      if(go) {
        frg = gradient.getRadial(go.v, cx, cy, originX, originY, originY + width, originY + height);
      }
    }
    points.forEach(item => {
      item[0] = originX + item[0] * width;
      item[1] = originY + item[1] * height;
    });
    if(renderMode === mode.CANVAS) {
      ctx.strokeStyle = slg ? gradient.createCanvasLg(ctx, slg) : stroke;
      ctx.lineWidth = strokeWidth;
      if(flg) {
        ctx.fillStyle = gradient.createCanvasLg(ctx, flg);
      }
      else if(frg) {
        ctx.fillStyle = gradient.createCanvasRg(ctx, frg);
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
        let uuid = gradient.createSvgLg(this.defs, slg);
        stroke = `url(#${uuid})`;
      }
      if(flg) {
        let uuid = gradient.createSvgLg(this.defs, flg);
        fill = `url(#${uuid})`;
      }
      else if(frg) {
        let uuid = gradient.createSvgRg(this.defs, frg);
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
