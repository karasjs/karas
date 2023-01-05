let root = karas.render(
  <canvas width="360" height="360">
    <div ref="div1" style={{
      width: 100,
      height: 100,
      background: '#F00',
    }}/>
    <div ref="div2" style={{
      width: 100,
      height: 100,
      background: '#F00',
    }}/>
  </canvas>,
  '#test'
);
root.on('refresh', function() {
  let canvas = document.querySelector('canvas');
  let input = document.querySelector('#base64');
  input.value = canvas.toDataURL();
});
root.freeze();
root.ref.div1.updateStyle({
  background: '#00F',
});
root.ref.div2.updateStyle({
  translateX: 10,
});
setTimeout(function() {
  root.unFreeze();
  root.draw();
}, 60);
