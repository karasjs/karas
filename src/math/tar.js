import matrix from './matrix';
import geom from './geom';

// 一条边相对于自己开始点的x向量角度，即从x到此边旋转，0~180和-180~0，需要判断象限
function calDeg(x1, y1, x2, y2) {
  let dx = x2 - x1;
  let dy = y2 - y1;
  let atan = Math.atan(Math.abs(dy) / Math.abs(dx));
  // 2象限
  if(dx < 0 && dy >= 0) {
    return Math.PI - atan;
  }
  // 3象限
  if(dx < 0 && dy < 0) {
    return atan - Math.PI;
  }
  // 1象限
  if(dx >= 0 && dy >= 0) {
    return atan;
  }
  // 4象限，顺时针正好
  return -atan;
}

function rotate(theta) {
  let sin = Math.sin(theta);
  let cos = Math.cos(theta);
  let t = matrix.identity();
  t[0] = t[5] = cos;
  t[1] = sin;
  t[4] = -sin;
  return t;
}

/**
 * 确保3个点中，a点在三角形左上方，b/c在右方，同时ab到ac要顺时针旋转
 * @param points
 */
function pointIndex(points) {
  let [x1, y1, x2, y2, x3, y3] = points;
  let index = [0, 1, 2];
  // 将a点放入最左
  if(x2 < x1 && x2 < x3) {
    [x1, y1, x2, y2] = [x2, y2, x1, y1];
    index[0] = 1;
    index[1] = 0;
  }
  else if(x3 < x2 && x3 < x1) {
    [x1, y1, x3, y3] = [x3, y3, x1, y1];
    index[0] = 2;
    index[2] = 0;
  }
  // 有可能出现2个并列的情况，判断取上面那个
  if(x1 === x2) {
    if(y1 > y2) {
      [x1, y1, x2, y2] = [x2, y2, x1, y1];
      let t = index[0];
      index[0] = index[1];
      index[1] = t;
    }
  }
  else if(x1 === x3) {
    if(y1 > y3) {
      [x1, y1, x3, y3] = [x3, y3, x1, y1];
      let t = index[0];
      index[0] = index[2];
      index[2] = t;
    }
  }
  // ab到ac要顺时针旋转，即2个向量夹角为正，用向量叉乘判断正负
  let cross = (x2 - x1) * (y3 - y1) - (x3 - x1) * (y2 - y1);
  if(cross < 0) {
    [x2, y2, x3, y3] = [x3, y3, x2, y2];
    let t = index[1];
    index[1] = index[2];
    index[2] = t;
  }
  return [x1, y1, x2, y2, x3, y3, index];
}

/**
 * 第2个点根据第一个点的交换顺序交换
 * @param points
 * @param index
 * @returns {[]}
 */
function pointByIndex(points, index) {
  let res = [];
  for(let i = 0, len = index.length; i < len; i++) {
    let j = index[i];
    res.push(points[j * 2]);
    res.push(points[j * 2 + 1]);
  }
  return res;
}

/**
 * 确保3个点中，a点在三角形左上方，b/c在右方，同时ab到ac要顺时针旋转
 * @param source 源3个点
 * @param target 目标3个点
 * @returns 交换顺序后的点坐标
 */
function exchangeOrder(source, target) {
  let [sx1, sy1, sx2, sy2, sx3, sy3, index] = pointIndex(source);
  let [tx1, ty1, tx2, ty2, tx3, ty3] = pointByIndex(target, index);
  return [
    [sx1, sy1, sx2, sy2, sx3, sy3],
    [tx1, ty1, tx2, ty2, tx3, ty3]
  ];
}

/**
 * 存在一种情况，变换结果使得三角形镜像相反了，即顶点a越过bc线，判断是否溢出
 * @param source
 * @param target
 * @returns {boolean}是否溢出
 */
function isOverflow(source, target) {
  let [sx1, sy1, sx2, sy2, sx3, sy3] = source;
  let [tx1, ty1, tx2, ty2, tx3, ty3] = target;
  let cross1 = (sx2 - sx1) * (sy3 - sy1) - (sx3 - sx1) * (sy2 - sy1);
  let cross2 = (tx2 - tx1) * (ty3 - ty1) - (tx3 - tx1) * (ty2 - ty1);
  return cross1 > 0 && cross2 < 0 || cross1 < 0 && cross2 > 0;
}

function transform(source, target) {
  let [sx1, sy1, sx2, sy2, sx3, sy3] = source;
  let [tx1, ty1, tx2, ty2, tx3, ty3] = target;
  // 记录翻转
  let overflow = isOverflow(source, target);
  // 第0步，将源三角第1个a点移到原点
  let m = matrix.identity();
  m[12] = -sx1;
  m[13] = -sy1;
  let t;
  // 第1步，以第1条边ab为基准，将其贴合x轴上，为后续倾斜不干扰做准备
  let theta = calDeg(sx1, sy1, sx2, sy2);
  if(theta !== 0) {
    t = rotate(-theta);
    m = matrix.multiply(t, m);
  }
  // 第2步，以第1条边AB为基准，缩放x轴ab至目标相同长度，可与4步合并
  let ls = geom.pointsDistance(sx1, sy1, sx2, sy2);
  let lt = geom.pointsDistance(tx1, ty1, tx2, ty2);
  // if(ls !== lt) {
    // let scale = lt / ls;
    // t = matrix.identity();
    // t[0] = scale;
    // m = matrix.multiply(t, m);
  // }
  // 第3步，缩放y，先将目标三角形旋转到x轴平行，再变换坐标计算
  let n = matrix.identity();
  n[12] = -tx1;
  n[13] = -ty1;
  theta = calDeg(tx1, ty1, tx2, ty2);
  // 记录下这个旋转角度，后面源三角形要反向旋转
  let alpha = theta;
  if(theta !== 0) {
    t = rotate(-theta);
    n = matrix.multiply(t, n);
  }
  // 目标三角反向旋转至x轴后的坐标
  // 源三角目前的第3点坐标y值即为长度，因为a点在原点0无需减去
  let ls2 = Math.abs(matrix.calPoint([sx3, sy3], m)[1]);
  let lt2 = Math.abs(matrix.calPoint([tx3, ty3], n)[1]);
  // 缩放y
  // if(ls2 !== lt2) {
    // let scale = lt / ls;
    // t = matrix.identity();
    // t[3] = scale;
    // m = matrix.multiply(t, m);
  // }
  if(ls !== lt || ls2 !== lt2) {
    t = matrix.identity();
    if(ls !== lt) {
      t[0] = lt / ls;
    }
    if(ls2 !== lt2) {
      t[5] = lt2 / ls2;
    }
    m = matrix.multiply(t, m);
  }
  // 第4步，x轴倾斜，用余弦定理求目前a和A的夹角
  n = m;
  let [ax1, ay1] = matrix.calPoint([sx1, sy1], n);
  let [ax2, ay2] = matrix.calPoint([sx2, sy2], n);
  let [ax3, ay3] = matrix.calPoint([sx3, sy3], n);
  let ab = geom.pointsDistance(ax1, ay1, ax2, ay2);
  let ac = geom.pointsDistance(ax1, ay1, ax3, ay3);
  let bc = geom.pointsDistance(ax3, ay3, ax2, ay2);
  let AB = geom.pointsDistance(tx1, ty1, tx2, ty2);
  let AC = geom.pointsDistance(tx1, ty1, tx3, ty3);
  let BC = geom.pointsDistance(tx3, ty3, tx2, ty2);
  let a = geom.angleBySide(bc, ab, ac);
  let A = geom.angleBySide(BC, AB, AC);
  // 先至90°，再旋转至目标角，可以合并成tan相加，不知道为什么不能直接tan倾斜差值角度
  if(a !== A) {
    t = matrix.identity();
    t[4] = Math.tan(a - Math.PI * 0.5) + Math.tan(Math.PI * 0.5 - A);
    m = matrix.multiply(t, m);
  }
  // 发生翻转时特殊处理按x轴垂直翻转
  if(overflow) {
    m[1] = -m[1];
    m[5] = -m[5];
    m[13] = -m[13];
  }
  // 第5步，再次旋转，角度为目标旋转到x轴的负值，可与下步合并
  if(alpha !== 0) {
    t = rotate(alpha);
    // m = matrix.multiply(t, m);
  }
  else {
    t = matrix.identity();
  }
  // 第6步，移动第一个点的差值
  // t = matrix.identity();
  t[12] = tx1;
  t[13] = ty1;
  m = matrix.multiply(t, m);
  return matrix.m2m6(m);
}

export default {
  exchangeOrder,
  isOverflow,
  transform,
};
