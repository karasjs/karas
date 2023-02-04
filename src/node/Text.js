import Node from './Node';
import TextBox from './TextBox';
import Ellipsis from './Ellipsis';
import mode from '../refresh/mode';
import css from '../style/css';
import unit from '../style/unit';
import enums from '../util/enums';
import util from '../util/util';
import inject from '../util/inject';
import level from '../refresh/level';

const {
  STYLE_KEY: {
    DISPLAY,
    POSITION,
    LINE_HEIGHT,
    FONT_SIZE,
    FONT_FAMILY,
    FONT_WEIGHT,
    COLOR,
    VISIBILITY,
    LETTER_SPACING,
    OVERFLOW,
    WHITE_SPACE,
    TEXT_OVERFLOW,
    WIDTH,
    HEIGHT,
    TEXT_STROKE_COLOR,
    TEXT_STROKE_WIDTH,
    MARGIN_TOP,
    MARGIN_BOTTOM,
    MARGIN_LEFT,
    MARGIN_RIGHT,
    PADDING_TOP,
    PADDING_BOTTOM,
    PADDING_LEFT,
    PADDING_RIGHT,
    BORDER_TOP_WIDTH,
    BORDER_BOTTOM_WIDTH,
    BORDER_LEFT_WIDTH,
    BORDER_RIGHT_WIDTH,
    FILTER,
    FONT_SIZE_SHRINK,
  },
  ELLIPSIS,
} = enums;

const { AUTO } = unit;
const { CANVAS, SVG, WEBGL } = mode;
const { isFunction } = util;

/**
 * 测量的封装，主要是增加了shrinkFontSize声明时，不断尝试fontSize--，直到限制或者满足一行展示要求
 */
function measureLineWidth(ctx, renderMode, start, length, content, w, ew, perW, computedStyle,
                          fontFamily, fontSize, fontWeight, fontSizeShrink, letterSpacing, isUpright) {
  if(start >= length) {
    // 特殊情况不应该走进这里
    return { hypotheticalNum: 0, rw: 0, newLine: false };
  }
  let res = measure(ctx, renderMode, start, length, content, w - ew, perW,
    fontFamily, fontSize, fontWeight, letterSpacing, isUpright);
  if(res.newLine && fontSizeShrink > 0 && fontSizeShrink < fontSize) {
    while(res.newLine && fontSize > fontSizeShrink) {
      // 文字和ellipsis同时设置测量
      ctx.font = css.setFontStyle(computedStyle, --fontSize);
      if(renderMode === CANVAS || renderMode === WEBGL) {
        ew = ctx.measureText(ELLIPSIS).width;
      }
      else {
        ew = inject.measureTextSync(ELLIPSIS, computedStyle[FONT_FAMILY], fontSize, computedStyle[FONT_WEIGHT]);
      }
      res = measure(ctx, renderMode, start, length, content, w - ew, perW,
        fontFamily, fontSize, fontWeight, letterSpacing, isUpright);
      res.fitFontSize = fontSize;
      res.ew = ew;
      // 有ew的时候还要尝试没有是否放得下
      if(ew) {
        let t = measure(ctx, renderMode, start, length, content, w, perW,
          fontFamily, fontSize, fontWeight, letterSpacing, isUpright);
        if(!t.newLine) {
          t.fitFontSize = fontSize;
          res = t;
        }
      }
    }
  }
  return res;
}

/**
 * 在给定宽度w的情况下，测量文字content多少个满足塞下，只支持水平书写，从start的索引开始，content长length
 * 尽可能地少的次数调用canvas的measureText或svg的html节点的width，因为比较消耗性能
 * 这就需要一种算法，不能逐字遍历看总长度是否超过，也不能单字宽度相加因为有文本整形某些字体多个字宽度不等于每个之和
 * 简单的2分法实现简单，但是次数稍多，对于性能不是最佳，因为内容的slice裁剪和传递给canvas测量都随尺寸增加而加大
 * 由于知道w和fontSize，因此能推测出平均值为fontSize/w，即字的个数，
 * 进行测量后得出w2，和真实w对比，产生误差d，再看d和fontSize推测差距个数，如此反复
 * 返回内容和end索引和长度，最少也要1个字符
 */
function measure(ctx, renderMode, start, length, content, w, perW,
                 fontFamily, fontSize, fontWeight, letterSpacing, isUpright) {
  let i = start, j = length, rw = 0, newLine = false;
  // 特殊降级，有letterSpacing时，canvas无法完全兼容，只能采取单字测量的方式完成
  if(letterSpacing && [CANVAS, WEBGL].indexOf(renderMode) > -1) {
    let count = 0;
    for(; i < j; i++) {
      let mw = ctx.measureText(content.charAt(i)).width + letterSpacing;
      if(count + mw > w + (1e-10)) {
        newLine = true;
        break;
      }
      count += mw;
    }
    return { hypotheticalNum: i - start, rw: count, newLine: newLine || count > w + (1e-10) };
  }
  // 没有letterSpacing或者是svg模式可以完美获取TextMetrics
  let hypotheticalNum = Math.round(w / perW);
  // 不能增长0个字符，至少也要1个
  if(hypotheticalNum <= 0) {
    hypotheticalNum = 1;
  }
  // 超过内容长度范围也不行
  else if(hypotheticalNum > length - start) {
    hypotheticalNum = length - start;
  }
  // 类似2分的一个循环
  while(i < j) {
    let mw, str = content.slice(start, start + hypotheticalNum);
    if(renderMode === CANVAS || renderMode === WEBGL) {
      mw = ctx.measureText(str).width;
    }
    else if(renderMode === SVG) {
      mw = inject.measureTextSync(str, fontFamily, fontSize, fontWeight, isUpright);
    }
    if(letterSpacing) {
      mw += hypotheticalNum * letterSpacing;
    }
    if(mw === w) {
      rw = w;
      newLine = true;
      break;
    }
    // 超出，设置右边界，并根据余量推测减少个数，
    // 因为精度问题，固定宽度或者累加的剩余空间，不用相等判断，而是为原本w宽度加一点点冗余1e-10
    if(mw > w + (1e-10)) {
      newLine = true;
      // 限制至少1个
      if(hypotheticalNum === 1) {
        rw = mw;
        break;
      }
      // 注意特殊判断i和j就差1个可直接得出结果，因为现在超了而-1不超肯定是-1的结果
      if(i === j - 1 || i - start === hypotheticalNum - 1) {
        hypotheticalNum = i - start;
        break;
      }
      j = hypotheticalNum + start - 1;
      let reduce = Math.round((mw - w) / perW);
      if(reduce <= 0) {
        reduce = 1;
      }
      hypotheticalNum -= reduce;
      if(hypotheticalNum < i - start) {
        hypotheticalNum = i - start;
      }
    }
    // 还有空余，设置左边界，并根据余量推测增加的个数
    else {
      rw = mw;
      if(hypotheticalNum === length - start) {
        break;
      }
      i = hypotheticalNum + start;
      let add = Math.round((w - mw) / perW);
      if(add <= 0) {
        add = 1;
      }
      hypotheticalNum += add;
      if(hypotheticalNum > j - start) {
        hypotheticalNum = j - start;
      }
    }
  }
  return { hypotheticalNum, rw, newLine };
}

function getFontKey(ff, fs, fw, ls) {
  return ff + '_' + fs + '_' + fw + '_' + ls;
}

class Text extends Node {
  constructor(content) {
    super();
    this.__content = util.isNil(content) ? '' : content.toString();
    this.__textBoxes = [];
    this.__charWidth = 0; // 最小字符宽度（单个）
    this.__textWidth = 0; // 整体宽度
    this.__bp = null; // block父节点
    this.__widthHash = {}; // 存储当前字体样式key下的charWidth/textWidth
    this.__limitCache = false;
    this.__hasContent = false;
    this.__fitFontSize = 0; // 自动缩小时的字体大小N
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
  __layoutFlow(data) {
    let __cache = this.__cache;
    if(__cache) {
      __cache.release();
    }
    let { x, y, w, h, lx = x, ly = y, lineBoxManager, endSpace = 0, lineClamp = 0, lineClampCount = 0, isUpright = false } = data;
    this.__x = this.__x1 = x;
    this.__y = this.__y1 = y;
    let { __isDestroyed, content, computedStyle, textBoxes, root } = this;
    textBoxes.splice(0);
    // 空内容w/h都为0可以提前跳出，lineClamp超出一般不会进这，但有特例flex文本垂直预计算时，所以也要跳出
    if(__isDestroyed || computedStyle[DISPLAY] === 'none' || !content || lineClamp && lineClampCount >= lineClamp) {
      return lineClampCount;
    }
    // 顺序尝试分割字符串为TextBox，形成多行，begin为每行起始索引，i是当前字符索引
    let i = 0;
    let length = content.length;
    let maxW = 0;
    let {
      [LINE_HEIGHT]: lineHeight,
      [LETTER_SPACING]: letterSpacing,
      [WHITE_SPACE]: whiteSpace,
      [FONT_SIZE]: fontSize,
      [FONT_WEIGHT]: fontWeight,
      [FONT_FAMILY]: fontFamily,
    } = computedStyle;
    let size = isUpright ? h : w;
    let beginSpace = isUpright ? (y - ly) : (x - lx); // x>=lx，当第一行非起始处时前面被prev节点占据，这个差值可认为是count宽度
    // 基于最近block父节点的样式
    let bp = this.domParent;
    while(bp.computedStyle[DISPLAY] === 'inline') {
      bp = bp.domParent;
    }
    this.__bp = bp;
    let textOverflow = bp.computedStyle[TEXT_OVERFLOW];
    // 布局测量前置，根据renderMode不同提供不同的测量方法
    let renderMode = root.renderMode;
    let ctx;
    if(renderMode === CANVAS || renderMode === WEBGL) {
      ctx = renderMode === WEBGL
        ? inject.getFontCanvas().ctx
        : root.ctx;
      ctx.font = css.setFontStyle(computedStyle, 0);
    }
    // fontSize在中文是正好1个字宽度，英文不一定，等宽为2个，不等宽可能1~2个，特殊字符甚至>2个，取预估均值然后倒数得每个均宽0.8
    let perW = (fontSize * 0.8) + letterSpacing;
    let lineCount = 0;
    let mainCoords; // 根据书写模式指向不同x/y
    // 不换行特殊对待，同时考虑overflow和textOverflow
    if(whiteSpace === 'nowrap') {
      let isTextOverflow, textWidth = this.textWidth, w = size - endSpace - beginSpace;
      let {
        [POSITION]: position,
        [OVERFLOW]: overflow,
        [FONT_SIZE_SHRINK]: fontSizeShrink,
      } = bp.computedStyle;
      let containerSize = bp.currentStyle[isUpright ? HEIGHT: WIDTH];
      // 只要是overflow隐藏，不管textOverflow如何（默认是clip等同于overflow:hidden的功能）都截取
      if(overflow === 'hidden') {
        // abs自适应宽度时不裁剪
        if(position === 'absolute' && containerSize.u === AUTO) {
          isTextOverflow = false;
        }
        else {
          isTextOverflow = textWidth > size + (1e-10) - beginSpace - endSpace;
        }
      }
      // ellipsis生效情况，本节点开始向前回退查找，尝试放下一部分字符
      if(isTextOverflow && textOverflow === 'ellipsis') {
        [mainCoords] = this.__lineBack(ctx, renderMode, i, length, content, w, perW, x, y, maxW,
          endSpace, lineHeight, textBoxes, lineBoxManager, fontFamily, fontSize, fontWeight, fontSizeShrink, letterSpacing, isUpright);
        lineCount++;
        if(isUpright) {
          x = mainCoords;
        }
        else {
          y = mainCoords;
        }
      }
      // 默认是否clip跟随overflow:hidden，无需感知，裁剪由dom做，这里不裁剪
      else {
        // 但还是要判断缩小字体适应
        if(fontSizeShrink > 0 && fontSizeShrink < fontSize) {
          let fs = fontSize;
          this.__fitFontSize = 0;
          while(fs > fontSizeShrink && textWidth > w) {
            if(renderMode === CANVAS || renderMode === WEBGL) {
              ctx.font = css.setFontStyle(computedStyle, --fs);
              textWidth = ctx.measureText(content).width + letterSpacing * content.length;
            }
            else if(renderMode === SVG) {
              textWidth = inject.measureTextSync(content, fontFamily, fs, fontWeight) + letterSpacing * content.length;
            }
          }
          this.__fitFontSize = fs;
        }
        let textBox = new TextBox(this, textBoxes.length, x, y, textWidth, lineHeight,
          content, isUpright);
        textBoxes.push(textBox);
        lineBoxManager.addItem(textBox, false);
        if(isUpright) {
          x += lineHeight;
        }
        else {
          y += lineHeight;
        }
        if(isTextOverflow) {
          lineCount++;
        }
      }
      // 和html一样，maxW此时在html是满格
      maxW = textWidth;
    }
    // 普通换行，注意x和lx的区别，可能相同（block起始处）可能不同（非起始处），第1行从x开始，第2行及以后都从lx开始
    // 然后第一次换行还有特殊之处，可能同一行前半部行高很大，此时y增加并非自身的lineHeight，而是整体LineBox的
    else {
      while(i < length) {
        let limit = i ? size : (size - beginSpace);
        if(lineClamp && lineCount + lineClampCount >= lineClamp - 1) {
          limit -= endSpace;
        }
        let { hypotheticalNum: num, rw, newLine } = measureLineWidth(ctx, renderMode, i, length, content, limit, 0, perW,
          computedStyle, fontFamily, fontSize, fontWeight, 0, letterSpacing);
        // 多行文本截断，这里肯定需要回退，注意防止恰好是最后一个字符，此时无需截取
        if(lineClamp && newLine && lineCount + lineClampCount >= lineClamp - 1 && i + num < length) {
          [mainCoords, maxW] = this.__lineBack(ctx, renderMode, i, i + num, content, limit - endSpace, perW,
            lineCount ? lx : x, y, maxW, endSpace, lineHeight, textBoxes, lineBoxManager,
            fontFamily, fontSize, fontWeight, 0, letterSpacing, isUpright);
          lineCount++;
          if(isUpright) {
            x = mainCoords;
          }
          else {
            y = mainCoords;
          }
          break;
        }
        // 最后一行考虑endSpace，可能不够需要回退，但不能是1个字符
        if(i + num === length && endSpace && rw + endSpace > limit + (1e-10) && num > 1) {
          let res = measureLineWidth(ctx, renderMode, i, length, content, limit - endSpace, 0, perW,
            computedStyle, fontFamily, fontSize, fontWeight, 0, letterSpacing);
          num = res.hypotheticalNum;
          rw = res.rw;
          newLine = res.newLine;
          // 可能加上endSpace后超过了，还得再判断一次
          if(lineClamp && newLine && lineCount + lineClampCount >= lineClamp - 1) {
            [mainCoords, maxW] = this.__lineBack(ctx, renderMode, i, i + num, content, limit - endSpace, perW,
              lineCount ? lx : x, y, maxW, endSpace, lineHeight, textBoxes, lineBoxManager,
              fontFamily, fontSize, fontWeight, 0, letterSpacing, isUpright);
            lineCount++;
            if(isUpright) {
              x = mainCoords;
            }
            else {
              y = mainCoords;
            }
            break;
          }
        }
        maxW = Math.max(maxW, rw);
        // 根据是否第一行分开处理行首空白
        let textBox = new TextBox(this, textBoxes.length,
          lineCount && !isUpright ? lx : x,
          lineCount && isUpright ? ly : y,
          rw, lineHeight, content.slice(i, i + num), isUpright);
        textBoxes.push(textBox);
        lineBoxManager.addItem(textBox, newLine);
        // 竖排横排换行不一样
        if(isUpright) {
          x += Math.max(lineHeight, lineBoxManager.verticalLineHeight);
        }
        else {
          y += Math.max(lineHeight, lineBoxManager.lineHeight);
        }
        // 至少也要1个字符形成1行，哪怕是首行，因为是否放得下逻辑在dom中做过了
        i += num;
        if(newLine) {
          lineCount++;
        }
      }
      // 换行后Text的x重设为lx
      if(lineCount) {
        if(isUpright) {
          this.__y = this.__y1 = ly;
        }
        else {
          this.__x = this.__x1 = lx;
        }
      }
    }
    if(isUpright) {
      this.__width = x - data.x;
      this.__height = maxW;
      this.__verticalBaseline = css.getVerticalBaseline(computedStyle);
    }
    else {
      this.__width = maxW;
      this.__height = y - data.y;
      this.__baseline = css.getBaseline(computedStyle);
    }
    return lineClampCount + lineCount;
  }

  __layoutNone() {
    this.__width = this.__height = this.__baseline = this.__verticalBaseline = 0;
    this.__textBoxes.splice(0);
  }

  // 末尾行因ellipsis的缘故向前回退字符生成textBox，可能会因不满足宽度导致无法生成，此时向前继续回退TextBox
  __lineBack(ctx, renderMode, i, length, content, limit, perW, x, y, maxW, endSpace, lineHeight, textBoxes, lineBoxManager,
              fontFamily, fontSize, fontWeight, fontSizeShrink, letterSpacing, isUpright) {
    let ew, bp = this.__bp, computedStyle = bp.computedStyle;
    // 临时测量ELLIPSIS的尺寸
    if(renderMode === CANVAS || renderMode === WEBGL) {
      let font = css.setFontStyle(computedStyle, 0);
      if(ctx.font !== font) {
        ctx.font = font;
      }
      ew = ctx.measureText(ELLIPSIS).width;
    }
    else {
      ew = inject.measureTextSync(ELLIPSIS, computedStyle[FONT_FAMILY], computedStyle[FONT_SIZE], computedStyle[FONT_WEIGHT]);
    }
    if(renderMode === CANVAS || renderMode === WEBGL) {
      let font = css.setFontStyle(this.computedStyle, 0);
      if (ctx.font !== font) {
        ctx.font = font;
      }
    }
    this.__fitFontSize = 0;
    let { hypotheticalNum: num, rw, newLine, fitFontSize, ew: ew2 } = measureLineWidth(ctx, renderMode, i, length, content, limit - endSpace, ew, perW,
      computedStyle, fontFamily, fontSize, fontWeight, fontSizeShrink, letterSpacing);
    // 缩小的fontSize
    if(fitFontSize) {
      this.__fitFontSize = fitFontSize;
    }
    if(ew2) {
      ew = ew2;
    }
    // 缩小后可能不再换行，下面的逻辑都要预先判断newLine
    // 还是不够，需要回溯查找前一个inline节点继续回退，同时防止空行首，要至少一个textBox且一个字符
    if(newLine && rw + ew > limit + (1e-10) - endSpace) {
      // 向前回溯已有的tb，需注意可能是新行开头这时还没生成新的lineBox，而旧行则至少1个内容
      // 新行的话进不来，会添加上面num的内容，旧行不添加只修改之前的tb内容也有可能删除一些
      let lineBox = lineBoxManager.lineBox;
      if(!lineBoxManager.isNewLine && lineBox && lineBox.size) {
        let list = lineBox.list;
        for(let j = list.length - 1; j >= 0; j--) {
          let tb = list[j];
          // 可能是个inlineBlock，整个省略掉，除非是第一个不作ellipsis处理
          if(!(tb instanceof TextBox)) {
            if(!j) {
              break;
            }
            let item = list.pop();
            if(isUpright) {
              y -= item.outerHeight;
            }
            else {
              x -= item.outerWidth;
            }
            limit += isUpright ? item.outerHeight : item.outerWidth;
            item.__layoutNone();
            continue;
          }
          // 先判断整个tb都删除是否可以容纳下，同时注意第1个tb不能删除因此必进
          let { content, width, height, parent } = tb;
          if(!j || limit >= width + ew + (1e-10) + endSpace) {
            let length = content.length;
            let {
              [LINE_HEIGHT]: lineHeight,
              [LETTER_SPACING]: letterSpacing,
              [FONT_SIZE]: fontSize,
              [FONT_WEIGHT]: fontWeight,
              [FONT_FAMILY]: fontFamily,
            } = parent.computedStyle;
            if(renderMode === CANVAS || renderMode === WEBGL) {
              ctx.font = css.setFontStyle(parent.computedStyle, 0);
            }
            // 再进行查找，这里也会有至少一个字符不用担心
            let { hypotheticalNum: num, rw } = measureLineWidth(ctx, renderMode, 0, length, content, limit + width - endSpace, ew, perW,
              computedStyle, fontFamily, fontSize, fontWeight, 0, letterSpacing);
            // 可能发生x回退，当tb的内容产生减少时
            if(num !== content.length) {
              tb.__content = content.slice(0, num);
              if(isUpright) {
                y -= height - rw;
                tb.__height = rw;
              }
              else {
                x -= width - rw;
                tb.__width = rw;
              }
            }
            // 重新设置lineHeight和baseline，因为可能删除了东西
            lineBox.__resetLb(computedStyle[LINE_HEIGHT],
              isUpright ? css.getVerticalBaseline(computedStyle) : css.getBaseline(computedStyle));
            let ep = isUpright
              ? new Ellipsis(x, y + rw + endSpace, ew, bp, this, isUpright)
              : new Ellipsis(x + rw + endSpace, y, ew, bp, this, isUpright);
            lineBoxManager.addItem(ep, true);
            if(isUpright) {
              x += Math.max(lineHeight, lineBoxManager.verticalLineHeight);
            }
            else {
              y += Math.max(lineHeight, lineBoxManager.lineHeight);
            }
            maxW = Math.max(maxW, rw + ew);
            return [y, maxW];
          }
          // 舍弃这个tb，x也要向前回退，w增加，这会发生在ELLIPSIS字体很大，里面内容字体很小时
          let item = list.pop();
          if(isUpright) {
            limit += height;
            y -= height;
          }
          else {
            limit += width;
            x -= width;
          }
          let tbs = item.parent.textBoxes;
          let k = tbs.indexOf(item);
          if(k > -1) {
            tbs.splice(k, 1);
          }
          // 还得去掉dom，防止inline嵌套一直向上，同时得判断不能误删前面一个的dom
          let dom = item.parent.parent;
          let prev = list[list.length - 1];
          if(prev instanceof TextBox) {
            prev = prev.parent.parent;
          }
          while(dom !== bp && dom !== prev) {
            let contentBoxList = dom.contentBoxList || [];
            let i = contentBoxList.indexOf(item);
            if(i > -1) {
              contentBoxList.splice(i, 1);
            }
            let computedStyle = dom.computedStyle;
            if(isUpright) {
              let mbp = computedStyle[MARGIN_TOP] + computedStyle[MARGIN_BOTTOM]
                + computedStyle[PADDING_TOP] + computedStyle[PADDING_BOTTOM]
                + computedStyle[BORDER_TOP_WIDTH] + computedStyle[BORDER_BOTTOM_WIDTH];
              y -= mbp;
              limit += mbp;
            }
            else {
              let mbp = computedStyle[MARGIN_LEFT] + computedStyle[MARGIN_RIGHT]
                + computedStyle[PADDING_LEFT] + computedStyle[PADDING_RIGHT]
                + computedStyle[BORDER_LEFT_WIDTH] + computedStyle[BORDER_RIGHT_WIDTH];
              x -= mbp;
              limit += mbp;
            }
            dom.__layoutNone();
            dom = dom.domParent;
          }
          let contentBoxList = prev.contentBoxList || [];
          let i = contentBoxList.indexOf(item);
          if(i > -1) {
            contentBoxList.splice(i, 1);
          }
        }
      }
    }
    // 本次回退不用向前追溯删除textBox会进这里，最少一个字符兜底
    let textBox = new TextBox(this, textBoxes.length, x, y, rw, lineHeight, content.slice(i, i + num), isUpright);
    textBoxes.push(textBox);
    lineBoxManager.addItem(textBox, false);
    // ELLIPSIS也作为内容加入，但特殊的是指向最近block使用其样式渲染
    if(newLine) {
      let ep = isUpright
        ? new Ellipsis(x, y + rw + endSpace, ew, bp, this, isUpright)
        : new Ellipsis(x + rw + endSpace, y, ew, bp, this, isUpright);
      lineBoxManager.addItem(ep, true);
    }
    if(isUpright) {
      x += Math.max(lineHeight, lineBoxManager.verticalLineHeight);
    }
    else {
      y += Math.max(lineHeight, lineBoxManager.lineHeight);
    }
    maxW = Math.max(maxW, rw + newLine ? ew : 0);
    return [isUpright ? x : y, maxW];
  }

  // 外部dom换行发现超行，且一定是ellipsis时，会进这里让上一行text回退，lineBox一定有值且最后一个一定是本text的最后的textBox
  __backtrack(bp, lineBoxManager, lineBox, textBox, limit, endSpace, ew, computedStyle, ctx, renderMode, isUpright) {
    let list = lineBox.list;
    for(let j = list.length - 1; j >= 0; j--) {
      let tb = list[j];
      // 可能是个inlineBlock，整个省略掉，除非是第一个不作ellipsis处理
      if(!(tb instanceof TextBox)) {
        if(!j) {
          break;
        }
        let item = list.pop();
        limit += isUpright ? item.outerHeight : item.outerWidth;
        item.__layoutNone();
        continue;
      }
      // 先判断整个tb都删除是否可以容纳下，同时注意第1个tb不能删除因此必进
      let { content, width, height, parent } = tb;
      if(!j || limit >= width + ew + (1e-10) + endSpace) {
        let length = content.length;
        let {
          [LETTER_SPACING]: letterSpacing,
          [FONT_SIZE]: fontSize,
          [FONT_WEIGHT]: fontWeight,
          [FONT_FAMILY]: fontFamily,
        } = parent.computedStyle;
        if(renderMode === CANVAS || renderMode === WEBGL) {
          ctx.font = css.setFontStyle(parent.computedStyle, 0);
        }
        let perW = (fontSize * 0.8) + letterSpacing;
        // 再进行查找，这里也会有至少一个字符不用担心
        let { hypotheticalNum: num, rw } = measureLineWidth(ctx, renderMode, 0, length, content, limit - endSpace + width, ew, perW,
          computedStyle, fontFamily, fontSize, fontWeight, 0, letterSpacing);
        // 可能发生x回退，当tb的内容产生减少时
        if(num !== content.length) {
          tb.__content = content.slice(0, num);
          if(isUpright) {
            tb.__height = rw;
          }
          else {
            tb.__width = rw;
          }
        }
        // 重新设置lineHeight和baseline，因为可能删除了东西
        lineBox.__resetLb(computedStyle[LINE_HEIGHT],
          isUpright ? css.getVerticalBaseline(computedStyle) : css.getBaseline(computedStyle));
        let ep = isUpright
          ? new Ellipsis(tb.x, tb.y + rw + endSpace, ew, bp, this, isUpright)
          : new Ellipsis(tb.x + rw + endSpace, tb.y, ew, bp, this, isUpright);
        lineBoxManager.addItem(ep, true);
        return;
      }
      // 舍弃这个tb，x也要向前回退，w增加，这会发生在ELLIPSIS字体很大，里面内容字体很小时
      let item = list.pop();
      limit += isUpright ? height : width;
      let tbs = item.parent.textBoxes;
      let k = tbs.indexOf(item);
      if(k > -1) {
        tbs.splice(k, 1);
      }
      // 还得去掉dom，防止inline嵌套一直向上，同时得判断不能误删前面一个的dom
      let dom = item.parent.parent;
      let prev = list[list.length - 1];
      if(prev instanceof TextBox) {
        prev = prev.parent.parent;
      }
      while(dom !== bp && dom !== prev) {
        let contentBoxList = dom.contentBoxList || [];
        let i = contentBoxList.indexOf(item);
        if(i > -1) {
          contentBoxList.splice(i, 1);
        }
        let computedStyle = dom.computedStyle;
        if(isUpright) {
          let mbp = computedStyle[MARGIN_TOP] + computedStyle[MARGIN_BOTTOM]
            + computedStyle[PADDING_TOP] + computedStyle[PADDING_BOTTOM]
            + computedStyle[BORDER_TOP_WIDTH] + computedStyle[BORDER_BOTTOM_WIDTH];
          limit += mbp;
        }
        else {
          let mbp = computedStyle[MARGIN_LEFT] + computedStyle[MARGIN_RIGHT]
            + computedStyle[PADDING_LEFT] + computedStyle[PADDING_RIGHT]
            + computedStyle[BORDER_LEFT_WIDTH] + computedStyle[BORDER_RIGHT_WIDTH];
          limit += mbp;
        }
        dom.__layoutNone();
        dom = dom.domParent;
      }
      let contentBoxList = prev.contentBoxList || [];
      let i = contentBoxList.indexOf(item);
      if(i > -1) {
        contentBoxList.splice(i, 1);
      }
    }
  }

  __offsetX(diff, isLayout) {
    super.__offsetX(diff, isLayout);
    if(isLayout) {
      this.textBoxes.forEach(item => {
        item.__offsetX(diff);
      });
    }
    this.__x1 += diff;
  }

  __offsetY(diff, isLayout) {
    super.__offsetY(diff, isLayout);
    if(isLayout) {
      this.textBoxes.forEach(item => {
        item.__offsetY(diff);
      });
    }
    this.__y1 += diff;
  }

  __tryLayInline(total) {
    return total - this.firstCharWidth;
  }

  __inlineSize(isUpright) {
    let min, max;
    this.textBoxes.forEach((item, i) => {
      if(i) {
        min = Math.min(min, isUpright ? item.y : item.x);
        max = Math.max(max, (isUpright ? item.y : item.x) + item.width);
      }
      else {
        min = isUpright ? item.y : item.x;
        max = (isUpright ? item.y : item.x) + item.width;
      }
    });
    if(isUpright) {
      this.__y = this.__y1 = min;
      this.__x = this.__x1;
      this.__height = max - min;
    }
    else {
      this.__x = this.__x1 = min;
      this.__y = this.__y1;
      this.__width = max - min;
    }
  }

  render(renderMode, ctx, dx = 0, dy = 0) {
    let { __isDestroyed, computedStyle, textBoxes, cacheStyle } = this;
    if(renderMode === SVG) {
      this.__virtualDom = {
        type: 'text',
        children: [],
      };
    }
    // >=REPAINT清空bbox
    this.__bbox = null;
    this.__filterBbox = null;
    if(__isDestroyed || computedStyle[DISPLAY] === 'none' || computedStyle[VISIBILITY] === 'hidden'
      || !textBoxes.length) {
      this.__hasContent = false;
      return;
    }
    this.__hasContent = true;
    if(renderMode === WEBGL) {
      return;
    }
    if(renderMode === CANVAS) {
      let font = css.setFontStyle(computedStyle, this.__fitFontSize);
      if(ctx.font !== font) {
        ctx.font = font;
      }
      let color = cacheStyle[COLOR];
      // 渐变
      if(color.k) {
        let dom = this.parent;
        color = dom.__gradient(renderMode, ctx, dom.__bx1, dom.__by1, dom.__bx2, dom.__by2, color, dx, dy).v;
      }
      if(ctx.fillStyle !== color) {
        ctx.fillStyle = color;
      }
      let strokeWidth = computedStyle[TEXT_STROKE_WIDTH];
      if(ctx.lineWidth !== strokeWidth) {
        ctx.lineWidth = strokeWidth;
      }
      let textStrokeColor = cacheStyle[TEXT_STROKE_COLOR];
      // 渐变
      if(textStrokeColor.k) {
        let dom = this.parent;
        textStrokeColor = dom.__gradient(renderMode, ctx, dom.__bx1, dom.__by1, dom.__bx2, dom.__by2, textStrokeColor, dx, dy).v;
      }
      if(ctx.strokeStyle !== textStrokeColor) {
        ctx.strokeStyle = textStrokeColor;
      }
    }
    // 可能为空，整个是个ellipsis
    textBoxes.forEach(item => {
      item.render(renderMode, ctx, computedStyle, cacheStyle, dx, dy);
    });
    if(renderMode === SVG) {
      this.__virtualDom.children = textBoxes.map(textBox => textBox.virtualDom);
    }
  }

  __destroy() {
    if(this.__isDestroyed) {
      return;
    }
    super.__destroy();
    let __cache = this.__cache;
    if(__cache) {
      __cache.release();
    }
  }

  getComputedStyle(key) {
    return this.__domParent.getComputedStyle(key);
  }

  updateContent(s, cb) {
    if(s === this.__content || this.__isDestroyed) {
      this.__content = s;
      if(isFunction(cb)) {
        cb(false);
      }
      return;
    }
    this.__widthHash = {};
    if(util.isNil(s)){
      s = '';
    }
    else {
      s = s.toString();
    }
    this.__content = s;
    this.__root.__addUpdate(this.__domParent, null, level.REFLOW, false, false, false, false, cb);
  }

  remove(cb) {
    let { __root: root } = this;
    let parent = this.isShadowRoot ? this.hostRoot.__parent: this.__parent;
    let i;
    if(parent) {
      let target = this.isShadowRoot ? this.hostRoot : this;
      i = parent.__children.indexOf(target);
      parent.__children.splice(i, 1);
      i = parent.__zIndexChildren.indexOf(target);
      parent.__zIndexChildren.splice(i, 1);
      let { __prev, __next } = this;
      if(__prev) {
        __prev.__next = __next;
      }
      if(__next) {
        __next.__prev = __prev;
      }
    }
    if(this.__isDestroyed) {
      if(isFunction(cb)) {
        cb(false);
      }
      return;
    }
    parent.__deleteStruct(this, i);
    // 不可见仅改变数据结构
    if(this.computedStyle[DISPLAY] === 'none') {
      this.__destroy();
      if(isFunction(cb)) {
        cb(false);
      }
      return;
    }
    // 可见在reflow逻辑做结构关系等，text视为父变更
    root.__addUpdate(this, null, level.REFLOW, false, true, false, false, cb);
  }

  __structure(lv, j) {
    let o = super.__structure(lv, j);
    o.isText = true;
    return o;
  }

  get content() {
    return this.__content;
  }

  set content(v) {
    this.updateContent(v, null);
  }

  get textBoxes() {
    return this.__textBoxes;
  }

  get charWidth() {
    let { __widthHash, content, computedStyle, root: { ctx, renderMode } } = this;
    let {
      [FONT_FAMILY]: fontFamily,
      [FONT_SIZE]: fontSize,
      [FONT_WEIGHT]: fontWeight,
      [LETTER_SPACING]: letterSpacing,
    } = computedStyle;
    let fontKey = getFontKey(fontFamily, fontSize, fontWeight, letterSpacing);
    if(!__widthHash.hasOwnProperty(fontKey)) {
      __widthHash[fontKey] = {};
    }
    let o = __widthHash[fontKey];
    if(!o.hasOwnProperty('charWidth')) {
      let max = 0;
      if(renderMode === CANVAS || renderMode === WEBGL) {
        if(renderMode === WEBGL) {
          ctx = inject.getFontCanvas().ctx;
        }
        ctx.font = css.setFontStyle(computedStyle, 0);
        for(let i = 0, len = content.length; i < len; i++) {
          max = Math.max(max, ctx.measureText(content.charAt([i])).width);
        }
      }
      else if(renderMode === SVG) {
        max = inject.measureTextListMax(content, fontFamily, fontSize, fontWeight);
      }
      o.charWidth = max + letterSpacing;
    }
    return o.charWidth;
  }

  get firstCharWidth() {
    let { __widthHash, content, computedStyle, root: { ctx, renderMode } } = this;
    let {
      [FONT_FAMILY]: fontFamily,
      [FONT_SIZE]: fontSize,
      [FONT_WEIGHT]: fontWeight,
      [LETTER_SPACING]: letterSpacing,
    } = computedStyle;
    let fontKey = getFontKey(fontFamily, fontSize, fontWeight, letterSpacing);
    if(!__widthHash.hasOwnProperty(fontKey)) {
      __widthHash[fontKey] = {};
    }
    let o = __widthHash[fontKey];
    if(!o.hasOwnProperty('firstCharWidth')) {
      if(renderMode === CANVAS || renderMode === WEBGL) {
        if(renderMode === WEBGL) {
          ctx = inject.getFontCanvas().ctx;
        }
        ctx.font = css.setFontStyle(computedStyle, 0);
        o.firstCharWidth = ctx.measureText(content.charAt(0)).width + letterSpacing;
      }
      else if(renderMode === SVG) {
        o.firstCharWidth = inject.measureTextSync(content.charAt(0), fontFamily, fontSize, fontWeight) + letterSpacing;
      }
    }
    return o.firstCharWidth;
  }

  get textWidth() {
    let { __widthHash, content, computedStyle, root: { ctx, renderMode } } = this;
    let {
      [FONT_FAMILY]: fontFamily,
      [FONT_SIZE]: fontSize,
      [FONT_WEIGHT]: fontWeight,
      [LETTER_SPACING]: letterSpacing,
    } = computedStyle;
    let fontKey = getFontKey(fontFamily, fontSize, fontWeight, letterSpacing);
    if(!__widthHash.hasOwnProperty(fontKey)) {
      __widthHash[fontKey] = {};
    }
    let o = __widthHash[fontKey];
    if(!o.hasOwnProperty('textWidth')) {
      if(renderMode === CANVAS || renderMode === WEBGL) {
        if(renderMode === WEBGL) {
          ctx = inject.getFontCanvas().ctx;
        }
        ctx.font = css.setFontStyle(computedStyle, 0);
        o.textWidth = ctx.measureText(content).width + letterSpacing * content.length;
      }
      else if(renderMode === SVG) {
        o.textWidth = inject.measureTextSync(content, fontFamily, fontSize, fontWeight) + letterSpacing * content.length;
      }
    }
    return o.textWidth;
  }

  get clientWidth() {
    return this.__width || 0;
  }

  get clientHeight() {
    return this.__height || 0;
  }

  get offsetWidth() {
    return this.__width || 0;
  }

  get offsetHeight() {
    return this.__height || 0;
  }

  get outerWidth() {
    return this.__width || 0;
  }

  get outerHeight() {
    return this.__height || 0;
  }

  get root() {
    return this.__domParent.__root;
  }

  get currentStyle() {
    return this.__domParent.__currentStyle;
  }

  get __currentStyle() {
    return this.__domParent.__currentStyle;
  }

  get style() {
    return this.__domParent.__style;
  }

  get computedStyle() {
    return this.__domParent.__computedStyle;
  }

  get __computedStyle() {
    return this.__domParent.__computedStyle;
  }

  get cacheStyle() {
    return this.__domParent.__cacheStyle;
  }

  get __cacheStyle() {
    return this.__domParent.__cacheStyle;
  }

  get bbox() {
    if(!this.__bbox) {
      let {
        __x1, __y1, width, height,
        computedStyle: {
          [TEXT_STROKE_WIDTH]: textStrokeWidth,
        },
      } = this;
      // 文字描边暂时不清楚最大值是多少，影响不确定，先按描边宽算，因为会出现>>0.5宽的情况
      let half = textStrokeWidth;
      this.__bbox = [__x1 - half, __y1 - half, __x1 + width + half, __y1 + height + half];
    }
    return this.__bbox;
  }

  get filterBbox() {
    if(!this.__filterBbox) {
      let bbox = this.__bbox || this.bbox;
      let filter = this.computedStyle[FILTER];
      this.__filterBbox = css.spreadFilter(bbox, filter);
    }
    return this.__filterBbox;
  }

  get isShadowRoot() {
    return !this.__parent && this.__host && this.__host !== this.root;
  }

  get matrix() {
    return this.__domParent.__matrix;
  }

  get matrixEvent() {
    return this.__domParent.__matrixEvent;
  }

  get perspectiveMatrix() {
    return this.__domParent.__perspectiveMatrix;
  }

  get fitFontSize() {
    return this.__fitFontSize;
  }
}

export default Text;
