import util from '../util/util';

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
  justifyContent: 'flex-start',
  alignItems: 'stretch',
  textAlign: 'inherit',
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
};

const GEOM = {
  fill: 'transparent',
  stroke: '#000',
  strokeWidth: 1,
  strokeDasharray: '',
  strokeLinecap: 'butt',
  strokeLinejoin: 'miter',
  strokeMiterlimit: 4,
};

let dom = [];
let domKey = [];
Object.keys(DOM).forEach(k => {
  domKey.push(k);
  let v = DOM[k];
  dom.push({
    k,
    v,
  });
});

let geom = [];
let geomKey = [];
Object.keys(GEOM).forEach(k => {
  geomKey.push(k);
  let v = GEOM[k];
  geom.push({
    k,
    v,
  });
});

export default {
  DOM,
  GEOM,
  domKey,
  geomKey,
  dom,
  geom,
};
