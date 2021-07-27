let o = karas.render(
  <canvas width="360" height="360" cache={true}>
    <div style={{position:'absolute',margin:50,background:'#F00',padding:10}} ref="div">
      <span style={{display:'inlineBlock',rotate:45,padding:10,background:'#00F'}}>123</span>
    </div>
  </canvas>,
  '#test'
);

o.ref.div.updateStyle({
  rotate: 45,
}, function() {
  let input = document.querySelector('input');
  input.value = document.querySelector('canvas').toDataURL();
});

