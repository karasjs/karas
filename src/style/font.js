import util from '../util/util';
import inject from '../util/inject';

const { isString } = util;

const CALLBACK = {};

let o = {
  info: {
    arial: {
      lhr: 1.14990234375, // 默认line-height ratio，(67+1854+434)/2048
      // car: 1.1171875, // content-area ratio，(1854+434)/2048
      blr: 0.9052734375, // base-line ratio，1854/2048
      // mdr: 0.64599609375, // middle ratio，(1854-1062/2)/2048
      lgr: 0.03271484375, // line-gap ratio，67/2048，默认0
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
    },
    simsun: {
      lhr: 1.4, // (0+1060+340)/1000
      blr: 1.06,
    },
  },
  support(fontFamily) {
    return this.info.hasOwnProperty(fontFamily) && this.info[fontFamily].checked;
  },
  register(name, url, data) {
    name = name.toLowerCase();
    if(!isString(url) && !(url instanceof ArrayBuffer)) {
      data = url;
      url = null;
    }
    let info = this.info;
    info[name] = info[name] || {};
    if(url && !info[name].url) {
      info[name].url = url;
      inject.loadFont(name, url, function(res) {
        info[name].success = res.success;
        if(res.success) {
          let list = CALLBACK[name] || [];
          while(list.length) {
            let node = list.pop();
            node.__loadFontCallback(name);
          }
        }
      });
    }
    // 防止先没url只注册，再调用只url的情况
    if(!data || info[name].lhr) {
      return;
    }
    let { emSquare = 2048, ascent = 1854, descent = 434, lineGap = 0 } = data || {};
    Object.assign(info[name], {
      lhr: (ascent + descent + lineGap) / emSquare,
      blr: ascent / emSquare,
    });
  },
  hasRegister(fontFamily) {
    return this.info.hasOwnProperty(fontFamily) && this.info[fontFamily].hasOwnProperty('lhr');
  },
  hasLoaded(fontFamily) {
    return this.info.hasOwnProperty(fontFamily) && this.info[fontFamily].success;
  },
  waitForRegister(fontFamily, node) {
    let list = CALLBACK[fontFamily] = CALLBACK[fontFamily] || [];
    list.push(node);
  },
};

o.info['宋体'] = o.info.simsun;
o.info['pingfang'] = o.info['pingfang sc'];

export default o;
