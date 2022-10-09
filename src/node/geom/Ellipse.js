import Geom from './Geom';
import util from '../../util/util';
import enums from '../../util/enums';
import geom from '../../math/geom';
import mode from '../../refresh/mode';

const { STYLE_KEY: {
  STROKE_WIDTH,
} } = enums;
const { isNil } = util;

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

  buildCache(cx, cy, focus) {
    let { width, height, rx, ry, __cacheProps, isMulti } = this;
    let rebuild;
    if(isNil(__cacheProps.rx) || focus) {
      rebuild = true;
      if(isMulti) {
        __cacheProps.rx = rx.map(i => i * width * 0.5);
      }
      else {
        __cacheProps.rx = rx * width * 0.5;
      }
    }
    if(isNil(__cacheProps.ry) || focus) {
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

  render(renderMode, ctx, dx, dy) {
    let res = super.render(renderMode, ctx, dx, dy);
    if(res.break || renderMode === mode.WEBGL) {
      return res;
    }
    this.buildCache(res.cx, res.cy);
    this.__renderPolygon(renderMode, ctx, res);
    return res;
  }

  get rx() {
    return this.getProps('rx');
  }

  get ry() {
    return this.getProps('ry');
  }

  get bbox() {
    if(!this.__bbox) {
      let {
        isMulti, __cacheProps,
        __x3: originX, __y3: originY, width, height,
        computedStyle: {
          [STROKE_WIDTH]: strokeWidth,
        }
      } = this;
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
      let half = 0;
      strokeWidth.forEach(item => {
        half = Math.max(half, item);
      });
      half = Math.ceil(half * 0.5) + 1;
      let xa = cx - rx - half;
      let xb = cx + rx + half;
      let ya = cy - ry - half;
      let yb = cy + ry + half;
      bbox[0] = Math.min(bbox[0], xa);
      bbox[1] = Math.min(bbox[1], ya);
      bbox[2] = Math.max(bbox[2], xb);
      bbox[3] = Math.max(bbox[3], yb);
      this.__bbox = bbox;
    }
    return this.__bbox;
  }
}

export default Ellipse;
