import Geom from './Geom';
import mode from '../node/mode';
import painter from '../util/painter';
import util from '../util/util';
import geom from '../math/geom';

let { isNil } = util;

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

function getNewPoint(x1, y1, x2, y2, controlA, controlB, num, start, end) {
  console.log(num, start, end);
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
      this.__end = [0];
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
      }
      else if(!isNil(props.start)) {
        this.__start = [limitStartEnd(parseFloat(props.start) || 0)];
      }
      if(Array.isArray(props.end)) {
        this.__end = props.end.map(i => limitStartEnd(parseFloat(i) || 0));
      }
      else if(!isNil(props.end)) {
        this.__end = [limitStartEnd(parseFloat(props.end) || 0)];
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
        this.__end = limitStartEnd(parseFloat(props.end) || 0);
      }
      if(Array.isArray(props.controlA)) {
        this.__controlA = props.controlA;
      }
      if(Array.isArray(props.controlB)) {
        this.__controlB = props.controlB;
      }
    }
  }

  render(renderMode, lv, ctx, defs) {
    let res = super.render(renderMode, lv, ctx, defs);
    if(res.break) {
      return res;
    }
    let {
      originX,
      originY,
      stroke,
      strokeWidth,
      strokeDasharrayStr,
      strokeLinecap,
      strokeLinejoin,
      strokeMiterlimit,
    } = res;
    let { width, height, x1, y1, x2, y2, controlA, controlB, start, end, __cacheProps, isMulti } = this;
    let rebuild;
    if(isNil(__cacheProps.x1)) {
      rebuild = true;
      __cacheProps.x1 = reBuild(x1, originX, width, isMulti);
    }
    if(isNil(__cacheProps.x2)) {
      rebuild = true;
      __cacheProps.x2 = reBuild(x2, originX, width, isMulti);
    }
    if(isNil(__cacheProps.y1)) {
      rebuild = true;
      __cacheProps.y1 = reBuild(y1, originY, height, isMulti);
    }
    if(isNil(__cacheProps.y2)) {
      rebuild = true;
      __cacheProps.y2 = reBuild(y2, originY, height, isMulti);
    }
    if(isNil(__cacheProps.controlA)) {
      rebuild = true;
      __cacheProps.controlA = reBuildC(controlA, originX, originY, width, height, isMulti);
    }
    if(isNil(__cacheProps.controlB)) {
      rebuild = true;
      __cacheProps.controlB = reBuildC(controlB, originX, originY, width, height, isMulti);
    }
    if(isNil(__cacheProps.start)) {
      rebuild = true;
      __cacheProps.start = start;
    }
    if(isNil(__cacheProps.end)) {
      rebuild = true;
      __cacheProps.end = end;
    }
    if(rebuild && renderMode === mode.SVG) {
      let d = '';
      if(isMulti) {
        __cacheProps.x1.forEach((x1, i) => {
          let x2 = __cacheProps.x2[i];
          let y1 = __cacheProps.y1[i];
          let y2 = __cacheProps.y2[i];
          let controlA = __cacheProps.controlA[i];
          let controlB = __cacheProps.controlB[i];
          let start = __cacheProps.start[i];
          let end = __cacheProps.end[i];
          let curve = curveNum(controlA, controlB);
          if(start !== 0 || end !== 1) {
            [x1, y1, x2, y2, controlA, controlB] = getNewPoint(x1, y1, x2, y2, controlA, controlB, curve, start, end, __cacheProps.len);
          }
          d += painter.svgLine(x1, y1, x2, y2, controlA, controlB, curve);
        });
      }
      else {
        let curve = curveNum(__cacheProps.controlA, __cacheProps.controlB);
        let { x1, y1, x2, y2, controlA, controlB } = __cacheProps;
        if(start !== 0 || end !== 1) {
          [x1, y1, x2, y2, controlA, controlB] = getNewPoint(x1, y1, x2, y2, controlA, controlB, curve, start, end, __cacheProps.len);
        }
        d = painter.svgLine(x1, y1, x2, y2, controlA, controlB, curve);
      }
      __cacheProps.d = d;
    }
    if(renderMode === mode.CANVAS) {
      if(strokeWidth > 0) {
        ctx.beginPath();
        if(isMulti) {
          __cacheProps.x1.forEach((x1, i) => {
            let x2 = __cacheProps.x2[i];
            let y1 = __cacheProps.y1[i];
            let y2 = __cacheProps.y2[i];
            let controlA = __cacheProps.controlA[i];
            let controlB = __cacheProps.controlB[i];
            let start = __cacheProps.start[i];
            let end = __cacheProps.end[i];
            let curve = curveNum(controlA, controlB);
            if(start !== 0 || end !== 1) {
              [x1, y1, x2, y2, controlA, controlB] = getNewPoint(x1, y1, x2, y2, controlA, controlB, curve, start, end, __cacheProps.len);
            }
            painter.canvasLine(ctx, x1, y1, x2, y2, controlA, controlB, curve);
          });
        }
        else {
          let curve = curveNum(__cacheProps.controlA, __cacheProps.controlB);
          let { x1, y1, x2, y2, controlA, controlB } = __cacheProps;
          if(start !== 0 || end !== 1) {
            [x1, y1, x2, y2, controlA, controlB] = getNewPoint(x1, y1, x2, y2, controlA, controlB, curve, start, end, __cacheProps.len);
          }
          painter.canvasLine(ctx, x1, y1, x2, y2, controlA, controlB, curve);
        }
        ctx.stroke();
        ctx.closePath();
      }
    }
    else if(renderMode === mode.SVG) {
      let props = [
        ['d', __cacheProps.d],
        ['fill', 'none'],
        ['stroke', stroke],
        ['stroke-width', strokeWidth]
      ];
      this.__propsStrokeStyle(props, strokeDasharrayStr, strokeLinecap, strokeLinejoin, strokeMiterlimit);
      this.addGeom('path', props);
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
    let { isMulti, __cacheProps: { x1, y1, x2, y2, controlA, controlB },
      computedStyle: { strokeWidth } } = this;
    let bbox = super.bbox;
    let half = strokeWidth * 0.5;
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
        bbox[0] = Math.min(bbox[0], xa - half);
        bbox[1] = Math.min(bbox[0], xb - half);
        bbox[2] = Math.max(bbox[0], xa + half);
        bbox[3] = Math.max(bbox[0], xb + half);
      }
      else if(isNil(ca) || ca.length < 2) {
        let bezierBox = geom.bboxBezier(xa, ya, cb[0], cb[1], xb, yb);
        bbox[0] = Math.min(bbox[0], bezierBox[0] - half);
        bbox[1] = Math.min(bbox[0], bezierBox[1] - half);
        bbox[2] = Math.max(bbox[0], bezierBox[2] + half);
        bbox[3] = Math.max(bbox[0], bezierBox[3] + half);
      }
      else if(isNil(cb) || cb.length < 2) {
        let bezierBox = geom.bboxBezier(xa, ya, ca[0], ca[1], xb, yb);
        bbox[0] = Math.min(bbox[0], bezierBox[0] - half);
        bbox[1] = Math.min(bbox[0], bezierBox[1] - half);
        bbox[2] = Math.max(bbox[0], bezierBox[2] + half);
        bbox[3] = Math.max(bbox[0], bezierBox[3] + half);
      }
      else {
        let bezierBox = geom.bboxBezier(xa, ya, ca[0], ca[1], cb[0], cb[1], xb, yb);
        bbox[0] = Math.min(bbox[0], bezierBox[0] - half);
        bbox[1] = Math.min(bbox[0], bezierBox[1] - half);
        bbox[2] = Math.max(bbox[0], bezierBox[2] + half);
        bbox[3] = Math.max(bbox[0], bezierBox[3] + half);
      }
    });
    return bbox;
  }
}

export default Line;
