import MockPage from './MockPage';

/**
 * 一个fbo离屏纹理，mock成cache，当webgl需要局部根节点汇总时生成，即cacheTotal，
 * 基于此纹理进行filter、mask等后处理渲染
 */
class MockCache {
  constructor(gl, texture, sx1, sy1, width, height, bbox) {
    this.gl = gl;
    this.x = 0;
    this.y = 0;
    this.sx1 = sx1;
    this.sy1 = sy1;
    this.width = width;
    this.height = height;
    this.bbox = bbox;
    this.available = true;
    this.__page = new MockPage(texture, width, height);
    this.reOffset();
  }

  reOffset() {
    let bbox = this.bbox;
    this.dx = -bbox[0];
    this.dy = -bbox[1];
    this.dbx = this.sx1 - bbox[0];
    this.dby = this.sy1 - bbox[1];
  }

  release() {
    this.available = false;
    this.gl.deleteTexture(this.page.texture);
  }

  get page() {
    return this.__page;
  }
}

export default MockCache;
