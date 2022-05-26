import geom from '../../../math/geom';
import Point from './Point';
import Segment from './Segment';

class Polygon {
  constructor(vertices) {
    // 顶点数过少退化为直线忽略
    if(!vertices || vertices.length < 2) {
      return;
    }
    if(vertices.length === 2 && vertices[1].length <= 2) {
      return;
    }
    this.first = null;
    let last;
    let startPoint = new Point(vertices[0]);
    let hashY = {};
    for(let i = 1, len = vertices.length; i < len; i++) {
      let curr = vertices[i], l = curr.length;
      let endPoint = new Point(curr[l - 2], curr[l - 1]);
      let seg;
      if(l === 2) {
        seg = new Segment([
          startPoint,
          endPoint,
        ]);
      }
      else if(l === 4) {}
      else if(l === 6) {}
      // 终点是下条边的起点
      startPoint = endPoint;
      // 双链表，前后边链接
      if(!this.first) {
        this.first = seg;
      }
      if(last) {
        last.next = seg;
        seg.prev = last;
      }
      last = seg;
      // 根据y值存储在hash上方便后续排序，min/max各存一个，哪怕相等
      let bbox = seg.bbox, min = bbox[1], max = bbox[3];
      let list = hashY[min] = hashY[min] || [];
      list.push(seg);
      list = hashY[max] = hashY[max] || [];
      list.push(seg);
    }
    // 要求多边形闭合，首尾点坐标相同，默认要求如此，算法不增加数据弥补
    this.first.prev = last;
    last.next = this.first;
    this.selfIntersect(hashY);
  }

  // 根据y坐标排序，生成有序线段列表，再扫描求交
  selfIntersect(hashY) {
    let list = [];
    Object.keys(hashY).forEach(y => list.push({
      y,
      arr: hashY[y],
    }));
    // 从上到下扫描，按所有点y坐标顺序，边会进入和离开扫描线各1次，在扫描线中的边为活跃边，维护1个活跃边列表，新添加的和老的求交
    let asl = [], delList = [];
    while(list.length) {
      // 先检查上次要删除的
      if(delList.length) {
        delList.forEach(seg => {
          let i = asl.indexOf(seg);
          asl.splice(i, 1);
          seg.isVisited = false; // 还原以备后面逻辑重复利用
        });
        delList.splice(0);
      }
      let { y, arr } = list.shift();
      while(arr.length) {
        let seg = arr.shift(), bboxA = seg.bbox;
        // 第2次访问边一定是离开，考虑删除，可能是水平线不能立刻删除所以等到下次删除，因为水平线会和同y的水平线的重合
        if(seg.isVisited) {
          if(bboxA[1] !== bboxA[3]) {
            let i = asl.indexOf(seg);
            asl.splice(i, 1);
            seg.isVisited = false; // 还原以备后面逻辑重复利用
          }
          else {
            delList.push(seg);
          }
        }
        // 第1次访问边一定是进入，求交
        else {
          // 和asl里的边求交，如果被分割，老的线段无需再进入asl
          let keep = true;
          if(asl.length) {
            let coordsA = seg.coords, lenA = coordsA.length;
            let { x: ax1, y: ay1 } = coordsA[0];
            let { x: ax2, y: ay2 } = coordsA[1];
            asl.forEach(item => {
              let bboxB = item.bbox;
              if(geom.isRectsOverlap(bboxA, bboxB)) {
                let coordsB = item.coords, lenB = coordsB.length;
                let { x: bx1, y: by1 } = coordsB[0];
                let { x: bx2, y: by2 } = coordsB[1];
                // a是直线
                if(lenA === 2) {
                  // b是直线
                  if(lenB === 2) {
                    let res = getIntersectionLineLine(ax1, ay1, ax2, ay2, bx1, by1, bx2, by2);
                    if(res) {
                      let point = new Point(res);
                      point.selfI = true;
                      let ra = sliceSegment(seg, [point]);
                      dealNewSeg(list, asl, delList, y, ra);
                      let rb = sliceSegment(item, [point]);
                      dealNewSeg(list, asl, delList, y, rb);
                      keep = false;
                    }
                  }
                }
              }
            });
          }
          // 不相交切割才进入asl
          if(keep) {
            asl.push(seg);
            seg.isVisited = true;
          }
        }
      }
    }
    // 最下面的线未被删除，也未被还原visited
    delList.forEach(item => item.isVisited = false);
  }

  joinSegment() {
    let first = this.first, curr = first;
    let list = [];
    do {
      let coords = curr.coords.map(item => {
        return item.x + ',' + item.y;
      });
      list.push(coords.join('; '));
      curr = curr.next;
    }
    while(curr !== first);
    return list;
  }

  // 2个非自交的多边形互相判断相交，依旧是扫描线算法，2个多边形统一y排序，但要分别出属于哪个多边形，因为只和对方测试相交
  static intersect2(polyA, polyB) {
    let hashY = {};
    let firstA = polyA.first, firstB = polyB.first;
    sortY(hashY, firstA, 0);
    sortY(hashY, firstB, 1);
    let list = [];
    Object.keys(hashY).forEach(y => list.push({
      y,
      arr: hashY[y],
    }));
    // 和selfIntersect类似
    let asl = [], delList = [];
    while(list.length) {
      // 先检查上次要删除的
      if(delList.length) {
        delList.forEach(seg => {
          let i = asl.indexOf(seg);
          asl.splice(i, 1);
          seg.isVisited = false; // 还原以备后面逻辑重复利用
        });
        delList.splice(0);
      }
      let { y, arr } = list.shift();
      while(arr.length) {
        let seg = arr.shift();
        let index = seg.index, bboxA = seg.bbox;
        if(seg.isVisited) {
          if(bboxA[1] !== bboxA[3]) {
            let i = asl.indexOf(seg);
            asl.splice(i, 1);
            seg.isVisited = false; // 还原以备后面逻辑重复利用
          }
          else {
            delList.push(seg);
          }
        }
        else {
          let keep = true;
          if(asl.length) {
            let coordsA = seg.coords, lenA = coordsA.length;
            let { x: ax1, y: ay1 } = coordsA[0];
            let { x: ax2, y: ay2 } = coordsA[1];
            asl.forEach(item => {
              if(item.index !== index) {
                let bboxB = item.bbox;
                if(geom.isRectsOverlap(bboxA, bboxB)) {
                  let coordsB = item.coords, lenB = coordsB.length;
                  let { x: bx1, y: by1 } = coordsB[0];
                  let { x: bx2, y: by2 } = coordsB[1];
                  // a是直线
                  if(lenA === 2) {
                    // b是直线
                    if(lenB === 2) {
                      let res = getIntersectionLineLine(ax1, ay1, ax2, ay2, bx1, by1, bx2, by2);
                      // if(res) {
                      //   let point = new Point(res);
                      //   point.selfI = true;
                      //   let ra = sliceSegment(seg, [point]);
                      //   dealNewSeg(list, asl, delList, y, ra);
                      //   let rb = sliceSegment(item, [point]);
                      //   dealNewSeg(list, asl, delList, y, rb);
                      //   keep = false;
                      // }
                    }
                  }
                }
              }
            });
          }
          if(keep) {
            asl.push(seg);
            seg.isVisited = true;
          }
        }
      }
    }
  }
}

function getIntersectionLineLine(ax1, ay1, ax2, ay2, bx1, by1, bx2, by2) {
  let d = (by2 - by1) * (ax2 - ax1) - (bx2 - bx1) * (ay2 - ay1);
  // 平行看是否重合 TODO
  if(d === 0) {
    return;
  }
  let toSource = (
    (bx2 - bx1) * (ay1 - by1) - (by2 - by1) * (ax1 - bx1)
  ) / d;
  let toClip = (
    (ax2 - ax1) * (ay1 - by1) - (ay2 - ay1) * (ax1 - bx1)
  ) / d;
  // 非顶点相交才是真相交
  if(toSource > 0 && toSource < 1 && toClip > 0 && toClip < 1) {
    let ox = ax1 + toSource * (ax2 - ax1);
    let oy = ay1 + toSource * (ay2 - ay1);
    return [ox, oy];
  }
}

// 给定交点列表分割线段，ps需排好顺序从头到尾
function sliceSegment(seg, ps) {
  let res = [];
  let coords = seg.coords, len = coords.length;
  let startPoint = coords[0];
  let prev = seg.prev;
  // 多个点可能截取多条，最后一条保留只修改数据，其它新生成
  ps.forEach((point, index) => {
    if(len === 2) {
      let ns = new Segment([
        startPoint,
        point,
      ]);
      prev.next = ns;
      ns.prev = prev;
      prev = ns;
    }
    else if(len === 3) {}
    else if(len === 4) {}
    startPoint = point;
    // 除了第一条线，后续都是相交线，因为第一条开始点不是交点，有顺序需求
    if(index) {
      prev.isSelfIntersection = true;
    }
    res.push(prev);
  });
  // 最后一条
  if(len === 2) {
    coords[0] = startPoint;
    seg.calBbox();
  }
  else if(len === 3) {}
  else if(len === 4) {}
  prev.next = seg;
  seg.prev = prev;
  seg.isSelfIntersection = true;
  res.push(seg);
  return res;
}

// 相交的线段slice成多条后，老的删除，新的考虑添加进扫描列表和活动边列表，或者新的不在范围内
function dealNewSeg(list, asl, delList, y, ns) {
  ns.forEach(seg => {
    let bbox = seg.bbox, y1 = bbox[1], y2 = bbox[3];
    // 活跃y之前无相交判断意义
    if(y2 < y) {
      return;
    }
    // 按顺序放在list的正确位置等待进入活跃边
    if(y1 > y) {
      let i = 0;
      for(let len = list.length; i < len; i++) {
        let item = list[i];
        let ly = item.y;
        if(y1 === ly) {
          item.arr.push(seg);
          break;
        }
        if(y1 > ly) {
          list[i - 1].arr.push(seg);
          break;
        }
      }
      for(let len = list.length; i < len; i++) {
        let item = list[i];
        let ly = item.y;
        if(y2 === ly) {
          item.arr.push(seg);
          break;
        }
        if(y2 > ly) {
          list[i - 1].arr.push(seg);
          break;
        }
      }
      return;
    }
    // 剩下的情况就是和当前活动y一致的水平直线
    asl.push(seg);
    delList.push(seg);
  });
}

// 和自相交类似，但2个多边形需分开，index分别用0和1
function sortY(hashY, first, index) {
  let curr = first;
  do {
    curr.index = index;
    let bbox = curr.bbox, min = bbox[1], max = bbox[3];
    let list = hashY[min] = hashY[min] || [];
    list.push(curr);
    list = hashY[max] = hashY[max] || [];
    list.push(curr);
    curr = curr.next;
  }
  while(curr !== first);
}

export default Polygon;
