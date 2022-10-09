import util from './util';
import level from '../refresh/level';

const { joinVd, joinDef } = util;
const { contain, NONE, TRANSFORM_ALL, OPACITY, FILTER, MIX_BLEND_MODE, MASK } = level;

function diff(elem, ovd, nvd) {
  let cns = elem.childNodes;
  diffDefs(cns[0], ovd.defs, nvd.defs);
  // <REPAINT不会有lv属性，无需对比
  if(!nvd.hasOwnProperty('lv')) {
    diffBb(cns[1], ovd.bb, nvd.bb);
  }
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
    for(let j = ol - 1; j >= i; j--) {
      removeAt(elem, cns, j);
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
    insertAdjacentHTML(elem, 'beforebegin', joinDef(nd));
    // elem.insertAdjacentHTML('beforebegin', joinDef(nd));
    elem.parentNode.removeChild(elem);
  }
  else {
    if(od.uuid !== nd.uuid) {
      elem.setAttribute('id', nd.uuid);
    }
    let op = {};
    for(let i = 0, len = (od.props || []).length; i < len; i++) {
      let prop = od.props[i];
      let [k, v] = prop;
      op[k] = v;
    }
    for(let i = 0, len = (nd.props || []).length; i < len; i++) {
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
      for(let j = ol - 1; j >= i; j--) {
        removeAt(elem, cns, j);
      }
    }
    else if(i < nl) {
      for(; i < nl; i++) {
        insertAt(elem, cns, i, joinVd(nd.children[i]));
      }
    }
  }
}

function diffChild(elem, ovd, nvd) {
  if(ovd.type === 'dom') {
    if(nvd.type === 'dom') {
      diffD2D(elem, ovd, nvd);
    }
    else if(nvd.type === 'geom') {
      diffD2G(elem, ovd, nvd);
    }
    else {
      replaceWith(elem, nvd);
    }
  }
  else if(ovd.type === 'text') {
    if(nvd.type === 'text') {
      diffT2T(elem, ovd, nvd);
    }
    else {
      replaceWith(elem, nvd);
    }
  }
  else if(ovd.type === 'geom') {
    if(nvd.type === 'dom') {
      diffG2D(elem, ovd, nvd);
    }
    else if(nvd.type === 'geom') {
      diffG2G(elem, ovd, nvd);
    }
    else {
      replaceWith(elem, nvd);
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
  // 特殊情况，当有连续2个img，后面1个发生error时，其children内容不是type为img的图片，而是矢量图item，会进入此分支
  else if(ovd.type === 'item' && nvd.type === 'item') {
    diffItemSelf(elem, ovd, nvd);
  }
}

function diffX2X(elem, ovd, nvd) {
  let { transform, opacity, visibility, mask, overflow, filter, mixBlendMode, conClip } = nvd;
  if(ovd.transform !== transform) {
    if(transform) {
      elem.setAttribute('transform', transform);
    }
    else {
      elem.removeAttribute('transform');
    }
  }
  if(ovd.opacity !== opacity) {
    if(opacity !== 1 && opacity !== undefined) {
      elem.setAttribute('opacity', opacity);
    }
    else {
      elem.removeAttribute('opacity');
    }
  }
  if(ovd.visibility !== visibility) {
    elem.setAttribute('visibility', visibility);
  }
  if(ovd.mask !== mask) {
    if(mask) {
      elem.setAttribute('mask', mask);
    }
    else {
      elem.removeAttribute('mask');
    }
  }
  if(ovd.filter !== filter || ovd.mixBlendMode !== mixBlendMode) {
    let s = (filter ? `filter:${filter};` : '') + (mixBlendMode ? `mix-blend-mode:${mixBlendMode};` : '');
    if(s) {
      elem.setAttribute('style', s);
    }
    else {
      elem.removeAttribute('filter');
    }
  }
  if(ovd.overflow !== overflow) {
    if(overflow) {
      elem.setAttribute('clipPath', overflow);
    }
    else {
      elem.removeAttribute('overflow');
    }
  }
  if(ovd.conClip !== conClip) {
    if(conClip) {
      elem.childNodes[1].setAttribute('clip-path', conClip);
    }
    else {
      elem.childNodes[1].removeAttribute('clip-path');
    }
  }
}

function diffByLessLv(elem, ovd, nvd, lv) {
  let { transform, opacity, mask, filter, mixBlendMode } = nvd;
  if(lv === NONE) {
    return;
  }
  if(contain(lv, MASK)) {
    if(mask) {
      elem.setAttribute('mask', mask);
    }
    else {
      elem.removeAttribute('mask');
    }
  }
  if(contain(lv, TRANSFORM_ALL)) {
    if(transform) {
      elem.setAttribute('transform', transform);
    }
    else {
      elem.removeAttribute('transform');
    }
  }
  if(contain(lv, OPACITY)) {
    if(opacity !== 1 && opacity !== undefined) {
      elem.setAttribute('opacity', opacity);
    }
    else {
      elem.removeAttribute('opacity');
    }
  }
  if(contain(lv, FILTER) || contain(lv, MIX_BLEND_MODE)) {
    let s = (filter ? `filter:${filter};` : '') + (mixBlendMode ? `mix-blend-mode:${mixBlendMode};` : '');
    if(s) {
      elem.setAttribute('style', s);
    }
    else {
      elem.removeAttribute('style');
    }
  }
}

function diffD2D(elem, ovd, nvd, root) {
  // cache表明children无变化缓存，一定是REPAINT以下的，只需看自身的lv以及mask
  if(nvd.cache) {
    diffByLessLv(elem, ovd, nvd, nvd.lv);
    return;
  }
  // 无cache且<REPAINT的情况快速对比且继续对比children
  if(nvd.hasOwnProperty('lv')) {
    diffByLessLv(elem, ovd, nvd, nvd.lv);
  }
  else {
    diffX2X(elem, ovd, nvd);
    if(!root) {
      diffBb(elem.firstChild, ovd.bb, nvd.bb);
    }
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
    for(let j = ol - 1; j >= i; j--) {
      removeAt(lastChild, cns, j);
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
  diffBb(elem.firstChild, ovd.bb, nvd.bb);
  let ol = ovd.children.length;
  let nl = nvd.children.length;
  let i = 0;
  let lastChild = elem.lastChild;
  let cns = lastChild.childNodes;
  for(; i < Math.min(ol, nl); i++) {
    replaceWith(cns[i], nvd.children[i]);
  }
  if(i < ol) {
    for(let j = ol - 1; j >= i; j--) {
      removeAt(lastChild, cns, j);
    }
  }
  else if(i < nl) {
    for(; i < nl; i++) {
      insertAt(lastChild, cns, i, joinVd(nvd.children[i]));
    }
  }
}

function diffT2T(elem, ovd, nvd) {
  if(nvd.cache) {
    return;
  }
  let ol = ovd.children.length;
  let nl = nvd.children.length;
  let i = 0;
  for(; i < Math.min(ol, nl); i++) {
    diffItem(elem, i, ovd.children[i], nvd.children[i], true);
  }
  let cns = elem.childNodes;
  if(i < ol) {
    for(let j = ol - 1; j >= i; j--) {
      removeAt(elem, cns, j);
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
  if(nvd.cache) {
    diffByLessLv(elem, ovd, nvd, nvd.lv);
    return;
  }
  // 无cache且<REPAINT的情况快速对比且继续对比children
  if(nvd.hasOwnProperty('lv')) {
    diffByLessLv(elem, ovd, nvd, nvd.lv);
  }
  else {
    diffX2X(elem, ovd, nvd);
    diffBb(elem.firstChild, ovd.bb, nvd.bb);
    let ol = ovd.children.length;
    let nl = nvd.children.length;
    let i = 0;
    let lastChild = elem.lastChild;
    let cns = lastChild.childNodes;
    for(; i < Math.min(ol, nl); i++) {
      diffItem(lastChild, i, ovd.children[i], nvd.children[i]);
    }
    if(i < ol) {
      for(let j = ol - 1; j >= i; j--) {
        removeAt(lastChild, cns, j);
      }
    }
    else if(i < nl) {
      for(; i < nl; i++) {
        insertAt(lastChild, cns, i, joinVd(nvd.children[i]));
      }
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
    for(let j = ol - 1; j >= i; j--) {
      removeAt(elem, cns, j);
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
      cns[i].innerHTML = nvd.content;
    }
  }
}

function diffItemSelf(elem, ovd, nvd) {
  if(nvd.cache) {
    return;
  }
  let op = {};
  for(let i = 0, len = (ovd.props || []).length; i < len; i++) {
    let prop = ovd.props[i];
    let [k, v] = prop;
    op[k] = v;
  }
  for(let i = 0, len = (nvd.props || []).length; i < len; i++) {
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
  insertAdjacentHTML(elem, 'beforebegin', res);
  // elem.insertAdjacentHTML('beforebegin', res);
  elem.parentNode.removeChild(elem);
}

function insertAt(elem, cns, index, html) {
  if(index >= cns.length) {
    insertAdjacentHTML(elem, 'beforeend', html);
    // elem.insertAdjacentHTML('beforeend', html);
  }
  else {
    insertAdjacentHTML(cns[index], 'beforebegin', html);
    // cns[index].insertAdjacentHTML('beforebegin', html);
  }
}

function removeAt(elem, cns, index) {
  if(cns[index]) {
    elem.removeChild(cns[index]);
  }
}

let svg;
function insertAdjacentHTML(elem, where, content) {
  if(elem.insertAdjacentHTML) {
    elem.insertAdjacentHTML(where, content);
  }
  else {
    switch(where) {
      case 'beforeend':
        elem.innerHTML += content;
        break;
      case 'beforebegin':
        svg = svg || document.createElement('svg');
        svg.innerHTML = content;
        elem.parentNode.insertBefore(svg.childNodes[0], elem);
        break;
    }
  }
}

export default diff;
