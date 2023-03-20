const AUTO = 0;
const PX = 1;
const PERCENT = 2;
const NUMBER = 3;
const INHERIT = 4;
const DEG = 5;
const STRING = 6;
const RGBA = 7;
const REM = 8;
const EM = 9;
const VW = 10;
const VH = 11;
const VMAX = 12;
const VMIN = 13;
const GRADIENT = 14;

let o = {
  AUTO,
  PX,
  PERCENT,
  NUMBER,
  INHERIT,
  DEG,
  STRING,
  RGBA,
  REM,
  EM,
  VW,
  VH,
  VMAX,
  VMIN,
  GRADIENT, // 特殊格式，color/fill/stroke用给ctx传值
  /**
   * 通用的格式化计算数值单位的方法，百分比/像素/REM/VW/auto和纯数字
   * @param v value
   * @returns 格式化好的[number, unit]
   */
  calUnit(v) {
    if(v === 'auto') {
      return {
        v: 0,
        u: AUTO,
      };
    }
    let n = parseFloat(v) || 0;
    if(/%$/.test(v)) {
      return {
        v: n,
        u: PERCENT,
      };
    }
    else if(/px$/i.test(v)) {
      return {
        v: n,
        u: PX,
      };
    }
    else if(/deg$/i.test(v)) {
      return {
        v: n,
        u: DEG,
      };
    }
    else if(/rem$/i.test(v)) {
      return {
        v: n,
        u: REM,
      };
    }
    else if(/vw$/i.test(v)) {
      return {
        v: n,
        u: VW,
      };
    }
    else if(/vh$/i.test(v)) {
      return {
        v: n,
        u: VH,
      };
    }
    else if(/em$/i.test(v)) {
      return {
        v: n,
        u: EM,
      };
    }
    else if(/vw$/i.test(v)) {
      return {
        v: n,
        u: VW,
      };
    }
    else if(/vh$/i.test(v)) {
      return {
        v: n,
        u: VH,
      };
    }
    else if(/vmax$/i.test(v)) {
      return {
        v: n,
        u: VMAX,
      };
    }
    else if(/vmin$/i.test(v)) {
      return {
        v: n,
        u: VMIN,
      };
    }
    return {
      v: n,
      u: NUMBER,
    };
  },
};

export default o;
