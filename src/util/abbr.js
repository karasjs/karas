import reset from '../style/reset';

let fullCssProperty = {
  skewX: 'kx',
  skewY: 'ky',
  transform: 'tf',
  fontSize: 'fz',
};

let abbrCssProperty = {
  kx: 'skewX',
  ky: 'skewY',
  tf: 'transform',
  fz: 'fontSize',
};

reset.dom.concat(reset.geom).forEach(item => {
  let k = item.k;
  if(fullCssProperty.hasOwnProperty(k)) {
    return;
  }
  let v = k.charAt(0) + k.replace(/[a-z]/g, '').toLowerCase();
  fullCssProperty[k] = v;
  abbrCssProperty[v] = k;
});

export default {
  fullCssProperty,
  abbrCssProperty,
};
