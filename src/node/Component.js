import Node from './Node';
import Text from './Text';
import builder from '../util/builder';
import Event from '../util/Event';
import util from '../util/util';
import inject from '../util/inject';
import flatten from '../util/flatten';
import css from '../style/css';
import change from '../refresh/change';

const { isNil, isFunction, clone, extend } = util;

const REGISTER = {};

/**
 * 向上设置cp类型叶子节点，表明从root到本节点这条链路有更新，使得无链路更新的节约递归
 * 在check时树递归会用到，判断是否需要查找cp更新
 * @param cp
 */
function setUpdateFlag(cp) {
  // 去重
  if(cp.__hasCpUpdate) {
    return;
  }
  cp.__hasCpUpdate = true;
  let host = cp.host;
  if(host) {
    setUpdateFlag(host);
  }
}

class Component extends Event {
  constructor(props = {}) {
    super();
    this.__tagName = /(?:function|class)\s+([\w$]+)/.exec(this.constructor.toString())[1];
    // 构建工具中都是arr，手写可能出现hash情况
    if(Array.isArray(props)) {
      this.props = util.arr2hash(props);
    }
    else {
      this.props = props;
    }
    this.__parent = null;
    this.__host = null;
    this.__ref = {};
    this.state = {};
    this.__isMounted = false;
    this.__taskList = [];
  }

  setState(n, cb) {
    let self = this;
    if(isNil(n)) {
      n = {};
    }
    else if(isFunction(n)) {
      return;
    }
    else {
      if(Object.keys(n).length === 0) {
        if(isFunction(cb)) {
          cb.call(self);
        }
        return;
      }
      let state = clone(self.state);
      n = extend(state, n);
    }
    let root = self.root;
    if(root && self.__isMounted) {
      // 一帧之内多次调用，需合并
      if(self.__nextState) {
        Object.assign(self.__nextState, n);
        self.__taskList.push(cb);
      }
      else {
        self.__nextState = n;
        self.__taskList = [cb];
        // 回调更新列表，before执行时splice出来供after执行，防止中途产生的后续setState干扰
        let list = [];
        let t = self.__task = {
          __before: () => {
            list = self.__taskList.splice(0);
            // 标识更新
            setUpdateFlag(this);
          },
          __after: () => {
            // self.__nextState = null; 由updater.js每次refresh前同步执行清空，这里不能异步清除，否则frame动画会乱序
            list.forEach(cb => {
              if(isFunction(cb)) {
                cb.call(self);
              }
            });
          },
        };
        root.addRefreshCp(t);
      }
    }
    // 构造函数中调用还未render，
    else if(isFunction(cb)) {
      self.state = n;
      cb.call(self);
    }
  }

  /**
   * build中调用初始化，json有值时是update过程才有，且处理过flatten
   * @param json
   * @private
   */
  __init(json) {
    this.__ref = {};
    let root = this.root;
    let cd = json || flatten(this.render());
    let sr = builder.initCp(cd, root, this);
    this.__cd = cd;
    if(sr instanceof Text) {
      // 文字视作为父节点的直接文字子节点，在builder里做
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
    else if(!(sr instanceof Component)) {
      // 本身build是递归的，子cp已经初始化了
      throw new Error('Component render() must return a dom/text: ' + this);
    }
    // 自定义事件无视返回强制添加
    Object.keys(this.props).forEach(k => {
      let v = this.props[k];
      if(/^on-[a-zA-Z\d_$]/.test(k)) {
        k = k.slice(3);
        this.on(k, v);
      }
    });
    // shadow指向直接renderRoot，shadowRoot考虑到返回Component的递归即hoc高阶组件
    // host是直接所属，hostRoot同考虑到高阶组件
    this.__shadow = sr;
    sr.__host = this;
    // 递归下去，多层级时执行顺序由里到外，最终会被最上层执行替换
    while(sr instanceof Component) {
      sr.__hostRoot = this;
      sr.shadow.__host = sr;
      sr = sr.shadow;
    }
    this.__shadowRoot = sr;
    sr.__hostRoot = this;
    if(!this.__isMounted) {
      this.__isMounted = true;
      if(isFunction(this.componentDidMount)) {
        root.once(Event.REFRESH, () => {
          this.componentDidMount();
        });
      }
    }
  }

  render() {
    inject.warn('Component must implement render()');
  }

  __destroy() {
    if(this.isDestroyed) {
      return;
    }
    this.__isDestroyed = true;
    this.__isMounted = false;
    if(isFunction(this.componentWillUnmount)) {
      this.componentWillUnmount();
    }
    this.root.delRefreshTask(this.__task);
    if(this.shadowRoot) {
      this.shadowRoot.__destroy();
    }
    this.__parent = null;
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
  'ox',
  'oy',
  'sx',
  'sy',
  // '__sx1',
  // '__sx2',
  // '__sx3',
  // '__sx4',
  // '__sx5',
  // '__sx6',
  // '__sy1',
  // '__sy2',
  // '__sy3',
  // '__sy4',
  // '__sy5',
  // '__sy6',
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
  'animateStyle',
  'currentStyle',
  'computedStyle',
  'currentProps',
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
  'availableAnimating',
  'effectiveAnimating',
  'displayAnimating',
  'visibilityAnimating',
  'bbox',
  '__config',
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
  '__layoutAbs',
  '__layoutNone',
  '__tryLayInline',
  '__offsetX',
  '__offsetY',
  '__calAutoBasis',
  '__computeReflow',
  '__renderAsMask',
  '__renderByMask',
  '__mp',
  'animate',
  'removeAnimate',
  'clearAnimate',
  'frameAnimate',
  'updateStyle',
  'getBoundingClientRect',
  'getComputedStyle',
  '__deepScan',
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
