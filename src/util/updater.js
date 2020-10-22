import util from './util';
import builder from './builder';
import $$type from './$$type';

const { TYPE_VD, TYPE_GM, TYPE_CP } = $$type;

let Xom, Dom, Img, Geom, Component;

let updateList = [];
let removeList = [];

const KEY_FLAG = {};

/**
 * setState后刷新前先根遍历检查组件开始进行shouldComponentUpdate判断
 */
function check(vd) {
  if(vd instanceof Dom) {
    vd.children.forEach(child => {
      if(child instanceof Dom) {
        check(child);
      }
      // 当组件有setState更新时，从叶子到根链路会标识__hasUpdate，以便节约遍历成本忽略那些没变化的链路
      else if(child instanceof Component && child.__hasUpdate) {
        child.__hasUpdate = false;
        checkCp(child, child.props);
      }
    });
  }
}

/**
 * 检查cp是否有state变更
 * @param cp
 * @param nextProps
 * @param forceCheckUpdate，被render()后的json的二级组件，发现props有变更强制检查更新，否则可以跳过
 */
function checkCp(cp, nextProps, forceCheckUpdate) {
  if(cp.__nextState || forceCheckUpdate) {
    let shouldUpdate;
    if(util.isFunction(cp.shouldComponentUpdate)) {
      shouldUpdate = cp.shouldComponentUpdate(nextProps, cp.__nextState || cp.state);
    }
    else {
      // 没有默认更新
      shouldUpdate = true;
    }
    if(shouldUpdate) {
      updateCp(cp, nextProps, cp.__nextState || cp.state);
    }
    // 不更新则递归检查子tree的cp
    else {
      check(cp.shadowRoot);
    }
  }
  else {
    check(cp.shadowRoot);
  }
}

/**
 * 更新组件的props和state，清空__nextState
 * @param cp
 * @param props
 * @param state
 */
function updateCp(cp, props, state) {
  cp.props = props;
  cp.__state = state;
  cp.__nextState = null;
  let oldSr = cp.shadowRoot;
  let oldJson = cp.__cd;
  let json = builder.flattenJson(cp.render());
  // 对比新老render()返回的内容，更新后重新生成sr
  diffSr(oldSr, oldJson, json);
  cp.__init(json);
  // 为了局部dom布局需要知道老的css信息
  let sr = cp.shadowRoot;
  if(sr instanceof Xom) {
    sr.__width = oldSr.width;
    sr.__height = oldSr.height;
    sr.__computedStyle = oldSr.computedStyle;
    sr.__layoutData = oldSr.layoutData;
  }
  else {
    sr.__parent = oldSr.parent;
  }
  updateList.push(cp);
  // 老的需回收，diff会生成新的dom，唯一列外是cp直接返回一个没变化的cp
  if(!util.isObject(json) || !json.placeholder) {
    removeList.push(oldSr);
  }
  // 子组件使用老的json时标识，更新后删除，render()返回空会没json对象
  if(json && json.placeholder) {
    delete json.placeholder;
  }
}

/**
 * 非一级组件sr进行对比，key相同的无需重新生成且继承动画
 * @param vd
 * @param oj oldJson
 * @param nj
 */
function diffSr(vd, oj, nj) {
  // 先遍历检查key相同的，将没有变化的key暂存下来，深度优先，这样叶子节点出现在前面，当key的叶子也有key时，确保叶子先对比
  let ojk = getKeyHash(oj, {}, vd);
  let njk = getKeyHash(nj, {});
  let keyList = [];
  let cpList = [];
  // 先对比key对应的节点，如果新老有一方对不上则落空
  Object.keys(ojk).forEach(k => {
    let o = ojk[k];
    let n = njk[k];
    if(!n) {
      o.json.key = KEY_FLAG;
    }
  });
  Object.keys(njk).forEach(k => {
    let o = ojk[k];
    let n = njk[k];
    // 有可能老的没有这个key，新key落空
    if(!o) {
      n.json.key = KEY_FLAG;
      return;
    }
    let oj = o.json;
    let nj = n.json;
    let vd = o.vd;
    // 相同class的组件进行对比替换
    if(oj.$$type === TYPE_CP && nj.$$type === TYPE_CP) {
      if(oj.klass === nj.klass) {
        // 对比props和children看是否全等，是则直接替换新json类型为占位符，引用老vd，否则强制更新
        diffCp(oj, nj, vd);
        // 标识对比过了
        oj.key = nj.key = KEY_FLAG;
        // 老的sr里需删除这个vd，因为老sr会回收
        cpList.push(vd);
      }
    }
    // 相同类型的vd进行对比继承动画
    else if(oj.$$type === nj.$$type && oj.tagName === nj.tagName) {
      // 需判断矢量标签mutil是否相等
      if(nj.$$type !== TYPE_GM || oj.props.multi === nj.props.multi) {
        nj.inherit = vd;
      }
      oj.key = nj.key = KEY_FLAG;
      // key相同的dom暂存下来
      if(nj.$$type === TYPE_VD) {
        keyList.push({
          vd,
          oj,
          nj,
        });
      }
    }
  });
  // key相同的dom对比children，下面非key逻辑就不做了
  keyList.forEach(item => {
    diffChildren(item.vd, item.oj, item.nj);
  });
  // 整体tree进行对比
  diffChild(vd, oj, nj);
  // 已更新的cp需被老sr删除，因为老sr会回收，而此cp继续存在于新sr中不能回收，这里处理key的
  cpList.forEach(vd => {
    removeCpFromOldTree(vd);
  });
}

/**
 * 递归检查dom的children，相同的无需重新生成，用PL类型占位符代替直接返回老vd
 * @param vd
 * @param oj
 * @param nj
 */
function diffChild(vd, oj, nj) {
  if(util.isObject(nj)) {
    if(nj.$$type === TYPE_CP) {
      // key对比过了忽略
      if(nj.key === KEY_FLAG) {
        return;
      }
      // 相同class的组件处理
      if(oj.$$type === nj.$$type && oj.klass === nj.klass) {
        diffCp(oj, nj, vd);
        // 已更新的cp需被老sr删除，因为老sr会回收，而此cp继续存在于新sr中不能回收
        removeCpFromOldTree(vd);
      }
    }
    else if(nj.$$type === TYPE_GM && oj.$$type === TYPE_GM) {
      // $geom的multi必须一致
      if(oj.tagName === nj.tagName && oj.props.multi === nj.props.multi) {
        nj.inherit = vd;
      }
    }
    // dom类型递归children
    else if(nj.$$type === TYPE_VD && oj.$$type === TYPE_VD) {
      if(oj.tagName === nj.tagName) {
        nj.inherit = vd;
      }
      diffChildren(vd, oj, nj);
    }
  }
}

/**
 * dom类型的vd对比children
 * @param vd
 * @param oj
 * @param nj
 */
function diffChildren(vd, oj, nj) {
  let oc = oj.children;
  let nc = nj.children;
  let ol = oc.length;
  let nl = nc.length;
  let children = vd.children;
  for(let i = 0, of = 0, nf = 0, len = Math.min(ol, nl); i < len; i++) {
    let o = oc[i + of];
    let n = nc[i + nf];
    // 新老都是key直接跳过
    if(o.key === KEY_FLAG && n.key === KEY_FLAG) {
    }
    // 其中一个是key对比过了调整索引和长度
    else if(o.key === KEY_FLAG) {
      of++;
      i--;
      ol--;
      len = Math.min(ol, nl);
    }
    else if(n.key === KEY_FLAG) {
      nf++;
      i--;
      nl--;
      len = Math.min(ol, nl);
    }
    else {
      diffChild(children[i + of], o, n);
    }
  }
  // 长度不同增减的无需关注，新json创建cp有didMount，老vd会调用cp的destroy
}

/**
 * 根据json对比看cp如何更新，被render()后的json的二级组件对比才会出现
 * @param oj
 * @param nj
 * @param vd
 */
function diffCp(oj, nj, vd) {
  // props全等，直接替换新json类型为占位符，引用老vd内容，无需重新创建
  // 否则需要强制触发组件更新，包含setState内容
  nj.placeholder = true;
  nj.value = vd;
  let sr = vd.shadowRoot;
  // 对比需忽略on开头的事件，直接改老的引用到新的上，这样只变了on的话无需更新
  let exist = {};
  Object.keys(oj.props).forEach(k => {
    let v = oj.props[k];
    exist[k] = v;
  });
  Object.keys(nj.props).forEach(k => {
    let v = nj.props[k];
    if(/^on[a-zA-Z]/.test(k)) {
      oj.props[k] = v;
      let ex = exist[k];
      if(ex) {
        delete exist[k];
        if(ex !== v) {
          k = k.slice(2).toLowerCase();
          sr.listener[k] = v;
        }
      }
      else {
        k = k.slice(2).toLowerCase();
        sr.listener[k] = v;
      }
    }
    else if(/^on-[a-zA-Z\d_$]/.test(k)) {
      oj.props[k] = v;
      let ex = exist[k];
      if(ex) {
        delete exist[k];
        if(ex !== v) {
          k = k.slice(2).toLowerCase();
          vd.off(k, exist[k]);
          vd.on(k, v);
        }
        delete exist[k];
      }
      else {
        k = k.slice(2).toLowerCase();
        vd.on(k, v);
      }
    }
  });
  // 新的少的事件取消
  Object.keys(exist).forEach(k => {
    let v = exist[k];
    if(/^on[a-zA-Z]/.test(k)) {
      nj.props[k] = v;
      k = k.slice(2).toLowerCase();
      delete sr.listener[k];
    }
    else if(/^on-[a-zA-Z\d_$]/.test(k)) {
      nj.props[k] = v;
      k = k.slice(2).toLowerCase();
      vd.off(k, v);
    }
  });
  checkCp(vd, nj.props, !util.equal(oj.props, nj.props));
}

/**
 * 深度优先遍历json，将有key的记录在hash中，如果传入根vd，同步递归保存对应位置的vd
 * @param json
 * @param hash
 * @param vd
 * @returns {*}
 */
function getKeyHash(json, hash, vd) {
  if(Array.isArray(json)) {
    json.forEach((item, i) => getKeyHash(item, hash, vd && vd[i]));
  }
  else if(util.isObject(json)) {
    if(json.$$type === TYPE_VD || json.$$type === TYPE_GM || json.$$type === TYPE_CP) {
      // 深度优先
      if(json.$$type === TYPE_VD) {
        getKeyHash(json.children, hash, vd && vd.children);
      }
      let key = json.props.key;
      if(!util.isNil(key) && key !== '') {
        // 重复key错误警告
        if(hash.hasOwnProperty(key)) {
          console.error('Component ' + vd.tagName + ' has duplicate key: ' + key);
        }
        hash[key] = {
          json,
          vd,
        };
      }
    }
  }
  return hash;
}

/**
 * 非一级组件diff发生更新时，其需要从sr的tree中移除，因为sr会销毁
 */
function removeCpFromOldTree(vd) {
  // root下的一级组件不会发生回收情况，忽略
  if(!vd.host) {
    return;
  }
  let parent = vd.parent;
  if(parent) {
    let i = parent.children.indexOf(vd);
    if(i > -1) {
      parent.children[i] = null;
    }
    else {
      throw new Error('Can not find child: ' + vd.tagName);
    }
  }
}

/**
 * 执行componentDidUpdate/destroy
 */
function did() {
  updateList.forEach(item => {
    if(util.isFunction(item.componentDidUpdate)) {
      item.componentDidUpdate();
    }
  });
  updateList = [];
  removeList.forEach(item => {
    item.__destroy();
  });
  removeList = [];
}

export default {
  ref(o) {
    Xom = o.Xom;
    Dom = o.Dom;
    Img = o.Img;
    Geom = o.Geom;
    Component = o.Component;
  },
  updateList,
  check,
  checkCp,
  did,
};
