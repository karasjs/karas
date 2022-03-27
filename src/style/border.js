import geom from '../math/geom';
import mode from '../refresh/mode';
import painter from '../util/painter';
import enums from '../util/enums';
import unit from './unit';
import Ellipsis from '../node/Ellipsis';

const { H } = geom;
const { PX, PERCENT, REM, VW, VH, VMAX, VMIN } = unit;
const { canvasPolygon, svgPolygon } = painter;
const {
  STYLE_KEY: {
    BORDER_LEFT_WIDTH,
    BORDER_TOP_WIDTH,
    BORDER_BOTTOM_WIDTH,
    PADDING_LEFT,
    PADDING_BOTTOM,
    PADDING_TOP,
    BORDER_TOP_LEFT_RADIUS,
    BORDER_TOP_RIGHT_RADIUS,
    BORDER_BOTTOM_LEFT_RADIUS,
    BORDER_BOTTOM_RIGHT_RADIUS,
    FONT_SIZE,
  },
} = enums;

/* 获取合适的虚线实体空白宽度ps/pd和数量n
 * 总长total，start边长bs，end边长be，内容长w，
 * 实体长范围[smin,smax]，空白长范围[dmin,dmax]
 */
function calFitDashed(total, bs, be, w, smin, smax, dmin, dmax) {
  let n = 1;
  let ps = 1;
  let pd = 1;
  // 从最大实体空白长开始尝试
  outer:
  for(let i = smax; i >= smin; i--) {
    for(let j = dmax; j >= dmin; j--) {
      // 已知实体空白长度，n实体和n-1空白组成total，计算获取n数量
      let per = i + j;
      let num = Math.floor((total + j) / per);
      let k = j;
      // 可能除不尽，此时扩展空白长
      if(num * per < j + total) {
        let free = total - num * i;
        k = free / (num - 1);
        if(k > dmax) {
          continue;
        }
      }
      per = i + k;
      // bs比实体大才有效，因为小的话必定和第一个实体完整相连
      if(bs > 1 && bs > i) {
        let mo = bs % per;
        if(mo > i) {
          continue;
        }
        if(be > 1) {
          let mo = (bs + w) % per;
          if(mo > i) {
            continue;
          }
        }
      }
      if(be > 1) {
        let mo = (bs + w) % per;
        if(mo > i) {
          continue;
        }
      }
      if(num > 0) {
        n = num;
        ps = i;
        pd = k;
      }
      break outer;
    }
  }
  return {
    n,
    ps,
    pd,
  };
}

// dashed时n个实线和n-1虚线默认以3:1宽度组成，dotted则是n和n以1:1组成
function calDashed(style, m1, m2, m3, m4, bw) {
  let total = m4 - m1;
  let w = m3 - m2;
  let bs = m2 - m1;
  let be = m4 - m3;
  if(style === 'dotted') {
    return calFitDashed(total, bs, be, w, bw, bw, Math.max(1, bw * 0.25), bw * 2);
  }
  else {
    let { n, ps, pd } = calFitDashed(total, bs, be, w, bw, bw * 3, Math.max(1, bw * 0.25), bw * 2);
    if(n === 1) {
      return calFitDashed(total, bs, be, w, bw, bw, Math.max(1, bw * 0.25), bw * 2);
    }
    // 降级为dotted
    return { n, ps, pd };
  }
}

// 获取边框分割为几块的坐标，虚线分割为若干四边形、三边型、五边形
// 三边形重复内外边交点形成四边形，五边形进行切割形成2个四边形
// direction为上右下左0123
function calPoints(borderWidth, borderStyle, deg1, deg2, x1, x2, x3, x4, y1, y2, y3, y4, direction, beginRadius, endRadius) {
  let points = [];
  if(borderStyle === 'none') {
    return points;
  }
  if(['dashed', 'dotted'].indexOf(borderStyle) > -1) {
    // 寻找一个合适的虚线线段长度和之间空白边距长度
    let { n, ps, pd } = (direction === 0 || direction === 2)
      ? calDashed(borderStyle, x1, x2, x3, x4, borderWidth)
      : calDashed(borderStyle, y1, y2, y3, y4, borderWidth);
    if(n > 1) {
      for(let i = 0; i < n; i++) {
        // 最后一个可能没有到底，延长之
        let isLast = i === n - 1;
        let main1;
        let main2;
        let cross1;
        let cross2;
        if(direction === 0 || direction === 2) {
          main1 = i ? (x1 + ps * i + pd * i) : x1;
        }
        else {
          main1 = i ? (y1 + ps * i + pd * i) : y1;
        }
        main2 = main1 + ps;
        if(direction === 0) {
          // 整个和borderLeft重叠
          if(main2 <= x2) {
            if(isLast) {
              points.push([
                [x1, y1],
                [x4, y1],
                [x3, y2],
                [x2, y2]
              ]);
            }
            else {
              cross1 = y1 + (main1 - x1) * Math.tan(deg1);
              cross2 = y1 + (main2 - x1) * Math.tan(deg1);
              points.push([
                [main1, y1],
                [main2, y1],
                [main2, cross2],
                [main1, cross1]
              ]);
            }
          }
          // 整个和borderRight重叠
          else if(main1 >= x3) {
            cross1 = y1 + (x4 - main1) * Math.tan(deg2);
            cross2 = y1 + (x4 - main2) * Math.tan(deg2);
            if(isLast) {
              points.push([
                [main1, y1],
                [x4, y1],
                [x4, y1],
                [main1, cross1]
              ]);
            }
            else {
              points.push([
                [main1, y1],
                [main2, y1],
                [main2, cross2],
                [main1, cross1]
              ]);
            }
          }
          // 不被整个重叠的情况再细分
          else {
            // 上部分和borderLeft重叠
            if(main1 < x2) {
              cross1 = y1 + (main1 - x1) * Math.tan(deg1);
              points.push([
                [main1, y1],
                [x2, y1],
                [x2, y2],
                [main1, cross1]
              ]);
              if(isLast) {
                points.push([
                  [x2, y1],
                  [x3, y1],
                  [x3, y2],
                  [x2, y2]
                ]);
                points.push([
                  [x3, y1],
                  [x4, y1],
                  [x4, y1],
                  [x2, y2]
                ]);
              }
              else {
                // 下部分和borderRight重叠
                if(main2 > x3) {
                  cross2 = y1 + (x4 - main2) * Math.tan(deg2);
                  points.push([
                    [x2, y1],
                    [x3, y1],
                    [x3, y2],
                    [x2, y2]
                  ]);
                  points.push([
                    [x3, y1],
                    [main2, y1],
                    [main2, cross2],
                    [x3, y2]
                  ]);
                }
                // 下部独立
                else {
                  points.push([
                    [x2, y1],
                    [main2, y1],
                    [main2, y2],
                    [x2, y2]
                  ]);
                }
              }
            }
            // 下部分和borderRight重叠
            else if(main2 > x3) {
              cross1 = y1 + (x4 - main2) * Math.tan(deg2);
              // 上部分和borderLeft重叠
              if(main1 < x2) {
                cross2 = y1 + (main1 - x1) * Math.tan(deg1);
                points.push([
                  [main1, y1],
                  [x2, y1],
                  [x2, y2],
                  [main1, cross2]
                ]);
                points.push([
                  [x2, y1],
                  [x3, y1],
                  [x3, y2],
                  [x2, y2]
                ]);
                if(isLast) {
                  points.push([
                    [x3, y1],
                    [x4, y1],
                    [x4, y1],
                    [x3, y2]
                  ]);
                }
                else {
                  points.push([
                    [x3, y1],
                    [main2, y1],
                    [main2, cross1],
                    [x3, y2]
                  ]);
                }
              }
              // 上部独立
              else {
                points.push([
                  [main1, y1],
                  [x3, y1],
                  [x3, y2],
                  [main1, y2]
                ]);
                if(isLast) {
                  points.push([
                    [x3, y1],
                    [x4, y1],
                    [x4, y1],
                    [x3, y2]
                  ]);
                }
                else {
                  points.push([
                    [x3, y1],
                    [main2, y1],
                    [main2, cross1],
                    [x3, y2]
                  ]);
                }
              }
            }
            // 完全独立
            else {
              if(isLast) {
                points.push([
                  [main1, y1],
                  [x4, y1],
                  [x3, y2],
                  [main1, y2]
                ]);
              }
              else {
                points.push([
                  [main1, y1],
                  [main2, y1],
                  [main2, y2],
                  [main1, y2]
                ]);
              }
            }
          }
        }
        else if(direction === 1) {
          // 整个和borderTop重叠
          if(main2 <= y2) {
            if(isLast) {
              points.push([
                [x3, y2],
                [x4, y1],
                [x4, y4],
                [x3, y3]
              ]);
            }
            else {
              cross1 = x4 - (main1 - y1) * Math.tan(deg1);
              cross2 = x4 - (main2 - y1) * Math.tan(deg1);
              points.push([
                [cross1, main1],
                [x4, main1],
                [x4, main2],
                [cross2, main2],
              ]);
            }
          }
          // 整个和borderBottom重叠
          else if(main1 >= y3) {
            cross1 = x3 + (main1 - y3) * Math.tan(deg2);
            cross2 = x3 + (main2 - y3) * Math.tan(deg2);
            if(isLast) {
              points.push([
                [cross1, main1],
                [x4, main1],
                [x4, y4],
                [x4, y4]
              ]);
            }
            else {
              points.push([
                [cross1, main1],
                [x4, main1],
                [x4, main2],
                [cross2, main2]
              ]);
            }
          }
          // 不被整个重叠的情况再细分
          else {
            // 上部分和borderTop重叠
            if(main1 < y2) {
              cross1 = x3 + (y2 - main1) * Math.tan(deg1);
              points.push([
                [cross1, main1],
                [x4, main1],
                [x4, y2],
                [x3, y2]
              ]);
              if(isLast) {
                points.push([
                  [x3, y2],
                  [x4, y2],
                  [x4, y3],
                  [x3, y3]
                ]);
                points.push([
                  [x3, y3],
                  [x4, y3],
                  [x4, y4],
                  [x4, y4]
                ]);
              }
              else {
                // 下部分和borderBottom重叠
                if(main2 > y3) {
                  cross2 = x3 + (main2 - y3) * Math.tan(deg2);
                  points.push([
                    [x3, y2],
                    [x4, y2],
                    [x4, y3],
                    [x3, y3]
                  ]);
                  points.push([
                    [x3, y3],
                    [x4, y3],
                    [x4, main2],
                    [cross2, main2]
                  ]);
                }
                // 下部独立
                else {
                  points.push([
                    [x3, y2],
                    [x4, y2],
                    [x4, main2],
                    [x3, main2]
                  ]);
                }
              }
            }
            // 下部分和borderBottom重叠
            else if(main2 > y3) {
              cross1 = x3 + (main2 - y3) * Math.tan(deg2);
              // 上部分和borderTop重叠
              if(main1 < y2) {
                cross2 = x3 + (y2 - main1) * Math.tan(deg1);
                points.push([
                  [cross2, main1],
                  [x4, main1],
                  [x4, y2],
                  [x3, y2]
                ]);
                points.push([
                  [x3, y2],
                  [x4, y2],
                  [x4, y3],
                  [x3, y3]
                ]);
                if(isLast) {
                  points.push([
                    [x3, y3],
                    [x4, y3],
                    [x4, x4],
                    [x4, x4]
                  ]);
                }
                else {
                  points.push([
                    [x3, y3],
                    [x4, y3],
                    [x4, main2],
                    [cross1, main2]
                  ]);
                }
              }
              // 上部独立
              else {
                points.push([
                  [x3, main1],
                  [x4, main1],
                  [x4, y3],
                  [x3, y3]
                ]);
                if(isLast) {
                  points.push([
                    [x3, y3],
                    [x4, y3],
                    [x4, y4],
                    [x4, y4]
                  ]);
                }
                else {
                  points.push([
                    [x3, y3],
                    [x4, y3],
                    [x4, main2],
                    [cross1, main2]
                  ]);
                }
              }
            }
            // 完全独立
            else {
              if(isLast) {
                points.push([
                  [x3, main1],
                  [x4, main1],
                  [x4, y4],
                  [x3, y3]
                ]);
              }
              else {
                points.push([
                  [x3, main1],
                  [x4, main1],
                  [x4, main2],
                  [x3, main2]
                ]);
              }
            }
          }
        }
        else if(direction === 2) {
          // 整个和borderLeft重叠
          if(main2 <= x2) {
            if(isLast) {
              points.push([
                [x1, y4],
                [x2, y3],
                [x3, y3],
                [x4, y4]
              ]);
            }
            else {
              cross1 = y4 - (main1 - x1) * Math.tan(deg1);
              cross2 = y4 - (main2 - x1) * Math.tan(deg1);
              points.push([
                [main1, cross1],
                [main2, cross2],
                [main2, y4],
                [main1, y4]
              ]);
            }
          }
          // 整个和borderRight重叠
          else if(main1 >= x3) {
            cross1 = y4 - (x4 - main1) * Math.tan(deg2);
            cross2 = y4 - (x4 - main2) * Math.tan(deg2);
            if(isLast) {
              points.push([
                [main1, cross1],
                [x4, y4],
                [x4, y4],
                [main1, y4]
              ]);
            }
            else {
              points.push([
                [main1, cross1],
                [main2, cross2],
                [main2, y4],
                [main1, y4]
              ]);
            }
          }
          // 不被整个重叠的情况再细分
          else {
            // 上部分和borderLeft重叠
            if(main1 < x2) {
              cross1 = y4 - (main1 - x1) * Math.tan(deg1);
              points.push([
                [main1, cross1],
                [x2, y3],
                [x2, y4],
                [main1, y4]
              ]);
              if(isLast) {
                points.push([
                  [x2, y3],
                  [x3, y3],
                  [x3, y4],
                  [x2, y4]
                ]);
                points.push([
                  [x3, y3],
                  [x4, y4],
                  [x4, y4],
                  [x3, y4]
                ]);
              }
              else {
                // 下部分和borderRight重叠
                if(main2 > x3) {
                  cross2 = y4 - (main2 - x3) * Math.tan(deg2);
                  points.push([
                    [x2, y3],
                    [x3, y3],
                    [x3, y4],
                    [x2, y4]
                  ]);
                  points.push([
                    [x3, y3],
                    [main2, cross2],
                    [main2, y4],
                    [x3, y4]
                  ]);
                }
                // 下部独立
                else {
                  points.push([
                    [x2, y3],
                    [main2, y3],
                    [main2, y4],
                    [x2, y4]
                  ]);
                }
              }
            }
            // 下部分和borderRight重叠
            else if(main2 > x3) {
              cross1 = y4 - (x4 - main2) * Math.tan(deg2);
              // 上部分和borderLeft重叠
              if(main1 < x2) {
                cross2 = y4 - (main1 - x3) * Math.tan(deg1);
                points.push([
                  [main1, cross2],
                  [x2, y3],
                  [x2, y4],
                  [main1, y4]
                ]);
                points.push([
                  [x2, y3],
                  [x3, y3],
                  [x3, y4],
                  [x2, y4]
                ]);
                if(isLast) {
                  points.push([
                    [x3, y3],
                    [x4, y4],
                    [x4, y4],
                    [x3, y4]
                  ]);
                }
                else {
                  points.push([
                    [x3, y3],
                    [main2, cross1],
                    [main2, y4],
                    [x3, y4]
                  ]);
                }
              }
              // 上部独立
              else {
                points.push([
                  [main1, y3],
                  [x3, y3],
                  [x3, y4],
                  [main1, y4]
                ]);
                if(isLast) {
                  points.push([
                    [x3, y3],
                    [x4, y4],
                    [x4, y4],
                    [x3, y4]
                  ]);
                }
                else {
                  points.push([
                    [x3, y3],
                    [main2, cross1],
                    [main2, y4],
                    [x3, y4]
                  ]);
                }
              }
            }
            // 完全独立
            else {
              if(isLast) {
                points.push([
                  [main1, y3],
                  [x3, y3],
                  [x4, y4],
                  [main1, y4]
                ]);
              }
              else {
                points.push([
                  [main1, y3],
                  [main2, y3],
                  [main2, y4],
                  [main1, y4]
                ]);
              }
            }
          }
        }
        else if(direction === 3) {
          // 整个和borderTop重叠
          if(main2 <= y2) {
            if(isLast) {
              points.push([
                [x1, y1],
                [x2, y2],
                [x2, y3],
                [x1, y4]
              ]);
            }
            else {
              cross1 = x1 + (main1 - y1) * Math.tan(deg1);
              cross2 = x1 + (main2 - y1) * Math.tan(deg1);
              points.push([
                [x1, main1],
                [cross1, main1],
                [cross2, main2],
                [x1, main2]
              ]);
            }
          }
          // 整个和borderBottom重叠
          else if(main1 >= y3) {
            cross1 = x1 + (y4 - main1) * Math.tan(deg2);
            cross2 = x1 + (y4 - main2) * Math.tan(deg2);
            if(isLast) {
              points.push([
                [x1, main1],
                [cross1, main1],
                [x1, y4],
                [x1, y4]
              ]);
            }
            else {
              points.push([
                [x1, main1],
                [cross1, main1],
                [cross2, main2],
                [x1, main2]
              ]);
            }
          }
          // 不被整个重叠的情况再细分
          else {
            // 上部分和borderTop重叠
            if(main1 < y2) {
              cross1 = x1 + (main1 - y1) * Math.tan(deg1);
              points.push([
                [x1, main1],
                [cross1, main1],
                [x2, y2],
                [x1, y2]
              ]);
              if(isLast) {
                points.push([
                  [x1, y2],
                  [x2, y2],
                  [x2, y3],
                  [x1, y3]
                ]);
                points.push([
                  [x1, y3],
                  [x2, y3],
                  [x1, y4],
                  [x1, y4],
                ]);
              }
              else {
                // 下部分和borderBottom重叠
                if(main2 > y3) {
                  cross2 = x1 + (y4 - main2) * Math.tan(deg2);
                  points.push([
                    [x1, y2],
                    [x2, y2],
                    [x2, y3],
                    [x1, y3]
                  ]);
                  points.push([
                    [x1, y3],
                    [x2, y3],
                    [cross2, main2],
                    [x1, main2]
                  ]);
                }
                // 下部独立
                else {
                  points.push([
                    [x1, y2],
                    [x2, y2],
                    [x2, main2],
                    [x1, main2]
                  ]);
                }
              }
            }
            // 下部分和borderBottom重叠
            else if(main2 > y3) {
              cross1 = x1 + (y4 - main2) * Math.tan(deg2);
              // 上部分和borderTop重叠
              if(main1 < y2) {
                cross2 = x1 + (main1 - y1) * Math.tan(deg1);
                points.push([
                  [x1, main1],
                  [cross2, main1],
                  [x2, y2],
                  [x1, y1]
                ]);
                points.push([
                  [x1, y2],
                  [x2, y2],
                  [x2, y3],
                  [x1, y3]
                ]);
                if(isLast) {
                  points.push([
                    [x1, y3],
                    [x2, y3],
                    [x1, y4],
                    [x1, y4]
                  ]);
                }
                else {
                  points.push([
                    [x1, y3],
                    [x2, y3],
                    [cross1, main2],
                    [x1, main2]
                  ]);
                }
              }
              // 上部独立
              else {
                points.push([
                  [x1, main1],
                  [x2, main1],
                  [x2, y3],
                  [x1, y3]
                ]);
                if(isLast) {
                  points.push([
                    [x1, y3],
                    [x2, y3],
                    [x1, y4],
                    [x1, y4]
                  ]);
                }
                else {
                  points.push([
                    [x1, y3],
                    [x2, y3],
                    [cross1, main2],
                    [x1, main2]
                  ]);
                }
              }
            }
            // 完全独立
            else {
              if(isLast) {
                points.push([
                  [x1, main1],
                  [x2, main1],
                  [x2, y3],
                  [x1, y4]
                ]);
              }
              else {
                points.push([
                  [x1, main1],
                  [x2, main1],
                  [x2, main2],
                  [x1, main2]
                ]);
              }
            }
          }
        }
      }
      if(direction === 0) {
        return calTopRadiusPoints(borderWidth, deg1, deg2, x1, x2, x3, x4, y1, y2, y3, y4, points, beginRadius, endRadius);
      }
      else if(direction === 1) {
        return calRightRadiusPoints(borderWidth, deg1, deg2, x1, x2, x3, x4, y1, y2, y3, y4, points, beginRadius, endRadius);
      }
      else if(direction === 2) {
        return calBottomRadiusPoints(borderWidth, deg1, deg2, x1, x2, x3, x4, y1, y2, y3, y4, points, beginRadius, endRadius);
      }
      else if(direction === 3) {
        return calLeftRadiusPoints(borderWidth, deg1, deg2, x1, x2, x3, x4, y1, y2, y3, y4, points, beginRadius, endRadius);
      }
    }
  }
  // 兜底返回实线
  if(direction === 0) {
    if(x2 > x1) {
      points.push([
        [x1, y1],
        [x2, y1],
        [x2, y2],
        [x1, y1]
      ]);
    }
    points.push([
      [x2, y1],
      [x3, y1],
      [x3, y2],
      [x2, y2]
    ]);
    if(x4 > x3) {
      points.push([
        [x3, y1],
        [x4, y1],
        [x4, y1],
        [x3, y2]
      ]);
    }
    return calTopRadiusPoints(borderWidth, deg1, deg2, x1, x2, x3, x4, y1, y2, y3, y4, points, beginRadius, endRadius);
  }
  else if(direction === 1) {
    if(y2 > y1) {
      points.push([
        [x4, y1],
        [x4, y1],
        [x4, y2],
        [x3, y2]
      ]);
    }
    points.push([
      [x3, y2],
      [x4, y2],
      [x4, y3],
      [x3, y3]
    ]);
    if(y4 > y3) {
      points.push([
        [x3, y3],
        [x4, y3],
        [x4, y4],
        [x4, y4]
      ]);
    }
    return calRightRadiusPoints(borderWidth, deg1, deg2, x1, x2, x3, x4, y1, y2, y3, y4, points, beginRadius, endRadius);
  }
  else if(direction === 2) {
    if(x2 > x1) {
      points.push([
        [x1, y4],
        [x2, y3],
        [x2, y4],
        [x1, y4]
      ]);
    }
    points.push([
      [x2, y3],
      [x3, y3],
      [x3, y4],
      [x2, y4]
    ]);
    if(x4 > x3) {
      points.push([
        [x3, y3],
        [x4, y4],
        [x4, y4],
        [x3, y4]
      ]);
    }
    return calBottomRadiusPoints(borderWidth, deg1, deg2, x1, x2, x3, x4, y1, y2, y3, y4, points, beginRadius, endRadius);
  }
  else if(direction === 3) {
    if(y2 > y1) {
      points.push([
        [x1, y1],
        [x1, y1],
        [x2, y2],
        [x1, y2]
      ]);
    }
    points.push([
      [x1, y2],
      [x2, y2],
      [x2, y3],
      [x1, y3]
    ]);
    if(y4 > y3) {
      points.push([
        [x1, y3],
        [x2, y3],
        [x1, y4],
        [x1, y4]
      ]);
    }
    return calLeftRadiusPoints(borderWidth, deg1, deg2, x1, x2, x3, x4, y1, y2, y3, y4, points, beginRadius, endRadius);
  }
}

function calTopRadiusPoints(borderWidth, deg1, deg2, x1, x2, x3, x4, y1, y2, y3, y4, pointsList, beginRadius, endRadius) {
  let [brx, bry] = beginRadius;
  let [erx, ery] = endRadius;
  // 一条边的两侧圆角均为0时无效
  if((!brx || !bry) && (!erx || !ery)) {
    return pointsList;
  }
  // 分界坐标圆心，左圆角、右圆角、中间矩形，3个区域2个坐标；当左右圆角相接时中间矩形为0即中间2个坐标相等
  let oxl = x2 + brx - (x2 - x1);
  let oxr = x3 - erx + (x4 - x3);
  // 先拆分，当一块四边形跨越左右圆角和中间非圆角时被拆为3份，只跨一边圆角拆2份，不跨不处理
  // 也有可能左右圆角相接，跨越的只分为左右2份
  // 最终左圆角内的存入begin，右圆角内的存入end，中间center
  let beginList = [];
  let centerList = [];
  let endList = [];
  for(let i = 0, len = pointsList.length; i < len; i++) {
    let points = pointsList[i];
    // 全在左圆角
    if(points[1][0] < oxl) {
      beginList.push(points);
    }
    // 全在右圆角
    else if(points[0][0] > oxr) {
      endList.push(points);
    }
    // 跨越左右圆角
    else if(points[1][0] > oxr && points[0][0] < oxl) {
      let ya = oxl < x2 ? (y1 + Math.tan(deg1) * (oxl - x1)) : y2;
      let yb = oxr > x3 ? (y1 + Math.tan(deg2) * (x4 - oxr)) : y2;
      beginList.push([
        points[0],
        [oxl, y1],
        [oxl, ya],
        points[3]
      ]);
      if(oxl < oxr) {
        if(oxl > x2 && oxr < x3) {
          centerList.push([
            [oxl, y1],
            [oxr, y1],
            [oxr, y2],
            [oxl, y2],
          ]);
        }
        else if(oxl > x2) {
          centerList.push([
            [oxl, y1],
            [x3, y1],
            [x3, y2],
            [oxl, y2],
          ]);
          centerList.push([
            [x3, y1],
            [oxr, y1],
            [oxr, yb],
            [x3, y2]
          ]);
        }
        else if(oxr < x3) {
          centerList.push([
            [oxl, y1],
            [x2, y1],
            [x2, y2],
            [oxl, ya]
          ]);
          centerList.push([
            [x2, y1],
            [oxr, y1],
            [oxr, y2],
            [x2, y2],
          ]);
        }
        else {
          centerList.push([
            [oxl, y1],
            [x2, y1],
            [x2, y2],
            [oxl, ya]
          ]);
          centerList.push([
            [x2, y1],
            [x3, y1],
            [x3, y2],
            [x2, y2],
          ]);
          centerList.push([
            [x3, y1],
            [oxr, y1],
            [oxr, yb],
            [x3, y2]
          ]);
        }
      }
      endList.push([
        [oxr, y1],
        points[1],
        points[2],
        [oxr, yb]
      ]);
    }
    // 跨越右圆角
    else if(points[1][0] > oxr) {
      let y = oxr > x3 ? (y1 + Math.tan(deg2) * (x4 - oxr)) : y2;
      centerList.push([
        points[0],
        [oxr, y1],
        [oxr, y],
        points[3]
      ]);
      endList.push([
        [oxr, y1],
        points[1],
        points[2],
        [oxr, y]
      ]);
    }
    // 跨越左圆角
    else if(points[0][0] < oxl) {
      let y = oxl < x2 ? (y1 + Math.tan(deg1) * (oxl - x1)) : y2;
      beginList.push([
        points[0],
        [oxl, y1],
        [oxl, y],
        points[3]
      ]);
      centerList.push([
        [oxl, y1],
        points[1],
        points[2],
        [oxl, y],
      ]);
    }
    else {
      centerList.push(points);
    }
  }
  let beginLength = beginList.length;
  if(beginLength) {
    // 边宽可能大于圆角尺寸，边的里面无需圆弧化
    let needInner = brx > (x2 - x1) && borderWidth < bry;
    // 算这个角度是为了头部和上条边相交线的延长线
    let crossDeg = Math.atan((x2 - x1) / (y2 - y1));
    let rx1 = brx;
    let ry1 = bry;
    let sx1 = ry1 / rx1;
    let oyl = y1 + bry;
    let rx2 = brx - (x2 - x1);
    let ry2 = bry - (y2 - y1);
    let sx2 = ry2 / rx2;
    // 先计算第一个块，确定x/y边界，防止因为划分原因导致出现超过边界情况交叉
    let xa, ya, xb, yb;
    let ca = calBezierTopLeft(beginList[0][0], beginList[0][1], oxl, oyl, sx1, ry1, true, Math.tan(crossDeg) * ry1);
    [xa, ya] = ca[0];
    let cb;
    if(needInner) {
      cb = calBezierTopLeft(beginList[0][3], beginList[0][2], oxl, oyl, sx2, ry2, true, Math.tan(crossDeg) * ry2);
      [xb, yb] = cb[0];
    }
    beginList.forEach((points, i) => {
      let controls1;
      let controls2;
      if(i === 0) {
        controls1 = ca;
        if(needInner) {
          controls2 = cb;
        }
      }
      else {
        controls1 = calBezierTopLeft(points[0], points[1], oxl, oyl, sx1, ry1);
        if(needInner) {
          controls2 = calBezierTopLeft(points[3], points[2], oxl, oyl, sx2, ry2);
        }
      }
      for(let i = 0, len = controls1.length; i < len; i++) {
        limit(controls1[i], xa, ya, 0);
      }
      points[0] = controls1[0];
      points[1] = controls1[1].concat(controls1[2]).concat(controls1[3]);
      if(needInner) {
        for(let i = 0, len = controls2.length; i < len; i++) {
          limit(controls2[i], xb, yb, 0);
        }
        if(controls2.length === 1) {
          points[2] = controls2[0];
          points.pop();
        }
        else {
          points[2] = controls2[3];
          points[3] = controls2[2].concat(controls2[1]).concat(controls2[0]);
        }
      }
    });
  }
  let endLength = endList.length;
  if(endLength) {
    // 边宽可能大于圆角尺寸，边的里面无需圆弧化
    let needInner = erx > (x4 - x3) && borderWidth < ery;
    // 算这个角度是为了最后和下条边相交线的延长线
    let crossDeg = Math.atan((x4 - x3) / (y2 - y1));
    let rx1 = erx;
    let ry1 = ery;
    let sx1 = ry1 / rx1;
    let oyr = y1 + ery;
    let rx2 = erx - (x4 - x3);
    let ry2 = ery - (y2 - y1);
    let sx2 = ry2 / rx2;
    // 先计算最后一个块，确定x/y边界，防止因为划分原因导致出现超过边界情况交叉
    let xa, ya, xb, yb;
    let ca = calBezierTopRight(endList[endLength - 1][0], endList[endLength - 1][1], oxr, oyr, sx1, ry1, true, Math.tan(crossDeg) * ry1);
    [xa, ya] = ca[ca.length - 1];
    let cb;
    if(needInner) {
      cb = calBezierTopRight(endList[endLength - 1][3], endList[endLength - 1][2], oxr, oyr, sx2, ry2, true, Math.tan(crossDeg) * ry2);
      [xb, yb] = cb[cb.length - 1];
    }
    endList.forEach((points, i) => {
      let controls1;
      let controls2;
      if(i === endLength - 1) {
        controls1 = ca;
        if(needInner) {
          controls2 = cb;
        }
      }
      else {
        controls1 = calBezierTopRight(points[0], points[1], oxr, oyr, sx1, ry1);
        if(needInner) {
          controls2 = calBezierTopRight(points[3], points[2], oxr, oyr, sx2, ry2);
        }
      }
      for(let i = 0, len = controls1.length; i < len; i++) {
        limit(controls1[i], xa, ya, 1);
      }
      points[0] = controls1[0];
      points[1] = controls1[1].concat(controls1[2]).concat(controls1[3]);
      if(needInner) {
        for(let i = 0, len = controls2.length; i < len; i++) {
          limit(controls2[i], xb, yb, 1);
        }
        if(controls2.length === 1) {
          points[2] = controls2[0];
          points.pop();
        }
        else {
          points[2] = controls2[3];
          points[3] = controls2[2].concat(controls2[1]).concat(controls2[0]);
        }
      }
    });
  }
  return beginList.concat(centerList).concat(endList);
}

function calBezierTopLeft(p1, p2, ox, oy, sx, r, isStart, crossDx) {
  // 先缩放x轴，椭圆变圆，2个点x坐标相应变化，y不变
  let [p1x, p1y] = p1;
  let [p2x, p2y] = p2;
  let dx1 = -p1x + ox;
  let dsx1 = dx1 * sx;
  let dx2 = -p2x + ox;
  let dsx2 = dx2 * sx;
  // 求2个点和1/4圆弧的交点坐标，和圆心连线，反三角函数求出夹角
  let deg2 = Math.atan(dsx2 / (oy - p2y));
  // 根据角和半径再三角函数求交点坐标，可以直接缩放x轴恢复原本椭圆坐标，求贝塞尔控制点用不到交点
  let cpx2 = ox - Math.sin(deg2) * r / sx;
  let cpy2 = oy - Math.cos(deg2) * r;
  let deg1;
  let cpx1;
  let cpy1;
  // 最初的是两条border的交界线，需要特殊求交界线延长和椭圆的交点，不能直连圆心求交点
  if(isStart) {
    // 交界线和y轴夹角beta以及交点的x坐标都会受缩放影响，先化圆好求交点坐标
    let crossDsx = crossDx * sx;
    let beta = Math.atan(crossDsx / r);
    // 公式计算可得beta和交点连圆心的角alpha关系
    let tanBetaDiv2Sqrt = Math.sqrt(Math.tan(beta) / 2);
    let tanAlphaHalf = tanBetaDiv2Sqrt / (1 + tanBetaDiv2Sqrt);
    let alpha = Math.atan(tanAlphaHalf) * 2;
    // 获得alpha后直接根据半径求出交点坐标
    deg1 = Math.PI * 0.5 - alpha;
    cpx1 = ox - Math.cos(alpha) * r / sx;
    cpy1 = oy - Math.sin(alpha) * r;
  }
  else {
    deg1 = Math.atan(dsx1 / (oy - p1y));
    cpx1 = ox - Math.sin(deg1) * r / sx;
    cpy1 = oy - Math.cos(deg1) * r;
  }
  // 首尾只有3个点情况下重复了顶点形成4边形，同时圆角x/y相等有inner时
  // 使得交点相同角度相同无法计算，直接返回1个点即可
  if(deg1 === deg2) {
    return [
      [cpx1, cpy1]
    ];
  }
  // 根据夹角求贝塞尔拟合圆弧长度
  let h = geom.h(Math.abs(deg1 - deg2));
  let d = h * r;
  // 过交点做切线，知道切线段长度d，求切线上从交点延长d的坐标，即为控制点
  // 圆心交点控制点连成直角三角形，获得斜边即圆心到控制点距离c
  // 求切线角，用上面夹角减去切线角可得控制点和圆心连线的角，从而获得坐标
  let c = Math.sqrt(Math.pow(r, 2) + Math.pow(d, 2));
  let degTg = Math.atan(d / r);
  let degTg1 = deg1 - degTg;
  let cdx1 = Math.sin(degTg1) * c;
  let cdy1 = Math.cos(degTg1) * c;
  let cx1 = ox - cdx1 / sx;
  let cy1 = oy - cdy1;
  let degTg2 = deg2 + degTg;
  let cdx2 = Math.sin(degTg2) * c;
  let cdy2 = Math.cos(degTg2) * c;
  let cx2 = ox - cdx2 / sx;
  let cy2 = oy - cdy2;
  // window.ctx.fillStyle = '#F90';
  // window.ctx.beginPath();
  // window.ctx.arc(p1x, p1y, 1,0, 2 * Math.PI);
  // window.ctx.fill();
  // window.ctx.fillStyle = '#0FF';
  // window.ctx.beginPath();
  // window.ctx.arc(cx1, cy1, 1,0, 2 * Math.PI);
  // window.ctx.fill();
  // window.ctx.fillStyle = '#00F';
  // window.ctx.beginPath();
  // window.ctx.arc(cx2, cy2, 1,0, 2 * Math.PI);
  // window.ctx.fill();
  // window.ctx.fillStyle = '#0F0';
  // window.ctx.beginPath();
  // window.ctx.arc(p2x, p2y, 1,0, 2 * Math.PI);
  // window.ctx.fill();
  // window.ctx.closePath();
  return [
    [cpx1, cpy1],
    [cx1, cy1],
    [cx2, cy2],
    [cpx2, cpy2]
  ];
}

function calBezierTopRight(p1, p2, ox, oy, sx, r, isEnd, crossDx) {
  // 先缩放x轴，椭圆变圆，2个点x坐标相应变化，y不变
  let [p1x, p1y] = p1;
  let [p2x, p2y] = p2;
  let dx1 = p1x - ox;
  let dsx1 = dx1 * sx;
  let dx2 = p2x - ox;
  let dsx2 = dx2 * sx;
  // 求2个点和1/4圆弧的交点坐标，和圆心连线，反三角函数求出夹角
  let deg1 = Math.atan(dsx1 / (oy - p1y));
  // 根据角和半径再三角函数求交点坐标，可以直接缩放x轴恢复原本椭圆坐标，求贝塞尔控制点用不到交点
  let cpx1 = ox + Math.sin(deg1) * r / sx;
  let cpy1 = oy - Math.cos(deg1) * r;
  let deg2;
  let cpx2;
  let cpy2;
  // 最后的是两条border的交界线，需要特殊求交界线延长和椭圆的交点，不能直连圆心求交点
  if(isEnd) {
    // 交界线和y轴夹角beta以及交点的x坐标都会受缩放影响，先化圆好求交点坐标
    let crossDsx = crossDx * sx;
    let beta = Math.atan(crossDsx / r);
    // 公式计算可得beta和交点连圆心的角alpha关系
    let tanBetaDiv2Sqrt = Math.sqrt(Math.tan(beta) / 2);
    let tanAlphaHalf = tanBetaDiv2Sqrt / (1 + tanBetaDiv2Sqrt);
    let alpha = Math.atan(tanAlphaHalf) * 2;
    // 获得alpha后直接根据半径求出交点坐标
    deg2 = Math.PI * 0.5 - alpha;
    cpx2 = ox + Math.cos(alpha) * r / sx;
    cpy2 = oy - Math.sin(alpha) * r;
  }
  else {
    deg2 = Math.atan(dsx2 / (oy - p2y));
    cpx2 = ox + Math.sin(deg2) * r / sx;
    cpy2 = oy - Math.cos(deg2) * r;
  }
  // 首尾只有3个点情况下重复了顶点形成4边形，同时圆角x/y相等有inner时
  // 使得交点相同角度相同无法计算，直接返回1个点即可
  if(deg1 === deg2) {
    return [
      [cpx1, cpy1]
    ];
  }
  // 根据夹角求贝塞尔拟合圆弧长度
  let h = geom.h(Math.abs(deg1 - deg2));
  let d = h * r;
  // 过交点做切线，知道切线段长度d，求切线上从交点延长d的坐标，即为控制点
  // 圆心交点控制点连成直角三角形，获得斜边即圆心到控制点距离c
  // 求切线角，用上面夹角减去切线角可得控制点和圆心连线的角，从而获得坐标
  let c = Math.sqrt(Math.pow(r, 2) + Math.pow(d, 2));
  let degTg = Math.atan(d / r);
  let degTg1 = deg1 + degTg;
  let cdx1 = Math.sin(degTg1) * c;
  let cdy1 = Math.cos(degTg1) * c;
  let cx1 = ox + cdx1 / sx;
  let cy1 = oy - cdy1;
  let degTg2 = deg2 - degTg;
  let cdx2 = Math.sin(degTg2) * c;
  let cdy2 = Math.cos(degTg2) * c;
  let cx2 = ox + cdx2 / sx;
  let cy2 = oy - cdy2;
  // window.ctx.fillStyle = '#F90';
  // window.ctx.beginPath();
  // window.ctx.arc(cpx1, cpy1, 1,0, 2 * Math.PI);
  // window.ctx.fill();
  // window.ctx.fillStyle = '#0FF';
  // window.ctx.beginPath();
  // window.ctx.arc(cx1, cy1, 1,0, 2 * Math.PI);
  // window.ctx.fill();
  // window.ctx.fillStyle = '#00F';
  // window.ctx.beginPath();
  // window.ctx.arc(cx2, cy2, 1,0, 2 * Math.PI);
  // window.ctx.fill();
  // window.ctx.fillStyle = '#0F0';
  // window.ctx.beginPath();
  // window.ctx.arc(cpx2, cpy2, 1,0, 2 * Math.PI);
  // window.ctx.fill();
  // window.ctx.closePath();
  return [
    [cpx1, cpy1],
    [cx1, cy1],
    [cx2, cy2],
    [cpx2, cpy2]
  ];
}

function calRightRadiusPoints(borderWidth, deg1, deg2, x1, x2, x3, x4, y1, y2, y3, y4, pointsList, beginRadius, endRadius) {
  let [brx, bry] = beginRadius;
  let [erx, ery] = endRadius;
  // 一条边的两侧圆角均为0时无效
  if((!brx || !bry) && (!erx || !ery)) {
    return pointsList;
  }
  // 分界坐标圆心，上圆角、下圆角、中间矩形，3个区域2个坐标；当上下圆角相接时中间矩形为0即中间2个坐标相等
  let oyt = y2 + bry - (y2 - y1);
  let oyb = y3 - ery + (y4 - y3);
  let beginList = [];
  let centerList = [];
  let endList = [];
  // 同borderTop拆分
  for(let i = 0, len = pointsList.length; i < len; i++) {
    let points = pointsList[i];
    // 全在上圆角
    if(points[2][1] < oyt) {
      beginList.push(points);
    }
    // 全在下圆角
    else if(points[1][1] > oyb) {
      endList.push(points);
    }
    // 跨越上下圆角
    else if(points[2][1] > oyb && points[1][1] < oyt) {
      let xa = oyt < y2 ? (x3 + Math.tan(deg2) * (y2 - oyt)) : x3;
      let xb = oyb > y3 ? (x3 + Math.tan(deg1) * (oyb - y3)) : x3;
      beginList.push([
        points[0],
        points[1],
        [x4, oyt],
        [xa, oyt]
      ]);
      if(oyt < oyb) {
        if(oyb < y3 && oyt > y2) {
          centerList.push([
            [x3, oyt],
            [x4, oyt],
            [x4, oyb],
            [x3, oyb]
          ]);
        }
        else if(oyt > y2) {
          centerList.push([
            [x3, y2],
            [x4, y2],
            [x4, y3],
            [x3, y3],
          ]);
          centerList.push([
            [x3, y3],
            [x4, y3],
            [x4, oyb],
            [xb, oyb],
          ]);
        }
        else if(oyb < y3) {
          centerList.push([
            [xa, oyt],
            [x4, oyt],
            [x4, y2],
            [x3, y2],
          ]);
          centerList.push([
            [x3, y2],
            [x4, y2],
            [x4, oyb],
            [x3, oyb],
          ]);
        }
        else {
          centerList.push([
            [xa, oyt],
            [x4, oyt],
            [x4, y2],
            [x3, y2],
          ]);
          centerList.push([
            [x3, y2],
            [x4, y2],
            [x4, y3],
            [x3, y3],
          ]);
          centerList.push([
            [x3, y3],
            [x4, y3],
            [x4, oyb],
            [xb, oyb],
          ]);
        }
      }
      endList.push([
        [xb, oyb],
        [x4, oyb],
        points[2],
        points[3]
      ]);
    }
    // 跨越下圆角
    else if(points[2][1] > oyb) {
      let x = oyb > y3 ? (x3 + Math.tan(deg1) * (oyb - y3)) : x3;
      centerList.push([
        points[0],
        points[1],
        [x4, oyb],
        [x, oyb]
      ]);
      endList.push([
        [x, oyb],
        [x4, oyb],
        points[2],
        points[3]
      ]);
    }
    // 跨越上圆角
    else if(points[1][1] < oyt) {
      let x = oyt < y2 ? (x3 + Math.tan(deg2) * (y2 - oyt)) : x3;
      beginList.push([
        points[0],
        points[1],
        [x4, oyt],
        [x, oyt]
      ]);
      centerList.push([
        [x, oyt],
        [x4, oyt],
        points[2],
        points[3]
      ]);
    }
    else {
      centerList.push(points);
    }
  }
  let beginLength = beginList.length;
  if(beginLength) {
    let needInner = bry > (y2 - y1) && borderWidth < brx;
    let crossDeg = Math.atan((x4 - x3) / (y2 - y1));
    let rx1 = brx;
    let ry1 = bry;
    let sx1 = ry1 / rx1;
    let oxt = x4 - brx;
    let rx2 = brx - (x4 - x3);
    let ry2 = bry - (y2 - y1);
    let sx2 = ry2 / rx2;
    // 先计算第一个块，确定x/y边界，防止因为划分原因导致出现超过边界情况交叉
    let xa, ya, xb, yb;
    let ca = calBezierRightTop(beginList[0][1], beginList[0][2], oxt, oyt, sx1, ry1, true, Math.tan(crossDeg) * ry1);
    [xa, ya] = ca[ca.length - 1];
    let cb;
    if(needInner) {
      cb = calBezierRightTop(beginList[0][0], beginList[0][3], oxt, oyt, sx2, ry2, true, Math.tan(crossDeg) * ry2);
      [xb, yb] = cb[cb.length - 1];
    }
    beginList.forEach((points, i) => {
      let controls1;
      let controls2;
      if(i === 0) {
        controls1 = ca;
        if(needInner) {
          controls2 = cb;
        }
      }
      else {
        controls1 = calBezierRightTop(points[1], points[2], oxt, oyt, sx1, ry1);
        if(needInner) {
          controls2 = calBezierRightTop(points[0], points[3], oxt, oyt, sx2, ry2);
        }
      }
      for(let i = 0, len = controls1.length; i < len; i++) {
        limit(controls1[i], xa, ya, 2);
      }
      if(needInner) {
        for(let i = 0, len = controls2.length; i < len; i++) {
          limit(controls2[i], xb, yb, 2);
        }
        if(controls2.length === 1) {
          points[2] = controls2[0];
          points.pop();
        }
        else {
          points[2] = controls2[0];
          points[3] = controls2[1].concat(controls2[2]).concat(controls2[3]);
        }
      }
      else {
        points[2] = points[3];
        points[3] = points[0];
      }
      points[0] = controls1[3];
      points[1] = controls1[2].concat(controls1[1]).concat(controls1[0]);
    });
  }
  let endLength = endList.length;
  if(endLength) {
    let needInner = ery > (y4 - y3) && borderWidth < erx;
    let crossDeg = Math.atan((x4 - x3) / (y4 - y3));
    let rx1 = erx;
    let ry1 = ery;
    let sx1 = ry1 / rx1;
    let oxb = x4 - erx;
    let rx2 = erx - (x4 - x3);
    let ry2 = ery - (y4 - y3);
    let sx2 = ry2 / rx2;
    // 先计算最后一个块，确定x/y边界，防止因为划分原因导致出现超过边界情况交叉
    let xa, ya, xb, yb;
    let ca = calBezierRightBottom(endList[endLength - 1][1], endList[endLength - 1][2], oxb, oyb, sx1, ry1, true, Math.tan(crossDeg) * ry1);
    [xa, ya] = ca[0];
    let cb;
    if(needInner) {
      cb = calBezierRightBottom(endList[endLength - 1][0], endList[endLength - 1][3], oxb, oyb, sx2, ry2, true, Math.tan(crossDeg) * ry2);
      [xb, yb] = cb[0];
    }
    endList.forEach((points, i) => {
      let controls1;
      let controls2;
      if(i === endLength - 1) {
        controls1 = ca;
        if(needInner) {
          controls2 = cb;
        }
      }
      else {
        controls1 = calBezierRightBottom(points[1], points[2], oxb, oyb, sx1, ry1);
        if(needInner) {
          controls2 = calBezierRightBottom(points[0], points[3], oxb, oyb, sx2, ry2);
        }
      }
      for(let i = 0, len = controls1.length; i < len; i++) {
        limit(controls1[i], xa, ya, 3);
      }
      if(needInner) {
        for(let i = 0, len = controls2.length; i < len; i++) {
          limit(controls2[i], xb, yb, 3);
        }
        if(controls2.length === 1) {
          points[2] = controls2[0];
          points.pop();
        }
        else {
          points[2] = controls2[0];
          points[3] = controls2[1].concat(controls2[2]).concat(controls2[3]);
        }
      }
      else {
        points[2] = points[3];
        points[3] = points[0];
      }
      points[0] = controls1[3];
      points[1] = controls1[2].concat(controls1[1]).concat(controls1[0]);
    });
  }
  return beginList.concat(centerList).concat(endList);
}

function calBezierRightTop(p1, p2, ox, oy, sx, r, isStart, crossDx) {
  // 先缩放x轴，椭圆变圆，2个点x坐标相应变化，y不变
  let [p1x, p1y] = p1;
  let [p2x, p2y] = p2;
  let dx1 = p1x - ox;
  let dsx1 = dx1 * sx;
  let dx2 = p2x - ox;
  let dsx2 = dx2 * sx;
  // 求2个点和1/4圆弧的交点坐标，和圆心连线，反三角函数求出夹角
  let deg2 = Math.atan(dsx2 / (oy - p2y));
  // 根据角和半径再三角函数求交点坐标，可以直接缩放x轴恢复原本椭圆坐标，求贝塞尔控制点用不到交点
  let cpx2 = ox + Math.sin(deg2) * r / sx;
  let cpy2 = oy - Math.cos(deg2) * r;
  let deg1;
  let cpx1;
  let cpy1;
  if(isStart) {
    // 交界线和y轴夹角beta以及交点的x坐标都会受缩放影响，先化圆好求交点坐标
    let crossDsx = crossDx * sx;
    let beta = Math.atan(crossDsx / r);
    // 公式计算可得beta和交点连圆心的角alpha关系
    let tanBetaDiv2Sqrt = Math.sqrt(Math.tan(beta) / 2);
    let tanAlphaHalf = tanBetaDiv2Sqrt / (1 + tanBetaDiv2Sqrt);
    let alpha = Math.atan(tanAlphaHalf) * 2;
    // 获得alpha后直接根据半径求出交点坐标
    deg1 = Math.PI * 0.5 - alpha;
    cpx1 = ox + Math.cos(alpha) * r / sx;
    cpy1 = oy - Math.sin(alpha) * r;
  }
  else {
    deg1 = Math.atan(dsx1 / (oy - p1y));
    cpx1 = ox + Math.sin(deg1) * r / sx;
    cpy1 = oy - Math.cos(deg1) * r;
  }
  // 首尾只有3个点情况下重复了顶点形成4边形，同时圆角x/y相等有inner时
  // 使得交点相同角度相同无法计算，直接返回1个点即可
  if(deg1 === deg2) {
    return [
      [cpx1, cpy1]
    ];
  }
  // 根据夹角求贝塞尔拟合圆弧长度
  let h = geom.h(Math.abs(deg1 - deg2));
  let d = h * r;
  // 过交点做切线，知道切线段长度d，求切线上从交点延长d的坐标，即为控制点
  // 圆心交点控制点连成直角三角形，获得斜边即圆心到控制点距离c
  // 求切线角，用上面夹角减去切线角可得控制点和圆心连线的角，从而获得坐标
  let c = Math.sqrt(Math.pow(r, 2) + Math.pow(d, 2));
  let degTg = Math.atan(d / r);
  let degTg1 = deg1 + degTg;
  let cdx1 = Math.sin(degTg1) * c;
  let cdy1 = Math.cos(degTg1) * c;
  let cx1 = ox + cdx1 / sx;
  let cy1 = oy - cdy1;
  let degTg2 = deg2 - degTg;
  let cdx2 = Math.sin(degTg2) * c;
  let cdy2 = Math.cos(degTg2) * c;
  let cx2 = ox + cdx2 / sx;
  let cy2 = oy - cdy2;
  // window.ctx.fillStyle = '#000';
  // window.ctx.beginPath();
  // window.ctx.arc(cpx1, cpy1, 1,0, 2 * Math.PI);
  // window.ctx.fill();
  // window.ctx.fillStyle = '#0FF';
  // window.ctx.beginPath();
  // window.ctx.arc(cx1, cy1, 1,0, 2 * Math.PI);
  // window.ctx.fill();
  // window.ctx.fillStyle = '#00F';
  // window.ctx.beginPath();
  // window.ctx.arc(cx2, cy2, 1,0, 2 * Math.PI);
  // window.ctx.fill();
  // window.ctx.fillStyle = '#0F0';
  // window.ctx.beginPath();
  // window.ctx.arc(cpx2, cpy2, 1,0, 2 * Math.PI);
  // window.ctx.fill();
  // window.ctx.closePath();
  return [
    [cpx2, cpy2],
    [cx2, cy2],
    [cx1, cy1],
    [cpx1, cpy1]
  ];
}

function calBezierRightBottom(p1, p2, ox, oy, sx, r, isEnd, crossDx) {
  // 先缩放x轴，椭圆变圆，2个点x坐标相应变化，y不变
  let [p1x, p1y] = p1;
  let [p2x, p2y] = p2;
  let dx1 = p1x - ox;
  let dsx1 = dx1 * sx;
  let dx2 = p2x - ox;
  let dsx2 = dx2 * sx;
  // 求2个点和1/4圆弧的交点坐标，和圆心连线，反三角函数求出夹角
  let deg1 = Math.atan(dsx1 / (p1y - oy));
  // 根据角和半径再三角函数求交点坐标，可以直接缩放x轴恢复原本椭圆坐标，求贝塞尔控制点用不到交点
  let cpx1 = ox + Math.sin(deg1) * r / sx;
  let cpy1 = oy + Math.cos(deg1) * r;
  let deg2;
  let cpx2;
  let cpy2;
  if(isEnd) {
    // 交界线和y轴夹角beta以及交点的x坐标都会受缩放影响，先化圆好求交点坐标
    let crossDsx = crossDx * sx;
    let beta = Math.atan(crossDsx / r);
    // 公式计算可得beta和交点连圆心的角alpha关系
    let tanBetaDiv2Sqrt = Math.sqrt(Math.tan(beta) / 2);
    let tanAlphaHalf = tanBetaDiv2Sqrt / (1 + tanBetaDiv2Sqrt);
    let alpha = Math.atan(tanAlphaHalf) * 2;
    // 获得alpha后直接根据半径求出交点坐标
    deg2 = Math.PI * 0.5 - alpha;
    cpx2 = ox + Math.cos(alpha) * r / sx;
    cpy2 = oy + Math.sin(alpha) * r;
  }
  else {
    deg2 = Math.atan(dsx2 / (p2y - oy));
    cpx2 = ox + Math.sin(deg2) * r / sx;
    cpy2 = oy + Math.cos(deg2) * r;
  }
  // 首尾只有3个点情况下重复了顶点形成4边形，同时圆角x/y相等有inner时
  // 使得交点相同角度相同无法计算，直接返回1个点即可
  if(deg1 === deg2) {
    return [
      [cpx1, cpy1]
    ];
  }
  // 根据夹角求贝塞尔拟合圆弧长度
  let h = geom.h(Math.abs(deg1 - deg2));
  let d = h * r;
  // 过交点做切线，知道切线段长度d，求切线上从交点延长d的坐标，即为控制点
  // 圆心交点控制点连成直角三角形，获得斜边即圆心到控制点距离c
  // 求切线角，用上面夹角减去切线角可得控制点和圆心连线的角，从而获得坐标
  let c = Math.sqrt(Math.pow(r, 2) + Math.pow(d, 2));
  let degTg = Math.atan(d / r);
  let degTg1 = deg1 - degTg;
  let cdx1 = Math.sin(degTg1) * c;
  let cdy1 = Math.cos(degTg1) * c;
  let cx1 = ox + cdx1 / sx;
  let cy1 = oy + cdy1;
  let degTg2 = deg2 + degTg;
  let cdx2 = Math.sin(degTg2) * c;
  let cdy2 = Math.cos(degTg2) * c;
  let cx2 = ox + cdx2 / sx;
  let cy2 = oy + cdy2;
  // window.ctx.fillStyle = '#F90';
  // window.ctx.beginPath();
  // window.ctx.arc(cpx1, cpy1, 1,0, 2 * Math.PI);
  // window.ctx.fill();
  // window.ctx.fillStyle = '#0FF';
  // window.ctx.beginPath();
  // window.ctx.arc(cx1, cy1, 1,0, 2 * Math.PI);
  // window.ctx.fill();
  // window.ctx.fillStyle = '#00F';
  // window.ctx.beginPath();
  // window.ctx.arc(cx2, cy2, 1,0, 2 * Math.PI);
  // window.ctx.fill();
  // window.ctx.fillStyle = '#0F0';
  // window.ctx.beginPath();
  // window.ctx.arc(cpx2, cpy2, 1,0, 2 * Math.PI);
  // window.ctx.fill();
  // window.ctx.closePath();
  return [
    [cpx2, cpy2],
    [cx2, cy2],
    [cx1, cy1],
    [cpx1, cpy1]
  ];
}

function calBottomRadiusPoints(borderWidth, deg1, deg2, x1, x2, x3, x4, y1, y2, y3, y4, pointsList, beginRadius, endRadius) {
  let [brx, bry] = beginRadius;
  let [erx, ery] = endRadius;
  // 一条边的两侧圆角均为0时无效
  if((!brx || !bry) && (!erx || !ery)) {
    return pointsList;
  }
  // 分界坐标圆心，左圆角、右圆角、中间矩形，3个区域2个坐标；当左右圆角相接时中间矩形为0即中间2个坐标相等
  let oxl = x2 + brx - (x2 - x1);
  let oxr = x3 - erx + (x4 - x3);
  // 先拆分，当一块四边形跨越左右圆角和中间非圆角时被拆为3份，只跨一边圆角拆2份，不跨不处理
  // 也有可能左右圆角相接，跨越的只分为左右2份
  // 最终左圆角内的存入begin，右圆角内的存入end，中间center
  let beginList = [];
  let centerList = [];
  let endList = [];
  for(let i = 0, len = pointsList.length; i < len; i++) {
    let points = pointsList[i];
    // 全在左圆角
    if(points[2][0] < oxl) {
      beginList.push(points);
    }
    // 全在右圆角
    else if(points[3][0] > oxr) {
      endList.push(points);
    }
    // 跨越左右圆角
    else if(points[2][0] > oxr && points[3][0] < oxl) {
      let ya = oxl < x2 ? (y4 - Math.tan(deg1) * (oxl - x1)) : y2;
      let yb = oxr > x3 ? (y4 - Math.tan(deg2) * (x4 - oxr)) : y3;
      beginList.push([
        points[0],
        [oxl, ya],
        [oxl, y4],
        points[3]
      ]);
      if(oxl < oxr) {
        if(oxl > x2 && oxr < x3) {
          centerList.push([
            [oxl, y3],
            [oxr, y3],
            [oxr, y4],
            [oxl, y4],
          ]);
        }
        else if(oxl > x2) {
          centerList.push([
            [oxl, y3],
            [x3, y3],
            [x3, y4],
            [oxl, y4],
          ]);
          centerList.push([
            [x3, y3],
            [oxr, yb],
            [oxr, y4],
            [x3, y4]
          ]);
        }
        else if(oxr < x3) {
          centerList.push([
            [oxl, ya],
            [x2, y3],
            [x2, y4],
            [oxl, y4]
          ]);
          centerList.push([
            [x2, y3],
            [oxr, y3],
            [oxr, y4],
            [x2, y4],
          ]);
        }
        else {
          centerList.push([
            [oxl, ya],
            [x2, y3],
            [x2, y4],
            [oxl, y4]
          ]);
          centerList.push([
            [x2, y3],
            [x3, y3],
            [x3, y4],
            [x2, y4],
          ]);
          centerList.push([
            [x3, y3],
            [oxr, yb],
            [oxr, y4],
            [x3, y4]
          ]);
        }
      }
      endList.push([
        [oxr, yb],
        points[1],
        points[2],
        [oxr, y4]
      ]);
    }
    // 跨越右圆角
    else if(points[2][0] > oxr) {
      let y = oxr > x3 ? (y4 - Math.tan(deg2) * (x4 - oxr)) : y3;
      centerList.push([
        points[0],
        [oxr, y],
        [oxr, y4],
        points[3]
      ]);
      endList.push([
        [oxr, y],
        points[1],
        points[2],
        [oxr, y4]
      ]);
    }
    // 跨越左圆角
    else if(points[3][0] < oxl) {
      let y = oxl < x2 ? (y4 - Math.tan(deg1) * (oxl - x1)) : y3;
      beginList.push([
        points[0],
        [oxl, y],
        [oxl, y4],
        points[3]
      ]);
      centerList.push([
        [oxl, y],
        points[1],
        points[2],
        [oxl, y4],
      ]);
    }
    else {
      centerList.push(points);
    }
  }
  let beginLength = beginList.length;
  if(beginLength) {
    // 边宽可能大于圆角尺寸，边的里面无需圆弧化
    let needInner = brx > (x2 - x1) && borderWidth < bry;
    // 算这个角度是为了头部和上条边相交线的延长线
    let crossDeg = Math.atan((x2 - x1) / (y4 - y3));
    let rx1 = brx;
    let ry1 = bry;
    let sx1 = ry1 / rx1;
    let oyl = y4 - bry;
    let rx2 = brx - (x2 - x1);
    let ry2 = bry - (y4 - y3);
    let sx2 = ry2 / rx2;
    // 先计算第一个块，确定x/y边界，防止因为划分原因导致出现超过边界情况交叉
    let xa, ya, xb, yb;
    let ca = calBezierBottomLeft(beginList[0][3], beginList[0][2], oxl, oyl, sx1, ry1, true, Math.tan(crossDeg) * ry1);
    [xa, ya] = ca[0];
    let cb;
    if(needInner) {
      cb = calBezierBottomLeft(beginList[0][0], beginList[0][1], oxl, oyl, sx2, ry2, true, Math.tan(crossDeg) * ry2);
      [xb, yb] = cb[0];
    }
    beginList.forEach((points, i) => {
      let controls1;
      let controls2;
      if(i === 0) {
        controls1 = ca;
        if(needInner) {
          controls2 = cb;
        }
      }
      else {
        controls1 = calBezierBottomLeft(points[3], points[2], oxl, oyl, sx1, ry1);
        if(needInner) {
          controls2 = calBezierBottomLeft(points[0], points[1], oxl, oyl, sx2, ry2);
        }
      }
      for(let i = 0, len = controls1.length; i < len; i++) {
        limit(controls1[i], xa, ya, 4);
      }
      if(needInner) {
        for(let i = 0, len = controls2.length; i < len; i++) {
          limit(controls2[i], xb, yb, 4);
        }
        if(controls2.length === 1) {
          points[2] = controls2[0];
          points.pop();
        }
        else {
          points[2] = controls2[3];
          points[3] = controls2[2].concat(controls2[1]).concat(controls2[0]);
        }
      }
      else {
        points[2] = points[1];
        points[3] = points[0];
      }
      points[0] = controls1[0];
      points[1] = controls1[1].concat(controls1[2]).concat(controls1[3]);
    });
  }
  let endLength = endList.length;
  if(endLength) {
    // 边宽可能大于圆角尺寸，边的里面无需圆弧化
    let needInner = erx > (x4 - x3) && borderWidth < ery;
    // 算这个角度是为了最后和下条边相交线的延长线
    let crossDeg = Math.atan((x4 - x3) / (y4 - y3));
    let rx1 = erx;
    let ry1 = ery;
    let sx1 = ry1 / rx1;
    let oyr = y4 - ery;
    let rx2 = erx - (x4 - x3);
    let ry2 = ery - (y4 - y3);
    let sx2 = ry2 / rx2;
    // 先计算最后一个块，确定x/y边界，防止因为划分原因导致出现超过边界情况交叉
    let xa, ya, xb, yb;
    let ca = calBezierBottomRight(endList[endLength - 1][3], endList[endLength - 1][2], oxr, oyr, sx1, ry1, true, Math.tan(crossDeg) * ry1);
    [xa, ya] = ca[ca.length - 1];
    let cb;
    if(needInner) {
      cb = calBezierBottomRight(endList[endLength - 1][0], endList[endLength - 1][1], oxr, oyr, sx2, ry2, true, Math.tan(crossDeg) * ry2);
      [xb, yb] = cb[cb.length - 1];
    }
    endList.forEach((points, i) => {
      let controls1;
      let controls2;
      if(i === endLength - 1) {
        controls1 = ca;
        if(needInner) {
          controls2 = cb;
        }
      }
      else {
        controls1 = calBezierBottomRight(points[3], points[2], oxr, oyr, sx1, ry1);
        if(needInner) {
          controls2 = calBezierBottomRight(points[0], points[1], oxr, oyr, sx2, ry2);
        }
      }
      for(let i = 0, len = controls1.length; i < len; i++) {
        limit(controls1[i], xa, ya, 5);
      }
      if(needInner) {
        for(let i = 0, len = controls2.length; i < len; i++) {
          limit(controls2[i], xb, yb, 5);
        }
        if(controls2.length === 1) {
          points[2] = controls2[0];
          points.pop();
        }
        else {
          points[2] = controls2[3];
          points[3] = controls2[2].concat(controls2[1]).concat(controls2[0]);
        }
      }
      else {
        points[2] = points[1];
        points[3] = points[0];
      }
      points[0] = controls1[0];
      points[1] = controls1[1].concat(controls1[2]).concat(controls1[3]);
    });
  }
  return beginList.concat(centerList).concat(endList);
}

function calBezierBottomLeft(p1, p2, ox, oy, sx, r, isStart, crossDx) {
  // 先缩放x轴，椭圆变圆，2个点x坐标相应变化，y不变
  let [p1x, p1y] = p1;
  let [p2x, p2y] = p2;
  let dx1 = -p1x + ox;
  let dsx1 = dx1 * sx;
  let dx2 = -p2x + ox;
  let dsx2 = dx2 * sx;
  // 求2个点和1/4圆弧的交点坐标，和圆心连线，反三角函数求出夹角
  let deg2 = Math.atan(dsx2 / (p2y - oy));
  // 根据角和半径再三角函数求交点坐标，可以直接缩放x轴恢复原本椭圆坐标，求贝塞尔控制点用不到交点
  let cpx2 = ox - Math.sin(deg2) * r / sx;
  let cpy2 = oy + Math.cos(deg2) * r;
  let deg1;
  let cpx1;
  let cpy1;
  // 最初的是两条border的交界线，需要特殊求交界线延长和椭圆的交点，不能直连圆心求交点
  if(isStart) {
    // 交界线和y轴夹角beta以及交点的x坐标都会受缩放影响，先化圆好求交点坐标
    let crossDsx = crossDx * sx;
    let beta = Math.atan(crossDsx / r);
    // 公式计算可得beta和交点连圆心的角alpha关系
    let tanBetaDiv2Sqrt = Math.sqrt(Math.tan(beta) / 2);
    let tanAlphaHalf = tanBetaDiv2Sqrt / (1 + tanBetaDiv2Sqrt);
    let alpha = Math.atan(tanAlphaHalf) * 2;
    // 获得alpha后直接根据半径求出交点坐标
    deg1 = Math.PI * 0.5 - alpha;
    cpx1 = ox - Math.cos(alpha) * r / sx;
    cpy1 = oy + Math.sin(alpha) * r;
  }
  else {
    deg1 = Math.atan(dsx1 / (p1y - oy));
    cpx1 = ox - Math.sin(deg1) * r / sx;
    cpy1 = oy + Math.cos(deg1) * r;
  }
  // 首尾只有3个点情况下重复了顶点形成4边形，同时圆角x/y相等有inner时
  // 使得交点相同角度相同无法计算，直接返回1个点即可
  if(deg1 === deg2) {
    return [
      [cpx1, cpy1]
    ];
  }
  // 根据夹角求贝塞尔拟合圆弧长度
  let h = geom.h(Math.abs(deg1 - deg2));
  let d = h * r;
  // 过交点做切线，知道切线段长度d，求切线上从交点延长d的坐标，即为控制点
  // 圆心交点控制点连成直角三角形，获得斜边即圆心到控制点距离c
  // 求切线角，用上面夹角减去切线角可得控制点和圆心连线的角，从而获得坐标
  let c = Math.sqrt(Math.pow(r, 2) + Math.pow(d, 2));
  let degTg = Math.atan(d / r);
  let degTg1 = deg1 - degTg;
  let cdx1 = Math.sin(degTg1) * c;
  let cdy1 = Math.cos(degTg1) * c;
  let cx1 = ox - cdx1 / sx;
  let cy1 = oy + cdy1;
  let degTg2 = deg2 + degTg;
  let cdx2 = Math.sin(degTg2) * c;
  let cdy2 = Math.cos(degTg2) * c;
  let cx2 = ox - cdx2 / sx;
  let cy2 = oy + cdy2;
  // window.ctx.fillStyle = '#F90';
  // window.ctx.beginPath();
  // window.ctx.arc(cpx1, cpy1, 1,0, 2 * Math.PI);
  // window.ctx.fill();
  // window.ctx.fillStyle = '#0FF';
  // window.ctx.beginPath();
  // window.ctx.arc(cx1, cy1, 1,0, 2 * Math.PI);
  // window.ctx.fill();
  // window.ctx.fillStyle = '#00F';
  // window.ctx.beginPath();
  // window.ctx.arc(cx2, cy2, 1,0, 2 * Math.PI);
  // window.ctx.fill();
  // window.ctx.fillStyle = '#0F0';
  // window.ctx.beginPath();
  // window.ctx.arc(cpx2, cpy2, 1,0, 2 * Math.PI);
  // window.ctx.fill();
  // window.ctx.closePath();
  return [
    [cpx1, cpy1],
    [cx1, cy1],
    [cx2, cy2],
    [cpx2, cpy2]
  ];
}

function calBezierBottomRight(p1, p2, ox, oy, sx, r, isEnd, crossDx) {
  // 先缩放x轴，椭圆变圆，2个点x坐标相应变化，y不变
  let [p1x, p1y] = p1;
  let [p2x, p2y] = p2;
  let dx1 = p1x - ox;
  let dsx1 = dx1 * sx;
  let dx2 = p2x - ox;
  let dsx2 = dx2 * sx;
  // 求2个点和1/4圆弧的交点坐标，和圆心连线，反三角函数求出夹角
  let deg1 = Math.atan(dsx1 / (p1y - oy));
  // 根据角和半径再三角函数求交点坐标，可以直接缩放x轴恢复原本椭圆坐标，求贝塞尔控制点用不到交点
  let cpx1 = ox + Math.sin(deg1) * r / sx;
  let cpy1 = oy + Math.cos(deg1) * r;
  let deg2;
  let cpx2;
  let cpy2;
  // 最后的是两条border的交界线，需要特殊求交界线延长和椭圆的交点，不能直连圆心求交点
  if(isEnd) {
    // 交界线和y轴夹角beta以及交点的x坐标都会受缩放影响，先化圆好求交点坐标
    let crossDsx = crossDx * sx;
    let beta = Math.atan(crossDsx / r);
    // 公式计算可得beta和交点连圆心的角alpha关系
    let tanBetaDiv2Sqrt = Math.sqrt(Math.tan(beta) / 2);
    let tanAlphaHalf = tanBetaDiv2Sqrt / (1 + tanBetaDiv2Sqrt);
    let alpha = Math.atan(tanAlphaHalf) * 2;
    // 获得alpha后直接根据半径求出交点坐标
    deg2 = Math.PI * 0.5 - alpha;
    cpx2 = ox + Math.cos(alpha) * r / sx;
    cpy2 = oy + Math.sin(alpha) * r;
  }
  else {
    deg2 = Math.atan(dsx2 / (p2y - oy));
    cpx2 = ox + Math.sin(deg2) * r / sx;
    cpy2 = oy + Math.cos(deg2) * r;
  }
  // 首尾只有3个点情况下重复了顶点形成4边形，同时圆角x/y相等有inner时
  // 使得交点相同角度相同无法计算，直接返回1个点即可
  if(deg1 === deg2) {
    return [
      [cpx1, cpy1]
    ];
  }
  // 根据夹角求贝塞尔拟合圆弧长度
  let h = geom.h(Math.abs(deg1 - deg2));
  let d = h * r;
  // 过交点做切线，知道切线段长度d，求切线上从交点延长d的坐标，即为控制点
  // 圆心交点控制点连成直角三角形，获得斜边即圆心到控制点距离c
  // 求切线角，用上面夹角减去切线角可得控制点和圆心连线的角，从而获得坐标
  let c = Math.sqrt(Math.pow(r, 2) + Math.pow(d, 2));
  let degTg = Math.atan(d / r);
  let degTg1 = deg1 + degTg;
  let cdx1 = Math.sin(degTg1) * c;
  let cdy1 = Math.cos(degTg1) * c;
  let cx1 = ox + cdx1 / sx;
  let cy1 = oy + cdy1;
  let degTg2 = deg2 - degTg;
  let cdx2 = Math.sin(degTg2) * c;
  let cdy2 = Math.cos(degTg2) * c;
  let cx2 = ox + cdx2 / sx;
  let cy2 = oy + cdy2;
  // window.ctx.fillStyle = '#F90';
  // window.ctx.beginPath();
  // window.ctx.arc(cpx1, cpy1, 1,0, 2 * Math.PI);
  // window.ctx.fill();
  // window.ctx.fillStyle = '#0FF';
  // window.ctx.beginPath();
  // window.ctx.arc(cx1, cy1, 1,0, 2 * Math.PI);
  // window.ctx.fill();
  // window.ctx.fillStyle = '#00F';
  // window.ctx.beginPath();
  // window.ctx.arc(cx2, cy2, 1,0, 2 * Math.PI);
  // window.ctx.fill();
  // window.ctx.fillStyle = '#0F0';
  // window.ctx.beginPath();
  // window.ctx.arc(cpx2, cpy2, 1,0, 2 * Math.PI);
  // window.ctx.fill();
  // window.ctx.closePath();
  return [
    [cpx1, cpy1],
    [cx1, cy1],
    [cx2, cy2],
    [cpx2, cpy2]
  ];
}

function calLeftRadiusPoints(borderWidth, deg1, deg2, x1, x2, x3, x4, y1, y2, y3, y4, pointsList, beginRadius, endRadius) {
  let [brx, bry] = beginRadius;
  let [erx, ery] = endRadius;
  // 一条边的两侧圆角均为0时无效
  if((!brx || !bry) && (!erx || !ery)) {
    return pointsList;
  }
  // 分界坐标圆心，上圆角、下圆角、中间矩形，3个区域2个坐标；当上下圆角相接时中间矩形为0即中间2个坐标相等
  let oyt = y2 + bry - (y2 - y1);
  let oyb = y3 - ery + (y4 - y3);
  let beginList = [];
  let centerList = [];
  let endList = [];
  // 同borderTop拆分
  for(let i = 0, len = pointsList.length; i < len; i++) {
    let points = pointsList[i];
    // 全在上圆角
    if(points[3][1] < oyt) {
      beginList.push(points);
    }
    // 全在下圆角
    else if(points[0][1] > oyb) {
      endList.push(points);
    }
    // 跨越上下圆角
    else if(points[3][1] > oyb && points[0][1] < oyt) {
      let xa = oyt < y2 ? (x2 - Math.tan(deg2) * (y2 - oyt)) : x2;
      let xb = oyb > y3 ? (x2 - Math.tan(deg1) * (oyb - y3)) : x2;
      beginList.push([
        points[0],
        points[1],
        [xa, oyt],
        [x1, oyt]
      ]);
      if(oyt < oyb) {
        if(oyb < y3 && oyt > y2) {
          centerList.push([
            [x1, oyt],
            [x2, oyt],
            [x2, oyb],
            [x1, oyb]
          ]);
        }
        else if(oyt > y2) {
          centerList.push([
            [x1, oyt],
            [x2, oyt],
            [x2, y3],
            [x1, y3],
          ]);
          centerList.push([
            [x1, y3],
            [x2, y3],
            [xb, oyb],
            [x1, oyb],
          ]);
        }
        else if(oyb < y3) {
          centerList.push([
            [x1, oyt],
            [xa, oyt],
            [x2, y2],
            [x1, y2],
          ]);
          centerList.push([
            [x1, y2],
            [x2, y2],
            [x2, oyb],
            [x1, oyb],
          ]);
        }
        else {
          centerList.push([
            [x1, oyt],
            [xa, oyt],
            [x2, y2],
            [x1, y2],
          ]);
          centerList.push([
            [x1, y2],
            [x2, y2],
            [x2, y3],
            [x1, y3],
          ]);
          centerList.push([
            [x1, y3],
            [x2, y3],
            [xb, oyb],
            [x1, oyb],
          ]);
        }
      }
      endList.push([
        [x1, oyb],
        [xb, oyb],
        points[2],
        points[3]
      ]);
    }
    // 跨越下圆角
    else if(points[3][1] > oyb) {
      let x = oyb > y3 ? (x2 - Math.tan(deg1) * (oyb - y3)) : x2;
      centerList.push([
        points[0],
        points[1],
        [x, oyb],
        [x1, oyb]
      ]);
      endList.push([
        [x1, oyb],
        [x, oyb],
        points[2],
        points[3]
      ]);
    }
    // 跨越上圆角
    else if(points[1][1] < oyt) {
      let x = oyt < y2 ? (x2 - Math.tan(deg2) * (y2 - oyt)) : x2;
      beginList.push([
        points[0],
        points[1],
        [x, oyt],
        [x1, oyt]
      ]);
      centerList.push([
        [x1, oyt],
        [x, oyt],
        points[2],
        points[3]
      ]);
    }
    else {
      centerList.push(points);
    }
  }
  let beginLength = beginList.length;
  if(beginLength) {
    let needInner = bry > (y2 - y1) && borderWidth < brx;
    let crossDeg = Math.atan((x2 - x1) / (y2 - y1));
    let rx1 = brx;
    let ry1 = bry;
    let sx1 = ry1 / rx1;
    let oxt = x1 + brx;
    let rx2 = brx - (x2 - x1);
    let ry2 = bry - (y2 - y1);
    let sx2 = ry2 / rx2;
    // 先计算第一个块，确定x/y边界，防止因为划分原因导致出现超过边界情况交叉
    let xa, ya, xb, yb;
    let ca = calBezierLeftTop(beginList[0][0], beginList[0][3], oxt, oyt, sx1, ry1, true, Math.tan(crossDeg) * ry1);
    [xa, ya] = ca[ca.length - 1];
    let cb;
    if(needInner) {
      cb = calBezierLeftTop(beginList[0][1], beginList[0][2], oxt, oyt, sx2, ry2, true, Math.tan(crossDeg) * ry2);
      [xb, yb] = cb[cb.length - 1];
    }
    beginList.forEach((points, i) => {
      let controls1;
      let controls2;
      if(i === 0) {
        controls1 = ca;
        if(needInner) {
          controls2 = cb;
        }
      }
      else {
        controls1 = calBezierLeftTop(points[0], points[3], oxt, oyt, sx1, ry1);
        if(needInner) {
          controls2 = calBezierLeftTop(points[1], points[2], oxt, oyt, sx2, ry2);
        }
      }
      for(let i = 0, len = controls1.length; i < len; i++) {
        limit(controls1[i], xa, ya, 6);
      }
      if(needInner) {
        for(let i = 0, len = controls2.length; i < len; i++) {
          limit(controls2[i], xb, yb, 6);
        }
        if(controls2.length === 1) {
          points[2] = controls2[0];
          points.pop();
        }
        else {
          points[2] = controls2[0];
          points[3] = controls2[1].concat(controls2[2]).concat(controls2[3]);
        }
      }
      else {
        points[3] = points[1];
      }
      points[0] = controls1[3];
      points[1] = controls1[2].concat(controls1[1]).concat(controls1[0]);
    });
  }
  let endLength = endList.length;
  if(endLength) {
    let needInner = ery > (y4 - y3) && borderWidth < erx;
    let crossDeg = Math.atan((x2 - x1) / (y4 - y3));
    let rx1 = erx;
    let ry1 = ery;
    let sx1 = ry1 / rx1;
    let oxb = x1 + erx;
    let rx2 = erx - (x2 - x1);
    let ry2 = ery - (y4 - y3);
    let sx2 = ry2 / rx2;
    // 先计算最后一个块，确定x/y边界，防止因为划分原因导致出现超过边界情况交叉
    let xa, ya, xb, yb;
    let ca = calBezierLeftBottom(endList[endLength - 1][0], endList[endLength - 1][3], oxb, oyb, sx1, ry1, true, Math.tan(crossDeg) * ry1);
    [xa, ya] = ca[0];
    let cb;
    if(needInner) {
      cb = calBezierLeftBottom(endList[endLength - 1][1], endList[endLength - 1][2], oxb, oyb, sx2, ry2, true, Math.tan(crossDeg) * ry2);
      [xb, yb] = cb[0];
    }
    endList.forEach((points, i) => {
      let controls1;
      let controls2;
      if(i === endLength - 1) {
        controls1 = ca;
        if(needInner) {
          controls2 = cb;
        }
      }
      else {
        controls1 = calBezierLeftBottom(points[0], points[3], oxb, oyb, sx1, ry1);
        if(needInner) {
          controls2 = calBezierLeftBottom(points[1], points[2], oxb, oyb, sx2, ry2);
        }
      }
      for(let i = 0, len = controls1.length; i < len; i++) {
        limit(controls1[i], xa, ya, 7);
      }
      if(needInner) {
        for(let i = 0, len = controls2.length; i < len; i++) {
          limit(controls2[i], xb, yb, 7);
        }
        if(controls2.length === 1) {
          points[2] = controls2[0];
          points.pop();
        }
        else {
          points[2] = controls2[0];
          points[3] = controls2[1].concat(controls2[2]).concat(controls2[3]);
        }
      }
      else {
        points[3] = points[1];
      }
      points[0] = controls1[3];
      points[1] = controls1[2].concat(controls1[1]).concat(controls1[0]);
    });
  }
  return beginList.concat(centerList).concat(endList);
}

function calBezierLeftTop(p1, p2, ox, oy, sx, r, isStart, crossDx) {
  // 先缩放x轴，椭圆变圆，2个点x坐标相应变化，y不变
  let [p1x, p1y] = p1;
  let [p2x, p2y] = p2;
  let dx1 = ox - p1x;
  let dsx1 = dx1 * sx;
  let dx2 = ox - p2x;
  let dsx2 = dx2 * sx;
  // 求2个点和1/4圆弧的交点坐标，和圆心连线，反三角函数求出夹角
  let deg2 = Math.atan(dsx2 / (oy - p2y));
  // 根据角和半径再三角函数求交点坐标，可以直接缩放x轴恢复原本椭圆坐标，求贝塞尔控制点用不到交点
  let cpx2 = ox - Math.sin(deg2) * r / sx;
  let cpy2 = oy - Math.cos(deg2) * r;
  let deg1;
  let cpx1;
  let cpy1;
  if(isStart) {
    // 交界线和y轴夹角beta以及交点的x坐标都会受缩放影响，先化圆好求交点坐标
    let crossDsx = crossDx * sx;
    let beta = Math.atan(crossDsx / r);
    // 公式计算可得beta和交点连圆心的角alpha关系
    let tanBetaDiv2Sqrt = Math.sqrt(Math.tan(beta) / 2);
    let tanAlphaHalf = tanBetaDiv2Sqrt / (1 + tanBetaDiv2Sqrt);
    let alpha = Math.atan(tanAlphaHalf) * 2;
    // 获得alpha后直接根据半径求出交点坐标
    deg1 = Math.PI * 0.5 - alpha;
    cpx1 = ox - Math.cos(alpha) * r / sx;
    cpy1 = oy - Math.sin(alpha) * r;
  }
  else {
    deg1 = Math.atan(dsx1 / (oy - p1y));
    cpx1 = ox - Math.sin(deg1) * r / sx;
    cpy1 = oy - Math.cos(deg1) * r;
  }
  // 首尾只有3个点情况下重复了顶点形成4边形，同时圆角x/y相等有inner时
  // 使得交点相同角度相同无法计算，直接返回1个点即可
  if(deg1 === deg2) {
    return [
      [cpx1, cpy1]
    ];
  }
  // 根据夹角求贝塞尔拟合圆弧长度
  let h = geom.h(Math.abs(deg1 - deg2));
  let d = h * r;
  // 过交点做切线，知道切线段长度d，求切线上从交点延长d的坐标，即为控制点
  // 圆心交点控制点连成直角三角形，获得斜边即圆心到控制点距离c
  // 求切线角，用上面夹角减去切线角可得控制点和圆心连线的角，从而获得坐标
  let c = Math.sqrt(Math.pow(r, 2) + Math.pow(d, 2));
  let degTg = Math.atan(d / r);
  let degTg1 = deg1 + degTg;
  let cdx1 = Math.sin(degTg1) * c;
  let cdy1 = Math.cos(degTg1) * c;
  let cx1 = ox - cdx1 / sx;
  let cy1 = oy - cdy1;
  let degTg2 = deg2 - degTg;
  let cdx2 = Math.sin(degTg2) * c;
  let cdy2 = Math.cos(degTg2) * c;
  let cx2 = ox - cdx2 / sx;
  let cy2 = oy - cdy2;
  // window.ctx.fillStyle = '#000';
  // window.ctx.beginPath();
  // window.ctx.arc(cpx1, cpy1, 1,0, 2 * Math.PI);
  // window.ctx.fill();
  // window.ctx.fillStyle = '#0FF';
  // window.ctx.beginPath();
  // window.ctx.arc(cx1, cy1, 1,0, 2 * Math.PI);
  // window.ctx.fill();
  // window.ctx.fillStyle = '#00F';
  // window.ctx.beginPath();
  // window.ctx.arc(cx2, cy2, 1,0, 2 * Math.PI);
  // window.ctx.fill();
  // window.ctx.fillStyle = '#0F0';
  // window.ctx.beginPath();
  // window.ctx.arc(cpx2, cpy2, 1,0, 2 * Math.PI);
  // window.ctx.fill();
  // window.ctx.closePath();
  return [
    [cpx2, cpy2],
    [cx2, cy2],
    [cx1, cy1],
    [cpx1, cpy1]
  ];
}

function calBezierLeftBottom(p1, p2, ox, oy, sx, r, isEnd, crossDx) {
  // 先缩放x轴，椭圆变圆，2个点x坐标相应变化，y不变
  let [p1x, p1y] = p1;
  let [p2x, p2y] = p2;
  let dx1 = ox - p1x;
  let dsx1 = dx1 * sx;
  let dx2 = ox - p2x;
  let dsx2 = dx2 * sx;
  // 求2个点和1/4圆弧的交点坐标，和圆心连线，反三角函数求出夹角
  let deg1 = Math.atan(dsx1 / (p1y - oy));
  // 根据角和半径再三角函数求交点坐标，可以直接缩放x轴恢复原本椭圆坐标，求贝塞尔控制点用不到交点
  let cpx1 = ox - Math.sin(deg1) * r / sx;
  let cpy1 = oy + Math.cos(deg1) * r;
  let deg2;
  let cpx2;
  let cpy2;
  if(isEnd) {
    // 交界线和y轴夹角beta以及交点的x坐标都会受缩放影响，先化圆好求交点坐标
    let crossDsx = crossDx * sx;
    let beta = Math.atan(crossDsx / r);
    // 公式计算可得beta和交点连圆心的角alpha关系
    let tanBetaDiv2Sqrt = Math.sqrt(Math.tan(beta) / 2);
    let tanAlphaHalf = tanBetaDiv2Sqrt / (1 + tanBetaDiv2Sqrt);
    let alpha = Math.atan(tanAlphaHalf) * 2;
    // 获得alpha后直接根据半径求出交点坐标
    deg2 = Math.PI * 0.5 - alpha;
    cpx2 = ox - Math.cos(alpha) * r / sx;
    cpy2 = oy + Math.sin(alpha) * r;
  }
  else {
    deg2 = Math.atan(dsx2 / (p2y - oy));
    cpx2 = ox - Math.sin(deg2) * r / sx;
    cpy2 = oy + Math.cos(deg2) * r;
  }
  // 首尾只有3个点情况下重复了顶点形成4边形，同时圆角x/y相等有inner时
  // 使得交点相同角度相同无法计算，直接返回1个点即可
  if(deg1 === deg2) {
    return [
      [cpx1, cpy1]
    ];
  }
  // 根据夹角求贝塞尔拟合圆弧长度
  let h = geom.h(Math.abs(deg1 - deg2));
  let d = h * r;
  // 过交点做切线，知道切线段长度d，求切线上从交点延长d的坐标，即为控制点
  // 圆心交点控制点连成直角三角形，获得斜边即圆心到控制点距离c
  // 求切线角，用上面夹角减去切线角可得控制点和圆心连线的角，从而获得坐标
  let c = Math.sqrt(Math.pow(r, 2) + Math.pow(d, 2));
  let degTg = Math.atan(d / r);
  let degTg1 = deg1 - degTg;
  let cdx1 = Math.sin(degTg1) * c;
  let cdy1 = Math.cos(degTg1) * c;
  let cx1 = ox - cdx1 / sx;
  let cy1 = oy + cdy1;
  let degTg2 = deg2 + degTg;
  let cdx2 = Math.sin(degTg2) * c;
  let cdy2 = Math.cos(degTg2) * c;
  let cx2 = ox - cdx2 / sx;
  let cy2 = oy + cdy2;
  // window.ctx.fillStyle = '#F90';
  // window.ctx.beginPath();
  // window.ctx.arc(cpx1, cpy1, 1,0, 2 * Math.PI);
  // window.ctx.fill();
  // window.ctx.fillStyle = '#0FF';
  // window.ctx.beginPath();
  // window.ctx.arc(cx1, cy1, 1,0, 2 * Math.PI);
  // window.ctx.fill();
  // window.ctx.fillStyle = '#00F';
  // window.ctx.beginPath();
  // window.ctx.arc(cx2, cy2, 1,0, 2 * Math.PI);
  // window.ctx.fill();
  // window.ctx.fillStyle = '#0F0';
  // window.ctx.beginPath();
  // window.ctx.arc(cpx2, cpy2, 1,0, 2 * Math.PI);
  // window.ctx.fill();
  // window.ctx.closePath();
  return [
    [cpx2, cpy2],
    [cx2, cy2],
    [cx1, cy1],
    [cpx1, cpy1]
  ];
}

/**
 * 简单计算椭圆的圆化坐标控制点，视作重合位置，外面判断backgroundClip并调整坐标
 * @param x 起始x
 * @param y 起始y
 * @param w 宽
 * @param h 高
 * @param btlr borderTopLeftRadius
 * @param btrr borderTopRightRadius
 * @param bbrr borderBottomRightRadius
 * @param bblr borderBottomLeftRadius
 * @returns {[]} 多边形的顶点和曲线控制点
 */
function calRadius(x, y, w, h, btlr, btrr, bbrr, bblr) {
  let need;
  let [btlx, btly] = btlr;
  let [btrx, btry] = btrr;
  let [bbrx, bbry] = bbrr;
  let [bblx, bbly] = bblr;
  btlx = Math.max(btlx, 0);
  btly = Math.max(btly, 0);
  btrx = Math.max(btrx, 0);
  btry = Math.max(btry, 0);
  bbrx = Math.max(bbrx, 0);
  bbry = Math.max(bbry, 0);
  bblx = Math.max(bblx, 0);
  bbly = Math.max(bbly, 0);
  // 圆角必须x/y都>0才有效，否则视为不绘制
  if(btlx > 0 && btly > 0 || btrx > 0 && btry > 0 || bbrx > 0 && bbry > 0 || bblx > 0 && bbly > 0) {
    need = true;
  }
  if(need) {
    let list = [];
    if(btlx > 0 && btly > 0) {
      list.push([x, y + btly]);
      list.push([x, y + (btly) * (1 - H), x + btlx * (1 - H), y, x + btlx, y]);
    }
    else {
      list.push([x, y]);
    }
    if(btrx > 0 && btry > 0) {
      list.push([x + w - btrx, y]);
      list.push([x + w - btrx * (1 - H), y, x + w, y + btry * (1 - H), x + w, y + btry]);
    }
    else {
      list.push([x + w, y]);
    }
    if(bbrx > 0 && bbry > 0) {
      list.push([x + w, y + h - bbry]);
      list.push([x + w, y + h - bbry * (1 - H), x + w - bbrx * (1 - H), y + h, x + w - bbrx, y + h]);
    }
    else {
      list.push([x + w, y + h]);
    }
    if(bblx > 0 && bbly > 0) {
      list.push([x + bblx, y + h]);
      list.push([x + bblx * (1 - H), y + h, x, y + h - bbly * (1 - H), x, y + h - bbly]);
    }
    else {
      list.push([x, y + h]);
    }
    return list;
  }
}

function limit(points, x, y, direction) {
  if(direction === 0) {
    points[0] = Math.max(points[0], x);
    points[1] = Math.min(points[1], y);
  }
  else if(direction === 1) {
    points[0] = Math.min(points[0], x);
    points[1] = Math.min(points[1], y);
  }
  else if(direction === 2) {
    points[0] = Math.max(points[0], x);
    points[1] = Math.max(points[1], y);
  }
  else if(direction === 3) {
    points[0] = Math.max(points[0], x);
    points[1] = Math.min(points[1], y);
  }
  else if(direction === 4) {
    points[0] = Math.max(points[0], x);
    points[1] = Math.max(points[1], y);
  }
  else if(direction === 5) {
    points[0] = Math.min(points[0], x);
    points[1] = Math.max(points[1], y);
  }
  else if(direction === 6) {
    points[0] = Math.min(points[0], x);
    points[1] = Math.max(points[1], y);
  }
  else if(direction === 7) {
    points[0] = Math.min(points[0], x);
    points[1] = Math.min(points[1], y);
  }
}

const BR_KS = [BORDER_TOP_LEFT_RADIUS, BORDER_TOP_RIGHT_RADIUS, BORDER_BOTTOM_RIGHT_RADIUS, BORDER_BOTTOM_LEFT_RADIUS];
function calBorderRadius(w, h, currentStyle, computedStyle, root) {
  let noRadius = true;
  BR_KS.forEach(k => {
    computedStyle[k] = currentStyle[k].map((item, i) => {
      if(item[0] > 0) {
        noRadius = false;
      }
      else {
        return 0;
      }
      if(item[1] === PX) {
        return Math.max(0, item[0]);
      }
      else if(item[1] === PERCENT) {
        return Math.max(0, item[0] * (i ? h : w) * 0.01);
      }
      else if(item[1] === REM) {
        return Math.max(0, item[0] * root.computedStyle[FONT_SIZE]);
      }
      else if(item[1] === VW) {
        return Math.max(0, item[0] * root.width * 0.01);
      }
      else if(item[1] === VH) {
        return Math.max(0, item[0] * root.height * 0.01);
      }
      else if(item[1] === VMAX) {
        return Math.max(0, item[0] * Math.max(root.width, root.height) * 0.01);
      }
      else if(item[1] === VMIN) {
        return Math.max(0, item[0] * Math.min(root.width, root.height) * 0.01);
      }
      return 0;
    });
  });
  // 优化提前跳出
  if(noRadius) {
    return;
  }
  // radius限制，相交的2个之和不能超过边长，如果2个都超过中点取中点，只有1个超过取交点，这包含了单个不能超过总长的逻辑
  BR_KS.forEach((k, i) => {
    let j = i % 2 === 0 ? 0 : 1;
    let target = j ? h : w;
    let prev = computedStyle[k];
    let next = computedStyle[BR_KS[(i + 1) % 4]];
    // 相加超过边长则是相交
    if(prev[j] + next[j] > target) {
      let half = target * 0.5;
      // 都超过一半中点取中点
      if(prev[j] >= half && next[j] >= half) {
        prev[j] = next[j] = half;
      }
      // 仅1个超过中点，因相交用总长减去另一方即可
      else if(prev[j] > half) {
        prev[j] = target - next[j];
      }
      else if(next[j] > half) {
        next[j] = target - prev[j];
      }
    }
  });
}

function calBorderRadiusInline(contentBoxList, currentStyle, computedStyle) {
  let first, last;
  if(contentBoxList.length) {
    first = contentBoxList[0];
    last = contentBoxList[contentBoxList.length - 1];
    if(last instanceof Ellipsis) {
      last = contentBoxList[contentBoxList.length - 2];
    }
  }
  // 先看first的左侧
  let w = first ? first.outerWidth : 0, h = first ? first.outerHeight : 0;
  w += computedStyle[BORDER_LEFT_WIDTH] + computedStyle[PADDING_LEFT];
  h += computedStyle[BORDER_TOP_WIDTH] + computedStyle[BORDER_BOTTOM_WIDTH]
    + computedStyle[PADDING_TOP] + computedStyle[PADDING_BOTTOM];
  [BORDER_TOP_LEFT_RADIUS, BORDER_BOTTOM_LEFT_RADIUS].forEach(k => {
    computedStyle[k] = currentStyle[k].map((item, i) => {
      let v;
      if(item[1] === PX) {
        v = Math.max(0, item[0]);
        v = Math.min(i ? h : w, v);
      }
      else {
        v = Math.max(0, item[0] * (i ? h : w) * 0.01);
        v = Math.min(i ? h : w, v);
      }
      return v;
    });
  });
  // 再看end的右侧
  w = last ? last.outerWidth : 0;
  h = last ? last.outerHeight : 0;
  [BORDER_TOP_RIGHT_RADIUS, BORDER_BOTTOM_RIGHT_RADIUS].forEach(k => {
    computedStyle[k] = currentStyle[k].map((item, i) => {
      let v;
      if(item[1] === PX) {
        v = Math.max(0, item[0]);
        v = Math.min(i ? h : w, v);
      }
      else {
        v = Math.max(0, item[0] * (i ? h : w) * 0.01);
        v = Math.min(i ? h : w, v);
      }
      return v;
    });
  });
}

function renderBorder(xom, renderMode, ctx, points, color, dx, dy) {
  if(renderMode === mode.CANVAS || renderMode === mode.WEBGL) {
    ctx.beginPath();
    if(ctx.fillStyle !== color) {
      ctx.fillStyle = color;
    }
    points.forEach(point => {
      canvasPolygon(ctx, point, dx, dy);
    });
    ctx.fill();
    ctx.closePath();
  }
  else if(renderMode === mode.SVG) {
    let s = '';
    points.forEach(point => {
      s += svgPolygon(point);
    });
    xom.virtualDom.bb.push({
      type: 'item',
      tagName: 'path',
      props: [
        ['d', s],
        ['fill', color],
      ],
    });
  }
}

export default {
  calPoints,
  calRadius,
  calBorderRadius,
  calBorderRadiusInline,
  renderBorder,
};
