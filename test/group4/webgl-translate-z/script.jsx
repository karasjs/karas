let o = karas.render(
  <webgl contextAttributes={{ preserveDrawingBuffer: false }} width="360" height="360">
    <div style={{position:'absolute',left:20,top:20,width:100,height:100,perspective:500}}>
      <div style={{width:100,height:100,background:'#f00',translateZ:-50}}/>
    </div>
    <div style={{position:'absolute',left:220,top:20,width:100,height:100,perspective:500}}>
      <div style={{width:100,height:100,background:'#f00',translateZ:50}}/>
    </div>
    <div style={{position:'absolute',left:20,top:220,width:100,height:100,perspective:200}}>
      <div style={{width:100,height:100,background:'#f00',translateZ:-50}}/>
    </div>
    <div style={{position:'absolute',left:220,top:220,width:100,height:100,perspective:200}}>
      <div style={{width:100,height:100,background:'#f00',translateZ:50}}/>
    </div>
  </webgl>,
  '#test'
);
