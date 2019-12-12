import Node from './Node';
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

function renderBorder(renderMode, points, color, ctx, xom) {
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
    let item = {
      type: 'item',
      tagName: 'path',
      props: [
        ['d', s],
        ['fill', color],
      ],
    };
    xom.addBorder([
      ['d', s],
      ['fill', color],
    ]);
  }
}

function renderBgc(renderMode, value, x, y, w, h, ctx, xom) {
  if(renderMode === mode.CANVAS) {
    ctx.beginPath();
    ctx.fillStyle = value;
    ctx.rect(x, y, w, h);
    ctx.fill();
    ctx.closePath();
  }
  else if(renderMode === mode.SVG) {
    xom.addBackground([
      ['x', x],
      ['y', y],
      ['width', w],
      ['height', h],
      ['fill', value]
    ]);
  }
}

function calBackgroundSize(value, x, y, w, h) {
  let res = [];
  value.forEach((item, i) => {
    if(item.unit === unit.PX) {
      res.push(item.value);
    }
    else if(item.unit === unit.PERCENT) {
      res.push((i ? y : x) + item.value * (i ? h : w) * 0.01);
    }
    else if(item.unit === unit.AUTO) {
      res.push(-1);
    }
    else if(item.unit === unit.SIZE) {
      res.push(item.value === 'contain' ? -2 : -3);
    }
    else if(item.unit === unit.POSITION) {
      res.push(item.value);
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
  else if(position.unit === unit.PX) {
    return position.value;
  }
  else if(position.unit === unit.PERCENT) {
    return (container - size) * position.value * 0.01;
  }
  return 0;
}

class Xom extends Node {
  constructor(tagName, props) {
    super();
    props = props || [];
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
    this.__animateStyle = {}; // 动画过程中的样式
    this.__listener = {};
    this.__props.forEach(item => {
      let k = item[0];
      let v = item[1];
      if(/^on[a-zA-Z]/.test(k)) {
        k = k.slice(2).toLowerCase();
        let arr = this.__listener[k] = this.__listener[k] || [];
        arr.push(v);
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
    this.__loadBgi = {};
  }

  // 设置了css时，解析匹配
  __traverseCss(top, css) {
    if(!this.isGeom()) {
      this.children.forEach(item => {
        if(item instanceof Xom || item instanceof Component) {
          item.__traverseCss(top, css);
        }
      });
    }
    // inline拥有最高优先级
    let style = match.parse(this, top, css) || {};
    for(let i in style) {
      if(style.hasOwnProperty(i) && !this.__style.hasOwnProperty(i)) {
        this.__style[i] = style[i];
      }
    }
  }

  __measure() {
    let { children } = this;
    if(children) {
      children.forEach(child => {
        if(child instanceof Xom) {
          child.__measure();
        }
        else if(child instanceof Component) {
          child.shadowRoot.__measure();
        }
        else {
          child.__measure();
        }
      });
    }
  }

  // 获取margin/padding的实际值
  __mp(currentStyle, computedStyle, w) {
    let {
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
      paddingTop,
      paddingRight,
      paddingBottom,
      paddingLeft,
    } = currentStyle;
    computedStyle.marginLeft = this.__mpWidth(marginLeft, w);
    computedStyle.marginTop = this.__mpWidth(marginTop, w);
    computedStyle.marginRight = this.__mpWidth(marginRight, w);
    computedStyle.marginBottom = this.__mpWidth(marginBottom, w);
    computedStyle.paddingLeft = this.__mpWidth(paddingLeft, w);
    computedStyle.paddingTop = this.__mpWidth(paddingTop, w);
    computedStyle.paddingRight = this.__mpWidth(paddingRight, w);
    computedStyle.paddingBottom = this.__mpWidth(paddingBottom, w);
  }

  __mpWidth(mp, w) {
    if(mp.unit === unit.PX) {
      return mp.value;
    }
    else if(mp.unit === unit.PERCENT) {
      return mp.value * w * 0.01;
    }
    return 0;
  }

  // absolute且无尺寸时，fake标明先假布局一次计算尺寸
  __layout(data, fake) {
    let { w } = data;
    let { isDestroyed, currentStyle, computedStyle } = this;
    let {
      display,
      width,
    } = currentStyle;
    if(width.unit !== unit.AUTO) {
      switch(width.unit) {
        case unit.PX:
          w = width.value;
          break;
        case unit.PERCENT:
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
      this.__layoutBlock(data, fake);
    }
    else if(display === 'flex') {
      this.__layoutFlex(data, fake);
    }
    else if(display === 'inline') {
      this.__layoutInline(data, fake);
    }
    // 除root节点外relative渲染时做偏移，百分比基于父元素，若父元素没有定高则为0
    if(currentStyle.position === 'relative' && this.parent) {
      let { top, right, bottom, left } = currentStyle;
      let { parent } = this;
      if(top.unit !== unit.AUTO) {
        let n = css.calRelative(currentStyle, 'top', top, parent);
        this.__offsetY(n);
        computedStyle.top = n;
        computedStyle.bottom = 'auto';
      }
      else if(bottom.unit !== unit.AUTO) {
        let n = css.calRelative(currentStyle, 'bottom', bottom, parent);
        this.__offsetY(-n);
        computedStyle.bottom = n;
        computedStyle.top = 'auto';
      }
      else {
        computedStyle.top = computedStyle.bottom = 'auto';
      }
      if(left.unit !== unit.AUTO) {
        let n = css.calRelative(currentStyle, 'left', left, parent, true);
        this.__offsetX(n);
        computedStyle.left = n;
        computedStyle.right = 'auto';
      }
      else if(right.unit !== unit.AUTO) {
        let n = css.calRelative(currentStyle, 'right', right, parent, true);
        this.__offsetX(-n);
        computedStyle.right = n;
        computedStyle.left = 'auto';
      }
      else {
        computedStyle.left = computedStyle.right = 'auto';
      }
    }
    // 计算结果存入computedStyle
    computedStyle.width = this.width;
    computedStyle.height = this.height;
  }

  isGeom() {
    return this.tagName.charAt(0) === '$';
  }

  isRoot() {
    return !this.parent;
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
    if(width.unit !== unit.AUTO) {
      fixedWidth = true;
      switch(width.unit) {
        case unit.PX:
          w = width.value;
          break;
        case unit.PERCENT:
          w *= width.value * 0.01;
          break;
      }
    }
    if(height.unit !== unit.AUTO) {
      fixedHeight = true;
      switch(height.unit) {
        case unit.PX:
          h = height.value;
          break;
        case unit.PERCENT:
          h *= height.value * 0.01;
          break;
      }
    }
    // margin/padding/border影响x和y和尺寸
    x += borderLeftWidth + marginLeft + paddingLeft;
    data.x = x;
    y += borderTopWidth + marginTop + paddingTop;
    data.y = y;
    if(width.unit === unit.AUTO) {
      w -= borderLeftWidth + borderRightWidth + marginLeft + marginRight + paddingLeft + paddingRight;
    }
    if(height.unit === unit.AUTO) {
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

  render(renderMode) {
    this.__renderMode = renderMode;
    if(renderMode === mode.SVG) {
      this.__virtualDom = {
        bb: [],
        children: [],
        transform: [],
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
    this.__matrix = this.__matrixEvent = null;
    let parent = this.parent;
    let matrix = [1, 0, 0, 1, 0, 0];
    while(parent) {
      if(parent.matrixEvent) {
        matrix = tf.mergeMatrix(parent.matrixEvent, matrix);
        break;
      }
      parent = parent.parent;
    }
    // canvas继承祖先matrix，没有则恢复默认，防止其它matrix影响；svg则要考虑事件
    if(matrix[0] !== 1
      || matrix[1] !== 0
      || matrix[1] !== 0
      || matrix[1] !== 1
      || matrix[1] !== 0
      || matrix[1] !== 0) {
      if(renderMode === mode.CANVAS) {
        this.__matrix = this.__matrixEvent = matrix;
      }
      else if(renderMode === mode.SVG) {
        this.__matrixEvent = matrix;
      }
    }
    if(renderMode === mode.CANVAS) {
      ctx.setTransform(...matrix);
    }
    let {
      display,
      marginTop,
      marginRight,
      marginBottom,
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
      visibility,
    } = computedStyle;
    let {
      backgroundImage,
      backgroundSize,
      backgroundPositionX,
      backgroundPositionY,
      backgroundRepeat,
      transform,
      transformOrigin,
      opacity,
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
    parent = this.parent;
    let opa = opacity;
    while(parent) {
      opa *= parent.currentStyle.opacity;
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
    // transform相对于自身
    if(transform) {
      let matrix = tf.calMatrix(transform, tfo, x, y, outerWidth, outerHeight);
      // 初始化有可能继承祖先的matrix
      this.__matrix = this.matrix ? tf.mergeMatrix(this.matrix, matrix) : matrix;
      computedStyle.transform = 'matrix(' + matrix.join(', ') + ')';
      let parent = this.parent;
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
        this.addTransform(['matrix', this.matrix.join(',')]);
      }
    }
    else {
      computedStyle.transform = 'matrix(1, 0, 0, 1, 0, 0)';
    }
    if(isDestroyed || display === 'none' || visibility === 'hidden') {
      return;
    }
    // 背景色垫底
    if(backgroundColor !== 'transparent') {
      renderBgc(renderMode, backgroundColor, x2, y2, innerWidth, innerHeight, ctx, this);
    }
    // 渐变或图片叠加
    if(backgroundImage) {
      if(util.isString(backgroundImage)) {
        if(this.__loadBgi.url === backgroundImage) {
          backgroundSize = calBackgroundSize(backgroundSize, x2, y2, innerWidth, innerHeight);
          let { width, height } = this.__loadBgi;
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
          let originX = x2 + calBackgroundPosition(backgroundPositionX, innerWidth, width);
          let originY = y2 + calBackgroundPosition(backgroundPositionY, innerHeight, height);
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
          // 超出尺寸模拟mask截取
          let needMask = ['repeat-x', 'repeat-y', 'repeat'].indexOf(backgroundRepeat) > -1
            || originX < x2 || originY < y2 || w > innerWidth || h > innerHeight;
          if(renderMode === mode.CANVAS && this.__loadBgi.source) {
            // 超出尺寸模拟mask截取
            let cache1;
            let cache2;
            if(needMask) {
              cache1 = this.root.__getImageData();
              this.root.__clear();
            }
            ctx.drawImage(this.__loadBgi.source, originX, originY, w, h);
            // 分4个角分别判断
            if(xnl > 0 || ynt > 0) {
              for(let i = 0; i <= Math.max(xnl, 1); i++) {
                for(let j = 0; j <= Math.max(ynt, 1); j++) {
                  if(i !== 0 || j !== 0) {
                    ctx.drawImage(this.__loadBgi.source, originX - i * w, originY - j * h, w, h);
                  }
                }
              }
            }
            if(xnr > 0 || ynt > 0) {
              for(let i = 0; i <= Math.max(xnr, 1); i++) {
                for(let j = 0; j <= Math.max(ynt, 1); j++) {
                  if(i !== 0 || j !== 0) {
                    ctx.drawImage(this.__loadBgi.source, originX + i * w, originY - j * h, w, h);
                  }
                }
              }
            }
            if(xnl > 0 || ynb > 0) {
              for(let i = 0; i <= Math.max(xnl, 1); i++) {
                for(let j = 0; j <= Math.max(ynb, 1); j++) {
                  if(i !== 0 || j !== 0) {
                    ctx.drawImage(this.__loadBgi.source, originX - i * w, originY + j * h, w, h);
                  }
                }
              }
            }
            if(xnr > 0 || ynb > 0) {
              for(let i = 0; i <= Math.max(xnr, 1); i++) {
                for(let j = 0; j <= Math.max(ynb, 1); j++) {
                  if(i !== 0 || j !== 0) {
                    ctx.drawImage(this.__loadBgi.source, originX + i * w, originY + j * h, w, h);
                  }
                }
              }
            }
            if(needMask) {
              ctx.globalCompositeOperation = 'destination-in';
              renderBgc(renderMode, '#FFF', x2, y2, innerWidth, innerHeight, ctx, this);
              cache2 = this.root.__getImageData();
              this.root.__clear();
              ctx.globalCompositeOperation = 'source-over';
              this.root.__putImageData(util.mergeImageData(cache1, cache2));
            }
          }
          else if(renderMode === mode.SVG) {
            let matrix = image.matrixResize(width, height, w, h, x2, y2, innerWidth, innerHeight);
            let props = [
              ['xlink:href', backgroundImage],
              ['x', originX],
              ['y', originY],
              ['width', width || 0],
              ['height', height || 0]
            ];
            if(matrix) {
              props.push(['transform', 'matrix(' + matrix.join(',') + ')']);
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
            this.virtualDom.bb.push({
              type: 'img',
              tagName: 'image',
              props,
            });
            // 4个角repeat
            if(xnl > 0 || ynt > 0) {
              for(let i = 0; i <= Math.max(xnl, 1); i++) {
                for(let j = 0; j <= Math.max(ynt, 1); j++) {
                  if(i !== 0 || j !== 0) {
                    let clone = util.clone(props);
                    clone[1][1] = originX - i * w;
                    clone[2][1] = originY - j * h;
                    this.virtualDom.bb.push({
                      type: 'img',
                      tagName: 'image',
                      props: clone,
                    });
                  }
                }
              }
            }
            if(xnr > 0 || ynt > 0) {
              for(let i = 0; i <= Math.max(xnr, 1); i++) {
                for(let j = 0; j <= Math.max(ynt, 1); j++) {
                  if(i !== 0 || j !== 0) {
                    let clone = util.clone(props);
                    clone[1][1] = originX + i * w;
                    clone[2][1] = originY - j * h;
                    this.virtualDom.bb.push({
                      type: 'img',
                      tagName: 'image',
                      props: clone,
                    });
                  }
                }
              }
            }
            if(xnl > 0 || ynb > 0) {
              for(let i = 0; i <= Math.max(xnl, 1); i++) {
                for(let j = 0; j <= Math.max(ynb, 1); j++) {
                  if(i !== 0 || j !== 0) {
                    let clone = util.clone(props);
                    clone[1][1] = originX - i * w;
                    clone[2][1] = originY + j * h;
                    this.virtualDom.bb.push({
                      type: 'img',
                      tagName: 'image',
                      props: clone,
                    });
                  }
                }
              }
            }
            if(xnr > 0 || ynb > 0) {
              for(let i = 0; i <= Math.max(xnr, 1); i++) {
                for(let j = 0; j <= Math.max(ynb, 1); j++) {
                  if(i !== 0 || j !== 0) {
                    let clone = util.clone(props);
                    clone[1][1] = originX + i * w;
                    clone[2][1] = originY + j * h;
                    this.virtualDom.bb.push({
                      type: 'img',
                      tagName: 'image',
                      props: clone,
                    });
                  }
                }
              }
            }
          }
          computedStyle.backgroundSize = `${w} ${h}`;
          computedStyle.backgroundPositionX = originX;
          computedStyle.backgroundPositionY = originY;
          computedStyle.backgroundRepeat = backgroundRepeat;
        }
        else {
          this.__loadBgi.url = backgroundImage;
          inject.measureImg(backgroundImage, (data) => {
            if(data.success) {
              this.__loadBgi.source = data.source;
              this.__loadBgi.width = data.width;
              this.__loadBgi.height = data.height;
              this.root.addRefreshTask();
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
    if(borderTopWidth > 0 && borderTopColor !== 'transparent') {
      let deg1 = Math.atan(borderTopWidth / borderLeftWidth);
      let deg2 = Math.atan(borderTopWidth / borderRightWidth);
      let points = border.calPoints(borderTopWidth, borderTopStyle, deg1, deg2, x1, x2, x3, x4, y1, y2, y3, y4, 0);
      renderBorder(renderMode, points, borderTopColor, ctx, this);
    }
    if(borderRightWidth > 0 && borderRightColor !== 'transparent') {
      let deg1 = Math.atan(borderRightWidth / borderTopWidth);
      let deg2 = Math.atan(borderRightWidth / borderBottomWidth);
      let points = border.calPoints(borderRightWidth, borderRightStyle, deg1, deg2, x1, x2, x3, x4, y1, y2, y3, y4, 1);
      renderBorder(renderMode, points, borderRightColor, ctx, this);
    }
    if(borderBottomWidth > 0 && borderBottomColor !== 'transparent') {
      let deg1 = Math.atan(borderBottomWidth / borderLeftWidth);
      let deg2 = Math.atan(borderBottomWidth / borderRightWidth);
      let points = border.calPoints(borderBottomWidth, borderBottomStyle, deg1, deg2, x1, x2, x3, x4, y1, y2, y3, y4, 2);
      renderBorder(renderMode, points, borderBottomColor, ctx, this);
    }
    if(borderLeftWidth > 0 && borderLeftColor !== 'transparent') {
      let deg1 = Math.atan(borderLeftWidth / borderTopWidth);
      let deg2 = Math.atan(borderLeftWidth / borderBottomWidth);
      let points = border.calPoints(borderLeftWidth, borderLeftStyle, deg1, deg2, x1, x2, x3, x4, y1, y2, y3, y4, 3);
      renderBorder(renderMode, points, borderLeftColor, ctx, this);
    }
  }

  __renderByMask(renderMode) {
    let prev = this.prev;
    let hasMask = prev && prev.isMask;
    if(renderMode === mode.CANVAS) {
      // 先保存之前的图像
      let cache1;
      let cache2;
      if(hasMask) {
        cache1 = this.root.__getImageData();
        this.root.__clear();
      }
      // 然后反向先绘制需要遮罩的图层
      this.render(renderMode);
      // 再用mask反遮罩
      if(hasMask) {
        this.ctx.globalCompositeOperation = 'destination-in';
        prev.render(renderMode);
        cache2 = this.root.__getImageData();
        this.root.__clear();
      }
      this.ctx.globalCompositeOperation = 'source-over';
      if(hasMask) {
        this.root.__putImageData(util.mergeImageData(cache1, cache2));
      }
    }
    else if(renderMode === mode.SVG) {
      this.render(renderMode);
      if(hasMask) {
        this.virtualDom.mask = prev.maskId;
      }
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
    // if(this.animation) {
    //   this.animation.__destroy();
    // }
    this.animationList.forEach(item => item.__destroy());
    super.__destroy();
    this.__matrix = this.__matrixEvent = null;
  }

  // 先查找到注册了事件的节点，再捕获冒泡判断增加性能
  __emitEvent(e, force) {
    let { event: { type } } = e;
    let { isDestroyed, listener, children, computedStyle, outerWidth, outerHeight, matrixEvent } = this;
    if(isDestroyed || computedStyle.display === 'none' || e.__stopPropagation) {
      return;
    }
    let cb;
    if(listener.hasOwnProperty(type)) {
      cb = listener[type];
    }
    let childWillResponse;
    // touchmove之类强制的直接通知即可
    if(force) {
      if(!this.isGeom()) {
        // 先响应absolute/relative高优先级，从后往前遮挡顺序
        for(let i = children.length - 1; i >= 0; i--) {
          let child = children[i];
          if((child instanceof Xom || child instanceof Component) && ['absolute', 'relative'].indexOf(child.computedStyle.position) > -1) {
            if(child.__emitEvent(e, force)) {
              childWillResponse = true;
            }
          }
        }
        // 再看普通流，从后往前遮挡顺序
        for(let i = children.length - 1; i >= 0; i--) {
          let child = children[i];
          if((child instanceof Xom || child instanceof Component) && ['absolute', 'relative'].indexOf(child.computedStyle.position) > -1) {
            if(child.__emitEvent(e, force)) {
              childWillResponse = true;
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
      if(type === 'touchmove' || type === 'touchend' || type === 'touchcancel') {
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
    if(!this.isGeom()) {
      // 先响应absolute/relative高优先级，从后往前遮挡顺序
      for(let i = children.length - 1; i >= 0; i--) {
        let child = children[i];
        if((child instanceof Xom || child instanceof Component) && ['absolute', 'relative'].indexOf(child.computedStyle.position) > -1) {
          if(child.__emitEvent(e)) {
            childWillResponse = true;
          }
        }
      }
      // 再看普通流，从后往前遮挡顺序
      for(let i = children.length - 1; i >= 0; i--) {
        let child = children[i];
        if((child instanceof Xom || child instanceof Component) && ['absolute', 'relative'].indexOf(child.computedStyle.position) === -1) {
          if(child.__emitEvent(e)) {
            childWillResponse = true;
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
    let inThis = tf.pointInQuadrilateral(x - sx, y - sy,
      0, 0,
      outerWidth,0,
      0, outerHeight,
      outerWidth, outerHeight,
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
      computedStyle[ks] += ', ' + item[0];
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

  addBorder(props) {
    this.virtualDom.bb.push({
      type: 'item',
      tagName: 'path',
      props,
    });
  }

  addBackground(props) {
    this.virtualDom.bb.push({
      type: 'item',
      tagName: 'rect',
      props,
    });
  }

  addTransform(props) {
    this.virtualDom.transform.push(props);
  }

  animate(list, option) {
    let animation = new Animation(this, list, option);
    this.animationList.push(animation);
    return animation.play();
  }

  __computed() {
    css.compute(this, this.isRoot());
    // 即便自己不需要计算，但children还要继续递归检查
    if(!this.isGeom()) {
      this.children.forEach(item => {
        if(item instanceof Xom || item instanceof Component) {
          item.__computed();
        }
        else {
          item.__style = this.currentStyle;
          css.compute(item);
          // 文字首先测量所有字符宽度
          item.__measure();
        }
      });
    }
  }

  __repaint() {
    css.repaint(this, this.isRoot());
    // 即便自己不需要计算，但children还要继续递归检查
    if(!this.isGeom()) {
      this.children.forEach(item => {
        if(item instanceof Xom || item instanceof Component) {
          item.__repaint();
        }
        else {
          item.__style = this.currentStyle;
          css.repaint(item);
        }
      });
    }
  }

  get tagName() {
    return this.__tagName;
  }
  get innerWidth() {
    let { computedStyle: {
      paddingRight,
      paddingLeft,
    } } = this;
    return this.width
      + paddingLeft
      + paddingRight;
  }
  get innerHeight() {
    let { computedStyle: {
      paddingTop,
      paddingBottom,
    } } = this;
    return this.height
      + paddingTop
      + paddingBottom;
  }
  get outerWidth() {
    let { computedStyle: {
      borderLeftWidth,
      borderRightWidth,
      marginRight,
      marginLeft,
    } } = this;
    return this.innerWidth
      + borderLeftWidth
      + borderRightWidth
      + marginLeft
      + marginRight;
  }
  get outerHeight() {
    let { computedStyle: {
      borderTopWidth,
      borderBottomWidth,
      marginTop,
      marginBottom,
    } } = this;
    return this.innerHeight
      + borderTopWidth
      + borderBottomWidth
      + marginTop
      + marginBottom;
  }
  get listener() {
    return this.__listener;
  }
  get renderMode() {
    return this.__renderMode;
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
  get animateStyle() {
    return this.__animateStyle;
  }
  get currentStyle() {
    let { style, animateStyle, animationList } = this;
    // 有一个动画在运行则返回animateStyle，否则是style
    for(let i = 0, len = animationList.length; i < len; i++) {
      let animation = animationList[i];
      let { playState, options } = animation;
      if(playState === 'idle') {
        continue;
      }
      else if(playState === 'finished' && ['forwards', 'both'].indexOf(options.fill) === -1) {
        continue;
      }
      return animateStyle;
    }
    return style;
  }
}

export default Xom;
