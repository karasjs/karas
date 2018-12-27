import Element from '../Element';
import reset from '../reset';
import util from '../util';
import css from '../css';
import unit from '../unit';

class Geom extends Element {
  constructor(props) {
    super(props);
    this.__style = {}; // style被解析后的k-v形式
  }
  __initStyle() {
    let { style } = this;
    // 图形强制block
    Object.assign(style, reset, this.props.style, {
      display: 'block',
    });
    css.regularized(style);
  }
  __preLay(data) {
    let { x, y, w, h } = data;
    let { style } = this;
    let { width, height } = style;
    this.__x = x;
    this.__y = y;
    if(width.unit === unit.PERCENT) {
      this.__width = Math.ceil(width.value * h);
    }
    else if(width.unit === unit.PX) {
      this.__width = width.value;
    }
    else {
      this.__width = w;
    }
    if(height.unit === unit.PERCENT) {
      this.__height = Math.ceil(height.value * h);
    }
    else if(height.unit === unit.PX) {
      this.__height = height.value;
    }
    else {
      this.__height = h;
    }
  }
  render() {
    throw new Error('Geom render() must be implemented');
  }

  get style() {
    return this.__style;
  }
}

export default Geom;
