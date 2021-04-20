class MockCache {
  constructor(texture, sx1, sy1, width, height) {
    this.__texture = texture;
    this.coords = [1, 1];
    this.sx1 = sx1;
    this.sy1 = sy1;
    this.width = width;
    this.height = height;
    this.fullSize = Math.max(width, height);
  }

  release() {}

  get page() {
    return this.__texture;
  }
}

export default MockCache;
