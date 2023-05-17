/**
 * @typedef {Object} gradientStatement
 * @property {Array<number>} color - 颜色rgba，0～255，如 [0, 255, 0, 255]
 * @property {number} angle - 角度，0～2 * Math.PI，(originX, originY) 为原点，垂直向上为0
 */

/**
 * 获取渐变图像像素数组
 * @param {number} originX - 渐变中心x坐标（相对图片左上角(0,0)的值，可在图片外，下同）
 * @param {number} originY - 渐变中心y坐标
 * @param {number} width - 图片宽度
 * @param {number} height - 图片高度
 * @param {Array<stop>} stop - 渐变声明列表
 * @param data - canvas的imgData.data
 * @returns {Array<number>} 图像像素数组，每4个元素（rgba）构成一个像素点
 * @example
     // 矩形宽度为200*200，此时坐标为0～199，渐变中心为中点时，应传入99.5，可消除零点问题
     // 若渐变中心在某一整数轴上，就会引入零点问题，此时零点取y轴正半轴的色值，要消除这个问题，可以对渐变中心增加一个偏移量，使其不为整数
     let w = 200;
     let h = 200;
     let ctx = document.getElementById('example').getContext('2d');
     let imgData = ctx.getImageData(0,0, w, h);
     let data = getConicGradientImage(99.5, 99.5, w, h, [{
       color: [0,0,0,255],
       angle: 0,
     } ,{
       color: [255,0,0,255],
       angle: 2 * Math.PI,
     }]);
     for (let i = 0; i < imgData.data.length; i++) {
       imgData.data[i] = data[i];
     }
     ctx.putImageData(imgData, 0, 0);
 */
function getConicGradientImage(
  originX,
  originY,
  width,
  height,
  stop,
  data
) {
  if(stop.length < 2) {
    throw new Error(
      'Conic gradient should recieve at least 2 gradient statements (start line and end line).'
    );
  }

  width = Math.floor(width);
  height = Math.floor(height);

  /**
   * 根据坐标获取角度
   * @param {number} x - x坐标，左上角为原点
   * @param {number} y - y坐标，左上角为原点
   * @returns {number} angle - 角度，0～2 * Math.PI，(originX, originY) 为原点，垂直向上为0
   */
  let getAngle = (x, y) => {
    // 此函数注释内的x、y轴基于 (originX, originY)
    // 计算相对 (originX, originY) 的坐标(dx, dy)
    let dx = x - originX;
    let dy = originY - y;
    // 在y轴上
    if(dx === 0) {
      return dy < 0
        ? // y轴负半轴，
        Math.PI
        : // y轴正半轴，因此，(originX, originY) 的angle视作0
        0;
    }
    // 在x轴上
    if(dy === 0) {
      return dx < 0
        ? // x轴负半轴
        1.5 * Math.PI
        : // x轴正半轴
        0.5 * Math.PI;
    }
    let atan = Math.atan(dy / dx);
    /**
     *  2   |  1
     * -----|-----
     *  3   |  4
     */
    // 第一象限，atan > 0
    // 第四象限，atan < 0
    if(dx > 0) {
      return 0.5 * Math.PI - atan;
    }
    // 第二象限，atan < 0
    // 第三象限，atan > 0
    if(dx < 0) {
      return 1.5 * Math.PI - atan;
    }
  };

  let increasingList = stop.map(item => ({
    color: item[0],
    angle: item[1] * Math.PI * 2,
  }));

  for(let y = 0; y < height; y++) {
    for(let x = 0; x < width; x++) {
      // step 1. 找到当前点坐标相对 (originX, originY) 的角度
      let angle = getAngle(x, y);
      // step 2. 找到当前点坐标对应的渐变区间
      let j;
      for(j = 0; j < increasingList.length && increasingList[j].angle <= angle; j++) {
      }
      let start = increasingList[j - 1];
      let end = increasingList[j];
      if(!(start && end)) {
        // step 2-1. 不在渐变区间里
        continue;
      }
      // step 3. 计算色值并填充
      let factor = (angle - start.angle) / (end.angle - start.angle);
      let color = end.color.map(
        (v, idx) => factor * (v - start.color[idx]) + start.color[idx]
      );
      let i = (x + y * width) * 4;
      data[i] = color[0];
      data[i+1] = color[1];
      data[i+2] = color[2];
      data[i+3] = Math.min(255, color[3] * 255);
    }
  }
  return data;
}

export default {
  getConicGradientImage,
};
