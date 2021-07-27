let o = karas.render(
  <svg width="360" height="360">
    <div style={{width:100,height:100,background:`linear-gradient(0.7 1 1 0,#F00, #00F)`}}/>
  </svg>,
  '#test'
);
var input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
