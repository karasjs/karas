import bezier from '../bezier';

class Segment {
  constructor(coords, belong
              // , isReversed
  ) {
    this.coords = coords;
    this.belong = belong; // 属于source多边形还是clip多边形，0和1区别
    this.calBbox();
    this.above = [false, false];
    this.below = [false, false];
    // this.isReversed = isReversed; // 是否首尾翻转过，因为要保持左下点开始，某些线段会反过来，记录之
    this.isVisited = false; // 扫描求交时用到
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

  // 线段边逆序，除了坐标，上下内外性也会颠倒
  reverse() {
    this.coords.reverse();
    // this.isReversed = !this.isReversed;
    let { above, below } = this;
    let [t0, t1] = above;
    above[0] = below[0];
    above[1] = below[1];
    below[0] = t0;
    below[1] = t1;
  }

  toString() {
    return this.coords.join(' ')
      + ' ' + this.belong
      // + ',' + (this.isReversed ? 1 : 0)
      + ' ' + this.above.map(i => i ? 1 : 0).join('')
      + '' + this.below.map(i => i ? 1 : 0).join('');
  }
}

export default Segment;
