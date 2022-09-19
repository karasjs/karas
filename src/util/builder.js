import Text from '../node/Text';
import util from './util';
import $$type from './$$type';
import flatten from './flatten';

const { TYPE_VD, TYPE_GM, TYPE_CP } = $$type;

let Xom, Dom, Img, Geom, Component;

function initRoot(cd, root) {
  let c = flatten({
    tagName: root.tagName,
    props: {},
    children: cd,
    $$type: TYPE_VD,
  });
  root.__json = c;
  root.__host = root;
  let children = build(c.children, root, root);
  return relation(root, children);
}

function initDom(json, root, host, parent) {
  let vd = build(json, root, host);
  return relation(parent, vd);
}

function initCp(json, root, host) {
  if(util.isObject(json)) {
    // cp的flatten在__init中自己做
    return build(json, root, host);
  }
  // text的relation会由上层如Root设置
  else {
    return new Text(json);
  }
}

function initCp2(json, root, host, parent) {
  let vd = new json.klass(json.props);
  vd.__tagName = json.tagName || vd.__tagName;
  vd.__root = root;
  vd.__host = host;
  vd.__json = json;
  vd.__init();
  return relation(parent, vd);
}

/**
 * 将初始json文件生成virtualDom
 * @param json
 * @param root
 * @param host
 * @param hasP 出现过p标签
 * @returns vd
 */
function build(json, root, host, hasP) {
  if(Array.isArray(json)) {
    return json.map(item => build(item, root, host, hasP));
  }
  let vd;
  if(util.isObject(json) && json.$$type) {
    let { tagName, props, children, klass, $$type, __inheritAnimate, __animateRecords } = json;
    // 更新过程中无变化的cp直接使用原来生成的
    if($$type === TYPE_CP && json.__placeholder) {
      return json.__placeholder;
    }
    if($$type === TYPE_VD) {
      if(tagName === 'img') {
        vd = new Img(tagName, props);
        if(Array.isArray(children) && children.length) {
          throw new Error('Img can not contain children');
        }
      }
      else {
        vd = new Dom(tagName, props);
      }
      // 检查p不能包含div
      if(tagName === 'p') {
        hasP = true;
      }
      else if(tagName === 'div' && hasP) {
        throw new Error('Markup p can not contain div');
      }
      if(Array.isArray(children)) {
        children = relation(vd, build(children, root, host, hasP));
      }
      else {
        children = [];
      }
      vd.__children = children;
    }
    else if($$type === TYPE_GM) {
      if(util.isString(tagName)) {
        let klass = Geom.getRegister(tagName);
        vd = new klass(tagName, props);
      }
      else if(tagName) {
        vd = new tagName('$', props);
      }
    }
    else if($$type === TYPE_CP) {
      vd = new klass(props);
      vd.__tagName = tagName || vd.__tagName;
    }
    else {
      return new Text(json);
    }
    // 根parse需要用到真正的vd引用，然后vd也要引用json，用以做domApi
    json.vd = vd;
    vd.__json = json;
    // 递归parse中的动画记录需特殊处理，将target改为真正的vd引用
    if(__animateRecords) {
      vd.__animateRecords = __animateRecords;
      __animateRecords.list.forEach(item => {
        item.target = item.target.vd;
      });
      delete json.__animateRecords;
    }
    // 更新过程中key相同或者普通相同的vd继承动画
    if(__inheritAnimate) {
      util.extendAnimate(__inheritAnimate, vd);
      delete json.__inheritAnimate;
    }
    vd.__root = root;
    vd.__host = host;
    if($$type === TYPE_CP) {
      vd.__init();
    }
    let ref = props.ref;
    if(util.isString(ref) && ref || util.isNumber(ref)) {
      host.ref[ref] = vd;
    }
    else if(util.isFunction(ref)) {
      ref(vd);
    }
    return vd;
  }
  return new Text(json);
}

/**
 * 设置关系，父子和兄弟
 * @param parent
 * @param children
 * @param options
 * @returns {Xom|Text|Component}
 */
function relation(parent, children, options = {}) {
  if(Array.isArray(children)) {
    children.forEach(item => {
      relation(parent, item, options);
    });
  }
  else if(children instanceof Xom || children instanceof Component || children instanceof Text) {
    children.__parent = parent;
    children.__domParent = parent;
    if(options.prev) {
      options.prev.__next = children;
      children.__prev = options.prev;
    }
    options.prev = children;
    // 文字视作为父节点的直接文字子节点
    if(children instanceof Component) {
      let sr = children.shadowRoot;
      // if(sr instanceof Text) {
      //   sr.__parent = parent;
      // }
      sr.__domParent = parent;
    }
  }
  return children;
}

export default {
  ref(o) {
    Xom = o.Xom;
    Dom = o.Dom;
    Img = o.Img;
    Geom = o.Geom;
    Component = o.Component;
  },
  initRoot,
  initDom,
  initCp,
  initCp2,
  relation,
};
