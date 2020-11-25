let o = karas.render(
  <svg width="360" height="360">
    <img src="error.png" placeholder="../image.png"/>
  </svg>,
  '#test'
);
let input = document.querySelector('#base64');
input.value = document.querySelector('svg').outerHTML;
o.on('refresh', function(lv) {
  input.value += lv + document.querySelector('svg').outerHTML;
});

