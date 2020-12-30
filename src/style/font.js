'use strict';

export default {
  info: {
    arial: {
      lhr: 1.14990234375, // 默认line-height ratio，(67+1854+434)/2048
      // car: 1.1171875, // content-area ratio，(1854+434)/2048
      blr: 0.9052734375, // base-line ratio，1854/2048
      // mdr: 0.64599609375, // middle ratio，(1854-1062/2)/2048
      // lgr: 0.03271484375, // line-gap ratio，67/2048
    },
    'pingfang sc': {
      lhr: 1.4, // (0+1060+340)/1000
      // car: 1.4, // (1060+340)/1000
      blr: 1.06, // 1060/1000
    },
  },
  register(name, info) {
    let { emSquare = 2048, ascent = 1854, descent = 434, lineGap = 67 } = info;
    this.info[name] = {
      lhr: (ascent + descent + lineGap) / emSquare,
      blr: ascent / emSquare,
    };
  },
};
