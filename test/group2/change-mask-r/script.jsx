let o = karas.render(
  <canvas width="360" height="360">
    <div style={{background:'#F00',width:100,height:100}}/>
    <$rect ref="mask" style={{position:'absolute',left:20,top:20,width:50,height:50,fill:'#FFF'}}/>
  </canvas>,
  '#test'
);
o.ref.mask.mask = true;
o.on('refresh', function() {
  let canvas = document.querySelector('canvas');
  let input = document.querySelector('#base64');
  input.value = canvas.toDataURL();
});
