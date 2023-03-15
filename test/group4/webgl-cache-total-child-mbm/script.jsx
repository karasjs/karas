let o = karas.render(
  <webgl contextAttributes={{ preserveDrawingBuffer: false }} width="360" height="360">
    <div style={{position:'absolute',left:30,top:30,width:100,height:100,background:'#F00',filter:'blur(1)'}}>
      <span style={{position:'absolute',left:10,top:10,width:50,height:50,background:'#00F',mixBlendMode:'multiply',rotateZ:45}}/>
    </div>
  </webgl>,
  '#test'
);
