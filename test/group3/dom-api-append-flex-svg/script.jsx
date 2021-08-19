let root = karas.render(
  <svg width="360" height="360">
    <div style={{display:'flex'}}/>
  </svg>,
  '#test'
);
let span = <span style={{flex:1}}>2</span>;
root.children[0].appendChild(span, function() {
  let span = <span style={{flex:2}}>3</span>;
  root.children[0].appendChild(span, function() {
    let input = document.querySelector('input');
    input.value = document.querySelector('svg').innerHTML;
  });
});
