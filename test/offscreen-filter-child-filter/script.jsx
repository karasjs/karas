karas.render(
  <canvas width="360" height="360">
    <div style={{position:'absolute',left:0,top:0,width:100,height:100,background:'#F00',overflow:'hidden',filter:'blur(2)'}}>
      <span style={{position:'absolute',left:60,top:60,width:50,height:50,background:'#00F',filter:'blur(5)'}}/>
    </div>
  </canvas>,
  '#test'
);
