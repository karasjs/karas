import Event from '../Event';
import Node from './Node';
import Text from './Text';
import util from '../util';
import css from '../style/css';

class Component extends Event {
  constructor(tagName, props, children) {
    super();
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
    this.__parent = null;
    this.state = {};
  }

  setState(n, cb) {
    if(util.isNil(n)) {
      this.state = {};
    }
    else {
      for(let i in n) {
        if(n.hasOwnProperty(i)) {
          this.state[i] = n[i];
        }
      }
    }
    let o = this.shadowRoot;
    this.__traverse(o.ctx, o.defs, this.root.renderMode);
    this.__init(true);
    this.root.refresh();
    cb && cb();
  }

  __traverse(ctx, defs, renderMode) {
    let sr = this.__shadowRoot = this.render(renderMode);
    // 可能返回的还是一个Component，递归处理
    while(sr instanceof Component) {
      sr = this.__shadowRoot = sr.render(renderMode);
    }
    // node情况不可能是text，因为text节点只出现在dom内，直接返回的text是string
    if(!(sr instanceof Node)) {
      let s = '';
      if(!util.isNil(sr)) {
        s = util.encodeHtml(sr.toString());
      }
      sr = new Text(s);
      sr.__ctx = ctx;
      sr.__defs = defs;
      sr.__renderMode = renderMode;
      sr.__measure();
      this.__shadowRoot = sr;
      return;
    }
    sr.__ctx = ctx;
    sr.__defs = defs;
    sr.__traverse(ctx, defs, renderMode);
  }

  // 组件传入的样式需覆盖shadowRoot的
  __init(isSetState) {
    let sr = this.shadowRoot;
    // 返回text节点特殊处理，赋予基本样式
    if(sr instanceof Text) {
      css.normalize(sr.style);
    }
    else {
      sr.__init();
    }
    let style = this.props.style || {};
    for(let i in style) {
      if(style.hasOwnProperty(i)) {
        sr.style[i] = style[i];
      }
    }
    if(!(sr instanceof Text)) {
      this.__props.forEach(item => {
        let k = item[0];
        let v = item[1];
        if(/^on[a-zA-Z]/.test(k)) {
          k = k.slice(2).toLowerCase();
          let arr = sr.listener[k] = sr.listener[k] || [];
          arr.push(v);
        }
        else if(/^on-[a-zA-Z\d_$]/.test(k)) {
          k = k.slice(3);
          this.on(k, function(...args) {
            v(...args);
          });
        }
      });
    }
    // 防止重复
    if(isSetState) {
      return;
    }
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
          return this.shadowRoot[fn];
        },
      });
    });
  }

  render() {
  }

  __emitEvent(e, force) {
    let sr = this.shadowRoot;
    if(sr instanceof Text) {
      return;
    }
    if(force) {
      return sr.__emitEvent(e, force);
    }
    let res = sr.__emitEvent(e);
    if(res) {
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
  get root() {
    return this.parent.root;
  }
  get parent() {
    return this.__parent;
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
    if(sr[fn]) {
      sr[fn].apply(sr, arguments);
    }
  };
});

export default Component;
