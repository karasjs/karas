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

function calPoint(point, m) {
  let [x, y, z, w] = point;
  if(w === undefined) {
    w = 1;
  }
  if(m && !isE(m)) {
    if(m.length === 16) {
      z = z || 0;
      let [a1, b1, c1, d1, a2, b2, c2, d2, a3, b3, c3, d3, a4, b4, c4, d4] = m;
      w *= x * d1 + y * d2 + z * d3 + d4;
      return [
        (x * a1 + y * a2 + z * a3 + a4),
        (x * b1 + y * b2 + z * b3 + b4),
        (x * c1 + y * c2 + z * c3 + c4),
        w
      ];
    }
    // 6位类型
    let [a, b, c, d, e, f] = m;
    return [a * x + c * y + e, b * x + d * y + f];
  }
  return [x, y, z, w];
}

/**
 * 初等行变换求3*3特定css的matrix方阵，一维6长度
 * https://blog.csdn.net/iloveas2014/article/details/82930946
 * @param m
 * @returns {number[]|*}
 */
function inverse(m) {
  if(m.length === 16) {
    return inverse4(m);
  }
  let [a, b, c, d, e, f] = m;
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
  calPoint,
  point2d,
  inverse,
  isE,
  m2m6,
};
