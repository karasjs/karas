import Geom from './Geom';
import util from '../../util/util';
import enums from '../../util/enums';
import geom from '../../math/geom';

const { STYLE_KEY: {
  STROKE_WIDTH,
  BOX_SHADOW,
} } = enums;
const { isNil } = util;

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
      increase.push([0].concat(temp.increase));
    });
  }
  else if(Array.isArray(list)) {
    total = 0;
    increase.push(0);
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
    if(list[i] > t) {
      return i - 1;
    }
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

function getNewList(list, len, start = 0, end = 1) {
  if(start === 0 && end === 1) {
    return list;
  }
  if(start >= end) {
    return [];
  }
  let i = 0, j = list.length - 2;
  if(start > 0) {
    i = getIndex(len.increase, start * len.total, i, j);
  }
  if(end < 1) {
    j = getIndex(len.increase, end * len.total, i, j);
  }
  list = util.clone(list);
  end *= len.total;
  let prePercent = 1;
  if(end > len.increase[j]) {
    let prev = list[j].slice(list[j].length - 2); // 最后2个点是x,y，前面是control
    let current = list[j + 1];
    let l = len.list[j];
    let diff = end - len.increase[j];
    let t = diff / l;
    prePercent = t;
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
  if(start > len.increase[i]) {
    let prev = list[i].slice(list[i].length - 2);
    let current = list[i + 1];
    let l = len.list[i];
    // 同一条线段时如果有end裁剪，会影响start长度
    if(i === j && prePercent !== 1) {
      l *= prePercent;
    }
    let diff = start - len.increase[i];
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
      this.__end = [1];
      if(Array.isArray(props.start)) {
        this.__start = props.start.map(i => limitStartEnd(parseFloat(i) || 0));
        for(let i = this.__start.length; i  < this.__points.length; i++) {
          this.__start.push(0);
        }
      }
      else if(!isNil(props.start)) {
        let v = limitStartEnd(parseFloat(props.start) || 0);
        this.__start = this.__points.map(() => v);
      }
      if(Array.isArray(props.end)) {
        this.__end = props.end.map(i => {
          let v = parseFloat(i);
          if(isNaN(v)) {
            v = 1;
          }
          return limitStartEnd(v);
        });
        for(let i = this.__end.length; i  < this.__points.length; i++) {
          this.__end.push(1);
        }
      }
      else if(!isNil(props.end)) {
        let v = parseFloat(props.end);
        if(isNaN(v)) {
          v = 1;
        }
        v = limitStartEnd(v);
        this.__end = this.__points.map(() => v);
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
        let v = parseFloat(props.end);
        if(isNaN(v)) {
          v = 1;
        }
        this.__end = limitStartEnd(v);
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

  buildCache(originX, originY) {
    let { width, height, points, controls, start, end, __cacheProps, isMulti } = this;
    let rebuild, rebuildSE;
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
      rebuildSE = true;
      __cacheProps.start = start;
    }
    if(isNil(__cacheProps.end)) {
      rebuildSE = true;
      __cacheProps.end = end;
    }
    // points/controls有变化就需要重建顶点
    if(rebuild) {
      let { points, controls } = __cacheProps;
      if(isMulti) {
        __cacheProps.list2 = points.filter(item => Array.isArray(item)).map((item, i) => {
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
        __cacheProps.len = getLength(__cacheProps.list2, isMulti);
      }
      else {
        __cacheProps.list2 = points.filter(item => Array.isArray(item)).map((point, i) => {
          if(i) {
            return concatPointAndControl(point, controls[i - 1]);
          }
          return point;
        });
        __cacheProps.len = getLength(__cacheProps.list2, isMulti);
      }
    }
    if(rebuild || rebuildSE) {
      if(isMulti) {
        __cacheProps.list = __cacheProps.list2.map((item, i) => {
          if(Array.isArray(item)) {
            let len = __cacheProps.len;
            return getNewList(item, {
              list: len.list[i],
              total: len.total[i],
              increase: len.increase[i],
            }, __cacheProps.start[i], __cacheProps.end[i]);
          }
        });
      }
      else {
        __cacheProps.list = getNewList(__cacheProps.list2, __cacheProps.len, __cacheProps.start, __cacheProps.end);
      }
    }
    return rebuild || rebuildSE;
  }

  render(renderMode, lv, ctx, cache) {
    let res = super.render(renderMode, lv, ctx, cache);
    if(res.break) {
      return res;
    }
    ctx = res.ctx;
    this.__renderPolygon(renderMode, ctx, res);
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
    if(!this.__bbox) {
      let {
        __sx3: originX, __sy3: originY,
        currentStyle: {
          [STROKE_WIDTH]: strokeWidth,
          [BOX_SHADOW]: boxShadow,
        },
        isMulti, __cacheProps,
      } = this;
      this.buildCache(originX, originY);
      let bbox = super.bbox;
      let half = 0;
      strokeWidth.forEach(item => {
        half = Math.max(item[0], half);
      });
      let [ox, oy] = this.__spreadBbox(boxShadow);
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
        let controlList = controls[i] || [];
        let [xa, ya] = pointList[0];
        for(let i = 1, len = pointList.length; i < len; i++) {
          let [xb, yb] = pointList[i];
          let c = controlList[i - 1];
          if(c && c.length === 4) {
            let bezierBox = geom.bboxBezier(xa, ya, c[0], c[1], c[2], c[3], xb, yb);
            bbox[0] = Math.min(bbox[0], bezierBox[0] - ox);
            bbox[1] = Math.min(bbox[1], bezierBox[1] - oy);
            bbox[2] = Math.max(bbox[2], bezierBox[2] + ox);
            bbox[3] = Math.max(bbox[3], bezierBox[3] + oy);
          }
          else if(c && c.length === 2) {
            let bezierBox = geom.bboxBezier(xa, ya, c[0], c[1], xb, yb);
            bbox[0] = Math.min(bbox[0], bezierBox[0] - ox);
            bbox[1] = Math.min(bbox[1], bezierBox[1] - oy);
            bbox[2] = Math.max(bbox[2], bezierBox[2] + ox);
            bbox[3] = Math.max(bbox[3], bezierBox[3] + oy);
          }
          else {
            bbox[0] = Math.min(bbox[0], xa - ox);
            bbox[1] = Math.min(bbox[1], ya - oy);
            bbox[2] = Math.max(bbox[2], xa + ox);
            bbox[3] = Math.max(bbox[3], ya + oy);
          }
          xa = xb;
          ya = yb;
        }
      });
      this.__bbox = bbox;
    }
    return this.__bbox;
  }
}

export default Polyline;
