let o = karas.render(
  <canvas width="360" height="360">
    <div style={{position:'absolute',left:300,top:0,width:100,height:100,background:'url(../../image.png) noRepeat',backgroundSize:'110 110',translateX:-100}}/>
  </canvas>,
  '#test'
);

o.once('refresh', () => {
  let canvas = document.querySelector('canvas');
  let input = document.querySelector('#base64');
  input.value = canvas.toDataURL();
});
