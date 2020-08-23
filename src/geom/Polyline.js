import Geom from './Geom';
import mode from '../util/mode';
import util from '../util/util';
import painter from '../util/painter';

let { isNil } = util;

function concatPointAndControl(point, control) {
  if(Array.isArray(control) && control.length) {
    return point.concat(control);
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

  __getPoints(originX, originY, width, height, points, len, isControl) {
    if(!isControl && !Array.isArray(points) && points.length < 2) {
      throw new Error('Points must have at lease 2 item: ' + points);
    }
    return points.map(item => {
      let res = [];
      for(let i = 0; i < item.length; i++) {
        if(i === 0 || i === 2) {
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
        __cacheProps.points = points.map(item => this.__getPoints(originX, originY, width, height, item));
      }
      else {
        __cacheProps.points = this.__getPoints(originX, originY, width, height, points, true);
      }
    }
    if(isNil(__cacheProps.controls)) {
      if(isMulti) {
        __cacheProps.controls = controls.map(item => this.__getPoints(originX, originY, width, height, item));
      }
      else {
        __cacheProps.controls = this.__getPoints(originX, originY, width, height, controls, true);
      }
    }
    let pts = __cacheProps.points;
    let cls = __cacheProps.controls;
    // points/controls有变化就需要重建顶点
    if(rebuild && renderMode === mode.SVG) {
      if(isMulti) {
        let list = pts.map((item, i) => {
          let cl = cls[i];
          return item.map((point, j) => {
            return concatPointAndControl(point, cl && cl[j]);
          });
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
        let list = pts.map((point, i) => concatPointAndControl(point, controls[i]));
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
      if(strokeWidth > 0) {
        ctx.stroke();
      }
      ctx.fill();
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
