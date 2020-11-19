import Xom from './Xom';
import Text from './Text';
import mode from './mode';
import LineGroup from './LineGroup';
import Component from './Component';
import tag from './tag';
import reset from '../style/reset';
import css from '../style/css';
import unit from '../style/unit';
import util from '../util/util';

const { AUTO, PX, PERCENT } = unit;
const { calAbsolute, isRelativeOrAbsolute } = css;

function genZIndexChildren(dom) {
  let flow = [];
  let abs = [];
  let hasMc;
  let mcHash = {};
  let needSort = false;
  let lastIndex;
  let lastMcIndex;
  let children = dom.children;
  children.forEach((item, i) => {
    let child = item;
    if(item instanceof Component) {
      item = item.shadowRoot;
    }
    // 遮罩单独保存后特殊排序，需要有__layoutData，特殊情况下中途插入的节点还未渲染
    if(item.__layoutData || item instanceof Text) {
      if(item.isMask || item.isClip) {
        // 开头的mc忽略，后续的连续mc以第一次出现为准
        if(lastMcIndex !== undefined) {
          mcHash[lastMcIndex].push(item);
        }
        else if(i) {
          lastMcIndex = i - 1;
          mcHash[lastMcIndex] = [item];
          hasMc = true;
        }
      }
      else {
        lastMcIndex = undefined;
        if(item instanceof Xom) {
          if(isRelativeOrAbsolute(item)) {
            // 临时变量为排序使用
            child.__iIndex = i;
            let z = child.__zIndex = item.currentStyle.zIndex;
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
      if(mcHash.hasOwnProperty(i)) {
        res.splice(i + 1, 0, ...mcHash[i]);
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
    if(!style.fontWeight && tag.BOLD.hasOwnProperty(tagName)) {
      style.fontWeight = 700;
    }
    this.__style = css.normalize(style, reset.DOM_ENTRY_SET);
    // currentStyle/currentProps不深度clone，继承一层即可，动画时也是extend这样只改一层引用不动原始静态style
    this.__currentStyle = util.extend({}, this.__style);
    this.__children = children || [];
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
    res.num = zIndexChildren.length;
    res.total = total;
    return arr;
  }

  __modifyStruct(root, offset = 0) {
    let struct = this.__struct;
    let ns = this.__structure(struct.index, struct.lv, struct.childIndex);
    root.__structs.splice(struct.index + offset, struct.total + 1, ...ns);
    let d = 0;
    if(this !== root) {
      d = this.__struct.total - struct.total;
      struct = this.domParent.__struct;
      struct.total += d;
    }
    return [this.__struct, d];
  }

  /**
   * 因为zIndex的变化造成的更新，只需重排这一段顺序即可
   * 即便包含component造成的dom变化也不影响，component作为子节点reflow会再执行，这里重排老的vd
   * @param structs
   * @private
   */
  __updateStruct(structs) {
    let { index, total } = this.__struct;
    let zIndexChildren = this.__zIndexChildren = genZIndexChildren(this);
    let length = zIndexChildren.length;
    if(length === 1) {
      return;
    }
    zIndexChildren.forEach((child, i) => {
      child.__struct.childIndex = i;
    });
    // 按直接子节点划分为相同数量的若干段进行排序
    let arr = [];
    for(let i = index + 1; i <= total; i++) {
      let child = structs[i];
      arr.push({
        child,
        list: structs.slice(child.index, child.index + child.total + 1),
      });
      i += child.total;
    }
    let needSort;
    arr.sort(function(a, b) {
      let res = a.child.childIndex - b.child.childIndex;
      if(res < 0) {
        needSort = true;
      }
      return res;
    });
    if(needSort) {
      let list = [];
      arr.forEach(item => {
        list = list.concat(item.list);
      });
      list.forEach((struct, i) => {
        struct.index = index + i + 1;
      })
      structs.splice(index + 1, total, ...list);
    }
  }

  // 给定父宽度情况下，尝试行内放下后的剩余宽度，为负数即放不下
  __tryLayInline(w, total) {
    let { flowChildren, currentStyle: { width } } = this;
    if(width.unit === PX) {
      return w - width.value;
    }
    else if(width.unit === PERCENT) {
      return w - total * width.value * 0.01;
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

  __calAutoBasis(isDirectionRow, w, h, isRecursion) {
    let b = 0;
    let min = 0;
    let max = 0;
    let { flowChildren, currentStyle, computedStyle } = this;
    // 计算需考虑style的属性
    let {
      width,
      height,
      marginLeft,
      marginTop,
      marginRight,
      marginBottom,
      paddingLeft,
      paddingTop,
      paddingRight,
      paddingBottom,
      borderTopWidth,
      borderRightWidth,
      borderBottomWidth,
      borderLeftWidth,
    } = currentStyle;
    let main = isDirectionRow ? width : height;
    if(main.unit === PX) {
      b = max = main.value;
      // 递归时children的长度会影响flex元素的最小宽度
      if(isRecursion) {
        min = b;
      }
    }
    // 递归children取最大值
    flowChildren.forEach(item => {
      if(item instanceof Xom || item instanceof Component && item.shadowRoot instanceof Xom) {
        let { b: b2, min: min2, max: max2 } = item.__calAutoBasis(isDirectionRow, w, h, true);
        b = Math.max(b, b2);
        min = Math.max(min, min2);
        max = Math.max(max, max2);
      }
      // 文本水平
      else if(isDirectionRow) {
        min = Math.max(item.charWidth, min);
        max = Math.max(item.textWidth, max);
      }
      // 文本垂直
      else {
        css.computeReflow(item);
        item.__layout({
          x: 0,
          y: 0,
          w,
          h,
        }, true);
        min = Math.max(min, item.height);
        max = Math.max(max, item.height);
      }
    });
    // margin/padding/border也得计算在内，此时还没有，百分比相对于父flex元素的宽度
    if(isDirectionRow) {
      let mp = this.__calMp(marginLeft, w)
        + this.__calMp(marginRight, w)
        + this.__calMp(paddingLeft, w)
        + this.__calMp(paddingRight, w);
      let w2 = borderLeftWidth.value + borderRightWidth.value + mp;
      b += w2;
      max += w2;
      min += w2;
    }
    else {
      let mp = this.__calMp(marginTop, w)
        + this.__calMp(marginBottom, w)
        + this.__calMp(paddingTop, w)
        + this.__calMp(paddingBottom, w);
      let h2 = borderTopWidth.value + borderBottomWidth.value + mp;
      b += h2;
      max += h2;
      min += h2;
    }
    return { b, min, max };
  }

  // 换算margin/padding为px单位
  __calMp(v, w) {
    let n = 0;
    if(v.unit === PX) {
      n += v.value;
    }
    else if(v.unit === PERCENT) {
      v.value *= w * 0.01;
      v.unit = PX;
      n += v.value;
    }
    return n;
  }

  // 本身block布局时计算好所有子元素的基本位置
  __layoutBlock(data, isVirtual) {
    let { flowChildren, currentStyle, computedStyle, lineGroups } = this;
    lineGroups.splice(0);
    let {
      textAlign,
    } = computedStyle;
    let { fixedWidth, fixedHeight, x, y, w, h } = this.__preLayout(data);
    if(fixedWidth && isVirtual) {
      this.__width = w;
      return;
    }
    // 因精度问题，统计宽度均从0开始累加每行，最后取最大值，仅在abs布局时isVirtual生效
    let maxW = 0;
    let cw = 0;
    // 递归布局，将inline的节点组成lineGroup一行
    let lineGroup = new LineGroup(x, y);
    flowChildren.forEach(item => {
      if(item instanceof Xom || item instanceof Component && item.shadowRoot instanceof Xom) {
        if(item.currentStyle.display === 'inline') {
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
          y += item.outerHeight;
          if(isVirtual) {
            maxW = Math.max(maxW, item.outerWidth);
            cw = 0;
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
    this.__width = fixedWidth || !isVirtual ? w : maxW;
    this.__height = fixedHeight ? h : y - data.y;
    if(lineGroup.size) {
      y += lineGroup.marginBottom;
    }
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
  __layoutFlex(data, isVirtual) {
    let { flowChildren, currentStyle } = this;
    let {
      flexDirection,
      justifyContent,
      alignItems,
    } = currentStyle;
    let { fixedWidth, fixedHeight, x, y, w, h } = this.__preLayout(data);
    if(fixedWidth && isVirtual) {
      this.__width = w;
      return;
    }
    let maxX = 0;
    let isDirectionRow = flexDirection === 'row';
    // 计算伸缩基数
    let growList = [];
    let shrinkList = [];
    let basisList = [];
    let minList = [];
    let growSum = 0;
    let shrinkSum = 0;
    let basisSum = 0;
    let maxSum = 0;
    flowChildren.forEach(item => {
      if(item instanceof Xom || item instanceof Component && item.shadowRoot instanceof Xom) {
        // abs虚拟布局计算时纵向也是看横向宽度
        let { b, min, max } = item.__calAutoBasis(isVirtual ? true : isDirectionRow, w, h);
        if(isVirtual) {
          if(isDirectionRow) {
            maxX += max;
          }
          else {
            maxX = Math.max(maxX, max);
          }
          return;
        }
        let { currentStyle, computedStyle } = item;
        let { flexGrow, flexShrink, flexBasis } = currentStyle;
        growList.push(flexGrow);
        shrinkList.push(flexShrink);
        growSum += flexGrow;
        shrinkSum += flexShrink;
        // 根据basis不同，计算方式不同
        if(flexBasis.unit === AUTO) {
          basisList.push(max);
          basisSum += max;
        }
        else if(flexBasis.unit === PX) {
          computedStyle.flexBasis = b = flexBasis.value;
          basisList.push(b);
          basisSum += b;
        }
        else if(flexBasis.unit === PERCENT) {
          b = computedStyle.flexBasis = (isDirectionRow ? w : h) * flexBasis.value * 0.01;
          basisList.push(b);
          basisSum += b;
        }
        maxSum += max;
        minList.push(min);
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
          basisList.push(item.textWidth);
          basisSum += item.textWidth;
          maxSum += item.textWidth;
          minList.push(item.charWidth);
        }
        else {
          item.__layout({
            x: 0,
            y: 0,
            w,
            h,
          }, true);
          basisList.push(item.height);
          basisSum += item.height;
          maxSum += item.height;
          minList.push(item.height);
        }
      }
    });
    if(isVirtual) {
      this.__width = Math.min(maxX, w);
      return;
    }
    let maxCross = 0;
    // 判断是否超出，决定使用grow还是shrink
    let isOverflow = maxSum > (isDirectionRow ? w : h);
    flowChildren.forEach((item, i) => {
      let main;
      let shrink = shrinkList[i];
      let grow = growList[i];
      // 计算主轴长度
      if(isOverflow) {
        let overflow = basisSum - (isDirectionRow ? w : h);
        main = shrink ? (basisList[i] - overflow * shrink / shrinkSum) : basisList[i];
      }
      else {
        let free = (isDirectionRow ? w : h) - basisSum;
        main = grow ? (basisList[i] + free * grow / growSum) : basisList[i];
      }
      // 主轴长度的最小值不能小于元素的最小长度，比如横向时的字符宽度
      main = Math.max(main, minList[i]);
      if(item instanceof Xom || item instanceof Component && item.shadowRoot instanceof Xom) {
        let { currentStyle, computedStyle } = item;
        let {
          display,
          flexDirection,
          width,
          height,
        } = currentStyle;
        // flex的child如果是inline，变为block
        if(display === 'inline') {
          currentStyle.display = computedStyle.display = 'block';
        }
        if(isDirectionRow) {
          // 横向flex的child如果是竖向flex，高度自动的话要等同于父flex的高度
          if(display === 'flex' && flexDirection === 'column' && fixedHeight && height.unit === AUTO) {
            height.value = h;
            height.unit = PX;
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
          if(display === 'flex' && flexDirection === 'row' && width.unit === AUTO) {
            width.value = w;
            width.unit = PX;
          }
          item.__layout({
            x,
            y,
            w,
            h: main,
          });
        }
        // 重设因伸缩而导致的主轴长度
        if(isOverflow && shrink || !isOverflow && grow) {
          let {
            borderTopWidth,
            borderRightWidth,
            borderBottomWidth,
            borderLeftWidth,
            marginTop,
            marginRight,
            marginBottom,
            marginLeft,
            paddingTop,
            paddingRight,
            paddingBottom,
            paddingLeft,
          } = computedStyle;
          if(isDirectionRow) {
            item.__width = main - marginLeft - marginRight - paddingLeft - paddingRight - borderLeftWidth - borderRightWidth;
          }
          else {
            item.__height = main - marginTop - marginBottom - paddingTop - paddingBottom - borderTopWidth - borderBottomWidth;
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
          let { computedStyle, currentStyle: { alignSelf, width, height } } = item;
          let {
            borderTopWidth,
            borderRightWidth,
            borderBottomWidth,
            borderLeftWidth,
            marginTop,
            marginRight,
            marginBottom,
            marginLeft,
            paddingTop,
            paddingRight,
            paddingBottom,
            paddingLeft,
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
            else if(height.unit === AUTO) {
              let old = item.height;
              let v = item.__height = computedStyle.height = maxCross - marginTop - marginBottom - paddingTop - paddingBottom - borderTopWidth - borderBottomWidth;
              let d = v - old;
              item.__innerHeight += d;
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
            else if(width.unit === AUTO) {
              let old = item.width;
              let v = item.__width = computedStyle.width = maxCross - marginLeft - marginRight - paddingLeft - paddingRight - borderRightWidth - borderLeftWidth;
              let d = v - old;
              item.__innerWidth += d;
              item.__outerWidth += d;
            }
          }
        });
      }
      else if(alignItems === 'center') {
        flowChildren.forEach(item => {
          let { currentStyle: { alignSelf } } = item;
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
              let { computedStyle, currentStyle: { height } } = item;
              let {
                borderTopWidth,
                borderBottomWidth,
                marginTop,
                marginBottom,
                paddingTop,
                paddingBottom,
              } = computedStyle;
              if(height.unit === AUTO) {
                let old = item.height;
                let v = item.__height = computedStyle.height = maxCross - marginTop - marginBottom - paddingTop - paddingBottom - borderTopWidth - borderBottomWidth;
                let d = v - old;
                item.__innerHeight += d;
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
              let { computedStyle, currentStyle: { width } } = item;
              let {
                borderRightWidth,
                borderLeftWidth,
                marginRight,
                marginLeft,
                paddingRight,
                paddingLeft,
              } = computedStyle;
              if(width.unit === AUTO) {
                let old = item.width;
                let v = item.__width = computedStyle.width = maxCross - marginLeft - marginRight - paddingLeft - paddingRight - borderRightWidth - borderLeftWidth;
                let d = v - old;
                item.__innerWidth += d;
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
          let { currentStyle: { alignSelf } } = item;
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
              let { computedStyle, currentStyle: { height } } = item;
              let {
                borderTopWidth,
                borderBottomWidth,
                marginTop,
                marginBottom,
                paddingTop,
                paddingBottom,
              } = computedStyle;
              if(height.unit === AUTO) {
                let old = item.height;
                let v = item.__height = computedStyle.height = maxCross - marginTop - marginBottom - paddingTop - paddingBottom - borderTopWidth - borderBottomWidth;
                let d = v - old;
                item.__innerHeight += d;
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
              let { computedStyle, currentStyle: { width } } = item;
              let {
                borderRightWidth,
                borderLeftWidth,
                marginRight,
                marginLeft,
                paddingRight,
                paddingLeft,
              } = computedStyle;
              if(width.unit === AUTO) {
                let old = item.width;
                let v = item.__width = computedStyle.width = maxCross - marginLeft - marginRight - paddingLeft - paddingRight - borderRightWidth - borderLeftWidth;
                let d = v - old;
                item.__innerWidth += d;
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
          let { currentStyle: { alignSelf } } = item;
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
              let { computedStyle, currentStyle: { height } } = item;
              let {
                borderTopWidth,
                borderBottomWidth,
                marginTop,
                marginBottom,
                paddingTop,
                paddingBottom,
              } = computedStyle;
              if(height.unit === AUTO) {
                let old = item.height;
                let v = item.__height = item.__height = computedStyle.height = maxCross - marginTop - marginBottom - paddingTop - paddingBottom - borderTopWidth - borderBottomWidth;
                let d = v - old;
                item.__innerHeight += d;
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
              let { computedStyle, currentStyle: { width } } = item;
              let {
                borderRightWidth,
                borderLeftWidth,
                marginRight,
                marginLeft,
                paddingRight,
                paddingLeft,
              } = computedStyle;
              if(width.unit === AUTO) {
                let old = item.width;
                let v = item.__width = computedStyle.width = maxCross - marginLeft - marginRight - paddingLeft - paddingRight - borderRightWidth - borderLeftWidth;
                let d = v - old;
                item.__innerWidth += d;
                item.__outerWidth += d;
              }
            }
          }
        });
      }
    }
    this.__width = w;
    this.__height = fixedHeight ? h : y - data.y;
    this.__marginAuto(currentStyle, data);
  }

  // inline比较特殊，先简单顶部对其，后续还需根据vertical和lineHeight计算y偏移
  __layoutInline(data, isVirtual) {
    let { flowChildren, computedStyle, lineGroups } = this;
    lineGroups.splice(0);
    let {
      textAlign,
    } = computedStyle;
    let { fixedWidth, fixedHeight, x, y, w, h } = this.__preLayout(data);
    if(fixedWidth && isVirtual) {
      this.__width = w;
      return;
    }
    // 因精度问题，统计宽度均从0开始累加每行，最后取最大值，仅在abs布局时isVirtual生效
    let maxW = 0;
    let cw = 0;
    // 递归布局，将inline的节点组成lineGroup一行
    let lineGroup = new LineGroup(x, y);
    flowChildren.forEach(item => {
      if(item instanceof Xom || item instanceof Component && item.shadowRoot instanceof Xom) {
        if(item.currentStyle.display !== 'inline') {
          item.currentStyle.display = item.computedStyle.display = 'inline';
          console.error('Inline can not contain block/flex');
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
    this.__width = fixedWidth ? w : maxW;
    this.__height = fixedHeight ? h : y - data.y;
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
    let { sx: x, sy: y, innerWidth, innerHeight, computedStyle } = container;
    let { isDestroyed, children, absChildren } = this;
    let {
      display,
      borderTopWidth,
      borderLeftWidth,
      marginTop,
      marginLeft,
      paddingLeft,
    } = computedStyle;
    if(isDestroyed || display === 'none') {
      return;
    }
    x += marginLeft + borderLeftWidth;
    y += marginTop + borderTopWidth;
    // 对absolute的元素进行相对容器布局
    absChildren.forEach(item => {
      if(target && target !== item) {
        return;
      }
      let { currentStyle, computedStyle } = item;
      // 先根据容器宽度计算margin/padding
      item.__mp(currentStyle, computedStyle, innerWidth);
      if(computedStyle.display === 'inline') {
        currentStyle.display = computedStyle.display = 'block';
      }
      let { left, top, right, bottom, width, height, display, flexDirection } = currentStyle;
      let x2, y2, w2, h2;
      let onlyRight;
      let onlyBottom;
      let fixedTop;
      let fixedRight;
      let fixedBottom;
      let fixedLeft;
      // 判断何种方式的定位，比如左+宽度，左+右之类
      if(left.unit !== AUTO) {
        fixedLeft = true;
        computedStyle.left = calAbsolute(currentStyle, 'left', left, innerWidth);
      }
      else {
        computedStyle.left = 'auto';
      }
      if(right.unit !== AUTO) {
        fixedRight = true;
        computedStyle.right = calAbsolute(currentStyle, 'right', right, innerWidth);
      }
      else {
        computedStyle.right = 'auto';
      }
      if(top.unit !== AUTO) {
        fixedTop = true;
        computedStyle.top = calAbsolute(currentStyle, 'top', top, innerHeight);
      }
      else {
        computedStyle.top = 'auto';
      }
      if(bottom.unit !== AUTO) {
        fixedBottom = true;
        computedStyle.bottom = calAbsolute(currentStyle, 'bottom', bottom, innerHeight);
      }
      else {
        computedStyle.bottom = 'auto';
      }
      // 优先级最高left+right，其次left+width，再次right+width，再次仅申明单个，最次全部auto
      if(fixedLeft && fixedRight) {
        x2 = x + computedStyle.left;
        w2 = x + innerWidth - computedStyle.right - x2;
      }
      else if(fixedLeft && width.unit !== AUTO) {
        x2 = x + computedStyle.left;
        w2 = width.unit === PX ? width.value : innerWidth * width.value * 0.01;
      }
      else if(fixedRight && width.unit !== AUTO) {
        w2 = width.unit === PX ? width.value : innerWidth * width.value * 0.01;
        x2 = x + innerWidth - computedStyle.right - w2;
        // 右对齐有尺寸时y值还需减去margin/border/padding的
        x2 -= computedStyle.marginLeft;
        x2 -= computedStyle.marginRight;
        x2 -= computedStyle.paddingLeft;
        x2 -= computedStyle.paddingRight;
        x2 -= currentStyle.borderLeftWidth.value;
        x2 -= currentStyle.borderRightWidth.value;
      }
      else if(fixedLeft) {
        x2 = x + computedStyle.left;
      }
      else if(fixedRight) {
        x2 = x + innerWidth - computedStyle.right;
        onlyRight = true;
      }
      else {
        x2 = x + paddingLeft;
        if(width.unit !== AUTO) {
          w2 = width.unit === PX ? width.value : innerWidth * width.value * 0.01;
        }
      }
      // top/bottom/height优先级同上
      if(fixedTop && fixedBottom) {
        y2 = y + computedStyle.top;
        h2 = y + innerHeight - computedStyle.bottom - y2;
      }
      else if(fixedTop && height.unit !== AUTO) {
        y2 = y + computedStyle.top;
        h2 = height.unit === PX ? height.value : innerHeight * height.value * 0.01;
      }
      else if(fixedBottom && height.unit !== AUTO) {
        h2 = height.unit === PX ? height.value : innerHeight * height.value * 0.01;
        y2 = y + innerHeight - computedStyle.bottom - h2;
        // 底对齐有尺寸时y值还需减去margin/border/padding的
        y2 -= computedStyle.marginTop;
        y2 -= computedStyle.marginBottom;
        y2 -= computedStyle.paddingTop;
        y2 -= computedStyle.paddingBottom;
        y2 -= currentStyle.borderTopWidth.value;
        y2 -= currentStyle.borderBottomWidth.value;
      }
      else if(fixedTop) {
        y2 = y + computedStyle.top;
      }
      else if(fixedBottom) {
        y2 = y + innerHeight - computedStyle.bottom;
        onlyBottom = true;
      }
      // 未声明y的找到之前的流布局child，紧随其下
      else {
        y2 = y;
        let prev = item.prev;
        while(prev) {
          if(prev instanceof Text || prev.computedStyle.position !== 'absolute') {
            y2 = prev.y + prev.outerHeight;
            break;
          }
          prev = prev.prev;
        }
        if(!prev) {
          y2 = y;
        }
        if(height.unit !== AUTO) {
          h2 = height.unit === PX ? height.value : innerHeight * height.value * 0.01;
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
      let wl = onlyRight ? x2 - x : innerWidth + x - x2;
      // onlyBottom相同，正常情况是左上到右下的尺寸限制
      let hl = onlyBottom ? y2 - y : innerHeight + y - y2;
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
      if(target && target !== item) {
        return;
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
    this.children.splice(0);
    this.lineGroups.splice(0);
  }

  __emitEvent(e, force) {
    if(force) {
      return super.__emitEvent(e, force);
    }
    let { isDestroyed, computedStyle } = this;
    if(isDestroyed || computedStyle.display === 'none' || e.__stopPropagation) {
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

  __cancelCache(recursion) {
    super.__cancelCache(recursion);
    if(recursion) {
      this.children.forEach(child => {
        if(child instanceof Xom || child instanceof Component && child.shadowRoot instanceof Xom) {
          child.__cancelCache(recursion);
        }
      });
    }
  }

  // 深度遍历执行所有子节点，包含自己，如果cb返回true，提前跳出不继续深度遍历
  deepScan(cb, options) {
    if(super.deepScan(cb, options)) {
      return;
    }
    this.children.forEach(node => {
      node.deepScan(cb, options);
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
      return item instanceof Text || item.currentStyle.position !== 'absolute';
    });
  }

  get absChildren() {
    return this.children.filter(item => {
      if(item instanceof Component) {
        item = item.shadowRoot;
      }
      return item instanceof Xom && item.currentStyle.position === 'absolute';
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
    return this.y;
  }
}

export default Dom;
