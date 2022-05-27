import Polygon from './Polygon';

function pre(polygonA, polygonB) {
  // 生成多边形对象，包含不自相交的线段，线段是个双向链表，同时注释自己的内外性
  let source = new Polygon(polygonA, 0);
  console.log(source.toString());
  let clip = new Polygon(polygonB, 1);
  console.log(clip.toString());
  // 两个多边形再次互相判断相交，注释对方的内外性
  Polygon.intersect2(source, clip);
  console.log(source.toString());
  console.log(clip.toString());
}

export default {
  intersect(polygonA, polygonB) {
    pre(polygonA, polygonB);
  },
  union() {},
  subtract() {},
  difference() {},
};
