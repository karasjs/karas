karas.render(
  <canvas width="360" height="360">
    <div style={{position:'relative'}}>
      <div style={{background:'#F00'}}>1</div>
      <span style={{background:'#F00'}}>2</span>
      <div style={{position:'absolute',background:'#00F'}}>absolute</div>
    </div>
  </canvas>,
  '#test'
);
