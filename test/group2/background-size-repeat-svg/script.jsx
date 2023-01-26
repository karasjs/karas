let o = karas.render(
  <svg width="360" height="360">
    <div style={{height:120,background:'#000 url(../../image.png)',backgroundSize:'100% 100%'}}/>
    <div style={{height:120,background:'#0f0 url(../../image.png)',backgroundSize:'50px 80px'}}/>
    <div style={{height:120,background:'#00f url(../../image.png)',backgroundSize:'auto 50px'}}/>
  </svg>,
  '#test'
);
o.once('refresh', function() {
  let input = document.querySelector('#base64');
  input.value = document.querySelector('svg').outerHTML;
});
