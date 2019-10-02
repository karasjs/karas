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
    let { rx: x, ry: y, width, height, mlw, mtw, plw, ptw, style, ctx, r, virtualDom } = this;
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
    r *= Math.min(width, height) * 0.5;
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
      ctx.arc(cx, cy, r, 0, 2 * Math.PI);
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
