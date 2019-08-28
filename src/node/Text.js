import Node from './Node';

class Text extends Node {
  constructor(content) {
    super();
    this.__content = content.toString();
    this.__lineBoxes = [];
  }

  preLay() {
  }

  get content() {
    return this.__content;
  }
  get lineBoxes() {
    return this.__lineBoxes;
  }
}

export default Text;
