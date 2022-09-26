import Page from './Page';
import util from '../util/util';
import inject from '../util/inject';
import enums from '../util/enums';
import painter from '../util/painter';
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
const { isE } = mx;

// 根据一个共享cache的信息，生成一个独立的离屏canvas，一般是filter,mask用，可能尺寸会发生变化
function genSingle(cache, message, bboxNew) {
  let { size, sx1, sy1, bbox } = cache;
  bboxNew = bboxNew || bbox;
  let width = bboxNew[2] - bboxNew[0];
  let height = bboxNew[3] - bboxNew[1];
  let dx = bboxNew[0] - bbox[0];
  let dy = bboxNew[1] - bbox[1];
  let offscreen = inject.getOffscreenCanvas(width, height, null, message);
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
  constructor(rootId, w, h, bbox, page, pos, x1, y1) {
    this.__rootId = rootId;
    this.__init(w, h, bbox, page, pos, x1, y1);
  }

  __init(w, h, bbox, page, pos, x1, y1) {
    this.__width = w;
    this.__height = h;
    this.__bbox = bbox;
    this.__page = page;
    this.__pos = pos;
    let { x, y } = page.getCoords(pos);
    this.__x = x;
    this.__y = y;
    this.__appendData(x1, y1);
    if(page.canvas) {
      this.__enabled = true;
      let ctx = page.ctx;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalAlpha = 1;
    }
  }

  __appendData(sx1, sy1) {
    this.sx1 = sx1; // 去除margin的左上角原点坐标
    this.sy1 = sy1;
    let bbox = this.__bbox;
    this.dx = this.__x - bbox[0]; // cache坐标和box原点的差值
    this.dy = this.__y - bbox[1];
    this.dbx = sx1 - bbox[0]; // 原始sx1/sy1和box原点的差值
    this.dby = sy1 - bbox[1];
    this.update();
  }

  update() {
    this.page.__update = true;
  }

  clear() {
    if(this.__available) {
      let ctx = this.ctx;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      let size = this.__page.__size;
      ctx.clearRect(this.__x, this.__y, size, size);
      this.__available = false;
    }
  }

  // svg打标用会覆盖此方法
  release() {
    if(this.__enabled) {
      this.clear();
      this.__page.del(this.pos);
      this.__page = null;
      this.__enabled = false;
    }
  }

  reset(bbox, x1, y1) {
    // 尺寸没变复用之前的并清空
    if(util.equalArr(this.bbox, bbox) && this.__enabled) {
      this.clear();
      return;
    }
    this.release();
    let w = Math.ceil(bbox[2] - bbox[0]);
    let h = Math.ceil(bbox[3] - bbox[1]);
    let res = Page.getInstance(this.__rootId, Math.max(w, h));
    if(!res) {
      this.__enabled = false;
      return;
    }
    let { page, pos } = res;
    this.__init(w, h, bbox, page, pos, x1, y1);
  }

  __offsetY(diff) {
    this.sy1 += diff;
    let bbox = this.__bbox;
    bbox[1] += diff;
    bbox[3] += diff;
    this.dy -= diff;
  }

  // 是否功能可用，生成离屏canvas及尺寸超限
  get enabled() {
    return this.__enabled;
  }

  // 是否有可用缓存内容
  get available() {
    return this.__enabled && this.__available;
  }

  get bbox() {
    return this.__bbox;
  }

  get page() {
    return this.__page;
  }

  get canvas() {
    return this.__page.canvas;
  }

  get ctx() {
    return this.__page.ctx;
  }

  get size() {
    return this.__page.size;
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

  static get MAX() {
    return Page.MAX;
  }

  static getInstance(rootId, bbox, x1, y1) {
    let w = Math.ceil(bbox[2] - bbox[0]);
    let h = Math.ceil(bbox[3] - bbox[1]);
    let res = Page.getInstance(rootId, Math.max(w, h));
    if(!res) {
      return;
    }
    let { page, pos } = res;
    return new Cache(rootId, w, h, bbox, page, pos, x1, y1);
  }

  /**
   * 复制cache的一块出来单独作为cacheFilter，尺寸边距保持一致，用浏览器原生ctx.filter滤镜
   * @param cache
   * @param filter
   */
  static genFilter(cache, filter) {
    let { x, y, size, canvas, sx1, sy1, width, height, bbox } = cache;
    let oldX1 = bbox[0];
    bbox = spreadFilter(bbox, filter);
    let d = oldX1 - bbox[0];
    let widthNew = bbox[2] - bbox[0];
    let heightNew = bbox[3] - bbox[1];
    let offscreen = inject.getOffscreenCanvas(widthNew, heightNew, null, 'filter');
    offscreen.ctx.filter = painter.canvasFilter(filter);
    offscreen.ctx.drawImage(canvas, x, y, width, height, d, d, width, height);
    offscreen.ctx.filter = 'none';
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
    offscreen.width = widthNew;
    offscreen.height = heightNew;
    return offscreen;
  }

  static genMask(target, node, callback) {
    let cacheMask = genSingle(target, 'mask1');
    let list = [];
    let { [TRANSFORM]: transform, [TRANSFORM_ORIGIN]: tfo } = node.__computedStyle;
    let next = node.next;
    let isClip = next.__isClip;
    while(next && next.__isMask) {
      list.push(next);
      next = next.next;
    }
    let { x, y, ctx, dbx, dby } = cacheMask;
    let inverse = tf.calMatrixByOrigin(transform, tfo[0] + x + dbx, tfo[1] + y + dby);
    if(isE(inverse)) {
      inverse = null;
    }
    // 先将mask本身绘制到cache上，再设置模式绘制dom本身
    list.forEach(item => {
      callback(item, cacheMask, inverse);
    });
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = isClip ? 'source-out' : 'source-in';
    Cache.drawCache(target, cacheMask);
    ctx.globalCompositeOperation = 'source-over';
    return cacheMask;
  }

  /**
   * 如果不超过bbox，直接用已有的total/filter/mask，否则生成一个新的
   */
  static genOverflow(target, node) {
    let { bbox } = target;
    let { __sx1, __sy1, __clientWidth, __clientHeight } = node;
    let xe = __sx1 + __clientWidth;
    let ye = __sy1 + __clientHeight;
    if(bbox[0] < __sx1 || bbox[1] < __sy1 || bbox[2] > xe || bbox[3] > ye) {
      let bboxNew = [__sx1, __sy1, xe, ye];
      let cacheOverflow = genSingle(target, 'overflow', bboxNew);
      let ctx = cacheOverflow.ctx;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalAlpha = 1;
      Cache.drawCache(target, cacheOverflow);
      ctx.globalCompositeOperation = 'destination-in';
      ctx.fillStyle = '#FFF';
      ctx.beginPath();
      ctx.rect(0, 0, __clientWidth, __clientHeight);
      ctx.fill();
      ctx.closePath();
      ctx.globalCompositeOperation = 'source-over';
      return cacheOverflow;
    }
  }

  static drawCache(source, target) {
    let { x: tx, y: ty, sx1, sy1, ctx, dbx, dby } = target;
    let { x, y, canvas, sx1: sx2, sy1: sy2, dbx: dbx2, dby: dby2, width, height } = source;
    let ox = tx + sx2 - sx1 + dbx - dbx2;
    let oy = ty + sy2 - sy1 + dby - dby2;
    ctx.drawImage(canvas, x, y, width, height, ox, oy, width, height);
  }

  static getCache(list) {
    for(let i = 0, len = list.length; i < len; i++) {
      let item = list[i];
      if(item && item.available) {
        return item;
      }
    }
  }
}

export default Cache;
