import util from './util';
import abbr from './abbr';

let { abbrCssProperty, abbrAnimateOption, abbrAnimate } = abbr;

function abbr2full(target, hash) {
  if(target) {
    Object.keys(target).forEach(k => {
      if(target.hasOwnProperty(k) && hash.hasOwnProperty(k)) {
        let ak = hash[k];
        target[ak] = target[k];
        delete target[k];
      }
    });
  }
}

function parse(karas, json, animateList) {
  if(util.isBoolean(json) || util.isNil(json) || util.isString(json) || util.isNumber(json)) {
    return json;
  }
  let { tagName, props = {}, children = [], animate } = json;
  abbr2full(props.style, abbrCssProperty);
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
        abbr2full(item, abbrAnimate);
        let { value, options } = item;
        if(Array.isArray(value) && value.length) {
          has = true;
          value.forEach(item => {
            abbr2full(item, abbrCssProperty);
          });
        }
        if(options) {
          abbr2full(options, abbrAnimateOption);
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
      abbr2full(animate, abbrAnimate);
      let { value, options } = animate;
      if(Array.isArray(value) && value.length) {
        value.forEach(item => {
          abbr2full(item, abbrCssProperty);
        });
        animationRecord = {
          animate,
          target: vd,
        };
      }
      if(options) {
        abbr2full(options, abbrAnimateOption);
      }
    }
  }
  if(animationRecord) {
    animateList.push(animationRecord);
  }
  return vd;
}

export default parse;
