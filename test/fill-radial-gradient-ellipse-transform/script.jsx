karas.render(
  <canvas width="360" height="360">
    <$ellipse style={{
      position: 'absolute',
      left: '50%',
      top: '50%',
      width: 50,
      height: 100,
      strokeWidth: 0,
      fill: `radial-gradient(rgba(255,0,0,1),rgba(0,0,255,1))`,
      transform: `translate(-50%,-90%)`,
    }}/>
  </canvas>,
  '#test'
);
