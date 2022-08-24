let o = karas.render(
  <svg width="360" height="360">
    <div style={{height:120,background:'#000 url(../../image.png) noRepeat',backgroundSize:'100% 100%'}}/>
    <div style={{height:120,background:'#0f0 url(../../image.png) noRepeat',backgroundSize:'50px 80px'}}/>
    <div style={{height:120,background:'#00f url(../../image.png) noRepeat',backgroundSize:'auto 50px'}}/>
  </svg>,
  '#test'
);
o.on('refresh', function() {
  let input = document.querySelector('#base64');
  input.value = document.querySelector('svg').innerHTML;
});
