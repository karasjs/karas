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
  lineHeight: 'normal',
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
  borderTopColor: '#000',
  borderRightColor: '#000',
  borderBottomColor: '#000',
  borderLeftColor: '#000',
  borderTopStyle: 'solid',
  borderRightStyle: 'solid',
  borderBottomStyle: 'solid',
  borderLeftStyle: 'solid',
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
  justifyContent: 'flexStart',
  alignItems: 'stretch',
  alignSelf: 'auto',
  textAlign: 'inherit',
  letterSpacing: 'inherit',
  transformOrigin: 'center',
  visibility: 'inherit',
  opacity: 1,
  zIndex: 0,
  transform: null,
  translateX: 0,
  translateY: 0,
  scaleX: 1,
  scaleY: 1,
  skewX: 0,
  skewY: 0,
  rotateZ: 0,
  filter: null,
  boxShadow: null,
  pointerEvents: 'inherit',
  overflow: 'visible',
  mixBlendMode: 'normal',
  whiteSpace: 'inherit',
  textOverflow: 'clip',
  lineClamp: 0,
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

let DOM_ENTRY_SET = [];
let DOM_KEY_SET = [];
Object.keys(DOM).forEach(k => {
  DOM_KEY_SET.push(k);
  let v = DOM[k];
  DOM_ENTRY_SET.push({
    k,
    v,
  });
});

let GEOM_ENTRY_SET = [];
let GEOM_KEY_SET = [];
Object.keys(GEOM).forEach(k => {
  GEOM_KEY_SET.push(k);
  let v = GEOM[k];
  GEOM_ENTRY_SET.push({
    k,
    v,
  });
});

let INHERIT = {
  fontFamily: 'arial',
  fontSize: 16,
  fontWeight: 400,
  fontStyle: 'normal',
  color: '#000',
  textAlign: 'left',
  visibility: 'visible',
  pointerEvents: 'auto',
};

let INHERIT_KEY_SET = [];
Object.keys(INHERIT).forEach(k => {
  INHERIT_KEY_SET.push(k);
});

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
};
