import border from './border';
import transform from './transform';
import mx from '../math/matrix';
import mode from '../node/mode';
import painter from '../util/painter';
import util from '../util/util';
import enums from '../util/enums';
import TextBox from '../node/TextBox';

const { joinArr } = util;
const { canvasPolygon, svgPolygon } = painter;
const {
  STYLE_KEY: {
    MARGIN_RIGHT,
    PADDING_RIGHT,
    BORDER_RIGHT_WIDTH,
  },
} = enums;

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

/**
 * 获取inline的每一行内容的矩形坐标4个点，同时附带上border的矩形，比前面4个点尺寸大或相等（有无border/padding）
 * @param xom
 * @param contentBoxList
 * @param start
 * @param end
 * @param lineBox
 * @param baseLine
 * @param lineHeight
 * @param diffL
 * @param eyt y方向根据bgClip的扩展，影响bg渲染位置计算
 * @param eyb
 * @param pbl x方向padding+border的尺寸，影响border渲染位置计算
 * @param pbr
 * @param pbt y方向padding+border
 * @param pbb
 * @param isStart
 * @param isEnd
 * @returns {(*|number)[]}
 */
function getInlineBox(xom, contentBoxList, start, end, lineBox, baseLine, lineHeight, diffL,
                      eyt, eyb, pbl, pbr, pbt, pbb, isStart, isEnd) {
  let diff = lineBox.baseLine - baseLine;
  // x坐标取首尾contentBox的左右2侧，clip布局时已算好；y是根据lineHeight和lineBox的高度以及baseLine对齐后计算的
  let x1 = isStart ? xom.__iBgX1 : start.x;
  let y1 = lineBox.y + diff - eyt;
  // bx/by是border的位置，供其渲染用
  let bx1 = isStart ? xom.__iBX1 : start.x;
  let by1 = lineBox.y + diff - pbt;
  let x2, bx2;
  if(isEnd) {
    x2 = xom.__iBgX2;
    bx2 = xom.__iBX2;
  }
  // 右侧x在非结尾时特殊判断，可能这行的结尾是个嵌套inline的结束，且inline有mpb
  else {
    x2 = end.x + end.outerWidth;
    bx2 = x2;
    if(end instanceof TextBox) {
      // TextBox的parent是Text，再是Dom，这里一定是inline，无嵌套就是xom本身，有则包含若干层最上层还是xom
      let dom = end.parent.parent;
      let n = 0;
      // 从end开始，向上获取dom节点的尾部mpb进行累加，直到xom跳出
      while(dom !== xom) {
        let list = dom.contentBoxList;
        if(end === list[list.length - 1]) {
          let {
            [MARGIN_RIGHT]: marginRight,
            [PADDING_RIGHT]: paddingRight,
            [BORDER_RIGHT_WIDTH]: borderRightWidth,
          } = xom.computedStyle;
          n += marginRight + paddingRight + borderRightWidth;
        }
        dom = dom.parent;
      }
      if(n) {
        x2 += n;
      }
    }
  }
  let y2 = lineBox.y + diff + lineHeight - diffL + eyb;
  let by2 = lineBox.y + diff + lineHeight - diffL + pbb;
  return [x1, y1, x2, y2, bx1, by1, bx2, by2];
}

export default {
  renderBgc,
  getInlineBox,
};
