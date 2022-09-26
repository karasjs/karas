import Page from '../refresh/Page';
import inject from '../util/inject';
import frame from '../animate/frame';

class MockPage {
  constructor(texture, width, height) {
    this.uuid = this.__uuid = Page.genUuid();
    this.time = frame.__now || inject.now();
    this.texture = texture;
    this.width = width;
    this.height = height;
  }
}

export default MockPage;
