// 生成4*4单位矩阵
function identity() {
  const m = [];
  for (let i = 0; i < 16; i++) {
    m.push(i % 5 === 0 ? 1 : 0);
  }
  return m;
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

function t43(m) {
  return [
    m[0], m[1],
    m[4], m[5],
    m[12], m[13]
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
  t43,
  calPoint,
};
