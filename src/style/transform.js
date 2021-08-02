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
    t[1] = Math.tan(v);
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
    let [x, y, z, r] = v;
    r = d2r(r[0]);
    let s = Math.sin(r);
    let c = Math.cos(r);
    if(x && !y && !z) {
      if(x < 0) {
        s = -s;
      }
      t[5] = c;
      t[9] = -s;
      t[6] = s;
      t[10] = c;
    }
    else if(y && !x && !z) {
      if(y < 0) {
        s = -s;
      }
      t[0] = c;
      t[8] = s;
      t[2] = -s;
      t[10] = c;
    }
    else if(z && !x && !y) {
      if(z < 0) {
        s = -s;
      }
      t[0] = c;
      t[4] = -s;
      t[1] = s;
      t[5] = c;
    }
    else {
      let len = Math.sqrt(x * x + y * y + z * z);
      if(len !== 1) {
        let rlen = 1 / len;
        x *= rlen;
        y *= rlen;
        z *= rlen;
      }
      let nc = 1 - c;
      let xy = x * y;
      let yz = y * z;
      let zx = z * x;
      let xs = x * s;
      let ys = y * s;
      let zs = z * s;

      t[0] = x * x * nc + c;
      t[1] = xy * nc + zs;
      t[2] = zx * nc - ys;
      t[3] = 0;

      t[4] = xy * nc - zs;
      t[5] = y * y * nc + c;
      t[6] = yz * nc + xs;
      t[7] = 0;

      t[8] = zx * nc + ys;
      t[9] = yz * nc - xs;
      t[10] = z * z * nc + c;
      t[11] = 0;

      t[12] = 0;
      t[13] = 0;
      t[14] = 0;
      t[15] = 1;
    }
  }
  else if(k === PERSPECTIVE && v > 0) {
    v = Math.max(v, 1);
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

function normalizeSingle(k, v, ow, oh, root) {
  if(k === TRANSLATE_X || k === TRANSLATE_Z) {
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
  else if(k === ROTATE_3D) {
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

function calMatrixByPerspective(m, pm) {
  if(!isE(pm)) {
    m = multiply(pm, m);
  }
  return m;
}

function calPerspectiveMatrix(ppt, po) {
  if(ppt && ppt > 0) {
    let res = identity();
    ppt = Math.max(ppt, 1);
    res[11] = -1 / ppt;
    let [ox, oy] = po;
    if(ox || oy) {
      res = multiply([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ox, oy, 0, 1], res);
      res = multiply(res, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -ox, -oy, 0, 1]);
    }
    return res;
  }
}

// 是否有透视矩阵应用
function isPerspectiveMatrix(m) {
  if(!m) {
    return;
  }
  return !!(m[3] || m[7] || m[11]);
}

export default {
  calMatrix,
  calOrigin,
  calMatrixByPerspective,
  calPerspectiveMatrix,
  calMatrixByOrigin,
  calMatrixWithOrigin,
  isPerspectiveMatrix,
};
