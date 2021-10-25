let root = karas.render(
  <canvas width="360" height="360">
    <div style={{
      width: 50,
      height: 50,
      background: 'url(../../image.png) no-repeat',
      borderRadius: 10,
    }}/>
  </canvas>,
  '#test'
);
root.on('refresh', function() {
  let input = document.querySelector('input');
  input.value = document.querySelector('canvas').toDataURL();
});
