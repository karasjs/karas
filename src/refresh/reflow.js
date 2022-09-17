import enums from '../util/enums';
import unit from '../style/unit';
import level from './level';
import css from '../style/css';
import Text from '../node/Text';
import Component from '../node/Component';
import Geom from '../node/geom/Geom';
import mode from './mode';

const {
  STYLE_KEY: {
    DISPLAY,
    TOP,
    BOTTOM,
    POSITION,
    WIDTH,
    HEIGHT,
    MARGIN_TOP,
    MARGIN_BOTTOM,
    MARGIN_LEFT,
    BORDER_TOP_WIDTH,
    PADDING_TOP,
    BORDER_LEFT_WIDTH,
    PADDING_LEFT,
  },
} = enums;
const { AUTO, PERCENT } = unit;
const { REPAINT, CACHE } = level;
const { isRelativeOrAbsolute } = css;

function clearSvgCache(node, child) {
  if(child) {
    node.__refreshLevel |= REPAINT;
  }
  else {
    node.__refreshLevel |= CACHE;
  }
  if(Array.isArray(node.children)) {
    node.children.forEach(child => {
      if(child instanceof Component) {
        child = child.shadowRoot;
      }
      clearSvgCache(child, true);
    });
  }
}

// 合并margin，和原本不合并情况下的差值
function getMergeMargin(topList, bottomList) {
  let total = 0;
  let max = topList[0] || 0;
  let min = topList[0] || 0;
  topList.forEach(item => {
    total += item;
    max = Math.max(max, item);
    min = Math.min(min, item);
  });
  bottomList.forEach(item => {
    total += item;
    max = Math.max(max, item);
    min = Math.min(min, item);
  });
  // 正数取最大，负数取最小，正负则相加
  let target = 0;
  if(max > 0 && min > 0) {
    target = Math.max(max, min);
  }
  else if(max < 0 && min < 0) {
    target = Math.min(max, min);
  }
  else if(max !== 0 || min !== 0) {
    target = max + min;
  }
  return {
    target, // 应该的目标margin
    total, // 累计的margin
    diff: target - total,
  };
}

// 提取出对比节点尺寸是否固定非AUTO
function isFixedWidthOrHeight(node, k) {
  let c = node.currentStyle[k];
  return c.u !== AUTO;
}
// 除了固定尺寸，父级也不能是flex
function isFixedSize(node, includeParentFlex) {
  let res = isFixedWidthOrHeight(node, WIDTH) && isFixedWidthOrHeight(node, HEIGHT);
  if(res && includeParentFlex) {
    let parent = node.__domParent;
    if(parent) {
      if(parent.computedStyle[DISPLAY] === 'flex') {
        return false;
      }
    }
  }
  return res;
}

function getPrevMergeMargin(prev, mtList, mbList) {
  while(prev && !(prev instanceof Text) && ['block', 'flex'].indexOf(prev.computedStyle[DISPLAY]) > -1) {
    mbList.push(prev.computedStyle[MARGIN_BOTTOM]);
    if(prev.offsetHeight > 0) {
      break;
    }
    mtList.push(prev.computedStyle[MARGIN_TOP]);
    prev = prev.__prev;
  }
}

function getNextMergeMargin(next, mtList, mbList) {
  while(next && !(next instanceof Text) && ['block', 'flex'].indexOf(next.computedStyle[DISPLAY]) > -1) {
    mtList.push(next.computedStyle[MARGIN_TOP]);
    if(next.offsetHeight > 0) {
      break;
    }
    mbList.push(next.computedStyle[MARGIN_BOTTOM]);
    next = next.__next;
  }
}

function offsetNext(next, diff, parentFixed) {
  while(next) {
    let cs = next.currentStyle;
    // flow流和auto的absolute流需要偏移diff值
    if(cs[POSITION] !== 'absolute' || cs[TOP].u === AUTO && cs[BOTTOM].u === AUTO) {
      next.__offsetY(diff, true, REPAINT);
    }
    // absolute中百分比的特殊计算偏移，但要排除parent固定尺寸
    else if(!parentFixed && cs[POSITION] === 'absolute'
      && (cs[TOP].u === PERCENT || cs[BOTTOM].u === PERCENT)) {
      if(cs[TOP].u === PERCENT) {
        next.__offsetY(diff * 0.01 * cs[TOP].v, true, REPAINT);
      }
      else {
        next.__offsetY(diff * (1 - 0.01 * cs[BOTTOM].v), true, REPAINT);
      }
    }
    next = next.__next;
  }
  return diff;
}

/**
 * 单独提出共用检测影响的函数，从节点本身开始向上分析影响，找到最上层的影响节点设置其重新布局
 * ---
 * 当一个元素absolute时，其变化不会影响父元素和兄弟元素，直接自己重新layout
 * 当absolute发生改变时，其变化会影响父和兄弟，视作父重新布局
 * 当inline变化时，视为其最近block/flex父变化
 * 当block/flex变化时，往上查找最上层flex视为其变化，如没有flex则影响后面兄弟offset和父resize
 * 以上情况向上查找时遇到父absolute均提前跳出，并layout
 * 上面所有情况即便结束还得额外看是否处于absolute中，是还是标记absolute重新布局
 * 当relative只变化left/top/right/bottom时，自己重新layout
 * ===
 * 返回最上层节点，可能为node自己
 */
function checkTop(root, node, addDom, removeDom) {
  if(root === node) {
    return root;
  }
  if(node instanceof Text) {
    node = node.__domParent;
  }
  // add/remove情况abs节点特殊对待不影响其它节点，不能判断display，因为inline会强制block
  if(addDom && node.currentStyle[POSITION] === 'absolute') {
    return node;
  }
  if(removeDom && node.computedStyle[POSITION] === 'absolute') {
    return node;
  }
  let target = node;
  // add/remove的相邻出现inline的话，视为父节点reflow
  if(addDom || removeDom) {
    let isSiblingBlock = true;
    let { __prev, __next } = node;
    if(__prev
      && (__prev instanceof Text
        || ['inline', 'inlineBlock'].indexOf(__prev.computedStyle[DISPLAY]) > -1)) {
      isSiblingBlock = false;
    }
    else if(__next
      && (__next instanceof Text
        || ['inline', 'inlineBlock'].indexOf(__next.computedStyle[DISPLAY]) > -1)) {
      isSiblingBlock = false;
    }
    if(!isSiblingBlock) {
      target = node.__domParent;
      if(target === root) {
        return root;
      }
    }
  }
  // 如果一直是absolute，则不影响其它节点
  if(target.currentStyle[POSITION] === 'absolute' && target.computedStyle[POSITION] === 'absolute') {
    return target;
  }
  // inline节点变为最近的父非inline，自身可能会display变化前后状态都要看，
  // absolute不变会影响但被上面if排除，而absolute发生变化则也需要进入这里
  if(['inline', 'inlineBlock'].indexOf(target.currentStyle[DISPLAY]) > -1
      || ['inline', 'inlineBlock'].indexOf(target.computedStyle[DISPLAY]) > -1) {
    do {
      target = target.__domParent;
      if(target === root) {
        return root;
      }
    }
    // 父节点不会display变化，因为同步检测，只看computedStyle即可
    while(['inline', 'inlineBlock'].indexOf(target.computedStyle[DISPLAY]) > -1
      && target.computedStyle[POSITION] !== 'absolute');
    // target已不是inline，父固定宽高跳出直接父进行LAYOUT即可，不影响上下文，但不能是flex孩子，此时固定尺寸无用
    // root也会进这里，因为root强制固定size
    if(isFixedSize(target, true)) {
      return target;
    }
  }
  // 此时target指向node，如果是inline/absolute变化则是其最近的非inline父
  let parent = target;
  // 向上检查flex/absolute/fixedSize，以最上层的flex视作其更改，node本身flex不进入
  let top;
  do {
    if(parent === root) {
      break;
    }
    if(parent.computedStyle[DISPLAY] === 'flex') {
      top = parent;
    }
    // 遇到固定size提前跳出，以及absolute也是
    if(parent.computedStyle[POSITION] === 'absolute' || isFixedSize(parent, true)) {
      top = parent;
      break;
    }
    parent = parent.__domParent;
  }
  while(parent);
  // 找到最上层flex，视作其更改
  if(top) {
    target = top;
  }
  return target;
}

/**
 * checkReflow之后，节点重新布局对自己next的节点的offset影响，计算偏移量让所有next兄弟offsetY，
 * 以及递归向上父级resize和父级所有next兄弟offsetY
 */
function checkNext(root, top, node, hasZ, addDom, removeDom) {
  let cps = top.computedStyle, crs = top.currentStyle;
  let position = cps[POSITION], display = cps[DISPLAY];
  let isLastAbs = position === 'absolute';
  let isNowAbs = crs[POSITION] === 'absolute';
  let isLastNone = display === 'none';
  let isNowNone = crs[DISPLAY] === 'none';
  let isLast0 = top.offsetHeight === 0;
  // none不可见布局无效可以无视，add/remove已提前判断，none时不会进来
  if(isLastNone && isNowNone) {
    return;
  }
  let parent = top.__domParent, oldH = top.offsetHeight;
  // svg在特殊children顺序变化的情况需清除缓存以便diff运行
  // add/remove已提前自己做好，zIndex有效变化也触发，position变更static和非static触发
  let svg = root.renderMode === mode.SVG;
  if(!addDom && !removeDom) {
    if(hasZ && position === 'static' && crs[POSITION] === 'static') {
      hasZ = false;
    }
    else if(position !== crs[POSITION] && (position === 'static' || crs[POSITION] === 'static')) {
      hasZ = true;
    }
    // 特殊，zIndexChildren不变化但影响svg的diff
    else if(isLastNone !== isNowNone && !hasZ) {
      svg && clearSvgCache(parent, false);
    }
  }
  else {
    hasZ = false;
  }
  // remove自身且abs时不影响其它，除了svg的zIndex
  if(removeDom && top === node && node.computedStyle[POSITION] === 'absolute') {
    top.clearCache(true);
    svg && clearSvgCache(parent, false);
    return;
  }
  // 后续调整offsetY需要考虑mergeMargin各种情况（包含上下2个方向），之前合并前和合并后的差值都需记录
  // 先记录没更新前的，如果是空节点则m1作为整个，忽视m2
  let t1 = 0, d1 = 0, t2 = 0, d2 = 0;
  let mbList = [], mtList = [];
  let prev = top.isShadowRoot ? top.__hostRoot.__prev : top.__prev;
  let next = top.isShadowRoot ? top.__hostRoot.__next : top.__next;
  if(addDom || isLast0) {
    getPrevMergeMargin(prev, mtList, mbList);
    getNextMergeMargin(next, mtList, mbList);
    let t = getMergeMargin(mtList, mbList);
    t1 = t.target;
    d1 = t.diff;
  }
  else {
    getPrevMergeMargin(prev, mtList, mbList);
    mtList.push(cps[MARGIN_TOP]);
    let t = getMergeMargin(mtList, mbList);
    t1 = t.target;
    d1 = t.diff;
    mtList.splice(0);
    mbList.splice(0);
    getNextMergeMargin(next, mtList, mbList);
    mbList.push(cps[MARGIN_BOTTOM]);
    t = getMergeMargin(mtList, mbList);
    t2 = t.target;
    d2 = t.diff;
  }
  // __layoutData使用prev或者父节点，并重新计算y（不包含合并margin），因为display:none或add的无数据或不对
  let __layoutData = parent.__layoutData;
  let x = __layoutData.x;
  let y = __layoutData.y;
  let w = parent.__width;
  let h = parent.__currentStyle[HEIGHT].u === AUTO ? __layoutData.h : parent.__height;
  let current = top;
  // cp的shadowRoot要向上到cp本身，考虑高阶组件在内到真正的顶层cp
  if(current.isShadowRoot) {
    current = current.__hostRoot;
  }
  // y使用prev或者parent的，首个节点无prev，prev要忽略absolute的和display:none的
  let ref = current.__prev;
  let hasFlowPrev;
  while(ref) {
    // 注意有可能是text，视为其父级
    let computedStyle = ref.computedStyle;
    if(computedStyle[POSITION] !== 'absolute' && computedStyle[DISPLAY] !== 'none') {
      y = ref.y + ref.outerHeight;
      hasFlowPrev = true;
      break;
    }
    ref = ref.__prev;
  }
  // 找不到prev以默认parent的为基准，找到则增加自身，排除remove
  let __computedStyle = parent.__computedStyle;
  if(!hasFlowPrev) {
    y += __computedStyle[MARGIN_TOP] + __computedStyle[BORDER_TOP_WIDTH] + __computedStyle[PADDING_TOP];
  }
  x += __computedStyle[MARGIN_LEFT] + __computedStyle[BORDER_LEFT_WIDTH] + __computedStyle[PADDING_LEFT];
  // 特殊的如add/remove时为absolute和none的在调用时即检查提前跳出了，不触发reflow，这里一定是触发的
  // 找到最上层容器供absolute使用，注意top本身是否abs的区别，非abs可能为relative）
  let container = isNowAbs ? parent : top;
  while(container && container !== root) {
    if(isRelativeOrAbsolute(container)) {
      break;
    }
    container = container.__domParent;
  }
  if(!container) {
    container = root;
  }
  // 删除的节点的影响top是自己，无需重新布局只要看next节点的offsetY
  if(removeDom && top === node) {
  }
  // 一定不是add/remove，同步操作提前判断
  else if(isNowNone) {
    top.__layoutNone();
    if(hasZ) {
      parent.__zIndexChildren = null;
      parent.__updateStruct();
      svg && clearSvgCache(parent, false);
    }
  }
  // 现在是定位流，还要看之前是什么
  else if(isNowAbs) {
    parent.__layoutAbs(container, __layoutData, top);
    if(hasZ) {
      parent.__zIndexChildren = null;
      parent.__updateStruct();
      svg && clearSvgCache(parent, false);
    }
    // add/remove的zIndex已提前做好无需关心，只看普通变更
    if(!addDom && !removeDom) {
      // 之前也是abs，可以跳出不会影响其它只看zIndex即可
      if(isLastAbs) {
        top.clearCache(true);
        return;
      }
    }
  }
  // 现在是普通流，不管之前是啥直接布局
  else {
    let ld = Object.assign({}, addDom ? __layoutData : top.__layoutData, {
      x,
      y,
      w,
      h,
    });
    top.__layout(ld, false, false, false);
    // 防止Geom
    if(!(top instanceof Geom)) {
      top.__layoutAbs(container, ld, null);
    }
    if(hasZ) {
      parent.__zIndexChildren = null;
      parent.__updateStruct();
      svg && clearSvgCache(parent, false);
    }
  }
  // add的情况在自身是abs时不影响next，除了svg的zIndex
  if(addDom && top === node && node.currentStyle[POSITION] === 'absolute') {
    top.clearCache(true);
    svg && clearSvgCache(parent, false);
    return;
  }
  // 向上查找最近的relative的parent，获取ox/oy并赋值，无需继续向上递归，因为parent已经递归包含了
  let p = parent;
  while(p) {
    if(p.__computedStyle[POSITION] === 'relative') {
      let { ox, oy } = p;
      ox && top.__offsetX(ox);
      oy && top.__offsetY(oy);
      break;
    }
    p = p.__domParent;
  }
  // 高度不变一直0提前跳出，不影响包含margin合并，但需排除节点add/remove，因为空节点会上下穿透合并
  let isNow0 = removeDom && top === node || top.offsetHeight === 0;
  if(isLast0 && isNow0 && !addDom && !removeDom) {
    top.clearCache(true);
    return;
  }
  // 其它几种忽略的情况
  if(addDom && isNow0 || removeDom && isLast0) {
    top.clearCache(true);
    return;
  }
  // 查看现在的上下margin合并情况，和之前的对比得出diff差值进行offsetY/resizeY
  if(top.isShadowRoot) {
    top = top.__hostRoot;
  }
  let t3 = 0, d3 = 0, t4 = 0, d4 = 0;
  mbList.splice(0);
  mtList.splice(0);
  if(removeDom || isNow0) {
    getPrevMergeMargin(prev, mtList, mbList);
    getNextMergeMargin(next, mtList, mbList);
    let t = getMergeMargin(mtList, mbList);
    t3 = t.target;
    d3 = t.diff;
  }
  else {
    getPrevMergeMargin(prev, mtList, mbList);
    mtList.push(cps[MARGIN_TOP]);
    let t = getMergeMargin(mtList, mbList);
    t3 = t.target;
    d3 = t.diff;
    mtList.splice(0);
    mbList.splice(0);
    getNextMergeMargin(next, mtList, mbList);
    mbList.push(cps[MARGIN_BOTTOM]);
    t = getMergeMargin(mtList, mbList);
    t4 = t.target;
    d4 = t.diff;
  }
  let nowH;
  if(removeDom) {
    let temp = node;
    while(temp.isShadowRoot) {
      temp = temp.__host;
      temp.__destroy();
    }
    if(top === node) {
      nowH = 0;
    }
    else {
      nowH = node.offsetHeight;
    }
  }
  else if(isNowAbs) {
    nowH = 0;
  }
  else {
    nowH = top.offsetHeight;
  }
  // 查看mergeMargin对top造成的偏移
  if(!removeDom && d3) {
    top.__offsetY(d3, false, null);
  }
  // 差值计算注意考虑margin合并前的值，和合并后的差值，height使用offsetHeight不考虑margin
  let diff = t3 + t4 - t1 - t2 + nowH - oldH;
  // console.log('t3', t3, 'd3', d3, 't4', t4, 'd4', d4, 't1', t1, 'd1', d1, 't2', t2, 'd2', d2, nowH, oldH, diff);
  if(!diff) {
    parent.clearCache(true);
    return;
  }
  let parentFixed = isFixedSize(parent, false);
  if(!parentFixed) {
    parent.__resizeY(diff, REPAINT);
  }
  offsetNext(next, diff, parentFixed);
  parent.clearCache(true);
  parent.__refreshLevel |= CACHE;
  if(parentFixed) {
    return;
  }
  // 影响完next之后，向上递归，所有parent的next都影响
  while(parent) {
    next = parent.__next;
    parent = parent.__domParent;
    parentFixed = parent && isFixedSize(parent, false);
    if(!parentFixed) {
      parent.__resizeY(diff, REPAINT);
    }
    offsetNext(next, diff, parentFixed);
    if(parentFixed) {
      parent.clearCache(true);
      return;
    }
  }
}

export default {
  getMergeMargin,
  checkTop,
  checkNext,
  clearSvgCache,
};
