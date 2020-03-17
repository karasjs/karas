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
        delete style[k];
      }
    });
  }
  let vd;
  if(tagName.charAt(0) === '$') {
    vd = karas.createGm(tagName, props);
  }
  else {
    vd = karas.createVd(tagName, props, children.map(item => parse(karas, item, animateList)));
  }
  let animationRecord;
  if(Array.isArray(animate) && animate.length) {
    animate.forEach(item => {
      let value = item.value;
      if(Array.isArray(value)) {
        value.forEach(item => {
          Object.keys(item).forEach(k => {
            if(item.hasOwnProperty(k) && abbrCssProperty.hasOwnProperty(k)) {
              let ak = abbrCssProperty[k];
              item[ak] = item[k];
              delete item[k];
            }
          });
        });
      }
    });
    animationRecord = {
      animate,
      target: vd,
    };
    animateList.push(animationRecord);
  }
  return vd;
}

export default parse;
