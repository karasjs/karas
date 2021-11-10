import inject from '../util/inject';
import painter from '../util/painter';

const { canvasPolygon } = painter;

// 无cache时应用离屏时的优先级，从小到大，OFFSCREEN_MASK2是个特殊的
const OFFSCREEN_OVERFLOW = 0;
const OFFSCREEN_FILTER = 1;
const OFFSCREEN_MASK = 2;
const OFFSCREEN_BLEND = 3;
const OFFSCREEN_MASK2 = 4;

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
      let { matrix, target, ctx: origin, x, y, offsetWidth, offsetHeight, list } = offscreen;
      ctx.globalCompositeOperation = 'destination-in';
      ctx.globalAlpha = 1;
      ctx.setTransform(matrix[0], matrix[1], matrix[4], matrix[5], matrix[12], matrix[13]);
      ctx.fillStyle = '#FFF';
      ctx.beginPath();
      if(list) {
        canvasPolygon(ctx, list);
      }
      else {
        ctx.rect(x, y, offsetWidth, offsetHeight);
      }
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
        let apply = inject.getCacheCanvas(width, height, null, 'filter');
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

export default {
  OFFSCREEN_OVERFLOW,
  OFFSCREEN_FILTER,
  OFFSCREEN_MASK,
  OFFSCREEN_BLEND,
  OFFSCREEN_MASK2,
  applyOffscreen,
};
