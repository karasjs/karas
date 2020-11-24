import Xom from '../node/Xom';
import reset from '../style/reset';
import css from '../style/css';
import unit from '../style/unit';
import mode from '../node/mode';
import util from '../util/util';
import level from '../refresh/level';

const { AUTO, PX, PERCENT } = unit;
const { int2rgba, isNil } = util;

const REGISTER = {};

class Geom extends Xom {
  constructor(tagName, props) {
    super(tagName, props);
    this.__isMulti = !!this.props.multi;
    this.__isMask = !!this.props.mask;
    this.__isClip = this.__isMask && !!this.props.clip;
    let { style, isMask } = this;
    if(isMask) {
      style.visibility = 'visible';
      style.background = null;
      style.border = null;
      style.strokeWidth = 0;
      style.stroke = null;
    }
    this.__style = css.normalize(this.style, reset.DOM_ENTRY_SET.concat(reset.GEOM_ENTRY_SET));
    this.__currentStyle = util.extend({}, this.__style);
    this.__currentProps = util.clone(this.props);
    this.__cacheProps = {};
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
    this.__ioSize(w, this.height);
    this.__marginAuto(this.currentStyle, data);
    this.__cacheProps = {};
  }

  __layoutFlex(data) {
    // 无children所以等同于block
    this.__layoutBlock(data);
  }

  __layoutInline(data) {
    let { fixedWidth, fixedHeight, x, y, w, h } = this.__preLayout(data);
    // 元素的width不能超过父元素w
    let tw = this.__width = fixedWidth ? w : x - data.x;
    let th = this.__height = fixedHeight ? h : y - data.y;
    this.__ioSize(tw, th);
    this.__cacheProps = {};
  }

  __calCache(renderMode, lv, ctx, defs, parent, __cacheStyle, currentStyle, computedStyle,
             sx, sy, innerWidth, innerHeight, outerWidth, outerHeight,
             borderTopWidth, borderRightWidth, borderBottomWidth, borderLeftWidth,
             x1, x2, x3, x4, y1, y2, y3, y4) {
    super.__calCache(renderMode, lv, ctx, defs, parent, __cacheStyle, currentStyle, computedStyle,
      sx, sy, innerWidth, innerHeight, outerWidth, outerHeight,
      borderTopWidth, borderRightWidth, borderBottomWidth, borderLeftWidth,
      x1, x2, x3, x4, y1, y2, y3, y4);
    // geom才有的style
    ['stroke', 'fill'].forEach(k => {
      if(isNil(__cacheStyle[k])) {
        let v = currentStyle[k];
        computedStyle[k] = v;
        if(v && (v.k === 'linear' || v.k === 'radial')) {
          __cacheStyle[k] = this.__gradient(renderMode, ctx, defs,
            x2, y2, x3, y3, innerWidth, innerHeight, v);
        }
        else {
          __cacheStyle[k] = int2rgba(currentStyle[k]);
        }
      }
    });
    if(isNil(__cacheStyle.strokeWidth)) {
      __cacheStyle.strokeWidth = true;
      let strokeWidth = currentStyle.strokeWidth;
      if(strokeWidth.unit === PX) {
        computedStyle.strokeWidth = strokeWidth.value;
      }
      else if(strokeWidth.unit === PERCENT) {
        computedStyle.strokeWidth = strokeWidth.value * width * 0.01;
      }
      else {
        computedStyle.strokeWidth = 0;
      }
    }
    if(isNil(__cacheStyle.strokeDasharray)) {
      __cacheStyle.strokeDasharray = true;
      computedStyle.strokeDasharray = currentStyle.strokeDasharray;
      __cacheStyle.strokeDasharrayStr = util.joinArr(currentStyle.strokeDasharray, ',');
    }
    // 直接赋值的
    [
      'strokeLinecap',
      'strokeLinejoin',
      'strokeMiterlimit',
      'fillRule',
    ].forEach(k => {
      computedStyle[k] = currentStyle[k];
    });
    // Geom强制有内容
    return true;
  }

  __preSet() {
    let { sx: x, sy: y, width, height, __cacheStyle, computedStyle } = this;
    let {
      borderTopWidth,
      borderLeftWidth,
      display,
      marginTop,
      marginLeft,
      paddingTop,
      paddingLeft,
      visibility,
    } = computedStyle;
    let originX = x + borderLeftWidth + marginLeft + paddingLeft;
    let originY = y + borderTopWidth + marginTop + paddingTop;
    let cx = originX + width * 0.5;
    let cy = originY + height * 0.5;
    let {
      fill,
      stroke,
      strokeDasharrayStr,
    } = __cacheStyle;
    let {
      strokeWidth,
      strokeLinecap,
      strokeLinejoin,
      strokeMiterlimit,
      strokeDasharray,
      fillRule,
    } = computedStyle;
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
      strokeDasharrayStr,
      strokeLinecap,
      strokeLinejoin,
      strokeMiterlimit,
      fill,
      visibility,
      fillRule,
    };
  }

  __preSetCanvas(renderMode, ctx, res) {
    let {
      stroke,
      strokeWidth,
      strokeDasharray,
      strokeLinecap,
      strokeLinejoin,
      strokeMiterlimit,
      fill,
    } = res;
    if(renderMode === mode.CANVAS) {
      if(ctx.fillStyle !== fill) {
        ctx.fillStyle = fill;
      }
      if(ctx.strokeStyle !== stroke) {
        ctx.strokeStyle = stroke;
      }
      if(ctx.lineWidth !== strokeWidth) {
        ctx.lineWidth = strokeWidth;
      }
      if(ctx.lineCap !== strokeLinecap) {
        ctx.lineCap = strokeLinecap;
      }
      if(ctx.lineJoin !== strokeLinejoin) {
        ctx.lineJoin = strokeLinejoin;
      }
      if(ctx.miterLimit !== strokeMiterlimit) {
        ctx.miterLimit = strokeMiterlimit;
      }
      // 小程序没这个方法
      if(util.isFunction(ctx.getLineDash)) {
        if(!util.equalArr(ctx.getLineDash(), strokeDasharray)) {
          ctx.setLineDash(strokeDasharray);
        }
      }
      else {
        ctx.setLineDash(strokeDasharray);
      }
    }
  }

  render(renderMode, lv, ctx, defs, cache) {
    // cache状态渲染Root会先计算出super的__renderSelfData，非cache则无，也有可能渲染到一半异常从头再来，此时可能有也可能无
    let res = this.__renderSelfData || super.render(renderMode, lv, ctx, defs);
    let {
      __cache,
      __cacheTotal,
      __cacheFilter,
      __cacheMask,
    } = this;
    // 存在老的缓存认为可提前跳出
    if(lv < level.REPAINT
      && (__cacheTotal && __cacheTotal.available
        || __cache && __cache.available
        || !level.contain(lv, level.FILTER) && __cacheFilter
        || __cacheMask)) {
      res.break = true; // geom子类标识可以跳过自定义render()
    }
    if(renderMode === mode.SVG) {
      this.virtualDom.type = 'geom';
    }
    // 无论canvas/svg，break可提前跳出省略计算
    if(res.break) {
      return res;
    }
    // data在无cache时没有提前设置
    let preData = this.__preSet(renderMode, ctx, defs);
    let { x2, y2 } = res;
    let { originX, originY } = preData;
    // 有cache时需计算差值
    let { paddingLeft, paddingTop } = this.computedStyle;
    x2 += paddingLeft;
    y2 += paddingTop;
    preData.dx = x2 - originX;
    preData.dy = y2 - originY;
    this.__preSetCanvas(renderMode, ctx, preData);
    return Object.assign(res, preData);
  }

  __propsStrokeStyle(props, strokeDasharrayStr, strokeLinecap, strokeLinejoin, strokeMiterlimit) {
    if(strokeDasharrayStr) {
      props.push(['stroke-dasharray', strokeDasharrayStr]);
    }
    if(strokeLinecap !== 'butt') {
      props.push(['stroke-linecap', strokeLinecap]);
    }
    if(strokeLinejoin !== 'miter') {
      props.push(['stroke-linejoin', strokeLinejoin]);
    }
    if(strokeMiterlimit !== 4) {
      props.push(['stroke-miterlimit', strokeMiterlimit]);
    }
  }

  __cancelCache(recursion) {
    super.__cancelCache(recursion);
    this.__cacheProps = {};
  }

  // geom的cache无内容也不清除
  __releaseWhenEmpty() {}

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

  get baseLine() {
    return this.__height;
  }

  get isMulti() {
    return this.__isMulti;
  }

  get isMask() {
    return this.__isMask;
  }

  get isClip() {
    return this.__isClip;
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
