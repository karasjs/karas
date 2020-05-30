// 向量积
function vectorProduct(x1, y1, x2, y2) {
  return x1 * y2 - x2 * y1;
}

function pointInLine(x, y, x1, y1, x2, y2) {
  if(x === x1 && y === y1 || x === x2 && y === y2) {
    return true;
  }
  // 以x1,y1为圆心，确保y=kx+b中b为0
  if(x1 !== 0 || y1 !== 0) {
    x -= x1;
    y -= y1;
    x2 -= x1;
    y2 -= y2;
  }
  // 求斜率
  let k = y2 / x2;
  // 已知x代入获取y，和参数y对比确保在直线上
  let y0 = k * x;
  if(y !== y0) {
    return false;
  }
  // 在直线上后，判断是否在线段x1,y1/x2,y2内
  if(x2 >= 0) {
    if(y2 >= 0) {
      return x >= 0 && y >= 0 && x <= x2 && y <= y2;
    }
    else {
      return x >= 0 && y < 0 && x <= x2 && y > y2;
    }
  }
  else {
    if(y2 >= 0) {
      return x < 0 && y >= 0 && x > x2 && y <= y2;
    }
    else {
      return x < 0 && y < 0 && x > x2 && y > y2;
    }
  }
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

export default {
  vectorProduct,
  pointInLine,
  pointInPolygon,
  transformPoint,
  d2r(n) {
    return n * Math.PI / 180;
  },
  r2d(n) {
    return n * 180 / Math.PI;
  },
  // 贝塞尔曲线模拟1/4圆弧比例
  H: 4 * (Math.sqrt(2) - 1) / 3,
  // <90任意角度贝塞尔曲线拟合圆弧的比例公式
  h(deg) {
    deg *= 0.5;
    return 4 * ((1 - Math.cos(deg)) / Math.sin(deg)) / 3;
  },
};
