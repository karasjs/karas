karas.render(
  <canvas width="360" height="360">
    <div style={{display:'flex',border:'1px solid #000'}}>
      <span style={{background:'#F00'}}>a</span>
      <span style={{background:'#0FF',marginLeft:'auto'}}>b</span>
      <span style={{background:'#F00'}}>c</span>
      <span style={{background:'#0FF',marginRight:'auto'}}>d</span>
      <span style={{background:'#F00',margin:'auto'}}>e</span>
    </div>
  </canvas>,
  '#test'
);
