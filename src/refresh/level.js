import change from './change';

const ENUM = {
  // 低4位表示repaint级别
  NONE: 0, //                                          0
  TRANSLATE_X: 1, //                                   1
  TRANSLATE_Y: 2, //                                  10
  // TRANSLATE: 3, //                                    11
  TRANSFORM: 4, //                                   100
  TRANSFORM_ALL: 7, //                               111
  OPACITY: 8, //                                    1000
  FILTER: 16, //                                   10000
  VISIBILITY: 32, //                              100000
  REPAINT: 64, //                                1000000

  // 高位表示reflow
  REFLOW: 128, //                               10000000
};

const TRANSFORMS = {
  // translateX: true,
  // translateY: true,
  scaleX: true,
  scaleY: true,
  rotateZ: true,
  transform: true,
  transformOrigin: true,
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
    if(k === 'translateX') {
      return ENUM.TRANSLATE_X;
    }
    else if(k === 'translateY') {
      return ENUM.TRANSLATE_Y;
    }
    else if(TRANSFORMS.hasOwnProperty(k)) {
      return ENUM.TRANSFORM;
    }
    else if(k === 'opacity') {
      return ENUM.OPACITY;
    }
    else if(k === 'filter') {
      return ENUM.FILTER;
    }
    if(change.isRepaint(k)) {
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
