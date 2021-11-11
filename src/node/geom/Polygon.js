import Polyline from './Polyline';

class Polygon extends Polyline {
  constructor(tagName, props) {
    super(tagName, props);
    if(Array.isArray(props.booleanOperations)) {
      this.__booleanOperations = props.booleanOperations;
    }
  }

  __getPoints(originX, originY, width, height, points, isControl) {
    let res = super.__getPoints(originX, originY, width, height, points, isControl);
    if(!isControl) {
      res.push(res[0]);
    }
    return res;
  }

  // 布尔运算覆盖，仅multi才发生，因为需要多个多边形数据
  reprocessing(list, isMulti) {
    if(!isMulti) {
      return list;
    }
  }

  get booleanOperations() {
    return this.__booleanOperations;
  }
}

export default Polygon;
