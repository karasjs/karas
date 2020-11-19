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
      for(let i = index + 1, len = i + (top.total || 0); i < len; i++) {
        let { node, total, node: { __cacheTotal, computedStyle: { display } } } = structs[i];
        // 子节点从开始到最后形成单链表
        let obj = { i };
        if(!first) {
          first = obj;
        }
        if(last) {
          obj.p = last;
        }
        last = obj;
        if(node instanceof Text || !total) {
          continue;
        }
        // 不可见和遗留有total缓存的跳过
        if(display === 'none' || __cacheTotal && __cacheTotal.available) {
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
  let { __sx1: sx1, __sy1: sy1, __cache: cache, __blurValue: blurValue } = node;
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
    index: blurValue,
  };
  opacityHash[index] = 1;
  while(list.length) {
    list.splice(0).forEach(parentIndex => {
      let total = __structs[parentIndex].total;
      for(let i = parentIndex + 1, len = parentIndex + (total || 0) + 1; i < len; i++) {
        let { node: { __cacheTotal, __cache, __blurValue, __sx1, __sy1,
          computedStyle: { display, visibility, transform, transformOrigin, opacity } },
          node, total } = __structs[i];
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
          let blur = (blurHash[parentIndex] || 0) + __blurValue;
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
  return bboxTotal;
}

function mergeBbox(bbox, t) {
  bbox[0] = Math.min(bbox[0], t[0]);
  bbox[1] = Math.min(bbox[1], t[1]);
  bbox[2] = Math.max(bbox[2], t[2]);
  bbox[3] = Math.max(bbox[3], t[3]);
}

function genTotal(renderMode, defs, node, lv, index, total, __structs, cacheTop, cache) {
  // 存每层父亲的matrix和opacity和index，bbox计算过程中生成，缓存给下面渲染过程用
  let parentIndexHash = {};
  let matrixHash = {};
  let opacityHash = {};
  let bboxTotal = genBboxTotal(node, __structs, index, total, parentIndexHash, opacityHash);
  if(cacheTop) {
    cacheTop.reset(bboxTotal);
  }
  else {
    cacheTop = node.__cacheTotal = Cache.getInstance(bboxTotal);
  }
  // 创建失败，再次降级
  if(!cacheTop || !cacheTop.enabled) {
    console.error('Downgrade to no cache mode for cache-total error');
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
    let { node, total, node: { __cacheMask, __cacheFilter, __cacheTotal, __cache,
      computedStyle: { display, visibility, transform, transformOrigin } } } = __structs[i];
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
      node.render(renderMode, 0, ctx, defs, tx - sx1 + dbx, ty - sy1 + dby);
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
      let target = __cacheMask || __cacheFilter;
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
  if(cache && cache.available) {
    return node.__cacheFilter = Cache.genOffScreenBlur(cache, v);
  }
}

function genMask(node, cache, isFilter) {
  if(cache && cache.available || isFilter) {
    let { transform, transformOrigin } = node.computedStyle;
    return node.__cacheMask = Cache.drawMask(cache, node.next, transform, transformOrigin);
  }
}

function renderCacheCanvas(renderMode, ctx, defs, root) {
  let { __structs } = root;
  let originCtx = ctx;
  // 栈代替递归，存父节点的matrix/opacity，matrix为E时存null省略计算
  let matrixList = [];
  let parentMatrix;
  let opacityList = [];
  let parentOpacity = 1;
  let lastList = [];
  let last;
  let lastLv = 0;
  // 先一遍先序遍历每个节点绘制到自己__cache上，排除Text和缓存和局部根缓存，lv的变化根据大小相等进行初入栈parent操作
  for(let i = 0, len = __structs.length; i < len; i++) {
    let item = __structs[i];
    let { node, node: { __cacheTotal, __cache, __refreshLevel }, total, lv } = item;
    // 排除Text
    if(node instanceof Text) {
      continue;
    }
    // lv变大说明是child，相等是sibling，变小可能是parent或另一棵子树，Root节点第一个特殊处理
    if(i === 0) {
      lastList.push(node);
    }
    else if(lv > lastLv) {
      parentMatrix = last.__matrixEvent;
      if(mx.isE(parentMatrix)) {
        parentMatrix = null;
      }
      matrixList.push(parentMatrix);
      parentOpacity = last.__opacity;
      opacityList.push(parentOpacity);
      lastList.push(node);
    }
    else if(lv < lastLv) {
      let diff = lastLv - lv;
      matrixList.splice(-1, diff);
      parentMatrix = matrixList[lv];
      opacityList.splice(-1, diff);
      parentOpacity = opacityList[lv];
      lastList.splice(-1, diff);
      last = lastList[lv];
    }
    // lv<REPAINT，肯定有__cache，跳过渲染过程，快速运算
    if(__refreshLevel < level.REPAINT) {
      let { currentStyle, computedStyle } = node;
      if(level.contain(__refreshLevel, level.TRANSFORM_ALL)) {
        let { __cacheStyle, currentStyle } = node;
        let matrix = node.__matrix = node.__calMatrix(__refreshLevel, __cacheStyle, currentStyle, computedStyle);
        if(parentMatrix) {
          matrix = mx.multiply(parentMatrix, matrix);
        }
        node.__matrixEvent = matrix;
      }
      if(level.contain(__refreshLevel, level.OPACITY)) {
        let opacity = computedStyle.opacity = currentStyle.opacity;
        node.__opacity = parentOpacity * opacity;
      }
      if(level.contain(__refreshLevel, level.FILTER)) {
        let filter = computedStyle.filter = currentStyle.filter;
        node.__blurValue = 0;
        if(Array.isArray(filter)) {
          filter.forEach(item => {
            let [k, v] = item;
            if(k === 'blur') {
              node.__blurValue = v;
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
        if(!__cache.enabled) {
          console.error('Downgrade to no cache mode for cache-filter error');
          root.cache = false;
          return renderCanvas(renderMode, originCtx, defs, root);
        }
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
      let res;
      if(node instanceof Geom) {
        res = node.__renderSelfData = node.__renderSelf(renderMode, __refreshLevel, ctx, defs, true);
        if(node.__cache && node.__cache.available) {
          node.render(renderMode, __refreshLevel, node.__cache.ctx, defs, true);
        }
      }
      else {
        res = node.render(renderMode, __refreshLevel, ctx, defs, true);
      }
      // 离屏错误需整体降级无cache方案，并不再启用
      if(res.cacheError) {
        console.error('Downgrade to no cache mode for cache error');
        root.cache = false;
        return renderCanvas(renderMode, originCtx, defs, root);
      }
    }
    last = node;
    lastLv = lv;
  }
  // 根据修剪的树形成LRD
  let lrd = genLRD(__structs);
  /**
   * 再后序遍历进行__cacheTotal合并，统计节点个数，有total的视为1个，排除掉Root和Text，
   * 在这个过程中，注意层级lv的变化，因为一个节点清除total后其所有父节点肯定也会清除，形成一条顶到底链路，
   * 所以比上次lv小的一定是上个节点的parent，大于的一定是另一条链路，相等一定是sibling
   * 过程中向上和平向可累计次数，另一条链路归零重新统计，mask改变一定会包含sibling的target
   */
  if(lrd.length > 1) {
    const NUM = Math.max(1, Cache.NUM);
    let prevLv = lrd[0].lv, count = 0;
    for(let i = 0, len = lrd.length - 1; i < len; i++) {
      let {
        node: {
          computedStyle: { position, display, visibility },
          __cacheFilter, __cacheMask, __cacheTotal, __cache, __blurValue,
        },
        node, lv, index, total, hasMask,
      } = __structs[lrd[i]];
      if(display === 'none' || visibility === 'hidden') {
        prevLv = lv;
        continue;
      }
      if(node instanceof Text) {
        prevLv = lv;
        count++;
        continue;
      }
      // relative/absolute强制开启total
      let focus = position === 'relative' || position === 'absolute' || hasMask || __blurValue > 0;
      if(focus) {
        prevLv = lv;
        count = 1;
      }
      // >是父节点
      else if(lv > prevLv) {
        prevLv = lv;
        count++;
        // 当>临界值时，进行cacheTotal合并
        if(count >= NUM) {
          count = 1;
          focus = true;
        }
      }
      // <是Root的另一条链路，忽略掉重新开始，之前是上个链路，到Root了都不满足合并条件
      else if(lv < prevLv) {
        prevLv = lv;
        count = 1;
      }
      // 相等同级继续增加计数
      else {
        count++;
      }
      if(focus) {
        // 有老的直接使用，没有才重新生成
        if(__cacheTotal && __cacheTotal.available) {
          continue;
        }
        __cacheTotal = node.__cacheTotal
          = genTotal(renderMode, defs, node, lv, index, total, __structs, __cacheTotal, __cache);
        if(!__cacheTotal) {
          root.cache = false;
          return renderCanvas(renderMode, originCtx, defs, root);
        }
        if(__blurValue > 0 && !__cacheFilter) {
          genFilter(node, __cacheTotal && __cacheTotal.available
            ? __cacheTotal : __cache, __blurValue);
        }
        if(hasMask && !__cacheMask) {
          __cacheMask = genMask(node, __cacheFilter
            || (__cacheTotal && __cacheTotal.available
              ? __cacheTotal : __cache), __cacheFilter);
        }
      }
    }
  }
  // 最后先序遍历一次应用__cacheTotal即可，没有的用__cache，以及剩下的Text
  for(let i = 0, len = __structs.length; i < len; i++) {
    let {
      node, total, hasMask, node: {
        __cacheMask, __cacheFilter, __cacheTotal, __cache,
        computedStyle: { display, visibility },
      },
    } = __structs[i];
    if(display === 'none') {
      i += (total || 0);
      continue;
    }
    if(visibility === 'hidden') {
      continue;
    }
    if(node instanceof Text) {
      let { __opacity, matrixEvent, __refreshLevel } = node.parent;
      ctx.globalAlpha = __opacity;
      ctx.setTransform(matrixEvent[0], matrixEvent[1], matrixEvent[2], matrixEvent[3], matrixEvent[4], matrixEvent[5]);
      node.render(renderMode, __refreshLevel, ctx, defs);
    }
    else {
      let hasTotal = __cacheMask || __cacheFilter || __cacheTotal && __cacheTotal.available;
      if(hasTotal) {
        i += (total || 0);
      }
      // 无内容Xom会没有__cache
      let target = __cacheMask || __cacheFilter;
      if(!target) {
        target = __cacheTotal && __cacheTotal.available ? __cacheTotal : null;
      }
      if(!target) {
        target = __cache && __cache.available ? __cache : null;
      }
      if(target) {
        if(hasMask) {
          i += hasMask;
        }
        let { __opacity, matrixEvent } = node;
        ctx.globalAlpha = __opacity;
        ctx.setTransform(matrixEvent[0], matrixEvent[1], matrixEvent[2], matrixEvent[3], matrixEvent[4], matrixEvent[5]);
        let { coords: [x, y], canvas, sx1, sy1, dbx, dby, width, height } = target;
        ctx.drawImage(canvas, x - 1, y - 1, width, height, sx1 - 1 - dbx, sy1 - 1 - dby, width, height);
      }
    }
  }
}

function renderCanvas(renderMode, ctx, defs, root) {
  let { __structs, width, height } = root;
  let filterHash = {};
  let maskStartHash = {};
  let maskEndHash = {};
  for(let i = 0, len = __structs.length; i < len; i++) {
    let item = __structs[i];
    let { node, total, hasMask } = item;
    if(maskStartHash.hasOwnProperty(i)) {
      ctx = maskStartHash[i].ctx;
    }
    if(hasMask) {
      let j = i + (total || 0) + 1;
      let content = inject.getCacheCanvas(width, height, '__$$mask1$$__');
      let mask = inject.getCacheCanvas(width, height, '__$$mask2$$__');
      maskStartHash[j] = mask;
      // 虽然目前只有Geom单节点，但未来可能出现Dom作为mask
      while(hasMask--) {
        j += (__structs[j].total || 0) + 1;
      }
      maskEndHash[j - 1] = {
        ctx,
        content,
        mask,
      };
      ctx = content.ctx;
    }
    let res;
    if(node instanceof Geom) {
      res = node.__renderSelfData = node.__renderSelf(renderMode, node.__refreshLevel, ctx, defs);
    }
    else {
      res = node.render(renderMode, node.__refreshLevel, ctx, defs);
    }
    let { computedStyle: { display, visibility } } = node;
    if(display === 'none') {
      i += (total || 0);
      continue;
    }
    if(visibility === 'hidden') {
      continue;
    }
    let { offScreen } = res;
    // filter造成的离屏，需要将后续一段孩子节点区域的ctx替换，并在结束后应用结果，再替换回来
    if(offScreen) {
      let j = i + (total || 0);
      let list = filterHash[j] = filterHash[j] || [];
      // 逆序存，应用时先自己后parent
      list.unshift(offScreen);
      ctx = offScreen.target.ctx;
    }
    if(node instanceof Geom) {
      node.render(renderMode, node.__refreshLevel, ctx, defs);
    }
    // 最后一个节点检查filter，有则应用，可能有多个包含自己
    if(filterHash.hasOwnProperty(i)) {
      let list = filterHash[i];
      list.forEach(offScreen => {
        let webgl = inject.getCacheWebgl(width, height, '__$$blur$$__');
        let t = blur.gaussBlur(offScreen.target, webgl, offScreen.blur, width, height);
        offScreen.ctx.drawImage(offScreen.target.canvas, 0, 0);
        offScreen.target.draw();
        t.clear();
        ctx = offScreen.ctx;
      });
    }
    // mask在filter后面，先应用filter后再mask
    if(maskEndHash.hasOwnProperty(i)) {
      let { ctx: origin, content, mask } = maskEndHash[i];
      ctx = content.ctx;
      ctx.globalCompositeOperation = 'destination-in';
      ctx.globalAlpha = 1;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.drawImage(mask.canvas, 0, 0);
      mask.draw(ctx);
      ctx.globalCompositeOperation = 'source-over';
      // mask.ctx.clearRect(0, 0, width, height);
      ctx = origin;
      ctx.globalAlpha = 1;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.drawImage(content.canvas, 0, 0);
      content.draw(ctx);
      // content.ctx.clearRect(0, 0, width, height);
    }
  }
}

function renderSvg(renderMode, ctx, defs, root) {
  let { __structs } = root;
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
    let { node, node: { __cacheTotal, __refreshLevel }, total, lv, hasMask } = item;
    if(hasMask) {
      let start = i + (total || 0) + 1;
      let end = start + hasMask;
      // svg限制了只能Geom单节点，不可能是Dom
      maskHash[end - 1] = {
        index: i,
        start,
        end,
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
    if(__refreshLevel < level.REPAINT) {
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
      if(level.contain(__refreshLevel, level.TRANSFORM_ALL)) {
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
      if(level.contain(__refreshLevel, level.OPACITY)) {
        let opacity = computedStyle.opacity = currentStyle.opacity;
        if(opacity === 1) {
          delete virtualDom.opacity;
        }
        else {
          virtualDom.opacity = opacity;
        }
      }
      if(level.contain(__refreshLevel, level.FILTER)) {
        let filter = computedStyle.filter = currentStyle.filter;
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
      virtualDom.lv = __refreshLevel;
    }
    else {
      if(node instanceof Geom) {
        node.__renderSelfData = node.__renderSelf(renderMode, __refreshLevel, ctx, defs);
      }
      node.render(renderMode, __refreshLevel, ctx, defs);
      virtualDom = node.virtualDom;
    }
    let { computedStyle: { display } } = node;
    if(display === 'none') {
      i += (total || 0);
      lastLv = lv;
      last = node;
      continue;
    }
    if(maskHash.hasOwnProperty(i)) {
      let { index, start, end } = maskHash[i];
      let target = __structs[index];
      let dom = target.node;
      let mChildren = [], has;
      for(let j = start; j < end; j++) {
        let node = __structs[j].node;
        let { computedStyle: { display, visibility }, virtualDom: { children } } = node;
        if(display !== 'none' && visibility !== 'hidden') {
          mChildren = mChildren.concat(children);
          for(let k = 0, len = children.length; k < len; k++) {
            let { tagName, props } = children[k];
            if(tagName === 'path') {
              let matrix = node.renderMatrix;
              let inverse = mx.inverse(dom.renderMatrix);
              matrix = mx.multiply(matrix, inverse);
              let len = props.length;
              // 防止遮罩为空
              if(!has) {
                for(let l = 0; l < len; l++) {
                  let [k, v] = props[l];
                  if(k === 'd' && v) {
                    has = true;
                  }
                }
              }
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
        if(has) {
          let id = defs.add({
            tagName: 'mask',
            props: [],
            children: mChildren,
          });
          id = 'url(#' + id + ')';
          dom.virtualDom.mask = id;
        }
      }
    }
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

