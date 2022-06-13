import Node from '../node/Node';
import Component from '../node/Component';
import $$type from '../util/$$type';
import util from '../util/util';

const { TYPE_VD, TYPE_GM, TYPE_CP } = $$type;

let { isPrimitive } = util;

/**
 * 入口方法，animateRecords记录所有的动画结果等初始化后分配开始动画
 * hash为library库的hash格式，将原本数组转为id和value访问，每递归遇到library形成一个新的scope重新初始化
 * offsetTime默认0，递归传下去为右libraryId引用的元素增加偏移时间，为了库元素动画复用而开始时间不同
 * @param karas
 * @param json
 * @param animateRecords
 * @param opt
 * @returns {Node|Component|*}
 */
function parse(karas, json, animateRecords, opt) {
  if(isPrimitive(json) || json instanceof Node || json instanceof Component) {
    return json;
  }
  if(Array.isArray(json)) {
    return json.map(item => {
      return parse(karas, item, animateRecords, opt);
    });
  }
  // let oft = offsetTime; // 暂存，后续生成动画用这个值
  // // 先判断是否是个链接到库的节点，是则进行链接操作
  // let libraryId = json.libraryId;
  // if(!isNil(libraryId)) {
  //   let libraryItem = hash[libraryId];
  //   // 规定图层child只有init和动画，tagName和属性和子图层来自库
  //   if(libraryItem) {
  //     linkChild(json, libraryItem);
  //     offsetTime += json.offsetTime || 0; // 可能有时间偏移加上为递归准备
  //   }
  //   else {
  //     throw new Error('Link library miss id: ' + libraryId);
  //   }
  //   delete json.libraryId;
  // }
  // // 再判断是否有library形成一个新的作用域，会出现library下的library使得一个链接节点链接后出现library的情况
  // let library = json.library;
  // if(Array.isArray(library)) {
  //   hash = {};
  //   library.forEach(item => {
  //     linkLibrary(item, hash);
  //   });
  //   // 替换library插槽
  //   replaceLibraryVars(json, hash, opt.vars);
  //   delete json.library;
  // }
  let { tagName, props = {}, children = [], animate = [] } = json;
  if(!tagName) {
    throw new Error('Dom must have a tagName: ' + JSON.stringify(json));
  }
  // // 缩写src和font
  // let src = props.src;
  // if(/^#\d+$/.test(src)) {
  //   let imgs = opt.imgs, i = parseInt(src.slice(1));
  //   if(Array.isArray(imgs)) {
  //     props.src = imgs[i];
  //   }
  // }
  // let style = props.style;
  // if(style) {
  //   let fontFamily = style.fontFamily;
  //   if(/^#\d+$/.test(fontFamily)) {
  //     let fonts = opt.fonts, i = parseInt(fontFamily.slice(1));
  //     if(Array.isArray(fonts)) {
  //       style.fontFamily = fonts[i];
  //     }
  //   }
  // }
  // (opt.abbr !== false) && abbr2full(style, abbrCssProperty);
  // // 先替换style的
  // replaceVars(style, opt.vars);
  // // 再替换静态属性，style也作为属性的一种，目前尚未被设计为被替换
  // replaceVars(props, opt.vars);
  // // 替换children里的内容，如文字，无法直接替换tagName/props/children/animate本身，因为下方用的还是原引用
  // replaceVars(json, opt.vars);
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
      if(item && [TYPE_VD, TYPE_GM, TYPE_CP].indexOf(item.$$type) > -1) {
        return item;
      }
      return parse(karas, item, animateRecords, opt);
    }));
  }
  else {
    vd = karas.createVd(tagName, props, children.map(item => {
      if(item && [TYPE_VD, TYPE_GM, TYPE_CP].indexOf(item.$$type) > -1) {
        return item;
      }
      return parse(karas, item, animateRecords, opt);
    }));
  }
  if(animate) {
    if(!Array.isArray(animate)) {
      animate = [animate];
    }
    let has;
    animate.forEach(item => {
      // (opt.abbr !== false) && abbr2full(item, abbrAnimate);
      let { value, options } = item;
      // 忽略空动画
      if(Array.isArray(value) && value.length) {
        has = true;
        // value.forEach(item => {
        //   (opt.abbr !== false) && abbr2full(item, abbrCssProperty);
        //   replaceVars(item, opt.vars);
        // });
      }
      // if(options) {
      //   (opt.abbr !== false) && abbr2full(options, abbrAnimateOption);
      //   replaceVars(options, opt.vars);
      //   replaceAnimateOptions(options, opt);
      // }
    });
    // 产生实际动画运行才存入列表供root调用执行
    if(has) {
      animateRecords.push({
        animate,
        target: vd,
        // offsetTime: oft,
      });
    }
  }
  return vd;
}

export default parse;
