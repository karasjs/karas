import mx from './matrix';
import vector from './vector';
import enums from '../util/enums';

const H = 4 * (Math.sqrt(2) - 1) / 3;
const { crossProduct } = vector;
const { STYLE_KEY: {
  WIDTH,
  HEIGHT,
  TRANSFORM_ORIGIN,
} } = enums;

function h(deg) {
  deg *= 0.5;
  return 4 * ((1 - Math.cos(deg)) / Math.sin(deg)) / 3;
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
    if(crossProduct(x2 - x1, y2 - y1, x - x1, y - y1) < 0) {
      return false;
    }
  }
  return true;
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
 * 余弦定理2边长和夹角求3边
 * @param alpha 弧度
 * @param a
 * @param b
 */
function sideByAngle(alpha, a, b) {
  let cos = Math.cos(alpha);
  return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2) - 2 * a * b * cos);
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
    [x - a, y - oy, x - ox, y - b, x, y - b],
    [x + ox, y - b, x + a, y - oy, x + a, y],
    [x + a, y + oy, x + ox, y + b, x, y + b],
    [x - ox, y + b, x - a, y + oy, x - a, y],
  ];
}

/**
 * 扇形圆心和半径起始角度生成4个端点和控制点
 * 分为4个象限进行拟合，0、1、2、3
 */
function sectorPoints(x, y, r, begin, end) {
  if(begin > end) {
    [begin, end] = [end, begin];
  }
  let list = [];
  let b = Math.floor(begin / 90);
  let e = Math.floor(end / 90);
  // 同象限直接算
  if(b === e || (e - b) === 1 && end % 90 === 0) {
    let h2 = h(d2r(Math.abs(begin - end)));
    let d = h2 * r;
    let c = Math.sqrt(Math.pow(r, 2) + Math.pow(d, 2));
    let alpha = Math.atan(d / r);
    if(b < 90) {
      // 第1个交点
      let rx = Math.sin(d2r(begin)) * r;
      let ry = Math.cos(d2r(begin)) * r;
      let p1 = [x + rx, y - ry];
      // 第1个控制点
      let deg = alpha + d2r(begin);
      rx = Math.sin(deg) * c;
      ry = Math.cos(deg) * c;
      let p2 = [x + rx, y - ry];
      // 第2个交点
      rx = Math.sin(d2r(end)) * r;
      ry = Math.cos(d2r(end)) * r;
      let p4 = [x + rx, y - ry];
      // 第2个控制点
      deg = d2r(end) - alpha;
      rx = Math.sin(deg) * c;
      ry = Math.cos(deg) * c;
      let p3 = [x + rx, y - ry];
      list.push(p1);
      list.push(p2.concat(p3).concat(p4));
      // list.push([x, y]);
    }
    else if(b < 180) {
      // 第1个交点
      let rx = Math.cos(d2r(begin - 90)) * r;
      let ry = Math.sin(d2r(begin - 90)) * r;
      let p1 = [x + rx, y + ry];
      // 第1个控制点
      let deg = alpha + d2r(begin - 90);
      rx = Math.cos(deg) * c;
      ry = Math.sin(deg) * c;
      let p2 = [x + rx, y + ry];
      // 第2个交点
      rx = Math.cos(d2r(end - 90)) * r;
      ry = Math.sin(d2r(end - 90)) * r;
      let p4 = [x + rx, y + ry];
      // 第2个控制点
      deg = d2r(end - 90) - alpha;
      rx = Math.cos(deg) * c;
      ry = Math.sin(deg) * c;
      let p3 = [x + rx, y + ry];
      list.push(p1);
      list.push(p2.concat(p3).concat(p4));
      // list.push([x, y]);
    }
    else if(b < 270) {
      // 第1个交点
      let rx = Math.sin(d2r(begin - 180)) * r;
      let ry = Math.cos(d2r(begin - 180)) * r;
      let p1 = [x - rx, y + ry];
      // 第1个控制点
      let deg = alpha + d2r(begin - 180);
      rx = Math.sin(deg) * c;
      ry = Math.cos(deg) * c;
      let p2 = [x - rx, y + ry];
      // 第2个交点
      rx = Math.sin(d2r(end - 180)) * r;
      ry = Math.cos(d2r(end - 180)) * r;
      let p4 = [x - rx, y + ry];
      // 第2个控制点
      deg = d2r(end - 180) - alpha;
      rx = Math.sin(deg) * c;
      ry = Math.cos(deg) * c;
      let p3 = [x - rx, y + ry];
      list.push(p1);
      list.push(p2.concat(p3).concat(p4));
      // list.push([x, y]);
    }
    else {
      // 第1个交点
      let rx = Math.cos(d2r(begin - 270)) * r;
      let ry = Math.sin(d2r(begin - 270)) * r;
      let p1 = [x - rx, y + ry];
      // 第1个控制点
      let deg = alpha + d2r(begin - 270);
      rx = Math.cos(deg) * c;
      ry = Math.sin(deg) * c;
      let p2 = [x - rx, y + ry];
      // 第2个交点
      rx = Math.cos(d2r(end - 270)) * r;
      ry = Math.sin(d2r(end - 270)) * r;
      let p4 = [x - rx, y + ry];
      // 第2个控制点
      deg = d2r(end - 270) - alpha;
      rx = Math.cos(deg) * c;
      ry = Math.sin(deg) * c;
      let p3 = [x - rx, y + ry];
      list.push(p1);
      list.push(p2.concat(p3).concat(p4));
      // list.push([x, y]);
    }
  }
  // 跨象限循环算
  else {
    let i = b;
    let temp = [];
    for(; i <= e; i++) {
      if(i === 0) {
        let res = sectorPoints(x, y, r, begin, 90);
        temp.push(res);
      }
      else if(i === 1) {
        // 防止90~90这种情况，但如果begin和end都是90时又要显示
        if(b === i || end > 90) {
          let res = sectorPoints(x, y, r, begin < 90 ? 90 : begin, end > 180 ? 180 : end);
          temp.push(res);
        }
      }
      else if(i === 2) {
        // 防止180~180这种情况，但如果begin和end都是90时又要显示
        if(b === i || end > 180) {
          let res = sectorPoints(x, y, r, begin < 180 ? 180 : begin, end > 270 ? 270 : end);
          temp.push(res);
        }
      }
      else if(i === 3) {
        // 防止180~180这种情况，但如果begin和end都是90时又要显示
        if(b === i || end > 270) {
          let res = sectorPoints(x, y, r, begin < 270 ? 270 : begin, end);
          temp.push(res);
        }
      }
    }
    // 去掉重复的首尾扇弧点
    list = temp[0];
    for(let i = 1, len = temp.length; i < len; i++) {
      list.push(temp[i][1]);
    }
  }
  return list;
}

/**
 * 获取2个矩形重叠区域，如不重叠返回null
 * @param a
 * @param b
 */
function getRectsIntersection(a, b) {
  if(!isRectsOverlap(a, b)) {
    return null;
  }
  let [ax1, ay1, ax4, ay4] = a;
  let [bx1, by1, bx4, by4] = b;
  return [
    Math.max(ax1, bx1),
    Math.max(ay1, by1),
    Math.min(ax4, bx4),
    Math.min(ay4, by4),
  ];
}

/**
 * 2个矩形是否重叠
 * @param a
 * @param b
 */
function isRectsOverlap(a, b) {
  let [ax1, ay1, ax4, ay4] = a;
  let [bx1, by1, bx4, by4] = b;
  if(ax1 >= bx4 || ay1 >= by4 || bx1 >= ax4 || by1 >= ay4) {
    return false;
  }
  return true;
}

/**
 * 2个矩形是否包含，a包含b
 * @param a
 * @param b
 */
function isRectsInside(a, b) {
  let [ax1, ay1, ax4, ay4] = a;
  let [bx1, by1, bx4, by4] = b;
  if(ax1 <= bx1 && ay1 <= by1 && ax4 >= bx4 && ay4 >= by4) {
    return true;
  }
  return false;
}

function calCoordsInNode(px, py, node) {
  let { matrix = [1, 0, 0, 1, 0, 0], computedStyle = {} } = node;
  let { [WIDTH]: width, [HEIGHT]: height, [TRANSFORM_ORIGIN]: [ox, oy] = [width * 0.5, height * 0.5] } = computedStyle;
  [px, py] = mx.calPoint([px * width - ox, py * height - oy], matrix);
  return [px + ox, py + oy];
}

function calPercentInNode(x, y, node) {
  let { computedStyle: { [WIDTH]: width, [HEIGHT]: height, [TRANSFORM_ORIGIN]: [ox, oy] } } = node;
  // 先求无旋转时右下角相对于原点的角度ds
  let ds = Math.atan((height - oy) / (width - ox));
  let [x1, y1] = calCoordsInNode(1, 1, node);
  let d1;
  let deg;
  // 根据旋转后的坐标，分4个象限，求旋转后的右下角相对于原点的角度d1，得出偏移角度deg，分顺逆时针[-180, 180]
  if(x1 >= ox && y1 >= oy) {
    if(ox === x1) {
      d1 = -Math.atan(Infinity);
    }
    else {
      d1 = Math.atan((y1 - oy) / (x1 - ox));
    }
    deg = d1 - ds;
  }
  else if(x1 >= ox && y1 < oy) {
    if(ox === x1) {
      d1 = -Math.atan(Infinity);
    }
    else {
      d1 = Math.atan((oy - y1) / (x1 - ox));
    }
    deg = d1 + ds;
  }
  else if(x1 < ox && y1 >= oy) {
    d1 = Math.atan((y1 - oy) / (ox - x1));
    deg = d1 - ds;
  }
  else if(x1 < ox && y1 < oy) {
    d1 = Math.atan((y1 - oy) / (x1 - ox));
    if(ds >= d1) {
      deg = d1 + Math.PI - ds;
    }
    else {
      deg = Math.PI - d1 + ds;
      deg = -deg;
    }
  }
  else {
    deg = 0;
  }
  // 目标点到原点的边长不会变
  let dt = Math.sqrt(Math.pow(x - ox, 2) + Math.pow(y - oy, 2));
  // 分4个象限，先求目标点到原点的角度d2，再偏移deg后求得原始坐标
  let d2;
  if(x >= ox && y >= oy) {
    if(ox === x) {
      d2 = -Math.atan(Infinity);
    }
    else {
      d2 = Math.atan((y - oy) / (x - ox));
    }
  }
  else if(x >= ox && y < oy) {
    if(ox === x) {
      d2 = -Math.atan(Infinity);
    }
    else {
      d2 = -Math.atan((y - oy) / (ox - x));
    }
  }
  else if(x < ox && y >= oy) {
    d2 = Math.PI - Math.atan((y - oy) / (ox - x));
  }
  else {
    d2 = Math.atan((y - oy) / (x - ox)) - Math.PI;
  }
  d2 -= deg;
  if(d2 > Math.PI) {
    d2 -= Math.PI;
    return [
      (ox - dt * Math.cos(d2)) / width,
      (oy - dt * Math.sin(d2)) / height,
    ];
  }
  if(d2 > Math.PI * 0.5) {
    d2 = Math.PI - d2;
    return [
      (ox - dt * Math.cos(d2)) / width,
      (oy + dt * Math.sin(d2)) / height,
    ];
  }
  if(d2 >= 0) {
    return [
      (ox + dt * Math.cos(d2)) / width,
      (oy + dt * Math.sin(d2)) / height,
    ];
  }
  if(d2 >= -Math.PI * 0.5) {
    d2 = -d2;
    return [
      (ox + dt * Math.cos(d2)) / width,
      (oy - dt * Math.sin(d2)) / height,
    ];
  }
  if(d2 >= -Math.PI) {
    d2 = Math.PI + d2;
    return [
      (ox - dt * Math.cos(d2)) / width,
      (oy - dt * Math.sin(d2)) / height,
    ];
  }
  d2 = -Math.PI - d2;
  return [
    (ox - dt * Math.cos(d2)) / width,
    (oy + dt * Math.sin(d2)) / height,
  ];
}

function d2r(n) {
  return n * Math.PI / 180;
}

function r2d(n) {
  return n * 180 / Math.PI;
}

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
    let ty = (y0 - y1) / (y0 - 2 * y1 + y2);
    let sx = 1 - tx;
    let sy = 1 - ty;
    let qx = sx * sx * x0 + 2 * sx * tx * x1 + tx * tx * x2;
    let qy = sy * sy * y0 + 2 * sy * ty * y1 + ty * ty * y2;
    minX = Math.min(minX, qx);
    minY = Math.min(minY, qy);
    maxX = Math.min(maxX, qx);
    maxY = Math.min(maxY, qy);
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
 * @param order 阶次， 2 和 3
 * @param startT 计算长度的起点，满足 0 <= startT <= endT <= 1
 * @param endT 计算长度的终点
 * @return {*} number
 */
function bezierLength(points, order, startT = 0, endT = 1) {
  let derivativeFunc = t => norm(at(t, points, order));
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
  else {
    // 3阶导数就是常数了，大于3阶的都是0
    x = 0;
    y = 0;
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
  else {
    x = 0;
    y = 0;
  }
  return [x, y];
}

function at(t, points, bezierOrder, derivativeOrder = 1) {
  if(bezierOrder === 2) {
    return at2(t, points, derivativeOrder);
  }
  else if(bezierOrder === 3) {
    return at3(t, points, derivativeOrder);
  }
}

function pointAtBezier(points, order, percent, maxIteration, eps) {
  let length = bezierLength(points, order, 0, 1);
  return pointAtBezierWithLength(points, order, length, percent, maxIteration, eps);
}

function pointAtBezierWithLength(points, order, length, percent = 1, maxIteration = 20, eps = 0.001) {
  let derivativeFunc = t => norm(at(t, points, order));
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
    let derivative1 = norm(at(approachT, points, order, 1)); // 1 阶导数
    let derivative2 = norm(at(approachT, points, order, 2)); // 2 阶导数
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
  return at(approachT, points, order, 0);
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

function pointOnCircle(x, y, r, deg) {
  if(deg >= 270) {
    deg -= 270;
    deg = d2r(deg);
    return [
      x - Math.cos(deg) * r,
      y - Math.sin(deg) * r,
    ];
  }
  else if(deg >= 180) {
    deg -= 180;
    deg = d2r(deg);
    return [
      x - Math.sin(deg) * r,
      y + Math.cos(deg) * r,
    ];
  }
  else if(deg >= 90) {
    deg -= 90;
    deg = d2r(deg);
    return [
      x + Math.cos(deg) * r,
      y + Math.sin(deg) * r,
    ];
  }
  else {
    deg = d2r(deg);
    return [
      x + Math.sin(deg) * r,
      y - Math.cos(deg) * r,
    ];
  }
}

export default {
  pointInPolygon,
  d2r,
  r2d,
  // 贝塞尔曲线模拟1/4圆弧比例
  H,
  // <90任意角度贝塞尔曲线拟合圆弧的比例公式
  h,
  angleBySide,
  sideByAngle,
  pointsDistance,
  triangleIncentre,
  ellipsePoints,
  sectorPoints,
  getRectsIntersection,
  isRectsOverlap,
  isRectsInside,
  calCoordsInNode,
  calPercentInNode,
  bboxBezier,
  bezierLength,
  pointAtBezier,
  pointAtBezierWithLength,
  sliceBezier,
  sliceBezier2Both,
  pointOnCircle,
};
