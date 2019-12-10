import unit from './unit';
import transform from './transform';

function matrixResize(imgWidth, imgHeight, targetWidth, targetHeight, x, y, w, h) {
  if(imgWidth === targetWidth && imgHeight === targetHeight) {
    return;
  }
  let list = [
    ['scaleX', {
      value: targetWidth / imgWidth,
      unit: unit.NUMBER,
    }],
    ['scaleY', {
      value: targetHeight / imgHeight,
      unit: unit.NUMBER,
    }]
  ];
  let tfo = transform.calOrigin([
    {
      value: 0,
      unit: unit.PERCENT,
    },
    {
      value: 0,
      unit: unit.PERCENT,
    }
  ], x, y, w, h);
  return transform.calMatrix(list, tfo, x, y, w, h);
}

export default {
  matrixResize,
  reg: /url\((['"]?)(.*?)\1\)/,
};
