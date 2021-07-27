karas.render(
  <svg width="360" height="360">
    <div style={{position:'absolute',background:'#f00'}}>  123</div>
  </svg>,
  '#test'
);

let text = document.querySelector('text');
let input = document.querySelector('input');
input.value = text.outerHTML;
