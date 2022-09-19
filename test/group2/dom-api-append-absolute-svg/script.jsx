let root = karas.render(
  <svg width="360" height="360">
    <div>1</div>
  </svg>,
  '#test'
);
root.appendChild(<div style={{position:'absolute'}}>2</div>, function() {
  root.children[0].appendChild(<div style={{position:'absolute'}}>3</div>, function() {
    let input = document.querySelector('input');
    input.value = document.querySelector('svg').innerHTML;
  });
});
