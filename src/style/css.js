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
      v = parseFloat(v) || 0;
      style[k] = {
        value: Math.max(v, 0),
        unit: unit.PX,
      };
    }
  });
  // 计算lineHeight为px值，最小范围
  let lineHeight = style.lineHeight;
  if(lineHeight === 'normal') {
    lineHeight = style.fontSize * font.arial.lhr;
  }
  else if(/px$/.test(lineHeight)) {
    lineHeight = parseFloat(lineHeight);
    lineHeight = Math.max(style.fontSize, lineHeight);
  }
  // 纯数字比例
  else {
    lineHeight = parseFloat(lineHeight) || 'normal';
    if(lineHeight === 'normal') {
      lineHeight = style.fontSize * font.arial.lhr;
    }
    else {
      lineHeight *= style.fontSize;
    }
  }
  style.lineHeight = lineHeight;
}

function setFontStyle(style) {
  let { fontStyle, fontWeight, fontSize, fontFamily } = style;
  return `${fontStyle} ${fontWeight} ${fontSize}px/${fontSize}px ${fontFamily}`;
}

function getBaseLine(style) {
  let normal = style.fontSize * font.arial.lhr;
  return (style.lineHeight - normal) * 0.5 + style.fontSize * font.arial.blr;
}

export default {
  normalize,
  setFontStyle,
  getBaseLine,
};
