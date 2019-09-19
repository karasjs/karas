import util from './util';

function diff(elem, ovd, nvd) {
  if(ovd.type === 'dom') {
    if(nvd.type === 'dom') {
      diffD2D(elem, ovd, nvd);
    }
    else if(nvd.type === 'text') {
      replaceWith(elem, nvd);
    }
    else if(nvd.type === 'geom') {
      diffD2G(elem, ovd, nvd);
    }
  }
  else if(nvd.type === 'text') {
    if(nvd.type === 'dom') {
      replaceWith(elem, nvd);
    }
    else if(nvd.type === 'text') {
      diffT2T(elem, ovd, nvd);
    }
    else if(nvd.type === 'geom') {
      replaceWith(elem, nvd);
    }
  }
  else if(nvd.type === 'geom') {
    if(nvd.type === 'dom') {
      diffG2D(elem, ovd, nvd);
    }
    else if(nvd.type === 'text') {
      replaceWith(elem, nvd);
    }
    else if(nvd.type === 'geom') {
      diffG2G(elem, ovd, nvd);
    }
  }
}

function diffD2D(elem, ovd, nvd) {
  diffBb(elem.firstChild, ovd.bb, nvd.bb);
  let ol = ovd.children.length;
  let nl = nvd.children.length;
  let i = 0;
  let lastChild = elem.lastChild;
  let cns = lastChild.childNodes;
  for(; i < Math.min(ol, nl); i++) {
    diff(cns[i], ovd.children[i], nvd.children[i]);
  }
  if(i < ol) {
    for(; i < ol; i++) {
      removeAt(lastChild, cns, i);
    }
  }
  else if(i < nl) {
    for(; i < nl; i++) {
      insertAt(lastChild, cns, i, nvd.children[i]);
    }
  }
}

function diffD2G(elem, ovd, nvd) {
  diffBb(elem.firstChild, ovd.bb, nvd.bb);
  replaceWith(elem.lastChild, nvd.content);
}

function diffT2T(elem, ovd, nvd) {
  let ol = ovd.children.length;
  let nl = nvd.children.length;
  let i = 0;
  for(; i < Math.min(ol, nl); i++) {
    diffItem(elem, i, ovd.children[i], nvd.children[i], true);
  }
  let cns = elem.childNodes;
  if(i < ol) {
    for(; i < ol; i++) {
      removeAt(elem, cns, i);
    }
  }
  else if(i < nl) {
    for(; i < nl; i++) {
      insertAt(elem, cns, i, nvd.children[i]);
    }
  }
}

function diffG2D(elem, ovd, nvd) {
  diffBb(elem.firstChild, ovd.bb, nvd.bb);
  replaceWith(elem.lastChild, nvd.children);
}

function diffG2G(elem, ovd, nvd) {
  diffBb(elem.firstChild, ovd.bb, nvd.bb);
  let ol = ovd.content.length;
  let nl = nvd.content.length;
  let i = 0;
  let lastChild = elem.lastChild;
  let cns = lastChild.childNodes;
  for(; i < Math.min(ol, nl); i++) {
    diffItem(lastChild, i, ovd.content[i], nvd.content[i]);
  }
  if(i < ol) {
    for(; i < ol; i++) {
      removeAt(lastChild, cns, i);
    }
  }
  else if(i < nl) {
    for(; i < nl; i++) {
      insertAt(lastChild, cns, i, nvd.content[i]);
    }
  }
}

function diffBb(elem, obb, nbb) {
  let ol = obb.length;
  let nl = nbb.length;
  let i = 0;
  for(; i < Math.min(ol, nl); i++) {
    diffItem(elem, i, obb[i], nbb[i]);
  }
  let cns = elem.childNodes;
  if(i < ol) {
    for(; i < ol; i++) {
      removeAt(elem, cns, i);
    }
  }
  else if(i < nl) {
    for(; i < nl; i++) {
      insertAt(elem, cns, i, nbb[i]);
    }
  }
}

function diffItem(elem, i, ovd, nvd, isText) {
  let cns = elem.childNodes;
  if(ovd.tagName !== nvd.tagName) {
    replaceWith(cns[i], nvd);
  }
  else {
    let op = {};
    for(let j = 0, len = ovd.props.length; j < len; j++) {
      let prop = ovd.props[j];
      let [k, v] = prop;
      op[k] = v;
    }
    for(let j = 0, len = nvd.props.length; j < len; j++) {
      let prop = nvd.props[j];
      let [k, v] = prop;
      // 已有不等更新，没有添加
      if(op.hasOwnProperty(k)) {
        if(op[k] !== v) {
          cns[i].setAttribute(k, v);
        }
        delete op[k];
      }
      else {
        cns[i].setAttribute(k, v);
      }
    }
    // 多余的删除
    for(var k in op) {
      if(op.hasOwnProperty(k)) {
        cns[i].removeAttribute(k);
      }
    }
    if(isText && ovd.content !== nvd.content) {
      cns[i].textContent = nvd.content;
    }
  }
}

function replaceWith(elem, vd) {
  let res;
  if(Array.isArray(vd)) {
    res = '';
    vd.forEach(item => {
      res += util.joinVirtualDom(item);
    });
  }
  else {
    res = util.joinVirtualDom(vd);
  }
  elem.insertAdjacentHTML('afterend', res);
  elem.parentNode.removeChild(elem);
}

function insertAt(elem, cns, index, vd) {
  let res = util.joinVirtualDom(vd);
  if(index >= cns.length) {
    elem.insertAdjacentHTML('beforeend', res);
  }
  else {
    cns[index].insertAdjacentHTML('beforebegin', res);
  }
}

function removeAt(elem, cns, index) {
  if(cns[index]) {
    elem.removeChild(cns[index]);
  }
}

export default diff;
