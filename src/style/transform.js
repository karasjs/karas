import unit from '../style/unit';
import enums from '../util/enums';
import math from '../math/index';

const { STYLE_KEY: {
  TRANSLATE_X,
  TRANSLATE_Y,
  SCALE_X,
  SCALE_Y,
  SKEW_X,
  SKEW_Y,
  ROTATE_Z,
  MATRIX,
}} = enums;
const { PX, PERCENT } = unit;
const { matrix, geom } = math;
const { identity, calPoint, multiply, isE } = matrix;
const { d2r, pointInPolygon } = geom;

function calSingle(t, k, v) {
  if(k === TRANSLATE_X) {
    t[4] = v;
  }
  else if(k === TRANSLATE_Y) {
    t[5] = v;
  }
  else if(k === SCALE_X) {
    t[0] = v;
  }
  else if(k === SCALE_Y) {
    t[3] = v;
  }
  else if(k === SKEW_X) {
    v = d2r(v);
    t[2] = Math.tan(v);
  }
  else if(k === SKEW_Y) {
    v = d2r(v);
    t[1] = Math.tan(v);
  }
  else if(k === ROTATE_Z) {
    v = d2r(v);
    let sin = Math.sin(v);
    let cos = Math.cos(v);
    t[0] = t[3] = cos;
    t[1] = sin;
    t[2] = -sin;
  }
  else if(k === MATRIX) {
    t[0] = v[0];
    t[1] = v[1];
    t[2] = v[2];
    t[3] = v[3];
    t[4] = v[4];
    t[5] = v[5];
  }
}

function calMatrix(transform, ow, oh) {
  let list = normalize(transform, ow, oh);
  let m = identity();
  list.forEach(item => {
    let [k, v] = item;
    let t = identity();
    calSingle(t, k, v);
    m = multiply(m, t);
  });
  return m;
}

function calMatrixByOrigin(m, transformOrigin) {
  let [ox, oy] = transformOrigin;
  let res = m.slice(0);
  if(ox === 0 && oy === 0 || isE(m)) {
    return res;
  }
  let [a, b, c, d, e, f] = res;
  res[4] = -ox * a - oy * c + e + ox;
  res[5] = -ox * b - oy * d + f + oy;
  return res;
}

function calMatrixWithOrigin(transform, transformOrigin, ow, oh) {
  let m = calMatrix(transform, ow, oh);
  return calMatrixByOrigin(m, transformOrigin);
}

// 判断点是否在一个矩形内，比如事件发生是否在节点上
function pointInQuadrilateral(x, y, x1, y1, x2, y2, x4, y4, x3, y3, matrix) {
  if(matrix && !isE(matrix)) {
    [x1, y1] = calPoint([x1, y1], matrix);
    [x2, y2] = calPoint([x2, y2], matrix);
    [x3, y3] = calPoint([x3, y3], matrix);
    [x4, y4] = calPoint([x4, y4], matrix);
    return pointInPolygon(x, y, [
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
  if(k === TRANSLATE_X) {
    if(v[1] === PERCENT) {
      return v[0] * ow * 0.01;
    }
  }
  else if(k === TRANSLATE_Y) {
    if(v[1] === PERCENT) {
      return v[0] * oh * 0.01;
    }
  }
  else if(k === MATRIX) {
    return v;
  }
  return v[0];
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
    if(item[1] === PX) {
      tfo.push(item[0]);
    }
    else if(item[1] === PERCENT) {
      tfo.push(item[0] * (i ? h : w) * 0.01);
    }
  });
  return tfo;
}

export default {
  calMatrix,
  calOrigin,
  calMatrixByOrigin,
  calMatrixWithOrigin,
  pointInQuadrilateral,
};
