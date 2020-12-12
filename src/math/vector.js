// 向量点乘积
function dotProduct(x1, y1, x2, y2) {
  return x1 * x2 + y1 * y2;
}

// 向量叉乘积
function crossProduct(x1, y1, x2, y2) {
  return x1 * y2 - x2 * y1;
}

export default {
  dotProduct,
  crossProduct,
};
