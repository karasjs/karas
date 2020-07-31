import Dom from './Dom';
import mode from '../util/mode';
import inject from '../util/inject';
import util from '../util/util';
import unit from '../style/unit';
import transform from '../style/transform';
import image from '../style/image';
import border from '../style/border';
import draw from '../util/draw';
import level from '../animate/level';

const { AUTO } = unit;
const { genCanvasPolygon, genSvgPolygon } = draw;

class Img extends Dom {
  constructor(tagName, props) {
    super(tagName, props);
    let src = this.props.src;
    let loadImg = this.__loadImg = {
      // 刷新回调函数，用以destroy取消用
      cb: function() {
      },
    };
    // 空url用错误图代替
    if(!src) {
      loadImg.error = true;
    }
  }

  /**
   * 覆盖xom的方法，在__layout3个分支中会首先被调用
   * 当样式中固定宽高时，图片按样式尺寸，加载后重新绘制即可
   * 只固定宽高一个时，加载完要计算缩放比，重新布局绘制
   * 都没有固定，按照图片尺寸，重新布局绘制
   * 这里计算非固定的情况，将其改为固定供布局渲染使用，未加载完成为0
   * @param data
   * @returns {{fixedWidth: boolean, w: *, x: *, h: *, y: *, fixedHeight: boolean}}
   * @private
   */
  __preLayout(data) {
    let res = super.__preLayout(data);
    let loadImg = this.__loadImg;
    // 可能已提前加载好了，或有缓存，为减少刷新直接使用
    if(!loadImg.error) {
      let src = this.props.src;
      let cache = inject.IMG[src];
      if(cache && cache.state === inject.LOADED) {
        loadImg.url = src;
        loadImg.source = cache.source;
        loadImg.width = cache.width;
        loadImg.height = cache.height;
      }
    }
    if(res.fixedWidth && res.fixedHeight) {
      return res;
    }
    if(loadImg.error) {
      if(res.fixedWidth) {
        res.h = res.w;
      }
      else if(res.fixedHeight) {
        res.w = res.h;
      }
      else {
        res.w = res.h = 32;
      }
    }
    else if(loadImg.source) {
      if(res.fixedWidth) {
        res.h = res.w * loadImg.height / loadImg.width;
      }
      else if(res.fixedHeight) {
        res.w = res.h * loadImg.width / loadImg.height;
      }
      else {
        res.w = loadImg.width;
        res.h = loadImg.height;
      }
    }
    else {
      res.w = res.h = 0;
    }
    res.fixedWidth = true;
    res.fixedHeight = true;
    return res;
  }

  __addGeom(tagName, props) {
    props = util.hash2arr(props);
    this.virtualDom.children.push({
      type: 'item',
      tagName,
      props,
    });
  }

  __destroy() {
    this.root.delRefreshTask(this.__task);
    super.__destroy();
  }

  render(renderMode, ctx, defs) {
    super.render(renderMode, ctx, defs);
    let {
      sx: x, sy: y, width, height, isDestroyed,
      props: {
        src,
      },
      computedStyle: {
        display,
        borderTopWidth,
        borderRightWidth,
        borderBottomWidth,
        borderLeftWidth,
        marginTop,
        marginLeft,
        paddingTop,
        paddingLeft,
        borderTopLeftRadius,
        borderTopRightRadius,
        borderBottomRightRadius,
        borderBottomLeftRadius,
        visibility,
      }
    } = this;
    if(isDestroyed || display === 'none' || visibility === 'hidden') {
      return;
    }
    let originX = x + marginLeft + borderLeftWidth + paddingLeft;
    let originY = y + marginTop + borderTopWidth + paddingTop;
    let loadImg = this.__loadImg;
    if(loadImg.error) {
      let strokeWidth = Math.min(width, height) * 0.02;
      let stroke = '#CCC';
      let fill = '#DDD';
      let cx = originX + width * 0.7;
      let cy = originY + height * 0.3;
      let r = strokeWidth * 5;
      let pts = [
        [originX + width * 0.15, originY + height * 0.7],
        [originX + width * 0.3, originY + height * 0.4],
        [originX + width * 0.5, originY + height * 0.6],
        [originX + width * 0.6, originY + height * 0.5],
        [originX + width * 0.9, originY + height * 0.8],
        [originX + width * 0.15, originY + height * 0.8]
      ];
      if(renderMode === mode.CANVAS) {
        ctx.strokeStyle = stroke;
        ctx.lineWidth = strokeWidth;
        ctx.fillStyle = fill;
        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(originX + width, originY);
        ctx.lineTo(originX + width, originY + height);
        ctx.lineTo(originX, originY + height);
        ctx.lineTo(originX, originY);
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
        ctx.beginPath();
        ctx.moveTo(pts[0][0], pts[0][1]);
        for(let i = 1, len = pts.length; i < len; i++) {
          let point = pts[i];
          ctx.lineTo(point[0], point[1]);
        }
        ctx.lineTo(pts[0][0], pts[0][1]);
        ctx.fill();
        ctx.closePath();
      }
      else if(renderMode === mode.SVG) {
        this.__addGeom('rect', [
          ['x', originX],
          ['y', originY],
          ['width', width],
          ['height', height],
          ['stroke', stroke],
          ['stroke-width', strokeWidth],
          ['fill', 'rgba(0,0,0,0)']
        ]);
        this.__addGeom('circle', [
          ['cx', cx],
          ['cy', cy],
          ['r', r],
          ['fill', fill],
        ]);
        let s = '';
        for(let i = 0, len = pts.length; i < len; i++) {
          let point = pts[i];
          if(i) {
            s += ' ';
          }
          s += point[0] + ',' + point[1];
        }
        this.__addGeom('polygon', [
          ['points', s],
          ['fill', fill]
        ]);
      }
    }
    else if(loadImg.url === src) {
      let source = loadImg.source;
      // 无source不绘制
      if(source) {
        // 圆角需要生成一个mask
        let list = border.calRadius(originX, originY, width, height,
          borderTopWidth, borderRightWidth, borderBottomWidth, borderLeftWidth,
          borderTopLeftRadius, borderTopRightRadius, borderBottomRightRadius, borderBottomLeftRadius);
        if(renderMode === mode.CANVAS) {
          // 有border-radius需模拟遮罩裁剪
          if(list) {
            let { width: w, height: h } = this.root;
            let c = inject.getCacheCanvas(w, h);
            c.ctx.drawImage(source, originX, originY, width, height);
            c.ctx.globalCompositeOperation = 'destination-in';
            c.ctx.fillStyle = '#FFF';
            genCanvasPolygon(ctx, list);
            c.draw(c.ctx);
            ctx.drawImage(c.canvas, 0, 0);
            c.draw(ctx);
            c.ctx.globalCompositeOperation = 'source-over';
            c.ctx.clearRect(0, 0, w, h);
            c.draw(c.ctx);
          }
          else {
            ctx.drawImage(source, originX, originY, width, height);
          }
        }
        else if(renderMode === mode.SVG) {
          // 缩放图片，无需考虑原先矩阵，xom里对父层<g>已经变换过了
          let matrix;
          if(width !== loadImg.width || height !== loadImg.height) {
            matrix = image.matrixResize(loadImg.width, loadImg.height, width, height, originX, originY, width, height);
          }
          let props = [
            ['xlink:href', src],
            ['x', originX],
            ['y', originY],
            ['width', loadImg.width],
            ['height', loadImg.height]
          ];
          if(list) {
            let d = genSvgPolygon(list);
            let maskId = defs.add({
              tagName: 'mask',
              props: [],
              children: [
                {
                  type: 'item',
                  tagName: 'path',
                  props: [
                    ['d', d],
                    ['fill', '#FFF']
                  ],
                }
              ],
            });
            this.virtualDom.conMask = 'url(#' + maskId + ')';
          }
          if(matrix && !util.equalArr(matrix, [1, 0, 0, 1, 0, 0])) {
            props.push(['transform', 'matrix(' + util.joinArr(matrix, ',') + ')']);
          }
          this.virtualDom.children.push({
            type: 'img',
            tagName: 'image',
            props,
          });
        }
      }
    }
    else {
      let loadImg = this.__loadImg;
      loadImg.url = src;
      loadImg.source = null;
      loadImg.error = null;
      inject.measureImg(src, data => {
        // 还需判断url，防止重复加载时老的替换新的，失败走error绘制
        if(data.url === loadImg.url && !this.__isDestroyed) {
          if(data.success) {
            loadImg.source = data.source;
            loadImg.width = data.width;
            loadImg.height = data.height;
          }
          else {
            loadImg.error = true;
          }
          let { root, currentStyle: { width, height } } = this;
          root.delRefreshTask(loadImg.cb);
          root.delRefreshTask(this.__task);
          if(width.unit !== AUTO && height.unit !== AUTO) {
            root.addRefreshTask(loadImg.cb);
          }
          else {
            root.addRefreshTask(this.__task = {
              before() {
                root.setRefreshLevel(level.REFLOW);
              },
            });
          }
        }
      }, {
        width,
        height,
      });
    }
  }

  get baseLine() {
    return this.height;
  }
}

export default Img;
