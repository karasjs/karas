let o = karas.render(
  <canvas width="360" height="360">
    <$line cacheAsBitmap={1} ref="t" style={{width:100,height:100,background:'#F00'}}/>
  </canvas>,
  '#test'
);

o.ref.t.updateStyle({
  translateX: 100,
}, function() {
  let input = document.querySelector('input');
  input.value = document.querySelector('canvas').toDataURL();
});
