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
import mx from '../math/matrix';

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
    MARGIN_TOP,
    MARGIN_RIGHT,
    MARGIN_BOTTOM,
    MARGIN_LEFT,
    PADDING_TOP,
    PADDING_RIGHT,
    PADDING_BOTTOM,
    PADDING_LEFT,
    FONT_SIZE,
    FLEX_BASIS,
  },
  UPDATE_KEY: {
    UPDATE_NODE,
    UPDATE_FOCUS,
    UPDATE_CONFIG,
  },
  NODE_KEY: {
    NODE_CACHE,
    NODE_DEFS_CACHE,
    NODE_IS_MASK,
  },
} = enums;
const { AUTO, PX, PERCENT, REM, VW, VH, RGBA } = unit;
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
    let config = this.__config;
    if(config[NODE_IS_MASK]) {
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
      let src = loadImg.src;
      let cache = inject.IMG[src];
      if(cache && cache.state === inject.LOADED) {
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
    this.__task = null;
  }

  // img根据加载情况更新__hasContent
  __calContent(renderMode, lv, currentStyle, computedStyle) {
    let res = super.__calContent(renderMode, lv, currentStyle, computedStyle);
    if(!res) {
      let {
        __loadImg: loadImg,
      } = this;
      if(computedStyle[VISIBILITY] !== 'hidden' && (computedStyle[WIDTH] || computedStyle[HEIGHT])
        && loadImg.source) {
        res = true;
      }
    }
    return res;
  }

  render(renderMode, lv, ctx, cache) {
    let res = super.render(renderMode, lv, ctx, cache);
    let {
      offscreenBlend, offscreenMask, offscreenFilter, offscreenOverflow,
    } = res;
    let {
      width, height, isDestroyed,
      props: {
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
    if(offscreenBlend) {
      ctx = offscreenBlend.target.ctx;
    }
    if(offscreenMask) {
      ctx = offscreenMask.target.ctx;
    }
    if(offscreenFilter) {
      ctx = offscreenFilter.target.ctx;
    }
    if(offscreenOverflow) {
      ctx = offscreenOverflow.target.ctx;
    }
    // 没source且不error时加载图片
    if(!loadImg.source && !loadImg.error && !loadImg.loading) {
      this.__loadAndRefresh(loadImg, root, ctx, placeholder, computedStyle, width, height);
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
      if(renderMode === mode.CANVAS || renderMode === mode.WEBGL) {
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
    else if(source) {
      // 圆角需要生成一个mask
      let list = border.calRadius(originX, originY, width, height,
        borderTopLeftRadius, borderTopRightRadius, borderBottomRightRadius, borderBottomLeftRadius);
      if(renderMode === mode.CANVAS || renderMode === mode.WEBGL) {
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
            let id = ctx.add(v);
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
          __config[NODE_DEFS_CACHE].push(v);
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

  // img没加载时，清空，这样Xom就认为没内容不生成cache，防止img先绘制cache再绘制主屏，重复
  __releaseWhenEmpty(__cache) {
    if(!this.__loadImg.error && !this.__loadImg.source) {
      return super.__releaseWhenEmpty(__cache);
    }
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
      [BORDER_LEFT_WIDTH]: borderLeftWidth,
      [BORDER_RIGHT_WIDTH]: borderRightWidth,
    } } = this;
    if(width[1] === PX) {
      w -= width[0];
    }
    else if(width[1] === PERCENT) {
      w -= total * width[0] * 0.01;
    }
    else if(width[1] === REM) {
      w -= width[0] * this.root.computedStyle[FONT_SIZE];
    }
    else if(width[1] === VW) {
      w -= width[0] * this.root.width * 0.01;
    }
    else if(width[1] === VH) {
      w -= width[0] * this.root.height * 0.01;
    }
    else {
      let loadImg = this.__loadImg;
      // 加载成功计算缩放后的宽度
      if(loadImg.source) {
        if(height[1] === PX) {
          w -= loadImg.width * height[0] / loadImg.height;
        }
        else if(height[1] === PERCENT) {
          w -= loadImg.width * height[0] * total * 0.01 / loadImg.height;
        }
        else if(height[1] === REM) {
          w -= loadImg.width * height[0] * this.root.computedStyle[FONT_SIZE] / loadImg.height;
        }
        else if(height[1] === VW) {
          w -= loadImg.width * height[0] * this.root.width * 0.01 / loadImg.height;
        }
        else if(height[1] === VH) {
          w -= loadImg.width * height[0] * this.root.height * 0.01 / loadImg.height;
        }
        else {
          w -= loadImg.width;
        }
      }
    }
    // 减去水平mbp
    if(marginLeft[1] === PX) {
      w -= marginLeft[0];
    }
    else if(marginLeft[1] === PERCENT) {
      w -= marginLeft[0] * total * 0.01;
    }
    else if(marginLeft[1] === REM) {
      w -= marginLeft[0] * this.root.computedStyle[FONT_SIZE];
    }
    else if(marginLeft[1] === VW) {
      w -= marginLeft[0] * this.root.width * 0.01;
    }
    else if(marginLeft[1] === VH) {
      w -= marginLeft[0] * this.root.height * 0.01;
    }
    if(paddingLeft[1] === PX) {
      w -= paddingLeft[0];
    }
    else if(paddingLeft[1] === PERCENT) {
      w -= paddingLeft[0] * total * 0.01;
    }
    else if(paddingLeft[1] === REM) {
      w -= paddingLeft[0] * this.root.computedStyle[FONT_SIZE];
    }
    else if(paddingLeft[1] === VW) {
      w -= paddingLeft[0] * this.root.width * 0.01;
    }
    else if(paddingLeft[1] === VH) {
      w -= paddingLeft[0] * this.root.height * 0.01;
    }
    if(borderLeftWidth[1] === PX) {
      w -= borderLeftWidth[0];
    }
    else if(borderLeftWidth[1] === REM) {
      w -= borderLeftWidth[0] * this.root.computedStyle[FONT_SIZE];
    }
    else if(borderLeftWidth[1] === VW) {
      w -= borderLeftWidth[0] * this.root.width * 0.01;
    }
    else if(borderLeftWidth[1] === VH) {
      w -= borderLeftWidth[0] * this.root.height * 0.01;
    }
    if(marginRight[1] === PX) {
      w -= marginRight[0];
    }
    else if(marginRight[1] === PERCENT) {
      w -= marginRight[0] * total * 0.01;
    }
    else if(marginRight[1] === REM) {
      w -= marginRight[0] * this.root.computedStyle[FONT_SIZE];
    }
    else if(marginRight[1] === VW) {
      w -= marginRight[0] * this.root.width * 0.01;
    }
    else if(marginRight[1] === VH) {
      w -= marginRight[0] * this.root.height * 0.01;
    }
    if(paddingRight[1] === PX) {
      w -= paddingRight[0];
    }
    else if(paddingRight[1] === PERCENT) {
      w -= paddingRight[0] * total * 0.01;
    }
    else if(paddingRight[1] === REM) {
      w -= paddingRight[0] * this.root.computedStyle[FONT_SIZE];
    }
    else if(paddingRight[1] === VW) {
      w -= paddingRight[0] * this.root.width * 0.01;
    }
    else if(paddingRight[1] === VH) {
      w -= paddingRight[0] * this.root.height * 0.01;
    }
    if(borderRightWidth[1] === PX) {
      w -= borderRightWidth[0];
    }
    else if(borderRightWidth[1] === REM) {
      w -= borderRightWidth[0] * this.root.computedStyle[FONT_SIZE];
    }
    else if(borderRightWidth[1] === VW) {
      w -= borderRightWidth[0] * this.root.width * 0.01;
    }
    else if(borderRightWidth[1] === VH) {
      w -= borderRightWidth[0] * this.root.height * 0.01;
    }
    return w;
  }

  __calBasis(isDirectionRow, data) {
    let b = 0;
    let min = 0;
    let max = 0;
    let { currentStyle, __loadImg } = this;
    let { w, h } = data;
    // 计算需考虑style的属性
    let {
      [FLEX_BASIS]: flexBasis,
      [WIDTH]: width,
      [HEIGHT]: height,
      [MARGIN_LEFT]: marginLeft,
      [MARGIN_TOP]: marginTop,
      [MARGIN_RIGHT]: marginRight,
      [MARGIN_BOTTOM]: marginBottom,
      [PADDING_LEFT]: paddingLeft,
      [PADDING_TOP]: paddingTop,
      [PADDING_RIGHT]: paddingRight,
      [PADDING_BOTTOM]: paddingBottom,
      [BORDER_TOP_WIDTH]: borderTopWidth,
      [BORDER_RIGHT_WIDTH]: borderRightWidth,
      [BORDER_BOTTOM_WIDTH]: borderBottomWidth,
      [BORDER_LEFT_WIDTH]: borderLeftWidth,
    } = currentStyle;
    let main = isDirectionRow ? width : height;
    let cross = isDirectionRow ? height : width;
    // basis3种情况：auto、固定、content，只区分固定和其它
    let isFixed = [PX, PERCENT, REM, VW, VH].indexOf(flexBasis[1]) > -1;
    if(isFixed) {
      if(flexBasis[1] === PX) {
        b = max = min = flexBasis[0];
      }
      else if(flexBasis[1] === PERCENT) {
        b = max = min = flexBasis[0] * 0.01 * (isDirectionRow ? w : h);
      }
      else if(flexBasis[1] === REM) {
        b = max = min = flexBasis[0] * this.root.computedStyle[FONT_SIZE];
      }
      else if(flexBasis[1] === VW) {
        b = max = min = flexBasis[0] * this.root.width * 0.01;
      }
      else if(flexBasis[1] === VH) {
        b = max = min = flexBasis[0] * this.root.height * 0.01;
      }
    }
    else if(([PX, PERCENT, REM, VW, VH].indexOf(main[1]) > -1)) {
      if(main[1] === PX) {
        b = max = min = main[0];
      }
      else if(main[1] === PERCENT) {
        b = max = min = main[0] * 0.01 * (isDirectionRow ? w : h);
      }
      else if(main[1] === REM) {
        b = max = min = main[0] * this.root.computedStyle[FONT_SIZE];
      }
      else if(main[1] === VW) {
        b = max = min = main[0] * this.root.width * 0.01;
      }
      else if(main[1] === VH) {
        b = max = min = main[0] * this.root.height * 0.01;
      }
    }
    // auto和content固定尺寸比例计算
    else if(__loadImg.source || __loadImg.error) {
      if(cross[1] !== AUTO) {
        if(cross[1] === PX) {
          cross = cross[0];
        }
        else if(cross[1] === PERCENT) {
          cross = cross[0] * 0.01 * (isDirectionRow ? h : w);
        }
        else if(cross[1] === REM) {
          cross = cross[0] * this.root.computedStyle[FONT_SIZE];
        }
        else if(cross[1] === VW) {
          cross = cross[0] * this.root.width * 0.01;
        }
        else if(cross[1] === VH) {
          cross = cross[0] * this.root.height * 0.01;
        }
        let ratio = __loadImg.width / __loadImg.height;
        b = max = min = isDirectionRow ? cross * ratio : cross / ratio;
      }
      else {
        b = max = min = isDirectionRow ? __loadImg.width : __loadImg.height;
      }
    }
    // border也得计算在内
    if(isDirectionRow) {
      let mp = this.__calMp(marginLeft, w)
        + this.__calMp(marginRight, w)
        + this.__calMp(paddingLeft, w)
        + this.__calMp(paddingRight, w);
      let w2 = borderLeftWidth[0] + borderRightWidth[0] + mp;
      b += w2;
      max += w2;
      min += w2;
    }
    else {
      let mp = this.__calMp(marginTop, w)
        + this.__calMp(marginBottom, w)
        + this.__calMp(paddingTop, w)
        + this.__calMp(paddingBottom, w);
      let h2 = borderTopWidth[0] + borderBottomWidth[0] + mp;
      b += h2;
      max += h2;
      min += h2;
    }
    return [b, min, max];
  }

  __loadAndRefresh(loadImg, root, ctx, placeholder, computedStyle, width, height, cb) {
    let self = this;
    // 先清空之前可能的
    if(loadImg.source || loadImg.error) {
      root.delRefreshTask(self.__task);
      root.addRefreshTask(self.__task = {
        __before() {
          self.__task = null; // 清除在before，防止after的回调增加新的task误删
          if(self.isDestroyed) {
            return;
          }
          // 刷新前统一赋值，由刷新逻辑计算最终值避免优先级覆盖问题
          let res = {};
          res[UPDATE_NODE] = self;
          res[UPDATE_FOCUS] = level.REFLOW;  // 没有样式变化但内容尺寸发生了变化强制执行
          res[UPDATE_CONFIG] = self.__config;
          root.__addUpdate(self, self.__config, root, root.__config, res);
        },
      });
      loadImg.source = null;
    }
    loadImg.loading = true;
    // 再测量，可能瞬间完成替换掉上面的
    inject.measureImg(loadImg.src, data => {
      // 还需判断url，防止重复加载时老的替换新的，失败走error绘制
      if(data.url === loadImg.src && !self.isDestroyed) {
        loadImg.cache && (loadImg.cache.cache = false);
        loadImg.loading = false;
        function reload() {
          let { currentStyle: { [WIDTH]: width, [HEIGHT]: height } } = self;
          root.delRefreshTask(self.__task);
          if(width[1] !== AUTO && height[1] !== AUTO) {
            root.addRefreshTask(self.__task = {
              __before() {
                self.__task = null;
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
              __after() {
                if(isFunction(cb)) {
                  cb.call(self);
                }
              },
            });
          }
          else {
            root.addRefreshTask(self.__task = {
              __before() {
                self.__task = null;
                if(self.isDestroyed) {
                  return;
                }
                // 刷新前统一赋值，由刷新逻辑计算最终值避免优先级覆盖问题
                let res = {};
                res[UPDATE_NODE] = self;
                res[UPDATE_FOCUS] = level.REFLOW;  // 没有样式变化但内容尺寸发生了变化强制执行
                res[UPDATE_CONFIG] = self.__config;
                root.__addUpdate(self, self.__config, root, root.__config, res);
              },
              __after() {
                if(isFunction(cb)) {
                  cb.call(self);
                }
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

  updateSrc(v, cb) {
    let self = this;
    let loadImg = self.__loadImg;
    let root = this.root;
    // 相等或空且当前error直接返回
    if(v === loadImg.src || !v && loadImg.error) {
      if(isFunction(cb)) {
        cb.call(self);
      }
    }
    else if(v) {
      loadImg.src = v;
      self.__loadAndRefresh(loadImg, root, root.ctx, self.props.placeholder, self.computedStyle, self.width, self.height, cb);
    }
    else {
      loadImg.src = v;
      loadImg.source = null;
      loadImg.error = true;
      root.delRefreshTask(self.__task);
      root.addRefreshTask(self.__task = {
        __before() {
          self.__task = null;
          if(self.isDestroyed) {
            return;
          }
          let res = {};
          res[UPDATE_NODE] = self;
          res[UPDATE_FOCUS] = level.REFLOW;
          res[UPDATE_CONFIG] = self.__config;
          root.__addUpdate(self, self.__config, root, self.__config, res);
        },
        __after() {
          if(isFunction(cb)) {
            cb.call(self);
          }
        },
      });
    }
  }

  appendChild() {
    inject.error('Img can not appendChild.');
  }

  get src() {
    return this.__loadImg.src;
  }

  static showError = true;
}

export default Img;
