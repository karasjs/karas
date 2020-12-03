let o = karas.render(
  <canvas width="360" height="360" cache={true}>
    <div style={{position:'relative',padding:10,translateX:100}}>
      <img src="../image.png"/>
    </div>
  </canvas>,
  '#test'
);
o.on(karas.Event.REFRESH, function() {
  let canvas = document.querySelector('canvas');
  let input = document.querySelector('#base64');
  input.value = canvas.toDataURL();
});
