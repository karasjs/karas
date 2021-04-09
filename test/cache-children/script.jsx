let o = karas.render(
  <canvas width="360" height="360" cache={true}>
    <div style={{margin:10,border:'2px solid #000',background:'#F00',padding:10}}>
      <span style={{display:'inlineBlock',padding:10,background:'#0F0'}}>123</span>
      <span style={{display:'inlineBlock',padding:10,background:'#00F'}}>456</span>
    </div>
  </canvas>,
  '#test'
);
