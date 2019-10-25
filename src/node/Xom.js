import Node from './Node';
import mode from '../util/mode';
import unit from '../style/unit';
import tf from '../style/transform';
import gradient from '../style/gradient';
import border from '../style/border';
import match from '../style/match';
import util from '../util/util';
import Component from './Component';

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
    // margin和padding的宽度
    this.__mtw = 0;
    this.__mrw = 0;
    this.__mbw = 0;
    this.__mlw = 0;
    this.__ptw = 0;
    this.__prw = 0;
    this.__pbw = 0;
    this.__plw = 0;
    this.__matrix = null;
    this.__matrixEvent = null;
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

  __layout(data) {
    let { w } = data;
    let { isDestroyed, style: {
      display,
      width,
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
      paddingTop,
      paddingRight,
      paddingBottom,
      paddingLeft,
    } } = this;
    if(isDestroyed || display === 'none') {
      return;
    }
    if(width && width.unit !== unit.AUTO) {
      switch(width.unit) {
        case unit.PX:
          w = width.value;
          break;
        case unit.PERCENT:
          w *= width.value * 0.01;
          break;
      }
    }
    this.__mlw = this.__mpWidth(marginLeft, w);
    this.__mtw = this.__mpWidth(marginTop, w);
    this.__mrw = this.__mpWidth(marginRight, w);
    this.__mbw = this.__mpWidth(marginBottom, w);
    this.__plw = this.__mpWidth(paddingLeft, w);
    this.__ptw = this.__mpWidth(paddingTop, w);
    this.__prw = this.__mpWidth(paddingRight, w);
    this.__pbw = this.__mpWidth(paddingBottom, w);
    this.__ox = this.__oy = 0;
    if(display === 'block') {
      this.__layoutBlock(data);
    }
    else if(display === 'flex') {
      this.__layoutFlex(data);
    }
    else if(display === 'inline') {
      this.__layoutInline(data);
    }
  }

  isGeom() {
    return this.tagName.charAt(0) === '$';
  }

  // 获取margin/padding的实际值
  __mpWidth(mp, w) {
    if(mp.unit === unit.PX) {
      return mp.value;
    }
    else if(mp.unit === unit.PERCENT) {
      return mp.value * w * 0.01;
    }
    return 0;
  }

  __preLayout(data) {
    let { x, y, w, h } = data;
    this.__x = x;
    this.__y = y;
    let { style, mlw, mtw, mrw, mbw, plw, ptw, prw, pbw } = this;
    let {
      width,
      height,
      borderTopWidth,
      borderRightWidth,
      borderBottomWidth,
      borderLeftWidth,
    } = style;
    // 除了auto外都是固定宽高度
    let fixedWidth;
    let fixedHeight;
    if(width && width.unit !== unit.AUTO) {
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
    if(height && height.unit !== unit.AUTO) {
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
    x += borderLeftWidth.value + mlw + plw;
    data.x = x;
    y += borderTopWidth.value + mtw + ptw;
    data.y = y;
    if(width.unit === unit.AUTO) {
      w -= borderLeftWidth.value + borderRightWidth.value + mlw + mrw + plw + prw;
    }
    if(height.unit === unit.AUTO) {
      h -= borderTopWidth.value + borderBottomWidth.value + mtw + mbw + ptw + pbw;
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
      };
    }
    let { isDestroyed, ctx, style, width, height, mlw, mrw, mtw, mbw, plw, ptw, prw, pbw } = this;
    // 恢复默认，防止其它matrix影响
    if(renderMode === mode.CANVAS) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
    let {
      display,
      position,
      top,
      right,
      bottom,
      left,
      backgroundGradient: bgg,
      backgroundColor: bgc,
      borderTopWidth,
      borderTopColor: btc,
      borderTopStyle: bts,
      borderRightWidth,
      borderRightColor: brc,
      borderRightStyle: brs,
      borderBottomWidth,
      borderBottomColor: bbc,
      borderBottomStyle: bbs,
      borderLeftWidth,
      borderLeftColor: blc,
      borderLeftStyle : bls,
      transform,
      transformOrigin,
    } = style;
    if(isDestroyed || display === 'none') {
      return;
    }
    // 除root节点外relative渲染时做偏移，百分比基于父元素，若父元素没有一定高则为0
    if(position === 'relative' && this.parent) {
      let { width, height } = this.parent;
      let h = this.parent.style.height;
      if(left.unit !== unit.AUTO) {
        let diff = left.unit === unit.PX ? left.value : left.value * width * 0.01;
        this.__offsetX(diff);
      }
      else if(right.unit !== unit.AUTO) {
        let diff = right.unit === unit.PX ? right.value : right.value * width * 0.01;
        this.__offsetX(-diff);
      }
      if(top.unit !== unit.AUTO) {
        let diff = top.unit === unit.PX ? top.value : top.value * height * 0.01 * (h.unit === unit.AUTO ? 0 : 1);
        this.__offsetY(diff);
      }
      else if(bottom.unit !== unit.AUTO) {
        let diff = bottom.unit === unit.PX ? bottom.value : bottom.value * height * 0.01 * (h.unit === unit.AUTO ? 0 : 1);
        this.__offsetY(-diff);
      }
    }
    // 使用rx和ry渲染位置，考虑了relative和translate影响
    let { rx: x, ry: y } = this;
    let btw = borderTopWidth.value;
    let brw = borderRightWidth.value;
    let bbw = borderBottomWidth.value;
    let blw = borderLeftWidth.value;
    let x1 = x + mlw;
    let x2 = x1 + blw;
    let x3 = x2 + width + plw + prw;
    let x4 = x3 + brw;
    let y1 = y + mtw;
    let y2 = y1 + btw;
    let y3 = y2 + height + ptw + pbw;
    let y4 = y3 + bbw;
    let iw = width + plw + prw;
    let ih = height + ptw + pbw;
    // translate相对于自身
    if(transform) {
      let x4 = x + mlw + blw + iw + brw + mrw;
      let y4 = y + mtw + btw + ih + bbw + mbw;
      let ow = x4 - x;
      let oh = y4 - y;
      let matrix = tf.calMatrix(transform, transformOrigin, x, y, ow, oh);
      this.__matrix = matrix;
      let parent = this.parent;
      while(parent) {
        if(parent.matrix) {
          matrix = tf.mergeMatrix(parent.matrix, matrix);
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
    // 先渲染渐变，没有则背景色
    if(bgg) {
      let { k, v } = bgg;
      let cx = x2 + iw * 0.5;
      let cy = y2 + ih * 0.5;
      // 需计算角度 https://www.w3cplus.com/css3/do-you-really-understand-css-linear-gradients.html
      if(k === 'linear') {
        let gd = gradient.getLinear(v, cx, cy, iw, ih);
        if(renderMode === mode.CANVAS) {
          ctx.beginPath();
          ctx.fillStyle = this.__getBgLg(renderMode, gd);
          ctx.rect(x2, y2, iw, ih);
          ctx.fill();
          ctx.closePath();
        }
        else if(renderMode === mode.SVG) {
          let fill = this.__getBgLg(renderMode, gd);
          this.addBackground([
            ['x', x2],
            ['y', y2],
            ['width', iw],
            ['height', ih],
            ['fill', fill]
          ]);
        }
      }
      else if(k === 'radial') {
        let gd = gradient.getRadial(v, cx, cy, x2, y2, x3, y3);
        if(renderMode === mode.CANVAS) {
          ctx.beginPath();
          ctx.fillStyle = this.__getBgRg(renderMode, gd);
          ctx.rect(x2, y2, iw, ih);
          ctx.fill();
          ctx.closePath();
        }
        else if(renderMode === mode.SVG) {
          let fill = this.__getBgRg(renderMode, gd);
          this.addBackground([
            ['x', x2],
            ['y', y2],
            ['width', iw],
            ['height', ih],
            ['fill', fill]
          ]);
        }
      }
    }
    else if(bgc !== 'transparent') {
      if(renderMode === mode.CANVAS) {
        ctx.beginPath();
        ctx.fillStyle = bgc;
        ctx.rect(x2, y2, iw, ih);
        ctx.fill();
        ctx.closePath();
      }
      else if(renderMode === mode.SVG) {
        this.addBackground([
          ['x', x2],
          ['y', y2],
          ['width', iw],
          ['height', ih],
          ['fill', bgc]
        ]);
      }
    }
    // 边框需考虑尖角，两条相交边平分45°夹角
    if(btw > 0 && btc !== 'transparent') {
      let deg1 = Math.atan(btw / blw);
      let deg2 = Math.atan(btw / brw);
      let points = border.calPoints(btw, bts, deg1, deg2, x1, x2, x3, x4, y1, y2, y3, y4, 0);
      renderBorder(renderMode, points, btc, ctx, this);
    }
    if(brw > 0 && brc !== 'transparent') {
      let deg1 = Math.atan(brw / btw);
      let deg2 = Math.atan(brw / bbw);
      let points = border.calPoints(brw, brs, deg1, deg2, x1, x2, x3, x4, y1, y2, y3, y4, 1);
      renderBorder(renderMode, points, brc, ctx, this);
    }
    if(bbw > 0 && bbc !== 'transparent') {
      let deg1 = Math.atan(bbw / blw);
      let deg2 = Math.atan(bbw / brw);
      let points = border.calPoints(bbw, bbs, deg1, deg2, x1, x2, x3, x4, y1, y2, y3, y4, 2);
      renderBorder(renderMode, points, bbc, ctx, this);
    }
    if(blw > 0 && blc !== 'transparent') {
      let deg1 = Math.atan(blw / btw);
      let deg2 = Math.atan(blw / bbw);
      let points = border.calPoints(blw, bls, deg1, deg2, x1, x2, x3, x4, y1, y2, y3, y4, 3);
      renderBorder(renderMode, points, blc, ctx, this);
    }
  }

  __destroy() {
    super.__destroy();
    this.__matrix = this.__matrixEvent = null;
  }

  // 先查找到注册了事件的节点，再捕获冒泡判断增加性能
  __emitEvent(e, force) {
    let { event: { type }, x, y, covers } = e;
    let { isDestroyed, listener, children, style, outerWidth, outerHeight, matrixEvent } = this;
    if(isDestroyed || style.display === 'none' || e.__stopPropagation) {
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
        children.forEach(child => {
          if(child instanceof Xom || child instanceof Component) {
            if(child.__emitEvent(e, force)) {
              childWillResponse = true;
            }
          }
        });
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
        if(child instanceof Xom && ['absolute', 'relative'].indexOf(child.style.position) > -1) {
          if(child.__emitEvent(e)) {
            childWillResponse = true;
          }
        }
        // 组件要形成shadowDom，除了shadowRoot，其它节点事件不冒泡
        else if(child instanceof Component && ['absolute', 'relative'].indexOf(child.style.position) > -1) {
          if(child.__emitEvent(e)) {
            childWillResponse = true;
          }
        }
      }
      // 再看普通流，从后往前遮挡顺序
      for(let i = children.length - 1; i >= 0; i--) {
        let child = children[i];
        if(child instanceof Xom && ['absolute', 'relative'].indexOf(child.style.position) === -1) {
          if(child.__emitEvent(e)) {
            childWillResponse = true;
          }
        }
        else if(child instanceof Component && ['absolute', 'relative'].indexOf(child.style.position) === -1) {
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
      // 根据是否matrix存入遮罩坐标
      covers.push({
        x,
        y,
        w: outerWidth,
        h: outerHeight,
        matrixEvent,
      });
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
  }

  willResponseEvent(e) {
    let { x, y, covers } = e;
    let { rx, ry, outerWidth, outerHeight, matrixEvent } = this;
    let inThis = tf.pointInQuadrilateral(x - rx, y - ry,
      0, 0,
      outerWidth,0,
      0, outerHeight,
      outerWidth, outerHeight,
      matrixEvent);
    if(inThis) {
      // 不能被遮挡
      for(let i = 0, len = covers.length; i < len; i++) {
        let { x: x2, y: y2, w, h, matrixEvent } = covers[i];
        if(tf.pointInQuadrilateral(x - rx, y - ry,
          x2 - rx, y2 - ry,
          x2 - rx + w,y2 - ry,
          x2 - rx, y2 - ry + h,
          x2 - rx + w, y2 - ry + h,
          matrixEvent)
        ) {
          return;
        }
      }
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

  __getBgLg(renderMode, gd) {
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
        stop: gd.stop,
      });
      return `url(#${uuid})`;
    }
  }

  __getBgRg(renderMode, gd) {
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
        stop: gd.stop,
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

  get tagName() {
    return this.__tagName;
  }
  get mtw() {
    return this.__mtw;
  }
  get mrw() {
    return this.__mrw;
  }
  get mbw() {
    return this.__mbw;
  }
  get mlw() {
    return this.__mlw;
  }
  get ptw() {
    return this.__ptw;
  }
  get prw() {
    return this.__prw;
  }
  get pbw() {
    return this.__pbw;
  }
  get plw() {
    return this.__plw;
  }
  get outerWidth() {
    let { mlw, mrw, plw, prw, style: {
      borderLeftWidth,
      borderRightWidth,
    } } = this;
    return this.width
      + borderLeftWidth.value
      + borderRightWidth.value
      + mlw
      + mrw
      + plw
      + prw;
  }
  get outerHeight() {
    let { mtw, mbw, ptw, pbw, style: {
      borderTopWidth,
      borderBottomWidth,
    } } = this;
    return this.height
      + borderTopWidth.value
      + borderBottomWidth.value
      + mtw
      + mbw
      + ptw
      + pbw;
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
}

export default Xom;
