karas.render(
  <canvas width="360" height="360">
    <div style={{display:'flex',background:'#F00'}}>
      <span>1</span>
      <span>2</span>
    </div>
    <div style={{display:'flex',justifyContent:'center'}}>
      <div style={{flex:0.5,background:'#00F'}}>a</div>
    </div>
    <div style={{display:'flex',justifyContent:'center',width:300}}>
      <div style={{display:'flex',flexDirection:'column',flex:1,background:'#F00'}}>
        <span>a</span>
      </div>
    </div>
  </canvas>,
  '#test'
);
