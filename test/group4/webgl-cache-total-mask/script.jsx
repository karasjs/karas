let o = karas.render(
  <webgl width="360" height="360">
    <div style={{position:'absolute',left:30,top:30,padding:5,width:100,height:100,background:'linearGradient(#F00,#00F)',translateY:10,rotateZ:90}}/>
    <$rect mask="1" style={{position:'absolute',left:50,top:50,width:50,height:60,fill:'#FFF'}}/>
  </webgl>,
  '#test'
);
