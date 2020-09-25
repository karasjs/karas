import reg from './reg';
import util from '../util/util';

let { isNil } = util;

function parseFlex(style, grow, shrink, basis) {
  if(isNil(style.flexGrow)) {
    style.flexGrow = grow || 0;
  }
  if(isNil(style.flexShrink)) {
    style.flexShrink = shrink || 0;
  }
  if(isNil(style.flexBasis)) {
    style.flexBasis = basis || 0;
  }
}

function parseMarginPadding(style, key, list) {
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
      list.forEach((k, i) => {
        if(isNil(style[k])) {
          style[k] = match[i];
        }
      });
    }
  }
}

function parseOneBorder(style, k) {
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

export default {
  margin: ['marginTop', 'marginRight', 'marginBottom', 'marginLeft'],
  padding: ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'],
  border: ['borderTop', 'borderRight', 'borderBottom', 'borderLeft'],
  borderTop: ['borderTopWidth', 'borderTopStyle', 'borderTopColor'],
  borderRight: ['borderRightWidth', 'borderRightStyle', 'borderRightColor'],
  borderBottom: ['borderBottomWidth', 'borderBottomStyle', 'borderBottomColor'],
  borderLeft: ['borderLeftWidth', 'borderLeftStyle', 'borderLeftColor'],
  borderWidth: ['borderWidthTop', 'borderWidthRight', 'borderWidthBottom', 'borderWidthLeft'],
  borderColor: ['borderColorTop', 'borderColorRight', 'borderColorBottom', 'borderColorLeft'],
  borderStyle: ['borderStyleTop', 'borderStyleRight', 'borderStyleBottom', 'borderStyleLeft'],
  borderRadius: ['borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomRightRadius', 'borderBottomLeftRadius'],
  background: ['backgroundColor', 'backgroundImage', 'backgroundRepeat', 'backgroundPosition'],
  backgroundRepeat: ['backgroundRepeatX', 'backgroundRepeatY'],
  backgroundPosition: ['backgroundPositionX', 'backgroundPositionY'],
  flex: ['flexGrow', 'flexShrink', 'flexBasis'],
  translate: ['translateX', 'translateY'],
  scale: ['scaleX', 'scaleY'],
  rotate: ['rotateZ'],
  skew: ['skewX', 'skewY'],

  toFull(style, k) {
    let v = style[k];
    if(k === 'background') {
      if(isNil(style.backgroundImage)) {
        let gd = reg.gradient.exec(v);
        if(gd) {
          style.backgroundImage = gd[0];
          v = v.replace(gd[0], '');
        }
        else {
          let img = reg.img.exec(v);
          if(img) {
            style.backgroundImage = img[0];
            v = v.replace(img[0], '');
          }
        }
      }
      if(isNil(style.backgroundRepeat)) {
        let repeat = /(no-)?repeat(-[xy])?/i.exec(v);
        if(repeat) {
          style.backgroundRepeat = repeat[0].toLowerCase();
          this.toFull(style, 'backgroundRepeat');
        }
      }
      if(isNil(style.backgroundColor)) {
        let bgc = /^(transparent)|(#[0-9a-f]{3,6})|(rgba?\(.+?\))/i.exec(v);
        if(bgc) {
          style.backgroundColor = bgc[0];
          v = v.replace(bgc[0], '');
        }
      }
      if(isNil(style.backgroundPosition)) {
        let position = v.match(reg.position);
        if(position) {
          style.backgroundPosition = position.join(' ');
          this.toFull(style, 'backgroundPosition');
        }
      }
    }
    else if(k === 'flex') {
      if(v === 'none') {
        parseFlex(style, 0, 0, 'auto');
      }
      else if(v === 'auto') {
        parseFlex(style, 1, 1, 'auto');
      }
      else if(/^[\d.]+$/.test(v)) {
        parseFlex(style, Math.max(0, parseFloat(v)), 1, 0);
      }
      else if(/^[\d.]+px$/i.test(v)) {
        parseFlex(style, 1, 1, 0);
      }
      else if(/^[\d.]+%$/.test(v)) {
        parseFlex(style, 1, 1, v);
      }
      else if(/^[\d.]+\s+[\d.]+$/.test(v)) {
        let arr = v.split(/\s+/);
        parseFlex(style, arr[0], arr[1], 0);
      }
      else if(/^[\d.]+\s+[\d.]+%$/.test(v)) {
        let arr = v.split(/\s+/);
        parseFlex(style, arr[0], 1, arr[1]);
      }
      else {
        parseFlex(style, 0, 1, 'auto');
      }
    }
    else if(k === 'borderRadius') {
      // borderRadius缩写很特殊，/分隔x/y，然后上右下左4个
      v = v.toString().split('/');
      if(v.length === 1) {
        v[1] = v[0];
      }
      for(let i = 0; i < 2; i++) {
        let item = v[i].toString().split(/\s+/);
        if(item.length === 0) {
          v[i] = [0, 0, 0, 0];
        }
        else if(item.length === 1) {
          v[i] = [item[0], item[0], item[0], item[0]];
        }
        else if(item.length === 2) {
          v[i] = [item[0], item[1], item[0], item[1]];
        }
        else if(item.length === 3) {
          v[i] = [item[0], item[1], item[2], item[1]];
        }
        else {
          v[i] = item.slice(0, 4);
        }
      }
      this[k].forEach((k, i) => {
        if(isNil(style[k])) {
          style[k] = v[0][i] + ' ' + v[1][i];
        }
      });
    }
    else if(k === 'backgroundPosition') {
      v = v.toString().split(/\s+/);
      if(v.length === 1) {
        v[1] = '50%';
      }
      this[k].forEach((k, i) => {
        if(isNil(style[k])) {
          style[k] = v[i];
        }
      });
    }
    else if(['translate', 'scale', 'skew'].indexOf(k) > -1) {
      let arr = v.toString().split(/\s*,\s*/);
      if(arr.length === 1) {
        arr[1] = arr[0];
      }
      this[k].forEach((k, i) => {
        if(isNil(style[k])) {
          style[k] = arr[i];
        }
      });
    }
    else if(k === 'margin' || k === 'padding') {
      parseMarginPadding(style, k, this[k]);
    }
    else if(/^border((Top)|(Right)|(Bottom)|(Left))$/.test(k)) {
      parseOneBorder(style, k);
    }
    else if(this[k]) {
      this[k].forEach(k => {
        if(isNil(style[k])) {
          style[k] = v;
        }
      });
    }
  }
};
