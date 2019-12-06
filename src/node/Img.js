import Dom from './Dom';
import mode from '../util/mode';
import inject from '../util/inject';
import util from '../util/util';
import unit from '../style/unit';
import transform from '../style/transform';
import image from '../style/image';
import level from '../animate/level';

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
      width = width || { unit: unit.AUTO };
      height = height || { unit: unit.AUTO };
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
    let { isDestroyed, src, currentStyle } = this;
    let { display, width, height } = currentStyle;
    if(isDestroyed || display === 'none') {
      return;
    }
    let { width: w, height: h } = this;
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
      let lv = level.REFLOW;
      // 宽高都为auto，使用加载测量的数据
      if(width.unit === unit.AUTO && height.unit === unit.AUTO) {
        currentStyle.width = {
          value: cache.width,
          unit: unit.PX,
        };
        currentStyle.height = {
          value: cache.height,
          unit: unit.PX,
        };
      }
      // 否则有一方定义则按比例调整另一方适应
      else if(width.unit === unit.AUTO) {
        currentStyle.width = {
          value: h * cache.width / cache.height,
          unit: unit.PX,
        };
      }
      else if(height.unit === unit.AUTO) {
        currentStyle.height = {
          value: w * cache.height / cache.width,
          unit: unit.PX,
        };
      }
      else {
        lv = level.REPAINT;
      }
      let root = this.root;
      if(root) {
        root.setRefreshLevel(lv);
        root.addRefreshTask();
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
    let { ctx, sx: x, sy: y, width, height, src, isDestroyed, computedStyle: {
      display,
      borderTopWidth,
      borderLeftWidth,
      marginTop,
      marginLeft,
      paddingTop,
      paddingLeft,
    } } = this;
    if(isDestroyed || display === 'none') {
      return;
    }
    let originX = x + marginLeft + borderLeftWidth + paddingLeft;
    let originY = y + marginTop + borderTopWidth + paddingTop;
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
    else {
      if(renderMode === mode.CANVAS) {
        if(this.__source) {
          ctx.drawImage(this.__source, originX, originY, width, height);
        }
      }
      else if(renderMode === mode.SVG) {
        let matrix;
        if(this.__imgWidth !== undefined
          && (width !== this.__imgWidth || height !== this.__imgHeight)) {
          matrix = image.matrixResize(this.__imgWidth, this.__imgHeight, width, height, originX, originY, width, height);
          // 缩放图片的同时要考虑原先的矩阵，以及影响事件
          if(this.matrix) {
            this.__matrix = matrix = transform.mergeMatrix(this.__matrix, matrix);
            this.__matrixEvent = transform.mergeMatrix(this.__matrixEvent, matrix);
          }
          else {
            this.__matrixEvent = matrix;
          }
          matrix = 'matrix(' + matrix.join(',') + ')';
        }
        let props = [
          ['xlink:href', src],
          ['x', originX],
          ['y', originY],
          ['width', this.__imgWidth || 0],
          ['height', this.__imgHeight || 0]
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
  }

  get src() {
    return this.props.src;
  }
  get baseLine() {
    return this.height;
  }
}

export default Img;
