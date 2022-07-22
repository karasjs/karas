import mx from './matrix';
import vector from './vector';
import enums from '../util/enums';

const H = 4 * (Math.sqrt(2) - 1) / 3;
const { crossProduct } = vector;
const { calPoint, isE } = mx;
const { STYLE_KEY: {
  WIDTH,
  HEIGHT,
  TRANSFORM_ORIGIN,
} } = enums;

/**
 * 圆弧拟合公式，根据角度求得3阶贝塞尔控制点比例长度，一般<=90，超过拆分
 * @param deg
 * @returns {number}
 */
function h(deg) {
  deg *= 0.5;
  return 4 * ((1 - Math.cos(deg)) / Math.sin(deg)) / 3;
}

/**
 * 判断点是否在多边形内
 * @param x 点坐标
 * @param y
 * @param vertexes 多边形顶点坐标
 * @returns {boolean}
 */
function pointInConvexPolygon(x, y, vertexes) {
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
  let first;
  // 所有向量积均为非负数（逆时针，反过来顺时针是非正）说明在多边形内或边上
  for(let i = 0, len = vertexes.length; i < len; i++) {
    let [x1, y1] = vertexes[i];
    let [x2, y2] = vertexes[(i + 1) % len];
    let n = crossProduct(x2 - x1, y2 - y1, x - x1, y - y1);
    if(n !== 0) {
      n = n > 0 ? 1 : 0;
      // 第一个赋值，后面检查是否正负一致性，不一致是反例就跳出
      if(first === undefined) {
        first = n;
      }
      else if(first ^ n) {
        return false;
      }
    }
  }
  return true;
}

// 判断点是否在一个4边形内，比如事件发生是否在节点上
function pointInQuadrilateral(x, y, x1, y1, x2, y2, x4, y4, x3, y3, matrix) {
  if(matrix && !isE(matrix)) {
    let w1, w2, w3, w4;
    [x1, y1,, w1] = calPoint([x1, y1], matrix);
    [x2, y2,, w2] = calPoint([x2, y2], matrix);
    [x3, y3,, w3] = calPoint([x3, y3], matrix);
    [x4, y4,, w4] = calPoint([x4, y4], matrix);
    if(w1 && w1 !== 1) {
      x1 /= w1;
      y1 /= w1;
    }
    if(w2 && w2 !== 1) {
      x2 /= w2;
      y2 /= w2;
    }
    if(w3 && w3 !== 1) {
      x3 /= w3;
      y3 /= w3;
    }
    if(w4 && w4 !== 1) {
      x4 /= w4;
      y4 /= w4;
    }
    return pointInConvexPolygon(x, y, [
      [x1, y1],
      [x2, y2],
      [x4, y4],
      [x3, y3]
    ]);
  }
  else {
    return x >= x1 && y >= y1 && x <= x4 && y <= y4;
  }
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
  if(begin === end) {
    return [];
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
 */
function isRectsOverlap(a, b, includeIntersect) {
  let [ax1, ay1, ax4, ay4] = a;
  let [bx1, by1, bx4, by4] = b;
  if(includeIntersect) {
    if(ax1 > bx4 || ay1 > by4 || bx1 > ax4 || by1 > ay4) {
      return false;
    }
  }
  else if(ax1 >= bx4 || ay1 >= by4 || bx1 >= ax4 || by1 >= ay4) {
    return false;
  }
  return true;
}

/**
 * 2个矩形是否包含，a包含b
 */
function isRectsInside(a, b, includeIntersect) {
  let [ax1, ay1, ax4, ay4] = a;
  let [bx1, by1, bx4, by4] = b;
  if(includeIntersect) {
    if(ax1 <= bx1 && ay1 <= by1 && ax4 >= bx4 && ay4 >= by4) {
      return true;
    }
  }
  else if(ax1 < bx1 && ay1 < by1 && ax4 > bx4 && ay4 > by4) {
    return true;
  }
  return false;
}

function calCoordsInNode(px, py, node) {
  let { matrix = [1, 0, 0, 1, 0, 0], computedStyle = {} } = node;
  let { [WIDTH]: width, [HEIGHT]: height, [TRANSFORM_ORIGIN]: [ox, oy] = [width * 0.5, height * 0.5] } = computedStyle;
  [px, py] = calPoint([px * width - ox, py * height - oy], matrix);
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
  pointInConvexPolygon,
  pointInQuadrilateral,
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
  pointOnCircle,
};
