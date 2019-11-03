class LineGroup {
  constructor(x, y) {
    this.__list = [];
    this.__x = x;
    this.__y = y;
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

  verticalAlign() {
    let n = this.__baseLine = this.__calBaseLine();
    // 仅当有2个和以上时才需要vertical对齐调整
    if(this.list.length > 1) {
      this.list.forEach(item => {
        let m = item.baseLine;
        if(m !== n) {
          item.__offsetY(n - m);
        }
      });
    }
  }

  horizonAlign(diff) {
    this.list.forEach(item => {
      item.__offsetX(diff);
    });
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
  get width() {
    let width = 0;
    this.list.forEach(item => {
      width += item.width;
    });
    return width;
  }
  get height() {
    let height = 0;
    this.list.forEach(item => {
      height = Math.max(height, item.height);
    });
    return height;
  }
  get baseLine() {
    return this.__baseLine;
  }
  get size() {
    return this.__list.length;
  }
}

export default LineGroup;
