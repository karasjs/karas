import Geom from './Geom';
import util from '../../util/util';
import enums from '../../util/enums';
import geom from '../../math/geom';
import inject from '../../util/inject';
import level from '../../refresh/level';

const { STYLE_KEY: {
  STROKE_WIDTH,
  BOX_SHADOW,
} } = enums;
const { isNil } = util;
const { sectorPoints } = geom;

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

  buildCache(cx, cy, focus) {
    let { width, begin, end, r, edge, closure, __cacheProps, isMulti } = this;
    let rebuild;
    if(isNil(__cacheProps.begin) || focus) {
      rebuild = true;
      __cacheProps.begin = (begin || 0) % 360;
    }
    if(isNil(__cacheProps.end) || focus) {
      rebuild = true;
      __cacheProps.end = (end || 0) % 360;
    }
    if(isNil(__cacheProps.r) || focus) {
      rebuild = true;
      if(isMulti) {
        __cacheProps.r = r.map(r => r * width * 0.5);
      }
      else {
        __cacheProps.r = r * width * 0.5;
      }
    }
    r = __cacheProps.r;
    if(isNil(__cacheProps.edge) || focus) {
      rebuild = true;
      __cacheProps.edge = edge;
    }
    if(isNil(__cacheProps.closure) || focus) {
      rebuild = true;
      __cacheProps.closure = closure;
    }
    if(rebuild) {
      if(isMulti) {
        __cacheProps.list = [];
        __cacheProps.sList = [];
        begin.forEach((begin, i) => {
          let r2 = isNil(r[i]) ? width * 0.5 : r[i];
          let list = sectorPoints(cx, cy, r2, parseFloat(begin || 0) % 360, parseFloat(end[i] || 0) % 360);
          let sList = list.slice(0);
          if(closure[i]) {
            list.push(list[0].slice(0));
            if(edge) {
              sList.push(sList[0].slice(0));
            }
          }
          else {
            list.unshift([cx, cy]);
            list.push([cx, cy]);
            if(edge) {
              sList.unshift([cx, cy]);
              sList.push([cx, cy]);
            }
          }
          __cacheProps.list.push(list);
          __cacheProps.sList.push(sList);
        });
      }
      else {
        let list = sectorPoints(cx, cy, r, parseFloat(begin || 0), parseFloat(end || 0));
        let sList = list.slice(0);
        if(closure) {
          list.push(list[0].slice(0));
          if(edge) {
            sList.push(sList[0].slice(0));
          }
        }
        else {
          list.unshift([cx, cy]);
          list.push([cx, cy]);
          if(edge) {
            sList.unshift([cx, cy]);
            sList.push([cx, cy]);
          }
        }
        __cacheProps.list = list;
        __cacheProps.sList = sList;
      }
    }
    return rebuild;
  }

  render(renderMode, lv, ctx, cache) {
    let res = super.render(renderMode, lv, ctx, cache);
    if(res.break) {
      return res;
    }
    this.buildCache(res.cx, res.cy);
    ctx = res.ctx;
    let {
      fill: fills,
      fillRule: fillRules,
      stroke: strokes,
      strokeWidth: strokeWidths,
      strokeDasharray: strokeDasharrays,
      strokeDasharrayStr: strokeDasharrayStrs,
      strokeLinecap: strokeLinecaps,
      strokeLinejoin: strokeLinejoins,
      strokeMiterlimit: strokeMiterlimits,
      dx,
      dy,
    } = res;
    let { __cacheProps: { list, sList }, isMulti } = this;
    // 普通情况下只有1个，按普通情况走
    if(fills.length <= 1 && strokes.length <= 1) {
      let o = {
        fill: fills[0],
        fillRule: fillRules[0],
        stroke: strokes[0],
        strokeWidth: strokeWidths[0],
        strokeDasharray: strokeDasharrays[0],
        strokeDasharrayStr: strokeDasharrayStrs[0],
        strokeLinecap: strokeLinecaps[0],
        strokeLinejoin: strokeLinejoins[0],
        strokeMiterlimit: strokeMiterlimits[0],
        dx,
        dy,
      };
      this.__renderOneSector(renderMode, ctx, isMulti, list, sList, o);
    }
    // 多个需要fill在下面，stroke在上面，依次循环
    else {
      for(let i = 0, len = fills.length; i < len; i++) {
        let fill = fills[i];
        if(fill) {
          let o = {
            fill,
            fillRule: fillRules[i],
            dx,
            dy,
          };
          this.__renderOneSector(renderMode, ctx, isMulti, list, sList, o);
        }
      }
      for(let i = 0, len = strokes.length; i < len; i++) {
        let stroke = strokes[i];
        if(stroke) {
          let o = {
            stroke,
            strokeWidth: strokeWidths[i],
            strokeDasharray: strokeDasharrays[i],
            strokeDasharrayStr: strokeDasharrayStrs[i],
            strokeLinecap: strokeLinecaps[i],
            strokeLinejoin: strokeLinejoins[i],
            strokeMiterlimit: strokeMiterlimits[i],
            dx,
            dy,
          };
          this.__renderOnePolygon(renderMode, ctx, isMulti, list, sList, o);
        }
      }
    }
    return res;
  }

  __renderOneSector(renderMode, ctx, isMulti, list, sList, res) {
    let {
      fill,
      stroke,
      strokeWidth,
    } = res;
    let isFillCE = fill.k === 'conic';
    let isStrokeCE = stroke.k === 'conic';
    let isFillRE = fill.k === 'radial' && Array.isArray(fill.v);
    let isStrokeRE = strokeWidth > 0 && stroke.k === 'radial' && Array.isArray(stroke.v);
    if(isFillCE || isStrokeCE) {
      if(isFillCE) {
        this.__conicGradient(renderMode, ctx, list, isMulti, res);
      }
      else if(fill && fill !== 'none') {
        this.__drawPolygon(renderMode, ctx, isMulti, list, res, true);
      }
      if(strokeWidth > 0 && isStrokeCE) {
        inject.warn('Stroke style can not use conic-gradient');
      }
      else if(strokeWidth > 0 && stroke && stroke !== 'none') {
        this.__drawPolygon(renderMode, ctx, isMulti, sList, res, false, true);
      }
    }
    else if(isFillRE || isStrokeRE) {
      if(isFillRE) {
        this.__radialEllipse(renderMode, ctx, list, isMulti, res, 'fill');
      }
      else if(fill && fill !== 'none') {
        this.__drawPolygon(renderMode, ctx, isMulti, list, res, true);
      }
      // stroke椭圆渐变matrix会变形，降级为圆
      if(strokeWidth > 0 && isStrokeRE) {
        inject.warn('Stroke style can not use radial-gradient for ellipse');
        res.stroke = res.stroke.v[0];
        this.__drawPolygon(renderMode, ctx, isMulti, sList, res, false, true);
      }
      else if(strokeWidth > 0 && stroke && stroke !== 'none') {
        this.__drawPolygon(renderMode, ctx, isMulti, sList, res, false, true);
      }
    }
    else {
      if(fill && fill !== 'none') {
        this.__drawPolygon(renderMode, ctx, isMulti, list, res, true, false);
      }
      if(stroke && stroke !== 'none') {
        this.__drawPolygon(renderMode, ctx, isMulti, sList, res, false, true);
      }
    }
  }

  __genSector(edge, d, fill, stroke, strokeWidth, strokeDasharrayStr, strokeLinecap, strokeLinejoin, strokeMiterlimit) {
    if(edge) {
      let props = [
        ['d', d[0]],
        ['fill', fill.v || fill],
        ['stroke', stroke.v || stroke],
        ['stroke-width', strokeWidth],
      ];
      this.__propsStrokeStyle(props, strokeDasharrayStr, strokeLinecap, strokeLinejoin, strokeMiterlimit);
      this.addGeom('path', props);
    }
    else {
      this.addGeom('path', [
        ['d', d[0]],
        ['fill', fill.v || fill],
      ]);
      if(strokeWidth > 0) {
        let props = [
          ['d', d[1]],
          ['fill', 'none'],
          ['stroke', stroke.v || stroke],
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

export default Sector;
