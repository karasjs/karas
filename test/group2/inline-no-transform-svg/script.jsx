let o = karas.render(
  <svg width="360" height="360">
    <span style={{width:100,height:100,background:'#F00',translateX:100}}>a</span>
  </svg>,
  '#test'
);
var input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
