import Geom from './Geom';
import mode from '../util/mode';

class Ellipse extends Geom {
  constructor(tagName, props) {
    super(tagName, props);
    // 半径0~1，默认1
    this.__rx = 1;
    if(this.props.rx) {
      this.__rx = parseFloat(this.props.rx);
      if(isNaN(this.rx)) {
        this.__rx = 1;
      }
    }
    this.__ry = 1;
    if(this.props.ry) {
      this.__ry = parseFloat(this.props.ry);
      if(isNaN(this.ry)) {
        this.__ry = 1;
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
    let { width, height, ctx, rx, ry } = this;
    rx *= width * 0.5;
    ry *= height * 0.5;
    if(renderMode === mode.CANVAS) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = strokeWidth;
      ctx.fillStyle = fill;
      ctx.lineCap = strokeLinecap;
      ctx.setLineDash(strokeDasharray.split(','));
      ctx.beginPath();
      if(ctx.ellipse) {
        ctx.ellipse(cx, cy, rx, ry, 0, 0, 2 * Math.PI);
      }
      else {
        let ox = rx * .5522848;
        let oy = ry * .5522848;
        ctx.moveTo(cx - rx, cy);
        ctx.bezierCurveTo(cx - rx, cy - oy, cx - ox, cy - ry, cx, cy - ry);
        ctx.bezierCurveTo(cx + ox, cy - ry, cx + rx, cy - oy, cx + rx, cy);
        ctx.bezierCurveTo(cx + rx, cy + oy, cx + ox, cy + ry, cx, cy + ry);
        ctx.bezierCurveTo(cx - ox, cy + ry, cx - rx, cy + oy, cx - rx, cy);
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
        ['rx', rx],
        ['ry', ry],
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

  get rx() {
    return this.__rx;
  }
  get ry() {
    return this.__ry;
  }
}

export default Ellipse;
