import enums from '../util/enums';
import unit from '../style/unit';
import level from './level';

const {
  STYLE_KEY: {
    TOP,
    BOTTOM,
    POSITION,
    HEIGHT,
  },
} = enums;
const { AUTO, PX, PERCENT } = unit;
const { REFLOW, LAYOUT, OFFSET } = level;

function offsetAndResizeByNodeOnY(node, root, reflowHash, dy) {
  if(dy) {
    let p = node;
    let last;
    do {
      // component的sr没有next兄弟，视为component的next
      while(p.isShadowRoot) {
        p = p.host;
      }
      last = p;
      let isContainer, resizeAbsList = [];
      if(p.parent) {
        let cs = p.parent.computedStyle;
        let ps = cs[POSITION];
        isContainer = p.parent === root || p.parent.isShadowRoot || ps === 'relative' || ps === 'absolute';
      }
      // 先偏移next，忽略有定位的absolute或LAYOUT，本身非container也忽略
      let next = p.next;
      while(next) {
        if(next.currentStyle[POSITION] === 'absolute') {
          if(isContainer) {
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
            // height为百分比的记录下来后面重新布局
            if(height[1] === PERCENT) {
              resizeAbsList.push(next);
            }
          }
        }
        else if(!next.hasOwnProperty('__uniqueReflowId') || reflowHash[next.__uniqueReflowId] < LAYOUT) {
          next.__offsetY(dy, true, REFLOW);
          next.__cancelCache();
        }
        next = next.next;
      }
      // 要么一定有parent，因为上面向上循环排除了cp返回cp的情况；要么就是root本身
      p = p.parent;
      if(!p) {
        break;
      }
      // parent判断是否要resize
      let { currentStyle } = p;
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
        p.__resizeY(dy, REFLOW);
        p.__cancelCache();
        // 因调整导致的abs尺寸变化，注意排除本身有布局更新的
        resizeAbsList.forEach(item => {
          if(!item.hasOwnProperty('__uniqueReflowId') || reflowHash[item.__uniqueReflowId] < LAYOUT) {
            p.__layoutAbs(p, null, item);
          }
        });
      }
      // abs或者高度不需要继续向上调整提前跳出
      else {
        break;
      }
      if(p === root) {
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
