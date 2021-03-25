let o = karas.render(
  <svg width="360" height="360">
    <div style={{position:'absolute',left:100,top:100,width:50,height:50,background:'#00f url(../image.png) noRepeat',backgroundSize:'auto 100%'}}/>
    <div style={{position:'absolute',left:200,top:200,width:50,height:50,background:'#00f url(../image.png) noRepeat',backgroundSize:'100% auto'}}/>
  </svg>,
  '#test'
);
o.on('refresh', function() {
  let input = document.querySelector('#base64');
  input.value = document.querySelector('svg').outerHTML;
});
