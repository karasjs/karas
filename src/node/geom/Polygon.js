import Polyline from './Polyline';
import util from '../../util/util';
import isec from '../../math/isec';
import bezier from '../../math/bezier';
import geom from '../../math/geom';
import { union, diff, intersection, xor } from '../../math/martinez';

function getIntersectionBezier2Line(ax1, ay1, ax2, ay2, ax3, ay3,
                                    bx1, by1, bx2, by2) {
  let res = isec.intersectBezier2Line(ax1, ay1, ax2, ay2, ax3, ay3,
    bx1, by1, bx2, by2);
  if(res.length) {
    res = res.map(item => {
      let toClip;
      // toClip是直线上的距离，可以简化为只看x或y，选择差值比较大的防止精度问题
      if(Math.abs(bx2 - bx1) >= Math.abs(by2 - by1)) {
        toClip = Math.abs((item.x - bx1) / (bx2 - bx1));
      }
      else {
        toClip = Math.abs((item.y - by1) / (by2 - by1));
      }
      if(item.t > 0 && item.t < 1 && toClip > 0 && toClip < 1) {
        // 还要判断斜率，相等也忽略（小于一定误差）
        let k1 = bezier.bezierSlope([
          [ax1, ay1],
          [ax2, ay2],
          [ax3, ay3],
        ], item.t);
        let k2 = bezier.bezierSlope([[bx1, by1], [bx2, by2]]);
        // 忽略方向，180°也是平行，Infinity相减为NaN
        if(Math.abs((Math.abs(k1) - Math.abs(k2)) || 0) < 1e-6) {
          return;
        }
        return {
          coords: [item.x, item.y],
          toSource: item.t, // source是曲线直接用t
          toClip,
        };
      }
    }).filter(i => i);
    if(res.length) {
      return res;
    }
  }
}

function getIntersectionBezier3Line(ax1, ay1, ax2, ay2, ax3, ay3, ax4, ay4,
                                    bx1, by1, bx2, by2) {
  let res = isec.intersectBezier3Line(ax1, ay1, ax2, ay2, ax3, ay3, ax4, ay4,
    bx1, by1, bx2, by2);
  if(res.length) {
    res = res.map(item => {
      // toClip是直线上的距离，可以简化为只看x或y，选择差值比较大的防止精度问题
      let toClip;
      if(Math.abs(bx2 - bx1) >= Math.abs(by2 - by1)) {
        toClip = Math.abs((item.x - bx1) / (bx2 - bx1));
      }
      else {
        toClip = Math.abs((item.y - by1) / (by2 - by1));
      }
      if(item.t > 0 && item.t < 1 && toClip > 0 && toClip < 1) {
        // 还要判断斜率，相等也忽略（小于一定误差）
        let k1 = bezier.bezierSlope([
          [ax1, ay1],
          [ax2, ay2],
          [ax3, ay3],
          [ax4, ay4],
        ], item.t);
        let k2 = bezier.bezierSlope(bx1, by1, bx2, by2);
        // 忽略方向，180°也是平行，Infinity相减为NaN
        if(Math.abs((Math.abs(k1) - Math.abs(k2)) || 0) < 1e-6) {
          return;
        }
        return {
          coords: [item.x, item.y],
          toSource: item.t, // source是曲线直接用t
          toClip,
        };
      }
    }).filter(i => i);
    if(res.length) {
      return res;
    }
  }
}

function getIntersectionBezier2Bezier3(ax1, ay1, ax2, ay2, ax3, ay3,
                                       bx1, by1, bx2, by2, bx3, by3, bx4, by4) {

  let res = isec.intersectBezier2Bezier3(ax1, ay1, ax2, ay2, ax3, ay3,
    bx1, by1, bx2, by2, bx3, by3, bx4, by4);
  if(res.length) {
    res = res.map(item => {
      // toClip是另一条曲线的距离，需根据交点和曲线方程求t
      let toClip = bezier.getPointT([
        [bx1, by1],
        [bx2, by2],
        [bx3, by3],
        [bx4, by4],
      ], item.x, item.y);
      // 防止误差无值
      if(toClip.length) {
        toClip = toClip[0];
        if(item.t > 0 && item.t < 1 && toClip > 0 && toClip < 1) {
          // 还要判断斜率，相等也忽略（小于一定误差）
          let k1 = bezier.bezierSlope([
            [ax1, ay1],
            [ax2, ay2],
            [ax3, ay3],
          ], item.t);
          let k2 = bezier.bezierSlope([
            [bx1, by1],
            [bx2, by2],
            [bx3, by3],
            [bx4, by4],
          ], toClip);
          // 忽略方向，180°也是平行，Infinity相减为NaN
          if(Math.abs((Math.abs(k1) - Math.abs(k2)) || 0) < 1e-6) {
            return;
          }
          return {
            coords: [item.x, item.y],
            toSource: item.t, // source是曲线直接用t
            toClip: toClip,
          };
        }
      }
    }).filter(i => i);
    if(res.length) {
      return res;
    }
  }
}

function getIntersectionBezier3Bezier3(ax1, ay1, ax2, ay2, ax3, ay3, ax4, ay4,
                                       bx1, by1, bx2, by2, bx3, by3, bx4, by4) {
  let res = isec.intersectBezier3Bezier3(ax1, ay1, ax2, ay2, ax3, ay3, ax4, ay4,
    bx1, by1, bx2, by2, bx3, by3, bx4, by4);
  if(res.length) {
    res = res.map(item => {
      // toClip是另一条曲线的距离，需根据交点和曲线方程求t
      let toClip = bezier.getPointT([
        [bx1, by1],
        [bx2, by2],
        [bx3, by3],
        [bx4, by4],
      ], item.x, item.y);
      // 防止误差无值
      if(toClip.length) {
        toClip = toClip[0];
        if(item.t > 0 && item.t < 1 && toClip > 0 && toClip < 1) {
          // 还要判断斜率，相等也忽略（小于一定误差）
          let k1 = bezier.bezierSlope([
            [ax1, ay1],
            [ax2, ay2],
            [ax3, ay3],
            [ax4, ay4],
          ], item.t);
          let k2 = bezier.bezierSlope([
            [bx1, by1],
            [bx2, by2],
            [bx3, by3],
            [bx4, by4],
          ], toClip);
          // 忽略方向，180°也是平行，Infinity相减为NaN
          if(Math.abs((Math.abs(k1) - Math.abs(k2)) || 0) < 1e-6) {
            return;
          }
          return {
            coords: [item.x, item.y],
            toSource: item.t, // source是曲线直接用t
            toClip: toClip,
          };
        }
      }
    }).filter(i => i);
    if(res.length) {
      return res;
    }
  }
}

function getIntersectionBezier2Bezier2(ax1, ay1, ax2, ay2, ax3, ay3,
                                       bx1, by1, bx2, by2, bx3, by3) {
  let res = isec.intersectBezier2Bezier2(ax1, ay1, ax2, ay2, ax3, ay3,
    bx1, by1, bx2, by2, bx3, by3);
  if(res.length) {
    res = res.map(item => {
      // toClip是另一条曲线的距离，需根据交点和曲线方程求t
      let toClip = bezier.getPointT([
        [bx1, by1],
        [bx2, by2],
        [bx3, by3],
      ], item.x, item.y);
      // 防止误差无值
      if(toClip.length) {
        toClip = toClip[0];
        if(item.t > 0 && item.t < 1 && toClip > 0 && toClip < 1) {
          // 还要判断斜率，相等也忽略（小于一定误差）
          let k1 = bezier.bezierSlope([
            [ax1, ay1],
            [ax2, ay2],
            [ax3, ay3],
          ], item.t);
          let k2 = bezier.bezierSlope([
            [bx1, by1],
            [bx2, by2],
            [bx3, by3],
          ], toClip);
          // 忽略方向，180°也是平行，Infinity相减为NaN
          if(Math.abs((Math.abs(k1) - Math.abs(k2)) || 0) < 1e-6) {
            return;
          }
          return {
            coords: [item.x, item.y],
            toSource: item.t, // source是曲线直接用t
            toClip,
          };
        }
      }
    }).filter(i => i);
    if(res.length) {
      return res;
    }
  }
}

function slicePolygonsUnIntersected(polyA, polyB) {
  for(let i = 0, lenA = polyA.length; i < lenA; i++) {
    let a = polyA[i], coordsA = a.coords, len1 = coordsA.length, bboxA = a.bbox;
    let [ax1, ay1] = coordsA[0];
    let [ax2, ay2] = coordsA[1];
    let ax3, ay3, ax4, ay4;
    if(len1 >= 3) {
      [ax3, ay3] = coordsA[2];
    }
    if(len1 >= 4) {
      [ax4, ay4] = coordsA[3];
    }
    for(let j = 0, lenB = polyB.length; j < lenB; j++) {
      let b = polyB[j], coordsB = b.coords, len2 = coordsB.length, bboxB = b.bbox;
      // 防止误差，加快计算，bbox不重合不用继续
      if(geom.isRectsOverlap(bboxA, bboxB)) {
        let [bx1, by1] = coordsB[0];
        let [bx2, by2] = coordsB[1];
        let bx3, by3, bx4, by4;
        if(len2 >= 3) {
          [bx3, by3] = coordsB[2];
        }
        if(len2 >= 4) {
          [bx4, by4] = coordsB[3];
        }
        // a是直线
        if(len1 === 2) {
          // b是直线
          if(len2 === 2) {
            let d = (by2 - by1) * (ax2 - ax1) - (bx2 - bx1) * (ay2 - ay1);
            // 平行不相交
            if(d === 0) {
              return;
            }
            let toSource = (
              (bx2 - bx1) * (ay1 - by1) - (by2 - by1) * (ax1 - bx1)
            ) / d;
            let toClip = (
              (ax2 - ax1) * (ay1 - by1) - (ay2 - ay1) * (ax1 - bx1)
            ) / d;
            if(toSource > 0 && toSource < 1 && toClip > 0 && toClip < 1) {
              let ox = ax1 + toSource * (ax2 - ax1);
              let oy = ay1 + toSource * (ay2 - ay1);
              polyB.splice(j, 0, convert2Segment([
                [bx1, by1],
                [ox, oy],
              ]));
              coordsB[0] = [ox, oy];
              bboxB = b.bbox = bezier.bboxBezier(ox, oy, bx2, by2);
              polyA.splice(i, 0, convert2Segment([
                [ax1, ay1],
                [ox, oy],
              ]));
              coordsA[0] = [ox, oy];
              bboxA = a.bbox = bezier.bboxBezier(ox, oy, ax2, ay2);
              lenA++;
              lenB++;
            }
          }
          // b是曲线
          else if(len2 === 3 || len2 === 4) {
            let res = len2 === 3
              ? getIntersectionBezier2Line(bx1, by1, bx2, by2, bx3, by3,
                  ax1, ay1, ax2, ay2)
              : getIntersectionBezier3Line(bx1, by1, bx2, by2, bx3, by3, bx4, by4,
                ax1, ay1, ax2, ay2);
            if(res) {
              sliceBezierSeg(polyB, j, res, true);
              let an = sliceLineSeg(polyA, i, res, false);
              // 更新a数据
              coordsA = an.coords;
              len1 = coordsA.length;
              bboxA = an.bbox;
              [ax1, ay1] = coordsA[0];
              [ax2, ay2] = coordsA[1];
              // 1段变多段，继续循环
              j += res.length;
              lenA += res.length;
              lenB += res.length;
            }
          }
        }
        // a是2阶曲线
        else if(len1 === 3) {
          let res;
          if(len2 === 2) {
            res = getIntersectionBezier2Line(ax1, ay1, ax2, ay2, ax3, ay3,
              bx1, by1, bx2, by2);
          }
          else if(len2 === 3) {
            res = getIntersectionBezier2Bezier2(ax1, ay1, ax2, ay2, ax3, ay3,
              bx1, by1, bx2, by2, bx3, by3);
          }
          else if(len2 === 4) {
            res = getIntersectionBezier2Bezier3(ax1, ay1, ax2, ay2, ax3, ay3,
              bx1, by1, bx2, by2, bx3, by3, bx4, by4);
          }
          if(res) {
            if(len2 === 2) {
              sliceLineSeg(polyB, j, res, false);
            }
            else {
              sliceBezierSeg(polyB, j, res, false);
            }
            let an = sliceBezierSeg(polyA, i, res, true);
            coordsA = an.coords;
            len1 = coordsA.length;
            bboxA = an.bbox;
            [ax1, ay1] = coordsA[0];
            [ax2, ay2] = coordsA[1];
            [ax3, ay3] = coordsA[2];
            j += res.length;
            lenA += res.length;
            lenB += res.length;
          }
        }
        // a是3阶曲线
        else if(len1 === 4) {
          let res;
          if(len2 === 2) {
            res = getIntersectionBezier3Line(ax1, ay1, ax2, ay2, ax3, ay3, ax4, ay4,
              bx1, by1, bx2, by2);
          }
          else if(len2 === 3) {
            res = getIntersectionBezier2Bezier3(bx1, by1, bx2, by2, bx3, by3, // 注意反过来
              ax1, ay1, ax2, ay2, ax3, ay3, ax4, ay4);
          }
          else if(len2 === 4) {
            res = getIntersectionBezier2Bezier3(ax1, ay1, ax2, ay2, ax3, ay3, ax4, ay4,
              bx1, by1, bx2, by2, bx3, by3, bx4, by4);
          }
          if(res) {
            if(len2 === 2) {
              sliceLineSeg(polyB, j, res, false);
            }
            else {
              sliceBezierSeg(polyB, j, res, len2 === 3);
            }
            let an = sliceBezierSeg(polyA, i, res, len2 !== 3);
            coordsA = an.coords;
            len1 = coordsA.length;
            bboxA = an.bbox;
            [ax1, ay1] = coordsA[0];
            [ax2, ay2] = coordsA[1];
            [ax3, ay3] = coordsA[2];
            [ax4, ay4] = coordsA[3];
            j += res.length;
            lenA += res.length;
            lenB += res.length;
          }
        }
      }
    }
  }
}

function sliceLineSeg(poly, i, inters, isSource) {
  // 需要按顺序来，交点百分比
  inters.sort(function(a, b) {
    if(isSource) {
      return a.toSource - b.toSource;
    }
    return a.toClip - b.toClip;
  });
  let seg = poly[i], coords = seg.coords;
  let [lastX, lastY] = coords[0];
  inters.forEach((item, index) => {
    poly.splice(i + index, 0, convert2Segment([
      [lastX, lastY],
      item.coords,
    ]));
    [lastX, lastY] = item.coords;
  });
  coords[0] = [lastX, lastY];
  seg.bbox = bezier.bboxBezier(coords);
  return poly[i];
}

function sliceBezierSeg(poly, i, inters, isSource) {
  // 需要按顺序来，t从小到大
  inters.sort(function(a, b) {
    if(isSource) {
      return a.toSource - b.toSource;
    }
    return a.toClip - b.toClip;
  });
  let seg = poly[i], coords = seg.coords, len = coords.length;
  // 从i处开始依次插入截取曲线，原始曲线作为最后一段截取曲线只修改数据
  let [lastX, lastY] = coords[0], start = 0;
  inters.forEach((item, index) => {
    let c = bezier.sliceBezier2Both(coords, start, item.toSource);
    c[0][0] = lastX; // 防止误差首尾交点一致
    c[0][1] = lastY;
    poly.splice(i + index, 0, convert2Segment(c));
    if(len === 3) {
      [lastX, lastY] = c[2];
    }
    else if(len === 4) {
      [lastX, lastY] = c[3];
    }
    start = item.toSource;
  });
  // 最后一截只需改点数据
  let c = bezier.sliceBezier2Both(coords, start, 1);
  coords[0] = [lastX, lastY];
  coords[1] = c[1];
  if(len === 4) {
    coords[2] = c[2];
  }
  seg.bbox = bezier.bboxBezier(coords);
  return poly[i];
}

function convert2Segment(coords) {
  return {
    coords,
    bbox: bezier.bboxBezier(coords),
  };
}

function convert2Poly(list) {
  if(!list) {
    return;
  }
  let len = list.length;
  if(!list.length || len < 3) {
    return;
  }
  let [x, y] = list[0];
  let res = [];
  for(let i = 1; i < len; i++) {
    let curr = list[i];
    if(curr.length === 2) {
      res.push(convert2Segment([
        [x, y],
        [curr[0], curr[1]]
      ]));
      [x, y] = curr;
    }
    else if(curr.length === 4) {
      res.push(convert2Segment([
        [x, y],
        [curr[0], curr[1]],
        [curr[2], curr[3]]
      ]));
      x = curr[2];
      y = curr[3];
    }
    else if(curr.length === 6) {
      res.push(convert2Segment([
        [x, y],
        [curr[0], curr[1]],
        [curr[2], curr[3]],
        [curr[4], curr[5]]
      ]));
      x = curr[4];
      y = curr[5];
    }
  }
  return res;
}

// 根据曲线长度将其分割为细小的曲线段，每个曲线段可近似认为是直线段，从而参与布尔运算
function convertCurve2Line(poly) {
  for(let i = poly.length - 1; i >= 0; i--) {
    let seg = poly[i], coords = seg.coords, len = coords.length;
    if(len >= 3) {
      let l = bezier.bezierLength(coords);
      // 每2个px长度分割
      let n = Math.ceil(l * 0.5);
      if(n > 1) {
        let per = 1 / n;
        let [lastX, lastY] = coords[0];
        for(let j = 0; j < n - 1; j++) {
          let c = bezier.sliceBezier2Both(coords, per * j, per * (j + 1));
          c[0][0] = lastX;
          c[0][1] = lastY;
          if(len === 3) {
            [lastX, lastY] = c[2];
          }
          else {
            [lastX, lastY] = c[3];
          }
          let nc = convert2Segment(c);
          poly.splice(i + j, 0, nc);
        }
        let c = bezier.sliceBezier2Both(coords, per * (n - 1), 1);
        coords[0][0] = lastX;
        coords[0][1] = lastY;
        coords[1] = c[1];
        if(len === 4) {
          coords[1] = c[2];
        }
      }
    }
  }
}

// 将每段曲线从中间1分为2，前半部插入原来位置之前，原始曲线数据修改为后半部
// function sliceCurveFromMiddle(poly) {
//   for(let i = poly.length - 1; i >= 0; i--) {
//     let seg = poly[i], coords = seg.coords;
//     if(coords.length >= 3) {
//       let c1 = bezier.sliceBezier(coords, 0.5);
//       c1[0] = coords[0];
//       let nc = convert2Segment(c1);
//       poly.splice(i, 0, nc);
//       let c2 = bezier.sliceBezier2Both(coords, 0.5, 1);
//       if(coords.length === 3) {
//         coords[0] = c1[2];
//         coords[1] = c2[1];
//       }
//       if(coords.length === 4) {
//         coords[0] = c1[3];
//         coords[1] = c2[1];
//         coords[2] = c2[2];
//       }
//       seg.bbox = bezier.bboxBezier(coords);
//     }
//   }
// }
//
// function checkEachCurve(polyA, polyB) {
//   for(let i = polyA.length - 1; i >= 0; i--) {
//     let segA = polyA[i], coordsA = segA.coords, bboxA = segA.bbox;
//     // 只看a的曲线，和b的所有，相交则a从中间1分为2，依旧前半部插入原始位置前，后半部修改原始曲线数据
//     if(coordsA.length === 3) {
//       let [ax1, ay1] = coordsA[0], [ax2, ay2] = coordsA[1], [ax3, ay3] = coordsA[2];
//       for(let j = 0, len = polyB.length; j < len; j++) {
//         let segB = polyB[i], coordsB = segB.coords, bboxB = segB.bbox;
//         if(geom.isRectsOverlap(bboxA, bboxB)) {
//           let [bx1, by1] = coordsB[0], [bx2, by2] = coordsB[1];
//           let res;
//           if(coordsB.length === 2) {
//             res = getIntersectionBezier2Line(ax1, ay1, ax2, ay2, ax3, ay3,
//               bx1, by1, bx2, by2);
//           }
//           else if(coordsB.length === 3) {
//             let [bx3, by3] = coordsB[2];
//             res = getIntersectionBezier2Bezier2(ax1, ay1, ax2, ay2, ax3, ay3,
//               bx1, by1, bx2, by2, bx3, by3);
//           }
//           else if(coordsB.length === 4) {
//             let [bx3, by3] = coordsB[2], [bx4, by4] = coordsB[3];
//             res = getIntersectionBezier2Bezier3(ax1, ay1, ax2, ay2, ax3, ay3,
//               bx1, by1, bx2, by2, bx3, by3, bx4, by4);
//           }
//           if(res) {
//             let c1 = bezier.sliceBezier(coordsA, 0.5);
//             c1[0] = coordsA[0];
//             let nc = convert2Segment(c1);
//             polyA.splice(i, 0, nc);
//             let c2 = bezier.sliceBezier2Both(coordsA, 0.5, 1);
//             coordsA[0] = c1[2];
//             coordsA[1] = c2[1];
//             segA.bbox = bboxA = bezier.bboxBezier(coordsA);
//             i++;
//           }
//         }
//       }
//     }
//     else if(coordsA.length === 4) {
//       let [ax1, ay1] = coordsA[0], [ax2, ay2] = coordsA[1], [ax3, ay3] = coordsA[2], [ax4, ay4] = coordsA[3];
//       for(let j = 0, len = polyB.length; j < len; j++) {
//         let segB = polyB[i], coordsB = segB.coords, bboxB = segB.bbox;
//         if(geom.isRectsOverlap(bboxA, bboxB)) {
//           let [bx1, by1] = coordsB[0], [bx2, by2] = coordsB[1];
//           let res;
//           if(coordsB.length === 2) {
//             res = getIntersectionBezier3Line(ax1, ay1, ax2, ay2, ax3, ay3, ax4, ay4,
//               bx1, by1, bx2, by2);
//           }
//           else if(coordsB.length === 3) {
//             let [bx3, by3] = coordsB[2];
//             res = getIntersectionBezier2Bezier3(bx1, by1, bx2, by2, bx3, by3,
//               ax1, ay1, ax2, ay2, ax3, ay3, ax4, ay4);
//           }
//           else if(coordsB.length === 4) {
//             let [bx3, by3] = coordsB[2], [bx4, by4] = coordsB[3];
//             res = getIntersectionBezier3Bezier3(ax1, ay1, ax2, ay2, ax3, ay3, ax4, ay4,
//               bx1, by1, bx2, by2, bx3, by3, bx4, by4);
//           }
//           if(res) {
//             let c1 = bezier.sliceBezier(coordsA, 0.5);
//             c1[0] = coordsA[0];
//             let nc = convert2Segment(c1);
//             polyA.splice(i, 0, nc);
//             let c2 = bezier.sliceBezier2Both(coordsA, 0.5, 1);
//             coordsA[0] = c1[2];
//             coordsA[1] = c2[1];
//             segA.bbox = bboxA = bezier.bboxBezier(coordsA);
//             i++;
//           }
//         }
//       }
//     }
//   }
// }

class Polygon extends Polyline {
  constructor(tagName, props) {
    super(tagName, props);
    if(props.booleanOperations) {
      this.__booleanOperations = props.booleanOperations;
    }
  }

  __getPoints(originX, originY, width, height, points, isControl) {
    let res = super.__getPoints(originX, originY, width, height, points, isControl);
    if(!isControl) {
      res.push(res[0]);
    }
    return res;
  }

  // 布尔运算覆盖，仅multi才发生，因为需要多个多边形数据
  __reprocessing(list, isMulti) {
    if(!isMulti || list.length < 2) {
      return list;
    }
    let bo = this.booleanOperations, len = list.length;
    if(!Array.isArray(bo) && bo) {
      let old = bo;
      bo = [bo];
      for(let i = 1; i < len - 1; i++) {
        bo.push(old);
      }
    }
    if(Array.isArray(bo) && bo.length) {
      let res = [convert2Poly(list[0])]; // 第一条线为基础，此后所有结果存入res，res中每个多边形都和当前发生对应布尔运算
      for(let i = 1; i < len; i++) {
        // res中每个多边形都和当前新的多边形发生布尔运算，所以新的要和res中每个求交点并切割，再存入res
        let polyB = convert2Poly(list[i]);
        if(polyB) {
          res.forEach(polyA => {
            if(polyA) {
              slicePolygonsUnIntersected(polyA, polyB);
            }
            res.push(polyB);
          });
        }
        else {
          res.push(null);
        }
      }
      // 现在res中是每个多边形边互不相交的结果，再将每条曲线直线化，方便后续模拟布尔运算
      res.forEach(poly => {
        if(poly) {
          convertCurve2Line(poly);
        }
      });
      // 取每段的开始顶点，如果是曲线，附加前面的控制坐标引用等布尔运算结束后还原
      let nList = res.map(poly => {
        if(!poly) {
          return;
        }
        let temp = poly.map(seg => seg.coords[0]);
        // 添加闭环
        temp.push(poly[0].coords[0]);
        return temp;
      });
      // 输出结果，依旧是前面的每个多边形都和新的进行布尔运算
      let res2 = [];
      if(nList[0] && nList[0].length > 1) {
        res2.push(nList[0]);
      }
      for(let i = 1; i < len; i++) {
        let op = (bo[i - 1] || '').toString().toLowerCase();
        let cur = nList[i];
        if(!cur) {
          continue;
        }
        if(['intersection', 'union', 'diff', 'xor'].indexOf(op) === -1 || !res2.length) {
          res2.push(cur);
          continue;
        }
        switch(op) {
          case 'intersection':
            let r1 = intersection(res2, [cur]);
            if(r1) {
              r1.forEach(item => {
                res2 = item;
              });
            }
            else {
              res2 = [];
            }
            break;
          case 'union':
            let r2 = union(res2, [cur]);
            if(r2) {
              r2.forEach(item => {
                res2 = item;
              });
            }
            else {
              res2 = [];
            }
            break;
          case 'diff':
            let r3 = diff(res2, [cur]);
            if(r3) {
              r3.forEach(item => {
                res2 = item;
              });
            }
            else {
              res2 = [];
            }
            break;
          case 'xor':
            let r4 = xor(res2, [cur]);
            if(r4) {
              r4.forEach(item => {
                res2 = item;
              });
            }
            else {
              res2 = [];
            }
            break;
        }
      }
      return res2;
    }
    return list;
  }

  // 覆盖，当booleanOperations动画改变时刷新顶点缓存
  __needRebuildSE(__cacheProps) {
    if(util.isNil(__cacheProps.booleanOperations)) {
      __cacheProps.booleanOperations = true;
      return true;
    }
  }

  get booleanOperations() {
    return this.getProps('booleanOperations');
  }
}

export default Polygon;
