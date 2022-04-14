import TextBox from './TextBox';
import enums from '../util/enums';
import css from '../style/css';

const { STYLE_KEY: {
  DISPLAY,
  MARGIN_LEFT,
  BORDER_LEFT_WIDTH,
  PADDING_LEFT,
  PADDING_RIGHT,
  BORDER_RIGHT_WIDTH,
  MARGIN_RIGHT,
  LINE_HEIGHT,
} } = enums;

/**
 * css中常见的概念，一行内容，里面可能有若干不同的内容，仅在布局阶段出现，不参与渲染逻辑
 * 本类是个抽象逻辑概念，会包含Text的内容TextBox和inlineBlock等节点，而内容TextBox则属于Text
 * 一个Text可能因为换行产生多个TextBox，从而形成不同行的内容就属于不同的LineBox
 * 本类属于block（包含flex和inlineBlock，下同）节点下，一个dom会有个专门列表，
 * 包含若干个LineBox保存着若干行文本内容TextBox，不直接关联Text，
 * inline则不会有此对象和列表，其复用最近block父层的，这样解决嵌套问题，
 * block在布局时将列表向孩子传递下去，每遇到block会重新生成
 * 每当发生换行时，专门列表中会新生成一个LineBox，让后续内容继续跟随新的LB
 * LB内部要进行垂直对齐，Text内容较简单x字符底部为baseline，inlineBlock等节点按最后一行baseline
 */
class LineBox {
  constructor(x, y, lineHeight, baseline) {
    this.__list = [];
    this.__x = x;
    this.__y = y;
    this.__lineHeight = lineHeight; // 可能出现空的inline，因此一个inline进入布局时先设置当前lineBox的最小lineHeight/baseline
    this.__baseline = baseline;
  }

  add(item) {
    this.list.push(item);
    item.__parentLineBox = this;
  }

  verticalAlign(isVertical) {
    let baseline = this.baseline;
    let lineHeight = this.lineHeight;
    let increase = lineHeight;
    let hasReplaced;
    // 只有1个也需要对齐，因为可能内嵌了空inline使得baseline发生变化
    if(this.list.length) {
      this.list.forEach(item => {
        if(item.isReplaced) {
          hasReplaced = true;
        }
        let n = item.baseline;
        if(n !== baseline) {
          let d = baseline - n;
          if(isVertical) {
            item.__offsetX(d);
          }
          else {
            item.__offsetY(d);
          }
          // text的话对齐下移可能影响整体高度，在同行有img这样的替换元素下，需记录最大偏移导致的高度
          // 比如一个字符和img，字符下调y即字符的baseline和图片底部对齐，导致高度增加lineHeight和baseline的差值
          if(d > 0) {
            increase = Math.max(increase, (isVertical ? item.width : item.height) + d);
          }
        }
      });
    }
    let diff = 0;
    // 特殊情况，只有1个img这样的替换元素时，或者只有img没有直接text时，也要进行检查，
    // 因为此时img要参与这一行和baseline的对齐扩充
    if(hasReplaced) {
      diff = this.__lineHeight - this.__baseline;
    }
    // 增加过的高度比最大还大时需要调整
    if(increase > lineHeight) {
      diff = Math.max(increase - lineHeight);
    }
    return diff;
  }

  __offsetX(diff, isVerticalAlign) {
    this.__x += diff;
    // vertical-align情况特殊对齐，可能替换元素img和text导致偏移，需触发整体和text偏移
    if(isVerticalAlign) {
      this.list.forEach(item => {
        // 是text的第一个的box的话，text也需要偏移，非第一个防止重复多次
        if(item instanceof TextBox) {
          let text = item.parent;
          if(text.textBoxes[0] === item) {
            text.__offsetX(diff);
          }
        }
        else {
          item.__offsetX(diff);
        }
      });
    }
  }

  __offsetY(diff, isVerticalAlign) {
    this.__y += diff;
    // vertical-align情况特殊对齐，可能替换元素img和text导致偏移，需触发整体和text偏移
    if(isVerticalAlign) {
      this.list.forEach(item => {
        // 是text的第一个的box的话，text也需要偏移，非第一个防止重复多次
        if(item instanceof TextBox) {
          let text = item.parent;
          if(text.textBoxes[0] === item) {
            text.__offsetY(diff);
          }
        }
        else {
          item.__offsetY(diff);
        }
      });
    }
  }

  /**
   * 防止非行首空inline，每当遇到inline就设置当前lineBox的lineHeight/baseline，这样有最小值兜底
   * @param l
   * @param b
   * @private
   */
  __setLB(l, b) {
    this.__lineHeight = Math.max(l, this.__lineHeight);
    this.__baseline = Math.max(b, this.__baseline);
  }

  __resetLb(l, b) {
    this.list.forEach(item => {
      let dom = item;
      if(item instanceof TextBox) {
        dom = item.parent.parent;
      }
      let computedStyle = dom.computedStyle;
      while(computedStyle[DISPLAY] === 'inline') {
        l = Math.max(l, computedStyle[LINE_HEIGHT]);
        b = Math.max(b, css.getBaseline(computedStyle));
        dom = dom.domParent;
        computedStyle = dom.computedStyle;
      }
    });
    this.__lineHeight = l;
    this.__baseline = b;
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

  get endX() {
    return this.x + this.width;
  }

  get endY() {
    return this.y + this.height;
  }

  get width() {
    let list = this.list;
    let length = list.length;
    if(length) {
      let first = list[0];
      let last = list[length - 1];
      let x1 = first.x;
      let dom = first instanceof TextBox ? first.parent.domParent : first.domParent;
      // 因为inline可以嵌套inline，所以一直向上查找到非inline为止，每层inline如果是首个则减去左侧mbp
      while(true) {
        let list = dom.contentBoxList;
        let {
          [DISPLAY]: display,
          [MARGIN_LEFT]: marginLeft,
          [BORDER_LEFT_WIDTH]: borderLeftWidth,
          [PADDING_LEFT]: paddingLeft,
        } = dom.computedStyle;
        if(display !== 'inline') {
          break;
        }
        if(first === list[0]) {
          x1 -= marginLeft + borderLeftWidth + paddingLeft;
        }
        dom = dom.domParent;
      }
      let x2 = last.x + last.outerWidth;
      dom = last instanceof TextBox ? last.parent.domParent : last.domParent;
      // 同向上查非inline，每层inline如果是最后一个则加上右侧mbp
      while(true) {
        let list = dom.contentBoxList;
        let {
          [DISPLAY]: display,
          [MARGIN_RIGHT]: marginRight,
          [BORDER_RIGHT_WIDTH]: borderRightWidth,
          [PADDING_RIGHT]: paddingRight,
        } = dom.computedStyle;
        if(display !== 'inline') {
          break;
        }
        if(first === list[list.length - 1]) {
          x2 += marginRight + borderRightWidth + paddingRight;
        }
        dom = dom.domParent;
      }
      return x2 - x1;
    }
    return 0;
  }

  get height() {
    return this.lineHeight;
  }

  get baseline() {
    let baseline = this.__baseline;
    // 只有TextBox和InlineBlock或replaced
    this.list.forEach(item => {
      baseline = Math.max(baseline, item.baseline);
    });
    return baseline;
  }

  get lineHeight() {
    let lineHeight = this.__lineHeight;
    // 只有TextBox和InlineBlock或replaced
    this.list.forEach(item => {
      lineHeight = Math.max(lineHeight, item.outerHeight);
    });
    return lineHeight;
  }

  get verticalLineHeight() {
    let lineHeight = this.__lineHeight;
    // 只有TextBox和InlineBlock或replaced
    this.list.forEach(item => {
      lineHeight = Math.max(lineHeight, item.outerWidth);
    });
    return lineHeight;
  }
}

export default LineBox;
