class Point {
  constructor(x, y) {
    if(Array.isArray(x)) {
      [x, y] = x;
    }
    this.x = x;
    this.y = y;
  }

  toString() {
    return this.x + ',' + this.y;
  }

  // 排序，要求a在b左，x相等a在b下，返回false，不符合则true
  static compare(a, b) {
    if(a.x > b.x) {
      return true;
    }
    return a.x === b.x && a.y > b.y;
  }
}

export default Point;
