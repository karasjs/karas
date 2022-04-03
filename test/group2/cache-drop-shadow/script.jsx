let o = karas.render(
  <canvas width="360" height="360">
    <div cacheAsBitmap={1} style={{
      margin:20,
      width: 100,
      height: 100,
      border: '1px solid #000',
      filter: 'drop-shadow(-2 -2 3 #F00)',
    }}>123</div>
    <div cacheAsBitmap={1} style={{
      margin:20,
      width: 100,
      height: 100,
      border: '1px solid #000',
      filter: 'drop-shadow(2 2 3 #F00)',
    }}>123</div>
  </canvas>,
  '#test'
);
