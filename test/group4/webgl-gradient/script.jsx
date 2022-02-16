let o = karas.render(
  <webgl width="360" height="360">
    <$circle style={{
      position: 'absolute',
      left: '20%',
      top: '20%',
      width: 200,
      height: 200,
      strokeWidth: 0,
      fill: 'radial-gradient(closest-side, #FFF, #FFF 70%, transparent 85%)',
    }}/>
  </webgl>,
  '#test'
);
