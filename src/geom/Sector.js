import Geom from './Geom';
import mode from '../node/mode';
import painter from '../util/painter';
import util from '../util/util';

let { isNil } = util;

function getCoordsByDegree(x, y, r, d) {
  d = d % 360;
  if(d >= 0 && d < 90) {
    return [
      x + Math.sin(d * Math.PI / 180) * r,
      y - Math.cos(d * Math.PI / 180) * r
    ];
  }
  else if(d >= 90 && d < 180) {
    return [
      x + Math.cos((d - 90) * Math.PI / 180) * r,
      y + Math.sin((d - 90) * Math.PI / 180) * r,
    ];
  }
  else if(d >= 180 && d < 270) {
    return [
      x - Math.cos((270 - d) * Math.PI / 180) * r,
      y + Math.sin((270 - d) * Math.PI / 180) * r,
    ];
  }
  else {
    return [
      x - Math.sin((360 - d) * Math.PI / 180) * r,
      y - Math.cos((360 - d) * Math.PI / 180) * r,
    ];
  }
}

function getR(v, dft) {
  v = parseFloat(v);
  if(isNaN(v)) {
    v = dft;
  }
  return v;
}

class Sector extends Geom {
  constructor(tagName, props) {
    super(tagName, props);
    // 角度
    if(this.isMulti) {
      this.__begin = [0];
      this.__end = [0];
      this.__r = [1];
      if(Array.isArray(props.begin)) {
        this.__begin = props.begin.map(i => getR(i, 0));
      }
      if(Array.isArray(props.end)) {
        this.__end = props.end.map(i => getR(i, 0));
      }
      if(Array.isArray(props.r)) {
        this.__r = props.r.map(i => getR(i, 1));
      }
      if(Array.isArray(props.edge)) {
        this.__edge = props.edge.map(i => !!i);
      }
      if(Array.isArray(props.closure)) {
        this.__closure = props.closure.map(i => !!i);
      }
    }
    else {
      this.__begin = this.__end = 0;
      // 半径[0, ∞)，默认1
      this.__r = 1;
      // 扇形两侧是否有边
      this.__edge = false;
      // 扇形大于180°时，是否闭合两端
      this.__closure = false;
      if(!isNil(props.begin)) {
        this.__begin = getR(props.begin, 0);
      }
      if(!isNil(props.end)) {
        this.__end = getR(props.end, 0);
      }
      if(!isNil(props.r)) {
        this.__r = getR(props.r, 1);
      }
      if(!isNil(props.edge)) {
        this.__edge = !!props.edge;
      }
      if(!isNil(props.closure)) {
        this.__closure = !!props.closure;
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
    } = res;
    let { width, begin, end, r, edge, closure, __cacheProps, isMulti } = this;
    let rebuild;
    if(isNil(__cacheProps.begin)) {
      rebuild = true;
      __cacheProps.begin = begin;
    }
    if(isNil(__cacheProps.end)) {
      rebuild = true;
      __cacheProps.end = end;
    }
    if(isNil(__cacheProps.r)) {
      rebuild = true;
      if(isMulti) {
        __cacheProps.r = r.map(r => r * width * 0.5);
      }
      else {
        __cacheProps.r = r * width * 0.5;
      }
    }
    if(isNil(__cacheProps.edge)) {
      rebuild = true;
      __cacheProps.edge = edge;
    }
    if(isNil(__cacheProps.closure)) {
      rebuild = true;
      __cacheProps.closure = closure;
    }
    // begin/end/r/edge/closure有变化就重建
    if(rebuild) {
      let { begin, end, r, closure } = __cacheProps;
      if(isMulti) {
        __cacheProps.x1 = [];
        __cacheProps.x2 = [];
        __cacheProps.y1 = [];
        __cacheProps.y2 = [];
        __cacheProps.large = [];
        __cacheProps.d = [];
        begin.forEach((begin, i) => {
          let r = isNil(r) ? width * 0.5 : r;
          let [x1, y1] = getCoordsByDegree(cx, cy, r, begin);
          let [x2, y2] = getCoordsByDegree(cx, cy, r, end[i] || 0);
          let large = ((end[i] || 0) - begin) > 180 ? 1 : 0;
          __cacheProps.x1.push(x1);
          __cacheProps.x2.push(x2);
          __cacheProps.y1.push(y1);
          __cacheProps.y2.push(y2);
          __cacheProps.large.push(large);
          if(renderMode === mode.SVG) {
            __cacheProps.d.push(painter.svgSector(cx, cy, r, x1, y1, x2, y2, strokeWidth, large, edge[i] || 0, closure[i]));
          }
        });
      }
      else {
        let [x1, y1] = getCoordsByDegree(cx, cy, r, begin);
        let [x2, y2] = getCoordsByDegree(cx, cy, r, end);
        let large = (end - begin) > 180 ? 1 : 0;
        __cacheProps.x1 = x1;
        __cacheProps.x2 = x2;
        __cacheProps.y1 = y1;
        __cacheProps.y2 = y2;
        __cacheProps.large = large;
        if(renderMode === mode.SVG) {
          __cacheProps.d = painter.svgSector(cx, cy, r, x1, y1, x2, y2, strokeWidth, large, edge, closure);
        }
      }
    }
    if(renderMode === mode.CANVAS) {
      let { begin, end, r, x1, y1, x2, y2, edge, large, closure } = __cacheProps;
      ctx.beginPath();
      if(isMulti) {
        begin.forEach((begin, i) => painter.canvasSector(ctx, cx, cy, r[i], x1[i], y1[i], x2[i], y2[i],
          strokeWidth, begin[i], end[i], large[i], edge[i], closure[i]));
      }
      else {
        painter.canvasSector(ctx, cx, cy, r, x1, y1, x2, y2, strokeWidth, begin, end, large, edge, closure);
      }
      ctx.fill();
      ctx.closePath();
    }
    else if(renderMode === mode.SVG) {
      if(isMulti) {
        __cacheProps.d.map((item, i) => this.__genSector(__cacheProps.edge[i], item, fill, stroke, strokeWidth,
          strokeDasharrayStr, strokeLinecap, strokeLinejoin, strokeMiterlimit));
      }
      else {
        this.__genSector(__cacheProps.edge, __cacheProps.d, fill, stroke, strokeWidth,
          strokeDasharrayStr, strokeLinecap, strokeLinejoin, strokeMiterlimit);
      }
    }
    return res;
  }

  __genSector(edge, d, fill, stroke, strokeWidth, strokeDasharrayStr, strokeLinecap, strokeLinejoin, strokeMiterlimit) {
    if(edge) {
      let props = [
        ['d', d[0]],
        ['fill', fill],
        ['stroke', stroke],
        ['stroke-width', strokeWidth],
      ];
      this.__propsStrokeStyle(props, strokeDasharrayStr, strokeLinecap, strokeLinejoin, strokeMiterlimit);
      this.addGeom('path', props);
    }
    else {
      this.addGeom('path', [
        ['d', d[0]],
        ['fill', fill],
      ]);
      if(strokeWidth > 0) {
        let props = [
          ['d', d[1]],
          ['fill', 'none'],
          ['stroke', stroke],
          ['stroke-width', strokeWidth],
        ];
        this.__propsStrokeStyle(props, strokeDasharrayStr, strokeLinecap, strokeLinejoin, strokeMiterlimit);
        this.addGeom('path', props);
      }
    }
  }

  get begin() {
    return this.getProps('begin');
  }

  get end() {
    return this.getProps('end');
  }

  get r() {
    return this.getProps('r');
  }

  get edge() {
    return this.getProps('edge');
  }

  // >180°时是否链接端点
  get closure() {
    return this.getProps('closure');
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

export default Sector;
