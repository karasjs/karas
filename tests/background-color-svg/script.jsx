let o = karas.render(
  <svg width="360" height="360">
    <span style={{backgroundColor:'#F00'}}>123</span>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
