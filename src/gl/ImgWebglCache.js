import Cache from '../refresh/Cache';
import CanvasCache from '../refresh/CanvasCache';
import CanvasPage from '../refresh/CanvasPage';
import Page from '../refresh/Page';
import webgl from './webgl';

const HASH = {};

class ImgWebglCache extends CanvasCache {
  constructor(renderMode, ctx, rootId, w, h, bbox, page, pos, x1, y1) {
    super(renderMode, ctx, rootId, w, h, bbox, page, pos, x1, y1);
  }

  release() {
    if(this.__enabled) {
      let key = this.key;
      // 一定有
      let o = HASH[key];
      o.count--;
      if(!o.count) {
        this.clear();
        delete HASH[key];
        this.__page.del(this.__pos);
        this.__page = null;
      }
      this.__enabled = false;
      return true;
    }
  }

  get count() {
    return HASH[this.key].count;
  }

  static getInstance(renderMode, ctx, rootId, bbox, loadImg, x1, y1) {
    let w = loadImg.width, h = loadImg.height;
    let w2 = bbox[2] - bbox[0], h2 = bbox[3] - bbox[1];
    let key = rootId + ',' + loadImg.width + ' ' + loadImg.height + ' ' + loadImg.src;
    if(HASH.hasOwnProperty(key)) {
      let o = HASH[key];
      o.count++;
      let cache = o.cache;
      if(w > Page.MAX * 0.5 || h > Page.MAX * 0.5) {
        return {
          key,
          renderMode,
          ctx,
          rootId,
          __bbox: bbox,
          __tx1: 0,
          __ty1: 0,
          __tx2: 1,
          __ty2: 1,
          __width: w2,
          __height: h2,
          __available: true,
          __enabled: true,
          get available() {
            return this.__available;
          },
          get enabled() {
            return this.__enabled;
          },
          __page: cache.page,
          get page() {
            return this.__page;
          },
          get bbox() {
            return this.__bbox;
          },
          reset(bbox, x1, y1) {
            this.release();
            this.__bbox = bbox;
          },
          release() {
            if(this.__enabled) {
              let key = this.key;
              // 一定有
              let o = HASH[key];
              o.count--;
              if(!o.count) {
                delete HASH[key];
                this.__page.del();
                this.__page = null;
              }
              this.__enabled = false;
              return true;
            }
          },
        };
      }
      let res = new ImgWebglCache(renderMode, ctx, rootId, w, h, bbox, cache.page, cache.pos, x1, y1);
      res.__tw = w2;
      res.__th = h2;
      res.key = key;
      return res;
    }
    // 超过动态合图纹理MAX一半的使用单图纹理，没有count数据不调用render
    if(w > Page.MAX * 0.5 || h > Page.MAX * 0.5) {
      let cache = {
        key,
        renderMode,
        ctx,
        rootId,
        __bbox: bbox,
        __tx1: 0,
        __ty1: 0,
        __tx2: 1,
        __ty2: 1,
        __width: w,
        __height: h,
        __tw: w2,
        __th: h2,
        __available: true,
        __enabled: true,
        get available() {
          return this.__available;
        },
        get enabled() {
          return this.__enabled;
        },
        __page: {
          del() {
            ctx.deleteTexture(this.texture);
          },
          texture: webgl.createTexture(ctx, loadImg.source, 0, null, null),
        },
        get page() {
          return this.__page;
        },
        get bbox() {
          return this.__bbox;
        },
        reset(bbox, x1, y1) {
          this.release();
          this.__bbox = bbox;
        },
        release() {
          if(this.__enabled) {
            let key = this.key;
            // 一定有
            let o = HASH[key];
            o.count--;
            if(!o.count) {
              delete HASH[key];
              this.__page.del();
              this.__page = null;
            }
            this.__enabled = false;
            return true;
          }
        },
      };
      HASH[key] = {
        cache,
        count: 1,
      };
      return cache;
    }
    let cache = Cache.getImgInstance(renderMode, ctx, rootId, bbox, x1, y1, w, h, this, CanvasPage, null);
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
