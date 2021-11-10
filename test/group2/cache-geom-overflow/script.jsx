let o = karas.render(
  <canvas width="360" height="360" cache={true}>
    <$line cacheAsBitmap={1} ref="t" style={{margin:10,width:100,height:100,background:'#F00'}} x1={-0.1}y2={1.1}/>
  </canvas>,
  '#test'
);
