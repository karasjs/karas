let o = karas.render(
  <svg width="360" height="360">
    <div style={{width:200,height:200,background:'#000 url(../../image.png) 180 0 no-repeat'}}/>
  </svg>,
  '#test'
);
o.once('refresh', function() {
  let input = document.querySelector('#base64');
  input.value = JSON.stringify(o.virtualDom);
});
