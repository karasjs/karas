import Node from '../node/Node';
import Component from '../node/Component';
import util from '../util/util';

let { isPrimitive } = util;

/**
 * 入口方法，animateRecords记录所有的动画结果等初始化后分配开始动画
 * hash为library库的hash格式，将原本数组转为id和value访问，每递归遇到library形成一个新的scope重新初始化
 * offsetTime默认0，递归传下去为右libraryId引用的元素增加偏移时间，为了库元素动画复用而开始时间不同
 * @param karas
 * @param json
 * @param animateRecords
 * @param opt
 * @param offsetTime
 * @returns {Node|Component|*}
 */
function parse(karas, json, animateRecords, opt, offsetTime) {
  if(isPrimitive(json) || json instanceof Node || json instanceof Component) {
    return json;
  }
  if(Array.isArray(json)) {
    return json.map(item => {
      return parse(karas, item, animateRecords, opt, offsetTime);
    });
  }
  let oft = offsetTime; // 暂存，后续生成动画用这个值
  offsetTime += json.offsetTime || 0; // 可能有时间偏移加上为递归准备
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
      return parse(karas, item, animateRecords, opt, offsetTime);
    }));
  }
  else {
    vd = karas.createVd(tagName, props, children.map(item => {
      return parse(karas, item, animateRecords, opt, offsetTime);
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
        offsetTime: oft,
      });
    }
  }
  return vd;
}

export default parse;
