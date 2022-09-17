karas.render(
  <svg width="360" height="360">
    <div style={{display:'none',margin:10}}>1</div>
    <div>2</div>
  </svg>,
  '#test'
);

let input = document.querySelector('#base64');
input.value = document.querySelector('svg').outerHTML;
