let o = karas.render(
  <canvas width="360" height="360">
    <div cacheAsBitmap={1} style={{position:'absolute',background:'#F00',padding:10}}>
      <div style={{display:'inlineBlock',margin:10,padding:10,background:'#0F0'}}>
        <span style={{display:'inlineBlock',padding:10,background:'#00F'}}>a</span>
        <div style={{display:'inlineBlock',margin:10,padding:10,background:'#F00'}}>
          <span style={{display:'inlineBlock',padding:10,background:'#00F'}}>b</span>
        </div>
      </div>
      <div style={{display:'inlineBlock',margin:10,padding:10,background:'#0F0'}}>
        <span style={{display:'inlineBlock',padding:10,background:'#00F'}}>a</span>
        <div style={{display:'inlineBlock',margin:10,padding:10,background:'#F00'}}>
          <span style={{display:'inlineBlock',padding:10,background:'#00F'}}>b</span>
        </div>
      </div>
    </div>
  </canvas>,
  '#test'
);
