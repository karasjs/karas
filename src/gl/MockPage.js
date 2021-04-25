import Page from '../refresh/Page';
import inject from '../util/inject';

class MockPage {
  constructor(texture, fullSize) {
    this.uuid = Page.genUuid();
    this.time = inject.now();
    this.texture = texture;
    this.fullSize = fullSize;
  }
}

export default MockPage;
