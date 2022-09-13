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
  // 低位表示<repaint级别
  NONE: 0, //                                          0

  // cacheTotal变化需重新生成的时候
  CACHE: 1, //                                         1

  TRANSLATE_X: 2, //                                  10
  TRANSLATE_Y: 4, //                                 100
  TRANSLATE_Z: 8, //                                1000
  TRANSFORM: 16, //                                10000
  TRANSFORM_ALL: 30, //                            11110
  OPACITY: 32, //                                 100000
  FILTER: 64, //                                 1000000
  MIX_BLEND_MODE: 128, //                       10000000
  PERSPECTIVE: 256, //                         100000000

  REPAINT: 512, //                            1000000000

  // 高位表示reflow
  REFLOW: 1024, //                           10000000000

  // 特殊高位表示rebuild，节点发生变化
  REBUILD: 2048, //                         100000000000
};

const TRANSFORMS = {
  // translate特殊对待
  [STYLE_KEY.SCALE_X]: true,
  [STYLE_KEY.SCALE_Y]: true,
  [STYLE_KEY.SCALE_Z]: true,
  [STYLE_KEY.ROTATE_X]: true,
  [STYLE_KEY.ROTATE_Y]: true,
  [STYLE_KEY.ROTATE_Z]: true,
  [STYLE_KEY.SKEW_X]: true,
  [STYLE_KEY.SKEW_Y]: true,
  [STYLE_KEY.ROTATE_3D]: true,
  [STYLE_KEY.TRANSFORM]: true,
  [STYLE_KEY.TRANSFORM_ORIGIN]: true,
  [STYLE_KEY.TRANSLATE_PATH]: true,
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
    if(k === TRANSLATE_Y) {
      return ENUM.TRANSLATE_Y;
    }
    if(k === TRANSLATE_Z) {
      return ENUM.TRANSLATE_Z;
    }
    if(TRANSFORMS.hasOwnProperty(k)) {
      return ENUM.TRANSFORM;
    }
    if(k === OPACITY) {
      return ENUM.OPACITY;
    }
    if(k === FILTER) {
      return ENUM.FILTER;
    }
    if(k === PERSPECTIVE || k === PERSPECTIVE_ORIGIN) {
      return ENUM.PERSPECTIVE;
    }
    if(change.isRepaint(k)) {
      return ENUM.REPAINT;
    }
    return ENUM.REFLOW;
  },
  isReflow(lv) {
    return lv >= ENUM.REFLOW;
  },
  isRepaint(lv) {
    return lv < ENUM.REFLOW;
  },
}, ENUM);
o.TRANSFORMS = TRANSFORMS;

export default o;
