import unit from './unit';
import transform from './transform';
import enums from '../util/enums';

const { STYLE_KEY: { SCALE_X, SCALE_Y } } = enums;
const { NUMBER } = unit;

function matrixResize(imgWidth, imgHeight, targetWidth, targetHeight, x, y, w, h) {
  if(imgWidth === targetWidth && imgHeight === targetHeight) {
    return;
  }
  let list = [
    [SCALE_X, [targetWidth / imgWidth, NUMBER]],
    [SCALE_Y, [targetHeight / imgHeight, NUMBER]],
  ];
  let tfo = [x, y];
  return transform.calMatrixWithOrigin(list, tfo, w, h);
}

export default {
  matrixResize,
};
