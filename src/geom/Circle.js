import Geom from './Geom';
import mode from '../mode';

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
    let { cx, cy, display, fill, stroke, strokeWidth, strokeDasharray } = super.render(renderMode);
    if(display === 'none') {
      return;
    }
    let { width, height, ctx, r } = this;
    r *= Math.min(width, height) * 0.5;
    if(renderMode === mode.CANVAS) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = strokeWidth;
      ctx.fillStyle = fill;
      ctx.setLineDash(strokeDasharray);
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, 2 * Math.PI);
      ctx.fill();
      if(strokeWidth > 0) {
        ctx.stroke();
      }
      ctx.closePath();
    }
    else if(renderMode === mode.SVG) {
      this.addGeom('circle', [
        ['cx', cx],
        ['cy', cy],
        ['r', r],
        ['fill', fill],
        ['stroke', stroke],
        ['stroke-width', strokeWidth],
        ['stroke-dasharray', strokeDasharray]
      ]);
    }
  }

  get r() {
    return this.__r;
  }
}

export default Circle;
