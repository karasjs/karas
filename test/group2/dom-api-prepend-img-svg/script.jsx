let root = karas.render(
  <svg width="360" height="360">
    <span>1</span>
  </svg>,
  '#test'
);
let img = <img src="../../image.png"/>;
root.prependChild(img, function() {
  root.on('refresh', function() {
    let input = document.querySelector('input');
    input.value = document.querySelector('svg').innerHTML;
  });
});
