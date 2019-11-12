let o = karas.render(
  <svg width="360" height="360">
    <div style={{width:100,height:100,background:'#F00',opacity:0.8}}>
      <span style={{opacity:0.5}}>123</span>
    </div>
  </svg>,
  '#test'
);
var input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
