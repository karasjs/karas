import unit from '../style/unit';
import math from '../math/index';
import util from '../util/util';

const { PX, PERCENT } = unit;
const { matrix, geom } = math;
const { d2r, transformPoint } = geom;

function calSingle(t, k, v) {
  if(k === 'translateX') {
    t[12] = v;
  }
  else if(k === 'translateY') {
    t[13] = v;
  }
  else if(k === 'scaleX') {
    t[0] = v;
  }
  else if(k === 'scaleY') {
    t[5] = v;
  }
  else if(k === 'skewX') {
    v = d2r(v);
    t[4] = Math.tan(v);
  }
  else if(k === 'skewY') {
    v = d2r(v);
    t[1] = Math.tan(v);
  }
  else if(k === 'rotateZ') {
    v = d2r(v);
    let sin = Math.sin(v);
    let cos = Math.cos(v);
    t[0] = t[5] = cos;
    t[1] = sin;
    t[4] = -sin;
  }
  else if(k === 'matrix') {
    t[0] = v[0];
    t[1] = v[1];
    t[4] = v[2];
    t[5] = v[3];
    t[12] = v[4];
    t[13] = v[5];
  }
}

function calMatrix(transform, ow, oh) {
  let list = normalize(transform, ow, oh);
  let m = matrix.identity();
  list.forEach(item => {
    let [k, v] = item;
    let t = matrix.identity();
    calSingle(t, k, v);
    m = matrix.multiply(m, t);
  });
  return matrix.t43(m);
}

function calMatrixByOrigin(m, transformOrigin) {
  let [ox, oy] = transformOrigin;
  let t = matrix.identity();
  t[12] = ox;
  t[13] = oy;
  let res = matrix.multiply(t, matrix.t34(m));
  let t2 = matrix.identity();
  t2[12] = -ox;
  t2[13] = -oy;
  res = matrix.multiply(res, t2);
  return matrix.t43(res);
}

function calMatrixWithOrigin(transform, transformOrigin, ow, oh) {
  let m = calMatrix(transform, ow, oh);
  return calMatrixByOrigin(m, transformOrigin);
}

// 判断点是否在一个矩形内，比如事件发生是否在节点上
function pointInQuadrilateral(x, y, x1, y1, x2, y2, x4, y4, x3, y3, matrix) {
  if(matrix && !util.equalArr(matrix, [1, 0, 0, 1, 0, 0])) {
    [x1, y1] = transformPoint(matrix, x1, y1);
    [x2, y2] = transformPoint(matrix, x2, y2);
    [x4, y4] = transformPoint(matrix, x4, y4);
    [x3, y3] = transformPoint(matrix, x3, y3);
    return geom.pointInPolygon(x, y, [
      [x1, y1],
      [x2, y2],
      [x4, y4],
      [x3, y3]
    ]);
  }
  else {
    return x >= x1 && y >= y1 && x <= x4 && y <= y4;
  }
}

function normalizeSingle(k, v, ow, oh) {
  if(k === 'translateX') {
    if(v.unit === PERCENT) {
      return v.value * ow * 0.01;
    }
  }
  else if(k === 'translateY') {
    if(v.unit === PERCENT) {
      return v.value * oh * 0.01;
    }
  }
  else if(k === 'matrix') {
    return v;
  }
  return v.value;
}

function normalize(transform, ow, oh) {
  let res = [];
  transform.forEach(item => {
    let [k, v] = item;
    res.push([k, normalizeSingle(k, v, ow, oh)]);
  });
  return res;
}

function calOrigin(transformOrigin, w, h) {
  let tfo = [];
  transformOrigin.forEach((item, i) => {
    if(item.unit === PX) {
      tfo.push(item.value);
    }
    else if(item.unit === PERCENT) {
      tfo.push(item.value * (i ? h : w) * 0.01);
    }
  });
  return tfo;
}

function mergeMatrix(a, b) {
  let m1 = matrix.t34(a);
  let m2 = matrix.t34(b);
  let m = matrix.multiply(m1, m2);
  return matrix.t43(m);
}

export default {
  calMatrix,
  calOrigin,
  calMatrixByOrigin,
  calMatrixWithOrigin,
  pointInQuadrilateral,
  mergeMatrix,
};
