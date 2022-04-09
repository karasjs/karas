karas.render(
  <canvas width="360" height="360">
    <div style={{display:'flex',justifyContent:'flexEnd'}}>
      <span style={{width:50,background:'#F00'}}>1</span>
      <span style={{width:50,background:'#0F0'}}>2</span>
      <span style={{width:50,background:'#00F'}}>3</span>
    </div>
    <div style={{display:'flex',justifyContent:'center'}}>
      <span style={{width:50,background:'#F00'}}>1</span>
      <span style={{width:50,background:'#0F0'}}>2</span>
      <span style={{width:50,background:'#00F'}}>3</span>
    </div>
    <div style={{display:'flex',justifyContent:'spaceBetween'}}>
      <span style={{width:50,background:'#F00'}}>1</span>
      <span style={{width:50,background:'#0F0'}}>2</span>
      <span style={{width:50,background:'#00F'}}>3</span>
    </div>
    <div style={{display:'flex',justifyContent:'spaceAround'}}>
      <span style={{width:50,background:'#F00'}}>1</span>
      <span style={{width:50,background:'#0F0'}}>2</span>
      <span style={{width:50,background:'#00F'}}>3</span>
    </div>
    <div style={{display:'flex',justifyContent:'spaceEvenly'}}>
      <span style={{width:50,background:'#F00'}}>1</span>
      <span style={{width:50,background:'#0F0'}}>2</span>
      <span style={{width:50,background:'#00F'}}>3</span>
    </div>
  </canvas>,
  '#test'
);
