var input = document.querySelector('#base64');
let o = karas.render(
  <svg width="360" height="360">
    <div onClick={e => input.value = 1}>123</div>
  </svg>,
  '#test'
);
input.value = JSON.stringify(o.virtualDom);
