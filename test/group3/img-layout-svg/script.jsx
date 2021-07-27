let o = karas.render(
  <svg width="360" height="360">
    <img src="../../image.png" style={{width:50}}/>
    <span>123</span>
    <div>456</div>
  </svg>,
  '#test'
);
o.on(karas.Event.REFRESH, function() {
  var input = document.querySelector('#base64');
  input.value = JSON.stringify(o.virtualDom);
});
