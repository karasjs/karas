import Page from '../refresh/Page';
import webgl from './webgl';

class TexturePage extends Page {
  constructor(renderMode, gl, size, number) {
    super(renderMode, gl, size, number);
    this.gl = gl;
    this.texture = webgl.createTexture(gl, null, 0, size, size); // 默认0单元
    gl.bindTexture(gl.TEXTURE_2D, null);
  }

  del(pos) {
    super.del(pos);
    if(!this.__count) {
      let t = this.texture;
      if(t) {
        let gl = this.gl;
        gl.deleteTexture(t);
        this.texture = null;
      }
    }
  }

  static getInstance(renderMode, gl, rootId, size, excludePage) {
    return super.getInstance(renderMode, gl, rootId, size, this, excludePage);
  }
}

export default TexturePage;
