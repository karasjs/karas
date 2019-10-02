import Geom from './Geom';
import mode from '../mode';
import gradient from "../style/gradient";

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
    super.render(renderMode);
    let { width, height, ctx, xr, yr } = this;
    let {
      cx, cy, display, fill,
      stroke, strokeWidth, strokeDasharray,
      slg, flg, frg } = this.__getPreRender();
    if(display === 'none') {
      return;
    }
    xr *= width * 0.5;
    yr *= height * 0.5;
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
      ctx.ellipse && ctx.ellipse(cx, cy, xr, yr, 0, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      ctx.closePath();
    }
    else if(renderMode === mode.SVG) {
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
