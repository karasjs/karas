import Node from './Node';
import tool from './tool';
import mode from '../util/mode';
import unit from '../style/unit';
import tf from '../style/transform';
import gradient from '../style/gradient';
import border from '../style/border';
import css from '../style/css';
import image from '../style/image';
import util from '../util/util';
import Animation from '../animate/Animation';
import rp from '../animate/repaint';
import level from '../animate/level';
import inject from '../util/inject';
import mx from '../math/matrix';

const { AUTO, PX, PERCENT, STRING, INHERIT } = unit;
const { clone, int2rgba, equalArr, extend, joinArr } = util;
const { normalize, calRelative, compute } = css;
const { genCanvasPolygon, genSvgPolygon } = tool;

function renderBorder(renderMode, points, color, ctx, xom) {
  if(renderMode === mode.CANVAS) {
    if(ctx.fillStyle !== color) {
      ctx.fillStyle = color;
    }
    points.forEach(point => {
      genCanvasPolygon(ctx, point);
    });
  }
  else if(renderMode === mode.SVG) {
    let s = '';
    points.forEach(point => {
      s += genSvgPolygon(point);
    });
    xom.virtualDom.bb.push({
      type: 'item',
      tagName: 'path',
      props: [
        ['d', s],
        ['fill', color]
      ],
    });
  }
}

function renderBgc(renderMode, color, x, y, w, h, ctx, xom, btw, brw, bbw, blw, btlr, btrr, bbrr, bblr, method = 'fill') {
  // border-radius使用三次贝塞尔曲线模拟1/4圆角，误差在[0, 0.000273]之间
  let list = border.calRadius(x, y, w, h, btw, brw, bbw, blw, btlr, btrr, bbrr, bblr);
  if(renderMode === mode.CANVAS) {
    if(ctx.fillStyle !== color) {
      ctx.fillStyle = color;
    }
    if(list) {
      genCanvasPolygon(ctx, list, method);
    }
    else {
      ctx.beginPath();
      ctx.rect(x, y, w, h);
      ctx[method]();
      ctx.closePath();
    }
  }
  else if(renderMode === mode.SVG) {
    if(list) {
      let d = genSvgPolygon(list);
      xom.virtualDom.bb.push({
        type: 'item',
        tagName: 'path',
        props: [
          ['d', d],
          ['fill', color]
        ],
      });
    }
    else {
      xom.virtualDom.bb.push({
        type: 'item',
        tagName: 'rect',
        props: [
          ['x', x],
          ['y', y],
          ['width', w],
          ['height', h],
          ['fill', color]
        ],
      });
    }
  }
}

let borderRadiusKs = ['borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomRightRadius', 'borderBottomLeftRadius'];
function calBorderRadius(w, h, currentStyle, computedStyle) {
  let noRadius = true;
  borderRadiusKs.forEach(k => {
    computedStyle[k] = currentStyle[k].map((item, i) => {
      if(item.value > 0) {
        noRadius = false;
      }
      else {
        return 0;
      }
      if(item.unit === PX) {
        return Math.max(0, item.value);
      }
      else {
        return Math.max(0, item.value * (i ? h : w) * 0.01);
      }
    });
  });
  // 优化提前跳出
  if(noRadius) {
    return;
  }
  // radius限制，相交的2个之和不能超过边长，如果2个都超过中点取中点，只有1个超过取交点，这包含了单个不能超过总长的逻辑
  borderRadiusKs.forEach((k, i) => {
    let j = i % 2 === 0 ? 0 : 1;
    let target = j ? h : w;
    let prev = computedStyle[k];
    let next = computedStyle[borderRadiusKs[(i + 1) % 4]];
    // 相加超过边长则是相交
    if(prev[j] + next[j] > target) {
      let half = target * 0.5;
      // 都超过一半中点取中点
      if(prev[j] >= half && next[j] >= half) {
        prev[j] = next[j] = half;
      }
      // 仅1个超过中点，因相交用总长减去另一方即可
      else if(prev[j] > half) {
        prev[j] = target - next[j];
      }
      else if(next[j] > half) {
        next[j] = target - prev[j];
      }
    }
  });
}

function calBackgroundSize(value, w, h) {
  let res = [];
  value.forEach((item, i) => {
    if(item.unit === PX) {
      res.push(item.value);
    }
    else if(item.unit === PERCENT) {
      res.push(item.value * (i ? h : w) * 0.01);
    }
    else if(item.unit === AUTO) {
      res.push(-1);
    }
    else if(item.unit === STRING) {
      res.push(item.value === 'contain' ? -2 : -3);
    }
  });
  return res;
}

function calBackgroundPosition(position, container, size) {
  if(position.unit === PX) {
    return position.value;
  }
  else if(position.unit === PERCENT) {
    return (container - size) * position.value * 0.01;
  }
  return 0;
}

class Xom extends Node {
  constructor(tagName, props = []) {
    super();
    // 构建工具中都是arr，手写可能出现hash情况
    if(Array.isArray(props)) {
      this.props = util.arr2hash(props);
      this.__props = props;
    }
    else {
      this.props = props;
      this.__props = util.hash2arr(props);
    }
    this.__tagName = tagName;
    this.__style = this.props.style || {}; // style被解析后的k-v形式
    this.__currentStyle = {}; // 动画过程中绘制一开始会merge动画样式
    this.__computedStyle = {}; // 类似getComputedStyle()将currentStyle计算好数值赋给
    this.__listener = {};
    this.__props.forEach(item => {
      let k = item[0];
      let v = item[1];
      if(/^on[a-zA-Z]/.test(k)) {
        k = k.slice(2).toLowerCase();
        let arr = this.__listener[k] = this.__listener[k] || [];
        if(arr.indexOf(v) === -1) {
          arr.push(v);
        }
      }
    });
    this.__animationList = [];
    this.__loadBgi = {
      // 刷新回调函数，用以destroy取消用
      cb: function() {
      },
    };
    this.__cacheStyle = {}; // 是否缓存重新计算computedStyle的样式key
  }

  // 获取margin/padding的实际值
  __mp(currentStyle, computedStyle, w) {
    [
      'Top',
      'Right',
      'Bottom',
      'Left',
    ].forEach(k => {
      let a = 'margin' + k;
      let b = 'padding' + k;
      computedStyle[a] = this.__mpWidth(currentStyle[a], w);
      computedStyle[b] = this.__mpWidth(currentStyle[b], w);
    });
  }

  __mpWidth(mp, w) {
    if(mp.unit === PX) {
      return mp.value;
    }
    else if(mp.unit === PERCENT) {
      return mp.value * w * 0.01;
    }
    return 0;
  }

  // absolute且无尺寸时，isVirtual标明先假布局一次计算尺寸
  __layout(data, isVirtual, fromAbs) {
    let { w } = data;
    let { isDestroyed, currentStyle, computedStyle } = this;
    let {
      display,
      width,
      position,
    } = currentStyle;
    if(isDestroyed || display === 'none') {
      computedStyle.width = computedStyle.height = 0;
      return;
    }
    // margin/padding在abs前已经计算过了，无需二次计算
    if(!fromAbs) {
      this.__mp(currentStyle, computedStyle, w);
    }
    if(width.unit !== AUTO) {
      switch(width.unit) {
        case PX:
          w = width.value;
          break;
        case PERCENT:
          w *= width.value * 0.01;
          break;
      }
    }
    this.__ox = this.__oy = 0;
    // 3种布局，默认block
    if(display === 'flex') {
      this.__layoutFlex(data, isVirtual);
    }
    else if(display === 'inline') {
      this.__layoutInline(data, isVirtual);
    }
    else {
      this.__layoutBlock(data, isVirtual);
    }
    // relative渲染时做偏移，百分比基于父元素，若父元素没有定高则为0
    if(position === 'relative') {
      let { top, right, bottom, left } = currentStyle;
      let { parent } = this;
      if(top.unit !== AUTO) {
        let n = calRelative(currentStyle, 'top', top, parent);
        this.__offsetY(n);
        computedStyle.top = n;
        computedStyle.bottom = 'auto';
      }
      else if(bottom.unit !== AUTO) {
        let n = calRelative(currentStyle, 'bottom', bottom, parent);
        this.__offsetY(-n);
        computedStyle.bottom = n;
        computedStyle.top = 'auto';
      }
      else {
        computedStyle.top = computedStyle.bottom = 'auto';
      }
      if(left.unit !== AUTO) {
        let n = calRelative(currentStyle, 'left', left, parent, true);
        this.__offsetX(n);
        computedStyle.left = n;
        computedStyle.right = 'auto';
      }
      else if(right.unit !== AUTO) {
        let n = calRelative(currentStyle, 'right', right, parent, true);
        this.__offsetX(-n);
        computedStyle.right = n;
        computedStyle.left = 'auto';
      }
      else {
        computedStyle.left = computedStyle.right = 'auto';
      }
    }
    else if(currentStyle.position !== 'absolute') {
      computedStyle.top = computedStyle.bottom = computedStyle.left = computedStyle.right = 'auto';
    }
    // 计算结果存入computedStyle
    computedStyle.width = this.width;
    computedStyle.height = this.height;
    // 设置缓存hash，render时计算
    this.__cacheStyle = {};
    this.__cacheProps = {};
    // 动态json引用时动画暂存，第一次布局时处理这些动画到root的animateController上
    let ar = this.__animateRecords;
    if(ar) {
      this.__animateRecords = null;
      let ac = this.root.animateController;
      ac.__records = ac.records.concat(ar);
    }
  }

  // 预先计算是否是固定宽高，布局点位和尺寸考虑margin/border/padding
  __preLayout(data) {
    let { x, y, w, h, w2, h2 } = data;
    this.__x = x;
    this.__y = y;
    let { currentStyle, computedStyle } = this;
    let {
      width,
      height,
    } = currentStyle;
    let {
      borderTopWidth,
      borderRightWidth,
      borderBottomWidth,
      borderLeftWidth,
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
      paddingTop,
      paddingRight,
      paddingBottom,
      paddingLeft,
    } = computedStyle;
    // 除了auto外都是固定宽高度
    let fixedWidth;
    let fixedHeight;
    // 绝对定位是left+right这种其实等于定义了width，但不能修改原始style，存入特殊变量标识
    if(w2 !== undefined) {
      fixedWidth = true;
      w = w2;
    }
    else if(width.unit !== AUTO) {
      fixedWidth = true;
      switch(width.unit) {
        case PX:
          w = width.value;
          break;
        case PERCENT:
          w *= width.value * 0.01;
          break;
      }
    }
    if(h2 !== undefined) {
      fixedHeight = true;
      h = h2;
    }
    else if(height.unit !== AUTO) {
      fixedHeight = true;
      switch(height.unit) {
        case PX:
          h = height.value;
          break;
        case PERCENT:
          h *= height.value * 0.01;
          break;
      }
    }
    // margin/padding/border影响x和y和尺寸
    x += borderLeftWidth + marginLeft + paddingLeft;
    data.x = x;
    y += borderTopWidth + marginTop + paddingTop;
    data.y = y;
    if(width.unit === AUTO) {
      w -= borderLeftWidth + borderRightWidth + marginLeft + marginRight + paddingLeft + paddingRight;
    }
    if(height.unit === AUTO) {
      h -= borderTopWidth + borderBottomWidth + marginTop + marginBottom + paddingTop + paddingBottom;
    }
    return {
      fixedWidth,
      fixedHeight,
      x,
      y,
      w,
      h,
    };
  }

  // 处理margin:xx auto居中对齐或右对齐
  __marginAuto(style, data) {
    let {
      position,
      marginLeft,
      marginRight,
      width,
    } = style;
    if(position !== 'absolute' && width !== AUTO && marginLeft.unit === AUTO && marginRight.unit === AUTO) {
      let ow = this.outerWidth;
      if(ow < data.w) {
        this.__offsetX((data.w - ow) * 0.5, true);
      }
    }
  }

  /**
   * 渲染基础方法，Dom/Geom公用
   * @param renderMode
   * @param ctx
   * @param defs
   */
  render(renderMode, ctx, defs) {
    if(renderMode === mode.SVG) {
      this.__virtualDom = {
        bb: [],
        children: [],
        opacity: 1,
      };
    }
    let {
      isDestroyed,
      currentStyle,
      computedStyle,
      width,
      height,
      innerWidth,
      innerHeight,
      outerWidth,
      outerHeight,
      __cacheStyle,
      parent,
    } = this;
    if(isDestroyed || computedStyle.display === 'none') {
      return;
    }
    // 使用sx和sy渲染位置，考虑了relative和translate影响
    let { sx: x, sy: y } = this;
    let {
      marginTop,
      marginLeft,
      paddingTop,
      paddingRight,
      paddingBottom,
      paddingLeft,
      borderLeftWidth,
      borderRightWidth,
      borderTopWidth,
      borderBottomWidth,
    } = computedStyle;
    let x1 = x + marginLeft;
    let x2 = x1 + borderLeftWidth;
    let x3 = x2 + width + paddingLeft + paddingRight;
    let x4 = x3 + borderRightWidth;
    let y1 = y + marginTop;
    let y2 = y1 + borderTopWidth;
    let y3 = y2 + height + paddingTop + paddingBottom;
    let y4 = y3 + borderBottomWidth;
    let {
      backgroundPositionX,
      backgroundPositionY,
    } = currentStyle;
    let matrixCache = __cacheStyle.matrix;
    // 先根据cache计算需要重新计算的computedStyle
    if(__cacheStyle.transformOrigin === undefined) {
      __cacheStyle.transformOrigin = true;
      matrixCache = false;
      computedStyle.transformOrigin = tf.calOrigin(currentStyle.transformOrigin, outerWidth, outerHeight);
    }
    if(__cacheStyle.transform === undefined
      || __cacheStyle.translateX === undefined
      || __cacheStyle.translateY === undefined
      || __cacheStyle.rotateZ === undefined
      || __cacheStyle.scaleX === undefined
      || __cacheStyle.scaleY === undefined
      || __cacheStyle.skewX === undefined
      || __cacheStyle.skewY === undefined) {
      __cacheStyle.transform
        = __cacheStyle.translateX
        = __cacheStyle.translateY
        = __cacheStyle.rotateZ
        = __cacheStyle.scaleX
        = __cacheStyle.scaleY
        = __cacheStyle.skewX
        = __cacheStyle.skewY
        = true;
      matrixCache = false;
      let matrix;
      // transform相对于自身
      if(currentStyle.transform) {
        matrix = tf.calMatrix(currentStyle.transform, outerWidth, outerHeight);
      }
      // 没有transform则看是否有扩展的css独立变换属性
      else {
        let temp = [];
        [
          'translateX',
          'translateY',
          'rotateZ',
          'rotate',
          'skewX',
          'skewY',
          'scaleX',
          'scaleY',
        ].forEach(k => {
          let v = currentStyle[k];
          if(util.isNil(v)) {
            return;
          }
          computedStyle[k] = v.value;
          // scale为1和其它为0避免计算浪费
          let isScale = k.indexOf('scale') > -1;
          if(v.value === 1 && isScale || !isScale && v.value === 0) {
            return;
          }
          if(v.unit === PERCENT) {
            if(k === 'translateX') {
              computedStyle[k] = v.value * outerWidth * 0.01;
            }
            else if(k === 'translateY') {
              computedStyle[k] = v.value * outerHeight * 0.01;
            }
          }
          temp.push([k, v]);
        });
        if(temp.length) {
          matrix = tf.calMatrix(temp, outerWidth, outerHeight);
        }
      }
      this.__matrix = computedStyle.transform = matrix || [1, 0, 0, 1, 0, 0];
    }
    if(__cacheStyle.backgroundPositionX === undefined) {
      __cacheStyle.backgroundPositionX = true;
      computedStyle.backgroundPositionX = backgroundPositionX.unit === PX
        ? backgroundPositionX.value : backgroundPositionX.value * innerWidth;
    }
    if(__cacheStyle.backgroundPositionY === undefined) {
      __cacheStyle.backgroundPositionY = true;
      computedStyle.backgroundPositionY = backgroundPositionY.unit === PX
        ? backgroundPositionY.value : backgroundPositionY.value * innerWidth;
    }
    if(__cacheStyle.backgroundSize === undefined) {
      __cacheStyle.backgroundSize = true;
      computedStyle.backgroundSize = calBackgroundSize(currentStyle.backgroundSize, innerWidth, innerHeight);
    }
    if(__cacheStyle.backgroundImage === undefined) {
      let backgroundImage = computedStyle.backgroundImage = currentStyle.backgroundImage;
      // 防止隐藏不加载背景图
      if(util.isString(backgroundImage)) {
        __cacheStyle.backgroundImage = true;
        let loadBgi = this.__loadBgi;
        let cache = inject.IMG[backgroundImage];
        if(cache && cache.state === inject.LOADED) {
          loadBgi.url = backgroundImage;
          loadBgi.source = cache.source;
          loadBgi.width = cache.width;
          loadBgi.height = cache.height;
        }
        if(loadBgi.url !== backgroundImage) {
          // 可能改变导致多次加载，每次清空，成功后还要比对url是否相同
          loadBgi.url = backgroundImage;
          loadBgi.source = null;
          inject.measureImg(backgroundImage, data => {
            // 还需判断url，防止重复加载时老的替换新的，失败不绘制bgi
            if(data.success && data.url === loadBgi.url && !this.__isDestroyed) {
              loadBgi.source = data.source;
              loadBgi.width = data.width;
              loadBgi.height = data.height;
              this.root.delRefreshTask(loadBgi.cb);
              this.root.addRefreshTask(loadBgi.cb);
            }
          }, {
            width: innerWidth,
            height: innerHeight,
          });
        }
      }
      else if(backgroundImage && backgroundImage.k) {
        __cacheStyle.backgroundImage = this.__gradient(renderMode, ctx, defs, x2, y2, x3, y3, innerWidth, innerHeight, backgroundImage);
      }
    }
    // 这些直接赋值的不需要再算缓存
    [
      'opacity',
      'zIndex',
      'borderTopStyle',
      'borderRightStyle',
      'borderBottomStyle',
      'borderLeftStyle',
      'backgroundRepeat',
      'filter',
    ].forEach(k => {
      computedStyle[k] = currentStyle[k];
    });
    [
      'backgroundColor',
      'borderTopColor',
      'borderRightColor',
      'borderBottomColor',
      'borderLeftColor',
    ].forEach(k => {
      if(__cacheStyle[k] === undefined) {
        __cacheStyle[k] = int2rgba(computedStyle[k] = currentStyle[k].value);
      }
    });
    // 强制计算继承性的
    if(parent) {
      let parentComputedStyle = parent.computedStyle;
      [
        'fontStyle',
        'color',
        'visibility'
      ].forEach(k => {
        if(currentStyle[k].unit === INHERIT) {
          computedStyle[k] = parentComputedStyle[k];
        }
        else {
          computedStyle[k] = currentStyle[k].value;
        }
        if(k === 'color') {
          __cacheStyle.color = int2rgba(computedStyle.color);
        }
      });
    }
    // root和component的根节点不能是inherit
    else {
      [
        'fontStyle',
        'color',
        'visibility'
      ].forEach(k => {
        if(currentStyle[k].unit !== INHERIT) {
          computedStyle[k] = currentStyle[k].value;
          if(k === 'color') {
            __cacheStyle.color = int2rgba(computedStyle.color)
          }
        }
      });
      if(currentStyle.fontStyle.unit === 4) {
        computedStyle.fontStyle = 'normal';
      }
      if(currentStyle.fontWeight.unit === 4) {
        computedStyle.fontWeight = 400;
      }
      if(currentStyle.color.unit === 4) {
        computedStyle.color = [0, 0, 0, 1];
        __cacheStyle.color = 'rgba(0,0,0,1)';
      }
      if(currentStyle.visibility.unit === 4) {
        computedStyle.visibility = 'visible';
      }
    }
    // 圆角边计算
    if(__cacheStyle.borderTopLeftRadius === undefined
      || __cacheStyle.borderTopRightRadius === undefined
      || __cacheStyle.borderBottomRightRadius === undefined
      || __cacheStyle.borderBottomLeftRadius === undefined) {
      __cacheStyle.borderTopLeftRadius
        = __cacheStyle.borderTopRightRadius
        = __cacheStyle.borderBottomRightRadius
        = __cacheStyle.borderBottomLeftRadius
        = true;
      calBorderRadius(outerWidth, outerHeight, currentStyle, computedStyle);
    }
    let {
      backgroundColor,
      borderTopColor,
      borderTopStyle,
      borderRightColor,
      borderRightStyle,
      borderBottomColor,
      borderBottomStyle,
      borderLeftColor,
      borderLeftStyle,
      borderTopLeftRadius,
      borderTopRightRadius,
      borderBottomRightRadius,
      borderBottomLeftRadius,
      visibility,
      backgroundRepeat,
      backgroundImage,
      opacity,
      filter,
      backgroundSize,
      transformOrigin,
      transform,
    } = computedStyle;
    // 先设置透明度，canvas可以向上累积
    if(renderMode === mode.CANVAS) {
      let p = parent || this.host && this.host.parent;
      if(p) {
        opacity *= p.__opacity;
      }
      this.__opacity = opacity;
      if(ctx.globalAlpha !== opacity) {
        ctx.globalAlpha = opacity;
      }
    }
    else {
      this.__virtualDom.opacity = opacity;
    }
    // 省略计算
    let matrix;
    if(matrixCache) {
      matrix = matrixCache;
    }
    else {
      let tfo = transformOrigin.slice(0);
      tfo[0] += x;
      tfo[1] += y;
      matrix = transform;
      matrix = __cacheStyle.matrix = tf.calMatrixByOrigin(matrix, tfo);
    }
    let renderMatrix = matrix;
    // 变换对事件影响，canvas要设置渲染
    if(parent) {
      if(equalArr(matrix, [1, 0, 0, 1, 0, 0])) {
        matrix = parent.matrixEvent;
      }
      else {
        matrix = mx.multiply(parent.matrixEvent, matrix);
      }
    }
    this.__matrixEvent = matrix;
    if(renderMode === mode.CANVAS) {
      ctx.setTransform(...matrix);
    }
    else if(renderMode === mode.SVG) {
      if(!equalArr(renderMatrix, [1, 0, 0, 1, 0, 0])) {
        this.virtualDom.transform = 'matrix(' + joinArr(renderMatrix, ',') + ')';
      }
    }
    // 隐藏不渲染，但要加载背景图
    if(visibility === 'hidden') {
      return;
    }
    // 背景色垫底
    if(backgroundColor[3] > 0) {
      renderBgc(renderMode, __cacheStyle.backgroundColor, x2, y2, innerWidth, innerHeight, ctx, this,
        borderTopWidth, borderRightWidth, borderBottomWidth, borderLeftWidth,
        borderTopLeftRadius, borderTopRightRadius, borderBottomRightRadius, borderBottomLeftRadius);
    }
    // 渐变或图片叠加
    if(backgroundImage) {
      if(util.isString(backgroundImage)) {
        let loadBgi = this.__loadBgi;
        if(loadBgi.url === backgroundImage) {
          let source = loadBgi.source;
          // 无source不绘制
          if(source) {
            let { width, height } = loadBgi;
            let [w, h] = backgroundSize;
            // -1为auto，-2为contain，-3为cover
            if(w === -1 && h === -1) {
              w = width;
              h = height;
            }
            else if(w === -2) {
              if(width > innerWidth && height > innerHeight) {
                w = width / innerWidth;
                h = height / innerHeight;
                if(w >= h) {
                  w = innerWidth;
                  h = w * height / width;
                }
                else {
                  h = innerHeight;
                  w = h * width / height;
                }
              }
              else if(width > innerWidth) {
                w = innerWidth;
                h = w * height / width;
              }
              else if(height > innerHeight) {
                h = innerHeight;
                w = h * width / height;
              }
              else {
                w = width;
                h = height;
              }
            }
            else if(w === -3) {
              if(innerWidth > width && innerHeight > height) {
                w = width / innerWidth;
                h = height / innerHeight;
                if(w <= h) {
                  w = innerWidth;
                  h = w * height / width;
                }
                else {
                  h = innerHeight;
                  w = h * width / height;
                }
              }
              else if(innerWidth > width) {
                w = innerWidth;
                h = w * height / width;
              }
              else if(innerHeight > height) {
                h = innerHeight;
                w = h * width / height;
              }
              else {
                w = width / innerWidth;
                h = height / innerHeight;
                if(w <= h) {
                  w = innerWidth;
                  h = w * height / width;
                }
                else {
                  h = innerHeight;
                  w = h * width / height;
                }
              }
            }
            else if(w === -1) {
              w = h * width / height;
            }
            else if(h === -1) {
              h = w * height / width;
            }
            let bgX = x2 + calBackgroundPosition(backgroundPositionX, innerWidth, w);
            let bgY = y2 + calBackgroundPosition(backgroundPositionY, innerHeight, h);
            // 超出尺寸模拟mask截取
            let needMask = bgX < x2 || bgY < y2 || w > innerWidth || h > innerHeight;
            // 计算因为repeat，需要向4个方向扩展渲染几个数量图片
            let xnl = 0;
            let xnr = 0;
            let ynt = 0;
            let ynb = 0;
            // repeat-x
            if(['repeat-x', 'repeat'].indexOf(backgroundRepeat) > -1) {
              let diff = bgX - x2;
              if(diff > 0) {
                xnl = Math.ceil(diff / w);
              }
              diff = x2 + innerWidth - bgX - w;
              if(diff > 0) {
                xnr = Math.ceil(diff / w);
              }
            }
            // repeat-y
            if(['repeat-y', 'repeat'].indexOf(backgroundRepeat) > -1) {
              let diff = bgY - y2;
              if(diff > 0) {
                ynt = Math.ceil(diff / h);
              }
              diff = y2 + innerHeight - bgY - h;
              if(diff > 0) {
                ynb = Math.ceil(diff / h);
              }
            }
            // 分同行列和4个角分别判断，先看同行同列，再看4个角的象限
            let repeat = [];
            if(xnl > 0) {
              for(let i = 0; i < xnl; i++) {
                let x = bgX - (i + 1) * w;
                repeat.push([x, bgY]);
                // 看最左边超过没有
                if(!needMask && i === 0 && x < x2) {
                  needMask = true;
                }
              }
            }
            if(xnr > 0) {
              for(let i = 0; i < xnr; i++) {
                let x = bgX + (i + 1) * w;
                repeat.push([x, bgY]);
                // 看最右边超过没有
                if(!needMask && i === xnr - 1 && x + w > x2 + innerWidth) {
                  needMask = true;
                }
              }
            }
            if(ynt > 0) {
              for(let i = 0; i < ynt; i++) {
                let y = bgY - (i + 1) * h;
                repeat.push([bgX, y]);
                // 看最上边超过没有
                if(!needMask && i === 0 && y < y2) {
                  needMask = true;
                }
              }
            }
            if(ynb > 0) {
              for(let i = 0; i < ynb; i++) {
                let y = bgY + (i + 1) * h;
                repeat.push([bgX, y]);
                // 看最下边超过没有
                if(!needMask && i === ynb - 1 && y + w > y2 + innerHeight) {
                  needMask = true;
                }
              }
            }
            // 原点和同行列十字画完，看4个角的情况
            if(xnl > 0 && ynt > 0) {
              for(let i = 0; i < xnl; i++) {
                for(let j = 0; j < ynt; j++) {
                  repeat.push([bgX - (i + 1) * w, bgY - (j + 1) * h]);
                }
              }
            }
            if(xnr > 0 && ynt > 0) {
              for(let i = 0; i < xnr; i++) {
                for(let j = 0; j < ynt; j++) {
                  repeat.push([bgX + (i + 1) * w, bgY - (j + 1) * h]);
                }
              }
            }
            if(xnl > 0 && ynb > 0) {
              for(let i = 0; i < xnl; i++) {
                for(let j = 0; j < ynb; j++) {
                  repeat.push([bgX - (i + 1) * w, bgY + (j + 1) * h]);
                }
              }
            }
            if(xnr > 0 && ynb > 0) {
              for(let i = 0; i < xnr; i++) {
                for(let j = 0; j < ynb; j++) {
                  repeat.push([bgX + (i + 1) * w, bgY + (j + 1) * h]);
                }
              }
            }
            if(renderMode === mode.CANVAS) {
              if(needMask) {
                ctx.save();
                renderBgc(renderMode, '#FFF', x2, y2, innerWidth, innerHeight, ctx, this,
                  borderTopWidth, borderRightWidth, borderBottomWidth, borderLeftWidth,
                  borderTopLeftRadius, borderTopRightRadius, borderBottomRightRadius, borderBottomLeftRadius, 'clip');
              }
              // 先画不考虑repeat的中心声明的
              ctx.drawImage(source, bgX, bgY, w, h);
              // 再画重复的十字和4角象限
              repeat.forEach(item => {
                ctx.drawImage(source, item[0], item[1], w, h);
              });
              if(needMask) {
                ctx.restore();
              }
            }
            else if(renderMode === mode.SVG) {
              let matrix = image.matrixResize(width, height, w, h, bgX, bgY, innerWidth, innerHeight);
              let props = [
                ['xlink:href', backgroundImage],
                ['x', bgX],
                ['y', bgY],
                ['width', width],
                ['height', height]
              ];
              let needResize;
              if(matrix && !equalArr(matrix, [1, 0, 0, 1, 0, 0])) {
                needResize = true;
                props.push(['transform', 'matrix(' + joinArr(matrix, ',') + ')']);
              }
              if(needMask) {
                let maskId = defs.add({
                  tagName: 'mask',
                  props: [],
                  children: [{
                    tagName: 'rect',
                    props: [
                      ['x', x2],
                      ['y', y2],
                      ['width', innerWidth],
                      ['height', innerHeight],
                      ['fill', '#FFF']
                    ],
                  }],
                });
                this.virtualDom.bbMask = 'url(#' + maskId + ')';
              }
              // 先画不考虑repeat的中心声明的
              this.virtualDom.bb.push({
                type: 'img',
                tagName: 'image',
                props,
              });
              // 再画重复的十字和4角象限
              repeat.forEach(item => {
                let copy = clone(props);
                if(needResize) {
                  let matrix = image.matrixResize(width, height, w, h, item[0], item[1], innerWidth, innerHeight);
                  if(matrix && !equalArr(matrix, [1, 0, 0, 1, 0, 0])) {
                    copy[5][1] = 'matrix(' + joinArr(matrix, ',') + ')';
                  }
                }
                copy[1][1] = item[0];
                copy[2][1] = item[1];
                this.virtualDom.bb.push({
                  type: 'img',
                  tagName: 'image',
                  props: copy,
                });
              });
            }
          }
        }
      }
      else if(backgroundImage.k) {
        renderBgc(renderMode, __cacheStyle.backgroundImage, x2, y2, innerWidth, innerHeight, ctx, this,
          borderTopWidth, borderRightWidth, borderBottomWidth, borderLeftWidth,
          borderTopLeftRadius, borderTopRightRadius, borderBottomRightRadius, borderBottomLeftRadius);
      }
    }
    // 边框需考虑尖角，两条相交边平分45°夹角
    if(borderTopWidth > 0 && borderTopColor[3] > 0) {
      let deg1 = Math.atan(borderTopWidth / borderLeftWidth);
      let deg2 = Math.atan(borderTopWidth / borderRightWidth);
      let points = border.calPoints(borderTopWidth, borderTopStyle, deg1, deg2,
        x1, x2, x3, x4, y1, y2, y3, y4, 0,
        borderTopLeftRadius, borderTopRightRadius);
      renderBorder(renderMode, points, __cacheStyle.borderTopColor, ctx, this);
    }
    if(borderRightWidth > 0 && borderRightColor[3] > 0) {
      let deg1 = Math.atan(borderRightWidth / borderTopWidth);
      let deg2 = Math.atan(borderRightWidth / borderBottomWidth);
      let points = border.calPoints(borderRightWidth, borderRightStyle, deg1, deg2,
        x1, x2, x3, x4, y1, y2, y3, y4, 1,
        borderTopRightRadius, borderBottomRightRadius);
      renderBorder(renderMode, points, __cacheStyle.borderRightColor, ctx, this);
    }
    if(borderBottomWidth > 0 && borderBottomColor[3] > 0) {
      let deg1 = Math.atan(borderBottomWidth / borderLeftWidth);
      let deg2 = Math.atan(borderBottomWidth / borderRightWidth);
      let points = border.calPoints(borderBottomWidth, borderBottomStyle, deg1, deg2,
        x1, x2, x3, x4, y1, y2, y3, y4, 2,
        borderBottomLeftRadius, borderBottomRightRadius);
      renderBorder(renderMode, points, __cacheStyle.borderBottomColor, ctx, this);
    }
    if(borderLeftWidth > 0 && borderLeftColor[3] > 0) {
      let deg1 = Math.atan(borderLeftWidth / borderTopWidth);
      let deg2 = Math.atan(borderLeftWidth / borderBottomWidth);
      let points = border.calPoints(borderLeftWidth, borderLeftStyle, deg1, deg2,
        x1, x2, x3, x4, y1, y2, y3, y4, 3,
        borderTopLeftRadius, borderBottomLeftRadius);
      renderBorder(renderMode, points, __cacheStyle.borderLeftColor, ctx, this);
    }
    if(filter) {
      filter.forEach(item => {
        let [k, v] = item;
        if(k === 'blur' && v > 0 && renderMode === mode.SVG) {
          // 模糊框卷积尺寸 #66
          let d = Math.floor(v * 3 * Math.sqrt(2 * Math.PI) / 4 + 0.5);
          d *= 3;
          if(d % 2 === 0) {
            d++;
          }
          let id = defs.add({
            tagName: 'filter',
            props: [
              ['x', -d / outerWidth],
              ['y', -d / outerHeight],
              ['width', 1 + d * 2 / outerWidth],
              ['height', 1 + d * 2 / outerHeight]
            ],
            children: [
              {
                tagName: 'feGaussianBlur',
                props: [
                  ['stdDeviation', v],
                ],
              }
            ],
          });
          this.virtualDom.filter = 'url(#' + id + ')';
        }
      });
    }
  }

  __renderByMask(renderMode, ctx, defs) {
    let { prev, root } = this;
    let hasMask = prev && prev.isMask;
    if(!hasMask) {
      this.render(renderMode, ctx, defs);
      return;
    }
    if(renderMode === mode.CANVAS) {
      // canvas借用2个离屏canvas来处理，c绘制本xom，m绘制多个mask
      let { width, height } = root;
      let c = inject.getCacheCanvas(width, height);
      this.render(renderMode, c.ctx);
      // 收集之前的mask列表
      let list = [];
      while(prev && prev.isMask) {
        list.unshift(prev);
        prev = prev.prev;
      }
      // 当mask只有1个时，无需生成m，直接在c上即可
      if(list.length === 1) {
        prev = list[0];
        c.ctx.globalCompositeOperation = 'destination-in';
        prev.render(renderMode, c.ctx);
        // 为小程序特殊提供的draw回调，每次绘制调用都在攒缓冲，drawImage另一个canvas时刷新缓冲，需在此时主动flush
        c.draw(c.ctx);
        ctx.drawImage(c.canvas, 0, 0);
        c.draw(ctx);
      }
      // 多个借用m绘制mask，用c结合mask获取结果，最终结果再到当前画布
      else {
        let m = inject.getMaskCanvas(width, height);
        list.forEach(item => {
          item.render(renderMode, m.ctx);
        });
        m.draw(m.ctx);
        c.ctx.globalCompositeOperation = 'destination-in';
        c.ctx.drawImage(m.canvas, 0, 0);
        c.draw(c.ctx);
        ctx.drawImage(c.canvas, 0, 0);
        c.draw(ctx);
        // 清除
        m.ctx.globalCompositeOperation = 'source-over';
        m.ctx.clearRect(0, 0, width, height);
        m.draw(m.ctx);
      }
      // 清除
      c.ctx.globalCompositeOperation = 'source-over';
      c.ctx.clearRect(0, 0, width, height);
      c.draw(c.ctx);
    }
    else if(renderMode === mode.SVG) {
      this.render(renderMode, ctx, defs);
      // 作为mask会在defs生成maskId供使用，多个连续mask共用一个id
      this.virtualDom.mask = prev.maskId;
    }
  }

  __destroy() {
    let ref = this.props.ref;
    if(ref) {
      let owner = this.host || this.root;
      if(owner && owner.ref[ref]) {
        delete owner.ref[ref];
      }
    }
    this.animationList.forEach(item => item.__destroy());
    this.root.delRefreshTask(this.__loadBgi.cb);
    this.root.delRefreshTask(this.__task);
    super.__destroy();
    this.__matrix = this.__matrixEvent = this.__root = null;
  }

  // 先查找到注册了事件的节点，再捕获冒泡判断增加性能
  __emitEvent(e, force) {
    let { isDestroyed, computedStyle } = this;
    if(isDestroyed || computedStyle.display === 'none' || e.__stopPropagation) {
      return;
    }
    let { event: { type } } = e;
    let { listener } = this;
    let cb;
    if(listener.hasOwnProperty(type)) {
      cb = listener[type];
    }
    // touchmove之类强制的直接由Root通知即可
    if(force) {
      e.target = this;
      if(cb) {
        cb.forEach(item => {
          if(util.isFunction(item) && !e.__stopImmediatePropagation) {
            item(e);
          }
        });
      }
      return true;
    }
    // 非force的判断事件坐标是否在节点内
    if(this.willResponseEvent(e)) {
      if(cb) {
        cb.forEach(item => {
          if(util.isFunction(item) && !e.__stopImmediatePropagation) {
            item(e);
          }
        });
      }
      return true;
    }
  }

  willResponseEvent(e) {
    let { x, y } = e;
    let { sx, sy, outerWidth, outerHeight, matrixEvent } = this;
    let inThis = tf.pointInQuadrilateral(x, y,
      sx, sy,
      sx + outerWidth, sy,
      sx + outerWidth, sy + outerHeight,
      sx, sy + outerHeight,
      matrixEvent);
    if(inThis) {
      if(!e.target) {
        e.target = this;
        // 缓存target给move用
        if(e.event.type === 'touchstart') {
          this.root.__touchstartTarget = this;
        }
      }
      return true;
    }
  }

  __gradient(renderMode, ctx, defs, x2, y2, x3, y3, iw, ih, vs) {
    let { k, v, d, s, z, p } = vs;
    let cx = x2 + iw * 0.5;
    let cy = y2 + ih * 0.5;
    let res;
    if(k === 'linear') {
      let gd = gradient.getLinear(v, d, cx, cy, iw, ih);
      res = this.__getLg(renderMode, ctx, defs, gd);
    }
    else if(k === 'radial') {
      let gd = gradient.getRadial(v, s, z, p, x2, y2, x3, y3);
      res = this.__getRg(renderMode, ctx, defs, gd);
    }
    return res;
  }

  __getLg(renderMode, ctx, defs, gd) {
    if(renderMode === mode.CANVAS) {
      let lg = ctx.createLinearGradient(gd.x1, gd.y1, gd.x2, gd.y2);
      gd.stop.forEach(item => {
        lg.addColorStop(item[1], item[0]);
      });
      return lg;
    }
    else if(renderMode === mode.SVG) {
      let uuid = defs.add({
        tagName: 'linearGradient',
        props: [
          ['x1', gd.x1],
          ['y1', gd.y1],
          ['x2', gd.x2],
          ['y2', gd.y2]
        ],
        children: gd.stop.map(item => {
          return {
            tagName: 'stop',
            props: [
              ['stop-color', item[0]],
              ['offset', item[1] * 100 + '%']
            ],
          };
        }),
      });
      return 'url(#' + uuid + ')';
    }
  }

  __getRg(renderMode, ctx, defs, gd) {
    if(renderMode === mode.CANVAS) {
      let rg = ctx.createRadialGradient(gd.cx, gd.cy, 0, gd.cx, gd.cy, gd.r);
      gd.stop.forEach(item => {
        rg.addColorStop(item[1], item[0]);
      });
      return rg;
    }
    else if(renderMode === mode.SVG) {
      let uuid = defs.add({
        tagName: 'radialGradient',
        props: [
          ['cx', gd.cx],
          ['cy', gd.cy],
          ['r', gd.r]
        ],
        children: gd.stop.map(item => {
          return {
            tagName: 'stop',
            props: [
              ['stop-color', item[0]],
              ['offset', item[1] * 100 + '%']
            ],
          };
        }),
      });
      return 'url(#' + uuid + ')';
    }
  }

  updateStyle(style, cb) {
    let { root, __style, __currentStyle, __cacheStyle } = this;
    if(root) {
      let lv = level.REPAINT;
      for(let i in style) {
        if(style.hasOwnProperty(i)) {
          // repaint置空，如果reflow会重新生成空的
          __cacheStyle[i] = undefined;
          if(rp.STYLE.hasOwnProperty(i)) {
            lv = level.REFLOW;
            break;
          }
        }
      }
      root.addRefreshTask(this.__task = {
        before() {
          let format = normalize(style);
          extend(__style, format);
          extend(__currentStyle, format);
          root.setRefreshLevel(lv);
        },
        after: cb,
      });
    }
  }

  animate(list, options, underControl) {
    if(this.isDestroyed) {
      return;
    }
    let animation = new Animation(this, list, options);
    this.animationList.push(animation);
    if(underControl) {
      this.root.animateController.add(animation);
    }
    if(options.hasOwnProperty('autoPlay') && !options.autoPlay) {
      return animation;
    }
    return animation.play();
  }

  removeAnimate(o) {
    if(o instanceof Animation) {
      let i = this.animationList.indexOf(o);
      if(i > -1) {
        o.cancel();
        o.__destroy();
        this.animationList.splice(i, 1);
      }
    }
  }

  clearAnimate() {
    this.animationList.splice(0).forEach(o => {
      o.cancel();
      o.__destroy();
    });
  }

  __init(root, host) {
    tool.init(this, root, host);
  }

  __measure(renderMode, ctx, isRoot) {
    compute(this, isRoot, this.currentStyle, this.computedStyle);
  }

  get tagName() {
    return this.__tagName;
  }

  get innerWidth() {
    let {
      computedStyle: {
        display,
        paddingRight,
        paddingLeft,
      }
    } = this;
    if(display === 'none') {
      return 0;
    }
    return this.width
      + paddingLeft
      + paddingRight;
  }

  get innerHeight() {
    let {
      computedStyle: {
        display,
        paddingTop,
        paddingBottom,
      }
    } = this;
    if(display === 'none') {
      return 0;
    }
    return this.height
      + paddingTop
      + paddingBottom;
  }

  get outerWidth() {
    let {
      computedStyle: {
        display,
        borderLeftWidth,
        borderRightWidth,
        marginRight,
        marginLeft,
      }
    } = this;
    if(display === 'none') {
      return 0;
    }
    return this.innerWidth
      + borderLeftWidth
      + borderRightWidth
      + marginLeft
      + marginRight;
  }

  get outerHeight() {
    let {
      computedStyle: {
        display,
        borderTopWidth,
        borderBottomWidth,
        marginTop,
        marginBottom,
      }
    } = this;
    if(display === 'none') {
      return 0;
    }
    return this.innerHeight
      + borderTopWidth
      + borderBottomWidth
      + marginTop
      + marginBottom;
  }

  get listener() {
    return this.__listener;
  }

  get matrix() {
    return this.__matrix;
  }

  get matrixEvent() {
    return this.__matrixEvent;
  }

  get style() {
    return this.__style;
  }

  get computedStyle() {
    return this.__computedStyle;
  }

  get animationList() {
    return this.__animationList;
  }

  get currentStyle() {
    return this.__currentStyle;
  }

}

export default Xom;
