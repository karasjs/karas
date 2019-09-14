karas.render(
  <canvas width="360" height="360">
    <div style={{position:'relative'}}>
      <div style={{background:'#F00'}}>1</div>
      <div style={{position:'absolute',top:'10%',left:'10%',background:'#00F'}}>absolute</div>
      <div style={{background:'#F00'}}>2</div>
    </div>
  </canvas>,
  '#test'
);
