let o = karas.render(
  <canvas width="360" height="360">
    <img src="../error.png" style={{width:100,height:200}}/>
  </canvas>,
  '#test'
);
o.on(karas.Event.KARAS_REFRESH, function() {
  let canvas = document.querySelector('canvas');
  let input = document.querySelector('#base64');
  input.value = canvas.toDataURL();
});
