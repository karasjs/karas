import unit from './unit';
import font from "./font";

function normalize(style) {
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

// 防止小行高，仅支持lineHeight>=1的情况
function limitLineHeight(style) {
  let { fontSize, lineHeight } = style;
  lineHeight = getLineHeightByFontAndLineHeight(fontSize, lineHeight);
  style.lineHeight = lineHeight;
  normalize(style);
}

function getLineHeightByFontAndLineHeight(fontSize, lineHeight) {
  if(lineHeight === 0) {
    return fontSize * font.arial.lhr;
  }
  return Math.max(lineHeight, fontSize * font.arial.car);
}

function getBaseLineByFont(style) {
  return style.fontSize * font.arial.blr;
}

export default {
  normalize,
  setFontStyle,
  limitLineHeight,
  getBaseLineByFont,
};
