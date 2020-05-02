import unit from './unit';
import transform from './transform';

const { PERCENT, NUMBER } = unit;

function matrixResize(imgWidth, imgHeight, targetWidth, targetHeight, x, y, w, h) {
  if(imgWidth === targetWidth && imgHeight === targetHeight) {
    return;
  }
  let list = [
    ['scaleX', {
      value: targetWidth / imgWidth,
      unit: NUMBER,
    }],
    ['scaleY', {
      value: targetHeight / imgHeight,
      unit: NUMBER,
    }]
  ];
  let tfo = transform.calOrigin([
    {
      value: 0,
      unit: PERCENT,
    },
    {
      value: 0,
      unit: PERCENT,
    }
  ], w, h);
  tfo[0] += x;
  tfo[1] += y;
  return transform.calMatrix(list, tfo, w, h);
}

export default {
  matrixResize,
};
