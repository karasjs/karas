import Geom from './Geom';
import mode from '../util/mode';

class Polyline extends Geom {
  constructor(tagName, props) {
    super(tagName, props);
    // 所有点的列表
    this.__points = [];
    if(Array.isArray(this.props.points)) {
      this.__points = this.props.points;
    }
    // 控制点
    this.__controls = [];
    if(Array.isArray(this.props.controls)) {
      this.__controls = this.props.controls;
    }
  }

  __getPoints(originX, originY, width, height, points, controls) {
    let pts = [];
    let cls = [];
    let hasControl = false;
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
        hasControl = true;
      }
      else {
        cls.push(null);
      }
    });
    return [pts, cls, hasControl];
  }

  render(renderMode, ctx, defs) {
    let {
      isDestroyed,
      originX,
      originY,
      display,
      visibility,
      fill,
      stroke,
      strokeWidth,
      strokeDasharray,
      strokeDasharrayStr,
      strokeLinecap,
      strokeLinejoin,
      strokeMiterlimit,
    } = super.render(renderMode, ctx, defs);
    if(isDestroyed || display === 'none' || visibility === 'hidden') {
      return;
    }
    let { width, height, points, controls } = this;
    let [pts, cls, hasControl] = this.__getPoints(originX, originY, width, height, points, controls);
    if(points.length < 2) {
      console.error('Points must have at lease 2 item: ' + points);
      return;
    }
    for(let i = 0, len = points.length; i < len; i++) {
      if(!Array.isArray(points[i]) || points[i].length < 2) {
        console.error('Each Point must have a coords: ' + points[i]);
        return;
      }
    }
    if(renderMode === mode.CANVAS) {
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for(let i = 1, len = pts.length; i < len; i++) {
        let point = pts[i];
        let cl = cls[i - 1];
        if(!cl || !cl.length) {
          ctx.lineTo(point[0], point[1]);
        }
        else if(cl.length === 4) {
          ctx.bezierCurveTo(cl[0], cl[1], cl[2], cl[3], point[0], point[1]);
        }
        else {
          ctx.quadraticCurveTo(cl[0], cl[1], point[0], point[1]);
        }
      }
      ctx.fill();
      if(strokeWidth > 0) {
        ctx.stroke();
      }
      ctx.closePath();
    }
    else if(renderMode === mode.SVG) {
      let props = [
        ['fill', fill],
        ['stroke', stroke],
        ['stroke-width', strokeWidth]
      ];
      let tagName;
      if(hasControl) {
        let s = 'M' + pts[0][0] + ',' + pts[0][1];
        for(let i = 1, len = pts.length; i < len; i++) {
          let point = pts[i];
          let cl = cls[i - 1];
          if(!cl || !cl.length) {
            s += 'L' + point[0] + ',' + point[1];
          }
          else if(cl.length === 4) {
            s += 'C' + cl[0] + ',' + cl[1] + ' ' + cl[2] + ',' + cl[3] + ' ' + point[0] + ',' + point[1];
          }
          else {
            s += 'Q' + cl[0] + ',' + cl[1] + ' ' + point[0] + ',' + point[1];
          }
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
          s += point[0] + ',' + point[1];
        }
        props.push(['points', s]);
        tagName = 'polyline';
      }
      if(strokeDasharray.length) {
        props.push(['stroke-dasharray', strokeDasharrayStr]);
      }
      if(strokeLinecap !== 'butt') {
        props.push(['stroke-linecap', strokeLinecap]);
      }
      if(strokeLinejoin !== 'miter') {
        props.push(['stroke-linejoin', strokeLinejoin]);
      }
      if(strokeMiterlimit !== 4) {
        props.push(['stroke-miterlimit', strokeMiterlimit]);
      }
      this.addGeom(tagName, props);
    }
  }

  get points() {
    return this.getProps('points');
  }
  get controls() {
    return this.getProps('controls');
  }
}

export default Polyline;
