let o = karas.render(
  <canvas width="360" height="360">
    <div cacheAsBitmap={1} style={{position:'absolute',background:'#F00',padding:10}}>
      <span style={{display:'inlineBlock',padding:10,background:'#0F0',rotate:45}}>123</span>
      <span style={{display:'inlineBlock',padding:10,background:'#00F',rotate:45}}>456</span>
    </div>
  </canvas>,
  '#test'
);
