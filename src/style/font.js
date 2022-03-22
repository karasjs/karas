'use strict';

let o = {
  info: {
    arial: {
      lhr: 1.14990234375, // 默认line-height ratio，(67+1854+434)/2048
      // car: 1.1171875, // content-area ratio，(1854+434)/2048
      blr: 0.9052734375, // base-line ratio，1854/2048
      // mdr: 0.64599609375, // middle ratio，(1854-1062/2)/2048
      lgr: 0.03271484375, // line-gap ratio，67/2048，默认0
      // 个别字符误差，初次之外误差还有根据经验得的比例系数，https://github.com/karasjs/karas/issues/145
      padding: {
        // 1: 1,
        // f: 0.9,
      },
    },
    helvetica: {
      lhr: 1.14990234375, // (8+1900+447)/2048
      blr: 0.927734375, // 1900/2048
      lgr: 0.00390625, // 8/2048
    },
    verdana: {
      lhr: 1.21533203125, // (0+2059+430)/2048
      blr: 1.00537109375, // 2059/2048
    },
    tahoma: {
      lhr: 1.20703125, // (0+2049+423)/2048
      blr: 1.00048828125, // 2049/2048
      padding: {
        S: 1,
        T: 1,
        Z: 1,
        c: 1,
        f: 0.7,
        i: 1,
        l: 1,
        t: 0.9,
      },
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
      blr: 1.06, // 1060/1000
      padding: {
        f: 0.5,
      },
    },
    simsun: {
      lhr: 1.4, // (0+1060+340)/1000
      blr: 1.06,
      padding: {
        f: 0.5,
      },
    },
  },
  support(fontFamily) {
    return this.info.hasOwnProperty(fontFamily) && this.info[fontFamily].checked;
  },
  register(name, info) {
    let { emSquare = 2048, ascent = 1854, descent = 434, lineGap = 0, padding = {} } = info || {};
    this.info[name.toLowerCase()] = {
      lhr: (ascent + descent + lineGap) / emSquare,
      blr: ascent / emSquare,
      padding,
    };
  },
  hasRegister(fontFamily) {
    return this.info.hasOwnProperty(fontFamily);
  },
  hasChecked(fontFamily) {
    return this.hasRegister(fontFamily) && this.info[fontFamily].hasOwnProperty('checked');
  },
  setChecked(fontFamily, res) {
    return this.info[fontFamily].checked = res;
  },
  addPadding(name, padding) {
    Object.assign(this.info[name.toLowerCase()].padding, padding);
  },
};

o.info['宋体'] = o.info.simsun;
o.info['pingfang'] = o.info['pingfang sc'];

export default o;
