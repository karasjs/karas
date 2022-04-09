import Ellipsis from './Ellipsis';
import TextBox from './TextBox';
import enums from '../util/enums';

const {
  STYLE_KEY: {
    MARGIN_LEFT,
    MARGIN_RIGHT,
    PADDING_LEFT,
    PADDING_RIGHT,
    BORDER_LEFT_WIDTH,
    BORDER_RIGHT_WIDTH,
  },
} = enums;

/**
 * 获取inline的每一行内容的矩形坐标4个点，同时附带上border的矩形，比前面4个点尺寸大或相等（有无border/padding）
 * @param xom
 * @param contentBoxList
 * @param start
 * @param end
 * @param lineBox
 * @param baseline
 * @param lineHeight
 * @param diffL
 * @param isStart
 * @param isEnd
 * @param backgroundClip
 * @param paddingTop
 * @param paddingRight
 * @param paddingBottom
 * @param paddingLeft
 * @param borderTopWidth
 * @param borderRightWidth
 * @param borderBottomWidth
 * @param borderLeftWidth
 * @returns {(*|number)[]}
 */
function getInlineBox(xom, contentBoxList, start, end, lineBox, baseline, lineHeight, diffL, isStart, isEnd,
                      backgroundClip, paddingTop, paddingRight, paddingBottom, paddingLeft,
                      borderTopWidth, borderRightWidth, borderBottomWidth, borderLeftWidth) {
  // 根据bgClip确定y伸展范围，inline渲染bg扩展到pb的位置不影响布局
  let eyt = 0, eyb = 0;
  if(backgroundClip === 'paddingBox') {
    eyt = paddingTop;
    eyb = paddingBottom;
  }
  else if(backgroundClip !== 'contentBox') {
    eyt = paddingTop + borderTopWidth;
    eyb = paddingBottom + borderBottomWidth;
  }
  // 同y的border伸展范围，其影响border渲染
  let pbt = paddingTop + borderTopWidth;
  let pbb = paddingBottom + borderBottomWidth;
  // inline的baseline和lineBox的差值
  let diff = lineBox.baseline - baseline;
  // x坐标取首尾contentBox的左右2侧，clip布局时已算好；y是根据lineHeight和lineBox的高度以及baseline对齐后计算的
  let x1 = start.x;
  let dom = start instanceof TextBox ? start.parent.domParent : start.domParent;
  while(dom !== xom) {
    let list = dom.contentBoxList;
    if(start === list[0]) {
      let {
        [MARGIN_LEFT]: marginLeft,
        [PADDING_LEFT]: paddingLeft,
        [BORDER_LEFT_WIDTH]: borderLeftWidth,
      } = dom.computedStyle;
      x1 -= marginLeft + paddingLeft + borderLeftWidth;
    }
    dom = dom.domParent;
  }
  let bx1 = x1;
  if(isStart) {
    if(backgroundClip === 'paddingBox') {
      x1 -= paddingLeft;
    }
    else if(backgroundClip !== 'contentBox') {
      x1 -= paddingLeft + borderLeftWidth;
    }
    bx1 -= paddingLeft + borderLeftWidth;
  }
  let y1 = lineBox.y + diff - eyt;
  let by1 = lineBox.y + diff - pbt;
  let x2 = end.x + end.outerWidth;
  // TextBox的parent是Text，再是Dom，这里一定是inline，无嵌套就是xom本身，有则包含若干层最上层还是xom
  dom = end instanceof TextBox ? end.parent.domParent : end.domParent;
  // 从end开始，向上获取dom节点的尾部mpb进行累加，直到xom跳出
  while(dom !== xom) {
    let list = dom.contentBoxList;
    if(end === list[list.length - 1]) {
      let {
        [MARGIN_RIGHT]: marginRight,
        [PADDING_RIGHT]: paddingRight,
        [BORDER_RIGHT_WIDTH]: borderRightWidth,
      } = dom.computedStyle;
      x2 += marginRight + paddingRight + borderRightWidth;
    }
    dom = dom.domParent;
  }
  let bx2 = x2;
  if(isEnd) {
    if(backgroundClip === 'paddingBox') {
      x2 += paddingRight;
    }
    else if(backgroundClip !== 'contentBox') {
      x2 += paddingRight + borderRightWidth;
    }
    bx2 += paddingRight + borderRightWidth;
  }
  let y2 = lineBox.y + diff + lineHeight - diffL + eyb;
  let by2 = lineBox.y + diff + lineHeight - diffL + pbb;
  // x要考虑xom的ox值
  x1 += xom.ox;
  x2 += xom.ox;
  bx1 += xom.ox;
  bx2 += xom.ox;
  y1 += xom.oy;
  y2 += xom.oy;
  by1 += xom.oy;
  by2 += xom.oy;
  return [x1, y1, x2, y2, bx1, by1, bx2, by2];
}

/**
 * 统计inline的所有contentBox排成一行时的总宽度，考虑嵌套的mpb
 * @param xom
 * @param contentBoxList
 * @returns {number}
 */
function getInlineWidth(xom, contentBoxList) {
  let sum = 0;
  let length = contentBoxList.length;
  if(contentBoxList[length - 1] instanceof Ellipsis) {
    length--;
  }
  for(let i = 0; i < length; i++) {
    let contentBox = contentBoxList[i];
    sum += contentBox.width;
    // 嵌套时，首尾box考虑mpb
    let dom = contentBox instanceof TextBox ? contentBox.parent.domParent : contentBox.domParent;
    while(dom !== xom) {
      let list = dom.contentBoxList;
      if(contentBox === list[0]) {
        let {
          [MARGIN_LEFT]: marginLeft,
          [PADDING_LEFT]: paddingLeft,
          [BORDER_LEFT_WIDTH]: borderLeftWidth,
        } = dom.computedStyle;
        sum += marginLeft + paddingLeft + borderLeftWidth;
      }
      if(contentBox === list[list.length - 1]) {
        let {
          [MARGIN_RIGHT]: marginRight,
          [PADDING_RIGHT]: paddingRight,
          [BORDER_RIGHT_WIDTH]: borderRightWidth,
        } = dom.computedStyle;
        sum += marginRight + paddingRight + borderRightWidth;
      }
      dom = dom.domParent;
    }
  }
  return sum;
}

export default {
  getInlineBox,
  getInlineWidth,
};
