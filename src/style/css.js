import unit from './unit';
import font from './font';
import reset from './reset';
import gradient from './gradient';
import reg from './reg';
import abbr from './abbr';
import enums from '../util/enums';
import util from '../util/util';
import inject from '../util/inject';
import key from '../animate/key';
import change from '../refresh/change';
import blur from '../math/blur';

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
  FLEX_BASIS,
  MATRIX,
  LETTER_SPACING,
  WHITE_SPACE,
  LINE_CLAMP,
  ORDER,
  TRANSLATE_PATH,
  TEXT_STROKE_COLOR,
  TEXT_STROKE_WIDTH,
  TEXT_STROKE_OVER,
  WRITING_MODE,
} } = enums;
const { AUTO, PX, PERCENT, NUMBER, INHERIT, DEG, RGBA, STRING, REM, VW, VH, VMAX, VMIN, GRADIENT, calUnit } = unit;
const { isNil, rgba2int, equalArr, equal, replaceRgba2Hex } = util;
const { isGeom, GEOM, GEOM_KEY_SET } = change;
const { VALID_STRING_VALUE } = reset;

const {
  isColorKey,
  isExpandKey,
  isLengthKey,
  isGradientKey,
  isRadiusKey,
} = key;

function isGradient(s) {
  if(reg.gradient.test(s)) {
    let gradient = reg.gradient.exec(s);
    if(gradient && ['linear', 'radial', 'conic'].indexOf(gradient[1]) > -1) {
      return true;
    }
  }
}

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
    arr.u = NUMBER;
  }
  else if(k === TRANSLATE_X || k === TRANSLATE_Y || k === TRANSLATE_Z) {
    if(arr.u === NUMBER) {
      arr.u = PX;
    }
  }
  else if(k === PERSPECTIVE) {
    if([NUMBER, PERCENT, DEG].indexOf(arr.u) > -1) {
      arr.u = PX;
    }
  }
  else {
    if(arr.u === NUMBER) {
      arr.u = DEG;
    }
  }
}

function camel(v) {
  if(isNil(v)) {
    v = '';
  }
  v = v.toString();
  //有-才转换，否则可能是写好的驼峰
  if(v.indexOf('-') > -1) {
    return v.toString().toLowerCase().replace(/-([a-z])/ig, function($0, $1) {
      return $1.toUpperCase();
    });
  }
  return v;
}

function convertStringValue(k, v) {
  v = camel(v);
  let list = VALID_STRING_VALUE[k];
  let i = list.indexOf(v);
  if(i > -1) {
    return list[i];
  }
  // 兜底默认
  return list[0];
}

/**
 * 将传入的手写style标准化，并且用resetList默认值覆盖其中为空的
 * @param style 手写的style样式
 * @param resetList 默认样式，可选
 * @returns Object 标准化的枚举数组结构样式
 */
function normalize(style, resetList = []) {
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
  resetList.forEach(item => {
    let { k, v } = item;
    if(isNil(style[k])) {
      style[k] = v;
    }
  });
  // 背景图
  temp = style.backgroundImage;
  if(temp !== undefined) {
    if(!temp) {
      res[BACKGROUND_IMAGE] = [];
    }
    else if(Array.isArray(temp)) {
      res[BACKGROUND_IMAGE] = temp.map(item => {
        if(!item) {
          return null;
        }
        if(isGradient(item)) {
          return {
            v: gradient.parseGradient(item),
            u: GRADIENT,
          };
        }
        if(reg.img.test(item)) {
          return {
            v: reg.img.exec(item)[2],
            u: STRING,
          };
        }
        return null;
      });
    }
    // 区分是渐变色还是图
    else if(isGradient(temp)) {
      res[BACKGROUND_IMAGE] = [{ v: gradient.parseGradient(temp), u: GRADIENT }];
    }
    else if(reg.img.test(temp)) {
      res[BACKGROUND_IMAGE] = [{ v: reg.img.exec(temp)[2], u: STRING }];
    }
    else {
      res[BACKGROUND_IMAGE] = [];
    }
  }
  temp = style.backgroundColor;
  if(temp !== undefined) {
    temp = temp || 'transparent';
    // 先赋值默认透明，后续操作有合法值覆盖
    let bgc = /^#[0-9a-f]{3,8}/i.exec(temp);
    if(bgc && [4, 7, 9].indexOf(bgc[0].length) > -1) {
      res[BACKGROUND_COLOR] = { v: rgba2int(bgc[0]), u: RGBA };
    }
    else {
      bgc = /rgba?\s*\(.+\)/i.exec(temp);
      res[BACKGROUND_COLOR] = { v: rgba2int(bgc ? bgc[0] : [0, 0, 0, 0]), u: RGBA };
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
          if([NUMBER, DEG].indexOf(v.u) > -1) {
            v.u = PX;
          }
          return v;
        }
        else {
          return {
            v: {
              top: 0,
              left: 0,
              center: 50,
              right: 100,
              bottom: 100,
            }[item] || 0,
            u: PERCENT,
          };
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
          { u: AUTO },
          { u: AUTO },
        ];
      }
      let match = item.toString().match(/\b(?:([-+]?[\d.]+[pxremvwhina%]*)|(contain|cover|auto))/ig);
      if(match) {
        if(match.length === 1) {
          if(match[0].toLowerCase() === 'contain' || match[0].toLowerCase() === 'cover') {
            match[1] = match[0].toLowerCase();
          }
          else {
            match[1] = 'auto';
          }
        }
        let v = [];
        for(let i = 0; i < 2; i++) {
          let item = match[i].toLowerCase();
          if(/^[-+]?[\d.]/.test(item)) {
            let n = calUnit(item);
            if([NUMBER, DEG].indexOf(n.u) > -1) {
              n.u = PX;
            }
            v.push(n);
          }
          else if(item === 'contain' || item === 'cover') {
            v.push({ v: item, u: STRING });
          }
          else {
            v.push({ u: AUTO });
          }
        }
        return v;
      }
      else {
        return [
          { u: AUTO },
          { u: AUTO },
        ];
      }
    });
  }
  // border-color
  ['Top', 'Right', 'Bottom', 'Left'].forEach(k => {
    k = 'border' + k + 'Color';
    let v = style[k];
    if(v !== undefined) {
      res[STYLE_KEY[style2Upper(k)]] = { v: rgba2int(v || 'transparent'), u: RGBA };
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
          if([NUMBER, DEG].indexOf(n.u) > -1) {
            n.u = PX;
          }
          if(n.v < 0) {
            n.v = 0;
          }
          arr[i] = n;
        }
        else {
          arr[i] = { u: 0, v: PX };
        }
      }
      res[STYLE_KEY[style2Upper(k)]] = arr;
    }
  });
  temp = style.transform;
  if(temp !== undefined) {
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
            transform.push({ k: MATRIX, v: [
              arr[0], arr[1], 0, 0, arr[2], arr[3], 0, 0, 0, 0, 1, 0, arr[4], arr[5], 0, 1,
            ]});
          }
        }
        else if(k === 'matrix3d') {
          let arr = v.toString().split(/\s*,\s*/);
          arr = arr.map(item => parseFloat(item));
          if(arr.length > 16) {
            arr = arr.slice(0, 16);
          }
          if(arr.length === 16) {
            transform.push({ k: MATRIX, v: arr });
          }
        }
        else if(k === 'perspective') {
          let arr = calUnit(v);
          if(arr.v < 0) {
            arr.v = 0;
          }
          compatibleTransform(PERSPECTIVE, arr);
          transform.push({ k: PERSPECTIVE, v: arr });
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
            transform.push({ k: ROTATE_3D, v: arr });
          }
        }
        else if(TRANSFORM_HASH.hasOwnProperty(k)) {
          let k2 = TRANSFORM_HASH[k];
          let arr = calUnit(v);
          compatibleTransform(k2, arr);
          transform.push({ k: k2, v: arr });
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
            transform.push({ k: k1, v: arr1 });
            transform.push({ k: k2, v: arr2 });
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
            transform.push({ k: k1, v: arr1 });
            transform.push({ k: k2, v: arr2 });
            transform.push({ k: k3, v: arr3 });
          }
        }
      });
    }
  }
  temp = style.perspective;
  if(temp !== undefined) {
    let arr = calUnit(temp || 0);
    if(arr.v < 0) {
      arr.v = 0;
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
            if([NUMBER, DEG].indexOf(n.u) > -1) {
              n.u = PX;
            }
            arr.push(n);
          }
          else {
            arr.push({
              v: {
                top: 0,
                left: 0,
                center: 50,
                right: 100,
                bottom: 100,
              }[item],
              u: PERCENT,
            });
            // 不规范的写法变默认值50%
            if(isNil(arr[i].v)) {
              arr[i].v = 50;
            }
          }
        }
      }
      else {
        arr.push({ v: 50, u: PERCENT });
        arr.push({ v: 50, u: PERCENT });
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
      v = { v: 0, u: AUTO };
    }
    else {
      v = calUnit(v || 0);
      // 无单位视为px
      if([NUMBER, DEG].indexOf(v.u) > -1) {
        v.u = PX;
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
    }.hasOwnProperty(k) && v.v < 0) {
      v.v = 0;
    }
  });
  temp = style.flexBasis;
  if(temp !== undefined) {
    if(/content/i.test(temp)) {
      res[FLEX_BASIS] = { v: temp.toLowerCase(), u: STRING };
    }
    else if(/^[\d.]/.test(temp)) {
      let v = res[FLEX_BASIS] = calUnit(temp);
      v.v = Math.max(v.v, 0);
      // 无单位视为px
      if([NUMBER, DEG].indexOf(v.u) > -1) {
        v.u = PX;
      }
    }
    else {
      res[FLEX_BASIS] = { v: 0, u: AUTO };
    }
  }
  temp = style.order;
  if(temp !== undefined) {
    res[ORDER] = parseInt(temp) || 0;
  }
  temp = style.color;
  if(temp !== undefined) {
    if(/inherit/i.test(temp)) {
      res[COLOR] = { u: INHERIT };
    }
    else if(isGradient(temp)) {
      res[COLOR] = { v: gradient.parseGradient(temp), u: GRADIENT };
    }
    else {
      res[COLOR] = { v: rgba2int(temp), u: RGBA };
    }
  }
  temp = style.textStrokeColor;
  if(temp !== undefined) {
    if(/inherit/i.test(temp)) {
      res[TEXT_STROKE_COLOR] = { u: INHERIT };
    }
    else if(isGradient(temp)) {
      res[TEXT_STROKE_COLOR] = { v: gradient.parseGradient(temp), u: GRADIENT };
    }
    else {
      res[TEXT_STROKE_COLOR] = { v: rgba2int(temp), u: RGBA };
    }
  }
  temp = style.fontSize;
  if(temp !== undefined) {
    if(/inherit/i.test(temp)) {
      res[FONT_SIZE] = { u: INHERIT };
    }
    else {
      let v = calUnit(temp);
      // fontSize不能为负数，否则为继承
      if(v < 0) {
        res[FONT_SIZE] = { u: INHERIT };
      }
      else {
        if([NUMBER, DEG].indexOf(v.u) > -1) {
          v.u = PX;
        }
        res[FONT_SIZE] = v;
      }
    }
  }
  temp = style.textStrokeWidth;
  if(temp !== undefined) {
    if(/inherit/i.test(temp)) {
      res[TEXT_STROKE_WIDTH] = { u: INHERIT };
    }
    else {
      let v = calUnit(temp);
      // textStrokeWidth不能为负数，否则为继承
      if(v < 0) {
        res[TEXT_STROKE_WIDTH] = { u: INHERIT };
      }
      else {
        if([NUMBER, DEG, PERCENT].indexOf(v.u) > -1) {
          v.u = PX;
        }
        res[TEXT_STROKE_WIDTH] = v;
      }
    }
  }
  temp = style.textStrokeOver;
  if(temp !== undefined) {
    if(temp === null || /inherit/i.test(temp)) {
      res[TEXT_STROKE_OVER] = { u: INHERIT };
    }
    else {
      let v = reset.INHERIT.textStrokeOver;
      if(/fill/i.test(temp)) {
        v = 'fill';
      }
      res[TEXT_STROKE_OVER] = { v, u: STRING };
    }
  }
  temp = style.fontWeight;
  if(temp !== undefined) {
    if(/bold/i.test(temp)) {
      res[FONT_WEIGHT] = { v: 700, u: NUMBER };
    }
    else if(/normal/i.test(temp)) {
      res[FONT_WEIGHT] = { v: 400, u: NUMBER };
    }
    else if(/lighter/i.test(temp)) {
      res[FONT_WEIGHT] = { v: 200, u: NUMBER };
    }
    else if(/inherit/i.test(temp)) {
      res[FONT_WEIGHT] = { u: INHERIT };
    }
    else {
      res[FONT_WEIGHT] = { v: Math.max(0, parseInt(temp)) || 400, u: NUMBER };
    }
  }
  temp = style.fontStyle;
  if(temp !== undefined) {
    if(temp === null || /inherit/i.test(temp)) {
      res[FONT_STYLE] = { u: INHERIT };
    }
    else {
      let v = reset.INHERIT.fontStyle;
      if(/italic/i.test(temp)) {
        v = 'italic';
      }
      else if(/oblique/i.test(temp)) {
        v = 'oblique';
      }
      res[FONT_STYLE] = { v, u: STRING };
    }
  }
  temp = style.fontFamily;
  if(temp !== undefined) {
    if(temp === null || /inherit/i.test(temp)) {
      res[FONT_FAMILY] = { u: INHERIT };
    }
    else {
      // 统一文字声明格式
      res[FONT_FAMILY] = { v: temp.toString().toLowerCase()
          .replace(/['"]/, '')
          .replace(/\s*,\s*/g, ','), u: STRING };
    }
  }
  temp = style.writingMode;
  if(temp !== undefined) {
    if(temp === null || /inherit/i.test(temp)) {
      res[WRITING_MODE] = { u: INHERIT };
    }
    else {
      let v = reset.INHERIT.writingMode;
      if(/vertical-?rl/i.test(temp)) {
        v = 'verticalRl';
      }
      else if(/vertical-?lr/i.test(temp)) {
        v = 'verticalLr';
      }
      res[WRITING_MODE] = { v, u: STRING };
    }
  }
  temp = style.textAlign;
  if(temp !== undefined) {
    if(temp === null || /inherit/i.test(temp)) {
      res[TEXT_ALIGN] = { u: INHERIT };
    }
    else {
      let v = 'left';
      if(/center/i.test(temp)) {
        v = 'center';
      }
      else if(/right/i.test(temp)) {
        v = 'right';
      }
      res[TEXT_ALIGN] = { v, u: STRING };
    }
  }
  temp = style.lineHeight;
  if(temp !== undefined) {
    if(/inherit/i.test(temp)) {
      res[LINE_HEIGHT] = { u: INHERIT };
    }
    else if(/normal/i.test(temp)) {
      res[LINE_HEIGHT] = { u: AUTO };
    }
    // lineHeight默认数字，想要px必须强制带单位
    else if(/^[\d.]+/i.test(temp)) {
      let v = calUnit(temp);
      if([DEG].indexOf(v.u) > -1) {
        v.u = NUMBER;
      }
      res[LINE_HEIGHT] = v;
    }
    else {
      let n = Math.max(0, parseFloat(temp)) || 'normal';
      // 非法数字
      if(n === 'normal') {
        res[LINE_HEIGHT] = { u: AUTO };
      }
      else {
        res[LINE_HEIGHT] = { v: n, u: NUMBER };
      }
    }
  }
  temp = style.letterSpacing;
  if(temp !== undefined) {
    if(temp === null || /inherit/i.test(temp)) {
      res[LETTER_SPACING] = { u: INHERIT };
    }
    else if(/normal/i.test(temp)) {
      res[LETTER_SPACING] = { v: 0, u: PX };
    }
    else if(/^[-+]?[\d.]/.test(temp)) {
      let v = calUnit(temp);
      if([NUMBER, DEG].indexOf(v.u) > -1) {
        v.u = PX;
      }
      res[LETTER_SPACING] = v;
    }
    else {
      res[LETTER_SPACING] = { v: parseFloat(temp) || 0, u: PX };
    }
  }
  temp = style.whiteSpace;
  if(temp !== undefined) {
    if(temp === null || /inherit/i.test(temp)) {
      res[WHITE_SPACE] = { u: INHERIT };
    }
    else {
      res[WHITE_SPACE] = { v: temp, u: STRING };
    }
  }
  temp = style.lineClamp;
  if(temp !== undefined) {
    temp = parseInt(temp) || 0;
    res[LINE_CLAMP] = Math.max(0, temp);
  }
  // fill和stroke为渐变时特殊处理，fillRule无需处理字符串
  ['fill', 'stroke'].forEach((k, i) => {
    temp = style[k];
    if(temp !== undefined) {
      k = i ? STROKE : FILL;
      if(!Array.isArray(temp)) {
        temp = [temp];
      }
      res[k] = temp.map(item => {
        if(!item) {
          return { v: 'none', u: STRING };
        }
        else if(isGradient(item)) {
          return { v: gradient.parseGradient(item), u: GRADIENT };
        }
        else {
          return { v: rgba2int(item), u: RGBA };
        }
      });
    }
  });
  temp = style.strokeWidth;
  if(temp !== undefined) {
    if(!Array.isArray(temp)) {
      temp = [temp];
    }
    res[STROKE_WIDTH] = temp.map(item => {
      let v = calUnit(item);
      if([NUMBER, DEG].indexOf(v.u) > -1) {
        v.u = PX;
      }
      v.v = Math.max(v.v, 0);
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
  // filter支持数组形式
  temp = style.filter;
  if(temp !== undefined) {
    let f = [];
    // 先替换掉rgba为#RGBA格式，然后分割
    let arr;
    if(Array.isArray(temp)) {
      arr = temp.map(item => {
        return (replaceRgba2Hex(item) || '').match(/[\w-]+\s*\(.+?\)/ig);
      });
    }
    else {
      arr = (replaceRgba2Hex(temp) || '').match(/[\w-]+\s*\(.+?\)/ig);
    }
    if(arr) {
      arr.forEach(item => {
        let match = /([\w-]+)\s*\((\s*.+\s*)\)/i.exec(item);
        if(match) {
          let k = match[1].toLowerCase(), v = match[2];
          if(k === 'drop-shadow' || k === 'dropshadow') {
            let coords = /([-+]?[\d.]+[pxremvwhina%]*)[\s,]+([-+]?[\d.]+[pxremvwhina%]*)[\s,]+(?:([-+]?[\d.]+[pxremvwhina%]*)[\s,])?([-+]?[\d.]+[pxremvwhina%]*\s*)?/ig.exec(item);
            if(coords) {
              let res = [];
              // v,h,blur,spread，其中v和h是必须，其余没有为0
              for(let i = 1; i <= 4; i++) {
                let item2 = coords[i];
                if(item2) {
                  let v = calUnit(item2);
                  if([NUMBER, DEG].indexOf(v.u) > -1) {
                    v.u = PX;
                  }
                  // x/y可以负，blur和spread不行
                  if(i > 2 && v.v < 0) {
                    v.v = 0;
                  }
                  res.push(v);
                }
                else {
                  res.push({ v: 0, u: PX });
                }
              }
              let color = /#[a-f\d]{3,8}/i.exec(item);
              if(color) {
                res.push(rgba2int(color[0]));
              }
              else {
                res.push([0, 0, 0, 1]);
              }
              f.push({ k: 'dropShadow', v: res });
            }
          }
          else {
            let m2 = /([-+]?[\d.]+\s*[pxremvwhdg%]*)/i.exec(v);
            if(m2) {
              let v = calUnit(m2[0]);
              if(k === 'blur') {
                if([DEG, PERCENT].indexOf(v.u) > -1) {
                  return;
                }
                if(v.u === NUMBER) {
                  v.u = PX;
                }
                v.v = Math.max(v.v, 0);
                f.push({ k, v });
              }
              else if(k === 'hue-rotate' || k === 'huerotate') {
                if([NUMBER, DEG].indexOf(v.u) === -1) {
                  return;
                }
                v.u = DEG;
                f.push({ k:'hueRotate', v });
              }
              else if(k === 'saturate' || k === 'brightness' || k === 'grayscale' || k === 'contrast' || k === 'sepia' || k === 'invert') {
                if([NUMBER, PERCENT].indexOf(v.u) === -1) {
                  return;
                }
                v.v = Math.max(v.v, 0);
                v.u = PERCENT;
                f.push({ k, v });
              }
            }
          }
        }
      });
    }
    res[FILTER] = f;
  }
  temp = style.visibility;
  if(temp !== undefined) {
    if(temp === null || /inherit/i.test(temp)) {
      res[VISIBILITY] = { u: INHERIT };
    }
    else {
      let v = reset.INHERIT.visibility;
      if(/hidden/i.test(temp)) {
        v = 'hidden';
      }
      res[VISIBILITY] = { v, u: STRING };
    }
  }
  temp = style.pointerEvents;
  if(temp !== undefined) {
    if(temp === null || /inherit/i.test(temp)) {
      res[POINTER_EVENTS] = { u: INHERIT };
    }
    else {
      let v = reset.INHERIT.pointerEvents;
      if(/none/i.test(temp)) {
        v = 'none';
      }
      res[POINTER_EVENTS] = { v, u: STRING };
    }
  }
  temp = style.boxShadow;
  if(temp !== undefined) {
    let bs = [];
    // 先替换掉rgba为#RGBA格式，然后按逗号分割
    let arr = (replaceRgba2Hex(temp) || '').split(',');
    if(arr) {
      arr.forEach(item => {
        let coords = /([-+]?[\d.]+[pxremvwhina%]*)\s*([-+]?[\d.]+[pxremvwhina%]*)\s*([-+]?[\d.]+[pxremvwhina%]*\s*)?([-+]?[\d.]+[pxremvwhina%]*\s*)?/i.exec(item);
        if(coords) {
          let res = [];
          // v,h,blur,spread，其中v和h是必须，其余没有为0
          for(let i = 1; i <= 4; i++) {
            let item2 = coords[i];
            if(item2) {
              let v = calUnit(item2);
              if([NUMBER, DEG].indexOf(v.u) > -1) {
                v.u = PX;
              }
              // x/y可以负，blur和spread不行
              if(i > 2 && v.v < 0) {
                v.v = 0;
              }
              res.push(v);
            }
            else {
              res.push({ v: 0, u: PX });
            }
          }
          let color = /#[a-f\d]{3,8}/i.exec(item);
          if(color) {
            res.push(rgba2int(color[0]));
          }
          else {
            res.push([0, 0, 0, 1]);
          }
          res.push(/inset/i.test(item) ? 'inset' : 'outset');
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
    'transformStyle',
    'backfaceVisibility',
  ].forEach(k => {
    if(style.hasOwnProperty(k)) {
      res[STYLE_KEY[style2Upper(k)]] = convertStringValue(k, style[k]);
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
      if(!Array.isArray(v)) {
        v = [v];
      }
      if(k === 'backgroundRepeat') {
        v.forEach((item, i) => {
          if(item) {
            v[i] = camel(item);
          }
        });
      }
      res[STYLE_KEY[style2Upper(k)]] = v;
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

/**
 * https://zhuanlan.zhihu.com/p/25808995
 * 根据字形信息计算baseline的正确值，差值上下均分
 * @param style computedStyle
 * @returns {number}
 */
function getBaseline(style) {
  let fontSize = style[FONT_SIZE];
  let ff = calFontFamily(style[FONT_FAMILY]);
  let normal = calNormalLineHeight(style, ff);
  return (style[LINE_HEIGHT] - normal) * 0.5 + fontSize * (font.info[ff] || font.info[inject.defaultFontFamily] || font.info.arial).blr;
}

// 垂直排版的baseline和水平类似，只是原点坐标系不同，删除加本身高度变为加gap高度
function getVerticalBaseline(style) {
  return style[LINE_HEIGHT] - getBaseline(style);
}

function calNormalLineHeight(style, ff) {
  if(!ff) {
    ff = calFontFamily(style[FONT_FAMILY]);
  }
  return style[FONT_SIZE] * (font.info[ff] || font.info[inject.defaultFontFamily] || font.info.arial).lhr;
}

function calFontFamily(fontFamily) {
  let ff = fontFamily.split(/\s*,\s*/);
  for(let i = 0, len = ff.length; i < len; i++) {
    let item = ff[i].replace(/^['"]/, '').replace(/['"]$/, '');
    if(font.hasLoaded(item) || inject.checkSupportFontFamily(item)) {
      return item;
    }
  }
  return inject.defaultFontFamily;
}

function calRelativePercent(n, parent, k) {
  n *= 0.01;
  while(parent) {
    let style = parent.currentStyle[k];
    if(style.u === AUTO) {
      if(k === WIDTH) {
        parent = parent.domParent;
      }
      else {
        break;
      }
    }
    else if(style.u === PX) {
      return n * style.v;
    }
    else if(style.u === PERCENT) {
      n *= style.v * 0.01;
      parent = parent.domParent;
    }
    else if(style.u === REM) {
      return n * style.v * parent.root.computedStyle[FONT_SIZE];
    }
    else if(style.u === VW) {
      return n * style.v * parent.root.width * 0.01;
    }
    else if(style.u === VH) {
      return n * style.v * parent.root.height * 0.01;
    }
    else if(style.u === VMAX) {
      return n * style.v * Math.max(parent.root.width, parent.root.height) * 0.01;
    }
    else if(style.u === VMIN) {
      return n * style.v * Math.min(parent.root.width, parent.root.height) * 0.01;
    }
  }
  return n;
}

function calRelative(currentStyle, k, v, parent, isWidth) {
  if(v.u === AUTO) {
    v = 0;
  }
  else if([PX, NUMBER].indexOf(v.u) > -1) {
    v = v.v;
  }
  else if(v.u === PERCENT) {
    if(isWidth) {
      v = calRelativePercent(v.v, parent, WIDTH);
    }
    else {
      v = calRelativePercent(v.v, parent, HEIGHT);
    }
  }
  else if(v.u === REM) {
    v = v.v * parent.root.computedStyle[FONT_SIZE];
  }
  else if(v.u === VW) {
    v = v.v * parent.root.width * 0.01;
  }
  else if(v.u === VH) {
    v = v.v * parent.root.height * 0.01;
  }
  else if(v.u === VMAX) {
    v = v.v * Math.max(parent.root.width, parent.root.height) * 0.01;
  }
  else if(v.u === VMIN) {
    v = v.v * Math.min(parent.root.width, parent.root.height) * 0.01;
  }
  return v;
}

function isRelativeOrAbsolute(node) {
  let position = node.currentStyle[POSITION];
  return position === 'relative' || position === 'absolute';
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
      if(oa.k !== ob.k) {
        return false;
      }
      let av = oa.v, bv = ob.v;
      if(oa.k === MATRIX) {
        if(!equalArr(av, bv)) {
          return false;
        }
      }
      else if(av.u !== bv.u || av.v !== bv.v) {
        return false;
      }
    }
    return true;
  }
  if(k === ROTATE_3D) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3].v === b[3].v && a[3].u === b[3].u;
  }
  if(k === FILTER) {
    if(a.length !== b.length) {
      return false;
    }
    for(let i = 0, len = a.length; i < len; i++) {
      let oa = a[i];
      let ob = b[i];
      if(oa.k !== ob.k) {
        return false;
      }
      let av = oa.v, bv = ob.v;
      if(oa.k === 'dropShadow' || oa.k === 'drop-shadow') {
        if(av.length !== bv.length) {
          return false;
        }
        for(let j = 0; j < 4; j++) {
          let avj = av[j], bvj = bv[j];
          if(avj.u !== bvj.u || avj.v !== bvj.v) {
            return false;
          }
        }
      }
      else if(av.u !== bv.u || av.v !== bv.v) {
        return false;
      }
    }
    return true;
  }
  if(k === TRANSFORM_ORIGIN || k === PERSPECTIVE_ORIGIN || isRadiusKey(k)) {
    return a[0].v === b[0].v && a[0].u === b[0].u
      && a[1].v === b[1].v && a[1].u === b[1].u;
  }
  if(k === BACKGROUND_POSITION_X || k === BACKGROUND_POSITION_Y || k === STROKE_WIDTH) {
    if(a.length !== b.length) {
      return false;
    }
    for(let i = 0, len = a.length; i < len; i++) {
      let aa = a[i], bb = b[i];
      if(aa.v !== bb.v || aa.u !== bb.u || aa.v !== bb.v || aa.u !== bb.u) {
        return false;
      }
    }
    return true;
  }
  if(k === BOX_SHADOW) {
    if(a.length !== b.length) {
      return false;
    }
    for(let i = 0, len = a.length; i < len; i++) {
      let aa = a[i], bb = b[i];
      if((!aa || !bb) && aa !== bb) {
        return false;
      }
      for(let j = 0; j < 4; j++) {
        if(aa[j].v !== bb[j].v || aa[j].u !== bb[j].u) {
          return false;
        }
      }
      for(let j = 0; j < 4; j++) {
        if(aa[4][j] !== bb[4][j]) {
          return false;
        }
      }
      if(aa[5] !== bb[5]) {
        return false;
      }
    }
    return true;
  }
  if(k === BACKGROUND_SIZE || k === BACKGROUND_POSITION_X || k === BACKGROUND_POSITION_Y) {
    if(a.length !== b.length) {
      return false;
    }
    for(let i = 0, len = a.length; i < len; i++) {
      let aa = a[i], bb = b[i];
      if(aa[0].v !== bb[0].v || aa[0].u !== bb[0].u || aa[1].v !== bb[1].v || aa[1].u !== bb[1].u) {
        return false;
      }
    }
    return true;
  }
  // if(k === OPACITY || k === Z_INDEX) {} 原始数字无需判断
  if(isLengthKey(k) || isExpandKey(k)) {
    return a.v === b.v && a.u === b.u;
  }
  if(isGradientKey(k)) {
    if(a.length !== b.length) {
      return false;
    }
    for(let i = 0, len = a.length; i < len; i++) {
      let ai = a[i], bi = b[i];
      if(ai.u !== bi.u) {
        return false;
      }
      let av = ai.v, bv = bi.v;
      if(ai.u === GRADIENT) {
        if(av.k !== bv.k || av.d !== bv.d || av.s !== bv.s || av.z !== bv.z) {
          return false;
        }
        if(av.k === 'linear') {
          let ad = av.d, bd = bv.d;
          let isArrayD1 = Array.isArray(ad);
          let isArrayD2 = Array.isArray(bd);
          if(isArrayD1 !== isArrayD2) {
            return false;
          }
          if(isArrayD1) {
            if(ad[0] !== bd[0] || ad[1] !== bd[1] || ad[2] !== bd[2] || ad[3] !== bd[3]) {
              return false;
            }
          }
          else if(ad !== bd) {
            return false;
          }
        }
        else if(av.k === 'conic' && av.d !== bv.d) {
          return false;
        }
        if(av.k === 'radial' || av.k === 'conic') {
          let ap = av.p, bp = bv.p;
          if(ap[0].u !== bp[0].u || ap[0].v !== bp[0].v || ap[1].u !== bp[1].u || ap[1].v !== bp[1].v) {
            return false;
          }
        }
        for(let j = 0; j < 2; j++) {
          let aj = av.v[j], bj = bv.v[j];
          let ac = aj[0], bc = bj[0];
          if(ac[0] !== bc[0] || ac[1] !== bc[1] || ac[2] !== bc[2] || ac[3] !== bc[3]) {
            return false;
          }
          if(aj[1] && bj[1]) {
            if(aj[1].u !== bj[1].u || aj[1].v !== bj[1].v) {
              return false;
            }
          }
          else if(aj[1] || bj[1]) {
            return false;
          }
        }
      }
      else if(ai.u === RGBA) {
        if(!equalArr(av, bv)) {
          return false;
        }
      }
      else if(av !== bv) {
        return false;
      }
    }
    return true;
  }
  if(isColorKey(k)) {
    if(a.u !== b.u) {
      return false;
    }
    if(a.u === GRADIENT) {
      return equal(a.v, b.v);
    }
    else if(a.u === INHERIT) {
      return true;
    }
    else if(a.u === RGBA) {
      return equalArr(a.v, b.v);
    }
  }
  // multi都是纯值数组，equalArr本身即递归，非multi根据类型判断
  if(isGeom(target.tagName, k) && (target.isMulti || Array.isArray(a) && Array.isArray(b))) {
    return equal(a, b);
  }
  return a === b;
}

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
    if(k === TRANSFORM) {
      if(v) {
        let len = v.length;
        let n = new Array(len);
        for(let i = 0; i < len; i++) {
          let o = v[i];
          if(o.k === MATRIX) {
            n[i] = {
              k: o.k,
              v: o.v.slice(0),
            };
          }
          else {
            n[i] = {
              k: o.k,
              v: {
                v: o.v.v,
                u: o.v.u,
              },
            };
          }
        }
        res[k] = n;
      }
    }
    else if(k === ROTATE_3D) {
      res[k] = [v[0], v[1], v[2], { v: v[3].v, u: v[3].u }];
    }
    else if(k === FILTER) {
      if(v) {
        let len = v.length;
        let n = new Array(len);
        for(let i = 0; i < len; i++) {
          let o = v[i];
          let k = o.k, vv = o.v;
          if(k === 'dropShadow') {
            let arr = new Array(5);
            n[i] = { k, v: arr };
            for(let j = 0; j < 4; j++) {
              let temp = vv[j];
              arr[j] = { v: temp.v, u: temp.u };
            }
            arr[4] = vv[4].slice(0);
          }
          else {
            n[i] = {k, v: { v: vv.v, u: vv.u }};
          }
        }
        res[k] = n;
      }
    }
    else if(k === TRANSFORM_ORIGIN || k === PERSPECTIVE_ORIGIN || isRadiusKey(k)) {
      if(v) {
        let n = new Array(2);
        for(let i = 0; i < 2; i++) {
          let o = v[i];
          n[i] = { v: o.v, u: o.u };
        }
        res[k] = n;
      }
    }
    else if(k === BACKGROUND_POSITION_X || k === BACKGROUND_POSITION_Y || k === STROKE_WIDTH) {
      res[k] = v.map(item => ({ v: item.v, u: item.u }));
    }
    else if(k === BOX_SHADOW) {
      if(v) {
        v = v.map(item => {
          let n = new Array(6);
          for(let i = 0; i < 4; i++) {
            let o = item[i];
            n[i] = { v: o.v, u: o.u }; // x/y/blur/spread
          }
          n[4] = item[4].slice(0); //rgba
          n[5] = item[5]; // outset/inset
          return n;
        });
        res[k] = v;
      }
    }
    else if(k === BACKGROUND_SIZE) {
      if(v) {
        res[k] = v.map(item => {
          return [
            { v: item[0].v, u: item[0].u },
            { v: item[1].v, u: item[1].u },
          ];
        });
      }
    }
    else if(k === OPACITY || k === Z_INDEX) {
      res[k] = v;
    }
    else if(k === TRANSLATE_PATH) {
      if(v) {
        res[k] = v.map(item => ({
          v: item.v,
          u: item.u,
        }));
      }
    }
    else if(isLengthKey(k) || isExpandKey(k)) {
      res[k] = { v: v.v, u: v.u };
    }
    // 渐变特殊处理
    else if(isGradientKey(k)) {
      res[k] = v.map(item => {
        if(!item) {
          return null;
        }
        if(item.u === GRADIENT) {
          return { v: util.clone(item.v), u: GRADIENT };
        }
        // 颜色
        else if(item.u === RGBA) {
          return { v: item.v.slice(0), u: RGBA };
        }
        // string和none
        else {
          return { v: item.v, u: item.u };
        }
      });
    }
    else if(isColorKey(k)) {
      // 特殊增加支持有gradient的先判断，仅color和textStrokeColor支持
      if(v.u === GRADIENT) {
        res[k] = { v: util.clone(v.v), u: GRADIENT };
      }
      else if(v.u === RGBA) {
        res[k] = { v: v.v.slice(0), u: RGBA };
      }
      // inherit
      else {
        res[k] = { u: INHERIT };
      }
    }
    // geom自定义属性
    else if(GEOM.hasOwnProperty(k)) {
      res[k] = util.clone(v);
    }
    // position等直接值类型赋值
    else {
      res[k] = v;
    }
  }
  return res;
}

function spreadBoxShadow(bbox, boxShadow) {
  let [x1, y1, x2, y2] = bbox;
  if(Array.isArray(boxShadow)) {
    let xl = 0, yt = 0, xr = 0, yb = 0;
    boxShadow.forEach(item => {
      let [x, y, sigma, spread, color, inset] = item;
      if(inset !== 'inset' && color[3] > 0) {
        let d = blur.outerSize(sigma);
        d += spread;
        xl = Math.min(xl, x - d);
        yt = Math.min(yt, x - d);
        xr = Math.max(xr, x + d);
        yb = Math.max(yb, y + d);
      }
    });
    x1 += xl;
    y1 += yt;
    x2 += xr;
    y2 += yb;
  }
  return [x1, y1, x2, y2];
}

function spreadFilter(bbox, filter) {
  let [x1, y1, x2, y2] = bbox;
  // filter对整体有影响，且filter子项可以先后多次重复出现，上面计算完后，依次处理
  if(Array.isArray(filter)) {
    filter.forEach(item => {
      let { k, v } = item;
      if(k === 'blur' && v > 0) {
        let d = blur.kernelSize(v);
        let spread = blur.outerSizeByD(d);
        if(spread) {
          x1 -= spread;
          y1 -= spread;
          x2 += spread;
          y2 += spread;
        }
      }
      else if(k === 'dropShadow') {
        let d = blur.kernelSize(v[2]);
        let spread = blur.outerSizeByD(d);
        // x/y/blur，3个一起影响，要考虑正负号，spread一定为非负
        if(v[0] || v[1] || spread) {
          if(v[0] <= 0 || v[0] > 0 && v[0] < spread) {
            x1 += v[0] - spread;
          }
          if(v[1] <= 0 || v[1] > 0 && v[1] < spread) {
            y1 += v[1] - spread;
          }
          if(v[0] < 0 && -v[0] < spread || v[0] >= 0) {
            x2 += v[0] + spread;
          }
          if(v[1] < 0 && -v[1] < spread || v[1] >= 0) {
            y2 += v[1] + spread;
          }
        }
      }
    });
  }
  return [x1, y1, x2, y2];
}

export default {
  normalize,
  setFontStyle,
  getBaseline,
  getVerticalBaseline,
  calRelative,
  equalStyle,
  isRelativeOrAbsolute,
  cloneStyle,
  calNormalLineHeight,
  calFontFamily,
  spreadBoxShadow,
  spreadFilter,
};
