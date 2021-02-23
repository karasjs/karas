let o = karas.render(
  <svg width="360" height="360">
    <div style={{display:'flex',width:100}}>
      <span style={{flexGrow:1,flexBasis:0,background:'#F00'}}>111</span>
      <span style={{flexGrow:1,flexBasis:0,background:'#00F'}}>2</span>
    </div>
    <div style={{display:'flex',width:100}}>
      <span style={{flexGrow:1,background:'#FF0'}}>111</span>
      <span style={{flexGrow:1,background:'#0FF'}}>2</span>
    </div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
