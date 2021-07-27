karas.render(
  <canvas width="360" height="360">
    <div style={{display:'flex',flexDirection:'column'}}>
      <span>1</span>
      <div style={{display:'flex',background:'#F00'}}>
        <span style={{flex:1}}>2</span>
        <span style={{flex:1}}>3</span>
      </div>
    </div>
  </canvas>,
  '#test'
);
