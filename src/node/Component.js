import Event from '../util/Event';
import Node from './Node';
import Text from './Text';
import util from '../util/util';
import css from '../style/css';
import level from '../animate/level';
import repaint from '../animate/repaint';

const { isNil, isString, isFunction, clone, extend } = util;

class Component extends Event {
  constructor(tagName, props, children) {
    super();
    if(!isString(tagName)) {
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
    this.__isMount = false;
  }

  setState(n, cb) {
    if(isNil(n)) {
      this.state = {};
    }
    else {
      extend(this.state, n);
    }
    let root = this.root;
    if(root) {
      root.delRefreshTask(this.__task);
      let ovd = this.shadowRoot;
      this.__task = {
        before: () => {
          this.__init();
          root.setRefreshLevel(level.REFLOW);
        },
        after: () => {
          if(ovd instanceof Node) {
            ovd.__destroy();
          }
          if(isFunction(cb)) {
            cb();
          }
        },
      };
      root.addRefreshTask(this.__task);
    }
    // 构造函数中调用还未render，
    else if(isFunction(cb)) {
      cb();
    }
  }

  __init() {
    let sr = this.render();
    // 可能返回的还是一个Component，递归处理
    while(sr instanceof Component) {
      sr = sr.__init();
    }
    // node情况不可能是text，因为text节点只出现在dom内，直接返回的text是string
    if(sr instanceof Node) {
      sr.__host = this;
      sr.__initRef(this);
      // 组件传入的样式需覆盖shadowRoot的
      let style = clone(this.props.style) || {};
      css.normalize(style);
      extend(sr.style, style);
      // 事件添加到sr，以及自定义事件
      this.__props.forEach(item => {
        let k = item[0];
        let v = item[1];
        if(/^on[a-zA-Z]/.test(k)) {
          k = k.slice(2).toLowerCase();
          let arr = sr.listener[k] = sr.listener[k] || [];
          if(arr.indexOf(v) === -1) {
            arr.push(v);
          }
        }
        else if(/^on-[a-zA-Z\d_$]/.test(k)) {
          k = k.slice(3);
          this.on(k, function(...args) {
            v(...args);
          });
        }
      });
    }
    else {
      let s = '';
      if(!isNil(sr)) {
        s = util.encodeHtml(sr.toString());
      }
      sr = new Text(s);
      // 文字视作为父节点的直接文字子节点
      sr.__parent = this.parent;
    }
    return this.__shadowRoot = sr;
  }

  __initRef(root) {
    let ref = this.props.ref;
    if(isString(ref)) {
      root.ref[ref] = this;
    }
    else if(isFunction(ref)) {
      ref(root);
    }
  }

  render() {
  }

  __destroy() {
    let { componentWillUnmount } = this;
    if(isFunction(componentWillUnmount)) {
      componentWillUnmount.call(this);
      this.__isMount = false;
    }
    this.root.delRefreshTask(this.__task);
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

  // Root布局前时measure调用，第一次渲染初始化生成shadowRoot
  __measure(renderMode, ctx) {
    if(!this.__isMount) {
      this.__isMount = true;
      this.__init();
      this.root.once(Event.REFRESH, () => {
        if(isFunction(this.componentDidMount)) {
          this.componentDidMount();
        }
      });
    }
    let sr = this.shadowRoot;
    if(sr instanceof Text) {
      sr.__measure(renderMode, ctx);
    }
    else {
      sr.__measure(renderMode, ctx, true);
    }
  }

  __repaint() {
    let sr = this.shadowRoot;
    if(sr instanceof Node) {
      sr.__repaint(true);
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

Object.keys(repaint.GEOM).concat([
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
  'animating',
  'animationList',
  'animateStyle',
  'currentStyle',
  'computedStyle',
  'animateProps',
  'currentProps',
  'baseLine',
  'virtualDom',
  'mask',
  'maskId',
  'textWidth',
  'content',
  'lineBoxes',
  'charWidthList',
  'charWidth',
]).forEach(fn => {
  Object.defineProperty(Component.prototype, fn, {
    get() {
      let sr = this.shadowRoot;
      if(sr) {
        return sr[fn];
      }
    },
  });
});

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
  '__renderByMask',
  '__mp',
  'animate',
  'removeAnimate',
  'clearAnimate',
].forEach(fn => {
  Component.prototype[fn] = function() {
    let sr = this.shadowRoot;
    if(sr && isFunction(sr[fn])) {
      return sr[fn].apply(sr, arguments);
    }
  };
});

export default Component;
