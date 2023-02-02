import Xom from './Xom';
import Node from './Node';
import Text from './Text';
import Component from './Component';
import util from '../util/util';
import wasm from '../wasm/index';

/**
 * 打平children，多维嵌套的数组变成一维
 */
function buildChildren(parent, children) {
  let list = [];
  flatten(parent, children, list);
  return list;
}

function flatten(parent, children, list) {
  if(Array.isArray(children)) {
    children.forEach(item => {
      flatten(parent, item, list);
    });
  }
  else if(children instanceof Xom) {
    if(['canvas', 'svg', 'webgl'].indexOf(children.tagName) > -1) {
      throw new Error('Can not nest canvas/svg/webgl');
    }
    children.__parent = parent;
    list.push(children);
  }
  else if(children instanceof Component) {
    children.__parent = parent;
    list.push(children);
  }
  else if(!util.isNil(children) && children !== '') {
    let t = new Text(children);
    t.__parent = parent;
    list.push(t);
  }
}

/**
 * 设置关系，父子和兄弟，被添加到真实dom中前调用
 */
function relation(root, host, parent, children, options = {}) {
  if(Array.isArray(children)) {
    children.forEach(item => {
      relation(root, host, parent, item, options);
    });
  }
  else if(children instanceof Xom || children instanceof Component || children instanceof Text) {
    children.__root = root;
    children.__host = children.__hostRoot = host;
    children.__parent = parent;
    children.__domParent = parent;
    children.__isDestroyed = false;
    if(options.prev) {
      options.prev.__next = children;
      children.__prev = options.prev;
    }
    options.prev = children;
    // wasm
    let wr = root.__wasmRoot;
    if(wr) {
      if(children instanceof Xom) {
        children.__wasmNode = wasm.Node.new(false);
      }
      else if(children instanceof Text) {
        children.__wasmNode = wasm.Node.new(true);
      }
    }
    // ref
    if(!(children instanceof Text)) {
      let ref = children.props.ref;
      if(util.isString(ref) && ref || util.isNumber(ref)) {
        host.ref[ref] = children;
      }
      else if(ref && util.isFunction(ref)) {
        ref(children);
      }
    }
    if(children instanceof Xom && children.__children) {
      relation(root, host, children, children.__children, {});
    }
    else if(children instanceof Component) {
      let sr = children.render();
      let hoc = [];
      while(sr && sr instanceof Component) {
        hoc.push(sr);
        let res = sr.render();
        if(res) {
          sr.__shadow = res;
          res.__host = sr;
        }
        sr = res;
      }
      if(!(sr instanceof Node)) {
        sr = new Text(sr);
      }
      if(hoc.length) {
        children.__shadow = hoc[0];
        hoc[0].__host = children;
        hoc.forEach(item => {
          item.__shadowRoot = sr;
          item.__hostRoot = children;
          item.__root = root;
          item.__domParent = parent;
        });
      }
      else {
        children.__shadow = sr;
        sr.__host = children;
      }
      children.__shadowRoot = sr;
      sr.__hostRoot = children;
      sr.__root = root;
      sr.__domParent = parent;
      sr.__isDestroyed = false;
      children.__init();
      if(sr instanceof Xom && sr.__children) {
        relation(root, children, sr, sr.__children, {});
      }
      // wasm
      if(wr) {
        if(sr instanceof Xom) {
          sr.__wasmNode = wasm.Node.new(false);
        }
        else if(sr instanceof Text) {
          sr.__wasmNode = wasm.Node.new(true);
        }
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
