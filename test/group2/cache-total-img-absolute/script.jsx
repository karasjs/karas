let o = karas.render(
  <canvas width="360" height="360">
    <span style={{position:'absolute'}}/>
    <div cacheAsBitmap={1} style={{position:'absolute',padding:10,translateX:100}}>
      <img src="../../image.png" style={{position:'absolute'}}/>
    </div>
  </canvas>,
  '#test'
);
o.on(karas.Event.REFRESH, function() {
  let canvas = document.querySelector('canvas');
  let input = document.querySelector('#base64');
  input.value = canvas.toDataURL();
});
