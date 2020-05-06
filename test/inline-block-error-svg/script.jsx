let o = karas.render(
  <svg width="360" height="360">
    <span style={{background:'#F00'}}><div>1</div></span>
  </svg>,
  '#test'
);

var input = document.querySelector('#base64');
input.value = document.querySelector('svg').outerHTML;
