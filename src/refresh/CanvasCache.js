import Cache from './Cache';
import CanvasPage from './CanvasPage';
import inject from '../util/inject';
import painter from '../util/painter';
import tf from '../style/transform';
import enums from '../util/enums';
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

class CanvasCache extends Cache {
  constructor(renderMode, ctx, rootId, w, h, bbox, page, pos, x1, y1) {
    super(renderMode, ctx, rootId, w, h, bbox, page, pos, x1, y1);
  }

  clear() {
    if(super.clear()) {
      this.__available = false;
      let page = this.__page, ctx = page.ctx;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(this.__x, this.__y, this.__width, this.__height);
    }
  }

  reset(bbox, x1, y1) {
    return super.reset(bbox, x1, y1, CanvasPage);
  }

  get canvas() {
    return this.__page.canvas;
  }

  get ctx() {
    return this.__page.ctx;
  }

  static getInstance(renderMode, ctx, rootId, bbox, x1, y1, excludePage) {
    return super.getInstance(renderMode, ctx, rootId, bbox, x1, y1, this, CanvasPage, excludePage);
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
    let isClip = next.__clip;
    while(next && next.__mask) {
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
    CanvasCache.drawCache(target, cacheMask);
    ctx.globalCompositeOperation = 'source-over';
    return cacheMask;
  }

  /**
   * 如果不超过bbox，直接用已有的total/filter/mask，否则生成一个新的
   */
  static genOverflow(target, node) {
    let { bbox } = target;
    let { __x1, __y1, __clientWidth, __clientHeight } = node;
    let xe = __x1 + __clientWidth;
    let ye = __y1 + __clientHeight;
    if(bbox[0] < __x1 || bbox[1] < __y1 || bbox[2] > xe || bbox[3] > ye) {
      let bboxNew = [__x1, __y1, xe, ye];
      let cacheOverflow = genSingle(target, 'overflow', bboxNew);
      let ctx = cacheOverflow.ctx;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalAlpha = 1;
      CanvasCache.drawCache(target, cacheOverflow);
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
}

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

export default CanvasCache;
