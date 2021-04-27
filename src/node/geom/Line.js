import Geom from './Geom';
import mode from '../mode';
import painter from '../../util/painter';
import util from '../../util/util';
import enums from '../../util/enums';
import geom from '../../math/geom';

const { STYLE_KEY: {
  STROKE_WIDTH,
  BOX_SHADOW,
  FILTER,
} } = enums;
const { isNil } = util;

function reBuild(target, origin, base, isMulti) {
  if(isMulti) {
    return target.map(item => origin + item * base);
  }
  else {
    return origin + target * base;
  }
}

function reBuildC(target, originX, originY, width, height, isMulti) {
  if(isMulti) {
    if(target) {
      return target.map(item => reBuildC(item, originX, originY, width, height));
    }
  }
  else {
    if(target && target.length >= 2) {
      return [
        originX + target[0] * width,
        originY + target[1] * height,
      ];
    }
  }
  return [];
}

function curveNum(controlA, controlB) {
  let num = 0;
  if(controlA.length >= 2) {
    num++;
  }
  if(controlB.length >= 2) {
    num += 2;
  }
  return num;
}

function limitStartEnd(v) {
  if(v < 0) {
    v = 0;
  }
  else if(v > 1) {
    v = 1;
  }
  return v;
}

function getNewPoint(x1, y1, x2, y2, controlA, controlB, num, start = 0, end = 1) {
  if(start > 0 || end < 1) {
    if(num === 3) {
      [[x1, y1], controlA, controlB, [x2, y2]] = geom.sliceBezier2Both([[x1, y1], controlA, controlB, [x2, y2]], start, end);
    }
    else if(num === 2) {
      [[x1, y1], controlB, [x2, y2]] = geom.sliceBezier2Both([[x1, y1], controlB, [x2, y2]], start, end);
    }
    else if(num === 1) {
      [[x1, y1], controlA, [x2, y2]] = geom.sliceBezier2Both([[x1, y1], controlA, [x2, y2]], start, end);
    }
    else {
      let a = Math.abs(x1 - x2);
      let b = Math.abs(y1 - y2);
      x1 += a * start;
      y1 += b * start;
      x2 -= a * (1 - end);
      y2 -= b * (1 - end);
    }
  }
  return [x1, y1, x2, y2, controlA, controlB];
}

class Line extends Geom {
  constructor(tagName, props) {
    super(tagName, props);
    // x1,y1和x2,y2表明线段的首尾坐标，control表明控制点坐标
    if(this.isMulti) {
      this.__x1 = [0];
      this.__y1 = [0];
      this.__x2 = [1];
      this.__y2 = [1];
      this.__controlA = [[]];
      this.__controlB = [[]];
      this.__start = [0];
      this.__end = [1];
      if(Array.isArray(props.x1)) {
        this.__x1 = props.x1.map(i => parseFloat(i) || 0);
      }
      else if(!isNil(props.x1)) {
        this.__x1 = [parseFloat(props.x1) || 0];
      }
      if(Array.isArray(props.y1)) {
        this.__y1 = props.y1.map(i => parseFloat(i) || 0);
      }
      else if(!isNil(props.y1)) {
        this.__y1 = [parseFloat(props.y1) || 0];
      }
      if(Array.isArray(props.x2)) {
        this.__x2 = props.x2.map(i => parseFloat(i) || 0);
      }
      else if(!isNil(props.x2)) {
        this.__x2 = [parseFloat(props.x2) || 0];
      }
      if(Array.isArray(props.y2)) {
        this.__y2 = props.y2.map(i => parseFloat(i) || 0);
      }
      else if(!isNil(props.y2)) {
        this.__y2 = [parseFloat(props.y2) || 0];
      }
      if(Array.isArray(props.controlA)) {
        this.__controlA = props.controlA.map(item => {
          if(Array.isArray(item)) {
            return item;
          }
          return [];
        });
      }
      if(Array.isArray(props.controlB)) {
        this.__controlB = props.controlB.map(item => {
          if(Array.isArray(item)) {
            return item;
          }
          return [];
        });
      }
      if(Array.isArray(props.start)) {
        this.__start = props.start.map(i => limitStartEnd(parseFloat(i) || 0));
        for(let i = this.__start.length; i  < this.__x1.length; i++) {
          this.__start.push(0);
        }
      }
      else if(!isNil(props.start)) {
        let v = limitStartEnd(parseFloat(props.start) || 0);
        this.__start = this.__x1.map(() => v);
      }
      if(Array.isArray(props.end)) {
        this.__end = props.end.map(i => {
          let v = parseFloat(i);
          if(isNaN(v)) {
            v = 1;
          }
          return limitStartEnd(v);
        });
        for(let i = this.__end.length; i  < this.__x1.length; i++) {
          this.__end.push(1);
        }
      }
      else if(!isNil(props.end)) {
        let v = parseFloat(props.end);
        if(isNaN(v)) {
          v = 1;
        }
        v = limitStartEnd(v);
        this.__end = this.__x1.map(() => v);
      }
    }
    else {
      this.__x1 = this.__y1 = this.__start = 0;
      this.__x2 = this.__y2 = this.__end = 1;
      this.__controlA = [];
      this.__controlB = [];
      if(!isNil(props.x1)) {
        this.__x1 = parseFloat(props.x1) || 0;
      }
      if(!isNil(props.y1)) {
        this.__y1 = parseFloat(props.y1) || 0;
      }
      if(!isNil(props.x2)) {
        this.__x2 = parseFloat(props.x2) || 0;
      }
      if(!isNil(props.y2)) {
        this.__y2 = parseFloat(props.y2) || 0;
      }
      if(!isNil(props.start)) {
        this.__start = limitStartEnd(parseFloat(props.start) || 0);
      }
      if(!isNil(props.end)) {
        let v = parseFloat(props.end);
        if(isNaN(v)) {
          v = 1;
        }
        this.__end = limitStartEnd(v);
      }
      if(Array.isArray(props.controlA)) {
        this.__controlA = props.controlA;
      }
      if(Array.isArray(props.controlB)) {
        this.__controlB = props.controlB;
      }
    }
  }

  buildCache(originX, originY) {
    let { width, height, __cacheProps, isMulti } = this;
    let rebuild;
    ['x1', 'x2'].forEach(k => {
      if(isNil(__cacheProps[k])) {
        rebuild = true;
        __cacheProps[k] = reBuild(this[k], originX, width, isMulti);
      }
    });
    ['y1', 'y2'].forEach(k => {
      if(isNil(__cacheProps[k])) {
        rebuild = true;
        __cacheProps[k] = reBuild(this[k], originY, height, isMulti);
      }
    });
    ['controlA', 'controlB'].forEach(k => {
      if(isNil(__cacheProps[k])) {
        rebuild = true;
        __cacheProps[k] = reBuildC(this[k], originX, originY, width, height, isMulti);
      }
    });
    ['start', 'end'].forEach(k => {
      if(isNil(__cacheProps[k])) {
        rebuild = true;
        __cacheProps[k] = this[k];
      }
    });
    return rebuild;
  }

  render(renderMode, lv, ctx) {
    let res = super.render(renderMode, lv, ctx);
    if(res.break) {
      return res;
    }
    let {
      originX,
      originY,
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
    let { __cacheProps, isMulti } = this;
    let rebuild = this.buildCache(originX, originY);
    if(rebuild && renderMode === mode.SVG) {
      let d = '';
      if(isMulti) {
        __cacheProps.x1.forEach((xa, i) => {
          let xb = __cacheProps.x2[i];
          let ya = __cacheProps.y1[i];
          let yb = __cacheProps.y2[i];
          let ca = __cacheProps.controlA[i];
          let cb = __cacheProps.controlB[i];
          let start = __cacheProps.start[i];
          let end = __cacheProps.end[i];
          let curve = curveNum(ca, cb);
          if(start !== 0 || end !== 1) {
            [xa, ya, xb, ya, ca, cb] = getNewPoint(xa, ya, xb, ya, ca, cb, curve, start, end, __cacheProps.len);
          }
          d += painter.svgLine(xa, ya, xb, yb, ca, cb, curve);
        });
      }
      else {
        let curve = curveNum(__cacheProps.controlA, __cacheProps.controlB);
        let { x1, y1, x2, y2, controlA, controlB, start, end } = __cacheProps;
        if(start !== 0 || end !== 1) {
          [x1, y1, x2, y2, controlA, controlB] = getNewPoint(x1, y1, x2, y2, controlA, controlB, curve, start, end, __cacheProps.len);
        }
        d = painter.svgLine(x1, y1, x2, y2, controlA, controlB, curve);
      }
      __cacheProps.d = d;
    }
    if(renderMode === mode.CANVAS) {
      strokes.forEach((stroke, i) => {
        let strokeWidth = strokeWidths[i];
        let isStrokeRE = strokeWidth > 0 && stroke.k === 'radial' && Array.isArray(stroke.v);
        if(strokeWidth > 0 && stroke !== 'none') {
          this.__preSetCanvas(renderMode, ctx, {
            stroke,
            strokeWidth,
            strokeDasharray: strokeDasharrays[i],
            strokeLinecap: strokeLinecaps[i],
            strokeLinejoin: strokeLinejoins[i],
            strokeMiterlimit: strokeMiterlimits[i],
          });
          if(isStrokeRE) {
            ctx.strokeStyle = stroke.v[0];
          }
          ctx.beginPath();
          if(isMulti) {
            __cacheProps.x1.forEach((xa, i) => {
              let xb = __cacheProps.x2[i];
              let ya = __cacheProps.y1[i];
              let yb = __cacheProps.y2[i];
              let ca = __cacheProps.controlA[i];
              let cb = __cacheProps.controlB[i];
              let start = __cacheProps.start[i];
              let end = __cacheProps.end[i];
              let curve = curveNum(ca, cb);
              if(start !== 0 || end !== 1) {
                [xa, ya, xb, ya, ca, cb] = getNewPoint(xa, ya, xb, ya, ca, cb, curve, start, end, __cacheProps.len);
              }
              painter.canvasLine(ctx, xa, ya, xb, yb, ca, cb, curve, dx, dy);
            });
          }
          else {
            let curve = curveNum(__cacheProps.controlA, __cacheProps.controlB);
            let { x1, y1, x2, y2, controlA, controlB, start, end } = __cacheProps;
            if(start !== 0 || end !== 1) {
              [x1, y1, x2, y2, controlA, controlB] = getNewPoint(x1, y1, x2, y2, controlA, controlB, curve, start, end, __cacheProps.len);
            }
            painter.canvasLine(ctx, x1, y1, x2, y2, controlA, controlB, curve, dx, dy);
          }
          ctx.stroke();
          ctx.closePath();
        }
      });
    }
    else if(renderMode === mode.SVG) {
      strokes.forEach((stroke, i) => {
        let strokeWidth = strokeWidths[i];
        let isStrokeRE = strokeWidth > 0 && stroke.k === 'radial' && Array.isArray(stroke.v);
        let props = [
          ['d', __cacheProps.d],
          ['fill', 'none'],
          ['stroke', isStrokeRE ? stroke.v[0] : (stroke.v || stroke)],
          ['stroke-width', strokeWidth]
        ];
        this.__propsStrokeStyle(props, strokeDasharrayStrs[i], strokeLinecaps[i], strokeLinejoins[i], strokeMiterlimits[i]);
        this.addGeom('path', props);
      });
    }
    return res;
  }

  get x1() {
    return this.getProps('x1');
  }

  get y1() {
    return this.getProps('y1');
  }

  get x2() {
    return this.getProps('x2');
  }

  get y2() {
    return this.getProps('y2');
  }

  get controlA() {
    return this.getProps('controlA');
  }

  get controlB() {
    return this.getProps('controlB');
  }

  get start() {
    return this.getProps('start');
  }

  get end() {
    return this.getProps('end');
  }

  get bbox() {
    let {
      __sx3: originX, __sy3: originY,
      currentStyle: {
        [STROKE_WIDTH]: strokeWidth,
        [BOX_SHADOW]: boxShadow,
      },
      isMulti, __cacheProps,
    } = this;
    this.buildCache(originX, originY);
    let { x1, y1, x2, y2, controlA, controlB } = __cacheProps;
    let bbox = super.bbox;
    let half = 0;
    strokeWidth.forEach(item => {
      half = Math.max(item[0], half);
    });
    let [ox, oy] = this.__spreadBbox(boxShadow);
    ox += half;
    oy += half;
    if(!isMulti) {
      x1 = [x1];
      x2 = [x2];
      y1 = [y1];
      y2 = [y2];
      controlA = [controlA];
      controlB = [controlB];
    }
    x1.forEach((xa, i) => {
      let ya = y1[i];
      let xb = x2[i];
      let yb = y2[i];
      let ca = controlA[i];
      let cb = controlB[i];
      if((isNil(ca) || ca.length < 2) && (isNil(cb) || cb.length < 2)) {
        bbox[0] = Math.min(bbox[0], xa - ox);
        bbox[0] = Math.min(bbox[0], xb - ox);
        bbox[1] = Math.min(bbox[1], ya - oy);
        bbox[1] = Math.min(bbox[1], yb - oy);
        bbox[2] = Math.max(bbox[2], xa + ox);
        bbox[2] = Math.max(bbox[2], xb + ox);
        bbox[3] = Math.max(bbox[3], ya + oy);
        bbox[3] = Math.max(bbox[3], yb + oy);
      }
      else if(isNil(ca) || ca.length < 2) {
        let bezierBox = geom.bboxBezier(xa, ya, cb[0], cb[1], xb, yb);
        bbox[0] = Math.min(bbox[0], bezierBox[0] - ox);
        bbox[0] = Math.min(bbox[0], bezierBox[2] - ox);
        bbox[1] = Math.min(bbox[1], bezierBox[1] - oy);
        bbox[1] = Math.min(bbox[1], bezierBox[3] - oy);
        bbox[2] = Math.max(bbox[2], bezierBox[0] + ox);
        bbox[2] = Math.max(bbox[2], bezierBox[2] + ox);
        bbox[3] = Math.max(bbox[3], bezierBox[1] + oy);
        bbox[3] = Math.max(bbox[3], bezierBox[3] + oy);
      }
      else if(isNil(cb) || cb.length < 2) {
        let bezierBox = geom.bboxBezier(xa, ya, ca[0], ca[1], xb, yb);
        bbox[0] = Math.min(bbox[0], bezierBox[0] - ox);
        bbox[0] = Math.min(bbox[0], bezierBox[2] - ox);
        bbox[1] = Math.min(bbox[1], bezierBox[1] - oy);
        bbox[1] = Math.min(bbox[1], bezierBox[3] - oy);
        bbox[2] = Math.max(bbox[2], bezierBox[0] + ox);
        bbox[2] = Math.max(bbox[2], bezierBox[2] + ox);
        bbox[3] = Math.max(bbox[3], bezierBox[1] + oy);
        bbox[3] = Math.max(bbox[3], bezierBox[3] + oy);
      }
      else {
        let bezierBox = geom.bboxBezier(xa, ya, ca[0], ca[1], cb[0], cb[1], xb, yb);
        bbox[0] = Math.min(bbox[0], bezierBox[0] - ox);
        bbox[0] = Math.min(bbox[0], bezierBox[2] - ox);
        bbox[1] = Math.min(bbox[1], bezierBox[1] - oy);
        bbox[1] = Math.min(bbox[1], bezierBox[3] - oy);
        bbox[2] = Math.max(bbox[2], bezierBox[0] + ox);
        bbox[2] = Math.max(bbox[2], bezierBox[2] + ox);
        bbox[3] = Math.max(bbox[3], bezierBox[1] + oy);
        bbox[3] = Math.max(bbox[3], bezierBox[3] + oy);
      }
    });
    return bbox;
  }
}

export default Line;
