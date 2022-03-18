let input = document.querySelector('#base64');
input.value = 'correct';

window.onerror = function() {
  input.value = 'error';
}

let o = karas.render(
  <canvas width="0" height="0">
    <div style={{filter:'blur(1)'}}>a</div>
  </canvas>,
  '#test'
);
