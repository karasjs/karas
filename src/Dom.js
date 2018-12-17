import Element from './Element';
import Text from './Text';
import Geom from './Geom';
import util from './util';
import reset from './reset';
import font from './font';

const TAG_NAME = {
  'div': true,
  'span': true,
  'ul': true,
  'li': true,
  'a': true,
};
const INLINE = {
  'span': true,
  'a': true,
};

function getMaxHeight(line) {
  let mh = 0;
  line.forEach(item => {
    mh = Math.max(mh, item.height);
  });
  return mh;
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
          prev.s += item.s;
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
        this.__traverseChildren(item, list);
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
    Object.assign(this.__style, reset, this.props.style);
    let style = this.style;
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
      ['fontSize', 'lineHeight'].forEach(k => {
        if(!style.hasOwnProperty(k) && parentStyle.hasOwnProperty(k)) {
          style[k] = parentStyle[k];
        }
      });
    }
    this.children.forEach(item => {
      if(item instanceof Dom) {
        item.__initStyle();
      }
      else if(item instanceof Geom) {
        item.__initStyle();
      }
    });
  }
  // 递归遍历区分block块组，使得每组中要么是block要么是inline数组
  __groupDiv() {
    let list = [];
    let inLine = [];
    this.children.forEach(item => {
      if(item instanceof Dom) {
        item.__groupDiv();
        if(['block', 'flex'].indexOf(item.style.display) > -1) {
          if(inLine.length) {
            list.push(inLine);
            inLine = [];
          }
          list.push(item);
        }
        else {
          inLine.push(item);
        }
      }
      else if(item instanceof Geom) {
        list.push(item);
      }
      else {
        inLine.push(item);
      }
    });
    if(inLine.length) {
      list.push(inLine);
    }
    this.__div = list;
  }
  // 仅测量包含的文本宽度，可能为多个children存数组形式，递归Dom记特殊值-1
  __measureInlineWidth() {
    let list = [];
    let { children, ctx, style } = this;
    children.forEach(item => {
      if(item instanceof Dom) {
        item.__measureInlineWidth();
        list.push(-1);
      }
      else {
        ctx.font = util.setFontStyle(style);
        let w = ctx.measureText(item.s).width;
        list.push(w);
      }
    });
    this.__tw = list;
  }
  // 给定父宽度情况下，获取包括换行后的总高度
  __measureInlineHeight(w) {
    let h = 0;
    let lineHeight = this.style.lineHeight;
    if(lineHeight <= 0) {
      lineHeight = Math.ceil(this.style.fontSize * font.arial.car);
    }
    else {
      lineHeight = Math.max(lineHeight, this.style.fontSize * font.arial.car);
    }
    this.__tw.forEach((n, i) => {
      if(n === -1) {
        h += this.children[i].__measureInlineHeight(w);
      }
      else {
        h += lineHeight;
      }
    });
    this.__height = h;
    return h;
  }
  // 获取最大可能的宽度，即所有孩子同在一行
  __maxInlineWidth() {
    let w = 0;
    this.__tw.forEach((n, i) => {
      // 递归的inline元素
      if(n === -1) {
        n = this.children[i].__maxInlineWidth();
      }
      w += n;
    });
    return w;
  }
  // 计算好所有元素的基本位置，inline比较特殊，还需后续计算vertical对齐方式
  __preLay(data) {
    let { x, y, w, h } = data;
    this.__x = x;
    this.__y = y;
    let ii = 0; // 出现的inline元素索引
    let style = this.style;
    let list = [];
    this.__div.forEach(arr => {
      // 一组inline元素
      if(Array.isArray(arr)) {
        let group = [];
        let line = [];
        arr.forEach(item => {
          if(item instanceof Dom) {
            let mw = item.__maxInlineWidth();
            // 超过父元素宽度需换行，本身就是行头则忽略
            if(mw > w && x > data.x) {
              // if(line.length) {
              //   group.push(line);
              //   let mh = getMaxHeight(line);
              //   y += mh;
              //   line = [item];
              // }
            }
            item.__preLay({
              x,
              y,
              w,
              h,
            });
            line.push(item);
          }
          // 文本
          else {
            let mw = this.__tw[ii];
            if(mw > w && x > data.x) {
              // if(line.length) {
              //   group.push(line);
              //   let mh = getMaxHeight(line);
              //   y += mh;
              //   line = [item];
              // }
            }
            let h = util.getLimitLineHeight(style.lineHeight, style.fontSize);
            item.__x = x;
            item.__y = y;
            item.__height = h;
            line.push(item);
          }
          ii++;
        });
        if(line.length) {
          group.push(line);
          let mh = getMaxHeight(line);
          y += mh;
        }
        list.push(group);
      }
      // block元素
      else {
        arr.__preLay({
          x,
          y,
          w,
          h,
        });
        list.push(arr);
        x = data.x;
        y += arr.height;
      }
    });
    this.__group = list;
    this.__width = w;
    this.__height = y - data.y;
  }
  render() {
    let { __group, ctx, style } = this;
    // TODO: 先渲染block的bg，再渲染inline的bg，再顺序渲染其它
    __group.forEach(arr => {
      // inline-block
      if(Array.isArray(arr)) {
        arr.forEach(line => {
          let mh = getMaxHeight(line);
          line.forEach(item => {
            if(item instanceof Dom) {
              item.render();
            }
            else {
              ctx.font = util.setFontStyle(style);
              ctx.fillText(item.s, item.x, item.y + mh);
            }
          });
        });
      } else {
        arr.render();
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
