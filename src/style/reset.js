const RESET = {
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
  fontFamily: 'arial',
  color: 'inherit',
  fontStyle: 'inherit',
  fontWeight: 'inherit',
  lineHeight: 'normal',
  backgroundColor: 'transparent',
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
  width: 'auto',
  height: 'auto',
  flexGrow: 0,
  flexShrink: 1,
  flexBasis: 'auto',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'stretch',
  textAlign: 'inherit',
  visibility: 'visible',
  transformOrigin: 'center',
  fill: 'transparent',
  stroke: '#000',
  strokeWidth: 1,
  strokeDasharray: [],
};

let reset = [];

Object.keys(RESET).forEach(k => {
  let v = RESET[k];
  reset.push({
    k,
    v,
  });
});

export default reset;
