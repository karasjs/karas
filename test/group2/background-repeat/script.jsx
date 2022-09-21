let o = karas.render(
  <canvas width="360" height="360">
    <div style={{height:120,background:'#000 url(../../image.png) repeat center'}}/>
  </canvas>,
  '#test'
);

o.on('refresh', () => {
  let canvas = document.querySelector('canvas');
  let input = document.querySelector('#base64');
  input.value = canvas.toDataURL();
});
