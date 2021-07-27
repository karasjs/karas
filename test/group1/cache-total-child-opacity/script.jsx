let o = karas.render(
  <canvas width="360" height="360" cache={true}>
    <div style={{position:'absolute',left:0,top:0}}>
      <$rect style={{width:100,height:100,fill:'#000',opacity:0.5}}/>
    </div>
  </canvas>,
  '#test'
);
