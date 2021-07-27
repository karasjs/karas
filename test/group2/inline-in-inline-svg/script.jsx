let o = karas.render(
  <svg width="360" height="360">
    <span>2222222<strong>33333</strong>444444</span>
  </svg>,
  '#test'
);
var input = document.querySelector('#base64');
input.value = JSON.stringify(o.virtualDom);
