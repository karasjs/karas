import unit from '../style/unit';
import util from '../util';

function calMatrix(transform, ox, oy) {
  let matrix = [1, 0, 0, 1, 0, 0];
  let tx = 0;
  let ty = 0;
  let rd = 0;
  let sdx = 0;
  let sdy = 0;
  let sx = 1;
  let sy = 1;
  let hasRotate;
  transform.forEach(item => {
    let [k, v] = item;
    if(k === 'translateX') {
      tx += v;
      if(hasRotate) {
        ox -= v;
      }
    }
    else if(k === 'translateY') {
      ty += v;
      if(hasRotate) {
        oy -= v;
      }
    }
    else if(k === 'scaleX') {
      sx *= v;
    }
    else if(k === 'scaleY') {
      sy *= v;
    }
    else if(k === 'skewX') {
      sdx += v;
    }
    else if(k === 'skewY') {
      sdy += v;
    }
    else if(k === 'rotate') {
      rd += v;
      hasRotate = true;
    }
  });
  rd = util.r2d(rd);
  sdx = util.r2d(sdx);
  sdy = util.r2d(sdy);
  matrix[0] = sx * Math.cos(rd);
  matrix[1] = sy * Math.sin(rd) + sy * Math.tan(sdy);
  matrix[2] = -sx * Math.sin(rd) + sx * Math.tan(sdx);
  matrix[3] = sy * Math.cos(rd);
  matrix[4] = (-ox * Math.cos(rd) + oy * Math.sin(rd) + ox) * sx + tx + ox - sx * ox;
  matrix[5] = (-ox * Math.sin(rd) - oy * Math.cos(rd) + oy) * sy + ty + oy - sy * oy;
  return matrix;
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
  transform.forEach(item => {
    let [k, v] = item;
    if(k === 'translateX') {
      if(v.unit === unit.PERCENT) {
        item[1] = v.value * w * 0.01;
      }
      else {
        item[1] = v.value;
      }
    }
    else if(k === 'translateY') {
      if(v.unit === unit.PERCENT) {
        item[1] = v.value * h * 0.01;
      }
      else {
        item[1] = v.value;
      }
    }
  });
  return transform;
}

export default {
  calMatrix,
  pointInQuadrilateral,
  normalize,
};
