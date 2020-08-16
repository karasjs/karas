import Geom from './Geom';
import mode from '../util/mode';

class Line extends Geom {
  constructor(tagName, props) {
    super(tagName, props);
    // x1,y1和x2,y2表明线段的首尾坐标，control表明控制点坐标
    this.__x1 = this.__y1 = 0;
    this.__x2 = this.__y2 = 1;
    this.__controlA = [];
    this.__controlB = [];
    if(this.props.x1 !== undefined) {
      this.__x1 = parseFloat(this.props.x1) || 0;
    }
    if(this.props.y1 !== undefined) {
      this.__y1 = parseFloat(this.props.y1) || 0;
    }
    if(this.props.x2 !== undefined) {
      this.__x2 = parseFloat(this.props.x2) || 0;
    }
    if(this.props.y2 !== undefined) {
      this.__y2 = parseFloat(this.props.y2) || 0;
    }
    if(Array.isArray(this.props.controlA)) {
      this.__controlA = this.props.controlA;
    }
    if(Array.isArray(this.props.controlB)) {
      this.__controlB = this.props.controlB;
    }
  }

  render(renderMode, ctx, defs) {
    let {
      isDestroyed,
      cache,
      display,
      visibility,
      originX,
      originY,
      stroke,
      strokeWidth,
      strokeDasharray,
      strokeDasharrayStr,
      strokeLinecap,
      strokeLinejoin,
      strokeMiterlimit,
    } = super.render(renderMode, ctx, defs);
    if(isDestroyed || display === 'none' || visibility === 'hidden' || cache) {
      return;
    }
    let { width, height, x1, y1, x2, y2, controlA, controlB, __cacheProps } = this;
    if(__cacheProps.x1 === undefined) {
      x1 = originX + x1 * width;
    }
    if(__cacheProps.x2 === undefined) {
      x2 = originX + x2 * width;
    }
    if(__cacheProps.y1 === undefined) {
      y1 = originY + y1 * height;
    }
    if(__cacheProps.y2 === undefined) {
      y2 = originY + y2 * height;
    }
    if(__cacheProps.controlA === undefined) {
      if(controlA.length === 2) {
        __cacheProps.controlA = [
          originX + controlA[0] * width,
          originY + controlA[1] * height
        ];
      }
      else {
        __cacheProps.controlA = [];
      }
    }
    if(__cacheProps.controlB === undefined) {
      if(controlB.length === 2) {
        __cacheProps.controlB = [
          originX + controlB[0] * width,
          originY + controlB[1] * height
        ];
      }
      else {
        __cacheProps.controlB = [];
      }
    }
    let curve = 0;
    // 控制点，曲线
    let cx1, cy1, cx2, cy2;
    if(__cacheProps.controlA.length === 2) {
      curve++;
      cx1 = __cacheProps.controlA[0];
      cy1 = __cacheProps.controlA[1];
    }
    if(__cacheProps.controlB.length === 2) {
      curve += 2;
      cx2 = __cacheProps.controlB[0];
      cy2 = __cacheProps.controlB[1];
    }
    if(renderMode === mode.CANVAS) {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      if(curve === 3) {
        ctx.bezierCurveTo(cx1, cy1, cx2, cy2, x2, y2);
      }
      else if(curve === 2) {
        ctx.quadraticCurveTo(cx2, cy2, x2, y2);
      }
      else if(curve === 1) {
        ctx.quadraticCurveTo(cx1, cy1, x2, y2);
      }
      else {
        ctx.lineTo(x2, y2);
      }
      if(strokeWidth > 0) {
        ctx.stroke();
      }
      ctx.closePath();
    }
    else if(renderMode === mode.SVG) {
      let d;
      if(curve === 3) {
        d = 'M' + x1 + ',' + y1 + ' C' + cx1 + ',' + cy1 + ' ' + cx2 + ',' + cy2 + ' ' + x2 + ',' + y2;
      }
      else if(curve === 2) {
        d = 'M' + x1 + ',' + y1 + ' Q' + cx2 + ',' + cy2 + ' ' + x2 + ',' + y2;
      }
      else if(curve === 1) {
        d = 'M' + x1 + ',' + y1 + ' Q' + cx1 + ',' + cy1 + ' ' + x2 + ',' + y2;
      }
      else {
        d = 'M' + x1 + ',' + y1 + ' L' + x2 + ',' + y2;
      }
      let props = [
        ['d', d],
        ['fill', 'none'],
        ['stroke', stroke],
        ['stroke-width', strokeWidth]
      ];
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

  get x1() {
    return this.getProps('x1');
  }
  get y1() {
    return this.getProps('y1');
  }
  get x2() {
    return this.getProps('x2');
  }
  get y2() {
    return this.getProps('y2');
  }
  get controlA() {
    return this.getProps('controlA');
  }
  get controlB() {
    return this.getProps('controlB');
  }
}

export default Line;
