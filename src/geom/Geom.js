import Node from '../node/Node';
import css from '../style/css';
import unit from '../style/unit';

const TAG_NAME = {
  '$line': true,
  '$polygon': true,
};

class Geom extends Node {
  constructor(props) {
    super(props);
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

  __preLay(data) {
    let { style } = this;
    if(style.display === 'block') {
      this.__preLayBlock(data);
    }
    else if(style.display === 'flex') {
      this.__preLayFlex(data);
    }
    else {
      this.__preLayInline(data);
    }
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

  render() {
    let { ctx, style, x, y, width, height } = this;
    let {
      backgroundColor,
      borderTopWidth,
      borderTopColor,
      borderRightWidth,
      borderRightColor,
      borderBottomWidth,
      borderBottomColor,
      borderLeftWidth,
      borderLeftColor,
    } = style;
    if(backgroundColor) {
      ctx.beginPath();
      ctx.fillStyle = backgroundColor;
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.fill();
      ctx.closePath();
    }
    if(borderTopWidth.value) {
      ctx.beginPath();
      ctx.lineWidth = borderTopWidth.value;
      ctx.strokeStyle = borderTopColor;
      let y2 = y + borderTopWidth.value * 0.5;
      ctx.moveTo(x + borderLeftWidth.value, y2);
      ctx.lineTo(x + borderLeftWidth.value + width, y2);
      ctx.stroke();
      ctx.closePath();
    }
    if(borderRightWidth.value) {
      ctx.beginPath();
      ctx.lineWidth = borderRightWidth.value;
      ctx.strokeStyle = borderRightColor;
      let x2 = x + width + borderLeftWidth.value + borderRightWidth.value * 0.5;
      ctx.moveTo(x2, y);
      ctx.lineTo(x2, y + height + borderTopWidth.value + borderBottomWidth.value);
      ctx.stroke();
      ctx.closePath();
    }
    if(borderBottomWidth.value) {
      ctx.beginPath();
      ctx.lineWidth = borderBottomWidth.value;
      ctx.strokeStyle = borderBottomColor;
      let y2 = y + height + borderTopWidth.value + borderBottomWidth.value * 0.5;
      ctx.moveTo(x + borderLeftWidth.value, y2);
      ctx.lineTo(x + borderLeftWidth.value + width, y2);
      ctx.stroke();
      ctx.closePath();
    }
    if(borderLeftWidth.value) {
      ctx.beginPath();
      ctx.lineWidth = borderLeftWidth.value;
      ctx.strokeStyle = borderLeftColor;
      ctx.moveTo(x + borderLeftWidth.value * 0.5, y);
      ctx.lineTo(x + borderLeftWidth.value * 0.5, y + height + borderTopWidth.value + borderBottomWidth.value);
      ctx.stroke();
      ctx.closePath();
    }
  }

  get tagName() {
    return this.__tagName;
  }
  get baseLine() {
    return 0;
  }
  get outerWidth() {
    let { style: { borderLeftWidth, borderRightWidth } } = this;
    return this.width + borderLeftWidth.value + borderRightWidth.value;
  }
  get outerHeight() {
    let { style: { borderTopWidth, borderBottomWidth } } = this;
    return this.height + borderTopWidth.value + borderBottomWidth.value;
  }

  static isValid(s) {
    return TAG_NAME.hasOwnProperty(s);
  }
}

export default Geom;
