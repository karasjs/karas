import reset from '../style/reset';
import unit from '../style/unit';
import enums from '../util/enums';

const { DOM: RESET_DOM, GEOM: RESET_GEOM } = reset;
const { INHERIT } = unit;
const { STYLE_KEY } = enums;

const GEOM = {};
const GEOM_KEY_SET = [];
const IGNORE = {
  [STYLE_KEY.POINTER_EVENTS]: true,
};
const REPAINT = {
  [STYLE_KEY.TRANSFORM]: true,
  [STYLE_KEY.TRANSLATE_X]: true,
  [STYLE_KEY.TRANSLATE_Y]: true,
  [STYLE_KEY.SKEW_X]: true,
  [STYLE_KEY.SKEW_Y]: true,
  [STYLE_KEY.SCALE_X]: true,
  [STYLE_KEY.SCALE_Y]: true,
  [STYLE_KEY.ROTATE_Z]: true,
  [STYLE_KEY.COLOR]: true,
  [STYLE_KEY.FONT_STYLE]: true,
  [STYLE_KEY.STROKE_WIDTH]: true,
  [STYLE_KEY.FILL]: true,
  [STYLE_KEY.STROKE_DASHARRAY]: true,
  [STYLE_KEY.STROKE_LINECAP]: true,
  [STYLE_KEY.STROKE_LINEJOIN]: true,
  [STYLE_KEY.STROKE_MITERLIMIT]: true,
  [STYLE_KEY.BACKGROUND_COLOR]: true,
  [STYLE_KEY.BACKGROUND_IMAGE]: true,
  [STYLE_KEY.BACKGROUND_POSITION_X]: true,
  [STYLE_KEY.BACKGROUND_POSITION_Y]: true,
  [STYLE_KEY.BACKGROUND_REPEAT]: true,
  [STYLE_KEY.BACKGROUND_SIZE]: true,
  [STYLE_KEY.STROKE]: true,
  [STYLE_KEY.BORDER_BOTTOM_COLOR]: true,
  [STYLE_KEY.BORDER_LEFT_COLOR]: true,
  [STYLE_KEY.BORDER_RIGHT_COLOR]: true,
  [STYLE_KEY.BORDER_TOP_COLOR]: true,
  [STYLE_KEY.BORDER_TOP_LEFT_RADIUS]: true,
  [STYLE_KEY.BORDER_TOP_RIGHT_RADIUS]: true,
  [STYLE_KEY.BORDER_BOTTOM_RIGHT_RADIUS]: true,
  [STYLE_KEY.BORDER_BOTTOM_LEFT_RADIUS]: true,
  [STYLE_KEY.VISIBILITY]: true,
  [STYLE_KEY.OPACITY]: true,
  [STYLE_KEY.Z_INDEX]: true,
  [STYLE_KEY.FILTER]: true,
  [STYLE_KEY.BOX_SHADOW]: true,
  [STYLE_KEY.OVERFLOW]: true,
  [STYLE_KEY.BACKGROUND_CLIP]: true,
};
const MEASURE = {
  [STYLE_KEY.FONT_SIZE]: true,
  [STYLE_KEY.FONT_WEIGHT]: true,
  [STYLE_KEY.FONT_FAMILY]: true,
};

let o = {
  GEOM,
  GEOM_KEY_SET,
  IGNORE,
  REPAINT,
  MEASURE,
  addGeom(tagName, ks, cb) {
    if(Array.isArray(ks)) {
      ks.forEach(k => {
        o.addGeom(tagName, k, cb);
      });
    }
    else if(ks) {
      if(!GEOM.hasOwnProperty(ks)) {
        GEOM_KEY_SET.push(ks);
      }
      let hash = GEOM[ks] = GEOM[ks] || {};
      hash[tagName] = cb || true;
    }
  },
};

o.isIgnore = function(k) {
  return IGNORE.hasOwnProperty(k);
};
function isGeom(tagName, k) {
  return GEOM.hasOwnProperty(k) && GEOM[k].hasOwnProperty(tagName);
}
o.isGeom = isGeom;
o.isRepaint = function(k) {
  return REPAINT.hasOwnProperty(k) || isGeom(k);
};
o.isMeasure = function(k) {
  return MEASURE.hasOwnProperty(k);
};
o.isValid = function(tagName, k) {
  if(!k) {
    return false;
  }
  if(RESET_DOM.hasOwnProperty(k)) {
    return true;
  }
  // geom的fill等矢量才有的样式
  if(tagName.charAt(0) === '$' && RESET_GEOM.hasOwnProperty(k)) {
    return true;
  }
  if(GEOM.hasOwnProperty(k)) {
    return GEOM[k].hasOwnProperty(tagName);
  }
  if(k === 'translatePath') {
    return true;
  }
  return false;
};

let MEASURE_KEY_SET = o.MEASURE_KEY_SET = Object.keys(MEASURE).map(i => parseInt(i));
let len = MEASURE_KEY_SET.length;
o.isMeasureInherit = function(target) {
  if(target) {
    for(let i = 0; i < len; i++) {
      let k = MEASURE_KEY_SET[i];
      if(target.hasOwnProperty(k) && target[k][1] === INHERIT) {
        return true;
      }
    }
  }
  return false;
};
o.measureInheritList = function(target) {
  let list = [];
  for(let i = 0; i < len; i++) {
    let k = MEASURE_KEY_SET[i];
    if(target.hasOwnProperty(k) && target[k][1] === INHERIT) {
      list.push(k);
    }
  }
  return list;
};

o.addGeom('$line', ['x1', 'y1', 'x2', 'y2', 'controlA', 'controlB', 'start', 'end']);
o.addGeom('$circle', ['r']);
o.addGeom('$ellipse', ['rx', 'ry']);
o.addGeom('$rect', ['rx', 'ry']);
o.addGeom('$sector', ['begin', 'end', 'edge', 'closure']);
o.addGeom('$polyline', ['points', 'controls', 'start', 'end']);
o.addGeom('$polygon', ['points', 'controls', 'start', 'end']);

export default o;
