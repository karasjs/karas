const MBM_HASH = {
  multiply: true,
  screen: true,
  overlay: true,
  darken: true,
  lighten: true,
  'color-dodge': true,
  'color-burn': true,
  'hard-light': true,
  'soft-light': true,
  difference: true,
  exclusion: true,
  hue: true,
  saturation: true,
  color: true,
  luminosity: true,
};

function mbmName(v) {
  if(v) {
    return v.replace(/[A-Z]/, function($0) {
      return '-' + $0.toLowerCase();
    });
  }
}

function isValidMbm(v) {
  return MBM_HASH.hasOwnProperty(mbmName(v));
}

export default {
  mbmName,
  isValidMbm,
};
