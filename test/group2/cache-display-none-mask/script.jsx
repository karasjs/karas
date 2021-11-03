let o = karas.render(
  <canvas width="360" height="360" cache={true}>
    <div cacheAsBitmap={1} style={{
      position:'relative',
      width: 100,
      height: 100,
      background: '#00F',
    }}>
      <span style={{display:'none'}}>123</span>
      <$rect mask="1" style={{
        position:'absolute',
        left: 0,
        top: 0,
        width: 100,
        height: 100,
        strokeWidth: 0,
        fill: '#F99',
      }}/>
    </div>
  </canvas>,
  '#test'
);
