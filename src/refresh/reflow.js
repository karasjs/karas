import enums from '../util/enums';
import unit from '../style/unit';
import level from './level';

const {
  STYLE_KEY: {
    DISPLAY,
    TOP,
    BOTTOM,
    POSITION,
    HEIGHT,
  },
} = enums;
const { AUTO, PX, PERCENT } = unit;
const { REFLOW } = level;

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
        if(next.currentStyle[DISPLAY] !== 'none') {
          if(next.currentStyle[POSITION] === 'absolute') {
            let { [TOP]: top, [BOTTOM]: bottom, [HEIGHT]: height } = next.currentStyle;
            if(top[1] === AUTO) {
              if(bottom[1] === AUTO || bottom[1] === PX) {
                next.__offsetY(dy, true, REFLOW);
                next.__cancelCache();
              }
              else if(bottom[1] === PERCENT) {
                let v = (1 - bottom[0] * 0.01) * dy;
                next.__offsetY(v, true, REFLOW);
                next.__cancelCache();
              }
            }
            else if(top[1] === PERCENT) {
              let v = top[0] * 0.01 * dy;
              next.__offsetY(v, true, REFLOW);
              next.__cancelCache();
            }
            // 高度百分比需发生变化的重新布局，需要在容器内
            if(height[1] === PERCENT) {
              if(isContainer) {
                parent.__layoutAbs(parent, null, next);
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
            next.__cancelCache();
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
        if(currentStyle[HEIGHT][1] === AUTO
          && (currentStyle[TOP][1] === AUTO || currentStyle[BOTTOM][1] === AUTO)) {
          need = true;
        }
      }
      // height不定则需要
      else if(currentStyle[HEIGHT][1] === AUTO) {
        need = true;
      }
      if(need) {
        node.__resizeY(dy, REFLOW);
        node.__cancelCache();
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
      last.__cancelCache(true);
      last = last.domParent;
    }
  }
}

export default {
  offsetAndResizeByNodeOnY,
};
