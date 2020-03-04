import reset from '../style/reset';

let fullCssProperty = {
  skewX: 'kx',
  skewY: 'ky',
};

let abbrCssProperty = {
  kx: 'skewX',
  ky: 'skewY',
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
