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
};
