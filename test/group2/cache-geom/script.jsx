let o = karas.render(
  <canvas width="360" height="360" cache={true}>
    <$line cacheAsBitmap={1} ref="t" style={{width:100,height:100,background:'#F00'}}/>
  </canvas>,
  '#test'
);
