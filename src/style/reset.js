const RESET = {
  display: 'block',
  borderSizing: 'content-box',
  marginTop: 0,
  marginRight: 0,
  marginBottom: 0,
  marginLeft: 0,
  paddingTop: 0,
  paddingRight: 0,
  paddingBottom: 0,
  paddingLeft: 0,
  fontSize: 24,
  fontFamily: 'arial',
  color: '#000',
  fontStyle: 'normal',
  fontWeight: 400,
  lineHeight: 'normal',
  borderTopWidth: 0,
  borderRightWidth: 0,
  borderBottomWidth: 0,
  borderLeftWidth: 0,
  borderTopStyle: 'solid',
  borderRightStyle: 'solid',
  borderBottomStyle: 'solid',
  borderLeftStyle: 'solid',
  verticalAlign: 'baseline',
  width: 'auto',
  height: 'auto',
  flexGrow: 0,
  flexShrink: 1,
  flexBasis: 'auto',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItem: 'stretch',
  textAlign: 'left',
  stroke: '#000',
  strokeWidth: 1,
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
