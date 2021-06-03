import util from './util';
import $$type from './$$type';

const { TYPE_VD, TYPE_GM, TYPE_CP } = $$type;

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
    if(['canvas', 'svg', 'webgl'].indexOf(children.tagName) > -1) {
      throw new Error('Can not nest canvas/svg/webgl');
    }
    if(children.$$type === TYPE_VD) {
      flattenJson(children);
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

export default flattenJson;
