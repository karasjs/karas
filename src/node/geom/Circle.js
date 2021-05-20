import Geom from './Geom';
import util from '../../util/util';
import enums from '../../util/enums';
import geom from '../../math/geom';

const { STYLE_KEY: {
  STROKE_WIDTH,
  BOX_SHADOW,
} } = enums;
const { isNil } = util;

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

  buildCache(cx, cy, focus) {
    let { width, r, __cacheProps, isMulti } = this;
    if(isNil(__cacheProps.r) || focus) {
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

  render(renderMode, lv, ctx, cache) {
    let res = super.render(renderMode, lv, ctx, cache);
    if(res.break) {
      return res;
    }
    this.buildCache(res.cx, res.cy);
    ctx = res.ctx;
    this.__renderPolygon(renderMode, ctx, res);
    return res;
  }

  get r() {
    return this.getProps('r');
  }

  get bbox() {
    if(!this.__bbox) {
      let {
        isMulti, __cacheProps,
        __sx3: originX, __sy3: originY, width, height,
        currentStyle: {
          [STROKE_WIDTH]: strokeWidth,
          [BOX_SHADOW]: boxShadow,
        }
      } = this;
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
      let half = 0;
      strokeWidth.forEach(item => {
        half = Math.max(item[0], half);
      });
      let [ox, oy] = this.__spreadBbox(boxShadow);
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
      this.__bbox = bbox;
    }
    return this.__bbox;
  }
}

export default Circle;
