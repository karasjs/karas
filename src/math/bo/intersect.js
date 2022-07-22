import Point from './Point';
import isec from '../isec';
import bezier from '../bezier';

const EPS = 1e-9;
const EPS2 = 1 - (1e-9);

function getIntersectionLineLine(ax1, ay1, ax2, ay2, bx1, by1, bx2, by2, d) {
  let toSource = (
    (bx2 - bx1) * (ay1 - by1) - (by2 - by1) * (ax1 - bx1)
  ) / d;
  let toClip = (
    (ax2 - ax1) * (ay1 - by1) - (ay2 - ay1) * (ax1 - bx1)
  ) / d;
  // 非顶点相交才是真相交
  if(toSource > EPS && toSource < EPS2 && toClip > EPS && toClip < EPS2) {
    let ox = ax1 + toSource * (ax2 - ax1);
    let oy = ay1 + toSource * (ay2 - ay1);
    return [{
      point: new Point(ox, oy),
      toSource,
      toClip,
    }];
  }
}

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
      if(item.t > EPS && item.t < EPS2 && toClip > EPS && toClip < EPS2) {
        // 还要判断斜率，相等也忽略（小于一定误差）
        let k1 = bezier.bezierSlope([
          [ax1, ay1],
          [ax2, ay2],
          [ax3, ay3],
        ], item.t);
        let k2 = bezier.bezierSlope([[bx1, by1], [bx2, by2]]);
        // 忽略方向，180°也是平行，Infinity相减为NaN
        if(Math.abs((Math.abs(k1) - Math.abs(k2)) || 0) < EPS) {
          return;
        }
        return {
          point: new Point(item.x, item.y),
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
        if(item.t > EPS && item.t < EPS2 && toClip > EPS && toClip < EPS2) {
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
          if(Math.abs((Math.abs(k1) - Math.abs(k2)) || 0) < EPS) {
            return;
          }
          return {
            point: new Point(item.x, item.y),
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
        if(item.t > EPS && item.t < EPS2 && toClip > EPS && toClip < EPS2) {
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
          if(Math.abs((Math.abs(k1) - Math.abs(k2)) || 0) < EPS) {
            return;
          }
          return {
            point: new Point(item.x, item.y),
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
      if(item.t > EPS && item.t < EPS2 && toClip > EPS && toClip < EPS2) {
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
        ]);
        // 忽略方向，180°也是平行，Infinity相减为NaN
        if(Math.abs((Math.abs(k1) - Math.abs(k2)) || 0) < EPS) {
          return;
        }
        return {
          point: new Point(item.x, item.y),
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
        if(item.t > EPS && item.t < EPS2 && toClip > EPS && toClip < EPS2) {
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
          if(Math.abs((Math.abs(k1) - Math.abs(k2)) || 0) < EPS) {
            return;
          }
          return {
            point: new Point(item.x, item.y),
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

// 两条线可能多个交点，将交点按原本线段的方向顺序排序
function sortIntersection(res, isSource) {
  return res.sort(function(a, b) {
    if(isSource) {
      return a.toSource - b.toSource;
    }
    return a.toClip - b.toClip;
  }).map(item => {
    return {
      point: item.point,
      t: isSource ? item.toSource : item.toClip,
    };
  }).filter(item => item.t > EPS && item.t < EPS2);
}

export default {
  getIntersectionLineLine,
  getIntersectionBezier2Line,
  getIntersectionBezier2Bezier2,
  getIntersectionBezier2Bezier3,
  getIntersectionBezier3Line,
  getIntersectionBezier3Bezier3,
  sortIntersection,
};
