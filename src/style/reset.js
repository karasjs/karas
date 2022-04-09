import inject from '../util/inject';

const DOM = {
  position: 'static',
  display: 'block',
  top: 'auto',
  right: 'auto',
  bottom: 'auto',
  left: 'auto',
  marginTop: 0,
  marginRight: 0,
  marginBottom: 0,
  marginLeft: 0,
  paddingTop: 0,
  paddingRight: 0,
  paddingBottom: 0,
  paddingLeft: 0,
  fontSize: 'inherit',
  fontFamily: 'inherit',
  color: 'inherit',
  fontStyle: 'inherit',
  fontWeight: 'inherit',
  lineHeight: 'inherit',
  backgroundImage: null,
  backgroundColor: 'transparent',
  backgroundSize: 'auto',
  backgroundRepeat: 'repeat',
  backgroundPositionX: 0,
  backgroundPositionY: 0,
  backgroundClip: 'borderBox',
  borderTopWidth: 0,
  borderRightWidth: 0,
  borderBottomWidth: 0,
  borderLeftWidth: 0,
  borderTopColor: 'transparent',
  borderRightColor: 'transparent',
  borderBottomColor: 'transparent',
  borderLeftColor: 'transparent',
  borderTopStyle: 'none',
  borderRightStyle: 'none',
  borderBottomStyle: 'none',
  borderLeftStyle: 'none',
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0,
  borderBottomRightRadius: 0,
  borderBottomLeftRadius: 0,
  width: 'auto',
  height: 'auto',
  flexGrow: 0,
  flexShrink: 1,
  flexBasis: 'auto',
  flexDirection: 'row',
  flexWrap: 'nowrap',
  order: 0,
  justifyContent: 'flexStart',
  alignItems: 'stretch',
  alignSelf: 'auto',
  alignContent: 'stretch',
  textAlign: 'inherit',
  letterSpacing: 'inherit',
  transformOrigin: 'center',
  visibility: 'inherit',
  opacity: 1,
  zIndex: 0,
  transform: null,
  translateX: 0,
  translateY: 0,
  translateZ: 0,
  scaleX: 1,
  scaleY: 1,
  scaleZ: 1,
  skewX: 0,
  skewY: 0,
  rotateX: 0,
  rotateY: 0,
  rotateZ: 0,
  rotate3d: '0, 0, 0, 0',
  perspective: 0,
  perspectiveOrigin: 'center',
  filter: null,
  boxShadow: null,
  pointerEvents: 'inherit',
  overflow: 'visible',
  mixBlendMode: 'normal',
  whiteSpace: 'inherit',
  textOverflow: 'clip',
  lineClamp: 0,
  textStrokeWidth: 'inherit',
  textStrokeColor: 'inherit',
  textStrokeOver: 'inherit',
  writingMode: 'inherit',
};

const GEOM = {
  fill: 'transparent',
  stroke: '#000',
  strokeWidth: 1,
  strokeDasharray: '',
  strokeLinecap: 'butt',
  strokeLinejoin: 'miter',
  strokeMiterlimit: 4,
  fillRule: 'nonzero',
};

const DOM_ENTRY_SET = [];
const DOM_KEY_SET = [];
Object.keys(DOM).forEach(k => {
  DOM_KEY_SET.push(k);
  let v = DOM[k];
  DOM_ENTRY_SET.push({
    k,
    v,
  });
});

const GEOM_ENTRY_SET = [];
const GEOM_KEY_SET = [];
Object.keys(GEOM).forEach(k => {
  GEOM_KEY_SET.push(k);
  let v = GEOM[k];
  GEOM_ENTRY_SET.push({
    k,
    v,
  });
});

const INHERIT = {
  get fontFamily() {
    return inject.defaultFontFamily;
  },
  fontSize: 16,
  fontWeight: 400,
  fontStyle: 'normal',
  color: '#000',
  textAlign: 'left',
  visibility: 'visible',
  pointerEvents: 'auto',
  textStrokeColor: '#000',
  textStrokeWidth: 1,
  textStrokeOver: 'none',
  writingMode: 'horizontalTb',
};

const INHERIT_KEY_SET = [];
Object.keys(INHERIT).forEach(k => {
  INHERIT_KEY_SET.push(k);
});

// 默认值放第一个
const VALID_STRING_VALUE = {
  position: ['static', 'relative', 'absolute'],
  display: ['block', 'inlineBlock', 'inline', 'flex', 'none'],
  flexDirection: ['row', 'column', 'rowReverse', 'columnReverse'],
  flexWrap: ['wrap', 'wrapReverse', 'noWrap'],
  justifyContent: ['flexStart', 'center', 'flexEnd', 'spaceBetween', 'spaceAround', 'spaceEvenly'],
  alignItems: ['stretch', 'flexStart', 'center', 'flexEnd', 'baseline'],
  alignSelf: ['auto', 'stretch', 'flexStart', 'center', 'flexEnd', 'baseline'],
  overflow: ['visible', 'hidden'],
  mixBlendMode: ['normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten',
    'colorDodge', 'colorBurn', 'hardLight', 'softLight', 'difference', 'exclusion',
    'hue', 'saturation', 'color', 'luminosity'],
  borderTopStyle: ['solid', 'dashed', 'dotted'],
  borderRightStyle: ['solid', 'dashed', 'dotted'],
  borderBottomStyle: ['solid', 'dashed', 'dotted'],
  borderLeftStyle: ['solid', 'dashed', 'dotted'],
  backgroundClip: ['borderBox', 'paddingBox', 'contentBox'],
  textOverflow: ['clip', 'ellipsis'],
  alignContent: ['stretch', 'flexStart', 'center', 'flexEnd', 'spaceBetween', 'spaceAround'],
}

export default {
  DOM,
  GEOM,
  isValid(i) {
    return DOM.hasOwnProperty(i) || GEOM.hasOwnProperty(i);
  },
  DOM_KEY_SET,
  GEOM_KEY_SET,
  DOM_ENTRY_SET,
  GEOM_ENTRY_SET,
  INHERIT,
  INHERIT_KEY_SET,
  VALID_STRING_VALUE,
};
