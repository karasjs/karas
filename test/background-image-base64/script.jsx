karas.render(
  <canvas width="360" height="360">
    <div style={{height:'100%',background:'url(../image.png) no-repeat'}}>123</div>
  </canvas>,
  '#test'
);
setTimeout(() => {
  let canvas = document.querySelector('canvas');
  let input = document.querySelector('#base64');
  input.value = canvas.toDataURL();
}, 200);

