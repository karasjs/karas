import Geom from './Geom';
import mode from '../../refresh/mode';
import painter from '../../util/painter';
import util from '../../util/util';
import enums from '../../util/enums';
import bezier from '../../math/bezier';

const { STYLE_KEY: {
  STROKE_WIDTH,
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
  if(controlA && controlA.length >= 2) {
    num++;
  }
  if(controlB && controlB.length >= 2) {
    num += 2;
  }
  return num;
}

function getNewPoint(xa, ya, xb, yb, controlA, controlB, num, start = 0, end = 1) {
  if(start === 0 && end === 1) {
    return [xa, ya, xb, yb, controlA, controlB];
  }
  if(start === end) {
    return [];
  }
  if(start > end) {
    [start, end] = [end, start];
  }
  start = Math.max(0, start);
  end = Math.min(1, end);
  if(num === 3) {
    [[xa, ya], controlA, controlB, [xb, yb]] = bezier.sliceBezier2Both([[xa, ya], controlA, controlB, [xb, yb]], start, end);
  }
  else if(num === 2) {
    [[xa, ya], controlB, [xb, yb]] = bezier.sliceBezier2Both([[xa, ya], controlB, [xb, yb]], start, end);
  }
  else if(num === 1) {
    [[xa, ya], controlA, [xb, yb]] = bezier.sliceBezier2Both([[xa, ya], controlA, [xb, yb]], start, end);
  }
  else {
    let a = xb - xa;
    let b = yb - ya;
    xa += a * start;
    ya += b * start;
    xb += a * (1 - end);
    yb += b * (1 - end);
  }
  return [xa, ya, xb, yb, controlA, controlB];
}

class Line extends Geom {
  constructor(tagName, props) {
    super(tagName, props);
    // xa,ya和xb,yb表明线段的首尾坐标，control表明控制点坐标
    if(this.isMulti) {
      this.__xa = [0];
      this.__ya = [0];
      this.__xb = [1];
      this.__yb = [1];
      this.__controlA = [[]];
      this.__controlB = [[]];
      this.__start = [0];
      this.__end = [1];
      if(Array.isArray(props.xa)) {
        this.__xa = props.xa.map(i => parseFloat(i) || 0);
      }
      else if(!isNil(props.xa)) {
        this.__xa = [parseFloat(props.xa) || 0];
      }
      if(Array.isArray(props.ya)) {
        this.__ya = props.ya.map(i => parseFloat(i) || 0);
      }
      else if(!isNil(props.ya)) {
        this.__ya = [parseFloat(props.ya) || 0];
      }
      if(Array.isArray(props.xb)) {
        this.__xb = props.xb.map(i => parseFloat(i) || 0);
      }
      else if(!isNil(props.xb)) {
        this.__xb = [parseFloat(props.xb) || 0];
      }
      if(Array.isArray(props.yb)) {
        this.__yb = props.yb.map(i => parseFloat(i) || 0);
      }
      else if(!isNil(props.yb)) {
        this.__yb = [parseFloat(props.yb) || 0];
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
        this.__start = props.start.map(i => parseFloat(i) || 0);
        for(let i = this.__start.length; i  < this.__xa.length; i++) {
          this.__start.push(0);
        }
      }
      else if(!isNil(props.start)) {
        let v = parseFloat(props.start) || 0;
        this.__start = this.__xa.map(() => v);
      }
      if(Array.isArray(props.end)) {
        this.__end = props.end.map(i => {
          let v = parseFloat(i);
          if(isNaN(v)) {
            v = 1;
          }
          return v;
        });
        for(let i = this.__end.length; i  < this.__xa.length; i++) {
          this.__end.push(1);
        }
      }
      else if(!isNil(props.end)) {
        let v = parseFloat(props.end);
        if(isNaN(v)) {
          v = 1;
        }
        this.__end = this.__xa.map(() => v);
      }
    }
    else {
      this.__xa = this.__ya = this.__start = 0;
      this.__xb = this.__yb = this.__end = 1;
      this.__controlA = [];
      this.__controlB = [];
      if(!isNil(props.xa)) {
        this.__xa = parseFloat(props.xa) || 0;
      }
      if(!isNil(props.ya)) {
        this.__ya = parseFloat(props.ya) || 0;
      }
      if(!isNil(props.xb)) {
        this.__xb = parseFloat(props.xb) || 0;
      }
      if(!isNil(props.yb)) {
        this.__yb = parseFloat(props.yb) || 0;
      }
      if(!isNil(props.start)) {
        this.__start = parseFloat(props.start) || 0;
      }
      if(!isNil(props.end)) {
        let v = parseFloat(props.end);
        if(isNaN(v)) {
          v = 1;
        }
        this.__end = v;
      }
      if(Array.isArray(props.controlA)) {
        this.__controlA = props.controlA;
      }
      if(Array.isArray(props.controlB)) {
        this.__controlB = props.controlB;
      }
    }
  }

  __buildCache(originX, originY, focus) {
    let { width, height, __cacheProps, isMulti } = this;
    let rebuild;
    ['xa', 'xb'].forEach(k => {
      if(isNil(__cacheProps[k]) || focus) {
        rebuild = true;
        __cacheProps[k] = reBuild(this[k], originX, width, isMulti);
      }
    });
    ['ya', 'yb'].forEach(k => {
      if(isNil(__cacheProps[k]) || focus) {
        rebuild = true;
        __cacheProps[k] = reBuild(this[k], originY, height, isMulti);
      }
    });
    ['controlA', 'controlB'].forEach(k => {
      if(isNil(__cacheProps[k]) || focus) {
        rebuild = true;
        __cacheProps[k] = reBuildC(this[k], originX, originY, width, height, isMulti);
      }
    });
    ['start', 'end'].forEach(k => {
      if(isNil(__cacheProps[k]) || focus) {
        rebuild = true;
        __cacheProps[k] = this[k];
      }
    });
    return rebuild;
  }

  render(renderMode, ctx, dx2, dy2) {
    let res = super.render(renderMode, ctx, dx2, dy2);
    if(res.break || renderMode === mode.WEBGL) {
      return res;
    }
    let {
      x3,
      y3,
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
    let rebuild = this.__buildCache(x3, y3);
    if(rebuild && renderMode === mode.SVG) {
      let d = '';
      if(isMulti) {
        __cacheProps.xa.forEach((xa, i) => {
          let xb = __cacheProps.xb[i];
          let ya = __cacheProps.ya[i];
          let yb = __cacheProps.yb[i];
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
        let { xa, ya, xb, yb, controlA, controlB, start, end } = __cacheProps;
        if(start !== 0 || end !== 1) {
          [xa, ya, xb, yb, controlA, controlB] = getNewPoint(xa, ya, xb, yb, controlA, controlB, curve, start, end, __cacheProps.len);
        }
        d = painter.svgLine(xa, ya, xb, yb, controlA, controlB, curve);
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
            __cacheProps.xa.forEach((xa, i) => {
              let xb = __cacheProps.xb[i];
              let ya = __cacheProps.ya[i];
              let yb = __cacheProps.yb[i];
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
            let { xa, ya, xb, yb, controlA, controlB, start, end } = __cacheProps;
            if(start !== 0 || end !== 1) {
              [xa, ya, xb, yb, controlA, controlB] = getNewPoint(xa, ya, xb, yb, controlA, controlB, curve, start, end, __cacheProps.len);
            }
            painter.canvasLine(ctx, xa, ya, xb, yb, controlA, controlB, curve, dx, dy);
          }
          ctx.stroke();
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

  get xa() {
    return this.getProps('xa');
  }

  get ya() {
    return this.getProps('ya');
  }

  get xb() {
    return this.getProps('xb');
  }

  get yb() {
    return this.getProps('yb');
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
      isMulti, __cacheProps,
      __x3: originX, __y3: originY,
      computedStyle: {
        [STROKE_WIDTH]: strokeWidth,
      },
    } = this;
    this.__buildCache(originX, originY);
    let { xa, ya, xb, yb, controlA, controlB } = __cacheProps;
    let bbox = super.bbox;
    let half = 0;
    strokeWidth.forEach(item => {
      half = Math.max(half, item);
    });
    half = Math.ceil(half * 0.5) + 1;
    if(!isMulti) {
      xa = [xa];
      xb = [xb];
      ya = [ya];
      yb = [yb];
      controlA = [controlA];
      controlB = [controlB];
    }
    xa.forEach((xa, i) => {
      let y1 = ya[i];
      let x2 = xb[i];
      let y2 = yb[i];
      let ca = controlA[i];
      let cb = controlB[i];
      if((isNil(ca) || ca.length < 2) && (isNil(cb) || cb.length < 2)) {
        bbox[0] = Math.min(bbox[0], xa - half);
        bbox[0] = Math.min(bbox[0], x2 - half);
        bbox[1] = Math.min(bbox[1], y1 - half);
        bbox[1] = Math.min(bbox[1], y2 - half);
        bbox[2] = Math.max(bbox[2], xa + half);
        bbox[2] = Math.max(bbox[2], x2 + half);
        bbox[3] = Math.max(bbox[3], y1 + half);
        bbox[3] = Math.max(bbox[3], y2 + half);
      }
      else if(isNil(ca) || ca.length < 2) {
        let bezierBox = bezier.bboxBezier(xa, y1, cb[0], cb[1], x2, y2);
        bbox[0] = Math.min(bbox[0], bezierBox[0] - half);
        bbox[0] = Math.min(bbox[0], bezierBox[2] - half);
        bbox[1] = Math.min(bbox[1], bezierBox[1] - half);
        bbox[1] = Math.min(bbox[1], bezierBox[3] - half);
        bbox[2] = Math.max(bbox[2], bezierBox[0] + half);
        bbox[2] = Math.max(bbox[2], bezierBox[2] + half);
        bbox[3] = Math.max(bbox[3], bezierBox[1] + half);
        bbox[3] = Math.max(bbox[3], bezierBox[3] + half);
      }
      else if(isNil(cb) || cb.length < 2) {
        let bezierBox = bezier.bboxBezier(xa, y1, ca[0], ca[1], x2, y2);
        bbox[0] = Math.min(bbox[0], bezierBox[0] - half);
        bbox[0] = Math.min(bbox[0], bezierBox[2] - half);
        bbox[1] = Math.min(bbox[1], bezierBox[1] - half);
        bbox[1] = Math.min(bbox[1], bezierBox[3] - half);
        bbox[2] = Math.max(bbox[2], bezierBox[0] + half);
        bbox[2] = Math.max(bbox[2], bezierBox[2] + half);
        bbox[3] = Math.max(bbox[3], bezierBox[1] + half);
        bbox[3] = Math.max(bbox[3], bezierBox[3] + half);
      }
      else {
        let bezierBox = bezier.bboxBezier(xa, y1, ca[0], ca[1], cb[0], cb[1], x2, y2);
        bbox[0] = Math.min(bbox[0], bezierBox[0] - half);
        bbox[0] = Math.min(bbox[0], bezierBox[2] - half);
        bbox[1] = Math.min(bbox[1], bezierBox[1] - half);
        bbox[1] = Math.min(bbox[1], bezierBox[3] - half);
        bbox[2] = Math.max(bbox[2], bezierBox[0] + half);
        bbox[2] = Math.max(bbox[2], bezierBox[2] + half);
        bbox[3] = Math.max(bbox[3], bezierBox[1] + half);
        bbox[3] = Math.max(bbox[3], bezierBox[3] + half);
      }
    });
    return bbox;
  }
}

export default Line;
