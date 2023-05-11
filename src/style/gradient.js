import unit from './unit';
import reg from './reg';
import geom from '../math/geom';
import vector from '../math/vector';
import mx from '../math/matrix';
import gradient from '../math/gradient';
import border from './border';
import mode from '../refresh/mode';
import util from '../util/util';
import painter from '../util/painter';
import enums from '../util/enums';
import inject from '../util/inject';

const { rgba2int, isNil } = util;
const { PX, PERCENT, DEG, NUMBER, REM, VW, VH, VMAX, VMIN, calUnit } = unit;
const { d2r } = geom;
const { canvasPolygon } = painter;
const {
  STYLE_KEY: {
    FONT_SIZE,
  },
} = enums;

function getLinearDeg(v) {
  let deg = 180;
  if(v === 'to top') {
    deg = 0;
  }
  else if(v === 'to top right') {
    deg = 45;
  }
  else if(v === 'to right') {
    deg = 90;
  }
  else if(v === 'to bottom right') {
    deg = 135;
  }
  else if(v === 'to bottom') {
  }
  else if(v === 'to bottom left') {
    deg = 225;
  }
  else if(v === 'to left') {
    deg = 270;
  }
  else if(v === 'to top left') {
    deg = 315;
  }
  // 数字角度，没有的话取默认角度
  else {
    let match = /([-+]?[\d.]+)deg/.exec(v);
    if(match) {
      deg = parseFloat(match[1]);
    }
  }
  return deg % 360;
}

function getRadialPosition(data) {
  if(/^[-+]?[\d.]/.test(data)) {
    let v = calUnit(data);
    if([NUMBER, DEG].indexOf(v.u) > -1) {
      v.u = PX;
    }
    return v;
  }
  else {
    return {
      v: {
        top: 0,
        left: 0,
        center: 50,
        right: 100,
        bottom: 100,
      }[data] || 50,
      u: PERCENT,
    };
  }
}

// 获取color-stop区间范围，去除无用值
function getColorStop(v, length, root) {
  let list = [];
  let firstColor = v[0][0];
  // 先把已经声明距离的换算成[0,1]以数组形式存入，未声明的原样存入
  for(let i = 0, len = v.length; i < len; i++) {
    let item = v[i];
    // 考虑是否声明了位置
    if(item.length > 1) {
      let p = item[1];
      if(p.u === PERCENT) {
        list.push([item[0], p.v * 0.01]);
      }
      else if(p.u === REM) {
        list.push([item[0], p.v * root.computedStyle[FONT_SIZE] / length]);
      }
      else if(p.u === VW) {
        list.push([item[0], p.v * root.width / length]);
      }
      else if(p.u === VH) {
        list.push([item[0], p.v * root.height / length]);
      }
      else if(p.u === VMAX) {
        list.push([item[0], p.v * Math.max(root.width, root.height) / length]);
      }
      else if(p.u === VMIN) {
        list.push([item[0], p.v * Math.min(root.width, root.height) / length]);
      }
      else {
        list.push([item[0], p.v / length]);
      }
    }
    else {
      list.push([item[0]]);
    }
  }
  if(list.length === 1) {
    list.push(util.clone(list[0]));
  }
  // 首尾不声明默认为[0, 1]
  if(list[0].length === 1) {
    list[0].push(0);
  }
  if(list.length > 1) {
    let i = list.length - 1;
    if(list[i].length === 1) {
      list[i].push(1);
    }
  }
  // 找到未声明位置的，需区间计算，找到连续的未声明的，前后的区间平分
  let start = list[0][1];
  for(let i = 1, len = list.length; i < len - 1; i++) {
    let item = list[i];
    if(item.length > 1) {
      start = item[1];
    }
    else {
      let j = i + 1;
      let end = list[list.length - 1][1];
      for(; j < len - 1; j++) {
        let item = list[j];
        if(item.length > 1) {
          end = item[1];
          break;
        }
      }
      let num = j - i + 1;
      let per = (end - start) / num;
      for(let k = i; k < j; k++) {
        let item = list[k];
        item.push(start + per * (k + 1 - i));
      }
      i = j;
    }
  }
  // 每个不能小于前面的，按大小排序，canvas/svg兼容这种情况，无需处理
  // 0之前的和1之后的要过滤掉
  for(let i = 0, len = list.length; i < len; i++) {
    let item = list[i];
    if(item[1] > 1) {
      list.splice(i);
      let prev = list[i - 1];
      if(prev && prev[1] < 1) {
        let dr = item[0][0] - prev[0][0];
        let dg = item[0][1] - prev[0][1];
        let db = item[0][2] - prev[0][2];
        let da = item[0][3] - prev[0][3];
        let p = (1 - prev[1]) / (item[1] - prev[1]);
        list.push([
          [
            item[0][0] + dr * p,
            item[0][1] + dg * p,
            item[0][2] + db * p,
            item[0][3] + da * p,
          ],
          1],
        );
      }
      break;
    }
  }
  for(let i = list.length - 1; i >= 0; i--) {
    let item = list[i];
    if(item[1] < 0) {
      list.splice(0, i + 1);
      let next = list[i];
      if(next && next[1] > 0) {
        let dr = next[0][0] - item[0][0];
        let dg = next[0][1] - item[0][1];
        let db = next[0][2] - item[0][2];
        let da = next[0][3] - item[0][3];
        let p = (-item[1]) / (next[1] - item[1]);
        list.unshift([
          [
            item[0][0] + dr * p,
            item[0][1] + dg * p,
            item[0][2] + db * p,
            item[0][3] + da * p,
          ],
          0],
        );
      }
      break;
    }
  }
  // 可能存在超限情况，如在使用px单位超过len或<len时，canvas会报错超过[0,1]区间，需手动换算至区间内
  list.forEach(item => {
    // item[0] = int2rgba(item[0]);
    if(item[1] < 0) {
      item[1] = 0;
    }
    else if(item[1] > 1) {
      item[1] = 1;
    }
  });
  // 都超限时，第一个颜色兜底
  if(!list.length) {
    list.push([firstColor, 0]);
  }
  return list;
}

// 根据角度和圆心获取渐变的4个点坐标
function calLinearCoords(deg, length, cx, cy) {
  let x0;
  let y0;
  let x1;
  let y1;
  if(deg >= 270) {
    let r = d2r(360 - deg);
    x0 = cx + Math.sin(r) * length;
    y0 = cy + Math.cos(r) * length;
    x1 = cx - Math.sin(r) * length;
    y1 = cy - Math.cos(r) * length;
  }
  else if(deg >= 180) {
    let r = d2r(deg - 180);
    x0 = cx + Math.sin(r) * length;
    y0 = cy - Math.cos(r) * length;
    x1 = cx - Math.sin(r) * length;
    y1 = cy + Math.cos(r) * length;
  }
  else if(deg >= 90) {
    let r = d2r(180 - deg);
    x0 = cx - Math.sin(r) * length;
    y0 = cy - Math.cos(r) * length;
    x1 = cx + Math.sin(r) * length;
    y1 = cy + Math.cos(r) * length;
  }
  else {
    let r = d2r(deg);
    x0 = cx - Math.sin(r) * length;
    y0 = cy + Math.cos(r) * length;
    x1 = cx + Math.sin(r) * length;
    y1 = cy - Math.cos(r) * length;
  }
  return [x0, y0, x1, y1];
}

function calCircleCentre(position, x1, y1, iw, ih, root) {
  let cx, cy;
  let positionX = position[0], positionY = position[1];
  if(positionX.u === PERCENT) {
    cx = x1 + positionX.v * iw * 0.01;
  }
  else if(positionX.u === REM) {
    cx = x1 + positionX.v * root.computedStyle[FONT_SIZE];
  }
  else if(positionX.u === VW) {
    cx = x1 + positionX.v * root.width * 0.01;
  }
  else if(positionX.u === VH) {
    cx = x1 + positionX.v * root.height * 0.01;
  }
  else if(positionX.u === VMAX) {
    cx = x1 + positionX.v * Math.max(root.width, root.height) * 0.01;
  }
  else if(positionX.u === VMIN) {
    cx = x1 + positionX.v * Math.min(root.width, root.height) * 0.01;
  }
  else {
    cx = x1 + positionX.v;
  }
  if(positionY.u === PERCENT) {
    cy = y1 + positionY.v * ih * 0.01;
  }
  else if(positionY.u === REM) {
    cy = y1 + positionY.v * root.computedStyle[FONT_SIZE];
  }
  else if(positionY.u === VW) {
    cy = y1 + positionY.v * root.width * 0.01;
  }
  else if(positionY.u === VH) {
    cy = y1 + positionY.v * root.height * 0.01;
  }
  else if(positionY.u === VH) {
    cy = y1 + positionY.v * Math.max(root.width, root.height) * 0.01;
  }
  else if(positionY.u === VH) {
    cy = y1 + positionY.v * Math.min(root.width, root.height) * 0.01;
  }
  else {
    cy = y1 + positionY.v;
  }
  return [cx, cy];
}

// 获取径向渐变圆心半径
function calRadialRadius(shape, size, position, iw, ih, x1, y1, x2, y2, root) {
  let cx, cy, xl, yl, r, tx, ty, d = 0;
  // 扩展的from to ratio格式，圆心、长轴坐标、短轴缩放比
  if(Array.isArray(size)) {
    cx = x1 + size[0] * iw;
    cy = y1 + size[1] * ih;
    tx = x1 + size[4] * iw;
    ty = y1 + size[5] * ih;
    if(size[6] <= 0) {
      r = Math.min(Math.abs(cx - x1), Math.min(Math.abs(cy - y1), Math.min(Math.abs(cy - y2), Math.min(Math.abs(cx - y2)))));
    }
    else {
      xl = Math.sqrt(Math.pow((size[2] - size[0]) * iw, 2) + Math.pow((size[3] - size[1]) * ih, 2));
      yl = xl * size[6];
      r = Math.max(xl, yl);
      // 看旋转
      if(xl !== yl) {
        if(size[2] >= size[0]) {
          if(size[3] >= size[1]) {
            d = Math.asin((size[3] - size[1]) * ih / xl);
          }
          else {
            d = -Math.asin((size[1] - size[3]) * ih / xl);
          }
        }
        else {
          if(size[3] >= size[1]) {
            d = d2r(180) - Math.asin((size[3] - size[1]) * ih / xl);
          }
          else {
            d = Math.asin((size[1] - size[3]) * ih / xl) - d2r(180);
          }
        }
      }
    }
  }
  else {
    // 默认椭圆a是水平轴，b是垂直轴
    [cx, cy] = calCircleCentre(position, x1, y1, iw, ih, root);
    tx = cx;
    ty = cy;
    let ratio = 1;
    if(size === 'closest-corner' && shape === 'circle') {
      if(cx <= x1 || cx >= x2 || cy <= y1 || cy >= y2) {
        r = Math.min(Math.abs(cx - x1), Math.min(Math.abs(cy - y1), Math.min(Math.abs(cy - y2), Math.min(Math.abs(cx - y2)))));
      }
      else {
        if(cx < x1 + iw * 0.5) {
          xl = cx - x1;
        }
        else {
          xl = x2 - cx;
        }
        if(cy < y1 + ih * 0.5) {
          yl = cy - y1;
        }
        else {
          yl = y2 - cy;
        }
        r = Math.sqrt(Math.pow(xl, 2) + Math.pow(yl, 2));
      }
    }
    else if(size === 'closest-side' || size === 'closest-corner') {
      // 在边外特殊情况只有end颜色填充
      if(cx <= x1 || cx >= x2 || cy <= y1 || cy >= y2) {
        r = Math.min(Math.abs(cx - x1), Math.min(Math.abs(cy - y1), Math.min(Math.abs(cy - y2), Math.min(Math.abs(cx - y2)))));
      }
      else {
        let ratio = 1;
        if(cx < x1 + iw * 0.5) {
          xl = cx - x1;
        }
        else {
          xl = x2 - cx;
        }
        if(cy < y1 + ih * 0.5) {
          yl = cy - y1;
        }
        else {
          yl = y2 - cy;
        }
        r = Math.min(xl, yl);
        // css的角和边有对应关系，即边扩展倍数，计算为固定值
        if(size === 'closest-corner') {
          ratio = Math.sqrt(2);
        }
        xl *= ratio;
        yl *= ratio;
        r *= ratio;
      }
    }
    else {
      if(cx <= x1) {
        xl = x1 - cx + iw;
      }
      else if(cx >= x2) {
        xl = cx - x2 + iw;
      }
      else if(cx < x1 + iw * 0.5) {
        xl = x2 - cx;
      }
      else {
        xl = cx - x1;
      }
      if(cy <= y1) {
        yl = y1 - cy + ih;
      }
      else if(cy >= y2) {
        yl = cy - y2 + ih;
      }
      else if(cy < y1 + ih * 0.5) {
        yl = y2 - cy;
      }
      else {
        yl = cy - y1;
      }
      r = Math.max(xl, yl);
      if(size !== 'farthest-side') {
        ratio = Math.sqrt(2);
      }
      xl *= ratio;
      yl *= ratio;
      r *= ratio;
    }
  }
  if(shape === 'circle') {
    xl = yl = r;
  }
  return [cx, cy, r, xl, yl, tx, ty, d];
}

function parseGradient(s) {
  let gradient = reg.gradient.exec(s);
  if(gradient) {
    let o = {
      k: gradient[1],
    };
    if(o.k === 'linear') {
      let deg = /([-+]?(?:(?:\d+(?:\.\d*)?)|(?:\.\d+))(?:e[-+]?\d+)?deg)|(to\s+[toprighbml]+)/i.exec(gradient[2]);
      if(deg) {
        o.d = getLinearDeg(deg[0].toLowerCase());
      }
      // 扩展支持从a点到b点相对坐标，而不是css角度，sketch等ui软件中用此格式
      else {
        let points = /([-+]?(?:(?:\d+(?:\.\d*)?)|(?:\.\d+))(?:e[-+]?\d+)?)\s+([-+]?(?:(?:\d+(?:\.\d*)?)|(?:\.\d+))(?:e[-+]?\d+)?)\s+([-+]?(?:(?:\d+(?:\.\d*)?)|(?:\.\d+))(?:e[-+]?\d+)?)\s+([-+]?(?:(?:\d+(?:\.\d*)?)|(?:\.\d+))(?:e[-+]?\d+)?)/.exec(gradient[2]);
        if(points) {
          o.d = [parseFloat(points[1]), parseFloat(points[2]), parseFloat(points[3]), parseFloat(points[4])];
        }
        else {
          o.d = 180;
        }
      }
    }
    else if(o.k === 'radial') {
      o.s = gradient[2].indexOf('circle') > -1 ? 'circle' : 'ellipse';
      let size = /(closest|farthest)-(side|corner)/i.exec(gradient[2]);
      if(size) {
        o.z = size[0].toLowerCase();
      }
      // 扩展支持从a点到b点相对坐标，而不是size，sketch等ui软件中用此格式
      else {
        let points = /([-+]?[\d.]+)\s+([-+]?[\d.]+)\s+([-+]?[\d.]+)\s+([-+]?[\d.]+)(?:\s+([-+]?[\d.]+))?(?:\s+([-+]?[\d.]+))?(?:\s+([-+]?[\d.]+))?/.exec(gradient[2]);
        if(points) {
          o.z = [parseFloat(points[1]), parseFloat(points[2]), parseFloat(points[3]), parseFloat(points[4])];
          let i5 = !isNil(points[5]), i6 = !isNil(points[6]), i7 = !isNil(points[7]);
          // 重载，567是偏移x/y和ratio，都可省略即不偏移和半径1，只有5是ratio，只有56是x/y
          if(i5 && i6 && i7) {
            o.z.push(parseFloat(points[5]));
            o.z.push(parseFloat(points[6]));
            o.z.push(parseFloat(points[7]));
          }
          else if(i5 && i6) {
            o.z.push(parseFloat(points[5]));
            o.z.push(parseFloat(points[6]));
            o.z.push(1);
          }
          else if(i5) {
            o.z.push(o.z[0]);
            o.z.push(o.z[1]);
            o.z.push(parseFloat(points[5]));
          }
          else {
            o.z.push(o.z[0]);
            o.z.push(o.z[1])
            o.z.push(1);
          }
        }
        else {
          o.z = 'farthest-corner';
        }
      }
      let position = /at\s+((?:[-+]?[\d.]+[pxremvwhina%]*)|(?:left|top|right|bottom|center))(?:\s+((?:[-+]?[\d.]+[pxremvwhina%]*)|(?:left|top|right|bottom|center)))?/i.exec(gradient[2]);
      if(position) {
        let x = getRadialPosition(position[1]);
        let y = position[2] ? getRadialPosition(position[2]) : x;
        o.p = [x, y];
      }
      else {
        o.p = [{ v: 50, u: PERCENT }, { v: 50, u: PERCENT }];
      }
    }
    else if(o.k === 'conic') {
      let deg = /([-+]?[\d.]+deg)/i.exec(gradient[2]);
      if(deg) {
        o.d = parseFloat(deg[0]) % 360;
      }
      else {
        o.d = 0;
      }
      let position = /at\s+((?:[-+]?[\d.]+[pxremvwhina%]*)|(?:left|top|right|bottom|center))(?:\s+((?:[-+]?[\d.]+[pxremvwhina%]*)|(?:left|top|right|bottom|center)))?/i.exec(gradient[2]);
      if(position) {
        let x = getRadialPosition(position[1]);
        let y = position[2] ? getRadialPosition(position[2]) : x;
        o.p = [x, y];
      }
      else {
        o.p = [{ v: 50, u: PERCENT }, { v: 50, u: PERCENT }];
      }
    }
    let v = gradient[2].match(/(([-+]?(?:(?:\d+(?:\.\d*)?)|(?:\.\d+))(?:e[-+]?\d+)?[pxremvwhina%]+)?\s*((#[0-9a-f]{3,8})|(rgba?\s*\(.+?\)))\s*([-+]?(?:(?:\d+(?:\.\d*)?)|(?:\.\d+))(?:e[-+]?\d+)?[pxremvwhina%]+)?)|(transparent)/ig) || [];
    o.v = v.map(item => {
      let color = /(?:#[0-9a-f]{3,8})|(?:rgba?\s*\(.+?\))|(?:transparent)/i.exec(item);
      let arr = [rgba2int(color[0])];
      let percent = /[-+]?(?:(?:\d+(?:\.\d*)?)|(?:\.\d+))(?:e[-+]?\d+)?[pxremvwhina%]+/.exec(item);
      if(percent) {
        let v = calUnit(percent[0]);
        if([NUMBER, DEG].indexOf(v.u) > -1) {
          v.u = PX;
        }
        arr[1] = v;
      }
      return arr;
    });
    return o;
  }
}

function getLinear(v, d, ox, oy, cx, cy, w, h, root, dx = 0, dy = 0) {
  ox += dx;
  oy += dy;
  cx += dx;
  cy += dy;
  // d为数组是2个坐标点，数字是css标准角度
  let x1, y1, x2, y2, stop;
  if(Array.isArray(d)) {
    x1 = ox + d[0] * w;
    y1 = oy + d[1] * h;
    x2 = ox + d[2] * w;
    y2 = oy + d[3] * h;
    let total = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    stop = getColorStop(v, total);
  }
  else {
    while(d >= 360) {
      d -= 360;
    }
    while(d < 0) {
      d += 360;
    }
    // 根据角度求直线上2点，设置半径为长宽最大值，这样一定在矩形外，看做一个向量A
    let len = Math.max(w, h);
    let coords = calLinearCoords(d, len, cx, cy);
    len *= 2;
    // start和4个顶点的向量在A上的投影长度
    let l1 = vector.dotProduct(ox - coords[0], oy - coords[1], coords[2] - coords[0], coords[3] - coords[1]) / len;
    let l2 = vector.dotProduct(ox + w - coords[0], oy - coords[1], coords[2] - coords[0], coords[3] - coords[1]) / len;
    let l3 = vector.dotProduct(ox + w - coords[0], oy + h - coords[1], coords[2] - coords[0], coords[3] - coords[1]) / len;
    let l4 = vector.dotProduct(ox - coords[0], oy + h - coords[1], coords[2] - coords[0], coords[3] - coords[1]) / len;
    // 最小和最大值为0~100%
    let min = l1, max = l1;
    min = Math.min(min, Math.min(l2, Math.min(l3, l4)));
    max = Math.max(max, Math.max(l2, Math.max(l3, l4)));
    // 求得0和100%的长度和坐标
    let total = max - min;
    let r1 = min / len;
    let dx = coords[2] - coords[0];
    let dy = coords[3] - coords[1];
    x1 = coords[0] + dx * r1;
    y1 = coords[1] + dy * r1;
    x2 = coords[2] - dx * r1;
    y2 = coords[3] - dy * r1;
    stop = getColorStop(v, total, root);
  }
  return {
    x1,
    y1,
    x2,
    y2,
    stop,
  };
}

function getRadial(v, shape, size, position, x1, y1, x2, y2, root, dx = 0, dy = 0) {
  let w = x2 - x1;
  let h = y2 - y1;
  x1 += dx;
  y1 += dy;
  x2 += dx;
  y2 += dy;
  let [cx, cy, r, xl, yl, tx, ty, d] = calRadialRadius(shape, size, position, w, h, x1, y1, x2, y2, root);
  // 圆形取最小值，椭圆根据最小圆进行transform，椭圆其中一边轴和r一样，另一边则大小缩放可能
  let matrix, scx = 1, scy = 1;
  if(xl !== yl || d) {
    matrix = [1, 0, 0, 1, 0, 0];
    if(d) {
      let sin = Math.sin(d);
      let cos = Math.cos(d);
      matrix = [cos, sin, 0, 0, -sin, cos, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    }
    if(xl !== r) {
      scx = xl / r;
      let m = [scx, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
      matrix = mx.multiply(matrix, m);
    }
    if(yl !== r) {
      scy = yl / r;
      let m = [1, 0, 0, 0, 0, scy, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
      matrix = mx.multiply(matrix, m);
    }
  }
  let stop = getColorStop(v, r, root);
  return {
    cx,
    cy,
    tx,
    ty,
    r,
    stop,
    scx,
    scy,
    matrix,
    d,
  };
}

function getConic(v, d, p, x1, y1, x2, y2, ratio, root) {
  let [cx, cy, r, deg] = calConicRadius(v, d, p, x1, y1, x2, y2, root);
  let stop = getColorStop(v, 1, root);
  r <<= 1; // 锥形半径*2，这样分割画圆时保证一定会填满原有矩形
  r *= ratio; // 矢量图形比较特殊，有可能超限，传入个倍数扩大半径
  return {
    cx,
    cy,
    w: x2 - x1,
    h: y2 - y1,
    r,
    deg,
    stop,
  };
}

function calConicRadius(v, deg, position, x1, y1, x2, y2, root) {
  let iw = x2 - x1;
  let ih = y2 - y1;
  let [cx, cy] = calCircleCentre(position, x1, y1, iw, ih, root);
  let r, a, b;
  if(cx >= x1 + iw * 0.5) {
    a = cx - x1;
  }
  else {
    a = x2 - cx;
  }
  if(cy >= y1 + ih * 0.5) {
    b = cy - y1;
  }
  else {
    b = y2 - cy;
  }
  r = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
  return [cx, cy, r, deg];
}

function renderConic(xom, renderMode, ctx, res, x, y, w, h, btlr, btrr, bbrr, bblr, isInline) {
  // border-radius使用三次贝塞尔曲线模拟1/4圆角，误差在[0, 0.000273]之间
  let list = border.calRadius(x, y, w, h, btlr, btrr, bbrr, bblr);
  if(!list) {
    list = [
      [x, y],
      [x + w, y],
      [x + w, y + h],
      [x, y + h],
      [x, y],
    ];
  }
  if(renderMode === mode.CANVAS) {
    let offscreen = inject.getOffscreenCanvas(w, h, '__$$CONIC_GRADIENT$$__', null);
    let imgData = offscreen.ctx.getImageData(0,0, w, h);
    gradient.getConicGradientImage(res.cx - x, res.cy - y, res.w, res.h, res.stop, imgData.data);
    offscreen.ctx.putImageData(imgData, 0, 0);
    ctx.save();
    ctx.beginPath();
    canvasPolygon(ctx, list, 0, 0, true);
    ctx.clip();
    ctx.drawImage(offscreen.canvas, x, y);
    ctx.restore();
    offscreen.ctx.clearRect(0, 0, w, h);
  }
}

export default {
  parseGradient,
  getLinear,
  getRadial,
  getConic,
  renderConic,
};
