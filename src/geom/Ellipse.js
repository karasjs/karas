import Geom from './Geom';
import mode from '../util/mode';
import painter from '../util/painter';
import geom from '../math/geom';

class Ellipse extends Geom {
  constructor(tagName, props) {
    super(tagName, props);
    // 半径[0, ∞)，默认1
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

  render(renderMode, ctx, defs) {
    let {
      isDestroyed,
      cache,
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
    if(isDestroyed || display === 'none' || visibility === 'hidden' || cache) {
      return;
    }
    let { width, height, rx, ry, __cacheProps } = this;
    if(__cacheProps.rx === undefined) {
      rx *= width * 0.5;
      __cacheProps.rx = rx;
      if(rx) {
        __cacheProps.ox = rx * geom.H;
      }
    }
    if(__cacheProps.ry === undefined) {
      ry *= height * 0.5;
      __cacheProps.ry = ry;
      if(ry) {
        __cacheProps.oy = ry * geom.H;
      }
    }
    if(renderMode === mode.CANVAS) {
      ctx.beginPath();
      if(ctx.ellipse) {
        ctx.ellipse(cx, cy, __cacheProps.rx, __cacheProps.ry, 0, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
      }
      else {
        let ox = __cacheProps.ox;
        let oy = __cacheProps.oy;
        let list = [
          [cx - rx, cy],
          [cx - rx, cy - oy, cx - ox, cy - ry, cx, cy - ry],
          [cx + ox, cy - ry, cx + rx, cy - oy, cx + rx, cy],
          [cx + rx, cy + oy, cx + ox, cy + ry, cx, cy + ry],
          [cx - ox, cy + ry, cx - rx, cy + oy, cx - rx, cy]
        ];
        painter.genCanvasPolygon(ctx, list);
      }
      if(strokeWidth > 0) {
        ctx.stroke();
      }
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
      this.addGeom('ellipse', props);
    }
  }

  get rx() {
    return this.getProps('rx');
  }
  get ry() {
    return this.getProps('ry');
  }
}

export default Ellipse;
