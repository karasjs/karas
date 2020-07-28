import matrix from './matrix';
import geom from './geom';

// 一条边相对于自己开始点的角度
function calDeg(x1, y1, x2, y2) {
  return Math.atan((y2 - y1) / (x2 - x1));
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

function transform(source, target) {
  let [sx1, sy1, sx2, sy2, sx3, sy3] = source;
  let [tx1, ty1, tx2, ty2, tx3, ty3] = target;
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
  // 第2步，以第1条边AB为基准，缩放ab至目标相同长度
  let ls = Math.sqrt(Math.pow(sx2 - sx1, 2) + Math.pow(sy2 - sy1, 2));
  let lt = Math.sqrt(Math.pow(tx2 - tx1, 2) + Math.pow(ty2 - ty1, 2));
  if(ls !== lt) {
    let scale = lt / ls;
    t = matrix.identity();
    t[0] = scale;
    m = matrix.multiply(t, m);
  }
  // 第3步，缩放y，先将目标三角形旋转到x轴平行，再变换坐标计算
  let n = matrix.identity();
  n[12] = -tx1;
  n[13] = -ty1;
  theta = calDeg(tx1, ty1, tx2, ty2);
  // 记录下这个旋转角度，后面源三角形要旋转
  let alpha = -theta;
  if(theta !== 0) {
    t = rotate(-theta);
    n = matrix.multiply(t, n);
  }
  n = matrix.t43(n);
  // 目标三角反向旋转至x轴后的坐标
  let by1 = matrix.calPoint([tx1, ty1], n)[1];
  let by3 = matrix.calPoint([tx3, ty3], n)[1];
  // 源三角目前的第3点坐标y值即为长度，因为a点在原点0无需减去
  ls = matrix.calPoint([sx3, sy3], matrix.t43(m))[1];
  lt = by3 - by1;
  // 缩放y
  if(ls !== lt) {
    let scale = lt / ls;
    t = matrix.identity();
    t[5] = scale;
    m = matrix.multiply(t, m);
  }
  // 第4步，x轴倾斜，用余弦定理求目前a和A的夹角
  n = matrix.t43(m);
  let [ax1, ay1] = matrix.calPoint([sx1, sy1], n);
  let [ax2, ay2] = matrix.calPoint([sx2, sy2], n);
  let [ax3, ay3] = matrix.calPoint([sx3, sy3], n);
  let ab = Math.sqrt(Math.pow(ax2 - ax1, 2) + Math.pow(ay2 - ay1, 2));
  let ac = Math.sqrt(Math.pow(ax3 - ax1, 2) + Math.pow(ay3 - ay1, 2));
  let bc = Math.sqrt(Math.pow(ax2 - ax3, 2) + Math.pow(ay2 - ay3, 2));
  let AB = Math.sqrt(Math.pow(tx2 - tx1, 2) + Math.pow(ty2 - ty1, 2));
  let AC = Math.sqrt(Math.pow(tx3 - tx1, 2) + Math.pow(ty3 - ty1, 2));
  let BC = Math.sqrt(Math.pow(tx2 - tx3, 2) + Math.pow(ty2 - ty3, 2));
  let a = geom.angleBySide(bc, ab, ac);
  let A = geom.angleBySide(BC, AB, AC);
  // 先至90°，再旋转至目标角，可以合并成tan相加，不知道为什么不能直接tan倾斜差值角度
  if(a !== A) {
    t = matrix.identity();
    t[4] = Math.tan(a - Math.PI * 0.5) + Math.tan(Math.PI * 0.5 - A);
    m = matrix.multiply(t, m);
  }
  // 第5步，再次旋转，角度为目标旋转到x轴的负值
  if(alpha !== 0) {
    t = rotate(-alpha);
    m = matrix.multiply(t, m);
  }
  // 第6步，移动第一个点的差值
  t = matrix.identity();
  t[12] = tx1;
  t[13] = ty1;
  m = matrix.multiply(t, m);
  return matrix.t43(m);
}

export default {
  transform,
};
