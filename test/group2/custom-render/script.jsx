class $ extends karas.Geom {
  render(renderMode, ctx, dx, dy) {
    super.render(renderMode, ctx, dx, dy);
    ctx.beginPath();
    ctx.fillStyle = '#F00';
    ctx.moveTo(0, 0);
    ctx.lineTo(100, 0);
    ctx.lineTo(100, 100);
    ctx.lineTo(0, 0);
    ctx.fill();
    ctx.closePath();
  }
}

let o = karas.render(
  <canvas width="360" height="360">
    <$/>
  </canvas>,
  '#test'
);
