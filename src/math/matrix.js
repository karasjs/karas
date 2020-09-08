// 生成3*3单位矩阵，css表达方法一维6位
function identity() {
  return [1, 0, 0, 1, 0, 0];
}

// 矩阵a*b，固定两个matrix都是长度6
function multiply(a, b) {
  // 特殊情况优化
  let isPreIdA = a[0] === 1 && a[1] === 0 && a[2] === 0 && a[3] === 1;
  let isPreIdB = b[0] === 1 && b[1] === 0 && b[2] === 0 && b[3] === 1;
  let isSubIdA = a[4] === 0 && a[5] === 0;
  let isSubIdB = b[4] === 0 && b[5] === 0;
  if(isPreIdA && isSubIdA) {
    return b;
  }
  if(isPreIdB && isSubIdB) {
    return a;
  }
  if(isPreIdA && isPreIdB) {
    a = a.slice(0);
    a[4] += b[4];
    a[5] += b[5];
    return a;
  }
  else if(isPreIdA || isPreIdB) {
    let c = isPreIdA ? b.slice(0) : a.slice(0);
    c[4] = a[0] * b[4] + a[2] * b[5] + a[4];
    c[5] = a[1] * b[4] + a[3] * b[5] + a[5];
    return c;
  }
  let c = [
    a[0] * b[0] + a[2] * b[1],
    a[1] * b[0] + a[3] * b[1],
    a[0] * b[2] + a[2] * b[3],
    a[1] * b[2] + a[3] * b[3],
    0,
    0,
  ];
  if(isSubIdA && isSubIdB) {
  }
  else if(isSubIdB) {
    c[4] = a[4];
    c[5] = a[5];
  }
  else {
    c[4] = a[0] * b[4] + a[2] * b[5] + a[4];
    c[5] = a[1] * b[4] + a[3] * b[5] + a[5];
  }
  return c;
}

function calPoint(point, m) {
  let [x, y] = point;
  let [a, b, c, d, e, f] = m;
  return [a * x + c * y + e, b * x + d * y + f];
}

function int2convolution(v) {
  let d = Math.floor(v * 3 * Math.sqrt(2 * Math.PI) / 4 + 0.5);
  d *= 3;
  if(d % 2 === 0) {
    d++;
  }
  return d;
}

export default {
  identity,
  multiply,
  calPoint,
  int2convolution,
};
