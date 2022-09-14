import enums from '../util/enums';
import unit from '../style/unit';
import level from './level';
import css from '../style/css';
import mode from './mode';
import Component from '../node/Component';
import Text from '../node/Text';

const {
  STYLE_KEY: {
    DISPLAY,
    TOP,
    BOTTOM,
    POSITION,
    WIDTH,
    HEIGHT,
    Z_INDEX,
    MARGIN_TOP,
    MARGIN_LEFT,
    BORDER_TOP_WIDTH,
    PADDING_TOP,
    BORDER_LEFT_WIDTH,
    PADDING_LEFT,
  },
} = enums;
const { AUTO, PX, PERCENT } = unit;
const { REPAINT, REFLOW } = level;
const { isRelativeOrAbsolute } = css;

function cleanSvgCache(node, child) {
  if(child) {
    node.__refreshLevel |= REPAINT;
  }
  else {
    node.__cacheTotal.release();
  }
  if(Array.isArray(node.children)) {
    node.children.forEach(child => {
      if(child instanceof Component) {
        child = child.shadowRoot;
      }
      if(!(child instanceof Text)) {
        cleanSvgCache(child, true);
      }
    });
  }
}

function offsetAndResizeByNodeOnY(node, root, reflowHash, dy, inDirectAbsList) {
  if(dy) {
    let last;
    do {
      // component的sr没有next兄弟，视为component的next
      while(node.isShadowRoot) {
        node = node.host;
      }
      last = node;
      let isContainer, parent = node.domParent;
      if(parent) {
        let cs = parent.computedStyle;
        let ps = cs[POSITION];
        isContainer = parent === root || parent.isShadowRoot || ps === 'relative' || ps === 'absolute';
      }
      // 先偏移next，忽略有定位的absolute，本身非container也忽略
      let next = node.next;
      let container;
      while(next) {
        if(next.computedStyle[DISPLAY] !== 'none') {
          if(next.currentStyle[POSITION] === 'absolute') {
            let { [TOP]: top, [BOTTOM]: bottom, [HEIGHT]: height } = next.currentStyle;
            if(top.u === AUTO) {
              if(bottom.u === AUTO || bottom.u === PX) {
                next.__offsetY(dy, true, REFLOW);
                next.clearCache();
              }
              else if(bottom.u === PERCENT) {
                let v = (1 - bottom.v * 0.01) * dy;
                next.__offsetY(v, true, REFLOW);
                next.clearCache();
              }
            }
            else if(top.u === PERCENT) {
              let v = top.v * 0.01 * dy;
              next.__offsetY(v, true, REFLOW);
              next.clearCache();
            }
            // 高度百分比需发生变化的重新布局，需要在容器内
            if(height.u === PERCENT) {
              if(isContainer) {
                parent.__layoutAbs(parent, parent.__layoutData, next);
              }
              else {
                if(!container) {
                  container = parent;
                  while(container) {
                    if(container === root || container.isShadowRoot) {
                      break;
                    }
                    let cs = container.currentStyle;
                    if(cs[POSITION] === 'absolute' || cs[POSITION] === 'relative') {
                      break;
                    }
                    container = container.domParent;
                  }
                }
                inDirectAbsList.push([parent, container, next]);
              }
            }
          }
          else {
            next.__offsetY(dy, true, REFLOW);
            next.clearCache();
          }
        }
        next = next.next;
      }
      // root本身没domParent
      if(!parent) {
        break;
      }
      node = parent;
      // parent判断是否要resize
      let { currentStyle } = node;
      let isAbs = currentStyle[POSITION] === 'absolute';
      let need;
      if(isAbs) {
        if(currentStyle[HEIGHT].u === AUTO
          && (currentStyle[TOP].u === AUTO || currentStyle[BOTTOM].u === AUTO)) {
          need = true;
        }
      }
      // height不定则需要
      else if(currentStyle[HEIGHT].u === AUTO) {
        need = true;
      }
      if(need) {
        node.__resizeY(dy, REFLOW);
        node.clearCache();
      }
      // abs或者高度不需要继续向上调整提前跳出
      else {
        break;
      }
      if(node === root) {
        break;
      }
    }
    while(true);
    // 最后一个递归向上取消总缓存，防止过程中重复next多次无用递归
    while(last) {
      last.clearCache();
      last = last.domParent;
    }
  }
}

function clearUniqueReflowId(hash) {
  for(let i in hash) {
    if(hash.hasOwnProperty(i)) {
      let { node } = hash[i];
      delete node.__uniqueReflowId;
    }
  }
}

function getMergeMargin(topList, bottomList) {
  let total = 0;
  let max = topList[0];
  let min = topList[0];
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
  let diff = 0;
  if(max > 0 && min > 0) {
    diff = Math.max(max, min) - total;
  }
  else if(max < 0 && min < 0) {
    diff = Math.min(max, min) - total;
  }
  else if(max !== 0 || min !== 0) {
    diff = max + min - total;
  }
  return diff;
}

// 提取出对比节点尺寸是否固定非AUTO
function isFixedWidthOrHeight(node, k) {
  let c = node.__currentStyle[k];
  return c.u !== AUTO;
}
// 除了固定尺寸，父级也不能是flex
function isFixedSize(node, includeParentFlex) {
  let res = isFixedWidthOrHeight(node, WIDTH) && isFixedWidthOrHeight(node, HEIGHT);
  if(res && includeParentFlex) {
    let parent = node.__domParent;
    if(parent) {
      if(parent.__computedStyle[DISPLAY] === 'flex') {
        return false;
      }
    }
  }
  return res;
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
  // add/remove情况abs节点特殊对待不影响其它节点，不能判断display，因为inline会强制block
  if(addDom && node.__currentStyle[POSITION] === 'absolute') {
    return node;
  }
  if(removeDom && node.__computedStyle[POSITION] === 'absolute') {
    return node;
  }
  let target = node;
  // add/remove的相邻出现inline的话，视为父节点reflow
  if(addDom || removeDom) {
    let isSiblingBlock = true;
    let { __prev, __next } = node;
    if(__prev
      && (__prev instanceof Text
        || ['inline', 'inlineBlock'].indexOf(__prev.__computedStyle[DISPLAY]) > -1)) {
      isSiblingBlock = false;
    }
    else if(__next
      && (__next instanceof Text
        || ['inline', 'inlineBlock'].indexOf(__next.__computedStyle[DISPLAY]) > -1)) {
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
  if(target.__currentStyle[POSITION] === 'absolute' && target.__computedStyle[POSITION] === 'absolute') {
    return target;
  }
  // inline节点变为最近的父非inline，自身可能会display变化前后状态都要看，
  // absolute不变会影响但被上面if排除，而absolute发生变化则也需要进入这里
  if(['inline', 'inlineBlock'].indexOf(target.__currentStyle[DISPLAY]) > -1
      || ['inline', 'inlineBlock'].indexOf(target.__computedStyle[DISPLAY]) > -1) {
    do {
      target = target.__domParent;
      if(target === root) {
        return root;
      }
    }
    // 父节点不会display变化，因为同步检测，只看computedStyle即可
    while(['inline', 'inlineBlock'].indexOf(target.__computedStyle[DISPLAY]) > -1
      && target.__computedStyle[POSITION] !== 'absolute');
    // target已不是inline，父固定宽高跳出直接父进行LAYOUT即可，不影响上下文，但不能是flex孩子，此时固定尺寸无用
    // root也会进这里，因为root强制固定size
    if(isFixedSize(target, true)) {
      return target;
    }
  }
  // 此时target指向node，如果是inline/absolute变化则是其最近的非inline父
  let parent = target.__domParent;
  // 向上检查flex/absolute/fixedSize，以最上层的flex视作其更改，node本身flex不进入
  let top;
  do {
    if(parent === root) {
      return root;
    }
    if(parent.__computedStyle[DISPLAY] === 'flex') {
      top = parent;
    }
    // 遇到固定size提前跳出，以及absolute也是
    if(parent.__computedStyle[POSITION] === 'absolute' || isFixedSize(parent, true)) {
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
function checkNext(root, top, node, addDom, removeDom) {
  let cps = top.__computedStyle, crs = top.__currentStyle;
  let position = cps[POSITION], display = cps[DISPLAY];
  let isLastAbs = position === 'absolute';
  let isNowAbs = crs[POSITION] === 'absolute';
  let isLastNone = display === 'none';
  let isNowNone = crs[DISPLAY] === 'none';
  // none不可见布局无效可以无视
  if(isLastNone && isNowNone) {
    return;
  }
  let parent = top.__domParent;
  // __layoutData使用prev或者父节点，并重新计算y，因为display:none或add的无数据或不对
  let __layoutData = parent.__layoutData;
  let x = __layoutData.x;
  let y = __layoutData.y;
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
  // 找到最上层容器供absolute使用
  let container = parent;
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
  else if(isNowNone) {
    top.__layoutNone();
    if(!addDom && !removeDom) {
      parent.__zIndexChildren = null;
      top.__modifyStruct();
    }
  }
  // 现在是定位流，还要看之前是什么
  else if(isNowAbs) {
    parent.__layoutAbs(container, parent.__layoutData, top);
    if(!addDom && !removeDom) {
      parent.__zIndexChildren = null;
      parent.__modifyStruct();
    }
    // 之前也是abs，可以跳出不会影响其它
    if(isLastAbs) {
      return;
    }
  }
  // 现在是普通流，不管之前是啥直接布局
  else {
    let ld = Object.assign(__layoutData, {
      x,
      y,
    });
    top.__layout(ld, false, false, false);
    if(!addDom && !removeDom) {
      top.__zIndexChildren = null;
      top.__modifyStruct();
    }
    y += top.outerHeight;
    top.__layoutAbs(container, ld, null);
  }
  // add/remove的情况在自身是abs时不影响next
  if(addDom && top === node && node.__currentStyle[POSITION] === 'absolute') {
    return;
  }
  if(removeDom && top === node && node.__computedStyle[POSITION] === 'absolute') {
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
  // 调整next的位置，offsetY，abs特殊处理，margin在merge中做
  let next = top.__next, diff;
  while(next) {
    let cs = next.__currentStyle;
    if(cs[POSITION] !== 'absolute' || cs[TOP].u === AUTO && cs[BOTTOM].u === AUTO) {
      // 第一次计算，后面通用
      if(diff === undefined) {
        diff = y - next.y;
      }
      if(diff) {
        next.__offsetY(diff, true, REPAINT);
      }
      else {
        break;
      }
    }
    next = next.__next;
  }
  if(!diff) {
    return;
  }
  // 影响完next之后，向上递归，所有parent的next都影响
  while(parent) {
    let p = parent.__domParent;
    if(p) {}
    parent = p;
  }
}

export default {
  offsetAndResizeByNodeOnY,
  clearUniqueReflowId,
  getMergeMargin,
  checkTop,
  checkNext,
  cleanSvgCache,
};
