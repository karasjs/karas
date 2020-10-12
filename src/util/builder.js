import Text from '../node/Text';
import tag from '../node/tag';
import util from './util';
import $$type from './$$type';

const { TYPE_VD, TYPE_GM, TYPE_CP } = $$type;

let Xom, Dom, Img, Geom, Component;

function initRoot(cd, root) {
  let c = flattenJson({
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
    let { tagName, props, children, klass, $$type, inherit, __animateRecords } = json;
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
        item.target = vd;
      });
    }
    // 更新过程中key相同的vd继承动画
    if(inherit) {
      util.extendAnimate(inherit, vd);
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
 * 2. 打平children中的数组，变成一维
 * 3. 合并相连的Text节点，即string内容
 */
function flattenJson(parent) {
  if(Array.isArray(parent)) {
    return parent.map(item => flattenJson(item));
  }
  else if(!parent || [TYPE_VD, TYPE_GM, TYPE_CP].indexOf(parent.$$type) === -1 || !Array.isArray(parent.children)) {
    return parent;
  }
  let list = [];
  traverseJson(list, parent.children, {
    lastText: null,
  });
  parent.children = list;
  return parent;
}

function traverseJson(list, children, options) {
  if(Array.isArray(children)) {
    children.forEach(item => {
      traverseJson(list, item, options);
    });
  }
  else if(children && (children.$$type === TYPE_VD || children.$$type === TYPE_GM)) {
    if(['canvas', 'svg'].indexOf(children.tagName) > -1) {
      throw new Error('Can not nest canvas/svg');
    }
    if(children.$$type === TYPE_VD) {
      flattenJson(children.children);
    }
    list.push(children);
    options.lastText = null;
  }
  else if(children && children.$$type === TYPE_CP) {
    list.push(children);
    // 强制component即便返回text也形成一个独立的节点，合并在layout布局中做
    options.lastText = null;
  }
  // 排除掉空的文本，连续的text合并
  else if(!util.isNil(children) && children !== '') {
    if(options.lastText !== null) {
      list[list.length - 1] = options.lastText += children;
    }
    else {
      list.push(children);
    }
  }
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
    if(options.prev) {
      options.prev.__next = children;
      children.__prev = options.prev;
    }
    options.prev = children;
    if(children instanceof Dom) {
      relation(children, children.children);
    }
    // 文字视作为父节点的直接文字子节点
    else if(children instanceof Component) {
      let sr = children.shadowRoot;
      if(sr instanceof Text) {
        sr.__parent = parent;
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
  flattenJson,
  relation,
  build,
};
