import Polyline from './Polyline';

class Polygon extends Polyline {
  constructor(tagName, props) {
    super(tagName, props);
  }

  __getPoints(originX, originY, width, height, points, isControl) {
    let res = super.__getPoints(originX, originY, width, height, points, isControl);
    if(!isControl) {
      res.push(res[0]);
    }
    return res;
  }
}

export default Polygon;
