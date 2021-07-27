let o = karas.render(
  <svg width="360" height="360">
    <div style={{display:'flex',width:100}}>
      <span style={{flexGrow:1,flexBasis:20,background:'#F00'}}>1</span>
      <span style={{flexGrow:2,flexBasis:20,background:'#00F'}}>2</span>
    </div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
