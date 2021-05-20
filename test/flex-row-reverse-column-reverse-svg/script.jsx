let o = karas.render(
  <svg width="360" height="360">
    <div style={{display:'flex',flexDirection:'row-reverse'}}>
      <span style={{width:50,background:'#F00'}}>1</span>
      <span style={{width:100,background:'#0F0'}}>2</span>
      <span style={{flex:1,background:'#00F'}}>3</span>
    </div>
    <div style={{display:'flex',marginTop:10,flexDirection:'column-reverse'}}>
      <span style={{height:20,background:'#F00'}}>1</span>
      <span style={{height:50,background:'#0F0'}}>2</span>
      <span style={{flex:1,background:'#00F'}}>3</span>
    </div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
