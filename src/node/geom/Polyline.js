import Geom from './Geom';
import util from '../../util/util';
import enums from '../../util/enums';
import bezier from '../../math/bezier';
import bo from '../../math/bo/index';
import mode from '../../refresh/mode';

let { intersect, union, subtract, subtract2, xor, chain } = bo;

const { STYLE_KEY: {
  STROKE_WIDTH,
} } = enums;
const { isNil } = util;

function concatPointAndControl(point, control) {
  if(Array.isArray(control) && (control.length === 2 || control.length === 4)
    && Array.isArray(point) && point.length === 2) {
    return control.concat(point);
  }
  return point;
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
        let c = bezier.bezierLength([prev, [item[0], item[1]], [item[2], item[3]]]);
        res.push(c);
        total += c;
        increase.push(total);
        prev = [item[2], item[3]];
      }
      else if(item.length === 6) {
        let c = bezier.bezierLength([prev, [item[0], item[1]], [item[2], item[3]], [item[4], item[5]]]);
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
  if(start === end) {
    return [];
  }
  if(start > end) {
    [start, end] = [end, start];
  }
  // start和end只能相差<=1，如果>1则校正
  while(end - start > 1) {
    end--;
  }
  // 将start和end统一至最接近0的正值
  while(end < 0 || start < 0) {
    end++;
    start++;
  }
  while(end >= 1 && start >= 1) {
    end--;
    start--;
  }
  // clone出原本顶点列表，防止干扰
  let length = list.length;
  list = util.clone(list);
  let res = [];
  let start2 = start > 1 ? (start - 1) : start;
  let end2 = end > 1 ? (end - 1) : end;
  let i = getIndex(len.increase, start2 * len.total, 0, length - 1);
  let j = getIndex(len.increase, end2 * len.total, 0, length - 1);
  // start<0或者end>1或者普通情况，一共3种，start和end不可能同时超限
  let isStartLt0 = start < 0;
  let isEndGt1 = end > 1;
  end2 *= len.total;
  let prePercent = 1;
  let endPoint;
  if(end2 > len.increase[j]) {
    let prev = list[j].slice(list[j].length - 2); // 最后2个点是x,y，前面是control
    let current = list[j + 1];
    let l = len.list[j];
    let diff = end2 - len.increase[j];
    let t = diff / l;
    prePercent = t;
    if(current.length === 2) {
      let a = current[0] - prev[0];
      let b = current[1] - prev[1];
      if(isEndGt1) {
        endPoint = [prev[0] + t * a, prev[1] + t * b];
      }
      else {
        t = 1 - t;
        endPoint = [current[0] - t * a, current[1] - t * b];
      }
    }
    else if(current.length === 4) {
      let r = bezier.sliceBezier([prev, [current[0], current[1]], [current[2], current[3]]], t);
      endPoint = [r[1][0], r[1][1], r[2][0], r[2][1]];
    }
    else if(current.length === 6) {
      let r = bezier.sliceBezier([prev, [current[0], current[1]], [current[2], current[3]], [current[4], current[5]]], t);
      endPoint = [r[1][0], r[1][1], r[2][0], r[2][1], r[3][0], r[3][1]];
    }
  }
  start2 *= len.total;
  if(start2 > len.increase[i]) {
    let current;
    let prev = list[i].slice(list[i].length - 2);
    let l = len.list[i];
    // 同一条线段时如果有end裁剪，会影响start长度，这里还要防止头尾绕了一圈的情况
    if(i === j && !isStartLt0 && !isEndGt1 && prePercent !== 1) {
      l *= prePercent;
      if(endPoint) {
        current = endPoint;
      }
    }
    if(!current) {
      current = list[i + 1];
    }
    let diff = start2 - len.increase[i];
    let t = diff / l;
    if(current.length === 2) {
      let a = current[0] - prev[0];
      let b = current[1] - prev[1];
      if(isStartLt0) {
        t = 1 - t;
        res.push([current[0] - t * a, current[1] - t * b]);
      }
      else {
        res.push([prev[0] + t * a, prev[1] + t * b]);
      }
      res.push(current);
    }
    else if(current.length === 4) {
      let r = bezier.sliceBezier([[current[2], current[3]], [current[0], current[1]], prev], 1 - t).reverse();
      res.push(r[0]);
      res.push([r[1][0], r[1][1], r[2][0], r[2][1]]);
      // 同一条线段上去除end冲突
      if(i === j && !isStartLt0 && !isEndGt1) {
        endPoint = null;
      }
    }
    else if(current.length === 6) {
      let r = bezier.sliceBezier([[current[4], current[5]], [current[2], current[3]], [current[0], current[1]], prev], 1 - t).reverse();
      res.push(r[0])
      res.push([r[1][0], r[1][1], r[2][0], r[2][1], current[4], current[5]]);
      if(i === j && !isStartLt0 && !isEndGt1) {
        endPoint = null;
      }
    }
  }
  // start和end之间的线段，注意头尾饶了一圈的情况，以及起始点被上方考虑过了
  for(let k = i + 2; k <= j + (!isStartLt0 && !isEndGt1 ? 0 : length); k++) {
    res.push(list[k % length]);
  }
  if(endPoint) {
    res.push(endPoint);
  }
  return res;
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
        this.__start = props.start.map(i => parseFloat(i) || 0);
        for(let i = this.__start.length; i  < this.__points.length; i++) {
          this.__start.push(0);
        }
      }
      else if(!isNil(props.start)) {
        let v = parseFloat(props.start) || 0;
        this.__start = this.__points.map(() => v);
      }
      if(Array.isArray(props.end)) {
        this.__end = props.end.map(i => {
          let v = parseFloat(i);
          if(isNaN(v)) {
            v = 1;
          }
          return v;
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
        this.__start = parseFloat(props.start) || 0;
      }
      if(!isNil(props.end)) {
        let v = parseFloat(props.end);
        if(isNaN(v)) {
          v = 1;
        }
        this.__end = v;
      }
    }
    if(Array.isArray(props.controls)) {
      this.__controls = props.controls;
    }
    if(Array.isArray(props.points)) {
      this.__points = props.points;
    }
    if(props.booleanOperations) {
      this.__booleanOperations = props.booleanOperations;
    }
  }

  calContent(currentStyle, computedStyle) {
    let res = super.calContent(currentStyle, computedStyle);
    // 查看是否有顶点
    if(res && !this.__hasXomContent) {
      let { __cacheProps: { points }, isMulti } = this;
      if(isMulti) {
        for(let i = 0, len = points.length; i < len; i++) {
          if(points.length) {
            return true;
          }
        }
        return false;
      }
      else {
        return !!points.length;
      }
    }
    return res;
  }

  __getPoints(originX, originY, width, height, points, isControl) {
    return points.map(item => {
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

  // 供polygon覆盖，后处理booleanOperations
  __reprocessing(list, isMulti) {
    if(!isMulti || list.length < 2) {
      return list;
    }
    let bo = this.booleanOperations, len = list.length;
    if(!bo) {
      return list;
    }
    if(!Array.isArray(bo)) {
      let old = bo;
      bo = [bo];
      for(let i = 1; i < len - 1; i++) {
        bo.push(old);
      }
    }
    if(Array.isArray(bo) && bo.length) {
      let res = [], temp = list[0];
      for(let i = 1; i < len; i++) {
        let op = (bo[i - 1] || '').toString().toLowerCase();
        let cur = list[i];
        if(['intersect', 'intersection', 'union', 'subtract', 'subtract2', 'diff', 'difference', 'xor'].indexOf(op) === -1) {
          res = res.concat(chain(temp));
          temp = cur || [];
          continue;
        }
        switch(op) {
          case 'intersect':
          case 'intersection':
            temp = intersect(temp, cur, true);
            break;
          case 'union':
            temp = union(temp, cur, true);
            break;
          case 'subtract':
          case 'diff':
          case 'difference':
            temp = subtract(temp, cur, true);
            break;
          case 'subtract2':
            temp = subtract2(temp, cur, true);
            break;
          case 'xor':
            temp = xor(temp, cur, true);
            break;
        }
      }
      return res.concat(chain(temp));
    }
    return list;
  }

  // 同polygon覆盖，booleanOperations改变时需刷新缓冲顶点坐标
  __needRebuildSE(__cacheProps) {
    if(util.isNil(__cacheProps.booleanOperations)) {
      __cacheProps.booleanOperations = true;
      return true;
    }
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
    // polygon会覆盖检查booleanOperations缓存
    if(this.__needRebuildSE(__cacheProps)) {
      rebuildSE = true;
    }
    // points/controls有变化就需要重建顶点
    if(rebuild) {
      let { points, controls } = __cacheProps;
      if(isMulti) {
        __cacheProps.list2 = points.map((item, i) => {
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
        __cacheProps.list2 = points.map((point, i) => {
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
      // 后处理一次，让polygon支持布尔运算
      __cacheProps.list = this.__reprocessing(__cacheProps.list, isMulti);
    }
    return rebuild || rebuildSE;
  }

  render(renderMode, ctx, dx, dy) {
    let res = super.render(renderMode, ctx, dx, dy);
    if(res.break || renderMode === mode.WEBGL) {
      return res;
    }
    this.buildCache(res.x3, res.y3);
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
        isMulti, __cacheProps,
        __x3: originX, __y3: originY,
        computedStyle: {
          [STROKE_WIDTH]: strokeWidth,
        },
      } = this;
      this.buildCache(originX, originY);
      let bbox = super.bbox;
      let half = 0;
      strokeWidth.forEach(item => {
        half = Math.max(half, item);
      });
      half = Math.ceil(half * 0.5) + 1;
      let { points, controls } = __cacheProps;
      if(!isMulti) {
        points = [points];
        controls = [controls];
      }
      points.forEach((pointList, i) => {
        if(!pointList || pointList.length < 2 || !pointList[0] || !pointList[1]
          || pointList[0].length < 2 || pointList[1].length < 2) {
          return;
        }
        let controlList = controls[i] || [];
        let [xa, ya] = pointList[0];
        for(let i = 1, len = pointList.length; i < len; i++) {
          let item = pointList[i];
          if(!item || item.length < 2) {
            continue;
          }
          let [xb, yb] = pointList[i];
          let c = controlList[i - 1];
          if(c && c.length === 4) {
            let bezierBox = bezier.bboxBezier(xa, ya, c[0], c[1], c[2], c[3], xb, yb);
            bbox[0] = Math.min(bbox[0], bezierBox[0] - half);
            bbox[1] = Math.min(bbox[1], bezierBox[1] - half);
            bbox[2] = Math.max(bbox[2], bezierBox[2] + half);
            bbox[3] = Math.max(bbox[3], bezierBox[3] + half);
          }
          else if(c && c.length === 2) {
            let bezierBox = bezier.bboxBezier(xa, ya, c[0], c[1], xb, yb);
            bbox[0] = Math.min(bbox[0], bezierBox[0] - half);
            bbox[1] = Math.min(bbox[1], bezierBox[1] - half);
            bbox[2] = Math.max(bbox[2], bezierBox[2] + half);
            bbox[3] = Math.max(bbox[3], bezierBox[3] + half);
          }
          else {
            bbox[0] = Math.min(bbox[0], xa - half);
            bbox[1] = Math.min(bbox[1], ya - half);
            bbox[2] = Math.max(bbox[2], xa + half);
            bbox[3] = Math.max(bbox[3], ya + half);
          }
          xa = xb;
          ya = yb;
        }
      });
      this.__bbox = bbox;
    }
    return this.__bbox;
  }

  get booleanOperations() {
    return this.getProps('booleanOperations');
  }
}

export default Polyline;
