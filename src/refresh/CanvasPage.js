import Page from './Page';
import inject from '../util/inject';

class CanvasPage extends Page {
  constructor(size, number) {
    super(size, number);
    this.__offscreen = inject.getOffscreenCanvas(size, size, null, number);
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

  static getInstance(rootId, size) {
    return super.getInstance(rootId, size, this);
  }
}

export default CanvasPage;
