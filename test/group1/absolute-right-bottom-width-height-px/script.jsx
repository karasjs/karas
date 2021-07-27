karas.render(
  <canvas width="360" height="360">
    <div style={{position:'relative'}}>
      <div style={{background:'#F00'}}>1</div>
      <div style={{position:'absolute',bottom:2,right:10,width:100,height:30,background:'#00F'}}>absolute</div>
      <div style={{background:'#F00'}}>2</div>
    </div>
  </canvas>,
  '#test'
);
