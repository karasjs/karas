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
    this.__style = {}; // style被解析后的k-v形式
    this.__baseLine = 0;
    this.__virtualDom = {};
    this.__host = null;
  }

  __offsetX(diff) {
    this.__ox += diff;
  }

  __offsetY(diff) {
    this.__oy += diff;
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
  get rx() {
    return this.x + this.ox;
  }
  get ry() {
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
    return this;
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
