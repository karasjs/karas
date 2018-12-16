import Element from './Element';

class Text extends Element {
  constructor(s) {
    super([]);
    this.s = s.toString();
  }
}

export default Text;
