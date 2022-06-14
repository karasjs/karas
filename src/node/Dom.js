import Xom from './Xom';
import Text from './Text';
import LineBoxManager from './LineBoxManager';
import Component from './Component';
import tag from './tag';
import TextBox from './TextBox';
import Ellipsis from './Ellipsis';
import reset from '../style/reset';
import css from '../style/css';
import unit from '../style/unit';
import $$type from '../util/$$type';
import enums from '../util/enums';
import util from '../util/util';
import inject from '../util/inject';
import reflow from '../refresh/reflow';
import builder from '../util/builder';
import mode from '../refresh/mode';
import level from '../refresh/level';

const {
  STYLE_KEY: {
    POSITION,
    DISPLAY,
    MARGIN_LEFT,
    MARGIN_TOP,
    MARGIN_RIGHT,
    MARGIN_BOTTOM,
    PADDING_LEFT,
    PADDING_BOTTOM,
    PADDING_RIGHT,
    PADDING_TOP,
    BORDER_TOP_WIDTH,
    BORDER_BOTTOM_WIDTH,
    BORDER_RIGHT_WIDTH,
    BORDER_LEFT_WIDTH,
    TOP,
    RIGHT,
    BOTTOM,
    LEFT,
    WIDTH,
    HEIGHT,
    TEXT_ALIGN,
    FLEX_DIRECTION,
    FLEX_BASIS,
    FLEX_SHRINK,
    FLEX_GROW,
    ALIGN_SELF,
    ALIGN_ITEMS,
    JUSTIFY_CONTENT,
    Z_INDEX,
    WHITE_SPACE,
    LINE_HEIGHT,
    LINE_CLAMP,
    ORDER,
    FLEX_WRAP,
    ALIGN_CONTENT,
    OVERFLOW,
    FONT_SIZE,
    FONT_FAMILY,
    FONT_WEIGHT,
    WRITING_MODE,
  },
  NODE_KEY: {
    NODE_CURRENT_STYLE,
    NODE_STYLE,
    NODE_STRUCT,
    NODE_DOM_PARENT,
    NODE_IS_INLINE,
  },
  UPDATE_KEY: {
    UPDATE_NODE,
    UPDATE_FOCUS,
    UPDATE_ADD_DOM,
    UPDATE_CONFIG,
  },
  STRUCT_KEY: {
    STRUCT_NUM,
    STRUCT_LV,
    STRUCT_TOTAL,
    STRUCT_CHILD_INDEX,
    STRUCT_INDEX,
  },
  ELLIPSIS,
} = enums;
const { AUTO, PX, PERCENT, REM, VW, VH, VMAX, VMIN } = unit;
const { isRelativeOrAbsolute, getBaseline, getVerticalBaseline } = css;
const { extend, isNil, isFunction } = util;
const { CANVAS, SVG, WEBGL } = mode;

// 渲染获取zIndex顺序
function genZIndexChildren(dom) {
  let normal = [];
  let hasMc;
  let mcHash = {};
  let lastMaskIndex;
  let children = dom.children;
  children.forEach((item, i) => {
    let child = item;
    if(item instanceof Component) {
      item = item.shadowRoot;
    }
    // 遮罩单独保存后特殊排序
    if(item instanceof Xom && item.isMask) {
      // 开头的mc忽略，后续的连续mc以第一次出现为准
      if(lastMaskIndex !== undefined) {
        mcHash[lastMaskIndex].push(item);
      }
      else if(i) {
        lastMaskIndex = i - 1;
        children[lastMaskIndex].__iIndex = lastMaskIndex;
        mcHash[lastMaskIndex] = [item];
        hasMc = true;
      }
    }
    else {
      lastMaskIndex = undefined;
      if(item instanceof Xom) {
        child.__zIndex = item.currentStyle[Z_INDEX];
        if(isRelativeOrAbsolute(item)) {
          // 临时变量为排序使用
          child.__aIndex = true;
          normal.push(child);
        }
        else {
          normal.push(child);
        }
      }
      else {
        child.__zIndex = 0;
        normal.push(child);
      }
      child.__iIndex = i;
    }
  });
  normal.sort(function(a, b) {
    if(a.__zIndex !== b.__zIndex) {
      return a.__zIndex - b.__zIndex;
    }
    // zIndex相等时abs优先flow
    if(a.__aIndex !== b.__aIndex) {
      if(a.__aIndex) {
        return 1;
      }
      return -1;
    }
    // 都相等看索引
    return a.__iIndex - b.__iIndex;
  });
  // 将遮罩插入到对应顺序上
  if(hasMc) {
    for(let i = normal.length - 1; i >= 0; i--) {
      let idx = normal[i].__iIndex;
      if(mcHash.hasOwnProperty(idx)) {
        normal.splice(i + 1, 0, ...mcHash[idx]);
      }
    }
  }
  return normal;
}

// flex布局阶段顺序，不是渲染也和struct结构无关，可以无视mask
function genOrderChildren(flowChildren) {
  let normal = [];
  flowChildren.forEach((item, i) => {
    let child = item;
    if(item instanceof Component) {
      item = item.shadowRoot;
    }
    if(item instanceof Xom) {
      child.__order = item.currentStyle[ORDER];
    }
    else {
      child.__order = 0;
    }
    normal.push(child);
    child.__iIndex = i;
  });
  normal.sort(function(a, b) {
    if(a.__order !== b.__order) {
      return a.__order - b.__order;
    }
    // order相等时看节点索引
    return a.__iIndex - b.__iIndex;
  });
  return normal;
}

/**
 * lineClamp超出范围时ib作为最后一行最后一个无法挤下时进行回溯
 */
function backtrack(bp, lineBoxManager, lineBox, total, endSpace, isUpright) {
  let ew, computedStyle = bp.computedStyle, root = bp.root, renderMode = root.renderMode;
  let list = lineBox.list;
  // 根据textBox里的内容，确定当前内容，索引，x和剩余宽度
  list.forEach(item => {
    total -= isUpright ? item.outerHeight : item.outerWidth;
  });
  let ctx;
  if(renderMode === CANVAS || renderMode === WEBGL) {
    ctx = renderMode === WEBGL
      ? inject.getFontCanvas().ctx
      : root.ctx;
  }
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
  for(let i = list.length - 1; i >= 0; i--) {
    let item = list[i];
    // 无论删除一个ib还是textBox，放得下的话都可以暂停循环，注意强制保留行首
    if(!i || total + item.outerWidth >= ew + (1e-10)) {
      if(item instanceof TextBox) {
        let text = item.parent;
        text.__backtrack(bp, lineBoxManager, lineBox, item, total, endSpace, ew, computedStyle, ctx, renderMode, isUpright);
      }
      else {
        let ep = new Ellipsis(item.x + item.outerWidth + endSpace, item.y, ew, bp);
        lineBoxManager.addItem(ep, true);
      }
      break;
    }
    // 放不下删除
    else {
      if(item instanceof TextBox) {
        let text = item.parent;
        let i = text.textBoxes.indexOf(item);
        if(i > -1) {
          text.textBoxes.splice(i, 1);
        }
      }
      else {
        item.__layoutNone();
      }
      list.pop();
      total += isUpright ? item.outerHeight : item.outerWidth;
    }
  }
}

class Dom extends Xom {
  constructor(tagName, props, children) {
    super(tagName, props);
    let { style } = this;
    if(!style.display || !{
      flex: true,
      block: true,
      inline: true,
      'inline-block': true,
      inlineBlock: true,
      none: true,
    }.hasOwnProperty(style.display)) {
      if(tag.INLINE.hasOwnProperty(this.tagName)) {
        style.display = 'inline';
      }
      else {
        style.display = 'block';
      }
    }
    if(!style[FONT_WEIGHT] && tag.BOLD.hasOwnProperty(tagName)) {
      style.fontWeight = 700;
    }
    this.__style = css.normalize(style, reset.DOM_ENTRY_SET);
    // currentStyle/currentProps不深度clone，继承一层即可，动画时也是extend这样只改一层引用不动原始静态style
    this.__currentStyle = extend({}, this.__style);
    this.__children = children || [];
    this.__flexLine = []; // flex布局多行模式时存储行
    this.__ellipsis = null; // 虚拟节点，有的话渲染
    let config = this.__config;
    config[NODE_CURRENT_STYLE] = this.__currentStyle;
    config[NODE_STYLE] = this.__style;
  }

  __structure(i, lv, j) {
    let res = super.__structure(i++, lv, j);
    let arr = [res];
    let zIndexChildren = this.__zIndexChildren = this.__zIndexChildren || genZIndexChildren(this);
    zIndexChildren.forEach((child, j) => {
      let temp = child.__structure(i, lv + 1, j);
      if(Array.isArray(temp)) {
        i += temp.length;
        arr = arr.concat(temp);
      }
      else {
        i++;
        arr.push(temp);
      }
    });
    let total = arr.length - 1;
    res[STRUCT_NUM] = zIndexChildren.length;
    res[STRUCT_TOTAL] = total;
    return arr;
  }

  __modifyStruct(root, offset = 0) {
    let __config = this.__config;
    let struct = __config[NODE_STRUCT];
    let total = struct[STRUCT_TOTAL] || 0;
    // 新生成了struct，引用也变了
    let nss = this.__structure(struct[STRUCT_INDEX], struct[STRUCT_LV], struct[STRUCT_CHILD_INDEX]);
    root.__structs.splice(struct[STRUCT_INDEX] + offset, total + 1, ...nss);
    let d = 0;
    if(this !== root) {
      struct = __config[NODE_STRUCT];
      d = (struct[STRUCT_TOTAL] || 0) - total;
      let ps = __config[NODE_DOM_PARENT].__config[NODE_STRUCT];
      ps[STRUCT_TOTAL] = ps[STRUCT_TOTAL] || 0;
      ps[STRUCT_TOTAL] += d;
    }
    return [struct, d];
  }

  /**
   * 因为zIndex/abs的变化造成的更新，只需重排这一段顺序即可
   * 即便包含component造成的dom变化也不影响，component作为子节点reflow会再执行，这里重排老的vd
   * @param structs
   * @private
   */
  __updateStruct(structs) {
    let { [STRUCT_INDEX]: index, [STRUCT_TOTAL]: total = 0 } = this.__config[NODE_STRUCT];
    let zIndexChildren = this.__zIndexChildren = genZIndexChildren(this);
    let length = zIndexChildren.length;
    if(length === 1) {
      return;
    }
    zIndexChildren.forEach((child, i) => {
      child.__config[NODE_STRUCT][STRUCT_CHILD_INDEX] = i;
    });
    // 按直接子节点划分为相同数量的若干段进行排序
    let arr = [];
    let source = [];
    for(let i = index + 1; i <= index + total; i++) {
      let child = structs[i];
      let o = {
        child,
        list: structs.slice(child[STRUCT_INDEX], child[STRUCT_INDEX] + child[STRUCT_TOTAL] + 1),
      };
      arr.push(o);
      source.push(o);
      i += child[STRUCT_TOTAL] || 0;
    }
    arr.sort(function(a, b) {
      return a.child[STRUCT_CHILD_INDEX] - b.child[STRUCT_CHILD_INDEX];
    });
    // 是否有变更，有才进行重新计算
    let needSort;
    for(let i = 0, len = source.length; i < len; i++) {
      if(source[i] !== arr[i]) {
        needSort = true;
        break;
      }
    }
    if(needSort) {
      let list = [];
      arr.forEach(item => {
        list = list.concat(item.list);
      });
      list.forEach((struct, i) => {
        struct[STRUCT_INDEX] = index + i + 1;
      })
      structs.splice(index + 1, total, ...list);
    }
  }

  /**
   * 给定父宽度情况下，尝试行内放下后的剩余宽度，为负数即放不下，这里只会出现行内级即inline(Block)
   * 调用前提是非行开头的inline尝试计算是否放得下，开头无需且禁止判断，防止出现永远放不下一个字符卡死
   * 返回非负数就是放得下，这样一些尺寸为0的也算
   * @param free 剩余宽度
   * @param total 容器尺寸
   * @param isUpright 垂直排版
   * @returns {number|*}
   * @private
   */
  __tryLayInline(free, total, isUpright) {
    this.__computeReflow();
    let { flowChildren, currentStyle: {
      [DISPLAY]: display,
      [WIDTH]: width,
      [HEIGHT]: height,
      [MARGIN_LEFT]: marginLeft,
      [MARGIN_RIGHT]: marginRight,
      [MARGIN_TOP]: marginTop,
      [MARGIN_BOTTOM]: marginBottom,
      [PADDING_LEFT]: paddingLeft,
      [PADDING_RIGHT]: paddingRight,
      [PADDING_TOP]: paddingTop,
      [PADDING_BOTTOM]: paddingBottom,
    }, computedStyle: {
      [BORDER_LEFT_WIDTH]: borderLeftWidth,
      [BORDER_RIGHT_WIDTH]: borderRightWidth,
      [BORDER_TOP_WIDTH]: borderTopWidth,
      [BORDER_BOTTOM_WIDTH]: borderBottomWidth,
    } } = this;
    // inline没w/h，并且尝试孩子第一个能放下即可，如果是文字就是第一个字符
    if(display === 'inline') {
      if(flowChildren.length) {
        let first = flowChildren[0];
        if(first instanceof Component) {
          first = first.shadowRoot;
        }
        if(first instanceof Xom) {
          free = first.__tryLayInline(free, total, isUpright);
        }
        else {
          free -= first.firstCharWidth;
        }
      }
    }
    // inlineBlock尝试所有孩子在一行上
    else {
      if(width[1] !== AUTO) {
        free -= isUpright ? this.__calSize(height, total, true) : this.__calSize(width, total, true);
      }
      else {
        for(let i = 0; i < flowChildren.length; i++) {
          // 当放不下时直接返回，无需继续多余的尝试计算
          if(free < 0) {
            return free;
          }
          let item = flowChildren[i];
          if(item instanceof Component) {
            item = item.shadowRoot;
          }
          if(item instanceof Xom) {
            free = item.__tryLayInline(free, total, isUpright);
          }
          // text强制一行，否则非头就是放不下，需从头开始
          else {
            free -= item.textWidth;
          }
        }
      }
      // ib要减去末尾mpb
      if(isUpright) {
        free -= this.__calSize(marginBottom, total, true);
        free -= this.__calSize(paddingBottom, total, true);
        free -= borderBottomWidth;
      }
      else {
        free -= this.__calSize(marginRight, total, true);
        free -= this.__calSize(paddingRight, total, true);
        free -= borderRightWidth;
      }
    }
    // 还要减去开头的mpb
    if(isUpright) {
      free -= this.__calSize(marginTop, total, true);
      free -= this.__calSize(paddingTop, total, true);
      free -= borderTopWidth;
    }
    else {
      free -= this.__calSize(marginLeft, total, true);
      free -= this.__calSize(paddingLeft, total, true);
      free -= borderLeftWidth;
    }
    return free;
  }

  // 设置y偏移值，递归包括children，此举在justify-content/margin-auto等对齐用
  __offsetX(diff, isLayout, lv) {
    super.__offsetX(diff, isLayout, lv);
    let ep = this.__ellipsis;
    if(ep) {
      ep.__offsetX(diff, isLayout);
    }
    // 记得偏移LineBox
    if(isLayout && !this.__config[NODE_IS_INLINE] && this.lineBoxManager) {
      this.lineBoxManager.__offsetX(diff);
    }
    this.flowChildren.forEach(item => {
      if(item) {
        item.__offsetX(diff, isLayout, lv);
      }
    });
  }

  __offsetY(diff, isLayout, lv) {
    super.__offsetY(diff, isLayout, lv);
    let ep = this.__ellipsis;
    if(ep) {
      ep.__offsetY(diff, isLayout);
    }
    if(isLayout && !this.__config[NODE_IS_INLINE] && this.lineBoxManager) {
      this.lineBoxManager.__offsetY(diff);
    }
    this.flowChildren.forEach(item => {
      if(item) {
        item.__offsetY(diff, isLayout, lv);
      }
    });
  }


  /**
   * flex布局时，计算basis尺寸，如果有固定声明则以其为标准，content为内容最大尺寸，auto依赖w/h或降级content
   * basis要考虑相加直接item的mpb，非绝对值单位以container为基准，basis为内容时为max值
   * item的孩子为孙子节点需递归，不参与basis计算，只参与min/max，尺寸和mpb均只考虑绝对值
   * 自动计算时影响尺寸的只有换行的text，以及一组inline，均按其中最大尺寸的一个计算
   * auto自动计算递归进行，如果是普通row方向，按最大text的charWidth为准
   * 如果是column方向，则虚拟布局后看text的height
   * 在abs下时进入特殊状态，无论是row/column，都会按row方向尝试最大尺寸，直到舞台边缘或容器声明的w折行
   * 返回b，声明则按css值，否则是auto/content
   * 返回min为最小宽度，遇到字符/inline则单列排版后需要的最大宽度
   * 返回max为最大宽度，理想情况一排最大值，在abs时virtualMode状态参与计算，文本抵达边界才进行换行
   * 当为column方向时，特殊进行虚拟布局isVirtual，需要获取高度
   * @param isDirectionRow
   * @param isAbs
   * @param isColumn
   * @param data
   * @param isDirectChild
   * @private
   */
  __calBasis(isDirectionRow, isAbs, isColumn, data, isDirectChild) {
    this.__computeReflow();
    let b = 0;
    let min = 0;
    let max = 0;
    let { flowChildren, currentStyle, computedStyle } = this;
    let { x, y, w, h } = data;
    // 计算需考虑style的属性
    let {
      [FLEX_DIRECTION]: flexDirection,
      [FLEX_BASIS]: flexBasis,
      [WIDTH]: width,
      [HEIGHT]: height,
    } = currentStyle;
    let {
      [LINE_HEIGHT]: lineHeight,
      [DISPLAY]: display,
      [LINE_CLAMP]: lineClamp,
      [WRITING_MODE]: writingMode,
    } = computedStyle;
    let isUpright = writingMode.indexOf('vertical') === 0;
    let main = isDirectionRow ? width : height;
    // basis3种情况：auto、固定、content
    let isAuto = flexBasis[1] === AUTO;
    let isFixed = [PX, PERCENT, REM, VW, VH, VMAX, VMIN].indexOf(flexBasis[1]) > -1;
    let isContent = !isAuto && !isFixed;
    let fixedSize;
    // flex的item固定basis计算
    if(isFixed) {
      b = fixedSize = this.__calSize(flexBasis, isDirectionRow ? w : h, true);
    }
    // 已声明主轴尺寸的，当basis是auto时为main值
    else if(isAuto && ([PX, PERCENT, REM, VW, VH, VMAX, VMIN].indexOf(main[1]) > -1)) {
      b = fixedSize = this.__calSize(main, isDirectionRow ? w : h, true);
    }
    // 非固定尺寸的basis为auto时降级为content
    else if(isAuto) {
      isContent = true;
    }
    let countMin = 0, countMax = 0;
    lineClamp = lineClamp || 0;
    // row的flex时，child只需计算宽度的basis/min/max，递归下去也是如此，即便包含递归的flex
    if(isDirectionRow) {
      // flex的item还是flex时
      if(display === 'flex') {
        let isR = ['column', 'columnReverse'].indexOf(flexDirection) === -1;
        flowChildren = genOrderChildren(flowChildren);
        flowChildren.forEach(item => {
          if(item instanceof Xom || item instanceof Component && item.shadowRoot instanceof Xom) {
            let [, min2, max2] = item.__calBasis(isDirectionRow, isAbs, isColumn, { x, y, w, h }, false);
            if(isR) {
              min += min2;
              max += max2;
            }
            else {
              min = Math.max(min, min2);
              max = Math.max(max, max2);
            }
          }
          // text除了flex还需要分辨垂直排版
          else {
            if(isUpright) {
              let lineBoxManager = this.__lineBoxManager = new LineBoxManager(x, y, lineHeight,
                isUpright ? getVerticalBaseline(computedStyle) : getBaseline(computedStyle), isUpright);
              item.__layout({
                x,
                y,
                w,
                h,
                lineBoxManager,
                lineClamp,
                isUpright,
              });
              min += item.width;
              max += item.width;
            }
            if(isR) {
              min += item.charWidth;
              max += item.textWidth;
            }
            else {
              min = Math.max(min, item.charWidth);
              max = Math.max(max, item.textWidth);
            }
          }
        });
      }
      // 特殊的flex水平布局但书写垂直，遇到后直接假布局获取宽度，因为水平尺寸视为无限但垂直不是，
      // 这里一定是第一个垂直排版不会递归下去，因为flex的child匿名block，水平的垂直书写inline匿名ib
      else if(isUpright) {
        let lineBoxManager = this.__lineBoxManager = new LineBoxManager(x, y, lineHeight,
          isUpright ? getVerticalBaseline(computedStyle) : getBaseline(computedStyle), isUpright);
        this.__layout({
          x,
          y,
          w,
          h,
          lineBoxManager,
          lineClamp,
          isUpright,
        }, isAbs, false, true);
        min = max = b = this.width;
      }
      // flex的item是block/inline时，inline也会变成block统一对待，递归下去会有inline出现，但row的水平size为无穷不会换行可以忽略
      else {
        let lineBoxManager = data.lineBoxManager;
        if(display !== 'inline') {
          lineBoxManager = this.__lineBoxManager = new LineBoxManager(x, y, lineHeight,
            isUpright ? getVerticalBaseline(computedStyle) : getBaseline(computedStyle), isUpright);
        }
        flowChildren.forEach(item => {
          if(item instanceof Xom || item instanceof Component && item.shadowRoot instanceof Xom) {
            let [, min2, max2] = item.__calBasis(isDirectionRow, isAbs, isColumn, { x, y, w, h, lineBoxManager }, false);
            let display = item.computedStyle[DISPLAY];
            // row看块级最大尺寸和连续行级最大尺寸的宽
            if(display === 'block' || display === 'flex') {
              min = Math.max(min, min2);
              max = Math.max(max, max2);
              countMin = countMax = 0;
            }
            else {
              countMin += min2;
              countMax += max2;
              min = Math.max(min, countMin);
              max = Math.max(max, countMax);
            }
          }
          else {
            countMin += item.charWidth;
            countMax += item.textWidth;
            min = Math.max(min, countMin);
            max = Math.max(max, countMax);
          }
        });
      }
      if(fixedSize) {
        max = Math.max(fixedSize, max);
      }
      // row降级为内容时basis等同于max
      if(isContent) {
        b = max;
      }
    }
    // column的flex时，每个child做一次虚拟布局，获取到每个child的高度和宽度
    else {
      this.__layout({
        x,
        y,
        w,
        h,
        isUpright,
      }, isAbs, true, false);
      min = max = b = this.height; // column的child，max和b总相等
    }
    // 直接item的mpb影响basis
    return this.__addMBP(isDirectionRow, w, currentStyle, computedStyle, [b, min, max], isDirectChild);
  }

  __layoutNone() {
    super.__layoutNone();
    let { children } = this;
    children.forEach(item => {
      if(item instanceof Xom || item instanceof Component && item.shadowRoot instanceof Xom) {
        item.__layoutNone();
      }
    });
  }

  /**
   * block布局，本身固定尺寸优先，否则看内容从上往下从左往右flow流排布
   * 内部inline和inlineBlock组成LineBox，通过LineBoxManager来管理混排的现象
   * LineBoxManager只有block和inlineBlock内部生成，inline会复用最近父级的
   * 内部的block在垂直方向要考虑margin合并的问题，强制所有节点为bfc，精简逻辑
   * @param data
   * @param isAbs abs无尺寸时提前虚拟布局计算尺寸
   * @param isColumn flex列无尺寸时提前虚拟布局计算尺寸
   * @param isRow flex行布局时出现writingMode垂直排版计算尺寸
   * @private
   */
  __layoutBlock(data, isAbs, isColumn, isRow) {
    let { flowChildren, currentStyle, computedStyle } = this;
    let {
      [TEXT_ALIGN]: textAlign,
      [WHITE_SPACE]: whiteSpace,
      [LINE_CLAMP]: lineClamp,
      [LINE_HEIGHT]: lineHeight,
      [OVERFLOW]: overflow,
    } = computedStyle;
    let { fixedWidth, fixedHeight, x, y, w, h, isParentVertical, isUpright } = this.__preLayout(data, false);
    // abs虚拟布局需预知width，固定可提前返回
    if(isAbs && (fixedWidth && !isUpright || fixedHeight && isUpright)) {
      if(isUpright) {
        this.__ioSize(undefined, h);
      }
      else {
        this.__ioSize(w, undefined);
      }
      return;
    }
    if(isColumn && fixedHeight) {
      this.__ioSize(undefined, h);
      return;
    }
    if(isRow && fixedWidth) {
      this.__ioSize(w, undefined);
      return;
    }
    // 只有>=1的正整数才有效
    lineClamp = lineClamp || 0;
    let lineClampCount = 0;
    // 虚线管理一个block内部的LineBox列表，使得inline的元素可以中途衔接处理折行
    // 内部维护inline结束的各种坐标来达到目的，遇到block时中断并处理换行坐标
    let lineBoxManager = this.__lineBoxManager = new LineBoxManager(x, y, lineHeight,
      isUpright ? getVerticalBaseline(computedStyle) : getBaseline(computedStyle), isUpright);
    // 因精度问题，统计宽度均从0开始累加每行，最后取最大值，仅在abs布局时isVirtual生效
    let maxSize = 0;
    let countSize = 0;
    let lx = x; // 行首，考虑了mbp
    let ly = y;
    // 连续block（flex相同，下面都是）的上下margin合并值记录，合并时从列表中取
    let mergeMarginEndList = [], mergeMarginStartList = [];
    let length = flowChildren.length;
    let ignoreNextLine; // lineClamp超过后，后面的均忽略并置none，注意block内部行数统计是跨子block的
    let ignoreNextWrap; // whiteSpace单行超过后，后面的均忽略并置none，注意这也是跨block的会被隔断重计
    flowChildren.forEach((item, i) => {
      let isXom = item instanceof Xom || item instanceof Component && item.shadowRoot instanceof Xom;
      if(isXom) {
        item.__computeReflow(); // writing-mode可能会造成inline改变为ib
      }
      let isInline = isXom && item.computedStyle[DISPLAY] === 'inline';
      let isInlineBlock = isXom && item.computedStyle[DISPLAY] === 'inlineBlock';
      let isRealInline = isInline && item.__isRealInline();
      let lastLineClampCount = lineClampCount;
      // 每次循环开始前，这次不是block的话，看之前遗留待合并margin，并重置
      if((!isXom || isInline || isInlineBlock)) {
        if(mergeMarginEndList.length && mergeMarginStartList.length) {
          let diff = reflow.getMergeMargin(mergeMarginStartList, mergeMarginEndList);
          if(diff) {
            if(isUpright) {
              x += diff;
            }
            else {
              y += diff;
            }
          }
        }
        mergeMarginStartList = [];
        mergeMarginEndList = [];
      }
      if(isXom) {
        // inline和inlineBlock的细节不同之处，ib除了w/h之外，更想像block一样占据一行
        // 比如2个inline前面占一半后面比一半多但还是会从一半开始然后第2行换行继续，但ib放不下则重开一行
        // inline和ib能互相嵌套，形成的LineBox中则是TextBox和节点混合
        if(isInlineBlock || isInline) {
          if(ignoreNextLine || ignoreNextWrap) {
            item.__layoutNone();
            return;
          }
          // x开头或者nowrap单行的非block，不用考虑是否放得下直接放
          if((isUpright && y === ly) || (!isUpright && x === lx) || !i || whiteSpace === 'nowrap') {
            lineClampCount = item.__layout({
              x,
              y,
              w,
              h,
              lx,
              ly,
              lineBoxManager, // ib内部新生成会内部判断，这里不管统一传入
              lineClamp,
              lineClampCount,
              isUpright,
            }, isAbs, isColumn, isRow);
            // inlineBlock的特殊之处，一旦w为auto且内部产生折行时，整个变成block独占一块区域，坐标计算和block一样，注意nowrap排除
            if(item.__isIbFull) {
              lineClampCount++;
            }
            if((isUpright && item.__isUprightIbFull || !isUpright && item.__isIbFull)
              && whiteSpace !== 'nowrap') {
              lineBoxManager.addItem(item, true);
              if(isUpright) {
                x += item.outerWidth;
                y = ly;
              }
              else {
                x = lx;
                y += item.outerHeight;
              }
              lineBoxManager.setNotEnd();
            }
            // inline和不折行的ib，其中ib需要手动存入当前lb中
            else {
              (isInlineBlock || !isRealInline) && lineBoxManager.addItem(item, false);
              x = lineBoxManager.lastX;
              y = lineBoxManager.lastY;
            }
            // 单行时inline在ellipsis会导致行数变化，否则判断坐标尺寸(恰好有点空剩余inline排不下)，注意前提是非abs，其虚拟计算尺寸无视限制
            if(!isAbs && overflow === 'hidden' && whiteSpace === 'nowrap'
              && ((isUpright && y - ly > h + (1e-10)) || (!isUpright && x - lx > w + (1e-10))
                || lineClampCount > lastLineClampCount)) {
              ignoreNextWrap = true;
            }
            else if(lineClamp && lineClampCount >= lineClamp) {
              ignoreNextLine = true;
            }
            // abs统计宽度，注意nowrap时累加
            if(isAbs) {
              if(whiteSpace === 'nowrap') {
                countSize += isUpright ? item.outerHeight : item.outerWidth;
              }
              else {
                countSize = isUpright ? item.outerHeight : item.outerWidth;
                if(lineClampCount > lastLineClampCount) {
                  countSize = Math.max(countSize, isUpright ? h : w);
                }
              }
              maxSize = Math.max(maxSize, countSize);
            }
          }
          else {
            // 非开头先尝试是否放得下，内部判断了inline/ib，ib要考虑是否有width
            let free = item.__tryLayInline(isUpright ? (h + ly - y) : (w + lx - x), isUpright ? h : w, isUpright);
            // 放得下继续，奇怪的精度问题，加上阈值
            if(free >= (-1e-10)) {
              lineClampCount = item.__layout({
                x,
                y,
                w,
                h,
                lx,
                ly,
                lineBoxManager,
                lineClamp,
                lineClampCount,
                isUpright,
              }, isAbs, isColumn, isRow);
              // ib放得下要么内部没有折行，要么声明了width限制，都需手动存入当前lb
              (isInlineBlock || !isRealInline) && lineBoxManager.addItem(item, false);
              x = lineBoxManager.lastX;
              y = lineBoxManager.lastY;
              if(lineClamp && lineClampCount >= lineClamp) {
                ignoreNextLine = true;
              }
              if(isAbs) {
                // ib和非换行inline累加
                if(isInlineBlock || lineClampCount === lastLineClampCount) {
                  countSize += isUpright ? item.outerHeight : item.outerWidth;
                  maxSize = Math.max(maxSize, countSize);
                }
                // inline换行时一定超过边界至少撑满w
                else {
                  maxSize = Math.max(maxSize, isUpright ? h : w);
                  countSize = isUpright ? (y - ly) : (x - lx);
                  maxSize = Math.max(maxSize, countSize);
                }
              }
            }
            // 放不下处理之前的lineBox，并考虑重新开头或截断
            else {
              lineClampCount++;
              if(isUpright) {
                x = lineBoxManager.endX;
                y = ly;
              }
              else {
                x = lx;
                y = lineBoxManager.endY;
              }
              lineBoxManager.setNewLine();
              // 超过行数，整个block共用计数器
              if(lineClamp && lineClampCount >= lineClamp) {
                item.__layoutNone();
                ignoreNextLine = true;
                let list = lineBoxManager.list;
                let lineBox = list[list.length - 1];
                backtrack(this, lineBoxManager, lineBox, isUpright ? h : w, 0, isUpright);
                return;
              }
              lineClampCount = item.__layout({
                x,
                y,
                w,
                h,
                lx,
                ly,
                lineBoxManager,
                lineClamp,
                lineClampCount,
                isUpright,
              }, isAbs, isColumn, isRow);
              // 重新开头的ib和上面开头处一样逻辑
              if(item.__isIbFull || item.__isUprightIbFull) {
                lineBoxManager.addItem(item, false);
                if(isUpright) {
                  x += item.outerWidth;
                  y = ly;
                }
                else {
                  x = lx;
                  y += item.outerHeight;
                }
                lineBoxManager.setNotEnd();
                lineClampCount++;
              }
              // inline和不折行的ib，其中ib需要手动存入当前lb中
              else {
                (isInlineBlock || !isRealInline) && lineBoxManager.addItem(item, false);
                x = lineBoxManager.lastX;
                y = lineBoxManager.lastY;
              }
              if(lineClamp && lineClampCount >= lineClamp) {
                ignoreNextLine = true;
              }
              if(isAbs) {
                maxSize = Math.max(maxSize, countSize);
                // 此处发生换行撑满
                maxSize = Math.max(maxSize, isUpright ? h : w);
                // 新行重计
                countSize = isUpright ? item.outerHeight : item.outerWidth;
                maxSize = Math.max(maxSize, countSize);
              }
            }
          }
        }
        // block/flex先处理之前可能遗留的最后一行LineBox，然后递归时不传lineBoxManager，其内部生成新的
        else {
          ignoreNextWrap = false; // block出现的话只隔断单行，不影响多行计数器
          // 非开头，说明之前的text/ib未换行，需要增加行数
          if((isUpright && y > ly) || (!isUpright && x > lx)) {
            lineClampCount++;
          }
          if(lineClamp && lineClampCount >= lineClamp) {
            ignoreNextLine = true;
          }
          if(isUpright) {
            y = ly;
          }
          else {
            x = lx;
          }
          if(lineBoxManager.isEnd) {
            if(isUpright) {
              x = lineBoxManager.endX;
            }
            else {
              y = lineBoxManager.endY;
            }
            lineBoxManager.setNotEnd();
            lineBoxManager.setNewLine();
          }
          item.__layout({
            x,
            y,
            w,
            h,
            isUpright,
          }, isAbs, isColumn, isRow);
          // 自身无内容
          let isNone = item.currentStyle[DISPLAY] === 'none';
          let isEmptyBlock;
          if(!isNone && item.flowChildren && item.flowChildren.length === 0) {
            let {
              [MARGIN_TOP]: marginTop,
              [MARGIN_RIGHT]: marginRight,
              [MARGIN_BOTTOM]: marginBottom,
              [MARGIN_LEFT]: marginLeft,
              [PADDING_TOP]: paddingTop,
              [PADDING_RIGHT]: paddingRight,
              [PADDING_BOTTOM]: paddingBottom,
              [PADDING_LEFT]: paddingLeft,
              [WIDTH]: width,
              [HEIGHT]: height,
              [BORDER_TOP_WIDTH]: borderTopWidth,
              [BORDER_RIGHT_WIDTH]: borderRightWidth,
              [BORDER_BOTTOM_WIDTH]: borderBottomWidth,
              [BORDER_LEFT_WIDTH]: borderLeftWidth,
            } = item.computedStyle;
            // 无内容高度为0的空block特殊情况，记录2个margin下来等后续循环判断处理
            if(isUpright && paddingLeft <= 0 && paddingRight <= 0 && width <= 0 && borderLeftWidth <= 0 && borderRightWidth <= 0) {
              mergeMarginEndList.push(marginRight);
              mergeMarginStartList.push(marginLeft);
              isEmptyBlock = true;
            }
            else if(!isUpright && paddingTop <= 0 && paddingBottom <= 0 && height <= 0 && borderTopWidth <= 0 && borderBottomWidth <= 0) {
              mergeMarginEndList.push(marginBottom);
              mergeMarginStartList.push(marginTop);
              isEmptyBlock = true;
            }
          }
          if(isUpright) {
            x += item.outerWidth;
            lineBoxManager.__lastX = x;
          }
          else {
            y += item.outerHeight;
            lineBoxManager.__lastY = y;
          }
          // absolute/flex前置虚拟计算
          if(isAbs) {
            maxSize = Math.max(maxSize, isUpright ? item.outerHeight : item.outerWidth);
            countSize = 0;
          }
          // 空block要留下轮循环看，除非是最后一个，此处非空本轮处理掉看是否要合并
          if(!isNone && !isEmptyBlock) {
            let {
              [MARGIN_TOP]: marginTop,
              [MARGIN_RIGHT]: marginRight,
              [MARGIN_BOTTOM]: marginBottom,
              [MARGIN_LEFT]: marginLeft,
            } = item.computedStyle;
            // 有bottom值说明之前有紧邻的block，任意个甚至空block，自己有个top所以无需判断top
            // 如果是只有紧邻的2个非空block，也被包含在情况内，取上下各1合并
            if(mergeMarginEndList.length) {
              if(isUpright) {
                mergeMarginStartList.push(marginLeft);
                let diff = reflow.getMergeMargin(mergeMarginStartList, mergeMarginEndList);
                if(diff) {
                  item.__offsetX(diff, true);
                  x += diff;
                }
              }
              else {
                mergeMarginStartList.push(marginTop);
                let diff = reflow.getMergeMargin(mergeMarginStartList, mergeMarginEndList);
                if(diff) {
                  item.__offsetY(diff, true);
                  y += diff;
                }
              }
            }
            // 同时自己保存bottom，为后续block准备
            mergeMarginStartList = [];
            mergeMarginEndList = [isUpright ? marginRight : marginBottom];
          }
          // 最后一个空block当是正正和负负时要处理，正负在outHeight处理了结果是0
          else if(i === length - 1) {
            let diff = reflow.getMergeMargin(mergeMarginStartList, mergeMarginEndList);
            if(diff) {
              if(isUpright) {
                x += diff;
              }
              else {
                y += diff;
              }
            }
          }
        }
      }
      // 文字和inline类似
      else {
        if(ignoreNextLine || ignoreNextWrap) {
          item.__layoutNone();
          return;
        }
        // x开头，不用考虑是否放得下直接放
        if((isUpright && y === ly) || (!isUpright && x === lx) || !i || whiteSpace === 'nowrap') {
          lineClampCount = item.__layout({
            x,
            y,
            w,
            h,
            lx,
            ly,
            lineBoxManager,
            lineClamp,
            lineClampCount,
            isUpright,
          });
          x = lineBoxManager.lastX;
          y = lineBoxManager.lastY;
          // 和inline很像，只是没有ib
          if(!isAbs && overflow === 'hidden' && whiteSpace === 'nowrap'
            && ((isUpright && y - ly > h + (1e-10)) || (!isUpright && x - lx > w + (1e-10))
              || lineClampCount > lastLineClampCount)) {
            ignoreNextWrap = true;
          }
          else if(lineClamp && lineClampCount >= lineClamp) {
            ignoreNextLine = true;
          }
          // abs统计宽度，注意nowrap时累加
          if(isAbs) {
            if(whiteSpace === 'nowrap') {
              countSize += isUpright ? item.height : item.width;
            }
            else {
              countSize = isUpright ? item.height : item.width;
              if(lineClampCount > lastLineClampCount) {
                countSize = Math.max(countSize, isUpright ? h : w);
              }
            }
            maxSize = Math.max(maxSize, countSize);
          }
        }
        else {
          // 非开头先尝试是否放得下
          let free = item.__tryLayInline(isUpright ? (h + ly - y) : (w + lx - x));
          // 放得下继续
          if(free >= (-1e-10)) {
            lineClampCount = item.__layout({
              x,
              y,
              w,
              h,
              lx,
              ly,
              lineBoxManager,
              lineClamp,
              lineClampCount,
              isUpright,
            });
            x = lineBoxManager.lastX;
            y = lineBoxManager.lastY;
            if(lineClamp && lineClampCount >= lineClamp) {
              ignoreNextLine = true;
            }
            if(isAbs) {
              if(lineClampCount === lastLineClampCount) {
                countSize += isUpright ? item.height : item.width;
                maxSize = Math.max(maxSize, countSize);
              }
              // inline换行一定超过边界
              else {
                maxSize = Math.max(maxSize, isUpright ? h : w);
                countSize = isUpright ? (y - ly) : (x - lx);
                maxSize = Math.max(maxSize, countSize);
              }
            }
          }
          // 放不下处理之前的lineBox，并重新开头
          else {
            lineClampCount++;
            if(isUpright) {
              x = lineBoxManager.endX;
              y = ly;
            }
            else {
              x = lx;
              y = lineBoxManager.endY;
            }
            lineBoxManager.setNewLine();
            // 和inline/ib一样
            if(lineClamp && lineClampCount >= lineClamp) {
              item.__layoutNone();
              ignoreNextLine = true;
              let list = lineBoxManager.list;
              let lineBox = list[list.length - 1];
              backtrack(this, lineBoxManager, lineBox, isUpright ? h : w, 0, isUpright);
              return;
            }
            lineClampCount = item.__layout({
              x,
              y,
              w,
              h,
              lx,
              ly,
              lineBoxManager,
              lineClamp,
              lineClampCount,
              isUpright,
            });
            x = lineBoxManager.lastX;
            y = lineBoxManager.lastY;
            if(lineClamp && lineClampCount >= lineClamp) {
              ignoreNextLine = true;
            }
            if(isAbs) {
              maxSize = Math.max(maxSize, countSize);
              // 此处发生换行撑满
              maxSize = Math.max(maxSize, isUpright ? h : w);
              // 新行重计
              countSize = isUpright ? item.height : item.width;
              maxSize = Math.max(maxSize, countSize);
            }
          }
        }
      }
    });
    // 结束后如果是以LineBox结尾，则需要设置y到这里，否则流布局中block会设置
    // 当以block换行时，新行是true，否则是false即结尾
    if(lineBoxManager.isEnd) {
      if(isUpright) {
        x = lineBoxManager.endX;
      }
      else {
        y = lineBoxManager.endY;
      }
    }
    let tw = 0, th = 0;
    // 根据书写模式、嵌套等条件计算宽高，只有父子同向才会主轴撑满
    if(fixedWidth || !isAbs && !isParentVertical && !isUpright) {
      tw = w;
    }
    else if(isAbs) {
      tw = isUpright ? (x - data.x) : maxSize;
    }
    else {
      tw = x - data.x;
    }
    if(fixedHeight || !isAbs && isParentVertical && isUpright) {
      th = h;
    }
    else if(isAbs) {
      th = isUpright ? maxSize : (y - data.y);
    }
    else {
      th = y - data.y;
    }
    this.__ioSize(tw, th);
    // 除了水平abs的虚拟外，都需要垂直对齐，因为img这种占位元素会影响lineBox高度，水平abs虚拟只需宽度
    if(!isAbs) {
      let spread = lineBoxManager.verticalAlign(isUpright);
      if(spread) {
        if(isUpright && !fixedWidth) {
          this.__resizeX(spread);
        }
        else if(!isUpright && !fixedHeight) {
          this.__resizeY(spread);
        }
        /**
         * parent以及parent的next无需处理，因为深度遍历后面还会进行，
         * 但自己的block需处理，因为对齐只处理了inline元素，忽略了block，
         * 同时由于block和inline区域可能不连续，每个增加的y不一样，
         * 需要按照每个不同区域来判断，区域是按索引次序依次增大的，
         * 只有在inline出现过后才开始生效，inline之前的block忽略
         */
        let count = 0, spreadList = lineBoxManager.spreadList;
        let isLastBlock = false, hasStart = false;
        flowChildren.forEach(item => {
          let isXom = item instanceof Xom || item instanceof Component && item.shadowRoot instanceof Xom;
          let isBlock = isXom && ['block', 'flex'].indexOf(item.computedStyle[DISPLAY]) > -1;
          if(isBlock) {
            if(!hasStart) {
              return;
            }
            isLastBlock = true;
            if(isUpright) {
              item.__offsetX(spreadList[count], true);
            }
            else {
              item.__offsetY(spreadList[count], true);
            }
          }
          else {
            hasStart = true;
            if(isLastBlock) {
              count++;
            }
            isLastBlock = false;
          }
        });
      }
      // 非abs提前的虚拟布局，真实布局情况下最后为所有行内元素进行2个方向上的对齐
      if(!isColumn && !isRow) {
        if(['center', 'right'].indexOf(textAlign) > -1) {
          lineBoxManager.horizonAlign(isUpright ? th : tw, textAlign, isUpright);
          // 直接text需计算size
          flowChildren.forEach(item => {
            if(item instanceof Component) {
              item = item.shadowRoot;
            }
            if(item instanceof Text) {
              item.__inlineSize(isUpright);
            }
          });
        }
        // 所有inline计算size
        lineBoxManager.domList.forEach(item => {
          item.__inlineSize(isUpright ? th : tw, textAlign, isUpright);
        });
        this.__marginAuto(currentStyle, data, isUpright);
      }
    }
  }

  // 弹性布局时的计算位置
  __layoutFlex(data, isAbs, isColumn, isRow) {
    let { flowChildren, currentStyle, computedStyle, __flexLine } = this;
    let {
      [FLEX_DIRECTION]: flexDirection,
      [JUSTIFY_CONTENT]: justifyContent,
      [ALIGN_ITEMS]: alignItems,
      [LINE_CLAMP]: lineClamp,
      [FLEX_WRAP]: flexWrap,
      [ALIGN_CONTENT]: alignContent,
      [LINE_HEIGHT]: lineHeight,
      [TEXT_ALIGN]: textAlign,
    } = computedStyle;
    let { fixedWidth, fixedHeight, x, y, w, h, isParentVertical, isUpright } = this.__preLayout(data, false);
    if(isAbs && (fixedWidth && !isUpright || fixedHeight && isUpright)) {
      if(isUpright) {
        this.__ioSize(undefined, h);
      }
      else {
        this.__ioSize(w, undefined);
      }
      return;
    }
    if(isColumn && fixedHeight) {
      this.__ioSize(undefined, h);
      return;
    }
    if(isRow && fixedWidth) {
      this.__ioSize(w, undefined);
      return;
    }
    // 每次布局情况多行内容
    __flexLine.splice(0);
    // 只有>=1的正整数才有效
    lineClamp = lineClamp || 0;
    let lineClampCount = 0;
    let isDirectionRow = ['column', 'columnReverse'].indexOf(flexDirection) === -1;
    // 计算伸缩基数
    let growList = [];
    let shrinkList = [];
    let basisList = [];
    let maxList = [];
    let minList = [];
    let orderChildren = genOrderChildren(flowChildren);
    orderChildren.forEach(item => {
      if(item instanceof Xom || item instanceof Component && item.shadowRoot instanceof Xom) {
        let { currentStyle, computedStyle } = item;
        let [b, min, max] = item.__calBasis(isDirectionRow, isAbs, isColumn, { x, y, w, h }, true);
        let { [FLEX_GROW]: flexGrow, [FLEX_SHRINK]: flexShrink } = currentStyle;
        computedStyle[FLEX_BASIS] = b;
        growList.push(flexGrow);
        shrinkList.push(flexShrink);
        // 根据basis不同，计算方式不同
        basisList.push(b);
        maxList.push(max);
        minList.push(min);
      }
      // 文本
      else {
        growList.push(0);
        shrinkList.push(1);
        // 水平flex垂直文字和垂直flex水平文字都先假布局一次取结果，其它取文本最大最小宽度即可
        if(isDirectionRow && isUpright || !isDirectionRow && !isUpright) {
          let lineBoxManager = new LineBoxManager(x, y, lineHeight,
            isUpright ? getVerticalBaseline(computedStyle) : getBaseline(computedStyle), isUpright);
          item.__layout({
            x,
            y,
            w,
            h,
            lineBoxManager,
            lineClamp,
            lineClampCount,
            isUpright,
          }, isAbs, isColumn, isRow);
          let n = isUpright ? item.width: item.height;
          basisList.push(n);
          maxList.push(n);
          minList.push(n);
        }
        // 水平flex水平文本和垂直flex垂直文本
        else {
          let cw = item.charWidth;
          let tw = item.textWidth;
          basisList.push(tw);
          maxList.push(tw);
          minList.push(cw);
        }
      }
    });
    let containerSize = isDirectionRow ? w : h;
    let isMultiLine = ['wrap', 'wrapReverse'].indexOf(flexWrap) > -1;
    /**
     * 判断是否需要分行，根据假设主尺寸来统计尺寸和计算，假设主尺寸是clamp(min_main_size, flex_base_size, max_main_size)
     * 当多行时，由于每行一定有最小限制，所以每行一般情况都不是shrink状态，
     * 但也有极端情况，比如一行只能放下1个元素时，且此元素比容器小，会是shrink
     */
    let line = [], sum = 0, hypotheticalList = [];
    basisList.forEach((item, i) => {
      let min = minList[i], max = maxList[i];
      let hypothetical;
      if(item < min) {
        hypothetical = min;
      }
      else if(item > max) {
        hypothetical = max;
      }
      else {
        hypothetical = item;
      }
      hypotheticalList.push(hypothetical);
      if(isMultiLine) {
        // 超过尺寸时，要防止sum为0即1个也会超过尺寸
        if(sum + hypothetical > containerSize) {
          if(sum) {
            __flexLine.push(line);
            line = [orderChildren[i]];
            sum = hypothetical;
          }
          else {
            line.push(orderChildren[i]);
            __flexLine.push(line);
            line = [];
            sum = 0;
          }
        }
        else {
          line.push(orderChildren[i]);
          sum += hypothetical;
        }
      }
      else {
        line.push(orderChildren[i]);
      }
    });
    if(line.length) {
      __flexLine.push(line);
    }
    let offset = 0, clone = { x, y, w, h };
    let maxCrossList = [], marginAutoCountList = [], freeList = [];
    __flexLine.forEach(item => {
      let length = item.length;
      let end = offset + length;
      let [x1, y1, maxCross, marginAutoCount, free] = this.__layoutFlexLine(clone, isDirectionRow, isAbs, isColumn, isRow, isUpright,
        containerSize, fixedWidth, fixedHeight, lineClamp, lineClampCount,
        lineHeight, computedStyle, justifyContent, alignItems,
        orderChildren.slice(offset, end), item, textAlign,
        growList.slice(offset, end), shrinkList.slice(offset, end), basisList.slice(offset, end),
        hypotheticalList.slice(offset, end), minList.slice(offset, end), maxList.slice(offset, end));
      // 下一行/列更新坐标
      if(isDirectionRow) {
        clone.y = y1;
      }
      else {
        clone.x = x1;
      }
      x = Math.max(x, x1);
      y = Math.max(y, y1);
      maxCrossList.push(maxCross);
      marginAutoCountList.push(marginAutoCount);
      freeList.push(free);
      offset += length;
    });
    // abs预布局只计算宽度无需对齐
    if(isAbs) {
      let max = 0;
      __flexLine.forEach(line => {
        let count = 0;
        line.forEach(item => {
          if(isDirectionRow) {
            count += isUpright ? item.outerHeight : item.outerWidth;
          }
          else {
            count = Math.max(count, isUpright ? item.outerHeight : item.outerWidth);
          }
          // 文字发生换行无论row/column一定放不下需占满容器尺寸
          if(item instanceof Text) {
            if(isUpright) {
              if(item.textWidth > h) {
                max = Math.max(max, h);
              }
            }
            else {
              if(item.textWidth > w) {
                max = Math.max(max, w);
              }
            }
          }
        });
        max = Math.max(max, count);
      });
      if(isUpright) {
        this.__ioSize(undefined, max);
      }
      else {
        this.__ioSize(max, undefined);
      }
      return;
    }
    // 同block计算
    let tw = 0, th = 0;
    if(fixedWidth || !isAbs && !isParentVertical && !isUpright) {
      tw = w;
    }
    else {
      tw = x - data.x;
    }
    if(fixedHeight || !isAbs && isParentVertical && isUpright) {
      th = h;
    }
    else {
      th = y - data.y;
    }
    this.__ioSize(tw, th);
    if(isColumn || isRow) {
      return;
    }
    // flexDirection当有reverse时交换每line的主轴序
    if(flexDirection === 'rowReverse') {
      __flexLine.forEach(line => {
        line.forEach(item => {
          // 一个矩形内的子矩形进行镜像移动，用外w减去内w再减去开头空白的2倍即可
          let diff = tw - item.outerWidth - (item.x - data.x) * 2;
          if(diff) {
            item.__offsetX(diff, true);
          }
        });
      });
    }
    else if(flexDirection === 'columnReverse') {
      __flexLine.forEach(line => {
        line.forEach(item => {
          // 一个矩形内的子矩形进行镜像移动，用外w减去内w再减去开头空白的2倍即可
          let diff = th - item.outerHeight - (item.y - data.y) * 2;
          if(diff) {
            item.__offsetY(diff, true);
          }
        });
      });
    }
    // wrap-reverse且多轴线时交换轴线序，需要2行及以上才行
    let length = __flexLine.length;
    if(flexWrap === 'wrapReverse' && length > 1) {
      let crossSum = 0, crossSumList = [];
      maxCrossList.forEach(item => {
        crossSumList.push(crossSum);
        crossSum += item;
      });
      let count = 0;
      for(let i = length - 1; i >= 0; i--) {
        let line = __flexLine[i];
        let source = crossSumList[i];
        let diff = count - source;
        if(diff) {
          line.forEach(item => {
            if(isDirectionRow) {
              item.__offsetY(diff, true);
            }
            else {
              item.__offsetX(diff, true);
            }
          });
        }
        count += maxCrossList[i];
      }
      __flexLine.reverse();
    }
    // 侧轴对齐分flexLine做，要考虑整体的alignContent的stretch和每行的alignItems的stretch
    // 先做整体的，得出交叉轴空白再均分给每一行做单行的，整体的只有1行忽略
    let per;
    if(length > 1 && (fixedHeight && isDirectionRow || !isDirectionRow)) {
      let diff = isDirectionRow ? th - (y - data.y) : tw - (x - data.x);
      // 有空余时才进行对齐
      if(diff > 0) {
        if(alignContent === 'center') {
          let per = diff * 0.5;
          orderChildren.forEach(item => {
            if(isDirectionRow) {
              item.__offsetY(per, true);
            }
            else {
              item.__offsetX(per, true);
            }
          });
        }
        else if(alignContent === 'flexStart') {}
        else if(alignContent === 'flexEnd') {
          orderChildren.forEach(item => {
            if(isDirectionRow) {
              item.__offsetY(diff, true);
            }
            else {
              item.__offsetX(diff, true);
            }
          });
        }
        else if(alignContent === 'spaceBetween') {
          let between = diff / (length - 1);
          // 除了第1行其它进行偏移
          __flexLine.forEach((item, i) => {
            if(i) {
              item.forEach(item => {
                if(isDirectionRow) {
                  item.__offsetY(between, true);
                }
                else {
                  item.__offsetX(between, true);
                }
              });
            }
          });
        }
        else if(alignContent === 'spaceAround') {
          let around = diff / (length + 1);
          __flexLine.forEach((item, i) => {
            item.forEach(item => {
              if(isDirectionRow) {
                item.__offsetY(around * (i + 1), true);
              }
              else {
                item.__offsetX(around * (i + 1), true);
              }
            });
          });
        }
        // 默认stretch，每个flexLine进行扩充
        else {
          per = diff / length;
          // 因为每行都cross扩充了per，所有除了第1行其它进行偏移
          __flexLine.forEach((item, i) => {
            if(i) {
              item.forEach(item => {
                if(isDirectionRow) {
                  item.__offsetY(per * i, true);
                }
                else {
                  item.__offsetX(per * i, true);
                }
              });
            }
          });
        }
      }
    }
    // 每行再进行main/cross对齐，在alignContent为stretch时计算每行的高度
    if(!isColumn && !isRow) {
      if(length > 1) {
        __flexLine.forEach((item, i) => {
          let maxCross = maxCrossList[i];
          if(per) {
            maxCross += per;
          }
          this.__flexAlign(item, alignItems, justifyContent, isDirectionRow, maxCross, marginAutoCountList[i], freeList[i]);
        });
      }
      else if(length) {
        let maxCross = isDirectionRow ? th : tw;
        this.__flexAlign(__flexLine[0], alignItems, justifyContent, isDirectionRow, maxCross, marginAutoCountList[0], freeList[0]);
      }
      this.__marginAuto(currentStyle, data, isUpright);
    }
  }

  /**
   * 计算获取子元素的b/min/max完毕后，尝试进行flex每行布局
   * https://www.w3.org/TR/css-flexbox-1/#layout-algorithm
   * 假想主尺寸，其为clamp(min_main_size, flex_base_size, max_main_size)
   * 随后按算法一步步来 https://zhuanlan.zhihu.com/p/354567655
   * 规范没提到mpb，item的要计算，孙子的只考虑绝对值
   * 先收集basis和假设主尺寸
   */
  __layoutFlexLine(data, isDirectionRow, isAbs, isColumn, isRow, isUpright,
                   containerSize, fixedWidth, fixedHeight, lineClamp, lineClampCount,
                   lineHeight, computedStyle, justifyContent, alignItems,
                   orderChildren, flexLine, textAlign,
                   growList, shrinkList, basisList, hypotheticalList, minList, maxList) {
    let { x, y, w, h } = data;
    let hypotheticalSum = 0;
    hypotheticalList.forEach(item => {
      hypotheticalSum += item;
    });
    // 根据假设尺寸确定使用grow还是shrink，冻结非弹性项并设置target尺寸，确定剩余未冻结数量
    let isOverflow = hypotheticalSum >= containerSize;
    let targetMainList = [];
    basisList.forEach((item, i) => {
      if(isOverflow) {
        if(!shrinkList[i] || (basisList[i] < hypotheticalList[i])) {
          targetMainList[i] = hypotheticalList[i];
        }
      }
      else {
        if(!growList[i] || (basisList[i] > hypotheticalList[i])) {
          targetMainList[i] = hypotheticalList[i];
        }
      }
    });
    // 初始可用空间，冻结使用确定的target尺寸，未冻结使用假想
    let free = 0;
    basisList.forEach((item, i) => {
      if(targetMainList[i] !== undefined) {
        free += targetMainList[i];
      }
      else {
        free += item;
      }
    });
    let total = Infinity;
    if(isDirectionRow) {
      total = w;
    }
    else if(fixedHeight) {
      total = h;
    }
    else {
      total = free;
    }
    free = Math.abs(total - free); // 压缩也使用正值
    let lessOne = 0;
    // 循环，文档算法不够简练，其合并了grow和shrink，实际拆开写更简单
    let factorSum = 0;
    if(isOverflow) {
      // 计算真正的因子占比，同时得出缩小尺寸数值
      // 还需判断每个item收缩不能<min值，小于的话将无法缩小的这部分按比例分配到其它几项上
      // 于是写成一个循环，每轮先处理一遍，如果产生收缩超限的情况，将超限的设为最小值并剔除
      // 剩下的重新分配因子占比继续从头循环重来一遍
      let factorList = shrinkList.map((item, i) => {
        if(targetMainList[i] === undefined) { // 冻结项的目标主尺寸有值，因子无值或为0
          factorSum += item;
          return item;
        }
      });
      while(true) {
        // 都冻结了
        if(factorSum === 0) {
          break;
        }
        if(factorSum < 1) {
          lessOne += free * (1 - factorSum);
          free *= factorSum;
        }
        let needReset, factorSum2 = 0, count1 = 0, count2 = 0;
        factorList.forEach((item, i) => {
          if(item) {
            let r = item / factorSum;
            let s = r * free; // 需要收缩的尺寸
            let n = basisList[i] - s; // 实际尺寸
            // 比min还小设置为min，同时设0冻结剔除
            if(n < minList[i]) {
              targetMainList[i] = minList[i];
              factorList[i] = 0;
              needReset = true;
              count1 += basisList[i] - minList[i]; // 超出的尺寸也要减去实际收缩的尺寸，最终从free里减去
            }
            // else if(n > maxList[i]) {
            //   targetMainList[i] = maxList[i];
            //   factorList[i] = 0;
            //   needReset = true;
            //   count1 += maxList[i];
            // }
            // 先按照没有超限的设置，正常情况直接跳出，如果有超限，记录sum2给下轮赋值重新计算
            else {
              targetMainList[i] = n;
              factorSum2 += item;
              count2 += n;
            }
          }
        });
        if(!needReset) {
          free -= count2;
          break;
        }
        free -= count1;
        factorSum = factorSum2;
      }
    }
    else {
      let factorList = growList.map((item, i) => {
        if(targetMainList[i] === undefined) {
          factorSum += item;
          return item;
        }
      });
      while(true) {
        if(factorSum === 0) {
          break;
        }
        if(factorSum < 1) {
          lessOne += free * (1 - factorSum);
          free *= factorSum;
        }
        let needReset, factorSum2 = 0, count1 = 0, count2 = 0;
        factorList.forEach((item, i) => {
          if(item) {
            let r = item / factorSum;
            let s = r * free; // 需要扩展的尺寸
            let n = basisList[i] + s; // 实际尺寸
            // 比min还小设置为min，同时设0剔除
            if(n < minList[i]) {
              targetMainList[i] = minList[i];
              factorList[i] = 0;
              needReset = true;
              count1 += basisList[i] - minList[i];
            }
            // else if(n > maxList[i]) {
            //   targetMainList[i] = maxList[i];
            //   factorList[i] = 0;
            //   needReset = true;
            //   count1 += maxList[i];
            // }
            // 先按照没有超限的设置，正常情况直接跳出，如果有超限，记录sum2给下轮赋值重新计算
            else {
              targetMainList[i] = n;
              factorSum2 += item;
              count2 += n;
            }
          }
        });
        if(!needReset) {
          free -= count2;
          break;
        }
        free -= count1;
        factorSum = factorSum2;
      }
    }
    let maxCross = 0;
    let lbmList = [];
    let marginAutoCount = 0;
    orderChildren.forEach((item, i) => {
      let main = targetMainList[i];
      if(item instanceof Xom || item instanceof Component && item.shadowRoot instanceof Xom) {
        if(isDirectionRow) {
          item.__layout({
            x,
            y,
            w: main,
            h,
            w3: main, // w3假设固定宽度，忽略原始style中的设置
            isUpright,
          }, isAbs, isColumn, isRow);
        }
        else {
          let {
            [ALIGN_SELF]: alignSelf,
            [WIDTH]: width,
          } = item.currentStyle;
          // column的child真布局时，如果是stretch宽度，则可以直接生成animateRecord，否则自适应调整后才进行
          if(!isAbs && !isColumn && !isRow) {
            let needGenAr;
            if(width[1] !== AUTO || alignSelf === 'stretch') {
              needGenAr = true;
            }
            else if(alignSelf === 'auto' && alignItems === 'stretch') {
              needGenAr = true;
            }
            if(needGenAr) {
              item.__layout({
                x,
                y,
                w,
                h: main,
                h3: main, // 同w2
                isUpright,
              }, isAbs, isColumn, isRow);
            }
            else {
              item.__layout({
                x,
                y,
                w,
                h: main,
                h3: main, // 同w2
                isUpright,
              }, true, isColumn, isRow);
              item.__layout({
                x,
                y,
                w,
                w3: item.outerWidth,
                h: main,
                h3: main, // 同w2
                isUpright,
              }, isAbs, isColumn, isRow);
            }
          }
          else {
            item.__layout({
              x,
              y,
              w,
              h: main,
              h3: main, // 同w2
              isUpright,
            }, isAbs, isColumn, isRow);
          }
        }
        // 记录主轴是否有margin为auto的情况
        if(!isAbs && !isColumn && !isRow) {
          let currentStyle = item.currentStyle;
          if(isDirectionRow) {
            if(currentStyle[MARGIN_LEFT][1] === AUTO) {
              marginAutoCount++;
            }
            if(currentStyle[MARGIN_RIGHT][1] === AUTO) {
              marginAutoCount++;
            }
          }
          else {
            if(currentStyle[MARGIN_TOP][1] === AUTO) {
              marginAutoCount++;
            }
            if(currentStyle[MARGIN_BOTTOM][1] === AUTO) {
              marginAutoCount++;
            }
          }
        }
      }
      // 文字
      else {
        let lineBoxManager = this.__lineBoxManager = new LineBoxManager(x, y, lineHeight,
          isUpright ? getVerticalBaseline(computedStyle) : getBaseline(computedStyle), isUpright);
        lbmList.push(lineBoxManager);
        item.__layout({
          x,
          y,
          w: isDirectionRow ? main : w,
          h: isDirectionRow ? h : main,
          lineBoxManager,
          lineClamp,
          lineClampCount,
          isUpright,
        });
      }
      if(isDirectionRow) {
        x += item.outerWidth;
        maxCross = Math.max(maxCross, item.outerHeight);
      }
      else {
        y += item.outerHeight;
        maxCross = Math.max(maxCross, item.outerWidth);
      }
    });
    if(isDirectionRow) {
      y += maxCross;
    }
    else {
      x += maxCross;
    }
    // flex的直接text对齐比较特殊
    if(!isAbs && !isColumn && !isRow && ['center', 'right'].indexOf(textAlign) > -1) {
      lbmList.forEach(item => {
        item.horizonAlign(isUpright? item.height : item.width, textAlign, isUpright);
      })
    }
    return [x, y, maxCross, marginAutoCount, isOverflow ? 0 : Math.max(0, free + lessOne)];
  }

  // 每个flexLine的主轴侧轴对齐
  __flexAlign(line, alignItems, justifyContent, isDirectionRow, maxCross, marginAutoCount, free) {
    let baseline = 0;
    line.forEach(item => {
      baseline = Math.max(baseline, item.firstBaseline);
    });
    // 先主轴对齐方式，需要考虑margin，如果有auto则优先于justifyContent
    let len = line.length;
    if(marginAutoCount) {
      // 类似于space-between，空白均分于auto，两边都有就是2份，只有1边是1份
      let count = 0, per = free / marginAutoCount;
      for(let i = 0; i < len; i++) {
        let child = line[i];
        let currentStyle = child.currentStyle;
        if(isDirectionRow) {
          if(currentStyle[MARGIN_LEFT][1] === AUTO) {
            count += per;
            child.__offsetX(count, true);
          }
          else if(count) {
            child.__offsetX(count, true);
          }
          if(currentStyle[MARGIN_RIGHT][1] === AUTO) {
            count += per;
          }
        }
        else {
          if(currentStyle[MARGIN_TOP][1] === AUTO) {
            count += per;
            child.__offsetY(count, true);
          }
          else if(count) {
            child.__offsetY(count, true);
          }
          if(currentStyle[MARGIN_BOTTOM][1] === AUTO) {
            count += per;
          }
        }
      }
    }
    else {
      if(justifyContent === 'flexEnd') {
        for(let i = 0; i < len; i++) {
          let child = line[i];
          isDirectionRow ? child.__offsetX(free, true) : child.__offsetY(free, true);
        }
      }
      else if(justifyContent === 'center') {
        let center = free * 0.5;
        for(let i = 0; i < len; i++) {
          let child = line[i];
          isDirectionRow ? child.__offsetX(center, true) : child.__offsetY(center, true);
        }
      }
      else if(justifyContent === 'spaceBetween') {
        let between = free / (len - 1);
        for(let i = 1; i < len; i++) {
          let child = line[i];
          isDirectionRow ? child.__offsetX(between * i, true) : child.__offsetY(between * i, true);
        }
      }
      else if(justifyContent === 'spaceAround') {
        let around = free * 0.5 / len;
        for(let i = 0; i < len; i++) {
          let child = line[i];
          isDirectionRow ? child.__offsetX(around * (i * 2 + 1), true) : child.__offsetY(around * (i * 2 + 1), true);
        }
      }
      else if(justifyContent === 'spaceEvenly') {
        let around = free / (len + 1);
        for(let i = 0; i < len; i++) {
          let child = line[i];
          isDirectionRow ? child.__offsetX(around * (i + 1), true) : child.__offsetY(around * (i + 1), true);
        }
      }
    }
    // 再侧轴
    line.forEach(item => {
      let { currentStyle: { [ALIGN_SELF]: alignSelf } } = item;
      if(isDirectionRow) {
        if(alignSelf === 'flexStart') {}
        else if(alignSelf === 'flexEnd') {
          let diff = maxCross - item.outerHeight;
          if(diff !== 0) {
            item.__offsetY(diff, true);
          }
        }
        else if(alignSelf === 'center') {
          let diff = maxCross - item.outerHeight;
          if(diff !== 0) {
            item.__offsetY(diff * 0.5, true);
          }
        }
        else if(alignSelf === 'stretch') {
          let { computedStyle, currentStyle: { [HEIGHT]: height } } = item;
          let {
            [BORDER_TOP_WIDTH]: borderTopWidth,
            [BORDER_BOTTOM_WIDTH]: borderBottomWidth,
            [MARGIN_TOP]: marginTop,
            [MARGIN_BOTTOM]: marginBottom,
            [PADDING_TOP]: paddingTop,
            [PADDING_BOTTOM]: paddingBottom,
          } = computedStyle;
          if(height[1] === AUTO) {
            let old = item.height;
            let v = item.__height = computedStyle[HEIGHT] = maxCross - marginTop - marginBottom - paddingTop - paddingBottom - borderTopWidth - borderBottomWidth;
            let d = v - old;
            item.__sy4 += d;
            item.__sy5 += d;
            item.__sy6 += d;
            item.__height += d;
            item.__clientHeight += d;
            item.__offsetHeight += d;
            item.__outerHeight += d;
          }
        }
        else if(alignSelf === 'baseline') {
          let diff = baseline - item.firstBaseline;
          if(diff !== 0) {
            item.__offsetY(diff, true);
          }
        }
        // 默认auto，取alignItems
        else {
          if(alignItems === 'flexStart') {}
          else if(alignItems === 'center') {
            let diff = maxCross - item.outerHeight;
            if(diff !== 0) {
              item.__offsetY(diff * 0.5, true);
            }
          }
          else if(alignItems === 'flexEnd') {
            let diff = maxCross - item.outerHeight;
            if(diff !== 0) {
              item.__offsetY(diff, true);
            }
          }
          else if(alignItems === 'baseline') {
            let diff = baseline - item.firstBaseline;
            if(diff !== 0) {
              item.__offsetY(diff, true);
            }
          }
          // 默认stretch
          else {
            let { computedStyle, currentStyle: {
              [DISPLAY]: display,
              [FLEX_DIRECTION]: flexDirection,
              [HEIGHT]: height,
            } } = item;
            // row的孩子还是flex且column且不定高时，如果高度<侧轴拉伸高度则重新布局
            if(isDirectionRow && display === 'flex' && flexDirection === 'column' && height[1] === AUTO && item.outerHeight < maxCross) {
              item.__layout(Object.assign(item.__layoutData, { h3: maxCross }));
            }
            let {
              [BORDER_TOP_WIDTH]: borderTopWidth,
              [BORDER_BOTTOM_WIDTH]: borderBottomWidth,
              [MARGIN_TOP]: marginTop,
              [MARGIN_BOTTOM]: marginBottom,
              [PADDING_TOP]: paddingTop,
              [PADDING_BOTTOM]: paddingBottom,
            } = computedStyle;
            if(height[1] === AUTO) {
              let old = item.height;
              let v = maxCross - marginTop - marginBottom - paddingTop - paddingBottom - borderTopWidth - borderBottomWidth;
              let d = v - old;
              item.__sy4 += d;
              item.__sy5 += d;
              item.__sy6 += d;
              item.__height += d;
              item.__clientHeight += d;
              item.__offsetHeight += d;
              item.__outerHeight += d;
            }
          }
        }
      }
      // column
      else {
        if(alignSelf === 'flexStart') {}
        else if(alignSelf === 'flexEnd') {
          let diff = maxCross - item.outerWidth;
          if(diff !== 0) {
            item.__offsetX(diff, true);
          }
        }
        else if(alignSelf === 'center') {
          let diff = maxCross - item.outerWidth;
          if(diff !== 0) {
            item.__offsetX(diff * 0.5, true);
          }
        }
        else if(alignSelf === 'stretch') {
          let { computedStyle, currentStyle: { [WIDTH]: width } } = item;
          let {
            [BORDER_RIGHT_WIDTH]: borderRightWidth,
            [BORDER_LEFT_WIDTH]: borderLeftWidth,
            [MARGIN_RIGHT]: marginRight,
            [MARGIN_LEFT]: marginLeft,
            [PADDING_RIGHT]: paddingRight,
            [PADDING_LEFT]: paddingLeft,
          } = computedStyle;
          if(width[1] === AUTO) {
            let old = item.width;
            let v = item.__width = computedStyle[WIDTH] = maxCross - marginLeft - marginRight - paddingLeft - paddingRight - borderRightWidth - borderLeftWidth;
            let d = v - old;
            item.__sx4 += d;
            item.__sx5 += d;
            item.__sx6 += d;
            item.__width += d;
            item.__clientWidth += d;
            item.__offsetWidth += d;
            item.__outerWidth += d;
          }
        }
        else if(alignItems === 'baseline') {
          let diff = baseline - item.firstBaseline;
          if(diff !== 0) {
            item.__offsetX(diff, true);
          }
        }
        // 默认auto，取alignItems
        else {
          if(alignItems === 'flexStart') {}
          else if(alignItems === 'center') {
            let diff = maxCross - item.outerWidth;
            if(diff !== 0) {
              item.__offsetX(diff * 0.5, true);
            }
          }
          else if(alignItems === 'flexEnd') {
            let diff = maxCross - item.outerWidth;
            if(diff !== 0) {
              item.__offsetX(diff, true);
            }
          }
          else if(alignItems === 'baseline') {
            let diff = baseline - item.firstBaseline;
            if(diff !== 0) {
              item.__offsetX(diff, true);
            }
          }
          // 默认stretch
          else {
            let { computedStyle, currentStyle: {
              [WIDTH]: width,
            } } = item;
            let {
              [BORDER_RIGHT_WIDTH]: borderRightWidth,
              [BORDER_LEFT_WIDTH]: borderLeftWidth,
              [MARGIN_RIGHT]: marginRight,
              [MARGIN_LEFT]: marginLeft,
              [PADDING_RIGHT]: paddingRight,
              [PADDING_LEFT]: paddingLeft,
            } = computedStyle;
            if(width[1] === AUTO) {
              let old = item.width;
              let v = item.__width = computedStyle[WIDTH] = maxCross - marginLeft - marginRight - paddingLeft - paddingRight - borderRightWidth - borderLeftWidth;
              let d = v - old;
              item.__sx4 += d;
              item.__sx5 += d;
              item.__sx6 += d;
              item.__width += d;
              item.__clientWidth += d;
              item.__offsetWidth += d;
              item.__outerWidth += d;
            }
          }
        }
      }
    });
  }

  /**
   * inline比较特殊，先简单顶部对齐，后续还需根据vertical和lineHeight计算y偏移
   * inlineBlock复用逻辑，可以设置w/h，在混排时表现不同，inlineBlock换行限制在规定的矩形内，
   * 且ib会在没设置width且换行的时候撑满上一行，即便内部尺寸没抵达边界
   * 而inline换行则会从父容器start处开始，且首尾可能占用矩形不同
   * 嵌套inline情况十分复杂，尾部mpb空白可能产生叠加情况，因此endSpace表示自身，
   * 然后根据是否在最后一个元素进行叠加父元素的，多层嵌套则多层尾部叠加，均以最后一个元素为依据判断
   * Text获取这个叠加的endSpace值即可，无需感知是否最后一个，外层（此处）进行逻辑封装
   * @param data
   * @param isAbs
   * @param isColumn
   * @param isRow
   * @param isInline
   * @private
   */
  __layoutInline(data, isAbs, isColumn, isRow, isInline) {
    let { flowChildren, currentStyle, computedStyle } = this;
    let {
      [TEXT_ALIGN]: textAlign,
      [WHITE_SPACE]: whiteSpace,
      [LINE_CLAMP]: lineClamp,
      [LINE_HEIGHT]: lineHeight,
      [MARGIN_TOP]: marginTop,
      [MARGIN_BOTTOM]: marginBottom,
      [MARGIN_LEFT]: marginLeft,
      [MARGIN_RIGHT]: marginRight,
      [BORDER_TOP_WIDTH]: borderTopWidth,
      [BORDER_BOTTOM_WIDTH]: borderBottomWidth,
      [BORDER_LEFT_WIDTH]: borderLeftWidth,
      [BORDER_RIGHT_WIDTH]: borderRightWidth,
      [PADDING_TOP]: paddingTop,
      [PADDING_BOTTOM]: paddingBottom,
      [PADDING_LEFT]: paddingLeft,
      [PADDING_RIGHT]: paddingRight,
    } = computedStyle;
    let lineClampCount = data.lineClampCount || 0;
    let { fixedWidth, fixedHeight, x, y, w, h, lx, ly,
      lineBoxManager, endSpace, selfEndSpace, isUpright } = this.__preLayout(data, isInline);
    // abs虚拟布局需预知width，固定可提前返回
    if(isAbs && (fixedWidth && !isUpright || fixedHeight && isUpright)) {
      if(isUpright) {
        this.__ioSize(undefined, h);
      }
      else {
        this.__ioSize(w, undefined);
      }
      return lineClampCount;
    }
    let {
      [WIDTH]: width,
      [HEIGHT]: height,
    } = currentStyle;
    if(isInline && !this.__isRealInline()) {
      isInline = false;
    }
    // inline-block假布局提前结束
    if(!isInline) {
      if(isColumn && fixedHeight) {
        this.__ioSize(undefined, h);
        return lineClampCount;
      }
      if(isRow && fixedWidth) {
        this.__ioSize(w, undefined);
        return lineClampCount;
      }
    }
    // 只有inline的孩子需要考虑换行后从行首开始，而ib不需要，因此重置行首标识lx为x，末尾空白为0
    // 而inline的LineBoxManager复用最近非inline父dom的，ib需要重新生成，末尾空白叠加
    if(isInline) {
      this.__config[NODE_IS_INLINE] = true;
      this.__lineBoxManager = lineBoxManager;
      let baseline = isUpright ? getVerticalBaseline(computedStyle) : getBaseline(computedStyle);
      // 特殊inline调用，有内容的话（如左右mbp），默认生成一个lineBox，即便是空，也要形成占位，只有开头时需要
      if(isUpright
        && (marginTop || marginBottom || paddingTop || paddingBottom || borderTopWidth || borderBottomWidth)
        || !isUpright
          && (marginLeft || marginRight || paddingLeft || paddingRight || borderLeftWidth || borderRightWidth)) {
        if(lineBoxManager.isNewLine) {
          lineBoxManager.genLineBoxByInlineIfNewLine(x, y, lineHeight, baseline);
        }
        else {
          lineBoxManager.setLbByInlineIfNotNewLine(lineHeight, baseline);
        }
      }
      else {
        lineBoxManager.setLbByInlineIfNotNewLine(lineHeight, baseline);
      }
      lineClamp = data.lineClamp || 0;
    }
    else {
      lineBoxManager = this.__lineBoxManager = new LineBoxManager(x, y, lineHeight,
        isUpright ? getVerticalBaseline(computedStyle) : getBaseline(computedStyle), isUpright);
      lx = x;
      ly = y;
      endSpace = selfEndSpace = lineClampCount = 0;
    }
    // 存LineBox里的内容列表专用，布局过程中由lineBoxManager存入，递归情况每个inline节点都保存contentBox
    if(isInline) {
      this.contentBoxList.splice(0);
      lineBoxManager.pushContentBoxList(this);
    }
    // ib的bp是自己，inline是最近的非inline
    let bp = this;
    while(bp.computedStyle[DISPLAY] === 'inline') {
      bp = bp.domParent;
    }
    let {
      [OVERFLOW]: overflow,
    } = bp.computedStyle;
    let isIbFull = false, isUprightIbFull = false; // ib时不限定w情况下发生折行则撑满行，即便内容没有撑满边界
    let length = flowChildren.length;
    let ignoreNextLine = false; // lineClamp超过后，后面的均忽略并置none，注意ib内部自己统计类似block
    let ignoreNextWrap = false; // whiteSpace单行超过后，后面的均忽略并置none，注意和block不一样不隔断
    let hasAddEndSpace; // 最后一行生效，只加1次防重复
    flowChildren.forEach((item, i) => {
      // 和block不太一样可以提前判断，因为不可能包含block隔断区域了
      if(ignoreNextLine || ignoreNextWrap) {
        item.__layoutNone();
        return;
      }
      let isXom = item instanceof Xom || item instanceof Component && item.shadowRoot instanceof Xom;
      if(isXom) {
        item.__computeReflow(); // writing-mode可能会造成inline改变为ib
      }
      let isInline2 = isXom && item.computedStyle[DISPLAY] === 'inline';
      let isInlineBlock2 = isXom && item.computedStyle[DISPLAY] === 'inlineBlock';
      let isRealInline = isInline2 && item.__isRealInline();
      // 最后一个元素会产生最后一行，叠加父元素的尾部mpb，注意只执行一次防止重复叠加
      let isEnd = isInline && !hasAddEndSpace
        && (whiteSpace === 'nowrap' || (!isXom && i === length - 1)
          || ((lineClamp && i === length - 1) || lineClampCount === lineClamp - 1));
      if(isEnd) {
        hasAddEndSpace = true;
        endSpace += selfEndSpace;
      }
      let lastLineClampCount = lineClampCount;
      if(isXom) {
        if(!isInline2 && !isInlineBlock2) {
          item.currentStyle[DISPLAY] = item.computedStyle[DISPLAY] = 'inlineBlock';
          isInlineBlock2 = true;
          inject.warn('Inline can not contain block/flex');
        }
        // x开头或者nowrap单行，不用考虑是否放得下直接放，因为有beginSpace所以要多判断i为0
        if((isUpright && y === ly) || (!isUpright && x === lx) || !i || whiteSpace === 'nowrap') {
          lineClampCount = item.__layout({
            x,
            y,
            w,
            h,
            lx,
            ly,
            lineBoxManager,
            endSpace,
            lineClamp,
            lineClampCount,
            isUpright,
          }, isAbs, isColumn, isRow);
          // 同block布局
          if(item.__isIbFull || item.__isUprightIbFull) {
            lineClampCount++;
          }
          if(item.__isIbFull && whiteSpace !== 'nowrap') {
            if(isUpright && h[1] === AUTO) {
              isUprightIbFull = true;
            }
            else if(!isUpright && w[1] === AUTO) {
              isIbFull = true;
            }
            lineBoxManager.addItem(item, true);
            if(isUpright) {
              x += item.outerWidth;
              y = ly;
            }
            else {
              x = lx;
              y += item.outerHeight;
            }
            lineBoxManager.setNotEnd();
          }
          // inline和不折行的ib，其中ib需要手动存入当前lb中，以计算宽度
          else {
            (isInlineBlock2 || !isRealInline) && lineBoxManager.addItem(item, false);
            x = lineBoxManager.lastX;
            y = lineBoxManager.lastY;
          }
          if(!isAbs && overflow === 'hidden' && whiteSpace === 'nowrap'
            && ((isUpright && y - ly > h + (1e-10)) || (!isUpright && x - lx > w + (1e-10))
              || lineClampCount > lastLineClampCount)) {
            ignoreNextWrap = true;
          }
          else if(lineClamp && lineClampCount >= lineClamp) {
            ignoreNextLine = true;
          }
        }
        else {
          // 不换行继续排，换行非开头先尝试是否放得下，结尾要考虑mpb因此减去endSpace
          let free = item.__tryLayInline(isUpright ? (h + ly - y - endSpace) : (w + lx - x - endSpace), isUpright ? h : w, isUpright);
          // 放得下继续
          if(free >= (-1e-10)) {
            lineClampCount = item.__layout({
              x,
              y,
              w,
              h,
              lx,
              ly,
              lineBoxManager,
              endSpace,
              lineClamp,
              lineClampCount,
              isUpright,
            }, isAbs, isColumn, isRow);
            // ib放得下要么内部没有折行，要么声明了width限制，都需手动存入当前lb
            (isInlineBlock2 || !isRealInline) && lineBoxManager.addItem(item, false);
            x = lineBoxManager.lastX;
            y = lineBoxManager.lastY;
            if(lineClamp && lineClampCount >= lineClamp) {
              ignoreNextLine = true;
            }
          }
          // 放不下处理之前的lineBox，并重新开头
          else {
            lineClampCount++;
            if(isUpright) {
              x = lineBoxManager.endX;
              y = ly;
            }
            else {
              x = lx;
              y = lineBoxManager.endY;
            }
            lineBoxManager.setNewLine();
            // 可能超行了，无需继续，并且进行回溯
            if(lineClamp && lineClampCount >= lineClamp) {
              item.__layoutNone();
              ignoreNextLine = true;
              let list = lineBoxManager.list;
              let lineBox = list[list.length - 1];
              backtrack(bp, lineBoxManager, lineBox, w, endSpace, isUpright);
              return;
            }
            lineClampCount = item.__layout({
              x,
              y,
              w,
              h,
              lx,
              ly,
              lineBoxManager,
              endSpace,
              lineClamp,
              lineClampCount,
              isUpright,
            }, isAbs, isColumn, isRow);
            // 重新开头的ib和上面开头处一样逻辑
            if(item.__isIbFull || item.__isUprightIbFull) {
              lineBoxManager.addItem(item, true);
              if(isUpright) {
                x += item.outerWidth;
                y = ly;
              }
              else {
                x = lx;
                y += item.outerHeight;
              }
              lineBoxManager.setNotEnd();
              lineClampCount++;
            }
            // inline和不折行的ib，其中ib需要手动存入当前lb中
            else {
              (isInlineBlock2 || !isRealInline) && lineBoxManager.addItem(item, false);
              x = lineBoxManager.lastX;
              y = lineBoxManager.lastY;
            }
            if(lineClamp && lineClampCount >= lineClamp) {
              ignoreNextLine = true;
            }
          }
        }
      }
      // inline里的其它只有文本，可能开始紧跟着之前的x，也可能换行后从lx行头开始
      // 紧跟着x可能出现在前面有节点换行后第2行，此时不一定放得下，因此不能作为判断依据，开头仅有lx
      else {
        let n = lineBoxManager.size;
        // i为0时强制不换行
        if((isUpright && y === ly) || (!isUpright && x === lx) || !i || whiteSpace === 'nowrap') {
          lineClampCount = item.__layout({
            x,
            y,
            w,
            h,
            lx,
            ly,
            lineBoxManager,
            endSpace,
            lineClamp,
            lineClampCount,
            isUpright,
          }, isAbs, isColumn, isRow);
          x = lineBoxManager.lastX;
          y = lineBoxManager.lastY;
          // ib情况发生折行，且非定宽
          if(!isInline && (lineBoxManager.size - n) > 1) {
            if(height[1] === AUTO && isUpright) {
              isUprightIbFull = true;
            }
            if(width[1] === AUTO && !isUpright) {
              isIbFull = true;
            }
          }
          if(!isAbs && overflow === 'hidden' && whiteSpace === 'nowrap'
            && ((isUpright && y - ly > h + (1e-10)) || (!isUpright && x - lx > w + (1e-10))
              || lineClampCount > lastLineClampCount)) {
            ignoreNextWrap = true;
          }
          else if(lineClamp && lineClampCount >= lineClamp) {
            ignoreNextLine = true;
          }
        }
        else {
          // 非开头先尝试是否放得下，如果放得下再看是否end，加end且只有1个字时放不下要换行，否则可以放，换行由text内部做
          let free = item.__tryLayInline(isUpright ? (h + ly - y - endSpace) : (w + lx - x - endSpace));
          // 放得下继续
          if(free >= (-1e-10)) {
            lineClampCount = item.__layout({
              x,
              y,
              w,
              h,
              lx,
              ly,
              lineBoxManager,
              endSpace,
              lineClamp,
              lineClampCount,
              isUpright,
            }, isAbs, isColumn, isRow);
            x = lineBoxManager.lastX;
            y = lineBoxManager.lastY;
            if(lineClamp && lineClampCount >= lineClamp) {
              ignoreNextLine = true;
            }
            // 这里ib放得下一定是要么没换行要么固定宽度，所以无需判断isIbFull
          }
          // 放不下处理之前的lineBox，并重新开头
          else {
            lineClampCount++;
            if(isUpright) {
              x = lineBoxManager.endX;
              y = ly;
            }
            else {
              x = lx;
              y = lineBoxManager.endY;
            }
            lineBoxManager.setNewLine();
            // 可能超行了，无需继续，并且进行回溯
            if(lineClamp && lineClampCount >= lineClamp) {
              item.__layoutNone();
              ignoreNextLine = true;
              let list = lineBoxManager.list;
              let lineBox = list[list.length - 1];
              backtrack(bp, lineBoxManager, lineBox, w, endSpace, isUpright);
              return;
            }
            lineClampCount = item.__layout({
              x,
              y,
              w,
              h,
              lx,
              ly,
              lineBoxManager,
              endSpace,
              lineClamp,
              lineClampCount,
              isUpright,
            }, isAbs, isColumn, isRow);
            x = lineBoxManager.lastX;
            y = lineBoxManager.lastY;
            // ib情况发生折行
            if(!isInline && (lineBoxManager.size - n) > 1) {
              if(height[1] === AUTO && isUpright) {
                isUprightIbFull = true;
              }
              if(width[1] === AUTO && !isUpright) {
                isIbFull = true;
              }
            }
            if(lineClamp && lineClampCount >= lineClamp) {
              ignoreNextLine = true;
            }
          }
        }
      }
    });
    // 同block结尾，不过这里一定是lineBox结束，无需判断
    if(isUpright) {
      x = lineBoxManager.endX;
    }
    else {
      y = lineBoxManager.endY;
    }
    // 标识ib情况同block一样占满行
    this.__isIbFull = isIbFull;
    this.__isUprightIbFull = isUprightIbFull;
    // 元素的width在固定情况或者ibFull情况已被计算出来，否则为最大延展尺寸，inline没有固定尺寸概念
    let tw, th;
    if(isInline) {
      // inline最后的x要算上右侧mpb，为next行元素提供x坐标基准，同时其尺寸计算比较特殊
      if(selfEndSpace) {
        if(isUpright) {
          lineBoxManager.addY(selfEndSpace);
        }
        else {
          lineBoxManager.addX(selfEndSpace);
        }
      }
      // 如果没有内容，空白还要加上开头即左侧mpb
      if(!flowChildren.length) {
        let {
          [MARGIN_TOP]: marginTop,
          [MARGIN_LEFT]: marginLeft,
          [PADDING_TOP]: paddingTop,
          [PADDING_LEFT]: paddingLeft,
          [BORDER_TOP_WIDTH]: borderTopWidth,
          [BORDER_LEFT_WIDTH]: borderLeftWidth,
        } = computedStyle;
        if(isUpright) {
          lineBoxManager.addY(marginTop + paddingTop + borderTopWidth);
        }
        else {
          lineBoxManager.addX(marginLeft + paddingLeft + borderLeftWidth);
        }
      }
      // 结束出栈contentBox，递归情况结束子inline获取contentBox，父inline继续
      lineBoxManager.popContentBoxList();
      // abs非固定w时预计算，本来是最近非inline父层统一计算，但在abs时不算，这里无视textAlign默认left
      if(isAbs) {
        this.__inlineSize(0, 'left', isUpright);
      }
    }
    else {
      // ib在满时很特殊，取最大值，可能w本身很小不足排下1个字符，此时要用max
      let max = lineBoxManager.max - (isUpright ? data.y : data.x);
      if(isUpright) {
        tw = fixedWidth ? w : x - data.x;
        th = fixedHeight ? h : (isIbFull ? Math.max(h, max) : max);
      }
      else {
        tw = fixedWidth ? w : (isIbFull ? Math.max(w, max) : max);
        th = fixedHeight ? h : y - data.y;
      }
      this.__ioSize(tw, th);
    }
    // 非abs提前虚拟布局，真实布局情况下最后为所有行内元素进行2个方向上的对齐，inline会被父级调用这里只看ib
    if(!isAbs && !isInline) {
      let spread = lineBoxManager.verticalAlign(isUpright);
      if(spread) {
        if(isUpright && !fixedWidth) {
          this.__resizeX(spread);
        }
        else if(!isUpright && !fixedHeight) {
          this.__resizeY(spread);
        }
      }
      if(!isColumn && !isRow) {
        if(['center', 'right'].indexOf(textAlign) > -1) {
          lineBoxManager.horizonAlign(isUpright ? th : tw, textAlign, isUpright);
          // 直接text需计算size
          flowChildren.forEach(item => {
            if(item instanceof Component) {
              item = item.shadowRoot;
            }
            if(item instanceof Text) {
              item.__inlineSize(isUpright);
            }
          });
        }
        // block的所有inline计算size
        lineBoxManager.domList.forEach(item => {
          item.__inlineSize(isUpright ? th : tw, textAlign, isUpright);
        });
      }
    }
    // inlineBlock新开上下文，但父级block遇到要处理换行
    return lineClampCount;
  }

  /**
   * inline的尺寸计算非常特殊，并非一个矩形区域，而是由字体行高结合节点下多个LineBox中的内容决定，
   * 且这个尺寸又并非真实LineBox中的内容直接合并计算而来，比如包含了个更大尺寸的ib却不会计入
   * 具体方法为遍历持有的LineBox下的内容，x取两侧极值，同时首尾要考虑mpb，y值取上下极值，同样首尾考虑mpb
   * 首尾行LineBox可能不是不是占满一行，比如前后都有同行inline的情况，非首尾行则肯定占满
   * 绘制内容（如背景色）的区域也很特殊，每行LineBox根据lineHeight对齐baseline得来，并非LineBox全部
   * 当LineBox只有直属Text时如果font没有lineGap则等价于全部，如有则需减去
   * 另外其client/offset/outer的w/h尺寸计算也很特殊，皆因首尾x方向的mpb导致
   * @private
   */
  __inlineSize(size, textAlign, isUpright) {
    let { contentBoxList, computedStyle, __ox, __oy } = this;
    let {
      [DISPLAY]: display,
      [MARGIN_TOP]: marginTop,
      [MARGIN_RIGHT]: marginRight,
      [MARGIN_BOTTOM]: marginBottom,
      [MARGIN_LEFT]: marginLeft,
      [PADDING_TOP]: paddingTop,
      [PADDING_RIGHT]: paddingRight,
      [PADDING_BOTTOM]: paddingBottom,
      [PADDING_LEFT]: paddingLeft,
      [BORDER_TOP_WIDTH]: borderTopWidth,
      [BORDER_RIGHT_WIDTH]: borderRightWidth,
      [BORDER_BOTTOM_WIDTH]: borderBottomWidth,
      [BORDER_LEFT_WIDTH]: borderLeftWidth,
      [LINE_HEIGHT]: lineHeight,
    } = computedStyle;
    // 可能因为Ellipsis回溯变成none
    if(display === 'none') {
      return;
    }
    // x/clientX/offsetX/outerX
    let maxX, maxY, minX, minY, maxCX, maxCY, minCX, minCY, maxFX, maxFY, minFX, minFY, maxOX, maxOY, minOX, minOY;
    let length = contentBoxList.length;
    if(length) {
      // 遍历contentBox，里面存的是LineBox内容，根据父LineBox引用判断是否换行
      contentBoxList.forEach((item, i) => {
        // 非第一个除了minY不用看其它都要，minX是换行导致，而maxX在最后一个要考虑右侧mpb，中间的无需考虑嵌套inline的mpb
        if(i) {
          minX = Math.min(minX, item.x);
          minCX = Math.min(minCX, item.x);
          minFX = Math.min(minFX, item.x);
          minOX = Math.min(minOX, item.x);
          if(i === length - 1) {
            maxX = maxCX = maxFX = maxOX = Math.max(maxX, item.x + item.outerWidth);
            maxY = maxCY = maxFY = maxOY = Math.max(maxY, item.y + item.outerHeight);
            maxCX += paddingRight;
            maxCY += paddingBottom;
            maxFX += paddingRight + borderRightWidth;
            maxFY += paddingBottom + borderBottomWidth;
            maxOX += borderRightWidth + paddingRight + marginRight
            maxOY += borderBottomWidth + paddingBottom + marginBottom;
          }
          else {
            maxX = maxCX = maxFX = maxOX = Math.max(maxX, item.x + item.outerWidth);
          }
        }
        // 第一个初始化
        else {
          minX = item.x;
          minY = item.y;
          minCX = minX - paddingLeft;
          minCY = minY - paddingTop;
          minFX = minCX - borderLeftWidth;
          minFY = minCY - borderTopWidth;
          minOX = minFX - marginLeft;
          minOY = minFY - marginTop;
          maxX = maxCX = maxFX = maxOX = item.x + item.outerWidth;
          maxY = maxCY = maxFY = maxOY = item.y + item.outerHeight;
          if(i === length - 1) {
            maxCX += paddingRight;
            maxCY += paddingBottom;
            maxFX += paddingRight + borderRightWidth;
            maxFY += paddingBottom + borderBottomWidth;
            maxOX += borderRightWidth + paddingRight + marginRight
            maxOY += borderBottomWidth + paddingBottom + marginBottom;
          }
        }
      });
      this.__x = minOX;
      this.__y = minOY;
      this.__width = computedStyle[WIDTH] = maxX - minX;
      // 防止比自己最小高度lineHeight还小，比如内容是个小字体
      this.__height = computedStyle[HEIGHT] = Math.max(lineHeight, maxY - minY);
      this.__clientWidth = maxCX - minCX;
      this.__clientHeight = maxCY - minCY;
      this.__offsetWidth = maxFX - minFX;
      this.__offsetHeight = maxFY - minFY;
      this.__outerWidth = maxOX - minOX;
      this.__outerHeight = maxOY - minOY;
      this.__sx = minOX + __ox;
      this.__sy = minOY + __oy;
      this.__sx1 = minFX + __ox;
      this.__sy1 = minFY + __oy;
      this.__sx2 = minCX + __ox;
      this.__sy2 = minCY + __oy;
      this.__sx3 = minX + __ox;
      this.__sy3 = minY + __oy;
      this.__sx4 = maxX + __ox;
      this.__sy4 = maxY + __oy;
      this.__sx5 = maxCX + __ox;
      this.__sy5 = maxCY + __oy;
      this.__sx6 = maxFX + __ox;
      this.__sy6 = maxFY + __oy;
      // inline的text整体设置相同
      if(['center', 'right'].indexOf(textAlign) > -1) {
        this.children.forEach(item => {
          if(item instanceof Text) {
            item.__inlineSize(isUpright);
          }
        });
      }
    }
    // 如果没有内容，宽度为0高度为lineHeight，对齐也特殊处理，lineBoxManager不会处理
    else {
      let tw = 0, th = 0;
      if(['center', 'right'].indexOf(textAlign) > -1) {
        let diff = size;
        if(textAlign === 'center') {
          diff *= 0.5;
        }
        if(diff > 0) {
          if(isUpright) {
            this.__offsetY(diff, true);
          }
          else {
            this.__offsetX(diff, true);
          }
        }
      }
      if(isUpright) {
        tw = lineHeight;
        this.__ioSize(tw, 0);
        this.__sx -= marginLeft + paddingLeft + borderLeftWidth;
      }
      else {
        th = lineHeight;
        this.__ioSize(0, th);
        this.__sy -= marginTop + paddingTop + borderTopWidth;
      }
      this.__sx1 = this.__sx + marginLeft;
      this.__sy1 = this.__sy + marginTop;
      this.__sx2 = this.__sx1 + borderLeftWidth;
      this.__sy2 = this.__sy1 + borderTopWidth;
      this.__sx4 = this.__sx3 = this.__sx2 + paddingLeft;
      this.__sy4 = this.__sy3 = this.__sy2 + paddingTop;
      this.__sx5 = this.__sx4 + tw + paddingRight;
      this.__sy5 = this.__sy4 + th + paddingBottom;
      this.__sx6 = this.__sx5 + borderRightWidth;
      this.__sy6 = this.__sy5 + borderBottomWidth;
      this.__clientWidth = this.__sx5 - this.__sx2;
      this.__clientHeight = this.__sy5 - this.__sy2;
      this.__offsetWidth = this.__sx6 - this.__sx1;
      this.__offsetHeight = this.__sy6 - this.__sy1;
      this.__outerWidth = this.__offsetWidth + marginLeft + marginRight;
      this.__outerHeight = this.__offsetHeight + marginTop + marginBottom;
    }
  }

  /**
   * 只针对绝对定位children布局
   * @param container
   * @param data
   * @param target 可选，只针对某个abs的child特定布局，在局部更新时用
   * @private
   */
  __layoutAbs(container, data, target) {
    let { sx: x, sy: y, clientWidth, clientHeight, computedStyle } = container;
    let { isDestroyed, children, absChildren } = this;
    let {
      [DISPLAY]: display,
      [BORDER_TOP_WIDTH]: borderTopWidth,
      [BORDER_LEFT_WIDTH]: borderLeftWidth,
      [MARGIN_TOP]: marginTop,
      [MARGIN_LEFT]: marginLeft,
      [PADDING_LEFT]: paddingLeft,
      [PADDING_TOP]: paddingTop,
    } = computedStyle;
    if(isDestroyed || display === 'none') {
      this.__layoutNone();
      return;
    }
    x += marginLeft + borderLeftWidth;
    y += marginTop + borderTopWidth;
    // 对absolute的元素进行相对容器布局
    absChildren.forEach(item => {
      if(target) {
        // 传入target局部布局更新，这时候如果是Component引发的，当setState时是Cp自身，当layout时是sr
        let node = item;
        if(node instanceof Component) {
          node = item.shadowRoot;
        }
        // 所以得2个都对比
        if(target !== node && target !== item) {
          return;
        }
      }
      let { currentStyle, computedStyle } = item;
      if(item.isDestroyed || currentStyle[DISPLAY] === 'none') {
        item.__layoutNone();
        return;
      }
      // 先根据容器宽度计算margin/padding，匿名块对象特殊处理，此时没有computedStyle
      item.__computeReflow();
      item.__mp(currentStyle, computedStyle, clientWidth);
      let {
        [LEFT]: left,
        [TOP]: top,
        [RIGHT]: right,
        [BOTTOM]: bottom,
        [WIDTH]: width,
        [HEIGHT]: height,
      } = currentStyle;
      let x2, y2, w2, h2;
      let onlyRight;
      let onlyBottom;
      let fixedTop;
      let fixedRight;
      let fixedBottom;
      let fixedLeft;
      // 判断何种方式的定位，比如左+宽度，左+右之类
      if(left[1] !== AUTO) {
        fixedLeft = true;
        computedStyle[LEFT] = this.__calSize(left, clientWidth, true);
      }
      else {
        computedStyle[LEFT] = 'auto';
      }
      if(right[1] !== AUTO) {
        fixedRight = true;
        computedStyle[RIGHT] = this.__calSize(right, clientWidth, true);
      }
      else {
        computedStyle[RIGHT] = 'auto';
      }
      if(top[1] !== AUTO) {
        fixedTop = true;
        computedStyle[TOP] = this.__calSize(top, clientHeight, true);
      }
      else {
        computedStyle[TOP] = 'auto';
      }
      if(bottom[1] !== AUTO) {
        fixedBottom = true;
        computedStyle[BOTTOM] = this.__calSize(bottom, clientHeight, true);
      }
      else {
        computedStyle[BOTTOM] = 'auto';
      }
      // 优先级最高left+right，其次left+width，再次right+width，再次仅申明单个，最次全部auto
      if(fixedLeft && fixedRight) {
        x2 = x + computedStyle[LEFT];
        w2 = clientWidth - computedStyle[RIGHT] - computedStyle[LEFT];
      }
      else if(fixedLeft) {
        x2 = x + computedStyle[LEFT];
        if(width[1] !== AUTO) {
          w2 = this.__calSize(width, clientWidth, true);
        }
      }
      else if(fixedRight) {
        if(width[1] !== AUTO) {
          w2 = this.__calSize(width, clientWidth, true);
        }
        else {
          onlyRight = true;
        }
        x2 = x + clientWidth - computedStyle[RIGHT] - (w2 || 0);
        // 右对齐有尺寸时还需减去margin/border/padding的
        x2 -= computedStyle[MARGIN_LEFT];
        x2 -= computedStyle[MARGIN_RIGHT];
        x2 -= computedStyle[PADDING_LEFT];
        x2 -= computedStyle[PADDING_RIGHT];
        x2 -= computedStyle[BORDER_LEFT_WIDTH];
        x2 -= computedStyle[BORDER_RIGHT_WIDTH];
      }
      else {
        x2 = x + paddingLeft;
        if(width[1] !== AUTO) {
          w2 = this.__calSize(width, clientWidth, true);
        }
      }
      // top/bottom/height优先级同上
      if(fixedTop && fixedBottom) {
        y2 = y + computedStyle[TOP];
        h2 = clientHeight - computedStyle[TOP] - computedStyle[BOTTOM];
      }
      else if(fixedTop) {
        y2 = y + computedStyle[TOP];
        if(height[1] !== AUTO) {
          h2 = this.__calSize(height, clientHeight, true);
        }
      }
      else if(fixedBottom) {
        if(height[1] !== AUTO) {
          h2 = this.__calSize(height, clientHeight, true);
        }
        else {
          onlyBottom = true;
        }
        y2 = y + clientHeight - computedStyle[BOTTOM] - (h2 || 0);
        // 底对齐有尺寸时y值还需减去margin/border/padding的
        y2 -= computedStyle[MARGIN_TOP];
        y2 -= computedStyle[MARGIN_BOTTOM];
        y2 -= computedStyle[PADDING_TOP];
        y2 -= computedStyle[PADDING_BOTTOM];
        y2 -= computedStyle[BORDER_TOP_WIDTH];
        y2 -= computedStyle[BORDER_BOTTOM_WIDTH];
      }
      // 未声明y的找到之前的流布局child，紧随其下
      else {
        y2 = y + paddingTop;
        let prev = item.prev;
        while(prev) {
          // 以前面的flow的最近的prev末尾为准
          if(prev instanceof Text || prev.computedStyle[POSITION] !== 'absolute') {
            y2 = prev.y + prev.outerHeight;
            break;
          }
          prev = prev.prev;
        }
        if(height[1] !== AUTO) {
          h2 = this.__calSize(height, clientHeight, true);
        }
      }
      // onlyRight时做的布局其实是以那个点位为left/top布局然后offset，limit要特殊计算，从本点向左侧为边界
      let widthLimit = onlyRight ? x2 - x : clientWidth + x - x2;
      // onlyBottom相同，正常情况是左上到右下的尺寸限制
      let heightLimit = onlyBottom ? y2 - y : clientHeight + y - y2;
      // 未直接或间接定义尺寸，取特殊孩子宽度的最大值，同时不能超限
      if(w2 === undefined) {
        item.__layout({
          x: x2,
          y: y2,
          w: widthLimit,
          h: heightLimit,
          isUpright: data.isUpright, // 父亲的
        }, true, false);
        widthLimit = item.outerWidth;
      }
      item.__layout({
        x: x2,
        y: y2,
        w: widthLimit,
        h: heightLimit,
        w2, // left+right这种等于有宽度，但不能修改style，继续传入到__preLayout中特殊对待
        h2,
        isUpright: data.isUpright,
      }, false, false);
      if(onlyRight) {
        item.__offsetX(-item.outerWidth, true);
      }
      if(onlyBottom) {
        item.__offsetY(-item.outerHeight, true);
      }
    });
    // 递归进行，遇到absolute/relative/component的设置新容器
    children.forEach(item => {
      if(target) {
        // 传入target局部布局更新，这时候如果是Component引发的，当setState时是Cp自身，当layout时是sr
        let node = item;
        if(node instanceof Component) {
          node = item.shadowRoot;
        }
        // 所以得2个都对比
        if(target !== node && target !== item) {
          return;
        }
      }
      if(item instanceof Dom) {
        item.__layoutAbs(isRelativeOrAbsolute(item) ? item : container, data);
      }
      else if(item instanceof Component) {
        let sr = item.shadowRoot;
        if(sr instanceof Dom) {
          sr.__layoutAbs(sr, data);
        }
      }
    });
    // 根节点自己特殊执行，不在layout统一
    this.__execAr();
  }

  render(renderMode, lv, ctx, cache, dx, dy) {
    let res = super.render(renderMode, lv, ctx, cache, dx, dy);
    let ep = this.__ellipsis;
    if(ep) {
      ep.render(renderMode, lv, res.ctx, cache, dx, dy)
    }
    if(renderMode === SVG) {
      this.virtualDom.type = 'dom';
    }
    return res;
  }

  __destroy() {
    if(this.isDestroyed) {
      return;
    }
    this.children.forEach(child => {
      // 有可能为空，因为diff过程中相同的cp被移到新的vd中，老的防止destroy设null
      if(child) {
        child.__destroy();
      }
    });
    if(this.__ellipsis) {
      this.__ellipsis.__destroy();
    }
    super.__destroy();
  }

  __emitEvent(e, force) {
    if(force) {
      return super.__emitEvent(e, force);
    }
    let { isDestroyed, computedStyle, isMask } = this;
    if(isDestroyed || computedStyle[DISPLAY] === 'none' || e.__stopPropagation || isMask) {
      return;
    }
    // 检查perspective嵌套状态，自身有perspective则设置10位，自身有transform的p矩阵则设置01位
    // if(computedStyle[PERSPECTIVE]) {
    //   perspectiveNest++;
    // }
    // if(tf.isPerspectiveMatrix(computedStyle[TRANSFORM])) {
    //   perspectiveTfNest++;
    // }
    // overflow:hidden时还需要判断是否超出范围外，如果是则无效
    if(computedStyle[OVERFLOW] === 'hidden' && !this.willResponseEvent(e, true)) {
      return;
    }
    // 找到对应的callback
    let { event: { type } } = e;
    let { listener, zIndexChildren } = this;
    let cb;
    if(listener.hasOwnProperty(type)) {
      cb = listener[type];
    }
    // child触发则parent一定触发
    for(let i = zIndexChildren.length - 1; i >=0; i--) {
      let child = zIndexChildren[i];
      if(child instanceof Xom
        || child instanceof Component && child.shadowRoot instanceof Xom) {
        if(child.__emitEvent(e)) {
          // 孩子阻止冒泡
          if(e.__stopPropagation) {
            return;
          }
          if(isFunction(cb) && !e.__stopImmediatePropagation) {
            cb.call(this, e);
          }
          return true;
        }
      }
    }
    // child不触发再看自己
    return super.__emitEvent(e);
  }

  // 深度遍历执行所有子节点，包含自己，如果cb返回true，提前跳出不继续深度遍历
  __deepScan(cb, options) {
    if(super.__deepScan(cb, options)) {
      return;
    }
    this.children.forEach(node => {
      node.__deepScan(cb, options);
    });
  }

  appendChild(json, cb) {
    let self = this;
    if(!isNil(json) && !self.isDestroyed) {
      let { root, host } = self;
      if([$$type.TYPE_VD, $$type.TYPE_GM, $$type.TYPE_CP].indexOf(json.$$type) > -1) {
        if(json.vd) {
          root.delRefreshTask(json.vd.__task);
          json.vd.remove();
        }
        let vd;
        if($$type.TYPE_CP === json.$$type) {
          vd = builder.initCp2(json, root, host, self);
        }
        else {
          vd = builder.initDom(json, root, host, self);
        }
        root.addRefreshTask(vd.__task = {
          __before() {
            vd.__task = null; // 清除在before，防止after的回调增加新的task误删
            self.__json.children.push(json);
            let len = self.children.length;
            if(len) {
              let last = self.children[len - 1];
              last.__next = vd;
              vd.__prev = last;
            }
            self.children.push(vd);
            self.__zIndexChildren = null;
            // 刷新前统一赋值，由刷新逻辑计算最终值避免优先级覆盖问题
            let res = {};
            res[UPDATE_NODE] = vd;
            res[UPDATE_FOCUS] = level.REFLOW;
            res[UPDATE_ADD_DOM] = true;
            res[UPDATE_CONFIG] = vd.__config;
            root.__addUpdate(vd, vd.__config, root, root.__config, res);
          },
          __after(diff) {
            if(isFunction(cb)) {
              cb.call(vd, diff);
            }
          },
        });
      }
      else {
        throw new Error('Invalid parameter in appendChild.');
      }
    }
  }

  prependChild(json, cb) {
    let self = this;
    if(!isNil(json) && !self.isDestroyed) {
      let { root, host } = self;
      if([$$type.TYPE_VD, $$type.TYPE_GM, $$type.TYPE_CP].indexOf(json.$$type) > -1) {
        if(json.vd) {
          root.delRefreshTask(json.vd.__task);
          json.vd.remove();
        }
        let vd;
        if($$type.TYPE_CP === json.$$type) {
          vd = builder.initCp2(json, root, host, self);
        }
        else {
          vd = builder.initDom(json, root, host, self);
        }
        root.addRefreshTask(vd.__task = {
          __before() {
            vd.__task = null;
            self.__json.children.unshift(json);
            let len = self.children.length;
            if(len) {
              let first = self.children[0];
              first.__prev = vd;
              vd.__next = first;
            }
            self.children.unshift(vd);
            self.__zIndexChildren = null;
            // 刷新前统一赋值，由刷新逻辑计算最终值避免优先级覆盖问题
            let res = {};
            res[UPDATE_NODE] = vd;
            res[UPDATE_FOCUS] = level.REFLOW;
            res[UPDATE_ADD_DOM] = true;
            res[UPDATE_CONFIG] = vd.__config;
            root.__addUpdate(vd, vd.__config, root, root.__config, res);
          },
          __after(diff) {
            if(isFunction(cb)) {
              cb.call(vd, diff);
            }
          },
        });
      }
      else {
        throw new Error('Invalid parameter in prependChild.');
      }
    }
  }

  insertBefore(json, cb) {
    let self = this;
    if(!isNil(json) && !self.isDestroyed && self.domParent) {
      let { root, domParent } = self;
      let host = domParent.hostRoot;
      if([$$type.TYPE_VD, $$type.TYPE_GM, $$type.TYPE_CP].indexOf(json.$$type) > -1) {
        if(json.vd) {
          root.delRefreshTask(json.vd.__task);
          json.vd.remove();
        }
        let vd;
        if($$type.TYPE_CP === json.$$type) {
          vd = builder.initCp2(json, root, host, domParent);
        }
        else {
          vd = builder.initDom(json, root, host, domParent);
        }
        root.addRefreshTask(vd.__task = {
          __before() {
            vd.__task = null;
            let i = 0, has, __json = domParent.__json, children = __json.children, len = children.length;
            let pJson = self.isShadowRoot ? self.hostRoot.__json : self.__json;
            for(; i < len; i++) {
              if(children[i] === pJson) {
                has = true;
                break;
              }
            }
            if(!has) {
              throw new Error('InsertBefore exception.');
            }
            // 插入注意开头位置处理
            if(i) {
              children.splice(i, 0, json);
              vd.__next = self;
              vd.__prev = self.__prev;
              self.__prev = vd;
              domParent.children.splice(i, 0, vd);
            }
            else {
              if(len) {
                let first = domParent.children[0];
                first.__prev = vd;
                vd.__next = first;
              }
              children.unshift(json);
              domParent.children.unshift(vd);
            }
            domParent.__zIndexChildren = null;
            // 刷新前统一赋值，由刷新逻辑计算最终值避免优先级覆盖问题
            let res = {};
            res[UPDATE_NODE] = vd;
            res[UPDATE_FOCUS] = level.REFLOW;
            res[UPDATE_ADD_DOM] = true;
            res[UPDATE_CONFIG] = vd.__config;
            root.__addUpdate(vd, vd.__config, root, root.__config, res);
          },
          __after(diff) {
            if(isFunction(cb)) {
              cb.call(vd, diff);
            }
          },
        });
      }
      else {
        throw new Error('Invalid parameter in insertBefore.');
      }
    }
  }

  insertAfter(json, cb) {
    let self = this;
    if(!isNil(json) && !self.isDestroyed && self.domParent) {
      let { root, domParent } = self;
      let host = domParent.hostRoot;
      if([$$type.TYPE_VD, $$type.TYPE_GM, $$type.TYPE_CP].indexOf(json.$$type) > -1) {
        if(json.vd) {
          root.delRefreshTask(json.vd.__task);
          json.vd.remove();
        }
        let vd;
        if($$type.TYPE_CP === json.$$type) {
          vd = builder.initCp2(json, root, host, domParent);
        }
        else {
          vd = builder.initDom(json, root, host, domParent);
        }
        root.addRefreshTask(vd.__task = {
          __before() {
            vd.__task = null;
            let i = 0, has, __json = domParent.__json, children = __json.children, len = children.length;
            let pJson = self.isShadowRoot ? self.hostRoot.__json : self.__json;
            for(; i < len; i++) {
              if(children[i] === pJson) {
                has = true;
                break;
              }
            }
            if(!has) {
              throw new Error('insertAfter exception.');
            }
            // 插入注意末尾位置处理
            if(i < len - 1) {
              children.splice(i + 1, 0, json);
              vd.__prev = self;
              vd.__next = self.__next;
              self.__next = vd;
              domParent.children.splice(i + 1, 0, vd);
            }
            else {
              if(len) {
                let last = domParent.children[len - 1];
                last.__next = vd;
                vd.__prev = last;
              }
              children.push(json);
              domParent.children.push(vd);
            }
            domParent.__zIndexChildren = null;
            // 刷新前统一赋值，由刷新逻辑计算最终值避免优先级覆盖问题
            let res = {};
            res[UPDATE_NODE] = vd;
            res[UPDATE_FOCUS] = level.REFLOW;
            res[UPDATE_ADD_DOM] = true;
            res[UPDATE_CONFIG] = vd.__config;
            root.__addUpdate(vd, vd.__config, root, root.__config, res);
          },
          __after(diff) {
            if(isFunction(cb)) {
              cb.call(vd, diff);
            }
          },
        });
      }
      else {
        throw new Error('Invalid parameter in insertAfter.');
      }
    }
  }

  removeChild(target, cb) {
    if(target.parent === this && (target instanceof Xom || target instanceof Component)) {
      if(this.isDestroyed) {
        inject.warn('Remove parent is destroyed.');
        if(isFunction(cb)) {
          cb();
        }
        return;
      }
      target.remove(cb);
    }
    else {
      throw new Error('Invalid parameter in removeChild.');
    }
  }

  get children() {
    return this.__children;
  }

  get flowChildren() {
    return this.children.filter(item => {
      if(item instanceof Component) {
        item = item.shadowRoot;
      }
      return item instanceof Text || item.currentStyle[POSITION] !== 'absolute';
    });
  }

  get absChildren() {
    return this.children.filter(item => {
      if(item instanceof Component) {
        item = item.shadowRoot;
      }
      return item instanceof Xom && item.currentStyle[POSITION] === 'absolute';
    });
  }

  get zIndexChildren() {
    return this.__zIndexChildren;
  }

  get lineBoxManager() {
    return this.__lineBoxManager;
  }

  get baseline() {
    let {
      [MARGIN_TOP]: marginTop,
      [BORDER_TOP_WIDTH]: borderTopWidth,
      [PADDING_TOP]: paddingTop,
      [WRITING_MODE]: writingMode,
    } = this.computedStyle;
    if(!this.lineBoxManager || !this.lineBoxManager.size
      || writingMode.indexOf('vertical') === 0) {
      return this.offsetHeight;
    }
    return marginTop + borderTopWidth + paddingTop + this.lineBoxManager.baseline;
  }

  get firstBaseline() {
    if(!this.lineBoxManager || !this.lineBoxManager.size) {
      return this.offsetHeight;
    }
    let {
      [MARGIN_TOP]: marginTop,
      [BORDER_TOP_WIDTH]: borderTopWidth,
      [PADDING_TOP]: paddingTop,
    } = this.computedStyle;
    return marginTop + borderTopWidth + paddingTop + this.lineBoxManager.firstBaseline;
  }

  get verticalBaseline() {
    if(!this.lineBoxManager || !this.lineBoxManager.size) {
      return 0;
    }
    let {
      [MARGIN_LEFT]: marginLeft,
      [BORDER_LEFT_WIDTH]: borderLeftWidth,
      [PADDING_LEFT]: paddingLeft,
      [WRITING_MODE]: writingMode,
    } = this.computedStyle;
    if(!this.lineBoxManager || !this.lineBoxManager.size
      || writingMode.indexOf('vertical') === -1) {
      return 0;
    }
    return marginLeft + borderLeftWidth + paddingLeft + this.lineBoxManager.verticalBaseline;
  }
}

export default Dom;
