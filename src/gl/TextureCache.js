import Cache from '../refresh/Cache';
import TexturePage from './TexturePage';

/**
 * 一个fbo离屏纹理，mock成cache，当webgl需要局部根节点汇总时生成，即cacheTotal，
 * 基于此纹理进行filter、mask等后处理渲染
 */
class TextureCache extends Cache {
  constructor(renderMode, gl, rootId, w, h, bbox, page, pos, x1, y1) {
    super(renderMode, gl, rootId, w, h, bbox, page, pos, x1, y1);
    this.gl = gl;
  }

  update() {
    // 直接生成的texture不需要更新，覆盖掉不调用
  }

  clear() {
    if(super.clear()) {
      let page = this.__page, gl = page.gl;
      // 尺寸必须对上才行
      let data = new Uint8Array(this.__width * this.__height * 4);
      gl.bindTexture(gl.TEXTURE_2D, page.texture);
      gl.texSubImage2D(gl.TEXTURE_2D, 0, this.__x, this.__y, this.__width, this.__height, gl.RGBA,
        gl.UNSIGNED_BYTE, data);
    }
  }

  reset(bbox, x1, y1) {
    return super.reset(bbox, x1, y1, TexturePage);
  }

  static getInstance(renderMode, gl, rootId, bbox, x1, y1, excludePage) {
    return super.getInstance(renderMode, gl, rootId, bbox, x1, y1, this, TexturePage, excludePage);
  }
}

export default TextureCache;
