let root = karas.render(
  <svg width="360" height="360">
    <div>1</div>
  </svg>,
  '#test'
);
let span = <span>2</span>;
root.appendChild(span, function() {
  let span = <span>3</span>;
  root.appendChild(span, function() {
    let span = <span>4</span>;
    root.children[0].appendChild(span, function() {
      let input = document.querySelector('input');
      input.value = document.querySelector('svg').innerHTML;
    });
  });
});
