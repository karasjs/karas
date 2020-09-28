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

  render(renderMode, lv, ctx, defs) {
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
      strokeDasharrayStr,
      strokeLinecap,
      strokeLinejoin,
      strokeMiterlimit,
    } = super.render(renderMode, lv, ctx, defs);
    if(isDestroyed || display === 'none' || visibility === 'hidden' || cache) {
      return;
    }
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
    // rx/ry有一个变了重新计算顶点
    if(rebuild) {
      let { rx, ry } = __cacheProps;
      if(isMulti) {
        let list = rx.map((rx, i) => geom.ellipsePoints(cx, cy, rx, ry[i]));
        if(renderMode === mode.CANVAS) {
          __cacheProps.list = list;
        }
        else if(renderMode === mode.SVG) {
          __cacheProps.d = '';
          list.forEach(item => __cacheProps.d += painter.svgPolygon(item));
        }
      }
      else {
        let list = geom.ellipsePoints(cx, cy, rx, ry);
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

export default Ellipse;
