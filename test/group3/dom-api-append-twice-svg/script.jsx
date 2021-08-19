let root = karas.render(
  <svg width="360" height="360">
    <span>1</span>
  </svg>,
  '#test'
);
let div = <div>2</div>;
root.appendChild(div);
root.appendChild(div, function() {
  let input = document.querySelector('input');
  input.value = document.querySelector('svg').innerHTML;
});
