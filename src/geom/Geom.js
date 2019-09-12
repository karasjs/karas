import Xom from '../node/Xom';
import css from '../style/css';
import unit from '../style/unit';

const TAG_NAME = {
  '$line': true,
  '$polygon': true,
};

class Geom extends Xom {
  constructor(tagName, props) {
    super(tagName, props);
  }

  __initStyle() {
    css.normalize(this.style);
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

  __preLayBlock(data) {}

  __preLayFlex(data) {}

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

  render() {
    super.render();
  }

  get tagName() {
    return this.__tagName;
  }
  get baseLine() {
    return 0;
  }

  static isValid(s) {
    return TAG_NAME.hasOwnProperty(s);
  }
}

export default Geom;
