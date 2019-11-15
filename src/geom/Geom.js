import Xom from '../node/Xom';
import reset from '../style/reset';
import css from '../style/css';
import unit from '../style/unit';
import mode from '../util/mode';
import util from '../util/util';

const REGISTER = {};

class Geom extends Xom {
  constructor(tagName, props) {
    super(tagName, props);
    this.__mask = !util.isNil(this.props.mask) || this.props.mask === true;
  }

  __init() {
    let style = this.style;
    if(this.mask) {
      style.position = 'absolute';
      style.display = 'block';
      style.visibility = 'visible';
      style.background = null;
      style.border = null;
    }
    css.normalize(style, reset.geom);
    let ref = this.props.ref;
    if(ref) {
      let owner = this.host || this.root;
      if(owner) {
        owner.ref[ref] = this;
      }
    }
  }

  __tryLayInline(w, total) {
    // 无children，直接以style的width为宽度，不定义则为0
    let { currentStyle: { width } } = this;
    if(width.unit === unit.PX) {
      return w - width.value;
    }
    else if(width.unit === unit.PERCENT) {
      return w - total * width.value * 0.01;
    }
    return w;
  }

  __calAutoBasis(isDirectionRow) {
    let b = 0;
    let min = 0;
    let max = 0;
    let { currentStyle, computedStyle } = this;
    // 计算需考虑style的属性
    let {
      width,
      height,
    } = currentStyle;
    let {
      borderTopWidth,
      borderRightWidth,
      borderBottomWidth,
      borderLeftWidth,
    } = computedStyle;
    let main = isDirectionRow ? width : height;
    if(main.unit !== unit.AUTO) {
      b = max += main.value;
    }
    // border也得计算在内
    if(isDirectionRow) {
      let w = borderRightWidth + borderLeftWidth;
      b += w;
      max += w;
      min += w;
    }
    else {
      let h = borderTopWidth + borderBottomWidth;
      b += h;
      max += h;
      min += h;
    }
    return { b, min, max };
  }

  __layoutBlock(data) {
    let { fixedHeight, w, h } = this.__preLayout(data);
    let {
      marginLeft,
      marginRight,
      width,
    } = this.currentStyle;
    this.__width = w;
    this.__height = fixedHeight ? h : 0;
    // 处理margin:xx auto居中对齐
    if(marginLeft.unit === unit.AUTO && marginRight.unit === unit.AUTO && width.unit !== unit.AUTO) {
      let ow = this.outerWidth;
      if(ow < data.w) {
        this.__offsetX((data.w - ow) * 0.5);
      }
    }
  }

  __layoutFlex(data) {
    // 无children所以等同于block
    this.__layoutBlock(data);
  }

  __layoutInline(data) {
    let { fixedWidth, fixedHeight, x, y, w, h } = this.__preLayout(data);
    // 元素的width不能超过父元素w
    this.__width = fixedWidth ? w : x - data.x;
    this.__height = fixedHeight ? h : y - data.y;
  }

  __preRender(renderMode) {
    let { sx: x, sy: y, width, height, currentStyle, computedStyle } = this;
    let {
      strokeWidth,
      fill,
      stroke,
      strokeDasharray,
      strokeLinecap,
    } = currentStyle;
    let {
      borderTopWidth,
      borderLeftWidth,
      display,
      marginTop,
      marginLeft,
      paddingTop,
      paddingRight,
      paddingBottom,
      paddingLeft,
      visibility,
    } = computedStyle;
    let originX = x + borderLeftWidth + marginLeft + paddingLeft;
    let originY = y + borderTopWidth + marginTop + paddingTop;
    let cx = originX + width * 0.5;
    let cy = originY + height * 0.5;
    let iw = width + paddingLeft + paddingRight;
    let ih = height + paddingTop + paddingBottom;
    if(strokeWidth.unit === unit.PX) {
      strokeWidth = strokeWidth.value;
    }
    else if(strokeWidth.unit === unit.PERCENT) {
      strokeWidth = strokeWidth.value * width * 0.01;
    }
    else {
      strokeWidth = 0;
    }
    computedStyle.strokeWidth = strokeWidth;
    if(stroke.k === 'linear' || stroke.k === 'radial') {
      stroke = this.__gradient(renderMode, originX, originY, originY + iw, originY + ih, iw, ih, 'stroke', stroke, computedStyle);
    }
    else {
      computedStyle.stroke = stroke;
    }
    if(fill.k === 'linear' || fill.k === 'radial') {
      fill = this.__gradient(renderMode, originX, originY, originY + iw, originY + ih, iw, ih, 'fill', fill, computedStyle);
    }
    else {
      computedStyle.fill = fill;
    }
    computedStyle.strokeWidth = strokeWidth;
    computedStyle.strokeDasharray = strokeDasharray;
    computedStyle.strokeLinecap = strokeLinecap;
    return {
      x,
      y,
      originX,
      originY,
      cx,
      cy,
      display,
      stroke,
      strokeWidth,
      strokeDasharray,
      strokeLinecap,
      fill,
      visibility,
    };
  }

  render(renderMode) {
    super.render(renderMode);
    let { isDestroyed, computedStyle: { display } } = this;
    if(isDestroyed || display === 'none') {
      return {
        isDestroyed,
        display,
      };
    }
    if(renderMode === mode.SVG) {
      this.__virtualDom = {
        ...super.virtualDom,
        type: 'geom',
      };
    }
    return this.__preRender(renderMode);
  }

  __renderAsMask(renderMode) {
    if(renderMode === mode.CANVAS) {}
    else if(renderMode === mode.SVG) {
      this.render(renderMode);
      let vd = this.virtualDom;
      vd.isMask = true;
      let maskId = this.defs.add({
        tagName: 'mask',
        props: [
          ['transform', vd.transform],
          ['opacity', vd.opacity]
        ],
        children: vd.children,
      });
      this.__maskId = `url(#${maskId})`;
    }
  }

  addGeom(tagName, props) {
    props = util.hash2arr(props);
    this.virtualDom.children.push({
      type: 'item',
      tagName,
      props,
    });
  }

  get tagName() {
    return this.__tagName;
  }
  get baseLine() {
    return this.__height;
  }
  get mask() {
    return this.__mask;
  }
  get maskId() {
    return this.__maskId;
  }

  static getRegister(name) {
    if(!REGISTER.hasOwnProperty(name)) {
      throw new Error(`Geom has not register: ${name}`);
    }
    return REGISTER[name];
  }
  static register(name, obj) {
    if(Geom.hasRegister(name)) {
      throw new Error(`Geom has already register: ${name}`);
    }
    REGISTER[name] = obj;
  }
  static hasRegister(name) {
    return REGISTER.hasOwnProperty(name);
  }
}

export default Geom;
