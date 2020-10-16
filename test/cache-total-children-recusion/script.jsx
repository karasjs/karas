let o = karas.render(
  <canvas width="360" height="360" cache={true}>
    <div style={{position:'relative',background:'#F00',padding:10}}>
      <div style={{display:'inline',margin:10,padding:10,background:'#0F0'}}>
        <span style={{padding:10,background:'#00F'}}>123</span>
        <div style={{display:'inline',margin:10,padding:10,background:'#F00'}}>
          <span style={{padding:10,background:'#00F'}}>456</span>
        </div>
      </div>
      <div style={{display:'inline',margin:10,padding:10,background:'#0F0'}}>
        <span style={{padding:10,background:'#00F'}}>123</span>
        <div style={{display:'inline',margin:10,padding:10,background:'#F00'}}>
          <span style={{padding:10,background:'#00F'}}>456</span>
        </div>
      </div>
    </div>
  </canvas>,
  '#test'
);
