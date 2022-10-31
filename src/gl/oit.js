import isec from '../math/isec';
import geom from '../math/geom';
import vector from '../math/vector';

const { intersectPlanePlane, intersectLineLine3, pointOnLine3 } = isec;
const { isRectsOverlap } = geom;
const { isZero3 } = vector;

// 多个平面相交切割，每个平面有x1/y1/z1~x4/y4/z4一共4个顶点，且有index索引额外信息
function splitQuadrilateralPlane(list, hash) {
  let length = list.length;
  if(length < 2) {
    return list;
  }
  // 先每个四边形计算x/y/z轴上的投影，可能是四边形也可能重合三角形或直线
  let xList = [];
  for(let i = 0; i < length; i++) {
    let item = list[i];
    let { index, points } = item;
    let xShadow = [
      {
        y: points[0].y,
        z: points[0].z,
      },
    ];
    if(points[1].y !== points[0].y || points[1].z !== points[0].z) {
      xShadow.push({
        y: points[1].y,
        z: points[1].z,
      });
    }
    if((points[2].y !== points[0].y || points[2].z !== points[0].z)
      && (points[2].y !== points[1].y || points[2].z !== points[1].z)) {
      xShadow.push({
        y: points[2].y,
        z: points[2].z,
      });
    }
    if((points[3].y !== points[0].y || points[3].z !== points[0].z)
      && (points[3].y !== points[1].y || points[3].z !== points[1].z)
      && (points[3].y !== points[2].y || points[3].z !== points[2].z)) {
      xShadow.push({
        y: points[3].y,
        z: points[3].z,
      });
    }
    // 顶点和bbox，每个轴投影都要，x特殊多线段列表
    item.xShadow = [];
    item.xBbox = [];
    for(let j = 0, len = xShadow.length; j < len; j++) {
      let a = xShadow[j];
      item.xShadow.push(a);
      if(j === 0) {
        item.xBbox[0] = a.z;
        item.xBbox[1] = a.y;
        item.xBbox[2] = a.z;
        item.xBbox[3] = a.y;
      }
      else {
        item.xBbox[0] = Math.min(item.xBbox[0], a.z);
        item.xBbox[1] = Math.min(item.xBbox[1], a.y);
        item.xBbox[2] = Math.max(item.xBbox[2], a.z);
        item.xBbox[3] = Math.max(item.xBbox[3], a.y);
      }
      // 只有2个点防重，x投影特殊需要，线段排序列表
      if(len === 2 && j === 1) {
        break;
      }
      let b = xShadow[(j + 1) % len];
      if(a.z > b.z) {
        [a, b] = [b, a];
      }
      xList.push({
        index,
        y1: a.y,
        z1: a.z,
        y2: b.y,
        z2: b.z,
      });
    }
    let yShadow = [
      {
        x: points[0].x,
        z: points[0].z,
      },
    ];
    if(points[1].x !== points[0].x || points[1].z !== points[0].z) {
      yShadow.push({
        x: points[1].x,
        z: points[1].z,
      });
    }
    if((points[2].x !== points[0].x || points[2].z !== points[0].z)
      && (points[2].x !== points[1].x || points[2].z !== points[1].z)) {
      yShadow.push({
        x: points[2].x,
        z: points[2].z,
      });
    }
    if((points[3].x !== points[0].x || points[3].z !== points[0].z)
      && (points[3].x !== points[1].x || points[3].z !== points[1].z)
      && (points[3].x !== points[2].x || points[3].z !== points[2].z)) {
      yShadow.push({
        x: points[3].x,
        z: points[3].z,
      });
    }
    // y/z类似，但不用排序添加
    item.yShadow = [];
    item.yBbox = [];
    for(let j = 0, len = yShadow.length; j < len; j++) {
      let a = yShadow[j];
      item.yShadow.push(a);
      if(j === 0) {
        item.yBbox[0] = a.x;
        item.yBbox[1] = a.z;
        item.yBbox[2] = a.x;
        item.yBbox[3] = a.z;
      }
      else {
        item.yBbox[0] = Math.min(item.yBbox[0], a.x);
        item.yBbox[1] = Math.min(item.yBbox[1], a.z);
        item.yBbox[2] = Math.max(item.yBbox[2], a.x);
        item.yBbox[3] = Math.max(item.yBbox[3], a.z);
      }
    }
    let zShadow = [
      {
        x: points[0].x,
        y: points[0].y,
      },
    ];
    if(points[1].x !== points[0].x || points[1].y !== points[0].y) {
      zShadow.push({
        x: points[1].x,
        y: points[1].y,
      });
    }
    if((points[2].x !== points[0].x || points[2].y !== points[0].y)
      && (points[2].x !== points[1].x || points[2].y !== points[1].y)) {
      zShadow.push({
        x: points[2].x,
        y: points[2].y,
      });
    }
    if((points[3].x !== points[0].x || points[3].y !== points[0].y)
      && (points[3].x !== points[1].x || points[3].y !== points[1].y)
      && (points[3].x !== points[2].x || points[3].y !== points[2].y)) {
      zShadow.push({
        x: points[3].x,
        y: points[3].y,
      });
    }
    item.zShadow = [];
    item.zBbox = [];
    for(let j = 0, len = zShadow.length; j < len; j++) {
      let a = zShadow[j];
      item.zShadow.push(a);
      if(j === 0) {
        item.zBbox[0] = a.x;
        item.zBbox[1] = a.y;
        item.zBbox[2] = a.x;
        item.zBbox[3] = a.y;
      }
      else {
        item.zBbox[0] = Math.min(item.zBbox[0], a.x);
        item.zBbox[1] = Math.min(item.zBbox[1], a.y);
        item.zBbox[2] = Math.max(item.zBbox[2], a.x);
        item.zBbox[3] = Math.max(item.zBbox[3], a.y);
      }
    }
  }
  /**
   * 从侧面观看投影，即x轴，按照深度z顺序，每个平面可形成2或4条线（y/z坐标），用扫描线算法求交
   * 处在扫描线活动范围下的2个线段，如果属于2个不同平面，继续
   * 再检测面的x/y/z是否bbox重叠，3个都重叠是2个四边面空间重叠的必要条件，以此前提甄选
   * 再用平面相交公式求得相交线，查看双方顶点是否都存在于此条线上且范围内，都有则真正相交，开始拆分
   */
  let eventHash = {};
  for(let i = 0, len = xList.length; i < len; i++) {
    let seg = xList[i];
    let o = eventHash[seg.z1] = eventHash[seg.z1] || [];
    o.push(seg);
    o = eventHash[seg.z2] = eventHash[seg.z2] || [];
    o.push(seg);
  }
  // z排序，不用管y
  let eventList = [];
  for(let i in eventHash) {
    if(eventHash.hasOwnProperty(i)) {
      let o = eventHash[i];
      eventList.push({
        z: i,
        list: o,
      });
    }
  }
  eventList.sort(function(a, b) {
    return a.z - b.z;
  });
  // console.log(eventList);
  const HISTORY = {}; // 求过的2个平面记录，只求1次防重
  let ael = []; // 当前扫描线活动边
  for(let i = 0, len = eventList.length; i < len; i++) {
    let { list } = eventList[i];
    for(let i = 0, len = list.length; i < len; i++) {
      let seg = list[i];
      // 第1次进是start，第2次是end
      if(seg.isVisited) {
        let j = ael.indexOf(seg);
        if(j > -1) {
          ael.splice(j, 1);
        }
      }
      else {
        // console.error(seg);
        if(ael.length) {
          for(let j = 0, len = ael.length; j < len; j++) {
            let item = ael[j];
            // 属于不同的平面才能相交
            if(seg.index === item.index) {
              continue;
            }
            // console.warn(item);
            // 无论结果如何，这2个面都记录下防止重复检测
            let key = seg.index > item.index ? (item.index + ',' + seg.index) : (seg.index + ',' + item.index);
            if(HISTORY.hasOwnProperty(key)) {
              continue;
            }
            HISTORY[key] = true;
            let pa = hash[seg.index], pb = hash[item.index];
            // 如果面被拆分过，忽略掉
            if(pa.puzzle) {
              break;
            }
            if(pb.puzzle) {
              continue;
            }
            // 所属的2个面进行x/y/z上的bbox重叠验证
            if(isRectsOverlap(pa.xBbox, pb.xBbox, false)
              && isRectsOverlap(pa.yBbox, pb.yBbox, false)
              && isRectsOverlap(pa.zBbox, pb.zBbox, false)) {
              let pointsA = pa.points, pointsB = pb.points;
              let line = intersectPlanePlane(
                pointsA[0], pointsA[1], pointsA[2],
                pointsB[0], pointsB[1], pointsB[2]
              );
              // 这条线一定和2个四边形有2/4个不同交点，分别用每条边和直线求交点，2个是四边形a内切割b，4个是a和b恰好互相切割
              let resA = [], resB = [];
              for(let i = 0, len = pointsA.length; i < len; i++) {
                let r = intersectLineLine3(
                  pointsA[i], pointsA[(i + 1) % len],
                  line[0], line[1], 1
                );
                if(r) {
                  resA.push(r);
                }
              }
              for(let i = 0, len = pointsB.length; i < len; i++) {
                let r = intersectLineLine3(
                  pointsB[i], pointsB[(i + 1) % len],
                  line[0], line[1], 1
                );
                if(r) {
                  resB.push(r);
                }
              }
              // res只可能是2和0，2个res组合只有3种可能，其它则是精度误差忽略，切割的交点在边的索引和下个索引之间的边上
              if(resA.length === 2 && resB.length === 2
                || resA.length === 2 && !resB.length
                || !resA.length || resB.length === 2) {
                // 2个都需要切割，各自判断
                if(resA.length) {
                  splitPlaneByPoint(pa, resA);
                }
                if(resB.length) {
                  splitPlaneByPoint(pb, resB);
                }
              }
            }
          }
        }
        seg.isVisited = true;
        ael.push(seg);
      }
    }
  }
}

function splitPlaneByPoint(plane, res) {
  let points = plane.points, i1 = -1, i2 = -1;
  let p0 = points[0], p1 = points[1], p2 = points[2], p3 = points[3];
  // console.log(plane, res);
  // 交点一定在边上，不在边上的不切割
  for(let i = 0, len = points.length; i < len; i++) {
    let p1 = points[i], p2 = points[(i + 1) % len];
    let r1 = pointOnLine3(res[0], p1, p2);
    let r2 = pointOnLine3(res[1], p1, p2);
    if(r1) {
      i1 = i;
    }
    if(r2) {
      i2 = i;
    }
  }
  // console.warn(i1, i2);
  // 看是否相邻以及是否是原有顶点，不同情况不同拆分，切割也不能在同一条边上
  if(i1 > -1 && i2 > -1 && i1 !== i2) {
    let onVertex1 = isZero3(points[i1], res[0]) ? i1 : -1;
    if(!onVertex1 && points[i1 + 1]) {
      onVertex1 = isZero3(points[i1 + 1], res[0]) ? (i1 + 1) : -1;
    }
    let onVertex2 = isZero3(points[i2], res[1]) ? i2 : -1;
    if(!onVertex2 && points[i2 + 1]) {
      onVertex2 = isZero3(points[i2 + 1], res[1]) ? (i2 + 1) : -1;
    }
    // 如果是相邻顶点，或者只有1个顶点但恰好2点在同边则失效
    if(Math.abs(i1 - i2) <= 1) {
      if(onVertex1 > -1 && onVertex2 > -1) {
        return;
      }
      else if(onVertex1 > -1) {
        if(onVertex1 === i2) {
          return;
        }
      }
      else if(onVertex2 > -1) {
        if(onVertex2 === i2) {
          return;
        }
      }
    }
    // 原本矩形经过任意matrix变换后一定还是个平行四边形（相对所在平面），4个顶点坐标已知
    // 然后交点坐标已知，也一定在这个平面上，求得相对于左上角顶点即原点的百分比坐标，分母为宽或高
    // 其实就是求拆分后的拼图，某个点对应于原本矩形纹理的百分比坐标
    // 先求得平行四边形的2个邻边的向量，然后求交点和向量所在直线与边的交点即可得出
    let va = plane.va, vb = plane.vb;
    if(!va) {
      va = plane.va = {
        x: p0.x - p1.x,
        y: p0.y - p1.y,
        z: p0.z - p1.z,
      };
    }
    if(!vb) {
      vb = plane.vb = {
        x: p1.x - p2.x,
        y: p1.y - p2.y,
        z: p1.z - p2.z,
      };
    }
    // n边形（n一定>=3)，会被分为a、b两个多边形
    let puzzle = plane.puzzle = plane.puzzle || [];
    let a = {
      index: plane.index,
      node: plane.node,
      target: plane.target,
      isPuzzle: true,
      points: [],
    };
    for(let i = 0; i <= i1; i++) {
      a.points.push(getPercentXY(points[i], va, vb, p0, p1, p3));
    }
    // 第1个交点如果在顶点上忽略，前面循环考虑了
    if(onVertex1 === -1) {
      a.points.push(getPercentXY(res[0], va, vb, p0, p1, p3));
    }
    // 第2个即便在顶点上也包含，后面循环没考虑
    a.points.push(getPercentXY(res[1], va, vb, p0, p1, p3));
    for(let i = i2 + 1, len = points.length; i < len; i++) {
      a.points.push(getPercentXY(points[i], va, vb, p0, p1, p3));
    }
    if(a.points.length > 2) {
      puzzle.push(a);
    }
    // b部分同上
    let b = {
      index: plane.index,
      node: plane.node,
      target: plane.target,
      isPuzzle: true,
      points: [],
    };
    b.points.push(getPercentXY(res[0], va, vb, p0, p1, p3));
    for(let i = i1 + 1; i <= i2; i++) {
      b.points.push(getPercentXY(points[i], va, vb, p0, p1, p3));
    }
    if(onVertex2 === -1) {
      b.points.push(getPercentXY(res[1], va, vb, p0, p1, p3));
    }
    if(b.points.length > 2) {
      puzzle.push(b);
    }
  }
}

// 已知空间平行四边形顶点和其面上一点，求相对于左上角顶点即原点的百分比坐标，四边形宽高即分母
function getPercentXY(p, va, vb, p0, p1, p3) {
  let pa = {
    x: p.x + va.x,
    y: p.y + va.y,
    z: p.z + va.z,
  }, pb = {
    x: p.x + vb.x,
    y: p.y + vb.y,
    z: p.z + vb.z,
  };
  let ipx = intersectLineLine3(p0, p1, p, pb, 3);
  let ipy = intersectLineLine3(p0, p3, p, pa, 3);
  return {
    x: p.x,
    y: p.y,
    z: p.z,
    px: (ipx.x - p0.x) / (p1.x - p0.x),
    py: (ipy.y - p0.y) / (p3.y - p1.y),
  };
}

export default {
  splitQuadrilateralPlane,
};
