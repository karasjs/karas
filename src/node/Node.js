class Node {
  constructor() {
    this.__x = 0;
    this.__y = 0;
    this.__width = 0;
    this.__height = 0;
    this.__prev = null;
    this.__next = null;
    this.__ctx = null; // canvas的context
    this.__parent = null;
    this.__style = {}; // style被解析后的k-v形式
    this.__baseLine = 0;
  }

  __offsetX(diff) {
    this.__x += diff;
  }

  __offsetY(diff) {
    this.__y += diff;
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
  get style() {
    return this.__style;
  }
  get ctx() {
    return this.__ctx;
  }
  get baseLine() {
    return this.__baseLine;
  }
}

export default Node;
