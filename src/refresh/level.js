import change from './change';

const ENUM = {
  // 低4位表示repaint级别
  NONE: 0, //                                          0
  TRANSFORM: 1, //                                     1
  OPACITY: 2, //                                      10
  FILTER: 4, //                                      100
  TRANSFORM_OPACITY: 3, //                            11
  TRANSFORM_FILTER: 5, //                            101
  OPACITY_FILTER: 6, //                              110
  TRANSFORM_OPACITY_FILTER: 7, //                    111
  REPAINT: 8, //                                    1000

  // 高位表示reflow
  REFLOW: 16, // 整体需要重排                        10000
  OFFSET: 32, // reflow中是因为offset引起的情况      100000
};

const TRANSFORM = {
  translateX: true,
  translateY: true,
  scaleX: true,
  scaleY: true,
  rotateZ: true,
};

let o = Object.assign({
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
  getDetailRepaintByLv(style, lv) {
    if(lv === ENUM.NONE) {
      return ENUM.NONE;
    }
    if(lv === ENUM.REPAINT) {
      let lv = ENUM.NONE;
      for(let i in style) {
        if(style.hasOwnProperty(i)) {
          if(TRANSFORM.hasOwnProperty(i)) {
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
}, ENUM, TRANSFORM);

export default o;
