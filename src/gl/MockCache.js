import MockPage from './MockPage';

/**
 * 一个fbo离屏纹理，mock成cache，当webgl需要局部根节点汇总时生成，即cacheTotal，
 * 基于此纹理进行filter、mask等后处理渲染
 */
class MockCache {
  constructor(texture, sx1, sy1, width, height, fullSize, bbox) {
    this.coords = [1, 1];
    this.x = 0;
    this.y = 0;
    this.sx1 = sx1;
    this.sy1 = sy1;
    this.width = width;
    this.height = height;
    this.bbox = bbox;
    this.available = true;
    this.__page = new MockPage(texture, fullSize);
  }

  release() {
    // TODO: webgl.deleteTexture
    this.available = false;
  }

  get page() {
    return this.__page;
  }

  get fullSize() {
    return this.page.fullSize;
  }
}

export default MockCache;
