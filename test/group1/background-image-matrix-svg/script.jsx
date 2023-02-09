let o = karas.render(
  <svg width="360" height="360">
    <div style={{position:'absolute',width:50,height:50,left:'50%',translateX:'-50%',
      background:'url(../../image.png) noRepeat -25 0',backgroundSize:'cover'}}/>
  </svg>,
  '#test'
);
o.once('refresh', function() {
  let input = document.querySelector('#base64');
  input.value = document.querySelector('svg').innerHTML;
});
