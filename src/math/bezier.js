
/**
 * 二阶贝塞尔曲线范围框
 * @param x0
 * @param y0
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 * @returns {number[]}
 * https://www.iquilezles.org/www/articles/bezierbbox/bezierbbox.htm
 */
function bboxBezier2(x0, y0, x1, y1, x2, y2) {
  let minX = Math.min(x0, x2);
  let minY = Math.min(y0, y2);
  let maxX = Math.max(x0, x2);
  let maxY = Math.max(y0, y2);
  // 控制点位于边界内部时，边界就是范围框，否则计算导数获取极值
  if(x1 < minX || y1 < minY || x1 > maxX || y1 > maxY) {
    let tx = (x0 - x1) / (x0 - 2 * x1 + x2);
    if(tx < 0) {
      tx = 0;
    }
    else if(tx > 1) {
      tx = 1;
    }
    let ty = (y0 - y1) / (y0 - 2 * y1 + y2);
    if(ty < 0) {
      ty = 0;
    }
    else if(ty > 1) {
      ty = 1;
    }
    let sx = 1 - tx;
    let sy = 1 - ty;
    let qx = sx * sx * x0 + 2 * sx * tx * x1 + tx * tx * x2;
    let qy = sy * sy * y0 + 2 * sy * ty * y1 + ty * ty * y2;
    minX = Math.min(minX, qx);
    minY = Math.min(minY, qy);
    maxX = Math.max(maxX, qx);
    maxY = Math.max(maxY, qy);
  }
  return [minX, minY, maxX, maxY];
}

/**
 * 同上三阶的
 */
function bboxBezier3(x0, y0, x1, y1, x2, y2, x3, y3) {
  let minX = Math.min(x0, x3);
  let minY = Math.min(y0, y3);
  let maxX = Math.max(x0, x3);
  let maxY = Math.max(y0, y3);
  if(x1 < minX || y1 < minY || x1 > maxX || y1 > maxY || x2 < minX || y2 < minY || x2 > maxX || y2 > maxY) {
    let cx = -x0 + x1;
    let cy = -y0 + y1;
    let bx = x0 - 2 * x1 + x2;
    let by = y0 - 2 * y1 + y2;
    let ax = -x0 + 3 * x1 - 3 * x2 + x3;
    let ay = -y0 + 3 * y1 - 3 * y2 + y3;
    let hx = bx * bx - ax * cx;
    let hy = by * by - ay * cy;
    if(hx > 0) {
      hx = Math.sqrt(hx);
      let t = (-bx - hx) / ax;
      if(t > 0 && t < 1) {
        let s = 1 - t;
        let q = s * s * s * x0 + 3 * s * s * t * x1 + 3 * s * t * t * x2 + t * t * t * x3;
        minX = Math.min(minX, q);
        maxX = Math.max(maxX, q);
      }
      t = (-bx + hx) / ax;
      if(t > 0 && t < 1) {
        let s = 1 - t;
        let q = s * s * s * x0 + 3 * s * s * t * x1 + 3 * s * t * t * x2 + t * t * t * x3;
        minX = Math.min(minX, q);
        maxX = Math.max(maxX, q);
      }
    }
    if(hy > 0) {
      hy = Math.sqrt(hy);
      let t = (-by - hy) / ay;
      if(t > 0 && t < 1) {
        let s = 1 - t;
        let q = s * s * s * y0 + 3 * s * s * t * y1 + 3 * s * t * t * y2 + t * t * t * y3;
        minY = Math.min(minY, q);
        maxY = Math.max(maxY, q);
      }
      t = (-by + hy) / ay;
      if(t > 0 && t < 1) {
        let s = 1 - t;
        let q = s * s * s * y0 + 3 * s * s * t * y1 + 3 * s * t * t * y2 + t * t * t * y3;
        minY = Math.min(minY, q);
        maxY = Math.max(maxY, q);
      }
    }
  }
  return [minX, minY, maxX, maxY];
}

function bboxBezier(x0, y0, x1, y1, x2, y2, x3, y3) {
  if(arguments.length === 4) {
    return [x0, y0, x1, y1];
  }
  if(arguments.length === 6) {
    return bboxBezier2(x0, y0, x1, y1, x2, y2);
  }
  if(arguments.length === 8) {
    return bboxBezier3(x0, y0, x1, y1, x2, y2, x3, y3);
  }
}


/**
 * 范数 or 模
 */
function norm(v) {
  let order = v.length;
  let sum = v.reduce((a, b) => Math.pow(a, order) + Math.pow(b, order));
  return Math.pow(sum, 1 / order);
}

// https://zhuanlan.zhihu.com/p/130247362
function simpson38(derivativeFunc, l, r) {
  let f = derivativeFunc;
  let middleL = (2 * l + r) / 3;
  let middleR = (l + 2 * r) / 3;
  return (f(l) + 3 * f(middleL) + 3 * f(middleR) + f(r)) * (r - l) / 8;
}

/**
 * bezier 曲线的长度
 * @param derivativeFunc 微分函数
 * @param l 左点
 * @param r 右点
 * @param eps 精度
 * @return {*} number
 */
function adaptiveSimpson38(derivativeFunc, l, r, eps = 0.001) {
  let f = derivativeFunc;
  let mid = (l + r) / 2;
  let st = simpson38(f, l, r);
  let sl = simpson38(f, l, mid);
  let sr = simpson38(f, mid, r);
  let ans = sl + sr - st;
  if(Math.abs(ans) <= 15 * eps) {
    return sl + sr + ans / 15;
  }
  return adaptiveSimpson38(f, l, mid, eps / 2) + adaptiveSimpson38(f, mid, r, eps / 2);
}

/**
 * bezier 曲线的长度
 * @param points 曲线的起止点 和 控制点
 * @param startT 计算长度的起点，满足 0 <= startT <= endT <= 1
 * @param endT 计算长度的终点
 * @return {*} number
 */
function bezierLength(points, startT = 0, endT = 1) {
  let derivativeFunc = t => norm(at(t, points));
  return adaptiveSimpson38(derivativeFunc, startT, endT);
}

/**
 * 3 阶 bezier 曲线的 order 阶导数在 t 位置时候的 (x, y) 的值
 */
function at3(t, points, order = 1) {
  let [p0, p1, p2, p3] = points;
  let [x0, y0] = p0;
  let [x1, y1] = p1;
  let [x2, y2] = p2;
  let [x3, y3] = p3;
  let x = 0;
  let y = 0;
  // 3阶导数就是常数了，大于3阶的都是0
  if(order === 0) {
    x = Math.pow((1 - t), 3) * x0 + 3 * t * Math.pow((1 - t), 2) * x1 + 3 * (1 - t) * Math.pow(t, 2) * x2 + Math.pow(t, 3) * x3;
    y = Math.pow((1 - t), 3) * y0 + 3 * t * Math.pow((1 - t), 2) * y1 + 3 * (1 - t) * Math.pow(t, 2) * y2 + Math.pow(t, 3) * y3;
  }
  else if(order === 1) {
    x = 3 * ((1 - t) * (1 - t) * (x1 - x0) + 2 * (1 - t) * t * (x2 - x1) + t * t * (x3 - x2));
    y = 3 * ((1 - t) * (1 - t) * (y1 - y0) + 2 * (1 - t) * t * (y2 - y1) + t * t * (y3 - y2));
  }
  else if(order === 2) {
    x = 6 * (x2 - 2 * x1 + x0) * (1 - t) + 6 * (x3 - 2 * x2 + x1) * t;
    y = 6 * (y2 - 2 * y1 + y0) * (1 - t) + 6 * (y3 - 2 * y2 + y1) * t;
  }
  else if(order === 3) {
    x = 6 * (x3 - 3 * x2 + 3 * x1 - x0);
    y = 6 * (y3 - 3 * y2 + 3 * y1 - y0);
  }
  return [x, y];
}

/**
 * 2 阶 bezier 曲线的 order 阶导数在 t 位置时候的 (x, y) 的值
 */
function at2(t, points, order = 1) {
  let [p0, p1, p2] = points;
  let [x0, y0] = p0;
  let [x1, y1] = p1;
  let [x2, y2] = p2;
  let x = 0;
  let y = 0;
  if(order === 0) {
    x = Math.pow((1 - t), 2) * x0 + 2 * t * (1 - t) * x1 + Math.pow(t, 2) * x2;
    y = Math.pow((1 - t), 2) * y0 + 2 * t * (1 - t) * y1 + Math.pow(t, 2) * y2;
  }
  else if(order === 1) {
    x = 2 * (1 - t) * (x1 - x0) + 2 * t * (x2 - x1);
    y = 2 * (1 - t) * (y1 - y0) + 2 * t * (y2 - y1);
  }
  else if(order === 2) {
    x = 2 * (x2 - 2 * x1 + x0);
    y = 2 * (y2 - 2 * y1 + y0);
  }
  return [x, y];
}

function at(t, points, derivativeOrder = 1) {
  if(points.length === 4) {
    return at3(t, points, derivativeOrder);
  }
  else if(points.length === 3) {
    return at2(t, points, derivativeOrder);
  }
}

function pointAtBezier(points, percent, maxIteration, eps) {
  let length = bezierLength(points, 0, 1);
  return pointAtBezierWithLength(points, length, percent, maxIteration, eps);
}

function pointAtBezierWithLength(points, length, percent = 1, maxIteration = 20, eps = 0.001) {
  let derivativeFunc = t => norm(at(t, points));
  let targetLen = length * percent;
  let approachLen = length;
  let approachT = percent;
  let preApproachT = approachT;
  for(let i = 0; i < maxIteration; i++) {
    approachLen = simpson38(derivativeFunc, 0, approachT);
    let d = approachLen - targetLen;
    if(Math.abs(d) < eps) {
      break;
    }
    // Newton 法
    let derivative1 = norm(at(approachT, points, 1)); // 1 阶导数
    let derivative2 = norm(at(approachT, points, 2)); // 2 阶导数
    let numerator = d * derivative1;
    let denominator = d * derivative2 + derivative1 * derivative1;
    approachT = approachT - numerator / denominator;
    if(Math.abs(approachT - preApproachT) < eps) {
      break;
    }
    else {
      preApproachT = approachT;
    }
  }
  return at(approachT, points, 0);
}

function sliceBezier(points, t) {
  let [[x1, y1], [x2, y2], [x3, y3], p4] = points;
  let x12 = (x2 - x1) * t + x1;
  let y12 = (y2 - y1) * t + y1;
  let x23 = (x3 - x2) * t + x2;
  let y23 = (y3 - y2) * t + y2;
  let x123 = (x23 - x12) * t + x12;
  let y123 = (y23 - y12) * t + y12;
  if(points.length === 4) {
    let [x4, y4] = p4;
    let x34 = (x4 - x3) * t + x3;
    let y34 = (y4 - y3) * t + y3;
    let x234 = (x34 - x23) * t + x23;
    let y234 = (y34 - y23) * t + y23;
    let x1234 = (x234 - x123) * t + x123;
    let y1234 = (y234 - y123) * t + y123;
    return [[x1, y1], [x12, y12], [x123, y123], [x1234, y1234]];
  }
  else if(points.length === 3) {
    return [[x1, y1], [x12, y12], [x123, y123]];
  }
}

function sliceBezier2Both(points, start = 0, end = 1) {
  start = Math.max(start, 0);
  end = Math.min(end, 1);
  if(start === 0 && end === 1) {
    return points;
  }
  if(end < 1) {
    points = sliceBezier(points, end);
  }
  if(start > 0) {
    if(end < 1) {
      start = start / end;
    }
    points = sliceBezier(points.reverse(), (1 - start)).reverse();
  }
  return points;
}

function pointAtByT(points, t = 0) {
  if(points.length === 4) {
    return pointAtByT3(points, t);
  }
  else if(points.length === 3) {
    return pointAtByT2(points, t);
  }
}

function pointAtByT2(points, t) {
  let x = points[0][0] * (1 - t) * (1 - t)
    + 2 * points[1][0] * t * (1 - t)
    + points[2][0] * t * t;
  let y = points[0][1] * (1 - t) * (1 - t)
    + 2 * points[1][1] * t * (1 - t)
    + points[2][1] * t * t;
  return [x, y];
}

function pointAtByT3(points, t) {
  let x = points[0][0] * (1 - t) * (1 - t) * (1 - t)
    + 3 * points[1][0] * t * (1 - t) * (1 - t)
    + 3 * points[2][0] * t * t * (1 - t)
    + points[3][0] * t * t * t;
  let y = points[0][1] * (1 - t) * (1 - t) * (1 - t)
    + 3 * points[1][1] * t * (1 - t) * (1 - t)
    + 3 * points[2][1] * t * t * (1 - t)
    + points[3][1] * t * t * t;
  return [x, y];
}

export default {
  bboxBezier,
  bezierLength,
  pointAtBezier,
  pointAtBezierWithLength,
  sliceBezier,
  sliceBezier2Both,
  pointAtByT,
};