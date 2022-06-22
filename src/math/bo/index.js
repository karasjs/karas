import Polygon from './Polygon';
import chain from './chain';
import util from '../../util/util';

// 多边形都是多个区域，重载支持外部传入1个区域则数组化
function prefix(polygon) {
  if(polygon[0] && util.isNumber(polygon[0][0])) {
    return [polygon];
  }
  return polygon;
}

function trivial(polygonA, polygonB) {
  let isIntermediateA = polygonA instanceof Polygon;
  let isIntermediateB = polygonB instanceof Polygon;
  // 生成多边形对象，相交线段拆分开来，曲线x单调性裁剪，重合线段标记
  let source;
  if(isIntermediateA) {
    source = polygonA.reset(0);
  }
  else {
    source = new Polygon(prefix(polygonA), 0);
    source.selfIntersect();
  }
  // console.log(source.toString());
  let clip;
  if(isIntermediateB) {
    clip = polygonB.reset(1);
  }
  else {
    clip = new Polygon(prefix(polygonB), 1);
    clip.selfIntersect();
  }
  // console.log(clip.toString());
  console.log('----');
  // 两个多边形之间再次互相判断相交
  Polygon.intersect2(source, clip, isIntermediateA, isIntermediateB);
  console.log(source.toString());
  console.log(clip.toString());
  console.log('====');
  Polygon.annotate2(source, clip, isIntermediateA, isIntermediateB);
  console.log(source.toString());
  console.log(clip.toString());
  return [source, clip];
}

const INTERSECT = [
  0, 0, 0, 1,
  0, 0, 0, 1,
  0, 0, 0, 1,
  1, 1, 1, 0,
], UNION = [
  0, 1, 1, 1,
  1, 0, 0, 0,
  1, 0, 0, 0,
  1, 0, 0, 0,
], SUBTRACT = [
  0, 0, 1, 0,
  0, 0, 1, 0,
  1, 1, 0, 1,
  0, 0, 1, 0,
], SUBTRACT_REV = [
  0, 1, 0, 0,
  1, 0, 1, 1,
  0, 1, 0, 0,
  0, 1, 0, 0,
], XOR = [
  0, 1, 1, 0,
  1, 0, 0, 1,
  1, 0, 0, 1,
  0, 1, 1, 0,
];

function filter(segments, matrix) {
  let res = [], hash = {};
  segments.forEach(seg => {
    let { belong, myFill, otherFill, otherCoincide } = seg;
    if(otherCoincide) {
      // 对方重合线只出现一次
      let hc = seg.toHash();
      if(hash.hasOwnProperty(hc)) {
        return;
      }
      hash[hc] = true;
    }
    let i;
    if(belong) {
      i = (otherFill[0] ? 8 : 0)
        + (myFill[0] ? 4 : 0)
        + (otherFill[1] ? 2 : 0)
        + (myFill[1] ? 1 : 0);
    }
    else {
      i = (myFill[0] ? 8 : 0)
        + (otherFill[0] ? 4 : 0)
        + (myFill[1] ? 2 : 0)
        + (otherFill[1] ? 1 : 0);
    }
    if(matrix[i]) {
      res.push(seg);
    }
  });
  // console.log(res.map(item => item.toString()));
  return res;
}

export default {
  intersect(polygonA, polygonB, intermediate) {
    let [source, clip] = trivial(polygonA, polygonB);
    let list = filter(source.segments.concat(clip.segments), INTERSECT);
    if(intermediate) {
      source.segments = list;
      return source;
    }
    return chain(list);
  },
  union(polygonA, polygonB, intermediate) {
    let [source, clip] = trivial(polygonA, polygonB);
    let list = filter(source.segments.concat(clip.segments), UNION);
    if(intermediate) {
      source.segments = list;
      return source;
    }
    return chain(list);
  },
  subtract(polygonA, polygonB, intermediate) {
    let [source, clip] = trivial(polygonA, polygonB);
    let list = filter(source.segments.concat(clip.segments), SUBTRACT);
    if(intermediate) {
      source.segments = list;
      return source;
    }
    return chain(list);
  },
  subtractRev(polygonA, polygonB, intermediate) {
    let [source, clip] = trivial(polygonA, polygonB);
    let list = filter(source.segments.concat(clip.segments), SUBTRACT_REV);
    if(intermediate) {
      source.segments = list;
      return source;
    }
    return chain(list);
  },
  xor(polygonA, polygonB, intermediate) {
    let [source, clip] = trivial(polygonA, polygonB);
    let list = filter(source.segments.concat(clip.segments), XOR);
    if(intermediate) {
      source.segments = list;
      return source;
    }
    return chain(list);
  },
  chain(polygon) {
    if(polygon instanceof Polygon) {
      return chain(polygon.segments);
    }
    return polygon || [];
  },
};
