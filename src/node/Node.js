import enums from '../util/enums';

const {
  STRUCT_KEY: {
    STRUCT_NODE,
    STRUCT_INDEX,
    STRUCT_CHILD_INDEX,
    STRUCT_LV,
  },
  NODE_KEY: {
    NODE_IS_DESTROYED,
    NODE_STRUCT,
  },
} = enums;

class Node {
  constructor() {
    this.__x = 0;
    this.__y = 0;
    this.__ox = 0; // relative造成的偏移量
    this.__oy = 0;
    this.__width = 0;
    this.__height = 0;
    this.__baseLine = 0;
    this.__config = {};
    // 默认undefined
    // this.__prev = undefined;
    // this.__next = undefined;
    // this.__parent = undefined;
    // this.__domParent = undefined;
    // this.__root = undefined;
    // this.__host = undefined;
  }

  __structure(i, lv, j) {
    return this.__config[NODE_STRUCT] = {
      [STRUCT_NODE]: this,
      [STRUCT_INDEX]: i,
      [STRUCT_CHILD_INDEX]: j,
      [STRUCT_LV]: lv,
    };
  }

  __modifyStruct(root, offset = 0) {
    let struct = this.__config[NODE_STRUCT];
    return [struct, 0];
  }

  __offsetX(diff, isLayout) {
    if(isLayout) {
      this.__x += diff;
    }
    else {
      this.__ox += diff;
    }
    this.__sx += diff;
  }

  __offsetY(diff, isLayout) {
    if(isLayout) {
      this.__y += diff;
    }
    else {
      this.__oy += diff;
    }
    this.__sy += diff;
  }

  __destroy() {
    this.__config[NODE_IS_DESTROYED] = true;
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

  get baseLine() {
    return this.__baseLine;
  }

  get virtualDom() {
    return this.__virtualDom;
  }

  get isDestroyed() {
    return this.__config[NODE_IS_DESTROYED];
  }
}

export default Node;
