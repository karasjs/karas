import change from './change';
import enums from '../util/enums';

const { STYLE_KEY, STYLE_KEY: {
  TRANSLATE_X,
  TRANSLATE_Y,
  TRANSLATE_Z,
  OPACITY,
  FILTER,
  PERSPECTIVE,
  PERSPECTIVE_ORIGIN,
} } = enums;

const ENUM = {
  // 低位表示repaint级别
  NONE: 0, //                                          0
  TRANSLATE_X: 1, //                                   1
  TRANSLATE_Y: 2, //                                  10
  TRANSLATE_Z: 4, //                                 100
  TRANSFORM: 8, //                                  1000
  TRANSFORM_ALL: 15, //                             1111
  OPACITY: 16, //                                  10000
  FILTER: 32, //                                  100000
  MIX_BLEND_MODE: 64, //                         1000000
  PERSPECTIVE: 128, //                          10000000
  REPAINT: 256, //                             100000000

  // 高位表示reflow
  REFLOW: 512, //                             1000000000
};

const TRANSFORMS = {
  // [STYLE_KEY.TRANSLATE_X]: true,
  // [STYLE_KEY.TRANSLATE_Y]: true,
  // [STYLE_KEY.TRANSLATE_Z]: true,
  [STYLE_KEY.SCALE_X]: true,
  [STYLE_KEY.SCALE_Y]: true,
  [STYLE_KEY.SCALE_Z]: true,
  [STYLE_KEY.ROTATE_X]: true,
  [STYLE_KEY.ROTATE_Y]: true,
  [STYLE_KEY.ROTATE_Z]: true,
  [STYLE_KEY.ROTATE_3D]: true,
  [STYLE_KEY.TRANSFORM]: true,
  [STYLE_KEY.TRANSFORM_ORIGIN]: true,
};

let o = Object.assign({
  contain(lv, value) {
    return (lv & value) > 0;
  },
  /**
   * 得出等级
   * @param k
   * @returns {number|*}
   */
  getLevel(k) {
    if(change.isIgnore(k)) {
      return ENUM.NONE;
    }
    if(k === TRANSLATE_X) {
      return ENUM.TRANSLATE_X;
    }
    else if(k === TRANSLATE_Y) {
      return ENUM.TRANSLATE_Y;
    }
    else if(k === TRANSLATE_Z) {
      return ENUM.TRANSLATE_Z;
    }
    else if(TRANSFORMS.hasOwnProperty(k)) {
      return ENUM.TRANSFORM;
    }
    else if(k === OPACITY) {
      return ENUM.OPACITY;
    }
    else if(k === FILTER) {
      return ENUM.FILTER;
    }
    else if(k === PERSPECTIVE || k === PERSPECTIVE_ORIGIN) {
      return ENUM.PERSPECTIVE;
    }
    else if(change.isRepaint(k)) {
      return ENUM.REPAINT;
    }
    return ENUM.REFLOW;
  },
  isReflow(lv) {
    return !this.isRepaint(lv);
  },
  isRepaint(lv) {
    return lv < ENUM.REFLOW;
  },
}, ENUM);
o.TRANSFORMS = TRANSFORMS;

export default o;
