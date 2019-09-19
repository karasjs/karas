import Xom from '../node/Xom';
import css from '../style/css';
import unit from '../style/unit';
import mode from '../mode';

const IMPLEMENT = {};

class Geom extends Xom {
  constructor(tagName, props) {
    super(tagName, props);
  }

  __initStyle() {
    css.normalize(this.style);
  }

  __tryLayInline(w, total) {
    // 无children，直接以style的width为宽度，不定义则为0
    let { style: { width } } = this;
    if(width.unit === unit.PX) {
      return w - width.value;
    }
    else if(width.unit === unit.PERCENT) {
      return w - total * width.value * 0.01;
    }
    return w;
  }

  __calAutoBasis(isDirectionRow, w, h) {
    let b = 0;
    let min = 0;
    let max = 0;
    let { style } = this;
    // 计算需考虑style的属性
    let {
      width,
      height,
      borderTopWidth,
      borderRightWidth,
      borderBottomWidth,
      borderLeftWidth,
    } = style;
    let main = isDirectionRow ? width : height;
    if(main.unit !== unit.AUTO) {
      b = max += main.value;
    }
    // border也得计算在内
    if(isDirectionRow) {
      let w = borderRightWidth.value + borderLeftWidth.value;
      b += w;
      max += w;
      min += w;
    }
    else {
      let h = borderTopWidth.value + borderBottomWidth.value;
      b += h;
      max += h;
      min += h;
    }
    return { b, min, max };
  }

  __preLayBlock(data) {
    let { x, y, w, h } = data;
    this.__x = x;
    this.__y = y;
    this.__width = w;
    let { style } = this;
    let {
      width,
      height,
      borderTopWidth,
      borderRightWidth,
      borderBottomWidth,
      borderLeftWidth,
    } = style;
    // 除了auto外都是固定高度
    let fixedHeight;
    if(width && width.unit !== unit.AUTO) {
      switch(width.unit) {
        case unit.PX:
          w = width.value;
          break;
      }
    }
    if(height && height.unit !== unit.AUTO) {
      fixedHeight = true;
      switch(height.unit) {
        case unit.PX:
          h = height.value;
          break;
        case unit.PERCENT:
          h *= height.value * 0.01;
          break;
      }
    }
    // border影响x和y和尺寸
    x += borderLeftWidth.value;
    data.x = x;
    y += borderTopWidth.value;
    data.y = y;
    w -= borderLeftWidth.value + borderRightWidth.value;
    h -= borderTopWidth.value + borderBottomWidth.value;
    this.__width = w;
    this.__height = fixedHeight ? h : 0;
  }

  __preLayFlex(data) {
    // 无children所以等同于block
    this.__preLayBlock(data);
  }

  __preLayInline(data) {
    let { x, y, w, h } = data;
    this.__x = x;
    this.__y = y;
    let { style } = this;
    let {
      width,
      height,
      borderTopWidth,
      borderRightWidth,
      borderBottomWidth,
      borderLeftWidth,
    } = style;
    // 除了auto外都是固定高度
    let fixedWidth;
    let fixedHeight;
    if(width && width.unit !== unit.AUTO) {
      fixedWidth = true;
      switch(width.unit) {
        case unit.PX:
          w = width.value;
          break;
      }
    }
    if(height && height.unit !== unit.AUTO) {
      fixedHeight = true;
      switch(height.unit) {
        case unit.PX:
          h = height.value;
          break;
      }
    }
    // border影响x和y
    x += borderLeftWidth.value;
    data.x = x;
    y += borderTopWidth.value;
    data.y = y;
    w -= borderLeftWidth.value + borderRightWidth.value;
    h -= borderTopWidth.value + borderBottomWidth.value;
    // 元素的width不能超过父元素w
    this.__width = fixedWidth ? w : x - data.x;
    this.__height = fixedHeight ? h : y - data.y;
  }

  __calAbs() {
    return 0;
  }

  __emitEvent(e, force) {
    let { event: { type }, x: xe, y: ye, covers } = e;
    let { listener, style, x, y, outerWidth, outerHeight } = this;
    if(style.display === 'none') {
      return;
    }
    let cb;
    if(listener.hasOwnProperty(type)) {
      cb = listener[type];
    }
    if(force) {
      cb && cb(e);
      return;
    }
    if(xe >= x && ye >= y && xe <= x + outerWidth && ye <= y + outerHeight) {
      for(let i = 0, len = covers.length; i < len; i++) {
        let { x: x2, y: y2, w, h: h } = covers[i];
        if(xe >= x2 && ye >= y2 && xe <= x2 + w && ye <= y2 + h) {
          return;
        }
      }
      if(!e.target) {
        e.target = this;
      }
      covers.push({
        x,
        y,
        w: outerWidth,
        h: outerHeight,
      });
      cb && cb(e);
    }
  }

  render(renderMode) {
    super.render(renderMode);
    if(renderMode === mode.SVG) {
      this.__virtualDom = {
        ...super.virtualDom,
        type: 'geom',
        content: [],
      };
    }
  }

  get tagName() {
    return this.__tagName;
  }
  get baseLine() {
    return this.__height;
  }

  static getImplement(name) {
    if(!IMPLEMENT.hasOwnProperty(name)) {
      throw new Error(`Geom has not register: ${name}`);
    }
    return IMPLEMENT[name];
  }
  static register(name, implement) {
    if(IMPLEMENT.hasOwnProperty(name)) {
      throw new Error(`Geom has already register: ${name}`);
    }
    IMPLEMENT[name] = implement;
  }
}

export default Geom;
