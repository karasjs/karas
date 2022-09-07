import Xom from '../Xom';
import reset from '../../style/reset';
import css from '../../style/css';
import unit from '../../style/unit';
import enums from '../../util/enums';
import mode from '../../refresh/mode';
import util from '../../util/util';
import painter from '../../util/painter';
import transform from '../../style/transform';
import mx from '../../math/matrix';
import inject from '../../util/inject';
import gradient from '../../math/gradient';

const {
  STYLE_KEY: {
    MARGIN_RIGHT,
    MARGIN_LEFT,
    PADDING_RIGHT,
    PADDING_LEFT,
    WIDTH,
    HEIGHT,
    BORDER_RIGHT_WIDTH,
    BORDER_LEFT_WIDTH,
    FILL,
    STROKE,
    STROKE_MITERLIMIT,
    STROKE_WIDTH,
    STROKE_LINECAP,
    STROKE_LINEJOIN,
    STROKE_DASHARRAY,
    STROKE_DASHARRAY_STR,
    FILL_RULE,
    VISIBILITY,
    FLEX_BASIS,
  },
} = enums;
const { AUTO, PX, PERCENT, REM, VW, VH, VMAX, VMIN, RGBA, GRADIENT } = unit;
const { int2rgba, isNil, joinArr } = util;
const { canvasPolygon, svgPolygon } = painter;

const REGISTER = {};

class Geom extends Xom {
  constructor(tagName, props) {
    super(tagName, props);
    this.__isMulti = !!this.props.multi;
    this.__style = css.normalize(this.style, reset.DOM_ENTRY_SET.concat(reset.GEOM_ENTRY_SET));
    this.__currentStyle = util.extend({}, this.__style);
    this.__currentProps = util.clone(this.props);
    this.__cacheProps = {};
  }

  __tryLayInline(w, total) {
    this.__computeReflow();
    // 无children，直接以style的width为宽度，不定义则为0
    let { currentStyle: {
      [WIDTH]: width,
      [MARGIN_LEFT]: marginLeft,
      [MARGIN_RIGHT]: marginRight,
      [PADDING_LEFT]: paddingLeft,
      [PADDING_RIGHT]: paddingRight,
    }, computedStyle: {
      [BORDER_LEFT_WIDTH]: borderLeftWidth,
      [BORDER_RIGHT_WIDTH]: borderRightWidth,
    } } = this;
    if(width[1] !== AUTO) {
      w -= this.__calSize(width, total, true);
    }
    // 减去水平mbp
    w -= this.__calSize(marginRight, total, true);
    w -= this.__calSize(paddingRight, total, true);
    w -= borderRightWidth;
    w -= this.__calSize(marginLeft, total, true);
    w -= this.__calSize(paddingLeft, total, true);
    w -= borderLeftWidth;
    return w;
  }

  __calBasis(isDirectionRow, isAbs, isColumn, data, isDirectChild) {
    this.__computeReflow();
    let b = 0;
    let min = 0;
    let max = 0;
    let { currentStyle, computedStyle } = this;
    let { w, h } = data;
    // 计算需考虑style的属性
    let {
      [FLEX_BASIS]: flexBasis,
      [WIDTH]: width,
      [HEIGHT]: height,
    } = currentStyle;
    let main = isDirectionRow ? width : height;
    // basis3种情况：auto、固定、content，只区分固定和其它
    let isFixed = [PX, PERCENT, REM, VW, VH, VMAX, VMIN].indexOf(flexBasis.u) > -1;
    if(isFixed) {
      b = max = min = this.__calSize(flexBasis, isDirectionRow ? w : h, true);
    }
    else if(([PX, PERCENT, REM, VW, VH, VMAX, VMIN].indexOf(main.u) > -1)) {
      b = max = min = this.__calSize(main, isDirectionRow ? w : h, true);
    }
    // 直接item的mpb影响basis
    return this.__addMBP(isDirectionRow, w, currentStyle, computedStyle, [b, min, max], isDirectChild);
  }

  __layoutBlock(data, isAbs, isColumn, isRow) {
    let { fixedWidth, fixedHeight, w, h, isParentVertical, isUpright } = this.__preLayout(data, false);
    let tw = 0, th = 0;
    if(fixedWidth || !isAbs && !isParentVertical && !isUpright) {
      tw = w;
    }
    if(fixedHeight || !isAbs && isParentVertical && isUpright) {
      th = h;
    }
    this.__ioSize(tw, th);
    if(isAbs || isColumn || isRow) {
      return;
    }
    this.__marginAuto(this.currentStyle, data);
    this.__cacheProps = {};
  }

  __layoutFlex(data, isAbs, isColumn, isRow) {
    // 无children所以等同于block
    this.__layoutBlock(data, isAbs, isColumn, isRow);
  }

  __layoutInline(data, isAbs, isInline) {
    let { fixedWidth, fixedHeight, w, h } = this.__preLayout(data, false);
    let tw = fixedWidth ? w : 0;
    let th = fixedHeight ? h : 0;
    this.__ioSize(tw, th);
    this.__cacheProps = {};
  }

  __calStyle(__currentStyle, __computedStyle, __cacheStyle) {
    let res = super.__calStyle(__currentStyle, __computedStyle, __cacheStyle);
    if(isNil(__cacheStyle[STROKE_WIDTH])) {
      __cacheStyle[STROKE_WIDTH] = true;
      let strokeWidth = __currentStyle[STROKE_WIDTH] || [];
      let w = this.width;
      __computedStyle[STROKE_WIDTH] = strokeWidth.map(item => {
        return this.__calSize(item, w, true);
      });
    }
    if(isNil(__cacheStyle[STROKE_DASHARRAY])) {
      __cacheStyle[STROKE_DASHARRAY] = true;
      __computedStyle[STROKE_DASHARRAY] = __currentStyle[STROKE_DASHARRAY] || [];
      __cacheStyle[STROKE_DASHARRAY_STR] = __computedStyle[STROKE_DASHARRAY].map(item => joinArr(item, ','));
    }
    // 直接赋值的
    [
      STROKE_LINECAP,
      STROKE_LINEJOIN,
      STROKE_MITERLIMIT,
      FILL_RULE,
    ].forEach(k => {
      __computedStyle[k] = __currentStyle[k];
    });
    // stroke/fll移至render里处理，因为cache涉及渐变坐标偏移
    [FILL, STROKE].forEach(k => {
      if(isNil(__cacheStyle[k])) {
        let v = __currentStyle[k];
        let cs = __computedStyle[k] = [];
        let res = __cacheStyle[k] = [];
        if(Array.isArray(v)) {
          v.forEach(item => {
            if(item && item.u === GRADIENT) {
              // let t = this.__gradient(renderMode, ctx, x3, y3, x4, y4, item[0], 0, 0);
              cs.push(item.v);
              res.push(true);
            }
            else if(item && item.u === RGBA && item.v[3] > 0) {
              cs.push(item.v);
              res.push(int2rgba(item.v));
            }
            else {
              cs.push('none');
              res.push('none');
            }
          });
        }
      }
    });
    return res;
  }

  __calContent(currentStyle, computedStyle) {
    // Geom强制有内容
    return computedStyle[VISIBILITY] !== 'hidden';
  }

  __preSet(renderMode, res) {
    let { width, height, __cacheStyle, computedStyle } = this;
    let cx = res.sx3 + width * 0.5;
    let cy = res.sy3 + height * 0.5;
    let {
      [STROKE_DASHARRAY_STR]: strokeDasharrayStr,
    } = __cacheStyle;
    let {
      [FILL]: fill,
      [STROKE]: stroke,
      [STROKE_WIDTH]: strokeWidth,
      [STROKE_LINECAP]: strokeLinecap,
      [STROKE_LINEJOIN]: strokeLinejoin,
      [STROKE_MITERLIMIT]: strokeMiterlimit,
      [STROKE_DASHARRAY]: strokeDasharray,
      [FILL_RULE]: fillRule,
    } = computedStyle;
    stroke = stroke.map(item => {
      if(item.k) {
        return this.__gradient(renderMode, res.ctx, res.sx3, res.sy3, res.sx4, res.sy4, item, res.dx, res.dy);
      }
      return int2rgba(item);
    });
    fill = fill.map(item => {
      if(item.k) {
        return this.__gradient(renderMode, res.ctx, res.sx3, res.sy3, res.sx4, res.sy4, item, res.dx, res.dy);
      }
      return int2rgba(item);
    });
    return {
      cx,
      cy,
      stroke,
      strokeWidth,
      strokeDasharray,
      strokeDasharrayStr,
      strokeLinecap,
      strokeLinejoin,
      strokeMiterlimit,
      fill,
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
      if(fill) {
        if(fill.k === 'linear') {
          ctx.fillStyle = fill.v;
        }
        else if(fill.k === 'radial' && !Array.isArray(fill.v)) {
          ctx.fillStyle = fill.v;
        }
        else if(fill.k === 'conic') {
          //
        }
        else if(!fill.k && ctx.fillStyle !== fill) {
          ctx.fillStyle = fill;
        }
      }
      if(stroke) {
        if(stroke.k === 'linear') {
          ctx.strokeStyle = stroke.v;
        }
        else if(stroke.k === 'radial' && !Array.isArray(stroke.v)) {
          ctx.strokeStyle = stroke.v;
        }
        else if(stroke.k === 'conic') {
          //
        }
        else if(!stroke.k && ctx.strokeStyle !== stroke) {
          ctx.strokeStyle = stroke;
        }
      }
      if(strokeWidth !== undefined && ctx.lineWidth !== strokeWidth) {
        ctx.lineWidth = strokeWidth;
      }
      if(strokeLinecap !== undefined && ctx.lineCap !== strokeLinecap) {
        ctx.lineCap = strokeLinecap;
      }
      if(strokeLinejoin !== undefined && ctx.lineJoin !== strokeLinejoin) {
        ctx.lineJoin = strokeLinejoin;
      }
      if(strokeMiterlimit !== undefined && ctx.miterLimit !== strokeMiterlimit) {
        ctx.miterLimit = strokeMiterlimit;
      }
      // 小程序没这个方法
      if(util.isFunction(ctx.getLineDash)) {
        if(strokeDasharray && !util.equalArr(ctx.getLineDash(), strokeDasharray)) {
          ctx.setLineDash(strokeDasharray);
        }
      }
      else if(strokeDasharray) {
        ctx.setLineDash(strokeDasharray);
      }
    }
  }

  render(renderMode, ctx, dx, dy) {
    let res = super.render(renderMode, ctx, dx, dy);
    if(renderMode === mode.SVG) {
      this.virtualDom.type = 'geom';
    }
    // 无论canvas/svg，break可提前跳出省略计算
    if(res.break || renderMode === mode.WEBGL) {
      return res;
    }
    // data在无cache时没有提前设置
    let preData = this.__preSet(renderMode, res);
    return Object.assign(res, preData);
  }

  __renderPolygon(renderMode, ctx, res) {
    let {
      fill: fills,
      fillRule: fillRules,
      stroke: strokes,
      strokeWidth: strokeWidths,
      strokeDasharray: strokeDasharrays,
      strokeDasharrayStr: strokeDasharrayStrs,
      strokeLinecap: strokeLinecaps,
      strokeLinejoin: strokeLinejoins,
      strokeMiterlimit: strokeMiterlimits,
      dx,
      dy,
    } = res;
    let { __cacheProps: { list }, isMulti, bbox } = this;
    // 普通情况下只有1个，按普通情况走
    if(fills.length <= 1 && strokes.length <= 1) {
      let o = {
        fill: fills[0],
        fillRule: fillRules[0],
        stroke: strokes[0],
        strokeWidth: strokeWidths[0],
        strokeDasharray: strokeDasharrays[0],
        strokeDasharrayStr: strokeDasharrayStrs[0],
        strokeLinecap: strokeLinecaps[0],
        strokeLinejoin: strokeLinejoins[0],
        strokeMiterlimit: strokeMiterlimits[0],
        dx,
        dy,
        bbox,
      };
      this.__renderOnePolygon(renderMode, ctx, isMulti, list, o);
    }
    // 多个需要fill在下面，stroke在上面，依次循环
    else {
      for(let i = 0, len = fills.length; i < len; i++) {
        let fill = fills[i];
        if(fill) {
          let o = {
            fill,
            fillRule: fillRules[i],
            dx,
            dy,
            bbox,
          };
          this.__renderOnePolygon(renderMode, ctx, isMulti, list, o);
        }
      }
      for(let i = 0, len = strokes.length; i < len; i++) {
        let stroke = strokes[i];
        if(stroke) {
          let o = {
            stroke,
            strokeWidth: strokeWidths[i],
            strokeDasharray: strokeDasharrays[i],
            strokeDasharrayStr: strokeDasharrayStrs[i],
            strokeLinecap: strokeLinecaps[i],
            strokeLinejoin: strokeLinejoins[i],
            strokeMiterlimit: strokeMiterlimits[i],
            dx,
            dy,
            bbox,
          };
          this.__renderOnePolygon(renderMode, ctx, isMulti, list, o);
        }
      }
    }
  }

  __renderOnePolygon(renderMode, ctx, isMulti, list, res) {
    let {
      fill,
      stroke,
      strokeWidth,
    } = res;
    let isFillCE = fill && fill.k === 'conic';
    let isStrokeCE = stroke && stroke.k === 'conic';
    // 椭圆是array
    let isFillRE = fill && fill.k === 'radial' && Array.isArray(fill.v);
    let isStrokeRE = strokeWidth && strokeWidth > 0 && stroke && stroke.k === 'radial' && Array.isArray(stroke.v);
    if(isFillCE || isStrokeCE) {
      if(isFillCE) {
        this.__conicGradient(renderMode, ctx, list, isMulti, res);
      }
      else if(fill !== 'none') {
        this.__drawPolygon(renderMode, ctx, isMulti, list, res, true);
      }
      if(strokeWidth && strokeWidth > 0 && isStrokeCE) {
        inject.warn('Stroke style can not use conic-gradient');
      }
      else if(strokeWidth && strokeWidth > 0 && stroke !== 'none') {
        this.__drawPolygon(renderMode, ctx, isMulti, list, res, false, true);
      }
    }
    else if(isFillRE || isStrokeRE) {
      if(isFillRE) {
        this.__radialEllipse(renderMode, ctx, list, isMulti, res, 'fill');
      }
      else if(fill !== 'none') {
        this.__drawPolygon(renderMode, ctx, isMulti, list, res, true);
      }
      // stroke椭圆渐变matrix会变形，降级为圆
      if(strokeWidth && strokeWidth > 0 && isStrokeRE) {
        inject.warn('Stroke style can not use radial-gradient for ellipse');
        res.stroke.v = res.stroke.v[0];
        this.__drawPolygon(renderMode, ctx, isMulti, list, res, false, true);
      }
      else if(strokeWidth && strokeWidth > 0 && stroke !== 'none') {
        this.__drawPolygon(renderMode, ctx, isMulti, list, res, false, true);
      }
    }
    else {
      this.__drawPolygon(renderMode, ctx, isMulti, list, res, true, true);
    }
  }

  __drawPolygon(renderMode, ctx, isMulti, list, res, isFill, isStroke) {
    let {
      fill,
      stroke,
      strokeWidth,
      fillRule,
      strokeDasharrayStr,
      strokeLinecap,
      strokeLinejoin,
      strokeMiterlimit,
      dx,
      dy,
    } = res;
    if(renderMode === mode.CANVAS) {
      this.__preSetCanvas(renderMode, ctx, res);
      ctx.beginPath();
      if(isMulti) {
        list.forEach(item => canvasPolygon(ctx, item, dx, dy));
      }
      else {
        canvasPolygon(ctx, list, dx, dy);
      }
      if(isFill && fill && fill !== 'none') {
        ctx.fill(fillRule);
      }
      if(isStroke && stroke && stroke !== 'none' && strokeWidth && strokeWidth > 0) {
        ctx.stroke();
      }
      ctx.closePath();
    }
    else if(renderMode === mode.SVG) {
      let d = '';
      if(isMulti) {
        list.forEach(item => d += svgPolygon(item));
      }
      else {
        d = svgPolygon(list);
      }
      let props = [
        ['d', d],
      ];
      // 2个都没有常出现在多fill/stroke时，也有可能特殊单个故意这样写的
      if((!fill || fill === 'none') && (!stroke || stroke === 'none')) {
        return;
      }
      if(isFill && fill && fill !== 'none') {
        props.push(['fill', fill.v || fill]);
        if(fillRule && fillRule !== 'nonzero') { // evenodd
          props.push(['fill-rule', fillRule]);
        }
      }
      else {
        props.push(['fill', 'none']);
      }
      if(isStroke && stroke && stroke !== 'none' && strokeWidth && strokeWidth > 0) {
        props.push(['stroke', stroke.v || stroke]);
        props.push(['stroke-width', strokeWidth]);
        this.__propsStrokeStyle(props, strokeDasharrayStr, strokeLinecap, strokeLinejoin, strokeMiterlimit);
      }
      else {
        props.push(['stroke-width', 0]);
      }
      this.addGeom('path', props);
    }
  }

  __inversePtList(list, isMulti, t, dx = 0, dy = 0) {
    if(isMulti) {
      return list.map(item => {
        if(!item || !item.length) {
          return null;
        }
        return item.map(item => {
          if(!item || !item.length) {
            return null;
          }
          let arr = [];
          for(let i = 0, len = item.length; i < len; i += 2) {
            let p = mx.calPoint([item[i] + dx, item[i + 1] + dy], t);
            arr.push(p[0]);
            arr.push(p[1]);
          }
          return arr;
        });
      });
    }
    else {
      return list.map(item => {
        if(!item || !item.length) {
          return null;
        }
        let arr = [];
        for(let i = 0, len = item.length; i < len; i += 2) {
          let p = mx.calPoint([item[i] + dx, item[i + 1] + dy], t);
          arr.push(p[0]);
          arr.push(p[1]);
        }
        return arr;
      });
    }
  }

  __radialEllipse(renderMode, ctx, list, isMulti, res, method) {
    let {
      strokeWidth,
      strokeDasharrayStr,
      strokeLinecap,
      strokeLinejoin,
      strokeMiterlimit,
      dx,
      dy,
    } = res;
    let [color, matrix, cx, cy] = res[method].v;
    // 椭圆渐变的转换，顶点逆矩阵变换
    let tfo = [cx, cy];
    matrix = transform.calMatrixByOrigin(matrix, tfo);
    let t = mx.inverse(matrix);
    list = this.__inversePtList(list, isMulti, t, dx, dy);
    // 用正向matrix渲染
    if(renderMode === mode.CANVAS) {
      if(matrix) {
        ctx.save();
        // 临时解决方案，webgl和cacheCanvas的渲染忽略世界matrix
        let me = this.matrixEvent;
        matrix = mx.multiply(me, matrix);
        ctx.setTransform(matrix[0], matrix[1], matrix[4], matrix[5], matrix[12], matrix[13]);
      }
      ctx.beginPath();
      if(ctx[method + 'Style'] !== color) {
        ctx[method + 'Style'] = color;
      }
      if(isMulti) {
        list.forEach(item => painter.canvasPolygon(ctx, item));
      }
      else {
        canvasPolygon(ctx, list);
      }
      ctx[method]();
      ctx.closePath();
      if(matrix) {
        ctx.restore();
      }
    }
    else if(renderMode === mode.SVG) {
      let d = '';
      if(isMulti) {
        list.forEach(item => d += svgPolygon(item));
      }
      else {
        d = svgPolygon(list);
      }
      let props = [
        ['d', d],
      ];
      if(method === 'fill') {
        props.push(['fill', color]);
        props.push(['strokeWidth', 0]);
      }
      else if(method === 'stroke') {
        props.push(['fill', 'none']);
        props.push(['stroke', color]);
        props.push(['stroke-width', strokeWidth]);
        this.__propsStrokeStyle(props, strokeDasharrayStr, strokeLinecap, strokeLinejoin, strokeMiterlimit);
      }
      props.push(['transform', `matrix(${joinArr(mx.m2m6(matrix), ',')})`]);
      this.addGeom('path', props);
    }
  }

  __conicGradient(renderMode, ctx, list, isMulti, res) {
    let {
      fill,
      bbox,
      dx = 0,
      dy = 0,
    } = res;
    let color = fill.v;
    if(renderMode === mode.CANVAS) {
      let [x1, y1, x2, y2] = bbox;
      let w = x2 - x1, h = y2 - y1;
      let offscreen = inject.getCacheCanvas(w, h, '__$$CONIC_GRADIENT$$__');
      let imgData = offscreen.ctx.getImageData(0,0, w, h);
      gradient.getConicGradientImage(w * 0.5, h * 0.5, w, h, fill.v.stop, imgData.data);
      offscreen.ctx.putImageData(imgData, 0, 0);
      if(isMulti) {
        list.forEach(item => {
          ctx.save();
          ctx.beginPath();
          canvasPolygon(ctx, item, dx, dy);
          ctx.clip();
          ctx.closePath();
          ctx.drawImage(offscreen.canvas, x1 + dx, y1 + dy);
          ctx.restore();
        });
      }
      else {
        ctx.save();
        ctx.beginPath();
        canvasPolygon(ctx, list, dx, dy);
        ctx.clip();
        ctx.closePath();
        ctx.drawImage(offscreen.canvas, x1 + dx, y1 + dy);
        ctx.restore();
      }
      offscreen.ctx.clearRect(0, 0, w, h);
    }
    else if(renderMode === mode.SVG) {
      if(isMulti) {
        list.forEach(item => {
          let v = {
            tagName: 'clipPath',
            children: [{
              tagName: 'path',
              props: [
                ['d', svgPolygon(item)],
              ],
            }],
          };
          let clip = ctx.add(v);
          this.__cacheDefs.push(v);
          color.forEach(item => {
            this.virtualDom.bb.push({
              type: 'item',
              tagName: 'path',
              props: [
                ['d', svgPolygon(item[0])],
                ['fill', item[1]],
                ['clip-path', 'url(#' + clip + ')'],
              ],
            });
          });
        });
      }
      else {
        let v = {
          tagName: 'clipPath',
          children: [{
            tagName: 'path',
            props: [
              ['d', svgPolygon(list)],
            ],
          }],
        };
        let clip = ctx.add(v);
        this.__cacheDefs.push(v);
        color.forEach(item => {
          this.virtualDom.bb.push({
            type: 'item',
            tagName: 'path',
            props: [
              ['d', svgPolygon(item[0])],
              ['fill', item[1]],
              ['clip-path', 'url(#' + clip + ')'],
            ],
          });
        });
      }
    }
  }

  __propsStrokeStyle(props, strokeDasharrayStr, strokeLinecap, strokeLinejoin, strokeMiterlimit) {
    if(strokeDasharrayStr) {
      props.push(['stroke-dasharray', strokeDasharrayStr]);
    }
    if(strokeLinecap && strokeLinecap !== 'butt') {
      props.push(['stroke-linecap', strokeLinecap]);
    }
    if(strokeLinejoin && strokeLinejoin !== 'miter') {
      props.push(['stroke-linejoin', strokeLinejoin]);
    }
    if(strokeMiterlimit && strokeMiterlimit !== 4) {
      props.push(['stroke-miterlimit', strokeMiterlimit]);
    }
  }

  // geom的cache无内容也不清除，因为子类不清楚内容，除非看不见
  // __releaseWhenEmpty(cache, computedStyle) {
  //   return computedStyle[VISIBILITY] === 'hidden';
  // }

  // offset/resize时要多一步清空props上记录的缓存
  __offsetX(diff, isLayout, lv) {
    super.__offsetX(diff, isLayout, lv);
    this.__cacheProps = {};
  }

  __offsetY(diff, isLayout, lv) {
    super.__offsetY(diff, isLayout, lv);
    this.__cacheProps = {};
  }

  __resizeX(diff, lv) {
    super.__resizeX(diff, lv);
    this.__cacheProps = {};
  }

  __resizeY(diff, lv) {
    super.__resizeY(diff, lv);
    this.__cacheProps = {};
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

  __isRealInline() {
    return false;
  }

  get isMulti() {
    return this.__isMulti;
  }

  get currentProps() {
    return this.__currentProps;
  }

  static get REGISTER() {
    return REGISTER;
  }

  static getRegister(name) {
    if(!name || !util.isString(name) || name.charAt(0) !== '$') {
      throw new Error('Invalid param');
    }
    if(!REGISTER.hasOwnProperty(name)) {
      throw new Error(`Geom has not register: ${name}`);
    }
    return REGISTER[name];
  }

  static register(name, obj) {
    if(!name || !util.isString(name) || name.charAt(0) !== '$'
      || !obj.prototype || !(obj.prototype instanceof Geom)) {
      throw new Error('Invalid param');
    }
    if(Geom.hasRegister(name)) {
      throw new Error(`Geom has already register: ${name}`);
    }
    REGISTER[name] = obj;
  }

  static hasRegister(name) {
    return name && REGISTER.hasOwnProperty(name);
  }

  static delRegister(name) {
    if(Geom.hasRegister(name)) {
      delete REGISTER[name];
    }
  }
}

export default Geom;
