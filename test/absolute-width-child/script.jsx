karas.render(
  <canvas width="360" height="360">
    <div style={{
      position: 'absolute',
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
    }}>
      <span style={{
        display: 'block',
        background: '#f00',
        textAlign: 'center',
      }}>123</span>
      <span style={{background:'#0f0'}}>456</span>
      <div style={{background:'#00f'}}>789</div>
      <div style={{display:'flex',background:'#999'}}>000</div>
    </div>
  </canvas>,
  '#test'
);
