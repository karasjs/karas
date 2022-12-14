import Cache from '../refresh/Cache';
import CanvasCache from '../refresh/CanvasCache';
import CanvasPage from '../refresh/CanvasPage';

const HASH = {};

class ImgWebglCache extends CanvasCache {
  constructor(renderMode, ctx, rootId, w, h, bbox, page, pos, x1, y1) {
    super(renderMode, ctx, rootId, w, h, bbox, page, pos, x1, y1);
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
          this.__page.del(this.__pos);
          this.__page = null;
        }
      }
      this.__enabled = false;
      return true;
    }
  }

  static getInstance(renderMode, ctx, rootId, bbox, loadImg, x1, y1) {
    let key = rootId + ',' + loadImg.width + ' ' + loadImg.height + ' ' + loadImg.src;
    if(HASH.hasOwnProperty(key)) {
      let o = HASH[key];
      o.count++;
      let w = bbox[2] - bbox[0], h = bbox[3] - bbox[1];
      let cache = o.cache;
      let res = new ImgWebglCache(renderMode, ctx, rootId, w, h, bbox, cache.page, cache.pos, x1, y1);
      res.key = key;
      return res;
    }
    let cache = Cache.getInstance(renderMode, ctx, rootId, bbox, x1, y1, this, CanvasPage, null);
    // 超限为空
    if(cache) {
      cache.key = key;
      if(cache) {
        HASH[key] = {
          cache,
          count: 1,
        };
        return cache;
      }
    }
  }
}

export default ImgWebglCache;
