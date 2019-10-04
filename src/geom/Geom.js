import Xom from '../node/Xom';
import css from '../style/css';
import unit from '../style/unit';
import mode from '../mode';
import util from '../util';
import gradient from '../style/gradient';

const REGISTER = {};

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

  __layoutBlock(data) {
    let { fixedHeight, w, h } = this.__preLayout(data);
    let {
      marginLeft,
      marginRight,
      width,
    } = this.style;
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

  __calAbs() {
    return 0;
  }

  __preRender(renderMode) {
    let { rx: x, ry: y, width, height, mlw, mtw, plw, ptw, prw, pbw, style } = this;
    let {
      borderTopWidth,
      borderLeftWidth,
      display,
      stroke,
      strokeWidth,
      strokeDasharray,
      fill,
    } = style;
    let originX = x + borderLeftWidth.value + mlw + plw;
    let originY = y + borderTopWidth.value + mtw + ptw;
    let cx = originX + width * 0.5;
    let cy = originY + height * 0.5;
    let iw = width + plw + prw;
    let ih = height + ptw + pbw;
    if(strokeWidth > 0 && stroke.indexOf('linear-gradient') > -1) {
      let go = gradient.parseGradient(stroke);
      if(go) {
        let lg = gradient.getLinear(go.v, cx, cy, iw, ih);
        if(renderMode === mode.CANVAS) {
          stroke = this.getCanvasLg(lg);
        }
        else if(renderMode === mode.SVG) {
          stroke = `url(#${this.getSvgLg(lg)})`;
        }
      }
    }
    if(fill.indexOf('linear-gradient') > -1) {
      let go = gradient.parseGradient(fill);
      if(go) {
        let lg = gradient.getLinear(go.v, cx, cy, iw, ih);
        if(renderMode === mode.CANVAS) {
          fill = this.getCanvasLg(lg);
        }
        else if(renderMode === mode.SVG) {
          fill = `url(#${this.getSvgLg(lg)})`;
        }
      }
    }
    else if(fill.indexOf('radial-gradient') > -1) {
      let go = gradient.parseGradient(fill);
      if(go) {
        let rg = gradient.getRadial(go.v, cx, cy, originX, originY, originY + iw, originY + ih);
        if(renderMode === mode.CANVAS) {
          fill = this.getCanvasRg(rg);
        }
        else if(renderMode === mode.SVG) {
          fill = `url(#${this.getSvgRg(rg)})`;
        }
      }
    }
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
      fill,
    };
  }

  render(renderMode) {
    super.render(renderMode);
    if(renderMode === mode.SVG) {
      this.__virtualDom = {
        ...super.virtualDom,
        type: 'geom',
      };
    }
    return this.__preRender(renderMode);
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
