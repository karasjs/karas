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
}

export default Point;
