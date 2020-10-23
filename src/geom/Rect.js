import Geom from './Geom';
import mode from '../node/mode';
import painter from '../util/painter';
import geom from '../math/geom';
import util from "../util/util";

let { isNil } = util;

function genVertex(x, y, width, height, rx = 0, ry = 0) {
  if(rx === 0 || ry === 0) {
    return [
      [x, y],
      [x + width, y],
      [x + width, y + height],
      [x, y + height],
      [x, y],
    ];
  }
  let ox = rx * geom.H;
  let oy = ry * geom.H;
  return [
    [x + rx, y],
    [x + width - rx, y],
    [x + width + ox - rx, y, x + width, y + ry - oy, x + width, y + ry],
    [x + width, y + height - ry],
    [x + width, y + height + oy - ry, x + width + ox - rx, y + height, x + width - rx, y + height],
    [x + rx, y + height],
    [x + rx - ox, y + height, x, y + height + oy - ry, x, y + height - ry],
    [x, y + ry],
    [x, y + ry - oy, x + rx - ox, y, x + rx, y]
  ];
}


function getR(v) {
  v = parseFloat(v);
  if(isNaN(v)) {
    v = 0;
  }
  return v;
}

class Rect extends Geom {
  constructor(tagName, props) {
    super(tagName, props);
    // 圆角
    if(this.isMulti) {
      this.__rx = [0];
      this.__ry = [0];
      if(Array.isArray(props.rx)) {
        this.__rx = props.rx.map(i => getR(i));
      }
      if(Array.isArray(props.ry)) {
        this.__ry = props.ry.map(i => getR(i));
      }
    }
    else {
      this.__rx = this.__ry = 0;
      if(!isNil(props.rx)) {
        this.__rx = getR(props.rx);
      }
      if(!isNil(props.ry)) {
        this.__ry = getR(props.ry);
      }
    }
  }

  buildCache(originX, originY) {
    let { width, height, rx, ry, __cacheProps, isMulti } = this;
    let rebuild;
    if(isNil(__cacheProps.rx)) {
      rebuild = true;
      if(isMulti) {
        __cacheProps.rx = rx.map(rx => Math.min(rx, 0.5) * width);
      }
      else {
        __cacheProps.rx = Math.min(rx, 0.5) * width;
      }
    }
    if(isNil(__cacheProps.ry)) {
      rebuild = true;
      if(isMulti) {
        __cacheProps.ry = rx.map(ry => Math.min(ry, 0.5) * height);
      }
      else {
        __cacheProps.ry = Math.min(ry, 0.5) * height;
      }
    }
    if(rebuild) {
      if(isMulti) {
        __cacheProps.list = rx.map((rx, i) => genVertex(originX, originY, width, height, rx, ry[i]));
      }
      else {
        __cacheProps.list = genVertex(originX, originY, width, height, rx, ry);
      }
    }
    __cacheProps.originX = originX;
    __cacheProps.originY = originY;
    return rebuild;
  }

  render(renderMode, lv, ctx, defs) {
    let res = super.render(renderMode, lv, ctx, defs);
    if(res.break) {
      return res;
    }
    let {
      originX,
      originY,
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
    this.buildCache(originX, originY);
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
    let { sx, sy, width, height,
      computedStyle: {
        borderTopWidth,
        borderLeftWidth,
        marginTop,
        marginLeft,
        paddingTop,
        paddingLeft,
        boxShadow,
        filter,
        strokeWidth,
      } } = this;
    let originX = sx + borderLeftWidth + marginLeft + paddingLeft;
    let originY = sy + borderTopWidth + marginTop + paddingTop;
    this.buildCache(originX, originY);
    let bbox = super.bbox;
    let half = strokeWidth * 0.5;
    let [ox, oy] = this.__spreadByBoxShadowAndFilter(boxShadow, filter);
    ox += half;
    oy += half;
    bbox[0] = Math.min(bbox[0], originX - ox);
    bbox[1] = Math.min(bbox[1], originY - oy);
    bbox[2] = Math.min(bbox[2], originX + width + ox);
    bbox[3] = Math.min(bbox[3], originY + height + oy);
    return bbox;
  }
}

export default Rect;
