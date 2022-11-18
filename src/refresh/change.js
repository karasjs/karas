import reset from '../style/reset';
import enums from '../util/enums';

const { DOM: RESET_DOM, GEOM: RESET_GEOM } = reset;
const { STYLE_KEY } = enums;
const {
  POINTER_EVENTS,
  COLOR,
  STROKE_WIDTH,
  FILL,
  STROKE_DASHARRAY,
  STROKE_LINECAP,
  STROKE_LINEJOIN,
  STROKE_MITERLIMIT,
  BACKGROUND_COLOR,
  BACKGROUND_IMAGE,
  BACKGROUND_POSITION_X,
  BACKGROUND_POSITION_Y,
  BACKGROUND_REPEAT,
  BACKGROUND_SIZE,
  STROKE,
  BORDER_BOTTOM_COLOR,
  BORDER_LEFT_COLOR,
  BORDER_RIGHT_COLOR,
  BORDER_TOP_COLOR,
  BORDER_TOP_LEFT_RADIUS,
  BORDER_TOP_RIGHT_RADIUS,
  BORDER_BOTTOM_RIGHT_RADIUS,
  BORDER_BOTTOM_LEFT_RADIUS,
  VISIBILITY,
  BOX_SHADOW,
  OVERFLOW,
  BACKGROUND_CLIP,
  TEXT_STROKE_WIDTH,
  TEXT_STROKE_COLOR,
  TEXT_STROKE_OVER,
  TRANSLATE_PATH,
  TRANSFORM_STYLE,
} = STYLE_KEY;

const GEOM = {};
const GEOM_KEY_SET = [];

let o = {
  GEOM,
  GEOM_KEY_SET,
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
  isIgnore(k) {
    return k === POINTER_EVENTS || k === TRANSLATE_PATH;
  },
  isGeom(tagName, k) {
    return tagName && k && GEOM.hasOwnProperty(k) && GEOM[k].hasOwnProperty(tagName);
  },
  isRepaint(k, tagName) {
    return k === COLOR || k === STROKE_WIDTH || k === FILL || k === STROKE_DASHARRAY || k === STROKE_LINECAP
      || k === STROKE_LINEJOIN || k === STROKE_MITERLIMIT || k === BACKGROUND_COLOR || k === BACKGROUND_IMAGE
      || k === BACKGROUND_POSITION_X || k === BACKGROUND_POSITION_Y || k === BACKGROUND_REPEAT
      || k === BACKGROUND_SIZE || k === STROKE || k === BORDER_BOTTOM_COLOR || k === BORDER_LEFT_COLOR
      || k === BORDER_BOTTOM_COLOR || k === BORDER_RIGHT_COLOR || k === BORDER_TOP_COLOR
      || k === BORDER_TOP_LEFT_RADIUS || k === BORDER_TOP_RIGHT_RADIUS || k === BORDER_BOTTOM_RIGHT_RADIUS
      || k === BORDER_BOTTOM_LEFT_RADIUS || k === VISIBILITY || k === BOX_SHADOW || k === OVERFLOW
      || k === BACKGROUND_CLIP || k === TEXT_STROKE_WIDTH || k === TEXT_STROKE_COLOR || k === TEXT_STROKE_OVER
      || k === TRANSFORM_STYLE || o.isGeom(tagName, k);
  },
  isValid(tagName, k) {
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
  },
};

o.addGeom('$line', ['xa', 'ya', 'xb', 'yb', 'controlA', 'controlB', 'start', 'end']);
o.addGeom('$circle', ['r']);
o.addGeom('$ellipse', ['rx', 'ry']);
o.addGeom('$rect', ['rx', 'ry']);
o.addGeom('$sector', ['begin', 'end', 'edge', 'closure']);
o.addGeom('$polyline', ['points', 'controls', 'start', 'end']);
o.addGeom('$polygon', ['points', 'controls', 'start', 'end', 'booleanOperations']);

export default o;
