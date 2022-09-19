let root = karas.render(
  <svg width="360" height="360">
    <div>1</div>
  </svg>,
  '#test'
);
root.appendChild(<span>2</span>, function() {
  root.appendChild(<span>3</span>, function() {
    root.children[0].appendChild(<span>4</span>, function() {
      let input = document.querySelector('input');
      input.value = document.querySelector('svg').innerHTML;
    });
  });
});
