import enums from '../util/enums';

const { STYLE_KEY } = enums;

const {
  BACKGROUND_COLOR,
  BORDER_BOTTOM_COLOR,
  BORDER_LEFT_COLOR,
  BORDER_RIGHT_COLOR,
  BORDER_TOP_COLOR,
  COLOR, // 特殊，新增GRADIENT渐变色
  TEXT_STROKE_COLOR, // 同上
  FONT_SIZE,
  BORDER_BOTTOM_WIDTH,
  BORDER_LEFT_WIDTH,
  BORDER_RIGHT_WIDTH,
  BORDER_TOP_WIDTH,
  LEFT,
  TOP,
  RIGHT,
  BOTTOM,
  FLEX_BASIS,
  WIDTH,
  HEIGHT,
  LINE_HEIGHT,
  MARGIN_BOTTOM,
  MARGIN_LEFT,
  MARGIN_TOP,
  MARGIN_RIGHT,
  PADDING_TOP,
  PADDING_RIGHT,
  PADDING_BOTTOM,
  PADDING_LEFT,
  STROKE_WIDTH,
  STROKE_MITERLIMIT,
  LETTER_SPACING,
  PERSPECTIVE,
  TEXT_STROKE_WIDTH,
  TRANSLATE_X,
  TRANSLATE_Y,
  TRANSLATE_Z,
  SKEW_X,
  SKEW_Y,
  SCALE_X,
  SCALE_Y,
  SCALE_Z,
  ROTATE_X,
  ROTATE_Y,
  ROTATE_Z,
  BACKGROUND_IMAGE,
  FILL,
  STROKE,
  BORDER_TOP_LEFT_RADIUS,
  BORDER_TOP_RIGHT_RADIUS,
  BORDER_BOTTOM_RIGHT_RADIUS,
  BORDER_BOTTOM_LEFT_RADIUS,
} = STYLE_KEY;

function isColorKey(k) {
  return k === BACKGROUND_COLOR || k === BORDER_BOTTOM_COLOR
    || k === BORDER_LEFT_COLOR || k === BORDER_RIGHT_COLOR
    || k === BORDER_TOP_COLOR || k === COLOR || k === TEXT_STROKE_COLOR;
}

function isLengthKey(k) {
  return k === FONT_SIZE || k === TEXT_STROKE_WIDTH
    || k === BORDER_BOTTOM_WIDTH || k === BORDER_LEFT_WIDTH || k === BORDER_RIGHT_WIDTH || k === BORDER_TOP_WIDTH
    || k === LEFT || k === TOP || k === RIGHT || k === BOTTOM || k === FLEX_BASIS || k === WIDTH || k === HEIGHT
    || k === LINE_HEIGHT || k === MARGIN_BOTTOM || k === MARGIN_TOP || k === MARGIN_LEFT || k === MARGIN_RIGHT
    || k === PADDING_TOP || k === PADDING_RIGHT || k === PADDING_LEFT || k === PADDING_BOTTOM
    || k === STROKE_WIDTH || k === STROKE_MITERLIMIT || k === LETTER_SPACING || k === PERSPECTIVE;
}

function isExpandKey(k) {
  return k === TRANSLATE_X || k === TRANSLATE_Y || k === TRANSLATE_Z
    || k === SKEW_X || k === SKEW_Y || k === SCALE_X || k === SCALE_Y || k === SCALE_Z
    || k === ROTATE_X || k === ROTATE_Y || k === ROTATE_Z;
}

function isGradientKey(k) {
  return k === BACKGROUND_IMAGE || k === FILL || k === STROKE;
}

function isRadiusKey(k) {
  return k === BORDER_BOTTOM_LEFT_RADIUS || k === BORDER_TOP_LEFT_RADIUS
    || k === BORDER_TOP_RIGHT_RADIUS || k === BORDER_BOTTOM_RIGHT_RADIUS;
}

export default {
  isColorKey,
  isLengthKey,
  isExpandKey,
  isGradientKey,
  isRadiusKey,
};
