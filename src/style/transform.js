import unit from '../style/unit';
import util from '../util/util';
import matrix from '../math/matrix';

function calMatrix(transform, transformOrigin, x, y, ow, oh) {
  let [ox, oy] = transformOrigin;
  let list = normalize(transform, ox, oy, ow, oh);
  let m = matrix.identity();
  m[12] = ox;
  m[13] = oy;
  list.forEach(item => {
    let [k, v] = item;
    let t = matrix.identity();
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
      v = util.d2r(v);
      t[4] = Math.tan(v);
    }
    else if(k === 'skewY') {
      v = util.d2r(v);
      t[1] = Math.tan(v);
    }
    else if(k === 'rotateZ') {
      v = util.d2r(v);
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
    m = matrix.multiply(m, t);
  });
  let t = matrix.identity();
  t[12] = -ox;
  t[13] = -oy;
  m = matrix.multiply(m, t);
  return matrix.t43(m);
}

function transformPoint(matrix, x, y) {
  let [a, b, c, d, e, f] = matrix;
  return [a * x + c * y + e, b * x + d * y + f];
}

// 向量积
function vectorProduct(x1, y1, x2, y2) {
  return x1 * y2 - x2 * y1;
}

function pointInQuadrilateral(x, y, x1, y1, x2, y2, x3, y3, x4, y4, matrix) {
  if(matrix) {
    [x1, y1] = transformPoint(matrix, x1, y1);
    [x2, y2] = transformPoint(matrix, x2, y2);
    [x3, y3] = transformPoint(matrix, x3, y3);
    [x4, y4] = transformPoint(matrix, x4, y4);
    if(vectorProduct(x2 - x1, y2 - y1, x - x1, y - y1) > 0
      && vectorProduct(x4 - x2, y4 - y2, x - x2, y - y2) > 0
      && vectorProduct(x3 - x4, y3 - y4, x - x4, y - y4) > 0
      && vectorProduct(x1 - x3, y1 - y3, x - x3, y - y3) > 0) {
      return true;
    }
  }
  else {
    return x >= x1 && y >= y1 && x <= x4 && y <= y4;
  }
}

function normalize(transform, ox, oy, w, h) {
  let res = [];
  transform.forEach(item => {
    let [k, v] = item;
    if(k === 'translateX') {
      if(v.unit === unit.PERCENT) {
        res.push([item[0], v.value * w * 0.01]);
      }
      else {
        res.push([item[0], item[1].value]);
      }
    }
    else if(k === 'translateY') {
      if(v.unit === unit.PERCENT) {
        res.push([item[0], v.value * h * 0.01]);
      }
      else {
        res.push([item[0], item[1].value]);
      }
    }
    else if(k === 'matrix') {
      res.push([item[0], item[1]]);
    }
    else {
      res.push([item[0], item[1].value]);
    }
  });
  return res;
}

function calOrigin(transformOrigin, x, y, w, h) {
  let tfo = [];
  transformOrigin.forEach((item, i) => {
    if(item.unit === unit.PX) {
      tfo.push(item.value + i ? y : x);
    }
    else if(item.unit === unit.PERCENT) {
      tfo.push((i ? y : x) + item.value * (i ? h : w) * 0.01);
    }
  });
  return tfo;
}

function convert(m3) {
  let m = matrix.identity();
  m[0] = m3[0];
  m[1] = m3[1];
  m[4] = m3[2];
  m[5] = m3[3];
  m[12] = m3[4];
  m[13] = m3[5];
  return m;
}

function mergeMatrix(a, b) {
  let m1 = convert(a);
  let m2 = convert(b);
  let m = matrix.multiply(m1, m2);
  return [
    m[0], m[1],
    m[4], m[5],
    m[12], m[13]
  ];
}

export default {
  calMatrix,
  calOrigin,
  pointInQuadrilateral,
  mergeMatrix,
};
