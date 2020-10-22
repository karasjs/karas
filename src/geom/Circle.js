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
    let { width, r, __cacheProps, isMulti } = this;
    if(isNil(__cacheProps.r)) {
      if(isMulti) {
        __cacheProps.r = r.map(i => i * width * 0.5);
        let list = __cacheProps.r.map(r => geom.ellipsePoints(cx, cy, r));
        if(renderMode === mode.CANVAS) {
          __cacheProps.list = list;
        }
        else if(renderMode === mode.SVG) {
          __cacheProps.d = '';
          list.forEach(item => __cacheProps.d += painter.svgPolygon(item));
        }
      }
      else {
        __cacheProps.r = r * width * 0.5;
        let list = geom.ellipsePoints(cx, cy, __cacheProps.r);
        if(renderMode === mode.CANVAS) {
          __cacheProps.list = list;
        }
        else if(renderMode === mode.SVG) {
          __cacheProps.d = painter.svgPolygon(list);
        }
      }
    }
    if(renderMode === mode.CANVAS) {
      let list = __cacheProps.list;
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
      let props = [
        ['d', __cacheProps.d],
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
    let { isMulti, __cacheProps: { r }, computedStyle: { strokeWidth } } = this;
    let bbox = super.bbox;
    let w = bbox[2] - bbox[0];
    let h = bbox[3] - bbox[1];
    if(isMulti) {
      let max = 0;
      r.forEach(r => {
        max = Math.max(r, max);
      });
      r = max;
    }
    let d = r + strokeWidth;
    let diff = d - Math.min(w, h);
    if(diff > 0) {
      let half = diff * 0.5;
      if(d > w) {
        bbox[0] -= half;
        bbox[2] += half;
      }
      if(d > h) {
        bbox[1] -= half;
        bbox[3] += half;
      }
    }
    return bbox;
  }
}

export default Circle;
