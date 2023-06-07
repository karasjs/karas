import CanvasCache from './CanvasCache';
import offscreen from './offscreen';
import mode from './mode';
import Page from './Page';
import Dom from '../node/Dom';
import Img from '../node/Img';
import Geom from '../node/geom/Geom';
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
import oit from '../gl/oit';
import TextureCache from '../gl/TextureCache';
import blur from '../math/blur';
import vertexBlur from '../gl/filter/blur.vert';
import fragmentBlur from '../gl/filter/blur.frag';
import ImgCanvasCache from './ImgCanvasCache';
import ImgWebglCache from '../gl/ImgWebglCache';
import wasm from '../wasm/index';

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
    TRANSFORM_STYLE,
    BACKFACE_VISIBILITY,
  },
} = enums;
const {
  NONE,
  TRANSFORM_ALL,
  OPACITY: OP,
  FILTER: FT,
  REPAINT,
  MIX_BLEND_MODE: MBM,
  PERSPECTIVE: PPT,
  CACHE,
  MASK,
} = level;
const { isE, inverse, multiply, calRectPoint, assignMatrix } = mx;
const { mbmName } = mbm;
const { transformBbox } = util;
const {
  drawTextureCache,
  createTexture,
  bindTexture,
  drawCache2Tex,
  drawTex2Cache,
} = webgl;

const DOM_RENDER = Dom.prototype.render;
const IMG_RENDER = Img.prototype.render;
const GEOM_RENDER = Geom.prototype.render;

/**
 * 生成一个节点及其子节点所包含的矩形范围盒，canvas和webgl的最大尺寸限制不一样，由外部传入
 * 如果某个子节点超限，则视为整个超限，超限返回空
 * isPpt为webgl下有perspective的节点，需考虑透视
 */
function genBboxTotal(node, __structs, index, total, lv, isPpt) {
  let { __cache } = node;
  assignMatrix(node.__matrixEvent, mx.identity());
  node.__opacity = 1;
  // 先将局部根节点的bbox算好，可能没内容是空
  let bboxTotal;
  if(__cache && __cache.__available) {
    bboxTotal = __cache.bbox;
  }
  else {
    bboxTotal = node.bbox;
  }
  bboxTotal = bboxTotal.slice(0);
  // 局部根节点如有perspective，则计算pm，这里不会出现嵌套，因为每个出现都会生成局部根节点
  // 分2种情况，普通父ppt和自身有ppt情况，自身不能视为E，被绘入主画布时注意特殊处理
  // 自身ppt需将ppt提炼出来，然后node重新忽略ppt
  let pm;
  if(isPpt) {
    pm = node.__perspectiveMatrix || node.__selfPerspectiveMatrix;
  }
  if(node.__selfPerspective) {
    let bbox = transformBbox(bboxTotal, multiply(pm, node.matrix), 0, 0);
    mergeBbox(bboxTotal, bbox);
  }
  let top = node;
  for(let i = index + 1, len = index + total + 1; i < len; i++) {
    let {
      node,
      total,
      hasMask,
      isText,
    } = __structs[i];
    if(isText) {
      if(node.__limitCache) {
        inject.warn('Bbox of Text(' + index + ')' + ' is oversize'
          + node.offsetWidth + ', ' + node.offsetHeight);
        return;
      }
      let bbox = node.bbox, p = node.__domParent, matrix = p.__matrixEvent;
      if((bbox[2] - bbox[0]) && (bbox[3] - bbox[1])) {
        if(!isE(matrix)) {
          bbox = transformBbox(bbox, matrix, 0, 0);
        }
        mergeBbox(bboxTotal, bbox);
      }
      continue;
    }
    if(node.__limitCache) {
      inject.warn('Bbox of ' + node.tagName + '(' + index + ')' + ' is oversize'
        + node.offsetWidth + ', ' + node.offsetHeight);
      return;
    }
    let {
      __computedStyle: __computedStyle2,
      __mask,
    } = node;
    // 跳过display:none元素和它的所有子节点和mask，本身是mask除外
    if(__computedStyle2[DISPLAY] === 'none' || i !== index && __mask) {
      i += (total || 0);
      if(hasMask) {
        i += countMaskNum(__structs, i + 1, hasMask);
      }
      continue;
    }
    let {
      __cache: __cache2,
    } = node;
    let p = node.__domParent;
    node.__opacity = __computedStyle2[OPACITY] * p.__opacity;
    // 由于wasm的存在，使用getter取，没有wasm时不影响，有时获取到wasm计算的节点结果，因为私有__matrix为空
    let m = node.matrix;
    if(p !== top) {
      m = multiply(p.__matrixEvent, m);
    }
    // 只有webgl且ppt情况才有pm，直接子节点才考虑预乘
    if(pm && p === top) {
      m = multiply(pm, m);
    }
    assignMatrix(node.__matrixEvent, m);
    // 后面不可见，只有rotateX和rotateY翻转导致的0/5/10位的cos值为负，同时转2次抵消10位是正
    if(__computedStyle2[BACKFACE_VISIBILITY] === 'hidden') {
      let x = m[5] < 0 && m[10] < 0, y = m[0] < 0 && m[10] < 0;
      if(x || y) {
        i += total || 0;
        if(hasMask) {
          i += countMaskNum(__structs, i + 1, hasMask);
        }
        continue;
      }
    }
    let bbox;
    // 子元素有cacheTotal优先使用
    let target = node.__cacheTarget;
    if(target) {
      if(target !== __cache2) {
        i += (total || 0);
        if(hasMask) {
          i += countMaskNum(__structs, i + 1, hasMask);
        }
      }
      bbox = target.bbox;
    }
    else {
      bbox = node.bbox; // 不能用filterBbox，子元素继承根节点的，如果有filter会是cacheFilter的bbox
    }
    if((bbox[2] - bbox[0]) && (bbox[3] - bbox[1])) {
      // 老的不变，新的会各自重新生成，根据matrixEvent合并bboxTotal
      bbox = transformBbox(bbox, m, 0, 0);
      mergeBbox(bboxTotal, bbox);
    }
  }
  if((bboxTotal[2] - bboxTotal[0] <= 0) || (bboxTotal[3] - bboxTotal[1] <= 0)) {
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

/**
 * 生成局部根节点离屏缓存，超限时除外
 * cache是每个节点自身的缓存，且共享离屏canvas
 * cacheTotal是基础
 * cacheFilter基于total
 * cacheMask基于filter
 * cacheBlend基于mask
 */
function genTotal(renderMode, ctx, root, node, index, lv, total, __structs, width, height) {
  let __cacheTotal = node.__cacheTotal;
  if(__cacheTotal && __cacheTotal.__available) {
    return __cacheTotal;
  }
  let { __x1: x1, __y1: y1, __offsetWidth, __offsetHeight } = node;
  let bboxTotal = genBboxTotal(node, __structs, index, total, lv, false);
  if(!bboxTotal) {
    return;
  }

  // img节点特殊对待，如果只包含图片内容本身，多个相同引用可复用图片
  if(node instanceof Img && node.__loadImg.onlyImg) {
    __cacheTotal = node.__cacheTotal = ImgCanvasCache.getInstance(renderMode, ctx, root.__uuid, bboxTotal, node.__loadImg, x1, y1);
    return __cacheTotal;
  }

  // 生成cacheTotal，获取偏移dx/dy，连带考虑overflow:hidden的情况，当hidden尺寸一致无效时可忽略
  // 否则用一个单独临时的离屏获取包含hidden的结果，再绘入total
  let w, h, dx, dy, dbx, dby, tx, ty;
  let overflow = node.__computedStyle[OVERFLOW], isOverflow;
  if((x1 !== bboxTotal[0]
    || y1 !== bboxTotal[1]
    || __offsetWidth !== (bboxTotal[2] - bboxTotal[0])
    || __offsetHeight !== (bboxTotal[3] - bboxTotal[1])) && overflow === 'hidden') {
    // geom可能超限，不能直接用bbox
    bboxTotal = [x1, y1, x1 + __offsetWidth, y1 + __offsetHeight];
    w = __offsetWidth;
    h = __offsetHeight;
    dx = -x1;
    dy = -y1;
    dbx = 0;
    dby = 0;
    tx = 0;
    ty = 0;
    isOverflow = true;
    __cacheTotal = inject.getOffscreenCanvas(w, h, 'overflow', null);
  }
  else {
    w = bboxTotal[2] - bboxTotal[0];
    h = bboxTotal[3] - bboxTotal[1];
    __cacheTotal = node.__cacheTotal = CanvasCache.getInstance(renderMode, ctx, root.__uuid, bboxTotal, x1, y1, null);
    if(!__cacheTotal || !__cacheTotal.__enabled) {
      if(w || h) {
        inject.warn('CanvasCache of ' + node.tagName + '(' + index + ')' + ' is oversize: '
          + w + ', ' + h);
      }
      return;
    }
    __cacheTotal.__available = true;
    dx = __cacheTotal.dx;
    dy = __cacheTotal.dy;
    dbx = __cacheTotal.dbx;
    dby = __cacheTotal.dby;
    tx = __cacheTotal.x;
    ty = __cacheTotal.y;

    // 离屏画布的坐标和尺寸信息存储
    root.__env = {
      x: __cacheTotal.x,
      y: __cacheTotal.y,
      width: __cacheTotal.page.width,
      height: __cacheTotal.page.height,
    };
  }
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
  let maskStartHash = [];
  let offscreenHash = [];
  for(let i = index, len = index + (total || 0) + 1; i < len; i++) {
    let {
      node,
      lv,
      total,
      hasMask,
      isText,
    } = __structs[i];
    // 排除Text
    if(isText) {
      node.render(renderMode, ctxTotal, dx, dy);
      let oh = offscreenHash[i];
      if(oh) {
        ctxTotal = applyOffscreen(ctxTotal, oh, width, height, false);
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
        let oh = offscreenHash[i];
        if(oh) {
          ctxTotal = applyOffscreen(ctxTotal, oh, width, height, true);
        }
        continue;
      }
      let {
        [VISIBILITY]: visibility,
      } = __computedStyle;
      let mh = maskStartHash[i];
      if(mh) {
        let { idx, hasMask, offscreenMask } = mh;
        let target = inject.getOffscreenCanvas(width, height, null, 'mask2');
        offscreenMask.mask = target; // 应用mask用到
        offscreenMask.isClip = node.__clip;
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
      // wasm取transform不同的方式
      let transform, tfo, wn = node.__wasmNode;
      if(wn) {
        transform = new Float64Array(wasm.instance.memory.buffer, wn.transform_ptr(), 16);
        let cs = new Float64Array(wasm.instance.memory.buffer, wn.computed_style_ptr(), 18);
        tfo = [cs[16], cs[17]];
      }
      else {
        transform = __computedStyle[TRANSFORM];
        tfo = __computedStyle[TRANSFORM_ORIGIN];
      }
      // 特殊渲染的matrix，局部根节点为原点考虑，当需要计算时（不为E）再计算
      let m;
      if(i !== index && (!isE(parentMatrix) || !isE(transform))) {
        m = tf.calMatrixByOrigin(transform, tfo[0] + dbx + node.__x1 - x1 + tx, tfo[1] + dby + node.__y1 - y1 + ty);
        if(!isE(parentMatrix)) {
          m = multiply(parentMatrix, m);
        }
      }
      lastMatrix = m;
      // 子元素有cacheTotal优先使用
      let target = i > index && node.__cacheTarget;
      if(target === node.__cache) {
        target = null;
      }
      if(target) {
        i += (total || 0);
        if(hasMask) {
          i += countMaskNum(__structs, i + 1, hasMask);
        }
        let opacity = ctxTotal.globalAlpha = node.__opacity;
        if(opacity > 0) {
          if(m) {
            ctxTotal.setTransform(m[0], m[1], m[4], m[5], m[12], m[13]);
          }
          else {
            ctxTotal.setTransform(1, 0, 0, 1, 0, 0);
          }
          let mixBlendMode = __computedStyle[MIX_BLEND_MODE];
          if(mixBlendMode !== 'normal') {
            ctxTotal.globalCompositeOperation = mbmName(mixBlendMode);
          }
          CanvasCache.drawCache(target, __cacheTotal);
          ctxTotal.globalCompositeOperation = 'source-over';
        }
        let oh = offscreenHash[i];
        if(oh) {
          ctxTotal = applyOffscreen(ctxTotal, oh, width, height, false);
        }
      }
      else {
        let offscreenBlend, offscreenMask, offscreenFilter, offscreenOverflow;
        let offscreen = i > index && node.__calOffscreen(ctxTotal, __computedStyle);
        if(offscreen) {
          ctxTotal = offscreen.ctx;
          offscreenBlend = offscreen.offscreenBlend;
          offscreenMask = offscreen.offscreenMask;
          offscreenFilter = offscreen.offscreenFilter;
          offscreenOverflow = offscreen.offscreenOverflow;
        }
        if(visibility === 'visible') {
          let opacity = ctxTotal.globalAlpha = node.__opacity;
          if(opacity > 0) {
            if(m) {
              ctxTotal.setTransform(m[0], m[1], m[4], m[5], m[12], m[13]);
            }
            else {
              ctxTotal.setTransform(1, 0, 0, 1, 0, 0);
            }
            node.render(renderMode, ctxTotal, dx, dy);
          }
        }
        // 这里离屏顺序和xom里返回的一致，和下面应用离屏时的list相反
        if(offscreenBlend) {
          let j = i + (total || 0);
          if(hasMask) {
            j += countMaskNum(__structs, j + 1, hasMask);
          }
          let list = offscreenHash[j] = offscreenHash[j] || [];
          list.push({ idx: i, lv, type: OFFSCREEN_BLEND, offscreen: offscreenBlend });
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
        }
        // filter造成的离屏，需要将后续一段孩子节点区域的ctx替换，并在结束后应用结果，再替换回来
        if(offscreenFilter) {
          let j = i + (total || 0);
          if(hasMask) {
            j += countMaskNum(__structs, j + 1, hasMask);
          }
          let list = offscreenHash[j] = offscreenHash[j] || [];
          list.push({ idx: i, lv, type: OFFSCREEN_FILTER, offscreen: offscreenFilter });
        }
        // overflow:hidden的离屏，最后孩子进行截取
        if(offscreenOverflow) {
          let j = i + (total || 0);
          if(hasMask) {
            j += countMaskNum(__structs, j + 1, hasMask);
          }
          let list = offscreenHash[j] = offscreenHash[j] || [];
          list.push({ idx: i, lv, type: OFFSCREEN_OVERFLOW, offscreen: offscreenOverflow });
        }
        // 离屏应用，按照lv从大到小即子节点在前先应用，同一个节点多个效果按offscreen优先级从小到大来，
        // 由于mask特殊索引影响，所有离屏都在最后一个mask索引判断，此时mask本身优先结算，以index序大到小判断
        let oh = offscreenHash[i];
        if(oh) {
          ctxTotal = applyOffscreen(ctxTotal, oh, width, height, false);
        }
      }
    }
  }

  // overflow写回整体离屏
  if(isOverflow) {
    let t = node.__cacheTotal = CanvasCache.getInstance(renderMode, ctx, root.__uuid, bboxTotal, x1, y1, null);
    t.__available = true;
    t.ctx.drawImage(__cacheTotal.canvas, t.x, t.y);
    __cacheTotal.release();
    __cacheTotal = t;
  }

  root.__env = null;
  return __cacheTotal;
}

// 从cacheTotal生成overflow、filter和mask，一定有cacheTotal才会进
function genTotalOther(renderMode, __structs, __cacheTotal, node, hasMask, width, height) {
  let {
    __computedStyle,
    __cacheFilter,
    __cacheMask,
  } = node;
  let {
    [FILTER]: filter,
  } = __computedStyle;
  let target = __cacheTotal, needGen;
  if(filter && filter.length) {
    if(!__cacheFilter|| !__cacheFilter.__available  || needGen) {
      target = node.__cacheFilter = CanvasCache.genFilter(target, filter);
      needGen = true;
    }
  }
  if(hasMask && (!__cacheMask || !__cacheMask.__available || needGen)) {
    target = node.__cacheMask = CanvasCache.genMask(target, node, function(item, cacheMask, inverse) {
      // 和外面没cache的类似，mask生成hash记录，这里mask节点一定是个普通无cache的独立节点
      let maskStartHash = {};
      let offscreenHash = {};
      let { dx, dy, dbx, dby, x: tx, y: ty, ctx, x1, y1 } = cacheMask;
      let struct = item.__struct, root = item.__root, structs = root.__structs;
      let index = structs.indexOf(struct);
      let {
        total,
        lv,
      } = struct;
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
          isText,
        } = __structs[i];
        // 排除Text
        if(isText) {
          node.render(renderMode, ctx, dx, dy);
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
          if(maskStartHash.hasOwnProperty(i)) {
            let { idx, hasMask, offscreenMask } = maskStartHash[i];
            let target = inject.getOffscreenCanvas(width, height, null, 'mask2');
            offscreenMask.mask = target; // 应用mask用到
            offscreenMask.isClip = node.__clip;
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
            [OPACITY]: opacity, // 和genTotal不同，局部根节点opacity生效不为1
          } = __computedStyle;
          let transform, tfo, wn = node.__wasmNode;
          if(wn) {
            transform = new Float64Array(wasm.instance.memory.buffer, wn.transform_ptr(), 16);
            let cs = new Float64Array(wasm.instance.memory.buffer, wn.computed_style_ptr(), 18);
            tfo = [cs[16], cs[17]];
          }
          else {
            transform = node.__computedStyle[TRANSFORM];
            tfo = node.__computedStyle[TRANSFORM_ORIGIN];
          }
          if(i !== index) {
            opacity *= parentOpacity;
          }
          node.__opacity = lastOpacity = opacity;
          // 特殊渲染的matrix，局部根节点为原点且考虑根节点自身的transform
          let m;
          if(!isE(transform)) {
            m = tf.calMatrixByOrigin(transform, tfo[0] + dbx + node.__x1 - x1 + tx, tfo[1] + dby + node.__y1 - y1 + ty);
            if(!isE(parentMatrix)) {
              m = multiply(parentMatrix, m);
            }
          }
          lastMatrix = m;
          if(m) {
            // 很多情况mask和target相同matrix，可简化计算
            if(util.equalArr(m, inverse)) {
              m = mx.identity();
            }
            else if(inverse) {
              inverse = mx.inverse(inverse);
              m = mx.multiply(inverse, m);
            }
          }
          else if(!isE(inverse)) {
            m = mx.inverse(inverse);
          }
          m = m || mx.identity();
          assignMatrix(node.__matrixEvent, m);
          // 特殊渲染的matrix，局部根节点为原点考虑，本节点需inverse反向
          let target = node.__cacheTarget;
          if(target === node.__cache) {
            target = null;
          }
          if(target) {
            i += (total || 0);
            if(hasMask) {
              i += countMaskNum(__structs, i + 1, hasMask);
            }
            ctx.globalAlpha = opacity;
            ctx.setTransform(m[0], m[1], m[4], m[5], m[12], m[13]);
            let mixBlendMode = __computedStyle[MIX_BLEND_MODE];
            if(mixBlendMode !== 'normal') {
              ctx.globalCompositeOperation = mbmName(mixBlendMode);
            }
            else {
              ctx.globalCompositeOperation = 'source-over';
            }
            let { x, y, canvas, width, height, x1: x2, y1: y2, dbx: dbx2, dby: dby2 } = target;
            let ox = tx + x2 - x1 + dbx - dbx2;
            let oy = ty + y2 - y1 + dby - dby2;
            ctx.drawImage(canvas, x, y, width, height, ox, oy, width, height);
            ctx.globalCompositeOperation = 'source-over';
            if(offscreenHash.hasOwnProperty(i)) {
              ctx = applyOffscreen(ctx, offscreenHash[i], width, height, false);
            }
          }
          // 等于将外面bbox计算和渲染合一的过程，但不需要bbox本身的内容
          else {
            let offscreenBlend, offscreenMask, offscreenFilter, offscreenOverflow;
            let offscreen = node.__calOffscreen(ctx, __computedStyle);
            if(offscreen) {
              ctx = offscreen.ctx;
              offscreenBlend = offscreen.offscreenBlend;
              offscreenMask = offscreen.offscreenMask;
              offscreenFilter = offscreen.offscreenFilter;
              offscreenOverflow = offscreen.offscreenOverflow;
            }
            ctx.globalAlpha = opacity;
            ctx.setTransform(m[0], m[1], m[4], m[5], m[12], m[13]);
            node.render(renderMode, ctx, dx, dy);
            // 这里离屏顺序和xom里返回的一致，和下面应用离屏时的list相反
            if(offscreenBlend) {
              let j = i + (total || 0);
              if(hasMask) {
                j += countMaskNum(__structs, j + 1, hasMask);
              }
              let list = offscreenHash[j] = offscreenHash[j] || [];
              list.push({ idx: i, lv, type: OFFSCREEN_BLEND, offscreen: offscreenBlend });
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
            }
            // filter造成的离屏，需要将后续一段孩子节点区域的ctx替换，并在结束后应用结果，再替换回来
            if(offscreenFilter) {
              let j = i + (total || 0);
              if(hasMask) {
                j += countMaskNum(__structs, j + 1, hasMask);
              }
              let list = offscreenHash[j] = offscreenHash[j] || [];
              list.push({ idx: i, lv, type: OFFSCREEN_FILTER, offscreen: offscreenFilter });
            }
            // overflow:hidden的离屏，最后孩子进行截取
            if(offscreenOverflow) {
              let j = i + (total || 0);
              if(hasMask) {
                j += countMaskNum(__structs, j + 1, hasMask);
              }
              let list = offscreenHash[j] = offscreenHash[j] || [];
              list.push({ idx: i, lv, type: OFFSCREEN_OVERFLOW, offscreen: offscreenOverflow });
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
  }
  return target;
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
function genFrameBufferWithTexture(gl, texture, width, height) {
  let frameBuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
  // let check = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
  // if(check !== gl.FRAMEBUFFER_COMPLETE) {
  //   inject.error('Framebuffer object is incomplete: ' + check.toString());
  // }
  // 离屏窗口0开始
  gl.viewport(0, 0, width, height);
  // gl.clearColor(0, 0, 0, 0);
  // gl.clear(gl.COLOR_BUFFER_BIT);
  return frameBuffer;
}

/**
 * 局部根节点复合图层生成，汇总所有子节点到一颗局部树上的位图缓存，包含超限特殊情况
 * 即便只有自己一个也要返回，因为webgl生成total的原因是有类似filter/mask等必须离屏处理的东西
 * 传入isPpt的时候，说明是有perspective的节点在前置分割处理完毕之后，进行的渲染，需预乘pm透视矩阵
 * 传入pptNode/oitHash的时候，说明是透视节点下某个preserve3d的子节点，其渲染需要考虑其子节点平面拆分，预处理
 */
function genTotalWebgl(renderMode, __cacheTotal, gl, root, node, index, lv, total,
                       __structs, W, H, isPpt, pptNode, oitHash) {
  if(__cacheTotal && __cacheTotal.__available) {
    return __cacheTotal;
  }

  let top = node;
  let { __x1: x1, __y1: y1, __offsetWidth, __offsetHeight } = node;
  let bboxTotal = genBboxTotal(node, __structs, index, total, lv, isPpt);
  if(!bboxTotal) {
    return;
  }

  // overflow:hidden和canvas一样特殊考虑
  let w, h, dx, dy, cx, cy, texture, frameBuffer;
  let overflow = node.__computedStyle[OVERFLOW];
  if(overflow === 'hidden' && (x1 !== bboxTotal[0]
    || y1 !== bboxTotal[1]
    || __offsetWidth !== (bboxTotal[2] - bboxTotal[0])
    || __offsetHeight !== (bboxTotal[3] - bboxTotal[1]))) {
    // geom可能超限，不能直接用bbox
    bboxTotal = [x1, y1, x1 + __offsetWidth, y1 + __offsetHeight];
    w = __offsetWidth;
    h = __offsetHeight;
  }
  else {
    w = bboxTotal[2] - bboxTotal[0];
    h = bboxTotal[3] - bboxTotal[1];
  }
  if(__cacheTotal) {
    __cacheTotal.reset(bboxTotal, x1, y1);
  }
  else {
    __cacheTotal = TextureCache.getInstance(renderMode, gl, root.__uuid, bboxTotal, x1, y1, null);
  }
  if(!__cacheTotal || !__cacheTotal.__enabled) {
    if(w || h) {
      inject.warn('TextureCache of ' + node.tagName + '(' + index + ')' + ' is oversize: '
        + w + ', ' + h);
    }
    return;
  }

  __cacheTotal.__available = true;
  node.__cacheTotal = __cacheTotal;
  cx = w * 0.5;
  cy = h * 0.5;
  dx = -bboxTotal[0];
  dy = -bboxTotal[1];

  // 需要重新计算，因为bbox里是原本位置，这里是新的位置
  let pm, ppt;
  if(isPpt) {
    if(pptNode.__perspectiveMatrix) {
      let {
        [PERSPECTIVE]: perspective,
        [PERSPECTIVE_ORIGIN]: perspectiveOrigin,
      } = pptNode.__computedStyle;
      pm = tf.calPerspectiveMatrix(perspective, x1 + dx + perspectiveOrigin[0], y1 + dy + perspectiveOrigin[1]);
    }
    else {
      let perspectiveOrigin, wn = pptNode.__wasmNode;
      if(wn) {
        let cs = new Float64Array(wasm.instance.memory.buffer, wn.computed_style_ptr(), 18);
        perspectiveOrigin = [cs[16], cs[17]];
      }
      else {
        perspectiveOrigin = pptNode.__computedStyle[TRANSFORM_ORIGIN];
      }
      pm = tf.calPerspectiveMatrix(pptNode.__selfPerspective, x1 + dx + perspectiveOrigin[0], y1 + dy + perspectiveOrigin[1]);
    }
  }
  if(oitHash) {
    if(pptNode.__perspectiveMatrix) {
      let {
        [PERSPECTIVE]: perspective,
      } = pptNode.__computedStyle;
      ppt = perspective;
    }
    else {
      ppt = pptNode.__selfPerspective;
    }
  }

  let page = __cacheTotal.__page, size = page.__size;
  // 先绘制到一张单独的纹理，防止children中和cacheTotal重复texture不能绘制
  texture = createTexture(gl, null, 0, w, h);
  frameBuffer = genFrameBufferWithTexture(gl, texture, w, h);
  gl.viewport(0, 0, w, h);

  // 离屏画布的原点和尺寸信息存储
  root.__env = {
    x: dx,
    y: dy,
    width: w,
    height: h,
    node,
  };

  // fbo绘制对象纹理不用绑定单元，剩下的纹理绘制用0号
  let lastPage, list = [];
  let cacheTotal = __cacheTotal;
  for(let i = index, len = index + (total || 0) + 1; i < len; i++) {
    let {
      node,
      total,
      hasMask,
      isText,
    } = __structs[i];
    // 先看text，visibility会在内部判断，display会被parent判断
    if(isText) {
      let __cache = node.__cache;
      if(__cache && __cache.__available) {
        let {
          __opacity,
          matrixEvent,
        } = node.__domParent;
        let p = __cache.__page;
        if(lastPage && lastPage !== p) {
          drawTextureCache(gl, list.splice(0), cx, cy, dx, dy, null, null);
        }
        lastPage = p;
        list.push({ cache: __cache, opacity: __opacity, matrix: matrixEvent });
      }
    }
    // 再看total缓存/cache，都没有的是无内容的Xom节点
    else {
      let __computedStyle = node.__computedStyle;
      if(i > index) {
        if(__computedStyle[DISPLAY] === 'none' || node.__mask) {
          i += (total || 0);
          if(hasMask) {
            i += countMaskNum(__structs, i + 1, hasMask);
          }
          continue;
        }
      }
      let {
        [VISIBILITY]: visibility,
        [MIX_BLEND_MODE]: mixBlendMode,
        [BACKFACE_VISIBILITY]: backfaceVisibility,
      } = __computedStyle;
      if(visibility === 'hidden' && !total) {
        if(hasMask) {
          i += countMaskNum(__structs, i + 1, hasMask);
        }
        continue;
      }
      let {
        __domParent: p,
        __selfPerspective: ppt2,
        __opacity: opacity,
      } = node;
      // 特殊渲染的matrix，局部根节点为原点考虑，和bbox以节点自身主画布参考系不同
      let m;
      if(i > index) {
        // wasm取transform不同的方式
        let transform, tfo, wn = node.__wasmNode;
        if(wn) {
          transform = new Float64Array(wasm.instance.memory.buffer, wn.transform_ptr(), 16);
          let cs = new Float64Array(wasm.instance.memory.buffer, wn.computed_style_ptr(), 18);
          tfo = [cs[16], cs[17]];
        }
        else {
          transform = __computedStyle[TRANSFORM];
          tfo = __computedStyle[TRANSFORM_ORIGIN];
        }
        if(!isE(transform)) {
          m = tf.calMatrixByOrigin(transform, tfo[0] + node.__x1 + dx, tfo[1] + node.__y1 + dy);
        }
        if(ppt2) {
          let t = tf.calPerspectiveMatrix(ppt2, tfo[0] + node.__x1 + dx, tfo[1] + node.__y1 + dy);
          m = multiply(t, m);
        }
        if(p !== top) {
          m = multiply(p.__matrixEvent, m);
        }
        // 有透视还得预乘透视
        else if(pm) {
          m = multiply(pm, m);
        }
        assignMatrix(node.__matrixEvent, m);
        // 后面不可见，只有rotateX和rotateY翻转导致的0/5/10位的cos值为负，同时转2次抵消10位是正
        if(backfaceVisibility === 'hidden') {
          let m = node.matrix, x = m[5] < 0 && m[10] < 0, y = m[0] < 0 && m[10] < 0;
          if(x || y) {
            i += total || 0;
            if(hasMask) {
              i += countMaskNum(__structs, i + 1, hasMask);
            }
            continue;
          }
        }
      }
      // 有oit平面拆分的优先考虑，其一定没有mbm；否则走普通渲染逻辑
      let oit = oitHash && oitHash[i];
      if(oit) {
        drawTextureCache(gl, list.splice(0), cx, cy, dx, dy, null, null);
        lastPage = null;
        // 只求子节点的matrix即可
        for(let j = i + 1, len = i + (total || 0) + 1; j < len; j++) {
          let {
            node,
            total,
            hasMask,
            isText,
          } = __structs[j];
          if(!isText) {
            let __computedStyle = node.__computedStyle;
            if(__computedStyle[DISPLAY] === 'none' || node.__mask) {
              j += (total || 0);
              if(hasMask) {
                j += countMaskNum(__structs, j + 1, hasMask);
              }
              continue;
            }
            let {
              [VISIBILITY]: visibility,
              [BACKFACE_VISIBILITY]: backfaceVisibility,
            } = __computedStyle;
            if(visibility === 'hidden' && !total) {
              if(hasMask) {
                j += countMaskNum(__structs, j + 1, hasMask);
              }
              continue;
            }
            let p = node.__domParent;
            let transform, tfo, wn = node.__wasmNode;
            if(wn) {
              transform = new Float64Array(wasm.instance.memory.buffer, wn.transform_ptr(), 16);
              let cs = new Float64Array(wasm.instance.memory.buffer, wn.computed_style_ptr(), 18);
              tfo = [cs[16], cs[17]];
            }
            else {
              transform = __computedStyle[TRANSFORM];
              tfo = __computedStyle[TRANSFORM_ORIGIN];
            }
            let m;
            if(!isE(transform)) {
              m = tf.calMatrixByOrigin(transform, tfo[0] + node.__x1  + dx, tfo[1] + node.__y1 + dy);
            }
            if(p !== top) {
              m = multiply(p.__matrixEvent, m);
            }
            // 有透视还得预乘透视
            else if(pm) {
              m = multiply(pm, m);
            }
            assignMatrix(node.__matrixEvent, m);
            // 后面不可见，只有rotateX和rotateY翻转导致的0/5/10位的cos值为负，同时转2次抵消10位是正
            if(backfaceVisibility === 'hidden') {
              let m = node.matrix, x = m[5] < 0 && m[10] < 0, y = m[0] < 0 && m[10] < 0;
              if(x || y) {
                i += total || 0;
                if(hasMask) {
                  i += countMaskNum(__structs, i + 1, hasMask);
                }
                continue;
              }
            }
            let target = node.__cacheTarget;
            if(target === node.__cache) {
              target = null;
            }
            if(target) {
              j += (total || 0);
              if(hasMask) {
                j += countMaskNum(__structs, j + 1, hasMask);
              }
            }
          }
        }
        webgl.drawOitPlane(gl, __structs, oit, ppt, cx, cy, dx, dy);
        i += (total || 0);
        if(hasMask) {
          i += countMaskNum(__structs, i + 1, hasMask);
        }
        let render = node.render;
        if(render !== DOM_RENDER && render !== IMG_RENDER && render !== GEOM_RENDER) {
          drawTextureCache(gl, list.splice(0), cx, cy, dx, dy, null, null);
          lastPage = null;
          node.render(renderMode, gl, dx, dy);
          gl.useProgram(gl.program);
        }
      }
      else {
        let {
          __cache,
        } = node;
        let target = i > index ? node.__cacheTarget : __cache;
        if(target) {
          if(opacity > 0) {
            // 局部的mbm和主画布一样，先刷新当前fbo，然后把后面这个mbm节点绘入一个新的等画布尺寸的fbo中，再进行2者mbm合成
            if(i > index && mixBlendMode !== 'normal') {
              if(list.length) {
                drawTextureCache(gl, list.splice(0), cx, cy, dx, dy, null, null);
              }
              gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, null, 0);
              gl.bindFramebuffer(gl.FRAMEBUFFER, null);
              let res = genMbmWebgl(gl, texture, target, mixBlendMode, node.__opacity, m, dx, dy, cx, cy, size, size);
              if(res) {
                gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, null, 0);
                gl.bindFramebuffer(gl.FRAMEBUFFER, null);
                gl.deleteFramebuffer(frameBuffer);
                gl.deleteTexture(texture);
                texture = res.texture;
                frameBuffer = res.frameBuffer;
                gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
                gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
              }
              lastPage = null;
            }
            else {
              let p = target.__page;
              if(lastPage && lastPage !== p) {
                drawTextureCache(gl, list.splice(0), cx, cy, dx, dy, null, null);
              }
              lastPage = p;
              list.push({ cache: target, opacity: node.__opacity, matrix: m });
            }
          }
          if(target !== __cache) {
            i += (total || 0);
            if(hasMask) {
              i += countMaskNum(__structs, i + 1, hasMask);
            }
          }
        }
        // webgl特殊的外部钩子，比如粒子组件自定义渲染时调用
        if((!target || target === __cache) && opacity > 0) {
          let render = node.render;
          if(render !== DOM_RENDER && render !== IMG_RENDER && render !== GEOM_RENDER) {
            drawTextureCache(gl, list.splice(0), cx, cy, dx, dy, null, null);
            lastPage = null;
            node.render(renderMode, gl, dx, dy);
            gl.useProgram(gl.program);
          }
        }
      }
    }
  }

  // 删除fbo恢复
  drawTextureCache(gl, list, cx, cy, dx, dy, null, null);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, null, 0);
  // 汇入集合
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, page.texture, 0);
  gl.viewport(0, 0, size, size);
  drawTex2Cache(gl, gl.program, cacheTotal, texture, w, h);
  gl.deleteTexture(texture);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, null, 0);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.deleteFramebuffer(frameBuffer);
  gl.bindTexture(gl.TEXTURE_2D, null);
  gl.viewport(0, 0, W, H);

  root.__env = null;
  return __cacheTotal;
}

function genPptWebgl(renderMode, __cacheTotal, gl, root, node, index, lv, total, __structs, W, H) {
  if(__cacheTotal && __cacheTotal.__available) {
    return __cacheTotal;
  }

  let top = node;
  let mergeHash = [], mergeList = [];
  let isFlat = top.__computedStyle[TRANSFORM_STYLE] === 'flat', isTopFlat = isFlat;
  // 将产生transformStyle变化的节点记下来，直接子节点如果是flat也记下来，这样除了根节点下一直preserve3d的其它都被记录
  for(let i = index + 1, len = index + (total || 0) + 1; i < len; i++) {
    let {
      lv,
      node,
      total,
      hasMask,
      isText,
    } = __structs[i];
    if(isText) {
      let mh = mergeHash[i];
      if(mh) {
        isFlat = mh.isFlat;
      }
    }
    else {
      let __computedStyle = node.__computedStyle;
      if(__computedStyle[DISPLAY] === 'none' || node.__mask) {
        i += (total || 0);
        if(hasMask) {
          i += countMaskNum(__structs, i + 1, hasMask);
        }
        let mh = mergeHash[i];
        if(mh) {
          isFlat = mh.isFlat;
        }
        continue;
      }
      let {
        [VISIBILITY]: visibility,
        [TRANSFORM_STYLE]: transformStyle,
      } = __computedStyle;
      if(visibility === 'hidden' && !total) {
        if(hasMask) {
          i += countMaskNum(__structs, i + 1, hasMask);
        }
        let mh = mergeHash[i];
        if(mh) {
          isFlat = mh.isFlat;
        }
        continue;
      }
      let {
        __domParent: p,
      } = node;
      let target = node.__cacheTarget;
      if(target === node.__cache) {
        target = null;
      }
      // flat变化的局部子节点，或者flat根的直接子节点，生成局部根，已生成过的不用再生成
      if(total && !target && (transformStyle !== p.__computedStyle[TRANSFORM_STYLE]
        || p === top && transformStyle === 'flat')) {
        let j = i + (total || 0);
        if(hasMask) {
          j += countMaskNum(__structs, j + 1, hasMask);
        }
        mergeHash[j] = {
          isFlat,
        };
        isFlat = transformStyle === 'flat';
        // 变化的则生成新的局部子节点汇总，记录flat情况
        mergeList.push({
          i,
          lv,
          total,
          node,
          isFlat,
        });
      }
      // 子cache可以跳过，因为flat肯定先前执行
      if(target) {
        i += (total || 0);
        if(hasMask) {
          i += countMaskNum(__structs, i + 1, hasMask);
        }
      }
      let mh = mergeHash[i];
      if(mh) {
        isFlat = mh.isFlat;
      }
    }
  }
  // 排序依旧是子节点先，但同层级不用倒序（没有mask影响）
  mergeList.sort(function(a, b) {
    if(a.lv === b.lv) {
      return a.i - b.i;
    }
    return b.lv - a.lv;
  });
  // 根节点特殊处理，如果是flat就是flat但直接子节点后续渲染仍需要透视，如果是3d就要切分
  if(!isTopFlat) {
    mergeList.push({
      i: index,
      lv,
      total,
      node,
      isFlat: isTopFlat,
    });
  }
  // 变为preserve3d的子节点需要对其子节点进行平面拆分，记录这个子节点索引和拆分信息
  let oitHash = [];
  for(let i = 0, len = mergeList.length; i < len; i++) {
    let { i: index, lv, total, node, isFlat } = mergeList[i];
    // flat汇集临时cacheTotal
    if(isFlat) {
      genTotalWebgl(renderMode, node.__cacheTotal, gl, root, node, index, lv, total || 0,
        __structs, W, H, null, top, oitHash);
    }
    // preserve3d需要以此节点为局部根E，所有子节点四边形面在3d空间下求交拆分，暂时不绘制，等上层flat调用绘制投影
    else {
      let top = node, x0 = node.__x1, y0 = node.__y1, planeList = [];
      if(node.__hasContent) {
        let target = node.__cacheTarget;
        let o = {
          index,
          node,
          target,
          points: [
            { x: 0, y: 0, z: 0 },
            { x: node.__offsetWidth, y: 0, z: 0 },
            { x: node.__offsetWidth, y: node.__offsetHeight, z: 0 },
            { x: 0, y: node.__offsetHeight, z: 0 },
          ],
        };
        planeList.push(o);
      }
      for(let i = index + 1, len = index + (total || 0) + 1; i < len; i++) {
        let {
          node,
          total,
          hasMask,
          isText,
        } = __structs[i];
        if(isText) {
          let __cache = node.__cache;
          if(__cache && __cache.__available) {
            let {
              __matrixEvent,
            } = node.__domParent;
            let { x1: x, y1: y, __width: width, __height: height } = __cache;
            let xa = x - x0, ya = y - y0;
            let xb = x + width - x0, yb = y + height - y0;
            let { x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4 } = calRectPoint(xa, ya, xb, yb, __matrixEvent);
            let o = {
              index: i,
              node,
              target: __cache,
              points: [
                { x: x1, y: y1, z: z1 },
                { x: x2, y: y2, z: z2 },
                { x: x3, y: y3, z: z3 },
                { x: x4, y: y4, z: z4 },
              ],
            };
            planeList.push(o);
          }
        }
        else {
          let __computedStyle = node.__computedStyle;
          if(__computedStyle[DISPLAY] === 'none' || node.__mask) {
            i += (total || 0);
            if(hasMask) {
              i += countMaskNum(__structs, i + 1, hasMask);
            }
            continue;
          }
          let {
            [VISIBILITY]: visibility,
            [BACKFACE_VISIBILITY]: backfaceVisibility,
          } = __computedStyle;
          if(visibility === 'hidden' && !total) {
            if(hasMask) {
              i += countMaskNum(__structs, i + 1, hasMask);
            }
            continue;
          }
          // wasm取transform不同的方式
          let transform, tfo, wn = node.__wasmNode;
          if(wn) {
            transform = new Float64Array(wasm.instance.memory.buffer, wn.transform_ptr(), 16);
            let cs = new Float64Array(wasm.instance.memory.buffer, wn.computed_style_ptr(), 18);
            tfo = [cs[16], cs[17]];
          }
          else {
            transform = __computedStyle[TRANSFORM];
            tfo = __computedStyle[TRANSFORM_ORIGIN];
          }
          let {
            __cache,
            __domParent: p,
            __selfPerspective: ppt,
          } = node;
          // 当前局部根为原点坐标系下的matrix，只求交用
          let m;
          if(!isE(transform)) {
            m = tf.calMatrixByOrigin(transform, tfo[0] + node.__x1 - x0, tfo[1] + node.__y1 - y0);
          }
          if(ppt) {
            let t = tf.calPerspectiveMatrix(ppt, tfo[0] + node.__x1 - x0, tfo[1] + node.__y1 - y0);
            m = multiply(t, m);
          }
          if(p !== top) {
            m = multiply(p.__matrixEvent, m);
          }
          assignMatrix(node.__matrixEvent, m);
          // 后面不可见，只有rotateX和rotateY翻转导致的0/5/10位的cos值为负，同时转2次抵消10位是正
          if(backfaceVisibility === 'hidden') {
            let m = node.matrix, x = m[5] < 0 && m[10] < 0, y = m[0] < 0 && m[10] < 0;
            if(x || y) {
              i += total || 0;
              if(hasMask) {
                i += countMaskNum(__structs, i + 1, hasMask);
              }
              continue;
            }
          }
          let target = node.__cacheTarget;
          if(target) {
            let { x1: x, y1: y, __width: width, __height: height } = target;
            // 坐标计算还是以局部根为原点
            let xa = x - x0, ya = y - y0;
            let xb = x + width - x0, yb = y + height - y0;
            let { x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4 } = calRectPoint(xa, ya, xb, yb, m);
            let o = {
              index: i,
              node,
              target,
              points: [
                { x: x1, y: y1, z: z1 },
                { x: x2, y: y2, z: z2 },
                { x: x3, y: y3, z: z3 },
                { x: x4, y: y4, z: z4 },
              ],
            };
            planeList.push(o);
            if(target !== __cache) {
              i += (total || 0);
              if(hasMask) {
                i += countMaskNum(__structs, i + 1, hasMask);
              }
            }
          }
        }
      }
      // 有2个以上面才会求相交
      if(planeList.length > 1) {
        oit.splitQuadrilateralPlane(planeList);
      }
      // 没拆分的直接存入，拆分的存有效拼图
      let list = [];
      for(let i = 0, len = planeList.length; i < len; i++) {
        let plane = planeList[i];
        let puzzle = plane.puzzle;
        if(puzzle && puzzle.length) {
          for(let i = 0, len = puzzle.length; i < len; i++) {
            let p = puzzle[i];
            if(!p.isDeleted) {
              list.push(p);
            }
          }
        }
        else {
          list.push(plane);
        }
      }
      // 按z排序，远的先绘制
      oitHash[index] = oit.sortPuzzleZ(list);
    }
    node.__updateCache();
  }
  // 最后一次循环绘制到局部根节点上，类似genTotalWebgl()逻辑，但要考虑ppt透视
  return genTotalWebgl(renderMode, __cacheTotal, gl, root, node, index, lv, total,
    __structs, W, H, true, node, oitHash);
}

function genFilterWebgl(renderMode, gl, node, cache, filter, W, H) {
  let { x1, y1, width, height, bbox } = cache;
  let target = cache;
  filter.forEach(item => {
    let { k, v } = item;
    if(k === 'blur' && v > 0) {
      let res = genBlurWebgl(renderMode, gl, target, v);
      if(res) {
        if(target !== cache) {
          target.release();
        }
        target = res;
      }
    }
    else if(k === 'dropShadow') {
      let res = genDropShadowWebgl(renderMode, gl, target, v);
      if(res) {
        if(target !== cache) {
          target.release();
        }
        target = res;
      }
    }
    else if(k === 'hueRotate') {
      let rotation = geom.d2r(v % 360);
      let cosR = Math.cos(rotation);
      let sinR = Math.sin(rotation);
      let res = genColorMatrixWebgl(renderMode, gl, target, [
        0.213 + cosR * 0.787 - sinR * 0.213, 0.715 - cosR * 0.715 - sinR * 0.715, 0.072 - cosR * 0.072 + sinR * 0.928, 0, 0,
        0.213 - cosR * 0.213 + sinR * 0.143, 0.715 + cosR * 0.285 + sinR * 0.140, 0.072 - cosR * 0.072 - sinR * 0.283, 0, 0,
        0.213 - cosR * 0.213 - sinR * 0.787, 0.715 - cosR * 0.715 + sinR * 0.715, 0.072 + cosR * 0.928 + sinR * 0.072, 0, 0,
        0, 0, 0, 1, 0,
      ], width, height, x1, y1, bbox);
      if(res) {
        if(target !== cache) {
          target.release();
        }
        target = res;
      }
    }
    else if(k === 'saturate' && v !== 100) {
      let amount = v * 0.01;
      let res = genColorMatrixWebgl(renderMode, gl, target, [
        0.213 + 0.787 * amount,  0.715 - 0.715 * amount, 0.072 - 0.072 * amount, 0, 0,
        0.213 - 0.213 * amount,  0.715 + 0.285 * amount, 0.072 - 0.072 * amount, 0, 0,
        0.213 - 0.213 * amount,  0.715 - 0.715 * amount, 0.072 + 0.928 * amount, 0, 0,
        0, 0, 0, 1, 0,
      ], width, height, x1, y1, bbox);
      if(res) {
        if(target !== cache) {
          target.release();
        }
        target = res;
      }
    }
    else if(k === 'brightness' && v !== 100) {
      let b = v * 0.01;
      let res = genColorMatrixWebgl(renderMode, gl, target, [
        b, 0, 0, 0, 0,
        0, b, 0, 0, 0,
        0, 0, b, 0, 0,
        0, 0, 0, 1, 0,
      ], width, height, x1, y1, bbox);
      if(res) {
        if(target !== cache) {
          target.release();
        }
        target = res;
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
      let res = genColorMatrixWebgl(renderMode, gl, target, [
        0.2126 + 0.7874 * oneMinusAmount, 0.7152 - 0.7152 * oneMinusAmount, 0.0722 - 0.0722 * oneMinusAmount, 0, 0,
        0.2126 - 0.2126 * oneMinusAmount, 0.7152 + 0.2848 * oneMinusAmount, 0.0722 - 0.0722 * oneMinusAmount, 0, 0,
        0.2126 - 0.2126 * oneMinusAmount, 0.7152 - 0.7152 * oneMinusAmount, 0.0722 + 0.9278 * oneMinusAmount, 0, 0,
        0, 0, 0, 1, 0,
      ], width, height, x1, y1, bbox);
      if(res) {
        if(target !== cache) {
          target.release();
        }
        target = res;
      }
    }
    else if(k === 'contrast' && v !== 100) {
      let amount = v * 0.01;
      let o = -0.5 * amount + 0.5;
      let res = genColorMatrixWebgl(renderMode, gl, target, [
        amount, 0, 0, 0, o,
        0, amount, 0, 0, o,
        0, 0, amount, 0, o,
        0, 0, 0, 1, 0,
      ], width, height, x1, y1, bbox);
      if(res) {
        if(target !== cache) {
          target.release();
        }
        target = res;
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
      let res = genColorMatrixWebgl(renderMode, gl, target, [
        0.393 + 0.607 * oneMinusAmount, 0.769 - 0.769 * oneMinusAmount, 0.189 - 0.189 * oneMinusAmount, 0, 0,
        0.349 - 0.349 * oneMinusAmount, 0.686 + 0.314 * oneMinusAmount, 0.168 - 0.168 * oneMinusAmount, 0, 0,
        0.272 - 0.272 * oneMinusAmount, 0.534 - 0.534 * oneMinusAmount, 0.131 + 0.869 * oneMinusAmount, 0, 0,
        0, 0, 0, 1, 0,
      ], width, height, x1, y1, bbox);
      if(res) {
        if(target !== cache) {
          target.release();
        }
        target = res;
      }
    }
    else if(k === 'invert' && v > 0) {
      v = Math.min(v, 100);
      let o = v * 0.01;
      let amount = 1 - 2 * o;
      let res = genColorMatrixWebgl(renderMode, gl, target, [
        amount, 0, 0, 0, o,
        0, amount, 0, 0, o,
        0, 0, amount, 0, o,
        0, 0, 0, 1, 0,
      ], width, height, x1, y1, bbox);
      if(res) {
        if(target !== cache) {
          target.release();
        }
        target = res;
      }
    }
  });
  // 切换回主程序
  gl.useProgram(gl.program);
  gl.viewport(0, 0, W, H);
  return node.__cacheFilter = target;
}

function genBlurShader(gl, sigma, d) {
  let key = 'programBlur,' + sigma + ',' + d;
  if(gl.hasOwnProperty(key)) {
    return gl[key];
  }
  let weights = blur.gaussianWeight(sigma, d);
  let frag = '';
  let r = Math.floor(d * 0.5);
  for(let i = 0; i < r; i++) {
    let c = (r - i) * 0.01;
    frag += `gl_FragColor += texture2D(u_texture, v_texCoords + vec2(-${c}, -${c}) * u_direction) * ${weights[i]};
      gl_FragColor += texture2D(u_texture, v_texCoords + vec2(${c}, ${c}) * u_direction) * ${weights[i]};\n`;
  }
  frag += `gl_FragColor += texture2D(u_texture, v_texCoords) * ${weights[r]};`;
  frag = fragmentBlur.replace('placeholder', frag);
  return gl[key] = webgl.initShaders(gl, vertexBlur, frag);
}

/**
 * https://www.w3.org/TR/2018/WD-filter-effects-1-20181218/#feGaussianBlurElement
 * 根据cacheTotal生成cacheFilter，按照css规范的优化方法执行3次，避免卷积核d扩大3倍性能慢
 * 规范的优化方法对d的值分奇偶优化，这里再次简化，d一定是奇数，即卷积核大小
 * 先动态生成gl程序，默认3核源码示例已注释，根据sigma获得d（一定奇数），再计算权重
 * 然后将d尺寸和权重拼接成真正程序并编译成program，再开始绘制
 */
function genBlurWebgl(renderMode, gl, cache, sigma) {
  let { x1, y1, bbox, width, height } = cache;
  let d = blur.kernelSize(sigma);
  let spread = blur.outerSizeByD(d);
  // 防止超限，webgl最大纹理尺寸限制
  if(width > Page.MAX + spread || height > Page.MAX + spread) {
    inject.warn('Filter blur is oversize');
    return;
  }
  let bboxNew = bbox.slice(0);
  bboxNew[0] -= spread;
  bboxNew[1] -= spread;
  bboxNew[2] += spread;
  bboxNew[3] += spread;
  // 写到一个tex中方便后续处理
  let w = width + spread * 2, h = height + spread * 2;
  let tex = createTexture(gl, null, 0, w, h);
  let frameBuffer = genFrameBufferWithTexture(gl, tex, w, h);
  drawCache2Tex(gl, gl.program, cache, w, h, spread);
  // 生成blur，同尺寸复用fbo
  let program = genBlurShader(gl, sigma, d);
  tex = webgl.drawBlur(gl, program, tex, w, h);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, null, 0);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.deleteFramebuffer(frameBuffer);
  // 写回一个cache中
  let target = TextureCache.getInstance(renderMode, gl, cache.__rootId, bboxNew, x1, y1, null);
  target.__available = true;
  let page = target.__page, size = page.__size, texture = page.texture;
  frameBuffer = genFrameBufferWithTexture(gl, texture, size, size);
  drawTex2Cache(gl, gl.program, target, tex, w, h);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, null, 0);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.deleteFramebuffer(frameBuffer);
  return target;
}

function genColorMatrixWebgl(renderMode, gl, cache, m) {
  let { x1, y1, bbox } = cache;
  let target = TextureCache.getInstance(renderMode, gl, cache.__rootId, bbox.slice(0), x1, y1, cache.__page);
  target.__available = true;
  let page = target.__page, size = page.__size;
  let frameBuffer = genFrameBufferWithTexture(gl, target.__page.texture, size, size);
  webgl.drawCm(gl, gl.programCm, target, cache, m, size * 0.5, size);
  // 切回
  gl.useProgram(gl.program);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, null, 0);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.deleteFramebuffer(frameBuffer);
  return target;
}

function genMaskWebgl(renderMode, gl, root, node, cache, W, H, i, lv, __structs) {
  let { x1, y1, width, height, bbox, dbx, dby } = cache;
  let bboxNew = bbox.slice(0);
  // 结果不能和源同page纹理，一定符合尺寸要求，不会比源大
  let __cacheMask = TextureCache.getInstance(renderMode, gl, root.__uuid, bboxNew, x1, y1, cache.__page);
  __cacheMask.__available = true;
  node.__cacheMask = __cacheMask;
  // 先求得被遮罩的matrix，用作inverse给mask计算，以被遮罩左上角为原点
  let transform, tfo, wn = node.__wasmNode;
  if(wn) {
    transform = new Float64Array(wasm.instance.memory.buffer, wn.transform_ptr(), 16);
    let cs = new Float64Array(wasm.instance.memory.buffer, wn.computed_style_ptr(), 18);
    tfo = [cs[16], cs[17]];
  }
  else {
    transform = node.__computedStyle[TRANSFORM];
    tfo = node.__computedStyle[TRANSFORM_ORIGIN];
  }
  let inverse;
  if(isE(transform)) {
    inverse = mx.identity();
  }
  else {
    inverse = tf.calMatrixByOrigin(transform, tfo[0], tfo[1]);
  }
  inverse = mx.inverse(inverse);
  // 将所有mask绘入一个单独纹理中，尺寸和原点与被遮罩相同
  gl.viewport(0, 0, width, height);
  let texture = createTexture(gl, null, 0, width, height);
  let cx = width * 0.5, cy = height * 0.5;
  let frameBuffer = genFrameBufferWithTexture(gl, texture, width, height);
  let next = node.next;
  let isClip = next.__clip;
  let lastPage, list = [];
  let dx = -x1 + dbx, dy = -y1 + dby;
  while(next && next.__mask && next.__clip === isClip) {
    let total = __structs[i].total || 0;
    let matrixList = [];
    let parentMatrix;
    let lastMatrix;
    let opacityList = [];
    let parentOpacity = 1;
    let lastOpacity;
    let lastLv = lv;
    let index = i;
    for(let len = i + (total || 0) + 1; i < len; i++) {
      let {
        node,
        lv,
        total,
        hasMask,
        isText,
      } = __structs[i];
      if(isText) {
        let __cache = node.__cache;
        if(__cache && __cache.__available) {
          let {
            __matrixEvent,
            __opacity,
          } = node.__domParent;
          let p = __cache.__page;
          if(lastPage && lastPage !== p) {
            drawTextureCache(gl, list.splice(0), cx, cy, dx, dy, null, null);
          }
          lastPage = p;
          list.push({ cache: __cache, opacity: __opacity, matrix: __matrixEvent });
        }
      }
      else {
        let __limitCache = node.__limitCache;
        let computedStyle = node.__computedStyle;
        // 跳过display:none元素和它的所有子节点和mask
        if(computedStyle[DISPLAY] === 'none' || __limitCache) {
          i += (total || 0);
          if(hasMask) {
            i += countMaskNum(__structs, i + 1, hasMask);
          }
          continue;
        }
        let {
          [OPACITY]: opacity,
          [VISIBILITY]: visibility,
          [BACKFACE_VISIBILITY]: backfaceVisibility,
        } = computedStyle;
        if(visibility === 'hidden' && !total) {
          if(hasMask) {
            i += countMaskNum(__structs, i + 1, hasMask);
          }
          continue;
        }
        let {
          __cache,
        } = node;
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
        let transform, tfo, wn = node.__wasmNode;
        if(wn) {
          transform = new Float64Array(wasm.instance.memory.buffer, wn.transform_ptr(), 16);
          let cs = new Float64Array(wasm.instance.memory.buffer, wn.computed_style_ptr(), 18);
          tfo = [cs[16], cs[17]];
        }
        else {
          transform = computedStyle[TRANSFORM];
          tfo = computedStyle[TRANSFORM_ORIGIN];
        }
        // 不考虑mbm
        let m;
        if(isE(transform)) {
          m = mx.identity();
        }
        else {
          m = tf.calMatrixByOrigin(transform, tfo[0] + dbx + node.__x1 - x1, tfo[1] + dby + node.__y1 - y1);
        }
        if(!isE(parentMatrix)) {
          m = multiply(parentMatrix, m);
        }
        lastMatrix = m;
        lastOpacity = parentOpacity * opacity;
        let target = node.__cacheTarget;
        if(target && (target !== __cache || visibility === 'visible')) {
          m = mx.multiply(inverse, m);
          // 后面不可见，只有rotateX和rotateY翻转导致的0/5/10位的cos值为负，同时转2次抵消10位是正
          if(backfaceVisibility === 'hidden') {
            let m = node.matrix, x = m[5] < 0 && m[10] < 0, y = m[0] < 0 && m[10] < 0;
            if(x || y) {
              i += total || 0;
              if(hasMask) {
                i += countMaskNum(__structs, i + 1, hasMask);
              }
              continue;
            }
          }
          let p = target.__page;
          if(lastPage && lastPage !== p) {
            drawTextureCache(gl, list.splice(0), cx, cy, dx, dy, null, null);
          }
          lastPage = p;
          list.push({ cache: target, opacity: lastOpacity, matrix: m });
          if(target !== __cache) {
            i += (total || 0);
            if(hasMask) {
              i += countMaskNum(__structs, i + 1, hasMask);
            }
          }
        }
        // webgl特殊的外部钩子，比如粒子组件自定义渲染时调用
        if(!target || target === __cache) {
          let render = node.render;
          if(render !== DOM_RENDER && render !== IMG_RENDER && render !== GEOM_RENDER) {
            drawTextureCache(gl, list.splice(0), cx, cy, dx, dy, null, null);
            lastPage = null;
            node.render(renderMode, gl, dx, dy);
            gl.useProgram(gl.program);
          }
        }
      }
    }
    next = next.__next;
  }
  // 绘制到fbo的纹理对象上并删除fbo恢复
  drawTextureCache(gl, list, cx, cy, dx, dy, null, null);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, null, 0);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.deleteFramebuffer(frameBuffer);
  gl.bindTexture(gl.TEXTURE_2D, null);
  let program;
  if(isClip) {
    program = gl.programClip;
  }
  else {
    program = gl.programMask;
  }
  let page = __cacheMask.__page, size = page.size, tex = page.texture;
  frameBuffer = genFrameBufferWithTexture(gl, tex, size, size);
  webgl.drawMask(gl, program, __cacheMask, cache, texture, size * 0.5, size);
  // 切换回主程序
  gl.useProgram(gl.program);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, null, 0);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.deleteFramebuffer(frameBuffer);
  gl.viewport(0, 0, W, H);
  return __cacheMask;
}

/**
 * webgl的dropShadow只生成阴影部分，模糊复用blur，然后进行拼合
 * 复用blur时生成的模糊是临时的，和主程序模糊不一样，需区分
 */
function genDropShadowWebgl(renderMode, gl, cache, v) {
  let { x1, y1, bbox, width, height } = cache;
  // 先根据x/y/color生成单色阴影
  let [x, y, sigma, , color] = v;
  let d = blur.kernelSize(sigma);
  let spread = blur.outerSizeByD(d);
  // 防止超限，webgl最大纹理尺寸限制
  if(width > Page.MAX + spread || height > Page.MAX + spread) {
    inject.warn('Filter dropShadow is oversize');
    return;
  }
  let w = width + spread * 2, h = height + spread * 2;
  let tex1 = createTexture(gl, null, 0, w, h);
  let frameBuffer = genFrameBufferWithTexture(gl, tex1, w, h);
  gl.useProgram(gl.programDs);
  webgl.drawDropShadow(gl, gl.programDs, frameBuffer, cache, color, width, w, height, h);
  // 生成模糊的阴影
  if(sigma) {
    let program = genBlurShader(gl, sigma, d);
    tex1 = webgl.drawBlur(gl, program, tex1, w, h);
  }
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, null, 0);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.deleteFramebuffer(frameBuffer);
  // cache绘制到一个单独的tex上
  let tex2 = createTexture(gl, null, 0, width, height);
  frameBuffer = genFrameBufferWithTexture(gl, tex2, width, height);
  drawCache2Tex(gl, gl.program, cache, width, height, 0);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, null, 0);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.deleteFramebuffer(frameBuffer);
  // 原图tex2和模糊阴影tex1合成
  let bboxNew = bbox.slice(0);
  bboxNew[0] += x;
  bboxNew[1] += y;
  bboxNew[2] += x;
  bboxNew[3] += y;
  bboxNew[0] -= spread;
  bboxNew[1] -= spread;
  bboxNew[2] += spread;
  bboxNew[3] += spread;
  let bboxMerge = bbox.slice(0);
  mergeBbox(bboxMerge, bboxNew);
  let target = TextureCache.getInstance(renderMode, gl, cache.__rootId, bboxMerge, x1, y1, null);
  target.__available = true;
  let page = target.__page, size = page.__size;
  frameBuffer = genFrameBufferWithTexture(gl, page.texture, size, size);
  let dx1 = bboxNew[0] - bboxMerge[0], dy1 = bboxNew[1] - bboxMerge[1];
  let dx2 = bbox[0] - bboxMerge[0], dy2 = bbox[1] - bboxMerge[1];
  webgl.drawDropShadowMerge(gl, target, size, tex1, dx1, dy1, w, h, tex2, dx2, dy2, width, height);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, null, 0);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.deleteFramebuffer(frameBuffer);
  bindTexture(gl, null, 0);
  gl.deleteTexture(tex1);
  gl.deleteTexture(tex2);
  return target;
}

/**
 * 生成blendMode混合fbo纹理结果，原本是所有元素向画布或一个fbo记A进行绘制，当出现mbm时，进入到这里，
 * 先生成一个新的fbo记B，之前的绘制都先到B上，再把后续元素绘制到一个同尺寸的fbo纹理上，
 * 两者进行mbm混合，返回到A上
 */
function genMbmWebgl(gl, texture, cache, mbm, opacity, matrix, dx, dy, cx, cy, width, height) {
  // 后续绘制到同尺寸纹理上
  let tex = createTexture(gl, null, 0, width, height);
  let frameBuffer = genFrameBufferWithTexture(gl, tex, width, height);
  drawTextureCache(gl, [{ cache, opacity, matrix }], cx, cy, dx, dy, null, null);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, null, 0);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.deleteFramebuffer(frameBuffer);
  // 获取对应的mbm程序
  let program;
  mbm = mbmName(mbm);
  if(mbm === 'multiply') {
    program = gl.programMbmMp;
  }
  else if(mbm === 'screen') {
    program = gl.programMbmSr;
  }
  else if(mbm === 'overlay') {
    program = gl.programMbmOl;
  }
  else if(mbm === 'darken') {
    program = gl.programMbmDk;
  }
  else if(mbm === 'lighten') {
    program = gl.programMbmLt;
  }
  else if(mbm === 'color-dodge') {
    program = gl.programMbmCd;
  }
  else if(mbm === 'color-burn') {
    program = gl.programMbmCb;
  }
  else if(mbm === 'hard-light') {
    program = gl.programMbmHl;
  }
  else if(mbm === 'soft-light') {
    program = gl.programMbmSl;
  }
  else if(mbm === 'difference') {
    program = gl.programMbmDf;
  }
  else if(mbm === 'exclusion') {
    program = gl.programMbmEx;
  }
  else if(mbm === 'hue') {
    program = gl.programMbmHue;
  }
  else if(mbm === 'saturation') {
    program = gl.programMbmSt;
  }
  else if(mbm === 'color') {
    program = gl.programMbmCl;
  }
  else if(mbm === 'luminosity') {
    program = gl.programMbmLm;
  }
  gl.useProgram(program);
  // 生成新的fbo，将混合结果绘入
  let resTex = createTexture(gl, null, 0, width, height);
  let resFrameBuffer = genFrameBufferWithTexture(gl, resTex, width, height);
  webgl.drawMbm(gl, program, texture, tex);
  gl.useProgram(gl.program);
  return {
    texture: resTex,
    frameBuffer: resFrameBuffer,
  };
}

function renderSvg(renderMode, ctx, root, isFirst, rlv) {
  let { __structs, width, height } = root;
  // mask节点很特殊，本身有matrix会影响，本身没改变但对象节点有改变也需要计算逆矩阵应用顶点
  let maskEffectHash = [];
  if(!isFirst) {
    // 先遍历一遍收集完全不变的defs，缓存起来id，随后再执行遍历渲染生成新的，避免掉重复的id
    for(let i = 0, len = __structs.length; i < len; i++) {
      let {
        node,
        total,
        hasMask,
        isText,
      } = __structs[i];
      let __cacheDefs = node.__cacheDefs;
      let __refreshLevel = node.__refreshLevel;
      // 只要涉及到matrix和opacity就影响mask
      let hasEffectMask = hasMask && (__refreshLevel >= REPAINT || (__refreshLevel & (TRANSFORM_ALL | OP)));
      if(hasEffectMask) {
        let start = i + (total || 0) + 1;
        let end = start + hasMask;
        // mask索引遍历时处理，暂存遮罩对象的刷新lv
        maskEffectHash[end - 1] = __refreshLevel;
      }
      // >=REPAINT重绘生成走render()跳过这里
      if(__refreshLevel < REPAINT) {
        // 特殊的mask判断，遮罩对象影响这个mask了，除去filter、遮罩对象无TRANSFORM变化外都可缓存
        let mh = maskEffectHash[i];
        if(mh) {
          if(!(__refreshLevel & TRANSFORM_ALL) && mh < REPAINT && !(mh & TRANSFORM_ALL)) {
            __cacheDefs.forEach(item => {
              ctx.addCache(item);
            });
          }
        }
        // 去除特殊的filter，普通节点或不影响的mask在<REPAINT下defs的其它都可缓存
        else if(!isText) {
          __cacheDefs.forEach(item => {
            ctx.addCache(item);
          });
        }
      }
    }
  }
  let maskHash = [];
  // 栈代替递归，存父节点的matrix/opacity，matrix为E时存null省略计算
  let matrixList = [];
  let parentMatrix;
  let vdList = [];
  let parentVd;
  let lastLv = 0;
  let lastRefreshLv = 0;
  let lastNode;
  for(let i = 0, len = __structs.length; i < len; i++) {
    let {
      node,
      lv,
      total,
      hasMask,
      isText,
    } = __structs[i];
    let computedStyle, __refreshLevel, __cacheDefs, __cacheTotal;
    if(isText) {
      computedStyle = node.computedStyle;
      __refreshLevel = lastRefreshLv;
    }
    else {
      computedStyle = node.__computedStyle;
      __cacheDefs = node.__cacheDefs;
      __refreshLevel = node.__refreshLevel;
      __cacheTotal = node.__cacheTotal;
    }
    lastRefreshLv = __refreshLevel;
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
        isClip: __structs[start].node.__clip, // 第一个节点是clip为准
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
    if(__refreshLevel < REPAINT && !isText) {
      virtualDom = node.__virtualDom;
      // total可以跳过所有孩子节点省略循环
      if(__cacheTotal && __cacheTotal.__available) {
        i += (total || 0);
        virtualDom.cache = true;
      }
      else {
        __cacheTotal && (__cacheTotal.__available = true);
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
      if(__refreshLevel & TRANSFORM_ALL) {
        let matrix = node.__matrix;
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
      if(__refreshLevel & OP) {
        let opacity = computedStyle[OPACITY];
        if(opacity === 1) {
          delete virtualDom.opacity;
        }
        else {
          virtualDom.opacity = opacity;
        }
      }
      if(__refreshLevel & FT) {
        let filter = computedStyle[FILTER];
        let s = painter.svgFilter(filter);
        if(s) {
          virtualDom.filter = s;
        }
        else {
          delete virtualDom.filter;
        }
      }
      if(__refreshLevel & MBM) {
        let mixBlendMode = computedStyle[MIX_BLEND_MODE];
        if(mixBlendMode !== 'normal') {
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
      if(!isText) {
        node.__cacheDefs.splice(0);
        let matrix = node.__matrix;
        if(parentMatrix) {
          matrix = multiply(parentMatrix, matrix);
        }
        assignMatrix(node.__matrixEvent, matrix);
      }
      node.render(renderMode, ctx, 0, 0);
      virtualDom = node.__virtualDom;
      // svg mock，每次都生成，每个节点都是局部根，更新时自底向上清除
      if(!isText) {
        let o = node.__cacheTotal = node.__cacheTotal || {
          __available: true,
          get available() {
            return this.__available;
          },
          release() {
            this.__available = false;
            delete virtualDom.cache;
          },
          __offsetY() {},
        };
        o.__available = true;
      }
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
    let mh = maskHash[i];
    if(mh && (maskEffectHash[i]
        || __refreshLevel >= REPAINT
        || (__refreshLevel & (TRANSFORM_ALL | OP)))) {
      let { index, start, end, isClip } = mh;
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
          ctx.removeCache(item);
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
    if(parentVd && !node.__mask) {
      parentVd.children.push(virtualDom);
    }
    if(i === 0) {
      parentMatrix = node.__matrix;
      parentVd = virtualDom;
    }
  }
}

let lastList = [];
function renderWebgl(renderMode, gl, root, isFirst, rlv) {
  if(isFirst) {
    Page.init(gl.getParameter(gl.MAX_TEXTURE_SIZE), true);
  }
  let { __structs, width, height, __wasmRoot } = root;
  let wasmOp, wasmMe;
  if(__wasmRoot) {
    let len = __structs.length;
    wasmOp = new Float64Array(wasm.instance.memory.buffer, __wasmRoot.op_ptr(), len);
    wasmMe = new Float64Array(wasm.instance.memory.buffer, __wasmRoot.me_ptr(), len * 16);
  }
  let cx = width * 0.5, cy = height * 0.5;
  // 栈代替递归，存父节点的matrix/opacity，matrix为E时存null省略计算
  let lastRefreshLevel = NONE;
  let mergeList = [];
  let hasMbm; // 是否有混合模式出现
  /**
   * 先一遍先序遍历每个节点绘制到自己__cache上，排除Text和已有的缓存以及局部根缓存，
   * 根据refreshLevel进行等级区分，可能是<REPAINT或>=REPAINT，REFLOW布局已前置处理完。
   * 首次绘制没有catchTotal等，后续则可能会有，在<REPAINT可据此跳过所有子节点加快循环，布局过程会提前删除它们。
   * lv的变化根据大小相等进行出入栈parent操作，实现获取节点parent数据的方式，
   * 同时过程中计算出哪些节点要生成局部根，存下来
   * 第一次强制进入，后续不包含cache变更且<REPAINT的时候不进入省略循环
   */
  if(isFirst || rlv >= REPAINT || (rlv & (CACHE | FT | PPT | MASK))) {
    // 记录transformStyle，出现ppt时有用，同时ts为flat后同一ppt上下文影响继承显示
    let flatList = [], flatExtendList = [];
    let parentFlat = false, parentExtendFlat = false;
    let lastFlat = false, lastExtendFlat = false;
    let pptNodeList = [];
    let parentPptNode = null;
    let lastPptNode = null;
    let lastLv = 0;
    // 节点开始有ppt得记录，后续孩子中如果有flat的，得强制生成cacheTotal
    for(let i = 0, len = __structs.length; i < len; i++) {
      let {
        node,
        lv,
        total,
        hasMask,
        isText,
      } = __structs[i];
      node.__index = i; // 生成total需要
      // Text特殊处理，webgl中先渲染为bitmap，再作为贴图绘制，缓存交由text内部判断，直接调用渲染纹理方法
      if(isText) {
        if(lastRefreshLevel >= REPAINT) {
          let bbox = node.bbox, x = node.__x, y = node.__y;
          let __cache = node.__cache;
          if(__cache) {
            __cache.reset(bbox, x, y);
          }
          else {
            __cache = CanvasCache.getInstance(mode.CANVAS, gl, root.__uuid, bbox, x, y, null);
          }
          if(__cache && __cache.enabled) {
            __cache.__bbox = bbox;
            __cache.__available = true;
            node.__cache = __cache;
            node.render(mode.CANVAS, __cache.ctx, __cache.dx, __cache.dy);
            __cache.update();
            node.__cacheTarget = __cache;
          }
          else {
            __cache && __cache.release();
            node.__limitCache = true;
            node.__cacheTarget = null;
          }
        }
        continue;
      }
      let __computedStyle = node.__computedStyle;
      // 跳过display:none元素和它的所有子节点
      if(__computedStyle[DISPLAY] === 'none') {
        i += (total || 0);
        if(hasMask) {
          i += countMaskNum(__structs, i + 1, hasMask);
        }
        continue;
      }
      let perspective = __computedStyle[PERSPECTIVE];
      let isFlat = __computedStyle[TRANSFORM_STYLE] === 'flat';
      // 特殊，新的ppt上下文节点启用新值，否则还是老的
      let isExtendFlat = parentExtendFlat || isFlat;
      let pptNode = perspective ? node : null;
      // root第一个特殊处理
      if(lv === 0) {
        parentFlat = parentExtendFlat = isFlat;
        if(perspective) {
          parentPptNode = node;
        }
      }
      // lv变大说明是child，相等是sibling，变小可能是parent或另一棵子树
      else if(lv > lastLv) {
        parentFlat = lastFlat;
        flatList.push(isFlat);
        parentExtendFlat = lastExtendFlat;
        flatExtendList.push(isFlat);
        parentPptNode = lastPptNode || parentPptNode;
        pptNodeList.push(pptNode || parentPptNode);
      }
      // 变小出栈索引需注意，可能不止一层，多层计算diff层级
      else if(lv < lastLv) {
        let diff = lastLv - lv;
        flatList.splice(-diff);
        parentFlat = flatList[lv - 1];
        flatExtendList.splice(-diff);
        parentExtendFlat = flatExtendList[lv - 1];
        pptNodeList.splice(-diff);
        parentPptNode = pptNodeList[lv - 1];
      }
      // 不变是同级兄弟，无需特殊处理 else {}
      lastLv = lv;
      // 根据refreshLevel优化计算
      let {
        __refreshLevel,
        __currentStyle,
        __cacheTotal,
      } = node;
      node.__refreshLevel = NONE;
      /**
       * lv<REPAINT，一般会有__cache，跳过渲染过程，快速运算，没有cache则是自身超限或无内容，目前不感知
       * 可能有cacheTotal，为之前生成的局部根，清除逻辑在更新检查是否>=REPAINT那里，小变化不动
       * 当有遮罩时，如果被遮罩节点本身无变更，需要检查其next的遮罩节点有无变更，
       * 但其实不用检查，因为next变更一定会清空cacheMask，只要检查cacheMask即可
       * 如果没有或无效，直接添加，无视节点本身变化，后面防重即可
       */
      if(!__refreshLevel) {
      }
      else if(__refreshLevel < REPAINT) {
        let hasContent = node.__hasContent;
        let mixBlendMode = __computedStyle[MIX_BLEND_MODE];
        let isMbm = (__refreshLevel & MBM) && mixBlendMode !== 'normal';
        let need = node.__cacheAsBitmap || hasMask;
        if(!need && (__refreshLevel & (FT | CACHE))) {
          let filter = __computedStyle[FILTER];
          if(filter && filter.length) {
            need = true;
          }
        }
        let isPpt;
        if(!need && (__refreshLevel & (PPT | CACHE))) {
          let __domParent = node.__domParent;
          isPpt = total && perspective
            && (!isE(__domParent && __domParent.__perspectiveMatrix)
              || !isE(node.__selfPerspectiveMatrix));
          if(isPpt) {
            need = true;
          }
        }
        if(isMbm) {
          hasMbm = true;
        }
        // 这里和canvas不一样，前置cacheAsBitmap条件变成或条件之一，新的ppt层级且画中画需要新的fbo
        if(need && (hasContent || total)) {
          mergeList.push({
            i,
            lv,
            total,
            node,
            hasMask,
            isPpt,
          });
        }
        // total可以跳过所有孩子节点省略循环，filter/mask等的强制前提是有total
        if(__cacheTotal && __cacheTotal.__available) {
          i += (total || 0);
          if(__refreshLevel === NONE && hasMask) {
            i += countMaskNum(__structs, i + 1, hasMask);
          }
        }
      }
      /**
       * >=REPAINT重新渲染，并根据结果判断是否离屏限制错误
       * Geom没有子节点无需汇总局部根，Dom中Img也是，它们的局部根等于自身的cache，其它符合条件的Dom需要生成
       */
      else {
        let hasContent = node.calContent(__currentStyle, __computedStyle), onlyImg;
        // 有内容先以canvas模式绘制到离屏画布上，自定义渲染设置无内容不实现即可跳过
        if(hasContent) {
          let bbox = node.bbox, __cache = node.__cache, x1 = node.__x1, y1 = node.__y1;
          // 单图特殊对待缓存
          if(node instanceof Img) {
            let loadImg = node.__loadImg;
            if(loadImg.onlyImg && !loadImg.error && loadImg.source) {
              onlyImg = true;
              __cache = node.__cache = ImgWebglCache.getInstance(mode.CANVAS, gl, root.__uuid, bbox, loadImg, x1, y1);
              // 纯img按原尺寸绘制
              if(__cache && __cache.enabled && __cache.count === 1) {
                __cache.ctx.drawImage(loadImg.source, x1 + __cache.dx, y1 + __cache.dy);
                __cache.update();
              }
            }
          }
          if(!onlyImg) {
            if(__cache) {
              __cache.reset(bbox, x1, y1);
              // 特殊的单独img变为非纯img，需重新生成cache
              if(!(__cache instanceof CanvasCache)) {
                __cache = node.__cache = CanvasCache.getInstance(mode.CANVAS, gl, root.__uuid, bbox, x1, y1, null);
              }
            }
            else {
              __cache = node.__cache = CanvasCache.getInstance(mode.CANVAS, gl, root.__uuid, bbox, x1, y1, null);
            }
          }
          if(__cache && __cache.enabled) {
            __cache.__bbox = bbox;
            __cache.__available = true;
            node.__cache = __cache;
            if(!onlyImg) {
              node.render(mode.CANVAS, __cache.ctx, __cache.dx, __cache.dy);
              __cache.update();
            }
          }
          else {
            __cache && __cache.release();
            node.__limitCache = true;
            node.__cacheTarget = null;
            return;
          }
          node.__updateCache();
        }
        else {
          node.__limitCache = false;
          node.__cacheTarget = null;
        }
        if(hasContent || total) {
          let {
            [OVERFLOW]: overflow,
            [FILTER]: filter,
            [MIX_BLEND_MODE]: mixBlendMode,
            [PERSPECTIVE]: perspective,
          } = __computedStyle;
          let isMbm = mixBlendMode !== 'normal';
          let isPpt = total && perspective || !isE(node.__selfPerspectiveMatrix);
          let isOverflow = overflow === 'hidden' && total;
          let isFilter = filter && filter.length;
          if(isMbm) {
            hasMbm = true;
          }
          if(node.__cacheAsBitmap
            || hasMask
            || isFilter
            || isOverflow
            || isPpt) {
            mergeList.push({
              i,
              lv,
              total,
              node,
              hasMask,
              isPpt,
            });
          }
        }
      }
      lastRefreshLevel = __refreshLevel;
      lastFlat = isFlat;
      lastExtendFlat = isExtendFlat;
      lastPptNode = pptNode;
    }
  }
  // 根据收集的需要合并局部根的索引，尝试合并，按照层级从大到小，索引从大到小的顺序，
  // 这样保证子节点在前，后节点在前，后节点是为了mask先应用自身如filter之后再进行遮罩
  if(mergeList.length) {
    mergeList.sort(function(a, b) {
      if(a.lv === b.lv) {
        return b.i - a.i;
      }
      return b.lv - a.lv;
    });
    // ppt只有嵌套才需要生成，最下面的孩子节点的ppt无需，因此记录一个hash存index，
    // 同时因为是后序遍历，孩子先存所有父亲的index即可保证父亲才能生成cacheTotal
    for(let ii = 0, len = mergeList.length; ii < len; ii++) {
      let {
        i,
        lv,
        total,
        node,
        hasMask,
        isPpt,
      } = mergeList[ii];
      let {
        __computedStyle,
      } = node;
      let {
        [FILTER]: filter,
      } = __computedStyle;
      // 有ppt的，向上查找所有父亲index记录，可能出现重复记得提前跳出
      let {
        __limitCache,
        __cacheTotal,
        __cacheFilter,
        __cacheMask,
      } = node;
      if(__limitCache) {
        return;
      }
      let needGen;
      // 可能没变化，比如被遮罩节点、filter变更等
      if(!__cacheTotal || !__cacheTotal.__available) {
        let res;
        if(isPpt) {
          res = genPptWebgl(renderMode, __cacheTotal, gl, root, node, i, lv, total || 0,
            __structs, width, height);
        }
        else {
          res = genTotalWebgl(renderMode, __cacheTotal, gl, root, node, i, lv, total || 0,
            __structs, width, height, null, null, null);
        }
        if(!res) {
          return;
        }
        __cacheTotal = res;
        needGen = true;
      }
      // 即使超限，也有total结果
      let target = __cacheTotal;
      if(filter.length) {
        if(!__cacheFilter || !__cacheFilter.__available || needGen) {
          let res = genFilterWebgl(renderMode, gl, node, target, filter, width, height);
          if(res) {
            target = res;
            needGen = true;
          }
        }
      }
      if(hasMask && (!__cacheMask || !__cacheMask.__available || needGen)) {
        genMaskWebgl(renderMode, gl, root, node, target, width, height, i + (total || 0) + 1, lv, __structs);
      }
      node.__updateCache();
    }
  }
  // 非首次，没有cache变更重新生成的，可以直接用上次的缓存渲染列表
  else if(wasmOp && !isFirst && rlv < REPAINT && !(rlv & (CACHE | FT | PPT | MASK))) {
    for(let i = 0, len = lastList.length; i < len; i++) {
      drawTextureCache(gl, lastList[i], cx, cy, 0, 0, wasmOp, wasmMe);
    }
    return;
  }
  lastList.splice(0);
  /**
   * 最后先序遍历一次应用__cacheTotal即可，没有的用__cache，以及剩下的超尺寸的和Text
   * 由于mixBlendMode的存在，需先申请个fbo纹理，所有绘制默认向该纹理绘制，最后fbo纹理再进入主画布
   * 前面循环时有记录是否出现mbm，只有出现才申请，否则不浪费直接输出到主画布
   * 超尺寸的不绘制并给出警告，实现会扰乱逻辑且很少会出现这种情况
   */
  let frameBuffer, texture;
  if(hasMbm) {
    texture = createTexture(gl, null, 0, width, height);
    bindTexture(gl, null, 0);
    frameBuffer = genFrameBufferWithTexture(gl, texture, width, height);
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
  }
  let lastPage, list = [];
  for(let i = 0, len = __structs.length; i < len; i++) {
    let {
      node,
      total,
      hasMask,
      isText,
    } = __structs[i];
    // text如果display不可见，parent会直接跳过，不会走到这里，这里一定是直接绘制到root的，visibility在其内部判断
    if(isText) {
      // text特殊之处，__config部分是复用parent的
      let __cache = node.__cache;
      if(__cache && __cache.__available) {
        let {
          __matrixEvent,
          __opacity,
        } = node.__domParent;
        let p = __cache.__page;
        if(lastPage && lastPage !== p) {
          let o = list.splice(0);
          lastList.push(o);
          drawTextureCache(gl, o, cx, cy, 0, 0, wasmOp, wasmMe);
        }
        lastPage = p;
        if(wasmOp) {
          list.push({ cache: __cache, index: i, wasm: true });
        }
        else {
          list.push({ cache: __cache, opacity: __opacity, matrix: __matrixEvent });
        }
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
        [MIX_BLEND_MODE]: mixBlendMode,
        [VISIBILITY]: visibility,
        [BACKFACE_VISIBILITY]: backfaceVisibility,
      } = __computedStyle;
      let opacity = wasmOp ? wasmOp[i] : __computedStyle[OPACITY];
      let {
        __cache,
      } = node;
      let m;
      if(!wasmOp) {
        m = node.__matrix;
        let __selfPerspectiveMatrix = node.__selfPerspectiveMatrix;
        if(!isE(__selfPerspectiveMatrix)) {
          m = multiply(__selfPerspectiveMatrix, m);
        }
        let __domParent = node.__domParent;
        if(__domParent) {
          let op = __domParent.__opacity;
          if(op !== 1) {
            opacity *= __domParent.__opacity;
          }
          let pm = __domParent.__perspectiveMatrix, me = __domParent.__matrixEvent;
          if(pm && pm.length) {
            m = multiply(pm, m);
          }
          if(me && me.length) {
            m = multiply(me, m);
          }
        }
        node.__opacity = opacity;
        assignMatrix(node.__matrixEvent, m);
      }
      if(visibility === 'hidden' && !total) {
        if(hasMask) {
          i += countMaskNum(__structs, i + 1, hasMask);
        }
        continue;
      }
      // 后面不可见，只有rotateX和rotateY翻转导致的0/5/10位的cos值为负，同时转2次抵消10位是正
      if(backfaceVisibility === 'hidden') {
        let m = node.matrix, x = m[5] < 0 && m[10] < 0, y = m[0] < 0 && m[10] < 0;
        if(x || y) {
          i += total || 0;
          if(hasMask) {
            i += countMaskNum(__structs, i + 1, hasMask);
          }
          continue;
        }
      }
      // total和自身cache的尝试，visibility不可见时没有cache
      let target = node.__cacheTarget;
      if(target) {
        if(opacity > 0) {
          // 有mbm则需要混合之前的纹理和新纹理到fbo上面，连续的mbm则依次交替绘制到画布或离屏fbo上
          if(mixBlendMode !== 'normal') {
            if(list.length) {
              let o = list.splice(0);
              lastList.push(o);
              drawTextureCache(gl, o, cx, cy, 0, 0, wasmOp, wasmMe);
              lastPage = null;
            }
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, null, 0);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            gl.deleteFramebuffer(frameBuffer);
            let res = genMbmWebgl(gl, texture, target, mixBlendMode, opacity, m, 0, 0, cx, cy, width, height);
            if(res) {
              gl.deleteTexture(texture);
              texture = res.texture;
              frameBuffer = res.frameBuffer;
            }
          }
          else {
            let p = target.__page;
            if(lastPage && lastPage !== p) {
              let o = list.splice(0);
              lastList.push(o);
              drawTextureCache(gl, o, cx, cy, 0, 0, wasmOp, wasmMe);
            }
            lastPage = p;
            if(wasmOp) {
              list.push({ cache: target, index: i, wasm: true });
            }
            else {
              list.push({ cache: target, opacity, matrix: m });
            }
          }
        }
        if(target !== __cache) {
          i += (total || 0);
          if(hasMask) {
            i += countMaskNum(__structs, i + 1, hasMask);
          }
        }
      }
      // webgl特殊的外部钩子，比如粒子组件自定义渲染时调用
      if((!target || target === __cache) && opacity > 0) {
        let render = node.render;
        if(render !== DOM_RENDER && render !== IMG_RENDER && render !== GEOM_RENDER) {
          let o = list.splice(0);
          lastList.push(o);
          drawTextureCache(gl, o, cx, cy, 0, 0, wasmOp, wasmMe);
          lastPage = null;
          node.render(renderMode, gl, 0, 0);
          gl.useProgram(gl.program);
        }
      }
    }
  }
  lastList.push(list);
  drawTextureCache(gl, list, cx, cy, 0, 0, wasmOp, wasmMe);
  // 有mbm时将汇总的fbo绘入主画布，否则本身就是到主画布无需多余操作
  if(hasMbm) {
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, null, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
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
    bindTexture(gl, texture, 0);
    let u_texture = gl.getUniformLocation(gl.program, 'u_texture');
    gl.uniform1i(u_texture, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.deleteBuffer(pointBuffer);
    gl.deleteBuffer(texBuffer);
    gl.deleteBuffer(opacityBuffer);
    gl.disableVertexAttribArray(a_position);
    gl.disableVertexAttribArray(a_texCoords);
    gl.deleteTexture(texture);
  }
}

function renderCanvas(renderMode, ctx, root, isFirst, rlv) {
  let { __structs, width, height, __wasmRoot } = root;
  let wasmOp, wasmMe;
  if(__wasmRoot) {
    let len = __structs.length;
    wasmOp = new Float64Array(wasm.instance.memory.buffer, __wasmRoot.op_ptr(), len);
    wasmMe = new Float64Array(wasm.instance.memory.buffer, __wasmRoot.me_ptr(), len * 16);
  }
  let mergeList = [];
  /**
   * 先一遍先序遍历收集cacheAsBitmap的节点，说明这棵子树需要缓存，可能出现嵌套，深层级优先、后面优先
   * 可能遇到已有缓存没变化的，这时候不要收集忽略掉，没有缓存的走后面遍历普通渲染
   * 第一次强制进入，后续不包含cache变更且<REPAINT的时候不进入省略循环
   */
  if(isFirst || rlv >= REPAINT || (rlv & (CACHE | FT | MASK))) {
    for(let i = 0, len = __structs.length; i < len; i++) {
      let {
        node,
        lv,
        total,
        hasMask,
        isText,
      } = __structs[i];
      // 排除Text，要么根节点直接绘制，要么被局部根节点汇总，自身并不缓存（fillText比位图更快）
      if(isText) {
        continue;
      }
      let __computedStyle = node.__computedStyle;
      // 跳过display:none元素和它的所有子节点
      if(__computedStyle[DISPLAY] === 'none') {
        i += (total || 0);
        if(hasMask) {
          i += countMaskNum(__structs, i + 1, hasMask);
        }
        continue;
      }
      // 根据refreshLevel优化计算，处理其样式
      let {
        __refreshLevel,
        __cacheTotal,
      } = node;
      node.__refreshLevel = NONE;
      // filter变化需重新生成，cacheTotal本身就存在要判断下；CACHE取消重新生成则无需判断
      // img在只有自身的情况下自动生成并特殊对待，cache是<img>标签，多个相同引用的img使用同一份资源
      let need = node.__cacheAsBitmap &&
        ((__refreshLevel & (CACHE | FT)) || __refreshLevel >= REPAINT);
      if(!need && node instanceof Img) {
        let hasContent = node.calContent(node.__currentStyle, node.__computedStyle);
        let loadImg = node.__loadImg;
        if(loadImg.onlyImg && hasContent) {
          need = true;
        }
      }
      if(need) {
        mergeList.push({
          i,
          lv,
          total,
          node,
          hasMask,
        });
      }
      // total可以跳过所有孩子节点省略循环，filter/mask等的强制前提是有total
      if(__cacheTotal && __cacheTotal.__available) {
        i += (total || 0);
        if(__refreshLevel === NONE && hasMask) {
          i += countMaskNum(__structs, i + 1, hasMask);
        }
      }
    }
  }
  /**
   * 根据收集的需要合并局部根的索引，尝试合并，按照层级从大到小，索引从大到小的顺序，
   * 这样保证子节点在前，后节点在前，后节点是为了mask先应用自身如filter之后再进行遮罩
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
      let __cacheTotal = genTotal(renderMode, ctx, root, node, i, lv, total || 0, __structs, width, height);
      if(__cacheTotal) {
        genTotalOther(renderMode, __structs, __cacheTotal, node, hasMask, width, height);
        node.__updateCache();
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
  let maskStartHash = [];
  let offscreenHash = [];
  let lastOpacity = -1;
  for(let i = 0, len = __structs.length; i < len; i++) {
    let {
      node,
      lv,
      total,
      hasMask,
      isText,
    } = __structs[i];
    // text如果display不可见，parent会直接跳过，不会走到这里，这里一定是直接绘制到root的，visibility在其内部判断
    if(isText) {
      node.render(renderMode, ctx, 0, 0);
      let oh = offscreenHash[i];
      if(oh) {
        ctx = applyOffscreen(ctx, oh, width, height, false);
        lastOpacity = -1;
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
        let oh = offscreenHash[i];
        if(oh) {
          ctx = applyOffscreen(ctx, oh, width, height, true);
          lastOpacity = -1;
        }
        continue;
      }
      // 遮罩对象申请了个离屏，其第一个mask申请另外一个离屏mask2，开始聚集所有mask元素的绘制，
      // 这是一个十分特殊的逻辑，保存的index是最后一个节点的索引，OFFSCREEN_MASK2是最低优先级，
      // 这样当mask本身有filter时优先自身，然后才是OFFSCREEN_MASK2
      let msh = maskStartHash[i];
      if(msh) {
        let { idx, hasMask, offscreenMask } = msh;
        let target = inject.getOffscreenCanvas(width, height, null, 'mask2');
        offscreenMask.mask = target; // 应用mask用到
        offscreenMask.isClip = node.__clip;
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
      let opacity = wasmOp ? wasmOp[i] : __computedStyle[OPACITY];
      let m;
      if(!wasmOp) {
        m = node.__matrix;
        let __domParent = node.__domParent;
        if(__domParent) {
          let op = __domParent.__opacity;
          if(op !== 1) {
            opacity *= __domParent.__opacity;
          }
          let me = __domParent.__matrixEvent;
          if(me && me.length) {
            m = multiply(me, m);
          }
        }
        node.__opacity = opacity;
        assignMatrix(node.__matrixEvent, m);
      }
      // 有cache声明从而有total的可以直接绘制并跳过子节点索，total生成可能会因超限而失败
      let target = node.__cacheTarget;
      if(target === node.__cache) {
        target = null;
      }
      if(target) {
        if(lastOpacity !== opacity) {
          ctx.globalAlpha = opacity;
          lastOpacity = opacity;
        }
        if(opacity > 0) {
          if(wasmOp) {
            let idx = i * 16;
            ctx.setTransform(wasmMe[idx], wasmMe[idx + 1], wasmMe[idx + 4], wasmMe[idx + 5], wasmMe[idx + 12], wasmMe[idx + 13]);
          }
          else {
            ctx.setTransform(m[0], m[1], m[4], m[5], m[12], m[13]);
          }
          let mixBlendMode = __computedStyle[MIX_BLEND_MODE];
          if(mixBlendMode !== 'normal') {
            ctx.globalCompositeOperation = mbmName(mixBlendMode);
          }
          let { x, y, canvas, x1, y1, dbx, dby, width: w, height: h } = target;
          ctx.drawImage(canvas, x, y, w, h, x1 - dbx, y1 - dby, w, h);
          // total应用后记得设置回来
          ctx.globalCompositeOperation = 'source-over';
        }
        i += (total || 0);
        if(hasMask) {
          i += countMaskNum(__structs, i + 1, hasMask);
        }
        // 父超限但子有total的时候，i此时已经增加到了末尾，也需要检查
        let oh = offscreenHash[i];
        if(oh) {
          ctx = applyOffscreen(ctx, oh, width, height, false);
          lastOpacity = -1;
        }
      }
      // 没有cacheTotal是普通节点绘制
      else {
        // 如果有离屏则先申请替换ctx
        let offscreenBlend, offscreenMask, offscreenFilter, offscreenOverflow;
        let offscreen = node.__calOffscreen(ctx, __computedStyle);
        if(offscreen) {
          ctx = offscreen.ctx;
          offscreenBlend = offscreen.offscreenBlend;
          offscreenMask = offscreen.offscreenMask;
          offscreenFilter = offscreen.offscreenFilter;
          offscreenOverflow = offscreen.offscreenOverflow;
        }
        // 节点自身渲染
        if(lastOpacity !== opacity) {
          ctx.globalAlpha = opacity;
          lastOpacity = opacity;
        }
        if(opacity > 0) {
          if(wasmOp) {
            let idx = i * 16;
            ctx.setTransform(wasmMe[idx], wasmMe[idx + 1], wasmMe[idx + 4], wasmMe[idx + 5], wasmMe[idx + 12], wasmMe[idx + 13]);
          }
          else {
            ctx.setTransform(m[0], m[1], m[4], m[5], m[12], m[13]);
          }
          node.render(renderMode, ctx, 0, 0);
        }
        // 这里离屏顺序和xom里返回的一致，和下面应用离屏时的list相反
        if(offscreenBlend) {
          let j = i + (total || 0);
          if(hasMask) {
            j += countMaskNum(__structs, j + 1, hasMask);
          }
          let list = offscreenHash[j] = offscreenHash[j] || [];
          list.push({ idx: i, lv, type: OFFSCREEN_BLEND, offscreen: offscreenBlend });
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
        }
        // filter造成的离屏，需要将后续一段孩子节点区域的ctx替换，并在结束后应用结果，再替换回来
        if(offscreenFilter) {
          let j = i + (total || 0);
          if(hasMask) {
            j += countMaskNum(__structs, j + 1, hasMask);
          }
          let list = offscreenHash[j] = offscreenHash[j] || [];
          list.push({ idx: i, lv, type: OFFSCREEN_FILTER, offscreen: offscreenFilter });
        }
        // overflow:hidden的离屏，最后孩子进行截取
        if(offscreenOverflow) {
          let j = i + (total || 0);
          if(hasMask) {
            j += countMaskNum(__structs, j + 1, hasMask);
          }
          let list = offscreenHash[j] = offscreenHash[j] || [];
          list.push({ idx: i, lv, type: OFFSCREEN_OVERFLOW, offscreen: offscreenOverflow });
        }
        // 离屏应用，按照lv从大到小即子节点在前先应用，同一个节点多个效果按offscreen优先级从小到大来，
        // 由于mask特殊索引影响，所有离屏都在最后一个mask索引判断，此时mask本身优先结算，以index序大到小判断
        let oh = offscreenHash[i];
        if(oh) {
          ctx = applyOffscreen(ctx, oh, width, height, false);
          lastOpacity = -1;
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

