let o = karas.render(
  <webgl contextAttributes={{ preserveDrawingBuffer: true }} width="360" height="360">
    <div style={{
      margin:20,
      width: 100,
      height: 100,
      border: '1px solid #000',
      filter: 'drop-shadow(-12 -12 3 #F00)',
    }}>123</div>
    <p cacheAsBitmap={1} style={{
      margin:20,
      width: 100,
      height: 100,
      border: '1px solid #000',
      filter: 'drop-shadow(12 12 3 #F00)',
    }}>123</p>
  </webgl>,
  '#test'
);
