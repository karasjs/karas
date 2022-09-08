import Xom from './Xom';
import Text from './Text';
import Component from './Component';
import util from '../util/util';

/**
 * 打平children，并设置兄弟父子关系，合并并生成Text节点，
 */
function buildChildren(parent, children) {
  let list = [];
  flatten(list, children, {
    lastText: null,
  });
  return list;
}

function flatten(list, children, options) {
  if(Array.isArray(children)) {
    children.forEach(item => {
      flatten(list, item, options);
    });
  }
  else if(children instanceof Xom) {
    if(['canvas', 'svg', 'webgl'].indexOf(children.tagName) > -1) {
      throw new Error('Can not nest canvas/svg/webgl');
    }
    list.push(children);
    options.lastText = null;
  }
  else if(children instanceof Component) {
    list.push(children);
    options.lastText = null;
  }
  else if(!util.isNil(children) && children !== '') {
    if(options.lastText) {
      options.lastText.__content += children;
    }
    else {
      list.push(options.lastText = new Text(children));
    }
  }
}

/**
 * 设置关系，父子和兄弟
 */
function relation(root, host, parent, children, options = {}) {
  if(Array.isArray(children)) {
    children.forEach(item => {
      relation(root, host, parent, item, options);
    });
  }
  else if(children instanceof Xom || children instanceof Component || children instanceof Text) {
    children.__root = root;
    children.__parent = parent;
    children.__domParent = parent;
    children.__isDestroyed = false;
    if(options.prev) {
      options.prev.__next = children;
      children.__prev = options.prev;
    }
    options.prev = children;
    if(!(children instanceof Text)) {
      let ref = children.props.ref;
      if(util.isString(ref) && ref || util.isNumber(ref)) {
        host.ref[ref] = children;
      }
      else if(util.isFunction(ref)) {
        ref(children);
      }
    }
    if(children instanceof Xom && children.__children) {
      relation(root, host, children, children.__children, {});
    }
    else if(children instanceof Component) {
      let sr = children.render();
      if(sr) {
        children.__shadow = sr;
        sr.__host = children;
        sr.__hostRoot = children;
        sr.__root = root;
        sr.__domParent = parent;
      }
      while(sr instanceof Component) {
        let res = sr.render();
        if(res) {
          sr.__shadow = res;
          res.__host = sr;
          res.__hostRoot = children;
          res.__root = root;
          res.__domParent = parent;
        }
        sr = res;
      }
      if(sr) {
        if(sr instanceof Xom) {
          relation(root, children, sr, sr.__children, {});
        }
        else {
          sr = new Text(sr);
        }
        children.__shadowRoot = sr;
        sr.__hostRoot = children;
        sr.__root = root;
        sr.__domParent = parent;
        sr.__isDestroyed = false;
        children.__init();
      }
    }
  }
  return children;
}

// 设置每个节点root引用，组件初始化
function buildRoot(root, children) {
  root.__root = root;
  root.__host = root;
  relation(root, root, root, children, {});
}

export default {
  buildChildren,
  buildRoot,
  relation,
};
