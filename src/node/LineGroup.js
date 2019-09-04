class LineGroup {
  constructor(x, y) {
    this.__list = [];
    this.__x = x;
    this.__y = y;
    this.__height = 0;
    this.__baseLine = 0;
  }

  add(item) {
    this.list.push(item);
  }

  __calBaseLine() {
    let baseLine = 0;
    this.list.forEach(item => {
      baseLine = Math.max(baseLine, item.baseLine);
    });
    return baseLine;
  }

  __calHeight() {
    let height = 0;
    this.list.forEach(item => {
      height = Math.max(height, item.height);
    });
    return height;
  }

  verticalAlign() {
    this.__height = this.__calHeight();
    this.__baseLine = this.__calBaseLine();
    // 仅当有2个和以上时才需要vertical对齐调整
    if(this.list.length > 1) {
      this.list.forEach(item => {
        if(item.baseLine !== this.baseLine) {
          item.__offsetY(this.baseLine - item.baseLine);
        }
      });
    }
  }

  get list() {
    return this.__list;
  }
  get x() {
    return this.__x;
  }
  get y() {
    return this.__y;
  }
  get height() {
    return this.__height;
  }
  get baseLine() {
    return this.__baseLine;
  }
  get size() {
    return this.__list.length;
  }
}

export default LineGroup;
