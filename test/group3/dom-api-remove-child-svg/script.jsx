let root = karas.render(
  <svg width="360" height="360">
    <div ref="div">
      <span>1</span>
      <span>2</span>
    </div>
  </svg>,
  '#test'
);
root.ref.div.removeChild(root.ref.div.children[0], function() {
  let input = document.querySelector('input');
  input.value += document.querySelector('svg').innerHTML;
});
