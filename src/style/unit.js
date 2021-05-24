let o = {
  AUTO: 0,
  PX: 1,
  PERCENT: 2,
  NUMBER: 3,
  INHERIT: 4,
  DEG: 5,
  STRING: 6,
  RGBA: 7,
  REM: 8,
  EM: 9,
  VW: 10,
  VH: 11,
  /**
   * 通用的格式化计算数值单位的方法，百分比/像素/REM/VW/auto和纯数字
   * @param v value
   * @returns 格式化好的[number, unit]
   */
  calUnit(v) {
    let n = parseFloat(v) || 0;
    if(/%$/.test(v)) {
      return [n, o.PERCENT];
    }
    else if(/px$/i.test(v)) {
      return [n, o.PX];
    }
    else if(/deg$/i.test(v)) {
      return [n, o.DEG];
    }
    else if(/rem$/i.test(v)) {
      return [n, o.REM];
    }
    else if(/vw$/i.test(v)) {
      return [n, o.VW];
    }
    else if(/vh$/i.test(v)) {
      return [n, o.VH];
    }
    else if(/em$/i.test(v)) {
      return [n, o.EM];
    }
    else if(/vw$/i.test(v)) {
      return [n, o.VW];
    }
    else if(/vh$/i.test(v)) {
      return [n, o.VH];
    }
    return [n, o.NUMBER];
  },
};

export default o;
