karas.render(
  <canvas width="360" height="360">
    <div style={{
      position: 'absolute',
      left: 0,
      top: 0,
      margin: 50,
      background: '#ccc',
    }}>
      <div style={{background:'#f00'}}>aaaaaaaaaaaaaaaaaaa</div>
      <div style={{background:'#0f0',textAlign:'center'}}>123</div>
      <span style={{display:'inlineBlock',background:'#00f',textAlign:'center'}}>456</span>
    </div>
  </canvas>,
  '#test'
);
