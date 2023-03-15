let o = karas.render(
  <webgl contextAttributes={{ preserveDrawingBuffer: false }} width="360" height="360">
    <$ellipse style={{
      position: 'absolute',
      left: 180,
      top: 180,
      width: 100,
      height: 50,
      strokeWidth: 0,
      background: '#F00',
      fill: 'radial-gradient(farthest-side, rgba(0,0,0,0.5), rgba(0,0,0,0))',
      translateX: '50%',
    }}/>
  </webgl>,
  '#test'
);
