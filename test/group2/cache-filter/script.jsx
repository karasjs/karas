let o = karas.render(
  <canvas width="360" height="360">
    <div cacheAsBitmap={1} style={{margin:50,background:'#F00',filter:'blur(1)'}} ref="div">123</div>
  </canvas>,
  '#test'
);
