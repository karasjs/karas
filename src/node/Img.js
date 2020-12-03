import Dom from './Dom';
import mode from './mode';
import painter from '../util/painter';
import inject from '../util/inject';
import util from '../util/util';
import unit from '../style/unit';
import transform from '../style/transform';
import image from '../style/image';
import border from '../style/border';
import enums from '../util/enums';
import level from '../refresh/level';

const { STYLE_KEY: {
  WIDTH,
  HEIGHT,
  DISPLAY,
  BORDER_TOP_WIDTH,
  BORDER_RIGHT_WIDTH,
  BORDER_LEFT_WIDTH,
  BORDER_BOTTOM_WIDTH,
  PADDING_TOP,
  PADDING_LEFT,
  BORDER_TOP_LEFT_RADIUS,
  BORDER_TOP_RIGHT_RADIUS,
  BORDER_BOTTOM_RIGHT_RADIUS,
  BORDER_BOTTOM_LEFT_RADIUS,
  VISIBILITY,
}, UPDATE_NODE, UPDATE_FOCUS, UPDATE_IMG } = enums;
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
    if(loadImg.error && !this.props.placeholder) {
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

  // img根据加载情况更新__hasContent
  __calCache(renderMode, lv, ctx, defs, parent, __cacheStyle, currentStyle, computedStyle, sx, sy, innerWidth, innerHeight, outerWidth, outerHeight, borderTopWidth, borderRightWidth, borderBottomWidth, borderLeftWidth, x1, x2, x3, x4, y1, y2, y3, y4) {
    let res = super.__calCache(renderMode, lv, ctx, defs, parent, __cacheStyle, currentStyle, computedStyle, sx, sy, innerWidth, innerHeight, outerWidth, outerHeight, borderTopWidth, borderRightWidth, borderBottomWidth, borderLeftWidth, x1, x2, x3, x4, y1, y2, y3, y4);
    if(!res) {
      let {
        computedStyle,
        __loadImg: loadImg,
        props: {
          src,
          placeholder,
        }
      } = this;
      if(computedStyle[VISIBILITY] !== 'hidden' && (computedStyle[WIDTH] || computedStyle[HEIGHT])
        && (loadImg.error || ((loadImg.url === src || placeholder) && loadImg.source))) {
        res = true;
      }
    }
    return res;
  }

  render(renderMode, lv, ctx, defs, cache) {
    let res = super.render(renderMode, lv, ctx, defs, cache);
    let {
      width, height, isDestroyed,
      props: {
        src,
        placeholder,
      },
      computedStyle: {
        [DISPLAY]: display,
        [BORDER_TOP_WIDTH]: borderTopWidth,
        [BORDER_RIGHT_WIDTH]: borderRightWidth,
        [BORDER_BOTTOM_WIDTH]: borderBottomWidth,
        [BORDER_LEFT_WIDTH]: borderLeftWidth,
        [PADDING_TOP]: paddingTop,
        [PADDING_LEFT]: paddingLeft,
        [BORDER_TOP_LEFT_RADIUS]: borderTopLeftRadius,
        [BORDER_TOP_RIGHT_RADIUS]: borderTopRightRadius,
        [BORDER_BOTTOM_RIGHT_RADIUS]: borderBottomRightRadius,
        [BORDER_BOTTOM_LEFT_RADIUS]: borderBottomLeftRadius,
        [VISIBILITY]: visibility,
      },
      virtualDom,
      __cache,
    } = this;
    // img无children所以total就是cache避免多余生成
    if(renderMode === mode.CANVAS) {
      this.__cacheTotal = __cache;
    }
    if(isDestroyed || display === 'none' || visibility === 'hidden') {
      return res;
    }
    if(cache && __cache && __cache.enabled) {
      ctx = __cache.ctx;
    }
    let originX, originY;
    originX = res.x2 + paddingLeft;
    originY = res.y2 + paddingTop;
    let loadImg = this.__loadImg;
    if(loadImg.error && !placeholder && Img.showError) {
      if(!width || !height) {
        return res;
      }
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
    else if((loadImg.url === src || placeholder) && loadImg.source) {
      let source = loadImg.source;
      // 无source不绘制，还要注意尺寸为0
      if(source && (width || height)) {
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
            ['xlink:href', loadImg.error ? placeholder : src],
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
          function reload() {
            let { root, currentStyle: { [WIDTH]: width, [HEIGHT]: height } } = self;
            root.delRefreshTask(self.__task);
            if(width[1] !== AUTO && height[1] !== AUTO) {
              root.addRefreshTask(self.__task = {
                __before() {
                  if(self.isDestroyed) {
                    return;
                  }
                  // 刷新前统一赋值，由刷新逻辑计算最终值避免优先级覆盖问题
                  let res = {};
                  res[UPDATE_NODE] = self;
                  res[UPDATE_FOCUS] = level.REPAINT;
                  root.__addUpdate(self, self.__config, root, root.__config, res);
                },
              });
            }
            else {
              root.addRefreshTask(self.__task = {
                __before() {
                  if(self.isDestroyed) {
                    return;
                  }
                  // 刷新前统一赋值，由刷新逻辑计算最终值避免优先级覆盖问题
                  let res = {};
                  res[UPDATE_NODE] = self;
                  res[UPDATE_FOCUS] = level.REFLOW;  // 没有样式变化但内容尺寸发生了变化强制执行
                  res[UPDATE_IMG] = true;  // 特殊标识强制布局即便没有style变化
                  root.__addUpdate(self, self.__config, root, root.__config, res);
                },
              });
            }
          }
          if(data.success) {
            loadImg.source = data.source;
            loadImg.width = data.width;
            loadImg.height = data.height;
          }
          else if(placeholder) {
            inject.measureImg(placeholder, data => {
              if(data.success) {
                loadImg.error = true;
                loadImg.source = data.source;
                loadImg.width = data.width;
                loadImg.height = data.height;
                reload();
              }
            });
            return;
          }
          else {
            loadImg.error = true;
          }
          reload();
        }
      }, {
        width,
        height,
      });
    }
    return res;
  }

  // img没加载时，清空，加载了或错误时，也返回true，这样Xom就认为没内容不生成cache，防止img先绘制cache再绘制主屏，重复
  __releaseWhenEmpty(__cache) {
    if(!this.__loadImg.error && !this.__loadImg.source && this.__loadImg.url !== this.props.src) {
      return super.__releaseWhenEmpty(__cache);
    }
  }

  get baseLine() {
    return this.height;
  }

  static showError = true;
}

export default Img;
