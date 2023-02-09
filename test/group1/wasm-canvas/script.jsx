karas.wasm.init('../../../karas_bg.wasm', function() {
  karas.render(
    <canvas width="360" height="360">
      <div style={{
        width: 50,
        height: 50,
        background: '#F00',
        translateX: 50,
      }}/>
    </canvas>,
    '#test'
  );
  let input = document.querySelector('#base64');
  input.value = document.querySelector('canvas').toDataURL();
});
