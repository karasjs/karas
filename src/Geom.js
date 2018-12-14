import Element from './Element';

const name = {
  'line': true,
};

class Geom extends Element {
  constructor(props) {
    super(props);
    this.initStyle();
  }
  initStyle() {
    this.__style = Object.assign({
      width: 300,
      height: 150,
    }, this.style, {
      display: 'block',
    });
  }

  static isGeom(s) {
    return name.hasOwnProperty(s);
  }
}

export default Geom;
