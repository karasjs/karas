import Dom from './Dom';
import Text from './Text';
import Component from './Component';
import Defs from './Defs';
import mode from './mode';
import builder from '../util/builder';
import updater from '../util/updater';
import util from '../util/util';
import diff from '../util/diff';
import css from '../style/css';
import unit from '../style/unit';
import inject from '../util/inject';
import Event from '../util/Event';
import frame from '../animate/frame';
import Controller from '../animate/Controller';
import change from '../refresh/change';
import level from '../refresh/level';

const { isNil, isObject, isFunction } = util;
const { AUTO, PX, PERCENT } = unit;
const { calRelative, isRelativeOrAbsolute } = css;

function getDom(dom) {
  if(util.isString(dom) && dom) {
    let o = document.querySelector(dom);
    if(!o) {
      throw new Error('Can not find dom of selector: ' + dom);
    }
    return o;
  }
  if(!dom) {
    throw new Error('Can not find dom: ' + dom);
  }
  return dom;
}

function renderProp(k, v) {
  let s = Array.isArray(v) ? util.joinSourceArray(v) : util.stringify(v);
  if(k === 'className') {
    k = 'class';
  }
  return ' ' + k + '="' + util.encodeHtml(s, true) + '"';
}

function initEvent(dom) {
  ['click', 'dblclick', 'mousedown', 'mousemove', 'mouseup', 'touchstart', 'touchmove', 'touchend', 'touchcancel'].forEach(type => {
    dom.addEventListener(type, e => {
      let root = dom.__root;
      if(['touchend', 'touchcancel', 'touchmove'].indexOf(type) > -1) {
        root.__touchstartTarget.__emitEvent(root.__wrapEvent(e), true);
      }
      else {
        root.__cb(e);
      }
    });
  });
}

// 提取出对比节点尺寸是否修改，用currentStyle的对比computedStyle的
function isFixedWidthOrHeight(node, root, k) {
  let c = node.currentStyle[k];
  let v = node.computedStyle[k];
  if(c.unit === PX) {
    return c.value === v;
  }
  if(c.unit === PERCENT) {
    let parent = findParentNotComponent(node, root);
    let s = parent.layoutData[k === 'width' ? 'w' : 'h'];
    return c.value * s * 0.01 === v;
  }
  return false;
}
function isFixedSize(node, root) {
  return isFixedWidthOrHeight(node, root, 'width') && isFixedWidthOrHeight(node, root, 'height');
}

function findParentNotComponent(node, root) {
  if(node === root || !node) {
    return node;
  }
  if(node.host) {
    return findParentNotComponent(node.host, root);
  }
  return node.parent;
}

const OFFSET = 0;
const LAYOUT = 1;
function isLAYOUT(node, hash) {
  return node.hasOwnProperty('__uniqueReflowId') && hash[node.__uniqueReflowId] >= LAYOUT;
}

function setLAYOUT(node, hash) {
  addLAYOUT(node, hash);
  hash[node.__uniqueReflowId].lv |= LAYOUT;
}

let __uniqueReflowId = 0;
function addLAYOUT(node, hash) {
  if(!node.hasOwnProperty('__uniqueReflowId')) {
    node.__uniqueReflowId = __uniqueReflowId;
    hash[__uniqueReflowId++] = {
      node,
      lv: LAYOUT,
    };
  }
}

let uuid = 0;

class Root extends Dom {
  constructor(tagName, props, children) {
    super(tagName, props);
    this.__cd = children || []; // 原始children，再初始化过程中生成真正的dom
    this.__dom = null; // 真实DOM引用
    this.__mw = 0; // 记录最大宽高，防止尺寸变化清除不完全
    this.__mh = 0;
    this.__sx = 1; // 默认缩放，css改变canvas/svg缩放后影响事件坐标
    this.__sy = 1;
    this.__task = [];
    this.__ref = {};
    this.__updateList = [];
    this.__reflowList = [{ node: this }]; // 初始化填自己，第一次布局时复用逻辑完全重新布局
    this.__animateController = new Controller();
    Event.mix(this);
  }

  __initProps() {
    let w = this.props.width;
    if(!isNil(w)) {
      let value = parseFloat(w) || 0;
      if(value > 0) {
        this.__width = value;
      }
    }
    let h = this.props.height;
    if(!isNil(h)) {
      let value = parseFloat(h) || 0;
      if(value > 0) {
        this.__height = value;
      }
    }
    this.__offScreen = !!this.props.offScreen;
  }

  __genHtml() {
    let res = `<${this.tagName}`;
    // 拼接处理属性
    Object.keys(this.props).forEach(k => {
      let v = this.props[k];
      // 忽略事件
      if(!/^on[a-zA-Z]/.test(k)) {
        res += renderProp(k, v);
      }
    });
    res += `></${this.tagName}>`;
    return res;
  }

  __wrapEvent(e) {
    let x, y;
    // 触摸结束取消特殊没有touches
    if(['touchend', 'touchcancel'].indexOf(e.type) === -1) {
      let { dom, __sx, __sy } = this;
      let { x: x2, y: y2, left, top } = dom.getBoundingClientRect();
      x = x2 || left || 0;
      y = y2 || top || 0;
      let { pageX, pageY } = e.touches ? e.touches[0] : e;
      x = pageX - x;
      y = pageY - y;
      // 外边的scale影响元素事件响应，根据倍数计算真实的坐标
      if(__sx !== 1) {
        x /= __sx;
      }
      if(__sy !== 1) {
        y /= __sy;
      }
    }
    return {
      event: e,
      stopPropagation() {
        this.__stopPropagation = true;
        e.stopPropagation();
      },
      stopImmediatePropagation() {
        this.__stopPropagation = true;
        this.__stopImmediatePropagation = true;
        e.stopImmediatePropagation();
      },
      preventDefault() {
        e.preventDefault();
      },
      x,
      y,
      __hasEmitted: false,
    };
  }

  // 类似touchend/touchcancel/touchmove这种无需判断是否发生于元素上，直接响应
  __cb(e) {
    if(e.type === 'touchmove' && !this.__touchstartTarget) {
      return;
    }
    let data = this.__wrapEvent(e);
    this.__emitEvent(data);
    return data;
  }

  appendTo(dom) {
    dom = getDom(dom);
    this.__children = builder.initRoot(this.__cd, this);
    this.__initProps();
    this.__root = this;
    // 已有root节点
    if(dom.nodeName.toUpperCase() === this.tagName.toUpperCase()) {
      this.__dom = dom;
      if(this.width) {
        dom.setAttribute('width', this.width);
      }
      if(this.height) {
        dom.setAttribute('height', this.height);
      }
    }
    // 没有canvas/svg节点则生成一个新的
    else {
      this.__dom = dom.querySelector(this.tagName);
      if(!this.__dom) {
        dom.innerHTML = this.__genHtml();
        this.__dom = dom.querySelector(this.tagName);
      }
    }
    this.__uuid = isNil(this.__dom.__uuid) ? uuid++ : this.__dom.__uuid;
    this.__defs = this.dom.__defs || Defs.getInstance(this.__uuid);
    // 没有设置width/height则采用css计算形式
    if(!this.width || !this.height) {
      let css = window.getComputedStyle(dom, null);
      if(!this.width) {
        this.__width = parseFloat(css.getPropertyValue('width')) || 0;
        dom.setAttribute('width', this.width);
      }
      if(!this.height) {
        this.__height = parseFloat(css.getPropertyValue('height')) || 0;
        dom.setAttribute('height', this.height);
      }
    }
    // 只有canvas有ctx，svg用真实dom
    if(this.tagName === 'canvas') {
      this.__ctx = this.__dom.getContext('2d');
      this.__renderMode = mode.CANVAS;
    }
    else if(this.tagName === 'svg') {
      this.__renderMode = mode.SVG;
    }
    this.refresh(null, true);
    // 第一次节点没有__root，渲染一次就有了才能diff
    if(this.dom.__root) {
      this.dom.__root.destroy();
    }
    else {
      initEvent(this.dom);
      this.dom.__uuid = this.__uuid;
    }
    this.dom.__root = this;
  }

  refresh(cb, isFirst) {
    let { isDestroyed, renderMode, ctx, defs, width, height } = this;
    if(isDestroyed) {
      return;
    }
    defs.clear();
    // 首次递归测量整树的继承，后续更改各自更新机制做，防止每次整树遍历；root检查首次直接做，后续在checkUpdate()中插入
    if(isFirst) {
      this.__checkRoot(width, height);
      this.__computeMeasure(renderMode, ctx);
    }
    // 非首次刷新如果没有更新则无需继续
    else if(this.__checkUpdate(renderMode, ctx, width, height)) {
      return;
    }
    // 获取所有字体和大小测量，一般是同步，为了防止外部因素inject是异步写成了cb形式
    inject.measureText(() => {
      this.__checkReflow(width, height);
      if(renderMode === mode.CANVAS) {
        this.__clear(ctx);
      }
      this.render(renderMode, ctx, defs);
      if(renderMode === mode.SVG) {
        let nvd = this.virtualDom;
        nvd.defs = defs.value;
        if(this.dom.__root) {
          diff(this.dom, this.dom.__vd, nvd);
        }
        else {
          this.dom.innerHTML = util.joinVirtualDom(nvd);
        }
        this.dom.__vd = nvd;
        this.dom.__defs = defs;
      }
      // 特殊cb，供小程序绘制完回调使用
      if(isFunction(cb)) {
        cb();
      }
      this.emit(Event.REFRESH);
    });
  }

  destroy() {
    this.__destroy();
    frame.offFrame(this.__rTask);
    let n = this.dom;
    if(n) {
      n.__root = null;
    }
  }

  scale(x = 1, y = x) {
    this.__sx = x;
    this.__sy = y;
  }

  addRefreshTask(cb) {
    if(!cb) {
      return;
    }
    let { task, renderMode, ctx } = this;
    // 第一个添加延迟侦听，后续放队列等待一并执行
    if(!task.length) {
      let clone;
      frame.nextFrame(this.__rTask = {
        before: diff => {
          clone = task.splice(0);
          // 前置一般是动画计算此帧样式应用，然后刷新后出发frame事件，图片加载等同
          if(clone.length) {
            let setStateList = [];
            clone.forEach((item, i) => {
              if(isObject(item) && isFunction(item.before)) {
                // 收集组件setState的更新，特殊处理
                if(item.__state) {
                  setStateList.push(i);
                }
                item.before(diff);
              }
            });
            // 刷新前先进行setState检查，全都是setState触发的且没有更新则无需刷新
            if(setStateList.length) {
              updater.check(this);
            }
            // 有组件更新，则需要重新布局
            let len = updater.updateList.length;
            if(len) {
              updater.updateList.forEach(cp => {
                let sr = cp.shadowRoot;
                while(sr instanceof Component) {
                  sr = sr.shadowRoot;
                }
                this.__addUpdate({
                  node: sr,
                  style: sr.currentStyle,
                  focus: level.REFLOW,
                  measure: true, // 未知强制measure
                });
              });
              this.refresh();
            }
            // 有可能组件都不需要更新，且没有其它触发的渲染更新
            else if(clone.length > setStateList.length) {
              this.refresh();
            }
            // 避免重复刷新，在frame每帧执行中，比如图片进行了异步刷新，动画的hook就可以省略再刷新一次
            let r = this.__hookTask;
            if(r) {
              let hookTask = frame.__hookTask;
              let i = hookTask.indexOf(r);
              if(i > -1) {
                hookTask.splice(i, 1);
              }
            }
            // 触发didUpdate
            updater.did();
          }
        },
        after: diff => {
          clone.forEach(item => {
            if(isObject(item) && isFunction(item.after)) {
              item.after(diff);
            }
            else if(isFunction(item)) {
              item(diff);
            }
          });
        }
      });
    }
    if(task.indexOf(cb) === -1) {
      task.push(cb);
    }
  }

  delRefreshTask(cb) {
    if(!cb) {
      return;
    }
    let { task } = this;
    for(let i = 0, len = task.length; i < len; i++) {
      if(task[i] === cb) {
        task.splice(i, 1);
        break;
      }
    }
    if(!task.length) {
      frame.offFrame(this.__rTask);
    }
  }

  /**
   * 每次刷新前检查root节点的样式，有些固定的修改无效，有些继承的作为根初始化
   * @param width
   * @param height
   * @private
   */
  __checkRoot(width, height) {
    let { currentStyle, computedStyle } = this;
    // canvas/svg作为根节点一定是block或flex，不会是inline
    if(['flex', 'block'].indexOf(currentStyle.display) === -1) {
      computedStyle.display = currentStyle.display = 'block';
    }
    // 同理position不能为absolute
    if(currentStyle.positoin === 'absolute') {
      computedStyle.position = currentStyle.positoin = 'static';
    }
    // 根节点满宽高
    currentStyle.width = {
      value: width,
      unit: PX,
    };
    currentStyle.height = {
      value: height,
      unit: PX,
    };
    computedStyle.width = width;
    computedStyle.height = height;
    // 继承值变默认，提前处理以便子节点根据parent计算
    css.computeMeasure(this, true);
  }

  __addUpdate(o) {
    this.__updateList.push(o);
  }

  /**
   * 除首次外每次刷新前检查更新列表，计算样式变化，以及测量信息
   * @private
   */
  __checkUpdate(renderMode, ctx, width, height) {
    let { __updateList: updateList } = this;
    let hasUpdate;
    // 先按node合并所有样式的更新，一个node可能有多次更新调用，每个node临时生成一个更新id和更新style合集
    let totalList = [];
    let totalHash = {};
    let uniqueUpdateId = 0;
    updateList.forEach(item => {
      let { node, style, origin, overwrite, focus, img, measure } = item;
      // 事件队列和setState等原因，可能node已经销毁
      if(node.isDestroyed) {
        return;
      }
      if(!node.hasOwnProperty('__uniqueUpdateId')) {
        node.__uniqueUpdateId = uniqueUpdateId;
        totalHash[uniqueUpdateId++] = {
          node,
          style: {},
          focus,
          img,
          measure,
        };
        totalList.push(node);
      }
      // updateStyle()这样的调用还要计算normalize
      if(origin && style) {
        style = css.normalize(style);
      }
      // updateStyle()这样的调用需要覆盖原有样式，因为是按顺序遍历，后面的优先级自动更高不怕重复
      if(overwrite && style) {
        Object.assign(node.__style, style);
      }
      if(style) {
        Object.assign(totalHash[node.__uniqueUpdateId].style, style);
      }
    });
    // 此时做root检查，防止root出现继承等无效样式
    this.__checkRoot(width, height);
    // 合并完后按node计算更新的结果，无变化/reflow/repaint等级
    let measureList = [];
    let reflowList = [];
    for(let i = 0, len = totalList.length; i < len; i++) {
      let node = totalList[i];
      let { tagName, __uniqueUpdateId, currentStyle, currentProps, __cacheStyle = {}, __cacheProps = {} } = node;
      let lv = level.NONE;
      let p;
      let { style, focus, img, measure } = totalHash[__uniqueUpdateId];
      if(img) {
        lv |= level.REPAINT;
      }
      let hasMeasure = measure;
      let hasZ;
      for(let k in style) {
        if(style.hasOwnProperty(k)) {
          let v = style[k];
          // 只有geom的props和style2种可能
          if(change.isGeom(tagName, k)) {
            if(!css.equalStyle(k, v, currentProps[k], node)) {
              hasUpdate = true;
              this.renderMode === mode.SVG && node.__cancelCacheSvg();
              p = p || {};
              p[k] = style[k];
              lv |= level.REPAINT;
              __cacheProps[k] = undefined;
            }
          }
          else {
            if(k === 'zIndex') {
              hasZ = true;
            }
            // 需和现在不等，且不是pointerEvents这种无关的
            if(!css.equalStyle(k, v, currentStyle[k], node)) {
              this.renderMode === mode.SVG && node.__cancelCacheSvg();
              // pointerEvents这种无关的只需更新
              if(change.isIgnore(k)) {
                __cacheStyle[k] = undefined;
                currentStyle[k] = v;
              }
              else {
                hasUpdate = true;
                // 只粗略区分出none/repaint/reflow，repaint细化等级在后续，reflow在checkReflow()
                lv |= level.getLevel(k);
                if(change.isMeasure(k)) {
                  hasMeasure = true;
                }
                // repaint置空，如果reflow会重新生成空的
                __cacheStyle[k] = undefined;
                currentStyle[k] = v;
              }
            }
          }
        }
      }
      if(p) {
        Object.assign(currentProps, p);
      }
      if(style) {
        Object.assign(currentStyle, style);
      }
      if(focus !== undefined) {
        hasUpdate = true;
        lv = level.focus;
      }
      // 无需任何改变处理的去除记录，如pointerEvents
      if(lv === level.NONE) {
        delete node.__uniqueUpdateId;
        totalList.splice(i, 1);
        i--;
        len--;
        continue;
      }
      // reflow/repaint/measure相关的记录下来
      let isRepaint = level.isRepaint(lv);
      if(isRepaint) {
        // zIndex变化需清空svg缓存
        if(hasZ && renderMode === mode.SVG) {
          node.__cancelCacheSvg(true);
        }
        else {
          node.__cancelCacheSvg();
        }
        // TODO: repaint级别在node有缓存对象时赋予它，没有说明无缓存无作用
        // if(node.__cache) {
        //   node.__cache.lv = level.getDetailLevel(style, lv);
        // }
      }
      // reflow在root的refresh中做
      else {
        reflowList.push({
          node,
          style,
          img,
        });
        // measure需要提前先处理
        if(hasMeasure) {
          measureList.push(node);
        }
      }
    }
    this.__updateList = [];
    // 没有更新的内容返回true
    if(!hasUpdate) {
      totalList.forEach(node => {
        delete node.__uniqueUpdateId;
      });
      return true;
    }
    this.__reflowList = reflowList;
    /**
     * 遍历每项节点，计算测量信息，节点向上向下查找继承信息，如果parent也是继承，先计算parent的
     * 过程中可能会出现重复，因此节点上记录一个临时标防止重复递归
     */
    let measureHash = {};
    measureList.forEach(node => {
      let { __uniqueUpdateId, parent } = node;
      if(measureHash.hasOwnProperty(__uniqueUpdateId)) {
        return;
      }
      measureHash[__uniqueUpdateId] = true;
      let last = node;
      // 检查measure的属性是否是inherit
      let isInherit = change.isMeasureInherit(totalHash[__uniqueUpdateId].style);
      // 是inherit，需要向上查找，从顶部向下递归计算继承信息
      if(isInherit) {
        while(parent) {
          let { __uniqueUpdateId, currentStyle } = parent;
          let style = totalHash[__uniqueUpdateId];
          let isInherit;
          if(parent.hasOwnProperty('__uniqueUpdateId')) {
            measureHash[__uniqueUpdateId] = true;
            let temp = change.measureInheritList(style);
            temp.forEach(k => {
              currentStyle[k] = style[k];
              // 已经赋值过的删除避免重复
              delete style[k];
            });
            isInherit = !!temp.length;
          }
          else {
            isInherit = change.isMeasureInherit(currentStyle);
          }
          // 如果parent有inherit存入列表且继续向上，否则跳出循环
          if(isInherit) {
            last = parent;
          }
          else {
            break;
          }
          // 考虑component下的继续往上继承，一定不会有root，因为root已前置checkRoot()
          parent = findParentNotComponent(parent, this);
        }
      }
      // 自顶向下查找inherit的，利用已有的方法+回调
      last.__computeMeasure(renderMode, ctx, function(target) {
        if(target.hasOwnProperty('__uniqueUpdateId')) {
          measureHash[target.__uniqueUpdateId] = true;
        }
      });
    });
    totalList.forEach(node => {
      delete node.__uniqueUpdateId;
    });
  }

  /**
   * 除首次外每次刷新前检查reflow列表，计算需要reflow的节点局部重新布局
   * 当一个元素absolute时，其变化不会影响父元素和兄弟元素，直接自己重新局部LAYOUT包含子节点
   * 当inline变化时，视为其最近block/flex父变化
   * 当block变化时，如父是flex往上查找最上层flex视为其变化，如不是则影响后面兄弟和父resize
   * 当flex变化时，如父是flex往上查找最上层flex视为其变化，如不是则影响所有递归子节点和父resize
   * 以上3种情况向上查找时遇到absolute父均提前跳出，并标记absolute父LAYOUT
   * 当relative只变化left/top/right/bottom时，自己重新layout
   * 检测节点时记录影响的所有节点，最终形成一棵或n棵局部树
   * 一般需要重新布局的记作LAYOUT，被兄弟影响只需偏移的记作OFFSET，OFFSET可能会重复变为LAYOUT
   * 上述情况倘若发生包含重复，去掉子树，因子树视为被包含的重新布局
   * 如果有从root开始的，直接重新布局像首次那样即可
   * 如果非root，所有树根按先根顺序记录下来，依次执行局部布局
   * @private
   */
  __checkReflow(width, height) {
    let { __reflowList: reflowList } = this;
    let root = this;
    let hasRoot;
    __uniqueReflowId = 0;
    let reflowHash = {};

    // 单独提出共用检测影响的函数，非absolute和relative的offset情况从节点本身开始向上分析影响
    function checkInfluence(node) {
      // 自身尺寸固定且无变化，无需向上查找
      if(isFixedSize(node, root)) {
        return;
      }
      // cp强制刷新
      if(node instanceof Component) {
        return;
      }
      let target = node;
      // inline新老都影响，节点变为最近的父非inline
      if(node.currentStyle.display === 'inline' || node.computedStyle.display === 'inline') {
        let parent = findParentNotComponent(node, root);
        do {
          target = parent;
          // 父到root提前跳出
          if(parent === root) {
            return true;
          }
          // 父已有LAYOUT跳出防重
          if(isLAYOUT(parent, reflowHash)) {
            return;
          }
          // 遇到absolute跳出，如果absolute发生变化，一定会存在于列表中，不用考虑
          if(parent.currentStyle.position === 'absolute' || parent.computedStyle.position === 'absolute') {
            setLAYOUT(parent, reflowHash);
            return;
          }
          // 父固定宽度跳出直接父进行LAYOUT即可
          if(isFixedSize(parent)) {
            setLAYOUT(parent, reflowHash);
            return;
          }
          // 继续向上
          parent = findParentNotComponent(parent, root);
        }
        while(parent && (parent.currentStyle.display === 'inline' || parent.computedStyle.display === 'inline'));
        // target至少是node的parent，如果固定尺寸提前跳出
        if(isFixedSize(target)) {
          setLAYOUT(target, reflowHash);
          return;
        }
      }
      // 此时target指向node，如果原本是inline则是其非inline父
      let parent = target.parent;
      // parent有LAYOUT跳出，已被包含
      if(parent && isLAYOUT(parent, reflowHash)) {
        return;
      }
      // 检查flex，如果父是flex，向上查找flex顶点视作其更改
      if(parent && (parent.computedStyle.display === 'flex' || parent.currentStyle.display === 'flex')) {
        do {
          target = parent;
          if(parent === root) {
            return true;
          }
          if(isLAYOUT(parent, reflowHash)) {
            return;
          }
          if(parent.currentStyle.position === 'absolute' || parent.computedStyle.position === 'absolute') {
            setLAYOUT(parent, reflowHash);
            return;
          }
          if(isFixedSize(parent)) {
            setLAYOUT(parent, reflowHash);
            return;
          }
          parent = findParentNotComponent(parent, root);
        }
        while(parent && (parent.computedStyle.display === 'flex' || parent.currentStyle.display === 'flex'));
        // target至少是node的parent，如果固定尺寸提前跳出
        if(isFixedSize(target)) {
          setLAYOUT(target, reflowHash);
          return;
        }
      }
      // 此时target指向node，如果父原本是flex则是其最上flex父
      parent = target.parent;
      // parent有LAYOUT跳出，已被包含
      if(parent && isLAYOUT(parent, reflowHash)) {
        return;
      }
      // 向上查找了并且没提前跳出的，父重新布局
      if(target !== node) {
        setLAYOUT(target, reflowHash);
      }
    }

    // TODO text变parent dom

    // 遍历检查发生布局改变的节点列表，此时computedStyle还是老的，currentStyle是新的
    for(let i = 0, len = reflowList.length; i < len; i++) {
      let { node, style, img } = reflowList[i];
      // root提前跳出，完全重新布局
      if(node === this) {
        hasRoot = true;
        break;
      }
      let { currentStyle, computedStyle } = node;
      // 每个节点生成唯一的布局识别id存入hash防止重复
      if(!node.hasOwnProperty('__uniqueReflowId')) {
        node.__uniqueReflowId = __uniqueReflowId;
        reflowHash[__uniqueReflowId++] = {
          node,
          lv: OFFSET,
        };
      }
      let o = reflowHash[node.__uniqueReflowId];
      // absolute无变化，只影响自己
      if(currentStyle.position === 'absolute' && computedStyle.position === 'absolute') {
        o.lv = LAYOUT;
      }
      // absolute和非absolute互换
      else if(currentStyle.position !== computedStyle.position) {
        o.lv = LAYOUT;
        if(checkInfluence(node)) {
          hasRoot = true;
          break;
        }
      }
      // 所有其它变化
      else {
        let keys = Object.keys(style);
        let onlyXY = true;
        for(let i = 0, len = keys.length; i < len; i++) {
          let k = keys[i];
          if(k !== 'left' && k !== 'top' && k !== 'right' && k !== 'bottom') {
            onlyXY = false;
            break;
          }
        }
        // relative只有x/y变化时特殊只进行OFFSET，非relative的忽视掉这个无用影响
        if(onlyXY && !img) {
          if(computedStyle.position === 'relative') {
            o.lv |= OFFSET;
          }
        }
        // 剩余的其它变化
        else {
          o.lv = LAYOUT;
          if(checkInfluence(node)) {
            hasRoot = true;
            break;
          }
        }
      }
    }
    __uniqueReflowId = 0;
    this.__reflowList = [];
    // 有root提前跳出
    if(hasRoot) {
      reflowList.forEach(item => delete item.node.__uniqueReflowId);
      // 布局分为两步，普通流和定位流，互相递归
      this.__layout({
        x: 0,
        y: 0,
        w: width,
        h: height,
      });
      // 绝对布局需要从根开始保存相对坐标系的容器引用，并根据relative/absolute情况变更
      this.__layoutAbs(this, {
        x: 0,
        y: 0,
        w: width,
        h: height,
      });
      return [reflowList, [{
        node: this,
        lv: LAYOUT,
      }]];
    }
    /**
     * 修剪树，自顶向下深度遍历
     * LAYOUT节点作为局部根，其递归子节点无需重复任何操作去重
     * OFFSET节点作为局部根，其递归子节点先执行任何操作，后续根节点再偏移一次
     */
    else {
      let uniqueList = [];
      this.deepScan(function(node, options) {
        if(node.hasOwnProperty('__uniqueReflowId')) {
          let o = reflowHash[node.__uniqueReflowId];
          delete node.__uniqueReflowId; // 清除掉
          if(o.lv >= LAYOUT) {
            options.uniqueList.push(o);
          }
          else {
            // OFFSET的话先递归看子节点，本身改变放在最后
            let uniqueList = [];
            node.deepScan(function(child, uniqueList) {}, { uniqueList });
            uniqueList.forEach(item => {
              options.uniqueList.push(item);
            });
            options.uniqueList.push(o);

          }
          // 返回true即可提前结束深度遍历，在reflowHash有记录时提前跳出，子节点交由上面逻辑执行
          return true;
        }
        // reflowHash没有记录则无返回继续递归执行
      }, { uniqueList });
      // 按顺序执行列表即可，上层LAYOUT先执行停止递归子节点，上层OFFSET后执行等子节点先LAYOUT/OFFSET
      uniqueList.forEach(item => {
        let { node, lv } = item;
        // 重新layout的w/h数据使用之前parent暂存的，x使用parent，y使用prev或者parent的
        if(lv >= LAYOUT) {
          let isLastAbs = node.computedStyle.position === 'absolute';
          let isNowAbs = node.currentStyle.position === 'absolute';
          let parent = findParentNotComponent(node, root);
          let { layoutData: { x, y, w, h }, width, ox, oy, computedStyle } = parent;
          let ref;
          if(ref = node.prev) {
            y = ref.y;
            y += ref.outerHeight;
          }
          else {
            y = parent.y;
            y += computedStyle.marginTop + computedStyle.borderTopWidth + computedStyle.paddingTop;
          }
          x += computedStyle.marginLeft + computedStyle.borderLeftWidth + computedStyle.paddingLeft;
          let { outerWidth, outerHeight } = node;
          // 找到最上层容器，如果是组件的子节点，以sr为container，sr本身往上找
          let container = node;
          if(isNowAbs) {
            while(!container.parent && container.host) {
              container = container.host; // 先把可能递归嵌套的组件循环完
            }
            container = container.parent;
            while(container && container !== root) {
              if(isRelativeOrAbsolute) {
                break;
              }
              if(container.parent) {
                container = container.parent;
              }
              else if(container.host) {
                break;
              }
            }
            if(!container) {
              container = root;
            }
            parent.__layoutAbs(container, null, node);
            // 一直abs无需偏移后面兄弟
            if(isLastAbs) {
              return;
            }
          }
          else {
            node.__layout({
              x,
              y,
              w: width,
              h,
            });
            if(node instanceof Dom) {
              if(!node.parent && node.host) {
                container = node; // 特殊判断component的sr为container
              }
              node.__layoutAbs(container, {
                x,
                y,
                w: width,
                h,
              });
            }
          }
          // 记录重新布局引发的差值w/h
          let { outerWidth: ow, outerHeight: oh } = node;
          let dx = ow - outerWidth;
          let dy = oh - outerHeight;
          // 如果parent是relative，需再次累加ox/oy，无需向上递归，因为parent已经包含了
          if(computedStyle.position === 'relative') {
            ox && node.__offsetX(ox);
            oy && node.__offsetY(oy);
          }
          // 如果有差值，递归向上所有parent需要扩充，直到absolute的中止
          if(dx || dy) {
            do {
              let { currentStyle } = parent;
              if(dx) {
                let need;
                // width在block不需要，parent一定不会是flex/inline
                if(currentStyle.positoin === 'absolute') {
                  if(currentStyle.width.unit === AUTO
                    && (currentStyle.left.unit === AUTO || currentStyle.right.unit === AUTO)) {
                    need = true;
                  }
                }
              }
              if(dy) {
                let need;
                if(currentStyle.positoin === 'absolute') {
                  if(currentStyle.height.unit === AUTO
                    && (currentStyle.top.unit === AUTO || currentStyle.bottom.unit === AUTO)) {
                    need = true;
                  }
                }
                // height则需要
                else if(currentStyle.height.unit === AUTO) {
                  need = true;
                }
                if(need) {
                  parent.__resizeY(dy);
                  parent.__cancelCache(true);
                }
              }
              if(currentStyle.positoin === 'absolute') {
                break;
              }
              parent = findParentNotComponent(parent);
            }
            while(parent);
          }
          if(dy) {
            // 后面兄弟如果非absolute或非LAYOUT则offsetY
            let next = node.next;
            while(next) {
              if(next.currentStyle.position !== 'absolute'
                || !next.hasOwnProperty('____uniqueReflowId')
                || reflowHash[next.____uniqueReflowId].lv < LAYOUT) {
                next.__offsetY(dy, true);
                next.layoutData.y += dy;
                next.__cancelCache(true);
              }
              next = next.next;
            }
          }
        }
        // OFFSET操作的节点都是relative，要考虑auto变化
        else {
          let {
            currentStyle: { top, right, bottom, left }, currentStyle,
            computedStyle: { top: t, right: r, bottom: b, left: l }, computedStyle,
          } = node;
          let parent;
          if(node === this) {
            parent = node;
          }
          else {
            parent = findParentNotComponent(node, root);
          }
          let newY = 0;
          if(top.unit !== AUTO) {
            newY = calRelative(currentStyle, 'top', top, parent);
            computedStyle.top = newY;
            computedStyle.bottom = 'auto';
          }
          else if(bottom.unit !== AUTO) {
            newY = -calRelative(currentStyle, 'bottom', bottom, parent);
            computedStyle.bottom = -newY;
            computedStyle.top = 'auto';
          }
          else {
            computedStyle.top = computedStyle.bottom = 'auto';
          }
          let oldY = 0;
          if(t !== 'auto') {
            oldY = t;
          }
          else if(b !== 'auto') {
            oldY = -b;
          }
          if(newY !== oldY) {
            node.__offsetY(newY - oldY);
          }
          let newX = 0;
          if(left.unit !== AUTO) {
            newX = calRelative(currentStyle, 'left', left, parent);
            computedStyle.left = newX;
            computedStyle.right = 'auto';
          }
          else if(right.unit !== AUTO) {
            newX = -calRelative(currentStyle, 'right', right, parent);
            computedStyle.right = -newX;
            computedStyle.left = 'auto';
          }
          else {
            computedStyle.left = computedStyle.right = 'auto';
          }
          let oldX = 0;
          if(l !== 'auto') {
            oldX = l;
          }
          else if(r !== 'auto') {
            oldX = -r;
          }
          if(newX !== oldX) {
            node.__offsetX(newX - oldX);
          }
        }
      });
      reflowList.forEach(item => delete item.node.__uniqueReflowId);
      return [reflowList, uniqueList];
    }
  }

  // 特殊覆盖方法，不需要super()计算自己，因为放在每次checkRoot()做过了
  __computeMeasure(renderMode, ctx) {
    css.computeMeasure(this, true);
    this.children.forEach(item => {
      item.__computeMeasure(renderMode, ctx);
    });
  }

  __frameHook() {
    // 每个root拥有一个刷新hook，多个root塞到frame的__hookTask里
    // frame在所有的帧刷新逻辑执行后检查hook列表，进行root刷新操作
    let r = this.__hookTask = this.__hookTask || (() => {
      this.refresh();
    });
    if(frame.__hookTask.indexOf(r) === -1) {
      frame.__hookTask.push(r);
    }
  }

  __clear(ctx) {
    // 可能会调整宽高，所以每次清除用最大值
    this.__mw = Math.max(this.__mw, this.width);
    this.__mh = Math.max(this.__mh, this.height);
    // 清除前得恢复默认matrix，防止每次布局改变了属性
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.__mw, this.__mh);
  }

  get dom() {
    return this.__dom;
  }

  get renderMode() {
    return this.__renderMode;
  }

  get ctx() {
    return this.__ctx;
  }

  get offScreen() {
    return this.__offScreen;
  }

  get defs() {
    return this.__defs;
  }

  get task() {
    return this.__task;
  }

  get ref() {
    return this.__ref;
  }

  get animateController() {
    return this.__animateController;
  }
}

export default Root;
