window.onerror = function(e) {
  let input = document.querySelector('#base64');
  input.value = 'error';
};

karas.render(
  <canvas width="360" height="360">
    <span><div>1</div></span>
  </canvas>,
  '#test'
);
