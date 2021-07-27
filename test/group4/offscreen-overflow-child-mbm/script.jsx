karas.render(
  <canvas width="360" height="360">
    <div style={{position:'relative',width:100,height:100,background:'#F00',overflow:'hidden'}}>
      <span style={{position:'absolute',left:50,top:50,width:100,height:100,background:'#00F',mixBlendMode:'multiply'}}/>
    </div>
  </canvas>,
  '#test'
);
