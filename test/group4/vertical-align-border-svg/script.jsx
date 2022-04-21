let o = karas.render(
  <svg width="360" height="360">
    <div style={{margin:10,background:'#F00'}}>
      <span style={{fontSize:24,background:'#0F0'}}>a</span>
      <span style={{display:'inline-block',width:100,height:100,border:'1px solid #000'}}>b</span>
    </div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
