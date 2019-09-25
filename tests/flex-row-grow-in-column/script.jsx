karas.render(
  <canvas width="360" height="360">
    <div style={{display:'flex',flexDirection:'column',height:100}}>
      <span>1</span>
      <div style={{display:'flex',flex:1,background:'#F00'}}>
        <span style={{flex:1}}>2</span>
        <span style={{flex:1}}>3</span>
      </div>
    </div>
  </canvas>,
  '#test'
);
