let o = karas.render(
  <webgl contextAttributes={{ preserveDrawingBuffer: false }} width="360" height="360">
    <div style={{position:'absolute',left:50,top:50,width:100,height:100,background:'linear-gradient(#F00,#00F)',
      transform:'perspective(200)rotate3d(1, 1, 1, 45)'}}/>
    <div style={{position:'absolute',left:200,top:50,width:100,height:100,
      perspective:200}} ref="div">
        <div style={{width:100,height:100,background:'linear-gradient(#F00,#00F)',rotate3d:'1,1,1,45'}} ref="span"/>
    </div>
  </webgl>,
  '#test'
);
