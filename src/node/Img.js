import Dom from './Dom';
import mode from './mode';
import painter from '../util/painter';
import inject from '../util/inject';
import util from '../util/util';
import unit from '../style/unit';
import transform from '../style/transform';
import image from '../style/image';
import border from '../style/border';
import level from '../refresh/level';

const { AUTO } = unit;
const { canvasPolygon, svgPolygon } = painter;

class Img extends Dom {
  constructor(tagName, props) {
    super(tagName, props);
    let src = this.props.src;
    let loadImg = this.__loadImg = {};
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
      loadImg.cache = false;
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

  render(renderMode, lv, ctx, defs) {
    let res = super.render(renderMode, lv, ctx, defs);
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
      },
      virtualDom,
    } = this;
    if(isDestroyed || display === 'none' || visibility === 'hidden') {
      return res;
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
        // virtualDom.children = [];
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
            ctx.save();
            ctx.beginPath();
            canvasPolygon(ctx, list);
            ctx.clip();
            ctx.closePath();
            ctx.drawImage(source, originX, originY, width, height);
            ctx.restore();
          }
          else {
            ctx.drawImage(source, originX, originY, width, height);
          }
        }
        else if(renderMode === mode.SVG) {
          // img没有变化无需diff，直接用上次的vd
          if(loadImg.cache) {
            loadImg.cache.cache = true;
            virtualDom.children = [loadImg.cache];
            // 但是还是要校验是否有borderRadius变化，引发img的圆角遮罩
            if(!virtualDom.cache && list) {
              let d = svgPolygon(list);
              let id = defs.add({
                tagName: 'clipPath',
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
              virtualDom.conClip = 'url(#' + id + ')';
            }
            return;
          }
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
            let d = svgPolygon(list);
            let id = defs.add({
              tagName: 'clipPath',
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
            virtualDom.conClip = 'url(#' + id + ')';
            delete virtualDom.cache;
          }
          if(matrix && !util.equalArr(matrix, [1, 0, 0, 1, 0, 0])) {
            props.push(['transform', 'matrix(' + util.joinArr(matrix, ',') + ')']);
          }
          let vd = {
            type: 'img',
            tagName: 'image',
            props,
          };
          virtualDom.children = [vd];
          loadImg.cache = vd;
        }
      }
    }
    else {
      let loadImg = this.__loadImg;
      loadImg.url = src;
      loadImg.source = null;
      loadImg.error = null;
      loadImg.cache = false;
      inject.measureImg(src, data => {
        let self = this;
        // 还需判断url，防止重复加载时老的替换新的，失败走error绘制
        if(data.url === loadImg.url && !self.__isDestroyed) {
          if(data.success) {
            loadImg.source = data.source;
            loadImg.width = data.width;
            loadImg.height = data.height;
          }
          else {
            loadImg.error = true;
          }
          let { root, currentStyle: { width, height } } = self;
          root.delRefreshTask(self.__task);
          if(width.unit !== AUTO && height.unit !== AUTO) {
            root.addRefreshTask(self.__task = {
              before() {
                if(self.isDestroyed) {
                  return;
                }
                // 刷新前统一赋值，由刷新逻辑计算最终值避免优先级覆盖问题
                root.__addUpdate({
                  node: self,
                  focus: level.REPAINT,
                  img: true,
                });
              },
            });
          }
          else {
            root.addRefreshTask(self.__task = {
              before() {
                if(self.isDestroyed) {
                  return;
                }
                // 刷新前统一赋值，由刷新逻辑计算最终值避免优先级覆盖问题
                root.__addUpdate({
                  node: self,
                  focus: level.REFLOW, // 没有样式变化但内容尺寸发生了变化强制执行
                  img: true, // 特殊标识强制布局即便没有style变化 TODO
                });
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
