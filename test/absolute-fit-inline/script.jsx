karas.render(
  <canvas width="360" height="360">
    <div style={{
      position: 'absolute',
      left: 0,
      top: 0,
    }}>
      <span style={{background:'#f00'}}>aaaaaaaaaaaaaaaaaaaaaaaa</span>
      <span style={{background:'#0f0'}}>456</span>
    </div>
    <div style={{
      position: 'absolute',
      left: 10,
      top: 100,
    }}>
      <span style={{background:'#f00',textAlign:'center'}}>aaa</span>
      <span style={{background:'#0f0'}}>
        <span>123</span>
        <span>456</span>
      </span>
    </div>
  </canvas>,
  '#test'
);
