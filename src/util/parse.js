import util from './util';

function parse(karas, json, data) {
  if(util.isString(json)) {
    return json;
  }
  let { tagName, props = {}, children = [], animate } = json;
  let ref = props.ref;
  if(animate && ref) {
    data.animate.push({
      ref,
      animate,
    });
  }
  if(tagName.charAt(0) === '$') {
    return karas.createGm(tagName, props);
  }
  return karas.createVd(tagName, props, children.map(item => parse(karas, item, data)));
}

export default parse;
