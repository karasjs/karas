let o = karas.render(
  <svg width="360" height="360">
    <div style={{textAlign:'center',width:100}}>
      <span>2</span>
    </div>
    <div style={{textAlign:'center',width:100}}>
      <span>222222222222222222</span>
    </div>
    <div style={{textAlign:'right',width:100}}>
      <span>2</span>
    </div>
    <div style={{textAlign:'right',width:100}}>
      <span>222222222222222222</span>
    </div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
