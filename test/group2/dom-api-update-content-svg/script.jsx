let root = karas.render(
  <svg width="360" height="360">
    <span>a</span><span>b</span>
  </svg>,
  '#test'
);
root.children[0].children[0].updateContent('haha', function() {
  let input = document.querySelector('input');
  input.value = document.querySelector('svg').innerHTML;
});
