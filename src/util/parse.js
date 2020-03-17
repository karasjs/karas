import util from './util';
import abbr from './abbr';

let abbrCssProperty = abbr.abbrCssProperty;

function abbr2full(style) {
  if(style) {
    Object.keys(style).forEach(k => {
      if(style.hasOwnProperty(k) && abbrCssProperty.hasOwnProperty(k)) {
        let ak = abbrCssProperty[k];
        style[ak] = style[k];
        delete style[k];
      }
    });
  }
}

function parse(karas, json, animateList) {
  if(util.isBoolean(json) || util.isNil(json) || util.isString(json) || util.isNumber(json)) {
    return json;
  }
  let { tagName, props = {}, children = [], animate } = json;
  abbr2full(props.style);
  let vd;
  if(tagName.charAt(0) === '$') {
    vd = karas.createGm(tagName, props);
  }
  else {
    vd = karas.createVd(tagName, props, children.map(item => parse(karas, item, animateList)));
  }
  let animationRecord;
  if(animate) {
    if(Array.isArray(animate)) {
      let has;
      animate.forEach(item => {
        let value = item.value;
        if(Array.isArray(value) && value.length) {
          has = true;
          value.forEach(item => {
            abbr2full(item);
          });
        }
      });
      if(has) {
        animationRecord = {
          animate,
          target: vd,
        };
      }
    }
    else {
      let value = animate.value;
      if(Array.isArray(value) && value.length) {
        value.forEach(item => {
          abbr2full(item);
        });
        animationRecord = {
          animate,
          target: vd,
        };
      }
    }
  }
  if(animationRecord) {
    animateList.push(animationRecord);
  }
  return vd;
}

export default parse;
