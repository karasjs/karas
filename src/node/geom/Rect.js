import Geom from './Geom';
import util from "../../util/util";
import enums from '../../util/enums';
import geom from '../../math/geom';
import unit from '../../style/unit';

const { STYLE_KEY: {
  STROKE_WIDTH,
  BOX_SHADOW,
  FONT_SIZE,
  FILTER,
} } = enums;
const { isNil } = util;
const { REM, VW, VH, VMAX, VMIN } = unit;

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

  buildCache(originX, originY, focus) {
    let { width, height, rx, ry, __cacheProps, isMulti } = this;
    let rebuild;
    if(isNil(__cacheProps.rx) || focus) {
      rebuild = true;
      if(isMulti) {
        __cacheProps.rx = rx.map(rx => Math.min(rx, 0.5) * width);
      }
      else {
        __cacheProps.rx = Math.min(rx, 0.5) * width;
      }
    }
    if(isNil(__cacheProps.ry) || focus) {
      rebuild = true;
      if(isMulti) {
        __cacheProps.ry = rx.map(ry => Math.min(ry, 0.5) * height);
      }
      else {
        __cacheProps.ry = Math.min(ry, 0.5) * height;
      }
    }
    if(rebuild) {
      let { rx, ry } = __cacheProps;
      if(isMulti) {
        __cacheProps.list = rx.map((rx, i) => genVertex(originX, originY, width, height, rx, ry[i]));
      }
      else {
        __cacheProps.list = genVertex(originX, originY, width, height, rx, ry);
      }
    }
    return rebuild;
  }

  render(renderMode, lv, ctx, cache, dx, dy) {
    let res = super.render(renderMode, lv, ctx, cache, dx, dy);
    if(res.break) {
      return res;
    }
    this.buildCache(res.sx3, res.sy3);
    ctx = res.ctx;
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
        root,
        __sx3: originX, __sy3: originY, width, height,
        currentStyle: {
          [STROKE_WIDTH]: strokeWidth,
          [BOX_SHADOW]: boxShadow,
          [FILTER]: filter,
        }
      } = this;
      this.buildCache(originX, originY);
      let bbox = super.bbox;
      let half = 0;
      strokeWidth.forEach(item => {
        if(item[1] === REM) {
          half = Math.max(item[0] * root.computedStyle[FONT_SIZE], half);
        }
        else if(item[1] === VW) {
          half = Math.max(item[0] * root.width * 0.01, half);
        }
        else if(item[1] === VH) {
          half = Math.max(item[0] * root.height * 0.01, half);
        }
        else if(item[1] === VMAX) {
          half = Math.max(item[0] * Math.max(root.width, root.height) * 0.01, half);
        }
        else if(item[1] === VMIN) {
          half = Math.max(item[0] * Math.max(root.width, root.height) * 0.01, half);
        }
        else {
          half = Math.max(item[0], half);
        }
      });
      let [x1, y1, x2, y2] = this.__spreadBbox(boxShadow, filter);
      x1 -= half;
      y1 -= half;
      x2 += half;
      y2 += half;
      bbox[0] = Math.min(bbox[0], originX + x1);
      bbox[1] = Math.min(bbox[1], originY + y1);
      bbox[2] = Math.max(bbox[2], originX + width + x2);
      bbox[3] = Math.max(bbox[3], originY + height + y2);
      this.__bbox = bbox;
    }
    return this.__bbox;
  }
}

export default Rect;
