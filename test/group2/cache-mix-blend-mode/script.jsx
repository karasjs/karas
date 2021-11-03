let o = karas.render(
  <canvas width="360" height="360" cache={true}>
    <div cacheAsBitmap={1} style={{position:'absolute',left:0,top:0,width:100,height:100,background:'#F00'}}/>
    <div cacheAsBitmap={1} style={{position:'absolute',left:50,top:50,width:100,height:100,background:'#00F',mixBlendMode:'lighten'}}/>
    <div cacheAsBitmap={1} style={{position:'absolute',left:0,top:50,width:40,height:40,background:'#0F0'}}/>
  </canvas>,
  '#test'
);
