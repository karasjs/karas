import Geom from '../node/geom/Geom';
import Text from '../node/Text';
import Dom from '../node/Dom';
import Img from '../node/Img';
import mx from '../math/matrix';
import geom from '../math/geom';
import level from './level';
import util from '../util/util';
import inject from '../util/inject';
import painter from '../util/painter';
import Cache from './Cache';
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
import mode from '../node/mode';

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
    NODE_REFRESH_LV,
    NODE_CACHE_STYLE,
    NODE_DEFS_CACHE,
    NODE_IS_MASK,
    NODE_DOM_PARENT,
  },
  STRUCT_KEY: {
    STRUCT_NODE,
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
const { isE, inverse, multiply } = mx;
const { mbmName, isValidMbm } = mbm;

// 无cache时应用离屏时的优先级，从小到大，OFFSCREEN_MASK2是个特殊的
const OFFSCREEN_OVERFLOW = 0;
const OFFSCREEN_FILTER = 1;
const OFFSCREEN_MASK = 2;
const OFFSCREEN_BLEND = 3;
const OFFSCREEN_MASK2 = 4;

// 依次从list获取首个available可用的cache
function getCache(list) {
  for(let i = 0, len = list.length; i < len; i++) {
    let item = list[i];
    if(item && item.available) {
      return item;
    }
  }
}

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
  let { __sx1: sx1, __sy1: sy1, __config } = node;
  let {
    [NODE_CACHE]: cache,
    [NODE_COMPUTED_STYLE]: {
      [FILTER]: filter,
    },
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
            [NODE_LIMIT_CACHE]: limitCache,
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
        // webgl不能跳过超限
        if(limitCache && !includeLimitCache) {
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
        let target = getCache([__cacheMask, __cacheFilter, __cacheOverflow, __cacheTotal]);
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
    }
  }
  return bboxTotal;
}

function mergeBbox(bbox, t, sx1, sy1) {
  bbox[0] = Math.min(bbox[0], sx1 + t[0]);
  bbox[1] = Math.min(bbox[1], sy1 + t[1]);
  bbox[2] = Math.max(bbox[2], sx1 + t[2]);
  bbox[3] = Math.max(bbox[3], sy1 + t[3]);
}

/**
 * 生成局部根节点离屏缓存，当超限时返回空
 * @param renderMode
 * @param node
 * @param __config
 * @param index
 * @param total
 * @param __structs
 * @param cacheTop
 * @param cache
 * @returns {{enabled}|Cache|*}
 */
function genTotal(renderMode, node, __config, index, total, __structs, cacheTop, cache) {
  if(total === 0) {
    return cache;
  }
  // 存每层父亲的matrix和opacity和index，bbox计算过程中生成，缓存给下面渲染过程用
  let parentIndexHash = {};
  let opacityHash = {};
  let bboxTotal = genBboxTotal(node, __structs, index, total, parentIndexHash, opacityHash, Cache.MAX);
  if(!bboxTotal) {
    return;
  }
  let { __sx1: sx1, __sy1: sy1 } = node;
  if(cacheTop) {
    cacheTop.reset(bboxTotal, sx1, sy1);
  }
  else {
    cacheTop = Cache.getInstance(bboxTotal, sx1, sy1);
  }
  // 创建失败，再次降级
  if(!cacheTop || !cacheTop.enabled) {
    return;
  }
  cacheTop.__available = true;
  let { x: tx, y: ty, ctx, dbx, dby } = cacheTop;
  // 先绘制自己的cache，起点所以matrix视作E为空，opacity固定1
  if(cache && cache.available) {
    ctx.globalAlpha = 1;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    Cache.drawCache(cache, cacheTop);
  }
  // 因为cacheTotal不总是以左上角原点为开始，所以必须每个节点重算matrix，合并box时计算的无法用到
  let matrixHash = {};
  // 先序遍历汇总到total
  for(let i = index + 1, len = index + (total || 0) + 1; i < len; i++) {
    let {
      [STRUCT_NODE]: node,
      [STRUCT_TOTAL]: total,
      [STRUCT_HAS_MASK]: hasMask,
    } = __structs[i];
    let __config = node.__config;
    let parentIndex = parentIndexHash[i];
    let matrix = matrixHash[parentIndex]; // 父节点的在每个节点计算后保存，第一个为top的默认为E（空）
    let opacity = opacityHash[i]; // opacity在合并box时已经计算可以直接用
    // 先看text，visibility会在内部判断，display会被parent判断
    if(node instanceof Text) {
      ctx.globalAlpha = opacity;
      let m = matrix || [1, 0, 0, 1, 0, 0];
      ctx.setTransform(m[0], m[1], m[2], m[3], m[4], m[5]);
      node.render(renderMode, 0, ctx, true, tx - sx1 + dbx, ty - sy1 + dby);
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
      // mask和不可见不能被汇总到top上
      if(visibility === 'hidden' || isMask) {
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
      let target = getCache([__cacheMask, __cacheFilter, __cacheOverflow, __cacheTotal, __cache]);
      if(target) {
        if(isValidMbm(mixBlendMode)) {
          ctx.globalCompositeOperation = mbmName(mixBlendMode);
        }
        else {
          ctx.globalCompositeOperation = 'source-over';
        }
        ctx.globalAlpha = opacity;
        if(matrix) {
          ctx.setTransform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);
        }
        else {
          ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
        Cache.drawCache(target, cacheTop);
        if(target !== __cache) {
          i += total || 0;
          i += hasMask || 0;
        }
      }
    }
  }
  return cacheTop;
}

function genFilter(node, cache, v) {
  return Cache.genFilter(cache, v);
}

function genMask(node, cache) {
  let { [TRANSFORM]: transform, [TRANSFORM_ORIGIN]: transformOrigin } = node.computedStyle;
  let isClip = node.next.isClip;
  return Cache.genMask(cache, node.next, isClip, transform, transformOrigin);
}

function genOverflow(node, cache) {
  let sbox = node.bbox;
  let bbox = cache.bbox;
  // 没超过无需生成
  if(bbox[0] >= sbox[0] && bbox[1] >= sbox[1] && bbox[2] <= sbox[2] && bbox[3] <= sbox[3]) {
    return;
  }
  return Cache.genOverflow(cache, node);
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
 * @param __config
 * @param index
 * @param total
 * @param __structs
 * @param cache
 * @param limitCache
 * @param W
 * @param H
 * @returns {*}
 */
function genTotalWebgl(gl, texCache, node, __config, index, total, __structs, cache, limitCache, W, H) {
  // 存每层父亲的matrix和opacity和index，bbox计算过程中生成，缓存给下面渲染过程用
  let parentIndexHash = {};
  let opacityHash = {};
  let bboxTotal = genBboxTotal(node, __structs, index, total, parentIndexHash, opacityHash,
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
  if(cache && cache.available) {
    texCache.addTexAndDrawWhenLimit(gl, cache, 1, null, cx, cy, dx, dy);
  }
  // limitCache无cache需先绘制到统一的离屏画布上
  else if(limitCache) {
    let c = inject.getCacheCanvas(width, height, '__$$OVERSIZE$$__');
    node.render(mode.WEBGL, 0, gl);
    let j = texCache.lockOneChannel();
    let texture = webgl.createTexture(gl, c.canvas, j);
    let mockCache = new MockCache(gl, texture, 0, 0, width, height, [0, 0, width, height]);
    texCache.addTexAndDrawWhenLimit(gl, mockCache, 1, null, cx, cy, 0, 0);
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
      [STRUCT_NODE]: node,
      [STRUCT_TOTAL]: total,
      [STRUCT_HAS_MASK]: hasMask,
    } = __structs[i];
    let __config = node.__config;
    let parentIndex = parentIndexHash[i];
    let matrix = matrixHash[parentIndex]; // 父节点的在每个节点计算后保存，第一个为top的默认为E（空）
    let opacity = opacityHash[i]; // opacity在合并box时已经计算可以直接用
    // 先看text，visibility会在内部判断，display会被parent判断
    if(node instanceof Text) {
      let m = mx.m2Mat4(matrix || [1, 0, 0, 1, 0, 0], cx, cy);
      texCache.addTexAndDrawWhenLimit(gl, __config[NODE_CACHE], opacity, m, cx, cy, dx, dy);
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
      // mask和不可见不能被汇总到top上
      if(visibility === 'hidden' || isMask) {
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
      let target = getCache([__cacheMask, __cacheFilter, __cacheOverflow, __cacheTotal, __cache]);
      if(target) {
        let m = mx.m2Mat4(matrix || [1, 0, 0, 1, 0, 0], cx, cy);
        // 局部的mbm和主画布一样，先刷新当前fbo，然后把后面这个mbm节点绘入一个新的等画布尺寸的fbo中，再进行2者mbm合成
        if(isValidMbm(mixBlendMode)) {
          texCache.refresh(gl, cx, cy);
          let [n2, frameBuffer2, texture2] = genFrameBufferWithTexture(gl, texCache, width, height);
          texCache.addTexAndDrawWhenLimit(gl, target, opacity, m, cx, cy, dx, dy);
          texCache.refresh(gl, cx, cy);
          // 合成结果作为当前frameBuffer，以及纹理和单元，等于替代了当前fbo作为绘制对象
          [n, frameBuffer, texture] = genMbmWebgl(gl, texCache, n, n2, frameBuffer, texture, mbmName(mixBlendMode), width, height);
          gl.deleteFramebuffer(frameBuffer2);
          gl.deleteTexture(texture2);
        }
        else {
          texCache.addTexAndDrawWhenLimit(gl, target, opacity, m, cx, cy, dx, dy);
        }
        if(target !== __cache) {
          i += (total || 0) + (hasMask || 0);
        }
      }
    }
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
    if(k === 'blur' && v[0] > 0) {
      let res = genBlurWebgl(gl, texCache, mockCache, v, width, height, sx1, sy1, bbox);
      if(res) {
        [mockCache, width, height, bbox] = res;
      }
    }
    // else if(k === 'hue-rotate') {
    //   let res = genHueRotateWebgl(gl, texCache, mockCache, v, width, height, sx1, sy1, bbox);
    //   if(res) {
    //     [mockCache, width, height, bbox] = res;
    //   }
    // }
    // else if(k === 'saturate') {
    //   let res = genSaturateWebgl(gl, texCache, mockCache, v, width, height, sx1, sy1, bbox);
    //   if(res) {
    //     [mockCache, width, height, bbox] = res;
    //   }
    // }
    // else if(k === 'brightness') {
    //   let res = genBrightnessWebgl(gl, texCache, mockCache, v, width, height, sx1, sy1, bbox);
    //   if(res) {
    //     [mockCache, width, height, bbox] = res;
    //   }
    // }
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
  width += spread * 2;
  height += spread * 2;
  // 防止超限，webgl最大纹理尺寸限制
  let limit = gl.getParameter(gl.MAX_TEXTURE_SIZE);
  if(width > limit || height > limit) {
    return;
  }
  bbox = bbox.slice(0);
  bbox[0] -= spread;
  bbox[1] -= spread;
  bbox[2] += spread;
  bbox[3] += spread;
  let cx = width * 0.5, cy = height * 0.5;
  let weights = blur.gaussianWeight(sigma, d);
  let vert = '';
  let frag = '';
  let r = Math.floor(d * 0.5);
  for(let i = 0; i < r; i++) {
    let c = (r - i) * 0.01;
    vert += `\nv_texCoordsBlur[${i}] = a_texCoords + vec2(-${c}, -${c}) * u_direction;`;
    frag += `\ngl_FragColor += texture2D(u_texture, v_texCoordsBlur[${i}]) * ${weights[i]};`;
  }
  vert += `\nv_texCoordsBlur[${r}] = a_texCoords;`;
  frag += `\ngl_FragColor += texture2D(u_texture, v_texCoordsBlur[${r}]) * ${weights[r]};`;
  for(let i = 0; i < r; i++) {
    let c = (i + 1) * 0.01;
    vert += `\nv_texCoordsBlur[${i + r + 1}] = a_texCoords + vec2(${c}, ${c}) * u_direction;`;
    frag += `\ngl_FragColor += texture2D(u_texture, v_texCoordsBlur[${i + r + 1}]) * ${weights[i + r + 1]};`;
  }
  vert = vertexBlur.replace('[3]', '[' + d + ']').replace(/}$/, vert + '}');
  frag = fragmentBlur.replace('[3]', '[' + d + ']').replace(/}$/, frag + '}');
  let program = webgl.initShaders(gl, vert, frag);
  gl.useProgram(program);
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
  texture = webgl.drawBlur(gl, program, frameBuffer, texCache, texture, cache.page.texture, i, j,
    width, height, cx, cy, spread, d, sigma);
  // 销毁这个临时program
  gl.deleteShader(program.vertexShader);
  gl.deleteShader(program.fragmentShader);
  gl.deleteProgram(program);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.deleteFramebuffer(frameBuffer);
  texCache.releaseLockChannel(j);
  let mockCache = new MockCache(gl, texture, sx1, sy1, width, height, bbox);
  texCache.releaseLockChannel(i, mockCache.page);
  return [mockCache, width, height, bbox];
}

// function genHueRotateWebgl(gl, texCache, cache, deg, width, height, sx1, sy1, bbox) {
//   // 生成最终纹理，尺寸为被遮罩节点大小
//   let [i, frameBuffer, texture] = genFrameBufferWithTexture(gl, texCache, width, height);
//   // 将本身total的page纹理放入一个单元，一般刚生成已经在了，少部分情况变更引发的可能不在
//   let j = texCache.findExistTexChannel(cache.page);
//   if(j === -1) {
//     // 直接绑定，因为一定是个mockCache
//     j = texCache.lockOneChannel();
//     webgl.bindTexture(gl, cache.page.texture, j);
//   }
//   else {
//     texCache.lockChannel(j);
//   }
//   gl.useProgram(gl.programHueRotate);
//   webgl.drawHueRotate(gl, gl.programHueRotate, j, geom.d2r(deg % 360));
//   texCache.releaseLockChannel(j);
//   // 切回
//   gl.useProgram(gl.program);
//   gl.bindFramebuffer(gl.FRAMEBUFFER, null);
//   gl.deleteFramebuffer(frameBuffer);
//   // 同total一样生成一个mockCache
//   let mockCache = new MockCache(gl, texture, sx1, sy1, width, height, bbox.slice(0));
//   texCache.releaseLockChannel(i, mockCache.page);
//   return [mockCache, width, height, bbox];
// }
//
// function genSaturateWebgl(gl, texCache, cache, percent, width, height, sx1, sy1, bbox) {
//   // 生成最终纹理，尺寸为被遮罩节点大小
//   let [i, frameBuffer, texture] = genFrameBufferWithTexture(gl, texCache, width, height);
//   // 将本身total的page纹理放入一个单元，一般刚生成已经在了，少部分情况变更引发的可能不在
//   let j = texCache.findExistTexChannel(cache.page);
//   if(j === -1) {
//     // 直接绑定，因为一定是个mockCache
//     j = texCache.lockOneChannel();
//     webgl.bindTexture(gl, cache.page.texture, j);
//   }
//   else {
//     texCache.lockChannel(j);
//   }
//   gl.useProgram(gl.programSaturate);
//   webgl.drawSaturate(gl, gl.programSaturate, j, percent * 0.01);
//   texCache.releaseLockChannel(j);
//   // 切回
//   gl.useProgram(gl.program);
//   gl.bindFramebuffer(gl.FRAMEBUFFER, null);
//   gl.deleteFramebuffer(frameBuffer);
//   // 同total一样生成一个mockCache
//   let mockCache = new MockCache(gl, texture, sx1, sy1, width, height, bbox.slice(0));
//   texCache.releaseLockChannel(i, mockCache.page);
//   return [mockCache, width, height, bbox];
// }
//
// function genBrightnessWebgl(gl, texCache, cache, percent, width, height, sx1, sy1, bbox) {
//   // 生成最终纹理，尺寸为被遮罩节点大小
//   let [i, frameBuffer, texture] = genFrameBufferWithTexture(gl, texCache, width, height);
//   // 将本身total的page纹理放入一个单元，一般刚生成已经在了，少部分情况变更引发的可能不在
//   let j = texCache.findExistTexChannel(cache.page);
//   if(j === -1) {
//     // 直接绑定，因为一定是个mockCache
//     j = texCache.lockOneChannel();
//     webgl.bindTexture(gl, cache.page.texture, j);
//   }
//   else {
//     texCache.lockChannel(j);
//   }
//   gl.useProgram(gl.programBrightness);
//   webgl.drawSaturate(gl, gl.programBrightness, j, percent * 0.01);
//   texCache.releaseLockChannel(j);
//   // 切回
//   gl.useProgram(gl.program);
//   gl.bindFramebuffer(gl.FRAMEBUFFER, null);
//   gl.deleteFramebuffer(frameBuffer);
//   // 同total一样生成一个mockCache
//   let mockCache = new MockCache(gl, texture, sx1, sy1, width, height, bbox.slice(0));
//   texCache.releaseLockChannel(i, mockCache.page);
//   return [mockCache, width, height, bbox];
// }

function genOverflowWebgl(gl, texCache, node, cache, W, H) {
  let sbox = node.bbox.slice(0);
  let bbox = cache.bbox;
  // 没超过无需生成
  if(bbox[0] >= sbox[0] && bbox[1] >= sbox[1] && bbox[2] <= sbox[2] && bbox[3] <= sbox[3]) {
    return;
  }
  let width = sbox[2] - sbox[0], height = sbox[3] - sbox[1];
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
  // 绘制，根据坐标裁剪使用原本纹理的一部分
  gl.useProgram(gl.programOverflow);
  webgl.drawOverflow(gl, j, sbox[0] - bbox[0], sbox[1] - bbox[1], width, height, cache.width, cache.height);
  texCache.releaseLockChannel(j);
  // 切回
  gl.useProgram(gl.program);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.viewport(0, 0, W, H);
  gl.deleteFramebuffer(frameBuffer);
  // 同total一样生成一个mockCache
  let overflowCache = new MockCache(gl, texture, cache.sx1, cache.sy1, width, height, sbox);
  texCache.releaseLockChannel(i, overflowCache.page);
  return overflowCache;
}

function genMaskWebgl(gl, texCache, node, __config, cache, W, H) {
  let { sx1, sy1, width, height, bbox } = cache;
  // cache一定是mockCache，可能是total/filter/overflow一种
  let cx = width * 0.5, cy = height * 0.5;
  let dx = -bbox[0], dy = -bbox[1];
  // 先求得被遮罩的matrix，用作inverse给mask计算
  let {
    [NODE_COMPUTED_STYLE]: {
      [TRANSFORM]: transform,
      [TRANSFORM_ORIGIN]: transformOrigin,
    },
  } = __config;
  let inverse;
  if(isE(transform)) {
    inverse = [1, 0, 0, 1, 0, 0];
  }
  else {
    let tfo = transformOrigin.slice(0);
    tfo[0] += sx1 + dx;
    tfo[1] += sy1 + dx;
    inverse = tf.calMatrixByOrigin(transform, tfo);
  }
  inverse = mx.inverse(inverse);
  // 将所有mask绘入一个单独纹理中，尺寸和原点与被遮罩total相同，才能做到顶点坐标一致
  let [i, frameBuffer, texture] = genFrameBufferWithTexture(gl, texCache, width, height);
  let next = node.next;
  while(next && next.isMask) {
    let __config = next.__config;
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
    // total无用，都是单节点
    let target = getCache([__cacheFilter, __cacheOverflow, __cache]);
    if(target) {
      let m;
      if(isE(transform)) {
        m = [1, 0, 0, 1, 0, 0];
      }
      else {
        let tfo = transformOrigin.slice(0);
        tfo[0] += target.bbox[0] + dx;
        tfo[1] += target.bbox[1] + dy;
        m = tf.calMatrixByOrigin(transform, tfo);
      }
      m = mx.multiply(inverse, m);
      m = mx.m2Mat4(m, cx, cy);
      texCache.addTexAndDrawWhenLimit(gl, target, opacity, m, cx, cy, dx, dy);
    }
    // 异常情况超限
    else if(__config[NODE_LIMIT_CACHE]) {
      return;
    }
    next = next.next;
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
  let isClip = node.next.isClip;
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

function applyOffscreen(ctx, list, width, height) {
  list.sort(function(a, b) {
    if(a[1] === b[1]) {
      if(a[0] === b[0]) {
        return a[2] - b[2];
      }
      return b[0] - a[0];
    }
    return b[1] - a[1];
  });
  list.forEach(item => {
    let [, , type, offscreen] = item;
    if(type === OFFSCREEN_OVERFLOW) {
      let { matrix, target, ctx: origin, x, y, offsetWidth, offsetHeight } = offscreen;
      ctx.globalCompositeOperation = 'destination-in';
      ctx.globalAlpha = 1;
      ctx.setTransform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);
      ctx.fillStyle = '#FFF';
      ctx.beginPath();
      ctx.rect(x, y, offsetWidth, offsetHeight);
      ctx.fill();
      ctx.closePath();
      ctx.globalCompositeOperation = 'source-over';
      target.draw();
      ctx = origin;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalAlpha = 1;
      ctx.drawImage(target.canvas, 0, 0, width, height, 0, 0, width, height);
      ctx.draw && ctx.draw(true);
      target.ctx.setTransform(1, 0, 0, 1, 0, 0);
      target.ctx.clearRect(0, 0, width, height);
      target.draw();
      inject.releaseCacheCanvas(target.canvas);
    }
    else if(type === OFFSCREEN_FILTER) {
      let { target, ctx: origin, filter } = offscreen;
      // 申请一个新的离屏，应用blur并绘制，如没有则降级，默认ctx.filter为'none'
      if(ctx.filter) {
        let apply = inject.getCacheCanvas(width, height, null, 'filter2');
        apply.ctx.filter = painter.canvasFilter(filter);
        apply.ctx.drawImage(target.canvas, 0, 0, width, height, 0, 0, width, height);
        apply.ctx.filter = 'none';
        apply.draw();
        target.ctx.globalAlpha = 1;
        target.ctx.setTransform(1, 0, 0, 1, 0, 0);
        target.ctx.clearRect(0, 0, width, height);
        target.ctx.drawImage(apply.canvas, 0, 0, width, height, 0, 0, width, height);
        target.draw();
        apply.ctx.setTransform(1, 0, 0, 1, 0, 0);
        apply.ctx.clearRect(0, 0, width, height);
        apply.draw();
        inject.releaseCacheCanvas(apply.canvas);
      }
      // 绘制回主画布，如果不支持则等同无filter原样绘制
      ctx = origin;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalAlpha = 1;
      ctx.drawImage(target.canvas, 0, 0, width, height, 0, 0, width, height);
      ctx.draw && ctx.draw(true);
      target.ctx.setTransform(1, 0, 0, 1, 0, 0);
      target.ctx.globalAlpha = 1;
      target.ctx.clearRect(0, 0, width, height);
      target.draw();
      inject.releaseCacheCanvas(target.canvas);
    }
    else if(type === OFFSCREEN_MASK) {
      let { mask, isClip } = offscreen;
      if(isClip) {
        offscreen.target.draw();
        ctx = mask.ctx;
        ctx.globalCompositeOperation = 'source-out';
        ctx.globalAlpha = 1;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.drawImage(offscreen.target.canvas, 0, 0, width, height, 0, 0, width, height);
        mask.draw();
        ctx.globalCompositeOperation = 'source-over';
        offscreen.target.ctx.setTransform(1, 0, 0, 1, 0, 0);
        offscreen.target.ctx.clearRect(0, 0, width, height);
        offscreen.target.draw();
        inject.releaseCacheCanvas(offscreen.target.canvas);
        ctx = offscreen.ctx;
        ctx.globalAlpha = 1;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.drawImage(mask.canvas, 0, 0, width, height, 0, 0, width, height);
        ctx.draw && ctx.draw(true);
        mask.ctx.setTransform(1, 0, 0, 1, 0, 0);
        mask.ctx.clearRect(0, 0, width, height);
        mask.draw();
        inject.releaseCacheCanvas(mask.canvas);
      }
      else {
        mask.draw();
        let target = offscreen.target;
        ctx = target.ctx;
        ctx.globalCompositeOperation = 'destination-in';
        ctx.globalAlpha = 1;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.drawImage(mask.canvas, 0, 0, width, height, 0, 0, width, height);
        ctx.globalCompositeOperation = 'source-over';
        target.draw();
        mask.ctx.setTransform(1, 0, 0, 1, 0, 0);
        mask.ctx.clearRect(0, 0, width, height);
        mask.draw();
        inject.releaseCacheCanvas(mask.canvas);
        ctx = offscreen.ctx;
        ctx.globalAlpha = 1;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.drawImage(target.canvas, 0, 0, width, height, 0, 0, width, height);
        ctx.draw && ctx.draw(true);
        target.ctx.setTransform(1, 0, 0, 1, 0, 0);
        target.ctx.clearRect(0, 0, width, height);
        target.draw();
        inject.releaseCacheCanvas(target.canvas);
      }
    }
    else if(type === OFFSCREEN_BLEND) {
      let target = offscreen.target;
      ctx = offscreen.ctx;
      ctx.globalCompositeOperation = offscreen.mixBlendMode;
      target.draw();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalAlpha = 1;
      ctx.drawImage(target.canvas, 0, 0, width, height, 0, 0, width, height);
      ctx.globalCompositeOperation = 'source-over';
      ctx.draw && ctx.draw(true);
      target.ctx.globalAlpha = 1;
      target.ctx.setTransform(1, 0, 0, 1, 0, 0);
      target.ctx.clearRect(0, 0, width, height);
      target.draw();
      inject.releaseCacheCanvas(target.canvas);
    }
    // 特殊的mask节点汇总结束，还原ctx
    else if(type === OFFSCREEN_MASK2) {
      ctx = offscreen.ctx;
    }
  });
  return ctx;
}

function renderCacheCanvas(renderMode, ctx, root) {
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
      parentMatrix = matrixList[lv - 1];
      opacityList.splice(-diff);
      parentOpacity = opacityList[lv - 1];
    }
    // 不变是同级兄弟，无需特殊处理
    else {}
    lastConfig = __config;
    lastLv = lv;
    let {
      [NODE_REFRESH_LV]: refreshLevel,
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
    if(refreshLevel < REPAINT) {
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
        [NODE_MATRIX_EVENT]: matrixEvent,
      } = __config;
      let matrix;
      if(contain(refreshLevel, TRANSFORM_ALL)) {
        matrix = node.__calMatrix(refreshLevel, __cacheStyle, currentStyle, computedStyle, __config);
        // 恶心的v8性能优化
        let m = __config[NODE_MATRIX];
        m[0] = matrix[0];
        m[1] = matrix[1];
        m[2] = matrix[2];
        m[3] = matrix[3];
        m[4] = matrix[4];
        m[5] = matrix[5];
      }
      else {
        matrix = __config[NODE_MATRIX];
      }
      // 父不为E时要点乘继承父的
      if(parentMatrix) {
        matrix = multiply(parentMatrix, matrix);
      }
      // 恶心的v8性能优化
      matrixEvent[0] = matrix[0];
      matrixEvent[1] = matrix[1];
      matrixEvent[2] = matrix[2];
      matrixEvent[3] = matrix[3];
      matrixEvent[4] = matrix[4];
      matrixEvent[5] = matrix[5];
      let opacity;
      if(contain(refreshLevel, OP)) {
        opacity = computedStyle[OPACITY] = currentStyle[OPACITY];
      }
      else {
        opacity = computedStyle[OPACITY];
      }
      __config[NODE_OPACITY] = parentOpacity * opacity;
      // filter会改变bbox范围
      if(contain(refreshLevel, FT)) {
        node.__bbox = null;
        let filter = node.__calFilter(currentStyle, computedStyle);
        let __cacheFilter = __config[NODE_CACHE_FILTER];
        if(__cacheFilter) {
          __cacheFilter.release();
        }
        // 防重
        if(hasRecordAsMask) {
          hasRecordAsMask[6] = filter;
        }
        else {
          // 强制存hasMask，因为filter改变影响mask
          hasRecordAsMask = [i, lv, total, node, __config, hasMask, filter];
          mergeList.push(hasRecordAsMask);
        }
      }
      if(contain(refreshLevel, MBM)) {
        computedStyle[MIX_BLEND_MODE] = currentStyle[MIX_BLEND_MODE];
      }
      // total可以跳过所有孩子节点省略循环，filter/mask等的强制前提是有total
      if(__cacheTotal && __cacheTotal.available) {
        i += (total || 0);
        continue;
      }
    }
    /**
     * >=REPAINT重新渲染，并根据结果判断是否离屏限制limitCache
     * Geom没有子节点无需汇总局部根，Dom中Img也是，它们的局部根等于自身的cache，其它符合条件的Dom需要生成
     */
    else {
      node.render(renderMode, refreshLevel, ctx, true);
    }
    // 每个元素检查cacheTotal生成，已有的上面会continue跳过
    let {
      [NODE_LIMIT_CACHE]: limitCache,
    } = __config;
    let {
      [POSITION]: position,
      [OVERFLOW]: overflow,
      [FILTER]: filter,
      [MIX_BLEND_MODE]: mixBlendMode,
    } = computedStyle;
    if(!limitCache && (hasMask || position === 'absolute'
      || filter.length || (overflow === 'hidden' && total) || isValidMbm(mixBlendMode))) {
      if(hasRecordAsMask) {
        hasRecordAsMask[6] = filter;
        hasRecordAsMask[7] = overflow;
      }
      else {
        mergeList.push([i, lv, total, node, __config, hasMask, filter, overflow]);
      }
    }
  }
  // 根据收集的需要合并局部根的索引，尝试合并，按照层级从大到小，索引从大到小的顺序，
  // 这样保证子节点在前，后节点在前，后节点是为了mask先应用自身如filter之后再进行遮罩
  if(mergeList.length) {
    mergeList.sort(function(a, b) {
      if(a[1] === b[1]) {
        return b[0] - a[0];
      }
      return b[1] - a[1];
    });
    mergeList.forEach(item => {
      let [i, , total, node, __config, hasMask, filter, overflow] = item;
      let {
        [NODE_CACHE]: __cache,
        [NODE_CACHE_TOTAL]: __cacheTotal,
        [NODE_CACHE_FILTER]: __cacheFilter,
        [NODE_CACHE_MASK]: __cacheMask,
        [NODE_CACHE_OVERFLOW]: __cacheOverflow,
      } = __config;
      let needGen;
      // 可能没变化，比如被遮罩节点、filter变更等
      if(!__cacheTotal || !__cacheTotal.available) {
        __cacheTotal = genTotal(renderMode, node, __config, i, total || 0, __structs, __cacheTotal, __cache);
        if(__cacheTotal && __cacheTotal !== __cache) {
          __config[NODE_CACHE_TOTAL] = __cacheTotal;
        }
        needGen = true;
      }
      // 防止失败超限，必须有total结果
      if(__cacheTotal && __cacheTotal.available) {
        let target = __cacheTotal;
        if(overflow === 'hidden') {
          if(!__cacheOverflow || !__cacheOverflow.available || needGen) {
            __config[NODE_CACHE_OVERFLOW] = genOverflow(node, target);
            needGen = true;
          }
          target = __config[NODE_CACHE_OVERFLOW] || target;
        }
        if(filter && filter.length) {
          if(!__cacheFilter || !__cacheFilter.available || needGen) {
            __config[NODE_CACHE_FILTER] = genFilter(node, target, filter);
            needGen = true;
          }
          target = __config[NODE_CACHE_FILTER] || target;
        }
        if(hasMask && (!__cacheMask || !__cacheMask.available || needGen)) {
          __config[NODE_CACHE_MASK] = genMask(node, target);
        }
      }
    });
  }
  /**
   * 最后先序遍历一次应用__cacheTotal即可，没有的用__cache，以及剩下的超尺寸的和Text
   * 超尺寸的依旧要走无cache逻辑render，这部分和无cache渲染很像
   */
  let maskStartHash = {};
  let offscreenHash = {};
  for(let i = 0, len = __structs.length; i < len; i++) {
    let {
      [STRUCT_NODE]: node,
      [STRUCT_LV]: lv,
      [STRUCT_TOTAL]: total,
      [STRUCT_HAS_MASK]: hasMask,
    } = __structs[i];
    let __config = node.__config;
    // text如果display不可见，parent会直接跳过，不会走到这里，这里一定是直接绘制到root的，visibility在其内部判断
    if(node instanceof Text) {
      let {
        [NODE_OPACITY]: opacity,
        [NODE_MATRIX_EVENT]: matrixEvent,
      } = __config[NODE_DOM_PARENT].__config;
      ctx.globalAlpha = opacity;
      ctx.setTransform(matrixEvent[0], matrixEvent[1], matrixEvent[2], matrixEvent[3], matrixEvent[4], matrixEvent[5]);
      node.render(renderMode, 0, ctx);
      if(offscreenHash.hasOwnProperty(i)) {
        ctx = applyOffscreen(ctx, offscreenHash[i], width, height);
      }
    }
    else {
      let {
        [NODE_OPACITY]: opacity,
        [NODE_MATRIX_EVENT]: matrixEvent,
        [NODE_LIMIT_CACHE]: limitCache,
        [NODE_CACHE]: __cache,
        [NODE_CACHE_TOTAL]: __cacheTotal,
        [NODE_CACHE_FILTER]: __cacheFilter,
        [NODE_CACHE_MASK]: __cacheMask,
        [NODE_CACHE_OVERFLOW]: __cacheOverflow,
        [NODE_REFRESH_LV]: refreshLevel,
        [NODE_COMPUTED_STYLE]: {
          [DISPLAY]: display,
          [VISIBILITY]: visibility,
          [OVERFLOW]: overflow,
          [FILTER]: filter,
          [MIX_BLEND_MODE]: mixBlendMode,
        },
      } = __config;
      // 有total的可以直接绘制并跳过子节点索引
      let target = getCache([__cacheMask, __cacheFilter, __cacheOverflow, __cacheTotal]);
      // total的尝试
      if(target) {
        i += (total || 0) + (hasMask || 0);
        // total的none直接跳过
        if(display === 'none') {
          continue;
        }
        if(isValidMbm(mixBlendMode)) {
          ctx.globalCompositeOperation = mbmName(mixBlendMode);
        }
        else {
          ctx.globalCompositeOperation = 'source-over';
        }
        Cache.draw(ctx, opacity, matrixEvent, target);
        // total应用后记得设置回来
        ctx.globalCompositeOperation = 'source-over';
        // 父超限但子有total的时候，i此时已经增加到了末尾，也需要检查
        if(offscreenHash.hasOwnProperty(i)) {
          ctx = applyOffscreen(ctx, offscreenHash[i], width, height);
        }
      }
      // 自身cache尝试
      else {
        if(maskStartHash.hasOwnProperty(i)) {
          let [n, offscreenMask] = maskStartHash[i];
          let target = inject.getCacheCanvas(width, height, null, 'mask2');
          offscreenMask.mask = target; // 应用mask用到
          let j = i + n - 1 + (total || 0);
          let list = offscreenHash[j];
          list.push([j, lv, OFFSCREEN_MASK2, {
            ctx, // 保存等待OFFSCREEN_MASK2时还原
            target,
          }]);
          ctx = target.ctx;
        }
        let offscreenBlend, offscreenMask, offscreenFilter, offscreenOverflow;
        // 这里比较特殊，可能会有__cache但超限没被汇聚到total上，需mock出离屏对象数据，还有可能本身就超限
        if(__cache && __cache.available || limitCache) {
          if(__cache && __cache.available) {
            // 有cache但没生成total的都在这
            if(isValidMbm(mixBlendMode)) {
              let c = inject.getCacheCanvas(width, height, null, 'blend');
              offscreenBlend = {
                ctx,
                target: c,
                mixBlendMode: mbmName(mixBlendMode),
                matrix: matrixEvent,
              };
              ctx = c.ctx;
            }
            if(hasMask) {
              let c = inject.getCacheCanvas(width, height, null, 'mask1');
              offscreenMask = {
                ctx,
                target: c,
                matrix: matrixEvent,
              };
              ctx = c.ctx;
            }
            if(filter && filter.length) {
              let c = inject.getCacheCanvas(width, height, null, 'filter1');
              offscreenFilter = {
                ctx,
                filter,
                target: c,
                matrix: matrixEvent,
              };
              ctx = c.ctx;
            }
            if(overflow === 'hidden' && display !== 'inline') {
              let c = inject.getCacheCanvas(width, height, null, 'overflow');
              offscreenOverflow = {
                ctx,
                target: c,
                matrix: matrixEvent,
                x: __cache.sx1,
                y: __cache.sy1,
                offsetWidth: node.offsetWidth,
                offsetHeight: node.offsetHeight,
              };
              ctx = c.ctx;
            }
            if(visibility !== 'hidden') {
              Cache.draw(ctx, opacity, matrixEvent, __cache);
            }
          }
          else {
            // 连cache都没生成的超限
            let res = node.render(renderMode, refreshLevel, ctx) || {};
            offscreenBlend = res.offscreenBlend;
            offscreenMask = res.offscreenMask;
            offscreenFilter = res.offscreenFilter;
            offscreenOverflow = res.offscreenOverflow;
          }
          // 这里离屏顺序和xom里返回的一致，和下面应用离屏时的list相反
          if(offscreenBlend) {
            let j = i + (total || 0) + (hasMask || 0);
            let list = offscreenHash[j] = offscreenHash[j] || [];
            list.push([i, lv, OFFSCREEN_BLEND, offscreenBlend]);
            ctx = offscreenBlend.target.ctx;
          }
          // 被遮罩的节点要为第一个遮罩和最后一个遮罩的索引打标，被遮罩的本身在一个离屏canvas，遮罩的元素在另外一个
          if(offscreenMask) {
            let j = i + (total || 0);
            maskStartHash[j + 1] = [hasMask, offscreenMask];
            offscreenMask.isClip = __structs[j + 1][STRUCT_NODE].isClip;
            j += (hasMask || 0);
            // 有start一定有end
            let list = offscreenHash[j] = offscreenHash[j] || [];
            list.push([i, lv, OFFSCREEN_MASK, offscreenMask]);
            ctx = offscreenMask.target.ctx;
          }
          // filter造成的离屏，需要将后续一段孩子节点区域的ctx替换，并在结束后应用结果，再替换回来
          if(offscreenFilter) {
            let j = i + (total || 0) + (hasMask || 0);
            let list = offscreenHash[j] = offscreenHash[j] || [];
            list.push([i, lv, OFFSCREEN_FILTER, offscreenFilter]);
            ctx = offscreenFilter.target.ctx;
          }
          // overflow:hidden的离屏，最后孩子进行截取
          if(offscreenOverflow) {
            let j = i + (total || 0) + (hasMask || 0);
            let list = offscreenHash[j] = offscreenHash[j] || [];
            list.push([i, lv, OFFSCREEN_OVERFLOW, offscreenOverflow]);
            ctx = offscreenOverflow.target.ctx;
          }
          if(limitCache && node instanceof Geom) {
            node.render(renderMode, refreshLevel, ctx);
          }
        }
        // 没内容的遮罩跳过，比如未加载的img，否则会将遮罩绘制出来
        else if(hasMask) {
          i += (total || 0) + hasMask;
        }
        // 同无cache一样的离屏应用
        if(offscreenHash.hasOwnProperty(i)) {
          ctx = applyOffscreen(ctx, offscreenHash[i], width, height);
        }
        if(display === 'none') {
          i += (total || 0) + (hasMask || 0);
        }
      }
    }
  }
}

/**
 * 无缓存模式canvas渲染，O(n)一次循环完成
 * @param renderMode
 * @param ctx
 * @param root
 */
function renderCanvas(renderMode, ctx, root) {
  let { __structs, width, height } = root;
  /**
   * 离屏功能的数据结构和算法逻辑非常复杂，需用到下面2个hash，来完成一些filter、mask等离屏才能完成的绘制
   * 其中overflow、filter、mix-blend-mode是对自身及子节点，mask则是对自身和后续next遮罩节点
   * 一个节点在Xom渲染中申请离屏canvas，是按照一定顺序来的，且多个离屏后面的有前面的ctx引用，第一个则引用最初非离屏的ctx
   * 这个顺序在应用离屏时以反向顺序开始，这样最后ctx被还原到最初的ctx
   * mask是个十分特殊的离屏，因为除了自身外，next节点也需要汇总到另外一个离屏上，为了逻辑一致性，
   * 所有离屏应用的索引都以最后一个节点的索引为准，即有mask时以最后一个mask，无mask则以自身节点的最后一个（+total)为索引
   */
  let maskStartHash = {};
  let offscreenHash = {};
  for(let i = 0, len = __structs.length; i < len; i++) {
    let {
      [STRUCT_NODE]: node,
      [STRUCT_LV]: lv,
      [STRUCT_TOTAL]: total,
      [STRUCT_HAS_MASK]: hasMask,
    } = __structs[i];
    let {
      [NODE_COMPUTED_STYLE]: computedStyle,
      [NODE_REFRESH_LV]: refreshLevel,
    } = node.__config;
    // 遮罩对象申请了个离屏，其第一个mask申请另外一个离屏mask2，开始聚集所有mask元素的绘制，
    // 这是一个十分特殊的逻辑，保存的index是最后一个节点的索引，OFFSCREEN_MASK2是最低优先级，
    // 这样当mask本身有filter时优先自身，然后才是OFFSCREEN_MASK2
    if(maskStartHash.hasOwnProperty(i)) {
      let [n, offscreenMask] = maskStartHash[i];
      let target = inject.getCacheCanvas(width, height, null, 'mask2');
      offscreenMask.mask = target; // 应用mask用到
      let j = i + n - 1 + (total || 0);
      let list = offscreenHash[j];
      list.push([j, lv, OFFSCREEN_MASK2, {
        ctx, // 保存等待OFFSCREEN_MASK2时还原
        target,
      }]);
      ctx = target.ctx;
    }
    let res = node.render(renderMode, refreshLevel, ctx);
    let { offscreenBlend, offscreenMask, offscreenFilter, offscreenOverflow } = res || {};
    // 这里离屏顺序和xom里返回的一致，和下面应用离屏时的list相反
    if(offscreenBlend) {
      let j = i + (total || 0) + (hasMask || 0);
      let list = offscreenHash[j] = offscreenHash[j] || [];
      list.push([i, lv, OFFSCREEN_BLEND, offscreenBlend]);
      ctx = offscreenBlend.target.ctx;
    }
    // 被遮罩的节点要为第一个遮罩和最后一个遮罩的索引打标，被遮罩的本身在一个离屏canvas，遮罩的元素在另外一个
    if(offscreenMask) {
      let j = i + (total || 0);
      maskStartHash[j + 1] = [hasMask, offscreenMask];
      offscreenMask.isClip = __structs[j + 1][STRUCT_NODE].isClip;
      j += (hasMask || 0);
      // 有start一定有end
      let list = offscreenHash[j] = offscreenHash[j] || [];
      list.push([i, lv, OFFSCREEN_MASK, offscreenMask]);
      ctx = offscreenMask.target.ctx;
    }
    // filter造成的离屏，需要将后续一段孩子节点区域的ctx替换，并在结束后应用结果，再替换回来
    if(offscreenFilter) {
      let j = i + (total || 0) + (hasMask || 0);
      let list = offscreenHash[j] = offscreenHash[j] || [];
      list.push([i, lv, OFFSCREEN_FILTER, offscreenFilter]);
      ctx = offscreenFilter.target.ctx;
    }
    // overflow:hidden的离屏，最后孩子进行截取
    if(offscreenOverflow) {
      let j = i + (total || 0) + (hasMask || 0);
      let list = offscreenHash[j] = offscreenHash[j] || [];
      list.push([i, lv, OFFSCREEN_OVERFLOW, offscreenOverflow]);
      ctx = offscreenOverflow.target.ctx;
    }
    // 离屏应用，按照lv从大到小即子节点在前先应用，同一个节点多个效果按offscreen优先级从小到大来，
    // 由于mask特殊索引影响，所有离屏都在最后一个mask索引判断，此时mask本身优先结算，以index序大到小判断
    if(offscreenHash.hasOwnProperty(i)) {
      ctx = applyOffscreen(ctx, offscreenHash[i], width, height);
    }
    // render后判断可见状态，此时computedStyle才有值，以及svg的virtualDom也要生成
    if(computedStyle[DISPLAY] === 'none') {
      i += (total || 0) + (hasMask || 0);
    }
  }
}

function renderSvg(renderMode, ctx, root, isFirst) {
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
        [NODE_REFRESH_LV]: refreshLevel,
        [NODE_DEFS_CACHE]: defsCache,
      } = node.__config;
      // 只要涉及到matrix和opacity就影响mask
      let hasEffectMask = hasMask && (refreshLevel >= REPAINT || contain(refreshLevel, TRANSFORM_ALL | OP));
      if(hasEffectMask) {
        let start = i + (total || 0) + 1;
        let end = start + hasMask;
        // mask索引遍历时处理，暂存遮罩对象的刷新lv
        maskEffectHash[end - 1] = refreshLevel;
      }
      // >=REPAINT重绘生成走render()跳过这里
      if(refreshLevel < REPAINT) {
        // let hasFilter = contain(refreshLevel, FT);
        // 特殊的mask判断，遮罩对象影响这个mask了，除去filter、遮罩对象无TRANSFORM变化外都可缓存
        if(maskEffectHash.hasOwnProperty(i)) {
          let v = maskEffectHash[i];
          if(!contain(refreshLevel, TRANSFORM_ALL) && v < REPAINT && !contain(v, TRANSFORM_ALL)) {
            defsCache.forEach(item => {
              // if(!hasFilter || item.tagName !== 'filter' || item.children[0].tagName !== 'feGaussianBlur') {
              //   ctx.addCache(item);
              // }
              ctx.addCache(item);
            });
          }
        }
        // 去除特殊的filter，普通节点或不影响的mask在<REPAINT下defs的其它都可缓存
        else {
          defsCache.forEach(item => {
            // if(!hasFilter || item.tagName !== 'filter' || item.children[0].tagName !== 'feGaussianBlur') {
            //   ctx.addCache(item);
            // }
            ctx.addCache(item);
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
      [NODE_REFRESH_LV]: refreshLevel,
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
    if(refreshLevel < REPAINT && !(node instanceof Text)) {
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
          if(hasMask) {
            i += hasMask;
          }
        }
      }
      let {
        [NODE_CURRENT_STYLE]: currentStyle,
        [NODE_COMPUTED_STYLE]: computedStyle,
        [NODE_CACHE_STYLE]: __cacheStyle,
      } = __config;
      if(contain(refreshLevel, TRANSFORM_ALL)) {
        let matrix = node.__calMatrix(refreshLevel, __cacheStyle, currentStyle, computedStyle, __config);
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
      if(contain(refreshLevel, OP)) {
        let opacity = computedStyle[OPACITY] = currentStyle[OPACITY];
        if(opacity === 1) {
          delete virtualDom.opacity;
        }
        else {
          virtualDom.opacity = opacity;
        }
      }
      if(contain(refreshLevel, FT)) {
        let filter = node.__calFilter(currentStyle, computedStyle);
        let s = painter.svgFilter(filter);
        if(s) {
          virtualDom.filter = s;
        }
        else {
          delete virtualDom.filter;
        }
      }
      if(contain(refreshLevel, MBM)) {
        let mixBlendMode = computedStyle[MIX_BLEND_MODE] = currentStyle[MIX_BLEND_MODE];
        if(isValidMbm(mixBlendMode)) {
          virtualDom.mixBlendMode = mbmName(mixBlendMode);
        }
        else {
          delete virtualDom.mixBlendMode;
        }
      }
      virtualDom.lv = refreshLevel;
    }
    else {
      // >=REPAINT会调用render，重新生成defsCache，text没有这个东西
      __config[NODE_DEFS_CACHE] && __config[NODE_DEFS_CACHE].splice(0);
      node.render(renderMode, refreshLevel, ctx);
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
    if(maskHash.hasOwnProperty(i) && (maskEffectHash.hasOwnProperty(i) || refreshLevel >= REPAINT || contain(refreshLevel, TRANSFORM_ALL | OP))) {
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
      let id = ctx.add(o);
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

function renderWebgl(renderMode, gl, root) {
  let { __structs, width, height, texCache } = root;
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
      [STRUCT_NODE]: node,
      [STRUCT_LV]: lv,
      [STRUCT_TOTAL]: total,
      [STRUCT_HAS_MASK]: hasMask,
    } = __structs[i];
    // Text特殊处理，webgl中先渲染为bitmap，再作为贴图绘制，缓存交由text内部判断，直接调用渲染纹理方法
    if(node instanceof Text) {
      if(lastRefreshLevel >= REPAINT) {
        node.render(renderMode, 0, gl, true);
      }
      continue;
    }
    let __config = node.__config;
    let refreshLevel = __config[NODE_REFRESH_LV];
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
      parentMatrix = matrixList[lv - 1];
      opacityList.splice(-diff);
      parentOpacity = opacityList[lv - 1];
      refreshLevelList.splice(-diff);
      parentRefreshLevel = refreshLevelList[lv - 1];
    }
    // 不变是同级兄弟，无需特殊处理
    else {}
    lastRefreshLevel = refreshLevel;
    lastConfig = __config;
    lastLv = lv;
    let {
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
    if(refreshLevel < REPAINT) {
      __config[NODE_REFRESH_LV] = NONE;
      if(hasMask) {
        let cacheMask = __config[NODE_CACHE_MASK];
        if(!cacheMask || !cacheMask.available) {
          hasRecordAsMask = [i, lv, total, node, __config, null, hasMask];
          mergeList.push(hasRecordAsMask);
        }
      }
      let {
        [NODE_CURRENT_STYLE]: currentStyle,
        [NODE_CACHE_STYLE]: __cacheStyle,
        [NODE_MATRIX_EVENT]: matrixEvent,
      } = __config;
      let matrix;
      if(contain(refreshLevel, TRANSFORM_ALL)) {
        matrix = node.__calMatrix(refreshLevel, __cacheStyle, currentStyle, computedStyle, __config);
        // 恶心的v8性能优化
        let m = __config[NODE_MATRIX];
        m[0] = matrix[0];
        m[1] = matrix[1];
        m[2] = matrix[2];
        m[3] = matrix[3];
        m[4] = matrix[4];
        m[5] = matrix[5];
      }
      else {
        matrix = __config[NODE_MATRIX];
      }
      if(parentMatrix) {
        matrix = multiply(parentMatrix, matrix);
      }
      // 恶心的v8性能优化
      matrixEvent[0] = matrix[0];
      matrixEvent[1] = matrix[1];
      matrixEvent[2] = matrix[2];
      matrixEvent[3] = matrix[3];
      matrixEvent[4] = matrix[4];
      matrixEvent[5] = matrix[5];
      let opacity;
      if(contain(refreshLevel, OP)) {
        opacity = computedStyle[OPACITY] = currentStyle[OPACITY];
      }
      else {
        opacity = computedStyle[OPACITY];
      }
      __config[NODE_OPACITY] = parentOpacity * opacity;
      // filter会改变bbox范围
      if(contain(refreshLevel, FT)) {
        node.__bbox = null;
        let filter = node.__calFilter(currentStyle, computedStyle);
        let __cacheFilter = __config[NODE_CACHE_FILTER];
        if(__cacheFilter) {
          __cacheFilter.release();
        }
        // 防重
        if(hasRecordAsMask) {
          hasRecordAsMask[7] = filter;
        }
        else {
          // 强制存hasMask，因为filter改变影响mask
          hasRecordAsMask = [i, lv, total, node, __config, null, hasMask, filter];
          mergeList.push(hasRecordAsMask);
        }
      }
      if(contain(refreshLevel, MBM)) {
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
     * Geom没有子节点无需汇总局部根，Dom中Img也是，它们的局部根等于自身的cache，其它符合条件的Dom需要生成
     */
    else {
      let res = node.render(renderMode, refreshLevel, gl, true);
      // geom可返回texture纹理，替代原有xom的__cache纹理
      if(res && inject.isWebGLTexture(res.texture)) {
        let { __sx1: sx1, __sy1: sy1, offsetWidth: w, offsetHeight: h, bbox } = node;
        __config[NODE_CACHE] = new MockCache(gl, res.texture, sx1, sy1, w, h, bbox);
        gl.viewport(0, 0, width, height);
        gl.useProgram(gl.program);
      }
    }
    // 每个元素检查cacheTotal生成，已有的上面会continue跳过
    let {
      [NODE_LIMIT_CACHE]: limitCache,
    } = __config;
    let {
      [OVERFLOW]: overflow,
      [FILTER]: filter,
      [MIX_BLEND_MODE]: mixBlendMode,
    } = computedStyle;
    let validMbm = isValidMbm(mixBlendMode);
    if(hasMask || filter.length || (overflow === 'hidden' && total) || validMbm) {
      if(validMbm) {
        hasMbm = true;
      }
      if(hasRecordAsMask) {
        hasRecordAsMask[5] = limitCache;
        hasRecordAsMask[7] = filter;
        hasRecordAsMask[8] = overflow;
      }
      else {
        mergeList.push([i, lv, total, node, __config, limitCache, hasMask, filter, overflow]);
      }
    }
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
    mergeList.forEach(item => {
      let [i, , total, node, __config, limitCache, hasMask, filter, overflow] = item;
      let {
        [NODE_CACHE]: __cache,
        [NODE_CACHE_TOTAL]: __cacheTotal,
        [NODE_CACHE_FILTER]: __cacheFilter,
        [NODE_CACHE_MASK]: __cacheMask,
        [NODE_CACHE_OVERFLOW]: __cacheOverflow,
      } = __config;
      let needGen;
      // 可能没变化，比如被遮罩节点、filter变更等
      if(!__cacheTotal || !__cacheTotal.available) {
        let [limit, res] = genTotalWebgl(gl, texCache, node, __config, i, total || 0, __structs, __cache, limitCache, width, height);
        __cacheTotal = res;
        needGen = true;
        limitCache = limit;
        // 返回的limit包含各种情况超限，一旦超限，只能生成临时cacheTotal不能保存
        if(!limitCache) {
          __config[NODE_CACHE_TOTAL] = res;
        }
      }
      // 即使超限，也有total结果
      let target = __cacheTotal;
      if(overflow === 'hidden') {
        if(!__cacheOverflow || !__cacheOverflow.available || needGen) {
          target = genOverflowWebgl(gl, texCache, node, target, width, height);
          needGen = true;
          if(!limitCache) {
            __config[NODE_CACHE_FILTER] = target;
          }
        }
      }
      if(filter.length) {
        if(!__cacheFilter || !__cacheFilter.available || needGen) {
          let old = target;
          target = genFilterWebgl(gl, texCache, node, target, filter, width, height);
          if(target !== old) {
            needGen = true;
            if(!limitCache) {
              __config[NODE_CACHE_FILTER] = target;
            }
          }
        }
      }
      if(hasMask && (!__cacheMask || !__cacheMask.available || needGen)) {
        target = genMaskWebgl(gl, texCache, node, __config, target, width, height);
        if(!limitCache) {
          __config[NODE_CACHE_MASK] = target;
        }
      }
      // 保存临时的局部根节点
      if(limitCache) {
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
      [STRUCT_NODE]: node,
      [STRUCT_TOTAL]: total,
      [STRUCT_HAS_MASK]: hasMask,
    } = __structs[i];
    let __config = node.__config;
    // text如果display不可见，parent会直接跳过，不会走到这里，这里一定是直接绘制到root的，visibility在其内部判断
    if(node instanceof Text) {
      // text特殊之处，__config部分是复用parent的
      let {
        [NODE_CACHE]: __cache,
        [NODE_LIMIT_CACHE]: limitCache,
        [NODE_DOM_PARENT]: {
          __config: {
            [NODE_MATRIX_EVENT]: matrixEvent,
            [NODE_OPACITY]: opacity,
          },
        },
      } = __config;
      let m = mx.m2Mat4(matrixEvent, cx, cy);
      if(__cache && __cache.available) {
        texCache.addTexAndDrawWhenLimit(gl, __cache, opacity, m, cx, cy, true);
      }
      // 超限特殊处理，先生成画布尺寸大小的纹理然后原始位置绘制
      else if(limitCache) {
        let c = inject.getCacheCanvas(width, height, '__$$OVERSIZE$$__');
        node.render(renderMode, 0, gl);
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
    }
    else {
      let {
        [NODE_OPACITY]: opacity,
        [NODE_MATRIX_EVENT]: matrixEvent,
        [NODE_LIMIT_CACHE]: limitCache,
        [NODE_CACHE]: __cache,
        [NODE_CACHE_FILTER]: __cacheFilter,
        [NODE_CACHE_MASK]: __cacheMask,
        [NODE_CACHE_OVERFLOW]: __cacheOverflow,
        [NODE_REFRESH_LV]: refreshLevel,
        [NODE_COMPUTED_STYLE]: {
          [DISPLAY]: display,
          [VISIBILITY]: visibility,
          [MIX_BLEND_MODE]: mixBlendMode,
        },
      } = __config;
      if(display === 'none') {
        i += (total || 0) + (hasMask || 0);
        continue;
      }
      // 有total的可以直接绘制并跳过子节点索引，忽略total本身，其独占用纹理单元，注意特殊不取cacheTotal，
      // 这种情况发生在只有overflow:hidden声明但无效没有生成__cacheOverflow的情况，
      // 因为webgl纹理单元缓存原因，所以不用cacheTotal防止切换性能损耗
      let target = getCache([__cacheMask, __cacheFilter, __cacheOverflow, __cache]);
      // total和自身cache的尝试
      if(target) {
        let m = mx.m2Mat4(matrixEvent, cx, cy);
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
          i += (total || 0) + (hasMask || 0);
        }
      }
      else if(limitHash.hasOwnProperty(i)) {
        let m = mx.m2Mat4(matrixEvent, cx, cy);
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
        i += (total || 0) + (hasMask || 0);
      }
      // 超限的情况，这里是普通单节点超限，没有合成total后再合成特殊cache如filter/mask/mbm之类的，
      // 直接按原始位置绘制到离屏canvas，再作为纹理绘制即可，特殊的在total那做过降级了
      else if(limitCache && display !== 'none' && visibility !== 'hidden') {
        let m = mx.m2Mat4(matrixEvent, cx, cy);
        let c = inject.getCacheCanvas(width, height, '__$$OVERSIZE$$__');
        node.render(renderMode, refreshLevel, gl);
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

export default {
  renderCacheCanvas,
  renderCanvas,
  renderSvg,
  renderWebgl,
};

