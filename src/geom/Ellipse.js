import Geom from './Geom';
import mode from '../node/mode';

class Ellipse extends Geom {
  constructor(props) {
    super('$ellipse', props);
    // 半径0~1，默认1
    this.__rx = 1;
    if(this.props.rx) {
      this.__rx = parseFloat(this.props.rx);
      if(isNaN(this.rx)) {
        this.__rx = 1;
      }
    }
    this.__ry = 1;
    if(this.props.ry) {
      this.__ry = parseFloat(this.props.ry);
      if(isNaN(this.rx)) {
        this.__ry = 1;
      }
    }
  }

  render() {
    super.render();
    let { x, y, width, height, style, ctx, rx, ry, dash } = this;
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
      fill,
    } = style;
    if(display === 'none') {
      return;
    }
    let originX = x + borderLeftWidth.value + marginLeft.value + paddingLeft.value;
    let originY = y + borderTopWidth.value + marginTop.value + paddingTop.value;
    originX += width * 0.5;
    originY += height * 0.5;
    rx *= width * 0.5;
    ry *= height * 0.5;
    if(this.mode === mode.CANVAS) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = strokeWidth;
      ctx.fillStyle = fill;
      ctx.setLineDash(dash);
      ctx.beginPath();
      ctx.moveTo(originX, originY);
      ctx.ellipse && ctx.ellipse(originX, originY, rx, ry, 0, 0, 2 * Math.PI);
      ctx.fill();
      if(strokeWidth && stroke !== 'transparent') {
        ctx.stroke();
      }
      ctx.closePath();
    }
    else if(this.mode === mode.SVG) {
      mode.appendHtml(`<ellipse cx="${originX}" cy="${originY}" rx="${rx}" ry="${ry}" fill="${fill}" stroke-width="${strokeWidth}" stroke="${stroke}"/>`);
    }
  }

  get rx() {
    return this.__rx;
  }
  get ry() {
    return this.__ry;
  }
}

export default Ellipse;
