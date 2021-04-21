import Page from '../refresh/Page';

class MockPage {
  constructor(texture, fullSize) {
    this.uuid = Page.genUuid();
    this.time = 0;
    this.texture = texture;
    this.fullSize = fullSize;
  }
}

export default MockPage;
