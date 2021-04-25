import Geom from '../node/geom/Geom';
import Text from '../node/Text';
import Dom from '../node/Dom';
import Img from '../node/Img';
import mode from '../node/mode';
import mx from '../math/matrix';
import level from './level';
import util from '../util/util';
import inject from '../util/inject';
import Cache from './Cache';
import Page from './Page';
import tf from '../style/transform';
import enums from '../util/enums';
import TexCache from '../gl/TexCache';
import webgl from '../gl/webgl';
import MockCache from '../gl/MockCache';

const {
  STYLE_KEY: {
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
  NODE_KEY: {
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
    NODE_CACHE_STYLE,
    NODE_DEFS_CACHE,
    NODE_IS_MASK,
    NODE_DOM_PARENT,
  },
  STRUCT_KEY: {
    STRUCT_NODE,
    STRUCT_INDEX,
    STRUCT_TOTAL,
    STRUCT_HAS_MASK,
    STRUCT_LV,
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
} = level;
const { isE, inverse, multiply, revertY } = mx;

// 依次从list获取首个available可用的cache
function getCache(list) {
  for(let i = 0, len = list.length; i < len; i++) {
    let item = list[i];
    if(item && item.available) {
      return item;
    }
  }
}

function genBboxTotal(node, __structs, index, total, parentIndexHash, opacityHash, matrixHash) {
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
  // 广度遍历，不断一层层循环下去，用2个hash暂存每层的父matrix和opacity，blur只需记住顶层，因为子的如果有一定是cacheFilter
  let list = [index];
  let d = mx.int2convolution(blurValue);
  opacityHash[index] = 1;
  while(list.length) {
    list.splice(0).forEach(parentIndex => {
      let total = __structs[parentIndex][STRUCT_TOTAL] || 0;
      for(let i = parentIndex + 1, len = parentIndex + total + 1; i < len; i++) {
        let {
          [STRUCT_NODE]: node2,
          [STRUCT_TOTAL]: total,
        } = __structs[i];
        // mask也不占bbox位置
        if(node2.isMask) {
          continue;
        }
        let {
          __sx1,
          __sy1,
          __config: {
            [NODE_LIMIT_CACHE]: __limitCache,
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
              [OPACITY]: opacity,
            },
          },
        } = node2;
        if(__limitCache) {
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
        // 防止text的情况，其一定属于某个node，其bbox被计算过，text不应该计算
        if(node2 instanceof Text) {
          continue;
        }
        let bbox, dx = 0, dy = 0, hasTotal;
        let target = getCache([__cacheMask, __cacheOverflow, __cacheFilter, __cacheTotal]);
        if(target) {
          bbox = target.bbox.slice(0);
          dx = target.dbx;
          dy = target.dby;
          i += total || 0;
          hasTotal = true;
        }
        else if(__cache && __cache.available) {
          bbox = __cache.bbox.slice(0);
          dx = __cache.dbx;
          dy = __cache.dby;
        }
        else {
          bbox = node2.bbox;
        }
        // 可能Xom没有内容
        if(bbox) {
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
          bbox = util.transformBbox(bbox, matrix, d, d);
          // 有孩子才继续存入下层级广度运算
          if(total && !hasTotal) {
            list.push(i);
          }
          mergeBbox(bboxTotal, bbox, sx1, sy1);
        }
      }
    });
  }
  if((bboxTotal[2] - bboxTotal[0]) > Cache.MAX || (bboxTotal[3] - bboxTotal[1]) > Cache.MAX) {
    // 标识后续不再尝试生成，重新布局会清空标识
    __config[NODE_LIMIT_CACHE] = true;
    return;
  }
  return bboxTotal;
}

function mergeBbox(bbox, t, sx1, sy1) {
  bbox[0] = Math.min(bbox[0], sx1 + t[0]);
  bbox[1] = Math.min(bbox[1], sy1 + t[1]);
  bbox[2] = Math.max(bbox[2], sx1 + t[2]);
  bbox[3] = Math.max(bbox[3], sy1 + t[3]);
}

function genTotal(renderMode, node, __config, index, total, __structs, cacheTop, cache) {
  if(total === 0) {
    return cache;
  }
  // 存每层父亲的matrix和opacity和index，bbox计算过程中生成，缓存给下面渲染过程用
  let parentIndexHash = {};
  let matrixHash = {};
  let opacityHash = {};
  let bboxTotal = genBboxTotal(node, __structs, index, total, parentIndexHash, opacityHash, matrixHash);
  if(!bboxTotal) {
    return;
  }
  if(cacheTop) {
    cacheTop.reset(bboxTotal);
  }
  else {
    cacheTop = Cache.getInstance(bboxTotal);
  }
  // 创建失败，再次降级
  if(!cacheTop || !cacheTop.enabled) {
    return;
  }
  let { __sx1: sx1, __sy1: sy1 } = node;
  cacheTop.__appendData(sx1, sy1);
  cacheTop.__available = true;
  let { coords: [tx, ty], ctx, dbx, dby } = cacheTop;
  // 先绘制自己的cache，起点所以matrix视作E为空，opacity固定1
  if(cache && cache.available) {
    ctx.globalAlpha = 1;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    Cache.drawCache(cache, cacheTop);
  }
  // 先序遍历汇总到total
  for(let i = index + 1, len = index + (total || 0) + 1; i < len; i++) {
    let {
      [STRUCT_NODE]: node,
      [STRUCT_TOTAL]: total,
      [STRUCT_HAS_MASK]: hasMask,
    } = __structs[i];
    let __config = node.__config;
    let parentIndex = parentIndexHash[i];
    let matrix = matrixHash[parentIndex];
    let opacity = opacityHash[parentIndex];
    // 先看text，visibility会在内部判断，display会被parent判断
    if(node instanceof Text) {
      ctx.globalAlpha = opacity;
      let m = matrix || [1, 0, 0, 1, 0, 0];
      ctx.setTransform(m[0], m[1], m[2], m[3], m[4], m[5]);
      node.render(renderMode, 0, ctx, null, tx - sx1 + dbx, ty - sy1 + dby);
    }
    // 再看total缓存/cache，都没有的是无内容的Xom节点
    else {
      let {
        [NODE_CACHE]: __cache,
        [NODE_CACHE_TOTAL]: __cacheTotal,
        [NODE_CACHE_FILTER]: __cacheFilter,
        [NODE_CACHE_MASK]: __cacheMask,
        [NODE_CACHE_OVERFLOW]: __cacheOverflow,
        [NODE_IS_MASK]: isMask,
        [NODE_COMPUTED_STYLE]: {
          [DISPLAY]: display,
          [VISIBILITY]: visibility,
          [TRANSFORM]: transform,
          [TRANSFORM_ORIGIN]: transformOrigin,
          [MIX_BLEND_MODE]: mixBlendMode,
        },
      } = __config;
      if(display === 'none') {
        i += (total || 0);
        if(hasMask) {
          i += hasMask;
        }
        continue;
      }
      if(visibility === 'hidden') {
        continue;
      }
      // mask不能被汇总到top上
      if(isMask) {
        continue;
      }
      if(transform && !isE(transform)) {
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
          matrix = multiply(matrix, m);
        }
        else {
          matrix = m;
        }
      }
      if(matrix) {
        matrixHash[i] = matrix;
      }
      let target = getCache([__cacheMask, __cacheOverflow, __cacheFilter, __cacheTotal]);
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
        if(target === __cacheMask) {
          i += hasMask;
        }
      }
    }
  }
  return cacheTop;
}

function genFilter(node, cache, v) {
  return node.__config[NODE_CACHE_FILTER] = Cache.genBlur(cache, v);
}

function genMask(node, cache, isClip) {
  let { [TRANSFORM]: transform, [TRANSFORM_ORIGIN]: transformOrigin } = node.computedStyle;
  return node.__config[NODE_CACHE_MASK] = Cache.genMask(cache, node.next, isClip, transform, transformOrigin);
}

function genOverflow(node, cache) {
  return node.__config[NODE_CACHE_OVERFLOW] = Cache.genOverflow(cache, node);
}

// webgl不太一样，使用fbo离屏绘制到一个纹理上进行汇总
function genFrameBufferWithTexture(gl, texCache, fullSize) {
  let n = texCache.lockOneChannel();
  let texture = webgl.createTexture(gl, null, n, fullSize, fullSize);
  let frameBuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
  let check = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
  if(check !== gl.FRAMEBUFFER_COMPLETE) {
    inject.error('Framebuffer object is incomplete: ' + check.toString());
  }
  // 离屏窗口0开始，上下左右各扩展1px
  gl.viewport(0, 0, fullSize, fullSize);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  return [n, frameBuffer, texture];
}

/**
 * 局部根节点复合图层生成，汇总所有子节点到一颗局部树上的位图缓存，如果超限则不返回
 * @param renderMode
 * @param gl
 * @param texCache
 * @param node
 * @param __config
 * @param index
 * @param total
 * @param __structs
 * @param cache
 * @param W
 * @param H
 * @returns {*}
 */
function genTotalWebgl(renderMode, gl, texCache, node, __config, index, total, __structs, cache, W, H) {
  if(total === 0) {
    return cache;
  }
  // 存每层父亲的matrix和opacity和index，bbox计算过程中生成，缓存给下面渲染过程用
  let parentIndexHash = {};
  let matrixHash = {};
  let opacityHash = {};
  let bboxTotal = genBboxTotal(node, __structs, index, total, parentIndexHash, opacityHash, matrixHash);
  if(!bboxTotal) {
    return;
  }
  let width = bboxTotal[2] - bboxTotal[0];
  let height = bboxTotal[3] - bboxTotal[1];
  let fullSize = Math.max(width + 2, height + 2);
  let [n, frameBuffer, texture] = genFrameBufferWithTexture(gl, texCache, fullSize);
  // 以bboxTotal的左上角-1px为原点生成离屏texture
  let { __sx1: sx1, __sy1: sy1 } = node;
  let cx = fullSize * 0.5, cy = fullSize * 0.5;
  let dx = -bboxTotal[0] + 1, dy = -bboxTotal[1] + 1;
  let dbx = sx1 - bboxTotal[0], dby = sy1 - bboxTotal[1];
  // 先绘制自己的cache，起点所以matrix视作E为空，opacity固定1
  if(cache && cache.available) {
    let m = mx.m2Mat4([1, 0, 0, 1, 0, 0], cx, cy);
    texCache.addTexAndDrawWhenLimit(gl, cache, 1, m, cx, cy, dx, dy);
  }
  // 先序遍历汇总到total
  for(let i = index + 1, len = index + (total || 0) + 1; i < len; i++) {
    let {
      [STRUCT_NODE]: node,
      [STRUCT_TOTAL]: total,
      [STRUCT_HAS_MASK]: hasMask,
    } = __structs[i];
    let __config = node.__config;
    let parentIndex = parentIndexHash[i];
    let matrix = matrixHash[parentIndex];
    let opacity = opacityHash[parentIndex];
    // 先看text，visibility会在内部判断，display会被parent判断
    if(node instanceof Text) {
      let m = mx.m2Mat4(matrix || [1, 0, 0, 1, 0, 0], cx, cy);
      texCache.addTexAndDrawWhenLimit(gl, node.__cache, opacity, m, cx, cy, dx, dy);
    }
    // 再看total缓存/cache，都没有的是无内容的Xom节点
    else {
      let {
        [NODE_CACHE]: __cache,
        [NODE_CACHE_TOTAL]: __cacheTotal,
        [NODE_CACHE_FILTER]: __cacheFilter,
        [NODE_CACHE_MASK]: __cacheMask,
        [NODE_CACHE_OVERFLOW]: __cacheOverflow,
        [NODE_IS_MASK]: isMask,
        [NODE_COMPUTED_STYLE]: {
          [DISPLAY]: display,
          [VISIBILITY]: visibility,
          [TRANSFORM]: transform,
          [TRANSFORM_ORIGIN]: transformOrigin,
        },
      } = __config;
      if(display === 'none') {
        i += (total || 0);
        if(hasMask) {
          i += hasMask;
        }
        continue;
      }
      if(visibility === 'hidden') {
        continue;
      }
      // mask不能被汇总到top上
      if(isMask) {
        continue;
      }
      if(transform && !isE(transform)) {
        let tfo = transformOrigin.slice(0);
        // total下的节点tfo的计算，以total为原点，差值坐标即相对坐标
        if(__cache && __cache.available) {
          tfo[0] += __cache.sx1;
          tfo[1] += __cache.sy1;
        }
        else {
          tfo[0] += sx1;
          tfo[1] += sy1;
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
      let target = getCache([__cacheMask, __cacheOverflow, __cacheFilter, __cacheTotal]);
      if(target) {
        i += (total || 0);
      }
      else if(__cache && __cache.available) {
        target = __cache;
      }
      if(target) {
        let m = mx.m2Mat4(matrix || [1, 0, 0, 1, 0, 0], cx, cy);
        texCache.addTexAndDrawWhenLimit(gl, target, opacity, m, cx, cy, dx, dy);
      }
    }
  }
  // 绘制到fbo的纹理对象上并删除fbo恢复
  texCache.refresh(gl, cx, cy);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.viewport(0, 0, W, H);
  gl.deleteFramebuffer(frameBuffer);
  // 生成的纹理对象本身已绑定一个纹理单元了，释放lock的同时可以给texCache的channel缓存，避免重复上传
  let mockCache = new MockCache(texture, sx1, sy1, width + 2, height + 2, fullSize, bboxTotal);
  texCache.releaseLockChannel(n, mockCache.page);
  return mockCache;
}

function genMaskWebgl(renderMode, gl, texCache, node, cache, W, H) {
  let { sx1, sy1, width, height, bbox } = cache;
  // cache可能是普通cache，也可能是mockCache，为兼容必须重新计算fullSize，取width/height最大值
  let fullSize = Math.max(width, height);
  let cx = fullSize * 0.5, cy = fullSize * 0.5;
  let dx = -bbox[0] + 1, dy = -bbox[1] + 1;
  // 将所有mask绘入一个单独纹理中，尺寸和原点与被遮罩total相同，才能做到顶点坐标一致
  let [i, frameBuffer, texture] = genFrameBufferWithTexture(gl, texCache, fullSize);
  let next = node.next;
  while(next && next.isMask) {
    let __config = next.__config;
    next = next.next;
    let {
      [NODE_CACHE]: __cache,
      [NODE_CACHE_FILTER]: __cacheFilter,
      [NODE_CACHE_OVERFLOW]: __cacheOverflow,
      [NODE_COMPUTED_STYLE]: {
        [DISPLAY]: display,
        [VISIBILITY]: visibility,
        [OPACITY]: opacity,
        [TRANSFORM]: transform,
        [TRANSFORM_ORIGIN]: transformOrigin,
      },
    } = __config;
    if(display === 'none' || visibility === 'hidden') {
      continue;
    }
    let target = getCache([__cacheOverflow, __cacheFilter, __cache]);
    if(target) {
      texCache.addTexAndDrawWhenLimit(gl, target, opacity, null, cx, cy, dx, dy);
    }
    // 异常情况，有内容没遮罩说明超限
    else if(__config[NODE_HAS_CONTENT]) {
      inject.error('Unavailable mask, maybe oversize');
      return;
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
  let [n, frameBuffer2, texture2] = genFrameBufferWithTexture(gl, texCache, fullSize);
  gl.useProgram(gl.programMask);
  webgl.drawMask(gl, i, j);
  webgl.deleteTexture(gl, texture);
  texCache.releaseLockChannel(i);
  texCache.releaseLockChannel(j);
  // 切换回主程序
  gl.useProgram(gl.program);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.viewport(0, 0, W, H);
  gl.deleteFramebuffer(frameBuffer2);
  // 同total一样生成一个mockCache
  let maskCache = new MockCache(texture2, sx1, sy1, width, height, fullSize, bbox);
  texCache.releaseLockChannel(n, maskCache.page);
  return maskCache;
}

function renderCacheCanvas(renderMode, ctx, defs, root) {
  let { __structs, width, height } = root;
  // 栈代替递归，存父节点的matrix/opacity，matrix为E时存null省略计算
  let matrixList = [];
  let parentMatrix;
  let opacityList = [];
  let parentOpacity = 1;
  let lastConfig;
  let lastLv = 0;
  let mergeList = [];
  /**
   * 先一遍先序遍历每个节点绘制到自己__cache上，排除Text和已有的缓存以及局部根缓存，
   * 根据refreshLevel进行等级区分，可能是<REPAINT或>=REPAINT，REFLOW布局已前置处理完。
   * 首次绘制没有catchTotal等，后续则可能会有，在<REPAINT可据此跳过所有子节点加快循环，布局过程会提前删除它们。
   * lv的变化根据大小相等进行出入栈parent操作，实现获取节点parent数据的方式，
   * 同时过程中计算出哪些节点要生成局部根，存下来
   */
  for(let i = 0, len = __structs.length; i < len; i++) {
    let {
      [STRUCT_NODE]: node,
      [STRUCT_LV]: lv,
      [STRUCT_TOTAL]: total,
      [STRUCT_HAS_MASK]: hasMask,
    } = __structs[i];
    // 排除Text，要么根节点直接绘制，要么被局部根节点汇总，自身并不缓存（fillText比位图更快）
    if(node instanceof Text) {
      continue;
    }
    let __config = node.__config;
    // lv变大说明是child，相等是sibling，变小可能是parent或另一棵子树，Root节点是第一个特殊处理
    if(i === 0) {}
    else if(lv > lastLv) {
      parentMatrix = lastConfig[NODE_MATRIX_EVENT];
      if(isE(parentMatrix)) {
        parentMatrix = null;
      }
      matrixList.push(parentMatrix);
      parentOpacity = lastConfig[NODE_OPACITY];
      opacityList.push(parentOpacity);
    }
    // 变小出栈索引需注意，可能不止一层，多层计算diff层级
    else if(lv < lastLv) {
      let diff = lastLv - lv;
      matrixList.splice(-diff);
      parentMatrix = matrixList[lv];
      opacityList.splice(-diff);
      parentOpacity = opacityList[lv];
    }
    // 不变是同级兄弟，无需特殊处理
    else {}
    let {
      [NODE_REFRESH_LV]: __refreshLevel,
      [NODE_CACHE]: __cache,
      [NODE_CACHE_TOTAL]: __cacheTotal,
      [NODE_COMPUTED_STYLE]: computedStyle,
    } = __config;
    // 跳过display:none元素和它的所有子节点
    if(computedStyle[DISPLAY] === 'none') {
      i += (total || 0);
      // 只跳过自身不能跳过后面的mask，mask要渲染自身并进行缓存cache，以备对象切换display用
      continue;
    }
    let hasRecordAsMask;
    /**
     * lv<REPAINT，一般会有__cache，跳过渲染过程，快速运算，没有cache则是自身超限或无内容，目前不感知
     * 可能有cacheTotal，为之前生成的局部根，清除逻辑在更新检查是否>=REPAINT那里，小变化不动
     * 当有遮罩时，如果被遮罩节点本身无变更，需要检查其next的遮罩节点有无变更，
     * 但其实不用检查，因为next变更一定会清空cacheMask，只要检查cacheMask即可
     * 如果没有或无效，直接添加，无视节点本身变化，后面防重即可
     */
    if(__refreshLevel < REPAINT) {
      __config[NODE_REFRESH_LV] = NONE;
      if(hasMask) {
        let cacheMask = __config[NODE_CACHE_MASK];
        if(!cacheMask || !cacheMask.available) {
          hasRecordAsMask = [i, lv, total, node, __config, hasMask];
          mergeList.push(hasRecordAsMask);
        }
      }
      let {
        [NODE_CURRENT_STYLE]: currentStyle,
        [NODE_CACHE_STYLE]: __cacheStyle,
      } = __config;
      let matrix;
      if(contain(__refreshLevel, TRANSFORM_ALL)) {
        matrix = node.__calMatrix(__refreshLevel, __cacheStyle, currentStyle, computedStyle);
        // 恶心的v8性能优化
        let m = __config[NODE_MATRIX];
        if(matrix && m) {
          m[0] = matrix[0];
          m[1] = matrix[1];
          m[2] = matrix[2];
          m[3] = matrix[3];
          m[4] = matrix[4];
          m[5] = matrix[5];
        }
      }
      else {
        matrix = __config[NODE_MATRIX];
      }
      if(parentMatrix) {
        matrix = multiply(parentMatrix, matrix);
      }
      // 恶心的v8性能优化
      let m = __config[NODE_MATRIX_EVENT];
      if(m && matrix) {
        m[0] = matrix[0];
        m[1] = matrix[1];
        m[2] = matrix[2];
        m[3] = matrix[3];
        m[4] = matrix[4];
        m[5] = matrix[5];
      }
      let opacity;
      if(contain(__refreshLevel, OP)) {
        opacity = computedStyle[OPACITY] = currentStyle[OPACITY];
      }
      else {
        opacity = computedStyle[OPACITY];
      }
      __config[NODE_OPACITY] = parentOpacity * opacity;
      let __blurValue;
      if(contain(__refreshLevel, FT)) {
        let filter = computedStyle[FILTER] = currentStyle[FILTER];
        __blurValue = __config[NODE_BLUR_VALUE] = 0;
        if(Array.isArray(filter)) {
          filter.forEach(item => {
            let [k, v] = item;
            if(k === 'blur') {
              __blurValue = __config[NODE_BLUR_VALUE] = v;
            }
          });
        }
        let __cacheFilter = __config[NODE_CACHE_FILTER];
        if(__cacheFilter && __cacheFilter.available) {
          __cacheFilter.release();
        }
        if(__blurValue) {
          // 防重
          if(hasRecordAsMask) {
            mergeList[6] = __blurValue;
          }
          else {
            hasRecordAsMask = [i, lv, total, node, __config, null, __blurValue];
            mergeList.push(hasRecordAsMask);
          }
        }
      }
      if(contain(__refreshLevel, MBM)) {
        computedStyle[MIX_BLEND_MODE] = currentStyle[MIX_BLEND_MODE];
      }
      // total可以跳过所有孩子节点省略循环，filter/mask等的强制前提是有total
      if(__cacheTotal && __cacheTotal.available) {
        i += (total || 0);
        continue;
      }
    }
    /**
     * >=REPAINT重新渲染，并根据结果判断是否离屏限制错误
     * geom特殊对待，因可能被开发人员继承实现自定义图形，render()传递ctx要使其无感知切换，
     * 先执行Xom的renderSelf()逻辑，实现__cache离屏ctx能力，然后再调用Geom/子类的render()，其依据renderSelfData
     * Geom没有子节点无需汇总局部根，Dom中Img也是，它们的局部根等于自身的cache，其它符合条件的Dom需要生成
     */
    else {
      if(node instanceof Geom) {
        node.__renderSelfData = node.__renderSelf(renderMode, __refreshLevel, ctx, defs, true);
        __cache = __config[NODE_CACHE];
        if(__cache && __cache.available) {
          node.render(renderMode, __refreshLevel, __cache.ctx, defs, true);
        }
      }
      else {
        node.render(renderMode, __refreshLevel, ctx, defs, true);
      }
    }
    lastConfig = __config;
    lastLv = lv;
    // 每个元素检查cacheTotal生成，已有的上面会continue跳过
    let {
      [NODE_BLUR_VALUE]: __blurValue,
      [NODE_LIMIT_CACHE]: __limitCache,
    } = __config;
    let {
      [POSITION]: position,
      [OVERFLOW]: overflow,
      [MIX_BLEND_MODE]: mixBlendMode,
    } = computedStyle;
    if(!__limitCache && (hasMask || position === 'absolute'
      || __blurValue > 0 || overflow === 'hidden' || mixBlendMode !== 'normal')) {
      if(hasRecordAsMask) {
        hasRecordAsMask[6] = __blurValue;
        hasRecordAsMask[7] = overflow;
      }
      else {
        mergeList.push([i, lv, total, node, __config, hasMask, __blurValue, overflow]);
      }
    }
  }
  // 根据收集的需要合并局部根的索引，尝试合并，按照层级从小到大，索引从小到大的顺序，这样保证子节点在前
  if(mergeList.length) {
    mergeList.sort(function(a, b) {
      if(a[1] === b[1]) {
        return a[0] - b[0];
      }
      return b[1] - a[1];
    });
    mergeList.forEach(item => {
      let [i, , total, node, __config, hasMask, __blurValue, overflow] = item;
      let {
        [NODE_CACHE]: __cache,
        [NODE_CACHE_TOTAL]: __cacheTotal,
        [NODE_CACHE_FILTER]: __cacheFilter,
        [NODE_CACHE_MASK]: __cacheMask,
        [NODE_CACHE_OVERFLOW]: __cacheOverflow,
      } = __config;
      // 可能没变化，比如被遮罩节点、filter变更等
      if(!__cacheTotal || !__cacheTotal.available) {
        __cacheTotal = __config[NODE_CACHE_TOTAL]
          = genTotal(renderMode, node, __config, i, total || 0, __structs, __cacheTotal, __cache);
      }
      // 防止失败超限，必须有total结果
      if(__cacheTotal && __cacheTotal.available) {
        let target = __cacheTotal;
        if(__blurValue > 0 && (!__cacheFilter || !__cacheFilter.available)) {
          target = __config[NODE_CACHE_FILTER] = genFilter(node, target, __blurValue);
        }
        if(overflow === 'hidden' && (!__cacheOverflow || !__cacheOverflow.available)) {
          target = __config[NODE_CACHE_OVERFLOW] = genOverflow(node, target);
        }
        if(hasMask && (!__cacheMask || !__cacheMask.available)) {
          let isClip = node.next.isClip;
          __config[NODE_CACHE_MASK] = genMask(node, target, isClip);
        }
      }
    });
  }
  /**
   * 最后先序遍历一次应用__cacheTotal即可，没有的用__cache，以及剩下的超尺寸的和Text
   * 超尺寸的依旧要走无cache逻辑render，这部分和无cache渲染很像
   */
  let filterHash = {};
  let overflowHash = {};
  let blendHash = {};
  let maskStartHash = {};
  let maskEndHash = {};
  for(let i = 0, len = __structs.length; i < len; i++) {
    let {
      [STRUCT_NODE]: node,
      [STRUCT_TOTAL]: total,
      [STRUCT_HAS_MASK]: hasMask,
    } = __structs[i];
    let __config = node.__config;
    // text如果display不可见，parent会直接跳过，不会走到这里，这里一定是直接绘制到root的，visibility在其内部判断
    if(node instanceof Text) {
      let {
        [NODE_OPACITY]: __opacity,
        [NODE_MATRIX_EVENT]: matrixEvent,
      } = __config[NODE_DOM_PARENT].__config;
      ctx.globalAlpha = __opacity;
      ctx.setTransform(matrixEvent[0], matrixEvent[1], matrixEvent[2], matrixEvent[3], matrixEvent[4], matrixEvent[5]);
      node.render(renderMode, 0, ctx, defs);
    }
    else {
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
        [NODE_REFRESH_LV]: __refreshLevel,
        [NODE_COMPUTED_STYLE]: {
          [DISPLAY]: display,
          [VISIBILITY]: visibility,
          [OVERFLOW]: overflow,
          [MIX_BLEND_MODE]: mixBlendMode,
        },
      } = __config;
      if(display === 'none') {
        i += (total || 0);
        if(hasMask) {
          i += hasMask;
        }
        continue;
      }
      // 有total的可以直接绘制并跳过子节点索引
      let target = getCache([__cacheMask, __cacheOverflow, __cacheFilter, __cacheTotal]);
      // total的尝试
      if(target) {
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
        else {
          i += (total || 0);
        }
        Cache.draw(ctx, __opacity, matrixEvent, target);
        // total应用后记得设置回来
        ctx.globalCompositeOperation = 'source-over';
      }
      // 自身cache尝试
      else {
        if(maskStartHash.hasOwnProperty(i)) {
          ctx = maskStartHash[i].ctx;
        }
        let offScreenFilter, offScreenMask, offScreenOverflow, offScreenBlend;
        // 这里比较特殊，可能会有__cache但超限没被汇聚到total上，需mock出离屏对象数据，还有可能本身就超限
        if(__cache && __cache.available || __limitCache) {
          if(__cache && __cache.available) {
            if(__blurValue) {
              let c = inject.getCacheCanvas(width, height, null, 'filter');
              if(c.ctx) {
                offScreenFilter = {
                  ctx,
                  blur: __blurValue,
                  target: c,
                };
                ctx = c.ctx;
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
                let c = inject.getCacheCanvas(width, height, null, 'mask1');
                if(c.ctx) {
                  offScreenMask = {
                    ctx,
                    target: c,
                  };
                  ctx = c.ctx;
                }
              }
            }
            if(overflow === 'hidden') {
              if(offScreenFilter || offScreenMask) {
                offScreenOverflow = offScreenFilter || offScreenMask;
              }
              else {
                let c = inject.getCacheCanvas(width, height, null, 'overflow');
                if(c.ctx) {
                  offScreenOverflow = {
                    ctx,
                    target: c,
                  };
                  ctx = c.ctx;
                }
              }
            }
            if(mixBlendMode !== 'normal') {
              if(offScreenFilter || offScreenMask || offScreenOverflow) {
                offScreenBlend = offScreenFilter || offScreenMask || offScreenOverflow;
              }
              else {
                let c = inject.getCacheCanvas(width, height, null, 'blend');
                offScreenBlend = {
                  ctx,
                  target: c,
                  mixBlendMode,
                };
                ctx = c.ctx;
              }
            }
            if(visibility !== 'hidden') {
              Cache.draw(ctx, __opacity, matrixEvent, __cache);
            }
          }
          else {
            let res;
            if(node instanceof Geom) {
              res = node.__renderSelfData = node.__renderSelf(renderMode, __refreshLevel, ctx, defs);
            }
            else {
              res = node.render(renderMode, __refreshLevel, ctx, defs);
            }
            res = res || {};
            offScreenFilter = res.offScreenFilter;
            offScreenMask = res.offScreenMask;
            offScreenOverflow = res.offScreenOverflow;
            offScreenBlend = res.offScreenBlend;
          }
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
              let {
                [STRUCT_TOTAL]: total,
                [STRUCT_NODE]: {
                  currentStyle: {
                    [DISPLAY]: display,
                    [VISIBILITY]: visibility
                  },
                },
              } = __structs[j];
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
            let mask = inject.getCacheCanvas(width, height, null, 'mask2');
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
          if(__limitCache && node instanceof Geom) {
            node.render(renderMode, node.__refreshLevel, ctx, defs);
          }
        }
        // 没内容的遮罩跳过，比如未加载的img，否则会将遮罩绘制出来
        else if(hasMask) {
          i += (total || 0) + hasMask;
        }
        // 最后一个节点检查filter，有则应用，可能有多个包含自己
        if(filterHash.hasOwnProperty(i)) {
          let list = filterHash[i];
          list.forEach(offScreenFilter => {
            let { target, ctx: origin, blur } = offScreenFilter;
            // 申请一个新的离屏，应用blur并绘制，如没有则降级，默认ctx.filter为'none'
            if(ctx.filter) {
              let apply = inject.getCacheCanvas(width, height, null, 'filter');
              apply.ctx.filter = `blur(${blur}px)`;
              apply.ctx.drawImage(target.canvas, 0, 0);
              apply.ctx.filter = 'none';
              apply.draw();
              target.ctx.globalAlpha = 1;
              target.ctx.setTransform(1, 0, 0, 1, 0, 0);
              target.ctx.clearRect(0, 0, width, height);
              target.ctx.drawImage(apply.canvas, 0, 0);
              target.draw();
              apply.ctx.clearRect(0, 0, width, height);
            }
            if(!maskStartHash.hasOwnProperty(i + 1) && !overflowHash.hasOwnProperty(i) && !blendHash.hasOwnProperty(i)) {
              origin.setTransform(1, 0, 0, 1, 0, 0);
              origin.globalAlpha = 1;
              origin.drawImage(target.canvas, 0, 0);
              target.ctx.setTransform(1, 0, 0, 1, 0, 0);
              target.ctx.globalAlpha = 1;
              target.ctx.clearRect(0, 0, width, height);
              inject.releaseCacheCanvas(target.canvas);
              ctx = origin;
            }
          });
        }
        // 降级overflow在filter后面
        if(overflowHash.hasOwnProperty(i)) {
          let list = overflowHash[i];
          list.forEach(offScreenOverflow => {
            let { matrix, target, ctx: origin, x, y, offsetWidth, offsetHeight } = offScreenOverflow;
            ctx.globalCompositeOperation = 'destination-in';
            ctx.globalAlpha = 1;
            ctx.setTransform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);
            ctx.fillStyle = '#FFF';
            ctx.beginPath();
            ctx.rect(x, y, offsetWidth, offsetHeight);
            ctx.fill();
            ctx.closePath();
            ctx.globalCompositeOperation = 'source-over';
            if(!maskStartHash.hasOwnProperty(i + 1) && !blendHash.hasOwnProperty(i)) {
              target.draw();
              origin.setTransform(1, 0, 0, 1, 0, 0);
              origin.globalAlpha = 1;
              origin.drawImage(target.canvas, 0, 0);
              target.ctx.setTransform(1, 0, 0, 1, 0, 0);
              target.ctx.clearRect(0, 0, width, height);
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
              target.draw();
              let origin = offScreenBlend.ctx;
              origin.setTransform(1, 0, 0, 1, 0, 0);
              origin.globalAlpha = 1;
              origin.drawImage(target.canvas, 0, 0);
              target.ctx.globalAlpha = 1;
              target.ctx.setTransform(1, 0, 0, 1, 0, 0);
              target.ctx.clearRect(0, 0, width, height);
              inject.releaseCacheCanvas(target.canvas);
              ctx = origin;
              ctx.globalCompositeOperation = 'source-over';
            }
          });
        }
        // mask在最后，因为maskEnd比节点本身索引大，是其后面兄弟
        if(maskEndHash.hasOwnProperty(i)) {
          let { mask, offScreenMask, isClip } = maskEndHash[i];
          if(isClip) {
            offScreenMask.target.draw();
            ctx = mask.ctx;
            ctx.globalCompositeOperation = 'source-out';
            ctx.globalAlpha = 1;
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.drawImage(offScreenMask.target.canvas, 0, 0);
            mask.draw();
            ctx.globalCompositeOperation = 'source-over';
            offScreenMask.target.ctx.clearRect(0, 0, width, height);
            inject.releaseCacheCanvas(offScreenMask.target.canvas);
            ctx = offScreenMask.ctx;
            ctx.globalAlpha = 1;
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.drawImage(mask.canvas, 0, 0);
            // blendMode前面会修改主屏的，这里应用完后恢复正常
            ctx.globalCompositeOperation = 'source-over';
            mask.ctx.clearRect(0, 0, width, height);
            inject.releaseCacheCanvas(mask.canvas);
          }
          else {
            mask.draw();
            let target = offScreenMask.target;
            ctx = target.ctx;
            ctx.globalCompositeOperation = 'destination-in';
            ctx.globalAlpha = 1;
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.drawImage(mask.canvas, 0, 0);
            ctx.globalCompositeOperation = 'source-over';
            mask.ctx.clearRect(0, 0, width, height);
            inject.releaseCacheCanvas(mask.canvas);
            target.draw();
            ctx = offScreenMask.ctx;
            ctx.globalAlpha = 1;
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.drawImage(target.canvas, 0, 0);
            // blendMode前面会修改主屏的，这里应用完后恢复正常
            ctx.globalCompositeOperation = 'source-over';
            target.ctx.clearRect(0, 0, width, height);
            inject.releaseCacheCanvas(target.canvas);
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
    let {
      [STRUCT_NODE]: node,
      [STRUCT_TOTAL]: total,
      [STRUCT_HAS_MASK]: hasMask,
    } = __structs[i];
    let {
      [NODE_COMPUTED_STYLE]: computedStyle,
      [NODE_REFRESH_LV]: __refreshLevel,
    } = node.__config;
    // 遮罩对象申请了个离屏，其第一个mask申请另外一个离屏，开始聚集所有mask元素的绘制
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
      // display:none要跳过后面的mask
      if(hasMask) {
        i += hasMask;
      }
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
        let {
          [STRUCT_TOTAL]: total,
          [STRUCT_NODE]: {
            currentStyle: {
              [DISPLAY]: display,
              [VISIBILITY]: visibility,
            },
          },
        } = __structs[j];
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
      let mask = inject.getCacheCanvas(width, height, null, 'mask2');
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
    // 最后一个节点检查filter，有则应用，可能有多个嵌套包含自己
    if(filterHash.hasOwnProperty(i)) {
      let list = filterHash[i];
      list.forEach(offScreenFilter => {
        let { target, ctx: origin, blur } = offScreenFilter;
        // 申请一个新的离屏，应用blur并绘制，如没有则降级，默认ctx.filter为'none'
        if(ctx.filter) {
          let apply = inject.getCacheCanvas(width, height, null, 'filter');
          apply.ctx.filter = `blur(${blur}px)`;
          apply.ctx.drawImage(target.canvas, 0, 0);
          apply.ctx.filter = 'none';
          apply.draw();
          target.ctx.globalAlpha = 1;
          target.ctx.setTransform(1, 0, 0, 1, 0, 0);
          target.ctx.clearRect(0, 0, width, height);
          target.ctx.drawImage(apply.canvas, 0, 0);
          target.draw();
          apply.ctx.clearRect(0, 0, width, height);
        }
        if(!maskStartHash.hasOwnProperty(i + 1) && !overflowHash.hasOwnProperty(i) && !blendHash.hasOwnProperty(i)) {
          origin.setTransform(1, 0, 0, 1, 0, 0);
          origin.globalAlpha = 1;
          origin.drawImage(target.canvas, 0, 0);
          target.ctx.setTransform(1, 0, 0, 1, 0, 0);
          target.ctx.globalAlpha = 1;
          target.ctx.clearRect(0, 0, width, height);
          inject.releaseCacheCanvas(target.canvas);
          ctx = origin;
        }
      });
    }
    // overflow在filter后面
    if(overflowHash.hasOwnProperty(i)) {
      let list = overflowHash[i];
      list.forEach(offScreenOverflow => {
        let { matrix, target, ctx: origin, x, y, offsetWidth, offsetHeight } = offScreenOverflow;
        ctx.globalCompositeOperation = 'destination-in';
        ctx.globalAlpha = 1;
        ctx.setTransform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.rect(x, y, offsetWidth, offsetHeight);
        ctx.fill();
        ctx.closePath();
        ctx.globalCompositeOperation = 'source-over';
        if(!maskStartHash.hasOwnProperty(i + 1) && !blendHash.hasOwnProperty(i)) {
          target.draw();
          origin.setTransform(1, 0, 0, 1, 0, 0);
          origin.globalAlpha = 1;
          origin.drawImage(target.canvas, 0, 0);
          target.ctx.setTransform(1, 0, 0, 1, 0, 0);
          target.ctx.clearRect(0, 0, width, height);
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
          target.draw();
          let origin = offScreenBlend.ctx;
          origin.setTransform(1, 0, 0, 1, 0, 0);
          origin.globalAlpha = 1;
          origin.drawImage(target.canvas, 0, 0);
          target.ctx.globalAlpha = 1;
          target.ctx.setTransform(1, 0, 0, 1, 0, 0);
          target.ctx.clearRect(0, 0, width, height);
          inject.releaseCacheCanvas(target.canvas);
          ctx = origin;
          ctx.globalCompositeOperation = 'source-over';
        }
      });
    }
    // mask在最后，因为maskEnd比节点本身索引大，是其后面兄弟
    if(maskEndHash.hasOwnProperty(i)) {
      let { mask, offScreenMask, isClip } = maskEndHash[i];
      if(isClip) {
        offScreenMask.target.draw();
        ctx = mask.ctx;
        ctx.globalCompositeOperation = 'source-out';
        ctx.globalAlpha = 1;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.drawImage(offScreenMask.target.canvas, 0, 0);
        mask.draw();
        ctx.globalCompositeOperation = 'source-over';
        offScreenMask.target.ctx.clearRect(0, 0, width, height);
        inject.releaseCacheCanvas(offScreenMask.target.canvas);
        ctx = offScreenMask.ctx;
        ctx.globalAlpha = 1;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.drawImage(mask.canvas, 0, 0);
        // blendMode前面会修改主屏的，这里应用完后恢复正常
        ctx.globalCompositeOperation = 'source-over';
        mask.ctx.clearRect(0, 0, width, height);
        inject.releaseCacheCanvas(mask.canvas);
      }
      else {
        mask.draw();
        let target = offScreenMask.target;
        ctx = target.ctx;
        ctx.globalCompositeOperation = 'destination-in';
        ctx.globalAlpha = 1;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.drawImage(mask.canvas, 0, 0);
        ctx.globalCompositeOperation = 'source-over';
        mask.ctx.clearRect(0, 0, width, height);
        inject.releaseCacheCanvas(mask.canvas);
        target.draw();
        ctx = offScreenMask.ctx;
        ctx.globalAlpha = 1;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.drawImage(target.canvas, 0, 0);
        // blendMode前面会修改主屏的，这里应用完后恢复正常
        ctx.globalCompositeOperation = 'source-over';
        target.ctx.clearRect(0, 0, width, height);
        inject.releaseCacheCanvas(target.canvas);
      }
    }
  }
}

function renderSvg(renderMode, ctx, defs, root, isFirst) {
  let { __structs, width, height } = root;
  // mask节点很特殊，本身有matrix会影响，本身没改变但对象节点有改变也需要计算逆矩阵应用顶点
  let maskEffectHash = {};
  if(!isFirst) {
    // 先遍历一遍收集完全不变的defs，缓存起来id，随后再执行遍历渲染生成新的，避免掉重复的id
    for(let i = 0, len = __structs.length; i < len; i++) {
      let {
        [STRUCT_NODE]: node,
        [STRUCT_TOTAL]: total,
        [STRUCT_HAS_MASK]: hasMask,
      } = __structs[i];
      let {
        [NODE_REFRESH_LV]: __refreshLevel,
        [NODE_DEFS_CACHE]: defsCache,
      } = node.__config;
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
        let hasFilter = contain(__refreshLevel, FT);
        // 特殊的mask判断，遮罩对象影响这个mask了，除去filter、遮罩对象无TRANSFORM变化外都可缓存
        if(maskEffectHash.hasOwnProperty(i)) {
          let v = maskEffectHash[i];
          if(!contain(__refreshLevel, TRANSFORM_ALL) && v < REPAINT && !contain(v, TRANSFORM_ALL)) {
            defsCache.forEach(item => {
              if(!hasFilter || item.tagName !== 'filter' || item.children[0].tagName !== 'feGaussianBlur') {
                defs.addCache(item);
              }
            });
          }
        }
        // 去除特殊的filter，普通节点或不影响的mask在<REPAINT下defs的其它都可缓存
        else {
          defsCache.forEach(item => {
            if(!hasFilter || item.tagName !== 'filter' || item.children[0].tagName !== 'feGaussianBlur') {
              defs.addCache(item);
            }
          });
        }
      }
    }
  }
  let maskHash = {};
  // 栈代替递归，存父节点的matrix/opacity，matrix为E时存null省略计算
  let parentMatrixList = [];
  let parentMatrix;
  let parentVdList = [];
  let parentVd;
  let lastLv = 0;
  let last;
  for(let i = 0, len = __structs.length; i < len; i++) {
    let {
      [STRUCT_NODE]: node,
      [STRUCT_TOTAL]: total,
      [STRUCT_HAS_MASK]: hasMask,
      [STRUCT_LV]: lv,
    } = __structs[i];
    let __config = node.__config;
    let { computedStyle: { [DISPLAY]: display } } = node;
    let {
      [NODE_CACHE_TOTAL]: __cacheTotal,
      [NODE_REFRESH_LV]: __refreshLevel,
      [NODE_DEFS_CACHE]: defsCache,
    } = __config;
    // 将随后的若干个mask节点范围存下来
    if(hasMask && display !== 'none') {
      let start = i + (total || 0) + 1;
      let end = start + hasMask;
      // svg限制了只能Geom单节点，不可能是Dom，所以end只有唯一
      maskHash[end - 1] = {
        index: i,
        start,
        end,
        isClip: __structs[start][STRUCT_NODE].isClip, // 第一个节点是clip为准
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
      __config[NODE_REFRESH_LV] = NONE;
      virtualDom = node.virtualDom;
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
        delete virtualDom.cache;
        // 还得判断，和img加载混在一起时，触发刷新如果display:none，则还有cacheTotal
        let { computedStyle: { [DISPLAY]: display } } = node;
        if(display === 'none') {
          i += (total || 0);
        }
      }
      let {
        [NODE_CURRENT_STYLE]: currentStyle,
        [NODE_COMPUTED_STYLE]: computedStyle,
        [NODE_CACHE_STYLE]: __cacheStyle,
      } = __config;
      if(contain(__refreshLevel, TRANSFORM_ALL)) {
        let matrix = node.__calMatrix(__refreshLevel, __cacheStyle, currentStyle, computedStyle);
        // 恶心的v8性能优化
        let m = __config[NODE_MATRIX];
        if(matrix && m) {
          m[0] = matrix[0];
          m[1] = matrix[1];
          m[2] = matrix[2];
          m[3] = matrix[3];
          m[4] = matrix[4];
          m[5] = matrix[5];
        }
        if(!matrix || isE(matrix)) {
          delete virtualDom.transform;
        }
        else {
          virtualDom.transform = 'matrix(' + util.joinArr(matrix, ',') + ')';
        }
        if(parentMatrix && matrix) {
          matrix = multiply(parentMatrix, matrix);
        }
        // 恶心的v8性能优化
        m = __config[NODE_MATRIX_EVENT];
        if(m && matrix) {
          m[0] = matrix[0];
          m[1] = matrix[1];
          m[2] = matrix[2];
          m[3] = matrix[3];
          m[4] = matrix[4];
          m[5] = matrix[5];
        }
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
        // 移除老缓存，防止无限增长
        for(let i = defsCache.length - 1; i >= 0; i--) {
          let item = defsCache[i];
          if(item.tagName === 'filter' && item.children[0].tagName === 'feGaussianBlur') {
            defs.removeCache(item);
            break;
          }
        }
        if(Array.isArray(filter)) {
          filter.forEach(item => {
            let [k, v] = item;
            if(k === 'blur') {
              if(v > 0) {
                let d = mx.int2convolution(v);
                let { outerWidth, outerHeight } = node;
                let o = {
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
                };
                let id = defs.add(o);
                __config[NODE_DEFS_CACHE].push(o);
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
      // >=REPAINT会调用render，重新生成defsCache
      __config[NODE_DEFS_CACHE] && __config[NODE_DEFS_CACHE].splice(0);
      if(node instanceof Geom) {
        node.__renderSelfData = node.__renderSelf(renderMode, __refreshLevel, ctx, defs);
      }
      node.render(renderMode, __refreshLevel, ctx, defs);
      virtualDom = node.virtualDom;
      if(display === 'none') {
        i += (total || 0);
        if(hasMask) {
          i += hasMask;
        }
      }
    }
    /**
     * mask会在join时过滤掉，这里将假设正常渲染的vd的内容获取出来组成defs的mask内容
     * 另外最初遍历时记录了会影响的mask，在<REPAINT时比较，>=REPAINT始终重新设置
     * 本身有matrix也需要重设
     */
    if(maskHash.hasOwnProperty(i) && (maskEffectHash.hasOwnProperty(i) || __refreshLevel >= REPAINT || contain(__refreshLevel, TRANSFORM_ALL | OP))) {
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
              let matrix = node.renderMatrix;
              let ivs = inverse(dom.renderMatrix);
              matrix = multiply(ivs, matrix);
              // path没有transform属性，在vd上，需要弥补
              props.push(['transform', `matrix(${matrix.join(',')})`]);
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
                let ivs = inverse(dom.renderMatrix);
                if(!isE(ivs)) {
                  props.push(['transform', `matrix(${ivs.join(',')})`]);
                }
              }
              else {
                let matrix = props[hasTransform][1].match(/[\d.]+/g).map(i => parseFloat(i));
                let ivs = inverse(dom.renderMatrix);
                matrix = multiply(ivs, matrix);
                props[hasTransform][1] = `matrix(${matrix.join(',')})`;
              }
            }
          }
        }
      }
      // 清掉上次的
      for(let i = defsCache.length - 1; i >= 0; i--) {
        let item = defsCache[i];
        if(item.tagName === 'mask') {
          defsCache.splice(i, 1);
        }
      }
      let o = {
        tagName: 'mask',
        props: [],
        children: mChildren,
      };
      let id = defs.add(o);
      defsCache.push(o);
      id = 'url(#' + id + ')';
      dom.virtualDom.mask = id;
    }
    // mask不入children
    if(parentVd && !node.isMask) {
      parentVd.children.push(virtualDom);
    }
    if(i === 0) {
      parentMatrix = __config[NODE_MATRIX];
      parentVd = virtualDom;
    }
    lastLv = lv;
    last = node;
  }
}

function renderWebgl(renderMode, gl, defs, root) {
  let texCache = root.texCache;
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  let { __structs, width, height } = root;
  let cx = width * 0.5, cy = height * 0.5;
  // 栈代替递归，存父节点的matrix/opacity，matrix为E时存null省略计算
  let matrixList = [];
  let parentMatrix;
  let opacityList = [];
  let parentOpacity = 1;
  let refreshLevelList = [];
  let parentRefreshLevel;
  let lastRefreshLevel;
  let lastConfig;
  let lastLv = 0;
  let mergeList = [];
  /**
   * 先一遍先序遍历每个节点绘制到自己__cache上，排除Text和已有的缓存以及局部根缓存，
   * 根据refreshLevel进行等级区分，可能是<REPAINT或>=REPAINT，REFLOW布局已前置处理完。
   * 首次绘制没有catchTotal等，后续则可能会有，在<REPAINT可据此跳过所有子节点加快循环，布局过程会提前删除它们。
   * lv的变化根据大小相等进行出入栈parent操作，实现获取节点parent数据的方式，
   * 同时过程中计算出哪些节点要生成局部根，存下来
   */
  for(let i = 0, len = __structs.length; i < len; i++) {
    let {
      [STRUCT_NODE]: node,
      [STRUCT_LV]: lv,
      [STRUCT_TOTAL]: total,
      [STRUCT_HAS_MASK]: hasMask,
    } = __structs[i];
    // Text特殊处理，webgl中先渲染为bitmap，再作为贴图绘制，缓存交由text内部判断，直接调用渲染纹理方法
    if(node instanceof Text) {
      if(parentRefreshLevel >= REPAINT) {
        let __cache = node.__renderAsTex();
        // 有内容无cache说明超限
        if((!__cache || !__cache.available) && node.content) {
        }
      }
      continue;
    }
    let __config = node.__config;
    let __refreshLevel = __config[NODE_REFRESH_LV];
    // lv变大说明是child，相等是sibling，变小可能是parent或另一棵子树，Root节点是第一个特殊处理
    if(i === 0) {}
    else if(lv > lastLv) {
      parentMatrix = lastConfig[NODE_MATRIX_EVENT];
      if(isE(parentMatrix)) {
        parentMatrix = null;
      }
      matrixList.push(parentMatrix);
      parentOpacity = lastConfig[NODE_OPACITY];
      opacityList.push(parentOpacity);
      // 要记住parent的refreshLevel供Text判断是否变化用
      parentRefreshLevel = lastRefreshLevel;
      refreshLevelList.push(parentRefreshLevel);
    }
    // 变小出栈索引需注意，可能不止一层，多层计算diff层级
    else if(lv < lastLv) {
      let diff = lastLv - lv;
      matrixList.splice(-diff);
      parentMatrix = matrixList[lv];
      opacityList.splice(-diff);
      parentOpacity = opacityList[lv];
      refreshLevelList.splice(-diff);
      parentRefreshLevel = refreshLevelList[lv];
    }
    // 不变是同级兄弟，无需特殊处理
    else {}
    let {
      [NODE_CACHE]: __cache,
      [NODE_CACHE_TOTAL]: __cacheTotal,
      [NODE_COMPUTED_STYLE]: computedStyle,
    } = __config;
    // 跳过display:none元素和它的所有子节点
    if(computedStyle[DISPLAY] === 'none') {
      i += (total || 0);
      // 只跳过自身不能跳过后面的mask，mask要渲染自身并进行缓存cache，以备对象切换display用
      continue;
    }
    let hasRecordAsMask;
    /**
     * lv<REPAINT，一般会有__cache，跳过渲染过程，快速运算，没有cache则是自身超限或无内容，目前不感知
     * 可能有cacheTotal，为之前生成的局部根，清除逻辑在更新检查是否>=REPAINT那里，小变化不动
     * 当有遮罩时，如果被遮罩节点本身无变更，需要检查其next的遮罩节点有无变更，
     * 但其实不用检查，因为next变更一定会清空cacheMask，只要检查cacheMask即可
     * 如果没有或无效，直接添加，无视节点本身变化，后面防重即可
     */
    if(__refreshLevel < REPAINT) {
      __config[NODE_REFRESH_LV] = NONE;
      if(hasMask) {
        let cacheMask = __config[NODE_CACHE_MASK];
        if(!cacheMask || !cacheMask.available) {
          hasRecordAsMask = [i, lv, total, node, __config, hasMask];
          mergeList.push(hasRecordAsMask);
        }
      }
      let {
        [NODE_CURRENT_STYLE]: currentStyle,
        [NODE_CACHE_STYLE]: __cacheStyle,
      } = __config;
      let matrix;
      if(contain(__refreshLevel, TRANSFORM_ALL)) {
        matrix = node.__calMatrix(__refreshLevel, __cacheStyle, currentStyle, computedStyle);
        // 恶心的v8性能优化
        let m = __config[NODE_MATRIX];
        if(matrix && m) {
          m[0] = matrix[0];
          m[1] = matrix[1];
          m[2] = matrix[2];
          m[3] = matrix[3];
          m[4] = matrix[4];
          m[5] = matrix[5];
        }
      }
      else {
        matrix = __config[NODE_MATRIX];
      }
      if(parentMatrix) {
        matrix = multiply(parentMatrix, matrix);
      }
      // 恶心的v8性能优化
      let m = __config[NODE_MATRIX_EVENT];
      if(m && matrix) {
        m[0] = matrix[0];
        m[1] = matrix[1];
        m[2] = matrix[2];
        m[3] = matrix[3];
        m[4] = matrix[4];
        m[5] = matrix[5];
      }
      let opacity;
      if(contain(__refreshLevel, OP)) {
        opacity = computedStyle[OPACITY] = currentStyle[OPACITY];
      }
      else {
        opacity = computedStyle[OPACITY];
      }
      __config[NODE_OPACITY] = parentOpacity * opacity;
      let __blurValue;
      if(contain(__refreshLevel, FT)) {
        let filter = computedStyle[FILTER] = currentStyle[FILTER];
        __blurValue = __config[NODE_BLUR_VALUE] = 0;
        if(Array.isArray(filter)) {
          filter.forEach(item => {
            let [k, v] = item;
            if(k === 'blur') {
              __blurValue = __config[NODE_BLUR_VALUE] = v;
            }
          });
        }
        let __cacheFilter = __config[NODE_CACHE_FILTER];
        if(__cacheFilter && __cacheFilter.available) {
          __cacheFilter.release();
        }
        if(__blurValue) {
          // 防重
          if(hasRecordAsMask) {
            mergeList[6] = __blurValue;
          }
          else {
            hasRecordAsMask = [i, lv, total, node, __config, null, __blurValue];
            mergeList.push(hasRecordAsMask);
          }
        }
      }
      if(contain(__refreshLevel, MBM)) {
        computedStyle[MIX_BLEND_MODE] = currentStyle[MIX_BLEND_MODE];
      }
      // total可以跳过所有孩子节点省略循环，filter/mask等的强制前提是有total
      if(__cacheTotal && __cacheTotal.available) {
        i += (total || 0);
        continue;
      }
    }
    /**
     * >=REPAINT重新渲染，并根据结果判断是否离屏限制错误
     * geom特殊对待，因可能被开发人员继承实现自定义图形，render()传递ctx要使其无感知切换，
     * 先执行Xom的renderSelf()逻辑，实现__cache离屏ctx能力，然后再调用Geom/子类的render()，其依据renderSelfData
     * Geom没有子节点无需汇总局部根，Dom中Img也是，它们的局部根等于自身的cache，其它符合条件的Dom需要生成
     */
    else {
      if(node instanceof Geom) {
        node.__renderSelfData = node.__renderSelf(mode.CANVAS, __refreshLevel, gl, defs, true);
        __cache = __config[NODE_CACHE];
        if(__cache && __cache.available) {
          node.render(mode.CANVAS, __refreshLevel, __cache.ctx, defs, true);
        }
      }
      else {
        node.render(mode.CANVAS, __refreshLevel, gl, defs, true);
      }
    }
    lastRefreshLevel = __refreshLevel;
    lastConfig = __config;
    lastLv = lv;
    // 每个元素检查cacheTotal生成，已有的上面会continue跳过
    let {
      [NODE_BLUR_VALUE]: __blurValue,
      [NODE_LIMIT_CACHE]: __limitCache,
    } = __config;
    let {
      [POSITION]: position,
      [OVERFLOW]: overflow,
      [MIX_BLEND_MODE]: mixBlendMode,
    } = computedStyle;
    if(!__limitCache && (hasMask || position === 'absolute'
      || __blurValue > 0 || overflow === 'hidden' || mixBlendMode !== 'normal')) {
      if(hasRecordAsMask) {
        hasRecordAsMask[6] = __blurValue;
        hasRecordAsMask[7] = overflow;
      }
      else {
        mergeList.push([i, lv, total, node, __config, hasMask, __blurValue, overflow]);
      }
    }
  }
  // 根据收集的需要合并局部根的索引，尝试合并，按照层级从小到大，索引从小到大的顺序，这样保证子节点在前
  if(mergeList.length) {
    mergeList.sort(function(a, b) {
      if(a[1] === b[1]) {
        return a[0] - b[0];
      }
      return b[1] - a[1];
    });
    mergeList.forEach(item => {
      let [i, , total, node, __config, hasMask, __blurValue, overflow] = item;
      let {
        [NODE_CACHE]: __cache,
        [NODE_CACHE_TOTAL]: __cacheTotal,
        [NODE_CACHE_FILTER]: __cacheFilter,
        [NODE_CACHE_MASK]: __cacheMask,
        [NODE_CACHE_OVERFLOW]: __cacheOverflow,
      } = __config;
      // 可能没变化，比如被遮罩节点、filter变更等
      if(!__cacheTotal || !__cacheTotal.available) {
        __cacheTotal = __config[NODE_CACHE_TOTAL]
          = genTotalWebgl(renderMode, gl, texCache, node, __config, i, total || 0, __structs, __cache, width, height);
        // console.log(i, __cacheTotal);
      }
      // 防止失败超限，必须有total结果
      if(__cacheTotal && __cacheTotal.available) {
        let target = __cacheTotal;
      //   if(__blurValue > 0 && (!__cacheFilter || !__cacheFilter.available)) {
      //     target = __config[NODE_CACHE_FILTER] = genFilter(node, target, __blurValue);
      //   }
      //   if(overflow === 'hidden' && (!__cacheOverflow || !__cacheOverflow.available)) {
      //     target = __config[NODE_CACHE_OVERFLOW] = genOverflow(node, target);
      //   }
        if(hasMask && (!__cacheMask || !__cacheMask.available)) {
          __config[NODE_CACHE_MASK] = genMaskWebgl(renderMode, gl, texCache, node, target, width, height);
        }
      }
    });
  }
  // console.error('render');
  // return;
  /**
   * 最后先序遍历一次应用__cacheTotal即可，没有的用__cache，以及剩下的超尺寸的和Text
   * 超尺寸的给出警告，无法像canvas那样做降级
   */
  for(let i = 0, len = __structs.length; i < len; i++) {
    let {
      [STRUCT_NODE]: node,
      [STRUCT_TOTAL]: total,
      [STRUCT_HAS_MASK]: hasMask,
    } = __structs[i];
    let __config = node.__config;
    // text如果display不可见，parent会直接跳过，不会走到这里，这里一定是直接绘制到root的，visibility在其内部判断
    if(node instanceof Text) {
      // text特殊之处，__cache是独有的，__config大部分是复用parent的
      let {
        [NODE_OPACITY]: __opacity,
        [NODE_MATRIX_EVENT]: matrixEvent,
      } = __config[NODE_DOM_PARENT].__config;
      let __cache = node.__cache;
      if(__cache && __cache.available) {
        let m = mx.m2Mat4(matrixEvent, cx, cy);
        texCache.addTexAndDrawWhenLimit(gl, __cache, __opacity, revertY(m), cx, cy);
      }
    }
    else {
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
        [NODE_REFRESH_LV]: __refreshLevel,
        [NODE_COMPUTED_STYLE]: {
          [DISPLAY]: display,
          [VISIBILITY]: visibility,
          [OVERFLOW]: overflow,
          [MIX_BLEND_MODE]: mixBlendMode,
        },
      } = __config;
      if(display === 'none') {
        i += (total || 0);
        if(hasMask) {
          i += hasMask;
        }
        continue;
      }
      // 有total的可以直接绘制并跳过子节点索引，忽略total本身，其独占用纹理单元不宜使用
      let target = getCache([__cacheMask, __cacheOverflow, __cacheFilter, __cacheTotal]);
      // total的尝试
      if(target) {
        let m = mx.m2Mat4(matrixEvent, cx, cy);
        texCache.addTexAndDrawWhenLimit(gl, target, __opacity, revertY(m), cx, cy);
        i += total || 0;
        i += hasMask || 0;
      }
      // 自身cache尝试
      else {
        if(__cache && __cache.available) {
          let m = mx.m2Mat4(matrixEvent, cx, cy);
          texCache.addTexAndDrawWhenLimit(gl, __cache, __opacity, revertY(m), cx, cy);
        }
      }
    }
  }
  texCache.refresh(gl, cx, cy);
}

export default {
  renderCacheCanvas,
  renderCanvas,
  renderSvg,
  renderWebgl,
};

