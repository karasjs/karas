import Node from './Node';
import Text from './Text';
import LineGroup from './LineGroup';
import Geom from '../geom/Geom';
import util from '../util';
import css from '../style/css';
import unit from '../style/unit';

const TAG_NAME = {
  'div': true,
  'span': true,
};
const INLINE = {
  'span': true,
};

class Dom extends Node {
  constructor(tagName, props, children) {
    super(props);
    this.__tagName = tagName;
    this.__children = children;
    this.__lineGroups = []; // 一行inline元素组成的LineGroup对象后的存放列表
  }

  /**
   * 1. 封装string为Text节点
   * 2. 打平children中的数组，变成一维
   * 3. 合并相连的Text节点
   * 4. 检测inline不能包含block
   * 5. 设置parent和prev/next和ctx
   */
  __traverse(ctx) {
    let list = [];
    this.__traverseChildren(this.children, list, ctx);
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
          throw new Error('inline can not contain block');
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
    });
    this.__children = list;
  }

  __traverseChildren(children, list, ctx) {
    if(Array.isArray(children)) {
      children.forEach(item => {
        this.__traverseChildren(item, list, ctx);
      });
    }
    else if(children instanceof Dom) {
      list.push(children);
      children.__traverse(ctx);
    }
    // 图形没有children
    else if(children instanceof Geom) {
      list.push(children);
    }
    // 排除掉空的文本
    else if(!util.isNil(children)) {
      list.push(new Text(children));
    }
  }

  // 合并设置style，包括继承和默认值，修改一些自动值和固定值，测量所有文字的宽度
  __initStyle() {
    let style = this.__style;
    // 仅支持flex/block/inline
    if(!style.display || ['flex', 'block', 'inline'].indexOf(style.display) === -1) {
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
      if(item instanceof Dom) {
        item.__initStyle();
      }
      else if(item instanceof Geom) {
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
  __tryLayInline(w) {
    let { children } = this;
    for(let i = 0; i < children.length; i++) {
      // 当放不下时直接返回，无需继续多余的尝试计算
      if(w < 0) {
        return w;
      }
      let item = children[i];
      if(item instanceof Dom || item instanceof Geom) {
        w = item.__tryLayInline(w);
      }
      else {
        w -= item.textWidth;
      }
    }
    return w;
  }

  // 设置y偏移值，递归包括children，此举在初步确定inline布局后设置元素vertical-align用
  __offsetY(diff) {
    this.__y += diff;
    this.children.forEach(item => {
      if(item) {
        item.__offsetY(diff);
      }
    });
  }

  __calAutoBasis(isDirectionRow, w, h, isRecursion) {
    let b = 0;
    let min = 0;
    let max = 0;
    let { children, style } = this;
    // 初始化以style的属性
    let {
      width,
      height,
      borderTopWidth,
      borderRightWidth,
      borderBottomWidth,
      borderLeftWidth,
    } = style;
    let main = isDirectionRow ? width : height;
    if(main.unit !== unit.AUTO) {
      b = max += main.value;
      // 递归时children的长度会影响flex元素的最小宽度
      if(isRecursion) {
        min = b;
      }
    }
    // 递归children取最大值
    children.forEach(item => {
      if(item instanceof Dom || item instanceof Geom) {
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
        item.__preLay({
          x: 0,
          y: 0,
          w,
          h,
        }, true);
        min = Math.max(min, item.height);
        max = Math.max(max, item.height);
      }
    });
    // border也得计算在内
    if(isDirectionRow) {
      let w = borderRightWidth.value + borderLeftWidth.value;
      b += w;
      max += w;
      min += w;
    }
    else {
      let h = borderTopWidth.value + borderBottomWidth.value;
      b += h;
      max += h;
      min += h;
    }
    return { b, min, max };
  }

  __preLay(data) {
    let { style } = this;
    if(style.display === 'block') {
      this.__preLayBlock(data);
    }
    else if(style.display === 'flex') {
      this.__preLayFlex(data);
    }
    else {
      this.__preLayInline(data);
    }
  }

  // 本身block布局时计算好所有子元素的基本位置
  __preLayBlock(data) {
    let { x, y, w, h } = data;
    this.__x = x;
    this.__y = y;
    this.__width = w;
    let { children, style } = this;
    let {
      width,
      height,
      borderTopWidth,
      borderRightWidth,
      borderBottomWidth,
      borderLeftWidth,
    } = style;
    // 除了auto外都是固定高度
    let fixedHeight;
    if(width && width.unit !== unit.AUTO) {
      switch(width.unit) {
        case unit.PX:
          w = width.value;
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
    // border影响x和y和尺寸
    x += borderLeftWidth.value;
    data.x = x;
    y += borderTopWidth.value;
    data.y = y;
    w -= borderLeftWidth.value + borderRightWidth.value;
    h -= borderTopWidth.value + borderBottomWidth.value;
    // 递归布局，将inline的节点组成lineGroup一行
    let lineGroup = new LineGroup(x, y);
    children.forEach(item => {
      if(item instanceof Dom) {
        if(item.style.display === 'inline') {
          // inline开头，不用考虑是否放得下直接放
          if(x === data.x) {
            lineGroup.add(item);
            item.__preLayInline({
              x,
              y,
              w,
              h,
            });
            x += item.outerWidth;
          }
          else {
            // 非开头先尝试是否放得下
            let fw = item.__tryLayInline(w - x);
            // 放得下继续
            if(fw >= 0) {
              item.__preLayInline({
                x,
                y,
                w,
              });
            }
            // 放不下处理之前的lineGroup，并重新开头
            else {
              this.lineGroups.push(lineGroup);
              lineGroup.verticalAlign();
              x = data.x;
              y += lineGroup.outerHeight;
              item.__preLayInline({
                x: data.x,
                y,
                w,
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
            this.lineGroups.push(lineGroup);
            lineGroup.verticalAlign();
            y += lineGroup.height;
            lineGroup = new LineGroup(data.x, y);
          }
          item.__preLay({
            x: data.x,
            y,
            w,
            h,
          });
          x = data.x;
          y += item.outerHeight;
        }
      }
      else if(item instanceof Geom) {
        // 图形也是block先处理之前可能的行
        if(lineGroup.size) {
          this.lineGroups.push(lineGroup);
          lineGroup.verticalAlign();
          y += lineGroup.height;
          lineGroup = new LineGroup(data.x, y);
        }
        item.__preLay({
          x: data.x,
          y,
          w,
        });
        x = data.x;
        y += item.outerHeight;
      }
      // 文字和inline类似
      else {
        // x开头，不用考虑是否放得下直接放
        if(x === data.x) {
          lineGroup.add(item);
          item.__preLay({
            x,
            y,
            w,
            h,
          });
          x += item.width;
        }
        else {
          // 非开头先尝试是否放得下
          let fw = item.__tryLayInline(w - x);
          // 放得下继续
          if(fw >= 0) {
            item.__preLay({
              x,
              y,
              w,
              h,
            });
          }
          // 放不下处理之前的lineGroup，并重新开头
          else {
            this.lineGroups.push(lineGroup);
            lineGroup.verticalAlign();
            x = data.x;
            y += lineGroup.height;
            item.__preLay({
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
      this.lineGroups.push(lineGroup);
      lineGroup.verticalAlign();
      y += lineGroup.height;
    }
    this.__width = w;
    this.__height = fixedHeight ? h : y - data.y;
  }

  // 弹性布局时的计算位置
  __preLayFlex(data) {
    let { x, y, w, h } = data;
    this.__x = x;
    this.__y = y;
    this.__width = w;
    let { children, style } = this;
    let {
      width,
      height,
      flexDirection,
      borderTopWidth,
      borderRightWidth,
      borderBottomWidth,
      borderLeftWidth,
    } = style;
    // 除了auto外都是固定高度
    let fixedHeight;
    if(width && width.unit !== unit.AUTO) {
      switch(width.unit) {
        case unit.PX:
          w = width.value;
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
    // border影响x和y和尺寸
    x += borderLeftWidth.value;
    data.x = x;
    y += borderTopWidth.value;
    data.y = y;
    w -= borderLeftWidth.value + borderRightWidth.value;
    h -= borderTopWidth.value + borderBottomWidth.value;
    let isDirectionRow = flexDirection === 'row';
    // column时height可能为auto，此时取消伸展，退化为类似block布局，但所有子元素强制block
    if(!isDirectionRow && !fixedHeight) {
      children.forEach(item => {
        if(item instanceof Dom || item instanceof Geom) {
          item.__preLayBlock({
            x,
            y,
            w,
            h,
          });
          y += item.outerHeight;
        }
        else {
          item.__preLay({
            x,
            y,
            w,
            h,
          });
          y += item.height;
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
    children.forEach(item => {
      if(item instanceof Dom || item instanceof Geom) {
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
          item.__preLay({
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
    // 不伸展且总长度不足时，父元素宽度缩短
    if(growSum === 0 && isDirectionRow && maxSum < w) {
      w = maxSum;
    }
    let maxCross = 0;
    // 判断是否超出，决定使用grow还是shrink
    let isOverflow = maxSum > (isDirectionRow ? w : h);
    children.forEach((item, i) => {
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
      if(item instanceof Dom || item instanceof Geom) {
        const { style, style: { display, flexDirection, width, height }} = item;
        if(isDirectionRow) {
          // row的flex的child如果是block，则等同于inline-block布局
          if(display === 'block') {
            style.display = 'inline';
          }
          // 横向flex的child如果是竖向flex，高度自动的话要等同于父flex的高度
          else if(display === 'flex' && flexDirection === 'column' && fixedHeight && height.unit === unit.AUTO) {
            height.value = h;
            height.unit = unit.PX;
          }
          item.__preLay({
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
          item.__preLay({
            x,
            y,
            w,
            h: main,
          });
        }
        // 重设因伸缩而导致的主轴长度
        if(isOverflow && shrink) {
          if(isDirectionRow) {
            item.__width = main;
          }
          else {
            item.__height = main;
          }
        }
        else if(!isOverflow && grow) {
          if(isDirectionRow) {
            item.__width = main;
          }
          else {
            item.__height = main;
          }
        }
      }
      else {
        item.__preLay({
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
        x = data.x;
        maxCross = Math.max(maxCross, item.outerWidth);
      }
    });
    if(isDirectionRow) {
      // 父元素固定高度，子元素可能超过，侧轴最大长度取固定高度
      if(fixedHeight) {
        maxCross = h;
      }
      y += maxCross;
    }
    // 所有短侧轴的children伸张侧轴长度至相同，超过的不动，固定宽高的也不动
    children.forEach(item => {
      let { style } = item;
      if(isDirectionRow) {
        if(item.style.height.unit === unit.AUTO) {
          item.__height = maxCross - style.borderTopWidth.value - style.borderBottomWidth.value;
        }
      }
      else {
        if(item.style.width.unit === unit.AUTO) {
          item.__width = maxCross - style.borderRightWidth.value - style.borderLeftWidth.value;
        }
      }
    });
    this.__width = w;
    this.__height = fixedHeight ? h : y - data.y;
  }

  // inline比较特殊，先简单顶部对其，后续还需根据vertical和lineHeight计算y偏移
  __preLayInline(data) {
    let { x, y, w, h } = data;
    this.__x = x;
    this.__y = y;
    let maxX = x;
    let { children, style } = this;
    let {
      width,
      height,
      borderTopWidth,
      borderRightWidth,
      borderBottomWidth,
      borderLeftWidth,
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
      }
    }
    if(height && height.unit !== unit.AUTO) {
      fixedHeight = true;
      switch(height.unit) {
        case unit.PX:
          h = height.value;
          break;
      }
    }
    // border影响x和y
    x += borderLeftWidth.value;
    data.x = x;
    y += borderTopWidth.value;
    data.y = y;
    w -= borderLeftWidth.value + borderRightWidth.value;
    h -= borderTopWidth.value + borderBottomWidth.value;
    // 递归布局，将inline的节点组成lineGroup一行
    let lineGroup = new LineGroup(x, y);
    children.forEach(item => {
      if(item instanceof Dom) {
        // inline开头，不用考虑是否放得下直接放
        if(x === data.x) {
          lineGroup.add(item);
          item.__preLayInline({
            x,
            y,
            w,
          });
          x += item.outerWidth;
          maxX = Math.max(maxX, x);
        }
        else {
          // 非开头先尝试是否放得下
          let fw = item.__tryLayInline(w - x);
          // 放得下继续
          if(fw >= 0) {
            item.__preLayInline({
              x,
              y,
              w,
            });
          }
          // 放不下处理之前的lineGroup，并重新开头
          else {
            this.lineGroups.push(lineGroup);
            lineGroup.verticalAlign();
            x = data.x;
            y += lineGroup.height;
            item.__preLayInline({
              x: data.x,
              y,
              w,
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
          item.__preLay({
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
          let fw = item.__tryLayInline(w - x);
          // 放得下继续
          if(fw >= 0) {
            item.__preLay({
              x,
              y,
              w,
              h,
            });
          }
          // 放不下处理之前的lineGroup，并重新开头
          else {
            this.lineGroups.push(lineGroup);
            lineGroup.verticalAlign();
            x = data.x;
            y += lineGroup.height;
            item.__preLay({
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
      this.lineGroups.push(lineGroup);
      lineGroup.verticalAlign();
      y += lineGroup.height;
    }
    // 元素的width不能超过父元素w
    this.__width = fixedWidth ? w : maxX - data.x;
    this.__height = fixedHeight ? h : y - data.y;
  }

  render() {
    let { ctx, style, children, x, y, width, height } = this;
    let {
      backgroundColor,
      borderTopWidth,
      borderTopColor,
      borderRightWidth,
      borderRightColor,
      borderBottomWidth,
      borderBottomColor,
      borderLeftWidth,
      borderLeftColor,
    } = style;
    if(backgroundColor) {
      ctx.beginPath();
      ctx.fillStyle = backgroundColor;
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.fill();
      ctx.closePath();
    }
    if(borderTopWidth.value) {
      ctx.beginPath();
      ctx.lineWidth = borderTopWidth.value;
      ctx.strokeStyle = borderTopColor;
      let y2 = y + borderTopWidth.value * 0.5;
      ctx.moveTo(x + borderLeftWidth.value, y2);
      ctx.lineTo(x + borderLeftWidth.value + width, y2);
      ctx.stroke();
      ctx.closePath();
    }
    if(borderRightWidth.value) {
      ctx.beginPath();
      ctx.lineWidth = borderRightWidth.value;
      ctx.strokeStyle = borderRightColor;
      let x2 = x + width + borderLeftWidth.value + borderRightWidth.value * 0.5;
      ctx.moveTo(x2, y);
      ctx.lineTo(x2, y + height + borderTopWidth.value + borderBottomWidth.value);
      ctx.stroke();
      ctx.closePath();
    }
    if(borderBottomWidth.value) {
      ctx.beginPath();
      ctx.lineWidth = borderBottomWidth.value;
      ctx.strokeStyle = borderBottomColor;
      let y2 = y + height + borderTopWidth.value + borderBottomWidth.value * 0.5;
      ctx.moveTo(x + borderLeftWidth.value, y2);
      ctx.lineTo(x + borderLeftWidth.value + width, y2);
      ctx.stroke();
      ctx.closePath();
    }
    if(borderLeftWidth.value) {
      ctx.beginPath();
      ctx.lineWidth = borderLeftWidth.value;
      ctx.strokeStyle = borderLeftColor;
      ctx.moveTo(x + borderLeftWidth.value * 0.5, y);
      ctx.lineTo(x + borderLeftWidth.value * 0.5, y + height + borderTopWidth.value + borderBottomWidth.value);
      ctx.stroke();
      ctx.closePath();
    }
    children.forEach(item => {
      if(item) {
        item.render();
      }
    });
  }

  get tagName() {
    return this.__tagName;
  }
  get children() {
    return this.__children;
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
  get outerWidth() {
    let { style: { borderLeftWidth, borderRightWidth } } = this;
    return this.width + borderLeftWidth.value + borderRightWidth.value;
  }
  get outerHeight() {
    let { style: { borderTopWidth, borderBottomWidth } } = this;
    return this.height + borderTopWidth.value + borderBottomWidth.value;
  }

  static isValid(s) {
    return TAG_NAME.hasOwnProperty(s);
  }
}

export default Dom;
