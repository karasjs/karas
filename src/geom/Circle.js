import Geom from './Geom';
import mode from '../node/mode';
import util from '../util/util';
import painter from '../util/painter';
import geom from '../math/geom';

let { isNil } = util;

function getR(v) {
  v = parseFloat(v);
  if(isNaN(v)) {
    v = 1;
  }
  return v;
}

class Circle extends Geom {
  constructor(tagName, props) {
    super(tagName, props);
    // 半径[0, ∞)，默认1
    if(this.isMulti) {
      this.__r = [1];
      if(Array.isArray(props.r)) {
        this.__r = props.r.map(i => getR(i));
      }
      else if(!isNil(props.r)) {
        this.__r = getR(props.r);
      }
    }
    else {
      this.__r = 1;
      if(!isNil(props.r)) {
        this.__r = getR(props.r);
      }
    }
  }

  buildCache(cx, cy) {
    let { width, r, __cacheProps, isMulti } = this;
    if(isNil(__cacheProps.r)) {
      if(isMulti) {
        __cacheProps.r = r.map(i => i * width * 0.5);
        __cacheProps.list = __cacheProps.r.map(r => geom.ellipsePoints(cx, cy, r));
      }
      else {
        __cacheProps.r = r * width * 0.5;
        __cacheProps.list = geom.ellipsePoints(cx, cy, __cacheProps.r);
      }
    }
  }

  render(renderMode, lv, ctx, defs) {
    let res = super.render(renderMode, lv, ctx, defs);
    if(res.break) {
      return res;
    }
    let {
      cx,
      cy,
      fill,
      stroke,
      strokeWidth,
      strokeDasharrayStr,
      strokeLinecap,
      strokeLinejoin,
      strokeMiterlimit,
      dx,
      dy,
    } = res;
    let { __cacheProps, isMulti } = this;
    this.buildCache(cx, cy);
    let list = __cacheProps.list;
    if(renderMode === mode.CANVAS) {
      ctx.beginPath();
      if(isMulti) {
        list.forEach(item => painter.canvasPolygon(ctx, item, dx, dy));
      }
      else {
        painter.canvasPolygon(ctx, list, dx, dy);
      }
      ctx.fill();
      if(strokeWidth > 0) {
        ctx.stroke();
      }
      ctx.closePath();
    }
    else if(renderMode === mode.SVG) {
      let d = '';
      if(isMulti) {
        list.forEach(item => d += painter.svgPolygon(item));
      }
      else {
        d = painter.svgPolygon(list);
      }
      let props = [
        ['d', d],
        ['fill', fill],
        ['stroke', stroke],
        ['stroke-width', strokeWidth],
      ];
      this.__propsStrokeStyle(props, strokeDasharrayStr, strokeLinecap, strokeLinejoin, strokeMiterlimit);
      this.addGeom('path', props);
    }
    return res;
  }

  get r() {
    return this.getProps('r');
  }

  get bbox() {
    let {
      isMulti, __cacheProps,
      __sx2, __sy2, width, height,
      computedStyle: {
        paddingTop,
        paddingLeft,
        strokeWidth,
        boxShadow,
        filter,
      } } = this;
    let originX = __sx2 + paddingLeft;
    let originY = __sy2 + paddingTop;
    let cx = originX + width * 0.5;
    let cy = originY + height * 0.5;
    this.buildCache(cx, cy);
    let r = 0;
    if(isMulti) {
      let max = 0;
      __cacheProps.r.forEach(r => {
        max = Math.max(r, max);
      });
      r = max;
    }
    else {
      r = __cacheProps.r;
    }
    let bbox = super.bbox;
    let half = strokeWidth * 0.5;
    let [ox, oy] = this.__spreadByBoxShadowAndFilter(boxShadow, filter);
    ox += half;
    oy += half;
    let xa = cx - r - ox;
    let xb = cx + r + ox;
    let ya = cy - r - oy;
    let yb = cy + r + oy;
    bbox[0] = Math.min(bbox[0], xa);
    bbox[1] = Math.min(bbox[1], ya);
    bbox[2] = Math.max(bbox[2], xb);
    bbox[3] = Math.max(bbox[3], yb);
    return bbox;
  }
}

export default Circle;
