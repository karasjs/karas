import Geom from './Geom';
import mode from '../util/mode';

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
    this.__begin = 0;
    this.__end = 0;
    if(this.props.begin) {
      this.__begin = parseFloat(this.props.begin);
      if(isNaN(this.begin)) {
        this.__begin = 0;
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
    // 扇形两侧是否有边
    this.__edge = false;
    if(this.props.edge !== undefined) {
      this.__edge = !!this.props.edge;
    }
  }

  render(renderMode) {
    let { cx, cy, display, fill, stroke, strokeWidth, strokeDasharray } = super.render(renderMode);
    if(display === 'none') {
      return;
    }
    let { width, height, ctx, begin, end, r } = this;
    if(begin === end) {
      return;
    }
    r *= Math.min(width, height) * 0.5;
    let x1, y1, x2, y2;
    [ x1, y1 ] = getCoordsByDegree(cx, cy, r, begin);
    [ x2, y2 ] = getCoordsByDegree(cx, cy, r, end);
    if(renderMode === mode.CANVAS) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = strokeWidth;
      ctx.fillStyle = fill;
      ctx.setLineDash(strokeDasharray);
      ctx.beginPath();
      ctx.arc(cx, cy, r, begin * Math.PI / 180 - OFFSET, end * Math.PI / 180 - OFFSET);
      if(this.edge) {
        ctx.lineTo(cx, cy);
        ctx.lineTo(x1, y1);
        if(strokeWidth > 0) {
          ctx.stroke();
        }
      }
      else {
        if(strokeWidth > 0) {
          ctx.stroke();
        }
        ctx.lineTo(cx, cy);
        ctx.lineTo(x1, y1);
      }
      ctx.fill();
      ctx.closePath();
    }
    else if(renderMode === mode.SVG) {
      let large = (end - begin) > 180 ? 1 : 0;
      if(this.edge) {
        this.addGeom('path', [
          ['d', `M${cx} ${cy} L${x1} ${y1} A${r} ${r} 0 ${large} 1 ${x2} ${y2} z`],
          ['fill', fill],
          ['stroke', stroke],
          ['stroke-width', strokeWidth],
          ['stroke-dasharray', strokeDasharray]
        ]);
      }
      else {
        this.addGeom('path', [
          ['d', `M${cx} ${cy} L${x1} ${y1} A${r} ${r} 0 ${large} 1 ${x2} ${y2} z`],
          ['fill', fill]
        ]);
        this.addGeom('path', [
          ['d', `M${x1} ${y1} A${r} ${r} 0 ${large} 1 ${x2} ${y2}`],
          ['fill', 'transparent'],
          ['stroke', stroke],
          ['stroke-width', strokeWidth],
          ['stroke-dasharray', strokeDasharray]
        ]);
      }
    }
  }

  get begin() {
    return this.__begin;
  }
  get end() {
    return this.__end;
  }
  get r() {
    return this.__r;
  }
  get edge() {
    return this.__edge;
  }
}

export default Sector;
