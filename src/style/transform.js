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
const { PX, PERCENT, REM, VW, VH, VMAX, VMIN } = unit;
const { matrix, geom } = math;
const { identity, multiply, multiplyTfo, tfoMultiply, isE,
  multiplyTranslateX, multiplyTranslateY, multiplyTranslateZ,
  multiplyRotateX, multiplyRotateY, multiplyRotateZ,
  multiplySkewX, multiplySkewY, multiplyPerspective,
  multiplyScaleX, multiplyScaleY, multiplyScaleZ } = matrix;
const { d2r } = geom;

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
    calRotateX(t, v);
  }
  else if(k === ROTATE_Y) {
    calRotateY(t, v);
  }
  else if(k === ROTATE_Z) {
    calRotateZ(t, v);
  }
  else if(k === ROTATE_3D) {
    calRotate3d(t, [v[0], v[1], v[2], v[3].v]);
  }
  else if(k === PERSPECTIVE && v > 0) {
    v = Math.max(v, 1);
    t[11] = -1 / v;
  }
  else if(k === MATRIX) {
    util.assignMatrix(t, v);
  }
}

function calRotateX(t, v) {
  v = d2r(v);
  let sin = Math.sin(v);
  let cos = Math.cos(v);
  t[5] = t[10] = cos;
  t[6] = sin;
  t[9] = -sin;
  return t;
}

function calRotateY(t, v) {
  v = d2r(v);
  let sin = Math.sin(v);
  let cos = Math.cos(v);
  t[0] = t[10] = cos;
  t[8] = sin;
  t[2] = -sin;
  return t;
}

function calRotateZ(t, v) {
  v = d2r(v);
  let sin = Math.sin(v);
  let cos = Math.cos(v);
  t[0] = t[5] = cos;
  t[1] = sin;
  t[4] = -sin;
  return t;
}

function calRotate3d(t, v) {
  let [x, y, z, r] = v;
  r = d2r(r);
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
  return t;
}

function calMatrix(transform, ow, oh, root) {
  let m = identity();
  for(let i = 0, len = transform.length; i < len; i++) {
    let item = transform[i];
    let k = item.k;
    let v = calSingleValue(k, item.v, ow, oh, root);
    if(k === TRANSLATE_X) {
      m = multiplyTranslateX(m, v);
    }
    else if(k === TRANSLATE_Y) {
      m = multiplyTranslateY(m, v);
    }
    else if(k === TRANSLATE_Z) {
      m = multiplyTranslateZ(m, v);
    }
    else if(k === ROTATE_X) {
      m = multiplyRotateX(m, d2r(v));
    }
    else if(k === ROTATE_Y) {
      m = multiplyRotateY(m, d2r(v));
    }
    else if(k === ROTATE_Z) {
      m = multiplyRotateZ(m, d2r(v));
    }
    else if(k === SKEW_X) {
      m = multiplySkewX(m, d2r(v));
    }
    else if(k === SKEW_Y) {
      m = multiplySkewY(m, d2r(v));
    }
    else if(k === SCALE_X) {
      m = multiplyScaleX(m, v);
    }
    else if(k === SCALE_Y) {
      m = multiplyScaleY(m, v);
    }
    else if(k === SCALE_Z) {
      m = multiplyScaleZ(m, v);
    }
    else if(k === PERSPECTIVE) {
      m = multiplyPerspective(m, v);
    }
    else if(k === ROTATE_3D) {
      let t = identity();
      calRotate3d(t, [v[0], v[1], v[2], v[3].v]);
      m = multiply(m, t);
    }
    else if(k === MATRIX) {
      m = multiply(m, v);
    }
  }
  return m;
}

// 已有计算好的变换矩阵，根据tfo原点计算最终的matrix
function calMatrixByOrigin(m, ox, oy) {
  let res = m.slice(0);
  if(ox === 0 && oy === 0 || isE(m)) {
    return res;
  }
  res = tfoMultiply(ox, oy, res);
  res = multiplyTfo(res, -ox, -oy);
  return res;
}

// img缩放svg下专用，无rem
function calMatrixWithOrigin(transform, ox, oy, ow, oh) {
  let m = calMatrix(transform, ow, oh);
  return calMatrixByOrigin(m, ox, oy);
}

function calSingleValue(k, v, ow, oh, root) {
  if(k === TRANSLATE_X || k === TRANSLATE_Y || k === TRANSLATE_Z) {
    if(v.u === PX) {
      return v.v;
    }
    else if(v.u === PERCENT) {
      return v.v * (k === TRANSLATE_Y ? oh : ow) * 0.01;
    }
    else if(v.u === REM) {
      return v.v * root.__computedStyle[FONT_SIZE];
    }
    else if(v.u === VW) {
      return v.v * root.width * 0.01;
    }
    else if(v.u === VH) {
      return v.v * root.height * 0.01;
    }
    else if(v.u === VMAX) {
      return v.v * Math.max(root.width, root.height) * 0.01;
    }
    else if(v.u === VMIN) {
      return v.v * Math.min(root.width, root.height) * 0.01;
    }
  }
  else if(k === MATRIX) {
    return v;
  }
  else if(k === ROTATE_3D) {
    return v;
  }
  return v.v;
}

function calPerspectiveMatrix(ppt, ox, oy) {
  if(ppt && ppt > 0) {
    let res = identity();
    ppt = Math.max(ppt, 1);
    res[11] = -1 / ppt;
    if(ox || oy) {
      res = tfoMultiply(ox, oy, res);
      res = multiplyTfo(res, -ox, -oy);
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
  calSingleValue,
  calMatrix,
  calRotateX,
  calRotateY,
  calRotateZ,
  calRotate3d,
  calPerspectiveMatrix,
  calMatrixByOrigin,
  calMatrixWithOrigin,
  isPerspectiveMatrix,
};
