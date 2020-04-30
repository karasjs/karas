import Node from './Node';
import Text from './Text';
import mode from '../util/mode';
import unit from '../style/unit';
import tf from '../style/transform';
import gradient from '../style/gradient';
import border from '../style/border';
import match from '../style/match';
import css from '../style/css';
import image from '../style/image';
import util from '../util/util';
import Component from './Component';
import Animation from '../animate/Animation';
import inject from '../util/inject';
import sort from '../util/sort';

const { AUTO, PX, PERCENT, STRING } = unit;
const { clone, int2rgba, equalArr } = util;
const { calRelative, compute, repaint } = css;

const INLINE = {
  'span': true,
  'img': true,
};

function renderBorder(renderMode, points, color, ctx, xom) {
  color = int2rgba(color);
  if(renderMode === mode.CANVAS) {
    points.forEach(point => {
      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.moveTo(point[0], point[1]);
      for(let i = 2, len = point.length; i < len; i += 2) {
        ctx.lineTo(point[i], point[i + 1]);
      }
      ctx.fill();
      ctx.closePath();
    });
  }
  else if(renderMode === mode.SVG) {
    let s = '';
    points.forEach(point => {
      s += `M ${point[0]} ${point[1]}`;
      for(let i = 2, len = point.length; i < len; i += 2) {
        s += `L ${point[i]} ${point[i + 1]} `;
      }
    });
    xom.virtualDom.bb.push({
      type: 'item',
      tagName: 'path',
      props: [
        ['d', s],
        ['fill', color],
      ],
    });
  }
}

function renderBgc(renderMode, color, x, y, w, h, ctx, xom, btlr, btrr, bbrr, bblr) {
  let list = border.calRadius(x, y, w, h, btlr, btrr, bbrr, bblr);
  let res = list ? border.genRdRect(renderMode, ctx, color, x, y, w, h, list) : null;
  if(renderMode === mode.CANVAS) {
    // border-radius使用三次贝塞尔曲线模拟1/4圆角，误差在[0, 0.000273]之间，canvas上面已经绘制
    if(!list) {
      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.rect(x, y, w, h);
      ctx.fill();
      ctx.closePath();
    }
  }
  else if(renderMode === mode.SVG) {
    // 没有圆角矩形res为空走入普通矩形
    xom.virtualDom.bb.push(res || {
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

function calBorderRadius(w, h, k, currentStyle, computedStyle) {
  let s = currentStyle[k];
  // 暂时只支持px，限制最大为窄边一半
  if(s.unit === PX) {
    let min = Math.min(w * 0.5, h * 0.5);
    computedStyle[k] = Math.min(min, s.value);
  }
}

function calBackgroundSize(value, x, y, w, h) {
  let res = [];
  value.forEach((item, i) => {
    if(item.unit === PX) {
      res.push(item.value);
    }
    else if(item.unit === PERCENT) {
      res.push((i ? y : x) + item.value * (i ? h : w) * 0.01);
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
  if(position.value === 'right' || position.value === 'bottom') {
    return container - size;
  }
  else if(position.value === 'center') {
    return (container - size) * 0.5;
  }
  else if(position.unit === PX) {
    return position.value;
  }
  else if(position.unit === PERCENT) {
    return (container - size) * position.value * 0.01;
  }
  return 0;
}

function isRelativeOrAbsolute(node) {
  return ['relative', 'absolute'].indexOf(node.computedStyle.position) > -1;
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
    // 引用如json时由于直接normalize处理style对象，需clone防止影响，比如再次渲染时style格式错误
    this.__style = clone(this.props.style) || {}; // style被解析后的k-v形式
    this.__currentStyle = this.__style; // 动画过程中绘制一开始会merge动画样式
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
      else if(k === 'id' && v) {
        this.__id = v;
      }
      else if(['class', 'className'].indexOf(k) > -1 && v) {
        v = match.splitClass(v);
        if(v) {
          this.__class = v;
        }
      }
    });
    this.__matrix = null;
    this.__matrixEvent = null;
    this.__animationList = [];
    this.__loadBgi = {
      // 刷新回调函数，用以destroy取消用
      cb: function() {
      },
    };
  }

  // 设置了css时，解析匹配
  __traverseCss(top, css) {
    if(!this.isGeom) {
      this.children.forEach(item => {
        if(item instanceof Xom || item instanceof Component) {
          item.__traverseCss(top, css);
        }
      });
    }
    // inline拥有最高优先级
    let style = match.parse(this, top, css) || {};
    Object.keys(style).forEach(i => {
      if(!this.__style.hasOwnProperty(i)) {
        this.__style[i] = style[i];
      }
    });
  }

  __init() {
    let ref = this.props.ref;
    if(ref) {
      let owner = this.host || this.root;
      if(owner) {
        owner.ref[ref] = this;
      }
    }
    let { style, parent } = this;
    // 仅支持flex/block/inline/none
    if(!style.display || !{
      flex: true,
      block: true,
      inline: true,
      none: true,
    }.hasOwnProperty(style.display)) {
      if(INLINE.hasOwnProperty(this.tagName)) {
        style.display = 'inline';
      }
      else {
        style.display = 'block';
      }
    }
    // absolute和flex孩子强制block
    if(parent && style.display === 'inline' && (style.position === 'absolute' || parent.style.display === 'flex')) {
      style.display = 'block';
    }
  }

  __measure() {
    if(!this.isGeom) {
      this.children.forEach(child => {
        child.__measure();
      });
    }
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

  // absolute且无尺寸时，fake标明先假布局一次计算尺寸
  __layout(data, isVirtual) {
    let { w } = data;
    let { isDestroyed, currentStyle, computedStyle } = this;
    let {
      display,
      width,
      position,
    } = currentStyle;
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
    this.__mp(currentStyle, computedStyle, w);
    this.__ox = this.__oy = 0;
    if(isDestroyed || display === 'none') {
      computedStyle.width = computedStyle.height = 0;
      return;
    }
    if(display === 'block') {
      this.__layoutBlock(data, isVirtual);
    }
    else if(display === 'flex') {
      this.__layoutFlex(data, isVirtual);
    }
    else if(display === 'inline') {
      this.__layoutInline(data, isVirtual);
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
    // 圆角边计算
    ['TopLeft', 'TopRight', 'BottomRight', 'BottomLeft'].forEach(k => {
      calBorderRadius(this.width, this.height, `border${k}Radius`, currentStyle, computedStyle);
    });
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
    let { x, y, w, h } = data;
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
    if(width.unit !== AUTO) {
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
    if(height.unit !== AUTO) {
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

  render(renderMode) {
    if(renderMode === mode.SVG) {
      this.__virtualDom = {
        bb: [],
        children: [],
        opacity: 1,
      };
    }
    let {
      isDestroyed,
      ctx,
      currentStyle,
      computedStyle,
      width,
      height,
      innerWidth,
      innerHeight,
      outerWidth,
      outerHeight,
    } = this;
    let {
      display,
      marginTop,
      marginLeft,
      paddingTop,
      paddingRight,
      paddingBottom,
      paddingLeft,
      backgroundColor,
      borderTopWidth,
      borderTopColor,
      borderTopStyle,
      borderRightWidth,
      borderRightColor,
      borderRightStyle,
      borderBottomWidth,
      borderBottomColor,
      borderBottomStyle,
      borderLeftWidth,
      borderLeftColor,
      borderLeftStyle,
      borderTopLeftRadius,
      borderTopRightRadius,
      borderBottomRightRadius,
      borderBottomLeftRadius,
      visibility,
      backgroundRepeat,
      opacity,
    } = computedStyle;
    let {
      backgroundImage,
      backgroundSize,
      backgroundPositionX,
      backgroundPositionY,
      transform,
      transformOrigin,
    } = currentStyle;
    // 使用sx和sy渲染位置，考虑了relative和translate影响
    let { sx: x, sy: y } = this;
    let x1 = x + marginLeft;
    let x2 = x1 + borderLeftWidth;
    let x3 = x2 + width + paddingLeft + paddingRight;
    let x4 = x3 + borderRightWidth;
    let y1 = y + marginTop;
    let y2 = y1 + borderTopWidth;
    let y3 = y2 + height + paddingTop + paddingBottom;
    let y4 = y3 + borderBottomWidth;
    // 先设置透明度，可以向上累积
    let parent = this.parent;
    let opa = opacity;
    while(parent) {
      opa *= parent.computedStyle.opacity;
      parent = parent.parent;
    }
    if(renderMode === mode.CANVAS) {
      ctx.globalAlpha = opa;
    }
    else {
      this.__virtualDom.opacity = opacity;
    }
    // transform和transformOrigin相关
    let tfo = tf.calOrigin(transformOrigin, x, y, outerWidth, outerHeight);
    computedStyle.transformOrigin = tfo.join(' ');
    // canvas继承祖先matrix，没有则恢复默认，防止其它matrix影响；svg则要考虑事件
    let matrix = [1, 0, 0, 1, 0, 0];
    this.__matrix = matrix;
    if(isDestroyed || display === 'none') {
      return;
    }
    parent = this.parent;
    // transform相对于自身
    if(transform) {
      matrix = tf.calMatrix(transform, tfo, outerWidth, outerHeight);
      this.__matrix = matrix;
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
        matrix = tf.calMatrix(temp, tfo, outerWidth, outerHeight);
        this.__matrix = matrix;
      }
    }
    computedStyle.transform = 'matrix(' + matrix.join(', ') + ')';
    // 变换对事件影响，canvas要设置渲染
    while(parent) {
      if(parent.matrixEvent) {
        matrix = tf.mergeMatrix(parent.matrixEvent, matrix);
        break;
      }
      parent = parent.parent;
    }
    this.__matrixEvent = matrix;
    if(renderMode === mode.CANVAS) {
      ctx.setTransform(...matrix);
    }
    else if(renderMode === mode.SVG) {
      if(!equalArr(this.matrix, [1, 0, 0, 1, 0, 0])) {
        this.virtualDom.transform = `matrix(${this.matrix.join(',')})`;
      }
    }
    // 隐藏不渲染
    if(visibility === 'hidden') {
      return;
    }
    // 背景色垫底
    if(!/,0\)$/.test(backgroundColor)) {
      renderBgc(renderMode, backgroundColor, x2, y2, innerWidth, innerHeight, ctx, this,
        borderTopLeftRadius, borderTopRightRadius, borderBottomRightRadius, borderBottomLeftRadius);
    }
    // 渐变或图片叠加
    if(backgroundImage) {
      let loadBgi = this.__loadBgi;
      if(util.isString(backgroundImage)) {
        if(loadBgi.url === backgroundImage) {
          backgroundSize = calBackgroundSize(backgroundSize, x2, y2, innerWidth, innerHeight);
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
          let bgX = calBackgroundPosition(backgroundPositionX, innerWidth, width);
          let bgY = calBackgroundPosition(backgroundPositionY, innerHeight, height);
          let originX = x2 + bgX;
          let originY = y2 + bgY;
          // 计算因为repeat，需要向4个方向扩展渲染几个数量图片
          let xnl = 0;
          let xnr = 0;
          let ynt = 0;
          let ynb = 0;
          // repeat-x
          if(['repeat-x', 'repeat'].indexOf(backgroundRepeat) > -1) {
            let diff = originX - x2;
            if(diff > 0) {
              xnl = Math.ceil(diff / w);
            }
            diff = x2 + innerWidth - originX - w;
            if(diff > 0) {
              xnr = Math.ceil(diff / w);
            }
          }
          // repeat-y
          if(['repeat-y', 'repeat'].indexOf(backgroundRepeat) > -1) {
            let diff = originY - y2;
            if(diff > 0) {
              ynt = Math.ceil(diff / h);
            }
            diff = y2 + innerHeight - originY - h;
            if(diff > 0) {
              ynb = Math.ceil(diff / h);
            }
          }
          // 分同行列和4个角分别判断，先看同行同列，再看4个角的象限
          let repeat = [];
          if(xnl > 0) {
            for(let i = 0; i < xnl; i++) {
              repeat.push([originX - (i + 1) * w, originY]);
            }
          }
          if(xnr > 0) {
            for(let i = 0; i < xnr; i++) {
              repeat.push([originX + (i + 1) * w, originY]);
            }
          }
          if(ynt > 0) {
            for(let i = 0; i < ynt; i++) {
              repeat.push([originX, originY - (i + 1) * h]);
            }
          }
          if(ynb > 0) {
            for(let i = 0; i < ynb; i++) {
              repeat.push([originX, originY + (i + 1) * h]);
            }
          }
          // 原点和同行列十字画完，看4个角的情况
          if(xnl > 0 && ynt > 0) {
            for(let i = 0; i < xnl; i++) {
              for(let j = 0; j < ynt; j++) {
                repeat.push([originX - (i + 1) * w, originY - (j + 1) * h]);
              }
            }
          }
          if(xnr > 0 && ynt > 0) {
            for(let i = 0; i < xnr; i++) {
              for(let j = 0; j < ynt; j++) {
                repeat.push([originX + (i + 1) * w, originY - (j + 1) * h]);
              }
            }
          }
          if(xnl > 0 && ynb > 0) {
            for(let i = 0; i < xnl; i++) {
              for(let j = 0; j < ynb; j++) {
                repeat.push([originX - (i + 1) * w, originY + (j + 1) * h]);
              }
            }
          }
          if(xnr > 0 && ynb > 0) {
            for(let i = 0; i < xnr; i++) {
              for(let j = 0; j < ynb; j++) {
                repeat.push([originX + (i + 1) * w, originY + (j + 1) * h]);
              }
            }
          }
          // 超出尺寸模拟mask截取
          let needMask = ['repeat-x', 'repeat-y', 'repeat'].indexOf(backgroundRepeat) > -1
            || originX < x2 || originY < y2 || w > innerWidth || h > innerHeight;
          let source = loadBgi.source;
          if(renderMode === mode.CANVAS && source) {
            let c;
            let currentCtx;
            // 在离屏canvas上绘制
            if(needMask) {
              let { width, height } = this.root;
              c = inject.getCacheCanvas(width, height);
              currentCtx = c.ctx;
            }
            else {
              currentCtx = ctx;
            }
            // 先画不考虑repeat的中心声明的
            currentCtx.drawImage(source, originX, originY, w, h);
            // 再画重复的十字和4角象限
            repeat.forEach(item => {
              currentCtx.drawImage(source, item[0], item[1], w, h);
            });
            // mask特殊处理画回来
            if(needMask) {
              currentCtx.globalCompositeOperation = 'destination-in';
              renderBgc(renderMode, '#FFF', x2, y2, innerWidth, innerHeight, currentCtx, this,
                borderTopLeftRadius, borderTopRightRadius, borderBottomRightRadius, borderBottomLeftRadius);
              ctx.drawImage(c.canvas, 0, 0);
              currentCtx.globalCompositeOperation = 'source-over';
              currentCtx.clearRect(0, 0, width, height);
            }
          }
          else if(renderMode === mode.SVG) {
            let matrix = image.matrixResize(width, height, w, h, x2, y2, innerWidth, innerHeight);
            if(matrix) {
              matrix = matrix.join(',');
            }
            let props = [
              ['xlink:href', backgroundImage],
              ['x', originX],
              ['y', originY],
              ['width', width || 0],
              ['height', height || 0]
            ];
            let needResize;
            if(matrix && matrix !== '1,0,0,1,0,0') {
              needResize = true;
              props.push(['transform', 'matrix(' + matrix + ')']);
            }
            if(needMask) {
              let maskId = this.defs.add({
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
              this.virtualDom.bbMask = `url(#${maskId})`;
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
                if(matrix && matrix !== '1,0,0,1,0,0') {
                  matrix = matrix.join(',');
                  copy[5][1] = 'matrix(' + matrix + ')';
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
          computedStyle.backgroundSize = `${w} ${h}`;
          computedStyle.backgroundPositionX = bgX;
          computedStyle.backgroundPositionY = bgY;
        }
        else {
          loadBgi.url = backgroundImage;
          inject.measureImg(backgroundImage, data => {
            if(data.success) {
              loadBgi.source = data.source;
              loadBgi.width = data.width;
              loadBgi.height = data.height;
              this.root.delRefreshTask(loadBgi.cb);
              this.root.addRefreshTask(loadBgi.cb);
            }
          });
        }
      }
      else if(backgroundImage.k) {
        let bgi = this.__gradient(renderMode, x2, y2, x3, y3, innerWidth, innerHeight, 'backgroundImage', backgroundImage, computedStyle);
        renderBgc(renderMode, bgi, x2, y2, innerWidth, innerHeight, ctx, this);
      }
    }
    else {
      let originX = x2 + calBackgroundPosition(backgroundPositionX, innerWidth, 0);
      let originY = y2 + calBackgroundPosition(backgroundPositionY, innerHeight, 0);
      computedStyle.backgroundSize = calBackgroundSize(backgroundSize, x2, y2, innerWidth, innerHeight).join(' ');
      computedStyle.backgroundPositionX = originX;
      computedStyle.backgroundPositionY = originY;
      computedStyle.backgroundRepeat = backgroundRepeat;
    }
    // 边框需考虑尖角，两条相交边平分45°夹角
    if(borderTopWidth > 0 && !/,0\)$/.test(borderTopColor)) {
      let deg1 = Math.atan(borderTopWidth / borderLeftWidth);
      let deg2 = Math.atan(borderTopWidth / borderRightWidth);
      let points = border.calPoints(borderTopWidth, borderTopStyle, deg1, deg2, x1, x2, x3, x4, y1, y2, y3, y4, 0);
      renderBorder(renderMode, points, borderTopColor, ctx, this);
    }
    if(borderRightWidth > 0 && !/,0\)$/.test(borderRightColor)) {
      let deg1 = Math.atan(borderRightWidth / borderTopWidth);
      let deg2 = Math.atan(borderRightWidth / borderBottomWidth);
      let points = border.calPoints(borderRightWidth, borderRightStyle, deg1, deg2, x1, x2, x3, x4, y1, y2, y3, y4, 1);
      renderBorder(renderMode, points, borderRightColor, ctx, this);
    }
    if(borderBottomWidth > 0 && !/,0\)$/.test(borderBottomColor)) {
      let deg1 = Math.atan(borderBottomWidth / borderLeftWidth);
      let deg2 = Math.atan(borderBottomWidth / borderRightWidth);
      let points = border.calPoints(borderBottomWidth, borderBottomStyle, deg1, deg2, x1, x2, x3, x4, y1, y2, y3, y4, 2);
      renderBorder(renderMode, points, borderBottomColor, ctx, this);
    }
    if(borderLeftWidth > 0 && !/,0\)$/.test(borderLeftColor)) {
      let deg1 = Math.atan(borderLeftWidth / borderTopWidth);
      let deg2 = Math.atan(borderLeftWidth / borderBottomWidth);
      let points = border.calPoints(borderLeftWidth, borderLeftStyle, deg1, deg2, x1, x2, x3, x4, y1, y2, y3, y4, 3);
      renderBorder(renderMode, points, borderLeftColor, ctx, this);
    }
  }

  __renderByMask(renderMode) {
    let { prev, root, ctx } = this;
    let hasMask = prev && prev.isMask;
    if(!hasMask) {
      this.render(renderMode);
      return;
    }
    if(renderMode === mode.CANVAS) {
      // canvas借用2个离屏canvas来处理，c绘制本xom，m绘制多个mask
      let { width, height } = root;
      let c = inject.getCacheCanvas(width, height);
      this.__setCtx(c.ctx);
      this.render(renderMode);
      this.__setCtx(ctx);
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
        prev.__setCtx(c.ctx);
        prev.render(renderMode);
        // 为小程序特殊提供的draw回调，每次绘制调用都在攒缓冲，drawImage另一个canvas时刷新缓冲，需在此时主动flush
        c.draw(c.ctx);
        prev.__setCtx(ctx);
        ctx.drawImage(c.canvas, 0, 0);
        c.draw(ctx);
      }
      // 多个借用m绘制mask，用c结合mask获取结果，最终结果再到当前画布
      else {
        let m = inject.getMaskCanvas(width, height);
        list.forEach(item => {
          item.__setCtx(m.ctx);
          item.render(renderMode);
          item.__setCtx(ctx);
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
      this.render(renderMode);
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
    super.__destroy();
    this.__matrix = this.__matrixEvent = null;
  }

  // 先查找到注册了事件的节点，再捕获冒泡判断增加性能
  __emitEvent(e, force) {
    let { event: { type } } = e;
    let { isDestroyed, listener, children, computedStyle } = this;
    if(isDestroyed || computedStyle.display === 'none' || e.__stopPropagation) {
      return;
    }
    let cb;
    if(listener.hasOwnProperty(type)) {
      cb = listener[type];
    }
    let childWillResponse;
    let zIndex = this.zIndexChildren;
    // touchmove之类强制的直接通知即可
    if(force) {
      if(!this.isGeom) {
        // 先响应absolute/relative高优先级，综合zIndex和从后往前遮挡顺序
        for(let i = zIndex.length - 1; i >= 0; i--) {
          let child = zIndex[i];
          if(child instanceof Xom && isRelativeOrAbsolute(child)
            || child instanceof Component && child.shadowRoot instanceof Xom && isRelativeOrAbsolute(child.shadowRoot)) {
            if(child.__emitEvent(e, force)) {
              childWillResponse = true;
            }
          }
        }
        // 再看普通流，从后往前遮挡顺序
        if(!childWillResponse) {
          for(let i = children.length - 1; i >= 0; i--) {
            let child = children[i];
            if(child instanceof Xom && !isRelativeOrAbsolute(child)
              || child instanceof Component && child.shadowRoot instanceof Xom && !isRelativeOrAbsolute(child.shadowRoot)) {
              if(child.__emitEvent(e, force)) {
                childWillResponse = true;
              }
            }
          }
        }
      }
      // touchmove之类也需要考虑target是否是自己以及孩子
      if(!childWillResponse && this.root.__touchstartTarget !== this) {
        return;
      }
      if(e.__stopPropagation) {
        return;
      }
      if(['touchmove', 'touchend', 'touchcancel'].indexOf(type) > -1) {
        e.target = this.root.__touchstartTarget;
      }
      if(cb) {
        cb.forEach(item => {
          if(e.__stopImmediatePropagation) {
            return;
          }
          item(e);
        });
      }
      return true;
    }
    if(!this.isGeom) {
      // 先响应absolute/relative高优先级，从后往前遮挡顺序
      for(let i = zIndex.length - 1; i >= 0; i--) {
        let child = zIndex[i];
        if(child instanceof Xom && isRelativeOrAbsolute(child)
          || child instanceof Component && child.shadowRoot instanceof Xom && isRelativeOrAbsolute(child.shadowRoot)) {
          if(child.__emitEvent(e)) {
            childWillResponse = true;
          }
        }
      }
      // 再看普通流，从后往前遮挡顺序
      if(!childWillResponse) {
        for(let i = children.length - 1; i >= 0; i--) {
          let child = children[i];
          if(child instanceof Xom && !isRelativeOrAbsolute(child)
            || child instanceof Component && child.shadowRoot instanceof Xom && !isRelativeOrAbsolute(child.shadowRoot)) {
            if(child.__emitEvent(e)) {
              childWillResponse = true;
            }
          }
        }
      }
    }
    if(e.__stopPropagation) {
      return;
    }
    // child触发则parent一定触发，否则判断事件坐标是否在节点内且未被遮挡
    if(childWillResponse || this.willResponseEvent(e)) {
      e.__hasEmitted = true;
      if(cb) {
        cb.forEach(item => {
          if(e.__stopImmediatePropagation) {
            return;
          }
          if(util.isFunction(item)) {
            item(e);
          }
        });
      }
      return true;
    }
  }

  willResponseEvent(e) {
    let { x, y, __hasEmitted } = e;
    if(__hasEmitted) {
      return;
    }
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

  __gradient(renderMode, x2, y2, x3, y3, iw, ih, ks, vs, computedStyle) {
    let { k, v, d } = vs;
    computedStyle[ks] = k + '-gradient(';
    let cx = x2 + iw * 0.5;
    let cy = y2 + ih * 0.5;
    let res;
    if(k === 'linear') {
      let gd = gradient.getLinear(v, d, cx, cy, iw, ih);
      res = this.__getLg(renderMode, gd);
      computedStyle[ks] += d + 'deg';
    }
    else if(k === 'radial') {
      let gd = gradient.getRadial(v, d, cx, cy, x2, y2, x3, y3);
      res = this.__getRg(renderMode, gd);
      computedStyle[ks] += d;
    }
    v.forEach(item => {
      computedStyle[ks] += ', ' + int2rgba(item[0]);
      if(item[1]) {
        computedStyle[ks] += ' ' + item[1].str;
      }
    });
    computedStyle[ks] += ')';
    return res;
  }

  __getLg(renderMode, gd) {
    if(renderMode === mode.CANVAS) {
      let lg = this.ctx.createLinearGradient(gd.x1, gd.y1, gd.x2, gd.y2);
      gd.stop.forEach(item => {
        lg.addColorStop(item[1], item[0]);
      });
      return lg;
    }
    else if(renderMode === mode.SVG) {
      let uuid = this.defs.add({
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
      return `url(#${uuid})`;
    }
  }

  __getRg(renderMode, gd) {
    if(renderMode === mode.CANVAS) {
      let rg = this.ctx.createRadialGradient(gd.cx, gd.cy, 0, gd.cx, gd.cy, gd.r);
      gd.stop.forEach(item => {
        rg.addColorStop(item[1], item[0]);
      });
      return rg;
    }
    else if(renderMode === mode.SVG) {
      let uuid = this.defs.add({
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
      return `url(#${uuid})`;
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

  __computed() {
    compute(this, this.isRoot);
    // 即便自己不需要计算，但children还要继续递归检查
    if(!this.isGeom) {
      this.children.forEach(item => {
        if(item instanceof Xom || item instanceof Component) {
          item.__computed();
        }
        else {
          item.__style = this.currentStyle;
          compute(item);
          // 文字首先测量所有字符宽度
          item.__measure();
        }
      });
    }
  }

  __repaint() {
    repaint(this, this.isRoot);
    // 即便自己不需要计算，但children还要继续递归检查
    if(!this.isGeom) {
      this.children.forEach(item => {
        if(item instanceof Xom || item instanceof Component) {
          item.__repaint();
        }
        else {
          item.__style = this.currentStyle;
          repaint(item);
        }
      });
    }
  }

  __setCtx(ctx) {
    super.__setCtx(ctx);
    if(!this.isGeom) {
      this.children.forEach(item => {
        item.__setCtx(ctx);
      });
    }
  }

  get tagName() {
    return this.__tagName;
  }

  get isRoot() {
    return !this.parent;
  }

  get isGeom() {
    return this.tagName.charAt(0) === '$';
  }

  get innerWidth() {
    let {
      computedStyle: {
        paddingRight,
        paddingLeft,
      }
    } = this;
    return this.width
      + paddingLeft
      + paddingRight;
  }

  get innerHeight() {
    let {
      computedStyle: {
        paddingTop,
        paddingBottom,
      }
    } = this;
    return this.height
      + paddingTop
      + paddingBottom;
  }

  get outerWidth() {
    let {
      computedStyle: {
        borderLeftWidth,
        borderRightWidth,
        marginRight,
        marginLeft,
      }
    } = this;
    return this.innerWidth
      + borderLeftWidth
      + borderRightWidth
      + marginLeft
      + marginRight;
  }

  get outerHeight() {
    let {
      computedStyle: {
        borderTopWidth,
        borderBottomWidth,
        marginTop,
        marginBottom,
      }
    } = this;
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

  get id() {
    return this.__id;
  }

  get class() {
    return this.__class || [];
  }

  get animationList() {
    return this.__animationList;
  }

  get animating() {
    let { animationList } = this;
    for(let i = 0, len = animationList.length; i < len; i++) {
      let item = animationList[i];
      if(item.animating) {
        return true;
      }
    }
    return false;
  }

  get animateStyle() {
    let { style, animationList } = this;
    let copy = clone(style);
    animationList.forEach(item => {
      if(item.animating) {
        Object.assign(copy, item.style);
      }
    });
    return copy;
  }

  get currentStyle() {
    return this.__currentStyle;
  }

  get zIndexChildren() {
    if(this.isGeom) {
      return [];
    }
    let zIndex = (this.children || []).filter(item => {
      return !item.isMask;
    });
    sort(zIndex, (a, b) => {
      if(a instanceof Text) {
        return;
      }
      if(b instanceof Text && isRelativeOrAbsolute(a)) {
        return true;
      }
      if(a.computedStyle.zIndex > b.computedStyle.zIndex) {
        if(isRelativeOrAbsolute(a) && isRelativeOrAbsolute(b)) {
          return true;
        }
      }
      if(b.computedStyle.position === 'static' && isRelativeOrAbsolute(a)) {
        return true;
      }
    });
    return zIndex;
  }
}

export default Xom;
