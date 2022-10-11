import change from './change';
import enums from '../util/enums';

const { STYLE_KEY: {
  TRANSLATE_X: TX,
  TRANSLATE_Y: TY,
  TRANSLATE_Z: TZ,
  OPACITY: OP,
  FILTER: FT,
  PERSPECTIVE: PPT,
  PERSPECTIVE_ORIGIN,
  Z_INDEX,
  SCALE_X: SX,
  SCALE_Y: SY,
  SCALE_Z: SZ,
  ROTATE_X,
  ROTATE_Y,
  ROTATE_Z: RZ,
  ROTATE_3D,
  SKEW_X,
  SKEW_Y,
  TRANSFORM: TF,
  TRANSFORM_ORIGIN,
} } = enums;

const { isIgnore, isRepaint } = change;

// 低位表示<repaint级别
const NONE = 0; //                                          0

// cacheTotal变化需重新生成的时候
const CACHE = 1; //                                         1

const TRANSLATE_X = 2; //                                  10
const TRANSLATE_Y = 4; //                                 100
const TRANSLATE_Z = 8; //                                1000
const TRANSLATE = 14; //                                 1110
const ROTATE_Z = 16; //                                 10000
const SCALE_X = 32; //                                 100000
const SCALE_Y = 64; //                                1000000
const SCALE_Z = 128; //                              10000000
const SCALE = 224; //                                11100000
const TRANSFORM = 256; //                           100000000
const TRANSFORM_ALL = 510; //                       111111110
const OPACITY = 512; //                            1000000000
const FILTER = 1024; //                           10000000000
const MIX_BLEND_MODE = 2048; //                  100000000000
const PERSPECTIVE = 4096; //                    1000000000000
const MASK = 8192; //                          10000000000000

const REPAINT = 16384; //                     100000000000000

// 高位表示reflow
const REFLOW = 32768; //                     1000000000000000

// 特殊高位表示rebuild，节点发生增删变化
const REBUILD = 65536; //                   10000000000000000

const ENUM = {
  NONE,
  CACHE,
  TRANSLATE_X,
  TRANSLATE_Y,
  TRANSLATE_Z,
  TRANSLATE,
  ROTATE_Z,
  SCALE_X,
  SCALE_Y,
  SCALE_Z,
  SCALE,
  TRANSFORM,
  TRANSFORM_ALL,
  OPACITY,
  FILTER,
  MIX_BLEND_MODE,
  PERSPECTIVE,
  MASK,
  REPAINT,
  REFLOW,
  REBUILD,
};

function isTransforms(k) {
  return k === ROTATE_X || k === ROTATE_Y || k === ROTATE_3D
    || k === SKEW_X || k === SKEW_Y || k === TF || k === TRANSFORM_ORIGIN;
}

let o = Object.assign({
  // 是否包含value之内的
  contain(lv, value) {
    return (lv & value) > 0;
  },
  // 是否不包含value之外的
  exclude(lv, value) {
    return (lv | value) === value;
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
    if(k === RZ) {
      return ROTATE_Z;
    }
    if(k === SX) {
      return SCALE_X;
    }
    if(k === SY) {
      return SCALE_Y;
    }
    if(k === SZ) {
      return SCALE_Z;
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
