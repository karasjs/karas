let root = karas.render(
  <svg width="360" height="360">
    <div style={{background:'#F00'}}>
      <div>3</div>
      <div ref="div">1</div>
      <div>2</div>
    </div>
  </svg>,
  '#test'
);
root.ref.div.remove(function() {
  let input = document.querySelector('input');
  input.value = document.querySelector('svg').innerHTML;
});
