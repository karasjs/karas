import Page from '../refresh/Page';
import inject from '../util/inject';

class MockPage {
  constructor(texture, width, height) {
    this.uuid = Page.genUuid();
    this.time = inject.now();
    this.texture = texture;
    this.width = width;
    this.height = height;
  }
}

export default MockPage;
