karas.render(
  <canvas width="360" height="360">
    <div style={{width:100,height:100,background:'#F00',transform:'translateX(100px)'}}>
      <span style={{display:'inlineBlock',width:100,height:100,background:'#00F',transform:'rotate(45deg)'}}/>
    </div>
    <div style={{width:100,height:100,background:'#F00',transform:'translateX(100px)',transformOrigin:'left top'}}>
      <span style={{display:'inlineBlock',width:100,height:100,background:'#00F',transform:'rotate(45deg)',transformOrigin:'left top'}}/>
    </div>
  </canvas>,
  '#test'
);
