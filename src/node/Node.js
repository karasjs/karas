class Node {
  constructor() {
    this.__x = 0;
    this.__y = 0;
    this.__width = 0;
    this.__height = 0;
    this.__baseline = 0;
    this.__verticalBaseline = 0;
    this.__prev = null;
    this.__next = null;
    this.__parent = null;
    this.__domParent = null;
    this.__root = null;
    this.__host = null;
    this.__hostRoot = null;
    this.__virtualDom = null;
    this.__bbox = null;
    this.__filterBbox = null;
    this.__isDestroyed = true;
    this.__cache = null;
    this.__cacheTarget = null;
    this.__wasmNode = null;
  }

  __structure(lv, j) {
    return this.__struct = {
      node: this,
      childIndex: j,
      lv,
    };
  }

  __offsetX(diff) {
    this.__x += diff;
  }

  __offsetY(diff) {
    this.__y += diff;
  }

  __destroy() {
    this.__isDestroyed = true;
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

  get domParent() {
    return this.__domParent;
  }

  // canvas/svg根节点
  get root() {
    return this.__root;
  }

  // component根节点
  get host() {
    return this.__host;
  }

  // 考虑高阶组件在内的component根节点
  get hostRoot() {
    return this.__hostRoot;
  }

  get baseline() {
    return this.__baseline;
  }

  get verticalBaseline() {
    return this.__verticalBaseline;
  }

  get virtualDom() {
    return this.__virtualDom;
  }

  get isDestroyed() {
    return this.__isDestroyed;
  }

  get isReplaced() {
    return false;
  }
}

export default Node;
