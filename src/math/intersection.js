// 两个三次方程组的数值解.9阶的多项式方程,可以最多有9个实根(两个S形曲线的情况)
// 两个三次方程组无法解析表示，只能数值计算
// 参考：https://mat.polsl.pl/sjpam/zeszyty/z6/Silesian_J_Pure_Appl_Math_v6_i1_str_155-176.pdf
const TOLERANCE = 1e-6;
const ACCURACY = 6;

/**
 * 计算线性方程的根
 * y = ax + b
 * root = -b / a
 * @param {Array<Number>} coefs 系数 [b, a] 本文件代码中的系数数组都是从阶次由低到高排列
 */
function getLinearRoot(coefs) {
  let result = [];
  let a = coefs[1];

  if (a !== 0) {
    result.push(-coefs[0] / a);
  }
  return result;
}

/**
 * 计算二次方程的根，一元二次方程求根公式
 * y = ax^2 + bx + c
 * root = (-b ± sqrt(b^2 - 4ac)) / 2a
 * @param {Array<Number>} coefs 系数，系数 [c, b, a]
 */
function getQuadraticRoots(coefs) {
  let results = [];

  let a = coefs[2];
  let b = coefs[1] / a;
  let c = coefs[0] / a;
  let d = b * b - 4 * c;
  if (d > 0) {
    let e = Math.sqrt(d);
    results.push(0.5 * (-b + e));
    results.push(0.5 * (-b - e));
  } else if (d === 0) {
    // 两个相同的根，只要返回一个
    results.push(0.5 * -b);
  }
  return results;
}

/**
 * 计算一元三次方程的根
 * y = ax^3 + bx^2 + cx + d
 * 求根公式参见: https://baike.baidu.com/item/%E4%B8%80%E5%85%83%E4%B8%89%E6%AC%A1%E6%96%B9%E7%A8%8B%E6%B1%82%E6%A0%B9%E5%85%AC%E5%BC%8F/10721952?fr=aladdin
 * @param {Array<Number>} coefs 系数
 */
function getCubicRoots(coefs) {
  let results = [];

  let c3 = coefs[3];
  let c2 = coefs[2] / c3;
  let c1 = coefs[1] / c3;
  let c0 = coefs[0] / c3;

  let a = (3 * c1 - c2 * c2) / 3;
  let b = (2 * c2 * c2 * c2 - 9 * c1 * c2 + 27 * c0) / 27;
  let offset = c2 / 3;
  let discrim = b * b / 4 + a * a * a / 27;
  let halfB = b / 2;

  if (Math.abs(discrim) <= 1e-6) {
    discrim = 0;
  }

  if (discrim > 0) {
    let e = Math.sqrt(discrim);
    let tmp;
    let root;

    tmp = -halfB + e;
    if (tmp >= 0)
      root = Math.pow(tmp, 1 / 3);
    else
      root = -Math.pow(-tmp, 1 / 3);

    tmp = -halfB - e;
    if (tmp >= 0)
      root += Math.pow(tmp, 1 / 3);
    else
      root -= Math.pow(-tmp, 1 / 3);

    results.push(root - offset);
  } else if (discrim < 0) {
    let distance = Math.sqrt(-a / 3);
    let angle = Math.atan2(Math.sqrt(-discrim), -halfB) / 3;
    let cos = Math.cos(angle);
    let sin = Math.sin(angle);
    let sqrt3 = Math.sqrt(3);

    results.push(2 * distance * cos - offset);
    results.push(-distance * (cos + sqrt3 * sin) - offset);
    results.push(-distance * (cos - sqrt3 * sin) - offset);
  } else {
    let tmp;

    if (halfB >= 0)
      tmp = -Math.pow(halfB, 1 / 3);
    else
      tmp = Math.pow(-halfB, 1 / 3);

    results.push(2 * tmp - offset);
    // really should return next root twice, but we return only one
    results.push(-tmp - offset);
  }


  return results;
}

/**
 * 计算一元四次方程的根
 * 求根公式: https://baike.baidu.com/item/%E4%B8%80%E5%85%83%E4%B8%89%E6%AC%A1%E6%96%B9%E7%A8%8B%E6%B1%82%E6%A0%B9%E5%85%AC%E5%BC%8F/10721952?fr=aladdin
 * @param {Array<Number>} coefs 系数
 */
function getQuarticRoots(coefs) {
  let results = [];

  let c4 = coefs[4];
  let c3 = coefs[3] / c4;
  let c2 = coefs[2] / c4;
  let c1 = coefs[1] / c4;
  let c0 = coefs[0] / c4;

  let resolveRoots = getCubicRoots([ 1, -c2, c3 * c1 - 4 * c0, -c3 * c3 * c0 + 4 * c2 * c0 - c1 * c1 ].reverse());

  let y = resolveRoots[0];
  let discrim = c3 * c3 / 4 - c2 + y;

  if (Math.abs(discrim) <= TOLERANCE) discrim = 0;

  if (discrim > 0) {
    let e = Math.sqrt(discrim);
    let t1 = 3 * c3 * c3 / 4 - e * e - 2 * c2;
    let t2 = (4 * c3 * c2 - 8 * c1 - c3 * c3 * c3) / (4 * e);
    let plus = t1 + t2;
    let minus = t1 - t2;

    if (Math.abs(plus) <= TOLERANCE) plus = 0;
    if (Math.abs(minus) <= TOLERANCE) minus = 0;

    if (plus >= 0) {
      let f = Math.sqrt(plus);

      results.push(-c3 / 4 + (e + f) / 2);
      results.push(-c3 / 4 + (e - f) / 2);
    }
    if (minus >= 0) {
      let f = Math.sqrt(minus);

      results.push(-c3 / 4 + (f - e) / 2);
      results.push(-c3 / 4 - (f + e) / 2);
    }
  } else if (discrim < 0) {
    // no roots
  } else {
    let t2 = y * y - 4 * c0;

    if (t2 >= -TOLERANCE) {
      if (t2 < 0) t2 = 0;

      t2 = 2 * Math.sqrt(t2);
      let t1 = 3 * c3 * c3 / 4 - 2 * c2;
      if (t1 + t2 >= TOLERANCE) {
        let d = Math.sqrt(t1 + t2);

        results.push(-c3 / 4 + d / 2);
        results.push(-c3 / 4 - d / 2);
      }
      if (t1 - t2 >= TOLERANCE) {
        let d = Math.sqrt(t1 - t2);

        results.push(-c3 / 4 + d / 2);
        results.push(-c3 / 4 - d / 2);
      }
    }
  }

  return results;
}

/**
 * 计算方程的根
 * @param {Array<Number>} coefs 系数
 */
function getRoots(coefs) {
  const degree = coefs.length - 1;
  let result = [];
  switch (degree) {
    case 0:
      result = [];
      break;
    case 1:
      result = getLinearRoot(coefs);
      break;
    case 2:
      result = getQuadraticRoots(coefs);
      break;
    case 3:
      result = getCubicRoots(coefs);
      break;
    case 4:
      result = getQuarticRoots(coefs);
  }
  return result;
}

/**
 * 获取求导之后的系数
 * @param coefs
 */
function getDerivativeCoefs(coefs) {
  let derivative = [];
  for (let i = 1; i < coefs.length; i++) {
    derivative.push(i * coefs[i]);
  }
  return derivative;
}

/**
 * 评估函数
 * @param x
 * @param coefs
 * @return {number}
 */
function evaluate(x, coefs) {
  let result = 0;
  for (let i = coefs.length - 1; i >= 0; i--) {
    result = result * x + coefs[i];
  }
  return result;
}

function bisection(min, max, coefs) {
  let minValue = evaluate(min, coefs);
  let maxValue = evaluate(max, coefs);
  let result;
  if (Math.abs(minValue) <= TOLERANCE) {
    result = min;
  } else if (Math.abs(maxValue) <= TOLERANCE) {
    result = max;
  } else if (minValue * maxValue <= 0) {
    let tmp1 = Math.log(max - min);
    let tmp2 = Math.LN10 * ACCURACY;
    let iters = Math.ceil((tmp1 + tmp2) / Math.LN2);
    for (let i = 0; i < iters; i++) {
      result = 0.5 * (min + max);
      let value = evaluate(result, coefs);

      if (Math.abs(value) <= TOLERANCE) {
        break;
      }

      if (value * minValue < 0) {
        max = result;
        maxValue = value;
      } else {
        min = result;
        minValue = value;
      }
    }

  }
  return result;
}

function getRootsInInterval(min, max, coefs) {
  // console.log('getRootsInInterval', coefs);
  let roots = [];
  let root;
  let degree = coefs.length - 1;
  if (degree === 1) {
    root = bisection(min, max, coefs);
    if (root != null) {
      roots.push(root);
    }
  } else {
    let derivativeCoefs = getDerivativeCoefs(coefs);
    let droots = getRootsInInterval(min, max, derivativeCoefs);

    if (droots.length > 0) {
      // find root on [min, droots[0]]
      root = bisection(min, droots[0], coefs);
      if (root != null) {
        roots.push(root);
      }
      // find root on [droots[i],droots[i+1]] for 0 <= i <= count-2
      for (let i = 0; i <= droots.length - 2; i++) {
        root = bisection(droots[i], droots[i + 1], coefs);
        if (root != null) {
          roots.push(root);
        }
      }

      // find root on [droots[count-1],xmax]
      root = bisection(droots[droots.length - 1], max, coefs);
      if (root != null) {
        roots.push(root);
      }
    } else {
      // polynomial is monotone on [min,max], has at most one root
      root = bisection(min, max, coefs);
      if (root != null) {
        roots.push(root);
      }
    }
  }
  return roots;
}

/**
 * 二阶贝塞尔曲线 与 二阶贝塞尔曲线 交点
 * @return {[]}
 */
function intersectBezier2Bezier2(ax1, ay1, ax2, ay2, ax3, ay3, bx1, by1, bx2, by2, bx3, by3) {
  let c12, c11, c10;
  let c22, c21, c20;

  let result = [];

  c12 = {
    x: ax1 - 2 * ax2 + ax3,
    y: ay1 - 2 * ay2 + ay3,
  };

  c11 = {
    x: 2 * ax2 - 2 * ax1,
    y: 2 * ay2 - 2 * ay1,
  };
  c10 = { x: ax1, y: ay1 };
  c22 = {
    x: bx1 - 2 * bx2 + bx3,
    y: by1 - 2 * by2 + by3,
  };
  c21 = {
    x: 2 * bx2 - 2 * bx1,
    y: 2 * by2 - 2 * by1,
  };
  c20 = { x: bx1, y: by1 };

  let coefs;

  if (c12.y === 0) {
    let v0 = c12.x * (c10.y - c20.y);
    let v1 = v0 - c11.x * c11.y;
    let v2 = v0 + v1;
    let v3 = c11.y * c11.y;

    coefs = [
      c12.x * c22.y * c22.y,
      2 * c12.x * c21.y * c22.y,
      c12.x * c21.y * c21.y - c22.x * v3 - c22.y * v0 - c22.y * v1,
      -c21.x * v3 - c21.y * v0 - c21.y * v1,
      (c10.x - c20.x) * v3 + (c10.y - c20.y) * v1
    ].reverse();
  } else {
    let v0 = c12.x * c22.y - c12.y * c22.x;
    let v1 = c12.x * c21.y - c21.x * c12.y;
    let v2 = c11.x * c12.y - c11.y * c12.x;
    let v3 = c10.y - c20.y;
    let v4 = c12.y * (c10.x - c20.x) - c12.x * v3;
    let v5 = -c11.y * v2 + c12.y * v4;
    let v6 = v2 * v2;
    coefs = [
      v0 * v0,
      2 * v0 * v1,
      (-c22.y * v6 + c12.y * v1 * v1 + c12.y * v0 * v4 + v0 * v5) / c12.y,
      (-c21.y * v6 + c12.y * v1 * v4 + v1 * v5) / c12.y,
      (v3 * v6 + v4 * v5) / c12.y
    ].reverse();
  }

  let roots = getRoots(coefs);

  for (let i = 0; i < roots.length; i++) {
    let s = roots[i];

    if (0 <= s && s <= 1) {
      let xRoots = getRoots([ c12.x, c11.x, c10.x - c20.x - s * c21.x - s * s * c22.x ].reverse());

      let yRoots = getRoots([ c12.y, c11.y, c10.y - c20.y - s * c21.y - s * s * c22.y ].reverse());

      if (xRoots.length > 0 && yRoots.length > 0) {
        let TOLERANCE = 1e-4;

        checkRoots:
          for (let j = 0; j < xRoots.length; j++) {
            let xRoot = xRoots[j];

            if (0 <= xRoot && xRoot <= 1) {
              for (let k = 0; k < yRoots.length; k++) {
                if (Math.abs(xRoot - yRoots[k]) < TOLERANCE) {
                  let x = c22.x * s * s + c21.x * s + c20.x;
                  let y = c22.y * s * s + c21.y * s + c20.y;
                  result.push({ x, y });
                  // result.push(c22.multiply(s * s).add(c21.multiply(s).add(c20)));
                  break checkRoots;
                }
              }
            }
          }
      }
    }
  }
  return result;
}

function intersectBezier3Bezier3(ax1, ay1, ax2, ay2, ax3, ay3, ax4, ay4, bx1, by1, bx2, by2, bx3, by3, bx4, by4) {
  let c13, c12, c11, c10; // 三阶系数
  let c23, c22, c21, c20;

  let result = [];

  c13 = {
    x: -ax1 + 3 * ax2 - 3 * ax3 + ax4,
    y: -ay1 + 3 * ay2 - 3 * ay3 + ay4,
  };

  c12 = {
    x: 3 * ax1 - 6 * ax2 + 3 * ax3,
    y: 3 * ay1 - 6 * ay2 + 3 * ay3,
  };

  c11 = {
    x: -3 * ax1 + 3 * ax2,
    y: -3 * ay1 + 3 * ay2,
  };

  c10 = { x: ax1, y: ay1 };

  c23 = {
    x: -bx1 + 3 * bx2 - 3 * bx3 + bx4,
    y: -by1 + 3 * by2 - 3 * by3 + by4,
  };

  c22 = {
    x: 3 * bx1 - 6 * bx2 + 3 * bx3,
    y: 3 * by1 - 6 * by2 + 3 * by3,
  };

  c21 = {
    x: -3 * bx1 + 3 * bx2,
    y: -3 * by1 + 3 * by2,
  };

  c20 = { x: bx1, y: by1 };

  let c10x2 = c10.x * c10.x;
  let c10x3 = c10.x * c10.x * c10.x;
  let c10y2 = c10.y * c10.y;
  let c10y3 = c10.y * c10.y * c10.y;
  let c11x2 = c11.x * c11.x;
  let c11x3 = c11.x * c11.x * c11.x;
  let c11y2 = c11.y * c11.y;
  let c11y3 = c11.y * c11.y * c11.y;
  let c12x2 = c12.x * c12.x;
  let c12x3 = c12.x * c12.x * c12.x;
  let c12y2 = c12.y * c12.y;
  let c12y3 = c12.y * c12.y * c12.y;
  let c13x2 = c13.x * c13.x;
  let c13x3 = c13.x * c13.x * c13.x;
  let c13y2 = c13.y * c13.y;
  let c13y3 = c13.y * c13.y * c13.y;
  let c20x2 = c20.x * c20.x;
  let c20x3 = c20.x * c20.x * c20.x;
  let c20y2 = c20.y * c20.y;
  let c20y3 = c20.y * c20.y * c20.y;
  let c21x2 = c21.x * c21.x;
  let c21x3 = c21.x * c21.x * c21.x;
  let c21y2 = c21.y * c21.y;
  let c22x2 = c22.x * c22.x;
  let c22x3 = c22.x * c22.x * c22.x;
  let c22y2 = c22.y * c22.y;
  let c23x2 = c23.x * c23.x;
  let c23x3 = c23.x * c23.x * c23.x;
  let c23y2 = c23.y * c23.y;
  let c23y3 = c23.y * c23.y * c23.y;

  let coefs = [ -c13x3 * c23y3 + c13y3 * c23x3 - 3 * c13.x * c13y2 * c23x2 * c23.y +
  3 * c13x2 * c13.y * c23.x * c23y2,
    -6 * c13.x * c22.x * c13y2 * c23.x * c23.y + 6 * c13x2 * c13.y * c22.y * c23.x * c23.y + 3 * c22.x * c13y3 * c23x2 -
    3 * c13x3 * c22.y * c23y2 - 3 * c13.x * c13y2 * c22.y * c23x2 + 3 * c13x2 * c22.x * c13.y * c23y2,
    -6 * c21.x * c13.x * c13y2 * c23.x * c23.y - 6 * c13.x * c22.x * c13y2 * c22.y * c23.x + 6 * c13x2 * c22.x * c13.y * c22.y * c23.y +
    3 * c21.x * c13y3 * c23x2 + 3 * c22x2 * c13y3 * c23.x + 3 * c21.x * c13x2 * c13.y * c23y2 - 3 * c13.x * c21.y * c13y2 * c23x2 -
    3 * c13.x * c22x2 * c13y2 * c23.y + c13x2 * c13.y * c23.x * (6 * c21.y * c23.y + 3 * c22y2) + c13x3 * (-c21.y * c23y2 -
      2 * c22y2 * c23.y - c23.y * (2 * c21.y * c23.y + c22y2)),
    c11.x * c12.y * c13.x * c13.y * c23.x * c23.y - c11.y * c12.x * c13.x * c13.y * c23.x * c23.y + 6 * c21.x * c22.x * c13y3 * c23.x +
    3 * c11.x * c12.x * c13.x * c13.y * c23y2 + 6 * c10.x * c13.x * c13y2 * c23.x * c23.y - 3 * c11.x * c12.x * c13y2 * c23.x * c23.y -
    3 * c11.y * c12.y * c13.x * c13.y * c23x2 - 6 * c10.y * c13x2 * c13.y * c23.x * c23.y - 6 * c20.x * c13.x * c13y2 * c23.x * c23.y +
    3 * c11.y * c12.y * c13x2 * c23.x * c23.y - 2 * c12.x * c12y2 * c13.x * c23.x * c23.y - 6 * c21.x * c13.x * c22.x * c13y2 * c23.y -
    6 * c21.x * c13.x * c13y2 * c22.y * c23.x - 6 * c13.x * c21.y * c22.x * c13y2 * c23.x + 6 * c21.x * c13x2 * c13.y * c22.y * c23.y +
    2 * c12x2 * c12.y * c13.y * c23.x * c23.y + c22x3 * c13y3 - 3 * c10.x * c13y3 * c23x2 + 3 * c10.y * c13x3 * c23y2 +
    3 * c20.x * c13y3 * c23x2 + c12y3 * c13.x * c23x2 - c12x3 * c13.y * c23y2 - 3 * c10.x * c13x2 * c13.y * c23y2 +
    3 * c10.y * c13.x * c13y2 * c23x2 - 2 * c11.x * c12.y * c13x2 * c23y2 + c11.x * c12.y * c13y2 * c23x2 - c11.y * c12.x * c13x2 * c23y2 +
    2 * c11.y * c12.x * c13y2 * c23x2 + 3 * c20.x * c13x2 * c13.y * c23y2 - c12.x * c12y2 * c13.y * c23x2 -
    3 * c20.y * c13.x * c13y2 * c23x2 + c12x2 * c12.y * c13.x * c23y2 - 3 * c13.x * c22x2 * c13y2 * c22.y +
    c13x2 * c13.y * c23.x * (6 * c20.y * c23.y + 6 * c21.y * c22.y) + c13x2 * c22.x * c13.y * (6 * c21.y * c23.y + 3 * c22y2) +
    c13x3 * (-2 * c21.y * c22.y * c23.y - c20.y * c23y2 - c22.y * (2 * c21.y * c23.y + c22y2) - c23.y * (2 * c20.y * c23.y + 2 * c21.y * c22.y)),
    6 * c11.x * c12.x * c13.x * c13.y * c22.y * c23.y + c11.x * c12.y * c13.x * c22.x * c13.y * c23.y + c11.x * c12.y * c13.x * c13.y * c22.y * c23.x -
    c11.y * c12.x * c13.x * c22.x * c13.y * c23.y - c11.y * c12.x * c13.x * c13.y * c22.y * c23.x - 6 * c11.y * c12.y * c13.x * c22.x * c13.y * c23.x -
    6 * c10.x * c22.x * c13y3 * c23.x + 6 * c20.x * c22.x * c13y3 * c23.x + 6 * c10.y * c13x3 * c22.y * c23.y + 2 * c12y3 * c13.x * c22.x * c23.x -
    2 * c12x3 * c13.y * c22.y * c23.y + 6 * c10.x * c13.x * c22.x * c13y2 * c23.y + 6 * c10.x * c13.x * c13y2 * c22.y * c23.x +
    6 * c10.y * c13.x * c22.x * c13y2 * c23.x - 3 * c11.x * c12.x * c22.x * c13y2 * c23.y - 3 * c11.x * c12.x * c13y2 * c22.y * c23.x +
    2 * c11.x * c12.y * c22.x * c13y2 * c23.x + 4 * c11.y * c12.x * c22.x * c13y2 * c23.x - 6 * c10.x * c13x2 * c13.y * c22.y * c23.y -
    6 * c10.y * c13x2 * c22.x * c13.y * c23.y - 6 * c10.y * c13x2 * c13.y * c22.y * c23.x - 4 * c11.x * c12.y * c13x2 * c22.y * c23.y -
    6 * c20.x * c13.x * c22.x * c13y2 * c23.y - 6 * c20.x * c13.x * c13y2 * c22.y * c23.x - 2 * c11.y * c12.x * c13x2 * c22.y * c23.y +
    3 * c11.y * c12.y * c13x2 * c22.x * c23.y + 3 * c11.y * c12.y * c13x2 * c22.y * c23.x - 2 * c12.x * c12y2 * c13.x * c22.x * c23.y -
    2 * c12.x * c12y2 * c13.x * c22.y * c23.x - 2 * c12.x * c12y2 * c22.x * c13.y * c23.x - 6 * c20.y * c13.x * c22.x * c13y2 * c23.x -
    6 * c21.x * c13.x * c21.y * c13y2 * c23.x - 6 * c21.x * c13.x * c22.x * c13y2 * c22.y + 6 * c20.x * c13x2 * c13.y * c22.y * c23.y +
    2 * c12x2 * c12.y * c13.x * c22.y * c23.y + 2 * c12x2 * c12.y * c22.x * c13.y * c23.y + 2 * c12x2 * c12.y * c13.y * c22.y * c23.x +
    3 * c21.x * c22x2 * c13y3 + 3 * c21x2 * c13y3 * c23.x - 3 * c13.x * c21.y * c22x2 * c13y2 - 3 * c21x2 * c13.x * c13y2 * c23.y +
    c13x2 * c22.x * c13.y * (6 * c20.y * c23.y + 6 * c21.y * c22.y) + c13x2 * c13.y * c23.x * (6 * c20.y * c22.y + 3 * c21y2) +
    c21.x * c13x2 * c13.y * (6 * c21.y * c23.y + 3 * c22y2) + c13x3 * (-2 * c20.y * c22.y * c23.y - c23.y * (2 * c20.y * c22.y + c21y2) -
      c21.y * (2 * c21.y * c23.y + c22y2) - c22.y * (2 * c20.y * c23.y + 2 * c21.y * c22.y)),
    c11.x * c21.x * c12.y * c13.x * c13.y * c23.y + c11.x * c12.y * c13.x * c21.y * c13.y * c23.x + c11.x * c12.y * c13.x * c22.x * c13.y * c22.y -
    c11.y * c12.x * c21.x * c13.x * c13.y * c23.y - c11.y * c12.x * c13.x * c21.y * c13.y * c23.x - c11.y * c12.x * c13.x * c22.x * c13.y * c22.y -
    6 * c11.y * c21.x * c12.y * c13.x * c13.y * c23.x - 6 * c10.x * c21.x * c13y3 * c23.x + 6 * c20.x * c21.x * c13y3 * c23.x +
    2 * c21.x * c12y3 * c13.x * c23.x + 6 * c10.x * c21.x * c13.x * c13y2 * c23.y + 6 * c10.x * c13.x * c21.y * c13y2 * c23.x +
    6 * c10.x * c13.x * c22.x * c13y2 * c22.y + 6 * c10.y * c21.x * c13.x * c13y2 * c23.x - 3 * c11.x * c12.x * c21.x * c13y2 * c23.y -
    3 * c11.x * c12.x * c21.y * c13y2 * c23.x - 3 * c11.x * c12.x * c22.x * c13y2 * c22.y + 2 * c11.x * c21.x * c12.y * c13y2 * c23.x +
    4 * c11.y * c12.x * c21.x * c13y2 * c23.x - 6 * c10.y * c21.x * c13x2 * c13.y * c23.y - 6 * c10.y * c13x2 * c21.y * c13.y * c23.x -
    6 * c10.y * c13x2 * c22.x * c13.y * c22.y - 6 * c20.x * c21.x * c13.x * c13y2 * c23.y - 6 * c20.x * c13.x * c21.y * c13y2 * c23.x -
    6 * c20.x * c13.x * c22.x * c13y2 * c22.y + 3 * c11.y * c21.x * c12.y * c13x2 * c23.y - 3 * c11.y * c12.y * c13.x * c22x2 * c13.y +
    3 * c11.y * c12.y * c13x2 * c21.y * c23.x + 3 * c11.y * c12.y * c13x2 * c22.x * c22.y - 2 * c12.x * c21.x * c12y2 * c13.x * c23.y -
    2 * c12.x * c21.x * c12y2 * c13.y * c23.x - 2 * c12.x * c12y2 * c13.x * c21.y * c23.x - 2 * c12.x * c12y2 * c13.x * c22.x * c22.y -
    6 * c20.y * c21.x * c13.x * c13y2 * c23.x - 6 * c21.x * c13.x * c21.y * c22.x * c13y2 + 6 * c20.y * c13x2 * c21.y * c13.y * c23.x +
    2 * c12x2 * c21.x * c12.y * c13.y * c23.y + 2 * c12x2 * c12.y * c21.y * c13.y * c23.x + 2 * c12x2 * c12.y * c22.x * c13.y * c22.y -
    3 * c10.x * c22x2 * c13y3 + 3 * c20.x * c22x2 * c13y3 + 3 * c21x2 * c22.x * c13y3 + c12y3 * c13.x * c22x2 +
    3 * c10.y * c13.x * c22x2 * c13y2 + c11.x * c12.y * c22x2 * c13y2 + 2 * c11.y * c12.x * c22x2 * c13y2 -
    c12.x * c12y2 * c22x2 * c13.y - 3 * c20.y * c13.x * c22x2 * c13y2 - 3 * c21x2 * c13.x * c13y2 * c22.y +
    c12x2 * c12.y * c13.x * (2 * c21.y * c23.y + c22y2) + c11.x * c12.x * c13.x * c13.y * (6 * c21.y * c23.y + 3 * c22y2) +
    c21.x * c13x2 * c13.y * (6 * c20.y * c23.y + 6 * c21.y * c22.y) + c12x3 * c13.y * (-2 * c21.y * c23.y - c22y2) +
    c10.y * c13x3 * (6 * c21.y * c23.y + 3 * c22y2) + c11.y * c12.x * c13x2 * (-2 * c21.y * c23.y - c22y2) +
    c11.x * c12.y * c13x2 * (-4 * c21.y * c23.y - 2 * c22y2) + c10.x * c13x2 * c13.y * (-6 * c21.y * c23.y - 3 * c22y2) +
    c13x2 * c22.x * c13.y * (6 * c20.y * c22.y + 3 * c21y2) + c20.x * c13x2 * c13.y * (6 * c21.y * c23.y + 3 * c22y2) +
    c13x3 * (-2 * c20.y * c21.y * c23.y - c22.y * (2 * c20.y * c22.y + c21y2) - c20.y * (2 * c21.y * c23.y + c22y2) -
      c21.y * (2 * c20.y * c23.y + 2 * c21.y * c22.y)),
    -c10.x * c11.x * c12.y * c13.x * c13.y * c23.y + c10.x * c11.y * c12.x * c13.x * c13.y * c23.y + 6 * c10.x * c11.y * c12.y * c13.x * c13.y * c23.x -
    6 * c10.y * c11.x * c12.x * c13.x * c13.y * c23.y - c10.y * c11.x * c12.y * c13.x * c13.y * c23.x + c10.y * c11.y * c12.x * c13.x * c13.y * c23.x +
    c11.x * c11.y * c12.x * c12.y * c13.x * c23.y - c11.x * c11.y * c12.x * c12.y * c13.y * c23.x + c11.x * c20.x * c12.y * c13.x * c13.y * c23.y +
    c11.x * c20.y * c12.y * c13.x * c13.y * c23.x + c11.x * c21.x * c12.y * c13.x * c13.y * c22.y + c11.x * c12.y * c13.x * c21.y * c22.x * c13.y -
    c20.x * c11.y * c12.x * c13.x * c13.y * c23.y - 6 * c20.x * c11.y * c12.y * c13.x * c13.y * c23.x - c11.y * c12.x * c20.y * c13.x * c13.y * c23.x -
    c11.y * c12.x * c21.x * c13.x * c13.y * c22.y - c11.y * c12.x * c13.x * c21.y * c22.x * c13.y - 6 * c11.y * c21.x * c12.y * c13.x * c22.x * c13.y -
    6 * c10.x * c20.x * c13y3 * c23.x - 6 * c10.x * c21.x * c22.x * c13y3 - 2 * c10.x * c12y3 * c13.x * c23.x + 6 * c20.x * c21.x * c22.x * c13y3 +
    2 * c20.x * c12y3 * c13.x * c23.x + 2 * c21.x * c12y3 * c13.x * c22.x + 2 * c10.y * c12x3 * c13.y * c23.y - 6 * c10.x * c10.y * c13.x * c13y2 * c23.x +
    3 * c10.x * c11.x * c12.x * c13y2 * c23.y - 2 * c10.x * c11.x * c12.y * c13y2 * c23.x - 4 * c10.x * c11.y * c12.x * c13y2 * c23.x +
    3 * c10.y * c11.x * c12.x * c13y2 * c23.x + 6 * c10.x * c10.y * c13x2 * c13.y * c23.y + 6 * c10.x * c20.x * c13.x * c13y2 * c23.y -
    3 * c10.x * c11.y * c12.y * c13x2 * c23.y + 2 * c10.x * c12.x * c12y2 * c13.x * c23.y + 2 * c10.x * c12.x * c12y2 * c13.y * c23.x +
    6 * c10.x * c20.y * c13.x * c13y2 * c23.x + 6 * c10.x * c21.x * c13.x * c13y2 * c22.y + 6 * c10.x * c13.x * c21.y * c22.x * c13y2 +
    4 * c10.y * c11.x * c12.y * c13x2 * c23.y + 6 * c10.y * c20.x * c13.x * c13y2 * c23.x + 2 * c10.y * c11.y * c12.x * c13x2 * c23.y -
    3 * c10.y * c11.y * c12.y * c13x2 * c23.x + 2 * c10.y * c12.x * c12y2 * c13.x * c23.x + 6 * c10.y * c21.x * c13.x * c22.x * c13y2 -
    3 * c11.x * c20.x * c12.x * c13y2 * c23.y + 2 * c11.x * c20.x * c12.y * c13y2 * c23.x + c11.x * c11.y * c12y2 * c13.x * c23.x -
    3 * c11.x * c12.x * c20.y * c13y2 * c23.x - 3 * c11.x * c12.x * c21.x * c13y2 * c22.y - 3 * c11.x * c12.x * c21.y * c22.x * c13y2 +
    2 * c11.x * c21.x * c12.y * c22.x * c13y2 + 4 * c20.x * c11.y * c12.x * c13y2 * c23.x + 4 * c11.y * c12.x * c21.x * c22.x * c13y2 -
    2 * c10.x * c12x2 * c12.y * c13.y * c23.y - 6 * c10.y * c20.x * c13x2 * c13.y * c23.y - 6 * c10.y * c20.y * c13x2 * c13.y * c23.x -
    6 * c10.y * c21.x * c13x2 * c13.y * c22.y - 2 * c10.y * c12x2 * c12.y * c13.x * c23.y - 2 * c10.y * c12x2 * c12.y * c13.y * c23.x -
    6 * c10.y * c13x2 * c21.y * c22.x * c13.y - c11.x * c11.y * c12x2 * c13.y * c23.y - 2 * c11.x * c11y2 * c13.x * c13.y * c23.x +
    3 * c20.x * c11.y * c12.y * c13x2 * c23.y - 2 * c20.x * c12.x * c12y2 * c13.x * c23.y - 2 * c20.x * c12.x * c12y2 * c13.y * c23.x -
    6 * c20.x * c20.y * c13.x * c13y2 * c23.x - 6 * c20.x * c21.x * c13.x * c13y2 * c22.y - 6 * c20.x * c13.x * c21.y * c22.x * c13y2 +
    3 * c11.y * c20.y * c12.y * c13x2 * c23.x + 3 * c11.y * c21.x * c12.y * c13x2 * c22.y + 3 * c11.y * c12.y * c13x2 * c21.y * c22.x -
    2 * c12.x * c20.y * c12y2 * c13.x * c23.x - 2 * c12.x * c21.x * c12y2 * c13.x * c22.y - 2 * c12.x * c21.x * c12y2 * c22.x * c13.y -
    2 * c12.x * c12y2 * c13.x * c21.y * c22.x - 6 * c20.y * c21.x * c13.x * c22.x * c13y2 - c11y2 * c12.x * c12.y * c13.x * c23.x +
    2 * c20.x * c12x2 * c12.y * c13.y * c23.y + 6 * c20.y * c13x2 * c21.y * c22.x * c13.y + 2 * c11x2 * c11.y * c13.x * c13.y * c23.y +
    c11x2 * c12.x * c12.y * c13.y * c23.y + 2 * c12x2 * c20.y * c12.y * c13.y * c23.x + 2 * c12x2 * c21.x * c12.y * c13.y * c22.y +
    2 * c12x2 * c12.y * c21.y * c22.x * c13.y + c21x3 * c13y3 + 3 * c10x2 * c13y3 * c23.x - 3 * c10y2 * c13x3 * c23.y +
    3 * c20x2 * c13y3 * c23.x + c11y3 * c13x2 * c23.x - c11x3 * c13y2 * c23.y - c11.x * c11y2 * c13x2 * c23.y +
    c11x2 * c11.y * c13y2 * c23.x - 3 * c10x2 * c13.x * c13y2 * c23.y + 3 * c10y2 * c13x2 * c13.y * c23.x - c11x2 * c12y2 * c13.x * c23.y +
    c11y2 * c12x2 * c13.y * c23.x - 3 * c21x2 * c13.x * c21.y * c13y2 - 3 * c20x2 * c13.x * c13y2 * c23.y + 3 * c20y2 * c13x2 * c13.y * c23.x +
    c11.x * c12.x * c13.x * c13.y * (6 * c20.y * c23.y + 6 * c21.y * c22.y) + c12x3 * c13.y * (-2 * c20.y * c23.y - 2 * c21.y * c22.y) +
    c10.y * c13x3 * (6 * c20.y * c23.y + 6 * c21.y * c22.y) + c11.y * c12.x * c13x2 * (-2 * c20.y * c23.y - 2 * c21.y * c22.y) +
    c12x2 * c12.y * c13.x * (2 * c20.y * c23.y + 2 * c21.y * c22.y) + c11.x * c12.y * c13x2 * (-4 * c20.y * c23.y - 4 * c21.y * c22.y) +
    c10.x * c13x2 * c13.y * (-6 * c20.y * c23.y - 6 * c21.y * c22.y) + c20.x * c13x2 * c13.y * (6 * c20.y * c23.y + 6 * c21.y * c22.y) +
    c21.x * c13x2 * c13.y * (6 * c20.y * c22.y + 3 * c21y2) + c13x3 * (-2 * c20.y * c21.y * c22.y - c20y2 * c23.y -
      c21.y * (2 * c20.y * c22.y + c21y2) - c20.y * (2 * c20.y * c23.y + 2 * c21.y * c22.y)),
    -c10.x * c11.x * c12.y * c13.x * c13.y * c22.y + c10.x * c11.y * c12.x * c13.x * c13.y * c22.y + 6 * c10.x * c11.y * c12.y * c13.x * c22.x * c13.y -
    6 * c10.y * c11.x * c12.x * c13.x * c13.y * c22.y - c10.y * c11.x * c12.y * c13.x * c22.x * c13.y + c10.y * c11.y * c12.x * c13.x * c22.x * c13.y +
    c11.x * c11.y * c12.x * c12.y * c13.x * c22.y - c11.x * c11.y * c12.x * c12.y * c22.x * c13.y + c11.x * c20.x * c12.y * c13.x * c13.y * c22.y +
    c11.x * c20.y * c12.y * c13.x * c22.x * c13.y + c11.x * c21.x * c12.y * c13.x * c21.y * c13.y - c20.x * c11.y * c12.x * c13.x * c13.y * c22.y -
    6 * c20.x * c11.y * c12.y * c13.x * c22.x * c13.y - c11.y * c12.x * c20.y * c13.x * c22.x * c13.y - c11.y * c12.x * c21.x * c13.x * c21.y * c13.y -
    6 * c10.x * c20.x * c22.x * c13y3 - 2 * c10.x * c12y3 * c13.x * c22.x + 2 * c20.x * c12y3 * c13.x * c22.x + 2 * c10.y * c12x3 * c13.y * c22.y -
    6 * c10.x * c10.y * c13.x * c22.x * c13y2 + 3 * c10.x * c11.x * c12.x * c13y2 * c22.y - 2 * c10.x * c11.x * c12.y * c22.x * c13y2 -
    4 * c10.x * c11.y * c12.x * c22.x * c13y2 + 3 * c10.y * c11.x * c12.x * c22.x * c13y2 + 6 * c10.x * c10.y * c13x2 * c13.y * c22.y +
    6 * c10.x * c20.x * c13.x * c13y2 * c22.y - 3 * c10.x * c11.y * c12.y * c13x2 * c22.y + 2 * c10.x * c12.x * c12y2 * c13.x * c22.y +
    2 * c10.x * c12.x * c12y2 * c22.x * c13.y + 6 * c10.x * c20.y * c13.x * c22.x * c13y2 + 6 * c10.x * c21.x * c13.x * c21.y * c13y2 +
    4 * c10.y * c11.x * c12.y * c13x2 * c22.y + 6 * c10.y * c20.x * c13.x * c22.x * c13y2 + 2 * c10.y * c11.y * c12.x * c13x2 * c22.y -
    3 * c10.y * c11.y * c12.y * c13x2 * c22.x + 2 * c10.y * c12.x * c12y2 * c13.x * c22.x - 3 * c11.x * c20.x * c12.x * c13y2 * c22.y +
    2 * c11.x * c20.x * c12.y * c22.x * c13y2 + c11.x * c11.y * c12y2 * c13.x * c22.x - 3 * c11.x * c12.x * c20.y * c22.x * c13y2 -
    3 * c11.x * c12.x * c21.x * c21.y * c13y2 + 4 * c20.x * c11.y * c12.x * c22.x * c13y2 - 2 * c10.x * c12x2 * c12.y * c13.y * c22.y -
    6 * c10.y * c20.x * c13x2 * c13.y * c22.y - 6 * c10.y * c20.y * c13x2 * c22.x * c13.y - 6 * c10.y * c21.x * c13x2 * c21.y * c13.y -
    2 * c10.y * c12x2 * c12.y * c13.x * c22.y - 2 * c10.y * c12x2 * c12.y * c22.x * c13.y - c11.x * c11.y * c12x2 * c13.y * c22.y -
    2 * c11.x * c11y2 * c13.x * c22.x * c13.y + 3 * c20.x * c11.y * c12.y * c13x2 * c22.y - 2 * c20.x * c12.x * c12y2 * c13.x * c22.y -
    2 * c20.x * c12.x * c12y2 * c22.x * c13.y - 6 * c20.x * c20.y * c13.x * c22.x * c13y2 - 6 * c20.x * c21.x * c13.x * c21.y * c13y2 +
    3 * c11.y * c20.y * c12.y * c13x2 * c22.x + 3 * c11.y * c21.x * c12.y * c13x2 * c21.y - 2 * c12.x * c20.y * c12y2 * c13.x * c22.x -
    2 * c12.x * c21.x * c12y2 * c13.x * c21.y - c11y2 * c12.x * c12.y * c13.x * c22.x + 2 * c20.x * c12x2 * c12.y * c13.y * c22.y -
    3 * c11.y * c21x2 * c12.y * c13.x * c13.y + 6 * c20.y * c21.x * c13x2 * c21.y * c13.y + 2 * c11x2 * c11.y * c13.x * c13.y * c22.y +
    c11x2 * c12.x * c12.y * c13.y * c22.y + 2 * c12x2 * c20.y * c12.y * c22.x * c13.y + 2 * c12x2 * c21.x * c12.y * c21.y * c13.y -
    3 * c10.x * c21x2 * c13y3 + 3 * c20.x * c21x2 * c13y3 + 3 * c10x2 * c22.x * c13y3 - 3 * c10y2 * c13x3 * c22.y + 3 * c20x2 * c22.x * c13y3 +
    c21x2 * c12y3 * c13.x + c11y3 * c13x2 * c22.x - c11x3 * c13y2 * c22.y + 3 * c10.y * c21x2 * c13.x * c13y2 -
    c11.x * c11y2 * c13x2 * c22.y + c11.x * c21x2 * c12.y * c13y2 + 2 * c11.y * c12.x * c21x2 * c13y2 + c11x2 * c11.y * c22.x * c13y2 -
    c12.x * c21x2 * c12y2 * c13.y - 3 * c20.y * c21x2 * c13.x * c13y2 - 3 * c10x2 * c13.x * c13y2 * c22.y + 3 * c10y2 * c13x2 * c22.x * c13.y -
    c11x2 * c12y2 * c13.x * c22.y + c11y2 * c12x2 * c22.x * c13.y - 3 * c20x2 * c13.x * c13y2 * c22.y + 3 * c20y2 * c13x2 * c22.x * c13.y +
    c12x2 * c12.y * c13.x * (2 * c20.y * c22.y + c21y2) + c11.x * c12.x * c13.x * c13.y * (6 * c20.y * c22.y + 3 * c21y2) +
    c12x3 * c13.y * (-2 * c20.y * c22.y - c21y2) + c10.y * c13x3 * (6 * c20.y * c22.y + 3 * c21y2) +
    c11.y * c12.x * c13x2 * (-2 * c20.y * c22.y - c21y2) + c11.x * c12.y * c13x2 * (-4 * c20.y * c22.y - 2 * c21y2) +
    c10.x * c13x2 * c13.y * (-6 * c20.y * c22.y - 3 * c21y2) + c20.x * c13x2 * c13.y * (6 * c20.y * c22.y + 3 * c21y2) +
    c13x3 * (-2 * c20.y * c21y2 - c20y2 * c22.y - c20.y * (2 * c20.y * c22.y + c21y2)),
    -c10.x * c11.x * c12.y * c13.x * c21.y * c13.y + c10.x * c11.y * c12.x * c13.x * c21.y * c13.y + 6 * c10.x * c11.y * c21.x * c12.y * c13.x * c13.y -
    6 * c10.y * c11.x * c12.x * c13.x * c21.y * c13.y - c10.y * c11.x * c21.x * c12.y * c13.x * c13.y + c10.y * c11.y * c12.x * c21.x * c13.x * c13.y -
    c11.x * c11.y * c12.x * c21.x * c12.y * c13.y + c11.x * c11.y * c12.x * c12.y * c13.x * c21.y + c11.x * c20.x * c12.y * c13.x * c21.y * c13.y +
    6 * c11.x * c12.x * c20.y * c13.x * c21.y * c13.y + c11.x * c20.y * c21.x * c12.y * c13.x * c13.y - c20.x * c11.y * c12.x * c13.x * c21.y * c13.y -
    6 * c20.x * c11.y * c21.x * c12.y * c13.x * c13.y - c11.y * c12.x * c20.y * c21.x * c13.x * c13.y - 6 * c10.x * c20.x * c21.x * c13y3 -
    2 * c10.x * c21.x * c12y3 * c13.x + 6 * c10.y * c20.y * c13x3 * c21.y + 2 * c20.x * c21.x * c12y3 * c13.x + 2 * c10.y * c12x3 * c21.y * c13.y -
    2 * c12x3 * c20.y * c21.y * c13.y - 6 * c10.x * c10.y * c21.x * c13.x * c13y2 + 3 * c10.x * c11.x * c12.x * c21.y * c13y2 -
    2 * c10.x * c11.x * c21.x * c12.y * c13y2 - 4 * c10.x * c11.y * c12.x * c21.x * c13y2 + 3 * c10.y * c11.x * c12.x * c21.x * c13y2 +
    6 * c10.x * c10.y * c13x2 * c21.y * c13.y + 6 * c10.x * c20.x * c13.x * c21.y * c13y2 - 3 * c10.x * c11.y * c12.y * c13x2 * c21.y +
    2 * c10.x * c12.x * c21.x * c12y2 * c13.y + 2 * c10.x * c12.x * c12y2 * c13.x * c21.y + 6 * c10.x * c20.y * c21.x * c13.x * c13y2 +
    4 * c10.y * c11.x * c12.y * c13x2 * c21.y + 6 * c10.y * c20.x * c21.x * c13.x * c13y2 + 2 * c10.y * c11.y * c12.x * c13x2 * c21.y -
    3 * c10.y * c11.y * c21.x * c12.y * c13x2 + 2 * c10.y * c12.x * c21.x * c12y2 * c13.x - 3 * c11.x * c20.x * c12.x * c21.y * c13y2 +
    2 * c11.x * c20.x * c21.x * c12.y * c13y2 + c11.x * c11.y * c21.x * c12y2 * c13.x - 3 * c11.x * c12.x * c20.y * c21.x * c13y2 +
    4 * c20.x * c11.y * c12.x * c21.x * c13y2 - 6 * c10.x * c20.y * c13x2 * c21.y * c13.y - 2 * c10.x * c12x2 * c12.y * c21.y * c13.y -
    6 * c10.y * c20.x * c13x2 * c21.y * c13.y - 6 * c10.y * c20.y * c21.x * c13x2 * c13.y - 2 * c10.y * c12x2 * c21.x * c12.y * c13.y -
    2 * c10.y * c12x2 * c12.y * c13.x * c21.y - c11.x * c11.y * c12x2 * c21.y * c13.y - 4 * c11.x * c20.y * c12.y * c13x2 * c21.y -
    2 * c11.x * c11y2 * c21.x * c13.x * c13.y + 3 * c20.x * c11.y * c12.y * c13x2 * c21.y - 2 * c20.x * c12.x * c21.x * c12y2 * c13.y -
    2 * c20.x * c12.x * c12y2 * c13.x * c21.y - 6 * c20.x * c20.y * c21.x * c13.x * c13y2 - 2 * c11.y * c12.x * c20.y * c13x2 * c21.y +
    3 * c11.y * c20.y * c21.x * c12.y * c13x2 - 2 * c12.x * c20.y * c21.x * c12y2 * c13.x - c11y2 * c12.x * c21.x * c12.y * c13.x +
    6 * c20.x * c20.y * c13x2 * c21.y * c13.y + 2 * c20.x * c12x2 * c12.y * c21.y * c13.y + 2 * c11x2 * c11.y * c13.x * c21.y * c13.y +
    c11x2 * c12.x * c12.y * c21.y * c13.y + 2 * c12x2 * c20.y * c21.x * c12.y * c13.y + 2 * c12x2 * c20.y * c12.y * c13.x * c21.y +
    3 * c10x2 * c21.x * c13y3 - 3 * c10y2 * c13x3 * c21.y + 3 * c20x2 * c21.x * c13y3 + c11y3 * c21.x * c13x2 - c11x3 * c21.y * c13y2 -
    3 * c20y2 * c13x3 * c21.y - c11.x * c11y2 * c13x2 * c21.y + c11x2 * c11.y * c21.x * c13y2 - 3 * c10x2 * c13.x * c21.y * c13y2 +
    3 * c10y2 * c21.x * c13x2 * c13.y - c11x2 * c12y2 * c13.x * c21.y + c11y2 * c12x2 * c21.x * c13.y - 3 * c20x2 * c13.x * c21.y * c13y2 +
    3 * c20y2 * c21.x * c13x2 * c13.y,
    c10.x * c10.y * c11.x * c12.y * c13.x * c13.y - c10.x * c10.y * c11.y * c12.x * c13.x * c13.y + c10.x * c11.x * c11.y * c12.x * c12.y * c13.y -
    c10.y * c11.x * c11.y * c12.x * c12.y * c13.x - c10.x * c11.x * c20.y * c12.y * c13.x * c13.y + 6 * c10.x * c20.x * c11.y * c12.y * c13.x * c13.y +
    c10.x * c11.y * c12.x * c20.y * c13.x * c13.y - c10.y * c11.x * c20.x * c12.y * c13.x * c13.y - 6 * c10.y * c11.x * c12.x * c20.y * c13.x * c13.y +
    c10.y * c20.x * c11.y * c12.x * c13.x * c13.y - c11.x * c20.x * c11.y * c12.x * c12.y * c13.y + c11.x * c11.y * c12.x * c20.y * c12.y * c13.x +
    c11.x * c20.x * c20.y * c12.y * c13.x * c13.y - c20.x * c11.y * c12.x * c20.y * c13.x * c13.y - 2 * c10.x * c20.x * c12y3 * c13.x +
    2 * c10.y * c12x3 * c20.y * c13.y - 3 * c10.x * c10.y * c11.x * c12.x * c13y2 - 6 * c10.x * c10.y * c20.x * c13.x * c13y2 +
    3 * c10.x * c10.y * c11.y * c12.y * c13x2 - 2 * c10.x * c10.y * c12.x * c12y2 * c13.x - 2 * c10.x * c11.x * c20.x * c12.y * c13y2 -
    c10.x * c11.x * c11.y * c12y2 * c13.x + 3 * c10.x * c11.x * c12.x * c20.y * c13y2 - 4 * c10.x * c20.x * c11.y * c12.x * c13y2 +
    3 * c10.y * c11.x * c20.x * c12.x * c13y2 + 6 * c10.x * c10.y * c20.y * c13x2 * c13.y + 2 * c10.x * c10.y * c12x2 * c12.y * c13.y +
    2 * c10.x * c11.x * c11y2 * c13.x * c13.y + 2 * c10.x * c20.x * c12.x * c12y2 * c13.y + 6 * c10.x * c20.x * c20.y * c13.x * c13y2 -
    3 * c10.x * c11.y * c20.y * c12.y * c13x2 + 2 * c10.x * c12.x * c20.y * c12y2 * c13.x + c10.x * c11y2 * c12.x * c12.y * c13.x +
    c10.y * c11.x * c11.y * c12x2 * c13.y + 4 * c10.y * c11.x * c20.y * c12.y * c13x2 - 3 * c10.y * c20.x * c11.y * c12.y * c13x2 +
    2 * c10.y * c20.x * c12.x * c12y2 * c13.x + 2 * c10.y * c11.y * c12.x * c20.y * c13x2 + c11.x * c20.x * c11.y * c12y2 * c13.x -
    3 * c11.x * c20.x * c12.x * c20.y * c13y2 - 2 * c10.x * c12x2 * c20.y * c12.y * c13.y - 6 * c10.y * c20.x * c20.y * c13x2 * c13.y -
    2 * c10.y * c20.x * c12x2 * c12.y * c13.y - 2 * c10.y * c11x2 * c11.y * c13.x * c13.y - c10.y * c11x2 * c12.x * c12.y * c13.y -
    2 * c10.y * c12x2 * c20.y * c12.y * c13.x - 2 * c11.x * c20.x * c11y2 * c13.x * c13.y - c11.x * c11.y * c12x2 * c20.y * c13.y +
    3 * c20.x * c11.y * c20.y * c12.y * c13x2 - 2 * c20.x * c12.x * c20.y * c12y2 * c13.x - c20.x * c11y2 * c12.x * c12.y * c13.x +
    3 * c10y2 * c11.x * c12.x * c13.x * c13.y + 3 * c11.x * c12.x * c20y2 * c13.x * c13.y + 2 * c20.x * c12x2 * c20.y * c12.y * c13.y -
    3 * c10x2 * c11.y * c12.y * c13.x * c13.y + 2 * c11x2 * c11.y * c20.y * c13.x * c13.y + c11x2 * c12.x * c20.y * c12.y * c13.y -
    3 * c20x2 * c11.y * c12.y * c13.x * c13.y - c10x3 * c13y3 + c10y3 * c13x3 + c20x3 * c13y3 - c20y3 * c13x3 -
    3 * c10.x * c20x2 * c13y3 - c10.x * c11y3 * c13x2 + 3 * c10x2 * c20.x * c13y3 + c10.y * c11x3 * c13y2 +
    3 * c10.y * c20y2 * c13x3 + c20.x * c11y3 * c13x2 + c10x2 * c12y3 * c13.x - 3 * c10y2 * c20.y * c13x3 - c10y2 * c12x3 * c13.y +
    c20x2 * c12y3 * c13.x - c11x3 * c20.y * c13y2 - c12x3 * c20y2 * c13.y - c10.x * c11x2 * c11.y * c13y2 +
    c10.y * c11.x * c11y2 * c13x2 - 3 * c10.x * c10y2 * c13x2 * c13.y - c10.x * c11y2 * c12x2 * c13.y + c10.y * c11x2 * c12y2 * c13.x -
    c11.x * c11y2 * c20.y * c13x2 + 3 * c10x2 * c10.y * c13.x * c13y2 + c10x2 * c11.x * c12.y * c13y2 +
    2 * c10x2 * c11.y * c12.x * c13y2 - 2 * c10y2 * c11.x * c12.y * c13x2 - c10y2 * c11.y * c12.x * c13x2 + c11x2 * c20.x * c11.y * c13y2 -
    3 * c10.x * c20y2 * c13x2 * c13.y + 3 * c10.y * c20x2 * c13.x * c13y2 + c11.x * c20x2 * c12.y * c13y2 - 2 * c11.x * c20y2 * c12.y * c13x2 +
    c20.x * c11y2 * c12x2 * c13.y - c11.y * c12.x * c20y2 * c13x2 - c10x2 * c12.x * c12y2 * c13.y - 3 * c10x2 * c20.y * c13.x * c13y2 +
    3 * c10y2 * c20.x * c13x2 * c13.y + c10y2 * c12x2 * c12.y * c13.x - c11x2 * c20.y * c12y2 * c13.x + 2 * c20x2 * c11.y * c12.x * c13y2 +
    3 * c20.x * c20y2 * c13x2 * c13.y - c20x2 * c12.x * c12y2 * c13.y - 3 * c20x2 * c20.y * c13.x * c13y2 + c12x2 * c20y2 * c12.y * c13.x
  ].reverse();

  let roots = getRootsInInterval(0, 1, coefs);

  // console.log('roots', roots);

  for (let i = 0; i < roots.length; i++) {
    let s = roots[i];
    let xRoots = getRoots([ c13.x, c12.x, c11.x, c10.x - c20.x - s * c21.x - s * s * c22.x - s * s * s * c23.x ].reverse());
    let yRoots = getRoots([ c13.y,
      c12.y,
      c11.y,
      c10.y - c20.y - s * c21.y - s * s * c22.y - s * s * s * c23.y ].reverse());

    //   console.log('xRoots.length', xRoots.length);

    if (xRoots.length > 0 && yRoots.length > 0) {
      let TOLERANCE = 1e-4;

      checkRoots:
        for (let j = 0; j < xRoots.length; j++) {
          let xRoot = xRoots[j];

          if (0 <= xRoot && xRoot <= 1) {
            for (let k = 0; k < yRoots.length; k++) {
              if (Math.abs(xRoot - yRoots[k]) < TOLERANCE) {
                let x = c23.x * s * s * s + c22.x * s * s + c21.x * s + c20.x;
                let y = c23.y * s * s * s + c22.y * s * s + c21.y * s + c20.y;
                result.push({ x, y });
                break checkRoots;
              }
            }
          }
        }
    }
  }
  return result;
}

function intersectBezier2Bezier3(ax1, ay1, ax2, ay2, ax3, ay3, bx1, by1, bx2, by2, bx3, by3, bx4, by4) {
  let c12, c11, c10;
  let c23, c22, c21, c20;
  let result = [];

  c12 = {
    x: ax1 - 2 * ax2 + ax3,
    y: ay1 - 2 * ay2 + ay3,
  };

  c11 = {
    x: 2 * ax2 - 2 * ax1,
    y: 2 * ay2 - 2 * ay1,
  };
  c10 = { x: ax1, y: ay1 };

  c23 = {
    x: -bx1 + 3 * bx2 - 3 * bx3 + bx4,
    y: -by1 + 3 * by2 - 3 * by3 + by4,
  };

  c22 = {
    x: 3 * bx1 - 6 * bx2 + 3 * bx3,
    y: 3 * by1 - 6 * by2 + 3 * by3,
  };

  c21 = {
    x: -3 * bx1 + 3 * bx2,
    y: -3 * by1 + 3 * by2,
  };

  c20 = { x: bx1, y: by1 };

  let c10x2 = c10.x * c10.x;
  let c10y2 = c10.y * c10.y;
  let c11x2 = c11.x * c11.x;
  let c11y2 = c11.y * c11.y;
  let c12x2 = c12.x * c12.x;
  let c12y2 = c12.y * c12.y;
  let c20x2 = c20.x * c20.x;
  let c20y2 = c20.y * c20.y;
  let c21x2 = c21.x * c21.x;
  let c21y2 = c21.y * c21.y;
  let c22x2 = c22.x * c22.x;
  let c22y2 = c22.y * c22.y;
  let c23x2 = c23.x * c23.x;
  let c23y2 = c23.y * c23.y;

  let coefs = [
    -2 * c12.x * c12.y * c23.x * c23.y + c12x2 * c23y2 + c12y2 * c23x2,
    -2 * c12.x * c12.y * c22.x * c23.y - 2 * c12.x * c12.y * c22.y * c23.x + 2 * c12y2 * c22.x * c23.x +
    2 * c12x2 * c22.y * c23.y,
    -2 * c12.x * c21.x * c12.y * c23.y - 2 * c12.x * c12.y * c21.y * c23.x - 2 * c12.x * c12.y * c22.x * c22.y +
    2 * c21.x * c12y2 * c23.x + c12y2 * c22x2 + c12x2 * (2 * c21.y * c23.y + c22y2),
    2 * c10.x * c12.x * c12.y * c23.y + 2 * c10.y * c12.x * c12.y * c23.x + c11.x * c11.y * c12.x * c23.y +
    c11.x * c11.y * c12.y * c23.x - 2 * c20.x * c12.x * c12.y * c23.y - 2 * c12.x * c20.y * c12.y * c23.x -
    2 * c12.x * c21.x * c12.y * c22.y - 2 * c12.x * c12.y * c21.y * c22.x - 2 * c10.x * c12y2 * c23.x -
    2 * c10.y * c12x2 * c23.y + 2 * c20.x * c12y2 * c23.x + 2 * c21.x * c12y2 * c22.x -
    c11y2 * c12.x * c23.x - c11x2 * c12.y * c23.y + c12x2 * (2 * c20.y * c23.y + 2 * c21.y * c22.y),
    2 * c10.x * c12.x * c12.y * c22.y + 2 * c10.y * c12.x * c12.y * c22.x + c11.x * c11.y * c12.x * c22.y +
    c11.x * c11.y * c12.y * c22.x - 2 * c20.x * c12.x * c12.y * c22.y - 2 * c12.x * c20.y * c12.y * c22.x -
    2 * c12.x * c21.x * c12.y * c21.y - 2 * c10.x * c12y2 * c22.x - 2 * c10.y * c12x2 * c22.y +
    2 * c20.x * c12y2 * c22.x - c11y2 * c12.x * c22.x - c11x2 * c12.y * c22.y + c21x2 * c12y2 +
    c12x2 * (2 * c20.y * c22.y + c21y2),
    2 * c10.x * c12.x * c12.y * c21.y + 2 * c10.y * c12.x * c21.x * c12.y + c11.x * c11.y * c12.x * c21.y +
    c11.x * c11.y * c21.x * c12.y - 2 * c20.x * c12.x * c12.y * c21.y - 2 * c12.x * c20.y * c21.x * c12.y -
    2 * c10.x * c21.x * c12y2 - 2 * c10.y * c12x2 * c21.y + 2 * c20.x * c21.x * c12y2 -
    c11y2 * c12.x * c21.x - c11x2 * c12.y * c21.y + 2 * c12x2 * c20.y * c21.y,
    -2 * c10.x * c10.y * c12.x * c12.y - c10.x * c11.x * c11.y * c12.y - c10.y * c11.x * c11.y * c12.x +
    2 * c10.x * c12.x * c20.y * c12.y + 2 * c10.y * c20.x * c12.x * c12.y + c11.x * c20.x * c11.y * c12.y +
    c11.x * c11.y * c12.x * c20.y - 2 * c20.x * c12.x * c20.y * c12.y - 2 * c10.x * c20.x * c12y2 +
    c10.x * c11y2 * c12.x + c10.y * c11x2 * c12.y - 2 * c10.y * c12x2 * c20.y -
    c20.x * c11y2 * c12.x - c11x2 * c20.y * c12.y + c10x2 * c12y2 + c10y2 * c12x2 +
    c20x2 * c12y2 + c12x2 * c20y2 ].reverse();

  let roots = getRootsInInterval(0, 1, coefs);
  // console.log(roots);

  for (let i = 0; i < roots.length; i++) {
    let s = roots[i];
    let xRoots = getRoots([ c12.x,
      c11.x,
      c10.x - c20.x - s * c21.x - s * s * c22.x - s * s * s * c23.x ].reverse());
    let yRoots = getRoots([ c12.y,
      c11.y,
      c10.y - c20.y - s * c21.y - s * s * c22.y - s * s * s * c23.y ].reverse());
    //
    // console.log('xRoots', xRoots);
    //
    // console.log('yRoots', yRoots);

    if (xRoots.length > 0 && yRoots.length > 0) {
      let TOLERANCE = 1e-4;

      checkRoots:
        for (let j = 0; j < xRoots.length; j++) {
          let xRoot = xRoots[j];

          if (0 <= xRoot && xRoot <= 1) {
            for (let k = 0; k < yRoots.length; k++) {
              if (Math.abs(xRoot - yRoots[k]) < TOLERANCE) {

                let x = c23.x * s * s * s + c22.x * s * s + c21.x * s + c20.x;
                let y = c23.y * s * s * s + c22.y * s * s + c21.y * s + c20.y;
                result.push({ x, y });
                break checkRoots;
              }
            }
          }
        }
    }
  }
  return result;
}

function intersectBezier2Line(ax1, ay1, ax2, ay2, ax3, ay3, bx1, by1, bx2, by2) {
  let c2, c1, c0;
  let cl, n;
  let result = [];

  let minbx = Math.min(bx1, bx2);
  let minby = Math.min(by1, by2);
  let maxbx = Math.max(bx1, bx2);
  let maxby = Math.max(by1, by2);

  const dot = (a, b) => a.x * b.x + a.y * b.y;
  const lerp = (a, b, t) => ({
    x: a.x - (a.x - b.x) * t,
    y: a.y - (a.y - b.y) * t,
  });

  c2 = {
    x: ax1 - 2 * ax2 + ax3,
    y: ay1 - 2 * ay2 + ay3,
  };
  c1 = {
    x: -2 * ax1 + 2 * ax2,
    y: -2 * ay1 + 2 * ay2,
  };
  c0 = { x: ax1, y: ay1 };

  n = { x: by1 - by2, y: bx2 - bx1 };
  cl = bx1 * by2 - bx2 * by1;

  // console.log('intersectBezier2Line', n, c0, c1, c2, cl);

  let coefs = [ dot(n, c2), dot(n, c1), dot(n, c0) + cl ].reverse();

  // console.log('intersectBezier2Line coefs', coefs);

  let roots = getRoots(coefs);

  // console.log('intersectBezier2Line roots', roots);

  for (let i = 0; i < roots.length; i++) {
    let t = roots[i];

    if (0 <= t && t <= 1) {
      let p4 = lerp({ x: ax1, y: ay1 }, { x: ax2, y: ay2 }, t);
      let p5 = lerp({ x: ax2, y: ay2 }, { x: ax3, y: ay3 }, t);

      let p6 = lerp(p4, p5, t);
      // console.log('p4, p5, p6', p4, p5, p6);

      if (ax1 === ax2) {
        if (minby <= p6.y && p6.y <= maxby) {
          result.push(p6);
        }
      } else if (ay1 === ay2) {
        if (minbx <= p6.x && p6.x <= maxbx) {
          result.push(p6);
        }
      } else if (p6.x >= minbx && p6.y >= minby && p6.x <= maxbx && p6.y <= maxby) {
        result.push(p6);
      }
    }
  }
  return result;
}


/**
 *
 *    (-P1+3P2-3P3+P4)t^3 + (3P1-6P2+3P3)t^2 + (-3P1+3P2)t + P1
 *        /\                     /\                /\        /\
 *        ||                     ||                ||        ||
 *        c3                     c2                c1        c0
 */
function intersectBezier3Line(ax1, ay1, ax2, ay2, ax3, ay3, ax4, ay4, bx1, by1, bx2, by2) {
  let c3, c2, c1, c0;
  let cl, n;
  let result = [];

  let minbx = Math.min(bx1, bx2);
  let minby = Math.min(by1, by2);
  let maxbx = Math.max(bx1, bx2);
  let maxby = Math.max(by1, by2);

  const dot = (a, b) => a.x * b.x + a.y * b.y;
  const lerp = (a, b, t) => ({
    x: a.x - (a.x - b.x) * t,
    y: a.y - (a.y - b.y) * t,
  });

  c3 = {
    x: -ax1 + 3 * ax2 - 3 * ax3 + ax4,
    y: -ay1 + 3 * ay2 - 3 * ay3 + ay4,
  };
  c2 = {
    x: 3 * ax1 - 6 * ax2 + 3 * ax3,
    y: 3 * ay1 - 6 * ay2 + 3 * ay3,
  };
  c1 = {
    x: -3 * ax1 + 3 * ax2,
    y: -3 * ay1 + 3 * ay2,
  };
  c0 = { x: ax1, y: ay1 };

  n = { x: by1 - by2, y: bx2 - bx1 };
  cl = bx1 * by2 - bx2 * by1;

  let coefs = [
    cl + dot(n, c0),
    dot(n, c1),
    dot(n, c2),
    dot(n, c3),
  ];

  let roots = getRoots(coefs);

  for (let i = 0; i < roots.length; i++) {
    let t = roots[i];

    if (0 <= t && t <= 1) {
      let p5 = lerp({ x: ax1, y: ay1 }, { x: ax2, y: ay2 }, t);
      let p6 = lerp({ x: ax2, y: ay2 }, { x: ax3, y: ay3 }, t);
      let p7 = lerp({ x: ax3, y: ay3 }, { x: ax4, y: ay4 }, t);
      let p8 = lerp(p5, p6, t);
      let p9 = lerp(p6, p7, t);
      let p10 = lerp(p8, p9, t);


      if (ax1 === ax2) {
        if (minby <= p10.y && p10.y <= maxby) {
          result.push(p10);
        }
      } else if (ay1 === ay2) {
        if (minbx <= p10.x && p10.x <= maxbx) {
          result.push(p10);
        }
      } else if (p10.x >= minbx && p10.y >= minby && p10.x <= maxbx && p10.y <= maxby) {
        result.push(p10);
      }
    }
  }
  return result;
}

// bezier 2d 和椭圆
function intersectBezier2Ellipse(ax1, ay1, ax2, ay2, ax3, ay3, cx, cy, rx, ry) {
  let c2, c1, c0;
  let result = [];
  c2 = {
    x: ax1 - 2 * ax2 + ax3,
    y: ay1 - 2 * ay2 + ay3,
  };
  c1 = {
    x: -2 * ax1 + 2 * ax2,
    y: -2 * ay1 + 2 * ay2,
  };
  c0 = { x: ax1, y: ay1 };
  let rxrx = rx * rx;
  let ryry = ry * ry;

  let coefs = [ ryry * c2.x * c2.x + rxrx * c2.y * c2.y,
    2 * (ryry * c2.x * c1.x + rxrx * c2.y * c1.y),
    ryry * (2 * c2.x * c0.x + c1.x * c1.x) + rxrx * (2 * c2.y * c0.y + c1.y * c1.y) -
    2 * (ryry * cx * c2.x + rxrx * cy * c2.y),
    2 * (ryry * c1.x * (c0.x - cx) + rxrx * c1.y * (c0.y - cy)),
    ryry * (c0.x * c0.x + cx * cx) + rxrx * (c0.y * c0.y + cy * cy) -
    2 * (ryry * cx * c0.x + rxrx * cy * c0.y) - rxrx * ryry ].reverse();

  let roots = getRoots(coefs);

  for (let i = 0; i < roots.length; i++) {
    let t = roots[i];

    if (0 <= t && t <= 1) {
      let x = c2.x * t * t + c1.x * t + c0.x;
      let y = c2.y * t * t + c1.y * t + c0.y;
      result.push({ x, y });
    }
  }
  return result;
}

// bezier 2d 和圆
function intersectBezier2Circle(ax1, ay1, ax2, ay2, ax3, ay3, cx, cy, r) {
  return intersectBezier2Ellipse(ax1, ay1, ax2, ay2, ax3, ay3, cx, cy, r, r);
}

function intersectBezier3Ellipse(ax1, ay1, ax2, ay2, ax3, ay3, ax4, ay4, cx, cy, rx, ry) {
  let c3, c2, c1, c0;
  let result = [];
  c3 = {
    x: -ax1 + 3 * ax2 - 3 * ax3 + ax4,
    y: -ay1 + 3 * ay2 - 3 * ay3 + ay4,
  };
  c2 = {
    x: 3 * ax1 - 6 * ax2 + 3 * ax3,
    y: 3 * ay1 - 6 * ay2 + 3 * ay3,
  };
  c1 = {
    x: -3 * ax1 + 3 * ax2,
    y: -3 * ay1 + 3 * ay2,
  };
  c0 = { x: ax1, y: ay1 };
  let rxrx = rx * rx;
  let ryry = ry * ry;

  let coefs = [ c3.x * c3.x * ryry + c3.y * c3.y * rxrx,
    2 * (c3.x * c2.x * ryry + c3.y * c2.y * rxrx),
    2 * (c3.x * c1.x * ryry + c3.y * c1.y * rxrx) + c2.x * c2.x * ryry + c2.y * c2.y * rxrx,
    2 * c3.x * ryry * (c0.x - cx) + 2 * c3.y * rxrx * (c0.y - cy) +
    2 * (c2.x * c1.x * ryry + c2.y * c1.y * rxrx),
    2 * c2.x * ryry * (c0.x - cx) + 2 * c2.y * rxrx * (c0.y - cy) +
    c1.x * c1.x * ryry + c1.y * c1.y * rxrx,
    2 * c1.x * ryry * (c0.x - cx) + 2 * c1.y * rxrx * (c0.y - cy),
    c0.x * c0.x * ryry - 2 * c0.y * cy * rxrx - 2 * c0.x * cx * ryry +
    c0.y * c0.y * rxrx + cx * cx * ryry + cy * cy * rxrx - rxrx * ryry
  ].reverse();

  let roots = getRootsInInterval(0, 1, coefs);

  for (let i = 0; i < roots.length; i++) {
    let t = roots[i];

    if (0 <= t && t <= 1) {
      let x = c3.x * t * t * t + c2.x * t * t + c1.x * t + c0.x;
      let y = c3.y * t * t * t + c2.y * t * t + c1.y * t + c0.y;
      result.push({ x, y });
    }
  }
  return result;
}

function intersectBezier3Circle(ax1, ay1, ax2, ay2, ax3, ay3, ax4, ay4, cx, cy, r) {
  return intersectBezier3Ellipse(ax1, ay1, ax2, ay2, ax3, ay3, ax4, ay4, cx, cy, r, r);
}

export default {
  intersectBezier2Line, // 二阶贝塞尔曲线 与 直线
  intersectBezier3Line, // 三阶贝塞尔曲线 与 直线
  intersectBezier2Bezier2, // 二阶贝塞尔曲线 与 二阶贝塞尔曲线
  intersectBezier3Bezier3, // 三阶贝塞尔曲线 与 三阶贝塞尔曲线
  intersectBezier2Bezier3, // 二阶贝塞尔曲线 与 三阶贝塞尔曲线
  intersectBezier2Ellipse, // 二阶贝塞尔曲线 与 椭圆
  intersectBezier3Ellipse, // 三阶贝塞尔曲线 与 椭圆
  intersectBezier2Circle, // 二阶贝塞尔曲线 与 圆
  intersectBezier3Circle, // 三阶贝塞尔曲线 与 圆
}
