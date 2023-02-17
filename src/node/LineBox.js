import TextBox from './TextBox';
import enums from '../util/enums';
import css from '../style/css';

const { STYLE_KEY: {
  DISPLAY,
  MARGIN_TOP,
  MARGIN_BOTTOM,
  MARGIN_LEFT,
  MARGIN_RIGHT,
  BORDER_TOP_WIDTH,
  BORDER_BOTTOM_WIDTH,
  BORDER_LEFT_WIDTH,
  BORDER_RIGHT_WIDTH,
  PADDING_TOP,
  PADDING_BOTTOM,
  PADDING_LEFT,
  PADDING_RIGHT,
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
  constructor(x, y, lineHeight, baseline, isUpright) {
    this.__list = [];
    this.__x = x;
    this.__y = y;
    this.__oy = 0; // 很难受，relative的offset不能直接加在x上，会引发重复以及block父尺寸问题
    this.__lineHeight = lineHeight; // 可能出现空的inline，因此一个inline进入布局时先设置当前lineBox的最小lineHeight/baseline
    this.__baseline = baseline;
    this.__isUpright = isUpright;
    this.__bOffset = 0;
  }

  add(item) {
    this.list.push(item);
    item.__parentLineBox = this;
  }

  verticalAlign(isUpright) {
    let baseline = isUpright ? this.verticalBaseline : this.baseline;
    let lineHeight = isUpright ? this.verticalLineHeight : this.lineHeight;
    let increase = lineHeight;
    // 只有1个也需要对齐，因为可能内嵌了空inline使得baseline发生变化
    if(this.list.length) {
      this.list.forEach(item => {
        if(item.isEllipsis) {
          return;
        }
        // 垂直排版计算不太一样，因为原点坐标系不一样
        if(isUpright) {
          let n = item.verticalBaseline;
          if(n !== baseline) {
            let d = baseline - n;
            item.__offsetX(d, true);
            if(item instanceof TextBox) {
              item.__parent.__offsetX(d, false);
            }
            // 同下方
            increase = Math.max(increase, item.offsetWidth + d);
          }
        }
        else {
          let n = item.baseline;
          if(n !== baseline) {
            let d = baseline - n;
            item.__offsetY(d, true);
            // TextBox偏移后，Text也要更改x/y坐标，否则bbox不对，webgl渲染缓存位图就会偏差
            if(item instanceof TextBox) {
              item.__parent.__offsetY(d, false);
            }
            // text的话对齐下移可能影响整体高度，在同行有img/ib这样的替换元素下，需记录最大偏移导致的高度调整值
            // 比如一个字符和img，字符下调y即字符的baseline和图片底部对齐，导致高度增加lineHeight和baseline的差值
            increase = Math.max(increase, item.offsetHeight + d);
          }
        }
      });
      // 特殊情况，有img这样的替换元素时，要参与这一行和baseline的对齐扩充，常见于css的img底部额外4px问题
      // 先计算总体baseline和本身baseline差值得出偏移，然后加到本身lineHeight上得出尺寸，再和其它扩充取最大值
      let diff = baseline - this.__baseline;
      increase = Math.max(increase, this.__lineHeight + diff);
    }
    return Math.max(0, increase - lineHeight);
  }

  __offsetX(diff, isAlign) {
    this.__x += diff;
    // vertical-align或水平情况特殊对齐，可能替换元素img和text导致偏移
    if(isAlign) {
      this.list.forEach(item => {
        item.__offsetX(diff, true);
      });
    }
  }

  __offsetY(diff, isAlign) {
    this.__y += diff;
    // vertical-align情况或水平特殊对齐，可能替换元素img和textBox导致偏移
    if(isAlign) {
      this.list.forEach(item => {
        item.__offsetY(diff, true);
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

  get ox() {
    return this.__ox;
  }

  get oy() {
    return this.__oy;
  }

  get endX() {
    return this.x + this.width;
  }

  get endY() {
    return this.y + this.height;
  }

  get width() {
    if(this.isUpright) {
      return this.verticalLineHeight;
    }
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
    if(!this.isUpright) {
      return this.lineHeight;
    }
    let list = this.list;
    let length = list.length;
    if(length) {
      let first = list[0];
      let last = list[length - 1];
      let y1 = first.y;
      let dom = first instanceof TextBox ? first.parent.domParent : first.domParent;
      // 因为inline可以嵌套inline，所以一直向上查找到非inline为止，每层inline如果是首个则减去左侧mbp
      while(true) {
        let list = dom.contentBoxList;
        let {
          [DISPLAY]: display,
          [MARGIN_TOP]: marginTop,
          [BORDER_TOP_WIDTH]: borderTopWidth,
          [PADDING_TOP]: paddingTop,
        } = dom.computedStyle;
        if(display !== 'inline') {
          break;
        }
        if(first === list[0]) {
          y1 -= marginTop + borderTopWidth + paddingTop;
        }
        dom = dom.domParent;
      }
      let y2 = last.y + last.outerHeight;
      dom = last instanceof TextBox ? last.parent.domParent : last.domParent;
      // 同向上查非inline，每层inline如果是最后一个则加上右侧mbp
      while(true) {
        let list = dom.contentBoxList;
        let {
          [DISPLAY]: display,
          [MARGIN_BOTTOM]: marginBottom,
          [BORDER_BOTTOM_WIDTH]: borderBottomWidth,
          [PADDING_BOTTOM]: paddingBottom,
        } = dom.computedStyle;
        if(display !== 'inline') {
          break;
        }
        if(first === list[list.length - 1]) {
          y2 += marginBottom + borderBottomWidth + paddingBottom;
        }
        dom = dom.domParent;
      }
      return y2 - y1;
    }
    return 0;
  }

  get bOffset() {
    return this.__bOffset;
  }

  get baseline() {
    let baseline = this.__baseline;
    // 只有TextBox和InlineBlock或replaced
    this.list.forEach(item => {
      baseline = Math.max(baseline, item.baseline);
    });
    return baseline;
  }

  get verticalBaseline() {
    let baseline = this.__baseline;
    // 只有TextBox和InlineBlock或replaced
    this.list.forEach(item => {
      baseline = Math.max(baseline, item.verticalBaseline);
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

  get isUpright() {
    return this.__isUpright;
  }
}

export default LineBox;
