import Geom from './Geom';
import mode from '../util/mode';

class Circle extends Geom {
  constructor(tagName, props) {
    super(tagName, props);
    // 半径[0, ∞)，默认1
    this.__r = 1;
    if(this.props.r) {
      this.__r = parseFloat(this.props.r);
      if(isNaN(this.r)) {
        this.__r = 1;
      }
    }
  }

  render(renderMode, ctx, defs, isHidden) {
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
      strokeDasharrayStr,
      strokeLinecap,
      strokeLinejoin,
      strokeMiterlimit,
    } = super.render(renderMode, ctx, defs, isHidden);
    if(isDestroyed || display === 'none' || visibility === 'hidden') {
      return;
    }
    let { width, height, r } = this;
    r *= Math.min(width, height) * 0.5;
    if(renderMode === mode.CANVAS) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = strokeWidth;
      ctx.fillStyle = fill;
      ctx.lineCap = strokeLinecap;
      ctx.lineJoin = strokeLinejoin;
      ctx.miterLimit = strokeMiterlimit;
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
      let props = [
        ['cx', cx],
        ['cy', cy],
        ['r', r],
        ['fill', fill],
        ['stroke', stroke],
        ['stroke-width', strokeWidth]
      ];
      if(strokeDasharray.length) {
        props.push(['stroke-dasharray', strokeDasharrayStr]);
      }
      if(strokeLinecap !== 'butt') {
        props.push(['stroke-linecap', strokeLinecap]);
      }
      if(strokeLinejoin !== 'miter') {
        props.push(['stroke-linejoin', strokeLinejoin]);
      }
      if(strokeMiterlimit !== 4) {
        props.push(['stroke-miterlimit', strokeMiterlimit]);
      }
      this.addGeom('circle', props);
    }
  }

  get r() {
    return this.getProps('r');
  }
}

export default Circle;
