let o = karas.render(
  <svg width="360" height="360">
    <div style={{width:300,height:300,background:'url(../../image.png) repeat center'}}/>
  </svg>,
  '#test'
);
o.once('refresh', function() {
  let input = document.querySelector('#base64');
  input.value = JSON.stringify(o.virtualDom);
});
