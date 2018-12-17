import Element from './Element';
import reset from './reset';

class Geom extends Element {
  constructor(props) {
    super(props);
    this.__style = {}; // style被解析后的k-v形式
  }
  __initStyle() {
    // 图形强制block
    Object.assign(this.__style, {
      width: 300,
      height: 150,
    }, reset, this.props.style, {
      display: 'block',
    });
  }
  __preLay(data) {
    let { x, y, w, h } = data;
    this.__x = x;
    this.__y = y;
    this.__width = w;
    this.__height = this.style.height;
  }

  get style() {
    return this.__style;
  }
}

export default Geom;
