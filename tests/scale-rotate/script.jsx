karas.render(
  <canvas width="360" height="360">
    <div style={{width:100,height:100,background:'#F00',transform:'scaleX(0.5) rotate(45deg)',transformOrigin:'left top'}}>1</div>
    <div style={{width:100,height:100,background:'#00F',transform:'scaleY(0.5) rotate(45deg)',transformOrigin:'left top'}}>2</div>
    <div style={{width:100,height:100,background:'#F00',transform:'scaleX(0.5) rotate(45deg)'}}>1</div>
    <div style={{width:100,height:100,background:'#00F',transform:'scaleY(0.5) rotate(45deg)'}}>2</div>
  </canvas>,
  '#test'
);
