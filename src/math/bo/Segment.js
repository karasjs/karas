import bezier from '../bezier';

class Segment {
  constructor(coords, belong) {
    this.coords = coords;
    this.belong = belong; // 属于source多边形还是clip多边形，0和1区别
    this.calBbox();
    this.above = [false, false];
    this.below = [false, false];
    this.myFill = [false, false]; // 自己的上下内外性
    this.otherFill = [false, false]; // 对方的上下内外性
    this.isVisited = false; // 扫描求交时用到
    this.isDeleted = false; // 相交裁剪老的线段会被删除
  }

  calBbox() {
    let coords = this.coords, l = coords.length;
    if(l === 2) {
      let a = coords[0], b = coords[1];
      let x1 = Math.min(a.x, b.x);
      let y1 = Math.min(a.y, b.y);
      let x2 = Math.max(a.x, b.x);
      let y2 = Math.max(a.y, b.y);
      this.bbox = [x1, y1, x2, y2];
    }
    else {
      let arr = coords.map(item => [item.x, item.y]);
      this.bbox = bezier.bboxBezier(arr);
    }
  }

  // 线段边逆序
  reverse() {
    this.coords.reverse();
  }

  toString() {
    return this.coords.join(' ')
      + ' ' + this.belong
      + ' ' + this.myFill.map(i => i ? 1 : 0).join('')
      + this.otherFill.map(i => i ? 1 : 0).join('');
  }
}

export default Segment;
