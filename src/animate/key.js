const KEY_COLOR = [
  'backgroundColor',
  'borderBottomColor',
  'borderLeftColor',
  'borderRightColor',
  'borderTopColor',
  'color',
];

const KEY_LENGTH = [
  'fontSize',
  'borderBottomWidth',
  'borderLeftWidth',
  'borderRightWidth',
  'borderTopWidth',
  'bottom',
  'left',
  'right',
  'top',
  'flexBasis',
  'width',
  'height',
  'lineHeight',
  'marginBottom',
  'marginLeft',
  'marginRight',
  'marginTop',
  'paddingBottom',
  'paddingLeft',
  'paddingRight',
  'paddingTop',
  'strokeWidth',
  'strokeMiterlimit',
];

const KEY_GRADIENT = [
  'backgroundImage',
  'fill',
  'stroke',
];

const KEY_RADIUS = [
  'borderTopLeftRadius',
  'borderTopRightRadius',
  'borderBottomRightRadius',
  'borderBottomLeftRadius',
];

const COLOR_HASH = {};
KEY_COLOR.forEach(k => {
  COLOR_HASH[k] = true;
});

const LENGTH_HASH = {};
KEY_LENGTH.forEach(k => {
  LENGTH_HASH[k] = true;
});

const RADIUS_HASH = {};
KEY_RADIUS.forEach(k => {
  RADIUS_HASH[k] = true;
});

const GRADIENT_HASH = {};
KEY_GRADIENT.forEach(k => {
  GRADIENT_HASH[k] = true;
});

const GRADIENT_TYPE = {
  linear: true,
  radial: true,
};

const KEY_EXPAND = [
  'translateX',
  'translateY',
  'scaleX',
  'scaleY',
  'rotateZ',
  'skewX',
  'skewY'
];

const EXPAND_HASH = {};
KEY_EXPAND.forEach(k => {
  EXPAND_HASH[k] = true;
});

export default {
  KEY_COLOR,
  KEY_EXPAND,
  KEY_GRADIENT,
  KEY_LENGTH,
  KEY_RADIUS,
  COLOR_HASH,
  EXPAND_HASH,
  GRADIENT_HASH,
  LENGTH_HASH,
  RADIUS_HASH,
  GRADIENT_TYPE,
};
