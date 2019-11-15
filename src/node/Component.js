import Event from '../util/Event';
import Node from './Node';
import Text from './Text';
import util from '../util/util';
import reset from '../style/reset';
import css from '../style/css';
import match from '../style/match';
import level from '../animate/level';

class Component extends Event {
  constructor(tagName, props, children) {
    super();
    if(!util.isString(tagName)) {
      children = props;
      props = tagName;
      tagName = /(?:function|class)\s+([\w$]+)/.exec(this.constructor.toString())[1];
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
    this.__ref = {};
    this.__state = {};
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
    // 构造函数中调用还未render
    let o = this.shadowRoot;
    if(!o) {
      return;
    }
    let root = this.root;
    if(root) {
      root.setRefreshLevel(level.REFLOW);
      this.__traverse(o.ctx, o.defs, this.root.renderMode);
      this.__init();
      root.addRefreshTask(cb);
    }
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
      sr.__style = this.props.style || {};
      this.__shadowRoot = sr;
      return;
    }
    sr.__ctx = ctx;
    sr.__defs = defs;
    sr.__host = this;
    if(!sr.isGeom()) {
      sr.__traverse(ctx, defs, renderMode);
    }
  }

  __traverseCss() {
    let sr = this.__shadowRoot;
    // shadowDom可以设置props.css，同时host的会覆盖它
    if(!(sr instanceof Text)) {
      let m = match.mergeCss(sr.props.css, this.props.css);
      sr.__traverseCss(sr, m);
    }
  }

  // 组件传入的样式需覆盖shadowRoot的
  __init() {
    let sr = this.shadowRoot;
    // 返回text节点特殊处理，赋予基本样式
    if(sr instanceof Text) {
      css.normalize(sr.style, reset.dom);
    }
    else {
      let style = this.props.style || {};
      for(let i in style) {
        if(style.hasOwnProperty(i)) {
          sr.style[i] = style[i];
        }
      }
      sr.__init();
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
    if(this.__hasInit) {
      return;
    }
    this.__hasInit = true;
    [
      'x',
      'y',
      'ox',
      'oy',
      'sx',
      'sy',
      'width',
      'height',
      'outerWidth',
      'outerHeight',
      'style',
      'computedStyle',
      'ctx',
      'defs',
      'baseLine',
      'virtualDom',
      'currentStyle',
      'points',
      'controlA',
      'controlB',
      'controls',
      'r',
      'rx',
      'ry',
      'begin',
      'end',
      'x1',
      'y1',
      'x2',
      'y2',
      'mask',
      'maskId'
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

  __destroy() {
    if(this.shadowRoot) {
      this.shadowRoot.__destroy();
    }
    this.children.splice(0);
    this.__shadowRoot = null;
    this.__parent = null;
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

  animate(list, option) {
    let sr = this.shadowRoot;
    if(!(sr instanceof Text)) {
      sr.animate(list, option);
    }
  }

  __computed() {
    let sr = this.shadowRoot;
    if(sr instanceof Text) {
      css.compute(sr, true);
      sr.__measure();
    }
    else {
      sr.__computed();
    }
  }

  __repaint() {
    let sr = this.shadowRoot;
    if(sr instanceof Text) {
      css.repaint(sr, true);
    }
    else {
      sr.__repaint();
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
    if(this.parent) {
      return this.parent.root;
    }
  }
  get parent() {
    return this.__parent;
  }
  get ref() {
    return this.__ref;
  }
  get state() {
    return this.__state;
  }
  set state(v) {
    this.__state = v;
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
  '__calAbs',
  '__renderAsMask',
  '__renderByMask'
].forEach(fn => {
  Component.prototype[fn] = function() {
    let sr = this.shadowRoot;
    if(sr[fn]) {
      return sr[fn].apply(sr, arguments);
    }
  };
});

export default Component;
