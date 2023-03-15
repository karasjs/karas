let o = karas.render(
  <webgl contextAttributes={{ preserveDrawingBuffer: false }} width="360" height="360">
    <div style={{position:'absolute',left:30,top:30,padding:5,width:100,height:100,background:'linearGradient(#F00,#00F)',translateY:10,rotateZ:90}}/>
    <div cacheAsBitmap={1} mask="1" style={{position:'absolute',left:50,top:50,width:50,height:20,background:'#FFF'}}>
      <span style={{position:'absolute',left:0,top:30,width:20,height:20,background:'#FFF'}}/>
    </div>
  </webgl>,
  '#test'
);
