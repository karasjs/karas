import Geom from './Geom';
import mode from '../util/mode';

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
    let {
      isDestroyed,
      cx,
      cy,
      display,
      visibility,
      fill,
      stroke,
      strokeWidth,
      strokeDasharray,
      strokeLinecap,
    } = super.render(renderMode);
    if(isDestroyed || display === 'none' || visibility === 'hidden') {
      return;
    }
    let { width, height, ctx, xr, yr } = this;
    xr *= width * 0.5;
    yr *= height * 0.5;
    if(renderMode === mode.CANVAS) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = strokeWidth;
      ctx.fillStyle = fill;
      ctx.lineCap = strokeLinecap;
      ctx.setLineDash(strokeDasharray.split(','));
      ctx.beginPath();
      if(ctx.ellipse) {
        ctx.ellipse(cx, cy, xr, yr, 0, 0, 2 * Math.PI);
      }
      else {
        let ox = xr * .5522848;
        let oy = yr * .5522848;
        ctx.moveTo(cx - xr, cy);
        ctx.bezierCurveTo(cx - xr, cy - oy, cx - ox, cy - yr, cx, cy - yr);
        ctx.bezierCurveTo(cx + ox, cy - yr, cx + xr, cy - oy, cx + xr, cy);
        ctx.bezierCurveTo(cx + xr, cy + oy, cx + ox, cy + yr, cx, cy + yr);
        ctx.bezierCurveTo(cx - ox, cy + yr, cx - xr, cy + oy, cx - xr, cy);
      }
      ctx.fill();
      if(strokeWidth > 0) {
        ctx.stroke();
      }
      ctx.closePath();
    }
    else if(renderMode === mode.SVG) {
      let props = [
        ['cx', cx],
        ['cy', cy],
        ['rx', xr],
        ['ry', yr],
        ['fill', fill],
        ['stroke', stroke],
        ['stroke-width', strokeWidth]
      ];
      if(strokeDasharray.length) {
        props.push(['stroke-dasharray', strokeDasharray]);
      }
      if(strokeLinecap !== 'butt') {
        props.push(['stroke-linecap', strokeLinecap]);
      }
      this.addGeom('ellipse', props);
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
