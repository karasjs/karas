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
    // 扇形大于180°时，是否闭合两端
    this.__closure = false;
    if(this.props.closure !== undefined) {
      this.__closure = !!this.props.closure;
    }
  }

  render(renderMode, ctx, defs) {
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
    } = super.render(renderMode, ctx, defs);
    if(isDestroyed || display === 'none' || visibility === 'hidden') {
      return;
    }
    let { width, height, begin, end, r, edge, closure } = this;
    if(begin === end) {
      return;
    }
    r *= Math.min(width, height) * 0.5;
    let x1, y1, x2, y2;
    [ x1, y1 ] = getCoordsByDegree(cx, cy, r, begin);
    [ x2, y2 ] = getCoordsByDegree(cx, cy, r, end);
    let large = (end - begin) > 180 ? 1 : 0;
    if(renderMode === mode.CANVAS) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = strokeWidth;
      ctx.fillStyle = fill;
      ctx.lineCap = strokeLinecap;
      ctx.lineJoin = strokeLinejoin;
      ctx.miterLimit = strokeMiterlimit;
      ctx.setLineDash(strokeDasharray);
      ctx.beginPath();
      ctx.arc(cx, cy, r, begin * Math.PI / 180 - OFFSET, end * Math.PI / 180 - OFFSET);
      if(edge) {
        if(!large || !closure) {
          ctx.lineTo(cx, cy);
        }
        ctx.lineTo(x1, y1);
        if(strokeWidth > 0) {
          ctx.stroke();
        }
      }
      else {
        if(strokeWidth > 0) {
          ctx.stroke();
        }
        if(!large || !closure) {
          ctx.lineTo(cx, cy);
        }
        ctx.lineTo(x1, y1);
      }
      ctx.fill();
      ctx.closePath();
    }
    else if(renderMode === mode.SVG) {
      if(edge) {
        let props = [
          ['d', closure
            ? `M${x1} ${y1} A${r} ${r} 0 ${large} 1 ${x2} ${y2} z`
            : `M${cx} ${cy} L${x1} ${y1} A${r} ${r} 0 ${large} 1 ${x2} ${y2} z`],
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
        this.addGeom('path', props);
      }
      else {
        this.addGeom('path', [
          ['d', closure
            ? `M${x1},${y1} A${r} ${r} 0 ${large} 1 ${x2},${y2} z`
            : `M${cx},${cy} L${x1},${y1} A${r} ${r} 0 ${large} 1 ${x2},${y2} z`],
          ['fill', fill]
        ]);
        if(strokeWidth > 0) {
          let props = [
            ['d', `M${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2}`],
            ['fill', 'rgba(0,0,0,0)'],
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
          this.addGeom('path', props);
        }
      }
    }
  }

  get begin() {
    return this.getProps('begin');
  }
  get end() {
    return this.getProps('end');
  }
  get r() {
    return this.getProps('r');
  }
  get edge() {
    return this.getProps('edge');
  }
  get closure() {
    return this.getProps('closure');
  }
}

export default Sector;
