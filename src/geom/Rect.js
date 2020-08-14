import Geom from './Geom';
import mode from '../util/mode';
import draw from '../util/draw';
import geom from '../math/geom';

class Rect extends Geom {
  constructor(tagName, props) {
    super(tagName, props);
    // 圆角
    this.__rx = 0;
    if(this.props.rx) {
      this.__rx = parseFloat(this.props.rx);
      if(isNaN(this.rx)) {
        this.__rx = 0;
      }
    }
    this.__ry = 0;
    if(this.props.ry) {
      this.__ry = parseFloat(this.props.ry);
      if(isNaN(this.ry)) {
        this.__ry = 0;
      }
    }
  }

  render(renderMode, ctx, defs) {
    let {
      isDestroyed,
      originX,
      originY,
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
    let { width, height, rx, ry, __cacheProps } = this;
    if(__cacheProps.rx === undefined) {
      rx = Math.min(rx, 0.5);
      rx *= width;
      __cacheProps.rx = rx;
      if(rx) {
        __cacheProps.ox = rx * geom.H;
      }
    }
    if(__cacheProps.ry === undefined) {
      ry = Math.min(ry, 0.5);
      ry *= height;
      __cacheProps.ry = ry;
      if(ry) {
        __cacheProps.oy = ry * geom.H;
      }
    }
    if(renderMode === mode.CANVAS) {
      ctx.beginPath();
      if(__cacheProps.rx === 0 && __cacheProps.ry === 0) {
        ctx.rect(originX, originY, width, height);
        ctx.closePath();
        ctx.fill();
      }
      else {
        let ox = __cacheProps.ox;
        let oy = __cacheProps.oy;
        let list = [
          [originX + rx, originY],
          [originX + width - rx, originY],
          [originX + width + ox - rx, originY, originX + width, originY + ry - oy, originX + width, originY + ry],
          [originX + width, originY + height - ry],
          [originX + width, originY + height + oy - ry, originX + width + ox - rx, originY + height, originX + width - rx, originY + height],
          [originX + rx, originY + height],
          [originX + rx - ox, originY + height, originX, originY + height + oy - ry, originX, originY + height - ry],
          [originX, originY + ry],
          [originX, originY + ry - oy, originX + rx - ox, originY, originX + rx, originY]
        ];
        draw.genCanvasPolygon(ctx, list);
      }
      if(strokeWidth > 0) {
        ctx.stroke();
      }
    }
    else if(renderMode === mode.SVG) {
      let props = [
        ['x', originX],
        ['y', originY],
        ['width', width],
        ['height', height],
        ['fill', fill],
        ['stroke', stroke],
        ['stroke-width', strokeWidth]
      ];
      if(rx) {
        props.push(['rx', rx]);
      }
      if(ry) {
        props.push(['ry', ry]);
      }
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
      this.addGeom('rect', props);
    }
  }

  get rx() {
    return this.getProps('rx');
  }
  get ry() {
    return this.getProps('ry');
  }
}

export default Rect;
