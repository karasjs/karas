import Geom from './Geom';
import mode from '../util/mode';

class Rect extends Geom {
  constructor(tagName, props) {
    super(tagName, props);
    // 圆角
    this.__xr = 0;
    if(this.props.rx) {
      this.__xr = parseFloat(this.props.rx);
      if(isNaN(this.xr)) {
        this.__xr = 0;
      }
    }
    this.__yr = 0;
    if(this.props.ry) {
      this.__yr = parseFloat(this.props.ry);
      if(isNaN(this.yr)) {
        this.__yr = 0;
      }
    }
  }

  render(renderMode) {
    let {
      isDestroyed,
      originX,
      originY,
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
    xr = Math.min(xr, 0.5);
    yr = Math.min(yr, 0.5);
    xr *= width;
    yr *= height;
    if(renderMode === mode.CANVAS) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = strokeWidth;
      ctx.fillStyle = fill;
      ctx.lineCap = strokeLinecap;
      ctx.setLineDash(strokeDasharray.split(','));
      ctx.beginPath();
      if(xr === 0 && yr === 0) {
        ctx.moveTo(originX, originY);
        ctx.lineTo(originX + width, originY);
        ctx.lineTo(originX + width, originY + height);
        ctx.lineTo(originX, originY + height);
        ctx.lineTo(originX, originY);
      }
      else {
        let ox = xr * .5522848;
        let oy = yr * .5522848;
        ctx.moveTo(originX + xr, originY);
        ctx.lineTo(originX + width - xr, originY);
        ctx.bezierCurveTo(originX + width + ox - xr, originY, originX + width, originY + yr - oy, originX + width, originY + yr);
        ctx.lineTo(originX + width, originY + height - yr);
        ctx.bezierCurveTo(originX + width, originY + height + oy - yr, originX + width + ox - xr, originY + height, originX + width - xr, originY + height);
        ctx.lineTo(originX + xr, originY + height);
        ctx.bezierCurveTo(originX + xr - ox, originY + height, originX, originY + height + oy - yr, originX, originY + height - yr);
        ctx.lineTo(originX, originY + yr);
        ctx.bezierCurveTo(originX, originY + yr - oy, originX + xr - ox, originY, originX + xr, originY);
      }
      ctx.fill();
      if(strokeWidth > 0) {
        ctx.stroke();
      }
      ctx.closePath();
    }
    else if(renderMode === mode.SVG) {
      let props = [
        ['x', originX],
        ['y', originY],
        ['width', width],
        ['height', height],
        ['fill', fill],
        ['stroke', stroke],
        ['stroke-width', strokeWidth]
      ];
      if(xr) {
        props.push(['rx', xr]);
      }
      if(yr) {
        props.push(['ry', yr]);
      }
      if(strokeDasharray.length) {
        props.push(['stroke-dasharray', strokeDasharray]);
      }
      if(strokeLinecap !== 'butt') {
        props.push(['stroke-linecap', strokeLinecap]);
      }
      this.addGeom('rect', props);
    }
  }

  get xr() {
    return this.__xr;
  }
  get yr() {
    return this.__yr;
  }
}

export default Rect;
