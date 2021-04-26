/**
 * https://www.w3.org/TR/2018/WD-filter-effects-1-20181218/#feGaussianBlurElement
 * 根据模糊参数sigma求卷积核尺寸
 * @param sigma
 * @returns {number}
 */
function kernelSize(sigma) {
  if(sigma <= 0) {
    return 0;
  }
  if(sigma < 2) {
    return 5;
  }
  let d = Math.floor(sigma * 3 * Math.sqrt(2 * Math.PI) / 4 + 0.5);
  if(d < 2) {
    d = 2;
  }
  if(d % 2 === 0) {
    d++;
  }
  return d;
}

/**
 * 根据sigma求模糊扩展尺寸，卷积核求得后为d，再求半径/2，然后因为算法要执行3次，所以*3
 * 比如本来d为5，半径2.5算上自身像素点则各方向扩展2，*3则扩展6
 * @param sigma
 * @returns {number}
 */
function outerSize(sigma) {
  let d = kernelSize(sigma);
  return Math.floor(d * 1.5);
}

export default {
  kernelSize,
  outerSize,
};
