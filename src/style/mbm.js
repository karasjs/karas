const hash = {};

function mbmName(v) {
  if(v) {
    if(hash.hasOwnProperty(v)) {
      return hash[v];
    }
    return hash[v] = v.replace(/[A-Z]/, function($0) {
      return '-' + $0.toLowerCase();
    });
  }
}

function isValidMbm(v) {
  return v === 'multiply'
    || v === 'screen'
    || v === 'overlay'
    || v === 'darken'
    || v === 'lighten'
    || v === 'colorDodge'
    || v === 'color-dodge'
    || v === 'colorBurn'
    || v === 'color-burn'
    || v === 'hardLight'
    || v === 'hard-light'
    || v === 'softLight'
    || v === 'soft-light'
    || v === 'difference'
    || v === 'exclusion'
    || v === 'hue'
    || v === 'saturation'
    || v === 'color'
    || v === 'luminosity';
}

export default {
  mbmName,
  isValidMbm,
};
