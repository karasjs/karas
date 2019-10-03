import unit from '../style/unit';
import util from '../util';

function calMatrix(transform, transformOrigin, x, y, ow, oh) {
  let [ox, oy] = getOrigin(transformOrigin, x, y, ow, oh);
  let list = normalize(transform, ox, oy);
  let matrix = identity();
  matrix[12] = ox;
  matrix[13] = oy;
  let deg = 0;
  list.forEach(item => {
    let [k, v] = item;
    let target = identity();
    if(k === 'translateX') {
      target[12] = v;
    }
    else if(k === 'translateY') {
      target[13] = v;
    }
    else if(k === 'scaleX') {
      target[0] = v;
    }
    else if(k === 'scaleY') {
      target[5] = v;
    }
    else if(k === 'skewX') {
      v = util.r2d(v);
      let tan = Math.tan(v);
      target[4] = tan;
    }
    else if(k === 'skewY') {
      v = util.r2d(v);
      let tan = Math.tan(v);
      target[1] = tan;
    }
    else if(k === 'rotateZ') {
      v = util.r2d(v);
      deg += v;
      let sin = Math.sin(v);
      let cos = Math.cos(v);
      target[0] = target[5] = cos;
      target[1] = sin;
      target[4] = -sin;
    }
    else if(k === 'matrix') {
      target[0] = v[0];
      target[1] = v[1];
      target[4] = v[2];
      target[5] = v[3];
      target[12] = v[4];
      target[13] = v[5];
    }
    matrix = multiply(matrix, target);
  });
  let target = identity();
  target[12] = -ox;
  target[13] = -oy;
  matrix = multiply(matrix, target);
  return [
    matrix[0], matrix[1],
    matrix[4], matrix[5],
    matrix[12], matrix[13]
  ];
}

// 生成4*4单位矩阵
function identity() {
  const matrix = [];
  for (let i = 0; i < 16; i++) {
    matrix.push(i % 5 === 0 ? 1 : 0);
  }
  return matrix;
}

// 矩阵a*b
function multiply(a, b) {
  let res = [];
  for(let i = 0; i < 4; i++) {
    const row = [a[i], a[i + 4], a[i + 8], a[i + 12]];
    for(let j = 0; j < 4; j++) {
      let k = j * 4;
      let col = [b[k], b[k + 1], b[k + 2], b[k + 3]];
      let n = row[0] * col[0] + row[1] * col[1] + row[2] * col[2] + row[3] * col[3];
      res[i + k] = n;
    }
  }
  return res;
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
    else {
      res.push([item[0], item[1]]);
    }
  });
  return res;
}

function getOrigin(transformOrigin, x, y, w, h) {
  let tfo = [];
  transformOrigin.forEach((item, i) => {
    if(item.unit === unit.PX) {
      tfo.push(item.value);
    }
    else if(item.unit === unit.PERCENT) {
      tfo.push((i ? y : x) + item.value * (i ? h : w) * 0.01);
    }
    else if(item.value === 'left') {
      tfo.push(x);
    }
    else if(item.value === 'right') {
      tfo.push(x + w);
    }
    else if(item.value === 'top') {
      tfo.push(y);
    }
    else if(item.value === 'bottom') {
      tfo.push(y + h);
    }
    else {
      tfo.push(i ? (y + h * 0.5) : (x + w * 0.5));
    }
  });
  return tfo;
}

function mergeMatrix(a, b) {
  let m1 = identity();
  m1[0] = a[0];
  m1[1] = a[1];
  m1[4] = a[2];
  m1[5] = a[3];
  m1[12] = a[4];
  m1[13] = a[5];
  let m2 = identity();
  m2[0] = b[0];
  m2[1] = b[1];
  m2[4] = b[2];
  m2[5] = b[3];
  m2[12] = b[4];
  m2[13] = b[5];
  let matrix = multiply(m1, m2);
  return [
    matrix[0], matrix[1],
    matrix[4], matrix[5],
    matrix[12], matrix[13]
  ];
}

export default {
  calMatrix,
  pointInQuadrilateral,
  mergeMatrix,
};
