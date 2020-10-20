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

function limitStartEnd(v) {
  if(v < 0) {
    v = 0;
  }
  else if(v > 1) {
    v = 1;
  }
  return v;
}

function getLength(list, isMulti) {
  let res = [];
  let total = 0;
  let increase = [];
  if(isMulti) {
    total = [];
    list.forEach(list => {
      let temp = getLength(list);
      res.push(temp.list);
      total.push(temp.total);
      increase.push(temp.increase);
    });
  }
  else if(Array.isArray(list)) {
    total = 0;
    let start = 0;
    for(let i = 0, len = list.length; i < len; i++) {
      let item = list[i];
      if(Array.isArray(item)) {
        start = i;
        break;
      }
    }
    let prev = list[start];
    for(let i = start + 1, len = list.length; i < len; i++) {
      let item = list[i];
      if(!Array.isArray(item)) {
        continue;
      }
      if(item.length === 2) {
        let a = Math.abs(item[0] - prev[0]);
        let b = Math.abs(item[1] - prev[1]);
        let c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
        res.push(c);
        total += c;
        increase.push(total);
        prev = item;
      }
      else if(item.length === 4) {
        let c = geom.bezierLength([prev, [item[0], item[1]], [item[2], item[3]]], 2);
        res.push(c);
        total += c;
        increase.push(total);
        prev = [item[2], item[3]];
      }
      else if(item.length === 6) {
        let c = geom.bezierLength([prev, [item[0], item[1]], [item[2], item[3]], [item[4], item[5]]], 3);
        res.push(c);
        total += c;
        increase.push(total);
        prev = [item[4], item[5]];
      }
    }
  }
  return {
    list: res,
    total,
    increase,
  };
}

function getIndex(list, t, i, j) {
  if(i === j) {
    return i;
  }
  let middle = i + ((j - i) >> 1);
  if(list[middle] === t) {
    return middle;
  }
  else if(list[middle] > t) {
    return getIndex(list, t, i, Math.max(middle - 1, i));
  }
  else {
    return getIndex(list, t, Math.min(middle + 1, j), j);
  }
}

function getNewList(list, len, start, end) {
  let i = 0, j = list.length - 2;
  if(start > 0) {
    i = getIndex(len.increase, start * len.total, i, j);
  }
  if(end < 1) {
    j = getIndex(len.increase, end * len.total, i, j);
  }
  list = util.clone(list);
  end *= len.total;
  if(end < len.increase[j]) {
    let prev = list[j].slice(list[j].length - 2);
    let current = list[j + 1];
    let l = len.list[j];
    let diff = len.increase[j] - end;
    let t = 1 - diff / l;
    if(current.length === 2) {
      let a = Math.abs(current[0] - prev[0]);
      let b = Math.abs(current[1] - prev[1]);
      list[j + 1] = [current[1] - (1 - t) * a, current[1] - (1 - t) * b];
    }
    else if(current.length === 4) {
      let res = geom.sliceBezier([prev, [current[0], current[1]], [current[2], current[3]]], t);
      list[j + 1] = [res[1][0], res[1][1], res[2][0], res[2][1]];
    }
    else if(current.length === 6) {
      let res = geom.sliceBezier([prev, [current[0], current[1]], [current[2], current[3]], [current[4], current[5]]], t);
      list[j + 1] = [res[1][0], res[1][1], res[2][0], res[2][1], res[3][0], res[3][1]];
    }
  }
  start *= len.total;
  if(start > (i ? len.increase[i - 1] : 0)) {
    let prev = list[i].slice(list[i].length - 2);
    let current = list[i + 1];
    let l = len.list[i];
    let diff = start - (i ? len.increase[i - 1] : 0);
    let t = diff / l;
    if(current.length === 2) {
      let a = Math.abs(current[0] - prev[0]);
      let b = Math.abs(current[1] - prev[1]);
      list[i] = [prev[0] + t * a, prev[1] + t * b];
    }
    else if(current.length === 4) {
      let res = geom.sliceBezier([[current[2], current[3]], [current[0], current[1]], prev], 1 - t).reverse();
      list[i] = res[0];
      list[i + 1] = [res[1][0], res[1][1], res[2][0], res[2][1]];
    }
    else if(current.length === 6) {
      let res = geom.sliceBezier([[current[4], current[5]], [current[2], current[3]], [current[0], current[1]], prev], 1 - t).reverse();
      list[i] = res[0];
      list[i + 1] = [res[1][0], res[1][1], res[2][0], res[2][1], current[4], current[5]];
    }
  }
  if(j < list.length - 2) {
    list = list.slice(0, j + 2);
  }
  if(i > 0) {
    list = list.slice(i);
  }
  return list;
}

class Polyline extends Geom {
  constructor(tagName, props) {
    super(tagName, props);
    // 所有点的列表
    if(this.isMulti) {
      this.__points = [[]];
      this.__controls = [[]];
      this.__start = [0];
      this.__end = [0];
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
      this.__points = [];
      // 控制点
      this.__controls = [];
      this.__start = 0;
      this.__end = 1;
      if(!isNil(props.start)) {
        this.__start = limitStartEnd(parseFloat(props.start) || 0);
      }
      if(!isNil(props.end)) {
        this.__end = limitStartEnd(parseFloat(props.end) || 0);
      }
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
    } = res;
    let { width, height, points, controls, start, end, __cacheProps, isMulti } = this;
    // rebuild和reset区分开，防止start/end动画时重算所有节点和len
    let rebuild, reset;
    if(isNil(__cacheProps.points)) {
      rebuild = true;
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
      rebuild = true;
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
    if(isNil(__cacheProps.start)) {
      reset = true;
      __cacheProps.start = start;
    }
    if(isNil(__cacheProps.end)) {
      reset = true;
      __cacheProps.end = end;
    }
    // points/controls有变化就需要重建顶点
    if(rebuild) {
      let pts = __cacheProps.points;
      let cls = __cacheProps.controls;
      if(isMulti) {
        let list = pts.map((item, i) => {
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
        __cacheProps.list = list;
        __cacheProps.len = getLength(list, isMulti);
      }
      else {
        let list = pts.filter(item => Array.isArray(item)).map((point, i) => {
          if(i) {
            return concatPointAndControl(point, cls[i - 1]);
          }
          return point;
        });
        __cacheProps.len = getLength(list, isMulti);
        __cacheProps.list = list;
      }
    }
    // rebuild或reset时，重新计算节点列表，仅reset说明只有start/end变化
    if(rebuild || reset) {
      if(isMulti) {
        __cacheProps.list2 = __cacheProps.list.map((item, i) => {
          if(Array.isArray(item)) {
            return getNewList(item, __cacheProps.len[i], start[i], end[i]);
          }
        });
      }
      else {
        if(start !== 0 || end !== 1) {
          __cacheProps.list2 = getNewList(__cacheProps.list, __cacheProps.len, start, end);
        }
      }
      if(renderMode === mode.SVG) {
        if(isMulti) {
          let d = '';
          __cacheProps.list2.forEach(item => d += painter.svgPolygon(item));
          __cacheProps.d = d;
        }
        else {
          __cacheProps.d = painter.svgPolygon(__cacheProps.list2);
        }
      }
    }
    if(renderMode === mode.CANVAS) {
      ctx.beginPath();
      let list = __cacheProps.list2;
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
    return res;
  }

  get points() {
    return this.getProps('points');
  }

  get controls() {
    return this.getProps('controls');
  }

  get start() {
    return this.getProps('start');
  }

  get end() {
    return this.getProps('end');
  }

  get bbox() {
    let { isMulti, __cacheProps: { points, controls }, computedStyle: { strokeWidth } } = this;
    let bbox = super.bbox;
    let half = strokeWidth * 0.5;
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
          bbox[0] = Math.min(bbox[0], bezierBox[0] - half);
          bbox[1] = Math.min(bbox[0], bezierBox[1] - half);
          bbox[2] = Math.max(bbox[0], bezierBox[2] + half);
          bbox[3] = Math.max(bbox[0], bezierBox[3] + half);
        }
        else if(c && c.length === 2) {
          let bezierBox = geom.bboxBezier(xa, ya, c[0], c[1], xb, yb);
          bbox[0] = Math.min(bbox[0], bezierBox[0] - half);
          bbox[1] = Math.min(bbox[0], bezierBox[1] - half);
          bbox[2] = Math.max(bbox[0], bezierBox[2] + half);
          bbox[3] = Math.max(bbox[0], bezierBox[3] + half);
        }
        else {
          bbox[0] = Math.min(bbox[0], xa - half);
          bbox[1] = Math.min(bbox[0], xb - half);
          bbox[2] = Math.max(bbox[0], xa + half);
          bbox[3] = Math.max(bbox[0], xb + half);
        }
        xa = xb;
        ya = yb;
      }
    });
    return bbox;
  }
}

export default Polyline;
