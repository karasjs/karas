import Page from './Page';
import webgl from '../gl/webgl';
import inject from '../util/inject';

class CanvasPage extends Page {
  constructor(renderMode, ctx, size, number) {
    super(renderMode, ctx, size, number);
    this.__offscreen = inject.getOffscreenCanvas(size, size, null, number);
  }

  genTexture(gl) {
    if(this.__update) {
      this.__update = false;
      let t = this.texture;
      if(t) {
        gl.deleteTexture(t);
      }
      this.texture = webgl.createTexture(gl, this.__offscreen.canvas, 0, null, null); // 默认0单元
      gl.bindTexture(gl.TEXTURE_2D, null);
    }
  }

  del(pos) {
    super.del(pos);
    if(!this.__count) {
      let t = this.texture;
      if(t) {
        let gl = this.__ctx;
        gl.deleteTexture(t);
      }
    }
  }

  get offscreen() {
    return this.__offscreen;
  }

  get canvas() {
    return this.__offscreen.canvas;
  }

  get ctx() {
    return this.__offscreen.ctx;
  }

  get update() {
    return this.__update;
  }

  set update(v) {
    this.__update = v;
  }

  static getInstance(renderMode, ctx, rootId, size, excludePage) {
    return super.getInstance(renderMode, ctx, rootId, size, this, excludePage);
  }
}

export default CanvasPage;
