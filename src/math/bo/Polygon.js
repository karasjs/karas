import geom from '../geom';
import Point from './Point';
import Segment from './Segment';

class Polygon {
  constructor(regions, index) {
    this.index = index; // 属于source多边形还是clip多边形，0和1区别
    this.segments = [];
    // 多边形有>=1个区域，一般是1个
    if(!Array.isArray(regions)) {
      return;
    }
    let hashX = {};
    regions.forEach(vertices => {
      // 每个区域有>=2条线段，组成封闭区域，1条肯定不行，2条必须是曲线
      if(!Array.isArray(vertices) || vertices.length < 2) {
        return;
      }
      if(vertices.length === 2 && vertices[1].length <= 2) {
        return;
      }
      let startPoint = new Point(vertices[0]), firstPoint = startPoint;
      // 根据多边形有向边，生成线段，不保持原有向，统一左下作为线段起点
      for(let i = 1, len = vertices.length; i < len; i++) {
        let curr = vertices[i], l = curr.length;
        // 闭合区域，首尾顶点重复统一
        let endPoint = (i === len - 1) ? firstPoint : new Point(curr[l - 2], curr[l - 1]);
        let seg;
        if(l === 2) {
          if(Point.compare(startPoint, endPoint)) {
            seg = new Segment([
              endPoint,
              startPoint,
            ], index);
          }
          else {
            seg = new Segment([
              startPoint,
              endPoint,
            ], index);
          }
        }
        // 终点是下条边的起点
        startPoint = endPoint;
        // 存入hashX上方便后续排序，为扫描线算法做准备
        let bbox = seg.bbox, min = bbox[0], max = bbox[2];
        putHashX(hashX, min, seg);
        putHashX(hashX, max, seg);
      }
    });
    this.selfIntersect(hashX);
  }

  // 根据y坐标排序，生成有序线段列表，再扫描求交
  selfIntersect(hashX) {
    let list = hashX2List(hashX), segments = [];

    // 从左到右扫描，按x坐标排序，相等按y，边会进入和离开扫描线各1次，在扫描线中的边为活跃边，维护1个活跃边列表，新添加的和老的求交
    let asl = [], delList = [];
    while(list.length) {
      if(delList.length) {
        delList.splice(0).forEach(seg => {
          let i = asl.indexOf(seg);
          asl.splice(i, 1);
          if(!seg.isDeleted) {
            segments.push(seg);
          }
        });
      }

      let { x, arr } = list[0];
      while(arr.length) {
        let seg = arr.shift();
        // 被切割的老线段无效
        if(seg.isDeleted) {
          continue;
        }
        let bboxA = seg.bbox;
        // 第2次访问边是离开活动，考虑删除
        if(seg.isVisited) {
          // 可能是垂线不能立刻删除，所以等到下次活动x再删除，因为会出现极端情况刚进来就出去，和后面同y的重合
          if(bboxA[0] !== bboxA[2]) {
            let i = asl.indexOf(seg);
            asl.splice(i, 1);
            if(!seg.isDeleted) {
              segments.push(seg);
            }
          }
          else {
            delList.push(seg);
          }
          seg.isVisited = false; // 还原以备后面逻辑重复利用
        }
        // 第1次访问边一定是进入活动，求交
        else {
          // 和asl里的边求交，如果被分割，新生成的存入asl和hash，老的线段无需再进入asl
          if(asl.length) {
            let coordsA = seg.coords, lenA = coordsA.length;
            let { x: ax1, y: ay1 } = coordsA[0];
            let { x: ax2, y: ay2 } = coordsA[1];
            for(let i = 0; i < asl.length; i++) {
              let item = asl[i];
              // 被切割的老线段无效，注意seg切割过程中可能变成删除
              if(item.isDeleted || seg.isDeleted) {
                continue;
              }
              let bboxB = item.bbox;
              if(geom.isRectsOverlap(bboxA, bboxB)) {
                let coordsB = item.coords, lenB = coordsB.length;
                let { x: bx1, y: by1 } = coordsB[0];
                let { x: bx2, y: by2 } = coordsB[1];
                // a是直线
                if(lenA === 2) {
                  // b是直线
                  if(lenB === 2) {
                    let d = (by2 - by1) * (ax2 - ax1) - (bx2 - bx1) * (ay2 - ay1);
                    // 平行检查是否重合，否则求交
                    if(d === 0) {}
                    else {
                      let res = getIntersectionLineLine(ax1, ay1, ax2, ay2, bx1, by1, bx2, by2, d);
                      if(res) {
                        let point = new Point(res);
                        let ra = sliceSegment(seg, [point]);
                        activeNewSeg(segments, list, asl, delList, x, ra);
                        let rb = sliceSegment(item, [point]);
                        activeNewSeg(segments, list, asl, delList, x, rb);
                      }
                    }
                  }
                }
              }
            }
          }
          // 不相交切割才进入asl
          if(!seg.isDeleted) {
            asl.push(seg);
            seg.isVisited = true;
          }
        }
      }
      list.shift();
    }
    // 最后面的线
    delList.forEach(seg => {
      if(!seg.isDeleted) {
        segments.push(seg);
      }
    });
    // 最后再过滤一遍，因为新生成的切割线可能会被再次切割变成删除的无效线段
    this.segments = segments.filter(item => !item.isDeleted);
  }

  io(index) {
    let hashXY = {};
    this.segments.forEach(seg => {
      let coords = seg.coords, l = coords.length;
      let start = coords[0], end = coords[l - 1];
      putHashXY(hashXY, start.x, start.y, seg, true);
      putHashXY(hashXY, end.x, end.y, seg, false);
    });
    console.log(hashXY);
  }

  // 自身有向边线段的左右内外性，连续不相交和连续重合的保持之前一致性，非连续和第一条需奇偶判断
  ioSelf(index) {
    let first = this.first, curr = first;
    curr.leftIO[index] = isInner(first, curr, true);
    if(curr.isOverlapSelf) {
    }
    else {
      curr.rightIO[index] = !curr.leftIO[index];
    }
    curr = curr.next;
    while(curr !== first) {
      if(curr.isOverlapSelf) {}
      else if(curr.isIntersectSelf) {
        let start = curr.coords[0];
        // 2条边相交为1次奇数交点，3条边是2次偶数交点，奇变偶不变
        if(start.selfI % 2 === 1) {
          curr.leftIO[index] = !curr.prev.leftIO[index];
          curr.rightIO[index] = !curr.prev.rightIO[index];
        }
        else {
          curr.leftIO[index] = curr.prev.leftIO[index];
          curr.rightIO[index] = curr.prev.rightIO[index];
        }
      }
      else {
        curr.leftIO[index] = curr.prev.leftIO[index];
        curr.rightIO[index] = curr.prev.rightIO[index];
      }
      curr = curr.next;
    }
  }

  ioTarget(target, index) {
    let first = this.first, curr = first;
    curr.isLeftInTarget = isInner(target.first, curr, true);
    curr.leftIO[index] = isInner(target.first, curr, true);
    if(curr.isOverlapTarget) {}
    else {
      curr.isRightInTarget = isInner(target.first, curr, false);
      curr.rightIO[index] = isInner(target.first, curr, false);
    }
    curr = curr.next;
    while(curr !== first) {
      if(curr.isOverlapTarget) {}
      else if(curr.isIntersectTarget) {
        let start = curr.coords[0];
        // 2条边相交为1次奇数交点，3条边是2次偶数交点，奇变偶不变
        if(start.targetI % 2 === 1) {
          curr.isLeftInTarget = !curr.prev.isLeftInTarget;
          curr.isRightInTarget = !curr.prev.isRightInTarget;
          curr.leftIO[index] = !curr.prev.leftIO[index];
          curr.rightIO[index] = !curr.prev.rightIO[index];
        }
        else {
          curr.isLeftInTarget = curr.prev.isLeftInTarget;
          curr.isRightInTarget = curr.prev.isRightInTarget;
          curr.leftIO[index] = curr.prev.leftIO[index];
          curr.rightIO[index] = curr.prev.rightIO[index];
        }
      }
      else {
        curr.isLeftInTarget = curr.prev.isLeftInTarget;
        curr.isRightInTarget = curr.prev.isRightInTarget;
        curr.leftIO[index] = curr.prev.leftIO[index];
        curr.rightIO[index] = curr.prev.rightIO[index];
      }
      curr = curr.next;
    }
  }

  toString() {
    return this.segments.map(item => item.toString());
  }

  // 2个非自交的多边形互相判断相交，依旧是扫描线算法，2个多边形统一y排序，但要分别出属于哪个多边形，因为只和对方测试相交
  static intersect2(polyA, polyB) {
    if(!polyA.segments.length || !polyB.segments.length) {
      return;
    }

    let hashX = {};
    addHashX(hashX, polyA.segments);
    addHashX(hashX, polyB.segments);
    let list = hashX2List(hashX), segments = [];

    // 和selfIntersect类似
    let asl = [], delList = [];
    while(list.length) {
      // 先检查上次要删除的
      if(delList.length) {
        delList.splice(0).forEach(seg => {
          let i = asl.indexOf(seg);
          asl.splice(i, 1);
          if(!seg.isDeleted) {
            segments.push(seg);
          }
        });
      }

      let { x, arr } = list[0];
      while(arr.length) {
        let seg = arr.shift();
        // 被切割的老线段无效
        if(seg.isDeleted) {
          continue;
        }
        let belong = seg.belong, bboxA = seg.bbox;
        // 第2次访问边是离开活动，考虑删除
        if(seg.isVisited) {
          // 可能是垂线不能立刻删除，所以等到下次活动x再删除，因为会出现极端情况刚进来就出去，和后面同y的重合
          if(bboxA[0] !== bboxA[2]) {
            let i = asl.indexOf(seg);
            asl.splice(i, 1);
            if(!seg.isDeleted) {
              segments.push(seg);
            }
          }
          else {
            delList.push(seg);
          }
          seg.isVisited = false; // 还原以备后面逻辑重复利用
        }
        // 第1次访问边一定是进入活动，求交
        else {
          // 和asl里的边求交，如果被分割，新生成的存入asl和hash，老的线段无需再进入asl
          if(asl.length) {
            let coordsA = seg.coords, lenA = coordsA.length;
            let { x: ax1, y: ay1 } = coordsA[0];
            let { x: ax2, y: ay2 } = coordsA[1];
            for(let i = 0; i < asl.length; i++) {
              let item = asl[i];
              // 被切割的老线段无效，注意seg切割过程中可能变成删除
              if(item.isDeleted || seg.isDeleted) {
                continue;
              }
              // 互交所属belong不同
              if(item.belong !== belong) {
                let bboxB = item.bbox;
                if(geom.isRectsOverlap(bboxA, bboxB)) {
                  let coordsB = item.coords, lenB = coordsB.length;
                  let { x: bx1, y: by1 } = coordsB[0];
                  let { x: bx2, y: by2 } = coordsB[1];
                  // a是直线
                  if(lenA === 2) {
                    // b是直线
                    if(lenB === 2) {
                      let d = (by2 - by1) * (ax2 - ax1) - (bx2 - bx1) * (ay2 - ay1);
                      // 平行检查是否重合，否则求交
                      if(d === 0) {
                        if(ax1 === bx1 && ay1 === by1 && ax2 === bx2 && ay2 === by2
                          || ax1 === bx2 && ay1 === by2 && ax2 === bx1 && ay2 === by1) {
                        }
                      }
                      else {
                        let res = getIntersectionLineLine(ax1, ay1, ax2, ay2, bx1, by1, bx2, by2, d);
                        if(res) {
                          let point = new Point(res);
                          let ra = sliceSegment(seg, [point]);
                          activeNewSeg(segments, list, asl, delList, x, ra);
                          let rb = sliceSegment(item, [point]);
                          activeNewSeg(segments, list, asl, delList, x, rb);
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          // 不相交切割才进入asl
          if(!seg.isDeleted) {
            asl.push(seg);
            seg.isVisited = true;
          }
        }
      }
      list.shift();
    }
    // 最后面的线
    delList.forEach(seg => {
      if(!seg.isDeleted) {
        segments.push(seg);
      }
    });
    polyA.segments = segments.filter(item => item.belong === 0 && !item.isDeleted);
    polyB.segments = segments.filter(item => item.belong === 1 && !item.isDeleted);
  }
}

function getIntersectionLineLine(ax1, ay1, ax2, ay2, bx1, by1, bx2, by2, d) {
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

// 给定交点列表分割线段，ps需排好顺序从头到尾，isSelf标明是否自相交阶段，false是和对方交点切割
function sliceSegment(seg, ps) {
  let res = [];
  let belong = seg.belong, coords = seg.coords, len = coords.length;
  let startPoint = coords[0];
  // 多个点可能截取多条，最后一条保留只修改数据，其它新生成
  ps.forEach(point => {
    let ns;
    if(len === 2) {
      ns = new Segment([
        startPoint,
        point,
      ], belong);
    }
    else if(len === 3) {}
    else if(len === 4) {}
    startPoint = point;
    res.push(ns);
  });
  // 最后一条
  let ns;
  if(len === 2) {
    ns = new Segment([
      startPoint,
      coords[1],
    ], belong);
  }
  else if(len === 3) {}
  else if(len === 4) {}
  res.push(ns);
  // 老的打标失效删除
  seg.isDeleted = true;
  return res;
}

// 相交的线段slice成多条后，老的删除，新的考虑添加进扫描列表和活动边列表，根据新的是否在范围内
function activeNewSeg(segments, list, asl, delList, x, ns) {
  ns.forEach(seg => {
    let bbox = seg.bbox, x1 = bbox[0], x2 = bbox[2];
    // 活跃x之前无相交判断意义
    if(x2 < x) {
      segments.push(seg);
      return;
    }
    // 按顺序放在list的正确位置，可能y1已经过去不需要加入了
    let i = 0;
    if(x1 < x) {
      seg.isVisited = true;
    }
    else {
      for(let len = list.length; i < len; i++) {
        let item = list[i];
        let lx = item.x;
        if(x1 === lx) {
          item.arr.push(seg);
          break;
        }
        // 新的插入
        if(x1 < lx) {
          let temp = {
            x: x1,
            arr: [seg],
          };
          list.splice(i, 0, temp);
          break;
        }
      }
    }
    // y2一定会加入
    for(let len = list.length; i < len; i++) {
      let item = list[i];
      let lx = item.x;
      if(x2 === lx) {
        item.arr.push(seg);
        break;
      }
      if(x2 < lx) {
        let temp = {
          x: x2,
          arr: [seg],
        };
        list.splice(i, 0, temp);
        break;
      }
    }
  });
}

function addHashX(hashX, segments) {
  segments.forEach(seg => {
    let bbox = seg.bbox, min = bbox[0], max = bbox[2];
    putHashX(hashX, min, seg);
    putHashX(hashX, max, seg);
  });
}

function putHashX(hashX, x, seg) {
  let list = hashX[x] = hashX[x] || [];
  list.push(seg);
}

// 按x升序将所有线段组成一个垂直扫描线列表
function hashX2List(hashX) {
  let list = [];
  Object.keys(hashX).forEach(x => list.push({
    x: parseFloat(x),
    arr: hashX[x],
  }));
  return list.sort(function(a, b) {
    return a.x - b.x;
  });
}

function putHashXY(hashXY, x, y, seg, isStart) {
  let hash = hashXY[x] = hashXY[x] || {};
  let list = hash[y] = hash[y] || [];
  list.push({
    isStart,
    seg,
  });
}

function getCenterPoint(seg) {
  let coords = seg.coords, len = coords.length;
  if(len === 2) {
    let { x: x1, y: y1 } = coords[0];
    let { x: x2, y: y2 } = coords[len - 1];
    return [x1 + (x2 - x1) * 0.5, y1 + (y2 - y1) * 0.5];
  }
  else if(len === 3) {}
  else if(len === 4) {}
}

// 奇偶性判断点在非自相交的多边形内，first为第一条边，seg为判断的对象边
function isInner(first, seg, isLeft) {
  let curr = first, count = 0;
  let [x, y] = getCenterPoint(seg);
  // console.warn(curr.toString());
  do {
    if(curr !== seg) {
      let coordsB = curr.coords, lenB = coordsB.length, bboxB = curr.bbox;
      let {x: bx1, y: by1} = coordsB[0];
      let {x: bx2, y: by2} = coordsB[1];
      if(lenB === 2) {
        // 水平左射线，取一个最小值ax和当前x/y组成水平线段即可，右反之
        let ax, bboxA;
        if(isLeft) {
          ax = Math.min(bx1, bx2) - 1;
          bboxA = [ax, y, x, y];
        }
        else {
          ax = Math.max(bx1, bx2) + 1;
          bboxA = [x, y, ax, y];
        }
        if(geom.isRectsOverlap(bboxA, bboxB)) {
          // console.log(curr.toString(), seg.toString());
          // console.log(bboxA, bboxB);
          // 一定不平行了，因为bbox不重合
          let d = (by2 - by1) * (ax - x);
          let toSource = (
            (bx2 - bx1) * (y - by1) - (by2 - by1) * (x - bx1)
          ) / d;
          let toClip = (
            (ax - x) * (y - by1)
          ) / d;
          if(toSource > 0 && toSource < 1 && toClip > 0 && toClip < 1) {
            count++;
          }
        }
      }
      else if(lenB === 3) {
      }
      else if(lenB === 4) {
      }
    }
    curr = curr.next;
  }
  while(curr !== first);
  return count % 2 === 1;
}

export default Polygon;
