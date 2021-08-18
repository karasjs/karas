import Xom from './Xom';
import Text from './Text';
import mode from './mode';
import LineBoxManager from './LineBoxManager';
import Component from './Component';
import tag from './tag';
import reset from '../style/reset';
import css from '../style/css';
import unit from '../style/unit';
import $$type from '../util/$$type';
import enums from '../util/enums';
import util from '../util/util';
import inject from '../util/inject';
import reflow from '../refresh/reflow';
import builder from '../util/builder';
import level from '../refresh/level';

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
    WHITE_SPACE,
    LINE_HEIGHT,
    LINE_CLAMP,
    ORDER,
    FLEX_WRAP,
    ALIGN_CONTENT,
    OVERFLOW,
    FONT_SIZE,
    // PERSPECTIVE,
    // TRANSFORM,
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
    UPDATE_MEASURE,
  },
  STRUCT_KEY: {
    STRUCT_NUM,
    STRUCT_LV,
    STRUCT_TOTAL,
    STRUCT_CHILD_INDEX,
    STRUCT_INDEX,
  },
} = enums;
const { AUTO, PX, PERCENT, REM, VW, VH } = unit;
const { calAbsolute, isRelativeOrAbsolute } = css;

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

class Dom extends Xom {
  constructor(tagName, props, children) {
    super(tagName, props);
    let { style } = this;
    if(!style.display || !{
      flex: true,
      block: true,
      inline: true,
      inlineBlock: true,
      'inline-block': true,
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
    this.__flexLine = []; // flex布局多行模式时存储行
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
   * @param w 剩余宽度
   * @param total 容器尺寸
   * @returns {number|*}
   * @private
   */
  __tryLayInline(w, total) {
    let { flowChildren, currentStyle: {
      [DISPLAY]: display,
      [WIDTH]: width,
      [MARGIN_LEFT]: marginLeft,
      [MARGIN_RIGHT]: marginRight,
      [PADDING_LEFT]: paddingLeft,
      [PADDING_RIGHT]: paddingRight,
      [BORDER_LEFT_WIDTH]: borderLeftWidth,
      [BORDER_RIGHT_WIDTH]: borderRightWidth,
    } } = this;
    // inline没w/h，并且尝试孩子第一个能放下即可，如果是文字就是第一个字符
    if(display === 'inline') {
      if(flowChildren.length) {
        let first = flowChildren[0];
        if(first instanceof Component) {
          first = first.shadowRoot;
        }
        if(first instanceof Xom) {
          w = first.__tryLayInline(w, total);
        }
        else {
          w -= first.firstCharWidth;
        }
      }
    }
    // inlineBlock尝试所有孩子在一行上
    else {
      if(width[1] === PX) {
        w -= width[0];
      }
      else if(width[1] === PERCENT) {
        w -= total * width[0] * 0.01;
      }
      else if(width[1] === REM) {
        w -= width[0] * this.root.computedStyle[FONT_SIZE];
      }
      else if(width[1] === VW) {
        w -= width[0] * this.root.width * 0.01;
      }
      else if(width[1] === VH) {
        w -= width[0] * this.root.height * 0.01;
      }
      else {
        for(let i = 0; i < flowChildren.length; i++) {
          // 当放不下时直接返回，无需继续多余的尝试计算
          if(w < 0) {
            return w;
          }
          let item = flowChildren[i];
          if(item instanceof Component) {
            item = item.shadowRoot;
          }
          if(item instanceof Xom) {
            w = item.__tryLayInline(w, total);
          }
          // text强制一行，否则非头就是放不下，需从头开始
          else {
            w -= item.textWidth;
          }
        }
      }
      // ib要减去末尾mpb
      if(marginRight[1] === PX) {
        w -= marginRight[0];
      }
      else if(marginRight[1] === PERCENT) {
        w -= marginRight[0] * total * 0.01;
      }
      else if(marginRight[1] === REM) {
        w -= marginRight[0] * this.root.computedStyle[FONT_SIZE];
      }
      else if(marginRight[1] === VW) {
        w -= marginRight[0] * this.root.width * 0.01;
      }
      else if(marginRight[1] === VH) {
        w -= marginRight[0] * this.root.height * 0.01;
      }
      if(paddingRight[1] === PX) {
        w -= paddingRight[0];
      }
      else if(paddingRight[1] === PERCENT) {
        w -= paddingRight[0] * total * 0.01;
      }
      else if(paddingRight[1] === REM) {
        w -= paddingRight[0] * this.root.computedStyle[FONT_SIZE];
      }
      else if(paddingRight[1] === VW) {
        w -= paddingRight[0] * this.root.width * 0.01;
      }
      else if(paddingRight[1] === VH) {
        w -= paddingRight[0] * this.root.height * 0.01;
      }
      if(borderRightWidth[1] === PX) {
        w -= borderRightWidth[0];
      }
      else if(borderRightWidth[1] === REM) {
        w -= borderRightWidth[0] * this.root.computedStyle[FONT_SIZE];
      }
      else if(borderRightWidth[1] === VW) {
        w -= borderRightWidth[0] * this.root.width * 0.01;
      }
      else if(borderRightWidth[1] === VH) {
        w -= borderRightWidth[0] * this.root.height * 0.01;
      }
    }
    // 还要减去开头的mpb
    if(marginLeft[1] === PX) {
      w -= marginLeft[0];
    }
    else if(marginLeft[1] === PERCENT) {
      w -= marginLeft[0] * total * 0.01;
    }
    else if(marginLeft[1] === REM) {
      w -= marginLeft[0] * this.root.computedStyle[FONT_SIZE];
    }
    else if(marginLeft[1] === VW) {
      w -= marginLeft[0] * this.root.width * 0.01;
    }
    else if(marginLeft[1] === VH) {
      w -= marginLeft[0] * this.root.height * 0.01;
    }
    if(paddingLeft[1] === PX) {
      w -= paddingLeft[0];
    }
    else if(paddingLeft[1] === PERCENT) {
      w -= paddingLeft[0] * total * 0.01;
    }
    else if(paddingLeft[1] === REM) {
      w -= paddingLeft[0] * this.root.computedStyle[FONT_SIZE];
    }
    else if(paddingLeft[1] === VW) {
      w -= paddingLeft[0] * this.root.width * 0.01;
    }
    else if(paddingLeft[1] === VH) {
      w -= paddingLeft[0] * this.root.height * 0.01;
    }
    if(borderLeftWidth[1] === PX) {
      w -= borderLeftWidth[0];
    }
    else if(borderLeftWidth[1] === REM) {
      w -= borderLeftWidth[0] * this.root.computedStyle[FONT_SIZE];
    }
    else if(borderLeftWidth[1] === VW) {
      w -= borderLeftWidth[0] * this.root.width * 0.01;
    }
    else if(borderLeftWidth[1] === VH) {
      w -= borderLeftWidth[0] * this.root.height * 0.01;
    }
    return w;
  }

  // 设置y偏移值，递归包括children，此举在justify-content/margin-auto等对齐用
  __offsetX(diff, isLayout, lv) {
    super.__offsetX(diff, isLayout, lv);
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
    if(isLayout && !this.__config[NODE_IS_INLINE] && this.lineBoxManager) {
      this.lineBoxManager.__offsetY(diff);
    }
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
    let { flowChildren, currentStyle, computedStyle } = this;
    let { x, y, w, h, lineBoxManager } = data;
    // 计算需考虑style的属性
    let {
      [DISPLAY]: display,
      [FLEX_DIRECTION]: flexDirection,
      [WIDTH]: width,
      [HEIGHT]: height,
    } = currentStyle;
    let {
      [LINE_HEIGHT]: lineHeight,
    } = computedStyle;
    let main = isDirectionRow ? width : height;
    // 只绝对值生效，%不生效，依旧要判断
    if(main[1] === PX) {
      min = max = main[0];
    }
    else if(main[1] === REM) {
      min = max = main[0] * this.root.computedStyle[FONT_SIZE];
    }
    else if(main[1] === VW) {
      min = max = main[0] * this.root.width * 0.01;
    }
    else if(main[1] === VH) {
      min = max = main[0] * this.root.height * 0.01;
    }
    else {
      if(display === 'flex') {
        let isRow = flexDirection !== 'column';
        flowChildren = genOrderChildren(flowChildren);
        flowChildren.forEach(item => {
          if(item instanceof Xom || item instanceof Component && item.shadowRoot instanceof Xom) {
            let { currentStyle } = item;
            // flex的child如果是inline，变为block，在计算autoBasis前就要
            if(currentStyle[DISPLAY] !== 'block' && currentStyle[DISPLAY] !== 'flex') {
              currentStyle[DISPLAY] = 'block';
            }
            let [, [min2, max2]] = item.__calMinMax(isDirectionRow, { x, y, w, h });
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
            let lineBoxManager = new LineBoxManager(x, y, lineHeight, css.getBaseLine(computedStyle));
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
        let countMin = 0, countMax = 0;
        let lineBoxManager = new LineBoxManager(x, y, lineHeight, css.getBaseLine(computedStyle));
        let length = flowChildren.length;
        flowChildren.forEach((item, i) => {
          if(item instanceof Xom || item instanceof Component && item.shadowRoot instanceof Xom) {
            let [display, [min2, max2]] = item.__calMinMax(isDirectionRow, { x, y, w, h, lineBoxManager });
            // 块级查看之前是否有行内元素，设置换行
            if((display === 'block' || display === 'flex') && lineBoxManager.isEnd) {
              lineBoxManager.setNotEnd();
              lineBoxManager.setNewLine();
            }
            if(isDirectionRow) {
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
              if(display === 'block' || display === 'flex') {
                // 之前行积累的极值，并清空
                min += countMin;
                max += countMax;
                countMin = countMax = 0;
                // 本身的
                min += min2;
                max += max2;
              }
              else {
                // 行内取极值，最后一个记得应用
                countMin = Math.max(countMin, min2);
                countMax = Math.max(countMax, max2);
                if(i === length - 1) {
                  min += countMin;
                  max += countMax;
                }
              }
            }
          }
          else if(isDirectionRow) {
            countMin += item.charWidth;
            countMax += item.textWidth;
            min = Math.max(min, countMin);
            max = Math.max(max, countMax);
          }
          else {
            item.__layout({
              x,
              y,
              w,
              h,
              lineBoxManager,
            });
            // 行内取极值，最后一个记得应用
            countMin = Math.max(countMin, item.height);
            countMax = Math.max(countMax, item.height);
            if(i === length - 1) {
              min += countMin;
              max += countMax;
            }
          }
        });
      }
      else {
        if(display === 'inlineBlock' || display === 'inline-block') {
          lineBoxManager = new LineBoxManager(x, y, lineHeight, css.getBaseLine(computedStyle));
        }
        flowChildren.forEach(item => {
          if(item instanceof Xom || item instanceof Component && item.shadowRoot instanceof Xom) {
            let [, [min2, max2]] = item.__calMinMax(isDirectionRow, { x, y, w, h, lineBoxManager });
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
            min += item.charWidth;
            max += item.textWidth;
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
    return [display, this.__addMp(isDirectionRow, w, currentStyle, [min, max])];
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
    let { flowChildren, currentStyle, computedStyle } = this;
    let { x, y, w, h } = data;
    // 计算需考虑style的属性
    let {
      [DISPLAY]: display,
      [FLEX_DIRECTION]: flexDirection,
      [WIDTH]: width,
      [HEIGHT]: height,
      [FLEX_BASIS]: flexBasis,
    } = currentStyle;
    let {
      [LINE_HEIGHT]: lineHeight,
    } = computedStyle;
    let main = isDirectionRow ? width : height;
    // basis3种情况：auto、固定、content
    let isAuto = flexBasis[1] === AUTO;
    let isFixed = [PX, PERCENT, REM, VW, VH].indexOf(flexBasis[1]) > -1;
    let isContent = !isAuto && !isFixed;
    let fixedSize;
    // flex的item固定basis计算
    if(isFixed) {
      if(flexBasis[1] === PX) {
        b = fixedSize = flexBasis[0];
      }
      else if(flexBasis[1] === PERCENT) {
        b = fixedSize = (isDirectionRow ? w : h) * flexBasis[0] * 0.01;
      }
      else if(flexBasis[1] === REM) {
        b = fixedSize = flexBasis[0] * this.root.computedStyle[FONT_SIZE];
      }
      else if(flexBasis[1] === VW) {
        b = fixedSize = flexBasis[0] * this.root.width * 0.01;
      }
      else if(flexBasis[1] === VH) {
        b = fixedSize = flexBasis[0] * this.root.height * 0.01;
      }
    }
    // 已声明主轴尺寸的，当basis是auto时为值
    else if(([PX, PERCENT, REM, VW, VH].indexOf(main[1]) > -1) && isAuto) {
      if(main[1] === PX) {
        b = fixedSize = main[0];
      }
      else if(main[1] === PERCENT) {
        b = fixedSize = main[0] * 0.01 * (isDirectionRow ? w : h);
      }
      else if(main[1] === REM) {
        b = fixedSize = main[0] * this.root.computedStyle[FONT_SIZE];
      }
      else if(main[1] === VW) {
        b = fixedSize = main[0] * this.root.width * 0.01;
      }
      else if(main[1] === VH) {
        b = fixedSize = main[0] * this.root.height * 0.01;
      }
    }
    // 非固定尺寸的basis为auto时降级为content
    else if(isAuto) {
      isContent = true;
    }
    // flex的item还是flex时
    if(display === 'flex') {
      let isRow = flexDirection !== 'column';
      flowChildren = genOrderChildren(flowChildren);
      flowChildren.forEach(item => {
        if(item instanceof Xom || item instanceof Component && item.shadowRoot instanceof Xom) {
          let { currentStyle } = item;
          // flex的child如果是inline，变为block，在计算autoBasis前就要
          if(currentStyle[DISPLAY] !== 'block' && currentStyle[DISPLAY] !== 'flex') {
            currentStyle[DISPLAY] = 'block';
          }
          let [, [min2, max2]] = item.__calMinMax(isDirectionRow, { x, y, w, h });
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
          let lineBoxManager = new LineBoxManager(x, y, lineHeight, css.getBaseLine(computedStyle));
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
      let countMin = 0, countMax = 0;
      let lineBoxManager = this.__lineBoxManager = new LineBoxManager(x, y, lineHeight, css.getBaseLine(computedStyle));
      let length = flowChildren.length;
      flowChildren.forEach((item, i) => {
        if(item instanceof Xom || item instanceof Component && item.shadowRoot instanceof Xom) {
          let [display, [min2, max2]] = item.__calMinMax(isDirectionRow, { x, y, w, h, lineBoxManager });
          // 块级查看之前是否有行内元素，设置换行
          if((display === 'block' || display === 'flex') && lineBoxManager.isEnd) {
            lineBoxManager.setNotEnd();
            lineBoxManager.setNewLine();
          }
          if(isDirectionRow) {
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
            if(display === 'block' || display === 'flex') {
              // 之前行积累的极值，并清空
              min += countMin;
              max += countMax;
              countMin = countMax = 0;
              // 本身的
              min += min2;
              max += max2;
            }
            else {
              // 行内取极值，最后一个记得应用
              countMin = Math.max(countMin, min2);
              countMax = Math.max(countMax, max2);
              if(i === length - 1) {
                min += countMin;
                max += countMax;
              }
            }
          }
        }
        else if(isDirectionRow) {
          countMin += item.charWidth;
          countMax += item.textWidth;
          min = Math.max(min, countMin);
          max = Math.max(max, countMax);
        }
        else {
          item.__layout({
            x,
            y,
            w,
            h,
            lineBoxManager,
          });
          // 行内取极值，最后一个记得应用
          countMin = Math.max(countMin, item.height);
          countMax = Math.max(countMax, item.height);
          if(i === length - 1) {
            min += countMin;
            max += countMax;
          }
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
    let { fixedWidth, fixedHeight, x, y, w, h } = this.__preLayout(data);
    // abs虚拟布局需预知width，固定可提前返回
    if(fixedWidth && isVirtual) {
      this.__width = w;
      this.__ioSize(w, this.height);
      return;
    }
    let {
      [TEXT_ALIGN]: textAlign,
      [WHITE_SPACE]: whiteSpace,
      [LINE_CLAMP]: lineClamp,
      [LINE_HEIGHT]: lineHeight,
    } = computedStyle;
    // 只有>=1的正整数才有效
    lineClamp = lineClamp || 0;
    let lineClampCount = 0;
    // 虚线管理一个block内部的LineBox列表，使得inline的元素可以中途衔接处理折行
    // 内部维护inline结束的各种坐标来达到目的，遇到block时中断并处理换行坐标
    let lineBoxManager = this.__lineBoxManager = new LineBoxManager(x, y, lineHeight, css.getBaseLine(computedStyle));
    // 因精度问题，统计宽度均从0开始累加每行，最后取最大值，仅在abs布局时isVirtual生效
    let maxW = 0;
    let cw = 0;
    // 连续block（flex相同，下面都是）的上下margin合并值记录，合并时从列表中取
    let mergeMarginBottomList = [], mergeMarginTopList = [];
    let length = flowChildren.length;
    flowChildren.forEach((item, i) => {
      let isXom = item instanceof Xom || item instanceof Component && item.shadowRoot instanceof Xom;
      let isInline = isXom && item.currentStyle[DISPLAY] === 'inline';
      let isInlineBlock = isXom && ['inlineBlock', 'inline-block'].indexOf(item.currentStyle[DISPLAY]) > -1;
      let isImg = item.tagName === 'img';
      // 每次循环开始前，这次不是block的话，看之前遗留待合并margin，并重置
      if((!isXom || isInline || isInlineBlock)) {
        if(mergeMarginBottomList.length && mergeMarginTopList.length) {
          let diff = reflow.getMergeMarginTB(mergeMarginTopList, mergeMarginBottomList);
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
          if(x === data.x || isInline && whiteSpace === 'nowrap') {
            item.__layout({
              x,
              y,
              w,
              h,
              lx: data.x,
              lineBoxManager, // ib内部新生成会内部判断，这里不管统一传入
              lineClamp,
              lineClampCount,
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
            // 放得下继续，奇怪的精度问题，加上阈值
            if(fw >= (-1e-10)) {
              item.__layout({
                x,
                y,
                w,
                h,
                lx: data.x,
                lineBoxManager,
                lineClamp,
                lineClampCount,
              }, isVirtual);
              // ib放得下要么内部没有折行，要么声明了width限制，都需手动存入当前lb
              (isInlineBlock || isImg) && lineBoxManager.addItem(item);
              x = lineBoxManager.lastX;
              y = lineBoxManager.lastY;
            }
            // 放不下处理之前的lineBox，并重新开头
            else {
              lineClampCount++;
              x = data.x;
              y = lineBoxManager.endY;
              lineBoxManager.setNewLine();
              lineClampCount = item.__layout({
                x,
                y,
                w,
                h,
                lx: data.x,
                lineBoxManager,
                lineClamp,
                lineClampCount,
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
          // 非开头，说明之前的text未换行，需要增加行数
          if(x !== data.x && flowChildren[i - 1] instanceof Text) {
            lineClampCount++;
          }
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
          lineBoxManager.__lastY = y;
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
              let diff = reflow.getMergeMarginTB(mergeMarginTopList, mergeMarginBottomList);
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
            let diff = reflow.getMergeMarginTB(mergeMarginTopList, mergeMarginBottomList);
            if(diff) {
              y += diff;
            }
          }
        }
      }
      // 文字和inline类似
      else {
        // lineClamp作用域为block下的inline（同LineBox上下文）
        if(lineClamp && lineClampCount >= lineClamp) {
          return;
        }
        // x开头，不用考虑是否放得下直接放
        if(x === data.x || whiteSpace === 'nowrap') {
          lineClampCount = item.__layout({
            x,
            y,
            w,
            h,
            lx: data.x,
            lineBoxManager,
            lineClamp,
            lineClampCount,
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
          if(fw >= (-1e-10)) {
            lineClampCount = item.__layout({
              x,
              y,
              w,
              h,
              lx: data.x,
              lineBoxManager,
              lineClamp,
              lineClampCount,
            }, isVirtual);
            x = lineBoxManager.lastX;
            y = lineBoxManager.lastY;
          }
          // 放不下处理之前的lineBox，并重新开头
          else {
            lineClampCount++;
            x = data.x;
            y = lineBoxManager.endY;
            lineBoxManager.setNewLine();
            lineClampCount = item.__layout({
              x,
              y,
              w,
              h,
              lx: data.x,
              lineBoxManager,
              lineClamp,
              lineClampCount,
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
        // 直接text需计算size
        flowChildren.forEach(item => {
          if(item instanceof Component) {
            item = item.shadowRoot;
          }
          if(item instanceof Text) {
            item.__inlineSize();
          }
        });
      }
      // 所有inline计算size
      lineBoxManager.domList.forEach(item => {
        item.__inlineSize(tw, textAlign);
      });
      this.__marginAuto(currentStyle, data);
    }
  }

  // 弹性布局时的计算位置
  __layoutFlex(data, isVirtual) {
    let { flowChildren, currentStyle, computedStyle, __flexLine } = this;
    let { fixedWidth, fixedHeight, x, y, w, h } = this.__preLayout(data);
    if(fixedWidth && isVirtual) {
      this.__width = w;
      this.__ioSize(w, this.height);
      return;
    }
    // 每次布局情况多行内容
    __flexLine.splice(0);
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
    // 只有>=1的正整数才有效
    lineClamp = lineClamp || 0;
    let lineClampCount = 0;
    let maxX = 0;
    let isDirectionRow = ['column', 'column-reverse', 'columnReverse'].indexOf(flexDirection) === -1;
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
        // flex的child如果是inline，变为block，在计算autoBasis前就要
        if(currentStyle[DISPLAY] !== 'block' && currentStyle[DISPLAY] !== 'flex') {
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
        // 根据basis不同，计算方式不同
        basisList.push(b);
        maxList.push(max);
        minList.push(min);
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
        if(isDirectionRow) {
          let cw = item.charWidth;
          let tw = item.textWidth;
          basisList.push(tw);
          maxList.push(tw);
          minList.push(cw);
        }
        else {
          let lineBoxManager = new LineBoxManager(x, y, lineHeight, css.getBaseLine(computedStyle));
          item.__layout({
            x,
            y,
            w,
            h,
            lineBoxManager,
            lineClamp,
            lineClampCount,
          });
          let h = item.height;
          basisList.push(h);
          minList.push(h);
        }
      }
    });
    // abs时，只需关注宽度即可，无需真正布局
    if(isVirtual) {
      let tw = this.__width = Math.min(maxX, w);
      this.__ioSize(tw, this.height);
      return;
    }
    let containerSize = isDirectionRow ? w : h;
    let isMultiLine = flexWrap === 'wrap' || ['wrap-reverse', 'wrapReverse'].indexOf(flexWrap) > -1;
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
    let maxCrossList = [];
    __flexLine.forEach(item => {
      let length = item.length;
      let end = offset + length;
      let [x1, y1, maxCross] = this.__layoutFlexLine(clone, isDirectionRow, containerSize,
        fixedWidth, fixedHeight, lineClamp, lineClampCount,
        lineHeight, computedStyle, justifyContent, alignItems, orderChildren.slice(offset, end), item, textAlign,
        growList.slice(offset, end), shrinkList.slice(offset, end), basisList.slice(offset, end),
        hypotheticalList.slice(offset, end), minList.slice(offset, end));
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
      offset += length;
    });
    let tw = this.__width = w;
    let th = this.__height = fixedHeight ? h : y - data.y;
    this.__ioSize(tw, th);
    // flexDirection当有reverse时交换每line的主轴序
    if(flexDirection === 'row-reverse' || flexDirection === 'rowReverse') {
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
    else if(flexDirection === 'column-reverse' || flexDirection === 'columnReverse') {
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
    if(['wrapReverse', 'wrap-reverse'].indexOf(flexWrap) > -1 && length > 1) {
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
    if(!isVirtual && length > 1 && (fixedHeight && isDirectionRow || !isDirectionRow)) {
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
        else if(alignContent === 'flex-start' || alignContent === 'flexStart') {}
        else if(alignContent === 'flex-end' || alignContent === 'flexEnd') {
          orderChildren.forEach(item => {
            if(isDirectionRow) {
              item.__offsetY(diff, true);
            }
            else {
              item.__offsetX(diff, true);
            }
          });
        }
        else if(alignContent === 'space-between' || alignContent === 'spaceBetween') {
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
        else if(alignContent === 'space-around' || alignContent === 'spaceAround') {
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
        // 默认stretch
        else {
          per = diff / length;
          // 除了第1行其它进行偏移
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
    // 每行再进行cross对齐，在alignContent为stretch时计算每行的高度
    if(!isVirtual) {
      if(length > 1) {
        __flexLine.forEach((item, i) => {
          let maxCross = maxCrossList[i];
          if(per) {
            maxCross += per;
          }
          this.__crossAlign(item, alignItems, isDirectionRow, maxCross);
        });
      }
      else if(length) {
        let maxCross = maxCrossList[0];
        if(isDirectionRow) {
          if(fixedHeight) {
            maxCross = h;
          }
        }
        else {
          maxCross = w;
        }
        this.__crossAlign(__flexLine[0], alignItems, isDirectionRow, maxCross);
      }
    }
    this.__marginAuto(currentStyle, data);
  }

  /**
   * 计算获取子元素的b/min/max完毕后，尝试进行flex每行布局
   * https://www.w3.org/TR/css-flexbox-1/#layout-algorithm
   * 假想主尺寸，其为clamp(min_main_size, flex_base_size, max_main_size)
   * 随后按算法一步步来 https://zhuanlan.zhihu.com/p/354567655
   * 规范没提到mpb，item的要计算，孙子的只考虑绝对值
   * 先收集basis和假设主尺寸
   */
  __layoutFlexLine(data, isDirectionRow, containerSize,
                   fixedWidth, fixedHeight, lineClamp, lineClampCount,
                   lineHeight, computedStyle, justifyContent, alignItems, orderChildren, flexLine, textAlign,
                   growList, shrinkList, basisList, hypotheticalList, minList) {
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
    let lbmList = [];
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
        let lineBoxManager = this.__lineBoxManager = new LineBoxManager(x, y, lineHeight, css.getBaseLine(computedStyle));
        lbmList.push(lineBoxManager);
        item.__layout({
          x,
          y,
          w: isDirectionRow ? main : w,
          h: isDirectionRow ? h : main,
          lineBoxManager,
          lineClamp,
          lineClampCount,
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
    let diff = isDirectionRow ? (w - x + data.x) : (h - y + data.y);
    // 主轴对齐方式
    if(diff > 0) {
      let len = orderChildren.length;
      if(justifyContent === 'flexEnd' || justifyContent === 'flex-end') {
        for(let i = 0; i < len; i++) {
          let child = orderChildren[i];
          isDirectionRow ? child.__offsetX(diff, true) : child.__offsetY(diff, true);
        }
      }
      else if(justifyContent === 'center') {
        let center = diff * 0.5;
        for(let i = 0; i < len; i++) {
          let child = orderChildren[i];
          isDirectionRow ? child.__offsetX(center, true) : child.__offsetY(center, true);
        }
      }
      else if(justifyContent === 'spaceBetween' || justifyContent === 'space-between') {
        let between = diff / (len - 1);
        for(let i = 1; i < len; i++) {
          let child = orderChildren[i];
          isDirectionRow ? child.__offsetX(between * i, true) : child.__offsetY(between * i, true);
        }
      }
      else if(justifyContent === 'spaceAround' || justifyContent === 'space-around') {
        let around = diff / (len + 1);
        for(let i = 0; i < len; i++) {
          let child = orderChildren[i];
          isDirectionRow ? child.__offsetX(around * (i + 1), true) : child.__offsetY(around * (i + 1), true);
        }
      }
    }
    if(isDirectionRow) {
      y += maxCross;
    }
    else {
      x += maxCross;
    }
    // flex的直接text对齐比较特殊
    if(['center', 'right'].indexOf(textAlign) > -1) {
      lbmList.forEach(item => {
        item.horizonAlign(item.width, textAlign);
      })
    }
    return [x, y, maxCross];
  }

  // 每个flexLine的侧轴对齐，单行时就是一行对齐
  __crossAlign(line, alignItems, isDirectionRow, maxCross) {
    let baseLine = 0;
    line.forEach(item => {
      baseLine = Math.max(baseLine, item.firstBaseLine);
    });
    line.forEach(item => {
      let { currentStyle: { [ALIGN_SELF]: alignSelf } } = item;
      if(isDirectionRow) {
        if(alignSelf === 'flexStart' || alignSelf === 'flex-start') {}
        else if(alignSelf === 'flexEnd' || alignSelf === 'flex-end') {
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
          let diff = baseLine - item.firstBaseLine;
          if(diff !== 0) {
            item.__offsetY(diff, true);
          }
        }
        // 默认auto，取alignItems
        else {
          if(alignItems === 'flexStart' || alignSelf === 'flex-start') {}
          else if(alignItems === 'center') {
            let diff = maxCross - item.outerHeight;
            if(diff !== 0) {
              item.__offsetY(diff * 0.5, true);
            }
          }
          else if(alignItems === 'flexEnd' || alignItems === 'flex-end') {
            let diff = maxCross - item.outerHeight;
            if(diff !== 0) {
              item.__offsetY(diff, true);
            }
          }
          else if(alignItems === 'baseline') {
            let diff = baseLine - item.firstBaseLine;
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
        if(alignSelf === 'flexStart' || alignSelf === 'flex-start') {}
        else if(alignSelf === 'flexEnd' || alignSelf === 'flex-end') {
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
          let diff = baseLine - item.firstBaseLine;
          if(diff !== 0) {
            item.__offsetX(diff, true);
          }
        }
        // 默认auto，取alignItems
        else {
          if(alignItems === 'flexStart' || alignSelf === 'flex-start') {}
          else if(alignItems === 'center') {
            let diff = maxCross - item.outerWidth;
            if(diff !== 0) {
              item.__offsetX(diff * 0.5, true);
            }
          }
          else if(alignItems === 'flexEnd' || alignItems === 'flex-end') {
            let diff = maxCross - item.outerWidth;
            if(diff !== 0) {
              item.__offsetX(diff, true);
            }
          }
          else if(alignItems === 'baseline') {
            let diff = baseLine - item.firstBaseLine;
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
    let { flowChildren, currentStyle, computedStyle } = this;
    let { fixedWidth, fixedHeight, x, y, w, h, lx,
      lineBoxManager, nowrap, endSpace, selfEndSpace } = this.__preLayout(data, isInline);
    // abs虚拟布局需预知width，固定可提前返回
    if(fixedWidth && isVirtual) {
      this.__width = w;
      this.__ioSize(w, this.height);
      return;
    }
    let {
      [WIDTH]: width,
    } = currentStyle;
    let {
      [TEXT_ALIGN]: textAlign,
      [WHITE_SPACE]: whiteSpace,
      [LINE_CLAMP]: lineClamp,
      [LINE_HEIGHT]: lineHeight,
      [MARGIN_LEFT]: marginLeft,
      [MARGIN_RIGHT]: marginRight,
      [BORDER_LEFT_WIDTH]: borderLeftWidth,
      [BORDER_RIGHT_WIDTH]: borderRightWidth,
      [PADDING_LEFT]: paddingLeft,
      [PADDING_RIGHT]: paddingRight,
    } = computedStyle;
    let lineClampCount = data.lineClampCount || 0;
    if(isInline && !this.__isRealInline()) {
      isInline = false;
    }
    // 只有inline的孩子需要考虑换行后从行首开始，而ib不需要，因此重置行首标识lx为x，末尾空白为0
    // 而inline的LineBoxManager复用最近非inline父dom的，ib需要重新生成，末尾空白叠加
    if(isInline) {
      this.__config[NODE_IS_INLINE] = true;
      this.__lineBoxManager = lineBoxManager;
      let baseLine = css.getBaseLine(computedStyle);
      // 特殊inline调用，有内容的话（如左右mbp），默认生成一个lineBox，即便是空，也要形成占位，只有开头时需要
      if(marginLeft || marginRight
        || paddingLeft || paddingRight
        || borderLeftWidth || borderRightWidth) {
        if(lineBoxManager.isNewLine) {
          lineBoxManager.genLineBoxByInlineIfNewLine(x, y, lineHeight, baseLine);
        }
        else {
          lineBoxManager.setLbByInlineIfNotNewLine(lineHeight, baseLine);
        }
      }
      else {
        lineBoxManager.setLbByInlineIfNotNewLine(lineHeight, baseLine);
      }
      lineClamp = data.lineClamp || 0;
    }
    else {
      lineBoxManager = this.__lineBoxManager = new LineBoxManager(x, y, lineHeight, css.getBaseLine(computedStyle));
      lx = x;
      endSpace = selfEndSpace = lineClampCount = 0;
    }
    // 存LineBox里的内容列表专用，布局过程中由lineBoxManager存入，递归情况每个inline节点都保存contentBox
    let contentBoxList;
    if(isInline) {
      contentBoxList = this.__contentBoxList = [];
      lineBoxManager.pushContentBoxList(this);
    }
    let isIbFull = false; // ib时不限定w情况下发生折行则撑满行，即便内容没有撑满边界
    let length = flowChildren.length;
    flowChildren.forEach((item, i) => {
      let isXom = item instanceof Xom || item instanceof Component && item.shadowRoot instanceof Xom;
      let isInline2 = isXom && item.currentStyle[DISPLAY] === 'inline';
      let isInlineBlock2 = isXom && ['inlineBlock', 'inline-block'].indexOf(item.currentStyle[DISPLAY]) > -1;
      let isRealInline = isXom && item.__isRealInline();
      // 最后一个元素会产生最后一行，叠加父元素的尾部mpb
      let isEnd = isInline && (i === length - 1);
      if(isEnd) {
        endSpace += selfEndSpace;
      }
      if(isXom) {
        if(!isInline2 && !isInlineBlock2) {
          item.currentStyle[DISPLAY] = item.computedStyle[DISPLAY] = 'inlineBlock';
          isInlineBlock2 = true;
          inject.warn('Inline can not contain block/flex');
        }
        // x开头，不用考虑是否放得下直接放，i为0强制不换行
        if(x === lx || !i || isInline2 && whiteSpace === 'nowrap') {
          lineClampCount = item.__layout({
            x,
            y,
            w,
            h,
            lx,
            lineBoxManager,
            endSpace,
            lineClamp,
            lineClampCount,
          }, isVirtual);
          // inlineBlock的特殊之处，一旦w为auto且内部产生折行时，整个变成block独占一块区域，坐标计算和block一样
          if(item.__isIbFull) {
            isInlineBlock2 && (w[1] === AUTO) && (isIbFull = true);
            lineBoxManager.addItem(item);
            x = lx;
            y += item.outerHeight;
            lineBoxManager.setNotEnd();
          }
          // inline和不折行的ib，其中ib需要手动存入当前lb中，以计算宽度
          else {
            (isInlineBlock2 || !isRealInline) && lineBoxManager.addItem(item);
            x = lineBoxManager.lastX;
            y = lineBoxManager.lastY;
          }
        }
        else {
          // 不换行继续排，换行非开头先尝试是否放得下，结尾要考虑mpb因此减去endSpace
          let fw = (whiteSpace === 'nowrap') ? 0 : item.__tryLayInline(w - x + lx, w - (isEnd ? endSpace : 0));
          // 放得下继续
          if(fw >= (-1e-10)) {
            lineClampCount = item.__layout({
              x,
              y,
              w,
              h,
              lx,
              nowrap: whiteSpace === 'nowrap',
              lineBoxManager,
              endSpace,
              lineClamp,
              lineClampCount,
            }, isVirtual);
            // ib放得下要么内部没有折行，要么声明了width限制，都需手动存入当前lb
            (isInlineBlock2 || !isRealInline) && lineBoxManager.addItem(item);
            x = lineBoxManager.lastX;
            y = lineBoxManager.lastY;
          }
          // 放不下处理之前的lineBox，并重新开头
          else {
            isInline2 && lineClampCount++;
            x = lx;
            y = lineBoxManager.endY;
            lineBoxManager.setNewLine();
            lineClampCount = item.__layout({
              x,
              y,
              w,
              h,
              lx,
              lineBoxManager,
              endSpace,
              lineClamp,
              lineClampCount,
            }, isVirtual);
            // 重新开头的ib和上面开头处一样逻辑
            if(item.__isIbFull) {
              lineBoxManager.addItem(item);
              x = lx;
              y += item.outerHeight;
              lineBoxManager.setNotEnd();
            }
            // inline和不折行的ib，其中ib需要手动存入当前lb中
            else {
              (isInlineBlock2 || !isRealInline) && lineBoxManager.addItem(item);
              x = lineBoxManager.lastX;
              y = lineBoxManager.lastY;
            }
          }
        }
      }
      // inline里的其它只有文本，可能开始紧跟着之前的x，也可能换行后从lx行头开始
      // 紧跟着x可能出现在前面有节点换行后第2行，此时不一定放得下，因此不能作为判断依据，开头仅有lx
      else {
        let n = lineBoxManager.size;
        // i为0时强制不换行
        if(x === lx || !i || whiteSpace === 'nowrap') {
          lineClampCount = item.__layout({
            x,
            y,
            w,
            h,
            lx,
            lineBoxManager,
            endSpace,
            lineClamp,
            lineClampCount,
          }, isVirtual);
          x = lineBoxManager.lastX;
          y = lineBoxManager.lastY;
          // ib情况发生折行，且非定宽
          if(!isInline && (lineBoxManager.size - n) > 1 && width[1] === AUTO) {
            isIbFull = true;
          }
        }
        else {
          // 非开头先尝试是否放得下，如果放得下再看是否end，加end且只有1个字时放不下要换行，否则可以放，换行由text内部做
          // 第一个Text且父元素声明了nowrap也强制不换行，非第一个则看本身whiteSpace声明
          let focusNoWrap = (!i && nowrap) || whiteSpace === 'nowrap';
          let fw = focusNoWrap ? 0 : item.__tryLayInline(w + lx - x);
          if(!focusNoWrap && fw >= 0 && isEnd && endSpace && item.content.length === 1) {
            let fw2 = fw - endSpace;
            if(fw2 < 0) {
              fw = fw2;
            }
          }
          // 放得下继续
          if(fw >= (-1e-10)) {
            lineClampCount = item.__layout({
              x,
              y,
              w,
              h,
              lx,
              lineBoxManager,
              endSpace,
              lineClamp,
              lineClampCount,
            }, isVirtual);
            x = lineBoxManager.lastX;
            y = lineBoxManager.lastY;
            // 这里ib放得下一定是要么没换行要么固定宽度，所以无需判断isIbFull
          }
          // 放不下处理之前的lineBox，并重新开头
          else {
            lineClampCount++;
            x = lx;
            y = lineBoxManager.endY;
            lineBoxManager.setNewLine();
            lineClampCount = item.__layout({
              x,
              y,
              w,
              h,
              lx,
              lineBoxManager,
              endSpace,
              lineClamp,
              lineClampCount,
            }, isVirtual);
            x = lineBoxManager.lastX;
            y = lineBoxManager.lastY;
            // ib情况发生折行
            if(!isInline && (lineBoxManager.size - n) > 1 && width[1] === AUTO) {
              isIbFull = true;
            }
          }
        }
      }
    });
    // 同block结尾，不过这里一定是lineBox结束，无需判断
    y = lineBoxManager.endY;
    // 标识ib情况同block一样占满行
    this.__isIbFull = isIbFull;
    // 元素的width在固定情况或者ibFull情况已被计算出来，否则为最大延展尺寸，inline没有固定尺寸概念
    let tw, th;
    if(isInline) {
      // inline最后的x要算上右侧mpb，为next行元素提供x坐标基准，同时其尺寸计算比较特殊
      if(selfEndSpace) {
        lineBoxManager.addX(selfEndSpace);
      }
      // 如果没有内容，空白还要加上开头即左侧mpb
      if(!flowChildren.length) {
        let {
          [MARGIN_LEFT]: marginLeft,
          [PADDING_LEFT]: paddingLeft,
          [BORDER_LEFT_WIDTH]: borderLeftWidth,
        } = computedStyle;
        lineBoxManager.addX(marginLeft + paddingLeft + borderLeftWidth);
      }
      // 结束出栈contentBox，递归情况结束子inline获取contentBox，父inline继续
      lineBoxManager.popContentBoxList();
      // abs非固定w时预计算，本来是最近非inline父层统一计算，但在abs时不算，
      if(isVirtual) {
        this.__inlineSize();
      }
    }
    else {
      // ib在满时很特殊，取最大值，可能w本身很小不足排下1个字符，此时要用maxW
      let maxW = lineBoxManager.__maxX - data.x;
      tw = this.__width = fixedWidth ? w : (isIbFull ? Math.max(w, maxW) : maxW);
      th = this.__height = fixedHeight ? h : y - data.y;
      this.__ioSize(tw, th);
    }
    // 非abs提前虚拟布局，真实布局情况下最后为所有行内元素进行2个方向上的对齐，inline会被父级调用这里只看ib
    if(!isVirtual && !isInline) {
      lineBoxManager.verticalAlign();
      if(['center', 'right'].indexOf(textAlign) > -1) {
        lineBoxManager.horizonAlign(tw, textAlign);
        // 直接text需计算size
        flowChildren.forEach(item => {
          if(item instanceof Component) {
            item = item.shadowRoot;
          }
          if(item instanceof Text) {
            item.__inlineSize();
          }
        });
      }
      // block的所有inline计算size
      lineBoxManager.domList.forEach(item => {
        item.__inlineSize(tw, textAlign);
      });
    }
    // inlineBlock新开上下文，但父级block遇到要处理换行
    return isInline ? lineClampCount : 0;
  }

  /**
   * inline的尺寸计算非常特殊，并非一个矩形区域，而是由字体行高结合节点下多个LineBox中的内容决定，
   * 且这个尺寸又并非真实LineBox中的内容直接合并计算而来，比如包含了个更大尺寸的ib却不会计入
   * 具体方法为遍历持有的LineBox下的内容，x取两侧极值，同时首尾要考虑mpb，y值取上下极值，同样首尾考虑mpb
   * 首尾行LineBox可能不是不是占满一行，比如前后都有同行inline的情况，非首尾行则肯定占满
   * 绘制内容（如背景色）的区域也很特殊，每行LineBox根据lineHeight对齐baseLine得来，并非LineBox全部
   * 当LineBox只有直属Text时如果font没有lineGap则等价于全部，如有则需减去
   * 另外其client/offset/outer的w/h尺寸计算也很特殊，皆因首尾x方向的mpb导致
   * @private
   */
  __inlineSize(tw, textAlign) {
    let { contentBoxList, computedStyle, __ox, __oy } = this;
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
      [LINE_HEIGHT]: lineHeight,
    } = computedStyle;
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
            item.__inlineSize();
          }
        });
      }
    }
    // 如果没有内容，宽度为0高度为lineHeight，对齐也特殊处理，lineBoxManager不会处理
    else {
      if(['center', 'right'].indexOf(textAlign) > -1) {
        let diff = tw;
        if(textAlign === 'center') {
          diff *= 0.5;
        }
        if(diff) {
          this.__offsetX(diff, true);
        }
      }
      this.__width = computedStyle[WIDTH] = 0;
      let th = this.__height = computedStyle[HEIGHT] = lineHeight;
      this.__ioSize(0, th);
      this.__sy -= marginTop + paddingTop + borderTopWidth;
      this.__sx1 = this.sx + marginLeft;
      this.__sy1 = this.sy + marginTop;
      this.__sx2 = this.__sx1 + borderLeftWidth;
      this.__sy2 = this.__sy1 + borderTopWidth;
      this.__sx4 = this.__sx3 = this.__sx2 + paddingLeft;
      this.__sy4 = this.__sy3 = this.__sy2 + paddingTop;
      this.__sx5 = this.__sx4 + paddingRight;
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
      if(currentStyle[DISPLAY] === 'none') {
        item.__layoutNone();
        return;
      }
      // 先根据容器宽度计算margin/padding
      item.__mp(currentStyle, computedStyle, clientWidth);
      if(currentStyle[DISPLAY] !== 'block' && currentStyle[DISPLAY] !== 'flex') {
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
        computedStyle[LEFT] = calAbsolute(currentStyle, 'left', left, clientWidth, this.root);
      }
      else {
        computedStyle[LEFT] = 'auto';
      }
      if(right[1] !== AUTO) {
        fixedRight = true;
        computedStyle[RIGHT] = calAbsolute(currentStyle, 'right', right, clientWidth, this.root);
      }
      else {
        computedStyle[RIGHT] = 'auto';
      }
      if(top[1] !== AUTO) {
        fixedTop = true;
        computedStyle[TOP] = calAbsolute(currentStyle, 'top', top, clientHeight, this.root);
      }
      else {
        computedStyle[TOP] = 'auto';
      }
      if(bottom[1] !== AUTO) {
        fixedBottom = true;
        computedStyle[BOTTOM] = calAbsolute(currentStyle, 'bottom', bottom, clientHeight, this.root);
      }
      else {
        computedStyle[BOTTOM] = 'auto';
      }
      // 优先级最高left+right，其次left+width，再次right+width，再次仅申明单个，最次全部auto
      if(fixedLeft && fixedRight) {
        x2 = x + computedStyle[LEFT];
        w2 = x + clientWidth - computedStyle[RIGHT] - x2;
      }
      else if(fixedLeft) {
        x2 = x + computedStyle[LEFT];
        if(width[1] !== AUTO) {
          if(width[1] === PERCENT) {
            w2 = width[0] * clientWidth * 0.01;
          }
          else if(width[1] === REM) {
            w2 = width[0] * this.root.computedStyle[FONT_SIZE];
          }
          else if(width[1] === VW) {
            w2 = width[0] * this.root.width * 0.01;
          }
          else if(width[1] === VH) {
            w2 = width[0] * this.root.height * 0.01;
          }
          else {
            w2 = width[0];
          }
        }
      }
      else if(fixedRight) {
        if(width[1] !== AUTO) {
          if(width[1] === PERCENT) {
            w2 = width[0] * clientWidth * 0.01;
          }
          else if(width[1] === REM) {
            w2 = width[0] * this.root.computedStyle[FONT_SIZE];
          }
          else if(width[1] === VW) {
            w2 = width[0] * this.root.width * 0.01;
          }
          else if(width[1] === VH) {
            w2 = width[0] * this.root.height * 0.01;
          }
          else {
            w2 = width[0];
          }
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
        x2 -= currentStyle[BORDER_LEFT_WIDTH][0];
        x2 -= currentStyle[BORDER_RIGHT_WIDTH][0];
      }
      else {
        x2 = x + paddingLeft;
        if(width[1] !== AUTO) {
          if(width[1] === PERCENT) {
            w2 = width[0] * clientWidth * 0.01;
          }
          else if(width[1] === REM) {
            w2 = width[0] * this.root.computedStyle[FONT_SIZE];
          }
          else if(width[1] === VW) {
            w2 = width[0] * this.root.width * 0.01;
          }
          else if(width[1] === VH) {
            w2 = width[0] * this.root.height * 0.01;
          }
          else {
            w2 = width[0];
          }
        }
      }
      // top/bottom/height优先级同上
      if(fixedTop && fixedBottom) {
        y2 = y + computedStyle[TOP];
        h2 = y + clientHeight - computedStyle[BOTTOM] - y2;
      }
      else if(fixedTop) {
        y2 = y + computedStyle[TOP];
        if(height[1] !== AUTO) {
          if(height[1] === PERCENT) {
            h2 = height[0] * clientHeight * 0.01;
          }
          else if(height[1] === REM) {
            h2 = height[0] * this.root.computedStyle[FONT_SIZE];
          }
          else if(height[1] === VW) {
            h2 = height[0] * this.root.width * 0.01;
          }
          else if(height[1] === VH) {
            h2 = height[0] * this.root.height * 0.01;
          }
          else {
            h2 = height[0];
          }
        }
      }
      else if(fixedBottom) {
        if(height[1] !== AUTO) {
          if(height[1] === PERCENT) {
            h2 = height[0] * clientHeight * 0.01;
          }
          else if(height[1] === REM) {
            h2 = height[0] * this.root.computedStyle[FONT_SIZE];
          }
          else if(height[1] === VW) {
            h2 = height[0] * this.root.width * 0.01;
          }
          else if(height[1] === VH) {
            h2 = height[0] * this.root.height * 0.01;
          }
          else {
            h2 = height[0];
          }
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
        y2 -= currentStyle[BORDER_TOP_WIDTH][0];
        y2 -= currentStyle[BORDER_BOTTOM_WIDTH][0];
      }
      // 未声明y的找到之前的流布局child，紧随其下
      else {
        y2 = y + paddingTop;
        let prev = item.prev;
        while(prev) {
          // 目前不考虑margin合并，直接以前面的flow的最近的prev末尾为准
          if(prev instanceof Text || prev.computedStyle[POSITION] !== 'absolute') {
            y2 = prev.y + prev.outerHeight;
            break;
          }
          prev = prev.prev;
        }
        if(height[1] === PERCENT) {
          h2 = height[0] * clientHeight * 0.01;
        }
        else if(height[1] === REM) {
          h2 = height[0] * this.root.computedStyle[FONT_SIZE];
        }
        else if(height[1] === VW) {
          h2 = height[0] * this.root.width * 0.01;
        }
        else if(height[1] === VH) {
          h2 = height[0] * this.root.height * 0.01;
        }
        else if(height[1] === PX) {
          h2 = height[0];
        }
      }
      // 没设宽高，需手动计算获取最大宽高后，赋给样式再布局
      let needCalWidth;
      if((display === 'block' || ['inlineBlock', 'inline-block'].indexOf(display) > -1) && w2 === undefined) {
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
   * @param cb
   * @private
   */
  __computeMeasure(renderMode, ctx, cb) {
    super.__computeMeasure(renderMode, ctx, cb);
    // 即便自己不需要计算，但children还要继续递归检查
    this.children.forEach(item => {
      item.__computeMeasure(renderMode, ctx, cb);
    });
  }

  render(renderMode, lv, ctx, cache) {
    let res = super.render(renderMode, lv, ctx, cache);
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

  appendChild(json, cb) {
    let self = this;
    if(!util.isNil(json) && !self.isDestroyed) {
      let { root, host } = self;
      if([$$type.TYPE_VD, $$type.TYPE_GM, $$type.TYPE_CP].indexOf(json.$$type) > -1) {
        let vd;
        if($$type.TYPE_CP === json.$$type) {
          vd = builder.initCp2(json, root, host, self);
        }
        else {
          vd = builder.initDom(json, root, host, self);
        }
        root.addRefreshTask(vd.__task = {
          __before() {
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
            res[UPDATE_MEASURE] = true;
            res[UPDATE_CONFIG] = vd.__config;
            root.__addUpdate(vd, vd.__config, root, root.__config, res);
          },
          __after(diff) {
            if(util.isFunction(cb)) {
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
    if(!util.isNil(json) && !self.isDestroyed) {
      let { root, host } = self;
      if([$$type.TYPE_VD, $$type.TYPE_GM].indexOf(json.$$type) > -1) {
        let vd = builder.initDom(json, root, host, self);
        root.addRefreshTask(vd.__task = {
          __before() {
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
            res[UPDATE_MEASURE] = true;
            res[UPDATE_CONFIG] = vd.__config;
            root.__addUpdate(vd, vd.__config, root, root.__config, res);
          },
          __after(diff) {
            if(util.isFunction(cb)) {
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
    if(!util.isNil(json) && !self.isDestroyed && self.domParent) {
      let { root, domParent } = self;
      let host = domParent.host;
      if([$$type.TYPE_VD, $$type.TYPE_GM].indexOf(json.$$type) > -1) {
        let vd = builder.initDom(json, root, host, domParent);
        root.addRefreshTask(vd.__task = {
          __before() {
            let i = 0, has, __json = domParent.__json, children = __json.children, len = children.length;
            for(; i < len; i++) {
              if(children[i] === self.__json) {
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
            res[UPDATE_MEASURE] = true;
            res[UPDATE_CONFIG] = vd.__config;
            root.__addUpdate(vd, vd.__config, root, root.__config, res);
          },
          __after(diff) {
            if(util.isFunction(cb)) {
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
    if(!util.isNil(json) && !self.isDestroyed && self.domParent) {
      let { root, domParent } = self;
      let host = domParent.host;
      if([$$type.TYPE_VD, $$type.TYPE_GM].indexOf(json.$$type) > -1) {
        let vd = builder.initDom(json, root, host, domParent);
        root.addRefreshTask(vd.__task = {
          __before() {
            let i = 0, has, __json = domParent.__json, children = __json.children, len = children.length;
            for(; i < len; i++) {
              if(children[i] === self.__json) {
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
            res[UPDATE_MEASURE] = true;
            res[UPDATE_CONFIG] = vd.__config;
            root.__addUpdate(vd, vd.__config, root, root.__config, res);
          },
          __after(diff) {
            if(util.isFunction(cb)) {
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

  get baseLine() {
    if(!this.lineBoxManager || !this.lineBoxManager.size) {
      return this.offsetHeight;
    }
    let {
      [MARGIN_TOP]: marginTop,
      [BORDER_TOP_WIDTH]: borderTopWidth,
      [PADDING_TOP]: paddingTop,
    } = this.computedStyle;
    return marginTop + borderTopWidth + paddingTop + this.lineBoxManager.baseLine;
  }

  get firstBaseLine() {
    if(!this.lineBoxManager || !this.lineBoxManager.size) {
      return this.offsetHeight;
    }
    let {
      [MARGIN_TOP]: marginTop,
      [BORDER_TOP_WIDTH]: borderTopWidth,
      [PADDING_TOP]: paddingTop,
    } = this.computedStyle;
    return marginTop + borderTopWidth + paddingTop + this.lineBoxManager.firstBaseLine;
  }

  get parentLineBox() {
    return this.__parentLineBox;
  }
}

export default Dom;
