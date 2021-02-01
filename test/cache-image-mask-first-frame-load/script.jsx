let o = karas.render(
  <canvas width="360" height="360" cache={true}>
    <img src="../image.png"/>
    <$rect mask={1} style={{position:'absolute',left:0,top:0,width:250,height:250,fill:'#FC6'}}/>
  </canvas>,
  '#test'
);
