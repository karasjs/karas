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
    verdana: {
      lhr: 1.21533203125, // (0+2059+430)/2048
      blr: 1.00537109375, // 2059/2048
    },
    tahoma: {
      lhr: 1.20703125, // (0+2049+423)/2048
      blr: 1.00048828125, // 2049/2048
    },
    georgia: {
      lhr: 1.13623046875, // (0+1878+449)/2048
      blr: 0.9169921875, // 1878/2048
    },
    'courier new': {
      lhr: 1.1328125, // (0+1705+615)/2048
      blr: 0.83251953125, // 1705/2048
    },
    'pingfang sc': {
      lhr: 1.4, // (0+1060+340)/1000
      // car: 1.4, // (1060+340)/1000
      blr: 1.06, // 1060/1000
    },
    '宋体': {
      lhr: 1.4, // (0+1060+340)/1000
      blr: 1.06,
    },
  },
  support(fontFamily) {
    return this.info.hasOwnProperty(fontFamily);
  },
  register(name, info) {
    let { emSquare = 2048, ascent = 1854, descent = 434, lineGap = 67 } = info || {};
    this.info[name.toLowerCase()] = {
      lhr: (ascent + descent + lineGap) / emSquare,
      blr: ascent / emSquare,
    };
  },
};
