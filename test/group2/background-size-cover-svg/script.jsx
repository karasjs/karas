let o = karas.render(
  <svg width="360" height="360">
    <div style={{height:120,background:'#000 url(../../image.png) noRepeat',backgroundSize:'cover'}}/>
    <div style={{height:50,background:'#0f0 url(../../image.png) noRepeat',backgroundSize:'cover'}}/>
    <div style={{width:50,height:120,background:'#00f url(../../image.png) noRepeat',backgroundSize:'cover'}}/>
  </svg>,
  '#test'
);
o.once('refresh', function() {
  let input = document.querySelector('#base64');
  input.value = document.querySelector('svg').innerHTML;
});
