let o = karas.render(
  <webgl contextAttributes={{ preserveDrawingBuffer: false }} width="360" height="360">
    <div style={{position:'absolute',left:20,top:20,width:300,height:100,
      perspective:500}} ref="div">
      <div style={{position:'absolute',left:0,top:0,width:100,height:100,
        background:'linear-gradient(#F00,#00F)',transform:'rotateX(45)'}}/>
      <div style={{position:'absolute',left:200,top:0,width:100,height:100,
        background:'linear-gradient(#F00,#00F)',transform:'rotateX(45)'}}/>
    </div>
    <div style={{position:'absolute',left:20,top:150,width:100,height:100,
      background:'linear-gradient(#F00,#00F)',transform:'perspective(500)rotateX(45)'}}/>
  </webgl>,
  '#test'
);
