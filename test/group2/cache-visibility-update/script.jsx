let o = karas.render(
  <canvas width="360" height="360">
    <div style={{background:'#F00',padding:10,height:50}}>
      <span cacheAsBitmap={1} ref="span" style={{display:'inlineBlock',rotate:45,padding:10,visibility:'hidden'}}>123</span>
    </div>
  </canvas>,
  '#test'
);
o.ref.span.updateStyle({
  visibility: 'visible',
}, function() {
  let canvas = document.querySelector('canvas');
  let input = document.querySelector('#base64');
  input.value = canvas.toDataURL();
});
