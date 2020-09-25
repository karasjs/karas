import reset from '../style/reset';
import unit from '../style/unit';

let o = {
  GEOM: {
  },
  IGNORE: {
    pointerEvents: true,
  },
  REPAINT: {
    transform: true,
    translateX: true,
    translateY: true,
    skewX: true,
    skewY: true,
    scaleX: true,
    scaleY: true,
    rotateZ: true,
    color: true,
    fontStyle: true,
    strokeWidth: true,
    fill: true,
    strokeDasharray: true,
    strokeLinecap: true,
    strokeLinejoin: true,
    strokeMiterlimit: true,
    backgroundColor: true,
    backgroundImage: true,
    backgroundPositionX: true,
    backgroundPositionY: true,
    backgroundRepeat: true,
    backgroundSize: true,
    stroke: true,
    borderBottomColor: true,
    borderLeftColor: true,
    borderRightColor: true,
    borderTopColor: true,
    borderTopLeftRadius: true,
    borderTopRightRadius: true,
    borderBottomRightRadius: true,
    borderBottomLeftRadius: true,
    visibility: true,
    opacity: true,
    zIndex: true,
    filter: true,
    boxShadow: true,
  },
  MEASURE: {
    fontSize: true,
    fontWeight: true,
    fontFamily: true,
  },
  isIgnore(k) {
    return this.IGNORE.hasOwnProperty(k);
  },
  isRepaint(k) {
    return this.REPAINT.hasOwnProperty(k) || this.isGeom(k);
  },
  isMeasure(k) {
    return this.MEASURE.hasOwnProperty(k);
  },
  addGeom(tagName, ks) {
    if(Array.isArray(ks)) {
      ks.forEach(k => {
        o.addGeom(tagName, k);
      });
    }
    else if(ks) {
      let list = o.GEOM[ks] = o.GEOM[ks] || {};
      list[tagName] = true;
    }
  },
  isGeom(tagName, k) {
    return this.GEOM.hasOwnProperty(k) && this.GEOM[k].hasOwnProperty(tagName);
  },
  isValid(tagName, k) {
    if(!k) {
      return false;
    }
    if(reset.DOM.hasOwnProperty(k)) {
      return true;
    }
    // geom的fill等矢量才有的样式
    if(tagName.charAt(0) === '$' && reset.GEOM.hasOwnProperty(k)) {
      return true;
    }
    if(this.GEOM.hasOwnProperty(k)) {
      return this.GEOM[k].hasOwnProperty(tagName);
    }
    return false;
  },
};

let MEASURE_KEY_SET = o.MEASURE_KEY_SET = Object.keys(o.MEASURE);
let len = MEASURE_KEY_SET.length;
o.isMeasureInherit = function(target) {
  for(let i = 0; i < len; i++) {
    let k = MEASURE_KEY_SET[i];
    if(target.hasOwnProperty(k) && target[k].unit === unit.INHERIT) {
      return true;
    }
  }
  return false;
};
o.measureInheritList = function(target) {
  let list = [];
  for(let i = 0; i < len; i++) {
    let k = MEASURE_KEY_SET[i];
    if(target.hasOwnProperty(k) && target[k].unit === unit.INHERIT) {
      list.push(k);
    }
  }
  return list;
};

o.addGeom('$line', ['x1', 'y1', 'x2', 'y2', 'controlA', 'controlB']);
o.addGeom('$circle', ['r']);
o.addGeom('$ellipse', ['rx', 'ry']);
o.addGeom('$rect', ['rx', 'ry']);
o.addGeom('$sector', ['begin', 'end', 'edge', 'closure']);
o.addGeom('$polyline', ['points', 'controls']);
o.addGeom('$polygon', ['points', 'controls']);

export default o;
