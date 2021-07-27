let o = karas.render(
  <canvas width="360" height="360">
    <div ref="div" style={{visibility:'hidden'}}>1<span>2</span></div>
  </canvas>,
  '#test'
);
o.ref.div.updateStyle({
  visibility: 'visible',
}, function() {
  let canvas = document.querySelector('canvas');
  let input = document.querySelector('#base64');
  input.value = canvas.toDataURL();
});
