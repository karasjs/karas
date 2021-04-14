let o = karas.render(
  <canvas width="360" height="360" cache={true}>
    <div style={{background:'#F00',padding:2}} ref="div">
      <span style={{background:'#00F'}}>123</span>
    </div>
  </canvas>,
  '#test'
);

o.ref.div.updateStyle({
  opacity: 0.5,
}, function() {
  let input = document.querySelector('input');
  input.value = document.querySelector('canvas').toDataURL();
});
