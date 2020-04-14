let o = karas.render(
  <svg width="360" height="360">
    <div style={{position:'absolute',left:361,top:0}}>123</div>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
