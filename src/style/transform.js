import unit from '../style/unit';
import util from '../util';

function calMatrix(transform, ox, oy, ow, oh) {
  let matrix = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1]
  ];
  let deg = 0;
  transform.forEach(item => {
    let [k, v] = item;
    if(k === 'translateX') {
      let dx = v * Math.cos(deg);
      let dy = v * Math.sin(deg);
      matrix = multiply(matrix, [
        [1, 0, 0],
        [0, 1, 0],
        [dx, dy, 1]
      ]);
      ox += dx;
      oy += dy;
    }
    else if(k === 'translateY') {
      let dx = -v * Math.cos(deg);
      let dy = v * Math.sin(deg);
      matrix = multiply(matrix, [
        [1, 0, 0],
        [0, 1, 0],
        [dx, dy, 1]
      ]);
      ox += dx;
      oy += dy;
    }
    else if(k === 'scaleX') {
      matrix = multiply(matrix, [
        [1, 0, 0],
        [0, 1, 0],
        [-ox, 0, 1]
      ]);
      matrix = multiply(matrix, [
        [v, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
      ]);
      matrix = multiply(matrix, [
        [1, 0, 0],
        [0, 1, 0],
        [ox, 0, 1]
      ]);
    }
    else if(k === 'scaleY') {
      matrix = multiply(matrix, [
        [1, 0, 0],
        [0, 1, 0],
        [0, -oy, 1]
      ]);
      matrix = multiply(matrix, [
        [1, 0, 0],
        [0, v, 0],
        [0, 0, 1]
      ]);
      matrix = multiply(matrix, [
        [1, 0, 0],
        [0, 1, 0],
        [0, oy, 1]
      ]);
    }
    else if(k === 'skewX') {
      v = util.r2d(v);
      let tan = Math.tan(v);
      matrix = multiply(matrix, [
        [1, 0, 0],
        [tan, 1, 0],
        [0, 0, 1]
      ]);
    }
    else if(k === 'skewY') {
      v = util.r2d(v);
      let tan = Math.tan(v);
      matrix = multiply(matrix, [
        [1, tan, 0],
        [0, 1, 0],
        [0, 0, 1]
      ]);
    }
    else if(k === 'rotate') {
      v = util.r2d(v);
      deg += v;
      let sin = Math.sin(v);
      let cos = Math.cos(v);
      matrix = multiply(matrix, [
        [1, 0, 0],
        [0, 1, 0],
        [-ox, -oy, 1]
      ]);
      matrix = multiply(matrix, [
        [cos, sin, 0],
        [-sin, cos, 0],
        [0, 0, 1]
      ]);
      matrix = multiply(matrix, [
        [1, 0, 0],
        [0, 1, 0],
        [ox, oy, 1]
      ]);
      // matrix = multiply(matrix, [
      //   [cos, sin, 0],
      //   [-sin, cos, 0],
      //   [-ox * cos + oy * sin + ox, -ox * sin - oy * cos + oy, 1]
      // ]);
    }
  });
  return [
    matrix[0][0], matrix[0][1],
    matrix[1][0], matrix[1][1],
    matrix[2][0], matrix[2][1]];
}

// 矩阵a*b
function multiply(a, b) {
  let res = [];
  let m = a[0].length;
  let p = a.length;
  let n = b.length;
  for(let i = 0; i < m; i++) {
    let col = [];
    for(let j = 0; j < n; j++) {
      let s = 0;
      for(let k = 0; k < p; k++) {
        s += a[i][k] * b[k][j];
      }
      col.push(s);
    }
    res.push(col);
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
  let matrix = multiply(
    [
      [a[0], a[1], 0],
      [a[2], a[3], 0],
      [a[4], a[5], 1]
    ],
    [
      [b[0], b[1], 0],
      [b[2], b[3], 0],
      [b[4], b[5], 1]
    ]
  );
  return [
    matrix[0][0], matrix[0][1],
    matrix[1][0], matrix[1][1],
    matrix[2][0], matrix[2][1]];
}

export default {
  calMatrix,
  pointInQuadrilateral,
  normalize,
  getOrigin,
  mergeMatrix,
};
