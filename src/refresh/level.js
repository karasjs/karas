import change from './change';

const ENUM = {
  // 低4位表示repaint级别
  NONE: 0, //                                          0
  TRANSLATE_X: 1, //                                   1
  TRANSLATE_Y: 2, //                                  10
  TRANSFORM: 4, //                                   100
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
   * 仅得出大概等级none/repaint/reflow
   * @param k
   * @returns {number|*}
   */
  getLevel(k) {
    if(change.isIgnore(k)) {
      return ENUM.NONE;
    }
    if(change.isRepaint(k)) {
      return ENUM.REPAINT;
    }
    return ENUM.REFLOW;
  },
  /**
   * 根据大概等级细化repaint分级
   * @param style
   * @param lv
   */
  getDetailRepaint(style, lv) {
    if(lv === ENUM.NONE) {
      return ENUM.NONE;
    }
    if(lv === ENUM.REPAINT) {
      let lv = ENUM.NONE;
      for(let i in style) {
        if(style.hasOwnProperty(i)) {
          if(i === 'translateX') {
            lv |= ENUM.TRANSLATE_X;
          }
          else if(i === 'translateY') {
            lv |= ENUM.TRANSLATE_Y;
          }
          else if(TRANSFORMS.hasOwnProperty(i)) {
            lv |= ENUM.TRANSFORM;
          }
          else if(i === 'opacity') {
            lv |= ENUM.OPACITY;
          }
          else if(i === 'filter') {
            lv |= ENUM.FILTER;
          }
          else {
            lv |= ENUM.REPAINT;
          }
        }
      }
      return lv;
    }
    else {
      return ENUM.REFLOW;
    }
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
