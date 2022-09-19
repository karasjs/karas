let root = karas.render(
  <svg width="360" height="360">
    <div style={{background:'#F00'}}>
      <span>3</span>
      <span ref="span">1</span>
      <span>2</span>
    </div>
  </svg>,
  '#test'
);
root.ref.span.remove(function() {
  let input = document.querySelector('input');
  input.value = document.querySelector('svg').innerHTML;
});
