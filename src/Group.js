import Element from './Element';
import Text from './Text';
import util from './util';

class Group extends Element {
  constructor(props, children) {
    super(props);
    this.__children = children;
    this.__div = [];
    this.__row = [];
    this.__style = {};
  }
  // 封装string为text节点，同时打平children中的数组，使得children只是一维列表
  __traverse() {
    let list = [];
    this.__traverseChildren(this.children, list);
    this.__children = list;
  }
  __traverseChildren(children, list) {
    if(Array.isArray(children)) {
      children.forEach(item => {
        this.__traverseChildren(item, list);
      });
    }
    else if(children instanceof Element) {
      list.push(children);
      children.__traverse();
    }
    // 排除掉空的文本
    else if(!util.isNil(children)) {
      list.push(new Text(children));
    }
  }
  // 递归遍历区分block块组，使得每组中一定都是inline元素，同时设置父子兄弟关系和ctx
  __groupDiv(ctx) {
    let prev = null;
    let list = [];
    let inLineTemp = [];
    this.children.forEach(item => {
      item.__ctx = ctx;
      if(item instanceof Group) {
        item.__groupDiv(ctx);
        if(['block', 'flex'].indexOf(item.style.display) > -1) {
          if(inLineTemp.length) {
            list.push(inLineTemp);
            inLineTemp = [];
          }
          list.push(item);
        }
        else {
          inLineTemp.push(item);
        }
      }
      else {
        inLineTemp.push(item);
      }
      if(prev) {
        prev.__next = item;
      }
      item.__prev = prev;
      prev = item;
    });
    if(inLineTemp.length) {
      list.push(inLineTemp);
    }
    this.__div = list;
  }
  // 递归测量inline位置，进行换行及多行操作，使得分行后每行有若干个inline元素
  // measure() {
  //   let res = {
  //     row: [],
  //     x: this.parent.x,
  //     y: this.parent.y,
  //   };
  //   this.measureDiv(this.group, res);
  // }
  // 递归测量inline位置，进行换行及多行操作，使得分行后每行有若干个inline元素
  __measureRow() {
    let list = [];
    this.children.forEach(item => {

    });
  }

  get group() {
    return this.__div;
  }
  get row() {
    return this.__row;
  }
  get children() {
    return this.__children;
  }
  get style() {
    return this.__style;
  }
}

export default Group;
