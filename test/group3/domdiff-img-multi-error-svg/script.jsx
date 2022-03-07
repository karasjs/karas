let o = karas.render(
  <svg width="360" height="360">
    <img src="not-exist.png"/>
    <img src="../../image.png"/>
    <img src="not-exist2.png"/>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
o.on('refresh', function() {
  input.value = document.querySelector('svg').innerHTML;
});