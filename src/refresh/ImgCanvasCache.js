import CanvasCache from './CanvasCache';
import inject from '../util/inject';

const HASH = {};

/**
 * 相同的图片且尺寸相同时，复用一个source，如果尺寸和原图相等直接用，否则生成一个离屏canvas
 */
class ImgCanvasCache extends CanvasCache {
  constructor(renderMode, ctx, rootId, w, h, bbox, page, x1, y1) {
    super(renderMode, ctx, rootId, w, h, bbox, page, null, x1, y1);
  }

  __init(w, h, bbox, page, pos, x1, y1) {
    this.__width = w;
    this.__height = h;
    this.__bbox = bbox;
    this.__page = page;
    // 相等就不生成新的离屏canvas，直接用原始资源比如<img>节点内容
    if(page.width === w && page.height === h) {
      this.__canvas = page.source;
    }
    // 不等则一个url只生成一份OffscreenCanvas
    else {
      let key = this.key = w + ' ' + h + ' ' + page.src;
      if(HASH.hasOwnProperty(key)) {
        let o = HASH[key];
        o.count++;
        this.__canvas = o.canvas;
      }
      else {
        let offscreenCanvas = inject.getOffscreenCanvas(w, h, null, null);
        let ctx = offscreenCanvas.ctx;
        ctx.globalAlpha = 1;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.drawImage(page.source, 0, 0, w, h);
        this.__canvas = offscreenCanvas.canvas;
        HASH[key] = {
          canvas: offscreenCanvas.canvas,
          count: 1,
        };
      }
    }
    this.__x = 0;
    this.__y = 0;
    this.__enabled = true;
    this.__available = true;
    this.__appendData(x1, y1);
  }

  clear() {
    if(this.__available) {
      this.__available = false;
      return true;
    }
  }

  release() {
    if(this.__enabled) {
      this.clear();
      let key = this.key;
      if(HASH.hasOwnProperty(key)) {
        let o = HASH[key];
        o.count--;
        if(!o.count) {
          delete HASH[key];
        }
      }
      this.__enabled = false;
      this.__page = null;
      return true;
    }
  }

  reset(bbox, x1, y1) {
    this.release();
    let w = Math.ceil(bbox[2] - bbox[0]);
    let h = Math.ceil(bbox[3] - bbox[1]);
    let n = Math.max(w, h);
    if(n <= 0) {
      return;
    }
    this.__init(w, h, bbox, this.__page, null, x1, y1);
  }

  get canvas() {
    return this.__canvas;
  }

  get ctx() {
    return this.__ctx;
  }

  get size() {}

  static getInstance(renderMode, ctx, rootId, bbox, loadImg, x1, y1) {
    let w = bbox[2] - bbox[0];
    let h = bbox[3] - bbox[1];
    let n = Math.max(Math.ceil(w), Math.ceil(h));
    if(n <= 0) {
      return;
    }
    return new ImgCanvasCache(renderMode, ctx, rootId, w, h, bbox, loadImg, x1, y1);
  }
}

export default ImgCanvasCache;
