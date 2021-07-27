let o = karas.render(
  <canvas width="360" height="360" cache={true}>
    <div style={{position:'absolute',background:'#F00'}} ref="div">123</div>
  </canvas>,
  '#test'
);

o.ref.div.updateStyle({
  background: '#00F',
}, function() {
  let input = document.querySelector('input');
  input.value = document.querySelector('canvas').toDataURL();
});
