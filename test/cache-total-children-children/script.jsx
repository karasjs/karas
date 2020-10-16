let o = karas.render(
  <canvas width="360" height="360" cache={true}>
    <div style={{position:'relative',background:'#F00',padding:10}}>
      <div style={{display:'inline',padding:10,border:'1px solid #000'}}>
        <span style={{padding:10,background:'#0F0'}}>123</span>
        <span style={{padding:10,background:'#00F'}}>456</span>
      </div>
      <div style={{display:'inline',padding:10,border:'1px solid #888'}}>
        <span style={{padding:10,background:'#0F0'}}>123</span>
        <span style={{padding:10,background:'#00F'}}>456</span>
      </div>
    </div>
  </canvas>,
  '#test'
);
