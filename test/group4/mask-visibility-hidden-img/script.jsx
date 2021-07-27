let o = karas.render(
  <canvas width="360" height="360">
    <img style={{visibility:'hidden'}} src="../../image.png"/>
    <$polygon mask="1" style={{
      position: 'absolute',
      left: 0,
      top: 0,
      width: 10,
      height: 10,
      fill: '#F00',
    }} points={[
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 1],
    ]}/>
    <div>123</div>
  </canvas>,
  '#test'
);
o.on('refresh', function() {
  let canvas = document.querySelector('canvas');
  let input = document.querySelector('#base64');
  input.value = canvas.toDataURL();
});
