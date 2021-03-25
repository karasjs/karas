import LineBox from './LineBox';

/**
 * 维护一个上下文的LineBox，向LineBox中添加Item以及新增下一行的LineBox，多个LineBox组成一个区域
 * 一个block/inlineBlock拥有一个本类对象，上下文即对应这个dom流，而inline则复用最近非inline父元素的
 * 同时LineBox可能连续也可能不连续，不连续的是中间有block之类的隔离开来
 */
class LineBoxManager {
  constructor(x, y) {
    this.__x = this.__lastX = x; // last存储目前最后一行LineBox的结尾位置，供后续inline使用
    this.__y = this.__lastY = y;
    this.__domList = [];
    this.__domStack = [];
    this.__list = []; // 包含若干LineBox
    this.__isNewLine = true; // 区域内是否是新行，dom开头肯定是
    this.__lineHeight = 0;
    this.__baseLine = 0;
    this.__isEnd = true; // 在dom中是否一个区域处在结尾，外部控制
  }

  /**
   * 每次换行时重新生成LineBox存入列表，同时由于flow流当前一定是流（dom）的结尾，设置isEnd
   * @returns {LineBox}
   */
  genLineBox(x, y) {
    let lineBox = new LineBox(x, y);
    this.__list.push(lineBox);
    this.__isEnd = true;
    return lineBox;
  }

  /**
   * 外部设置为结尾，如一个LineBox后出现一个block，此时会被隔断，不再作为流的末尾
   */
  setNotEnd() {
    this.__isEnd = false;
  }

  /**
   * 外部设置新行，下次新生成LineBox
   */
  setNewLine() {
    this.__isNewLine = true;
  }

  /**
   * 当前LineBox放入一个新项，当新行时（如第一行）产生一个新的LineBox并存入列表
   * 是否新区域和新行都是可以被外部控制，默认第一行是新
   * 当被隔断后会被外部重置新行，这样会生成新的来作为新加项的LineBox
   * 当换行时外部也会调用新行，这样再次添加Item时会自动生成新的LineBox而不是用之前的
   * @param o TextBox/Inline/InlineBlock
   * @param nextNewLine 是否设置newLine，标明下次添加新生成LineBox
   * @returns {LineBox}
   */
  addItem(o, nextNewLine) {
    let lineBox;
    if(this.__isNewLine) {
      this.__isNewLine = false;
      lineBox = this.genLineBox(o.x, o.y);
      if(this.__lineHeight) {
        lineBox.__setLB(this.__lineHeight, this.__baseLine);
        this.__lineHeight = this.__baseLine = 0;
      }
    }
    else {
      let list = this.__list;
      let length = list.length;
      lineBox = list[length - 1];
    }
    // inline递归过程中所有inline父子顺序列表，每个dom都需要对当前内容保存
    this.__domStack.forEach(item => {
      item.__contentBoxList.push(o);
    });
    lineBox.add(o);
    // 设置结束x的位置给next的inline标记用，o可能是TextBox或inlineBlock
    this.__lastX = o.x + o.outerWidth;
    this.__lastY = o.y;
    if(nextNewLine) {
      this.__isNewLine = true;
    }
    return lineBox;
  }

  horizonAlign(w, textAlign) {
    this.__list.forEach(lineBox => {
      let diff = w - lineBox.width;
      if(diff > 0) {
        if(textAlign === 'center') {
          diff *= 0.5;
        }
        lineBox.__offsetX(diff);
        lineBox.list.forEach(item => {
          item.__offsetX(diff, true);
        });
      }
    });
  }

  verticalAlign() {
    this.__list.forEach(lineBox => {
      lineBox.verticalAlign();
    });
  }

  addX(n) {
    this.__lastX += n;
  }

  /**
   * inline递归过程中布局调用，不断出入栈dom对象，获取当前行状态下有哪些dom还在
   * @param dom
   */
  pushContentBoxList(dom) {
    this.__domList.push(dom);
    this.__domStack.push(dom);
  }

  popContentBoxList() {
    this.__domStack.pop();
  }

  /**
   * 当前有lineBox则设置lineHeight/baseLine，否则记录下来等新的设置
   * 当是新行时不设置，留下个创建的新lineBox用
   * @param l
   * @param b
   * @private
   */
  __setLB(l, b) {
    let length = this.__list.length;
    if(length && !this.isNewLine) {
      this.__list[length - 1].__setLB(l, b);
    }
    else {
      this.__lineHeight = Math.max(this.__lineHeight, l);
      this.__baseLine = Math.max(this.__baseLine, b);
    }
  }

  get size() {
    return this.__list.length;
  }

  get lastX() {
    return this.__lastX;
  }

  get lastY() {
    return this.__lastY;
  }

  get endY() {
    let list = this.__list;
    let length = list.length;
    if(length) {
      return list[length - 1].endY;
    }
    return this.__y;
  }

  get isEnd() {
    return this.__isEnd;
  }

  get isNewLine() {
    return this.__isNewLine;
  }

  get breakLine() {
    return this.__list.length > 1;
  }

  get domList() {
    return this.__domList;
  }

  get baseLine() {
    let list = this.__list;
    let length = list.length;
    if(length) {
      let n = 0;
      for(let i = 0; i < length - 1; i++) {
        n += list[i].height;
      }
      return n + list[length - 1].baseLine;
    }
    return 0;
  }

  get marginBottom() {
    let list = this.__list;
    if(list.length) {
      return list[list.length - 1].marginBottom;
    }
    return 0;
  }

  get lineHeight() {
    let list = this.__list;
    if(list.length) {
      return list[list.length - 1].lineHeight;
    }
    return 0;
  }
}

export default LineBoxManager;
