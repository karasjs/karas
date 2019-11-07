import Geom from './Geom';
import mode from '../util/mode';

class Circle extends Geom {
  constructor(tagName, props) {
    super(tagName, props);
    // 半径0~1，默认1
    this.__r = 1;
    if(this.props.r) {
      this.__r = parseFloat(this.props.r);
      if(isNaN(this.r)) {
        this.__r = 1;
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
    let { width, height, ctx, r } = this;
    r *= Math.min(width, height) * 0.5;
    if(renderMode === mode.CANVAS) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = strokeWidth;
      ctx.fillStyle = fill;
      ctx.lineCap = strokeLinecap;
      ctx.setLineDash(strokeDasharray.split(','));
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, 2 * Math.PI);
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
        ['r', r],
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
      this.addGeom('circle', props);
    }
  }

  get r() {
    return this.__r;
  }
}

export default Circle;
