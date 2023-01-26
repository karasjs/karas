let root = karas.render(
  <canvas width={360} height={360}>
    <div ref="div1" style={{
      width: 100,
      height: 100,
      background: '#F00',
    }}/>
    <div ref="div1" style={{
      width: 100,
      height: 100,
      background: '#00F',
    }}/>
  </canvas>
);
root.children[0].remove();
root.once('refresh', function() {
  let input = document.querySelector('#base64');
  let canvas = document.querySelector('canvas');
  input.value = canvas.toDataURL();
});
root.appendTo('#test');
