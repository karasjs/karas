import Xom from '../node/Xom';
import reset from '../style/reset';
import css from '../style/css';
import unit from '../style/unit';
import mode from '../node/mode';
import util from '../util/util';
import level from '../refresh/level';
import refreshMode from '../refresh/mode';
import tf from '../style/transform';
import mx from '../math/matrix';

const { AUTO, PX, PERCENT } = unit;
const { int2rgba, isNil } = util;

const REGISTER = {};

class Geom extends Xom {
  constructor(tagName, props) {
    super(tagName, props);
    this.__isMulti = !!this.props.multi;
    this.__isMask = !!this.props.mask;
    this.__isClip = !!this.props.clip;
    let { style, isMask, isClip } = this;
    if(isMask || isClip) {
      style.visibility = 'visible';
      style.background = null;
      style.border = null;
      style.strokeWidth = 0;
      style.stroke = null;
      if(isClip) {
        style.fill = '#FFF';
        style.opacity = 1;
      }
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
    this.__width = fixedWidth ? w : x - data.x;
    this.__height = fixedHeight ? h : y - data.y;
    this.__cacheProps = {};
  }

  __preSet(renderMode, ctx, defs) {
    let { sx: x, sy: y, width, height, __cacheStyle, currentStyle, computedStyle } = this;
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
    // 先根据cache计算需要重新计算的computedStyle
    ['stroke', 'fill'].forEach(k => {
      if(isNil(__cacheStyle[k])) {
        let v = currentStyle[k];
        computedStyle[k] = v;
        if(v && (v.k === 'linear' || v.k === 'radial')) {
          __cacheStyle[k] = this.__gradient(renderMode, ctx, defs, originX, originY, originX + width, originY + height, iw, ih, v);
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

  render(renderMode, lv, ctx, defs) {
    let res = super.render(renderMode, lv, ctx, defs);
    let cacheFilter = this.__cacheFilter, cacheTotal = this.__cacheTotal, cache = this.__cache;
    let virtualDom = this.virtualDom;
    // 存在老的缓存认为可提前跳出
    if(lv < level.REPAINT
      && (cacheTotal && cacheTotal.available || cache && cache.available || !level.contain(lv, level.FILTER) && cacheFilter)) {
      res.break = true; // geom子类标识可以跳过自定义render()
    }
    if(renderMode === mode.SVG) {
      // svg mock，每次都生成，每个节点都是局部根，更新时自底向上清除
      if(!cacheTotal) {
        this.__cacheTotal = {
          available: true,
          release() {
            this.available = false;
            delete virtualDom.cache;
          },
        };
      }
      else if(!cacheTotal.available) {
        cacheTotal.available = true;
      }
      this.virtualDom.type = 'geom';
    }
    // 无论canvas/svg，break可提前跳出省略计算
    if(res.break) {
      return res;
    }
    this.__cacheFilter = null;
    // data在无cache时没有提前设置
    let preData = (this.root.cache && renderMode === mode.CANVAS) ? this.__preData : this.__preSet(renderMode, ctx, defs);
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

  __renderAsMask(renderMode, lv, ctx, defs, isClip) {
    if(renderMode === mode.CANVAS) {
      this.root.cache && (this.__preData = this.__preSet(renderMode, ctx, defs));
    }
    // mask渲染在canvas等被遮罩层调用，svg生成maskId
    else if(renderMode === mode.SVG) {
      this.render(renderMode, lv, ctx, defs);
      let vd = this.virtualDom;
      if(isClip) {
        vd.isClip = true;
      }
      else {
        vd.isMask = true;
      }
      // 强制不缓存，防止引用mask的matrix变化不生效
      delete vd.lv;
    }
  }

  // 类似dom，但geom没有children所以没有total的概念
  __applyCache(renderMode, lv, ctx, mode, cacheTop, opacity, matrix) {
    let cacheFilter = this.__cacheFilter;
    let cacheMask = this.__cacheMask;
    let cache = this.__cache;
    let computedStyle = this.computedStyle;
    // 优先filter，然后mask，再cache
    let target = cacheFilter || cacheMask;
    // 向总的离屏canvas绘制，最后由top汇总再绘入主画布
    if(mode === refreshMode.CHILD) {
      let { sx: x, sy: y } = this;
      x += computedStyle.marginLeft;
      y += computedStyle.marginTop;
      let { coords: [tx, ty], x1, y1, dbx, dby } = cacheTop;
      let dx = tx + x - x1 + dbx;
      let dy = ty + y - y1 + dby;
      let tfo = computedStyle.transformOrigin.slice(0);
      tfo[0] += dx;
      tfo[1] += dy;
      let m = tf.calMatrixByOrigin(computedStyle.transform, tfo);
      matrix = mx.multiply(matrix, m);
      ctx.setTransform(...matrix);
      opacity *= computedStyle.opacity;
      ctx.globalAlpha = opacity;
      if(target) {
        Cache.drawCache(target, cacheTop);
      }
      else if(cache && cache.available) {
        Cache.drawCache(cache, cacheTop);
      }
    }
    // root调用局部整体缓存或单个节点缓存绘入主画布
    else if(mode === refreshMode.ROOT) {
      let { __opacity, matrixEvent } = this;
      // 写回主画布前设置
      ctx.globalAlpha = __opacity;
      ctx.setTransform(...matrixEvent);
      if(!target && cache && cache.available) {
        target = cache;
      }
      if(target) {
        let { x1, y1, dbx, dby, canvas } = target;
        ctx.drawImage(canvas, x1 - 1 - dbx, y1 - 1 - dby);
      }
      else if(cache && cache.available) {
        let { coords: [tx, ty], x1, y1, dbx, dby, canvas, size } = target;
        ctx.drawImage(canvas, x1 - 1 - dbx, y1 - 1 - dby, size, size, tx - 1, tx - 1, size, size);
      }
    }
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

  // geom强制有内容
  __calCache() {
    super.__calCache.apply(this, arguments);
    return true;
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
