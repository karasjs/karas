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
  TRANSLATE_Z,
  SCALE_X,
  SCALE_Y,
  SCALE_Z,
  SKEW_X,
  SKEW_Y,
  ROTATE_X,
  ROTATE_Y,
  ROTATE_Z,
  ROTATE_3D,
  PERSPECTIVE,
  PERSPECTIVE_ORIGIN,
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
  BACKGROUND_CLIP,
  WHITE_SPACE,
  TEXT_OVERFLOW,
  LINE_CLAMP,
  ORDER,
  FLEX_WRAP,
  ALIGN_CONTENT,
  TRANSLATE_PATH,
  TEXT_STROKE_COLOR,
  TEXT_STROKE_WIDTH,
  TEXT_STROKE_OVER,
} } = enums;
const { AUTO, PX, PERCENT, NUMBER, INHERIT, DEG, RGBA, STRING, REM, VW, VH, VMAX, VMIN, calUnit } = unit;
const { isNil, rgba2int, equalArr } = util;
const { MEASURE_KEY_SET, isGeom, GEOM, GEOM_KEY_SET } = change;

const {
  COLOR_HASH,
  LENGTH_HASH,
  RADIUS_HASH,
  GRADIENT_HASH,
  EXPAND_HASH,
  GRADIENT_TYPE,
} = key;

const TRANSFORM_HASH = {
  translateX: TRANSLATE_X,
  translateY: TRANSLATE_Y,
  translateZ: TRANSLATE_Z,
  scaleX: SCALE_X,
  scaleY: SCALE_Y,
  scaleZ: SCALE_Z,
  skewX: SKEW_X,
  skewY: SKEW_Y,
  rotateX: ROTATE_X,
  rotateY: ROTATE_Y,
  rotateZ: ROTATE_Z,
  rotate: ROTATE_Z,
};

function compatibleTransform(k, arr) {
  if(k === SCALE_X || k === SCALE_Y || k === SCALE_Z) {
    arr[1] = NUMBER;
  }
  else if(k === TRANSLATE_X || k === TRANSLATE_Y || k === TRANSLATE_Z) {
    if(arr[1] === NUMBER) {
      arr[1] = PX;
    }
  }
  else if(k === PERSPECTIVE) {
    if([NUMBER, PERCENT, DEG].indexOf(arr[1]) > -1) {
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
  // flex-flow
  temp = style.flexFlow;
  if(temp) {
    abbr.toFull(style, 'flexFlow');
  }
  temp = style.margin;
  if(!isNil(temp)) {
    abbr.toFull(style, 'margin');
  }
  temp = style.padding;
  if(!isNil(temp)) {
    abbr.toFull(style, 'padding');
  }
  temp = style.textStroke;
  if(temp) {
    abbr.toFull(style, 'textStroke');
  }
  // 扩展css，将transform几个值拆分为独立的css为动画准备，同时不能使用transform
  ['translate', 'scale', 'skew', 'translate3d', 'scale3d', 'rotate'].forEach(k => {
    temp = style[k];
    if(!isNil(temp)) {
      abbr.toFull(style, k);
    }
  });
  // 扩展的不能和transform混用，给出警告
  [
    'translateX',
    'translateY',
    'translateZ',
    'scaleX',
    'scaleY',
    'scaleZ',
    'skewX',
    'skewY',
    'rotateX',
    'rotateY',
    'rotateZ',
    'rotate3d',
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
      if(!Array.isArray(temp)) {
        temp = [temp];
      }
      res[k] = temp.map(item => {
        if(/^[-+]?[\d.]/.test(item)) {
          let v = calUnit(item);
          if([NUMBER, DEG].indexOf(v[1]) > -1) {
            v[1] = PX;
          }
          return v;
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
  });
  // 背景尺寸
  temp = style.backgroundSize;
  if(temp) {
    if(!Array.isArray(temp)) {
      temp = [temp];
    }
    res[BACKGROUND_SIZE] = temp.map(item => {
      if(!item) {
        return [
          [0, AUTO],
          [0, AUTO],
        ];
      }
      let match = item.toString().match(/\b(?:([-+]?[\d.]+[pxremvwhina%]*)|(contain|cover|auto))/ig);
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
          if(/^[-+]?[\d.]/.test(item)) {
            let n = calUnit(item);
            if([NUMBER, DEG].indexOf(n[1]) > -1) {
              n[1] = PX;
            }
            v.push(n);
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
        if(/^[-+]?[\d.]/.test(item)) {
          let n = calUnit(item);
          if([NUMBER, DEG].indexOf(n[1]) > -1) {
            n[1] = PX;
          }
          if(n[0] < 0) {
            n[0] = 0;
          }
          arr[i] = n;
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
            transform.push([MATRIX, [
              arr[0], arr[1], 0, 0, arr[2], arr[3], 0, 0, 0, 0, 1, 0, arr[4], arr[5], 0, 1,
            ]]);
          }
        }
        else if(k === 'matrix3d') {
          let arr = v.toString().split(/\s*,\s*/);
          arr = arr.map(item => parseFloat(item));
          if(arr.length > 16) {
            arr = arr.slice(0, 16);
          }
          if(arr.length === 16) {
            transform.push([MATRIX, arr]);
          }
        }
        else if(k === 'perspective') {
          let arr = calUnit(v);
          if(arr[0] < 0) {
            arr[0] = 0;
          }
          compatibleTransform(PERSPECTIVE, arr);
          transform.push([PERSPECTIVE, arr]);
        }
        else if(k === 'rotate3d') {
          let arr = v.toString().split(/\s*,\s*/);
          if(arr.length === 4) {
            let deg = calUnit(arr[3]);
            compatibleTransform(ROTATE_3D, deg);
            arr[0] = parseFloat(arr[0]);
            arr[1] = parseFloat(arr[1]);
            arr[2] = parseFloat(arr[2]);
            arr[3] = deg;
            transform.push([ROTATE_3D, arr]);
          }
        }
        else if(TRANSFORM_HASH.hasOwnProperty(k)) {
          let k2 = TRANSFORM_HASH[k];
          let arr = calUnit(v);
          compatibleTransform(k2, arr);
          transform.push([k2, arr]);
        }
        else if({ translate: true, scale: true, skew: true }.hasOwnProperty(k)) {
          let arr = v.toString().split(/\s*,\s*/);
          if(arr.length === 1) {
            arr[1] = k === 'scale' ? arr[0] : [0];
          }
          if(arr.length === 2) {
            let k1 = STYLE_KEY[style2Upper(k + 'X')];
            let k2 = STYLE_KEY[style2Upper(k + 'Y')];
            let arr1 = calUnit(arr[0]);
            let arr2 = calUnit(arr[1]);
            compatibleTransform(k1, arr1);
            compatibleTransform(k2, arr2);
            transform.push([k1, arr1]);
            transform.push([k2, arr2]);
          }
        }
        else if({ translate3d: true, scale3d: true }.hasOwnProperty(k)) {
          let arr = v.toString().split(/\s*,\s*/);
          if(arr.length === 1) {
            arr[1] = k === 'scale3d' ? [1] : [0];
            arr[2] = k === 'scale3d' ? [1] : [0];
          }
          else if(arr.length === 2) {
            arr[2] = k === 'scale3d' ? [1] : [0];
          }
          if(arr.length === 3) {
            let k1 = STYLE_KEY[style2Upper(k + 'X')];
            let k2 = STYLE_KEY[style2Upper(k + 'Y')];
            let k3 = STYLE_KEY[style2Upper(k + 'Z')];
            let arr1 = calUnit(arr[0]);
            let arr2 = calUnit(arr[1]);
            let arr3 = calUnit(arr[2]);
            compatibleTransform(k1, arr1);
            compatibleTransform(k2, arr2);
            compatibleTransform(k3, arr3);
            transform.push([k1, arr1]);
            transform.push([k2, arr2]);
            transform.push([k3, arr3]);
          }
        }
      });
    }
  }
  temp = style.perspective;
  if(!isNil(temp)) {
    let arr = calUnit(temp);
    if(arr[0] < 0) {
      arr[0] = 0;
    }
    compatibleTransform(PERSPECTIVE, arr);
    res[PERSPECTIVE] = arr;
  }
  ['perspectiveOrigin', 'transformOrigin'].forEach(k => {
    temp = style[k];
    if(!isNil(temp)) {
      let arr = res[STYLE_KEY[style2Upper(k)]] = [];
      let match = temp.toString().match(reg.position);
      if(match) {
        if(match.length === 1) {
          match[1] = match[0];
        }
        for(let i = 0; i < 2; i++) {
          let item = match[i];
          if(/^[-+]?[\d.]/.test(item)) {
            let n = calUnit(item);
            if([NUMBER, DEG].indexOf(n[1]) > -1) {
              n[1] = PX;
            }
            arr.push(n);
          }
          else {
            arr.push([
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
            if(isNil(arr[i][0])) {
              arr[i][0] = 50;
            }
          }
        }
      }
      else {
        arr.push([50, PERCENT]);
        arr.push([50, PERCENT]);
      }
    }
  });
  [
    'translateX',
    'translateY',
    'translateZ',
    'scaleX',
    'scaleY',
    'scaleZ',
    'skewX',
    'skewY',
    'rotateX',
    'rotateY',
    'rotateZ',
    'rotate',
  ].forEach(k => {
    let v = style[k];
    if(isNil(v)) {
      return;
    }
    let k2 = TRANSFORM_HASH[k];
    let n = calUnit(v);
    // 没有单位或默认值处理单位
    compatibleTransform(k2, n);
    res[k2] = n;
  });
  temp = style.rotate3d;
  if(temp) {
    let arr = temp.toString().split(/\s*,\s*/);
    if(arr.length === 4) {
      let deg = calUnit(arr[3]);
      compatibleTransform(ROTATE_3D, deg);
      arr[0] = parseFloat(arr[0]);
      arr[1] = parseFloat(arr[1]);
      arr[2] = parseFloat(arr[2]);
      arr[3] = deg;
      res[ROTATE_3D] = arr;
    }
  }
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
  ].forEach(k => {
    let v = style[k];
    if(isNil(v)) {
      return;
    }
    if(v === 'auto') {
      v = [0, AUTO];
    }
    else {
      v = calUnit(v);
      // 无单位视为px
      if([NUMBER, DEG].indexOf(v[1]) > -1) {
        v[1] = PX;
      }
    }
    let k2 = STYLE_KEY[style2Upper(k)];
    res[k2] = v;
    // 限制padding/border为正数
    if({
      paddingTop: true,
      paddingRight: true,
      paddingBottom: true,
      paddingLeft: true,
      borderTopWidth: true,
      borderRightWidth: true,
      borderBottomWidth: true,
      borderLeftWidth: true,
      width: true,
      height: true,
    }.hasOwnProperty(k) && v[0] < 0) {
      v[0] = 0;
    }
  });
  temp = style.flexBasis;
  if(!isNil(temp)) {
    if(temp === 'content') {
      res[FLEX_BASIS] = [temp, STRING];
    }
    else if(/^[\d.]/.test(temp)) {
      let v = res[FLEX_BASIS] = calUnit(temp);
      v[0] = Math.max(v[0], 0);
      // 无单位视为px
      if([NUMBER, DEG].indexOf(v[1]) > -1) {
        v[1] = PX;
      }
    }
    else {
      res[FLEX_BASIS] = [0, AUTO];
    }
  }
  temp = style.order;
  if(!isNil(temp)) {
    res[ORDER] = parseInt(temp) || 0;
  }
  temp = style.color;
  if(!isNil(temp)) {
    if(temp === 'inherit') {
      res[COLOR] = [[], INHERIT];
    }
    else {
      res[COLOR] = [rgba2int(temp), RGBA];
    }
  }
  temp = style.textStrokeColor;
  if(!isNil(temp)) {
    if(temp === 'inherit') {
      res[TEXT_STROKE_COLOR] = [[], INHERIT];
    }
    else {
      res[TEXT_STROKE_COLOR] = [rgba2int(temp), RGBA];
    }
  }
  temp = style.fontSize;
  if(temp || temp === 0) {
    if(temp === 'inherit') {
      res[FONT_SIZE] = [0, INHERIT];
    }
    else {
      let v = calUnit(temp);
      // fontSize不能为负数，否则为继承
      if(v < 0) {
        res[FONT_SIZE] = [0, INHERIT];
      }
      else {
        if([NUMBER, DEG].indexOf(v[1]) > -1) {
          v[1] = PX;
        }
        res[FONT_SIZE] = v;
      }
    }
  }
  temp = style.textStrokeWidth;
  if(!isNil(temp)) {
    if(temp === 'inherit') {
      res[TEXT_STROKE_WIDTH] = [0, INHERIT];
    }
    else {
      let v = calUnit(temp);
      // textStrokeWidth不能为负数，否则为继承
      if(v < 0) {
        res[TEXT_STROKE_WIDTH] = [0, INHERIT];
      }
      else {
        if([NUMBER, DEG, PERCENT].indexOf(v[1]) > -1) {
          v[1] = PX;
        }
        res[TEXT_STROKE_WIDTH] = v;
      }
    }
  }
  temp = style.textStrokeOver;
  if(!isNil(temp)) {
    if(temp === 'inherit') {
      res[TEXT_STROKE_OVER] = [0, INHERIT];
    }
    else {
      let v = temp.toString();
      if(v !== 'none' && v !== 'fill') {
        v = 'none';
      }
      res[TEXT_STROKE_OVER] = [v, STRING];
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
      // 统一文字声明格式
      res[FONT_FAMILY] = [temp.toString().toLowerCase().replace(/['"]/, '').replace(/\s*,\s*/g, ','), STRING];
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
    else if(/^[\d.]+/i.test(temp)) {
      let v = calUnit(temp);
      if([DEG].indexOf(v[1]) > -1) {
        v[1] = NUMBER;
      }
      res[LINE_HEIGHT] = v;
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
    else if(/^[-+]?[\d.]/.test(temp)) {
      let v = calUnit(temp);
      if([NUMBER, DEG].indexOf(v[1]) > -1) {
        v[1] = PX;
      }
      res[LETTER_SPACING] = v;
    }
    else {
      res[LETTER_SPACING] = [parseFloat(temp) || 0, PX];
    }
  }
  temp = style.whiteSpace;
  if(temp) {
    if(temp === 'inherit') {
      res[WHITE_SPACE] = [0, INHERIT];
    }
    else {
      res[WHITE_SPACE] = [temp, STRING];
    }
  }
  temp = style.lineClamp;
  if(temp !== undefined) {
    temp = parseInt(temp) || 0;
    res[LINE_CLAMP] = Math.max(0, temp);
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
    if(!Array.isArray(temp)) {
      temp = [temp];
    }
    res[STROKE_WIDTH] = temp.map(item => {
      let v = calUnit(item);
      if([NUMBER, DEG].indexOf(v[1]) > -1) {
        v[1] = PX;
      }
      v[0] = Math.max(v[0], 0);
      return v;
    });
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
    let match = (temp || '').toString().match(/\b[\w-]+\s*\(\s*[-+]?[\d.]+\s*[pxremvwhdg%]*\s*\)\s*/ig);
    let f = null;
    if(match) {
      f = [];
      match.forEach(item => {
        let m2 = /([\w-]+)\s*\(\s*([-+]?[\d.]+\s*[pxremvwhdg%]*)\s*\)\s*/i.exec(item);
        if(m2) {
          let k = m2[1].toLowerCase(), v = calUnit(m2[2]);
          if(k === 'blur') {
            if(v[0] <= 0 || [DEG, PERCENT].indexOf(v[1]) > -1) {
              return;
            }
            if(v[1] === NUMBER) {
              v[1] = PX;
            }
            f.push([k, v]);
          }
          else if(k === 'hue-rotate') {
            if([NUMBER, DEG].indexOf(v[1]) === -1) {
              return;
            }
            v[1] = DEG;
            f.push([k, v]);
          }
          else if(k === 'saturate' || k === 'brightness' || k === 'grayscale' || k === 'contrast') {
            if([NUMBER, PERCENT].indexOf(v[1]) === -1) {
              return;
            }
            v[0] = Math.max(v[0], 0);
            v[1] = PERCENT;
            f.push([k, v]);
          }
        }
      });
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
    let match = (temp || '').match(/([-+]?[\d.]+[pxremvwhina%]*)\s*([-+]?[\d.]+[pxremvwhina%]*)\s*([-+]?[\d.]+[pxremvwhina%]*\s*)?([-+]?[\d.]+[pxremvwhina%]*\s*)?(((transparent)|(#[0-9a-f]{3,8})|(rgba?\(.+?\)))\s*)?(inset|outset)?\s*,?/ig);
    if(match) {
      match.forEach(item => {
        let boxShadow = /([-+]?[\d.]+[pxremvwhina%]*)\s*([-+]?[\d.]+[pxremvwhina%]*)\s*([-+]?[\d.]+[pxremvwhina%]*\s*)?([-+]?[\d.]+[pxremvwhina%]*\s*)?(?:((?:transparent)|(?:#[0-9a-f]{3,8})|(?:rgba?\(.+\)))\s*)?(inset|outset)?/i.exec(item);
        if(boxShadow) {
          bs = bs || [];
          let res = [];
          // v,h,blur,spread,color,inset
          for(let i = 0; i < 4; i++) {
            let v = calUnit(boxShadow[i + 1]);
            if([NUMBER, DEG].indexOf(v[1]) > -1) {
              v[1] = PX;
            }
            // x/y可以负，blur和spread不行
            if(i > 1 && v[0] < 0) {
              v = 0;
            }
            res.push(v);
          }
          res.push(rgba2int(boxShadow[5]));
          res.push(boxShadow[6] || 'outset');
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
    'flexWrap',
    'justifyContent',
    'alignItems',
    'alignSelf',
    'alignContent',
    'overflow',
    'mixBlendMode',
    'borderTopStyle',
    'borderRightStyle',
    'borderBottomStyle',
    'borderLeftStyle',
    'backgroundClip',
    'textOverflow',
  ].forEach(k => {
    if(style.hasOwnProperty(k)) {
      res[STYLE_KEY[style2Upper(k)]] = style[k];
    }
  });
  // 直接赋值的number类型
  [
    'flexGrow',
    'flexShrink',
  ].forEach(k => {
    if(style.hasOwnProperty(k)) {
      res[STYLE_KEY[style2Upper(k)]] = Math.max(parseFloat(style[k]) || 0, 0);
    }
  });
  temp = style.zIndex;
  if(!isNil(temp)) {
    res[Z_INDEX] = parseFloat(temp) || 0;
  }
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
 * @param isRoot 是否是根节点，无继承需使用默认值
 */
function computeMeasure(node, isRoot) {
  let { currentStyle, computedStyle, domParent } = node;
  let parentComputedStyle = !isRoot && domParent.computedStyle;
  MEASURE_KEY_SET.forEach(k => {
    let v = currentStyle[k];
    // ff特殊处理
    if(k === FONT_FAMILY) {
      if(v[1] === INHERIT) {
        computedStyle[k] = getFontFamily(isRoot ? reset.INHERIT[STYLE_RV_KEY[k]] : parentComputedStyle[k]);
      }
      else {
        computedStyle[k] = getFontFamily(v[0]);
      }
    }
    else if(v[1] === INHERIT) {
      computedStyle[k] = isRoot ? reset.INHERIT[STYLE_RV_KEY[k]] : parentComputedStyle[k];
    }
    // 只有fontSize会有%
    else if(v[1] === PERCENT) {
      computedStyle[k] = isRoot ? reset.INHERIT[STYLE_RV_KEY[k]] : (parentComputedStyle[k] * v[0] * 0.01);
    }
    else if(v[1] === REM) {
      computedStyle[k] = isRoot ? reset.INHERIT[STYLE_RV_KEY[k]] : (node.root.computedStyle[FONT_SIZE] * v[0]);
    }
    else if(v[1] === VW) {
      computedStyle[k] = isRoot ? reset.INHERIT[STYLE_RV_KEY[k]] : (node.root.width * 0.01 * v[0]);
    }
    else if(v[1] === VH) {
      computedStyle[k] = isRoot ? reset.INHERIT[STYLE_RV_KEY[k]] : (node.root.height * 0.01 * v[0]);
    }
    else if(v[1] === VMAX) {
      computedStyle[k] = isRoot ? reset.INHERIT[STYLE_RV_KEY[k]] : (Math.max(node.root.width, node.root.height) * 0.01 * v[0]);
    }
    else if(v[1] === VMIN) {
      computedStyle[k] = isRoot ? reset.INHERIT[STYLE_RV_KEY[k]] : (Math.min(node.root.width, node.root.height) * 0.01 * v[0]);
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
  let { currentStyle, computedStyle, domParent: parent, root } = node;
  let rem = root.computedStyle[FONT_SIZE];
  let isRoot = !parent;
  let parentComputedStyle = parent && parent.computedStyle;
  [
    BORDER_TOP_WIDTH,
    BORDER_RIGHT_WIDTH,
    BORDER_BOTTOM_WIDTH,
    BORDER_LEFT_WIDTH,
  ].forEach(k => {
    // border-width不支持百分比
    let item = currentStyle[k];
    if(item[1] === PX) {
      computedStyle[k] = item[0];
    }
    else if(item[1] === REM) {
      computedStyle[k] = item[0] * rem;
    }
    else if(item[1] === VW) {
      computedStyle[k] = item[0] * root.width * 0.01;
    }
    else if(item[1] === VH) {
      computedStyle[k] = item[0] * root.height * 0.01;
    }
    else if(item[1] === VMAX) {
      computedStyle[k] = item[0] * Math.max(root.width, root.height) * 0.01;
    }
    else if(item[1] === VMIN) {
      computedStyle[k] = item[0] * Math.min(root.width, root.height) * 0.01;
    }
    else {
      computedStyle[k] = 0;
    }
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
    LINE_CLAMP,
    ORDER,
    FLEX_WRAP,
    ALIGN_CONTENT,
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
  let fontSize = computedStyle[FONT_SIZE];
  let lineHeight = currentStyle[LINE_HEIGHT];
  // lineHeight继承很特殊，数字和normal不同于普通单位
  if(lineHeight[1] === INHERIT) {
    if(isRoot) {
      computedStyle[LINE_HEIGHT] = calNormalLineHeight(computedStyle);
    }
    else {
      let p = parent;
      let ph;
      while(p) {
        ph = p.currentStyle[LINE_HEIGHT];
        if(ph[1] !== INHERIT) {
          break;
        }
        p = p.domParent;
      }
      // 到root还是inherit或normal，或者中途遇到了normal，使用normal
      if([AUTO, INHERIT].indexOf(ph[1]) > -1) {
        computedStyle[LINE_HEIGHT] = calNormalLineHeight(computedStyle);
      }
      // 数字继承
      else if(ph[1] === NUMBER) {
        computedStyle[LINE_HEIGHT] = Math.max(ph[0], 0) * fontSize;
      }
      // 单位继承
      else {
        computedStyle[LINE_HEIGHT] = parentComputedStyle[LINE_HEIGHT];
      }
    }
  }
  // 防止为0
  else if(lineHeight[1] === PX) {
    computedStyle[LINE_HEIGHT] = Math.max(lineHeight[0], 0) || calNormalLineHeight(computedStyle);
  }
  else if(lineHeight[1] === PERCENT) {
    computedStyle[LINE_HEIGHT] = Math.max(lineHeight[0] * fontSize * 0.01, 0) || calNormalLineHeight(computedStyle);
  }
  else if(lineHeight[1] === REM) {
    computedStyle[LINE_HEIGHT] = Math.max(lineHeight[0] * rem, 0) || calNormalLineHeight(computedStyle);
  }
  else if(lineHeight[1] === VW) {
    computedStyle[LINE_HEIGHT] = Math.max(lineHeight[0] * root.width * 0.01, 0) || calNormalLineHeight(computedStyle);
  }
  else if(lineHeight[1] === VH) {
    computedStyle[LINE_HEIGHT] = Math.max(lineHeight[0] * root.height * 0.01, 0) || calNormalLineHeight(computedStyle);
  }
  else if(lineHeight[1] === VMAX) {
    computedStyle[LINE_HEIGHT] = Math.max(lineHeight[0] * Math.max(root.width, root.height) * 0.01, 0) || calNormalLineHeight(computedStyle);
  }
  else if(lineHeight[1] === VMIN) {
    computedStyle[LINE_HEIGHT] = Math.max(lineHeight[0] * Math.min(root.width, root.height) * 0.01, 0) || calNormalLineHeight(computedStyle);
  }
  else if(lineHeight[1] === NUMBER) {
    computedStyle[LINE_HEIGHT] = Math.max(lineHeight[0], 0) * fontSize || calNormalLineHeight(computedStyle);
  }
  // normal或auto
  else {
    computedStyle[LINE_HEIGHT] = calNormalLineHeight(computedStyle);
  }
  let letterSpacing = currentStyle[LETTER_SPACING];
  if(letterSpacing[1] === INHERIT) {
    computedStyle[LETTER_SPACING] = isRoot ? 0 : parentComputedStyle[LETTER_SPACING];
  }
  else if(letterSpacing[1] === PERCENT) {
    computedStyle[LETTER_SPACING] = fontSize * 0.01 * letterSpacing[0];
  }
  else if(letterSpacing[1] === REM) {
    computedStyle[LETTER_SPACING] = rem * letterSpacing[0];
  }
  else if(letterSpacing[1] === VW) {
    computedStyle[LETTER_SPACING] = root.width * 0.01 * letterSpacing[0];
  }
  else if(letterSpacing[1] === VH) {
    computedStyle[LETTER_SPACING] = root.height * 0.01 * letterSpacing[0];
  }
  else if(letterSpacing[1] === VMAX) {
    computedStyle[LETTER_SPACING] = Math.max(root.width, root.height) * 0.01 * letterSpacing[0];
  }
  else if(letterSpacing[1] === VMIN) {
    computedStyle[LETTER_SPACING] = Math.min(root.width, root.height) * 0.01 * letterSpacing[0];
  }
  else {
    computedStyle[LETTER_SPACING] = letterSpacing[0];
  }
  //whiteSpace
  let whiteSpace = currentStyle[WHITE_SPACE];
  if(whiteSpace[1] === INHERIT) {
    computedStyle[WHITE_SPACE] = isRoot ? 'normal' : parentComputedStyle[WHITE_SPACE];
  }
  else {
    computedStyle[WHITE_SPACE] = whiteSpace[0];
  }
}

function setFontStyle(style) {
  let fontSize = style[FONT_SIZE] || 0;
  let fontFamily = style[FONT_FAMILY] || 'arial';
  if(/\s/.test(fontFamily)) {
    fontFamily = '"' + fontFamily.replace(/"/g, '\\"') + '"';
  }
  return (style[FONT_STYLE] || 'normal') + ' ' + (style[FONT_WEIGHT] || '400') + ' '
    + fontSize + 'px/' + fontSize + 'px ' + fontFamily;
}

function getFontFamily(str) {
  let ff = str.split(',');
  let f = 'arial';
  for(let i = 0, len = ff.length; i < len; i++) {
    if(font.support(ff[i])) {
      f = ff[i];
      break;
    }
  }
  return f;
}

function getBaseLine(style) {
  let fontSize = style[FONT_SIZE];
  let ff = getFontFamily(style[FONT_FAMILY]);
  let normal = fontSize * (font.info[ff] || font.info.arial).lhr;
  return (style[LINE_HEIGHT] - normal) * 0.5 + fontSize * (font.info[ff] || font.info.arial).blr;
}

function calNormalLineHeight(style) {
  let ff = getFontFamily(style[FONT_FAMILY]);
  return style[FONT_SIZE] * (font.info[ff] || font.info.arial).lhr;
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
    else if(style[1] === REM) {
      return n * style[0] * parent.root.computedStyle[FONT_SIZE];
    }
    else if(style[1] === VW) {
      return n * style[0] * parent.root.width * 0.01;
    }
    else if(style[1] === VH) {
      return n * style[0] * parent.root.height * 0.01;
    }
    else if(style[1] === VMAX) {
      return n * style[0] * Math.max(parent.root.width, parent.root.height) * 0.01;
    }
    else if(style[1] === VMIN) {
      return n * style[0] * Math.min(parent.root.width, parent.root.height) * 0.01;
    }
  }
  return n;
}

function calRelative(currentStyle, k, v, parent, isWidth) {
  if(v[1] === AUTO) {
    v = 0;
  }
  else if([PX, NUMBER].indexOf(v[1]) > -1) {
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
  else if(v[1] === REM) {
    v = v[0] * parent.root.computedStyle[FONT_SIZE];
  }
  else if(v[1] === VW) {
    v = v[0] * parent.root.width * 0.01;
  }
  else if(v[1] === VH) {
    v = v[0] * parent.root.height * 0.01;
  }
  else if(v[1] === VMAX) {
    v = v[0] * Math.max(parent.root.width, parent.root.height) * 0.01;
  }
  else if(v[1] === VMIN) {
    v = v[0] * Math.min(parent.root.width, parent.root.height) * 0.01;
  }
  return v;
}

function calAbsolute(currentStyle, k, v, size, root) {
  if(v[1] === AUTO) {
    v = 0;
  }
  else if([PX, NUMBER, DEG, RGBA, STRING].indexOf(v[1]) > -1) {
    v = v[0];
  }
  else if(v[1] === PERCENT) {
    v = v[0] * size * 0.01;
  }
  else if(v[1] === REM) {
    v = v[0] * root.computedStyle[FONT_SIZE];
  }
  else if(v[1] === VW) {
    v = v[0] * root.width * 0.01;
  }
  else if(v[1] === VH) {
    v = v[0] * root.height * 0.01;
  }
  else if(v[1] === VMAX) {
    v = v[0] * Math.max(root.width, root.height) * 0.01;
  }
  else if(v[1] === VMIN) {
    v = v[0] * Math.min(root.width, root.height) * 0.01;
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
  [POSITION]: true,
  [DISPLAY]: true,
  [STYLE_KEY.BACKGROUND_REPEAT]: true,
  [FLEX_DIRECTION]: true,
  [FLEX_GROW]: true,
  [FLEX_SHRINK]: true,
  [FLEX_WRAP]: true,
  [JUSTIFY_CONTENT]: true,
  [ALIGN_ITEMS]: true,
  [ALIGN_SELF]: true,
  [STYLE_KEY.OVERFLOW]: true,
  [STYLE_KEY.MIX_BLEND_MODE]: true,
  [STYLE_KEY.STROKE_LINECAP]: true,
  [STYLE_KEY.STROKE_LINEJOIN]: true,
  [STYLE_KEY.STROKE_MITERLIMIT]: true,
  [STYLE_KEY.FILL_RULE]: true,
  [OPACITY]: true,
  [Z_INDEX]: true,
  [BACKGROUND_CLIP]: true,
  [TEXT_OVERFLOW]: true,
  [LINE_CLAMP]: true,
};
// 仅1维数组
const ARRAY_0 = {
  [COLOR]: true,
  [TEXT_STROKE_COLOR]: true,
  [BACKGROUND_COLOR]: true,
  [STYLE_KEY.BORDER_TOP_COLOR]: true,
  [STYLE_KEY.BORDER_RIGHT_COLOR]: true,
  [STYLE_KEY.BORDER_BOTTOM_COLOR]: true,
  [STYLE_KEY.BORDER_LEFT_COLOR]: true,
};
// 仅2维数组且只有2个值
const ARRAY_0_1 = {
  [STYLE_KEY.BORDER_TOP_LEFT_RADIUS]: true,
  [STYLE_KEY.BORDER_TOP_RIGHT_RADIUS]: true,
  [STYLE_KEY.BORDER_BOTTOM_RIGHT_RADIUS]: true,
  [STYLE_KEY.BORDER_BOTTOM_LEFT_RADIUS]: true,
  [TRANSFORM_ORIGIN]: true,
  [PERSPECTIVE_ORIGIN]: true,
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
        // 可能为null
        if(item && item.k) {
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
        // 可能非法为空
        if(item && item.k) {
          return util.clone(item);
        }
        // 颜色
        else {
          return item.slice(0);
        }
      });
    }
    else if(k === TRANSFORM || k === FILTER) {
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
    else if(k === TRANSLATE_PATH) {
      if(v) {
        res[k] = v.map(item => item.slice(0));
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
    // 其余皆是数组或空，默认是一维数组只需slice即可
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
      else if(k === ROTATE_3D) {
        n[3] = n[3].slice(0);
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
  getFontFamily,
  getBaseLine,
  calRelative,
  calAbsolute,
  equalStyle,
  isRelativeOrAbsolute,
  cloneStyle,
};
