import change from './change';
import enums from '../util/enums';

const { STYLE_KEY, STYLE_KEY: {
  TRANSLATE_X: TX,
  TRANSLATE_Y: TY,
  TRANSLATE_Z: TZ,
  OPACITY: OP,
  FILTER: FT,
  PERSPECTIVE: PPT,
  PERSPECTIVE_ORIGIN,
  Z_INDEX,
  SCALE_X,
  SCALE_Y,
  SCALE_Z,
  ROTATE_X,
  ROTATE_Y,
  ROTATE_Z,
  ROTATE_3D,
  SKEW_X,
  SKEW_Y,
  TRANSFORM: TF,
  TRANSFORM_ORIGIN,
  TRANSLATE_PATH,
} } = enums;

const { isIgnore, isRepaint } = change;

// 低位表示<repaint级别
const NONE = 0; //                                          0

// cacheTotal变化需重新生成的时候
const CACHE = 1; //                                         1

const TRANSLATE_X = 2; //                                  10
const TRANSLATE_Y = 4; //                                 100
const TRANSLATE_Z = 8; //                                1000
const TRANSFORM = 16; //                                10000
const TRANSFORM_ALL = 30; //                            11110
const OPACITY = 32; //                                 100000
const FILTER = 64; //                                 1000000
const MIX_BLEND_MODE = 128; //                       10000000
const PERSPECTIVE = 256; //                         100000000

const REPAINT = 512; //                            1000000000

// 高位表示reflow
const REFLOW = 1024; //                           10000000000

// 特殊高位表示rebuild，节点发生变化
const REBUILD = 2048; //                         100000000000

const ENUM = {
  NONE,
  CACHE,
  TRANSLATE_X,
  TRANSLATE_Y,
  TRANSLATE_Z,
  TRANSFORM,
  TRANSFORM_ALL,
  OPACITY,
  FILTER,
  MIX_BLEND_MODE,
  PERSPECTIVE,
  REPAINT,
  REFLOW,
  REBUILD,
};

function isTransforms(k) {
  return k === SCALE_X || k === SCALE_Y || k === SCALE_Z
    || k === ROTATE_X || k === ROTATE_Y || k === ROTATE_Z || k === ROTATE_3D
    || k === SKEW_X || k === SKEW_Y || k === TF || k === TRANSFORM_ORIGIN;
}

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
    if(isIgnore(k)) {
      return NONE;
    }
    if(k === Z_INDEX) {
      return CACHE;
    }
    if(k === TX) {
      return TRANSLATE_X;
    }
    if(k === TY) {
      return TRANSLATE_Y;
    }
    if(k === TZ) {
      return TRANSLATE_Z;
    }
    if(k === OP) {
      return OPACITY;
    }
    if(k === FT) {
      return FILTER;
    }
    if(k === PPT || k === PERSPECTIVE_ORIGIN) {
      return PERSPECTIVE;
    }
    if(isTransforms(k)) {
      return TRANSFORM;
    }
    if(isRepaint(k)) {
      return REPAINT;
    }
    return REFLOW;
  },
  isReflow(lv) {
    return lv >= REFLOW;
  },
  isRepaint(lv) {
    return lv < REFLOW;
  },
}, ENUM);

export default o;
