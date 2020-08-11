// 生成3*3单位矩阵，css表达方法一维6位
function identity() {
  return [1, 0, 0, 1, 0, 0];
}

// 矩阵a*b，固定两个matrix都是长度6
function multiply(a, b) {
  return [
    a[0] * b[0] + a[2] * b[1],
    a[1] * b[0] + a[3] * b[1],
    a[0] * b[2] + a[2] * b[3],
    a[1] * b[2] + a[3] * b[3],
    a[0] * b[4] + a[2] * b[5] + a[4],
    a[1] * b[4] + a[3] * b[5] + a[5]
  ];
}

function calPoint(point, m) {
  let [x, y] = point;
  return [
    m[0] * x + m[2] * y + m[4],
    m[1] * x + m[3] * y + m[5],
  ];
}

export default {
  identity,
  multiply,
  calPoint,
};
