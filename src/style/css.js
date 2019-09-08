import unit from './unit';
import font from './font';
import reset from './reset';
import util from '../util';

function normalize(style) {
  // 默认reset
  reset.forEach(item => {
    if(!style.hasOwnProperty(item.k)) {
      style[item.k] = item.v;
    }
  });
  // 处理缩写
  if(style.background) {
    let bgc = /#[0-9a-f]{3,6}/i.exec(style.background);
    if(bgc && [4, 7].indexOf(bgc[0].length) > -1) {
      style.backgroundColor = bgc[0];
    }
  }
  if(style.flex) {
    if(style.flex === 'none') {
      style.flexGrow = 0;
      style.flexShrink = 0;
      style.flexBasis = 'auto';
    }
    else if(style.flex === 'auto') {
      style.flexGrow = 1;
      style.flexShrink = 1;
      style.flexBasis = 'auto';
    }
    else if(/^\d+$/.test(style.flex)) {
      style.flexGrow = parseInt(style.flex);
      style.flexShrink = 1;
      style.flexBasis = 0;
    }
    else {
      style.flexGrow = 0;
      style.flexShrink = 1;
      style.flexBasis = 'auto';
    }
  }
  // 转化不同单位值为对象标准化
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
    'height',
    'flexBasis'
  ].forEach(k => {
    let v = style[k];
    // 编译工具前置解析优化跳出
    if(!util.isNil(v) && v.unit) {
      return;
    }
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
    lineHeight = {
      value: style.fontSize * font.arial.lhr,
      unit: unit.PX,
    };
  }
  else if(/px$/.test(lineHeight)) {
    lineHeight = parseFloat(lineHeight);
    lineHeight = {
      value: Math.max(style.fontSize, lineHeight),
      unit: unit.PX,
    };
  }
  // 纯数字比例
  else {
    lineHeight = parseFloat(lineHeight) || 'normal';
    // 非法数字
    if(lineHeight === 'normal') {
      lineHeight = {
        value: style.fontSize * font.arial.lhr,
        unit: unit.PX,
      };
    }
    else {
      lineHeight = {
        value: lineHeight * style.fontSize,
        unit: unit.PX,
      };
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
  return (style.lineHeight.value - normal) * 0.5 + style.fontSize * font.arial.blr;
}

export default {
  normalize,
  setFontStyle,
  getBaseLine,
};
