let root = karas.render(
  <svg width="360" height="360">
    <span>1</span>
  </svg>,
  '#test'
);
let div = <div style={{
  width:100,height:100,background:'#F00'
}}>2</div>;
root.prependChild(div, function() {
  let input = document.querySelector('input');
  input.value = document.querySelector('svg').innerHTML;
});
