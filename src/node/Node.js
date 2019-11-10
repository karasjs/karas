import unit from "../style/unit";

class Node {
  constructor() {
    this.__x = 0;
    this.__y = 0;
    this.__ox = 0; // relative/margin:auto/text-align等造成的偏移量
    this.__oy = 0;
    this.__width = 0;
    this.__height = 0;
    this.__prev = null;
    this.__next = null;
    this.__ctx = null; // canvas的context
    this.__defs = null; // svg的defs
    this.__parent = null;
    this.__computedStyle = {}; // 计算为绝对值的样式
    this.__baseLine = 0;
    this.__virtualDom = {};
    this.__host = null;
  }

  __offsetX(diff, isLayout) {
    if(isLayout) {
      this.__x += diff;
    }
    else {
      this.__ox += diff;
    }
  }

  __offsetY(diff, isLayout) {
    if(isLayout) {
      this.__y += diff;
    }
    else {
      this.__oy += diff;
    }
  }

  // 获取margin/padding的实际值
  __mp(currentStyle, computedStyle, w) {
    let {
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
      paddingTop,
      paddingRight,
      paddingBottom,
      paddingLeft,
    } = currentStyle;
    computedStyle.marginLeft = this.__mpWidth(marginLeft, w);
    computedStyle.marginTop = this.__mpWidth(marginTop, w);
    computedStyle.marginRight = this.__mpWidth(marginRight, w);
    computedStyle.marginBottom = this.__mpWidth(marginBottom, w);
    computedStyle.paddingLeft = this.__mpWidth(paddingLeft, w);
    computedStyle.paddingTop = this.__mpWidth(paddingTop, w);
    computedStyle.paddingRight = this.__mpWidth(paddingRight, w);
    computedStyle.paddingBottom = this.__mpWidth(paddingBottom, w);
  }

  __mpWidth(mp, w) {
    if(mp.unit === unit.PX) {
      return mp.value;
    }
    else if(mp.unit === unit.PERCENT) {
      return mp.value * w * 0.01;
    }
    return 0;
  }

  __destroy() {
    this.__isDestroyed = true;
    this.__prev = this.__next = this.__ctx = this.__defs = this.__parent = this.__host = null;
  }

  get x() {
    return this.__x;
  }
  get y() {
    return this.__y;
  }
  get ox() {
    return this.__ox;
  }
  get oy() {
    return this.__oy;
  }
  get sx() {
    return this.x + this.ox;
  }
  get sy() {
    return this.y + this.oy;
  }
  get width() {
    return this.__width;
  }
  get height() {
    return this.__height;
  }
  get outerWidth() {
    return this.__width;
  }
  get outerHeight() {
    return this.__height;
  }
  get prev() {
    return this.__prev;
  }
  get next() {
    return this.__next;
  }
  get parent() {
    return this.__parent;
  }
  // canvas/svg根节点
  get root() {
    if(this.host) {
      return this.host.root;
    }
    if(this.parent) {
      return this.parent.root;
    }
    if(this.tagName && {
      canvas: true,
      svg: true,
    }.hasOwnProperty(this.tagName)) {
      return this;
    }
  }
  // component根节点
  get host() {
    if(this.__host) {
      return this.__host;
    }
    if(this.parent) {
      return this.parent.host;
    }
  }
  get style() {
    return this.__style;
  }
  get computedStyle() {
    return this.__computedStyle;
  }
  get ctx() {
    return this.__ctx;
  }
  get defs() {
    return this.__defs;
  }
  get baseLine() {
    return this.__baseLine;
  }
  get virtualDom() {
    return this.__virtualDom;
  }
  get isDestroyed() {
    return this.__isDestroyed;
  }
}

export default Node;
