karas.render(
  <canvas width="360" height="360">
    <div style={{
      position: 'absolute',
      left: 0,
      top: 0,
    }}>
      <div style={{display:'flex',flexDirection:'column',background:'#f00'}}>
        <span>123123</span>
        <span>456</span>
      </div>
      <span style={{display:'inlineBlock',background:'#0f0',textAlign:'center'}}>aaa</span>
    </div>
    <div style={{
      position: 'absolute',
      left: 300,
      top: 100,
    }}>
      <div style={{display:'flex',flexDirection:'column',background:'#f00'}}>
        <span>123123123123</span>
        <span>456</span>
      </div>
    </div>
  </canvas>,
  '#test'
);
