function canvasPolygon(ctx, list, dx = 0, dy = 0) {
  if(!list || !list.length) {
    return;
  }
  let start = 0;
  for(let i = 0, len = list.length; i < len; i++) {
    let item = list[i];
    if(Array.isArray(item)) {
      start = i;
      break;
    }
  }
  ctx.moveTo(list[start][0] + dx, list[start][1] + dy);
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
  let start = 0;
  for(let i = 0, len = list.length; i < len; i++) {
    let item = list[i];
    if(Array.isArray(item)) {
      start = i;
      break;
    }
  }
  let s = 'M' + list[start][0] + ',' + list[start][1];
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

const OFFSET = Math.PI * 0.5;

function canvasSector(ctx, cx, cy, r, x1, y1, x2, y2, strokeWidth, begin, end, large, edge, closure, dx = 0, dy = 0) {
  ctx.arc(cx + dx, cy + dy, r, begin * Math.PI / 180 - OFFSET, end * Math.PI / 180 - OFFSET);
  if(edge) {
    if(!large || !closure) {
      ctx.lineTo(cx + dx, cy + dy);
    }
    ctx.lineTo(x1 + dx, y1 + dy);
    if(strokeWidth > 0) {
      ctx.stroke();
    }
  }
  else {
    if(strokeWidth > 0) {
      ctx.stroke();
    }
    if(!large || !closure) {
      ctx.lineTo(cx + dx, cy + dy);
    }
    ctx.lineTo(x1 + dx, y1 + dy);
  }
}

function svgSector(cx, cy, r, x1, y1, x2, y2, strokeWidth, large, edge, closure) {
  let d = closure && large
    ? ('M' + x1 + ',' + y1 + 'A' + r + ',' + r + ' 0 ' + large + ' 1 ' + x2 + ',' + y2 + 'z')
    : ('M' + cx + ',' + cy + 'L' + x1 + ',' + y1 + 'A' + r + ',' + r + ' 0 ' + large + ' 1 ' + x2 + ',' + y2 + 'z');
  let d2;
  if(!edge || strokeWidth > 0) {
    d2 = 'M' + x1 + ',' + y1 + 'A' + r + ',' + r + ' 0 ' + large + ' 1 ' + x2 + ',' + y2;
  }
  return [d, d2];
}

export default {
  canvasPolygon,
  svgPolygon,
  canvasLine,
  svgLine,
  canvasSector,
  svgSector,
};
