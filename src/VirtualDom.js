import Group from './Group';
import reset from './reset';

const name = {
  'div': true,
  'span': true,
  'ul': true,
  'li': true,
  'a': true,
};
const inline = {
  'span': true,
  'a': true,
};

class VirtualDom extends Group {
  constructor(name, props, children) {
    super(props, children);
    this.__name = name;
    this.initStyle(name);
  }
  initStyle(name) {
    this.__style = Object.assign({}, reset);
    // 仅支持flex/block/inline-block
    if(!this.style.display || ['flex', 'block', 'inline-block'].indexOf(this.style.display) === -1) {
      if(inline.hasOwnProperty(name)) {
        this.style.display = 'inline-block';
      }
      else {
        this.style.display = 'block';
      }
    }
  }
  // __measureWidth(options) {
  //   if(this.style.display === 'block') {
  //     return options.parentWidth;
  //   }
  //   else if(this.style.width && this.style.overflow === 'hidden') {
  //     return this.style.width;
  //   }
  //   else {
  //     return this.__measureChildrenWidth(this.children);
  //   }
  // }
  // __measureChildrenWidth(children) {
  //   let w = 0;
  //   if(Array.isArray(children)) {
  //     children.forEach(item => {
  //       w += this.__measureChildrenWidth(item);
  //     });
  //   }
  //   else if(children instanceof VirtualDom) {
  //     w = children.__measureWidth();
  //   }
  //   else {
  //     let style = this.style;
  //     this.ctx.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize}px/${style.lineHeight}px ${style.fontFamily}`;
  //     w = this.ctx.measureText(children).width;
  //   }
  //   return Math.max(w, this.style.width || 0);
  // }
  render(options) {
    let { x, y } = options;
    this.__x = x;
    this.__y = y;
    this.__renderChildren(this.children);
    return {
      x,
      y,
      width: this.width,
      height: this.height,
    };
  }
  __renderChildren(children) {
    this.ctx.font = '30px Georgia';
    this.ctx.fillText(this.children[0], this.x, this.y + 30);
    let square = this.ctx.measureText(this.children[0]);
    this.__width = square.width;
    this.__height = 30;
  }

  get name() {
    return this.__name;
  }
  get x() {
    return this.__x;
  }
  get y() {
    return this.__y;
  }
  get width() {
    return this.__width;
  }
  get height() {
    return this.__height;
  }

  static isValid(s) {
    return name.hasOwnProperty(s);
  }
}

export default VirtualDom;
