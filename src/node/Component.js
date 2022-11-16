import Node from './Node';
import Text from './Text';
import Event from '../util/Event';
import util from '../util/util';
import inject from '../util/inject';
import css from '../style/css';
import change from '../refresh/change';

const { isNil, isFunction, extend } = util;

const REGISTER = {};

class Component extends Event {
  constructor(props = {}) {
    super();
    this.__tagName = /(?:function|class)\s+([\w$]+)/.exec(this.constructor.toString())[1];
    // 构建工具中都是{}，手写可能出现[]情况
    if(Array.isArray(props)) {
      this.props = util.arr2hash(props);
    }
    else {
      this.props = props;
    }
    this.__parent = null;
    this.__host = null;
    this.__ref = {};
    this.__isMounted = false;
    this.__taskList = [];
  }

  /**
   * build中调用初始化，处理过flatten
   */
  __init() {
    this.__ref = {};
    let sr = this.__shadowRoot;
    if(sr instanceof Text) {
      // 文字视作为父节点的直接文字子节点
    }
    else if(sr instanceof Node) {
      let style = css.normalize(this.props.style);
      let keys = Object.keys(style);
      extend(sr.style, style, keys);
      extend(sr.currentStyle, style, keys);
      // 事件添加到sr
      Object.keys(this.props).forEach(k => {
        let v = this.props[k];
        if(/^on[a-zA-Z]/.test(k)) {
          k = k.slice(2).toLowerCase();
          sr.listener[k] = v;
        }
      });
    }
    // 自定义事件无视返回强制添加
    Object.keys(this.props).forEach(k => {
      let v = this.props[k];
      if(/^on-[a-zA-Z\d_$]/.test(k)) {
        k = k.slice(3);
        this.on(k, v);
      }
    });
    if(isFunction(this.componentDidMount)) {
      this.__root.once(Event.REFRESH, () => {
        this.componentDidMount();
      });
    }
  }

  render() {
    inject.warn('Component should implement render()');
  }

  __destroy() {
    if(this.__isDestroyed) {
      return;
    }
    this.__isDestroyed = true;
    this.__isMounted = false;
    let ref = this.props.ref;
    if(!isNil(ref) && !isFunction(ref)) {
      delete this.__root.__ref[ref];
    }
    if(isFunction(this.componentWillUnmount)) {
      this.componentWillUnmount();
    }
    if(this.__shadow) {
      this.__shadow.__destroy();
    }
    this.__host = this.__hostRoot
      = this.__shadow = this.__shadowRoot
      = this.__prev = this.__next = this.__root
      = this.__parent = this.__domParent = null;
  }

  __emitEvent(e, force) {
    let sr = this.shadowRoot;
    if(sr instanceof Text) {
      return;
    }
    let res = sr.__emitEvent(e, force);
    if(res) {
      e.target = this;
      return true;
    }
  }

  get tagName() {
    return this.__tagName;
  }

  get shadow() {
    return this.__shadow;
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

  get hostRoot() {
    return this.__hostRoot;
  }

  get parent() {
    return this.__parent;
  }

  get prev() {
    return this.__prev;
  }

  get next() {
    return this.__next;
  }

  get ref() {
    return this.__ref;
  }

  get domParent() {
    return this.__domParent;
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

  static get REGISTER() {
    return REGISTER;
  }

  static getRegister(name) {
    if(!name || !util.isString(name) || !/^[A-Z]/.test(name)) {
      throw new Error('Invalid param');
    }
    if(!REGISTER.hasOwnProperty(name)) {
      throw new Error(`Component has not register: ${name}`);
    }
    return REGISTER[name];
  }

  static register(name, obj) {
    if(!name || !util.isString(name) || !/^[A-Z]/.test(name)
      || !obj.prototype || !(obj.prototype instanceof Component)) {
      throw new Error('Invalid param: Component register');
    }
    if(Component.hasRegister(name)) {
      throw new Error(`Component has already register: ${name}`);
    }
    REGISTER[name] = obj;
  }

  static hasRegister(name) {
    return name && REGISTER.hasOwnProperty(name);
  }

  static delRegister(name) {
    if(Component.hasRegister(name)) {
      delete REGISTER[name];
    }
  }
}

Object.keys(change.GEOM).concat([
  'x',
  'y',
  'width',
  'height',
  'outerWidth',
  'outerHeight',
  'clientWidth',
  'clientHeight',
  'offsetWidth',
  'offsetHeight',
  'style',
  'animationList',
  'currentStyle',
  'computedStyle',
  'cacheStyle',
  '__currentStyle',
  '__computedStyle',
  '__cacheStyle',
  'currentProps',
  '__currentProps',
  'cacheProps',
  '__cacheProps',
  'baseline',
  'virtualDom',
  'mask',
  'maskId',
  'textWidth',
  'content',
  'lineBoxes',
  'charWidthList',
  'charWidth',
  '__layoutData',
  '__struct',
  'bbox',
  'contentBoxList',
  'listener',
  'matrix',
  'matrixEvent',
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
  '__layoutFlow',
  '__layoutStyle',
  '__layoutAbs',
  '__layoutNone',
  '__tryLayInline',
  '__offsetX',
  '__offsetY',
  '__calAutoBasis',
  '__computeReflow',
  '__mp',
  'animate',
  'removeAnimate',
  'clearAnimate',
  'frameAnimate',
  'updateStyle',
  'getBoundingClientRect',
  'getComputedStyle',
  'clearCache',
  '__structure',
  '__modifyStruct',
  '__updateStruct',
  'flowChildren',
  'absChildren',
  '__isRealInline',
  '__calBasis',
  '__calMinMax',
  '__computeMeasure',
  'appendChild',
  'prependChild',
  'insertBefore',
  'insertAfter',
  'removeChild',
  'remove',
].forEach(fn => {
  Component.prototype[fn] = function() {
    let sr = this.shadowRoot;
    if(sr && isFunction(sr[fn])) {
      return sr[fn].apply(sr, arguments);
    }
  };
});

export default Component;
