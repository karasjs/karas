const H = 4 * (Math.sqrt(2) - 1) / 3;

// 向量积
function vectorProduct(x1, y1, x2, y2) {
  return x1 * y2 - x2 * y1;
}

function pointInPolygon(x, y, vertexes) {
  // 先取最大最小值得一个外围矩形，在外边可快速判断false
  let [xmax, ymax] = vertexes[0];
  let [xmin, ymin] = vertexes[0];
  let len = vertexes.length;
  for(let i = 1; i < len; i++) {
    let [x, y] = vertexes[i];
    xmax = Math.max(xmax, x);
    ymax = Math.max(ymax, y);
    xmin = Math.min(xmin, x);
    ymin = Math.min(ymin, y);
  }
  if(x < xmin || y < ymin || x > xmax || y > ymax) {
    return false;
  }
  // 所有向量积均为非负数说明在多边形内或边上
  for(let i = 0, len = vertexes.length; i < len; i++) {
    let [x1, y1] = vertexes[i];
    let [x2, y2] = vertexes[(i + 1) % len];
    if(vectorProduct(x2 - x1, y2 - y1, x - x1, y - y1) < 0) {
      return false;
    }
  }
  return true;
}

function transformPoint(matrix, x, y) {
  let [a, b, c, d, e, f] = matrix;
  return [a * x + c * y + e, b * x + d * y + f];
}

/**
 * 余弦定理3边长求夹角
 * @param a
 * @param b
 * @param c
 */
function angleBySide(a, b, c) {
  let theta = (Math.pow(b, 2) + Math.pow(c, 2) - Math.pow(a, 2)) / (2 * b * c);
  return Math.acos(theta);
}

/**
 * 两点距离
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 */
function pointsDistance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

/**
 * 三角形内心
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 * @param x3
 * @param y3
 */
function triangleIncentre(x1, y1, x2, y2, x3, y3) {
  let a = pointsDistance(x2, y2, x3, y3);
  let b = pointsDistance(x1, y1, x3, y3);
  let c = pointsDistance(x1, y1, x2, y2);
  return [
    (a * x1 + b * x2 + c * x3) / (a + b + c),
    (a * y1 + b * y2 + c * y3) / (a + b + c),
  ];
}

/**
 * 椭圆圆心和长短轴生成4个端点和控制点
 */
function ellipsePoints(x, y, a, b = a) {
  let ox = a * H;
  let oy = b === a ? ox : b * H;
  return [
    [x - a, y],
    [x - a, y - ox, x - ox, y - b, x, y - b],
    [x + ox, y - b, x + a, y - oy, x + a, y],
    [x + a, y + oy, x + ox, y + b, x, y + b],
    [x - ox, y + b, x - a, y + oy, x - a, y]
  ];
}

export default {
  vectorProduct,
  pointInPolygon,
  transformPoint,
  d2r(n) {
    return n * Math.PI / 180;
  },
  r2d(n) {
    return n * 180 / Math.PI;
  },
  // 贝塞尔曲线模拟1/4圆弧比例
  H,
  // <90任意角度贝塞尔曲线拟合圆弧的比例公式
  h(deg) {
    deg *= 0.5;
    return 4 * ((1 - Math.cos(deg)) / Math.sin(deg)) / 3;
  },
  angleBySide,
  pointsDistance,
  triangleIncentre,
  ellipsePoints,
};
