import Xom from './Xom';
import Text from './Text';
import mode from './mode';
import LineGroup from './LineGroup';
import Component from './Component';
import tag from './tag';
import reset from '../style/reset';
import css from '../style/css';
import unit from '../style/unit';
import enums from '../util/enums';
import util from '../util/util';
import inject from '../util/inject';

const {
  STYLE_KEY: {
    POSITION,
    DISPLAY,
    FONT_WEIGHT,
    MARGIN_LEFT,
    MARGIN_TOP,
    MARGIN_RIGHT,
    MARGIN_BOTTOM,
    PADDING_LEFT,
    PADDING_BOTTOM,
    PADDING_RIGHT,
    PADDING_TOP,
    BORDER_TOP_WIDTH,
    BORDER_BOTTOM_WIDTH,
    BORDER_RIGHT_WIDTH,
    BORDER_LEFT_WIDTH,
    TOP,
    RIGHT,
    BOTTOM,
    LEFT,
    WIDTH,
    HEIGHT,
    TEXT_ALIGN,
    FLEX_DIRECTION,
    FLEX_BASIS,
    FLEX_SHRINK,
    FLEX_GROW,
    ALIGN_SELF,
    ALIGN_ITEMS,
    JUSTIFY_CONTENT,
    Z_INDEX,
    WHITE_SPACE,
  },
  NODE_KEY: {
    NODE_CURRENT_STYLE,
    NODE_STYLE,
    NODE_STRUCT,
    NODE_DOM_PARENT,
  },
  STRUCT_KEY: {
    STRUCT_NUM,
    STRUCT_LV,
    STRUCT_TOTAL,
    STRUCT_CHILD_INDEX,
    STRUCT_INDEX,
  },
} = enums;
const { AUTO, PX, PERCENT } = unit;
const { calAbsolute, isRelativeOrAbsolute } = css;

function genZIndexChildren(dom) {
  let flow = [];
  let abs = [];
  let hasMc;
  let mcHash = {};
  let needSort = false;
  let lastIndex;
  let lastMaskIndex;
  let children = dom.children;
  children.forEach((item, i) => {
    let child = item;
    if(item instanceof Component) {
      item = item.shadowRoot;
    }
    // 遮罩单独保存后特殊排序
    if(item instanceof Xom && item.isMask) {
      // 开头的mc忽略，后续的连续mc以第一次出现为准
      if(lastMaskIndex !== undefined) {
        mcHash[lastMaskIndex].push(item);
      }
      else if(i) {
        lastMaskIndex = i - 1;
        children[lastMaskIndex].__iIndex = lastMaskIndex;
        mcHash[lastMaskIndex] = [item];
        hasMc = true;
      }
    }
    else {
      lastMaskIndex = undefined;
      if(item instanceof Xom) {
        if(isRelativeOrAbsolute(item)) {
          // 临时变量为排序使用
          child.__iIndex = i;
          let z = child.__zIndex = item.currentStyle[Z_INDEX];
          abs.push(child);
          if(lastIndex === undefined) {
            lastIndex = z;
          }
          else if(!needSort) {
            if(z < lastIndex) {
              needSort = true;
            }
            lastIndex = z;
          }
        }
        else {
          flow.push(child);
        }
      }
      else {
        flow.push(child);
      }
    }
  });
  needSort && abs.sort(function(a, b) {
    if(a.__zIndex !== b.__zIndex) {
      return a.__zIndex - b.__zIndex;
    }
    return a.__iIndex - b.__iIndex;
  });
  let res = flow.concat(abs);
  // 将遮罩插入到对应顺序上
  if(hasMc) {
    for(let i = res.length - 1; i >= 0; i--) {
      let idx = res[i].__iIndex;
      if(mcHash.hasOwnProperty(idx)) {
        res.splice(i + 1, 0, ...mcHash[idx]);
      }
    }
  }
  return res;
}

class Dom extends Xom {
  constructor(tagName, props, children) {
    super(tagName, props);
    this.__lineGroups = []; // 一行inline元素组成的LineGroup对象后的存放列表
    let { style } = this;
    if(!style.display || !{
      flex: true,
      block: true,
      inline: true,
      none: true,
    }.hasOwnProperty(style.display)) {
      if(tag.INLINE.hasOwnProperty(this.tagName)) {
        style.display = 'inline';
      }
      else {
        style.display = 'block';
      }
    }
    if(!style[FONT_WEIGHT] && tag.BOLD.hasOwnProperty(tagName)) {
      style.fontWeight = 700;
    }
    this.__style = css.normalize(style, reset.DOM_ENTRY_SET);
    // currentStyle/currentProps不深度clone，继承一层即可，动画时也是extend这样只改一层引用不动原始静态style
    this.__currentStyle = util.extend({}, this.__style);
    this.__children = children || [];
    let config = this.__config;
    config[NODE_CURRENT_STYLE] = this.__currentStyle;
    config[NODE_STYLE] = this.__style;
  }

  __structure(i, lv, j) {
    let res = super.__structure(i++, lv, j);
    let arr = [res];
    let zIndexChildren = this.__zIndexChildren = this.__zIndexChildren || genZIndexChildren(this);
    zIndexChildren.forEach((child, j) => {
      let temp = child.__structure(i, lv + 1, j);
      if(Array.isArray(temp)) {
        i += temp.length;
        arr = arr.concat(temp);
      }
      else {
        i++;
        arr.push(temp);
      }
    });
    let total = arr.length - 1;
    res[STRUCT_NUM] = zIndexChildren.length;
    res[STRUCT_TOTAL] = total;
    return arr;
  }

  __modifyStruct(root, offset = 0) {
    let __config = this.__config;
    let struct = __config[NODE_STRUCT];
    let total = struct[STRUCT_TOTAL] || 0;
    // 新生成了struct，引用也变了
    let nss = this.__structure(struct[STRUCT_INDEX], struct[STRUCT_LV], struct[STRUCT_CHILD_INDEX]);
    root.__structs.splice(struct[STRUCT_INDEX] + offset, struct[STRUCT_TOTAL] + 1, ...nss);
    let d = 0;
    if(this !== root) {
      struct = __config[NODE_STRUCT];
      d = (struct[STRUCT_TOTAL] || 0) - total;
      let ps = __config[NODE_DOM_PARENT].__config[NODE_STRUCT];
      ps[STRUCT_TOTAL] = ps[STRUCT_TOTAL] || 0;
      ps[STRUCT_TOTAL] += d;
    }
    return [struct, d];
  }

  /**
   * 因为zIndex/abs的变化造成的更新，只需重排这一段顺序即可
   * 即便包含component造成的dom变化也不影响，component作为子节点reflow会再执行，这里重排老的vd
   * @param structs
   * @private
   */
  __updateStruct(structs) {
    let { [STRUCT_INDEX]: index, [STRUCT_TOTAL]: total = 0 } = this.__config[NODE_STRUCT];
    let zIndexChildren = this.__zIndexChildren = genZIndexChildren(this);
    let length = zIndexChildren.length;
    if(length === 1) {
      return;
    }
    zIndexChildren.forEach((child, i) => {
      child.__config[NODE_STRUCT][STRUCT_CHILD_INDEX] = i;
    });
    // 按直接子节点划分为相同数量的若干段进行排序
    let arr = [];
    let source = [];
    for(let i = index + 1; i <= index + total; i++) {
      let child = structs[i];
      let o = {
        child,
        list: structs.slice(child[STRUCT_INDEX], child[STRUCT_INDEX] + child[STRUCT_TOTAL] + 1),
      };
      arr.push(o);
      source.push(o);
      i += child[STRUCT_TOTAL] || 0;
    }
    arr.sort(function(a, b) {
      return a.child[STRUCT_CHILD_INDEX] - b.child[STRUCT_CHILD_INDEX];
    });
    // 是否有变更，有才进行重新计算
    let needSort;
    for(let i = 0, len = source.length; i < len; i++) {
      if(source[i] !== arr[i]) {
        needSort = true;
        break;
      }
    }
    if(needSort) {
      let list = [];
      arr.forEach(item => {
        list = list.concat(item.list);
      });
      list.forEach((struct, i) => {
        struct[STRUCT_INDEX] = index + i + 1;
      })
      structs.splice(index + 1, total, ...list);
    }
  }

  // 给定父宽度情况下，尝试行内放下后的剩余宽度，为负数即放不下
  __tryLayInline(w, total) {
    let { flowChildren, currentStyle: { [WIDTH]: width } } = this;
    if(width[1] === PX) {
      return w - width[0];
    }
    else if(width[1] === PERCENT) {
      return w - total * width[0] * 0.01;
    }
    for(let i = 0; i < flowChildren.length; i++) {
      // 当放不下时直接返回，无需继续多余的尝试计算
      if(w < 0) {
        return w;
      }
      let item = flowChildren[i];
      if(item instanceof Xom || item instanceof Component) {
        w -= item.__tryLayInline(w, total);
      }
      else {
        w -= item.textWidth;
      }
    }
    return w;
  }

  // 设置y偏移值，递归包括children，此举在justify-content/margin-auto等对齐用
  __offsetX(diff, isLayout, lv) {
    super.__offsetX(diff, isLayout, lv);
    this.flowChildren.forEach(item => {
      if(item) {
        item.__offsetX(diff, isLayout, lv);
      }
    });
  }

  __offsetY(diff, isLayout, lv) {
    super.__offsetY(diff, isLayout, lv);
    this.flowChildren.forEach(item => {
      if(item) {
        item.__offsetY(diff, isLayout, lv);
      }
    });
  }

  __addMpWidthAutoBasis(isDirectionRow, w, currentStyle, b, min, max) {
    let {
      [MARGIN_LEFT]: marginLeft,
      [MARGIN_TOP]: marginTop,
      [MARGIN_RIGHT]: marginRight,
      [MARGIN_BOTTOM]: marginBottom,
      [PADDING_LEFT]: paddingLeft,
      [PADDING_TOP]: paddingTop,
      [PADDING_RIGHT]: paddingRight,
      [PADDING_BOTTOM]: paddingBottom,
      [BORDER_TOP_WIDTH]: borderTopWidth,
      [BORDER_RIGHT_WIDTH]: borderRightWidth,
      [BORDER_BOTTOM_WIDTH]: borderBottomWidth,
      [BORDER_LEFT_WIDTH]: borderLeftWidth,
    } = currentStyle;
    if(isDirectionRow) {
      let mp = this.__calMp(marginLeft, w)
        + this.__calMp(marginRight, w)
        + this.__calMp(paddingLeft, w)
        + this.__calMp(paddingRight, w);
      let w2 = borderLeftWidth[0] + borderRightWidth[0] + mp;
      b += w2;
      max += w2;
      min += w2;
    }
    else {
      let mp = this.__calMp(marginTop, w)
        + this.__calMp(marginBottom, w)
        + this.__calMp(paddingTop, w)
        + this.__calMp(paddingBottom, w);
      let h2 = borderTopWidth[0] + borderBottomWidth[0] + mp;
      b += h2;
      max += h2;
      min += h2;
    }
    return [b, min, max];
  }

  /**
   * flex布局时，计算basis尺寸，如果有css声明则以其为标准，没有则auto自动计算
   * 声明为%比时基准容器为传入的w/h，一般是父block元素，递归flex则一直是父block
   * 影响尺寸的只有换行的text，以及一组inline，均按其中最大尺寸的一个计算
   * auto自动计算递归进行，如果是普通row方向，按最大text的charWidth为准
   * 如果是column方向，则水平排满后看text的height
   * 在的abs下时进入特殊状态，无论是row/column，都会按row方向尝试最大尺寸，直到舞台边缘或容器声明的w折行
   * 返回b，声明则按css值，否则同min
   * 返回min为最小宽度，遇到字符则单列排版后需要的最大宽度
   * 返回max为最大宽度，在abs时isVirtual状态参与计算，文本抵达边界才进行换行
   * flex的孩子的孩子需递归，有些不同
   * @param isDirectionRow
   * @param x
   * @param y
   * @param w
   * @param h
   * @param isVirtual
   * @param isRecursion 是否是递归孩子
   * @private
   */
  __calAutoBasis(isDirectionRow, x, y, w, h, isVirtual, isRecursion) {
    css.computeReflow(this, this.isShadowRoot);
    let b = 0;
    let min = 0;
    let max = 0;
    let { flowChildren, currentStyle, computedStyle } = this;
    // 计算需考虑style的属性
    let {
      [DISPLAY]: display,
      [FLEX_DIRECTION]: flexDirection,
      [WIDTH]: width,
      [HEIGHT]: height,
    } = currentStyle;
    let main = isDirectionRow ? width : height;
    // 已声明主轴尺寸的，basis和max均为，暂不考虑未支持的nowrap不换行，如果是递归孩子，直接返回皆可
    if(main[1] === PX) {
      b = max = main[0];
      if(isRecursion) {
        return this.__addMpWidthAutoBasis(isDirectionRow, w, currentStyle, b, min, max);
      }
    }
    else if(main[1] === PERCENT) {
      b = max = main[0] * 0.01 * (isDirectionRow ? w : h);
      if(isRecursion) {
        return this.__addMpWidthAutoBasis(isDirectionRow, w, currentStyle, b, min, max);
      }
    }
    // 递归children取max/min进行合并计算
    flowChildren.forEach(item => {
      if(item instanceof Xom || item instanceof Component && item.shadowRoot instanceof Xom) {
        let [b2, min2, max2] = item.__calAutoBasis(isDirectionRow, x, y, w, h, isVirtual, true);
        // 直接孩子/递归孩子都需要根据flex和流方向来判断合并规则，flex根据弹性方向，普通取极值
        if(display === 'flex') {
          // 根据父节点的flex方向，孩子孙子的方向组合，判断是相加还是极值，多层时顶层和底层，中间忽视
          if(isDirectionRow) {
            if(flexDirection === 'row') {
              b += b2;
              min += min2;
              max += max2;
            }
            else {
              b = Math.max(b, b2);
              min = Math.max(min, min2);
              max = Math.max(max, max2);
            }
          }
          else {
            if(flexDirection === 'row') {
              b = Math.max(b, b2);
              min = Math.max(min, min2);
              max = Math.max(max, max2);
            }
            else {
              b += b2;
              min += min2;
              max += max2;
            }
          }
        }
        // 竖排的即便不是flex，因为计算的是flex的child，这里返回grandchild也要累积
        else if(!isDirectionRow) {
          b += b2;
          min += min2;
          max += max2;
        }
        else {
          b = Math.max(b, b2);
          min = Math.max(min, min2);
          max = Math.max(max, max2);
        }
      }
      // 文本水平
      else if(isDirectionRow) {
        let whiteSpace = computedStyle[WHITE_SPACE];
        let tw = item.textWidth;
        if(whiteSpace === 'nowrap') {
          b = Math.max(b, tw);
          min = Math.max(min, tw);
        }
        else {
          b = Math.max(b, item.charWidth);
          min = Math.max(min, item.charWidth);
        }
        max = Math.max(tw, max);console.log(whiteSpace, b, min, max);
      }
      // 文本垂直，尝试伪布局得到高度
      else {
        item.__layout({
          x,
          y,
          w,
          h,
        }, true);
        b = Math.max(b, item.height);
        min = Math.max(min, item.height);
        max = Math.max(max, item.height);
      }
    });
    // margin/padding/border也得计算在内，此时还没有，百分比相对于父flex元素的宽度
    return this.__addMpWidthAutoBasis(isDirectionRow, w, currentStyle, b, min, max);
  }

  __layoutNone() {
    super.__layoutNone();
    let { children } = this;
    children.forEach(item => {
      if(item instanceof Xom || item instanceof Component && item.shadowRoot instanceof Xom) {
        item.__layoutNone();
      }
    });
  }

  // 本身block布局时计算好所有子元素的基本位置
  __layoutBlock(data, isVirtual) {
    let { flowChildren, currentStyle, computedStyle, lineGroups } = this;
    lineGroups.splice(0);
    let {
      [TEXT_ALIGN]: textAlign,
    } = computedStyle;
    let { fixedWidth, fixedHeight, x, y, w, h } = this.__preLayout(data);
    if(fixedWidth && isVirtual) {
      this.__width = w;
      this.__ioSize(w, this.height);
      return;
    }
    // 因精度问题，统计宽度均从0开始累加每行，最后取最大值，仅在abs布局时isVirtual生效
    let maxW = 0;
    let cw = 0;
    // 递归布局，将inline的节点组成lineGroup一行，同时记录上一个block，进行垂直方向的margin合并
    let lineGroup = new LineGroup(x, y);
    // 连续block（flex）的上下margin合并值记录，合并时从列表中取
    let mergeMarginBottomList = [], mergeMarginTopList = [];
    let length = flowChildren.length;
    flowChildren.forEach((item, i) => {
      let isXom = item instanceof Xom || item instanceof Component && item.shadowRoot instanceof Xom;
      let isInline = isXom && item.currentStyle[DISPLAY] === 'inline';
      // 每次循环开始前，这次不是block的话，看之前遗留的，可能是以空block结束，需要特殊处理，单独一个空block也包含
      if((!isXom || isInline)) {
        if(mergeMarginBottomList.length && mergeMarginTopList.length) {
          let diff = util.getMergeMarginTB(mergeMarginTopList, mergeMarginBottomList);
          if(diff) {
            y += diff;
          }
        }
        mergeMarginTopList = [];
        mergeMarginBottomList = [];
      }
      if(isXom) {
        // inline和block（flex等同）不同对待
        if(isInline) {
          // inline开头，不用考虑是否放得下直接放
          if(x === data.x) {
            lineGroup.add(item);
            item.__layout({
              x,
              y,
              w,
              h,
            }, isVirtual);
            x += item.outerWidth;
            if(isVirtual) {
              maxW = Math.max(maxW, cw);
              cw = item.outerWidth;
            }
          }
          else {
            // 非开头先尝试是否放得下
            let fw = item.__tryLayInline(w - x + data.x, w);
            // 放得下继续
            if(fw >= 0) {
              item.__layout({
                x,
                y,
                w,
                h,
              }, isVirtual);
            }
            // 放不下处理之前的lineGroup，并重新开头
            else {
              lineGroups.push(lineGroup);
              if(!isVirtual) {
                lineGroup.verticalAlign();
              }
              x = data.x;
              y += lineGroup.height + lineGroup.marginBottom;
              item.__layout({
                x: data.x,
                y,
                w,
                h,
              }, isVirtual);
              lineGroup = new LineGroup(x, y);
              if(isVirtual) {
                maxW = Math.max(maxW, cw);
                cw = 0;
              }
            }
            x += item.outerWidth;
            lineGroup.add(item);
            if(isVirtual) {
              cw += item.outerWidth;
            }
          }
        }
        else {
          // block/flex先处理之前可能的lineGroup
          if(lineGroup.size) {
            lineGroups.push(lineGroup);
            lineGroup.verticalAlign();
            y += lineGroup.height + lineGroup.marginBottom;
            lineGroup = new LineGroup(data.x, y);
            if(isVirtual) {
              maxW = Math.max(maxW, cw);
              cw = 0;
            }
          }
          item.__layout({
            x: data.x,
            y,
            w,
            h,
          }, isVirtual);
          x = data.x;
          let isNone = item.currentStyle[DISPLAY] === 'none';
          // 自身无内容
          let isEmptyBlock;
          if(!isNone && item.flowChildren && item.flowChildren.length === 0) {
            let {
              [MARGIN_TOP]: marginTop,
              [MARGIN_BOTTOM]: marginBottom,
              [PADDING_TOP]: paddingTop,
              [PADDING_BOTTOM]: paddingBottom,
              [HEIGHT]: height,
              [BORDER_TOP_WIDTH]: borderTopWidth,
              [BORDER_BOTTOM_WIDTH]: borderBottomWidth,
            } = item.computedStyle;
            // 无内容高度为0的空block特殊情况，记录2个margin下来等后续循环判断处理
            if(paddingTop <= 0 && paddingBottom <= 0 && height <= 0 && borderTopWidth <= 0 && borderBottomWidth <= 0) {
              mergeMarginBottomList.push(marginBottom);
              mergeMarginTopList.push(marginTop);
              isEmptyBlock = true;
            }
          }
          y += item.outerHeight;
          // absolute/flex前置虚拟计算
          if(isVirtual) {
            maxW = Math.max(maxW, item.outerWidth);
            cw = 0;
          }
          // 空block要留下轮循环看，除非是最后一个，非空本轮处理掉看是否要合并
          if(!isNone && !isEmptyBlock) {
            let { [MARGIN_TOP]: marginTop, [MARGIN_BOTTOM]: marginBottom } = item.computedStyle;
            // 有bottom值说明之前有紧邻的block，任意个甚至空block，自己有个top所以无需判断top
            // 如果是只有紧邻的2个非空block，也被包含在情况内，取上下各1合并
            if(mergeMarginBottomList.length) {
              mergeMarginTopList.push(marginTop);
              let diff = util.getMergeMarginTB(mergeMarginTopList, mergeMarginBottomList);
              if(diff) {
                item.__offsetY(diff, true);
                y += diff;
              }
            }
            // 同时自己保存bottom，为后续block准备
            mergeMarginTopList = [];
            mergeMarginBottomList = [marginBottom];
          }
          // 最后一个空block当是正正和负负时要处理，正负在outHeight处理了结果是0
          else if(i === length - 1) {
            let diff = util.getMergeMarginTB(mergeMarginTopList, mergeMarginBottomList);
            if(diff) {
              y += diff;
            }
          }
        }
      }
      // 文字和inline类似
      else {
        // x开头，不用考虑是否放得下直接放
        if(x === data.x) {
          lineGroup.add(item);
          item.__layout({
            x,
            y,
            w,
            h,
          }, isVirtual);
          x += item.width;
          if(isVirtual) {
            maxW = Math.max(maxW, cw);
            cw = item.width;
          }
        }
        else {
          // 非开头先尝试是否放得下
          let fw = item.__tryLayInline(w - x + data.x);
          // 放得下继续
          if(fw >= 0) {
            item.__layout({
              x,
              y,
              w,
              h,
            }, isVirtual);
          }
          // 放不下处理之前的lineGroup，并重新开头
          else {
            lineGroups.push(lineGroup);
            lineGroup.verticalAlign();
            x = data.x;
            y += lineGroup.height + lineGroup.marginBottom;
            item.__layout({
              x: data.x,
              y,
              w,
              h,
            }, isVirtual);
            lineGroup = new LineGroup(x, y);
            if(isVirtual) {
              maxW = Math.max(maxW, cw);
              cw = 0;
            }
          }
          x += item.width;
          lineGroup.add(item);
          if(isVirtual) {
            cw += item.width;
          }
        }
      }
    });
    // 结束后处理可能遗留的最后的lineGroup
    if(lineGroup.size) {
      lineGroups.push(lineGroup);
      // flex/abs的虚拟前置布局，无需真正计算
      if(!isVirtual) {
        lineGroup.verticalAlign();
      }
      else {
        maxW = Math.max(maxW, cw);
      }
      y += lineGroup.height;
    }
    let tw = this.__width = fixedWidth || !isVirtual ? w : maxW;
    let th = this.__height = fixedHeight ? h : y - data.y;
    this.__ioSize(tw, th);
    // text-align
    if(!isVirtual && ['center', 'right'].indexOf(textAlign) > -1) {
      lineGroups.forEach(lineGroup => {
        let diff = w - lineGroup.width;
        if(diff > 0) {
          lineGroup.horizonAlign(textAlign === 'center' ? diff * 0.5 : diff);
        }
      });
    }
    if(!isVirtual) {
      this.__marginAuto(currentStyle, data);
    }
  }

  // 弹性布局时的计算位置
  __layoutFlex(data, isVirtual) {console.error(this.tagName);
    let { flowChildren, currentStyle } = this;
    let {
      [FLEX_DIRECTION]: flexDirection,
      [JUSTIFY_CONTENT]: justifyContent,
      [ALIGN_ITEMS]: alignItems,
    } = currentStyle;
    let { fixedWidth, fixedHeight, x, y, w, h } = this.__preLayout(data);
    if(fixedWidth && isVirtual) {
      this.__width = w;
      this.__ioSize(w, this.height);
      return;
    }
    let maxX = 0;
    let isDirectionRow = flexDirection === 'row';
    // 计算伸缩基数
    let growList = [];
    let shrinkList = [];
    let basisList = [];
    let maxList = [];
    let minList = [];
    let growSum = 0;
    let shrinkSum = 0;
    let basisSum = 0;
    let maxSum = 0;
    let minSum = 0;
    flowChildren.forEach(item => {
      if(item instanceof Xom || item instanceof Component && item.shadowRoot instanceof Xom) {
        let { currentStyle, computedStyle } = item;
        // flex的child如果是inline，变为block，在计算autoBasis前就要
        if(currentStyle[DISPLAY] === 'inline') {
          currentStyle[DISPLAY] = 'block';
        }
        // abs虚拟布局计算时纵向也是看横向宽度
        let [b, min, max] = item.__calAutoBasis(isVirtual ? true : isDirectionRow, x, y, w, h, isVirtual);
        if(isVirtual) {
          if(isDirectionRow) {
            maxX += max;
          }
          else {
            maxX = Math.max(maxX, max);
          }
          return;
        }
        let { [FLEX_GROW]: flexGrow, [FLEX_SHRINK]: flexShrink, [FLEX_BASIS]: flexBasis } = currentStyle;
        growList.push(flexGrow);
        shrinkList.push(flexShrink);
        growSum += flexGrow;
        shrinkSum += flexShrink;
        // 根据basis不同，计算方式不同，上面每个元素计算的是min以及主轴尺寸，下面要按basis规范来覆盖
        if(flexBasis[1] === AUTO) {
          basisList.push(b);
          basisSum += b;
        }
        else if(flexBasis[1] === PX) {
          let b = computedStyle[FLEX_BASIS] = flexBasis[0];
          basisList.push(b);
          basisSum += b;
        }
        else if(flexBasis[1] === PERCENT) {
          let b = computedStyle[FLEX_BASIS] = (isDirectionRow ? w : h) * flexBasis[0] * 0.01;
          basisList.push(b);
          basisSum += b;
        }
        maxList.push(max);
        maxSum += max;
        minList.push(min);
        minSum += min;
      }
      // 文本
      else {
        if(isVirtual) {
          if(isDirectionRow) {
            maxX += item.textWidth;
          }
          else {
            maxX = Math.max(maxX, item.textWidth);
          }
          return;
        }
        growList.push(0);
        shrinkList.push(1);
        shrinkSum += 1;
        if(isDirectionRow) {
          let c = item.charWidth;
          basisList.push(c);
          basisSum += c;
          maxList.push(item.textWidth);
          maxSum += item.textWidth;
          minList.push(c);
          minSum += c;
        }
        else {
          item.__layout({
            x,
            y,
            w,
            h,
          }, true);
          let h = item.height;
          basisList.push(h);
          basisSum += h;
          maxSum += h;
          minList.push(h);
          minSum += h;
        }
      }
    });
    // abs时，只需关注宽度即可，无需真正布局
    if(isVirtual) {
      let tw = this.__width = Math.min(maxX, w);
      this.__ioSize(tw, this.height);
      return;
    }
    /**
     * 计算获取子元素的b/min/max完毕后，尝试进行flex布局
     * 这里比较麻烦，因为text的长度是可变化的，会因为伸缩而不确定性换行，这样导致basis在auto时不确定性
     * basis在没有明确指定时等同于min值，即text中最大字符宽度，先考虑row的情况
     * 在maxSum<=w时特殊处理，text可按照不换行最大长度计算
     * 其它情况按正常伸缩计算，即以basis为基准
     * 这样，如果text全部算起来都不到总尺寸，则以max为基准算basis，防止以basis算显示错误
     * 而如果超过总尺寸，以basis算看是伸还是缩也符合
     * column情况b/min/max都相等，根据sum和父节点的height是否固定情况看
     // 判断是否超出，决定使用grow还是shrink，水平垂直不同
     */
    let maxCross = 0;
    let isMoreThanMax;
    // 水平如果固定宽度则为基准，否则为布局容器宽度，两者返回的值都是w
    if(isDirectionRow) {
      isMoreThanMax = maxSum <= w;
    }
    else if(fixedHeight) {
      isMoreThanMax = maxSum <= h;
    }
    let isOverflow;
    if(!isMoreThanMax) {
      if(isDirectionRow) {
        isOverflow = basisSum > w;
      }
      else if(fixedHeight) {
        isOverflow = basisSum > h;
      }
    }
    let overflow = 0, free = 0;
    // 计算主轴长度，以basis为基准判断伸缩选择，收缩比较简单，计算后再判断不能小于min即可
    if(isMoreThanMax) {
      free = (isDirectionRow ? w : h) - maxSum;
    }
    else if(isOverflow) {
      overflow = basisSum - (isDirectionRow ? w : h);
    }
    // 没>max，也没<b，正常算free，垂直自适应高度时使用默认0
    else {
      if(isDirectionRow) {
        free = w - basisSum;
      }
      else if(fixedHeight) {
        free = h - basisSum;
      }
    }
    flowChildren.forEach((item, i) => {
      let main;
      let shrink = shrinkList[i];
      let grow = growList[i];
      let isGrow;
      // 计算主轴长度，以basis为基准判断伸缩选择，收缩比较简单，计算后再判断不能小于min即可
      if(isMoreThanMax) {
        isGrow = true;
        main = grow ? (maxList[i] + free * grow / growSum) : maxList[i];
      }
      else if(isOverflow) {
        main = shrink ? (basisList[i] - overflow * shrink / shrinkSum) : basisList[i];
      }
      else {
        isGrow = !!grow;
        main = grow ? (basisList[i] + free * grow / growSum) : basisList[i];
      }
      // 主轴长度的最小值不能小于元素的最小长度，即横向时的字符宽度，收缩时会用到确保最小值
      main = Math.max(main, minList[i]);
      if(item instanceof Xom || item instanceof Component && item.shadowRoot instanceof Xom) {
        let { currentStyle } = item;
        let {
          [DISPLAY]: display,
          [FLEX_DIRECTION]: flexDirection,
          [WIDTH]: width,
          [HEIGHT]: height,
        } = currentStyle;
        if(isDirectionRow) {
          // 横向flex的child如果是竖向flex，高度自动的话要等同于父flex的高度
          if(display === 'flex' && flexDirection === 'column' && fixedHeight && height[1] === AUTO) {
            height[0] = h;
            height[1] = PX;
          }
          item.__layout({
            x,
            y,
            w: main,
            h,
          });
        }
        else {
          // 竖向flex的child如果是横向flex，宽度自动的话要等同于父flex的宽度
          if(display === 'flex' && flexDirection === 'row' && width[1] === AUTO) {
            width[0] = w;
            width[1] = PX;
          }
          item.__layout({
            x,
            y,
            w,
            h: main,
            h2: isGrow ? main : undefined, // 竖向flex的child如果是grow，假设为固定尺寸但不修改原始style
          });
        }
        // 重设因伸缩而导致的主轴长度
        let fitShrink = isOverflow && shrink;
        let fitGrow = !isOverflow && grow;
        if(fitShrink || fitGrow) {
          // 收缩为负值，防止>=0的bug情况，另外还要判断最小值
          if(fitShrink) {
            if(isDirectionRow) {
              let diff = main - Math.max(minList[i], item.outerWidth);
              if(diff < 0) {
                item.__resizeX(diff);
              }
            }
            else {
              let diff = main - Math.max(minList[i], item.outerHeight);
              if(diff < 0) {
                item.__resizeY(diff);
              }
            }
          }
          // 只有正值才扩展，一般不会出现，防止bug情况
          else {
            if(isDirectionRow) {
              let diff = main - item.outerWidth;
              if(diff > 0) {
                item.__resizeX(diff);
              }
            }
            else {
              let diff = main - item.outerHeight;
              if(diff > 0) {
                item.__resizeY(diff);
              }
            }
          }
        }
      }
      else {
        item.__layout({
          x,
          y,
          w: isDirectionRow ? main : w,
          h: isDirectionRow ? h : main,
        });
      }
      if(isDirectionRow) {
        x += item.outerWidth;
        maxCross = Math.max(maxCross, item.outerHeight);
      }
      else {
        y += item.outerHeight;
        maxCross = Math.max(maxCross, item.outerWidth);
      }
    });
    // 计算主轴剩余时要用真实剩余空间而不能用伸缩剩余空间
    let diff = isDirectionRow ? w - x + data.x : h - y + data.y;
    // 主轴侧轴对齐方式
    if(!isOverflow && growSum === 0 && diff > 0) {
      let len = flowChildren.length;
      if(justifyContent === 'flex-end') {
        for(let i = 0; i < len; i++) {
          let child = flowChildren[i];
          isDirectionRow ? child.__offsetX(diff, true) : child.__offsetY(diff, true);
        }
      }
      else if(justifyContent === 'center') {
        let center = diff * 0.5;
        for(let i = 0; i < len; i++) {
          let child = flowChildren[i];
          isDirectionRow ? child.__offsetX(center, true) : child.__offsetY(center, true);
        }
      }
      else if(justifyContent === 'space-between') {
        let between = diff / (len - 1);
        for(let i = 1; i < len; i++) {
          let child = flowChildren[i];
          isDirectionRow ? child.__offsetX(between * i, true) : child.__offsetY(between * i, true);
        }
      }
      else if(justifyContent === 'space-around') {
        let around = diff / (len + 1);
        for(let i = 0; i < len; i++) {
          let child = flowChildren[i];
          isDirectionRow ? child.__offsetX(around * (i + 1), true) : child.__offsetY(around * (i + 1), true);
        }
      }
    }
    // 子元素侧轴伸展
    if(isDirectionRow) {
      // 父元素固定高度，子元素可能超过，侧轴最大长度取固定高度
      if(fixedHeight) {
        maxCross = h;
      }
      y += maxCross;
    }
    else {
      if(fixedWidth) {
        maxCross = w;
      }
    }
    // 侧轴对齐
    if(!isVirtual) {
      if(alignItems === 'stretch') {
        // 短侧轴的children伸张侧轴长度至相同，超过的不动，固定宽高的也不动
        flowChildren.forEach(item => {
          let { computedStyle, currentStyle: { [ALIGN_SELF]: alignSelf, [WIDTH]: width, [HEIGHT]: height } } = item;
          let {
            [BORDER_TOP_WIDTH]: borderTopWidth,
            [BORDER_BOTTOM_WIDTH]: borderBottomWidth,
            [MARGIN_TOP]: marginTop,
            [MARGIN_BOTTOM]: marginBottom,
            [PADDING_TOP]: paddingTop,
            [PADDING_BOTTOM]: paddingBottom,
            [BORDER_RIGHT_WIDTH]: borderRightWidth,
            [BORDER_LEFT_WIDTH]: borderLeftWidth,
            [MARGIN_RIGHT]: marginRight,
            [MARGIN_LEFT]: marginLeft,
            [PADDING_RIGHT]: paddingRight,
            [PADDING_LEFT]: paddingLeft,
          } = computedStyle;
          if(isDirectionRow) {
            if(alignSelf === 'flex-start') {}
            else if(alignSelf === 'center') {
              let diff = maxCross - item.outerHeight;
              if(diff !== 0) {
                item.__offsetY(diff * 0.5, true);
              }
            }
            else if(alignSelf === 'flex-end') {
              let diff = maxCross - item.outerHeight;
              if(diff !== 0) {
                item.__offsetY(diff, true);
              }
            }
            else if(height[1] === AUTO) {
              let old = item.height;
              let v = item.__height = computedStyle[HEIGHT] = maxCross - marginTop - marginBottom - paddingTop - paddingBottom - borderTopWidth - borderBottomWidth;
              let d = v - old;
              item.__clientHeight += d;
              item.__outerHeight += d;
            }
          }
          else {
            if(alignSelf === 'flex-start') {}
            else if(alignSelf === 'center') {
              let diff = maxCross - item.outerWidth;
              if(diff !== 0) {
                item.__offsetX(diff * 0.5, true);
              }
            }
            else if(alignSelf === 'flex-end') {
              let diff = maxCross - item.outerWidth;
              if(diff !== 0) {
                item.__offsetX(diff, true);
              }
            }
            else if(width[1] === AUTO) {
              let old = item.width;
              let v = item.__width = computedStyle[WIDTH] = maxCross - marginLeft - marginRight - paddingLeft - paddingRight - borderRightWidth - borderLeftWidth;
              let d = v - old;
              item.__clientWidth += d;
              this.__offsetWidth += d;
              item.__outerWidth += d;
            }
          }
        });
      }
      else if(alignItems === 'center') {
        flowChildren.forEach(item => {
          let { currentStyle: { [ALIGN_SELF]: alignSelf } } = item;
          if(isDirectionRow) {
            if(alignSelf === 'flex-start') {
            }
            else if(alignSelf === 'flex-end') {
              let diff = maxCross - item.outerHeight;
              if(diff !== 0) {
                item.__offsetY(diff, true);
              }
            }
            else if(alignSelf === 'stretch') {
              let { computedStyle, currentStyle: { [HEIGHT]: height } } = item;
              let {
                [BORDER_TOP_WIDTH]: borderTopWidth,
                [BORDER_BOTTOM_WIDTH]: borderBottomWidth,
                [MARGIN_TOP]: marginTop,
                [MARGIN_BOTTOM]: marginBottom,
                [PADDING_TOP]: paddingTop,
                [PADDING_BOTTOM]: paddingBottom,
              } = computedStyle;
              if(height[1] === AUTO) {
                let old = item.height;
                let v = item.__height = computedStyle[HEIGHT] = maxCross - marginTop - marginBottom - paddingTop - paddingBottom - borderTopWidth - borderBottomWidth;
                let d = v - old;
                item.__clientHeight += d;
                item.__outerHeight += d;
              }
            }
            else {
              let diff = maxCross - item.outerHeight;
              if(diff !== 0) {
                item.__offsetY(diff * 0.5, true);
              }
            }
          }
          else {
            if(alignSelf === 'flex-start') {
            }
            else if(alignSelf === 'flex-end') {
              let diff = maxCross - item.outerWidth;
              if(diff !== 0) {
                item.__offsetX(diff, true);
              }
            }
            else if(alignSelf === 'stretch') {
              let { computedStyle, currentStyle: { [WIDTH]: width } } = item;
              let {
                [BORDER_RIGHT_WIDTH]: borderRightWidth,
                [BORDER_LEFT_WIDTH]: borderLeftWidth,
                [MARGIN_RIGHT]: marginRight,
                [MARGIN_LEFT]: marginLeft,
                [PADDING_RIGHT]: paddingRight,
                [PADDING_LEFT]: paddingLeft,
              } = computedStyle;
              if(width[1] === AUTO) {
                let old = item.width;
                let v = item.__width = computedStyle[WIDTH] = maxCross - marginLeft - marginRight - paddingLeft - paddingRight - borderRightWidth - borderLeftWidth;
                let d = v - old;
                item.__clientWidth += d;
                this.__offsetWidth += d;
                item.__outerWidth += d;
              }
            }
            else {
              let diff = maxCross - item.outerWidth;
              if(diff !== 0) {
                item.__offsetX(diff * 0.5, true);
              }
            }
          }
        });
      }
      else if(alignItems === 'flex-end') {
        flowChildren.forEach(item => {
          let { currentStyle: { [ALIGN_SELF]: alignSelf } } = item;
          if(isDirectionRow) {
            if(alignSelf === 'flex-start') {
            }
            else if(alignSelf === 'center') {
              let diff = maxCross - item.outerHeight;
              if(diff !== 0) {
                item.__offsetY(diff * 0.5, true);
              }
            }
            else if(alignSelf === 'stretch') {
              let { computedStyle, currentStyle: { [HEIGHT]: height } } = item;
              let {
                [BORDER_TOP_WIDTH]: borderTopWidth,
                [BORDER_BOTTOM_WIDTH]: borderBottomWidth,
                [MARGIN_TOP]: marginTop,
                [MARGIN_BOTTOM]: marginBottom,
                [PADDING_TOP]: paddingTop,
                [PADDING_BOTTOM]: paddingBottom,
              } = computedStyle;
              if(height[1] === AUTO) {
                let old = item.height;
                let v = item.__height = computedStyle[HEIGHT] = maxCross - marginTop - marginBottom - paddingTop - paddingBottom - borderTopWidth - borderBottomWidth;
                let d = v - old;
                item.__clientHeight += d;
                item.__outerHeight += d;
              }
            }
            else {
              let diff = maxCross - item.outerHeight;
              if(diff !== 0) {
                item.__offsetY(diff, true);
              }
            }
          }
          else {
            if(alignSelf === 'flex-start') {
            }
            else if(alignSelf === 'center') {
              let diff = maxCross - item.outerWidth;
              if(diff !== 0) {
                item.__offsetX(diff * 0.5, true);
              }
            }
            else if(alignSelf === 'stretch') {
              let { computedStyle, currentStyle: { [WIDTH]: width } } = item;
              let {
                [BORDER_RIGHT_WIDTH]: borderRightWidth,
                [BORDER_LEFT_WIDTH]: borderLeftWidth,
                [MARGIN_RIGHT]: marginRight,
                [MARGIN_LEFT]: marginLeft,
                [PADDING_RIGHT]: paddingRight,
                [PADDING_LEFT]: paddingLeft,
              } = computedStyle;
              if(width[1] === AUTO) {
                let old = item.width;
                let v = item.__width = computedStyle[WIDTH] = maxCross - marginLeft - marginRight - paddingLeft - paddingRight - borderRightWidth - borderLeftWidth;
                let d = v - old;
                item.__clientWidth += d;
                this.__offsetWidth += d;
                item.__outerWidth += d;
              }
            }
            else {
              let diff = maxCross - item.outerHeight;
              if(diff !== 0) {
                item.__offsetY(diff, true);
              }
            }
          }
        });
      }
      else {
        flowChildren.forEach(item => {
          let { currentStyle: { [ALIGN_SELF]: alignSelf } } = item;
          if(isDirectionRow) {
            if(alignSelf === 'flex-start') {
            }
            else if(alignSelf === 'center') {
              let diff = maxCross - item.outerHeight;
              if(diff !== 0) {
                item.__offsetY(diff * 0.5, true);
              }
            }
            else if(alignSelf === 'flex-end') {
              let diff = maxCross - item.outerHeight;
              if(diff !== 0) {
                item.__offsetY(diff, true);
              }
            }
            else if(alignSelf === 'stretch') {
              let { computedStyle, currentStyle: { [HEIGHT]: height } } = item;
              let {
                [BORDER_TOP_WIDTH]: borderTopWidth,
                [BORDER_BOTTOM_WIDTH]: borderBottomWidth,
                [MARGIN_TOP]: marginTop,
                [MARGIN_BOTTOM]: marginBottom,
                [PADDING_TOP]: paddingTop,
                [PADDING_BOTTOM]: paddingBottom,
              } = computedStyle;
              if(height[1] === AUTO) {
                let old = item.height;
                let v = item.__height = item.__height = computedStyle[HEIGHT] = maxCross - marginTop - marginBottom - paddingTop - paddingBottom - borderTopWidth - borderBottomWidth;
                let d = v - old;
                item.__clientHeight += d;
                item.__outerHeight += d;
              }
            }
          }
          else {
            if(alignSelf === 'flex-start') {
            }
            else if(alignSelf === 'center') {
              let diff = maxCross - item.outerWidth;
              if(diff !== 0) {
                item.__offsetX(diff * 0.5, true);
              }
            }
            else if(alignSelf === 'flex-end') {
              let diff = maxCross - item.outerWidth;
              if(diff !== 0) {
                item.__offsetX(diff, true);
              }
            }
            else if(alignSelf === 'stretch') {
              let { computedStyle, currentStyle: { [WIDTH]: width } } = item;
              let {
                [BORDER_RIGHT_WIDTH]: borderRightWidth,
                [BORDER_LEFT_WIDTH]: borderLeftWidth,
                [MARGIN_RIGHT]: marginRight,
                [MARGIN_LEFT]: marginLeft,
                [PADDING_RIGHT]: paddingRight,
                [PADDING_LEFT]: paddingLeft,
              } = computedStyle;
              if(width[1] === AUTO) {
                let old = item.width;
                let v = item.__width = computedStyle[WIDTH] = maxCross - marginLeft - marginRight - paddingLeft - paddingRight - borderRightWidth - borderLeftWidth;
                let d = v - old;
                item.__clientWidth += d;
                this.__offsetWidth += d;
                item.__outerWidth += d;
              }
            }
          }
        });
      }
    }
    let tw = this.__width = w;
    let th = this.__height = fixedHeight ? h : y - data.y;
    this.__ioSize(tw, th);
    this.__marginAuto(currentStyle, data);
  }

  // inline比较特殊，先简单顶部对其，后续还需根据vertical和lineHeight计算y偏移
  __layoutInline(data, isVirtual) {
    let { flowChildren, computedStyle, lineGroups } = this;
    lineGroups.splice(0);
    let {
      [TEXT_ALIGN]: textAlign,
    } = computedStyle;
    let { fixedWidth, fixedHeight, x, y, w, h } = this.__preLayout(data);
    if(fixedWidth && isVirtual) {
      this.__width = w;
      this.__ioSize(w, this.height);
      return;
    }
    // 因精度问题，统计宽度均从0开始累加每行，最后取最大值，仅在abs布局时isVirtual生效
    let maxW = 0;
    let cw = 0;
    // 递归布局，将inline的节点组成lineGroup一行
    let lineGroup = new LineGroup(x, y);
    flowChildren.forEach(item => {
      if(item instanceof Xom || item instanceof Component && item.shadowRoot instanceof Xom) {
        if(item.currentStyle[DISPLAY] !== 'inline') {
          item.currentStyle[DISPLAY] = item.computedStyle[DISPLAY] = 'inline';
          inject.error('Inline can not contain block/flex');
        }
        // inline开头，不用考虑是否放得下直接放
        if(x === data.x) {
          lineGroup.add(item);
          item.__layout({
            x,
            y,
            w,
            h,
          }, isVirtual);
          x += item.outerWidth;
          maxW = Math.max(maxW, cw);
          cw = item.outerWidth;
        }
        else {
          // 非开头先尝试是否放得下
          let fw = item.__tryLayInline(w - x + data.x, w);
          // 放得下继续
          if(fw >= 0) {
            item.__layout({
              x,
              y,
              w,
              h,
            }, isVirtual);
          }
          // 放不下处理之前的lineGroup，并重新开头
          else {
            lineGroups.push(lineGroup);
            lineGroup.verticalAlign();
            x = data.x;
            y += lineGroup.height;
            item.__layout({
              x: data.x,
              y,
              w,
              h,
            }, isVirtual);
            lineGroup = new LineGroup(x, y);
            maxW = Math.max(maxW, cw);
            cw = 0;
          }
          x += item.outerWidth;
          lineGroup.add(item);
          cw += item.outerWidth;
        }
      }
      // inline里的其它只有文本
      else {
        if(x === data.x) {
          lineGroup.add(item);
          item.__layout({
            x,
            y,
            w,
            h,
          }, isVirtual);
          x += item.width;
          maxW = Math.max(maxW, cw);
          cw = item.width;
        }
        else {
          // 非开头先尝试是否放得下
          let fw = item.__tryLayInline(w - x + data.x);
          // 放得下继续
          if(fw >= 0) {
            item.__layout({
              x,
              y,
              w,
              h,
            }, isVirtual);
          }
          // 放不下处理之前的lineGroup，并重新开头
          else {
            lineGroups.push(lineGroup);
            if(!isVirtual) {
              lineGroup.verticalAlign();
            }
            x = data.x;
            y += lineGroup.height;
            item.__layout({
              x: data.x,
              y,
              w,
              h,
            }, isVirtual);
            lineGroup = new LineGroup(x, y);
            maxW = Math.max(maxW, cw);
            cw = 0;
          }
          x += item.width;
          lineGroup.add(item);
          cw += item.width;
        }
      }
    });
    // 结束后处理可能遗留的最后的lineGroup，children为空时可能size为空
    if(lineGroup.size) {
      lineGroups.push(lineGroup);
      // flex/abs的虚拟前置布局，无需真正计算
      if(!isVirtual) {
        lineGroup.verticalAlign();
      }
      y += lineGroup.height;
      maxW = Math.max(maxW, cw);
    }
    // 元素的width不能超过父元素w
    let tw = this.__width = fixedWidth ? w : maxW;
    let th = this.__height = fixedHeight ? h : y - data.y;
    this.__ioSize(tw, th);
    // text-align
    if(!isVirtual && ['center', 'right'].indexOf(textAlign) > -1) {
      lineGroups.forEach(lineGroup => {
        let diff = this.__width - lineGroup.width;
        if(diff > 0) {
          lineGroup.horizonAlign(textAlign === 'center' ? diff * 0.5 : diff);
        }
      });
    }
  }

  /**
   * 只针对绝对定位children布局
   * @param container
   * @param data
   * @param target 可选，只针对某个abs的child特定布局，在局部更新时用
   * @private
   */
  __layoutAbs(container, data, target) {
    let { sx: x, sy: y, clientWidth, clientHeight, computedStyle } = container;
    let { isDestroyed, children, absChildren } = this;
    let {
      [DISPLAY]: display,
      [BORDER_TOP_WIDTH]: borderTopWidth,
      [BORDER_LEFT_WIDTH]: borderLeftWidth,
      [MARGIN_TOP]: marginTop,
      [MARGIN_LEFT]: marginLeft,
      [PADDING_LEFT]: paddingLeft,
    } = computedStyle;
    if(isDestroyed || display === 'none') {
      this.__layoutNone();
      return;
    }
    x += marginLeft + borderLeftWidth;
    y += marginTop + borderTopWidth;
    // 对absolute的元素进行相对容器布局
    absChildren.forEach(item => {
      if(target) {
        // 传入target局部布局更新，这时候如果是Component引发的，当setState时是Cp自身，当layout时是sr
        let node = item;
        if(node instanceof Component) {
          node = item.shadowRoot;
        }
        // 所以得2个都对比
        if(target !== node && target !== item) {
          return;
        }
      }
      let { currentStyle, computedStyle } = item;
      if(currentStyle[DISPLAY] === 'none') {
        item.__layoutNone();
        return;
      }
      // 先根据容器宽度计算margin/padding
      item.__mp(currentStyle, computedStyle, clientWidth);
      if(currentStyle[DISPLAY] === 'inline') {
        currentStyle[DISPLAY] = computedStyle[DISPLAY] = item.style.display = 'block';
      }
      let { [LEFT]: left, [TOP]: top, [RIGHT]: right,
        [BOTTOM]: bottom, [WIDTH]: width, [HEIGHT]: height, [DISPLAY]: display,
        [FLEX_DIRECTION]: flexDirection } = currentStyle;
      let x2, y2, w2, h2;
      let onlyRight;
      let onlyBottom;
      let fixedTop;
      let fixedRight;
      let fixedBottom;
      let fixedLeft;
      // 判断何种方式的定位，比如左+宽度，左+右之类
      if(left[1] !== AUTO) {
        fixedLeft = true;
        computedStyle[LEFT] = calAbsolute(currentStyle, 'left', left, clientWidth);
      }
      else {
        computedStyle[LEFT] = 'auto';
      }
      if(right[1] !== AUTO) {
        fixedRight = true;
        computedStyle[RIGHT] = calAbsolute(currentStyle, 'right', right, clientWidth);
      }
      else {
        computedStyle[RIGHT] = 'auto';
      }
      if(top[1] !== AUTO) {
        fixedTop = true;
        computedStyle[TOP] = calAbsolute(currentStyle, 'top', top, clientHeight);
      }
      else {
        computedStyle[TOP] = 'auto';
      }
      if(bottom[1] !== AUTO) {
        fixedBottom = true;
        computedStyle[BOTTOM] = calAbsolute(currentStyle, 'bottom', bottom, clientHeight);
      }
      else {
        computedStyle[BOTTOM] = 'auto';
      }
      // 优先级最高left+right，其次left+width，再次right+width，再次仅申明单个，最次全部auto
      if(fixedLeft && fixedRight) {
        x2 = x + computedStyle[LEFT];
        w2 = x + clientWidth - computedStyle[RIGHT] - x2;
      }
      else if(fixedLeft && width[1] !== AUTO) {
        x2 = x + computedStyle[LEFT];
        w2 = width[1] === PX ? width[0] : clientWidth * width[0] * 0.01;
      }
      else if(fixedRight && width[1] !== AUTO) {
        w2 = width[1] === PX ? width[0] : clientWidth * width[0] * 0.01;
        x2 = x + clientWidth - computedStyle[RIGHT] - w2;
        // 右对齐有尺寸时y值还需减去margin/border/padding的
        x2 -= computedStyle[MARGIN_LEFT];
        x2 -= computedStyle[MARGIN_RIGHT];
        x2 -= computedStyle[PADDING_LEFT];
        x2 -= computedStyle[PADDING_RIGHT];
        x2 -= currentStyle[BORDER_LEFT_WIDTH][0];
        x2 -= currentStyle[BORDER_RIGHT_WIDTH][0];
      }
      else if(fixedLeft) {
        x2 = x + computedStyle[LEFT];
      }
      else if(fixedRight) {
        x2 = x + clientWidth - computedStyle[RIGHT];
        onlyRight = true;
      }
      else {
        x2 = x + paddingLeft;
        if(width[1] !== AUTO) {
          w2 = width[1] === PX ? width[0] : clientWidth * width[0] * 0.01;
        }
      }
      // top/bottom/height优先级同上
      if(fixedTop && fixedBottom) {
        y2 = y + computedStyle[TOP];
        h2 = y + clientHeight - computedStyle[BOTTOM] - y2;
      }
      else if(fixedTop && height[1] !== AUTO) {
        y2 = y + computedStyle[TOP];
        h2 = height[1] === PX ? height[0] : clientHeight * height[0] * 0.01;
      }
      else if(fixedBottom && height[1] !== AUTO) {
        h2 = height[1] === PX ? height[0] : clientHeight * height[0] * 0.01;
        y2 = y + clientHeight - computedStyle[BOTTOM] - h2;
        // 底对齐有尺寸时y值还需减去margin/border/padding的
        y2 -= computedStyle[MARGIN_TOP];
        y2 -= computedStyle[MARGIN_BOTTOM];
        y2 -= computedStyle[PADDING_TOP];
        y2 -= computedStyle[PADDING_BOTTOM];
        y2 -= currentStyle[BORDER_TOP_WIDTH][0];
        y2 -= currentStyle[BORDER_BOTTOM_WIDTH][0];
      }
      else if(fixedTop) {
        y2 = y + computedStyle[TOP];
      }
      else if(fixedBottom) {
        y2 = y + clientHeight - computedStyle[BOTTOM];
        onlyBottom = true;
      }
      // 未声明y的找到之前的流布局child，紧随其下
      else {
        y2 = y;
        let prev = item.prev;
        while(prev) {
          // 目前不考虑margin合并，直接以前面的flow的最近的prev末尾为准
          if(prev instanceof Text || prev.computedStyle[POSITION] !== 'absolute') {
            y2 = prev.y + prev.outerHeight;
            break;
          }
          prev = prev.prev;
        }
        if(height[1] !== AUTO) {
          h2 = height[1] === PX ? height[0] : clientHeight * height[0] * 0.01;
        }
      }
      // 没设宽高，需手动计算获取最大宽高后，赋给样式再布局
      let needCalWidth;
      if(display === 'block' && w2 === undefined) {
        needCalWidth = true;
      }
      else if(display === 'flex') {
        if(w2 === undefined) {
          needCalWidth = true;
        }
        else if(flexDirection === 'column' && h2 === undefined) {
          needCalWidth = true;
        }
      }
      // onlyRight时做的布局其实是以那个点位为left/top布局然后offset，limit要特殊计算，从本点向左侧为边界
      let wl = onlyRight ? x2 - x : clientWidth + x - x2;
      // onlyBottom相同，正常情况是左上到右下的尺寸限制
      let hl = onlyBottom ? y2 - y : clientHeight + y - y2;
      // 未直接或间接定义尺寸，取孩子宽度最大值
      if(needCalWidth) {
        item.__layout({
          x: x2,
          y: y2,
          w: wl,
          h: hl,
        }, true, true);
        wl = item.outerWidth;
      }
      // needCalWidth传入，因为自适应尺寸上面已经计算过一次margin/padding了
      item.__layout({
        x: x2,
        y: y2,
        w: wl,
        h: hl,
        w2, // left+right这种等于有宽度，但不能修改style，继续传入到__preLayout中特殊对待
        h2,
      }, false, true);
      if(onlyRight) {
        item.__offsetX(-item.outerWidth, true);
      }
      if(onlyBottom) {
        item.__offsetY(-item.outerHeight, true);
      }
    });
    // 递归进行，遇到absolute/relative/component的设置新容器
    children.forEach(item => {
      if(target) {
        // 传入target局部布局更新，这时候如果是Component引发的，当setState时是Cp自身，当layout时是sr
        let node = item;
        if(node instanceof Component) {
          node = item.shadowRoot;
        }
        // 所以得2个都对比
        if(target !== node && target !== item) {
          return;
        }
      }
      if(item instanceof Dom) {
        item.__layoutAbs(isRelativeOrAbsolute(item) ? item : container, data);
      }
      else if(item instanceof Component) {
        let sr = item.shadowRoot;
        if(sr instanceof Dom) {
          sr.__layoutAbs(sr, data);
        }
      }
    });
  }

  /**
   * 布局前检查继承的样式以及统计字体测量信息
   * 首次检查为整树遍历，后续检查是节点自发局部检查，不再进入
   * @param renderMode
   * @param ctx
   * @param isHost
   * @param cb
   * @private
   */
  __computeMeasure(renderMode, ctx, isHost, cb) {
    super.__computeMeasure(renderMode, ctx, isHost, cb);
    // 即便自己不需要计算，但children还要继续递归检查
    this.children.forEach(item => {
      item.__computeMeasure(renderMode, ctx, false, cb);
    });
  }

  render(renderMode, lv, ctx, defs, cache) {
    let res = super.render(renderMode, lv, ctx, defs, cache);
    if(renderMode === mode.SVG) {
      this.virtualDom.type = 'dom';
    }
    return res;
  }

  __destroy() {
    if(this.isDestroyed) {
      return;
    }
    this.children.forEach(child => {
      // 有可能为空，因为diff过程中相同的cp被移到新的vd中，老的防止destroy设null
      if(child) {
        child.__destroy();
      }
    });
    super.__destroy();
  }

  __emitEvent(e, force) {
    if(force) {
      return super.__emitEvent(e, force);
    }
    let { isDestroyed, computedStyle } = this;
    if(isDestroyed || computedStyle[DISPLAY] === 'none' || e.__stopPropagation) {
      return;
    }
    let { event: { type } } = e;
    let { listener, zIndexChildren } = this;
    let cb;
    if(listener.hasOwnProperty(type)) {
      cb = listener[type];
    }
    // child触发则parent一定触发
    for(let i = zIndexChildren.length - 1; i >=0; i--) {
      let child = zIndexChildren[i];
      if(child instanceof Xom
        || child instanceof Component && child.shadowRoot instanceof Xom) {
        if(child.__emitEvent(e)) {
          // 孩子阻止冒泡
          if(e.__stopPropagation) {
            return;
          }
          if(util.isFunction(cb) && !e.__stopImmediatePropagation) {
            cb.call(this, e);
          }
          return true;
        }
      }
    }
    // child不触发再看自己
    return super.__emitEvent(e);
  }

  // 深度遍历执行所有子节点，包含自己，如果cb返回true，提前跳出不继续深度遍历
  __deepScan(cb, options) {
    if(super.__deepScan(cb, options)) {
      return;
    }
    this.children.forEach(node => {
      node.__deepScan(cb, options);
    });
  }

  get children() {
    return this.__children;
  }

  get flowChildren() {
    return this.children.filter(item => {
      if(item instanceof Component) {
        item = item.shadowRoot;
      }
      return item instanceof Text || item.currentStyle[POSITION] !== 'absolute';
    });
  }

  get absChildren() {
    return this.children.filter(item => {
      if(item instanceof Component) {
        item = item.shadowRoot;
      }
      return item instanceof Xom && item.currentStyle[POSITION] === 'absolute';
    });
  }

  get zIndexChildren() {
    return this.__zIndexChildren;
  }

  get lineGroups() {
    return this.__lineGroups;
  }

  get baseLine() {
    let len = this.lineGroups.length;
    if(len) {
      let last = this.lineGroups[len - 1];
      return last.y - this.y + last.baseLine;
    }
    return this.height;
  }
}

export default Dom;
