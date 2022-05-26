class Point {
  constructor(x, y) {
    if(Array.isArray(x)) {
      [x, y] = x;
    }
    this.x = x;
    this.y = y;
    this.selfCount = 0; // 作为自交点的次数
    this.selfI = false; // 作为自交点
    this.selfV = false; // 作为自交顶点即相交的点是顶点
  }

  toString() {
    return this.x + ',' + this.y;
  }
}

export default Point;
