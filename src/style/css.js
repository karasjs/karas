import unit from './unit';
import font from './font';
import gradient from './gradient';
import reg from './reg';
import util from '../util/util';

const { AUTO, PX, PERCENT, NUMBER, INHERIT, DEG, RGBA, STRING } = unit;
const { isNil, rgba2int } = util;

const DEFAULT_FONT_SIZE = 16;

function parserOneBorder(style, direction) {
  let k = 'border' + direction;
  let v = style[k];
  if(isNil(v)) {
    return;
  }
  // 后面会统一格式化处理
  if(isNil(style[k + 'Width'])) {
    let w = /\b[\d.]+px\b/i.exec(v);
    style[k + 'Width'] = w ? w[0] : 0;
  }
  if(isNil(style[k + 'Style'])) {
    let s = /\b(solid|dashed|dotted)\b/i.exec(v);
    style[k + 'Style'] = s ? s[1] : 'solid';
  }
  if(isNil(style[k + 'Color'])) {
    let c = /#[0-9a-f]{3,6}/i.exec(v);
    if(c && [4, 7].indexOf(c[0].length) > -1) {
      style[k + 'Color'] = c[0];
    }
    else if(/\btransparent\b/i.test(v)) {
      style[k + 'Color'] = 'transparent';
    }
    else {
      c = /rgba?\(.+\)/i.exec(v);
      style[k + 'Color'] = c ? c[0] : 'transparent';
    }
  }
}

function parseFlex(style, grow, shrink, basis) {
  if(isNil(style.flexGrow)) {
    style.flexGrow = grow;
  }
  if(isNil(style.flexShrink)) {
    style.flexShrink = shrink;
  }
  if(isNil(style.flexBasis)) {
    style.flexBasis = basis;
  }
}

function parseMarginPadding(style, key) {
  let temp = style[key];
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
        k = key + k;
        if(isNil(style[k])) {
          style[k] = match[i];
        }
      });
    }
    delete style[key];
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
    v = parseFloat(v) || 0;
    obj[k] = {
      value: v,
      unit: PERCENT,
    };
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
  // border相关不能为负值
  if(k.toString().indexOf('border') === 0) {
    obj[k].value = Math.max(obj[k].value, 0);
  }
  return obj;
}

function compatibleTransform(k, v) {
  if(k.indexOf('scale') > -1) {
    v.unit = NUMBER;
  }
  else if(k.indexOf('translate') > -1) {
    if(v.unit === NUMBER) {
      v.unit = PX;
    }
  }
  else {
    if(v.unit === NUMBER) {
      v.unit = DEG;
    }
  }
}

/**
 * 将传入的手写style标准化，并且用reset默认值覆盖其中为空的
 * @param style 手写的style样式
 * @param reset 默认样式
 * @returns 标准化的样式
 */
function normalize(style, reset = []) {
  // style只有单层无需深度clone
  style = util.extend({}, style);
  // 缩写提前处理，因为reset里没有缩写
  let temp = style.border;
  if(temp) {
    ['Top', 'Right', 'Bottom', 'Left'].forEach(k => {
      k = 'border' + k;
      if(isNil(style[k])) {
        style[k] = temp;
      }
    });
    delete style.border;
  }
  ['Top', 'Right', 'Bottom', 'Left'].forEach(k => {
    parserOneBorder(style, k);
  });
  temp = style.borderWidth;
  if(temp) {
    ['Top', 'Right', 'Bottom', 'Left'].forEach(k => {
      k = 'border' + k + 'Width';
      if(isNil(style[k])) {
        // width后面会统一格式化处理
        style[k] = temp;
      }
    });
    delete style.borderWidth;
  }
  temp = style.borderColor;
  if(temp) {
    ['Top', 'Right', 'Bottom', 'Left'].forEach(k => {
      k = 'border' + k + 'Color';
      if(isNil(style[k])) {
        style[k] = rgba2int(temp);
      }
    });
    delete style.borderColor;
  }
  temp = style.borderStyle;
  if(temp) {
    ['Top', 'Right', 'Bottom', 'Left'].forEach(k => {
      k = 'border' + k + 'Style';
      if(isNil(style[k])) {
        style[k] = temp;
      }
    });
    delete style.borderStyle;
  }
  temp = style.borderRadius;
  if(temp) {
    // borderRadius缩写很特殊，/分隔x/y，然后上右下左4个
    temp = temp.toString().split('/');
    if(temp.length === 1) {
      temp[1] = temp[0];
    }
    for(let i = 0; i < 2; i++) {
      let item = temp[i].toString().split(/\s+/);
      if(item.length === 0) {
        temp[i] = [0, 0, 0, 0];
      }
      else if(item.length === 1) {
        temp[i] = [item[0], item[0], item[0], item[0]];
      }
      else if(item.length === 2) {
        temp[i] = [item[0], item[1], item[0], item[1]];
      }
      else if(item.length === 3) {
        temp[i] = [item[0], item[1], item[2], item[1]];
      }
      else {
        temp[i] = item.slice(0, 4);
      }
    }
    ['TopLeft', 'TopRight', 'BottomRight', 'BottomLeft'].forEach((k, i) => {
      k = 'border' + k + 'Radius';
      if(isNil(style[k])) {
        style[k] = temp[0][i] + ' ' + temp[1][i];
      }
    });
    delete style.borderRadius;
  }
  temp = style.background;
  // 处理渐变背景缩写
  if(temp) {
    // gradient/image和颜色可以并存
    if(isNil(style.backgroundImage)) {
      let gd = reg.gradient.exec(temp);
      if(gd) {
        style.backgroundImage = gd[0];
        temp = temp.replace(gd[0], '');
      }
      else {
        let img = reg.img.exec(temp);
        if(img) {
          style.backgroundImage = img[0];
          temp = temp.replace(img[0], '');
        }
      }
    }
    if(isNil(style.backgroundRepeat)) {
      let repeat = /(no-)?repeat(-[xy])?/i.exec(temp);
      if(repeat) {
        style.backgroundRepeat = repeat[0].toLowerCase();
      }
    }
    if(isNil(style.backgroundColor)) {
      let bgc = /^(transparent)|(#[0-9a-f]{3,6})|(rgba?\(.+?\))/i.exec(temp);
      if(bgc) {
        style.backgroundColor = bgc[0];
        temp = temp.replace(bgc[0], '');
      }
    }
    if(isNil(style.backgroundPosition)) {
      let position = temp.match(reg.position);
      if(position) {
        style.backgroundPositionX = position[0];
        style.backgroundPositionY = position.length > 1 ? position[1] : position[0];
      }
    }
    delete style.background;
  }
  // 背景位置
  temp = style.backgroundPosition;
  if(!isNil(temp)) {
    temp = temp.toString().split(/\s+/);
    if(temp.length === 1) {
      temp[1] = '50%';
    }
    [style.backgroundPositionX, style.backgroundPositionY] = temp;
    delete style.backgroundPosition;
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
    delete style.flex;
  }
  // margin
  parseMarginPadding(style, 'margin');
  parseMarginPadding(style, 'padding');
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
    if(!isNil(v) && style.transform) {
      console.error(`Can not use expand style "${k}" with transform`);
    }
  });
  // 默认reset，根据传入不同，当style为空时覆盖
  reset.forEach(item => {
    let { k, v } = item;
    if(isNil(style[k])) {
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
      style.backgroundColor = {
        value: rgba2int(bgc[0]),
        unit: RGBA,
      };
    }
    else {
      bgc = /rgba?\(.+\)/i.exec(temp);
      style.backgroundColor = {
        value: rgba2int(bgc ? bgc[0] : [0, 0, 0, 0]),
        unit: RGBA,
      };
    }
  }
  ['backgroundPositionX', 'backgroundPositionY'].forEach(k => {
    temp = style[k];
    if(!isNil(temp)) {
      if(/%$/.test(temp) || /px$/.test(temp) || /^-?[\d.]+$/.test(temp)) {
        calUnit(style, k, temp);
        temp = style[k];
        if(temp.unit === NUMBER) {
          temp.unit = PX;
        }
      }
      else {
        style[k] = {
          value: {
            top: 0,
            left: 0,
            center: 50,
            right: 100,
            bottom: 100,
          }[temp],
          unit: PERCENT,
        };
      }
    }
  });
  // 背景尺寸
  temp = style.backgroundSize;
  if(temp) {
    let bc = style.backgroundSize = [];
    let match = temp.toString().match(/\b(?:(-?[\d.]+(px|%)?)|(contain|cover|auto))/ig);
    if(match) {
      if(match.length === 1) {
        if(match[0] === 'contain' || match[0] === 'cover') {
          match[1] = match[0];
        }
        else {
          match[1] = 'auto';
        }
      }
      for(let i = 0; i < 2; i++) {
        let item = match[i];
        if(/%$/.test(item) || /px$/.test(item) || /^-?[\d.]+$/.test(item)) {
          calUnit(bc, i, item);
          if(bc[i].unit === NUMBER) {
            bc[i].unit = PX;
          }
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
    }
    else {
      bc.push({
        unit: AUTO,
      });
      bc[1] = bc[0];
    }
  }
  // border-color
  ['Top', 'Right', 'Bottom', 'Left'].forEach(k => {
    k = 'border' + k + 'Color';
    let v = style[k];
    if(!isNil(v)) {
      style[k] = {
        value: rgba2int(v),
        unit: RGBA,
      };
    }
  });
  // border-radius
  ['TopLeft', 'TopRight', 'BottomRight', 'BottomLeft'].forEach(k => {
    k = 'border' + k + 'Radius';
    let v = style[k];
    if(!isNil(v)) {
      let arr = v.toString().split(/\s+/);
      if(arr.length === 1) {
        arr[1] = arr[0];
      }
      for(let i = 0; i < 2; i++) {
        let item = arr[i];
        if(/%$/.test(item) || /px$/.test(item) || /^-?[\d.]+$/.test(item)) {
          calUnit(arr, i, item);
          if(arr[i].unit === NUMBER) {
            arr[i].unit = PX;
          }
        }
        else {
          arr[i] = {
            value: 0,
            unit: PX,
          };
        }
      }
      style[k] = arr;
    }
  });
  temp = style.transform;
  if(temp) {
    let transform = style.transform = [];
    let match = temp.toString().match(/\w+\(.+?\)/g);
    if(match) {
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
        else if({
          'translateX': true,
          'translateY': true,
          'scaleX': true,
          'scaleY': true,
          'skewX': true,
          'skewY': true,
          'rotate': true,
          'rotateZ': true,
        }.hasOwnProperty(k)) {
          if(k === 'rotate') {
            k = 'rotateZ';
          }
          let arr = calUnit([k, v], 1, v);
          compatibleTransform(k, arr[1]);
          transform.push(arr);
        }
        else if({ translate: true, scale: true, skew: true }.hasOwnProperty(k)) {
          let arr = v.toString().split(/\s*,\s*/);
          if(arr.length === 1) {
            arr[1] = arr[0];
          }
          let arr1 = calUnit([k + 'X', arr[0]], 1, arr[0]);
          let arr2 = calUnit([k + 'Y', arr[1]], 1, arr[1]);
          compatibleTransform(k, arr1[1]);
          compatibleTransform(k, arr2[1]);
          transform.push(arr1);
          transform.push(arr2);
        }
      });
    }
  }
  temp = style.transformOrigin;
  if(!isNil(temp)) {
    let tfo = style.transformOrigin = [];
    let match = temp.toString().match(reg.position);
    if(match) {
      if(match.length === 1) {
        match[1] = match[0];
      }
      for(let i = 0; i < 2; i++) {
        let item = match[i];
        if(/%$/.test(item) || /px$/.test(item) || /^-?[\d.]+$/.test(item)) {
          calUnit(tfo, i, item);
          if(tfo[i].unit === NUMBER) {
            tfo[i].unit = PX;
          }
        }
        else {
          tfo.push({
            value: {
              top: 0,
              left: 0,
              center: 50,
              right: 100,
              bottom: 100,
            }[item],
            unit: PERCENT,
          });
          // 不规范的写法变默认值50%
          if(isNil(tfo[i].value)) {
            tfo[i].value = 50;
          }
        }
      }
    }
    else {
      tfo.push({
        value: 50,
        unit: PERCENT,
      });
      tfo[1] = tfo[0];
    }
  }
  // 扩展css，将transform几个值拆分为独立的css为动画准备，同时不能使用transform
  ['translate', 'scale', 'skew'].forEach(k => {
    temp = style[k];
    if(!isNil(temp)) {
      let arr = temp.toString().split(/\s*,\s*/);
      if(arr.length === 1) {
        arr[1] = arr[0];
      }
      style[k + 'X'] = arr[0];
      style[k + 'Y'] = arr[1];
      delete style[k];
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
    if(isNil(v)) {
      return;
    }
    calUnit(style, k, v);
    if(k === 'rotate') {
      k = 'rotateZ';
      style.rotateZ = style.rotate;
      delete style.rotate;
    }
    // 没有单位或默认值处理单位
    v = style[k];
    compatibleTransform(k, v);
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
    if(isNil(v)) {
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
        value: rgba2int(temp),
        unit: RGBA,
      };
    }
  }
  temp = style.fontSize;
  if(temp || temp === 0) {
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
  if(temp || temp === 0) {
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
  if(temp || temp === 0) {
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
    // lineHeight默认数字，想要px必须强制带单位
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
  if(!isNil(temp)) {
    let match = temp.toString().match(/[\d.]+/g);
    if(match) {
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
      style.fill = rgba2int(temp);
    }
  }
  temp = style.stroke;
  if(temp) {
    if(temp.indexOf('-gradient(') > 0) {
      style.stroke = gradient.parseGradient(temp);
    }
    else {
      style.stroke = rgba2int(temp);
    }
  }
  temp = style.filter;
  if(temp) {
    style.filter = [];
    let blur = /\bblur\s*\(\s*([\d.]+)\s*(?:px)?\s*\)/.exec(temp);
    if(blur) {
      let v = parseFloat(blur[1]) || 0;
      if(v) {
        style.filter.push(['blur', v]);
      }
    }
  }
  temp = style.visibility;
  if(temp) {
    if(temp === 'inherit') {
      style.visibility = {
        unit: INHERIT,
      };
    }
    else {
      style.visibility = {
        value: temp,
        unit: STRING,
      };
    }
  }
  return style;
}

// 影响文字测量的只有字体和大小，必须提前处理，另顺带处理掉布局相关的属性
/**
 * 第一次和REFLOW等级下，刷新前首先执行，生成computedStyle
 * 影响文字测量的只有字体和大小，也需要提前处理
 * 继承相关的计算，包括布局的，以及渲染repaint的
 * @param node
 * @param isRoot
 * @param currentStyle
 * @param computedStyle
 */
function compute(node, isRoot, currentStyle, computedStyle) {
  let parentComputedStyle = isRoot ? null : node.parent.computedStyle;
  let { fontSize, fontFamily, textAlign, lineHeight } = currentStyle;
  if(fontSize.unit === INHERIT) {
    computedStyle.fontSize = isRoot ? DEFAULT_FONT_SIZE : parentComputedStyle.fontSize;
  }
  else if(fontSize.unit === PERCENT) {
    computedStyle.fontSize = isRoot ? DEFAULT_FONT_SIZE : parentComputedStyle.fontSize * fontSize.value * 0.01;
  }
  else {
    computedStyle.fontSize = fontSize.value;
  }
  if(fontFamily.unit === INHERIT) {
    computedStyle.fontFamily = isRoot ? 'arial' : parentComputedStyle.fontFamily;
  }
  else {
    computedStyle.fontFamily = fontFamily.value;
  }
  // 顺带将可提前计算且与布局相关的属性提前计算到computedStyle上，渲染相关的在各自render中做
  [
    'borderTopWidth',
    'borderRightWidth',
    'borderBottomWidth',
    'borderLeftWidth',
  ].forEach(k => {
    // border-width不支持百分比
    computedStyle[k] = currentStyle[k].unit === PX ? Math.max(0, currentStyle[k].value) : 0;
  });
  [
    'position',
    'display',
    'flexDirection',
    'justifyContent',
    'alignItems',
    'flexGrow',
    'flexShrink',
  ].forEach(k => {
    computedStyle[k] = currentStyle[k];
  });
  if(textAlign.unit === INHERIT) {
    computedStyle.textAlign = isRoot ? 'left' : parentComputedStyle.textAlign;
  }
  else {
    computedStyle.textAlign = isRoot ? 'left' : textAlign.value;
  }
  if(lineHeight.unit === INHERIT) {
    computedStyle.lineHeight = isRoot ? calNormalLineHeight(computedStyle) : parentComputedStyle.lineHeight;
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

function setFontStyle(style) {
  let { fontStyle, fontWeight, fontSize, fontFamily } = style;
  return (fontStyle || '') + ' ' + (fontWeight || '') + ' ' + fontSize + 'px/' + fontSize + 'px ' + (fontFamily || '');
}

function getBaseLine(style) {
  let normal = style.fontSize * font.arial.lhr;
  return (style.lineHeight - normal) * 0.5 + style.fontSize * font.arial.blr;
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

function calRelative(currentStyle, k, v, parent, isWidth) {
  if(v.unit === AUTO) {
    v = 0;
  }
  else if([PX, NUMBER, DEG, RGBA, STRING].indexOf(v.unit) > -1) {
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
  return v;
}

function calAbsolute(currentStyle, k, v, size) {
  if(v.unit === AUTO) {
    v = 0;
  }
  else if([PX, NUMBER, DEG, RGBA, STRING].indexOf(v.unit) > -1) {
    v = v.value;
  }
  else if(v.unit === PERCENT) {
    v = v.value * size * 0.01;
  }
  return v;
}

export default {
  normalize,
  compute,
  setFontStyle,
  getBaseLine,
  calRelative,
  calAbsolute,
};
