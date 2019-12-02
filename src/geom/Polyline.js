import Geom from './Geom';
import mode from '../util/mode';

class Polyline extends Geom {
  constructor(tagName, props) {
    super(tagName, props);
    // 折线所有点的列表
    this.__points = [];
    if(Array.isArray(this.props.points)) {
      this.__points = this.props.points;
    }
    // 原点位置，4个角，默认左下
    if(['TOP_RIGHT', 'BOTTOM_LEFT', 'BOTTOM_RIGHT'].indexOf(this.props.origin) > -1) {
      this.__origin = this.props.origin;
    }
    else {
      this.__origin = 'TOP_LEFT';
    }
    // 控制点
    this.__controls = [];
    if(Array.isArray(this.props.controls)) {
      this.__controls = this.props.controls;
    }
  }

  render(renderMode) {
    let {
      isDestroyed,
      originX,
      originY,
      display,
      visibility,
      stroke,
      strokeWidth,
      strokeDasharray,
      strokeLinecap,
    } = super.render(renderMode);
    if(isDestroyed || display === 'none' || visibility === 'hidden') {
      return;
    }
    let { width, height, ctx, points, controls, origin } = this;
    if(points.length < 2) {
      return;
    }
    for(let i = 0, len = points.length; i < len; i++) {
      if(!Array.isArray(points[i]) || points[i].length < 2) {
        return;
      }
    }
    let pts = [];
    let cls = [];
    let hasControll;
    if(origin === 'TOP_LEFT') {
      points.forEach(item => {
        pts.push([
          originX + item[0] * width,
          originY + item[1] * height
        ]);
      });
      controls.forEach(item => {
        if(Array.isArray(item) && (item.length === 2 || item.length === 4)) {
          let arr = [];
          item.forEach((item2, i) => {
            if(i === 0 || i === 2) {
              arr.push(originX + item[i] * width);
            }
            else {
              arr.push(originY + item[i] * height);
            }
          });
          cls.push(arr);
          hasControll = true;
        }
        else {
          cls.push(null);
        }
      });
    }
    else if(origin === 'TOP_RIGHT') {
      points.forEach(item => {
        pts.push([
          originX + width - item[0] * width,
          originY + item[1] * height
        ]);
      });
      controls.forEach(item => {
        if(Array.isArray(item) && (item.length === 2 || item.length === 4)) {
          let arr = [];
          item.forEach((item2, i) => {
            if(i === 0 || i === 2) {
              arr.push(originX + width - item[i] * width);
            }
            else {
              arr.push(originY + item[i] * height);
            }
          });
          cls.push(arr);
          hasControll = true;
        }
        else {
          cls.push(null);
        }
      });
    }
    else if(origin === 'BOTTOM_LEFT') {
      points.forEach(item => {
        pts.push([
          originX + item[0] * width,
          originY + height - item[1] * height
        ]);
      });
      controls.forEach(item => {
        if(Array.isArray(item) && (item.length === 2 || item.length === 4)) {
          let arr = [];
          item.forEach((item2, i) => {
            if(i === 0 || i === 2) {
              arr.push(originX + item[i] * width);
            }
            else {
              arr.push(originY + height - item[i] * height);
            }
          });
          cls.push(arr);
          hasControll = true;
        }
        else {
          cls.push(null);
        }
      });
    }
    else if(origin === 'BOTTOM_RIGHT') {
      points.forEach(item => {
        pts.push([
          originX + width - item[0] * width,
          originY + height - item[1] * height
        ]);
      });
      controls.forEach(item => {
        if(Array.isArray(item) && (item.length === 2 || item.length === 4)) {
          let arr = [];
          item.forEach((item2, i) => {
            if(i === 0 || i === 2) {
              arr.push(originX + width - item[i] * width);
            }
            else {
              arr.push(originY + height - item[i] * height);
            }
          });
          cls.push(arr);
          hasControll = true;
        }
        else {
          cls.push(null);
        }
      });
    }
    if(renderMode === mode.CANVAS) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = strokeWidth;
      ctx.lineCap = strokeLinecap;
      ctx.setLineDash(strokeDasharray.split(','));
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for(let i = 1, len = pts.length; i < len; i++) {
        let point = pts[i];
        let cl = cls[i - 1];
        if(!cl) {
          ctx.lineTo(point[0], point[1]);
        }
        else if(cl.length === 4) {
          ctx.bezierCurveTo(cl[0], cl[1], cl[2], cl[3], point[0], point[1]);
        }
        else {
          ctx.quadraticCurveTo(cl[0], cl[1], point[0], point[1]);
        }
      }
      if(strokeWidth > 0) {
        ctx.stroke();
      }
      ctx.closePath();
    }
    else if(renderMode === mode.SVG) {
      let props = [
        ['fill', 'none'],
        ['stroke', stroke]
      ];
      let tagName;
      if(hasControll) {
        let s = `M${pts[0][0]},${pts[0][1]}`;
        for(let i = 1, len = pts.length; i < len; i++) {
          let point = pts[i];
          let cl = cls[i - 1];
          if(!cl) {
            s += `L${point[0]},${point[1]}`;
          }
          else if(cl.length === 4) {
            s += `C${cl[0]},${cl[1]} ${cl[2]},${cl[3]} ${point[0]},${point[1]}`;
          }
          else {
            s += `Q${cl[0]},${cl[1]} ${point[0]},${point[1]}`;
          }
        }
        let cl = cls[pts.length - 1];
        if(!cl) {
          s += `L${pts[0][0]},${pts[0][1]}`;
        }
        else if(cl.length === 4) {
          s += `C${cl[0]},${cl[1]} ${cl[2]},${cl[3]} ${pts[0][0]},${pts[0][1]}`;
        }
        else {
          s += `Q${cl[0]},${cl[1]} ${pts[0][0]},${pts[0][1]}`;
        }
        props.push(['d', s]);
        tagName = 'path';
      }
      else {
        let s = '';
        for(let i = 0, len = pts.length; i < len; i++) {
          let point = pts[i];
          if(i) {
            s += ' ';
          }
          s += `${point[0]},${point[1]}`;
        }
        props.push(['points', s]);
        tagName = 'polyline';
      }
      if(strokeDasharray.length) {
        props.push(['stroke-dasharray', strokeDasharray]);
      }
      if(strokeLinecap !== 'butt') {
        props.push(['stroke-linecap', strokeLinecap]);
      }
      this.addGeom(tagName, props);
    }
  }

  get points() {
    return this.__points;
  }
  get controls() {
    return this.__controls;
  }
  get origin() {
    return this.__origin;
  }
}

export default Polyline;
