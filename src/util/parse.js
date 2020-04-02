import util from './util';
import abbr from './abbr';

let { abbrCssProperty, abbrAnimateOption, abbrAnimate } = abbr;

/**
 * 还原缩写到全称，涉及样式和动画属性
 * @param target 还原的对象
 * @param hash 缩写映射
 */
function abbr2full(target, hash) {
  // 也许节点没写样式
  if(target) {
    Object.keys(target).forEach(k => {
      // var-attr格式特殊考虑，仅映射attr部分，var-还要保留
      if(k.indexOf('var-') === 0) {
        let k2 = k.slice(4);
        if(hash.hasOwnProperty(k2)) {
          let fk = hash[k2];
          target['var-' + fk] = target[k];
          delete target[k];
        }
      }
      // 普通样式缩写还原
      else if(hash.hasOwnProperty(k)) {
        let fk = hash[k];
        target[fk] = target[k];
        delete target[k];
      }
    });
  }
}

function replaceVars(target, vars) {
  if(target && vars) {
    Object.keys(target).forEach(k => {
      if(k.indexOf('var-') === 0) {
        let v = target[k];
        let k2 = k.slice(4);
        if(v.id && vars.hasOwnProperty(v.id)) {
          target[k2] = vars[v.id];
        }
      }
    });
  }
}

function parse(karas, json, animateList, vars) {
  if(util.isBoolean(json) || util.isNil(json) || util.isString(json) || util.isNumber(json)) {
    return json;
  }
  let { tagName, props = {}, children = [], animate } = json;
  let style = props.style;
  abbr2full(style, abbrCssProperty);
  // 先替换style的
  replaceVars(style, vars);
  // 再替换静态属性，style也作为属性的一种，目前尚未被设计为被替换
  replaceVars(props, vars);
  let vd;
  if(tagName.charAt(0) === '$') {
    vd = karas.createGm(tagName, props);
  }
  else {
    vd = karas.createVd(tagName, props, children.map(item => parse(karas, item, animateList, vars)));
  }
  let animationRecord;
  if(animate) {
    if(Array.isArray(animate)) {
      let has;
      animate.forEach(item => {
        abbr2full(item, abbrAnimate);
        let { value, options } = item;
        // 忽略空动画
        if(Array.isArray(value) && value.length) {
          has = true;
          value.forEach(item => {
            abbr2full(item, abbrCssProperty);
            replaceVars(item, vars);
          });
        }
        if(options) {
          abbr2full(options, abbrAnimateOption);
          replaceVars(options, vars);
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
          replaceVars(item, vars);
        });
        animationRecord = {
          animate,
          target: vd,
        };
      }
      if(options) {
        abbr2full(options, abbrAnimateOption);
        replaceVars(options, vars);
      }
    }
  }
  // 产生实际动画运行才存入列表供root调用执行
  if(animationRecord) {
    animateList.push(animationRecord);
  }
  return vd;
}

export default parse;
