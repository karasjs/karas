import unit from './unit';
import font from './font';
import reset from './reset';
import gradient from './gradient';

function parserOneBorder(style, direction) {
  let key = `border${direction}`;
  if(!style[key]) {
    return;
  }
  let w = /\b[\d.]+px\b/i.exec(style[key]);
  if(w) {
    style[key + 'Width'] = w[0];
  }
  let s = /\b(solid|dashed|dotted)\b/i.exec(style[key]);
  if(s) {
    style[key + 'Style'] = s[1];
  }
  let c = /#[0-9a-f]{3,6}/i.exec(style[key]);
  if(c && [4, 7].indexOf(c[0].length) > -1) {
    style[key + 'Color'] = c[0];
  }
  else if(/\btransparent\b/i.test(style[key])) {
    style[key + 'Color'] = 'transparent';
  }
  else {
    c = /rgba?\(.+\)/i.exec(style[key]);
    if(c) {
      style[key + 'Color'] = c[0];
    }
  }
}

function calUnit(obj, k, v) {
  if(v === 'auto') {
    obj[k] = {
      unit: unit.AUTO,
    };
  }
  else if(/px$/.test(v)) {
    v = parseFloat(v) || 0;
    obj[k] = {
      value: v,
      unit: unit.PX,
    };
  }
  else if(/%$/.test(v)) {
    // border不支持百分比
    if(k.toString().indexOf('border') === 0) {
      obj[k] = {
        value: 0,
        unit: unit.PX,
      };
    }
    else {
      v = parseFloat(v) || 0;
      obj[k] = {
        value: v,
        unit: unit.PERCENT,
      };
    }
  }
  else {
    v = parseFloat(v) || 0;
    obj[k] = {
      value: v,
      unit: unit.PX,
    };
  }
  return obj;
}

function normalize(style) {
  // 默认reset
  reset.forEach(item => {
    if(!style.hasOwnProperty(item.k)) {
      style[item.k] = item.v;
    }
  });
  let temp = style.background;
  // 处理渐变背景色
  if(temp) {
    // 优先gradient，没有再考虑颜色
    let gd = gradient.parseGradient(temp);
    if(gd) {
      style.backgroundGradient = gd;
    }
    else {
      let bgc = /#[0-9a-f]{3,6}/i.exec(temp);
      if(bgc && [4, 7].indexOf(bgc[0].length) > -1) {
        style.backgroundColor = bgc[0];
      } else {
        bgc = /rgba?\(.+\)/i.exec(temp);
        if(bgc) {
          style.backgroundColor = bgc[0];
        }
      }
    }
  }
  // 处理缩写
  temp = style.flex;
  if(temp) {
    if(temp === 'none') {
      style.flexGrow = 0;
      style.flexShrink = 0;
      style.flexBasis = 'auto';
    }
    else if(temp === 'auto') {
      style.flexGrow = 1;
      style.flexShrink = 1;
      style.flexBasis = 'auto';
    }
    else if(/^[\d.]+$/.test(temp)) {
      style.flexGrow = parseFloat(temp);
      style.flexShrink = 1;
      style.flexBasis = 0;
    }
    else if(/^[\d.]+px$/.test(temp)) {}
    else if(/^[\d.]+%$/.test(temp)) {}
    else {
      style.flexGrow = 0;
      style.flexShrink = 1;
      style.flexBasis = 'auto';
    }
  }
  temp = style.border;
  if(temp) {
    style.borderTop = style.borderRight = style.borderBottom = style.borderLeft = temp;
  }
  temp = style.margin;
  if(temp) {
    let match = temp.toString().match(/(-?[\d.]+(px|%)?)|(auto)/ig);
    if(match) {
      if(match.length === 1) {
        match[3] = match[2] = match[1] = match[0];
      }
      else if(match.length === 2) {
        match[2] = match[0];
        match[3] = match[1];
      }
      else if(match.length === 3) {
        match[3] = match[1];
      }
      style.marginTop = match[0];
      style.marginRight = match[1];
      style.marginBottom = match[2];
      style.marginLeft = match[3];
    }
  }
  temp = style.padding;
  if(temp) {
    let match = temp.toString().match(/(-?[\d.]+(px|%)?)|(auto)/ig);
    if(match) {
      if(match.length === 1) {
        match[3] = match[2] = match[1] = match[0];
      }
      else if(match.length === 2) {
        match[2] = match[0];
        match[3] = match[1];
      }
      else if(match.length === 3) {
        match[3] = match[1];
      }
      style.paddingTop = match[0];
      style.paddingRight = match[1];
      style.paddingBottom = match[2];
      style.paddingLeft = match[3];
    }
  }
  temp = style.transform;
  if(temp) {
    let match = temp.toString().match(/\w+\(.+?\)/g);
    if(match) {
      let transform = style.transform = [];
      match.forEach(item => {
        let i = item.indexOf('(');
        let k = item.slice(0, i);
        let v = item.slice(i + 1, item.length - 1);
        if(k === 'matrix') {
          let arr = v.split(/\s*,\s*/);
          arr = arr.map(item => parseFloat(item));
          if(arr.length > 6) {
            arr = arr.slice(0, 6);
          }
          if(arr.length === 6) {
            transform.push(['matrix', arr]);
          }
        }
        else if(k === 'translateX') {
          let arr = ['translateX', v];
          transform.push(calUnit(arr, 1, v));
        }
        else if(k === 'translateY') {
          let arr = ['translateY', v];
          transform.push(calUnit(arr, 1, v));
        }
        else if(k === 'translate') {
          let arr = v.split(/\s*,\s*/);
          let arr1 = ['translateX', arr[0]];
          let arr2 = ['translateY', arr[1]];
          transform.push(calUnit(arr1, 1, v));
          transform.push(calUnit(arr2, 1, v));
        }
        else if(k === 'scaleX') {
          transform.push(['scaleX', parseFloat(v) || 0]);
        }
        else if(k === 'scaleY') {
          transform.push(['scaleY', parseFloat(v) || 0]);
        }
        else if(k === 'scale') {
          let arr = v.split(/\s*,\s*/);
          let x = parseFloat(arr[0]) || 0;
          let y = parseFloat(arr[arr.length - 1]) || 0;
          transform.push(['scaleX', x]);
          transform.push(['scaleY', y]);
        }
        else if(k === 'rotateZ' || k === 'rotate') {
          transform.push(['rotateZ', parseFloat(v) || 0]);
        }
        else if(k === 'skewX') {
          transform.push(['skewX', parseFloat(v) || 0]);
        }
        else if(k === 'skewY') {
          transform.push(['skewY', parseFloat(v) || 0]);
        }
        else if(k === 'skew') {
          let arr = v.split(/\s*,\s*/);
          let x = parseFloat(arr[0]) || 0;
          let y = parseFloat(arr[arr.length - 1]) || 0;
          transform.push(['skewX', x]);
          transform.push(['skewY', y]);
        }
      });
    }
  }
  temp = style.transformOrigin;
  if(temp) {
    let match = temp.toString().match(/(-?[\d.]+(px|%)?)|(left|top|right|bottom|center)/ig);
    if(match) {
      if(match.length === 1) {
        match[1] = match[0];
      }
      let tfo = [];
      for(let i = 0; i < 2; i++) {
        let item = match[i];
        if(/px$/.test(item)) {
          tfo.push({
            value: parseFloat(item),
            unit: unit.PX,
          });
        }
        else if(/%$/.test(item)) {
          tfo.push({
            value: parseFloat(item),
            unit: unit.PERCENT,
          });
        }
        else {
          tfo.push({
            value: item,
            unit: unit.POSITION,
          });
        }
      }
      style.transformOrigin = tfo;
    }
  }
  parserOneBorder(style, 'Top');
  parserOneBorder(style, 'Right');
  parserOneBorder(style, 'Bottom');
  parserOneBorder(style, 'Left');
  // 转化不同单位值为对象标准化
  [
    'marginTop',
    'marginRight',
    'marginBottom',
    'marginLeft',
    'paddingTop',
    'paddingRight',
    'paddingBottom',
    'paddingLeft',
    'borderTopWidth',
    'borderRightWidth',
    'borderBottomWidth',
    'borderLeftWidth',
    'borderTopLeftRadius',
    'borderTopRightRadius',
    'borderBottomLeftRadius',
    'borderBottomRightRadius',
    'top',
    'right',
    'bottom',
    'left',
    'width',
    'height',
    'flexBasis',
  ].forEach(k => {
    let v = style[k];
    calUnit(style, k, v);
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
  fontFamily = 'arial';
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
