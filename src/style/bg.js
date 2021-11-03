import border from './border';
import transform from './transform';
import mx from '../math/matrix';
import mode from '../node/mode';
import painter from '../util/painter';
import util from '../util/util';
import unit from './unit';
import enums from '../util/enums';
import image from './image';

const {
  STYLE_KEY: {
    BACKGROUND_POSITION_X,
    BACKGROUND_POSITION_Y,
    FONT_SIZE,
  },
  NODE_KEY: {
    NODE_DEFS_CACHE,
  },
} = enums;
const { clone, joinArr } = util;
const { canvasPolygon, svgPolygon } = painter;
const { AUTO, PX, PERCENT, STRING, REM, VW, VH } = unit;

function renderBgc(xom, renderMode, ctx, color, list, x, y, w, h, btlr, btrr, bbrr, bblr, method = 'fill', isInline, dx, dy) {
  // radial渐变ellipse形状会有matrix，用以从圆缩放到椭圆
  let matrix, cx, cy;
  if(Array.isArray(color)) {
    matrix = color[1];
    cx = color[2];
    cy = color[3];
    color = color[0];
  }
  // border-radius使用三次贝塞尔曲线模拟1/4圆角，误差在[0, 0.000273]之间
  list = list || border.calRadius(x, y, w, h, btlr, btrr, bbrr, bblr);
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
  if(renderMode === mode.CANVAS || renderMode === mode.WEBGL) {
    if(matrix) {
      ctx.save();
      let me = xom.matrixEvent;
      matrix = mx.multiply(me, matrix);
      ctx.setTransform(matrix[0], matrix[1], matrix[4], matrix[5], matrix[12], matrix[13]);
    }
    ctx.beginPath();
    if(ctx.fillStyle !== color) {
      ctx.fillStyle = color;
    }
    if(renderMode === mode.CANVAS) {
      canvasPolygon(ctx, list, dx, dy);
    }
    else {
      canvasPolygon(ctx, list);
    }
    ctx[method]();
    ctx.closePath();
    if(matrix) {
      ctx.restore();
    }
  }
  else if(renderMode === mode.SVG) {
    let d = svgPolygon(list);
    if(isInline) {
      let v = {
        tagName: 'symbol',
        props: [],
        children: [
          {
            type: 'item',
            tagName: 'path',
            props: [
              ['d', d],
              ['fill', color],
            ],
          },
        ],
      };
      xom.__config[NODE_DEFS_CACHE].push(v);
      return ctx.add(v);
    }
    else {
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
        bb[bb.length - 1].props.push(['transform', `matrix(${joinArr(mx.m2m6(matrix), ',')})`]);
      }
    }
  }
}

function calBackgroundSize(value, w, h, root) {
  let res = [];
  value.forEach((item, i) => {
    if(item[1] === PX) {
      res.push(item[0]);
    }
    else if(item[1] === PERCENT) {
      res.push(item[0] * (i ? h : w) * 0.01);
    }
    else if(item[1] === REM) {
      res.push(item[0] * root.computedStyle[FONT_SIZE]);
    }
    else if(item[1] === VW) {
      res.push(item[0] * root.width * 0.01);
    }
    else if(item[1] === VH) {
      res.push(item[0] * root.height * 0.01);
    }
    else if(item[1] === AUTO) {
      res.push(-1);
    }
    else if(item[1] === STRING) {
      res.push(item[0] === 'contain' ? -2 : -3);
    }
  });
  return res;
}

function calBackgroundPosition(position, container, size, root) {
  if(Array.isArray(position)) {
    if(position[1] === PX) {
      return position[0];
    }
    else if(position[1] === PERCENT) {
      return (container - size) * position[0] * 0.01;
    }
    else if(position[1] === REM) {
      return position[0] * root.computedStyle[FONT_SIZE];
    }
    else if(position[1] === VW) {
      return position[0] * root.width * 0.01;
    }
    else if(position[1] === VH) {
      return position[0] * root.height * 0.01;
    }
  }
  return 0;
}

function renderImage(xom, renderMode, ctx, loadBgi,
                     bx1, by1, bx2, by2, btlr, btrr, bbrr, bblr,
                     currentStyle, i, backgroundSize, backgroundRepeat, __config, isInline,
                     dx = 0, dy = 0) {
  let source = loadBgi.source;
  // 无source不绘制，可能错误或加载中
  if(source) {
    bx1 += dx;
    by1 += dy;
    bx2 += dx;
    by2 += dy;
    let bgW = bx2 - bx1;
    let bgH = by2 - by1;
    let { width, height } = loadBgi;
    let [w, h] = backgroundSize[i] || [];
    // -1为auto，-2为contain，-3为cover
    if(w === -1 && h === -1) {
      w = width;
      h = height;
    }
    else if(w === -2) {
      if(width > bgW && height > bgH) {
        w = width / bgW;
        h = height / bgH;
        if(w >= h) {
          w = bgW;
          h = w * height / width;
        }
        else {
          h = bgH;
          w = h * width / height;
        }
      }
      else if(width > bgW) {
        w = bgW;
        h = w * height / width;
      }
      else if(height > bgH) {
        h = bgH;
        w = h * width / height;
      }
      else {
        w = width;
        h = height;
      }
    }
    else if(w === -3) {
      if(bgW > width && bgH > height) {
        w = width / bgW;
        h = height / bgH;
        if(w <= h) {
          w = bgW;
          h = w * height / width;
        }
        else {
          h = bgH;
          w = h * width / height;
        }
      }
      else if(bgW > width) {
        w = bgW;
        h = w * height / width;
      }
      else if(bgH > height) {
        h = bgH;
        w = h * width / height;
      }
      else {
        w = width / bgW;
        h = height / bgH;
        if(w <= h) {
          w = bgW;
          h = w * height / width;
        }
        else {
          h = bgH;
          w = h * width / height;
        }
      }
    }
    else if(w === -1) {
      w = h * width / height;
    }
    else if(h === -1) {
      h = w * height / width;
    }
    let bgX = bx1 + calBackgroundPosition(currentStyle[BACKGROUND_POSITION_X][i], bgW, w, xom.root);
    let bgY = by1 + calBackgroundPosition(currentStyle[BACKGROUND_POSITION_Y][i], bgH, h, xom.root);
    // 超出尺寸模拟mask截取
    let needMask = bgX < bx1 || bgY < by1 || (bgX + w) > (bx1 + bgW) || (bgY + h) > (by1 + bgH);
    // 计算因为repeat，需要向4个方向扩展渲染几个数量图片
    let xnl = 0;
    let xnr = 0;
    let ynt = 0;
    let ynb = 0;
    // repeat-x
    if(['repeat-x', 'repeatX', 'repeat'].indexOf(backgroundRepeat[i]) > -1) {
      let diff = bgX - bx1;
      if(diff > 0) {
        xnl = Math.ceil(diff / w);
      }
      diff = bx1 + bgW - bgX - w;
      if(diff > 0) {
        xnr = Math.ceil(diff / w);
      }
    }
    // repeat-y
    if(['repeat-y', 'repeatY', 'repeat'].indexOf(backgroundRepeat[i]) > -1) {
      let diff = bgY - by1;
      if(diff > 0) {
        ynt = Math.ceil(diff / h);
      }
      diff = by1 + bgH - bgY - h;
      if(diff > 0) {
        ynb = Math.ceil(diff / h);
      }
    }
    // 分同行列和4个角分别判断，先看同行同列，再看4个角的象限
    let repeat = [];
    if(xnl > 0) {
      for(let i = 0; i < xnl; i++) {
        let x = bgX - (i + 1) * w;
        repeat.push([x, bgY]);
        // 看最左边超过没有
        if(!needMask && i === 0 && x < bx1) {
          needMask = true;
        }
      }
    }
    if(xnr > 0) {
      for(let i = 0; i < xnr; i++) {
        let x = bgX + (i + 1) * w;
        repeat.push([x, bgY]);
        // 看最右边超过没有
        if(!needMask && i === xnr - 1 && x + w > bx1 + bgW) {
          needMask = true;
        }
      }
    }
    if(ynt > 0) {
      for(let i = 0; i < ynt; i++) {
        let y = bgY - (i + 1) * h;
        repeat.push([bgX, y]);
        // 看最上边超过没有
        if(!needMask && i === 0 && y < by1) {
          needMask = true;
        }
      }
    }
    if(ynb > 0) {
      for(let i = 0; i < ynb; i++) {
        let y = bgY + (i + 1) * h;
        repeat.push([bgX, y]);
        // 看最下边超过没有
        if(!needMask && i === ynb - 1 && y + w > by1 + bgH) {
          needMask = true;
        }
      }
    }
    // 原点和同行列十字画完，看4个角的情况
    if(xnl > 0 && ynt > 0) {
      for(let i = 0; i < xnl; i++) {
        for(let j = 0; j < ynt; j++) {
          repeat.push([bgX - (i + 1) * w, bgY - (j + 1) * h]);
        }
      }
    }
    if(xnr > 0 && ynt > 0) {
      for(let i = 0; i < xnr; i++) {
        for(let j = 0; j < ynt; j++) {
          repeat.push([bgX + (i + 1) * w, bgY - (j + 1) * h]);
        }
      }
    }
    if(xnl > 0 && ynb > 0) {
      for(let i = 0; i < xnl; i++) {
        for(let j = 0; j < ynb; j++) {
          repeat.push([bgX - (i + 1) * w, bgY + (j + 1) * h]);
        }
      }
    }
    if(xnr > 0 && ynb > 0) {
      for(let i = 0; i < xnr; i++) {
        for(let j = 0; j < ynb; j++) {
          repeat.push([bgX + (i + 1) * w, bgY + (j + 1) * h]);
        }
      }
    }
    if(renderMode === mode.CANVAS || renderMode === mode.WEBGL) {
      if(needMask) {
        ctx.save();
        renderBgc(this, renderMode, ctx, '#FFF', null,
          bx1, by1, bgW, bgH, btlr, btrr, bbrr, bblr, 'clip');
      }
      // 先画不考虑repeat的中心声明的
      ctx.drawImage(source, bgX, bgY, w, h);
      // 再画重复的十字和4角象限
      repeat.forEach(item => {
        ctx.drawImage(source, item[0], item[1], w, h);
      });
      if(needMask) {
        ctx.restore();
      }
    }
    else if(renderMode === mode.SVG) {
      let matrix = image.matrixResize(width, height, w, h, bgX, bgY, bgW, bgH);
      let props = [
        ['xlink:href', loadBgi.url],
        ['x', bgX],
        ['y', bgY],
        ['width', width],
        ['height', height],
      ];
      let needResize;
      if(matrix && !mx.isE(matrix)) {
        needResize = true;
        props.push(['transform', 'matrix(' + joinArr(mx.m2m6(matrix), ',') + ')']);
      }
      if(needMask) {
        let p1 = [bx1, by1];
        let p2 = [bx2, by2];
        if(needResize) {
          let inverse = mx.inverse(matrix);
          p1 = mx.calPoint(p1, inverse);
          p2 = mx.calPoint(p2, inverse);
        }
        let v = {
          tagName: 'clipPath',
          children: [{
            tagName: 'path',
            props: [
              ['d', `M${p1[0]},${p1[1]}L${p2[0]},${p1[1]}L${p2[0]},${p2[1]}L${p1[0]},${p2[1]}L${p1[0]},${p1[1]}`],
              ['fill', '#FFF'],
            ],
          }],
        };
        let id = ctx.add(v);
        __config[NODE_DEFS_CACHE].push(v);
        props.push(['clip-path', 'url(#' + id + ')']);
      }
      if(isInline) {
        let v = {
          tagName: 'symbol',
          props: [],
          children: [
            {
              type: 'img',
              tagName: 'image',
              props,
            }
          ],
        };
        xom.__config[NODE_DEFS_CACHE].push(v);
        repeat.forEach(item => {
          let copy = clone(props);
          if(needResize) {
            let matrix = image.matrixResize(width, height, w, h, item[0], item[1], bgW, bgH);
            if(matrix && !mx.isE(matrix)) {
              copy[5][1] = 'matrix(' + joinArr(mx.m2m6(matrix), ',') + ')';
            }
          }
          copy[1][1] = item[0];
          copy[2][1] = item[1];
          v.children.push({
            type: 'img',
            tagName: 'image',
            props: copy,
          });
        });
        return ctx.add(v);
      }
      else {
        // 先画不考虑repeat的中心声明的
        xom.virtualDom.bb.push({
          type: 'img',
          tagName: 'image',
          props,
        });
        // 再画重复的十字和4角象限
        repeat.forEach(item => {
          let copy = clone(props);
          if(needResize) {
            let matrix = image.matrixResize(width, height, w, h, item[0], item[1], bgW, bgH);
            if(matrix && !mx.isE(matrix)) {
              copy[5][1] = 'matrix(' + joinArr(mx.m2m6(matrix), ',') + ')';
            }
          }
          copy[1][1] = item[0];
          copy[2][1] = item[1];
          xom.virtualDom.bb.push({
            type: 'img',
            tagName: 'image',
            props: copy,
          });
        });
      }
    }
  }
}

export default {
  renderBgc,
  renderImage,
  calBackgroundSize,
};
