import Node from './Node';
import Text from './Text';
import builder from '../util/builder';
import updater from '../util/updater';
import Event from '../util/Event';
import util from '../util/util';
import css from '../style/css';
import repaint from '../animate/repaint';

const { isNil, isFunction, clone, extend } = util;

/**
 * 向上设置cp类型叶子节点，表明从root到本节点这条链路有更新，使得无链路更新的节约递归
 * @param cp
 */
function setUpdateFlag(cp) {
  cp.__hasUpdate = true;
  let host = cp.host;
  if(host) {
    setUpdateFlag(host);
  }
}

class Component extends Event {
  constructor(props) {
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
    this.__parent = null;
    this.__host = null;
    this.__ref = {};
    this.__state = {};
    this.__isMounted = false;
  }

  setState(n, cb) {
    if(isNil(n)) {
      n = {};
    }
    else {
      let state = clone(this.state);
      n = extend(state, n);
    }
    let root = this.root;
    if(root && this.__isMounted) {
      root.delRefreshTask(this.__task);
      this.__task = {
        before: () => {
          // 标识更新
          this.__nextState = n;
          setUpdateFlag(this);
        },
        after: () => {
          if(isFunction(cb)) {
            cb();
          }
        },
        __state: true, // 特殊标识来源让root刷新时识别
      };
      root.addRefreshTask(this.__task);
    }
    // 构造函数中调用还未render，
    else if(isFunction(cb)) {
      this.__state = n;
      cb();
    }
  }

  /**
   * build中调用初始化，json有值时是update过程才有，且处理过flatten
   * @param json
   * @private
   */
  __init(json) {
    let root = this.root;
    let cd = json || builder.flattenJson(this.render());
    let sr = builder.initCp(cd, root, this, this);
    this.__cd = cd;
    if(sr instanceof Text) {
      // 文字视作为父节点的直接文字子节点，在builder里做
    }
    else if(sr instanceof Node) {
      let style = css.normalize(this.props.style || {});
      let keys = Object.keys(style);
      extend(sr.style, style, keys);
      extend(sr.currentStyle, style, keys);
      // 事件添加到sr，以及自定义事件
      this.__props.forEach(item => {
        let [k, v] = item;
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
    else if(sr instanceof Component) {
      console.warn('Component render() return a component: '
        + this.tagName + ' -> ' + sr.tagName
        + ', should not inherit style/event');
    }
    else {
      throw new Error('Component render() must return a dom/text: ' + this.tagName);
    }
    sr.__host = this;
    this.__shadowRoot = sr;
    if(!this.__isMounted) {
      this.__isMounted = true;
      let { componentDidMount } = this;
      if(isFunction(componentDidMount)) {
        root.once(Event.REFRESH, () => {
          componentDidMount.call(this);
        });
      }
    }
  }

  render() {
  }

  __destroy() {
    if(this.isDestroyed) {
      return;
    }
    this.__isDestroyed = true;
    let { componentWillUnmount } = this;
    if(isFunction(componentWillUnmount)) {
      componentWillUnmount.call(this);
      this.__isMounted = false;
    }
    this.root.delRefreshTask(this.__task);
    if(this.shadowRoot) {
      this.shadowRoot.__destroy();
    }
    this.__shadowRoot = null;
    this.__parent = null;
  }

  __emitEvent(e) {
    let sr = this.shadowRoot;
    if(sr instanceof Text) {
      return;
    }
    let res = sr.__emitEvent(e);
    if(res) {
      e.target = this;
      return true;
    }
  }

  __measure(renderMode, ctx) {
    let sr = this.shadowRoot;
    if(sr instanceof Text) {
      sr.__measure(renderMode, ctx);
    }
    // 其它类型为Xom或Component
    else {
      sr.__measure(renderMode, ctx, true);
    }
  }

  get tagName() {
    return this.__tagName;
  }

  get shadowRoot() {
    return this.__shadowRoot;
  }

  get root() {
    return this.__root;
  }

  get host() {
    return this.__host;
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

  get isDestroyed() {
    return this.__isDestroyed;
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
  'updateStyle'
].forEach(fn => {
  Component.prototype[fn] = function() {
    let sr = this.shadowRoot;
    if(sr && isFunction(sr[fn])) {
      return sr[fn].apply(sr, arguments);
    }
  };
});

export default Component;
