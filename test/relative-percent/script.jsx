karas.render(
  <canvas width="360" height="360">
    <div style={{position:'relative',width:100,right:'10%',left:'10%',background:'#00F'}}>1</div>
    <div style={{position:'relative',width:100,top:'10%',bottom:'10%',background:'#00F'}}>2</div>
    <div style={{position:'relative',width:100,top:'10%',right:'-10%',background:'#F00'}}>3</div>
    <div style={{position:'relative',width:100,bottom:'-10%',right:'-10%',background:'#00F'}}>4</div>
    <div style={{position:'relative',width:100,bottom:'-10%',left:'10%',background:'#F00'}}>5</div>
    <div style={{position:'relative',width:100,top:'10%',left:'10%',background:'#F00'}}>6</div>
  </canvas>,
  '#test'
);
