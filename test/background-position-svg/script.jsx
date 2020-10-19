let o = karas.render(
  <svg width="360" height="360">
    <div style={{height:120,background:'#000 url(../image.png) center no-repeat'}}/>
    <div style={{height:120,background:'#0f0 url(../image.png) right 5px no-repeat'}}/>
    <div style={{height:120,background:'#00f url(../image.png) 50px 100% no-repeat'}}/>
  </svg>,
  '#test'
);
o.on('refresh', function() {
  let input = document.querySelector('#base64');
  input.value = JSON.stringify(o.virtualDom);
});
