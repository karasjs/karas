let root = karas.render(
  <canvas width="360" height="360">
    <div style={{
      fontSize: 60,
      textStrokeColor: '#F00',
      textStrokeWidth: 1,
    }}>
      <span cacheAsBitmap={true}>a</span>
      <span>b</span>
    </div>
  </canvas>,
  '#test'
);
root.children[0].updateStyle({
  textStrokeWidth: 5,
}, function() {
  let canvas = document.querySelector('canvas');
  let input = document.querySelector('#base64');
  input.value = canvas.toDataURL();
});
