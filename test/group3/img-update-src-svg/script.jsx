let o = karas.render(
  <svg width="360" height="360">
    <img src="../../image.png" ref="img"/>
  </svg>,
  '#test'
);
o.ref.img.updateSrc('../../logo.png', function() {
  var input = document.querySelector('#base64');
  input.value = document.querySelector('svg').innerHTML;
});
