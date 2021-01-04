import Node from './Node';
import Text from './Text';
import builder from '../util/builder';
import Event from '../util/Event';
import util from '../util/util';
import inject from '../util/inject';
import css from '../style/css';
import change from '../refresh/change';

const { isNil, isFunction, clone, extend } = util;

/**
 * 向上设置cp类型叶子节点，表明从root到本节点这条链路有更新，使得无链路更新的节约递归
 * @param cp
 */
function setUpdateFlag(cp) {
  // 去重
  if(cp.__hasUpdate) {
    return;
  }
  cp.__hasUpdate = true;
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
    this.__state = {};
    this.__isMounted = false;
    this.__taskList = [];
  }

  setState(n, cb) {
    let self = this;
    if(isNil(n)) {
      n = {};
    }
    else if(isFunction(n)) {
      cb.call(self);
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
        let list = [];
        let t = self.__task = {
          __before: () => {
            list = self.__taskList.splice(0);
            // 标识更新
            setUpdateFlag(this);
          },
          __after: () => {
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
      self.__state = n;
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
    let cd = json || builder.flattenJson(this.render());
    let sr = builder.initCp(cd, root, this);
    this.__cd = cd;
    if(sr instanceof Text) {
      // 文字视作为父节点的直接文字子节点，在builder里做
      inject.warn('Component render() return a text, should not inherit style/event');
    }
    else if(sr instanceof Node) {
      let style = css.normalize(this.props.style);
      let keys = Object.keys(style);
      extend(sr.style, style, keys);
      extend(sr.currentStyle, style, keys);
      // 事件添加到sr，以及自定义事件
      Object.keys(this.props).forEach(k => {
        let v = this.props[k];
        if(/^on[a-zA-Z]/.test(k)) {
          k = k.slice(2).toLowerCase();
          sr.listener[k] = v;
        }
        else if(/^on-[a-zA-Z\d_$]/.test(k)) {
          k = k.slice(3);
          this.on(k, v);
        }
      });
    }
    else if(sr instanceof Component) {
      // 本身build是递归的，子cp已经初始化了
      inject.warn('Component render() return a component: '
        + this.tagName + ' -> ' + sr.tagName
        + ', should not inherit style/event');
    }
    else {
      throw new Error('Component render() must return a dom/text: ' + this);
    }
    // shadow指向直接root，shadowRoot考虑到返回Component的递归
    this.__shadow = sr;
    sr.__host = this;
    while(sr instanceof Component) {
      sr = sr.shadowRoot;
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
    inject.warn('Component must implement render()!');
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
    this.__shadow = null;
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

  __computeMeasure(renderMode, ctx, isHost, cb) {
    let sr = this.shadowRoot;
    if(sr instanceof Text) {
      sr.__computeMeasure(renderMode, ctx);
    }
    // 其它类型为Xom或Component
    else {
      sr.__computeMeasure(renderMode, ctx, true, cb);
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

Object.keys(change.GEOM).concat([
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
  'baseLine',
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
  '__calMp',
  '__calAbs',
  '__renderAsMask',
  '__renderByMask',
  '__mp',
  'animate',
  'removeAnimate',
  'clearAnimate',
  'updateStyle',
  'getBoundingClientRect',
  'getComputedStyle',
  '__deepScan',
  '__cancelCache',
  '__structure',
  '__modifyStruct',
  '__updateStruct',
].forEach(fn => {
  Component.prototype[fn] = function() {
    let sr = this.shadowRoot;
    if(sr && isFunction(sr[fn])) {
      return sr[fn].apply(sr, arguments);
    }
  };
});

export default Component;
