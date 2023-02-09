let o = karas.render(
  <canvas width="360" height="360">
    <div ref="div" style={{background:'#F00',width:100,height:100}}>123</div>
  </canvas>,
  '#test'
);
o.ref.div.cacheAsBitmap = true;
o.once('refresh', function() {
  let canvas = document.querySelector('canvas');
  let input = document.querySelector('#base64');
  input.value = canvas.toDataURL();
});
