import geom from '../geom';
import vector from '../vector';
import bezier from '../bezier';
import equation from '../equation';
import Point from './Point';
import Segment from './Segment';
import intersect from './intersect';

const {
  getIntersectionLineLine,
  getIntersectionBezier2Line,
  getIntersectionBezier2Bezier2,
  getIntersectionBezier2Bezier3,
  getIntersectionBezier3Line,
  getIntersectionBezier3Bezier3,
  sortIntersection,
} = intersect;

class Polygon {
  constructor(regions, index) {
    this.index = index; // 属于source多边形还是clip多边形，0和1区别
    let segments = [];
    // 多边形有>=1个区域，一般是1个
    if(!Array.isArray(regions)) {
      return;
    }
    regions.forEach(vertices => {
      // 每个区域有>=2条线段，组成封闭区域，1条肯定不行，2条必须是曲线
      if(!Array.isArray(vertices) || vertices.length < 2) {
        return;
      }
      if(vertices.length === 2 && vertices[1].length <= 2) {
        return;
      }
      let startPoint = new Point(vertices[0]), firstPoint = startPoint;
      // 根据多边形有向边，生成线段，不保持原有向，统一左下作为线段起点，如果翻转则记录个值标明
      for(let i = 1, len = vertices.length; i < len; i++) {
        let curr = vertices[i], l = curr.length;
        // 闭合区域，首尾顶点重复统一
        let endPoint = (i === len - 1) ? firstPoint : new Point(curr[l - 2], curr[l - 1]);
        let seg;
        if(l === 2) {
          let coords = Point.compare(startPoint, endPoint) ? [
            endPoint,
            startPoint,
          ] : [
            startPoint,
            endPoint,
          ];
          seg = new Segment(coords, index);
        }
        // 曲线需确保x单调性，如果非单调，则切割为单调的多条
        else if(l === 4) {
          let cPoint = new Point(curr[0], curr[1]);
          let t = getBezierMonotonicity([startPoint, cPoint, endPoint], true);
          if(t) {
            let points = [
              [startPoint.x, startPoint.y],
              [curr[0], curr[1]],
              [endPoint.x, endPoint.y],
            ];
            let curve1 = bezier.sliceBezier(points, t[0]);
            let curve2 = bezier.sliceBezier2Both(points, t[0], 1);
            let p1 = new Point(curve1[1]), p2 = new Point(curve1[2]), p3 = new Point(curve2[1]);
            let coords = Point.compare(startPoint, p2) ? [
              p2,
              p1,
              startPoint,
            ] : [
              startPoint,
              p1,
              p2,
            ];
            segments.push(new Segment(coords, index));
            coords = Point.compare(p2, endPoint) ? [
              endPoint,
              p3,
              p2,
            ] : [
              p2,
              p3,
              endPoint,
            ];
            seg = new Segment(coords, index);
          }
          else {
            let coords = Point.compare(startPoint, endPoint) ? [
              endPoint,
              cPoint,
              startPoint,
            ] : [
              startPoint,
              cPoint,
              endPoint,
            ];
            seg = new Segment(coords, index);
          }
        }
        // 3阶可能有2个单调改变t点
        else if(l === 6) {
          let cPoint1 = new Point(curr[0], curr[1]), cPoint2 = new Point(curr[2], curr[3]);
          let t = getBezierMonotonicity([startPoint, cPoint1, cPoint2, endPoint], true);
          if(t) {
            let points = [
              [startPoint.x, startPoint.y],
              [curr[0], curr[1]],
              [curr[2], curr[3]],
              [endPoint.x, endPoint.y],
            ];
            let lastPoint = startPoint, lastT = 0;
            t.forEach(t => {
              let curve = bezier.sliceBezier2Both(points, lastT, t);
              let p1 = new Point(curve[1]), p2 = new Point(curve[2]), p3 = new Point(curve[3]);
              let coords = Point.compare(lastPoint, p3) ? [
                p3,
                p2,
                p1,
                lastPoint,
              ] : [
                lastPoint,
                p1,
                p2,
                p3,
              ];
              segments.push(new Segment(coords, index));
              lastT = t;
              lastPoint = p3;
            });
            let curve = bezier.sliceBezier2Both(points, lastT, 1);
            let p1 = new Point(curve[1]), p2 = new Point(curve[2]);
            let coords = Point.compare(lastPoint, endPoint) ? [
              endPoint,
              p2,
              p1,
              lastPoint,
            ] : [
              lastPoint,
              p1,
              p2,
              endPoint,
            ];
            seg = new Segment(coords, index);
          }
          else {
            let coords = Point.compare(startPoint, endPoint) ? [
              endPoint,
              cPoint2,
              cPoint1,
              startPoint,
            ] : [
              startPoint,
              cPoint1,
              cPoint2,
              endPoint,
            ];
            seg = new Segment(coords, index);
          }
        }
        segments.push(seg);
        // 终点是下条边的起点
        startPoint = endPoint;
      }
    });
    this.segments = segments;
  }

  // 根据y坐标排序，生成有序线段列表，再扫描求交
  selfIntersect() {
    let list = genHashXList(this.segments);
    this.segments = findIntersection(list, false, false, false);
  }

  toString() {
    return this.segments.map(item => item.toString());
  }

  reset(index) {
    this.index = index;
    this.segments.forEach(seg => {
      seg.belong = index;
      seg.otherCoincide = 0;
      seg.otherFill[0] = seg.otherFill[1] = false;
    });
  }

  // 2个非自交的多边形互相判断相交，依旧是扫描线算法，2个多边形统一y排序，但要分别出属于哪个多边形，因为只和对方测试相交
  static intersect2(polyA, polyB, isIntermediateA, isIntermediateB) {
    if(!polyA.segments.length || !polyB.segments.length) {
      return;
    }

    let list = genHashXList(polyA.segments.concat(polyB.segments));
    let segments = findIntersection(list, true, isIntermediateA, isIntermediateB);
    polyA.segments = segments.filter(item => item.belong === 0);
    polyB.segments = segments.filter(item => item.belong === 1);
  }

  /**
   * 以Bentley-Ottmann算法为原理，为每个顶点设计事件，按x升序、y升序遍历所有顶点的事件
   * 每条线段边有2个顶点即2个事件，左下为start，右上为end
   * 同顶点优先end，start相同则对比线段谁后面的y更小（向量法），其实就是对比非共点部分的y大小
   * 维护一个活跃边列表ael，同样保证x升序、y升序，start事件线段进入ael，end离开
   * ael中相邻的线段说明上下相互接壤，接壤一侧则内外填充性一致
   * 最下面的边（含第一条）可直接得知下方填充性（下面没有了一定是多边形外部），再推测出上方
   * 其余的边根据自己下方相邻即可确定填充性
   */
  static annotate2(polyA, polyB, isIntermediateA, isIntermediateB) {
    let list = genHashXYList(polyA.segments.concat(polyB.segments));
    let aelA = [], aelB = [], hashA = {}, hashB = {};
    // 算法3遍循环，先注释a多边形的边自己内外性，再b的边自己内外性，最后一起注释对方的内外性
    // 因数据结构合在一起，所以2遍循环可以完成，先注释a和b的自己，再一遍对方
    list.forEach(item => {
      let { isStart, seg } = item;
      let belong = seg.belong;
      // 连续操作时，已有的中间结果可以跳过
      if(belong === 0 && isIntermediateA || belong === 1 && isIntermediateB) {
        return;
      }
      let ael = belong === 0 ? aelA : aelB, hash = belong === 0 ? hashA : hashB;
      if(isStart) {
        // 自己重合的线段只考虑第一条，其它剔除
        if(seg.myCoincide) {
          let hc = seg.toHash();
          if(hash.hasOwnProperty(hc)) {
            return;
          }
          hash[hc] = true;
        }
        // console.error(seg.toString(), ael.length)
        // 下面没有线段了，底部边，上方填充下方空白（除非是偶次重复段，上下都空白，奇次和单线相同）
        if(!ael.length) {
          if(seg.myCoincide) {
            seg.myFill[0] = seg.myCoincide % 2 === 0;
          }
          else {
            seg.myFill[0] = true;
          }
          ael.push(seg);
        }
        else {
          // 插入到ael正确的位置，按照x升序、y升序
          let len = ael.length, top = ael[len - 1];
          let isAboveLast = segAboveCompare(seg, top);
          // 比ael栈顶还高在最上方
          if(isAboveLast) {
            seg.myFill[1] = top.myFill[0];
            if(seg.myCoincide) {
              seg.myFill[0] = seg.myCoincide % 2 === 0 ? !seg.myFill[1] : seg.myFill[1];
            }
            else {
              seg.myFill[0] = !seg.myFill[1];
            }
            ael.push(seg);
          }
          // 不高且只有1个则在最下方
          else if(len === 1) {
            if(seg.myCoincide) {
              seg.myFill[0] = seg.myCoincide % 2 === 0;
            }
            else {
              seg.myFill[0] = true;
            }
            ael.unshift(seg);
          }
          else {
            // 遍历，尝试对比是否在ael栈中相邻2条线段之间
            for(let i = len - 2; i >= 0; i--) {
              let curr = ael[i];
              let isAbove = segAboveCompare(seg, curr);
              if(isAbove) {
                seg.myFill[1] = curr.myFill[0];
                if(seg.myCoincide) {
                  seg.myFill[0] = seg.myCoincide % 2 === 0 ? !seg.myFill[1] : seg.myFill[1];
                }
                else {
                  seg.myFill[0] = !seg.myFill[1];
                }
                ael.splice(i + 1, 0, seg);
                break;
              }
              else if(i === 0) {
                if(seg.myCoincide) {
                  seg.myFill[0] = seg.myCoincide % 2 === 0;
                }
                else {
                  seg.myFill[0] = true;
                }
                ael.unshift(seg);
              }
            }
          }
        }
        // console.warn(seg.toString())
      }
      else {
        let i = ael.indexOf(seg);
        // 一般肯定有，重合线段会剔除不进ael
        if(i > -1) {
          ael.splice(i, 1);
        }
      }
    });
    // 注释对方，除了重合线直接使用双方各自的注释拼接，普通线两边的对方内外性相同，根据是否在里面inside确定结果
    // inside依旧看自己下方的线段上方情况，不同的是要看下方的线和自己belong是否相同，再确定取下方above的值
    let ael = [], hash = {};
    list.forEach(item => {
      let { isStart, seg } = item;
      let belong = seg.belong;
      if(isStart) {
        // 自重合或者它重合统一只保留第一条线
        if(seg.myCoincide || seg.otherCoincide) {
          let hc = seg.toHash();
          if(hash.hasOwnProperty(hc)) {
            return;
          }
          hash[hc] = true;
        }
        // console.error(seg.toString(), ael.length)
        let inside = false;
        if(!ael.length) {
          inside = false;
          ael.push(seg);
        }
        else {
          let len = ael.length, top = ael[len - 1];
          let isAboveLast = segAboveCompare(seg, top);
          if(isAboveLast) {
            if(top.belong === belong) {
              inside = top.otherFill[0];
            }
            else {
              inside = top.myFill[0];
            }
            ael.push(seg);
          }
          else if(len === 1) {
            // inside = false;
            ael.unshift(seg);
          }
          else {
            for(let i = len - 2; i >= 0; i--) {
              let curr = ael[i];
              let isAbove = segAboveCompare(seg, curr);
              if(isAbove) {
                // 如果在自己的下方线和自己同色，则取下方线的另外色上填充
                if(curr.belong === belong) {
                  inside = curr.otherFill[0];
                }
                // 否则取下方线的下方色上填充
                else {
                  inside = curr.myFill[0];
                }
                ael.splice(i + 1, 0, seg);
                break;
              }
              else if(i === 0) {
                // inside = false;
                ael.unshift(seg);
              }
            }
          }
        }
        // 重合线的otherFill直接引用指向对方myFill，不能普通计算
        if(!seg.otherCoincide) {
          seg.otherFill[0] = inside;
          seg.otherFill[1] = inside;
        }
        // console.warn(seg.toString(), inside)
      }
      else {
        let i = ael.indexOf(seg);
        if(i > -1) {
          ael.splice(i, 1);
        }
      }
    });
  }
}

function findIntersection(list, compareBelong, isIntermediateA, isIntermediateB) {
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
        // console.warn(x, seg.toString());
        // console.log(ael.map(item => item.toString()));
        // 可能是垂线不能立刻删除，所以等到下次活动x再删除，因为会出现极端情况刚进来就出去，和后面同y的重合
        if(bboxA[0] !== bboxA[2] || seg.coords.length !== 2) {
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
        // console.log(ael.map(item => item.toString()));
      }
      // 第1次访问边一定是进入活动，求交
      else {
        // console.error(x, seg.toString(), ael.length);
        // console.log(ael.map(item => item.toString()));
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
            // 互交所属belong不同才进行检测，自交则不检查belong
            if(compareBelong && item.belong === belong) {
              continue;
            }
            // bbox相交才考虑真正计算，加速
            let bboxB = item.bbox, coordsB = item.coords, lenB = coordsB.length;
            let isSourceReverted = false; // 求交可能a、b线主从互换
            if(isRectsOverlap(bboxA, bboxB, lenA, lenB)) {
              // 完全重合简化，同矩形的线myFill共享，对方矩形互换otherFill
              if(lenA === lenB && seg.equal(item)) {
                if(compareBelong) {
                  // 因为一定不自交，所以重合线不会被分割
                  seg.otherCoincide++;
                  item.otherCoincide++;
                  seg.otherFill = item.myFill;
                  item.otherFill = seg.myFill;
                }
                else {
                  seg.myCoincide++;
                  item.myCoincide++;
                  seg.myFill = item.myFill;
                }
                continue;
              }
              let { x: bx1, y: by1 } = coordsB[0];
              let { x: bx2, y: by2 } = coordsB[1];
              let inters, overs;
              // a是直线
              if(lenA === 2) {
                // b是直线
                if(lenB === 2) {
                  let d = (by2 - by1) * (ax2 - ax1) - (bx2 - bx1) * (ay2 - ay1);
                  // 平行检查是否重合，否则求交
                  if(d === 0) {
                    // 垂线特殊，y=kx+b没法求
                    if(ax1 === ax2) {
                      if(ax1 === bx1 && ax2 === bx2) {
                        overs = checkOverlapLine(ax1, ay1, ax2, ay2, seg,
                          bx1, by1, bx2, by2, item, true);
                      }
                    }
                    else {
                      let b1 = (ay2 - ay1) * ax1 / (ax2 - ax1) + ay1;
                      let b2 = (by2 - by1) * bx1 / (bx2 - bx1) + by1;
                      if(b1 === b2) {
                        overs = checkOverlapLine(ax1, ay1, ax2, ay2, seg,
                          bx1, by1, bx2, by2, item, false);
                      }
                    }
                  }
                  else {
                    inters = getIntersectionLineLine(ax1, ay1, ax2, ay2,
                      bx1, by1, bx2, by2, d);
                  }
                }
                // b是曲线
                else {
                  let { x: bx3, y: by3 } = coordsB[2];
                  // b是2阶曲线
                  if(lenB === 3) {
                    inters = getIntersectionBezier2Line(bx1, by1, bx2, by2, bx3, by3,
                      ax1, ay1, ax2, ay2);
                    isSourceReverted = true;
                  }
                  // b是3阶曲线
                  else {
                    let { x: bx4, y: by4 } = coordsB[3];
                    inters = getIntersectionBezier3Line(bx1, by1, bx2, by2, bx3, by3, bx4, by4,
                      ax1, ay1, ax2, ay2);
                    isSourceReverted = true;
                  }
                }
              }
              // a是曲线
              else {
                let { x: ax3, y: ay3 } = coordsA[2];
                // a是2阶曲线
                if(lenA === 3) {
                  // b是直线
                  if(lenB === 2) {
                    inters = getIntersectionBezier2Line(ax1, ay1, ax2, ay2, ax3, ay3,
                      bx1, by1, bx2, by2);
                  }
                  // b是曲线
                  else {
                    let { x: bx3, y: by3 } = coordsB[2];
                    // b是2阶曲线
                    if(lenB === 3) {
                      inters = getIntersectionBezier2Bezier2(ax1, ay1, ax2, ay2, ax3, ay3,
                        bx1, by1, bx2, by2, bx3, by3);
                      if(!inters) {
                        overs = checkOverlapBezier2(ax1, ay1, ax2, ay2, ax3, ay3, seg,
                          bx1, by1, bx2, by2, bx3, by3, item);
                      }
                    }
                    // b是3阶曲线
                    else {
                      let { x: bx4, y: by4 } = coordsB[3];
                      inters = getIntersectionBezier2Bezier3(ax1, ay1, ax2, ay2, ax3, ay3,
                        bx1, by1, bx2, by2, bx3, by3, bx4, by4);
                    }
                  }
                }
                // a是3阶曲线
                else {
                  let { x: ax4, y: ay4 } = coordsA[3];
                  // b是直线
                  if(lenB === 2) {
                    inters = getIntersectionBezier3Line(ax1, ay1, ax2, ay2, ax3, ay3, ax4, ay4,
                      bx1, by1, bx2, by2);
                  }
                  // b是曲线
                  else {
                    let { x: bx3, y: by3 } = coordsB[2];
                    // b是2阶曲线
                    if(lenB === 3) {
                      inters = getIntersectionBezier2Bezier3(bx1, by1, bx2, by2, bx3, by3,
                        ax1, ay1, ax2, ay2, ax3, ay3, ax4, ay4);
                      isSourceReverted = true;
                    }
                    // b是3阶曲线
                    else {
                      let { x: bx4, y: by4 } = coordsB[3];
                      inters = getIntersectionBezier3Bezier3(ax1, ay1, ax2, ay2, ax3, ay3, ax4, ay4,
                        bx1, by1, bx2, by2, bx3, by3, bx4, by4);
                    }
                  }
                }
              }
              // 有重合的，重合线段已经求好，直接使用
              if(overs) {
                activeNewSeg(segments, list, ael, x, overs.ra);
                activeNewSeg(segments, list, ael, x, overs.rb);
                seg.isDeleted = item.isDeleted = true;
                ael.splice(i, 1);
                break;
              }
              // 有交点，确保原先线段方向顺序（x升序、y升序），各自依次切割，x右侧新线段也要存入list
              else if(inters && inters.length) {
                // console.log('inters', i, inters);
                let pa = sortIntersection(inters, !isSourceReverted);
                // console.log(pa);
                let ra = sliceSegment(seg, pa, isIntermediateA && belong === 0);
                // console.log(ra.map(item => item.toString()));
                let pb = sortIntersection(inters, isSourceReverted);
                // console.log(pb);
                let rb = sliceSegment(item, pb, isIntermediateB && belong === 1);
                // console.log(rb.map(item => item.toString()));
                // 新切割的线段继续按照坐标存入列表以及ael，为后续求交
                activeNewSeg(segments, list, ael, x, ra);
                activeNewSeg(segments, list, ael, x, rb);
                // 老的线段被删除无效了，踢出ael，防止seg没被分割
                if(rb.length) {
                  ael.splice(i, 1);
                }
                // 检查切割的a/b之中是否有重合的线段，合并，互相把otherFill引用给对方
                // 可能会出现start或end共点，这时pa或pb有一个为空，重合变成其中一个子切割和另外一个完全重合
                for(let i = ra.length - 1; i >= 0; i--) {
                  let a = ra[i];
                  for(let j = rb.length - 1; j >= 0; j--) {
                    let b = rb[j];
                    if(a.equal(b)) {
                      a.otherCoincide++;
                      b.otherCoincide++;
                      a.otherFill = b.myFill;
                      b.otherFill = a.myFill;
                    }
                  }
                }
                break;
              }
            }
          }
        }
        // 不相交切割才进入ael
        if(!seg.isDeleted) {
          ael.push(seg);
          seg.isVisited = true;
        }
        // console.log(ael.map(item => item.toString()));
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

// 给定交点列表分割线段，ps需排好顺序从头到尾，isSelf标明是否自相交阶段，false是和对方交点切割
function sliceSegment(seg, ps, isIntermediate) {
  let res = [];
  if(!ps.length) {
    return res;
  }
  let belong = seg.belong, coords = seg.coords, len = coords.length;
  let startPoint = coords[0];
  let lastT = 0;
  // 多个点可能截取多条，最后一条保留只修改数据，其它新生成
  ps.forEach(item => {
    let point = item.point, t = item.t;
    let ns;
    if(len === 2) {
      ns = new Segment([
        startPoint,
        point,
      ], belong);
    }
    else if(len === 3) {
      let c = bezier.sliceBezier2Both(coords.map(item => [item.x, item.y]), lastT, t);
      ns = new Segment([
        startPoint,
        new Point(c[1][0], c[1][1]),
        point,
      ], belong);
    }
    else if(len === 4) {
      let c = bezier.sliceBezier2Both(coords.map(item => [item.x, item.y]), lastT, t);
      ns = new Segment([
        startPoint,
        new Point(c[1][0], c[1][1]),
        new Point(c[2][0], c[2][1]),
        point,
      ], belong);
    }
    // 连续操作的中间结果已有自己内外性，截取时需继承
    if(isIntermediate) {
      ns.myFill[0] = seg.myFill[0];
      ns.myFill[1] = seg.myFill[1];
    }
    startPoint = point;
    res.push(ns);
    lastT = t;
  });
  // 最后一条
  let ns;
  if(len === 2) {
    ns = new Segment([
      startPoint,
      coords[1],
    ], belong);
  }
  else if(len === 3) {
    let c = bezier.sliceBezier2Both(coords.map(item => [item.x, item.y]), lastT, 1);
    ns = new Segment([
      startPoint,
      new Point(c[1][0], c[1][1]),
      coords[2],
    ], belong);
  }
  else if(len === 4) {
    let c = bezier.sliceBezier2Both(coords.map(item => [item.x, item.y]), lastT, 1);
    ns = new Segment([
      startPoint,
      new Point(c[1][0], c[1][1]),
      new Point(c[2][0], c[2][1]),
      coords[3],
    ], belong);
  }
  if(isIntermediate) {
    ns.myFill[0] = seg.myFill[0];
    ns.myFill[1] = seg.myFill[1];
  }
  res.push(ns);
  // 老的打标失效删除
  seg.isDeleted = true;
  return res;
}

// 相交的线段slice成多条后，老的删除，新的考虑添加进扫描列表和活动边列表，根据新的是否在范围内
function activeNewSeg(segments, list, ael, x, ns) {
  ns.forEach(seg => {
    let bbox = seg.bbox, x1 = bbox[0], x2 = bbox[2];
    // console.log(seg.toString(), x1, x2, x);
    // 活跃x之前无相交判断意义，除了竖线，出现活跃前只可能一方为竖线截断另一方的左边部分
    if(x2 <= x && x1 !== x2 && seg.coords.length !== 2) {
      segments.push(seg);
      return;
    }
    // 按顺序放在list的正确位置，可能x1已经过去不需要加入了，但要考虑ael
    let i = 0;
    if(x1 < x) {
      seg.isVisited = true;
      ael.push(seg);
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
    // x2一定会加入
    for(let len = list.length; i < len; i++) {
      let item = list[i];
      let lx = item.x;
      if(x2 === lx) {
        // 访问过的尽可能排在前面早出栈，减少对比次数
        item.arr.unshift(seg);
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

// 每个线段会放2次，开始点和结束点，哪怕x相同，第1次是开始用push，第2次结束unshift，这样离开时排在前面
function putHashX(hashX, x, seg) {
  let list = hashX[x] = hashX[x] || [];
  if(seg.isVisited) {
    list.unshift(seg);
    seg.isVisited = false;
  }
  else {
    list.push(seg);
    seg.isVisited = true;
  }
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
        // start点相同看谁在上谁在下，下方在前，比y极大值，因为start相同又不相交，所以上方的y极值更大
        if(a.isStart) {
          return segAboveCompare(a.seg, b.seg) ? 1 : -1;
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
  listX.sort(function(a, b) {
    return a.x - b.x;
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

// pt在线段left -> right的上方或线上
function pointAboveOrOnLine(pt, left, right) {
  let { x, y } = pt;
  let { x: x1, y: y1 } = left;
  let { x: x2, y: y2 } = right;
  return vector.crossProduct(x1 - x, y1 - y, x2 - x, y2 - y) >= 0;
}

// a是否在b的上边，取x相同部分看y大小，只有start点事件时才判断
function segAboveCompare(segA, segB) {
  let ca = segA.coords, cb = segB.coords;
  let la = ca.length, lb = cb.length;
  let a1 = ca[0], b1 = cb[0];
  // 两条直线用向量积判断，注意开始点是否相同即可
  if(la === 2 && lb === 2) {
    let a2 = ca[1], b2 = cb[1];
    if(a1.equal(b1)) {
      return pointAboveOrOnLine(a2, b1, b2);
    }
    else {
      return pointAboveOrOnLine(a1, b1, b2);
    }
  }
  // a是竖线的话看另一条在左还是右，左的话a在下，否则在上，因为此时只可能是左和a尾相连或右和a首相连
  if(la === 2 && a1.x === ca[1].x) {
    return b1.x >= a1.x;
  }
  // 如果有曲线，取二者x共同的区域部分[x1, x3]，以及区域中点x2，这3个点不可能都重合，一定会有某点的y比较大小
  let x1 = Math.max(a1.x, b1.x), x3 = Math.min(ca[la - 1].x, cb[lb - 1].x), x2 = x1 + (x3 - x1) * 0.5;
  if(a1 !== b1) {
    let y1 = getYByX(ca, x1), y2 = getYByX(cb, x1);
    if(y1 !== y2) {
      return y1 > y2;
    }
  }
  if(ca[la - 1] !== cb[lb - 1]) {
    let y1 = getYByX(ca, x3), y2 = getYByX(cb, x3);
    if(y1 !== y2) {
      return y1 > y2;
    }
  }
  let y1 = getYByX(ca, x2), y2 = getYByX(cb, x2);
  if(y1 !== y2) {
    return y1 > y2;
  }
}

// 获取曲线单调性t值，有结果才返回
function getBezierMonotonicity(coords, isX) {
  if(coords.length === 3) {
    let t = isX
      ? (coords[0].x - coords[1].x) / (coords[0].x - 2 * coords[1].x + coords[2].x)
      : (coords[0].y - coords[1].y) / (coords[0].y - 2 * coords[1].y + coords[2].y);
    if(t > 0 && t < 1) {
      return [t];
    }
  }
  else if(coords.length === 4) {
    let t = equation.getRoots([
      isX
        ? 3 * (coords[1].x - coords[0].x)
        : 3 * (coords[1].y - coords[0].y),
      isX
        ? 6 * (coords[2].x + coords[0].x - 2 * coords[1].x)
        : 6 * (coords[2].y + coords[0].y - 2 * coords[1].y),
      isX
        ? 3 * (coords[3].x + 3 * coords[1].x - coords[0].x - 3 * coords[2].x)
        : 3 * (coords[3].y + 3 * coords[1].y - coords[0].y - 3 * coords[2].y)
    ]).filter(i => i > 0 && i < 1);
    if(t.length) {
      return t.sort(function(a, b) {
        return a - b;
      });
    }
  }
}

// 根据x的值解得t后获取y，由于线段已经x单调，所以解只会有1个而非多个
function getYByX(coords, x) {
  let len = coords.length;
  if(x === coords[0].x) {
    return coords[0].y;
  }
  if(x === coords[len - 1].x) {
    return coords[len - 1].y;
  }
  if(len === 2) {
    if(coords[0].y === coords[1].y) {
      return coords[0].y;
    }
    let p = (x - coords[0].x) / (coords[1].x - coords[0].x);
    return coords[0].y + p * (coords[1].y - coords[0].y);
  }
  else if(len === 3) {
    let t = equation.getRoots([
      coords[0].x - x,
      2 * (coords[1].x - coords[0].x),
      coords[2].x + coords[0].x - 2 * coords[1].x,
    ]).filter(i => i >= 0 && i <= 1);
    let pts = coords.map(item => [item.x, item.y]);
    return bezier.pointAtByT(pts, t[0])[1];
  }
  else if(len === 4) {
    let t = equation.getRoots([
      coords[0].x - x,
      3 * (coords[1].x - coords[0].x),
      3 * (coords[2].x + coords[0].x - 2 * coords[1].x),
      coords[3].x + 3 * coords[1].x - coords[0].x - 3 * coords[2].x
    ]).filter(i => i >= 0 && i <= 1);
    let pts = coords.map(item => [item.x, item.y]);
    return bezier.pointAtByT(pts, t[0])[1];
  }
}

function isRectsOverlap(bboxA, bboxB, lenA, lenB) {
  if(lenA === 2 && lenB === 2) {
    // 2条垂线特殊考虑，此时x范围都是0，只能比较y
    if(bboxA[0] === bboxA[2] && bboxB[0] === bboxB[2] && bboxA[0] === bboxA[2]) {
      if(bboxA[1] >= bboxB[3] || bboxB[1] >= bboxA[3]) {
        return false;
      }
      return true;
    }
    // 2条水平线也是
    if(bboxA[1] === bboxA[3] && bboxB[1] === bboxB[3] && bboxA[1] === bboxA[1]) {
      if(bboxA[0] >= bboxB[2] || bboxB[0] >= bboxA[2]) {
        return false;
      }
      return true;
    }
  }
  return geom.isRectsOverlap(bboxA, bboxB);
}

function checkOverlapLine(ax1, ay1, ax2, ay2, segA,
                          bx1, by1, bx2, by2, segB, isY) {
  let ra = [], rb = [];
  let coordsA = segA.coords, coordsB = segB.coords;
  if(ax1 < bx1 && !isY || ay1 < by1 && isY) {
    ra.push(new Segment([
      coordsA[0],
      coordsB[0],
    ], segA.belong));
    if(ax2 < bx2 && !isY || ay2 < by2 && isY) {
      ra.push(new Segment([
        coordsB[0],
        coordsA[1],
      ], segA.belong));
      rb.push(new Segment([
        coordsB[0],
        coordsA[1],
      ], segB.belong));
      rb.push(new Segment([
        coordsA[1],
        coordsB[1],
      ], segB.belong));
    }
    else if(ax2 === bx2 && !isY || ay2 === by2 && isY) {
      ra.push(new Segment([
        coordsB[0],
        coordsB[1],
      ], segA.belong));
      rb.push(new Segment([
        coordsB[0],
        coordsB[1],
      ], segB.belong));
    }
    else {
      ra.push(new Segment([
        coordsB[0],
        coordsB[1],
      ], segA.belong));
      rb.push(new Segment([
        coordsB[0],
        coordsB[1],
      ], segB.belong));
      ra.push(new Segment([
        coordsB[1],
        coordsA[1],
      ], segA.belong));
    }
  }
  // 不会出现完全重合即ax2 == bx2
  else if(ax1 === bx1 && !isY || ay1 === by1 && isY) {
    if(ax2 < bx2 && !isY || ay2 < by2 && isY) {
      ra.push(new Segment([
        coordsA[0],
        coordsA[1],
      ], segA.belong));
      rb.push(new Segment([
        coordsA[0],
        coordsA[1],
      ], segB.belong));
      rb.push(new Segment([
        coordsA[1],
        coordsB[1],
      ], segB.belong));
    }
    else {
      ra.push(new Segment([
        coordsB[0],
        coordsB[1],
      ], segA.belong));
      ra.push(new Segment([
        coordsB[1],
        coordsA[1],
      ], segA.belong));
      rb.push(new Segment([
        coordsB[0],
        coordsB[1],
      ], segB.belong));
    }
  }
  // ax1 > bx1
  else {
    rb.push(new Segment([
      coordsB[0],
      coordsA[0],
    ], segB.belong));
    if(ax2 < bx2 && !isY || ay2 < by2 && isY) {
      ra.push(new Segment([
        coordsA[0],
        coordsA[1],
      ], segA.belong));
      rb.push(new Segment([
        coordsA[0],
        coordsA[1],
      ], segB.belong));
      rb.push(new Segment([
        coordsA[1],
        coordsB[1],
      ], segB.belong));
    }
    else if(ax2 === bx2 && !isY || ay2 === by2 && isY) {
      ra.push(new Segment([
        coordsA[0],
        coordsA[1],
      ], segA.belong));
      rb.push(new Segment([
        coordsA[0],
        coordsA[1],
      ], segB.belong));
    }
    else {
      ra.push(new Segment([
        coordsA[0],
        coordsB[1],
      ], segA.belong));
      rb.push(new Segment([
        coordsA[0],
        coordsB[1],
      ], segB.belong));
      ra.push(new Segment([
        coordsB[1],
        coordsA[1],
      ], segA.belong));
    }
  }
  return {
    ra,
    rb,
  };
}

function checkOverlapBezier2(ax1, ay1, ax2, ay2, ax3, ay3, segA,
                             bx1, by1, bx2, by2, bx3, by3, segB) {
  let t1 = bezier.getPointT([
    [ax1, ay1],
    [ax2, ay2],
    [ax3, ay3],
  ], bx1, by1);
  let t2 = bezier.getPointT([
    [ax1, ay1],
    [ax2, ay2],
    [ax3, ay3],
  ], bx3, by3);
  let t3 = bezier.getPointT([
    [bx1, by1],
    [bx2, by2],
    [bx3, by3],
  ], ax1, ay1);
  let t4 = bezier.getPointT([
    [bx1, by1],
    [bx2, by2],
    [bx3, by3],
  ], ax3, ay3);
  let l1 = t1.length, l2 = t2.length, l3 = t3.length, l4 = t4.length;
  // 部分重合一定只有2个点
  if(l1 + l2 + l3 + l4 === 2) {
    // 其中一个包含另一个
    if(l1 === 1 && l2 === 1) {}
    else if(l3 === 1 && l4 === 1) {}
    // 互相有一截重合
    else {
      // console.warn(segA.toString());console.warn(segB.toString());
      // console.log(t1, t2, t3, t4);
      let startA = l1 ? t1[0] : 0;
      let endA = l1 ? 1 : t2[0];
      let ca = bezier.sliceBezier2Both([
        [ax1, ay1],
        [ax2, ay2],
        [ax3, ay3],
      ], startA, endA);
      let startB = l3 ? t3[0] : 0;
      let endB = l3 ? 1 : t4[0];
      let cb = bezier.sliceBezier2Both([
        [bx1, by1],
        [bx2, by2],
        [bx3, by3],
      ], startB, endB);
      if(equalBezier(ca, cb)) {
        let pt = new Point(ca[1]);
        let ra = [];
        if(startA === 0) {
          ra.push(new Segment([
            segA.coords[0],
            pt,
            segB.coords[2],
          ], segA.belong));
          let s = bezier.sliceBezier2Both([
            [ax1, ay1],
            [ax2, ay2],
            [ax3, ay3],
          ], endA, 1);
          ra.push(new Segment([
            segB.coords[2],
            new Point(s[1]),
            segA.coords[2],
          ], segA.belong));
        }
        else {
        }
        let rb = [];
        if(startB === 0) {}
        else {
          let s = bezier.sliceBezier2Both([
            [bx1, by1],
            [bx2, by2],
            [bx3, by3],
          ], 0, startB);
          rb.push(new Segment([
            segB.coords[0],
            new Point(s[1]),
            segA.coords[0],
          ], segB.belong));
          rb.push(new Segment([
            segA.coords[0],
            pt,
            segB.coords[2],
          ], segB.belong));
        }
        // console.warn(ra.map(item => item.toString()))
        // console.warn(rb.map(item => item.toString()))
        return {
          ra,
          rb,
        };
      }
    }
  }
}

function equalBezier(a, b) {
  for(let i = 0, len = a.length; i < len; i++) {
    let ai = a[i], bi = b[i];
    if(Math.abs(ai[0] - bi[0]) > 1e-9 || Math.abs(ai[1] - bi[1]) > 1e-9) {
      return false;
    }
  }
  return true;
}

export default Polygon;
