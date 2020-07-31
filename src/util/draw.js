function genCanvasPolygon(ctx, list) {
  ctx.beginPath();
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
  ctx.fill();
  ctx.closePath();
}

function genSvgPolygon(list) {
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
  // s += `L${list[0][0]},${list[0][1]}`;
  return s;
}

export default {
  genCanvasPolygon,
  genSvgPolygon,
};
