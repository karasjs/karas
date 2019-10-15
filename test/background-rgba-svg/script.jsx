let o = karas.render(
  <svg width="360" height="360">
    <span style={{backgroundColor:'rgba(255,0,0,0.5)'}}>123</span>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
