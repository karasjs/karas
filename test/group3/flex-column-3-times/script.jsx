karas.render(
  <canvas width="360" height="360">
    <div style={{ display: 'flex', flexDirection: 'column', height: 300, }}>
      <div>1</div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f00' }}>
        <div>2</div>
        <div style={{ flex: 1, background: '#00f' }}>3</div>
      </div>
    </div>
  </canvas>,
  '#test'
);
