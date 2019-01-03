import Element from './Element';
import Text from './Text';
import Geom from './geom/Geom';
import util from './util';
import reset from './reset';
import font from './font';
import css from './css';
import unit from './unit';

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

class Dom extends Element {
  constructor(tagName, props, children) {
    super(props);
    this.__tagName = tagName;
    this.__children = children;
    this.__style = {}; // style被解析后的k-v形式
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
          prev.textContent += item.textContent;
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
  // 合并设置style，包括继承和默认值
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
    css.regularized(style);
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
        w -= ctx.measureText(item.textContent).width;
      }
    }
    return w;
  }
  // 处理已布置好x的line组，并返回line高
  __preLayLine(line, options) {
    let { w, lineHeight } = options;
    let lh = lineHeight;
    let baseLine = 0;
    line.forEach(item => {
      lh = Math.max(lh, item.height);
      baseLine = Math.max(baseLine, item.baseLine);
    });
    // 设置此inline的baseLine，可能多次执行，最后一次设置为最后一行line的baseLine
    this.__baseLine = baseLine;
    line.forEach(item => {
      let diff = baseLine - item.baseLine;
      if(item instanceof Dom) {
        item.__offsetY(diff);
      }
      else {
        item.__y += diff;
      }
    });
    return lh;
  }
  // 设置y偏移值，递归包括children，此举在初步确定inline布局后设置元素vertical-align:baseline对齐用
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
          let textContent = item.textContent;
          let len = textContent.length;
          for(let i = 0; i < len; i++) {
            tw = Math.max(tw, ctx.measureText(textContent.charAt(i)).width);
          }
          w = Math.max(w, tw);
        }
        else {
          w = Math.max(w, ctx.measureText(item.textContent).width);
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
    let { x, y, w } = data;
    this.__x = x;
    this.__y = y;
    this.__width = w;
    let { children, ctx, style } = this;
    let { lineHeight } = style;
    let line = [];
    children.forEach(item => {
      if(item instanceof Dom) {
        if(style.display === 'inline-block') {
          // inline开头
          if(x === data.x) {
            item.__preLayInline({
              x,
              y,
              w,
            });
            line.push(item);
            x += item.width;
          }
          else {
            // 非开头先尝试是否放得下
            let fw = item.__tryLayInline(w - x);
            if(fw >= 0) {
              item.__preLayInline({
                x,
                y,
                w,
              });
              line.push(item);
              x += item.width;
            }
            else {
              // 放不下处理之前的行，并重新开头
              let lh = this.__preLayLine(line, {
                w,
                lineHeight,
              });
              x = data.x;
              y += lh;
              item.__preLayInline({
                x,
                y,
                w,
              });
              line = [item];
            }
          }
        }
        else {
          // block先处理之前可能的行
          if(line.length) {
            let lh = this.__preLayLine(line, {
              w,
              lineHeight,
            });
            x = data.x;
            y += lh;
            line = [];
          }
          item.__preLay({
            x,
            y,
            w,
          });
          y += item.height;
        }
      }
      else if(item instanceof Geom) {
        // 图形也是block先处理之前可能的行
        if(line.length) {
          let lh = this.__preLayLine(line, {
            w,
            lineHeight,
          });
          y += lh;
        }
        item.__preLay({
          x,
          y,
          w,
        });
        y += item.height;
      }
      else {
        ctx.font = css.setFontStyle(style);
        let tw = ctx.measureText(item.textContent).width;
        if(x + tw > w) {
        }
        else {
          item.__x = x;
          item.__y = y;
          item.__width = tw;
          item.__height = lineHeight;
          item.__baseLine = getBaseLineByFont(style.fontSize);
          x += tw;
          line.push(item);
        }
      }
    });
    // 结束后处理可能遗留的最后的行
    if(line.length) {
      let lh = this.__preLayLine(line, {
        w,
        lineHeight,
      });
      y += lh;
    }
    this.__height = y - data.y;
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
          let textContent = item.textContent;
          let len = textContent.length;
          for(let i = 0; i < len; i++) {
            tw = Math.max(tw, ctx.measureText(textContent.charAt(i)).width);
          }
          lfw.push(tw);
        }
        else {
          let tw = ctx.measureText(item.textContent).width;
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
  // inline比较特殊，先简单顶部对其，还需后续计算y偏移
  __preLayInline(data) {
    let { x, y, w } = data;
    this.__x = x;
    this.__y = y;
    let mx = x;
    let { children, ctx, style } = this;
    let { lineHeight } = style;
    let line = [];
    children.forEach(item => {
      if(item instanceof Dom) {
        // inline开头
        if(x === data.x) {
          item.__preLayInline({
            x,
            y,
            w,
          });
          line.push(item);
          x += item.width;
        }
        else {
          // 非开头先尝试是否放得下
          let fw = item.__tryLayInline(w - x);
          if(fw >= 0) {
            item.__preLayInline({
              x,
              y,
              w,
            });
            line.push(item);
            x += item.width;
          }
          else {
            // 放不下处理之前的行，并重新开头
            let lh = this.__preLayLine(line, {
              w,
              lineHeight,
            });
            x = data.x;
            y += lh;
            item.__preLayInline({
              x,
              y,
              w,
            });
            line = [item];
          }
        }
      }
      else {
        ctx.font = css.setFontStyle(style);
        let tw = ctx.measureText(item.textContent).width;
        if(x + tw > w) {
        }
        else {
          item.__x = x;
          item.__y = y;
          item.__width = tw;
          item.__height = lineHeight;
          item.__baseLine = getBaseLineByFont(style.fontSize);
          x += tw;
          mx = Math.max(mx, x);
          line.push(item);
        }
      }
    });
    // 结束后处理可能遗留的最后的行
    if(line.length) {
      let lh = this.__preLayLine(line, {
        w,
        lineHeight,
      });
      y += lh;
    }
    this.__width = mx - data.x;
    this.__height = y - data.y;
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
        ctx.fillText(item.textContent, item.x, item.y + item.baseLine);
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

  static isValid(s) {
    return TAG_NAME.hasOwnProperty(s);
  }
}

export default Dom;
