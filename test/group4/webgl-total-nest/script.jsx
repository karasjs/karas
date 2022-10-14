let o = karas.render(
  <webgl width="360" height="360">
    <div cacheAsBitmap={1} style={{
      position: 'absolute',
      left: 0,
      top: 0,
      width: 100,
      height: 100,
      filter: 'blur(1)',
    }}>
      <span cacheAsBitmap={1} style={{background:'#F00'}}>123</span>
    </div>
  </webgl>,
  '#test'
);
