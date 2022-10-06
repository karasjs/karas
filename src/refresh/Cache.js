import util from '../util/util';

/**
 * canvas和texture合图的基类，和Page类配合，抽象出基础尺寸偏差等信息
 * 派生2个子类
 */

let uuid = 0;

class Cache {
  constructor(renderMode, ctx, rootId, w, h, bbox, page, pos, x1, y1) {
    this.__uuid = uuid++;
    this.__renderMode = renderMode;
    this.__ctx = ctx;
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
    this.__enabled = true;
    this.__available = false;
    this.__appendData(x1, y1);
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
    this.__page.__update = true;
  }

  clear() {
    if(this.__available) {
      this.__available = false;
      this.update();
      return true;
    }
  }

  // svg打标用会覆盖此方法
  release() {
    if(this.__enabled) {
      this.clear();
      this.__page.del(this.pos);
      this.__page = null;
      this.__enabled = false;
      return true;
    }
  }

  reset(bbox, x1, y1, klass) {
    // 尺寸没变复用之前的并清空
    // if(this.__enabled && util.equalArr(this.__bbox, bbox)) {
    //   this.clear();
    //   return;
    // }
    this.release();
    let w = Math.ceil(bbox[2] - bbox[0]);
    let h = Math.ceil(bbox[3] - bbox[1]);
    let res = klass.getInstance(this.__renderMode, this.__ctx, this.__rootId, Math.max(w, h), null);
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

  get uuid() {
    return this.__uuid;
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

  get size() {
    return this.__page.__size;
  }

  get texture() {
    return this.__page.texture;
  }

  static getInstance(renderMode, ctx, rootId, bbox, x1, y1, cacheKlass, pageKlass, excludePage) {
    let w = Math.ceil(bbox[2] - bbox[0]);
    let h = Math.ceil(bbox[3] - bbox[1]);
    let n = Math.max(w, h);
    if(n <= 0) {
      return;
    }
    let res = pageKlass.getInstance(renderMode, ctx, rootId, n, excludePage);
    if(!res) {
      return;
    }
    let { page, pos } = res;
    return new cacheKlass(renderMode, ctx, rootId, w, h, bbox, page, pos, x1, y1);
  }
}

export default Cache;
