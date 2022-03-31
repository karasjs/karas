import unit from './unit';
import font from './font';
import gradient from './gradient';
import reg from './reg';
import abbr from './abbr';
import enums from '../util/enums';
import util from '../util/util';
import inject from '../util/inject';
import key from '../animate/key';
import change from '../refresh/change';

const { STYLE_KEY, style2Upper, STYLE_KEY: {
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
  TRANSLATE_PATH,
  TEXT_STROKE_COLOR,
  TEXT_STROKE_WIDTH,
  TEXT_STROKE_OVER,
} } = enums;
const { AUTO, PX, PERCENT, NUMBER, INHERIT, DEG, RGBA, STRING, REM, VW, VH, VMAX, VMIN, GRADIENT, calUnit } = unit;
const { isNil, rgba2int, equalArr, replaceRgba2Hex } = util;
const { isGeom, GEOM, GEOM_KEY_SET } = change;

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
  temp = style.rotate3d;
  if(temp) {
    abbr.toFull(style, 'rotate3d');
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
    if(v !== undefined && style.transform) {
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
          return [gradient.parseGradient(item), GRADIENT];
        }
        if(reg.img.test(item)) {
          return [reg.img.exec(item)[2], STRING];
        }
        return null;
      });
    }
    // 区分是渐变色还是图
    else if(reg.gradient.test(temp)) {
      res[BACKGROUND_IMAGE] = [[gradient.parseGradient(temp), GRADIENT]];
    }
    else if(reg.img.test(temp)) {
      res[BACKGROUND_IMAGE] = [[reg.img.exec(temp)[2], STRING]];
    }
    else {
      res[BACKGROUND_IMAGE] = [null];
    }
  }
  temp = style.backgroundColor;
  if(temp !== undefined) {
    temp = temp || 'transparent';
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
    if(temp !== undefined) {
      temp = temp || 0;
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
  if(temp !== undefined) {
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
    if(v !== undefined) {
      res[STYLE_KEY[style2Upper(k)]] = [rgba2int(v || 'transparent'), RGBA];
    }
  });
  // border-radius
  ['TopLeft', 'TopRight', 'BottomRight', 'BottomLeft'].forEach(k => {
    k = 'border' + k + 'Radius';
    let v = style[k];
    if(v !== undefined) {
      v = v || 0;
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
  if(temp === null) {
    res[TRANSFORM] = null;
  }
  else if(temp !== undefined) {
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
            arr[0] = parseFloat(arr[0].replace('(', ''));
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
  if(temp !== undefined) {
    let arr = calUnit(temp || 0);
    if(arr[0] < 0) {
      arr[0] = 0;
    }
    compatibleTransform(PERSPECTIVE, arr);
    res[PERSPECTIVE] = arr;
  }
  ['perspectiveOrigin', 'transformOrigin'].forEach(k => {
    temp = style[k];
    if(temp !== undefined) {
      if(temp === null) {
        temp = '';
      }
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
    if(v === undefined) {
      return;
    }
    if(v === null) {
      if(k.indexOf('scale') === 0) {
        v = 1;
      }
      else {
        v = 0;
      }
    }
    let k2 = TRANSFORM_HASH[k];
    let n = calUnit(v);
    // 没有单位或默认值处理单位
    compatibleTransform(k2, n);
    res[k2] = n;
  });
  temp = style.rotate3d;
  if(temp !== undefined) {
    let arr = (temp || '').toString().split(/\s*,\s*/);
    if(arr.length === 4) {
      let deg = calUnit(arr[3]);
      compatibleTransform(ROTATE_3D, deg);
      arr[0] = parseFloat(arr[0].replace('(', ''));
      arr[1] = parseFloat(arr[1]);
      arr[2] = parseFloat(arr[2]);
      arr[3] = deg;
    }
    res[ROTATE_3D] = arr;
  }
  temp = style.opacity;
  if(temp !== undefined) {
    if(temp === null) {
      temp = 1;
    }
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
  if(temp !== undefined) {
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
    if(v === undefined) {
      return;
    }
    if(v === 'auto') {
      v = [0, AUTO];
    }
    else {
      v = calUnit(v || 0);
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
  if(temp !== undefined) {
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
  if(temp !== undefined) {
    res[ORDER] = parseInt(temp) || 0;
  }
  temp = style.color;
  if(temp !== undefined) {
    if(temp === 'inherit') {
      res[COLOR] = [[], INHERIT];
    }
    else if(reg.gradient.test(temp)) {
      res[COLOR] = [gradient.parseGradient(temp), GRADIENT];
    }
    else {
      res[COLOR] = [rgba2int(temp), RGBA];
    }
  }
  temp = style.textStrokeColor;
  if(temp !== undefined) {
    if(temp === 'inherit') {
      res[TEXT_STROKE_COLOR] = [[], INHERIT];
    }
    else if(reg.gradient.test(temp)) {
      res[TEXT_STROKE_COLOR] = [gradient.parseGradient(temp), GRADIENT];
    }
    else {
      res[TEXT_STROKE_COLOR] = [rgba2int(temp), RGBA];
    }
  }
  temp = style.fontSize;
  if(temp !== undefined) {
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
  if(temp !== undefined) {
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
  if(temp !== undefined) {
    if(temp === null || temp === 'inherit') {
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
  if(temp !== undefined) {
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
  if(temp !== undefined) {
    if(temp === null || temp === 'inherit') {
      res[FONT_STYLE] = [0, INHERIT];
    }
    else {
      res[FONT_STYLE] = [temp, STRING];
    }
  }
  temp = style.fontFamily;
  if(temp !== undefined) {
    if(temp === null || temp === 'inherit') {
      res[FONT_FAMILY] = [0, INHERIT];
    }
    else {
      // 统一文字声明格式
      res[FONT_FAMILY] = [temp.toString().toLowerCase().replace(/['"]/, '').replace(/\s*,\s*/g, ','), STRING];
    }
  }
  temp = style.textAlign;
  if(temp !== undefined) {
    if(temp === null || temp === 'inherit') {
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
    if(temp === null || temp === 'inherit') {
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
  if(temp !== undefined) {
    if(temp === null || temp === 'inherit') {
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
      res[FILL] = [['none', STRING]];
    }
    else if(Array.isArray(temp)) {
      if(temp.length) {
        res[FILL] = temp.map(item => {
          if(!item) {
            return ['none', STRING];
          }
          else if(reg.gradient.test(item)) {
            return [gradient.parseGradient(item), GRADIENT];
          }
          else {
            return [rgba2int(item), RGBA];
          }
        });
      }
      else {
        res[FILL] = [['none', STRING]];
      }
    }
    else if(reg.gradient.test(temp)) {
      res[FILL] = [[gradient.parseGradient(temp), GRADIENT]];
    }
    else {
      res[FILL] = [[rgba2int(temp), RGBA]];
    }
  }
  temp = style.stroke;
  if(temp !== undefined) {
    if(!temp) {
      res[STROKE] = [['none', STRING]];
    }
    else if(Array.isArray(temp)) {
      if(temp.length) {
        res[STROKE] = temp.map(item => {
          if(!item) {
            return ['none', STRING];
          }
          else if(reg.gradient.test(item)) {
            return [gradient.parseGradient(item), GRADIENT];
          }
          else {
            return [rgba2int(item), RGBA];
          }
        });
      }
      else {
        res[STROKE] = [['none', STRING]];
      }
    }
    else if(reg.gradient.test(temp)) {
      res[STROKE] = [[gradient.parseGradient(temp), GRADIENT]];
    }
    else {
      res[STROKE] = [[rgba2int(temp), RGBA]];
    }
  }
  temp = style.strokeWidth;
  if(temp !== undefined) {
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
  if(temp !== undefined) {
    if(Array.isArray(temp)) {
      res[STROKE_DASHARRAY] = temp.map(item => {
        let match = (item || '').toString().match(/[\d.]+/g);
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
      let match = (temp || '').toString().match(/[\d.]+/g);
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
          else if(k === 'saturate' || k === 'brightness' || k === 'grayscale' || k === 'contrast' || k === 'sepia' || k === 'invert') {
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
  if(temp !== undefined) {
    if(temp === null || temp === 'inherit') {
      res[VISIBILITY] = [0, INHERIT];
    }
    else {
      res[VISIBILITY] = [temp, STRING];
    }
  }
  temp = style.pointerEvents;
  if(temp !== undefined) {
    if(temp === null || temp === 'inherit') {
      res[POINTER_EVENTS] = [0, INHERIT];
    }
    else {
      res[POINTER_EVENTS] = [temp, STRING];
    }
  }
  temp = style.boxShadow;
  if(temp !== undefined) {
    let bs = null;
    // 先替换掉rgba为#RGBA格式，然后按逗号分割
    let arr = (replaceRgba2Hex(temp) || '').split(',');
    if(arr) {
      arr.forEach(item => {
        let coords = /([-+]?[\d.]+[pxremvwhina%]*)\s*([-+]?[\d.]+[pxremvwhina%]*)\s*([-+]?[\d.]+[pxremvwhina%]*\s*)?([-+]?[\d.]+[pxremvwhina%]*\s*)?/i.exec(item);
        if(coords) {
          bs = bs || [];
          let res = [];
          // v,h,blur,spread，其中v和h是必须，其余没有为0
          for(let i = 1; i <= 4; i++) {
            let item2 = coords[i];
            if(item2) {
              let v = calUnit(item2);
              if([NUMBER, DEG].indexOf(v[1]) > -1) {
                v[1] = PX;
              }
              // x/y可以负，blur和spread不行
              if(i > 2 && v[0] < 0) {
                v = 0;
              }
              res.push(v);
            }
            else {
              res.push([0, 1]);
            }
          }
          let color = /#[a-f\d]{3,8}/i.exec(item);
          if(color) {
            res.push(rgba2int(color[0]));
          }
          else {
            res.push([0, 0, 0, 1]);
          }
          res.push(item.indexOf('inset') > -1 ? 'inset' : 'outset');
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
  if(temp !== undefined) {
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

function setFontStyle(style) {
  let fontSize = style[FONT_SIZE] || 0;
  let fontFamily = style[FONT_FAMILY] || inject.defaultFontFamily || 'arial';
  if(/\s/.test(fontFamily)) {
    fontFamily = '"' + fontFamily.replace(/"/g, '\\"') + '"';
  }
  return (style[FONT_STYLE] || 'normal') + ' ' + (style[FONT_WEIGHT] || '400') + ' '
    + fontSize + 'px/' + fontSize + 'px ' + fontFamily;
}

function getFontFamily(str) {
  let ff = str.split(/\s*,\s*/);
  let f = inject.defaultFontFamily;
  for(let i = 0, len = ff.length; i < len; i++) {
    let fontFamily = ff[i].replace(/^['"]/, '').replace(/['"]$/, '');
    if(!font.hasRegister(fontFamily)) {
      continue;
    }
    if(!font.hasChecked(fontFamily)) {
      let res = inject.checkSupportFontFamily(fontFamily);
      if(font.setChecked(fontFamily, res)) {
        f = fontFamily;
        break;
      }
    }
    if(font.support(fontFamily)) {
      f = fontFamily;
      break;
    }
  }
  return f;
}

function getBaseline(style) {
  let fontSize = style[FONT_SIZE];
  let ff = getFontFamily(style[FONT_FAMILY]);
  let normal = fontSize * (font.info[ff] || font.info[inject.defaultFontFamily] || font.info.arial).lhr;
  return (style[LINE_HEIGHT] - normal) * 0.5 + fontSize * (font.info[ff] || font.info[inject.defaultFontFamily] || font.info.arial).blr;
}

function calNormalLineHeight(style) {
  let ff = getFontFamily(style[FONT_FAMILY]);
  return style[FONT_SIZE] * (font.info[ff] || font.info[inject.defaultFontFamily] || font.info.arial).lhr;
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
  // color等是rgba颜色时
  if(k === COLOR || k === TEXT_STROKE_COLOR) {
    if(a[1] !== b[1]) {
      return false;
    }
    if(a[1] === RGBA) {
      return equalArr(a[0], b[0]);
    }
    else {}
  }
  if(COLOR_HASH.hasOwnProperty(k)) {
    return a[1] === b[1] && equalArr(a[0], b[0]);
  }
  // color/fill等是gradient时
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
        if(item[1] === GRADIENT) {
          return [util.clone(item[0]), item[1]];
        }
        else {
          return item;
        }
      });
    }
    else if(k === FILL || k === STROKE) {
      res[k] = v.map(item => {
        // 渐变可能非法为空
        if(item[1] === GRADIENT) {
          return [util.clone(item[0]), item[1]];
        }
        // 颜色
        else if(item[1] === RGBA) {
          return [item[0].slice(0), item[1]];
        }
        // none
        else {
          return item;
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
    else if(k === COLOR || k === TEXT_STROKE_COLOR) {
      if(v) {
        if(v[1] === GRADIENT) {
          res[k] = [util.clone(v[0]), v[1]];
        }
        else if(v[1] === RGBA) {
          res[k] = [v[0].slice(0), v[1]];
        }
        // inherit
        else {
          res[k] = v.slice(0);
        }
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
  setFontStyle,
  getFontFamily,
  getBaseline,
  calRelative,
  equalStyle,
  isRelativeOrAbsolute,
  cloneStyle,
  calNormalLineHeight,
};
