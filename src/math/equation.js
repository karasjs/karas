const TOLERANCE = 1e-6;

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

  if (Math.abs(discrim) <= TOLERANCE) {
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
 * @param {Array<Number>} coefs 系数按幂次方倒序
 */
function getRoots(coefs) {
  let degree = coefs.length - 1;
  for(let i = degree; i >= 0; i--) {
    if(Math.abs(coefs[i]) < 1e-12) {
      degree--;
    }
    else {
      break;
    }
  }
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

export default {
  getRoots,
};
