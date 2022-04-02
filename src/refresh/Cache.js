import Page from './Page';
import util from '../util/util';
import inject from '../util/inject';
import enums from '../util/enums';
import painter from '../util/painter';
import debug from '../util/debug';
import tf from '../style/transform';
import css from '../style/css';
import mx from '../math/matrix';

const {
  STYLE_KEY: {
    TRANSFORM_ORIGIN,
    TRANSFORM,
  },
} = enums;
const { spreadFilter } = css;

// 根据一个共享cache的信息，生成一个独立的离屏canvas，一般是filter,mask用，可能尺寸会发生变化
function genSingle(cache, message, bboxNew) {
  let { size, sx1, sy1, bbox } = cache;
  bboxNew = bboxNew || bbox;
  let width = bboxNew[2] - bboxNew[0];
  let height = bboxNew[3] - bboxNew[1];
  let dx = bboxNew[0] - bbox[0];
  let dy = bboxNew[1] - bbox[1];
  let offscreen = inject.getCacheCanvas(width, height, null, message);
  offscreen.x = 0;
  offscreen.y = 0;
  offscreen.bbox = bboxNew;
  offscreen.size = size;
  offscreen.sx1 = sx1;
  offscreen.sy1 = sy1;
  offscreen.dx = -bboxNew[0];
  offscreen.dy = -bboxNew[1];
  offscreen.dbx = cache.dbx - dx;
  offscreen.dby = cache.dby - dy;
  offscreen.width = width;
  offscreen.height = height;
  return offscreen;
}

class Cache {
  constructor(w, h, bbox, page, pos, x1, y1) {
    this.__init(w, h, bbox, page, pos, x1, y1);
  }

  __init(w, h, bbox, page, pos, x1, y1) {
    this.__width = w;
    this.__height = h;
    this.__bbox = bbox;
    this.__page = page;
    this.__pos = pos;
    let [x, y] = page.getCoords(pos);
    this.__x = x;
    this.__y = y;
    this.__appendData(x1, y1);
    this.__isNew = true;
    if(page.canvas) {
      this.__enabled = true;
      let ctx = page.ctx;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalAlpha = 1;
      if(debug.flag) {
        page.canvas.setAttribute && page.canvas.setAttribute('size', page.size);
      }
    }
  }

  __appendData(sx1, sy1) {
    this.sx1 = sx1; // 去除margin的左上角原点坐标
    this.sy1 = sy1;
    let bbox = this.bbox;
    this.dx = this.x - bbox[0]; // cache坐标和box原点的差值
    this.dy = this.y - bbox[1];
    this.dbx = sx1 - bbox[0]; // 原始sx1/sy1和box原点的差值
    this.dby = sy1 - bbox[1];
    this.update();
  }

  update() {
    this.page.update = true;
  }

  clear() {
    if(this.available) {
      let ctx = this.ctx;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      let size = this.page.size;
      ctx.clearRect(this.x, this.y, size, size);
      this.__available = false;
      this.__isNew = true;
    }
  }

  release() {
    if(this.enabled) {
      this.clear();
      this.page.del(this.pos);
      this.__page = null;
      this.__enabled = false;
    }
  }

  reset(bbox, x1, y1) {
    // 尺寸没变复用之前的并清空
    if(util.equalArr(this.bbox, bbox) && this.enabled) {
      this.clear();
      return;
    }
    this.release();
    let w = Math.ceil(bbox[2] - bbox[0]);
    let h = Math.ceil(bbox[3] - bbox[1]);
    let res = Page.getInstance(Math.max(w, h));
    if(!res) {
      this.__enabled = false;
      return;
    }
    let { page, pos } = res;
    this.__init(w, h, bbox, page, pos, x1, y1);
  }

  resetBbox(bbox) {}

  // 是否功能可用，生成离屏canvas及尺寸超限
  get enabled() {
    return this.__enabled;
  }

  // 是否有可用缓存内容
  get available() {
    return this.enabled && this.__available;
  }

  get bbox() {
    return this.__bbox;
  }

  get page() {
    return this.__page;
  }

  get canvas() {
    return this.page.canvas;
  }

  get ctx() {
    return this.page.ctx;
  }

  get size() {
    return this.page.size;
  }

  get x() {
    return this.__x;
  }

  get y() {
    return this.__y;
  }

  get width() {
    return this.__width;
  }

  get height() {
    return this.__height;
  }

  get pos() {
    return this.__pos;
  }

  get isNew() {
    return this.__isNew;
  }

  static get MAX() {
    return Page.MAX;
  }

  static getInstance(bbox, x1, y1) {
    let w = Math.ceil(bbox[2] - bbox[0]);
    let h = Math.ceil(bbox[3] - bbox[1]);
    let res = Page.getInstance(Math.max(w, h));
    if(!res) {
      return;
    }
    let { page, pos } = res;
    return new Cache(w, h, bbox, page, pos, x1, y1);
  }

  /**
   * 复制cache的一块出来单独作为cacheFilter，尺寸边距保持一致，用浏览器原生ctx.filter滤镜
   * @param cache
   * @param filter
   * @returns {{canvas: *, ctx: *, release(): void, available: boolean, draw()}}
   */
  static genFilter(cache, filter) {
    let { x, y, size, canvas, sx1, sy1, width, height, bbox } = cache;
    let oldX1 = bbox[0];
    bbox = spreadFilter(bbox, filter);
    let d = oldX1 - bbox[0];
    let offscreen = inject.getCacheCanvas(width + d * 2, height + d * 2, null, 'filter');
    offscreen.ctx.filter = painter.canvasFilter(filter);
    offscreen.ctx.drawImage(canvas, x, y, width, height, d, d, width, height);
    offscreen.ctx.filter = 'none';
    offscreen.draw();
    offscreen.bbox = bbox;
    // 单独的离屏，其dx/dy要重算
    offscreen.x = 0;
    offscreen.y = 0;
    offscreen.size = size;
    offscreen.sx1 = sx1;
    offscreen.sy1 = sy1;
    offscreen.dx = -bbox[0];
    offscreen.dy = -bbox[1];
    offscreen.dbx = cache.dbx + d;
    offscreen.dby = cache.dby + d;
    offscreen.width = width + d * 2;
    offscreen.height = height + d * 2;
    return offscreen;
  }

  static genMask(target, node, cb) {
    let cacheMask = genSingle(target, 'mask1');
    let list = [];
    let { [TRANSFORM]: transform, [TRANSFORM_ORIGIN]: tfo } = node.computedStyle;
    let next = node.next;
    let isClip = next.isClip;
    while(next && next.isMask) {
      list.push(next);
      next = next.next;
    }
    let { x, y, ctx, dbx, dby } = cacheMask;
    tfo[0] += x + dbx + node.__sx1 - target.sx1;
    tfo[1] += y + dby + node.__sy1 - target.sy1;
    let inverse = tf.calMatrixByOrigin(transform, tfo);
    // 先将mask本身绘制到cache上，再设置模式绘制dom本身，因为都是img所以1个就够了
    list.forEach(item => {
      cb(item, cacheMask, inverse);
    });
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = isClip ? 'source-out' : 'source-in';
    Cache.drawCache(target, cacheMask);
    ctx.globalCompositeOperation = 'source-over';
    cacheMask.draw(ctx);
    return cacheMask;
  }

  /**
   * 如果不超过bbox，直接用已有的total/filter/mask，否则生成一个新的
   */
  static genOverflow(target, node) {
    let { bbox } = target;
    let { __sx1, __sy1, clientWidth, clientHeight } = node;
    let xe = __sx1 + clientWidth;
    let ye = __sy1 + clientHeight;
    if(bbox[0] < __sx1 || bbox[1] < __sy1 || bbox[2] > xe || bbox[3] > ye) {
      let bboxNew = [__sx1, __sy1, xe, ye];
      let cacheOverflow = genSingle(target, 'overflow', bboxNew);
      let ctx = cacheOverflow.ctx;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalAlpha = 1;
      Cache.drawCache(target, cacheOverflow);
      cacheOverflow.draw(ctx);
      ctx.globalCompositeOperation = 'destination-in';
      ctx.fillStyle = '#FFF';
      ctx.beginPath();
      ctx.rect(0, 0, clientWidth, clientHeight);
      ctx.fill();
      ctx.closePath();
      ctx.globalCompositeOperation = 'source-over';
      return cacheOverflow;
    }
  }

  static drawCache(source, target, transform, matrix, tfo, parentMatrix, inverse) {
    let { x: tx, y: ty, sx1, sy1, ctx, dbx, dby } = target;
    let { x, y, canvas, sx1: sx2, sy1: sy2, dbx: dbx2, dby: dby2, width, height } = source;
    let ox = tx + sx2 - sx1 + dbx - dbx2;
    let oy = ty + sy2 - sy1 + dby - dby2;
    if(transform && matrix && tfo) {
      tfo[0] += ox;
      tfo[1] += oy;
      let m = tf.calMatrixByOrigin(transform, tfo);
      matrix = mx.multiply(matrix, m);
      if(!mx.isE(parentMatrix)) {
        matrix = mx.multiply(parentMatrix, matrix);
      }
      if(inverse) {
        // 很多情况mask和target相同matrix，可简化计算
        if(util.equalArr(matrix, inverse)) {
          matrix = mx.identity();
        }
        else {
          inverse = mx.inverse(inverse);
          matrix = mx.multiply(inverse, matrix);
        }
      }
      ctx.setTransform(matrix[0], matrix[1], matrix[4], matrix[5], matrix[12], matrix[13]);
    }
    ctx.drawImage(canvas, x, y, width, height, ox, oy, width, height);
  }

  static draw(ctx, opacity, matrix, cache) {
    ctx.globalAlpha = opacity;
    ctx.setTransform(matrix[0], matrix[1], matrix[4], matrix[5], matrix[12], matrix[13]);
    let { x, y, canvas, sx1, sy1, dbx, dby, width, height } = cache;
    ctx.drawImage(canvas, x, y, width, height, sx1 - dbx, sy1 - dby, width, height);
  }

  static getCache(list) {
    for(let i = 0, len = list.length; i < len; i++) {
      let item = list[i];
      if(item && item.available) {
        return item;
      }
    }
  }

  static NA = 0; // 无缓存模式
  static LOCAL = 1; // 局部根节点
  static CHILD = 2; // 其子节点
  static SELF = 3; // webgl专用
}

export default Cache;
