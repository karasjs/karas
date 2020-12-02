import inject from '../util/inject';
import Geom from '../geom/Geom';
import blur from '../style/blur';
import Text from '../node/Text';
import Dom from '../node/Dom';
import Img from '../node/Img';
import mx from '../math/matrix';
import level from './level';
import util from '../util/util';
import Cache from './Cache';
import tf from '../style/transform';
import enums from '../util/enums';

const { STYLE_KEY: {
  POSITION,
  DISPLAY,
  OPACITY,
  VISIBILITY,
  FILTER,
  OVERFLOW,
  MIX_BLEND_MODE,
  FILL,
  TRANSFORM,
  TRANSFORM_ORIGIN,
},
  NODE_CACHE,
  NODE_CACHE_TOTAL,
  NODE_CACHE_OVERFLOW,
  NODE_CACHE_MASK,
  NODE_CACHE_FILTER,
  NODE_MATRIX,
  NODE_MATRIX_EVENT,
  NODE_OPACITY,
  NODE_COMPUTED_STYLE,
  NODE_CURRENT_STYLE,
  NODE_LIMIT_CACHE,
  NODE_BLUR_VALUE,
  NODE_REFRESH_LV,
  NODE_HAS_CONTENT,
  STRUCT_NODE,
  STRUCT_INDEX,
  STRUCT_TOTAL,
  STRUCT_HAS_MASK,
  STRUCT_LV,
} = enums;
const {
  TRANSFORM_ALL,
  OPACITY: OP,
  FILTER: FT,
  REPAINT,
  contain,
  MIX_BLEND_MODE: MBM,
} = level;

/**
 * 广度遍历，每层后序遍历形成链表，遇到cacheTotal跳出
 * @param structs 先序整树
 */
function genLRD(structs) {
  let list = [0];
  let hash = {
    0: { i: 0 },
  };
  // 广度遍历不断重复
  while(list.length) {
    list.splice(0).forEach(index => {
      let top = structs[index];
      let parent = hash[index];
      let first;
      let last;
      for(let i = index + 1, len = i + (top[STRUCT_TOTAL] || 0); i < len; i++) {
        // let { node, total, node: { __cacheTotal, computedStyle: { display } } } = structs[i];
        let {
          [STRUCT_NODE]: node,
          [STRUCT_TOTAL]: total,
        } = structs[i];
        let {
          [NODE_CACHE_TOTAL]: __cacheTotal,
          [NODE_COMPUTED_STYLE]: {
            [DISPLAY]: display,
          },
        } = node.__config;
        // 不可见整个跳过视作不存在
        if(display === 'none') {
          i += (total || 0);
          continue;
        }
        // 子节点从开始到最后形成单链表
        let obj = { i };
        if(!first) {
          first = obj;
        }
        if(last) {
          obj.p = last;
        }
        last = obj;
        // 文本或单个节点不再继续深度遍历
        if(node instanceof Text || !total) {
          continue;
        }
        // 遗留有total缓存的跳过视为1个节点
        if(__cacheTotal && __cacheTotal.available) {
          i += (total || 0);
          continue;
        }
        hash[i] = obj;
        list.push(i);
        i += (total || 0);
      }
      // 第一层Root没有parent，后面层都有，最后一个子节点连到parent，如果parent本身有链接，赋予first
      if(parent && last) {
        if(parent.p) {
          first.p = parent.p;
        }
        parent.p = last;
      }
    });
  }
  // 此时从Root开始遍历链表，得到的是反向的后序遍历，reverse()即可
  let current = hash[0];
  let res = [];
  while(current) {
    res.push(current.i);
    current = current.p;
  }
  return res.reverse();
}

function genBboxTotal(node, __structs, index, total, parentIndexHash, opacityHash) {
  let matrixHash = {};
  let { __sx1: sx1, __sy1: sy1, __config } = node;
  let {
    [NODE_CACHE]: cache,
    [NODE_BLUR_VALUE]: blurValue,
  } = __config;
  // 先将局部根节点的bbox算好，可能没内容是空
  let bboxTotal;
  if(cache && cache.available) {
    bboxTotal = cache.bbox.slice(0);
  }
  else {
    bboxTotal = node.bbox;
  }
  // 广度遍历，不断一层层循环下去，用2个hash暂存每层的父matrix和blur
  let list = [index];
  let blurHash = {
    [index]: blurValue,
  };
  opacityHash[index] = 1;
  while(list.length) {
    list.splice(0).forEach(parentIndex => {
      let total = __structs[parentIndex][STRUCT_TOTAL];
      for(let i = parentIndex + 1, len = parentIndex + (total || 0) + 1; i < len; i++) {
        // let { node: { __cacheTotal, __cache, __blurValue, __sx1, __sy1, __limitCache,
        //   computedStyle: { display, visibility, transform, transformOrigin, opacity } },
        //   node, total } = __structs[i];
        let {
          [STRUCT_NODE]: node,
          [STRUCT_TOTAL]: total,
        } = __structs[i];
        let {
          __sx1,
          __sy1,
          __config: {
            [NODE_BLUR_VALUE]: __blurValue,
            [NODE_LIMIT_CACHE]: __limitCache,
            [NODE_CACHE]: __cache,
            [NODE_CACHE_TOTAL]: __cacheTotal,
            [NODE_COMPUTED_STYLE]: {
              [DISPLAY]: display,
              [VISIBILITY]: visibility,
              [TRANSFORM]: transform,
              [TRANSFORM_ORIGIN]: transformOrigin,
              [OPACITY]: opacity,
            },
          },
        } = node;
        if(__limitCache) {
          return;
        }
        // display:none跳过整个节点树，visibility只跳过自身
        if(display === 'none') {
          i += (total || 0);
          continue;
        }
        if(visibility === 'hidden') {
          continue;
        }
        parentIndexHash[i] = parentIndex;
        opacityHash[i] = opacityHash[parentIndex] * opacity;
        let bbox, dx = 0, dy = 0;
        if(__cacheTotal && __cacheTotal.available) {
          i += (total || 0);
          bbox = __cacheTotal.bbox.slice(0);
          dx = __cacheTotal.dbx;
          dy = __cacheTotal.dby;
        }
        else if(__cache && __cache.available) {
          bbox = __cache.bbox.slice(0);
          dx = __cache.dbx;
          dy = __cache.dby;
        }
        else {
          bbox = node.bbox;
        }
        // 可能Text或Xom没有内容
        if(bbox) {
          let matrix = matrixHash[parentIndex];
          let blur = (blurHash[parentIndex] || 0) + (__blurValue || 0);
          // 父级matrix初始化E为null，自身不为E时才运算加速
          if(transform && !mx.isE(transform)) {
            let tfo = transformOrigin.slice(0);
            // total下的节点tfo的计算，以total为原点，差值坐标即相对坐标
            tfo[0] += __sx1 - sx1 + dx;
            tfo[1] += __sy1 - sy1 + dy;
            let m = tf.calMatrixByOrigin(transform, tfo);
            if(matrix) {
              matrix = mx.multiply(matrix, m);
            }
            else {
              matrix = m;
            }
          }
          if(matrix) {
            matrixHash[i] = matrix;
          }
          bbox = util.transformBbox(bbox, matrix, blur, blur);
          // 有孩子才继续存入下层级广度运算
          if(total) {
            blurHash[i] = blur;
            list.push(i);
          }
          if(!bboxTotal) {
            bboxTotal = bbox;
          }
          else {
            mergeBbox(bboxTotal, bbox);
          }
        }
      }
    });
  }
  if((bboxTotal[2] - bboxTotal[0]) > Cache.MAX || (bboxTotal[3] - bboxTotal[1]) > Cache.MAX) {
    // 标识后续不再尝试生成，重新布局会清空标识
    node.__limitCache = __config[NODE_LIMIT_CACHE] = true;
    return;
  }
  return bboxTotal;
}

function mergeBbox(bbox, t) {
  bbox[0] = Math.min(bbox[0], t[0]);
  bbox[1] = Math.min(bbox[1], t[1]);
  bbox[2] = Math.max(bbox[2], t[2]);
  bbox[3] = Math.max(bbox[3], t[3]);
}

function genTotal(renderMode, node, __limitCache, lv, index, total, __structs, cacheTop, cache) {
  if(__limitCache) {
    return;
  }
  if(total === 0) {
    return node.__cacheTotal = node.__config[NODE_CACHE_TOTAL] = cache;
  }
  // 存每层父亲的matrix和opacity和index，bbox计算过程中生成，缓存给下面渲染过程用
  let parentIndexHash = {};
  let matrixHash = {};
  let opacityHash = {};
  let bboxTotal = genBboxTotal(node, __structs, index, total, parentIndexHash, opacityHash);
  if(!bboxTotal) {
    return;
  }
  if(cacheTop) {
    cacheTop.reset(bboxTotal);
  }
  else {
    cacheTop = node.__cacheTotal = node.__config[NODE_CACHE_TOTAL] = Cache.getInstance(bboxTotal);
  }
  // 创建失败，再次降级
  if(!cacheTop || !cacheTop.enabled) {
    return;
  }
  let { __sx1: sx1, __sy1: sy1 } = node;
  cacheTop.__appendData(sx1, sy1);
  cacheTop.__available = true;
  let { coords: [tx, ty], ctx, dbx, dby } = cacheTop;
  // 先绘制自己的cache，起点所以matrix视作E为空
  if(cache && cache.available) {
    ctx.globalAlpha = 1;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    Cache.drawCache(cache, cacheTop);
  }
  // 先序遍历汇总到total
  for(let i = index + 1, len = index + (total || 0) + 1; i < len; i++) {
    // let { node, total, node: { __cacheOverflow, __cacheMask, __cacheFilter, __cacheTotal, __cache,
    //   computedStyle: { display, visibility, transform, transformOrigin, mixBlendMode } } } = __structs[i];
    let {
      [STRUCT_NODE]: node,
      [STRUCT_TOTAL]: total,
    } = __structs[i];
    let {
      [NODE_CACHE]: __cache,
      [NODE_CACHE_TOTAL]: __cacheTotal,
      [NODE_CACHE_FILTER]: __cacheFilter,
      [NODE_CACHE_MASK]: __cacheMask,
      [NODE_CACHE_OVERFLOW]: __cacheOverflow,
      [NODE_COMPUTED_STYLE]: {
        [DISPLAY]: display,
        [VISIBILITY]: visibility,
        [TRANSFORM]: transform,
        [TRANSFORM_ORIGIN]: transformOrigin,
        [MIX_BLEND_MODE]: mixBlendMode,
      },
    } = node.__config;
    if(display === 'none') {
      i += (total || 0);
      continue;
    }
    if(visibility === 'hidden') {
      continue;
    }
    let parentIndex = parentIndexHash[i];
    let matrix = matrixHash[parentIndex];
    let opacity = opacityHash[i];
    // 先看text
    if(node instanceof Text) {
      ctx.globalAlpha = opacityHash[parentIndex];
      let matrix = matrixHash[parentIndex] || [1, 0, 0, 1, 0, 0];
      ctx.setTransform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);
      node.render(renderMode, 0, ctx, null, tx - sx1 + dbx, ty - sy1 + dby);
    }
    // 再看total缓存/cache，都没有的是无内容的Xom节点
    else {
      if(transform && !mx.isE(transform)) {
        let tfo = transformOrigin.slice(0);
        // total下的节点tfo的计算，以total为原点，差值坐标即相对坐标
        if(__cache && __cache.available) {
          tfo[0] += __cache.sx1;
          tfo[1] += __cache.sy1;
        }
        else {
          tfo[0] += node.__sx1;
          tfo[1] += node.__sy1;
        }
        let dx = -sx1 + dbx + tx;
        let dy = -sy1 + dby + ty;
        tfo[0] += dx;
        tfo[1] += dy;
        let m = tf.calMatrixByOrigin(transform, tfo);
        if(matrix) {
          matrix = mx.multiply(matrix, m);
        }
        else {
          matrix = m;
        }
      }
      if(matrix) {
        matrixHash[i] = matrix;
      }
      let target = __cacheOverflow || __cacheMask || __cacheFilter;
      if(!target) {
        target = __cacheTotal && __cacheTotal.available ? __cacheTotal : null;
      }
      if(target) {
        i += (total || 0);
      }
      else if(__cache && __cache.available) {
        target= __cache;
      }
      if(target) {
        if(mixBlendMode !== 'normal') {
          ctx.globalCompositeOperation = 'source-over';
        }
        else {
          ctx.globalCompositeOperation = mixBlendMode.replace(/[A-Z]/, function($0) {
            return '-' + $0.toLowerCase();
          });
        }
        ctx.globalAlpha = opacity;
        if(matrix) {
          ctx.setTransform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);
        }
        else {
          ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
        Cache.drawCache(target, cacheTop);
      }
    }
  }
  return cacheTop;
}

function genFilter(node, cache, v) {
  return node.__cacheFilter = node.__config[NODE_CACHE_FILTER] = Cache.genBlur(cache, v);
}

function genMask(node, cache, isClip) {
  let { [TRANSFORM]: transform, [TRANSFORM_ORIGIN]: transformOrigin } = node.computedStyle;
  return node.__cacheMask = node.__config[NODE_CACHE_MASK] = Cache.genMask(cache, node.next, isClip, transform, transformOrigin);
}

function genOverflow(node, cache) {
  return node.__cacheOverflow = node.__config[NODE_CACHE_OVERFLOW] = Cache.genOverflow(cache, node);
}

function renderCacheCanvas(renderMode, ctx, defs, root) {
  let { __structs, width, height } = root;
  // 栈代替递归，存父节点的matrix/opacity，matrix为E时存null省略计算
  let matrixList = [];
  let parentMatrix;
  let opacityList = [];
  let parentOpacity = 1;
  let lastList = [];
  // let last;
  let lastConfig;
  let lastLv = 0;
  // 先一遍先序遍历每个节点绘制到自己__cache上，排除Text和缓存和局部根缓存，lv的变化根据大小相等进行出入栈parent操作
  for(let i = 0, len = __structs.length; i < len; i++) {
    // let { node, node: { __cacheTotal, __cache, __refreshLevel, computedStyle }, total, lv } = item;
    let {
      [STRUCT_NODE]: node,
      [STRUCT_LV]: lv,
      [STRUCT_TOTAL]: total,
    } = __structs[i];
    let __config = node.__config;
    let {
      [NODE_REFRESH_LV]: __refreshLevel,
      [NODE_CACHE]: __cache,
      [NODE_CACHE_TOTAL]: __cacheTotal,
      [NODE_COMPUTED_STYLE]: computedStyle,
    } = __config;
    // 排除Text
    if(node instanceof Text) {
      continue;
    }
    // lv变大说明是child，相等是sibling，变小可能是parent或另一棵子树，Root节点第一个特殊处理
    if(i === 0) {
      lastList.push(node);
    }
    else if(lv > lastLv) {
      // let config = last.__config;
      // parentMatrix = last.__matrixEvent;
      parentMatrix = lastConfig[NODE_MATRIX_EVENT];
      if(mx.isE(parentMatrix)) {
        parentMatrix = null;
      }
      matrixList.push(parentMatrix);
      // parentOpacity = last.__opacity;
      parentOpacity = lastConfig[NODE_OPACITY];
      opacityList.push(parentOpacity);
      lastList.push(node);
    }
    else if(lv < lastLv) {
      let diff = lastLv - lv;
      matrixList.splice(-diff);
      parentMatrix = matrixList[lv];
      opacityList.splice(-diff);
      parentOpacity = opacityList[lv];
      lastList.splice(-diff);
      // last = lastList[lv];
      lastConfig = lastList[lv];
    }
    if(computedStyle[DISPLAY] === 'none') {
      i += (total || 0);
      continue;
    }
    // lv<REPAINT，肯定有__cache，跳过渲染过程，快速运算
    if(__refreshLevel < REPAINT) {
      let { [NODE_CURRENT_STYLE]: currentStyle, [NODE_COMPUTED_STYLE]: computedStyle } = __config;
      if(contain(__refreshLevel, TRANSFORM_ALL)) {
        let { __cacheStyle, currentStyle } = node;
        let matrix = node.__calMatrix(__refreshLevel, __cacheStyle, currentStyle, computedStyle);
        // 恶心的v8性能优化
        let m = __config[NODE_MATRIX];
        m[0] = matrix[0];
        m[1] = matrix[1];
        m[2] = matrix[2];
        m[3] = matrix[3];
        m[4] = matrix[4];
        m[5] = matrix[5];
        if(parentMatrix) {
          matrix = mx.multiply(parentMatrix, matrix);
        }
        // 恶心的v8性能优化
        m = __config[NODE_MATRIX_EVENT];
        m[0] = matrix[0];
        m[1] = matrix[1];
        m[2] = matrix[2];
        m[3] = matrix[3];
        m[4] = matrix[4];
        m[5] = matrix[5];
      }
      if(contain(__refreshLevel, OP)) {
        let opacity = computedStyle[OPACITY] = currentStyle[OPACITY];
        node.__opacity = __config[NODE_OPACITY] = parentOpacity * opacity;
      }
      if(contain(__refreshLevel, FT)) {
        let filter = computedStyle[FILTER] = currentStyle[FILTER];
        __config[NODE_BLUR_VALUE] = 0;
        if(Array.isArray(filter)) {
          filter.forEach(item => {
            let [k, v] = item;
            if(k === 'blur') {
              __config[NODE_BLUR_VALUE] = v;
            }
          });
        }
        let bbox = node.bbox;
        if(__cache) {
          __cache = node.__cache = Cache.updateCache(__cache, bbox);
        }
        else {
          __cache = node.__cache = Cache.getInstance(bbox);
        }
        __config[NODE_CACHE] = __cache;
        if(!__cache.enabled) {
          console.warn('Downgrade for cache-filter change error');
        }
      }
      if(contain(__refreshLevel, MBM)) {
        computedStyle[MIX_BLEND_MODE] = currentStyle[MIX_BLEND_MODE];
      }
      // total可以跳过所有孩子节点省略循环，filter/mask强制前提有total
      if(__cacheTotal && __cacheTotal.available) {
        i += (total || 0);
      }
    }
    /**
     * 没cache重新渲染，并根据结果判断是否离屏错误
     * geom特殊对待，因可能被开发人员继承实现自定义图形，render()传递ctx要使其无感知切换，
     * 先执行Xom的通用render()逻辑，实现__cache离屏ctx能力，然后Geom的render()会判断不再执行
     */
    else {
      if(node instanceof Geom) {
        node.__renderSelfData = node.__renderSelf(renderMode, __refreshLevel, ctx, defs, true);
        if(node.__cache && node.__cache.available) {
          node.render(renderMode, __refreshLevel, node.__cache.ctx, defs, true);
        }
      }
      else {
        node.render(renderMode, __refreshLevel, ctx, defs, true);
      }
    }
    // last = node;
    lastConfig = __config;
    lastLv = lv;
  }
  // 根据修剪的树形成LRD
  let lrd = genLRD(__structs);
  /**
   * 再后序遍历进行__cacheTotal合并，统计节点个数，有total的视为1个，排除掉Root和Text，
   * 在这个过程中，注意层级lv的变化，因为一个节点清除total后其所有父节点肯定也会清除，形成一条顶到底链路，
   * 所以比上次lv小的一定是上个节点的parent，大于的一定是另一条链路，相等一定是sibling
   * 过程中向上和平向可累计次数，另一条链路归零重新统计，mask改变一定会包含sibling的target
   * 无需判断display:none和visibility:hidden，前者已经被过滤，后者可能是total
   */
  if(lrd.length) {
    const NUM = Math.max(1, Cache.NUM);
    let prevLv = __structs[lrd[0]][STRUCT_LV], count = 0, hash = {};
    for(let i = 0, len = lrd.length - 1; i < len; i++) {
      // let {
      //   node: {
      //     computedStyle: {
      //       [POSITION]: position,
      //       [VISIBILITY]: visibility,
      //       [OVERFLOW]: overflow,
      //       [MIX_BLEND_MODE]: mixBlendMode,
      //     },
      //     __cacheTotal, __cache, __blurValue,
      //   },
      //   node, lv, index, total, hasMask,
      // } = __structs[lrd[i]];
      let {
        [STRUCT_NODE]: node,
        [STRUCT_LV]: lv,
        [STRUCT_INDEX]: index,
        [STRUCT_HAS_MASK]: hasMask,
        [STRUCT_TOTAL]: total,
      } = __structs[lrd[i]];
      let __config = node.__config;
      let {
        [NODE_COMPUTED_STYLE]: {
          [POSITION]: position,
          [VISIBILITY]: visibility,
          [OVERFLOW]: overflow,
          [MIX_BLEND_MODE]: mixBlendMode,
        },
      } = __config;
      // text一定是叶子节点
      if(node instanceof Text) {
        prevLv = lv;
        if(visibility !== 'hidden') {
          hash[lv - 1] = hash[lv - 1] || 0;
          hash[lv - 1]++;
        }
        continue;
      }
      let {
        [NODE_HAS_CONTENT]: __hasContent,
        [NODE_BLUR_VALUE]: __blurValue,
        [NODE_LIMIT_CACHE]: __limitCache,
        [NODE_CACHE_TOTAL]: __cacheTotal,
        [NODE_CACHE]: __cache,
      } = __config;
      let need;
      // <是父节点
      if(lv < prevLv) {
        prevLv = lv;
        if(visibility !== 'hidden' && __hasContent) {
          count++;
        }
        // 需累加跳链路积累的数字
        count += hash[lv] || 0;
        hash[lv] = 0;
        // 当>临界值时，进行cacheTotal合并
        if(!__limitCache
          && (count >= NUM
            || (
              (position === 'relative' || position === 'absolute')
                && (__hasContent && count || count > 1) // 防止特殊情况，即空div包含1个count的内容，或者仅自己，没必要生成
              || hasMask || __blurValue > 0 || overflow !== 'visible' || mixBlendMode !== 'normal'
            )
          )) {
          count = 0;
          hash[lv - 1] = hash[lv - 1] || 0;
          hash[lv - 1]++;
          need = true;
        }
      }
      // >是Root的另一条链路，忽略掉重新开始，之前的链路根据lv层级保存之前积累的数量供其父使用
      else if(lv > prevLv) {
        prevLv = lv;
        if(count) {
          hash[prevLv - 1] = count;
        }
        count = 0;
        if(visibility !== 'hidden' && __hasContent) {
          count++;
        }
      }
      // 相等同级继续增加计数，第1个也会进入这里
      else if(visibility !== 'hidden' && __hasContent) {
        hash[lv - 1] = hash[lv - 1] || 0;
        hash[lv - 1]++;
      }
      if(need) {
        // 有老的直接使用，没有才重新生成
        if(__cacheTotal && __cacheTotal.available) {
          continue;
        }
        __cacheTotal = __config[NODE_CACHE_TOTAL] = node.__cacheTotal
          = genTotal(renderMode, node, __limitCache, lv, index, total, __structs, __cacheTotal, __cache);
        // 超限降级继续
        if(!__cacheTotal) {
          continue;
        }
        let target = __cacheTotal;
        if(__blurValue > 0) {
          target = genFilter(node, __cacheTotal, __blurValue);
        }
        if(hasMask) {
          target = genMask(node, target, node.next.isClip);
        }
        if(overflow === 'hidden') {
          genOverflow(node, target);
        }
      }
    }
  }
  // 超尺寸的依旧要走无cache逻辑render
  let filterHash = {};
  let overflowHash = {};
  let blendHash = {};
  let maskStartHash = {};
  let maskEndHash = {};
  // 最后先序遍历一次应用__cacheTotal即可，没有的用__cache，以及剩下的超尺寸的和Text
  for(let i = 0, len = __structs.length; i < len; i++) {
    // let {
    //   node, total, hasMask, node: {
    //     __cacheOverflow, __cacheMask, __cacheFilter, __cacheTotal, __cache,
    //     __limitCache, __blurValue,
    //     computedStyle: {
    //       [DISPLAY]: display,
    //       [VISIBILITY]: visibility,
    //       [OVERFLOW]: overflow,
    //       [MIX_BLEND_MODE]: mixBlendMode,
    //     },
    //   },
    // } = __structs[i];
    let {
      [STRUCT_NODE]: node,
      [STRUCT_TOTAL]: total,
      [STRUCT_HAS_MASK]: hasMask,
    } = __structs[i];
    let {
      [NODE_OPACITY]: __opacity,
      [NODE_MATRIX_EVENT]: matrixEvent,
      [NODE_BLUR_VALUE]: __blurValue,
      [NODE_LIMIT_CACHE]: __limitCache,
      [NODE_CACHE]: __cache,
      [NODE_CACHE_TOTAL]: __cacheTotal,
      [NODE_CACHE_FILTER]: __cacheFilter,
      [NODE_CACHE_MASK]: __cacheMask,
      [NODE_CACHE_OVERFLOW]: __cacheOverflow,
      [NODE_COMPUTED_STYLE]: {
        [DISPLAY]: display,
        [VISIBILITY]: visibility,
        [OVERFLOW]: overflow,
        [MIX_BLEND_MODE]: mixBlendMode,
      },
    } = node.__config;
    // if(display === 'none') {
    //   i += (total || 0);
    //   continue;
    // }
    // text如果不可见，parent会直接跳过，不会走到这里
    if(node instanceof Text) {
      ctx.globalAlpha = __opacity;
      ctx.setTransform(matrixEvent[0], matrixEvent[1], matrixEvent[2], matrixEvent[3], matrixEvent[4], matrixEvent[5]);
      node.render(renderMode, 0, ctx, defs);
    }
    else {
      // let { __opacity, matrixEvent } = node;
      // 有total的可以直接绘制并跳过子节点索引
      let target = __cacheOverflow || __cacheMask || __cacheFilter;
      if(!target) {
        target = __cacheTotal && __cacheTotal.available ? __cacheTotal : null;
      }
      if(target) {
        if(display === 'none') {
          i += (total || 0);
          continue;
        }
        if(mixBlendMode === 'normal') {
          ctx.globalCompositeOperation = 'source-over';
        }
        else {
          ctx.globalCompositeOperation = mixBlendMode.replace(/[A-Z]/, function($0) {
            return '-' + $0.toLowerCase();
          });
        }
        if(hasMask) {
          let j = i + (total || 0) + 1;
          while(hasMask--) {
            j += (__structs[j][STRUCT_TOTAL] || 0) + 1;
          }
          i = j - 1;
        }
        i += (total || 0);
        Cache.draw(ctx, __opacity, matrixEvent, target);
        // total应用后记得设置回来
        ctx.globalCompositeOperation = 'source-over';
      }
      // 无内容Xom会没有__cache且没有__limitCache
      else if(!__limitCache) {
        if(maskStartHash.hasOwnProperty(i)) {
          ctx = maskStartHash[i].ctx;
        }
        let res;
        // 这里比较特殊，可能会有__cache但超限没被汇聚到total上，需mock出离屏对象数据
        if(__cache && __cache.available) {
          if(display === 'none') {
            i += (total || 0);
            continue;
          }
          res = {};
          let offScreenFilter, offScreenMask, offScreenOverflow, offScreenBlend;
          if(__blurValue) {
            let c = inject.getCacheCanvas(width, height);
            if(c.ctx) {
              offScreenFilter = {
                ctx,
                blur: __blurValue,
                target: c,
              };
              ctx = c.ctx;
              res.offScreenFilter = offScreenFilter;
            }
          }
          if(hasMask) {
            let j = i + (total || 0) + 1;
            while(hasMask--) {
              j += (__structs[j][STRUCT_TOTAL] || 0) + 1;
            }
            i = j - 1;
            if(offScreenFilter) {
              offScreenMask = offScreenFilter;
            }
            else {
              let c = inject.getCacheCanvas(width, height);
              if(c.ctx) {
                offScreenMask = {
                  ctx,
                  target: c,
                };
                ctx = c.ctx;
              }
            }
            res.offScreenMask = offScreenMask;
          }
          if(overflow === 'hidden') {
            if(offScreenFilter || offScreenMask) {
              offScreenOverflow = offScreenFilter || offScreenMask;
            }
            else {
              let c = inject.getCacheCanvas(width, height);
              if(c.ctx) {
                offScreenOverflow = {
                  ctx,
                  target: c,
                };
                ctx = c.ctx;
              }
            }
            res.offScreenOverflow = offScreenOverflow;
          }
          if(mixBlendMode !== 'normal') {
            if(offScreenFilter || offScreenMask || offScreenOverflow) {
              offScreenBlend = offScreenFilter || offScreenMask || offScreenOverflow;
            }
            else {
              let c = inject.getCacheCanvas(width, height);
              offScreenBlend = {
                ctx,
                target: c,
                mixBlendMode,
              };
              ctx = c.ctx;
            }
            res.offScreenBlend = offScreenBlend;
          }
          if(visibility !== 'hidden') {
            Cache.draw(ctx, __opacity, matrixEvent, __cache);
          }
        }
        // 超尺寸的特殊绘制，空的也进入
        else {
          if(node instanceof Geom) {
            res = node.__renderSelfData = node.__renderSelf(renderMode, node.__refreshLevel, ctx, defs);
          }
          else {
            res = node.render(renderMode, node.__refreshLevel, ctx, defs);
          }
          if(display === 'none') {
            i += (total || 0);
            continue;
          }
          let { offScreenFilter, offScreenMask, offScreenOverflow, offScreenBlend } = res || {};
          // filter造成的离屏，需要将后续一段孩子节点区域的ctx替换，并在结束后应用结果，再替换回来
          if(offScreenFilter) {
            let j = i + (total || 0);
            let list = filterHash[j] = filterHash[j] || [];
            // 多个节点可能共用最后一个孩子节点的索引，存时逆序，使得子节点首先应用filter
            list.unshift(offScreenFilter);
            ctx = offScreenFilter.target.ctx;
          }
          // 被遮罩的节点要为第一个遮罩和最后一个遮罩的索引打标，被遮罩的本身在一个离屏canvas，遮罩的元素在另外一个
          if(offScreenMask) {
            let j = i + (total || 0) + 1;
            let startIndex, endIndex;
            while(hasMask--) {
              // 注意这里用currentStyle当前状态而不是computedStyle上次状态
              let { total, node: { currentStyle: { [DISPLAY]: display, [VISIBILITY]: visibility } } } = __structs[j];
              if(display === 'none') {
                j += (total || 0) + 1;
                continue;
              }
              if(visibility === 'hidden') {
                j++;
                continue;
              }
              if(startIndex) {
                endIndex = j;
              }
              else {
                startIndex = endIndex = j;
              }
              j++;
            }
            let mask = inject.getCacheCanvas(width, height);
            maskStartHash[startIndex] = mask;
            // 有start一定有end
            maskEndHash[endIndex] = {
              mask,
              offScreenMask,
              isClip: __structs[startIndex][STRUCT_NODE].isClip,
            };
            ctx = offScreenMask.target.ctx;
          }
          if(offScreenBlend) {
            let j = i + (total || 0);
            let list = blendHash[j] = blendHash[j] || [];
            // 多个节点可能共用最后一个孩子节点的索引，存时逆序，使得子节点首先应用filter
            list.unshift(offScreenBlend);
            ctx = offScreenBlend.target.ctx;
          }
          // overflow:hidden的离屏，最后孩子进行截取
          if(offScreenOverflow) {
            let j = i + (total || 0);
            let list = overflowHash[j] = overflowHash[j] || [];
            list.unshift(offScreenOverflow);
            ctx = offScreenOverflow.target.ctx;
          }
          // geom传递上述offScreen的新ctx渲染，因为自定义不可控
          if(node instanceof Geom) {
            node.render(renderMode, node.__refreshLevel, ctx, defs);
          }
        }
        // 最后一个节点检查filter，有则应用，可能有多个包含自己
        if(filterHash.hasOwnProperty(i)) {
          let list = filterHash[i];
          list.forEach(offScreenFilter => {
            let webgl = inject.getCacheWebgl(width, height, '__$$blur$$__');
            let t = blur.gaussBlur(offScreenFilter.target, webgl, offScreenFilter.blur, width, height);
            t.clear();
            if(!maskStartHash.hasOwnProperty(i + 1) && !overflowHash.hasOwnProperty(i) && !blendHash.hasOwnProperty(i)) {
              let target = offScreenFilter.target;
              offScreenFilter.ctx.drawImage(target.canvas, 0, 0);
              target.draw();
              target.ctx.clearRect(0, 0, width, height);
              inject.releaseCacheCanvas(target.canvas);
              ctx = offScreenFilter.ctx;
            }
          });
        }
        // overflow在filter后面
        if(overflowHash.hasOwnProperty(i)) {
          let list = overflowHash[i];
          list.forEach(offScreenOverflow => {
            let { target, ctx: origin, x, y, outerWidth, outerHeight } = offScreenOverflow;
            ctx.globalCompositeOperation = 'destination-in';
            ctx.globalAlpha = 1;
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.fillStyle = '#FFF';
            ctx.beginPath();
            ctx.rect(x, y, outerWidth, outerHeight);
            ctx.fill();
            ctx.closePath();
            ctx.globalCompositeOperation = 'source-over';
            if(!maskStartHash.hasOwnProperty(i + 1) && !blendHash.hasOwnProperty(i)) {
              origin.drawImage(target.canvas, 0, 0);
              ctx.clearRect(0, 0, width, height);
              inject.releaseCacheCanvas(target.canvas);
              ctx = origin;
            }
          });
        }
        // 混合模式
        if(blendHash.hasOwnProperty(i)) {
          let list = blendHash[i];
          list.forEach(offScreenBlend => {
            let target = offScreenBlend.target;
            offScreenBlend.ctx.globalCompositeOperation = offScreenBlend.mixBlendMode;
            if(!maskStartHash.hasOwnProperty(i + 1)) {
              offScreenBlend.ctx.drawImage(target.canvas, 0, 0);
              target.draw();
              target.ctx.clearRect(0, 0, width, height);
              inject.releaseCacheCanvas(target.canvas);
              ctx = offScreenBlend.ctx;
              ctx.globalCompositeOperation = 'source-over';
            }
          });
        }
        // mask在最后，因为maskEnd比节点本身索引大，是其后面兄弟
        if(maskEndHash.hasOwnProperty(i)) {
          let { mask, offScreenMask, isClip } = maskEndHash[i];
          if(isClip) {
            ctx = mask.ctx;
            ctx.globalCompositeOperation = 'source-out';
            ctx.globalAlpha = 1;
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.drawImage(offScreenMask.target.canvas, 0, 0);
            mask.draw(ctx);
            ctx.globalCompositeOperation = 'source-over';
            offScreenMask.target.ctx.clearRect(0, 0, width, height);
            inject.releaseCacheCanvas(offScreenMask.target.canvas);
            ctx = offScreenMask.ctx;
            ctx.globalAlpha = 1;
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.drawImage(mask.canvas, 0, 0);
            // blendMode前面会修改主屏的，这里应用完后恢复正常
            ctx.globalCompositeOperation = 'source-over';
            mask.draw(ctx);
            mask.ctx.clearRect(0, 0, width, height);
            inject.releaseCacheCanvas(mask.canvas);
          }
          else {
            ctx = offScreenMask.target.ctx;
            ctx.globalCompositeOperation = 'destination-in';
            ctx.globalAlpha = 1;
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.drawImage(mask.canvas, 0, 0);
            mask.draw(ctx);
            ctx.globalCompositeOperation = 'source-over';
            mask.ctx.clearRect(0, 0, width, height);
            inject.releaseCacheCanvas(mask.canvas);
            ctx = offScreenMask.ctx;
            ctx.globalAlpha = 1;
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            let target = offScreenMask.target;
            ctx.drawImage(target.canvas, 0, 0);
            // blendMode前面会修改主屏的，这里应用完后恢复正常
            ctx.globalCompositeOperation = 'source-over';
            target.draw(ctx);
            target.ctx.clearRect(0, 0, width, height);
            inject.releaseCacheCanvas(offScreenMask.target.canvas);
          }
        }
      }
    }
  }
}

function renderCanvas(renderMode, ctx, defs, root) {
  let { __structs, width, height } = root;
  let filterHash = {};
  let overflowHash = {};
  let blendHash = {};
  let maskStartHash = {};
  let maskEndHash = {};
  for(let i = 0, len = __structs.length; i < len; i++) {
    // let item = __structs[i];
    // let { node, total, hasMask, node: { computedStyle } } = item;
    let {
      [STRUCT_NODE]: node,
      [STRUCT_TOTAL]: total,
      [STRUCT_HAS_MASK]: hasMask,
    } = __structs[i];
    let {
      [NODE_COMPUTED_STYLE]: computedStyle,
      [NODE_REFRESH_LV]: __refreshLevel,
    } = node.__config;
    // 第一个mask在另外一个离屏上，开始聚集所有mask元素的绘制
    if(maskStartHash.hasOwnProperty(i)) {
      ctx = maskStartHash[i].ctx;
    }
    let res;
    if(node instanceof Geom) {
      res = node.__renderSelfData = node.__renderSelf(renderMode, __refreshLevel, ctx, defs);
    }
    else {
      res = node.render(renderMode, __refreshLevel, ctx, defs);
    }
    // render后判断可见状态，此时computedStyle才有值，以及svg的virtualDom也要生成
    if(computedStyle[DISPLAY] === 'none') {
      i += (total || 0);
      continue;
    }
    let { offScreenFilter, offScreenMask, offScreenOverflow, offScreenBlend } = res || {};
    // filter造成的离屏，需要将后续一段孩子节点区域的ctx替换，并在结束后应用结果，再替换回来
    if(offScreenFilter) {
      let j = i + (total || 0);
      let list = filterHash[j] = filterHash[j] || [];
      // 多个节点可能共用最后一个孩子节点的索引，存时逆序，使得子节点首先应用filter
      list.unshift(offScreenFilter);
      ctx = offScreenFilter.target.ctx;
    }
    // 被遮罩的节点要为第一个遮罩和最后一个遮罩的索引打标，被遮罩的本身在一个离屏canvas，遮罩的元素在另外一个
    if(offScreenMask) {
      let j = i + (total || 0) + 1;
      let startIndex, endIndex;
      while(hasMask--) {
        // 注意这里用currentStyle当前状态而不是computedStyle上次状态
        let { total, node: { currentStyle: { [DISPLAY]: display, [VISIBILITY]: visibility } } } = __structs[j];
        if(display === 'none') {
          j += (total || 0) + 1;
          continue;
        }
        if(visibility === 'hidden') {
          j++;
          continue;
        }
        if(startIndex) {
          endIndex = j;
        }
        else {
          startIndex = endIndex = j;
        }
        j++;
      }
      let mask = inject.getCacheCanvas(width, height);
      maskStartHash[startIndex] = mask;
      // 有start一定有end
      maskEndHash[endIndex] = {
        mask,
        offScreenMask,
        isClip: __structs[startIndex][STRUCT_NODE].isClip,
      };
      ctx = offScreenMask.target.ctx;
    }
    if(offScreenBlend) {
      let j = i + (total || 0);
      let list = blendHash[j] = blendHash[j] || [];
      // 多个节点可能共用最后一个孩子节点的索引，存时逆序，使得子节点首先应用filter
      list.unshift(offScreenBlend);
      ctx = offScreenBlend.target.ctx;
    }
    // overflow:hidden的离屏，最后孩子进行截取
    if(offScreenOverflow) {
      let j = i + (total || 0);
      let list = overflowHash[j] = overflowHash[j] || [];
      list.unshift(offScreenOverflow);
      ctx = offScreenOverflow.target.ctx;
    }
    // geom传递上述offScreen的新ctx渲染，因为自定义不可控
    if(node instanceof Geom) {
      node.render(renderMode, __refreshLevel, ctx, defs);
    }
    // 最后一个节点检查filter，有则应用，可能有多个包含自己
    if(filterHash.hasOwnProperty(i)) {
      let list = filterHash[i];
      list.forEach(offScreenFilter => {
        let webgl = inject.getCacheWebgl(width, height, '__$$blur$$__');
        let t = blur.gaussBlur(offScreenFilter.target, webgl, offScreenFilter.blur, width, height);
        t.clear();
        if(!maskStartHash.hasOwnProperty(i + 1) && !overflowHash.hasOwnProperty(i) && !blendHash.hasOwnProperty(i)) {
          let target = offScreenFilter.target;
          offScreenFilter.ctx.drawImage(target.canvas, 0, 0);
          target.draw();
          target.ctx.clearRect(0, 0, width, height);
          inject.releaseCacheCanvas(target.canvas);
          ctx = offScreenFilter.ctx;
        }
      });
    }
    // overflow在filter后面
    if(overflowHash.hasOwnProperty(i)) {
      let list = overflowHash[i];
      list.forEach(offScreenOverflow => {
        let { target, ctx: origin, x, y, outerWidth, outerHeight } = offScreenOverflow;
        ctx.globalCompositeOperation = 'destination-in';
        ctx.globalAlpha = 1;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.rect(x, y, outerWidth, outerHeight);
        ctx.fill();
        ctx.closePath();
        ctx.globalCompositeOperation = 'source-over';
        if(!maskStartHash.hasOwnProperty(i + 1) && !blendHash.hasOwnProperty(i)) {
          origin.drawImage(target.canvas, 0, 0);
          ctx.clearRect(0, 0, width, height);
          inject.releaseCacheCanvas(target.canvas);
          ctx = origin;
        }
      });
    }
    // 混合模式
    if(blendHash.hasOwnProperty(i)) {
      let list = blendHash[i];
      list.forEach(offScreenBlend => {
        let target = offScreenBlend.target;
        offScreenBlend.ctx.globalCompositeOperation = offScreenBlend.mixBlendMode;
        if(!maskStartHash.hasOwnProperty(i + 1)) {
          offScreenBlend.ctx.drawImage(target.canvas, 0, 0);
          target.draw();
          target.ctx.clearRect(0, 0, width, height);
          inject.releaseCacheCanvas(target.canvas);
          ctx = offScreenBlend.ctx;
          ctx.globalCompositeOperation = 'source-over';
        }
      });
    }
    // mask在最后，因为maskEnd比节点本身索引大，是其后面兄弟
    if(maskEndHash.hasOwnProperty(i)) {
      let { mask, offScreenMask, isClip } = maskEndHash[i];
      if(isClip) {
        ctx = mask.ctx;
        ctx.globalCompositeOperation = 'source-out';
        ctx.globalAlpha = 1;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.drawImage(offScreenMask.target.canvas, 0, 0);
        mask.draw(ctx);
        ctx.globalCompositeOperation = 'source-over';
        offScreenMask.target.ctx.clearRect(0, 0, width, height);
        inject.releaseCacheCanvas(offScreenMask.target.canvas);
        ctx = offScreenMask.ctx;
        ctx.globalAlpha = 1;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.drawImage(mask.canvas, 0, 0);
        // blendMode前面会修改主屏的，这里应用完后恢复正常
        ctx.globalCompositeOperation = 'source-over';
        mask.draw(ctx);
        mask.ctx.clearRect(0, 0, width, height);
        inject.releaseCacheCanvas(mask.canvas);
      }
      else {
        ctx = offScreenMask.target.ctx;
        ctx.globalCompositeOperation = 'destination-in';
        ctx.globalAlpha = 1;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.drawImage(mask.canvas, 0, 0);
        mask.draw(ctx);
        ctx.globalCompositeOperation = 'source-over';
        mask.ctx.clearRect(0, 0, width, height);
        inject.releaseCacheCanvas(mask.canvas);
        ctx = offScreenMask.ctx;
        ctx.globalAlpha = 1;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        let target = offScreenMask.target;
        ctx.drawImage(target.canvas, 0, 0);
        // blendMode前面会修改主屏的，这里应用完后恢复正常
        ctx.globalCompositeOperation = 'source-over';
        target.draw(ctx);
        target.ctx.clearRect(0, 0, width, height);
        inject.releaseCacheCanvas(offScreenMask.target.canvas);
      }
    }
  }
}

function renderSvg(renderMode, ctx, defs, root) {
  let { __structs, width, height } = root;
  let maskHash = {};
  // 栈代替递归，存父节点的matrix/opacity，matrix为E时存null省略计算
  let parentMatrixList = [];
  let parentMatrix;
  let parentVdList = [];
  let parentVd;
  let lastLv = 0;
  let last;
  for(let i = 0, len = __structs.length; i < len; i++) {
    let item = __structs[i];
    // let { node, node: { __cacheTotal, __refreshLevel }, total, lv, hasMask } = item;
    let {
      [STRUCT_NODE]: node,
      [STRUCT_TOTAL]: total,
      [STRUCT_HAS_MASK]: hasMask,
      [STRUCT_LV]: lv,
    } = __structs[i];
    // let {
    //   __cacheTotal,
    //   __refreshLevel,
    // } = node;
    let {
      [NODE_CACHE_TOTAL]: __cacheTotal,
      [NODE_REFRESH_LV]: __refreshLevel,
    } = node.__config;
    if(hasMask) {
      let start = i + (total || 0) + 1;
      let end = start + hasMask;
      // svg限制了只能Geom单节点，不可能是Dom
      maskHash[end - 1] = {
        index: i,
        start,
        end,
        isClip: __structs[start][STRUCT_NODE].isClip,
      };
    }
    // lv变大说明是child，相等是sibling，变小可能是parent或另一棵子树，Root节点第一个特殊处理
    if(lv < lastLv) {
      parentMatrixList.splice(lv);
      parentMatrix = parentMatrixList[lv - 1];
      parentVdList.splice(lv);
      parentVd = parentVdList[lv - 1];
    }
    else if(lv > lastLv) {
      parentMatrixList.push(last.__matrix);
      let vd = last.virtualDom;
      parentVdList.push(vd);
      parentVd = vd;
    }
    let virtualDom;
    // svg小刷新等级时直接修改vd，这样Geom不再感知
    if(__refreshLevel < REPAINT && !(node instanceof Text)) {
      virtualDom = node.virtualDom;
      // total可以跳过所有孩子节点省略循环
      if(__cacheTotal && __cacheTotal.available) {
        i += (total || 0);
        virtualDom.cache = true;
      }
      else {
        __cacheTotal && (__cacheTotal.available = true);
        virtualDom = node.__virtualDom = util.extend({}, virtualDom);
        if(node instanceof Dom && !(node instanceof Img)) {
          virtualDom.children = [];
        }
        delete virtualDom.cache;
      }
      let { currentStyle, computedStyle } = node;
      if(contain(__refreshLevel, TRANSFORM_ALL)) {
        let { __cacheStyle, currentStyle } = node;
        let matrix = node.__matrix = node.__renderMatrix = node.__calMatrix(__refreshLevel, __cacheStyle, currentStyle, computedStyle);
        if(mx.isE(matrix)) {
          delete virtualDom.transform;
        }
        else {
          virtualDom.transform = 'matrix(' + util.joinArr(matrix, ',') + ')';
        }
        if(parentMatrix) {
          matrix = mx.multiply(parentMatrix, matrix);
        }
        node.__matrixEvent = matrix;
      }
      if(contain(__refreshLevel, OP)) {
        let opacity = computedStyle[OPACITY] = currentStyle[OPACITY];
        if(opacity === 1) {
          delete virtualDom.opacity;
        }
        else {
          virtualDom.opacity = opacity;
        }
      }
      if(contain(__refreshLevel, FT)) {
        let filter = computedStyle[FILTER] = currentStyle[FILTER];
        delete virtualDom.filter;
        if(Array.isArray(filter)) {
          filter.forEach(item => {
            let [k, v] = item;
            if(k === 'blur') {
              if(v > 0) {
                let d = mx.int2convolution(v);
                let { outerWidth, outerHeight } = node;
                let id = defs.add({
                  tagName: 'filter',
                  props: [
                    ['x', -d / outerWidth],
                    ['y', -d / outerHeight],
                    ['width', 1 + d * 2 / outerWidth],
                    ['height', 1 + d * 2 / outerHeight],
                  ],
                  children: [
                    {
                      tagName: 'feGaussianBlur',
                      props: [
                        ['stdDeviation', v],
                      ],
                    }
                  ],
                });
                virtualDom.filter = 'url(#' + id + ')';
              }
            }
          });
        }
      }
      if(contain(__refreshLevel, MBM)) {
        let mixBlendMode = computedStyle[MIX_BLEND_MODE] = currentStyle[MIX_BLEND_MODE];
        if(mixBlendMode !== 'normal') {
          virtualDom.mixBlendMode = mixBlendMode;
        }
        else {
          delete virtualDom.mixBlendMode;
        }
      }
      virtualDom.lv = __refreshLevel;
    }
    else {
      if(node instanceof Geom) {
        node.__renderSelfData = node.__renderSelf(renderMode, __refreshLevel, ctx, defs);
      }
      node.render(renderMode, __refreshLevel, ctx, defs);
      virtualDom = node.virtualDom;
    }
    let { computedStyle: { [DISPLAY]: display } } = node;
    if(display === 'none') {
      i += (total || 0);
    }
    if(maskHash.hasOwnProperty(i)) {
      let { index, start, end, isClip } = maskHash[i];
      let target = __structs[index];
      let dom = target[STRUCT_NODE];
      let mChildren = [];
      // clip模式时，先添加兜底整个白色使得全部都可见，mask本身变反色（黑色）
      if(isClip) {
        mChildren.push({
          type: 'item',
          tagName: 'path',
          props: [
            ['d', `M0,0L${width},0L${width},${height}L0,${height}L0,0`],
            ['fill', 'rgba(255,255,255,1)'],
            ['stroke-width', 0],
          ],
        });
      }
      for(let j = start; j < end; j++) {
        let node = __structs[j][STRUCT_NODE];
        let { computedStyle: { [DISPLAY]: display, [VISIBILITY]: visibility, [FILL]: fill }, virtualDom: { children } } = node;
        if(display !== 'none' && visibility !== 'hidden') {
          mChildren = mChildren.concat(children);
          for(let k = 0, len = children.length; k < len; k++) {
            let { tagName, props } = children[k];
            if(tagName === 'path') {
              if(isClip) {
                for(let j = 0, len = props.length; j < len; j++) {
                  let item = props[j];
                  if(item[0] === 'fill') {
                    item[1] = util.int2invert(fill);
                  }
                }
              }
              let matrix = node.renderMatrix;
              let inverse = mx.inverse(dom.renderMatrix);
              matrix = mx.multiply(matrix, inverse);
              let len = props.length;
              // transform属性放在最后一个省去循环
              if(!len || props[len - 1][0] !== 'transform') {
                props.push(['transform', `matrix(${matrix})`]);
              }
              else {
                props[len - 1][1] = `matrix(${matrix})`;
              }
            }
          }
        }
        let id = defs.add({
          tagName: 'mask',
          props: [],
          children: mChildren,
        });
        id = 'url(#' + id + ')';
        dom.virtualDom.mask = id;
      }
    }
    // mask不入children
    if(parentVd && !node.isMask) {
      parentVd.children.push(virtualDom);
    }
    if(i === 0) {
      parentMatrix = node.__matrix;
      parentVd = virtualDom;
    }
    lastLv = lv;
    last = node;
  }
}

export default {
  renderCacheCanvas,
  renderCanvas,
  renderSvg,
};

