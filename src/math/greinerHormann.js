import bezier from './bezier';
import isec from './isec';
import vector from './vector';

class Vertex {
  constructor(coords, distance = 0) {
    this.coords = coords; // 顶点x/y为2长度，贝塞尔曲线跟在前面增加2或4长度即控制点坐标
    this.prev = null; // 顶点双向链表
    this.next = null;
    this.corresponding = null;
    this.distance = distance; // 如果是交点，占原本多边形上一个点和下一个点之间的路程比(0-1)
    this.isEntry = false; // 是否入口，反之出口
    this.isIntersection = false; // 是否是新增的交点，不是则是原本的顶点
    this.isOverlap = false; // 原本顶点也可能同时作为交点重合，这发生在点交边或共顶点的情况
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

  // 交点是否在多边形内，边上或顶点重合看情况算不算，射线（水平向左）+奇偶法
  // https://www.cnblogs.com/muyefeiwu/p/11260366.html
  isInside(poly) {
    let oddNodes = 0;
    let first = poly.first;
    let vertex = first;
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
          // 先排除水平重合线，且在两个y之间，再必须x在两个x右边
          if((vy < y && ny >= y || ny < y && vy >= y)
            && (vx <= x || nx <= x)) {
            // 两点式求x坐标，看是否在右边，奇偶简化^操作，在线上不算
            let x0 = vx + (y - vy) / (ny - vy) * (nx - vx);
            if(x0 < x) {
              oddNodes ^= x0 < x;
            }
            else if(x0 === x) {
            }
          }
        }
      }
      else if(vl === 4) {
      }
      else if(vl === 6) {
      }
      vertex = vertex.next;
      next = vertex.next || first;
    }
    while(vertex !== first);
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
    while(curr !== end && curr.distance < vertex.distance) {
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

  removeVertex(vertex) {
    let prev = vertex.prev;
    let next = vertex.next;
    prev.next = next;
    next.prev = prev;
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
    while(v !== first);
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
    while(v !== first);
    this.lastUnprocessed = null;
    return false;
  }

  // 获取最终结果顶点列表
  getPoints() {
    let res = [];
    let first = this.first;
    let v = first;
    do {
      res.push(v.coords);
      v = v.next;
    }
    while(v !== first);
    return res;
  }

  /**
   * 和clip对象多边形的布尔运算，根据两个方向参数决定种类
   * Intersection: forwards,  forwards
   * Union:        backwards, backwards
   * Subtract:     backwards, forwards
   */
  bo(clip, sourceForwards, clipForwards) {
    console.error(sourceForwards, clipForwards);
    let first = this.first, first2 = clip.first;
    let sourceVertex = first;
    let clipVertex = first2;
    let sourceInClip, clipInSource;

    let isUnion = !sourceForwards && !clipForwards;
    let isIntersection = sourceForwards && clipForwards;

    // 阶段1，求得所有交点，两个多边形的顶点逐个循环形成每条边互相测试，注意有重合共点共线时先统计进来，再排除
    let hasOverlapVertex;
    do {
      // 不是交点只是多边形顶点的时候，开始肯定会进入因为这时候还没有交点
      if(!sourceVertex.isIntersection) {
        let next = this.getNext(sourceVertex.next);
        do {
          if(!clipVertex.isIntersection) {
            // 当前a多边形的边和b的边进行交点测试
            let next2 = clip.getNext(clipVertex.next);
            let is = getIntersection(
              sourceVertex.coords,
              next.coords,
              clipVertex.coords,
              next2.coords
            );
            // 是相交的时候才有意义，可能有多个交点
            if(is) {
              is.forEach(item => {
                let sourceIntersection;
                let clipIntersection;
                // 共顶点的情况特殊标识，同时防止下次再作为交点
                if(item.toSource === 0) {
                  if(sourceVertex.isOverlap) {
                    return;
                  }
                  hasOverlapVertex = true;
                  sourceVertex.isOverlap = true;
                  sourceIntersection = sourceVertex;
                }
                else if(item.toSource === 1) {
                  if(next.isOverlap) {
                    return;
                  }
                  hasOverlapVertex = true;
                  next.isOverlap = true;
                  sourceIntersection = next;
                }
                if(item.toClip === 0) {
                  if(clipVertex.isOverlap) {
                    return;
                  }
                  hasOverlapVertex = true;
                  clipVertex.isOverlap = true;
                  clipIntersection = clipVertex;
                }
                else if(item.toClip === 1) {
                  if(next2.isOverlap) {
                    return;
                  }
                  hasOverlapVertex = true;
                  next2.isOverlap = true;
                  clipIntersection = next2;
                }
                console.warn(item);
                // 普通非共点线情况，生成交点插入
                if(!sourceIntersection) {
                  sourceIntersection = Vertex.createIntersection(item.coords.slice(0), item.toSource);
                  this.insertVertex(sourceIntersection, sourceVertex, this.getNext(next));
                }
                if(!clipIntersection) {
                  clipIntersection = Vertex.createIntersection(item.coords.slice(0), item.toClip);
                  clip.insertVertex(clipIntersection, clipVertex, clip.getNext(next2));
                }
                // 互相指向对方成对
                sourceIntersection.corresponding = clipIntersection;
                clipIntersection.corresponding = sourceIntersection;
              });
            }
          }
          clipVertex = clipVertex.next;
        }
        while(clipVertex !== first2);
      }
      sourceVertex = sourceVertex.next;
    }
    while(sourceVertex !== first);

    /**
     * 阶段1.5，当出现共点共线情况时，需要判断顶点作为交点是否有效，去除掉无效的顶点保证原始算法正常运行
     * 做法依旧是遍历，当遇到isOverlap标识时，直线查看前后的顶点或交点形成2个向量，
     * 曲线则用求出切线代表2个向量，和对方成对交点形成的2个向量对比，交叉则说明有效
     * 有可能会出现连续多个顶点作为交点的情况，这时候依然判断，如果向量垂直相交说明共线，
     * 忽略掉前面或后面的顶点交点，并继续向前向后找
     */
    // if(hasOverlapVertex) {
    //   do {
    //     if(sourceVertex.isOverlap) {
    //       // 无效的顶点作为交点的话，取消交点标，强制在对方多边形外
    //       if(!isOverlapVertexValid(sourceVertex)) {
    //         sourceVertex.isOverlap = false;
    //         sourceVertex.isOut = true;
    //         // 成对的交点如果也是顶点做同样操作，否则移除
    //         let corresponding = sourceVertex.corresponding;
    //         if(!corresponding.isOverlap) {
    //           clip.removeVertex(corresponding);
    //         }
    //         else {
    //           corresponding.isOut = true;
    //           corresponding.isOverlap = false;
    //         }
    //       }
    //     }
    //     sourceVertex = sourceVertex.next;
    //   }
    //   while(sourceVertex !== first);
    //   do {
    //     if(clipVertex.isOverlap) {
    //       if(!isOverlapVertexValid(clipVertex)) {
    //         clipVertex.isOverlap = false;
    //         clipVertex.isOut = true;
    //         let corresponding = clipVertex.corresponding;
    //         if(!corresponding.isOverlap) {
    //           this.removeVertex(corresponding);
    //         }
    //         else {
    //           corresponding.isOut = true;
    //           corresponding.isOverlap = false;
    //         }
    //       }
    //     }
    //     clipVertex = clipVertex.next;
    //   }
    //   while(clipVertex !== first2);
    // }

    // 阶段2，标识出入口，2个多边形分别进行判断first，后续交点交替出现循环即可
    console.log(sourceVertex.coords, clipVertex.coords);
    sourceInClip = sourceVertex.isInside(clip);
    clipInSource = clipVertex.isInside(this);
    console.log(sourceInClip, clipInSource);

    // 还有和参数传入种类决定最终选取规则
    sourceForwards ^= sourceInClip;
    clipForwards ^= clipInSource;
    sourceForwards = !!sourceForwards;
    clipForwards = !!clipForwards;
    console.log(sourceForwards, clipForwards);

    // 循环多边形a
    do {
      if(sourceVertex.isIntersection || sourceVertex.isOverlap) {
        sourceVertex.isEntry = sourceForwards;
        sourceForwards = !sourceForwards;
      }
      sourceVertex = sourceVertex.next;
    }
    while(sourceVertex !== first);
    // 循环多边形b
    do {
      if(clipVertex.isIntersection || clipVertex.isOverlap) {
        clipVertex.isEntry = clipForwards;
        clipForwards = !clipForwards;
      }
      clipVertex = clipVertex.next;
    }
    while(clipVertex !== first2);

    // 阶段3，遍历交点并选择方向结合顶点，获取最终结果，可能会形成不止1个区域，否则外层循环只执行一次就遍历完了没有未处理的
    let list = [];
    while(this.hasUnprocessed()) {
      let current = this.getFirstIntersect();
      let clipped = new Polygon([]);
      clipped.addVertex(new Vertex(current.coords));
      // 当前交点未访问则访问且打标
      do {
        current.visit();
        if(current.isEntry) {
          // 入口交点一直继续向后查找，顶点全部加入，直到交点（不包含）结束
          do {
            current = current.next;
            clipped.addVertex(new Vertex(current.coords));
          }
          while(!current.isIntersection && !current.isOverlap);
        }
        else {
          // 出口交点类似，但反向向前查找
          do {
            current = current.prev;
            clipped.addVertex(new Vertex(current.coords));
          }
          while(!current.isIntersection && !current.isOverlap);
        }
        current = current.corresponding; // 跳到成对的另一个多边形交点上
      }
      while(!current.isVisited);
      // 这轮循环结束形成一个多边形存入结果
      list.push(clipped.getPoints());
    }

    if(!list.length) {
      if(isUnion) {
        // 如果一个在另外一个内部，取外面大的，否则2个独立的多边形一起作为合集结果
        if(sourceInClip) {
          list.push(clip.getPoints());
        }
        else if(clipInSource) {
          list.push(this.getPoints());
        }
        else {
          list.push(this.getPoints(), clip.getPoints());
        }
      }
      else if(isIntersection) {
        // 交集和上面相反，但独立的结果是空
        if(sourceInClip) {
          list.push(this.getPoints());
        }
        else if(clipInSource) {
          list.push(clip.getPoints());
        }
      }
      else {
        // 差集特殊处理，没有交点的情况下可能2个是独立的，也有可能a在b内部或反之，这里只需要处理b在a内部，反过来的情况差集直接为空
        // b在a内部的话需要b的所有顶点和a的所有边奇偶法均为奇数，b是clip对象
        let first = clip.first;
        let clipVertex = first;
        let isIn = false;
        do {
          // 只要有1个在里面就说明在内部，因为其它点可能落在边上或共点
          if(clipVertex.isInside(this)) {
            isIn = true;
            break;
          }
          clipVertex = clipVertex.next;
        }
        while(clipVertex !== first);
        if(isIn) {
          list.push(this.getPoints());
          // 查看2个多边形的顺时针或逆时针，调整到不一致即可，源多边形顺序不动，选y最小的凸点和前后点组成线段判断向量叉乘
          let n1 = isClockwise(this), n2 = isClockwise(clip);
          if(n1 === n2) {
            list.push(clip.getPoints().reverse());
          }
          else {
            list.push(clip.getPoints());
          }
        }
      }
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
      if(toSource >= 0 && toSource <= 1 && toClip >= 0 && toClip <= 1) {
        let ox = s1x + toSource * (s2x - s1x);
        let oy = s1y + toSource * (s2y - s1y);
        // 防止精度问题
        if(toSource === 1) {
          ox = s2x;
          oy = s2y;
        }
        return [{
          coords: [ox, oy],
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
    res = res.map(item => {
      // toClip是直线上的距离，可以简化为只看x或y，选择差值比较大的防止精度问题
      let toClip;
      if(Math.abs(c2x - c1x) >= Math.abs(c2y - c1y)) {
        toClip = Math.abs((item.x - c1x) / (c2x - c1x));
      }
      else {
        toClip = Math.abs((item.y - c1y) / (c2y - c1y));
      }
      if(item.t > 0 && item.t < 1 && toClip > 0 && toClip < 1) {
        // 还要判断斜率，相等也忽略（小于一定误差）
        let k1 = getBezierSlope([
          [s1x, s1y],
          [ax1, ay1],
          [s2x, s2y],
        ], item.t);
        let k2 = getLineSlope(c1x, c1y, c2x, c2y);
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

function getIntersectionBezier3Line(s1x, s1y, ax1, ay1, ax2, ay2, s2x, s2y,
                                    c1x, c1y, c2x, c2y) {
  let res = isec.intersectBezier3Line(s1x, s1y, ax1, ay1, ax2, ay2, s2x, s2y,
    c1x, c1y, c2x, c2y);
  if(res.length) {
    res = res.map(item => {
      // toClip是直线上的距离，可以简化为只看x或y，选择差值比较大的防止精度问题
      let toClip;
      if(Math.abs(c2x - c1x) >= Math.abs(c2y - c1y)) {
        toClip = Math.abs((item.x - c1x) / (c2x - c1x));
      }
      else {
        toClip = Math.abs((item.y - c1y) / (c2y - c1y));
      }
      if(item.t > 0 && item.t < 1 && toClip > 0 && toClip < 1) {
        // 还要判断斜率，相等也忽略（小于一定误差）
        let k1 = getBezierSlope([
          [s1x, s1y],
          [ax1, ay1],
          [ax2, ay2],
          [s2x, s2y],
        ], item.t);
        let k2 = getLineSlope(c1x, c1y, c2x, c2y);
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
        toClip = toClip[0];
        if(item.t > 0 && item.t < 1 && toClip > 0 && toClip < 1) {
          // 还要判断斜率，相等也忽略（小于一定误差）
          let k1 = getBezierSlope([
            [s1x, s1y],
            [ax1, ay1],
            [s2x, s2y],
          ], item.t);
          let k2 = getBezierSlope([
            [c1x, c1y],
            [bx1, by1],
            [c2x, c2y],
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
        toClip = toClip[0];
        if(item.t > 0 && item.t < 1 && toClip > 0 && toClip < 1) {
          // 还要判断斜率，相等也忽略（小于一定误差）
          let k1 = getBezierSlope([
            [s1x, s1y],
            [ax1, ay1],
            [s2x, s2y],
          ], item.t);
          let k2 = getBezierSlope([
            [c1x, c1y],
            [bx1, by1],
            [bx2, by2],
            [c2x, c2y],
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
        toClip = toClip[0];
        if(item.t > 0 && item.t < 1 && toClip > 0 && toClip < 1) {
          // 还要判断斜率，相等也忽略（小于一定误差）
          let k1 = getBezierSlope([
            [s1x, s1y],
            [ax1, ay1],
            [ax2, ay2],
            [s2x, s2y],
          ], item.t);
          let k2 = getBezierSlope([
            [c1x, c1y],
            [bx1, by1],
            [bx2, by2],
            [c2x, c2y],
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

function bo(polygonA, polygonB, sourceForwards, clipForwards) {
  let source = new Polygon(polygonA);
  let clip = new Polygon(polygonB);
  return source.bo(clip, sourceForwards, clipForwards);
}

function isClockwise(poly) {
  let first = poly.first;
  let coords = first.coords, l = coords.length;
  let lastY = coords[l - 1];
  let min = first;
  let current = first;
  do {
    coords = current.coords;
    l = coords.length;
    let y = coords[l - 1];
    if(y < lastY) {
      min = current;
    }
  }
  while(current !== first);
  let prev = min.prev, next = min.next;
  coords = prev.coords;
  l = coords.length;
  let x1 = coords[l - 2], y1 = coords[l - 1];
  coords = min.coords;
  l = coords.length;
  let x2 = coords[l - 2], y2 = coords[l - 1];
  coords = next.coords;
  l = coords.length;
  let x3 = coords[l - 2], y3 = coords[l - 1];
  return vector.crossProduct(x2 - x1, y2 - y1, x3 - x2, y3 - y2) > 0;
}

function getLineSlope(x1, y1, x2, y2) {
  if(x1 === x2) {
    return Infinity;
  }
  return (y2 - y1) / (x2 - x1);
}

function getBezierSlope(points, t) {
  if(points.length === 3) {
    return getBezier2Slope(points, t);
  }
  else if(points.length === 4) {
    return getBezier3Slope(points, t);
  }
}

function getBezier2Slope(points, t) {
  let [
    [x0, y0],
    [x1, y1],
    [x2, y2],
  ] = points;
  let x = 2 * (x0 - 2 * x1 + x2) * t + 2 * x1 - 2 * x0;
  if(x === 0) {
    return Infinity;
  }
  return (2 * (y0 - 2 * y1 + y2) * t + 2 * y1 - 2 * y0) / x;
}

function getBezier3Slope(points, t) {
  let [
    [x0, y0],
    [x1, y1],
    [x2, y2],
    [x3, y3],
  ] = points;
  let x = 3 * (-x0 + 3 * x1 - 3 * x2 + x3) * t * t
    + 2 * (3 * x0 - 6 * x1 + 3 * x2) * t
    + 3 * x1 - 3 * x0;
  if(x === 0) {
    return Infinity;
  }
  return (3 * (-y0 + 3 * y1 - 3 * y2 + y3) * t * t
    + 2 * (3 * y0 - 6 * y1 + 3 * y2) * t
    + 3 * y1 - 3 * y0) / x;
}

export default {
  // 所有的操作均为A是源对象或被裁剪对象，B是裁剪对象或裁剪窗口
  intersect(polygonA, polygonB) {
    return bo(polygonA, polygonB, true, true);
  },
  union(polygonA, polygonB) {
    return bo(polygonA, polygonB, false, false);
  },
  subtract(polygonA, polygonB) {
    return bo(polygonA, polygonB, false, true);
  },
  difference(polygonA, polygonB) {
    // 差集（异或）比较特殊，等于(A-B)∪(B-A)
    let r1 = this.subtract(polygonA, polygonB);
    let r2 = this.subtract(polygonB, polygonA);
    return r1.concat(r2);
  },
};
