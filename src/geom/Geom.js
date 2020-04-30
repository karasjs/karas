import Xom from '../node/Xom';
import reset from '../style/reset';
import css from '../style/css';
import unit from '../style/unit';
import mode from '../util/mode';
import util from '../util/util';
import matrix from '../math/matrix';

const { AUTO, PX, PERCENT } = unit;
const { clone, int2rgba, isNil } = util;

const REGISTER = {};

class Geom extends Xom {
  constructor(tagName, props) {
    super(tagName, props);
    this.__isMask = !!this.props.mask;
    this.__currentProps = this.props;
  }

  __init() {
    super.__init();
    let { style, isMask } = this;
    if(isMask) {
      style.position = 'absolute';
      style.display = 'block';
      style.visibility = 'visible';
      style.background = null;
      style.border = null;
      style.strokeWidth = 0;
    }
    css.normalize(style, reset.geom);
  }

  __tryLayInline(w, total) {
    // 无children，直接以style的width为宽度，不定义则为0
    let { currentStyle: { width } } = this;
    if(width.unit === PX) {
      return w - width.value;
    }
    else if(width.unit === PERCENT) {
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
    if(main.unit !== AUTO) {
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

  __layoutBlock(data, isVirtual) {
    let { fixedWidth, fixedHeight, w, h } = this.__preLayout(data);
    this.__height = fixedHeight ? h : 0;
    if(isVirtual) {
      this.__width = fixedWidth ? w : 0;
      return;
    }
    this.__width = w;
    this.__marginAuto(this.currentStyle, data);
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
    if(strokeWidth.unit === PX) {
      strokeWidth = strokeWidth.value;
    }
    else if(strokeWidth.unit === PERCENT) {
      strokeWidth = strokeWidth.value * width * 0.01;
    }
    else {
      strokeWidth = 0;
    }
    computedStyle.strokeWidth = strokeWidth;
    if(stroke && (stroke.k === 'linear' || stroke.k === 'radial')) {
      stroke = this.__gradient(renderMode, originX, originY, originY + iw, originY + ih, iw, ih, 'stroke', stroke, computedStyle);
    }
    else {
      computedStyle.stroke = stroke = int2rgba(stroke);
    }
    if(fill && (fill.k === 'linear' || fill.k === 'radial')) {
      fill = this.__gradient(renderMode, originX, originY, originY + iw, originY + ih, iw, ih, 'fill', fill, computedStyle);
    }
    else {
      computedStyle.fill = fill = int2rgba(fill);
    }
    computedStyle.strokeWidth = strokeWidth;
    computedStyle.strokeDasharray = strokeDasharray.join(', ');
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
      strokeDasharrayStr: computedStyle.strokeDasharray,
      strokeLinecap,
      fill,
      visibility,
    };
  }

  render(renderMode) {
    super.render(renderMode);
    if(renderMode === mode.SVG) {
      this.virtualDom.type = 'geom';
    }
    let { isDestroyed, animateProps, computedStyle: { display } } = this;
    this.__currentProps = animateProps;
    if(isDestroyed || display === 'none') {
      return {
        isDestroyed,
        display,
      };
    }
    return this.__preRender(renderMode);
  }

  __renderAsMask(renderMode) {
    // mask渲染在canvas等被遮罩层调用，svg生成maskId
    if(renderMode === mode.SVG) {
      this.render(renderMode);
      let vd = this.virtualDom;
      vd.isMask = true;
      // svg的mask没有transform，需手动计算变换后的坐标应用
      let children = clone(vd.children);
      let m = this.matrixEvent;
      children.forEach(child => {
        let xi = 0;
        let yi = 1;
        let x, y;
        let props = child.props;
        if(child.tagName === 'rect') {
          for(let i = 0, len = props.length; i < len; i++) {
            let [k, v] = props[i];
            if(k === 'x') {
              xi = i;
              x = v;
            }
            else if(k === 'y') {
              yi = i;
              y = v;
            }
          }
          let point = matrix.calPoint([x, y], m);
          props[xi][1] = point[0];
          props[yi][1] = point[1];
        }
        else if(child.tagName === 'circle' || child.tagName === 'ellipse') {
          for(let i = 0, len = props.length; i < len; i++) {
            let [k, v] = props[i];
            if(k === 'cx') {
              xi = i;
              x = v;
            }
            else if(k === 'cy') {
              yi = i;
              y = v;
            }
          }
          let point = matrix.calPoint([x, y], m);
          props[xi][1] = point[0];
          props[yi][1] = point[1];
        }
        else if(child.tagName === 'polygon') {
          for(let i = 0, len = props.length; i < len; i++) {
            let [k, v] = props[i];
            if(k === 'points') {
              props[i][1] = v.replace(/([\d.]+),([\d.]+)/g, ($0, $1, $2) => {
                return matrix.calPoint([$1, $2], m).join(',');
              });
              break;
            }
          }
        }
        else if(child.tagName === 'path') {
          for(let i = 0, len = props.length; i < len; i++) {
            let [k, v] = props[i];
            if(k === 'd') {
              props[i][1] = v.replace(/([\d.]+),([\d.]+)/g, ($0, $1, $2) => {
                return matrix.calPoint([$1, $2], m).join(',');
              });
              break;
            }
          }
        }
      });
      // 连续多个mask需要合并
      let { prev, defs } = this;
      if(prev && prev.isMask) {
        let last = defs.value;
        last = last[last.length - 1];
        last.children = last.children.concat(children);
        this.__maskId = prev.maskId;
        return;
      }
      let maskId = defs.add({
        tagName: 'mask',
        props: [],
        children,
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

  getProps(k) {
    let v = this.currentProps[k];
    if(!isNil(v)) {
      return v;
    }
    return this['__' + k];
  }

  get tagName() {
    return this.__tagName;
  }
  get baseLine() {
    return this.__height;
  }
  get isMask() {
    return this.__isMask;
  }
  get maskId() {
    return this.__maskId;
  }
  get animateProps() {
    let { props, animationList } = this;
    let copy = clone(props);
    animationList.forEach(item => {
      if(item.animating) {
        Object.assign(copy, item.props);
      }
    });
    return copy;
  }
  get currentProps() {
    return this.__currentProps;
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
