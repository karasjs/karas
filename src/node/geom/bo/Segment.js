class Segment {
  constructor(coords) {
    this.coords = coords;
    this.calBbox();
    this.prev = null;
    this.next = null;
    this.isSelfIntersection = false; // 自相交后切割的线段标识，开始点为交点
    this.isOtherIntersection = false; // 和其它的相交标识
    this.isSelfOverlap = false; // 自重合
    this.isVisited = false; // 扫描求交时用到
    this.count = 0; // 相交次数
  }

  calBbox() {
    let coords = this.coords;
    if(coords.length === 2) {
      // let a = coords[0], b = coords[1];
      // let x1 = Math.min(a[0], b[0]);
      // let y1 = Math.min(a[1], b[1]);
      // let x2 = Math.max(a[0], b[0]);
      // let y2 = Math.max(a[1], b[1]);
      // this.bbox = [x1, y1, x2, y2];
      let a = coords[0], b = coords[1];
      let x1 = Math.min(a.x, b.x);
      let y1 = Math.min(a.y, b.y);
      let x2 = Math.max(a.x, b.x);
      let y2 = Math.max(a.y, b.y);
      this.bbox = [x1, y1, x2, y2];
    }
  }
}

export default Segment;
