window.console.error = function(s) {
  var input = document.querySelector('#base64');
  input.value = s.toString();
}

karas.render(
  <canvas width="360" height="360">
    <span><div>1</div></span>
  </canvas>,
  '#test'
);
