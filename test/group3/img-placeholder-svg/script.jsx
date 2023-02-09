let o = karas.render(
  <svg width="360" height="360">
    <img src="error.png" placeholder="../../image.png"/>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = document.querySelector('svg').innerHTML;
o.once('refresh', function(lv) {
  input.value += lv + document.querySelector('svg').innerHTML;
});

