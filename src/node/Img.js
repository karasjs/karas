import Dom from './Dom';
import mode from '../refresh/mode';
import painter from '../util/painter';
import inject from '../util/inject';
import util from '../util/util';
import enums from '../util/enums';
import unit from '../style/unit';
import image from '../style/image';
import border from '../style/border';
import level from '../refresh/level';
import mx from '../math/matrix';
import geom from '../math/geom';
import ImgWebglCache from '../gl/ImgWebglCache';

const {
  STYLE_KEY: {
    WIDTH,
    HEIGHT,
    DISPLAY,
    BORDER_RIGHT_WIDTH,
    BORDER_LEFT_WIDTH,
    BORDER_TOP_LEFT_RADIUS,
    BORDER_TOP_RIGHT_RADIUS,
    BORDER_BOTTOM_RIGHT_RADIUS,
    BORDER_BOTTOM_LEFT_RADIUS,
    VISIBILITY,
    MARGIN_RIGHT,
    MARGIN_LEFT,
    PADDING_RIGHT,
    PADDING_LEFT,
    FONT_SIZE,
    FLEX_BASIS,
  },
} = enums;
const { AUTO, PX, PERCENT, REM, VW, VH, VMAX, VMIN } = unit;
const { canvasPolygon, svgPolygon } = painter;
const { isFunction } = util;

class Img extends Dom {
  constructor(tagName, props) {
    super(tagName, props);
    let src = this.props.src;
    let loadImg = this.__loadImg = {
      src,
    };
    // 空url用错误图代替
    if(!src) {
      loadImg.error = true;
    }
    else {
      let ca = inject.IMG[src];
      if(!ca) {
        inject.measureImg(src, res => {
          if(src === loadImg.src) {
            if(res.success) {
              if(isFunction(props.onLoad)) {
                props.onLoad();
              }
            }
            else {
              if(isFunction(props.onError)) {
                props.onError();
              }
            }
          }
        });
      }
      else if(ca.state === inject.LOADED) {
        if(ca.success) {
          loadImg.source = ca.source;
          loadImg.width = loadImg.__width = ca.width;
          loadImg.height = loadImg.__height = ca.height;
        }
        else {
          loadImg.error = true;
        }
      }
    }
  }

  /**
   * 覆盖xom的方法，在__layout()3个分支中会首先被调用
   * 当样式中固定宽高时，图片按样式尺寸，加载后重新绘制即可
   * 只固定宽高一个时，加载完要计算缩放比，重新布局绘制
   * 都没有固定，按照图片尺寸，重新布局绘制
   * 这里计算非固定的情况，将其改为固定供布局渲染使用，未加载完成为0
   */
  __preLayout(data, isInline) {
    let res = super.__preLayout(data, false);
    let loadImg = this.__loadImg;
    // 可能已提前加载好了，或有缓存，为减少刷新直接使用
    let src = loadImg.src;
    if(src) {
      let cache = inject.IMG[src];
      if(!cache || cache.state === inject.LOADING) {
        if(!loadImg.loading) {
          this.__loadAndRefresh(loadImg, null);
        }
      }
      else if(cache && cache.state === inject.LOADED && cache.success) {
        loadImg.loading = false;
        if (cache.success) {
          loadImg.source = cache.source;
          loadImg.width = loadImg.__width = cache.width;
          loadImg.height = loadImg.__height = cache.height;
        }
        else {
          loadImg.error = true;
        }
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
    this.__virtualDom.children.push({
      type: 'item',
      tagName,
      props,
    });
  }

  // img根据加载情况更新__hasContent，同时识别是否仅有图片内容本身，多个相同图片视为同一个资源
  calContent(__currentStyle, __computedStyle) {
    let res = super.calContent(__currentStyle, __computedStyle);
    let {
      __loadImg: loadImg,
    } = this;
    if(!res) {
      loadImg.onlyImg = true;
      if(__computedStyle[VISIBILITY] !== 'hidden' && (__computedStyle[WIDTH] || __computedStyle[HEIGHT])
        && loadImg.source) {
        res = true;
      }
    }
    else {
      loadImg.onlyImg = false;
    }
    return this.__hasContent = res;
  }

  render(renderMode, ctx, dx = 0, dy = 0) {
    let res = super.render(renderMode, ctx, dx, dy);
    let {
      width, height, __isDestroyed,
      props: {
        placeholder,
      },
      __computedStyle: {
        [DISPLAY]: display,
        [BORDER_TOP_LEFT_RADIUS]: borderTopLeftRadius,
        [BORDER_TOP_RIGHT_RADIUS]: borderTopRightRadius,
        [BORDER_BOTTOM_RIGHT_RADIUS]: borderBottomRightRadius,
        [BORDER_BOTTOM_LEFT_RADIUS]: borderBottomLeftRadius,
        [VISIBILITY]: visibility,
      },
      virtualDom,
      __loadImg: loadImg,
    } = this;
    if(__isDestroyed || display === 'none' || visibility === 'hidden' || renderMode === mode.WEBGL) {
      return res;
    }
    let originX, originY;
    originX = res.x3 + dx;
    originY = res.y3 + dy;
    // 根据配置以及占位图显示error
    let source = loadImg.source;
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
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        let points = geom.ellipsePoints(cx, cy, r, r);
        painter.canvasPolygon(ctx, points, 0, 0);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(pts[0][0], pts[0][1]);
        for(let i = 1, len = pts.length; i < len; i++) {
          let point = pts[i];
          ctx.lineTo(point[0], point[1]);
        }
        ctx.lineTo(pts[0][0], pts[0][1]);
        ctx.closePath();
        ctx.fill();
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
    else if(source) {
      // 圆角需要生成一个mask
      let list = border.calRadius(originX, originY, width, height,
        borderTopLeftRadius, borderTopRightRadius, borderBottomRightRadius, borderBottomLeftRadius);
      if(renderMode === mode.CANVAS) {
        // 有border-radius需模拟遮罩裁剪
        if(list) {
          ctx.save();
          ctx.beginPath();
          canvasPolygon(ctx, list, dx, dy);
          ctx.clip();
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
            let id = ctx.add(v);
            this.__cacheDefs.push(v);
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
          ['xlink:href', loadImg.error ? placeholder : loadImg.src],
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
          let id = ctx.add(v);
          this.__cacheDefs.push(v);
          virtualDom.conClip = 'url(#' + id + ')';
          delete virtualDom.cache;
        }
        if(matrix && !mx.isE(matrix)) {
          props.push(['transform', 'matrix(' + util.joinArr(mx.m2m6(matrix), ',') + ')']);
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
    return res;
  }

  __isRealInline() {
    return false;
  }

  // overwrite
  __tryLayInline(w, total) {
    let { currentStyle: {
      [WIDTH]: width,
      [HEIGHT]: height,
      [MARGIN_LEFT]: marginLeft,
      [MARGIN_RIGHT]: marginRight,
      [PADDING_LEFT]: paddingLeft,
      [PADDING_RIGHT]: paddingRight,
    }, computedStyle: {
      [BORDER_LEFT_WIDTH]: borderLeftWidth,
      [BORDER_RIGHT_WIDTH]: borderRightWidth,
    } } = this;
    if(width.u !== AUTO) {
      w -= this.__calSize(width, total, true);
    }
    else {
      let loadImg = this.__loadImg;
      // 加载成功计算缩放后的宽度
      if(loadImg.source) {
        if(height.u === PX) {
          w -= loadImg.width * height.v / loadImg.height;
        }
        else if(height.u === PERCENT) {
          w -= loadImg.width * height.v * total * 0.01 / loadImg.height;
        }
        else if(height.u === REM) {
          w -= loadImg.width * height.v * this.root.computedStyle[FONT_SIZE] / loadImg.height;
        }
        else if(height.u === VW) {
          w -= loadImg.width * height.v * this.root.width * 0.01 / loadImg.height;
        }
        else if(height.u === VH) {
          w -= loadImg.width * height.v * this.root.height * 0.01 / loadImg.height;
        }
        else if(height.u === VMAX) {
          w -= height.v * Math.max(this.root.width, this.root.height) * 0.01 / loadImg.height;
        }
        else if(height.u === VMIN) {
          w -= height.v * Math.min(this.root.width, this.root.height) * 0.01 / loadImg.height;
        }
        else {
          w -= loadImg.width;
        }
      }
    }
    // 减去水平mbp
    w -= this.__calSize(marginRight, total, true);
    w -= this.__calSize(paddingRight, total, true);
    w -= borderRightWidth;
    w -= this.__calSize(marginLeft, total, true);
    w -= this.__calSize(paddingLeft, total, true);
    w -= borderLeftWidth;
    return w;
  }

  __calBasis(isDirectionRow, isAbs, isColumn, data, isDirectChild) {
    this.__computeReflow();
    let b = 0;
    let min = 0;
    let max = 0;
    let { currentStyle, computedStyle, __loadImg } = this;
    let { w, h } = data;
    // 计算需考虑style的属性
    let {
      [FLEX_BASIS]: flexBasis,
      [WIDTH]: width,
      [HEIGHT]: height,
    } = currentStyle;
    let main = isDirectionRow ? width : height;
    let cross = isDirectionRow ? height : width;
    // basis3种情况：auto、固定、content，只区分固定和其它
    let isFixed = [PX, PERCENT, REM, VW, VH, VMAX, VMIN].indexOf(flexBasis.u) > -1;
    if(isFixed) {
      b = max = min = this.__calSize(flexBasis, isDirectionRow ? w : h, true);
    }
    else if(([PX, PERCENT, REM, VW, VH, VMAX, VMIN].indexOf(main.u) > -1)) {
      b = max = min = this.__calSize(main, isDirectionRow ? w : h, true);
    }
    // auto和content固定尺寸比例计算
    else if(__loadImg.source || __loadImg.error) {
      let res = this.__preLayout(data);
      if(cross.u !== AUTO) {
        cross = this.__calSize(cross, isDirectionRow ? h : w, true);
        let ratio = res.w / res.h;
        b = max = min = isDirectionRow ? cross * ratio : cross / ratio;
      }
      else {
        b = max = min = isDirectionRow ? res.w : res.h;
      }
    }
    // 直接item的mpb影响basis
    return this.__addMBP(isDirectionRow, w, currentStyle, computedStyle, [b, min, max], isDirectChild);
  }

  __loadAndRefresh(loadImg, cb) {
    let self = this;
    // 先清空之前可能的
    if(loadImg.source || loadImg.error) {
      loadImg.source = null;
    }
    loadImg.loading = true;
    let root = this.__root, ctx = root.ctx;
    let props = this.props;
    let placeholder = props.placeholder, computedStyle = this.__computedStyle;
    let width = computedStyle[WIDTH], height = computedStyle[HEIGHT];
    // 再测量，可能瞬间完成替换掉上面的
    inject.measureImg(loadImg.src, data => {
      // 还需判断url，防止重复加载时老的替换新的，失败走error绘制
      if(data.url === loadImg.src) {
        loadImg.cache && (loadImg.cache.cache = false);
        loadImg.loading = false;
        function reload() {
          let { __currentStyle: { [WIDTH]: width, [HEIGHT]: height } } = self;
          if(width.u !== AUTO && height.u !== AUTO) {
            root.__addUpdate(self, null, level.REPAINT, false, false, false, false, cb);
          }
          else {
            root.__addUpdate(self, null, level.REFLOW, false, false, false, false, cb);
          }
        }
        if(data.success) {
          loadImg.source = data.source;
          loadImg.width = data.width;
          loadImg.height = data.height;
          if (isFunction(props.onLoad)) {
            props.onLoad();
          }
        }
        else if(placeholder) {
          loadImg.error = true;
          inject.measureImg(placeholder, data => {
            if(data.success) {
              loadImg.source = data.source;
              loadImg.width = data.width;
              loadImg.height = data.height;
              if(computedStyle[DISPLAY] !== 'none' && !self.__isDestroyed) {
                reload();
              }
            }
          }, {
            ctx,
            root,
            width,
            height,
          });
          if (isFunction(props.onError)) {
            props.onError();
          }
          return;
        }
        else {
          loadImg.error = true;
          if (isFunction(props.onError)) {
            props.onError();
          }
        }
        // 可见状态进行刷新操作，visibility某些情况需要刷新，可能宽高未定义要重新布局
        if(computedStyle[DISPLAY] !== 'none' && !self.__isDestroyed) {
          reload();
        }
      }
    });
  }

  updateSrc(v, cb) {
    let loadImg = this.__loadImg;
    // 相等或空且当前error直接返回
    if(v === loadImg.src || this.__isDestroyed || !v && loadImg.error) {
      if(v && v !== loadImg.src) {
        inject.measureImg(v, res => {
          if(loadImg.src === v) {
            let props = this.props;
            if(res.success) {
              if(isFunction(props.onLoad)) {
                props.onLoad();
              }
            }
            else {
              if(isFunction(props.onError)) {
                props.onError();
              }
            }
          }
        });
      }
      loadImg.src = v
      if(isFunction(cb)) {
        cb(true);
      }
      return;
    }
    loadImg.src = v;
    this.__loadAndRefresh(loadImg, cb);
  }

  appendChild() {
    inject.error('Img can not appendChild.');
  }

  get src() {
    return this.__loadImg.src;
  }

  set src(v) {
    this.updateSrc(v, null);
  }

  get isReplaced() {
    return true;
  }

  static showError = true;

  static toWebglCache(gl, root, src, x1, y1, cb) {
    if(!gl || !src) {
      return;
    }
    let loadImg = {
      src,
    };
    let ca = inject.IMG[src];
    if(!ca) {
      inject.measureImg(src, function(ca) {
        loadImg.source = ca.source;
        loadImg.width = loadImg.__width = ca.width;
        loadImg.height = loadImg.__height = ca.height;
        let res = ImgWebglCache.getInstance(mode.CANVAS, gl, root.__uuid, [x1, y1, x1 + loadImg.width, y1 + loadImg.height], loadImg, x1, y1);
        if(isFunction(cb)) {
          cb(res);
        }
      });
    }
    else if(ca.state === inject.LOADED) {
      loadImg.source = ca.source;
      loadImg.width = loadImg.__width = ca.width;
      loadImg.height = loadImg.__height = ca.height;
      let res = ImgWebglCache.getInstance(mode.CANVAS, gl, root.__uuid, [x1, y1, x1 + loadImg.width, y1 + loadImg.height], loadImg, x1, y1);
      if(isFunction(cb)) {
        cb(res);
      }
    }
  }
}

export default Img;
