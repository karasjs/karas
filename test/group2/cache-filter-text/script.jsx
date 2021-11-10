let o = karas.render(
  <canvas width="360" height="360" cache={true}>
    <div cacheAsBitmap={1} style={{margin:10,width:50,height:50,background:'#F00',filter:'blur(1)'}} ref="div">
      <span ref="span" style={{padding:3,background:'#00F'}}>123</span>a</div>
  </canvas>,
  '#test'
);
