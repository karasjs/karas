let o = karas.render(
  <svg width="360" height="360">
    <img src="../image.png" style={{transform:'translate(50px,50px)'}}/>
  </svg>,
  '#test'
);
o.on(karas.Event.REFRESH, function() {
  var input = document.querySelector('#base64');
  input.value = JSON.stringify(o.virtualDom);
});
