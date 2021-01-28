let o = karas.render(
  <canvas width="360" height="360" cache={true}>
    <$rect style={{position:'absolute',left:20,top:20,width:80,height:80,fill:'#F00'}}/>
    <$rect style={{position:'absolute',left:50,top:50,width:10,height:10,fill:'#CCC',strokeWidth: 0}} mask="1"/>
  </canvas>,
  '#test'
);
