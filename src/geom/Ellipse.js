import Geom from './Geom';
import mode from '../mode';

class Ellipse extends Geom {
  constructor(tagName, props) {
    super(tagName, props);
    // 半径0~1，默认1
    this.__xr = 1;
    if(this.props.rx) {
      this.__xr = parseFloat(this.props.rx);
      if(isNaN(this.xr)) {
        this.__xr = 1;
      }
    }
    this.__yr = 1;
    if(this.props.ry) {
      this.__yr = parseFloat(this.props.ry);
      if(isNaN(this.yr)) {
        this.__yr = 1;
      }
    }
  }

  render(renderMode) {
    let { cx, cy, display, fill, stroke, strokeWidth, strokeDasharray } = super.render(renderMode);
    if(display === 'none') {
      return;
    }
    let { width, height, ctx, xr, yr } = this;
    xr *= width * 0.5;
    yr *= height * 0.5;
    if(renderMode === mode.CANVAS) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = strokeWidth;
      ctx.fillStyle = fill;
      ctx.setLineDash(strokeDasharray);
      ctx.beginPath();
      ctx.ellipse && ctx.ellipse(cx, cy, xr, yr, 0, 0, 2 * Math.PI);
      ctx.fill();
      if(strokeWidth > 0) {
        ctx.stroke();
      }
      ctx.closePath();
    }
    else if(renderMode === mode.SVG) {
      this.addGeom('ellipse', [
        ['cx', cx],
        ['cy', cy],
        ['rx', xr],
        ['ry', yr],
        ['fill', fill],
        ['stroke', stroke],
        ['stroke-width', strokeWidth],
        ['stroke-dasharray', strokeDasharray]
      ]);
    }
  }

  get xr() {
    return this.__xr;
  }
  get yr() {
    return this.__yr;
  }
}

export default Ellipse;
