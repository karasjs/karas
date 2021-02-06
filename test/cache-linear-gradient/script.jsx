let o = karas.render(
  <canvas width="360" height="360" cache={true}>
    <div style={{position:'absolute',left:100,top:100,width:80,height:80,background:'linearGradient(#F00,#00F)'}}/>
    <$rect style={{position:'absolute',left:50,top:200,width:80,height:80,background:'linearGradient(#F00,#00F)'}}/>
  </canvas>,
  '#test'
);
