import border from './border';
import transform from './transform';
import mx from '../math/matrix';
import mode from '../node/mode';
import painter from '../util/painter';
import util from '../util/util';

const { joinArr } = util;
const { canvasPolygon, svgPolygon } = painter;

function renderBgc(xom, renderMode, ctx, defs, color, x, y, w, h, btlr, btrr, bbrr, bblr, method = 'fill') {
  // radial渐变ellipse形状会有matrix，用以从圆缩放到椭圆
  let matrix, cx, cy;
  if(Array.isArray(color)) {
    matrix = color[1];
    cx = color[2];
    cy = color[3];
    color = color[0];
  }
  // border-radius使用三次贝塞尔曲线模拟1/4圆角，误差在[0, 0.000273]之间
  let list = border.calRadius(x, y, w, h, btlr, btrr, bbrr, bblr);
  if(!list) {
    list = [
      [x, y],
      [x + w, y],
      [x + w, y + h],
      [x, y + h],
      [x, y],
    ];
  }
  // 椭圆有matrix，用逆矩阵变化点来完成
  if(matrix) {
    let tfo = [cx, cy];
    matrix = transform.calMatrixByOrigin(matrix, tfo);
    let t = mx.inverse(matrix);
    list = list.map(item => {
      if(!item || !item.length) {
        return null;
      }
      let arr = [];
      for(let i = 0, len = item.length; i < len; i += 2) {
        let p = mx.calPoint([item[i], item[i + 1]], t);
        arr.push(p[0]);
        arr.push(p[1]);
      }
      return arr;
    });
  }
  if(renderMode === mode.CANVAS) {
    if(matrix) {
      ctx.save();
      let me = xom.matrixEvent;
      matrix = mx.multiply(me, matrix);
      ctx.setTransform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);
    }
    ctx.beginPath();
    if(ctx.fillStyle !== color) {
      ctx.fillStyle = color;
    }
    canvasPolygon(ctx, list);
    ctx[method]();
    ctx.closePath();
    if(matrix) {
      ctx.restore();
    }
  }
  else if(renderMode === mode.SVG) {
    let d = svgPolygon(list);
    xom.virtualDom.bb.push({
      type: 'item',
      tagName: 'path',
      props: [
        ['d', d],
        ['fill', color],
      ],
    });
    // 椭圆渐变独有
    if(matrix) {
      let bb = xom.virtualDom.bb;
      bb[bb.length - 1].props.push(['transform', `matrix(${joinArr(matrix, ',')})`]);
    }
  }
}

export default {
  renderBgc,
};
