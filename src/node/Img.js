import Dom from './Dom';
import mode from './mode';
import painter from '../util/painter';
import inject from '../util/inject';
import util from '../util/util';
import unit from '../style/unit';
import image from '../style/image';
import border from '../style/border';
import enums from '../util/enums';
import level from '../refresh/level';

const {
  STYLE_KEY: {
    WIDTH,
    HEIGHT,
    DISPLAY,
    BORDER_TOP_WIDTH,
    BORDER_RIGHT_WIDTH,
    BORDER_LEFT_WIDTH,
    BORDER_BOTTOM_WIDTH,
    BORDER_TOP_LEFT_RADIUS,
    BORDER_TOP_RIGHT_RADIUS,
    BORDER_BOTTOM_RIGHT_RADIUS,
    BORDER_BOTTOM_LEFT_RADIUS,
    VISIBILITY,
    BACKGROUND_IMAGE,
    BACKGROUND_COLOR,
    BOX_SHADOW,
    MIX_BLEND_MODE,
  },
  UPDATE_KEY: {
    UPDATE_NODE,
    UPDATE_FOCUS,
    UPDATE_IMG,
    UPDATE_CONFIG,
  },
  NODE_KEY: {
    NODE_CACHE,
    NODE_CACHE_TOTAL,
    NODE_DEFS_CACHE,
    NODE_IS_MASK,
  },
} = enums;
const { AUTO, PX, RGBA } = unit;
const { canvasPolygon, svgPolygon } = painter;

class Img extends Dom {
  constructor(tagName, props) {
    super(tagName, props);
    let src = this.__src = this.props.src;
    let loadImg = this.__loadImg = {};
    // 空url用错误图代替
    if(!src) {
      loadImg.error = true;
    }
    let isClip = this.__isClip = !!this.props.clip;
    let isMask = this.__isMask = isClip || !!this.props.mask;
    if(isMask) {
      let { style, currentStyle } = this;
      style[BACKGROUND_IMAGE] = currentStyle[BACKGROUND_IMAGE] = [null];
      style[BACKGROUND_COLOR] = currentStyle[BACKGROUND_COLOR] = [[0, 0, 0, 0], RGBA];
      style[BORDER_TOP_WIDTH] = currentStyle[BORDER_TOP_WIDTH] = [0, PX];
      style[BORDER_RIGHT_WIDTH] = currentStyle[BORDER_RIGHT_WIDTH] = [0, PX];
      style[BORDER_LEFT_WIDTH] = currentStyle[BORDER_LEFT_WIDTH] = [0, PX];
      style[BORDER_BOTTOM_WIDTH] = currentStyle[BORDER_BOTTOM_WIDTH] = [0, PX];
      style[BOX_SHADOW] = currentStyle[BOX_SHADOW] = null;
      style[MIX_BLEND_MODE] = currentStyle[MIX_BLEND_MODE] = 'normal';
    }
    let config = this.__config;
    config[NODE_IS_MASK] = isMask;
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
  __calContent(renderMode, lv, currentStyle, computedStyle) {
    let res = super.__calContent(renderMode, lv, currentStyle, computedStyle);
    if(!res) {
      let {
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
      offScreenFilter, offScreenMask, offScreenOverflow, offScreenBlend,
    } = res;
    let {
      width, height, isDestroyed,
      props: {
        src,
        placeholder,
      },
      computedStyle,
      computedStyle: {
        [DISPLAY]: display,
        [BORDER_TOP_LEFT_RADIUS]: borderTopLeftRadius,
        [BORDER_TOP_RIGHT_RADIUS]: borderTopRightRadius,
        [BORDER_BOTTOM_RIGHT_RADIUS]: borderBottomRightRadius,
        [BORDER_BOTTOM_LEFT_RADIUS]: borderBottomLeftRadius,
        [VISIBILITY]: visibility,
      },
      virtualDom,
      __config,
      __loadImg: loadImg,
      root,
    } = this;
    if(!cache && (offScreenFilter || offScreenMask || offScreenOverflow || offScreenBlend)) {
      ctx = (offScreenFilter || offScreenMask || offScreenOverflow || offScreenBlend).target.ctx;
    }
    // img无children所以total就是cache避免多余生成
    if(renderMode === mode.CANVAS && cache) {
      __config[NODE_CACHE_TOTAL] = __config[NODE_CACHE];
    }
    if(loadImg.url !== src && !loadImg.error) {
      loadImg.url = src;
      loadImg.source = null;
      loadImg.error = null;
      loadImg.cache = false;
      inject.measureImg(src, data => {
        let self = this;
        // 还需判断url，防止重复加载时老的替换新的，失败走error绘制
        if(data.url === loadImg.url && !self.isDestroyed) {
          function reload() {
            let { currentStyle: { [WIDTH]: width, [HEIGHT]: height } } = self;
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
                  res[UPDATE_CONFIG] = self.__config;
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
                  res[UPDATE_CONFIG] = self.__config;
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
            }, {
              ctx,
              root,
              width,
              height,
            });
            return;
          }
          else {
            loadImg.error = true;
          }
          // 可见状态进行刷新操作，visibility某些情况需要刷新，可能宽高未定义要重新布局
          if(computedStyle[DISPLAY] !== 'none') {
            reload();
          }
        }
      }, {
        ctx,
        root,
        width,
        height,
      });
    }
    if(isDestroyed || display === 'none' || visibility === 'hidden') {
      return res;
    }
    let __cache = __config[NODE_CACHE];
    if(cache && __cache && __cache.enabled) {
      ctx = __cache.ctx;
    }
    let originX, originY;
    originX = res.x3;
    originY = res.y3;
    if(loadImg.error && !placeholder && Img.showError) {
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
      // 无source不绘制
      if(source) {
        // 圆角需要生成一个mask
        let list = border.calRadius(originX, originY, width, height,
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
              let v = {
                tagName: 'clipPath',
                props: [],
                children: [
                  {
                    type: 'item',
                    tagName: 'path',
                    props: [
                      ['d', d],
                      ['fill', '#FFF'],
                    ],
                  }
                ],
              };
              let id = defs.add(v);
              __config[NODE_DEFS_CACHE].push(v);
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
            let v = {
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
            };
            let id = defs.add(v);
            __config[NODE_DEFS_CACHE].push(v);
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
    return res;
  }

  // img没加载时，清空，这样Xom就认为没内容不生成cache，防止img先绘制cache再绘制主屏，重复
  __releaseWhenEmpty(__cache) {
    if(!this.__loadImg.error && !this.__loadImg.source && this.__loadImg.url !== this.props.src) {
      return super.__releaseWhenEmpty(__cache);
    }
  }

  __isRealInline() {
    return false;
  }

  get baseLine() {
    return this.height;
  }

  get isMask() {
    return this.__isMask;
  }

  get isClip() {
    return this.__isClip;
  }

  static showError = true;
}

export default Img;
