import bezier from '../bezier';

class Segment {
  constructor(coords, belong) {
    // 截取过程中曲线可能分成很小一截的水平/垂直直线，这里去除一下
    if (coords.length > 2) {
      const first = coords[0];
      let equalX = true, equalY = true;
      for (let i = 1, len = coords.length; i < len; i++) {
        const item = coords[i];
        if (item.x !== first.x) {
          equalX = false;
        }
        if (item.y !== first.y) {
          equalY = false;
        }
        if (!equalX && !equalY) {
          break;
        }
      }
      if (equalX || equalY) {
        coords.splice(1, coords.length - 2);
      }
    }
    this.coords = coords;
    this.belong = belong; // 属于source多边形还是clip多边形，0和1区别
    this.calBbox();
    this.myFill = [false, false]; // 自己的上下内外性
    this.otherFill = [false, false]; // 对方的上下内外性
    this.myCoincide = 0; // 自己重合次数
    this.otherCoincide = 0; // 对方重合次数
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

  equal(o) {
    let ca = this.coords, cb = o.coords;
    if(ca.length !== cb.length) {
      return false;
    }
    for(let i = 0, len = ca.length; i < len; i++) {
      if(!ca[i].equal(cb[i])) {
        return false;
      }
    }
    return true;
  }

  toHash() {
    return this.coords.map(item => item.toString()).join(' ');
  }

  toString() {
    return this.toHash()
      + ' ' + this.belong
      + ' ' + this.myCoincide
      + '' + this.otherCoincide
      + ' ' + this.myFill.map(i => i ? 1 : 0).join('')
      + this.otherFill.map(i => i ? 1 : 0).join('');
  }
}

export default Segment;
