import Node from './Node';
import util from '../util';

class Component extends Node {
  constructor(tagName, props, children) {
    super();
    props = props || [];
    // 构建工具中都是arr，手写可能出现hash情况
    if(Array.isArray(props)) {
      this.props = util.arr2hash(props);
      this.__props = props;
    }
    else {
      this.props = props;
      this.__props = util.hash2arr(props);
    }
    this.__tagName = tagName;
    this.__style = this.props.style || {}; // style被解析后的k-v形式
    this.__children = children;
  }

  render() {
  }

  get tagName() {
    return this.__tagName;
  }
  get children() {
    return this.__children;
  }
}

export default Component;
