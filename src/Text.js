import Element from './Element';

class Text extends Element {
  constructor(content) {
    super([]);
    this.__content = content.toString();
    this.__lineBoxes = [];
  }

  get content() {
    return this.__content;
  }
  get lineBoxes() {
    return this.__lineBoxes;
  }
}

export default Text;
