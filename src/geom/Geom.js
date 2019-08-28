import Node from '../node/Node';
import reset from '../reset';
import util from '../util';
import css from '../css';
import unit from '../unit';

const TAG_NAME = {
  'line': true,
  'curve': true,
};

class Geom extends Node {
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
    css.normalize(style);
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

  get style() {
    return this.__style;
  }

  static isValid(s) {
    return TAG_NAME.hasOwnProperty(s);
  }
}

export default Geom;
