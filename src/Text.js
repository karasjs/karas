import Element from './Element';

class Text extends Element {
  constructor(textContent) {
    super([]);
    this.__textContent = textContent.toString();
    this.__lineBoxes = [];
  }

  get textContent() {
    return this.__textContent;
  }
  set textContent(v) {
    this.__textContent = v;
  }
  get lineBoxes() {
    return this.__lineBoxes;
  }
}

export default Text;
