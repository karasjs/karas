import Geom from './Geom';
import mode from '../mode';
import gradient from '../style/gradient';

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
    super.render(renderMode);
    let { width, height, ctx, r } = this;
    let {
      cx, cy, display, fill,
      stroke, strokeWidth, strokeDasharray,
      slg, flg, frg } = this.getPreRender();
    if(display === 'none') {
      return;
    }
    r *= Math.min(width, height) * 0.5;
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
      ctx.arc(cx, cy, r, 0, 2 * Math.PI);
      ctx.fill();
      if(strokeWidth > 0) {
        ctx.stroke();
      }
      ctx.closePath();
    }
    else if(renderMode === mode.SVG) {
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
