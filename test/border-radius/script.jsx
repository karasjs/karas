karas.render(
  <canvas width="360" height="360">
    <div style={{
      width:240,
      height:200,
      border:'15px solid rgba(0,0,0,0.5)',
      borderBottomColor: 'rgba(255,0,0,0.5)',
      borderLeftColor: 'rgba(0,255,0,0.5)',
      borderRightColor: 'rgba(0,0,255,0.5)',
      borderRadius: '30 30',
      background:'#F00',
      backgroundClip:'padding-box'
    }}/>
  </canvas>,
  '#test'
);
