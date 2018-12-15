import Dom from './Dom';
import Text from './Text';
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

class VirtualDom extends Dom {
  constructor(name, props, children) {
    super(props, children);
    this.__name = name;
    this.__initStyle(name, this.props.style);
  }
  __initStyle(name, style) {
    this.__style = Object.assign({}, reset, style);
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
