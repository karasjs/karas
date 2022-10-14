let o = karas.render(
  <canvas width="360" height="360">
    <div style={{
      position: 'absolute',
      left: 0,
      top: 0,
      width: 100,
      height: 100,
      filter: 'blur(1)',
    }}>
      <span cacheAsBitmap={1} style={{background:'#F00'}}>a</span>
    </div>
  </canvas>,
  '#test'
);
