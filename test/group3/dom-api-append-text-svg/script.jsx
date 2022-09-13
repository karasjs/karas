let root = karas.render(
  <svg width="360" height="360">
    <span>1</span>
  </svg>,
  '#test'
);
root.appendChild('aa', function() {
  let input = document.querySelector('input');
  input.value = document.querySelector('svg').innerHTML;
});
