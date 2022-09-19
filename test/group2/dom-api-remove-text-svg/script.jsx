let root = karas.render(
  <svg width="360" height="360">
    <div ref="div" style={{width:100,height:100,background:'#F00'}}>1</div>
    <div>2</div>
  </svg>,
  '#test'
);
root.ref.div.removeChild(root.ref.div.children[0], function() {
  let input = document.querySelector('input');
  input.value = document.querySelector('svg').innerHTML;
});
