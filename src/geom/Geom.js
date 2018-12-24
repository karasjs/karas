import Element from '../Element';
import reset from '../reset';
import util from '../util';

class Geom extends Element {
  constructor(props) {
    super(props);
    this.__style = {}; // style被解析后的k-v形式
  }
  __initStyle() {
    let { style } = this;
    // 图形强制block
    Object.assign(style, {
      width: 300,
      height: 150,
    }, reset, this.props.style, {
      display: 'block',
    });
    util.validStyle(style);
  }
  __preLay(data) {
    let { x, y, w, h } = data;
    this.__x = x;
    this.__y = y;
    this.__width = w;
    this.__height = this.style.height;
  }
  render() {
    throw new Error('Geom render() must be implemented');
  }

  get style() {
    return this.__style;
  }
}

export default Geom;
