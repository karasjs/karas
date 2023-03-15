let o = karas.render(
  <webgl contextAttributes={{ preserveDrawingBuffer: false }} width="360" height="360">
    <div style={{position:'absolute',left:30,top:30,padding:5,width:100,height:100,background:'linearGradient(#F00,#00F)',rotateZ:45}}>
      <p style={{background:'#FFF',translateX:50}}>abc</p>
    </div>
  </webgl>,
  '#test'
);
