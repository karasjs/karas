import matrix from './matrix';

function transform(x, y, width, height, source, target) {
  let [sx1, sy1, sx2, sy2, sx3, sy3] = source;
  let [tx1, ty1, tx2, ty2, tx3, ty3] = target;
  // 第1步，以第1个定点A为变换原点
  let m = matrix.identity();
  let ox = x + sx1;
  let oy = y + sy1;
  m[12] = ox;
  m[13] = oy;
  // 第2步，以第1条边AB为基准，缩放至目标ab相同长度
  let ls = Math.sqrt(Math.pow(sx2 - sx1, 2) + Math.pow(sy2 - sy1, 2));
  let lt = Math.sqrt(Math.pow(tx2 - tx1, 2) + Math.pow(ty2 - ty1, 2));
  let scale = lt / ls;
  let t = matrix.identity();
  t[0] = scale;
  t[5] = scale;
  m = matrix.multiply(t, m);
  // 第3步，以第1条边AB为基准，将其贴合x轴上，为后续倾斜不干扰做准备
  let theta = -Math.atan((sy2 - sy1) / (sx2 - sx1));
  let sin = Math.sin(theta);
  let cos = Math.cos(theta);
  t = matrix.identity();
  t[0] = t[5] = cos;
  t[1] = sin;
  t[4] = -sin;
  m = matrix.multiply(t, m);
  // 第4步，计算倾斜x角度
  let [x3, y3] = matrix.calPoint([sx3, sy3], matrix.t43(m));
  theta = Math.atan((tx3 - x3) / y3);
  t = matrix.identity();
  t[4] = Math.tan(theta);
  m = matrix.multiply(t, m);
  // 第5步，缩放y，等同于倾斜y
  y3 = matrix.calPoint([sx3, sy3], matrix.t43(m))[1];
  scale = ty3 / y3;
  t = matrix.identity();
  t[5] = scale;
  m = matrix.multiply(t, m);
  // 变换回初始原点
  t = matrix.identity();
  t[12] = -ox;
  t[13] = -oy;
  m = matrix.multiply(t, m);
  return matrix.t43(m);
}

export default {
  transform,
};
