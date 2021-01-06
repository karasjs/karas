import unit from './unit';
import font from './font';
import gradient from './gradient';
import reg from './reg';
import reset from './reset';
import abbr from './abbr';
import enums from '../util/enums';
import util from '../util/util';
import inject from '../util/inject';
import key from '../animate/key';
import change from '../refresh/change';

const { STYLE_KEY, STYLE_RV_KEY, style2Upper, STYLE_KEY: {
  POSITION,
  WIDTH,
  HEIGHT,
  TRANSLATE_X,
  TRANSLATE_Y,
  SCALE_X,
  SCALE_Y,
  SKEW_X,
  SKEW_Y,
  ROTATE_Z,
  TRANSFORM,
  TRANSFORM_ORIGIN,
  BACKGROUND_IMAGE,
  BACKGROUND_COLOR,
  BACKGROUND_POSITION_X,
  BACKGROUND_POSITION_Y,
  BACKGROUND_SIZE,
  OPACITY,
  Z_INDEX,
  COLOR,
  FONT_SIZE,
  FONT_FAMILY,
  FONT_WEIGHT,
  FONT_STYLE,
  LINE_HEIGHT,
  TEXT_ALIGN,
  FILTER,
  VISIBILITY,
  BOX_SHADOW,
  POINTER_EVENTS,
  FILL,
  STROKE,
  STROKE_WIDTH,
  STROKE_DASHARRAY,
  BORDER_TOP_WIDTH,
  BORDER_RIGHT_WIDTH,
  BORDER_BOTTOM_WIDTH,
  BORDER_LEFT_WIDTH,
  DISPLAY,
  FLEX_DIRECTION,
  FLEX_GROW,
  FLEX_SHRINK,
  FLEX_BASIS,
  JUSTIFY_CONTENT,
  ALIGN_SELF,
  ALIGN_ITEMS,
  MATRIX,
  LETTER_SPACING,
} } = enums;
const { AUTO, PX, PERCENT, NUMBER, INHERIT, DEG, RGBA, STRING } = unit;
const { isNil, rgba2int, equalArr } = util;
const { MEASURE_KEY_SET, isGeom, GEOM, GEOM_KEY_SET } = change;

const DEFAULT_FONT_SIZE = 16;

const {
  COLOR_HASH,
  LENGTH_HASH,
  RADIUS_HASH,
  GRADIENT_HASH,
  EXPAND_HASH,
  GRADIENT_TYPE,
} = key;

const TRANSFORM_HASH = {
  'translateX': TRANSLATE_X,
  'translateY': TRANSLATE_Y,
  'scaleX': SCALE_X,
  'scaleY': SCALE_Y,
  'skewX': SKEW_X,
  'skewY': SKEW_Y,
  'rotateZ': ROTATE_Z,
  'rotate': ROTATE_Z,
};

/**
 * 通用的格式化计算数值单位的方法，百分比像素auto和纯数字，直接修改传入对象本身
 * @param res 待计算的样式对象
 * @param k 对象的key
 * @param v 对象的value
 * @returns 格式化好的样式对象本身
 */
function calUnit(res, k, v) {
  if(v === 'auto') {
    res[k] = [0, AUTO];
  }
  else if(v === 'inherit') {
    res[k] = [0, INHERIT];
  }
  else if(/%$/.test(v)) {
    v = parseFloat(v) || 0;
    res[k] = [v, PERCENT];
  }
  else if(/px$/i.test(v)) {
    v = parseFloat(v) || 0;
    res[k] = [v, PX];
  }
  else if(/deg$/i.test(v)) {
    v = parseFloat(v) || 0;
    res[k] = [v, DEG];
  }
  else {
    v = parseFloat(v) || 0;
    res[k] = [v, NUMBER];
  }
  // border等相关不能为负值
  if(k === BORDER_LEFT_WIDTH || k === BORDER_TOP_WIDTH || k === BORDER_RIGHT_WIDTH || k === BORDER_BOTTOM_WIDTH
    || k === WIDTH || k === HEIGHT || k === FLEX_BASIS) {
    res[k][0] = Math.max(res[k][0], 0);
  }
  return res;
}

function compatibleTransform(k, arr) {
  if(k === SCALE_X || k === SCALE_Y) {
    arr[1] = NUMBER;
  }
  else if(k === TRANSLATE_X || k === TRANSLATE_Y) {
    if(arr[1] === NUMBER) {
      arr[1] = PX;
    }
  }
  else {
    if(arr[1] === NUMBER) {
      arr[1] = DEG;
    }
  }
}

/**
 * 将传入的手写style标准化，并且用reset默认值覆盖其中为空的
 * @param style 手写的style样式
 * @param reset 默认样式，可选
 * @returns Object 标准化的枚举数组结构样式
 */
function normalize(style, reset = []) {
  if(!util.isObject(style)) {
    return {};
  }
  let res = {};
  // style只有单层无需深度clone
  style = util.extend({}, style);
  // 缩写提前处理，因为reset里没有缩写
  let temp = style.border;
  if(temp) {
    abbr.toFull(style, 'border');
  }
  ['borderTop', 'borderRight', 'borderBottom', 'borderLeft'].forEach(k => {
    abbr.toFull(style, k);
  });
  temp = style.borderWidth;
  if(temp) {
    abbr.toFull(style, 'borderWidth');
  }
  temp = style.borderColor;
  if(temp) {
    abbr.toFull(style, 'borderColor');
  }
  temp = style.borderStyle;
  if(temp) {
    abbr.toFull(style, 'borderStyle');
  }
  temp = style.borderRadius;
  if(temp) {
    abbr.toFull(style, 'borderRadius');
  }
  temp = style.background;
  // 处理渐变背景缩写
  if(temp) {
    abbr.toFull(style, 'background');
  }
  // 背景位置
  temp = style.backgroundPosition;
  if(!isNil(temp)) {
    abbr.toFull(style, 'backgroundPosition');
  }
  // flex
  temp = style.flex;
  if(temp) {
    abbr.toFull(style, 'flex');
  }
  temp = style.margin;
  if(!isNil(temp)) {
    abbr.toFull(style, 'margin');
  }
  temp = style.padding;
  if(!isNil(temp)) {
    abbr.toFull(style, 'padding');
  }
  // 扩展css，将transform几个值拆分为独立的css为动画准备，同时不能使用transform
  ['translate', 'scale', 'skew'].forEach(k => {
    temp = style[k];
    if(!isNil(temp)) {
      abbr.toFull(style, k);
    }
  });
  temp = style.rotate;
  if(!isNil(temp)) {
    abbr.toFull(style, 'rotate');
  }
  // 扩展的不能和transform混用，给出警告
  [
    'translateX',
    'translateY',
    'scaleX',
    'scaleY',
    'skewX',
    'skewY',
    'rotateZ',
  ].forEach(k => {
    let v = style[k];
    if(!isNil(v) && style.transform) {
      inject.warn(`Can not use expand style "${k}" with transform`);
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
  if(temp !== undefined) {
    if(!temp) {
      res[BACKGROUND_IMAGE] = [null];
    }
    else if(Array.isArray(temp)) {
      res[BACKGROUND_IMAGE] = temp.map(item => {
        if(!item) {
          return null;
        }
        if(reg.gradient.test(item)) {
          return gradient.parseGradient(item);
        }
        if(reg.img.test(item)) {
          return reg.img.exec(item)[2];
        }
        return null;
      });
    }
    // 区分是渐变色还是图
    else if(reg.gradient.test(temp)) {
      res[BACKGROUND_IMAGE] = [gradient.parseGradient(temp)];
    }
    else if(reg.img.test(temp)) {
      res[BACKGROUND_IMAGE] = [reg.img.exec(temp)[2]];
    }
    else {
      res[BACKGROUND_IMAGE] = [null];
    }
  }
  temp = style.backgroundColor;
  if(temp) {
    // 先赋值默认透明，后续操作有合法值覆盖
    let bgc = /^#[0-9a-f]{3,8}/i.exec(temp);
    if(bgc && [4, 7, 9].indexOf(bgc[0].length) > -1) {
      res[BACKGROUND_COLOR] = [rgba2int(bgc[0]), RGBA];
    }
    else {
      bgc = /rgba?\s*\(.+\)/i.exec(temp);
      res[BACKGROUND_COLOR] = [rgba2int(bgc ? bgc[0] : [0, 0, 0, 0]), RGBA];
    }
  }
  ['backgroundPositionX', 'backgroundPositionY'].forEach((k, i) => {
    temp = style[k];
    if(!isNil(temp)) {
      k = i ? BACKGROUND_POSITION_Y : BACKGROUND_POSITION_X;
      if(Array.isArray(temp)) {
        if(temp.length) {
          res[k] = temp.map(item => {
            if(/%$/.test(item) || /px$/i.test(item) || /^-?[\d.]+$/.test(item)) {
              let v = [];
              calUnit(v, 0, item);
              if(v[0][1] === NUMBER) {
                v[0][1] = PX;
              }
              return v[0];
            }
            else {
              return [
                {
                  top: 0,
                  left: 0,
                  center: 50,
                  right: 100,
                  bottom: 100,
                }[item] || 0,
                PERCENT,
              ];
            }
          });
        }
        else {
          res[k] = [0, PERCENT];
        }
      }
      else if(/%$/.test(temp) || /px$/i.test(temp) || /^-?[\d.]+$/.test(temp)) {
        calUnit(res, k, temp);
        temp = res[k];
        if(temp[1] === NUMBER) {
          temp[1] = PX;
        }
        res[k] = [temp];
      }
      else {
        res[k] = [[
          {
            top: 0,
            left: 0,
            center: 50,
            right: 100,
            bottom: 100,
          }[temp] || 0,
          PERCENT,
        ]];
      }
    }
  });
  // 背景尺寸
  temp = style.backgroundSize;
  if(temp) {
    let bs = res[BACKGROUND_SIZE] = [];
    if(Array.isArray(temp)) {
      if(temp.length) {
        bs = temp.map(item => {
          if(!item) {
            return [
              [0, AUTO],
              [0, AUTO],
            ];
          }
          let match = item.toString().match(/\b(?:(-?[\d.]+(px|%)?)|(contain|cover|auto))/ig);
          if(match) {
            if(match.length === 1) {
              if(match[0] === 'contain' || match[0] === 'cover') {
                match[1] = match[0];
              }
              else {
                match[1] = 'auto';
              }
            }
            let v = [];
            for(let i = 0; i < 2; i++) {
              let item = match[i];
              if(/%$/.test(item) || /px$/i.test(item) || /^-?[\d.]+$/.test(item)) {
                calUnit(v, i, item);
                if(v[i][1] === NUMBER) {
                  v[i][1] = PX;
                }
              }
              else if(item === '0' || item === 0) {
                v.push([0, PX]);
              }
              else if(item === 'contain' || item === 'cover') {
                v.push([item, STRING]);
              }
              else {
                v.push([0, AUTO]);
              }
            }
            return v;
          }
          else {
            return [
              [0, AUTO],
              [0, AUTO],
            ];
          }
        });
      }
      else {
        bs.push([
          [0, AUTO],
          [0, AUTO],
        ]);
      }
    }
    else {
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
        let v = [];
        for(let i = 0; i < 2; i++) {
          let item = match[i];
          if(/%$/.test(item) || /px$/i.test(item) || /^-?[\d.]+$/.test(item)) {
            calUnit(v, i, item);
            if(v[i][1] === NUMBER) {
              v[i][1] = PX;
            }
          }
          else if(item === '0' || item === 0) {
            v.push([0, PX]);
          }
          else if(item === 'contain' || item === 'cover') {
            v.push([item, STRING]);
          }
          else {
            v.push([0, AUTO]);
          }
        }
        bs.push(v);
      }
      else {
        bs.push([
          [0, AUTO],
          [0, AUTO],
        ]);
      }
    }
  }
  // border-color
  ['Top', 'Right', 'Bottom', 'Left'].forEach(k => {
    k = 'border' + k + 'Color';
    let v = style[k];
    if(!isNil(v)) {
      res[STYLE_KEY[style2Upper(k)]] = [rgba2int(v), RGBA];
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
        if(/%$/.test(item) || /px$/i.test(item) || /^-?[\d.]+$/.test(item)) {
          calUnit(arr, i, item);
          if(arr[i][1] === NUMBER) {
            arr[i][1] = PX;
          }
        }
        else {
          arr[i] = [0, PX];
        }
      }
      res[STYLE_KEY[style2Upper(k)]] = arr;
    }
  });
  temp = style.transform;
  if(temp) {
    let transform = res[TRANSFORM] = [];
    let match = (temp || '').toString().match(/\w+\(.+?\)/g);
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
            transform.push([MATRIX, arr]);
          }
        }
        else if(TRANSFORM_HASH.hasOwnProperty(k)) {
          let k2 = TRANSFORM_HASH[k];
          let arr = calUnit([k2, v], 1, v);
          compatibleTransform(k2, arr[1]);
          transform.push(arr);
        }
        else if({ translate: true, scale: true, skew: true }.hasOwnProperty(k)) {
          let arr = v.toString().split(/\s*,\s*/);
          if(arr.length === 1) {
            arr[1] = arr[0].slice(0);
          }
          let k1 = STYLE_KEY[style2Upper(k + 'X')];
          let k2 = STYLE_KEY[style2Upper(k + 'Y')];
          let arr1 = calUnit([k1, arr[0]], 1, arr[0]);
          let arr2 = calUnit([k2, arr[1]], 1, arr[1]);
          compatibleTransform(k1, arr1[1]);
          compatibleTransform(k2, arr2[1]);
          transform.push(arr1);
          transform.push(arr2);
        }
      });
    }
  }
  temp = style.transformOrigin;
  if(!isNil(temp)) {
    let tfo = res[TRANSFORM_ORIGIN] = [];
    let match = temp.toString().match(reg.position);
    if(match) {
      if(match.length === 1) {
        match[1] = match[0];
      }
      for(let i = 0; i < 2; i++) {
        let item = match[i];
        if(/%$/.test(item) || /px$/i.test(item) || /^-?[\d.]+$/.test(item)) {
          calUnit(tfo, i, item);
          if(tfo[i][1] === NUMBER) {
            tfo[i][1] = PX;
          }
        }
        else {
          tfo.push([
            {
              top: 0,
              left: 0,
              center: 50,
              right: 100,
              bottom: 100,
            }[item],
            PERCENT,
          ]);
          // 不规范的写法变默认值50%
          if(isNil(tfo[i][0])) {
            tfo[i][0] = 50;
          }
        }
      }
    }
    else {
      tfo.push([50, PERCENT]);
      tfo.push([50, PERCENT]);
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
    'rotate',
  ].forEach(k => {
    let v = style[k];
    if(isNil(v)) {
      return;
    }
    let k2 = TRANSFORM_HASH[k];
    calUnit(res, k2, v);
    // 没有单位或默认值处理单位
    compatibleTransform(k2, res[k2]);
  });
  temp = style.opacity;
  if(!isNil(temp)) {
    temp = parseFloat(temp);
    if(!isNaN(temp)) {
      temp = Math.max(temp, 0);
      temp = Math.min(temp, 1);
      res[OPACITY] = temp;
    }
    else {
      res[OPACITY] = 1;
    }
  }
  temp = style.zIndex;
  if(!isNil(temp)) {
    res[Z_INDEX] = parseInt(temp) || 0;
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
    // 'strokeWidth',
  ].forEach(k => {
    let v = style[k];
    if(isNil(v)) {
      return;
    }
    k = STYLE_KEY[style2Upper(k)];
    calUnit(res, k, v);
    v = res[k];
    // 无单位视为px
    if(v[1] === NUMBER) {
      v[1] = PX;
    }
  });
  temp = style.color;
  if(temp) {
    if(temp === 'inherit') {
      res[COLOR] = [[], INHERIT];
    }
    else {
      res[COLOR] = [rgba2int(temp), RGBA];
    }
  }
  temp = style.fontSize;
  if(temp || temp === 0) {
    if(temp === 'inherit') {
      res[FONT_SIZE] = [0, INHERIT];
    }
    else if(/%$/.test(temp)) {
      let v = Math.max(0, parseFloat(temp));
      if(v) {
        res[FONT_SIZE] = [v, PERCENT];
      }
      else {
        res[FONT_SIZE] = [DEFAULT_FONT_SIZE, PX];
      }
    }
    else {
      res[FONT_SIZE] = [Math.max(0, parseFloat(temp)) || DEFAULT_FONT_SIZE, PX];
    }
  }
  temp = style.fontWeight;
  if(!isNil(temp)) {
    if(temp === 'bold') {
      res[FONT_WEIGHT] = [700, NUMBER];
    }
    else if(temp === 'normal') {
      res[FONT_WEIGHT] = [400, NUMBER];
    }
    else if(temp === 'lighter') {
      res[FONT_WEIGHT] = [200, NUMBER];
    }
    else if(temp === 'inherit') {
      res[FONT_WEIGHT] = [0, INHERIT];
    }
    else {
      res[FONT_WEIGHT] = [Math.max(0, parseInt(temp)) || 400, NUMBER];
    }
  }
  temp = style.fontStyle;
  if(temp) {
    if(temp === 'inherit') {
      res[FONT_STYLE] = [0, INHERIT];
    }
    else {
      res[FONT_STYLE] = [temp, STRING];
    }
  }
  temp = style.fontFamily;
  if(temp) {
    if(temp === 'inherit') {
      res[FONT_FAMILY] = [0, INHERIT];
    }
    else {
      res[FONT_FAMILY] = [temp, STRING];
    }
  }
  temp = style.textAlign;
  if(temp) {
    if(temp === 'inherit') {
      res[TEXT_ALIGN] = [0, INHERIT];
    }
    else {
      res[TEXT_ALIGN] = [temp, STRING];
    }
  }
  temp = style.lineHeight;
  if(temp !== undefined) {
    if(temp === 'inherit') {
      res[LINE_HEIGHT] = [0, INHERIT];
    }
    else if(temp === 'normal') {
      res[LINE_HEIGHT] = [0, AUTO];
    }
    // lineHeight默认数字，想要px必须强制带单位
    else if(/px$/i.test(temp)) {
      res[LINE_HEIGHT] = [parseFloat(temp), PX];
    }
    else {
      let n = Math.max(0, parseFloat(temp)) || 'normal';
      // 非法数字
      if(n === 'normal') {
        res[LINE_HEIGHT] = [null, AUTO];
      }
      else {
        res[LINE_HEIGHT] = [n, NUMBER];
      }
    }
  }
  temp = style.letterSpacing;
  if(temp !== undefined) {
    if(temp === 'inherit') {
      res[LETTER_SPACING] = [0, INHERIT];
    }
    else if(temp === 'normal') {
      res[LETTER_SPACING] = [0, PX];
    }
    else if(/px$/i.test(temp)) {
      res[LETTER_SPACING] = [parseFloat(temp), PX];
    }
    else {
      let n = Math.max(0, parseFloat(temp)) || 0;
      res[LETTER_SPACING] = [n, PX];
    }
  }
  // fill和stroke为渐变时特殊处理，fillRule无需处理字符串
  temp = style.fill;
  if(temp !== undefined) {
    if(!temp) {
      res[FILL] = ['none'];
    }
    else if(Array.isArray(temp)) {
      if(temp.length) {
        res[FILL] = temp.map(item => {
          if(!item) {
            return 'none';
          }
          else if(reg.gradient.test(item)) {
            return gradient.parseGradient(item);
          }
          else {
            return rgba2int(item);
          }
        });
      }
      else {
        res[FILL] = ['none'];
      }
    }
    else if(reg.gradient.test(temp)) {
      res[FILL] = [gradient.parseGradient(temp)];
    }
    else {
      res[FILL] = [rgba2int(temp)];
    }
  }
  temp = style.stroke;
  if(temp !== undefined) {
    if(!temp) {
      res[STROKE] = ['none'];
    }
    else if(Array.isArray(temp)) {
      if(temp.length) {
        res[STROKE] = temp.map(item => {
          if(!item) {
            return 'none';
          }
          else if(reg.gradient.test(item)) {
            return gradient.parseGradient(item);
          }
          else {
            return rgba2int(item);
          }
        });
      }
      else {
        res[STROKE] = ['none'];
      }
    }
    else if(reg.gradient.test(temp)) {
      res[STROKE] = [gradient.parseGradient(temp)];
    }
    else {
      res[STROKE] = [rgba2int(temp)];
    }
  }
  temp = style.strokeWidth;
  if(!isNil(temp)) {
    if(Array.isArray(temp)) {
      if(temp.length) {
        res[STROKE_WIDTH] = temp.map(item => {
          let v = [];
          calUnit(v, 0,  item);
          if(v[0][1] === NUMBER) {
            v[0][1] = PX;
          }
          return v[0];
        });
      }
      else {
        res[STROKE_WIDTH] = [0, PX];
      }
    }
    else {
      let v = res[STROKE_WIDTH] = [];
      calUnit(v, 0,  temp);
      if(v[0][1] === NUMBER) {
        v[0][1] = PX;
      }
    }
  }
  temp = style.strokeDasharray;
  if(!isNil(temp)) {
    if(Array.isArray(temp)) {
      res[STROKE_DASHARRAY] = temp.map(item => {
        let match = item.toString().match(/[\d.]+/g);
        if(match) {
          match = match.map(item => parseFloat(item));
          if(match.length % 2 === 1) {
            match.push(match[match.length - 1]);
          }
          return match;
        }
        return [];
      });
    }
    else {
      let match = temp.toString().match(/[\d.]+/g);
      if(match) {
        match = match.map(item => parseFloat(item));
        if(match.length % 2 === 1) {
          match.push(match[match.length - 1]);
        }
        res[STROKE_DASHARRAY] = [match];
      }
      else {
        res[STROKE_DASHARRAY] = [[]];
      }
    }
  }
  temp = style.filter;
  if(temp !== undefined) {
    let f = null;
    let blur = /\bblur\s*\(\s*([\d.]+)\s*(?:px)?\s*\)/i.exec(temp || '');
    if(blur) {
      let v = parseFloat(blur[1]) || 0;
      if(v) {
        f = [['blur', v]];
      }
    }
    res[FILTER] = f;
  }
  temp = style.visibility;
  if(temp) {
    if(temp === 'inherit') {
      res[VISIBILITY] = [0, INHERIT];
    }
    else {
      res[VISIBILITY] = [temp, STRING];
    }
  }
  temp = style.pointerEvents;
  if(temp) {
    if(temp === 'inherit') {
      res[POINTER_EVENTS] = [0, INHERIT];
    }
    else {
      res[POINTER_EVENTS] = [temp, STRING];
    }
  }
  temp = style.boxShadow;
  if(temp !== undefined) {
    let bs = null;
    let match = (temp || '').match(/(-?[\d.]+(px)?)\s+(-?[\d.]+(px)?)\s+(-?[\d.]+(px)?\s*)?(-?[\d.]+(px)?\s*)?(((transparent)|(#[0-9a-f]{3,8})|(rgba?\(.+?\)))\s*)?(inset|outset)?\s*,?/ig);
    if(match) {
      match.forEach(item => {
        let boxShadow = /(-?[\d.]+(?:px)?)\s+(-?[\d.]+(?:px)?)\s+(-?[\d.]+(?:px)?\s*)?(-?[\d.]+(?:px)?\s*)?(?:((?:transparent)|(?:#[0-9a-f]{3,8})|(?:rgba?\(.+\)))\s*)?(inset|outset)?/i.exec(item);
        if(boxShadow) {
          bs = bs || [];
          let res = [boxShadow[1], boxShadow[2], boxShadow[3] || 0, boxShadow[4] || 0, boxShadow[5] || '#000', boxShadow[6] || 'outset'];
          for(let i = 0; i < 4; i++) {
            calUnit(res, i, res[i]);
            // x/y可以负，blur和spread不行，没有继承且只有px无需保存单位
            if(i > 1 && res[i][0] < 0) {
              res[i] = 0;
            }
            if(res[i][1] === NUMBER) {
              res[i] = res[i][0];
            }
          }
          res[4] = rgba2int(res[4]);
          bs.push(res);
        }
      });
    }
    res[BOX_SHADOW] = bs;
  }
  // 直接赋值的string类型
  [
    'position',
    'display',
    'flexDirection',
    'justifyContent',
    'alignItems',
    'alignSelf',
    'overflow',
    'mixBlendMode',
    'borderTopStyle',
    'borderRightStyle',
    'borderBottomStyle',
    'borderLeftStyle',
    'flexGrow',
    'flexShrink',
    'zIndex',
  ].forEach(k => {
    if(style.hasOwnProperty(k)) {
      res[STYLE_KEY[style2Upper(k)]] = style[k];
    }
  });
  // 这些支持多个的用数组表示
  [
    'backgroundRepeat',
    'strokeLinecap',
    'strokeLinejoin',
    'strokeMiterlimit',
    'fillRule',
  ].forEach(k => {
    if(style.hasOwnProperty(k)) {
      let v = style[k];
      res[STYLE_KEY[style2Upper(k)]] = Array.isArray(v) ? v : [v];
    }
  });
  GEOM_KEY_SET.forEach(k => {
    if(style.hasOwnProperty(k)) {
      res[k] = style[k];
    }
  });
  return res;
}

/**
 * 第一次和REFLOW等级下，刷新前首先执行，生成computedStyle
 * 影响文字测量的只有字体和大小和重量，需要提前处理
 * 继承相关的计算
 * @param node 对象节点
 * @param isHost 是否是根节点或组件节点这种局部根节点，无继承需使用默认值
 */
function computeMeasure(node, isHost) {
  let { currentStyle, computedStyle, parent } = node;
  let parentComputedStyle = !isHost && parent.computedStyle;
  MEASURE_KEY_SET.forEach(k => {
    let v = currentStyle[k];
    if(v[1] === INHERIT) {
      computedStyle[k] = isHost ? reset.INHERIT[STYLE_RV_KEY[k]] : parentComputedStyle[k];
    }
    // 只有fontSize会有%
    else if(v[1] === PERCENT) {
      computedStyle[k] = isHost ? reset.INHERIT[STYLE_RV_KEY[k]] : (parentComputedStyle[k] * v[1] * 0.01);
    }
    else {
      computedStyle[k] = v[0];
    }
  });
}

/**
 * 每次布局前需要计算的reflow相关的computedStyle
 * @param node 对象节点
 * @param isHost 是否是根节点或组件节点这种局部根节点，无继承需使用默认值
 */
function computeReflow(node, isHost) {
  let { currentStyle, computedStyle, parent } = node;
  let isRoot = !parent;
  let parentComputedStyle = parent && parent.computedStyle;
  [
    BORDER_TOP_WIDTH,
    BORDER_RIGHT_WIDTH,
    BORDER_BOTTOM_WIDTH,
    BORDER_LEFT_WIDTH,
  ].forEach(k => {
    // border-width不支持百分比
    computedStyle[k] = (currentStyle[k][1] === PX) ? Math.max(0, currentStyle[k][0]) : 0;
  });
  [
    POSITION,
    DISPLAY,
    FLEX_DIRECTION,
    JUSTIFY_CONTENT,
    ALIGN_ITEMS,
    ALIGN_SELF,
    FLEX_GROW,
    FLEX_SHRINK,
  ].forEach(k => {
    computedStyle[k] = currentStyle[k];
  });
  let textAlign = currentStyle[TEXT_ALIGN];
  if(textAlign[1] === INHERIT) {
    computedStyle[TEXT_ALIGN] = isRoot ? 'left' : parentComputedStyle[TEXT_ALIGN];
  }
  else {
    computedStyle[TEXT_ALIGN] = textAlign[0];
  }
  let lineHeight = currentStyle[LINE_HEIGHT];
  if(lineHeight[1] === INHERIT) {
    computedStyle[LINE_HEIGHT] = isRoot ? calNormalLineHeight(computedStyle) : parentComputedStyle[LINE_HEIGHT];
  }
  // 防止为0
  else if(lineHeight[1] === PX) {
    computedStyle[LINE_HEIGHT] = Math.max(lineHeight[0], 0) || calNormalLineHeight(computedStyle);
  }
  else if(lineHeight[1] === NUMBER) {
    computedStyle[LINE_HEIGHT] = Math.max(lineHeight[0], 0) * computedStyle[FONT_SIZE] || calNormalLineHeight(computedStyle);
  }
  // normal
  else {
    computedStyle[LINE_HEIGHT] = calNormalLineHeight(computedStyle);
  }
  let letterSpacing = currentStyle[LETTER_SPACING];
  if(letterSpacing[1] === INHERIT) {
    computedStyle[LETTER_SPACING] = isRoot ? 0 : parentComputedStyle[LETTER_SPACING];
  }
  else {
    computedStyle[LETTER_SPACING] = letterSpacing[0];
  }
}

function setFontStyle(style) {
  let fontSize = style[FONT_SIZE];
  return (style[FONT_STYLE] || 'normal') + ' ' + (style[FONT_WEIGHT] || '400') + ' '
    + fontSize + 'px/' + fontSize + 'px ' + (style[FONT_FAMILY] || 'arial');
}

function getBaseLine(style) {
  let fontSize = style[FONT_SIZE];
  let ff = style[FONT_FAMILY];
  let normal = fontSize * (font.info[ff] || font.info.arial).lhr;
  return (style[LINE_HEIGHT] - normal) * 0.5 + fontSize * (font.info[ff] || font.info.arial).blr;
}

function calNormalLineHeight(computedStyle) {
  let ff = computedStyle[FONT_FAMILY];
  return computedStyle[FONT_SIZE] * (font.info[ff] || font.info.arial).lhr;
}

function calRelativePercent(n, parent, k) {
  n *= 0.01;
  while(parent) {
    let style = parent.currentStyle[k];
    if(style[1] === AUTO) {
      if(k === WIDTH) {
        parent = parent.domParent;
      }
      else {
        break;
      }
    }
    else if(style[1] === PX) {
      return n * style[0];
    }
    else if(style[1] === PERCENT) {
      n *= style[0] * 0.01;
      parent = parent.domParent;
    }
  }
  return n;
}

function calRelative(currentStyle, k, v, parent, isWidth) {
  if(v[1] === AUTO) {
    v = 0;
  }
  else if([PX, NUMBER, DEG, RGBA, STRING].indexOf(v[1]) > -1) {
    v = v[0];
  }
  else if(v[1] === PERCENT) {
    if(isWidth) {
      v = calRelativePercent(v[0], parent, WIDTH);
    }
    else {
      v = calRelativePercent(v[0], parent, HEIGHT);
    }
  }
  return v;
}

function calAbsolute(currentStyle, k, v, size) {
  if(v[1] === AUTO) {
    v = 0;
  }
  else if([PX, NUMBER, DEG, RGBA, STRING].indexOf(v[1]) > -1) {
    v = v[0];
  }
  else if(v[1] === PERCENT) {
    v = v[0] * size * 0.01;
  }
  return v;
}

function equalStyle(k, a, b, target) {
  if(!a || !b) {
    return a === b;
  }
  if(k === TRANSFORM) {
    if(a.length !== b.length) {
      return false;
    }
    for(let i = 0, len = a.length; i < len; i++) {
      let oa = a[i];
      let ob = b[i];
      if(oa[0] !== ob[0]) {
        return false;
      }
      // translate/matrix等都是数组
      if(!equalArr(oa[1], ob[1])) {
        return false;
      }
    }
    return true;
  }
  if(k === FILTER) {
    if(a.length !== b.length) {
      return false;
    }
    for(let i = 0, len = a.length; i < len; i++) {
      if(!equalArr(a[i], b[i])) {
        return false;
      }
    }
  }
  if(k === BACKGROUND_SIZE) {
    if(a.length !== b.length) {
      return false;
    }
    for(let i = 0, len = a.length; i < len; i++) {
      let aa = a[i], bb = b[i];
      if(aa[0][0] !== bb[0][0] || aa[0][1] !== bb[0][1] || aa[1][0] !== bb[1][0] || aa[1][1] !== bb[1][1]) {
        return false;
      }
    }
    return true;
  }
  if(k === TRANSFORM_ORIGIN || RADIUS_HASH.hasOwnProperty(k)) {
    return a[0][0] === b[0][0] && a[0][1] === b[0][1]
      && a[1][0] === b[1][0] && a[1][1] === b[1][1];
  }
  if(k === BACKGROUND_POSITION_X || k === BACKGROUND_POSITION_Y
    || LENGTH_HASH.hasOwnProperty(k) || EXPAND_HASH.hasOwnProperty(k)) {
    return a[0] === b[0] && a[1] === b[1];
  }
  if(k === BOX_SHADOW) {
    return equalArr(a, b);
  }
  if(COLOR_HASH.hasOwnProperty(k)) {
    return a[1] === b[1] && equalArr(a[0], b[0]);
  }
  if(GRADIENT_HASH.hasOwnProperty(k) && a.k === b.k && GRADIENT_TYPE.hasOwnProperty(a.k)) {
    let av = a.v;
    let bv = b.v;
    if(a.d !== b.d || av.length !== bv.length) {
      return false;
    }
    for(let i = 0, len = av.length; i < len; i++) {
      let ai = av[i];
      let bi = bv[i];
      if(ai.length !== bi.length) {
        return false;
      }
      for(let j = 0; j < 4; j++) {
        if(ai[0][j] !== bi[0][j]) {
          return false;
        }
      }
      if(ai.length > 1) {
        if(ai[1][0] !== bi[1][0] || ai[1][1] !== bi[1][1]) {
          return false;
        }
      }
    }
    return true;
  }
  // multi都是纯值数组，equalArr本身即递归，非multi根据类型判断
  if(isGeom(target.tagName, k) && (target.isMulti || Array.isArray(a) && Array.isArray(b))) {
    return equalArr(a, b);
  }
  return a === b;
}

function isRelativeOrAbsolute(node) {
  let position = node.currentStyle[POSITION];
  return position === 'relative' || position === 'absolute';
}

const VALUE = {
  [STYLE_KEY.POSITION]: true,
  [STYLE_KEY.DISPLAY]: true,
  [STYLE_KEY.BACKGROUND_REPEAT]: true,
  [STYLE_KEY.FLEX_DIRECTION]: true,
  [STYLE_KEY.FLEX_GROW]: true,
  [STYLE_KEY.FLEX_SHRINK]: true,
  [STYLE_KEY.JUSTIFY_CONTENT]: true,
  [STYLE_KEY.ALIGN_ITEMS]: true,
  [STYLE_KEY.ALIGN_SELF]: true,
  [STYLE_KEY.OVERFLOW]: true,
  [STYLE_KEY.MIX_BLEND_MODE]: true,
  [STYLE_KEY.STROKE_LINECAP]: true,
  [STYLE_KEY.STROKE_LINEJOIN]: true,
  [STYLE_KEY.STROKE_MITERLIMIT]: true,
  [STYLE_KEY.FILL_RULE]: true,
  [STYLE_KEY.OPACITY]: true,
  [STYLE_KEY.Z_INDEX]: true,
};
const ARRAY_0 = {
  [STYLE_KEY.COLOR]: true,
  // [STYLE_KEY.BACKGROUND_SIZE]: true,
  [STYLE_KEY.BACKGROUND_COLOR]: true,
  [STYLE_KEY.BORDER_TOP_COLOR]: true,
  [STYLE_KEY.BORDER_RIGHT_COLOR]: true,
  [STYLE_KEY.BORDER_BOTTOM_COLOR]: true,
  [STYLE_KEY.BORDER_LEFT_COLOR]: true,
};
const ARRAY_0_1 = {
  [STYLE_KEY.BORDER_TOP_LEFT_RADIUS]: true,
  [STYLE_KEY.BORDER_TOP_RIGHT_RADIUS]: true,
  [STYLE_KEY.BORDER_BOTTOM_RIGHT_RADIUS]: true,
  [STYLE_KEY.BORDER_BOTTOM_LEFT_RADIUS]: true,
  [STYLE_KEY.TRANSFORM_ORIGIN]: true,
};
function cloneStyle(style, keys) {
  if(!keys) {
    keys = Object.keys(style).map(i => {
      if(!GEOM.hasOwnProperty(i)) {
        i = parseInt(i);
      }
      return i;
    });
  }
  let res = {};
  for(let i = 0, len = keys.length; i < len; i++) {
    let k = keys[i];
    let v = style[k];
    // 渐变特殊处理
    if(k === BACKGROUND_IMAGE) {
      res[k] = v.map(item => {
        if(item.k) {
          return util.clone(item);
        }
        else {
          return item;
        }
      });
    }
    else if(k === FILL || k === STROKE) {
      res[k] = v.map(item => {
        // 渐变
        if(item.k) {
          return util.clone(item);
        }
        // 颜色
        else {
          return item.slice(0);
        }
      });
    }
    else if(k === TRANSFORM) {
      if(v) {
        let n = v.slice(0);
        for(let i = 0, len = n.length; i < len; i++) {
          n[i] = n[i].slice(0);
          n[i][1] = n[i][1].slice(0);
        }
        res[k] = n;
      }
    }
    else if(k === BOX_SHADOW) {
      if(v) {
        v = v.map(item => {
          let n = item.slice(0);
          n[4] = n[4].slice(0);
          return n;
        });
        res[k] = v;
      }
    }
    // position等直接值类型赋值
    else if(VALUE.hasOwnProperty(k)) {
      res[k] = v;
    }
    // geom自定义属性
    else if(GEOM.hasOwnProperty(k)) {
      res[k] = util.clone(v);
    }
    // 其余皆是数组或空
    else if(v) {
      let n = res[k] = v.slice(0);
      // 特殊引用里数组某项再次clone
      if(k === BACKGROUND_POSITION_X || k === BACKGROUND_POSITION_Y) {
        for(let i = 0, len = n.length; i < len; i++) {
          n[i] = n[i].slice(0);
        }
      }
      else if(k === BACKGROUND_SIZE) {
        for(let i = 0, len = n.length; i < len; i++) {
          n[i] = n[i].slice(0);
          n[i][0] = n[i][0].slice(0);
          n[i][1] = n[i][1].slice(0);
        }
      }
      else if(ARRAY_0.hasOwnProperty(k)) {
        n[0] = n[0].slice(0);
      }
      else if(ARRAY_0_1.hasOwnProperty(k)) {
        n[0] = n[0].slice(0);
        n[1] = n[1].slice(0);
      }
      else if(k === TRANSFORM) {
        for(let i = 0, len = n.length; i < len; i++) {
          n[i] = n[i].slice(0);
        }
      }
    }
  }
  return res;
}

export default {
  normalize,
  computeMeasure,
  computeReflow,
  setFontStyle,
  getBaseLine,
  calRelative,
  calAbsolute,
  equalStyle,
  isRelativeOrAbsolute,
  cloneStyle,
};
