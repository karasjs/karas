let o = karas.render(
  <svg width="360" height="360">
    <div style={{transform:'translateX(100px)'}}>
      <img src="../../image.png"/>
    </div>
  </svg>,
  '#test'
);
o.on(karas.Event.REFRESH, function() {
  var input = document.querySelector('#base64');
  input.value = JSON.stringify(o.virtualDom);
});
