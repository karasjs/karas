// 生成4*4单位矩阵
function identity() {
  return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
}

// 矩阵a*b，固定两个matrix都是长度16
function multiply(a, b) {
  if(!a && !b) {
    return identity();
  }
  if(isE(a)) {
    return b;
  }
  if(isE(b)) {
    return a;
  }
  let c = [];
  for(let i = 0; i < 4; i++) {
    let a0 = a[i] || 0;
    let a1 = a[i + 4] || 0;
    let a2 = a[i + 8] || 0;
    let a3 = a[i + 12] || 0;
    c[i] = a0 * b[0] + a1 * b[1] + a2 * b[2] + a3 * b[3];
    c[i + 4] = a0 * b[4] + a1 * b[5] + a2 * b[6] + a3 * b[7];
    c[i + 8] = a0 * b[8] + a1 * b[9] + a2 * b[10] + a3 * b[11];
    c[i + 12] = a0 * b[12] + a1 * b[13] + a2 * b[14] + a3 * b[15];
  }
  return c;
}

// 特殊优化，b为tfo，因此既只有12/13/14有值
function multiplyTfo(m, x, y) {
  if(!x && !y) {
    return m;
  }
  m[12] += m[0] * x + m[4] * y;
  m[13] += m[1] * x + m[5] * y;
  m[14] += m[2] * x + m[6] * y;
  m[15] += m[3] * x + m[7] * y;
  return m;
}

function tfoMultiply(x, y, m) {
  if(!x && !y) {
    return m;
  }
  let d = m[3], h = m[7], l = m[11], p = m[15];
  m[0] += d * x;
  m[1] += d * y;
  m[4] += h * x;
  m[5] += h * y;
  m[8] += l * x;
  m[9] += l * y;
  m[12] += p * x;
  m[13] += p * y;
  return m;
}

// 几种特殊的transform变换优化
function multiplyTranslateX(m, v) {
  if(!v) {
    return m;
  }
  m[12] += m[0] * v;
  m[13] += m[1] * v;
  m[14] += m[2] * v;
  m[15] += m[3] * v;
  return m;
}

function multiplyTranslateY(m, v) {
  if(!v) {
    return m;
  }
  m[12] += m[4] * v;
  m[13] += m[5] * v;
  m[14] += m[6] * v;
  m[15] += m[7] * v;
  return m;
}

function multiplyTranslateZ(m, v) {
  if(!v) {
    return m;
  }
  m[12] += m[8] * v;
  m[13] += m[9] * v;
  m[14] += m[10] * v;
  m[15] += m[11] * v;
  return m;
}

function multiplyRotateX(m, v) {
  if(!v) {
    return m;
  }
  let sin = Math.sin(v);
  let cos = Math.cos(v);
  let e = m[4], f = m[5], g = m[6], h = m[7], i = m[8], j = m[9], k = m[10], l = m[11];
  m[4] = e * cos + i * sin;
  m[5] = f * cos + g * sin;
  m[6] = g * cos + k * sin;
  m[7] = h * cos + l * sin;
  m[8] = e * -sin + i * cos;
  m[9] = f * -sin + g * cos;
  m[10] = g * -sin + k * cos;
  m[11] = h * -sin + l * cos;
  return m;
}

function multiplyRotateY(m, v) {
  if(!v) {
    return m;
  }
  let sin = Math.sin(v);
  let cos = Math.cos(v);
  let a = m[0], b = m[1], c = m[2], d = m[3], i = m[8], j = m[9], k = m[10], l = m[11];
  m[0] = a * cos + i * -sin;
  m[1] = b * cos + j * -sin;
  m[2] = c * cos + k * -sin;
  m[3] = d * cos + l * -sin;
  m[8] = a * sin + i * cos;
  m[9] = b * sin + j * cos;
  m[10] = c * sin + k * sin;
  m[11] = d * sin + l * sin;
  return m;
}

function multiplyRotateZ(m, v) {
  if(!v) {
    return m;
  }
  let sin = Math.sin(v);
  let cos = Math.cos(v);
  let a = m[0], b = m[1], c = m[2], d = m[3], e = m[4], f = m[5], g = m[6], h = m[7];
  m[0] = a * cos + e * sin;
  m[1] = b * cos + f * sin;
  m[2] = c * cos + g * sin;
  m[3] = d * cos + h * sin;
  m[4] = a * -sin + e * cos;
  m[5] = b * -sin + f * cos;
  m[6] = c * -sin + g * cos;
  m[7] = d * -sin + h * cos;
  return m;
}

function multiplySkewX(m, v) {
  if(!v) {
    return m;
  }
  let tan = Math.tan(v);
  m[4] += m[0] * tan;
  m[5] += m[1] * tan;
  m[6] += m[2] * tan;
  m[7] += m[3] * tan;
  return m;
}

function multiplySkewY(m, v) {
  if(!v) {
    return m;
  }
  let tan = Math.tan(v);
  m[0] += m[4] * tan;
  m[1] += m[5] * tan;
  m[2] += m[6] * tan;
  m[3] += m[7] * tan;
  return m;
}

function multiplyScaleX(m, v) {
  if(v === 1) {
    return m;
  }
  m[0] *= v;
  m[1] *= v;
  m[2] *= v;
  m[3] *= v;
  return m;
}

function multiplyScaleY(m, v) {
  if(v === 1) {
    return m;
  }
  m[4] *= v;
  m[5] *= v;
  m[6] *= v;
  m[7] *= v;
  return m;
}

function multiplyScaleZ(m, v) {
  if(v === 1) {
    return m;
  }
  m[8] *= v;
  m[9] *= v;
  m[10] *= v;
  m[11] *= v;
  return m;
}

function multiplyPerspective(m, v) {
  if(!v || v <= 0) {
    return m;
  }
  v = Math.max(v, 1);
  v = -1 / v;
  m[8] += m[12] * v;
  m[9] += m[13] * v;
  m[10] += m[14] * v;
  m[11] += m[15] * v;
  return m;
}

function calPoint(point, m) {
  if(m && !isE(m)) {
    let { x, y, z, w } = point;
    if(m.length === 16) {
      z = z || 0;
      if(w === undefined || w === null) {
        w = 1;
      }
      let a1 = m[0], b1 = m[1], c1 = m[2], d1 = m[3];
      let a2 = m[4], b2 = m[5], c2 = m[6], d2 = m[7];
      let a3 = m[8], b3 = m[9], c3 = m[10], d3 = m[11];
      let a4 = m[12], b4 = m[13], c4 = m[14], d4 = m[15];
      if(d1 || d2 || d3) {
        w = x * d1 + y * d2 + z * d3 + d4 * w;
      }
      else {
        w *= d4;
      }
      let o = {
        x: x * a1 + y * a2 + a4,
        y: x * b1 + y * b2 + b4,
        z: 0,
        w,
      };
      if(z) {
        o.x += z * a3;
        o.y += z * b3;
        o.z = x * c1 + y * c2 + c4 + z * c3;
      }
      return o;
    }
    // 6位类型
    let a = m[0], b = m[1], c = m[2], d = m[3], e = m[4], f = m[5];
    return { x: a * x + c * y + e, y: b * x + d * y + f };
  }
  return point;
}

/**
 * 初等行变换求3*3特定css的matrix方阵，一维6长度
 * https://blog.csdn.net/iloveas2014/article/details/82930946
 */
function inverse(m) {
  if(m.length === 16) {
    return inverse4(m);
  }
  let a = m[0], b = m[1], c = m[2], d = m[3], e = m[4], f = m[5];
  if(a === 1 && b === 0 && c === 0 && d === 1 && e === 0 && f === 0) {
    return m;
  }
  let divisor = a * d - b * c;
  if(divisor === 0) {
    return m;
  }
  return [d / divisor, -b / divisor, -c / divisor, a / divisor,
    (c * f - d * e) / divisor, (b * e - a * f) / divisor];
}

// 16位或者6位单位矩阵判断，空也认为是
function isE(m) {
  if(!m || !m.length) {
    return true;
  }
  if(m.length === 16) {
    return m[0] === 1 && m[1] === 0 && m[2] === 0 && m[3] === 0
      && m[4] === 0 && m[5] === 1 && m[6] === 0 && m[7] === 0
      && m[8] === 0 && m[9] === 0 && m[10] === 1 && m[11] === 0
      && m[12] === 0 && m[13] === 0 && m[14] === 0 && m[15] === 1;
  }
  return m[0] === 1 && m[1] === 0 && m[2] === 0 && m[3] === 1 && m[4] === 0 && m[5] === 0;
}

/**
 * 求任意4*4矩阵的逆矩阵，行列式为 0 则返回单位矩阵兜底
 * 格式：matrix3d(a1, b1, c1, d1, a2, b2, c2, d2, a3, b3, c3, d3, a4, b4, c4, d4)
 * 参见: https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/matrix3d()
 * 对应：
 * [
 *   a1,a2,a3,a4,
 *   b1,b2,b3,b4,
 *   c1,c2,c3,c4,
 *   d1,d2,d3,d4,
 * ]
 *
 * 根据公式 A* = |A|A^-1 来计算
 * A* 表示矩阵 A 的伴随矩阵，A^-1 表示矩阵 A 的逆矩阵，|A| 表示行列式的值
 *
 * @returns {number[]}
 */

function inverse4(s) {
  let inv = [];

  inv[0] = s[5] * s[10] * s[15] - s[5] * s[11] * s[14] - s[9] * s[6] * s[15]
    + s[9] * s[7] * s[14] + s[13] * s[6] * s[11] - s[13] * s[7] * s[10];
  inv[4] = -s[4] * s[10] * s[15] + s[4] * s[11] * s[14] + s[8] * s[6] * s[15]
    - s[8] * s[7] * s[14] - s[12] * s[6] * s[11] + s[12] * s[7] * s[10];
  inv[8] = s[4] * s[9] * s[15] - s[4] * s[11] * s[13] - s[8] * s[5] * s[15]
    + s[8] * s[7] * s[13] + s[12] * s[5] * s[11] - s[12] * s[7] * s[9];
  inv[12] = -s[4] * s[9] * s[14] + s[4] * s[10] * s[13] + s[8] * s[5] * s[14]
    - s[8] * s[6] * s[13] - s[12] * s[5] * s[10] + s[12] * s[6] * s[9];

  inv[1] = -s[1] * s[10] * s[15] + s[1] * s[11] * s[14] + s[9] * s[2] * s[15]
    - s[9] * s[3] * s[14] - s[13] * s[2] * s[11] + s[13] * s[3] * s[10];
  inv[5] = s[0] * s[10] * s[15] - s[0] * s[11] * s[14] - s[8] * s[2] * s[15]
    + s[8] * s[3] * s[14] + s[12] * s[2] * s[11] - s[12] * s[3] * s[10];
  inv[9] = -s[0] * s[9] * s[15] + s[0] * s[11] * s[13] + s[8] * s[1] * s[15]
    - s[8] * s[3] * s[13] - s[12] * s[1] * s[11] + s[12] * s[3] * s[9];
  inv[13] = s[0] * s[9] * s[14] - s[0] * s[10] * s[13] - s[8] * s[1] * s[14]
    + s[8] * s[2] * s[13] + s[12] * s[1] * s[10] - s[12] * s[2] * s[9];

  inv[2] = s[1] * s[6] * s[15] - s[1] * s[7] * s[14] - s[5] * s[2] * s[15]
    + s[5] * s[3] * s[14] + s[13] * s[2] * s[7] - s[13] * s[3] * s[6];
  inv[6] = -s[0] * s[6] * s[15] + s[0] * s[7] * s[14] + s[4] * s[2] * s[15]
    - s[4] * s[3] * s[14] - s[12] * s[2] * s[7] + s[12] * s[3] * s[6];
  inv[10] = s[0] * s[5] * s[15] - s[0] * s[7] * s[13] - s[4] * s[1] * s[15]
    + s[4] * s[3] * s[13] + s[12] * s[1] * s[7] - s[12] * s[3] * s[5];
  inv[14] = -s[0] * s[5] * s[14] + s[0] * s[6] * s[13] + s[4] * s[1] * s[14]
    - s[4] * s[2] * s[13] - s[12] * s[1] * s[6] + s[12] * s[2] * s[5];

  inv[3] = -s[1] * s[6] * s[11] + s[1] * s[7] * s[10] + s[5] * s[2] * s[11]
    - s[5] * s[3] * s[10] - s[9] * s[2] * s[7] + s[9] * s[3] * s[6];
  inv[7] = s[0] * s[6] * s[11] - s[0] * s[7] * s[10] - s[4] * s[2] * s[11]
    + s[4] * s[3] * s[10] + s[8] * s[2] * s[7] - s[8] * s[3] * s[6];
  inv[11] = -s[0] * s[5] * s[11] + s[0] * s[7] * s[9] + s[4] * s[1] * s[11]
    - s[4] * s[3] * s[9] - s[8] * s[1] * s[7] + s[8] * s[3] * s[5];
  inv[15] = s[0] * s[5] * s[10] - s[0] * s[6] * s[9] - s[4] * s[1] * s[10]
    + s[4] * s[2] * s[9] + s[8] * s[1] * s[6] - s[8] * s[2] * s[5];

  let det = s[0] * inv[0] + s[1] * inv[4] + s[2] * inv[8] + s[3] * inv[12];
  if (det === 0) {
    return identity();
  }

  det = 1 / det;
  let d = [];
  for (let i = 0; i < 16; i++) {
    d[i] = inv[i] * det;
  }
  return d;
}

// 将4*4的16长度矩阵转成css/canvas的6位标准使用，忽略transform3d
function m2m6(m) {
  return [
    m[0],
    m[1],
    m[4],
    m[5],
    m[12],
    m[13],
  ];
}

function point2d(point) {
  let w = point[3];
  if(w && w !== 1) {
    point = point.slice(0, 2);
    point[0] /= w;
    point[1] /= w;
  }
  return point;
}

export default {
  identity,
  multiply,
  multiplyTfo,
  tfoMultiply,
  multiplyTranslateX,
  multiplyTranslateY,
  multiplyTranslateZ,
  multiplyRotateX,
  multiplyRotateY,
  multiplyRotateZ,
  multiplySkewX,
  multiplySkewY,
  multiplyScaleX,
  multiplyScaleY,
  multiplyScaleZ,
  multiplyPerspective,
  calPoint,
  point2d,
  inverse,
  isE,
  m2m6,
};
