import Dom from './Dom';
import mode from '../util/mode';
import inject from '../util/inject';
import util from '../util/util';
import unit from '../style/unit';
import transform from '../style/transform';
import image from '../style/image';
import border from '../style/border';
import level from '../animate/level';

const { AUTO, PX } = unit;

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
      width = width || { unit: AUTO };
      height = height || { unit: AUTO };
      if(width.unit === AUTO) {
        width.value = 32;
        width.unit = PX;
      }
      if(height.unit === AUTO) {
        height.value = 32;
        height.unit = PX;
      }
    }
  }

  __layout(data) {
    super.__layout(data);
    let { isDestroyed, src, style, currentStyle } = this;
    let { display, width, height } = currentStyle;
    if(isDestroyed || display === 'none' || !src) {
      return;
    }
    let { width: w, height: h } = this;
    let cache = CACHE[this.src] = CACHE[this.src] || {
      state: INIT,
      task: [],
    };
    let cb = (cache, loaded) => {
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
      if(width.unit === AUTO && height.unit === AUTO) {
        style.width = {
          value: cache.width,
          unit: PX,
        };
        style.height = {
          value: cache.height,
          unit: PX,
        };
      }
      // 否则有一方定义则按比例调整另一方适应
      else if(width.unit === AUTO) {
        style.width = {
          value: h * cache.width / cache.height,
          unit: PX,
        };
      }
      else if(height.unit === AUTO) {
        style.height = {
          value: w * cache.height / cache.width,
          unit: PX,
        };
      }
      else {
        lv = level.REPAINT;
      }
      if(loaded) {
        return;
      }
      let root = this.root;
      if(root) {
        root.delRefreshTask(this.__task);
        this.__task = {
          before() {
            root.setRefreshLevel(lv);
          },
        };
        root.addRefreshTask(this.__task);
      }
    };
    if(cache.state === LOADED) {
      cb(cache, true);
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
          cache.width = res.width || 32;
          cache.height = res.height || 32;
          cache.source = res.source;
        }
        else {
          cache.width = 32;
          cache.height = 32;
        }
        cache.state = LOADED;
        let list = cache.task.splice(0);
        list.forEach(cb => cb(cache));
      }, {
        width,
        height,
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

  __destroy() {
    this.root.delRefreshTask(this.__task);
    super.__destroy();
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
      borderTopLeftRadius,
      borderTopRightRadius,
      borderBottomRightRadius,
      borderBottomLeftRadius,
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
          ['fill', 'rgba(0,0,0,0)']
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
    else if(this.__source) {
      // 圆角需要生成一个mask
      let list = border.calRadius(originX, originY, width, height, borderTopLeftRadius, borderTopRightRadius, borderBottomRightRadius, borderBottomLeftRadius);
      if(renderMode === mode.CANVAS) {
        // 有border-radius需模拟遮罩裁剪
        if(list) {
          let { width, height } = this.root;
          let c = inject.getCacheCanvas(width, height);
          c.ctx.drawImage(this.__source, 0, 0, width, height);
          c.ctx.globalCompositeOperation = 'destination-in';
          border.genRdRect(renderMode, c.ctx, '#FFF', x, y, width, height, list);
          c.draw(c.ctx);
          ctx.drawImage(c.canvas, 0, 0);
          c.draw(ctx);
          c.ctx.globalCompositeOperation = 'source-over';
          c.ctx.clearRect(0, 0, width, height);
          c.draw(c.ctx);
        }
        else {
          ctx.drawImage(this.__source, originX, originY, width, height);
        }
      }
      else if(renderMode === mode.SVG) {
        let matrix;
        if(this.__imgWidth !== undefined
          && (width !== this.__imgWidth || height !== this.__imgHeight)) {
          matrix = image.matrixResize(this.__imgWidth, this.__imgHeight, width, height, originX, originY, width, height);
          // 缩放图片的同时要考虑原先的矩阵
          if(this.matrix) {
            this.__matrix = matrix = transform.mergeMatrix(this.__matrix, matrix);
          }
          matrix = matrix.join(',');
        }
        let props = [
          ['xlink:href', src],
          ['x', originX],
          ['y', originY],
          ['width', this.__imgWidth || 0],
          ['height', this.__imgHeight || 0]
        ];
        if(list) {
          let maskId = this.defs.add({
            tagName: 'mask',
            props: [],
            children: [
              border.genRdRect(renderMode, ctx, '#FFF', originX, originY, width, height, list),
            ],
          });
          props.push(['mask', `url(#${maskId})`]);
        }
        if(matrix && matrix !== '1,0,0,1,0,0') {
          props.push(['transform', 'matrix(' + matrix + ')']);
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
