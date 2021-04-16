import Page from './Page';
import util from '../util/util';
import inject from '../util/inject';
import enums from '../util/enums';
import tf from '../style/transform';
import mx from '../math/matrix';
import debug from '../util/debug';

const {
  STYLE_KEY: {
    TRANSFORM_ORIGIN,
    TRANSFORM,
  },
  NODE_KEY: {
    NODE_OPACITY,
    NODE_CACHE,
    NODE_CACHE_FILTER,
    NODE_CACHE_OVERFLOW,
  },
} = enums;

// 根据一个共享cache的信息，生成一个独立的离屏canvas，一般是filter,mask用
function genSingle(cache) {
  let { size, sx1, sy1, width, height, bbox } = cache;
  let offScreen = inject.getCacheCanvas(width, height);
  offScreen.coords = [1, 1];
  offScreen.bbox = bbox;
  offScreen.size = size;
  offScreen.sx1 = sx1;
  offScreen.sy1 = sy1;
  offScreen.dx = cache.dx;
  offScreen.dy = cache.dy;
  offScreen.dbx = cache.dbx;
  offScreen.dby = cache.dby;
  offScreen.width = width;
  offScreen.height = height;
  return offScreen;
}

class Cache {
  constructor(w, h, bbox, page, pos) {
    this.__init(w, h, bbox, page, pos);
  }

  __init(w, h, bbox, page, pos) {
    this.__width = w;
    this.__height = h;
    this.__bbox = bbox;
    this.__page = page;
    this.__pos = pos;
    let [x, y] = page.getCoords(pos);
    // 四周各+1px的扩展
    this.__coords = [x + 1, y + 1];
    if(page.canvas) {
      this.__enabled = true;
      let ctx = page.ctx;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalAlpha = 1;
      if(debug.flag) {
        page.canvas.setAttribute('size', page.size);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.beginPath();
        ctx.rect(x + 1, y + 1, page.size - 2, page.size - 2);
        ctx.closePath();
        ctx.fill();
      }
    }
  }

  __appendData(sx1, sy1) {
    this.sx1 = sx1; // padding原点坐标
    this.sy1 = sy1;
    let [xc, yc] = this.coords;
    let bbox = this.bbox;
    this.dx = xc - bbox[0]; // cache坐标和box原点的差值
    this.dy = yc - bbox[1];
    this.dbx = sx1 - bbox[0]; // 原始x1/y1和box原点的差值
    this.dby = sy1 - bbox[1];
    this.update();
  }

  clear() {
    let ctx = this.ctx;
    if(this.enabled && ctx && this.available) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      let [x, y] = this.coords;
      let size = this.page.size;
      ctx.clearRect(x - 1, y - 1, size, size);
    }
    this.__available = false;
  }

  release() {
    if(this.enabled) {
      this.clear();
      this.page.del(this.pos);
      this.__page = null;
      this.__enabled = false;
    }
  }

  reset(bbox) {
    // 尺寸没变复用之前的并清空
    if(util.equalArr(this.bbox, bbox) && this.enabled) {
      this.clear();
      return;
    }
    this.release();
    let w = Math.ceil(bbox[2] - bbox[0]);
    let h = Math.ceil(bbox[3] - bbox[1]);
    w += 2;
    h += 2;
    // 防止边的精度问题四周各+1px，宽高即+2px
    let res = Page.getInstance(Math.max(w, h));
    if(!res) {
      this.__enabled = false;
      return;
    }
    let { page, pos } = res;
    this.__init(w, h, bbox, page, pos);
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

  get fullSize() {
    return this.page.fullSize;
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

  get coords() {
    return this.__coords;
  }

  static NUM = 5;
  static get MAX() {
    return Page.MAX - 2;
  }

  static getInstance(bbox) {
    if(isNaN(bbox[0]) || isNaN(bbox[1]) || isNaN(bbox[2]) || isNaN(bbox[3])) {
      return;
    }
    let w = Math.ceil(bbox[2] - bbox[0]);
    let h = Math.ceil(bbox[3] - bbox[1]);
    w += 2;
    h += 2;
    // 防止边的精度问题四周各+1px，宽高即+2px
    let res = Page.getInstance(Math.max(w, h));
    if(!res) {
      return;
    }
    let { page, pos } = res;
    return new Cache(w, h, bbox, page, pos);
  }

  /**
   * 复制cache的一块出来单独作为cacheFilter，尺寸边距保持一致，用webgl的滤镜
   * @param cache
   * @param v
   * @returns {{canvas: *, ctx: *, release(): void, available: boolean, draw()}}
   */
  static genBlur(cache, v) {
    let d = mx.int2convolution(v);
    let { coords: [x, y], size, canvas, sx1, sy1, width, height, bbox } = cache;
    bbox = bbox.slice(0);
    bbox[0] -= d;
    bbox[1] -= d;
    bbox[2] += d;
    bbox[3] += d;
    let offScreen = inject.getCacheCanvas(width + d * 2, height + d * 2);
    offScreen.ctx.filter = `blur(${v}px)`;
    offScreen.ctx.drawImage(canvas, x - 1, y - 1, width, height, d, d, width, height);
    offScreen.ctx.filter = 'none';
    offScreen.draw();
    offScreen.bbox = bbox;
    offScreen.coords = [1, 1];
    offScreen.size = size;
    offScreen.sx1 = sx1 - d;
    offScreen.sy1 = sy1 - d;
    offScreen.dx = cache.dx;
    offScreen.dy = cache.dy;
    offScreen.dbx = cache.dbx;
    offScreen.dby = cache.dby;
    offScreen.width = width + d * 2;
    offScreen.height = height + d * 2;
    return offScreen;
  }

  static genMask(target, next, isClip, transform, tfo) {
    let cacheMask = genSingle(target);
    let list = [];
    while(next && (next.isMask)) {
      list.push(next);
      next = next.next;
    }
    let { coords: [x, y], ctx, dbx, dby } = cacheMask;
    tfo[0] += x + dbx;
    tfo[1] += y + dby;
    let inverse = tf.calMatrixByOrigin(transform, tfo);
    // 先将mask本身绘制到cache上，再设置模式绘制dom本身，因为都是img所以1个就够了
    list.forEach(item => {
      let __config = item.__config;
      let cacheOverflow = __config[NODE_CACHE_OVERFLOW], cacheFilter = __config[NODE_CACHE_FILTER], cache = __config[NODE_CACHE];
      let source = cacheOverflow && cacheOverflow.available && cacheOverflow;
      if(!source) {
        source = cacheFilter && cacheFilter.available && cacheFilter;
      }
      if(!source) {
        source = cache && cache.available && cache;
      }
      if(source) {
        ctx.globalAlpha = __config[NODE_OPACITY];
        Cache.drawCache(
          source, cacheMask,
          item.computedStyle[TRANSFORM],
          [1, 0, 0, 1, 0, 0],
          item.computedStyle[TRANSFORM_ORIGIN].slice(0),
          inverse
        );
      }
      // 没有内容或者img没加载成功导致没有内容，不要报错
      else if(item.__hasContent) {
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
      let cacheOverflow = genSingle(target);
      let ctx = cacheOverflow.ctx;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalAlpha = 1;
      Cache.drawCache(target, cacheOverflow);
      cacheOverflow.draw(ctx);
      ctx.globalCompositeOperation = 'destination-in';
      ctx.fillStyle = '#FFF';
      ctx.beginPath();
      ctx.rect(sx - bbox[0] + 1, sy - bbox[1] + 1, outerWidth, outerHeight);
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
        let { coords: [ox, oy], canvas, width, height } = cache;
        let { coords: [nx, ny] } = newCache;
        newCache.sx1 = cache.sx1;
        newCache.sy1 = cache.sy1;
        newCache.dx = cache.dx + dx;
        newCache.dy = cache.dy + dy;
        newCache.dbx = cache.dbx + dx;
        newCache.dby = cache.dby + dy;
        newCache.ctx.drawImage(canvas, ox - 1, oy - 1, width, height, dx + nx - 1, dy + ny - 1, width, height);
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
    let { coords: [tx, ty], sx1, sy1, ctx, dbx, dby } = target;
    let { coords: [x, y], canvas, sx1: sx2, sy1: sy2, dbx: dbx2, dby: dby2, width, height } = source;
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
          matrix = [1, 0, 0, 1, 0, 0];
        }
        else {
          inverse = mx.inverse(inverse);
          matrix = mx.multiply(inverse, matrix);
        }
      }
      ctx.setTransform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);
    }
    ctx.drawImage(canvas, x - 1, y - 1, width, height, ox - 1, oy - 1, width, height);
  }

  static draw(ctx, opacity, matrix, cache) {
    ctx.globalAlpha = opacity;
    ctx.setTransform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);
    let { coords: [x, y], canvas, sx1, sy1, dbx, dby, width, height } = cache;
    ctx.drawImage(canvas, x - 1, y - 1, width, height, sx1 - 1 - dbx, sy1 - 1 - dby, width, height);
  }
}

export default Cache;
