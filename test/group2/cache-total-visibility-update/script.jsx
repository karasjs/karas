let o = karas.render(
  <canvas width="360" height="360">
    <div cacheAsBitmap={1} style={{position:'relative',background:'#F00',padding:10,height:50}}>
      <span ref="span" style={{display:'inlineBlock',position:'absolute',rotate:45,padding:10,visibility:'hidden'}}>123</span>
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
