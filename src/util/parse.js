import util from './util';

function parse(karas, json, data) {
  if(util.isBoolean(json) || util.isNil(json) || util.isString(json) || util.isNumber(json)) {
    return json;
  }
  let { tagName, props = {}, children = [], animate } = json;
  let animation;
  if(animate) {
    animation = {
      animate,
    };
    data.animate.push(animation);
  }
  let vd;
  if(tagName.charAt(0) === '$') {
    vd = karas.createGm(tagName, props);
  }
  else {
    vd = karas.createVd(tagName, props, children.map(item => parse(karas, item, data)));
  }
  if(animation) {
    animation.target = vd;
  }
  return vd;
}

export default parse;
