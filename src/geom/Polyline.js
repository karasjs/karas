import Geom from './Geom';
import mode from '../node/mode';
import util from '../util/util';
import painter from '../util/painter';
import geom from '../math/geom';

let { isNil } = util;

function concatPointAndControl(point, control) {
  if(Array.isArray(control) && (control.length === 2 || control.length === 4)
    && Array.isArray(point) && point.length === 2) {
    return control.concat(point);
  }
  return point;
}

class Polyline extends Geom {
  constructor(tagName, props) {
    super(tagName, props);
    // 所有点的列表
    if(this.isMulti) {
      this.__points = [[]];
      this.__controls = [[]];
    }
    else {
      this.__points = [];
      // 控制点
      this.__controls = [];
    }
    if(Array.isArray(props.controls)) {
      this.__controls = props.controls;
    }
    if(Array.isArray(props.points)) {
      this.__points = props.points;
    }
  }

  __getPoints(originX, originY, width, height, points, isControl) {
    return points.map((item, i) => {
      if(!Array.isArray(item)) {
        return;
      }
      let len = item.length;
      if(isControl) {
        if(len !== 0 && len !== 2 && len !== 4) {
          return;
        }
      }
      else {
        if(len !== 0 && len !== 2) {
          return;
        }
      }
      let res = [];
      for(let i = 0; i < len; i++) {
        if(i % 2 === 0) {
          res.push(originX + item[i] * width);
        }
        else {
          res.push(originY + item[i] * height);
        }
      }
      return res;
    });
  }

  buildCache(originX, originY) {
    let { width, height, points, controls, __cacheProps, isMulti } = this;
    let rebuild = true;
    if(isNil(__cacheProps.points)) {
      if(isMulti) {
        __cacheProps.points = points.map(item => {
          if(Array.isArray(item)) {
            return this.__getPoints(originX, originY, width, height, item);
          }
        });
      }
      else {
        __cacheProps.points = this.__getPoints(originX, originY, width, height, points);
      }
    }
    if(isNil(__cacheProps.controls)) {
      if(isMulti) {
        __cacheProps.controls = controls.map(item => {
          if(Array.isArray(item)) {
            return this.__getPoints(originX, originY, width, height, item, true);
          }
          return item;
        });
      }
      else {
        __cacheProps.controls = this.__getPoints(originX, originY, width, height, controls, true);
      }
    }
    if(rebuild) {
      let { points, controls } = __cacheProps;
      if(isMulti) {
        __cacheProps.list = points.filter(item => Array.isArray(item)).map((item, i) => {
          let cl = controls[i];
          if(Array.isArray(item)) {
            return item.map((point, j) => {
              if(j) {
                return concatPointAndControl(point, cl && cl[j - 1]);
              }
              return point;
            });
          }
        });
      }
      else {
        __cacheProps.list = points.filter(item => Array.isArray(item)).map((point, i) => {
          if(i) {
            return concatPointAndControl(point, controls[i - 1]);
          }
          return point;
        });
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
      originX,
      originY,
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
    this.buildCache(originX, originY);
    let list = __cacheProps.list;
    if(renderMode === mode.CANVAS) {
      ctx.beginPath();
      if(isMulti) {
        list.forEach(item => painter.canvasPolygon(ctx, item, dx, dy));
      }
      else {
        painter.canvasPolygon(ctx, list, dx, dy);
      }
      ctx.fill();
      if(strokeWidth > 0) {
        ctx.stroke();
      }
      ctx.closePath();
    }
    else if(renderMode === mode.SVG) {
      let d = '';
      if(isMulti) {
        list.forEach(item => d += painter.svgPolygon(item));
      }
      else {
        d = painter.svgPolygon(list);
      }
      let props = [
        ['d', d],
        ['fill', fill],
        ['stroke', stroke],
        ['stroke-width', strokeWidth]
      ];
      this.__propsStrokeStyle(props, strokeDasharrayStr, strokeLinecap, strokeLinejoin, strokeMiterlimit);
      this.addGeom('path', props);
    }
    return res;
  }

  get points() {
    return this.getProps('points');
  }

  get controls() {
    return this.getProps('controls');
  }

  get bbox() {
    let {
      isMulti, __cacheProps,
      sx, sy,
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
    this.buildCache(originX, originY);
    let bbox = super.bbox;
    let half = strokeWidth * 0.5;
    let [ox, oy] = this.__spreadByBoxShadowAndFilter(boxShadow, filter);
    ox += half;
    oy += half;
    let { points, controls } = __cacheProps;
    if(!isMulti) {
      points = [points];
      controls = [controls];
    }
    points.forEach((pointList, i) => {
      if(!pointList || pointList.length < 2 || pointList[0].length < 2 || pointList[1].length < 2) {
        return;
      }
      let controlList = controls[i];
      let [xa, ya] = pointList[0];
      for(let i = 1, len = pointList.length; i < len; i++) {
        let [xb, yb] = pointList[i];
        let c = controlList[i - 1];
        if(c && c.length === 4) {
          let bezierBox = geom.bboxBezier(xa, ya, c[0], c[1], c[2], c[3], xb, yb);
          bbox[0] = Math.min(bbox[0], bezierBox[0] - ox);
          bbox[1] = Math.min(bbox[0], bezierBox[1] - oy);
          bbox[2] = Math.max(bbox[0], bezierBox[2] + ox);
          bbox[3] = Math.max(bbox[0], bezierBox[3] + oy);
        }
        else if(c && c.length === 2) {
          let bezierBox = geom.bboxBezier(xa, ya, c[0], c[1], xb, yb);
          bbox[0] = Math.min(bbox[0], bezierBox[0] - ox);
          bbox[1] = Math.min(bbox[0], bezierBox[1] - oy);
          bbox[2] = Math.max(bbox[0], bezierBox[2] + ox);
          bbox[3] = Math.max(bbox[0], bezierBox[3] + oy);
        }
        else {
          bbox[0] = Math.min(bbox[0], xa - ox);
          bbox[1] = Math.min(bbox[0], xb - oy);
          bbox[2] = Math.max(bbox[0], xa + ox);
          bbox[3] = Math.max(bbox[0], xb + oy);
        }
        xa = xb;
        ya = yb;
      }
    });
    return bbox;
  }
}

export default Polyline;
