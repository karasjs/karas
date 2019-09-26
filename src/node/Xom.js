import Node from './Node';
import mode from '../mode';
import unit from '../style/unit';
import util from '../util';

function arr2hash(arr) {
  let hash = {};
  for(let i = 0, len = arr.length; i < len; i++) {
    let item = arr[i];
    if(Array.isArray(item)) {
      hash[item[0]] = item[1];
    }
    else {
      for(let list = Object.keys(item), j = list.length - 1; j >= 0; j--) {
        let k = list[j];
        hash[k] = item[k];
      }
    }
  }
  return hash;
}

function hash2arr(hash) {
  let arr = [];
  for(let list = Object.keys(hash), i = 0, len = list.length; i < len; i++) {
    let k = list[i];
    arr.push([k, hash[k]]);
  }
  return arr;
}

function spread(arr) {
  for(let i = 0, len = arr.length; i < len; i++) {
    let item = arr[i];
    if(!Array.isArray(item)) {
      let temp = [];
      for(let list = Object.keys(item), j = 0, len = list.length; j < len; j++) {
        let k = list[j];
        temp.push([k, item[k]]);
      }
      arr.splice(i, 1, ...temp);
    }
  }
  return arr;
}

/* 获取合适的虚线实体空白宽度ps/pd和数量n
 * 总长total，start边长bs，end边长be，内容长w，
 * 实体长范围[smin,smax]，空白长范围[dmin,dmax]
 */
function getFitDashed(total, bs, be, w, smin, smax, dmin, dmax) {
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
function getDashed(style, m1, m2, m3, m4, bw) {
  let total = m4 - m1;
  let w = m3 - m2;
  let bs = m2 - m1;
  let be = m4 - m3;
  if(style === 'dotted') {
    return getFitDashed(total, bs, be, w, bw, bw, Math.max(1, bw * 0.25), bw * 2);
  }
  else {
    let { n, ps, pd } = getFitDashed(total, bs, be, w, bw, bw * 3, Math.max(1, bw * 0.25), bw * 2);
    if(n === 1) {
      return getFitDashed(total, bs, be, w, bw, bw, Math.max(1, bw * 0.25), bw * 2);
    }
    // 降级为dotted
    return { n, ps, pd };
  }
}

function renderBorder(renderMode, points, color, ctx, virtualDom) {
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
    virtualDom.bb.push(item);
  }
}

// 当linear-gradient的值超过[0,1]区间限制时，计算其对应区间1的值
function getLgStartLimit(c1, p1, c2, p2, length) {
  let [ r1, g1, b1, a1 = 1 ] = c1;
  let [ r2, g2, b2, a2 = 1 ] = c2;
  let l1 = Math.abs(p1) * length;
  let l2 = p2 * length;
  let p = l1 / (l2 + l1);
  let r = Math.floor(r1 + (r2 - r1) * p);
  let g = Math.floor(g1 + (g2 - g1) * p);
  let b = Math.floor(b1 + (b2 - b1) * p);
  let a = a1 + (a2 - a1) * p;
  return [r, g, b, a];
}

function getLgEndLimit(c1, p1, c2, p2, length) {
  let [ r1, g1, b1, a1 = 1 ] = c1;
  let [ r2, g2, b2, a2 = 1 ] = c2;
  let l1 = p1 * length;
  let l2 = p2 * length;
  let p = (length - l1) / (l2 - l1);
  let r = Math.floor(r1 + (r2 - r1) * p);
  let g = Math.floor(g1 + (g2 - g1) * p);
  let b = Math.floor(b1 + (b2 - b1) * p);
  let a = a1 + (a2 - a1) * p;
  return [r, g, b, a];
}

function getLgLimit(first, last, length) {
  let c1 = util.rgb2int(first[0]);
  let c2 = util.rgb2int(last[0]);
  let [ r1, g1, b1, a1 = 1 ] = c1;
  let [ r2, g2, b2, a2 = 1 ] = c2;
  let l1 = Math.abs(first[1]) * length;
  let l2 = last[1] * length;
  let p = l1 / (l1 + l2);
  let r = Math.floor(r1 + (r2 - r1) * p);
  let g = Math.floor(g1 + (g2 - g1) * p);
  let b = Math.floor(b1 + (b2 - b1) * p);
  let a = a1 + (a2 - a1) * p;
  first[0] = `rgba(${r},${g},${b},${a})`;
  first[1] = 0;
  p = (length + l1) / (l1 + l2);
  r = Math.floor(r1 + (r2 - r1) * p);
  g = Math.floor(g1 + (g2 - g1) * p);
  b = Math.floor(b1 + (b2 - b1) * p);
  a = a1 + (a2 - a1) * p;
  last[0] = `rgba(${r},${g},${b},${a})`;
  last[1] = 1;
}

class Xom extends Node {
  constructor(tagName, props) {
    super();
    props = props || [];
    // 构建工具中都是arr，手写可能出现hash情况
    if(Array.isArray(props)) {
      this.props = arr2hash(props);
      this.__props = spread(props);
    }
    else {
      this.props = props;
      this.__props = hash2arr(props);
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

  render(renderMode) {
    this.__virtualDom = {
      bb: [],
    };
    let { ctx, style, width, height, mlw, mtw, plw, ptw, prw, pbw, virtualDom } = this;
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
    // translate相对于自身
    if(transform) {
      let { translateX, translateY } = transform;
      if(translateX) {
        let diff = translateX.unit === unit.PX ? translateX.value : translateX.value * width * 0.01;
        this.__offsetX(diff);
      }
      if(translateY) {
        let diff = translateY.unit === unit.PX ? translateY.value : translateY.value * height * 0.01;
        this.__offsetY(diff);
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
    // 先渲染渐变，没有则背景色
    if(bgg) {
      let w = width + plw + prw;
      let h = height + ptw + pbw;
      let { k, v } = bgg;
      if(k === 'linear') {
        let deg = 180;
        if(v[0] === 'to top') {
          deg = 0;
        }
        else if(v[0] === 'to top right') {
          deg = 45;
        }
        else if(v[0] === 'to right') {
          deg = 90;
        }
        else if(v[0] === 'to bottom right') {
          deg = 135;
        }
        // else if(v[0] === 'to bottom') {
        // }
        else if(v[0] === 'to bottom left') {
          deg = 225;
        }
        else if(v[0] === 'to left') {
          deg = 270;
        }
        else if(v[0] === 'to top left') {
          deg = 315;
        }
        // 数字角度，没有的话取默认角度
        else {
          let match = /([\d.]+)deg/.exec(v[0]);
          if(match) {
            deg = parseFloat(match[1]);
          }
          else {
            v.unshift(deg);
          }
        }
        // 需计算角度 https://www.w3cplus.com/css3/do-you-really-understand-css-linear-gradients.html
        let r = util.r2d(deg);
        let length = Math.abs(w * Math.sin(r)) + Math.abs(h * Math.cos(r));
        let half = length * 0.5;
        if(deg >= 360) {
          deg = deg % 360;
        }
        while(deg < 0) {
          deg += 360;
        }
        let cx = x2 + w * 0.5;
        let cy = y2 + h * 0.5;
        let xx0 = x3;
        let yy0 = y3;
        let xx1 = x2;
        let yy1 = y2;
        if(deg >= 270) {
          let r = util.r2d(360 - deg);
          xx0 = cx + Math.sin(r) * half;
          yy0 = cy + Math.cos(r) * half;
          xx1 = cx - Math.sin(r) * half;
          yy1 = cy - Math.cos(r) * half;
        }
        else if(deg >= 180) {
          let r = util.r2d(deg - 180);
          xx0 = cx + Math.sin(r) * half;
          yy0 = cy - Math.cos(r) * half;
          xx1 = cx - Math.sin(r) * half;
          yy1 = cy + Math.cos(r) * half;
        }
        else if(deg >= 90) {
          let r = util.r2d(180 - deg);
          xx0 = cx - Math.sin(r) * half;
          yy0 = cy - Math.cos(r) * half;
          xx1 = cx + Math.sin(r) * half;
          yy1 = cy + Math.cos(r) * half;
        }
        else if(deg >= 0) {
          let r = util.r2d(deg);
          xx0 = cx - Math.sin(r) * half;
          yy0 = cy + Math.cos(r) * half;
          xx1 = cx + Math.sin(r) * half;
          yy1 = cy - Math.cos(r) * half;
        }
        // 计算colorStop
        let list = [];
        // 先把已经声明距离的换算成[0,1]以数组形式存入，未声明的原样存入
        for(let i = 1, len = v.length; i < len; i++) {
          let item = v[i];
          // 考虑是否声明了位置
          let arr = item.trim().split(/\s+/);
          if(arr.length > 1) {
            let c = arr[0];
            let p = arr[1];
            if(/%$/.test(p)) {
              list.push([c, parseFloat(p) * 0.01]);
            }
            else {
              list.push([c, parseFloat(p) / length]);
            }
          }
          else {
            list.push(arr[0]);
          }
        }
        // 首尾默认为[0, 1]
        if(list.length > 1) {
          if(!Array.isArray(list[0])) {
            list[0] = [list[0], 0];
          }
          if(!Array.isArray(list[list.length - 1])) {
            list[list.length - 1] = [list[list.length - 1], 1];
          }
        }
        else if(!Array.isArray(list[0])) {
          list[0] = [list[0], 0];
        }
        // 不是数组形式的是未声明的，需区间计算，找到连续的未声明的，前后的区间平分
        let start = list[0][1];
        for(let i = 0, len = list.length; i < len - 1; i++) {
          let item = list[i];
          if(Array.isArray(item)) {
            start = item[1];
          }
          else {
            let j = i + 1;
            let end = list[list.length - 1][1];
            for(; j < len; j++) {
              let item = list[j];
              if(Array.isArray(item)) {
                end = item[1];
                break;
              }
            }
            let num = j - i + 1;
            let per = (end - start) / num;
            for(let k = i; k < j; k++) {
              let item = list[k];
              list[k] = [item, start + per * (k + 1 - i)];
            }
            // 第一个要特殊处理下
            if(i === 0) {
              list[0][1] = 0;
            }
            i = k;
          }
        }
        // 每个不能小于前面的，canvas不能兼容这种情况，需处理
        for(let i = 1, len = list.length; i < len; i++) {
          let item = list[i];
          let prev = list[i - 1];
          if(item[1] < prev[1]) {
            item[1] = prev[1];
          }
        }
        // 0之前的和1之后的要过滤掉
        for(let i = 0, len = list.length; i < len - 1; i++) {
          let item = list[i];
          if(item[1] > 1) {
            list.splice(i + 1);
            break;
          }
        }
        for(let i = list.length - 1; i > 0; i--) {
          let item = list[i];
          if(item[1] < 0) {
            list.splice(0, i);
            break;
          }
        }
        // 可能存在超限情况，如在使用px单位超过len或<len时，canvas会报错超过[0,1]区间，需手动换算至区间内
        let len = list.length;
        // 在只有1个的情况下可简化
        if(len === 1) {
          list[0][1] = 0;
        }
        else {
          // 全部都在[0,1]之外也可以简化
          let allBefore = true;
          let allAfter = true;
          for(let i = len - 1; i >= 0; i--) {
            let item = list[i];
            let p = item[1];
            if(p > 0) {
              allBefore = false;
            }
            if(p < 1) {
              allAfter = false;
            }
          }
          if(allBefore) {
            list.splice(0, len - 1);
            list[0][1] = 0;
          }
          else if(allAfter) {
            list.splice(1);
            list[0][1] = 0;
          }
          // 部分在区间之外需复杂计算
          else {
            let first = list[0];
            let last = list[len - 1];
            // 只要2个的情况下就是首尾都落在外面
            if(len === 2) {
              if(first[1] < 0 && last[1] > 1) {
                getLgLimit(first, last, length);
              }
            }
            // 只有1个在外面的情况较为容易
            else {
              if(first[1] < 0) {
                let next = list[1];
                let c1 = util.rgb2int(first[0]);
                let c2 = util.rgb2int(next[0]);
                let c = getLgStartLimit(c1, first[1], c2, next[1], length);
                first[0] = `rgba(${c[0]},${c[1]},${c[2]},${c[3]})`;
                first[1] = 0;
              }
              if(last[1] > 1) {
                let prev = list[len - 2];
                let c1 = util.rgb2int(prev[0]);
                let c2 = util.rgb2int(last[0]);
                let c = getLgEndLimit(c1, prev[1], c2, last[1], length);
                last[0] = `rgba(${c[0]},${c[1]},${c[2]},${c[3]})`;
                last[1] = 1;
              }
            }
          }
        }
        // 防止精度计算溢出[0,1]
        list.forEach(item => {
          if(item[1] < 0) {
            item[1] = 0;
          }
          else if(item[1] > 1) {
            item[1] = 1;
          }
        });
        if(renderMode === mode.CANVAS) {
          let lg = ctx.createLinearGradient(xx0, yy0, xx1, yy1);
          list.forEach(item => {
            lg.addColorStop(item[1], item[0]);
          });
          ctx.beginPath();
          ctx.fillStyle = lg;
          ctx.rect(x2, y2, w, h);
          ctx.fill();
          ctx.closePath();
        }
        else {
          let uuid = this.defs.add({
            k: 'linearGradient',
            c: [xx0, yy0, xx1, yy1],
            v: list,
          });
          virtualDom.bb.push({
            type: 'item',
            tagName: 'rect',
            props: [
              ['x', x2],
              ['y', y2],
              ['width', w],
              ['height', h],
              ['fill', `url(#${uuid})`]
            ],
          });
        }
      }
      else if(k === 'radial-gradient') {}
    }
    else if(bgc && bgc !== 'transparent') {
      let w = width + plw + prw;
      let h = height + ptw + pbw;
      if(renderMode === mode.CANVAS) {
        ctx.beginPath();
        ctx.fillStyle = bgc;
        ctx.rect(x2, y2, w, h);
        ctx.fill();
        ctx.closePath();
      }
      else if(renderMode === mode.SVG) {
        virtualDom.bb.push({
          type: 'item',
          tagName: 'rect',
          props: [
            ['x', x2],
            ['y', y2],
            ['width', w],
            ['height', h],
            ['fill', bgc]
          ],
        });
      }
    }
    // 边框需考虑尖角，两条相交边平分45°夹角
    if(btw > 0 && btc !== 'transparent') {
      let points = [];
      if(['dashed', 'dotted'].indexOf(bts) > -1) {
        // 寻找一个合适的虚线线段长度和之间空白边距长度
        let { n, ps, pd } = getDashed(bts, x1, x2, x3, x4, btw);
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
      renderBorder(renderMode, points, btc, ctx, virtualDom);
    }
    if(brw > 0 && brc !== 'transparent') {
      let points = [];
      if(['dashed', 'dotted'].indexOf(brs) > -1) {
        // 寻找一个合适的虚线线段长度和之间空白边距长度
        let { n, ps, pd } = getDashed(brs, y1, y2, y3, y4, brw);
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
      renderBorder(renderMode, points, brc, ctx, virtualDom);
    }
    if(bbw > 0 && bbc !== 'transparent') {
      let points = [];
      // 寻找一个合适的虚线线段长度和之间空白边距长度
      if(['dashed', 'dotted'].indexOf(bbs) > -1) {
        // 寻找一个合适的虚线线段长度和之间空白边距长度
        let { n, ps, pd } = getDashed(bbs, x1, x2, x3, x4, bbw);
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
      renderBorder(renderMode, points, bbc, ctx, virtualDom);
    }
    if(blw > 0 && blc !== 'transparent') {
      let points = [];
      if(['dashed', 'dotted'].indexOf(bls) > -1) {
        // 寻找一个合适的虚线线段长度和之间空白边距长度
        let { n, ps, pd } = getDashed(bls, y1, y2, y3, y4, blw);
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
      renderBorder(renderMode, points, blc, ctx, virtualDom);
    }
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
}

export default Xom;
