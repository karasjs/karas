let o = karas.render(
  <webgl contextAttributes={{ preserveDrawingBuffer: true }} width="360" height="360">
    <img src={'../../../framework.png'}/>
  </webgl>,
  '#test'
);
o.once('refresh', function() {
  let input = document.querySelector('#base64');
  input.value = document.querySelector('canvas').toDataURL();
});
