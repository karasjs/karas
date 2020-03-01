import util from './util';

const { joinVd, joinDef } = util;

function diff(elem, ovd, nvd) {
  let cns = elem.childNodes;
  diffDefs(cns[0], ovd.defs, nvd.defs);
  diffBb(cns[1], ovd.bb, nvd.bb, ovd.bbMask, nvd.bbMask);
  diffD2D(elem, ovd, nvd, true);
}

function diffDefs(elem, od, nd) {
  let ol = od.length;
  let nl = nd.length;
  let i = 0;
  let cns = elem.childNodes;
  for(; i < Math.min(ol, nl); i++) {
    diffDef(cns[i], od[i], nd[i]);
  }
  if(i < ol) {
    for(; i < ol; i++) {
      removeAt(elem, cns, i);
    }
  }
  else if(i < nl) {
    for(; i < nl; i++) {
      insertAt(elem, cns, i, joinDef(nd[i]));
    }
  }
}

function diffDef(elem, od, nd) {
  if(od.tagName !== nd.tagName) {
    elem.insertAdjacentHTML('afterend', joinDef(nd));
    elem.parentNode.removeChild(elem);
  }
  else {
    if(od.uuid !== nd.uuid) {
      elem.setAttribute('id', nd.uuid);
    }
    let op = {};
    for(let i = 0, len = od.props.length; i < len; i++) {
      let prop = od.props[i];
      let [k, v] = prop;
      op[k] = v;
    }
    for(let i = 0, len = nd.props.length; i < len; i++) {
      let prop = nd.props[i];
      let [k, v] = prop;
      // 已有不等更新，没有添加
      if(op.hasOwnProperty(k)) {
        if(op[k] !== v) {
          elem.setAttribute(k, v);
        }
        delete op[k];
      }
      else {
        elem.setAttribute(k, v);
      }
    }
    // 多余的删除
    Object.keys(op).forEach(i => {
      elem.removeAttribute(i);
    });
    let cns = elem.childNodes;
    let ol = od.children.length;
    let nl = nd.children.length;
    let i = 0;
    for(; i < Math.min(ol, nl); i++) {
      diffItem(elem, i, od.children[i], nd.children[i]);
    }
    if(i < ol) {
      for(; i < ol; i++) {
        removeAt(elem, cns, i);
      }
    }
    else if(i < nl) {
      for(; i < nl; i++) {
        insertAt(elem, cns, i, joinVd(nd.stop[i]));
      }
    }
  }
}

function diffChild(elem, ovd, nvd) {
  if(ovd.type === 'dom') {
    if(nvd.type === 'dom') {
      diffD2D(elem, ovd, nvd);
    }
    else if(nvd.type === 'text' || nvd.type === 'img') {
      replaceWith(elem, nvd);
    }
    else if(nvd.type === 'geom') {
      diffD2G(elem, ovd, nvd);
    }
  }
  else if(ovd.type === 'text') {
    if(nvd.type === 'dom' || nvd.type === 'geom' || nvd.type === 'img') {
      replaceWith(elem, nvd);
    }
    else if(nvd.type === 'text') {
      diffT2T(elem, ovd, nvd);
    }
  }
  else if(ovd.type === 'geom') {
    if(nvd.type === 'dom') {
      diffG2D(elem, ovd, nvd);
    }
    else if(nvd.type === 'text' || nvd.type === 'img') {
      replaceWith(elem, nvd);
    }
    else if(nvd.type === 'geom') {
      diffG2G(elem, ovd, nvd);
    }
  }
  else if(ovd.type === 'img') {
    if(nvd.type === 'img') {
      diffItemSelf(elem, ovd, nvd);
    }
    else {
      replaceWith(elem, nvd);
    }
  }
}

function diffX2X(elem, ovd, nvd) {
  let { transform, opacity, mask } = nvd;
  if(ovd.transform !== transform) {
    if(transform) {
      elem.setAttribute('transform', transform);
    }
    else {
      elem.removeAttribute('transform');
    }
  }
  if(ovd.opacity !== opacity) {
    if(opacity !== 1) {
      elem.setAttribute('opacity', opacity);
    }
    else {
      elem.removeAttribute('opacity');
    }
  }
  // geom不会有mask，对比一直相等
  if(ovd.mask !== mask) {
    if(mask) {
      elem.setAttribute('mask', mask);
    }
    else {
      elem.removeAttribute('mask');
    }
  }
}

function diffD2D(elem, ovd, nvd, root) {
  diffX2X(elem, ovd, nvd);
  if(!root) {
    diffBb(elem.firstChild, ovd.bb, nvd.bb, ovd.bbMask, nvd.bbMask);
  }
  let ol = ovd.children.length;
  let nl = nvd.children.length;
  let i = 0;
  let lastChild = elem.lastChild;
  let cns = lastChild.childNodes;
  for(; i < Math.min(ol, nl); i++) {
    diffChild(cns[i], ovd.children[i], nvd.children[i]);
  }
  if(i < ol) {
    for(; i < ol; i++) {
      removeAt(lastChild, cns, i);
    }
  }
  else if(i < nl) {
    for(; i < nl; i++) {
      insertAt(lastChild, cns, i, joinVd(nvd.children[i]));
    }
  }
}

function diffD2G(elem, ovd, nvd) {
  diffX2X(elem, ovd, nvd);
  diffBb(elem.firstChild, ovd.bb, nvd.bb, ovd.bbMask, nvd.bbMask);
  let lastChild = elem.lastChild;
  let cns = lastChild.childNodes;
  replaceWith(cns[0], nvd.children);
  for(let i = 1, len = cns.length; i < len; i++) {
    removeAt(lastChild, cns, i);
  }
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
      insertAt(elem, cns, i, joinVd(nvd.children[i]));
    }
  }
}

function diffG2D(elem, ovd, nvd) {
  diffD2G(elem, ovd, nvd);
}

function diffG2G(elem, ovd, nvd) {
  diffX2X(elem, ovd, nvd);
  diffBb(elem.firstChild, ovd.bb, nvd.bb, ovd.bbMask, nvd.bbMask);
  let ol = ovd.children.length;
  let nl = nvd.children.length;
  let i = 0;
  let lastChild = elem.lastChild;
  let cns = lastChild.childNodes;
  for(; i < Math.min(ol, nl); i++) {
    diffItem(lastChild, i, ovd.children[i], nvd.children[i]);
  }
  if(i < ol) {
    for(; i < ol; i++) {
      removeAt(lastChild, cns, i);
    }
  }
  else if(i < nl) {
    for(; i < nl; i++) {
      insertAt(lastChild, cns, i, joinVd(nvd.children[i]));
    }
  }
}

function diffBb(elem, obb, nbb, oMask, nMask) {
  let ol = obb.length;
  let nl = nbb.length;
  if(oMask !== nMask) {
    if(!nMask) {
      elem.removeAttribute('mask');
    }
    else {
      elem.setAttribute('mask', nMask);
    }
  }
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
      insertAt(elem, cns, i, joinVd(nbb[i]));
    }
  }
}

function diffItem(elem, i, ovd, nvd, isText) {
  let cns = elem.childNodes;
  if(ovd.tagName !== nvd.tagName) {
    replaceWith(cns[i], nvd);
  }
  else {
    diffItemSelf(cns[i], ovd, nvd);
    if(isText && ovd.content !== nvd.content) {
      cns[i].textContent = nvd.content;
    }
  }
}

function diffItemSelf(elem, ovd, nvd) {
  let op = {};
  for(let i = 0, len = ovd.props.length; i < len; i++) {
    let prop = ovd.props[i];
    let [k, v] = prop;
    op[k] = v;
  }
  for(let i = 0, len = nvd.props.length; i < len; i++) {
    let prop = nvd.props[i];
    let [k, v] = prop;
    // 已有不等更新，没有添加
    if(op.hasOwnProperty(k)) {
      if(op[k] !== v) {
        elem.setAttribute(k, v);
      }
      delete op[k];
    }
    else {
      elem.setAttribute(k, v);
    }
  }
  // 多余的删除
  Object.keys(op).forEach(i => {
    elem.removeAttribute(i);
  });
}

function replaceWith(elem, vd) {
  let res;
  if(Array.isArray(vd)) {
    res = '';
    vd.forEach(item => {
      res += joinVd(item);
    });
  }
  else {
    res = joinVd(vd);
  }
  elem.insertAdjacentHTML('afterend', res);
  elem.parentNode.removeChild(elem);
}

function insertAt(elem, cns, index, html) {
  if(index >= cns.length) {
    elem.insertAdjacentHTML('beforeend', html);
  }
  else {
    cns[index].insertAdjacentHTML('beforebegin', html);
  }
}

function removeAt(elem, cns, index) {
  if(cns[index]) {
    elem.removeChild(cns[index]);
  }
}

export default diff;
