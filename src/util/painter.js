function canvasPolygon(ctx, list) {
  ctx.moveTo(list[0][0], list[0][1]);
  for(let i = 1, len = list.length; i < len; i++) {
    let item = list[i];
    if(item.length === 2) {
      ctx.lineTo(item[0], item[1]);
    }
    else if(item.length === 4) {
      ctx.quadraticCurveTo(item[0], item[1], item[2], item[3]);
    }
    else if(item.length === 6) {
      ctx.bezierCurveTo(item[0], item[1], item[2], item[3], item[4], item[5]);
    }
  }
}

function svgPolygon(list) {
  let s = 'M' + list[0][0] + ',' + list[0][1];
  for(let i = 1, len = list.length; i < len; i++) {
    let item = list[i];
    if(item.length === 2) {
      s += 'L' + item[0] + ',' + item[1];
    }
    else if(item.length === 4) {
      s += 'Q' + item[0] + ',' + item[1] + ',' + item[2] + ',' + item[3];
    }
    else if(item.length === 6) {
      s += 'C' + item[0] + ',' + item[1] + ',' + item[2] + ',' + item[3] + ',' + item[4] + ',' + item[5];
    }
  }
  return s;
}

function canvasLine(ctx, x1, y1, x2, y2, controlA, controlB, num) {
  ctx.moveTo(x1, y1);
  if(num === 3) {
    ctx.bezierCurveTo(controlA[0], controlA[1], controlB[0], controlB[1], x2, y2);
  }
  else if(num === 2) {
    ctx.quadraticCurveTo(controlB[0], controlB[1], x2, y2);
  }
  else if(num === 1) {
    ctx.quadraticCurveTo(controlA[0], controlA[1], x2, y2);
  }
  else {
    ctx.lineTo(x2, y2);
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

function canvasSector(ctx, cx, cy, r, x1, y1, x2, y2, strokeWidth, begin, end, large, edge, closure) {
  ctx.arc(cx, cy, r, begin * Math.PI / 180 - OFFSET, end * Math.PI / 180 - OFFSET);
  if(edge) {
    if(!large || !closure) {
      ctx.lineTo(cx, cy);
    }
    ctx.lineTo(x1, y1);
    if(strokeWidth > 0) {
      ctx.stroke();
    }
  }
  else {
    if(strokeWidth > 0) {
      ctx.stroke();
    }
    if(!large || !closure) {
      ctx.lineTo(cx, cy);
    }
    ctx.lineTo(x1, y1);
  }
}

function svgSector(cx, cy, r, x1, y1, x2, y2, strokeWidth, large, edge, closure) {
  let d = closure
    ? ('M' + x1 + ',' + y1 + 'A' + r + ',' + r + ' 0 ' + large + ' 1 ' + x2 + ',' + y2 + 'z')
    : ('M' + cx + ',' + cy + 'L' + x1 + ',' + y1 + 'A' + r + ' ' + r + ' 0 ' + large + ' 1 ' + x2 + ',' + y2 + ' z');
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
