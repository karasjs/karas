import Polygon from './Polygon';
import chain from './chain';

function pre(polygonA, polygonB) {
  // 生成多边形对象，包含不自相交的线段，线段是个双向链表，同时注释自己的内外性
  let source = new Polygon(polygonA, 0);
  // console.log(source.toString());
  let clip = new Polygon(polygonB, 1);
  // console.log(clip.toString());
  // console.log('----');
  // 两个多边形再次互相判断相交，注释对方的内外性
  Polygon.intersect2(source, clip);
  // console.log(source.toString());
  // console.log(clip.toString());
  // console.log('----');
  source.ioTarget(clip, 1);
  // console.log(source.toString());
  clip.ioTarget(source, 0);
  // console.log(clip.toString());
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
];
// const DIFFERENCE = [
//   0, 1, 1, 0,
//   1, 0, 1, 0,
//   1, 1, 0, 0,
//   0, 0, 0, 0,
// ];

function filter(first, matrix) {
  let res = [];
  let curr = first;
  do {
    let { leftIO, rightIO } = curr;
    let i = (leftIO[0] ? 8 : 0)
      + (leftIO[1] ? 4 : 0)
      + (rightIO[0] ? 2 : 0)
      + (rightIO[1] ? 1 : 0);
    // console.log(curr.toString(), i, matrix[i]);
    if(matrix[i]) {
      res.push(curr);
    }
    curr = curr.next;
  }
  while(curr !== first);
  return res;
}

export default {
  intersect(polygonA, polygonB) {
    let [source, clip] = pre(polygonA, polygonB);
    let list = filter(source.first, INTERSECT).concat(filter(clip.first, INTERSECT));
    // console.warn(list.join('\n'));
    return chain(list);
  },
  union(polygonA, polygonB) {
    let [source, clip] = pre(polygonA, polygonB);
    let list = filter(source.first, UNION).concat(filter(clip.first, UNION));
    // console.warn(list.join('\n'));
    return chain(list);
  },
  subtract(polygonA, polygonB) {
    let [source, clip] = pre(polygonA, polygonB);
    let list = filter(source.first, SUBTRACT).concat(filter(clip.first, SUBTRACT));
    // console.warn(list.join('\n'));
    return chain(list);
  },
  difference(polygonA, polygonB) {
    let [source, clip] = pre(polygonA, polygonB);
    let list1 = filter(source.first, SUBTRACT).concat(filter(clip.first, SUBTRACT));
    let list2 = filter(source.first, SUBTRACT2).concat(filter(clip.first, SUBTRACT2));
    // console.warn(list1.join('\n'), list2.join('\n'));
    return chain(list1).concat(chain(list2));
  },
};
