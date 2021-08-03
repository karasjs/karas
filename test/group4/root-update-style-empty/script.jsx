let root = karas.render(
  <canvas width="360" height="360" noRender={true}>
    <div>123</div>
  </canvas>,
  '#test'
);
root.updateStyle({}, function() {
  let input = document.querySelector('#base64');
  input.value = document.querySelector('canvas').toDataURL();
});
