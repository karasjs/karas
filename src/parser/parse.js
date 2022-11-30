import Node from '../node/Node';
import Component from '../node/Component';
import util from '../util/util';

let { isPrimitive, isNil } = util;

/**
 * 入口方法，animateRecords记录所有的动画结果等初始化后分配开始动画
 * offsetTime默认0，递归传下去为右libraryId引用的元素增加偏移时间，为了库元素动画复用而开始时间不同
 * @param karas
 * @param json
 * @param animateRecords
 * @param areaStart 为了和AE功能对应，播放一段动画，特增加这2个参数，递归相加起效
 * @param areaDuration 最外层优先
 * @returns {Node|Component|*}
 */
function parse(karas, json, animateRecords, areaStart, areaDuration) {
  if(isPrimitive(json) || json instanceof Node || json instanceof Component) {
    return json;
  }
  if(Array.isArray(json)) {
    return json.map(item => {
      return parse(karas, item, animateRecords, areaStart, areaDuration);
    });
  }
  areaStart += parseInt(json.areaStart) || 0;
  if(areaDuration === null) {
    if(!isNil(json.areaDuration)) {
      let n = parseInt(json.areaDuration);
      if(!isNaN(n) && n > 0) {
        areaDuration = n;
      }
    }
  }
  let { tagName, props = {}, children = [], animate = [] } = json;
  if(!tagName) {
    throw new Error('Dom must have a tagName: ' + JSON.stringify(json));
  }
  if(!Array.isArray(children)) {
    throw new Error('children must be an array');
  }
  let vd;
  if(tagName.charAt(0) === '$') {
    vd = karas.createGm(tagName, props);
  }
  else if(/^[A-Z]/.test(tagName)) {
    let cp = Component.getRegister(tagName);
    vd = karas.createCp(cp, props, children.map(item => {
      return parse(karas, item, animateRecords, areaStart, areaDuration);
    }));
  }
  else {
    vd = karas.createVd(tagName, props, children.map(item => {
      return parse(karas, item, animateRecords, areaStart, areaDuration);
    }));
  }
  if(animate) {
    if(!Array.isArray(animate)) {
      animate = [animate];
    }
    let has;
    animate.forEach(item => {
      let { value } = item;
      // 忽略空动画
      if(Array.isArray(value) && value.length) {
        has = true;
      }
    });
    // 产生实际动画运行才存入列表供root调用执行
    if(has) {
      animateRecords.push({
        animate,
        target: vd,
        areaStart,
        areaDuration,
      });
    }
  }
  return vd;
}

export default parse;
