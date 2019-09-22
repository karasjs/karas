import Geom from './Geom';
import mode from '../mode';

class Rect extends Geom {
  constructor(tagName, props) {
    super(tagName, props);
  }

  render(renderMode) {
    super.render(renderMode);
    let { rx: x, ry: y, width, height, mlw, mtw, plw, ptw, style, ctx, virtualDom } = this;
    let {
      display,
      borderTopWidth,
      borderLeftWidth,
      stroke,
      strokeWidth,
      strokeDasharray,
      fill,
    } = style;
    if(display === 'none') {
      return;
    }
    let originX = x + borderLeftWidth.value + mlw + plw;
    let originY = y + borderTopWidth.value + mtw + ptw;
    if(renderMode === mode.CANVAS) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = strokeWidth;
      ctx.fillStyle = fill;
      ctx.setLineDash(strokeDasharray);
      ctx.beginPath();
      ctx.moveTo(originX, originY);
      ctx.lineTo(originX + width, originY);
      ctx.lineTo(originX + width, originY + height);
      ctx.lineTo(originX, originY + height);
      ctx.fill();
      if(strokeWidth && stroke !== 'transparent') {
        ctx.stroke();
      }
      ctx.closePath();
    }
    else if(renderMode === mode.SVG) {
      virtualDom.content.push({
        type: 'item',
        tagName: 'rect',
        props: [
          ['x', x],
          ['y', y],
          ['width', width],
          ['height', height],
          ['fill', fill],
          ['stroke', stroke],
          ['stroke-width', strokeWidth],
          ['stroke-dasharray', strokeDasharray]
        ],
      });
    }
  }
}

export default Rect;
