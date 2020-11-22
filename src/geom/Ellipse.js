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

class Ellipse extends Geom {
  constructor(tagName, props) {
    super(tagName, props);
    // 半径[0, ∞)，默认1
    if(this.isMulti) {
      this.__rx = [1];
      this.__ry = [1];
      if(Array.isArray(props.rx)) {
        this.__rx = props.rx.map(i => getR(i));
      }
      else if(!isNil(props.rx)) {
        this.__rx = [getR(props.rx)];
      }
      if(Array.isArray(props.ry)) {
        this.__ry = props.ry.map(i => getR(i));
      }
      else if(!isNil(props.ry)) {
        this.__ry = [getR(props.ry)];
      }
    }
    else {
      this.__rx = 1;
      if(!isNil(props.rx)) {
        this.__rx = getR(props.rx);
      }
      this.__ry = 1;
      if(!isNil(props.ry)) {
        this.__ry = getR(props.ry);
      }
    }
  }

  buildCache(cx, cy) {
    let { width, height, rx, ry, __cacheProps, isMulti } = this;
    let rebuild;
    if(isNil(__cacheProps.rx)) {
      rebuild = true;
      if(isMulti) {
        __cacheProps.rx = rx.map(i => i * width * 0.5);
      }
      else {
        __cacheProps.rx = rx * width * 0.5;
      }
    }
    if(isNil(__cacheProps.ry)) {
      rebuild = true;
      if(isMulti) {
        __cacheProps.ry = ry.map(i => i * height * 0.5);
      }
      else {
        __cacheProps.ry = ry * height * 0.5;
      }
    }
    if(rebuild) {
      let { rx, ry } = __cacheProps;
      if(isMulti) {
        __cacheProps.list = rx.map((rx, i) => geom.ellipsePoints(cx, cy, rx, ry[i]));
      }
      else {
        __cacheProps.list = geom.ellipsePoints(cx, cy, rx, ry);
      }
    }
    return rebuild;
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
        ['stroke-width', strokeWidth]
      ];
      this.__propsStrokeStyle(props, strokeDasharrayStr, strokeLinecap, strokeLinejoin, strokeMiterlimit);
      this.addGeom('path', props);
    }
    return res;
  }

  get rx() {
    return this.getProps('rx');
  }

  get ry() {
    return this.getProps('ry');
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
    let rx = 0, ry = 0;
    if(isMulti) {
      let mx = 0, my = 0;
      __cacheProps.rx.forEach((rx, i) => {
        mx = Math.max(rx, mx);
        my = Math.max(ry, __cacheProps.ry[i]);
      });
      rx = mx;
      ry = my;
    }
    else {
      rx = __cacheProps.rx;
      ry = __cacheProps.ry;
    }
    let bbox = super.bbox;
    let half = strokeWidth * 0.5;
    let [ox, oy] = this.__spreadByBoxShadowAndFilter(boxShadow, filter);
    ox += half;
    oy += half;
    let xa = cx - rx - ox;
    let xb = cx + rx + ox;
    let ya = cy - ry - oy;
    let yb = cy + ry + oy;
    bbox[0] = Math.min(bbox[0], xa);
    bbox[1] = Math.min(bbox[1], ya);
    bbox[2] = Math.max(bbox[2], xb);
    bbox[3] = Math.max(bbox[3], yb);
    return bbox;
  }
}

export default Ellipse;
