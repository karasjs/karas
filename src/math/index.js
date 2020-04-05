import matrix from './matrix';
import tar from './tar';

export default {
  matrix,
  tar,
  d2r(n) {
    return n * Math.PI / 180;
  },
  r2d(n) {
    return n * 180 / Math.PI;
  },
  h: 4 * (Math.sqrt(2) - 1) / 3, // 贝塞尔曲线模拟1/4圆
};
