import Xom from './Xom';
import Text from './Text';
import LineGroup from './LineGroup';
import Geom from '../geom/Geom';
import util from '../util/util';
import reset from '../style/reset';
import css from '../style/css';
import unit from '../style/unit';
import mode from '../util/mode';
import sort from '../util/sort';
import Component from './Component';

const TAG_NAME = {
  'div': true,
  'span': true,
  'img': true,
};
const INLINE = {
  'span': true,
  'img': true,
};

class Dom extends Xom {
  constructor(tagName, props, children) {
    super(tagName, props);
    this.__children = children || [];
    this.__flowChildren = []; // 非绝对定位孩子
    this.__absChildren = []; // 绝对定位孩子
    this.__lineGroups = []; // 一行inline元素组成的LineGroup对象后的存放列表
  }

  /**
   * 1. 封装string为Text节点
   * 2. 打平children中的数组，变成一维
   * 3. 合并相连的Text节点
   * 4. 检测inline不能包含block和flex
   * 5. 设置parent和prev/next和ctx和defs和mode
   */
  __traverse(ctx, defs, renderMode) {
    let list = [];
    this.__traverseChildren(this.children, list, ctx, defs, renderMode);
    for(let i = list.length - 1; i > 0; i--) {
      let item = list[i];
      if(item instanceof Text) {
        let prev = list[i - 1];
        if(prev instanceof Text) {
          prev.content += item.content;
          list.splice(i, 1);
        }
        else {
          i--;
        }
      }
    }
    let prev = null;
    list.forEach(item => {
      item.__ctx = ctx;
      item.__defs = defs;
      if(prev) {
        prev.__next = item;
        item.__prev = prev;
      }
      item.__parent = this;
      prev = item;
    });
    this.__children = list;
  }

  __traverseChildren(children, list, ctx, defs, renderMode) {
    if(Array.isArray(children)) {
      children.forEach(item => {
        this.__traverseChildren(item, list, ctx, defs, renderMode);
      });
    }
    else if(children instanceof Dom || children instanceof Component) {
      list.push(children);
      children.__traverse(ctx, defs, renderMode);
    }
    // 图形没有children
    else if(children instanceof Geom) {
      list.push(children);
    }
    // 排除掉空的文本
    else if(!util.isNil(children)) {
      let text = new Text(children);
      text.__renderMode = renderMode;
      list.push(text);
    }
  }

  // 合并设置style，包括继承和默认值，修改一些自动值和固定值，测量所有文字的宽度
  __init() {
    let style = this.__style;
    // 仅支持flex/block/inline/none
    if(!style.display || ['flex', 'block', 'inline', 'none'].indexOf(style.display) === -1) {
      if(INLINE.hasOwnProperty(this.tagName)) {
        style.display = 'inline';
      }
      else {
        style.display = 'block';
      }
    }
    // 标准化处理，默认值、简写属性
    css.normalize(style, reset.dom);
    this.children.forEach(item => {
      if(item instanceof Xom || item instanceof Component) {
        item.__init();
      }
      else {
        item.__style = style;
      }
      if(item instanceof Text || item.style.position !== 'absolute') {
        this.__flowChildren.push(item);
      }
      else {
        this.__absChildren.push(item);
      }
    });
    let ref = this.props.ref;
    if(ref) {
      let owner = this.host || this.root;
      if(owner) {
        owner.ref[ref] = this;
      }
    }
  }

  // 给定父宽度情况下，尝试行内放下后的剩余宽度，为负数即放不下
  __tryLayInline(w, total) {
    let { flowChildren, currentStyle: { width } } = this;
    if(width.unit === unit.PX) {
      return w - width.value;
    }
    else if(width.unit === unit.PERCENT) {
      return w - total * width.value * 0.01;
    }
    for(let i = 0; i < flowChildren.length; i++) {
      // 当放不下时直接返回，无需继续多余的尝试计算
      if(w < 0) {
        return w;
      }
      let item = flowChildren[i];
      if(item instanceof Xom) {
        w -= item.__tryLayInline(w, total);
      }
      else {
        w -= item.textWidth;
      }
    }
    return w;
  }

  // 设置y偏移值，递归包括children，此举在justify-content/margin-auto等对齐用
  __offsetX(diff, isLayout) {
    super.__offsetX(diff, isLayout);
    this.flowChildren.forEach(item => {
      if(item) {
        item.__offsetX(diff, isLayout);
      }
    });
  }

  __offsetY(diff, isLayout) {
    super.__offsetY(diff, isLayout);
    this.flowChildren.forEach(item => {
      if(item) {
        item.__offsetY(diff, isLayout);
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
    } = currentStyle;
    let {
      borderTopWidth,
      borderRightWidth,
      borderBottomWidth,
      borderLeftWidth,
    } = computedStyle;
    let main = isDirectionRow ? width : height;
    if(main.unit === unit.PX) {
      b = max = main.value;
      // 递归时children的长度会影响flex元素的最小宽度
      if(isRecursion) {
        min = b;
      }
    }
    // 递归children取最大值
    flowChildren.forEach(item => {
      if(item instanceof Xom || item instanceof Component) {
        let { b: b2, min: min2, max: max2 } = item.__calAutoBasis(isDirectionRow, w, h, true);
        b = Math.max(b, b2);
        min = Math.max(min, min2);
        max = Math.max(max, max2);
      }
      // 文本
      else if(isDirectionRow) {
        min = Math.max(item.charWidth, min);
        max = Math.max(item.textWidth, max);
      }
      // Geom
      else {
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
      let w2 = borderRightWidth + borderLeftWidth + mp;
      b += w2;
      max += w2;
      min += w2;
    }
    else {
      let mp = this.__calMp(marginTop, w)
        + this.__calMp(marginBottom, w)
        + this.__calMp(paddingTop, w)
        + this.__calMp(paddingBottom, w);
      let h2 = borderTopWidth + borderBottomWidth + mp;
      b += h2;
      max += h2;
      min += h2;
    }
    return { b, min, max };
  }

  // 换算margin/padding为px单位
  __calMp(v, w) {
    let n = 0;
    if(v.unit === unit.PX) {
      n += v.value;
    }
    else if(v.unit === unit.PERCENT) {
      v.value *= w * 0.01;
      v.unit = unit.PX;
      n += v.value;
    }
    return n;
  }

  // 本身block布局时计算好所有子元素的基本位置
  __layoutBlock(data) {
    let { flowChildren, currentStyle, computedStyle, lineGroups } = this;
    lineGroups.splice(0);
    let {
      textAlign,
    } = computedStyle;
    let { fixedHeight, x, y, w, h } = this.__preLayout(data);
    // 递归布局，将inline的节点组成lineGroup一行
    let lineGroup = new LineGroup(x, y);
    flowChildren.forEach(item => {
      if(item instanceof Xom || item instanceof Component) {
        if(item.currentStyle.display === 'inline') {
          // inline开头，不用考虑是否放得下直接放
          if(x === data.x) {
            lineGroup.add(item);
            item.__layout({
              x,
              y,
              w,
              h,
            });
            x += item.outerWidth;
          }
          else {
            // 非开头先尝试是否放得下
            let fw = item.__tryLayInline(w - x, w);
            // 放得下继续
            if(fw >= 0) {
              item.__layout({
                x,
                y,
                w,
                h,
              });
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
              });
              lineGroup = new LineGroup(x, y);
            }
            x += item.outerWidth;
            lineGroup.add(item);
          }
        }
        else {
          // block先处理之前可能的lineGroup
          if(lineGroup.size) {
            lineGroups.push(lineGroup);
            lineGroup.verticalAlign();
            y += lineGroup.height;
            lineGroup = new LineGroup(data.x, y);
          }
          item.__layout({
            x: data.x,
            y,
            w,
            h,
          });
          x = data.x;
          y += item.outerHeight;
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
          });
          x += item.width;
        }
        else {
          // 非开头先尝试是否放得下
          let fw = item.__tryLayInline(w - x, w);
          // 放得下继续
          if(fw >= 0) {
            item.__layout({
              x,
              y,
              w,
              h,
            });
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
            });
            lineGroup = new LineGroup(x, y);
          }
          x += item.width;
          lineGroup.add(item);
        }
      }
    });
    // 结束后处理可能遗留的最后的lineGroup
    if(lineGroup.size) {
      lineGroups.push(lineGroup);
      lineGroup.verticalAlign();
      y += lineGroup.height;
    }
    this.__width = w;
    this.__height = fixedHeight ? h : y - data.y;
    // text-align
    if(['center', 'right'].indexOf(textAlign) > -1) {
      lineGroups.forEach(lineGroup => {
        let diff = w - lineGroup.width;
        if(diff > 0) {
          lineGroup.horizonAlign(textAlign === 'center' ? diff * 0.5 : diff);
        }
      });
    }
    this.__marginAuto(currentStyle, data);
  }

  // 处理margin:xx auto居中对齐
  __marginAuto(style, data) {
    if(style.marginLeft.unit === unit.AUTO && style.marginRight.unit === unit.AUTO && style.width.unit !== unit.AUTO) {
      let ow = this.outerWidth;
      if(ow < data.w) {
        this.__offsetX((data.w - ow) * 0.5, true);
      }
    }
  }

  // 弹性布局时的计算位置
  __layoutFlex(data) {
    let { flowChildren, currentStyle } = this;
    let {
      flexDirection,
      justifyContent,
      alignItems,
    } = currentStyle;
    let { fixedWidth, fixedHeight, x, y, w, h } = this.__preLayout(data);
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
      if(item instanceof Xom || item instanceof Component) {
        let { currentStyle, computedStyle } = item;
        let { flexGrow, flexShrink, flexBasis } = currentStyle;
        growList.push(flexGrow);
        shrinkList.push(flexShrink);
        growSum += flexGrow;
        shrinkSum += flexShrink;
        let { b, min, max } = item.__calAutoBasis(isDirectionRow, w, h);
        // 根据basis不同，计算方式不同
        if(flexBasis.unit === unit.AUTO) {
          basisList.push(max);
          basisSum += max;
        }
        else if(flexBasis.unit === unit.PX) {
          computedStyle.flexBasis = b = flexBasis.value;
          basisList.push(b);
          basisSum += b;
        }
        else if(flexBasis.unit === unit.PERCENT) {
          b = computedStyle.flexBasis = (isDirectionRow ? w : h) * flexBasis.value * 0.01;
          basisList.push(b);
          basisSum += b;
        }
        maxSum += max;
        minList.push(min);
      }
      else {
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
      if(item instanceof Xom || item instanceof Component) {
        let { currentStyle, computedStyle } = item;
        let {
          display,
          flexDirection,
          width,
          height,
        } = currentStyle;
        if(isDirectionRow) {
          // row的flex的child如果是inline，变为block
          if(display === 'inline') {
            currentStyle.display = computedStyle.display = 'block';
          }
          // 横向flex的child如果是竖向flex，高度自动的话要等同于父flex的高度
          else if(display === 'flex' && flexDirection === 'column' && fixedHeight && height.unit === unit.AUTO) {
            height.value = h;
            height.unit = unit.PX;
          }
          item.__layout({
            x,
            y,
            w: main,
            h,
          });
        }
        else {
          // column的flex的child如果是inline，变为block
          if(display === 'inline') {
            currentStyle.display = computedStyle.display = 'block';
          }
          // 竖向flex的child如果是横向flex，宽度自动的话要等同于父flex的宽度
          else if(display === 'flex' && flexDirection === 'row' && width.unit === unit.AUTO) {
            width.value = w;
            width.unit = unit.PX;
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
    if(alignItems === 'stretch') {
      // 短侧轴的children伸张侧轴长度至相同，超过的不动，固定宽高的也不动
      flowChildren.forEach(item => {
        let { computedStyle, currentStyle } = item;
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
          if(currentStyle.height.unit === unit.AUTO) {
            item.__height = computedStyle.height = maxCross - marginTop - marginBottom - paddingTop - paddingBottom - borderTopWidth - borderBottomWidth;
          }
        }
        else {
          if(currentStyle.width.unit === unit.AUTO) {
            item.__width = computedStyle.width = maxCross - marginLeft - marginRight - paddingLeft - paddingRight - borderRightWidth - borderLeftWidth;
          }
        }
      });
    }
    else if(alignItems === 'center') {
      flowChildren.forEach(item => {
        let diff = maxCross - item.outerHeight;
        if(diff > 0) {
          item.__offsetY(diff * 0.5, true);
        }
      });
    }
    else if(alignItems === 'flex-end') {
      flowChildren.forEach(item => {
        let diff = maxCross - item.outerHeight;
        if(diff > 0) {
          item.__offsetY(diff, true);
        }
      });
    }
    this.__width = w;
    this.__height = fixedHeight ? h : y - data.y;
    this.__marginAuto(currentStyle, data);
  }

  // inline比较特殊，先简单顶部对其，后续还需根据vertical和lineHeight计算y偏移
  __layoutInline(data, fake) {
    let { flowChildren, computedStyle, lineGroups } = this;
    lineGroups.splice(0);
    let {
      textAlign,
    } = computedStyle;
    let { fixedWidth, fixedHeight, x, y, w, h } = this.__preLayout(data);
    let maxX = x;
    // 递归布局，将inline的节点组成lineGroup一行
    let lineGroup = new LineGroup(x, y);
    flowChildren.forEach(item => {
      if(item instanceof Xom || item instanceof Component) {
        // 绝对定位跳过
        if(item.currentStyle.position === 'absolute') {
          this.absChildren.push(item);
          return;
        }
        let { display } = item.currentStyle;
        if(fake) {
          item.currentStyle.display = 'inline';
        }
        // inline开头，不用考虑是否放得下直接放
        if(x === data.x) {
          lineGroup.add(item);
          item.__layout({
            x,
            y,
            w,
            h,
          });
          x += item.outerWidth;
          maxX = Math.max(maxX, x);
        }
        else {
          // 非开头先尝试是否放得下
          let fw = item.__tryLayInline(w - x, w);
          // 放得下继续
          if(fw >= 0) {
            item.__layout({
              x,
              y,
              w,
              h,
            });
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
            });
            lineGroup = new LineGroup(x, y);
          }
          x += item.outerWidth;
          maxX = Math.max(maxX, x);
          lineGroup.add(item);
        }
        if(fake) {
          item.currentStyle.display = display;
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
          });
          x += item.width;
          maxX = Math.max(maxX, x);
        }
        else {
          // 非开头先尝试是否放得下
          let fw = item.__tryLayInline(w - x, w);
          // 放得下继续
          if(fw >= 0) {
            item.__layout({
              x,
              y,
              w,
              h,
            });
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
            });
            lineGroup = new LineGroup(x, y);
          }
          x += item.width;
          maxX = Math.max(maxX, x);
          lineGroup.add(item);
        }
      }
    });
    // 结束后处理可能遗留的最后的lineGroup，children为空时可能size为空
    if(lineGroup.size) {
      lineGroups.push(lineGroup);
      lineGroup.verticalAlign();
      y += lineGroup.height;
    }
    // 元素的width不能超过父元素w
    this.__width = fixedWidth ? w : maxX - data.x;
    this.__height = fixedHeight ? h : y - data.y;
    // text-align
    if(['center', 'right'].indexOf(textAlign) > -1) {
      lineGroups.forEach(lineGroup => {
        let diff = this.__width - lineGroup.width;
        if(diff > 0) {
          lineGroup.horizonAlign(textAlign === 'center' ? diff * 0.5 : diff);
        }
      });
    }
  }

  // 只针对绝对定位children布局
  __layoutAbs(container, data) {
    let { x, y, width, height, currentStyle, computedStyle } = container;
    let { isDestroyed, children, absChildren } = this;
    let {
      display,
    } = currentStyle;
    let {
      borderTopWidth,
      borderLeftWidth,
      marginTop,
      marginLeft,
      paddingTop,
      paddingRight,
      paddingBottom,
      paddingLeft,
    } = computedStyle;
    if(isDestroyed || display === 'none') {
      return;
    }
    x += marginLeft + borderLeftWidth;
    y += marginTop + borderTopWidth;
    let iw = width + paddingLeft + paddingRight;
    let ih = height + paddingTop + paddingBottom;
    // 对absolute的元素进行相对容器布局
    absChildren.forEach(item => {
      let { currentStyle, computedStyle } = item;
      let { left, top, right, bottom, width, height, display, flexDirection } = currentStyle;
      let x2, y2, w2, h2;
      let onlyRight;
      let onlyBottom;
      let fixedTop;
      let fixedRight;
      let fixedBottom;
      let fixedLeft;
      if(left !== undefined && left.unit !== unit.AUTO) {
        fixedLeft = true;
        computedStyle.left = css.calAbsolute(currentStyle, 'left', left, iw);
      }
      else {
        computedStyle.left = 'auto';
      }
      if(right !== undefined && right.unit !== unit.AUTO) {
        fixedRight = true;
        computedStyle.right = css.calAbsolute(currentStyle, 'right', right, iw);
      }
      else {
        computedStyle.right = 'auto';
      }
      if(top !== undefined && top.unit !== unit.AUTO) {
        fixedTop = true;
        computedStyle.top = css.calAbsolute(currentStyle, 'top', top, ih);
      }
      else {
        computedStyle.top = 'auto';
      }
      if(bottom !== undefined && bottom.unit !== unit.AUTO) {
        fixedBottom = true;
        computedStyle.bottom = css.calAbsolute(currentStyle, 'bottom', bottom, ih);
      }
      else {
        computedStyle.bottom = 'auto';
      }
      // width优先级高于right高于left，即最高left+right，其次left+width，再次right+width，然后仅申明单个，最次全部auto
      if(fixedLeft && fixedRight) {
        x2 = x + computedStyle.left;
        w2 = x + iw - computedStyle.right - x2;
      }
      else if(fixedLeft && width.unit !== unit.AUTO) {
        x2 = x + computedStyle.left;
        w2 = width.unit === unit.PX ? width.value : iw * width.value * 0.01;
      }
      else if(fixedRight && width.unit !== unit.AUTO) {
        w2 = width.unit === unit.PX ? width.value : iw * width.value * 0.01;
        x2 = x + iw - computedStyle.right - w2;
      }
      else if(fixedLeft) {
        x2 = x + computedStyle.left;
      }
      else if(fixedRight) {
        x2 = x + iw - computedStyle.right;
        onlyRight = true;
      }
      else {
        x2 = x + paddingLeft;
        if(width.unit !== unit.AUTO) {
          w2 = width.unit === unit.PX ? width.value : iw * width.value * 0.01;
        }
      }
      // top/bottom/height优先级同上
      if(fixedTop && fixedBottom) {
        y2 = y + computedStyle.top;
        h2 = y + ih - computedStyle.bottom - y2;
      }
      else if(fixedTop && height.unit !== unit.AUTO) {
        y2 = y + computedStyle.top;
        h2 = height.unit === unit.PX ? height.value : ih * height.value * 0.01;
      }
      else if(fixedBottom && height.unit !== unit.AUTO) {
        h2 = height.unit === unit.PX ? height.value : ih * height.value * 0.01;
        y2 = y + ih - computedStyle.bottom - h2;
      }
      else if(fixedTop) {
        y2 = y + computedStyle.top;
      }
      else if(fixedBottom) {
        y2 = y + ih - computedStyle.bottom;
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
        if(height.unit !== unit.AUTO) {
          h2 = height.unit === unit.PX ? height.value : ih * height.value * 0.01;
        }
      }
      if(w2 !== undefined) {
        currentStyle.width = {
          value: w2,
          unit: unit.PX,
        };
      }
      if(h2 !== undefined) {
        currentStyle.height = {
          value: h2,
          unit: unit.PX,
        };
      }
      // 记录初始display，同时absolute不能为inline
      if (display === 'inline') {
        display = 'block';
      }
      // 没设宽高，在获取最大宽高后，display恢复重新布局一次
      let fake;
      if(display === 'block' && w2 === undefined) {
        fake = true;
      }
      else if(display === 'flex') {
        if(flexDirection === 'row' && w2 === undefined) {
          fake = true;
        }
        else if(flexDirection === 'column' && h2 === undefined) {
          fake = true;
        }
      }
      // 绝对定位模拟类似inline布局，因为宽高可能未定义，由普通流children布局后决定
      if(fake) {
        currentStyle.display = 'inline';
      }
      // onlyRight或onlyBottom时做的布局其实是以那个点位为left/top布局，外围尺寸限制要特殊计算
      if(onlyRight && onlyBottom) {
        w2 = x2 - x;
        h2 - y2 - y;
      }
      else if(onlyRight) {
        w2 = x2 - x;
        h2 = data.h - y2;
      }
      else if(onlyBottom) {
        item.__layout({
          x: x2,
          y: y2,
          w: data.w - x2,
          h: y2 - y,
        });
        w2 = data.w - x2;
        h2 - y2 - y;
      }
      else {
        w2 = data.w - x2;
        h2 = data.h - y2;
      }
      item.__layout({
        x: x2,
        y: y2,
        w: w2,
        h: h2,
      }, fake);
      // 取孩子宽度最大值，display恢复重新布局
      if(fake) {
        let max = 0;
        item.flowChildren.forEach(item => {
          max = Math.max(max, item.outerWidth);
        });
        currentStyle.width = {
          value: max,
          unit: unit.PX,
        };
        currentStyle.height = {
          value: item.height,
          unit: unit.PX,
        };
        item.__layout({
          x: x2,
          y: y2,
          w: w2,
          h: h2,
        });
        currentStyle.display = display;
      }
      // right或bottom布局完成后还要偏移回来
      if(onlyRight && onlyBottom) {
        item.__offsetX(-item.outerWidth, true);
        item.__offsetY(-item.outerHeight, true);
      }
      else if(onlyRight) {
        item.__offsetX(-item.outerWidth, true);
      }
      else if(onlyBottom) {
        item.__offsetY(-item.outerHeight, true);
      }
    });
    // 递归进行，遇到absolute/relative的设置新容器
    children.forEach(item => {
      if(item instanceof Dom) {
        item.__layoutAbs(['absolute', 'relative'].indexOf(item.computedStyle.position) > -1 ? item : container, data);
      }
      else if(item instanceof Component) {
        let sr = item.shadowRoot;
        if(sr instanceof Dom) {
          sr.__layoutAbs(sr, data);
        }
      }
    });
  }

  render(renderMode) {
    super.render(renderMode);
    let { isDestroyed, computedStyle: { display, visibility }, flowChildren, children } = this;
    if(isDestroyed || display === 'none' || visibility === 'hidden') {
      return;
    }
    // 先渲染过滤mask
    children.forEach(item => {
      if(item.isMask) {
        item.__renderAsMask(renderMode);
      }
    });
    // 先绘制static
    flowChildren.forEach(item => {
      if(item.isMask) {}
      else if(item instanceof Text || item.computedStyle.position === 'static') {
        item.__renderByMask(renderMode);
      }
    });
    // 再绘制relative和absolute
    children.forEach(item => {
      if(item.isMask) {}
      else if((item instanceof Xom || item instanceof Component) && ['relative', 'absolute'].indexOf(item.computedStyle.position) > -1) {
        item.__renderByMask(renderMode);
      }
    });
    if(renderMode === mode.SVG) {
      // 过滤掉mask
      let children = this.children.slice(0);
      children = children.filter(item => {
        return !item.isMask;
      });
      // 由于svg严格按照先后顺序渲染，没有z-index概念，需要排序将relative/absolute放后面
      sort(children, function(a, b) {
        if(b.computedStyle.position === 'static' && ['relative', 'absolute'].indexOf(a.computedStyle.position) > -1) {
          return true;
        }
      });
      this.__virtualDom = {
        ...super.virtualDom,
        type: 'dom',
        children: children.map(item => item.virtualDom),
      };
    }
  }

  __destroy() {
    super.__destroy();
    this.children.forEach(child => {
      child.__destroy();
    });
    this.children.splice(0);
    this.flowChildren.splice(0);
    this.absChildren.splice(0);
    this.lineGroups.splice(0);
  }

  get tagName() {
    return this.__tagName;
  }
  get children() {
    return this.__children;
  }
  get flowChildren() {
    return this.__flowChildren;
  }
  get absChildren() {
    return this.__absChildren;
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

  static isValid(s) {
    return TAG_NAME.hasOwnProperty(s);
  }
}

export default Dom;
