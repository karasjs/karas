import Geom from './Geom';
import mode from '../mode';
import gradient from '../style/gradient';

class Rect extends Geom {
  constructor(tagName, props) {
    super(tagName, props);
  }

  render(renderMode) {
    super.render(renderMode);
    let { rx: x, ry: y, width, height, ctx } = this;
    let {
      originX, originY, display, fill,
      stroke, strokeWidth, strokeDasharray,
      slg, flg, frg } = this.getPreRender();
    if(display === 'none') {
      return;
    }
    if(renderMode === mode.CANVAS) {
      ctx.strokeStyle = slg ? this.getCanvasLg(slg) : stroke;
      ctx.lineWidth = strokeWidth;
      if(flg) {
        ctx.fillStyle = this.getCanvasLg(flg);
      }
      else if(frg) {
        ctx.fillStyle = this.getCanvasRg(frg);
      }
      else {
        ctx.fillStyle = fill;
      }
      ctx.setLineDash(strokeDasharray);
      ctx.beginPath();
      ctx.moveTo(originX, originY);
      ctx.lineTo(originX + width, originY);
      ctx.lineTo(originX + width, originY + height);
      ctx.lineTo(originX, originY + height);
      ctx.lineTo(originX, originY);
      ctx.fill();
      ctx.stroke();
      ctx.closePath();
    }
    else if(renderMode === mode.SVG) {
      if(slg) {
        let uuid = this.getSvgLg(slg);
        stroke = `url(#${uuid})`;
      }
      if(flg) {
        let uuid = this.getSvgLg(flg);
        fill = `url(#${uuid})`;
      }
      else if(frg) {
        let uuid = this.getSvgRg(frg);
        fill = `url(#${uuid})`;
      }
      this.addGeom('rect', [
        ['x', x],
        ['y', y],
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
