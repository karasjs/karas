import Page from './Page';
import util from '../util/util';
import inject from '../util/inject';
import enums from '../util/enums';
import painter from '../util/painter';
import debug from '../util/debug';
import tf from '../style/transform';
import mx from '../math/matrix';
import blur from '../math/blur';

const {
  STYLE_KEY: {
    TRANSFORM_ORIGIN,
    TRANSFORM,
    DISPLAY,
    VISIBILITY,
  },
  NODE_KEY: {
    NODE_OPACITY,
    NODE_CACHE_TOTAL,
    NODE_CACHE_FILTER,
    NODE_CACHE_OVERFLOW,
    NODE_HAS_CONTENT,
    NODE_COMPUTED_STYLE,
  },
} = enums;

// 根据一个共享cache的信息，生成一个独立的离屏canvas，一般是filter,mask用
function genSingle(cache, message) {
  let { size, sx1, sy1, width, height, bbox } = cache;
  let offscreen = inject.getCacheCanvas(width, height, null, message);
  offscreen.x = 0;
  offscreen.y = 0;
  offscreen.bbox = bbox;
  offscreen.size = size;
  offscreen.sx1 = sx1;
  offscreen.sy1 = sy1;
  offscreen.dx = cache.dx;
  offscreen.dy = cache.dy;
  offscreen.dbx = cache.dbx;
  offscreen.dby = cache.dby;
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
    this.dbx = sx1 - bbox[0]; // 原始x1/y1和box原点的差值
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
    let d = 0;
    filter.forEach(item => {
      let [k, v] = item;
      if(k === 'blur') {
        d = blur.outerSize(v);
      }
    });
    let { x, y, size, canvas, sx1, sy1, width, height, bbox } = cache;
    bbox = bbox.slice(0);
    bbox[0] -= d;
    bbox[1] -= d;
    bbox[2] += d;
    bbox[3] += d;
    let offscreen = inject.getCacheCanvas(width + d * 2, height + d * 2, null, 'filter1');
    offscreen.ctx.filter = painter.canvasFilter(filter);
    offscreen.ctx.drawImage(canvas, x, y, width, height, d, d, width, height);
    offscreen.ctx.filter = 'none';
    offscreen.draw();
    offscreen.bbox = bbox;
    offscreen.x = 0;
    offscreen.y = 0;
    offscreen.size = size;
    offscreen.sx1 = sx1 - d;
    offscreen.sy1 = sy1 - d;
    offscreen.dx = cache.dx;
    offscreen.dy = cache.dy;
    offscreen.dbx = cache.dbx;
    offscreen.dby = cache.dby;
    offscreen.width = width + d * 2;
    offscreen.height = height + d * 2;
    return offscreen;
  }

  static genMask(target, next, isClip, transform, tfo) {
    let cacheMask = genSingle(target, 'mask1');
    let list = [];
    while(next && (next.isMask)) {
      list.push(next);
      next = next.next;
    }
    let { x, y, ctx, dbx, dby } = cacheMask;
    tfo[0] += x + dbx;
    tfo[1] += y + dby;
    let inverse = tf.calMatrixByOrigin(transform, tfo);
    // 先将mask本身绘制到cache上，再设置模式绘制dom本身，因为都是img所以1个就够了
    list.forEach(item => {
      let __config = item.__config;
      let target = Cache.getCache([
        __config[NODE_CACHE_FILTER],
        __config[NODE_CACHE_OVERFLOW],
        __config[NODE_CACHE_TOTAL],
      ]);
      // let cacheOverflow = __config[NODE_CACHE_OVERFLOW], cacheFilter = __config[NODE_CACHE_FILTER], cache = __config[NODE_CACHE];
      // let source = target && target.available && target;
      // if(!source) {
      //   source = cacheFilter && cacheFilter.available && cacheFilter;
      // }
      // if(!source) {
      //   source = cache && cache.available && cache;
      // }
      let computedStyle = __config[NODE_COMPUTED_STYLE];
      if(target) {
        ctx.globalAlpha = __config[NODE_OPACITY];
        Cache.drawCache(
          target, cacheMask,
          computedStyle[TRANSFORM],
          mx.identity(),
          computedStyle[TRANSFORM_ORIGIN].slice(0),
          inverse
        );
      }
      // 没有内容或者img没加载成功导致没有内容，有内容且可见则是超限，不可能进这里
      else if(__config[NODE_HAS_CONTENT]
        && computedStyle[DISPLAY] !== 'none'
        && computedStyle[VISIBILITY] !== 'hidden') {
        inject.error('CacheMask is oversize');
      }
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
    let { sx, sy, outerWidth, outerHeight } = node;
    let xe = sx + outerWidth;
    let ye = sy + outerHeight;
    if(bbox[0] < sx || bbox[1] < sy || bbox[2] > xe || bbox[3] > ye) {
      let cacheOverflow = genSingle(target, 'overflow');
      let ctx = cacheOverflow.ctx;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalAlpha = 1;
      Cache.drawCache(target, cacheOverflow);
      cacheOverflow.draw(ctx);
      ctx.globalCompositeOperation = 'destination-in';
      ctx.fillStyle = '#FFF';
      ctx.beginPath();
      ctx.rect(sx - bbox[0], sy - bbox[1], outerWidth, outerHeight);
      ctx.fill();
      ctx.closePath();
      ctx.globalCompositeOperation = 'source-over';
      return cacheOverflow;
    }
  }

  /**
   * bbox变化时直接用老的cache内容重设bbox
   * @param cache
   * @param bbox
   */
  static updateCache(cache, bbox) {
    let old = cache.bbox;
    if(!util.equalArr(bbox, old)) {
      let dx = old[0] - bbox[0];
      let dy = old[1] - bbox[1];
      let newCache = Cache.getInstance(bbox);
      if(newCache && newCache.enabled) {
        let { x: ox, y: oy, canvas, width, height } = cache;
        let { x: nx, y: ny } = newCache;
        newCache.sx1 = cache.sx1;
        newCache.sy1 = cache.sy1;
        newCache.dx = cache.dx + dx;
        newCache.dy = cache.dy + dy;
        newCache.dbx = cache.dbx + dx;
        newCache.dby = cache.dby + dy;
        newCache.ctx.drawImage(canvas, ox, oy, width, height, dx + nx, dy + ny, width, height);
        newCache.__available = true;
        cache.release();
        return newCache;
      }
    }
    else {
      return cache;
    }
  }

  static drawCache(source, target, transform, matrix, tfo, inverse) {
    let { x: tx, y: ty, sx1, sy1, ctx, dbx, dby } = target;
    let { x, y, canvas, sx1: sx2, sy1: sy2, dbx: dbx2, dby: dby2, width, height } = source;
    let ox = tx + sx2 - sx1 + dbx - dbx2;
    let oy = ty + sy2 - sy1 + dby - dby2;
    if(transform && matrix && tfo) {
      tfo[0] += ox;
      tfo[1] += oy;
      let m = tf.calMatrixByOrigin(transform, tfo);
      matrix = mx.multiply(matrix, m);
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
}

export default Cache;
