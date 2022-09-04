import Cache from './Cache';
import offscreen from './offscreen';
import Text from '../node/Text';
import Dom from '../node/Dom';
import Img from '../node/Img';
import mode from './mode';
import mx from '../math/matrix';
import geom from '../math/geom';
import level from './level';
import painter from '../util/painter';
import util from '../util/util';
import inject from '../util/inject';
import tf from '../style/transform';
import mbm from '../style/mbm';
import enums from '../util/enums';
import webgl from '../gl/webgl';
import MockCache from '../gl/MockCache';
import blur from '../math/blur';
import vertexBlur from '../gl/filter/blur.vert';
import fragmentBlur from '../gl/filter/blur.frag';
import vertexMbm from '../gl/mbm/mbm.vert';
import fragmentMultiply from '../gl/mbm/multiply.frag';
import fragmentScreen from '../gl/mbm/screen.frag';
import fragmentOverlay from '../gl/mbm/overlay.frag';
import fragmentDarken from '../gl/mbm/darken.frag';
import fragmentLighten from '../gl/mbm/lighten.frag';
import fragmentColorDodge from '../gl/mbm/color-dodge.frag';
import fragmentColorBurn from '../gl/mbm/color-burn.frag';
import fragmentHardLight from '../gl/mbm/hard-light.frag';
import fragmentSoftLight from '../gl/mbm/soft-light.frag';
import fragmentDifference from '../gl/mbm/difference.frag';
import fragmentExclusion from '../gl/mbm/exclusion.frag';
import fragmentHue from '../gl/mbm/hue.frag';
import fragmentSaturation from '../gl/mbm/saturation.frag';
import fragmentColor from '../gl/mbm/color.frag';
import fragmentLuminosity from '../gl/mbm/luminosity.frag';

const { NA, LOCAL, CHILD, SELF, getCache } = Cache;
const {
  OFFSCREEN_OVERFLOW,
  OFFSCREEN_FILTER,
  OFFSCREEN_MASK,
  OFFSCREEN_BLEND,
  OFFSCREEN_MASK2,
  applyOffscreen,
} = offscreen;

const {
  STYLE_KEY: {
    DISPLAY,
    OPACITY,
    VISIBILITY,
    FILTER,
    OVERFLOW,
    MIX_BLEND_MODE,
    FILL,
    TRANSFORM,
    TRANSFORM_ORIGIN,
    PERSPECTIVE,
    PERSPECTIVE_ORIGIN,
    PADDING_LEFT,
    PADDING_RIGHT,
    PADDING_TOP,
    PADDING_BOTTOM,
    BORDER_TOP_WIDTH,
    BORDER_RIGHT_WIDTH,
    BORDER_BOTTOM_WIDTH,
    BORDER_LEFT_WIDTH,
    MATRIX,
  },
} = enums;
const {
  NONE,
  TRANSFORM_ALL,
  OPACITY: OP,
  FILTER: FT,
  REPAINT,
  contain,
  MIX_BLEND_MODE: MBM,
  PERSPECTIVE: PPT,
  MASK,
  CACHE,
} = level;
const { isE, inverse, multiply } = mx;
const { mbmName, isValidMbm } = mbm;
const { assignMatrix, transformBbox } = util;

/**
 * 生成一个节点及其子节点所包含的矩形范围盒，canvas和webgl的最大尺寸限制不一样，由外部传入
 * 如果某个子节点超限，则视为整个超限，超限返回空
 * @param node
 * @param __structs
 * @param index
 * @param total
 * @param parentIndexHash
 * @param opacityHash
 * @param MAX
 * @param includeLimitCache webgl时即便超限也要强制生成total，所以标识不能跳出
 * @returns {*}
 */
function genBboxTotal(node, __structs, index, total, parentIndexHash, opacityHash, MAX, includeLimitCache) {
  let { __sx1: sx1, __sy1: sy1, __cache } = node;
  let {
    [FILTER]: filter,
    [PERSPECTIVE]: perspective,
    [PERSPECTIVE_ORIGIN]: perspectiveOrigin,
  } = node.__computedStyle;
  // 先将局部根节点的bbox算好，可能没内容是空
  let bboxTotal;
  if(__cache && __cache.__available) {
    bboxTotal = __cache.bbox;
  }
  else {
    bboxTotal = node.filterBbox;
  }
  bboxTotal = bboxTotal.slice(0);
  // 局部根节点如有perspective，则计算pm，这里不会出现嵌套，因为每个出现都会生成局部根节点
  let pm;
  if(perspective) {
    pm = tf.calPerspectiveMatrix(perspective, perspectiveOrigin);
  }
  // 广度遍历，不断一层层循环下去，用2个hash暂存每层的父matrix和opacity，blur只需记住顶层，因为子的如果有一定是cacheFilter
  let list = [index];
  let d = 0;
  filter.forEach(item => {
    let [k, v] = item;
    if(k === 'blur') {
      d = blur.outerSize(v);
    }
  });
  opacityHash[index] = 1;
  // opacity可以保存下来层级相乘结果供外部使用，但matrix不可以，因为这里按画布原点为坐标系计算，外部合并局部根节点以bbox左上角为原点
  let matrixHash = {};
  while(list.length) {
    let arr = list.splice(0);
    for(let i = 0, len = arr.length; i < len; i++) {
      let parentIndex = arr[i];
      let total = __structs[parentIndex].total || 0;
      for(let i = parentIndex + 1, len = parentIndex + total + 1; i < len; i++) {
        let {
          node: node2,
          total,
        } = __structs[i];
        // mask也不占bbox位置
        if(node2.__isMask) {
          continue;
        }
        let {
          __sx1,
          __sy1,
          __cache,
          __cacheTotal,
          __cacheFilter,
          __cacheMask,
          __cacheOverflow,
          __limitCache,
          computedStyle: {
            [DISPLAY]: display,
            [VISIBILITY]: visibility,
            [TRANSFORM]: transform,
            [TRANSFORM_ORIGIN]: transformOrigin,
            [OPACITY]: opacity,
          },
        } = node2;
        // webgl不能跳过超限
        if(__limitCache && !includeLimitCache) {
          return;
        }
        // display:none跳过整个节点树，visibility只跳过自身
        if(display === 'none') {
          i += total || 0;
          continue;
        }
        if(visibility === 'hidden') {
          continue;
        }
        parentIndexHash[i] = parentIndex;
        opacityHash[i] = opacityHash[parentIndex] * opacity;
        let bbox, dx = 0, dy = 0, hasTotal;
        // text不能用filter
        if(node2 instanceof Text) {
          bbox = node2.bbox;
        }
        else {
          let target = getCache([__cacheMask, __cacheFilter, __cacheOverflow, __cacheTotal]);
          if(target) {
            bbox = target.bbox;
            dx = target.dbx;
            dy = target.dby;
            i += total || 0;
            hasTotal = true;
          }
          else if(__cache && __cache.__available) {
            bbox = __cache.bbox;
            dx = __cache.dbx;
            dy = __cache.dby;
          }
          else {
            bbox = node2.filterBbox;
          }
        }
        // 可能Xom没有内容
        if(bbox) {
          bbox = bbox.slice(0);
          // 相对于根节点偏移
          bbox[0] -= sx1;
          bbox[1] -= sy1;
          bbox[2] -= sx1;
          bbox[3] -= sy1;
          let matrix = matrixHash[parentIndex];
          // 父级matrix初始化E为null，自身不为E时才运算，可以加速
          if(transform && !isE(transform)) {
            let tfo = transformOrigin.slice(0);
            // total下的节点tfo的计算，以total为原点，差值坐标即相对坐标
            tfo[0] += __sx1 - sx1 + dx;
            tfo[1] += __sy1 - sy1 + dy;
            let m = tf.calMatrixByOrigin(transform, tfo);
            if(matrix) {
              matrix = multiply(matrix, m);
            }
            else {
              matrix = m;
            }
          }
          if(matrix) {
            matrixHash[i] = matrix;
          }
          if(pm) {
            matrix = multiply(pm, matrix);
          }
          bbox = transformBbox(bbox, matrix, d, d);
          // 有孩子才继续存入下层级广度运算
          if(total && !hasTotal) {
            list.push(i);
          }
          mergeBbox(bboxTotal, bbox, sx1, sy1);
        }
      }
    }
  }
  return [bboxTotal, pm];
}

function mergeBbox(bbox, t, sx1, sy1) {
  bbox[0] = Math.min(bbox[0], sx1 + t[0]);
  bbox[1] = Math.min(bbox[1], sy1 + t[1]);
  bbox[2] = Math.max(bbox[2], sx1 + t[2]);
  bbox[3] = Math.max(bbox[3], sy1 + t[3]);
}

/**
 * 生成局部根节点离屏缓存，超限时除外
 * cache是每个节点自身的缓存，且共享离屏canvas
 * cacheTotal是基础
 * cacheFilter基于total
 * cacheOverflow基于filter
 * cacheMask基于overflow
 * cacheBlend基于mask
 * @param renderMode
 * @param node
 * @param index
 * @param lv
 * @param total
 * @param __structs
 * @param hasMask
 * @param width
 * @param height
 * @returns {{enabled}|Cache|*}
 */
function genTotal(renderMode, node, index, lv, total, __structs, hasMask, width, height) {
  let __cacheTotal = node.__cacheTotal;
  // 先绘制形成基础的total，有可能已经存在无变化，就可省略
  if(!__cacheTotal || !__cacheTotal.__available) {
    let { __sx1: sx1, __sy1: sy1, bbox } = node;
    // 局部根节点视为E且无透明度，用bbox而非filterBbox
    let bboxTotal = bbox.slice(0);
    node.__matrixEvent = mx.identity();
    node.__opacity = 1;
    // 先遍历每个节点，以局部根节点左上角为原点，求得所占的总的bbox，即合并所有bbox
    for(let i = index + 1, len = index + (total || 0) + 1; i < len; i++) {
      let {
        node,
        total,
        hasMask,
      } = __structs[i];
      // Text特殊处理，因为有stroke描边
      if(node instanceof Text) {
        let bbox = node.filterBbox, matrix = node.__domParent.__matrixEvent;
        if(!isE(matrix)) {
          bbox = transformBbox(bbox, matrix, 0, 0);
        }
        mergeBbox(bboxTotal, bbox, 0, 0);
        continue;
      }
      let {
        __computedStyle: __computedStyle2,
        __isMask,
      } = node;
      // 跳过display:none元素和它的所有子节点和mask，本身是mask除外
      if(__computedStyle2[DISPLAY] === 'none' || i !== index && __isMask) {
        i += (total || 0);
        if(hasMask) {
          i += countMaskNum(__structs, i + 1, hasMask);
        }
        continue;
      }
      let {
        __cacheTotal: __cacheTotal2,
        __cacheFilter: __cacheFilter2,
        __cacheMask: __cacheMask2,
        __cacheOverflow: __cacheOverflow2,
      } = node;
      let p = node.__domParent;
      node.__opacity = __computedStyle2[OPACITY] * p.__opacity;
      let matrix = multiply(node.__matrix, p.__matrixEvent);
      assignMatrix(node.__matrixEvent, matrix);
      let bbox;
      // 子元素有cacheTotal优先使用
      let target = getCache([__cacheMask2, __cacheFilter2, __cacheOverflow2, __cacheTotal2]);
      // 局部根节点的total不需要考虑filter，子节点要
      if(target) {
        i += (total || 0);
        if(hasMask) {
          i += countMaskNum(__structs, i + 1, hasMask);
        }
        bbox = target.bbox;
      }
      else {
        bbox = node.filterBbox;
      }
      // 老的不变，新的会各自重新生成，根据matrixEvent合并bboxTotal
      bbox = transformBbox(bbox, matrix, 0, 0);
      mergeBbox(bboxTotal, bbox, 0, 0);
    }

    // 生成cacheTotal，获取偏移dx/dy
    __cacheTotal = node.__cacheTotal = Cache.getInstance(bboxTotal, sx1, sy1);
    if(!__cacheTotal || !__cacheTotal.__enabled) {
      inject.warn('Cache of ' + node.tagName + '(' + index + ')' + ' is oversize: '
        + (bboxTotal[2] - bboxTotal[0]) + ', ' + (bboxTotal[3] - bboxTotal[1]));
      return;
    }
    __cacheTotal.__available = true;
    let { dx, dy, dbx, dby, x: tx, y: ty } = __cacheTotal;
    let ctxTotal = __cacheTotal.ctx;

    /**
     * 再次遍历每个节点，以局部根节点左上角为基准原点，将所有节点绘制上去
     * 每个子节点的opacity有父继承计算在上面循环已经做好了，直接获取
     * 但matrixEvent可能需要重算，因为原点不一定是根节点的原点，影响tfo
     * 另外每个节点的refreshLevel需要设置REPAINT
     * 这样cacheTotal取消时子节点需确保重新计算一次matrix/opacity/filter，保证下次和父元素继承正确
     */
    let matrixList = [];
    let parentMatrix = null;
    let lastMatrix = null;
    let lastLv = lv;
    // 和外面没cache的类似，mask生成hash记录
    let maskStartHash = {};
    let offscreenHash = {};
    for(let i = index, len = index + (total || 0) + 1; i < len; i++) {
      let {
        node,
        lv,
        total,
        hasMask,
      } = __structs[i];
      // 排除Text
      if(node instanceof Text) {
        node.render(renderMode, ctxTotal, dx, dy);
        if(offscreenHash.hasOwnProperty(i)) {
          ctxTotal = applyOffscreen(ctxTotal, offscreenHash[i], width, height, false);
        }
      }
      else {
        let __computedStyle2 = node.__computedStyle;
        // none跳过这棵子树，判断下最后一个节点的离屏应用即可
        if(__computedStyle2[DISPLAY] === 'none') {
          i += (total || 0);
          if(hasMask) {
            i += countMaskNum(__structs, i + 1, hasMask);
          }
          if(offscreenHash.hasOwnProperty(i)) {
            ctxTotal = applyOffscreen(ctxTotal, offscreenHash[i], width, height, true);
          }
          continue;
        }
        let {
          __cacheTotal: __cacheTotal2,
          __cacheFilter: __cacheFilter2,
          __cacheMask: __cacheMask2,
          __cacheOverflow: __cacheOverflow2,
        } = node;
        let {
          [TRANSFORM]: transform,
          [TRANSFORM_ORIGIN]: tfo,
        } = __computedStyle2;
        if(maskStartHash.hasOwnProperty(i)) {
          let { idx, hasMask, offscreenMask } = maskStartHash[i];
          let target = inject.getCacheCanvas(width, height, null, 'mask2');
          offscreenMask.mask = target; // 应用mask用到
          offscreenMask.isClip = node.__isClip;
          // 定位到最后一个mask元素上的末尾
          let j = i + (total || 0) + 1;
          while(--hasMask) {
            let { total } = __structs[j];
            j += (total || 0) + 1;
          }
          j--;
          let list = offscreenHash[j] = offscreenHash[j] || [];
          list.push({ idx, lv, type: OFFSCREEN_MASK, offscreen: offscreenMask });
          list.push({ idx: j, lv, type: OFFSCREEN_MASK2, offscreen: {
            ctx: ctxTotal, // 保存等待OFFSCREEN_MASK2时还原
            target,
          }});
          ctxTotal = target.ctx;
        }
        // lv变大说明是child，相等是sibling，变小可能是parent或另一棵子树，根节点是第一个特殊处理
        if(i === index) {}
        else if(lv > lastLv) {
          parentMatrix = lastMatrix;
          if(isE(parentMatrix)) {
            parentMatrix = null;
          }
          matrixList.push(parentMatrix);
        }
        // 变小出栈索引需注意，可能不止一层，多层计算diff层级
        else if(lv < lastLv) {
          let diff = lastLv - lv;
          matrixList.splice(-diff);
          parentMatrix = matrixList[lv - 1];
        }
        // 不变是同级兄弟，无需特殊处理 else {}
        lastLv = lv;
        // 特殊渲染的matrix，局部根节点为原点考虑，当需要计算时（不为E）再计算
        let m;
        if(i !== index && (!isE(parentMatrix) || !isE(transform))) {
          tfo = tfo.slice(0);
          tfo[0] += dbx + node.__sx1 - sx1 + tx;
          tfo[1] += dby + node.__sy1 - sy1 + ty;
          m = tf.calMatrixByOrigin(transform, tfo);
          if(!isE(parentMatrix)) {
            m = multiply(parentMatrix, m);
          }
        }
        else {
          m = null;
        }
        if(m) {
          ctxTotal.setTransform(m[0], m[1], m[4], m[5], m[12], m[13]);
        }
        else {
          ctxTotal.setTransform(1, 0, 0, 1, 0, 0);
        }
        lastMatrix = m;
        ctxTotal.globalAlpha = node.__opacity;
        // 子元素有cacheTotal优先使用
        let target = i > index && getCache([__cacheMask2, __cacheFilter2, __cacheOverflow2, __cacheTotal2]);
        if(target) {
          i += (total || 0);
          if(hasMask) {
            i += countMaskNum(__structs, i + 1, hasMask);
          }
          let mixBlendMode = __computedStyle2[MIX_BLEND_MODE];
          if(isValidMbm(mixBlendMode)) {
            ctxTotal.globalCompositeOperation = mbmName(mixBlendMode);
          }
          Cache.drawCache(target, __cacheTotal);
          ctxTotal.globalCompositeOperation = 'source-over';
          if(offscreenHash.hasOwnProperty(i)) {
            ctxTotal = applyOffscreen(ctxTotal, offscreenHash[i], width, height, false);
          }
        }
        else {
          let res = node.render(renderMode, ctxTotal, dx, dy);
          let { offscreenBlend, offscreenMask, offscreenFilter, offscreenOverflow } = res || {};
          // 这里离屏顺序和xom里返回的一致，和下面应用离屏时的list相反
          if(offscreenBlend) {
            let j = i + (total || 0);
            if(hasMask) {
              j += countMaskNum(__structs, j + 1, hasMask);
            }
            let list = offscreenHash[j] = offscreenHash[j] || [];
            list.push({ idx: i, lv, type: OFFSCREEN_BLEND, offscreen: offscreenBlend });
            ctxTotal = offscreenBlend.target.ctx;
          }
          // 被遮罩的节点要为第一个遮罩和最后一个遮罩的索引打标，被遮罩的本身在一个离屏canvas，遮罩的元素在另外一个
          // 最后一个遮罩索引因数量不好计算，放在maskStartHash做
          if(offscreenMask) {
            let j = i + (total || 0);
            maskStartHash[j + 1] = {
              idx: i,
              hasMask,
              offscreenMask,
            };
            ctxTotal = offscreenMask.target.ctx;
          }
          // filter造成的离屏，需要将后续一段孩子节点区域的ctx替换，并在结束后应用结果，再替换回来
          if(offscreenFilter) {
            let j = i + (total || 0);
            if(hasMask) {
              j += countMaskNum(__structs, j + 1, hasMask);
            }
            let list = offscreenHash[j] = offscreenHash[j] || [];
            list.push({ idx: i, lv, type: OFFSCREEN_FILTER, offscreen: offscreenFilter });
            ctxTotal = offscreenFilter.target.ctx;
          }
          // overflow:hidden的离屏，最后孩子进行截取
          if(offscreenOverflow) {
            let j = i + (total || 0);
            if(hasMask) {
              j += countMaskNum(__structs, j + 1, hasMask);
            }
            let list = offscreenHash[j] = offscreenHash[j] || [];
            list.push({ idx: i, lv, type: OFFSCREEN_OVERFLOW, offscreen: offscreenOverflow });
            ctxTotal = offscreenOverflow.target.ctx;
          }
          // 离屏应用，按照lv从大到小即子节点在前先应用，同一个节点多个效果按offscreen优先级从小到大来，
          // 由于mask特殊索引影响，所有离屏都在最后一个mask索引判断，此时mask本身优先结算，以index序大到小判断
          if(offscreenHash.hasOwnProperty(i)) {
            ctxTotal = applyOffscreen(ctxTotal, offscreenHash[i], width, height, false);
          }
        }
      }
    }
  }
  return __cacheTotal;
}

// 从cacheTotal生成overflow、filter和mask，一定有cacheTotal才会进
function genTotalOther(renderMode, __structs, __cacheTotal, node, hasMask, width, height) {
  let {
    __computedStyle,
    __cacheOverflow,
    __cacheFilter,
    __cacheMask,
  } = node;
  let {
    [OVERFLOW]: overflow,
    [FILTER]: filter,
  } = __computedStyle;
  let target = __cacheTotal;
  if(overflow === 'hidden') {
    if(!__cacheOverflow || !__cacheOverflow.available) {
      node.__cacheOverflow = __cacheOverflow = Cache.genOverflow(target, node);
    }
    if(__cacheOverflow && __cacheOverflow.available) {
      target = __cacheOverflow;
    }
  }
  if(filter && filter.length) {
    if(!__cacheFilter || !__cacheFilter.available) {
      node.__cacheFilter = __cacheFilter = Cache.genFilter(target, filter);
    }
    if(__cacheFilter && __cacheFilter.available) {
      target = __cacheFilter;
    }
  }
  if(hasMask && (!__cacheMask || !__cacheMask.available)) {
    node.__cacheMask = __cacheMask = Cache.genMask(target, node, function(item, cacheMask, inverse) {
      // 和外面没cache的类似，mask生成hash记录，这里mask节点一定是个普通无cache的独立节点
      let maskStartHash = {};
      let offscreenHash = {};
      let { dx, dy, dbx, dby, x: tx, y: ty, ctx } = cacheMask;
      let {
        index,
        total,
        lv,
      } = item.__struct;
      let matrixList = [];
      let parentMatrix = null;
      let lastMatrix = null;
      let opacityList = [];
      let parentOpacity = 1;
      let lastOpacity = 1;
      let lastLv = lv;
      for(let i = index, len = index + (total || 0) + 1; i < len; i++) {
        let {
          node,
          lv,
          total,
          hasMask,
        } = __structs[i];
        // 排除Text
        if(node instanceof Text) {
          node.render(renderMode, ctx, dx, dy);
          if(offscreenHash.hasOwnProperty(i)) {
            ctx = applyOffscreen(ctx, offscreenHash[i], width, height, false);
          }
        }
        else {
          let __computedStyle = node.__computedStyle;
          // none跳过这棵子树，判断下最后一个节点的离屏应用即可
          if(__computedStyle[DISPLAY] === 'none') {
            i += (total || 0) + countMaskNum(__structs, i + (total || 0) + 1, hasMask || 0);
            if(offscreenHash.hasOwnProperty(i - 1)) {
              ctx = applyOffscreen(ctx, offscreenHash[i - 1], width, height, true);
            }
            continue;
          }
          let {
            __cacheTotal,
            __cacheFilter,
            __cacheMask,
            __cacheOverflow,
          } = node;
          if(maskStartHash.hasOwnProperty(i)) {
            let { idx, hasMask, offscreenMask } = maskStartHash[i];
            let target = inject.getCacheCanvas(width, height, null, 'mask2');
            offscreenMask.mask = target; // 应用mask用到
            offscreenMask.isClip = node.__isClip;
            // 定位到最后一个mask元素上的末尾
            let j = i + (total || 0) + 1;
            while(--hasMask) {
              let { total } = __structs[j];
              j += (total || 0) + 1;
            }
            j--;
            let list = offscreenHash[j] = offscreenHash[j] || [];
            list.push({ idx, lv, type: OFFSCREEN_MASK, offscreen: offscreenMask });
            list.push({ idx: j, lv, type: OFFSCREEN_MASK2, offscreen: {
              ctx, // 保存等待OFFSCREEN_MASK2时还原
              target,
            }});
            ctx = target.ctx;
          }
          // lv变大说明是child，相等是sibling，变小可能是parent或另一棵子树，根节点是第一个特殊处理
          if(i === index) {}
          else if(lv > lastLv) {
            parentMatrix = lastMatrix;
            if(isE(parentMatrix)) {
              parentMatrix = null;
            }
            matrixList.push(parentMatrix);
            parentOpacity = lastOpacity;
            opacityList.push(parentOpacity);
          }
          // 变小出栈索引需注意，可能不止一层，多层计算diff层级
          else if(lv < lastLv) {
            let diff = lastLv - lv;
            matrixList.splice(-diff);
            parentMatrix = matrixList[lv - 1];
            opacityList.splice(-diff);
            parentOpacity = opacityList[lv - 1];
          }
          // 不变是同级兄弟，无需特殊处理 else {}
          lastLv = lv;
          // 计算临时的matrix，先以此节点为局部根节点原点，后面考虑逆矩阵
          let {
            [TRANSFORM]: transform,
            [TRANSFORM_ORIGIN]: tfo,
            [OPACITY]: opacity, // 和genTotal不同，局部根节点opacity生效不为1
          } = __computedStyle;
          if(i !== index) {
            opacity *= parentOpacity;
          }
          ctx.globalAlpha = node.__opacity = lastOpacity = opacity;
          // 特殊渲染的matrix，局部根节点为原点且考虑根节点自身的transform
          let m;
          if(!isE(transform)) {
            tfo = tfo.slice(0);
            tfo[0] += dbx + tx;
            tfo[1] += dby + ty;
            m = tf.calMatrixByOrigin(transform, tfo);
          }
          else {
            m = null;
          }
          if(!isE(parentMatrix)) {
            m = multiply(parentMatrix, m);
          }
          lastMatrix = m;
          if(m) {
            assignMatrix(node.__matrixEvent, m);
            // 很多情况mask和target相同matrix，可简化计算
            if(util.equalArr(m, inverse)) {
              ctx.setTransform(1, 0, 0, 1, 0, 0);
            }
            else {
              inverse = mx.inverse(inverse);
              m = mx.multiply(inverse, m);
              ctx.setTransform(m[0], m[1], m[4], m[5], m[12], m[13]);
            }
          }
          else {
            assignMatrix(node.__matrixEvent, mx.identity());
            if(isE(inverse)) {
              ctx.setTransform(1, 0, 0, 1, 0, 0);
            }
            else {
              m = mx.inverse(inverse);
              ctx.setTransform(m[0], m[1], m[4], m[5], m[12], m[13]);
            }
          }
          // 特殊渲染的matrix，局部根节点为原点考虑，本节点需inverse反向
          let target = getCache([__cacheMask, __cacheFilter, __cacheOverflow, __cacheTotal]);
          if(target) {
            i += (total || 0) + countMaskNum(__structs, i + (total || 0) + 1, hasMask || 0);
            let mixBlendMode = __computedStyle[MIX_BLEND_MODE];
            if(isValidMbm(mixBlendMode)) {
              ctx.globalCompositeOperation = mbmName(mixBlendMode);
            }
            else {
              ctx.globalCompositeOperation = 'source-over';
            }
            let { x, y, canvas, width, height } = target;
            ctx.drawImage(canvas, x, y, width, height, cacheMask.x, cacheMask.y, width, height);
            ctx.globalCompositeOperation = 'source-over';
            if(offscreenHash.hasOwnProperty(i)) {
              ctx = applyOffscreen(ctx, offscreenHash[i], width, height, false);
            }
          }
          // 等于将外面bbox计算和渲染合一的过程，但不需要bbox本身的内容
          else {
            let res = node.render(renderMode, ctx, dx, dy);
            let { offscreenBlend, offscreenMask, offscreenFilter, offscreenOverflow } = res || {};
            // 这里离屏顺序和xom里返回的一致，和下面应用离屏时的list相反
            if(offscreenBlend) {
              let j = i + (total || 0) + countMaskNum(__structs, i + (total || 0) + 1, hasMask || 0);
              let list = offscreenHash[j] = offscreenHash[j] || [];
              list.push([i, lv, OFFSCREEN_BLEND, offscreenBlend]);
              ctx = offscreenBlend.target.ctx;
            }
            // 被遮罩的节点要为第一个遮罩和最后一个遮罩的索引打标，被遮罩的本身在一个离屏canvas，遮罩的元素在另外一个
            // 最后一个遮罩索引因数量不好计算，放在maskStartHash做
            if(offscreenMask) {
              let j = i + (total || 0);
              maskStartHash[j + 1] = {
                idx: i,
                hasMask,
                offscreenMask,
              };
              ctx = offscreenMask.target.ctx;
            }
            // filter造成的离屏，需要将后续一段孩子节点区域的ctx替换，并在结束后应用结果，再替换回来
            if(offscreenFilter) {
              let j = i + (total || 0) + countMaskNum(__structs, i + (total || 0) + 1, hasMask || 0);
              let list = offscreenHash[j] = offscreenHash[j] || [];
              list.push([i, lv, OFFSCREEN_FILTER, offscreenFilter]);
              ctx = offscreenFilter.target.ctx;
            }
            // overflow:hidden的离屏，最后孩子进行截取
            if(offscreenOverflow) {
              let j = i + (total || 0) + countMaskNum(__structs, i + (total || 0) + 1, hasMask || 0);
              let list = offscreenHash[j] = offscreenHash[j] || [];
              list.push([i, lv, OFFSCREEN_OVERFLOW, offscreenOverflow]);
              ctx = offscreenOverflow.target.ctx;
            }
            // 离屏应用，按照lv从大到小即子节点在前先应用，同一个节点多个效果按offscreen优先级从小到大来，
            // 由于mask特殊索引影响，所有离屏都在最后一个mask索引判断，此时mask本身优先结算，以index序大到小判断
            if(offscreenHash.hasOwnProperty(i)) {
              ctx = applyOffscreen(ctx, offscreenHash[i], width, height);
            }
          }
        }
      }
    });
    if(__cacheMask && __cacheMask.__available) {
      target = __cacheMask;
    }
  }
  return target;
}

function resetMatrixCacheTotal(__structs, index, total, lv, matrixEvent) {
  let matrixList = [];
  let parentMatrix;
  let lastMatrix = matrixEvent;
  let lastLv = lv;
  for(let i = index + 1, len = index + (total || 0) + 1; i < len; i++) {
    let {
      node,
      lv,
      total,
      hasMask,
    } = __structs[i];
    // 排除Text
    if(node instanceof Text) {
      continue;
    }
    let {
      __cacheStyle: cacheStyle,
      __currentStyle: currentStyle,
      __computedStyle: computedStyle,
      __cacheTotal,
      __matrixEvent: old,
    } = node;
    // 跳过display:none元素和它的所有子节点和mask
    if(computedStyle[DISPLAY] === 'none') {
      i += (total || 0) + countMaskNum(__structs, i + (total || 0) + 1, hasMask || 0);
      continue;
    }
    // lv变大说明是child，相等是sibling，变小可能是parent或另一棵子树
    if(lv > lastLv) {
      parentMatrix = lastMatrix;
      if(isE(parentMatrix)) {
        parentMatrix = null;
      }
      matrixList.push(parentMatrix);
    }
    // 变小出栈索引需注意，可能不止一层，多层计算diff层级
    else if(lv < lastLv) {
      let diff = lastLv - lv;
      matrixList.splice(-diff);
      parentMatrix = matrixList[lv - 1];
    }
    // 不变是同级兄弟，无需特殊处理 else {}
    lastLv = lv;
    old = old.slice(0);
    // 计算真正的相对于root原点的matrix
    cacheStyle[MATRIX] = null;
    let matrix = node.__calMatrix(REPAINT, cacheStyle, currentStyle, computedStyle);
    if(!isE(parentMatrix)) {
      matrix = multiply(parentMatrix, matrix);
    }
    assignMatrix(node.__matrixEvent, matrix);
    lastMatrix = matrix;
    // 深度遍历递归进行
    if(__cacheTotal && __cacheTotal.__available) {
      let needReset = __cacheTotal.isNew;
      if(!needReset && !util.equalArr(old, matrix)) {
        needReset = true;
      }
      if(needReset) {
        resetMatrixCacheTotal(__structs, i, total || 0, lv, matrix);
      }
      __cacheTotal.__isNew = false;
      i += (total || 0) + countMaskNum(__structs, i + (total || 0) + 1, hasMask || 0);
    }
  }
}

/**
 * canvas/webgl支持任意节点为mask，不像svg仅单节点
 * hasMask的num是指遮罩对象后面的兄弟节点数，需要换算成包含子节点的总数
 * @param __structs
 * @param start
 * @param hasMask
 */
function countMaskNum(__structs, start, hasMask) {
  let count = 0;
  while(hasMask--) {
    let total = __structs[start].total;
    count += total || 0;
    start += total || 0;
    // total不算自身，所以还得+1
    count++;
    start++;
  }
  return count;
}

// webgl不太一样，使用fbo离屏绘制到一个纹理上进行汇总
function genFrameBufferWithTexture(gl, texCache, width, height) {
  let n = texCache.lockOneChannel();
  let texture = webgl.createTexture(gl, null, n, width, height);
  let frameBuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
  let check = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
  if(check !== gl.FRAMEBUFFER_COMPLETE) {
    inject.error('Framebuffer object is incomplete: ' + check.toString());
  }
  // 离屏窗口0开始
  gl.viewport(0, 0, width, height);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  return [n, frameBuffer, texture];
}

/**
 * 局部根节点复合图层生成，汇总所有子节点到一颗局部树上的位图缓存，包含超限特殊情况
 * 即便只有自己一个也要返回，因为webgl生成total的原因是有类似filter/mask等必须离屏处理的东西
 * @param gl
 * @param texCache
 * @param node
 * @param index
 * @param total
 * @param __structs
 * @param cache
 * @param limitCache
 * @param hasMbm
 * @param W
 * @param H
 * @returns {*}
 */
function genTotalWebgl(gl, texCache, node, index, total, __structs, cache, limitCache, hasMbm, W, H) {
  // 存每层父亲的matrix和opacity和index，bbox计算过程中生成，缓存给下面渲染过程用
  let parentIndexHash = {};
  let opacityHash = {};
  let [bboxTotal, parentPm] = genBboxTotal(node, __structs, index, total, parentIndexHash, opacityHash,
    gl.getParameter(gl.MAX_TEXTURE_SIZE), limitCache);
  // 可能局部根节点合成过程中发现整体超限
  let totalLimitCache;
  if(!bboxTotal) {
    totalLimitCache = true;
  }
  // 超限情况生成画布大小的特殊纹理
  if(limitCache || totalLimitCache) {
    bboxTotal = [0, 0, W, H];
  }
  let width = bboxTotal[2] - bboxTotal[0];
  let height = bboxTotal[3] - bboxTotal[1];
  let [n, frameBuffer, texture] = genFrameBufferWithTexture(gl, texCache, width, height);
  // 以bboxTotal的左上角为原点生成离屏texture
  let { __sx1: sx1, __sy1: sy1 } = node;
  let cx = width * 0.5, cy = height * 0.5;
  let dx = -bboxTotal[0], dy = -bboxTotal[1];
  let dbx = sx1 - bboxTotal[0], dby = sy1 - bboxTotal[1];
  // 先绘制自己的cache，起点所以matrix视作E为空，opacity固定1
  if(cache && cache.__available) {
    texCache.addTexAndDrawWhenLimit(gl, cache, 1, null, cx, cy, dx, dy, false);
  }
  // limitCache无cache需先绘制到统一的离屏画布上
  else if(limitCache) {
    let c = inject.getCacheCanvas(width, height, '__$$OVERSIZE$$__');
    node.render(mode.WEBGL, 0, gl, NA, 0, 0);
    let j = texCache.lockOneChannel();
    let texture = webgl.createTexture(gl, c.canvas, j);
    let mockCache = new MockCache(gl, texture, 0, 0, width, height, [0, 0, width, height]);
    texCache.addTexAndDrawWhenLimit(gl, mockCache, 1, null, cx, cy, 0, 0, false);
    texCache.refresh(gl, cx, cy);
    c.ctx.setTransform(1, 0, 0, 1, 0, 0);
    c.ctx.globalAlpha = 1;
    c.ctx.clearRect(0, 0, width, height);
    mockCache.release();
    texCache.releaseLockChannel(j);
  }
  // 因为cacheTotal不总是以左上角原点为开始，所以必须每个节点重算matrix，合并box时计算的无法用到
  let matrixHash = {};
  // 先序遍历汇总到total
  for(let i = index + 1, len = index + (total || 0) + 1; i < len; i++) {
    let {
      node,
      total,
      hasMask,
    } = __structs[i];
    let parentIndex = parentIndexHash[i];
    let matrix = matrixHash[parentIndex]; // 父节点的在每个节点计算后保存，第一个为top的默认为E（空）
    let opacity = opacityHash[i]; // opacity在合并box时已经计算可以直接用
    // 先看text，visibility会在内部判断，display会被parent判断
    if(node instanceof Text) {
      if(parentPm) {
        matrix = multiply(parentPm, matrix);
      }
      texCache.addTexAndDrawWhenLimit(gl, node.__cache, opacity, matrix, cx, cy, dx, dy, false);
    }
    // 再看total缓存/cache，都没有的是无内容的Xom节点
    else {
      let {
        __cache,
        __cacheTotal,
        __cacheFilter,
        __cacheMask,
        __cacheOverflow,
        __isMask,
      } = node;
      let {
        [DISPLAY]: display,
        [VISIBILITY]: visibility,
        [TRANSFORM]: transform,
        [TRANSFORM_ORIGIN]: transformOrigin,
        [MIX_BLEND_MODE]: mixBlendMode,
      } = node.__computedStyle;
      if(display === 'none') {
        i += (total || 0) + countMaskNum(__structs, i + (total || 0) + 1, hasMask || 0);
        continue;
      }
      // mask和不可见不能被汇总到top上
      if((visibility === 'hidden' || __isMask) && !node.hookGlRender) {
        continue;
      }
      if(transform && !isE(transform)) {
        let tfo = transformOrigin.slice(0);
        // total下的节点tfo的计算，以total为原点，差值坐标即相对坐标
        if(__cache && __cache.__available) {
          tfo[0] += __cache.sx1;
          tfo[1] += __cache.sy1;
        }
        else {
          tfo[0] += node.__sx1;
          tfo[1] += node.__sy1;
        }
        let dx = -sx1 + dbx;
        let dy = -sy1 + dby;
        tfo[0] += dx;
        tfo[1] += dy;
        let m = tf.calMatrixByOrigin(transform, tfo);
        if(matrix) {
          matrix = multiply(matrix, m);
        }
        else {
          matrix = m;
        }
      }
      if(matrix) {
        matrixHash[i] = matrix;
      }
      if(parentPm) {
        matrix = multiply(parentPm, matrix);
      }
      let target = getCache([__cacheMask, __cacheFilter, __cacheOverflow, __cacheTotal, __cache]);
      if(target) {
        // 局部的mbm和主画布一样，先刷新当前fbo，然后把后面这个mbm节点绘入一个新的等画布尺寸的fbo中，再进行2者mbm合成
        if(isValidMbm(mixBlendMode)) {
          texCache.refresh(gl, cx, cy);
          let [n2, frameBuffer2, texture2] = genFrameBufferWithTexture(gl, texCache, width, height);
          texCache.addTexAndDrawWhenLimit(gl, target, opacity, matrix, cx, cy, dx, dy, false);
          texCache.refresh(gl, cx, cy);
          // 合成结果作为当前frameBuffer，以及纹理和单元，等于替代了当前fbo作为绘制对象
          [n, frameBuffer, texture] = genMbmWebgl(gl, texCache, n, n2, frameBuffer, texture, mbmName(mixBlendMode), width, height);
          gl.deleteFramebuffer(frameBuffer2);
          gl.deleteTexture(texture2);
        }
        else {
          texCache.addTexAndDrawWhenLimit(gl, target, opacity, matrix, cx, cy, dx, dy, false);
        }
        if(target !== __cache) {
          i += (total || 0) + countMaskNum(__structs, i + (total || 0) + 1, hasMask || 0);
        }
      }
      // webgl特殊的外部钩子，比如粒子组件自定义渲染时调用
      if(node.hookGlRender) {
        node.hookGlRender(gl, opacity, matrix, cx, cy, dx, dy, false);
      }
    }
  }
  if(node.hookGlRender) {
    node.hookGlRender(gl, 1, null, cx, cy, dx, dy, false);
  }
  // 绘制到fbo的纹理对象上并删除fbo恢复
  texCache.refresh(gl, cx, cy);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.viewport(0, 0, W, H);
  gl.deleteFramebuffer(frameBuffer);
  // 生成的纹理对象本身已绑定一个纹理单元了，释放lock的同时可以给texCache的channel缓存，避免重复上传
  let mockCache = new MockCache(gl, texture, sx1, sy1, width, height, bboxTotal);
  texCache.releaseLockChannel(n, mockCache.page);
  return [limitCache || totalLimitCache, mockCache];
}

function genFilterWebgl(gl, texCache, node, cache, filter, W, H) {
  let { sx1, sy1, width, height, bbox } = cache;
  let mockCache = cache;
  filter.forEach(item => {
    let [k, v] = item;
    if(k === 'blur' && v > 0) {
      let res = genBlurWebgl(gl, texCache, mockCache, v, width, height, sx1, sy1, bbox);
      if(res) {
        [mockCache, width, height, bbox] = res;
      }
    }
    else if(k === 'dropShadow') {
      let res = genDropShadowWebgl(gl, texCache, mockCache, v, width, height, sx1, sy1, bbox);
      if(res) {
        [mockCache, width, height, bbox] = res;
      }
    }
    else if(k === 'hueRotate') {
      let rotation = geom.d2r(v % 360);
      let cosR = Math.cos(rotation);
      let sinR = Math.sin(rotation);
      let res = genColorMatrixWebgl(gl, texCache, mockCache, [
        0.213 + cosR * 0.787 - sinR * 0.213, 0.715 - cosR * 0.715 - sinR * 0.715, 0.072 - cosR * 0.072 + sinR * 0.928, 0, 0,
        0.213 - cosR * 0.213 + sinR * 0.143, 0.715 + cosR * 0.285 + sinR * 0.140, 0.072 - cosR * 0.072 - sinR * 0.283, 0, 0,
        0.213 - cosR * 0.213 - sinR * 0.787, 0.715 - cosR * 0.715 + sinR * 0.715, 0.072 + cosR * 0.928 + sinR * 0.072, 0, 0,
        0, 0, 0, 1, 0,
      ], width, height, sx1, sy1, bbox);
      if(res) {
        [mockCache, width, height, bbox] = res;
      }
    }
    else if(k === 'saturate' && v !== 100) {
      let amount = v * 0.01;
      let res = genColorMatrixWebgl(gl, texCache, mockCache, [
        0.213 + 0.787 * amount,  0.715 - 0.715 * amount, 0.072 - 0.072 * amount, 0, 0,
        0.213 - 0.213 * amount,  0.715 + 0.285 * amount, 0.072 - 0.072 * amount, 0, 0,
        0.213 - 0.213 * amount,  0.715 - 0.715 * amount, 0.072 + 0.928 * amount, 0, 0,
        0, 0, 0, 1, 0,
      ], width, height, sx1, sy1, bbox);
      if(res) {
        [mockCache, width, height, bbox] = res;
      }
    }
    else if(k === 'brightness' && v !== 100) {
      let b = v * 0.01;
      let res = genColorMatrixWebgl(gl, texCache, mockCache, [
        b, 0, 0, 0, 0,
        0, b, 0, 0, 0,
        0, 0, b, 0, 0,
        0, 0, 0, 1, 0,
      ], width, height, sx1, sy1, bbox);
      if(res) {
        [mockCache, width, height, bbox] = res;
      }
    }
    else if(k === 'grayscale' && v > 0) {
      v = Math.min(v, 100);
      let oneMinusAmount = 1 - v * 0.01;
      if(oneMinusAmount < 0) {
        oneMinusAmount = 0;
      }
      else if(oneMinusAmount > 1) {
        oneMinusAmount = 1;
      }
      let res = genColorMatrixWebgl(gl, texCache, mockCache, [
        0.2126 + 0.7874 * oneMinusAmount, 0.7152 - 0.7152 * oneMinusAmount, 0.0722 - 0.0722 * oneMinusAmount, 0, 0,
        0.2126 - 0.2126 * oneMinusAmount, 0.7152 + 0.2848 * oneMinusAmount, 0.0722 - 0.0722 * oneMinusAmount, 0, 0,
        0.2126 - 0.2126 * oneMinusAmount, 0.7152 - 0.7152 * oneMinusAmount, 0.0722 + 0.9278 * oneMinusAmount, 0, 0,
        0, 0, 0, 1, 0,
      ], width, height, sx1, sy1, bbox);
      if(res) {
        [mockCache, width, height, bbox] = res;
      }
    }
    else if(k === 'contrast' && v !== 100) {
      let amount = v * 0.01;
      let o = -0.5 * amount + 0.5;
      let res = genColorMatrixWebgl(gl, texCache, mockCache, [
        amount, 0, 0, 0, o,
        0, amount, 0, 0, o,
        0, 0, amount, 0, o,
        0, 0, 0, 1, 0,
      ], width, height, sx1, sy1, bbox);
      if(res) {
        [mockCache, width, height, bbox] = res;
      }
    }
    else if(k === 'sepia' && v > 0) {
      v = Math.min(v, 100);
      let oneMinusAmount = 1 - v * 0.01;
      if(oneMinusAmount < 0) {
        oneMinusAmount = 0;
      }
      else if(oneMinusAmount > 1) {
        oneMinusAmount = 1;
      }
      let res = genColorMatrixWebgl(gl, texCache, mockCache, [
        0.393 + 0.607 * oneMinusAmount, 0.769 - 0.769 * oneMinusAmount, 0.189 - 0.189 * oneMinusAmount, 0, 0,
        0.349 - 0.349 * oneMinusAmount, 0.686 + 0.314 * oneMinusAmount, 0.168 - 0.168 * oneMinusAmount, 0, 0,
        0.272 - 0.272 * oneMinusAmount, 0.534 - 0.534 * oneMinusAmount, 0.131 + 0.869 * oneMinusAmount, 0, 0,
        0, 0, 0, 1, 0,
      ], width, height, sx1, sy1, bbox);
      if(res) {
        [mockCache, width, height, bbox] = res;
      }
    }
    else if(k === 'invert' && v > 0) {
      v = Math.min(v, 100);
      let o = v * 0.01;
      let amount = 1 - 2 * o;
      let res = genColorMatrixWebgl(gl, texCache, mockCache, [
        amount, 0, 0, 0, o,
        0, amount, 0, 0, o,
        0, 0, amount, 0, o,
        0, 0, 0, 1, 0,
      ], width, height, sx1, sy1, bbox);
      if(res) {
        [mockCache, width, height, bbox] = res;
      }
    }
  });
  // 切换回主程序
  gl.useProgram(gl.program);
  gl.viewport(0, 0, W, H);
  return mockCache;
}

/**
 * https://www.w3.org/TR/2018/WD-filter-effects-1-20181218/#feGaussianBlurElement
 * 根据cacheTotal生成cacheFilter，按照css规范的优化方法执行3次，避免卷积核d扩大3倍性能慢
 * 规范的优化方法对d的值分奇偶优化，这里再次简化，d一定是奇数，即卷积核大小
 * 先动态生成gl程序，默认3核源码示例已注释，根据sigma获得d（一定奇数），再计算权重
 * 然后将d尺寸和权重拼接成真正程序并编译成program，再开始绘制
 */
function genBlurWebgl(gl, texCache, cache, sigma, width, height, sx1, sy1, bbox) {
  let d = blur.kernelSize(sigma);
  let max = Math.max(15, gl.getParameter(gl.MAX_VARYING_VECTORS));
  while(d > max) {
    d -= 2;
  }
  let spread = blur.outerSizeByD(d);
  // 防止超限，webgl最大纹理尺寸限制
  let limit = gl.getParameter(gl.MAX_TEXTURE_SIZE);
  if(width > limit || height > limit) {
    return;
  }
  let bboxNew = bbox.slice(0);
  bboxNew[0] -= spread;
  bboxNew[1] -= spread;
  bboxNew[2] += spread;
  bboxNew[3] += spread;
  let widthNew = width + spread * 2;
  let heightNew = height + spread * 2;
  let cx = widthNew * 0.5, cy = heightNew * 0.5;
  let weights = blur.gaussianWeight(sigma, d);
  let vert = '';
  let frag = '';
  let r = Math.floor(d * 0.5);
  for(let i = 0; i < r; i++) {
    let c = (r - i) * 0.01;
    vert += `v_texCoordsBlur[${i}] = a_texCoords + vec2(-${c}, -${c}) * u_direction;`;
    frag += `gl_FragColor += texture2D(u_texture, v_texCoordsBlur[${i}]) * ${weights[i]};`;
  }
  vert += `v_texCoordsBlur[${r}] = a_texCoords;`;
  frag += `gl_FragColor += texture2D(u_texture, v_texCoordsBlur[${r}]) * ${weights[r]};`;
  for(let i = 0; i < r; i++) {
    let c = (i + 1) * 0.01;
    vert += `v_texCoordsBlur[${i + r + 1}] = a_texCoords + vec2(${c}, ${c}) * u_direction;`;
    frag += `gl_FragColor += texture2D(u_texture, v_texCoordsBlur[${i + r + 1}]) * ${weights[i + r + 1]};`;
  }
  vert = vertexBlur.replace('[3]', '[' + d + ']').replace(/}$/, vert + '}');
  frag = fragmentBlur.replace('[3]', '[' + d + ']').replace(/}$/, frag + '}');
  let program = webgl.initShaders(gl, vert, frag);
  gl.useProgram(program);
  let [i, frameBuffer, texture] = genFrameBufferWithTexture(gl, texCache, widthNew, heightNew);
  // 将本身total的page纹理放入一个单元，一般刚生成已经在了，少部分情况变更引发的可能不在
  let j = texCache.findExistTexChannel(cache.page);
  if(j === -1) {
    // 直接绑定，因为一定是个mockCache
    j = texCache.lockOneChannel();
    webgl.bindTexture(gl, cache.page.texture, j);
  }
  else {
    texCache.lockChannel(j);
  }
  texture = webgl.drawBlur(gl, program, frameBuffer, texture, cache.page.texture, i, j,
    width, height, spread, widthNew, heightNew, cx, cy);
  // 销毁这个临时program
  gl.deleteShader(program.vertexShader);
  gl.deleteShader(program.fragmentShader);
  gl.deleteProgram(program);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.deleteFramebuffer(frameBuffer);
  texCache.releaseLockChannel(j);
  let mockCache = new MockCache(gl, texture, sx1, sy1, widthNew, heightNew, bboxNew);
  texCache.releaseLockChannel(i, mockCache.page);
  return [mockCache, widthNew, heightNew, bboxNew];
}

function genColorMatrixWebgl(gl, texCache, cache, m, width, height, sx1, sy1, bbox) {
  // 生成最终纹理，尺寸为被遮罩节点大小
  let [i, frameBuffer, texture] = genFrameBufferWithTexture(gl, texCache, width, height);
  // 将本身total的page纹理放入一个单元，一般刚生成已经在了，少部分情况变更引发的可能不在
  let j = texCache.findExistTexChannel(cache.page);
  if(j === -1) {
    // 直接绑定，因为一定是个mockCache
    j = texCache.lockOneChannel();
    webgl.bindTexture(gl, cache.page.texture, j);
  }
  else {
    texCache.lockChannel(j);
  }
  gl.useProgram(gl.programCm);
  webgl.drawCm(gl, gl.programCm, j, m);
  texCache.releaseLockChannel(j);
  // 切回
  gl.useProgram(gl.program);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.deleteFramebuffer(frameBuffer);
  // 同total一样生成一个mockCache
  let mockCache = new MockCache(gl, texture, sx1, sy1, width, height, bbox.slice(0));
  texCache.releaseLockChannel(i, mockCache.page);
  return [mockCache, width, height, bbox];
}

function genOverflowWebgl(gl, texCache, node, cache, W, H) {
  let bbox = cache.bbox;
  let { __sx1, __sy1, __clientWidth, __clientHeight } = node;
  let xe = __sx1 + __clientWidth;
  let ye = __sy1 + __clientHeight;
  // 没超过无需生成
  if(bbox[0] >= __sx1 && bbox[1] >= __sy1 && bbox[2] <= xe && ye) {
    return;
  }
  let bboxNew = [__sx1, __sy1, xe, ye];
  // 生成最终纹理，尺寸为被遮罩节点大小
  let [i, frameBuffer, texture] = genFrameBufferWithTexture(gl, texCache, __clientWidth, __clientHeight);
  // 将本身total的page纹理放入一个单元，一般刚生成已经在了，少部分情况变更引发的可能不在
  let j = texCache.findExistTexChannel(cache.page);
  if(j === -1) {
    // 直接绑定，因为一定是个mockCache
    j = texCache.lockOneChannel();
    webgl.bindTexture(gl, cache.page.texture, j);
  }
  else {
    texCache.lockChannel(j);
  }
  // 绘制，根据坐标裁剪使用原本纹理的一部分
  gl.useProgram(gl.programOverflow);
  webgl.drawOverflow(gl, j, bboxNew[0] - bbox[0], bboxNew[1] - bbox[1], __clientWidth, __clientHeight, cache.width, cache.height);
  texCache.releaseLockChannel(j);
  // 切回
  gl.useProgram(gl.program);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.viewport(0, 0, W, H);
  gl.deleteFramebuffer(frameBuffer);
  // 同total一样生成一个mockCache
  let overflowCache = new MockCache(gl, texture, cache.sx1, cache.sy1, __clientWidth, __clientHeight, bboxNew);
  texCache.releaseLockChannel(i, overflowCache.page);
  return overflowCache;
}

function genMaskWebgl(gl, texCache, node, cache, W, H, lv, __structs) {
  let { sx1, sy1, width, height, bbox, dx, dy } = cache;
  // cache一定是mockCache，可能是total/filter/overflow一种
  let cx = width * 0.5, cy = height * 0.5;
  // 先求得被遮罩的matrix，用作inverse给mask计算
  let {
    [TRANSFORM]: transform,
    [TRANSFORM_ORIGIN]: transformOrigin,
  } = node.__computedStyle;
  let inverse;
  if(isE(transform)) {
    inverse = mx.identity();
  }
  else {
    let tfo = transformOrigin.slice(0);
    tfo[0] += sx1 + dx;
    tfo[1] += sy1 + dy;
    inverse = tf.calMatrixByOrigin(transform, tfo);
  }
  inverse = mx.inverse(inverse);
  // 将所有mask绘入一个单独纹理中，尺寸和原点与被遮罩total相同，才能做到顶点坐标一致
  let [i, frameBuffer, texture] = genFrameBufferWithTexture(gl, texCache, width, height);
  let next = node.next;
  let isClip = next.__isClip;
  let list = [];
  while(next && next.__isMask && next.__isClip === isClip) {
    list.push(next);
    next = next.next;
  }
  for(let i = 0, len = list.length; i < len; i++) {
    let item = list[i];
    let matrixList = [];
    let parentMatrix;
    let lastMatrix;
    let opacityList = [];
    let parentOpacity = 1;
    let lastOpacity;
    let lastLv = lv;
    let {
      index,
      total,
    } = item.__struct;
    // 可以忽略mbm，因为只有透明遮罩
    for(let i = index, len = index + (total || 0) + 1; i < len; i++) {
      let {
        node,
        lv,
        total,
        hasMask,
      } = __structs[i];
      let __cache = node.__cache;
      let __limitCache = node.__limitCache;
      let computedStyle = node.__computedStyle;
      // 跳过display:none元素和它的所有子节点和mask
      if(computedStyle[DISPLAY] === 'none') {
        i += (total || 0) + countMaskNum(__structs, i + (total || 0) + 1, hasMask || 0);
        continue;
      }
      if(node instanceof Text) {
        if(__cache && __cache.__available) {
          // text用父级的matrixEvent，在之前texCache添加到末尾了
          texCache.addTexAndDrawWhenLimit(gl, __cache, parentOpacity, texCache.last[2], cx, cy, 0, 0,true);
        }
        else if(__limitCache) {
          return;
        }
      }
      else {
        let {
          __cache,
          __cacheMask,
          __cacheFilter,
          __cacheOverflow,
          __cacheTotal,
        } = node;
        let {
          [OPACITY]: opacity,
          [TRANSFORM]: transform,
          [TRANSFORM_ORIGIN]: transformOrigin,
        } = node.__computedStyle;
        // lv变大说明是child，相等是sibling，变小可能是parent或另一棵子树，根节点是第一个特殊处理
        if(i === index) {}
        else if(lv > lastLv) {
          parentMatrix = lastMatrix;
          if(isE(parentMatrix)) {
            parentMatrix = null;
          }
          matrixList.push(parentMatrix);
          parentOpacity = lastOpacity;
          opacityList.push(parentOpacity);
        }
        // 变小出栈索引需注意，可能不止一层，多层计算diff层级
        else if(lv < lastLv) {
          let diff = lastLv - lv;
          matrixList.splice(-diff);
          parentMatrix = matrixList[lv - 1];
          opacityList.splice(-diff);
          parentOpacity = opacityList[lv - 1];
        }
        // 不变是同级兄弟，无需特殊处理 else {}
        lastLv = lv;
        let target = getCache([__cacheMask, __cacheFilter, __cacheOverflow, __cacheTotal, __cache]);
        // total和自身cache的尝试，visibility不可见时没有cache
        if(target) {
          let m;
          if(isE(transform)) {
            m = mx.identity();
          }
          else {
            let tfo = transformOrigin.slice(0);
            tfo[0] += target.bbox[0] + dx;
            tfo[1] += target.bbox[1] + dy;
            m = tf.calMatrixByOrigin(transform, tfo);
          }
          m = mx.multiply(inverse, m);
          let tfo = transformOrigin.slice(0);
          tfo[0] += target.bbox[0] + dx;
          tfo[1] += target.bbox[1] + dy;
          lastMatrix = tf.calMatrixByOrigin(transform, tfo);
          if(!isE(parentMatrix)) {
            lastMatrix = multiply(parentMatrix, lastMatrix);
          }
          lastOpacity = parentOpacity * opacity;
          texCache.addTexAndDrawWhenLimit(gl, target, lastOpacity, m, cx, cy, dx, dy, true);
          if(target !== __cache) {
            i += (total || 0) + countMaskNum(__structs, i + (total || 0) + 1, hasMask || 0);
          }
        }
        else if(__limitCache) {
          return;
        }
      }
    }
  }
  texCache.refresh(gl, cx, cy);
  gl.deleteFramebuffer(frameBuffer);
  // 将本身total的page纹理放入一个单元，一般刚生成已经在了，少部分情况mask变更引发的可能不在
  let j = texCache.findExistTexChannel(cache.page);
  if(j === -1) {
    // 直接绑定，因为一定是个mockCache
    j = texCache.lockOneChannel();
    webgl.bindTexture(gl, cache.page.texture, j);
  }
  else {
    texCache.lockChannel(j);
  }
  // 生成最终纹理，汇总total和maskCache
  let [n, frameBuffer2, texture2] = genFrameBufferWithTexture(gl, texCache, width, height);
  let program;
  if(isClip) {
    program = gl.programClip;
  }
  else {
    program = gl.programMask;
  }
  gl.useProgram(program);
  webgl.drawMask(gl, i, j, program);
  gl.deleteTexture(texture);
  texCache.releaseLockChannel(i);
  texCache.releaseLockChannel(j);
  // 切换回主程序
  gl.useProgram(gl.program);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.viewport(0, 0, W, H);
  gl.deleteFramebuffer(frameBuffer2);
  // 同total一样生成一个mockCache
  let maskCache = new MockCache(gl, texture2, sx1, sy1, width, height, bbox);
  texCache.releaseLockChannel(n, maskCache.page);
  return maskCache;
}

/**
 * webgl的dropShadow只生成阴影部分，模糊复用blur，然后进行拼合
 * @param gl
 * @param texCache
 * @param cache
 * @param v
 * @param width
 * @param height
 * @param sx1
 * @param sy1
 * @param bbox
 * @returns {*[]}
 */
function genDropShadowWebgl(gl, texCache, cache, v, width, height, sx1, sy1, bbox) {
  // 先清空之前所有绘制遗留
  texCache.refresh(gl, width * 0.5, height * 0.5);
  // 先根据x/y/color生成单色阴影
  let [x, y, blur, , color] = v;
  let [i, frameBuffer, texture] = genFrameBufferWithTexture(gl, texCache, width, height);
  // 将本身total的page纹理放入一个单元，一般刚生成已经在了，少部分情况变更引发的可能不在
  let j = texCache.findExistTexChannel(cache.page);
  if(j === -1) {
    // 直接绑定，因为一定是个mockCache
    j = texCache.lockOneChannel();
    webgl.bindTexture(gl, cache.page.texture, j);
  }
  else {
    texCache.lockChannel(j);
  }
  gl.useProgram(gl.programDs);
  texture = webgl.drawDropShadow(gl, gl.programDs, frameBuffer, texture, cache.page.texture, i, j, width, height, color);
  // 部分清除
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.deleteFramebuffer(frameBuffer);
  let bboxOld = bbox;
  let mockCache = new MockCache(gl, texture, sx1, sy1, width, height, bbox.slice(0));
  // 复用blur先生成模糊的阴影
  let res = genBlurWebgl(gl, texCache, mockCache, blur, width, height, sx1, sy1, bbox);
  texCache.releaseLockChannel(j); // 不管后续成功如何，都先释放阴影的lock
  gl.useProgram(gl.program);
  if(res) {
    gl.deleteTexture(texture); // 有模糊的阴影后删除之前无模糊的临时阴影
    [mockCache, width, height, bbox] = res;
    // 根据dropShadow的x/y偏移重置模糊阴影的相关数据
    if(x || y) {
      bbox[0] += x;
      bbox[1] += y;
      bbox[2] += x;
      bbox[3] += y;
      // 把模糊阴影当做一张普通的图片
      mockCache.sx1 = bbox[0];
      mockCache.sy1 = bbox[1];
      mockCache.reOffset();
    }
    let bboxMerge = bboxOld.slice(0);
    mergeBbox(bboxMerge, bbox, 0, 0);
    // 合并原本cache和blur的纹理为最终对象，i是最初的cache，j是
    width = bboxMerge[2] - bboxMerge[0];
    height = bboxMerge[3] - bboxMerge[1];
    let cx = width * 0.5, cy = height * 0.5;
    let dx = -bboxMerge[0], dy = -bboxMerge[1];
    let [k, frameBuffer, texture2] = genFrameBufferWithTexture(gl, texCache, width, height);
    // 以merge的bbox的左上角为原点，每个cache要换算一下
    texCache.addTexAndDrawWhenLimit(gl, cache, 1, null, cx, cy, dx, dy, false);
    texCache.addTexAndDrawWhenLimit(gl, mockCache, 1, null, cx, cy, dx, dy, false);
    texCache.refresh(gl, cx, cy, false);
    // 回收
    texCache.releaseLockChannel(i);
    texCache.releaseLockChannel(k);
    gl.deleteFramebuffer(frameBuffer);
    // 同total一样生成一个mockCache，数据和本身一样
    let mockCache2 = new MockCache(gl, texture2, sx1, sy1, width, height, bboxMerge);
    texCache.releaseLockChannel(k, mockCache.page);
    return [mockCache2, width, height, bboxMerge];
  }
}

/**
 * 生成blendMode混合fbo纹理结果，原本是所有元素向一个fbo记A进行绘制，当出现mbm时，进入到这里，
 * 先生成一个新的fbo记B，将A和待混合节点进行对应的mbm模式混合，结果绘制到B中，然后返回B来替换A，包括纹理单元
 * @param gl
 * @param texCache
 * @param i 之前已有的fbo和纹理单元
 * @param j 当前节点绘制的fbo和纹理单元
 * @param mbm
 * @param fbo 之前舞台绑定的fbo和纹理
 * @param tex
 * @param W
 * @param H
 * @returns {number|*}
 */
function genMbmWebgl(gl, texCache, i, j, fbo, tex, mbm, W, H) {
  let frag;
  mbm = mbmName(mbm);
  if(mbm === 'multiply') {
    frag = fragmentMultiply;
  }
  else if(mbm === 'screen') {
    frag = fragmentScreen;
  }
  else if(mbm === 'overlay') {
    frag = fragmentOverlay;
  }
  else if(mbm === 'darken') {
    frag = fragmentDarken;
  }
  else if(mbm === 'lighten') {
    frag = fragmentLighten;
  }
  else if(mbm === 'color-dodge') {
    frag = fragmentColorDodge;
  }
  else if(mbm === 'color-burn') {
    frag = fragmentColorBurn;
  }
  else if(mbm === 'hard-light') {
    frag = fragmentHardLight;
  }
  else if(mbm === 'soft-light') {
    frag = fragmentSoftLight;
  }
  else if(mbm === 'difference') {
    frag = fragmentDifference;
  }
  else if(mbm === 'exclusion') {
    frag = fragmentExclusion;
  }
  else if(mbm === 'hue') {
    frag = fragmentHue;
  }
  else if(mbm === 'saturation') {
    frag = fragmentSaturation;
  }
  else if(mbm === 'color') {
    frag = fragmentColor;
  }
  else if(mbm === 'luminosity') {
    frag = fragmentLuminosity;
  }
  let program = webgl.initShaders(gl, vertexMbm, frag);
  gl.useProgram(program);
  // 生成新的fbo，将混合结果绘入
  let [n, frameBuffer, texture] = genFrameBufferWithTexture(gl, texCache, W, H);
  webgl.drawMbm(gl, program, i, j, W, H);
  // 切换回主程序并销毁这个临时program
  gl.useProgram(gl.program);
  gl.deleteShader(program.vertexShader);
  gl.deleteShader(program.fragmentShader);
  gl.deleteProgram(program);
  gl.deleteFramebuffer(fbo);
  gl.deleteTexture(tex);
  texCache.releaseLockChannel(i);
  texCache.releaseLockChannel(j);
  return [n, frameBuffer, texture];
}

function renderSvg(renderMode, ctx, root, isFirst) {
  let { __structs, width, height } = root;
  // mask节点很特殊，本身有matrix会影响，本身没改变但对象节点有改变也需要计算逆矩阵应用顶点
  let maskEffectHash = {};
  if(!isFirst) {
    // 先遍历一遍收集完全不变的defs，缓存起来id，随后再执行遍历渲染生成新的，避免掉重复的id
    for(let i = 0, len = __structs.length; i < len; i++) {
      let {
        node,
        total,
        hasMask,
      } = __structs[i];
      let __cacheDefs = node.__cacheDefs;
      let __refreshLevel = node.__refreshLevel;
      // 只要涉及到matrix和opacity就影响mask
      let hasEffectMask = hasMask && (__refreshLevel >= REPAINT || contain(__refreshLevel, TRANSFORM_ALL | OP));
      if(hasEffectMask) {
        let start = i + (total || 0) + 1;
        let end = start + hasMask;
        // mask索引遍历时处理，暂存遮罩对象的刷新lv
        maskEffectHash[end - 1] = __refreshLevel;
      }
      // >=REPAINT重绘生成走render()跳过这里
      if(__refreshLevel < REPAINT) {
        // 特殊的mask判断，遮罩对象影响这个mask了，除去filter、遮罩对象无TRANSFORM变化外都可缓存
        if(maskEffectHash.hasOwnProperty(i)) {
          let v = maskEffectHash[i];
          if(!contain(__refreshLevel, TRANSFORM_ALL) && v < REPAINT && !contain(v, TRANSFORM_ALL)) {
            __cacheDefs.forEach(item => {
              ctx.addCache(item);
            });
          }
        }
        // 去除特殊的filter，普通节点或不影响的mask在<REPAINT下defs的其它都可缓存
        else if(!(node instanceof Text)) {
          __cacheDefs.forEach(item => {
            ctx.addCache(item);
          });
        }
      }
    }
  }
  let maskHash = {};
  // 栈代替递归，存父节点的matrix/opacity，matrix为E时存null省略计算
  let matrixList = [];
  let parentMatrix;
  let vdList = [];
  let parentVd;
  let lastLv = 0;
  let lastNode;
  for(let i = 0, len = __structs.length; i < len; i++) {
    let {
      node,
      lv,
      total,
      hasMask,
    } = __structs[i];
    let computedStyle, __refreshLevel, __cacheDefs, __cacheTotal;
    if(node instanceof Text) {
      computedStyle = node.computedStyle;
      __refreshLevel = node.__domParent.__refreshLevel;
    }
    else {
      computedStyle = node.__computedStyle;
      __cacheDefs = node.__cacheDefs;
      __refreshLevel = node.__refreshLevel;
      __cacheTotal = node.__cacheTotal;
    }
    node.__refreshLevel = NONE;
    let display = computedStyle[DISPLAY];
    // 将随后的若干个mask节点范围存下来
    if(hasMask && display !== 'none') {
      let start = i + (total || 0) + 1;
      let end = start + hasMask;
      // svg限制了只能Geom单节点，不可能是Dom，所以end只有唯一
      maskHash[end - 1] = {
        index: i,
        start,
        end,
        isClip: __structs[start].node.__isClip, // 第一个节点是clip为准
      };
    }
    // lv变大说明是child，相等是sibling，变小可能是parent或另一棵子树，Root节点第一个特殊处理
    if(lv < lastLv) {
      let diff = lastLv - lv;
      matrixList.splice(-diff);
      parentMatrix = matrixList[lv - 1];
      vdList.splice(-diff);
      parentVd = vdList[lv - 1];
    }
    else if(lv > lastLv) {
      matrixList.push(parentMatrix = lastNode.__matrix);
      let vd = lastNode.__virtualDom;
      vdList.push(vd);
      parentVd = vd;
    }
    lastNode = node;
    lastLv = lv;
    let virtualDom;
    // svg小刷新等级时直接修改vd，这样Geom不再感知
    if(__refreshLevel < REPAINT && !(node instanceof Text)) {
      virtualDom = node.__virtualDom;
      // total可以跳过所有孩子节点省略循环
      if(__cacheTotal && __cacheTotal.available) {
        i += (total || 0);
        virtualDom.cache = true;
      }
      else {
        __cacheTotal && (__cacheTotal.available = true);
        virtualDom = node.__virtualDom = util.extend({}, virtualDom);
        // dom要清除children缓存，geom和img无需
        if(node instanceof Dom && !(node instanceof Img)) {
          virtualDom.children = [];
        }
        // 还得判断，和img加载混在一起时，触发刷新如果display:none，则还有cacheTotal
        if(display === 'none') {
          i += (total || 0);
          if(hasMask) {
            i += hasMask;
          }
        }
        else {
          delete virtualDom.cache;
        }
      }
      let __cacheStyle = node.__cacheStyle;
      let currentStyle = node.__currentStyle;
      if(contain(__refreshLevel, TRANSFORM_ALL)) {
        let matrix = node.__calMatrix(__refreshLevel, currentStyle, computedStyle, __cacheStyle);
        if(!matrix || isE(matrix)) {
          delete virtualDom.transform;
        }
        else {
          virtualDom.transform = 'matrix(' + util.joinArr(mx.m2m6(matrix), ',') + ')';
        }
        if(parentMatrix && matrix) {
          matrix = multiply(parentMatrix, matrix);
        }
        assignMatrix(node.__matrixEvent, matrix);
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
        let filter = node.__calFilter(currentStyle, computedStyle, __cacheStyle);
        let s = painter.svgFilter(filter);
        if(s) {
          virtualDom.filter = s;
        }
        else {
          delete virtualDom.filter;
        }
      }
      if(contain(__refreshLevel, MBM)) {
        let mixBlendMode = computedStyle[MIX_BLEND_MODE] = currentStyle[MIX_BLEND_MODE];
        if(isValidMbm(mixBlendMode)) {
          virtualDom.mixBlendMode = mbmName(mixBlendMode);
        }
        else {
          delete virtualDom.mixBlendMode;
        }
      }
      virtualDom.lv = __refreshLevel;
    }
    else {
      // >=REPAINT会调用render，重新生成defsCache，text没有这个东西
      if(!(node instanceof Text)) {
        node.__cacheDefs.splice(0);
        node.__calCache(node.__currentStyle, node.__computedStyle, node.__cacheStyle);
        let matrix = node.__matrix;
        if(parentMatrix) {
          matrix = multiply(parentMatrix, matrix);
        }
        assignMatrix(node.__matrixEvent, matrix);
      }
      node.render(renderMode, ctx, 0, 0);
      virtualDom = node.__virtualDom;
      // 渲染后更新取值
      display = computedStyle[DISPLAY];
      if(display === 'none') {
        i += total || 0;
        i += hasMask || 0;
      }
    }
    /**
     * mask会在join时过滤掉，这里将假设正常渲染的vd的内容获取出来组成defs的mask内容
     * 另外最初遍历时记录了会影响的mask，在<REPAINT时比较，>=REPAINT始终重新设置
     * 本身有matrix也需要重设
     */
    if(maskHash.hasOwnProperty(i)
      && (maskEffectHash.hasOwnProperty(i)
        || __refreshLevel >= REPAINT
        || contain(__refreshLevel, TRANSFORM_ALL | OP))) {
      let { index, start, end, isClip } = maskHash[i];
      let target = __structs[index];
      let dom = target.node;
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
        let node = __structs[j].node;
        let { computedStyle: { [DISPLAY]: display, [VISIBILITY]: visibility, [FILL]: fill },
          virtualDom: { children, opacity } } = node;
        if(display !== 'none' && visibility !== 'hidden') {
          // 引用相同无法diff，需要clone
          children = util.clone(children);
          mChildren = mChildren.concat(children);
          for(let k = 0, len = children.length; k < len; k++) {
            let { tagName, props } = children[k];
            if(tagName === 'path') {
              if(isClip) {
                for(let j = 0, len = props.length; j < len; j++) {
                  let item = props[j];
                  if(item[0] === 'fill') {
                    item[1] = util.int2invert(fill[0]);
                  }
                }
              }
              let matrix = node.matrix;
              let ivs = inverse(dom.matrix);
              matrix = multiply(ivs, matrix);
              // path没有transform属性，在vd上，需要弥补
              props.push(['transform', `matrix(${util.joinArr(mx.m2m6(matrix), ',')})`]);
              // path没有opacity属性，在vd上，需要弥补
              if(!util.isNil(opacity) && opacity !== 1) {
                props.push(['opacity', opacity]);
              }
            }
            // img可能有matrix属性，需判断
            else if(tagName === 'image') {
              let hasTransform = -1;
              for(let m = 0, len = props.length; m < len; m++) {
                if(props[m][0] === 'transform') {
                  hasTransform = m;
                  break;
                }
              }
              if(hasTransform === -1) {
                let ivs = inverse(dom.matrix);
                if(!isE(ivs)) {
                  props.push(['transform', `matrix(${util.joinArr(mx.m2m6(ivs), ',')})`]);
                }
              }
              else {
                let matrix = props[hasTransform][1].match(/[\d.]+/g).map(i => parseFloat(i));
                let ivs = inverse(dom.matrix);
                matrix = multiply(ivs, matrix);
                props[hasTransform][1] = `matrix(${util.joinArr(mx.m2m6(matrix), ',')})`;
              }
            }
          }
        }
      }
      // 清掉上次的
      for(let i = __cacheDefs.length - 1; i >= 0; i--) {
        let item = __cacheDefs[i];
        if(item.tagName === 'mask') {
          __cacheDefs.splice(i, 1);
        }
      }
      let o = {
        tagName: 'mask',
        props: [],
        children: mChildren,
      };
      let id = ctx.add(o);
      __cacheDefs.push(o);
      id = 'url(#' + id + ')';
      dom.virtualDom.mask = id;
    }
    // mask不入children
    if(parentVd && !node.__isMask) {
      parentVd.children.push(virtualDom);
    }
    if(i === 0) {
      parentMatrix = node.__matrix;
      parentVd = virtualDom;
    }
  }
}

function renderWebgl(renderMode, gl, root) {
  let { __structs, width, height, texCache } = root;
  let cx = width * 0.5, cy = height * 0.5;
  // 栈代替递归，存父节点的matrix/opacity，matrix为E时存null省略计算
  let matrixList = [];
  let parentMatrix;
  let opacityList = [];
  let parentOpacity = 1;
  let pptCount = 0;
  let pptList = [];
  let pmList = [];
  let parentPm;
  let lastRefreshLevel = NONE;
  let lastNode;
  let lastLv = 0;
  let mergeList = [];
  let hasMbm; // 是否有混合模式出现
  /**
   * 先一遍先序遍历每个节点绘制到自己__cache上，排除Text和已有的缓存以及局部根缓存，
   * 根据refreshLevel进行等级区分，可能是<REPAINT或>=REPAINT，REFLOW布局已前置处理完。
   * 首次绘制没有catchTotal等，后续则可能会有，在<REPAINT可据此跳过所有子节点加快循环，布局过程会提前删除它们。
   * lv的变化根据大小相等进行出入栈parent操作，实现获取节点parent数据的方式，
   * 同时过程中计算出哪些节点要生成局部根，存下来
   */
  for(let i = 0, len = __structs.length; i < len; i++) {
    let {
      node,
      lv,
      total,
      hasMask,
    } = __structs[i];
    // Text特殊处理，webgl中先渲染为bitmap，再作为贴图绘制，缓存交由text内部判断，直接调用渲染纹理方法
    if(node instanceof Text) {
      if(lastRefreshLevel >= REPAINT) {
        node.render(renderMode, gl, 0, 0);
      }
      continue;
    }
    let __computedStyle = node.__computedStyle;
    // 跳过display:none元素和它的所有子节点
    if(__computedStyle[DISPLAY] === 'none') {
      i += (total || 0);
      if(hasMask) {
        i += countMaskNum(__structs, i + (total || 0) + 1, hasMask);
      }
      continue;
    }
    // 根据refreshLevel优化计算
    let {
      __refreshLevel,
      __currentStyle,
      __cacheStyle,
      __cacheTotal,
      __domParent,
    } = node;
    lastRefreshLevel = __refreshLevel;
    node.__refreshLevel = NONE;
    // lv变大说明是child，相等是sibling，变小可能是parent或另一棵子树，Root节点是第一个特殊处理
    if(i === 0) {}
    else if(lv > lastLv) {
      // parentMatrix = lastNode.__matrixEvent;
      // if(isE(parentMatrix)) {
      //   parentMatrix = null;
      // }
      // matrixList.push(parentMatrix);
      // parentOpacity = lastNode.__opacity;
      // opacityList.push(parentOpacity);
      // parentPm = lastNode.__perspectiveMatrix;
      // if(isE(parentPm)) {
      //   parentPm = null;
      // }
      // pmList.push(parentPm);
      pptList.push(pptCount);
    }
    // 变小出栈索引需注意，可能不止一层，多层计算diff层级
    else if(lv < lastLv) {
      let diff = lastLv - lv;
      // matrixList.splice(-diff);
      // parentMatrix = matrixList[lv - 1];
      // opacityList.splice(-diff);
      // parentOpacity = opacityList[lv - 1];
      // pmList.splice(-diff);
      // parentPm = pmList[lv - 1];
      pptList.splice(-diff);
      pptCount = pptList[lv - 1];
    }
    // 不变是同级兄弟，无需特殊处理 else {}
    // lastRefreshLevel = __refreshLevel;
    // lastNode = node;
    // lastLv = lv;
    let hasRecordAsMask;
    /**
     * lv<REPAINT，一般会有__cache，跳过渲染过程，快速运算，没有cache则是自身超限或无内容，目前不感知
     * 可能有cacheTotal，为之前生成的局部根，清除逻辑在更新检查是否>=REPAINT那里，小变化不动
     * 当有遮罩时，如果被遮罩节点本身无变更，需要检查其next的遮罩节点有无变更，
     * 但其实不用检查，因为next变更一定会清空cacheMask，只要检查cacheMask即可
     * 如果没有或无效，直接添加，无视节点本身变化，后面防重即可
     */
    if(__refreshLevel < REPAINT) {
      let ppt;
      if(contain(__refreshLevel, PPT)) {
        ppt = node.__calPerspective(__currentStyle, __computedStyle, __cacheStyle);
      }
      else {
        ppt = node.__perspectiveMatrix;
      }
      // transform变化，父元素的perspective变化也会在Root特殊处理重新计算
      // let matrix;
      if(contain(__refreshLevel, TRANSFORM_ALL)) {
        node.__calMatrix(__refreshLevel, __currentStyle, __computedStyle, __cacheStyle);
      }
      // else {
      //   matrix = node.__matrix;
      // }
      // // 先左乘perspective的矩阵，再左乘父级的总矩阵
      // if(__domParent) {
      //   matrix = multiply(__domParent.__perspectiveMatrix, matrix);
      //   matrix = multiply(__domParent.__matrixEvent, matrix);
      // }
      // assignMatrix(node.__matrixEvent, matrix);
      // let opacity;
      if(contain(__refreshLevel, OP)) {
        __computedStyle[OPACITY] = __currentStyle[OPACITY];
      }
      // else {
      //   opacity = __computedStyle[OPACITY];
      // }
      // if(__domParent) {
      //   opacity *= __domParent.__opacity;
      // }
      // node.__opacity = opacity;
      // filter会改变bbox范围
      let filter;
      if(contain(__refreshLevel, FT)) {
        filter = node.__calFilter(__currentStyle, __computedStyle, __cacheStyle);
      }
      if(contain(__refreshLevel, MBM)) {
        __computedStyle[MIX_BLEND_MODE] = __currentStyle[MIX_BLEND_MODE];
      }
      // 新的perspective父容器，子节点需要有透视，多个则需要生成画中画影响性能
      if(!isE(ppt)) {
        pptCount++;
      }
      // 这里和canvas不一样，前置cacheAsBitmap条件变成或条件之一，新的ppt层级且画中画需要新的fbo
      if((filter && filter.length || contain(__refreshLevel, MASK) && hasMask)
        && __cacheTotal && __cacheTotal.__available
        || contain(__refreshLevel, CACHE)
        || node.__cacheAsBitmap || pptCount > 1 && pptCount > pptList[lv - 1]) {
        mergeList.push({
          i,
          lv,
          total,
          node,
          hasMask,
        });
      }
      // total可以跳过所有孩子节点省略循环，filter/mask等的强制前提是有total，但不跳过mask节点
      if(__cacheTotal && __cacheTotal.__available) {
        i += (total || 0);
        if(!contain(__refreshLevel, MASK)) {
          i += countMaskNum(__structs, i + 1, hasMask);
        }
      }
    }
    /**
     * >=REPAINT重新渲染，并根据结果判断是否离屏限制错误
     * Geom没有子节点无需汇总局部根，Dom中Img也是，它们的局部根等于自身的cache，其它符合条件的Dom需要生成
     */
    else {
      node.__calCache(__currentStyle, __computedStyle, __cacheStyle);
      node.__calContent(__currentStyle, __computedStyle);
      // let matrix = node.__matrix;
      // // 先左乘perspective的矩阵，再左乘父级的总矩阵
      // if(__domParent) {
      //   matrix = multiply(__domParent.__perspectiveMatrix, matrix);
      //   matrix = multiply(__domParent.__matrixEvent, matrix);
      // }
      // assignMatrix(node.__matrixEvent, matrix);
      // let opacity = __computedStyle[OPACITY];
      // if(__domParent) {
      //   opacity *= __domParent.__opacity;
      // }
      // node.__opacity = opacity;
      let res = node.render(renderMode, gl, 0, 0);
      // geom可返回texture纹理，替代原有xom的__cache纹理
      if(res && inject.isWebGLTexture(res.texture)) {
        let { __sx1: sx1, __sy1: sy1, __offsetWidth: w, __offsetHeight: h, bbox } = node;
       node.__cache = new MockCache(gl, res.texture, sx1, sy1, w, h, bbox);
        gl.viewport(0, 0, width, height);
        gl.useProgram(gl.program);
      }
      let {
        [OVERFLOW]: overflow,
        [FILTER]: filter,
        [MIX_BLEND_MODE]: mixBlendMode,
      } = __computedStyle;
      if(!node.__limitCache
        && (node.__cacheAsBitmap
          || hasMask
          || filter.length
          || isValidMbm(mixBlendMode)
          || overflow === 'hidden' && total)) {
        mergeList.push({
          i,
          lv,
          total,
          node,
          hasMask,
        });
      }
    }
    // 每个元素检查cacheTotal生成，已有的上面会continue跳过
    // let {
    //   __limitCache,
    //   __cacheAsBitmap,
    // } = node;
    // let {
    //   [OVERFLOW]: overflow,
    //   [FILTER]: filter,
    //   [MIX_BLEND_MODE]: mixBlendMode,
    //   [TRANSFORM]: transform,
    // } = __computedStyle;
    // let validMbm = isValidMbm(mixBlendMode);
    // // 3d渲染上下文
    // let isPerspective = tf.isPerspectiveMatrix(transform)
    //   || __domParent && !isE(__domParent.__perspectiveMatrix);
    // if(__cacheAsBitmap
    //   || hasMask
    //   || filter.length
    //   || (overflow === 'hidden' && total)
    //   || validMbm
    //   || isPerspective) {
    //   if(validMbm) {
    //     hasMbm = true;
    //   }
    //   if(hasRecordAsMask) {
    //     hasRecordAsMask[5] = __limitCache;
    //     hasRecordAsMask[7] = filter;
    //     hasRecordAsMask[8] = overflow;
    //     hasRecordAsMask[9] = isPerspective;
    //     hasRecordAsMask[10] = __cacheAsBitmap;
    //   }
    //   else {
    //     mergeList.push([i, lv, total, node, __limitCache, hasMask, filter, overflow, isPerspective, __cacheAsBitmap]);
    //   }
    // }
  }
  let limitHash = {};
  // 根据收集的需要合并局部根的索引，尝试合并，按照层级从大到小，索引从大到小的顺序，
  // 这样保证子节点在前，后节点在前，后节点是为了mask先应用自身如filter之后再进行遮罩
  if(mergeList.length) {
    mergeList.sort(function(a, b) {
      if(a[1] === b[1]) {
        return b[0] - a[0];
      }
      return b[1] - a[1];
    });
    // ppt只有嵌套才需要生成，最下面的孩子节点的ppt无需，因此记录一个hash存index，
    // 同时因为是后序遍历，孩子先存所有父亲的index即可保证父亲才能生成cacheTotal
    let pptHash = {};
    mergeList.forEach(item => {
      let [i, lv, total, node, __limitCache, hasMask, filter, overflow, isPerspective, __cacheAsBitmap] = item;
      // 有ppt的，向上查找所有父亲index记录，可能出现重复记得提前跳出
      if(isPerspective) {
        let parent = node.__domParent;
        while(parent) {
          let idx = parent.__struct.index;
          if(pptHash[idx]) {
            break;
          }
          if(tf.isPerspectiveMatrix(parent.__matrix) || parent.__perspectiveMatrix) {
            pptHash[idx] = true;
          }
          parent = parent.__domParent;
        }
        if(!pptHash[i] && !hasMask && !filter.length && overflow !== 'hidden' && !__cacheAsBitmap) {
          return;
        }
      }
      let {
        __cache,
        __cacheTotal,
        __cacheFilter,
        __cacheMask,
        __cacheOverflow,
      } = node;
      let needGen;
      // 可能没变化，比如被遮罩节点、filter变更等
      if(!__cacheTotal || !__cacheTotal.__available) {
        let [limit, res] = genTotalWebgl(gl, texCache, node, i, total || 0, __structs, __cache, __limitCache, hasMbm, width, height);
        __cacheTotal = res;
        needGen = true;
        __limitCache = limit;
        // 返回的limit包含各种情况超限，一旦超限，只能生成临时cacheTotal不能保存
        if(!__limitCache) {
          node.__cacheTotal = res;
        }
      }
      // 即使超限，也有total结果
      let target = __cacheTotal;
      if(overflow === 'hidden') {
        if(!__cacheOverflow || !__cacheOverflow.__available || needGen) {
          let temp = genOverflowWebgl(gl, texCache, node, target, width, height);
          if(temp) {
            target = temp;
            needGen = true;
            if(!__limitCache) {
              node.__cacheOverflow = target;
            }
          }
        }
        else {
          target = __cacheOverflow;
        }
      }
      if(filter.length) {
        if(!__cacheFilter || !__cacheFilter.__available || needGen) {
          let old = target;
          target = genFilterWebgl(gl, texCache, node, target, filter, width, height);
          if(target !== old) {
            needGen = true;
            if(!__limitCache) {
              node.__cacheFilter = target;
            }
          }
        }
        else {
          target = __cacheFilter;
        }
      }
      if(hasMask && (!__cacheMask || !__cacheMask.__available || needGen)) {
        target = genMaskWebgl(gl, texCache, node, target, width, height, lv, __structs);
        if(!__limitCache) {
          node.__cacheMask = target;
        }
      }
      // 保存临时的局部根节点
      if(__limitCache) {
        limitHash[i] = target;
      }
    });
  }
  /**
   * 最后先序遍历一次应用__cacheTotal即可，没有的用__cache，以及剩下的超尺寸的和Text
   * 由于mixBlendMode的存在，需先申请个fbo纹理，所有绘制默认向该纹理绘制，最后fbo纹理再进入主画布
   * 前面循环时有记录是否出现mbm，只有出现才申请，否则不浪费直接输出到主画布
   * 超尺寸的要走无cache逻辑render，和canvas很像，除了离屏canvas超限，汇总total也会纹理超限
   */
  let n, frameBuffer, texture;
  if(hasMbm) {
    [n, frameBuffer, texture] = genFrameBufferWithTexture(gl, texCache, width, height);
  }
  for(let i = 0, len = __structs.length; i < len; i++) {
    let {
      node,
      total,
      hasMask,
    } = __structs[i];
    // text如果display不可见，parent会直接跳过，不会走到这里，这里一定是直接绘制到root的，visibility在其内部判断
    if(node instanceof Text) {
      // text特殊之处，__config部分是复用parent的
      let __cache = node.__cache;
      let {
        __matrixEvent,
        __opacity,
      } = node.__domParent;
      if(__cache && __cache.__available) {
        texCache.addTexAndDrawWhenLimit(gl, __cache, __opacity, __matrixEvent, cx, cy, 0, 0,true);
      }
      // 超限特殊处理，先生成画布尺寸大小的纹理然后原始位置绘制
      else if(node.__limitCache) {
        let c = inject.getCacheCanvas(width, height, '__$$OVERSIZE$$__');
        node.render(renderMode, 0, gl, NA, 0, 0);
        let j = texCache.lockOneChannel();
        let texture = webgl.createTexture(gl, c.canvas, j);
        let mockCache = new MockCache(gl, texture, 0, 0, width, height, [0, 0, width, height]);
        texCache.addTexAndDrawWhenLimit(gl, mockCache, opacity, matrixEvent, cx, cy, 0, 0, true);
        texCache.refresh(gl, cx, cy, true);
        c.ctx.setTransform(1, 0, 0, 1, 0, 0);
        c.ctx.globalAlpha = 1;
        c.ctx.clearRect(0, 0, width, height);
        mockCache.release();
        texCache.releaseLockChannel(j);
      }
    }
    else {
      let __computedStyle = node.__computedStyle;
      // none跳过这棵子树，判断下最后一个节点的离屏应用即可
      if(__computedStyle[DISPLAY] === 'none') {
        i += (total || 0);
        if(hasMask) {
          i += countMaskNum(__structs, i + 1, hasMask);
        }
        continue;
      }
      let {
        __cache,
        __cacheTotal,
        __cacheFilter,
        __cacheMask,
        __cacheOverflow,
        __domParent,
        __matrix,
      } = node;
      let {
        [OPACITY]: opacity,
        [VISIBILITY]: visibility,
        [MIX_BLEND_MODE]: mixBlendMode,
      } = __computedStyle;
      let m = __matrix;
      if(__domParent) {
        opacity *= __domParent.__opacity;
        m = multiply(__domParent.__matrixEvent, m);
      }
      node.__opacity = opacity;
      assignMatrix(node.__matrixEvent, m);
      // 有total的可以直接绘制并跳过子节点索引，忽略total本身，其独占用纹理单元，注意特殊不取cacheTotal，
      // 这种情况发生在只有overflow:hidden声明但无效没有生成__cacheOverflow的情况，
      // 因为webgl纹理单元缓存原因，所以不用cacheTotal防止切换性能损耗
      // 已取消，因为perspective需要进行独立上下文渲染
      let target = getCache([__cacheMask, __cacheFilter, __cacheOverflow, __cacheTotal, __cache]);
      // total和自身cache的尝试，visibility不可见时没有cache
      if(target) {
        // 有mbm先刷新当前fbo，然后把后面这个mbm节点绘入一个新的等画布尺寸的fbo中，再进行2者mbm合成
        if(hasMbm && isValidMbm(mixBlendMode)) {
          texCache.refresh(gl, cx, cy, true);
          let [n2, frameBuffer2, texture2] = genFrameBufferWithTexture(gl, texCache, width, height);
          texCache.addTexAndDrawWhenLimit(gl, target, opacity, m, cx, cy, 0, 0, true);
          texCache.refresh(gl, cx, cy, true);
          // 合成结果作为当前frameBuffer，以及纹理和单元，等于替代了当前画布作为绘制对象
          [n, frameBuffer, texture] = genMbmWebgl(gl, texCache, n, n2, frameBuffer, texture, mbmName(mixBlendMode), width, height);
          gl.deleteFramebuffer(frameBuffer2);
          gl.deleteTexture(texture2);
        }
        else {
          texCache.addTexAndDrawWhenLimit(gl, target, opacity, m, cx, cy, 0, 0, true);
        }
        if(target !== __cache) {
          i += (total || 0);
          if(hasMask) {
            i += countMaskNum(__structs, i + 1, hasMask);
          }
        }
      }
      else if(limitHash.hasOwnProperty(i)) {
        let target = limitHash[i];
        if(hasMbm && isValidMbm(mixBlendMode)) {
          texCache.refresh(gl, cx, cy, true);
          let [n2, frameBuffer2, texture2] = genFrameBufferWithTexture(gl, texCache, width, height);
          texCache.addTexAndDrawWhenLimit(gl, target, opacity, m, cx, cy, 0, 0, true);
          texCache.refresh(gl, cx, cy, true);
          // 合成结果作为当前frameBuffer，以及纹理和单元，等于替代了当前画布作为绘制对象
          [n, frameBuffer, texture] = genMbmWebgl(gl, texCache, n, n2, frameBuffer, texture, mbmName(mixBlendMode), width, height);
          gl.deleteFramebuffer(frameBuffer2);
          gl.deleteTexture(texture2);
        }
        else {
          texCache.addTexAndDrawWhenLimit(gl, target, opacity, m, cx, cy, 0, 0, true);
        }
        i += (total || 0) + countMaskNum(__structs, i + (total || 0) + 1, hasMask || 0);
      }
      // 超限的情况，这里是普通单节点超限，没有合成total后再合成特殊cache如filter/mask/mbm之类的，
      // 直接按原始位置绘制到离屏canvas，再作为纹理绘制即可，特殊的在total那做过降级了
      else if(node.__limitCache && visibility !== 'hidden') {
        let c = inject.getCacheCanvas(width, height, '__$$OVERSIZE$$__');
        node.render(renderMode, gl, 0, 0);
        let j = texCache.lockOneChannel();
        let texture = webgl.createTexture(gl, c.canvas, j);
        let mockCache = new MockCache(gl, texture, 0, 0, width, height, [0, 0, width, height]);
        texCache.addTexAndDrawWhenLimit(gl, mockCache, opacity, m, cx, cy, 0, 0, true);
        texCache.refresh(gl, cx, cy, true);
        c.ctx.setTransform(1, 0, 0, 1, 0, 0);
        c.ctx.globalAlpha = 1;
        c.ctx.clearRect(0, 0, width, height);
        mockCache.release();
        texCache.releaseLockChannel(j);
      }
      // webgl特殊的外部钩子，比如粒子组件自定义渲染时调用
      if(node.hookGlRender) {
        node.hookGlRender(gl, opacity, m, cx, cy, 0, 0, true);
      }
    }
  }
  texCache.refresh(gl, cx, cy, true);
  // 有mbm时将汇总的fbo绘入主画布，否则本身就是到主画布无需多余操作
  if(hasMbm) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    texCache.releaseLockChannel(n);
    gl.deleteFramebuffer(frameBuffer);
    // 顶点buffer
    let pointBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,
      -1, 1,
      1, -1,
      -1, 1,
      1, -1,
      1, 1,
    ]), gl.STATIC_DRAW);
    let a_position = gl.getAttribLocation(gl.program, 'a_position');
    gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_position);
    // 纹理buffer
    let texBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      0, 0,
      0, 1,
      1, 0,
      0, 1,
      1, 0,
      1, 1,
    ]), gl.STATIC_DRAW);
    let a_texCoords = gl.getAttribLocation(gl.program, 'a_texCoords');
    gl.vertexAttribPointer(a_texCoords, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_texCoords);
    // opacity buffer
    let opacityBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, opacityBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([1, 1, 1, 1, 1, 1]), gl.STATIC_DRAW);
    let a_opacity = gl.getAttribLocation(gl.program, 'a_opacity');
    gl.vertexAttribPointer(a_opacity, 1, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_opacity);
    // 纹理单元
    let u_texture = gl.getUniformLocation(gl.program, 'u_texture');
    gl.uniform1i(u_texture, n);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.deleteBuffer(pointBuffer);
    gl.deleteBuffer(texBuffer);
    gl.deleteBuffer(opacityBuffer);
    gl.disableVertexAttribArray(a_position);
    gl.disableVertexAttribArray(a_texCoords);
    gl.deleteTexture(texture);
  }
}

function renderCanvas(renderMode, ctx, root) {
  let { __structs, width, height } = root;
  let mergeList = [];
  /**
   * 先一遍先序遍历收集cacheAsBitmap的节点，说明这棵子树需要缓存，可能出现嵌套，深层级优先、后面优先
   * 可能遇到已有缓存没变化的，这时候不要收集忽略掉，没有缓存的走后面遍历普通渲染
   */
  for(let i = 0, len = __structs.length; i < len; i++) {
    let {
      node,
      lv,
      total,
      hasMask,
    } = __structs[i];
    // 排除Text，要么根节点直接绘制，要么被局部根节点汇总，自身并不缓存（fillText比位图更快）
    if(node instanceof Text) {
      continue;
    }
    let __computedStyle = node.__computedStyle;
    // 跳过display:none元素和它的所有子节点
    if(__computedStyle[DISPLAY] === 'none') {
      i += (total || 0);
      if(hasMask) {
        i += countMaskNum(__structs, i + (total || 0) + 1, hasMask);
      }
      continue;
    }
    // 根据refreshLevel优化计算，处理其样式
    let {
      __refreshLevel,
      __currentStyle,
      __cacheStyle,
      __cacheTotal,
    } = node;
    node.__refreshLevel = NONE;
    if(__refreshLevel < REPAINT) {
      if(contain(__refreshLevel, TRANSFORM_ALL)) {
        node.__calMatrix(__refreshLevel, __currentStyle, __computedStyle, __cacheStyle);
      }
      if(contain(__refreshLevel, OP)) {
        __computedStyle[OPACITY] = __currentStyle[OPACITY];
      }
      let filter;
      if(contain(__refreshLevel, FT)) {
        filter = node.__calFilter(__currentStyle, __computedStyle, __cacheStyle);
      }
      if(contain(__refreshLevel, MBM)) {
        __computedStyle[MIX_BLEND_MODE] = __currentStyle[MIX_BLEND_MODE];
      }
      // filter/mask变化需重新生成，cacheTotal本身就存在要判断下；CACHE取消重新生成则无需判断
      if(node.__cacheAsBitmap) {
        if((filter && filter.length || contain(__refreshLevel, MASK) && hasMask)
          && __cacheTotal && __cacheTotal.__available
          || contain(__refreshLevel, CACHE)) {
          mergeList.push({
            i,
            lv,
            total,
            node,
            hasMask,
          });
        }
      }
      // total可以跳过所有孩子节点省略循环，filter/mask等的强制前提是有total
      if(__cacheTotal && __cacheTotal.__available) {
        i += (total || 0);
        if(!contain(__refreshLevel, MASK)) {
          i += countMaskNum(__structs, i + 1, hasMask);
        }
      }
    }
    else {
      node.__calCache(__currentStyle, __computedStyle, __cacheStyle);
      if(node.__cacheAsBitmap) {
        mergeList.push({
          i,
          lv,
          total,
          node,
          hasMask,
        });
      }
    }
  }
  /**
   * 根据收集的需要合并局部根的索引，尝试合并，按照层级从大到小，索引从大到小的顺序，
   * 这样保证子节点在前，后节点在前（mask在后面），渲染顺序正确
   */
  if(mergeList.length) {
    mergeList.sort(function(a, b) {
      if(a.lv === b.lv) {
        return b.i - a.i;
      }
      return b.lv - a.lv;
    });
    mergeList.forEach(item => {
      let { i, lv, total, node, hasMask } = item;
      let __cacheTotal = genTotal(renderMode, node, i, lv, total || 0, __structs, hasMask, width, height);
      if(__cacheTotal) {
        genTotalOther(renderMode, __structs, __cacheTotal, node, hasMask, width, height);
      }
    });
  }
  /**
   * 最后先序遍历一次并应用__cacheTotal即可，没有的普通绘制，以及剩下的超尺寸的和Text
   * 特殊离屏和cacheAsBitmap的离屏都已经产生了cacheTotal，除非超限
   * 离屏功能的数据结构和算法逻辑非常复杂，需用到下面2个hash，来完成一些filter、mask等离屏才能完成的绘制
   * 其中overflow、filter、mix-blend-mode是对自身及子节点，mask则是对自身和后续next遮罩节点
   * 一个节点在Xom渲染中申请离屏canvas，是按照一定顺序来的，且多个离屏后面的有前面的ctx引用，第一个则引用最初非离屏的ctx
   * 这个顺序在应用离屏时以反向顺序开始，这样最后ctx被还原到最初的ctx
   * mask是个十分特殊的离屏，因为除了自身外，next节点也需要汇总到另外一个离屏上，为了逻辑一致性
   * 所有离屏应用的索引都以最后一个节点的索引为准，即有mask时以最后一个mask，无mask则以自身节点的最后一个（+total)为索引
   * 由于存在普通非cache绘制，所以依然要用到栈代替递归计算matrix
   */
  let maskStartHash = {};
  let offscreenHash = {};
  for(let i = 0, len = __structs.length; i < len; i++) {
    let {
      node,
      lv,
      total,
      hasMask,
    } = __structs[i];
    // text如果display不可见，parent会直接跳过，不会走到这里，这里一定是直接绘制到root的，visibility在其内部判断
    if(node instanceof Text) {
      node.render(renderMode, ctx, 0, 0);
      if(offscreenHash.hasOwnProperty(i)) {
        ctx = applyOffscreen(ctx, offscreenHash[i], width, height, false);
      }
    }
    else {
      let __computedStyle = node.__computedStyle;
      // none跳过这棵子树，判断下最后一个节点的离屏应用即可
      if(__computedStyle[DISPLAY] === 'none') {
        i += (total || 0);
        if(hasMask) {
          i += countMaskNum(__structs, i + 1, hasMask);
        }
        if(offscreenHash.hasOwnProperty(i)) {
          ctx = applyOffscreen(ctx, offscreenHash[i], width, height, true);
        }
        continue;
      }
      let {
        __cacheTotal,
        __cacheFilter,
        __cacheMask,
        __cacheOverflow,
        __domParent,
        __matrix,
      } = node;
      // 遮罩对象申请了个离屏，其第一个mask申请另外一个离屏mask2，开始聚集所有mask元素的绘制，
      // 这是一个十分特殊的逻辑，保存的index是最后一个节点的索引，OFFSCREEN_MASK2是最低优先级，
      // 这样当mask本身有filter时优先自身，然后才是OFFSCREEN_MASK2
      if(maskStartHash.hasOwnProperty(i)) {
        let { idx, hasMask, offscreenMask } = maskStartHash[i];
        let target = inject.getCacheCanvas(width, height, null, 'mask2');
        offscreenMask.mask = target; // 应用mask用到
        offscreenMask.isClip = node.__isClip;
        // 定位到最后一个mask元素上的末尾
        let j = i + (total || 0) + 1;
        while(--hasMask) {
          let { total } = __structs[j];
          j += (total || 0) + 1;
        }
        j--;
        let list = offscreenHash[j] = offscreenHash[j] || [];
        list.push({ idx, lv, type: OFFSCREEN_MASK, offscreen: offscreenMask });
        list.push({ idx: j, lv, type: OFFSCREEN_MASK2, offscreen: {
          ctx, // 保存等待OFFSCREEN_MASK2时还原
          target,
        }});
        ctx = target.ctx;
      }
      // 设置opacity/matrix，根节点是没有父节点的不计算继承值
      let opacity = __computedStyle[OPACITY];
      let m = __matrix;
      if(__domParent) {
        opacity *= __domParent.__opacity;
        m = multiply(__domParent.__matrixEvent, m);
      }
      node.__opacity = opacity;
      ctx.globalAlpha = opacity;
      assignMatrix(node.__matrixEvent, m);
      ctx.setTransform(m[0], m[1], m[4], m[5], m[12], m[13]);
      // 有cache声明从而有total的可以直接绘制并跳过子节点索，total生成可能会因超限而失败
      let target = getCache([__cacheMask, __cacheFilter, __cacheOverflow, __cacheTotal]);
      if(target) {
        i += (total || 0);
        if(hasMask) {
          i += countMaskNum(__structs, i + 1, hasMask);
        }
        let mixBlendMode = __computedStyle[MIX_BLEND_MODE];
        if(isValidMbm(mixBlendMode)) {
          ctx.globalCompositeOperation = mbmName(mixBlendMode);
        }
        let { x, y, canvas, sx1, sy1, dbx, dby, width, height } = target;
        ctx.drawImage(canvas, x, y, width, height, sx1 - dbx, sy1 - dby, width, height);
        // total应用后记得设置回来
        ctx.globalCompositeOperation = 'source-over';
        // 父超限但子有total的时候，i此时已经增加到了末尾，也需要检查
        if(offscreenHash.hasOwnProperty(i)) {
          ctx = applyOffscreen(ctx, offscreenHash[i], width, height, false);
        }
        // 有cache的可以跳过子节点，但如果matrixEvent变化还是需要遍历计算一下的，虽然跳过了渲染
        // 如果cache是新的，则需要完整遍历设置一次
        // 如果isNew为false，则计算下局部根节点再对比下看是否有变化，无变化可省略
        // let needReset = __cacheTotal.__isNew;
        // if(!needReset && !isE(matrix)) {
        //   needReset = true;
        // }
        // if(needReset) {
        //   resetMatrixCacheTotal(__structs, j, total || 0, lv, matrix);
        // }
        // __cacheTotal.__isNew = false;
      }
      // 没有cacheTotal是普通节点绘制
      else {
        // 节点自身渲染
        let res = node.render(renderMode, ctx, 0, 0);
        let { offscreenBlend, offscreenMask, offscreenFilter, offscreenOverflow } = res || {};
        // 这里离屏顺序和xom里返回的一致，和下面应用离屏时的list相反
        if(offscreenBlend) {
          let j = i + (total || 0);
          if(hasMask) {
            j += countMaskNum(__structs, j + 1, hasMask);
          }
          let list = offscreenHash[j] = offscreenHash[j] || [];
          list.push({ idx: i, lv, type: OFFSCREEN_BLEND, offscreen: offscreenBlend });
          ctx = offscreenBlend.target.ctx;
        }
        // 被遮罩的节点要为第一个遮罩和最后一个遮罩的索引打标，被遮罩的本身在一个离屏canvas，遮罩的元素在另外一个
        // 最后一个遮罩索引因数量不好计算，放在maskStartHash做
        if(offscreenMask) {
          let j = i + (total || 0);
          maskStartHash[j + 1] = {
            idx: i,
            hasMask,
            offscreenMask,
          };
          ctx = offscreenMask.target.ctx;
        }
        // filter造成的离屏，需要将后续一段孩子节点区域的ctx替换，并在结束后应用结果，再替换回来
        if(offscreenFilter) {
          let j = i + (total || 0);
          if(hasMask) {
            j += countMaskNum(__structs, j + 1, hasMask);
          }
          let list = offscreenHash[j] = offscreenHash[j] || [];
          list.push({ idx: i, lv, type: OFFSCREEN_FILTER, offscreen: offscreenFilter });
          ctx = offscreenFilter.target.ctx;
        }
        // overflow:hidden的离屏，最后孩子进行截取
        if(offscreenOverflow) {
          let j = i + (total || 0);
          if(hasMask) {
            j += countMaskNum(__structs, j + 1, hasMask);
          }
          let list = offscreenHash[j] = offscreenHash[j] || [];
          list.push({ idx: i, lv, type: OFFSCREEN_OVERFLOW, offscreen: offscreenOverflow });
          ctx = offscreenOverflow.target.ctx;
        }
        // 离屏应用，按照lv从大到小即子节点在前先应用，同一个节点多个效果按offscreen优先级从小到大来，
        // 由于mask特殊索引影响，所有离屏都在最后一个mask索引判断，此时mask本身优先结算，以index序大到小判断
        if(offscreenHash.hasOwnProperty(i)) {
          ctx = applyOffscreen(ctx, offscreenHash[i], width, height, false);
        }
      }
    }
  }
}

export default {
  renderCanvas,
  renderSvg,
  renderWebgl,
};

