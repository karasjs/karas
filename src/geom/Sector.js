import Geom from './Geom';
import mode from '../node/mode';
import painter from '../util/painter';
import util from '../util/util';

let { isNil } = util;

function getCoordsByDegree(x, y, r, d) {
  r = Math.max(r, 0);
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

  buildCache(cx, cy) {
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
    r = __cacheProps.r;
    if(isNil(__cacheProps.edge)) {
      rebuild = true;
      __cacheProps.edge = edge;
    }
    if(isNil(__cacheProps.closure)) {
      rebuild = true;
      __cacheProps.closure = closure;
    }
    if(rebuild) {
      if(isMulti) {
        __cacheProps.x1 = [];
        __cacheProps.x2 = [];
        __cacheProps.y1 = [];
        __cacheProps.y2 = [];
        __cacheProps.large = [];
        __cacheProps.d = [];
        begin.forEach((begin, i) => {
          let r = isNil(r[i]) ? width * 0.5 : r[i];
          let [x1, y1] = getCoordsByDegree(cx, cy, r, begin);
          let [x2, y2] = getCoordsByDegree(cx, cy, r, end[i] || 0);
          let large = ((end[i] || 0) - begin) > 180 ? 1 : 0;
          __cacheProps.x1.push(x1);
          __cacheProps.x2.push(x2);
          __cacheProps.y1.push(y1);
          __cacheProps.y2.push(y2);
          __cacheProps.large.push(large);
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
    let { begin, end, r, x1, y1, x2, y2, edge, large, closure } = __cacheProps;
    if(renderMode === mode.CANVAS) {
      ctx.beginPath();
      if(isMulti) {
        begin.forEach((begin, i) => painter.canvasSector(ctx, cx, cy, r[i], x1[i], y1[i], x2[i], y2[i],
          strokeWidth, begin[i], end[i], large[i], edge[i], closure[i], dx, dy));
      }
      else {
        painter.canvasSector(ctx, cx, cy, r, x1, y1, x2, y2, strokeWidth, begin, end, large, edge, closure, dx, dy);
      }
      ctx.fill();
      ctx.closePath();
    }
    else if(renderMode === mode.SVG) {
      if(isMulti) {
        begin.forEach((begin, i) => {
          this.__genSector(edge[i],
            painter.svgSector(cx, cy, r[i], x1[i], y1[i], x2[i], y2[i], strokeWidth, large[i], edge[i], closure[i]),
            fill, stroke, strokeWidth, strokeDasharrayStr, strokeLinecap, strokeLinejoin, strokeMiterlimit
          );
        });
      }
      else {
        this.__genSector(edge,
          painter.svgSector(cx, cy, r, x1, y1, x2, y2, strokeWidth, large, edge, closure),
          fill, stroke, strokeWidth, strokeDasharrayStr, strokeLinecap, strokeLinejoin, strokeMiterlimit
        );
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
    let {
      isMulti, __cacheProps,
      sx, sy, width, height,
      currentStyle: {
        boxShadow,
        filter,
      },
      computedStyle: {
        borderTopWidth,
        borderLeftWidth,
        marginTop,
        marginLeft,
        paddingTop,
        paddingLeft,
        strokeWidth,
      } } = this;
    let originX = sx + borderLeftWidth + marginLeft + paddingLeft;
    let originY = sy + borderTopWidth + marginTop + paddingTop;
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

export default Sector;
