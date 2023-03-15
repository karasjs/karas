let o = karas.render(
  <webgl contextAttributes={{ preserveDrawingBuffer: false }} width="360" height="360">
    <div style={{position:'absolute',left:30,top:30,padding:5,width:100,height:100,background:'linearGradient(#F00,#00F)',filter:'blur(1)'}}>
      <span style={{background:'#FFF'}}>abc</span>
    </div>
    <$rect style={{position:'absolute',left: 30,top:150,width:100,height:100,background:'#F00',filter:'blur(1)'}}/>
  </webgl>,
  '#test'
);
