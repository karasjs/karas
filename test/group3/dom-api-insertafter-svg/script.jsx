let root = karas.render(
  <svg width="360" height="360">
    <span ref="span1">1</span>
    <span ref="span2">2</span>
  </svg>,
  '#test'
);
let div = <div style={{
  width:100,height:100,background:'#F00'
}}>3</div>;
let div2 = <div style={{
  width:100,height:100,background:'#F00'
}}>3</div>;
root.ref.span1.insertAfter(div);
root.ref.span2.insertAfter(div2, function() {
  let input = document.querySelector('input');
  input.value = document.querySelector('svg').innerHTML;
});
