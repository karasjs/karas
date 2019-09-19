import Geom from './Geom';
import mode from '../mode';

class Circle extends Geom {
  constructor(tagName, props) {
    super(tagName, props);
    // 半径0~1，默认1
    this.__r = 1;
    if(this.props.r) {
      this.__r = parseFloat(this.props.r);
      if(isNaN(this.r)) {
        this.__r = 1;
      }
    }
  }

  render(renderMode) {
    super.render(renderMode);
    let { x, y, width, height, style, ctx, r, virtualDom } = this;
    let {
      display,
      borderTopWidth,
      borderLeftWidth,
      marginTop,
      marginLeft,
      paddingTop,
      paddingLeft,
      stroke,
      strokeWidth,
      strokeDasharray,
      fill,
    } = style;
    if(display === 'none') {
      return;
    }
    let originX = x + borderLeftWidth.value + marginLeft.value + paddingLeft.value;
    let originY = y + borderTopWidth.value + marginTop.value + paddingTop.value;
    originX += width * 0.5;
    originY += height * 0.5;
    r *= Math.min(width, height) * 0.5;
    if(renderMode === mode.CANVAS) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = strokeWidth;
      ctx.fillStyle = fill;
      ctx.setLineDash(strokeDasharray);
      ctx.beginPath();
      ctx.arc(originX, originY, r, 0, 2 * Math.PI);
      if(fill !== 'transparent') {
        ctx.fill();
      }
      if(strokeWidth && stroke !== 'transparent') {
        ctx.stroke();
      }
      ctx.closePath();
    }
    else if(renderMode === mode.SVG) {
      virtualDom.content.push({
        type: 'item',
        tagName: 'circle',
        props: [
          ['cx', originX],
          ['cy', originY],
          ['r', r],
          ['fill', fill],
          ['stroke', stroke],
          ['stroke-width', strokeWidth],
          ['stroke-dasharray', strokeDasharray]
        ],
      });
    }
  }

  get r() {
    return this.__r;
  }
}

export default Circle;
