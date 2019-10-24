import Geom from './Geom';
import mode from '../util/mode';

class Rect extends Geom {
  constructor(tagName, props) {
    super(tagName, props);
  }

  render(renderMode) {
    let { isDestroyed, originX, originY, display, fill, stroke, strokeWidth, strokeDasharray } = super.render(renderMode);
    if(isDestroyed || display === 'none') {
      return;
    }
    let { width, height, ctx } = this;
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
      ctx.lineTo(originX, originY);
      ctx.fill();
      if(strokeWidth > 0) {
        ctx.stroke();
      }
      ctx.closePath();
    }
    else if(renderMode === mode.SVG) {
      this.addGeom('rect', [
        ['x', originX],
        ['y', originY],
        ['width', width],
        ['height', height],
        ['fill', fill],
        ['stroke', stroke],
        ['stroke-width', strokeWidth],
        ['stroke-dasharray', strokeDasharray]
      ]);
    }
  }
}

export default Rect;
