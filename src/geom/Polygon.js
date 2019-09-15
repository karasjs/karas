import Geom from './Geom';
import mode from '../node/mode';

class Polygon extends Geom {
  constructor(props) {
    super('$polygon', props);
    // 折线所有点的列表
    this.__pointList = [];
    if(Array.isArray(this.props.pointList)) {
      this.__pointList = this.props.pointList;
    }
    // 原点位置，4个角，默认左下
    if(['TOP_LEFT', 'TOP_RIGHT', 'BOTTOM_LEFT', 'BOTTOM_RIGHT'].indexOf(this.props.origin) > -1) {
      this.__origin = this.props.origin;
    }
    else {
      this.__origin = 'BOTTOM_LEFT';
    }
    // max和min默认取值坐标轴范围[0, 1]，可更改
    if(this.props.min) {
      this.__min = parseFloat(this.props.min) || 0;
    }
    else {
      this.__min = 0;
    }
    if(this.props.max) {
      let max = parseFloat(this.props.max);
      if(isNaN(max)) {
        max = 1;
      }
      this.__max = max;
    }
    else {
      this.__max = 1;
    }
  }

  render() {
    super.render();
    let { x, y, width, height, style, ctx, pointList, max, min, origin } = this;
    if(pointList.length < 2) {
      return;
    }
    for(let i = 0, len = pointList.length; i < len; i++) {
      if(!Array.isArray(pointList[i]) || pointList[i].length < 2) {
        return;
      }
    }
    let {
      display,
      borderTopWidth,
      borderRightWidth,
      borderBottomWidth,
      borderLeftWidth,
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
      paddingTop,
      paddingRight,
      paddingBottom,
      paddingLeft,
      stroke,
      strokeWidth,
    } = style;
    if(display === 'none') {
      return;
    }
    let scale = max - min;
    if(scale <= 0) {
      throw new Error(`scale can not <= 0: max(${this.max}) - min(${this.min})`);
    }
    let originX = x + borderLeftWidth.value + marginLeft.value + paddingLeft.value;
    let originY = y + borderTopWidth.value + marginTop.value + paddingTop.value;
    width -= borderLeftWidth.value + borderRightWidth.value + marginLeft.value + marginRight.value + paddingLeft.value + paddingRight.value;
    height -= borderTopWidth.value + borderBottomWidth.value + marginTop.value + marginBottom.value + paddingTop.value + paddingBottom.value;
    if(origin === 'TOP_LEFT') {
      pointList.forEach(item => {
        item[0] = originX + item[0] * width;
        item[1] = originY + (item[1] - min) * height / scale;
      });
    }
    else if(origin === 'TOP_RIGHT') {
      pointList.forEach(item => {
        item[0] = originX + width - item[0] * width;
        item[1] = originY + (item[1] - min) * height / scale;
      });
    }
    else if(origin === 'BOTTOM_LEFT') {
      pointList.forEach(item => {
        item[0] = originX + item[0] * width;
        item[1] = originY + height - (item[1] - min) * height / scale;
      });
    }
    else if(origin === 'BOTTOM_RIGHT') {
      pointList.forEach(item => {
        item[0] = originX + width - item[0] * width;
        item[1] = originY + height - (item[1] - min) * height / scale;
      });
    }
    if(this.mode === mode.CANVAS) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = strokeWidth;
      ctx.beginPath();
      ctx.moveTo(pointList[0][0], originY + pointList[0][1]);
      for(let i = 1, len = pointList.length; i < len; i++) {
        let point = pointList[i];
        ctx.lineTo(point[0], originY + point[1]);
      }
      ctx.stroke();
      ctx.closePath();
    }
    else if(this.mode === mode.SVG) {
      let points = '';
      for(let i = 0, len = pointList.length; i < len; i++) {
        let point = pointList[i];
        points += `${point[0]},${point[1]} `;
      }
      mode.appendHtml(`<polyline fill="none" points="${points}" stroke-width="${strokeWidth}" stroke="${stroke}"/>`);
    }
  }

  get pointList() {
    return this.__pointList;
  }
}

export default Polygon;
