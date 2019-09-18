import util from './util';

const D2D = 0;
const D2T = 1;
const D2G = 2;
const T2D = 3;
const T2T = 4;
const T2G = 5;
const G2D = 6;
const G2T = 7;
const G2G = 8;

function diff(elem, ovd, nvd) {
  let state;
  if(ovd.type === 'dom') {
    if(nvd.type === 'dom') {
      diffD2D(elem, ovd, nvd);
    }
    else if(nvd.type === 'text') {
      state = 1;
    }
    else if(nvd.type === 'geom') {
      state = 2;
    }
  }
  else if(nvd.type === 'text') {
    if(nvd.type === 'dom') {
      state = 3;
    }
    else if(nvd.type === 'text') {
      state = 4;
    }
    else if(nvd.type === 'geom') {
      state = 5;
    }
  }
  else if(nvd.type === 'geom') {
    if(nvd.type === 'dom') {
      state = 6;
    }
    else if(nvd.type === 'text') {
      state = 7;
    }
    else if(nvd.type === 'geom') {
      state = 8;
    }
  }
}

function diffD2D(elem, ovd, nvd) {
  // console.log(elem, ovd, nvd);
  diffBb(elem.firstChild, ovd.bb, nvd.bb);
}

function diffBb(elem, obb, nbb) {
  let ol = obb.length;
  let nl = nbb.length;
  let i = 0;
  for(; i < Math.min(ol, nl); i++) {
    diffItem(elem, i, obb[i], nbb[i]);
  }
}

function diffItem(elem, i, o, n) {
  if(o.tagName !== n.tagName) {
    elem.insertAdjacentHTML('afterend', util.joinVirtualDom(n));
    elem.parentNode.removeChild(elem);
  }
  else {
    //
  }
}

export default diff;
