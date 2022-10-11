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
    if(a.lv === b.lv) {
      if(a.idx === b.idx) {
        return a.type - b.type;
      }
      return b.idx - a.idx;
    }
    return b.lv - a.lv;
  });
  list.forEach(item => {
    let { type, offscreen } = item;
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
      ctx = origin;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalAlpha = 1;
      if(width && height) {
        ctx.drawImage(target.canvas, 0, 0, width, height, 0, 0, width, height);
      }
      target.ctx.setTransform(1, 0, 0, 1, 0, 0);
      target.ctx.clearRect(0, 0, width, height);
    }
    else if(type === OFFSCREEN_FILTER) {
      let { target, ctx: origin, filter } = offscreen;
      // 申请一个新的离屏，应用blur并绘制，如没有则降级，默认ctx.filter为'none'
      if(ctx.filter) {
        let apply = inject.getOffscreenCanvas(width, height, null, 'filter2');
        apply.ctx.filter = painter.canvasFilter(filter);
        if(width && height) {
          apply.ctx.drawImage(target.canvas, 0, 0, width, height, 0, 0, width, height);
        }
        apply.ctx.filter = 'none';
        target.ctx.globalAlpha = 1;
        target.ctx.setTransform(1, 0, 0, 1, 0, 0);
        target.ctx.clearRect(0, 0, width, height);
        if(width && height) {
          target.ctx.drawImage(apply.canvas, 0, 0, width, height, 0, 0, width, height);
        }
        apply.ctx.setTransform(1, 0, 0, 1, 0, 0);
        apply.ctx.clearRect(0, 0, width, height);
      }
      // 绘制回主画布，如果不支持则等同无filter原样绘制
      ctx = origin;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalAlpha = 1;
      if(width && height) {
        ctx.drawImage(target.canvas, 0, 0, width, height, 0, 0, width, height);
      }
      target.ctx.setTransform(1, 0, 0, 1, 0, 0);
      target.ctx.globalAlpha = 1;
      target.ctx.clearRect(0, 0, width, height);
    }
    else if(type === OFFSCREEN_MASK) {
      let { mask, isClip } = offscreen;
      if(isClip) {
        ctx = mask.ctx;
        ctx.globalCompositeOperation = 'source-out';
        ctx.globalAlpha = 1;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        if(width && height) {
          ctx.drawImage(offscreen.target.canvas, 0, 0, width, height, 0, 0, width, height);
        }
        ctx.globalCompositeOperation = 'source-over';
        offscreen.target.ctx.setTransform(1, 0, 0, 1, 0, 0);
        offscreen.target.ctx.clearRect(0, 0, width, height);
        ctx = offscreen.ctx;
        ctx.globalAlpha = 1;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        if(width && height) {
          ctx.drawImage(mask.canvas, 0, 0, width, height, 0, 0, width, height);
        }
        mask.ctx.setTransform(1, 0, 0, 1, 0, 0);
        mask.ctx.clearRect(0, 0, width, height);
      }
      else {
        let target = offscreen.target;
        ctx = target.ctx;
        ctx.globalCompositeOperation = 'destination-in';
        ctx.globalAlpha = 1;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        if(width && height) {
          ctx.drawImage(mask.canvas, 0, 0, width, height, 0, 0, width, height);
        }
        ctx.globalCompositeOperation = 'source-over';
        mask.ctx.setTransform(1, 0, 0, 1, 0, 0);
        mask.ctx.clearRect(0, 0, width, height);
        ctx = offscreen.ctx;
        ctx.globalAlpha = 1;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        if(width && height) {
          ctx.drawImage(target.canvas, 0, 0, width, height, 0, 0, width, height);
        }
        target.ctx.setTransform(1, 0, 0, 1, 0, 0);
        target.ctx.clearRect(0, 0, width, height);
      }
    }
    else if(type === OFFSCREEN_BLEND) {
      let target = offscreen.target;
      ctx = offscreen.ctx;
      ctx.globalCompositeOperation = offscreen.mixBlendMode;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalAlpha = 1;
      if(width && height) {
        ctx.drawImage(target.canvas, 0, 0, width, height, 0, 0, width, height);
      }
      ctx.globalCompositeOperation = 'source-over';
      target.ctx.globalAlpha = 1;
      target.ctx.setTransform(1, 0, 0, 1, 0, 0);
      target.ctx.clearRect(0, 0, width, height);
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
