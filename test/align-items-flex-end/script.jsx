karas.render(
  <canvas width="360" height="360">
    <div style={{display:'flex',alignItems:'flexEnd'}}>
      <span style={{height:100,marginTop:10,background:'#F00'}}>1</span>
      <span style={{background:'#00F'}}><div style={{height:110}}>2</div></span>
      <span style={{flex:1,background:'#0F0'}}>3</span>
    </div>
    <div>br</div>
  </canvas>,
  '#test'
);
