karas.render(
  <canvas width="360" height="360" style={{background:'#00F'}}>
    <div style={{position:'absolute',left:0,top:0,width:200,height:200,background:'#F00',mixBlendMode:'lighten',filter:'blur(5)'}}/>
    <$rect mask={1} style={{position:'absolute',left:0,top:0,width:100,height:100,fill:'#FFF'}}/>
  </canvas>,
  '#test'
);
