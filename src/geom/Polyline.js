import Geom from './Geom';
import mode from '../node/mode';

class Polyline extends Geom {
  constructor(props) {
    super('$polygon', props);
    // 折线所有点的列表
    this.__points = [];
    if(Array.isArray(this.props.points)) {
      this.__points = this.props.points;
    }
    // 原点位置，4个角，默认左下
    if(['TOP_LEFT', 'TOP_RIGHT', 'BOTTOM_LEFT', 'BOTTOM_RIGHT'].indexOf(this.props.origin) > -1) {
      this.__origin = this.props.origin;
    }
    else {
      this.__origin = 'BOTTOM_LEFT';
    }
  }

  render() {
    super.render();
    let { x, y, width, height, style, ctx, points, origin, dash } = this;
    if(points.length < 2) {
      return;
    }
    for(let i = 0, len = points.length; i < len; i++) {
      if(!Array.isArray(points[i]) || points[i].length < 2) {
        return;
      }
    }
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
    } = style;
    if(display === 'none') {
      return;
    }
    let originX = x + borderLeftWidth.value + marginLeft.value + paddingLeft.value;
    let originY = y + borderTopWidth.value + marginTop.value + paddingTop.value;
    let pts = this.__pts = [];
    if(origin === 'TOP_LEFT') {
      points.forEach(item => {
        pts.push([
          originX + item[0] * width,
          originY + item[1] * height
        ]);
      });
    }
    else if(origin === 'TOP_RIGHT') {
      points.forEach(item => {
        pts.push([
          originX + width - item[0] * width,
          originY + item[1] * height
        ]);
      });
    }
    else if(origin === 'BOTTOM_LEFT') {
      points.forEach(item => {
        pts.push([
          originX + item[0] * width,
          originY + height - item[1] * height
        ]);
      });
    }
    else if(origin === 'BOTTOM_RIGHT') {
      points.forEach(item => {
        pts.push([
          originX + width - item[0] * width,
          originY + height - item[1] * height
        ]);
      });
    }
    if(this.mode === mode.CANVAS) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = strokeWidth;
      ctx.setLineDash(dash);
      ctx.beginPath();
      ctx.moveTo(pts[0][0], originY + pts[0][1]);
      for(let i = 1, len = pts.length; i < len; i++) {
        let point = pts[i];
        ctx.lineTo(point[0], point[1]);
      }
      if(strokeWidth && stroke !== 'transparent') {
        ctx.stroke();
      }
      ctx.closePath();
    }
    else if(this.mode === mode.SVG) {
      let points = '';
      for(let i = 0, len = pts.length; i < len; i++) {
        let point = pts[i];
        points += `${point[0]},${point[1]} `;
      }
      mode.appendHtml(`<polyline fill="none" points="${points}" stroke-width="${strokeWidth}" stroke="${stroke}"/>`);
    }
  }

  getPointsByX(x) {
    let min = Infinity;
    let len = this.__pts.length;
    let res = [];
    for(let i = 0; i < len; i++) {
      let diff = Math.abs(this.__pts[i][0] - x);
      if(diff < min) {
        min = diff;
      }
    }
    for(let i = 0; i < len; i++) {
      let diff = Math.abs(this.__pts[i][0] - x);
      if(diff === min) {
        res.push({
          index: i,
          x: this.__pts[i][0],
          y: this.__pts[i][1],
        });
      }
    }
    return res;
  }

  get points() {
    return this.__points;
  }
  get origin() {
    return this.__origin;
  }
}

export default Polyline;
