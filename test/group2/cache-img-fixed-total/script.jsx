let o = karas.render(
  <canvas width="360" height="360" cache={true}>
    <div cacheAsBitmap={1} style={{background:'#00F',padding:10}}>
      <img src="../../image.png" style={{width:100,height:100}}/>
    </div>
  </canvas>,
  '#test'
);
o.on('refresh', function() {
  let input = document.querySelector('#base64');
  input.value = document.querySelector('canvas').toDataURL();
});
