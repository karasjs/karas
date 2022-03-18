let o = karas.render(
  <canvas width="360" height="360">
    <div cacheAsBitmap={1} style={{margin:50,background:'#F00',filter:'blur(1)'}} ref="div">a<span ref="span" style={{background:'#00F'}}>123</span>b</div>
  </canvas>,
  '#test'
);
