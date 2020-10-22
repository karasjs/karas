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

/**
 * 初等行变换求3*3特定css的matrix方阵，一维6长度
 * @param m
 */
function inverse(m) {
  let [a, b, c, d, e, f] = m;
  if(a === 1 && b === 0 && c === 0 && d === 1 && e === 0 && f === 0) {
    return m;
  }
  let ar = 1;
  let br = 0;
  let cr = 0;
  let dr = 1;
  let er = 0;
  let fr = 0;
  // 先检查a是否为0，强制a为1
  if(a === 0) {
    if(b === 1) {
      [a, b, c, d, e, f, ar, br, cr, dr, er, fr] = [b, a, d, c, f, e, br, ar, dr, cr, fr, er];
    }
    else if(b === 0) {
      return [0, 0, 0, 0, 0, 0];
    }
    // R1 + R2/b
    else {
      a = 1;
      c += c / b;
      e += e / b;
      ar += ar / b;
      cr += cr / b;
      er += er / b;
      b = 0;
    }
  }
  // b/a=x，R2-R1*x，b为0可优化
  if(b !== 0) {
    let x = b / a;
    b = 0;
    d -= c * x;
    f -= e * x;
    br -= ar * x;
    dr -= cr * x;
    fr -= er * x;
  }
  // R1/a，a为0或1可优化
  if(a !== 1) {
    c /= a;
    e /= a;
    ar /= a;
    cr /= a;
    er /= a;
    a = 1;
  }
  // c/d=y，R1-R2*y，c为0可优化
  if(c !== 0) {
    let y = c / d;
    c = 0;
    e -= f * y;
    ar -= br * y;
    cr -= dr * y;
    er -= fr * y;
  }
  // 检查d是否为0，如果为0转成1，R2+1-R1
  if(d === 0) {
    d = 1;
    f += 1 - e;
    br += 1 - ar;
    dr += 1 - cr;
    fr += 1 - er;
  }
  // R2/d，d为1可优化
  else if(d !== 1) {
    f /= d;
    br /= d;
    dr /= d;
    fr /= d;
    d = 1;
  }
  // R1-R3*e，R2-R3*f，e/f为0可优化
  if(e !== 0) {
    er -= e;
    e = 0;
  }
  if(f !== 0) {
    fr -= f;
    f = 0;
  }
  return [ar, br, cr, dr, er, fr];
}

export default {
  identity,
  multiply,
  calPoint,
  int2convolution,
  inverse,
};
