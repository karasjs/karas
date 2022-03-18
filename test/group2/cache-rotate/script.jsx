let o = karas.render(
  <canvas width="360" height="360">
    <div cacheAsBitmap={1} style={{background:'#F00',padding:10}}>
      <span style={{display:'inlineBlock',rotate:45,padding:10,background:'#00F'}}>123</span>
    </div>
  </canvas>,
  '#test'
);
