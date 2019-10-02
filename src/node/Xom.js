import Node from './Node';
import mode from '../mode';
import unit from '../style/unit';
import tf from '../style/transform';
import gradient from '../style/gradient';
import border from '../style/border';
import util from '../util';

function renderBorder(renderMode, points, color, ctx, xom) {
  if(renderMode === mode.CANVAS) {
    points.forEach(point => {
      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.moveTo(point[0], point[1]);
      for(let i = 2, len = point.length; i < len; i += 2) {
        ctx.lineTo(point[i], point[i + 1]);
      }
      ctx.fill();
      ctx.closePath();
    });
  }
  else if(renderMode === mode.SVG) {
    let s = '';
    points.forEach(point => {
      s += `M ${point[0]} ${point[1]}`;
      for(let i = 2, len = point.length; i < len; i += 2) {
        s += `L ${point[i]} ${point[i + 1]} `;
      }
    });
    let item = {
      type: 'item',
      tagName: 'path',
      props: [
        ['d', s],
        ['fill', color],
      ],
    };
    xom.addBorder([
      ['d', s],
      ['fill', color],
    ]);
  }
}

class Xom extends Node {
  constructor(tagName, props) {
    super();
    props = props || [];
    // 构建工具中都是arr，手写可能出现hash情况
    if(Array.isArray(props)) {
      this.props = util.arr2hash(props);
      this.__props = props;
    }
    else {
      this.props = props;
      this.__props = util.hash2arr(props);
    }
    this.__tagName = tagName;
    this.__style = this.props.style || {}; // style被解析后的k-v形式
    this.__listener = {};
    this.__props.forEach(item => {
      let k = item[0];
      if(/^on[a-zA-Z]/.test(k)) {
        this.__listener[k.slice(2).toLowerCase()] = item[1];
      }
    });
    // margin和padding的宽度
    this.__mtw = 0;
    this.__mrw = 0;
    this.__mbw = 0;
    this.__mlw = 0;
    this.__ptw = 0;
    this.__prw = 0;
    this.__pbw = 0;
    this.__plw = 0;
    this.__matrix = null;
    this.__matrixSelf = null;
    this.__tfo = null;
  }

  __layout(data) {
    let { w } = data;
    let { style: {
      display,
      width,
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
      paddingTop,
      paddingRight,
      paddingBottom,
      paddingLeft,
    } } = this;
    if(display === 'none') {
      return;
    }
    if(width && width.unit !== unit.AUTO) {
      switch(width.unit) {
        case unit.PX:
          w = width.value;
          break;
        case unit.PERCENT:
          w *= width.value * 0.01;
          break;
      }
    }
    this.__mlw = this.__mpWidth(marginLeft, w);
    this.__mtw = this.__mpWidth(marginTop, w);
    this.__mrw = this.__mpWidth(marginRight, w);
    this.__mbw = this.__mpWidth(marginBottom, w);
    this.__plw = this.__mpWidth(paddingLeft, w);
    this.__ptw = this.__mpWidth(paddingTop, w);
    this.__prw = this.__mpWidth(paddingRight, w);
    this.__pbw = this.__mpWidth(paddingBottom, w);
    if(display === 'block') {
      this.__layoutBlock(data);
    }
    else if(display === 'flex') {
      this.__layoutFlex(data);
    }
    else if(display === 'inline') {
      this.__layoutInline(data);
    }
  }

  isGeom() {
    return this.tagName.charAt(0) === '$';
  }

  // 获取margin/padding的实际值
  __mpWidth(mp, w) {
    if(mp.unit === unit.PX) {
      return mp.value;
    }
    else if(mp.unit === unit.PERCENT) {
      return mp.value * w * 0.01;
    }
    return 0;
  }

  __preLayout(data) {
    let { x, y, w, h } = data;
    this.__x = x;
    this.__y = y;
    let { style, mlw, mtw, mrw, mbw, plw, ptw, prw, pbw } = this;
    let {
      width,
      height,
      borderTopWidth,
      borderRightWidth,
      borderBottomWidth,
      borderLeftWidth,
    } = style;
    // 除了auto外都是固定宽高度
    let fixedWidth;
    let fixedHeight;
    if(width && width.unit !== unit.AUTO) {
      fixedWidth = true;
      switch(width.unit) {
        case unit.PX:
          w = width.value;
          break;
        case unit.PERCENT:
          w *= width.value * 0.01;
          break;
      }
    }
    if(height && height.unit !== unit.AUTO) {
      fixedHeight = true;
      switch(height.unit) {
        case unit.PX:
          h = height.value;
          break;
        case unit.PERCENT:
          h *= height.value * 0.01;
          break;
      }
    }
    // margin/padding/border影响x和y和尺寸
    x += borderLeftWidth.value + mlw + plw;
    data.x = x;
    y += borderTopWidth.value + mtw + ptw;
    data.y = y;
    if(width.unit === unit.AUTO) {
      w -= borderLeftWidth.value + borderRightWidth.value + mlw + mrw + plw + prw;
    }
    if(height.unit === unit.AUTO) {
      h -= borderTopWidth.value + borderBottomWidth.value + mtw + mbw + ptw + pbw;
    }
    return {
      fixedWidth,
      fixedHeight,
      x,
      y,
      w,
      h,
    };
  }

  render(renderMode) {
    this.__renderMode = renderMode;
    if(renderMode === mode.SVG) {
      this.__virtualDom = {
        bb: [],
        children: [],
        transform: [],
      };
    }
    let { ctx, style, width, height, mlw, mrw, mtw, mbw, plw, ptw, prw, pbw } = this;
    // 恢复默认，防止其它matrix影响
    if(renderMode === mode.CANVAS) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
    let {
      display,
      position,
      top,
      right,
      bottom,
      left,
      backgroundGradient: bgg,
      backgroundColor: bgc,
      borderTopWidth,
      borderTopColor: btc,
      borderTopStyle: bts,
      borderRightWidth,
      borderRightColor: brc,
      borderRightStyle: brs,
      borderBottomWidth,
      borderBottomColor: bbc,
      borderBottomStyle: bbs,
      borderLeftWidth,
      borderLeftColor: blc,
      borderLeftStyle : bls,
      transform,
      transformOrigin,
    } = style;
    if(display === 'none') {
      return;
    }
    // 除root节点外relative渲染时做偏移，百分比基于父元素，若父元素没有一定高则为0
    if(position === 'relative' && this.parent) {
      let { width, height } = this.parent;
      let h = this.parent.style.height;
      if(left.unit !== unit.AUTO) {
        let diff = left.unit === unit.PX ? left.value : left.value * width * 0.01;
        this.__offsetX(diff);
      }
      else if(right.unit !== unit.AUTO) {
        let diff = right.unit === unit.PX ? right.value : right.value * width * 0.01;
        this.__offsetX(-diff);
      }
      if(top.unit !== unit.AUTO) {
        let diff = top.unit === unit.PX ? top.value : top.value * height * 0.01 * (h.unit === unit.AUTO ? 0 : 1);
        this.__offsetY(diff);
      }
      else if(bottom.unit !== unit.AUTO) {
        let diff = bottom.unit === unit.PX ? bottom.value : bottom.value * height * 0.01 * (h.unit === unit.AUTO ? 0 : 1);
        this.__offsetY(-diff);
      }
    }
    // 使用rx和ry渲染位置，考虑了relative和translate影响
    let { rx: x, ry: y } = this;
    let btw = borderTopWidth.value;
    let brw = borderRightWidth.value;
    let bbw = borderBottomWidth.value;
    let blw = borderLeftWidth.value;
    let x1 = x + mlw;
    let x2 = x1 + blw;
    let x3 = x2 + width + plw + prw;
    let x4 = x3 + brw;
    let y1 = y + mtw;
    let y2 = y1 + btw;
    let y3 = y2 + height + ptw + pbw;
    let y4 = y3 + bbw;
    let iw = width + plw + prw;
    let ih = height + ptw + pbw;
    // translate相对于自身
    if(transform) {
      let x4 = x + mlw + blw + iw + brw + mrw;
      let y4 = y + mtw + btw + ih + bbw + mbw;
      let ow = x4 - x;
      let oh = y4 - y;
      let tfo = tf.getOrigin(transformOrigin, x, y, ow, oh);
      let list = tf.normalize(transform, tfo[0], tfo[1], ow, oh);
      let matrixSelf = tf.calMatrix(list, tfo[0], tfo[1]);
      // 单位矩阵无需变换
      if(matrixSelf[0] !== 1
        || matrixSelf[1] !== 0
        || matrixSelf[2] !== 0
        || matrixSelf[3] !== 1
        || matrixSelf[4] !== 0
        || matrixSelf[5] !== 0) {
        this.__tfo = tfo;
        this.__matrixSelf = matrixSelf;
        // canvas的matrix不叠加，需手动计算，另svg绘制自动叠加，但响应事件也需手动计算
        let matrix = matrixSelf;
        let parent = this.parent;
        while(parent) {
          if(parent.matrixSelf) {
            matrix = tf.mergeMatrix(parent.matrixSelf, matrix);
          }
          parent = parent.parent;
        }
        this.__matrix = matrix;
        if(renderMode === mode.CANVAS) {
          ctx.setTransform(...matrix);
        }
        else if(renderMode === mode.SVG) {
          this.addTransform(['matrix', matrixSelf.join(',')]);
        }
      }
    }
    // 先渲染渐变，没有则背景色
    if(bgg) {
      let { k, v } = bgg;
      let cx = x2 + iw * 0.5;
      let cy = y2 + ih * 0.5;
      if(k === 'linear') {
        let deg = gradient.getLinearDeg(v);
        // 需计算角度 https://www.w3cplus.com/css3/do-you-really-understand-css-linear-gradients.html
        let r = util.r2d(deg);
        let length = Math.abs(iw * Math.sin(r)) + Math.abs(ih * Math.cos(r));
        let [xx0, yy0, xx1, yy1] = gradient.calLinearCoords(deg, length * 0.5, cx, cy);
        let list = gradient.getColorStop(v, length);
        if(renderMode === mode.CANVAS) {
          let lg = ctx.createLinearGradient(xx0, yy0, xx1, yy1);
          list.forEach(item => {
            lg.addColorStop(item[1], item[0]);
          });
          ctx.beginPath();
          ctx.fillStyle = lg;
          ctx.rect(x2, y2, iw, ih);
          ctx.fill();
          ctx.closePath();
        }
        else if(renderMode === mode.SVG) {
          let uuid = this.defs.add({
            tagName: 'linearGradient',
            props: [
              ['x1', xx0],
              ['y1', yy0],
              ['x2', xx1],
              ['y2', yy1]
            ],
            stop: list,
          });
          this.addBackground([
            ['x', x2],
            ['y', y2],
            ['width', iw],
            ['height', ih],
            ['fill', `url(#${uuid})`]
          ]);
        }
      }
      else if(k === 'radial') {
        let [r, cx2, cy2] = gradient.calRadialRadius(v, iw, ih, cx, cy, x2, y2, x3, y3);
        // 计算colorStop
        let list = gradient.getColorStop(v, r * 2);
        // 超限情况等同于只显示end的bgc
        if(r <= 0) {
          let end = list[list.length - 1];
          end[1] = 0;
          list = [end];
          cx2 = x2;
          cy2 = y2;
          // 肯定大于最长直径
          r = iw + ih;
        }
        if(renderMode === mode.CANVAS) {
          let rg = ctx.createRadialGradient(cx2, cy2, 0, cx2, cy2, r);
          list.forEach(item => {
            rg.addColorStop(item[1], item[0]);
          });
          ctx.beginPath();
          ctx.fillStyle = rg;
          ctx.rect(x2, y2, iw, ih);
          ctx.fill();
          ctx.closePath();
        }
        else if(renderMode === mode.SVG) {
          let uuid = this.defs.add({
            tagName: 'radialGradient',
            props: [
              ['cx', cx2],
              ['cy', cy2],
              ['r', r]
            ],
            stop: list,
          });
          this.addBackground([
            ['x', x2],
            ['y', y2],
            ['width', iw],
            ['height', ih],
            ['fill', `url(#${uuid})`]
          ]);
        }
      }
    }
    else if(bgc !== 'transparent') {
      if(renderMode === mode.CANVAS) {
        ctx.beginPath();
        ctx.fillStyle = bgc;
        ctx.rect(x2, y2, iw, ih);
        ctx.fill();
        ctx.closePath();
      }
      else if(renderMode === mode.SVG) {
        this.addBackground([
          ['x', x2],
          ['y', y2],
          ['width', iw],
          ['height', ih],
          ['fill', bgc]
        ]);
      }
    }
    // 边框需考虑尖角，两条相交边平分45°夹角
    if(btw > 0 && btc !== 'transparent') {
      let points = [];
      if(['dashed', 'dotted'].indexOf(bts) > -1) {
        // 寻找一个合适的虚线线段长度和之间空白边距长度
        let { n, ps, pd } = border.calDashed(bts, x1, x2, x3, x4, btw);
        if(n <= 1) {
          points.push([x1, y1, x4, y1, x3, y2, x2, y2]);
        }
        else {
          let deg1 = Math.atan(btw / blw);
          let deg2 = Math.atan(btw / brw);
          for(let i = 0; i < n; i++) {
            // 最后一个可能没有到底，延长之
            let isLast = i === n - 1;
            let xx1 = i ? (x1 + ps * i + pd * i) : x1;
            let xx4 = xx1 + ps;
            let yy1;
            let yy2;
            // 整个和borderLeft重叠
            if(xx4 < x2) {
              if(isLast) {
                points.push([x1, y1, x4, y1, x3, y2, x2, y2]);
              }
              else {
                yy1 = y1 + (xx1 - x1) * Math.tan(deg1);
                yy2 = y1 + (xx4 - x1) * Math.tan(deg1);
                points.push([xx1, y1, xx4, y1, xx4, yy2, xx1, yy1]);
              }
            }
            // 整个和borderRight重叠
            else if(xx1 > x3) {
              yy1 = y1 + (x4 - xx1) * Math.tan(deg2);
              yy2 = y1 + (x4 - xx4) * Math.tan(deg2);
              if(isLast) {
                points.push([xx1, y1, x4, y1, xx1, yy1]);
              }
              else {
                points.push([xx1, y1, xx4, y1, xx4, yy2, xx1, yy1]);
              }
            }
            // 不被整个重叠的情况再细分
            else {
              // 上部分和borderLeft重叠
              if(xx1 < x2) {
                yy1 = y1 + (xx1 - x1) * Math.tan(deg1);
                if(isLast) {
                  points.push([xx1, y1, x4, y1, x3, y2, x2, y2, xx1, yy1]);
                }
                else {
                  // 下部分和borderRight重叠
                  if(xx4 > x3) {
                    points.push([xx1, y1, xx4, y1, x3, y2, x2, y2, xx1, yy1]);
                  }
                  // 下部独立
                  else {
                    points.push([xx1, y1, xx4, y1, xx4, y2, x2, y2, xx1, yy1]);
                  }
                }
              }
              // 下部分和borderRight重叠
              else if(xx4 > x3) {
                yy1 = y1 + (x4 - xx4) * Math.tan(deg2);
                // 上部分和borderLeft重叠
                if(xx1 < x2) {
                  if(isLast) {
                    points.push([xx1, y1, x4, y1, x3, y2, x2, y2, xx1, yy1]);
                  }
                  else {
                    points.push([xx1, y1, xx4, y1, xx4, yy1, x3, y2, x2, y2, xx1, yy1]);
                  }
                }
                // 上部独立
                else {
                  if(isLast) {
                    points.push([xx1, y1, x4, y1, x3, y2, xx1, y2]);
                  }
                  else {
                    points.push([xx1, y1, xx4, y1, xx4, yy1, x3, y2, xx1, y2]);
                  }
                }
              }
              // 完全独立
              else {
                if(isLast) {
                  points.push([xx1, y1, x4, y1, x3, y2, xx1, y2]);
                }
                else {
                  points.push([xx1, y1, xx4, y1, xx4, y2, xx1, y2]);
                }
              }
            }
          }
        }
      }
      else {
        points.push([x1, y1, x4, y1, x3, y2, x2, y2]);
      }
      renderBorder(renderMode, points, btc, ctx, this);
    }
    if(brw > 0 && brc !== 'transparent') {
      let points = [];
      if(['dashed', 'dotted'].indexOf(brs) > -1) {
        // 寻找一个合适的虚线线段长度和之间空白边距长度
        let { n, ps, pd } = border.calDashed(brs, y1, y2, y3, y4, brw);
        if(n <= 1) {
          points.push([x3, y2, x4, y1, x4, y4, x3, y3]);
        }
        else {
          let deg1 = Math.atan(brw / btw);
          let deg2 = Math.atan(brw / bbw);
          for(let i = 0; i < n; i++) {
            // 最后一个可能没有到底，延长之
            let isLast = i === n - 1;
            let yy1 = i ? (y1 + ps * i + pd * i) : y1;
            let yy4 = yy1 + ps;
            let xx1;
            let xx2;
            // 整个和borderTop重叠
            if(yy4 < y2) {
              if(isLast) {
                points.push([x3, y2, x4, y1, x4, y4, x3, y3]);
              }
              else {
                xx1 = x4 - (yy4 - y1) * Math.tan(deg1);
                xx2 = x4 - (yy1 - y1) * Math.tan(deg1);
                points.push([xx1, yy4, xx2, yy1, x4, yy1, x4, yy4]);
              }
            }
            // 整个和borderBottom重叠
            else if(yy1 > y3) {
              xx1 = x3 + (yy1 - y3) * Math.tan(deg2);
              xx2 = x3 + (yy4 - y3) * Math.tan(deg2);
              if(isLast) {
                points.push([xx1, yy1, x4, yy1, x4, y4]);
              }
              else {
                points.push([xx1, yy1, x4, yy1, x4, yy4, xx2, yy4]);
              }
            }
            // 不被整个重叠的情况再细分
            else {
              // 上部分和borderTop重叠
              if(yy1 < y2) {
                xx1 = x3 + (y2 - yy1) * Math.tan(deg1);
                if(isLast) {
                  points.push([x3, y2, xx1, yy1, x4, yy1, x4, y4, x3, y4]);
                }
                else {
                  // 下部分和borderBottom重叠
                  if(yy4 > y3) {
                    points.push([x3, y2, xx1, yy1, x4, yy1, x4, yy4, xx1, yy4, x3, y3]);
                  }
                  // 下部独立
                  else {
                    points.push([x3, y2, xx1, yy1, x4, yy1, x4, yy4, x3, yy4]);
                  }
                }
              }
              // 下部分和borderBottom重叠
              else if(yy4 > y3) {
                xx1 = x3 + (yy4 - y3) * Math.tan(deg2);
                // 上部分和borderTop重叠
                if(yy1 < y2) {
                  if(isLast) {
                    points.push([x3, y2, xx1, yy1, x4, yy1, x4, y4, x3, y3]);
                  }
                  else {
                    points.push([x3, y2, xx1, yy1, x4, yy1, x4, yy4, xx1, yy4, x3, y3]);
                  }
                }
                // 上部独立
                else {
                  if(isLast) {
                    points.push([x3, yy1, x4, yy1, x4, y4, x3, y3]);
                  }
                  else {
                    points.push([x3, yy1, x4, yy1, x4, yy4, xx1, yy4, x3, y3]);
                  }
                }
              }
              // 完全独立
              else {
                if(isLast) {
                  points.push([x3, yy1, x4, yy1, x4, y4, x3, y3]);
                }
                else {
                  points.push([x3, yy1, x4, yy1, x4, yy4, x3, yy4]);
                }
              }
            }
          }
        }
      }
      else {
        points.push([x3, y2, x4, y1, x4, y4, x3, y3]);
      }
      renderBorder(renderMode, points, brc, ctx, this);
    }
    if(bbw > 0 && bbc !== 'transparent') {
      let points = [];
      // 寻找一个合适的虚线线段长度和之间空白边距长度
      if(['dashed', 'dotted'].indexOf(bbs) > -1) {
        // 寻找一个合适的虚线线段长度和之间空白边距长度
        let { n, ps, pd } = border.calDashed(bbs, x1, x2, x3, x4, bbw);
        let deg1 = Math.atan(bbw / blw);
        let deg2 = Math.atan(bbw / brw);
        for(let i = 0; i < n; i++) {
          // 最后一个可能没有到底，延长之
          let isLast = i === n - 1;
          let xx1 = i ? (x1 + ps * i + pd * i) : x1;
          let xx4 = xx1 + ps;
          let yy1;
          let yy2;
          // 整个和borderLeft重叠
          if(xx4 < x2) {
            if(isLast) {
              points.push([x1, y4, x2, y3, x3, y3, x4, y4]);
            }
            else {
              yy1 = y4 - (xx1 - x1) * Math.tan(deg1);
              yy2 = y4 - (xx4 - x1) * Math.tan(deg1);
              points.push([xx1, yy1, xx4, yy2, xx4, y4, xx1, y4]);
            }
          }
          // 整个和borderRight重叠
          else if(xx1 > x3) {
            yy1 = y4 - (xx1 - x1) * Math.tan(deg2);
            yy2 = y4 - (xx4 - x1) * Math.tan(deg2);
            if(isLast) {
              points.push([xx1, yy1, x4, y4, xx1, y4]);
            }
            else {
              points.push([xx1, yy1, xx4, yy2, xx4, y4, xx1, y4]);
            }
          }
          // 不被整个重叠的情况再细分
          else {
            // 上部分和borderLeft重叠
            if(xx1 < x2) {
              yy1 = y3 + (xx1 - x1) * Math.tan(deg1);
              if(isLast) {
                points.push([xx1, yy1, x2, y3, x3, y3, x4, y4, xx1, y4]);
              }
              else {
                // 下部分和borderRight重叠
                if(xx4 > x3) {
                  points.push([xx1, yy1, x2, y3, x3, y3, xx4, y4, xx1, y4]);
                }
                // 下部独立
                else {
                  points.push([xx1, yy1, x2, y3, xx4, y3, xx4, y4, xx1, y4]);
                }
              }
            }
            // 下部分和borderRight重叠
            else if(xx4 > x3) {
              yy1 = y4 - (x4 - xx4) * Math.tan(deg2);
              // 上部分和borderLeft重叠
              if(xx1 < x2) {
                if(isLast) {
                  points.push([xx1, yy1, x3, y3, x4, y4, xx1, y4]);
                }
                else {
                  points.push([xx1, yy1, x3, y3, xx4, yy1, xx4, y4, xx1, y4]);
                }
              }
              // 上部独立
              else {
                if(isLast) {
                  points.push([xx1, y3, x3, y3, x4, y4, xx1, y4]);
                }
                else {
                  points.push([xx1, y3, x3, y3, xx4, yy1, xx4, y4, xx1, y4]);
                }
              }
            }
            // 完全独立
            else {
              if(isLast) {
                points.push([xx1, y3, x3, y3, x4, y4, xx1, y4]);
              }
              else {
                points.push([xx1, y3, xx4, y3, xx4, y4, xx1, y4]);
              }
            }
          }
        }
      }
      else {
        points.push([x1, y4, x2, y3, x3, y3, x4, y4]);
      }
      renderBorder(renderMode, points, bbc, ctx, this);
    }
    if(blw > 0 && blc !== 'transparent') {
      let points = [];
      if(['dashed', 'dotted'].indexOf(bls) > -1) {
        // 寻找一个合适的虚线线段长度和之间空白边距长度
        let { n, ps, pd } = border.calDashed(bls, y1, y2, y3, y4, blw);
        if(n <= 1) {
          points.push([x1, y1, x2, y2, x2, y3, x1, y4]);
        }
        else {
          let deg1 = Math.atan(blw / btw);
          let deg2 = Math.atan(blw / bbw);
          for(let i = 0; i < n; i++) {
            // 最后一个可能没有到底，延长之
            let isLast = i === n - 1;
            let yy1 = i ? (y1 + ps * i + pd * i) : y1;
            let yy4 = yy1 + ps;
            let xx1;
            let xx2;
            // 整个和borderTop重叠
            if(yy4 < y2) {
              if(isLast) {
                points.push([x1, y1, x2, y2, x2, y3, x1, y4]);
              }
              else {
                xx1 = x1 + (yy1 - y1) * Math.tan(deg1);
                xx2 = x1 + (yy4 - y1) * Math.tan(deg1);
                points.push([x1, yy1, xx1, yy1, xx2, yy4, x1, yy4]);
              }
            }
            // 整个和borderBottom重叠
            else if(yy1 > y3) {
              xx1 = x1 + (y4 - yy1) * Math.tan(deg2);
              xx2 = x1 + (y4 - yy4) * Math.tan(deg2);
              if(isLast) {
                points.push([x1, yy1, xx1, yy1, x1, y4]);
              }
              else {
                points.push([x1, yy1, xx1, yy1, xx2, yy4, x1, yy4]);
              }
            }
            // 不被整个重叠的情况再细分
            else {
              // 上部分和borderTop重叠
              if(yy1 < y2) {
                xx1 = x1 + (yy1 - y1) * Math.tan(deg1);
                if(isLast) {
                  points.push([x1, yy1, xx1, yy1, x2, y2, x2, y3, x1, y4]);
                }
                else {
                  // 下部分和borderBottom重叠
                  if(yy4 > y3) {
                    points.push([x1, yy1, xx1, yy1, x2, y2, x2, y3, xx1, yy4, x1, yy4]);
                  }
                  // 下部独立
                  else {
                    points.push([x1, yy1, xx1, yy1, x2, y2, x2, yy4, x1, yy4]);
                  }
                }
              }
              // 下部分和borderBottom重叠
              else if(yy4 > y3) {
                xx1 = x1 + (y4 - yy4) * Math.tan(deg2);
                // 上部分和borderTop重叠
                if(yy1 < y2) {
                  if(isLast) {
                    points.push([x1, yy1, xx1, yy1, x2, y2, x2, y3, x1, y4]);
                  }
                  else {
                    points.push([x1, yy1, xx1, yy1, x2, y2, x2, y3, xx1, yy4, x1, yy4]);
                  }
                }
                // 上部独立
                else {
                  if(isLast) {
                    points.push([x1, yy1, x2, yy1, x2, y3, x1, y4]);
                  }
                  else {
                    points.push([x1, yy1, x2, yy1, x2, y3, xx1, yy4, x1, yy4]);
                  }
                }
              }
              // 完全独立
              else {
                if(isLast) {
                  points.push([x1, yy1, x2, yy1, x2, y3, x1, y4]);
                }
                else {
                  points.push([x1, yy1, x2, yy1, x2, yy4, x1, yy4]);
                }
              }
            }
          }
        }
      }
      else {
        points.push([x1, y1, x2, y2, x2, y3, x1, y4]);
      }
      renderBorder(renderMode, points, blc, ctx, this);
    }
  }

  // 先查找到注册了事件的节点，再捕获冒泡判断增加性能
  __emitEvent(e, force) {
    let { event: { type }, x, y, covers } = e;
    let { listener, children, style, outerWidth, outerHeight, matrix } = this;
    if(style.display === 'none') {
      return;
    }
    let cb;
    if(listener.hasOwnProperty(type)) {
      cb = listener[type];
    }
    // touchend之类强制的直接通知即可
    if(force) {
      children.forEach(child => {
        if(child instanceof Xom && !child.isGeom()) {
          child.__emitEvent(e, force);
        }
      });
      cb && cb(e);
      return;
    }
    let childWillResponse;
    if(!this.isGeom()) {
      // 先响应absolute/relative高优先级，从后往前遮挡顺序
      for(let i = children.length - 1; i >= 0; i--) {
        let child = children[i];
        if(child instanceof Xom && ['absolute', 'relative'].indexOf(child.style.position) > -1) {
          if(child.__emitEvent(e)) {
            childWillResponse = true;
          }
        }
      }
      // 再看普通流，从后往前遮挡顺序
      for(let i = children.length - 1; i >= 0; i--) {
        let child = children[i];
        if(child instanceof Xom && ['absolute', 'relative'].indexOf(child.style.position) === -1) {
          if(child.__emitEvent(e)) {
            childWillResponse = true;
          }
        }
      }
    }
    // child触发则parent一定触发，否则判断事件坐标是否在节点内且未被遮挡
    if(childWillResponse || this.willResponseEvent(e)) {
      // 根据是否matrix存入遮罩坐标
      covers.push({
        x,
        y,
        w: outerWidth,
        h: outerHeight,
        matrix,
      });
      if(!e.target) {
        e.target = this;
      }
      cb && cb(e);
    }
  }

  willResponseEvent(e) {
    let { x, y, covers } = e;
    let { rx, ry, outerWidth, outerHeight, matrix } = this;
    let inThis = tf.pointInQuadrilateral(x - rx, y - ry,
      0, 0,
      outerWidth,0,
      0, outerHeight,
      outerWidth, outerHeight,
      matrix);
    if(inThis) {
      // 不能被遮挡
      for(let i = 0, len = covers.length; i < len; i++) {
        let { x: x2, y: y2, w, h, matrix } = covers[i];
        if(tf.pointInQuadrilateral(x - rx, y - ry,
          x2 - rx, y2 - ry,
          x2 - rx + w,y2 - ry,
          x2 - rx, y2 - ry + h,
          x2 - rx + w, y2 - ry + h,
          matrix)
        ) {
          return;
        }
      }
      if(!e.target) {
        e.target = this;
      }
      return true;
    }
  }

  addBorder(props) {
    this.virtualDom.bb.push({
      type: 'item',
      tagName: 'path',
      props,
    });
  }

  addBackground(props) {
    this.virtualDom.bb.push({
      type: 'item',
      tagName: 'rect',
      props,
    });
  }

  addTransform(props) {
    this.virtualDom.transform.push(props);
  }

  get tagName() {
    return this.__tagName;
  }
  get mtw() {
    return this.__mtw;
  }
  get mrw() {
    return this.__mrw;
  }
  get mbw() {
    return this.__mbw;
  }
  get mlw() {
    return this.__mlw;
  }
  get ptw() {
    return this.__ptw;
  }
  get prw() {
    return this.__prw;
  }
  get pbw() {
    return this.__pbw;
  }
  get plw() {
    return this.__plw;
  }
  get outerWidth() {
    let { mlw, mrw, plw, prw, style: {
      borderLeftWidth,
      borderRightWidth,
    } } = this;
    return this.width
      + borderLeftWidth.value
      + borderRightWidth.value
      + mlw
      + mrw
      + plw
      + prw;
  }
  get outerHeight() {
    let { mtw, mbw, ptw, pbw, style: {
      borderTopWidth,
      borderBottomWidth,
    } } = this;
    return this.height
      + borderTopWidth.value
      + borderBottomWidth.value
      + mtw
      + mbw
      + ptw
      + pbw;
  }
  get listener() {
    return this.__listener;
  }
  get renderMode() {
    return this.__renderMode;
  }
  get matrix() {
    return this.__matrix;
  }
  get matrixSelf() {
    return this.__matrixSelf;
  }
  get tfo() {
    return this.__tfo;
  }
}

export default Xom;
