import Geom from './Geom';
import util from '../util';

class Line extends Geom {
  constructor(props) {
    super(props);
  }
  render() {
    let { x, y, width, height, props, ctx } = this;
    let { max, min, data } = props;
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 1;
    if(util.isNil(max)) {
      max = data[0];
      data.forEach(item => {
        max = Math.max(item, max);
      });
    }
    if(util.isNil(min)) {
      min = data[0];
      data.forEach(item => {
        min = Math.min(item, min);
      });
    }
    if(max < min) {
      throw new Error('max can not less than min');
    }
    let stepX = width / (data.length - 1);
    let stepY = height / (max - min);
    if(max === min) {
      stepY = height;
    }
    let coords = [];
    data.forEach((item, i) => {
      let diff = item - min;
      let rx = i * stepX;
      let ry = height - diff * stepY;
      coords.push([rx, ry + y]);
    });
    let first = coords[0];
    ctx.beginPath();
    ctx.moveTo(first[0], first[1]);
    for(let i = 1; i < coords.length; i++) {
      let item = coords[i];
      ctx.lineTo(item[0], item[1]);
    }
    ctx.stroke();
    ctx.closePath();
  }
}

export default Line;