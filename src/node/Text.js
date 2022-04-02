import Node from './Node';
import TextBox from './TextBox';
import Ellipsis from './Ellipsis';
import mode from '../refresh/mode';
import css from '../style/css';
import unit from '../style/unit';
import enums from '../util/enums';
import util from '../util/util';
import inject from '../util/inject';
import Cache from '../refresh/Cache';
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
    TEXT_STROKE_COLOR,
    TEXT_STROKE_WIDTH,
    MARGIN_LEFT,
    MARGIN_RIGHT,
    PADDING_LEFT,
    PADDING_RIGHT,
    BORDER_LEFT_WIDTH,
    BORDER_RIGHT_WIDTH,
    FILTER,
  },
  NODE_KEY: {
    NODE_CACHE,
    NODE_LIMIT_CACHE,
    NODE_DOM_PARENT,
    NODE_MATRIX_EVENT,
    NODE_OPACITY,
    NODE_VIRTUAL_DOM,
  },
  UPDATE_KEY: {
    UPDATE_NODE,
    UPDATE_FOCUS,
    UPDATE_CONFIG,
  },
  ELLIPSIS,
} = enums;

const { AUTO } = unit;
const { CANVAS, SVG, WEBGL } = mode;

/**
 * 在给定宽度w的情况下，测量文字content多少个满足塞下，只支持水平书写，从start的索引开始，content长length
 * 尽可能地少的次数调用canvas的measureText或svg的html节点的width，因为比较消耗性能
 * 这就需要一种算法，不能逐字遍历看总长度是否超过，也不能单字宽度相加因为有文本整形某些字体多个字宽度不等于每个之和
 * 简单的2分法实现简单，但是次数稍多，对于性能不是最佳，因为内容的slice裁剪和传递给canvas测量都随尺寸增加而加大
 * 由于知道w和fontSize，因此能推测出平均值为fontSize/w，即字的个数，
 * 进行测量后得出w2，和真实w对比，产生误差d，再看d和fontSize推测差距个数，如此反复
 * 返回内容和end索引和长度，最少也要1个字符
 * @param ctx
 * @param renderMode
 * @param start
 * @param length
 * @param content
 * @param w
 * @param perW
 * @param fontFamily
 * @param fontSize
 * @param fontWeight
 * @param letterSpacing
 */
function measureLineWidth(ctx, renderMode, start, length, content, w, perW, fontFamily, fontSize, fontWeight, letterSpacing) {
  if(start >= length) {
    // 特殊情况不应该走进这里
    return [0, 0, false];
  }
  let i = start, j = length, rw = 0, newLine = false;
  // 特殊降级，有letterSpacing时，canvas无法完全兼容，只能采取单字测量的方式完成
  if(letterSpacing && [CANVAS, WEBGL].indexOf(renderMode) > -1) {
    let count = 0;
    for(; i < length; i++) {
      let mw = ctx.measureText(content.charAt(i)).width + letterSpacing;
      if(i > start && count + mw > w + (1e-10)) {
        newLine = true;
        break;
      }
      count += mw;
    }
    return [i - start, count, newLine || count > w + (1e-10)];
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
      mw = inject.measureTextSync(str, fontFamily, fontSize, fontWeight);
    }
    if(letterSpacing) {
      mw += hypotheticalNum * letterSpacing;
    }
    if(mw === w) {
      rw = w;
      newLine = true;
      break;
    }
    // 超出，设置右边界，并根据余量推测减少个数，精度问题，固定宽度或者累加的剩余空间，不用相等判断，而是为原本w宽度加一点点冗余1e-10
    if(mw > w + (1e-10)) {
      newLine = true;
      // 限制至少1个
      if(i === start) {
        rw = mw;
        break;
      }
      // 注意特殊判断i和j就差1个可直接得出结果，因为现在超了而-1不超肯定是-1的结果
      if(i === j - 1 || i - start === hypotheticalNum - 1) {
        hypotheticalNum = i - start;
        break;
      }
      j = hypotheticalNum - 1;
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
  return [hypotheticalNum, rw, newLine];
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
    let __cache = this.__config[NODE_CACHE];
    if(__cache) {
      __cache.release();
    }
    let { x, y, w, lx = x, lineBoxManager, endSpace = 0, lineClamp = 0, lineClampCount = 0 } = data;
    this.__x = this.__sx = this.__sx1 = x;
    this.__y = this.__sy = this.__sy1 = y;
    let { isDestroyed, content, computedStyle, textBoxes, root } = this;
    textBoxes.splice(0);
    let __config = this.__config;
    __config[NODE_LIMIT_CACHE] = false;
    // 空内容w/h都为0可以提前跳出
    if(isDestroyed || computedStyle[DISPLAY] === 'none' || !content) {
      return lineClampCount;
    }
    this.__ox = this.__oy = 0;
    // 顺序尝试分割字符串为TextBox，形成多行，begin为每行起始索引，i是当前字符索引
    let i = 0;
    let beginSpace = x - lx; // x>=lx，当第一行非起始处时前面被prev节点占据，这个差值可认为是count宽度
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
    let bp = this.domParent;
    while(bp.computedStyle[DISPLAY] === 'inline') {
      bp = bp.domParent;
    }
    this.__bp = bp;
    let textOverflow = bp.computedStyle[TEXT_OVERFLOW];
    css.getFontFamily(fontFamily); // 有检测过程必须执行
    // 布局测量前置，根据renderMode不同提供不同的测量方法
    let renderMode = root.renderMode;
    let ctx;
    if(renderMode === CANVAS || renderMode === WEBGL) {
      ctx = renderMode === WEBGL
        ? inject.getFontCanvas().ctx
        : root.ctx;
      ctx.font = css.setFontStyle(computedStyle);
    }
    // fontSize在中文是正好1个字宽度，英文不一定，等宽为2个，不等宽可能1~2个，特殊字符甚至>2个，取预估均值然后倒数得每个均宽0.8
    let perW = (fontSize * 0.8) + letterSpacing;
    let lineCount = 0;
    // 不换行特殊对待，同时考虑overflow和textOverflow
    if(whiteSpace === 'nowrap') {
      let isTextOverflow, textWidth = this.textWidth;
      let {
        [POSITION]: position,
        [OVERFLOW]: overflow,
      } = bp.computedStyle;
      let widthC = bp.currentStyle[WIDTH];
      // 只要是overflow隐藏，不管textOverflow如何（默认是clip等同于overflow:hidden的功能）都截取
      if(overflow === 'hidden') {
        // abs自适应宽度时不裁剪
        if(position === 'absolute' && widthC[1] === AUTO) {
          isTextOverflow = false;
        }
        else {
          isTextOverflow = textWidth > w + (1e-10) - beginSpace - endSpace;
        }
      }
      // ellipsis生效情况，本节点开始向前回退查找，尝试放下一部分字符
      if(isTextOverflow && textOverflow === 'ellipsis') {
        [y] = this.__lineBack(ctx, renderMode, i, length, content, w - endSpace - beginSpace, perW, x, y, maxW,
          endSpace, lineHeight, textBoxes, lineBoxManager, fontFamily, fontSize, fontWeight, letterSpacing);
        lineCount++;
      }
      // 默认是否clip跟随overflow:hidden，无需感知，裁剪由dom做，这里不裁剪
      else {
        let textBox = new TextBox(this, textBoxes.length, x, y, textWidth, lineHeight,
          content);
        textBoxes.push(textBox);
        lineBoxManager.addItem(textBox, false);
        y += lineHeight;
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
        let wl = i ? w : (w - beginSpace);
        if(lineClamp && lineCount + lineClampCount >= lineClamp - 1) {
          wl -= endSpace;
        }
        let [num, rw, newLine] = measureLineWidth(ctx, renderMode, i, length, content, wl, perW, fontFamily, fontSize, fontWeight, letterSpacing);
        // 多行文本截断，这里肯定需要回退，注意防止恰好是最后一个字符，此时无需截取
        if(lineClamp && newLine && lineCount + lineClampCount >= lineClamp - 1) {
          [y, maxW] = this.__lineBack(ctx, renderMode, i, i + num, content, wl - endSpace, perW, lineCount ? lx : x, y, maxW,
            endSpace, lineHeight, textBoxes, lineBoxManager, fontFamily, fontSize, fontWeight, letterSpacing);
          lineCount++;
          break;
        }
        // 最后一行考虑endSpace，可能不够需要回退，但不能是1个字符
        if(i + num === length && endSpace && rw + endSpace > wl + (1e-10) && num > 1) {
          [num, rw, newLine] = measureLineWidth(ctx, renderMode, i, length, content, wl - endSpace, perW, fontFamily, fontSize, fontWeight, letterSpacing);
          // 可能加上endSpace后超过了，还得再判断一次
          if(lineClamp && newLine && lineCount + lineClampCount >= lineClamp - 1) {
            [y, maxW] = this.__lineBack(ctx, renderMode, i, i + num, content, wl - endSpace, perW, lineCount ? lx : x, y, maxW,
              endSpace, lineHeight, textBoxes, lineBoxManager, fontFamily, fontSize, fontWeight, letterSpacing);
            lineCount++;
            break;
          }
        }
        maxW = Math.max(maxW, rw);
        // 根据是否第一行分开处理行首空白
        let textBox = new TextBox(this, textBoxes.length, lineCount ? lx : x, y, rw, lineHeight, content.slice(i, i + num));
        textBoxes.push(textBox);
        lineBoxManager.addItem(textBox, newLine);
        y += Math.max(lineHeight, lineBoxManager.lineHeight);
        // 至少也要1个字符形成1行，哪怕是首行，因为是否放得下逻辑在dom中做过了
        i += num;
        if(newLine) {
          lineCount++;
        }
      }
      // 换行后Text的x重设为lx
      if(lineCount) {
        this.__x = this.__sx1 = lx;
      }
    }
    this.__width = maxW;
    this.__height = y - data.y;
    this.__baseline = css.getBaseline(computedStyle);
    return lineClampCount + lineCount;
  }

  __layoutNone() {
    this.__width = this.__height = this.__baseline = 0;
    this.__textBoxes.splice(0);
  }

  // 末尾行因ellipsis的缘故向前回退字符生成textBox，可能会因不满足宽度导致无法生成，此时向前继续回退TextBox
  __lineBack(ctx, renderMode, i, length, content, wl, perW, x, y, maxW, endSpace, lineHeight, textBoxes, lineBoxManager,
              fontFamily, fontSize, fontWeight, letterSpacing) {
    let ew, bp = this.__bp, computedStyle = bp.computedStyle;
    // 临时测量ELLIPSIS的尺寸
    if(renderMode === CANVAS || renderMode === WEBGL) {
      let font = css.setFontStyle(computedStyle);
      if(ctx.font !== font) {
        ctx.font = font;
      }
      ew = ctx.measureText(ELLIPSIS).width;
    }
    else {
      ew = inject.measureTextSync(ELLIPSIS, computedStyle[FONT_FAMILY], computedStyle[FONT_SIZE], computedStyle[FONT_WEIGHT]);
    }
    if(renderMode === CANVAS || renderMode === WEBGL) {
      let font = css.setFontStyle(this.computedStyle);
      if (ctx.font !== font) {
        ctx.font = font;
      }
    }
    let [num, rw] = measureLineWidth(ctx, renderMode, i, length, content, wl - ew - endSpace, perW, fontFamily, fontSize, fontWeight, letterSpacing);
    // 还是不够，需要回溯查找前一个inline节点继续回退，同时防止空行首，要至少一个textBox且一个字符
    if(rw + ew > wl + (1e-10) - endSpace) {
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
            x -= item.outerWidth;
            wl += item.outerWidth;
            item.__layoutNone();
            continue;
          }
          // 先判断整个tb都删除是否可以容纳下，同时注意第1个tb不能删除因此必进
          let { content, width, parent } = tb;
          if(!j || wl >= width + ew + (1e-10) + endSpace) {
            let length = content.length;
            let {
              [LINE_HEIGHT]: lineHeight,
              [LETTER_SPACING]: letterSpacing,
              [FONT_SIZE]: fontSize,
              [FONT_WEIGHT]: fontWeight,
              [FONT_FAMILY]: fontFamily,
            } = parent.computedStyle;
            if(renderMode === CANVAS || renderMode === WEBGL) {
              ctx.font = css.setFontStyle(parent.computedStyle);
            }
            // 再进行查找，这里也会有至少一个字符不用担心
            let [num, rw] = measureLineWidth(ctx, renderMode, 0, length, content, wl - ew + width - endSpace, perW, fontFamily, fontSize, fontWeight, letterSpacing);
            // 可能发生x回退，当tb的内容产生减少时
            if(num !== content.length) {
              tb.__content = content.slice(0, num);
              x -= width - rw;
              tb.__width = rw;
            }
            // 重新设置lineHeight和baseline，因为可能删除了东西
            lineBox.__resetLb(computedStyle[LINE_HEIGHT], css.getBaseline(computedStyle));
            let ep = new Ellipsis(x + endSpace, y, ew, bp);
            lineBoxManager.addItem(ep, true);
            y += Math.max(lineHeight, lineBoxManager.lineHeight);
            maxW = Math.max(maxW, rw + ew);
            return [y, maxW];
          }
          // 舍弃这个tb，x也要向前回退，w增加，这会发生在ELLIPSIS字体很大，里面内容字体很小时
          let item = list.pop();
          wl += width;
          x -= width;
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
            let mbp = computedStyle[MARGIN_LEFT] + computedStyle[MARGIN_RIGHT]
              + computedStyle[PADDING_LEFT] + computedStyle[PADDING_RIGHT]
              + computedStyle[BORDER_LEFT_WIDTH] + computedStyle[BORDER_RIGHT_WIDTH];
            x -= mbp;
            wl += mbp;
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
    let textBox = new TextBox(this, textBoxes.length, x, y, rw, lineHeight, content.slice(i, i + num));
    textBoxes.push(textBox);
    lineBoxManager.addItem(textBox, false);
    // ELLIPSIS也作为内容加入，但特殊的是指向最近block使用其样式渲染
    let ep = new Ellipsis(x + rw + endSpace, y, ew, bp);
    lineBoxManager.addItem(ep, true);
    y += Math.max(lineHeight, lineBoxManager.lineHeight);
    maxW = Math.max(maxW, rw + ew);
    return [y, maxW];
  }

  // 外部dom换行发现超行，且一定是ellipsis时，会进这里让上一行text回退，lineBox一定有值且最后一个一定是本text的最后的textBox
  __backtrack(bp, lineBoxManager, lineBox, textBox, wl, endSpace, ew, computedStyle, ctx, renderMode) {
    let list = lineBox.list;
    for(let j = list.length - 1; j >= 0; j--) {
      let tb = list[j];
      // 可能是个inlineBlock，整个省略掉，除非是第一个不作ellipsis处理
      if(!(tb instanceof TextBox)) {
        if(!j) {
          break;
        }
        let item = list.pop();
        wl += item.outerWidth;
        item.__layoutNone();
        continue;
      }
      // 先判断整个tb都删除是否可以容纳下，同时注意第1个tb不能删除因此必进
      let { content, width, parent } = tb;
      if(!j || wl >= width + ew + (1e-10) + endSpace) {
        let length = content.length;
        let {
          [LETTER_SPACING]: letterSpacing,
          [FONT_SIZE]: fontSize,
          [FONT_WEIGHT]: fontWeight,
          [FONT_FAMILY]: fontFamily,
        } = parent.computedStyle;
        if(renderMode === CANVAS || renderMode === WEBGL) {
          ctx.font = css.setFontStyle(parent.computedStyle);
        }
        let perW = (fontSize * 0.8) + letterSpacing;
        // 再进行查找，这里也会有至少一个字符不用担心
        let [num, rw] = measureLineWidth(ctx, renderMode, 0, length, content, wl - ew - endSpace + width, perW, fontFamily, fontSize, fontWeight, letterSpacing);
        // 可能发生x回退，当tb的内容产生减少时
        if(num !== content.length) {
          tb.__content = content.slice(0, num);
          tb.__width = rw;
        }
        // 重新设置lineHeight和baseline，因为可能删除了东西
        lineBox.__resetLb(computedStyle[LINE_HEIGHT], css.getBaseline(computedStyle));
        let ep = new Ellipsis(tb.x + rw + endSpace, tb.y, ew, bp);
        lineBoxManager.addItem(ep, true);
        return;
      }
      // 舍弃这个tb，x也要向前回退，w增加，这会发生在ELLIPSIS字体很大，里面内容字体很小时
      let item = list.pop();
      wl += width;
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
        let mbp = computedStyle[MARGIN_LEFT] + computedStyle[MARGIN_RIGHT]
          + computedStyle[PADDING_LEFT] + computedStyle[PADDING_RIGHT]
          + computedStyle[BORDER_LEFT_WIDTH] + computedStyle[BORDER_RIGHT_WIDTH];
        wl += mbp;
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
    return w - this.firstCharWidth;
  }

  __inlineSize() {
    let minX, maxX;
    this.textBoxes.forEach((item, i) => {
      if(i) {
        minX = Math.min(minX, item.x);
        maxX = Math.max(maxX, item.x + item.width);
      }
      else {
        minX = item.x;
        maxX = item.x + item.width;
      }
    });
    this.__x = minX;
    this.__sx = this.__sx1 = minX + this.ox;
    this.__sy = this.__sy1;
    this.__width = maxX - minX;
  }

  render(renderMode, lv, ctx, cache, dx = 0, dy = 0) {
    let { isDestroyed, computedStyle, textBoxes, cacheStyle, __config } = this;
    if(renderMode === SVG) {
      __config[NODE_VIRTUAL_DOM] = this.__virtualDom = {
        type: 'text',
        children: [],
      };
    }
    // >=REPAINT清空bbox
    if(lv >= level.REPAINT) {
      this.__bbox = null;
      this.__filterBbox = null;
    }
    if(isDestroyed || computedStyle[DISPLAY] === 'none' || computedStyle[VISIBILITY] === 'hidden'
      || !textBoxes.length) {
      return;
    }
    if(renderMode === CANVAS || renderMode === WEBGL) {
      // webgl借用离屏canvas绘制文本，cache标识为true是普通绘制，否则是超限降级情况
      if(renderMode === WEBGL) {
        if(cache) {
          let { sx, sy, bbox } = this;
          let __cache = __config[NODE_CACHE];
          if(__cache) {
            __cache.reset(bbox, sx, sy);
          }
          else {
            __cache = Cache.getInstance(bbox, sx, sy);
          }
          if(__cache && __cache.enabled) {
            __config[NODE_CACHE] = __cache;
            __cache.__available = true;
            ctx = __cache.ctx;
            dx += __cache.dx;
            dy += __cache.dy;
            __config[NODE_LIMIT_CACHE] = false;
          }
          else {
            __config[NODE_LIMIT_CACHE] = true;
            return;
          }
        }
        else {
          let root = this.root;
          let c = inject.getCacheCanvas(root.width, root.height, '__$$OVERSIZE$$__');
          ctx = c.ctx;
          let {
            [NODE_DOM_PARENT]: {
              __config: {
                [NODE_MATRIX_EVENT]: m,
                [NODE_OPACITY]: opacity,
              },
            },
          } = __config;
          ctx.setTransform(m[0], m[1], m[4], m[5], m[12], m[13]);
          ctx.globalAlpha = opacity;
        }
      }
      let font = css.setFontStyle(computedStyle);
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
      this.virtualDom.children = textBoxes.map(textBox => textBox.virtualDom);
    }
  }

  __deepScan(cb) {
    cb(this);
  }

  __destroy() {
    if(this.isDestroyed) {
      return;
    }
    super.__destroy();
    let __cache = this.__config[NODE_CACHE];
    if(__cache) {
      __cache.release();
    }
  }

  getComputedStyle(key) {
    return this.domParent.getComputedStyle(key);
  }

  updateContent(s, cb) {
    let self = this;
    if(s === self.__content) {
      if(util.isFunction(cb)) {
        cb(-1);
      }
      return;
    }
    root.delRefreshTask(self.__task);
    root.addRefreshTask(self.__task = {
      __before() {
        self.__content = s;
        let res = {};
        let vd = self.domParent;
        res[UPDATE_NODE] = vd;
        res[UPDATE_FOCUS] = level.REFLOW;
        res[UPDATE_CONFIG] = vd.__config;
        let root = vd.root;
        root.__addUpdate(vd, vd.__config, root, root.__config, res);
      },
      __after(diff) {
        if(util.isFunction(cb)) {
          cb(diff);
        }
      },
    });
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
        ctx.font = css.setFontStyle(computedStyle);
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
        ctx.font = css.setFontStyle(computedStyle);
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
        ctx.font = css.setFontStyle(computedStyle);
        o.textWidth = ctx.measureText(content).width + letterSpacing * content.length;
      }
      else if(renderMode === SVG) {
        o.textWidth = inject.measureTextSync(content, fontFamily, fontSize, fontWeight) + letterSpacing * content.length;
      }
    }
    return o.textWidth;
  }

  get baseline() {
    return this.__baseline;
  }

  get root() {
    return this.domParent.root;
  }

  get currentStyle() {
    return this.domParent.currentStyle;
  }

  get style() {
    return this.__style;
  }

  get computedStyle() {
    return this.domParent.computedStyle;
  }

  get cacheStyle() {
    return this.domParent.__cacheStyle;
  }

  get bbox() {
    let { __sx1: sx, __sy1: sy, width, height,
      computedStyle: {
        [TEXT_STROKE_WIDTH]: textStrokeWidth,
      },
    } = this;
    // TODO: 文字描边暂时不清楚最大值是多少，影响不确定，先按描边宽算，因为会出现>>0.5宽的情况
    let half = textStrokeWidth;
    return [sx - half, sy - half, sx + width + half, sy + height + half];
  }

  get filterBbox() {
    if(!this.__filterBbox) {
      let bbox = this.bbox;
      let filter = this.computedStyle[FILTER];
      this.__filterBbox = css.spreadFilter(bbox, filter);
    }
    return this.__filterBbox;
  }

  get isShadowRoot() {
    return !this.parent && this.host && this.host !== this.root;
  }

  get matrix() {
    return this.domParent.matrix;
  }

  get matrixEvent() {
    return this.domParent.matrixEvent;
  }
}

Text.prototype.__renderByMask = Text.prototype.render;

export default Text;
