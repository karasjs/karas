import parse from './parse';
import abbr from './abbr';
import inject from '../util/inject';

export default {
  parse(karas, json, dom, options = {}) {
    // 重载，在确定dom传入选择器字符串或html节点对象时作为渲染功能，否则仅创建vd返回
    if(!inject.isDom(dom)) {
      options = dom || {};
      dom = null;
    }
    // 暂存所有动画声明，等root的生成后开始执行
    let animateRecords = [];
    let vd = parse(karas, json, animateRecords, options.vars);
    // 有dom时parse作为根方法渲染
    if(dom) {
      let { tagName } = json;
      if(['canvas', 'svg'].indexOf(tagName) === -1) {
        throw new Error('Parse dom must be canvas/svg');
      }
      // parse直接（非递归）的动画记录
      let ac = vd.animateController;
      ac.__records = animateRecords;
      // 第一次render，收集递归json里面的animateRecords，它在xom的__layout最后生成
      karas.render(vd, dom);
      // 总控次数、速度
      ac.__op(options);
      // 直接的json里的animateRecords，再加上递归的parse的json的（第一次render布局时处理）动画一并播放
      if(!options.hasOwnProperty('autoPlay') || options.autoPlay) {
        ac.play();
      }
    }
    // 递归的parse，如果有动画，此时还没root，先暂存下来，等上面的root的render第一次布局时收集
    else {
      if(animateRecords.length) {
        vd.__animateRecords = animateRecords;
      }
    }
    return vd;
  },
  abbr,
};
