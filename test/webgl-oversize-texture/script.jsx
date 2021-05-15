let o = karas.render(
  <webgl width="360" height="360">
    <div style={{position:'absolute',left:10,top:10,width:10000,height:10000,background:'linearGradient(#F00,#00F 5%)',filter:'blur(1)'}}>a</div>
    <$rect style={{position:'absolute',left:100,top:100,width:200,height:200,fill:'#0F0',opacity:0.5,mixBlendMode:'multiply'}}/>
  </webgl>,
  '#test'
);
