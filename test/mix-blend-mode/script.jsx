karas.render(
  <canvas width="360" height="360">
    <div style={{position:'absolute',left:0,top:0,width:100,height:100,background:'#F00'}}/>
    <div style={{position:'absolute',left:50,top:50,width:100,height:100,background:'#00F',mixBlendMode:'lighten'}}>
      <span style={{display:'inlineBlock',background:'#0F0'}}>123</span>
    </div>
    <div style={{position:'absolute',left:0,top:50,width:40,height:40,background:'#0F0'}}/>
  </canvas>,
  '#test'
);
