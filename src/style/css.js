import unit from './unit';
import font from './font';
import gradient from './gradient';
import reg from './reg';
import util from '../util/util';

const { AUTO, PX, PERCENT, NUMBER, INHERIT, DEG, RGBA, STRING } = unit;

const DEFAULT_FONT_SIZE = 16;

function parserOneBorder(style, direction) {
  let k = `border${direction}`;
  let v = style[k];
  if(util.isNil(v)) {
    return;
  }
  // 后面会统一格式化处理
  if(util.isNil(style[k + 'Width'])) {
    let w = /\b[\d.]+px\b/i.exec(v);
    style[k + 'Width'] = w ? w[0] : 0;
  }
  if(util.isNil(style[k + 'Style'])) {
    let s = /\b(solid|dashed|dotted)\b/i.exec(v);
    style[k + 'Style'] = s ? s[1] : 'solid';
  }
  if(util.isNil(style[k + 'Color'])) {
    let c = /#[0-9a-f]{3,6}/i.exec(v);
    if(c && [4, 7].indexOf(c[0].length) > -1) {
      style[k + 'Color'] = c[0];
    } else if(/\btransparent\b/i.test(v)) {
      style[k + 'Color'] = 'transparent';
    } else {
      c = /rgba?\(.+\)/i.exec(v);
      style[k + 'Color'] = c ? c[0] : 'transparent';
    }
  }
}

function parseFlex(style, grow, shrink, basis) {
  if(util.isNil(style.flexGrow)) {
    style.flexGrow = grow;
  }
  if(util.isNil(style.flexShrink)) {
    style.flexShrink = shrink;
  }
  if(util.isNil(style.flexBasis)) {
    style.flexBasis = basis;
  }
}

/**
 * 通用的格式化计算数值单位的方法，百分比像素auto和纯数字，直接修改传入对象本身
 * @param obj 待计算的样式对象
 * @param k 对象的key
 * @param v 对象的value
 * @returns 格式化好的样式对象本身
 */
function calUnit(obj, k, v) {
  if(v === 'auto') {
    obj[k] = {
      unit: AUTO,
    };
  }
  else if(v === 'inherit') {
    obj[k] = {
      unit: INHERIT,
    };
  }
  else if(/%$/.test(v)) {
    // border不支持百分比
    if(k.toString().indexOf('border') !== 0) {
      v = parseFloat(v) || 0;
      obj[k] = {
        value: v,
        unit: PERCENT,
      };
    }
  }
  else if(/px$/.test(v)) {
    v = parseFloat(v) || 0;
    obj[k] = {
      value: v,
      unit: PX,
    };
  }
  else if(/deg$/.test(v)) {
    v = parseFloat(v) || 0;
    obj[k] = {
      value: v,
      unit: DEG,
    };
  }
  else {
    v = parseFloat(v) || 0;
    obj[k] = {
      value: v,
      unit: NUMBER,
    };
  }
  return obj;
}

/**
 * 将传入的手写style标准化，并且用reset默认值覆盖其中为空的
 * @param style 手写的style样式
 * @param reset 默认样式
 * @returns 标准化的样式
 */
function normalize(style, reset = []) {
  // 缩写提前处理，因为reset里没有reset
  let temp = style.border;
  if(temp) {
    ['Top', 'Right', 'Bottom', 'Left'].forEach(k => {
      k = 'border' + k;
      if(util.isNil(style[k])) {
        style[k] = temp;
      }
    });
  }
  ['Top', 'Right', 'Bottom', 'Left'].forEach(k => {
    parserOneBorder(style, k);
  });
  temp = style.borderWidth;
  if(temp) {
    ['Top', 'Right', 'Bottom', 'Left'].forEach(k => {
      k = 'border' + k + 'Width';
      if(util.isNil(style[k])) {
        // width后面会统一格式化处理
        style[k] = temp;
      }
    });
  }
  temp = style.borderColor;
  if(temp) {
    ['Top', 'Right', 'Bottom', 'Left'].forEach(k => {
      k = 'border' + k + 'Color';
      if(util.isNil(style[k])) {
        style[k] = util.rgb2int(temp);
      }
    });
  }
  temp = style.borderStyle;
  if(temp) {
    ['Top', 'Right', 'Bottom', 'Left'].forEach(k => {
      k = 'border' + k + 'Style';
      if(util.isNil(style[k])) {
        style[k] = temp;
      }
    });
  }
  temp = style.background;
  // 处理渐变背景缩写
  if(temp) {
    // gradient/image和颜色可以并存
    if(util.isNil(style.backgroundImage)) {
      let gd = reg.gradient.exec(temp);
      if(gd) {
        style.backgroundImage = gd[0];
        temp = temp.replace(gd[0], '');
      }
    }
    if(util.isNil(style.backgroundImage)) {
      let img = reg.img.exec(temp);
      if(img) {
        style.backgroundImage = img[0];
        temp = temp.replace(img[0], '');
      }
    }
    if(util.isNil(style.backgroundRepeat)) {
      let repeat = /(no-)?repeat(-[xy])?/i.exec(temp);
      if(repeat && util.isNil(style.backgroundRepeat)) {
        style.backgroundRepeat = repeat[0].toLowerCase().trim();
      }
    }
    if(util.isNil(style.backgroundPosition)) {
      let position = reg.position.exec(temp);
      if(position && util.isNil(style.backgroundPosition)) {
        style.backgroundPosition = position[0].trim();
      }
    }
    if(util.isNil(style.backgroundColor)) {
      let bgc = /^(transparent)|(#[0-9a-f]{3,6})|(rgba?\(.+?\))/i.exec(temp);
      if(bgc) {
        style.backgroundColor = bgc[0];
      }
    }
  }
  // 背景位置
  temp = style.backgroundPosition;
  if(!util.isNil(temp)) {
    temp = temp.toString().split(/\s+/);
    if(temp.length === 1) {
      temp[1] = '50%';
    }
    [style.backgroundPositionX, style.backgroundPositionY] = temp;
  }
  // flex
  temp = style.flex;
  if(temp) {
    if(temp === 'none') {
      parseFlex(style, 0, 0, 'auto');
    }
    else if(temp === 'auto') {
      parseFlex(style, 1, 1, 'auto');
    }
    else if(/^[\d.]+$/.test(temp)) {
      parseFlex(style, Math.max(0, parseFloat(temp)), 1, 0);
    }
    else if(/^[\d.]+px$/.test(temp)) {
      parseFlex(style, 1, 1, 0);
    }
    else if(/^[\d.]+%$/.test(temp)) {
      parseFlex(style, 1, 1, temp);
    }
    else if(/^[\d.]+\s+[\d.]+$/.test(temp)) {
      let arr = temp.split(/\s+/);
      parseFlex(style, arr[0], arr[1], 0);
    }
    else if(/^[\d.]+\s+[\d.]+%$/.test(temp)) {
      let arr = temp.split(/\s+/);
      parseFlex(style, arr[0], 1, arr[1]);
    }
    else {
      parseFlex(style, 0, 1, 'auto');
    }
  }
  // margin
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
      ['Top', 'Right', 'Bottom', 'Left'].forEach((k, i) => {
        k = 'margin' + k;
        if(util.isNil(style[k])) {
          style[k] = match[i];
        }
      });
    }
  }
  // padding
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
      ['Top', 'Right', 'Bottom', 'Left'].forEach((k, i) => {
        k = 'padding' + k;
        if(util.isNil(style[k])) {
          style[k] = match[i];
        }
      });
    }
  }
  [
    'translateX',
    'translateY',
    'scaleX',
    'scaleY',
    'skewX',
    'skewY',
    'rotateZ',
    'rotate'
  ].forEach(k => {
    let v = style[k];
    if(!util.isNil(v) && style.transform) {
      console.error(`Can not use expand style "${k}" with "transform"`);
    }
  });
  // 默认reset，根据传入不同，当style为空时覆盖
  reset.forEach(item => {
    let { k, v } = item;
    if(util.isNil(style[k])) {
      style[k] = v;
    }
  });
  // 背景图
  temp = style.backgroundImage;
  if(temp) {
    // 区分是渐变色还是图
    if(reg.gradient.test(temp)) {
      style.backgroundImage = gradient.parseGradient(temp);
    }
    else if(reg.img.test(temp)) {
      style.backgroundImage = reg.img.exec(temp)[2];
    }
  }
  temp = style.backgroundColor;
  if(temp) {
    // 先赋值默认透明，后续操作有合法值覆盖
    let bgc = /^#[0-9a-f]{3,6}/i.exec(temp);
    if(bgc && [4, 7].indexOf(bgc[0].length) > -1) {
      style.backgroundColor = util.rgb2int(bgc[0]);
    }
    else {
      bgc = /rgba?\(.+\)/i.exec(temp);
      style.backgroundColor = util.rgb2int(bgc ? bgc[0] : [0,0,0,0]);
    }
  }
  ['backgroundPositionX', 'backgroundPositionY'].forEach(k => {
    temp = style[k];
    if(!util.isNil(temp)) {
      if(/%$/.test(temp) || /px$/.test(temp) || /^-?[\d.]+$/.test(temp)) {
        calUnit(style, k, temp);
        temp = style[k];
        if(temp.unit === NUMBER) {
          temp.unit = PX;
        }
      }
      else {
        style[k] = {
          value: 0,
          unit: PX,
        };
      }
    }
  });
  // 背景尺寸
  temp = style.backgroundSize;
  if(temp) {
    let match = temp.toString().match(/\b(?:(-?[\d.]+(px|%)?)|(contain|cover|auto))/ig);
    if(match) {
      if(match.length === 1) {
        match[1] = match[0];
      }
      let bc = [];
      for(let i = 0; i < 2; i++) {
        let item = match[i];
        if(/%$/.test(item) || /px$/.test(item)) {
          calUnit(bc, i, item);
        }
        else if(item === '0' || item === 0) {
          bc.push({
            value: 0,
            unit: PX,
          });
        }
        else if(item === 'contain' || item === 'cover') {
          bc.push({
            value: item,
            unit: STRING,
          });
        }
        else {
          bc.push({
            unit: AUTO,
          });
        }
      }
      style.backgroundSize = bc;
    }
  }
  // border-color
  ['Top', 'Right', 'Bottom', 'Left'].forEach(k => {
    k = 'border' + k + 'Color';
    let v = style[k];
    if(!util.isNil(v)) {
      style[k] = util.rgb2int(v);
    }
  });
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
          let arr = v.toString().split(/\s*,\s*/);
          arr = arr.map(item => parseFloat(item));
          if(arr.length > 6) {
            arr = arr.slice(0, 6);
          }
          if(arr.length === 6) {
            transform.push(['matrix', arr]);
          }
        }
        else if([
          'translateX',
          'translateY',
          'scaleX',
          'scaleY',
          'skewX',
          'skewY',
          'rotate',
          'rotateZ'
        ].indexOf(k) > -1) {
          if(k === 'rotate') {
            k = 'rotateZ';
          }
          let arr = calUnit([k, v], 1, v);
          if(k.indexOf('scale') === 0) {
            if(arr[1].value !== 1 && arr[1].unit === NUMBER) {
              transform.push(arr);
            }
          }
          else if(arr[1].value !== 0 && arr[1].unit !== NUMBER) {
            transform.push(arr);
          }
        }
        else if({translate: true, scale: true, skew: true}.hasOwnProperty(k)) {
          let arr = v.toString().split(/\s*,\s*/);
          if(arr.length === 1) {
            arr[1] = arr[0];
          }
          let arr1 = calUnit([`${k}X`, arr[0]], 1, arr[0]);
          let arr2 = calUnit([`${k}Y`, arr[1]], 1, arr[1]);
          if(arr1[1].value !== 0 && arr1[1].unit !== NUMBER) {
            transform.push(arr1);
          }
          if(arr2[1].value !== 0 && arr2[1].unit !== NUMBER) {
            transform.push(arr2);
          }
        }
      });
    }
  }
  temp = style.transformOrigin;
  if(!util.isNil(temp)) {
    let match = temp.toString().match(reg.position);
    if(match) {
      if(match.length === 1) {
        match[1] = match[0];
      }
      let tfo = [];
      for(let i = 0; i < 2; i++) {
        let item = match[i];
        if(/%$/.test(item) || /px$/.test(item)) {
          calUnit(tfo, i, item);
        }
        else {
          tfo.push({
            value: {
              top: 0,
              left: 0,
              center: 50,
              right: 100,
              bottom: 100,
              0: 0,
            }[item],
            unit: PERCENT,
          });
          // 不规范的写法变默认值50%
          if(util.isNil(tfo[i].value)) {
            tfo[i].value = 50;
          }
        }
      }
      style.transformOrigin = tfo;
    }
  }
  // 扩展css，将transform几个值拆分为独立的css为动画准备，同时不能使用transform
  ['translate', 'scale', 'skew'].forEach(k => {
    temp = style[k];
    if(!util.isNil(temp)) {
      let arr = temp.toString().split(/\s*,\s*/);
      if(arr.length === 1) {
        arr[1] = arr[0];
      }
      style[`${k}X`] = arr[0];
      style[`${k}Y`] = arr[1];
    }
  });
  [
    'translateX',
    'translateY',
    'scaleX',
    'scaleY',
    'skewX',
    'skewY',
    'rotateZ',
    'rotate'
  ].forEach(k => {
    let v = style[k];
    if(util.isNil(v)) {
      return;
    }
    calUnit(style, k, v);
    if(k === 'rotate') {
      k = 'rotateZ';
      style.rotateZ = style.rotate;
      delete style.rotate;
    }
    // 没有单位视作px或deg
    v = style[k];
    if(k.indexOf('scale') > -1) {
      v.unit = NUMBER;
    }
    else if(v.unit === NUMBER || v.value === 0) {
      if(k.indexOf('translate') > -1) {
        v.unit = PX;
      }
      else {
        v.unit = DEG;
      }
    }
  });
  temp = style.opacity;
  if(temp) {
    temp = parseFloat(temp);
    if(!isNaN(temp)) {
      temp = Math.max(temp, 0);
      temp = Math.min(temp, 1);
      style.opacity = temp;
    }
    else {
      style.opacity = 1;
    }
  }
  temp = style.zIndex;
  if(temp) {
    style.zIndex = parseInt(temp) || 0;
  }
  // 转化不同单位值为对象标准化，不写单位的变成number单位转化为px
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
    'top',
    'right',
    'bottom',
    'left',
    'width',
    'height',
    'flexBasis',
    'strokeWidth',
  ].forEach(k => {
    let v = style[k];
    if(util.isNil(v)) {
      return;
    }
    calUnit(style, k, v);
    v = style[k];
    // 无单位视为px
    if(v.unit === NUMBER) {
      v.unit = PX;
    }
  });
  temp = style.color;
  if(temp) {
    if(temp === 'inherit') {
      style.color = {
        unit: INHERIT,
      };
    }
    else {
      style.color = {
        value: util.rgb2int(temp),
        unit: RGBA,
      };
    }
  }
  temp = style.fontSize;
  if(temp || temp === 0 || temp === '0') {
    if(temp === 'inherit') {
      style.fontSize = {
        unit: INHERIT,
      };
    }
    else if(/%$/.test(temp)) {
      let v = Math.max(0, parseFloat(temp));
      if(v) {
        style.fontSize = {
          value: v,
          unit: PERCENT,
        };
      }
      else {
        style.fontSize = {
          value: DEFAULT_FONT_SIZE,
          unit: PX,
        };
      }
    }
    else {
      style.fontSize = {
        value: Math.max(0, parseFloat(temp)) || DEFAULT_FONT_SIZE,
        unit: PX,
      };
    }
  }
  temp = style.fontWeight;
  if(temp || temp === 0 || temp === '0') {
    if(temp === 'bold') {
      style.fontWeight = {
        value: 700,
        unit: NUMBER,
      };
    }
    else if(temp === 'normal') {
      style.fontWeight = {
        value: 400,
        unit: NUMBER,
      };
    }
    else if(temp === 'lighter') {
      style.fontWeight = {
        value: 200,
        unit: NUMBER,
      };
    }
    else if(temp === 'inherit') {
      style.fontWeight = {
        unit: INHERIT,
      };
    }
    else {
      style.fontWeight = {
        value: Math.max(0, parseInt(temp)) || 400,
        unit: NUMBER,
      };
    }
  }
  temp = style.fontStyle;
  if(temp) {
    if(temp === 'inherit') {
      style.fontStyle = {
        unit: INHERIT,
      };
    }
    else {
      style.fontStyle = {
        value: temp,
        unit: STRING,
      };
    }
  }
  temp = style.fontFamily;
  if(temp) {
    if(temp === 'inherit') {
      style.fontFamily = {
        unit: INHERIT,
      };
    }
    else {
      style.fontFamily = {
        value: temp,
        unit: STRING,
      };
    }
  }
  temp = style.textAlign;
  if(temp) {
    if(temp === 'inherit') {
      style.textAlign = {
        unit: INHERIT,
      };
    }
    else {
      style.textAlign = {
        value: temp,
        unit: STRING,
      };
    }
  }
  temp = style.lineHeight;
  if(temp || temp === 0 || temp === '0') {
    if(temp === 'inherit') {
      style.lineHeight = {
        unit: INHERIT,
      };
    }
    else if(temp === 'normal') {
      style.lineHeight = {
        unit: AUTO,
      };
    }
    else if(/px$/.test(temp)) {
      style.lineHeight = {
        value: parseFloat(temp),
        unit: PX,
      };
    }
    else {
      let n = Math.max(0, parseFloat(temp)) || 'normal';
      // 非法数字
      if(n === 'normal') {
        style.lineHeight = {
          unit: AUTO,
        };
      }
      else {
        style.lineHeight = {
          value: n,
          unit: NUMBER,
        };
      }
    }
  }
  temp = style.strokeDasharray;
  if(!util.isNil(temp)) {
    let match = temp.toString().match(/[\d.]+/g);
    if(match && match.length > 1) {
      match = match.map(item => parseFloat(item));
      if(match.length % 2 === 1) {
        match.push(match[match.length - 1]);
      }
      style.strokeDasharray = match;
    }
    else {
      style.strokeDasharray = [];
    }
  }
  // fill和stroke为渐变时特殊处理
  temp = style.fill;
  if(temp) {
    if(temp.indexOf('-gradient(') > 0) {
      style.fill = gradient.parseGradient(temp);
    }
    else {
      style.fill = util.rgb2int(temp);
    }
  }
  temp = style.stroke;
  if(temp) {
    if(temp.indexOf('-gradient(') > 0) {
      style.stroke = gradient.parseGradient(temp);
    }
    else {
      style.stroke = util.rgb2int(temp);
    }
  }
  // font除size相关
  // 删除缩写避免干扰动画计算
  delete style.background;
  delete style.flex;
  delete style.border;
  delete style.margin;
  delete style.padding;
  return style;
}

// 第一次和REFLOW等级下，刷新前首先执行，生成computedStyle计算继承和行高和文本对齐
function compute(node, isRoot) {
  let { animateStyle } = node;
  let currentStyle = node.__currentStyle = animateStyle;
  let { lineHeight, textAlign } = currentStyle;
  let computedStyle = node.__computedStyle = util.clone(currentStyle);
  let parent = node.parent;
  let parentComputedStyle = parent && parent.computedStyle;
  preCompute(currentStyle, computedStyle, parentComputedStyle, isRoot);
  calLineHeight(node, lineHeight, computedStyle);
  if(textAlign.unit === INHERIT) {
    computedStyle.textAlign = isRoot ? 'left' : parentComputedStyle.textAlign;
  }
  else {
    computedStyle.textAlign = isRoot ? 'left' : textAlign.value;
  }
}

// REPAINT等级下，刷新前首先执行，仅计算继承
function repaint(node, isRoot) {
  let { animateStyle, computedStyle } = node;
  let currentStyle = node.__currentStyle = animateStyle;
  let parent = node.parent;
  let parentComputedStyle = parent && parent.computedStyle;
  preCompute(currentStyle, computedStyle, parentComputedStyle, isRoot);
}

function preCompute(currentStyle, computedStyle, parentComputedStyle, isRoot) {
  let { fontStyle, fontWeight, fontSize, fontFamily, color } = currentStyle;
  // 处理继承的属性
  if(fontStyle.unit === INHERIT) {
    computedStyle.fontStyle = isRoot ? 'normal' : parentComputedStyle.fontStyle;
  }
  else {
    computedStyle.fontStyle = fontStyle.value;
  }
  if(fontWeight.unit === INHERIT) {
    computedStyle.fontWeight = isRoot ? 400 : parentComputedStyle.fontWeight;
  }
  else {
    computedStyle.fontWeight = fontWeight.value;
  }
  computedFontSize(computedStyle, fontSize, parentComputedStyle, isRoot);
  if(fontFamily.unit === INHERIT) {
    computedStyle.fontFamily = isRoot ? 'arial' : parentComputedStyle.fontFamily;
  }
  else {
    computedStyle.fontFamily = fontFamily.value;
  }
  if(color.unit === INHERIT) {
    computedStyle.color = isRoot ? 'rgba(0,0,0,1)' : parentComputedStyle.color;
  }
  else {
    computedStyle.color = util.int2rgba(color.value);
  }
  // 处理可提前计算的属性，如border
  [
    'borderTopWidth',
    'borderRightWidth',
    'borderBottomWidth',
    'borderLeftWidth',
  ].forEach(k => {
    computedStyle[k] = currentStyle[k].value;
  });
  [
    'visibility',
    'opacity',
    'zIndex',
    'borderTopStyle',
    'borderRightStyle',
    'borderBottomStyle',
    'borderLeftStyle',
    'backgroundRepeat',
    'flexGrow',
    'flexShrink',
  ].forEach(k => {
    computedStyle[k] = currentStyle[k];
  });
  [
    'backgroundColor',
    'borderTopColor',
    'borderRightColor',
    'borderBottomColor',
    'borderLeftColor',
  ].forEach(k => {
    computedStyle[k] = util.int2rgba(currentStyle[k]);
  });
}

function computedFontSize(computedStyle, fontSize, parentComputedStyle, isRoot) {
  if(fontSize.unit === INHERIT) {
    computedStyle.fontSize = isRoot ? DEFAULT_FONT_SIZE : parentComputedStyle.fontSize;
  }
  else if(fontSize.unit === PX) {
    computedStyle.fontSize = fontSize.value;
  }
  else if(fontSize.unit === PERCENT) {
    computedStyle.fontSize = isRoot ? DEFAULT_FONT_SIZE * fontSize.value : parentComputedStyle.fontSize * fontSize.value;
  }
  else {
    computedStyle.fontSize = DEFAULT_FONT_SIZE;
  }
}

function setFontStyle(style) {
  let { fontStyle, fontWeight, fontSize, fontFamily } = style;
  return `${fontStyle} ${fontWeight} ${fontSize}px/${fontSize}px ${fontFamily}`;
}

function getBaseLine(style) {
  let normal = style.fontSize * font.arial.lhr;
  return (style.lineHeight - normal) * 0.5 + style.fontSize * font.arial.blr;
}

function calLineHeight(xom, lineHeight, computedStyle) {
  if(util.isNumber(lineHeight)) {}
  if(lineHeight.unit === INHERIT) {
    let parent = xom.parent;
    if(parent) {
      let pl = parent.style.lineHeight;
      // 一直继承向上查找直到root
      if(pl.unit === INHERIT) {
        parent = parent.parent;
        while(parent) {
          pl = parent.style.lineHeight;
          if(pl.unit !== INHERIT) {
            break;
          }
        }
      }
      let parentComputedStyle = parent.computedStyle;
      if(pl.unit === PX) {
        computedStyle.lineHeight = parentComputedStyle.lineHeight;
      }
      else if(pl.unit === NUMBER) {
        computedStyle.lineHeight = Math.max(pl.value, 0) * computedStyle.fontSize;
      }
      else {
        computedStyle.lineHeight = calNormalLineHeight(computedStyle);
      }
    }
    else {
      // root的继承强制为normal
      lineHeight.unit = AUTO;
      computedStyle.lineHeight = calLineHeight(computedStyle);
    }
  }
  // 防止为0
  else if(lineHeight.unit === PX) {
    computedStyle.lineHeight = Math.max(lineHeight.value, 0) || calNormalLineHeight(computedStyle);
  }
  else if(lineHeight.unit === NUMBER) {
    computedStyle.lineHeight = Math.max(lineHeight.value, 0) * computedStyle.fontSize || calNormalLineHeight(computedStyle);
  }
  // normal
  else {
    computedStyle.lineHeight = calNormalLineHeight(computedStyle);
  }
}

function calNormalLineHeight(computedStyle) {
  return computedStyle.fontSize * font.arial.lhr;
}

function calRelativePercent(n, parent, k) {
  n *= 0.01;
  while(parent) {
    let style = parent.currentStyle[k];
    if(style.unit === AUTO) {
      if(k === 'width') {
        parent = parent.parent;
      }
      else {
        break;
      }
    }
    else if(style.unit === PX) {
      return n * style.value;
    }
    else if(style.unit === PERCENT) {
      n *= style.value * 0.01;
      parent = parent.parent;
    }
  }
  return n;
}

function calRelative(computedStyle, k, v, parent, isWidth) {
  if(util.isNumber(v)) {}
  else if(v.unit === AUTO) {
    v = 0;
  }
  else if(v.unit === PX) {
    v = v.value;
  }
  else if(v.unit === PERCENT) {
    if(isWidth) {
      v = calRelativePercent(v.value, parent, 'width');
    }
    else {
      v = calRelativePercent(v.value, parent, 'height');
    }
  }
  return computedStyle[k] = v;
}

function calAbsolute(computedStyle, k, v, size) {
  if(util.isNumber(v)) {}
  else if(v.unit === AUTO) {
    v = 0;
  }
  else if(v.unit === PX) {
    v = v.value;
  }
  else if(v.unit === PERCENT) {
    v = v.value * size * 0.01;
  }
  return computedStyle[k] = v;
}

export default {
  normalize,
  compute,
  repaint,
  setFontStyle,
  getBaseLine,
  calLineHeight,
  calRelative,
  calAbsolute,
};
