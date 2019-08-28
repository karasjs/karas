import Node from './Node';
import Text from './Text';
import LineGroup from './LineGroup';
import Geom from '../geom/Geom';
import util from '../util';
import reset from '../reset';
import font from '../font';
import css from '../css';
import unit from '../unit';

const TAG_NAME = {
  'div': true,
  'span': true,
};
const INLINE = {
  'span': true,
};

function getLineHeightByFontAndLineHeight(fontSize, lineHeight) {
  if(lineHeight <= 0) {
    return Math.ceil(fontSize * font.arial.lhr);
  }
  return Math.max(lineHeight, Math.ceil(fontSize * font.arial.car));
}

function getBaseLineByFont(fontSize) {
  return Math.ceil(fontSize * font.arial.blr);
}

class Dom extends Node {
  constructor(tagName, props, children) {
    super(props);
    this.__tagName = tagName;
    this.__children = children;
    this.__style = {}; // style被解析后的k-v形式
    this.__lineGroups = []; // 一行inline元素组成的LineGroup对象后的存放列表
  }

  /**
   * 1. 封装string为Text节点
   * 2. 打平children中的数组，变成一维
   * 3. 合并相连的Text节点
   * 4. 检测inline不能包含block
   * 5. 设置parent和prev/next和ctx
   */
  __traverse(ctx, dpr) {
    let list = [];
    this.__traverseChildren(this.children, list, ctx, dpr);
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
    if(this.style.display === 'inline-block') {
      for(let i = list.length - 1; i >= 0; i--) {
        let item = list[i];
        if(item instanceof Dom && item.style.display !== 'inline-block') {
          throw new Error('inline-block can not contain block');
        }
      }
    }
    let prev = null;
    list.forEach(item => {
      item.__ctx = ctx;
      item.__dpr = dpr;
      if(prev) {
        prev.__next = item;
      }
      item.__parent = this;
      item.__prev = prev;
    });
    this.__children = list;
  }
  __traverseChildren(children, list, ctx, dpr) {
    if(Array.isArray(children)) {
      children.forEach(item => {
        this.__traverseChildren(item, list, ctx, dpr);
      });
    }
    else if(children instanceof Dom) {
      list.push(children);
      children.__traverse(ctx, dpr);
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
  // 合并设置style，包括继承和默认值，修改一些自动值和固定值
  __initStyle() {
    let style = this.style;
    Object.assign(style, reset, this.props.style);
    // 仅支持flex/block/inline-block
    if(!style.display || ['flex', 'block', 'inline-block'].indexOf(style.display) === -1) {
      if(INLINE.hasOwnProperty(this.tagName)) {
        style.display = 'inline-block';
      }
      else {
        style.display = 'block';
      }
    }
    let parent = this.parent;
    if(parent) {
      let parentStyle = parent.style;
      // 继承父元素样式
      ['fontSize', 'lineHeight'].forEach(k => {
        if(!style.hasOwnProperty(k) && parentStyle.hasOwnProperty(k)) {
          style[k] = parentStyle[k];
        }
      });
      // flex的children不能为inline
      if(parentStyle.display === 'flex' && style.display === 'inline-block') {
        style.display = 'block';
      }
    }
    this.children.forEach(item => {
      if(item instanceof Dom) {
        item.__initStyle();
      }
      else if(item instanceof Geom) {
        item.__initStyle();
      }
    });
    // 防止小行高，仅支持lineHeight>=1的情况
    let { fontSize, lineHeight } = style;
    lineHeight = getLineHeightByFontAndLineHeight(fontSize, lineHeight);
    style.lineHeight = lineHeight;
    css.normalize(style);
  }
  // 给定父宽度情况下，尝试行内放下后的剩余宽度，可能为负数即放不下
  __tryLayInline(w) {
    let { children, ctx, style } = this;
    for(let i = 0; i < children.length; i++) {
      // 当放不下时直接返回，无需继续多余的尝试计算
      if(w < 0) {
        return w;
      }
      let item = children[i];
      if(item instanceof Dom) {
        w = item.__tryLayInline(w);
      }
      else {
        ctx.font = css.setFontStyle(style);
        w -= ctx.measureText(item.content).width;
      }
    }
    return w;
  }
  // 设置y偏移值，递归包括children，此举在初步确定inline布局后设置元素vertical-align用
  __offsetY(diff) {
    this.__y += diff;
    this.children.forEach(item => {
      if(item instanceof Dom) {
        item.__offsetY(diff);
      }
      else {
        item.__y += diff;
      }
    });
  }
  // 元素自动换行后的最大宽度
  __linefeedWidth(includeWidth) {
    let { children, ctx, style } = this;
    let w = 0;
    children.forEach(item => {
      if(item instanceof Dom) {
        w = Math.max(item.__linefeedWidth(true));
      }
      else {
        ctx.font = css.setFontStyle(style);
        if(style.wordBreak === 'break-all') {
          let tw = 0;
          let content = item.content;
          let len = content.length;
          for(let i = 0; i < len; i++) {
            tw = Math.max(tw, ctx.measureText(content.charAt(i)).width);
          }
          w = Math.max(w, tw);
        }
        else {
          w = Math.max(w, ctx.measureText(item.content).width);
        }
      }
    });
    // flexBox的子项不考虑width影响，但孙子项且父元素不是flex时考虑
    if(includeWidth && this.parent.style.display !== 'flex') {
      let width = style.width;
      switch(width.unit) {
        case unit.PX:
          w = Math.max(w, width.value);
          break;
        case unit.PERCENT:
          w = Math.max(w, width.value * 0.01 * this.parent.width);
          break;
      }
    }
    return Math.ceil(w);
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
    let { children, ctx, style } = this;
    let { width, height, lineHeight } = style;
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
        if(item.style.display === 'inline-block') {
          // inline开头，不用考虑是否放得下直接放
          if(x === data.x) {
            lineGroup.add(item);
            item.__preLayInline({
              x,
              y,
              w,
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
              lineGroup.calculate();
              lineGroup.adjust();
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
            lineGroup.calculate();
            lineGroup.adjust();
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
      }
      else if(item instanceof Geom) {
        // 图形也是block先处理之前可能的行
        if(lineGroup.size) {
          this.lineGroups.push(lineGroup);
          lineGroup.calculate();
          lineGroup.adjust();
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
        ctx.font = css.setFontStyle(style);
        let tw = ctx.measureText(item.content).width;
        // 超出一行时先处理之前的行组，然后另起一行开头
        if(x + tw > w && x > data.x) {
          this.lineGroups.push(lineGroup);
          lineGroup.calculate();
          lineGroup.adjust();
          y += lineGroup.height;
          x = data.x;
          lineGroup = new LineGroup(x, y);
        }
        // 超出一行处理word-break
        item.__x = x;
        item.__y = y;
        item.preLay();
        item.__width = tw;
        item.__height = lineHeight;
        item.__baseLine = getBaseLineByFont(style.fontSize);
        x += tw;
        lineGroup.add(item);
      }
    });
    // 结束后处理可能遗留的最后的lineGroup
    if(lineGroup.size) {
      this.lineGroups.push(lineGroup);
      lineGroup.calculate();
      lineGroup.adjust();
      y += lineGroup.height;
    } console.log(lineGroup);
    this.__width = w;
    this.__height = fixedHeight ? h : y - data.y;
  }
  // 弹性布局时的计算位置
  __preLayFlex(data) {
    let { x, y, w } = data;
    this.__x = x;
    this.__y = y;
    this.__width = w;
    let { children, ctx, style } = this;
    let grow = [];
    let lfw = [];
    children.forEach(item => {
      if(item instanceof Dom) {
        grow.push(item.style.flexGrow);
        let width = item.style.width;
        if(width.unit === unit.PERCENT) {
          lfw.push(width.value * w);
        }
        else if(width.unit === unit.PX) {
          lfw.push(width.value);
        }
        else {
          lfw.push(item.__linefeedWidth());
        }
      }
      else if(item instanceof Geom) {
        grow.push(item.style.flexGrow);
        let width = item.style.width;
        if(width.unit === unit.PERCENT) {
          lfw.push(width.value * w);
        }
        else if(width.unit === unit.PX) {
          lfw.push(width.value);
        }
        else {
          lfw.push(-1);
        }
      }
      else {
        grow.push(0);
        ctx.font = css.setFontStyle(style);
        if(style.wordBreak === 'break-all') {
          let tw = 0;
          let content = item.content;
          let len = content.length;
          for(let i = 0; i < len; i++) {
            tw = Math.max(tw, ctx.measureText(content.charAt(i)).width);
          }
          lfw.push(tw);
        }
        else {
          let tw = ctx.measureText(item.content).width;
          lfw.push(tw);
        }
      }
    });
    // 全部最小自适应宽度和
    let sum = 0;
    lfw.forEach(item => {
      sum += item;
    });
    // TODO: 和大于等于可用宽度时，grow属性无效
    if(sum >= w) {}
    else {
      let free = w;
      let total = 0;
      // 获取固定和弹性的子项
      let fixIndex = [];
      let flexIndex = [];
      grow.forEach((item, i) => {
        if(item === 0) {
          free -= lfw[i];
          fixIndex.push(i);
        }
        else {
          flexIndex.push(i);
          total += item;
        }
      });
      // 除首位各自向下取整计算占用宽度，首位使用差值剩余的宽度
      let per = free / total;
      let space = [];
      for(let i = 1; i < flexIndex.length; i++) {
        let n = Math.floor(per * grow[flexIndex[i]]);
        space.push(n);
        free -= n;
      }
      space.unshift(free);
      // 固定和弹性最终组成连续的占用宽度列表进行布局
      let count = 0;
      grow.forEach((item, i) => {
        let child = children[i];
        if(item === 0) {
          child.__preLay({
            x,
            y,
            w: lfw[i],
          });
          x += lfw[i];
        }
        else {
          child.__preLay({
            x,
            y,
            w: space[count],
          });
          x += space[count++];
        }
      });
    }
    let h = 0;
    children.forEach(item => {
      h = Math.max(h, item.height);
    });
    this.__height = h;
  }
  // inline比较特殊，先简单顶部对其，后续还需根据vertical和lineHeight计算y偏移
  __preLayInline(data) {
    let { x, y, w, h } = data;
    this.__x = x;
    this.__y = y;
    let maxX = x;
    let { children, ctx, style } = this;
    let { width, height, lineHeight } = style;
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
    let line = [];
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
            lineGroup.calculate();
            lineGroup.adjust();
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
      // inline里的其它可能只有文本
      else {
        ctx.font = css.setFontStyle(style);
        let tw = ctx.measureText(item.content).width;
        // inline开头
        if(x === data.x) {
          item.__x = x;
          item.__y = y;
          item.__width = tw;
          item.__height = lineHeight;
          item.__baseLine = getBaseLineByFont(style.fontSize);
          x += tw;
          maxX = Math.max(maxX, x);
          line.push(item);
          lineGroup.add(item);
        }
        else {
          if(x + tw > w) {
          }
          else {
            item.__x = x;
            item.__y = y;
            item.__width = tw;
            item.__height = lineHeight;
            item.__baseLine = getBaseLineByFont(style.fontSize);
            x += tw;
            maxX = Math.max(maxX, x);
            line.push(item);
            lineGroup.add(item);
          }
        }
      }
    });
    // 结束后处理可能遗留的最后的lineGroup，children为空时可能size为空
    if(lineGroup.size) {
      this.lineGroups.push(lineGroup);
      lineGroup.calculate();
      lineGroup.adjust();
      y += lineGroup.height;
    }
    // 元素的width不能超过父元素w
    this.__width = fixedWidth ? w : maxX - data.x;
    this.__height = fixedHeight ? h : y - data.y;
  }
  render() {
    let { ctx, style } = this;
    // 简化负边距、小行高、行内背景优先等逻辑
    this.children.forEach(item => {
      if(item instanceof Dom || item instanceof Geom) {
        item.render();
      }
      else {
        ctx.font = css.setFontStyle(style);
        ctx.fillText(item.content, item.x, item.y + item.baseLine);
      }
    });
  }

  get tagName() {
    return this.__tagName;
  }
  get children() {
    return this.__children;
  }
  get style() {
    return this.__style;
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
    return 0;
  }

  static isValid(s) {
    return TAG_NAME.hasOwnProperty(s);
  }
}

export default Dom;
