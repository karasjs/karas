import Geom from './Geom';
import mode from '../node/mode';

class Polygon extends Geom {
  constructor(props) {
    super('$polygon', props);
    this.__pointList = [];
    if(Array.isArray(this.props.pointList)) {
      this.__pointList = this.props.pointList;
    }
  }

  render() {
    super.render();
    let { x, y, width, height, style, ctx, pointList } = this;
    let {
      borderTopWidth,
      borderLeftWidth,
      stroke,
      strokeWidth,
    } = style;
    let originX = x + borderLeftWidth.value;
    let originY = y + borderTopWidth.value;
    if(mode.isCanvas()) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = strokeWidth;
      ctx.beginPath();
      ctx.moveTo(originX + pointList[0][0] * width, originY + pointList[0][1] * height);
      for(let i = 1, len = pointList.length; i < len; i++) {
        let point = pointList[i];
        ctx.lineTo(originX + point[0] * width, originY + point[1] * height);
      }
      ctx.stroke();
      ctx.closePath();
    }
    else if(mode.isSvg()) {
      let points = '';
      for(let i = 0, len = pointList.length; i < len; i++) {
        let point = pointList[i];
        points += `${originX + point[0] * width},${originY + point[1] * height} `;
      }
      mode.appendHtml(`<polyline fill="none" points="${points}" stroke-width="${strokeWidth}" stroke="${stroke}"/>`);
    }
  }

  get pointList() {
    return this.__pointList;
  }
}

export default Polygon;
