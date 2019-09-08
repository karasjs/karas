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
    let style = this.__style = this.props.style || {};
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

  // 获取节点的最大和最小宽度
  __calMaxAndMinWidth() {
    let { children } = this;
    let max = 0;
    let min = 0;
    children.forEach(item => {
      let { max: a, min: b } = item.__calMaxAndMinWidth();
      max = Math.max(max, a);
      min = Math.max(min, b);
    });
    return { max, min };
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
    let { width, height } = style;
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
      }
    }
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
            x += item.width;
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
            x += item.width;
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
          y += item.height;
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
        y += item.height;
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
    let { children, ctx, style } = this;
    let { width, height } = style;
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
      }
    }
    let growList = [];
    let shrinkList = [];
    let basisList = [];
    let widthList = [];
    let maxList = [];
    let minList = [];
    let maxWidth = 0;
    let minWidth = 0;
    let growSum = 0;
    let shrinkSum = 0;
    children.forEach(item => {
      let { max, min } = item.__calMaxAndMinWidth();
      maxList.push(max);
      minList.push(min);
      if(item instanceof Dom || item instanceof Geom) {
        let { flexGrow, flexShrink, flexBasis, width } = item.style;
        growList.push(flexGrow);
        shrinkList.push(flexShrink);
        basisList.push(flexBasis);
        growSum += flexGrow;
        shrinkSum += flexShrink;
        if(width.unit === unit.AUTO) {
          widthList.push('auto');
        }
        else if(width.unit === unit.PERCENT) {
          widthList.push(width.value * w);
        }
        else if(width.unit === unit.PX) {
          widthList.push(width.value);
        }
        // 根据basis不同，最大和最小计算方式不同
        if(flexBasis.unit === unit.AUTO) {
          if(width.unit === unit.AUTO) {
            maxWidth += max;
            minWidth += min;
          }
          else {
            maxWidth += widthList[widthList.length - 1];
            minWidth += widthList[widthList.length - 1];
          }
        }
        else if([unit.PERCENT, unit.PX].indexOf(flexBasis.unit) > -1) {
          maxWidth += max;
          minWidth += min;
        }
      }
      else {
        growList.push(0);
        shrinkList.push(1);
        basisList.push({
          unit: unit.AUTO,
        });
        shrinkSum += 1;
        widthList.push('auto');
        maxWidth += max;
        minWidth += min;
      }
    });
    console.log(w, maxWidth, minWidth, growList, shrinkList, basisList, widthList, minList, maxList, growSum, shrinkSum);
    // 均不扩展和收缩
    if(growSum === 0 && shrinkSum === 0) {
      let maxHeight = 0;
      // 从左到右依次排列布局，等同inline-block
      children.forEach(item => {
        if(item instanceof Dom || item instanceof Geom) {
          item.__preLayInline({
            x,
            y,
            w,
            h,
          });
          x += item.width;
        }
        else {
          item.__preLay({
            x,
            y,
            w,
            h,
          });
          x += item.width;
        }
        maxHeight = Math.max(maxHeight, item.height);
      });
      // 所有孩子高度相同
      children.forEach(item => {
        item.__height = maxHeight;
      });
      y += maxHeight;
    }
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
    let { width, height } = style;
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
          x += item.width;
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
          x += item.width;
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
    const { ctx, style, children } = this;
    if (style.backgroundColor) {
      ctx.beginPath();
      ctx.fillStyle = style.backgroundColor;
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.fill();
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

  static isValid(s) {
    return TAG_NAME.hasOwnProperty(s);
  }
}

export default Dom;
