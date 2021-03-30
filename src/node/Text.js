import Node from './Node';
import TextBox from './TextBox';
import mode from './mode';
import css from '../style/css';
import enums from '../util/enums';
import util from '../util/util';
import textCache from './textCache';
import inject from '../util/inject';
import font from '../style/font';

const {
  STYLE_KEY: {
    DISPLAY,
    LINE_HEIGHT,
    FONT_SIZE,
    FONT_FAMILY,
    FONT_STYLE,
    FONT_WEIGHT,
    COLOR,
    VISIBILITY,
    LETTER_SPACING,
    OVERFLOW,
    WHITE_SPACE,
    TEXT_OVERFLOW,
  },
} = enums;

const ELLIPSIS = textCache.ELLIPSIS;

class Text extends Node {
  constructor(content) {
    super();
    this.__content = util.isNil(content) ? '' : content.toString();
    this.__textBoxes = [];
    this.__charWidthList = [];
    this.__charWidth = 0;
    this.__textWidth = 0;
  }

  /**
   * 预先计算每个字的宽度，在每次布局渲染前做
   * @param renderMode
   * @param ctx
   * @private
   */
  __computeMeasure(renderMode, ctx) {
    let { content, computedStyle, charWidthList } = this;
    // 每次都要清空重新计算，计算会有缓存
    charWidthList.splice(0);
    let ffs = computedStyle[FONT_FAMILY].split(',');
    let ff = 'arial';
    for(let i = 0, len = ffs.length; i < len; i++) {
      if(inject.checkSupportFontFamily(ffs[i])) {
        ff = ffs[i];
        break;
      }
    }
    this.__ff = ff;
    let fs = computedStyle[FONT_SIZE];
    let fw = computedStyle[FONT_WEIGHT];
    let key = this.__key = computedStyle[FONT_SIZE] + ',' + ff + ',' + fw;
    let wait = textCache.data[key] = textCache.data[key] || {
      ff,
      fs,
      fw,
      hash: {},
      s: '',
    };
    let cache = textCache.charWidth[key] = textCache.charWidth[key] || {};
    let sum = 0;
    let needMeasure = false;
    // text-overflow:ellipse需要，即便没有也要先测量，其基于最近非inline父节点的字体
    let bp = this.parent;
    while(bp.currentStyle[DISPLAY] === 'inline') {
      bp = bp.domParent;
    }
    this.__bp = bp;
    let parentComputedStyle = bp.computedStyle;
    let pff = 'arial';
    for(let i = 0, pffs = parentComputedStyle[FONT_FAMILY].split(','), len = pffs.length; i < len; i++) {
      if(inject.checkSupportFontFamily(pffs[i])) {
        ff = ffs[i];
        break;
      }
    }
    let pfs = parentComputedStyle[FONT_SIZE];
    let pfw = parentComputedStyle[FONT_WEIGHT];
    let pKey = this.__pKey = pfs + ',' + pff + ',' + pfw;
    let parentCache = textCache.charWidth[pKey] = textCache.charWidth[pKey] || {};
    if(renderMode === mode.CANVAS) {
      ctx.font = css.setFontStyle(parentComputedStyle);
      if(!parentCache.hasOwnProperty(ELLIPSIS)) {
        parentCache[ELLIPSIS] = ctx.measureText(ELLIPSIS).width;
        // wait.hash[ELLIPSIS] = true;
      }
    }
    else if(renderMode === mode.SVG) {
      if(!parentCache.hasOwnProperty(ELLIPSIS)) {
        parentCache[ELLIPSIS] = 0;
        let wait = textCache.data[pKey] = textCache.data[pKey] || {
          ff: pff,
          fs: pfs,
          fw: pfw,
          hash: {},
          s: '',
        };
        wait.s += ELLIPSIS;
        needMeasure = true;
      }
    }
    // 逐字测量，canvas可瞬间得到信息，svg先预存统一进行
    for(let i = 0, length = content.length; i < length; i++) {
      let char = content.charAt(i);
      let mw;
      if(cache.hasOwnProperty(char)) {
        mw = cache[char];
        charWidthList.push(mw);
        sum += mw;
        this.__charWidth = Math.max(this.charWidth, mw);
      }
      else if(renderMode === mode.CANVAS) {
        mw = cache[char] = ctx.measureText(char).width;
        charWidthList.push(mw);
        sum += mw;
        this.__charWidth = Math.max(this.charWidth, mw);
      }
      else {
        if(!wait.hash.hasOwnProperty(char)) {
          wait.s += char;
        }
        wait.hash[char] = true;
        // 先预存标识位-1，测量完后替换它
        charWidthList.push(-1);
        needMeasure = true;
      }
    }
    this.__textWidth = sum;
    if(needMeasure) {
      textCache.list.push(this);
    }
  }

  __measureCb() {
    let { content, charWidthList } = this;
    let key = this.__key;
    let cache = textCache.charWidth[key];
    let sum = 0;
    for(let i = 0, len = charWidthList.length; i < len; i++) {
      if(charWidthList[i] < 0) {
        let mw = charWidthList[i] = cache[content.charAt(i)];
        sum += mw;
        this.__charWidth = Math.max(this.charWidth, mw);
      }
    }
    this.__textWidth = sum;
  }

  /**
   * text在virtual时和普通一样，无需特殊处理
   * endSpace由外界inline布局控制，末尾最后一行的空白mpb，包含递归情况，递归为多个嵌套末尾节点的空白mpb之和
   * 即便宽度不足，每行还是强制渲染一个字符，换行依据lx开始，因为x可能是从中间开始的，非inline则两个相等
   * 最后一个字符排版时要考虑末尾mpb，排不下的话回退删掉这个字符，如果最后一个字符另起开头，排不下也强制排，每行至少1个字符
   * 在textOverflow时很特殊，多个inline同行，回退可能到前一个inline节点，这个通过x和lx判断是否行首，决定至少1个字符规则
   * @param data
   * @private
   */
  __layout(data) {
    let { x, y, w, lx = x, lineBoxManager, endSpace } = data;
    this.__x = this.__sx1 = x;
    this.__y = this.__sy1 = y;
    let { isDestroyed, content, currentStyle, computedStyle, textBoxes, charWidthList, root, __ff, __key } = this;
    textBoxes.splice(0);
    // 空内容w/h都为0可以提前跳出
    if(isDestroyed || currentStyle[DISPLAY] === 'none' || !content) {
      return;
    }
    this.__ox = this.__oy = 0;
    // 顺序尝试分割字符串为TextBox，形成多行，begin为每行起始索引，i是当前字符索引
    let begin = 0;
    let i = 0;
    let firstLineSpace = x - lx; // x>=lx，当第一行非起始处时前面被prev节点占据，这个差值可认为是count宽度
    let count = firstLineSpace;
    let length = content.length;
    let maxW = 0;
    let {
      [LINE_HEIGHT]: lineHeight,
      [LETTER_SPACING]: letterSpacing,
      [WHITE_SPACE]: whiteSpace,
      [FONT_SIZE]: fontSize,
      [FONT_WEIGHT]: fontWeight,
    } = computedStyle;
    // 特殊字体中特殊字符连续时需减少一定的padding量
    let padding = font.info[__ff].padding;
    let needReduce = !!padding;
    let lastChar;
    // 不换行特殊对待，同时考虑overflow和textOverflow
    if(whiteSpace === 'nowrap') {
      // count = 0; // 不换行时，首行统计从0开始
      let isTextOverflow;
      // block的overflow:hidden和textOverflow:clip/ellipsis才生效，inline要看最近非inline父元素
      let bp = this.__bp;
      let {
        [OVERFLOW]: overflow,
        [TEXT_OVERFLOW]: textOverflow,
      } = bp.currentStyle;
      // 只要是overflow隐藏，不管textOverflow如何（默认是clip等同于overflow:hidden的功能）都截取
      if(overflow === 'hidden') {
        while(i < length) {
          count += charWidthList[i] + letterSpacing;
          if(count > w) {
            isTextOverflow = true;
            break;
          }
          i++;
        }
      }
      else {
        while(i < length) {
          count += charWidthList[i] + letterSpacing;
          i++;
        }
      }
      // ellipsis生效情况，本节点开始向前回退查找，尝试放下一部分字符
      if(isTextOverflow && textOverflow === 'ellipsis') {
        let ew = textCache.charWidth[this.__pKey][ELLIPSIS];
        // 找到i的情况，即可以继续至少添加1个字符
        for(; i >= 0; i--) {
          count -= charWidthList[i - 1];
          let ww = count + ew;
          if(ww <= w) {
            let textBox = new TextBox(this, textBoxes.length, x, y, count - firstLineSpace, lineHeight,
              content.slice(0, i), charWidthList.slice(0, i));
            textBoxes.push(textBox);
            lineBoxManager.addItem(textBox, true);
            maxW = ww;
            y += lineHeight;
            this.__ellipsis = true;
            break;
          }
        }
        // 最后也没找到，看是否要查找前一个inline节点，还是本身是行首兜底首字母
        if(i < 0) {
          let lineBox = lineBoxManager.lineBox;
          // 有firstLineSpace或lineBox为空皆可，防止异常这2个条件都写上
          if(ew + firstLineSpace <= w || !firstLineSpace || !lineBox.size) {
            let textBox = new TextBox(this, textBoxes.length, x, y, ew, lineHeight, ELLIPSIS, [ew]);
            textBoxes.push(textBox);
            lineBoxManager.addItem(textBox, true);
            maxW = ew;
            y += lineHeight;
          }
          // 向前查找inline节点，可能会有前面inline嵌套，因此直接用lineBox，不会出现inlineBlock，
          // 这里和css不同，ib强制超限换行不会同行
          else {
            let list = lineBox.list;
            outer:
            for(let j = list.length - 1; j >= 0; j--) {
              let tb = list[j];
              let { content, wList, width } = tb;
              // 整体减去可以说明就在这个tb中，第0个强制进入
              if(count - width + ew <= w || !j) {
                tb.parent.__ellipsis = true;
                for(let k = wList.length - 1; k >= 0; k--) {
                  if(!k || count + ew <= w) {
                    tb.__content = content;
                    tb.__width = width;
                    break outer;
                  }
                  else {
                    let w2 = wList[k];
                    tb.__endY -= w2;
                    width -= w2;
                    content = content.slice(0, k);
                    count -= w2;
                    wList.pop();
                  }
                }
              }
              // 不够看前一个tb并且删掉这个
              else {
                count -= width;
                list.pop();
                tb.parent.textBoxes.pop();
              }
            }
          }
        }
      }
      // 默认clip跟随overflow:hidden，无需感知
      else {
        let textBox = new TextBox(this, textBoxes.length, x, y, count, lineHeight,
          content, charWidthList);
        textBoxes.push(textBox);
        lineBoxManager.addItem(textBox);
        maxW = count;
        y += lineHeight;
      }
    }
    // 普通换行，注意x和lx的区别，可能相同（block起始处）可能不同（非起始处），第1行从x开始，第2行及以后都从lx开始
    // 然后第一次换行还有特殊之处，可能同一行前半部行高很大，此时y增加并非自身的lineHeight，而是整体LineBox的
    else {
      let lineCount = 0;
      while(i < length) {
        let cw = charWidthList[i] + letterSpacing;
        count += cw;
        // 连续字符减少padding，除了连续还需判断char是否在padding的hash中
        if(needReduce) {
          let char = content[i];
          if(char === lastChar && padding[char]) {
            let hasCache, p = textCache.padding[__key] = textCache.padding[__key] || {};
            if(textCache.padding.hasOwnProperty(__key)) {
              if(p.hasOwnProperty(char)) {
                hasCache = true;
                count -= p[char];
              }
            }
            if(!hasCache) {
              let n = 0;
              if(root.renderMode === mode.CANVAS) {
                root.ctx.font = css.setFontStyle(computedStyle);
                let w1 = root.ctx.measureText(char).width;
                let w2 = root.ctx.measureText(char + char).width;
                n = w1 * 2 - w2;
                n *= padding[char];
              }
              else if(root.renderMode === mode.SVG) {
                n = inject.measureTextSync(__key, __ff, fontSize, fontWeight, char);
                n *= padding[char];
              }
              count -= n;
              p[char] = n;
            }
          }
          lastChar = char;
        }
        // 忽略零宽字符
        if(cw === 0) {
          i++;
          continue;
        }
        // 换行都要判断i不是0的时候，第1个字符强制不换行
        if(count === w) {
          let textBox;
          // 特殊情况，恰好最后一行最后一个排满，此时查看末尾mpb
          if(i === length - 1 && count > w - endSpace && i) {
            count -= charWidthList[i - 1];
            i--;
          }
          if(!lineCount) {
            maxW = count - firstLineSpace;
            textBox = new TextBox(this, textBoxes.length, x, y, maxW, lineHeight, content.slice(begin, i + 1), charWidthList.slice(begin, i + 1));
          }
          else {
            textBox = new TextBox(this, textBoxes.length, lx, y, count, lineHeight, content.slice(begin, i + 1), charWidthList.slice(begin, i + 1));
            maxW = Math.max(maxW, count);
          }
          // 必须先添加再设置y，当有diff的lineHeight时，第一个换行不影响，再换行时第2个换行即第3行会被第1行影响
          textBoxes.push(textBox);
          lineBoxManager.addItem(textBox, true);
          y += Math.max(lineHeight, lineBoxManager.lineHeight);
          begin = i + 1;
          i = begin;
          count = 0;
          lineCount++;
        }
        else if(count > w) {
          let width;
          // 宽度不足时无法跳出循环，至少也要塞个字符形成一行，无需判断第1行，因为是否放得下逻辑在dom中做过了，
          // 如果第1行放不下，一定会另起一行，此时作为开头再放不下才会进这里条件
          if(i === begin) {
            i = begin + 1;
            width = count;
          }
          else {
            width = count - charWidthList[i];
          }
          let textBox;
          if(!lineCount) {
            maxW = width - firstLineSpace;
            textBox = new TextBox(this, textBoxes.length, x, y, maxW, lineHeight, content.slice(begin, i), charWidthList.slice(begin, i));
          }
          else {
            textBox = new TextBox(this, textBoxes.length, lx, y, width, lineHeight, content.slice(begin, i), charWidthList.slice(begin, i));
            maxW = Math.max(maxW, width);
          }
          // 必须先添加再设置y，同上
          textBoxes.push(textBox);
          lineBoxManager.addItem(textBox, true);
          y += Math.max(lineHeight, lineBoxManager.lineHeight);
          begin = i;
          count = 0;
          lineCount++;
        }
        else {
          i++;
        }
      }
      // 换行后Text的x重设为lx
      if(!lineCount) {
        this.__x = this.__sx1 = lx;
      }
      // 最后一行，只有一行未满时也进这里，需查看末尾mpb，排不下回退一个字符
      if(begin < length) {
        let textBox;
        if(!lineCount) {
          let needBack;
          // 防止开头第一个begin=0时回退，这在inline有padding且是第一个child时会发生
          if(begin && count > w - endSpace) {
            needBack = true;
            count -= charWidthList[length - 1];
          }
          maxW = count - firstLineSpace;
          textBox = new TextBox(this, textBoxes.length, x, y, maxW, lineHeight, content.slice(begin, needBack ? length - 1 : length), charWidthList.slice(begin, needBack ? length - 1 : length));
          textBoxes.push(textBox);
          lineBoxManager.addItem(textBox);
          y += Math.max(lineHeight, lineBoxManager.lineHeight);
          if(needBack) {
            let width = charWidthList[length - 1];
            textBox = new TextBox(this, textBoxes.length, lx, y, width, lineHeight, content.slice(length - 1), charWidthList.slice(length - 1));
            maxW = Math.max(maxW, width);
            textBoxes.push(textBox);
            lineBoxManager.setNewLine();
            lineBoxManager.addItem(textBox);
            y += lineHeight;
          }
        }
        else {
          let needBack;
          // 防止begin在结尾时回退，必须要有个字符，这在最后一行1个字符排不下时会出现
          if(count > w - endSpace && begin < length - 1) {
            needBack = true;
            count -= charWidthList[length - 1];
          }
          textBox = new TextBox(this, textBoxes.length, lx, y, count, lineHeight, content.slice(begin, needBack ? length - 1 : length), charWidthList.slice(begin, needBack ? length - 1 : length));
          maxW = Math.max(maxW, count);
          textBoxes.push(textBox);
          lineBoxManager.addItem(textBox);
          y += Math.max(lineHeight, lineBoxManager.lineHeight);
          if(needBack) {
            let width = charWidthList[length - 1];
            textBox = new TextBox(this, textBoxes.length, lx, y, width, lineHeight, content.slice(length - 1), charWidthList.slice(length - 1));
            maxW = Math.max(maxW, width);
            textBoxes.push(textBox);
            lineBoxManager.setNewLine();
            lineBoxManager.addItem(textBox);
            y += lineHeight;
          }
        }
      }
    }
    this.__width = maxW;
    this.__height = y - data.y;
    this.__baseLine = css.getBaseLine(computedStyle);
  }

  __offsetX(diff, isLayout) {
    super.__offsetX(diff, isLayout);
    if(isLayout) {
      this.textBoxes.forEach(item => {
        item.__offsetX(diff);
      });
    }
    this.__sx1 += diff;
  }

  __offsetY(diff, isLayout) {
    super.__offsetY(diff, isLayout);
    if(isLayout) {
      this.textBoxes.forEach(item => {
        item.__offsetY(diff);
      });
    }
    this.__sy1 += diff;
  }

  __tryLayInline(w) {
    return w - this.charWidthList[0];
  }

  __calMaxAndMinWidth() {
    let n = 0;
    this.charWidthList.forEach(item => {
      n = Math.max(n, item);
    });
    return { max: this.textWidth, min: n };
  }

  __calAbsWidth(x, y, w) {
    this.__layout({
      x,
      y,
      w,
    }, true);
    return this.width;
  }

  render(renderMode, lv, ctx, defs, dx = 0, dy = 0) {
    if(renderMode === mode.SVG) {
      this.__virtualDom = {
        type: 'text',
        children: [],
      };
    }
    let { isDestroyed, computedStyle, textBoxes, cacheStyle, __ellipsis, __bp } = this;
    if(isDestroyed || computedStyle[DISPLAY] === 'none' || computedStyle[VISIBILITY] === 'hidden' || !textBoxes.length) {
      return false;
    }
    if(renderMode === mode.CANVAS) {
      let font = css.setFontStyle(computedStyle);
      if(ctx.font !== font) {
        ctx.font = font;
      }
      let color = cacheStyle[COLOR];
      if(ctx.fillStyle !== color) {
        ctx.fillStyle = color;
      }
    }
    textBoxes.forEach(item => {
      item.render(renderMode, ctx, computedStyle, cacheStyle, dx, dy);
    });
    if(renderMode === mode.SVG) {
      this.virtualDom.children = textBoxes.map(textBox => textBox.virtualDom);
    }
    // textOverflow的省略号font使用最近非inline的父节点
    if(__ellipsis) {
      let last = textBoxes[textBoxes.length - 1];
      let { endX, endY } = last;
      let computedStyle = __bp.computedStyle;
      if(renderMode === mode.CANVAS) {
        let font = css.setFontStyle(computedStyle);
        if(ctx.font !== font) {
          ctx.font = font;
        }
        let color = __bp.__cacheStyle[COLOR];
        if(ctx.fillStyle !== color) {
          ctx.fillStyle = color;
        }
        ctx.fillText(ELLIPSIS, endX, endY);
      }
      else if(renderMode === mode.SVG) {
        let props = [
          ['x', endX],
          ['y', endY],
          ['fill', __bp.__cacheStyle[COLOR]],
          ['font-family', computedStyle[FONT_FAMILY]],
          ['font-weight', computedStyle[FONT_WEIGHT]],
          ['font-style', computedStyle[FONT_STYLE]],
          ['font-size', computedStyle[FONT_SIZE] + 'px'],
        ];
        this.virtualDom.children.push({
          type: 'item',
          tagName: 'text',
          props,
          content: ELLIPSIS,
        });
      }
    }
    return true;
  }

  __deepScan(cb) {
    cb(this);
  }

  get content() {
    return this.__content;
  }

  set content(v) {
    this.__content = v;
  }

  get textBoxes() {
    return this.__textBoxes;
  }

  get charWidthList() {
    return this.__charWidthList;
  }

  get charWidth() {
    return this.__charWidth;
  }

  get firstCharWidth() {
    return this.charWidthList[0] || 0;
  }

  get textWidth() {
    return this.__textWidth;
  }

  get baseLine() {
    return this.__baseLine;
  }

  get root() {
    return this.parent.root;
  }

  get currentStyle() {
    return this.parent.currentStyle;
  }

  get computedStyle() {
    return this.parent.computedStyle;
  }

  get cacheStyle() {
    return this.parent.__cacheStyle;
  }

  get bbox() {
    if(!this.content) {
      return;
    }
    let { sx, sy, width, height } = this;
    let x1 = sx, y1 = sy;
    let x2 = sx + width, y2 = sy + height;
    return [x1, y1, x2, y2];
  }
}

Text.prototype.__renderByMask = Text.prototype.render;

export default Text;
