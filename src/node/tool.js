import util from '../util/util';

function init(target, root, host) {
  let ref = target.props.ref;
  if(util.isString(ref) && ref) {
    root.ref[ref] = target;
  }
  else if(util.isFunction(ref)) {
    ref(target);
  }
  target.__root = root;
  target.__host = host;
}

export default {
  init,
};
