import unit from './unit';

function regularized(style) {
  [
    'marginTop',
    'marginRight',
    'marginDown',
    'marginLeft',
    'paddingTop',
    'paddingRight',
    'paddingDown',
    'paddingLeft',
    'borderTopWidth',
    'borderRightWidth',
    'borderBottomWidth',
    'borderLeftWidth',
    'width',
    'height'
  ].forEach(k => {
    let v = style[k];
    if(v === 'auto') {
      style[k] = {
        unit: unit.AUTO,
      };
    }
    else if(/%$/.test(v)) {
      v = parseFloat(v) || 0;
      if(v <= 0) {
        style[k] = {
          value: 0,
          unit: unit.PX,
        };
      }
      else {
        style[k] = {
          value: v,
          unit: unit.PERCENT,
        };
      }
    }
    else {
      v = parseInt(v) || 0;
      style[k] = {
        value: Math.max(v, 0),
        unit: unit.PX,
      };
    }
  });
}

function setFontStyle(style) {
  let { fontStyle, fontWeight, fontSize, fontFamily } = style;
  return `${fontStyle} ${fontWeight} ${fontSize}px/${fontSize}px ${fontFamily}`;
}

export default {
  regularized,
  setFontStyle,
};
