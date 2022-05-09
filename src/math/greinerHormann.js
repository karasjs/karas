import bezier from './bezier';
import isec from './isec';

class Vertex {
  constructor(coords, distance = 0) {
    this.coords = coords; // 顶点x/y为2长度，贝塞尔曲线跟在前面增加2或4长度即控制点坐标
    this.prev = null; // 顶点双向链表
    this.next = null;
    this.corresponding = null;
    this.distance = distance; // 如果是交点，占原本多边形上一个点和下一个点之间的路程比(0-1)
    this.isEntry = false; // 是否入口，反之出口
    this.isIntersection = false;
    this.isVisited = false;
  }

  // 自己标记访问过，同时成对的也要标记，成对意思是2个多边形的交点在两边各自保存同样的数据成对
  visit() {
    this.isVisited = true;
    let corresponding = this.corresponding;
    if(corresponding && !corresponding.isVisited) {
      corresponding.isVisited = true;
    }
  }

  // 顶点对比，哪怕是线段和曲线相交的顶点其中控制点不相同，忽略控制点只看最后顶点x/y
  equals(v) {
    // 引用相同可以不对比数据
    if(this === v) {
      return true;
    }
    let coords = this.coords, coords2 = v.coords, l = coords.length, l2 = coords2.length;
    let x1 = coords[l - 2];
    let y1 = coords[l - 1];
    let x2 = coords2[l - 2];
    let y2 = coords2[l - 1];
    // if(coords.length !== coords2.length) {
    //   return false;
    // }
    // for(let i = 0, len = coords.length; i < len; i++) {
    //   if(coords[i] !== coords2[i]) {
    //     return false;
    //   }
    // }
    return x1 === x2 && y1 === y2;
  }

  // 交点是否在多边形内，边上不算，射线（水平向左）+奇偶法
  // https://www.cnblogs.com/muyefeiwu/p/11260366.html
  isInside(poly) {
    let oddNodes = 0;
    let vertex = poly.first;
    let next = vertex.next;
    // 交点的坐标在最后，因为可能是贝塞尔曲线，前面存控制点坐标
    let coords = this.coords, l = coords.length;
    let x = coords[l - 2];
    let y = coords[l - 1];
    // 循环一遍所有顶点之间的线段
    do {
      let vCoords = vertex.coords, vl = vCoords.length,
        nCoords = next.coords, nl = nCoords.length;
      let vx = vCoords[vl - 2], vy = vCoords[vl - 1],
        nx = nCoords[nl - 2], ny = nCoords[nl - 1];
      // 依旧是判断线段还是曲线
      if(vl === 2) {
        if(nl === 2) {
          // 先排除水平线，且在两个y之间，再必须x在两个x右边
          if((vy < y && ny >= y || ny < y && vy >= y)
            && (vx <= x || nx <= x)) {
            // 两点式求x坐标，看是否在右边，奇偶简化^操作，在线上不算
            let x0 = vx + (y - vy) / (ny - vy) * (nx - vx);
            oddNodes ^= x0 < x;
          }
        }
      }
      else if(vl === 4) {
      }
      else if(vl === 6) {
      }
      vertex = vertex.next;
      next = vertex.next || poly.first;
    }
    while(!vertex.equals(poly.first));
    // 返回奇偶数，0和1正好true/false
    return oddNodes;
  }

  static createIntersection(coords, distance) {
    let v = new Vertex(coords, distance);
    v.isIntersection = true;
    return v;
  }
}

class Polygon {
  constructor(vertices) {
    this.vertices = vertices;
    this.first = null;
    this.lastUnprocessed = null; // 算法过程中存储上一个未处理的交点
    this.firstIntersect = null; // 算法过程中存储未处理的第一个交点，加快速度避免每次从头开始查找

    for(let i = 0, len = vertices.length; i < len; i++) {
      this.addVertex(new Vertex(vertices[i]));
    }
  }

  // 顶点添加到末尾，顶点是个循环双向链表
  addVertex(vertex) {
    if(!this.first) {
      this.first = vertex;
      vertex.next = vertex;
      vertex.prev = vertex;
    }
    else {
      let next = this.first;
      let prev = next.prev;

      next.prev = vertex;
      vertex.next = next;
      vertex.prev = prev;
      prev.next = vertex;
    }
  }

  /**
   * 在start和end之间插入新的交点，这里面有顺序，一条边和另外多条边都相交时，start和end之间则有多个点（即交点），
   * 需要插入到正确的顺序位置上，通过对比距离start的distance占比来确定，占比按从小到大顺序，其实就是位置
   * 当插入贝塞尔曲线上时，distance就是t，需要切割曲线
   */
  insertVertex(vertex, start, end) {
    let prev, curr = start;
    // 找到正确的位置，一条边上多个交点时不能直接用end
    while(!curr.equals(end) && curr.distance < vertex.distance) {
      curr = curr.next;
    }
    // 处理新的点的引用
    prev = curr.prev;
    prev.next = vertex;
    vertex.next = curr;
    vertex.prev = prev;
    curr.prev = vertex;
    // 如果是曲线点要裁剪，注意t是相对于非交点，所以始终用start和end计算，最后替换顶点防止误差
    let coords = end.coords, l = coords.length;
    if(l === 4) {
      let points = [
        start.coords.slice(-2),
        coords.slice(0, 2),
        coords.slice(2),
      ];
      // 注意t的开始结束需要根据前面后面的点的distance，因为可能多个交点，没有则默认0和1
      let a = bezier.sliceBezier2Both(points, prev.distance || 0, vertex.distance);
      let b = bezier.sliceBezier2Both(points, vertex.distance, curr.distance || 1);
      vertex.coords.unshift(a[1][0], a[1][1]);
      coords = curr.coords;
      coords[0] = b[1][0]; // 替换原本的曲线控制点为新的控制点
      coords[1] = b[1][1];
    }
    else if(l === 6) {
      // 同上
      let points = [
        start.coords.slice(-2),
        coords.slice(0, 2),
        coords.slice(2, 4),
        coords.slice(4),
      ];
      let a = bezier.sliceBezier2Both(points, prev.distance || 0, vertex.distance);
      let b = bezier.sliceBezier2Both(points, vertex.distance, curr.distance || 1);
      vertex.coords.unshift(a[1][0], a[1][1], a[2][0], a[2][1]);
      coords = curr.coords;
      coords[0] = b[1][0]; // 这里是3阶所以是2个
      coords[1] = b[1][1];
      coords[2] = b[2][0];
      coords[3] = b[2][1];
    }
  }

  // 找到下一个非交点顶点，交点是插入的顶点
  getNext(v) {
    while(v.isIntersection) {
      v = v.next;
    }
    return v;
  }

  // 获取第一个未处理的交点
  getFirstIntersect() {
    let first = this.first;
    // 一开始从头查找，中间有交点处理过后临时保存下来，下次不用从头查找
    let v = this.firstIntersect || first;
    do {
      if(v.isIntersection && !v.isVisited) {
        break;
      }
      v = v.next;
    }
    while(!v.equals(first));
    this.firstIntersect = v; // 临时保存
    return v;
  }

  // 是否还有未处理的交点，预示算法结束
  hasUnprocessed() {
    let first = this.first;
    // 和上面很像，避免从头查找
    let v = this.lastUnprocessed || first;
    do {
      if(v.isIntersection && !v.isVisited) {
        this.lastUnprocessed = v;
        return true;
      }
      v = v.next;
    }
    while(!v.equals(first));
    this.lastUnprocessed = null;
    return false;
  }

  // 获取最终结果顶点列表
  getPoints() {
    let res = [];
    let first = this.first;
    let v = first;
    // console.warn(first.coords, first.prev);
    do {
      // console.log(v.coords)
      res.push(v.coords);
      v = v.next;
    }
    while(v !== first);
    // console.log(v,first);
    // if(v.equals(first)) {
    //   res.pop();
    // }
    return res;
  }

  /**
   * 和clip对象多边形的布尔运算，根据两个方向参数决定种类
   * Intersection: forwards forwards
   * Union:        backwars backwards
   * Diff:         backwards forwards
   * Xor:          forwards backwards
   */
  bo(clip, sourceForwards, clipForwards) {
    let first = this.first, first2 = clip.first;
    let sourceVertex = first;
    let clipVertex = first2;
    let sourceInClip, clipInSource;

    let isUnion = !sourceForwards && !clipForwards;
    let isIntersection = sourceForwards && clipForwards;

    // 阶段1，求得所有交点，两个多边形的顶点逐个循环形成每条边互相测试
    do {
      // 不是交点只是多边形顶点的时候，开始肯定会进入因为这时候还没有交点
      if(!sourceVertex.isIntersection) {
        do {
          if(!clipVertex.isIntersection) {
            // 当前a多边形的边和b的边进行交点测试
            let next = sourceVertex.next, next2 = clipVertex.next;
            let is = getIntersection(
              sourceVertex.coords,
              next.coords,
              clipVertex.coords,
              next2.coords
            );
            // 是相交的时候才有意义，可能有多个交点
            if(is) {
              is.forEach(item => {
                console.warn(item.coords, item.toSource, item.toClip);
                let sourceIntersection = Vertex.createIntersection(item.coords.slice(0), item.toSource);
                let clipIntersection = Vertex.createIntersection(item.coords.slice(0), item.toClip);
                // 互相指向对方成对
                sourceIntersection.corresponding = clipIntersection;
                clipIntersection.corresponding = sourceIntersection;
                // 插入交点作为新的顶点
                this.insertVertex(sourceIntersection, sourceVertex, this.getNext(next));
                clip.insertVertex(clipIntersection, clipVertex, clip.getNext(next2));
              });
            }
          }
          clipVertex = clipVertex.next;
        }
        while(!clipVertex.equals(first2));
      }
      sourceVertex = sourceVertex.next;
    }
    while(!sourceVertex.equals(first));
    console.log(this.getPoints());
    console.log(clip.getPoints());

    // 阶段2，标识出入口，2个多边形分别进行判断first，后续交点交替出现循环即可
    sourceInClip = sourceVertex.isInside(clip);
    clipInSource = clipVertex.isInside(this);
    console.log(sourceInClip, clipInSource);
    // 还有和参数传入种类决定最终选取规则
    sourceForwards ^= sourceInClip;
    clipForwards ^= clipInSource;
    console.log(sourceForwards, clipForwards);
    // 循环多边形a
    do {
      if(sourceVertex.isIntersection) {
        sourceVertex.isEntry = sourceForwards;
        sourceForwards = !sourceForwards;
      }
      sourceVertex = sourceVertex.next;
    }
    while(!sourceVertex.equals(first));
    // 循环多边形b
    do {
      if(clipVertex.isIntersection) {
        clipVertex.isEntry = clipForwards;
        clipForwards = !clipForwards;
      }
      clipVertex = clipVertex.next;
    }
    while(!clipVertex.equals(first2));

    // 阶段3，遍历交点并选择方向结合顶点，获取最终结果，可能会形成不止1个区域，否则外层循环只执行一次就遍历完了没有未处理的
    let list = [];
    while(this.hasUnprocessed()) {
      // console.warn('process');
      let current = this.getFirstIntersect();
      let clipped = new Polygon([]);
      // clipped.addVertex(new Vertex(current.coords));
      // console.log(1,current.coords);
      // 当前交点未访问则访问且打标
      do {
        current.visit();
        if(current.isEntry) {
          // 入口交点一直继续向后查找，顶点全部加入，直到交点（不包含）结束
          do {
            current = current.next;
            clipped.addVertex(new Vertex(current.coords));
            // console.log(2,current.coords,current.isVisited);
          }
          while(!current.isIntersection);
        }
        else {
          // 出口交点类似，但反向向前查找
          do {
            current = current.prev;
            clipped.addVertex(new Vertex(current.coords));
            // console.log(3,current.coords,current.isVisited);
          }
          while(!current.isIntersection);
        }
        current = current.corresponding; // 跳到成对的另一个多边形交点上
      }
      while(!current.isVisited);
      // 这轮循环结束形成一个多边形存入结果
      list.push(clipped.getPoints());
    }

    if(!list.length) {
      // TODO: 处理一些极端情况
    }

    return list;
  }
}

/**
 * https://segmentfault.com/a/1190000004457595
 * 注意分几种情况：线段和线段，线段和曲线，曲线和曲线，可能有多个交点全部返回
 * 没有相交则返回空数组
 */
function getIntersection(s1, s2, c1, c2) {
  let s1l = s1.length, s2l = s2.length, c1l = c1.length, c2l = c2.length;
  let s1x = s1[s1l - 2]; // 第1个点可以直接取最后2位顶点坐标，前面控制点没用
  let s1y = s1[s1l - 1];
  let c1x = c1[c1l - 2];
  let c1y = c1[c1l - 1];
  let s2x = s2[s2l - 2];
  let s2y = s2[s2l - 1];
  let c2x = c2[c2l - 2];
  let c2y = c2[c2l - 1];
  // 自己是线段
  if(s2l === 2) {
    // 2条线段之间判断用向量叉乘
    if(c2l === 2) {
      let d = (c2y - c1y) * (s2x - s1x) - (c2x - c1x) * (s2y - s1y);
      // 平行不相交
      if(d === 0) {
        return;
      }
      let toSource = (
        (c2x - c1x) * (s1y - c1y) - (c2y - c1y) * (s1x - c1x)
      ) / d;
      let toClip = (
        (s2x - s1x) * (s1y - c1y) - (s2y - s1y) * (s1x - c1x)
      ) / d;
      if(toSource > 0 && toSource < 1 && toClip > 0 && toClip < 1) {
        return [{
          coords: [
            s1x + toSource * (s2x - s1x),
            s1y + toSource * (s2y - s1y),
          ],
          toSource,
          toClip,
        }];
      }
    }
    // 和2阶曲线
    else if(c2l === 4) {
      let bx1 = c2[c2l - 4];
      let by1 = c2[c2l - 3];
      let res = getIntersectionBezier2Line(c1x, c1y, bx1, by1, c2x, c2y,
        s1x, s1y, s2x, s2y);
      if(res) {
        // 反过来求的交点所以要交换下
        res.forEach(item => {
          [item.toSource, item.toClip] = [item.toClip, item.toSource];
        });
        return res;
      }
    }
    // 和3阶曲线
    else if(c2l === 6) {
      let bx1 = c2[c2l - 6];
      let by1 = c2[c2l - 5];
      let bx2 = c2[c2l - 4];
      let by2 = c2[c2l - 3];
      let res = getIntersectionBezier3Line(c1x, c1y, bx1, by1, bx2, by2, c2x, c2y,
        s1x, s1y, s2x, s2y);
      if(res) {
        // 反过来求的交点所以要交换下
        res.forEach(item => {
          [item.toSource, item.toClip] = [item.toClip, item.toSource];
        });
        return res;
      }
    }
  }
  // 自己是2阶曲线
  else if(s2l === 4) {
    let ax1 = s2[s2l - 4];
    let ay1 = s2[s2l - 3];
    // 和直线段
    if(c2l === 2) {
      let res = getIntersectionBezier2Line(s1x, s1y, ax1, ay1, s2x, s2y,
        c1x, c1y, c2x, c2y);
      if(res) {
        return res;
      }
    }
    // 和2阶曲线
    else if(c2l === 4) {
      let bx1 = c2[c2l - 4];
      let by1 = c2[c2l - 3];
      let res = getIntersectionBezier2Bezier2(s1x, s1y, ax1, ay1, s2x, s2y,
        c1x, c1y, bx1, by1, c2x, c2y);
      if(res) {
        return res;
      }
    }
    // 和3阶曲线
    else if(c2l === 6) {
      let bx1 = c2[c2l - 6];
      let by1 = c2[c2l - 5];
      let bx2 = c2[c2l - 4];
      let by2 = c2[c2l - 3];
      let res = getIntersectionBezier2Bezier3(s1x, s1y, ax1, ay1, s2x, s2y,
        c1x, c1y, bx1, by1, bx2, by2, c2x, c2y);
      if(res) {
        return res;
      }
    }
  }
  // 自己是3阶曲线
  else if(s2l === 6) {
    let ax1 = s2[s2l - 6];
    let ay1 = s2[s2l - 5];
    let ax2 = s2[s2l - 4];
    let ay2 = s2[s2l - 3];
    // 和直线段
    if(c2l === 2) {
      let res = getIntersectionBezier3Line(s1x, s1y, ax1, ay1, ax2, ay2, s2x, s2y,
        c1x, c1y, c2x, c2y);
      if(res) {
        return res;
      }
    }
    // 和2阶曲线
    else if(c2l === 4) {
      let bx1 = c2[c2l - 4];
      let by1 = c2[c2l - 3];
      let res = getIntersectionBezier2Bezier3(c1x, c1y, bx1, by1, c2x, c2y,
        s1x, s1y, ax1, ay1, ax2, ay2, s2x, s2y);
      if(res) {
        // 反过来求的交点所以要交换下
        res.forEach(item => {
          [item.toSource, item.toClip] = [item.toClip, item.toSource];
        });
        return res;
      }
    }
    // 和3阶曲线
    else if(c2l === 6) {
      let bx1 = c2[c2l - 6];
      let by1 = c2[c2l - 5];
      let bx2 = c2[c2l - 4];
      let by2 = c2[c2l - 3];
      let res = getIntersectionBezier3Bezier3(s1x, s1y, ax1, ay1, ax2, ay2, s2x, s2y,
        c1x, c1y, bx1, by1, bx2, by2, c2x, c2y);
      if(res) {
        return res;
      }
    }
  }
}

function getIntersectionBezier2Line(s1x, s1y, ax1, ay1, s2x, s2y,
                                    c1x, c1y, c2x, c2y) {
  let res = isec.intersectBezier2Line(s1x, s1y, ax1, ay1, s2x, s2y,
    c1x, c1y, c2x, c2y);
  if(res.length) {
    return res.map(item => {
      // toClip是直线上的距离，可以简化为只看x或y，选择差值比较大的防止精度问题
      let toClip;
      if(Math.abs(c2x - c1x) >= Math.abs(c2y - c1y)) {
        toClip = Math.abs((item.x - c1x) / (c2x - c1x));
      }
      else {
        toClip = Math.abs((item.y - c1y) / (c2y - c1y));
      }
      return {
        coords: [item.x, item.y],
        toSource: item.t, // source是曲线直接用t
        toClip,
      };
    });
  }
}

function getIntersectionBezier3Line(s1x, s1y, ax1, ay1, ax2, ay2, s2x, s2y,
                                    c1x, c1y, c2x, c2y) {
  let res = isec.intersectBezier3Line(s1x, s1y, ax1, ay1, ax2, ay2, s2x, s2y,
    c1x, c1y, c2x, c2y);
  if(res.length) {
    return res.map(item => {
      // toClip是直线上的距离，可以简化为只看x或y，选择差值比较大的防止精度问题
      let toClip;
      if(Math.abs(c2x - c1x) >= Math.abs(c2y - c1y)) {
        toClip = Math.abs((item.x - c1x) / (c2x - c1x));
      }
      else {
        toClip = Math.abs((item.y - c1y) / (c2y - c1y));
      }
      return {
        coords: [item.x, item.y],
        toSource: item.t, // source是曲线直接用t
        toClip,
      };
    });
  }
}

function getIntersectionBezier2Bezier2(s1x, s1y, ax1, ay1, s2x, s2y,
                                       c1x, c1y, bx1, by1, c2x, c2y) {
  let res = isec.intersectBezier2Bezier2(s1x, s1y, ax1, ay1, s2x, s2y,
    c1x, c1y, bx1, by1, c2x, c2y);
  if(res.length) {
    res = res.map(item => {
      // toClip是另一条曲线的距离，需根据交点和曲线方程求t
      let toClip = bezier.getPointT([
        [c1x, c1y],
        [bx1, by1],
        [c2x, c2y],
      ], item.x, item.y);
      // 防止误差无值
      if(toClip.length) {
        return {
          coords: [item.x, item.y],
          toSource: item.t, // source是曲线直接用t
          toClip: toClip[0],
        };
      }
    }).filter(i => i);
    if(res.length) {
      return res;
    }
  }
}

function getIntersectionBezier2Bezier3(s1x, s1y, ax1, ay1, s2x, s2y,
                                       c1x, c1y, bx1, by1, bx2, by2, c2x, c2y) {

  let res = isec.intersectBezier2Bezier3(s1x, s1y, ax1, ay1, s2x, s2y,
    c1x, c1y, bx1, by1, bx2, by2, c2x, c2y);
  if(res.length) {
    res = res.map(item => {
      // toClip是另一条曲线的距离，需根据交点和曲线方程求t
      let toClip = bezier.getPointT([
        [c1x, c1y],
        [bx1, by1],
        [bx2, by2],
        [c2x, c2y],
      ], item.x, item.y);
      // 防止误差无值
      if(toClip.length) {
        return {
          coords: [item.x, item.y],
          toSource: item.t, // source是曲线直接用t
          toClip: toClip[0],
        };
      }
    }).filter(i => i);
    if(res.length) {
      return res;
    }
  }
}

function getIntersectionBezier3Bezier3(s1x, s1y, ax1, ay1, ax2, ay2, s2x, s2y,
                                       c1x, c1y, bx1, by1, bx2, by2, c2x, c2y) {
  let res = isec.intersectBezier3Bezier3(s1x, s1y, ax1, ay1, ax2, ay2, s2x, s2y,
    c1x, c1y, bx1, by1, bx2, by2, c2x, c2y);
  if(res.length) {
    res = res.map(item => {
      // toClip是另一条曲线的距离，需根据交点和曲线方程求t
      let toClip = bezier.getPointT([
        [c1x, c1y],
        [bx1, by1],
        [bx2, by2],
        [c2x, c2y],
      ], item.x, item.y);
      // 防止误差无值
      if(toClip.length) {
        return {
          coords: [item.x, item.y],
          toSource: item.t, // source是曲线直接用t
          toClip: toClip[0],
        };
      }
    }).filter(i => i);
    if(res.length) {
      return res;
    }
  }
}

function bo(polygonA, polygonB, sourceForwards, clipForwards) {
  let source = new Polygon(polygonA);
  let clip = new Polygon(polygonB);
  return source.bo(clip, sourceForwards, clipForwards);
}

export default {
  intersect(polygonA, polygonB) {
    return bo(polygonA, polygonB, true, true);
  },
  union(polygonA, polygonB) {
    return bo(polygonA, polygonB, false, false);
  },
  subtract(polygonA, polygonB) {
    return bo(polygonA, polygonB, true, false);
  },
  diff(polygonA, polygonB) {
    return bo(polygonA, polygonB, false, true);
  },
};
