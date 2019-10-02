import Geom from './Geom';
import mode from '../mode';
import gradient from "../style/gradient";

const OFFSET = Math.PI * 0.5;

function getCoordsByDegree(x, y, r, d) {
  d = d % 360;
  if(d >= 0 && d < 90) {
    return [
      x + Math.sin(d * Math.PI / 180) * r,
      y - Math.cos(d * Math.PI / 180) * r
    ];
  }
  else if(d >= 90 && d < 180) {
    return [
      x + Math.cos((d - 90) * Math.PI / 180) * r,
      y + Math.sin((d - 90) * Math.PI / 180) * r,
    ];
  }
  else if(d >= 180 && d < 270) {
    return [
      x - Math.cos((270 - d) * Math.PI / 180) * r,
      y + Math.sin((270 - d) * Math.PI / 180) * r,
    ];
  }
  else {
    return [
      x - Math.sin((360 - d) * Math.PI / 180) * r,
      y - Math.cos((360 - d) * Math.PI / 180) * r,
    ];
  }
}

class Sector extends Geom {
  constructor(tagName, props) {
    super(tagName, props);
    // 角度
    this.__start = 0;
    this.__end = 0;
    if(this.props.start) {
      this.__start = parseFloat(this.props.start);
      if(isNaN(this.start)) {
        this.__start = 0;
      }
    }
    if(this.props.end) {
      this.__end = parseFloat(this.props.end);
      if(isNaN(this.end)) {
        this.__end = 0;
      }
    }
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
    let { rx: x, ry: y, width, height, mlw, mtw, plw, ptw, style, ctx, start, end, r, virtualDom } = this;
    if(start === end) {
      return;
    }
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
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, start * Math.PI / 180 - OFFSET, end * Math.PI / 180 - OFFSET);
      ctx.lineTo(cx, cy);
      ctx.fill();
      ctx.stroke();
      ctx.closePath();
    }
    else if(renderMode === mode.SVG) {
      let x1, y1, x2, y2;
      [ x1, y1 ] = getCoordsByDegree(cx, cy, r, start);
      [ x2, y2 ] = getCoordsByDegree(cx, cy, r, end);
      let large = (end - start) > 180 ? 1 : 0;
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
      this.addGeom('path', [
        ['d', `M${cx} ${cy} L${x1} ${y1} A${r} ${r} 0 ${large} 1 ${x2} ${y2} z`],
        ['fill', fill],
        ['stroke', stroke],
        ['stroke-width', strokeWidth],
        ['stroke-dasharray', strokeDasharray]
      ]);
    }
  }

  get start() {
    return this.__start;
  }
  get end() {
    return this.__end;
  }
  get r() {
    return this.__r;
  }
}

export default Sector;
