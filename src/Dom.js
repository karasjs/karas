import Element from './Element';
import Text from './Text';
import util from './util';
import reset from './reset';

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

class Dom extends Element {
  constructor(name, props, children) {
    super(props);
    this.__children = children;
    this.__div = [];
    this.__row = [];
    this.__style = {};
    this.__initStyle(name, this.props.style);
  }
  __initStyle(name, style) {
    this.__style = Object.assign({}, reset, style);
    // 仅支持flex/block/inline-block
    if(!this.style.display || ['flex', 'block', 'inline-block'].indexOf(this.style.display) === -1) {
      if(INLINE.hasOwnProperty(name)) {
        this.style.display = 'inline-block';
      }
      else {
        this.style.display = 'block';
      }
    }
  }
  // 封装string为text节点，同时打平children中的数组，使得children只是一维列表
  __traverse() {
    let list = [];
    this.__traverseChildren(this.children, list);
    this.__children = list;
  }
  __traverseChildren(children, list) {
    if(Array.isArray(children)) {
      children.forEach(item => {
        this.__traverseChildren(item, list);
      });
    }
    else if(children instanceof Element) {
      list.push(children);
      children.__traverse();
    }
    // 排除掉空的文本
    else if(!util.isNil(children)) {
      list.push(new Text(children));
    }
  }
  // 递归遍历区分block块组，使得每组中要么是block要么是inline数组，同时设置父子兄弟关系和ctx
  __groupDiv(ctx) {
    let prev = null;
    let list = [];
    let inLine = [];
    this.children.forEach(item => {
      item.__ctx = ctx;
      if(item instanceof Dom) {
        item.__groupDiv(ctx);
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
      else {
        inLine.push(item);
      }
      if(prev) {
        prev.__next = item;
      }
      item.__prev = prev;
      prev = item;
    });
    if(inLine.length) {
      list.push(inLine);
    }
    this.__div = list;
  }
  // 递归测量inline位置，进行换行及多行文本操作，使得分行后每行有若干个inline元素
  __groupRow(options) {
    let list = [];
    this.div.forEach(arr => {
      if(Array.isArray(arr)) {
        let div = [];
        let row = [];
        let free = options.w;
        arr.forEach(item => {
          let iw = 0;
          if(item instanceof Text) {
            let { fontStyle, fontWeight, fontSize, fontFamily } = this.style;
            this.ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px/${fontSize}px ${fontFamily}`;
            iw = this.ctx.measureText(item.s).width;
          }
          else {
            iw = item.__measureInlineWidth();
          }
          if(iw > free) {
            if(row.length) {
              div.push(row);
            }
            row = [item];
            free = options.w;
          }
          else {
            row.push(item);
            free -= iw;
          }
        });
        if(row.length) {
          div.push(row);
        }
        list.push(div);
      }
      else {
        list.push(arr);
      }
    });
    this.__row = list;
  }
  __measureInlineWidth() {
    if(this.style.width && this.style.overflow === 'hidden') {
      return this.style.width;
    }
    else {
      let w = 0;
      let __childrenInlineWidth = [];
      this.children.forEach(item => {
        if(item instanceof Text) {
          let { fontStyle, fontWeight, fontSize, fontFamily } = this.style;
          this.ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px/${fontSize}px ${fontFamily}`;
          let iw = this.ctx.measureText(item.s).width;
          __childrenInlineWidth.push(iw);
          w += iw;
        }
        else {
          let iw = item.__measureInlineWidth();
          __childrenInlineWidth.push(iw);
          w += iw;
        }
      });
      return w;
    }
  }
  render() {

  }

  get div() {
    return this.__div;
  }
  get row() {
    return this.__row;
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
