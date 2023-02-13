import Cache from './Cache';
import CanvasPage from './CanvasPage';
import inject from '../util/inject';
import painter from '../util/painter';
import tf from '../style/transform';
import enums from '../util/enums';
import css from '../style/css';
import mx from '../math/matrix';
import wasm from '../wasm/index';

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
      return true;
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
    let { x, y, size, canvas, x1, y1, width, height, bbox } = cache;
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
    offscreen.x1 = x1;
    offscreen.y1 = y1;
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
    let transform, tfo, wn = node.__wasmNode;
    if(wn) {
      transform = new Float64Array(wasm.instance.memory.buffer, wn.transform_ptr(), 16);
      let cs = new Float64Array(wasm.instance.memory.buffer, wn.computed_style_ptr(), 18);
      tfo = [cs[16], cs[17]];
    }
    else {
      transform = node.__computedStyle[TRANSFORM];
      tfo = node.__computedStyle[TRANSFORM_ORIGIN];
    }
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


  static drawCache(source, target) {
    let { x: tx, y: ty, x1, y1, ctx, dbx, dby } = target;
    let { x, y, canvas, x1: x2, y1: y2, dbx: dbx2, dby: dby2, width, height } = source;
    let ox = tx + x2 - x1 + dbx - dbx2;
    let oy = ty + y2 - y1 + dby - dby2;
    ctx.drawImage(canvas, x, y, width, height, ox, oy, width, height);
  }
}

// 根据一个共享cache的信息，生成一个独立的离屏canvas，一般是filter,mask用，可能尺寸会发生变化
function genSingle(cache, message, bboxNew) {
  let { size, x1, y1, bbox } = cache;
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
  offscreen.x1 = x1;
  offscreen.y1 = y1;
  offscreen.dx = -bboxNew[0];
  offscreen.dy = -bboxNew[1];
  offscreen.dbx = cache.dbx - dx;
  offscreen.dby = cache.dby - dy;
  offscreen.width = width;
  offscreen.height = height;
  return offscreen;
}

export default CanvasCache;
