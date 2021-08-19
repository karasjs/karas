let root = karas.render(
  <svg width="360" height="360">
    <span>1</span>
  </svg>,
  '#test'
);
let geom = <$circle style={{
  display:'inlineBlock',width:100,height:100,
}}/>;
root.prependChild(geom, function() {
  let input = document.querySelector('input');
  input.value = document.querySelector('svg').innerHTML;
});
