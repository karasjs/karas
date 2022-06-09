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
  // 生成多边形对象，相交线段拆分开来，曲线x单调性裁剪，重合线段标记
  let source = new Polygon(prefix(polygonA), 0);
  source.selfIntersect();
  console.log(source.toString());
  let clip = new Polygon(prefix(polygonB), 1);
  console.log(clip.toString());
  console.log('----');
  // 两个多边形之间再次互相判断相交
  Polygon.intersect2(source, clip);
  console.log(source.toString());
  console.log(clip.toString());
  console.log('----');
  Polygon.io2(source, clip);
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
], SUBTRACT2 = [
  0, 1, 0, 0,
  1, 0, 1, 1,
  0, 1, 0, 0,
  0, 1, 0, 0,
], DIFFERENCE = [
  0, 1, 1, 0,
  1, 0, 0, 1,
  1, 0, 0, 1,
  0, 1, 1, 0,
];

function filter(segments, matrix) {
  let res = [];
  segments.forEach(seg => {
    let { above, below } = seg;
    let i = (above[0] ? 8 : 0)
      + (above[1] ? 4 : 0)
      + (below[0] ? 2 : 0)
      + (below[1] ? 1 : 0);
    if(matrix[i]) {
      res.push(seg);
    }
  });
  return res;
}

export default {
  intersect(polygonA, polygonB) {
    let [source, clip] = trivial(polygonA, polygonB);
    let list = filter(source.segments, INTERSECT).concat(filter(clip.segments, INTERSECT));
    return chain(list);
  },
  union(polygonA, polygonB) {
    let [source, clip] = trivial(polygonA, polygonB);
    let list = filter(source.segments, UNION).concat(filter(clip.segments, UNION));
    return chain(list);
  },
  subtract(polygonA, polygonB) {
    let [source, clip] = trivial(polygonA, polygonB);
    let list = filter(source.segments, SUBTRACT).concat(filter(clip.segments, SUBTRACT));
    return chain(list);
  },
  subtract2(polygonA, polygonB) {
    let [source, clip] = trivial(polygonA, polygonB);
    let list = filter(source.segments, SUBTRACT2).concat(filter(clip.segments, SUBTRACT2));
    return chain(list);
  },
  difference(polygonA, polygonB) {
    let [source, clip] = trivial(polygonA, polygonB);
    let list = filter(source.segments, DIFFERENCE).concat(filter(clip.segments, DIFFERENCE));
    return chain(list);
  },
};
