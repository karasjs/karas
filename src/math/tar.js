import matrix from './matrix';

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
  // 第0步，将目标三角第1个a点移到和源三角一样的原点上
  let dx = tx1 - sx1;
  let dy = tx2 - sx2;
  tx1 -= dx;
  ty1 -= dy;
  tx2 -= dx;
  ty2 -= dy;
  tx3 -= dx;
  ty3 -= dy;
  let m = matrix.identity();
  // 第1步，以第1条边AB为基准，将其贴合x轴上，为后续倾斜不干扰做准备
  let theta = calDeg(sx1, sy1, sx2, sy2);
  let t = rotate(-theta);
  m = matrix.multiply(t, m);
  // 第2步，以第1条边AB为基准，缩放至目标ab相同长度
  let ls = Math.sqrt(Math.pow(sx2 - sx1, 2) + Math.pow(sy2 - sy1, 2));
  let lt = Math.sqrt(Math.pow(tx2 - tx1, 2) + Math.pow(ty2 - ty1, 2));
  let scale = lt / ls;
  t = matrix.identity();
  t[0] = t[5] = scale;
  m = matrix.multiply(t, m);
  // 第3步，缩放y，先将目标旋转到x轴上，再变换坐标计算
  theta = calDeg(tx1, ty1, tx2, ty2);
  t = rotate(-theta);
  // 目标三角反向旋转至x轴后的第2、3点坐标，求得旋转角度
  let [ax2, ay2] = matrix.calPoint([tx2, ty2], matrix.t43(t));
  let [ax3, ay3] = matrix.calPoint([tx3, ty3], matrix.t43(t));
  let alpha = Math.atan((ax2- ax3) / (ay3 - ay2));
  let by3 = matrix.calPoint([sx3, sy3], matrix.t43(m))[1];
  // 缩放y
  scale = ay3 / by3;
  t = matrix.identity();
  t[5] = scale;
  m = matrix.multiply(t, m);
  // 第4步，x轴倾斜，第3点的x/y的tan值
  let [x3, y3] = matrix.calPoint([sx3, sy3], matrix.t43(m));
  theta = Math.atan((ax3 - x3) / y3);
  t = matrix.identity();
  t[4] = Math.tan(theta);
  m = matrix.multiply(t, m);
  // 第5步，再次旋转，角度为目标旋转到x轴的负值
  t = rotate(-alpha);
  m = matrix.multiply(t, m);
  // 第6步，移动第一个点的差值
  t = matrix.identity();
  t[12] = dx;
  t[13] = dy;
  m = matrix.multiply(t, m);
  return matrix.t43(m);
}

export default {
  transform,
};
