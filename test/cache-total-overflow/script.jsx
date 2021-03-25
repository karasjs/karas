let o = karas.render(
  <canvas width="360" height="360" cache={true}>
    <div style={{position:'absolute',left:100,top:100,
      width:100,height:100,background:'#F00',overflow:'hidden',rotate:30}}>
      <span style={{display:'inlineBlock',width:200,height:20,background:'#00F'}}/>
    </div>
  </canvas>,
  '#test'
);
