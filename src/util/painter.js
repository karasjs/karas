import util from './util';

const { int2rgba } = util;

function canvasPolygon(ctx, list, dx = 0, dy = 0) {
  if(!list || !list.length) {
    return;
  }
  let start = -1;
  for(let i = 0, len = list.length; i < len; i++) {
    let item = list[i];
    if(Array.isArray(item) && item.length) {
      start = i;
      break;
    }
  }
  if(start === -1) {
    return;
  }
  let first = list[start];
  ctx.moveTo(first[0] + dx, first[1] + dy);
  // 特殊的情况，布尔运算数学库会打乱原有顺序，致使第一个点可能有冗余的贝塞尔值，move到正确的索引坐标
  if(first.length === 4) {
    ctx.moveTo(first[2] + dx, first[3] + dy);
  }
  else if(first.length === 6) {
    ctx.moveTo(first[4] + dx, first[5] + dy);
  }
  for(let i = start + 1, len = list.length; i < len; i++) {
    let item = list[i];
    if(!Array.isArray(item)) {
      continue;
    }
    if(item.length === 2) {
      ctx.lineTo(item[0] + dx, item[1] + dy);
    }
    else if(item.length === 4) {
      ctx.quadraticCurveTo(item[0] + dx, item[1] + dy, item[2] + dx, item[3] + dy);
    }
    else if(item.length === 6) {
      ctx.bezierCurveTo(item[0] + dx, item[1] + dy, item[2] + dx, item[3] + dy, item[4] + dx, item[5] + dy);
    }
  }
}

function svgPolygon(list) {
  if(!list || !list.length) {
    return '';
  }
  let start = -1;
  for(let i = 0, len = list.length; i < len; i++) {
    let item = list[i];
    if(Array.isArray(item) && item.length) {
      start = i;
      break;
    }
  }
  if(start === -1) {
    return '';
  }
  let first = list[start];
  let s = 'M' + first[0] + ',' + first[1];
  if(first.length === 4) {
    s = 'M' + first[2] + ',' + first[3];
  }
  else if(first.length === 6) {
    s = 'M' + first[4] + ',' + first[5];
  }
  for(let i = start + 1, len = list.length; i < len; i++) {
    let item = list[i];
    if(!Array.isArray(item)) {
      continue;
    }
    if(item.length === 2) {
      s += 'L' + item[0] + ',' + item[1];
    }
    else if(item.length === 4) {
      s += 'Q' + item[0] + ',' + item[1] + ' ' + item[2] + ',' + item[3];
    }
    else if(item.length === 6) {
      s += 'C' + item[0] + ',' + item[1] + ' ' + item[2] + ',' + item[3] + ' ' + item[4] + ',' + item[5];
    }
  }
  return s;
}

function canvasLine(ctx, x1, y1, x2, y2, controlA, controlB, num, dx = 0, dy = 0) {
  ctx.moveTo(x1 + dx, y1 + dy);
  if(num === 3) {
    ctx.bezierCurveTo(controlA[0] + dx, controlA[1] + dy, controlB[0] + dx, controlB[1], x2 + dx, y2 + dy);
    return 2;
  }
  else if(num === 2) {
    ctx.quadraticCurveTo(controlB[0] + dx, controlB[1] + dy, x2 + dx, y2 + dy);
    return 2;
  }
  else if(num === 1) {
    ctx.quadraticCurveTo(controlA[0] + dx, controlA[1] + dy, x2 + dx, y2 + dy);
    return 2;
  }
  else {
    ctx.lineTo(x2 + dx, y2 + dy);
    return 1;
  }
}

function svgLine(x1, y1, x2, y2, controlA, controlB, num) {
  if(num === 3) {
    return 'M' + x1 + ',' + y1
      + 'C' + controlA[0] + ',' + controlA[1] + ' ' + controlB[0] + ',' + controlB[1]
      + ' ' + x2 + ',' + y2;
  }
  else if(num === 2) {
    return 'M' + x1 + ',' + y1
      + 'Q' + controlB[0] + ',' + controlB[1]
      + ' ' + x2 + ',' + y2;
  }
  else if(num === 1) {
    return 'M' + x1 + ',' + y1
      + 'Q' + controlA[0] + ',' + controlA[1]
      + ' ' + x2 + ',' + y2;
  }
  else {
    return 'M' + x1 + ',' + y1 + 'L' + x2 + ',' + y2;
  }
}

function canvasFilter(filter) {
  let s = '';
  filter.forEach(item => {
    let { k, v } = item;
    if(k === 'blur') {
      s += `blur(${v}px)`;
    }
    else if(k === 'dropShadow') {
      // 浏览器暂未支持spread，去掉v[3]
      s += `drop-shadow(${v[0]}px ${v[1]}px ${v[2]}px ${int2rgba(v[4])})`;
    }
    else if(k === 'hueRotate') {
      s += `hue-rotate(${v}deg)`;
    }
    else if(k === 'saturate' || k === 'brightness' || k === 'grayscale' || k === 'contrast' || k === 'sepia' || k === 'invert') {
      s += `${k}(${v}%)`;
    }
  });
  return s;
}

export default {
  canvasPolygon,
  svgPolygon,
  canvasLine,
  svgLine,
  canvasFilter,
  svgFilter: canvasFilter,
};
