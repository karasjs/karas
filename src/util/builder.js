import Text from '../node/Text';
import util from './util';
import $$type from './$$type';
import enums from './enums';
import flatten from './flatten';

const { NODE_KEY: {
  NODE_DOM_PARENT,
  NODE_STYLE,
  NODE_CURRENT_STYLE,
  NODE_COMPUTED_STYLE,
  NODE_MATRIX,
  NODE_MATRIX_EVENT,
} } = enums;
const { TYPE_VD, TYPE_GM, TYPE_CP } = $$type;

let Xom, Dom, Img, Geom, Component;

function initRoot(cd, root) {
  let c = flatten({
    children: cd,
    $$type: TYPE_VD,
  });
  let children = build(c.children, root, root);
  return relation(root, children);
}


function initCp(json, root, owner) {
  if(util.isObject(json)) {
    // cp的flatten在__init中自己做
    let vd = build(json, root, owner, owner);
    if(Array.isArray(vd)) {
      relation(owner, vd);
    }
    return vd;
  }
  // text的relation会由上层如Root设置
  else {
    return new Text(json);
  }
}

/**
 * 将初始json文件生成virtualDom
 * @param json
 * @param root
 * @param owner
 * @param host
 * @param hasP 出现过p标签
 * @returns vd
 */
function build(json, root, owner, host, hasP) {
  if(Array.isArray(json)) {
    return json.map(item => build(item, root, owner, host));
  }
  let vd;
  if(util.isObject(json) && json.$$type) {
    let { tagName, props, children, klass, $$type, inheritAnimate, __animateRecords } = json;
    // 更新过程中无变化的cp直接使用原来生成的
    if($$type === TYPE_CP && json.placeholder) {
      return json.value;
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
        children = relation(vd, build(children, root, owner, host, hasP));
      }
      else {
        children = [];
      }
      vd.__children = children;
    }
    else if($$type === TYPE_GM) {
      let klass = Geom.getRegister(tagName);
      vd = new klass(tagName, props);
    }
    else if($$type === TYPE_CP) {
      vd = new klass(props);
      vd.__tagName = vd.__tagName || tagName;
    }
    else {
      return new Text(json);
    }
    // 根parse需要用到真正的vd引用
    json.vd = vd;
    // 递归parse中的动画记录需特殊处理，将target改为真正的vd引用
    if(__animateRecords) {
      vd.__animateRecords = __animateRecords;
      __animateRecords.list.forEach(item => {
        item.target = item.target.vd;
      });
    }
    // 更新过程中key相同或者普通相同的vd继承动画
    if(inheritAnimate) {
      util.extendAnimate(inheritAnimate, vd);
    }
    vd.__root = root;
    if(host) {
      vd.__host = host;
    }
    if($$type === TYPE_CP) {
      vd.__init();
    }
    let ref = props.ref;
    if(util.isString(ref) && ref || util.isNumber(ref)) {
      owner.ref[ref] = vd;
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
    // 极为恶心，为了v8的性能优化，text复用parent的__config部分，但domParent重设
    if(children instanceof Text) {
      [
        NODE_STYLE,
        NODE_CURRENT_STYLE,
        NODE_COMPUTED_STYLE,
        NODE_MATRIX,
        NODE_MATRIX_EVENT,
      ].forEach(k => {
        children.__config[k] = parent.__config[k];
      });
    }
    if(children.__config) {
      children.__config[NODE_DOM_PARENT] = parent;
    }
    if(options.prev) {
      options.prev.__next = children;
      children.__prev = options.prev;
    }
    options.prev = children;
    // 文字视作为父节点的直接文字子节点
    if(children instanceof Component) {
      let sr = children.shadowRoot;
      if(sr instanceof Text) {
        sr.__parent = parent;
        [
          NODE_STYLE,
          NODE_CURRENT_STYLE,
          NODE_COMPUTED_STYLE,
          NODE_MATRIX,
          NODE_MATRIX_EVENT,
        ].forEach(k => {
          children.__config[k] = parent.__config[k];
        });
      }
      sr.__domParent = parent;
      if(sr.__config) {
        sr.__config[NODE_DOM_PARENT] = parent;
      }
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
  initCp,
  relation,
};
