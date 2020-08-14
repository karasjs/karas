import Geom from './Geom';
import mode from '../util/mode';
import draw from '../util/draw';

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
    return points.map((item, i) => {
      let res = [
        originX + item[0] * width,
        originY + item[1] * height,
      ];
      let cp = controls[i];
      if(Array.isArray(cp) && (cp.length === 2 || cp.length === 4)) {
        cp.forEach((item, i) => {
          if(i === 0 || i === 2) {
            res.push(originX + item * width);
          }
          else {
            res.push(originY * item * height);
          }
        });
      }
      return res;
    });
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
    let { width, height, points, controls, __cacheProps } = this;
    if(__cacheProps.points === undefined && __cacheProps.controls === undefined) {
      __cacheProps.points = __cacheProps.controls = this.__getPoints(originX, originY, width, height, points, controls);
    }
    if(__cacheProps.points.length < 2) {
      console.error('Points must have at lease 2 item: ' + points);
      return;
    }
    for(let i = 0, len = __cacheProps.points.length; i < len; i++) {
      let item = __cacheProps.points[i];
      if(!Array.isArray(item) || item.length < 2) {
        console.error('Each Point must have a coords: ' + item);
        return;
      }
    }
    if(renderMode === mode.CANVAS) {
      draw.genCanvasPolygon(ctx, __cacheProps.points);
      if(strokeWidth > 0) {
        ctx.stroke();
      }
    }
    else if(renderMode === mode.SVG) {
      let props = [
        ['fill', fill],
        ['stroke', stroke],
        ['stroke-width', strokeWidth]
      ];
      let d = draw.genSvgPolygon(__cacheProps.points);
      props.push(['d', d]);
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
      this.addGeom('path', props);
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
