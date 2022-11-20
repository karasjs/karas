karas.render(
  <canvas width="360" height="360">
    <div style={{position:'relative'}}>
      <div style={{background:'#F00'}}>1</div>
      <div style={{position:'absolute',bottom:10,right:10,background:'#00F'}}>absolute</div>
      <div style={{background:'#F00'}}>2</div>
    </div>
    <div style={{
      position: 'absolute',
      bottom:0,
      right:0,
      margin:5,
      padding:5,
      background:'#F00',
    }}>a</div>
  </canvas>,
  '#test'
);
