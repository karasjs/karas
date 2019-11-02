karas.render(
  <canvas width="360" height="360">
    <div style={{position:'relative'}}>
      <div style={{background:'#F00'}}>1</div>
      <div style={{position:'absolute',left:30,background:'#00F'}}>absolute</div>
      <span style={{background:'#F00'}}>2</span>
    </div>
  </canvas>,
  '#test'
);
