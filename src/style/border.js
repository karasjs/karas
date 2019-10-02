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

// 获取边框分割为几块的坐标，虚线分割为若干四边形和三边型
// direction为上右下左0123
function calPoints(borderWidth, borderStyle, deg1, deg2, x1, x2, x3, x4, y1, y2, y3, y4, direction) {
  let points = [];
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
          if(main2 < x2) {
            if(isLast) {
              points.push([x1, y1, x4, y1, x3, y2, x2, y2]);
            }
            else {
              cross1 = y1 + (main1 - x1) * Math.tan(deg1);
              cross2 = y1 + (main2 - x1) * Math.tan(deg1);
              points.push([main1, y1, main2, y1, main2, cross2, main1, cross1]);
            }
          }
          // 整个和borderRight重叠
          else if(main1 > x3) {
            cross1 = y1 + (x4 - main1) * Math.tan(deg2);
            cross2 = y1 + (x4 - main2) * Math.tan(deg2);
            if(isLast) {
              points.push([main1, y1, x4, y1, main1, cross1]);
            }
            else {
              points.push([main1, y1, main2, y1, main2, cross2, main1, cross1]);
            }
          }
          // 不被整个重叠的情况再细分
          else {
            // 上部分和borderLeft重叠
            if(main1 < x2) {
              cross1 = y1 + (main1 - x1) * Math.tan(deg1);
              if(isLast) {
                points.push([main1, y1, x4, y1, x3, y2, x2, y2, main1, cross1]);
              }
              else {
                // 下部分和borderRight重叠
                if(main2 > x3) {
                  points.push([main1, y1, main2, y1, x3, y2, x2, y2, main1, cross1]);
                }
                // 下部独立
                else {
                  points.push([main1, y1, main2, y1, main2, y2, x2, y2, main1, cross1]);
                }
              }
            }
            // 下部分和borderRight重叠
            else if(main2 > x3) {
              cross1 = y1 + (x4 - main2) * Math.tan(deg2);
              // 上部分和borderLeft重叠
              if(main1 < x2) {
                if(isLast) {
                  points.push([main1, y1, x4, y1, x3, y2, x2, y2, main1, cross1]);
                }
                else {
                  points.push([main1, y1, main2, y1, main2, cross1, x3, y2, x2, y2, main1, cross1]);
                }
              }
              // 上部独立
              else {
                if(isLast) {
                  points.push([main1, y1, x4, y1, x3, y2, main1, y2]);
                }
                else {
                  points.push([main1, y1, main2, y1, main2, cross1, x3, y2, main1, y2]);
                }
              }
            }
            // 完全独立
            else {
              if(isLast) {
                points.push([main1, y1, x4, y1, x3, y2, main1, y2]);
              }
              else {
                points.push([main1, y1, main2, y1, main2, y2, main1, y2]);
              }
            }
          }
        }
        else if(direction === 1) {
          // 整个和borderTop重叠
          if(main2 < y2) {
            if(isLast) {
              points.push([x3, y2, x4, y1, x4, y4, x3, y3]);
            }
            else {
              cross1 = x4 - (main2 - y1) * Math.tan(deg1);
              cross2 = x4 - (main1 - y1) * Math.tan(deg1);
              points.push([cross1, main2, cross2, main1, x4, main1, x4, main2]);
            }
          }
          // 整个和borderBottom重叠
          else if(main1 > y3) {
            cross1 = x3 + (main1 - y3) * Math.tan(deg2);
            cross2 = x3 + (main2 - y3) * Math.tan(deg2);
            if(isLast) {
              points.push([cross1, main1, x4, main1, x4, y4]);
            }
            else {
              points.push([cross1, main1, x4, main1, x4, main2, cross2, main2]);
            }
          }
          // 不被整个重叠的情况再细分
          else {
            // 上部分和borderTop重叠
            if(main1 < y2) {
              cross1 = x3 + (y2 - main1) * Math.tan(deg1);
              if(isLast) {
                points.push([x3, y2, cross1, main1, x4, main1, x4, y4, x3, y4]);
              } else {
                // 下部分和borderBottom重叠
                if(main2 > y3) {
                  points.push([x3, y2, cross1, main1, x4, main1, x4, main2, cross1, main2, x3, y3]);
                }
                // 下部独立
                else {
                  points.push([x3, y2, cross1, main1, x4, main1, x4, main2, x3, main2]);
                }
              }
            }
            // 下部分和borderBottom重叠
            else if(main2 > y3) {
              cross1 = x3 + (main2 - y3) * Math.tan(deg2);
              // 上部分和borderTop重叠
              if(main1 < y2) {
                if(isLast) {
                  points.push([x3, y2, cross1, main1, x4, main1, x4, y4, x3, y3]);
                } else {
                  points.push([x3, y2, cross1, main1, x4, main1, x4, main2, cross1, main2, x3, y3]);
                }
              }
              // 上部独立
              else {
                if(isLast) {
                  points.push([x3, main1, x4, main1, x4, y4, x3, y3]);
                } else {
                  points.push([x3, main1, x4, main1, x4, main2, cross1, main2, x3, y3]);
                }
              }
            }
            // 完全独立
            else {
              if(isLast) {
                points.push([x3, main1, x4, main1, x4, y4, x3, y3]);
              } else {
                points.push([x3, main1, x4, main1, x4, main2, x3, main2]);
              }
            }
          }
        }
        else if(direction === 2) {
          // 整个和borderLeft重叠
          if(main2 < x2) {
            if(isLast) {
              points.push([x1, y4, x2, y3, x3, y3, x4, y4]);
            }
            else {
              cross1 = y4 - (main1 - x1) * Math.tan(deg1);
              cross2 = y4 - (main2 - x1) * Math.tan(deg1);
              points.push([main1, cross1, main2, cross2, main2, y4, main1, y4]);
            }
          }
          // 整个和borderRight重叠
          else if(main1 > x3) {
            cross1 = y4 - (main1 - x1) * Math.tan(deg2);
            cross2 = y4 - (main2 - x1) * Math.tan(deg2);
            if(isLast) {
              points.push([main1, cross1, x4, y4, main1, y4]);
            }
            else {
              points.push([main1, cross1, main2, cross2, main2, y4, main1, y4]);
            }
          }
          // 不被整个重叠的情况再细分
          else {
            // 上部分和borderLeft重叠
            if(main1 < x2) {
              cross1 = y3 + (main1 - x1) * Math.tan(deg1);
              if(isLast) {
                points.push([main1, cross1, x2, y3, x3, y3, x4, y4, main1, y4]);
              }
              else {
                // 下部分和borderRight重叠
                if(main2 > x3) {
                  points.push([main1, cross1, x2, y3, x3, y3, main2, y4, main1, y4]);
                }
                // 下部独立
                else {
                  points.push([main1, cross1, x2, y3, main2, y3, main2, y4, main1, y4]);
                }
              }
            }
            // 下部分和borderRight重叠
            else if(main2 > x3) {
              cross1 = y4 - (x4 - main2) * Math.tan(deg2);
              // 上部分和borderLeft重叠
              if(main1 < x2) {
                if(isLast) {
                  points.push([main1, cross1, x3, y3, x4, y4, main1, y4]);
                }
                else {
                  points.push([main1, cross1, x3, y3, main2, cross1, main2, y4, main1, y4]);
                }
              }
              // 上部独立
              else {
                if(isLast) {
                  points.push([main1, y3, x3, y3, x4, y4, main1, y4]);
                }
                else {
                  points.push([main1, y3, x3, y3, main2, cross1, main2, y4, main1, y4]);
                }
              }
            }
            // 完全独立
            else {
              if(isLast) {
                points.push([main1, y3, x3, y3, x4, y4, main1, y4]);
              }
              else {
                points.push([main1, y3, main2, y3, main2, y4, main1, y4]);
              }
            }
          }
        }
        else if(direction === 3) {
          // 整个和borderTop重叠
          if(main2 < y2) {
            if(isLast) {
              points.push([x1, y1, x2, y2, x2, y3, x1, y4]);
            }
            else {
              cross1 = x1 + (main1 - y1) * Math.tan(deg1);
              cross2 = x1 + (main2 - y1) * Math.tan(deg1);
              points.push([x1, main1, cross1, main1, cross2, main2, x1, main2]);
            }
          }
          // 整个和borderBottom重叠
          else if(main1 > y3) {
            cross1 = x1 + (y4 - main1) * Math.tan(deg2);
            cross2 = x1 + (y4 - main2) * Math.tan(deg2);
            if(isLast) {
              points.push([x1, main1, cross1, main1, x1, y4]);
            }
            else {
              points.push([x1, main1, cross1, main1, cross2, main2, x1, main2]);
            }
          }
          // 不被整个重叠的情况再细分
          else {
            // 上部分和borderTop重叠
            if(main1 < y2) {
              cross1 = x1 + (main1 - y1) * Math.tan(deg1);
              if(isLast) {
                points.push([x1, main1, cross1, main1, x2, y2, x2, y3, x1, y4]);
              }
              else {
                // 下部分和borderBottom重叠
                if(main2 > y3) {
                  points.push([x1, main1, cross1, main1, x2, y2, x2, y3, cross1, main2, x1, main2]);
                }
                // 下部独立
                else {
                  points.push([x1, main1, cross1, main1, x2, y2, x2, main2, x1, main2]);
                }
              }
            }
            // 下部分和borderBottom重叠
            else if(main2 > y3) {
              cross1 = x1 + (y4 - main2) * Math.tan(deg2);
              // 上部分和borderTop重叠
              if(main1 < y2) {
                if(isLast) {
                  points.push([x1, main1, cross1, main1, x2, y2, x2, y3, x1, y4]);
                }
                else {
                  points.push([x1, main1, cross1, main1, x2, y2, x2, y3, cross1, main2, x1, main2]);
                }
              }
              // 上部独立
              else {
                if(isLast) {
                  points.push([x1, main1, x2, main1, x2, y3, x1, y4]);
                }
                else {
                  points.push([x1, main1, x2, main1, x2, y3, cross1, main2, x1, main2]);
                }
              }
            }
            // 完全独立
            else {
              if(isLast) {
                points.push([x1, main1, x2, main1, x2, y3, x1, y4]);
              }
              else {
                points.push([x1, main1, x2, main1, x2, main2, x1, main2]);
              }
            }
          }
        }
      }
      return points;
    }
  }
  // 兜底返回实线
  if(direction === 0) {
    points.push([x1, y1, x4, y1, x3, y2, x2, y2]);
  }
  else if(direction === 1){
    points.push([x3, y2, x4, y1, x4, y4, x3, y3]);
  }
  else if(direction === 2){
    points.push([x1, y4, x2, y3, x3, y3, x4, y4]);
  }
  else if(direction === 3){
    points.push([x1, y1, x2, y2, x2, y3, x1, y4]);
  }
  return points;
}

export default {
  calDashed,
  calPoints,
};
