class Point {
  constructor(x, y) {
    if(Array.isArray(x)) {
      [x, y] = x;
    }
    this.x = x;
    this.y = y;
    this.selfI = 0; // 作为自交点
    this.selfV = 0; // 作为自交顶点，即相交的点是顶点
    this.targetI = 0; // 它交点
    this.targetV = 0; // 它交顶点
  }

  toString() {
    return this.x + ',' + this.y;
  }

  toString2() {
    return this.x + ',' + this.y
      + ' ' + this.selfI
      + '' + this.selfV
      + '' + this.targetI
      + '' + this.targetV;
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
