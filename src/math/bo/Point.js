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

  equal(o) {
    return this === o || this.x === o.x && this.y === o.y;
  }

  // 排序，要求a在b左即x更小，x相等a在b下，符合返回false，不符合则true
  static compare(a, b) {
    if(a.x > b.x) {
      return true;
    }
    return a.x === b.x && a.y > b.y;
  }
}

export default Point;
