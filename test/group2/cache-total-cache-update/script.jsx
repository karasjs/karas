let o = karas.render(
  <canvas width="360" height="360" cache={true}>
    <div cacheAsBitmap={1} style={{position:'absolute',background:'#F00'}} ref="div">
      <span style={{display:'inlineBlock'}} ref="span">123</span>
    </div>
  </canvas>,
  '#test'
);

o.ref.span.updateStyle({
  opacity: 0.5,
  rotate: 90,
}, function() {
  let input = document.querySelector('input');
  input.value = document.querySelector('canvas').toDataURL();
});
