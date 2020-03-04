import util from './util';
import abbr from './abbr';

let abbrCssProperty = abbr.abbrCssProperty;

function parse(karas, json, animateList) {
  if(util.isBoolean(json) || util.isNil(json) || util.isString(json) || util.isNumber(json)) {
    return json;
  }
  let { tagName, props = {}, children = [], animate } = json;
  let style = props.style;
  if(style) {
    Object.keys(style).forEach(k => {
      if(style.hasOwnProperty(k) && abbrCssProperty.hasOwnProperty(k)) {
        let ak = abbrCssProperty[k];
        style[ak] = style[k];
      }
    });
  }
  let animation;
  if(animate) {
    let value = animate.value;
    if(Array.isArray(value)) {
      value.forEach(item => {
        Object.keys(item).forEach(k => {
          if(item.hasOwnProperty(k) && abbrCssProperty.hasOwnProperty(k)) {
            let ak = abbrCssProperty[k];
            item[ak] = item[k];
          }
        });
      });
    }
    animation = {
      animate,
    };
    animateList.push(animation);
  }
  let vd;
  if(tagName.charAt(0) === '$') {
    vd = karas.createGm(tagName, props);
  }
  else {
    vd = karas.createVd(tagName, props, children.map(item => parse(karas, item, animateList)));
  }
  if(animation) {
    animation.target = vd;
  }
  return vd;
}

export default parse;
