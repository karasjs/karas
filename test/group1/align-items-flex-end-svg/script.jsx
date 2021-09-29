let o = karas.render(
  <svg width="360" height="360">
    <div style={{display:'flex',alignItems:'flexEnd'}}>
      <span style={{height:100,marginTop:10,background:'#F00'}}>1</span>
      <span style={{background:'#00F'}}><div style={{height:110}}>2</div></span>
      <span style={{flex:1,background:'#0F0'}}>3</span>
    </div>
    <div>br</div>
    <div style={{display:'flex',flexDirection:'column',alignItems:'flexEnd'}}>
      <span style={{width:100,marginRight:10,background:'#F00'}}>1</span>
      <span style={{background:'#00F'}}><div style={{width:110}}>2</div></span>
      <span style={{flex:1,background:'#0F0'}}>3</span>
    </div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
