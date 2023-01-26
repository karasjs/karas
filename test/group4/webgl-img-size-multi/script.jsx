let o = karas.render(
  <webgl width="360" height="360">
    <img src="../../logo.png" style={{
      display: 'block',
      width: 200,
    }}/>
    <img src="../../logo.png" style={{
      display: 'block',
      width: 100,
    }}/>
  </webgl>,
  '#test'
);
o.once('refresh', function() {
  let input = document.querySelector('#base64');
  input.value = document.querySelector('canvas').toDataURL();
});
