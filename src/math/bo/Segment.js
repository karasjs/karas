class Segment {
  constructor(coords, belong) {
    this.coords = coords;
    this.belong = belong; // 属于source多边形还是clip多边形，0和1区别
    this.calBbox();
    this.prev = null;
    this.next = null;
    this.above = [false, false];
    this.below = [false, false];
    this.leftIO = [false, false]; // 左侧内外性，长度固定2，下标为belong属于的source/clip，值0为外部1为内部
    this.rightIO = [false, false]; // 右侧内外性，同上
    this.isIntersectSelf = false; // 自相交后切割的线段标识，开始点为交点
    this.isIntersectTarget = false; // 和其它的相交标识
    this.target = []; // 相交线列表，一般只有1个
    this.isOverlapSelf = false; // 自重合
    this.isOverlapTarget = false; // 和其它的重合
    this.isVisited = false; // 扫描求交时用到
  }

  calBbox() {
    let coords = this.coords;
    if(coords.length === 2) {
      let a = coords[0], b = coords[1];
      let x1 = Math.min(a.x, b.x);
      let y1 = Math.min(a.y, b.y);
      let x2 = Math.max(a.x, b.x);
      let y2 = Math.max(a.y, b.y);
      this.bbox = [x1, y1, x2, y2];
    }
  }

  // 线段边逆序，除了坐标，左右内外性也会颠倒
  reverse() {
    this.coords.reverse();
    let { leftIO, rightIO } = this;
    let [t0, t1] = leftIO;
    leftIO[0] = rightIO[0];
    leftIO[1] = rightIO[1];
    rightIO[0] = t0;
    rightIO[1] = t1;
  }

  toString() {
    return this.coords.join(' ')
      + ' ' + this.belong
      + ' ' + this.above.map(i => i ? 1 : 0).join('')
      + '' + this.below.map(i => i ? 1 : 0).join('');
  }
}

export default Segment;
