import reset from './reset';

let dpr = 1;

export default {
  get devicePixelRatio() {
    return dpr;
  },
  set devicePixelRatio(v) {
    dpr = v;
    reset.fontSize = 16 * v;
  },
};
