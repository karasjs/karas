import Polyline from './Polyline';

class Polygon extends Polyline {
  constructor(tagName, props) {
    super(tagName, props);
  }

  __getPoints(originX, originY, width, height, points, controls) {
    let [pts, cls, hasControl] = super.__getPoints(originX, originY, width, height, points, controls);
    pts.push(pts[0]);
    return [pts, cls, hasControl];
  }
}

export default Polygon;
