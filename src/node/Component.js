import Node from './Node';
import util from '../util';

class Component {
  constructor(tagName, props, children) {
    if(!util.isString(tagName)) {
      throw new Error('Component must have a tagName');
    }
    this.__tagName = tagName;
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
    this.__children = children || [];
    this.__shadowRoot = null;
  }

  __traverse(ctx, defs, renderMode) {
    let sr = this.__shadowRoot = this.render(renderMode);
    if(!(sr instanceof Node) && !sr.tagName) {
      throw new Error(`Component ${this.tagName || ''} must return a Node by render()`);
    }
    sr.__ctx = ctx;
    sr.__defs = defs;
    sr.__traverse(ctx, defs, renderMode);
  }

  // 组件传入的样式需覆盖shadowRoot的
  __init() {
    let sr = this.shadowRoot;
    sr.__init();
    let style = this.props.style || {};
    Object.assign(sr.style, style);

    [
      'x',
      'y',
      'ox',
      'oy',
      'rx',
      'ry',
      'width',
      'height',
      'outerWidth',
      'outerHeight',
      'style',
      'ctx',
      'defs',
      'baseLine',
      'virtualDom'
    ].forEach(fn => {
      Object.defineProperty(this, fn, {
        get() {
          return sr[fn];
        },
      });
    });
  }

  render() {
  }

  __emitEvent(e, force) {
    let sr = this.shadowRoot;
    if(force) {
      return sr.__emitEvent(e, force);
    }
    let ne = Object.assign({}, e);
    let res = sr.__emitEvent(ne);
    if(res && ne.target === sr) {
      if(ne.__stopImmediatePropagation) {
        e.__stopPropagation = ne.__stopImmediatePropagation;
      }
      if(ne.__stopImmediatePropagation) {
        e.__stopImmediatePropagation = ne.__stopImmediatePropagation;
      }
      e.target = this;
      return true;
    }
  }

  get tagName() {
    return this.__tagName;
  }
  get children() {
    return this.__children;
  }
  get shadowRoot() {
    return this.__shadowRoot;
  }
}

[
  '__layout',
  '__layoutAbs',
  '__tryLayInline',
  '__offsetX',
  '__offsetY',
  '__calAutoBasis',
  '__calMp',
  '__calAbs'
].forEach(fn => {
  Component.prototype[fn] = function() {
    let sr = this.shadowRoot;
    sr[fn].apply(sr, arguments);
  };
});

export default Component;
