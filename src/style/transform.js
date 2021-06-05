import unit from '../style/unit';
import enums from '../util/enums';
import util from '../util/util';
import math from '../math/index';

const { STYLE_KEY: {
  TRANSLATE_X,
  TRANSLATE_Y,
  TRANSLATE_Z,
  SCALE_X,
  SCALE_Y,
  SCALE_Z,
  SKEW_X,
  SKEW_Y,
  ROTATE_X,
  ROTATE_Y,
  ROTATE_Z,
  ROTATE_3D,
  PERSPECTIVE,
  MATRIX,
  FONT_SIZE,
}} = enums;
const { PX, PERCENT, REM, VW, VH } = unit;
const { matrix, geom } = math;
const { identity, calPoint, multiply, isE } = matrix;
const { d2r, pointInPolygon } = geom;
// const HASH_3D = {
//   [TRANSLATE_Z]: true,
//   [SCALE_Z]: true,
//   [ROTATE_X]: true,
//   [ROTATE_Y]: true,
// }

function calSingle(t, k, v) {
  if(k === TRANSLATE_X) {
    t[12] = v;
  }
  else if(k === TRANSLATE_Y) {
    t[13] = v;
  }
  else if(k === TRANSLATE_Z) {
    t[14] = v;
  }
  else if(k === SCALE_X) {
    t[0] = v;
  }
  else if(k === SCALE_Y) {
    t[5] = v;
  }
  else if(k === SCALE_Z) {
    t[10] = v;
  }
  else if(k === SKEW_X) {
    v = d2r(v);
    t[4] = Math.tan(v);
  }
  else if(k === SKEW_Y) {
    v = d2r(v);
    t[5] = Math.tan(v);
  }
  else if(k === ROTATE_X) {
    v = d2r(v);
    let sin = Math.sin(v);
    let cos = Math.cos(v);
    t[5] = t[10] = cos;
    t[6] = sin;
    t[9] = -sin;
  }
  else if(k === ROTATE_Y) {
    v = d2r(v);
    let sin = Math.sin(v);
    let cos = Math.cos(v);
    t[0] = t[10] = cos;
    t[8] = sin;
    t[2] = -sin;
  }
  else if(k === ROTATE_Z) {
    v = d2r(v);
    let sin = Math.sin(v);
    let cos = Math.cos(v);
    t[0] = t[5] = cos;
    t[1] = sin;
    t[4] = -sin;
  }
  else if(k === ROTATE_3D) {
    //
  }
  else if(k === PERSPECTIVE) {
    t[11] = -1 / v;
  }
  else if(k === MATRIX) {
    util.assignMatrix(t, v);
  }
}

function calMatrix(transform, ow, oh, root) {
  let list = normalize(transform, ow, oh, root);
  let m = identity();
  list.forEach(item => {
    let [k, v] = item;
    let t = identity();
    calSingle(t, k, v);
    m = multiply(m, t);
  });
  return m;
}

// 已有计算好的变换矩阵，根据tfo原点计算最终的matrix
function calMatrixByOrigin(m, transformOrigin) {
  let [ox, oy] = transformOrigin;
  let res = m.slice(0);
  if(ox === 0 && oy === 0 || isE(m)) {
    return res;
  }
  res = multiply([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ox, oy, 0, 1], res);
  res = multiply(res, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -ox, -oy, 0, 1]);
  return res;
}

// img缩放svg下专用，无rem
function calMatrixWithOrigin(transform, transformOrigin, ow, oh) {
  let m = calMatrix(transform, ow, oh);
  return calMatrixByOrigin(m, transformOrigin);
}

// 判断点是否在一个4边形内，比如事件发生是否在节点上
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

function normalizeSingle(k, v, ow, oh, root) {
  if(k === TRANSLATE_X) {
    if(v[1] === PERCENT) {
      return v[0] * ow * 0.01;
    }
    else if(v[1] === REM) {
      return v[0] * root.computedStyle[FONT_SIZE];
    }
    else if(v[1] === VW) {
      return v[0] * root.width * 0.01;
    }
    else if(v[1] === VH) {
      return v[0] * root.height * 0.01;
    }
  }
  else if(k === TRANSLATE_Y) {
    if(v[1] === PERCENT) {
      return v[0] * oh * 0.01;
    }
    else if(v[1] === REM) {
      return v[0] * root.computedStyle[FONT_SIZE];
    }
    else if(v[1] === VW) {
      return v[0] * root.width * 0.01;
    }
    else if(v[1] === VH) {
      return v[0] * root.height * 0.01;
    }
  }
  else if(k === MATRIX) {
    return v;
  }
  return v[0];
}

function normalize(transform, ow, oh, root) {
  let res = [];
  transform.forEach(item => {
    let [k, v] = item;
    res.push([k, normalizeSingle(k, v, ow, oh, root)]);
  });
  return res;
}

function calOrigin(transformOrigin, w, h, root) {
  let tfo = [];
  transformOrigin.forEach((item, i) => {
    if(item[1] === PX) {
      tfo.push(item[0]);
    }
    else if(item[1] === PERCENT) {
      tfo.push(item[0] * (i ? h : w) * 0.01);
    }
    else if(item[1] === REM) {
      tfo.push(item[0] * root.computedStyle[FONT_SIZE]);
    }
    else if(item[1] === VW) {
      tfo.push(item[0] * root.width * 0.01);
    }
    else if(item[1] === VH) {
      tfo.push(item[0] * root.height * 0.01);
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
