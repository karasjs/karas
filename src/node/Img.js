import Dom from './Dom';
import mode from '../util/mode';
import inject from '../util/inject';
import util from "../util/util";
import unit from '../style/unit';
import transform from '../style/transform';

const CACHE = {};
const INIT = 0;
const LOADING = 1;
const LOADED = 2;

class Img extends Dom {
  constructor(tagName, props) {
    super(tagName, props, []);
    // 空url用错误图代替
    if(!this.src || !this.src.trim()) {
      this.__error = true;
      let { style: { width, height } } = this;
      if(width.unit === unit.AUTO) {
        width.value = 32;
        width.unit = unit.PX;
      }
      if(height.unit === unit.AUTO) {
        height.value = 32;
        height.unit = unit.PX;
      }
    }
  }

  __layout(data) {
    super.__layout(data);
    let { isDestroyed, src, style: {
      display,
      width,
      height,
      marginLeft,
      marginRight,
    } } = this;
    if(isDestroyed || display === 'none') {
      return;
    }
    let { w, h } = this.__preLayout(data);
    let cache = CACHE[this.src] = CACHE[this.src] || {
      state: INIT,
      task: [],
    };
    let cb = cache => {
      if(cache.success) {
        this.__source = cache.source;
      }
      else {
        this.__error = true;
      }
      this.__imgWidth = cache.width;
      this.__imgHeight = cache.height;
      // 宽高都为auto，使用加载测量的数据
      if(width.unit === unit.AUTO && height.unit === unit.AUTO) {
        width.value = cache.width;
        width.unit = unit.PX;
        height.value = cache.height;
        height.unit = unit.PX;
      }
      // 否则有一方定义则按比例调整另一方适应
      else if(width.unit === unit.AUTO) {
        width.value = h * cache.width / cache.height;
        width.unit = unit.PX;
      }
      else if(height.unit === unit.AUTO) {
        height.value = w * cache.height / cache.width;
        height.unit = unit.PX;
      }
      this.__width = width.value;
      this.__height = height.value;
      // 处理margin:xx auto居中对齐
      if(marginLeft.unit === unit.AUTO && marginRight.unit === unit.AUTO && width.unit !== unit.AUTO) {
        let ow = this.outerWidth;
        if(ow < cache.width) {
          this.__offsetX((cache.width - ow) * 0.5);
        }
      }
      if(this.root) {
        this.root.refreshTask();
      }
    };
    if(cache.state === LOADED) {
      cb(cache);
    }
    else if(cache.state === LOADING) {
      cache.task.push(cb);
    }
    else if(cache.state === INIT) {
      cache.state = LOADING;
      cache.task.push(cb);
      inject.measureImg(src, res => {
        cache.success = res.success;
        if(res.success) {
          cache.width = res.width;
          cache.height = res.height;
          cache.source = res.source;
        }
        else {
          cache.width = 32;
          cache.height = 32;
        }
        cache.state = LOADED;
        cache.task.forEach(cb => cb(cache));
        cache.task.splice(0);
      });
    }
  }

  __addGeom(tagName, props) {
    props = util.hash2arr(props);
    this.virtualDom.children.push({
      type: 'item',
      tagName,
      props,
    });
  }

  render(renderMode) {
    super.render(renderMode);
    let { ctx, rx: x, ry: y, width, height, mlw, mtw, plw, ptw, src, isDestroyed, style: {
      display,
      borderTopWidth,
      borderLeftWidth,
    } } = this;
    if(isDestroyed || display === 'none') {
      return;
    }
    let btw = borderTopWidth.value;
    let blw = borderLeftWidth.value;
    let originX = x + mlw + blw + plw;
    let originY = y + mtw + btw + ptw;
    if(this.__error) {
      let strokeWidth = Math.min(width, height) * 0.02;
      let stroke = '#CCC';
      let fill = '#DDD';
      let cx = originX + width * 0.7;
      let cy = originY + height * 0.3;
      let r = strokeWidth * 5;
      let pts = [
        [originX + width * 0.15, originY + height * 0.7],
        [originX + width * 0.3, originY + height * 0.4],
        [originX + width * 0.5, originY + height * 0.6],
        [originX + width * 0.6, originY + height * 0.5],
        [originX + width * 0.9, originY + height * 0.8],
        [originX + width * 0.15, originY + height * 0.8]
      ];
      if(renderMode === mode.CANVAS) {
        ctx.strokeStyle = stroke;
        ctx.lineWidth = strokeWidth;
        ctx.fillStyle = fill;
        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(originX + width, originY);
        ctx.lineTo(originX + width, originY + height);
        ctx.lineTo(originX, originY + height);
        ctx.lineTo(originX, originY);
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
        ctx.beginPath();
        ctx.moveTo(pts[0][0], pts[0][1]);
        for(let i = 1, len = pts.length; i < len; i++) {
          let point = pts[i];
          ctx.lineTo(point[0], point[1]);
        }
        ctx.lineTo(pts[0][0], pts[0][1]);
        ctx.fill();
        ctx.closePath();
      }
      else if(renderMode === mode.SVG) {
        this.__addGeom('rect', [
          ['x', originX],
          ['y', originY],
          ['width', width],
          ['height', height],
          ['stroke', stroke],
          ['stroke-width', strokeWidth],
          ['fill', 'transparent']
        ]);
        this.__addGeom('circle', [
          ['cx', cx],
          ['cy', cy],
          ['r', r],
          ['fill', fill],
        ]);
        let s = '';
        for(let i = 0, len = pts.length; i < len; i++) {
          let point = pts[i];
          s += `${point[0]},${point[1]} `;
        }
        this.__addGeom('polygon', [
          ['points', s],
          ['fill', fill]
        ]);
      }
    }
    else if(renderMode === mode.CANVAS) {
      if(this.__source) {
        ctx.drawImage(this.__source, originX, originY, width, height);
      }
    }
    else if(renderMode === mode.SVG) {
      let matrix;
      let needMatrix = this.__imgWidth !== undefined
        && (width !== this.__imgWidth || height !== this.__imgHeight);
      if(needMatrix) {
        let list = [
          ['scaleX', width / this.__imgWidth],
          ['scaleY', height / this.__imgHeight]
        ];
        matrix = transform.calMatrix(list, [
          {
            value: 0,
            unit: unit.PERCENT,
          },
          {
            value: 0,
            unit: unit.PERCENT,
          }
        ], x, y, this.outerWidth, this.outerHeight);
        if(this.__matrix) {
          matrix = transform.mergeMatrix(this.__matrix, matrix);
        }
        matrix = 'matrix(' + matrix.join(',') + ')';
      }
      let props = [
        ['xlink:href', src],
        ['x', originX],
        ['y', originY],
        ['width', needMatrix ? this.__imgWidth : this.width],
        ['height', needMatrix ? this.__imgHeight : this.height]
      ];
      if(matrix) {
        props.push(['transform', matrix]);
      }
      this.virtualDom.children.push({
        type: 'img',
        tagName: 'image',
        props,
      });
    }
  }

  __destroy() {
    super.__destroy();
  }

  get src() {
    return this.props.src;
  }
  get baseLine() {
    return this.height;
  }
}

export default Img;
