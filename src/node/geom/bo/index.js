import Polygon from './Polygon';

function pre(polygonA, polygonB) {
  // 生成多边形对象，包含不字相交的线段，线段是个双向链表
  let source = new Polygon(polygonA);
  console.log(source.joinSegment());
  let clip = new Polygon(polygonB);
  console.log(clip.joinSegment());
  // // 两个多边形再次互相判断相交
  Polygon.intersect2(source, clip);
}

export default {
  intersect(polygonA, polygonB) {
    pre(polygonA, polygonB);
  },
  union() {},
  subtract() {},
  difference() {},
};
