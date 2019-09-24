import Xom from './Xom';
import Text from './Text';
import LineGroup from './LineGroup';
import Geom from '../geom/Geom';
import util from '../util';
import css from '../style/css';
import unit from '../style/unit';
import mode from '../mode';

const TAG_NAME = {
  'div': true,
  'span': true,
};
const INLINE = {
  'span': true,
};

class Dom extends Xom {
  constructor(tagName, props, children) {
    super(tagName, props);
    this.__children = children;
    this.__flowChildren = []; // 非绝对定位孩子
    this.__absChildren = []; // 绝对定位孩子
    this.__lineGroups = []; // 一行inline元素组成的LineGroup对象后的存放列表
    this.__flowY = 0; // 文档流布局结束后的y坐标，供absolute布局默认位置使用
  }

  /**
   * 1. 封装string为Text节点
   * 2. 打平children中的数组，变成一维
   * 3. 合并相连的Text节点
   * 4. 检测inline不能包含block和flex
   * 5. 设置parent和prev/next和ctx和mode
   */
  __traverse(ctx, renderMode) {
    let list = [];
    this.__traverseChildren(this.children, list, ctx, renderMode);
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
    if(this.style.display === 'inline' && this.parent.style.display !== 'flex') {
      for(let i = list.length - 1; i >= 0; i--) {
        let item = list[i];
        if(item instanceof Dom && item.style.display !== 'inline') {
          throw new Error('inline can not contain block/flex');
        }
      }
    }
    let prev = null;
    list.forEach(item => {
      item.__ctx = ctx;
      if(prev) {
        prev.__next = item;
      }
      item.__parent = this;
      item.__prev = prev;
      if(item instanceof Text || item.style.position !== 'absolute') {
        this.__flowChildren.push(item);
      }
      else {
        this.__absChildren.push(item);
      }
    });
    this.__children = list;
  }

  __traverseChildren(children, list, ctx, renderMode) {
    if(Array.isArray(children)) {
      children.forEach(item => {
        this.__traverseChildren(item, list, ctx, renderMode);
      });
    }
    else if(children instanceof Dom) {
      list.push(children);
      children.__traverse(ctx, renderMode);
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
  __initStyle() {
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
    // 继承父元素样式
    let parent = this.parent;
    if(parent) {
      let parentStyle = parent.style;
      ['fontSize', 'fontWeight', 'fontStyle', 'lineHeight', 'wordBreak', 'color', 'textAlign'].forEach(k => {
        if(!style.hasOwnProperty(k) && parentStyle.hasOwnProperty(k)) {
          style[k] = parentStyle[k];
        }
      });
    }
    // 标准化处理，默认值、简写属性
    css.normalize(style);
    this.children.forEach(item => {
      if(item instanceof Xom) {
        item.__initStyle();
      }
      else {
        item.__style = style;
        // 文字首先测量所有字符宽度
        item.__measure();
      }
    });
  }

  // 给定父宽度情况下，尝试行内放下后的剩余宽度，为负数即放不下
  __tryLayInline(w, total) {
    let { flowChildren, style: { width } } = this;
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

  // 设置y偏移值，递归包括children，此举在flex行元素的child进行justify-content对齐用
  __offsetX(diff) {
    super.__offsetX(diff);
    this.flowChildren.forEach(item => {
      if(item) {
        item.__offsetX(diff);
      }
    });
  }

  // 设置y偏移值，递归包括children，此举在初步确定inline布局后设置元素vertical-align用
  __offsetY(diff) {
    super.__offsetY(diff);
    this.flowChildren.forEach(item => {
      if(item) {
        item.__offsetY(diff);
      }
    });
  }

  __calAutoBasis(isDirectionRow, w, h, isRecursion) {
    let b = 0;
    let min = 0;
    let max = 0;
    let { mtw, mrw, mbw, mlw, ptw, prw, pbw, plw, flowChildren, style } = this;
    // 计算需考虑style的属性
    let {
      width,
      height,
      borderTopWidth,
      borderRightWidth,
      borderBottomWidth,
      borderLeftWidth,
    } = style;
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
      if(item instanceof Xom) {
        let { b: b2, min: min2, max: max2 } = item.__calAutoBasis(isDirectionRow, w, h, true);
        b = Math.max(b, b2);
        min = Math.max(min, min2);
        max = Math.max(max, max2);
      }
      else if(isDirectionRow) {
        min = Math.max(item.charWidth, min);
        max = Math.max(item.textWidth, max);
      }
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
    // margin/padding/border也得计算在内
    if(isDirectionRow) {
      let w = borderRightWidth.value + borderLeftWidth.value + mlw + mrw + plw + prw;
      b += w;
      max += w;
      min += w;
    }
    else {
      let h = borderTopWidth.value + borderBottomWidth.value + mtw + mbw + ptw + pbw;
      b += h;
      max += h;
      min += h;
    }
    return { b, min, max };
  }

  __calAbs(isDirectionRow) {
    let max = 0;
    let { mtw, mrw, mbw, mlw, ptw, prw, pbw, plw, flowChildren, style } = this;
    // 计算需考虑style的属性
    let {
      width,
      height,
      borderTopWidth,
      borderRightWidth,
      borderBottomWidth,
      borderLeftWidth,
    } = style;
    let main = isDirectionRow ? width : height;
    if(main.unit === unit.PX) {
      max = main.value;
    }
    // 递归children取最大值
    flowChildren.forEach(item => {
      if(item instanceof Xom) {
        let max2 = item.__calAbs(isDirectionRow);
        max = Math.max(max, max2);
      }
      else if(isDirectionRow) {
        max = Math.max(item.textWidth, max);
      }
      else {
        item.__layout({
          x: 0,
          y: 0,
          w: Infinity,
          h: Infinity,
        }, true);
        max = Math.max(max, item.height);
      }
    });
    // margin/padding/border也得计算在内
    if(isDirectionRow) {
      let w = borderRightWidth.value + borderLeftWidth.value + mlw + mrw + plw + prw;
      max += w;
    }
    else {
      let h = borderTopWidth.value + borderBottomWidth.value + mtw + mbw + ptw + pbw;
      max += h;
    }
    return max;
  }

  // 本身block布局时计算好所有子元素的基本位置
  __layoutBlock(data) {
    let { x, y, w, h } = data;
    this.__x = x;
    this.__y = y;
    this.__width = w;
    let { flowChildren, style, lineGroups, mlw, mtw, mrw, mbw, plw, ptw, prw, pbw } = this;
    let {
      width,
      height,
      borderTopWidth,
      borderRightWidth,
      borderBottomWidth,
      borderLeftWidth,
      textAlign,
    } = style;
    // 除了auto外都是固定高度
    let fixedHeight;
    if(width && width.unit !== unit.AUTO) {
      switch(width.unit) {
        case unit.PX:
          w = width.value;
          break;
        case unit.PERCENT:
          w *= width.value * 0.01;
          break;
      }
    }
    if(height && height.unit !== unit.AUTO) {
      fixedHeight = true;
      switch(height.unit) {
        case unit.PX:
          h = height.value;
          break;
        case unit.PERCENT:
          h *= height.value * 0.01;
          break;
      }
    }
    // margin/padding/border影响x和y和尺寸
    x += borderLeftWidth.value + mlw + plw;
    data.x = x;
    y += borderTopWidth.value + mtw + ptw;
    data.y = y;
    if(width.unit === unit.AUTO) {
      w -= borderLeftWidth.value + borderRightWidth.value + mlw + mrw + plw + prw;
    }
    if(height.unit === unit.AUTO) {
      h -= borderTopWidth.value + borderBottomWidth.value + mtw + mbw + ptw + pbw;
    }
    // 递归布局，将inline的节点组成lineGroup一行
    let lineGroup = new LineGroup(x, y);
    flowChildren.forEach(item => {
      if(item instanceof Xom) {
        if(item.style.display === 'inline') {
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
    // text-align
    if(['center', 'right'].indexOf(textAlign) > -1) {
      lineGroups.forEach(lineGroup => {
        let diff = w - lineGroup.width;
        if(diff > 0) {
          lineGroup.horizonAlign(textAlign === 'center' ? diff * 0.5 : diff);
        }
      });
    }
    this.__width = w;
    this.__height = fixedHeight ? h : y - data.y;
    this.__flowY = y;
  }

  // 弹性布局时的计算位置
  __layoutFlex(data) {
    let { x, y, w, h } = data;
    this.__x = x;
    this.__y = y;
    this.__width = w;
    let { flowChildren, style, mlw, mtw, mrw, mbw, plw, ptw, prw, pbw } = this;
    let {
      width,
      height,
      flexDirection,
      borderTopWidth,
      borderRightWidth,
      borderBottomWidth,
      borderLeftWidth,
      justifyContent,
      alignItems,
    } = style;
    // 除了auto外都是固定高度
    let fixedWidth;
    let fixedHeight;
    if(width && width.unit !== unit.AUTO) {
      fixedWidth = true;
      switch(width.unit) {
        case unit.PX:
          w = width.value;
          break;
        case unit.PERCENT:
          w *= width.value * 0.01;
          break;
      }
    }
    if(height && height.unit !== unit.AUTO) {
      fixedHeight = true;
      switch(height.unit) {
        case unit.PX:
          h = height.value;
          break;
        case unit.PERCENT:
          h *= height.value * 0.01;
          break;
      }
    }
    // margin/padding/border影响x和y和尺寸
    x += borderLeftWidth.value + mlw + plw;
    data.x = x;
    y += borderTopWidth.value + mtw + ptw;
    data.y = y;
    if(width.unit === unit.AUTO) {
      w -= borderLeftWidth.value + borderRightWidth.value + mlw + mrw + plw + prw;
    }
    if(height.unit === unit.AUTO) {
      h -= borderTopWidth.value + borderBottomWidth.value + mtw + mbw + ptw + pbw;
    }
    let isDirectionRow = flexDirection === 'row';
    // column时height可能为auto，此时取消伸展，退化为类似block布局，但所有子元素强制block
    if(!isDirectionRow && !fixedHeight) {
      flowChildren.forEach(item => {
        if(item instanceof Xom) {
          const { style, style: { display, flexDirection, width }} = item;
          // column的flex的child如果是inline，变为block
          if(display === 'inline') {
            style.display = 'block';
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
            h,
          });
          y += item.outerHeight;
        }
        else {
          item.__layout({
            x,
            y,
            w,
            h,
          });
          y += item.outerHeight;
        }
      });
      this.__width = w;
      this.__height = y - data.y;
      return;
    }
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
      if(item instanceof Xom) {
        let { flexGrow, flexShrink, flexBasis } = item.style;
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
          b = flexBasis.value;
          basisList.push(b);
          basisSum += b;
        }
        else if(flexBasis.unit === unit.PERCENT) {
          b = (isDirectionRow ? w : h) * flexBasis.value;
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
      if(item instanceof Xom) {
        const { style, mlw, mtw, mrw, mbw, plw, ptw, prw, pbw, style: {
          display,
          flexDirection,
          width,
          height,
          borderTopWidth,
          borderRightWidth,
          borderBottomWidth,
          borderLeftWidth,
        }} = item;
        if(isDirectionRow) {
          // row的flex的child如果是inline，变为block
          if(display === 'inline') {
            style.display = 'block';
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
          })
        }
        else {
          // column的flex的child如果是inline，变为block
          if(display === 'inline') {
            style.display = 'block';
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
        if(isOverflow && shrink) {
          if(isDirectionRow) {
            item.__width = main - mlw - mrw - plw - prw - borderLeftWidth.value - borderRightWidth.value;
          }
          else {
            item.__height = main - mtw - mbw - ptw - pbw - borderTopWidth.value - borderBottomWidth.value;
          }
        }
        else if(!isOverflow && grow) {
          if(isDirectionRow) {
            item.__width = main - mlw - mrw - plw - prw - borderLeftWidth.value - borderRightWidth.value;
          }
          else {
            item.__height = main - mtw - mbw - ptw - pbw - borderTopWidth.value - borderBottomWidth.value;
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
          isDirectionRow ? child.__offsetX(diff) : child.__offsetY(diff);
        }
      }
      else if(justifyContent === 'center') {
        let center = diff * 0.5;
        for(let i = 0; i < len; i++) {
          let child = flowChildren[i];
          isDirectionRow ? child.__offsetX(center) : child.__offsetY(center);
        }
      }
      else if(justifyContent === 'space-between') {
        let between = diff / (len - 1);
        for(let i = 1; i < len; i++) {
          let child = flowChildren[i];
          isDirectionRow ? child.__offsetX(between * i) : child.__offsetY(between * i);
        }
      }
      else if(justifyContent === 'space-around') {
        let around = diff / (len + 1);
        for(let i = 0; i < len; i++) {
          let child = flowChildren[i];
          isDirectionRow ? child.__offsetX(around * (i + 1)) : child.__offsetY(around * (i + 1));
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
        let { style, mlw, mtw, mrw, mbw, ptw, prw, plw, pbw } = item;
        if(isDirectionRow) {
          if(style.height.unit === unit.AUTO) {
            item.__height = maxCross - mtw - mbw - ptw - pbw
              - style.borderTopWidth.value
              - style.borderBottomWidth.value;
          }
        }
        else {
          if(style.width.unit === unit.AUTO) {
            item.__width = maxCross - mlw - mrw - plw - prw
              - borderRightWidth.value
              - borderLeftWidth.value;
          }
        }
      });
    }
    else if(alignItems === 'center') {
      flowChildren.forEach(item => {
        let diff = maxCross - item.outerHeight;
        if(diff > 0) {
          item.__offsetY(diff * 0.5);
        }
      });
    }
    else if(alignItems === 'flex-end') {
      flowChildren.forEach(item => {
        let diff = maxCross - item.outerHeight;
        if(diff > 0) {
          item.__offsetY(diff);
        }
      });
    }
    this.__width = w;
    this.__height = fixedHeight ? h : y - data.y;
    this.__flowY = y;
  }

  // inline比较特殊，先简单顶部对其，后续还需根据vertical和lineHeight计算y偏移
  __layoutInline(data) {
    let { x, y, w, h } = data;
    this.__x = x;
    this.__y = y;
    let maxX = x;
    let { flowChildren, style, lineGroups, mlw, mtw, mrw, mbw, plw, ptw, prw, pbw } = this;
    let {
      width,
      height,
      borderTopWidth,
      borderRightWidth,
      borderBottomWidth,
      borderLeftWidth,
      textAlign,
    } = style;
    // 除了auto外都是固定高度
    let fixedWidth;
    let fixedHeight;
    if(width && width.unit !== unit.AUTO) {
      fixedWidth = true;
      switch(width.unit) {
        case unit.PX:
          w = width.value;
          break;
        case unit.PERCENT:
          w *= width.value * 0.01;
          break;
      }
    }
    if(height && height.unit !== unit.AUTO) {
      fixedHeight = true;
      switch(height.unit) {
        case unit.PX:
          h = height.value;
          break;
        case unit.PERCENT:
          h *= height.value * 0.01;
          break;
      }
    }
    // margin/padding/border影响x和y和尺寸
    x += borderLeftWidth.value + mlw + plw;
    data.x = x;
    y += borderTopWidth.value + mtw + ptw;
    data.y = y;
    if(width.unit === unit.AUTO) {
      w -= borderLeftWidth.value + borderRightWidth.value + mlw + mrw + plw + prw;
    }
    if(height.unit === unit.AUTO) {
      h -= borderTopWidth.value + borderBottomWidth.value + mtw + mbw + ptw + pbw;
    }
    // 递归布局，将inline的节点组成lineGroup一行
    let lineGroup = new LineGroup(x, y);
    flowChildren.forEach(item => {
      if(item instanceof Xom) {
        // 绝对定位跳过
        if(item.style.position === 'absolute') {
          this.absChildren.push(item);
          return;
        }
        item.style.display = 'inline';
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
    // text-align
    if(['center', 'right'].indexOf(textAlign) > -1) {
      lineGroups.forEach(lineGroup => {
        let diff = w - lineGroup.width;
        if(diff > 0) {
          lineGroup.horizonAlign(textAlign === 'center' ? diff * 0.5 : diff);
        }
      });
    }
    // 元素的width不能超过父元素w
    this.__width = fixedWidth ? w : maxX - data.x;
    this.__height = fixedHeight ? h : y - data.y;
    this.__flowY = y;
  }

  // 只针对绝对定位children布局
  __layoutAbs(container) {
    let { x, y, flowY, width, height, children, absChildren, style, mlw, mtw, mrw, mbw, plw, ptw, prw, pbw } = this;
    let {
      borderTopWidth,
      borderLeftWidth,
    } = style;
    let pw = width + plw + prw;
    let ph = height + ptw + pbw;
    // 递归进行，遇到absolute/relative的设置新容器
    children.forEach(item => {
      if(item instanceof Dom) {
        item.__layoutAbs(['absolute', 'relative'].indexOf(item.style.position) > -1 ? item : container);
      }
    });
    // 对absolute的元素进行相对容器布局
    absChildren.forEach(item => {
      let { mtw, mlw, style, style: {
        left, top, right, bottom, width: width2, height: height2
      } } = item;
      let x2, y2, w2, h2;
      // width优先级高于right高于left，即最高left+right，其次left+width，再次right+width，然后仅申明单个，最次全部auto
      if(left.unit !== unit.AUTO && right.unit !== unit.AUTO) {
        x2 = left.unit === unit.PX ? x + mlw + borderLeftWidth.value + left.value : x + mlw + borderLeftWidth.value + width * left.value * 0.01;
        w2 = right.unit === unit.PX ? x + mlw + borderLeftWidth.value + pw - right.value - x2 : x + mlw + borderLeftWidth.value + pw - width * right.value * 0.01 - x2;
      }
      else if(left.unit !== unit.AUTO && width2.unit !== unit.AUTO) {
        x2 = left.unit === unit.PX ? x + mlw + borderLeftWidth.value + left.value : x + mlw + borderLeftWidth.value + width * left.value * 0.01;
        w2 = width2.unit === unit.PX ? width2.value : width;
      }
      else if(right.unit !== unit.AUTO && width2.unit !== unit.AUTO) {
        w2 = width2.unit === unit.PX ? width2.value : width;
        let widthPx = width2.unit === unit.PX ? width2.value : width * width2.value * 0.01;
        x2 = right.unit === unit.PX ? x + mlw + borderLeftWidth.value + pw - right.value - widthPx : x + mlw + borderLeftWidth.value + pw - width * right.value * 0.01 - widthPx;
      }
      else if(left.unit !== unit.AUTO) {
        x2 = left.unit === unit.PX ? x + left.value : x + mlw + borderLeftWidth.value + width * left.value * 0.01;
        w2 = item.__calAbs(true);
      }
      else if(right.unit !== unit.AUTO) {
        w2 = item.__calAbs(true);
        x2 = right.unit === unit.PX ? x + mlw + borderLeftWidth.value + pw - right.value - w2 : x + mlw + borderLeftWidth.value + pw - width * right.value * 0.01 - w2;
      }
      else if(width2.unit !== unit.AUTO) {
        x2 = x + mlw + borderLeftWidth.value;
        w2 = width2.unit === unit.PX ? width2.value : width;
      }
      else {
        x2 = x + mlw + borderLeftWidth.value;
        w2 = item.__calAbs(true);
      }
      // top/bottom/height优先级同上
      if(top.unit !== unit.AUTO && bottom.unit !== unit.AUTO) {
        y2 = top.unit === unit.PX ? y + top.value : y + mtw + borderTopWidth.value + height * top.value * 0.01;
        h2 = bottom.unit === unit.PX ? y + mtw + borderTopWidth.value + ph - bottom.value - y2 : y + mtw + borderTopWidth.value + ph - height * bottom.value * 0.01 - y2;
        style.height = {
          value: h2,
          unit: unit.PX,
        };
      }
      else if(top.unit !== unit.AUTO && height2.unit !== unit.AUTO) {
        y2 = top.unit === unit.PX ? y + top.value : y + mtw + borderTopWidth.value + height * top.value * 0.01;
        h2 = height2.unit === unit.PX ? height2.value : height;
      }
      else if(bottom.unit !== unit.AUTO && height2.unit !== unit.AUTO) {
        h2 = height2.unit === unit.PX ? height2.value : height;
        let heightPx = height2.unit === unit.PX ? height2.value : height * height2.value * 0.01;
        y2 = bottom.unit === unit.PX ? y + mtw + borderTopWidth.value + ph - bottom.value - heightPx : y + mtw + borderTopWidth.value + ph - height * bottom.value * 0.01 - heightPx;
      }
      else if(top.unit !== unit.AUTO) {
        y2 = top.unit === unit.PX ? y + top.value : y + mtw + borderTopWidth.value + height * top.value * 0.01;
        h2 = item.__calAbs();
      }
      else if(bottom.unit !== unit.AUTO) {
        h2 = item.__calAbs();
        y2 = bottom.unit === unit.PX ? y + mtw + borderTopWidth.value + ph - bottom.value - h2 : y + mtw + borderTopWidth.value + ph - height * bottom.value * 0.01 - h2;
      }
      else if(height2.unit !== unit.AUTO) {
        y2 = flowY + mtw + borderTopWidth.value;
        h2 = height2.unit === unit.PX ? height2.value : height;
      }
      else {
        y2 = flowY + mtw + borderTopWidth.value;
        h2 = item.__calAbs();
      }
      // absolute时inline强制block
      if(style.display === 'inline') {
        style.display = 'block';
      }
      item.__layout({
        x: x2,
        y: y2,
        w: w2,
        h: h2,
      });
    });
  }

  __emitEvent(e, force) {
    let { event: { type }, x, y, covers } = e;
    let { listener, children, style, rx, ry, outerWidth, outerHeight } = this;
    if(style.display === 'none') {
      return;
    }
    let cb;
    if(listener.hasOwnProperty(type)) {
      cb = listener[type];
    }
    let hasChildEmit;
    // 先响应absolute/relative高优先级
    for(let i = children.length - 1; i >= 0; i--) {
      let child = children[i];
      if(child instanceof Xom && ['absolute', 'relative'].indexOf(child.style.position) > -1) {
        if(child.__emitEvent(e, force)) {
          hasChildEmit = true;
        }
      }
    }
    // 再看普通流
    for(let i = children.length - 1; i >= 0; i--) {
      let child = children[i];
      if(child instanceof Xom && ['absolute', 'relative'].indexOf(child.style.position) === -1) {
        if(child.__emitEvent(e, force)) {
          hasChildEmit = true;
        }
      }
    }
    if(force) {
      cb && cb(e);
      return;
    }
    // child触发则parent一定触发
    if(hasChildEmit) {
      covers.push({
        x,
        y,
        w: outerWidth,
        h: outerHeight,
      });
      cb && cb(e);
    }
    // 否则判断坐标是否位于自己内部，以及没被遮挡
    else if(x >= rx && y >= ry && x <= rx + outerWidth && y <= ry + outerHeight) {
      for(let i = 0, len = covers.length; i < len; i++) {
        let { x: x2, y: y2, w, h: h } = covers[i];
        if(x >= x2 && y >= y2 && x <= x2 + w && y <= y2 + h) {
          return;
        }
      }
      if(!e.target) {
        e.target = this;
      }
      covers.push({
        x,
        y,
        w: outerWidth,
        h: outerHeight,
      });
      cb && cb(e);
    }
  }

  render(renderMode) {
    super.render(renderMode);
    let { style, flowChildren, children } = this;
    let {
      display,
      position,
      top,
      right,
      bottom,
      left,
      height: h,
    } = style;
    if(display === 'none') {
      return;
    }
    // 先绘制static
    flowChildren.forEach(item => {
      if(item instanceof Text || item.style.position === 'static') {
        item.render(renderMode);
      }
    });
    // 再绘制relative和absolute
    children.forEach(item => {
      if((item instanceof Xom) && ['relative', 'absolute'].indexOf(item.style.position) > -1) {
        item.render(renderMode);
      }
    });
    if(renderMode === mode.SVG) {
      this.__virtualDom = {
        ...super.virtualDom,
        type: 'dom',
        children: this.children.map(item => item.virtualDom),
      };
    }
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
  get flowY() {
    return this.__flowY;
  }

  static isValid(s) {
    return TAG_NAME.hasOwnProperty(s);
  }
}

export default Dom;
