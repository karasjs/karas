karas.render(
  <webgl contextAttributes={{ preserveDrawingBuffer: false }} width="360" height="360">
    <div style={{position:'absolute',left:0,top:0,width:100,height:100,background:'#999',
      perspective:500}}>
      <div style={{width:100,height:100,backfaceVisibility:'hidden',
        background:'linear-gradient(#F00,#00F)',transform:'rotateY(120)'}}/>
    </div>
    <div style={{position:'absolute',left:180,top:0,width:100,height:100,background:'#999',
      perspective:500}}>
      <div style={{width:100,height:100,backfaceVisibility:'hidden',
        background:'linear-gradient(#F00,#00F)',transform:'rotateX(120)'}}/>
    </div>
    <div style={{position:'absolute',left:0,top:180,width:100,height:100,background:'#999',
      perspective:500}}>
      <div style={{width:100,height:100,backfaceVisibility:'hidden',
        background:'linear-gradient(#F00,#00F)',transform:'rotateX(120)rotateY(120)'}}/>
    </div>
    <div style={{position:'absolute',left:180,top:180,width:100,height:100,background:'#999',
      perspective:500}}>
      <div style={{width:100,height:100,backfaceVisibility:'hidden',
        background:'linear-gradient(#F00,#00F)',scaleX:-1}}/>
    </div>
  </webgl>,
  '#test'
);
