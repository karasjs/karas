import Xom from './Xom';
import Text from './Text';
import mode from './mode';
import LineBoxManager from './LineBoxManager';
import Component from './Component';
import tag from './tag';
import reset from '../style/reset';
import css from '../style/css';
import unit from '../style/unit';
import enums from '../util/enums';
import util from '../util/util';
import inject from '../util/inject';
import TextBox from './TextBox';

const {
  STYLE_KEY: {
    POSITION,
    DISPLAY,
    FONT_WEIGHT,
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
    BACKGROUND_CLIP,
  },
  NODE_KEY: {
    NODE_CURRENT_STYLE,
    NODE_STYLE,
    NODE_STRUCT,
    NODE_DOM_PARENT,
  },
  STRUCT_KEY: {
    STRUCT_NUM,
    STRUCT_LV,
    STRUCT_TOTAL,
    STRUCT_CHILD_INDEX,
    STRUCT_INDEX,
  },
} = enums;
const { AUTO, PX, PERCENT } = unit;
const { calAbsolute, isRelativeOrAbsolute } = css;

function genZIndexChildren(dom) {
  let flow = [];
  let abs = [];
  let hasMc;
  let mcHash = {};
  let needSort = false;
  let lastIndex;
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
        if(isRelativeOrAbsolute(item)) {
          // 临时变量为排序使用
          child.__iIndex = i;
          let z = child.__zIndex = item.currentStyle[Z_INDEX];
          abs.push(child);
          if(lastIndex === undefined) {
            lastIndex = z;
          }
          else if(!needSort) {
            if(z < lastIndex) {
              needSort = true;
            }
            lastIndex = z;
          }
        }
        else {
          flow.push(child);
        }
      }
      else {
        flow.push(child);
      }
    }
  });
  needSort && abs.sort(function(a, b) {
    if(a.__zIndex !== b.__zIndex) {
      return a.__zIndex - b.__zIndex;
    }
    return a.__iIndex - b.__iIndex;
  });
  let res = flow.concat(abs);
  // 将遮罩插入到对应顺序上
  if(hasMc) {
    for(let i = res.length - 1; i >= 0; i--) {
      let idx = res[i].__iIndex;
      if(mcHash.hasOwnProperty(idx)) {
        res.splice(i + 1, 0, ...mcHash[idx]);
      }
    }
  }
  return res;
}

class Dom extends Xom {
  constructor(tagName, props, children) {
    super(tagName, props);
    this.__lineGroups = []; // 一行inline元素组成的LineGroup对象后的存放列表
    let { style } = this;
    if(!style.display || !{
      flex: true,
      block: true,
      inline: true,
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
    this.__currentStyle = util.extend({}, this.__style);
    this.__children = children || [];
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
    root.__structs.splice(struct[STRUCT_INDEX] + offset, struct[STRUCT_TOTAL] + 1, ...nss);
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
   * @param w 剩余宽度
   * @param total 容器尺寸
   * @returns {number|*}
   * @private
   */
  __tryLayInline(w, total) {
    let { flowChildren, currentStyle: {
      [DISPLAY]: display,
      [WIDTH]: width,
    } } = this;
    // inline没w/h，并且尝试孩子第一个能放下即可，如果是文字就是第一个字符
    if(display === 'inline') {
      if(flowChildren.length) {
        let first = flowChildren[0];
        if(first instanceof Xom || first instanceof Component) {
          w -= first.__tryLayInline(w, total);
        }
        else {
          w -= first.firstCharWidth;
        }
      }
    }
    // inlineBlock尝试所有孩子在一行上
    else {
      if(width[1] === PX) {
        return w - width[0];
      }
      else if(width[1] === PERCENT) {
        return w - total * width[0] * 0.01;
      }
      for(let i = 0; i < flowChildren.length; i++) {
        // 当放不下时直接返回，无需继续多余的尝试计算
        if(w < 0) {
          return w;
        }
        let item = flowChildren[i];
        if(item instanceof Xom || item instanceof Component) {
          w -= item.__tryLayInline(w, total);
        }
        // text强制一行，否则非头就是放不下，需从头开始
        else {
          w -= item.textWidth;
        }
      }
    }
    return w;
  }

  // 设置y偏移值，递归包括children，此举在justify-content/margin-auto等对齐用
  __offsetX(diff, isLayout, lv) {
    super.__offsetX(diff, isLayout, lv);
    this.flowChildren.forEach(item => {
      if(item) {
        item.__offsetX(diff, isLayout, lv);
      }
    });
  }

  __offsetY(diff, isLayout, lv) {
    super.__offsetY(diff, isLayout, lv);
    this.flowChildren.forEach(item => {
      if(item) {
        item.__offsetY(diff, isLayout, lv);
      }
    });
  }

  // item的递归子节点求min/max，只考虑固定值单位，忽略百分比，同时按方向和display
  __calMinMax(isDirectionRow, data) {
    css.computeReflow(this, this.isShadowRoot);
    let min = 0;
    let max = 0;
    let { flowChildren, currentStyle } = this;
    let { x, y, w, h, lineBoxManager } = data;
    // 计算需考虑style的属性
    let {
      [DISPLAY]: display,
      [FLEX_DIRECTION]: flexDirection,
      [WIDTH]: width,
      [HEIGHT]: height,
    } = currentStyle;
    let main = isDirectionRow ? width : height;
    // 只绝对值生效，%不生效，依旧要判断
    if(main[1] === PX) {
      min = max = main[0];
    }
    else {
      if(display === 'flex') {
        let isRow = flexDirection !== 'column';
        flowChildren.forEach(item => {
          if(item instanceof Xom || item instanceof Component && item.shadowRoot instanceof Xom) {
            let { currentStyle } = item;
            // flex的child如果是inline，变为block，在计算autoBasis前就要
            if(currentStyle[DISPLAY] === 'inline' || currentStyle[DISPLAY] === 'inlineBlock') {
              currentStyle[DISPLAY] = 'block';
            }
            let [min2, max2] = item.__calMinMax(isDirectionRow, { x, y, w, h });
            if(isDirectionRow) {
              if(isRow) {
                min += min2;
                max += max2;
              }
              else {
                min = Math.max(min, min2);
                max = Math.max(max, max2);
              }
            }
            else {
              if(isRow) {
                min = Math.max(min, min2);
                max = Math.max(max, max2);
              }
              else {
                min += min2;
                max += max2;
              }
            }
          }
          else if(isDirectionRow) {
            if(isRow) {
              min += item.charWidth;
              max += item.textWidth;
            }
            else {
              min = Math.max(min, item.charWidth);
              max = Math.max(max, item.textWidth);
            }
          }
          else {
            lineBoxManager = this.__lineBoxManager = new LineBoxManager(x, y);
            item.__layout({
              x,
              y,
              w,
              h,
              lineBoxManager,
            });
            if(isRow) {
              min = Math.max(min, item.height);
              max = Math.max(max, item.height);
            }
            else {
              min += item.height;
              max += item.height;
            }
          }
        });
      }
      else if(display === 'block') {
        lineBoxManager = new LineBoxManager(x, y);
        flowChildren.forEach(item => {
          if(item instanceof Xom || item instanceof Component && item.shadowRoot instanceof Xom) {
            let [min2, max2] = item.__calMinMax(isDirectionRow, { x, y, w, h, lineBoxManager });
            if(isDirectionRow) {
              min = Math.max(min, min2);
              max = Math.max(max, max2);
            }
            else {
              min += min2;
              max += max2;
            }
          }
          else if(isDirectionRow) {
            min = Math.max(min, item.charWidth);
            max = Math.max(max, item.textWidth);
          }
          else {
            item.__layout({
              x,
              y,
              w,
              h,
              lineBoxManager,
            });
            min = Math.max(min, item.height);
            max = Math.max(max, item.height);
          }
        });
      }
      else {
        if(display === 'inlineBlock') {
          lineBoxManager = new LineBoxManager(x, y);
        }
        flowChildren.forEach(item => {
          if(item instanceof Xom || item instanceof Component && item.shadowRoot instanceof Xom) {
            let [min2, max2] = item.__calMinMax(isDirectionRow, { x, y, w, h, lineBoxManager });
            if(isDirectionRow) {
              min += min2;
              max += max2;
            }
            else {
              min = Math.max(min, min2);
              max = Math.max(max, max2);
            }
          }
          else if(isDirectionRow) {
            min = Math.max(min, item.charWidth);
            max = Math.max(max, item.textWidth);
          }
          else {
            item.__layout({
              x,
              y,
              w,
              h,
              lineBoxManager,
            });
            min = Math.max(min, item.height);
            max = Math.max(max, item.height);
          }
        });
      }
    }
    return this.__addMp(isDirectionRow, w, currentStyle, [min, max]);
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
   * 返回max为最大宽度，理想情况一排最大值，在abs时isVirtual状态参与计算，文本抵达边界才进行换行
   * @param isDirectionRow
   * @param data
   * @param isVirtual abs非固定尺寸时先进行虚拟布局标识
   * @private
   */
  __calBasis(isDirectionRow, data, isVirtual) {
    css.computeReflow(this, this.isShadowRoot);
    let b = 0;
    let min = 0;
    let max = 0;
    let { flowChildren, currentStyle } = this;
    let { x, y, w, h } = data;
    // 计算需考虑style的属性
    let {
      [DISPLAY]: display,
      [FLEX_DIRECTION]: flexDirection,
      [WIDTH]: width,
      [HEIGHT]: height,
      [FLEX_BASIS]: flexBasis,
    } = currentStyle;
    let main = isDirectionRow ? width : height;
    // basis3种情况：auto、固定、content
    let isAuto = flexBasis[1] === AUTO;
    let isFixed = flexBasis[1] === PX || flexBasis[1] === PERCENT;
    let isContent = !isAuto && !isFixed;
    let fixedSize;
    // flex的item固定basis计算
    if(isFixed) {
      if(flexBasis[1] === PX) {
        b = fixedSize = flexBasis[0];
      }
      else {
        b = fixedSize = (isDirectionRow ? w : h) * flexBasis[0] * 0.01;
      }
    }
    // 已声明主轴尺寸的，当basis是auto时为值
    else if((main[1] === PX || main[1] === PERCENT) && isAuto) {
      if(main[1] === PX) {
        b = fixedSize = main[0];
      }
      else {
        b = fixedSize = main[0] * 0.01 * (isDirectionRow ? w : h);
      }
    }
    // 非固定尺寸的basis为auto时降级为content
    else if(isAuto) {
      isContent = true;
    }
    // flex的item还是flex时
    if(display === 'flex') {
      let isRow = flexDirection !== 'column';
      flowChildren.forEach(item => {
        if(item instanceof Xom || item instanceof Component && item.shadowRoot instanceof Xom) {
          let { currentStyle } = item;
          // flex的child如果是inline，变为block，在计算autoBasis前就要
          if(currentStyle[DISPLAY] === 'inline' || currentStyle[DISPLAY] === 'inlineBlock') {
            currentStyle[DISPLAY] = 'block';
          }
          let [min2, max2] = item.__calMinMax(isDirectionRow, { x, y, w, h });
          if(isDirectionRow) {
            if(isRow) {
              min += min2;
              max += max2;
            }
            else {
              min = Math.max(min, min2);
              max = Math.max(max, max2);
            }
          }
          else {
            if(isRow) {
              min = Math.max(min, min2);
              max = Math.max(max, max2);
            }
            else {
              min += min2;
              max += max2;
            }
          }
        }
        else if(isDirectionRow) {
          if(isRow) {
            min += item.charWidth;
            max += item.textWidth;
          }
          else {
            min = Math.max(min, item.charWidth);
            max = Math.max(max, item.textWidth);
          }
        }
        else {
          let lineBoxManager = this.__lineBoxManager = new LineBoxManager(x, y);
          item.__layout({
            x,
            y,
            w,
            h,
            lineBoxManager,
          });
          if(isRow) {
            min = Math.max(min, item.height);
            max = Math.max(max, item.height);
          }
          else {
            min += item.height;
            max += item.height;
          }
        }
      });
    }
    // flex的item是block/inline时，inline也会变成block统一对待
    else {
      let lineBoxManager = this.__lineBoxManager = new LineBoxManager(x, y);
      flowChildren.forEach(item => {
        if(item instanceof Xom || item instanceof Component && item.shadowRoot instanceof Xom) {
          let [min2, max2] = item.__calMinMax(isDirectionRow, { x, y, w, h, lineBoxManager });
          if(isDirectionRow) {
            min = Math.max(min, min2);
            max = Math.max(max, max2);
          }
          else {
            min += min2;
            max += max2;
          }
        }
        else if(isDirectionRow) {
          min = Math.max(min, item.charWidth);
          max = Math.max(max, item.textWidth);
        }
        else {
          item.__layout({
            x,
            y,
            w,
            h,
            lineBoxManager,
          });
          min += item.height;
          max += item.height;
        }
      });
    }
    if(fixedSize) {
      max = Math.max(fixedSize, max);
    }
    if(isContent) {
      b = max;
    }
    // 直接item的mpb影响basis
    return this.__addMp(isDirectionRow, w, currentStyle, [b, min, max], true);
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
   * @param isVirtual abs无尺寸时提前虚拟布局计算尺寸
   * @private
   */
  __layoutBlock(data, isVirtual) {
    let { flowChildren, currentStyle, computedStyle } = this;
    let {
      [TEXT_ALIGN]: textAlign,
    } = computedStyle;
    let { fixedWidth, fixedHeight, x, y, w, h } = this.__preLayout(data);
    // abs虚拟布局需预知width，固定可提前返回
    if(fixedWidth && isVirtual) {
      this.__width = w;
      this.__ioSize(w, this.height);
      return;
    }
    // 虚线管理一个block内部的LineBox列表，使得inline的元素可以中途衔接处理折行
    // 内部维护inline结束的各种坐标来达到目的，遇到block时中断并处理换行坐标
    let lineBoxManager = this.__lineBoxManager = new LineBoxManager(x, y);
    // 因精度问题，统计宽度均从0开始累加每行，最后取最大值，仅在abs布局时isVirtual生效
    let maxW = 0;
    let cw = 0;
    // 连续block（flex相同，下面都是）的上下margin合并值记录，合并时从列表中取
    let mergeMarginBottomList = [], mergeMarginTopList = [];
    let length = flowChildren.length;
    flowChildren.forEach((item, i) => {
      let isXom = item instanceof Xom || item instanceof Component && item.shadowRoot instanceof Xom;
      let isInline = isXom && item.currentStyle[DISPLAY] === 'inline';
      let isInlineBlock = isXom && item.currentStyle[DISPLAY] === 'inlineBlock';
      let isImg = item.tagName === 'img';
      // 每次循环开始前，这次不是block的话，看之前遗留待合并margin，并重置
      if((!isXom || isInline || isInlineBlock)) {
        if(mergeMarginBottomList.length && mergeMarginTopList.length) {
          let diff = util.getMergeMarginTB(mergeMarginTopList, mergeMarginBottomList);
          if(diff) {
            y += diff;
          }
        }
        mergeMarginTopList = [];
        mergeMarginBottomList = [];
      }
      if(isXom) {
        // inline和inlineBlock的细节不同之处，ib除了w/h之外，更想像block一样占据一行
        // 比如2个inline前面占一半后面比一半多但还是会从一半开始然后第2行换行继续，但ib放不下则重开一行
        // inline和ib能互相嵌套，形成的LineBox中则是TextBox和节点混合
        if(isInlineBlock || isInline) {
          // x开头，不用考虑是否放得下直接放
          if(x === data.x) {
            item.__layout({
              x,
              y,
              w,
              h,
              lx: data.x,
              lineBoxManager, // ib内部新生成会内部判断，这里不管统一传入
            }, isVirtual);
            // inlineBlock的特殊之处，一旦w为auto且内部产生折行时，整个变成block独占一块区域，坐标计算和block一样
            if(item.__isIbFull) {
              x = data.x;
              y += item.outerHeight;
              lineBoxManager.setNotEnd();
            }
            // inline和不折行的ib，其中ib需要手动存入当前lb中
            else {
              (isInlineBlock || isImg) && lineBoxManager.addItem(item);
              x = lineBoxManager.lastX;
              y = lineBoxManager.lastY;
            }
            // abs统计宽度
            if(isVirtual) {
              maxW = Math.max(maxW, cw);
              cw = item.outerWidth;
              maxW = Math.max(maxW, cw);
            }
          }
          else {
            // 非开头先尝试是否放得下，内部判断了inline/ib，ib要考虑是否有width
            let fw = item.__tryLayInline(w + data.x - x, w);
            // 放得下继续
            if(fw >= 0) {
              item.__layout({
                x,
                y,
                w,
                h,
                lx: data.x,
                lineBoxManager,
              }, isVirtual);
              // ib放得下要么内部没有折行，要么声明了width限制，都需手动存入当前lb
              (isInlineBlock || isImg) && lineBoxManager.addItem(item);
              x = lineBoxManager.lastX;
              y = lineBoxManager.lastY;
            }
            // 放不下处理之前的lineBox，并重新开头
            else {
              x = data.x;
              y = lineBoxManager.endY;
              lineBoxManager.setNewLine();
              item.__layout({
                x,
                y,
                w,
                h,
                lx: data.x,
                lineBoxManager,
              }, isVirtual);
              // 重新开头的ib和上面开头处一样逻辑
              if(item.__isIbFull) {
                x = data.x;
                y += item.outerHeight;
                lineBoxManager.setNotEnd();
              }
              // inline和不折行的ib，其中ib需要手动存入当前lb中
              else {
                (isInlineBlock || isImg) && lineBoxManager.addItem(item);
                x = lineBoxManager.lastX;
                y = lineBoxManager.lastY;
              }
              if(isVirtual) {
                maxW = Math.max(maxW, cw);
                cw = 0;
              }
            }
            if(isVirtual) {
              cw += item.outerWidth;
              maxW = Math.max(maxW, cw);
            }
          }
        }
        // block/flex先处理之前可能遗留的最后一行LineBox，然后递归时不传lineBoxManager，其内部生成新的
        else {
          x = data.x;
          if(lineBoxManager.isEnd) {
            y = lineBoxManager.endY;
            lineBoxManager.setNotEnd();
            lineBoxManager.setNewLine();
          }
          item.__layout({
            x,
            y,
            w,
            h,
          }, isVirtual);
          let isNone = item.currentStyle[DISPLAY] === 'none';
          // 自身无内容
          let isEmptyBlock;
          if(!isNone && item.flowChildren && item.flowChildren.length === 0) {
            let {
              [MARGIN_TOP]: marginTop,
              [MARGIN_BOTTOM]: marginBottom,
              [PADDING_TOP]: paddingTop,
              [PADDING_BOTTOM]: paddingBottom,
              [HEIGHT]: height,
              [BORDER_TOP_WIDTH]: borderTopWidth,
              [BORDER_BOTTOM_WIDTH]: borderBottomWidth,
            } = item.computedStyle;
            // 无内容高度为0的空block特殊情况，记录2个margin下来等后续循环判断处理
            if(paddingTop <= 0 && paddingBottom <= 0 && height <= 0 && borderTopWidth <= 0 && borderBottomWidth <= 0) {
              mergeMarginBottomList.push(marginBottom);
              mergeMarginTopList.push(marginTop);
              isEmptyBlock = true;
            }
          }
          y += item.outerHeight;
          // absolute/flex前置虚拟计算
          if(isVirtual) {
            maxW = Math.max(maxW, item.outerWidth);
            cw = 0;
          }
          // 空block要留下轮循环看，除非是最后一个，此处非空本轮处理掉看是否要合并
          if(!isNone && !isEmptyBlock) {
            let { [MARGIN_TOP]: marginTop, [MARGIN_BOTTOM]: marginBottom } = item.computedStyle;
            // 有bottom值说明之前有紧邻的block，任意个甚至空block，自己有个top所以无需判断top
            // 如果是只有紧邻的2个非空block，也被包含在情况内，取上下各1合并
            if(mergeMarginBottomList.length) {
              mergeMarginTopList.push(marginTop);
              let diff = util.getMergeMarginTB(mergeMarginTopList, mergeMarginBottomList);
              if(diff) {
                item.__offsetY(diff, true);
                y += diff;
              }
            }
            // 同时自己保存bottom，为后续block准备
            mergeMarginTopList = [];
            mergeMarginBottomList = [marginBottom];
          }
          // 最后一个空block当是正正和负负时要处理，正负在outHeight处理了结果是0
          else if(i === length - 1) {
            let diff = util.getMergeMarginTB(mergeMarginTopList, mergeMarginBottomList);
            if(diff) {
              y += diff;
            }
          }
        }
      }
      // 文字和inline类似
      else {
        // x开头，不用考虑是否放得下直接放
        if(x === data.x) {
          item.__layout({
            x,
            y,
            w,
            h,
            lx: data.x,
            lineBoxManager,
          }, isVirtual);
          x = lineBoxManager.lastX;
          y = lineBoxManager.lastY;
          if(isVirtual) {
            maxW = Math.max(maxW, cw);
            cw = item.width;
            maxW = Math.max(maxW, cw);
          }
        }
        else {
          // 非开头先尝试是否放得下
          let fw = item.__tryLayInline(w - x + data.x);
          // 放得下继续
          if(fw >= 0) {
            item.__layout({
              x,
              y,
              w,
              h,
              lx: data.x,
              lineBoxManager,
            }, isVirtual);
            x = lineBoxManager.lastX;
            y = lineBoxManager.lastY;
          }
          // 放不下处理之前的lineBox，并重新开头
          else {
            x = data.x;
            y = lineBoxManager.endY;
            lineBoxManager.setNewLine();
            item.__layout({
              x,
              y,
              w,
              h,
              lx: data.x,
              lineBoxManager,
            }, isVirtual);
            x = lineBoxManager.lastX;
            y = lineBoxManager.lastY;
            if(isVirtual) {
              maxW = Math.max(maxW, item.width);
              cw = 0;
            }
          }
          if(isVirtual) {
            cw += item.width;
            maxW = Math.max(maxW, cw);
          }
        }
      }
    });
    // 结束后如果是以LineBox结尾，则需要设置y到这里，否则流布局中block会设置
    // 当以block换行时，新行是true，否则是false即结尾
    if(lineBoxManager.isEnd) {
      y = lineBoxManager.endY;
    }
    let tw = this.__width = (fixedWidth || !isVirtual) ? w : maxW;
    let th = this.__height = fixedHeight ? h : y - data.y;
    this.__ioSize(tw, th);
    // 非abs提前的虚拟布局，真实布局情况下最后为所有行内元素进行2个方向上的对齐
    if(!isVirtual) {
      lineBoxManager.verticalAlign();
      if(['center', 'right'].indexOf(textAlign) > -1) {
        lineBoxManager.horizonAlign(tw, textAlign);
      }
      this.__marginAuto(currentStyle, data);
    }
  }

  // 弹性布局时的计算位置
  __layoutFlex(data, isVirtual) {
    let { flowChildren, currentStyle } = this;
    let {
      [FLEX_DIRECTION]: flexDirection,
      [JUSTIFY_CONTENT]: justifyContent,
      [ALIGN_ITEMS]: alignItems,
    } = currentStyle;
    let { fixedWidth, fixedHeight, x, y, w, h } = this.__preLayout(data);
    if(fixedWidth && isVirtual) {
      this.__width = w;
      this.__ioSize(w, this.height);
      return;
    }
    let maxX = 0;
    let isDirectionRow = flexDirection !== 'column';
    // 计算伸缩基数
    let growList = [];
    let shrinkList = [];
    let basisList = [];
    let maxList = [];
    let minList = [];
    let growSum = 0;
    let shrinkSum = 0;
    let basisSum = 0;
    let maxSum = 0;
    let minSum = 0;
    flowChildren.forEach(item => {
      if(item instanceof Xom || item instanceof Component && item.shadowRoot instanceof Xom) {
        let { currentStyle, computedStyle } = item;
        // flex的child如果是inline，变为block，在计算autoBasis前就要
        if(currentStyle[DISPLAY] === 'inline' || currentStyle[DISPLAY] === 'inlineBlock') {
          currentStyle[DISPLAY] = 'block';
        }
        // abs虚拟布局计算时纵向也是看横向宽度
        let [b, min, max] = item.__calBasis(isVirtual ? true : isDirectionRow, { x, y, w, h }, isVirtual);
        if(isVirtual) {
          if(isDirectionRow) {
            maxX += max;
          }
          else {
            maxX = Math.max(maxX, max);
          }
          return;
        }
        let { [FLEX_GROW]: flexGrow, [FLEX_SHRINK]: flexShrink } = currentStyle;
        computedStyle[FLEX_BASIS] = b;
        growList.push(flexGrow);
        shrinkList.push(flexShrink);
        growSum += flexGrow;
        shrinkSum += flexShrink;
        // 根据basis不同，计算方式不同
        basisList.push(b);
        basisSum += b;
        maxList.push(max);
        maxSum += max;
        minList.push(min);
        minSum += min;
      }
      // 文本
      else {
        if(isVirtual) {
          if(isDirectionRow) {
            maxX += item.textWidth;
          }
          else {
            maxX = Math.max(maxX, item.textWidth);
          }
          return;
        }
        growList.push(0);
        shrinkList.push(1);
        shrinkSum += 1;
        if(isDirectionRow) {
          let cw = item.charWidth;
          let tw = item.textWidth;
          basisList.push(tw);
          basisSum += tw;
          maxList.push(tw);
          maxSum += tw;
          minList.push(cw);
          minSum += cw;
        }
        else {
          let lineBoxManager = this.__lineBoxManager = new LineBoxManager(x, y);
          item.__layout({
            x,
            y,
            w,
            h,
            lineBoxManager,
          });
          let h = item.height;
          basisList.push(h);
          basisSum += h;
          maxSum += h;
          minList.push(h);
          minSum += h;
        }
      }
    });
    // abs时，只需关注宽度即可，无需真正布局
    if(isVirtual) {
      let tw = this.__width = Math.min(maxX, w);
      this.__ioSize(tw, this.height);
      return;
    }
    /**
     * 计算获取子元素的b/min/max完毕后，尝试进行flex布局
     * https://www.w3.org/TR/css-flexbox-1/#layout-algorithm
     * 先计算hypothetical_main_size假想主尺寸，其为clamp(min_main_size, flex_base_size, max_main_size)
     * 随后按算法一步步来 https://zhuanlan.zhihu.com/p/354567655
     * 规范没提到mpb，item的要计算，孙子的只考虑绝对值
     * 先收集basis和假设主尺寸
     */
    let hypotheticalSum = 0, hypotheticalList = [];
    basisList.forEach((item, i) => {
      let min = minList[i], max = maxList[i];
      if(item < min) {
        hypotheticalSum += min;
        hypotheticalList.push(min);
      }
      else if(item > max) {
        hypotheticalSum += max;
        hypotheticalList.push(max);
      }
      else {
        hypotheticalSum += item;
        hypotheticalList.push(item);
      }
    });
    // 根据假设尺寸确定使用grow还是shrink，冻结非弹性项并设置target尺寸，确定剩余未冻结数量
    let isOverflow = hypotheticalSum >= (isDirectionRow ? w : h);
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
    free = Math.abs(total - free);
    // 循环，文档算法不够简练，其合并了grow和shrink，实际拆开写更简单
    let factorSum = 0;
    if(isOverflow) {
      // 计算真正的因子占比，同时得出缩小尺寸数值
      // 还需判断每个item收缩不能<min值，小于的话将无法缩小的这部分按比例分配到其它几项上
      // 于是写成一个循环，每轮先处理一遍，如果产生收缩超限的情况，将超限的设为最小值并剔除
      // 剩下的重新分配因子占比继续从头循环重来一遍
      let factorList = shrinkList.map((item, i) => {
        if(targetMainList[i] === undefined) {
          let n = item * basisList[i];
          factorSum += n;
          return n;
        }
      });
      while(true) {
        if(factorSum < 1) {
          free *= factorSum;
        }
        let needReset, factorSum2 = 0;
        factorList.forEach((item, i) => {
          if(item) {
            let r = item / factorSum;
            let s = r * free; // 需要收缩的尺寸
            let n = basisList[i] - s; // 实际尺寸
            // 比min还小设置为min，同时设0剔除
            if(n < minList[i]) {
              targetMainList[i] = minList[i];
              factorList[i] = 0;
              needReset = true;
              free -= basisList[i] - minList[i]; // 超出的尺寸也要减去实际收缩的尺寸
            }
            // 先按照没有超限的设置，正常情况直接跳出，如果有超限，记录sum2给下轮赋值重新计算
            else {
              targetMainList[i] = n;
              factorSum2 += item;
            }
          }
        });
        if(!needReset) {
          break;
        }
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
        if(factorSum < 1) {
          free *= factorSum;
        }
        let needReset, factorSum2 = 0;
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
              free -= basisList[i] - minList[i]; // 超出的尺寸也要减去实际收缩的尺寸
            }
            // 先按照没有超限的设置，正常情况直接跳出，如果有超限，记录sum2给下轮赋值重新计算
            else {
              targetMainList[i] = n;
              factorSum2 += item;
            }
          }
        });
        if(!needReset) {
          break;
        }
        factorSum = factorSum2;
      }
    }
    let maxCross = 0;
    flowChildren.forEach((item, i) => {
      let main = targetMainList[i];
      if(item instanceof Xom || item instanceof Component && item.shadowRoot instanceof Xom) {
        if(isDirectionRow) {
          item.__layout({
            x,
            y,
            w: main,
            h,
            w3: main, // w3假设固定宽度，忽略原始style中的设置
          });
        }
        else {
          item.__layout({
            x,
            y,
            w,
            h: main,
            h3: main, // 同w2
          });
        }
      }
      else {
        let lineBoxManager = this.__lineBoxManager = new LineBoxManager(x, y);
        item.__layout({
          x,
          y,
          w: isDirectionRow ? main : w,
          h: isDirectionRow ? h : main,
          lineBoxManager,
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
    // 计算主轴剩余时要用真实剩余空间而不能用伸缩剩余空间
    let diff = isDirectionRow ? w - x + data.x : h - y + data.y;
    // 主轴侧轴对齐方式
    if(!isOverflow && growSum === 0 && diff > 0) {
      let len = flowChildren.length;
      if(justifyContent === 'flexEnd' || justifyContent === 'flex-end') {
        for(let i = 0; i < len; i++) {
          let child = flowChildren[i];
          isDirectionRow ? child.__offsetX(diff, true) : child.__offsetY(diff, true);
        }
      }
      else if(justifyContent === 'center') {
        let center = diff * 0.5;
        for(let i = 0; i < len; i++) {
          let child = flowChildren[i];
          isDirectionRow ? child.__offsetX(center, true) : child.__offsetY(center, true);
        }
      }
      else if(justifyContent === 'spaceBetween' || justifyContent === 'space-between') {
        let between = diff / (len - 1);
        for(let i = 1; i < len; i++) {
          let child = flowChildren[i];
          isDirectionRow ? child.__offsetX(between * i, true) : child.__offsetY(between * i, true);
        }
      }
      else if(justifyContent === 'spaceAround' || justifyContent === 'space-around') {
        let around = diff / (len + 1);
        for(let i = 0; i < len; i++) {
          let child = flowChildren[i];
          isDirectionRow ? child.__offsetX(around * (i + 1), true) : child.__offsetY(around * (i + 1), true);
        }
      }
    }
    // 子元素侧轴伸展
    if(isDirectionRow) {
      // 父元素固定高度，子元素可能超过，侧轴最大长度取固定高度
      if(fixedHeight) {
        maxCross = h;
      }
      y += maxCross;
    }
    else {
      if(fixedWidth) {
        maxCross = w;
      }
    }
    // 侧轴对齐
    if(!isVirtual) {
      if(alignItems === 'stretch') {
        // 短侧轴的children伸张侧轴长度至相同，超过的不动，固定宽高的也不动
        flowChildren.forEach(item => {
          let { computedStyle, currentStyle: {
            [DISPLAY]: display,
            [FLEX_DIRECTION]: flexDirection,
            [ALIGN_SELF]: alignSelf,
            [WIDTH]: width,
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
            [BORDER_RIGHT_WIDTH]: borderRightWidth,
            [BORDER_LEFT_WIDTH]: borderLeftWidth,
            [MARGIN_RIGHT]: marginRight,
            [MARGIN_LEFT]: marginLeft,
            [PADDING_RIGHT]: paddingRight,
            [PADDING_LEFT]: paddingLeft,
          } = computedStyle;
          if(isDirectionRow) {
            if(alignSelf === 'flexStart' || alignSelf === 'flex-start') {}
            else if(alignSelf === 'center') {
              let diff = maxCross - item.outerHeight;
              if(diff !== 0) {
                item.__offsetY(diff * 0.5, true);
              }
            }
            else if(alignSelf === 'flexEnd' || alignSelf === 'flex-end') {
              let diff = maxCross - item.outerHeight;
              if(diff !== 0) {
                item.__offsetY(diff, true);
              }
            }
            else if(height[1] === AUTO) {
              let old = item.height;
              let v = item.__height = computedStyle[HEIGHT] = maxCross - marginTop - marginBottom - paddingTop - paddingBottom - borderTopWidth - borderBottomWidth;
              let d = v - old;
              item.__clientHeight += d;
              item.__outerHeight += d;
            }
          }
          else {
            if(alignSelf === 'flexStart' || alignSelf === 'flex-start') {}
            else if(alignSelf === 'center') {
              let diff = maxCross - item.outerWidth;
              if(diff !== 0) {
                item.__offsetX(diff * 0.5, true);
              }
            }
            else if(alignSelf === 'flexEnd' || alignSelf === 'flex-end') {
              let diff = maxCross - item.outerWidth;
              if(diff !== 0) {
                item.__offsetX(diff, true);
              }
            }
            else if(width[1] === AUTO) {
              let old = item.width;
              let v = item.__width = computedStyle[WIDTH] = maxCross - marginLeft - marginRight - paddingLeft - paddingRight - borderRightWidth - borderLeftWidth;
              let d = v - old;
              item.__clientWidth += d;
              this.__offsetWidth += d;
              item.__outerWidth += d;
            }
          }
        });
      }
      else if(alignItems === 'center') {
        flowChildren.forEach(item => {
          let { currentStyle: { [ALIGN_SELF]: alignSelf } } = item;
          if(isDirectionRow) {
            if(alignSelf === 'flexStart' || alignSelf === 'flex-start') {
            }
            else if(alignSelf === 'flexEnd' || alignSelf === 'flex-end') {
              let diff = maxCross - item.outerHeight;
              if(diff !== 0) {
                item.__offsetY(diff, true);
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
                item.__clientHeight += d;
                item.__outerHeight += d;
              }
            }
            else {
              let diff = maxCross - item.outerHeight;
              if(diff !== 0) {
                item.__offsetY(diff * 0.5, true);
              }
            }
          }
          else {
            if(alignSelf === 'flexStart' || alignSelf === 'flex-start') {
            }
            else if(alignSelf === 'flexEnd' || alignSelf === 'flex-end') {
              let diff = maxCross - item.outerWidth;
              if(diff !== 0) {
                item.__offsetX(diff, true);
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
                item.__clientWidth += d;
                this.__offsetWidth += d;
                item.__outerWidth += d;
              }
            }
            else {
              let diff = maxCross - item.outerWidth;
              if(diff !== 0) {
                item.__offsetX(diff * 0.5, true);
              }
            }
          }
        });
      }
      else if(alignItems === 'flexEnd' || alignItems === 'flex-end') {
        flowChildren.forEach(item => {
          let { currentStyle: { [ALIGN_SELF]: alignSelf } } = item;
          if(isDirectionRow) {
            if(alignSelf === 'flexStart' || alignSelf === 'flex-start') {
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
                item.__clientHeight += d;
                item.__outerHeight += d;
              }
            }
            else {
              let diff = maxCross - item.outerHeight;
              if(diff !== 0) {
                item.__offsetY(diff, true);
              }
            }
          }
          else {
            if(alignSelf === 'flexStart' || alignSelf === 'flex-start') {
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
                item.__clientWidth += d;
                this.__offsetWidth += d;
                item.__outerWidth += d;
              }
            }
            else {
              let diff = maxCross - item.outerHeight;
              if(diff !== 0) {
                item.__offsetY(diff, true);
              }
            }
          }
        });
      }
      else {
        flowChildren.forEach(item => {
          let { currentStyle: { [ALIGN_SELF]: alignSelf } } = item;
          if(isDirectionRow) {
            if(alignSelf === 'flexStart' || alignSelf === 'flex-start') {
            }
            else if(alignSelf === 'center') {
              let diff = maxCross - item.outerHeight;
              if(diff !== 0) {
                item.__offsetY(diff * 0.5, true);
              }
            }
            else if(alignSelf === 'flexEnd' || alignSelf === 'flex-end') {
              let diff = maxCross - item.outerHeight;
              if(diff !== 0) {
                item.__offsetY(diff, true);
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
                let v = item.__height = item.__height = computedStyle[HEIGHT] = maxCross - marginTop - marginBottom - paddingTop - paddingBottom - borderTopWidth - borderBottomWidth;
                let d = v - old;
                item.__clientHeight += d;
                item.__outerHeight += d;
              }
            }
          }
          else {
            if(alignSelf === 'flexStart' || alignSelf === 'flex-start') {
            }
            else if(alignSelf === 'center') {
              let diff = maxCross - item.outerWidth;
              if(diff !== 0) {
                item.__offsetX(diff * 0.5, true);
              }
            }
            else if(alignSelf === 'flexEnd' || alignSelf === 'flex-end') {
              let diff = maxCross - item.outerWidth;
              if(diff !== 0) {
                item.__offsetX(diff, true);
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
                item.__clientWidth += d;
                this.__offsetWidth += d;
                item.__outerWidth += d;
              }
            }
          }
        });
      }
    }
    let tw = this.__width = w;
    let th = this.__height = fixedHeight ? h : y - data.y;
    this.__ioSize(tw, th);
    this.__marginAuto(currentStyle, data);
  }

  /**
   * inline比较特殊，先简单顶部对其，后续还需根据vertical和lineHeight计算y偏移
   * inlineBlock复用逻辑，可以设置w/h，在混排时表现不同，inlineBlock换行限制在规定的矩形内，
   * 且ib会在没设置width且换行的时候撑满上一行，即便内部尺寸没抵达边界
   * 而inline换行则会从父容器start处开始，且首尾可能占用矩形不同
   * 嵌套inline情况十分复杂，尾部mpb空白可能产生叠加情况，因此endSpace表示自身，
   * 然后根据是否在最后一个元素进行叠加父元素的，多层嵌套则多层尾部叠加，均以最后一个元素为依据判断
   * Text获取这个叠加的endSpace值即可，无需感知是否最后一个，外层（此处）进行逻辑封装
   * @param data
   * @param isVirtual
   * @param isInline
   * @private
   */
  __layoutInline(data, isVirtual, isInline) {
    let { flowChildren, computedStyle } = this;
    let {
      [TEXT_ALIGN]: textAlign,
      [BACKGROUND_CLIP]: backgroundClip,
      [PADDING_LEFT]: paddingLeft,
      [PADDING_RIGHT]: paddingRight,
      [BORDER_LEFT_WIDTH]: borderLeftWidth,
      [BORDER_RIGHT_WIDTH]: borderRightWidth,
    } = computedStyle;
    let { fixedWidth, fixedHeight, x, y, w, h, lx, lineBoxManager, endSpace, selfEndSpace } = this.__preLayout(data, isInline);
    // abs虚拟布局需预知width，固定可提前返回
    if(fixedWidth && isVirtual) {
      this.__width = w;
      this.__ioSize(w, this.height);
      return;
    }
    // 只有inline的孩子需要考虑换行后从行首开始，而ib不需要，因此重置行首标识lx为x，末尾空白为0
    // 而inline的LineBoxManager复用最近非inline父dom的，ib需要重新生成，末尾空白叠加
    if(!isInline) {
      lineBoxManager = this.__lineBoxManager = new LineBoxManager(x, y);
      lx = x;
      endSpace = selfEndSpace = 0;
    }
    else {
      this.__lineBoxManager = lineBoxManager;
    }
    // 存LineBox里的内容列表专用，布局过程中由lineBoxManager存入，递归情况每个inline节点都保存contentBox
    let contentBoxList;
    if(isInline) {
      contentBoxList = this.__contentBoxList = [];
      lineBoxManager.pushContentBoxList(this);
    }
    // 因精度问题，统计宽度均从0开始累加每行，最后取最大值，自动w时赋值，仅在ib时统计
    let maxW = 0;
    let cw = 0;
    let isIbFull = false; // ib时不限定w情况下发生折行则撑满行，即便内容没有撑满边界
    let length = flowChildren.length;
    flowChildren.forEach((item, i) => {
      let isXom = item instanceof Xom || item instanceof Component && item.shadowRoot instanceof Xom;
      let isInline2 = isXom && item.currentStyle[DISPLAY] === 'inline';
      let isInlineBlock = isXom && item.currentStyle[DISPLAY] === 'inlineBlock';
      let isImg = item.tagName === 'img';
      // 最后一个元素会产生最后一行，叠加父元素的尾部mpb
      let isEnd = isInline && (i === length - 1);
      if(isEnd) {
        endSpace += selfEndSpace;
      }
      if(isXom) {
        if(!isInline2 && !isInlineBlock) {
          item.currentStyle[DISPLAY] = item.computedStyle[DISPLAY] = 'inlineBlock';
          isInlineBlock = true;
          inject.error('Inline can not contain block/flex');
        }
        // x开头，不用考虑是否放得下直接放
        if(x === lx) {
          item.__layout({
            x,
            y,
            w,
            h,
            lx,
            lineBoxManager,
            endSpace,
          }, isVirtual);
          // inlineBlock的特殊之处，一旦w为auto且内部产生折行时，整个变成block独占一块区域，坐标计算和block一样
          if(item.__isIbFull) {
            isInlineBlock && (this.__isIbFull = true);
            lineBoxManager.addItem(item);
            x = lx;
            y += item.outerHeight;
            lineBoxManager.setNotEnd();
          }
          // inline和不折行的ib，其中ib需要手动存入当前lb中
          else {
            (isInlineBlock || isImg) && lineBoxManager.addItem(item);
            x = lineBoxManager.lastX;
            y = lineBoxManager.lastY;
          }
          if(!isInline) {
            cw = item.outerWidth;
            maxW = Math.max(maxW, cw);
          }
        }
        else {
          // 非开头先尝试是否放得下，结尾要考虑mpb因此减去endSpace
          let fw = item.__tryLayInline(w - x + data.x, w - (isEnd ? endSpace : 0));
          // 放得下继续
          if(fw >= 0) {
            item.__layout({
              x,
              y,
              w,
              h,
              lx,
              lineBoxManager,
              endSpace,
            }, isVirtual);
            // ib放得下要么内部没有折行，要么声明了width限制，都需手动存入当前lb
            (isInlineBlock || isImg) && lineBoxManager.addItem(item);
            x = lineBoxManager.lastX;
            y = lineBoxManager.lastY;
          }
          // 放不下处理之前的lineBox，并重新开头
          else {
            x = lx;
            y = lineBoxManager.endY;
            lineBoxManager.setNewLine();
            item.__layout({
              x,
              y,
              w,
              h,
              lx,
              lineBoxManager,
              endSpace,
            }, isVirtual);
            // 重新开头的ib和上面开头处一样逻辑
            if(item.__isIbFull) {
              lineBoxManager.addItem(item);
              x = data.x;
              y += item.outerHeight;
              lineBoxManager.setNotEnd();
            }
            // inline和不折行的ib，其中ib需要手动存入当前lb中
            else {
              (isInlineBlock || isImg) && lineBoxManager.addItem(item);
              x = lineBoxManager.lastX;
              y = lineBoxManager.lastY;
            }
            if(!isInline) {
              cw = 0;
            }
          }
          if(!isInline) {
            cw += item.outerWidth;
            maxW = Math.max(maxW, cw);
          }
        }
      }
      // inline里的其它只有文本，可能开始紧跟着之前的x，也可能换行后从lx行头开始
      // 紧跟着x可能出现在前面有节点换行后第2行，此时不一定放得下，因此不能作为判断依据，开头仅有lx
      else {
        let n = lineBoxManager.size;
        if(x === lx) {
          item.__layout({
            x,
            y,
            w,
            h,
            lx,
            lineBoxManager,
            endSpace,
          }, isVirtual);
          x = lineBoxManager.lastX;
          y = lineBoxManager.lastY;
          // ib情况发生折行
          if(isInlineBlock && (lineBoxManager.size - n) > 0) {
            isIbFull = true;
          }
          cw = item.width;
          maxW = Math.max(maxW, cw);
        }
        else {
          // 非开头先尝试是否放得下，如果放得下再看是否end，加end且只有1个字时放不下要换行，否则可以放，换行由text内部做
          let fw = item.__tryLayInline(w + lx - x);
          if(fw >= 0 && isEnd && endSpace && item.content.length === 1) {
            let fw2 = fw - endSpace;
            if(fw2 < 0) {
              fw = fw2;
            }
          }
          // 放得下继续
          if(fw >= 0) {
            item.__layout({
              x,
              y,
              w,
              h,
              lx,
              lineBoxManager,
              endSpace,
            }, isVirtual);
            x = lineBoxManager.lastX;
            y = lineBoxManager.lastY;
            // 这里ib放得下一定是要么没换行要么固定宽度，所以无需判断isIbFull
          }
          // 放不下处理之前的lineBox，并重新开头
          else {
            x = lx;
            y = lineBoxManager.endY;
            lineBoxManager.setNewLine();
            item.__layout({
              x,
              y,
              w,
              h,
              lx,
              lineBoxManager,
              endSpace,
            }, isVirtual);
            x = lineBoxManager.lastX;
            y = lineBoxManager.lastY;
            // ib情况发生折行
            if(isInlineBlock && (lineBoxManager.size - n) > 0) {
              isIbFull = true;
            }
            cw = 0;
          }
          cw += item.width;
          maxW = Math.max(maxW, cw);
        }
      }
    });
    // 同block结尾，不过这里一定是lineBox结束，无需判断
    y = lineBoxManager.endY;
    // 标识ib情况同block一样占满行
    this.__isIbFull = isIbFull;
    // 元素的width在固定情况或者ibFull情况已被计算出来，否则为最大延展尺寸，inline没有固定尺寸概念
    let tw, th;
    if(isInline && this.__isRealInline()) {
      // inline最后的x要算上右侧mpb，为next行元素提供x坐标基准，同时其尺寸计算比较特殊
      if(selfEndSpace) {
        lineBoxManager.addX(selfEndSpace);
      }
      // 结束出栈contentBox，递归情况结束子inline获取contentBox，父inline继续
      lineBoxManager.popContentBoxList();
      this.__inlineSize(lineBoxManager, contentBoxList);
      tw = this.__width;
      th = this.__height;
    }
    else {
      tw = this.__width = (fixedWidth || isIbFull) ? w : maxW;
      th = this.__height = fixedHeight ? h : y - data.y;
    }
    this.__ioSize(tw, th);
    // 非abs提前虚拟布局，真实布局情况下最后为所有行内元素进行2个方向上的对齐，inline会被父级调用这里只看ib
    if(!isVirtual && !isInline) {
      lineBoxManager.verticalAlign();
      if(['center', 'right'].indexOf(textAlign) > -1) {
        lineBoxManager.horizonAlign(tw, textAlign);
      }
    }
  }

  /**
   * inline的尺寸计算非常特殊，并非一个矩形区域，而是由字体行高结合节点下多个LineBox中的内容决定，
   * 且这个尺寸又并非真实LineBox中的内容直接合并计算而来，比如包含了个更大尺寸的ib却不会计入
   * 具体方法为遍历持有的LineBox下的内容，x取两侧极值，同时首尾要考虑mpb，y值取上下极值，同样首尾考虑mpb
   * 首尾行LineBox可能不是不是占满一行，比如前后都有同行inline的情况，非首尾行则肯定占满
   * 绘制内容（如背景色）的区域也很特殊，每行LineBox根据lineHeight对齐baseLine得来，并非LineBox全部
   * 当LineBox只有直属Text时如果font没有lineGap则等价于全部，如有则需减去
   * 另外其client/offset/outer的w/h尺寸计算也很特殊，皆因首尾x方向的mpb导致
   * @param lineBoxManager
   * @param contentBoxList
   * @private
   */
  __inlineSize(lineBoxManager, contentBoxList) {
    let computedStyle = this.computedStyle;
    let {
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
    } = computedStyle;
    let baseLine = css.getBaseLine(computedStyle);
    let maxX, maxY, minX, minY, maxCX, maxCY, minCX, minCY, maxFX, maxFY, minFX, minFY, maxOX, maxOY, minOX, minOY;
    let length = contentBoxList.length;
    let lastLineBox, diff = 0;
    // 遍历contentBox，里面存的是LineBox内容，根据父LineBox引用判断是否换行
    contentBoxList.forEach((item, i) => {
      if(item.parentLineBox !== lastLineBox) {
        lastLineBox = item.parentLineBox;
        diff = lastLineBox.baseLine - baseLine;
      }
      // 非第一个除了minY不用看其它都要，minX是换行导致，而maxX在最后一个要考虑右侧mpb
      if(i) {
        minX = Math.min(minX, item.x);
        maxY = Math.max(maxY, item.y + diff + item.outerHeight + marginBottom + paddingBottom + borderBottomWidth);
        if(i === length - 1) {
          maxX = Math.max(maxX, item.x + item.outerWidth + marginRight + paddingRight + borderRightWidth);
        }
        else {
          maxX = Math.max(maxX, item.x + item.outerWidth);
        }
      }
      // 第一个初始化
      else {
        minX = item.x;
        minY = item.y + diff;
        minCX = minX - paddingLeft;
        minCY = minY - paddingTop;
        minFX = minCX - borderLeftWidth;
        minFY = minCY - borderTopWidth;
        minOX = minFX - marginLeft;
        minOY = minFY - marginTop;
        maxX = maxCX = maxFX = maxOX = item.x + item.outerWidth;
        maxY = maxCY = maxFY = maxOY = item.y + diff + item.outerHeight;
        if(i === length - 1) {
          maxCX += paddingRight;
          maxCY += paddingBottom;
          maxFX += paddingRight + borderRightWidth;
          maxFY += paddingBottom + borderBottomWidth;
          maxOX += borderRightWidth + paddingRight + marginRight
          maxOY += borderBottomWidth + paddingBottom + borderBottomWidth;
        }
      }
    });
    this.__x = minOX;
    this.__y = minOY;
    this.__width = maxX - minX;
    this.__height = maxY - minY;
    this.__sx1 = minFX;
    this.__sy1 = minFY;
    this.__sx2 = minCX;
    this.__sy2 = minCY;
    this.__sx3 = minX;
    this.__sy3 = minY;
    this.__sx4 = maxX;
    this.__sy4 = maxY;
    this.__sx5 = maxCX;
    this.__sy5 = maxCY;
    this.__sx6 = maxFX;
    this.__sy6 = maxFY;
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
      if(currentStyle[DISPLAY] === 'none') {
        item.__layoutNone();
        return;
      }
      // 先根据容器宽度计算margin/padding
      item.__mp(currentStyle, computedStyle, clientWidth);
      if(currentStyle[DISPLAY] === 'inline') {
        currentStyle[DISPLAY] = computedStyle[DISPLAY] = item.style.display = 'block';
      }
      let { [LEFT]: left, [TOP]: top, [RIGHT]: right,
        [BOTTOM]: bottom, [WIDTH]: width, [HEIGHT]: height, [DISPLAY]: display,
        [FLEX_DIRECTION]: flexDirection } = currentStyle;
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
        computedStyle[LEFT] = calAbsolute(currentStyle, 'left', left, clientWidth);
      }
      else {
        computedStyle[LEFT] = 'auto';
      }
      if(right[1] !== AUTO) {
        fixedRight = true;
        computedStyle[RIGHT] = calAbsolute(currentStyle, 'right', right, clientWidth);
      }
      else {
        computedStyle[RIGHT] = 'auto';
      }
      if(top[1] !== AUTO) {
        fixedTop = true;
        computedStyle[TOP] = calAbsolute(currentStyle, 'top', top, clientHeight);
      }
      else {
        computedStyle[TOP] = 'auto';
      }
      if(bottom[1] !== AUTO) {
        fixedBottom = true;
        computedStyle[BOTTOM] = calAbsolute(currentStyle, 'bottom', bottom, clientHeight);
      }
      else {
        computedStyle[BOTTOM] = 'auto';
      }
      // 优先级最高left+right，其次left+width，再次right+width，再次仅申明单个，最次全部auto
      if(fixedLeft && fixedRight) {
        x2 = x + computedStyle[LEFT];
        w2 = x + clientWidth - computedStyle[RIGHT] - x2;
      }
      else if(fixedLeft && width[1] !== AUTO) {
        x2 = x + computedStyle[LEFT];
        w2 = width[1] === PX ? width[0] : clientWidth * width[0] * 0.01;
      }
      else if(fixedRight && width[1] !== AUTO) {
        w2 = width[1] === PX ? width[0] : clientWidth * width[0] * 0.01;
        x2 = x + clientWidth - computedStyle[RIGHT] - w2;
        // 右对齐有尺寸时y值还需减去margin/border/padding的
        x2 -= computedStyle[MARGIN_LEFT];
        x2 -= computedStyle[MARGIN_RIGHT];
        x2 -= computedStyle[PADDING_LEFT];
        x2 -= computedStyle[PADDING_RIGHT];
        x2 -= currentStyle[BORDER_LEFT_WIDTH][0];
        x2 -= currentStyle[BORDER_RIGHT_WIDTH][0];
      }
      else if(fixedLeft) {
        x2 = x + computedStyle[LEFT];
      }
      else if(fixedRight) {
        x2 = x + clientWidth - computedStyle[RIGHT];
        onlyRight = true;
      }
      else {
        x2 = x + paddingLeft;
        if(width[1] !== AUTO) {
          w2 = width[1] === PX ? width[0] : clientWidth * width[0] * 0.01;
        }
      }
      // top/bottom/height优先级同上
      if(fixedTop && fixedBottom) {
        y2 = y + computedStyle[TOP];
        h2 = y + clientHeight - computedStyle[BOTTOM] - y2;
      }
      else if(fixedTop && height[1] !== AUTO) {
        y2 = y + computedStyle[TOP];
        h2 = height[1] === PX ? height[0] : clientHeight * height[0] * 0.01;
      }
      else if(fixedBottom && height[1] !== AUTO) {
        h2 = height[1] === PX ? height[0] : clientHeight * height[0] * 0.01;
        y2 = y + clientHeight - computedStyle[BOTTOM] - h2;
        // 底对齐有尺寸时y值还需减去margin/border/padding的
        y2 -= computedStyle[MARGIN_TOP];
        y2 -= computedStyle[MARGIN_BOTTOM];
        y2 -= computedStyle[PADDING_TOP];
        y2 -= computedStyle[PADDING_BOTTOM];
        y2 -= currentStyle[BORDER_TOP_WIDTH][0];
        y2 -= currentStyle[BORDER_BOTTOM_WIDTH][0];
      }
      else if(fixedTop) {
        y2 = y + computedStyle[TOP];
      }
      else if(fixedBottom) {
        y2 = y + clientHeight - computedStyle[BOTTOM];
        onlyBottom = true;
      }
      // 未声明y的找到之前的流布局child，紧随其下
      else {
        y2 = y;
        let prev = item.prev;
        while(prev) {
          // 目前不考虑margin合并，直接以前面的flow的最近的prev末尾为准
          if(prev instanceof Text || prev.computedStyle[POSITION] !== 'absolute') {
            y2 = prev.y + prev.outerHeight;
            break;
          }
          prev = prev.prev;
        }
        if(height[1] !== AUTO) {
          h2 = height[1] === PX ? height[0] : clientHeight * height[0] * 0.01;
        }
      }
      // 没设宽高，需手动计算获取最大宽高后，赋给样式再布局
      let needCalWidth;
      if(display === 'block' && w2 === undefined) {
        needCalWidth = true;
      }
      else if(display === 'flex') {
        if(w2 === undefined) {
          needCalWidth = true;
        }
        else if(flexDirection === 'column' && h2 === undefined) {
          needCalWidth = true;
        }
      }
      // onlyRight时做的布局其实是以那个点位为left/top布局然后offset，limit要特殊计算，从本点向左侧为边界
      let wl = onlyRight ? x2 - x : clientWidth + x - x2;
      // onlyBottom相同，正常情况是左上到右下的尺寸限制
      let hl = onlyBottom ? y2 - y : clientHeight + y - y2;
      // 未直接或间接定义尺寸，取孩子宽度最大值
      if(needCalWidth) {
        item.__layout({
          x: x2,
          y: y2,
          w: wl,
          h: hl,
        }, true, true);
        wl = item.outerWidth;
      }
      // needCalWidth传入，因为自适应尺寸上面已经计算过一次margin/padding了
      item.__layout({
        x: x2,
        y: y2,
        w: wl,
        h: hl,
        w2, // left+right这种等于有宽度，但不能修改style，继续传入到__preLayout中特殊对待
        h2,
      }, false, true);
      // item.__layoutAbs(item, data);
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
  }

  /**
   * 布局前检查继承的样式以及统计字体测量信息
   * 首次检查为整树遍历，后续检查是节点自发局部检查，不再进入
   * @param renderMode
   * @param ctx
   * @param isHost
   * @param cb
   * @private
   */
  __computeMeasure(renderMode, ctx, isHost, cb) {
    super.__computeMeasure(renderMode, ctx, isHost, cb);
    // 即便自己不需要计算，但children还要继续递归检查
    this.children.forEach(item => {
      item.__computeMeasure(renderMode, ctx, false, cb);
    });
  }

  render(renderMode, lv, ctx, defs, cache) {
    let res = super.render(renderMode, lv, ctx, defs, cache);
    if(renderMode === mode.SVG) {
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
    super.__destroy();
  }

  __emitEvent(e, force) {
    if(force) {
      return super.__emitEvent(e, force);
    }
    let { isDestroyed, computedStyle } = this;
    if(isDestroyed || computedStyle[DISPLAY] === 'none' || e.__stopPropagation) {
      return;
    }
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
          if(util.isFunction(cb) && !e.__stopImmediatePropagation) {
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

  get lineGroups() {
    return this.__lineGroups;
  }

  get lineBoxManager() {
    return this.__lineBoxManager;
  }

  get baseLine() {
    if(!this.lineBoxManager.size) {
      return this.outerHeight;
    }
    let {
      [MARGIN_TOP]: marginTop,
      [BORDER_TOP_WIDTH]: borderTopWidth,
      [PADDING_TOP]: paddingTop,
    } = this.computedStyle;
    return marginTop + borderTopWidth + paddingTop + this.lineBoxManager.baseLine;
  }

  get parentLineBox() {
    return this.__parentLineBox;
  }

  get contentBoxList() {
    return this.__contentBoxList;
  }
}

export default Dom;
