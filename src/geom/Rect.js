import Geom from './Geom';
import mode from '../util/mode';
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

  render(renderMode, ctx, defs) {
    let {
      isDestroyed,
      cache,
      originX,
      originY,
      display,
      visibility,
      fill,
      stroke,
      strokeWidth,
      strokeDasharrayStr,
      strokeLinecap,
      strokeLinejoin,
      strokeMiterlimit,
    } = super.render(renderMode, ctx, defs);
    if(isDestroyed || display === 'none' || visibility === 'hidden' || cache) {
      return;
    }
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
    // rx/ry有变化需重建顶点
    if(rebuild) {
      let { rx, ry } = __cacheProps;
      if(isMulti) {
        let list = rx.map((rx, i) => genVertex(originX, originY, width, height, rx, ry[i]));
        if(renderMode === mode.CANVAS) {
          __cacheProps.list = list;
        }
        else if(renderMode === mode.SVG) {
          let d = '';
          list.forEach(item => d += painter.svgPolygon(item));
          __cacheProps.d = d;
        }
      }
      else {
        let list = genVertex(originX, originY, width, height, rx, ry);
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
        list.forEach(item => painter.canvasPolygon(ctx, item));
      }
      else {
        painter.canvasPolygon(ctx, list);
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
        ['stroke-width', strokeWidth]
      ];
      this.__propsStrokeStyle(props, strokeDasharrayStr, strokeLinecap, strokeLinejoin, strokeMiterlimit);
      this.addGeom('path', props);
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
