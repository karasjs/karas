import Ellipsis from './Ellipsis';
import TextBox from './TextBox';
import enums from '../util/enums';

const {
  STYLE_KEY: {
    MARGIN_TOP,
    MARGIN_LEFT,
    MARGIN_RIGHT,
    MARGIN_BOTTOM,
    PADDING_TOP,
    PADDING_LEFT,
    PADDING_RIGHT,
    PADDING_BOTTOM,
    BORDER_TOP_WIDTH,
    BORDER_LEFT_WIDTH,
    BORDER_RIGHT_WIDTH,
    BORDER_BOTTOM_WIDTH,
  },
} = enums;

/**
 * 获取inline的每一行内容的矩形坐标4个点，同时附带上border的矩形，比前面4个点尺寸大或相等（有无border/padding）
 * @param xom
 * @param isVertical
 * @param contentBoxList
 * @param start
 * @param end
 * @param lineBox
 * @param baseline
 * @param lineHeight
 * @param leading
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
function getInlineBox(xom, isVertical, contentBoxList, start, end, lineBox, baseline,
                      lineHeight, leading, isStart, isEnd, backgroundClip,
                      paddingTop, paddingRight, paddingBottom, paddingLeft,
                      borderTopWidth, borderRightWidth, borderBottomWidth, borderLeftWidth) {
  // 根据bgClip确定y伸展范围，inline渲染bg扩展到pb的位置不影响布局
  let bcStart = 0, bcEnd = 0;
  let pbStart = isVertical ? (paddingLeft + borderLeftWidth) : (paddingTop + borderTopWidth);
  let pbEnd = isVertical ? (paddingRight + borderRightWidth) : (paddingBottom + borderBottomWidth);
  if(backgroundClip === 'paddingBox') {
    bcStart = isVertical ? paddingLeft : paddingTop;
    bcEnd = isVertical ? paddingRight : paddingBottom;
  }
  else if(backgroundClip === 'borderBox') {
    bcStart = pbStart;
    bcEnd = pbEnd;
  }
  // inline的baseline和lineBox的差值，不同lh时造成的偏移，一般为多个textBox时比较小的那个发生
  // 垂直排版不能简单算baseline差值，因为原点坐标系不一样
  let diff;
  if(isVertical) {
    diff = lineBox.verticalBaseline - baseline;
  }
  else {
    diff = lineBox.baseline - baseline;
  }
  let x1, y1, x2, y2, bx1, by1, bx2, by2;
  // x坐标取首尾contentBox的左右2侧，clip布局时已算好；y是根据lineHeight和lineBox的高度以及baseline对齐后计算的
  // 垂直排版则互换x/y逻辑
  if(isVertical) {
    x1 = lineBox.x + diff - bcStart + leading;
    y1 = start.y;
    bx1 = lineBox.x + diff - pbStart + leading;
  }
  else {
    x1 = start.x;
    y1 = lineBox.y + diff - bcStart + leading;
    by1 = lineBox.y + diff - pbStart + leading;
  }
  // 容器内包含的inline节点，需考虑行首水平mbp（垂直排版为垂直头mbp）
  let dom = start instanceof TextBox ? start.parent.domParent : start.domParent;
  while(dom !== xom) {
    let list = dom.contentBoxList;
    if(start === list[0]) {
      if(isVertical) {
        let {
          [MARGIN_TOP]: marginTop,
          [PADDING_TOP]: paddingTop,
          [BORDER_TOP_WIDTH]: borderTopWidth,
        } = dom.computedStyle;
        y1 -= marginTop + paddingTop + borderTopWidth;
      }
      else {
        let {
          [MARGIN_LEFT]: marginLeft,
          [PADDING_LEFT]: paddingLeft,
          [BORDER_LEFT_WIDTH]: borderLeftWidth,
        } = dom.computedStyle;
        x1 -= marginLeft + paddingLeft + borderLeftWidth;
      }
    }
    dom = dom.domParent;
  }
  // 第一个需考虑容器本身的padding/border
  if(isVertical) {
    by1 = y1;
    if(isStart) {
      by1 -= paddingTop + borderTopWidth;
      if(backgroundClip === 'paddingBox') {
        y1 -= paddingTop;
      }
      else if(backgroundClip === 'borderBox') {
        y1 -= paddingTop + borderTopWidth;
      }
    }
    x2 = lineBox.x + diff + lineHeight + bcEnd - leading;
    bx2 = lineBox.x + diff + lineHeight + pbEnd - leading;
    y2 = end.y + end.outerHeight;
  }
  else {
    bx1 = x1;
    if(isStart) {
      bx1 -= paddingLeft + borderLeftWidth;
      if(backgroundClip === 'paddingBox') {
        x1 -= paddingLeft;
      }
      else if(backgroundClip === 'borderBox') {
        x1 -= paddingLeft + borderLeftWidth;
      }
    }
    x2 = end.x + end.outerWidth;
    y2 = lineBox.y + diff + lineHeight + bcEnd - leading;
    by2 = lineBox.y + diff + lineHeight + pbEnd - leading;
  }
  // TextBox的parent是Text，再是Dom，这里一定是inline，无嵌套就是xom本身，有则包含若干层最上层还是xom
  dom = end instanceof TextBox ? end.parent.domParent : end.domParent;
  // 从end开始，向上获取dom节点的尾部mpb进行累加，直到xom跳出
  while(dom !== xom) {
    let list = dom.contentBoxList;
    if(end === list[list.length - 1]) {
      if(isVertical) {
        let {
          [MARGIN_BOTTOM]: marginBottom,
          [PADDING_BOTTOM]: paddingBottom,
          [BORDER_BOTTOM_WIDTH]: borderBottomWidth,
        } = dom.computedStyle;
        y2 += marginBottom + paddingBottom + borderBottomWidth;
      }
      else {
        let {
          [MARGIN_RIGHT]: marginRight,
          [PADDING_RIGHT]: paddingRight,
          [BORDER_RIGHT_WIDTH]: borderRightWidth,
        } = dom.computedStyle;
        x2 += marginRight + paddingRight + borderRightWidth;
      }
    }
    dom = dom.domParent;
  }
  if(isVertical) {
    by2 = y2;
    if(isEnd) {
      by2 += paddingBottom + borderBottomWidth;
      if(backgroundClip === 'paddingBox') {
        y2 += paddingBottom;
      }
      else if(backgroundClip === 'borderBox') {
        y2 += paddingBottom + borderBottomWidth;
      }
    }
  }
  else {
    bx2 = x2;
    if(isEnd) {
      bx2 += paddingRight + borderRightWidth;
      if(backgroundClip === 'paddingBox') {
        x2 += paddingRight;
      }
      else if(backgroundClip === 'borderBox') {
        x2 += paddingRight + borderRightWidth;
      }
    }
  }
  // 要考虑xom的ox/oy值
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
 * @param isVertical
 * @returns {number}
 */
function getInlineWidth(xom, contentBoxList, isVertical) {
  let sum = 0;
  let length = contentBoxList.length;
  if(contentBoxList[length - 1] instanceof Ellipsis) {
    length--;
  }
  for(let i = 0; i < length; i++) {
    let contentBox = contentBoxList[i];
    if(isVertical) {
      sum += contentBox.height;
    }
    else {
      sum += contentBox.width;
    }
    // 嵌套时，首尾box考虑mpb
    let dom = contentBox instanceof TextBox ? contentBox.parent.domParent : contentBox.domParent;
    while(dom !== xom) {
      let list = dom.contentBoxList;
      if(contentBox === list[0]) {
        if(isVertical) {
          let {
            [MARGIN_TOP]: marginTop,
            [PADDING_TOP]: paddingTop,
            [BORDER_TOP_WIDTH]: borderTopWidth,
          } = dom.computedStyle;
          sum += marginTop + paddingTop + borderTopWidth;
        }
        else {
          let {
            [MARGIN_LEFT]: marginLeft,
            [PADDING_LEFT]: paddingLeft,
            [BORDER_LEFT_WIDTH]: borderLeftWidth,
          } = dom.computedStyle;
          sum += marginLeft + paddingLeft + borderLeftWidth;
        }
      }
      if(contentBox === list[list.length - 1]) {
        if(isVertical) {
          let {
            [MARGIN_BOTTOM]: marginBottom,
            [PADDING_BOTTOM]: paddingBottom,
            [BORDER_BOTTOM_WIDTH]: borderBottomWidth,
          } = dom.computedStyle;
          sum += marginBottom + paddingBottom + borderBottomWidth;
        }
        else {
          let {
            [MARGIN_RIGHT]: marginRight,
            [PADDING_RIGHT]: paddingRight,
            [BORDER_RIGHT_WIDTH]: borderRightWidth,
          } = dom.computedStyle;
          sum += marginRight + paddingRight + borderRightWidth;
        }
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
