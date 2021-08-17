let root = karas.render(
  <svg width="360" height="360">
    <div>1</div>
  </svg>,
  '#test'
);
let div = <div style={{position:'absolute'}}>2</div>;
root.appendChild(div, function() {
  let div = <div style={{position:'absolute'}}>3</div>;
  root.children[0].appendChild(div, function() {
    let input = document.querySelector('input');
    input.value = document.querySelector('svg').innerHTML;
  });
});
