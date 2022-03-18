let o = karas.render(
  <canvas width="360" height="360">
    <img src="../../image.png"/>
    <$rect cacheAsBitmap={1} mask={1} style={{position:'absolute',left:0,top:0,width:250,height:250,fill:'#FC6'}}/>
  </canvas>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = document.querySelector('canvas').toDataURL();
o.on('refresh', function() {
  let input = document.querySelector('#base642');
  input.value = document.querySelector('canvas').toDataURL();
});
