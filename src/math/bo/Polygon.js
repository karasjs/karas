import geom from '../geom';
import vector from '../vector';
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
        this.segments.push(seg);
        // 终点是下条边的起点
        startPoint = endPoint;
      }
    });
  }

  // 根据y坐标排序，生成有序线段列表，再扫描求交
  selfIntersect() {
    let list = genHashXList(this.segments);
    this.segments = findIntersection(list, false);
  }

  toString() {
    return this.segments.map(item => item.toString());
  }

  // 2个非自交的多边形互相判断相交，依旧是扫描线算法，2个多边形统一y排序，但要分别出属于哪个多边形，因为只和对方测试相交
  static intersect2(polyA, polyB) {
    if(!polyA.segments.length || !polyB.segments.length) {
      return;
    }

    let list = genHashXList(polyA.segments.concat(polyB.segments));
    let segments = findIntersection(list, true);
    polyA.segments = segments.filter(item => item.belong === 0);
    polyB.segments = segments.filter(item => item.belong === 1);
  }

  /**
   * 以Bentley-Ottmann算法为原理，为每个顶点设计事件，按x升序、y升序遍历所有顶点的事件
   * 每条线段边有2个顶点即2个事件，左下为start，右上为end
   * 同顶点优先end，start相同则对比线段谁的y更小（看end点或者看中点排序）
   * 最下面的边可直接得知两侧填充性，其余的边根据自己下方即可确定填充性
   */
  static io2(polyA, polyB) {
    let list = genHashXYList(polyA.segments.concat(polyB.segments));
    let ael = [];
    // 3遍循环，先注释a多边形的边自己内外性，再b的边自己内外性，最后一起注释对方的内外性
    list.forEach(item => {
      let { isStart, seg } = item;
      if(seg.belong === 0) {
        console.log(isStart, seg.toString());
        if(isStart) {
          // 下面没有线段了，底部边，上方填充下方空白（除非是偶次重复段）
          if(!ael.length) {
            seg.above[0] = true;
            ael.push(seg);
          }
          else {
            let ca = seg.coords;
            for(let i = ael.length - 1; i >= 0; i--) {
              let curr = ael[i];
            }
          }
        }
        else {
          let i = ael.indexOf(seg);
          ael.splice(i, 1);
        }
      }
    });
  }
}

function findIntersection(list, compareBelong) {
  // 从左到右扫描，按x坐标排序，相等按y，边会进入和离开扫描线各1次，在扫描线中的边为活跃边，维护1个活跃边列表，新添加的和老的求交
  let ael = [], delList = [], segments = [];
  while(list.length) {
    if(delList.length) {
      delList.splice(0).forEach(seg => {
        let i = ael.indexOf(seg);
        ael.splice(i, 1);
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
          let i = ael.indexOf(seg);
          ael.splice(i, 1);
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
        if(ael.length) {
          let coordsA = seg.coords, lenA = coordsA.length;
          let { x: ax1, y: ay1 } = coordsA[0];
          let { x: ax2, y: ay2 } = coordsA[1];
          for(let i = 0; i < ael.length; i++) {
            let item = ael[i];
            // 被切割的老线段无效，注意seg切割过程中可能变成删除
            if(item.isDeleted || seg.isDeleted) {
              continue;
            }
            // 互交所属belong不同才进行检测，自交则不检查belong因为一定一样
            if(compareBelong && item.belong === belong) {
              continue;
            }
            // bbox相交才考虑真正计算，加速
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
                      activeNewSeg(segments, list, ael, delList, x, ra);
                      let rb = sliceSegment(item, [point]);
                      activeNewSeg(segments, list, ael, delList, x, rb);
                    }
                  }
                }
              }
            }
          }
        }
        // 不相交切割才进入asl
        if(!seg.isDeleted) {
          ael.push(seg);
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
  return segments.filter(item => !item.isDeleted);
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
function activeNewSeg(segments, list, ael, delList, x, ns) {
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

// 按x升序将所有线段组成一个垂直扫描线列表，求交用，y方向不用管
function genHashXList(segments) {
  let hashX = {};
  segments.forEach(seg => {
    let bbox = seg.bbox, min = bbox[0], max = bbox[2];
    putHashX(hashX, min, seg);
    putHashX(hashX, max, seg);
  });
  let list = [];
  Object.keys(hashX).forEach(x => list.push({
    x: parseFloat(x),
    arr: hashX[x],
  }));
  return list.sort(function(a, b) {
    return a.x - b.x;
  });
}

function putHashX(hashX, x, seg) {
  let list = hashX[x] = hashX[x] || [];
  list.push(seg);
}

// 按x升序将所有线段组成一个垂直扫描线列表，y方向也需要判断
function genHashXYList(segments) {
  let hashXY = {};
  segments.forEach(seg => {
    let coords = seg.coords, l = coords.length;
    let start = coords[0], end = coords[l - 1];
    putHashXY(hashXY, start.x, start.y, seg, true);
    putHashXY(hashXY, end.x, end.y, seg, false);
  });
  let listX = [];
  Object.keys(hashXY).forEach(x => {
    let hashY = hashXY[x];
    let listY = [];
    Object.keys(hashY).forEach(y => {
      let arr = hashY[y].sort(function(a, b) {
        // end优先于start先触发
        if(a.isStart !== b.isStart) {
          return a.isStart ? 1 : -1;
        }
        let sa = a.seg, sb = b.seg;
        let ca = sa.coords, cb = sb.coords;
        // start点相同看谁在上方
        if(a.isStart) {
          let pa1 = ca[0], pb1 = cb[0];
          let pa2 = ca[ca.length - 1], pb2 = cb[cb.length - 1];
          return vector.crossProduct(pa2.x - pa1.x, pa2.y - pa1.y, pb2.x - pb1.x, pb2.y - pb1.y) < 0 ? 1 : -1;
        }
        // end点相同无所谓，其不参与运算，因为每次end线段先出栈ael
      });
      // console.log(x, y, arr.map(item => item.isStart + ', ' + item.seg.toString()));
      listY.push({
        y: parseFloat(y),
        arr,
      })
    });
    listX.push({
      x: parseFloat(x),
      arr: listY.sort(function(a, b) {
        return a.y - b.y;
      }),
    });
  });
  let list = [];
  listX.forEach(item => {
    item.arr.forEach(item => {
      list = list.concat(item.arr);
    });
  });
  return list;
}

function putHashXY(hashXY, x, y, seg, isStart) {
  let hash = hashXY[x] = hashXY[x] || {};
  let list = hash[y] = hash[y] || [];
  list.push({
    isStart,
    seg,
  });
}

export default Polygon;
