import Geom from './Geom';
import mode from '../util/mode';
import util from '../util/util';
import painter from '../util/painter';

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

  render(renderMode, ctx, defs) {
    let {
      isDestroyed,
      cache,
      originX,
      originY,
      display,
      visibility,
      fill,
      stroke,
      strokeWidth,
      strokeDasharrayStr,
      strokeLinecap,
      strokeLinejoin,
      strokeMiterlimit,
    } = super.render(renderMode, ctx, defs);
    if(isDestroyed || display === 'none' || visibility === 'hidden' || cache) {
      return;
    }
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
    let pts = __cacheProps.points;
    let cls = __cacheProps.controls;
    // points/controls有变化就需要重建顶点
    if(rebuild) {
      if(isMulti) {
        let list = pts.filter(item => Array.isArray(item)).map((item, i) => {
          let cl = cls[i];
          if(Array.isArray(item)) {
            return item.map((point, j) => {
              if(j) {
                return concatPointAndControl(point, cl && cl[j - 1]);
              }
              return point;
            });
          }
        });
        if(renderMode === mode.CANVAS) {
          __cacheProps.list = list;
        }
        else if(renderMode === mode.SVG) {
          let d = '';
          list.forEach(item => d += painter.svgPolygon(item));
          __cacheProps.d = d;
        }
      }
      else {
        let list = pts.filter(item => Array.isArray(item)).map((point, i) => {
          if(i) {
            return concatPointAndControl(point, cls[i - 1]);
          }
          return point;
        });
        if(renderMode === mode.CANVAS) {
          __cacheProps.list = list;
        }
        else if(renderMode === mode.SVG) {
          __cacheProps.d = painter.svgPolygon(list);
        }
      }
    }
    if(renderMode === mode.CANVAS) {
      ctx.beginPath();
      let list = __cacheProps.list;
      if(isMulti) {
        list.forEach(item => painter.canvasPolygon(ctx, item));
      }
      else {
        painter.canvasPolygon(ctx, list);
      }
      ctx.fill();
      if(strokeWidth > 0) {
        ctx.stroke();
      }
      ctx.closePath();
    }
    else if(renderMode === mode.SVG) {
      let props = [
        ['d', __cacheProps.d],
        ['fill', fill],
        ['stroke', stroke],
        ['stroke-width', strokeWidth]
      ];
      this.__propsStrokeStyle(props, strokeDasharrayStr, strokeLinecap, strokeLinejoin, strokeMiterlimit);
      this.addGeom('path', props);
    }
  }

  get points() {
    return this.getProps('points');
  }
  get controls() {
    return this.getProps('controls');
  }
}

export default Polyline;
