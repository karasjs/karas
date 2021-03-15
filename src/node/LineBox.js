import enums from '../util/enums';
import TextBox from './TextBox';

const { STYLE_KEY: {
  MARGIN_BOTTOM,
} } = enums;

/**
 * css中常见的概念，一行内容，里面可能有若干不同的内容，仅在布局阶段出现，不参与渲染逻辑
 * 本类是个抽象逻辑概念，会包含Text的内容TextBox和inline等节点，而内容TextBox则属于Text
 * 一个Text可能因为换行产生多个TextBox，从而形成不同行的内容就属于不同的LineBox
 * 本类属于block（包含flex和inlineBlock，下同）节点下，一个dom会有个专门列表，
 * 包含若干个LineBox保存着若干行文本内容TextBox，不直接关联Text，
 * inline则不会有此对象和列表，其复用最近block父层的，这样解决嵌套问题，
 * block在布局时将列表向孩子传递下去，每遇到block会重新生成
 * 每当发生换行时，专门列表中会新生成一个LineBox，让后续内容继续跟随新的LB
 * LB内部要进行垂直对齐，Text内容较简单x字符底部为baseLine，inline等节点按最后一行baseLine
 */
class LineBox {
  constructor(x, y) {
    this.__list = [];
    this.__x = x;
    this.__y = y;
    // this.__baseLine = 0;
  }

  add(item) {
    this.list.push(item);
  }

  // __calBaseLine() {
  //   let baseLine = this.__y;
  //   this.list.forEach(item => { console.log(item.baseLine)
  //     baseLine = Math.max(baseLine, item.baseLine);
  //   });
  //   return baseLine;
  // }

  verticalAlign() {
    let n = this.baseLine;
    // 仅当有2个和以上时才需要vertical对齐调整
    if(this.list.length > 1) {
      this.list.forEach(item => {
        let m = item.baseLine;
        if(m !== n) {
          item.__offsetY(n - m);
        }
      });
    }
  }

  horizonAlign(diff) {
    this.list.forEach(item => {
      item.__offsetX(diff, true);
    });
  }

  get list() {
    return this.__list;
  }

  get size() {
    return this.__list.length;
  }

  get x() {
    return this.__x;
  }

  get y() {
    return this.__y;
  }

  get endY() {
    return this.y + this.height;
  }

  get width() {
    let width = 0;
    this.list.forEach(item => {
      width += item.outerWidth;
    });
    return width;
  }

  get height() {
    let height = 0;
    this.list.forEach(item => {
      height = Math.max(height, item.outerHeight);
    });
    return height;
  }

  get baseLine() {
    let baseLine = this.__y;
    this.list.forEach(item => {
      baseLine = Math.max(baseLine, item.baseLine);
    });
    return baseLine;
  }

  get lineHeight() {
    let n = 0;
    this.list.forEach(item => {
      n = Math.max(n, item.height);
    });
    return n;
  }

  get marginBottom() {
    // lineBox都是inline-block，暂定不会有负
    let n = 0;
    this.list.forEach(item => {
      if(!(item instanceof TextBox)) {
        n = Math.max(n, item.computedStyle[MARGIN_BOTTOM]);
      }
    });
    return n;
  }
}

export default LineBox;
